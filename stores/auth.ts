// stores/auth.ts
import { defineStore } from 'pinia'

export const useAuth = defineStore('auth', {
  state: () => ({
    user: null as any,
    token: null as string | null,
    isLoading: false,
    isAuthenticated: false
  }),

  getters: {
    userDisplayName(): string {
      if (!this.user) return 'Utilisateur'
      return this.user.name || this.user.email?.split('@')[0] || 'Utilisateur'
    },

    requiresAuth(): boolean {
      return !this.isAuthenticated
    }
  },

  actions: {
    async login(email: string, password: string) {
      this.isLoading = true
      try {
        // Utilisation directe de $fetch au lieu du composable
        const response = await $fetch('/api/v1/auth/login', {
          method: 'POST',
          baseURL: useRuntimeConfig().public.apiUrl,
          body: { email, password }
        })

        if (response.success && response.data) {
          this.token = response.data.token
          this.user = response.data.user
          this.isAuthenticated = true
          
          // Stocker le token
          if (process.client) {
            localStorage.setItem('chatseller_token', this.token)
          }

          return { success: true }
        } else {
          throw new Error(response.error || 'Échec de la connexion')
        }
      } catch (error: any) {
        console.error('Login error:', error)
        return { 
          success: false, 
          error: error.message || 'Erreur de connexion'
        }
      } finally {
        this.isLoading = false
      }
    },

    async logout() {
      this.user = null
      this.token = null
      this.isAuthenticated = false
      
      if (process.client) {
        localStorage.removeItem('chatseller_token')
      }

      await navigateTo('/login')
    },

    async initializeAuth() {
      if (process.client) {
        const token = localStorage.getItem('chatseller_token')
        if (token) {
          this.token = token
          this.isAuthenticated = true
          // Simplification : on assume que si le token existe, l'utilisateur est connecté
          this.user = { email: 'admin@chatseller.app' }
        }
      }
    }
  }
})