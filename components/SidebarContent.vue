<!-- components/SidebarContent.vue -->
<template>
  <div class="flex flex-col h-full bg-white">

    <!-- Header sidebar -->
    <div class="flex h-16 items-center justify-between px-5 border-b border-gray-100">
      <div class="flex items-center space-x-2.5">
        <div class="flex h-9 w-9 items-center justify-center">
          <img
            src="/assets/images/logos/fav.svg"
            alt="ChatSeller"
            class="w-8 h-8"
          />
        </div>
        <span class="text-lg font-bold text-gray-900 tracking-tight">ChatSeller</span>
      </div>

      <!-- Close button for mobile -->
      <button
        v-if="isMobile"
        @click="handleCloseMobile"
        class="p-2 text-gray-400 hover:text-gray-600 hover:bg-gray-100 rounded-lg transition-colors lg:hidden"
        type="button"
      >
        <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12"/>
        </svg>
      </button>
    </div>

    <!-- Navigation -->
    <nav class="flex-1 px-3 py-4 overflow-y-auto sidebar-navigation">

      <!-- Principal -->
      <SidebarLink
        to="/"
        :isActive="$route.path === '/'"
        icon="M3 12l2-2m0 0l7-7 7 7M5 10v10a1 1 0 001 1h3m10-11l2 2m-2-2v10a1 1 0 01-1 1h-3m-6 0a1 1 0 001-1v-4a1 1 0 011-1h2a1 1 0 011 1v4a1 1 0 001 1m-6 0h6"
        label="Accueil"
        @click="handleNavClick"
      />

      <SidebarLink
        :to="agentId ? `/agent-ia/${agentId}` : '/agent-ia'"
        :isActive="$route.path.startsWith('/agent-ia')"
        icon="M9.663 17h4.673M12 3v1m6.364 1.636l-.707.707M21 12h-1M4 12H3m3.343-5.657l-.707-.707m2.828 9.9a5 5 0 117.072 0l-.548.547A3.374 3.374 0 0014 18.469V19a2 2 0 11-4 0v-.531c0-.895-.356-1.754-.988-2.386l-.548-.547z"
        label="Vendeuse IA"
        @click="handleNavClick"
      />

      <!-- Section : Activité -->
      <div class="mt-6 mb-2 px-3">
        <span class="text-[10px] font-semibold uppercase tracking-widest text-gray-400">Activité</span>
      </div>

      <SidebarLink
        to="/conversations"
        :isActive="$route.path.startsWith('/conversations')"
        icon="M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z"
        label="Conversations"
        :badge="unreadCount > 0 ? unreadCount : null"
        @click="handleNavClick"
      />

      <SidebarLink
        to="/orders"
        :isActive="$route.path.startsWith('/orders')"
        icon="M16 11V7a4 4 0 00-8 0v4M5 9h14l1 12H4L5 9z"
        label="Commandes"
        @click="handleNavClick"
      />

      <SidebarLink
        to="/analytics"
        :isActive="$route.path.startsWith('/analytics')"
        icon="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z"
        label="Analytics"
        @click="handleNavClick"
      />

      <!-- Section : Configuration -->
      <div class="mt-6 mb-2 px-3">
        <span class="text-[10px] font-semibold uppercase tracking-widest text-gray-400">Configuration</span>
      </div>

      <SidebarLink
        to="/products"
        :isActive="$route.path.startsWith('/products')"
        icon="M20 7l-8-4-8 4m16 0l-8 4m8-4v10l-8 4m0-10L4 7m8 4v10M4 7v10l8 4"
        label="Produits"
        @click="handleNavClick"
      />

      <SidebarLink
        to="/knowledge-base"
        :isActive="$route.path.startsWith('/knowledge-base')"
        icon="M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.746 0 3.332.477 4.5 1.253v13C19.832 18.477 18.246 18 16.5 18c-1.746 0-3.332.477-4.5 1.253"
        label="Connaissances"
        @click="handleNavClick"
      />

      <SidebarLink
        to="/billing"
        :isActive="$route.path.startsWith('/billing')"
        icon="M3 10h18M7 15h1m4 0h1m-7 4h12a3 3 0 003-3V8a3 3 0 00-3-3H6a3 3 0 00-3 3v8a3 3 0 003 3z"
        label="Facturation"
        @click="handleNavClick"
      />

      <SidebarLink
        to="/settings"
        :isActive="$route.path.startsWith('/settings')"
        icon="M10.325 4.317c.426-1.756 2.924-1.756 3.35 0a1.724 1.724 0 002.573 1.066c1.543-.94 3.31.826 2.37 2.37a1.724 1.724 0 001.065 2.572c1.756.426 1.756 2.924 0 3.35a1.724 1.724 0 00-1.066 2.573c.94 1.543-.826 3.31-2.37 2.37a1.724 1.724 0 00-2.572 1.065c-.426 1.756-2.924 1.756-3.35 0a1.724 1.724 0 00-2.573-1.066c-1.543.94-3.31-.826-2.37-2.37a1.724 1.724 0 00-1.065-2.572c-1.756-.426-1.756-2.924 0-3.35a1.724 1.724 0 001.066-2.573c-.94-1.543.826-3.31 2.37-2.37.996.608 2.296.07 2.572-1.065z M15 12a3 3 0 11-6 0 3 3 0 016 0z"
        label="Paramètres"
        @click="handleNavClick"
      />
    </nav>

    <!-- Subscription / Trial indicator -->
    <div class="px-3 pb-3 border-t border-gray-100 pt-3">

      <!-- Trial active -->
      <button
        v-if="userSubscriptionPlan === 'free' && userSubscriptionActive && trialDaysLeft > 0"
        @click="handleUpgradeClick('starter')"
        :disabled="upgradingToPlan === 'starter'"
        type="button"
        class="w-full text-white text-sm font-medium py-2.5 px-4 rounded-lg transition-all flex items-center justify-center space-x-2 disabled:opacity-50" style="background-color: var(--color-primary);" onmouseover="this.style.backgroundColor='var(--color-primary-hover)'" onmouseout="this.style.backgroundColor='var(--color-primary)'"
      >
        <svg v-if="upgradingToPlan === 'starter'" class="animate-spin h-4 w-4" fill="none" viewBox="0 0 24 24">
          <circle class="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" stroke-width="4"></circle>
          <path class="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
        </svg>
        <span>{{ upgradingToPlan === 'starter' ? 'Redirection...' : `Activer ${agentName}` }}</span>
      </button>

      <!-- Trial expired -->
      <button
        v-else-if="userSubscriptionPlan === 'free' && (!userSubscriptionActive || trialDaysLeft === 0)"
        @click="handleUpgradeClick('starter')"
        :disabled="upgradingToPlan === 'starter'"
        type="button"
        class="w-full bg-red-600 hover:bg-red-700 text-white text-sm font-medium py-2.5 px-4 rounded-lg transition-colors flex items-center justify-center space-x-2 disabled:opacity-50"
      >
        <svg v-if="upgradingToPlan === 'starter'" class="animate-spin h-4 w-4" fill="none" viewBox="0 0 24 24">
          <circle class="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" stroke-width="4"></circle>
          <path class="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
        </svg>
        <span>{{ upgradingToPlan === 'starter' ? 'Redirection...' : `Réembaucher ${agentName}` }}</span>
      </button>

      <!-- Starter active (trial) -->
      <button
        v-else-if="userSubscriptionPlan === 'starter' && userSubscriptionActive"
        @click="handleUpgradeClick('starter')"
        :disabled="upgradingToPlan === 'starter'"
        type="button"
        class="w-full text-white text-sm font-medium py-2.5 px-4 rounded-lg transition-all flex items-center justify-center space-x-2 disabled:opacity-50" style="background-color: var(--color-primary);" onmouseover="this.style.backgroundColor='var(--color-primary-hover)'" onmouseout="this.style.backgroundColor='var(--color-primary)'"
      >
        <svg v-if="upgradingToPlan === 'starter'" class="animate-spin h-4 w-4" fill="none" viewBox="0 0 24 24">
          <circle class="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" stroke-width="4"></circle>
          <path class="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
        </svg>
        <span>{{ upgradingToPlan === 'starter' ? 'Redirection...' : `Rémunérer ${agentName}` }}</span>
      </button>

      <!-- Growth active -->
      <div
        v-else-if="userSubscriptionPlan === 'growth' && userSubscriptionActive"
        class="w-full bg-emerald-50 text-emerald-700 text-sm font-medium py-2.5 px-4 rounded-lg flex items-center justify-center space-x-2"
      >
        <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M5 13l4 4L19 7"/>
        </svg>
        <span>{{ agentName }} Pro</span>
      </div>

      <!-- Starter inactive -->
      <button
        v-else-if="userSubscriptionPlan === 'starter' && !userSubscriptionActive"
        @click="handleUpgradeClick('starter')"
        :disabled="upgradingToPlan === 'starter'"
        type="button"
        class="w-full bg-amber-600 hover:bg-amber-700 text-white text-sm font-medium py-2.5 px-4 rounded-lg transition-colors flex items-center justify-center space-x-2 disabled:opacity-50"
      >
        <svg v-if="upgradingToPlan === 'starter'" class="animate-spin h-4 w-4" fill="none" viewBox="0 0 24 24">
          <circle class="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" stroke-width="4"></circle>
          <path class="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
        </svg>
        <span>{{ upgradingToPlan === 'starter' ? 'Redirection...' : `Réembaucher ${agentName}` }}</span>
      </button>

      <!-- Growth inactive -->
      <button
        v-else-if="userSubscriptionPlan === 'growth' && !userSubscriptionActive"
        @click="handleUpgradeClick('growth')"
        :disabled="upgradingToPlan === 'growth'"
        type="button"
        class="w-full bg-amber-600 hover:bg-amber-700 text-white text-sm font-medium py-2.5 px-4 rounded-lg transition-colors flex items-center justify-center space-x-2 disabled:opacity-50"
      >
        <svg v-if="upgradingToPlan === 'growth'" class="animate-spin h-4 w-4" fill="none" viewBox="0 0 24 24">
          <circle class="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" stroke-width="4"></circle>
          <path class="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
        </svg>
        <span>{{ upgradingToPlan === 'growth' ? 'Redirection...' : `Réembaucher ${agentName} Pro` }}</span>
      </button>

      <!-- Trial days indicator -->
      <div
        v-if="userSubscriptionPlan === 'free' && userSubscriptionActive && trialDaysLeft > 0"
        class="mt-2 text-center text-xs text-gray-500"
      >
        {{ trialDaysLeft }} jour(s) d'essai restant(s)
      </div>

      <!-- Expired indicator -->
      <div
        v-else-if="userSubscriptionPlan === 'free' && (!userSubscriptionActive || trialDaysLeft === 0)"
        class="mt-2 text-center text-xs text-red-500 font-medium"
      >
        Essai expiré
      </div>
    </div>

    <!-- User profile -->
    <div class="border-t border-gray-100 p-3 bg-white">
      <div class="relative" ref="profileDropdown">
        <button
          @click="handleToggleProfile"
          type="button"
          class="w-full flex items-center space-x-3 p-2.5 rounded-lg hover:bg-gray-50 transition-colors group focus:outline-none"
        >
          <div class="flex h-9 w-9 items-center justify-center rounded-full bg-gray-900 flex-shrink-0">
            <span class="text-xs font-semibold text-white">
              {{ userInitials }}
            </span>
          </div>

          <div class="flex-1 min-w-0 text-left">
            <p class="text-sm font-medium text-gray-900 truncate">
              {{ userName || 'Utilisateur' }}
            </p>
            <p class="text-xs text-gray-400 truncate">
              {{ userEmail || 'email@exemple.com' }}
            </p>
          </div>

          <svg
            class="h-4 w-4 text-gray-300 transition-transform duration-200 flex-shrink-0"
            :class="{ 'rotate-180': showProfileMenu }"
            fill="none"
            viewBox="0 0 24 24"
            stroke="currentColor"
          >
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M19 9l-7 7-7-7" />
          </svg>
        </button>

        <!-- Dropdown menu -->
        <Transition
          enter-active-class="transition ease-out duration-150"
          enter-from-class="transform opacity-0 translate-y-1"
          enter-to-class="transform opacity-100 translate-y-0"
          leave-active-class="transition ease-in duration-100"
          leave-from-class="transform opacity-100 translate-y-0"
          leave-to-class="transform opacity-0 translate-y-1"
        >
          <div
            v-if="showProfileMenu"
            class="absolute bottom-full left-0 right-0 mb-2 bg-white rounded-lg shadow-lg border border-gray-200 py-1 z-50"
          >
            <NuxtLink
              to="/settings?tab=compte"
              class="flex items-center px-4 py-2 text-sm text-gray-700 hover:bg-gray-50 transition-colors"
              @click="handleCloseProfile"
            >
              <svg class="mr-3 h-4 w-4 text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
              </svg>
              Mon profil
            </NuxtLink>

            <hr class="my-1 border-gray-100">

            <button
              @click="handleLogout"
              type="button"
              class="w-full flex items-center px-4 py-2 text-sm text-red-600 hover:bg-red-50 transition-colors"
            >
              <svg class="mr-3 h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1" />
              </svg>
              Se déconnecter
            </button>
          </div>
        </Transition>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
// components/SidebarContent.vue
import { ref } from 'vue'

type SubscriptionPlan = 'free' | 'starter' | 'growth' | 'pro' | 'performance'

interface Props {
  unreadCount: number
  userName: string
  userEmail: string
  userInitials: string
  showProfileMenu: boolean
  isMobile?: boolean
  userSubscriptionPlan: SubscriptionPlan
  userSubscriptionActive: boolean
  trialDaysLeft?: number
  agentName?: string
  agentId?: string | null
}

const props = withDefaults(defineProps<Props>(), {
  isMobile: false,
  userSubscriptionPlan: 'free',
  userSubscriptionActive: false,
  trialDaysLeft: 0,
  agentName: 'Mia',
  agentId: null
})

const emit = defineEmits<{
  'toggle-profile': []
  'close-profile': []
  'logout': []
  'close-mobile': []
  'upgrade-to-plan': [plan: 'starter' | 'growth']
}>()

const upgradingToPlan = ref<'starter' | 'growth' | null>(null)

const handleNavClick = () => {
  if (props.isMobile) {
    emit('close-mobile')
  }
  if (props.showProfileMenu) {
    emit('close-profile')
  }
}

const handleCloseMobile = () => {
  emit('close-mobile')
}

const handleToggleProfile = () => {
  emit('toggle-profile')
}

const handleCloseProfile = () => {
  emit('close-profile')
}

const handleLogout = () => {
  emit('logout')
}

const handleUpgradeClick = (targetPlan: 'starter' | 'growth') => {
  upgradingToPlan.value = targetPlan
  emit('upgrade-to-plan', targetPlan)
}
</script>

<style scoped>
nav {
  scrollbar-width: none;
  -ms-overflow-style: none;
}

nav::-webkit-scrollbar {
  display: none;
}
</style>
