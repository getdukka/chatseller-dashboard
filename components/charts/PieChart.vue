<!-- components/charts/PieChart.vue -->
<template>
  <div class="relative">
    <canvas
      ref="chartRef"
      :width="width"
      :height="height"
      class="max-w-full"
    />
  </div>
</template>

<script setup lang="ts">
import {
  Chart as ChartJS,
  ArcElement,
  Tooltip,
  Legend,
  type ChartData,
  type ChartOptions
} from 'chart.js'

ChartJS.register(ArcElement, Tooltip, Legend)

interface Props {
  data: ChartData<'pie'>
  options?: ChartOptions<'pie'>
  width?: number
  height?: number
}

const props = withDefaults(defineProps<Props>(), {
  width: 300,
  height: 300
})

const chartRef = ref()
let chartInstance: ChartJS<'pie'> | null = null

const defaultOptions: ChartOptions<'pie'> = {
  responsive: true,
  maintainAspectRatio: false,
  plugins: {
    legend: {
      position: 'bottom'
    },
    tooltip: {
      callbacks: {
        label: (context) => {
          const label = context.label || ''
          const value = context.parsed
          const total = context.dataset.data.reduce((a: number, b: number) => a + b, 0)
          const percentage = ((value / total) * 100).toFixed(1)
          return `${label}: ${percentage}%`
        }
      }
    }
  }
}

const mergedOptions = computed(() => ({
  ...defaultOptions,
  ...props.options
}))

const createChart = () => {
  if (!chartRef.value) return

  chartInstance = new ChartJS(chartRef.value, {
    type: 'pie',
    data: props.data,
    options: mergedOptions.value
  })
}

const updateChart = () => {
  if (chartInstance) {
    chartInstance.data = props.data
    chartInstance.options = mergedOptions.value
    chartInstance.update()
  }
}

onMounted(() => {
  nextTick(() => {
    createChart()
  })
})

onUnmounted(() => {
  if (chartInstance) {
    chartInstance.destroy()
    chartInstance = null
  }
})

watch(() => props.data, updateChart, { deep: true })
watch(() => props.options, updateChart, { deep: true })
</script>