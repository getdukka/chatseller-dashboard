<!-- pages/vendeurs-ia/[id]/configure.vue - VERSION TEST SIMPLIFIÉE -->
<template>
  <div class="min-h-screen bg-gray-50 p-8">
    <div class="max-w-4xl mx-auto">
      <!-- Header de test -->
      <div class="bg-white rounded-xl shadow-sm border border-gray-200 p-6 mb-8">
        <div class="flex items-center justify-between">
          <div class="flex items-center space-x-4">
            <button @click="goBack" class="p-2 text-gray-400 hover:text-gray-600 rounded-lg hover:bg-gray-100 transition-colors">
              <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M15 19l-7-7 7-7"/>
              </svg>
            </button>
            <div>
              <h1 class="text-2xl font-bold text-gray-900">
                🎉 PAGE DE CONFIGURATION - TEST RÉUSSI !
              </h1>
              <p class="mt-1 text-gray-600">
                Agent ID: {{ agentId }} | Nom: {{ agentName }}
              </p>
            </div>
          </div>
        </div>
      </div>

      <!-- Informations de debug -->
      <div class="bg-green-50 border border-green-200 rounded-xl p-6 mb-8">
        <h2 class="text-lg font-semibold text-green-900 mb-4">✅ Debug Info - Navigation Réussie !</h2>
        <div class="space-y-2 text-sm">
          <p><strong>Agent ID:</strong> {{ agentId }}</p>
          <p><strong>Agent Name:</strong> {{ agentName }}</p>
          <p><strong>Route Path:</strong> {{ routePath }}</p>
          <p><strong>Query Params:</strong> {{ JSON.stringify(queryParams, null, 2) }}</p>
          <p><strong>Timestamp:</strong> {{ new Date().toLocaleString() }}</p>
        </div>
      </div>

      <!-- Actions de test -->
      <div class="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
        <h3 class="text-lg font-semibold text-gray-900 mb-4">Actions de Test</h3>
        <div class="flex space-x-4">
          <button 
            @click="goBack"
            class="inline-flex items-center px-4 py-2 bg-gray-600 text-white text-sm font-medium rounded-lg hover:bg-gray-700 transition-colors"
          >
            ← Retour aux Vendeurs IA
          </button>
          <button 
            @click="testFunction"
            class="inline-flex items-center px-4 py-2 bg-blue-600 text-white text-sm font-medium rounded-lg hover:bg-blue-700 transition-colors"
          >
            🧪 Test Function
          </button>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { computed } from 'vue'

// ✅ PAGE META
definePageMeta({
  middleware: 'auth',
  layout: 'default'
})

// ✅ COMPOSABLES SIMPLES
const route = useRoute()
const router = useRouter()

// ✅ COMPUTED SIMPLES
const agentId = computed(() => {
  const id = route.params.id as string
  console.log('🆔 Agent ID récupéré:', id)
  return id
})

const agentName = computed(() => {
  return route.query.name as string || 'Nom non disponible'
})

const routePath = computed(() => {
  return route.path
})

const queryParams = computed(() => {
  return route.query
})

// ✅ METHODS SIMPLES
const goBack = () => {
  console.log('🔙 Retour vers vendeurs-ia')
  router.push('/vendeurs-ia')
}

const testFunction = () => {
  console.log('🧪 Test function called!')
  console.log('Agent ID:', agentId.value)
  console.log('Agent Name:', agentName.value)
  alert(`✅ Test réussi !\nAgent: ${agentName.value}\nID: ${agentId.value}`)
}

// ✅ LIFECYCLE
onMounted(() => {
  console.log('🚀 Page configure.vue montée avec succès!')
  console.log('📋 Paramètres:', {
    id: agentId.value,
    name: agentName.value,
    query: route.query
  })
})

// ✅ SEO
useHead({
  title: computed(() => `Configuration - ${agentName.value} - ChatSeller`)
})
</script>

<style scoped>
/* Styles simples pour le test */
</style>