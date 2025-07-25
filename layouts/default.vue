<!-- layouts/default.vue - SIDEBAR RESPONSIVE CORRIGÉ -->
<template>
  <div class="min-h-screen bg-gray-50">
    
    <!-- ✅ DESKTOP SIDEBAR - VISIBLE UNIQUEMENT SUR LARGE SCREENS -->
    <div class="hidden lg:fixed lg:inset-y-0 lg:left-0 lg:z-50 lg:block lg:w-64 lg:bg-white lg:shadow-xl lg:border-r lg:border-gray-100">
      <SidebarContent 
        :unreadCount="unreadCount"
        :userName="userName"
        :userEmail="userEmail"
        :userInitials="userInitials"
        :showProfileMenu="showProfileMenu"
        @toggle-profile="showProfileMenu = !showProfileMenu"
        @close-profile="showProfileMenu = false"
        @logout="handleLogout"
      />
    </div>

    <!-- ✅ MOBILE OVERLAY - VISIBLE QUAND MENU OUVERT -->
    <div 
      v-if="mobileMenuOpen" 
      class="fixed inset-0 z-50 lg:hidden"
      @click="closeMobileMenu"
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
            :unreadCount="unreadCount"
            :userName="userName"
            :userEmail="userEmail"
            :userInitials="userInitials"
            :showProfileMenu="showProfileMenu"
            :isMobile="true"
            @toggle-profile="showProfileMenu = !showProfileMenu"
            @close-profile="showProfileMenu = false"
            @logout="handleLogout"
            @close-mobile="closeMobileMenu"
          />
        </div>
      </Transition>
    </div>

    <!-- ✅ MOBILE HEADER AVEC BOUTON HAMBURGER -->
    <div class="lg:hidden sticky top-0 z-40 bg-white border-b border-gray-200 px-4 py-3">
      <div class="flex items-center justify-between">
        <!-- Mobile menu button -->
        <button
          @click="toggleMobileMenu"
          class="inline-flex items-center justify-center p-2 rounded-xl text-gray-600 hover:text-gray-900 hover:bg-gray-100 focus:outline-none focus:ring-2 focus:ring-blue-500 transition-all duration-200"
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
          <div class="flex h-8 w-8 items-center justify-center rounded-xl bg-gradient-to-br from-blue-600 to-blue-700 shadow-lg">
            <span class="text-xs font-bold text-white">CS</span>
          </div>
          <span class="text-lg font-bold text-gray-900">ChatSeller</span>
        </div>

        <!-- Mobile user avatar -->
        <button 
          @click="showMobileProfileMenu = !showMobileProfileMenu"
          class="relative"
        >
          <div class="flex h-8 w-8 items-center justify-center rounded-full bg-gradient-to-br from-blue-500 to-blue-600 shadow-md">
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
            >
              <div class="px-4 py-3 border-b border-gray-100">
                <p class="text-sm font-medium text-gray-900">{{ userName || 'Utilisateur' }}</p>
                <p class="text-xs text-gray-500">{{ userEmail || 'email@exemple.com' }}</p>
              </div>
              
              <NuxtLink 
                to="/profile" 
                class="flex items-center px-4 py-2 text-sm text-gray-700 hover:bg-gray-50 transition-colors"
                @click="showMobileProfileMenu = false"
              >
                <svg class="mr-3 h-4 w-4 text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
                </svg>
                Mon profil
              </NuxtLink>
              
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

    <!-- ✅ ZONE DE CONTENU PRINCIPALE RESPONSIVE -->
    <div class="lg:pl-64">
      <main class="min-h-screen">
        <slot />
      </main>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, computed, watch, onMounted, onUnmounted } from 'vue'
import { useAuthStore } from '~~/stores/auth'

// ✅ UTILISER LE STORE AUTH POUR LES DONNÉES DYNAMIQUES
const authStore = useAuthStore()

// États locaux
const mobileMenuOpen = ref(false)
const showProfileMenu = ref(false)
const showMobileProfileMenu = ref(false)
const unreadCount = ref(3) // Mock - à remplacer par vraies données

// ✅ COMPUTED PROPERTIES POUR LES DONNÉES UTILISATEUR
const userName = computed(() => authStore.userName || 'Utilisateur')
const userEmail = computed(() => authStore.userEmail || 'email@exemple.com')
const userInitials = computed(() => authStore.userInitials || 'U')

// ✅ MOBILE MENU METHODS
const toggleMobileMenu = () => {
  mobileMenuOpen.value = !mobileMenuOpen.value
  // Fermer le profil mobile si ouvert
  if (mobileMenuOpen.value) {
    showMobileProfileMenu.value = false
  }
}

const closeMobileMenu = () => {
  mobileMenuOpen.value = false
}

// ✅ FONCTION DE DÉCONNEXION CORRIGÉE
const handleLogout = async () => {
  showProfileMenu.value = false
  showMobileProfileMenu.value = false
  closeMobileMenu()
  await authStore.logout()
  await navigateTo('/login')
}

// ✅ Gestion des clics extérieurs pour fermer les dropdowns
const handleClickOutside = (event: Event) => {
  const target = event.target as Element
  
  // Fermer le profil mobile si clic à l'extérieur
  if (showMobileProfileMenu.value && !target.closest('.relative')) {
    showMobileProfileMenu.value = false
  }
}

// ✅ Empêcher le scroll du body quand le menu mobile est ouvert
const updateBodyScroll = () => {
  if (mobileMenuOpen.value) {
    document.body.style.overflow = 'hidden'
  } else {
    document.body.style.overflow = ''
  }
}

// ✅ Watch pour gérer le scroll du body
watch(mobileMenuOpen, updateBodyScroll)

// ✅ Fermer le menu mobile lors de la navigation
const route = useRoute()
watch(() => route.path, () => {
  closeMobileMenu()
  showMobileProfileMenu.value = false
})

onMounted(() => {
  document.addEventListener('click', handleClickOutside)
})

onUnmounted(() => {
  document.removeEventListener('click', handleClickOutside)
  // Rétablir le scroll du body
  document.body.style.overflow = ''
})
</script>

<style scoped>
/* ✅ RESPONSIVE DESIGN AMÉLIORÉ */
@media (max-width: 1023px) {
  .lg\:pl-64 {
    padding-left: 0 !important;
  }
}

/* ✅ TRANSITIONS FLUIDES */
.transition-all {
  transition: all 0.2s cubic-bezier(0.4, 0, 0.2, 1);
}

/* ✅ Z-INDEX MANAGEMENT */
.z-40 {
  z-index: 40;
}

.z-50 {
  z-index: 50;
}
</style>