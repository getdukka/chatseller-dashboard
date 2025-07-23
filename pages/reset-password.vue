<!-- pages/reset-password.vue - VERSION CORRIGÉE -->
<template>
  <div class="min-h-screen flex flex-col justify-center py-12 sm:px-6 lg:px-8 bg-gray-50">
    <div class="sm:mx-auto sm:w-full sm:max-w-md">
      <!-- Logo -->
      <div class="flex justify-center">
        <NuxtLink to="/" class="flex items-center">
          <div class="flex items-center justify-center w-12 h-12 bg-blue-600 rounded-lg">
            <svg class="w-8 h-8 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z"/>
            </svg>
          </div>
          <span class="ml-3 text-xl font-bold text-gray-900">ChatSeller</span>
        </NuxtLink>
      </div>
      
      <h2 class="mt-6 text-center text-3xl font-bold text-gray-900">
        Réinitialiser votre mot de passe
      </h2>
      <p class="mt-2 text-center text-sm text-gray-600">
        Entrez votre adresse email et nous vous enverrons un lien pour réinitialiser votre mot de passe.
      </p>
    </div>

    <div class="mt-8 sm:mx-auto sm:w-full sm:max-w-md">
      <div class="bg-white py-8 px-4 shadow sm:rounded-lg sm:px-10">
        <!-- Success Message -->
        <div v-if="emailSent" class="mb-6">
          <div class="rounded-md bg-green-50 p-4">
            <div class="flex">
              <div class="flex-shrink-0">
                <svg class="h-5 w-5 text-green-400" fill="currentColor" viewBox="0 0 20 20">
                  <path fill-rule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clip-rule="evenodd"/>
                </svg>
              </div>
              <div class="ml-3">
                <h3 class="text-sm font-medium text-green-800">
                  Email envoyé !
                </h3>
                <div class="mt-2 text-sm text-green-700">
                  <p>
                    Nous avons envoyé un lien de réinitialisation à <strong>{{ form.email }}</strong>. 
                    Vérifiez votre boîte de réception et suivez les instructions.
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>

        <!-- Reset Form -->
        <form v-if="!emailSent" @submit.prevent="handleResetPassword" class="space-y-6">
          <!-- Email Field -->
          <div>
            <label for="email" class="block text-sm font-medium text-gray-700">
              Adresse email
            </label>
            <div class="mt-1 relative">
              <input
                id="email"
                v-model="form.email"
                type="email"
                autocomplete="email"
                required
                :disabled="loading"
                class="appearance-none block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm placeholder-gray-400 focus:outline-none focus:ring-blue-500 focus:border-blue-500 disabled:bg-gray-50 disabled:text-gray-500"
                :class="{ 'border-red-300': error }"
                placeholder="votre@email.com"
              >
              <div v-if="loading" class="absolute inset-y-0 right-0 flex items-center pr-3">
                <svg class="animate-spin h-5 w-5 text-gray-400" fill="none" viewBox="0 0 24 24">
                  <circle class="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" stroke-width="4"></circle>
                  <path class="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                </svg>
              </div>
            </div>
            <p v-if="error" class="mt-2 text-sm text-red-600">
              {{ error }}
            </p>
          </div>

          <!-- Submit Button -->
          <div>
            <button
              type="submit"
              :disabled="loading || !form.email"
              class="group relative w-full flex justify-center py-2 px-4 border border-transparent text-sm font-medium rounded-md text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 disabled:opacity-50 disabled:cursor-not-allowed"
            >
              <span v-if="loading" class="absolute left-0 inset-y-0 flex items-center pl-3">
                <svg class="animate-spin h-5 w-5 text-blue-300" fill="none" viewBox="0 0 24 24">
                  <circle class="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" stroke-width="4"></circle>
                  <path class="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                </svg>
              </span>
              {{ loading ? 'Envoi en cours...' : 'Envoyer le lien de réinitialisation' }}
            </button>
          </div>
        </form>

        <!-- Back to Login -->
        <div class="mt-6">
          <div class="relative">
            <div class="absolute inset-0 flex items-center">
              <div class="w-full border-t border-gray-300" />
            </div>
            <div class="relative flex justify-center text-sm">
              <span class="px-2 bg-white text-gray-500">ou</span>
            </div>
          </div>

          <div class="mt-6">
            <NuxtLink
              to="/login"
              class="w-full flex justify-center py-2 px-4 border border-gray-300 rounded-md shadow-sm bg-white text-sm font-medium text-gray-700 hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
            >
              <svg class="w-5 h-5 text-gray-400 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M10 19l-7-7m0 0l7-7m-7 7h18"/>
              </svg>
              Retour à la connexion
            </NuxtLink>
          </div>
        </div>

        <!-- Resend Link -->
        <div v-if="emailSent" class="mt-6 text-center">
          <p class="text-sm text-gray-600">
            Vous n'avez pas reçu l'email ?
          </p>
          <button
            @click="resendEmail"
            :disabled="resendCooldown > 0"
            class="mt-2 text-sm font-medium text-blue-600 hover:text-blue-500 disabled:text-gray-400 disabled:cursor-not-allowed"
          >
            {{ resendCooldown > 0 ? `Renvoyer dans ${resendCooldown}s` : 'Renvoyer l\'email' }}
          </button>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
// ✅ META PAGE
definePageMeta({
  middleware: 'guest',
  layout: 'auth'
})

// ✅ COMPOSABLES
const auth = useAuth()

// ✅ REACTIVE DATA
const loading = ref(false)
const error = ref('')
const emailSent = ref(false)
const resendCooldown = ref(0)

const form = ref({
  email: ''
})

// ✅ METHODS
const handleResetPassword = async () => {
  if (!form.value.email) {
    error.value = 'Veuillez saisir votre adresse email'
    return
  }

  loading.value = true
  error.value = ''

  try {
    const result = await auth.resetPassword(form.value.email)
    
    if (result.success) {
      emailSent.value = true
      startResendCooldown()
    } else {
      error.value = result.error || 'Une erreur est survenue lors de l\'envoi de l\'email'
    }
  } catch (err: any) {
    error.value = err.message || 'Une erreur est survenue'
  } finally {
    loading.value = false
  }
}

const resendEmail = async () => {
  if (resendCooldown.value > 0) return
  
  await handleResetPassword()
}

const startResendCooldown = () => {
  resendCooldown.value = 60
  const timer = setInterval(() => {
    resendCooldown.value--
    if (resendCooldown.value <= 0) {
      clearInterval(timer)
    }
  }, 1000)
}

// ✅ WATCHERS
watch(() => form.value.email, () => {
  if (error.value) {
    error.value = ''
  }
})

// ✅ SEO
useHead({
  title: 'Réinitialiser le mot de passe - ChatSeller',
  meta: [
    {
      name: 'description',
      content: 'Réinitialisez votre mot de passe ChatSeller en quelques clics.'
    }
  ]
})
</script>