<!-- components/Modal.vue - COMPOSANT MODAL RÉUTILISABLE -->
<template>
  <div v-if="show" class="modal-overlay" @click.self="$emit('close')">
    <div class="modal-content" :class="sizeClasses">
      <!-- Header -->
      <div class="modal-header">
        <h3 class="modal-title">{{ title }}</h3>
        <button @click="$emit('close')" class="modal-close-button">
          <svg class="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12"/>
          </svg>
        </button>
      </div>
      
      <!-- Body -->
      <div class="modal-body">
        <slot />
      </div>
      
      <!-- Footer (si des slots sont fournis) -->
      <div v-if="$slots.footer" class="modal-footer">
        <slot name="footer" />
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { computed, onMounted, onUnmounted } from 'vue'

// ✅ PROPS
interface Props {
  show: boolean
  title: string
  size?: 'sm' | 'md' | 'lg' | 'xl' | 'full'
  closable?: boolean
}

const props = withDefaults(defineProps<Props>(), {
  size: 'md',
  closable: true
})

// ✅ EMITS
const emit = defineEmits<{
  close: []
}>()

// ✅ COMPUTED
const sizeClasses = computed(() => {
  const sizes = {
    sm: 'max-w-sm',
    md: 'max-w-md',
    lg: 'max-w-2xl',
    xl: 'max-w-4xl',
    full: 'max-w-7xl'
  }
  return sizes[props.size] || sizes.md
})

// ✅ METHODS
const handleEscapeKey = (event: KeyboardEvent) => {
  if (event.key === 'Escape' && props.closable) {
    emit('close')
  }
}

// ✅ LIFECYCLE
onMounted(() => {
  document.addEventListener('keydown', handleEscapeKey)
  // Empêcher le scroll du body quand la modal est ouverte
  document.body.style.overflow = 'hidden'
})

onUnmounted(() => {
  document.removeEventListener('keydown', handleEscapeKey)
  // Restaurer le scroll du body
  document.body.style.overflow = 'unset'
})
</script>

<style scoped>
/* ✅ OVERLAY */
.modal-overlay {
  @apply fixed inset-0 z-50 overflow-y-auto bg-gray-900 bg-opacity-50 backdrop-blur-sm flex items-center justify-center p-4;
  animation: fadeIn 0.2s ease-out;
}

/* ✅ CONTENU MODAL */
.modal-content {
  @apply bg-white rounded-xl shadow-xl w-full max-h-[90vh] overflow-y-auto;
  animation: slideIn 0.3s ease-out;
}

/* ✅ HEADER */
.modal-header {
  @apply flex items-center justify-between p-6 border-b border-gray-200;
}

.modal-title {
  @apply text-xl font-semibold text-gray-900;
}

.modal-close-button {
  @apply text-gray-400 hover:text-gray-600 transition-colors p-1 rounded-lg hover:bg-gray-100;
}

/* ✅ BODY */
.modal-body {
  @apply p-6;
}

/* ✅ FOOTER */
.modal-footer {
  @apply flex items-center justify-end space-x-3 p-6 border-t border-gray-200 bg-gray-50;
}

/* ✅ ANIMATIONS */
@keyframes fadeIn {
  from {
    opacity: 0;
  }
  to {
    opacity: 1;
  }
}

@keyframes slideIn {
  from {
    opacity: 0;
    transform: scale(0.95) translateY(-10px);
  }
  to {
    opacity: 1;
    transform: scale(1) translateY(0);
  }
}

/* ✅ RESPONSIVE */
@media (max-width: 640px) {
  .modal-content {
    @apply mx-2 max-h-[95vh];
  }
  
  .modal-header,
  .modal-body,
  .modal-footer {
    @apply px-4;
  }
  
  .modal-header {
    @apply py-4;
  }
  
  .modal-body {
    @apply py-4;
  }
  
  .modal-footer {
    @apply py-4;
  }
}

/* ✅ SCROLL STYLING */
.modal-content {
  scrollbar-width: thin;
  scrollbar-color: rgba(156, 163, 175, 0.5) transparent;
}

.modal-content::-webkit-scrollbar {
  width: 6px;
}

.modal-content::-webkit-scrollbar-track {
  background: transparent;
}

.modal-content::-webkit-scrollbar-thumb {
  background-color: rgba(156, 163, 175, 0.5);
  border-radius: 3px;
}

.modal-content::-webkit-scrollbar-thumb:hover {
  background-color: rgba(156, 163, 175, 0.8);
}
</style>