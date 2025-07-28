import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { ArrowLeft, Target, Heart, Users, Sparkles, TrendingUp, Shield } from "lucide-react";
import { Link } from "react-router-dom";

const About = () => {
  return (
    <div className="min-h-screen bg-gradient-bg">
      <div className="container mx-auto px-4 py-8">
        {/* Header */}
        <div className="flex items-center gap-4 mb-8">
          <Link to="/">
            <Button variant="ghost">
              <ArrowLeft className="h-4 w-4 mr-2" />
              Back to Home
            </Button>
          </Link>
          <h1 className="text-3xl font-bold bg-gradient-primary bg-clip-text text-transparent">
            About IceBreaker
          </h1>
        </div>

        <div className="max-w-4xl mx-auto">
          {/* Vision Section */}
          <Card className="mb-8 shadow-soft">
            <CardContent className="p-8">
              <div className="flex items-center gap-3 mb-6">
                <div className="w-12 h-12 bg-gradient-primary rounded-full flex items-center justify-center">
                  <Target className="h-6 w-6 text-white" />
                </div>
                <h2 className="text-2xl font-bold">Our Vision</h2>
              </div>
              <p className="text-lg text-muted-foreground leading-relaxed">
                We believe that meaningful connections shouldn't be limited by social anxiety or lack of confidence. 
                Our vision is to create a world where everyone feels empowered to start conversations, build relationships, 
                and express their authentic selves in social situations.
              </p>
            </CardContent>
          </Card>

          {/* Mission Section */}
          <Card className="mb-8 shadow-soft">
            <CardContent className="p-8">
              <div className="flex items-center gap-3 mb-6">
                <div className="w-12 h-12 bg-gradient-warm rounded-full flex items-center justify-center">
                  <Heart className="h-6 w-6 text-white" />
                </div>
                <h2 className="text-2xl font-bold">Our Mission</h2>
              </div>
              <p className="text-lg text-muted-foreground leading-relaxed mb-4">
                IceBreaker is designed to help shy, introverted, or socially anxious individuals build confidence 
                through personalized conversation starters. We provide a safe, judgment-free space to practice 
                and improve social skills at your own pace.
              </p>
              <p className="text-lg text-muted-foreground leading-relaxed">
                By understanding your personality, preferences, and the social context you're entering, we generate 
                tailored ice breakers that feel authentic to who you are.
              </p>
            </CardContent>
          </Card>

          {/* Goals Grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8">
            <Card className="shadow-soft hover:shadow-warm transition-all duration-300">
              <CardContent className="p-6">
                <div className="flex items-center gap-3 mb-4">
                  <div className="w-10 h-10 bg-gradient-confidence rounded-full flex items-center justify-center">
                    <Users className="h-5 w-5 text-white" />
                  </div>
                  <h3 className="text-xl font-semibold">Build Confidence</h3>
                </div>
                <p className="text-muted-foreground">
                  Help users overcome social anxiety through practice and positive reinforcement, 
                  building lasting confidence in social situations.
                </p>
              </CardContent>
            </Card>

            <Card className="shadow-soft hover:shadow-warm transition-all duration-300">
              <CardContent className="p-6">
                <div className="flex items-center gap-3 mb-4">
                  <div className="w-10 h-10 bg-gradient-encouraging rounded-full flex items-center justify-center">
                    <Sparkles className="h-5 w-5 text-white" />
                  </div>
                  <h3 className="text-xl font-semibold">Personalization</h3>
                </div>
                <p className="text-muted-foreground">
                  Provide conversation starters that match your personality, interests, and comfort level, 
                  ensuring authenticity in every interaction.
                </p>
              </CardContent>
            </Card>

            <Card className="shadow-soft hover:shadow-warm transition-all duration-300">
              <CardContent className="p-6">
                <div className="flex items-center gap-3 mb-4">
                  <div className="w-10 h-10 bg-gradient-calm rounded-full flex items-center justify-center">
                    <TrendingUp className="h-5 w-5 text-white" />
                  </div>
                  <h3 className="text-xl font-semibold">Continuous Learning</h3>
                </div>
                <p className="text-muted-foreground">
                  Learn from your feedback and preferences to continuously improve suggestions, 
                  adapting to your growing confidence and changing needs.
                </p>
              </CardContent>
            </Card>

            <Card className="shadow-soft hover:shadow-warm transition-all duration-300">
              <CardContent className="p-6">
                <div className="flex items-center gap-3 mb-4">
                  <div className="w-10 h-10 bg-gradient-primary rounded-full flex items-center justify-center">
                    <Shield className="h-5 w-5 text-white" />
                  </div>
                  <h3 className="text-xl font-semibold">Safe Environment</h3>
                </div>
                <p className="text-muted-foreground">
                  Create a judgment-free space where you can practice, learn, and grow your social skills 
                  without fear of embarrassment or failure.
                </p>
              </CardContent>
            </Card>
          </div>

          {/* Call to Action */}
          <Card className="bg-gradient-subtle shadow-glow">
            <CardContent className="p-8 text-center">
              <h3 className="text-2xl font-bold mb-4">Ready to Start Your Journey?</h3>
              <p className="text-lg text-muted-foreground mb-6">
                Join thousands of users who have already improved their social confidence with IceBreaker.
              </p>
              <Link to="/">
                <Button variant="confidence" size="lg" className="text-lg px-8 py-6">
                  <Sparkles className="h-5 w-5 mr-2" />
                  Get Started Now
                </Button>
              </Link>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
};

export default About;