<!-- pages/auth/callback.vue - VERSION SIMPLIFIÉE SANS ERREURS TS -->
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
          {{ loadingMessage }}
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
          {{ successMessage }}
        </h2>
        <p class="text-gray-600 mb-6">
          {{ successDescription }}
        </p>
        
        <!-- Progress bar de redirection -->
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
        
        <button
          @click="handleRedirect"
          class="w-full bg-blue-600 text-white py-3 px-4 rounded-lg hover:bg-blue-700 transition-colors font-medium"
        >
          {{ redirectButtonText }}
        </button>
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
          <button
            @click="retryConfirmation"
            v-if="canRetry"
            class="w-full inline-flex justify-center items-center px-4 py-2 bg-blue-600 text-white font-medium rounded-lg hover:bg-blue-700 transition-colors"
          >
            Réessayer
          </button>
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

// ✅ PAS DE LAYOUT (page standalone)
definePageMeta({
  layout: false
})

// ✅ CLIENT SUPABASE
const config = useRuntimeConfig()
const supabase = createClient(
  config.public.supabaseUrl,
  config.public.supabaseAnonKey
)

// ✅ STATE
const loading = ref(true)
const success = ref(false)
const error = ref(false)
const errorMessage = ref('')
const loadingMessage = ref('Confirmation de votre email...')
const successMessage = ref('Email confirmé avec succès !')
const successDescription = ref('Votre compte est maintenant activé.')
const redirectButtonText = ref('Continuer maintenant')
const countdown = ref(5)
const progressWidth = ref(0)
const canRetry = ref(false)
const redirectUrl = ref('/onboarding')

// ✅ TRAITEMENT UNIVERSEL DU CALLBACK SUPABASE (SIMPLIFIÉ)
onMounted(async () => {
  try {
    console.log('🔗 Traitement du callback Supabase...')
    console.log('🔍 URL complète:', window.location.href)
    
    // ✅ RÉCUPÉRATION UNIVERSELLE DES PARAMÈTRES
    let accessToken = ''
    let refreshToken = ''
    let confirmationType = ''
    
    // Format 1: Hash fragment (#access_token=...)
    if (window.location.hash && window.location.hash.includes('access_token')) {
      console.log('📍 Format détecté: Hash fragment')
      const hashParams = new URLSearchParams(window.location.hash.substring(1))
      accessToken = hashParams.get('access_token') || ''
      refreshToken = hashParams.get('refresh_token') || ''
      confirmationType = hashParams.get('type') || 'signup'
    } 
    // Format 2: Query parameters (?access_token=...)
    else {
      console.log('📍 Format détecté: Query parameters')
      const urlParams = new URLSearchParams(window.location.search)
      accessToken = urlParams.get('access_token') || ''
      refreshToken = urlParams.get('refresh_token') || ''
      confirmationType = urlParams.get('type') || 'signup'
    }
    
    console.log('📋 Tokens récupérés:', { accessToken: !!accessToken, refreshToken: !!refreshToken, type: confirmationType })
    
    if (!accessToken) {
      throw new Error('Token de confirmation manquant')
    }
    
    // ✅ UTILISER LES TOKENS POUR CRÉER LA SESSION
    console.log('🔑 Création de la session avec les tokens...')
    
    const { data, error: sessionError } = await supabase.auth.setSession({
      access_token: accessToken,
      refresh_token: refreshToken
    })
    
    if (sessionError || !data.session || !data.user) {
      throw new Error('Impossible de créer la session')
    }
    
    console.log('✅ Session créée avec succès pour:', data.user.email)
    
    // ✅ METTRE À JOUR LA TABLE USERS
    const { error: updateError } = await supabase
      .from('users')
      .upsert({
        id: data.user.id,
        email: data.user.email,
        first_name: data.user.user_metadata?.first_name || '',
        last_name: data.user.user_metadata?.last_name || '',
        email_verified: true,
        email_confirmed_at: new Date().toISOString(),
        updated_at: new Date().toISOString()
      }, {
        onConflict: 'id'
      })
    
    if (updateError) {
      console.warn('⚠️ Erreur mise à jour users:', updateError)
    }
    
    // ✅ POUR LA CONFIRMATION EMAIL, TOUJOURS REDIRIGER VERS ONBOARDING
    if (confirmationType === 'signup' || window.location.href.includes('access_token')) {
      console.log('📧 Confirmation email détectée - REDIRECTION FORCÉE VERS ONBOARDING')
      
      successMessage.value = 'Email confirmé avec succès !'
      successDescription.value = 'Finalisons maintenant la configuration de votre compte.'
      redirectButtonText.value = 'Continuer la configuration'
      redirectUrl.value = '/onboarding'
    } else {
      // ✅ VÉRIFIER SI ONBOARDING DÉJÀ TERMINÉ (pour autres cas)
      const { data: userData } = await supabase
        .from('users')
        .select('onboarding_completed, company, created_at, first_name, last_name')
        .eq('id', data.user.id)
        .single()
      
      console.log('📋 Données utilisateur complètes:', userData)
      
      const isOnboardingCompleted = userData?.onboarding_completed === true
      const hasCompany = userData?.company && userData.company.trim().length > 0
      
      if (isOnboardingCompleted && hasCompany) {
        successMessage.value = 'Connexion réussie !'
        successDescription.value = 'Vous allez être redirigé vers votre dashboard.'
        redirectButtonText.value = 'Accéder au dashboard'
        redirectUrl.value = '/?welcome=true'
      } else {
        successMessage.value = 'Email confirmé avec succès !'
        successDescription.value = 'Finalisons maintenant la configuration de votre compte.'
        redirectButtonText.value = 'Continuer la configuration'
        redirectUrl.value = '/onboarding'
      }
    }
    
    console.log('✅ Redirection vers:', redirectUrl.value)
    
    // ✅ AFFICHER LE SUCCÈS
    loading.value = false
    success.value = true
    
    // ✅ COUNTDOWN ET REDIRECTION AUTOMATIQUE
    startCountdown()
    
  } catch (err: any) {
    console.error('❌ Erreur callback confirmation:', err)
    
    loading.value = false
    error.value = true
    canRetry.value = true
    
    // Messages d'erreur personnalisés
    if (err.message?.includes('expired')) {
      errorMessage.value = 'Le lien de confirmation a expiré. Veuillez demander un nouveau lien.'
    } else if (err.message?.includes('invalid') || err.message?.includes('manquant')) {
      errorMessage.value = 'Le lien de confirmation est invalide. Vérifiez que vous avez cliqué sur le bon lien.'
    } else {
      errorMessage.value = 'Une erreur s\'est produite lors de la confirmation : ' + err.message
    }
  }
})

// ✅ COUNTDOWN AVEC PROGRESS BAR
const startCountdown = () => {
  const interval = setInterval(() => {
    countdown.value--
    progressWidth.value = ((5 - countdown.value) / 5) * 100
    
    if (countdown.value <= 0) {
      clearInterval(interval)
      handleRedirect()
    }
  }, 1000)
}

// ✅ REDIRECTION
const handleRedirect = () => {
  navigateTo(redirectUrl.value, { replace: true })
}

// ✅ RETRY SIMPLE
const retryConfirmation = () => {
  loading.value = true
  error.value = false
  // Recharger la page pour relancer le traitement
  window.location.reload()
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
/* ✅ SPINNER */
@keyframes spin {
  from { transform: rotate(0deg); }
  to { transform: rotate(360deg); }
}

.animate-spin {
  animation: spin 1s linear infinite;
}
</style>