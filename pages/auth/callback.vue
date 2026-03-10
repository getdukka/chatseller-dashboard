<!-- pages/auth/callback.vue -->
<template>
  <div class="min-h-screen bg-gradient-to-br from-rose-50 via-white to-rose-50 flex items-center justify-center">
    <div class="max-w-md w-full mx-4">

      <!-- Loading State -->
      <div v-if="loading" class="bg-white rounded-xl shadow-xl border border-gray-100 p-8 text-center">
        <div class="flex justify-center mb-4">
          <div class="w-16 h-16 bg-rose-100 rounded-full flex items-center justify-center">
            <svg class="animate-spin w-8 h-8 text-rose-600" fill="none" viewBox="0 0 24 24">
              <circle class="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" stroke-width="4"></circle>
              <path class="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
            </svg>
          </div>
        </div>
        <h2 class="text-xl font-semibold text-gray-900 mb-2">Connexion en cours...</h2>
        <p class="text-sm text-gray-500">{{ currentStep }}</p>
      </div>

      <!-- Error State -->
      <div v-else class="bg-white rounded-xl shadow-xl border border-gray-100 p-8 text-center">
        <div class="flex justify-center mb-4">
          <div class="w-16 h-16 bg-amber-100 rounded-full flex items-center justify-center">
            <svg class="w-8 h-8 text-amber-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 9v2m0 4h.01M10.29 3.86L1.82 18a2 2 0 001.71 3h16.94a2 2 0 001.71-3L13.71 3.86a2 2 0 00-3.42 0z"/>
            </svg>
          </div>
        </div>
        <h2 class="text-xl font-semibold text-gray-900 mb-2">Lien expiré</h2>
        <p class="text-gray-600 mb-2">Ce lien de confirmation n'est plus valide.</p>
        <p class="text-sm text-gray-500 mb-6">Connectez-vous directement avec votre email et mot de passe.</p>
        <div class="space-y-3">
          <NuxtLink to="/login" class="w-full inline-flex justify-center items-center px-4 py-3 bg-rose-600 text-white font-medium rounded-lg hover:bg-rose-700 transition-colors">
            Se connecter
          </NuxtLink>
          <NuxtLink to="/register" class="w-full inline-flex justify-center items-center px-4 py-2 border border-gray-300 text-gray-500 text-sm rounded-lg hover:bg-gray-50 transition-colors">
            Créer un compte
          </NuxtLink>
        </div>
      </div>

    </div>
  </div>
</template>

<script setup lang="ts">
/**
 * ARCHITECTURE CALLBACK AUTH
 *
 * Problem: The singleton Supabase client (useSupabase) uses detectSessionInUrl: true.
 * On the callback page, Supabase's _initialize() tries to process the URL tokens
 * via getUser() network call. If this call hangs (network, rate limit, expired token),
 * initializePromise never resolves → ALL auth methods block forever (setSession,
 * getSession, onAuthStateChange's INITIAL_SESSION callback — they all await initializePromise).
 *
 * Solution: Create a DEDICATED lightweight Supabase client for the callback page only.
 * - persistSession: false → no localStorage read/write → no stale session recovery
 * - detectSessionInUrl: false → no automatic URL processing → initializePromise resolves instantly
 * - We process the tokens manually with our own timeouts
 * - On success, we persist the session to the MAIN singleton client's localStorage
 *   so the rest of the app picks it up seamlessly
 */

import { createClient } from '@supabase/supabase-js'
import { useAuthStore } from '~~/stores/auth'

definePageMeta({ layout: false })

const config = useRuntimeConfig()
const authStore = useAuthStore()

// Lightweight Supabase client — initializePromise resolves instantly
const callbackSupabase = createClient(
  config.public.supabaseUrl,
  config.public.supabaseAnonKey,
  {
    auth: {
      autoRefreshToken: false,
      persistSession: false,
      detectSessionInUrl: false
    }
  }
)

const loading = ref(true)
const currentStep = ref('Vérification de votre identité...')

// ─── Persist session to main singleton's localStorage ────────────────────────
// So the rest of the app (middleware, plugins, composables) picks it up.
const persistSessionToStorage = (session: any) => {
  try {
    // Supabase stores the session under key: sb-<project-ref>-auth-token
    const projectRef = config.public.supabaseUrl
      .replace('https://', '')
      .split('.')[0]
    const storageKey = `sb-${projectRef}-auth-token`

    localStorage.setItem(storageKey, JSON.stringify({
      access_token: session.access_token,
      refresh_token: session.refresh_token,
      expires_at: session.expires_at,
      expires_in: session.expires_in,
      token_type: session.token_type,
      user: session.user
    }))
    console.log('✅ [Callback] Session persistée dans localStorage:', storageKey)
  } catch (err) {
    console.warn('[Callback] Erreur persistance localStorage:', err)
  }
}

// ─── MAIN HANDLER ────────────────────────────────────────────────────────────
onMounted(async () => {
  let done = false

  const redirectUser = async (session: any) => {
    if (done) return
    done = true

    // Persist to localStorage for the main Supabase singleton
    persistSessionToStorage(session)

    // Sync auth store in background
    authStore.restoreSession().catch(() => {})

    // New user = account created less than 5 minutes ago
    const createdAt = new Date(session.user.created_at).getTime()
    const isNew = (Date.now() - createdAt) < 5 * 60 * 1000

    console.log('✅ [Callback] Redirection:', isNew ? 'onboarding' : 'dashboard')
    await navigateTo(isNew ? '/onboarding?from=oauth&welcome=true' : '/')
  }

  const fail = (reason: string) => {
    if (done) return
    done = true
    loading.value = false
    console.error('❌ [Callback] Échec:', reason)
  }

  // Global timeout
  const timer = setTimeout(() => fail('Timeout 10s'), 10000)

  try {
    // ── Parse URL ───────────────────────────────────────────────────────
    const search = new URLSearchParams(window.location.search)
    const hash   = new URLSearchParams(window.location.hash.slice(1))

    const code         = search.get('code')
    const tokenHash    = search.get('token_hash')
    const type         = search.get('type') || 'email'
    const errorParam   = search.get('error') || hash.get('error')
    const accessToken  = hash.get('access_token')
    const refreshToken = hash.get('refresh_token') || ''

    console.log('[Callback] URL params:', {
      code: !!code, tokenHash: !!tokenHash, accessToken: !!accessToken, type, error: errorParam
    })

    // Error from provider
    if (errorParam) {
      clearTimeout(timer)
      fail(search.get('error_description') || hash.get('error_description') || errorParam)
      return
    }

    // No auth params
    if (!code && !tokenHash && !accessToken) {
      clearTimeout(timer)
      fail('Pas de token dans l\'URL')
      await navigateTo('/login')
      return
    }

    // ── #access_token= (Google OAuth implicit flow) ─────────────────────
    if (accessToken) {
      console.log('🔑 [Callback] access_token → setSession...')
      currentStep.value = 'Connexion Google en cours...'

      const { data, error } = await callbackSupabase.auth.setSession({
        access_token: accessToken,
        refresh_token: refreshToken
      })

      clearTimeout(timer)

      if (error) {
        fail(`setSession: ${error.message}`)
        return
      }
      if (data?.session?.user) {
        await redirectUser(data.session)
      } else {
        fail('Pas de session après setSession')
      }
      return
    }

    // ── ?code= (PKCE flow) ──────────────────────────────────────────────
    if (code) {
      console.log('🔑 [Callback] PKCE code → exchangeCodeForSession...')
      currentStep.value = 'Connexion Google en cours...'

      // The PKCE code_verifier was stored by the main Supabase client
      // when signInWithOAuth was called. Read it from localStorage.
      const projectRef = config.public.supabaseUrl
        .replace('https://', '')
        .split('.')[0]
      const verifierKey = `sb-${projectRef}-auth-token-code-verifier`
      const codeVerifier = localStorage.getItem(verifierKey)

      console.log('[Callback] PKCE verifier found:', !!codeVerifier)

      // Use the main client's exchangeCodeForSession since it has the verifier
      // But if it hangs, we need a workaround. Try direct API call instead.
      const response = await fetch(`${config.public.supabaseUrl}/auth/v1/token?grant_type=authorization_code`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'apikey': config.public.supabaseAnonKey
        },
        body: JSON.stringify({
          auth_code: code,
          code_verifier: codeVerifier || ''
        })
      })

      clearTimeout(timer)

      if (!response.ok) {
        const body = await response.text()
        console.error('[Callback] PKCE exchange failed:', response.status, body)
        fail(`Échange PKCE: ${response.status}`)
        return
      }

      const tokenData = await response.json()
      if (tokenData.access_token && tokenData.user) {
        // Build a session-like object and persist it
        const session = {
          access_token: tokenData.access_token,
          refresh_token: tokenData.refresh_token,
          expires_at: tokenData.expires_at,
          expires_in: tokenData.expires_in,
          token_type: tokenData.token_type || 'bearer',
          user: tokenData.user
        }
        // Clean up the code verifier
        if (codeVerifier) localStorage.removeItem(verifierKey)
        await redirectUser(session)
      } else {
        fail('Réponse PKCE invalide')
      }
      return
    }

    // ── ?token_hash= (email confirmation) ────────────────────────────────
    if (tokenHash) {
      console.log('🔑 [Callback] token_hash → verifyOtp...')
      currentStep.value = 'Vérification de votre email...'

      const { data, error } = await callbackSupabase.auth.verifyOtp({
        token_hash: tokenHash,
        type: type as any
      })

      clearTimeout(timer)

      if (error) {
        fail(`verifyOtp: ${error.message}`)
        return
      }
      if (data?.session?.user) {
        await redirectUser(data.session)
      } else {
        fail('Pas de session après verifyOtp')
      }
      return
    }

  } catch (err: any) {
    clearTimeout(timer)
    fail(err.message || 'Erreur inattendue')
  }
})

useHead({
  title: 'Connexion | ChatSeller',
  meta: [{ name: 'robots', content: 'noindex' }]
})
</script>

<style scoped>
@keyframes spin {
  from { transform: rotate(0deg); }
  to   { transform: rotate(360deg); }
}
.animate-spin { animation: spin 1s linear infinite; }
</style>
