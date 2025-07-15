// composables/useAuth.ts
import { createClient } from '@supabase/supabase-js'
import type { User, Session, AuthError } from '@supabase/supabase-js'

interface AuthState {
  user: User | null
  session: Session | null
  loading: boolean
  initialized: boolean
}

interface AuthStore {
  user: User | null
  session: Session | null
  loading: boolean
  initialized: boolean
}

export const useAuth = () => {
  const config = useRuntimeConfig()
  
  // Initialize Supabase client
  const supabase = createClient(
    config.public.supabaseUrl,
    config.public.supabaseAnonKey
  )

  // Reactive state
  const authState = useState<AuthState>('auth.state', () => ({
    user: null,
    session: null,
    loading: true,
    initialized: false
  }))

  // Computed properties
  const isLoggedIn = computed(() => !!authState.value.user)
  const isLoading = computed(() => authState.value.loading)
  const user = computed(() => authState.value.user)
  const session = computed(() => authState.value.session)

  // Sign up new user
  const signUp = async (email: string, password: string, metadata?: any) => {
    authState.value.loading = true
    
    try {
      const { data, error } = await supabase.auth.signUp({
        email,
        password,
        options: {
          data: metadata
        }
      })

      if (error) throw error

      // If user is confirmed, update state
      if (data.user && data.session) {
        authState.value.user = data.user
        authState.value.session = data.session
      }

      return { data, error: null }
    } catch (error) {
      console.error('Sign up error:', error)
      return { data: null, error: error as AuthError }
    } finally {
      authState.value.loading = false
    }
  }

  // Sign in existing user
  const signIn = async (email: string, password: string) => {
    authState.value.loading = true
    
    try {
      const { data, error } = await supabase.auth.signInWithPassword({
        email,
        password
      })

      if (error) throw error

      authState.value.user = data.user
      authState.value.session = data.session

      return { data, error: null }
    } catch (error) {
      console.error('Sign in error:', error)
      return { data: null, error: error as AuthError }
    } finally {
      authState.value.loading = false
    }
  }

  // Sign out user
  const signOut = async () => {
    authState.value.loading = true
    
    try {
      const { error } = await supabase.auth.signOut()
      
      if (error) throw error

      authState.value.user = null
      authState.value.session = null
      
      // Redirect to login
      await navigateTo('/login')
      
      return { error: null }
    } catch (error) {
      console.error('Sign out error:', error)
      return { error: error as AuthError }
    } finally {
      authState.value.loading = false
    }
  }

  // Reset password
  const resetPassword = async (email: string) => {
    try {
      const { error } = await supabase.auth.resetPasswordForEmail(email, {
        redirectTo: `${config.public.appUrl}/reset-password`
      })

      if (error) throw error
      return { error: null }
    } catch (error) {
      console.error('Reset password error:', error)
      return { error: error as AuthError }
    }
  }

  // Update password
  const updatePassword = async (newPassword: string) => {
    try {
      const { error } = await supabase.auth.updateUser({
        password: newPassword
      })

      if (error) throw error
      return { error: null }
    } catch (error) {
      console.error('Update password error:', error)
      return { error: error as AuthError }
    }
  }

  // Initialize auth state
  const initialize = async () => {
    try {
      // Get initial session
      const { data: { session }, error } = await supabase.auth.getSession()
      
      if (error) {
        console.error('Get session error:', error)
      } else if (session) {
        authState.value.user = session.user
        authState.value.session = session
      }

      // Listen for auth changes
      supabase.auth.onAuthStateChange((event, session) => {
        console.log('Auth state changed:', event, session?.user?.email)
        
        authState.value.user = session?.user ?? null
        authState.value.session = session
        
        // Handle different auth events
        switch (event) {
          case 'SIGNED_IN':
            console.log('User signed in')
            break
          case 'SIGNED_OUT':
            console.log('User signed out')
            break
          case 'TOKEN_REFRESHED':
            console.log('Token refreshed')
            break
          case 'USER_UPDATED':
            console.log('User updated')
            break
        }
      })

      authState.value.initialized = true
    } catch (error) {
      console.error('Initialize auth error:', error)
    } finally {
      authState.value.loading = false
    }
  }

  // Get user profile from our API
  const getUserProfile = async () => {
    if (!authState.value.user) return null

    try {
      const response = await $fetch(`${config.public.apiUrl}/api/users/profile`, {
        headers: {
          'Authorization': `Bearer ${authState.value.session?.access_token}`
        }
      })
      return response
    } catch (error) {
      console.error('Get user profile error:', error)
      return null
    }
  }

  // Create or update user in our system
  const syncUser = async () => {
    if (!authState.value.user) return null

    try {
      const response = await $fetch(`${config.public.apiUrl}/api/users/sync`, {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${authState.value.session?.access_token}`,
          'Content-Type': 'application/json'
        },
        body: {
          id: authState.value.user.id,
          email: authState.value.user.email,
          metadata: authState.value.user.user_metadata
        }
      })
      return response
    } catch (error) {
      console.error('Sync user error:', error)
      return null
    }
  }

  return {
    // State
    user: readonly(user),
    session: readonly(session),
    isLoggedIn: readonly(isLoggedIn),
    isLoading: readonly(isLoading),
    initialized: readonly(computed(() => authState.value.initialized)),
    
    // Methods
    signUp,
    signIn,
    signOut,
    resetPassword,
    updatePassword,
    initialize,
    getUserProfile,
    syncUser,
    
    // Supabase client for advanced usage
    supabase
  }
}