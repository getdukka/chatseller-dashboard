// composables/useBilling.ts
import { ref } from 'vue'
import { useAuthStore } from '~/stores/auth'

type SubscriptionPlan = 'free' | 'starter' | 'pro'

interface SubscriptionStatus {
  plan: SubscriptionPlan
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
        if (subscriptionData.plan === expectedPlan && subscriptionData.plan !== 'free') {
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

  return {
    loading,
    error,
    getSubscriptionStatus,
    createCheckoutSession,
    createCustomerPortal,
    waitForSubscriptionUpdate
  }
}