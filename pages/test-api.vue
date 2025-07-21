<!-- pages/test-api.vue -->
<template>
  <div class="p-8">
    <h1 class="text-2xl font-bold mb-6 text-blue-600">Test des Endpoints API ChatSeller</h1>
    
    <div class="space-y-4">
      <!-- Test Health -->
      <div class="border p-4 rounded">
        <h3 class="font-semibold">✅ Test Health Endpoint</h3>
        <button @click="testHealth" :disabled="loading" class="bg-green-500 text-white px-4 py-2 rounded mt-2">
          {{ loading ? 'Test en cours...' : 'Tester /health' }}
        </button>
        <div v-if="healthResult" class="mt-2 p-2 bg-gray-100 rounded text-xs">
          <strong>Résultat:</strong>
          <pre>{{ JSON.stringify(healthResult, null, 2) }}</pre>
        </div>
      </div>

      <!-- Test Endpoints Login -->
      <div class="border p-4 rounded">
        <h3 class="font-semibold">🔐 Test Endpoints Login</h3>
        <div class="grid grid-cols-1 gap-2 mt-2">
          <button @click="testLoginEndpoint('/auth/login')" class="bg-blue-500 text-white p-2 rounded text-sm">
            POST /auth/login
          </button>
          <button @click="testLoginEndpoint('/api/v1/auth/login')" class="bg-blue-500 text-white p-2 rounded text-sm">
            POST /api/v1/auth/login
          </button>
          <button @click="testLoginEndpoint('/login')" class="bg-blue-500 text-white p-2 rounded text-sm">
            POST /login
          </button>
          <button @click="testLoginEndpoint('/api/login')" class="bg-blue-500 text-white p-2 rounded text-sm">
            POST /api/login
          </button>
        </div>
        <div v-if="loginTestResult" class="mt-2 p-2 bg-gray-100 rounded text-xs">
          <strong>Endpoint testé:</strong> {{ testedLoginEndpoint }}<br>
          <strong>Résultat:</strong>
          <pre>{{ JSON.stringify(loginTestResult, null, 2) }}</pre>
        </div>
      </div>

      <!-- Test Endpoints GET -->
      <div class="border p-4 rounded">
        <h3 class="font-semibold">📊 Test Autres Endpoints (GET)</h3>
        <div class="grid grid-cols-2 gap-2 mt-2">
          <button @click="testGetEndpoint('/api/v1/conversations')" class="bg-purple-500 text-white p-2 rounded text-xs">
            GET /api/v1/conversations
          </button>
          <button @click="testGetEndpoint('/conversations')" class="bg-purple-500 text-white p-2 rounded text-xs">
            GET /conversations
          </button>
          <button @click="testGetEndpoint('/api/v1/orders')" class="bg-purple-500 text-white p-2 rounded text-xs">
            GET /api/v1/orders
          </button>
          <button @click="testGetEndpoint('/orders')" class="bg-purple-500 text-white p-2 rounded text-xs">
            GET /orders
          </button>
          <button @click="testGetEndpoint('/api/v1/shops/1')" class="bg-purple-500 text-white p-2 rounded text-xs">
            GET /api/v1/shops/1
          </button>
          <button @click="testGetEndpoint('/shops/1')" class="bg-purple-500 text-white p-2 rounded text-xs">
            GET /shops/1
          </button>
        </div>
        <div v-if="getTestResult" class="mt-2 p-2 bg-gray-100 rounded text-xs">
          <strong>Endpoint testé:</strong> {{ testedGetEndpoint }}<br>
          <strong>Résultat:</strong>
          <pre>{{ JSON.stringify(getTestResult, null, 2) }}</pre>
        </div>
      </div>
    </div>

    <!-- Configuration Info -->
    <div class="mt-8 p-4 bg-blue-50 rounded">
      <h3 class="font-semibold text-blue-800">📋 Configuration Actuelle</h3>
      <p><strong>API URL:</strong> {{ config.public.apiUrl }}</p>
      <p><strong>Proxy vers:</strong> https://chatseller-api-production.up.railway.app</p>
    </div>
  </div>
</template>

<script setup>
definePageMeta({
  layout: false,
  middleware: [] // ✅ Désactive le middleware auth pour cette page
})

const config = useRuntimeConfig()

const loading = ref(false)
const healthResult = ref(null)
const loginTestResult = ref(null)
const getTestResult = ref(null)
const testedLoginEndpoint = ref('')
const testedGetEndpoint = ref('')

const testHealth = async () => {
  loading.value = true
  try {
    const response = await $fetch('/api/health')
    healthResult.value = { success: true, data: response }
  } catch (error) {
    healthResult.value = { success: false, error: error.message, status: error.statusCode }
  }
  loading.value = false
}

const testLoginEndpoint = async (endpoint) => {
  loading.value = true
  testedLoginEndpoint.value = endpoint
  try {
    const response = await $fetch(`/api${endpoint}`, {
      method: 'POST',
      body: {
        email: 'admin@chatseller.app',
        password: 'password123'
      }
    })
    loginTestResult.value = { success: true, data: response }
  } catch (error) {
    loginTestResult.value = { 
      success: false, 
      error: error.message, 
      status: error.statusCode,
      statusText: error.statusMessage 
    }
  }
  loading.value = false
}

const testGetEndpoint = async (endpoint) => {
  loading.value = true
  testedGetEndpoint.value = endpoint
  try {
    const response = await $fetch(`/api${endpoint}`)
    getTestResult.value = { success: true, data: response }
  } catch (error) {
    getTestResult.value = { 
      success: false, 
      error: error.message, 
      status: error.statusCode,
      statusText: error.statusMessage 
    }
  }
  loading.value = false
}

onMounted(() => {
  console.log('🧪 Page de test API chargée')
  console.log('Configuration:', config.public)
})
</script>