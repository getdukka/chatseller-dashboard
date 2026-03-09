<!-- components/SidebarLink.vue -->
<template>
  <NuxtLink
    :to="to"
    class="sidebar-link group flex items-center rounded-lg px-3 py-2.5 text-sm transition-all duration-150"
    :class="linkClasses"
    :aria-current="isActive ? 'page' : undefined"
    @click="handleLinkClick"
  >
    <!-- Icon -->
    <svg
      class="mr-3 h-[18px] w-[18px] transition-colors duration-150 flex-shrink-0"
      :class="iconClasses"
      fill="none"
      viewBox="0 0 24 24"
      stroke="currentColor"
      stroke-width="1.75"
    >
      <path stroke-linecap="round" stroke-linejoin="round" :d="icon" />
    </svg>

    <!-- Label -->
    <span class="flex-1 truncate">{{ label }}</span>

    <!-- Badge (notifications) -->
    <span
      v-if="badge && badge > 0"
      class="ml-auto inline-flex items-center justify-center w-5 h-5 text-[10px] font-bold leading-none text-white bg-rose-500 rounded-full"
    >
      {{ badge > 99 ? '99+' : badge }}
    </span>
  </NuxtLink>
</template>

<script setup lang="ts">
import { computed } from 'vue'

interface Props {
  to: string
  icon: string
  label: string
  isActive: boolean
  badge?: number | null
}

const props = defineProps<Props>()

const emit = defineEmits<{
  click: [event: Event]
}>()

const linkClasses = computed(() => {
  if (props.isActive) {
    return 'sidebar-link-active font-medium'
  }
  return 'text-gray-600 hover:text-[var(--color-brand-rose)] hover:bg-[var(--color-primary-light)]'
})

const iconClasses = computed(() => {
  if (props.isActive) {
    return 'text-[var(--color-brand-rose)]'
  }
  return 'text-gray-400 group-hover:text-[var(--color-brand-rose)]'
})

const handleLinkClick = () => {
  emit('click', new Event('click'))
}
</script>

<style scoped>
.sidebar-link {
  text-decoration: none;
  cursor: pointer;
}

.sidebar-link-active {
  background-color: var(--color-primary-light);
  color: var(--color-brand-rose);
  border-left: 3px solid var(--color-brand-rose);
}

.sidebar-link:focus-visible {
  outline: 2px solid var(--color-brand-rose);
  outline-offset: 2px;
}

@media (max-width: 1023px) {
  .sidebar-link {
    min-height: 44px;
  }
}
</style>
