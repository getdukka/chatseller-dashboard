<!-- layouts/default.vue -->
<template>
  <div class="min-h-screen bg-gray-50">
    <!-- Sidebar fixe -->
    <div class="fixed inset-y-0 left-0 z-50 w-64 bg-white shadow-lg">
      <!-- Header sidebar -->
      <div class="flex h-16 items-center justify-between px-6 border-b border-gray-200">
        <div class="flex items-center space-x-3">
          <div class="flex h-8 w-8 items-center justify-center rounded-lg bg-blue-600">
            <span class="text-sm font-bold text-white">CS</span>
          </div>
          <span class="text-lg font-semibold text-gray-900">ChatSeller</span>
        </div>
      </div>

      <!-- Navigation principale -->
      <nav class="flex-1 space-y-1 px-4 py-6">
        <NuxtLink
          to="/"
          class="group flex items-center rounded-md px-3 py-2 text-sm font-medium transition-colors"
          :class="$route.path === '/' 
            ? 'bg-blue-50 text-blue-700 border-r-2 border-blue-600' 
            : 'text-gray-700 hover:bg-gray-50 hover:text-gray-900'"
        >
          <svg class="mr-3 h-5 w-5" :class="$route.path === '/' ? 'text-blue-600' : 'text-gray-400'" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M3 7v10a2 2 0 002 2h14a2 2 0 002-2V9a2 2 0 00-2-2H5a2 2 0 00-2-2z" />
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M8 21l4-4 4 4" />
          </svg>
          Dashboard
        </NuxtLink>

        <NuxtLink
          to="/conversations"
          class="group flex items-center rounded-md px-3 py-2 text-sm font-medium transition-colors"
          :class="$route.path === '/conversations' 
            ? 'bg-blue-50 text-blue-700 border-r-2 border-blue-600' 
            : 'text-gray-700 hover:bg-gray-50 hover:text-gray-900'"
        >
          <svg class="mr-3 h-5 w-5" :class="$route.path === '/conversations' ? 'text-blue-600' : 'text-gray-400'" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z" />
          </svg>
          Conversations
        </NuxtLink>

        <NuxtLink
          to="/orders"
          class="group flex items-center rounded-md px-3 py-2 text-sm font-medium transition-colors"
          :class="$route.path === '/orders' 
            ? 'bg-blue-50 text-blue-700 border-r-2 border-blue-600' 
            : 'text-gray-700 hover:bg-gray-50 hover:text-gray-900'"
        >
          <svg class="mr-3 h-5 w-5" :class="$route.path === '/orders' ? 'text-blue-600' : 'text-gray-400'" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M16 11V7a4 4 0 00-8 0v4M5 9h14l1 12H4L5 9z" />
          </svg>
          Commandes
        </NuxtLink>

        <NuxtLink
          to="/analytics"
          class="group flex items-center rounded-md px-3 py-2 text-sm font-medium transition-colors"
          :class="$route.path === '/analytics' 
            ? 'bg-blue-50 text-blue-700 border-r-2 border-blue-600' 
            : 'text-gray-700 hover:bg-gray-50 hover:text-gray-900'"
        >
          <svg class="mr-3 h-5 w-5" :class="$route.path === '/analytics' ? 'text-blue-600' : 'text-gray-400'" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2-2V7a2 2 0 012-2h2a2 2 0 002 2v2a2 2 0 002 2h2a2 2 0 002-2V7a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 00-2 2h-2a2 2 0 00-2 2v6a2 2 0 01-2 2H9z" />
          </svg>
          Analytics
        </NuxtLink>

        <NuxtLink
          to="/knowledge-base"
          class="group flex items-center rounded-md px-3 py-2 text-sm font-medium transition-colors"
          :class="$route.path === '/knowledge-base' 
            ? 'bg-blue-50 text-blue-700 border-r-2 border-blue-600' 
            : 'text-gray-700 hover:bg-gray-50 hover:text-gray-900'"
        >
          <svg class="mr-3 h-5 w-5" :class="$route.path === '/knowledge-base' ? 'text-blue-600' : 'text-gray-400'" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.746 0 3.332.477 4.5 1.253v13C19.832 18.477 18.246 18 16.5 18c-1.746 0-3.332.477-4.5 1.253" />
          </svg>
          Base de connaissance
        </NuxtLink>

        <NuxtLink
          to="/settings"
          class="group flex items-center rounded-md px-3 py-2 text-sm font-medium transition-colors"
          :class="$route.path === '/settings' 
            ? 'bg-blue-50 text-blue-700 border-r-2 border-blue-600' 
            : 'text-gray-700 hover:bg-gray-50 hover:text-gray-900'"
        >
          <svg class="mr-3 h-5 w-5" :class="$route.path === '/settings' ? 'text-blue-600' : 'text-gray-400'" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M10.325 4.317c.426-1.756 2.924-1.756 3.35 0a1.724 1.724 0 002.573 1.066c1.543-.94 3.31.826 2.37 2.37a1.724 1.724 0 001.065 2.572c1.756.426 1.756 2.924 0 3.35a1.724 1.724 0 00-1.066 2.573c.94 1.543-.826 3.31-2.37 2.37a1.724 1.724 0 00-2.572 1.065c-.426 1.756-2.924 1.756-3.35 0a1.724 1.724 0 00-2.573-1.066c-1.543.94-3.31-.826-2.37-2.37a1.724 1.724 0 00-1.065-2.572c-1.756-.426-1.756-2.924 0-3.35a1.724 1.724 0 001.066-2.573c-.94-1.543.826-3.31 2.37-2.37.996.608 2.296.07 2.572-1.065z" />
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
          </svg>
          Paramètres
        </NuxtLink>
      </nav>

      <!-- Profil utilisateur en bas -->
      <div class="border-t border-gray-200 p-4">
        <div class="flex items-center space-x-3">
          <div class="flex h-8 w-8 items-center justify-center rounded-full bg-blue-100">
            <span class="text-sm font-medium text-blue-700">A</span>
          </div>
          <div class="flex-1 min-w-0">
            <p class="text-sm font-medium text-gray-900 truncate">
              Administrateur
            </p>
            <p class="text-xs text-gray-500 truncate">
              admin@chatseller.app
            </p>
          </div>
        </div>
        
        <button
          @click="logout"
          class="mt-3 w-full flex items-center justify-center px-3 py-2 text-sm font-medium text-gray-700 bg-gray-50 border border-gray-200 rounded-md hover:bg-gray-100 hover:text-gray-900 transition-colors"
        >
          <svg class="mr-2 h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1" />
          </svg>
          Se déconnecter
        </button>
      </div>
    </div>

    <!-- Zone de contenu principale -->
    <div class="pl-64">
      <main class="min-h-screen">
        <slot />
      </main>
    </div>

    <!-- Responsive mobile overlay -->
    <div 
      v-if="mobileMenuOpen" 
      class="fixed inset-0 z-40 lg:hidden"
      @click="mobileMenuOpen = false"
    >
      <div class="fixed inset-0 bg-gray-600 bg-opacity-75"></div>
    </div>

    <!-- Mobile menu button -->
    <div class="lg:hidden fixed top-4 left-4 z-50">
      <button
        @click="mobileMenuOpen = !mobileMenuOpen"
        class="inline-flex items-center justify-center p-2 rounded-md text-gray-400 hover:text-gray-500 hover:bg-gray-100 focus:outline-none focus:ring-2 focus:ring-inset focus:ring-blue-500"
      >
        <span class="sr-only">Ouvrir le menu</span>
        <svg class="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M4 6h16M4 12h16M4 18h16" />
        </svg>
      </button>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref } from 'vue'
import { useAuthStore } from '~/stores/auth'

const authStore = useAuthStore()
const mobileMenuOpen = ref(false)

const logout = async () => {
  await authStore.logout()
  await navigateTo('/login')
}

// Responsiveness
const isDesktop = ref(true)

onMounted(() => {
  const checkScreenSize = () => {
    isDesktop.value = window.innerWidth >= 1024
  }
  
  checkScreenSize()
  window.addEventListener('resize', checkScreenSize)
  
  onUnmounted(() => {
    window.removeEventListener('resize', checkScreenSize)
  })
})
</script>

<style scoped>
/* Styles pour assurer la sidebar fixe sur tous les devices */
@media (max-width: 1023px) {
  .pl-64 {
    padding-left: 0;
  }
}

/* Transitions fluides */
.transition-colors {
  transition: color 0.15s ease-in-out, background-color 0.15s ease-in-out, border-color 0.15s ease-in-out;
}
</style>