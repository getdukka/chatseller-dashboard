// composables/useBilling.ts - VERSION ADAPTÉE NOUVEAUX PLANS
import { ref } from 'vue'
import { useAuthStore } from '~/stores/auth'

// ✅ NOUVEAUX TYPES PLANS
type SubscriptionPlan = 'starter' | 'growth' | 'performance'

interface SubscriptionStatus {
  plan: SubscriptionPlan
  isPaid: boolean
  isActive: boolean
  trialDaysLeft: number
  trialEndDate: string
  nextBillingDate: string
}

export const useBilling = () => {
  const authStore = useAuthStore()
  const config = useRuntimeConfig()

  const loading = ref(false)
  const error = ref<string | null>(null)

  // ✅ FONCTION DE POLLING INTELLIGENT
  const waitForSubscriptionUpdate = async (
    expectedPlan: SubscriptionPlan,
    maxRetries: number = 12,
    delayMs: number = 3000
  ): Promise<boolean> => {
    console.log(`🔄 Démarrage polling pour plan: ${expectedPlan}`)
    
    for (let attempt = 1; attempt <= maxRetries; attempt++) {
      console.log(`🔄 Tentative ${attempt}/${maxRetries}...`)
      
      try {
        // 1. Forcer la synchronisation du store auth
        await authStore.restoreSession()
        
        // 2. Vérifier directement via l'API
        const subscriptionData = await getSubscriptionStatus()
        
        console.log(`📋 Plan actuel: ${subscriptionData.plan}`)
        
        // 3. Vérifier si le plan a été mis à jour
        // Pour starter→starter (essai→payant), on vérifie isPaid au lieu du plan
        if (expectedPlan === 'starter') {
          if (subscriptionData.isPaid) {
            console.log(`✅ Conversion essai→payant confirmée (isPaid=true)`)
            return true
          }
        } else if (subscriptionData.plan === expectedPlan) {
          console.log(`✅ Plan mis à jour avec succès: ${subscriptionData.plan}`)
          return true
        }
        
        // 4. Attendre avant le prochain essai (sauf pour le dernier)
        if (attempt < maxRetries) {
          console.log(`⏳ Attente ${delayMs/1000}s avant retry...`)
          await new Promise(resolve => setTimeout(resolve, delayMs))
        }
        
      } catch (error) {
        console.error(`❌ Erreur tentative ${attempt}:`, error)
        
        if (attempt < maxRetries) {
          await new Promise(resolve => setTimeout(resolve, delayMs))
        }
      }
    }
    
    console.warn('⚠️ Timeout: Plan pas mis à jour après tous les retries')
    return false
  }

  // ✅ RÉCUPÉRER LE STATUT D'ABONNEMENT
  const getSubscriptionStatus = async (): Promise<SubscriptionStatus> => {
    if (!authStore.token) {
      throw new Error('Token d\'authentification manquant')
    }

    const response = await $fetch(`${config.public.apiBaseUrl}/api/v1/billing/subscription-status`, {
      headers: {
        Authorization: `Bearer ${authStore.token}`
      }
    }) as any

    if (!response.success) {
      throw new Error(response.error || 'Erreur lors de la récupération du statut')
    }

    return {
      plan: response.subscription.plan as SubscriptionPlan,
      isPaid: response.subscription.isPaid ?? false,
      isActive: response.subscription.isActive,
      trialDaysLeft: response.subscription.trialDaysLeft || 0,
      trialEndDate: response.subscription.trialEndDate || '',
      nextBillingDate: response.subscription.nextBillingDate || ''
    }
  }

  // ✅ CRÉER UNE SESSION DE PAIEMENT
  const createCheckoutSession = async (
    plan: SubscriptionPlan,
    successUrl: string,
    cancelUrl: string
  ) => {
    loading.value = true
    error.value = null

    try {
      const response = await $fetch(`${config.public.apiBaseUrl}/api/v1/billing/create-checkout-session`, {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${authStore.token}`,
          'Content-Type': 'application/json'
        },
        body: {
          plan,
          successUrl,
          cancelUrl
        }
      }) as any

      if (!response.success) {
        throw new Error(response.error || 'Erreur lors de la création de la session')
      }

      return response
    } catch (err: any) {
      error.value = err.message
      throw err
    } finally {
      loading.value = false
    }
  }

  // ✅ CRÉER LE CUSTOMER PORTAL STRIPE
  const createCustomerPortal = async () => {
    loading.value = true
    error.value = null

    try {
      const response = await $fetch(`${config.public.apiBaseUrl}/api/v1/billing/customer-portal`, {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${authStore.token}`,
          'Content-Type': 'application/json'
        },
        body: {
          returnUrl: window.location.origin + '/billing'
        }
      }) as any

      if (!response.success) {
        throw new Error(response.error || 'Erreur lors de la création du portail')
      }

      return response
    } catch (err: any) {
      error.value = err.message
      throw err
    } finally {
      loading.value = false
    }
  }

  // ✅ CALCULER LE COÛT TOTAL AVEC AGENTS
  const calculateTotalCost = (plan: SubscriptionPlan, agentCount: number = 1) => {
    // Prix de base des plans
    const basePrices: Record<SubscriptionPlan, number> = {
      starter: 45,
      growth: 145,
      performance: 0 // Sur mesure
    }
    
    const basePrice = basePrices[plan]
    
    // Performance : agents inclus
    if (plan === 'performance') {
      return {
        basePrice: 0,
        agentCost: 0,
        totalPrice: 0,
        description: 'Sur mesure'
      }
    }
    
    // Starter & Growth : 10€ par agent supplémentaire
    const agentCost = Math.max(0, agentCount - 1) * 10
    const totalPrice = basePrice + agentCost
    
    return {
      basePrice,
      agentCost,
      totalPrice,
      description: `${totalPrice}€/mois`
    }
  }

  // ✅ VÉRIFIER SI UN PLAN PEUT ÊTRE ACHETÉ
  const canSubscribeToPlan = (targetPlan: SubscriptionPlan, currentPlan: SubscriptionPlan): boolean => {
    const planHierarchy = {
      starter: 1,
      growth: 2,
      performance: 3
    }
    
    return planHierarchy[targetPlan] > planHierarchy[currentPlan]
  }

  // ✅ OBTENIR LES INFORMATIONS D'UN PLAN
  const getPlanInfo = (plan: SubscriptionPlan) => {
    const planInfos = {
      starter: {
        name: 'Starter',
        price: 45,
        priceAnnual: 38, // 456€/an ÷ 12
        currency: 'EUR',
        interval: 'month',
        trialDays: 14,
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
          aiResponses: 1000,
          knowledgeDocuments: 50,
          indexablePages: 500,
          agents: -1 // Illimité mais payant
        },
        color: 'rose'
      },
      growth: {
        name: 'Growth',
        price: 145,
        priceAnnual: 123, // 1476€/an ÷ 12
        currency: 'EUR',
        interval: 'month',
        trialDays: 14,
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
          aiResponses: 10000,
          knowledgeDocuments: 200,
          indexablePages: 2000,
          agents: -1 // Illimité mais payant
        },
        color: 'purple'
      },
      performance: {
        name: 'Performance',
        price: 0, // Sur mesure
        priceAnnual: 0,
        currency: 'EUR',
        interval: 'month',
        trialDays: 14,
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
          aiResponses: -1, // Illimité
          knowledgeDocuments: -1, // Illimité
          indexablePages: -1, // Illimité
          agents: -1 // Illimité et gratuit
        },
        color: 'gray'
      }
    }
    
    return planInfos[plan]
  }

  // ✅ FORMATER LE PRIX D'AFFICHAGE
  const formatPrice = (plan: SubscriptionPlan, isAnnual: boolean = false): string => {
    const info = getPlanInfo(plan)
    
    if (plan === 'performance') {
      return 'Sur mesure'
    }
    
    const price = isAnnual ? info.priceAnnual : info.price
    return `${price}€/mois`
  }

  // ✅ VÉRIFIER SI UN PLAN EST GRATUIT/TRIAL
  const isPlanTrial = (plan: SubscriptionPlan, trialDaysLeft: number): boolean => {
    return plan === 'starter' && trialDaysLeft > 0
  }

  return {
    loading,
    error,
    getSubscriptionStatus,
    createCheckoutSession,
    createCustomerPortal,
    waitForSubscriptionUpdate,
    calculateTotalCost,
    canSubscribeToPlan,
    getPlanInfo,
    formatPrice,
    isPlanTrial
  }
}