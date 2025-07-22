<!-- components/charts/BarChart.vue -->
<template>
  <div class="relative">
    <canvas ref="chartRef"></canvas>
  </div>
</template>

<script setup lang="ts">
import { ref, onMounted, onUnmounted, watch } from 'vue'
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  BarElement,
  Title,
  Tooltip,
  Legend
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
  scales: {
    y: {
      beginAtZero: true,
      grid: {
        color: 'rgba(0, 0, 0, 0.1)'
      }
    },
    x: {
      grid: {
        display: false
      }
    }
  },
  plugins: {
    legend: {
      display: false
    },
    tooltip: {
      mode: 'index' as const,
      intersect: false
    }
  }
}

const createChart = () => {
  if (!chartRef.value) return

  chart = new ChartJS(chartRef.value, {
    type: 'bar',
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

<style scoped>
.relative {
  position: relative;
}
</style>