<!-- layouts/default.vue -->
<template>
  <div class="min-h-screen bg-gray-50">
    <!-- Loading Screen -->
    <div v-if="isInitializing" class="min-h-screen flex items-center justify-center">
      <div class="text-center">
        <div class="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto mb-4"></div>
        <p class="text-gray-600">Chargement de ChatSeller...</p>
      </div>
    </div>

    <!-- Main Layout -->
    <div v-else class="flex">
      <!-- Sidebar -->
      <div class="w-64 bg-white shadow-lg min-h-screen">
        <!-- Logo -->
        <div class="p-6 border-b border-gray-200">
          <div class="flex items-center">
            <div class="w-8 h-8 bg-blue-600 rounded-lg flex items-center justify-center">
              <span class="text-white font-bold text-sm">CS</span>
            </div>
            <div class="ml-3">
              <h1 class="text-xl font-bold text-gray-900">ChatSeller</h1>
              <p class="text-xs text-gray-500">Dashboard</p>
            </div>
          </div>
        </div>

        <!-- Navigation -->
        <nav class="mt-6">
          <div class="px-3">
            <NuxtLink
              v-for="item in navigation"
              :key="item.name"
              :to="item.href"
              class="group flex items-center px-3 py-2 text-sm font-medium rounded-md mb-1 transition-colors"
              :class="isActiveRoute(item.href) 
                ? 'bg-blue-100 text-blue-700' 
                : 'text-gray-700 hover:bg-gray-100 hover:text-gray-900'"
            >
              <component 
                :is="item.icon" 
                class="mr-3 h-5 w-5 flex-shrink-0"
                :class="isActiveRoute(item.href) ? 'text-blue-500' : 'text-gray-400 group-hover:text-gray-500'"
              />
              {{ item.name }}
              
              <!-- Badge for active conversations -->
              <span 
                v-if="item.name === 'Conversations' && activeConversationsCount > 0"
                class="ml-auto bg-red-500 text-white text-xs rounded-full px-2 py-1 min-w-0"
              >
                {{ activeConversationsCount }}
              </span>
            </NuxtLink>
          </div>

          <!-- Separator -->
          <div class="border-t border-gray-200 mt-6 pt-6 px-3">
            <p class="px-3 text-xs font-semibold text-gray-500 uppercase tracking-wider">
              Configuration
            </p>
            <div class="mt-2">
              <NuxtLink
                to="/settings"
                class="group flex items-center px-3 py-2 text-sm font-medium rounded-md transition-colors"
                :class="isActiveRoute('/settings') 
                  ? 'bg-blue-100 text-blue-700' 
                  : 'text-gray-700 hover:bg-gray-100 hover:text-gray-900'"
              >
                <svg class="mr-3 h-5 w-5 flex-shrink-0" :class="isActiveRoute('/settings') ? 'text-blue-500' : 'text-gray-400 group-hover:text-gray-500'" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M10.325 4.317c.426-1.756 2.924-1.756 3.35 0a1.724 1.724 0 002.573 1.066c1.543-.94 3.31.826 2.37 2.37a1.724 1.724 0 001.065 2.572c1.756.426 1.756 2.924 0 3.35a1.724 1.724 0 00-1.066 2.573c.94 1.543-.826 3.31-2.37 2.37a1.724 1.724 0 00-2.572 1.065c-.426 1.756-2.924 1.756-3.35 0a1.724 1.724 0 00-2.573-1.066c-1.543.94-3.31-.826-2.37-2.37a1.724 1.724 0 00-1.065-2.572c-1.756-.426-1.756-2.924 0-3.35a1.724 1.724 0 001.066-2.573c-.94-1.543.826-3.31 2.37-2.37.996.608 2.296.07 2.572-1.065z" />
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                </svg>
                Paramètres
              </NuxtLink>
            </div>
          </div>
        </nav>

        <!-- User Menu -->
        <div class="absolute bottom-0 w-64 p-4 border-t border-gray-200">
          <div class="flex items-center">
            <div class="flex-shrink-0">
              <div class="w-8 h-8 bg-gray-300 rounded-full flex items-center justify-center">
                <span class="text-sm font-medium text-gray-700">
                  {{ userInitials }}
                </span>
              </div>
            </div>
            <div class="ml-3 flex-1">
              <p class="text-sm font-medium text-gray-900 truncate">
                {{ userDisplayName }}
              </p>
              <p class="text-xs text-gray-500 truncate">
                {{ user?.email }}
              </p>
            </div>
            <button
              @click="handleLogout"
              class="flex-shrink-0 p-1 text-gray-400 hover:text-gray-600"
              title="Se déconnecter"
            >
              <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1" />
              </svg>
            </button>
          </div>
        </div>
      </div>

      <!-- Main Content -->
      <div class="flex-1 flex flex-col">
        <!-- Top Bar -->
        <header class="bg-white shadow-sm border-b border-gray-200">
          <div class="px-6 py-4">
            <div class="flex items-center justify-between">
              <!-- Page Title would go here if needed -->
              <div></div>
              
              <!-- Right side actions -->
              <div class="flex items-center space-x-4">
                <!-- Notification Bell -->
                <button 
                  class="p-2 text-gray-400 hover:text-gray-600 relative"
                  title="Notifications"
                >
                  <svg class="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M15 17h5l-5 5v-5zM15 17H9a2 2 0 01-2-2V9a2 2 0 012-2h6m0 10V9a2 2 0 00-2-2H9" />
                  </svg>
                  <span v-if="activeConversationsCount > 0" class="absolute -top-1 -right-1 bg-red-500 text-white text-xs rounded-full w-5 h-5 flex items-center justify-center">
                    {{ activeConversationsCount > 9 ? '9+' : activeConversationsCount }}
                  </span>
                </button>

                <!-- Connection Status -->
                <div class="flex items-center space-x-2">
                  <div 
                    class="w-2 h-2 rounded-full" 
                    :class="connectionStatus === 'connected' ? 'bg-green-500' : 'bg-red-500'"
                  ></div>
                  <span class="text-sm text-gray-600">
                    {{ connectionStatus === 'connected' ? 'Connecté' : 'Déconnecté' }}
                  </span>
                </div>
              </div>
            </div>
          </div>
        </header>

        <!-- Page Content -->
        <main class="flex-1 p-6 overflow-auto">
          <slot />
        </main>
      </div>
    </div>

    <!-- Notifications -->
    <div class="fixed top-4 right-4 z-50 space-y-2">
      <div
        v-for="notification in notifications"
        :key="notification.id"
        class="max-w-sm w-full bg-white shadow-lg rounded-lg pointer-events-auto"
        :class="getNotificationClasses(notification.type)"
      >
        <div class="p-4">
          <div class="flex items-start">
            <div class="flex-shrink-0">
              <span class="text-lg">{{ getNotificationIcon(notification.type) }}</span>
            </div>
            <div class="ml-3 w-0 flex-1">
              <p class="text-sm font-medium">
                {{ notification.title }}
              </p>
              <p v-if="notification.message" class="mt-1 text-sm opacity-90">
                {{ notification.message }}
              </p>
              
              <!-- Actions -->
              <div v-if="notification.actions && notification.actions.length > 0" class="mt-3 flex space-x-2">
                <button
                  v-for="action in notification.actions"
                  :key="action.label"
                  @click="() => { action.action(); removeNotification(notification.id) }"
                  class="text-sm px-3 py-1 rounded-md"
                  :class="action.style === 'primary' 
                    ? 'bg-blue-600 text-white hover:bg-blue-700' 
                    : 'bg-gray-200 text-gray-800 hover:bg-gray-300'"
                >
                  {{ action.label }}
                </button>
              </div>
            </div>
            <div class="ml-4 flex-shrink-0 flex">
              <button
                @click="removeNotification(notification.id)"
                class="bg-white rounded-md inline-flex text-gray-400 hover:text-gray-500 focus:outline-none"
              >
                <svg class="h-5 w-5" fill="currentColor" viewBox="0 0 20 20">
                  <path fill-rule="evenodd" d="M4.293 4.293a1 1 0 011.414 0L10 8.586l4.293-4.293a1 1 0 111.414 1.414L11.414 10l4.293 4.293a1 1 0 01-1.414 1.414L10 11.414l-4.293 4.293a1 1 0 01-1.414-1.414L8.586 10 4.293 5.707a1 1 0 010-1.414z" clip-rule="evenodd" />
                </svg>
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
// =====================================
// COMPOSABLES AND STORES
// =====================================

const route = useRoute()
const { 
  user, 
  isAuthenticated, 
  userDisplayName, 
  logout, 
  initialize 
} = useAuth()

const { activeCount } = useConversations()

const { 
  notifications, 
  removeNotification, 
  getNotificationIcon, 
  getNotificationClasses,
  confirm
} = useNotifications()

// =====================================
// REACTIVE STATE
// =====================================

const isInitializing = ref(true)
const connectionStatus = ref<'connected' | 'disconnected'>('connected')

// =====================================
// COMPUTED
// =====================================

const activeConversationsCount = computed(() => activeCount.value)

const userInitials = computed(() => {
  if (!user.value) return '?'
  
  const name = user.value.name || user.value.email
  const parts = name.split(' ')
  
  if (parts.length >= 2) {
    return `${parts[0][0]}${parts[1][0]}`.toUpperCase()
  }
  
  return name.substring(0, 2).toUpperCase()
})

// =====================================
// NAVIGATION
// =====================================

const navigation = [
  {
    name: 'Dashboard',
    href: '/',
    icon: resolveComponent('IconHome')
  },
  {
    name: 'Conversations',
    href: '/conversations',
    icon: resolveComponent('IconChat')
  },
  {
    name: 'Commandes',
    href: '/orders',
    icon: resolveComponent('IconShoppingBag')
  },
  {
    name: 'Analytics',
    href: '/analytics',
    icon: resolveComponent('IconChart')
  },
  {
    name: 'Base de connaissance',
    href: '/knowledge-base',
    icon: resolveComponent('IconBook')
  }
]

// Icon components (simple SVG implementations)
const IconHome = {
  template: `
    <svg fill="none" stroke="currentColor" viewBox="0 0 24 24">
      <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M3 12l2-2m0 0l7-7 7 7M5 10v10a1 1 0 001 1h3m10-11l2 2m-2-2v10a1 1 0 01-1 1h-3m-6 0a1 1 0 001-1v-4a1 1 0 011-1h2a1 1 0 011 1v4a1 1 0 001 1m-6 0h6" />
    </svg>
  `
}

const IconChat = {
  template: `
    <svg fill="none" stroke="currentColor" viewBox="0 0 24 24">
      <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z" />
    </svg>
  `
}

const IconShoppingBag = {
  template: `
    <svg fill="none" stroke="currentColor" viewBox="0 0 24 24">
      <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M16 11V7a4 4 0 00-8 0v4M5 9h14l1 12H4L5 9z" />
    </svg>
  `
}

const IconChart = {
  template: `
    <svg fill="none" stroke="currentColor" viewBox="0 0 24 24">
      <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" />
    </svg>
  `
}

const IconBook = {
  template: `
    <svg fill="none" stroke="currentColor" viewBox="0 0 24 24">
      <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.747 0 3.332.477 4.5 1.253v13C19.832 18.477 18.246 18 16.5 18c-1.746 0-3.332.477-4.5 1.253" />
    </svg>
  `
}

// =====================================
// METHODS
// =====================================

/**
 * Check if route is active
 */
const isActiveRoute = (href: string): boolean => {
  if (href === '/') {
    return route.path === '/'
  }
  return route.path.startsWith(href)
}

/**
 * Handle user logout
 */
const handleLogout = (): void => {
  confirm(
    'Déconnexion',
    'Êtes-vous sûr de vouloir vous déconnecter ?',
    async () => {
      await logout()
    },
    undefined,
    {
      confirmLabel: 'Se déconnecter',
      cancelLabel: 'Annuler',
      type: 'warning'
    }
  )
}

/**
 * Monitor connection status
 */
const monitorConnection = (): void => {
  const checkConnection = async () => {
    try {
      // Simple ping to check API connectivity
      await $fetch('/health', { 
        baseURL: 'https://api.chatseller.app',
        timeout: 5000 
      })
      connectionStatus.value = 'connected'
    } catch {
      connectionStatus.value = 'disconnected'
    }
  }

  // Check immediately
  checkConnection()
  
  // Check every 30 seconds
  setInterval(checkConnection, 30000)
}

// =====================================
// LIFECYCLE
// =====================================

onMounted(async () => {
  try {
    // Initialize authentication
    await initialize()
    
    // Start connection monitoring
    monitorConnection()
    
  } catch (error) {
    console.error('Layout initialization error:', error)
  } finally {
    isInitializing.value = false
  }
})

// =====================================
// WATCHERS
// =====================================

// Redirect to login if not authenticated
watch(isAuthenticated, (authenticated) => {
  if (!authenticated && !isInitializing.value) {
    navigateTo('/login')
  }
})
</script>