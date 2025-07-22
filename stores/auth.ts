import { defineStore } from 'pinia'

export const useAuth = defineStore('auth', {
  state: () => ({
    user: null as any,
    token: null as string | null,
    isLoading: false,
    isAuthenticated: false,
    initialized: false // ✅ NOUVEAU : Flag d'initialisation
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
      console.log('🔐 Store: Début login...', { email })
      this.isLoading = true
      
      try {
        const api = useApi()
        const response = await api.auth.login({ email, password })

        if (response.success && response.data) {
          this.setAuthData(response.data.token, response.data.user)
          
          console.log('✅ Store: Login réussi !', {
            token: this.token ? 'Présent' : 'Manquant',
            user: this.user,
            isAuthenticated: this.isAuthenticated
          })

          if (process.client) {
            window.location.replace('/')
          }

          return { success: true }
        } else {
          throw new Error(response.error || 'Échec de la connexion')
        }
      } catch (error: any) {
        console.error('❌ Store: Erreur login:', error)
        return { 
          success: false, 
          error: error.message || 'Erreur de connexion'
        }
      } finally {
        this.isLoading = false
      }
    },

    async logout() {
      console.log('🚪 Store: Logout...')
      
      this.clearAuthData()

      if (process.client) {
        window.location.replace('/login')
      }
    },

    // ✅ MÉTHODE CENTRALE : Définir les données d'auth
    setAuthData(token: string, user: any) {
      this.token = token
      this.user = user
      this.isAuthenticated = true
      this.initialized = true
      
      // Sauvegarder dans localStorage
      if (process.client) {
        localStorage.setItem('chatseller_token', token)
        localStorage.setItem('chatseller_user', JSON.stringify(user))
      }
      
      console.log('✅ Store: Données auth définies et sauvegardées')
    },

    // ✅ MÉTHODE CENTRALE : Nettoyer les données d'auth
    clearAuthData() {
      this.user = null
      this.token = null
      this.isAuthenticated = false
      this.initialized = true
      
      // Nettoyer localStorage
      if (process.client) {
        localStorage.removeItem('chatseller_token')
        localStorage.removeItem('chatseller_user')
      }
      
      console.log('✅ Store: Données auth nettoyées')
    },

    // ✅ MÉTHODE CRITIQUE : Initialisation depuis localStorage
    initializeFromStorage() {
      if (process.client && !this.initialized) {
        const token = localStorage.getItem('chatseller_token')
        const userData = localStorage.getItem('chatseller_user')
        
        if (token && userData) {
          try {
            const user = JSON.parse(userData)
            this.setAuthData(token, user)
            console.log('✅ Store: État restauré depuis localStorage:', user.email)
          } catch (error) {
            console.error('❌ Store: Erreur parsing localStorage:', error)
            this.clearAuthData()
          }
        } else {
          this.initialized = true
          console.log('🔍 Store: Aucune session sauvegardée')
        }
      }
    },

    // ✅ MÉTHODE UTILITAIRE : Vérifier si session existe
    hasValidSession(): boolean {
      if (process.client) {
        const token = localStorage.getItem('chatseller_token')
        const userData = localStorage.getItem('chatseller_user')
        return !!(token && userData)
      }
      return false
    }
  }
})