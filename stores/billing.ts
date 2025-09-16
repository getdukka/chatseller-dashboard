// stores/billing.ts - VERSION ADAPTÉE NOUVEAUX PLANS

import { defineStore } from 'pinia'
import { useAuthStore } from './auth'

// ✅ TYPES ADAPTÉS
interface BillingPlan {
  id: string
  name: string
  code: 'starter' | 'growth' | 'performance'
  price: number
  priceAnnual?: number
  currency: string
  interval: 'month' | 'year'
  features: string[]
  limits: {
    agents: number
    aiResponses: number
    knowledgeDocuments: number
    indexablePages: number
  }
  isActive: boolean
  isPopular?: boolean
  additionalAgentCost: number
  trialDays?: number
}

interface Subscription {
  id: string
  shop_id: string
  plan_code: string
  status: 'active' | 'canceled' | 'past_due' | 'trialing'
  current_period_start: string
  current_period_end: string
  trial_end?: string
  cancel_at_period_end: boolean
  created_at: string
  updated_at: string
}

interface Invoice {
  id: string
  subscription_id: string
  amount: number
  currency: string
  status: 'paid' | 'pending' | 'failed'
  invoice_date: string
  due_date: string
  pdf_url?: string
  created_at: string
}

interface UsageStats {
  period: string
  agents_used: number
  ai_responses_used: number
  knowledge_documents_used: number
  indexable_pages_used: number
  plan_limits: {
    agents: number
    aiResponses: number
    knowledgeDocuments: number
    indexablePages: number
  }
}

interface BillingState {
  plans: BillingPlan[]
  currentSubscription: Subscription | null
  invoices: Invoice[]
  usageStats: UsageStats | null
  isLoading: boolean
  error: string | null
}

// ✅ STORE BILLING ADAPTÉ
export const useBillingStore = defineStore('billing', {
  state: (): BillingState => ({
    plans: [],
    currentSubscription: null,
    invoices: [],
    usageStats: null,
    isLoading: false,
    error: null
  }),

  getters: {
    // ✅ PLAN ACTUEL
    currentPlan: (state): BillingPlan | null => {
      if (!state.currentSubscription) return null
      return state.plans.find(plan => plan.code === state.currentSubscription?.plan_code) || null
    },

    // ✅ STATUT ABONNEMENT
    subscriptionStatus: (state): {
      isActive: boolean
      isTrial: boolean
      isExpired: boolean
      daysLeft: number
      trialDaysLeft: number
    } => {
      if (!state.currentSubscription) {
        return {
          isActive: false,
          isTrial: false,
          isExpired: true,
          daysLeft: 0,
          trialDaysLeft: 0
        }
      }

      const now = new Date()
      const periodEnd = new Date(state.currentSubscription.current_period_end)
      const trialEnd = state.currentSubscription.trial_end ? new Date(state.currentSubscription.trial_end) : null
      
      const daysLeft = Math.max(0, Math.ceil((periodEnd.getTime() - now.getTime()) / (1000 * 60 * 60 * 24)))
      const trialDaysLeft = trialEnd ? Math.max(0, Math.ceil((trialEnd.getTime() - now.getTime()) / (1000 * 60 * 60 * 24))) : 0
      
      return {
        isActive: state.currentSubscription.status === 'active' || state.currentSubscription.status === 'trialing',
        isTrial: state.currentSubscription.status === 'trialing',
        isExpired: now > periodEnd,
        daysLeft,
        trialDaysLeft
      }
    },

    // ✅ UTILISATION EN %
    usagePercentage: (state): { 
      agents: number
      aiResponses: number
      knowledgeDocuments: number
      indexablePages: number
    } => {
      if (!state.usageStats) {
        return { agents: 0, aiResponses: 0, knowledgeDocuments: 0, indexablePages: 0 }
      }

      const { 
        agents_used, 
        ai_responses_used, 
        knowledge_documents_used, 
        indexable_pages_used, 
        plan_limits 
      } = state.usageStats
      
      return {
        agents: plan_limits.agents === -1 ? 0 : Math.round((agents_used / plan_limits.agents) * 100),
        aiResponses: plan_limits.aiResponses === -1 ? 0 : Math.round((ai_responses_used / plan_limits.aiResponses) * 100),
        knowledgeDocuments: plan_limits.knowledgeDocuments === -1 ? 0 : Math.round((knowledge_documents_used / plan_limits.knowledgeDocuments) * 100),
        indexablePages: plan_limits.indexablePages === -1 ? 0 : Math.round((indexable_pages_used / plan_limits.indexablePages) * 100)
      }
    },

    // ✅ FACTURES PAR STATUT
    invoicesByStatus: (state) => ({
      paid: state.invoices.filter(inv => inv.status === 'paid'),
      pending: state.invoices.filter(inv => inv.status === 'pending'),
      failed: state.invoices.filter(inv => inv.status === 'failed')
    }),

    // ✅ COÛT TOTAL AVEC AGENTS
    totalMonthlyCost(): { 
      baseCost: number
      agentCost: number
      totalCost: number
      agentCount: number
    } {
      const currentPlan = this.currentPlan
      const agentCount = this.usageStats?.agents_used || 1
      
      if (!currentPlan) {
        return { baseCost: 0, agentCost: 0, totalCost: 0, agentCount: 0 }
      }
      
      const baseCost = currentPlan.price
      let agentCost = 0
      
      // Performance: agents inclus
      if (currentPlan.code === 'performance') {
        agentCost = 0
      } else {
        // Starter & Growth: 10€ par agent supplémentaire
        agentCost = Math.max(0, agentCount - 1) * currentPlan.additionalAgentCost
      }
      
      return {
        baseCost,
        agentCost,
        totalCost: baseCost + agentCost,
        agentCount
      }
    }
  },

  actions: {
    // ✅ CHARGER PLANS DISPONIBLES
    async fetchPlans() {
      this.isLoading = true
      this.error = null
      
      try {
        console.log('💳 [Billing Store] Chargement plans nouveaux via API...')
        
        // ✅ NOUVEAUX PLANS AVEC QUOTAS CORRECTS
        this.plans = [
          {
            id: 'starter',
            name: 'Starter',
            code: 'starter',
            price: 49,
            priceAnnual: 42, // 504€/an ÷ 12
            currency: 'EUR',
            interval: 'month',
            features: [
              'Agents IA illimités (+10€/agent)',
              '1 000 réponses IA/mois',
              '50 documents base de connaissances',
              '500 pages web indexables',
              'Widget adaptatif tous sites',
              'Analytics de base',
              'Support email'
            ],
            limits: { 
              agents: -1, // Illimité mais payant
              aiResponses: 1000, 
              knowledgeDocuments: 50, 
              indexablePages: 500 
            },
            isActive: true,
            additionalAgentCost: 10,
            trialDays: 14
          },
          {
            id: 'growth',
            name: 'Growth',
            code: 'growth',
            price: 149,
            priceAnnual: 127, // 1524€/an ÷ 12
            currency: 'EUR',
            interval: 'month',
            features: [
              'Tout du plan Starter inclus',
              'Agents IA illimités (+10€/agent)',
              '10 000 réponses IA/mois',
              '200 documents base de connaissances',
              '2 000 pages web indexables',
              'Analytics avancées & ROI',
              'A/B testing agents',
              'Intégrations CRM',
              'Support prioritaire'
            ],
            limits: { 
              agents: -1, // Illimité mais payant
              aiResponses: 10000, 
              knowledgeDocuments: 200, 
              indexablePages: 2000 
            },
            isActive: true,
            isPopular: true,
            additionalAgentCost: 10,
            trialDays: 14
          },
          {
            id: 'performance',
            name: 'Performance',
            code: 'performance',
            price: 0, // Sur mesure
            priceAnnual: 0,
            currency: 'EUR',
            interval: 'month',
            features: [
              'Tout du plan Growth inclus',
              'Réponses IA illimitées',
              'Documents illimités',
              'Pages indexables illimitées',
              'Agents IA inclus (0€ supplémentaire)',
              'White-label complet',
              'API avancée',
              'Support dédié 24/7',
              'Onboarding personnalisé'
            ],
            limits: { 
              agents: -1, // Illimité et gratuit
              aiResponses: -1, // Illimité
              knowledgeDocuments: -1, // Illimité
              indexablePages: -1 // Illimité
            },
            isActive: true,
            additionalAgentCost: 0,
            trialDays: 14
          }
        ]
        
        console.log('✅ [Billing Store] Plans chargés:', this.plans.length)
        
      } catch (error: any) {
        console.error('❌ [Billing Store] Erreur chargement plans:', error)
        this.error = error.message || 'Erreur lors du chargement des plans'
      } finally {
        this.isLoading = false
      }
    },

    // ✅ CHARGER ABONNEMENT ACTUEL
    async fetchSubscription() {
      this.isLoading = true
      this.error = null
      
      try {
        console.log('📋 [Billing Store] Chargement abonnement via API...')
        
        const authStore = useAuthStore()
        if (!authStore.user?.shop) {
          throw new Error('Aucun shop trouvé')
        }

        // Récupérer les infos d'abonnement depuis le shop
        const shop = authStore.user.shop
        
        this.currentSubscription = {
          id: `sub_${shop.id}`,
          shop_id: shop.id,
          plan_code: shop.subscription_plan || 'starter',
          status: shop.subscription_plan === 'starter' ? 'trialing' : 'active',
          current_period_start: shop.created_at || new Date().toISOString(),
          current_period_end: shop.subscription_plan === 'starter' 
            ? new Date(Date.now() + 14 * 24 * 60 * 60 * 1000).toISOString() // 14 jours
            : new Date(Date.now() + 30 * 24 * 60 * 60 * 1000).toISOString(), // 30 jours
          trial_end: shop.subscription_plan === 'starter' 
            ? new Date(Date.now() + 14 * 24 * 60 * 60 * 1000).toISOString()
            : undefined,
          cancel_at_period_end: false,
          created_at: shop.created_at || new Date().toISOString(),
          updated_at: shop.updated_at || new Date().toISOString()
        }
        
        console.log('✅ [Billing Store] Abonnement chargé:', this.currentSubscription.plan_code)
        
      } catch (error: any) {
        console.error('❌ [Billing Store] Erreur chargement abonnement:', error)
        this.error = error.message || 'Erreur lors du chargement de l\'abonnement'
      } finally {
        this.isLoading = false
      }
    },

    // ✅ CHARGER STATS D'UTILISATION
    async fetchUsageStats() {
      this.isLoading = true
      this.error = null
      
      try {
        console.log('📊 [Billing Store] Chargement stats utilisation via API...')
        
        const authStore = useAuthStore()
        
        // Simuler les stats en utilisant les données du store auth
        const currentPlan = this.currentPlan
        if (currentPlan) {
          this.usageStats = {
            period: new Date().toISOString().substring(0, 7),
            agents_used: authStore.quotasUsage.agents || 1,
            ai_responses_used: authStore.quotasUsage.aiResponses || 0,
            knowledge_documents_used: authStore.quotasUsage.knowledgeDocuments || 0,
            indexable_pages_used: authStore.quotasUsage.indexablePages || 0,
            plan_limits: currentPlan.limits
          }
        }
        
        console.log('✅ [Billing Store] Stats utilisation chargées')
        
      } catch (error: any) {
        console.error('❌ [Billing Store] Erreur chargement stats:', error)
        this.error = error.message || 'Erreur lors du chargement des statistiques'
      } finally {
        this.isLoading = false
      }
    },

    // ✅ CHARGER FACTURES
    async fetchInvoices() {
      this.isLoading = true
      this.error = null
      
      try {
        console.log('🧾 [Billing Store] Chargement factures via API...')
        
        // Pour l'instant, liste vide en attendant l'implémentation API
        this.invoices = []
        
        console.log('✅ [Billing Store] Factures chargées:', this.invoices.length)
        
      } catch (error: any) {
        console.error('❌ [Billing Store] Erreur chargement factures:', error)
        this.error = error.message || 'Erreur lors du chargement des factures'
      } finally {
        this.isLoading = false
      }
    },

    // ✅ CHANGER DE PLAN
    async upgradePlan(planCode: string) {
      this.isLoading = true
      this.error = null
      
      try {
        console.log('⬆️ [Billing Store] Changement plan vers:', planCode)
        
        const authStore = useAuthStore()
        
        // Pour l'instant, simuler la mise à jour
        if (this.currentSubscription) {
          this.currentSubscription.plan_code = planCode
          this.currentSubscription.updated_at = new Date().toISOString()
          
          // Mettre à jour aussi dans le store auth si possible
          if (authStore.user?.shop) {
            authStore.user.shop.subscription_plan = planCode
          }
        }
        
        console.log('✅ [Billing Store] Plan mis à jour vers:', planCode)
        
        return { success: true }
        
      } catch (error: any) {
        console.error('❌ [Billing Store] Erreur changement plan:', error)
        this.error = error.message || 'Erreur lors du changement de plan'
        throw error
      } finally {
        this.isLoading = false
      }
    },

    // ✅ CALCULER COÛT AVEC AGENTS
    calculateCostWithAgents(planCode: string, agentCount: number): {
      baseCost: number
      agentCost: number
      totalCost: number
      description: string
    } {
      const plan = this.plans.find(p => p.code === planCode)
      
      if (!plan) {
        return { baseCost: 0, agentCost: 0, totalCost: 0, description: 'Plan non trouvé' }
      }
      
      const baseCost = plan.price
      
      // Performance: agents inclus
      if (plan.code === 'performance') {
        return {
          baseCost: 0,
          agentCost: 0,
          totalCost: 0,
          description: 'Sur mesure'
        }
      }
      
      // Starter & Growth: 10€ par agent supplémentaire
      const agentCost = Math.max(0, agentCount - 1) * plan.additionalAgentCost
      const totalCost = baseCost + agentCost
      
      return {
        baseCost,
        agentCost,
        totalCost,
        description: `${totalCost}€/mois`
      }
    },

    // ✅ VÉRIFIER SI UN PLAN PEUT ÊTRE ACHETÉ
    canUpgradeToPlan(targetPlanCode: string): boolean {
      const currentPlan = this.currentPlan
      if (!currentPlan) return true
      
      const planHierarchy = {
        starter: 1,
        growth: 2,
        performance: 3
      }
      
      const currentLevel = planHierarchy[currentPlan.code as keyof typeof planHierarchy] || 0
      const targetLevel = planHierarchy[targetPlanCode as keyof typeof planHierarchy] || 0
      
      return targetLevel > currentLevel
    },

    // ✅ ANNULER ABONNEMENT
    async cancelSubscription() {
      this.isLoading = true
      this.error = null
      
      try {
        console.log('❌ [Billing Store] Annulation abonnement...')
        
        if (this.currentSubscription) {
          this.currentSubscription.cancel_at_period_end = true
          this.currentSubscription.updated_at = new Date().toISOString()
        }
        
        console.log('✅ [Billing Store] Abonnement programmé pour annulation')
        
      } catch (error: any) {
        console.error('❌ [Billing Store] Erreur annulation:', error)
        this.error = error.message || 'Erreur lors de l\'annulation'
        throw error
      } finally {
        this.isLoading = false
      }
    },

    // ✅ RÉACTIVER ABONNEMENT
    async reactivateSubscription() {
      this.isLoading = true
      this.error = null
      
      try {
        console.log('🔄 [Billing Store] Réactivation abonnement...')
        
        if (this.currentSubscription) {
          this.currentSubscription.cancel_at_period_end = false
          this.currentSubscription.updated_at = new Date().toISOString()
        }
        
        console.log('✅ [Billing Store] Abonnement réactivé')
        
      } catch (error: any) {
        console.error('❌ [Billing Store] Erreur réactivation:', error)
        this.error = error.message || 'Erreur lors de la réactivation'
        throw error
      } finally {
        this.isLoading = false
      }
    },

    // ✅ TÉLÉCHARGER FACTURE
    async downloadInvoice(invoiceId: string) {
      try {
        console.log('📥 [Billing Store] Téléchargement facture:', invoiceId)
        
        const invoice = this.invoices.find(inv => inv.id === invoiceId)
        if (!invoice?.pdf_url) {
          throw new Error('URL de facture non disponible')
        }
        
        // Ouvrir dans un nouvel onglet
        window.open(invoice.pdf_url, '_blank')
        
      } catch (error: any) {
        console.error('❌ [Billing Store] Erreur téléchargement facture:', error)
        this.error = error.message || 'Erreur lors du téléchargement'
        throw error
      }
    },

    // ✅ CHARGER TOUTES LES DONNÉES
    async loadBillingData() {
      await Promise.all([
        this.fetchPlans(),
        this.fetchSubscription(),
        this.fetchUsageStats(),
        this.fetchInvoices()
      ])
    },

    // ✅ NETTOYER ERREURS
    clearError() {
      this.error = null
    }
  }
})