
import { useState } from "react";
import { MemeCard } from "@/components/meme-card";
import { Navbar } from "@/components/navbar";
import { Link } from "react-router-dom";

// Sample meme data
const sampleMemes = [
  {
    id: 1,
    imageUrl: "https://source.unsplash.com/photo-1486312338219-ce68d2c6f44d",
    title: "When the professor says the exam will be easy",
  },
  {
    id: 2,
    imageUrl: "https://source.unsplash.com/photo-1488590528505-98d2b5aba04b",
    title: "KRMU life in one picture",
  },
  {
    id: 3,
    imageUrl: "https://source.unsplash.com/photo-1461749280684-dccba630e2f6",
    title: "Programming students be like",
  },
  {
    id: 4,
    imageUrl: "https://source.unsplash.com/photo-1531297484001-80022131f5a1",
    title: "Finals week energy",
  },
  {
    id: 5,
    imageUrl: "https://source.unsplash.com/photo-1498050108023-c5249f4df085",
    title: "Campus food experience",
  },
  {
    id: 6,
    imageUrl: "https://source.unsplash.com/photo-1460925895917-afdab827c52f",
    title: "Group project expectations vs reality",
  },
];

export default function Dashboard() {
  const [memes, setMemes] = useState(sampleMemes);
  const [currentIndex, setCurrentIndex] = useState(0);
  const [matches, setMatches] = useState<number[]>([]);
  const [likedMemes, setLikedMemes] = useState<number[]>([]);
  const [matchNotification, setMatchNotification] = useState<boolean>(false);

  const handleSwipe = (id: number, liked: boolean) => {
    if (liked) {
      // Add to matches (simulating a match with 30% probability)
      setLikedMemes((prev) => [...prev, id]);
      
      if (Math.random() < 0.3) {
        setMatches((prev) => [...prev, id]);
        setMatchNotification(true);
        
        // Hide notification after 3 seconds
        setTimeout(() => {
          setMatchNotification(false);
        }, 3000);
      }
    }
    
    // Move to next meme
    setTimeout(() => {
      setCurrentIndex((prev) => (prev + 1) % memes.length);
    }, 100);
  };

  const currentMeme = memes[currentIndex];

  return (
    <div className="min-h-screen bg-background">
      <Navbar />
      <main className="container py-6">
        <div className="flex flex-col gap-6">
          <div className="flex justify-between items-center">
            <h1 className="text-2xl font-bold">KRMU CONNECT</h1>
            <Link to="/matches" className="text-primary hover:underline">
              {matches.length} matches
            </Link>
          </div>
          
          <div className="py-8 flex justify-center">
            <MemeCard
              key={currentMeme.id}
              id={currentMeme.id}
              imageUrl={currentMeme.imageUrl}
              title={currentMeme.title}
              onSwipe={handleSwipe}
            />
          </div>
          
          <div className="text-center text-muted-foreground text-sm">
            <p>Swipe right to like, left to skip</p>
            <p className="mt-2">Find people who share your meme taste!</p>
          </div>

          {matchNotification && (
            <div className="fixed bottom-6 right-6 bg-meme-primary text-white p-4 rounded-lg shadow-lg animate-fade-in">
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
