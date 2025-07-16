<template>
  <div class="flex h-screen bg-gray-50 overflow-hidden">
    <!-- Sidebar fixe -->
    <aside 
      :class="[
        'fixed inset-y-0 left-0 z-50 w-64 bg-white border-r border-gray-200 transform transition-all duration-300 ease-in-out',
        sidebarOpen ? 'translate-x-0' : '-translate-x-full lg:translate-x-0'
      ]"
    >
      <!-- Header Sidebar -->
      <div class="flex items-center justify-between h-16 px-6 border-b border-gray-200">
        <div class="flex items-center">
          <div class="flex-shrink-0 w-8 h-8 bg-gradient-to-r from-blue-500 to-blue-600 rounded-lg flex items-center justify-center">
            <span class="text-white font-bold text-sm">CS</span>
          </div>
          <span class="ml-3 text-lg font-semibold text-gray-900">ChatSeller</span>
        </div>
        
        <!-- Bouton fermer mobile -->
        <button 
          @click="sidebarOpen = false"
          class="lg:hidden p-1 rounded-md text-gray-400 hover:text-gray-500 hover:bg-gray-100"
        >
          <XMarkIcon class="h-5 w-5" />
        </button>
      </div>
      
      <!-- Navigation principale -->
      <nav class="mt-6 px-3 flex-1 overflow-y-auto">
        <div class="space-y-1">
          <NuxtLink
            v-for="item in navigation"
            :key="item.name"
            :to="item.href"
            :class="[
              isActiveRoute(item.href) 
                ? 'bg-blue-50 border-blue-500 text-blue-700' 
                : 'border-transparent text-gray-600 hover:bg-gray-50 hover:text-gray-900',
              'group flex items-center px-3 py-2 text-sm font-medium border-l-4 transition-colors duration-200'
            ]"
          >
            <component 
              :is="item.icon" 
              :class="[
                isActiveRoute(item.href) ? 'text-blue-500' : 'text-gray-400 group-hover:text-gray-500',
                'mr-3 h-5 w-5'
              ]" 
            />
            {{ item.name }}
            
            <!-- Badge pour notifications -->
            <span 
              v-if="item.badge" 
              class="ml-auto inline-block py-0.5 px-2 text-xs font-medium rounded-full bg-blue-100 text-blue-800"
            >
              {{ item.badge }}
            </span>
          </NuxtLink>
        </div>
        
        <!-- Section intégration -->
        <div class="mt-8 px-3">
          <h3 class="px-3 text-xs font-semibold text-gray-500 uppercase tracking-wider">
            Intégration
          </h3>
          <div class="mt-3 space-y-1">
            <button
              @click="showIntegrationCode = true"
              class="group flex items-center w-full px-3 py-2 text-sm font-medium text-gray-600 border border-gray-200 rounded-md hover:bg-gray-50 hover:text-gray-900 transition-colors duration-200"
            >
              <CodeBracketIcon class="mr-3 h-5 w-5 text-gray-400 group-hover:text-gray-500" />
              Code d'intégration
            </button>
            
            <NuxtLink
              to="/widget-preview"
              class="group flex items-center w-full px-3 py-2 text-sm font-medium text-gray-600 border border-gray-200 rounded-md hover:bg-gray-50 hover:text-gray-900 transition-colors duration-200"
            >
              <EyeIcon class="mr-3 h-5 w-5 text-gray-400 group-hover:text-gray-500" />
              Tester le widget
            </NuxtLink>
          </div>
        </div>
      </nav>
      
      <!-- Profil utilisateur en bas -->
      <div class="flex-shrink-0 border-t border-gray-200 p-4">
        <div class="flex items-center group">
          <div class="flex-shrink-0">
            <img 
              :src="user?.user_metadata?.avatar_url || '/default-avatar.png'" 
              :alt="user?.user_metadata?.full_name || 'Utilisateur'"
              class="h-8 w-8 rounded-full object-cover"
            />
          </div>
          <div class="ml-3 flex-1 min-w-0">
            <p class="text-sm font-medium text-gray-900 truncate">
              {{ user?.user_metadata?.full_name || 'Utilisateur' }}
            </p>
            <p class="text-xs text-gray-500 truncate">
              {{ user?.email }}
            </p>
          </div>
          
          <!-- Menu dropdown -->
          <Menu as="div" class="relative ml-3">
            <MenuButton class="flex-shrink-0 p-1 rounded-md text-gray-400 hover:text-gray-500 focus:outline-none focus:ring-2 focus:ring-blue-500">
              <EllipsisVerticalIcon class="h-5 w-5" />
            </MenuButton>
            
            <transition
              enter-active-class="transition ease-out duration-100"
              enter-from-class="transform opacity-0 scale-95"
              enter-to-class="transform opacity-100 scale-100"
              leave-active-class="transition ease-in duration-75"
              leave-from-class="transform opacity-100 scale-100"
              leave-to-class="transform opacity-0 scale-95"
            >
              <MenuItems class="origin-bottom-left absolute bottom-full left-0 mb-1 w-48 rounded-md shadow-lg bg-white ring-1 ring-black ring-opacity-5 focus:outline-none">
                <div class="py-1">
                  <MenuItem v-slot="{ active }">
                    <NuxtLink
                      to="/profile"
                      :class="[active ? 'bg-gray-100' : '', 'block px-4 py-2 text-sm text-gray-700']"
                    >
                      Mon profil
                    </NuxtLink>
                  </MenuItem>
                  <MenuItem v-slot="{ active }">
                    <button
                      @click="signOut"
                      :class="[active ? 'bg-gray-100' : '', 'block w-full text-left px-4 py-2 text-sm text-gray-700']"
                    >
                      Se déconnecter
                    </button>
                  </MenuItem>
                </div>
              </MenuItems>
            </transition>
          </Menu>
        </div>
        
        <!-- Indicateur de statut -->
        <div class="mt-3 flex items-center text-xs text-gray-500">
          <div class="flex items-center">
            <div class="h-2 w-2 bg-green-400 rounded-full mr-2 animate-pulse"></div>
            Widget actif
          </div>
          <span class="mx-2">•</span>
          <span>{{ stats.conversationsToday }} conversations aujourd'hui</span>
        </div>
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
      
      <!-- Header desktop -->
      <div class="hidden lg:block bg-white border-b border-gray-200 px-6 py-4">
        <div class="flex items-center justify-between">
          <div>
            <h1 class="text-2xl font-semibold text-gray-900">{{ pageTitle }}</h1>
            <p class="mt-1 text-sm text-gray-500">{{ pageDescription }}</p>
          </div>
          
          <div class="flex items-center space-x-4">
            <!-- Recherche globale -->
            <div class="relative">
              <MagnifyingGlassIcon class="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
              <input
                type="text"
                placeholder="Rechercher..."
                class="pl-10 pr-4 py-2 border border-gray-300 rounded-md text-sm focus:ring-blue-500 focus:border-blue-500"
              />
            </div>
            
            <!-- Notifications -->
            <button class="p-2 rounded-md text-gray-400 hover:text-gray-500 hover:bg-gray-100 relative">
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
              class="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 transition-colors duration-200"
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
    <TransitionRoot :show="showIntegrationCode" as="template">
      <Dialog @close="showIntegrationCode = false" class="relative z-50">
        <TransitionChild
          as="template"
          enter="ease-out duration-300"
          enter-from="opacity-0"
          enter-to="opacity-100"
          leave="ease-in duration-200"
          leave-from="opacity-100"
          leave-to="opacity-0"
        >
          <div class="fixed inset-0 bg-gray-500 bg-opacity-75 transition-opacity" />
        </TransitionChild>

        <div class="fixed inset-0 z-10 overflow-y-auto">
          <div class="flex min-h-full items-end justify-center p-4 text-center sm:items-center sm:p-0">
            <TransitionChild
              as="template"
              enter="ease-out duration-300"
              enter-from="opacity-0 translate-y-4 sm:translate-y-0 sm:scale-95"
              enter-to="opacity-100 translate-y-0 sm:scale-100"
              leave="ease-in duration-200"
              leave-from="opacity-100 translate-y-0 sm:scale-100"
              leave-to="opacity-0 translate-y-4 sm:translate-y-0 sm:scale-95"
            >
              <DialogPanel class="relative transform overflow-hidden rounded-lg bg-white text-left shadow-xl transition-all sm:my-8 sm:w-full sm:max-w-2xl">
                <div class="bg-white px-6 py-6">
                  <div class="flex items-center justify-between mb-4">
                    <DialogTitle class="text-lg font-semibold text-gray-900">
                      Code d'intégration ChatSeller
                    </DialogTitle>
                    <button
                      @click="showIntegrationCode = false"
                      class="rounded-md text-gray-400 hover:text-gray-500"
                    >
                      <XMarkIcon class="h-6 w-6" />
                    </button>
                  </div>
                  
                  <p class="text-sm text-gray-600 mb-4">
                    Copiez ce code et collez-le sur vos pages produit où vous souhaitez afficher le bouton ChatSeller.
                  </p>
                  
                  <div class="bg-gray-900 rounded-lg p-4 text-sm text-gray-100 font-mono overflow-x-auto">
                    <pre><code>&lt;!-- ChatSeller Widget --&gt;
&lt;script src="https://widget.chatseller.app/widget.js" 
        data-shop-id="{{ user?.id }}"
        data-button-text="Parler à la vendeuse"
        data-primary-color="#ec4899"&gt;&lt;/script&gt;</code></pre>
                  </div>
                  
                  <div class="mt-4 flex justify-end">
                    <button
                      @click="copyToClipboard"
                      class="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md text-white bg-blue-600 hover:bg-blue-700"
                    >
                      <ClipboardIcon class="mr-2 h-4 w-4" />
                      Copier le code
                    </button>
                  </div>
                </div>
              </DialogPanel>
            </TransitionChild>
          </div>
        </div>
      </Dialog>
    </TransitionRoot>
  </div>
</template>

<script setup lang="ts">
import { ref, computed } from 'vue'
import { useRoute } from 'vue-router'
import { Menu, MenuButton, MenuItems, MenuItem, Dialog, DialogPanel, DialogTitle, TransitionRoot, TransitionChild } from '@headlessui/vue'
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
  EllipsisVerticalIcon,
  ClipboardIcon
} from '@heroicons/vue/24/outline'

// Authentification
const { user, userProfile, signOut } = useAuth()

// État local
const sidebarOpen = ref(false)
const showIntegrationCode = ref(false)

// Navigation
const navigation = [
  { name: 'Aperçu', href: '/', icon: HomeIcon },
  { name: 'Conversations', href: '/conversations', icon: ChatBubbleLeftRightIcon, badge: '3' },
  { name: 'Commandes', href: '/orders', icon: ShoppingBagIcon },
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

// Fonction pour copier le code
const copyToClipboard = async () => {
  const userId = user.value?.id || 'YOUR_SHOP_ID'
  const code = `<!-- ChatSeller Widget -->
<script src="https://widget.chatseller.app/widget.js" 
        data-shop-id="${userId}"
        data-button-text="Parler à la vendeuse"
        data-primary-color="#ec4899"><\/script>`
  
  try {
    await navigator.clipboard.writeText(code)
    // Ajouter notification toast
    console.log('Code copié !')
  } catch (error) {
    console.error('Erreur lors de la copie:', error)
  }
}

// Meta pour le SEO
useSeoMeta({
  title: `${pageTitle.value} - ChatSeller Dashboard`,
  description: pageDescription.value
})
</script>

<style scoped>
/* Animations personnalisées */
.animate-pulse {
  animation: pulse 2s cubic-bezier(0.4, 0, 0.6, 1) infinite;
}

@keyframes pulse {
  0%, 100% {
    opacity: 1;
  }
  50% {
    opacity: .5;
  }
}
</style>