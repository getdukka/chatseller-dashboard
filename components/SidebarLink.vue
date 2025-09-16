<!-- components/SidebarLink.vue - VERSION SIMPLIFIÉE CORRIGÉE -->
<template>
  <NuxtLink
    :to="to"
    class="clickable-element sidebar-link group flex items-center rounded-xl px-4 py-3 text-sm font-medium transition-all duration-200 relative"
    :class="linkClasses"
    :tabindex="0"
    :aria-current="isActive ? 'page' : undefined"
    @click="handleLinkClick"
  >
    <!-- Icon -->
    <svg 
      class="no-pointer-events mr-3 h-5 w-5 transition-colors duration-200" 
      :class="iconClasses"
      fill="none" 
      viewBox="0 0 24 24" 
      stroke="currentColor" 
      stroke-width="2"
    >
      <path stroke-linecap="round" stroke-linejoin="round" :d="icon" />
    </svg>

    <!-- Label -->
    <span class="no-pointer-events flex-1 font-medium">{{ label }}</span>

    <!-- Badge (notifications) -->
    <span 
      v-if="badge && badge > 0" 
      class="no-pointer-events ml-auto inline-flex items-center justify-center px-2 py-1 text-xs font-bold leading-none text-white bg-red-500 rounded-full min-w-[20px] h-5 animate-pulse"
      :aria-label="`${badge} notification${badge > 1 ? 's' : ''}`"
    >
      {{ badge > 99 ? '99+' : badge }}
    </span>
  </NuxtLink>
</template>

<script setup lang="ts">
import { computed } from 'vue'

// ✅ INTERFACE PROPS SIMPLIFIÉE
interface Props {
  to: string
  icon: string
  label: string
  isActive: boolean
  badge?: number | null
}

const props = defineProps<Props>()

// ✅ ÉMIT SIMPLIFIÉ
const emit = defineEmits<{
  click: [event: Event]
}>()

// ✅ COMPUTED CLASSES OPTIMISÉES
const linkClasses = computed(() => {
  const baseClasses = 'w-full min-h-[44px] hover:scale-[1.02] active:scale-[0.98]'
  
  if (props.isActive) {
    return `${baseClasses} bg-gradient-to-r from-rose-50 to-pink-50 text-rose-700 shadow-sm border border-rose-200 ring-1 ring-rose-100`
  }
  
  return `${baseClasses} text-gray-600 hover:bg-gray-50 hover:text-gray-900 hover:shadow-sm`
})

const iconClasses = computed(() => {
  if (props.isActive) {
    return 'text-rose-600'
  }
  
  return 'text-gray-400 group-hover:text-gray-600'
})

// ✅ GESTIONNAIRE CLICK ROBUSTE ET SIMPLE
const handleLinkClick = (event: Event) => {
  // ✅ LOG POUR DEBUG
  console.log(`🔗 [SidebarLink] Navigation: ${props.label} → ${props.to}`)
  
  // ✅ ÉMETTRE L'ÉVÉNEMENT POUR FERMER LES MENUS
  emit('click', event)
  
  // ✅ LAISSER NUXT ROUTER GÉRER LA NAVIGATION
  // Pas de preventDefault() ni stopPropagation()
}
</script>

<style scoped>
/* ✅ STYLES SIMPLIFIÉS ET ROBUSTES */
.sidebar-link {
  display: flex !important;
  align-items: center !important;
  text-decoration: none !important;
  user-select: none !important;
  -webkit-tap-highlight-color: transparent !important;
}

/* ✅ HOVER ET ACTIVE STATES */
.sidebar-link:hover {
  text-decoration: none !important;
  transform: translateY(-1px);
}

.sidebar-link:active {
  transform: translateY(0);
}

/* ✅ FOCUS ACCESSIBLE */
.sidebar-link:focus {
  outline: 2px solid rgb(244 63 94) !important;
  outline-offset: 2px !important;
}

/* ✅ TRANSITIONS FLUIDES */
.transition-all {
  transition: all 0.15s cubic-bezier(0.4, 0, 0.2, 1);
}

/* ✅ MOBILE OPTIMISATION */
@media (max-width: 1023px) {
  .sidebar-link {
    min-height: 48px !important;
    padding: 0.875rem 1rem !important;
  }
}

/* ✅ RÉDUIRE ANIMATIONS SI NÉCESSAIRE */
@media (prefers-reduced-motion: reduce) {
  .sidebar-link,
  .transition-all {
    transition: none !important;
    transform: none !important;
  }
  
  .sidebar-link:hover {
    transform: none !important;
  }
}

/* ✅ BADGE ANIMATION */
@keyframes pulse {
  0%, 100% { opacity: 1; }
  50% { opacity: 0.7; }
}

.animate-pulse {
  animation: pulse 2s cubic-bezier(0.4, 0, 0.6, 1) infinite;
}
</style>