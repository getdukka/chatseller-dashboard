// stores/billing.ts - VERSION API PURE

import { defineStore } from 'pinia'
import { useAuthStore } from './auth'

// ✅ TYPES
interface BillingPlan {
  id: string
  name: string
  code: 'free' | 'starter' | 'pro' | 'enterprise'
  price: number
  currency: string
  interval: 'month' | 'year'
  features: string[]
  limits: {
    agents: number
    conversations: number
    knowledgeBase: number
  }
  isActive: boolean
  isPopular?: boolean
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
  conversations_used: number
  knowledge_base_used: number 
  plan_limits: {
    agents: number
    conversations: number
    knowledgeBase: number   
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

// ✅ STORE BILLING
export const useBilling = defineStore('billing', {
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
    usagePercentage: (state): { agents: number; conversations: number; knowledgeBase: number } => {
  if (!state.usageStats) {
    return { agents: 0, conversations: 0, knowledgeBase: 0 }
  }

  const { agents_used, conversations_used, knowledge_base_used, plan_limits } = state.usageStats
  
  return {
    agents: plan_limits.agents === -1 ? 0 : Math.round((agents_used / plan_limits.agents) * 100),
    conversations: plan_limits.conversations === -1 ? 0 : Math.round((conversations_used / plan_limits.conversations) * 100),
    knowledgeBase: plan_limits.knowledgeBase === -1 ? 0 : Math.round((knowledge_base_used / plan_limits.knowledgeBase) * 100) 
  }
},

    // ✅ FACTURES PAR STATUT
    invoicesByStatus: (state) => ({
      paid: state.invoices.filter(inv => inv.status === 'paid'),
      pending: state.invoices.filter(inv => inv.status === 'pending'),
      failed: state.invoices.filter(inv => inv.status === 'failed')
    })
  },

  actions: {
    // ✅ CHARGER PLANS DISPONIBLES
    async fetchPlans() {
      this.isLoading = true
      this.error = null
      
      try {
        console.log('💳 [Billing Store] Chargement plans via API...')
        
        // Note: Route à implémenter côté API
        const api = useApi()
        
        // Pour l'instant, définir les plans en dur en attendant l'API
        this.plans = [
          {
            id: 'free',
            name: 'Essai Gratuit',
            code: 'free',
            price: 0,
            currency: 'EUR',
            interval: 'month',
            features: ['7 jours gratuit', '1 agent IA', '1000 conversations/mois', '10 documents max'],
            limits: { agents: 1, conversations: 1000, knowledgeBase: 10 },
            isActive: true
          },
          {
            id: 'starter',
            name: 'Starter',
            code: 'starter',
            price: 29,
            currency: 'EUR',
            interval: 'month',
            features: ['1 Vendeur IA spécialisé', '1000 conversations/mois', '10 documents max', 'Analytics de base', 'Support email'],
            limits: { agents: 1, conversations: 1000, knowledgeBase: 10 },
            isActive: true
          },
          {
            id: 'pro',
            name: 'Pro',
            code: 'pro',
            price: 79,
            currency: 'EUR',
            interval: 'month',
            features: ['3 Vendeurs IA', 'Conversations illimitées', '50 documents max', 'Analytics avancées & ROI', 'Upsell & FOMO', 'Support prioritaire'],
            limits: { agents: 3, conversations: -1, knowledgeBase: 50 },
            isActive: true,
            isPopular: true
          },
          {
            id: 'enterprise',
            name: 'Enterprise',
            code: 'enterprise',
            price: 199,
            currency: 'EUR',
            interval: 'month',
            features: ['Vendeurs IA illimités', 'Documents illimités', 'Analytics complètes', 'White-label', 'Support dédié', 'API avancée'],
            limits: { agents: -1, conversations: -1, knowledgeBase: -1 },
            isActive: true
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
          plan_code: shop.subscription_plan || 'free',
          status: shop.subscription_plan === 'free' ? 'trialing' : 'active',
          current_period_start: shop.created_at || new Date().toISOString(),
          current_period_end: shop.subscription_plan === 'free' 
            ? new Date(Date.now() + 7 * 24 * 60 * 60 * 1000).toISOString() // 7 jours
            : new Date(Date.now() + 30 * 24 * 60 * 60 * 1000).toISOString(), // 30 jours
          trial_end: shop.subscription_plan === 'free' 
            ? new Date(Date.now() + 7 * 24 * 60 * 60 * 1000).toISOString()
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
        
        // Note: Routes à implémenter côté API
        const api = useApi()
        
        // Simuler les stats pour l'instant
        const currentPlan = this.currentPlan
        if (currentPlan) {
          this.usageStats = {
            period: new Date().toISOString().substring(0, 7),
            agents_used: 1, 
            conversations_used: 0, 
            knowledge_base_used: 0, 
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
        
        // Note: Routes à implémenter côté API
        // Pour l'instant, liste vide
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
        const result = await authStore.updateSubscriptionPlan(planCode)
        
        if (!result.success) {
          throw new Error(result.error || 'Erreur lors du changement de plan')
        }
        
        // Mettre à jour l'abonnement local
        if (this.currentSubscription) {
          this.currentSubscription.plan_code = planCode
          this.currentSubscription.updated_at = new Date().toISOString()
        }
        
        console.log('✅ [Billing Store] Plan mis à jour vers:', planCode)
        
        return result
        
      } catch (error: any) {
        console.error('❌ [Billing Store] Erreur changement plan:', error)
        this.error = error.message || 'Erreur lors du changement de plan'
        throw error
      } finally {
        this.isLoading = false
      }
    },

    // ✅ ANNULER ABONNEMENT
    async cancelSubscription() {
      this.isLoading = true
      this.error = null
      
      try {
        console.log('❌ [Billing Store] Annulation abonnement...')
        
        // Note: Route à implémenter côté API
        const api = useApi()
        
        // Pour l'instant, simuler l'annulation
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
        
        // Note: Route à implémenter côté API
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
        
        // Note: Route à implémenter côté API
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