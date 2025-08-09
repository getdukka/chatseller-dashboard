<!-- pages/debug-auth.vue - OUTIL DE DIAGNOSTIC TEMPORAIRE -->
<template>
  <div class="min-h-screen bg-gray-50 py-8">
    <div class="max-w-4xl mx-auto px-4">
      <div class="bg-white rounded-lg shadow-lg p-6">
        <h1 class="text-2xl font-bold text-gray-900 mb-6">🔍 Debug Tool - Authentification ChatSeller</h1>
        
        <!-- Informations URL -->
        <div class="mb-6 p-4 bg-blue-50 rounded-lg">
          <h2 class="text-lg font-semibold text-blue-900 mb-3">📍 Informations URL</h2>
          <div class="space-y-2 text-sm">
            <p><strong>URL complète:</strong> <code class="bg-blue-100 px-2 py-1 rounded">{{ urlInfo.full }}</code></p>
            <p><strong>Path:</strong> <code class="bg-blue-100 px-2 py-1 rounded">{{ urlInfo.path }}</code></p>
            <p><strong>Hash:</strong> <code class="bg-blue-100 px-2 py-1 rounded">{{ urlInfo.hash || 'Aucun' }}</code></p>
            <p><strong>Query:</strong> <code class="bg-blue-100 px-2 py-1 rounded">{{ urlInfo.query || 'Aucun' }}</code></p>
          </div>
        </div>

        <!-- Informations Supabase Auth -->
        <div class="mb-6 p-4 bg-green-50 rounded-lg">
          <h2 class="text-lg font-semibold text-green-900 mb-3">🔐 État Supabase Auth</h2>
          <div class="space-y-2 text-sm">
            <p><strong>Utilisateur connecté:</strong> 
              <span :class="supabaseAuth.isLoggedIn ? 'text-green-600' : 'text-red-600'">
                {{ supabaseAuth.isLoggedIn ? 'Oui' : 'Non' }}
              </span>
            </p>
            <p v-if="supabaseAuth.user"><strong>Email:</strong> {{ supabaseAuth.user.email }}</p>
            <p v-if="supabaseAuth.user"><strong>ID:</strong> {{ supabaseAuth.user.id }}</p>
            <p><strong>Session valide:</strong> 
              <span :class="supabaseAuth.hasValidSession ? 'text-green-600' : 'text-red-600'">
                {{ supabaseAuth.hasValidSession ? 'Oui' : 'Non' }}
              </span>
            </p>
            <p v-if="supabaseAuth.error" class="text-red-600"><strong>Erreur:</strong> {{ supabaseAuth.error }}</p>
          </div>
        </div>

        <!-- Informations Store Auth -->
        <div class="mb-6 p-4 bg-yellow-50 rounded-lg">
          <h2 class="text-lg font-semibold text-yellow-900 mb-3">📦 État Store Auth</h2>
          <div class="space-y-2 text-sm">
            <p><strong>Authentifié:</strong> 
              <span :class="storeAuth.isAuthenticated ? 'text-green-600' : 'text-red-600'">
                {{ storeAuth.isAuthenticated ? 'Oui' : 'Non' }}
              </span>
            </p>
            <p v-if="storeAuth.user"><strong>Email:</strong> {{ storeAuth.user.email }}</p>
            <p v-if="storeAuth.user"><strong>Nom:</strong> {{ storeAuth.user.name }}</p>
            <p v-if="storeAuth.user"><strong>Shop ID:</strong> {{ storeAuth.user.shopId }}</p>
            <p><strong>Token présent:</strong> 
              <span :class="storeAuth.hasToken ? 'text-green-600' : 'text-red-600'">
                {{ storeAuth.hasToken ? 'Oui' : 'Non' }}
              </span>
            </p>
          </div>
        </div>

        <!-- Test de récupération API -->
        <div class="mb-6 p-4 bg-purple-50 rounded-lg">
          <h2 class="text-lg font-semibold text-purple-900 mb-3">🌐 Test API</h2>
          <button 
            @click="testAPI"
            :disabled="loading"
            class="bg-purple-600 text-white px-4 py-2 rounded-lg hover:bg-purple-700 disabled:opacity-50 mb-4"
          >
            {{ loading ? 'Test en cours...' : 'Tester la récupération des données' }}
          </button>
          
          <div v-if="apiResult" class="space-y-2 text-sm">
            <p><strong>Statut:</strong> 
              <span :class="apiResult.success ? 'text-green-600' : 'text-red-600'">
                {{ apiResult.success ? 'Succès' : 'Erreur' }}
              </span>
            </p>
            <p v-if="apiResult.error" class="text-red-600"><strong>Erreur:</strong> {{ apiResult.error }}</p>
            <div v-if="apiResult.data">
              <p><strong>Données reçues:</strong></p>
              <pre class="bg-purple-100 p-3 rounded mt-2 overflow-x-auto text-xs">{{ JSON.stringify(apiResult.data, null, 2) }}</pre>
            </div>
          </div>
        </div>

        <!-- Configuration Supabase -->
        <div class="mb-6 p-4 bg-indigo-50 rounded-lg">
          <h2 class="text-lg font-semibold text-indigo-900 mb-3">⚙️ Configuration détectée</h2>
          <div class="space-y-2 text-sm">
            <p><strong>Supabase URL:</strong> <code class="bg-indigo-100 px-2 py-1 rounded">{{ config.supabaseUrl }}</code></p>
            <p><strong>API Base URL:</strong> <code class="bg-indigo-100 px-2 py-1 rounded">{{ config.apiBaseUrl }}</code></p>
            <p><strong>Environnement:</strong> <code class="bg-indigo-100 px-2 py-1 rounded">{{ config.environment }}</code></p>
          </div>
        </div>

        <!-- Actions de test -->
        <div class="p-4 bg-gray-50 rounded-lg">
          <h2 class="text-lg font-semibold text-gray-900 mb-3">🛠️ Actions de test</h2>
          <div class="flex flex-wrap gap-3">
            <button 
              @click="refreshAuth"
              class="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700"
            >
              Rafraîchir Auth
            </button>
            <button 
              @click="simulateCallback"
              class="bg-green-600 text-white px-4 py-2 rounded-lg hover:bg-green-700"
            >
              Simuler Callback
            </button>
            <NuxtLink 
              to="/auth/callback"
              class="bg-purple-600 text-white px-4 py-2 rounded-lg hover:bg-purple-700"
            >
              Aller au Callback
            </NuxtLink>
            <NuxtLink 
              to="/onboarding"
              class="bg-orange-600 text-white px-4 py-2 rounded-lg hover:bg-orange-700"
            >
              Aller à Onboarding
            </NuxtLink>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { useSupabase } from '~~/composables/useSupabase'
import { useAuthStore } from '~~/stores/auth'

definePageMeta({
  layout: 'auth'
})

const supabase = useSupabase()
const authStore = useAuthStore()
const config = useRuntimeConfig()

const loading = ref(false)
const apiResult = ref(null)

// Informations URL
const urlInfo = ref({
  full: '',
  path: '',
  hash: '',
  query: ''
})

// États d'authentification
const supabaseAuth = ref({
  isLoggedIn: false,
  hasValidSession: false,
  user: null,
  error: null
})

const storeAuth = ref({
  isAuthenticated: false,
  hasToken: false,
  user: null
})

// Configuration
const configInfo = computed(() => ({
  supabaseUrl: config.public.supabase?.url || 'Non configuré',
  apiBaseUrl: config.public.apiBaseUrl || 'Non configuré',
  environment: process.dev ? 'Développement' : 'Production'
}))

// Mettre à jour les informations
const updateInfo = async () => {
  // URL Info
  if (process.client) {
    urlInfo.value = {
      full: window.location.href,
      path: window.location.pathname,
      hash: window.location.hash,
      query: window.location.search
    }
  }

  // Supabase Auth
  try {
    const { data: { user }, error } = await supabase.auth.getUser()
    const { data: { session } } = await supabase.auth.getSession()
    
    supabaseAuth.value = {
      isLoggedIn: !!user,
      hasValidSession: !!session,
      user: user,
      error: error?.message || null
    }
  } catch (err) {
    supabaseAuth.value.error = err.message
  }

  // Store Auth
  storeAuth.value = {
    isAuthenticated: authStore.isAuthenticated,
    hasToken: !!authStore.token,
    user: authStore.user
  }
}

// Test API
const testAPI = async () => {
  loading.value = true
  apiResult.value = null

  try {
    if (!authStore.user?.id || !authStore.token) {
      throw new Error('Pas d\'utilisateur ou de token dans le store')
    }

    const api = useApi()
    const response = await api.shops.get(authStore.user.id)
    
    apiResult.value = {
      success: response.success,
      data: response.data,
      error: response.error
    }
  } catch (error) {
    apiResult.value = {
      success: false,
      error: error.message
    }
  } finally {
    loading.value = false
  }
}

// Rafraîchir authentification
const refreshAuth = async () => {
  await authStore.restoreSession()
  await updateInfo()
}

// Simuler callback
const simulateCallback = () => {
  const mockUrl = '/auth/callback#access_token=fake_token&refresh_token=fake_refresh&type=signup'
  navigateTo(mockUrl)
}

// Charger les informations au montage
onMounted(async () => {
  await updateInfo()
  
  // Mettre à jour toutes les 2 secondes
  const interval = setInterval(updateInfo, 2000)
  
  onUnmounted(() => {
    clearInterval(interval)
  })
})

useHead({
  title: 'Debug Auth - ChatSeller'
})
</script>

<style scoped>
code {
  font-family: 'Monaco', 'Menlo', monospace;
  font-size: 0.875rem;
}

pre {
  font-family: 'Monaco', 'Menlo', monospace;
  font-size: 0.75rem;
  line-height: 1.5;
}
</style>