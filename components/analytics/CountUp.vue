<!-- components/analytics/CountUp.vue -->
<template>
  <span>{{ displayValue }}</span>
</template>

<script setup lang="ts">
import { ref, onMounted, watch } from 'vue'

interface Props {
  endVal: number
  duration?: number
  startVal?: number
}

const props = withDefaults(defineProps<Props>(), {
  duration: 1000,
  startVal: 0
})

const displayValue = ref(props.startVal)

const animateNumber = () => {
  if (props.endVal === props.startVal) {
    displayValue.value = props.endVal
    return
  }

  const startTime = Date.now()
  const startVal = displayValue.value
  const difference = props.endVal - startVal

  const animate = () => {
    const elapsed = Date.now() - startTime
    const progress = Math.min(elapsed / props.duration, 1)
    
    // Easing function (ease-out)
    const easeOut = 1 - Math.pow(1 - progress, 3)
    
    displayValue.value = Math.round(startVal + (difference * easeOut))
    
    if (progress < 1) {
      requestAnimationFrame(animate)
    }
  }
  
  requestAnimationFrame(animate)
}

onMounted(() => {
  animateNumber()
})

watch(() => props.endVal, () => {
  animateNumber()
})
</script>

<!-- components/analytics/CurrencyCountUp.vue -->
<template>
  <span>{{ formattedValue }}</span>
</template>

<script setup lang="ts">
import { ref, computed, onMounted, watch } from 'vue'

interface Props {
  endVal: number
  duration?: number
  startVal?: number
}

const props = withDefaults(defineProps<Props>(), {
  duration: 1200,
  startVal: 0
})

const currentValue = ref(props.startVal)

const formattedValue = computed(() => {
  return new Intl.NumberFormat('fr-FR', {
    style: 'currency',
    currency: 'EUR'
  }).format(currentValue.value)
})

const animateNumber = () => {
  if (props.endVal === props.startVal) {
    currentValue.value = props.endVal
    return
  }

  const startTime = Date.now()
  const startVal = currentValue.value
  const difference = props.endVal - startVal

  const animate = () => {
    const elapsed = Date.now() - startTime
    const progress = Math.min(elapsed / props.duration, 1)
    
    const easeOut = 1 - Math.pow(1 - progress, 3)
    currentValue.value = startVal + (difference * easeOut)
    
    if (progress < 1) {
      requestAnimationFrame(animate)
    }
  }
  
  requestAnimationFrame(animate)
}

onMounted(() => {
  animateNumber()
})

watch(() => props.endVal, () => {
  animateNumber()
})
</script>

<!-- components/analytics/PercentageCountUp.vue -->
<template>
  <span>{{ formattedValue }}</span>
</template>

<script setup lang="ts">
import { ref, computed, onMounted, watch } from 'vue'

interface Props {
  endVal: number
  duration?: number
  startVal?: number
  decimals?: number
}

const props = withDefaults(defineProps<Props>(), {
  duration: 1500,
  startVal: 0,
  decimals: 1
})

const currentValue = ref(props.startVal)

const formattedValue = computed(() => {
  return `${currentValue.value.toFixed(props.decimals)}%`
})

const animateNumber = () => {
  if (props.endVal === props.startVal) {
    currentValue.value = props.endVal
    return
  }

  const startTime = Date.now()
  const startVal = currentValue.value
  const difference = props.endVal - startVal

  const animate = () => {
    const elapsed = Date.now() - startTime
    const progress = Math.min(elapsed / props.duration, 1)
    
    const easeOut = 1 - Math.pow(1 - progress, 3)
    currentValue.value = startVal + (difference * easeOut)
    
    if (progress < 1) {
      requestAnimationFrame(animate)
    }
  }
  
  requestAnimationFrame(animate)
}

onMounted(() => {
  animateNumber()
})

watch(() => props.endVal, () => {
  animateNumber()
})
</script>

<!-- components/analytics/GrowthIndicator.vue -->
<template>
  <p class="text-xs mt-1 flex items-center" :class="textClass">
    <component :is="icon" class="w-3 h-3 mr-1" />
    <span v-if="value !== null">
      {{ value >= 0 ? '+' : '' }}{{ value.toFixed(1) }}% vs période précédente
    </span>
    <span v-else>Pas de données précédentes</span>
  </p>
</template>

<script setup lang="ts">
import { computed } from 'vue'

interface Props {
  value: number | null
  color: 'blue' | 'green' | 'yellow' | 'purple'
}

const props = defineProps<Props>()

const textClass = computed(() => {
  if (props.value === null) return 'text-gray-500'
  
  const baseClass = `text-${props.color}-600`
  return props.value >= 0 ? baseClass : 'text-red-600'
})

const icon = computed(() => {
  if (props.value === null) return 'svg'
  return props.value >= 0 ? 'TrendingUpIcon' : 'TrendingDownIcon'
})
</script>

<!-- components/analytics/ChartLegend.vue -->
<template>
  <div class="flex items-center space-x-2 text-sm text-gray-500">
    <div class="w-3 h-3 rounded-full" :style="{ backgroundColor: color }"></div>
    <span>{{ label }}</span>
  </div>
</template>

<script setup lang="ts">
interface Props {
  color: string
  label: string
}

defineProps<Props>()
</script>

<!-- components/analytics/EmptyChart.vue -->
<template>
  <div class="flex items-center justify-center h-64">
    <div class="text-center">
      <svg class="mx-auto h-12 w-12 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 48 48">
        <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 17v-2a2 2 0 012-2h6l2 2h6a2 2 0 012 2v2M9 17v6a2 2 0 002 2h6l2-2h6a2 2 0 002-2v-6M9 17h12"/>
      </svg>
      <p class="mt-2 text-sm text-gray-500">{{ message }}</p>
    </div>
  </div>
</template>

<script setup lang="ts">
interface Props {
  message: string
}

defineProps<Props>()
</script>

<!-- components/analytics/EmptyState.vue -->
<template>
  <div class="text-center py-8">
    <component :is="iconComponent" class="mx-auto h-12 w-12 text-gray-400" />
    <h3 class="mt-2 text-sm font-medium text-gray-900">{{ title }}</h3>
    <p class="mt-1 text-sm text-gray-500">{{ description }}</p>
    <div v-if="action" class="mt-4">
      <NuxtLink 
        :to="action.link" 
        class="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md text-white bg-blue-600 hover:bg-blue-700"
      >
        {{ action.text }}
      </NuxtLink>
    </div>
  </div>
</template>

<script setup lang="ts">
import { computed } from 'vue'

interface Props {
  icon: string
  title: string
  description: string
  action?: {
    text: string
    link: string
  }
}

const props = defineProps<Props>()

const iconComponent = computed(() => {
  const icons = {
    'shopping-bag': () => 'svg', // Shopping bag icon
    'users': () => 'svg',        // Users icon
    'bell': () => 'svg'          // Bell icon
  }
  
  return icons[props.icon as keyof typeof icons] || (() => 'svg')
})
</script>

<!-- components/analytics/MetricItem.vue -->
<template>
  <div class="flex items-center justify-between">
    <div>
      <p class="text-sm font-medium text-gray-900">{{ label }}</p>
      <p class="text-xs text-gray-500">{{ description }}</p>
    </div>
    <div class="text-right">
      <p class="text-lg font-bold" :class="colorClass">{{ value }}</p>
    </div>
  </div>
</template>

<script setup lang="ts">
import { computed } from 'vue'

interface Props {
  label: string
  value: string
  description: string
  color: 'blue' | 'green' | 'purple' | 'yellow'
}

const props = defineProps<Props>()

const colorClass = computed(() => `text-${props.color}-600`)
</script>

<!-- components/analytics/LoadingSpinner.vue -->
<template>
  <div class="animate-spin rounded-full h-6 w-6 border-b-2 border-blue-600"></div>
</template>

<script setup lang="ts">
// Simple loading spinner component
</script>

<!-- Ajout des styles pour les animations -->
<style>
/* Animations pour les cartes */
.card-hover {
  transition: transform 0.2s ease-in-out, box-shadow 0.2s ease-in-out;
}

.card-hover:hover {
  transform: translateY(-2px);
  box-shadow: 0 10px 25px rgba(0, 0, 0, 0.1);
}

/* Animation pour le toast */
.toast-enter-active,
.toast-leave-active {
  transition: all 0.3s ease;
}

.toast-enter-from,
.toast-leave-to {
  opacity: 0;
  transform: translateX(100%);
}

/* Animation pour les métriques */
.metric-item {
  transition: background-color 0.2s ease;
}

.metric-item:hover {
  background-color: rgba(0, 0, 0, 0.02);
}

/* Styles pour les graphiques */
.chart-container {
  position: relative;
  height: 300px;
  width: 100%;
}

@media (max-width: 768px) {
  .chart-container {
    height: 250px;
  }
}

/* Styles pour les cartes modernes */
.card-modern {
  @apply bg-white rounded-xl shadow-sm border border-gray-200 p-6;
  transition: all 0.2s ease-in-out;
}

.input-modern {
  @apply px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-colors text-sm;
}

/* Animation de pulsation pour les éléments de chargement */
.pulse-animation {
  animation: pulse 2s cubic-bezier(0.4, 0, 0.6, 1) infinite;
}

@keyframes pulse {
  0%, 100% {
    opacity: 1;
  }
  50% {
    opacity: 0.5;
  }
}

/* Style pour les indicateurs de performance */
.performance-indicator {
  transition: all 0.3s ease-in-out;
}

.performance-indicator:hover {
  transform: scale(1.02);
}

/* Styles pour les agents */
.agent-card {
  transition: all 0.2s ease-in-out;
}

.agent-card:hover {
  background-color: rgba(59, 130, 246, 0.05);
  border-color: rgba(59, 130, 246, 0.2);
}

/* Animation pour les éléments de liste */
.list-item-enter-active,
.list-item-leave-active {
  transition: all 0.3s ease;
}

.list-item-enter-from,
.list-item-leave-to {
  opacity: 0;
  transform: translateY(-10px);
}

/* Styles pour les tooltips */
.tooltip {
  @apply absolute z-10 px-2 py-1 text-xs text-white bg-gray-900 rounded shadow-lg;
  transform: translateX(-50%);
  opacity: 0;
  visibility: hidden;
  transition: opacity 0.2s, visibility 0.2s;
}

.tooltip-trigger:hover .tooltip {
  opacity: 1;
  visibility: visible;
}

/* Responsive pour les tableaux */
@media (max-width: 640px) {
  .responsive-table {
    display: block;
    overflow-x: auto;
    white-space: nowrap;
  }
  
  .responsive-table thead {
    display: none;
  }
  
  .responsive-table tbody tr {
    display: block;
    border: 1px solid #e5e7eb;
    margin-bottom: 10px;
    padding: 10px;
    border-radius: 8px;
  }
  
  .responsive-table tbody td {
    display: block;
    text-align: left !important;
    padding: 5px 0;
    border: none;
  }
  
  .responsive-table tbody td:before {
    content: attr(data-label) ": ";
    font-weight: bold;
    color: #374151;
  }
}

/* Animation de chargement pour les skeletons */
.skeleton {
  background: linear-gradient(90deg, #f0f0f0 25%, #e0e0e0 50%, #f0f0f0 75%);
  background-size: 200% 100%;
  animation: loading 1.5s infinite;
}

@keyframes loading {
  0% {
    background-position: 200% 0;
  }
  100% {
    background-position: -200% 0;
  }
}

/* Amélioration de l'accessibilité */
.focus-ring {
  @apply focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500;
}

/* Animation pour les changements de valeurs */
.value-change {
  transition: color 0.3s ease, transform 0.2s ease;
}

.value-increase {
  color: #10b981;
  transform: scale(1.05);
}

.value-decrease {
  color: #ef4444;
  transform: scale(0.95);
}

/* Styles pour les badges */
.badge {
  @apply inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium;
}

.badge-success {
  @apply bg-green-100 text-green-800;
}

.badge-warning {
  @apply bg-yellow-100 text-yellow-800;
}

.badge-error {
  @apply bg-red-100 text-red-800;
}

.badge-info {
  @apply bg-blue-100 text-blue-800;
}
</style>