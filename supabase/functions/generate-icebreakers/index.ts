import "https://deno.land/x/xhr@0.1.0/mod.ts";
import { serve } from "https://deno.land/std@0.168.0/http/server.ts";

const openAIApiKey = Deno.env.get('OPENAI_API_KEY');
console.log('API Key check:', openAIApiKey ? 'PRESENT' : 'MISSING');

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
};

serve(async (req) => {
  // Handle CORS preflight requests
  if (req.method === 'OPTIONS') {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    const { userProfile, eventType, eventName } = await req.json();

    const systemPrompt = `You are an expert at creating engaging icebreaker questions. Generate 6 personalized icebreaker questions based on the user's profile and event context.

User Profile:
- Bio: ${userProfile.bio || 'Not provided'}
- Temperament: ${userProfile.temperament || 'Not provided'}
- Age: ${userProfile.age || 'Not provided'}
- Profession: ${userProfile.profession || 'Not provided'}
- Interests: ${userProfile.interests?.join(', ') || 'Not provided'}

Event Context:
- Type: ${eventType}
- Name: ${eventName || 'Not provided'}

Requirements:
1. Create 6 unique icebreaker questions
2. Make them appropriate for the event type and user's personality
3. Mix different difficulty levels (easy, medium, hard)
4. Include various categories (fun, professional, creative, personal)
5. Make them engaging and conversation-starting
6. Consider the user's temperament when crafting questions

Return ONLY a JSON array of objects with this exact format:
[
  {
    "text": "Your icebreaker question here?",
    "category": "fun|professional|creative|personal",
    "difficulty": "easy|medium|hard"
  }
]`;

    const response = await fetch('https://api.openai.com/v1/chat/completions', {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${openAIApiKey}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        model: 'gpt-3.5-turbo',
        messages: [
          { role: 'system', content: systemPrompt },
          { role: 'user', content: 'Generate personalized icebreaker questions for this profile and event.' }
        ],
        temperature: 0.8,
        max_tokens: 1500,
      }),
    });

    if (!response.ok) {
      const errorText = await response.text();
      console.error(`OpenAI API error: ${response.status}`, errorText);
      console.error('Request headers:', {
        'Authorization': `Bearer ${openAIApiKey ? 'PRESENT' : 'MISSING'}`,
        'Content-Type': 'application/json',
      });
      console.error('Request body model:', 'gpt-3.5-turbo');
      
      // Return a structured error response instead of throwing
      return new Response(JSON.stringify({ 
        error: `OpenAI API error: ${response.status}`,
        details: errorText,
        isRateLimit: response.status === 429,
        fallbackRequired: true 
      }), {
        status: 200, // Return 200 so the client can handle it gracefully
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
      });
    }

    const data = await response.json();
    const generatedContent = data.choices[0].message.content;
    
    console.log('Generated content:', generatedContent);
    
    // Parse the JSON response
    let icebreakers;
    try {
      icebreakers = JSON.parse(generatedContent);
    } catch (parseError) {
      console.error('Failed to parse JSON:', parseError);
      // Fallback to basic icebreakers if parsing fails
      icebreakers = [
        { text: "What's the most interesting thing that happened to you this week?", category: "personal", difficulty: "easy" },
        { text: "If you could have dinner with anyone, who would it be and why?", category: "fun", difficulty: "medium" },
        { text: "What's a skill you'd love to learn?", category: "personal", difficulty: "easy" },
        { text: "What's the best advice you've ever received?", category: "personal", difficulty: "medium" },
        { text: "If you could travel anywhere right now, where would you go?", category: "fun", difficulty: "easy" },
        { text: "What's something you're passionate about that might surprise people?", category: "personal", difficulty: "hard" }
      ];
    }

    return new Response(JSON.stringify({ icebreakers }), {
      headers: { ...corsHeaders, 'Content-Type': 'application/json' },
    });
  } catch (error) {
    console.error('Error in generate-icebreakers function:', error);
    return new Response(JSON.stringify({ error: error.message }), {
      status: 500,
      headers: { ...corsHeaders, 'Content-Type': 'application/json' },
    });
  }
});