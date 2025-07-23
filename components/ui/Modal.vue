<!-- components/ui/Modal.vue -->
<template>
  <div>
    <!-- Overlay -->
    <Transition
      enter-active-class="transition-opacity duration-300"
      enter-from-class="opacity-0"
      enter-to-class="opacity-100"
      leave-active-class="transition-opacity duration-300"
      leave-from-class="opacity-100"
      leave-to-class="opacity-0"
    >
      <div
        v-if="show"
        class="fixed inset-0 bg-gray-900/50 backdrop-blur-sm z-40"
        @click="closeOnOverlay && $emit('close')"
      />
    </Transition>

    <!-- Modal -->
    <Transition
      enter-active-class="transition-all duration-300"
      enter-from-class="opacity-0 scale-95 translate-y-4"
      enter-to-class="opacity-100 scale-100 translate-y-0"
      leave-active-class="transition-all duration-300"
      leave-from-class="opacity-100 scale-100 translate-y-0"
      leave-to-class="opacity-0 scale-95 translate-y-4"
    >
      <div
        v-if="show"
        class="fixed inset-0 z-50 flex items-center justify-center p-4"
      >
        <div
          :class="[
            'relative bg-white rounded-lg shadow-xl w-full max-h-screen overflow-hidden',
            sizeClasses
          ]"
        >
          <!-- Header -->
          <div
            v-if="title || $slots.header || closable"
            class="flex items-center justify-between p-6 border-b border-gray-200"
          >
            <div class="flex-1">
              <slot name="header">
                <h3 v-if="title" class="text-lg font-semibold text-gray-900">
                  {{ title }}
                </h3>
              </slot>
            </div>
            
            <button
              v-if="closable"
              @click="$emit('close')"
              class="ml-4 text-gray-400 hover:text-gray-600 transition-colors"
            >
              <svg class="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12" />
              </svg>
            </button>
          </div>

          <!-- Body -->
          <div :class="bodyClasses">
            <slot />
          </div>

          <!-- Footer -->
          <div
            v-if="$slots.footer"
            class="flex items-center justify-end gap-3 p-6 border-t border-gray-200 bg-gray-50"
          >
            <slot name="footer" />
          </div>
        </div>
      </div>
    </Transition>
  </div>
</template>

<script setup lang="ts">
// ✅ IMPORTS EXPLICITES
import { computed, onMounted, onUnmounted, watch } from 'vue'

interface Props {
  show: boolean
  title?: string
  size?: 'sm' | 'md' | 'lg' | 'xl' | 'full'
  closable?: boolean
  closeOnOverlay?: boolean
  scrollable?: boolean
}

interface Emits {
  close: []
}

const props = withDefaults(defineProps<Props>(), {
  size: 'md',
  closable: true,
  closeOnOverlay: true,
  scrollable: false
})

const emit = defineEmits<Emits>()

// Classes dynamiques selon la taille
const sizeClasses = computed(() => {
  const sizes = {
    sm: 'max-w-sm',
    md: 'max-w-md',
    lg: 'max-w-lg',
    xl: 'max-w-xl',
    full: 'max-w-full mx-4'
  }
  return sizes[props.size]
})

// Classes pour le body
const bodyClasses = computed(() => {
  const base = 'p-6'
  return props.scrollable 
    ? `${base} overflow-y-auto max-h-96`
    : base
})

// Gestion de l'échappement
onMounted(() => {
  const handleEscape = (e: KeyboardEvent) => {
    if (e.key === 'Escape' && props.show && props.closable) {
      emit('close')
    }
  }
  
  document.addEventListener('keydown', handleEscape)
  
  onUnmounted(() => {
    document.removeEventListener('keydown', handleEscape)
  })
})

// Prévention du scroll du body quand modal ouverte
watch(() => props.show, (isOpen) => {
  if (process.client) {
    if (isOpen) {
      document.body.style.overflow = 'hidden'
    } else {
      document.body.style.overflow = ''
    }
  }
})
</script>