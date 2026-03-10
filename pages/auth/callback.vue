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
          <NuxtLink
            to="/login"
            class="w-full inline-flex justify-center items-center px-4 py-3 bg-rose-600 text-white font-medium rounded-lg hover:bg-rose-700 transition-colors"
          >
            Se connecter
          </NuxtLink>
          <NuxtLink
            to="/register"
            class="w-full inline-flex justify-center items-center px-4 py-2 border border-gray-300 text-gray-500 text-sm rounded-lg hover:bg-gray-50 transition-colors"
          >
            Créer un compte
          </NuxtLink>
        </div>
      </div>

    </div>
  </div>
</template>

<script setup lang="ts">
import { useSupabase } from '~~/composables/useSupabase'
import { useAuthStore } from '~~/stores/auth'

const authStore = useAuthStore()
const supabase = useSupabase()

definePageMeta({ layout: false })

const loading = ref(true)
const currentStep = ref('Vérification de votre identité...')

// ─── TRAITEMENT PRINCIPAL ───────────────────────────────────────────────────
onMounted(() => {
  let resolved = false
  let subRef: any = null
  let timer: ReturnType<typeof setTimeout>

  // ── Redirect after successful auth ──────────────────────────────────────
  const redirectUser = async (session: any) => {
    if (resolved) return
    resolved = true
    clearTimeout(timer)
    subRef?.unsubscribe()

    // Restore auth store in background — don't block redirect
    authStore.restoreSession().catch(() => {})

    // New user = account created less than 5 minutes ago
    const createdAt = new Date(session.user.created_at).getTime()
    const isNew = (Date.now() - createdAt) < 5 * 60 * 1000

    if (isNew) {
      console.log('✅ [Callback] Nouvel utilisateur → onboarding')
      await navigateTo('/onboarding?from=oauth&welcome=true')
    } else {
      console.log('✅ [Callback] Utilisateur existant → dashboard')
      await navigateTo('/')
    }
  }

  // ── Show error state ─────────────────────────────────────────────────────
  const fail = () => {
    if (resolved) return
    resolved = true
    clearTimeout(timer)
    subRef?.unsubscribe()
    loading.value = false
    console.warn('❌ [Callback] Échec — lien expiré ou invalide')
  }

  // ── STEP 1: Register auth listener synchronously (BEFORE any await) ──────
  // For Google OAuth (PKCE): Supabase auto-exchanges ?code= during client init.
  // SIGNED_IN fires when done. We just listen and redirect.
  // For email confirmation (token_hash): we call verifyOtp manually below,
  // which also triggers SIGNED_IN.
  const { data } = supabase.auth.onAuthStateChange((event, session) => {
    if (resolved) return
    console.log('🔄 [Callback] Auth event:', event, '| has user:', !!session?.user)
    if ((event === 'SIGNED_IN' || event === 'INITIAL_SESSION') && session?.user) {
      redirectUser(session)
    }
  })
  subRef = data.subscription

  // ── STEP 2: Timeout (registered synchronously) ───────────────────────────
  timer = setTimeout(() => {
    console.warn('⏰ [Callback] Timeout 15s atteint')
    fail()
  }, 15000)

  // ── STEP 3: Async work (non-blocking IIFE) ───────────────────────────────
  ;(async () => {
    const search = new URLSearchParams(window.location.search)
    const hash   = new URLSearchParams(window.location.hash.slice(1))

    const code       = search.get('code')
    const tokenHash  = search.get('token_hash')
    const type       = search.get('type') || 'email'
    const errorParam = search.get('error')
    const hasToken   = code || tokenHash || hash.get('access_token')

    console.log('🔍 [Callback] URL params:', { code: !!code, tokenHash: !!tokenHash, type, error: errorParam })

    // Error in URL (e.g. user denied Google access)
    if (errorParam) {
      console.warn('❌ [Callback] Erreur dans URL:', errorParam)
      fail()
      return
    }

    // No auth params at all → check for existing session or redirect to login
    if (!hasToken) {
      console.log('🔍 [Callback] Pas de token dans URL, vérification session existante...')
      try {
        const { data: { session } } = await supabase.auth.getSession()
        if (session?.user) {
          redirectUser(session)
        } else {
          fail()
          await navigateTo('/login')
        }
      } catch {
        fail()
        await navigateTo('/login')
      }
      return
    }

    // Google OAuth (?code=) → Supabase handles exchange automatically via detectSessionInUrl.
    // SIGNED_IN will fire via the listener above. Nothing to do here.
    if (code) {
      console.log('🔑 [Callback] PKCE code détecté — Supabase échange automatiquement')
      currentStep.value = 'Connexion Google en cours...'
      // Just wait for SIGNED_IN from the listener
      return
    }

    // Email confirmation (?token_hash=) → must call verifyOtp explicitly.
    // This triggers SIGNED_IN via the listener above.
    if (tokenHash) {
      console.log('🔑 [Callback] token_hash détecté — vérification email...')
      currentStep.value = 'Vérification de votre email...'
      try {
        const { error: otpError } = await supabase.auth.verifyOtp({
          token_hash: tokenHash,
          type: type as any
        })
        if (otpError) {
          console.error('❌ [Callback] verifyOtp error:', otpError.message)
          fail()
        }
        // On success, SIGNED_IN fires via listener → redirectUser called
      } catch (err: any) {
        console.error('❌ [Callback] verifyOtp exception:', err.message)
        fail()
      }
      return
    }

    // Legacy: #access_token= in hash → Supabase handles automatically
    // SIGNED_IN will fire via listener. Nothing to do.
    console.log('🔑 [Callback] access_token dans hash — Supabase gère automatiquement')
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
.animate-spin {
  animation: spin 1s linear infinite;
}
</style>
