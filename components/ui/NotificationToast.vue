<!-- components/NotificationToast.vue - NOTIFICATION TOAST -->
<template>
  <Teleport to="body">
    <Transition
      enter-active-class="transform transition ease-out duration-300"
      enter-from-class="translate-x-full opacity-0"
      enter-to-class="translate-x-0 opacity-100"
      leave-active-class="transform transition ease-in duration-200"
      leave-from-class="translate-x-0 opacity-100"
      leave-to-class="translate-x-full opacity-0"
    >
      <div
        v-if="show"
        class="fixed bottom-4 right-4 max-w-sm w-full bg-white rounded-lg shadow-lg border border-gray-200 z-50"
        role="alert"
      >
        <div class="p-4">
          <div class="flex items-start">
            <!-- Icon -->
            <div class="flex-shrink-0">
              <!-- Success Icon -->
              <svg
                v-if="type === 'success'"
                class="w-6 h-6 text-green-600"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  stroke-linecap="round"
                  stroke-linejoin="round"
                  stroke-width="2"
                  d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z"
                />
              </svg>
              
              <!-- Error Icon -->
              <svg
                v-else-if="type === 'error'"
                class="w-6 h-6 text-red-600"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  stroke-linecap="round"
                  stroke-linejoin="round"
                  stroke-width="2"
                  d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
                />
              </svg>
              
              <!-- Warning Icon -->
              <svg
                v-else-if="type === 'warning'"
                class="w-6 h-6 text-yellow-600"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  stroke-linecap="round"
                  stroke-linejoin="round"
                  stroke-width="2"
                  d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-2.5L13.732 4c-.77-.833-1.732-.833-2.5 0L4.268 16.5c-.77.833.192 2.5 1.732 2.5z"
                />
              </svg>
              
              <!-- Info Icon -->
              <svg
                v-else
                class="w-6 h-6 text-blue-600"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  stroke-linecap="round"
                  stroke-linejoin="round"
                  stroke-width="2"
                  d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
                />
              </svg>
            </div>
            
            <!-- Message -->
            <div class="ml-3 w-0 flex-1">
              <p
                :class="getMessageClass()"
                class="text-sm font-medium"
              >
                {{ title || getDefaultTitle() }}
              </p>
              <p
                v-if="message"
                class="mt-1 text-sm text-gray-500"
              >
                {{ message }}
              </p>
            </div>
            
            <!-- Close Button -->
            <div class="ml-4 flex-shrink-0 flex">
              <button
                @click="handleClose"
                class="bg-white rounded-md inline-flex text-gray-400 hover:text-gray-500 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
                type="button"
              >
                <span class="sr-only">Fermer</span>
                <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path
                    stroke-linecap="round"
                    stroke-linejoin="round"
                    stroke-width="2"
                    d="M6 18L18 6M6 6l12 12"
                  />
                </svg>
              </button>
            </div>
          </div>
          
          <!-- Progress Bar -->
          <div
            v-if="duration && duration > 0"
            class="mt-3 w-full bg-gray-200 rounded-full h-1"
          >
            <div
              :class="getProgressBarClass()"
              class="h-1 rounded-full transition-all duration-100 ease-linear"
              :style="{ width: `${progress}%` }"
            ></div>
          </div>
        </div>
      </div>
    </Transition>
  </Teleport>
</template>

<script setup lang="ts">
import { ref, computed, onMounted, onUnmounted, watch } from 'vue'

// ✅ PROPS
interface Props {
  show: boolean
  type?: 'success' | 'error' | 'warning' | 'info'
  title?: string
  message: string
  duration?: number // in milliseconds, 0 = no auto-close
  persistent?: boolean // if true, won't auto-close
}

const props = withDefaults(defineProps<Props>(), {
  type: 'info',
  duration: 5000,
  persistent: false
})

// ✅ EMITS
const emit = defineEmits<{
  close: []
}>()

// ✅ REACTIVE STATE
const progress = ref(100)
let progressInterval: NodeJS.Timeout | null = null
let autoCloseTimeout: NodeJS.Timeout | null = null

// ✅ COMPUTED
const getMessageClass = () => {
  const classes: Record<string, string> = {
    success: 'text-green-900',
    error: 'text-red-900',
    warning: 'text-yellow-900',
    info: 'text-blue-900'
  }
  return classes[props.type] || classes.info
}

const getProgressBarClass = () => {
  const classes: Record<string, string> = {
    success: 'bg-green-500',
    error: 'bg-red-500',
    warning: 'bg-yellow-500',
    info: 'bg-blue-500'
  }
  return classes[props.type] || classes.info
}

const getDefaultTitle = () => {
  const titles: Record<string, string> = {
    success: 'Succès',
    error: 'Erreur',
    warning: 'Attention',
    info: 'Information'
  }
  return titles[props.type] || titles.info
}

// ✅ METHODS
const handleClose = () => {
  clearTimers()
  emit('close')
}

const clearTimers = () => {
  if (progressInterval) {
    clearInterval(progressInterval)
    progressInterval = null
  }
  if (autoCloseTimeout) {
    clearTimeout(autoCloseTimeout)
    autoCloseTimeout = null
  }
}

const startAutoClose = () => {
  if (props.persistent || !props.duration || props.duration <= 0) {
    return
  }

  // Reset progress
  progress.value = 100

  // Start progress bar animation
  const intervalDuration = 100 // Update every 100ms
  const decrementAmount = (intervalDuration / props.duration) * 100

  progressInterval = setInterval(() => {
    progress.value -= decrementAmount
    if (progress.value <= 0) {
      progress.value = 0
      clearTimers()
      emit('close')
    }
  }, intervalDuration)

  // Fallback timeout
  autoCloseTimeout = setTimeout(() => {
    clearTimers()
    emit('close')
  }, props.duration)
}

// ✅ WATCHERS
watch(() => props.show, (newShow) => {
  if (newShow) {
    startAutoClose()
  } else {
    clearTimers()
  }
})

// ✅ LIFECYCLE
onMounted(() => {
  if (props.show) {
    startAutoClose()
  }
})

onUnmounted(() => {
  clearTimers()
})
</script>

<style scoped>
/* Custom styles if needed */
</style>