<!-- pages/auth/callback.vue - VERSION FINALE AVEC AFFICHAGE FORCÉ -->
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
        <p class="text-gray-600 mb-4">
          Veuillez patienter pendant que nous validons votre compte.
        </p>
        
        <!-- Progress steps -->
        <div class="text-sm text-gray-500 space-y-1">
          <p v-if="step === 'tokens'">🔑 Récupération des tokens...</p>
          <p v-else-if="step === 'session'">🔐 Création de la session...</p>
          <p v-else-if="step === 'store'">💾 Mise à jour des données...</p>
          <p v-else-if="step === 'creating-shop'">🏪 Création de votre espace...</p>
          <p v-else-if="step === 'redirect'">🚀 Finalisation...</p>
          <p v-else>⏳ Initialisation...</p>
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
          🎉 Votre e-mail est confirmé !
        </h2>
        <p class="text-gray-600 mb-4">
          Votre compte ChatSeller a été activé avec succès.
        </p>
        <div class="bg-blue-50 border border-blue-200 rounded-lg p-4 mb-6">
          <p class="text-blue-800 text-sm">
            <strong>Prochaine étape :</strong> Configuration de votre compte Chatseller
          </p>
        </div>
        
        <!-- Progress bar -->
        <div class="mb-6">
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
        
        <!-- Action button -->
        <button
          @click="redirectToApp"
          class="w-full bg-blue-600 text-white py-3 px-4 rounded-lg font-medium hover:bg-blue-700 transition-colors"
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
import { useSupabase } from '~~/composables/useSupabase'
import { useAuthStore } from '~~/stores/auth'

definePageMeta({
  layout: false
})

const supabase = useSupabase()

// State
const loading = ref(true)
const success = ref(false)
const error = ref(false)
const errorMessage = ref('')
const countdown = ref(5) // ✅ AUGMENTÉ À 5 SECONDES
const progressWidth = ref(0)
const step = ref('init')

// ✅ NOUVELLES VARIABLES POUR FORCER L'AFFICHAGE
const processingComplete = ref(false)
const redirecting = ref(false)

// Traitement principal
onMounted(async () => {
  try {
    console.log('🔗 [Callback] Début traitement confirmation email...')
    
    step.value = 'tokens'
    
    // ✅ DÉLAI MINIMUM POUR VOIR LE LOADING
    await new Promise(resolve => setTimeout(resolve, 800))
    
    // ✅ MÉTHODE AMÉLIORÉE : Gérer tous les types d'URLs de callback Supabase
    let accessToken = ''
    let refreshToken = ''
    let tokenHash = ''
    let type = ''
    
    // Vérifier les fragments d'URL (#)
    if (window.location.hash && window.location.hash.includes('access_token')) {
      console.log('🔑 [Callback] Tokens détectés dans hash')
      const hashParams = new URLSearchParams(window.location.hash.substring(1))
      accessToken = hashParams.get('access_token') || ''
      refreshToken = hashParams.get('refresh_token') || ''
      type = hashParams.get('type') || ''
    }
    // Vérifier les paramètres de query (?)
    else if (window.location.search) {
      console.log('🔑 [Callback] Tokens détectés dans query')
      const urlParams = new URLSearchParams(window.location.search)
      accessToken = urlParams.get('access_token') || ''
      refreshToken = urlParams.get('refresh_token') || ''
      tokenHash = urlParams.get('token_hash') || ''
      type = urlParams.get('type') || ''
    }
    
    // ✅ NOUVELLE GESTION : Support token_hash (format moderne Supabase)
    if (!accessToken && tokenHash) {
      console.log('🔑 [Callback] Token hash détecté, échange en cours...')
      
      const { data, error } = await supabase.auth.verifyOtp({
        token_hash: tokenHash,
        type: 'email'
      })
      
      if (error || !data.session) {
        throw new Error(error?.message || 'Impossible de vérifier le token')
      }
      
      accessToken = data.session.access_token
      refreshToken = data.session.refresh_token
      type = 'signup'
    }
    
    if (!accessToken && !tokenHash) {
      throw new Error('Aucun token de confirmation trouvé dans l\'URL')
    }
    
    console.log('✅ [Callback] Tokens récupérés:', { 
      hasAccess: !!accessToken, 
      hasRefresh: !!refreshToken, 
      type 
    })
    
    step.value = 'session'
    await new Promise(resolve => setTimeout(resolve, 500))
    
    // ✅ CRÉER/RÉCUPÉRER LA SESSION
    let sessionData
    
    if (accessToken && refreshToken) {
      // Tokens complets disponibles
      const { data, error: sessionError } = await supabase.auth.setSession({
        access_token: accessToken,
        refresh_token: refreshToken
      })
      
      if (sessionError || !data.session) {
        throw new Error(sessionError?.message || 'Impossible de créer la session')
      }
      
      sessionData = data
    } else {
      // Récupérer la session actuelle (cas token_hash)
      const { data, error } = await supabase.auth.getSession()
      
      if (error || !data.session) {
        throw new Error('Aucune session active après vérification')
      }
      
      sessionData = data
    }
    
    console.log('✅ [Callback] Session créée pour:', sessionData.user?.email)
    
    step.value = 'store'
    await new Promise(resolve => setTimeout(resolve, 500))
    
    // ✅ METTRE À JOUR LE STORE
    try {
      const authStore = useAuthStore()
      const userData = await authStore.fetchCompleteUserDataViaAPI(
        sessionData.user, 
        sessionData.session.access_token
      )
      authStore.setUser(userData, sessionData.session.access_token)
      
      console.log('✅ [Callback] Store mis à jour avec succès')
    } catch (storeError) {
      console.warn('⚠️ [Callback] Erreur store, utilisation données auth:', storeError)
      
      // Fallback simple
      const authStore = useAuthStore()
      const fallbackUser = {
        id: sessionData.user.id,
        email: sessionData.user.email!,
        name: sessionData.user.user_metadata?.name || sessionData.user.email?.split('@')[0],
        firstName: sessionData.user.user_metadata?.first_name,
        lastName: sessionData.user.user_metadata?.last_name,
        shopId: sessionData.user.id,
        shop_id: sessionData.user.id,
        avatar: sessionData.user.user_metadata?.avatar_url,
        role: 'user' as const,
        createdAt: sessionData.user.created_at,
        shop: null
      }
      
      authStore.setUser(fallbackUser, sessionData.session.access_token)
    }
    
    // ✅ NOUVEAU : CRÉER LE SHOP SI NÉCESSAIRE
    step.value = 'creating-shop'
    await new Promise(resolve => setTimeout(resolve, 500))
    
    try {
      await ensureShopExists(sessionData.user, sessionData.session.access_token)
      console.log('✅ [Callback] Shop vérifié/créé avec succès')
    } catch (shopError) {
      console.warn('⚠️ [Callback] Erreur shop (non bloquante):', shopError)
      // Ne pas bloquer pour un problème de shop
    }
    
    // ✅ NETTOYER L'URL
    window.history.replaceState({}, '', window.location.pathname)
    
    step.value = 'redirect'
    
    // ✅ MARQUER COMME COMPLÉTÉ ET AFFICHER L'INTERFACE DE SUCCÈS
    loading.value = false
    success.value = true
    processingComplete.value = true
    
    console.log('✅ [Callback] Confirmation réussie - Affichage interface succès')
    startCountdown()
    
  } catch (err: any) {
    console.error('❌ [Callback] Erreur:', err)
    
    loading.value = false
    error.value = true
    
    // Messages d'erreur user-friendly
    if (err.message?.includes('expired')) {
      errorMessage.value = 'Le lien de confirmation a expiré. Veuillez créer un nouveau compte.'
    } else if (err.message?.includes('invalid') || err.message?.includes('token')) {
      errorMessage.value = 'Le lien de confirmation est invalide. Vérifiez votre email ou réessayez.'
    } else if (err.message?.includes('already') || err.message?.includes('confirmed')) {
      errorMessage.value = 'Ce compte a déjà été confirmé. Vous pouvez vous connecter.'
    } else {
      errorMessage.value = 'Erreur lors de la confirmation. Contactez le support si le problème persiste.'
    }
  }
})

// ✅ FONCTION POUR CRÉER LE SHOP SI NÉCESSAIRE
const ensureShopExists = async (user: any, token: string) => {
  try {
    console.log('🏪 [Callback] Vérification existence shop...')
    
    const config = useRuntimeConfig()
    const baseURL = config.public.apiBaseUrl
    
    // Essayer de récupérer le shop
    try {
      const shopResponse = await $fetch(`/api/v1/shops/${user.id}`, {
        baseURL,
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json'
        }
      })
      
      if (shopResponse && shopResponse.data) {
        console.log('✅ [Callback] Shop existe déjà')
        return shopResponse.data
      }
    } catch (fetchError: any) {
      if (!fetchError.message?.includes('404')) {
        throw fetchError // Relancer si ce n'est pas une 404
      }
      console.log('🆕 [Callback] Shop manquant (404), création nécessaire...')
    }
    
    // Créer le shop
    console.log('🆕 [Callback] Création du shop...')
    const createResponse = await $fetch('/api/v1/shops', {
      method: 'POST',
      baseURL,
      headers: {
        'Authorization': `Bearer ${token}`,
        'Content-Type': 'application/json'
      },
      body: {
        id: user.id,
        name: `Shop de ${user.user_metadata?.first_name || user.email?.split('@')[0]}`,
        email: user.email,
        subscription_plan: 'free',
        is_active: true,
        onboarding_completed: false, // ✅ IMPORTANT
        widget_config: {
          theme: 'modern',
          primaryColor: '#E91E63',
          position: 'bottom-right',
          buttonText: 'Parler au vendeur',
          language: 'fr'
        },
        agent_config: {
          name: 'Rose',
          avatar: 'https://ui-avatars.com/api/?name=Rose&background=E91E63&color=fff',
          welcomeMessage: 'Bonjour ! Je suis votre assistante d\'achat. Comment puis-je vous aider ?',
          fallbackMessage: 'Je transmets votre question à notre équipe, un conseiller vous recontactera bientôt.',
          collectPaymentMethod: true,
          upsellEnabled: false
        }
      }
    })
    
    console.log('✅ [Callback] Shop créé avec succès')
    return createResponse.data
    
  } catch (error: any) {
    console.error('❌ [Callback] Erreur ensure shop:', error)
    throw error
  }
}

// Countdown et redirection
const startCountdown = () => {
  const interval = setInterval(() => {
    countdown.value--
    progressWidth.value = ((5 - countdown.value) / 5) * 100
    
    if (countdown.value <= 0) {
      clearInterval(interval)
      redirectToApp()
    }
  }, 1000)
}

// Redirection intelligente
const redirectToApp = async () => {
  if (redirecting.value) return // Éviter double redirection
  redirecting.value = true
  
  console.log('🚀 [Callback] Redirection vers onboarding...')
  
  // ✅ TOUJOURS REDIRIGER VERS ONBOARDING APRÈS CONFIRMATION EMAIL
  await navigateTo('/onboarding?from=email-confirmation', { replace: true })
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