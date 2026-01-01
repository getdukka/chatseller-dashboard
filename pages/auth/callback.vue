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
        <h2 class="text-xl font-semibold text-gray-900 mb-2">
          Confirmation en cours...
        </h2>
        <p class="text-gray-600 mb-4">
          Vérification de votre adresse email
        </p>
        <div class="text-sm text-gray-500">
          {{ currentStep }}
        </div>
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
          🎉 Email confirmé avec succès !
        </h2>
        <p class="text-gray-600 mb-4">
          Votre compte ChatSeller est maintenant activé
        </p>
        <div class="bg-rose-50 border border-rose-200 rounded-lg p-4 mb-6">
          <p class="text-rose-800 text-sm">
            <strong>Prochaine étape :</strong> Configurons ensemble votre espace de vente beauté IA
          </p>
        </div>
        
        <div class="mb-6">
          <p class="text-sm text-gray-500 mb-2">
            Redirection automatique dans {{ countdown }} secondes...
          </p>
          <div class="w-full bg-gray-200 rounded-full h-2">
            <div 
              class="bg-gradient-to-r from-rose-600 to-green-600 h-2 rounded-full transition-all duration-100 ease-linear"
              :style="{ width: `${countdownProgress}%` }"
            ></div>
          </div>
        </div>
        
        <button
          @click="redirectToOnboarding"
          class="w-full bg-gradient-to-r from-rose-600 to-green-600 text-white py-3 px-4 rounded-lg font-medium hover:from-rose-700 hover:to-green-700 transition-all shadow-lg transform hover:scale-105"
        >
          Configurer mon espace maintenant
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
            class="w-full inline-flex justify-center items-center px-4 py-2 bg-rose-600 text-white font-medium rounded-lg hover:bg-rose-700 transition-colors"
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
import { useSupabase } from '~~/composables/useSupabase'
import { useAuthStore } from '~~/stores/auth'

// ✅ IMPORTS SIMPLIFIÉS - UTILISER useApi() au lieu de mélanger
const auth = useAuth()
const authStore = useAuthStore()
const api = useApi() // ✅ NOUVEAU : Utiliser le composable API
const supabase = useSupabase()

definePageMeta({
  layout: false
})

// ✅ STATE SIMPLIFIÉ
const loading = ref(true)
const success = ref(false)
const error = ref(false)
const errorMessage = ref('')
const countdown = ref(3) // ✅ 3 SECONDES
const countdownProgress = ref(0)
const currentStep = ref('Analyse du lien de confirmation...')

// ✅ FONCTION SIMPLIFIÉE : Analyser URL callback
const parseCallbackUrl = () => {
  const url = window.location.href
  const hash = window.location.hash
  const search = window.location.search
  
  console.log('🔍 [Callback] Analyse URL:', url)
  
  let tokens = {
    access_token: '',
    refresh_token: '',
    token_hash: '',
    type: '',
    error: '',
    error_description: ''
  }
  
  // Hash fragments (#)
  if (hash && hash.length > 1) {
    const hashContent = hash.substring(1)
    const hashParams = new URLSearchParams(hashContent)
    
    tokens.access_token = hashParams.get('access_token') || ''
    tokens.refresh_token = hashParams.get('refresh_token') || ''
    tokens.token_hash = hashParams.get('token_hash') || ''
    tokens.type = hashParams.get('type') || ''
    tokens.error = hashParams.get('error') || ''
    tokens.error_description = hashParams.get('error_description') || ''
  }
  
  // Query parameters (?)
  if (search) {
    const urlParams = new URLSearchParams(search)
    
    if (!tokens.access_token) tokens.access_token = urlParams.get('access_token') || ''
    if (!tokens.refresh_token) tokens.refresh_token = urlParams.get('refresh_token') || ''
    if (!tokens.token_hash) tokens.token_hash = urlParams.get('token_hash') || ''
    if (!tokens.type) tokens.type = urlParams.get('type') || ''
    if (!tokens.error) tokens.error = urlParams.get('error') || ''
    if (!tokens.error_description) tokens.error_description = urlParams.get('error_description') || ''
  }
  
  return tokens
}

// ✅ FONCTION SIMPLIFIÉE : Établir session Supabase
const establishSupabaseSession = async (tokens: any) => {
  console.log('🔐 [Callback] Création session Supabase')
  currentStep.value = '🔐 Vérification de votre email...'
  
  if (tokens.error) {
    throw new Error(tokens.error_description || tokens.error)
  }
  
  let sessionData = null
  
  // Méthode moderne avec token_hash
  if (tokens.token_hash) {
    console.log('🔑 [Callback] Utilisation token_hash')
    
    const { data, error } = await supabase.auth.verifyOtp({
      token_hash: tokens.token_hash,
      type: tokens.type || 'email'
    })
    
    if (error) {
      throw new Error(`Erreur vérification: ${error.message}`)
    }
    
    sessionData = data
  }
  // Méthode classique
  else if (tokens.access_token && tokens.refresh_token) {
    const { data, error } = await supabase.auth.setSession({
      access_token: tokens.access_token,
      refresh_token: tokens.refresh_token
    })
    
    if (error) {
      throw new Error(`Erreur session: ${error.message}`)
    }
    
    sessionData = data
  }
  else {
    throw new Error('Aucun token valide trouvé')
  }
  
  return sessionData
}

// ✅ FONCTION SIMPLIFIÉE : Assurer l'existence du shop - UTILISER useApi()
const ensureShopExists = async (user: any) => {
  console.log('🏪 [Callback] Vérification/création shop beauté')
  currentStep.value = '🏪 Configuration de votre espace...'
  
  try {
    // ✅ UTILISER useApi() - Vérifier si le shop existe
    const shopResponse = await api.shops.get(user.id)
    
    if (shopResponse.success && shopResponse.data) {
      console.log('✅ [Callback] Shop beauté existant trouvé')
      return shopResponse.data
    }
  } catch (checkError) {
    console.log('ℹ️ [Callback] Shop non trouvé, création...')
  }
  
  // ✅ UTILISER useApi() - Créer le shop
  const createData = {
    id: user.id,
    name: user.user_metadata?.first_name ? `${user.user_metadata.first_name} Beauté` : `Shop de ${user.email?.split('@')[0]}`,
    email: user.email,
    subscription_plan: 'starter',
    is_active: true,
    onboarding_completed: false,
    widget_config: {
      theme: 'beauty_modern',
      primaryColor: '#E91E63',
      position: 'bottom-right',
      buttonText: 'Parler à votre conseillère beauté',
      language: 'fr'
    }
  }
  
  const createResponse = await api.shops.create(createData)
  
  if (!createResponse.success) {
    throw new Error(createResponse.error || 'Erreur création shop beauté')
  }
  
  console.log('✅ [Callback] Shop beauté créé avec succès')
  return createResponse.data
}

// ✅ TRAITEMENT PRINCIPAL SIMPLIFIÉ
onMounted(async () => {
  try {
    console.log('🔗 [Callback] Début traitement confirmation email')
    
    // ✅ ÉTAPE 1: Parser URL
    currentStep.value = '🔍 Analyse du lien de confirmation...'
    await new Promise(resolve => setTimeout(resolve, 500))
    
    const tokens = parseCallbackUrl()
    
    // ✅ ÉTAPE 2: Établir session
    currentStep.value = '🔑 Récupération des informations...'
    await new Promise(resolve => setTimeout(resolve, 500))
    
    const sessionData = await establishSupabaseSession(tokens)
    
    if (!sessionData?.user) {
      throw new Error('Données utilisateur manquantes')
    }
    
    console.log('✅ [Callback] Email confirmé pour:', sessionData.user.email)
    
    // ✅ ÉTAPE 3: Synchroniser store
    currentStep.value = '💾 Préparation de vos données...'
    await new Promise(resolve => setTimeout(resolve, 500))
    
    try {
      // ✅ UTILISER fetchCompleteUserData du composable auth
      const userData = await auth.fetchCompleteUserData(sessionData.user)
      authStore.setUser(userData, sessionData.session.access_token)
      console.log('✅ [Callback] Store synchronisé')
    } catch (storeError) {
      console.warn('⚠️ [Callback] Erreur store (non critique):', storeError)
    }
    
    // ✅ ÉTAPE 4: Assurer l'existence du shop beauté
    currentStep.value = '🏪 Configuration de votre espace beauté...'
    await new Promise(resolve => setTimeout(resolve, 500))
    
    try {
      const shopData = await ensureShopExists(sessionData.user)
      console.log('✅ [Callback] Shop beauté configuré')
    } catch (shopError: any) {
      console.error('❌ [Callback] Erreur shop beauté:', shopError)
      throw new Error(`Configuration espace beauté échouée: ${shopError.message}`)
    }
    
    // ✅ FINALISATION
    currentStep.value = '✨ Finalisation...'
    await new Promise(resolve => setTimeout(resolve, 500))
    
    // Nettoyer l'URL
    window.history.replaceState({}, '', window.location.pathname)
    
    loading.value = false
    success.value = true
    
    console.log('✅ [Callback] Confirmation beauté terminée avec succès')
    startCountdown()
    
  } catch (err: any) {
    console.error('❌ [Callback] Erreur:', err)
    
    loading.value = false
    error.value = true
    
    // Messages d'erreur beauté appropriés
    if (err.message?.includes('expired')) {
      errorMessage.value = 'Le lien de confirmation a expiré. Créez un nouveau compte.'
    } else if (err.message?.includes('invalid') || err.message?.includes('token')) {
      errorMessage.value = 'Lien de confirmation invalide. Vérifiez votre email.'
    } else if (err.message?.includes('shop') || err.message?.includes('espace')) {
      errorMessage.value = 'Email confirmé mais configuration beauté échouée. Contactez le support.'
    } else {
      errorMessage.value = 'Erreur de confirmation. Contactez le support si cela persiste.'
    }
  }
})

// ✅ COUNTDOWN SIMPLIFIÉ
const startCountdown = () => {
  const interval = setInterval(() => {
    countdown.value--
    countdownProgress.value = ((3 - countdown.value) / 3) * 100
    
    if (countdown.value <= 0) {
      clearInterval(interval)
      redirectToOnboarding()
    }
  }, 1000)
}

// ✅ REDIRECTION VERS ONBOARDING
const redirectToOnboarding = async () => {
  console.log('🚀 [Callback] Redirection vers onboarding beauté')
  await navigateTo('/onboarding?from=email-confirmation&beauty=true&welcome=true')
}

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