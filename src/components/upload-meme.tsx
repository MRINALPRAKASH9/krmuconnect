
import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Upload } from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import { supabase } from "@/integrations/supabase/client";
import { useAuth } from "@/components/auth/AuthProvider";

export function UploadMeme({ onUploadComplete }: { onUploadComplete: () => void }) {
  const [uploading, setUploading] = useState(false);
  const [title, setTitle] = useState("");
  const { toast } = useToast();
  const { user } = useAuth();

  const handleFileUpload = async (event: React.ChangeEvent<HTMLInputElement>) => {
    try {
      if (!event.target.files || !event.target.files[0]) {
        return;
      }

      if (!user) {
        toast({
          title: "Authentication required",
          description: "Please sign in to upload memes",
          variant: "destructive",
        });
        return;
      }

      const file = event.target.files[0];
      const fileExt = file.name.split('.').pop();
      const fileName = `${Math.random()}.${fileExt}`;
      const filePath = `${fileName}`;

      setUploading(true);

      // Upload image to storage bucket
      const { error: uploadError, data } = await supabase.storage
        .from('memes')
        .upload(filePath, file);

      if (uploadError) {
        throw uploadError;
      }

      // Get public URL
      const { data: { publicUrl } } = supabase.storage
        .from('memes')
        .getPublicUrl(filePath);

      // Save meme info to database
      const { error: dbError } = await supabase
        .from('memes')
        .insert({
          title: title || file.name,
          image_url: publicUrl,
          user_id: user.id
        });

      if (dbError) {
        throw dbError;
      }

      toast({
        title: "Success!",
        description: "Your meme has been uploaded",
      });

      setTitle("");
      onUploadComplete();
    } catch (error) {
      console.error('Error uploading meme:', error);
      toast({
        title: "Upload failed",
        description: "There was an error uploading your meme",
        variant: "destructive",
      });
    } finally {
      setUploading(false);
    }
  };

  return (
    <div className="space-y-4 p-4 bg-card rounded-lg border">
      <h3 className="font-semibold">Share Your Meme</h3>
      <Input
        type="text"
        placeholder="Meme title (optional)"
        value={title}
        onChange={(e) => setTitle(e.target.value)}
        className="mb-2"
      />
      <div className="flex items-center gap-2">
        <Input
          type="file"
          accept="image/*"
          onChange={handleFileUpload}
          disabled={uploading}
          className="hidden"
          id="meme-upload"
        />
        <label htmlFor="meme-upload" className="flex-1">
          <Button
            variant="outline"
            className="w-full"
            disabled={uploading}
            asChild
          >
            <span>
              <Upload className="mr-2 h-4 w-4" />
              {uploading ? "Uploading..." : "Choose File"}
            </span>
          </Button>
        </label>
      </div>
    </div>
  );
}
