<!-- components/SidebarLink.vue -->
<template>
  <NuxtLink
    :to="to"
    class="sidebar-link group flex items-center rounded-xl px-4 py-3 text-sm font-medium transition-all duration-200"
    :class="linkClasses"
    @click="handleClick"
    :tabindex="0"
    :aria-current="isActive ? 'page' : undefined"
  >
    <!-- Icon -->
    <svg 
      class="sidebar-icon mr-3 h-5 w-5 transition-colors duration-200" 
      :class="iconClasses"
      fill="none" 
      viewBox="0 0 24 24" 
      stroke="currentColor" 
      stroke-width="2"
    >
      <path stroke-linecap="round" stroke-linejoin="round" :d="icon" />
    </svg>

    <!-- Label -->
    <span class="sidebar-label flex-1">{{ label }}</span>

    <!-- Badge (notifications, etc.) -->
    <span 
      v-if="badge" 
      class="sidebar-badge ml-auto inline-flex items-center justify-center px-2 py-1 text-xs font-bold leading-none text-white bg-red-500 rounded-full min-w-[20px] h-5"
      :aria-label="`${badge} notification${badge > 1 ? 's' : ''}`"
    >
      {{ badge > 99 ? '99+' : badge }}
    </span>
  </NuxtLink>
</template>

<script setup lang="ts">
import { computed } from 'vue'

// Props
interface Props {
  to: string
  icon: string
  label: string
  isActive: boolean
  badge?: number | null
}

const props = defineProps<Props>()

// Emits
const emit = defineEmits<{
  click: [event: Event]
}>()

// Computed classes
const linkClasses = computed(() => {
  const baseClasses = 'relative cursor-pointer'
  
  return props.isActive
    ? `${baseClasses} bg-blue-50 text-blue-700 shadow-sm border border-blue-100`
    : `${baseClasses} text-gray-600 hover:bg-gray-50 hover:text-gray-900`
})

const iconClasses = computed(() => {
  return props.isActive
    ? 'text-blue-600'
    : 'text-gray-400 group-hover:text-gray-600'
})

// ✅ CLICK HANDLER SIMPLIFIÉ ET ROBUSTE
const handleClick = (event: Event) => {
  console.log('🔗 [SidebarLink] Navigation vers:', props.label, props.to)
  
  // ✅ NE PAS EMPÊCHER LA PROPAGATION - Laisser Vue Router gérer
  // ✅ NE PAS faire de preventDefault - Le NuxtLink s'en charge
  
  // Émettre l'événement pour informer les parents (pour fermeture menus)
  emit('click', event)
  
  console.log('✅ [SidebarLink] Navigation initiée pour:', props.to)
}
</script>

<style scoped>
/* ✅ STYLES SIMPLIFIÉS POUR ÉVITER LES CONFLITS */
.sidebar-link {
  display: flex !important;
  align-items: center !important;
  width: 100% !important;
  min-height: 44px !important;
  text-decoration: none !important;
  position: relative !important;
  z-index: 1 !important;
}

/* ✅ ASSURER LA CLIQUABILITÉ */
.sidebar-link:hover {
  text-decoration: none !important;
}

/* ✅ LES ENFANTS NE CAPTENT PAS LES ÉVÉNEMENTS */
.sidebar-icon,
.sidebar-label,
.sidebar-badge {
  pointer-events: none !important;
}

/* ✅ TRANSITIONS FLUIDES */
.transition-all {
  transition: all 0.2s cubic-bezier(0.4, 0, 0.2, 1);
}

/* ✅ BADGE ANIMATION */
.bg-red-500 {
  animation: pulse-badge 2s infinite;
}

@keyframes pulse-badge {
  0%, 100% { opacity: 1; }
  50% { opacity: 0.8; }
}

/* ✅ HOVER STATES */
.group:hover .group-hover\:text-gray-600 {
  color: rgb(75 85 99) !important;
}

/* ✅ FOCUS STATES POUR ACCESSIBILITÉ */
.sidebar-link:focus {
  outline: 2px solid rgb(59 130 246) !important;
  outline-offset: 2px !important;
  border-radius: 0.75rem !important;
}

/* ✅ MOBILE TOUCH TARGETS */
@media (max-width: 1023px) {
  .sidebar-link {
    min-height: 48px !important;
    margin-bottom: 2px !important;
  }
}

/* ✅ ÉVITER LA SÉLECTION DE TEXTE */
.sidebar-link {
  user-select: none;
  -webkit-user-select: none;
  -moz-user-select: none;
  -ms-user-select: none;
}

/* ✅ HIGH CONTRAST SUPPORT */
@media (prefers-contrast: high) {
  .sidebar-link {
    border: 1px solid transparent;
  }
  
  .sidebar-link:hover {
    border-color: currentColor;
  }
}

/* ✅ REDUCED MOTION SUPPORT */
@media (prefers-reduced-motion: reduce) {
  .sidebar-link,
  .sidebar-icon {
    transition: none !important;
  }
}
</style>