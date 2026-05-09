import { createBrowserClient } from '@supabase/ssr'

const FALLBACK_URL = 'https://placeholder.supabase.co'
const FALLBACK_KEY = 'placeholder-anon-key'

export function createClient() {
  return createBrowserClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL || FALLBACK_URL,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY || FALLBACK_KEY,
  )
}
