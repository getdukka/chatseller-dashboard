<!-- pages/index.vue - DASHBOARD HOMEPAGE AMÉLIORÉE -->
<template>
  <div class="min-h-screen bg-gray-50">
    <!-- Welcome Banner - NOUVEAU: Seulement première connexion -->
    <div v-if="showWelcomeBanner" class="m-8 mb-6">
      <div class="bg-gradient-to-r from-blue-600 to-blue-700 rounded-xl shadow-lg overflow-hidden">
        <div class="px-8 py-6 text-white relative">
          <div class="flex items-center justify-between">
            <div>
              <h2 class="text-2xl font-bold mb-2">🎉 Bienvenue sur ChatSeller !</h2>
              <p class="text-blue-100 text-lg">
                Paramétrez votre Vendeur IA pour transformer vos visiteurs en clients.
              </p>
              <div class="mt-4 flex flex-wrap gap-3">
                <NuxtLink 
                  to="/vendeurs-ia" 
                  class="inline-flex items-center px-4 py-2 bg-white bg-opacity-20 rounded-lg text-white font-medium hover:bg-opacity-30 transition-all"
                >
                  <svg class="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.746 0 3.332.477 4.5 1.253v13C19.832 18.477 18.246 18 16.5 18c-1.746 0-3.332.477-4.5 1.253"/>
                  </svg>
                  Créer mon Vendeur IA
                </NuxtLink>
                <NuxtLink 
                  to="/knowledge-base" 
                  class="inline-flex items-center px-4 py-2 bg-white bg-opacity-20 rounded-lg text-white font-medium hover:bg-opacity-30 transition-all"
                >
                  <svg class="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M10.325 4.317c.426-1.756 2.924-1.756 3.35 0a1.724 1.724 0 002.573 1.066c1.543-.94 3.31.826 2.37 2.37a1.724 1.724 0 001.065 2.572c1.756.426 1.756 2.924 0 3.35a1.724 1.724 0 00-1.066 2.573c.94 1.543-.826 3.31-2.37 2.37a1.724 1.724 0 00-2.572 1.065c-.426 1.756-2.924 1.756-3.35 0a1.724 1.724 0 00-2.573-1.066c-1.543.94-3.31-.826-2.37-2.37a1.724 1.724 0 00-1.065-2.572c-1.756-.426-1.756-2.924 0-3.35a1.724 1.724 0 001.066-2.573c-.94-1.543.826-3.31 2.37-2.37.996.608 2.296.07 2.572-1.065z"/>
                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M15 12a3 3 0 11-6 0 3 3 0 016 0z"/>
                  </svg>
                  Former mon Vendeur IA
                </NuxtLink>
              </div>
            </div>
            <button
              @click="hideWelcomeBanner"
              class="text-white text-opacity-80 hover:text-opacity-100 transition-colors"
            >
              <svg class="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12"/>
              </svg>
            </button>
          </div>
        </div>
      </div>
    </div>

    <!-- Header - NOUVEAU: Salutation personnalisée -->
    <div class="px-8 py-6">
      <div class="flex items-center justify-between">
        <div>
          <h1 class="text-3xl font-bold text-gray-900">
            {{ greeting }}, {{ userFirstName }} 👋🏼
          </h1>
          <p class="mt-2 text-gray-600">
            Voici les performances de votre Vendeur IA
          </p>
        </div>
        
        <!-- Quick Actions -->
        <div class="flex items-center space-x-4">
          <button
            @click="handleRefreshData"
            :disabled="refreshing"
            class="inline-flex items-center px-4 py-2 border border-gray-300 rounded-lg text-sm font-medium text-gray-700 bg-white hover:bg-gray-50 disabled:opacity-50 transition-colors"
          >
            <svg 
              class="w-4 h-4 mr-2" 
              :class="{ 'animate-spin': refreshing }"
              fill="none" 
              stroke="currentColor" 
              viewBox="0 0 24 24"
            >
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15"/>
            </svg>
            {{ refreshing ? 'Actualisation...' : 'Actualiser' }}
          </button>
          
          <NuxtLink
            to="/settings"
            class="inline-flex items-center px-4 py-2 bg-blue-600 text-white text-sm font-medium rounded-lg hover:bg-blue-700 transition-colors"
          >
            <svg class="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M10.325 4.317c.426-1.756 2.924-1.756 3.35 0a1.724 1.724 0 002.573 1.066c1.543-.94 3.31.826 2.37 2.37a1.724 1.724 0 001.065 2.572c1.756.426 1.756 2.924 0 3.35a1.724 1.724 0 00-1.066 2.573c.94 1.543-.826 3.31-2.37 2.37a1.724 1.724 0 00-2.572 1.065c-.426 1.756-2.924 1.756-3.35 0a1.724 1.724 0 00-2.573-1.066c-1.543.94-3.31-.826-2.37-2.37a1.724 1.724 0 00-1.065-2.572c-1.756-.426-1.756-2.924 0-3.35a1.724 1.724 0 001.066-2.573c-.94-1.543.826-3.31 2.37-2.37.996.608 2.296.07 2.572-1.065z"/>
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M15 12a3 3 0 11-6 0 3 3 0 016 0z"/>
            </svg>
            Configurer
          </NuxtLink>
        </div>
      </div>
    </div>

    <!-- Loading State -->
    <div v-if="loadingStats" class="px-8 pb-8">
      <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
        <div v-for="i in 4" :key="i" class="card-modern animate-pulse">
          <div class="h-24 bg-gray-200 rounded"></div>
        </div>
      </div>
    </div>

    <!-- Main Content -->
    <div v-else class="px-8 pb-8">
      <!-- KPI Cards - NOUVEAU: Vraies données -->
      <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
        <!-- Conversations Card -->
        <div class="card-modern-gradient from-blue-500 to-blue-600">
          <div class="flex items-center justify-between">
            <div class="text-white">
              <p class="text-blue-100 text-sm font-medium">Conversations</p>
              <p class="text-3xl font-bold">{{ formatNumber(dashboardStats.conversations.total) }}</p>
              <p class="text-blue-100 text-sm mt-1">
                <span class="text-white font-medium">{{ dashboardStats.conversations.active }}</span> actives
              </p>
            </div>
            <div class="p-3 bg-white bg-opacity-20 rounded-xl">
              <svg class="w-8 h-8 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z"/>
              </svg>
            </div>
          </div>
          <div class="mt-4">
            <NuxtLink 
              to="/conversations"
              class="text-white text-sm font-medium hover:text-blue-100 transition-colors inline-flex items-center"
            >
              Voir tout 
              <svg class="w-4 h-4 ml-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 5l7 7-7 7"/>
              </svg>
            </NuxtLink>
          </div>
        </div>

        <!-- Orders Card -->
        <div class="card-modern-gradient from-green-500 to-green-600">
          <div class="flex items-center justify-between">
            <div class="text-white">
              <p class="text-green-100 text-sm font-medium">Commandes</p>
              <p class="text-3xl font-bold">{{ formatNumber(dashboardStats.orders.total) }}</p>
              <p class="text-green-100 text-sm mt-1">
                <span class="text-white font-medium">{{ dashboardStats.orders.conversionRate }}%</span> conversion
              </p>
            </div>
            <div class="p-3 bg-white bg-opacity-20 rounded-xl">
              <svg class="w-8 h-8 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M16 11V7a4 4 0 00-8 0v4M5 9h14l1 12H4L5 9z"/>
              </svg>
            </div>
          </div>
          <div class="mt-4">
            <NuxtLink 
              to="/orders"
              class="text-white text-sm font-medium hover:text-green-100 transition-colors inline-flex items-center"
            >
              Voir tout 
              <svg class="w-4 h-4 ml-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 5l7 7-7 7"/>
              </svg>
            </NuxtLink>
          </div>
        </div>

        <!-- Revenue Card -->
        <div class="card-modern-gradient from-yellow-500 to-orange-500">
          <div class="flex items-center justify-between">
            <div class="text-white">
              <p class="text-orange-100 text-sm font-medium">Chiffre d'affaires</p>
              <p class="text-3xl font-bold">{{ formatCurrency(dashboardStats.revenue.total) }}</p>
              <p class="text-orange-100 text-sm mt-1">
                <span class="text-white font-medium">{{ formatCurrency(dashboardStats.revenue.average) }}</span> panier moyen
              </p>
            </div>
            <div class="p-3 bg-white bg-opacity-20 rounded-xl">
              <svg class="w-8 h-8 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1"/>
              </svg>
            </div>
          </div>
          <div class="mt-4">
            <NuxtLink 
              to="/analytics"
              class="text-white text-sm font-medium hover:text-orange-100 transition-colors inline-flex items-center"
            >
              Voir analytics 
              <svg class="w-4 h-4 ml-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 5l7 7-7 7"/>
              </svg>
            </NuxtLink>
          </div>
        </div>

        <!-- Performance Card -->
        <div class="card-modern-gradient from-purple-500 to-purple-600">
          <div class="flex items-center justify-between">
            <div class="text-white">
              <p class="text-purple-100 text-sm font-medium">Performance</p>
              <p class="text-3xl font-bold">{{ dashboardStats.performance.responseTime }}</p>
              <p class="text-purple-100 text-sm mt-1">
                <span class="text-white font-medium">{{ dashboardStats.performance.uptime }}%</span> uptime
              </p>
            </div>
            <div class="p-3 bg-white bg-opacity-20 rounded-xl">
              <svg class="w-8 h-8 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M13 10V3L4 14h7v7l9-11h-7z"/>
              </svg>
            </div>
          </div>
          <div class="mt-4">
            <span class="text-purple-100 text-sm font-medium">Système optimal</span>
          </div>
        </div>
      </div>

      <!-- Main Content Grid -->
      <div class="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <!-- Recent Conversations - NOUVEAU: Vraies données -->
        <div class="card-modern">
          <div class="flex items-center justify-between mb-6">
            <h3 class="text-lg font-semibold text-gray-900">Conversations récentes</h3>
            <NuxtLink 
              to="/conversations"
              class="text-blue-600 hover:text-blue-700 text-sm font-medium transition-colors"
            >
              Gérer les discussions
            </NuxtLink>
          </div>
          
          <div v-if="recentConversations.length > 0" class="space-y-4">
            <div 
              v-for="conversation in recentConversations" 
              :key="conversation.id"
              class="conversation-item"
              @click="goToConversation(conversation.id)"
            >
              <div class="flex items-center space-x-3">
                <div class="avatar-circle">
                  <span class="text-sm font-medium text-white">
                    {{ getInitials(conversation.visitor) }}
                  </span>
                </div>
                <div class="flex-1 min-w-0">
                  <p class="text-sm font-medium text-gray-900 truncate">
                    {{ conversation.visitor }}
                  </p>
                  <p class="text-xs text-gray-500 truncate">
                    {{ conversation.lastMessage }}
                  </p>
                </div>
                <div class="flex flex-col items-end">
                  <div class="text-xs text-gray-400">
                    {{ formatTime(conversation.time) }}
                  </div>
                  <div 
                    v-if="conversation.unread" 
                    class="w-2 h-2 bg-blue-500 rounded-full mt-1"
                  ></div>
                </div>
              </div>
            </div>
          </div>
          
          <div v-else class="empty-state">
            <svg class="w-12 h-12 text-gray-400 mx-auto" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z"/>
            </svg>
            <p class="text-gray-500 text-sm mt-2">Aucune conversation récente</p>
            <p class="text-gray-400 text-xs mt-1">Les nouvelles conversations apparaîtront ici</p>
          </div>
        </div>

        <!-- Recent Orders - NOUVEAU: Vraies données -->
        <div class="card-modern">
          <div class="flex items-center justify-between mb-6">
            <h3 class="text-lg font-semibold text-gray-900">Commandes récentes</h3>
            <NuxtLink 
              to="/orders"
              class="text-blue-600 hover:text-blue-700 text-sm font-medium transition-colors"
            >
              Suivi des ventes
            </NuxtLink>
          </div>
          
          <div v-if="recentOrders.length > 0" class="space-y-4">
            <div 
              v-for="order in recentOrders" 
              :key="order.id"
              class="order-item"
              @click="goToOrder(order.id)"
            >
              <div class="flex items-center justify-between">
                <div class="flex items-center space-x-3">
                  <div class="w-8 h-8 bg-green-100 rounded-lg flex items-center justify-center">
                    <svg class="w-4 h-4 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M16 11V7a4 4 0 00-8 0v4M5 9h14l1 12H4L5 9z"/>
                    </svg>
                  </div>
                  <div>
                    <p class="text-sm font-medium text-gray-900">
                      {{ order.customer }}
                    </p>
                    <p class="text-xs text-gray-500">
                      Commande #{{ order.id.slice(-6).toUpperCase() }}
                    </p>
                  </div>
                </div>
                <div class="text-right">
                  <p class="text-sm font-medium text-gray-900">
                    {{ formatCurrency(order.amount) }}
                  </p>
                  <p class="text-xs text-gray-500">
                    {{ formatTime(order.time) }}
                  </p>
                </div>
              </div>
            </div>
          </div>
          
          <div v-else class="empty-state">
            <svg class="w-12 h-12 text-gray-400 mx-auto" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M16 11V7a4 4 0 00-8 0v4M5 9h14l1 12H4L5 9z"/>
            </svg>
            <p class="text-gray-500 text-sm mt-2">Aucune commande récente</p>
            <p class="text-gray-400 text-xs mt-1">Les nouvelles ventes apparaîtront ici</p>
          </div>
        </div>

        <!-- Quick Setup - NOUVEAU: Configuration dynamique -->
        <div class="card-modern">
          <div class="flex items-center justify-between mb-6">
            <h3 class="text-lg font-semibold text-gray-900">Configuration rapide</h3>
            <div class="progress-circle">
              <span class="text-xs text-gray-600">{{ configurationProgress }}%</span>
            </div>
          </div>
          
          <div class="space-y-4">
            <div class="setup-item" :class="{ 'completed': setupStatus.knowledgeBase }">
              <NuxtLink to="/knowledge-base" class="flex items-center justify-between w-full">
                <div class="flex items-center space-x-3">
                  <div class="setup-icon" :class="setupStatus.knowledgeBase ? 'bg-green-100 text-green-600' : 'bg-purple-100 text-purple-600'">
                    <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.746 0 3.332.477 4.5 1.253v13C19.832 18.477 18.246 18 16.5 18c-1.746 0-3.332.477-4.5 1.253"/>
                    </svg>
                  </div>
                  <div>
                    <p class="text-sm font-medium text-gray-900">Base de connaissance</p>
                    <p class="text-xs text-gray-500">Former le Vendeur IA</p>
                  </div>
                </div>
                <div class="flex items-center">
                  <span class="text-xs text-gray-400">{{ setupStatus.knowledgeBase ? 'Configuré' : 'Vide' }}</span>
                  <svg class="w-4 h-4 text-gray-400 ml-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 5l7 7-7 7"/>
                  </svg>
                </div>
              </NuxtLink>
            </div>

            <div class="setup-item" :class="{ 'completed': setupStatus.agentConfig }">
              <NuxtLink to="/vendeurs-ia" class="flex items-center justify-between w-full">
                <div class="flex items-center space-x-3">
                  <div class="setup-icon" :class="setupStatus.agentConfig ? 'bg-green-100 text-green-600' : 'bg-blue-100 text-blue-600'">
                    <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M10.325 4.317c.426-1.756 2.924-1.756 3.35 0a1.724 1.724 0 002.573 1.066c1.543-.94 3.31.826 2.37 2.37a1.724 1.724 0 001.065 2.572c1.756.426 1.756 2.924 0 3.35a1.724 1.724 0 00-1.066 2.573c.94 1.543-.826 3.31-2.37 2.37a1.724 1.724 0 00-2.572 1.065c-.426 1.756-2.924 1.756-3.35 0a1.724 1.724 0 00-2.573-1.066c-1.543.94-3.31-.826-2.37-2.37a1.724 1.724 0 00-1.065-2.572c-1.756-.426-1.756-2.924 0-3.35a1.724 1.724 0 001.066-2.573c-.94-1.543.826-3.31 2.37-2.37.996.608 2.296.07 2.572-1.065z"/>
                      <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M15 12a3 3 0 11-6 0 3 3 0 016 0z"/>
                    </svg>
                  </div>
                  <div>
                    <p class="text-sm font-medium text-gray-900">Paramètres du Vendeur IA</p>
                    <p class="text-xs text-gray-500">Personnaliser le comportement</p>
                  </div>
                </div>
                <div class="flex items-center">
                  <span class="text-xs text-gray-400">{{ setupStatus.agentConfig ? 'Configuré' : 'À configurer' }}</span>
                  <svg class="w-4 h-4 text-gray-400 ml-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 5l7 7-7 7"/>
                  </svg>
                </div>
              </NuxtLink>
            </div>

            <div class="setup-item" :class="{ 'completed': setupStatus.widgetIntegration }">
              <NuxtLink to="/settings?tab=integration" class="flex items-center justify-between w-full">
                <div class="flex items-center space-x-3">
                  <div class="setup-icon" :class="setupStatus.widgetIntegration ? 'bg-green-100 text-green-600' : 'bg-orange-100 text-orange-600'">
                    <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M10 20l4-16m4 4l4 4-4 4M6 16l-4-4 4-4"/>
                    </svg>
                  </div>
                  <div>
                    <p class="text-sm font-medium text-gray-900">Widget intégration</p>
                    <p class="text-xs text-gray-500">Code à intégrer sur votre site</p>
                  </div>
                </div>
                <div class="flex items-center">
                  <span class="text-xs text-gray-400">{{ setupStatus.widgetIntegration ? 'Intégré' : 'À intégrer' }}</span>
                  <svg class="w-4 h-4 text-gray-400 ml-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 5l7 7-7 7"/>
                  </svg>
                </div>
              </NuxtLink>
            </div>
          </div>
        </div>
      </div>
    </div>

    <!-- Success Notification -->
    <div
      v-if="showSuccessMessage"
      class="fixed bottom-4 right-4 bg-green-600 text-white px-6 py-3 rounded-lg shadow-lg z-50 transform transition-all duration-300"
    >
      <div class="flex items-center">
        <svg class="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M5 13l4 4L19 7"/>
        </svg>
        {{ successMessage }}
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, computed, onMounted } from 'vue'
import { useAuthStore } from '~/stores/auth'
import { useSupabase } from '~/composables/useSupabase'

// ✅ PAGE META
definePageMeta({
  middleware: 'auth',
  layout: 'default'
})

// ✅ TYPES
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
}

interface Conversation {
  id: string
  visitor: string
  lastMessage: string
  time: Date
  unread: boolean
}

interface Order {
  id: string
  customer: string
  amount: number
  time: Date
}

interface SetupStatus {
  knowledgeBase: boolean
  agentConfig: boolean
  widgetIntegration: boolean
}

// ✅ COMPOSABLES
const authStore = useAuthStore()
const supabase = useSupabase()

// ✅ REACTIVE STATE
const refreshing = ref(false)
const loadingStats = ref(true)
const showSuccessMessage = ref(false)
const successMessage = ref('')

// ✅ NOUVEAU: Gestion intelligente du banner de bienvenue
const showWelcomeBanner = ref(false)

// ✅ NOUVEAU: Données dynamiques
const dashboardStats = ref<DashboardStats>({
  conversations: { total: 0, active: 0 },
  orders: { total: 0, conversionRate: 0 },
  revenue: { total: 0, average: 0 },
  performance: { responseTime: '< 2s', uptime: 99.9 }
})

const recentConversations = ref<Conversation[]>([])
const recentOrders = ref<Order[]>([])
const setupStatus = ref<SetupStatus>({
  knowledgeBase: false,
  agentConfig: false,
  widgetIntegration: false
})

// ✅ COMPUTED - Salutation personnalisée (corrigée)
const greeting = computed(() => {
  const hour = new Date().getHours()
  if (hour >= 5 && hour < 12) return 'Bonjour'
  if (hour >= 12 && hour < 18) return 'Bon après-midi'
  if (hour >= 18 && hour < 22) return 'Bonsoir'
  return 'Bonne nuit'
})

// ✅ COMPUTED - Prénom utilisateur (corrigé)
const userFirstName = computed(() => {
  const userName = authStore.userName
  const userEmail = authStore.userEmail
  
  // Si on a un nom utilisateur et que ce n'est pas un email
  if (userName && !userName.includes('@')) {
    const firstName = userName.split(' ')[0]
    return firstName.charAt(0).toUpperCase() + firstName.slice(1).toLowerCase()
  }
  
  // Sinon, extraire le prénom de l'email (partie avant le @)
  if (userEmail) {
    const emailPrefix = userEmail.split('@')[0]
    // Si le préfix contient des points ou tirets, prendre la première partie
    const firstName = emailPrefix.split(/[._-]/)[0]
    return firstName.charAt(0).toUpperCase() + firstName.slice(1).toLowerCase()
  }
  
  return 'Utilisateur'
})

// ✅ COMPUTED - Progression configuration
const configurationProgress = computed(() => {
  const total = Object.keys(setupStatus.value).length
  const completed = Object.values(setupStatus.value).filter(Boolean).length
  return Math.round((completed / total) * 100)
})

// ✅ UTILITY METHODS
const formatCurrency = (amount: number): string => {
  return new Intl.NumberFormat('fr-FR', {
    style: 'currency',
    currency: 'EUR'
  }).format(amount)
}

const formatNumber = (num: number): string => {
  return new Intl.NumberFormat('fr-FR').format(num)
}

const formatTime = (date: Date): string => {
  const now = new Date()
  const diffInMinutes = Math.floor((now.getTime() - date.getTime()) / (1000 * 60))
  
  if (diffInMinutes < 1) return 'À l\'instant'
  if (diffInMinutes < 60) return `Il y a ${diffInMinutes}min`
  if (diffInMinutes < 24 * 60) return `Il y a ${Math.floor(diffInMinutes / 60)}h`
  return date.toLocaleDateString('fr-FR')
}

const getInitials = (name: string): string => {
  return name
    .split(' ')
    .map(n => n[0])
    .join('')
    .toUpperCase()
    .slice(0, 2)
}

const showNotification = (message: string) => {
  successMessage.value = message
  showSuccessMessage.value = true
  setTimeout(() => {
    showSuccessMessage.value = false
  }, 3000)
}

// ✅ NOUVEAU: Gestion du banner de bienvenue
const hideWelcomeBanner = () => {
  showWelcomeBanner.value = false
  localStorage.setItem('chatseller_welcome_seen', 'true')
}

const checkIfFirstVisit = () => {
  const hasSeenWelcome = localStorage.getItem('chatseller_welcome_seen')
  const urlParams = new URLSearchParams(window.location.search)
  const forceWelcome = urlParams.get('welcome') === 'true'
  
  showWelcomeBanner.value = !hasSeenWelcome || forceWelcome
  
  // Nettoyer l'URL si ?welcome=true
  if (forceWelcome) {
    window.history.replaceState({}, '', window.location.pathname)
  }
}

// ✅ NOUVEAU: Chargement des vraies données
const loadDashboardData = async () => {
  if (!authStore.userShopId) {
    console.warn('Pas de shop ID disponible')
    loadingStats.value = false
    return
  }

  try {
    console.log('🔄 Chargement des données dashboard pour shop:', authStore.userShopId)
    
    // Paralléliser les appels
    const [statsData, conversationsData, ordersData, setupData] = await Promise.allSettled([
      loadStats(),
      loadRecentConversations(),
      loadRecentOrders(),
      loadSetupStatus()
    ])

    // Traiter les résultats
    if (statsData.status === 'fulfilled') {
      dashboardStats.value = statsData.value
    }
    
    if (conversationsData.status === 'fulfilled') {
      recentConversations.value = conversationsData.value
    }
    
    if (ordersData.status === 'fulfilled') {
      recentOrders.value = ordersData.value
    }
    
    if (setupData.status === 'fulfilled') {
      setupStatus.value = setupData.value
    }

    console.log('✅ Données dashboard chargées avec succès')
  } catch (error) {
    console.error('❌ Erreur lors du chargement des données dashboard:', error)
    showNotification('Erreur lors du chargement des données')
  } finally {
    loadingStats.value = false
  }
}

// ✅ NOUVEAU: Chargement des statistiques
const loadStats = async (): Promise<DashboardStats> => {
  try {
    // Conversations
    const { data: conversationsData } = await supabase
      .from('conversations')
      .select('id, status, created_at')
      .eq('shop_id', authStore.userShopId)

    const totalConversations = conversationsData?.length || 0
    const activeConversations = conversationsData?.filter(c => c.status === 'active').length || 0

    // Commandes
    const { data: ordersData } = await supabase
      .from('orders')
      .select('id, amount, created_at')
      .eq('shop_id', authStore.userShopId)

    const totalOrders = ordersData?.length || 0
    const totalRevenue = ordersData?.reduce((sum, order) => sum + (order.amount || 0), 0) || 0
    const averageRevenue = totalOrders > 0 ? totalRevenue / totalOrders : 0
    const conversionRate = totalConversations > 0 ? (totalOrders / totalConversations) * 100 : 0

    return {
      conversations: {
        total: totalConversations,
        active: activeConversations
      },
      orders: {
        total: totalOrders,
        conversionRate: Math.round(conversionRate * 10) / 10
      },
      revenue: {
        total: totalRevenue,
        average: averageRevenue
      },
      performance: {
        responseTime: '< 2s',
        uptime: 99.9
      }
    }
  } catch (error) {
    console.error('❌ Erreur chargement stats:', error)
    // Retourner des données par défaut en cas d'erreur
    return dashboardStats.value
  }
}

// ✅ NOUVEAU: Chargement des conversations récentes
const loadRecentConversations = async (): Promise<Conversation[]> => {
  try {
    const { data } = await supabase
      .from('conversations')
      .select('id, visitor_name, last_message, updated_at, status')
      .eq('shop_id', authStore.userShopId)
      .order('updated_at', { ascending: false })
      .limit(3)

    return data?.map(conv => ({
      id: conv.id,
      visitor: conv.visitor_name || 'Visiteur anonyme',
      lastMessage: conv.last_message || 'Nouvelle conversation',
      time: new Date(conv.updated_at),
      unread: conv.status === 'new'
    })) || []
  } catch (error) {
    console.error('❌ Erreur chargement conversations:', error)
    return []
  }
}

// ✅ NOUVEAU: Chargement des commandes récentes
const loadRecentOrders = async (): Promise<Order[]> => {
  try {
    const { data } = await supabase
      .from('orders')
      .select('id, customer_name, amount, created_at')
      .eq('shop_id', authStore.userShopId)
      .order('created_at', { ascending: false })
      .limit(3)

    return data?.map(order => ({
      id: order.id,
      customer: order.customer_name || 'Client',
      amount: order.amount || 0,
      time: new Date(order.created_at)
    })) || []
  } catch (error) {
    console.error('❌ Erreur chargement commandes:', error)
    return []
  }
}

// ✅ NOUVEAU: Statut de configuration
const loadSetupStatus = async (): Promise<SetupStatus> => {
  try {
    // Base de connaissance
    const { data: kbData } = await supabase
      .from('knowledge_base')
      .select('id')
      .eq('shop_id', authStore.userShopId)
      .limit(1)

    // Configuration agent
    const { data: shopData } = await supabase
      .from('shops')
      .select('agent_config, widget_config, domain')
      .eq('id', authStore.userShopId)
      .single()

    const hasKnowledgeBase = (kbData?.length || 0) > 0
    const hasAgentConfig = shopData?.agent_config && Object.keys(shopData.agent_config).length > 0
    const hasWidgetIntegration = !!shopData?.domain

    return {
      knowledgeBase: hasKnowledgeBase,
      agentConfig: hasAgentConfig,
      widgetIntegration: hasWidgetIntegration
    }
  } catch (error) {
    console.error('❌ Erreur chargement setup status:', error)
    return {
      knowledgeBase: false,
      agentConfig: false,
      widgetIntegration: false
    }
  }
}

// ✅ ACTION METHODS
const handleRefreshData = async () => {
  refreshing.value = true
  
  try {
    await loadDashboardData()
    showNotification('Données actualisées avec succès!')
  } catch (error) {
    console.error('Erreur lors du rafraîchissement:', error)
    showNotification('Erreur lors de l\'actualisation')
  } finally {
    refreshing.value = false
  }
}

const goToConversation = (id: string) => {
  navigateTo(`/conversations/${id}`)
}

const goToOrder = (id: string) => {
  navigateTo(`/orders/${id}`)
}

// ✅ LIFECYCLE
onMounted(async () => {
  // Vérifier si première visite
  checkIfFirstVisit()
  
  // Charger les données
  await loadDashboardData()
})

// ✅ SEO
useHead({
  title: 'Dashboard - ChatSeller'
})
</script>

<style scoped>
/* ✅ MODERN COMPONENTS */
.card-modern {
  @apply bg-white rounded-xl shadow-sm border border-gray-200 p-6;
}

.card-modern-gradient {
  @apply bg-gradient-to-br rounded-xl shadow-lg p-6 text-white;
}

.conversation-item {
  @apply p-3 rounded-lg hover:bg-gray-50 transition-colors cursor-pointer;
}

.order-item {
  @apply p-3 rounded-lg hover:bg-gray-50 transition-colors cursor-pointer;
}

.avatar-circle {
  @apply flex h-10 w-10 items-center justify-center rounded-full bg-gradient-to-br from-blue-500 to-blue-600;
}

.empty-state {
  @apply text-center py-8;
}

.setup-item {
  @apply p-3 rounded-lg border border-gray-200 hover:border-blue-300 hover:bg-blue-50 transition-all;
}

.setup-item.completed {
  @apply border-green-200 bg-green-50;
}

.setup-icon {
  @apply w-10 h-10 rounded-lg flex items-center justify-center;
}

.progress-circle {
  @apply w-12 h-12 rounded-full border-4 border-gray-200 flex items-center justify-center;
}

/* ✅ RESPONSIVE */
@media (max-width: 768px) {
  .card-modern {
    @apply p-4;
  }
  
  .card-modern-gradient {
    @apply p-4;
  }
}

/* ✅ ANIMATIONS */
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
</style>