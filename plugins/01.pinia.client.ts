// plugins/01.pinia.client.ts
export default defineNuxtPlugin(async () => {
  // Only run on client side
  if (process.server) return

  const { initialize: initAuth } = useAuth()
  
  try {
    // Initialize authentication state
    await initAuth()
    
    console.log('🎯 ChatSeller stores initialized successfully')
  } catch (error) {
    console.error('❌ Error initializing ChatSeller stores:', error)
  }
})