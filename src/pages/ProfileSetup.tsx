
import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { useAuth } from "@/components/auth/AuthProvider";
import { supabase } from "@/integrations/supabase/client";

export default function ProfileSetup() {
  const navigate = useNavigate();
  const { user } = useAuth();
  const [formData, setFormData] = useState({
    displayName: "",
    userId: "",
    year: "",
    course: ""
  });

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!user) return;

    try {
      const { error } = await supabase
        .from('profiles')
        .upsert({
          id: user.id,
          username: formData.userId,
          display_name: formData.displayName,
          user_metadata: {
            study_year: formData.year,
            course: formData.course
          }
        });

      if (error) throw error;
      navigate('/');
    } catch (error) {
      console.error('Error saving profile:', error);
    }
  };

  return (
    <div className="min-h-screen bg-background flex items-center justify-center p-4">
      <Card className="w-full max-w-md">
        <CardContent className="pt-6">
          <h1 className="text-2xl font-bold mb-6 text-center">Complete Your Profile</h1>
          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <Input
                placeholder="Display Name"
                value={formData.displayName}
                onChange={(e) => setFormData(prev => ({ ...prev, displayName: e.target.value }))}
              />
            </div>
            <div>
              <Input
                placeholder="User ID"
                value={formData.userId}
                onChange={(e) => setFormData(prev => ({ ...prev, userId: e.target.value }))}
              />
            </div>
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
            <Button type="submit" className="w-full">Save Profile</Button>
          </form>
        </CardContent>
      </Card>
    </div>
  );
}
