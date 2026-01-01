<!-- components/SidebarContent.vue -->
<template>
  <div class="flex flex-col h-full bg-white">
    
    <!-- Header sidebar -->
    <div class="flex h-16 items-center justify-between px-6 border-b border-gray-100">
      <div class="flex items-center space-x-3">
        <div class="flex h-12 w-12 items-center justify-center bg-transparent">
              <img 
                src="/assets/images/logos/fav.svg" 
                alt="ChatSeller" 
                class="w-10 h-10"
              />
            </div>
        <span class="text-xl font-bold text-gray-900">ChatSeller</span>
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

    <!-- Navigation principale -->
    <nav class="flex-1 px-4 py-6 space-y-2 overflow-y-auto sidebar-navigation">
      
      <!-- LIENS DE NAVIGATION CORRIGÉS -->
      <SidebarLink
        to="/"
        :isActive="$route.path === '/'"
        icon="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2-2V7a2 2 0 012-2h2a2 2 0 002 2v2a2 2 0 002 2h2a2 2 0 002-2V7a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 00-2 2h-2a2 2 0 00-2 2v6a2 2 0 01-2 2H9z"
        label="Dashboard"
        @click="handleNavClick"
      />

      <SidebarLink
        to="/agent-ia"
        :isActive="$route.path.startsWith('/agent-ia')"
        icon="M9.663 17h4.673M12 3v1m6.364 1.636l-.707.707M21 12h-1M4 12H3m3.343-5.657l-.707-.707m2.828 9.9a5 5 0 117.072 0l-.548.547A3.374 3.374 0 0014 18.469V19a2 2 0 11-4 0v-.531c0-.895-.356-1.754-.988-2.386l-.548-.547z"
        label="Conseillère IA"
        @click="handleNavClick"
      />

      <!-- Lien Conversations avec badge -->
      <SidebarLink
        to="/conversations"
        :isActive="$route.path.startsWith('/conversations')"
        icon="M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z"
        label="Conversations"
        :badge="unreadCount > 0 ? unreadCount : null"
        @click="handleNavClick"
      />

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
        label="Base de connaissances"
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

    <!-- Boutons d'abonnement -->
    <div class="px-4 pb-4 border-t border-gray-100 pt-4">
      
      <!-- Plan Free + Essai actif : Bouton "Passer à Starter" -->
      <button
        v-if="userSubscriptionPlan === 'free' && userSubscriptionActive && trialDaysLeft > 0"
        @click="handleUpgradeClick('starter')"
        :disabled="upgradingToPlan === 'starter'"
        type="button"
        class="w-full bg-gradient-to-r from-rose-600 to-rose-700 hover:from-rose-700 hover:to-rose-800 text-white font-semibold py-3 px-4 rounded-xl shadow-lg hover:shadow-xl transition-all duration-200 flex items-center justify-center space-x-2 disabled:opacity-50 disabled:cursor-not-allowed group mb-3"
      >
        <svg v-if="upgradingToPlan === 'starter'" class="animate-spin h-5 w-5" fill="none" viewBox="0 0 24 24">
          <circle class="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" stroke-width="4"></circle>
          <path class="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
        </svg>
        <svg v-else class="w-5 h-5 group-hover:scale-110 transition-transform" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M13 10V3L4 14h7v7l9-11h-7z"/>
        </svg>
        <span>{{ upgradingToPlan === 'starter' ? 'Redirection...' : 'Passer à Starter' }}</span>
      </button>

      <!-- Plan Free + Essai expiré : Bouton rouge "Réactiver" -->
      <button
        v-else-if="userSubscriptionPlan === 'free' && (!userSubscriptionActive || trialDaysLeft === 0)"
        @click="handleUpgradeClick('starter')"
        :disabled="upgradingToPlan === 'starter'"
        type="button"
        class="w-full bg-gradient-to-r from-red-600 to-red-700 hover:from-red-700 hover:to-red-800 text-white font-semibold py-3 px-4 rounded-xl shadow-lg hover:shadow-xl transition-all duration-200 flex items-center justify-center space-x-2 disabled:opacity-50 disabled:cursor-not-allowed group mb-3"
      >
        <svg v-if="upgradingToPlan === 'starter'" class="animate-spin h-5 w-5" fill="none" viewBox="0 0 24 24">
          <circle class="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" stroke-width="4"></circle>
          <path class="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
        </svg>
        <svg v-else class="w-5 h-5 group-hover:scale-110 transition-transform" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15"/>
        </svg>
        <span>{{ upgradingToPlan === 'starter' ? 'Redirection...' : 'Réactiver (Starter)' }}</span>
      </button>

      <!-- Plan Starter + Actif : Bouton "Passer au Growth" -->
      <button
        v-else-if="userSubscriptionPlan === 'starter' && userSubscriptionActive"
        @click="handleUpgradeClick('growth')"
        :disabled="upgradingToPlan === 'growth'"
        type="button"
        class="w-full bg-gradient-to-r from-purple-600 to-purple-700 hover:from-purple-700 hover:to-purple-800 text-white font-semibold py-3 px-4 rounded-xl shadow-lg hover:shadow-xl transition-all duration-200 flex items-center justify-center space-x-2 disabled:opacity-50 disabled:cursor-not-allowed group mb-3"
      >
        <svg v-if="upgradingToPlan === 'growth'" class="animate-spin h-5 w-5" fill="none" viewBox="0 0 24 24">
          <circle class="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" stroke-width="4"></circle>
          <path class="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
        </svg>
        <svg v-else class="w-5 h-5 group-hover:scale-110 transition-transform" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M5 3v4M3 5h4M6 17v4m-2-2h4m5-16l2.286 6.857L21 12l-5.714 2.143L13 21l-2.286-6.857L5 12l5.714-2.143L13 3z"/>
        </svg>
        <span>{{ upgradingToPlan === 'growth' ? 'Redirection...' : 'Passer au Growth' }}</span>
      </button>

      <!-- Plan Growth + Actif : Badge statique "Plan Growth Actif" -->
      <div
        v-else-if="userSubscriptionPlan === 'growth' && userSubscriptionActive"
        class="w-full bg-gradient-to-r from-green-600 to-emerald-600 text-white font-semibold py-3 px-4 rounded-xl shadow-lg flex items-center justify-center space-x-2 mb-3"
      >
        <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M5 13l4 4L19 7"/>
        </svg>
        <span>Plan Growth Actif</span>
      </div>

      <!-- Plan Starter + Inactif : Bouton "Réactiver Starter" -->
      <button
        v-else-if="userSubscriptionPlan === 'starter' && !userSubscriptionActive"
        @click="handleUpgradeClick('starter')"
        :disabled="upgradingToPlan === 'starter'"
        type="button"
        class="w-full bg-gradient-to-r from-orange-600 to-orange-700 hover:from-orange-700 hover:to-orange-800 text-white font-semibold py-3 px-4 rounded-xl shadow-lg hover:shadow-xl transition-all duration-200 flex items-center justify-center space-x-2 disabled:opacity-50 disabled:cursor-not-allowed group mb-3"
      >
        <svg v-if="upgradingToPlan === 'starter'" class="animate-spin h-5 w-5" fill="none" viewBox="0 0 24 24">
          <circle class="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" stroke-width="4"></circle>
          <path class="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
        </svg>
        <svg v-else class="w-5 h-5 group-hover:scale-110 transition-transform" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15"/>
        </svg>
        <span>{{ upgradingToPlan === 'starter' ? 'Redirection...' : 'Réactiver Starter' }}</span>
      </button>

      <!-- Plan Growth + Inactif : Bouton "Réactiver Growth" -->
      <button
        v-else-if="userSubscriptionPlan === 'growth' && !userSubscriptionActive"
        @click="handleUpgradeClick('growth')"
        :disabled="upgradingToPlan === 'growth'"
        type="button"
        class="w-full bg-gradient-to-r from-purple-600 to-purple-700 hover:from-purple-700 hover:to-purple-800 text-white font-semibold py-3 px-4 rounded-xl shadow-lg hover:shadow-xl transition-all duration-200 flex items-center justify-center space-x-2 disabled:opacity-50 disabled:cursor-not-allowed group mb-3"
      >
        <svg v-if="upgradingToPlan === 'growth'" class="animate-spin h-5 w-5" fill="none" viewBox="0 0 24 24">
          <circle class="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" stroke-width="4"></circle>
          <path class="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
        </svg>
        <svg v-else class="w-5 h-5 group-hover:scale-110 transition-transform" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15"/>
        </svg>
        <span>{{ upgradingToPlan === 'growth' ? 'Redirection...' : 'Réactiver Growth' }}</span>
      </button>

      <!-- Affichage des jours d'essai restants -->
      <div 
        v-if="userSubscriptionPlan === 'free' && userSubscriptionActive && trialDaysLeft > 0" 
        class="text-center text-xs text-gray-500 bg-rose-50 border border-rose-200 rounded-lg py-2 px-3"
      >
        <div class="flex items-center justify-center space-x-1">
          <svg class="w-3 h-3 text-rose-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z"/>
          </svg>
          <span class="font-medium text-rose-700">{{ trialDaysLeft }} jour(s) d'essai</span>
        </div>
      </div>

      <!-- Message d'expiration -->
      <div 
        v-else-if="userSubscriptionPlan === 'free' && (!userSubscriptionActive || trialDaysLeft === 0)" 
        class="text-center text-xs text-red-700 bg-red-50 border border-red-200 rounded-lg py-2 px-3"
      >
        <div class="flex items-center justify-center space-x-1">
          <svg class="w-3 h-3 text-red-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"/>
          </svg>
          <span class="font-medium">Essai expiré</span>
        </div>
      </div>
    </div>

    <!-- Profil utilisateur en bas -->
    <div class="border-t border-gray-100 p-4 bg-white">
      <div class="relative" ref="profileDropdown">
        <button 
          @click="handleToggleProfile"
          type="button"
          class="w-full flex items-center space-x-3 p-3 rounded-xl hover:bg-gray-50 transition-all duration-200 group focus:outline-none focus:ring-2 focus:ring-rose-500"
        >
          <!-- Avatar dynamique -->
          <div class="flex h-10 w-10 items-center justify-center rounded-full bg-gradient-to-br from-rose-500 to-rose-600 shadow-md">
            <span class="text-sm font-semibold text-white">
              {{ userInitials }}
            </span>
          </div>
          
          <div class="flex-1 min-w-0 text-left">
            <!-- Nom utilisateur dynamique -->
            <p class="text-sm font-semibold text-gray-900 truncate">
              {{ userName || 'Utilisateur' }}
            </p>
            <!-- Email utilisateur dynamique -->
            <p class="text-xs text-gray-500 truncate">
              {{ userEmail || 'email@exemple.com' }}
            </p>
          </div>
          
          <!-- Icône dropdown -->
          <svg 
            class="h-4 w-4 text-gray-400 group-hover:text-gray-600 transition-transform duration-200"
            :class="{ 'rotate-180': showProfileMenu }"
            fill="none" 
            viewBox="0 0 24 24" 
            stroke="currentColor"
          >
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M19 9l-7 7-7-7" />
          </svg>
        </button>

        <!-- Menu dropdown -->
        <Transition
          enter-active-class="transition ease-out duration-200"
          enter-from-class="transform opacity-0 scale-95"
          enter-to-class="transform opacity-100 scale-100"
          leave-active-class="transition ease-in duration-75"
          leave-from-class="transform opacity-100 scale-100"
          leave-to-class="transform opacity-0 scale-95"
        >
          <div 
            v-if="showProfileMenu"
            class="absolute bottom-full left-0 right-0 mb-2 bg-white rounded-xl shadow-lg border border-gray-100 py-2 z-50"
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
// components/SidebarContent.vue - SECTION <script setup> SIMPLIFIÉE
import { ref } from 'vue'

// ✅ TYPES SIMPLIFIÉS
type SubscriptionPlan = 'free' | 'starter' | 'pro'

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
}

// ✅ PROPS ET EMITS SIMPLIFIÉS
const props = withDefaults(defineProps<Props>(), {
  isMobile: false,
  userSubscriptionPlan: 'free',
  userSubscriptionActive: false,
  trialDaysLeft: 0
})

const emit = defineEmits<{
  'toggle-profile': []
  'close-profile': []
  'logout': []
  'close-mobile': []
  'upgrade-to-plan': [plan: 'starter' | 'growth']
}>()

// ✅ STATE MINIMAL
const upgradingToPlan = ref<'starter' | 'growth' | null>(null)

// ✅ GESTIONNAIRES SIMPLIFIÉS - PAS DE LOGS EXCESSIFS
const handleNavClick = () => {
  // Fermer menus immédiatement lors navigation
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

// ✅ UPGRADE SIMPLIFIÉ SANS TRY/CATCH COMPLEXE
const handleUpgradeClick = (targetPlan: 'starter' | 'growth') => {
  upgradingToPlan.value = targetPlan
  emit('upgrade-to-plan', targetPlan)
}
</script>

<style scoped>
/* STYLES OPTIMISÉS POUR LA NAVIGATION */
.sidebar-navigation {
  pointer-events: auto;
}

.sidebar-navigation * {
  pointer-events: auto;
}

/* ÉVITER LES OVERLAPS */
button, a {
  position: relative;
  z-index: 1;
}

/* TRANSITIONS FLUIDES */
.transition-all {
  transition: all 0.2s cubic-bezier(0.4, 0, 0.2, 1);
}

/* HOVER EFFECTS */
.group:hover .group-hover\:text-gray-600 {
  color: rgb(75 85 99);
}

.group:hover .group-hover\:scale-110 {
  transform: scale(1.1);
}

/* SCROLL STYLING */
nav {
  scrollbar-width: none;
  -ms-overflow-style: none;
}

nav::-webkit-scrollbar {
  display: none;
}

/* ANIMATIONS */
@keyframes spin {
  from { transform: rotate(0deg); }
  to { transform: rotate(360deg); }
}

.animate-spin {
  animation: spin 1s linear infinite;
}

/* FOCUS STATES */
button:focus, a:focus {
  outline: 2px solid rgb(59 130 246);
  outline-offset: 2px;
}

/* DROPDOWN Z-INDEX */
.z-50 {
  z-index: 50;
}

/* BACKGROUND FIXE */
.bg-white {
  background-color: white !important;
}
</style>