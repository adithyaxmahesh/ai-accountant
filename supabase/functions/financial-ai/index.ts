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
    
    if (!message || !userId) {
      throw new Error('Message and userId are required');
    }

    const supabaseUrl = Deno.env.get('SUPABASE_URL');
    const supabaseKey = Deno.env.get('SUPABASE_SERVICE_ROLE_KEY');
    
    if (!supabaseUrl || !supabaseKey) {
      throw new Error('Missing Supabase environment variables');
    }

    const supabase = createClient(supabaseUrl, supabaseKey);

    // Get financial context
    const { data: financialContext, error: contextError } = await supabase
      .from('financial_health_metrics')
      .select('*')
      .eq('user_id', userId)
      .single();

    if (contextError) {
      console.error('Error fetching financial context:', contextError);
    }

    const openAIApiKey = Deno.env.get('OPENAI_API_KEY2');
    if (!openAIApiKey) {
      throw new Error('OpenAI API key not configured');
    }

    console.log('Sending request to OpenAI...');
    const openAIResponse = await fetch('https://api.openai.com/v1/chat/completions', {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${openAIApiKey}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        model: 'gpt-4',
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
            content: `Context: ${JSON.stringify(financialContext || {})}
            
            Question: ${message}`
          }
        ],
        temperature: 0.7,
        max_tokens: 500,
      }),
    });

    if (!openAIResponse.ok) {
      const errorData = await openAIResponse.text();
      console.error('OpenAI API error:', errorData);
      throw new Error(`OpenAI API error: ${openAIResponse.status}`);
    }

    const aiData = await openAIResponse.json();
    console.log('Successfully received OpenAI response');
    const advice = aiData.choices[0].message.content;

    // Determine category based on content
    const category = advice.includes('TAX') ? 'Tax' :
                    advice.includes('INVESTMENT') ? 'Investment' :
                    advice.includes('OPERATIONS') ? 'Operations' :
                    'Planning';

    // Store the interaction
    const { error: insertError } = await supabase
      .from('ai_financial_advice')
      .insert({
        user_id: userId,
        category,
        advice,
        confidence_score: 0.9,
        data_points: financialContext
      });

    if (insertError) {
      console.error('Error storing advice:', insertError);
    }

    return new Response(
      JSON.stringify({ advice, category }),
      { 
        headers: { 
          ...corsHeaders, 
          'Content-Type': 'application/json' 
        } 
      }
    );
  } catch (error) {
    console.error('Error in financial-ai function:', error);
    let errorMessage = 'Failed to process your question.';
    
    if (error.message?.includes('Rate limit')) {
      errorMessage = 'You have reached the rate limit for chat requests. Please try again later.';
    } else if (error.message?.includes('insufficient_quota')) {
      errorMessage = 'The monthly API quota has been reached. Please try again next month.';
    }

    return new Response(
      JSON.stringify({ error: errorMessage }),
      { 
        headers: { ...corsHeaders, 'Content-Type': 'application/json' }, 
        status: 500 
      }
    );
  }
});