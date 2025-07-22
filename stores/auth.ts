// stores/auth.ts
import { defineStore } from 'pinia'
import jwt from 'jsonwebtoken'

// Types
interface User {
  id: string
  email: string
  firstName: string
  lastName: string
  company: string
  role: string
  avatar?: string
  emailVerified: boolean
  createdAt: string
  lastLoginAt?: string
}

interface LoginCredentials {
  email: string
  password: string
  remember?: boolean
}

interface RegisterData {
  firstName: string
  lastName: string
  email: string
  company: string
  platform?: string
  password: string
  newsletter?: boolean
}

interface AuthState {
  user: User | null
  token: string | null
  refreshToken: string | null
  isLoading: boolean
  lastActivity: number
  sessionDuration: number
  rememberMe: boolean
}

// Constantes
const TOKEN_KEY = 'chatseller_token'
const REFRESH_TOKEN_KEY = 'chatseller_refresh_token'
const USER_KEY = 'chatseller_user'
const REMEMBER_KEY = 'chatseller_remember'
const ACTIVITY_KEY = 'chatseller_last_activity'

const SESSION_DURATION = 24 * 60 * 60 * 1000 // 24 heures
const REMEMBER_DURATION = 30 * 24 * 60 * 60 * 1000 // 30 jours
const ACTIVITY_THRESHOLD = 30 * 60 * 1000 // 30 minutes d'inactivité

export const useAuthStore = defineStore('auth', {
  state: (): AuthState => ({
    user: null,
    token: null,
    refreshToken: null,
    isLoading: false,
    lastActivity: Date.now(),
    sessionDuration: SESSION_DURATION,
    rememberMe: false
  }),

  getters: {
    /**
     * Vérifie si l'utilisateur est authentifié
     */
    isAuthenticated: (state): boolean => {
      if (!state.token || !state.user) return false
      
      // Vérification de l'expiration du token
      try {
        const decoded = jwt.decode(state.token) as any
        if (!decoded || !decoded.exp) return false
        
        const now = Date.now() / 1000
        return decoded.exp > now
      } catch {
        return false
      }
    },

    /**
     * Vérifie si la session est encore valide
     */
    isSessionValid: (state): boolean => {
      const maxAge = state.rememberMe ? REMEMBER_DURATION : state.sessionDuration
      return Date.now() - state.lastActivity < maxAge
    },

    /**
     * Obtient le nom complet de l'utilisateur
     */
    userFullName: (state): string => {
      if (!state.user) return ''
      return `${state.user.firstName} ${state.user.lastName}`.trim()
    },

    /**
     * Obtient les initiales de l'utilisateur
     */
    userInitials: (state): string => {
      if (!state.user) return '??'
      const first = state.user.firstName.charAt(0).toUpperCase()
      const last = state.user.lastName.charAt(0).toUpperCase()
      return `${first}${last}`
    },

    /**
     * Vérifie si l'utilisateur a un rôle spécifique
     */
    hasRole: (state) => (role: string): boolean => {
      return state.user?.role === role
    },

    /**
     * Vérifie si l'utilisateur est admin
     */
    isAdmin: (state): boolean => {
      return state.user?.role === 'admin' || state.user?.role === 'super_admin'
    },

    /**
     * Temps restant avant expiration de session (en ms)
     */
    timeUntilExpiry: (state): number => {
      if (!state.token) return 0
      
      try {
        const decoded = jwt.decode(state.token) as any
        if (!decoded?.exp) return 0
        
        const expiry = decoded.exp * 1000
        return Math.max(0, expiry - Date.now())
      } catch {
        return 0
      }
    }
  },

  actions: {
    /**
     * Initialise le store depuis le localStorage
     */
    async initializeAuth() {
      if (process.server) return

      try {
        // Récupération des données persistées
        const token = localStorage.getItem(TOKEN_KEY)
        const refreshToken = localStorage.getItem(REFRESH_TOKEN_KEY)
        const userData = localStorage.getItem(USER_KEY)
        const remember = localStorage.getItem(REMEMBER_KEY) === 'true'
        const lastActivity = parseInt(localStorage.getItem(ACTIVITY_KEY) || '0')

        // Vérification de la validité de la session
        if (token && userData && lastActivity) {
          this.token = token
          this.refreshToken = refreshToken
          this.user = JSON.parse(userData)
          this.rememberMe = remember
          this.lastActivity = lastActivity

          // Vérification de l'expiration
          if (this.isAuthenticated && this.isSessionValid) {
            this.updateActivity()
            await this.validateToken()
          } else {
            // Session expirée, nettoyage
            await this.logout(false)
          }
        }
      } catch (error) {
        console.error('Erreur lors de l\'initialisation de l\'auth:', error)
        await this.logout(false)
      }
    },

    /**
     * Connexion utilisateur
     */
    async login(credentials: LoginCredentials) {
      this.isLoading = true

      try {
        const { data } = await $fetch<{
          data: {
            user: User
            token: string
            refreshToken: string
          }
        }>('/api/auth/login', {
          method: 'POST',
          body: credentials
        })

        // Stockage des données
        this.user = data.user
        this.token = data.token
        this.refreshToken = data.refreshToken
        this.rememberMe = credentials.remember || false
        this.updateActivity()

        // Persistance
        this.persistAuth()

        console.log('✅ Connexion réussie:', this.userFullName)
        return data
      } catch (error: any) {
        console.error('❌ Erreur de connexion:', error)
        
        // Messages d'erreur spécifiques
        if (error.status === 401) {
          throw new Error('Email ou mot de passe incorrect')
        } else if (error.status === 429) {
          throw new Error('Trop de tentatives, veuillez réessayer plus tard')
        } else if (error.status === 403) {
          throw new Error('Compte suspendu, contactez le support')
        } else {
          throw new Error('Erreur de connexion, veuillez réessayer')
        }
      } finally {
        this.isLoading = false
      }
    },

    /**
     * Inscription utilisateur
     */
    async register(userData: RegisterData) {
      this.isLoading = true

      try {
        const { data } = await $fetch<{
          data: {
            user: User
            token: string
            refreshToken: string
          }
        }>('/api/auth/register', {
          method: 'POST',
          body: userData
        })

        // Auto-connexion après inscription
        this.user = data.user
        this.token = data.token
        this.refreshToken = data.refreshToken
        this.rememberMe = false
        this.updateActivity()

        // Persistance
        this.persistAuth()

        console.log('✅ Inscription réussie:', this.userFullName)
        return data
      } catch (error: any) {
        console.error('❌ Erreur d\'inscription:', error)
        
        if (error.status === 409) {
          throw new Error('Cette adresse email est déjà utilisée')
        } else if (error.status === 422) {
          throw new Error('Données invalides, vérifiez vos informations')
        } else {
          throw new Error('Erreur lors de la création du compte')
        }
      } finally {
        this.isLoading = false
      }
    },

    /**
     * Déconnexion utilisateur
     */
    async logout(notify: boolean = true) {
      if (this.token && notify) {
        try {
          // Notification du serveur pour invalider le token
          await $fetch('/api/auth/logout', {
            method: 'POST',
            headers: {
              Authorization: `Bearer ${this.token}`
            }
          })
        } catch (error) {
          console.warn('Erreur lors de la déconnexion côté serveur:', error)
        }
      }

      // Nettoyage du state
      this.user = null
      this.token = null
      this.refreshToken = null
      this.rememberMe = false
      this.lastActivity = 0

      // Nettoyage du localStorage
      this.clearPersistedAuth()

      console.log('✅ Déconnexion effectuée')
    },

    /**
     * Actualisation du token
     */
    async refreshAuthToken() {
      if (!this.refreshToken) {
        throw new Error('Aucun refresh token disponible')
      }

      try {
        const { data } = await $fetch<{
          data: {
            token: string
            refreshToken: string
          }
        }>('/api/auth/refresh', {
          method: 'POST',
          body: {
            refreshToken: this.refreshToken
          }
        })

        this.token = data.token
        this.refreshToken = data.refreshToken
        this.updateActivity()
        this.persistAuth()

        console.log('✅ Token actualisé')
        return data.token
      } catch (error) {
        console.error('❌ Erreur lors de l\'actualisation du token:', error)
        await this.logout(false)
        throw error
      }
    },

    /**
     * Validation du token côté serveur
     */
    async validateToken() {
      if (!this.token) return false

      try {
        const { data } = await $fetch<{
          data: { user: User }
        }>('/api/auth/me', {
          headers: {
            Authorization: `Bearer ${this.token}`
          }
        })

        // Mise à jour des données utilisateur
        this.user = data.user
        this.updateActivity()
        this.persistAuth()

        return true
      } catch (error) {
        console.warn('Token invalide:', error)
        await this.logout(false)
        return false
      }
    },

    /**
     * Mise à jour du profil utilisateur
     */
    async updateProfile(updates: Partial<User>) {
      if (!this.token || !this.user) {
        throw new Error('Utilisateur non authentifié')
      }

      try {
        const { data } = await $fetch<{
          data: { user: User }
        }>('/api/auth/profile', {
          method: 'PUT',
          headers: {
            Authorization: `Bearer ${this.token}`
          },
          body: updates
        })

        this.user = data.user
        this.persistAuth()

        console.log('✅ Profil mis à jour')
        return data.user
      } catch (error) {
        console.error('❌ Erreur lors de la mise à jour du profil:', error)
        throw error
      }
    },

    /**
     * Changement de mot de passe
     */
    async changePassword(currentPassword: string, newPassword: string) {
      if (!this.token) {
        throw new Error('Utilisateur non authentifié')
      }

      try {
        await $fetch('/api/auth/change-password', {
          method: 'PUT',
          headers: {
            Authorization: `Bearer ${this.token}`
          },
          body: {
            currentPassword,
            newPassword
          }
        })

        console.log('✅ Mot de passe modifié')
      } catch (error: any) {
        console.error('❌ Erreur lors du changement de mot de passe:', error)
        
        if (error.status === 400) {
          throw new Error('Mot de passe actuel incorrect')
        } else {
          throw new Error('Erreur lors du changement de mot de passe')
        }
      }
    },

    /**
     * Réinitialisation de mot de passe
     */
    async requestPasswordReset(email: string) {
      try {
        await $fetch('/api/auth/forgot-password', {
          method: 'POST',
          body: { email }
        })

        console.log('✅ Email de réinitialisation envoyé')
      } catch (error) {
        console.error('❌ Erreur lors de la demande de réinitialisation:', error)
        throw new Error('Erreur lors de l\'envoi de l\'email')
      }
    },

    /**
     * Met à jour l'horodatage d'activité
     */
    updateActivity() {
      this.lastActivity = Date.now()
      if (process.client) {
        localStorage.setItem(ACTIVITY_KEY, this.lastActivity.toString())
      }
    },

    /**
     * Vérifie et actualise automatiquement le token si nécessaire
     */
    async ensureValidToken() {
      if (!this.isAuthenticated) {
        return false
      }

      // Si le token expire dans moins de 5 minutes, on le renouvelle
      const fiveMinutes = 5 * 60 * 1000
      if (this.timeUntilExpiry < fiveMinutes) {
        try {
          await this.refreshAuthToken()
        } catch {
          return false
        }
      }

      return true
    },

    /**
     * Persistance des données d'authentification
     */
    persistAuth() {
      if (process.server) return

      if (this.token && this.user) {
        localStorage.setItem(TOKEN_KEY, this.token)
        localStorage.setItem(USER_KEY, JSON.stringify(this.user))
        localStorage.setItem(REMEMBER_KEY, this.rememberMe.toString())
        localStorage.setItem(ACTIVITY_KEY, this.lastActivity.toString())
        
        if (this.refreshToken) {
          localStorage.setItem(REFRESH_TOKEN_KEY, this.refreshToken)
        }
      }
    },

    /**
     * Nettoyage des données persistées
     */
    clearPersistedAuth() {
      if (process.server) return

      localStorage.removeItem(TOKEN_KEY)
      localStorage.removeItem(REFRESH_TOKEN_KEY)
      localStorage.removeItem(USER_KEY)
      localStorage.removeItem(REMEMBER_KEY)
      localStorage.removeItem(ACTIVITY_KEY)
    }
  }
})

// Support HMR en développement
if (import.meta.hot) {
  import.meta.hot.accept(acceptHMRUpdate(useAuthStore, import.meta.hot))
}