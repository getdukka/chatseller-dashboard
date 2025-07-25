// composables/useSupabase.ts - COMPOSABLE SUPABASE MANUEL
import { createClient } from '@supabase/supabase-js'

let supabaseClient: any = null

export const useSupabase = () => {
  if (supabaseClient) {
    return supabaseClient
  }

  const config = useRuntimeConfig()
  
  // ✅ CRÉER LE CLIENT SUPABASE MANUELLEMENT
  supabaseClient = createClient(
    config.public.supabaseUrl,
    config.public.supabaseAnonKey
  )

  console.log('✅ Supabase client créé avec:', {
    url: config.public.supabaseUrl,
    hasKey: !!config.public.supabaseAnonKey
  })

  return supabaseClient
}

// ✅ ALIAS POUR COMPATIBILITÉ
export const useSupabaseClient = useSupabase