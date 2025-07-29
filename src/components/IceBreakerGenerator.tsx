import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Textarea } from "@/components/ui/textarea";
import { RefreshCw, ThumbsUp, ThumbsDown, Lightbulb, MessageCircle, Star, Copy } from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import { supabase } from "@/integrations/supabase/client";

interface IceBreaker {
  id: string;
  text: string;
  category: string;
  difficulty: "easy" | "medium" | "advanced";
  rating?: number;
  used?: boolean;
}

interface UserProfile {
  name: string;
  age: string;
  gender: string;
  city: string;
  temperament: string;
  preferredEnvironment: string;
  bio: string;
}

interface IceBreakerGeneratorProps {
  profile: UserProfile;
  eventType: string;
  eventName: string;
  onRating: (iceBreakerID: string, rating: number) => void;
}

const generateIceBreakers = (profile: UserProfile, eventType: string): IceBreaker[] => {
  const baseIceBreakers: Record<string, IceBreaker[]> = {
    date: [
      {
        id: "date-1",
        text: "I have to ask - what's the story behind your smile? It's quite infectious!",
        category: "Compliment",
        difficulty: "easy"
      },
      {
        id: "date-2", 
        text: "So, what's been the highlight of your week so far?",
        category: "Open Question",
        difficulty: "easy"
      },
      {
        id: "date-3",
        text: "I'm curious - if you could have dinner with anyone, dead or alive, who would it be and why?",
        category: "Thought-Provoking",
        difficulty: "medium"
      },
      {
        id: "date-4",
        text: "This might sound random, but what's something you've learned recently that surprised you?",
        category: "Personal",
        difficulty: "medium"
      }
    ],
    party: [
      {
        id: "party-1",
        text: "Hi! I love your energy - how do you know [host's name]?",
        category: "Connection",
        difficulty: "easy"
      },
      {
        id: "party-2",
        text: "This music is great! Are you into this genre, or do you have different favorites?",
        category: "Interest",
        difficulty: "easy"
      },
      {
        id: "party-3",
        text: "I'm trying to guess - are you more of a morning person or a night owl? You seem like you have great energy!",
        category: "Playful",
        difficulty: "medium"
      }
    ],
    networking: [
      {
        id: "network-1",
        text: "Hi, I'm [name]. What brings you to this event?",
        category: "Professional",
        difficulty: "easy"
      },
      {
        id: "network-2",
        text: "I'm impressed by the turnout tonight. What's your connection to [industry/organization]?",
        category: "Professional",
        difficulty: "easy"
      },
      {
        id: "network-3",
        text: "I'd love to hear your perspective - what trends are you seeing in your field right now?",
        category: "Industry",
        difficulty: "medium"
      }
    ],
    "casual-meetup": [
      {
        id: "casual-1",
        text: "I love the vibe here! Do you come to this place often?",
        category: "Environment",
        difficulty: "easy"
      },
      {
        id: "casual-2",
        text: "That book/drink/item looks interesting! How are you finding it?",
        category: "Observation",
        difficulty: "easy"
      },
      {
        id: "casual-3",
        text: "I'm trying to decide what to order - any recommendations?",
        category: "Advice",
        difficulty: "easy"
      }
    ]
  };

  // Get base ice breakers for event type
  let iceBreakers = baseIceBreakers[eventType] || baseIceBreakers["casual-meetup"];

  // Filter by temperament (shy people get easier ones)
  if (profile.temperament === "very-shy") {
    iceBreakers = iceBreakers.filter(ib => ib.difficulty === "easy");
  }

  // Add personalized touches based on bio
  if (profile.bio.toLowerCase().includes("coffee")) {
    iceBreakers.push({
      id: "personal-coffee",
      text: "I noticed you're a coffee person too - what's your go-to order?",
      category: "Personal Interest",
      difficulty: "easy"
    });
  }

  if (profile.bio.toLowerCase().includes("book")) {
    iceBreakers.push({
      id: "personal-books",
      text: "You seem like someone who might have great book recommendations. What's the last good book you read?",
      category: "Personal Interest", 
      difficulty: "medium"
    });
  }

  return iceBreakers.slice(0, 6); // Return 6 ice breakers
};

export const IceBreakerGenerator = ({ profile, eventType, eventName, onRating }: IceBreakerGeneratorProps) => {
  const [iceBreakers, setIceBreakers] = useState<IceBreaker[]>([]);
  const [feedback, setFeedback] = useState<string>("");
  const { toast } = useToast();

  useEffect(() => {
    generateAndSaveIceBreakers();
  }, [profile, eventType]);

  const generateAndSaveIceBreakers = async () => {
    try {
      // Add loading state
      toast({
        title: "Generating personalized icebreakers...",
        description: "ChatGPT is creating unique questions just for you!",
      });

      // Call the ChatGPT edge function to generate personalized icebreakers
      const { data, error } = await supabase.functions.invoke('generate-icebreakers', {
        body: {
          userProfile: profile,
          eventType,
          eventName
        }
      });

      if (error) {
        console.error('Error calling edge function:', error);
        
        toast({
          title: "AI generation failed",
          description: "Using curated icebreakers instead. Please try again in a moment.",
          variant: "destructive",
        });
        
        // Fallback to hardcoded icebreakers if API fails
        const generated = generateIceBreakers(profile, eventType);
        setIceBreakers(generated);
        return;
      }

      // Check if the response indicates an error or need for fallback
      if (data?.fallbackRequired || data?.error) {
        if (data?.isRateLimit) {
          toast({
            title: "Rate limit reached",
            description: "OpenAI is busy! Using curated icebreakers designed just for you.",
            variant: "destructive",
          });
        } else {
          toast({
            title: "AI temporarily unavailable",
            description: "Using curated icebreakers instead.",
            variant: "destructive",
          });
        }
        
        // Fallback to hardcoded icebreakers
        const generated = generateIceBreakers(profile, eventType);
        setIceBreakers(generated);
        return;
      }

      if (!data?.icebreakers || !Array.isArray(data.icebreakers)) {
        throw new Error('Invalid response format from AI');
      }

      // Transform the ChatGPT response to match our interface
      const transformedIcebreakers = data.icebreakers.map((ib: any, index: number) => ({
        id: `ai-${Date.now()}-${index}`,
        text: ib.text,
        category: ib.category,
        difficulty: ib.difficulty as "easy" | "medium" | "advanced"
      }));

      setIceBreakers(transformedIcebreakers);
      
      toast({
        title: "New icebreakers generated!",
        description: "ChatGPT created personalized questions just for you!",
      });
      
      // Save generated icebreakers to database
      const { data: { user } } = await supabase.auth.getUser();
      if (user) {
        const icebreakerData = transformedIcebreakers.map(iceBreaker => ({
          user_id: user.id,
          text: iceBreaker.text,
          category: iceBreaker.category,
          difficulty: iceBreaker.difficulty,
          event_type: eventType,
          event_name: eventName
        }));

        const { error: saveError } = await supabase
          .from('icebreakers')
          .insert(icebreakerData);

        if (saveError) {
          console.error('Error saving icebreakers:', saveError);
        }
      }
    } catch (error) {
      console.error('Error generating icebreakers:', error);
      // Fallback to hardcoded icebreakers
      const generated = generateIceBreakers(profile, eventType);
      setIceBreakers(generated);
      
      toast({
        title: "Using backup icebreakers",
        description: "AI generation failed, but we've got you covered with curated options!",
      });
    }
  };

  const handleRating = async (iceBreakerID: string, rating: number) => {
    setIceBreakers(prev => 
      prev.map(ib => 
        ib.id === iceBreakerID ? { ...ib, rating } : ib
      )
    );
    onRating(iceBreakerID, rating);
    
    // Save rating to database
    const { data: { user } } = await supabase.auth.getUser();
    if (user) {
      // First, find the database icebreaker ID for this local icebreaker
      const iceBreaker = iceBreakers.find(ib => ib.id === iceBreakerID);
      if (iceBreaker) {
        const { data: dbIceBreaker } = await supabase
          .from('icebreakers')
          .select('id')
          .eq('user_id', user.id)
          .eq('text', iceBreaker.text)
          .eq('event_type', eventType)
          .single();

        if (dbIceBreaker) {
          const { error } = await supabase
            .from('icebreaker_ratings')
            .upsert({
              user_id: user.id,
              icebreaker_id: dbIceBreaker.id,
              rating
            });

          if (error) {
            console.error('Error saving rating:', error);
          }
        }
      }
    }
    
    if (rating >= 4) {
      toast({
        title: "Great choice!",
        description: "We'll remember you liked this style for future suggestions.",
      });
    }
  };

  const copyToClipboard = (text: string) => {
    navigator.clipboard.writeText(text);
    toast({
      title: "Copied!",
      description: "Ice breaker copied to clipboard.",
    });
  };

  const regenerateIceBreakers = () => {
    generateAndSaveIceBreakers();
  };

  const getDifficultyColor = (difficulty: string) => {
    switch (difficulty) {
      case "easy": return "bg-success";
      case "medium": return "bg-accent"; 
      case "advanced": return "bg-primary";
      default: return "bg-muted";
    }
  };

  return (
    <div className="w-full max-w-4xl mx-auto space-y-6">
      <Card className="shadow-warm">
        <CardHeader className="text-center">
          <CardTitle className="text-2xl bg-gradient-primary bg-clip-text text-transparent">
            Your Personalized Ice Breakers
          </CardTitle>
          <CardDescription>
            Perfect conversation starters for your {eventName.toLowerCase()}
          </CardDescription>
          <Button 
            variant="outline" 
            onClick={regenerateIceBreakers}
            className="mx-auto"
          >
            <RefreshCw className="h-4 w-4 mr-2" />
            Generate New Ones
          </Button>
        </CardHeader>
      </Card>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {iceBreakers.map((iceBreaker) => (
          <Card 
            key={iceBreaker.id} 
            className="transition-all duration-300 hover:shadow-warm hover:scale-[1.02]"
          >
            <CardHeader className="pb-3">
              <div className="flex justify-between items-start">
                <Badge variant="secondary" className="text-xs">
                  {iceBreaker.category}
                </Badge>
                <Badge className={`text-xs text-white ${getDifficultyColor(iceBreaker.difficulty)}`}>
                  {iceBreaker.difficulty}
                </Badge>
              </div>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                <p className="text-sm leading-relaxed font-medium">
                  "{iceBreaker.text}"
                </p>
                
                <div className="flex items-center justify-between">
                  <div className="flex gap-1">
                    {[1, 2, 3, 4, 5].map((star) => (
                      <button
                        key={star}
                        onClick={() => handleRating(iceBreaker.id, star)}
                        className="transition-colors duration-200"
                      >
                        <Star 
                          className={`h-4 w-4 ${
                            (iceBreaker.rating || 0) >= star 
                              ? 'fill-primary text-primary' 
                              : 'text-muted-foreground hover:text-primary'
                          }`}
                        />
                      </button>
                    ))}
                  </div>
                  
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={() => copyToClipboard(iceBreaker.text)}
                  >
                    <Copy className="h-4 w-4" />
                  </Button>
                </div>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      <Card className="shadow-soft">
        <CardHeader>
          <CardTitle className="flex items-center gap-2 text-lg">
            <Lightbulb className="h-5 w-5" />
            How did these work for you?
          </CardTitle>
          <CardDescription>
            Your feedback helps us create better suggestions for you in the future.
          </CardDescription>
        </CardHeader>
        <CardContent>
          <Textarea
            value={feedback}
            onChange={(e) => setFeedback(e.target.value)}
            placeholder="Tell us how these ice breakers worked, or what you'd like to see more of..."
            className="min-h-[80px] transition-all duration-300 hover:shadow-soft focus:shadow-warm"
          />
          <Button variant="encouraging" className="mt-4">
            <MessageCircle className="h-4 w-4 mr-2" />
            Share Feedback
          </Button>
        </CardContent>
      </Card>
    </div>
  );
};