/**
 * Lead submission API.
 * Uses Supabase Edge Function when configured, else POST /api/lead.
 * Configure VITE_API_URL to point to your backend or Supabase function URL.
 */

import { supabase } from '@/lib/supabase'

export interface LeadSubmission {
  fullName: string
  email: string
  company: string
  jobTitle: string
  phone?: string
  message?: string
  consent: boolean
}

export interface LeadResponse {
  success: boolean
  id?: string
  message?: string
}

export async function submitLead(payload: LeadSubmission): Promise<LeadResponse> {
  const supabaseUrl = import.meta.env.VITE_SUPABASE_URL
  const useSupabase = Boolean(supabaseUrl)

  if (useSupabase) {
    const { data, error } = await supabase.functions.invoke<LeadResponse>('submit-lead', {
      body: payload,
    })
    if (error) throw new Error(error.message ?? 'Submission failed')
    const result = data ?? { success: false }
    if (!result.success && !result.message) throw new Error('Submission failed')
    return result
  }

  const API_BASE = import.meta.env.VITE_API_URL ?? '/api'
  const response = await fetch(`${API_BASE}/lead`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    credentials: 'include',
    body: JSON.stringify(payload),
  })

  if (!response.ok) {
    const data = await response.json().catch(() => ({}))
    throw new Error((data as { message?: string })?.message ?? response.statusText ?? 'Submission failed')
  }

  return response.json() as Promise<LeadResponse>
}
