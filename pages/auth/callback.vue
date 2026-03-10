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
import { useAuthStore } from '~~/stores/auth'

// ─── CRITICAL: Clear stale Supabase session from localStorage BEFORE creating
// the Supabase client. Without this, Supabase's _recoverAndRefresh() tries to
// refresh the expired token via a network call that can hang indefinitely,
// blocking initializePromise → onAuthStateChange INITIAL_SESSION never fires.
if (process.client) {
  try {
    const staleKeys = Object.keys(localStorage).filter(
      k => k.startsWith('sb-') && k.endsWith('-auth-token')
    )
    if (staleKeys.length) {
      console.log('[Callback] Clearing stale sessions:', staleKeys)
      staleKeys.forEach(k => localStorage.removeItem(k))
    }
  } catch { /* ignore storage errors */ }
}

// Import Supabase AFTER clearing stale storage
import { useSupabase } from '~~/composables/useSupabase'
const supabase = useSupabase()
const authStore = useAuthStore()

definePageMeta({ layout: false })

const loading = ref(true)
const currentStep = ref('Vérification de votre identité...')

// ─── MAIN HANDLER ───────────────────────────────────────────────────────────
onMounted(() => {
  let resolved = false
  let subRef: any = null
  let timer: ReturnType<typeof setTimeout>

  const redirectUser = async (session: any) => {
    if (resolved) return
    resolved = true
    clearTimeout(timer)
    subRef?.unsubscribe()

    // Sync auth store in background — don't block redirect
    authStore.restoreSession().catch(() => {})

    const createdAt = new Date(session.user.created_at).getTime()
    const isNew = (Date.now() - createdAt) < 5 * 60 * 1000

    console.log('✅ [Callback] Redirection:', isNew ? 'onboarding' : 'dashboard')
    await navigateTo(isNew ? '/onboarding?from=oauth&welcome=true' : '/')
  }

  const fail = () => {
    if (resolved) return
    resolved = true
    clearTimeout(timer)
    subRef?.unsubscribe()
    loading.value = false
    console.warn('❌ [Callback] Échec')
  }

  // ── Step 1: auth listener (registered synchronously) ────────────────────
  const { data } = supabase.auth.onAuthStateChange((event, session) => {
    if (resolved) return
    console.log('🔄 [Callback] Auth event:', event, '| has user:', !!session?.user)
    if ((event === 'SIGNED_IN' || event === 'INITIAL_SESSION') && session?.user) {
      redirectUser(session)
    }
  })
  subRef = data.subscription

  // ── Step 2: timeout (registered synchronously) ──────────────────────────
  timer = setTimeout(() => {
    console.warn('⏰ [Callback] Timeout 12s')
    fail()
  }, 12000)

  // ── Step 3: async IIFE ───────────────────────────────────────────────────
  ;(async () => {
    const search = new URLSearchParams(window.location.search)
    const hash   = new URLSearchParams(window.location.hash.slice(1))

    const code        = search.get('code')
    const tokenHash   = search.get('token_hash')
    const type        = search.get('type') || 'email'
    const errorParam  = search.get('error')
    const accessToken = hash.get('access_token')
    const refreshToken = hash.get('refresh_token') || ''

    console.log('[Callback] URL params:', { code: !!code, tokenHash: !!tokenHash, accessToken: !!accessToken, type, error: errorParam })

    // Error from provider (e.g. user denied Google access)
    if (errorParam) {
      fail()
      return
    }

    // No auth params → check for existing session or go to login
    if (!code && !tokenHash && !accessToken) {
      try {
        const { data: { session } } = await supabase.auth.getSession()
        if (session?.user) { await redirectUser(session) }
        else { fail(); await navigateTo('/login') }
      } catch {
        fail(); await navigateTo('/login')
      }
      return
    }

    // ── Google OAuth with PKCE (?code=) ─────────────────────────────────
    // Supabase auto-exchanges via detectSessionInUrl → fires SIGNED_IN.
    // Just wait for the listener above. The stale session was cleared above
    // so initializePromise resolves fast and processes the code immediately.
    if (code) {
      console.log('🔑 [Callback] PKCE code → Supabase auto-exchange...')
      currentStep.value = 'Connexion Google en cours...'
      // Listener will catch SIGNED_IN. No manual exchange needed.
      return
    }

    // ── Google OAuth implicit flow (#access_token=) ──────────────────────
    // Supabase auto-processes via detectSessionInUrl. But we also call
    // setSession() explicitly with a timeout as a reliable fallback.
    if (accessToken) {
      console.log('🔑 [Callback] access_token → setSession explicite...')
      currentStep.value = 'Établissement de la session...'
      try {
        const { data: sessData, error } = await Promise.race([
          supabase.auth.setSession({ access_token: accessToken, refresh_token: refreshToken }),
          new Promise<any>((_, reject) => setTimeout(() => reject(new Error('timeout')), 8000))
        ])
        if (error) {
          console.error('[Callback] setSession error:', error.message)
          fail()
          return
        }
        if (sessData?.session?.user) {
          await redirectUser(sessData.session)
        }
        // else: wait for SIGNED_IN from auto-detection listener
      } catch (err: any) {
        if (err.message === 'timeout') {
          console.warn('[Callback] setSession timeout — waiting for listener...')
          // Don't fail yet, listener might still fire
        } else {
          fail()
        }
      }
      return
    }

    // ── Email confirmation (?token_hash=) ────────────────────────────────
    // Must call verifyOtp explicitly — Supabase does NOT auto-process token_hash.
    if (tokenHash) {
      console.log('🔑 [Callback] token_hash → verifyOtp...')
      currentStep.value = 'Vérification de votre email...'
      try {
        const { error } = await supabase.auth.verifyOtp({ token_hash: tokenHash, type: type as any })
        if (error) {
          console.error('[Callback] verifyOtp error:', error.message)
          fail()
        }
        // On success, SIGNED_IN fires via listener → redirectUser
      } catch (err: any) {
        console.error('[Callback] verifyOtp exception:', err.message)
        fail()
      }
    }
  })()
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
