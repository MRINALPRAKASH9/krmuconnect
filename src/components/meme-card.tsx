
import { useState } from "react";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Heart, X } from "lucide-react";

interface MemeCardProps {
  id: number;
  imageUrl: string;
  title: string;
  onSwipe: (id: number, liked: boolean) => void;
}

export function MemeCard({ id, imageUrl, title, onSwipe }: MemeCardProps) {
  const [swipeDirection, setSwipeDirection] = useState<string | null>(null);
  
  // Track touch/mouse position for swipe
  const [touchStart, setTouchStart] = useState({ x: 0, y: 0 });
  const [touchEnd, setTouchEnd] = useState({ x: 0, y: 0 });
  
  const handleTouchStart = (e: React.TouchEvent | React.MouseEvent) => {
    const clientX = 'touches' in e ? e.touches[0].clientX : (e as React.MouseEvent).clientX;
    const clientY = 'touches' in e ? e.touches[0].clientY : (e as React.MouseEvent).clientY;
    setTouchStart({ x: clientX, y: clientY });
    setTouchEnd({ x: clientX, y: clientY });
  };
  
  const handleTouchMove = (e: React.TouchEvent | React.MouseEvent) => {
    const clientX = 'touches' in e ? e.touches[0].clientX : (e as React.MouseEvent).clientX;
    const clientY = 'touches' in e ? e.touches[0].clientY : (e as React.MouseEvent).clientY;
    setTouchEnd({ x: clientX, y: clientY });
  };
  
  const handleTouchEnd = () => {
    const deltaX = touchEnd.x - touchStart.x;
    
    // If swipe distance is significant
    if (Math.abs(deltaX) > 100) {
      const isLiked = deltaX > 0;
      setSwipeDirection(isLiked ? "swipe-right" : "swipe-left");
      
      // After animation completes, notify parent
      setTimeout(() => {
        onSwipe(id, isLiked);
      }, 500);
    }
  };

  const handleLike = () => {
    setSwipeDirection("swipe-right");
    setTimeout(() => {
      onSwipe(id, true);
    }, 500);
  };

  const handleDislike = () => {
    setSwipeDirection("swipe-left");
    setTimeout(() => {
      onSwipe(id, false);
    }, 500);
  };
  
  return (
    <Card 
      className={`w-full max-w-md mx-auto overflow-hidden transition-all ${swipeDirection || ""}`}
      onTouchStart={handleTouchStart}
      onTouchMove={handleTouchMove}
      onTouchEnd={handleTouchEnd}
      onMouseDown={handleTouchStart}
      onMouseMove={handleTouchMove}
      onMouseUp={handleTouchEnd}
    >
      <CardContent className="p-0">
        <div className="relative aspect-square">
          <img
            src={imageUrl}
            alt={title}
            className="w-full h-full object-cover"
            loading="eager"
            onError={(e) => {
              console.error("Image failed to load:", imageUrl);
              e.currentTarget.src = "https://source.unsplash.com/random/?meme";
            }}
          />
          <div className="absolute bottom-0 left-0 right-0 p-4 bg-gradient-to-t from-black/70 to-transparent">
            <h3 className="text-white font-medium">{title}</h3>
          </div>
        </div>
        <div className="flex justify-between p-4">
          <Button onClick={handleDislike} variant="outline" size="icon" className="rounded-full border-red-500 text-red-500 hover:bg-red-100 hover:text-red-600">
            <X className="h-6 w-6" />
          </Button>
          <Button onClick={handleLike} variant="outline" size="icon" className="rounded-full border-green-500 text-green-500 hover:bg-green-100 hover:text-green-600">
            <Heart className="h-6 w-6" />
          </Button>
        </div>
      </CardContent>
    </Card>
  );
}
