<!-- pages/auth/callback.vue - VERSION CORRIGÉE FINALE -->
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

// Variables pour retry
let urlParams: URLSearchParams
let confirmationType: string | null = null

// ✅ TRAITEMENT UNIVERSEL DU CALLBACK SUPABASE
onMounted(async () => {
  try {
    console.log('🔗 Traitement du callback Supabase...')
    console.log('🔍 URL complète:', window.location.href)
    
    // ✅ NOUVEAU: Gérer les deux formats (hash fragment ET query params)
    let urlParams: URLSearchParams
    let confirmationType: string | null = null
    
    // Format 1: Hash fragment (#access_token=...)
    if (window.location.hash && window.location.hash.includes('access_token')) {
      console.log('📍 Format détecté: Hash fragment')
      const hashParams = window.location.hash.substring(1) // Enlever le #
      urlParams = new URLSearchParams(hashParams)
    } 
    // Format 2: Query parameters (?access_token=...)
    else {
      console.log('📍 Format détecté: Query parameters')
      urlParams = new URLSearchParams(window.location.search)
    }
    
    confirmationType = urlParams.get('type')
    
    console.log('📋 Paramètres URL:', Object.fromEntries(urlParams.entries()))
    console.log('🔍 Type de confirmation:', confirmationType)
    
    // ✅ GESTION PAR TYPE DE CONFIRMATION
    if (confirmationType === 'signup' || urlParams.get('access_token')) {
      await handleEmailConfirmation(urlParams)
    } else if (confirmationType === 'recovery') {
      await handlePasswordReset(urlParams)
    } else if (confirmationType === 'email_change') {
      await handleEmailChange(urlParams)
    } else {
      // ✅ FALLBACK : TENTER LA CONFIRMATION AUTOMATIQUE
      console.log('🔄 Type non reconnu, tentative de confirmation automatique...')
      await handleAuthCallback()
    }
    
  } catch (err: any) {
    console.error('❌ Erreur callback:', err)
    showError(err.message || 'Une erreur inattendue s\'est produite.')
  }
})

// ✅ GESTION CONFIRMATION EMAIL (SIGNUP)
const handleEmailConfirmation = async (params: URLSearchParams) => {
  try {
    loadingMessage.value = 'Confirmation de votre email...'
    
    // ✅ MÉTHODE 1: Utiliser verifyOtp si token_hash présent
    const tokenHash = params.get('token_hash')
    if (tokenHash) {
      console.log('🔑 Utilisation du token_hash pour confirmation...')
      
      const { data, error } = await supabase.auth.verifyOtp({
        token_hash: tokenHash,
        type: 'email'
      })
      
      if (error) throw error
      
      if (data.user) {
        await handleSuccessfulConfirmation(data.user, 'signup')
        return
      }
    }
    
    // ✅ MÉTHODE 2: Utiliser access_token et refresh_token
    const accessToken = params.get('access_token')
    const refreshToken = params.get('refresh_token')
    
    if (accessToken) {
      console.log('🔑 Utilisation des tokens pour session...')
      
      const { data, error } = await supabase.auth.setSession({
        access_token: accessToken,
        refresh_token: refreshToken || ''
      })
      
      if (error) throw error
      
      if (data.user) {
        await handleSuccessfulConfirmation(data.user, 'signup')
        return
      }
    }
    
    throw new Error('Aucun token de confirmation valide trouvé')
    
  } catch (err: any) {
    console.error('❌ Erreur confirmation email:', err)
    canRetry.value = true
    
    if (err.message?.includes('expired')) {
      showError('Le lien de confirmation a expiré. Demandez un nouveau lien depuis la page de connexion.')
    } else if (err.message?.includes('invalid')) {
      showError('Le lien de confirmation est invalide. Vérifiez que vous avez cliqué sur le bon lien.')
    } else {
      showError('Impossible de confirmer votre email. Veuillez réessayer ou créer un nouveau compte.')
    }
  }
}

// ✅ GESTION RESET PASSWORD
const handlePasswordReset = async (params: URLSearchParams) => {
  try {
    loadingMessage.value = 'Validation du lien de réinitialisation...'
    
    const accessToken = params.get('access_token')
    const refreshToken = params.get('refresh_token')
    
    if (!accessToken) {
      throw new Error('Token de réinitialisation manquant')
    }
    
    const { data, error } = await supabase.auth.setSession({
      access_token: accessToken,
      refresh_token: refreshToken || ''
    })
    
    if (error) throw error
    
    if (data.user) {
      successMessage.value = 'Lien de réinitialisation validé !'
      successDescription.value = 'Vous allez être redirigé pour définir votre nouveau mot de passe.'
      redirectButtonText.value = 'Définir mon nouveau mot de passe'
      redirectUrl.value = '/reset-password/new'
      
      showSuccess()
      return
    }
    
    throw new Error('Session invalide')
    
  } catch (err: any) {
    console.error('❌ Erreur reset password:', err)
    showError('Le lien de réinitialisation est invalide ou a expiré.')
  }
}

// ✅ GESTION CHANGEMENT EMAIL
const handleEmailChange = async (params: URLSearchParams) => {
  try {
    loadingMessage.value = 'Confirmation du changement d\'email...'
    
    await handleAuthCallback()
    
    successMessage.value = 'Email modifié avec succès !'
    successDescription.value = 'Votre nouvelle adresse email a été confirmée.'
    redirectUrl.value = '/settings'
    
    showSuccess()
    
  } catch (err: any) {
    console.error('❌ Erreur changement email:', err)
    showError('Impossible de confirmer le changement d\'email.')
  }
}

// ✅ GESTION GÉNÉRIQUE CALLBACK AUTH
const handleAuthCallback = async () => {
  const { data, error } = await supabase.auth.getSession()
  
  if (error) throw error
  
  if (data.session?.user) {
    await handleSuccessfulConfirmation(data.session.user, confirmationType || 'unknown')
  } else {
    throw new Error('Aucune session valide trouvée')
  }
}

// ✅ GESTION CONFIRMATION RÉUSSIE
const handleSuccessfulConfirmation = async (user: any, type: string) => {
  console.log('✅ Confirmation réussie pour:', user.email, 'Type:', type)
  
  try {
    // ✅ METTRE À JOUR LA TABLE USERS
    const { error: updateError } = await supabase
      .from('users')
      .upsert({
        id: user.id,
        email: user.email,
        name: user.user_metadata?.name || user.user_metadata?.full_name || '',
        first_name: user.user_metadata?.first_name || '',
        last_name: user.user_metadata?.last_name || '',
        email_verified: true,
        email_confirmed_at: new Date().toISOString(),
        updated_at: new Date().toISOString()
      }, {
        onConflict: 'id'
      })
    
    if (updateError) {
      console.warn('⚠️ Erreur mise à jour users:', updateError)
    }
    
    // ✅ VÉRIFIER SI ONBOARDING DÉJÀ TERMINÉ
    const { data: userData } = await supabase
      .from('users')
      .select('onboarding_completed, company, created_at')
      .eq('id', user.id)
      .single()
    
    console.log('📋 Données utilisateur:', userData)
    
    // ✅ DÉTERMINER LA REDIRECTION - LOGIQUE CORRIGÉE
    const isOnboardingCompleted = userData?.onboarding_completed === true
    const hasCompany = userData?.company && userData.company.trim().length > 0
    
    // Pour les nouveaux comptes : toujours vers l'onboarding
    // Pour les comptes existants : vérifier si onboarding terminé
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
    
    console.log('✅ Redirection vers:', redirectUrl.value)
    showSuccess()
    
  } catch (err: any) {
    console.error('❌ Erreur post-confirmation:', err)
    // Continuer quand même vers le succès
    showSuccess()
  }
}

// ✅ AFFICHAGE SUCCÈS AVEC COUNTDOWN
const showSuccess = () => {
  loading.value = false
  success.value = true
  startCountdown()
}

// ✅ AFFICHAGE ERREUR
const showError = (message: string) => {
  loading.value = false
  error.value = true
  errorMessage.value = message
}

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

// ✅ RETRY
const retryConfirmation = async () => {
  loading.value = true
  error.value = false
  
  // Récupérer les paramètres depuis l'URL actuelle
  let retryParams: URLSearchParams
  if (window.location.hash && window.location.hash.includes('access_token')) {
    const hashParams = window.location.hash.substring(1)
    retryParams = new URLSearchParams(hashParams)
  } else {
    retryParams = new URLSearchParams(window.location.search)
  }
  
  await handleEmailConfirmation(retryParams)
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