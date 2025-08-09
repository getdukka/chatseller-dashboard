<!-- components/SidebarLink.vue - LIEN DE NAVIGATION AVEC CLIQUABILITÉ GARANTIE -->
<template>
  <NuxtLink
    :to="to"
    class="group flex items-center rounded-xl px-4 py-3 text-sm font-medium transition-all duration-200 sidebar-link"
    :class="linkClasses"
    @click="handleClick"
    :tabindex="0"
    :aria-current="isActive ? 'page' : undefined"
  >
    <!-- Icon -->
    <svg 
      class="mr-3 h-5 w-5 transition-colors duration-200 sidebar-icon" 
      :class="iconClasses"
      fill="none" 
      viewBox="0 0 24 24" 
      stroke="currentColor" 
      stroke-width="2"
    >
      <path stroke-linecap="round" stroke-linejoin="round" :d="icon" />
    </svg>

    <!-- Label -->
    <span class="flex-1 sidebar-label">{{ label }}</span>

    <!-- Badge (notifications, etc.) -->
    <span 
      v-if="badge" 
      class="ml-auto inline-flex items-center justify-center px-2 py-1 text-xs font-bold leading-none text-white bg-red-500 rounded-full min-w-[20px] h-5 sidebar-badge"
      :aria-label="`${badge} notification${badge > 1 ? 's' : ''}`"
    >
      {{ badge > 99 ? '99+' : badge }}
    </span>
  </NuxtLink>
</template>

<script setup lang="ts">
import { computed } from 'vue'

// ✅ PROPS
interface Props {
  to: string
  icon: string
  label: string
  isActive: boolean
  badge?: number | null
}

const props = defineProps<Props>()

// ✅ EMITS
const emit = defineEmits<{
  click: [event: Event]
}>()

// ✅ COMPUTED CLASSES
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

// ✅ HANDLE CLICK WITH IMPROVED EVENT MANAGEMENT
const handleClick = (event: Event) => {
  console.log('🔗 [SidebarLink] Click détecté pour:', props.label, {
    to: props.to,
    isActive: props.isActive,
    target: event.target
  })
  
  // S'assurer que l'événement se propage correctement
  try {
    // Émettre l'événement vers le parent
    emit('click', event)
    
    // Log pour debug
    console.log('✅ [SidebarLink] Événement click émis pour:', props.label)
  } catch (error) {
    console.error('❌ [SidebarLink] Erreur lors de l\'émission du click:', error)
  }
}
</script>

<style scoped>
/* ✅ ASSURER LA CLIQUABILITÉ MAXIMALE */
.sidebar-link {
  display: flex !important;
  align-items: center !important;
  pointer-events: auto !important;
  position: relative !important;
  z-index: 10 !important;
  text-decoration: none !important;
}

.sidebar-link:hover {
  text-decoration: none !important;
}

/* ✅ TOUS LES ÉLÉMENTS ENFANTS DOIVENT ÊTRE CLIQUABLES */
.sidebar-icon,
.sidebar-label,
.sidebar-badge {
  pointer-events: none !important; /* Les enfants ne captent pas les events */
}

/* ✅ ACTIVE LINK GLOW EFFECT */
.bg-blue-50 {
  box-shadow: 0 0 0 1px rgb(219 234 254), 0 1px 2px 0 rgb(0 0 0 / 0.05);
}

/* ✅ BADGE ANIMATIONS */
.bg-red-500 {
  animation: pulse-badge 2s infinite;
}

@keyframes pulse-badge {
  0%, 100% {
    opacity: 1;
  }
  50% {
    opacity: 0.8;
  }
}

/* ✅ TRANSITIONS AMÉLIORÉES */
.transition-all {
  transition: all 0.2s cubic-bezier(0.4, 0, 0.2, 1);
}

/* ✅ HOVER STATES RENFORCÉS */
.group:hover .group-hover\:text-gray-600 {
  color: rgb(75 85 99) !important;
}

/* ✅ FOCUS STATES POUR L'ACCESSIBILITÉ */
.sidebar-link:focus {
  outline: 2px solid rgb(59 130 246) !important;
  outline-offset: 2px !important;
  border-radius: 0.75rem !important;
}

/* ✅ ASSURER QUE LE LIEN PREND TOUT L'ESPACE */
.sidebar-link {
  width: 100% !important;
  min-height: 44px !important; /* Minimum touch target */
}

/* ✅ PREVENT ANY OVERLAY ISSUES */
.sidebar-link::before {
  content: '';
  position: absolute;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  z-index: -1;
  border-radius: inherit;
}

/* ✅ IMPROVE MOBILE TOUCH */
@media (max-width: 1023px) {
  .sidebar-link {
    min-height: 48px !important; /* Larger touch target on mobile */
    margin-bottom: 2px !important;
  }
}

/* ✅ ENSURE NO TEXT SELECTION INTERFERES */
.sidebar-link {
  user-select: none;
  -webkit-user-select: none;
  -moz-user-select: none;
  -ms-user-select: none;
}

/* ✅ HIGH CONTRAST MODE SUPPORT */
@media (prefers-contrast: high) {
  .sidebar-link {
    border: 1px solid transparent;
  }
  
  .sidebar-link:hover {
    border-color: currentColor;
  }
}

/* ✅ MOTION PREFERENCES */
@media (prefers-reduced-motion: reduce) {
  .sidebar-link,
  .sidebar-icon {
    transition: none !important;
  }
}
</style>