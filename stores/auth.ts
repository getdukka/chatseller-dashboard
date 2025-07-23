// stores/auth.ts - STORE AUTHENTIFICATION COMPATIBLE AVEC USEAPI.TS

import { defineStore } from 'pinia'
import type { User, AuthState, LoginCredentials, RegisterData, AuthResponse } from '~/types'

export const useAuthStore = defineStore('auth', {
  state: (): AuthState => ({
    user: null,
    token: null,
    isAuthenticated: false,
    loading: false
  }),

  getters: {
    // ✅ GETTER : userShopId (compatible avec useApi.ts)
    userShopId: (state): string | null => {
      return state.user?.shopId || state.user?.shop_id || null
    },

    isLoggedIn: (state): boolean => {
      return state.isAuthenticated && !!state.user && !!state.token
    },

    userEmail: (state): string | null => {
      return state.user?.email || null
    },

    userName: (state): string | null => {
      return state.user?.name || null
    }
  },

  actions: {
    // ✅ ACTION LOGIN - Utilise useApi existant
    async login(credentials: LoginCredentials) {
      this.loading = true
      
      try {
        console.log('🔐 Store: Tentative de login pour:', credentials.email)
        
        const api = useApi()
        const response = await api.auth.login(credentials)
        
        console.log('📡 Store: Réponse login:', response)

        if (response.success && response.data) {
          // Utiliser les données de AuthResponse
          this.setUser(response.data.user as User, response.data.token)
          
          // Redirection vers le dashboard
          await navigateTo('/dashboard')
          return { success: true }
        } else {
          throw new Error(response.error || 'Erreur de connexion')
        }
      } catch (error: any) {
        console.error('❌ Store: Erreur login:', error)
        return { 
          success: false, 
          error: error instanceof Error ? error.message : 'Erreur de connexion' 
        }
      } finally {
        this.loading = false
      }
    },

    // ✅ ACTION REGISTER - Utilise useApi existant
    async register(data: RegisterData) {
      this.loading = true
      
      try {
        const api = useApi()
        const response = await api.auth.register({
          email: data.email,
          password: data.password,
          name: data.name
        })

        if (response.success) {
          // Auto-login après inscription
          await this.login({
            email: data.email,
            password: data.password
          })
          return { success: true }
        } else {
          throw new Error(response.error || 'Erreur lors de l\'inscription')
        }
      } catch (error: any) {
        console.error('❌ Store: Erreur register:', error)
        return { 
          success: false, 
          error: error instanceof Error ? error.message : 'Erreur lors de l\'inscription' 
        }
      } finally {
        this.loading = false
      }
    },

    // ✅ ACTION RESET PASSWORD
    async resetPassword(email: string) {
      this.loading = true
      
      try {
        // TODO: Ajouter resetPassword à useApi si nécessaire
        // Pour l'instant, simulation
        await new Promise(resolve => setTimeout(resolve, 1000))
        
        return { 
          success: true, 
          message: 'Email de réinitialisation envoyé' 
        }
      } catch (error: any) {
        console.error('❌ Store: Erreur reset password:', error)
        return { 
          success: false, 
          error: error instanceof Error ? error.message : 'Erreur lors de l\'envoi' 
        }
      } finally {
        this.loading = false
      }
    },

    // ✅ ACTION LOGOUT - Utilise useApi existant
    async logout() {
      try {
        const api = useApi()
        api.auth.logout() // Nettoie le token localStorage
      } catch (error) {
        console.warn('❌ Store: Erreur lors du logout:', error)
      } finally {
        // Nettoyage local dans tous les cas
        this.clearAuth()
        await navigateTo('/login')
      }
    },

    // ✅ ACTION SET USER
    setUser(user: User, token: string) {
      // Normaliser l'utilisateur avec les deux formats
      const normalizedUser: User = {
        ...user,
        shopId: user.shopId || user.shop_id,
        shop_id: user.shop_id || user.shopId
      }
      
      this.user = normalizedUser
      this.token = token
      this.isAuthenticated = true
      
      console.log('✅ Store: Utilisateur connecté:', normalizedUser)
    },

    // ✅ ACTION CLEAR AUTH
    clearAuth() {
      this.user = null
      this.token = null
      this.isAuthenticated = false
      
      console.log('🧹 Store: Session nettoyée')
    },

    // ✅ ACTION RESTORE SESSION - Utilise useApi existant
    async restoreSession() {
      if (!process.client) return

      try {
        const api = useApi()
        const token = api.getAuthToken()

        if (token) {
          console.log('🔄 Store: Tentative de restauration de session')
          
          // Vérification de la validité du token
          const response = await api.auth.verify()

          if (response.success && response.data) {
            this.setUser(response.data.user, token)
            console.log('✅ Store: Session restaurée avec succès')
          } else {
            console.log('❌ Store: Token invalide, nettoyage...')
            this.clearAuth()
            api.removeAuthToken()
          }
        }
      } catch (error) {
        console.error('❌ Store: Erreur restore session:', error)
        this.clearAuth()
        const api = useApi()
        api.removeAuthToken()
      }
    },

    // ✅ ACTION UPDATE PROFILE
    async updateProfile(data: Partial<User>) {
      this.loading = true
      
      try {
        // TODO: Ajouter updateProfile à useApi si nécessaire
        // Pour l'instant, mise à jour locale
        if (this.user) {
          this.user = { ...this.user, ...data }
          
          // Persistence dans localStorage via useApi
          const api = useApi()
          if (process.client) {
            localStorage.setItem('chatseller_user', JSON.stringify(this.user))
          }
          
          console.log('✅ Store: Profil mis à jour:', this.user)
          return { success: true }
        } else {
          throw new Error('Utilisateur non connecté')
        }
      } catch (error: any) {
        console.error('❌ Store: Erreur update profile:', error)
        return { 
          success: false, 
          error: error instanceof Error ? error.message : 'Erreur mise à jour profil' 
        }
      } finally {
        this.loading = false
      }
    },

    // ✅ ACTION REFRESH TOKEN - Utilise useApi existant
    async refreshToken() {
      try {
        const api = useApi()
        const response = await api.auth.refresh()
        
        if (response.success && response.data) {
          // Le token est automatiquement mis à jour par useApi
          this.token = response.data.token
          return { success: true }
        } else {
          throw new Error('Impossible de rafraîchir le token')
        }
      } catch (error) {
        console.error('❌ Store: Erreur refresh token:', error)
        this.clearAuth()
        await navigateTo('/login')
        return { success: false }
      }
    }
  }
})