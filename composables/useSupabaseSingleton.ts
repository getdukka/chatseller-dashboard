// composables/useSupabaseSingleton.ts - COMPOSABLE SINGLETON POUR ÉVITER CONFLITS

import { createClient } from '@supabase/supabase-js'

let supabaseInstance: any = null

export const useSupabaseSingleton = () => {
  // ✅ RETOURNER L'INSTANCE EXISTANTE SI DÉJÀ CRÉÉE
  if (supabaseInstance) {
    return supabaseInstance
  }

  // ✅ CRÉER UNE NOUVELLE INSTANCE SEULEMENT SI NÉCESSAIRE
  const config = useRuntimeConfig()
  
  supabaseInstance = createClient(
    config.public.supabaseUrl,
    config.public.supabaseAnonKey,
    {
      auth: {
        autoRefreshToken: true,
        persistSession: true,
        detectSessionInUrl: true,
        // ✅ CONFIGURATION POUR ÉVITER LES CONFLITS
        storageKey: 'chatseller-auth-token',
        storage: process.client ? window.localStorage : undefined
      }
    }
  )

  console.log('✅ [Supabase Singleton] Instance créée (AUTH SEULEMENT)')
  console.log('⚠️ [Supabase Singleton] Utilisez useApi() pour les données')

  return supabaseInstance
}

// ✅ ALIAS POUR COMPATIBILITÉ AVEC L'EXISTANT
export const useSupabaseClient = useSupabaseSingleton