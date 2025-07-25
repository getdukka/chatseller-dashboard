<!-- layouts/default.vue - SIDEBAR MODERNE CORRIGÉ -->
<template>
  <div class="min-h-screen bg-gray-50">
    <!-- Sidebar fixe -->
    <div class="fixed inset-y-0 left-0 z-50 w-64 bg-white shadow-xl border-r border-gray-100">
      <!-- Container sidebar avec flex column -->
      <div class="flex flex-col h-full">
        
        <!-- Header sidebar -->
        <div class="flex h-16 items-center justify-between px-6 border-b border-gray-100">
          <div class="flex items-center space-x-3">
            <div class="flex h-9 w-9 items-center justify-center rounded-xl bg-gradient-to-br from-blue-600 to-blue-700 shadow-lg">
              <span class="text-sm font-bold text-white">CS</span>
            </div>
            <span class="text-xl font-bold text-gray-900">ChatSeller</span>
          </div>
        </div>

        <!-- Navigation principale - Flex grow pour prendre l'espace -->
        <nav class="flex-1 px-4 py-6 space-y-2">
          <NuxtLink
            to="/dashboard"
            class="group flex items-center rounded-xl px-4 py-3 text-sm font-medium transition-all duration-200"
            :class="$route.path === '/dashboard' || $route.path === '/'
              ? 'bg-blue-50 text-blue-700 shadow-sm border border-blue-100' 
              : 'text-gray-600 hover:bg-gray-50 hover:text-gray-900'"
          >
            <svg class="mr-3 h-5 w-5 transition-colors duration-200" :class="$route.path === '/dashboard' || $route.path === '/' ? 'text-blue-600' : 'text-gray-400 group-hover:text-gray-600'" fill="none" viewBox="0 0 24 24" stroke="currentColor" stroke-width="2">
              <path stroke-linecap="round" stroke-linejoin="round" d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2-2V7a2 2 0 012-2h2a2 2 0 002 2v2a2 2 0 002 2h2a2 2 0 002-2V7a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 00-2 2h-2a2 2 0 00-2 2v6a2 2 0 01-2 2H9z" />
            </svg>
            Dashboard
          </NuxtLink>

          <NuxtLink
            to="/conversations"
            class="group flex items-center rounded-xl px-4 py-3 text-sm font-medium transition-all duration-200"
            :class="$route.path === '/conversations' 
              ? 'bg-blue-50 text-blue-700 shadow-sm border border-blue-100' 
              : 'text-gray-600 hover:bg-gray-50 hover:text-gray-900'"
          >
            <svg class="mr-3 h-5 w-5 transition-colors duration-200" :class="$route.path === '/conversations' ? 'text-blue-600' : 'text-gray-400 group-hover:text-gray-600'" fill="none" viewBox="0 0 24 24" stroke="currentColor" stroke-width="2">
              <path stroke-linecap="round" stroke-linejoin="round" d="M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z" />
            </svg>
            Conversations
            <span v-if="unreadCount > 0" class="ml-auto inline-flex items-center justify-center px-2 py-1 text-xs font-bold leading-none text-white bg-red-500 rounded-full">
              {{ unreadCount }}
            </span>
          </NuxtLink>

          <NuxtLink
            to="/orders"
            class="group flex items-center rounded-xl px-4 py-3 text-sm font-medium transition-all duration-200"
            :class="$route.path === '/orders' 
              ? 'bg-blue-50 text-blue-700 shadow-sm border border-blue-100' 
              : 'text-gray-600 hover:bg-gray-50 hover:text-gray-900'"
          >
            <svg class="mr-3 h-5 w-5 transition-colors duration-200" :class="$route.path === '/orders' ? 'text-blue-600' : 'text-gray-400 group-hover:text-gray-600'" fill="none" viewBox="0 0 24 24" stroke="currentColor" stroke-width="2">
              <path stroke-linecap="round" stroke-linejoin="round" d="M16 11V7a4 4 0 00-8 0v4M5 9h14l1 12H4L5 9z" />
            </svg>
            Commandes
          </NuxtLink>

          <NuxtLink
            to="/analytics"
            class="group flex items-center rounded-xl px-4 py-3 text-sm font-medium transition-all duration-200"
            :class="$route.path === '/analytics' 
              ? 'bg-blue-50 text-blue-700 shadow-sm border border-blue-100' 
              : 'text-gray-600 hover:bg-gray-50 hover:text-gray-900'"
          >
            <svg class="mr-3 h-5 w-5 transition-colors duration-200" :class="$route.path === '/analytics' ? 'text-blue-600' : 'text-gray-400 group-hover:text-gray-600'" fill="none" viewBox="0 0 24 24" stroke="currentColor" stroke-width="2">
              <path stroke-linecap="round" stroke-linejoin="round" d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2-2V7a2 2 0 012-2h2a2 2 0 002 2v2a2 2 0 002 2h2a2 2 0 002-2V7a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 00-2 2h-2a2 2 0 00-2 2v6a2 2 0 01-2 2H9z" />
            </svg>
            Analytics
          </NuxtLink>

          <NuxtLink
            to="/knowledge-base"
            class="group flex items-center rounded-xl px-4 py-3 text-sm font-medium transition-all duration-200"
            :class="$route.path === '/knowledge-base' 
              ? 'bg-blue-50 text-blue-700 shadow-sm border border-blue-100' 
              : 'text-gray-600 hover:bg-gray-50 hover:text-gray-900'"
          >
            <svg class="mr-3 h-5 w-5 transition-colors duration-200" :class="$route.path === '/knowledge-base' ? 'text-blue-600' : 'text-gray-400 group-hover:text-gray-600'" fill="none" viewBox="0 0 24 24" stroke="currentColor" stroke-width="2">
              <path stroke-linecap="round" stroke-linejoin="round" d="M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.746 0 3.332.477 4.5 1.253v13C19.832 18.477 18.246 18 16.5 18c-1.746 0-3.332.477-4.5 1.253" />
            </svg>
            Base de connaissance
          </NuxtLink>

          <NuxtLink
            to="/settings"
            class="group flex items-center rounded-xl px-4 py-3 text-sm font-medium transition-all duration-200"
            :class="$route.path === '/settings' 
              ? 'bg-blue-50 text-blue-700 shadow-sm border border-blue-100' 
              : 'text-gray-600 hover:bg-gray-50 hover:text-gray-900'"
          >
            <svg class="mr-3 h-5 w-5 transition-colors duration-200" :class="$route.path === '/settings' ? 'text-blue-600' : 'text-gray-400 group-hover:text-gray-600'" fill="none" viewBox="0 0 24 24" stroke="currentColor" stroke-width="2">
              <path stroke-linecap="round" stroke-linejoin="round" d="M10.325 4.317c.426-1.756 2.924-1.756 3.35 0a1.724 1.724 0 002.573 1.066c1.543-.94 3.31.826 2.37 2.37a1.724 1.724 0 001.065 2.572c1.756.426 1.756 2.924 0 3.35a1.724 1.724 0 00-1.066 2.573c.94 1.543-.826 3.31-2.37 2.37a1.724 1.724 0 00-2.572 1.065c-.426 1.756-2.924 1.756-3.35 0a1.724 1.724 0 00-2.573-1.066c-1.543.94-3.31-.826-2.37-2.37a1.724 1.724 0 00-1.065-2.572c-1.756-.426-1.756-2.924 0-3.35a1.724 1.724 0 001.066-2.573c-.94-1.543.826-3.31 2.37-2.37.996.608 2.296.07 2.572-1.065z" />
              <path stroke-linecap="round" stroke-linejoin="round" d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
            </svg>
            Paramètres
          </NuxtLink>
        </nav>

        <!-- ✅ PROFIL UTILISATEUR DYNAMIQUE EN BAS -->
        <div class="border-t border-gray-100 p-4">
          <!-- Dropdown profil -->
          <div class="relative" ref="profileDropdown">
            <button 
              @click="showProfileMenu = !showProfileMenu"
              class="w-full flex items-center space-x-3 p-3 rounded-xl hover:bg-gray-50 transition-all duration-200 group"
            >
              <!-- ✅ AVATAR DYNAMIQUE AVEC INITIALES -->
              <div class="flex h-10 w-10 items-center justify-center rounded-full bg-gradient-to-br from-blue-500 to-blue-600 shadow-md">
                <span class="text-sm font-semibold text-white">
                  {{ userInitials }}
                </span>
              </div>
              
              <div class="flex-1 min-w-0 text-left">
                <!-- ✅ NOM UTILISATEUR DYNAMIQUE -->
                <p class="text-sm font-semibold text-gray-900 truncate">
                  {{ userName || 'Utilisateur' }}
                </p>
                <!-- ✅ EMAIL UTILISATEUR DYNAMIQUE -->
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
                class="absolute bottom-full left-0 right-0 mb-2 bg-white rounded-xl shadow-lg border border-gray-100 py-2"
              >
                <NuxtLink 
                  to="/profile" 
                  class="flex items-center px-4 py-2 text-sm text-gray-700 hover:bg-gray-50 transition-colors"
                  @click="showProfileMenu = false"
                >
                  <svg class="mr-3 h-4 w-4 text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
                  </svg>
                  Mon profil
                </NuxtLink>
                
                <hr class="my-1 border-gray-100">
                
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
          </div>
        </div>
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
      <div class="fixed inset-0 bg-gray-900 bg-opacity-50 backdrop-blur-sm"></div>
    </div>

    <!-- Mobile sidebar -->
    <Transition
      enter-active-class="transition ease-out duration-300"
      enter-from-class="transform -translate-x-full"
      enter-to-class="transform translate-x-0"
      leave-active-class="transition ease-in duration-200"
      leave-from-class="transform translate-x-0"
      leave-to-class="transform -translate-x-full"
    >
      <div v-if="mobileMenuOpen" class="lg:hidden fixed inset-y-0 left-0 z-50 w-64 bg-white shadow-xl">
        <!-- Contenu sidebar mobile identique au desktop -->
        <!-- ... même contenu que le desktop ... -->
      </div>
    </Transition>

    <!-- Mobile menu button -->
    <div class="lg:hidden fixed top-4 left-4 z-50">
      <button
        @click="mobileMenuOpen = !mobileMenuOpen"
        class="inline-flex items-center justify-center p-2 rounded-xl text-gray-600 hover:text-gray-900 hover:bg-white hover:shadow-md focus:outline-none focus:ring-2 focus:ring-blue-500 transition-all duration-200"
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
import { ref, computed, onMounted, onUnmounted } from 'vue'
import { useAuthStore } from '~~/stores/auth'

// ✅ UTILISER LE STORE AUTH POUR LES DONNÉES DYNAMIQUES
const authStore = useAuthStore()

// États locaux
const mobileMenuOpen = ref(false)
const showProfileMenu = ref(false)
const profileDropdown = ref(null)
const unreadCount = ref(3) // Mock - à remplacer par vraies données

// ✅ COMPUTED PROPERTIES POUR LES DONNÉES UTILISATEUR
const userName = computed(() => authStore.userName || 'Utilisateur')
const userEmail = computed(() => authStore.userEmail || 'email@exemple.com')
const userInitials = computed(() => authStore.userInitials || 'U')

// ✅ FONCTION DE DÉCONNEXION CORRIGÉE
const handleLogout = async () => {
  showProfileMenu.value = false
  await authStore.logout()
  await navigateTo('/login')
}

// Gestion des clics extérieurs pour fermer le dropdown
const handleClickOutside = (event: Event) => {
  if (profileDropdown.value && !profileDropdown.value.contains(event.target)) {
    showProfileMenu.value = false
  }
}

onMounted(() => {
  document.addEventListener('click', handleClickOutside)
})

onUnmounted(() => {
  document.removeEventListener('click', handleClickOutside)
})
</script>

<style scoped>
/* ✅ RESPONSIVE DESIGN AMÉLIORÉ */
@media (max-width: 1023px) {
  .pl-64 {
    padding-left: 0;
  }
}

/* ✅ TRANSITIONS FLUIDES */
.transition-all {
  transition: all 0.2s cubic-bezier(0.4, 0, 0.2, 1);
}

/* ✅ HOVER EFFECTS MODERNES */
.group:hover .group-hover\:text-gray-600 {
  color: rgb(75 85 99);
}

/* ✅ SMOOTH SCROLLING POUR LA NAVIGATION */
nav {
  scrollbar-width: none;
  -ms-overflow-style: none;
}

nav::-webkit-scrollbar {
  display: none;
}

/* ✅ ACTIVE LINK GLOW EFFECT */
.bg-blue-50 {
  box-shadow: 0 0 0 1px rgb(219 234 254), 0 1px 2px 0 rgb(0 0 0 / 0.05);
}
</style>