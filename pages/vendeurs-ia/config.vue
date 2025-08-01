<template>
  <div class="p-8 bg-green-50 min-h-screen">
    <h1 class="text-4xl font-bold text-green-600 mb-6">
      ✅ ROUTE STATIQUE FONCTIONNE !
    </h1>
    
    <div class="bg-white p-6 rounded-lg shadow space-y-4">
      <p class="text-xl">Route : {{ $route.fullPath }}</p>
      <p class="text-xl">Timestamp : {{ new Date().toLocaleString() }}</p>
      
      <button 
        @click="$router.push('/vendeurs-ia')"
        class="px-6 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700"
      >
        ← Retour à la liste
      </button>
    </div>
  </div>
</template>

<script setup>
console.log('✅ Route statique chargée')
</script>