<!-- components/LineChart.vue - COMPOSANT GRAPHIQUE SIMPLE SANS CHART.JS -->
<template>
  <div class="w-full h-full relative">
    <!-- SVG Chart -->
    <svg 
      :width="chartWidth" 
      :height="chartHeight" 
      :viewBox="`0 0 ${chartWidth} ${chartHeight}`"
      class="w-full h-full"
    >
      <!-- Grid Lines -->
      <g v-if="showGrid">
        <line
          v-for="i in 5"
          :key="`grid-h-${i}`"
          :x1="padding.left"
          :y1="padding.top + (chartHeight - padding.top - padding.bottom) * (i - 1) / 4"
          :x2="chartWidth - padding.right"
          :y2="padding.top + (chartHeight - padding.top - padding.bottom) * (i - 1) / 4"
          stroke="#f3f4f6"
          stroke-width="1"
        />
      </g>

      <!-- Line Path -->
      <path
        :d="linePath"
        :stroke="lineColor"
        :stroke-width="lineWidth"
        fill="none"
        stroke-linecap="round"
        stroke-linejoin="round"
      />

      <!-- Fill Area -->
      <path
        v-if="showArea"
        :d="areaPath"
        :fill="areaColor"
        opacity="0.1"
      />

      <!-- Data Points -->
      <g v-if="showPoints">
        <circle
          v-for="(point, index) in normalizedPoints"
          :key="`point-${index}`"
          :cx="point.x"
          :cy="point.y"
          :r="pointRadius"
          :fill="lineColor"
          stroke="white"
          stroke-width="2"
          class="hover:r-6 transition-all duration-200 cursor-pointer"
          @mouseenter="showTooltip(index, $event)"
          @mouseleave="hideTooltip"
        />
      </g>
    </svg>

    <!-- Tooltip -->
    <div
      v-if="tooltipVisible"
      ref="tooltip"
      class="absolute z-10 bg-gray-900 text-white text-sm rounded-lg px-3 py-2 shadow-lg pointer-events-none"
      :style="{ left: tooltipX + 'px', top: tooltipY + 'px' }"
    >
      <div class="font-semibold">{{ tooltipLabel }}</div>
      <div>{{ tooltipValue }}</div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, computed, nextTick } from 'vue'

// ✅ PROPS
interface Props {
  data: {
    labels: string[]
    datasets: Array<{
      label: string
      data: number[]
      borderColor?: string
      backgroundColor?: string
      tension?: number
      fill?: boolean
    }>
  }
  options?: {
    responsive?: boolean
    maintainAspectRatio?: boolean
    [key: string]: any
  }
  width?: number
  height?: number
}

const props = withDefaults(defineProps<Props>(), {
  width: 400,
  height: 300,
  options: () => ({})
})

// ✅ REACTIVE STATE
const tooltipVisible = ref(false)
const tooltipX = ref(0)
const tooltipY = ref(0)
const tooltipLabel = ref('')
const tooltipValue = ref('')
const tooltip = ref<HTMLElement>()

// ✅ CHART CONFIGURATION
const chartWidth = 400
const chartHeight = 300
const padding = {
  top: 20,
  right: 20,
  bottom: 40,
  left: 40
}

const showGrid = true
const showPoints = true
const showArea = true
const lineWidth = 3
const pointRadius = 4

// ✅ COMPUTED PROPERTIES
const dataset = computed(() => props.data.datasets[0] || { data: [], label: '', borderColor: '#3B82F6' })
const lineColor = computed(() => dataset.value.borderColor || '#3B82F6')
const areaColor = computed(() => dataset.value.backgroundColor || dataset.value.borderColor || '#3B82F6')

const dataValues = computed(() => dataset.value.data || [])
const labels = computed(() => props.data.labels || [])

const minValue = computed(() => Math.min(...dataValues.value))
const maxValue = computed(() => Math.max(...dataValues.value))
const valueRange = computed(() => maxValue.value - minValue.value || 1)

const chartInnerWidth = computed(() => chartWidth - padding.left - padding.right)
const chartInnerHeight = computed(() => chartHeight - padding.top - padding.bottom)

const normalizedPoints = computed(() => {
  return dataValues.value.map((value, index) => ({
    x: padding.left + (chartInnerWidth.value * index) / Math.max(dataValues.value.length - 1, 1),
    y: padding.top + chartInnerHeight.value - ((value - minValue.value) / valueRange.value) * chartInnerHeight.value
  }))
})

const linePath = computed(() => {
  if (normalizedPoints.value.length === 0) return ''
  
  let path = `M ${normalizedPoints.value[0].x} ${normalizedPoints.value[0].y}`
  
  for (let i = 1; i < normalizedPoints.value.length; i++) {
    const point = normalizedPoints.value[i]
    path += ` L ${point.x} ${point.y}`
  }
  
  return path
})

const areaPath = computed(() => {
  if (normalizedPoints.value.length === 0) return ''
  
  let path = `M ${normalizedPoints.value[0].x} ${padding.top + chartInnerHeight.value}`
  path += ` L ${normalizedPoints.value[0].x} ${normalizedPoints.value[0].y}`
  
  for (let i = 1; i < normalizedPoints.value.length; i++) {
    const point = normalizedPoints.value[i]
    path += ` L ${point.x} ${point.y}`
  }
  
  path += ` L ${normalizedPoints.value[normalizedPoints.value.length - 1].x} ${padding.top + chartInnerHeight.value}`
  path += ' Z'
  
  return path
})

// ✅ METHODS
const showTooltip = (index: number, event: MouseEvent) => {
  const value = dataValues.value[index]
  const label = labels.value[index]
  
  tooltipLabel.value = label || `Point ${index + 1}`
  
  // ✅ CORRECTION : Vérification de type sécurisée
  if (typeof value === 'number') {
    tooltipValue.value = value.toLocaleString('fr-FR')
  } else if (value !== null && value !== undefined) {
    tooltipValue.value = String(value)
  } else {
    tooltipValue.value = 'N/A'
  }
  
  // Position tooltip
  const rect = (event.target as Element).getBoundingClientRect()
  const container = (event.target as Element).closest('.relative')?.getBoundingClientRect()
  
  if (container) {
    tooltipX.value = rect.left - container.left + 10
    tooltipY.value = rect.top - container.top - 40
  }
  
  tooltipVisible.value = true
}

const hideTooltip = () => {
  tooltipVisible.value = false
}

// ✅ FORMAT FUNCTIONS (à utiliser si nécessaire)
const formatCurrency = (value: number): string => {
  return new Intl.NumberFormat('fr-FR', {
    style: 'currency',
    currency: 'EUR'
  }).format(value)
}
</script>

<style scoped>
/* ✅ RESPONSIVE SVG */
svg {
  overflow: visible;
}

/* ✅ HOVER EFFECTS */
circle:hover {
  r: 6;
}

/* ✅ TOOLTIP STYLES */
.tooltip {
  transform: translateX(-50%);
}
</style>