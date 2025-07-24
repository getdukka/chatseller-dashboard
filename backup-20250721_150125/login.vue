<!-- pages/login.vue -->
<template>
  <div class="min-h-screen flex items-center justify-center bg-gray-50 py-12 px-4 sm:px-6 lg:px-8">
    <div class="max-w-md w-full space-y-8">
      <div>
        <img class="mx-auto h-12 w-auto" src="/logo.svg" alt="ChatSeller" />
        <h2 class="mt-6 text-center text-3xl font-extrabold text-gray-900">
          Connexion à votre dashboard
        </h2>
        <p class="mt-2 text-center text-sm text-gray-600">
          Gérez votre Vendeu
        </p>
      </div>
      
      <form class="mt-8 space-y-6" @submit.prevent="handleLogin">
        <div class="rounded-md shadow-sm -space-y-px">
          <div>
            <label for="email" class="sr-only">Email</label>
            <input
              id="email"
              v-model="form.email"
              type="email"
              autocomplete="email"
              required
              class="appearance-none rounded-none relative block w-full px-3 py-2 border border-gray-300 placeholder-gray-500 text-gray-900 rounded-t-md focus:outline-none focus:ring-pink-500 focus:border-pink-500 focus:z-10 sm:text-sm"
              placeholder="Adresse email"
            />
          </div>
          <div>
            <label for="password" class="sr-only">Mot de passe</label>
            <input
              id="password"
              v-model="form.password"
              type="password"
              autocomplete="current-password"
              required
              class="appearance-none rounded-none relative block w-full px-3 py-2 border border-gray-300 placeholder-gray-500 text-gray-900 rounded-b-md focus:outline-none focus:ring-pink-500 focus:border-pink-500 focus:z-10 sm:text-sm"
              placeholder="Mot de passe"
            />
          </div>
        </div>

        <div v-if="errorMessage" class="text-red-600 text-sm text-center">
          {{ errorMessage }}
        </div>

        <div>
          <button
            type="submit"
            :disabled="isLoading"
            class="group relative w-full flex justify-center py-2 px-4 border border-transparent text-sm font-medium rounded-md text-white bg-pink-600 hover:bg-pink-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-pink-500 disabled:opacity-50 disabled:cursor-not-allowed"
          >
            <span v-if="!isLoading">Se connecter</span>
            <span v-else>Connexion...</span>
          </button>
        </div>

        <div class="text-xs text-gray-500 text-center">
          <p>Identifiants de test :</p>
          <p>admin@chatseller.app / password123</p>
        </div>
      </form>
    </div>
  </div>
</template>

<script setup>
definePageMeta({
  layout: false
})

const { login, isLoading } = useAuth()

const form = reactive({
  email: 'admin@chatseller.app',
  password: 'password123'
})

const errorMessage = ref('')

const handleLogin = async () => {
  errorMessage.value = ''
  
  const result = await login(form.email, form.password)
  
  if (result.success) {
    await navigateTo('/')
  } else {
    errorMessage.value = result.error || 'Erreur de connexion'
  }
}
</script>