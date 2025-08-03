<!-- pages/auth/callback.vue - GESTION CONFIRMATION EMAIL -->
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
          Confirmation de votre email...
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
          Email confirmé avec succès !
        </h2>
        <p class="text-gray-600 mb-6">
          Votre compte est maintenant activé. Nous allons finaliser la configuration de votre profil.
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
            Redirection vers la configuration dans {{ countdown }} secondes...
          </p>
        </div>
        
        <button
          @click="goToOnboarding"
          class="w-full bg-blue-600 text-white py-3 px-4 rounded-lg hover:bg-blue-700 transition-colors font-medium"
        >
          Continuer maintenant
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
const countdown = ref(5)
const progressWidth = ref(0)

// ✅ TRAITEMENT DE LA CONFIRMATION EMAIL
onMounted(async () => {
  try {
    console.log('🔗 Traitement du callback de confirmation email...')
    
    // Récupérer les paramètres d'URL pour la confirmation
    const urlParams = new URLSearchParams(window.location.search)
    const accessToken = urlParams.get('access_token')
    const refreshToken = urlParams.get('refresh_token')
    
    if (!accessToken) {
      throw new Error('Token de confirmation manquant')
    }
    
    // ✅ CONFIRMER LA SESSION AVEC LES TOKENS
    const { data: sessionData, error: sessionError } = await supabase.auth.setSession({
      access_token: accessToken,
      refresh_token: refreshToken || ''
    })
    
    if (sessionError || !sessionData.session) {
      throw new Error('Impossible de confirmer la session')
    }
    
    // ✅ METTRE À JOUR LE STATUT EMAIL_VERIFIED
    const userId = sessionData.session.user.id
    const { error: updateError } = await supabase
      .from('users')
      .update({ 
        email_verified: true,
        updated_at: new Date().toISOString()
      })
      .eq('id', userId)
    
    if (updateError) {
      console.warn('⚠️ Erreur mise à jour email_verified:', updateError)
    }
    
    console.log('✅ Email confirmé avec succès pour:', sessionData.session.user.email)
    
    // ✅ AFFICHER LE SUCCÈS
    loading.value = false
    success.value = true
    
    // ✅ COUNTDOWN ET REDIRECTION AUTOMATIQUE
    startCountdown()
    
  } catch (err: any) {
    console.error('❌ Erreur callback confirmation:', err)
    
    loading.value = false
    error.value = true
    
    // Messages d'erreur personnalisés
    if (err.message?.includes('expired')) {
      errorMessage.value = 'Le lien de confirmation a expiré. Veuillez demander un nouveau lien.'
    } else if (err.message?.includes('invalid') || err.message?.includes('manquant')) {
      errorMessage.value = 'Le lien de confirmation est invalide. Vérifiez que vous avez cliqué sur le bon lien.'
    } else {
      errorMessage.value = 'Une erreur s\'est produite lors de la confirmation. Veuillez réessayer.'
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
      goToOnboarding()
    }
  }, 1000)
}

// ✅ REDIRECTION VERS ONBOARDING
const goToOnboarding = () => {
  navigateTo('/onboarding', { replace: true })
}

// ✅ SEO
useHead({
  title: 'Confirmation de compte - ChatSeller',
  meta: [
    { name: 'description', content: 'Confirmation de votre compte ChatSeller' }
  ]
})
</script>

<style scoped>
/* ✅ GRADIENT ANIMÉ */
.bg-gradient-to-br {
  background-size: 400% 400%;
  animation: gradient 15s ease infinite;
}

@keyframes gradient {
  0% { background-position: 0% 50%; }
  50% { background-position: 100% 50%; }
  100% { background-position: 0% 50%; }
}

/* ✅ SPINNER */
@keyframes spin {
  from { transform: rotate(0deg); }
  to { transform: rotate(360deg); }
}

.animate-spin {
  animation: spin 1s linear infinite;
}
</style>