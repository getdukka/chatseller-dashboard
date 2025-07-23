<!-- components/charts/LineChart.vue -->
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
  PointElement,
  LineElement,
  Title,
  Tooltip,
  Legend,
  type ChartData,
  type ChartOptions
} from 'chart.js'

// Enregistrement des composants Chart.js
ChartJS.register(
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Title,
  Tooltip,
  Legend
)

interface Props {
  data: ChartData<'line'>
  options?: ChartOptions<'line'>
  width?: number
  height?: number
}

const props = withDefaults(defineProps<Props>(), {
  width: 400,
  height: 200
})

const chartRef = ref<HTMLCanvasElement>()
let chartInstance: ChartJS<'line'> | null = null

const defaultOptions: ChartOptions<'line'> = {
  responsive: true,
  maintainAspectRatio: false,
  plugins: {
    legend: {
      position: 'top'
    },
    tooltip: {
      mode: 'index',
      intersect: false
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
  },
  elements: {
    line: {
      tension: 0.4
    },
    point: {
      radius: 4,
      hoverRadius: 6
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
    type: 'line',
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