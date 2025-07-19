<!-- pages/login.vue -->
<template>
  <div class="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 flex items-center justify-center py-12 px-4 sm:px-6 lg:px-8">
    <div class="max-w-md w-full space-y-8">
      <!-- Header -->
      <div class="text-center">
        <h1 class="text-3xl font-bold text-gray-900 mb-2">
          ChatSeller Dashboard
        </h1>
        <p class="text-gray-600">
          Connectez-vous à votre tableau de bord
        </p>
      </div>

      <!-- Login Form -->
      <div class="bg-white rounded-xl shadow-lg p-8">
        <form @submit.prevent="handleLogin" class="space-y-6">
          <!-- Email Field -->
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
              :disabled="isLoading"
              class="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent disabled:bg-gray-50 disabled:text-gray-500"
              placeholder="votre@email.com"
            />
            <p v-if="errors.email" class="mt-1 text-sm text-red-600">
              {{ errors.email }}
            </p>
          </div>

          <!-- Password Field -->
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
                :disabled="isLoading"
                class="w-full px-3 py-2 pr-10 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent disabled:bg-gray-50 disabled:text-gray-500"
                placeholder="••••••••"
              />
              <button
                type="button"
                @click="showPassword = !showPassword"
                class="absolute inset-y-0 right-0 pr-3 flex items-center"
                :disabled="isLoading"
              >
                <svg
                  v-if="showPassword"
                  class="h-5 w-5 text-gray-400 hover:text-gray-600"
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                >
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M13.875 18.825A10.05 10.05 0 0112 19c-4.478 0-8.268-2.943-9.543-7a9.97 9.97 0 011.563-3.029m5.858.908a3 3 0 114.243 4.243M9.878 9.878l4.242 4.242M9.878 9.878L3 3m6.878 6.878L21 21" />
                </svg>
                <svg
                  v-else
                  class="h-5 w-5 text-gray-400 hover:text-gray-600"
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                >
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" />
                </svg>
              </button>
            </div>
            <p v-if="errors.password" class="mt-1 text-sm text-red-600">
              {{ errors.password }}
            </p>
          </div>

          <!-- Remember me -->
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
            
            <a href="#" class="text-sm text-blue-600 hover:text-blue-500">
              Mot de passe oublié ?
            </a>
          </div>

          <!-- Error message -->
          <div v-if="authError" class="bg-red-50 border border-red-200 rounded-lg p-4">
            <div class="flex">
              <svg class="h-5 w-5 text-red-400" fill="currentColor" viewBox="0 0 20 20">
                <path fill-rule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z" clip-rule="evenodd" />
              </svg>
              <div class="ml-3">
                <h3 class="text-sm font-medium text-red-800">
                  Erreur de connexion
                </h3>
                <p class="mt-1 text-sm text-red-700">
                  {{ authError }}
                </p>
              </div>
            </div>
          </div>

          <!-- Submit Button -->
          <button
            type="submit"
            :disabled="isLoading || !isFormValid"
            class="w-full flex justify-center py-3 px-4 border border-transparent rounded-lg shadow-sm text-sm font-medium text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
          >
            <svg
              v-if="isLoading"
              class="animate-spin -ml-1 mr-3 h-5 w-5 text-white"
              fill="none"
              viewBox="0 0 24 24"
            >
              <circle
                class="opacity-25"
                cx="12"
                cy="12"
                r="10"
                stroke="currentColor"
                stroke-width="4"
              />
              <path
                class="opacity-75"
                fill="currentColor"
                d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
              />
            </svg>
            {{ isLoading ? 'Connexion...' : 'Se connecter' }}
          </button>
        </form>

        <!-- Test Credentials -->
        <div class="mt-6 p-4 bg-gray-50 rounded-lg">
          <h4 class="text-sm font-medium text-gray-700 mb-2">
            Credentials de test :
          </h4>
          <div class="text-xs text-gray-600 space-y-1">
            <p><strong>Email:</strong> admin@chatseller.app</p>
            <p><strong>Password:</strong> password</p>
          </div>
          <button
            @click="fillTestCredentials"
            type="button"
            class="mt-2 text-xs text-blue-600 hover:text-blue-500"
          >
            Utiliser ces identifiants
          </button>
        </div>
      </div>

      <!-- Footer -->
      <div class="text-center text-sm text-gray-500">
        <p>
          Nouveau sur ChatSeller ?
          <a href="#" class="text-blue-600 hover:text-blue-500">
            Créer un compte
          </a>
        </p>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
definePageMeta({
  layout: false, // No default layout for login page
  middleware: [] // No auth middleware on login page
})

// =====================================
// COMPOSABLES AND STORES
// =====================================

const { login, isLoading, error: authError, clearError } = useAuth()
const { success, handleApiError } = useNotifications()

// =====================================
// REACTIVE STATE
// =====================================

const form = reactive({
  email: '',
  password: '',
  remember: false
})

const errors = reactive({
  email: '',
  password: ''
})

const showPassword = ref(false)

// =====================================
// COMPUTED
// =====================================

const isFormValid = computed(() => {
  return form.email.trim() !== '' && 
         form.password.trim() !== '' && 
         form.email.includes('@') &&
         form.password.length >= 6
})

// =====================================
// METHODS
// =====================================

/**
 * Validate form fields
 */
const validateForm = (): boolean => {
  // Clear previous errors
  errors.email = ''
  errors.password = ''
  
  let isValid = true

  // Email validation
  if (!form.email.trim()) {
    errors.email = 'L\'adresse email est requise'
    isValid = false
  } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(form.email)) {
    errors.email = 'Veuillez entrer une adresse email valide'
    isValid = false
  }

  // Password validation
  if (!form.password.trim()) {
    errors.password = 'Le mot de passe est requis'
    isValid = false
  } else if (form.password.length < 6) {
    errors.password = 'Le mot de passe doit contenir au moins 6 caractères'
    isValid = false
  }

  return isValid
}

/**
 * Handle login form submission
 */
const handleLogin = async (): Promise<void> => {
  // Clear any existing errors
  clearError()
  
  // Validate form
  if (!validateForm()) {
    return
  }

  try {
    const loginSuccess = await login(form.email.trim(), form.password)
    
    if (loginSuccess) {
      // Show success notification
      success('Connexion réussie', 'Redirection vers le dashboard...')
      
      // Redirect to dashboard after a short delay
      setTimeout(() => {
        navigateTo('/')
      }, 1000)
    }
    // Error handling is done by the auth store and displayed in the UI
  } catch (error: any) {
    // Additional error handling if needed
    handleApiError(error, 'Connexion')
  }
}

/**
 * Fill form with test credentials
 */
const fillTestCredentials = (): void => {
  form.email = 'admin@chatseller.app'
  form.password = 'password'
  form.remember = true
  
  // Clear any existing errors
  clearError()
  errors.email = ''
  errors.password = ''
}

/**
 * Clear errors when form changes
 */
watch([() => form.email, () => form.password], () => {
  if (authError.value) {
    clearError()
  }
  
  // Clear field-specific errors when user starts typing
  if (errors.email && form.email.trim()) {
    errors.email = ''
  }
  if (errors.password && form.password.trim()) {
    errors.password = ''
  }
})

// =====================================
// LIFECYCLE
// =====================================

onMounted(() => {
  // Clear any existing auth errors
  clearError()
  
  // Focus on email field
  nextTick(() => {
    const emailInput = document.getElementById('email')
    if (emailInput) {
      emailInput.focus()
    }
  })
})

// =====================================
// SEO
// =====================================

useHead({
  title: 'Connexion - ChatSeller Dashboard',
  meta: [
    {
      name: 'description',
      content: 'Connectez-vous à votre tableau de bord ChatSeller pour gérer votre agent IA commercial.'
    }
  ]
})
</script>