// plugins/api.client.ts - VERSION CORRIGÉE
export default defineNuxtPlugin(() => {
  const config = useRuntimeConfig()
  
  const api = $fetch.create({
    baseURL: config.public.apiBaseUrl,
    headers: {
      'Content-Type': 'application/json'
    },
    onRequest({ request, options }) {
      // Ajouter le token JWT si disponible depuis localStorage
      if (process.client) {
        const token = localStorage.getItem('chatseller_token')
        if (token) {
          options.headers = {
            ...options.headers,
            Authorization: `Bearer ${token}`
          }
        }
      }
    },
    onResponseError({ response }) {
      // Gestion globale des erreurs
      if (response.status === 401) {
        if (process.client) {
          localStorage.removeItem('chatseller_token')
          localStorage.removeItem('chatseller_user')
          window.location.href = '/login'
        }
      }
    }
  })

  return {
    provide: {
      api
    }
  }
})