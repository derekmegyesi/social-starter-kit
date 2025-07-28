import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Textarea } from "@/components/ui/textarea";
import { User, MapPin, Heart, Users } from "lucide-react";

interface UserProfileData {
  name: string;
  age: string;
  gender: string;
  city: string;
  temperament: string;
  preferredEnvironment: string;
  bio: string;
}

interface UserProfileProps {
  onProfileComplete: (profile: UserProfileData) => void;
  initialProfile?: UserProfileData;
}

export const UserProfile = ({ onProfileComplete, initialProfile }: UserProfileProps) => {
  const [profile, setProfile] = useState<UserProfileData>(
    initialProfile || {
      name: "",
      age: "",
      gender: "",
      city: "",
      temperament: "",
      preferredEnvironment: "",
      bio: "",
    }
  );

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onProfileComplete(profile);
  };

  const updateProfile = (field: keyof UserProfileData, value: string) => {
    setProfile(prev => ({ ...prev, [field]: value }));
  };

  const isComplete = profile.name && profile.age && profile.gender && profile.temperament;

  return (
    <Card className="w-full max-w-2xl mx-auto shadow-warm bg-gradient-to-br from-card to-muted/30">
      <CardHeader className="text-center">
        <div className="mx-auto w-16 h-16 bg-gradient-primary rounded-full flex items-center justify-center mb-4">
          <User className="h-8 w-8 text-white" />
        </div>
        <CardTitle className="text-2xl bg-gradient-primary bg-clip-text text-transparent">
          Tell Us About Yourself
        </CardTitle>
        <CardDescription className="text-muted-foreground">
          Help us create personalized ice breakers that match your style and comfort level
        </CardDescription>
      </CardHeader>
      <CardContent>
        <form onSubmit={handleSubmit} className="space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="name" className="flex items-center gap-2">
                <User className="h-4 w-4" />
                Name
              </Label>
              <Input
                id="name"
                value={profile.name}
                onChange={(e) => updateProfile("name", e.target.value)}
                placeholder="Your first name"
                className="transition-all duration-300 hover:shadow-soft focus:shadow-warm"
              />
            </div>
            
            <div className="space-y-2">
              <Label htmlFor="age">Age Range</Label>
              <Select value={profile.age} onValueChange={(value) => updateProfile("age", value)}>
                <SelectTrigger className="hover:shadow-soft">
                  <SelectValue placeholder="Select age range" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="18-24">18-24</SelectItem>
                  <SelectItem value="25-34">25-34</SelectItem>
                  <SelectItem value="35-44">35-44</SelectItem>
                  <SelectItem value="45-54">45-54</SelectItem>
                  <SelectItem value="55+">55+</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="gender">Gender</Label>
              <Select value={profile.gender} onValueChange={(value) => updateProfile("gender", value)}>
                <SelectTrigger className="hover:shadow-soft">
                  <SelectValue placeholder="Select gender" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="female">Female</SelectItem>
                  <SelectItem value="male">Male</SelectItem>
                  <SelectItem value="non-binary">Non-binary</SelectItem>
                  <SelectItem value="prefer-not-to-say">Prefer not to say</SelectItem>
                </SelectContent>
              </Select>
            </div>

            <div className="space-y-2">
              <Label htmlFor="city" className="flex items-center gap-2">
                <MapPin className="h-4 w-4" />
                City
              </Label>
              <Input
                id="city"
                value={profile.city}
                onChange={(e) => updateProfile("city", e.target.value)}
                placeholder="Your city"
                className="transition-all duration-300 hover:shadow-soft focus:shadow-warm"
              />
            </div>
          </div>

          <div className="space-y-2">
            <Label htmlFor="temperament" className="flex items-center gap-2">
              <Heart className="h-4 w-4" />
              Temperament
            </Label>
            <Select value={profile.temperament} onValueChange={(value) => updateProfile("temperament", value)}>
              <SelectTrigger className="hover:shadow-soft">
                <SelectValue placeholder="How would you describe yourself?" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="very-shy">Very shy and reserved</SelectItem>
                <SelectItem value="somewhat-shy">Somewhat shy but warming up</SelectItem>
                <SelectItem value="balanced">Balanced - depends on the situation</SelectItem>
                <SelectItem value="outgoing">Generally outgoing</SelectItem>
                <SelectItem value="very-outgoing">Very outgoing and social</SelectItem>
              </SelectContent>
            </Select>
          </div>

          <div className="space-y-2">
            <Label htmlFor="preferredEnvironment" className="flex items-center gap-2">
              <Users className="h-4 w-4" />
              Preferred Social Environment
            </Label>
            <Select value={profile.preferredEnvironment} onValueChange={(value) => updateProfile("preferredEnvironment", value)}>
              <SelectTrigger className="hover:shadow-soft">
                <SelectValue placeholder="Where do you feel most comfortable?" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="small-groups">Small, intimate groups (2-5 people)</SelectItem>
                <SelectItem value="medium-groups">Medium groups (6-15 people)</SelectItem>
                <SelectItem value="large-groups">Large groups and parties</SelectItem>
                <SelectItem value="one-on-one">One-on-one conversations</SelectItem>
                <SelectItem value="professional">Professional networking events</SelectItem>
              </SelectContent>
            </Select>
          </div>

          <div className="space-y-2">
            <Label htmlFor="bio">About You (Optional)</Label>
            <Textarea
              id="bio"
              value={profile.bio}
              onChange={(e) => updateProfile("bio", e.target.value)}
              placeholder="Tell us about your hobbies, interests, or anything that might help us suggest better conversation starters..."
              className="min-h-[80px] transition-all duration-300 hover:shadow-soft focus:shadow-warm"
            />
          </div>

          <Button 
            type="submit" 
            variant="confidence" 
            size="lg" 
            className="w-full"
            disabled={!isComplete}
          >
            Create My Profile
          </Button>
        </form>
      </CardContent>
    </Card>
  );
};