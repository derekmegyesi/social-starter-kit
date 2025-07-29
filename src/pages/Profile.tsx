import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { ArrowLeft } from "lucide-react";
import { Button } from "@/components/ui/button";
import { UserProfile } from "@/components/UserProfile";
import { useAuth } from "@/contexts/AuthContext";
import { supabase } from "@/integrations/supabase/client";
import { useToast } from "@/hooks/use-toast";

interface UserProfileData {
  name: string;
  age: string;
  gender: string;
  city: string;
  temperament: string;
  preferredEnvironment: string;
  bio: string;
}

export default function Profile() {
  const [userProfile, setUserProfile] = useState<UserProfileData | null>(null);
  const [loading, setLoading] = useState(true);
  const { user } = useAuth();
  const navigate = useNavigate();
  const { toast } = useToast();

  useEffect(() => {
    const fetchProfile = async () => {
      if (!user) {
        navigate("/auth");
        return;
      }

      try {
        const { data: profile, error } = await supabase
          .from('profiles')
          .select('*')
          .eq('user_id', user.id)
          .maybeSingle();

        if (error) {
          console.error('Error fetching profile:', error);
          toast({
            title: "Error",
            description: "Failed to load your profile.",
            variant: "destructive",
          });
          return;
        }

        if (profile) {
          setUserProfile({
            name: profile.name,
            age: profile.age,
            gender: profile.gender,
            city: profile.city,
            temperament: profile.temperament,
            preferredEnvironment: profile.preferred_environment,
            bio: profile.bio
          });
        } else {
          // No profile exists, redirect to main app which will handle profile creation
          navigate("/");
        }
      } catch (error) {
        console.error('Error fetching profile:', error);
        toast({
          title: "Error",
          description: "Failed to load your profile.",
          variant: "destructive",
        });
      } finally {
        setLoading(false);
      }
    };

    fetchProfile();
  }, [user, navigate, toast]);

  const handleProfileUpdate = async (profile: UserProfileData) => {
    if (!user) return;

    try {
      const { error } = await supabase
        .from('profiles')
        .update({
          name: profile.name,
          age: profile.age,
          gender: profile.gender,
          city: profile.city,
          temperament: profile.temperament,
          preferred_environment: profile.preferredEnvironment,
          bio: profile.bio
        })
        .eq('user_id', user.id);

      if (error) {
        console.error('Error updating profile:', error);
        toast({
          title: "Error",
          description: "Failed to update your profile.",
          variant: "destructive",
        });
        return;
      }

      toast({
        title: "Success",
        description: "Your profile has been updated!",
      });

      navigate("/");
    } catch (error) {
      console.error('Error updating profile:', error);
      toast({
        title: "Error",
        description: "Failed to update your profile.",
        variant: "destructive",
      });
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-bg flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary mx-auto mb-4"></div>
          <p className="text-muted-foreground">Loading your profile...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-bg">
      <div className="container mx-auto px-4 py-8">
        {/* Header */}
        <div className="flex items-center gap-4 mb-8">
          <Button variant="ghost" onClick={() => navigate("/")}>
            <ArrowLeft className="h-4 w-4 mr-2" />
            Back to App
          </Button>
          <h1 className="text-2xl font-bold bg-gradient-primary bg-clip-text text-transparent">
            Edit Your Profile
          </h1>
        </div>

        {/* Profile Form */}
        <div className="flex justify-center">
          {userProfile && (
            <UserProfile 
              onProfileComplete={handleProfileUpdate}
              initialProfile={userProfile}
            />
          )}
        </div>
      </div>
    </div>
  );
}