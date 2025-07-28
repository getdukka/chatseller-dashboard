<!-- pages/vendeurs-ia/[id]/test.vue - PAGE DE TEST ULTRA-SIMPLE -->
<template>
  <div class="min-h-screen bg-green-50 p-8">
    <div class="max-w-4xl mx-auto">
      <div class="bg-white rounded-xl shadow-lg border border-green-200 p-8 text-center">
        <h1 class="text-3xl font-bold text-green-800 mb-4">
          🎉 SUCCÈS ! Navigation fonctionne !
        </h1>
        
        <div class="bg-green-100 rounded-lg p-6 mb-6">
          <h2 class="text-xl font-semibold text-green-900 mb-2">
            Informations de la page
          </h2>
          <div class="space-y-2 text-left">
            <p><strong>Agent ID:</strong> {{ agentId }}</p>
            <p><strong>URL complète:</strong> {{ fullPath }}</p>
            <p><strong>Timestamp:</strong> {{ timestamp }}</p>
          </div>
        </div>
        
        <div class="space-x-4">
          <button 
            @click="goBack"
            class="px-6 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
          >
            ← Retour aux Vendeurs IA
          </button>
          
          <button 
            @click="goToConfigure"
            class="px-6 py-3 bg-purple-600 text-white rounded-lg hover:bg-purple-700 transition-colors"
          >
            🔧 Aller vers Configure
          </button>
        </div>
        
        <div class="mt-8 p-4 bg-yellow-50 rounded-lg">
          <p class="text-sm text-yellow-800">
            <strong>Test réussi !</strong> Si vous voyez cette page, la navigation Nuxt fonctionne parfaitement.
            Le problème est dans la page `/configure` originale.
          </p>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { computed } from 'vue'

// ✅ CONFIGURATION BASIQUE
definePageMeta({
  layout: 'default'
})

// ✅ COMPOSABLES SIMPLES
const route = useRoute()
const router = useRouter()

// ✅ COMPUTED SIMPLE
const agentId = computed(() => route.params.id as string)
const fullPath = computed(() => route.fullPath)
const timestamp = computed(() => new Date().toLocaleString())

// ✅ MÉTHODES SIMPLES
const goBack = () => {
  console.log('🔙 Retour vers /vendeurs-ia')
  router.push('/vendeurs-ia')
}

const goToConfigure = () => {
  console.log('🔧 Navigation vers /configure')
  router.push(`/vendeurs-ia/${agentId.value}/configure`)
}

// ✅ LOG DE SUCCÈS
console.log('🎉 PAGE TEST CHARGÉE AVEC SUCCÈS!')
console.log('📍 Agent ID:', agentId.value)
console.log('📍 URL:', fullPath.value)

// ✅ SEO SIMPLE
useHead({
  title: `Test Navigation - Agent ${agentId.value} - ChatSeller`
})
</script>

<style scoped>
/* Styles basiques pour la page de test */
</style>