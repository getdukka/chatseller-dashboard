<!-- components/SidebarLink.vue - VERSION ULTRA SIMPLIFIÉE -->
<template>
  <NuxtLink
    :to="to"
    class="sidebar-link group flex items-center rounded-xl px-4 py-3 text-sm font-medium transition-all duration-200"
    :class="linkClasses"
    :aria-current="isActive ? 'page' : undefined"
    @click="handleLinkClick"
  >
    <!-- Icon -->
    <svg
      class="mr-3 h-5 w-5 transition-colors duration-200"
      :class="iconClasses"
      fill="none"
      viewBox="0 0 24 24"
      stroke="currentColor"
      stroke-width="2"
    >
      <path stroke-linecap="round" stroke-linejoin="round" :d="icon" />
    </svg>

    <!-- Label -->
    <span class="flex-1 font-medium">{{ label }}</span>

    <!-- Badge (notifications) -->
    <span
      v-if="badge && badge > 0"
      class="ml-auto inline-flex items-center justify-center px-2 py-1 text-xs font-bold leading-none text-white bg-red-500 rounded-full min-w-[20px] h-5 animate-pulse"
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

// ✅ COMPUTED CLASSES OPTIMISÉES - VERSION SIMPLIFIÉE
const linkClasses = computed(() => {
  const baseClasses = 'w-full min-h-[44px] hover:scale-[1.02] active:scale-[0.98]'

  if (props.isActive) {
    // Style simplifié pour lien actif: fond rose léger + texte rose, sans bordure
    return `${baseClasses} bg-rose-50 text-rose-700`
  }

  return `${baseClasses} text-gray-600 hover:bg-gray-50 hover:text-gray-900`
})

const iconClasses = computed(() => {
  if (props.isActive) {
    return 'text-rose-600'
  }

  return 'text-gray-400 group-hover:text-gray-600'
})

// ✅ GESTIONNAIRE CLICK ULTRA SIMPLIFIÉ
const handleLinkClick = () => {
  // Simplement émettre l'événement pour fermer les menus
  // NuxtLink gère automatiquement la navigation
  emit('click', new Event('click'))
}
</script>

<style scoped>
/* STYLES ULTRA SIMPLIFIÉS - FOCUS SUR LA NAVIGATION */
.sidebar-link {
  text-decoration: none;
  cursor: pointer;
}

.sidebar-link:hover {
  text-decoration: none;
}

.sidebar-link:focus {
  outline: 2px solid rgb(244 63 94);
  outline-offset: 2px;
}

/* MOBILE OPTIMISATION */
@media (max-width: 1023px) {
  .sidebar-link {
    min-height: 48px;
    padding: 0.875rem 1rem;
  }
}

/* BADGE ANIMATION */
@keyframes pulse {
  0%, 100% { opacity: 1; }
  50% { opacity: 0.7; }
}

.animate-pulse {
  animation: pulse 2s cubic-bezier(0.4, 0, 0.6, 1) infinite;
}
</style>