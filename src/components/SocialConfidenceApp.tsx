import { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import { UserProfile } from "./UserProfile";
import { EventSelector } from "./EventSelector";
import { IceBreakerGenerator } from "./IceBreakerGenerator";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { ArrowLeft, Users, Sparkles, LogOut } from "lucide-react";
import { useAuth } from "@/contexts/AuthContext";
import { supabase } from "@/integrations/supabase/client";
import heroImage from "@/assets/hero-social.jpg";

interface UserProfileData {
  name: string;
  age: string;
  gender: string;
  city: string;
  temperament: string;
  preferredEnvironment: string;
  bio: string;
}

type AppStep = "welcome" | "profile" | "event" | "icebreakers";

interface SocialConfidenceAppProps {
  initialStep?: AppStep;
}

export const SocialConfidenceApp = ({ initialStep = "welcome" }: SocialConfidenceAppProps) => {
  const [currentStep, setCurrentStep] = useState<AppStep>(initialStep);
  const [userProfile, setUserProfile] = useState<UserProfileData | null>(null);
  const [selectedEvent, setSelectedEvent] = useState<{ type: string; name: string } | null>(null);
  const [ratings, setRatings] = useState<Record<string, number>>({});
  const [loading, setLoading] = useState(true);
  const { signOut, user } = useAuth();

  // Check for existing profile when user logs in
  useEffect(() => {
    const checkExistingProfile = async () => {
      if (!user) {
        setLoading(false);
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
          setLoading(false);
          return;
        }

        if (profile) {
          // User has existing profile, load it and skip to event selection
          setUserProfile({
            name: profile.name,
            age: profile.age,
            gender: profile.gender,
            city: profile.city,
            temperament: profile.temperament,
            preferredEnvironment: profile.preferred_environment,
            bio: profile.bio
          });
          
          // If we're on welcome or should start at profile, skip to event selection
          if (initialStep === "welcome" || initialStep === "profile") {
            setCurrentStep("event");
          }
        } else {
          // No profile exists, ensure we start at profile creation
          if (initialStep === "welcome") {
            setCurrentStep("profile");
          }
        }
      } catch (error) {
        console.error('Error checking profile:', error);
      } finally {
        setLoading(false);
      }
    };

    checkExistingProfile();
  }, [user, initialStep]);

  const handleProfileComplete = async (profile: UserProfileData) => {
    if (!user) return;

    try {
      // Save profile to database
      const { error } = await supabase
        .from('profiles')
        .upsert({
          user_id: user.id,
          name: profile.name,
          age: profile.age,
          gender: profile.gender,
          city: profile.city,
          temperament: profile.temperament,
          preferred_environment: profile.preferredEnvironment,
          bio: profile.bio
        });

      if (error) {
        console.error('Error saving profile:', error);
        return;
      }

      setUserProfile(profile);
      setCurrentStep("event");
    } catch (error) {
      console.error('Error saving profile:', error);
    }
  };

  const handleEventSelect = (eventType: string, eventName: string) => {
    setSelectedEvent({ type: eventType, name: eventName });
    setCurrentStep("icebreakers");
  };

  const handleRating = (iceBreakerID: string, rating: number) => {
    setRatings(prev => ({ ...prev, [iceBreakerID]: rating }));
  };

  const goBack = () => {
    switch (currentStep) {
      case "event":
        setCurrentStep("profile");
        break;
      case "icebreakers":
        setCurrentStep("event");
        break;
      default:
        setCurrentStep("welcome");
    }
  };

  const startOver = () => {
    setCurrentStep("event"); // Start at event selection since profile exists
    setSelectedEvent(null);
    setRatings({});
  };

  // Show loading state while checking for existing profile
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

  if (currentStep === "welcome") {
    return (
      <div className="min-h-screen bg-gradient-bg">
        <div className="container mx-auto px-4 py-8">
          <div className="max-w-6xl mx-auto">
            {/* Hero Section */}
            <div className="text-center mb-12">
              <div className="mb-8">
                <img 
                  src={heroImage} 
                  alt="People having friendly conversations" 
                  className="w-full max-w-4xl mx-auto rounded-2xl shadow-glow"
                />
              </div>
              
              <h1 className="text-4xl md:text-6xl font-bold mb-6">
                <span className="bg-gradient-primary bg-clip-text text-transparent">
                  Break the Ice
                </span>
                <br />
                <span className="text-foreground">Build Confidence</span>
              </h1>
              
              <p className="text-xl text-muted-foreground mb-8 max-w-2xl mx-auto leading-relaxed">
                Never worry about awkward silences again. Get personalized conversation starters 
                that match your personality and help you connect authentically with others.
              </p>
              
              <div className="flex flex-col sm:flex-row gap-4 justify-center">
                <Button 
                  variant="confidence" 
                  size="lg"
                  onClick={() => setCurrentStep("profile")}
                  className="text-lg px-8 py-6"
                >
                  <Sparkles className="h-5 w-5 mr-2" />
                  Get Started
                </Button>
                <Link to="/about">
                  <Button 
                    variant="outline" 
                    size="lg"
                    className="text-lg px-8 py-6"
                  >
                    <Users className="h-5 w-5 mr-2" />
                    Learn More
                  </Button>
                </Link>
              </div>
            </div>

            {/* Features Section */}
            <div id="features" className="grid grid-cols-1 md:grid-cols-3 gap-6 mt-16">
              <Card className="text-center p-6 shadow-soft hover:shadow-warm transition-all duration-300">
                <CardContent className="pt-6">
                  <div className="w-12 h-12 bg-gradient-primary rounded-full flex items-center justify-center mx-auto mb-4">
                    <Users className="h-6 w-6 text-white" />
                  </div>
                  <h3 className="text-xl font-semibold mb-3">Personalized</h3>
                  <p className="text-muted-foreground">
                    Ice breakers tailored to your personality, comfort level, and the specific social situation.
                  </p>
                </CardContent>
              </Card>

              <Card className="text-center p-6 shadow-soft hover:shadow-warm transition-all duration-300">
                <CardContent className="pt-6">
                  <div className="w-12 h-12 bg-gradient-warm rounded-full flex items-center justify-center mx-auto mb-4">
                    <Sparkles className="h-6 w-6 text-white" />
                  </div>
                  <h3 className="text-xl font-semibold mb-3">Adaptive Learning</h3>
                  <p className="text-muted-foreground">
                    The more you use it, the better it gets at suggesting conversation starters you'll love.
                  </p>
                </CardContent>
              </Card>

              <Card className="text-center p-6 shadow-soft hover:shadow-warm transition-all duration-300">
                <CardContent className="pt-6">
                  <div className="w-12 h-12 bg-gradient-calm rounded-full flex items-center justify-center mx-auto mb-4">
                    <ArrowLeft className="h-6 w-6 text-white" />
                  </div>
                  <h3 className="text-xl font-semibold mb-3">Confidence Building</h3>
                  <p className="text-muted-foreground">
                    Practice makes perfect. Build your social skills one conversation at a time.
                  </p>
                </CardContent>
              </Card>
            </div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-bg">
      <div className="container mx-auto px-4 py-8">
        {/* Header */}
        <div className="flex items-center justify-between mb-8">
          <div className="flex items-center gap-4">
            {currentStep !== "profile" && (
              <Button variant="ghost" onClick={goBack}>
                <ArrowLeft className="h-4 w-4 mr-2" />
                Back
              </Button>
            )}
            <h1 className="text-2xl font-bold bg-gradient-primary bg-clip-text text-transparent">
              IceBreaker
            </h1>
          </div>
          
          <div className="flex items-center gap-2">
            <span className="text-sm text-muted-foreground">
              {user?.email}
            </span>
            {currentStep === "icebreakers" && (
              <Button variant="outline" onClick={startOver}>
                Start Over
              </Button>
            )}
            <Button variant="ghost" onClick={signOut}>
              <LogOut className="h-4 w-4 mr-2" />
              Sign Out
            </Button>
          </div>
        </div>

        {/* Progress Indicator */}
        <div className="flex justify-center mb-8">
          <div className="flex items-center space-x-4">
            <div className={`w-8 h-8 rounded-full flex items-center justify-center text-sm font-medium ${
              currentStep === "profile" ? "bg-primary text-primary-foreground" : "bg-success text-success-foreground"
            }`}>
              1
            </div>
            <div className={`w-16 h-1 rounded ${
              ["event", "icebreakers"].includes(currentStep) ? "bg-success" : "bg-muted"
            }`} />
            <div className={`w-8 h-8 rounded-full flex items-center justify-center text-sm font-medium ${
              currentStep === "event" ? "bg-primary text-primary-foreground" : 
              currentStep === "icebreakers" ? "bg-success text-success-foreground" : "bg-muted text-muted-foreground"
            }`}>
              2
            </div>
            <div className={`w-16 h-1 rounded ${
              currentStep === "icebreakers" ? "bg-success" : "bg-muted"
            }`} />
            <div className={`w-8 h-8 rounded-full flex items-center justify-center text-sm font-medium ${
              currentStep === "icebreakers" ? "bg-primary text-primary-foreground" : "bg-muted text-muted-foreground"
            }`}>
              3
            </div>
          </div>
        </div>

        {/* Current Step Content */}
        <div className="flex justify-center">
          {currentStep === "profile" && (
            <UserProfile onProfileComplete={handleProfileComplete} />
          )}
          
          {currentStep === "event" && (
            <EventSelector onEventSelect={handleEventSelect} />
          )}
          
          {currentStep === "icebreakers" && userProfile && selectedEvent && (
            <IceBreakerGenerator
              profile={userProfile}
              eventType={selectedEvent.type}
              eventName={selectedEvent.name}
              onRating={handleRating}
            />
          )}
        </div>
      </div>
    </div>
  );
};