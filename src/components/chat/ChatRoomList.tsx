
import { useEffect, useState } from "react";
import { supabase } from "@/integrations/supabase/client";
import { Button } from "@/components/ui/button";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { useAuth } from "@/components/auth/AuthProvider";
import { Plus } from "lucide-react";

interface ChatRoom {
  id: string;
  name: string;
  created_at: string;
}

export function ChatRoomList({ onSelectRoom }: { onSelectRoom: (roomId: string) => void }) {
  const [rooms, setRooms] = useState<ChatRoom[]>([]);
  const [newRoomName, setNewRoomName] = useState("");
  const { user } = useAuth();

  useEffect(() => {
    // Fetch initial rooms
    const fetchRooms = async () => {
      const { data } = await supabase
        .from("chat_rooms")
        .select("*")
        .order("created_at", { ascending: true });
      
      if (data) setRooms(data);
    };

    fetchRooms();

    // Subscribe to new rooms
    const channel = supabase
      .channel("room-changes")
      .on(
        "postgres_changes",
        {
          event: "INSERT",
          schema: "public",
          table: "chat_rooms",
        },
        (payload) => {
          setRooms((current) => [...current, payload.new as ChatRoom]);
        }
      )
      .subscribe();

    return () => {
      supabase.removeChannel(channel);
    };
  }, []);

  const createRoom = async () => {
    if (!newRoomName.trim() || !user) return;

    await supabase.from("chat_rooms").insert({
      name: newRoomName,
      created_by: user.id,
    });

    setNewRoomName("");
  };

  return (
    <div className="w-64 bg-card rounded-lg border p-4">
      <div className="flex items-center justify-between mb-4">
        <h2 className="text-lg font-semibold">Chat Rooms</h2>
        <Dialog>
          <DialogTrigger asChild>
            <Button variant="ghost" size="icon">
              <Plus className="h-4 w-4" />
            </Button>
          </DialogTrigger>
          <DialogContent>
            <DialogHeader>
              <DialogTitle>Create New Chat Room</DialogTitle>
            </DialogHeader>
            <div className="flex gap-2">
              <Input
                value={newRoomName}
                onChange={(e) => setNewRoomName(e.target.value)}
                placeholder="Room name..."
              />
              <Button onClick={createRoom}>Create</Button>
            </div>
          </DialogContent>
        </Dialog>
      </div>
      <ScrollArea className="h-[500px]">
        {rooms.map((room) => (
          <Button
            key={room.id}
            variant="ghost"
            className="w-full justify-start mb-1"
            onClick={() => onSelectRoom(room.id)}
          >
            {room.name}
          </Button>
        ))}
      </ScrollArea>
    </div>
  );
}
