import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Calendar, Coffee, Heart, Briefcase, Users, PartyPopper, GraduationCap, Home } from "lucide-react";

interface EventType {
  id: string;
  name: string;
  description: string;
  icon: React.ReactNode;
  color: string;
}

const eventTypes: EventType[] = [
  {
    id: "date",
    name: "First Date",
    description: "Coffee, dinner, or casual meetup",
    icon: <Heart className="h-5 w-5" />,
    color: "bg-gradient-to-r from-pink-500 to-rose-500"
  },
  {
    id: "party",
    name: "Party / Social Gathering",
    description: "House party, celebration, or social event",
    icon: <PartyPopper className="h-5 w-5" />,
    color: "bg-gradient-to-r from-purple-500 to-indigo-500"
  },
  {
    id: "networking",
    name: "Professional Networking",
    description: "Work events, conferences, or business mixers",
    icon: <Briefcase className="h-5 w-5" />,
    color: "bg-gradient-to-r from-blue-500 to-cyan-500"
  },
  {
    id: "casual-meetup",
    name: "Casual Meetup",
    description: "Coffee shop, bookstore, or casual hangout",
    icon: <Coffee className="h-5 w-5" />,
    color: "bg-gradient-to-r from-orange-500 to-amber-500"
  },
  {
    id: "group-activity",
    name: "Group Activity",
    description: "Sports, hobbies, or organized group events",
    icon: <Users className="h-5 w-5" />,
    color: "bg-gradient-to-r from-green-500 to-emerald-500"
  },
  {
    id: "class-workshop",
    name: "Class / Workshop",
    description: "Educational events, classes, or workshops",
    icon: <GraduationCap className="h-5 w-5" />,
    color: "bg-gradient-to-r from-teal-500 to-blue-500"
  },
  {
    id: "family-gathering",
    name: "Family Gathering",
    description: "Family events, reunions, or holidays",
    icon: <Home className="h-5 w-5" />,
    color: "bg-gradient-to-r from-red-500 to-pink-500"
  },
  {
    id: "other",
    name: "Other Event",
    description: "Any other social situation",
    icon: <Calendar className="h-5 w-5" />,
    color: "bg-gradient-to-r from-gray-500 to-slate-500"
  }
];

interface EventSelectorProps {
  onEventSelect: (eventType: string, eventName: string) => void;
}

export const EventSelector = ({ onEventSelect }: EventSelectorProps) => {
  const [selectedEvent, setSelectedEvent] = useState<string>("");

  const handleEventSelect = (eventId: string) => {
    const event = eventTypes.find(e => e.id === eventId);
    if (event) {
      setSelectedEvent(eventId);
      onEventSelect(eventId, event.name);
    }
  };

  return (
    <Card className="w-full max-w-4xl mx-auto shadow-warm">
      <CardHeader className="text-center">
        <CardTitle className="text-2xl bg-gradient-primary bg-clip-text text-transparent">
          What's the Occasion?
        </CardTitle>
        <CardDescription>
          Choose the type of event you're preparing for to get personalized ice breakers
        </CardDescription>
      </CardHeader>
      <CardContent>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {eventTypes.map((event) => (
            <Card
              key={event.id}
              className={`cursor-pointer transition-all duration-300 hover:scale-105 hover:shadow-warm ${
                selectedEvent === event.id 
                  ? 'ring-2 ring-primary shadow-glow' 
                  : 'hover:ring-1 hover:ring-primary/50'
              }`}
              onClick={() => handleEventSelect(event.id)}
            >
              <CardContent className="p-6 text-center">
                <div className={`w-12 h-12 rounded-full ${event.color} flex items-center justify-center mx-auto mb-3 text-white`}>
                  {event.icon}
                </div>
                <h3 className="font-semibold text-lg mb-2">{event.name}</h3>
                <p className="text-sm text-muted-foreground">{event.description}</p>
                {selectedEvent === event.id && (
                  <Badge className="mt-3 bg-gradient-primary text-white">
                    Selected
                  </Badge>
                )}
              </CardContent>
            </Card>
          ))}
        </div>
        
        {selectedEvent && (
          <div className="mt-6 text-center">
            <Button 
              variant="confidence" 
              size="lg"
              onClick={() => {
                const event = eventTypes.find(e => e.id === selectedEvent);
                if (event) onEventSelect(selectedEvent, event.name);
              }}
            >
              Get My Ice Breakers
            </Button>
          </div>
        )}
      </CardContent>
    </Card>
  );
};