// composables/useSupabase.ts 

import { createClient } from '@supabase/supabase-js'

let supabaseClient: any = null

export const useSupabase = () => {
  if (supabaseClient) {
    return supabaseClient
  }

  const config = useRuntimeConfig()
  
  // ✅ CRÉER LE CLIENT SUPABASE UNIQUEMENT POUR L'AUTHENTIFICATION
  supabaseClient = createClient(
    config.public.supabaseUrl,
    config.public.supabaseAnonKey,
    {
      auth: {
        autoRefreshToken: true,
        persistSession: true,
        detectSessionInUrl: true
      }
      // ✅ PAS DE CONFIGURATION DB - SEULEMENT AUTH
    }
  )

  console.log('✅ Supabase client créé (AUTH SEULEMENT) avec:', {
    url: config.public.supabaseUrl,
    hasKey: !!config.public.supabaseAnonKey
  })

  // ✅ AVERTISSEMENT : Ce client ne doit être utilisé QUE pour l'authentification
  console.log('⚠️ IMPORTANT: Ce client Supabase est configuré UNIQUEMENT pour l\'authentification')
  console.log('📡 Pour les données, utilisez useApi() qui passe par l\'API backend')

  return supabaseClient
}

// ✅ ALIAS POUR COMPATIBILITÉ
export const useSupabaseClient = useSupabase

// ✅ FONCTION UTILITAIRE POUR VÉRIFIER L'AUTHENTIFICATION
export const useSupabaseAuth = () => {
  const supabase = useSupabase()
  
  return {
    // Auth functions only
    signIn: supabase.auth.signInWithPassword.bind(supabase.auth),
    signUp: supabase.auth.signUp.bind(supabase.auth),
    signOut: supabase.auth.signOut.bind(supabase.auth),
    getUser: supabase.auth.getUser.bind(supabase.auth),
    getSession: supabase.auth.getSession.bind(supabase.auth),
    refreshSession: supabase.auth.refreshSession.bind(supabase.auth),
    resetPasswordForEmail: supabase.auth.resetPasswordForEmail.bind(supabase.auth),
    updateUser: supabase.auth.updateUser.bind(supabase.auth),
    
    // Auth event listeners
    onAuthStateChange: supabase.auth.onAuthStateChange.bind(supabase.auth)
  }
}