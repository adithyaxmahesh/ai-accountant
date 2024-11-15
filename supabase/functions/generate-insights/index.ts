import { serve } from "https://deno.land/std@0.168.0/http/server.ts"
import { createClient } from 'https://esm.sh/@supabase/supabase-js@2.7.1'
import "https://deno.land/x/xhr@0.1.0/mod.ts"

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
}

serve(async (req) => {
  if (req.method === 'OPTIONS') {
    return new Response(null, { headers: corsHeaders })
  }

  try {
    const { userId } = await req.json()

    const supabase = createClient(
      Deno.env.get('SUPABASE_URL') ?? '',
      Deno.env.get('SUPABASE_SERVICE_ROLE_KEY') ?? ''
    )

    // Get user's financial data
    const { data: balanceSheet } = await supabase
      .from('balance_sheet_items')
      .select('*')
      .eq('user_id', userId)

    const { data: revenueRecords } = await supabase
      .from('revenue_records')
      .select('*')
      .eq('user_id', userId)

    // Analyze with OpenAI
    const response = await fetch('https://api.openai.com/v1/chat/completions', {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${Deno.env.get('OPENAI_API_KEY')}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        model: 'gpt-4o-mini',
        messages: [
          {
            role: 'system',
            content: 'You are an AI financial advisor. Analyze this financial data and provide insights.'
          },
          {
            role: 'user',
            content: JSON.stringify({ balanceSheet, revenueRecords })
          }
        ],
      }),
    })

    const analysis = await response.json()
    const insights = analysis.choices[0].message.content

    // Store insights
    await supabase
      .from('ai_insights')
      .insert({
        user_id: userId,
        category: 'financial_analysis',
        insight: insights,
        confidence_score: 0.95
      })

    return new Response(
      JSON.stringify({ success: true, insights }),
      { headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
    )
  } catch (error) {
    console.error('Error:', error)
    return new Response(
      JSON.stringify({ error: error.message }),
      { headers: { ...corsHeaders, 'Content-Type': 'application/json' }, status: 500 }
    )
  }
})