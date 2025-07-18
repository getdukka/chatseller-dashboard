// stores/auth.ts 
import { defineStore } from 'pinia'

export interface User {
  id: string
  email: string
  name: string
  avatar?: string
  shopId?: string
}

export interface AuthState {
  user: User | null
  token: string | null
  isAuthenticated: boolean
  loading: boolean
}

export const useAuthStore = defineStore('auth', {
  state: (): AuthState => ({
    user: null,
    token: null,
    isAuthenticated: false,
    loading: false
  }),

  getters: {
    isLoggedIn: (state): boolean => state.isAuthenticated && !!state.token,
    currentUser: (state): User | null => state.user,
    userInitials: (state): string => {
      if (!state.user?.name) return 'U'
      return state.user.name
        .split(' ')
        .map(n => n.charAt(0))
        .join('')
        .toUpperCase()
        .slice(0, 2)
    }
  },

  actions: {
    async initializeAuth(): Promise<void> {
      if (process.client) {
        const token = localStorage.getItem('auth_token')
        const userData = localStorage.getItem('user_data')
        
        if (token && userData) {
          try {
            this.token = token
            this.user = JSON.parse(userData)
            this.isAuthenticated = true
            
            // Vérifier la validité du token avec la vraie API
            await this.validateToken()
          } catch (error) {
            console.error('Erreur lors de l\'initialisation auth:', error)
            this.logout()
          }
        }
      }
    },

    // 🔥 VRAIE CONNEXION API
    async login(credentials: { email: string; password: string }): Promise<{ success: boolean }> {
      this.loading = true
      
      try {
        // 🚀 APPEL À LA VRAIE API
        const response = await $fetch('https://api.chatseller.app/auth/login', {
          method: 'POST',
          body: {
            email: credentials.email,
            password: credentials.password
          }
        })
        
        if (response.success) {
          this.setAuthData(response.token, response.user)
          return { success: true }
        } else {
          throw new Error(response.message || 'Échec de la connexion')
        }
      } catch (error: any) {
        console.error('Erreur de connexion:', error)
        throw new Error(error.data?.message || 'Erreur de connexion')
      } finally {
        this.loading = false
      }
    },

    // 🔥 VRAIE VALIDATION TOKEN
    async validateToken(): Promise<boolean> {
      if (!this.token) return false
      
      try {
        const response = await $fetch('https://api.chatseller.app/auth/verify', {
          method: 'GET',
          headers: {
            'Authorization': `Bearer ${this.token}`
          }
        })
        
        if (response.valid) {
          return true
        } else {
          this.logout()
          return false
        }
      } catch (error) {
        console.error('Token invalide:', error)
        this.logout()
        return false
      }
    },

    logout(): void {
      this.user = null
      this.token = null
      this.isAuthenticated = false
      
      if (process.client) {
        localStorage.removeItem('auth_token')
        localStorage.removeItem('user_data')
        window.location.href = '/login'
      }
    },

    setAuthData(token: string, user: User): void {
      this.token = token
      this.user = user
      this.isAuthenticated = true
      
      if (process.client) {
        localStorage.setItem('auth_token', token)
        localStorage.setItem('user_data', JSON.stringify(user))
      }
    },

    updateUser(userData: Partial<User>): void {
      if (this.user) {
        this.user = { ...this.user, ...userData }
        
        if (process.client) {
          localStorage.setItem('user_data', JSON.stringify(this.user))
        }
      }
    }
  }
})