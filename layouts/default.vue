<!-- layouts/default.vue - VERSION CORRIGÉE COMPLÈTE -->
<template>
  <div class="min-h-screen">
    
    <!-- DESKTOP SIDEBAR -->
    <div class="hidden lg:fixed lg:inset-y-0 lg:left-0 lg:z-50 lg:block lg:w-64 lg:bg-white lg:shadow-xl lg:border-r lg:border-gray-100">
      <SidebarContent
        :unreadCount="unreadConversationsCount"
        :userName="userName"
        :userEmail="userEmail"
        :userInitials="userInitials"
        :showProfileMenu="showProfileMenu"
        :userSubscriptionPlan="subscriptionInfo.plan"
        :userSubscriptionActive="subscriptionInfo.isActive"
        :trialDaysLeft="subscriptionInfo.trialDaysLeft"
        :agentName="agentName"
        @toggle-profile="toggleProfileMenu"
        @close-profile="closeProfileMenu"
        @logout="handleLogout"
        @upgrade-to-plan="handleUpgradeToPlan"
      />
    </div>

    <!-- MOBILE OVERLAY -->
    <div
      v-if="mobileMenuOpen"
      class="fixed inset-0 z-50 lg:hidden"
      @click.self="closeMobileMenu"
    >
      <!-- Background overlay -->
      <div class="fixed inset-0 bg-gray-900 bg-opacity-50 backdrop-blur-sm"></div>

      <!-- Mobile sidebar -->
      <Transition
        enter-active-class="transition ease-out duration-300"
        enter-from-class="transform -translate-x-full"
        enter-to-class="transform translate-x-0"
        leave-active-class="transition ease-in duration-200"
        leave-from-class="transform translate-x-0"
        leave-to-class="transform -translate-x-full"
      >
        <div v-if="mobileMenuOpen" class="fixed inset-y-0 left-0 z-50 w-64 bg-white shadow-xl">
          <SidebarContent
            :unreadCount="unreadConversationsCount"
            :userName="userName"
            :userEmail="userEmail"
            :userInitials="userInitials"
            :showProfileMenu="showProfileMenu"
            :userSubscriptionPlan="subscriptionInfo.plan"
            :userSubscriptionActive="subscriptionInfo.isActive"
            :trialDaysLeft="subscriptionInfo.trialDaysLeft"
            :agentName="agentName"
            :isMobile="true"
            @toggle-profile="toggleProfileMenu"
            @close-profile="closeProfileMenu"
            @logout="handleLogout"
            @close-mobile="closeMobileMenu"
            @upgrade-to-plan="handleUpgradeToPlan"
          />
        </div>
      </Transition>
    </div>

    <!-- MOBILE HEADER -->
    <div class="lg:hidden sticky top-0 z-40 bg-white border-b border-gray-200 px-4 py-3">
      <div class="flex items-center justify-between">
        <!-- Mobile menu button -->
        <button
          @click="toggleMobileMenu"
          class="inline-flex items-center justify-center p-2 rounded-xl text-gray-600 hover:text-gray-900 hover:bg-gray-100 focus:outline-none focus:ring-2 focus:ring-rose-500 transition-all duration-200"
        >
          <span class="sr-only">{{ mobileMenuOpen ? 'Fermer le menu' : 'Ouvrir le menu' }}</span>
          <Transition
            enter-active-class="transition-all duration-200"
            enter-from-class="rotate-180 opacity-0"
            enter-to-class="rotate-0 opacity-100"
            leave-active-class="transition-all duration-200"
            leave-from-class="rotate-0 opacity-100"
            leave-to-class="rotate-180 opacity-0"
            mode="out-in"
          >
            <svg v-if="!mobileMenuOpen" class="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M4 6h16M4 12h16M4 18h16" />
            </svg>
            <svg v-else class="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12" />
            </svg>
          </Transition>
        </button>

        <!-- Mobile logo -->
        <div class="flex items-center space-x-3">
          <div class="flex h-8 w-8 items-center justify-center rounded-xl bg-gradient-to-br from-rose-600 to-rose-700 shadow-lg">
            <span class="text-xs font-bold text-white">CS</span>
          </div>
          <span class="text-lg font-bold text-gray-900">ChatSeller</span>
        </div>

        <!-- Badges abonnement mobile -->
        <div class="flex items-center space-x-2">
          <!-- Badge Plan Growth Actif -->
          <div v-if="subscriptionInfo.plan === 'growth' && subscriptionInfo.isActive" class="flex items-center space-x-1 px-2 py-1 bg-green-50 border border-green-200 rounded-lg">
            <div class="w-1.5 h-1.5 bg-green-500 rounded-full"></div>
            <span class="text-xs font-medium text-green-700">Growth</span>
          </div>
          
          <!-- Badge Plan Starter Actif -->
          <div v-else-if="subscriptionInfo.plan === 'starter' && subscriptionInfo.isActive" class="flex items-center space-x-1 px-2 py-1 bg-rose-50 border border-rose-200 rounded-lg">
            <div class="w-1.5 h-1.5 bg-rose-500 rounded-full"></div>
            <span class="text-xs font-medium text-rose-700">Starter</span>
          </div>
          
          <!-- Badge Essai gratuit -->
          <div v-else-if="subscriptionInfo.trialDaysLeft > 0" class="flex items-center space-x-1 px-2 py-1 bg-rose-50 border border-rose-200 rounded-lg">
            <div class="w-1.5 h-1.5 bg-rose-500 rounded-full animate-pulse"></div>
            <span class="text-xs font-medium text-rose-700">{{ subscriptionInfo.trialDaysLeft }}j</span>
          </div>

          <!-- Badge Expiré -->
          <div v-else class="flex items-center space-x-1 px-2 py-1 bg-red-50 border border-red-200 rounded-lg">
            <div class="w-1.5 h-1.5 bg-red-500 rounded-full"></div>
            <span class="text-xs font-medium text-red-700">Expiré</span>
          </div>

          <!-- Mobile user avatar -->
          <button 
            @click="toggleMobileProfileMenu"
            class="relative"
            data-mobile-profile
          >
            <div class="flex h-8 w-8 items-center justify-center rounded-full bg-gradient-to-br from-rose-500 to-rose-600 shadow-md">
              <span class="text-xs font-semibold text-white">
                {{ userInitials }}
              </span>
            </div>
            
            <!-- Mobile profile dropdown -->
            <Transition
              enter-active-class="transition ease-out duration-200"
              enter-from-class="transform opacity-0 scale-95"
              enter-to-class="transform opacity-100 scale-100"
              leave-active-class="transition ease-in duration-75"
              leave-from-class="transform opacity-100 scale-100"
              leave-to-class="transform opacity-0 scale-95"
            >
              <div 
                v-if="showMobileProfileMenu"
                class="absolute right-0 top-10 mt-2 w-48 bg-white rounded-xl shadow-lg border border-gray-100 py-2"
                data-mobile-profile
              >
                <div class="px-4 py-3 border-b border-gray-100">
                  <p class="text-sm font-medium text-gray-900">{{ userName || 'Utilisateur' }}</p>
                  <p class="text-xs text-gray-500">{{ userEmail || 'email@exemple.com' }}</p>
                </div>
                
                <NuxtLink 
                  to="/settings?tab=compte" 
                  class="flex items-center px-4 py-2 text-sm text-gray-700 hover:bg-gray-50 transition-colors"
                  @click="closeMobileProfileMenu"
                >
                  <svg class="mr-3 h-4 w-4 text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
                  </svg>
                  Mon profil
                </NuxtLink>
                
                <NuxtLink 
                  to="/billing" 
                  class="flex items-center px-4 py-2 text-sm text-gray-700 hover:bg-gray-50 transition-colors"
                  @click="closeMobileProfileMenu"
                >
                  <svg class="mr-3 h-4 w-4 text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M3 10h18M7 15h1m4 0h1m-7 4h12a3 3 0 003-3V8a3 3 0 00-3-3H6a3 3 0 00-3 3v8a3 3 0 003 3z" />
                  </svg>
                  Facturation
                </NuxtLink>
                
                <!-- Boutons upgrade mobile adaptatifs -->
                <button
                  v-if="subscriptionInfo.plan === 'starter' && subscriptionInfo.trialDaysLeft <= 0"
                  @click="handleUpgradeToPlan('starter')"
                  :disabled="upgradingToPlan === 'starter'"
                  class="w-full flex items-center px-4 py-2 text-sm text-rose-600 hover:bg-rose-50 transition-colors disabled:opacity-50"
                >
                  <svg class="mr-3 h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M13 10V3L4 14h7v7l9-11h-7z"/>
                  </svg>
                  {{ upgradingToPlan === 'starter' ? 'Redirection...' : `Réactiver ${agentName} Découverte` }}
                </button>

                <button
                  v-else-if="subscriptionInfo.plan === 'starter' && subscriptionInfo.isActive"
                  @click="handleUpgradeToPlan('growth')"
                  :disabled="upgradingToPlan === 'growth'"
                  class="w-full flex items-center px-4 py-2 text-sm text-purple-600 hover:bg-purple-50 transition-colors disabled:opacity-50"
                >
                  <svg class="mr-3 h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M5 3v4M3 5h4M6 17v4m-2-2h4m5-16l2.286 6.857L21 12l-5.714 2.143L13 21l-2.286-6.857L5 12l5.714-2.143L13 3z"/>
                  </svg>
                  {{ upgradingToPlan === 'growth' ? 'Redirection...' : `Passer ${agentName} en Pro` }}
                </button>
                
                <button
                  @click="handleLogout"
                  class="w-full flex items-center px-4 py-2 text-sm text-red-600 hover:bg-red-50 transition-colors"
                >
                  <svg class="mr-3 h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1" />
                  </svg>
                  Se déconnecter
                </button>
              </div>
            </Transition>
          </button>
        </div>
      </div>
    </div>

    <!-- ZONE DE CONTENU PRINCIPALE -->
    <div class="lg:pl-64">
      <main class="min-h-screen">
        <slot />
      </main>
    </div>

    <!-- LOADING OVERLAY POUR UPGRADE -->
    <div v-if="upgradingToPlan" class="fixed inset-0 z-50 bg-gray-900 bg-opacity-50 backdrop-blur-sm flex items-center justify-center">
      <div class="bg-white rounded-xl shadow-xl p-8 max-w-sm w-full mx-4">
        <div class="text-center">
          <div class="w-16 h-16 bg-rose-100 rounded-full flex items-center justify-center mx-auto mb-4">
            <svg class="animate-spin w-8 h-8 text-rose-600" fill="none" viewBox="0 0 24 24">
              <circle class="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" stroke-width="4"></circle>
              <path class="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
            </svg>
          </div>
          <h3 class="text-lg font-semibold text-gray-900 mb-2">Redirection vers Stripe</h3>
          <p class="text-gray-600">Préparation de votre session de paiement {{ upgradingToPlan }}...</p>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, computed, watch, onMounted, onUnmounted } from 'vue'
import { useAuthStore } from '~~/stores/auth'

// Types
type SubscriptionPlan = 'starter' | 'growth' | 'performance'

interface SubscriptionInfo {
  plan: SubscriptionPlan
  isActive: boolean
  trialDaysLeft: number
}

// Composables
const authStore = useAuthStore()
const config = useRuntimeConfig()
const api = useApi()
const route = useRoute()

// États locaux
const mobileMenuOpen = ref(false)
const showProfileMenu = ref(false)
const showMobileProfileMenu = ref(false)
const upgradingToPlan = ref<'starter' | 'growth' | null>(null)
const agentName = ref('Mia')

// État pour les conversations non lues
const unreadConversationsCount = ref(0)
const loadingConversations = ref(false)

// Données d'abonnement - CORRIGÉ avec les nouveaux plans
const subscriptionInfo = ref<SubscriptionInfo>({
  plan: 'starter',
  isActive: false,
  trialDaysLeft: 14
})

// Computed properties pour les données utilisateur
const userName = computed(() => authStore.userName || 'Utilisateur')
const userEmail = computed(() => authStore.userEmail || 'email@exemple.com')  
const userInitials = computed(() => authStore.userInitials || 'U')

// FONCTION SIMPLIFIÉE POUR CHARGER LES CONVERSATIONS VIA API
const loadUnreadConversations = async () => {
  if (!authStore.userShopId || loadingConversations.value) {
    return
  }

  try {
    loadingConversations.value = true
    const response = await api.conversations.list()
    
    if (response.success && response.data) {
      const unreadCount = response.data.filter(conv => 
        conv.status === 'new' || conv.status === 'active'
      ).length
      
      unreadConversationsCount.value = unreadCount
    } else {
      unreadConversationsCount.value = 0
    }
  } catch (error) {
    console.error('[Layout] Erreur loading conversations:', error)
    unreadConversationsCount.value = 0
  } finally {
    loadingConversations.value = false
  }
}

// FONCTIONS DE GESTION MOBILE MENU SIMPLIFIÉES
const toggleMobileMenu = () => {
  mobileMenuOpen.value = !mobileMenuOpen.value
  if (mobileMenuOpen.value) {
    showMobileProfileMenu.value = false
  }
}

const closeMobileMenu = () => {
  mobileMenuOpen.value = false
}

// FONCTIONS DE GESTION PROFILE MENU SIMPLIFIÉES
const toggleProfileMenu = () => {
  showProfileMenu.value = !showProfileMenu.value
}

const closeProfileMenu = () => {
  showProfileMenu.value = false
}

const toggleMobileProfileMenu = () => {
  showMobileProfileMenu.value = !showMobileProfileMenu.value
}

const closeMobileProfileMenu = () => {
  showMobileProfileMenu.value = false
}

// FONCTION UPGRADE SIMPLIFIÉE - CORRIGÉE POUR NOUVEAUX PLANS
const handleUpgradeToPlan = async (targetPlan: 'starter' | 'growth') => {
  console.log(`[Layout] Initiation upgrade vers ${targetPlan}`)

  upgradingToPlan.value = targetPlan
  showMobileProfileMenu.value = false
  showProfileMenu.value = false

  // Vérifier le token avant l'appel API
  if (!authStore.token) {
    console.error('[Layout] Token manquant, rafraîchissement...')
    try {
      await authStore.refreshToken()
    } catch {
      upgradingToPlan.value = null
      navigateTo('/login')
      return
    }
  }

  try {
    const response = await $fetch(`${config.public.apiBaseUrl}/api/v1/billing/create-checkout-session`, {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${authStore.token}`,
        'Content-Type': 'application/json'
      },
      body: {
        plan: targetPlan,
        successUrl: `${window.location.origin}/billing?success=true&plan=${targetPlan}`,
        cancelUrl: `${window.location.origin}/billing?cancelled=true`
      }
    })

    if (response.success && response.checkoutUrl) {
      window.location.href = response.checkoutUrl
    } else {
      throw new Error(response.error || 'Impossible de créer la session de paiement')
    }

  } catch (error: any) {
    console.error(`[Layout] Erreur upgrade vers ${targetPlan}:`, error)
    upgradingToPlan.value = null

    const errorMsg = error?.data?.error || error?.message || `Erreur lors de l'upgrade`
    if (errorMsg.includes('Token') || errorMsg.includes('authentification')) {
      navigateTo('/login')
    } else {
      alert(errorMsg)
    }
  }
}

// FONCTION POUR CHARGER LES INFOS D'ABONNEMENT - CORRIGÉE
const loadSubscriptionInfo = async () => {
  try {
    const planDetails = authStore.planDetails
    
    // CORRECTION : Utiliser hasActiveAccess au lieu de isActive
    subscriptionInfo.value = {
      plan: planDetails.code as SubscriptionPlan,
      isActive: authStore.hasActiveAccess, // CORRIGÉ
      trialDaysLeft: planDetails.trialDaysLeft
    }
  } catch (error) {
    console.error('[Layout] Erreur subscription info:', error)
    // Fallback sécurisé
    subscriptionInfo.value = {
      plan: 'starter',
      isActive: true,
      trialDaysLeft: 14
    }
  }
}

// FONCTION DE DÉCONNEXION
const handleLogout = async () => {
  showProfileMenu.value = false
  showMobileProfileMenu.value = false
  closeMobileMenu()
  await authStore.logout()
  await navigateTo('/login')
}

// GESTION DES CLICS EXTÉRIEURS SIMPLIFIÉE
const handleClickOutside = (event: Event) => {
  const target = event.target as Element
  
  // Fermer seulement le menu mobile profile si click extérieur
  if (showMobileProfileMenu.value && !target.closest('[data-mobile-profile]')) {
    showMobileProfileMenu.value = false
  }
}

// GESTION DU SCROLL BODY
const updateBodyScroll = () => {
  if (mobileMenuOpen.value) {
    document.body.style.overflow = 'hidden'
  } else {
    document.body.style.overflow = ''
  }
}

// WATCHERS SIMPLIFIÉS - CORRIGÉS
watch(mobileMenuOpen, (newValue) => {
  document.body.style.overflow = newValue ? 'hidden' : ''
})

watch(() => authStore.isAuthenticated, async (isAuth) => {
  if (isAuth && authStore.token) {
    await loadSubscriptionInfo()
    await loadUnreadConversations()
  }
}, { immediate: false })

// WATCHER PLAN DETAILS CORRIGÉ
watch(() => authStore.planDetails, (newPlanDetails) => {
  subscriptionInfo.value = {
    plan: newPlanDetails.code as SubscriptionPlan,
    isActive: authStore.hasActiveAccess, // CORRIGÉ
    trialDaysLeft: newPlanDetails.trialDaysLeft
  }
}, { deep: true })

watch(() => authStore.userShopId, async (newShopId) => {
  if (newShopId) {
    await loadUnreadConversations()
  } else {
    unreadConversationsCount.value = 0
  }
})

// WATCHER POUR FERMER MENUS LORS NAVIGATION - VERSION SIMPLIFIÉE
watch(() => route.path, () => {
  // Fermer immédiatement tous les menus lors du changement de route
  mobileMenuOpen.value = false
  showMobileProfileMenu.value = false
  showProfileMenu.value = false
})

onMounted(async () => {
  document.addEventListener('click', handleClickOutside)
  
  // Charger les données initiales si authentifié
  if (authStore.isAuthenticated && authStore.token) {
    await loadSubscriptionInfo()
    await loadUnreadConversations()
    // Charger le nom de l'agent
    api.agents.list().then((res: any) => {
      if (res.success && res.data?.length > 0) {
        agentName.value = res.data[0].name || 'Mia'
      }
    }).catch(() => {})
  }

  // Polling conversations (toutes les 30 secondes)
  const conversationInterval = setInterval(async () => {
    if (authStore.userShopId && !loadingConversations.value && authStore.isAuthenticated) {
      await loadUnreadConversations()
    }
  }, 30000)

  // Nettoyer l'intervalle au démontage
  onUnmounted(() => {
    clearInterval(conversationInterval)
    document.removeEventListener('click', handleClickOutside)
    document.body.style.overflow = ''
  })
})
</script>

<style scoped>
/* RESPONSIVE DESIGN */
@media (max-width: 1023px) {
  .lg\:pl-64 {
    padding-left: 0 !important;
  }
}

/* TRANSITIONS FLUIDES */
.transition-all {
  transition: all 0.2s cubic-bezier(0.4, 0, 0.2, 1);
}

/* Z-INDEX MANAGEMENT */
.z-40 {
  z-index: 40;
}

.z-50 {
  z-index: 50;
}

/* ANIMATIONS */
@keyframes spin {
  from { transform: rotate(0deg); }
  to { transform: rotate(360deg); }
}

.animate-spin {
  animation: spin 1s linear infinite;
}

@keyframes pulse {
  0%, 100% { opacity: 1; }
  50% { opacity: .5; }
}

.animate-pulse {
  animation: pulse 2s cubic-bezier(0.4, 0, 0.6, 1) infinite;
}

/* ASSURER LA CLIQUABILITÉ */
button, a {
  position: relative;
  z-index: 1;
}

/* ÉVITER LES CONFLITS DE SUPERPOSITION */
.sidebar-content {
  pointer-events: auto;
}
</style>