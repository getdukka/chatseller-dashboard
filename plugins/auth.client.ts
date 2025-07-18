// plugins/auth.client.ts
export default defineNuxtPlugin(async () => {
  const { initialize } = useAuth()
  
  // Initialize auth state on client-side only
  if (process.client) {
    await initialize()
  }
})