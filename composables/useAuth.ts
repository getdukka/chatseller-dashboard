// composables/useAuth.ts - VERSION CORRIGÉE API PURE

import { useAuthStore } from '~/stores/auth'

export const useAuth = () => {
  const authStore = useAuthStore()

  // ✅ GETTERS REACTIFS PINIA
  const user = computed(() => authStore.user)
  const isAuthenticated = computed(() => authStore.isAuthenticated)
  const isLoggedIn = computed(() => authStore.isLoggedIn)
  const loading = computed(() => authStore.loading)
  const token = computed(() => authStore.token)
  
  // ✅ ACCÈS AUX GETTERS PINIA CORRIGÉS
  const userShopId = computed(() => authStore.userShopId)
  const userEmail = computed(() => authStore.userEmail)
  const userName = computed(() => authStore.userName)
  const userInitials = computed(() => authStore.userInitials)
  const planDetails = computed(() => authStore.planDetails)
  const currentPlan = computed(() => authStore.currentPlan)
  const isPaidUser = computed(() => authStore.isPaidUser)
  const hasActiveAccess = computed(() => authStore.hasActiveAccess)
  const trialExpired = computed(() => authStore.trialExpired)

  // ✅ ACTIONS AVEC NAVIGATION INTÉGRÉE
  const login = async (credentials: { email: string; password: string }) => {
    const result = await authStore.login(credentials)
    
    // Navigation après login réussi
    if (result.success) {
      await navigateTo('/')
    }
    
    return result
  }

  const register = async (data: { 
    email: string
    password: string
    firstName: string
    lastName: string
    company?: string
    platform?: string
    newsletter?: boolean
  }) => {
    // ✅ ADAPTER LES DONNÉES POUR LE STORE
    const storeData = {
      email: data.email,
      password: data.password,
      name: `${data.firstName} ${data.lastName}`,
      firstName: data.firstName,
      lastName: data.lastName,
      company: data.company,
      platform: data.platform,
      newsletter: data.newsletter
    }
    
    const result = await authStore.register(storeData)
    
    // ✅ PAS DE NAVIGATION AUTOMATIQUE APRÈS REGISTER
    // Car l'utilisateur doit confirmer son email
    
    return result
  }

  const logout = async () => {
    await authStore.logout()
    // Navigation après logout
    await navigateTo('/login')
  }

  const resetPassword = async (email: string) => {
    return await authStore.resetPassword(email)
  }

  const updateProfile = async (data: Partial<any>) => {
    return await authStore.updateProfile(data)
  }

  const restoreSession = async () => {
    return await authStore.restoreSession()
  }

  const refreshToken = async () => {
    const result = await authStore.refreshToken()
    
    // Navigation vers login si refresh échoue
    if (!result.success) {
      await navigateTo('/login')
    }
    
    return result
  }

  // ✅ NOUVELLE FONCTION : FETCH USER DATA VIA API
  const fetchCompleteUserData = async (authUser: any): Promise<any> => {
    return await authStore.fetchCompleteUserDataViaAPI(authUser, authStore.token || '')
  }

  // ✅ UTILITAIRES
  const requireAuth = async () => {
    if (!authStore.isLoggedIn) {
      await navigateTo('/login')
      return false
    }
    return true
  }

  const requireGuest = async () => {
    if (authStore.isLoggedIn) {
      await navigateTo('/')
      return false
    }
    return true
  }

  const hasPermission = (permission: string): boolean => {
    // TODO: Implémenter la logique des permissions
    return true
  }

  const getInitials = (name?: string): string => {
    if (name) {
      return name
        .split(' ')
        .map(n => n[0])
        .join('')
        .toUpperCase()
        .slice(0, 2)
    }
    return authStore.userInitials || 'U'
  }

  // ✅ VÉRIFICATION ONBOARDING
  const needsOnboarding = (): boolean => {
    if (!authStore.user?.shop) return true
    
    const shop = authStore.user.shop
    return !shop.onboarding_completed
  }

  const checkOnboardingStatus = async (): Promise<{ needsOnboarding: boolean; redirectTo?: string }> => {
    if (!authStore.isAuthenticated) {
      return { needsOnboarding: false, redirectTo: '/login' }
    }

    if (needsOnboarding()) {
      return { needsOnboarding: true, redirectTo: '/onboarding' }
    }

    return { needsOnboarding: false }
  }

  return {
    // State - Accès aux getters Pinia via computed
    user,
    isAuthenticated,
    isLoggedIn,
    loading,
    token,
    userShopId,
    userEmail,
    userName,
    userInitials,
    planDetails,
    currentPlan,
    isPaidUser,
    hasActiveAccess,
    trialExpired,
    
    // Actions
    login,
    register,
    logout,
    resetPassword,
    updateProfile,
    restoreSession,
    refreshToken,
    fetchCompleteUserData,
    
    // Utilities
    requireAuth,
    requireGuest,
    hasPermission,
    getInitials,
    needsOnboarding,
    checkOnboardingStatus
  }
}