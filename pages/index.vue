<!-- pages/index.vue -->
<template>
  <div class="min-h-screen bg-gradient-to-br from-rose-50 via-pink-50 to-purple-50">
    
    <!-- ========== MODAL DE BIENVENUE POST-ONBOARDING ========== -->
    <div v-if="showWelcomeModal" class="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4 overflow-hidden">
      <div class="bg-white rounded-2xl shadow-2xl max-w-2xl w-full overflow-hidden">
        
        <!-- Header avec confetti/célébration -->
        <div class="bg-gradient-to-r from-green-500 to-emerald-500 px-6 py-8 text-center rounded-t-2xl">
          <div class="w-20 h-20 bg-white/20 rounded-full flex items-center justify-center mx-auto mb-4">
            <span class="text-4xl">🎉</span>
          </div>
          <h2 class="text-2xl md:text-3xl font-bold text-white mb-2">
            {{ agentInfo?.name || 'Votre Conseillère IA' }} est prête !
          </h2>
          <p class="text-green-100">
            Elle va vendre pour vous 24h/24, même quand vous dormez
          </p>
        </div>
        
        <!-- Contenu -->
        <div class="p-6">
          
          <!-- USP WhatsApp -->
          <div class="bg-gradient-to-r from-green-50 to-emerald-50 border border-green-200 rounded-xl p-4 mb-6">
            <div class="flex items-start space-x-3">
              <span class="text-2xl">📱</span>
              <div>
                <p class="font-bold text-green-800">Les visiteurs de votre site ne seront plus seuls</p>
                <p class="text-sm text-green-700 mt-1">
                  {{ agentInfo?.name || 'Votre Conseillère' }} les accueillera, répondra instantanément à leurs questions, 
                  les conseillera et les guidera vers l'achat en toute autonomie.
                </p>
              </div>
            </div>
          </div>
          
          <!-- Guide des 3 étapes -->
          <div class="mb-6">
            <p class="font-semibold text-gray-800 mb-4 flex items-center">
              <span class="mr-2">📋</span>
              Pour que {{ agentInfo?.name || 'Votre Conseillère IA' }} soit 100% opérationnelle :
            </p>
            
            <div class="space-y-3">
              <!-- Étape 1: Agent créé ✅ -->
              <div class="flex items-center p-3 bg-green-50 border border-green-200 rounded-xl">
                <div class="w-8 h-8 bg-green-500 rounded-full flex items-center justify-center flex-shrink-0">
                  <svg class="w-4 h-4 text-white" fill="currentColor" viewBox="0 0 20 20">
                    <path fill-rule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clip-rule="evenodd"/>
                  </svg>
                </div>
                <div class="ml-3 flex-1">
                  <p class="font-medium text-green-800">Créer la Conseillère IA</p>
                  <p class="text-sm text-green-600">{{ agentInfo?.name || 'Votre Conseillère IA' }} est configurée et prête</p>
                </div>
                <span class="text-green-500 text-sm font-medium">Fait ✓</span>
              </div>
              
              <!-- Étape 2: Synchroniser produits -->
              <div 
                class="flex items-center p-3 rounded-xl"
                :class="setupStatus.productsSynced ? 'bg-green-50 border border-green-200' : 'bg-orange-50 border border-orange-200'"
              >
                <div 
                  class="w-8 h-8 rounded-full flex items-center justify-center flex-shrink-0"
                  :class="setupStatus.productsSynced ? 'bg-green-500' : 'bg-orange-500'"
                >
                  <svg v-if="setupStatus.productsSynced" class="w-4 h-4 text-white" fill="currentColor" viewBox="0 0 20 20">
                    <path fill-rule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clip-rule="evenodd"/>
                  </svg>
                  <span v-else class="text-white text-sm font-bold">2</span>
                </div>
                <div class="ml-3 flex-1">
                  <p class="font-medium" :class="setupStatus.productsSynced ? 'text-green-800' : 'text-orange-800'">
                    Synchroniser vos produits
                  </p>
                  <p class="text-sm" :class="setupStatus.productsSynced ? 'text-green-600' : 'text-orange-600'">
                    {{ setupStatus.productsSynced ? `${dashboardStats.products.total} produits importés` : 'Pour que votre Conseillère IA puisse les recommander' }}
                  </p>
                </div>
                <span 
                  class="text-sm font-medium"
                  :class="setupStatus.productsSynced ? 'text-green-500' : 'text-orange-500'"
                >
                  {{ setupStatus.productsSynced ? 'Fait ✓' : 'À faire' }}
                </span>
              </div>
              
              <!-- Étape 3: Intégrer widget -->
              <div 
                class="flex items-center p-3 rounded-xl"
                :class="setupStatus.widgetIntegrated ? 'bg-green-50 border border-green-200' : 'bg-gray-50 border border-gray-200'"
              >
                <div 
                  class="w-8 h-8 rounded-full flex items-center justify-center flex-shrink-0"
                  :class="setupStatus.widgetIntegrated ? 'bg-green-500' : 'bg-gray-400'"
                >
                  <svg v-if="setupStatus.widgetIntegrated" class="w-4 h-4 text-white" fill="currentColor" viewBox="0 0 20 20">
                    <path fill-rule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clip-rule="evenodd"/>
                  </svg>
                  <span v-else class="text-white text-sm font-bold">3</span>
                </div>
                <div class="ml-3 flex-1">
                  <p class="font-medium" :class="setupStatus.widgetIntegrated ? 'text-green-800' : 'text-gray-800'">
                    Intégrer le widget sur votre site
                  </p>
                  <p class="text-sm" :class="setupStatus.widgetIntegrated ? 'text-green-600' : 'text-gray-600'">
                    {{ setupStatus.widgetIntegrated ? 'Widget actif sur votre site' : 'Pour que votre Conseillère IA puisse interagir avec vos visiteurs' }}
                  </p>
                </div>
                <span 
                  class="text-sm font-medium"
                  :class="setupStatus.widgetIntegrated ? 'text-green-500' : 'text-gray-400'"
                >
                  {{ setupStatus.widgetIntegrated ? 'Fait ✓' : 'À faire' }}
                </span>
              </div>
            </div>
          </div>
          
          <!-- Actions principales -->
          <div class="space-y-3">
            <div class="grid grid-cols-1 sm:grid-cols-2 gap-3">
              <button
                @click="navigateToProducts"
                class="flex items-center justify-center px-4 py-3 bg-gradient-to-r from-rose-600 to-pink-600 text-white font-semibold rounded-xl hover:from-rose-700 hover:to-pink-700 transition-all"
              >
                <svg class="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M20 7l-8-4-8 4m16 0l-8 4m8-4v10l-8 4m0-10L4 7m8 4v10M4 7v10l8 4"/>
                </svg>
                Synchroniser mes produits
              </button>
              <button
                @click="navigateToKnowledgeBase"
                class="flex items-center justify-center px-4 py-3 bg-white border-2 border-purple-300 text-purple-700 font-semibold rounded-xl hover:bg-purple-50 transition-all"
              >
                <svg class="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.746 0 3.332.477 4.5 1.253v13C19.832 18.477 18.246 18 16.5 18c-1.746 0-3.332.477-4.5 1.253"/>
                </svg>
                Former {{ agentInfo?.name || 'ma Conseillère IA' }}
              </button>
            </div>
            
            <button
              @click="closeWelcomeModal"
              class="w-full px-4 py-3 text-gray-600 font-medium hover:text-gray-800 hover:bg-gray-100 rounded-xl transition-all"
            >
              Explorer le Dashboard
            </button>
          </div>
          
          <!-- Astuce -->
          <div class="mt-6 p-3 bg-blue-50 border border-blue-200 rounded-lg">
            <p class="text-xs text-blue-700 text-center">
              💡 <strong>Astuce :</strong> Vous pouvez tester {{ agentInfo?.name || 'votre Conseillère' }} dans le Playground 
              avant de l'intégrer sur votre site.
            </p>
          </div>
        </div>
      </div>
    </div>

    <!-- ========== BARRE DE RAPPEL DISCRÈTE (si config incomplète) ========== -->
    <div 
      v-if="showConfigReminder && !showWelcomeModal" 
      class="bg-gradient-to-r from-amber-50 to-orange-50 border-b border-amber-200"
    >
      <div class="px-4 md:px-8 py-3">
        <div class="flex items-center justify-between">
          <div class="flex items-center space-x-3">
            <span class="text-xl">💡</span>
            <p class="text-sm text-amber-800">
              <span class="font-medium">Il reste {{ 3 - completedSteps }} étape{{ 3 - completedSteps > 1 ? 's' : '' }}</span> 
              pour activer {{ agentInfo?.name || 'votre Conseillère' }} sur votre site
            </p>
          </div>
          <div class="flex items-center space-x-2">
            <button
              @click="showReminderActions = !showReminderActions"
              class="text-sm font-medium text-amber-700 hover:text-amber-900 transition-colors hidden sm:inline-flex items-center"
            >
              Voir les étapes
              <svg 
                class="w-4 h-4 ml-1 transition-transform" 
                :class="{ 'rotate-180': showReminderActions }"
                fill="none" stroke="currentColor" viewBox="0 0 24 24"
              >
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M19 9l-7 7-7-7"/>
              </svg>
            </button>
            <button
              @click="dismissReminder"
              class="p-1 text-amber-400 hover:text-amber-600 transition-colors"
              title="Masquer"
            >
              <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12"/>
              </svg>
            </button>
          </div>
        </div>
        
        <!-- Actions dépliables -->
        <div v-if="showReminderActions" class="mt-3 pt-3 border-t border-amber-200">
          <div class="flex flex-wrap gap-2">
            <NuxtLink
              v-if="!setupStatus.productsSynced"
              to="/products"
              class="inline-flex items-center px-3 py-1.5 bg-white border border-amber-300 text-amber-700 text-sm font-medium rounded-lg hover:bg-amber-50 transition-colors"
            >
              <svg class="w-4 h-4 mr-1.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M20 7l-8-4-8 4m16 0l-8 4m8-4v10l-8 4m0-10L4 7m8 4v10M4 7v10l8 4"/>
              </svg>
              Synchroniser les produits
            </NuxtLink>
            <NuxtLink
              v-if="!setupStatus.widgetIntegrated"
              to="/agent-ia?tab=integration"
              class="inline-flex items-center px-3 py-1.5 bg-white border border-amber-300 text-amber-700 text-sm font-medium rounded-lg hover:bg-amber-50 transition-colors"
            >
              <svg class="w-4 h-4 mr-1.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M10 20l4-16m4 4l4 4-4 4M6 16l-4-4 4-4"/>
              </svg>
              Intégrer le Widget
            </NuxtLink>
          </div>
        </div>
      </div>
    </div>

    <!-- ========== HEADER ========== -->
    <div class="px-4 md:px-8 py-4 md:py-6">
      <div class="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h1 class="text-xl md:text-2xl lg:text-3xl font-bold text-gray-900">
            {{ greeting }}, {{ userFirstName }} 👋
          </h1>
          <p class="mt-1 text-sm md:text-base text-gray-600">
            {{ getDashboardSubtitle() }}
          </p>
        </div>
        
        <!-- Quick Actions -->
        <div class="flex items-center space-x-2">
          <button
            @click="handleRefreshData"
            :disabled="refreshing"
            class="inline-flex items-center px-3 py-2 border border-gray-300 rounded-lg text-sm font-medium text-gray-700 bg-white hover:bg-gray-50 disabled:opacity-50 transition-colors"
          >
            <svg 
              class="w-4 h-4 mr-1.5" 
              :class="{ 'animate-spin': refreshing }"
              fill="none" 
              stroke="currentColor" 
              viewBox="0 0 24 24"
            >
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15"/>
            </svg>
            <span class="hidden sm:inline">{{ refreshing ? 'Actualisation...' : 'Actualiser' }}</span>
          </button>
          
          <button
            v-if="agentInfo"
            @click="navigateToAgentDetail"
            class="inline-flex items-center px-3 py-2 bg-gradient-to-r from-rose-600 to-pink-600 text-white text-sm font-medium rounded-lg hover:from-rose-700 hover:to-pink-700 transition-all"
          >
            <svg class="w-4 h-4 mr-1.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M15 12a3 3 0 11-6 0 3 3 0 016 0z"/>
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z"/>
            </svg>
            <span class="hidden sm:inline">Voir {{ agentInfo.name }}</span>
            <span class="sm:hidden">Agent</span>
          </button>
        </div>
      </div>
    </div>

    <!-- ========== LOADING STATE ========== -->
    <div v-if="loadingStats" class="px-4 md:px-8 pb-8">
      <div class="grid grid-cols-2 lg:grid-cols-4 gap-3 md:gap-6 mb-6">
        <div v-for="i in 4" :key="i" class="card-modern animate-pulse">
          <div class="h-20 md:h-24 bg-gray-200 rounded"></div>
        </div>
      </div>
    </div>

    <!-- ========== MAIN CONTENT ========== -->
    <div v-else class="px-4 md:px-8 pb-8">
      
      <!-- ===== KPI CARDS ===== -->
      <div class="grid grid-cols-2 lg:grid-cols-4 gap-3 md:gap-6 mb-6">
        
        <!-- Conversations Card -->
        <div class="card-modern-gradient from-blue-500 to-blue-600">
          <div class="flex items-start justify-between">
            <div class="text-white flex-1 min-w-0">
              <p class="text-blue-100 text-xs md:text-sm font-medium">Conversations</p>
              <p class="text-xl md:text-3xl font-bold mt-1">{{ dashboardStats.conversations.total }}</p>
              <p class="text-blue-100 text-xs mt-1">
                <span class="text-white font-medium">{{ dashboardStats.conversations.active }}</span> en cours
              </p>
            </div>
            <div class="p-2 md:p-3 bg-white bg-opacity-20 rounded-lg md:rounded-xl flex-shrink-0">
              <svg class="w-5 h-5 md:w-8 md:h-8 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z"/>
              </svg>
            </div>
          </div>
          <div class="mt-3 md:mt-4">
            <NuxtLink 
              to="/conversations"
              class="text-white text-xs md:text-sm font-medium hover:text-blue-100 transition-colors inline-flex items-center"
            >
              Voir tout
              <svg class="w-3 h-3 md:w-4 md:h-4 ml-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 5l7 7-7 7"/>
              </svg>
            </NuxtLink>
          </div>
        </div>

        <!-- Ventes Card -->
        <div class="card-modern-gradient from-green-500 to-green-600">
          <div class="flex items-start justify-between">
            <div class="text-white flex-1 min-w-0">
              <p class="text-green-100 text-xs md:text-sm font-medium">Ventes</p>
              <p class="text-xl md:text-3xl font-bold mt-1">{{ dashboardStats.orders.total }}</p>
              <p class="text-green-100 text-xs mt-1">
                <span class="text-white font-medium">{{ formatConversionRate(dashboardStats.orders.conversionRate) }}</span> conversion
              </p>
            </div>
            <div class="p-2 md:p-3 bg-white bg-opacity-20 rounded-lg md:rounded-xl flex-shrink-0">
              <svg class="w-5 h-5 md:w-8 md:h-8 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M16 11V7a4 4 0 00-8 0v4M5 9h14l1 12H4L5 9z"/>
              </svg>
            </div>
          </div>
          <div class="mt-3 md:mt-4">
            <span class="text-green-100 text-xs md:text-sm">
              Via votre Conseillère IA
            </span>
          </div>
        </div>

        <!-- Chiffre d'affaires Card -->
        <div class="card-modern-gradient from-yellow-500 to-orange-500">
          <div class="flex items-start justify-between">
            <div class="text-white flex-1 min-w-0">
              <p class="text-orange-100 text-xs md:text-sm font-medium">Chiffre d'affaires</p>
              <p class="text-xl md:text-3xl font-bold mt-1">{{ formatCurrency(dashboardStats.revenue.total) }}</p>
              <p class="text-orange-100 text-xs mt-1">
                <span class="text-white font-medium">{{ formatCurrency(dashboardStats.revenue.average) }}</span> panier moy.
              </p>
            </div>
            <div class="p-2 md:p-3 bg-white bg-opacity-20 rounded-lg md:rounded-xl flex-shrink-0">
              <svg class="w-5 h-5 md:w-8 md:h-8 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1"/>
              </svg>
            </div>
          </div>
          <div class="mt-3 md:mt-4">
            <span class="text-orange-100 text-xs md:text-sm">
              Généré par l'IA
            </span>
          </div>
        </div>

        <!-- Produits recommandés Card -->
        <div class="card-modern-gradient from-purple-500 to-purple-600">
          <div class="flex items-start justify-between">
            <div class="text-white flex-1 min-w-0">
              <p class="text-purple-100 text-xs md:text-sm font-medium">Recommandations</p>
              <p class="text-xl md:text-3xl font-bold mt-1">{{ dashboardStats.beautyInsights?.productsRecommended || 0 }}</p>
              <p class="text-purple-100 text-xs mt-1 truncate">
                {{ dashboardStats.beautyInsights?.topProduct || 'Aucun produit' }}
              </p>
            </div>
            <div class="p-2 md:p-3 bg-white bg-opacity-20 rounded-lg md:rounded-xl flex-shrink-0">
              <svg class="w-5 h-5 md:w-8 md:h-8 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M5 3v4M3 5h4M6 17v4m-2-2h4m5-16l2.286 6.857L21 12l-5.714 2.143L13 21l-2.286-6.857L5 12l5.714-2.143L13 3z"/>
              </svg>
            </div>
          </div>
          <div class="mt-3 md:mt-4">
            <NuxtLink
              to="/products"
              class="text-white text-xs md:text-sm font-medium hover:text-purple-100 transition-colors inline-flex items-center"
            >
              Voir produits
              <svg class="w-3 h-3 md:w-4 md:h-4 ml-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 5l7 7-7 7"/>
              </svg>
            </NuxtLink>
          </div>
        </div>
      </div>

      <!-- ===== EMPTY STATE MESSAGE (quand pas de données mais configuration terminée) ===== -->
      <div 
        v-if="hasNoData && completedSteps === 3" 
        class="mb-6 bg-gradient-to-r from-blue-50 to-purple-50 border border-blue-200 rounded-xl p-4 md:p-6"
      >
        <div class="flex flex-col md:flex-row items-start md:items-center space-y-3 md:space-y-0 md:space-x-4">
          <div class="w-12 h-12 bg-blue-100 rounded-full flex items-center justify-center flex-shrink-0">
            <svg class="w-6 h-6 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"/>
            </svg>
          </div>
          <div class="flex-1">
            <h4 class="font-semibold text-gray-900">Vos statistiques apparaîtront bientôt !</h4>
            <p class="text-sm text-gray-600 mt-1">
              Dès que des clientes discuteront avec {{ agentInfo?.name || 'votre Conseillère IA' }}, vous verrez ici vos conversations, ventes et revenus.
            </p>
          </div>
          <NuxtLink 
            to="/agent-ia?tab=test"
            class="inline-flex items-center px-4 py-2 bg-blue-600 text-white text-sm font-medium rounded-lg hover:bg-blue-700 transition-colors flex-shrink-0"
          >
            <svg class="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M14.752 11.168l-3.197-2.132A1 1 0 0010 9.87v4.263a1 1 0 001.555.832l3.197-2.132a1 1 0 000-1.664z"/>
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M21 12a9 9 0 11-18 0 9 9 0 0118 0z"/>
            </svg>
            Tester ma Conseillère
          </NuxtLink>
        </div>
      </div>

      <!-- ===== MAIN CONTENT GRID ===== -->
      <div class="grid grid-cols-1 lg:grid-cols-3 gap-4 md:gap-6">
        
        <!-- ===== CARD: Votre Conseillère IA (AMÉLIORÉE) ===== -->
        <div class="card-modern">
          <div class="flex items-center justify-between mb-4 md:mb-6">
            <h3 class="text-base md:text-lg font-semibold text-gray-900">Votre {{ getAgentTypeName() }}</h3>
            <button
              v-if="agentInfo"
              @click="navigateToAgentDetail"
              class="text-rose-600 hover:text-rose-700 text-xs md:text-sm font-medium transition-colors"
            >
              Configurer
            </button>
          </div>

          <!-- Agent trouvé -->
          <div v-if="agentInfo" class="space-y-4">
            <!-- Avatar et nom -->
            <div class="flex items-center space-x-4">
              <div class="w-14 h-14 md:w-16 md:h-16 rounded-full bg-gradient-to-br from-rose-500 to-pink-600 flex items-center justify-center shadow-lg flex-shrink-0">
                <img
                  v-if="agentInfo.avatar"
                  :src="agentInfo.avatar"
                  :alt="agentInfo.name"
                  class="w-14 h-14 md:w-16 md:h-16 rounded-full object-cover"
                />
                <span v-else class="text-white text-xl md:text-2xl font-bold">
                  {{ agentInfo.name.charAt(0) }}
                </span>
              </div>
              <div class="flex-1 min-w-0">
                <h4 class="font-semibold text-gray-900 truncate">{{ agentInfo.name }}</h4>
                <p class="text-sm text-gray-500 truncate">{{ getAgentTypeName() }}</p>
                <span
                  class="inline-flex items-center px-2 py-0.5 rounded-full text-xs font-medium mt-1"
                  :class="agentInfo.isActive ? 'bg-green-100 text-green-800' : 'bg-gray-100 text-gray-800'"
                >
                  <span
                    class="w-1.5 h-1.5 rounded-full mr-1"
                    :class="agentInfo.isActive ? 'bg-green-500' : 'bg-gray-400'"
                  ></span>
                  {{ agentInfo.isActive ? 'Active' : 'Inactive' }}
                </span>
              </div>
            </div>

            <!-- Alertes de configuration manquante -->
            <div v-if="!setupStatus.productsSynced || !setupStatus.widgetIntegrated" class="space-y-2">
              <!-- Alerte produits -->
              <div 
                v-if="!setupStatus.productsSynced"
                class="p-3 bg-orange-50 border border-orange-200 rounded-lg"
              >
                <div class="flex items-start space-x-3">
                  <svg class="w-5 h-5 text-orange-500 flex-shrink-0 mt-0.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M20 7l-8-4-8 4m16 0l-8 4m8-4v10l-8 4m0-10L4 7m8 4v10M4 7v10l8 4"/>
                  </svg>
                  <div class="flex-1 min-w-0">
                    <p class="text-sm font-medium text-orange-800">Aucun produit synchronisé</p>
                    <p class="text-xs text-orange-600 mt-0.5">{{ agentInfo.name }} ne peut pas encore recommander vos produits</p>
                  </div>
                </div>
                <NuxtLink 
                  to="/products"
                  class="mt-2 inline-flex items-center text-xs font-medium text-orange-700 hover:text-orange-900"
                >
                  Synchroniser ma boutique
                  <svg class="w-3 h-3 ml-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 5l7 7-7 7"/>
                  </svg>
                </NuxtLink>
              </div>
              
              <!-- Alerte widget -->
              <div 
                v-if="!setupStatus.widgetIntegrated && setupStatus.productsSynced"
                class="p-3 bg-blue-50 border border-blue-200 rounded-lg"
              >
                <div class="flex items-start space-x-3">
                  <svg class="w-5 h-5 text-blue-500 flex-shrink-0 mt-0.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M10 20l4-16m4 4l4 4-4 4M6 16l-4-4 4-4"/>
                  </svg>
                  <div class="flex-1 min-w-0">
                    <p class="text-sm font-medium text-blue-800">Widget non intégré</p>
                    <p class="text-xs text-blue-600 mt-0.5">Ajoutez le code sur votre site pour activer {{ agentInfo.name }}</p>
                  </div>
                </div>
                <NuxtLink 
                  to="/agent-ia?tab=integration"
                  class="mt-2 inline-flex items-center text-xs font-medium text-blue-700 hover:text-blue-900"
                >
                  Voir le code d'intégration
                  <svg class="w-3 h-3 ml-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 5l7 7-7 7"/>
                  </svg>
                </NuxtLink>
              </div>
            </div>

            <!-- Stats rapides (si configuration complète) -->
            <div v-if="setupStatus.productsSynced" class="grid grid-cols-2 gap-3 pt-3 border-t border-gray-100">
              <div class="text-center p-2 bg-gray-50 rounded-lg">
                <p class="text-lg md:text-xl font-bold text-gray-900">{{ dashboardStats.products.total }}</p>
                <p class="text-xs text-gray-500">Produits</p>
              </div>
              <div class="text-center p-2 bg-gray-50 rounded-lg">
                <p class="text-lg md:text-xl font-bold text-gray-900">{{ agentInfo.knowledgeBaseCount }}</p>
                <p class="text-xs text-gray-500">Documents</p>
              </div>
            </div>

            <!-- Boutons action -->
            <div class="flex flex-col sm:flex-row gap-2 pt-2">
              <NuxtLink
                to="/agent-ia?tab=test"
                class="flex-1 py-2.5 px-4 bg-gradient-to-r from-rose-600 to-pink-600 text-white text-sm font-medium rounded-lg hover:from-rose-700 hover:to-pink-700 transition-all flex items-center justify-center"
              >
                <svg class="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M14.752 11.168l-3.197-2.132A1 1 0 0010 9.87v4.263a1 1 0 001.555.832l3.197-2.132a1 1 0 000-1.664z"/>
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M21 12a9 9 0 11-18 0 9 9 0 0118 0z"/>
                </svg>
                Tester
              </NuxtLink>
              <button
                @click="navigateToAgentDetail"
                class="flex-1 py-2.5 px-4 bg-white border border-gray-300 text-gray-700 text-sm font-medium rounded-lg hover:bg-gray-50 transition-all flex items-center justify-center"
              >
                <svg class="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M10.325 4.317c.426-1.756 2.924-1.756 3.35 0a1.724 1.724 0 002.573 1.066c1.543-.94 3.31.826 2.37 2.37a1.724 1.724 0 001.065 2.572c1.756.426 1.756 2.924 0 3.35a1.724 1.724 0 00-1.066 2.573c.94 1.543-.826 3.31-2.37 2.37a1.724 1.724 0 00-2.572 1.065c-.426 1.756-2.924 1.756-3.35 0a1.724 1.724 0 00-2.573-1.066c-1.543.94-3.31-.826-2.37-2.37a1.724 1.724 0 00-1.065-2.572c-1.756-.426-1.756-2.924 0-3.35a1.724 1.724 0 001.066-2.573c-.94-1.543.826-3.31 2.37-2.37.996.608 2.296.07 2.572-1.065z"/>
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M15 12a3 3 0 11-6 0 3 3 0 016 0z"/>
                </svg>
                Configurer
              </button>
            </div>
          </div>

          <!-- Aucun agent -->
          <div v-else class="text-center py-6 md:py-8">
            <div class="w-16 h-16 mx-auto mb-4 rounded-full bg-gradient-to-br from-rose-100 to-pink-100 flex items-center justify-center">
              <svg class="w-8 h-8 text-rose-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9.663 17h4.673M12 3v1m6.364 1.636l-.707.707M21 12h-1M4 12H3m3.343-5.657l-.707-.707m2.828 9.9a5 5 0 117.072 0l-.548.547A3.374 3.374 0 0014 18.469V19a2 2 0 11-4 0v-.531c0-.895-.356-1.754-.988-2.386l-.548-.547z"/>
              </svg>
            </div>
            <p class="text-gray-600 font-medium">Créez votre Conseillère IA</p>
            <p class="text-gray-400 text-sm mt-1 mb-4">Elle conseillera vos clientes 24h/24</p>
            <NuxtLink
              to="/agent-ia"
              class="inline-flex items-center px-4 py-2 bg-gradient-to-r from-rose-600 to-pink-600 text-white text-sm font-medium rounded-lg hover:from-rose-700 hover:to-pink-700 transition-all"
            >
              <svg class="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 4v16m8-8H4"/>
              </svg>
              Créer ma Conseillère
            </NuxtLink>
          </div>
        </div>

        <!-- ===== CARD: Performances IA ===== -->
        <div class="card-modern">
          <div class="flex items-center justify-between mb-4 md:mb-6">
            <h3 class="text-base md:text-lg font-semibold text-gray-900">Performances IA</h3>
            <NuxtLink
              to="/conversations"
              class="text-rose-600 hover:text-rose-700 text-xs md:text-sm font-medium transition-colors"
            >
              Voir conversations
            </NuxtLink>
          </div>

          <div class="space-y-3 md:space-y-4">
            <!-- Temps de réponse -->
            <div class="flex items-center justify-between py-2 md:py-3 border-b border-gray-100">
              <div class="flex items-center space-x-3">
                <div class="w-8 h-8 md:w-10 md:h-10 rounded-lg bg-blue-100 flex items-center justify-center flex-shrink-0">
                  <svg class="w-4 h-4 md:w-5 md:h-5 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z"/>
                  </svg>
                </div>
                <div>
                  <p class="text-xs md:text-sm font-medium text-gray-900">Temps de réponse</p>
                  <p class="text-xs text-gray-500 hidden sm:block">Moyenne par message</p>
                </div>
              </div>
              <span class="text-base md:text-lg font-semibold text-blue-600">{{ dashboardStats.performance.responseTime }}</span>
            </div>

            <!-- Disponibilité -->
            <div class="flex items-center justify-between py-2 md:py-3 border-b border-gray-100">
              <div class="flex items-center space-x-3">
                <div class="w-8 h-8 md:w-10 md:h-10 rounded-lg bg-green-100 flex items-center justify-center flex-shrink-0">
                  <svg class="w-4 h-4 md:w-5 md:h-5 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z"/>
                  </svg>
                </div>
                <div>
                  <p class="text-xs md:text-sm font-medium text-gray-900">Disponibilité</p>
                  <p class="text-xs text-gray-500 hidden sm:block">Uptime du service</p>
                </div>
              </div>
              <span class="text-base md:text-lg font-semibold text-green-600">{{ dashboardStats.performance.uptime }}%</span>
            </div>

            <!-- Conversations actives -->
            <div class="flex items-center justify-between py-2 md:py-3">
              <div class="flex items-center space-x-3">
                <div class="w-8 h-8 md:w-10 md:h-10 rounded-lg bg-purple-100 flex items-center justify-center flex-shrink-0">
                  <svg class="w-4 h-4 md:w-5 md:h-5 text-purple-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M17 8h2a2 2 0 012 2v6a2 2 0 01-2 2h-2v4l-4-4H9a1.994 1.994 0 01-1.414-.586m0 0L11 14h4a2 2 0 002-2V6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2v4l.586-.586z"/>
                  </svg>
                </div>
                <div>
                  <p class="text-xs md:text-sm font-medium text-gray-900">En cours</p>
                  <p class="text-xs text-gray-500 hidden sm:block">Conversations actives</p>
                </div>
              </div>
              <span class="text-base md:text-lg font-semibold text-purple-600">{{ dashboardStats.conversations.active }}</span>
            </div>
          </div>
        </div>

        <!-- ===== CARD: Actions rapides ===== -->
        <div class="card-modern">
          <div class="flex items-center justify-between mb-4 md:mb-6">
            <h3 class="text-base md:text-lg font-semibold text-gray-900">Actions rapides</h3>
          </div>
          
          <div class="space-y-3">
            <!-- Former l'IA -->
            <NuxtLink 
              to="/knowledge-base" 
              class="flex items-center justify-between p-3 rounded-xl border border-gray-200 hover:border-rose-300 hover:bg-rose-50 transition-all group"
            >
              <div class="flex items-center space-x-3">
                <div class="w-10 h-10 rounded-lg bg-purple-100 flex items-center justify-center group-hover:bg-purple-200 transition-colors">
                  <svg class="w-5 h-5 text-purple-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.746 0 3.332.477 4.5 1.253v13C19.832 18.477 18.246 18 16.5 18c-1.746 0-3.332.477-4.5 1.253"/>
                  </svg>
                </div>
                <div>
                  <p class="text-sm font-medium text-gray-900">Former mon IA</p>
                  <p class="text-xs text-gray-500">Ajouter des connaissances</p>
                </div>
              </div>
              <svg class="w-4 h-4 text-gray-400 group-hover:text-rose-500 transition-colors" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 5l7 7-7 7"/>
              </svg>
            </NuxtLink>

            <!-- Gérer les produits -->
            <NuxtLink 
              to="/products" 
              class="flex items-center justify-between p-3 rounded-xl border border-gray-200 hover:border-rose-300 hover:bg-rose-50 transition-all group"
            >
              <div class="flex items-center space-x-3">
                <div class="w-10 h-10 rounded-lg bg-green-100 flex items-center justify-center group-hover:bg-green-200 transition-colors">
                  <svg class="w-5 h-5 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M20 7l-8-4-8 4m16 0l-8 4m8-4v10l-8 4m0-10L4 7m8 4v10M4 7v10l8 4"/>
                  </svg>
                </div>
                <div>
                  <p class="text-sm font-medium text-gray-900">Mes produits</p>
                  <p class="text-xs text-gray-500">{{ dashboardStats.products.total }} produit{{ dashboardStats.products.total !== 1 ? 's' : '' }}</p>
                </div>
              </div>
              <svg class="w-4 h-4 text-gray-400 group-hover:text-rose-500 transition-colors" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 5l7 7-7 7"/>
              </svg>
            </NuxtLink>

            <!-- Intégrer le widget -->
            <NuxtLink 
              to="/agent-ia?tab=integration" 
              class="flex items-center justify-between p-3 rounded-xl border border-gray-200 hover:border-rose-300 hover:bg-rose-50 transition-all group"
            >
              <div class="flex items-center space-x-3">
                <div class="w-10 h-10 rounded-lg bg-orange-100 flex items-center justify-center group-hover:bg-orange-200 transition-colors">
                  <svg class="w-5 h-5 text-orange-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M10 20l4-16m4 4l4 4-4 4M6 16l-4-4 4-4"/>
                  </svg>
                </div>
                <div>
                  <p class="text-sm font-medium text-gray-900">Intégrer le widget</p>
                  <p class="text-xs text-gray-500">Code pour votre site</p>
                </div>
              </div>
              <svg class="w-4 h-4 text-gray-400 group-hover:text-rose-500 transition-colors" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 5l7 7-7 7"/>
              </svg>
            </NuxtLink>

            <!-- Voir la facturation -->
            <NuxtLink 
              to="/billing" 
              class="flex items-center justify-between p-3 rounded-xl border border-gray-200 hover:border-rose-300 hover:bg-rose-50 transition-all group"
            >
              <div class="flex items-center space-x-3">
                <div class="w-10 h-10 rounded-lg bg-blue-100 flex items-center justify-center group-hover:bg-blue-200 transition-colors">
                  <svg class="w-5 h-5 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M3 10h18M7 15h1m4 0h1m-7 4h12a3 3 0 003-3V8a3 3 0 00-3-3H6a3 3 0 00-3 3v8a3 3 0 003 3z"/>
                  </svg>
                </div>
                <div>
                  <p class="text-sm font-medium text-gray-900">Facturation</p>
                  <p class="text-xs text-gray-500">Gérer mon abonnement</p>
                </div>
              </div>
              <svg class="w-4 h-4 text-gray-400 group-hover:text-rose-500 transition-colors" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 5l7 7-7 7"/>
              </svg>
            </NuxtLink>
          </div>
        </div>
      </div>
    </div>

    <!-- ========== SUCCESS NOTIFICATION ========== -->
    <Transition
      enter-active-class="transform ease-out duration-300 transition"
      enter-from-class="translate-y-2 opacity-0"
      enter-to-class="translate-y-0 opacity-100"
      leave-active-class="transition ease-in duration-100"
      leave-from-class="opacity-100"
      leave-to-class="opacity-0"
    >
      <div
        v-if="showSuccessMessage"
        class="fixed bottom-4 right-4 left-4 md:left-auto bg-green-600 text-white px-4 md:px-6 py-3 rounded-lg shadow-lg z-50"
      >
        <div class="flex items-center justify-center md:justify-start">
          <svg class="w-5 h-5 mr-2 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M5 13l4 4L19 7"/>
          </svg>
          <span class="text-sm">{{ successMessage }}</span>
        </div>
      </div>
    </Transition>
  </div>
</template>

<script setup lang="ts">
import { ref, computed, onMounted } from 'vue'
import { useAuthStore } from '~/stores/auth'

definePageMeta({
  middleware: 'auth',
  layout: 'default'
})

// ========== INTERFACES ==========
interface DashboardStats {
  conversations: {
    total: number
    active: number
  }
  orders: {
    total: number
    conversionRate: number
  }
  revenue: {
    total: number
    average: number
  }
  performance: {
    responseTime: string
    uptime: number
  }
  products: {
    total: number
  }
  beautyInsights?: {
    productsRecommended?: number
    topProduct?: string
    [key: string]: any
  }
}

interface SetupStatus {
  agentCreated: boolean
  productsSynced: boolean
  widgetIntegrated: boolean
  knowledgeBase: boolean
}

interface BeautyProfile {
  beautyCategory: 'skincare' | 'haircare' | 'makeup' | 'fragrance' | 'bodycare' | 'natural' | 'multi'
  specializedTarget: string[]
  targetAgeRange: string
  priceRange: string
  communicationTone: string
  expertiseLevel: string
  primaryGoal: string
  agentName?: string
}

interface AgentInfo {
  id: string
  name: string
  title: string
  avatar: string | null
  isActive: boolean
  knowledgeBaseCount: number
}

// ========== COMPOSABLES ==========
const authStore = useAuthStore()
const api = useApi()

// ========== REACTIVE STATE ==========
const refreshing = ref(false)
const loadingStats = ref(true)
const showSuccessMessage = ref(false)
const showWelcomeModal = ref(false)
const showReminderActions = ref(false)
const reminderDismissed = ref(false)
const successMessage = ref('')

const dashboardStats = ref<DashboardStats>({
  conversations: { total: 0, active: 0 },
  orders: { total: 0, conversionRate: 0 },
  revenue: { total: 0, average: 0 },
  performance: { responseTime: '< 2s', uptime: 99.9 },
  products: { total: 0 },
  beautyInsights: {}
})

const setupStatus = ref<SetupStatus>({
  agentCreated: false,
  productsSynced: false,
  widgetIntegrated: false,
  knowledgeBase: false
})

const beautyProfile = ref<BeautyProfile>({
  beautyCategory: 'multi',
  specializedTarget: [],
  targetAgeRange: '',
  priceRange: '',
  communicationTone: '',
  expertiseLevel: '',
  primaryGoal: '',
  agentName: ''
})

const agentId = ref<string | null>(null)
const agentInfo = ref<AgentInfo | null>(null)

// ========== COMPUTED ==========
const greeting = computed(() => {
  const hour = new Date().getHours()
  if (hour >= 5 && hour < 12) return 'Bonjour'
  if (hour >= 12 && hour < 18) return 'Bon après-midi'
  if (hour >= 18 && hour < 22) return 'Bonsoir'
  return 'Bonne nuit'
})

const userFirstName = computed(() => {
  const userName = authStore.userName
  const userEmail = authStore.userEmail
  
  if (userName && !userName.includes('@')) {
    const firstName = userName.split(' ')[0]
    return firstName.charAt(0).toUpperCase() + firstName.slice(1).toLowerCase()
  }
  
  if (userEmail) {
    const emailPrefix = userEmail.split('@')[0]
    const firstName = emailPrefix.split(/[._-]/)[0]
    return firstName.charAt(0).toUpperCase() + firstName.slice(1).toLowerCase()
  }
  
  return 'Utilisateur'
})

// Nombre d'étapes complétées
const completedSteps = computed(() => {
  let count = 0
  if (setupStatus.value.agentCreated) count++
  if (setupStatus.value.productsSynced) count++
  if (setupStatus.value.widgetIntegrated) count++
  return count
})

// Afficher le rappel de configuration (si pas tout complété et pas masqué)
const showConfigReminder = computed(() => {
  return setupStatus.value.agentCreated && 
         completedSteps.value < 3 && 
         !reminderDismissed.value
})

// Pas de données = toutes les stats à 0
const hasNoData = computed(() => {
  return dashboardStats.value.conversations.total === 0 &&
         dashboardStats.value.orders.total === 0 &&
         dashboardStats.value.revenue.total === 0
})

// ========== UTILITY METHODS ==========
const formatCurrency = (amount: number): string => {
  return new Intl.NumberFormat('fr-FR', {
    style: 'currency',
    currency: 'EUR',
    minimumFractionDigits: 0,
    maximumFractionDigits: 0
  }).format(amount)
}

const formatConversionRate = (rate: any): string => {
  if (typeof rate === 'number') {
    if (rate === 0) return '0%'
    return `${rate.toFixed(1)}%`
  }
  if (typeof rate === 'string' && rate.includes('%')) {
    return rate
  }
  return '0%'
}

const showNotification = (message: string) => {
  successMessage.value = message
  showSuccessMessage.value = true
  setTimeout(() => {
    showSuccessMessage.value = false
  }, 3000)
}

const dismissReminder = () => {
  reminderDismissed.value = true
  // Stocker dans sessionStorage pour ne pas réafficher pendant la session
  sessionStorage.setItem('chatseller_reminder_dismissed', 'true')
}

// ========== MÉTHODES CONTEXTUELLES ==========
const getDashboardSubtitle = () => {
  if (!agentInfo.value) {
    return 'Créez votre Conseillère IA pour commencer à vendre'
  }
  
  const subtitles = {
    'skincare': `${agentInfo.value.name} conseille vos clientes en soins du visage`,
    'haircare': `${agentInfo.value.name} conseille vos clientes en soins capillaires`,
    'makeup': `${agentInfo.value.name} conseille vos clientes en maquillage`,
    'fragrance': `${agentInfo.value.name} conseille vos clientes en parfums`,
    'bodycare': `${agentInfo.value.name} conseille vos clientes en soins du corps`,
    'natural': `${agentInfo.value.name} conseille vos clientes en cosmétiques naturels`,
    'multi': `${agentInfo.value.name} conseille vos clientes en beauté`
  }
  return subtitles[beautyProfile.value.beautyCategory] || subtitles.multi
}

const getAgentTypeName = () => {
  const types = {
    'skincare': 'Conseillère Skincare IA',
    'haircare': 'Experte Capillaire IA',
    'makeup': 'Conseillère Maquillage IA',
    'fragrance': 'Conseillère Parfums IA',
    'bodycare': 'Experte Soins Corps IA',
    'natural': 'Conseillère Naturel IA',
    'multi': 'Conseillère IA'
  }
  return types[beautyProfile.value.beautyCategory] || types.multi
}

// ========== NAVIGATION ==========
const navigateToAgentDetail = () => {
  if (agentId.value) {
    navigateTo(`/agent-ia/${agentId.value}`)
  } else {
    navigateTo('/agent-ia')
  }
}

const navigateToProducts = () => {
  closeWelcomeModal()
  navigateTo('/products')
}

const navigateToKnowledgeBase = () => {
  closeWelcomeModal()
  navigateTo('/knowledge-base')
}

const closeWelcomeModal = () => {
  showWelcomeModal.value = false
  localStorage.setItem('chatseller_welcome_shown', 'true')
}

// ========== DATA LOADING ==========
const loadAgent = async () => {
  try {
    const config = useRuntimeConfig()
    const baseURL = config.public.apiBaseUrl

    const response = await $fetch('/api/v1/agents', {
      method: 'GET',
      baseURL,
      headers: {
        'Authorization': `Bearer ${authStore.token}`,
        'Content-Type': 'application/json'
      }
    }) as { success: boolean; data: any[] }

    if (response.success && response.data && response.data.length > 0) {
      const agent = response.data[0]
      agentId.value = agent.id

      const knowledgeBase = agent.agent_knowledge_base || []
      agentInfo.value = {
        id: agent.id,
        name: agent.name || 'Conseillère IA',
        title: agent.title || '',
        avatar: agent.avatar || null,
        isActive: agent.is_active ?? true,
        knowledgeBaseCount: knowledgeBase.length
      }

      // Mettre à jour le statut
      setupStatus.value.agentCreated = true
      setupStatus.value.knowledgeBase = knowledgeBase.length > 0

      console.log('✅ Agent chargé:', agentInfo.value.name)
    }
  } catch (error) {
    console.error('❌ Erreur chargement agent:', error)
  }
}

const loadBeautyProfile = async () => {
  try {
    const user = authStore.user
    if (!user?.id) return
    
    const config = useRuntimeConfig()
    const baseURL = config.public.apiBaseUrl
    
    const shopResponse = await $fetch(`/api/v1/shops/${user.id}`, {
      method: 'GET',
      baseURL,
      headers: {
        'Authorization': `Bearer ${authStore.token}`,
        'Content-Type': 'application/json'
      }
    }) as { success: boolean; data: any }
    
    if (shopResponse.success && shopResponse.data) {
      const shop = shopResponse.data
      
      beautyProfile.value = {
        beautyCategory: shop.beauty_category || 'multi',
        specializedTarget: shop.specialized_target || [],
        targetAgeRange: shop.target_age_range || '',
        priceRange: shop.price_range || '',
        communicationTone: shop.communication_tone || '',
        expertiseLevel: shop.expertise_level || '',
        primaryGoal: shop.primary_goal || '',
        agentName: shop.agent_config?.name || ''
      }
      
      // Vérifier si le widget est intégré
      setupStatus.value.widgetIntegrated = shop.widget_integrated === true
      
      console.log('✅ Beauty profile chargé:', beautyProfile.value.beautyCategory)
    }
  } catch (error) {
    console.error('❌ Erreur chargement beauty profile:', error)
  }
}

const loadProducts = async () => {
  try {
    const response = await api.products.list()
    if (response.success && response.data) {
      dashboardStats.value.products.total = response.data.length
      setupStatus.value.productsSynced = response.data.length > 0
      return response.data
    }
    return []
  } catch (error) {
    console.error('❌ Erreur chargement produits:', error)
    return []
  }
}

const loadConversations = async () => {
  try {
    const response = await api.conversations.list()
    if (response.success && response.data) {
      return response.data
    }
    return []
  } catch (error) {
    console.error('❌ Erreur chargement conversations:', error)
    return []
  }
}

const loadOrders = async () => {
  try {
    // TODO: Implémenter l'endpoint orders quand disponible
    return []
  } catch (error) {
    console.error('❌ Erreur chargement commandes:', error)
    return []
  }
}

const loadDashboardData = async () => {
  try {
    console.log('📊 Chargement des données dashboard...')
    
    const [conversationsData, ordersData, productsData] = await Promise.allSettled([
      loadConversations(),
      loadOrders(),
      loadProducts()
    ])

    // Conversations
    if (conversationsData.status === 'fulfilled') {
      const convs = conversationsData.value
      dashboardStats.value.conversations = {
        total: convs.length,
        active: convs.filter((c: any) => c.status === 'active' || c.status === 'open').length
      }
    }
    
    // Orders & Revenue
    if (ordersData.status === 'fulfilled') {
      const orders = ordersData.value
      const totalConversations = dashboardStats.value.conversations.total
      
      dashboardStats.value.orders = {
        total: orders.length,
        conversionRate: totalConversations > 0 ? Math.round((orders.length / totalConversations) * 100) : 0
      }
      
      if (orders.length > 0) {
        const totalRevenue = orders.reduce((sum: number, order: any) => sum + (order.amount || 0), 0)
        dashboardStats.value.revenue = {
          total: totalRevenue,
          average: Math.round(totalRevenue / orders.length)
        }
      }
    }

    // Products
    if (productsData.status === 'fulfilled') {
      const products = productsData.value
      dashboardStats.value.products.total = products.length
    }

    console.log('✅ Données dashboard chargées')
  } catch (error) {
    console.error('❌ Erreur chargement dashboard:', error)
  } finally {
    loadingStats.value = false
  }
}

// ========== ACTIONS ==========
const handleRefreshData = async () => {
  refreshing.value = true
  
  try {
    await Promise.all([
      loadAgent(),
      loadDashboardData()
    ])
    showNotification('Données actualisées !')
  } catch (error) {
    console.error('❌ Erreur rafraîchissement:', error)
    showNotification('Erreur lors de l\'actualisation')
  } finally {
    refreshing.value = false
  }
}

// ========== LIFECYCLE ==========
onMounted(async () => {
  // ✅ VÉRIFICATION HASH TOKEN - Rediriger vers callback si token de confirmation email détecté
  // Ceci gère le cas où Supabase redirige vers / au lieu de /auth/callback
  const hash = window.location.hash
  if (hash && hash.includes('access_token')) {
    console.log('🔗 [Index] Token de confirmation détecté, redirection vers /auth/callback...')
    // Rediriger vers callback avec le hash intact
    window.location.href = `/auth/callback${hash}`
    return // Arrêter l'exécution
  }

  // ✅ IMPORTANT: Capturer les paramètres URL AVANT les appels async
  const urlParams = new URLSearchParams(window.location.search)
  const onboardingCompleted = urlParams.get('onboarding') === 'completed'
  const welcomeParam = urlParams.get('welcome') === 'true'
  const welcomeShown = localStorage.getItem('chatseller_welcome_shown')

  // ✅ Vérifier aussi si on vient de l'onboarding via sessionStorage (backup)
  const justCompletedOnboarding = sessionStorage.getItem('chatseller_onboarding_just_completed')

  console.log('🏠 [Index] Paramètres détectés:', {
    onboardingCompleted,
    welcomeParam,
    welcomeShown,
    justCompletedOnboarding
  })

  // ✅ Déterminer si on doit afficher le modal AVANT les appels async
  const shouldShowWelcomeModal = !welcomeShown && (onboardingCompleted || welcomeParam || justCompletedOnboarding)

  if (shouldShowWelcomeModal) {
    console.log('🎉 [Index] Modal de bienvenue sera affiché')
    // Nettoyer le flag de session
    sessionStorage.removeItem('chatseller_onboarding_just_completed')
    // Nettoyer l'URL immédiatement
    window.history.replaceState({}, '', '/')
  }

  // Vérifier si le rappel a été masqué dans la session
  const reminderWasDismissed = sessionStorage.getItem('chatseller_reminder_dismissed')
  if (reminderWasDismissed) {
    reminderDismissed.value = true
  }

  // Charger l'agent en premier
  await loadAgent()

  // Charger le profil beauté
  await loadBeautyProfile()

  // Charger les données dashboard
  await loadDashboardData()

  // ✅ Afficher le modal APRÈS le chargement des données (pour avoir agentInfo)
  if (shouldShowWelcomeModal) {
    showWelcomeModal.value = true
  }
})

// ========== SEO ==========
useHead({
  title: 'Dashboard - ChatSeller',
  meta: [
    { name: 'description', content: 'Tableau de bord de votre Conseillère IA beauté - Conversations, ventes et statistiques' }
  ]
})
</script>

<style scoped>
.card-modern {
  @apply bg-white rounded-xl shadow-sm border border-gray-200 p-4 md:p-6;
}

.card-modern-gradient {
  @apply bg-gradient-to-br rounded-xl shadow-lg p-4 md:p-6 text-white;
}

/* Animations */
@keyframes spin {
  from { transform: rotate(0deg); }
  to { transform: rotate(360deg); }
}

.animate-spin {
  animation: spin 1s linear infinite;
}

.animate-pulse {
  animation: pulse 2s cubic-bezier(0.4, 0, 0.6, 1) infinite;
}

@keyframes pulse {
  0%, 100% {
    opacity: 1;
  }
  50% {
    opacity: .5;
  }
}

/* Mobile optimizations */
@media (max-width: 640px) {
  .card-modern {
    @apply p-4;
  }
  
  .card-modern-gradient {
    @apply p-4;
  }
}

/* Touch-friendly tap targets */
@media (pointer: coarse) {
  button, a {
    min-height: 44px;
  }
}
</style>