<!-- components/ui/Modal.vue - COMPOSANT MODAL CORRIGÉ -->
<template>
  <Teleport to="body">
    <div
      v-if="show"
      class="fixed inset-0 z-50 overflow-y-auto"
      @click="handleOverlayClick"
    >
      <!-- Overlay -->
      <div class="fixed inset-0 bg-black bg-opacity-50 transition-opacity"></div>
      
      <!-- Modal -->
      <div class="flex min-h-full items-center justify-center p-4">
        <div
          :class="[
            'relative bg-white rounded-lg shadow-xl transition-all w-full max-w-lg',
            sizeClasses[size],
            {
              'max-h-96 overflow-y-auto': scrollable
            }
          ]"
          @click.stop
        >
          <!-- Header -->
          <div v-if="title || closable" class="flex items-center justify-between p-6 border-b border-gray-200">
            <h3 v-if="title" class="text-lg font-medium text-gray-900">
              {{ title }}
            </h3>
            <button
              v-if="closable"
              @click="handleClose"
              class="text-gray-400 hover:text-gray-600 transition-colors"
            >
              <svg class="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12"/>
              </svg>
            </button>
          </div>
          
          <!-- Content -->
          <div class="p-6">
            <slot />
          </div>
        </div>
      </div>
    </div>
  </Teleport>
</template>

<script setup lang="ts">
interface Props {
  show: boolean
  title?: string
  size?: 'sm' | 'md' | 'lg' | 'xl' | 'full'
  closable?: boolean
  closeOnOverlay?: boolean
  scrollable?: boolean
}

interface Emits {
  (e: 'close'): void
}

const props = withDefaults(defineProps<Props>(), {
  size: 'md',
  closable: true,
  closeOnOverlay: true,
  scrollable: false
})

const emit = defineEmits<Emits>()

const sizeClasses = {
  sm: 'max-w-sm',
  md: 'max-w-md',
  lg: 'max-w-lg',
  xl: 'max-w-2xl',
  full: 'max-w-7xl'
}

const handleClose = () => {
  emit('close')
}

const handleOverlayClick = () => {
  if (props.closeOnOverlay) {
    handleClose()
  }
}

// Empêcher le scroll du body quand la modal est ouverte
watch(() => props.show, (isOpen) => {
  if (process.client) {
    if (isOpen) {
      document.body.style.overflow = 'hidden'
    } else {
      document.body.style.overflow = ''
    }
  }
})

// Nettoyage au démontage
onUnmounted(() => {
  if (process.client) {
    document.body.style.overflow = ''
  }
})
</script>