<!-- components/NavItem.vue -->
<template>
  <NuxtLink
    :to="to"
    :class="[
      'flex items-center space-x-3 px-4 py-2 mx-2 rounded-lg transition-colors',
      isActive 
        ? 'bg-pink-50 text-pink-600 border-r-2 border-pink-600' 
        : 'text-gray-700 hover:bg-gray-100'
    ]"
  >
    <Icon :name="icon" class="h-5 w-5" />
    <span class="font-medium">{{ label }}</span>
  </NuxtLink>
</template>

<script setup lang="ts">
interface Props {
  to: string
  icon: string
  label: string
}

const props = defineProps<Props>()
const route = useRoute()

const isActive = computed(() => {
  if (props.to === '/') {
    return route.path === '/'
  }
  return route.path.startsWith(props.to)
})
</script>