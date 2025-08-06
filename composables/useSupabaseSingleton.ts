// composables/useSupabaseSingleton.ts - CLIENT SUPABASE SINGLETON
import { createClient } from '@supabase/supabase-js'

let supabaseInstance: any = null

export const useSupabaseSingleton = () => {
  if (supabaseInstance) {
    return supabaseInstance
  }

  const config = useRuntimeConfig()
  
  // ✅ CRÉER UNE SEULE INSTANCE GLOBALE
  supabaseInstance = createClient(
    config.public.supabaseUrl,
    config.public.supabaseAnonKey,
    {
      auth: {
        persistSession: true,
        autoRefreshToken: true,
        detectSessionInUrl: true
      }
    }
  )
  
  console.log('🔧 [SUPABASE] Instance singleton créée')
  return supabaseInstance
}