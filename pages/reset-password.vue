<!-- pages/reset-password.vue -->
<template>
  <div class="min-h-screen flex items-center justify-center bg-gray-50 py-12 px-4 sm:px-6 lg:px-8">
    <div class="max-w-md w-full space-y-8">
      <div>
        <div class="mx-auto h-12 w-12 flex items-center justify-center rounded-full bg-blue-100">
          <EnvelopeIcon class="h-6 w-6 text-blue-600" />
        </div>
        <h2 class="mt-6 text-center text-3xl font-bold text-gray-900">
          Réinitialisation du mot de passe
        </h2>
        <p class="mt-2 text-center text-sm text-gray-600">
          {{ success ? 'Email envoyé avec succès' : 'Entrez votre adresse email pour recevoir un lien de réinitialisation' }}
        </p>
      </div>

      <!-- Formulaire de réinitialisation -->
      <form v-if="!success" class="mt-8 space-y-6" @submit.prevent="handleSubmit">
        <div>
          <label for="email" class="sr-only">
            Adresse email
          </label>
          <div class="relative">
            <div class="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
              <EnvelopeIcon class="h-5 w-5 text-gray-400" />
            </div>
            <input
              id="email"
              v-model="form.email"
              name="email"
              type="email"
              autocomplete="email"
              required
              class="appearance-none rounded-md relative block w-full pl-10 pr-3 py-2 border placeholder-gray-500 text-gray-900 focus:outline-none focus:ring-blue-500 focus:border-blue-500 focus:z-10 sm:text-sm"
              :class="errors.email ? 'border-red-300' : 'border-gray-300'"
              placeholder="Adresse email"
            />
          </div>
          <p v-if="errors.email" class="mt-2 text-sm text-red-600">
            {{ errors.email }}
          </p>
        </div>

        <!-- Message d'erreur global -->
        <div v-if="error" class="alert-error">
          <div class="flex">
            <div class="flex-shrink-0">
              <ExclamationCircleIcon class="h-5 w-5 text-red-400" />
            </div>
            <div class="ml-3">
              <p class="text-sm text-red-800">{{ error }}</p>
            </div>
          </div>
        </div>

        <div>
          <button
            type="submit"
            :disabled="loading"
            class="group relative w-full flex justify-center py-2 px-4 border border-transparent text-sm font-medium rounded-md text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 disabled:opacity-50 disabled:cursor-not-allowed"
          >
            <span class="absolute left-0 inset-y-0 flex items-center pl-3">
              <svg
                v-if="loading"
                class="animate-spin h-5 w-5 text-blue-500 group-hover:text-blue-400"
                fill="none"
                viewBox="0 0 24 24"
              >
                <circle class="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" stroke-width="4"></circle>
                <path class="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
              </svg>
              <PaperAirplaneIcon v-else class="h-5 w-5 text-blue-500 group-hover:text-blue-400" />
            </span>
            {{ loading ? 'Envoi en cours...' : 'Envoyer le lien de réinitialisation' }}
          </button>
        </div>

        <div class="text-center">
          <NuxtLink
            to="/login"
            class="font-medium text-blue-600 hover:text-blue-500 flex items-center justify-center"
          >
            <ArrowLeftIcon class="h-4 w-4 mr-2" />
            Retour à la connexion
          </NuxtLink>
        </div>
      </form>

      <!-- Message de succès -->
      <div v-else class="text-center space-y-6">
        <div class="mx-auto h-16 w-16 flex items-center justify-center rounded-full bg-green-100">
          <CheckCircleIcon class="h-8 w-8 text-green-600" />
        </div>
        
        <div>
          <h3 class="text-lg font-medium text-gray-900 mb-2">
            Email de réinitialisation envoyé
          </h3>
          <p class="text-sm text-gray-600 mb-4">
            Nous avons envoyé un lien de réinitialisation de mot de passe à <strong>{{ form.email }}</strong>.
            Vérifiez votre boîte email et suivez les instructions.
          </p>
          <p class="text-xs text-gray-500">
            Le lien expirera dans 24 heures. Si vous ne recevez pas l'email, vérifiez votre dossier spam.
          </p>
        </div>

        <div class="space-y-3">
          <button
            v-if="resendCooldown <= 0"
            @click="resendEmail"
            class="w-full btn-secondary"
          >
            Renvoyer l'email
          </button>
          <button
            v-else
            disabled
            class="w-full btn-secondary opacity-50 cursor-not-allowed"
          >
            Renvoyer dans {{ resendCooldown }}s
          </button>

          <NuxtLink
            to="/login"
            class="w-full btn-primary flex items-center justify-center"
          >
            <ArrowLeftIcon class="h-4 w-4 mr-2" />
            Retour à la connexion
          </NuxtLink>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, reactive, onMounted } from 'vue'
import {
  EnvelopeIcon,
  PaperAirplaneIcon,
  ExclamationCircleIcon,
  CheckCircleIcon,
  ArrowLeftIcon
} from '@heroicons/vue/24/outline'

// SEO Meta
definePageMeta({
  layout: false,
  title: 'Réinitialisation du mot de passe - ChatSeller'
})

useSeoMeta({
  title: 'Réinitialisation du mot de passe - ChatSeller',
  description: 'Réinitialisez votre mot de passe ChatSeller'
})

// Store
const authStore = useAuthStore()

// État du composant
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

// Actions
const handleSubmit = async () => {
  if (!validateForm()) return
  
  loading.value = true
  error.value = ''
  
  try {
    const result = await authStore.resetPassword(form.email)
    
    if (result.success) {
      success.value = true
      startResendCooldown()
    } else {
      switch (result.error) {
        case 'User not found':
          error.value = 'Aucun compte trouvé avec cette adresse email'
          break
        case 'Email rate limit exceeded':
          error.value = 'Trop de demandes. Veuillez réessayer plus tard'
          break
        default:
          error.value = result.error || 'Une erreur est survenue. Veuillez réessayer'
      }
    }
  } catch (err) {
    console.error('Reset password error:', err)
    error.value = 'Une erreur inattendue est survenue'
  } finally {
    loading.value = false
  }
}

// Renvoyer l'email
const resendEmail = async () => {
  if (resendCooldown.value > 0) return
  await handleSubmit()
}

// Démarrer le timer de cooldown
const startResendCooldown = () => {
  resendCooldown.value = 60
  const timer = setInterval(() => {
    resendCooldown.value--
    if (resendCooldown.value <= 0) {
      clearInterval(timer)
    }
  }, 1000)
}

// Auto-focus sur le champ email
onMounted(() => {
  const emailInput = document.getElementById('email')
  if (emailInput) {
    emailInput.focus()
  }
})
</script>

<style scoped>
/* Styles spécifiques à cette page */
.alert-error {
  @apply rounded-md bg-red-50 p-4 border border-red-200;
}

.transition-all-fast {
  transition: all 150ms ease-in-out;
}
</style>