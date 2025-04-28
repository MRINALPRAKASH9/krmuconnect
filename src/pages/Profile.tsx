import { Navbar } from "@/components/navbar";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Link } from "react-router-dom";
import { useAuth } from "@/components/auth/AuthProvider";

export default function Profile() {
  const { user } = useAuth();

  if (!user) {
    return (
      <div className="min-h-screen bg-background">
        <main className="container py-6">
          <div className="text-center">
            <h1 className="text-2xl font-bold mb-4">Please sign in to view your profile</h1>
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
        <div className="flex flex-col gap-6 items-center">
          <div className="text-center">
            <Avatar className="w-24 h-24 mx-auto">
              <AvatarImage src={user.user_metadata?.avatar_url || "https://github.com/shadcn.png"} alt="Profile" />
              <AvatarFallback>{user.email?.[0].toUpperCase()}</AvatarFallback>
            </Avatar>
            <h1 className="mt-4 text-2xl font-bold">{user.user_metadata?.display_name || "KRMU User"}</h1>
            <p className="text-muted-foreground">@{user.user_metadata?.username}</p>
            <p className="text-muted-foreground">Year {user.user_metadata?.study_year} - {user.user_metadata?.course}</p>
          </div>

          <div className="w-full max-w-md">
            <div className="grid grid-cols-3 gap-4 text-center mb-6">
              <div>
                <p className="text-2xl font-bold">42</p>
                <p className="text-muted-foreground">Memes Liked</p>
              </div>
              <div>
                <p className="text-2xl font-bold text-primary">7</p>
                <p className="text-muted-foreground">Matches</p>
              </div>
              <div>
                <p className="text-2xl font-bold">128</p>
                <p className="text-muted-foreground">Memes Viewed</p>
              </div>
            </div>
          </div>

          <div className="w-full max-w-md mt-4">
            <Link to="/">
              <Button className="w-full">Back to Meme Discovery</Button>
            </Link>
          </div>
        </div>
      </main>
    </div>
  );
}