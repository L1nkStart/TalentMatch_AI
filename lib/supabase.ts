import { createClient } from "@supabase/supabase-js"

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL!
const supabaseKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!

export const supabase = createClient(supabaseUrl, supabaseKey)

export type Candidate = {
  id: string
  email: string
  full_name: string
  phone?: string
  department?: string
  education_level?: string
  hierarchical_level?: string
  skills: string[]
  executive_summary?: string
  relevance_score: number
  resume_url?: string
  processed_at: string
  created_at: string
  updated_at: string
}
