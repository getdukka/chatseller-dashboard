<!-- pages/login.vue -->
<template>
  <div class="w-full max-w-md mx-auto">
    <!-- Logo et titre simple -->
    <div class="text-center mb-6">
      
      <h2 class="text-4xl font-bold bg-gradient-to-r from-gray-900 via-rose-800 to-purple-900 bg-clip-text text-transparent mb-3">
        Accédez à votre espace ChatSeller
      </h2>
      <p class="text-sm text-gray-600">
        Suivez les performances de votre conseillère IA.
      </p>
    </div>

    <!-- Formulaire de connexion simplifié -->
    <div class="bg-white/80 backdrop-blur-sm py-6 px-5 shadow-2xl rounded-2xl border border-rose-100">

      <!-- Bouton Google OAuth -->
      <button
        type="button"
        @click="handleGoogleSignIn"
        :disabled="googleLoading"
        class="w-full flex justify-center items-center py-3 px-4 border-2 border-gray-200 rounded-xl text-sm font-semibold text-gray-700 bg-white hover:bg-gray-50 hover:border-gray-300 focus:outline-none focus:ring-4 focus:ring-gray-100 disabled:opacity-50 disabled:cursor-not-allowed transition-all duration-300 shadow-sm hover:shadow-md"
      >
        <svg v-if="googleLoading" class="animate-spin -ml-1 mr-3 h-4 w-4 text-gray-600" fill="none" viewBox="0 0 24 24">
          <circle class="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" stroke-width="4"></circle>
          <path class="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
        </svg>
        <svg v-else class="w-5 h-5 mr-3" viewBox="0 0 24 24">
          <path fill="#4285F4" d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92a5.06 5.06 0 01-2.2 3.32v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.1z"/>
          <path fill="#34A853" d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"/>
          <path fill="#FBBC05" d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"/>
          <path fill="#EA4335" d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"/>
        </svg>
        {{ googleLoading ? 'Connexion...' : 'Continuer avec Google' }}
      </button>

      <!-- Séparateur "ou" -->
      <div class="relative my-5">
        <div class="absolute inset-0 flex items-center">
          <div class="w-full border-t border-gray-200" />
        </div>
        <div class="relative flex justify-center text-sm">
          <span class="px-3 bg-white text-gray-400 font-medium">ou</span>
        </div>
      </div>

      <form @submit.prevent="handleLogin" class="space-y-4">
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
            class="w-full px-3 py-2.5 border rounded-xl transition-all duration-300 bg-white/50 backdrop-blur-sm text-gray-900 placeholder-gray-500 text-sm"
            :class="{ 
              'border-red-300 focus:ring-red-500 focus:border-red-500': errors.email,
              'border-rose-200 focus:ring-rose-500 focus:border-rose-500': !errors.email
            }"
            placeholder="votre.email@marque-beaute.fr"
          />
          <p v-if="errors.email" class="mt-1 text-xs text-red-600">
            {{ errors.email }}
          </p>
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
              autocomplete="current-password"
              class="w-full px-3 py-2.5 pr-10 border rounded-xl transition-all duration-300 bg-white/50 backdrop-blur-sm text-gray-900 placeholder-gray-500 text-sm"
              :class="{ 
                'border-red-300 focus:ring-red-500 focus:border-red-500': errors.password,
                'border-rose-200 focus:ring-rose-500 focus:border-rose-500': !errors.password
              }"
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
          <p v-if="errors.password" class="mt-1 text-xs text-red-600">
            {{ errors.password }}
          </p>
        </div>

        <!-- Options simples -->
        <div class="flex items-center justify-between">
          <div class="flex items-center">
            <input
              id="remember"
              v-model="form.remember"
              type="checkbox"
              class="h-4 w-4 text-rose-600 focus:ring-rose-500 border-rose-300 rounded transition-colors duration-200"
            />
            <label for="remember" class="ml-2 block text-sm text-gray-700">
              Se souvenir de moi
            </label>
          </div>
          <div class="text-sm">
            <button 
              type="button"
              @click="showResetModal = true"
              class="font-semibold text-rose-600 hover:text-rose-800 transition-colors underline"
            >
              Mot de passe oublié ?
            </button>
          </div>
        </div>

        <!-- Erreur -->
        <div v-if="loginError" class="p-3 rounded-xl bg-red-50 border border-red-200">
          <div class="flex">
            <svg class="h-4 w-4 text-red-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-2.5L13.732 4c-.77-.833-1.964-.833-2.732 0L3.732 16c-.77.833.192 2.5 1.732 2.5z" />
            </svg>
            <div class="ml-2">
              <p class="text-xs text-red-800 font-medium">
                {{ loginError }}
              </p>
            </div>
          </div>
        </div>

        <!-- Bouton connexion simple -->
        <button
          type="submit"
          :disabled="loading"
          class="w-full flex justify-center items-center py-3 px-4 border-0 rounded-xl text-sm font-bold text-white bg-gradient-to-r from-rose-600 via-pink-600 to-purple-600 hover:from-rose-700 hover:via-pink-700 hover:to-purple-700 focus:outline-none focus:ring-4 focus:ring-rose-300 disabled:opacity-50 disabled:cursor-not-allowed transition-all duration-300 shadow-xl hover:shadow-2xl transform hover:scale-105"
        >
          <svg v-if="loading" class="animate-spin -ml-1 mr-3 h-4 w-4 text-white" fill="none" viewBox="0 0 24 24">
            <circle class="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" stroke-width="4"></circle>
            <path class="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
          </svg>
          <svg v-else class="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M8 11V7a4 4 0 118 0m-4 8v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2z"/>
          </svg>
          {{ loading ? 'Connexion...' : 'Se connecter' }}
        </button>
      </form>

      <!-- Séparateur -->
      <div class="mt-6">
        <div class="relative">
          <div class="absolute inset-0 flex items-center">
            <div class="w-full border-t border-rose-200" />
          </div>
          <div class="relative flex justify-center text-sm">
            <span class="px-3 bg-white rounded-xl text-rose-500 font-semibold">Nouveau client ?</span>
          </div>
        </div>

        <!-- Lien inscription simple -->
        <div class="mt-4 text-center">
          <NuxtLink
            to="/register"
            class="inline-flex items-center px-4 py-2 border-2 border-rose-300 rounded-xl text-sm font-bold text-rose-700 bg-gradient-to-r from-white to-rose-50 hover:from-rose-50 hover:to-pink-50 hover:border-rose-400 transition-all duration-300 shadow-lg hover:shadow-xl transform hover:scale-105"
          >
            <svg class="mr-2 h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 6V4m0 2a2 2 0 100 4m0-4a2 2 0 110 4m-6 8a2 2 0 100-4m0 4a2 2 0 100 4m0-4v2m0-6V4m6 6v10m6-2a2 2 0 100-4m0 4a2 2 0 100 4m0-4v2m0-6V4"/>
            </svg>
            Créez votre Vendeuse IA en 2 minutes
            <svg class="ml-2 h-4 w-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M13 7l5 5m0 0l-5 5m5-5H6"/>
            </svg>
          </NuxtLink>
        </div>
      </div>
    </div>

    <!-- Support minimal -->
    <div class="mt-6 text-center">
      <a 
        href="https://chatseller.app/support" 
        class="font-medium text-rose-600 hover:text-rose-800 transition-colors underline text-sm"
      >
        Besoin d'aide ?
      </a>
    </div>

    <!-- Modal Reset Password -->
    <div v-if="showResetModal" class="fixed inset-0 bg-black bg-opacity-50 backdrop-blur-sm flex items-center justify-center p-4 z-50" @click.self="showResetModal = false">
      <div class="bg-white rounded-2xl p-6 max-w-sm w-full shadow-2xl transform transition-all">
        <div class="text-center mb-4">
          <div class="w-12 h-12 bg-gradient-to-br from-rose-100 to-pink-100 rounded-full flex items-center justify-center mx-auto mb-3">
            <svg class="w-6 h-6 text-rose-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M15 7a2 2 0 012 2m4 0a6 6 0 01-7.743 5.743L11 17H9v2H7v2H4a1 1 0 01-1-1v-2.586a1 1 0 01.293-.707l5.964-5.964A6 6 0 1121 9z" />
            </svg>
          </div>
          <h3 class="text-lg font-bold text-gray-900 mb-2">Récupérer votre mot de passe</h3>
          <p class="text-gray-600 text-sm">Saisissez votre adresse email</p>
        </div>
        
        <form @submit.prevent="handlePasswordReset" class="space-y-4">
          <div>
            <input
              v-model="resetEmail"
              type="email"
              required
              placeholder="votre.email@marque-beaute.fr"
              class="w-full px-3 py-3 border border-rose-200 rounded-xl focus:ring-2 focus:ring-rose-500 focus:border-rose-500 transition-all duration-300 text-sm"
            />
          </div>
          
          <div class="flex space-x-3">
            <button
              type="button"
              @click="showResetModal = false"
              class="flex-1 px-3 py-2 border border-gray-300 rounded-xl text-gray-700 hover:bg-gray-50 transition-colors font-medium text-sm"
            >
              Annuler
            </button>
            <button
              type="submit"
              :disabled="resetLoading"
              class="flex-1 px-3 py-2 bg-gradient-to-r from-rose-600 to-pink-600 text-white rounded-xl hover:from-rose-700 hover:to-pink-700 transition-all duration-300 font-medium disabled:opacity-50 text-sm"
            >
              {{ resetLoading ? 'Envoi...' : 'Envoyer' }}
            </button>
          </div>
        </form>
        
        <p v-if="resetMessage" class="mt-4 text-xs text-center" :class="resetError ? 'text-red-600' : 'text-green-600'">
          {{ resetMessage }}
        </p>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, reactive } from 'vue'

// Layout
definePageMeta({
  layout: 'auth'
})

// ✅ UTILISER LE COMPOSABLE AUTH CORRIGÉ
const auth = useAuth()
const loading = ref(false)
const googleLoading = ref(false)
const showPassword = ref(false)
const loginError = ref('')

// Modal reset password
const showResetModal = ref(false)
const resetEmail = ref('')
const resetLoading = ref(false)
const resetMessage = ref('')
const resetError = ref(false)

// Formulaire
const form = reactive({
  email: '',
  password: '',
  remember: false
})

// Erreurs de validation
const errors = reactive({
  email: '',
  password: ''
})

// Validation simple
const validateForm = () => {
  errors.email = ''
  errors.password = ''
  
  if (!form.email) {
    errors.email = 'L\'adresse email est requise'
    return false
  }
  
  if (!form.email.includes('@')) {
    errors.email = 'Veuillez saisir une adresse email valide'
    return false
  }
  
  if (!form.password) {
    errors.password = 'Le mot de passe est requis'
    return false
  }
  
  if (form.password.length < 6) {
    errors.password = 'Le mot de passe doit contenir au moins 6 caractères'
    return false
  }
  
  return true
}

// ✅ CONNEXION
const handleLogin = async () => {
  if (!validateForm()) return
  
  loading.value = true
  loginError.value = ''
  
  try {
    console.log('🔐 [Login Beauty] Tentative de connexion...')
    
    const result = await auth.login({
      email: form.email.trim().toLowerCase(),
      password: form.password
    })
    
    if (!result.success) {
      throw new Error(result.error || 'Erreur de connexion')
    }
    
    console.log('✅ [Login Beauty] Connexion réussie!')
    
  } catch (error: any) {
    console.error('❌ [Login Beauty] Erreur de connexion:', error)
    
    if (error.message?.includes('401') || error.message?.includes('Unauthorized') || error.message?.includes('Invalid')) {
      loginError.value = 'Email ou mot de passe incorrect'
    } else if (error.message?.includes('network') || error.message?.includes('fetch')) {
      loginError.value = 'Problème de connexion. Veuillez réessayer.'
    } else if (error.message?.includes('Email not confirmed')) {
      loginError.value = 'Veuillez confirmer votre email avant de vous connecter. Vérifiez votre boîte mail.'
    } else {
      loginError.value = error.message || 'Une erreur s\'est produite. Veuillez réessayer.'
    }
  } finally {
    loading.value = false
  }
}

// ✅ CONNEXION GOOGLE
const handleGoogleSignIn = async () => {
  googleLoading.value = true
  loginError.value = ''

  try {
    console.log('🔐 [Login] Connexion Google OAuth...')
    const result = await auth.signInWithGoogle()

    if (!result.success) {
      throw new Error(result.error || 'Erreur de connexion Google')
    }

    // La redirection est gérée automatiquement par Supabase
    console.log('✅ [Login] Redirection Google OAuth en cours...')
  } catch (error: any) {
    console.error('❌ [Login] Erreur Google OAuth:', error)
    loginError.value = error.message || 'Erreur de connexion avec Google. Veuillez réessayer.'
    googleLoading.value = false
  }
}

// ✅ RESET PASSWORD
const handlePasswordReset = async () => {
  if (!resetEmail.value) return
  
  resetLoading.value = true
  resetMessage.value = ''
  resetError.value = false
  
  try {
    console.log('🔄 [Login Beauty] Reset password...')
    
    const result = await auth.resetPassword(resetEmail.value.trim().toLowerCase())
    
    if (!result.success) {
      throw new Error(result.error || 'Erreur lors du reset')
    }
    
    resetMessage.value = `Un email de récupération a été envoyé à ${resetEmail.value}`
    resetError.value = false
    
    // Fermer la modal après 3 secondes
    setTimeout(() => {
      showResetModal.value = false
      resetEmail.value = ''
      resetMessage.value = ''
    }, 3000)
    
  } catch (error: any) {
    console.error('❌ [Login Beauty] Erreur reset password:', error)
    resetMessage.value = error.message || 'Erreur lors de l\'envoi de l\'email de récupération'
    resetError.value = true
  } finally {
    resetLoading.value = false
  }
}

// Redirection si déjà connecté
onMounted(async () => {
  await auth.restoreSession()
  if (auth.isAuthenticated.value) {
    await navigateTo('/')
  }
})

// ✅ SEO
useHead({
  title: 'Connexion - ChatSeller',
  meta: [
    { name: 'description', content: 'Connectez-vous à votre dashboard ChatSeller et accédez à vos outils de conversion beauté.' }
  ]
})
</script>

<style scoped>
/* Animations pour les transitions */
.transition-colors {
  transition: color 0.15s ease-in-out, background-color 0.15s ease-in-out, border-color 0.15s ease-in-out;
}

.transition-all {
  transition: all 0.3s ease;
}

/* Animation de rotation pour le spinner */
@keyframes spin {
  from {
    transform: rotate(0deg);
  }
  to {
    transform: rotate(360deg);
  }
}

.animate-spin {
  animation: spin 1s linear infinite;
}

/* Effets premium */
.transform {
  transition: transform 0.3s ease;
}

.hover\\:scale-105:hover {
  transform: scale(1.05);
}

/* Effet glassmorphism */
.backdrop-blur-sm {
  backdrop-filter: blur(4px);
}

/* Focus states premium */
.focus\\:ring-rose-500:focus {
  box-shadow: 0 0 0 3px rgba(251, 113, 133, 0.1);
}

/* Modal animation */
.transform {
  animation: modalSlide 0.3s ease-out;
}

@keyframes modalSlide {
  from {
    opacity: 0;
    transform: scale(0.95);
  }
  to {
    opacity: 1;
    transform: scale(1);
  }
}
</style>