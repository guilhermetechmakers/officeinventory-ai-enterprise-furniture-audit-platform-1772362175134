-- Lead capture table for demo/trial requests
-- Run with: supabase db push (or apply via Supabase dashboard)

CREATE TABLE IF NOT EXISTS public.leads (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  full_name TEXT NOT NULL,
  email TEXT NOT NULL,
  company TEXT NOT NULL,
  job_title TEXT NOT NULL,
  phone TEXT,
  message TEXT,
  consent BOOLEAN NOT NULL DEFAULT false,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

-- Enable RLS - only service role (Edge Functions) can insert; anon/authenticated cannot
ALTER TABLE public.leads ENABLE ROW LEVEL SECURITY;

-- No INSERT policy for anon/authenticated - Edge Function uses service role which bypasses RLS

COMMENT ON TABLE public.leads IS 'Demo/trial request leads from landing page';
