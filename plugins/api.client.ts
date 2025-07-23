// plugins/api.client.ts - PLUGIN API CLIENT
export default defineNuxtPlugin(() => {
  const config = useRuntimeConfig()
  
  const api = $fetch.create({
    baseURL: config.public.apiBaseUrl,
    headers: {
      'Content-Type': 'application/json'
    },
    onRequest({ request, options }) {
      // Ajouter le token JWT si disponible
      const authStore = useAuthStore()
      if (authStore.token) {
        options.headers = {
          ...options.headers,
          Authorization: `Bearer ${authStore.token}`
        }
      }
    },
    onResponseError({ response }) {
      // Gestion globale des erreurs
      if (response.status === 401) {
        const authStore = useAuthStore()
        authStore.clearAuth()
        navigateTo('/login')
      }
    }
  })

  return {
    provide: {
      api
    }
  }
})