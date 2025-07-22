<!-- layouts/auth.vue -->
<template>
  <div class="min-h-screen bg-gradient-to-br from-blue-50 via-white to-blue-50">
    <!-- Navigation top simple -->
    <nav class="relative z-10 bg-white/80 backdrop-blur-sm border-b border-gray-100">
      <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div class="flex justify-between items-center h-16">
          <!-- Logo -->
          <NuxtLink to="/" class="flex items-center space-x-3">
            <div class="flex h-8 w-8 items-center justify-center rounded-lg bg-blue-600">
              <span class="text-sm font-bold text-white">CS</span>
            </div>
            <span class="text-xl font-bold text-gray-900">ChatSeller</span>
          </NuxtLink>

          <!-- Navigation links -->
          <div class="hidden md:flex items-center space-x-6">
            <a href="https://chatseller.app" class="text-gray-600 hover:text-gray-900 text-sm font-medium transition-colors">
              Accueil
            </a>
            <a href="https://docs.chatseller.app" class="text-gray-600 hover:text-gray-900 text-sm font-medium transition-colors">
              Documentation
            </a>
            <NuxtLink 
              to="/login" 
              class="text-blue-600 hover:text-blue-700 text-sm font-medium transition-colors"
            >
              Connexion
            </NuxtLink>
            <NuxtLink 
              to="/register" 
              class="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md text-white bg-blue-600 hover:bg-blue-700 transition-colors"
            >
              Créer un compte
            </NuxtLink>
          </div>

          <!-- Mobile menu button -->
          <div class="md:hidden">
            <button
              @click="mobileMenuOpen = !mobileMenuOpen"
              class="inline-flex items-center justify-center p-2 rounded-md text-gray-400 hover:text-gray-500 hover:bg-gray-100"
            >
              <svg class="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M4 6h16M4 12h16M4 18h16" />
              </svg>
            </button>
          </div>
        </div>
      </div>

      <!-- Mobile menu -->
      <div v-if="mobileMenuOpen" class="md:hidden border-t border-gray-100 bg-white">
        <div class="px-2 pt-2 pb-3 space-y-1">
          <a href="https://chatseller.app" class="block px-3 py-2 text-gray-600 hover:text-gray-900 text-sm font-medium">
            Accueil
          </a>
          <a href="https://docs.chatseller.app" class="block px-3 py-2 text-gray-600 hover:text-gray-900 text-sm font-medium">
            Documentation
          </a>
          <NuxtLink to="/login" class="block px-3 py-2 text-blue-600 hover:text-blue-700 text-sm font-medium">
            Connexion
          </NuxtLink>
          <NuxtLink to="/register" class="block px-3 py-2 text-blue-600 hover:text-blue-700 text-sm font-medium">
            Créer un compte
          </NuxtLink>
        </div>
      </div>
    </nav>

    <!-- Contenu principal centré -->
    <div class="flex-1 flex flex-col justify-center py-12 sm:px-6 lg:px-8">
      <div class="sm:mx-auto sm:w-full sm:max-w-md">
        <slot />
      </div>
    </div>

    <!-- Footer discret -->
    <footer class="bg-white border-t border-gray-100">
      <div class="max-w-7xl mx-auto py-6 px-4 sm:px-6 lg:px-8">
        <div class="flex justify-center items-center space-x-6 text-sm text-gray-500">
          <a href="https://chatseller.app/privacy" class="hover:text-gray-900 transition-colors">
            Confidentialité
          </a>
          <a href="https://chatseller.app/terms" class="hover:text-gray-900 transition-colors">
            Conditions
          </a>
          <a href="https://chatseller.app/support" class="hover:text-gray-900 transition-colors">
            Support
          </a>
        </div>
        <div class="mt-2 text-center text-xs text-gray-400">
          © 2025 ChatSeller. Tous droits réservés.
        </div>
      </div>
    </footer>
  </div>
</template>

<script setup lang="ts">
import { ref } from 'vue'

const mobileMenuOpen = ref(false)
</script>

<style scoped>
/* Gradient background animé subtil */
.bg-gradient-to-br {
  background-size: 400% 400%;
  animation: gradient 15s ease infinite;
}

@keyframes gradient {
  0% {
    background-position: 0% 50%;
  }
  50% {
    background-position: 100% 50%;
  }
  100% {
    background-position: 0% 50%;
  }
}

/* Backdrop blur pour la nav */
.backdrop-blur-sm {
  backdrop-filter: blur(4px);
}
</style>