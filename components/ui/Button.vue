<!-- components/ui/Button.vue -->
<template>
  <component
    :is="tag"
    :to="to"
    :href="href"
    :disabled="disabled || loading"
    :class="buttonClasses"
    v-bind="$attrs"
    @click="handleClick"
  >
    <!-- Loading spinner -->
    <svg
      v-if="loading"
      class="animate-spin -ml-1 mr-2 h-4 w-4"
      fill="none"
      viewBox="0 0 24 24"
    >
      <circle class="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" stroke-width="4"></circle>
      <path class="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
    </svg>

    <!-- Icon à gauche -->
    <component 
      v-if="iconLeft && !loading" 
      :is="iconLeft" 
      :class="iconClasses" 
    />

    <!-- Contenu du slot -->
    <span v-if="$slots.default || label">
      <slot>{{ label }}</slot>
    </span>

    <!-- Icon à droite -->
    <component 
      v-if="iconRight" 
      :is="iconRight" 
      :class="iconClasses" 
    />

    <!-- Badge -->
    <span v-if="badge" :class="badgeClasses">
      {{ badge }}
    </span>
  </component>
</template>

<script setup lang="ts">
import { computed } from 'vue'

interface Props {
  variant?: 'primary' | 'secondary' | 'ghost' | 'danger' | 'success' | 'warning'
  size?: 'xs' | 'sm' | 'md' | 'lg' | 'xl'
  disabled?: boolean
  loading?: boolean
  block?: boolean
  outline?: boolean
  rounded?: boolean
  elevated?: boolean
  to?: string
  href?: string
  label?: string
  iconLeft?: any
  iconRight?: any
  badge?: string | number
}

const props = withDefaults(defineProps<Props>(), {
  variant: 'primary',
  size: 'md',
  disabled: false,
  loading: false,
  block: false,
  outline: false,
  rounded: false,
  elevated: false
})

const emit = defineEmits<{
  click: [event: Event]
}>()

// Détermine le tag à utiliser
const tag = computed(() => {
  if (props.to) return 'NuxtLink'
  if (props.href) return 'a'
  return 'button'
})

// Classes pour le bouton
const buttonClasses = computed(() => {
  const baseClasses = [
    'inline-flex',
    'items-center',
    'justify-center',
    'font-medium',
    'transition-all-fast',
    'focus:outline-none',
    'focus:ring-2',
    'focus:ring-offset-2',
    'disabled:opacity-50',
    'disabled:cursor-not-allowed'
  ]

  // Taille
  const sizeClasses = {
    xs: ['px-2.5', 'py-1.5', 'text-xs', 'rounded'],
    sm: ['px-3', 'py-2', 'text-sm', 'rounded-md'],
    md: ['px-4', 'py-2', 'text-sm', 'rounded-md'],
    lg: ['px-4', 'py-2', 'text-base', 'rounded-md'],
    xl: ['px-6', 'py-3', 'text-base', 'rounded-md']
  }

  // Variantes
  const variantClasses = {
    primary: props.outline 
      ? ['border', 'border-blue-600', 'text-blue-600', 'bg-white', 'hover:bg-blue-50', 'focus:ring-blue-500']
      : ['border', 'border-transparent', 'text-white', 'bg-blue-600', 'hover:bg-blue-700', 'focus:ring-blue-500'],
    
    secondary: props.outline
      ? ['border', 'border-gray-300', 'text-gray-700', 'bg-white', 'hover:bg-gray-50', 'focus:ring-gray-500']
      : ['border', 'border-gray-300', 'text-gray-700', 'bg-white', 'hover:bg-gray-50', 'focus:ring-gray-500'],
    
    ghost: ['border', 'border-transparent', 'text-gray-700', 'bg-transparent', 'hover:bg-gray-100', 'focus:ring-gray-500'],
    
    danger: props.outline
      ? ['border', 'border-red-600', 'text-red-600', 'bg-white', 'hover:bg-red-50', 'focus:ring-red-500']
      : ['border', 'border-transparent', 'text-white', 'bg-red-600', 'hover:bg-red-700', 'focus:ring-red-500'],
    
    success: props.outline
      ? ['border', 'border-green-600', 'text-green-600', 'bg-white', 'hover:bg-green-50', 'focus:ring-green-500']
      : ['border', 'border-transparent', 'text-white', 'bg-green-600', 'hover:bg-green-700', 'focus:ring-green-500'],
    
    warning: props.outline
      ? ['border', 'border-yellow-600', 'text-yellow-600', 'bg-white', 'hover:bg-yellow-50', 'focus:ring-yellow-500']
      : ['border', 'border-transparent', 'text-white', 'bg-yellow-600', 'hover:bg-yellow-700', 'focus:ring-yellow-500']
  }

  // Options additionnelles
  const optionClasses = []
  
  if (props.block) optionClasses.push('w-full')
  if (props.rounded) optionClasses.push('rounded-full')
  if (props.elevated) optionClasses.push('shadow-lg', 'hover:shadow-xl')

  return [
    ...baseClasses,
    ...sizeClasses[props.size],
    ...variantClasses[props.variant],
    ...optionClasses
  ]
})

// Classes pour les icônes
const iconClasses = computed(() => {
  const sizeMap = {
    xs: 'h-3 w-3',
    sm: 'h-4 w-4',
    md: 'h-4 w-4',
    lg: 'h-5 w-5',
    xl: 'h-5 w-5'
  }

  const classes = [sizeMap[props.size]]
  
  if (props.iconLeft && (props.label || $slots.default)) {
    classes.push('mr-2')
  }
  
  if (props.iconRight && (props.label || $slots.default)) {
    classes.push('ml-2')
  }

  return classes
})

// Classes pour le badge
const badgeClasses = computed(() => [
  'ml-2',
  'inline-flex',
  'items-center',
  'justify-center',
  'px-2',
  'py-0.5',
  'rounded-full',
  'text-xs',
  'font-medium',
  'bg-white',
  'text-gray-900'
])

// Gestion du clic
const handleClick = (event: Event) => {
  if (!props.disabled && !props.loading) {
    emit('click', event)
  }
}
</script>

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
      <div v-if="modelValue" class="modal-overlay" @click="handleOverlayClick">
        <div class="modal-container">
          <div class="flex min-h-full items-end justify-center p-4 text-center sm:items-center sm:p-0">
            <Transition
              enter-active-class="transition duration-300 ease-out"
              enter-from-class="opacity-0 translate-y-4 sm:translate-y-0 sm:scale-95"
              enter-to-class="opacity-100 translate-y-0 sm:scale-100"
              leave-active-class="transition duration-200 ease-in"
              leave-from-class="opacity-100 translate-y-0 sm:scale-100"
              leave-to-class="opacity-0 translate-y-4 sm:translate-y-0 sm:scale-95"
            >
              <div v-if="modelValue" class="modal-content" :class="sizeClasses">
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

<!-- components/UI/Input.vue -->
<template>
  <div :class="containerClasses">
    <!-- Label -->
    <label v-if="label" :for="inputId" :class="labelClasses">
      {{ label }}
      <span v-if="required" class="text-red-500 ml-1">*</span>
    </label>

    <!-- Input wrapper -->
    <div class="relative">
      <!-- Icon gauche -->
      <div v-if="iconLeft" class="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
        <component :is="iconLeft" :class="iconClasses" />
      </div>

      <!-- Input field -->
      <input
        :id="inputId"
        :type="type"
        :value="modelValue"
        :placeholder="placeholder"
        :disabled="disabled"
        :readonly="readonly"
        :required="required"
        :autocomplete="autocomplete"
        :class="inputClasses"
        v-bind="$attrs"
        @input="handleInput"
        @blur="handleBlur"
        @focus="handleFocus"
      />

      <!-- Icon droite ou bouton -->
      <div v-if="iconRight || clearable" class="absolute inset-y-0 right-0 flex items-center">
        <!-- Bouton clear -->
        <button
          v-if="clearable && modelValue"
          @click="clear"
          class="pr-3 text-gray-400 hover:text-gray-500 focus:outline-none"
        >
          <svg class="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12" />
          </svg>
        </button>

        <!-- Icon droite -->
        <div v-else-if="iconRight" class="pr-3 pointer-events-none">
          <component :is="iconRight" :class="iconClasses" />
        </div>
      </div>
    </div>

    <!-- Helper text ou erreur -->
    <p v-if="error || hint" :class="helpTextClasses">
      {{ error || hint }}
    </p>
  </div>
</template>

<script setup lang="ts">
import { computed, ref } from 'vue'

interface Props {
  modelValue?: string | number
  type?: string
  label?: string
  placeholder?: string
  hint?: string
  error?: string
  disabled?: boolean
  readonly?: boolean
  required?: boolean
  clearable?: boolean
  autocomplete?: string
  iconLeft?: any
  iconRight?: any
  size?: 'sm' | 'md' | 'lg'
}

const props = withDefaults(defineProps<Props>(), {
  type: 'text',
  size: 'md'
})

const emit = defineEmits<{
  'update:modelValue': [value: string | number]
  blur: [event: Event]
  focus: [event: Event]
}>()

const inputId = ref(`input-${Math.random().toString(36).substr(2, 9)}`)
const focused = ref(false)

const containerClasses = computed(() => ['w-full'])

const labelClasses = computed(() => [
  'block',
  'text-sm',
  'font-medium',
  'text-gray-700',
  'mb-2'
])

const inputClasses = computed(() => {
  const baseClasses = [
    'block',
    'w-full',
    'border',
    'rounded-md',
    'shadow-sm',
    'transition-all-fast',
    'focus:outline-none',
    'focus:ring-2',
    'focus:ring-offset-0',
    'disabled:opacity-50',
    'disabled:cursor-not-allowed',
    'disabled:bg-gray-50'
  ]

  // Taille
  const sizeClasses = {
    sm: ['px-3', 'py-2', 'text-sm'],
    md: ['px-3', 'py-2', 'text-sm'],
    lg: ['px-4', 'py-3', 'text-base']
  }

  // État
  const stateClasses = props.error
    ? ['border-red-300', 'text-red-900', 'placeholder-red-300', 'focus:ring-red-500', 'focus:border-red-500']
    : ['border-gray-300', 'text-gray-900', 'placeholder-gray-400', 'focus:ring-blue-500', 'focus:border-blue-500']

  // Padding pour les icônes
  const paddingClasses = []
  if (props.iconLeft) paddingClasses.push('pl-10')
  if (props.iconRight || props.clearable) paddingClasses.push('pr-10')

  return [
    ...baseClasses,
    ...sizeClasses[props.size],
    ...stateClasses,
    ...paddingClasses
  ]
})

const iconClasses = computed(() => {
  const sizeMap = {
    sm: 'h-4 w-4',
    md: 'h-5 w-5',
    lg: 'h-5 w-5'
  }

  return [
    sizeMap[props.size],
    props.error ? 'text-red-400' : 'text-gray-400'
  ]
})

const helpTextClasses = computed(() => [
  'mt-2',
  'text-sm',
  props.error ? 'text-red-600' : 'text-gray-500'
])

const handleInput = (event: Event) => {
  const target = event.target as HTMLInputElement
  emit('update:modelValue', target.value)
}

const handleBlur = (event: Event) => {
  focused.value = false
  emit('blur', event)
}

const handleFocus = (event: Event) => {
  focused.value = true
  emit('focus', event)
}

const clear = () => {
  emit('update:modelValue', '')
}
</script>

<!-- components/UI/Badge.vue -->
<template>
  <span :class="badgeClasses">
    <component v-if="icon" :is="icon" class="mr-1 h-3 w-3" />
    <slot>{{ label }}</slot>
  </span>
</template>

<script setup lang="ts">
import { computed } from 'vue'

interface Props {
  variant?: 'primary' | 'secondary' | 'success' | 'warning' | 'error' | 'info'
  size?: 'sm' | 'md' | 'lg'
  label?: string
  icon?: any
  dot?: boolean
}

const props = withDefaults(defineProps<Props>(), {
  variant: 'primary',
  size: 'md'
})

const badgeClasses = computed(() => {
  const baseClasses = [
    'inline-flex',
    'items-center',
    'font-medium',
    'rounded-full'
  ]

  // Taille
  const sizeClasses = {
    sm: ['px-2', 'py-0.5', 'text-xs'],
    md: ['px-2.5', 'py-0.5', 'text-xs'],
    lg: ['px-3', 'py-1', 'text-sm']
  }

  // Variantes
  const variantClasses = {
    primary: ['bg-blue-100', 'text-blue-800'],
    secondary: ['bg-gray-100', 'text-gray-800'],
    success: ['bg-green-100', 'text-green-800'],
    warning: ['bg-yellow-100', 'text-yellow-800'],
    error: ['bg-red-100', 'text-red-800'],
    info: ['bg-cyan-100', 'text-cyan-800']
  }

  // Dot badge
  if (props.dot) {
    return [
      'inline-block',
      'h-2',
      'w-2',
      'rounded-full',
      variantClasses[props.variant][0]
    ]
  }

  return [
    ...baseClasses,
    ...sizeClasses[props.size],
    ...variantClasses[props.variant]
  ]
})
</script>