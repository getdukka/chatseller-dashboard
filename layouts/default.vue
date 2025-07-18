<template>
  <div class="h-screen flex bg-gray-50">
    <!-- Sidebar -->
    <aside 
      :class="[
        'fixed inset-y-0 left-0 z-50 w-64 bg-white border-r border-gray-200 transform transition-all duration-300 ease-in-out',
        sidebarOpen ? 'translate-x-0' : '-translate-x-full lg:translate-x-0'
      ]"
    >
      <!-- Header Sidebar -->
      <div class="flex items-center justify-between h-16 px-6 border-b border-gray-200">
        <NuxtLink to="/" class="flex items-center">
          <div class="flex-shrink-0 w-8 h-8 bg-gradient-to-r from-blue-500 to-blue-600 rounded-lg flex items-center justify-center">
            <span class="text-white font-bold text-sm">CS</span>
          </div>
          <span class="ml-3 text-lg font-bold text-gray-900">ChatSeller</span>
        </NuxtLink>
        
        <!-- Bouton fermer mobile -->
        <button 
          @click="sidebarOpen = false"
          class="lg:hidden p-1 rounded-md text-gray-400 hover:text-gray-500 hover:bg-gray-100"
        >
          <XMarkIcon class="h-5 w-5" />
        </button>
      </div>
      
      <!-- Navigation principale -->
      <nav class="flex-1 px-4 py-6 space-y-2 overflow-y-auto">
        <NuxtLink
          v-for="item in navigation"
          :key="item.name"
          :to="item.href"
          :class="[
            isActiveRoute(item.href) 
              ? 'bg-blue-50 border-blue-500 text-blue-700 border-r-2' 
              : 'border-transparent text-gray-600 hover:bg-gray-50 hover:text-gray-900',
            'group flex items-center px-3 py-2 text-sm font-medium transition-colors duration-200 rounded-l-md'
          ]"
          @click="sidebarOpen = false"
        >
          <component 
            :is="item.icon" 
            :class="[
              isActiveRoute(item.href) ? 'text-blue-500' : 'text-gray-400 group-hover:text-gray-500',
              'mr-3 h-5 w-5 flex-shrink-0'
            ]" 
          />
          {{ item.name }}
          
          <!-- Badge pour notifications -->
          <span 
            v-if="item.badge" 
            class="ml-auto inline-block py-0.5 px-2 text-xs font-medium rounded-full"
            :class="item.badgeColor || 'bg-blue-100 text-blue-800'"
          >
            {{ item.badge }}
          </span>
        </NuxtLink>
        
        <!-- Section intégration -->
        <div class="pt-6 mt-6 border-t border-gray-200">
          <h3 class="px-3 text-xs font-semibold text-gray-500 uppercase tracking-wider mb-3">
            Intégration
          </h3>
          <div class="space-y-2">
            <button
              @click="showIntegrationCode = true"
              class="group flex items-center w-full px-3 py-2 text-sm font-medium text-gray-600 rounded-l-md hover:bg-gray-50 hover:text-gray-900 transition-colors duration-200"
            >
              <CodeBracketIcon class="mr-3 h-5 w-5 text-gray-400 group-hover:text-gray-500" />
              Code d'intégration
            </button>
            
            <NuxtLink
              to="/widget-preview"
              class="group flex items-center w-full px-3 py-2 text-sm font-medium text-gray-600 rounded-l-md hover:bg-gray-50 hover:text-gray-900 transition-colors duration-200"
            >
              <EyeIcon class="mr-3 h-5 w-5 text-gray-400 group-hover:text-gray-500" />
              Aperçu du widget
            </NuxtLink>
          </div>
        </div>
      </nav>
      
      <!-- Statut widget en bas -->
      <div class="flex-shrink-0 border-t border-gray-200 p-4">
        <div class="flex items-center text-sm">
          <div class="flex items-center">
            <div class="h-2 w-2 bg-green-400 rounded-full mr-2 animate-pulse"></div>
            <span class="text-green-600 font-medium">Widget actif</span>
          </div>
          <span class="mx-2 text-gray-300">•</span>
          <span class="text-gray-500">{{ stats.conversationsToday }} conversations</span>
        </div>
      </div>
      
      <!-- Profil utilisateur en bas -->
      <div class="flex-shrink-0 border-t border-gray-200 p-4">
        <Menu as="div" class="relative">
          <MenuButton class="flex items-center w-full text-left group">
            <div class="flex-shrink-0">
              <div class="h-8 w-8 bg-gradient-to-r from-blue-500 to-blue-600 rounded-full flex items-center justify-center">
                <span class="text-white font-medium text-sm">
                  {{ userInitials }}
                </span>
              </div>
            </div>
            <div class="ml-3 flex-1 min-w-0">
              <p class="text-sm font-medium text-gray-900 truncate">
                {{ user?.user_metadata?.firstName }} {{ user?.user_metadata?.lastName }}
              </p>
              <p class="text-xs text-gray-500 truncate">
                {{ user?.email }}
              </p>
            </div>
            <ChevronUpDownIcon class="h-4 w-4 text-gray-400 group-hover:text-gray-500" />
          </MenuButton>
          
          <transition
            enter-active-class="transition ease-out duration-100"
            enter-from-class="transform opacity-0 scale-95"
            enter-to-class="transform opacity-100 scale-100"
            leave-active-class="transition ease-in duration-75"
            leave-from-class="transform opacity-100 scale-100"
            leave-to-class="transform opacity-0 scale-95"
          >
            <MenuItems class="origin-bottom-left absolute bottom-full left-0 mb-1 w-56 rounded-md shadow-lg bg-white ring-1 ring-black ring-opacity-5 focus:outline-none">
              <div class="py-1">
                <MenuItem v-slot="{ active }">
                  <NuxtLink
                    to="/profile"
                    :class="[active ? 'bg-gray-100' : '', 'flex items-center px-4 py-2 text-sm text-gray-700']"
                  >
                    <UserIcon class="h-4 w-4 mr-3" />
                    Mon profil
                  </NuxtLink>
                </MenuItem>
                <MenuItem v-slot="{ active }">
                  <NuxtLink
                    to="/settings"
                    :class="[active ? 'bg-gray-100' : '', 'flex items-center px-4 py-2 text-sm text-gray-700']"
                  >
                    <Cog6ToothIcon class="h-4 w-4 mr-3" />
                    Paramètres
                  </NuxtLink>
                </MenuItem>
                <div class="border-t border-gray-100"></div>
                <MenuItem v-slot="{ active }">
                  <button
                    @click="handleSignOut"
                    :class="[active ? 'bg-gray-100' : '', 'flex items-center w-full text-left px-4 py-2 text-sm text-gray-700']"
                  >
                    <ArrowRightOnRectangleIcon class="h-4 w-4 mr-3" />
                    Se déconnecter
                  </button>
                </MenuItem>
              </div>
            </MenuItems>
          </transition>
        </Menu>
      </div>
    </aside>

    <!-- Overlay mobile -->
    <div 
      v-if="sidebarOpen" 
      class="fixed inset-0 z-40 bg-gray-600 bg-opacity-75 lg:hidden"
      @click="sidebarOpen = false"
    ></div>

    <!-- Contenu principal -->
    <main class="flex-1 lg:ml-64 flex flex-col min-h-0">
      <!-- Header mobile -->
      <div class="lg:hidden bg-white border-b border-gray-200 px-4 py-3">
        <div class="flex items-center justify-between">
          <div class="flex items-center">
            <button
              @click="sidebarOpen = true"
              class="p-2 rounded-md text-gray-400 hover:text-gray-500 hover:bg-gray-100"
            >
              <Bars3Icon class="h-6 w-6" />
            </button>
            <h1 class="ml-3 text-lg font-semibold text-gray-900">
              {{ pageTitle }}
            </h1>
          </div>
          
          <!-- Actions mobiles -->
          <div class="flex items-center space-x-2">
            <!-- Notifications mobile -->
            <button class="p-2 rounded-md text-gray-400 hover:text-gray-500 hover:bg-gray-100 relative">
              <BellIcon class="h-6 w-6" />
              <span 
                v-if="notifications.unread > 0"
                class="absolute -top-1 -right-1 h-4 w-4 bg-blue-500 text-white text-xs rounded-full flex items-center justify-center"
              >
                {{ notifications.unread }}
              </span>
            </button>
          </div>
        </div>
      </div>
      
      <!-- Header desktop -->
      <div class="hidden lg:block bg-white border-b border-gray-200 px-6 py-4">
        <div class="flex items-center justify-between">
          <div>
            <h1 class="text-2xl font-bold text-gray-900">{{ pageTitle }}</h1>
            <p class="mt-1 text-sm text-gray-500">{{ pageDescription }}</p>
          </div>
          
          <div class="flex items-center space-x-4">
            <!-- Recherche globale -->
            <div class="relative">
              <MagnifyingGlassIcon class="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
              <input
                type="text"
                placeholder="Rechercher..."
                class="pl-10 pr-4 py-2 border border-gray-300 rounded-lg text-sm focus:ring-blue-500 focus:border-blue-500 w-64"
              />
            </div>
            
            <!-- Notifications -->
            <button class="p-2 rounded-lg text-gray-400 hover:text-gray-500 hover:bg-gray-100 relative">
              <BellIcon class="h-6 w-6" />
              <span 
                v-if="notifications.unread > 0"
                class="absolute -top-1 -right-1 h-4 w-4 bg-blue-500 text-white text-xs rounded-full flex items-center justify-center"
              >
                {{ notifications.unread }}
              </span>
            </button>
            
            <!-- Bouton CTA principal -->
            <button
              @click="showIntegrationCode = true"
              class="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-lg text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 transition-colors duration-200"
            >
              <CodeBracketIcon class="mr-2 h-4 w-4" />
              Intégrer le widget
            </button>
          </div>
        </div>
      </div>
      
      <!-- Contenu de la page -->
      <div class="flex-1 overflow-y-auto p-6">
        <slot />
      </div>
    </main>

    <!-- Modal code d'intégration -->
    <IntegrationModal 
      :show="showIntegrationCode"
      @close="showIntegrationCode = false"
      :user-id="user?.id"
    />

    <!-- Notifications toast -->
    <div 
      v-if="notification.message" 
      class="fixed top-4 right-4 z-50 max-w-sm"
    >
      <div 
        :class="[
          'p-4 rounded-lg shadow-lg border',
          notification.type === 'success' ? 'bg-green-50 border-green-200 text-green-800' :
          notification.type === 'error' ? 'bg-red-50 border-red-200 text-red-800' :
          'bg-blue-50 border-blue-200 text-blue-800'
        ]"
      >
        <div class="flex items-center">
          <component 
            :is="getNotificationIcon(notification.type)" 
            class="h-5 w-5 mr-3" 
          />
          <p class="text-sm font-medium">{{ notification.message }}</p>
          <button 
            @click="clearNotification"
            class="ml-auto text-gray-400 hover:text-gray-600"
          >
            <XMarkIcon class="h-4 w-4" />
          </button>
        </div>
      </div>
    </div>

    <!-- Loading overlay -->
    <div v-if="isLoading" class="fixed inset-0 bg-gray-500 bg-opacity-75 flex items-center justify-center z-50">
      <div class="bg-white rounded-lg p-6 flex items-center space-x-3 shadow-xl">
        <div class="animate-spin rounded-full h-6 w-6 border-b-2 border-blue-600"></div>
        <span class="text-gray-900 font-medium">Chargement...</span>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, computed, provide } from 'vue'
import { useRoute } from 'vue-router'
import { Menu, MenuButton, MenuItems, MenuItem } from '@headlessui/vue'
import {
  HomeIcon,
  ChatBubbleLeftRightIcon,
  ShoppingBagIcon,
  BookOpenIcon,
  Cog6ToothIcon,
  ChartBarIcon,
  CodeBracketIcon,
  EyeIcon,
  BellIcon,
  MagnifyingGlassIcon,
  Bars3Icon,
  XMarkIcon,
  UserIcon,
  ChevronUpDownIcon,
  ArrowRightOnRectangleIcon,
  CheckCircleIcon,
  ExclamationCircleIcon,
  InformationCircleIcon
} from '@heroicons/vue/24/outline'

// Authentification
const { user, signOut } = useAuth()

// État local
const sidebarOpen = ref(false)
const showIntegrationCode = ref(false)
const isLoading = ref(false)

// Notification système
const notification = ref({
  message: '',
  type: 'info', // 'success' | 'error' | 'info'
  visible: false
})

// Navigation
const navigation = [
  { name: 'Aperçu', href: '/', icon: HomeIcon },
  { name: 'Conversations', href: '/conversations', icon: ChatBubbleLeftRightIcon, badge: '3', badgeColor: 'bg-blue-100 text-blue-800' },
  { name: 'Commandes', href: '/orders', icon: ShoppingBagIcon, badge: '5', badgeColor: 'bg-green-100 text-green-800' },
  { name: 'Base de connaissance', href: '/knowledge', icon: BookOpenIcon },
  { name: 'Analytics', href: '/analytics', icon: ChartBarIcon },
  { name: 'Configuration', href: '/settings', icon: Cog6ToothIcon },
]

// Page info
const route = useRoute()
const pageTitle = computed(() => {
  const currentPage = navigation.find(item => item.href === route.path)
  return currentPage?.name || 'Dashboard'
})

const pageDescription = computed(() => {
  const descriptions: Record<string, string> = {
    '/': 'Suivez les performances de votre Agent IA Commercial',
    '/conversations': 'Gérez et supervisez toutes les conversations clients',
    '/orders': 'Suivez et traitez les commandes collectées par votre agent',
    '/knowledge': 'Gérez le contenu qui alimente votre Agent IA',
    '/analytics': 'Analysez en détail les performances de votre agent',
    '/settings': 'Configurez votre Agent IA et personnalisez le widget'
  }
  return descriptions[route.path] || ''
})

// Fonction pour vérifier si une route est active
const isActiveRoute = (href: string) => {
  if (href === '/') {
    return route.path === '/'
  }
  return route.path.startsWith(href)
}

// Stats et notifications (à connecter avec API)
const stats = ref({
  conversationsToday: 12
})

const notifications = ref({
  unread: 3
})

// Computed
const userInitials = computed(() => {
  if (!user.value?.user_metadata) return 'U'
  const firstName = user.value.user_metadata.firstName || ''
  const lastName = user.value.user_metadata.lastName || ''
  return `${firstName.charAt(0)}${lastName.charAt(0)}`.toUpperCase()
})

// Méthodes
const handleSignOut = async () => {
  isLoading.value = true
  try {
    await signOut()
  } catch (error) {
    showNotification('Erreur lors de la déconnexion', 'error')
  } finally {
    isLoading.value = false
  }
}

const showNotification = (message: string, type: 'success' | 'error' | 'info' = 'info') => {
  notification.value = {
    message,
    type,
    visible: true
  }
  
  setTimeout(() => {
    clearNotification()
  }, 5000)
}

const clearNotification = () => {
  notification.value = {
    message: '',
    type: 'info',
    visible: false
  }
}

const getNotificationIcon = (type: string) => {
  const icons: Record<string, any> = {
    success: CheckCircleIcon,
    error: ExclamationCircleIcon,
    info: InformationCircleIcon
  }
  return icons[type] || InformationCircleIcon
}

// Close mobile menu on route change
watch(() => route.path, () => {
  sidebarOpen.value = false
})

// Provide global state
provide('isLoading', isLoading)
provide('showNotification', showNotification)
</script>