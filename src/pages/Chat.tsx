
import { useState } from "react";
import { ChatRoom } from "@/components/chat/ChatRoom";
import { ChatRoomList } from "@/components/chat/ChatRoomList";

export default function Chat() {
  const [selectedRoomId, setSelectedRoomId] = useState<string | null>(null);

  return (
    <div className="container py-6">
      <div className="flex gap-6">
        <ChatRoomList onSelectRoom={setSelectedRoomId} />
        {selectedRoomId ? (
          <div className="flex-1">
            <ChatRoom roomId={selectedRoomId} />
          </div>
        ) : (
          <div className="flex-1 flex items-center justify-center text-muted-foreground">
            Select a chat room to start messaging
          </div>
        )}
      </div>
    </div>
  );
}
