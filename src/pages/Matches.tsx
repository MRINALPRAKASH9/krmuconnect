
import { Navbar } from "@/components/navbar";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { useAuth } from "@/components/auth/AuthProvider";
import { Link } from "react-router-dom";

type MockMatch = {
  id: number;
  display_name: string;
  username: string;
  study_year: number;
  course: string;
  match_percentage: number;
  avatar_url: string;
};

const mockMatches: MockMatch[] = [
  {
    id: 1,
    display_name: "John Doe",
    username: "john_memer",
    study_year: 2,
    course: "Computer Science",
    match_percentage: 90,
    avatar_url: "https://source.unsplash.com/random/150x150?face1"
  },
  {
    id: 2,
    display_name: "Jane Smith",
    username: "jane_memequeen",
    study_year: 3,
    course: "Digital Arts",
    match_percentage: 85,
    avatar_url: "https://source.unsplash.com/random/150x150?face2"
  },
  {
    id: 3,
    display_name: "Alex Johnson",
    username: "meme_master",
    study_year: 1,
    course: "Engineering",
    match_percentage: 80,
    avatar_url: "https://source.unsplash.com/random/150x150?face3"
  }
];

export default function Matches() {
  const { user } = useAuth();

  if (!user) {
    return (
      <div className="min-h-screen bg-background">
        <main className="container py-6">
          <div className="text-center">
            <h1 className="text-2xl font-bold mb-4">Please sign in to view your matches</h1>
            <Link to="/auth">
              <Button>Sign In</Button>
            </Link>
          </div>
        </main>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background">
      <main className="container py-6">
        <div className="flex flex-col gap-6">
          <h1 className="text-2xl font-bold">Your Meme Matches</h1>
          <p className="text-muted-foreground">
            These users share your sense of humor - connect based on the memes you both liked!
          </p>
          
          <div className="grid gap-6 md:grid-cols-2">
            {mockMatches.map((match) => (
              <Card key={match.id}>
                <CardContent className="p-4">
                  <div className="flex items-center gap-4">
                    <Avatar className="h-16 w-16">
                      <AvatarImage src={match.avatar_url} alt={match.display_name} />
                      <AvatarFallback>{match.display_name[0]}</AvatarFallback>
                    </Avatar>
                    <div className="flex-1">
                      <div className="flex items-center gap-2">
                        <h3 className="font-medium">{match.display_name}</h3>
                        <Badge variant="secondary" className="text-xs">
                          {match.match_percentage}% Match
                        </Badge>
                      </div>
                      <p className="text-sm text-muted-foreground">@{match.username}</p>
                      <p className="text-sm text-muted-foreground">
                        Year {match.study_year} - {match.course}
                      </p>
                      <div className="flex gap-2 mt-2">
                        <Button size="sm" variant="default">Connect</Button>
                        <Button size="sm" variant="outline">View Profile</Button>
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </main>
    </div>
  );
}
