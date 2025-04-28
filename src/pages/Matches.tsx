
import { useEffect, useState } from "react";
import { useAuth } from "@/components/auth/AuthProvider";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Link } from "react-router-dom";
import { supabase } from "@/integrations/supabase/client";

type Match = {
  id: string;
  display_name: string;
  username: string;
  study_year: string;
  course: string;
  avatar_url: string;
  matched_on: string;
};

export default function Matches() {
  const { user } = useAuth();
  const [matches, setMatches] = useState<Match[]>([]);

  useEffect(() => {
    if (!user) return;

    const fetchMatches = async () => {
      const { data: matchData, error: matchError } = await supabase
        .from('matches')
        .select(`
          id,
          meme_id,
          user_id_2 (
            id,
            user_metadata->display_name,
            user_metadata->username,
            user_metadata->study_year,
            user_metadata->course,
            user_metadata->avatar_url
          )
        `)
        .eq('user_id_1', user.id);

      if (matchError) {
        console.error('Error fetching matches:', matchError);
        return;
      }

      const formattedMatches = matchData?.map(match => ({
        id: match.id,
        display_name: match.user_id_2.display_name,
        username: match.user_id_2.username,
        study_year: match.user_id_2.study_year,
        course: match.user_id_2.course,
        avatar_url: match.user_id_2.avatar_url,
        matched_on: match.created_at
      }));

      setMatches(formattedMatches || []);
    };

    fetchMatches();
  }, [user]);

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
            {matches.map((match) => (
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
                      </div>
                      <p className="text-sm text-muted-foreground">@{match.username}</p>
                      <p className="text-sm text-muted-foreground">
                        Year {match.study_year} - {match.course}
                      </p>
                      <div className="flex gap-2 mt-2">
                        <Link to={`/chat/${match.id}`}>
                          <Button size="sm" variant="default">Chat</Button>
                        </Link>
                        <Link to={`/profile/${match.username}`}>
                          <Button size="sm" variant="outline">View Profile</Button>
                        </Link>
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
