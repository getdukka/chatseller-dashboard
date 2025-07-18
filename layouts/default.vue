<!-- layouts/default.vue -->
<template>
  <div class="min-h-screen bg-gray-50">
    <!-- Sidebar -->
    <div 
      :class="[
        'fixed inset-y-0 left-0 z-50 w-64 bg-white shadow-lg transform transition-transform duration-300 ease-in-out lg:translate-x-0 lg:static lg:inset-0',
        sidebarOpen ? 'translate-x-0' : '-translate-x-full'
      ]"
    >
      <!-- Logo -->
      <div class="flex items-center h-16 px-6 border-b border-gray-200">
        <div class="flex items-center">
          <div class="bg-blue-600 rounded-lg p-2">
            <span class="text-white font-bold text-lg">CS</span>
          </div>
          <span class="ml-2 text-xl font-bold text-gray-900">ChatSeller</span>
        </div>
      </div>
      
      <!-- Navigation -->
      <nav class="mt-6 px-3">
        <div class="space-y-1">
          <NuxtLink 
            v-for="item in navigation" 
            :key="item.name"
            :to="item.href"
            :class="[
              'nav-item',
              $route.path === item.href ? 'nav-item-active' : 'nav-item-inactive'
            ]"
            @click="sidebarOpen = false"
          >
            <component :is="item.icon" class="mr-3 h-5 w-5" />
            {{ item.name }}
            <span v-if="item.count" class="ml-auto badge badge-info">
              {{ item.count }}
            </span>
          </NuxtLink>
        </div>
        
        <!-- Section Intégration -->
        <div class="mt-8">
          <h3 class="px-3 text-xs font-semibold text-gray-500 uppercase tracking-wider">
            Intégration
          </h3>
          <div class="mt-2 space-y-1">
            <NuxtLink 
              v-for="item in integrationLinks" 
              :key="item.name"
              :to="item.href"
              :class="[
                'nav-item',
                $route.path === item.href ? 'nav-item-active' : 'nav-item-inactive'
              ]"
              @click="sidebarOpen = false"
            >
              <component :is="item.icon" class="mr-3 h-5 w-5" />
              {{ item.name }}
            </NuxtLink>
          </div>
        </div>
      </nav>
      
      <!-- Status widget en bas -->
      <div class="absolute bottom-0 left-0 right-0 p-4">
        <div class="bg-green-50 border border-green-200 rounded-lg p-3">
          <div class="flex items-center">
            <div class="flex-shrink-0">
              <div class="w-2 h-2 bg-green-400 rounded-full animate-pulse"></div>
            </div>
            <div class="ml-3 min-w-0 flex-1">
              <p class="text-sm font-medium text-green-800">Widget actif</p>
              <p class="text-xs text-green-600">{{ stats.activeConversations }} conversations</p>
            </div>
          </div>
        </div>
      </div>
    </div>
    
    <!-- Overlay pour mobile -->
    <div 
      v-if="sidebarOpen" 
      @click="sidebarOpen = false"
      class="fixed inset-0 z-40 bg-gray-600 bg-opacity-75 lg:hidden"
    ></div>
    
    <!-- Main content -->
    <div class="lg:pl-64">
      <!-- Header -->
      <header class="bg-white shadow-sm border-b border-gray-200 sticky top-0 z-30">
        <div class="px-4 sm:px-6 lg:px-8">
          <div class="flex justify-between h-16">
            <div class="flex items-center">
              <!-- Menu mobile -->
              <button
                @click="sidebarOpen = !sidebarOpen"
                class="lg:hidden p-2 rounded-md text-gray-400 hover:text-gray-500 hover:bg-gray-100 focus:outline-none focus:ring-2 focus:ring-inset focus:ring-blue-500"
              >
                <Bars3Icon class="h-6 w-6" />
              </button>
              
              <!-- Breadcrumbs -->
              <nav class="hidden lg:flex items-center text-sm">
                <ol class="flex items-center space-x-2">
                  <li>
                    <NuxtLink to="/" class="text-gray-500 hover:text-gray-700">
                      Dashboard
                    </NuxtLink>
                  </li>
                  <li v-if="currentPageName">
                    <ChevronRightIcon class="h-4 w-4 text-gray-400" />
                  </li>
                  <li v-if="currentPageName" class="text-gray-900 font-medium">
                    {{ currentPageName }}
                  </li>
                </ol>
              </nav>
            </div>
            
            <div class="flex items-center space-x-4">
              <!-- Search -->
              <div class="hidden md:block relative">
                <div class="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                  <MagnifyingGlassIcon class="h-4 w-4 text-gray-400" />
                </div>
                <input
                  type="text"
                  placeholder="Rechercher..."
                  class="pl-10 pr-4 py-2 border border-gray-300 rounded-lg text-sm focus:ring-blue-500 focus:border-blue-500"
                />
              </div>
              
              <!-- Notifications -->
              <button class="p-2 text-gray-400 hover:text-gray-500 hover:bg-gray-100 rounded-lg relative">
                <BellIcon class="h-5 w-5" />
                <span v-if="notificationCount > 0" class="absolute -top-1 -right-1 h-4 w-4 bg-red-500 text-white text-xs rounded-full flex items-center justify-center">
                  {{ notificationCount }}
                </span>
              </button>
              
              <!-- Intégrer widget button -->
              <button
                @click="showIntegrationModal = true"
                class="btn-primary text-sm"
              >
                <CodeBracketIcon class="h-4 w-4 mr-2" />
                Intégrer le widget
              </button>
              
              <!-- User menu -->
              <div class="relative" ref="userMenuRef">
                <button
                  @click="userMenuOpen = !userMenuOpen"
                  class="flex items-center p-1 rounded-full hover:bg-gray-100 focus:outline-none focus:ring-2 focus:ring-blue-500"
                >
                  <img
                    v-if="authStore.user?.avatar"
                    :src="authStore.user.avatar"
                    :alt="authStore.user.name"
                    class="h-8 w-8 rounded-full"
                  />
                  <div
                    v-else
                    class="h-8 w-8 bg-blue-600 rounded-full flex items-center justify-center"
                  >
                    <span class="text-white text-sm font-medium">
                      {{ authStore.userInitials }}
                    </span>
                  </div>
                </button>
                
                <!-- Dropdown menu -->
                <div
                  v-if="userMenuOpen"
                  class="absolute right-0 mt-2 w-48 bg-white rounded-md shadow-lg ring-1 ring-black ring-opacity-5 focus:outline-none z-50"
                >
                  <div class="py-1">
                    <div class="px-4 py-2 border-b border-gray-100">
                      <p class="text-sm font-medium text-gray-900">{{ authStore.user?.name }}</p>
                      <p class="text-xs text-gray-500">{{ authStore.user?.email }}</p>
                    </div>
                    <NuxtLink
                      to="/settings"
                      class="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-100"
                      @click="userMenuOpen = false"
                    >
                      <Cog6ToothIcon class="inline h-4 w-4 mr-2" />
                      Paramètres
                    </NuxtLink>
                    <button
                      @click="logout"
                      class="block w-full text-left px-4 py-2 text-sm text-gray-700 hover:bg-gray-100"
                    >
                      <ArrowRightOnRectangleIcon class="inline h-4 w-4 mr-2" />
                      Déconnexion
                    </button>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </header>
      
      <!-- Page content -->
      <main class="flex-1 relative overflow-y-auto focus:outline-none">
        <div class="py-6">
          <div class="container-fluid">
            <slot />
          </div>
        </div>
      </main>
    </div>
    
    <!-- Modals -->
    <IntegrationModal 
      :show="showIntegrationModal"
      @close="showIntegrationModal = false"
      :user-id="authStore.user?.shopId"
    />
    
    <!-- Notifications Toast -->
    <NotificationToast />
  </div>
</template>

<script setup lang="ts">
import { ref, computed, onMounted } from 'vue'
import {
  Bars3Icon,
  MagnifyingGlassIcon,
  BellIcon,
  CodeBracketIcon,
  ChevronRightIcon,
  Cog6ToothIcon,
  ArrowRightOnRectangleIcon,
  HomeIcon,
  ChatBubbleLeftRightIcon,
  ShoppingBagIcon,
  DocumentTextIcon,
  ChartBarIcon,
  WrenchScrewdriverIcon,
  CubeIcon
} from '@heroicons/vue/24/outline'

// Imports explicites pour résoudre les erreurs TypeScript
import { useAuthStore } from '~/stores/auth'
import { useClickOutside } from '~/composables/useClickOutside'

// Stores
const authStore = useAuthStore()

// Template refs
const userMenuRef = ref<HTMLElement>()

// État local
const sidebarOpen = ref(false)
const userMenuOpen = ref(false)
const showIntegrationModal = ref(false)
const notificationCount = ref(3)

// Navigation
const navigation = [
  { name: 'Aperçu', href: '/', icon: HomeIcon },
  { name: 'Conversations', href: '/conversations', icon: ChatBubbleLeftRightIcon, count: 12 },
  { name: 'Commandes', href: '/orders', icon: ShoppingBagIcon, count: 5 },
  { name: 'Base de connaissance', href: '/knowledge-base', icon: DocumentTextIcon },
  { name: 'Analytics', href: '/analytics', icon: ChartBarIcon },
  { name: 'Configuration', href: '/settings', icon: WrenchScrewdriverIcon }
]

const integrationLinks = [
  { name: 'Code d\'intégration', href: '/integration/code', icon: CodeBracketIcon },
  { name: 'Aperçu du widget', href: '/integration/preview', icon: CubeIcon }
]

// Stats pour le widget status
const stats = ref({
  activeConversations: 12
})

// Computed
const currentPageName = computed(() => {
  const currentRoute = navigation.find(item => item.href === useRoute().path)
  return currentRoute?.name
})

// Actions
const logout = () => {
  authStore.logout()
  userMenuOpen.value = false
}

// Click outside pour fermer le menu utilisateur
useClickOutside([userMenuRef], () => {
  userMenuOpen.value = false
})

// Lifecycle
onMounted(async () => {
  await authStore.initializeAuth()
})
</script>