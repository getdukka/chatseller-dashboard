<!-- components/charts/PieChart.vue -->
<template>
  <div class="relative">
    <canvas ref="chartRef"></canvas>
  </div>
</template>

<script setup lang="ts">
import { ref, onMounted, onUnmounted, watch } from 'vue'
import {
  Chart as ChartJS,
  ArcElement,
  Title,
  Tooltip,
  Legend
} from 'chart.js'

ChartJS.register(
  ArcElement,
  Title,
  Tooltip,
  Legend
)

interface Props {
  data: any
  options?: any
  width?: number
  height?: number
}

const props = withDefaults(defineProps<Props>(), {
  options: () => ({}),
  width: 400,
  height: 200
})

const chartRef = ref<HTMLCanvasElement>()
let chart: ChartJS | null = null

const defaultOptions = {
  responsive: true,
  maintainAspectRatio: false,
  plugins: {
    legend: {
      position: 'right' as const,
      labels: {
        padding: 20,
        usePointStyle: true
      }
    },
    tooltip: {
      callbacks: {
        label: (context: any) => {
          const label = context.label || ''
          const value = context.parsed || 0
          const total = context.dataset.data.reduce((a: number, b: number) => a + b, 0)
          const percentage = ((value / total) * 100).toFixed(1)
          return `${label}: ${percentage}%`
        }
      }
    }
  }
}

const createChart = () => {
  if (!chartRef.value) return

  chart = new ChartJS(chartRef.value, {
    type: 'pie',
    data: props.data,
    options: { ...defaultOptions, ...props.options }
  })
}

const updateChart = () => {
  if (chart) {
    chart.data = props.data
    chart.options = { ...defaultOptions, ...props.options }
    chart.update()
  }
}

watch(() => props.data, updateChart, { deep: true })
watch(() => props.options, updateChart, { deep: true })

onMounted(() => {
  createChart()
})

onUnmounted(() => {
  if (chart) {
    chart.destroy()
  }
})
</script>