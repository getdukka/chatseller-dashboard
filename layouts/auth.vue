<!-- layouts/auth.vue -->
<template>
  <div class="min-h-screen bg-gradient-to-br from-rose-50 via-pink-50 to-purple-50 flex flex-col relative overflow-hidden">
    
    <!-- Background Elements Premium Beauté -->
    <div class="absolute inset-0 overflow-hidden pointer-events-none">
      <!-- Gradient animé principal -->
      <div class="absolute inset-0 bg-gradient-to-br from-rose-50/80 via-pink-50/60 to-purple-50/80 animate-gradient-xy"></div>
      
      <!-- Éléments décoratifs flottants -->
      <div class="absolute top-20 left-10 w-96 h-96 bg-gradient-to-br from-rose-300/20 to-pink-300/10 rounded-full blur-3xl animate-pulse"></div>
      <div class="absolute bottom-20 right-10 w-80 h-80 bg-gradient-to-br from-purple-300/20 to-rose-300/10 rounded-full blur-3xl animate-pulse" style="animation-delay: 1s"></div>
      <div class="absolute top-1/3 right-1/4 w-32 h-32 bg-gradient-to-br from-pink-400/15 to-rose-400/10 rounded-full blur-2xl animate-bounce" style="animation-delay: 2s"></div>
      <div class="absolute bottom-1/3 left-1/4 w-48 h-48 bg-gradient-to-br from-purple-400/15 to-pink-400/10 rounded-full blur-2xl animate-pulse" style="animation-delay: 3s"></div>
      
      <!-- Particules flottantes beauté -->
      <div class="absolute top-1/4 left-1/5 w-2 h-2 bg-rose-400 rounded-full animate-ping" style="animation-delay: 0.5s"></div>
      <div class="absolute top-3/4 right-1/5 w-2 h-2 bg-pink-400 rounded-full animate-ping" style="animation-delay: 1.5s"></div>
      <div class="absolute top-1/2 left-1/3 w-1 h-1 bg-purple-400 rounded-full animate-ping" style="animation-delay: 2.5s"></div>
    </div>

    <!-- Logo minimal centré -->
    <div class="relative z-10 pt-8 pb-2 flex justify-center">
      <NuxtLink to="https://chatseller.app" class="flex items-center space-x-2 group">
        <div class="flex h-9 w-9 items-center justify-center">
          <img
            src="/assets/images/logos/fav.svg"
            alt="ChatSeller"
            class="w-9 h-9"
          />
        </div>
        <div>
          <div class="font-bold text-lg text-gray-900">
            ChatSeller<span class="text-rose-500">.</span>
          </div>
        </div>
      </NuxtLink>
    </div>

    <!-- Contenu principal centré -->
    <div class="flex-1 flex flex-col justify-center py-6 px-4 sm:px-6 lg:px-8 relative z-10">
      <div class="sm:mx-auto sm:w-full sm:max-w-lg">
        <slot />
      </div>
    </div>

    <!-- Footer minimal -->
    <div class="relative z-10 py-4 text-center">
      <p class="text-xs text-gray-400">
        © 2026 ChatSeller
      </p>
    </div>
  </div>
</template>

<style scoped>
/* Gradient animé pour le background */
@keyframes gradient-xy {
  0%, 100% {
    background-size: 400% 400%;
    background-position: left center;
  }
  50% {
    background-size: 200% 200%;
    background-position: right center;
  }
}

.animate-gradient-xy {
  animation: gradient-xy 15s ease infinite;
}

/* Transitions fluides */
.transition-colors {
  transition: color 0.15s ease-in-out, background-color 0.15s ease-in-out, border-color 0.15s ease-in-out;
}

.transition-all {
  transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1);
}

/* Effet hover pour logo */
.group:hover .group-hover\\:scale-110 {
  transform: scale(1.1);
}

.group:hover .group-hover\\:shadow-xl {
  box-shadow: 0 20px 25px -5px rgba(0, 0, 0, 0.1), 0 10px 10px -5px rgba(0, 0, 0, 0.04);
}

/* Effet glassmorphism */
.backdrop-blur-sm {
  backdrop-filter: blur(4px);
}

/* Animations des particules */
@keyframes ping {
  75%, 100% {
    transform: scale(2);
    opacity: 0;
  }
}

.animate-ping {
  animation: ping 2s cubic-bezier(0, 0, 0.2, 1) infinite;
}

@keyframes pulse {
  0%, 100% {
    opacity: 1;
  }
  50% {
    opacity: 0.8;
  }
}

.animate-pulse {
  animation: pulse 4s cubic-bezier(0.4, 0, 0.6, 1) infinite;
}

@keyframes bounce {
  0%, 100% {
    transform: translateY(-25%);
    animation-timing-function: cubic-bezier(0.8, 0, 1, 1);
  }
  50% {
    transform: translateY(0);
    animation-timing-function: cubic-bezier(0, 0, 0.2, 1);
  }
}

.animate-bounce {
  animation: bounce 3s infinite;
}

/* Responsive améliorations */
@media (max-width: 640px) {
  .space-x-8 > * + * {
    margin-left: 1rem;
  }
  
  .space-x-6 > * + * {
    margin-left: 1rem;
  }
}
</style>