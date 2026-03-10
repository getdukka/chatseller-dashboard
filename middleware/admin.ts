// middleware/admin.ts — Super admin access (email-based, returns 404 for non-admin)
import { useAuthStore } from '~/stores/auth'
import { useSupabase } from '~/composables/useSupabase'

const ADMIN_EMAIL = 'ibuka.ndjoli@gmail.com'

export default defineNuxtRouteMiddleware(async (to, from) => {
  if (process.server) return

  try {
    const authStore = useAuthStore()
    const supabase = useSupabase()

    // Check Supabase session directly (more reliable than store on cold load)
    const { data: { session } } = await supabase.auth.getSession()

    if (!session?.user) {
      return navigateTo('/login')
    }

    const email = session.user.email

    if (email !== ADMIN_EMAIL) {
      // Return 404 — admin pages must be invisible to non-admin users
      throw createError({
        statusCode: 404,
        statusMessage: 'Page not found'
      })
    }

    // Ensure auth store is synced
    if (!authStore.isAuthenticated) {
      await authStore.restoreSession()
    }
  } catch (error: any) {
    if (error?.statusCode === 404) throw error
    throw createError({ statusCode: 404, statusMessage: 'Page not found' })
  }
})
