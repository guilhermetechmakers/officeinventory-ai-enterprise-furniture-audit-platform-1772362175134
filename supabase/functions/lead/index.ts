/**
 * Lead capture Edge Function
 * POST /functions/v1/lead
 * Accepts demo/trial request payload, validates, and stores in leads table.
 * Required: leads table with columns: full_name, email, company, job_title, phone, message, consent, created_at
 *
 * To deploy: supabase functions deploy lead
 * Set VITE_API_URL to https://<project-ref>.supabase.co/functions/v1 for frontend
 */
import { createClient } from 'https://esm.sh/@supabase/supabase-js@2'

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
}

const leadSchema = {
  fullName: (v: unknown) => typeof v === 'string' && v.length >= 2,
  email: (v: unknown) => typeof v === 'string' && /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(v),
  company: (v: unknown) => typeof v === 'string' && v.length >= 1,
  jobTitle: (v: unknown) => typeof v === 'string' && v.length >= 1,
  phone: (v: unknown) => v === undefined || v === null || (typeof v === 'string' && v.length <= 50),
  message: (v: unknown) => v === undefined || v === null || (typeof v === 'string' && v.length <= 1000),
  consent: (v: unknown) => v === true,
}

function sanitize(str: string): string {
  return str.replace(/[<>]/g, '').trim().slice(0, 500)
}

Deno.serve(async (req) => {
  if (req.method === 'OPTIONS') {
    return new Response('ok', { headers: corsHeaders })
  }

  if (req.method !== 'POST') {
    return new Response(
      JSON.stringify({ success: false, message: 'Method not allowed' }),
      { status: 405, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
    )
  }

  try {
    const body = await req.json()
    const fullName = body?.fullName ?? ''
    const email = body?.email ?? ''
    const company = body?.company ?? ''
    const jobTitle = body?.jobTitle ?? ''
    const phone = body?.phone
    const message = body?.message
    const consent = body?.consent

    if (!leadSchema.fullName(fullName)) {
      return new Response(
        JSON.stringify({ success: false, message: 'Invalid full name' }),
        { status: 400, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      )
    }
    if (!leadSchema.email(email)) {
      return new Response(
        JSON.stringify({ success: false, message: 'Invalid email' }),
        { status: 400, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      )
    }
    if (!leadSchema.company(company)) {
      return new Response(
        JSON.stringify({ success: false, message: 'Company is required' }),
        { status: 400, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      )
    }
    if (!leadSchema.jobTitle(jobTitle)) {
      return new Response(
        JSON.stringify({ success: false, message: 'Job title is required' }),
        { status: 400, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      )
    }
    if (!leadSchema.consent(consent)) {
      return new Response(
        JSON.stringify({ success: false, message: 'Consent is required' }),
        { status: 400, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      )
    }
    if (!leadSchema.phone(phone) || !leadSchema.message(message)) {
      return new Response(
        JSON.stringify({ success: false, message: 'Invalid optional fields' }),
        { status: 400, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      )
    }

    const supabaseUrl = Deno.env.get('SUPABASE_URL') ?? ''
    const supabaseKey = Deno.env.get('SUPABASE_SERVICE_ROLE_KEY') ?? ''
    if (!supabaseUrl || !supabaseKey) {
      return new Response(
        JSON.stringify({ success: false, message: 'Server configuration error' }),
        { status: 500, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      )
    }

    const supabase = createClient(supabaseUrl, supabaseKey)

    const { data, error } = await supabase
      .from('leads')
      .insert({
        full_name: sanitize(fullName),
        email: sanitize(email),
        company: sanitize(company),
        job_title: sanitize(jobTitle),
        phone: phone ? sanitize(String(phone)) : null,
        message: message ? sanitize(String(message)) : null,
        consent: !!consent,
      })
      .select('id')
      .single()

    if (error) {
      console.error('Lead insert error:', error)
      return new Response(
        JSON.stringify({ success: false, message: 'Failed to save lead' }),
        { status: 500, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      )
    }

    return new Response(
      JSON.stringify({ success: true, id: data?.id }),
      { status: 200, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
    )
  } catch (err) {
    console.error('Lead handler error:', err)
    return new Response(
      JSON.stringify({ success: false, message: 'Internal server error' }),
      { status: 500, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
    )
  }
})
