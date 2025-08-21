// stores/auth.ts

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
  subscription_plan?: "free" | "starter" | "pro" | "professional" | "enterprise"
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

// ✅ INTERFACE POUR DÉTAILS DU PLAN
interface PlanDetails {
  name: string
  code: string
  agentLimit: number
  knowledgeBaseLimit: number
  conversationLimit: number
  features: string[]
  isActive: boolean
  isTrial: boolean
  trialDaysLeft: number
  trialEndDate: Date | null
  hasExpired: boolean
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

    userName: (state): string | null => {
      if (state.user?.firstName && state.user?.lastName) {
        return `${state.user.firstName} ${state.user.lastName}`
      }
      if (state.user?.firstName) {
        return state.user.firstName
      }
      return state.user?.name || null
    },

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
    },

    // ✅ NOUVEAU GETTER: DÉTAILS COMPLETS DU PLAN - CORRIGÉ
    planDetails: (state): PlanDetails => {
      const user = state.user
      if (!user?.shop) {
        return {
          name: 'Aucun plan',
          code: 'none',
          agentLimit: 0,
          knowledgeBaseLimit: 0,
          conversationLimit: 0,
          features: [],
          isActive: false,
          isTrial: false,
          trialDaysLeft: 0,
          trialEndDate: null,
          hasExpired: true
        }
      }

      const shop = user.shop
      const subscriptionPlan = shop.subscription_plan || 'free'
      const createdAt = new Date(shop.createdAt || shop.created_at || Date.now())
      const now = new Date()
      const daysSinceCreation = Math.floor((now.getTime() - createdAt.getTime()) / (1000 * 60 * 60 * 24))
      const trialDaysLeft = Math.max(0, 7 - daysSinceCreation)
      const trialEndDate = new Date(createdAt.getTime() + 7 * 24 * 60 * 60 * 1000)

      // ✅ LOGIQUE STRICTE SELON LES SPÉCIFICATIONS
      switch (subscriptionPlan) {
        case 'free':
          return {
            name: 'Essai Gratuit',
            code: 'free',
            agentLimit: 1,
            knowledgeBaseLimit: 10,
            conversationLimit: 1000,
            features: ['7 jours gratuit', '1 agent IA', '1000 conversations/mois', '10 documents max'],
            isActive: trialDaysLeft > 0,
            isTrial: true,
            trialDaysLeft,
            trialEndDate,
            hasExpired: trialDaysLeft <= 0
          }

        case 'starter':
          return {
            name: 'Starter',
            code: 'starter', 
            agentLimit: 1,
            knowledgeBaseLimit: 10,
            conversationLimit: 1000,
            features: ['1 Vendeur IA spécialisé', '1000 conversations/mois', '10 documents max', 'Analytics de base', 'Support email'],
            isActive: true,
            isTrial: false,
            trialDaysLeft: 0,
            trialEndDate: null,
            hasExpired: false
          }

        case 'pro':
        case 'professional':
          return {
            name: 'Pro',
            code: 'pro',
            agentLimit: 3,
            knowledgeBaseLimit: 50,
            conversationLimit: -1, // Illimité
            features: ['3 Vendeurs IA', 'Conversations illimitées', '50 documents max', 'Analytics avancées & ROI', 'Upsell & FOMO', 'Support prioritaire'],
            isActive: true,
            isTrial: false,
            trialDaysLeft: 0,
            trialEndDate: null,
            hasExpired: false
          }

        case 'enterprise':
          return {
            name: 'Enterprise',
            code: 'enterprise',
            agentLimit: -1, // Illimité
            knowledgeBaseLimit: -1,
            conversationLimit: -1, // Illimité
            features: ['Vendeurs IA illimités', 'Documents illimités', 'Analytics complètes', 'White-label', 'Support dédié', 'API avancée'],
            isActive: true,
            isTrial: false,
            trialDaysLeft: 0,
            trialEndDate: null,
            hasExpired: false
          }

        default:
          return {
            name: 'Plan inconnu',
            code: 'unknown',
            agentLimit: 0,
            knowledgeBaseLimit: 0,
            conversationLimit: 0,
            features: [],
            isActive: false,
            isTrial: false,
            trialDaysLeft: 0,
            trialEndDate: null,
            hasExpired: true
          }
      }
    },

    // ✅ GETTERS SIMPLIFIÉS
    currentPlan: (state): string => {
      return state.user?.shop?.subscription_plan || 'free'
    },

    isPaidUser: (state): boolean => {
      const plan = state.user?.shop?.subscription_plan
      return plan === 'starter' || plan === 'pro' || plan === 'professional' || plan === 'enterprise'
    },

    hasActiveAccess: (state): boolean => {
      const details = (state as any).planDetails
      return details.isActive && !details.hasExpired
    },

    trialExpired: (state): boolean => {
      const details = (state as any).planDetails
      return details.isTrial && details.hasExpired
    }
  },

  actions: {
    // ✅ ACTION LOGIN INCHANGÉE
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
          
          const userData = await this.fetchCompleteUserDataViaAPI(authData.user, authData.session?.access_token || '')
          
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

    // ✅ FONCTION CORRIGÉE : RÉCUPÉRATION DONNÉES VIA API AVEC RETRY
    async fetchCompleteUserDataViaAPI(authUser: any, token: string, forceRefresh: boolean = false): Promise<User> {
    try {
      console.log('📡 [Store] Récupération données utilisateur via API...', forceRefresh ? '(FORCE REFRESH)' : '')
      
      // ✅ TENTATIVE D'APPEL API AVEC TIMEOUT COURT
      const api = useApi()
      
      try {
        // ✅ TIMEOUT COURT POUR ÉVITER LES BLOCAGES
        const timeoutPromise = new Promise((_, reject) => 
          setTimeout(() => reject(new Error('Timeout API')), 5000)
        )
        
        const apiPromise = api.shops.get(authUser.id)
        
        const shopResponse = await Promise.race([apiPromise, timeoutPromise]) as any

        if (shopResponse?.success && shopResponse?.data) {
          const shopData = shopResponse.data
          console.log('✅ [Store] Données shop récupérées via API:', {
            id: shopData.id,
            email: shopData.email,
            plan: shopData.subscription_plan,
            isActive: shopData.is_active,
            onboarding_completed: shopData.onboarding_completed
          })

          // ✅ ASSEMBLAGE UTILISATEUR AVEC DONNÉES COMPLÈTES
          const user: User = {
            id: authUser.id,
            email: authUser.email!,
            firstName: authUser.user_metadata?.first_name || shopData.first_name || null,
            lastName: authUser.user_metadata?.last_name || shopData.last_name || null,
            name: authUser.user_metadata?.name || 
                  (authUser.user_metadata?.first_name && authUser.user_metadata?.last_name 
                    ? `${authUser.user_metadata.first_name} ${authUser.user_metadata.last_name}` 
                    : null) ||
                  shopData.name ||
                  authUser.email?.split('@')[0],
            shopId: authUser.id,
            shop_id: authUser.id,
            avatar: authUser.user_metadata?.avatar_url,
            role: 'user',
            createdAt: authUser.created_at,
            shop: shopData
          }

          console.log('✅ [Store] Données utilisateur complètes assemblées via API')
          return user

        } else {
          console.warn('⚠️ [Store] API retourné mais pas de données shop valides')
          throw new Error('Pas de données shop')
        }

      } catch (apiError: any) {
        console.warn('⚠️ [Store] Erreur appel API shops:', apiError.message)
        
        // ✅ SI L'API ÉCHOUE, UTILISER SUPABASE DIRECTEMENT
        console.log('🔄 [Store] Fallback: Tentative récupération via Supabase direct')
        
        try {
          const supabase = useSupabase()
          
          // Utiliser le service client pour lire la table shops
          const { data: shopDataSupabase, error: supabaseError } = await supabase
            .from('shops')
            .select('*')
            .eq('id', authUser.id)
            .single()
          
          if (!supabaseError && shopDataSupabase) {
            console.log('✅ [Store] Données shop récupérées via Supabase direct')
            
            const user: User = {
              id: authUser.id,
              email: authUser.email!,
              firstName: authUser.user_metadata?.first_name || shopDataSupabase.first_name || null,
              lastName: authUser.user_metadata?.last_name || shopDataSupabase.last_name || null,
              name: authUser.user_metadata?.name || shopDataSupabase.name || authUser.email?.split('@')[0],
              shopId: authUser.id,
              shop_id: authUser.id,
              avatar: authUser.user_metadata?.avatar_url,
              role: 'user',
              createdAt: authUser.created_at,
              shop: shopDataSupabase
            }
            
            return user
          } else {
            console.warn('⚠️ [Store] Supabase direct échoué aussi:', supabaseError)
            throw new Error('Shop non trouvé via Supabase')
          }
          
        } catch (supabaseError: any) {
          console.warn('⚠️ [Store] Erreur Supabase direct:', supabaseError.message)
          throw supabaseError
        }
      }

    } catch (error: any) {
      console.warn('⚠️ [Store] Toutes les tentatives ont échoué, utilisation données fallback')
      
      // ✅ FALLBACK ROBUSTE - CRÉER UN UTILISATEUR AVEC LES DONNÉES AUTH SEULEMENT
      const fallbackUser: User = {
        id: authUser.id,
        email: authUser.email!,
        name: authUser.user_metadata?.name || authUser.email?.split('@')[0],
        firstName: authUser.user_metadata?.first_name || null,
        lastName: authUser.user_metadata?.last_name || null,
        shopId: authUser.id,
        shop_id: authUser.id,
        avatar: authUser.user_metadata?.avatar_url,
        role: 'user',
        createdAt: authUser.created_at,
        shop: {
          id: authUser.id,
          name: authUser.user_metadata?.name || `Shop de ${authUser.email?.split('@')[0]}`,
          email: authUser.email,
          subscription_plan: 'free',
          is_active: true,
          onboarding_completed: true, // ✅ IMPORTANT: Par défaut true pour éviter la boucle onboarding
          created_at: authUser.created_at
        }
      }
      
      console.log('⚠️ [Store] Utilisation des données fallback robustes')
      return fallbackUser
    }
  },

    // ✅ ACTION REGISTER INCHANGÉE
    async register(data: RegisterData) {
    this.loading = true
    
    try {
      console.log('📝 Store Supabase: Tentative d\'inscription pour:', data.email)
      
      const supabase = useSupabase()
      
      const nameParts = data.name.trim().split(' ')
      const firstName = nameParts[0] || data.firstName || ''
      const lastName = nameParts.slice(1).join(' ') || data.lastName || ''
      
      // ✅ ÉTAPE 1 : Créer l'utilisateur dans Supabase Auth
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
        
        // ✅ CORRECTION CRITIQUE : NE PAS ESSAYER DE CRÉER LE SHOP SI PAS DE SESSION
        if (authData.session) {
          console.log('✅ Session créée, création du shop...')
          
          try {
            const config = useRuntimeConfig()
            const baseURL = config.public.apiBaseUrl
            
            const shopCreateResponse = await $fetch('/api/v1/shops', {
              method: 'POST',
              baseURL,
              headers: {
                'Authorization': `Bearer ${authData.session.access_token}`,
                'Content-Type': 'application/json'
              },
              body: {
                id: authData.user.id,
                name: data.company || `Shop de ${firstName}`,
                email: data.email,
                subscription_plan: 'free',
                is_active: true,
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
                }
              }
            }) as any

            console.log('✅ Shop créé via API:', shopCreateResponse)
            
            // ✅ RÉCUPÉRER LES DONNÉES COMPLÈTES ET CONNECTER
            const userData = await this.fetchCompleteUserDataViaAPI(authData.user, authData.session.access_token)
            this.setUser(userData, authData.session.access_token)
            
          } catch (apiError) {
            console.warn('⚠️ Erreur création shop via API (non bloquante):', apiError)
          }
        } else {
          console.log('⚠️ Pas de session immédiate - email confirmation requis')
          // ✅ NE PAS CONNECTER L'UTILISATEUR, JUSTE INDIQUER LE SUCCÈS
        }

        console.log('✅ Inscription terminée - confirmation email requise')
        return { 
          success: true, 
          data: { 
            user: authData.user,
            session: authData.session,
            needsEmailConfirmation: !authData.session // ✅ IMPORTANT FLAG
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

    // ✅ ACTION RESTORE SESSION CORRIGÉE AVEC FORCE REFRESH
    async restoreSession(forceRefresh: boolean = false) {
      if (!process.client) return { success: false }

      try {
        console.log('🔄 Store: Tentative de restauration de session Supabase + API', forceRefresh ? '(FORCE REFRESH)' : '')
        
        const supabase = useSupabase()
        const { data: { user }, error } = await supabase.auth.getUser()
        
        if (error || !user) {
          console.log('❌ Store: Pas de session Supabase valide')
          this.clearAuth()
          return { success: false }
        }

        const { data: { session } } = await supabase.auth.getSession()
        const token = session?.access_token || ''

        if (!token) {
          console.log('❌ Store: Pas de token de session')
          this.clearAuth()
          return { success: false }
        }

        // ✅ UTILISER LE FORCE REFRESH POUR RÉCUPÉRER LES DONNÉES FRAÎCHES
        const userData = await this.fetchCompleteUserDataViaAPI(user, token, forceRefresh)

        this.setUser(userData, token)
        console.log('✅ Store: Session Supabase + API restaurée avec succès')
        console.log('📋 Plan utilisateur:', this.planDetails.name, `(${this.planDetails.trialDaysLeft} jours restants si essai)`)
        
        return { success: true }
        
      } catch (error) {
        console.error('❌ Store: Erreur restore session:', error)
        this.clearAuth()
        return { success: false }
      }
    },

    // ✅ NOUVELLE ACTION: FORCER LA SYNCHRONISATION DES DONNÉES
    async forceDataSync() {
      console.log('🔄 [Store] FORCE SYNC: Synchronisation forcée des données utilisateur...')
      
      try {
        if (!this.isAuthenticated || !this.token) {
          console.warn('⚠️ [Store] Pas d\'utilisateur authentifié pour la synchronisation')
          return { success: false }
        }

        // Forcer un refresh complet des données
        const result = await this.restoreSession(true)
        
        if (result.success) {
          console.log('✅ [Store] Synchronisation forcée réussie')
          console.log('📋 [Store] Nouveau plan:', this.currentPlan)
        } else {
          console.error('❌ [Store] Échec de la synchronisation forcée')
        }
        
        return result
      } catch (error) {
        console.error('❌ [Store] Erreur lors de la synchronisation forcée:', error)
        return { success: false }
      }
    },

    // ✅ NOUVELLE ACTION: ATTENDRE LA MISE À JOUR DU PLAN
    async waitForPlanUpdate(expectedPlan: string, maxRetries: number = 5, retryDelay: number = 3000): Promise<boolean> {
      console.log(`⏳ [Store] Attente de la mise à jour du plan vers: ${expectedPlan}`)
      
      for (let i = 0; i < maxRetries; i++) {
        console.log(`🔄 [Store] Tentative ${i + 1}/${maxRetries}...`)
        
        // Forcer la synchronisation
        await this.forceDataSync()
        
        // Vérifier si le plan a été mis à jour
        if (this.currentPlan === expectedPlan) {
          console.log(`✅ [Store] Plan mis à jour avec succès vers: ${expectedPlan}`)
          return true
        }
        
        // Attendre avant le prochain retry
        if (i < maxRetries - 1) {
          console.log(`⏳ [Store] Plan actuel: ${this.currentPlan}, retry dans ${retryDelay/1000}s...`)
          await new Promise(resolve => setTimeout(resolve, retryDelay))
        }
      }
      
      console.warn(`⚠️ [Store] Échec de la mise à jour du plan après ${maxRetries} tentatives`)
      return false
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
      
      console.log('✅ Store: Utilisateur connecté (API):', {
        id: normalizedUser.id,
        email: normalizedUser.email,
        plan: normalizedUser.shop?.subscription_plan || 'none'
      })
      console.log('📋 Plan actuel:', this.planDetails.name)
      console.log('⏰ Essai expiré:', this.trialExpired)
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

        if (data.firstName || data.lastName) {
          try {
            const api = useApi()
            await api.shops.update(this.user?.id || '', {
              name: data.name,
              updated_at: new Date().toISOString()
            })
          } catch (apiError) {
            console.warn('⚠️ Erreur mise à jour shop via API:', apiError)
          }
        }

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
    },

    // ✅ ACTION MISE À JOUR PLAN VIA API - INCHANGÉE
    async updateSubscriptionPlan(newPlan: string) {
      if (!this.user?.shop) {
        console.error('❌ Pas de shop pour mettre à jour le plan')
        return { success: false, error: 'Shop manquant' }
      }

      try {
        const api = useApi()
        
        const response = await api.shops.update(this.user.shop.id, {
          subscription_plan: newPlan,
          updated_at: new Date().toISOString()
        })

        if (!response.success) {
          throw new Error(response.error || 'Erreur mise à jour plan')
        }

        if (this.user.shop) {
          this.user.shop.subscription_plan = newPlan
          console.log('✅ Plan mis à jour vers:', newPlan)
        }

        return { success: true, data: response.data }
      } catch (error: any) {
        console.error('❌ Erreur mise à jour plan:', error)
        return { success: false, error: error.message }
      }
    }
  }
})