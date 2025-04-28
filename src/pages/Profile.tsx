import { useState, useEffect } from "react";
import { useNavigate, Link } from "react-router-dom";
import { useAuth } from "@/components/auth/AuthProvider";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { useToast } from "@/components/ui/use-toast";
import { supabase } from "@/integrations/supabase/client";

export default function Profile() {
  const { user } = useAuth();
  const navigate = useNavigate();
  const { toast } = useToast();
  const [isEditing, setIsEditing] = useState(false);
  const [formData, setFormData] = useState({
    displayName: user?.user_metadata?.display_name || "",
    userId: user?.user_metadata?.username || "",
    year: user?.user_metadata?.study_year || "",
    course: user?.user_metadata?.course || ""
  });
  const [lastUsernameUpdate, setLastUsernameUpdate] = useState<string | null>(null);

  useEffect(() => {
    if (user) {
      const fetchLastUpdate = async () => {
        const { data, error } = await supabase
          .from('profile_updates')
          .select('last_username_update')
          .eq('user_id', user.id)
          .single();

        if (!error && data) {
          setLastUsernameUpdate(data.last_username_update);
        }
      };
      fetchLastUpdate();
    }
  }, [user]);

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

  const canChangeUsername = () => {
    if (!lastUsernameUpdate) return true;
    const lastUpdate = new Date(lastUsernameUpdate);
    const daysSinceUpdate = Math.floor((Date.now() - lastUpdate.getTime()) / (1000 * 60 * 60 * 24));
    return daysSinceUpdate >= 20;
  };

  const handleSave = async () => {
    try {
      // Update user metadata through Supabase auth
      const { data: userUpdate, error: userError } = await supabase.auth.updateUser({
        data: {
          display_name: formData.displayName,
          username: formData.userId,
          study_year: formData.year,
          course: formData.course,
          updated_at: new Date().toISOString()
        }
      });

      if (userError) throw userError;

      // Update profile in profiles table
      const { error: profileError } = await supabase
        .from('profiles')
        .upsert({
          id: user.id,
          username: formData.userId,
          updated_at: new Date().toISOString()
        });

      if (profileError) throw profileError;

      // Update user metadata through Supabase auth
      const { data: { user: updatedUser }, error: metadataError } = await supabase.auth.updateUser({
        data: {
          display_name: formData.displayName,
          username: formData.userId,
          study_year: formData.year,
          course: formData.course
        }
      });

      if (metadataError) throw metadataError;

      // Show success message
      toast({
        title: "Success",
        description: "Profile updated successfully",
      });

      // Update local state
      if (updatedUser) {
        setFormData({
          displayName: updatedUser.user_metadata?.display_name || "",
          userId: updatedUser.user_metadata?.username || "",
          year: updatedUser.user_metadata?.study_year || "",
          course: updatedUser.user_metadata?.course || ""
        });
        setIsEditing(false);
      }
    } catch (error) {
      console.error('Error updating profile:', error);
      toast({
        title: "Error",
        description: "Failed to update profile. Please try again.",
        variant: "destructive"
      });
    }
  };

  return (
    <div className="min-h-screen bg-background">
      <main className="container py-6">
        <div className="flex flex-col gap-6 items-center">
          <div className="text-center">
            <Avatar className="w-24 h-24 mx-auto">
              <AvatarImage src={user.user_metadata?.avatar_url || "https://github.com/shadcn.png"} alt="Profile" />
              <AvatarFallback>{user.email?.[0].toUpperCase()}</AvatarFallback>
            </Avatar>
            {isEditing ? (
              <div className="mt-4 space-y-4 w-full max-w-sm">
                <Input
                  placeholder="Display Name"
                  value={formData.displayName}
                  onChange={(e) => setFormData(prev => ({ ...prev, displayName: e.target.value }))}
                />
                <Input
                  placeholder="User ID"
                  value={formData.userId}
                  onChange={(e) => setFormData(prev => ({ ...prev, userId: e.target.value }))}
                  disabled={!canChangeUsername()}
                />
                <Select
                  value={formData.year}
                  onValueChange={(value) => setFormData(prev => ({ ...prev, year: value }))}
                >
                  <SelectTrigger>
                    <SelectValue placeholder="Study Year" />
                  </SelectTrigger>
                  <SelectContent>
                    {[1, 2, 3, 4].map(year => (
                      <SelectItem key={year} value={year.toString()}>
                        Year {year}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
                <Input
                  placeholder="Course"
                  value={formData.course}
                  onChange={(e) => setFormData(prev => ({ ...prev, course: e.target.value }))}
                />
                <div className="flex gap-2 justify-center mt-4">
                  <Button onClick={handleSave}>Save</Button>
                  <Button variant="outline" onClick={() => setIsEditing(false)}>Cancel</Button>
                </div>
              </div>
            ) : (
              <>
                <h1 className="mt-4 text-2xl font-bold">{user.user_metadata?.display_name || "KRMU User"}</h1>
                <p className="text-muted-foreground">@{user.user_metadata?.username}</p>
                <p className="text-muted-foreground">Year {user.user_metadata?.study_year || 'N/A'} - {user.user_metadata?.course || 'N/A'}</p>
                <Button onClick={() => setIsEditing(true)} className="mt-4">Edit Profile</Button>
              </>
            )}
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