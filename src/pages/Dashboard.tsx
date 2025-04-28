import { useState } from "react";
import { MemeCard } from "@/components/meme-card";
import { Navbar } from "@/components/navbar";
import { Link } from "react-router-dom";
import { useAuth } from "@/components/auth/AuthProvider";
import { Button } from "@/components/ui/button";
import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { UploadModal } from "@/components/upload-modal";

export default function Dashboard() {
  const { user, loading } = useAuth();
  const [currentIndex, setCurrentIndex] = useState(0);
  const [matches, setMatches] = useState<string[]>([]);
  const [likedMemes, setLikedMemes] = useState<string[]>([]);
  const [matchNotification, setMatchNotification] = useState<boolean>(false);

  const { data: memes = [], refetch: refetchMemes } = useQuery({
    queryKey: ['memes'],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('memes')
        .select('*')
        .order('created_at', { ascending: false });
      
      if (error) throw error;
      return data || [];
    }
  });

  const handleSwipe = (id: string, liked: boolean) => {
    if (liked) {
      setLikedMemes((prev) => [...prev, id]);
      
      if (Math.random() < 0.3) {
        setMatches((prev) => [...prev, id]);
        setMatchNotification(true);
        
        setTimeout(() => {
          setMatchNotification(false);
        }, 3000);
      }
    }
    
    setTimeout(() => {
      setCurrentIndex((prev) => (prev + 1) % memes.length);
    }, 100);
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <p>Loading...</p>
      </div>
    );
  }

  if (!user) {
    return (
      <div className="min-h-screen bg-background">
        <Navbar />
        <div className="container py-6 text-center">
          <h1 className="text-2xl font-bold mb-4">Welcome to KRMU CONNECT</h1>
          <p className="mb-6">Please sign in to discover memes and connect with others.</p>
          <Link to="/auth">
            <Button>Sign In</Button>
          </Link>
        </div>
      </div>
    );
  }

  const currentMeme = memes[currentIndex];

  return (
    <div className="min-h-screen bg-background">
      <Navbar />
      <main className="container py-6">
        <div className="flex flex-col gap-6">
          <div className="flex justify-between items-center">
            <h1 className="text-2xl font-bold">Discover</h1>
            <div className="flex items-center gap-4">
              <UploadModal onUploadComplete={refetchMemes} />
              <Link to="/matches" className="text-primary hover:underline">
                {matches.length} matches
              </Link>
            </div>
          </div>
          
          {currentMeme && (
            <div className="py-8 flex justify-center">
              <MemeCard
                key={currentMeme.id}
                id={currentMeme.id}
                imageUrl={currentMeme.image_url}
                title={currentMeme.title}
                onSwipe={handleSwipe}
              />
            </div>
          )}
          
          <div className="text-center text-muted-foreground text-sm">
            <p>Swipe right to like, left to skip</p>
            <p className="mt-2">Find people who share your meme taste!</p>
          </div>

          {matchNotification && (
            <div className="fixed bottom-6 right-6 bg-primary text-primary-foreground p-4 rounded-lg shadow-lg animate-fade-in">
              <p className="font-bold">New Match!</p>
              <p>Someone also liked this meme</p>
              <Link to="/matches" className="mt-2 block text-sm underline">
                View all matches
              </Link>
            </div>
          )}
          
          <div className="mt-8">
            <h2 className="text-xl font-bold mb-4">Stats</h2>
            <div className="grid grid-cols-2 gap-4">
              <div className="bg-card p-4 rounded-lg">
                <p className="text-xl font-bold">{likedMemes.length}</p>
                <p className="text-muted-foreground">Memes Liked</p>
              </div>
              <div className="bg-card p-4 rounded-lg">
                <p className="text-xl font-bold">{currentIndex}</p>
                <p className="text-muted-foreground">Memes Viewed</p>
              </div>
            </div>
          </div>
        </div>
      </main>
    </div>
  );
}
