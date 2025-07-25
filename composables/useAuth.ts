// composables/useAuth.ts - COMPOSABLE AUTH COMPATIBLE FINAL

import { useAuthStore } from '~/stores/auth'

export const useAuth = () => {
  const authStore = useAuthStore()

  // ✅ GETTERS PINIA SONT DÉJÀ REACTIFS - PAS BESOIN DE COMPUTED()
  const user = computed(() => authStore.user)
  const isAuthenticated = computed(() => authStore.isAuthenticated)
  const isLoggedIn = computed(() => authStore.isLoggedIn)
  const loading = computed(() => authStore.loading)
  const token = computed(() => authStore.token)
  
  // ✅ CORRECTION CRITIQUE : Accès direct aux getters Pinia
  const userShopId = computed(() => authStore.userShopId)
  const userEmail = computed(() => authStore.userEmail)
  const userName = computed(() => authStore.userName)

  // ✅ ACTIONS - AVEC NAVIGATION INTÉGRÉE
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
    company: string
    platform?: string
    newsletter?: boolean
  }) => {
    // ✅ ADAPTER LES DONNÉES POUR LE STORE
    const storeData = {
      email: data.email,
      password: data.password,
      name: `${data.firstName} ${data.lastName}` // Combiner prénom et nom
    }
    
    const result = await authStore.register(storeData)
    
    // Navigation après inscription réussie
    if (result.success) {
      await navigateTo('/')
    }
    
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
    if (!name) return authStore.userInitials || 'U'
    return name
      .split(' ')
      .map(n => n[0])
      .join('')
      .toUpperCase()
      .slice(0, 2)
  }

  return {
    // State - Access Pinia getters directly through computed
    user,
    isAuthenticated,
    isLoggedIn,
    loading,
    token,
    userShopId,
    userEmail,
    userName,
    
    // Actions
    login,
    register,
    logout,
    resetPassword,
    updateProfile,
    restoreSession,
    refreshToken,
    
    // Utilities
    requireAuth,
    requireGuest,
    hasPermission,
    getInitials
  }
}