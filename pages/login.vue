<template>
  <div class="min-h-screen bg-gray-50 flex flex-col justify-center py-12 sm:px-6 lg:px-8">
    <div class="sm:mx-auto sm:w-full sm:max-w-md">
      <div class="text-center">
        <h1 class="text-3xl font-bold text-blue-600 mb-2">ChatSeller</h1>
        <h2 class="text-xl font-semibold text-gray-900">Connexion à votre dashboard</h2>
        <p class="text-sm text-gray-600 mt-2">Gérez votre Agent IA Commercial</p>
      </div>
    </div>

    <div class="mt-8 sm:mx-auto sm:w-full sm:max-w-md">
      <div class="bg-white py-8 px-4 shadow sm:rounded-lg sm:px-10">
        <form @submit.prevent="handleLogin" class="space-y-6">
          <div>
            <label for="email" class="block text-sm font-medium text-gray-700">
              Email
            </label>
            <div class="mt-1">
              <input
                id="email"
                v-model="email"
                type="email"
                required
                class="appearance-none block w-full px-3 py-2 border border-gray-300 rounded-md placeholder-gray-400 focus:outline-none focus:ring-blue-500 focus:border-blue-500"
                placeholder="admin@chatseller.app"
              />
            </div>
          </div>

          <div>
            <label for="password" class="block text-sm font-medium text-gray-700">
              Mot de passe
            </label>
            <div class="mt-1">
              <input
                id="password"
                v-model="password"
                type="password"
                required
                class="appearance-none block w-full px-3 py-2 border border-gray-300 rounded-md placeholder-gray-400 focus:outline-none focus:ring-blue-500 focus:border-blue-500"
                placeholder="••••••••••"
              />
            </div>
          </div>

          <!-- Message d'erreur -->
          <div v-if="errorMessage" class="bg-red-50 border border-red-200 rounded-md p-3">
            <p class="text-sm text-red-600">{{ errorMessage }}</p>
          </div>

          <!-- Message de succès -->
          <div v-if="successMessage" class="bg-green-50 border border-green-200 rounded-md p-3">
            <p class="text-sm text-green-600">{{ successMessage }}</p>
          </div>

          <div>
            <button
              type="submit"
              :disabled="authStore.isLoading"
              class="w-full flex justify-center py-2 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 disabled:opacity-50 disabled:cursor-not-allowed"
            >
              <span v-if="authStore.isLoading" class="flex items-center">
                <svg class="animate-spin -ml-1 mr-3 h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                  <circle class="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" stroke-width="4"></circle>
                  <path class="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                </svg>
                Connexion...
              </span>
              <span v-else>Se connecter</span>
            </button>
          </div>
        </form>

        <div class="mt-6 text-center">
          <p class="text-xs text-gray-500">
            Identifiants de test :<br>
            admin@chatseller.app / password123
          </p>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
// ✅ AJOUTER LE MIDDLEWARE GUEST
definePageMeta({
  layout: false,
  middleware: 'guest'
})

const authStore = useAuth()

const email = ref('admin@chatseller.app')
const password = ref('password123')
const errorMessage = ref('')
const successMessage = ref('')

const handleLogin = async () => {
  console.log('🎯 Page: Début du processus de login')
  
  errorMessage.value = ''
  successMessage.value = ''

  try {
    const result = await authStore.login(email.value, password.value)
    
    console.log('📊 Page: Résultat login:', result)

    if (result.success) {
      successMessage.value = 'Connexion réussie ! Redirection...'
      
      // ✅ REDIRECTION IMMÉDIATE PLUS AGRESSIVE
      console.log('🔄 Page: Redirection immédiate')
      
      // Redirection immédiate sans délai
      if (process.client) {
        window.location.replace('/')  // ← replace au lieu de href
      }
      
    } else {
      errorMessage.value = result.error || 'Erreur de connexion'
    }
  } catch (error: any) {
    console.error('❌ Page: Erreur login:', error)
    errorMessage.value = error.message || 'Erreur de connexion'
  }
}

// Redirection automatique si déjà connecté
onMounted(() => {
  const token = localStorage.getItem('chatseller_token')
  if (token) {
    console.log('🔄 Page: Token présent, redirection immédiate')
    if (process.client) {
      window.location.replace('/')
    }
  }
})
</script>