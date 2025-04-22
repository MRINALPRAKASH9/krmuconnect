
import { useState } from 'react';
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { useAuth } from "@/components/auth/AuthProvider";
import { toast } from "sonner";
import { useNavigate } from 'react-router-dom';
import { supabase } from "@/integrations/supabase/client";
import { MicrosoftLogo } from 'lucide-react';

export default function Auth() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [isSignUp, setIsSignUp] = useState(false);
  const { signInWithMicrosoft } = useAuth();
  const navigate = useNavigate();

  const handleEmailSignUp = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      const { error } = await supabase.auth.signUp({
        email,
        password,
        options: {
          data: {
            preferred_username: email.split('@')[0]
          }
        }
      });

      if (error) throw error;
      toast.success('Sign up successful! Check your email for confirmation.');
      navigate('/');
    } catch (error: any) {
      toast.error(error.message || 'Sign up failed');
    }
  };

  const handleEmailSignIn = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      const { error } = await supabase.auth.signInWithPassword({
        email,
        password
      });

      if (error) throw error;
      navigate('/');
    } catch (error: any) {
      toast.error(error.message || 'Sign in failed');
    }
  };

  const handleMicrosoftSignIn = async () => {
    try {
      await signInWithMicrosoft();
      navigate('/');
    } catch (error: any) {
      toast.error(error.message || 'Microsoft sign in failed');
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-background">
      <div className="w-full max-w-md p-8 space-y-6 bg-card rounded-lg shadow-md">
        <h2 className="text-2xl font-bold text-center">
          {isSignUp ? 'Sign Up' : 'Sign In'}
        </h2>
        
        <form onSubmit={isSignUp ? handleEmailSignUp : handleEmailSignIn} className="space-y-4">
          <Input 
            type="email" 
            placeholder="Email" 
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            required 
          />
          <Input 
            type="password" 
            placeholder="Password" 
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            required 
          />
          <Button type="submit" className="w-full">
            {isSignUp ? 'Sign Up' : 'Sign In'}
          </Button>
        </form>

        <div className="flex items-center justify-center">
          <Button 
            variant="outline" 
            className="w-full" 
            onClick={handleMicrosoftSignIn}
          >
            <MicrosoftLogo className="mr-2 h-5 w-5" />
            Sign in with Microsoft
          </Button>
        </div>

        <p className="text-center text-sm text-muted-foreground">
          {isSignUp 
            ? 'Already have an account? ' 
            : 'Don\'t have an account? '}
          <button 
            onClick={() => setIsSignUp(!isSignUp)} 
            className="text-primary hover:underline"
          >
            {isSignUp ? 'Sign In' : 'Sign Up'}
          </button>
        </p>
      </div>
    </div>
  );
}
