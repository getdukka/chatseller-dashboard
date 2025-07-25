<!-- pages/login.vue - VERSION COMPATIBLE CORRIGÉE -->
<template>
  <div>
    <!-- Logo et titre -->
    <div class="text-center mb-8">
      <div class="flex justify-center mb-4">
        <div class="flex h-12 w-12 items-center justify-center rounded-xl bg-blue-600 shadow-lg">
          <span class="text-lg font-bold text-white">CS</span>
        </div>
      </div>
      <h2 class="text-3xl font-bold text-gray-900">
        Connexion à votre dashboard
      </h2>
      <p class="mt-2 text-sm text-gray-600">
        Configurez et Gérez votre Vendeur IA
      </p>
    </div>

    <!-- Formulaire de connexion -->
    <div class="bg-white py-8 px-6 shadow-xl rounded-xl border border-gray-100">
      <form @submit.prevent="handleLogin" class="space-y-6">
        <!-- Email -->
        <div>
          <label for="email" class="block text-sm font-medium text-gray-700 mb-2">
            Adresse email
          </label>
          <input
            id="email"
            v-model="form.email"
            type="email"
            required
            autocomplete="email"
            class="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-colors"
            :class="{ 'border-red-500 focus:ring-red-500 focus:border-red-500': errors.email }"
            placeholder="votre.email@entreprise.com"
          />
          <p v-if="errors.email" class="mt-1 text-sm text-red-600">
            {{ errors.email }}
          </p>
        </div>

        <!-- Mot de passe -->
        <div>
          <label for="password" class="block text-sm font-medium text-gray-700 mb-2">
            Mot de passe
          </label>
          <div class="relative">
            <input
              id="password"
              v-model="form.password"
              :type="showPassword ? 'text' : 'password'"
              required
              autocomplete="current-password"
              class="w-full px-4 py-3 pr-12 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-colors"
              :class="{ 'border-red-500 focus:ring-red-500 focus:border-red-500': errors.password }"
              placeholder="••••••••"
            />
            <button
              type="button"
              @click="showPassword = !showPassword"
              class="absolute inset-y-0 right-0 pr-3 flex items-center"
            >
              <svg v-if="!showPassword" class="h-5 w-5 text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" />
              </svg>
              <svg v-else class="h-5 w-5 text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M13.875 18.825A10.05 10.05 0 0112 19c-4.478 0-8.268-2.943-9.543-7a9.97 9.97 0 011.563-3.029m5.858.908a3 3 0 114.243 4.243M9.878 9.878l4.242 4.242M9.878 9.878L3 3m6.878 6.878L21 21" />
              </svg>
            </button>
          </div>
          <p v-if="errors.password" class="mt-1 text-sm text-red-600">
            {{ errors.password }}
          </p>
        </div>

        <!-- Options -->
        <div class="flex items-center justify-between">
          <div class="flex items-center">
            <input
              id="remember"
              v-model="form.remember"
              type="checkbox"
              class="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 rounded"
            />
            <label for="remember" class="ml-2 block text-sm text-gray-700">
              Se souvenir de moi
            </label>
          </div>
          <div class="text-sm">
            <a href="#" class="font-medium text-blue-600 hover:text-blue-500 transition-colors">
              Mot de passe oublié ?
            </a>
          </div>
        </div>

        <!-- Message d'erreur global -->
        <div v-if="loginError" class="p-4 rounded-lg bg-red-50 border border-red-200">
          <div class="flex">
            <svg class="h-5 w-5 text-red-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-2.5L13.732 4c-.77-.833-1.964-.833-2.732 0L3.732 16c-.77.833.192 2.5 1.732 2.5z" />
            </svg>
            <div class="ml-3">
              <p class="text-sm text-red-800">
                {{ loginError }}
              </p>
            </div>
          </div>
        </div>

        <!-- Bouton de connexion -->
        <button
          type="submit"
          :disabled="loading"
          class="w-full flex justify-center items-center py-3 px-4 border border-transparent rounded-lg text-sm font-medium text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
        >
          <svg v-if="loading" class="animate-spin -ml-1 mr-3 h-5 w-5 text-white" fill="none" viewBox="0 0 24 24">
            <circle class="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" stroke-width="4"></circle>
            <path class="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
          </svg>
          {{ loading ? 'Connexion...' : 'Se connecter' }}
        </button>
      </form>

      <!-- Séparateur -->
      <div class="mt-6">
        <div class="relative">
          <div class="absolute inset-0 flex items-center">
            <div class="w-full border-t border-gray-300" />
          </div>
          <div class="relative flex justify-center text-sm">
            <span class="px-2 bg-white text-gray-500">Nouveau sur ChatSeller ?</span>
          </div>
        </div>

        <!-- Lien vers inscription -->
        <div class="mt-4 text-center">
          <NuxtLink
            to="/register"
            class="inline-flex items-center px-4 py-2 border border-gray-300 rounded-lg text-sm font-medium text-gray-700 bg-white hover:bg-gray-50 transition-colors"
          >
            <svg class="mr-2 h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M18 9v3m0 0v3m0-3h3m-3 0h-3m-2-5a4 4 0 11-8 0 4 4 0 018 0zM3 20a6 6 0 0112 0v1H3v-1z" />
            </svg>
            Créer un compte
          </NuxtLink>
        </div>
      </div>
    </div>

    <!-- Aide et support -->
    <div class="mt-8 text-center">
      <p class="text-sm text-gray-600">
        Besoin d'aide ? 
        <a href="https://chatseller.app/support" class="font-medium text-blue-600 hover:text-blue-500 transition-colors">
          Contactez notre support
        </a>
      </p>
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
const showPassword = ref(false)
const loginError = ref('')

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

// Validation
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

// ✅ GESTION DE LA CONNEXION - UTILISE LE COMPOSABLE AUTH
const handleLogin = async () => {
  if (!validateForm()) return
  
  loading.value = true
  loginError.value = ''
  
  try {
    console.log('🔐 Tentative de connexion...')
    
    const result = await auth.login({
      email: form.email.trim().toLowerCase(),
      password: form.password
    })
    
    if (!result.success) {
      throw new Error(result.error || 'Erreur de connexion')
    }
    
    console.log('✅ Connexion réussie!')
    // La navigation se fait automatiquement dans le composable auth
    
  } catch (error: any) {
    console.error('❌ Erreur de connexion:', error)
    
    // Messages d'erreur personnalisés
    if (error.message?.includes('401') || error.message?.includes('Unauthorized')) {
      loginError.value = 'Email ou mot de passe incorrect'
    } else if (error.message?.includes('network') || error.message?.includes('fetch')) {
      loginError.value = 'Problème de connexion. Veuillez réessayer.'
    } else {
      loginError.value = error.message || 'Une erreur s\'est produite. Veuillez réessayer.'
    }
  } finally {
    loading.value = false
  }
}

// Redirection si déjà connecté
onMounted(async () => {
  await auth.restoreSession()
  if (auth.isAuthenticated.value) {
    await navigateTo('/')
  }
})
</script>

<style scoped>
/* Animations pour les transitions */
.transition-colors {
  transition: color 0.15s ease-in-out, background-color 0.15s ease-in-out, border-color 0.15s ease-in-out;
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
</style>