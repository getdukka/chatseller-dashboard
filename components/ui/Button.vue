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
    <span v-if="hasSlotContent || label">
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
import { computed, useSlots } from 'vue'

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

const slots = useSlots()

// Vérifier si le slot par défaut a du contenu
const hasSlotContent = computed(() => {
  return !!(slots.default && slots.default().length > 0)
})

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
    'transition-all',
    'duration-200',
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
  
  if (props.iconLeft && (props.label || hasSlotContent.value)) {
    classes.push('mr-2')
  }
  
  if (props.iconRight && (props.label || hasSlotContent.value)) {
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

<style scoped>
/* Transition personnalisée */
.transition-all {
  transition-property: all;
  transition-timing-function: cubic-bezier(0.4, 0, 0.2, 1);
}

.transition-all.duration-200 {
  transition-duration: 200ms;
}
</style>