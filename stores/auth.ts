// stores/auth.ts - VERSION AMÉLIORÉE AVEC DONNÉES UTILISATEUR

import { defineStore } from 'pinia'
import { useSupabase } from '~~/composables/useSupabase'

// ✅ TYPES AMÉLIORÉS
interface User {
  id: string
  email: string
  name?: string
  firstName?: string 
  lastName?: string  
  shopId?: string
  shop_id?: string
  avatar?: string
  role?: 'admin' | 'user'
  subscription_plan?: "free" | "professional" | "enterprise"
  createdAt?: string
  updatedAt?: string
  shop?: any
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
    userShopId: (state): string | null => {
      return state.user?.shopId || state.user?.shop_id || state.user?.id || null
    },

    isLoggedIn: (state): boolean => {
      return state.isAuthenticated && !!state.user
    },

    userEmail: (state): string | null => {
      return state.user?.email || null
    },

    // ✅ GETTER AMÉLIORÉ POUR LE NOM
    userName: (state): string | null => {
      // Priorité: firstName + lastName > name > email
      if (state.user?.firstName && state.user?.lastName) {
        return `${state.user.firstName} ${state.user.lastName}`
      }
      if (state.user?.firstName) {
        return state.user.firstName
      }
      return state.user?.name || null
    },

    // ✅ NOUVEAU GETTER POUR LE PRÉNOM SEUL
    userFirstName: (state): string => {
      if (state.user?.firstName) {
        return state.user.firstName
      }
      if (state.user?.name && !state.user.name.includes('@')) {
        return state.user.name.split(' ')[0]
      }
      if (state.user?.email) {
        const emailPrefix = state.user.email.split('@')[0]
        const firstName = emailPrefix.split(/[._-]/)[0]
        return firstName.charAt(0).toUpperCase() + firstName.slice(1).toLowerCase()
      }
      return 'Utilisateur'
    },

    userInitials: (state): string => {
      if (state.user?.firstName && state.user?.lastName) {
        return `${state.user.firstName[0]}${state.user.lastName[0]}`.toUpperCase()
      }
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
    // ✅ ACTION LOGIN AMÉLIORÉE
    async login(credentials: LoginCredentials) {
      this.loading = true
      
      try {
        console.log('🔐 Store Supabase: Tentative de login pour:', credentials.email)
        
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
          
          // ✅ NOUVEAU: Récupérer les données utilisateur complètes
          const userData = await this.fetchCompleteUserData(authData.user)
          
          // Sauvegarder la session
          this.setUser(userData, authData.session?.access_token || '')
          
          return { 
            success: true, 
            data: { 
              user: userData, 
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

    // ✅ NOUVELLE MÉTHODE: Récupérer données utilisateur complètes
    async fetchCompleteUserData(authUser: any): Promise<User> {
      const supabase = useSupabase()
      
      try {
        // 1. Récupérer depuis la table users
        const { data: userData, error: userError } = await supabase
          .from('users')
          .select('first_name, last_name, company, role, email_verified')
          .eq('id', authUser.id)
          .single()

        // 2. Récupérer depuis la table shops
        const { data: shopData, error: shopError } = await supabase
          .from('shops')
          .select('*')
          .eq('id', authUser.id)
          .single()

        if (shopError && shopError.code !== 'PGRST116') {
          console.warn('⚠️ Shop fetch error:', shopError)
        }

        // 3. Construire l'objet user complet
        const user: User = {
          id: authUser.id,
          email: authUser.email!,
          // ✅ DONNÉES DEPUIS TABLE USERS (si disponibles)
          firstName: userData?.first_name || authUser.user_metadata?.first_name || null,
          lastName: userData?.last_name || authUser.user_metadata?.last_name || null,
          // ✅ FALLBACK SUR METADATA OU EMAIL
          name: authUser.user_metadata?.name || 
                (userData?.first_name && userData?.last_name 
                  ? `${userData.first_name} ${userData.last_name}` 
                  : null) ||
                authUser.email?.split('@')[0],
          shopId: authUser.id,
          shop_id: authUser.id,
          avatar: authUser.user_metadata?.avatar_url,
          role: userData?.role || 'user',
          createdAt: authUser.created_at,
          shop: shopData
        }

        console.log('✅ Données utilisateur complètes récupérées:', user)
        return user

      } catch (error) {
        console.warn('⚠️ Erreur récupération données utilisateur:', error)
        
        // ✅ FALLBACK: Construire depuis les métadonnées auth uniquement
        return {
          id: authUser.id,
          email: authUser.email!,
          name: authUser.user_metadata?.name || authUser.email?.split('@')[0],
          firstName: authUser.user_metadata?.first_name || null,
          lastName: authUser.user_metadata?.last_name || null,
          shopId: authUser.id,
          shop_id: authUser.id,
          avatar: authUser.user_metadata?.avatar_url,
          role: 'user',
          createdAt: authUser.created_at
        }
      }
    },

    // ✅ ACTION REGISTER AMÉLIORÉE
    async register(data: RegisterData) {
      this.loading = true
      
      try {
        console.log('📝 Store Supabase: Tentative d\'inscription pour:', data.email)
        
        const supabase = useSupabase()
        
        // ✅ EXTRAIRE PRÉNOM/NOM DU NAME
        const nameParts = data.name.trim().split(' ')
        const firstName = nameParts[0] || data.firstName || ''
        const lastName = nameParts.slice(1).join(' ') || data.lastName || ''
        
        // 1. Créer l'utilisateur dans Supabase Auth
        const { data: authData, error: authError } = await supabase.auth.signUp({
          email: data.email,
          password: data.password,
          options: {
            data: {
              name: data.name,
              first_name: firstName,
              last_name: lastName,
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
          
          // 2. ✅ NOUVEAU: Créer dans la table users
          const { error: userInsertError } = await supabase
            .from('users')
            .insert({
              id: authData.user.id,
              email: data.email,
              first_name: firstName,
              last_name: lastName,
              company: data.company,
              role: 'user',
              email_verified: false,
              newsletter: data.newsletter || false
            })

          if (userInsertError) {
            console.warn('⚠️ User table insert error:', userInsertError)
          }

          // 3. Créer le shop dans la base de données
          const { data: shopData, error: shopError } = await supabase
            .from('shops')
            .insert({
              id: authData.user.id,
              name: data.company || `Shop de ${firstName}`,
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
              subscription_plan: 'starter', // ✅ MODIFIÉ selon tes spécifications
              is_active: true
            })
            .select()
            .single()

          if (shopError) {
            console.error('❌ Shop creation error:', shopError)
          }

          // 4. Construire l'objet user complet
          const user: User = {
            id: authData.user.id,
            email: authData.user.email!,
            firstName: firstName,
            lastName: lastName,
            name: data.name,
            shopId: authData.user.id,
            shop_id: authData.user.id,
            avatar: authData.user.user_metadata?.avatar_url,
            role: 'user',
            createdAt: authData.user.created_at,
            shop: shopData
          }

          // 5. Connecter automatiquement après inscription
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

    // ✅ ACTION RESTORE SESSION AMÉLIORÉE
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

        // ✅ RÉCUPÉRER LES DONNÉES COMPLÈTES
        const userData = await this.fetchCompleteUserData(user)

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

    // ✅ AUTRES ACTIONS INCHANGÉES
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
        this.clearAuth()
      }
    },

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

    clearAuth() {
      this.user = null
      this.token = null
      this.isAuthenticated = false
      
      console.log('🧹 Store: Session nettoyée')
    },

    async updateProfile(data: Partial<User>) {
      this.loading = true
      
      try {
        const supabase = useSupabase()
        
        // Mettre à jour dans Supabase Auth
        const { error: updateError } = await supabase.auth.updateUser({
          data: {
            name: data.name,
            first_name: data.firstName,
            last_name: data.lastName,
            avatar_url: data.avatar
          }
        })
        
        if (updateError) {
          throw new Error(updateError.message)
        }

        // ✅ NOUVEAU: Mettre à jour dans la table users
        if (data.firstName || data.lastName) {
          const { error: userUpdateError } = await supabase
            .from('users')
            .update({
              first_name: data.firstName,
              last_name: data.lastName,
              updated_at: new Date().toISOString()
            })
            .eq('id', this.user?.id)

          if (userUpdateError) {
            console.warn('⚠️ User table update error:', userUpdateError)
          }
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