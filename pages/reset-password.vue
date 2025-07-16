<!-- pages/reset-password.vue -->
<template>
  <div class="min-h-screen flex items-center justify-center bg-gray-50 py-12 px-4 sm:px-6 lg:px-8">
    <div class="max-w-md w-full space-y-8">
      <!-- Header -->
      <div class="text-center">
        <div class="mx-auto h-12 w-12 bg-blue-600 rounded-xl flex items-center justify-center">
          <span class="text-white font-bold text-lg">CS</span>
        </div>
        <h2 class="mt-6 text-3xl font-extrabold text-gray-900">
          Mot de passe oublié ?
        </h2>
        <p class="mt-2 text-sm text-gray-600">
          Pas de problème ! Entrez votre email et nous vous enverrons un lien pour réinitialiser votre mot de passe.
        </p>
      </div>

      <!-- Form -->
      <div class="bg-white rounded-lg shadow-md p-8">
        <form v-if="!success" @submit.prevent="handleSubmit" class="space-y-6">
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

          <!-- Error message -->
          <div v-if="error" class="bg-red-50 border border-red-200 rounded-md p-4">
            <div class="flex">
              <ExclamationCircleIcon class="h-5 w-5 text-red-400" />
              <div class="ml-3">
                <h3 class="text-sm font-medium text-red-800">
                  Erreur
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
              class="group relative w-full flex justify-center py-3 px-4 border border-transparent text-sm font-medium rounded-md text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
            >
              <span class="absolute left-0 inset-y-0 flex items-center pl-3">
                <PaperAirplaneIcon class="h-5 w-5 text-blue-500 group-hover:text-blue-400" />
              </span>
              <span v-if="loading" class="flex items-center">
                <svg class="animate-spin -ml-1 mr-3 h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                  <circle class="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" stroke-width="4"></circle>
                  <path class="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                </svg>
                Envoi en cours...
              </span>
              <span v-else>Envoyer le lien de réinitialisation</span>
            </button>
          </div>
        </form>

        <!-- Success message -->
        <div v-if="success" class="text-center space-y-4">
          <div class="bg-green-50 border border-green-200 rounded-md p-4">
            <div class="flex items-center justify-center">
              <CheckCircleIcon class="h-8 w-8 text-green-400" />
            </div>
            <div class="mt-3">
              <h3 class="text-lg font-medium text-green-800">
                Email envoyé !
              </h3>
              <div class="mt-2 text-sm text-green-700">
                Nous avons envoyé un lien de réinitialisation à <strong>{{ form.email }}</strong>.
                Vérifiez votre boîte de réception et suivez les instructions.
              </div>
            </div>
          </div>
          
          <div class="text-sm text-gray-600">
            <p>Vous n'avez pas reçu l'email ?</p>
            <button
              @click="resendEmail"
              :disabled="resendCooldown > 0"
              class="text-blue-600 hover:text-blue-500 font-medium disabled:text-gray-400 disabled:cursor-not-allowed"
            >
              <span v-if="resendCooldown > 0">
                Renvoyer dans {{ resendCooldown }}s
              </span>
              <span v-else>
                Renvoyer l'email
              </span>
            </button>
          </div>
        </div>

        <!-- Back to login link -->
        <div class="text-center mt-6">
          <NuxtLink
            to="/login"
            class="flex items-center justify-center text-sm font-medium text-blue-600 hover:text-blue-500"
          >
            <ArrowLeftIcon class="h-4 w-4 mr-2" />
            Retour à la connexion
          </NuxtLink>
        </div>
      </div>

      <!-- Help section -->
      <div class="text-center">
        <p class="text-xs text-gray-500">
          Besoin d'aide ? Contactez notre support à
          <a href="mailto:support@chatseller.app" class="text-blue-600 hover:text-blue-500">
            support@chatseller.app
          </a>
        </p>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import {
  EnvelopeIcon,
  PaperAirplaneIcon,
  ExclamationCircleIcon,
  CheckCircleIcon,
  ArrowLeftIcon
} from '@heroicons/vue/24/outline'
import { useAuth } from '~/composables/useAuth'

// Seo
definePageMeta({
  layout: false,
  title: 'Réinitialisation du mot de passe - ChatSeller'
})

useSeoMeta({
  title: 'Réinitialisation du mot de passe - ChatSeller',
  description: 'Réinitialisez votre mot de passe ChatSeller'
})

// Auth
const { resetPassword } = useAuth()

// Form state
const form = reactive({
  email: ''
})

const errors = reactive({
  email: ''
})

const loading = ref(false)
const error = ref('')
const success = ref(false)
const resendCooldown = ref(0)

// Validation
const validateForm = () => {
  errors.email = ''
  
  if (!form.email) {
    errors.email = 'L\'adresse email est requise'
    return false
  }
  
  if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(form.email)) {
    errors.email = 'L\'adresse email n\'est pas valide'
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
    const { error: authError } = await resetPassword(form.email)
    
    if (authError) {
      switch (authError.message) {
        case 'User not found':
          error.value = 'Aucun compte trouvé avec cette adresse email'
          break
        case 'Email rate limit exceeded':
          error.value = 'Trop de demandes. Veuillez réessayer plus tard'
          break
        default:
          error.value = 'Une erreur est survenue. Veuillez réessayer'
      }
      return
    }
    
    success.value = true
    startResendCooldown()
  } catch (err) {
    console.error('Reset password error:', err)
    error.value = 'Une erreur inattendue est survenue'
  } finally {
    loading.value = false
  }
}

// Resend email
const resendEmail = async () => {
  if (resendCooldown.value > 0) return
  
  await handleSubmit()
}

// Start cooldown timer
const startResendCooldown = () => {
  resendCooldown.value = 60
  const timer = setInterval(() => {
    resendCooldown.value--
    if (resendCooldown.value <= 0) {
      clearInterval(timer)
    }
  }, 1000)
}

// Auto-focus on email field
onMounted(() => {
  const emailInput = document.getElementById('email')
  if (emailInput) {
    emailInput.focus()
  }
})
</script>