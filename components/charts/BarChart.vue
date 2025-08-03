<!-- components/charts/BarChart.vue -->
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
  CategoryScale,
  LinearScale,
  BarElement,
  Title,
  Tooltip,
  Legend,
  type ChartData,
  type ChartOptions
} from 'chart.js'

ChartJS.register(
  CategoryScale,
  LinearScale,
  BarElement,
  Title,
  Tooltip,
  Legend
)

interface Props {
  data: ChartData<'bar'>
  options?: ChartOptions<'bar'>
  width?: number
  height?: number
}

const props = withDefaults(defineProps<Props>(), {
  width: 400,
  height: 200
})

const chartRef = ref()
let chartInstance: ChartJS<'bar'> | null = null

const defaultOptions: ChartOptions<'bar'> = {
  responsive: true,
  maintainAspectRatio: false,
  plugins: {
    legend: {
      position: 'top'
    }
  },
  scales: {
    x: {
      display: true,
      grid: {
        display: false
      }
    },
    y: {
      display: true,
      beginAtZero: true,
      grid: {
        color: 'rgba(0, 0, 0, 0.1)'
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
    type: 'bar',
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
Smart, efficien