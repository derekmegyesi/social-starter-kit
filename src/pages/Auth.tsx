import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { useToast } from "@/hooks/use-toast";
import { supabase } from "@/integrations/supabase/client";
import { Loader2, Mail, Lock, User, Lightbulb, Zap, Pickaxe, HelpCircle } from "lucide-react";
import icebreakerShip from "@/assets/icebreaker-ship.jpg";
import friendsFaces from "@/assets/friends-faces.jpg";

export default function Auth() {
  const [isLogin, setIsLogin] = useState(true);
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();
  const { toast } = useToast();

  useEffect(() => {
    // Check if user is already logged in
    const checkUser = async () => {
      const { data: { session } } = await supabase.auth.getSession();
      if (session) {
        navigate("/");
      }
    };
    
    checkUser();
  }, [navigate]);

  const handleSignUp = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (password !== confirmPassword) {
      toast({
        title: "Error",
        description: "Passwords don't match",
        variant: "destructive",
      });
      return;
    }

    if (password.length < 6) {
      toast({
        title: "Error", 
        description: "Password must be at least 6 characters",
        variant: "destructive",
      });
      return;
    }

    setLoading(true);

    const redirectUrl = `${window.location.origin}/`;
    
    const { error } = await supabase.auth.signUp({
      email,
      password,
      options: {
        emailRedirectTo: redirectUrl
      }
    });

    setLoading(false);

    if (error) {
      if (error.message.includes("User already registered")) {
        toast({
          title: "Account exists",
          description: "An account with this email already exists. Please sign in instead.",
          variant: "destructive",
        });
        setIsLogin(true);
      } else {
        toast({
          title: "Error",
          description: error.message,
          variant: "destructive",
        });
      }
    } else {
      toast({
        title: "Success!",
        description: "Please check your email to confirm your account.",
      });
    }
  };

  const handleSignIn = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    const { error } = await supabase.auth.signInWithPassword({
      email,
      password,
    });

    setLoading(false);

    if (error) {
      toast({
        title: "Error",
        description: error.message,
        variant: "destructive",
      });
    } else {
      toast({
        title: "Welcome back!",
        description: "You've been signed in successfully.",
      });
      navigate("/");
    }
  };


  const resetForm = () => {
    setEmail("");
    setPassword("");
    setConfirmPassword("");
  };

  const toggleMode = () => {
    setIsLogin(!isLogin);
    resetForm();
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-background to-muted">
      {/* Banner */}
      <div className="relative h-48 overflow-hidden animate-fade-in">
        <img 
          src={friendsFaces} 
          alt="Friends laughing together showing their faces" 
          className="w-full h-full object-cover hover-scale"
        />
        <div className="absolute inset-0 bg-gradient-to-r from-primary/70 to-purple-500/60 animate-fade-in" />
        <div className="absolute inset-0 flex items-center justify-center animate-scale-in">
          <div className="text-center text-white">
            <h1 className="text-4xl font-bold mb-2 animate-pulse">🎉 Icebreaker Maker 🎉</h1>
            <p className="text-xl opacity-90 animate-fade-in">Break the ice with confidence and have fun!</p>
          </div>
        </div>
      </div>

      {/* What is IceBreaker Maker Button */}
      <div className="flex justify-center -mt-6 mb-6">
        <Dialog>
          <DialogTrigger asChild>
            <Button variant="outline" className="bg-white/90 hover:bg-white shadow-lg">
              <HelpCircle className="h-4 w-4 mr-2" />
              What is the IceBreaker Maker?
            </Button>
          </DialogTrigger>
          <DialogContent className="max-w-2xl">
            <DialogHeader>
              <DialogTitle className="text-2xl bg-gradient-primary bg-clip-text text-transparent flex items-center gap-2">
                <Lightbulb className="h-6 w-6 text-primary" />
                About IceBreaker Maker
              </DialogTitle>
              <DialogDescription asChild>
                <div className="space-y-4 text-base">
                  <p className="leading-relaxed">
                    Transform awkward social moments into meaningful connections with AI-powered, personalized conversation starters. 
                    Whether you're at a party, networking event, or casual meetup, our intelligent system crafts icebreaker questions 
                    tailored to your personality, the event type, and your comfort level.
                  </p>
                  <p className="leading-relaxed">
                    Say goodbye to social anxiety and hello to genuine conversations that flow naturally and help you build lasting relationships.
                  </p>
                  <div className="bg-muted/50 p-4 rounded-lg">
                    <h4 className="font-semibold mb-2 text-foreground">How it works:</h4>
                    <ul className="space-y-1 text-sm text-muted-foreground">
                      <li>• Create your personalized profile</li>
                      <li>• Select your event type (party, networking, casual meetup, etc.)</li>
                      <li>• Get AI-generated icebreakers designed just for you</li>
                      <li>• Rate and improve your suggestions over time</li>
                    </ul>
                  </div>
                </div>
              </DialogDescription>
            </DialogHeader>
          </DialogContent>
        </Dialog>
      </div>

      <div className="flex items-center justify-center p-4">
        <div className="w-full max-w-md space-y-8">
          {/* App logo */}
          <div className="text-center animate-scale-in">
            <div className="flex justify-center">
              <div className="relative hover-scale">
                <img 
                  src={icebreakerShip} 
                  alt="Icebreaker ship in Arctic ice" 
                  className="h-32 w-32 rounded-full object-cover shadow-xl ring-4 ring-white animate-fade-in"
                />
                <div className="absolute -bottom-3 -right-3 h-12 w-12 bg-gradient-primary rounded-full flex items-center justify-center shadow-lg animate-pulse">
                  <Zap className="h-6 w-6 text-white" />
                </div>
              </div>
            </div>
          </div>

        <Card className="shadow-warm">
          <CardHeader className="text-center">
            <CardTitle className="text-2xl bg-gradient-primary bg-clip-text text-transparent">
              {isLogin ? "Welcome Back" : "Join Us"}
            </CardTitle>
            <CardDescription>
              {isLogin 
                ? "Sign in to access your personalized ice breakers" 
                : "Create an account to start building your social confidence"
              }
            </CardDescription>
          </CardHeader>
        <CardContent>
          <form onSubmit={isLogin ? handleSignIn : handleSignUp} className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="email" className="flex items-center gap-2">
                  <Mail className="h-4 w-4" />
                  Email
                </Label>
                <Input
                  id="email"
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="Enter your email"
                  required
                  disabled={loading}
                />
              </div>
              
              <div className="space-y-2">
                <Label htmlFor="password" className="flex items-center gap-2">
                  <Lock className="h-4 w-4" />
                  Password
                </Label>
                <Input
                  id="password"
                  type="password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="Enter your password"
                  required
                  disabled={loading}
                  minLength={6}
                />
              </div>

              {!isLogin && (
                <div className="space-y-2">
                  <Label htmlFor="confirmPassword" className="flex items-center gap-2">
                    <Lock className="h-4 w-4" />
                    Confirm Password
                  </Label>
                  <Input
                    id="confirmPassword"
                    type="password"
                    value={confirmPassword}
                    onChange={(e) => setConfirmPassword(e.target.value)}
                    placeholder="Confirm your password"
                    required
                    disabled={loading}
                    minLength={6}
                  />
                </div>
              )}

              <Button 
                type="submit" 
                className="w-full" 
                disabled={loading}
              >
                {loading && <Loader2 className="h-4 w-4 mr-2 animate-spin" />}
                {isLogin ? "Sign In" : "Create Account"}
              </Button>
            </form>

          <div className="mt-6 text-center">
            <p className="text-sm text-muted-foreground">
              {isLogin ? "Don't have an account?" : "Already have an account?"}
            </p>
            <Button 
              variant="link" 
              onClick={toggleMode}
              disabled={loading}
              className="p-0 h-auto font-normal text-primary"
            >
              {isLogin ? "Sign up here" : "Sign in here"}
            </Button>
          </div>
        </CardContent>
        </Card>
        </div>
      </div>
    </div>
  );
}