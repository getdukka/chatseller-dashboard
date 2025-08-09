<!-- pages/diagnostic.vue - PAGE DE DIAGNOSTIC POUR TESTER LES CORRECTIONS -->
<template>
  <div class="min-h-screen bg-gray-50 py-8">
    <div class="max-w-4xl mx-auto px-4">
      <div class="bg-white rounded-lg shadow-sm p-6">
        <h1 class="text-2xl font-bold text-gray-900 mb-6">
          🔧 Diagnostic ChatSeller
        </h1>

        <!-- STATUS GÉNÉRAL -->
        <div class="mb-8">
          <h2 class="text-lg font-semibold mb-4">📊 Status Général</h2>
          <div class="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div class="bg-blue-50 p-4 rounded-lg">
              <div class="text-sm text-blue-600">Authentification</div>
              <div class="text-lg font-semibold" :class="authStatus.color">
                {{ authStatus.text }}
              </div>
            </div>
            <div class="bg-green-50 p-4 rounded-lg">
              <div class="text-sm text-green-600">API Backend</div>
              <div class="text-lg font-semibold" :class="apiStatus.color">
                {{ apiStatus.text }}
              </div>
            </div>
            <div class="bg-purple-50 p-4 rounded-lg">
              <div class="text-sm text-purple-600">Base de Données</div>
              <div class="text-lg font-semibold" :class="dbStatus.color">
                {{ dbStatus.text }}
              </div>
            </div>
          </div>
        </div>

        <!-- TESTS API -->
        <div class="mb-8">
          <h2 class="text-lg font-semibold mb-4">🧪 Tests API</h2>
          <div class="space-y-4">
            <button 
              @click="testAPIHealth" 
              :disabled="loading.apiHealth"
              class="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700 disabled:opacity-50"
            >
              {{ loading.apiHealth ? 'Test en cours...' : 'Tester Health Check' }}
            </button>
            
            <button 
              @click="testAPIAuth" 
              :disabled="loading.apiAuth"
              class="bg-green-600 text-white px-4 py-2 rounded hover:bg-green-700 disabled:opacity-50 ml-2"
            >
              {{ loading.apiAuth ? 'Test en cours...' : 'Tester Authentification' }}
            </button>

            <button 
              @click="testBillingDiagnostic" 
              :disabled="loading.billing"
              class="bg-purple-600 text-white px-4 py-2 rounded hover:bg-purple-700 disabled:opacity-50 ml-2"
            >
              {{ loading.billing ? 'Test en cours...' : 'Tester Diagnostic Billing' }}
            </button>
          </div>

          <!-- Résultats Tests API -->
          <div v-if="apiResults.length > 0" class="mt-4">
            <h3 class="font-semibold mb-2">Résultats :</h3>
            <div class="space-y-2">
              <div 
                v-for="result in apiResults" 
                :key="result.test"
                class="p-3 rounded border-l-4"
                :class="result.success ? 'bg-green-50 border-green-400' : 'bg-red-50 border-red-400'"
              >
                <div class="font-medium">{{ result.test }}</div>
                <div class="text-sm text-gray-600">{{ result.message }}</div>
                <div v-if="result.data" class="text-xs text-gray-500 mt-1">
                  <pre>{{ JSON.stringify(result.data, null, 2) }}</pre>
                </div>
              </div>
            </div>
          </div>
        </div>

        <!-- TESTS BASE DE DONNÉES -->
        <div class="mb-8">
          <h2 class="text-lg font-semibold mb-4">🗄️ Tests Base de Données</h2>
          <div class="space-y-4">
            <button 
              @click="testDirectSupabase" 
              :disabled="loading.supabase"
              class="bg-indigo-600 text-white px-4 py-2 rounded hover:bg-indigo-700 disabled:opacity-50"
            >
              {{ loading.supabase ? 'Test en cours...' : 'Tester Supabase Direct' }}
            </button>

            <button 
              @click="testDatabaseComposable" 
              :disabled="loading.database"
              class="bg-teal-600 text-white px-4 py-2 rounded hover:bg-teal-700 disabled:opacity-50 ml-2"
            >
              {{ loading.database ? 'Test en cours...' : 'Tester useDatabase' }}
            </button>
          </div>

          <!-- Résultats Tests DB -->
          <div v-if="dbResults.length > 0" class="mt-4">
            <h3 class="font-semibold mb-2">Résultats :</h3>
            <div class="space-y-2">
              <div 
                v-for="result in dbResults" 
                :key="result.test"
                class="p-3 rounded border-l-4"
                :class="result.success ? 'bg-green-50 border-green-400' : 'bg-red-50 border-red-400'"
              >
                <div class="font-medium">{{ result.test }}</div>
                <div class="text-sm text-gray-600">{{ result.message }}</div>
                <div v-if="result.data" class="text-xs text-gray-500 mt-1">
                  Données : {{ typeof result.data === 'object' ? JSON.stringify(result.data).substring(0, 100) + '...' : result.data }}
                </div>
              </div>
            </div>
          </div>
        </div>

        <!-- INFORMATIONS CONFIGURATION -->
        <div class="mb-8">
          <h2 class="text-lg font-semibold mb-4">⚙️ Configuration</h2>
          <div class="bg-gray-50 p-4 rounded">
            <div class="grid grid-cols-1 md:grid-cols-2 gap-4 text-sm">
              <div>
                <strong>API URL:</strong> {{ config.apiUrl }}
              </div>
              <div>
                <strong>Supabase URL:</strong> {{ config.supabaseUrl }}
              </div>
              <div>
                <strong>Utilisateur:</strong> {{ userInfo }}
              </div>
              <div>
                <strong>Shop ID:</strong> {{ shopId }}
              </div>
            </div>
          </div>
        </div>

        <!-- RECOMMANDATIONS -->
        <div v-if="recommendations.length > 0">
          <h2 class="text-lg font-semibold mb-4">💡 Recommandations</h2>
          <div class="bg-yellow-50 border border-yellow-200 rounded p-4">
            <ul class="space-y-2">
              <li v-for="rec in recommendations" :key="rec" class="flex items-start">
                <span class="text-yellow-600 mr-2">⚠️</span>
                <span class="text-sm">{{ rec }}</span>
              </li>
            </ul>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
// ✅ IMPORTS ET CONFIGURATION
const config = useRuntimeConfig()
const authStore = useAuthStore()
const supabase = useSupabase()
const database = useDatabase()

// ✅ REACTIVE DATA
const loading = ref({
  apiHealth: false,
  apiAuth: false,
  billing: false,
  supabase: false,
  database: false
})

const apiResults = ref([])
const dbResults = ref([])
const recommendations = ref([])

// ✅ COMPUTED PROPERTIES
const authStatus = computed(() => {
  if (authStore.isAuthenticated) {
    return { text: '✅ Connecté', color: 'text-green-600' }
  }
  return { text: '❌ Non connecté', color: 'text-red-600' }
})

const apiStatus = ref({ text: '⏳ Non testé', color: 'text-gray-600' })
const dbStatus = ref({ text: '⏳ Non testé', color: 'text-gray-600' })

const userInfo = computed(() => {
  return authStore.user?.email || 'Non connecté'
})

const shopId = computed(() => {
  return authStore.userShopId || 'Non défini'
})

// ✅ MÉTHODES DE TEST

// Test Health Check API
async function testAPIHealth() {
  loading.value.apiHealth = true
  try {
    const response = await fetch(`${config.public.apiBaseUrl}/health`)
    const data = await response.json()
    
    if (response.ok) {
      apiStatus.value = { text: '✅ API OK', color: 'text-green-600' }
      apiResults.value.push({
        test: 'Health Check',
        success: true,
        message: 'API accessible et fonctionnelle',
        data: data
      })
    } else {
      apiStatus.value = { text: '❌ API Error', color: 'text-red-600' }
      apiResults.value.push({
        test: 'Health Check',
        success: false,
        message: `Erreur ${response.status}: ${response.statusText}`,
        data: data
      })
    }
  } catch (error) {
    apiStatus.value = { text: '❌ API Inaccessible', color: 'text-red-600' }
    apiResults.value.push({
      test: 'Health Check',
      success: false,
      message: `Erreur de connexion: ${error.message}`,
      data: null
    })
    recommendations.value.push('Vérifiez que l\'API est en ligne et que l\'URL est correcte')
  }
  loading.value.apiHealth = false
}

// Test authentification API
async function testAPIAuth() {
  loading.value.apiAuth = true
  try {
    const token = authStore.token
    if (!token) {
      apiResults.value.push({
        test: 'Test Authentification',
        success: false,
        message: 'Aucun token d\'authentification disponible',
        data: null
      })
      recommendations.value.push('Connectez-vous d\'abord pour obtenir un token')
      loading.value.apiAuth = false
      return
    }

    const response = await fetch(`${config.public.apiBaseUrl}/api/v1/agents`, {
      headers: {
        'Authorization': `Bearer ${token}`,
        'Content-Type': 'application/json'
      }
    })
    
    const data = await response.json()
    
    if (response.ok) {
      apiResults.value.push({
        test: 'Test Authentification',
        success: true,
        message: 'Authentification API réussie',
        data: { agentsCount: data.data?.length || 0 }
      })
    } else {
      apiResults.value.push({
        test: 'Test Authentification',
        success: false,
        message: `Erreur ${response.status}: ${data.error || response.statusText}`,
        data: data
      })
      if (response.status === 401) {
        recommendations.value.push('Token d\'authentification invalide ou expiré')
      }
    }
  } catch (error) {
    apiResults.value.push({
      test: 'Test Authentification',
      success: false,
      message: `Erreur: ${error.message}`,
      data: null
    })
  }
  loading.value.apiAuth = false
}

// Test diagnostic billing
async function testBillingDiagnostic() {
  loading.value.billing = true
  try {
    const response = await fetch(`${config.public.apiBaseUrl}/api/v1/billing/diagnostic`)
    const data = await response.json()
    
    if (response.ok && data.success) {
      apiResults.value.push({
        test: 'Diagnostic Billing',
        success: true,
        message: 'Diagnostic système réussi',
        data: {
          prisma: data.diagnostic.prisma.success ? '✅' : '❌',
          supabase: data.diagnostic.supabase.success ? '✅' : '❌',
          stripe: data.diagnostic.stripe.success ? '✅' : '❌'
        }
      })
    } else {
      apiResults.value.push({
        test: 'Diagnostic Billing',
        success: false,
        message: 'Diagnostic système échoué',
        data: data
      })
    }
  } catch (error) {
    apiResults.value.push({
      test: 'Diagnostic Billing',
      success: false,
      message: `Erreur: ${error.message}`,
      data: null
    })
  }
  loading.value.billing = false
}

// Test Supabase direct
async function testDirectSupabase() {
  loading.value.supabase = true
  try {
    const { data: user } = await supabase.auth.getUser()
    
    if (!user.user) {
      dbResults.value.push({
        test: 'Supabase Auth',
        success: false,
        message: 'Utilisateur non authentifié dans Supabase',
        data: null
      })
      dbStatus.value = { text: '❌ Auth Error', color: 'text-red-600' }
      loading.value.supabase = false
      return
    }

    // Test simple query
    const { data, error } = await supabase
      .from('shops')
      .select('id, name')
      .eq('id', user.user.id)
      .limit(1)

    if (error) {
      dbResults.value.push({
        test: 'Supabase Query',
        success: false,
        message: `Erreur requête: ${error.message}`,
        data: error
      })
      dbStatus.value = { text: '❌ DB Error', color: 'text-red-600' }
      if (error.code === '42501') {
        recommendations.value.push('Problème de permissions RLS. Vérifiez les politiques Supabase.')
      }
    } else {
      dbResults.value.push({
        test: 'Supabase Query',
        success: true,
        message: 'Requête Supabase réussie',
        data: data
      })
      dbStatus.value = { text: '✅ DB OK', color: 'text-green-600' }
    }
  } catch (error) {
    dbResults.value.push({
      test: 'Supabase Direct',
      success: false,
      message: `Erreur: ${error.message}`,
      data: null
    })
    dbStatus.value = { text: '❌ DB Error', color: 'text-red-600' }
  }
  loading.value.supabase = false
}

// Test useDatabase composable
async function testDatabaseComposable() {
  loading.value.database = true
  try {
    // Test analytics
    const analyticsResult = await database.analytics.getStats()
    
    if (analyticsResult.success) {
      dbResults.value.push({
        test: 'useDatabase Analytics',
        success: true,
        message: 'Composable useDatabase fonctionne',
        data: analyticsResult.data
      })
    } else {
      dbResults.value.push({
        test: 'useDatabase Analytics',
        success: false,
        message: `Erreur composable: ${analyticsResult.error}`,
        data: null
      })
    }

    // Test conversations
    const conversationsResult = await database.conversations.list()
    
    if (conversationsResult.success) {
      dbResults.value.push({
        test: 'useDatabase Conversations',
        success: true,
        message: `${conversationsResult.data?.length || 0} conversations trouvées`,
        data: { count: conversationsResult.data?.length || 0 }
      })
    } else {
      dbResults.value.push({
        test: 'useDatabase Conversations',
        success: false,
        message: `Erreur conversations: ${conversationsResult.error}`,
        data: null
      })
    }
  } catch (error) {
    dbResults.value.push({
      test: 'useDatabase Composable',
      success: false,
      message: `Erreur: ${error.message}`,
      data: null
    })
  }
  loading.value.database = false
}

// ✅ INITIALISATION
onMounted(() => {
  // Ajouter les infos de configuration
  console.log('🔧 Configuration actuelle:', {
    apiUrl: config.public.apiBaseUrl,
    supabaseUrl: config.public.supabaseUrl,
    user: authStore.user,
    shopId: authStore.userShopId
  })
})
</script>