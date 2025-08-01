<!-- pages/vendeurs-ia/test.vue - ROUTE STATIQUE DE TEST -->
<template>
  <div class="p-8 bg-green-50 min-h-screen">
    <h1 class="text-4xl font-bold text-green-600 mb-6">
      ✅ ROUTE STATIQUE FONCTIONNE !
    </h1>
    
    <div class="bg-white p-6 rounded-lg shadow-sm space-y-4">
      <p class="text-lg">
        <strong>Route actuelle :</strong> {{ route.fullPath }}
      </p>
      
      <p class="text-lg">
        <strong>Serveur sur port :</strong> {{ window.location.port }}
      </p>
      
      <p class="text-lg">
        <strong>Timestamp :</strong> {{ new Date().toLocaleString() }}
      </p>
      
      <button 
        @click="goBack"
        class="px-6 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
      >
        ← Retour à la liste
      </button>
    </div>
  </div>
</template>

<script setup>
// Pas de middleware pour ce test
definePageMeta({
  layout: 'default',
  middleware: [] // Vider le middleware pour ce test
})

const route = useRoute()
const router = useRouter()

const goBack = () => {
  router.push('/vendeurs-ia')
}

console.log('🧪 ROUTE STATIQUE TEST CHARGÉE:', route.fullPath)
</script>