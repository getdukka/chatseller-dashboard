<!-- pages/login.vue -->
<template>
  <div class="min-h-screen flex items-center justify-center bg-gray-50 py-12 px-4 sm:px-6 lg:px-8">
    <div class="max-w-md w-full space-y-8">
      <!-- Header -->
      <div class="text-center">
        <div class="mx-auto h-12 w-12 bg-blue-500 rounded-xl flex items-center justify-center">
          <span class="text-white font-bold text-lg">CS</span>
        </div>
        <h2 class="mt-6 text-3xl font-extrabold text-gray-900">
          Connexion à ChatSeller
        </h2>
        <p class="mt-2 text-sm text-gray-600">
          Accédez au dashboard de votre Vendeur IA
        </p>
      </div>

      <!-- Form -->
      <div class="bg-white rounded-lg shadow-md p-8">
        <form @submit.prevent="handleSubmit" class="space-y-6">
          <!-- Email field -->
          <div>
            <label for="email" class="sr-only">Adresse email</label>
            <div class="relative">
              <div class="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                <EnvelopeIcon class="h-5 w-5 text-gray-400" />
              </div>
              <input
                id="email"
                v-model="form.email"
                type="email"
                autocomplete="email"
                required
                class="block w-full pl-10 pr-3 py-3 border border-gray-300 rounded-md leading-5 bg-white placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
                :class="{ 'border-red-300 focus:ring-red-500 focus:border-red-500': errors.email }"
                placeholder="Votre adresse email"
              />
            </div>
            <p v-if="errors.email" class="mt-2 text-sm text-red-600">{{ errors.email }}</p>
          </div>

          <!-- Password field -->
          <div>
            <label for="password" class="sr-only">Mot de passe</label>
            <div class="relative">
              <div class="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                <LockClosedIcon class="h-5 w-5 text-gray-400" />
              </div>
              <input
                id="password"
                v-model="form.password"
                :type="showPassword ? 'text' : 'password'"
                autocomplete="current-password"
                required
                class="block w-full pl-10 pr-10 py-3 border border-gray-300 rounded-md leading-5 bg-white placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
                :class="{ 'border-red-300 focus:ring-red-500 focus:border-red-500': errors.password }"
                placeholder="Votre mot de passe"
              />
              <button
                type="button"
                @click="showPassword = !showPassword"
                class="absolute inset-y-0 right-0 pr-3 flex items-center"
              >
                <EyeIcon v-if="!showPassword" class="h-5 w-5 text-gray-400 hover:text-gray-600" />
                <EyeSlashIcon v-else class="h-5 w-5 text-gray-400 hover:text-gray-600" />
              </button>
            </div>
            <p v-if="errors.password" class="mt-2 text-sm text-red-600">{{ errors.password }}</p>
          </div>

          <!-- Remember me & Forgot password -->
          <div class="flex items-center justify-between">
            <div class="flex items-center">
              <input
                id="remember-me"
                v-model="form.rememberMe"
                type="checkbox"
                class="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 rounded"
              />
              <label for="remember-me" class="ml-2 block text-sm text-gray-900">
                Se souvenir de moi
              </label>
            </div>

            <div class="text-sm">
              <NuxtLink to="/reset-password" class="font-medium text-blue-500 hover:text-blue-600">
                Mot de passe oublié ?
              </NuxtLink>
            </div>
          </div>

          <!-- Error message -->
          <div v-if="error" class="bg-red-50 border border-red-200 rounded-md p-4">
            <div class="flex">
              <ExclamationCircleIcon class="h-5 w-5 text-red-400" />
              <div class="ml-3">
                <h3 class="text-sm font-medium text-red-800">
                  Erreur de connexion
                </h3>
                <div class="mt-2 text-sm text-red-700">
                  {{ error }}
                </div>
              </div>
            </div>
          </div>

          <!-- Submit button -->
          <div>
            <button
              type="submit"
              :disabled="loading"
              class="group relative w-full flex justify-center py-3 px-4 border border-transparent text-sm font-medium rounded-md text-white bg-blue-500 hover:bg-blue-600 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
            >
              <span class="absolute left-0 inset-y-0 flex items-center pl-3">
                <LockClosedIcon class="h-5 w-5 text-blue-500 group-hover:text-blue-400" />
              </span>
              <span v-if="loading" class="flex items-center">
                <svg class="animate-spin -ml-1 mr-3 h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                  <circle class="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" stroke-width="4"></circle>
                  <path class="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                </svg>
                Connexion...
              </span>
              <span v-else>Se connecter</span>
            </button>
          </div>

          <!-- Sign up link -->
          <div class="text-center">
            <p class="text-sm text-gray-600">
              Pas encore de compte ?
              <NuxtLink to="/register" class="font-medium text-blue-500 hover:text-blue-600">
                Créer un compte gratuit
              </NuxtLink>
            </p>
          </div>
        </form>
      </div>

      <!-- Social proof -->
      <div class="text-center">
        <p class="text-xs text-gray-500">
          Rejoignez des centaines d'e-commerçants qui font confiance à ChatSeller
        </p>
        <div class="mt-4 flex justify-center space-x-6">
          <div class="flex items-center text-gray-400">
            <CheckIcon class="h-4 w-4 mr-1" />
            <span class="text-xs">Gratuit 14 jours</span>
          </div>
          <div class="flex items-center text-gray-400">
            <ShieldCheckIcon class="h-4 w-4 mr-1" />
            <span class="text-xs">Données sécurisées</span>
          </div>
          <div class="flex items-center text-gray-400">
            <ClockIcon class="h-4 w-4 mr-1" />
            <span class="text-xs">Setup 5 min</span>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import {
  EnvelopeIcon,
  LockClosedIcon,
  EyeIcon,
  EyeSlashIcon,
  ExclamationCircleIcon,
  CheckIcon,
  ShieldCheckIcon,
  ClockIcon
} from '@heroicons/vue/24/outline'
import { useAuth } from '~/composables/useAuth'

// Seo
definePageMeta({
  layout: false,
  title: 'Connexion - ChatSeller Dashboard'
})

useSeoMeta({
  title: 'Connexion - ChatSeller Dashboard',
  description: 'Connectez-vous à votre dashboard ChatSeller pour gérer votre Agent IA Commercial'
})

// Auth
const { signIn } = useAuth()
const router = useRouter()

// Form state
const form = reactive({
  email: '',
  password: '',
  rememberMe: false
})

const errors = reactive({
  email: '',
  password: ''
})

const showPassword = ref(false)
const loading = ref(false)
const error = ref('')

// Validation rules
const validateForm = () => {
  errors.email = ''
  errors.password = ''
  
  if (!form.email) {
    errors.email = 'L\'adresse email est requise'
    return false
  }
  
  if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(form.email)) {
    errors.email = 'L\'adresse email n\'est pas valide'
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

// Handle form submission
const handleSubmit = async () => {
  if (!validateForm()) return
  
  loading.value = true
  error.value = ''
  
  try {
    const { data, error: authError } = await signIn(form.email, form.password)
    
    if (authError) {
      switch (authError.message) {
        case 'Invalid login credentials':
          error.value = 'Email ou mot de passe incorrect'
          break
        case 'Email not confirmed':
          error.value = 'Veuillez confirmer votre email avant de vous connecter'
          break
        case 'Too many requests':
          error.value = 'Trop de tentatives de connexion. Veuillez réessayer plus tard'
          break
        default:
          error.value = 'Une erreur est survenue. Veuillez réessayer'
      }
      return
    }
    
    if (data?.user) {
      // Success notification
      const notification = inject('setNotification') as (message: string) => void
      notification('Connexion réussie ! Bienvenue sur ChatSeller')
      
      // Redirect to dashboard
      await router.push('/')
    }
  } catch (err) {
    console.error('Login error:', err)
    error.value = 'Une erreur inattendue est survenue'
  } finally {
    loading.value = false
  }
}

// Auto-focus on email field
onMounted(() => {
  const emailInput = document.getElementById('email')
  if (emailInput) {
    emailInput.focus()
  }
})
</script>