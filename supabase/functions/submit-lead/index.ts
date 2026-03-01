/**
 * Supabase Edge Function: submit-lead
 * Accepts demo/trial request payloads and stores them.
 * Endpoint: POST /functions/v1/submit-lead
 * Required secrets: none (uses Supabase client from request)
 *
 * To deploy: supabase functions deploy submit-lead
 * To test locally: supabase functions serve submit-lead
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
  consent: (v: unknown) => v === true,
}

function sanitize(str: string): string {
  return str.replace(/[<>]/g, '').slice(0, 1000)
}

Deno.serve(async (req) => {
  if (req.method === 'OPTIONS') {
    return new Response('ok', { headers: corsHeaders })
  }

  if (req.method !== 'POST') {
    return new Response(JSON.stringify({ success: false, message: 'Method not allowed' }), {
      status: 405,
      headers: { ...corsHeaders, 'Content-Type': 'application/json' },
    })
  }

  try {
    const body = await req.json()
    const fullName = body?.fullName ?? ''
    const email = body?.email ?? ''
    const company = body?.company ?? ''
    const jobTitle = body?.jobTitle ?? ''
    const phone = body?.phone ?? ''
    const message = body?.message ?? ''
    const consent = body?.consent === true

    if (!leadSchema.fullName(fullName)) {
      return new Response(JSON.stringify({ success: false, message: 'Invalid fullName' }), {
        status: 400,
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
      })
    }
    if (!leadSchema.email(email)) {
      return new Response(JSON.stringify({ success: false, message: 'Invalid email' }), {
        status: 400,
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
      })
    }
    if (!leadSchema.company(company)) {
      return new Response(JSON.stringify({ success: false, message: 'Invalid company' }), {
        status: 400,
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
      })
    }
    if (!leadSchema.jobTitle(jobTitle)) {
      return new Response(JSON.stringify({ success: false, message: 'Invalid jobTitle' }), {
        status: 400,
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
      })
    }
    if (!leadSchema.consent(consent)) {
      return new Response(JSON.stringify({ success: false, message: 'Consent required' }), {
        status: 400,
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
      })
    }

    const supabaseUrl = Deno.env.get('SUPABASE_URL') ?? ''
    const supabaseKey = Deno.env.get('SUPABASE_SERVICE_ROLE_KEY') ?? ''

    if (!supabaseUrl || !supabaseKey) {
      return new Response(
        JSON.stringify({ success: true, id: 'stub', message: 'Lead received (storage not configured)' }),
        { status: 200, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
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
        message: message ? sanitize(message) : null,
        consent,
      })
      .select('id')
      .single()

    if (error) {
      return new Response(
        JSON.stringify({ success: false, message: error.message ?? 'Database error' }),
        { status: 500, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      )
    }

    return new Response(
      JSON.stringify({ success: true, id: data?.id ?? 'unknown' }),
      { status: 200, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
    )
  } catch (e) {
    return new Response(
      JSON.stringify({ success: false, message: 'Invalid request body' }),
      { status: 400, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
    )
  }
})
