<!-- layouts/dashboard.vue -->
<template>
  <div class="min-h-screen bg-gray-50 flex">
    <!-- Sidebar Desktop -->
    <div class="hidden lg:flex lg:flex-shrink-0">
      <div class="flex flex-col w-64">
        <!-- Sidebar content -->
        <div class="flex flex-col flex-grow bg-white border-r border-gray-200 pt-5 pb-4 overflow-y-auto">
          <!-- Logo -->
          <div class="flex items-center flex-shrink-0 px-6">
            <div class="h-8 w-8 bg-blue-600 rounded-lg flex items-center justify-center mr-3">
              <span class="text-white font-bold text-sm">CS</span>
            </div>
            <h1 class="text-xl font-bold text-gray-900">ChatSeller</h1>
          </div>

          <!-- Navigation -->
          <nav class="mt-8 flex-1 px-4 space-y-1">
            <!-- Dashboard -->
            <NuxtLink
              to="/"
              class="group flex items-center px-3 py-2 text-sm font-medium rounded-md transition-colors"
              :class="$route.path === '/' 
                ? 'bg-blue-50 text-blue-700 border-r-2 border-blue-600' 
                : 'text-gray-600 hover:bg-gray-50 hover:text-gray-900'"
            >
              <HomeIcon 
                class="mr-3 h-5 w-5"
                :class="$route.path === '/' ? 'text-blue-500' : 'text-gray-400 group-hover:text-gray-500'"
              />
              Aperçu
            </NuxtLink>

            <!-- Conversations -->
            <NuxtLink
              to="/conversations"
              class="group flex items-center px-3 py-2 text-sm font-medium rounded-md transition-colors"
              :class="$route.path === '/conversations' 
                ? 'bg-blue-50 text-blue-700 border-r-2 border-blue-600' 
                : 'text-gray-600 hover:bg-gray-50 hover:text-gray-900'"
            >
              <ChatBubbleLeftRightIcon 
                class="mr-3 h-5 w-5"
                :class="$route.path === '/conversations' ? 'text-blue-500' : 'text-gray-400 group-hover:text-gray-500'"
              />
              Conversations
              <span v-if="stats.activeConversations > 0" class="ml-auto bg-blue-600 text-white text-xs font-medium px-2 py-1 rounded-full">
                {{ stats.activeConversations }}
              </span>
            </NuxtLink>

            <!-- Orders -->
            <NuxtLink
              to="/orders"
              class="group flex items-center px-3 py-2 text-sm font-medium rounded-md transition-colors"
              :class="$route.path === '/orders' 
                ? 'bg-blue-50 text-blue-700 border-r-2 border-blue-600' 
                : 'text-gray-600 hover:bg-gray-50 hover:text-gray-900'"
            >
              <ShoppingBagIcon 
                class="mr-3 h-5 w-5"
                :class="$route.path === '/orders' ? 'text-blue-500' : 'text-gray-400 group-hover:text-gray-500'"
              />
              Commandes
              <span v-if="stats.newOrders > 0" class="ml-auto bg-green-500 text-white text-xs font-medium px-2 py-1 rounded-full">
                {{ stats.newOrders }}
              </span>
            </NuxtLink>

            <!-- Knowledge Base -->
            <NuxtLink
              to="/knowledge"
              class="group flex items-center px-3 py-2 text-sm font-medium rounded-md transition-colors"
              :class="$route.path === '/knowledge' 
                ? 'bg-blue-50 text-blue-700 border-r-2 border-blue-600' 
                : 'text-gray-600 hover:bg-gray-50 hover:text-gray-900'"
            >
              <BookOpenIcon 
                class="mr-3 h-5 w-5"
                :class="$route.path === '/knowledge' ? 'text-blue-500' : 'text-gray-400 group-hover:text-gray-500'"
              />
              Base de connaissance
            </NuxtLink>

            <!-- Divider -->
            <div class="border-t border-gray-200 my-4"></div>

            <!-- Settings -->
            <NuxtLink
              to="/settings"
              class="group flex items-center px-3 py-2 text-sm font-medium rounded-md transition-colors"
              :class="$route.path === '/settings' 
                ? 'bg-blue-50 text-blue-700 border-r-2 border-blue-600' 
                : 'text-gray-600 hover:bg-gray-50 hover:text-gray-900'"
            >
              <Cog6ToothIcon 
                class="mr-3 h-5 w-5"
                :class="$route.path === '/settings' ? 'text-blue-500' : 'text-gray-400 group-hover:text-gray-500'"
              />
              Configuration
            </NuxtLink>
          </nav>

          <!-- Bottom section -->
          <div class="flex-shrink-0 border-t border-gray-200 p-4">
            <!-- Test widget button -->
            <button
              @click="testWidget"
              class="w-full bg-blue-600 text-white px-4 py-2 rounded-md text-sm font-medium hover:bg-blue-700 transition-colors flex items-center justify-center mb-4"
            >
              <EyeIcon class="h-4 w-4 mr-2" />
              Voir le widget
            </button>

            <!-- User profile -->
            <div class="relative">
              <button
                @click="toggleUserMenu"
                class="w-full flex items-center space-x-3 text-left p-2 rounded-md hover:bg-gray-50 transition-colors"
              >
                <div class="h-8 w-8 bg-gradient-to-r from-blue-500 to-blue-600 rounded-full flex items-center justify-center">
                  <span class="text-white font-medium text-sm">
                    {{ userInitials }}
                  </span>
                </div>
                <div class="flex-1 min-w-0">
                  <p class="text-sm font-medium text-gray-900 truncate">
                    {{ user?.user_metadata?.firstName }} {{ user?.user_metadata?.lastName }}
                  </p>
                  <p class="text-xs text-gray-500 truncate">
                    {{ user?.email }}
                  </p>
                </div>
                <ChevronUpDownIcon class="h-4 w-4 text-gray-400" />
              </button>

              <!-- User dropdown -->
              <div
                v-if="isUserMenuOpen"
                class="absolute bottom-full left-0 right-0 mb-2 bg-white rounded-md shadow-lg py-1 z-10 border border-gray-200"
              >
                <a href="#" class="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-100">
                  <UserIcon class="h-4 w-4 inline mr-2" />
                  Mon profil
                </a>
                <a href="#" class="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-100">
                  <Cog6ToothIcon class="h-4 w-4 inline mr-2" />
                  Paramètres
                </a>
                <div class="border-t border-gray-100"></div>
                <button
                  @click="handleSignOut"
                  class="w-full text-left px-4 py-2 text-sm text-gray-700 hover:bg-gray-100"
                >
                  <ArrowRightOnRectangleIcon class="h-4 w-4 inline mr-2" />
                  Se déconnecter
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>

    <!-- Mobile sidebar -->
    <div v-if="isMobileMenuOpen" class="fixed inset-0 z-40 flex lg:hidden">
      <!-- Backdrop -->
      <div class="fixed inset-0 bg-gray-600 bg-opacity-75" @click="closeMobileMenu"></div>

      <!-- Sidebar -->
      <div class="relative flex flex-col max-w-xs w-full bg-white">
        <div class="absolute top-0 right-0 -mr-12 pt-2">
          <button
            @click="closeMobileMenu"
            class="ml-1 flex items-center justify-center h-10 w-10 rounded-full focus:outline-none focus:ring-2 focus:ring-inset focus:ring-white"
          >
            <XMarkIcon class="h-6 w-6 text-white" />
          </button>
        </div>

        <!-- Mobile nav content (same as desktop) -->
        <div class="flex-1 h-0 pt-5 pb-4 overflow-y-auto">
          <!-- Logo -->
          <div class="flex items-center flex-shrink-0 px-6">
            <div class="h-8 w-8 bg-blue-600 rounded-lg flex items-center justify-center mr-3">
              <span class="text-white font-bold text-sm">CS</span>
            </div>
            <h1 class="text-xl font-bold text-gray-900">ChatSeller</h1>
          </div>

          <!-- Mobile Navigation (same structure as desktop) -->
          <nav class="mt-8 px-4 space-y-1">
            <!-- Same nav items as desktop -->
          </nav>
        </div>
      </div>
    </div>

    <!-- Main content area -->
    <div class="flex flex-col flex-1 overflow-hidden">
      <!-- Mobile top bar -->
      <div class="lg:hidden bg-white border-b border-gray-200 px-4 py-2 flex items-center justify-between">
        <button
          @click="toggleMobileMenu"
          class="text-gray-500 hover:text-gray-700"
        >
          <Bars3Icon class="h-6 w-6" />
        </button>
        
        <div class="flex items-center space-x-4">
          <!-- Notifications -->
          <button class="text-gray-500 hover:text-gray-700 relative">
            <BellIcon class="h-6 w-6" />
            <span v-if="stats.totalNotifications > 0" class="absolute -top-1 -right-1 h-3 w-3 bg-red-500 rounded-full"></span>
          </button>
        </div>
      </div>

      <!-- Page content -->
      <main class="flex-1 relative overflow-y-auto focus:outline-none">
        <slot />
      </main>
    </div>

    <!-- Notifications -->
    <div v-if="notification" class="fixed top-4 right-4 z-50">
      <div class="bg-blue-600 text-white px-6 py-3 rounded-md shadow-lg">
        <p class="text-sm font-medium">{{ notification }}</p>
      </div>
    </div>

    <!-- Loading overlay -->
    <div v-if="isLoading" class="fixed inset-0 bg-gray-500 bg-opacity-75 flex items-center justify-center z-50">
      <div class="bg-white rounded-lg p-6 flex items-center space-x-3">
        <div class="animate-spin rounded-full h-6 w-6 border-b-2 border-blue-600"></div>
        <span class="text-gray-900">Chargement...</span>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import {
  HomeIcon,
  ChatBubbleLeftRightIcon,
  ShoppingBagIcon,
  BookOpenIcon,
  Cog6ToothIcon,
  EyeIcon,
  UserIcon,
  BellIcon,
  Bars3Icon,
  XMarkIcon,
  ChevronUpDownIcon,
  ArrowRightOnRectangleIcon
} from '@heroicons/vue/24/outline'

// Auth
const { user, signOut } = useAuth()

// Runtime config
const config = useRuntimeConfig()

// State
const isMobileMenuOpen = ref(false)
const isUserMenuOpen = ref(false)
const isLoading = ref(false)
const notification = ref('')

// Mock stats
const stats = ref({
  activeConversations: 3,
  newOrders: 5,
  totalNotifications: 8
})

// Computed
const userInitials = computed(() => {
  if (!user.value?.user_metadata) return 'U'
  const firstName = user.value.user_metadata.firstName || ''
  const lastName = user.value.user_metadata.lastName || ''
  return `${firstName.charAt(0)}${lastName.charAt(0)}`.toUpperCase()
})

// Methods
const toggleMobileMenu = () => {
  isMobileMenuOpen.value = !isMobileMenuOpen.value
  if (isMobileMenuOpen.value) {
    isUserMenuOpen.value = false
  }
}

const closeMobileMenu = () => {
  isMobileMenuOpen.value = false
}

const toggleUserMenu = () => {
  isUserMenuOpen.value = !isUserMenuOpen.value
}

const testWidget = () => {
  window.open(`${config.public.widgetUrl}/`, '_blank')
}

const handleSignOut = async () => {
  isLoading.value = true
  await signOut()
  isLoading.value = false
}

// Close menus when clicking outside
const closeMenus = (event: Event) => {
  const target = event.target as HTMLElement
  if (!target.closest('.relative')) {
    isUserMenuOpen.value = false
  }
}

// Close mobile menu on route change
watch(() => useRoute().path, () => {
  isMobileMenuOpen.value = false
  isUserMenuOpen.value = false
})

// Lifecycle
onMounted(() => {
  document.addEventListener('click', closeMenus)
})

onUnmounted(() => {
  document.removeEventListener('click', closeMenus)
})

// Provide global state
provide('isLoading', isLoading)
provide('setNotification', (message: string) => {
  notification.value = message
  setTimeout(() => {
    notification.value = ''
  }, 5000)
})
</script>