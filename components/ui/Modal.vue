<!-- components/UI/Modal.vue -->
<template>
  <Teleport to="body">
    <Transition
      enter-active-class="transition duration-300 ease-out"
      enter-from-class="opacity-0"
      enter-to-class="opacity-100"
      leave-active-class="transition duration-200 ease-in"
      leave-from-class="opacity-100"
      leave-to-class="opacity-0"
    >
      <div v-if="modelValue" class="fixed inset-0 bg-gray-600 bg-opacity-75 transition-opacity z-50" @click="handleOverlayClick">
        <div class="fixed inset-0 z-50 overflow-y-auto">
          <div class="flex min-h-full items-end justify-center p-4 text-center sm:items-center sm:p-0">
            <Transition
              enter-active-class="transition duration-300 ease-out"
              enter-from-class="opacity-0 translate-y-4 sm:translate-y-0 sm:scale-95"
              enter-to-class="opacity-100 translate-y-0 sm:scale-100"
              leave-active-class="transition duration-200 ease-in"
              leave-from-class="opacity-100 translate-y-0 sm:scale-100"
              leave-to-class="opacity-0 translate-y-4 sm:translate-y-0 sm:scale-95"
            >
              <div v-if="modelValue" class="bg-white rounded-lg shadow-xl transform transition-all w-full mx-auto" :class="sizeClasses">
                <!-- Header -->
                <div v-if="$slots.header || title" class="flex items-center justify-between p-6 border-b border-gray-200">
                  <div>
                    <slot name="header">
                      <h3 class="text-lg font-medium text-gray-900">{{ title }}</h3>
                      <p v-if="subtitle" class="mt-1 text-sm text-gray-500">{{ subtitle }}</p>
                    </slot>
                  </div>
                  <button
                    v-if="closable"
                    @click="close"
                    class="rounded-md text-gray-400 hover:text-gray-500 focus:outline-none focus:ring-2 focus:ring-blue-500"
                  >
                    <span class="sr-only">Fermer</span>
                    <svg class="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12" />
                    </svg>
                  </button>
                </div>

                <!-- Content -->
                <div class="p-6">
                  <slot />
                </div>

                <!-- Footer -->
                <div v-if="$slots.footer" class="flex items-center justify-end space-x-3 p-6 border-t border-gray-200 bg-gray-50">
                  <slot name="footer" />
                </div>
              </div>
            </Transition>
          </div>
        </div>
      </div>
    </Transition>
  </Teleport>
</template>

<script setup lang="ts">
import { computed } from 'vue'

interface Props {
  modelValue: boolean
  title?: string
  subtitle?: string
  size?: 'sm' | 'md' | 'lg' | 'xl' | 'full'
  closable?: boolean
  closeOnOverlay?: boolean
}

const props = withDefaults(defineProps<Props>(), {
  size: 'md',
  closable: true,
  closeOnOverlay: true
})

const emit = defineEmits<{
  'update:modelValue': [value: boolean]
  close: []
}>()

const sizeClasses = computed(() => {
  const sizeMap = {
    sm: 'max-w-md',
    md: 'max-w-lg',
    lg: 'max-w-2xl',
    xl: 'max-w-4xl',
    full: 'max-w-full m-4'
  }
  return sizeMap[props.size]
})

const close = () => {
  emit('update:modelValue', false)
  emit('close')
}

const handleOverlayClick = (event: Event) => {
  if (props.closeOnOverlay && event.target === event.currentTarget) {
    close()
  }
}

// Gestion de l'échappement
const handleEscape = (event: KeyboardEvent) => {
  if (event.key === 'Escape' && props.modelValue && props.closable) {
    close()
  }
}

onMounted(() => {
  document.addEventListener('keydown', handleEscape)
})

onUnmounted(() => {
  document.removeEventListener('keydown', handleEscape)
})
</script>