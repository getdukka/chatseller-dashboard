// stores/auth.ts - STORE AUTHENTIFICATION CORRIGÉ

import { defineStore } from 'pinia'

// ✅ TYPES LOCAUX POUR ÉVITER LES IMPORTS CIRCULAIRES
interface User {
  id: string
  email: string
  name?: string
  shopId?: string
  shop_id?: string
  avatar?: string
  role?: 'admin' | 'user'
  createdAt?: string
  updatedAt?: string
}

interface AuthState {
  user: User | null
  token: string | null
  isAuthenticated: boolean
  loading: boolean
}

interface LoginCredentials {
  email: string
  password: string
}

interface RegisterData extends LoginCredentials {
  name: string
  confirmPassword?: string
}

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
    // ✅ ACTION LOGIN - VERSION CORRIGÉE
    async login(credentials: LoginCredentials) {
      this.loading = true
      
      try {
        console.log('🔐 Store: Tentative de login pour:', credentials.email)
        
        // ✅ UTILISATION DIRECTE DE $FETCH AU LIEU DE useApi
        const config = useRuntimeConfig()
        const baseURL = config.public.apiBaseUrl
        
        const response = await $fetch(`${baseURL}/api/auth/login`, {
          method: 'POST',
          body: credentials,
          headers: {
            'Content-Type': 'application/json'
          }
        }) as any

        console.log('📡 Store: Réponse login:', response)

        if (response.success && response.data) {
          // Sauvegarder le token
          if (process.client) {
            localStorage.setItem('chatseller_token', response.data.token)
            localStorage.setItem('chatseller_user', JSON.stringify(response.data.user))
          }
          
          // Utiliser les données de AuthResponse
          this.setUser(response.data.user as User, response.data.token)
          
          return { success: true, data: response.data }
        } else {
          throw new Error(response.error || 'Erreur de connexion')
        }
      } catch (error: any) {
        console.error('❌ Store: Erreur login:', error)
        return { 
          success: false, 
          error: error.data?.message || error.message || 'Erreur de connexion' 
        }
      } finally {
        this.loading = false
      }
    },

    // ✅ ACTION REGISTER - VERSION CORRIGÉE
    async register(data: RegisterData) {
      this.loading = true
      
      try {
        const config = useRuntimeConfig()
        const baseURL = config.public.apiBaseUrl
        
        const response = await $fetch(`${baseURL}/api/auth/register`, {
          method: 'POST',
          body: {
            email: data.email,
            password: data.password,
            name: data.name
          },
          headers: {
            'Content-Type': 'application/json'
          }
        }) as any

        if (response.success) {
          // Auto-login après inscription
          const loginResult = await this.login({
            email: data.email,
            password: data.password
          })
          return loginResult
        } else {
          throw new Error(response.error || 'Erreur lors de l\'inscription')
        }
      } catch (error: any) {
        console.error('❌ Store: Erreur register:', error)
        return { 
          success: false, 
          error: error.data?.message || error.message || 'Erreur lors de l\'inscription' 
        }
      } finally {
        this.loading = false
      }
    },

    // ✅ ACTION RESET PASSWORD
    async resetPassword(email: string) {
      this.loading = true
      
      try {
        // TODO: Implémenter avec l'API réelle
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

    // ✅ ACTION LOGOUT - VERSION CORRIGÉE
    async logout() {
      try {
        // Nettoyer le localStorage
        if (process.client) {
          localStorage.removeItem('chatseller_token')
          localStorage.removeItem('chatseller_user')
        }
      } catch (error) {
        console.warn('❌ Store: Erreur lors du logout:', error)
      } finally {
        // Nettoyage local dans tous les cas
        this.clearAuth()
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

    // ✅ ACTION RESTORE SESSION - VERSION CORRIGÉE
    async restoreSession() {
      if (!process.client) return

      try {
        const token = localStorage.getItem('chatseller_token')
        const userData = localStorage.getItem('chatseller_user')

        if (token && userData) {
          console.log('🔄 Store: Tentative de restauration de session')
          
          try {
            // Vérifier la validité du token avec l'API
            const config = useRuntimeConfig()
            const baseURL = config.public.apiBaseUrl
            
            const response = await $fetch(`${baseURL}/api/auth/verify`, {
              method: 'POST',
              body: { token },
              headers: {
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${token}`
              }
            }) as any

            if (response.success && response.data) {
              const user = JSON.parse(userData)
              this.setUser(user, token)
              console.log('✅ Store: Session restaurée avec succès')
            } else {
              throw new Error('Token invalide')
            }
          } catch (verifyError) {
            console.log('❌ Store: Token invalide, nettoyage...')
            this.clearAuth()
            localStorage.removeItem('chatseller_token')
            localStorage.removeItem('chatseller_user')
          }
        }
      } catch (error) {
        console.error('❌ Store: Erreur restore session:', error)
        this.clearAuth()
        if (process.client) {
          localStorage.removeItem('chatseller_token')
          localStorage.removeItem('chatseller_user')
        }
      }
    },

    // ✅ ACTION UPDATE PROFILE
    async updateProfile(data: Partial<User>) {
      this.loading = true
      
      try {
        if (this.user) {
          this.user = { ...this.user, ...data }
          
          // Persistence dans localStorage
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

    // ✅ ACTION REFRESH TOKEN
    async refreshToken() {
      try {
        const token = process.client ? localStorage.getItem('chatseller_token') : null
        if (!token) {
          throw new Error('Pas de token à rafraîchir')
        }

        const config = useRuntimeConfig()
        const baseURL = config.public.apiBaseUrl
        
        const response = await $fetch(`${baseURL}/api/auth/refresh`, {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${token}`
          }
        }) as any
        
        if (response.success && response.data) {
          this.token = response.data.token
          
          // Sauvegarder le nouveau token
          if (process.client) {
            localStorage.setItem('chatseller_token', response.data.token)
          }
          
          return { success: true }
        } else {
          throw new Error('Impossible de rafraîchir le token')
        }
      } catch (error) {
        console.error('❌ Store: Erreur refresh token:', error)
        this.clearAuth()
        return { success: false }
      }
    }
  }
})