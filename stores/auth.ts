// stores/auth.ts - STORE AUTH AVEC COMPOSABLE MANUEL

import { defineStore } from 'pinia'
import { useSupabase } from '~~/composables/useSupabase'

// ✅ TYPES LOCAUX (identiques à l'original)
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
  shop?: any // Données du shop Supabase
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
  firstName?: string
  lastName?: string
  company?: string
  platform?: string
  newsletter?: boolean
}

export const useAuthStore = defineStore('auth', {
  state: (): AuthState => ({
    user: null,
    token: null,
    isAuthenticated: false,
    loading: false
  }),

  getters: {
    // ✅ GETTERS IDENTIQUES (compatibilité)
    userShopId: (state): string | null => {
      return state.user?.shopId || state.user?.shop_id || state.user?.id || null
    },

    isLoggedIn: (state): boolean => {
      return state.isAuthenticated && !!state.user
    },

    userEmail: (state): string | null => {
      return state.user?.email || null
    },

    userName: (state): string | null => {
      return state.user?.name || null
    },

    userInitials: (state): string => {
      if (state.user?.name) {
        return state.user.name
          .split(' ')
          .map(n => n[0])
          .join('')
          .toUpperCase()
          .slice(0, 2)
      }
      if (state.user?.email) {
        return state.user.email[0].toUpperCase()
      }
      return 'U'
    }
  },

  actions: {
    // ✅ ACTION LOGIN - VERSION AVEC COMPOSABLE MANUEL
    async login(credentials: LoginCredentials) {
      this.loading = true
      
      try {
        console.log('🔐 Store Supabase: Tentative de login pour:', credentials.email)
        
        // ✅ UTILISER LE COMPOSABLE MANUEL
        const supabase = useSupabase()
        
        const { data: authData, error: authError } = await supabase.auth.signInWithPassword({
          email: credentials.email,
          password: credentials.password
        })

        if (authError) {
          console.error('❌ Supabase auth error:', authError)
          throw new Error(authError.message)
        }

        if (authData.user) {
          console.log('✅ Supabase auth success:', authData.user.id)
          
          // Récupérer les données du shop
          const { data: shopData, error: shopError } = await supabase
            .from('shops')
            .select('*')
            .eq('id', authData.user.id)
            .single()

          if (shopError && shopError.code !== 'PGRST116') {
            console.warn('⚠️ Shop fetch error:', shopError)
          }

          // Construire l'objet user compatible
          const user: User = {
            id: authData.user.id,
            email: authData.user.email!,
            name: authData.user.user_metadata?.name || authData.user.email,
            shopId: authData.user.id,
            shop_id: authData.user.id,
            avatar: authData.user.user_metadata?.avatar_url,
            role: 'user',
            createdAt: authData.user.created_at,
            shop: shopData
          }

          // Sauvegarder la session
          this.setUser(user, authData.session?.access_token || '')
          
          return { 
            success: true, 
            data: { 
              user, 
              token: authData.session?.access_token 
            } 
          }
        } else {
          throw new Error('Aucune donnée utilisateur reçue')
        }
      } catch (error: any) {
        console.error('❌ Store: Erreur login:', error)
        return { 
          success: false, 
          error: error.message || 'Erreur de connexion' 
        }
      } finally {
        this.loading = false
      }
    },

    // ✅ ACTION REGISTER - VERSION AVEC COMPOSABLE MANUEL
    async register(data: RegisterData) {
      this.loading = true
      
      try {
        console.log('📝 Store Supabase: Tentative d\'inscription pour:', data.email)
        
        const supabase = useSupabase()
        
        // 1. Créer l'utilisateur dans Supabase Auth
        const { data: authData, error: authError } = await supabase.auth.signUp({
          email: data.email,
          password: data.password,
          options: {
            data: {
              name: data.name,
              company: data.company || '',
              platform: data.platform || ''
            }
          }
        })

        if (authError) {
          console.error('❌ Supabase signup error:', authError)
          throw new Error(authError.message)
        }

        if (authData.user) {
          console.log('✅ Supabase signup success:', authData.user.id)
          
          // 2. Créer le shop dans la base de données
          const { data: shopData, error: shopError } = await supabase
            .from('shops')
            .insert({
              id: authData.user.id,
              name: data.company || `Shop de ${data.name}`,
              email: data.email,
              domain: null,
              widget_config: {
                theme: 'modern',
                primaryColor: '#E91E63',
                position: 'bottom-right',
                buttonText: 'Parler au vendeur',
                language: 'fr'
              },
              agent_config: {
                name: 'Rose',
                avatar: 'https://ui-avatars.com/api/?name=Rose&background=E91E63&color=fff',
                welcomeMessage: 'Bonjour ! Je suis votre assistante d\'achat. Comment puis-je vous aider ?',
                fallbackMessage: 'Je transmets votre question à notre équipe, un conseiller vous recontactera bientôt.',
                collectPaymentMethod: true,
                upsellEnabled: false
              },
              subscription_plan: 'free',
              is_active: true
            })
            .select()
            .single()

          if (shopError) {
            console.error('❌ Shop creation error:', shopError)
            // Ne pas faire échouer l'inscription pour ça
          }

          // 3. Construire l'objet user
          const user: User = {
            id: authData.user.id,
            email: authData.user.email!,
            name: data.name,
            shopId: authData.user.id,
            shop_id: authData.user.id,
            avatar: authData.user.user_metadata?.avatar_url,
            role: 'user',
            createdAt: authData.user.created_at,
            shop: shopData
          }

          // 4. Connecter automatiquement après inscription
          if (authData.session) {
            this.setUser(user, authData.session.access_token)
          }

          return { 
            success: true, 
            data: { 
              user, 
              token: authData.session?.access_token 
            } 
          }
        } else {
          throw new Error('Erreur lors de la création du compte')
        }
      } catch (error: any) {
        console.error('❌ Store: Erreur register:', error)
        return { 
          success: false, 
          error: error.message || 'Erreur lors de l\'inscription' 
        }
      } finally {
        this.loading = false
      }
    },

    // ✅ ACTION RESET PASSWORD
    async resetPassword(email: string) {
      this.loading = true
      
      try {
        const supabase = useSupabase()
        
        const { error } = await supabase.auth.resetPasswordForEmail(email, {
          redirectTo: `${window.location.origin}/auth/reset-password`
        })
        
        if (error) {
          throw new Error(error.message)
        }
        
        return { 
          success: true, 
          message: 'Email de réinitialisation envoyé' 
        }
      } catch (error: any) {
        console.error('❌ Store: Erreur reset password:', error)
        return { 
          success: false, 
          error: error.message || 'Erreur lors de l\'envoi' 
        }
      } finally {
        this.loading = false
      }
    },

    // ✅ ACTION LOGOUT
    async logout() {
      try {
        console.log('🚪 Store: Déconnexion en cours...')
        
        const supabase = useSupabase()
        const { error } = await supabase.auth.signOut()
        
        if (error) {
          console.warn('⚠️ Erreur logout Supabase:', error)
        }
      } catch (error) {
        console.warn('❌ Store: Erreur lors du logout:', error)
      } finally {
        // Nettoyage local dans tous les cas
        this.clearAuth()
      }
    },

    // ✅ ACTION SET USER (identique)
    setUser(user: User, token: string) {
      const normalizedUser: User = {
        ...user,
        shopId: user.shopId || user.shop_id || user.id,
        shop_id: user.shop_id || user.shopId || user.id
      }
      
      this.user = normalizedUser
      this.token = token
      this.isAuthenticated = true
      
      console.log('✅ Store: Utilisateur connecté:', normalizedUser)
    },

    // ✅ ACTION CLEAR AUTH (identique)
    clearAuth() {
      this.user = null
      this.token = null
      this.isAuthenticated = false
      
      console.log('🧹 Store: Session nettoyée')
    },

    // ✅ ACTION RESTORE SESSION
    async restoreSession() {
      if (!process.client) return { success: false }

      try {
        console.log('🔄 Store: Tentative de restauration de session Supabase')
        
        const supabase = useSupabase()
        const { data: { user }, error } = await supabase.auth.getUser()
        
        if (error || !user) {
          console.log('❌ Store: Pas de session Supabase valide')
          this.clearAuth()
          return { success: false }
        }

        // Récupérer les données du shop
        const { data: shopData, error: shopError } = await supabase
          .from('shops')
          .select('*')
          .eq('id', user.id)
          .single()

        if (shopError && shopError.code !== 'PGRST116') {
          console.warn('⚠️ Shop fetch error:', shopError)
        }

        // Construire l'objet user
        const userData: User = {
          id: user.id,
          email: user.email!,
          name: user.user_metadata?.name || user.email,
          shopId: user.id,
          shop_id: user.id,
          avatar: user.user_metadata?.avatar_url,
          role: 'user',
          createdAt: user.created_at,
          shop: shopData
        }

        // Récupérer le token de session
        const { data: { session } } = await supabase.auth.getSession()
        const token = session?.access_token || ''

        this.setUser(userData, token)
        console.log('✅ Store: Session Supabase restaurée avec succès')
        return { success: true }
        
      } catch (error) {
        console.error('❌ Store: Erreur restore session:', error)
        this.clearAuth()
        return { success: false }
      }
    },

    // ✅ ACTION UPDATE PROFILE
    async updateProfile(data: Partial<User>) {
      this.loading = true
      
      try {
        const supabase = useSupabase()
        
        // Mettre à jour dans Supabase Auth
        const { error: updateError } = await supabase.auth.updateUser({
          data: {
            name: data.name,
            avatar_url: data.avatar
          }
        })
        
        if (updateError) {
          throw new Error(updateError.message)
        }

        // Mettre à jour localement
        if (this.user) {
          this.user = { ...this.user, ...data }
          console.log('✅ Store: Profil mis à jour:', this.user)
        }
        
        return { success: true }
      } catch (error: any) {
        console.error('❌ Store: Erreur update profile:', error)
        return { 
          success: false, 
          error: error.message || 'Erreur mise à jour profil' 
        }
      } finally {
        this.loading = false
      }
    },

    // ✅ ACTION REFRESH TOKEN
    async refreshToken() {
      try {
        const supabase = useSupabase()
        const { data, error } = await supabase.auth.refreshSession()
        
        if (error || !data.session) {
          throw new Error('Impossible de rafraîchir le token')
        }
        
        this.token = data.session.access_token
        return { success: true }
      } catch (error) {
        console.error('❌ Store: Erreur refresh token:', error)
        this.clearAuth()
        return { success: false }
      }
    }
  }
})