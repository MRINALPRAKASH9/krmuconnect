
import { Link, useLocation } from "react-router-dom";
import { ThemeToggle } from "@/components/ui/theme-toggle";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import { Home, Users, MessageSquare, LogIn } from "lucide-react";
import { useAuth } from "@/components/auth/AuthProvider";

export function Navbar() {
  const location = useLocation();
  const { user, signOut } = useAuth();
  
  return (
    <header className="sticky top-0 z-50 w-full border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
      <div className="container flex h-14 items-center justify-between">
        <Link to="/" className="font-bold text-xl text-primary">
          KRMU CONNECT
        </Link>
        
        <div className="flex items-center gap-1 md:gap-2">
          {user ? (
            <>
              <Link to="/">
                <Button 
                  variant={location.pathname === "/" ? "default" : "ghost"} 
                  size="sm"
                  className="hidden md:flex"
                >
                  Discover
                </Button>
                <Button
                  variant={location.pathname === "/" ? "default" : "ghost"}
                  size="icon"
                  className="md:hidden"
                >
                  <Home className="h-5 w-5" />
                </Button>
              </Link>
              
              <Link to="/matches">
                <Button 
                  variant={location.pathname === "/matches" ? "default" : "ghost"} 
                  size="sm"
                  className="hidden md:flex"
                >
                  Matches
                </Button>
                <Button
                  variant={location.pathname === "/matches" ? "default" : "ghost"}
                  size="icon"
                  className="md:hidden"
                >
                  <Users className="h-5 w-5" />
                </Button>
              </Link>
              
              <Link to="/chat">
                <Button 
                  variant={location.pathname === "/chat" ? "default" : "ghost"} 
                  size="sm"
                  className="hidden md:flex"
                >
                  Chat
                </Button>
                <Button
                  variant={location.pathname === "/chat" ? "default" : "ghost"}
                  size="icon"
                  className="md:hidden"
                >
                  <MessageSquare className="h-5 w-5" />
                </Button>
              </Link>
              
              <ThemeToggle />
              
              <Link to="/profile">
                <Avatar className="h-8 w-8">
                  <AvatarImage src={user.user_metadata?.avatar_url || "https://github.com/shadcn.png"} alt="User" />
                  <AvatarFallback>{user.email?.[0].toUpperCase()}</AvatarFallback>
                </Avatar>
              </Link>

              <Button variant="destructive" size="sm" onClick={signOut}>
                Logout
              </Button>
            </>
          ) : (
            <>
              <Link to="/auth">
                <Button variant="ghost" size="sm" className="hidden md:flex">
                  Login
                </Button>
                <Button variant="ghost" size="icon" className="md:hidden">
                  <LogIn className="h-5 w-5" />
                </Button>
              </Link>
              <ThemeToggle />
            </>
          )}
        </div>
      </div>
    </header>
  );
}
