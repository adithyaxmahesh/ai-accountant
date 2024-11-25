import { serve } from "https://deno.land/std@0.168.0/http/server.ts"
import { createClient } from 'https://esm.sh/@supabase/supabase-js@2.7.1'
import { performRiskAssessment } from './riskAssessment.ts'
import { testInternalControls } from './controlTests.ts'
import { detectAnomalies } from './anomalyDetection.ts'
import { AuditData } from './types.ts'

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
}

serve(async (req) => {
  // Handle CORS preflight requests
  if (req.method === 'OPTIONS') {
    return new Response(null, { headers: corsHeaders })
  }

  try {
    const { auditId } = await req.json()
    console.log('Starting automated audit for audit ID:', auditId)
    
    const supabaseClient = createClient(
      Deno.env.get('SUPABASE_URL') ?? '',
      Deno.env.get('SUPABASE_SERVICE_ROLE_KEY') ?? ''
    )

    // Fetch audit data and related transactions
    const { data: audit, error: fetchError } = await supabaseClient
      .from('audit_reports')
      .select(`
        *,
        audit_items (*)
      `)
      .eq('id', auditId)
      .single()

    if (fetchError) {
      console.error('Error fetching audit data:', fetchError)
      throw fetchError
    }

    if (!audit) {
      throw new Error('Audit not found')
    }

    console.log('Fetched audit data, starting analysis...')

    // 1. Risk Assessment
    const riskScores = await performRiskAssessment(audit as AuditData)
    console.log('Risk assessment completed:', riskScores)
    
    // 2. Control Testing
    const controlEffectiveness = await testInternalControls(audit as AuditData, supabaseClient)
    console.log('Control testing completed:', controlEffectiveness)
    
    // 3. Anomaly Detection
    const anomalies = detectAnomalies(audit as AuditData)
    console.log('Anomaly detection completed:', anomalies)
    
    // Generate summary and recommendations
    const summary = {
      overallRisk: riskScores.overallScore > 0.5 ? 'High' : 'Low',
      controlStatus: controlEffectiveness.overallEffectiveness > 0.7 ? 'Effective' : 'Needs Improvement',
      anomalyCount: anomalies.count,
      timestamp: new Date().toISOString()
    }

    const recommendations = [
      ...(riskScores.overallScore > 0.5 ? ['Implement additional risk monitoring procedures'] : []),
      ...(controlEffectiveness.overallEffectiveness < 0.7 ? ['Strengthen internal control framework'] : []),
      ...(anomalies.count > 0 ? ['Review and investigate identified anomalies'] : [])
    ]

    // 4. Update audit report with findings
    const { error: updateError } = await supabaseClient
      .from('audit_reports')
      .update({
        automated_analysis: {
          completed_at: new Date().toISOString(),
          summary,
          recommendations
        },
        risk_scores: riskScores,
        control_effectiveness: controlEffectiveness,
        anomaly_detection: anomalies,
        status: 'completed'
      })
      .eq('id', auditId)

    if (updateError) {
      console.error('Error updating audit report:', updateError)
      throw updateError
    }

    console.log('Automated audit completed successfully')

    return new Response(
      JSON.stringify({ 
        success: true,
        riskScores,
        controlEffectiveness,
        anomalies,
        summary,
        recommendations
      }),
      { 
        headers: { 
          ...corsHeaders, 
          'Content-Type': 'application/json' 
        } 
      }
    )
  } catch (error) {
    console.error('Error in automated audit:', error)
    return new Response(
      JSON.stringify({ error: error.message }),
      { 
        headers: { 
          ...corsHeaders, 
          'Content-Type': 'application/json' 
        }, 
        status: 400 
      }
    )
  }
})