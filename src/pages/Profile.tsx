
import { Navbar } from "@/components/navbar";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Link } from "react-router-dom";

export default function Profile() {
  return (
    <div className="min-h-screen bg-background">
      <Navbar />
      <main className="container py-6">
        <div className="flex flex-col gap-6 items-center">
          <div className="text-center">
            <Avatar className="w-24 h-24 mx-auto">
              <AvatarImage src="https://github.com/shadcn.png" alt="Profile" />
              <AvatarFallback>KU</AvatarFallback>
            </Avatar>
            <h1 className="mt-4 text-2xl font-bold">KRMU User</h1>
            <p className="text-muted-foreground">Computer Science</p>
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

          <div className="w-full max-w-md">
            <h2 className="text-xl font-semibold mb-4">Your Matches</h2>
            <div className="space-y-4">
              {[1, 2, 3].map((i) => (
                <Card key={i}>
                  <CardContent className="p-4">
                    <div className="flex items-center gap-4">
                      <Avatar>
                        <AvatarImage src={`https://source.unsplash.com/random/150x150?face${i}`} alt="Match" />
                        <AvatarFallback>M{i}</AvatarFallback>
                      </Avatar>
                      <div className="flex-1">
                        <h3 className="font-medium">KRMU Student {i}</h3>
                        <p className="text-sm text-muted-foreground">5 shared meme interests</p>
                      </div>
                      <Button size="sm" variant="outline">Message</Button>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          </div>

          <div className="w-full max-w-md mt-4">
            <h2 className="text-xl font-semibold mb-4">Your Top Meme Categories</h2>
            <div className="flex flex-wrap gap-2">
              <Button variant="secondary" size="sm">College Life</Button>
              <Button variant="secondary" size="sm">Programming</Button>
              <Button variant="secondary" size="sm">KRMU Inside Jokes</Button>
              <Button variant="secondary" size="sm">Exams</Button>
              <Button variant="secondary" size="sm">Professors</Button>
            </div>
          </div>

          <div className="w-full max-w-md mt-8">
            <Link to="/">
              <Button className="w-full">Back to Meme Discovery</Button>
            </Link>
          </div>
        </div>
      </main>
    </div>
  );
}
