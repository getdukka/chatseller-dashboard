<!-- layouts/auth.vue - LAYOUT SIMPLIFIÉ POUR LOGIN/REGISTER -->
<template>
  <div class="min-h-screen bg-gradient-to-br from-blue-50 via-white to-blue-50 flex flex-col">
    <!-- Contenu principal centré -->
    <div class="flex-1 flex flex-col justify-center py-12 px-4 sm:px-6 lg:px-8">
      <div class="sm:mx-auto sm:w-full sm:max-w-md">
        <slot />
      </div>
    </div>

    <!-- Footer minimaliste -->
    <footer class="py-6">
      <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div class="flex justify-center items-center space-x-6 text-sm text-gray-500">
          <a 
            href="https://chatseller.app/privacy" 
            class="hover:text-gray-700 transition-colors"
            target="_blank"
          >
            Confidentialité
          </a>
          <a 
            href="https://chatseller.app/terms" 
            class="hover:text-gray-700 transition-colors"
            target="_blank"
          >
            Conditions
          </a>
          <a 
            href="https://chatseller.app/support" 
            class="hover:text-gray-700 transition-colors"
            target="_blank"
          >
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

<style scoped>
/* ✅ GRADIENT ANIMÉ SUBTIL */
.bg-gradient-to-br {
  background-size: 400% 400%;
  animation: gradient 15s ease infinite;
}

@keyframes gradient {
  0% { background-position: 0% 50%; }
  50% { background-position: 100% 50%; }
  100% { background-position: 0% 50%; }
}

/* ✅ TRANSITIONS FLUIDES */
.transition-colors {
  transition: color 0.15s ease-in-out;
}
</style>