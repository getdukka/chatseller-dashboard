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
          Votre Vendeuse IA vous attend...
        </h2>
        <p class="text-gray-600 mb-4">
          Nous préparons votre espace de gestion
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
          {{ isReturningUser ? '👋 Bon retour !' : '🎉 Email confirmé !' }}
        </h2>
        <p class="text-gray-600 mb-4">
          {{ isReturningUser ? 'Mia vous attend dans votre espace de gestion' : 'Mia est prête à rejoindre votre boutique' }}
        </p>
        <div class="bg-rose-50 border border-rose-200 rounded-lg p-4 mb-6">
          <p class="text-rose-800 text-sm">
            <strong>{{ isReturningUser ? 'Redirection :' : 'Prochaine étape :' }}</strong>
            {{ isReturningUser ? 'Vous allez accéder à votre espace de gestion' : 'Finalisons ensemble le recrutement de Mia pour votre boutique' }}
          </p>
        </div>
        
        <div class="mb-6">
          <p class="text-sm text-gray-500 mb-2">
            Redirection automatique dans {{ countdown }} secondes...
          </p>
          <div class="w-full bg-gray-200 rounded-full h-2">
            <div 
              class="bg-gradient-to-r from-rose-600 to-pink-600 h-2 rounded-full transition-all duration-100 ease-linear"
              :style="{ width: `${countdownProgress}%` }"
            ></div>
          </div>
        </div>
        
        <button
          @click="redirectAfterAuth"
          class="w-full bg-gradient-to-r from-rose-600 to-pink-600 text-white py-3 px-4 rounded-lg font-medium hover:from-rose-700 hover:to-pink-700 transition-all shadow-lg transform hover:scale-105"
        >
          {{ isReturningUser ? 'Accéder à mon espace de gestion' : 'Finaliser le recrutement de Mia' }}
        </button>
      </div>

      <!-- Error State -->
      <div v-else-if="error" class="bg-white rounded-xl shadow-xl border border-gray-100 p-8 text-center">
        <div class="flex justify-center mb-4">
          <div class="w-16 h-16 bg-amber-100 rounded-full flex items-center justify-center">
            <svg class="w-8 h-8 text-amber-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 9v2m0 4h.01M10.29 3.86L1.82 18a2 2 0 001.71 3h16.94a2 2 0 001.71-3L13.71 3.86a2 2 0 00-3.42 0z"/>
            </svg>
          </div>
        </div>
        <h2 class="text-xl font-semibold text-gray-900 mb-2">
          Lien expiré
        </h2>
        <p class="text-gray-600 mb-2">
          Ce lien de confirmation n'est plus valide.
        </p>
        <p class="text-sm text-gray-500 mb-6">
          Connectez-vous directement avec votre email et mot de passe.
        </p>

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
const countdown = ref(1) // Fast redirect
const countdownProgress = ref(0)
const currentStep = ref('Analyse du lien de confirmation...')
const isReturningUser = ref(false) // ✅ NOUVEAU: Distinguer login vs register

// ✅ FONCTION SIMPLIFIÉE : Analyser URL callback
const parseCallbackUrl = () => {
  const url = window.location.href
  const hash = window.location.hash
  const search = window.location.search

  console.log('🔍 [Callback] Analyse URL:', url)

  let tokens: Record<string, string> = {
    access_token: '',
    refresh_token: '',
    token_hash: '',
    type: '',
    code: '',  // ✅ AJOUT: Pour PKCE flow
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
    tokens.code = hashParams.get('code') || ''
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
    if (!tokens.code) tokens.code = urlParams.get('code') || ''
    if (!tokens.error) tokens.error = urlParams.get('error') || ''
    if (!tokens.error_description) tokens.error_description = urlParams.get('error_description') || ''
  }

  console.log('🔍 [Callback] Tokens parsés:', {
    hasAccessToken: !!tokens.access_token,
    hasRefreshToken: !!tokens.refresh_token,
    hasTokenHash: !!tokens.token_hash,
    hasCode: !!tokens.code,
    type: tokens.type,
    error: tokens.error
  })

  return tokens
}

// ✅ FONCTION SIMPLIFIÉE : Établir session Supabase
const establishSupabaseSession = async (tokens: any) => {
  console.log('🔐 [Callback] Création session Supabase')
  currentStep.value = '🔑 Vérification de votre identité...'

  // ✅ MÉTHODE 1: Vérifier si Supabase a déjà établi une session automatiquement
  // (Supabase gère le callback automatiquement dans certains cas)
  const { data: existingSession } = await supabase.auth.getSession()
  if (existingSession?.session?.user) {
    console.log('✅ [Callback] Session Supabase déjà établie automatiquement')
    return existingSession
  }

  // Vérifier les erreurs dans les tokens
  if (tokens.error) {
    throw new Error(tokens.error_description || tokens.error)
  }

  let sessionData = null

  // ✅ MÉTHODE 2: Utiliser token_hash (format moderne Supabase)
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
  // ✅ MÉTHODE 3: Utiliser access_token + refresh_token (format classique)
  else if (tokens.access_token && tokens.refresh_token) {
    console.log('🔑 [Callback] Utilisation access_token + refresh_token')

    const { data, error } = await supabase.auth.setSession({
      access_token: tokens.access_token,
      refresh_token: tokens.refresh_token
    })

    if (error) {
      throw new Error(`Erreur session: ${error.message}`)
    }

    sessionData = data
  }
  // ✅ MÉTHODE 4: Essayer exchangeCodeForSession si un 'code' est présent
  else if (tokens.code) {
    console.log('🔑 [Callback] Utilisation code PKCE')

    const { data, error } = await supabase.auth.exchangeCodeForSession(tokens.code)

    if (error) {
      throw new Error(`Erreur échange code: ${error.message}`)
    }

    sessionData = data
  }
  // ✅ MÉTHODE 5: Dernière tentative - attendre que Supabase traite l'URL
  else {
    console.log('⏳ [Callback] Attente traitement automatique Supabase...')

    // Attendre un peu car Supabase peut avoir besoin de temps pour traiter
    await new Promise(resolve => setTimeout(resolve, 1000))

    const { data: retrySession } = await supabase.auth.getSession()
    if (retrySession?.session?.user) {
      console.log('✅ [Callback] Session établie après attente')
      return retrySession
    }

    throw new Error('Aucun token valide trouvé. Le lien de confirmation a peut-être expiré.')
  }

  return sessionData
}

// ✅ FONCTION SIMPLIFIÉE : Assurer l'existence du shop - UTILISER useApi()
const ensureShopExists = async (user: any) => {
  console.log('🏪 [Callback] Vérification/création shop beauté pour:', user.id)
  currentStep.value = '✨ Préparation de votre espace Mia...'

  // ✅ ÉTAPE 1: Vérifier si le shop existe
  const shopResponse = await api.shops.get(user.id)

  if (shopResponse.success && shopResponse.data) {
    console.log('✅ [Callback] Shop beauté existant trouvé:', shopResponse.data.id)
    return shopResponse.data
  }

  // ✅ ÉTAPE 2: Le shop n'existe pas, on le crée
  console.log('ℹ️ [Callback] Shop non trouvé, création en cours...')

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
      buttonText: 'Parler à Mia',
      language: 'fr'
    }
  }

  console.log('📝 [Callback] Données de création shop:', JSON.stringify(createData, null, 2))

  const createResponse = await api.shops.create(createData)

  if (!createResponse.success) {
    console.error('❌ [Callback] Erreur création shop:', createResponse.error)
    throw new Error(createResponse.error || 'Erreur création shop beauté')
  }

  console.log('✅ [Callback] Shop beauté créé avec succès:', createResponse.data?.id)
  return createResponse.data
}

// ✅ FONCTION PRINCIPALE: Traiter la session une fois établie
const processSession = async (session: any) => {
  try {
    const user = session.user

    console.log('✅ [Callback] Email confirmé pour:', user.email)

    // ✅ ÉTAPE 3: Assurer l'existence du shop beauté AVANT de synchroniser le store
    currentStep.value = '✨ Préparation de votre espace de gestion...'

    try {
      const shopData = await ensureShopExists(user)
      console.log('✅ [Callback] Shop beauté configuré:', shopData?.id)

      // ✅ DÉTECTER SI L'UTILISATEUR A DÉJÀ COMPLÉTÉ L'ONBOARDING
      if (shopData?.onboarding_completed) {
        isReturningUser.value = true
        console.log('✅ [Callback] Utilisateur existant détecté (onboarding déjà complété)')
      }
    } catch (shopError: any) {
      console.error('❌ [Callback] Erreur configuration Mia:', shopError)
      throw new Error(`Configuration de Mia échouée: ${shopError.message}`)
    }

    // ✅ ÉTAPE 4: Synchroniser store (maintenant que le shop existe)
    currentStep.value = '💾 Chargement de vos données...'

    try {
      // ✅ UTILISER fetchCompleteUserData du composable auth
      const userData = await auth.fetchCompleteUserData(user)
      authStore.setUser(userData, session.access_token)
      console.log('✅ [Callback] Store synchronisé')
    } catch (storeError) {
      console.warn('⚠️ [Callback] Erreur store (non critique):', storeError)
    }

    // ✅ FINALISATION - Redirect immediately for returning users
    window.history.replaceState({}, '', window.location.pathname)
    console.log('✅ [Callback] Confirmation terminée')

    // Returning users: skip success screen, redirect immediately
    if (isReturningUser.value) {
      return navigateTo('/')
    }

    // New users: brief success then redirect to onboarding
    loading.value = false
    success.value = true
    startCountdown()

  } catch (err: any) {
    console.error('❌ [Callback] Erreur traitement session:', err)
    throw err
  }
}

// ✅ TRAITEMENT PRINCIPAL - APPROCHE ROBUSTE
onMounted(async () => {
  console.log('🔗 [Callback] Début traitement confirmation email')

  // ✅ ÉTAPE 0 : Si l'utilisateur a déjà une session valide → aller au dashboard directement
  const { data: quickCheck } = await supabase.auth.getSession()
  if (quickCheck?.session?.user) {
    console.log('✅ [Callback] Session active trouvée, redirection dashboard')
    return navigateTo('/')
  }

  // ✅ ÉTAPE 0b : Si l'URL ne contient aucun token → inutile d'attendre, aller au login
  const urlHasToken = window.location.hash.includes('access_token') ||
                      window.location.hash.includes('token_hash') ||
                      window.location.search.includes('code=') ||
                      window.location.search.includes('token_hash=')

  if (!urlHasToken) {
    console.log('ℹ️ [Callback] Pas de token dans l\'URL → redirection login')
    return navigateTo('/login')
  }

  let sessionProcessed = false
  let timeoutId: ReturnType<typeof setTimeout>
  let listenerRef: any = null

  // Fonction centralisée pour signaler l'échec immédiatement
  const failNow = (err: Error) => {
    if (sessionProcessed) return
    sessionProcessed = true
    clearTimeout(timeoutId)
    listenerRef?.data?.subscription?.unsubscribe()
    handleError(err)
  }

  // Timeout de sécurité (si tout hang)
  timeoutId = setTimeout(() => {
    failNow(new Error('Le lien a expiré ou est invalide.'))
  }, 12000)

  // ✅ APPROCHE 1: Écouter l'événement SIGNED_IN / INITIAL_SESSION de Supabase
  listenerRef = supabase.auth.onAuthStateChange(async (event: string, session: any) => {
    console.log('🔄 [Callback] Auth event reçu:', event)

    if (sessionProcessed) return

    if ((event === 'SIGNED_IN' || event === 'INITIAL_SESSION') && session?.user) {
      sessionProcessed = true
      clearTimeout(timeoutId)
      console.log('✅ [Callback] Session via événement', event)
      currentStep.value = '🔑 Session établie...'

      try {
        await processSession(session)
      } catch (err: any) {
        handleError(err)
      }

      listenerRef?.data?.subscription?.unsubscribe()
    }
  })

  // ✅ APPROCHE 2: Attendre que Supabase traite le hash (detectSessionInUrl)
  currentStep.value = '🔍 Vérification du lien...'
  await new Promise(resolve => setTimeout(resolve, 800))

  if (!sessionProcessed) {
    const { data: sessionData } = await supabase.auth.getSession()

    if (sessionData?.session?.user) {
      sessionProcessed = true
      clearTimeout(timeoutId)
      console.log('✅ [Callback] Session via getSession')
      currentStep.value = '🔑 Session établie...'

      try {
        await processSession(sessionData.session)
      } catch (err: any) {
        handleError(err)
      }

      listenerRef?.data?.subscription?.unsubscribe()
      return
    }
  }

  // ✅ APPROCHE 3: setSession manuel avec les tokens de l'URL
  if (!sessionProcessed) {
    currentStep.value = '🔑 Vérification des credentials...'
    const tokens = parseCallbackUrl()

    // Erreur explicite dans l'URL (ex: OAuth refusé)
    if (tokens.error) {
      failNow(new Error(tokens.error_description || tokens.error))
      return
    }

    try {
      const sessionData = await Promise.race([
        establishSupabaseSession(tokens),
        new Promise<null>((_, reject) =>
          setTimeout(() => reject(new Error('Délai dépassé (8s)')), 8000)
        )
      ])

      if (sessionData && (sessionData as any)?.session?.user) {
        sessionProcessed = true
        clearTimeout(timeoutId)
        listenerRef?.data?.subscription?.unsubscribe()
        await processSession((sessionData as any).session)
      } else {
        // setSession a répondu mais sans session valide → token expiré ou déjà utilisé
        failNow(new Error('Le lien a expiré ou a déjà été utilisé.'))
      }
    } catch (err: any) {
      // Erreur réseau ou token rejeté → afficher immédiatement
      console.error('❌ [Callback] setSession échoué:', err.message)
      failNow(err)
    }
  }
})

// ✅ GESTION DES ERREURS
const handleError = (err: any) => {
  console.error('❌ [Callback] Erreur:', err)

  loading.value = false
  error.value = true

  // Tous les cas → message générique + bouton Se connecter bien visible
  errorMessage.value = err.message || 'Lien invalide ou expiré.'
}

// ✅ COUNTDOWN SIMPLIFIÉ
const startCountdown = () => {
  const interval = setInterval(() => {
    countdown.value--
    countdownProgress.value = ((1 - countdown.value) / 1) * 100
    
    if (countdown.value <= 0) {
      clearInterval(interval)
      redirectAfterAuth()
    }
  }, 1000)
}

// ✅ REDIRECTION INTELLIGENTE : DASHBOARD OU ONBOARDING
const redirectAfterAuth = async () => {
  if (isReturningUser.value) {
    console.log('🚀 [Callback] Utilisateur existant → redirection vers Dashboard')
    await navigateTo('/')
  } else {
    console.log('🚀 [Callback] Nouvel utilisateur → redirection vers Onboarding')
    await navigateTo('/onboarding?from=email-confirmation&beauty=true&welcome=true')
  }
}

useHead({
  title: 'Mia vous attend | ChatSeller',
  meta: [
    { name: 'description', content: 'Confirmez votre email et Finalisez le recrutement de Mia' },
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