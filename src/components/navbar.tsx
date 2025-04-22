
import { Link, useLocation } from "react-router-dom";
import { ThemeToggle } from "@/components/ui/theme-toggle";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import { Home, Users } from "lucide-react";

export function Navbar() {
  const location = useLocation();
  
  return (
    <header className="sticky top-0 z-50 w-full border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
      <div className="container flex h-14 items-center justify-between">
        <Link to="/" className="font-bold text-xl text-primary">
          KRMU CONNECT
        </Link>
        
        <div className="flex items-center gap-1 md:gap-2">
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
          
          <ThemeToggle />
          
          <Link to="/profile">
            <Avatar className="h-8 w-8">
              <AvatarImage src="https://github.com/shadcn.png" alt="User" />
              <AvatarFallback>U</AvatarFallback>
            </Avatar>
          </Link>
        </div>
      </div>
    </header>
  );
}
