-- Create table for storing generated icebreakers
CREATE TABLE public.icebreakers (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  text TEXT NOT NULL,
  category TEXT NOT NULL,
  difficulty TEXT NOT NULL,
  event_type TEXT NOT NULL,
  event_name TEXT,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Create table for storing user ratings of icebreakers
CREATE TABLE public.icebreaker_ratings (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  icebreaker_id UUID NOT NULL REFERENCES public.icebreakers(id) ON DELETE CASCADE,
  rating INTEGER NOT NULL CHECK (rating >= 1 AND rating <= 5),
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  UNIQUE(user_id, icebreaker_id)
);

-- Enable Row Level Security
ALTER TABLE public.icebreakers ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.icebreaker_ratings ENABLE ROW LEVEL SECURITY;

-- Create policies for icebreakers table
CREATE POLICY "Users can view their own icebreakers" 
ON public.icebreakers 
FOR SELECT 
USING (auth.uid() = user_id);

CREATE POLICY "Users can create their own icebreakers" 
ON public.icebreakers 
FOR INSERT 
WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update their own icebreakers" 
ON public.icebreakers 
FOR UPDATE 
USING (auth.uid() = user_id);

CREATE POLICY "Users can delete their own icebreakers" 
ON public.icebreakers 
FOR DELETE 
USING (auth.uid() = user_id);

-- Create policies for ratings table
CREATE POLICY "Users can view their own ratings" 
ON public.icebreaker_ratings 
FOR SELECT 
USING (auth.uid() = user_id);

CREATE POLICY "Users can create their own ratings" 
ON public.icebreaker_ratings 
FOR INSERT 
WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update their own ratings" 
ON public.icebreaker_ratings 
FOR UPDATE 
USING (auth.uid() = user_id);

CREATE POLICY "Users can delete their own ratings" 
ON public.icebreaker_ratings 
FOR DELETE 
USING (auth.uid() = user_id);

-- Create indexes for better performance
CREATE INDEX idx_icebreakers_user_id ON public.icebreakers(user_id);
CREATE INDEX idx_icebreaker_ratings_user_id ON public.icebreaker_ratings(user_id);
CREATE INDEX idx_icebreaker_ratings_icebreaker_id ON public.icebreaker_ratings(icebreaker_id);