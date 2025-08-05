<!-- pages/auth/callback.vue - VERSION SIMPLIFIÉE SANS CONFLITS -->
<template>
  <div class="min-h-screen bg-gradient-to-br from-blue-50 via-white to-blue-50 flex items-center justify-center">
    <div class="max-w-md w-full mx-4">
      
      <!-- Loading State -->
      <div v-if="loading" class="bg-white rounded-xl shadow-xl border border-gray-100 p-8 text-center">
        <div class="flex justify-center mb-4">
          <div class="w-16 h-16 bg-blue-100 rounded-full flex items-center justify-center">
            <svg class="animate-spin w-8 h-8 text-blue-600" fill="none" viewBox="0 0 24 24">
              <circle class="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" stroke-width="4"></circle>
              <path class="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
            </svg>
          </div>
        </div>
        <h2 class="text-xl font-semibold text-gray-900 mb-2">
          Confirmation en cours...
        </h2>
        <p class="text-gray-600">
          Veuillez patienter pendant que nous validons votre compte.
        </p>
      </div>

      <!-- Success State -->
      <div v-else-if="success" class="bg-white rounded-xl shadow-xl border border-gray-100 p-8 text-center">
        <div class="flex justify-center mb-4">
          <div class="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center">
            <svg class="w-8 h-8 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M5 13l4 4L19 7"/>
            </svg>
          </div>
        </div>
        <h2 class="text-xl font-semibold text-gray-900 mb-2">
          Email confirmé !
        </h2>
        <p class="text-gray-600 mb-6">
          Redirection automatique en cours...
        </p>
        
        <!-- Progress bar -->
        <div class="mb-4">
          <div class="w-full bg-gray-200 rounded-full h-2">
            <div 
              class="bg-blue-600 h-2 rounded-full transition-all duration-100 ease-linear"
              :style="{ width: `${progressWidth}%` }"
            ></div>
          </div>
          <p class="text-sm text-gray-500 mt-2">
            Redirection dans {{ countdown }} secondes...
          </p>
        </div>
      </div>

      <!-- Error State -->
      <div v-else-if="error" class="bg-white rounded-xl shadow-xl border border-gray-100 p-8 text-center">
        <div class="flex justify-center mb-4">
          <div class="w-16 h-16 bg-red-100 rounded-full flex items-center justify-center">
            <svg class="w-8 h-8 text-red-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12"/>
            </svg>
          </div>
        </div>
        <h2 class="text-xl font-semibold text-gray-900 mb-2">
          Erreur de confirmation
        </h2>
        <p class="text-gray-600 mb-6">
          {{ errorMessage }}
        </p>
        <div class="space-y-3">
          <NuxtLink
            to="/register"
            class="w-full inline-flex justify-center items-center px-4 py-2 bg-blue-600 text-white font-medium rounded-lg hover:bg-blue-700 transition-colors"
          >
            Créer un nouveau compte
          </NuxtLink>
          <NuxtLink
            to="/login"
            class="w-full inline-flex justify-center items-center px-4 py-2 border border-gray-300 text-gray-700 font-medium rounded-lg hover:bg-gray-50 transition-colors"
          >
            Se connecter
          </NuxtLink>
        </div>
      </div>

    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, onMounted } from 'vue'
import { createClient } from '@supabase/supabase-js'
import { useAuthStore } from '~/stores/auth'

// ✅ PAS DE LAYOUT
definePageMeta({
  layout: false
})

// ✅ CLIENT SUPABASE
const config = useRuntimeConfig()
const supabase = createClient(
  config.public.supabaseUrl,
  config.public.supabaseAnonKey
)

// ✅ STORE AUTH
const authStore = useAuthStore()

// ✅ STATE
const loading = ref(true)
const success = ref(false)
const error = ref(false)
const errorMessage = ref('')
const countdown = ref(3) // ✅ RÉDUIT À 3 SECONDES
const progressWidth = ref(0)

// ✅ TRAITEMENT SIMPLIFIÉ DE LA CONFIRMATION
onMounted(async () => {
  try {
    console.log('🔗 Callback: Traitement confirmation email...')
    
    // ✅ RÉCUPÉRATION TOKENS (HASH OU QUERY)
    let accessToken = ''
    let refreshToken = ''
    
    if (window.location.hash && window.location.hash.includes('access_token')) {
      const hashParams = new URLSearchParams(window.location.hash.substring(1))
      accessToken = hashParams.get('access_token') || ''
      refreshToken = hashParams.get('refresh_token') || ''
    } else {
      const urlParams = new URLSearchParams(window.location.search)
      accessToken = urlParams.get('access_token') || ''
      refreshToken = urlParams.get('refresh_token') || ''
    }
    
    if (!accessToken) {
      throw new Error('Token de confirmation manquant dans l\'URL')
    }
    
    console.log('🔑 Tokens récupérés, création session Supabase...')
    
    // ✅ CRÉER SESSION SUPABASE
    const { data, error: sessionError } = await supabase.auth.setSession({
      access_token: accessToken,
      refresh_token: refreshToken
    })
    
    if (sessionError || !data.session || !data.user) {
      console.error('❌ Erreur session:', sessionError)
      throw new Error('Impossible de créer la session')
    }
    
    console.log('✅ Session créée pour:', data.user.email)
    
    // ✅ METTRE À JOUR LE STORE
    const userData = await authStore.fetchCompleteUserData(data.user)
    authStore.setUser(userData, data.session.access_token)
    
    // ✅ NETTOYER L'URL POUR ÉVITER LES LOOPS
    window.history.replaceState({}, '', window.location.pathname)
    
    // ✅ SUCCÈS - DÉMARRER COUNTDOWN
    loading.value = false
    success.value = true
    
    console.log('✅ Confirmation réussie, démarrage countdown...')
    startCountdown()
    
  } catch (err: any) {
    console.error('❌ Erreur callback:', err)
    
    loading.value = false
    error.value = true
    
    // ✅ MESSAGES D'ERREUR CLAIRS
    if (err.message?.includes('expired')) {
      errorMessage.value = 'Le lien de confirmation a expiré. Veuillez créer un nouveau compte.'
    } else if (err.message?.includes('invalid') || err.message?.includes('manquant')) {
      errorMessage.value = 'Le lien de confirmation est invalide. Veuillez réessayer.'
    } else {
      errorMessage.value = 'Erreur lors de la confirmation. Contactez le support si le problème persiste.'
    }
  }
})

// ✅ COUNTDOWN SIMPLE
const startCountdown = () => {
  const interval = setInterval(() => {
    countdown.value--
    progressWidth.value = ((3 - countdown.value) / 3) * 100
    
    if (countdown.value <= 0) {
      clearInterval(interval)
      redirectToApp()
    }
  }, 1000)
}

// ✅ REDIRECTION SIMPLE VERS LA RACINE
const redirectToApp = () => {
  console.log('🚀 Redirection vers l\'application (middleware gérera onboarding)')
  // ✅ REDIRECTION SIMPLE - Le middleware d'onboarding s'occupera du reste
  navigateTo('/', { replace: true })
}

// ✅ SEO
useHead({
  title: 'Confirmation de compte - ChatSeller',
  meta: [
    { name: 'description', content: 'Confirmation de votre compte ChatSeller' },
    { name: 'robots', content: 'noindex' }
  ]
})
</script>

<style scoped>
@keyframes spin {
  from { transform: rotate(0deg); }
  to { transform: rotate(360deg); }
}

.animate-spin {
  animation: spin 1s linear infinite;
}
</style>