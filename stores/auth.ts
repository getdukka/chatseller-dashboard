// stores/auth.ts 

import { defineStore } from 'pinia'
import { useSupabase } from '~~/composables/useSupabase'
import { BEAUTY_PLANS, type PlanFeatures, checkQuotaUsage, type PlanQuotas, getPlanDetails } from '~/types/plans'

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
  subscription_plan?: "free" | "starter" | "growth" | "performance"
  createdAt?: string
  updatedAt?: string
  shop?: any
}

interface AuthState {
  user: User | null
  token: string | null
  isAuthenticated: boolean
  loading: boolean
  quotasUsage: PlanQuotas
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
  beautyCategory?: string
  newsletter?: boolean
}

export const useAuthStore = defineStore('auth', {
  state: (): AuthState => ({
    user: null,
    token: null,
    isAuthenticated: false,
    loading: false,
    quotasUsage: {
      aiResponses: 0,
      knowledgeDocuments: 0,
      indexablePages: 0,
      agents: 0,
      additionalAgentCost: 0
    }
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

    // ✅ GETTER CORRIGÉ : planDetails avec gestion d'erreur robuste
    planDetails: (state): PlanFeatures & {
      quotasStatus: ReturnType<typeof checkQuotaUsage>
      trialDaysLeft: number
      trialEndDate: Date | null
      hasExpired: boolean
    } => {
      try {
        const user = state.user
        const subscriptionPlan = user?.shop?.subscription_plan || 'starter'
        
        // ✅ CORRECTION : Normaliser le plan avant utilisation
        let normalizedPlan = subscriptionPlan.toLowerCase()
        
        // ✅ Mapper les anciens plans vers les nouveaux
        const planMapping: Record<string, string> = {
          'free': 'starter',
          'basic': 'starter', 
          'pro': 'growth',
          'professional': 'growth',
          'enterprise': 'performance'
        }
        
        if (planMapping[normalizedPlan]) {
          console.log(`🔄 [Auth Store] Migration plan ${subscriptionPlan} → ${planMapping[normalizedPlan]}`)
          normalizedPlan = planMapping[normalizedPlan]
        }
        
        // ✅ Utiliser getPlanDetails avec fallback sécurisé
        const plan = getPlanDetails(normalizedPlan)
        
        if (!plan) {
          console.warn(`⚠️ [Auth Store] Plan non trouvé: ${subscriptionPlan}, fallback vers starter`)
          return {
            ...BEAUTY_PLANS.starter,
            quotasStatus: {
              aiResponses: { used: 0, limit: 1000, exceeded: false },
              knowledgeDocuments: { used: 0, limit: 50, exceeded: false },
              indexablePages: { used: 0, limit: 500, exceeded: false },
              agents: { used: 0, limit: -1, exceeded: false, additionalCost: 0 }
            },
            trialDaysLeft: 14,
            trialEndDate: new Date(Date.now() + 14 * 24 * 60 * 60 * 1000),
            hasExpired: false
          }
        }
        
        // ✅ Calcul sécurisé des dates d'essai
        let createdAt: Date
        try {
          createdAt = new Date(user?.shop?.createdAt || user?.shop?.created_at || Date.now())
        } catch {
          createdAt = new Date()
        }
        
        const now = new Date()
        const daysSinceCreation = Math.floor((now.getTime() - createdAt.getTime()) / (1000 * 60 * 60 * 24))
        const trialDaysLeft = Math.max(0, plan.trialDays - daysSinceCreation)
        const trialEndDate = new Date(createdAt.getTime() + plan.trialDays * 24 * 60 * 60 * 1000)
        
        // ✅ Calcul sécurisé du statut des quotas
        let quotasStatus
        try {
          quotasStatus = checkQuotaUsage(normalizedPlan, state.quotasUsage)
        } catch (quotaError) {
          console.warn('⚠️ [Auth Store] Erreur checkQuotaUsage, utilisation des valeurs par défaut:', quotaError)
          quotasStatus = {
            aiResponses: { used: state.quotasUsage.aiResponses || 0, limit: plan.quotas.aiResponses, exceeded: false },
            knowledgeDocuments: { used: state.quotasUsage.knowledgeDocuments || 0, limit: plan.quotas.knowledgeDocuments, exceeded: false },
            indexablePages: { used: state.quotasUsage.indexablePages || 0, limit: plan.quotas.indexablePages, exceeded: false },
            agents: { used: state.quotasUsage.agents || 0, limit: plan.quotas.agents, exceeded: false, additionalCost: 0 }
          }
        }
        
        return {
          ...plan,
          quotasStatus,
          trialDaysLeft,
          trialEndDate,
          hasExpired: normalizedPlan === 'starter' && trialDaysLeft <= 0
        }
        
      } catch (error) {
        console.error('❌ [Auth Store] Erreur critique dans planDetails:', error)
        
        // ✅ Fallback complet en cas d'erreur critique
        return {
          ...BEAUTY_PLANS.starter,
          quotasStatus: {
            aiResponses: { used: 0, limit: 1000, exceeded: false },
            knowledgeDocuments: { used: 0, limit: 50, exceeded: false },
            indexablePages: { used: 0, limit: 500, exceeded: false },
            agents: { used: 0, limit: -1, exceeded: false, additionalCost: 0 }
          },
          trialDaysLeft: 14,
          trialEndDate: new Date(Date.now() + 14 * 24 * 60 * 60 * 1000),
          hasExpired: false
        }
      }
    },

    // ✅ GETTER CORRIGÉ : currentPlan avec fallback
    currentPlan: (state): string => {
      const plan = state.user?.shop?.subscription_plan || 'starter'
      
      // Mapper les anciens plans
      const planMapping: Record<string, string> = {
        'free': 'starter',
        'basic': 'starter',
        'pro': 'growth', 
        'professional': 'growth',
        'enterprise': 'performance'
      }
      
      return planMapping[plan.toLowerCase()] || plan
    },

    isPaidUser: (state): boolean => {
      const plan = state.user?.shop?.subscription_plan
      return plan === 'starter' || plan === 'growth' || plan === 'performance'
    },

    hasActiveAccess: (state): boolean => {
      const details = (state as any).planDetails
      return !details.hasExpired
    },

    trialExpired: (state): boolean => {
      const details = (state as any).planDetails
      return details.hasExpired
    }
  },

  actions: {
    // ✅ ACTION : resetPassword
    async resetPassword(email: string) {
      try {
        console.log('🔄 [Auth Store] Reset password pour:', email)
        
        const supabase = useSupabase()
        const { error } = await supabase.auth.resetPasswordForEmail(email)
        
        if (error) {
          throw new Error(error.message)
        }
        
        console.log('✅ [Auth Store] Email de reset envoyé')
        return { success: true }
        
      } catch (error: any) {
        console.error('❌ [Auth Store] Erreur reset password:', error)
        return { 
          success: false, 
          error: error.message || 'Erreur lors de l\'envoi de l\'email de récupération' 
        }
      }
    },

    // ✅ ACTION : updateProfile
    async updateProfile(data: Partial<any>) {
      try {
        console.log('🔄 [Auth Store] Mise à jour profil:', data)
        
        const supabase = useSupabase()
        const { error } = await supabase.auth.updateUser({
          data: data
        })
        
        if (error) {
          throw new Error(error.message)
        }
        
        // Mettre à jour les données locales
        if (this.user) {
          this.user = { ...this.user, ...data }
        }
        
        console.log('✅ [Auth Store] Profil mis à jour')
        return { success: true }
        
      } catch (error: any) {
        console.error('❌ [Auth Store] Erreur mise à jour profil:', error)
        return { 
          success: false, 
          error: error.message || 'Erreur lors de la mise à jour du profil' 
        }
      }
    },

    // ✅ ACTION : refreshToken
    async refreshToken() {
      try {
        console.log('🔄 [Auth Store] Rafraîchissement token')
        
        const supabase = useSupabase()
        const { data, error } = await supabase.auth.refreshSession()
        
        if (error || !data.session) {
          throw new Error(error?.message || 'Impossible de rafraîchir le token')
        }
        
        // Mettre à jour le token
        this.token = data.session.access_token
        
        console.log('✅ [Auth Store] Token rafraîchi')
        return { success: true, token: data.session.access_token }
        
      } catch (error: any) {
        console.error('❌ [Auth Store] Erreur refresh token:', error)
        
        // Déconnecter l'utilisateur si le refresh échoue
        this.clearAuth()
        
        return { 
          success: false, 
          error: error.message || 'Session expirée, veuillez vous reconnecter' 
        }
      }
    },

    // ✅ MÉTHODE : syncQuotasFromAPI
    async syncQuotasFromAPI() {
      try {
        if (!this.user?.id || !this.token) return

        const api = useApi()
        const response = await api.shops.get(this.user.id)
        
        if (response.success && response.data) {
          // Extraire les quotas depuis les données du shop
          const shopData = response.data
          this.quotasUsage = {
            aiResponses: shopData.quotas_usage?.aiResponses || 0,
            knowledgeDocuments: shopData.quotas_usage?.knowledgeDocuments || 0,
            indexablePages: shopData.quotas_usage?.indexablePages || 0,
            agents: shopData.quotas_usage?.agents || 0,
            additionalAgentCost: 0
          }
          console.log('✅ Quotas synchronisés depuis API')
        }
      } catch (error) {
        console.error('❌ Erreur sync quotas API:', error)
      }
    },

    async updateQuotasUsage(usage: Partial<PlanQuotas>) {
      this.quotasUsage = {
        ...this.quotasUsage,
        ...usage
      }
      
      try {
        if (this.user?.id && this.token) {
          const api = useApi()
          await api.shops.update(this.user.id, {
            quotas_usage: this.quotasUsage,
            updated_at: new Date().toISOString()
          })
        }
      } catch (error) {
        console.warn('⚠️ Erreur sauvegarde quotas usage:', error)
      }
    },

    async incrementAIUsage() {
      await this.updateQuotasUsage({
        aiResponses: (this.quotasUsage.aiResponses || 0) + 1
      })
    },

    async incrementKnowledgeDocuments(count: number = 1) {
      await this.updateQuotasUsage({
        knowledgeDocuments: (this.quotasUsage.knowledgeDocuments || 0) + count
      })
    },

    async incrementIndexablePages(count: number = 1) {
      await this.updateQuotasUsage({
        indexablePages: (this.quotasUsage.indexablePages || 0) + count
      })
    },

    async updateAgentsCount(count: number) {
      await this.updateQuotasUsage({
        agents: count
      })
    },

    // ✅ ACTION : login
    async login(credentials: LoginCredentials) {
      this.loading = true
      
      try {
        console.log('🔐 Store Beauté: Tentative de login pour:', credentials.email)
        
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
          
          await this.syncQuotasFromAPI()
          
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

    // ✅ ACTION : register
    async register(data: RegisterData) {
      this.loading = true
      
      try {
        console.log('📝 Store Beauté: Tentative d\'inscription pour:', data.email)
        
        const supabase = useSupabase()
        
        const nameParts = data.name.trim().split(' ')
        const firstName = nameParts[0] || data.firstName || ''
        const lastName = nameParts.slice(1).join(' ') || data.lastName || ''
        
        // ✅ Construire l'URL de redirection vers /auth/callback
        const redirectUrl = typeof window !== 'undefined'
          ? `${window.location.origin}/auth/callback`
          : 'https://dashboard.chatseller.app/auth/callback'

        console.log('🔗 [Register] Email redirect URL:', redirectUrl)

        const { data: authData, error: authError } = await supabase.auth.signUp({
          email: data.email,
          password: data.password,
          options: {
            emailRedirectTo: redirectUrl,
            data: {
              name: data.name,
              first_name: firstName,
              last_name: lastName,
              company: data.company || '',
              platform: data.platform || '',
              beauty_category: data.beautyCategory || 'multi'
            }
          }
        })

        if (authError) {
          console.error('❌ Supabase signup error:', authError)
          throw new Error(authError.message)
        }

        if (authData.user) {
          console.log('✅ Supabase signup success:', authData.user.id)
          
          if (authData.session) {
            console.log('✅ Session créée, création du shop beauté...')
            
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
                  name: data.company || `${firstName} Beauté`,
                  email: data.email,
                  subscription_plan: 'starter', // ✅ CORRIGÉ : Nouveau plan par défaut
                  beauty_category: data.beautyCategory || 'multi',
                  is_active: true,
                  quotas: {
                    aiResponses: 1000,
                    knowledgeDocuments: 50,
                    indexablePages: 500,
                    agents: -1,
                    additionalAgentCost: 10
                  },
                  quotas_usage: {
                    aiResponses: 0,
                    knowledgeDocuments: 0,
                    indexablePages: 0,
                    agents: 0
                  },
                  widget_config: {
                    theme: 'beauty_modern',
                    primaryColor: '#E91E63',
                    position: 'above-cta',
                    buttonText: 'Parler à votre conseillère beauté',
                    language: 'fr'
                  },
                  agent_config: {
                    name: 'Rose',
                    title: 'Conseillère Beauté IA',
                    type: 'beauty_expert',
                    avatar: 'https://ui-avatars.com/api/?name=Rose&background=E91E63&color=fff',
                    welcomeMessage: 'Bonjour ! Je suis Rose, votre conseillère beauté. Comment puis-je vous aider ?',
                    fallbackMessage: 'Je transmets votre question à notre équipe beauté.',
                    collectBeautyProfile: true,
                    upsellEnabled: true
                  }
                }
              }) as any

              console.log('✅ Shop beauté créé via API:', shopCreateResponse)
              
              const userData = await this.fetchCompleteUserDataViaAPI(authData.user, authData.session.access_token)
              this.setUser(userData, authData.session.access_token)
              
            } catch (apiError) {
              console.warn('⚠️ Erreur création shop beauté via API:', apiError)
            }
          }

          console.log('✅ Inscription beauté terminée')
          return { 
            success: true, 
            data: { 
              user: authData.user,
              session: authData.session,
              needsEmailConfirmation: !authData.session
            } 
          }
        } else {
          throw new Error('Erreur lors de la création du compte beauté')
        }
      } catch (error: any) {
        console.error('❌ Store: Erreur register beauté:', error)
        return { 
          success: false, 
          error: error.message || 'Erreur lors de l\'inscription' 
        }
      } finally {
        this.loading = false
      }
    },

    // ✅ ACTION : restoreSession
    async restoreSession(forceRefresh: boolean = false) {
      if (!process.client) return { success: false }

      try {
        console.log('🔄 Store: Restauration session avec quotas beauté')
        
        const supabase = useSupabase()
        const { data: { user }, error } = await supabase.auth.getUser()
        
        if (error || !user) {
          this.clearAuth()
          return { success: false }
        }

        const { data: { session } } = await supabase.auth.getSession()
        const token = session?.access_token || ''

        if (!token) {
          this.clearAuth()
          return { success: false }
        }

        const userData = await this.fetchCompleteUserDataViaAPI(user, token, forceRefresh)
        this.setUser(userData, token)
        
        await this.syncQuotasFromAPI()
        
        console.log('✅ Session beauté restaurée avec quotas')
        console.log('📋 Plan:', this.planDetails.name, '- Quotas:', this.quotasUsage)
        
        return { success: true }
        
      } catch (error) {
        console.error('❌ Store: Erreur restore session:', error)
        this.clearAuth()
        return { success: false }
      }
    },

    // ✅ ACTION : fetchCompleteUserDataViaAPI
    async fetchCompleteUserDataViaAPI(authUser: any, token: string, forceRefresh: boolean = false): Promise<User> {
      try {
        const api = useApi()
        const shopResponse = await api.shops.get(authUser.id)

        if (shopResponse?.success && shopResponse?.data) {
          const shopData = shopResponse.data
          
          const user: User = {
            id: authUser.id,
            email: authUser.email!,
            firstName: authUser.user_metadata?.first_name || shopData.first_name || null,
            lastName: authUser.user_metadata?.last_name || shopData.last_name || null,
            name: authUser.user_metadata?.name || shopData.name || authUser.email?.split('@')[0],
            shopId: authUser.id,
            shop_id: authUser.id,
            avatar: authUser.user_metadata?.avatar_url,
            role: 'user',
            createdAt: authUser.created_at,
            shop: shopData
          }

          return user
        } else {
          throw new Error('Pas de données shop')
        }

      } catch (error: any) {
        const fallbackUser: User = {
          id: authUser.id,
          email: authUser.email!,
          name: authUser.user_metadata?.name || authUser.email?.split('@')[0],
          shopId: authUser.id,
          shop_id: authUser.id,
          avatar: authUser.user_metadata?.avatar_url,
          role: 'user',
          createdAt: authUser.created_at,
          shop: {
            id: authUser.id,
            name: `${authUser.user_metadata?.name || authUser.email?.split('@')[0]} Beauté`,
            email: authUser.email,
            subscription_plan: 'starter', // ✅ CORRIGÉ : Plan par défaut
            beauty_category: 'multi',
            is_active: true,
            created_at: authUser.created_at
          }
        }
        
        return fallbackUser
      }
    },

    // ✅ ACTION : setUser
    setUser(user: User, token: string) {
      const normalizedUser: User = {
        ...user,
        shopId: user.shopId || user.shop_id || user.id,
        shop_id: user.shop_id || user.shopId || user.id
      }
      
      this.user = normalizedUser
      this.token = token
      this.isAuthenticated = true
      
      console.log('✅ Store: Utilisateur connecté (Beauté):', {
        id: normalizedUser.id,
        email: normalizedUser.email,
        plan: normalizedUser.shop?.subscription_plan || 'starter',
        beautyCategory: normalizedUser.shop?.beauty_category || 'multi'
      })
    },

    // ✅ ACTION : clearAuth
    clearAuth() {
      this.user = null
      this.token = null
      this.isAuthenticated = false
      this.quotasUsage = {
        aiResponses: 0,
        knowledgeDocuments: 0,
        indexablePages: 0,
        agents: 0,
        additionalAgentCost: 0
      }
      
      console.log('🧹 Store: Session beauté nettoyée')
    },

    // ✅ ACTION : logout
    async logout() {
      try {
        const supabase = useSupabase()
        const { error } = await supabase.auth.signOut()
        if (error) console.warn('⚠️ Erreur logout:', error)
      } catch (error) {
        console.warn('❌ Erreur logout:', error)
      } finally {
        this.clearAuth()
      }
    }
  }
})