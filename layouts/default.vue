<template>
  <div id="app" class="min-h-screen bg-gray-50">
    <!-- Skip to main content for accessibility -->
    <a href="#main-content" class="sr-only focus:not-sr-only focus:absolute focus:top-0 focus:left-0 bg-pink-600 text-white p-2 rounded">
      Aller au contenu principal
    </a>

    <!-- Global notification area -->
    <div v-if="notification" class="fixed top-0 left-0 right-0 z-50">
      <div class="bg-pink-600 text-white px-4 py-3 text-center">
        <p class="text-sm">{{ notification }}</p>
      </div>
    </div>

    <!-- Main layout -->
    <div class="flex flex-col min-h-screen">
      <!-- Header -->
      <header class="bg-white shadow-sm border-b border-gray-200">
        <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div class="flex justify-between h-16">
            <!-- Logo and main navigation -->
            <div class="flex items-center">
              <div class="flex-shrink-0">
                <NuxtLink to="/" class="flex items-center">
                  <div class="h-8 w-8 bg-pink-600 rounded-lg flex items-center justify-center mr-3">
                    <span class="text-white font-bold text-sm">CS</span>
                  </div>
                  <h1 class="text-xl font-bold text-pink-600">ChatSeller</h1>
                </NuxtLink>
              </div>
              
              <!-- Desktop navigation -->
              <nav class="hidden sm:ml-6 sm:flex sm:space-x-8">
                <NuxtLink
                  to="/"
                  class="nav-link"
                  :class="{ 'nav-link-active': $route.path === '/' }"
                >
                  Aperçu
                </NuxtLink>
                <NuxtLink
                  to="/conversations"
                  class="nav-link"
                  :class="{ 'nav-link-active': $route.path === '/conversations' }"
                >
                  Conversations
                </NuxtLink>
                <NuxtLink
                  to="/orders"
                  class="nav-link"
                  :class="{ 'nav-link-active': $route.path === '/orders' }"
                >
                  Commandes
                </NuxtLink>
                <NuxtLink
                  to="/knowledge"
                  class="nav-link"
                  :class="{ 'nav-link-active': $route.path === '/knowledge' }"
                >
                  Base de connaissance
                </NuxtLink>
                <NuxtLink
                  to="/settings"
                  class="nav-link"
                  :class="{ 'nav-link-active': $route.path === '/settings' }"
                >
                  Configuration
                </NuxtLink>
              </nav>
            </div>

            <!-- Right side items -->
            <div class="flex items-center space-x-4">
              <!-- Test widget button -->
              <button
                @click="testWidget"
                class="bg-pink-600 text-white px-4 py-2 rounded-md text-sm font-medium hover:bg-pink-700 transition-colors"
                title="Tester le widget"
              >
                Voir le widget
              </button>

              <!-- Notifications (future feature) -->
              <button class="text-gray-500 hover:text-gray-700 relative">
                <BellIcon class="h-6 w-6" />
                <span class="absolute -top-1 -right-1 h-3 w-3 bg-red-500 rounded-full"></span>
              </button>

              <!-- User menu -->
              <div class="relative">
                <button
                  @click="toggleUserMenu"
                  class="flex items-center space-x-2 text-gray-500 hover:text-gray-700"
                >
                  <div class="h-8 w-8 bg-gray-300 rounded-full flex items-center justify-center">
                    <UserIcon class="h-5 w-5 text-gray-600" />
                  </div>
                  <ChevronDownIcon class="h-4 w-4" />
                </button>
                
                <!-- User dropdown -->
                <div
                  v-if="isUserMenuOpen"
                  class="absolute right-0 mt-2 w-48 bg-white rounded-md shadow-lg py-1 z-10"
                  @click.outside="closeUserMenu"
                >
                  <a href="#" class="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-100">Mon profil</a>
                  <a href="#" class="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-100">Paramètres</a>
                  <div class="border-t border-gray-100"></div>
                  <a href="#" class="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-100">Se déconnecter</a>
                </div>
              </div>

              <!-- Mobile menu button -->
              <button
                @click="toggleMobileMenu"
                class="sm:hidden text-gray-500 hover:text-gray-700"
              >
                <Bars3Icon v-if="!isMobileMenuOpen" class="h-6 w-6" />
                <XMarkIcon v-else class="h-6 w-6" />
              </button>
            </div>
          </div>

          <!-- Mobile navigation -->
          <div v-if="isMobileMenuOpen" class="sm:hidden border-t border-gray-200 py-4">
            <div class="space-y-1">
              <NuxtLink
                to="/"
                class="mobile-nav-link"
                :class="{ 'mobile-nav-link-active': $route.path === '/' }"
                @click="closeMobileMenu"
              >
                Aperçu
              </NuxtLink>
              <NuxtLink
                to="/conversations"
                class="mobile-nav-link"
                :class="{ 'mobile-nav-link-active': $route.path === '/conversations' }"
                @click="closeMobileMenu"
              >
                Conversations
              </NuxtLink>
              <NuxtLink
                to="/orders"
                class="mobile-nav-link"
                :class="{ 'mobile-nav-link-active': $route.path === '/orders' }"
                @click="closeMobileMenu"
              >
                Commandes
              </NuxtLink>
              <NuxtLink
                to="/knowledge"
                class="mobile-nav-link"
                :class="{ 'mobile-nav-link-active': $route.path === '/knowledge' }"
                @click="closeMobileMenu"
              >
                Base de connaissance
              </NuxtLink>
              <NuxtLink
                to="/settings"
                class="mobile-nav-link"
                :class="{ 'mobile-nav-link-active': $route.path === '/settings' }"
                @click="closeMobileMenu"
              >
                Configuration
              </NuxtLink>
            </div>
          </div>
        </div>
      </header>

      <!-- Main content -->
      <main id="main-content" class="flex-1">
        <slot />
      </main>

      <!-- Footer -->
      <footer class="bg-white border-t border-gray-200 mt-auto">
        <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
          <div class="flex justify-between items-center">
            <p class="text-sm text-gray-500">
              © 2025 ChatSeller by Dukka. Tous droits réservés.
            </p>
            <div class="flex space-x-6">
              <a href="#" class="text-sm text-gray-500 hover:text-gray-700">Support</a>
              <a href="#" class="text-sm text-gray-500 hover:text-gray-700">Documentation</a>
              <a href="#" class="text-sm text-gray-500 hover:text-gray-700">Statut</a>
            </div>
          </div>
        </div>
      </footer>
    </div>

    <!-- Loading overlay -->
    <div v-if="isLoading" class="fixed inset-0 bg-gray-500 bg-opacity-75 flex items-center justify-center z-50">
      <div class="bg-white rounded-lg p-6 flex items-center space-x-3">
        <div class="animate-spin rounded-full h-6 w-6 border-b-2 border-pink-600"></div>
        <span class="text-gray-900">Chargement...</span>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import {
  BellIcon,
  UserIcon,
  ChevronDownIcon,
  Bars3Icon,
  XMarkIcon
} from '@heroicons/vue/24/outline'

// State
const isUserMenuOpen = ref(false)
const isMobileMenuOpen = ref(false)
const isLoading = ref(false)
const notification = ref('')

// Runtime config
const config = useRuntimeConfig()

// Methods
const toggleUserMenu = () => {
  isUserMenuOpen.value = !isUserMenuOpen.value
  if (isUserMenuOpen.value) {
    isMobileMenuOpen.value = false
  }
}

const closeUserMenu = () => {
  isUserMenuOpen.value = false
}

const toggleMobileMenu = () => {
  isMobileMenuOpen.value = !isMobileMenuOpen.value
  if (isMobileMenuOpen.value) {
    isUserMenuOpen.value = false
  }
}

const closeMobileMenu = () => {
  isMobileMenuOpen.value = false
}

const testWidget = () => {
  window.open(`${config.public.widgetUrl}/`, '_blank')
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
})

// Lifecycle
onMounted(() => {
  document.addEventListener('click', closeMenus)
})

onUnmounted(() => {
  document.removeEventListener('click', closeMenus)
})

// Provide global loading state
provide('isLoading', isLoading)
provide('setNotification', (message: string) => {
  notification.value = message
  setTimeout(() => {
    notification.value = ''
  }, 5000)
})
</script>