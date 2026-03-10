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
 * CALLBACK AUTH — ZERO SDK DEPENDENCY
 *
 * Problem diagnosed across 4 iterations:
 * - The Supabase JS SDK's setSession() internally calls getUser() (network)
 * - This network call hangs from Vercel production (works locally)
 * - ALL SDK methods (setSession, getSession, onAuthStateChange) are blocked
 *   because they all await initializePromise which also makes network calls
 * - Even a dedicated lightweight client with detectSessionInUrl:false hangs
 *   because setSession() itself calls getUser()
 *
 * Solution: BYPASS THE SDK ENTIRELY for session establishment.
 * 1. Parse tokens directly from URL (no SDK)
 * 2. Decode the JWT locally to extract user info (no network call)
 * 3. For PKCE: direct fetch() to /auth/v1/token (no SDK, with AbortController timeout)
 * 4. For token_hash: direct fetch() to /auth/v1/verify (no SDK)
 * 5. Write session to localStorage in Supabase's format
 * 6. Redirect — the rest of the app picks up the session from localStorage
 */

import { useAuthStore } from '~~/stores/auth'

definePageMeta({ layout: false })

const config = useRuntimeConfig()
const authStore = useAuthStore()

const loading = ref(true)
const currentStep = ref('Vérification de votre identité...')

// ─── Helpers ─────────────────────────────────────────────────────────────────

const getSupabaseStorageKey = () => {
  const projectRef = config.public.supabaseUrl
    .replace('https://', '')
    .split('.')[0]
  return `sb-${projectRef}-auth-token`
}

/** Decode a JWT payload without any library */
const decodeJwtPayload = (token: string): any => {
  try {
    const base64 = token.split('.')[1]
    const json = atob(base64.replace(/-/g, '+').replace(/_/g, '/'))
    return JSON.parse(json)
  } catch {
    return null
  }
}

/** Build a Supabase-compatible session object from raw tokens + JWT decode */
const buildSession = (accessToken: string, refreshToken: string, user?: any) => {
  const payload = decodeJwtPayload(accessToken)
  if (!payload) return null

  // Check if token is expired
  const now = Math.floor(Date.now() / 1000)
  if (payload.exp && payload.exp < now) {
    console.warn('[Callback] Token expiré:', { exp: payload.exp, now })
    return null
  }

  const sessionUser = user || {
    id: payload.sub,
    email: payload.email,
    email_confirmed_at: payload.email_confirmed_at || new Date().toISOString(),
    created_at: payload.created_at || new Date().toISOString(),
    updated_at: new Date().toISOString(),
    aud: payload.aud || 'authenticated',
    role: payload.role || 'authenticated',
    user_metadata: payload.user_metadata || {},
    app_metadata: payload.app_metadata || {}
  }

  return {
    access_token: accessToken,
    refresh_token: refreshToken,
    expires_at: payload.exp,
    expires_in: payload.exp ? payload.exp - now : 3600,
    token_type: 'bearer',
    user: sessionUser
  }
}

/** Persist session to localStorage in Supabase's expected format */
const persistSession = (session: any) => {
  try {
    const key = getSupabaseStorageKey()
    localStorage.setItem(key, JSON.stringify(session))
    console.log('✅ [Callback] Session persistée:', key)
  } catch (err) {
    console.warn('[Callback] localStorage error:', err)
  }
}

/** fetch() with AbortController timeout */
const fetchWithTimeout = (url: string, options: RequestInit, timeoutMs: number): Promise<Response> => {
  const controller = new AbortController()
  const timer = setTimeout(() => controller.abort(), timeoutMs)
  return fetch(url, { ...options, signal: controller.signal }).finally(() => clearTimeout(timer))
}

// ─── MAIN ────────────────────────────────────────────────────────────────────

onMounted(async () => {
  const redirectUser = async (session: any) => {
    persistSession(session)
    authStore.restoreSession().catch(() => {})

    const createdAt = new Date(session.user.created_at).getTime()
    const isNew = (Date.now() - createdAt) < 5 * 60 * 1000

    console.log('✅ [Callback] Redirect:', isNew ? 'onboarding' : 'dashboard')
    await navigateTo(isNew ? '/onboarding?from=oauth&welcome=true' : '/')
  }

  const fail = (reason: string) => {
    loading.value = false
    console.error('❌ [Callback] Échec:', reason)
  }

  try {
    const search = new URLSearchParams(window.location.search)
    const hash   = new URLSearchParams(window.location.hash.slice(1))

    const code         = search.get('code')
    const tokenHash    = search.get('token_hash') || hash.get('token_hash')
    const type         = search.get('type') || hash.get('type') || 'email'
    const errorParam   = search.get('error') || hash.get('error')
    const accessToken  = hash.get('access_token')
    const refreshToken = hash.get('refresh_token') || ''
    const expiresIn    = hash.get('expires_in')

    console.log('[Callback] URL params:', {
      code: !!code, tokenHash: !!tokenHash, accessToken: !!accessToken,
      refreshToken: !!refreshToken, type, error: errorParam
    })

    // ── Error from provider ──────────────────────────────────────────────
    if (errorParam) {
      fail(search.get('error_description') || hash.get('error_description') || errorParam)
      return
    }

    // ── No auth params ───────────────────────────────────────────────────
    if (!code && !tokenHash && !accessToken) {
      fail('Pas de token dans l\'URL')
      await navigateTo('/login')
      return
    }

    // ── #access_token= (Google OAuth implicit flow) ──────────────────────
    // ZERO SDK calls. Decode JWT locally, persist to localStorage, redirect.
    if (accessToken) {
      console.log('🔑 [Callback] access_token → décodage JWT local (aucun appel réseau)')
      currentStep.value = 'Connexion Google en cours...'

      const session = buildSession(accessToken, refreshToken)
      if (!session) {
        fail('Token invalide ou expiré')
        return
      }

      await redirectUser(session)
      return
    }

    // ── ?code= (PKCE flow) ──────────────────────────────────────────────
    // Direct fetch to Supabase /auth/v1/token — bypass SDK completely.
    if (code) {
      console.log('🔑 [Callback] PKCE code → fetch direct /auth/v1/token')
      currentStep.value = 'Connexion Google en cours...'

      const projectRef = config.public.supabaseUrl.replace('https://', '').split('.')[0]
      const verifierKey = `sb-${projectRef}-auth-token-code-verifier`
      const codeVerifier = localStorage.getItem(verifierKey) || ''

      try {
        const response = await fetchWithTimeout(
          `${config.public.supabaseUrl}/auth/v1/token?grant_type=authorization_code`,
          {
            method: 'POST',
            headers: {
              'Content-Type': 'application/json',
              'apikey': config.public.supabaseAnonKey
            },
            body: JSON.stringify({ auth_code: code, code_verifier: codeVerifier })
          },
          8000
        )

        if (!response.ok) {
          const body = await response.text()
          console.error('[Callback] PKCE exchange failed:', response.status, body)
          fail(`Échange PKCE échoué (${response.status})`)
          return
        }

        const tokenData = await response.json()
        if (tokenData.access_token) {
          const session = buildSession(
            tokenData.access_token,
            tokenData.refresh_token || '',
            tokenData.user
          )
          if (!session) { fail('Session PKCE invalide'); return }
          if (codeVerifier) localStorage.removeItem(verifierKey)
          await redirectUser(session)
        } else {
          fail('Réponse PKCE sans access_token')
        }
      } catch (err: any) {
        fail(err.name === 'AbortError' ? 'Timeout échange PKCE' : err.message)
      }
      return
    }

    // ── ?token_hash= (email confirmation) ────────────────────────────────
    // Direct fetch to Supabase /auth/v1/verify — bypass SDK.
    if (tokenHash) {
      console.log('🔑 [Callback] token_hash → fetch direct /auth/v1/verify')
      currentStep.value = 'Vérification de votre email...'

      try {
        const response = await fetchWithTimeout(
          `${config.public.supabaseUrl}/auth/v1/verify`,
          {
            method: 'POST',
            headers: {
              'Content-Type': 'application/json',
              'apikey': config.public.supabaseAnonKey
            },
            body: JSON.stringify({ token_hash: tokenHash, type })
          },
          8000
        )

        if (!response.ok) {
          const body = await response.text()
          console.error('[Callback] verifyOtp failed:', response.status, body)
          fail(`Vérification email échouée (${response.status})`)
          return
        }

        const tokenData = await response.json()
        if (tokenData.access_token) {
          const session = buildSession(
            tokenData.access_token,
            tokenData.refresh_token || '',
            tokenData.user
          )
          if (!session) { fail('Session email invalide'); return }
          await redirectUser(session)
        } else {
          fail('Réponse vérification sans access_token')
        }
      } catch (err: any) {
        fail(err.name === 'AbortError' ? 'Timeout vérification email' : err.message)
      }
      return
    }

  } catch (err: any) {
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
