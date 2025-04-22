
import { Navbar } from "@/components/navbar";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";

export default function Matches() {
  return (
    <div className="min-h-screen bg-background">
      <Navbar />
      <main className="container py-6">
        <div className="flex flex-col gap-6">
          <h1 className="text-2xl font-bold">Your Meme Matches</h1>
          <p className="text-muted-foreground">
            These users share your sense of humor - connect based on the memes you both liked!
          </p>
          
          <div className="grid gap-6 md:grid-cols-2">
            {[1, 2, 3, 4, 5].map((i) => (
              <Card key={i}>
                <CardContent className="p-4">
                  <div className="flex items-center gap-4">
                    <Avatar className="h-16 w-16">
                      <AvatarImage src={`https://source.unsplash.com/random/150x150?face${i+10}`} alt="User" />
                      <AvatarFallback>U{i}</AvatarFallback>
                    </Avatar>
                    <div className="flex-1">
                      <div className="flex items-center gap-2">
                        <h3 className="font-medium">KRMU Student {i}</h3>
                        <Badge variant="secondary" className="text-xs">
                          {90-i*5}% Match
                        </Badge>
                      </div>
                      <p className="text-sm text-muted-foreground">
                        Shared interests: Programming, Campus Life
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
