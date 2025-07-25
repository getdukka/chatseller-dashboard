<!-- components/SidebarContent.vue - CONTENU SIDEBAR RÉUTILISABLE -->
<template>
  <div class="flex flex-col h-full">
    
    <!-- Header sidebar -->
    <div class="flex h-16 items-center justify-between px-6 border-b border-gray-100">
      <div class="flex items-center space-x-3">
        <div class="flex h-9 w-9 items-center justify-center rounded-xl bg-gradient-to-br from-blue-600 to-blue-700 shadow-lg">
          <span class="text-sm font-bold text-white">CS</span>
        </div>
        <span class="text-xl font-bold text-gray-900">ChatSeller</span>
      </div>
      
      <!-- Close button for mobile -->
      <button 
        v-if="isMobile"
        @click="emit('close-mobile')"
        class="p-2 text-gray-400 hover:text-gray-600 hover:bg-gray-100 rounded-lg transition-colors lg:hidden"
      >
        <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12"/>
        </svg>
      </button>
    </div>

    <!-- Navigation principale - Flex grow pour prendre l'espace -->
    <nav class="flex-1 px-4 py-6 space-y-2 overflow-y-auto">
      <SidebarLink
        to="/"
        :isActive="$route.path === '/'"
        icon="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2-2V7a2 2 0 012-2h2a2 2 0 002 2v2a2 2 0 002 2h2a2 2 0 002-2V7a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 00-2 2h-2a2 2 0 00-2 2v6a2 2 0 01-2 2H9z"
        label="Dashboard"
        @click="handleNavClick"
      />

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
        to="/products"
        :isActive="$route.path.startsWith('/products')"
        icon="M20 7l-8-4-8 4m16 0l-8 4m8-4v10l-8 4m0-10L4 7m8 4v10M4 7v10l8 4"
        label="Produits"
        @click="handleNavClick"
      />

      <SidebarLink
        to="/analytics"
        :isActive="$route.path.startsWith('/analytics')"
        icon="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2-2V7a2 2 0 012-2h2a2 2 0 002 2v2a2 2 0 002 2h2a2 2 0 002-2V7a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 00-2 2h-2a2 2 0 00-2 2v6a2 2 0 01-2 2H9z"
        label="Analytics"
        @click="handleNavClick"
      />

      <SidebarLink
        to="/knowledge-base"
        :isActive="$route.path.startsWith('/knowledge-base')"
        icon="M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.746 0 3.332.477 4.5 1.253v13C19.832 18.477 18.246 18 16.5 18c-1.746 0-3.332.477-4.5 1.253"
        label="Base de connaissance"
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

    <!-- ✅ PROFIL UTILISATEUR DYNAMIQUE EN BAS -->
    <div class="border-t border-gray-100 p-4">
      <!-- Dropdown profil -->
      <div class="relative" ref="profileDropdown">
        <button 
          @click="emit('toggle-profile')"
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
              @click="emit('close-profile')"
            >
              <svg class="mr-3 h-4 w-4 text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
              </svg>
              Mon profil
            </NuxtLink>
            
            <hr class="my-1 border-gray-100">
            
            <button
              @click="emit('logout')"
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
// ✅ PROPS ET EMITS
interface Props {
  unreadCount: number
  userName: string
  userEmail: string
  userInitials: string
  showProfileMenu: boolean
  isMobile?: boolean
}

defineProps<Props>()

defineEmits<{
  'toggle-profile': []
  'close-profile': []
  'logout': []
  'close-mobile': []
}>()

// ✅ PROPS
const props = defineProps<Props>()
const emit = defineEmits<{
  'toggle-profile': []
  'close-profile': []
  'logout': []
  'close-mobile': []
}>()

// ✅ HANDLE NAVIGATION CLICKS
const handleNavClick = () => {
  // Fermer le menu mobile lors de la navigation (si mobile)
  if (props.isMobile) {
    emit('close-mobile')
  }
}
</script>

<style scoped>
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
</style>