<!-- components/charts/LineChart.vue -->
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
  PointElement,
  LineElement,
  Title,
  Tooltip,
  Legend,
  Filler
} from 'chart.js'

// Enregistrer les composants Chart.js nécessaires
ChartJS.register(
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Title,
  Tooltip,
  Legend,
  Filler
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
      position: 'bottom' as const,
      labels: {
        padding: 20,
        usePointStyle: true
      }
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
    type: 'line',
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



