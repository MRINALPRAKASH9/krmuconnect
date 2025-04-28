
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog"
import { Plus } from "lucide-react"
import { Button } from "@/components/ui/button"
import { UploadMeme } from "./upload-meme"

export function UploadModal({ onUploadComplete }: { onUploadComplete: () => void }) {
  return (
    <Dialog>
      <DialogTrigger asChild>
        <Button variant="outline" size="icon" className="rounded-full">
          <Plus className="h-4 w-4" />
        </Button>
      </DialogTrigger>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Upload a Meme</DialogTitle>
        </DialogHeader>
        <UploadMeme onUploadComplete={onUploadComplete} />
      </DialogContent>
    </Dialog>
  )
}
