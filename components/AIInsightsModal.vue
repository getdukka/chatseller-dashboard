<!-- components/AIInsightsModal.vue -->
<template>
  <div class="fixed inset-0 z-50 overflow-y-auto">
    <div class="flex items-center justify-center min-h-screen px-4 pt-4 pb-20 text-center sm:block sm:p-0">
      <!-- Overlay -->
      <div class="fixed inset-0 transition-opacity bg-gray-500 bg-opacity-75" @click="$emit('close')"></div>

      <!-- Modal -->
      <div class="inline-block w-full max-w-3xl p-6 my-8 overflow-hidden text-left align-middle transition-all transform bg-white shadow-xl rounded-2xl">
        <div class="flex items-center justify-between mb-6">
          <div>
            <h3 class="text-xl font-semibold text-gray-900">Analytics IA - {{ product?.name }}</h3>
            <p class="text-sm text-gray-600 mt-1">Performance et insights de recommandation</p>
          </div>
          <button @click="$emit('close')" class="text-gray-400 hover:text-gray-600">
            <svg class="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12"/>
            </svg>
          </button>
        </div>

        <div v-if="loading" class="text-center py-8">
          <div class="animate-spin rounded-full h-8 w-8 border-b-2 border-rose-600 mx-auto"></div>
          <p class="text-gray-600 mt-2">Chargement des insights IA...</p>
        </div>

        <div v-else class="space-y-6">
          <!-- Performance Overview -->
          <div class="grid grid-cols-2 md:grid-cols-4 gap-4">
            <div class="bg-blue-50 p-4 rounded-lg">
              <div class="text-2xl font-bold text-blue-600">{{ insights.recommendations || 0 }}</div>
              <div class="text-sm text-blue-800">Recommandations</div>
            </div>
            <div class="bg-green-50 p-4 rounded-lg">
              <div class="text-2xl font-bold text-green-600">{{ insights.conversions || 0 }}</div>
              <div class="text-sm text-green-800">Conversions</div>
            </div>
            <div class="bg-purple-50 p-4 rounded-lg">
              <div class="text-2xl font-bold text-purple-600">{{ insights.conversion_rate || 0 }}%</div>
              <div class="text-sm text-purple-800">Taux conversion</div>
            </div>
            <div class="bg-rose-50 p-4 rounded-lg">
              <div class="text-2xl font-bold text-rose-600">{{ formatRevenue(insights.revenue_generated || 0) }}</div>
              <div class="text-sm text-rose-800">Revenus générés</div>
            </div>
          </div>

          <!-- Score d'engagement -->
          <div class="bg-gradient-to-r from-indigo-50 to-purple-50 p-6 rounded-xl">
            <h4 class="text-lg font-semibold text-indigo-900 mb-4">Score d'engagement IA</h4>
            <div class="flex items-center justify-between">
              <div class="flex-1">
                <div class="bg-white rounded-full h-4 overflow-hidden">
                  <div 
                    class="h-full bg-gradient-to-r from-indigo-500 to-purple-500 transition-all duration-300"
                    :style="{ width: (insights.engagement_score || 0) * 10 + '%' }"
                  ></div>
                </div>
                <div class="flex justify-between text-sm text-indigo-700 mt-2">
                  <span>Faible</span>
                  <span>Excellent</span>
                </div>
              </div>
              <div class="ml-6 text-right">
                <div class="text-3xl font-bold text-indigo-600">{{ insights.engagement_score || 0 }}/10</div>
                <div class="text-sm text-indigo-800">{{ getEngagementLabel(insights.engagement_score || 0) }}</div>
              </div>
            </div>
          </div>

          <!-- Feedback clients -->
          <div class="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div class="bg-gray-50 p-6 rounded-xl">
              <h4 class="text-lg font-semibold text-gray-900 mb-4">Feedback clients</h4>
              <div class="space-y-3">
                <div class="flex items-center justify-between">
                  <span class="text-sm text-gray-600">Note moyenne</span>
                  <div class="flex items-center">
                    <span class="text-lg font-bold text-yellow-600">{{ insights.customer_feedback_avg || 0 }}/5</span>
                    <div class="flex ml-2">
                      <svg v-for="i in 5" :key="i" class="w-4 h-4" :class="i <= (insights.customer_feedback_avg || 0) ? 'text-yellow-400' : 'text-gray-300'" fill="currentColor" viewBox="0 0 20 20">
                        <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z"/>
                      </svg>
                    </div>
                  </div>
                </div>
                <div class="text-xs text-gray-500">Basé sur {{ insights.total_reviews || 0 }} avis</div>
              </div>
            </div>

            <div class="bg-gray-50 p-6 rounded-xl">
              <h4 class="text-lg font-semibold text-gray-900 mb-4">Tendance</h4>
              <div class="flex items-center">
                <div class="flex-1">
                  <div :class="getTrendClass(insights.performance_trend)">
                    {{ getTrendLabel(insights.performance_trend) }}
                  </div>
                  <div class="text-xs text-gray-500 mt-1">Sur les 30 derniers jours</div>
                </div>
                <div :class="getTrendIconClass(insights.performance_trend)">
                  <svg class="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path v-if="insights.performance_trend === 'up'" stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M13 7h8m0 0v8m0-8l-8 8-4-4-6 6"/>
                    <path v-else-if="insights.performance_trend === 'down'" stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M13 17h8m0 0V9m0 8l-8-8-4 4-6-6"/>
                    <path v-else stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M13 10V3L4 14h7v7l9-11h-7z"/>
                  </svg>
                </div>
              </div>
            </div>
          </div>

          <!-- Recommandations d'optimisation -->
          <div class="bg-yellow-50 p-6 rounded-xl">
            <h4 class="text-lg font-semibold text-yellow-900 mb-4">Recommandations d'optimisation</h4>
            <div class="space-y-2">
              <div v-for="recommendation in recommendations" :key="recommendation" class="flex items-start">
                <svg class="w-5 h-5 text-yellow-600 mt-0.5 mr-3 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9.663 17h4.673M12 3v1m6.364 1.636l-.707.707M21 12h-1M4 12H3m3.343-5.657l-.707-.707m2.828 9.9a5 5 0 117.072 0l-.548.547A3.374 3.374 0 0014 18.469V19a2 2 0 11-4 0v-.531c0-.895-.356-1.754-.988-2.386l-.548-.547z"/>
                </svg>
                <span class="text-sm text-yellow-800">{{ recommendation }}</span>
              </div>
            </div>
          </div>

          <!-- Actions -->
          <div class="flex justify-end space-x-3 pt-4 border-t border-gray-200">
            <button
              @click="exportData"
              class="px-4 py-2 text-sm font-medium text-gray-700 bg-white border border-gray-300 rounded-lg hover:bg-gray-50"
            >
              Exporter les données
            </button>
            <button
              @click="$emit('close')"
              class="px-4 py-2 text-sm font-medium text-white bg-gradient-to-r from-rose-600 to-pink-600 rounded-lg hover:from-rose-700 hover:to-pink-700"
            >
              Fermer
            </button>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, computed, onMounted } from 'vue'

// Props & Emits
const props = defineProps<{
  product: any
}>()

defineEmits(['close'])

// Reactive data
const loading = ref(true)
const insights = ref({
  recommendations: 0,
  conversions: 0,
  conversion_rate: 0,
  revenue_generated: 0,
  engagement_score: 0,
  customer_feedback_avg: 0,
  total_reviews: 0,
  performance_trend: 'stable',
  last_recommended: null
})

const recommendations = ref([
  'Enrichir la description avec plus d\'ingrédients actifs',
  'Ajouter des conseils d\'application personnalisés',
  'Optimiser pour les types de peau sensible',
  'Améliorer les visuels produit pour augmenter l\'engagement'
])

// Computed
const getEngagementLabel = (score: number) => {
  if (score >= 8) return 'Excellent'
  if (score >= 6) return 'Bon'
  if (score >= 4) return 'Moyen'
  return 'À améliorer'
}

const getTrendLabel = (trend: string) => {
  switch (trend) {
    case 'up': return 'En hausse'
    case 'down': return 'En baisse'
    default: return 'Stable'
  }
}

const getTrendClass = (trend: string) => {
  switch (trend) {
    case 'up': return 'text-green-600 font-semibold'
    case 'down': return 'text-red-600 font-semibold'
    default: return 'text-gray-600 font-semibold'
  }
}

const getTrendIconClass = (trend: string) => {
  switch (trend) {
    case 'up': return 'text-green-500'
    case 'down': return 'text-red-500'
    default: return 'text-gray-500'
  }
}

const formatRevenue = (amount: number) => {
  return new Intl.NumberFormat('fr-FR', {
    style: 'currency',
    currency: 'XOF'
  }).format(amount)
}

// Methods
const exportData = () => {
  const data = {
    product_name: props.product.name,
    insights: insights.value,
    exported_at: new Date().toISOString()
  }
  
  const blob = new Blob([JSON.stringify(data, null, 2)], { type: 'application/json' })
  const url = window.URL.createObjectURL(blob)
  const a = document.createElement('a')
  a.href = url
  a.download = `insights-${props.product.name.replace(/[^a-z0-9]/gi, '-').toLowerCase()}.json`
  document.body.appendChild(a)
  a.click()
  document.body.removeChild(a)
  window.URL.revokeObjectURL(url)
}

// Lifecycle
onMounted(async () => {
  // Simuler chargement des données
  await new Promise(resolve => setTimeout(resolve, 1000))
  
  // Données simulées basées sur le produit
  insights.value = {
    recommendations: Math.floor(Math.random() * 200) + 50,
    conversions: Math.floor(Math.random() * 50) + 10,
    conversion_rate: Math.floor(Math.random() * 20) + 5,
    revenue_generated: Math.floor(Math.random() * 5000) + 1000,
    engagement_score: Math.floor(Math.random() * 4) + 6,
    customer_feedback_avg: 3.5 + Math.random() * 1.5,
    total_reviews: Math.floor(Math.random() * 100) + 20,
    performance_trend: ['up', 'down', 'stable'][Math.floor(Math.random() * 3)],
    last_recommended: new Date().toISOString()
  }
  
  loading.value = false
})
</script>

