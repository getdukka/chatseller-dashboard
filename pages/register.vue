<!-- pages/register.vue -->
<template>
  <div class="w-full max-w-md mx-auto">
    <!-- Titre et sous-titre -->
    <div class="text-center mb-6">
      <h2 class="text-3xl sm:text-4xl font-bold bg-gradient-to-r from-gray-900 via-rose-800 to-purple-900 bg-clip-text text-transparent mb-3">
        Créez votre Vendeuse IA
      </h2>
      <p class="text-sm text-gray-600 leading-relaxed">
        Rejoignez les marques beauté qui augmentent leurs ventes de
        <span class="font-semibold text-rose-600">+150%</span> en moyenne grâce à leur Vendeuse IA.
      </p>
    </div>

    <!-- Message de succès après inscription -->
    <div v-if="registrationSuccess" class="bg-white py-6 px-5 shadow-2xl rounded-2xl border border-rose-100 backdrop-blur-sm">
      <div class="text-center">
        <div class="flex justify-center mb-4">
          <div class="w-14 h-14 bg-gradient-to-br from-green-100 to-emerald-100 rounded-full flex items-center justify-center">
            <svg class="w-7 h-7 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M3 8l7.89 3.26a2 2 0 001.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z"/>
            </svg>
          </div>
        </div>

        <h3 class="text-lg font-bold text-gray-900 mb-3">
          Confirmez votre email pour démarrer
        </h3>
        <p class="text-gray-600 mb-4 text-sm">
          Un email de confirmation a été envoyé à<br>
          <strong class="text-rose-600">{{ form.email }}</strong>
        </p>

        <!-- Étapes visuelles compactes -->
        <div class="bg-gradient-to-r from-rose-50 to-pink-50 border border-rose-200 rounded-xl p-3 mb-4">
          <h4 class="font-semibold text-rose-800 mb-2 text-xs">
            Prochaines étapes (3 minutes) :
          </h4>
          <div class="space-y-2 text-xs">
            <div class="flex items-center text-rose-700">
              <div class="w-5 h-5 bg-rose-500 text-white rounded-full flex items-center justify-center mr-2 text-xs font-bold">1</div>
              <div class="text-left">
                <div class="font-semibold">Confirmation de votre e-mail</div>
              </div>
            </div>
            <div class="flex items-center text-rose-700">
              <div class="w-5 h-5 bg-rose-500 text-white rounded-full flex items-center justify-center mr-2 text-xs font-bold">2</div>
              <div class="text-left">
                <div class="font-semibold">Configuration de votre compte</div>
              </div>
            </div>
            <div class="flex items-center text-rose-700">
              <div class="w-5 h-5 bg-rose-500 text-white rounded-full flex items-center justify-center mr-2 text-xs font-bold">3</div>
              <div class="text-left">
                <div class="font-semibold">Création de votre Vendeuse IA</div>
              </div>
            </div>
          </div>
        </div>

        <!-- Boutons email compacts -->
        <div class="flex gap-2 mb-4">
          <a
            :href="getGmailUrl(form.email)"
            target="_blank"
            class="flex-1 inline-flex items-center justify-center px-3 py-2 bg-gradient-to-r from-red-600 to-red-700 text-white rounded-xl hover:from-red-700 hover:to-red-800 transition-all duration-300 font-semibold shadow-lg hover:shadow-xl transform hover:scale-105 text-xs"
          >
            <svg class="w-3 h-3 mr-1" viewBox="0 0 24 24" fill="currentColor">
              <path d="M24 5.457v13.909c0 .904-.732 1.636-1.636 1.636h-3.819V11.73L12 16.64l-6.545-4.91v9.273H1.636A1.636 1.636 0 0 1 0 19.366V5.457c0-2.023 2.309-3.178 3.927-1.964L5.455 4.64 12 9.548l6.545-4.91 1.528-1.145C21.69 2.28 24 3.434 24 5.457z"/>
            </svg>
            Gmail
          </a>

          <a
            :href="getOutlookUrl(form.email)"
            target="_blank"
            class="flex-1 inline-flex items-center justify-center px-3 py-2 bg-gradient-to-r from-blue-600 to-blue-700 text-white rounded-xl hover:from-blue-700 hover:to-blue-800 transition-all duration-300 font-semibold shadow-lg hover:shadow-xl transform hover:scale-105 text-xs"
          >
            <svg class="w-3 h-3 mr-1" viewBox="0 0 24 24" fill="currentColor">
              <path d="M7.88 12.04q0 .45-.11.87-.1.41-.33.74-.22.33-.58.52-.37.2-.87.2t-.85-.2q-.35-.21-.57-.55-.22-.33-.33-.75-.1-.42-.1-.83 0-.46.1-.87.1-.41.33-.74.22-.33.57-.52.36-.19.85-.19t.87.19q.36.19.58.52.22.33.33.74.11.41.11.87zM21.5 12v.13q0 2.06-1.32 3.54-1.32 1.48-3.5 1.48-2.04 0-3.44-1.48Q12 14.19 12 12.13v-.26q0-2.06 1.24-3.54 1.24-1.48 3.44-1.48 2.18 0 3.5 1.48Q21.5 9.81 21.5 12z"/>
            </svg>
            Outlook
          </a>
        </div>

        <!-- Troubleshooting compact -->
        <div class="bg-gradient-to-r from-amber-50 to-orange-50 border border-amber-200 rounded-xl p-3 mb-4">
          <div class="text-xs text-amber-800">
            <p class="font-semibold mb-1">Pas d'email ?</p>
            <div class="text-left space-y-1">
              <div>• Vérifiez vos spams</div>
              <div>• Patientez 2-3 minutes</div>
            </div>
          </div>
        </div>

        <!-- Bouton renvoyer -->
        <button
          @click="resendEmail"
          :disabled="resendLoading || resendCooldown > 0"
          class="text-xs font-semibold transition-all duration-300 px-3 py-2 rounded-lg"
          :class="resendCooldown > 0 ? 'text-gray-400 cursor-not-allowed bg-gray-100' : 'text-rose-600 hover:text-rose-800 hover:bg-rose-50 border border-rose-200'"
        >
          {{ resendCooldown > 0 ? `Renvoyer dans ${resendCooldown}s` : (resendLoading ? 'Renvoi en cours...' : 'Renvoyer l\'email') }}
        </button>
      </div>
    </div>

    <!-- Formulaire d'inscription -->
    <div v-else class="bg-white/80 backdrop-blur-sm py-6 px-5 shadow-2xl rounded-2xl border border-rose-100">

      <!-- Bouton Google OAuth -->
      <button
        type="button"
        @click="handleGoogleSignIn"
        :disabled="googleLoading"
        class="w-full flex items-center justify-center gap-3 py-2.5 px-4 border-2 border-gray-200 rounded-xl text-sm font-semibold text-gray-700 bg-white hover:bg-gray-50 hover:border-gray-300 transition-all duration-200 mb-5"
      >
        <svg v-if="!googleLoading" class="w-5 h-5" viewBox="0 0 24 24">
          <path d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92a5.06 5.06 0 01-2.2 3.32v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.1z" fill="#4285F4"/>
          <path d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" fill="#34A853"/>
          <path d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z" fill="#FBBC05"/>
          <path d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z" fill="#EA4335"/>
        </svg>
        <svg v-else class="animate-spin w-5 h-5 text-gray-400" fill="none" viewBox="0 0 24 24">
          <circle class="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" stroke-width="4"></circle>
          <path class="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
        </svg>
        {{ googleLoading ? 'Connexion...' : 'Continuer avec Google' }}
      </button>

      <!-- Séparateur -->
      <div class="relative mb-5">
        <div class="absolute inset-0 flex items-center">
          <div class="w-full border-t border-gray-200" />
        </div>
        <div class="relative flex justify-center text-xs">
          <span class="px-3 bg-white text-gray-400">ou</span>
        </div>
      </div>

      <form @submit.prevent="handleRegister" class="space-y-4">

        <!-- Email -->
        <div>
          <label for="email" class="block text-sm font-semibold text-gray-700 mb-1">
            Adresse email
          </label>
          <input
            id="email"
            v-model="form.email"
            type="email"
            required
            autocomplete="email"
            class="w-full px-3 py-2.5 border border-rose-200 rounded-xl focus:ring-2 focus:ring-rose-500 focus:border-rose-500 transition-all duration-300 bg-white/50 backdrop-blur-sm text-gray-900 placeholder-gray-500 text-sm"
            placeholder="prenom@mamarque.com"
          />
        </div>

        <!-- Mot de passe -->
        <div>
          <label for="password" class="block text-sm font-semibold text-gray-700 mb-1">
            Mot de passe
          </label>
          <div class="relative">
            <input
              id="password"
              v-model="form.password"
              :type="showPassword ? 'text' : 'password'"
              required
              autocomplete="new-password"
              class="w-full px-3 py-2.5 pr-10 border border-rose-200 rounded-xl focus:ring-2 focus:ring-rose-500 focus:border-rose-500 transition-all duration-300 bg-white/50 backdrop-blur-sm text-gray-900 placeholder-gray-500 text-sm"
              placeholder="••••••••"
            />
            <button
              type="button"
              @click="showPassword = !showPassword"
              class="absolute inset-y-0 right-0 pr-3 flex items-center text-rose-400 hover:text-rose-600 transition-colors duration-200"
            >
              <svg v-if="!showPassword" class="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" />
              </svg>
              <svg v-else class="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M13.875 18.825A10.05 10.05 0 0112 19c-4.478 0-8.268-2.943-9.543-7a9.97 9.97 0 011.563-3.029m5.858.908a3 3 0 114.243 4.243M9.878 9.878l4.242 4.242M9.878 9.878L3 3m6.878 6.878L21 21" />
              </svg>
            </button>
          </div>
          <p class="mt-1 text-xs text-gray-500">
            Minimum 8 caractères
          </p>
        </div>

        <!-- Conditions -->
        <div class="flex items-start">
          <div class="flex items-center h-5 mt-0.5">
            <input
              id="terms"
              v-model="form.acceptTerms"
              type="checkbox"
              required
              class="h-4 w-4 text-rose-600 focus:ring-rose-500 border-rose-300 rounded transition-colors duration-200"
            />
          </div>
          <div class="ml-2 text-xs leading-relaxed">
            <label for="terms" class="text-gray-700">
              J'accepte les
              <a href="https://chatseller.app/terms" class="font-semibold text-rose-600 hover:text-rose-800 transition-colors underline" target="_blank">
                conditions
              </a>
              et la
              <a href="https://chatseller.app/privacy" class="font-semibold text-rose-600 hover:text-rose-800 transition-colors underline" target="_blank">
                confidentialité
              </a>
            </label>
          </div>
        </div>

        <!-- Erreur -->
        <div v-if="registerError" class="p-3 rounded-xl bg-red-50 border border-red-200">
          <div class="flex">
            <svg class="h-4 w-4 text-red-400 flex-shrink-0 mt-0.5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-2.5L13.732 4c-.77-.833-1.964-.833-2.732 0L3.732 16c-.77.833.192 2.5 1.732 2.5z" />
            </svg>
            <div class="ml-2">
              <p class="text-xs text-red-800 font-medium">
                {{ registerError }}
              </p>
            </div>
          </div>
        </div>

        <!-- Bouton inscription -->
        <button
          type="submit"
          :disabled="loading"
          class="w-full flex justify-center items-center py-3 px-4 border-0 rounded-xl text-sm font-bold text-white bg-gradient-to-r from-rose-600 via-pink-600 to-purple-600 hover:from-rose-700 hover:via-pink-700 hover:to-purple-700 focus:outline-none focus:ring-4 focus:ring-rose-300 disabled:opacity-50 disabled:cursor-not-allowed transition-all duration-300 shadow-xl hover:shadow-2xl transform hover:scale-105"
        >
          <svg v-if="loading" class="animate-spin -ml-1 mr-3 h-4 w-4 text-white" fill="none" viewBox="0 0 24 24">
            <circle class="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" stroke-width="4"></circle>
            <path class="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
          </svg>
          {{ loading ? 'Création en cours...' : 'Démarrer l\'essai gratuit de 14 jours' }}
        </button>

        <!-- Réassurance -->
        <p class="text-center text-xs text-gray-500">
          14 jours d'essai gratuits, sans carte bancaire
        </p>
      </form>

      <!-- Lien connexion -->
      <div class="mt-6">
        <div class="relative">
          <div class="absolute inset-0 flex items-center">
            <div class="w-full border-t border-rose-200" />
          </div>
          <div class="relative flex justify-center text-sm">
            <span class="px-3 bg-white rounded-xl text-rose-500 font-semibold">Déjà client ?</span>
          </div>
        </div>

        <div class="mt-4 text-center">
          <NuxtLink
            to="/login"
            class="inline-flex items-center px-4 py-2 border border-rose-300 rounded-xl text-sm font-semibold text-rose-700 bg-gradient-to-r from-rose-50 to-pink-50 hover:from-rose-100 hover:to-pink-100 transition-all duration-300 shadow-md hover:shadow-lg transform hover:scale-105"
          >
            <svg class="mr-2 h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M11 16l-4-4m0 0l4-4m-4 4h14m-5 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1" />
            </svg>
            Se connecter
          </NuxtLink>
        </div>
      </div>
    </div>

  </div>
</template>

<script setup lang="ts">
import { useSupabase } from '~~/composables/useSupabase'

const auth = useAuth()

definePageMeta({
  layout: 'auth'
})

// État du composant
const loading = ref(false)
const googleLoading = ref(false)
const showPassword = ref(false)
const registerError = ref('')
const registrationSuccess = ref(false)
const resendLoading = ref(false)
const resendCooldown = ref(0)

// Formulaire simplifié (sans prénom/nom)
const form = reactive({
  email: '',
  password: '',
  acceptTerms: false
})

// INSCRIPTION VIA GOOGLE OAUTH
const handleGoogleSignIn = async () => {
  googleLoading.value = true
  registerError.value = ''

  try {
    console.log('🔐 [Register] Connexion via Google...')
    const result = await auth.signInWithGoogle()

    if (!result.success) {
      throw new Error(result.error || 'Erreur de connexion Google')
    }

    // La redirection est gérée par Supabase
    console.log('✅ [Register] Redirection Google OAuth en cours...')
  } catch (error: any) {
    console.error('❌ [Register] Erreur Google OAuth:', error)
    registerError.value = error.message || 'Erreur de connexion avec Google. Veuillez réessayer.'
    googleLoading.value = false
  }
}

// INSCRIPTION VIA EMAIL/PASSWORD
const handleRegister = async () => {
  if (!validateForm()) return

  loading.value = true
  registerError.value = ''

  try {
    console.log('📝 [Register] Inscription via email...')

    const result = await auth.register({
      email: form.email.trim().toLowerCase(),
      password: form.password,
      firstName: '',
      lastName: '',
      company: '',
      platform: '',
      newsletter: true
    })

    if (!result.success) {
      throw new Error(result.error || 'Erreur de création de compte')
    }

    console.log('✅ [Register] Inscription réussie')
    registrationSuccess.value = true
    startResendCooldown()

  } catch (error: any) {
    console.error('❌ [Register] Erreur inscription:', error)
    registerError.value = getErrorMessage(error)
  } finally {
    loading.value = false
  }
}

// MESSAGES D'ERREUR PERSONNALISÉS
const getErrorMessage = (error: any): string => {
  const message = error.message || error

  if (message.includes('User already registered') || message.includes('already registered')) {
    return 'Cette adresse email est déjà utilisée. Essayez de vous connecter.'
  }

  if (message.includes('email')) {
    return 'Problème avec l\'adresse email fournie'
  }

  if (message.includes('password')) {
    return 'Le mot de passe ne respecte pas les critères (minimum 8 caractères)'
  }

  if (message.includes('rate limit')) {
    return 'Trop de tentatives. Veuillez patienter quelques minutes.'
  }

  return message || 'Une erreur s\'est produite lors de la création de votre compte'
}

// VALIDATION
const validateForm = () => {
  registerError.value = ''

  if (!form.email.trim() || !form.password || !form.acceptTerms) {
    registerError.value = 'Veuillez remplir tous les champs et accepter les conditions'
    return false
  }

  if (form.password.length < 8) {
    registerError.value = 'Le mot de passe doit contenir au moins 8 caractères'
    return false
  }

  if (!form.email.includes('@') || !form.email.includes('.')) {
    registerError.value = 'Veuillez saisir une adresse email valide'
    return false
  }

  return true
}

// RENVOYER EMAIL
const resendEmail = async () => {
  if (resendCooldown.value > 0) return

  resendLoading.value = true

  try {
    const supabase = useSupabase()

    const { error } = await supabase.auth.resend({
      type: 'signup',
      email: form.email.trim().toLowerCase()
    })

    if (error) {
      throw new Error(error.message)
    }

    startResendCooldown()

  } catch (error: any) {
    console.error('❌ [Register] Erreur renvoi email:', error)
    registerError.value = `Erreur lors du renvoi: ${error.message}`
  } finally {
    resendLoading.value = false
  }
}

// COOLDOWN
const startResendCooldown = () => {
  resendCooldown.value = 60
  const timer = setInterval(() => {
    resendCooldown.value--
    if (resendCooldown.value <= 0) {
      clearInterval(timer)
    }
  }, 1000)
}

// Générer URL Gmail
const getGmailUrl = (email: string) => {
  const domain = email.split('@')[1]
  if (domain === 'gmail.com') {
    return 'https://mail.google.com/mail/u/0/#inbox'
  }
  return 'https://mail.google.com/'
}

// Générer URL Outlook
const getOutlookUrl = (email: string) => {
  const domain = email.split('@')[1]
  if (['outlook.com', 'hotmail.com', 'live.com'].includes(domain)) {
    return 'https://outlook.live.com/mail/0/inbox'
  }
  return 'https://outlook.office.com/mail/'
}

// REDIRECTION SI DÉJÀ CONNECTÉ
onMounted(async () => {
  if (auth.isAuthenticated.value) {
    await navigateTo('/')
  }
})

// SEO
useHead({
  title: 'Créer un compte - ChatSeller',
  meta: [
    { name: 'description', content: 'Créez votre vendeuse IA beauté en 5 minutes. +150% de conversions en moyenne. 14 jours d\'essai gratuits.' },
    { name: 'keywords', content: 'ChatSeller, vendeuse IA, marque beauté, conversion, e-commerce beauté' }
  ]
})
</script>

<style scoped>
.animate-spin {
  animation: spin 1s linear infinite;
}

@keyframes spin {
  from { transform: rotate(0deg); }
  to { transform: rotate(360deg); }
}

.transform {
  transition: transform 0.3s ease;
}

.hover\:scale-105:hover {
  transform: scale(1.05);
}

.backdrop-blur-sm {
  backdrop-filter: blur(4px);
}

.focus\:ring-rose-500:focus {
  box-shadow: 0 0 0 3px rgba(251, 113, 133, 0.1);
}
</style>
