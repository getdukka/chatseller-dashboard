<!-- components/SidebarLink.vue - LIEN DE NAVIGATION SIDEBAR -->
<template>
  <NuxtLink
    :to="to"
    class="group flex items-center rounded-xl px-4 py-3 text-sm font-medium transition-all duration-200"
    :class="linkClasses"
    @click="emit('click')"
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
    <span class="flex-1">{{ label }}</span>

    <!-- Badge (notifications, etc.) -->
    <span 
      v-if="badge" 
      class="ml-auto inline-flex items-center justify-center px-2 py-1 text-xs font-bold leading-none text-white bg-red-500 rounded-full min-w-[20px] h-5"
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
  click: []
}>()

// ✅ COMPUTED CLASSES
const linkClasses = computed(() => {
  return props.isActive
    ? 'bg-blue-50 text-blue-700 shadow-sm border border-blue-100'
    : 'text-gray-600 hover:bg-gray-50 hover:text-gray-900'
})

const iconClasses = computed(() => {
  return props.isActive
    ? 'text-blue-600'
    : 'text-gray-400 group-hover:text-gray-600'
})
</script>

<style scoped>
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

/* ✅ TRANSITIONS */
.transition-all {
  transition: all 0.2s cubic-bezier(0.4, 0, 0.2, 1);
}
</style>