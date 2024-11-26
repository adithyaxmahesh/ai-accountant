import "https://deno.land/x/xhr@0.1.0/mod.ts";
import { serve } from "https://deno.land/std@0.168.0/http/server.ts";
import { createClient } from 'https://esm.sh/@supabase/supabase-js@2.7.1';

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
};

serve(async (req) => {
  if (req.method === 'OPTIONS') {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    const { message, userId } = await req.json();

    const supabase = createClient(
      Deno.env.get('SUPABASE_URL') ?? '',
      Deno.env.get('SUPABASE_SERVICE_ROLE_KEY') ?? ''
    );

    // Get financial context
    const { data: financialContext } = await supabase
      .from('financial_health_metrics')
      .select('*')
      .eq('user_id', userId)
      .single();

    const openAIApiKey = Deno.env.get('OPENAI_API_KEY2');
    if (!openAIApiKey) {
      throw new Error('OpenAI API key not configured');
    }

    const response = await fetch('https://api.openai.com/v1/chat/completions', {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${openAIApiKey}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        model: 'gpt-4o-mini',
        messages: [
          {
            role: 'system',
            content: `You are an AI financial advisor. Analyze the user's financial context and provide specific, actionable advice.
            When giving advice, consider:
            - Current financial health metrics
            - Business growth opportunities
            - Risk management
            - Tax implications
            Categorize your responses into: PLANNING, INVESTMENT, TAX, or OPERATIONS.`
          },
          {
            role: 'user',
            content: `Context: ${JSON.stringify(financialContext)}
            
            Question: ${message}`
          }
        ],
      }),
    });

    const aiResponse = await response.json();
    const advice = aiResponse.choices[0].message.content;

    // Determine category based on content
    const category = advice.includes('TAX') ? 'Tax' :
                    advice.includes('INVESTMENT') ? 'Investment' :
                    advice.includes('OPERATIONS') ? 'Operations' :
                    'Planning';

    // Store the interaction
    await supabase
      .from('ai_financial_advice')
      .insert({
        user_id: userId,
        category,
        advice,
        confidence_score: 0.9,
        data_points: financialContext
      });

    return new Response(
      JSON.stringify({ advice, category }),
      { headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
    );
  } catch (error) {
    console.error('Error in financial-ai function:', error);
    return new Response(
      JSON.stringify({ error: error.message }),
      { headers: { ...corsHeaders, 'Content-Type': 'application/json' }, status: 500 }
    );
  }
});