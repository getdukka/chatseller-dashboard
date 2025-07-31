<!-- pages/test-route.vue - ROUTE DE TEST SIMPLE -->
<template>
  <div class="min-h-screen bg-green-100 p-8">
    <div class="max-w-4xl mx-auto">
      <div class="bg-white rounded-xl shadow-lg p-8 text-center">
        <h1 class="text-4xl font-bold text-green-600 mb-4">
          🎉 ROUTE DE TEST FONCTIONNE !
        </h1>
        <p class="text-xl text-gray-700 mb-6">
          Si vous voyez cette page, les routes Nuxt fonctionnent parfaitement.
        </p>
        <div class="space-y-4 text-left max-w-md mx-auto">
          <p><strong>URL:</strong> /test-route</p>
          <p><strong>Timestamp:</strong> {{ timestamp }}</p>
          <p><strong>Route Path:</strong> {{ $route.path }}</p>
          <p><strong>Route Name:</strong> {{ $route.name }}</p>
        </div>
        <div class="mt-8 space-x-4">
          <NuxtLink 
            to="/vendeurs-ia"
            class="inline-block px-6 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
          >
            → Aller aux Vendeurs IA
          </NuxtLink>
          <NuxtLink 
            to="/"
            class="inline-block px-6 py-3 bg-gray-600 text-white rounded-lg hover:bg-gray-700 transition-colors"
          >
            → Accueil
          </NuxtLink>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref } from 'vue'

const timestamp = ref(new Date().toLocaleString())

console.log('✅ ROUTE DE TEST SIMPLE CHARGÉE AVEC SUCCÈS!')
console.log('📍 Route actuelle:', useRoute().path)
console.log('🕐 Timestamp:', timestamp.value)

// ✅ SEO
useHead({
  title: 'Route de Test - ChatSeller'
})
</script>