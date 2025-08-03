// plugins/auth.client.ts - VERSION SIMPLIFIÉE
export default defineNuxtPlugin(async () => {
  // Intercepter les erreurs 401 globalement
  if (process.client) {
    window.addEventListener('unhandledrejection', (event) => {
      if (event.reason?.statusCode === 401) {
        localStorage.removeItem('chatseller_token')
        localStorage.removeItem('chatseller_user')
        window.location.href = '/login'
      }
    })
    
    console.log('✅ Plugin auth: Intercepteur d\'erreurs 401 installé')
  }
})