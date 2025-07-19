// stores/auth.ts
import { defineStore } from 'pinia'

interface User {
  id: string
  email: string
  name?: string
  shopId?: string
}

interface AuthState {
  user: User | null
  isAuthenticated: boolean
  isLoading: boolean
  error: string | null
}

export const useAuthStore = defineStore('auth', {
  state: (): AuthState => ({
    user: null,
    isAuthenticated: false,
    isLoading: false,
    error: null
  }),

  getters: {
    // Current user info
    currentUser: (state) => state.user,
    
    // Check if user is authenticated
    isLoggedIn: (state) => state.isAuthenticated && !!state.user,
    
    // Get user's shop ID - Pour compatibilité avec vos stores
    userShopId: (state) => state.user?.shopId || 'default-shop-id',
    
    // Get user display name
    userDisplayName: (state) => {
      if (!state.user) return 'Utilisateur'
      return state.user.name || state.user.email.split('@')[0]
    }
  },

  actions: {
    // =====================================
    // AUTHENTICATION ACTIONS SIMPLIFIÉES
    // =====================================
    
    /**
     * Login simple pour tests
     */
    async login(email: string, password: string): Promise<boolean> {
      this.isLoading = true
      this.error = null
      
      try {
        // Pour les tests avec les credentials fournis
        if (email === 'admin@chatseller.app' && password === 'password') {
          this.user = {
            id: 'test-user-id',
            email: 'admin@chatseller.app',
            name: 'Admin ChatSeller',
            shopId: 'test-shop-id'
          }
          this.isAuthenticated = true
          this.error = null
          
          // Stocker le token factice pour les tests
          if (process.client) {
            localStorage.setItem('chatseller_token', 'test-token-' + Date.now())
          }
          
          return true
        } else {
          this.error = 'Identifiants invalides'
          return false
        }
      } catch (error: any) {
        this.error = error.message || 'Erreur de connexion'
        return false
      } finally {
        this.isLoading = false
      }
    },

    /**
     * Logout
     */
    async logout(): Promise<void> {
      try {
        // Clear storage
        if (process.client) {
          localStorage.removeItem('chatseller_token')
        }
        
        // Clear state
        this.user = null
        this.isAuthenticated = false
        this.error = null
        
        // Redirect to login
        await navigateTo('/login')
      } catch (error) {
        console.error('Logout error:', error)
      }
    },

    /**
     * Initialize - Vérifier si utilisateur connecté
     */
    async initialize(): Promise<void> {
      if (process.client) {
        const token = localStorage.getItem('chatseller_token')
        if (token && token.startsWith('test-token-')) {
          // Restaurer la session de test
          this.user = {
            id: 'test-user-id',
            email: 'admin@chatseller.app',
            name: 'Admin ChatSeller',
            shopId: 'test-shop-id'
          }
          this.isAuthenticated = true
        }
      }
    },

    /**
     * Clear any authentication errors
     */
    clearError(): void {
      this.error = null
    },

    /**
     * Check if current route requires authentication
     */
    requiresAuth(route: string): boolean {
      const publicRoutes = ['/login', '/register', '/']
      return !publicRoutes.includes(route)
    }
  }
})

// =====================================
// COMPOSABLE COMPATIBLE
// =====================================

export const useAuth = () => {
  const authStore = useAuthStore()
  
  return {
    // State
    user: computed(() => authStore.user),
    isAuthenticated: computed(() => authStore.isAuthenticated),
    isLoading: computed(() => authStore.isLoading),
    error: computed(() => authStore.error),
    userShopId: computed(() => authStore.userShopId),
    userDisplayName: computed(() => authStore.userDisplayName),
    
    // Actions
    login: authStore.login,
    logout: authStore.logout,
    initialize: authStore.initialize,
    clearError: authStore.clearError,
    requiresAuth: authStore.requiresAuth
  }
}