<!-- pages/index.vue - VERSION COMPLÈTE AVEC MODAL AMÉLIORÉ -->
<template>
  <div class="min-h-screen bg-gray-50">
    <!-- Modal de Bienvenue AMÉLIORÉ -->
    <div 
      v-if="showWelcomeModal" 
      class="fixed inset-0 bg-black bg-opacity-60 flex items-center justify-center z-50 p-4 overflow-hidden"
      @click.self="closeWelcomeModal"
    >
      <!-- Canvas pour les confettis -->
      <canvas
        ref="confettiCanvas"
        class="absolute inset-0 pointer-events-none z-40"
        :width="canvasWidth"
        :height="canvasHeight"
      ></canvas>
      
      <div class="bg-white rounded-2xl shadow-2xl max-w-5xl w-full h-[90vh] flex flex-col overflow-hidden">
        <!-- Header du Modal -->
        <div class="px-8 py-6 border-b border-gray-200 flex-shrink-0">
          <div class="flex items-center justify-between">
            <div class="flex items-center space-x-3">
              <div class="w-12 h-12 bg-gradient-to-r from-blue-500 to-blue-600 rounded-xl flex items-center justify-center">
                <span class="text-white font-bold text-lg">CS</span>
              </div>
              <div>
                <h2 class="text-2xl font-bold text-gray-900">
                  🎉 Bienvenue sur ChatSeller, {{ userFirstName }} !
                </h2>
                <p class="text-gray-600">Créez votre Vendeur IA et automatisez vos ventes</p>
              </div>
            </div>
            <button
              @click="closeWelcomeModal"
              class="text-gray-400 hover:text-gray-600 transition-colors"
            >
              <svg class="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12"/>
              </svg>
            </button>
          </div>
        </div>

        <!-- Contenu du Modal - SCROLLABLE -->
        <div class="flex-1 overflow-y-auto">
          <div class="p-8">
            <div class="grid grid-cols-1 lg:grid-cols-2 gap-8">
              <!-- Étapes de Configuration -->
              <div>
                <h3 class="text-lg font-semibold text-gray-900 mb-6">✨ Prochaines étapes pour démarrer</h3>
                
                <div class="space-y-4">
                  <!-- Étape 1: Créer le Vendeur IA -->
                  <div class="welcome-step" :class="{ 'completed': stepStatus.vendeurIA }">
                    <div class="flex items-start space-x-4">
                      <div class="step-number">
                        <span v-if="stepStatus.vendeurIA" class="text-green-600">✓</span>
                        <span v-else class="text-blue-600 font-semibold">1</span>
                      </div>
                      <div class="flex-1">
                        <h4 class="font-medium text-gray-900">🤖 Créer votre Vendeur IA</h4>
                        <p class="text-sm text-gray-600 mt-1">
                          Configurez un agent intelligent qui répond automatiquement à vos clients et collecte leurs commandes 24h/24.
                        </p>
                        <button
                          @click="goToStep('/agent-config')"
                          class="mt-3 text-blue-600 hover:text-blue-700 text-sm font-medium inline-flex items-center"
                        >
                          {{ stepStatus.vendeurIA ? '⚙️ Modifier mon agent' : '🚀 Configurer maintenant' }}
                          <svg class="w-4 h-4 ml-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 5l7 7-7 7"/>
                          </svg>
                        </button>
                      </div>
                    </div>
                  </div>

                  <!-- Étape 2: Former la Base de Connaissance -->
                  <div class="welcome-step" :class="{ 'completed': stepStatus.knowledgeBase }">
                    <div class="flex items-start space-x-4">
                      <div class="step-number">
                        <span v-if="stepStatus.knowledgeBase" class="text-green-600">✓</span>
                        <span v-else class="text-blue-600 font-semibold">2</span>
                      </div>
                      <div class="flex-1">
                        <h4 class="font-medium text-gray-900">📚 Former votre Vendeur IA</h4>
                        <p class="text-sm text-gray-600 mt-1">
                          Ajoutez des informations sur vos produits, FAQ, et politiques pour que votre agent réponde avec précision.
                        </p>
                        <button
                          @click="goToStep('/knowledge-base')"
                          class="mt-3 text-blue-600 hover:text-blue-700 text-sm font-medium inline-flex items-center"
                        >
                          {{ stepStatus.knowledgeBase ? '📖 Gérer mes documents' : '📝 Ajouter des connaissances' }}
                          <svg class="w-4 h-4 ml-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 5l7 7-7 7"/>
                          </svg>
                        </button>
                      </div>
                    </div>
                  </div>

                  <!-- Étape 3: Intégrer le Widget -->
                  <div class="welcome-step" :class="{ 'completed': stepStatus.widgetIntegration }">
                    <div class="flex items-start space-x-4">
                      <div class="step-number">
                        <span v-if="stepStatus.widgetIntegration" class="text-green-600">✓</span>
                        <span v-else class="text-blue-600 font-semibold">3</span>
                      </div>
                      <div class="flex-1">
                        <h4 class="font-medium text-gray-900">🔗 Intégrer sur votre site</h4>
                        <p class="text-sm text-gray-600 mt-1">
                          Copiez le code d'intégration et ajoutez-le sur votre site pour activer votre Vendeur IA.
                        </p>
                        <button
                          @click="goToStep('/agent-config?tab=integration')"
                          class="mt-3 text-blue-600 hover:text-blue-700 text-sm font-medium inline-flex items-center"
                        >
                          {{ stepStatus.widgetIntegration ? '🔧 Voir l\'intégration' : '💻 Obtenir le code' }}
                          <svg class="w-4 h-4 ml-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 5l7 7-7 7"/>
                          </svg>
                        </button>
                      </div>
                    </div>
                  </div>
                </div>

                <!-- Progression -->
                <div class="mt-8 p-6 bg-gradient-to-r from-blue-50 to-green-50 rounded-xl border border-blue-200">
                  <div class="flex items-center justify-between mb-3">
                    <span class="text-sm font-semibold text-blue-900">🎯 Progression de votre configuration</span>
                    <span class="text-lg font-bold text-blue-600">{{ configurationProgress }}%</span>
                  </div>
                  <div class="w-full bg-blue-200 rounded-full h-3">
                    <div 
                      class="bg-gradient-to-r from-blue-500 to-green-500 h-3 rounded-full transition-all duration-500 shadow-lg"
                      :style="{ width: `${configurationProgress}%` }"
                    ></div>
                  </div>
                  <p class="text-xs text-blue-700 mt-2">
                    {{ configurationProgress === 100 ? '🎉 Configuration terminée !' : 'Quelques étapes pour un Vendeur IA optimal' }}
                  </p>
                </div>
              </div>

              <!-- Aperçu du Chat -->
              <div>
                <h3 class="text-lg font-semibold text-gray-900 mb-6">👀 Aperçu de votre futur Vendeur IA</h3>
                
                <!-- Mockup du Chat amélioré -->
                <div class="chat-preview shadow-xl border-2 border-gray-200">
                  <div class="chat-header">
                    <div class="flex items-center space-x-3">
                      <div class="w-10 h-10 bg-gradient-to-r from-green-400 to-green-500 rounded-full flex items-center justify-center animate-pulse">
                        <span class="text-white text-sm font-bold">🤖</span>
                      </div>
                      <div>
                        <p class="font-semibold text-gray-900">Vendeur IA ChatSeller</p>
                        <p class="text-xs text-green-600 flex items-center">
                          <span class="w-2 h-2 bg-green-500 rounded-full mr-1 animate-pulse"></span>
                          En ligne • Répond en < 2s
                        </p>
                      </div>
                    </div>
                    <div class="text-xs text-gray-500">
                      ⚡ Powered by ChatSeller
                    </div>
                  </div>

                  <div class="chat-messages">
                    <!-- Message d'accueil de l'IA -->
                    <div class="ai-message">
                      <div class="message-bubble ai">
                        <p class="text-sm">👋 Bonjour ! Je vois que vous regardez <strong>[Produit]</strong>. Puis-je vous aider à faire le bon choix ?</p>
                      </div>
                    </div>

                    <!-- Réponse utilisateur -->
                    <div class="user-message">
                      <div class="message-bubble user">
                        <p class="text-sm">Oui, j'aimerais savoir si c'est adapté à mes besoins</p>
                      </div>
                    </div>

                    <!-- Réponse avec options -->
                    <div class="ai-message">
                      <div class="message-bubble ai">
                        <p class="text-sm">Parfait ! 🎯 Pour vous conseiller au mieux, pouvez-vous me dire :</p>
                        <ul class="text-xs mt-2 space-y-1">
                          <li>• Dans quel contexte l'utiliserez-vous ?</li>
                          <li>• Avez-vous des contraintes particulières ?</li>
                        </ul>
                        <div class="mt-3 space-y-2">
                          <button class="quick-reply">💬 Usage domestique</button>
                          <button class="quick-reply">🏢 Usage professionnel</button>
                          <button class="quick-reply">🛒 Je veux acheter directement</button>
                        </div>
                      </div>
                    </div>

                    <!-- Indication de frappe -->
                    <div class="ai-message">
                      <div class="typing-indicator">
                        <span></span>
                        <span></span>
                        <span></span>
                      </div>
                    </div>
                  </div>

                  <div class="chat-input">
                    <div class="flex items-center space-x-2">
                      <input 
                        type="text" 
                        placeholder="💬 Posez votre question..."
                        class="flex-1 px-4 py-3 border border-gray-300 rounded-full text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
                        disabled
                      />
                      <button class="w-10 h-10 bg-gradient-to-r from-blue-600 to-blue-700 rounded-full flex items-center justify-center shadow-lg">
                        <svg class="w-5 h-5 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 19l9 2-9-18-9 18 9-2zm0 0v-8"/>
                        </svg>
                      </button>
                    </div>
                  </div>
                </div>

                <!-- Stats simulées -->
                <div class="mt-6 grid grid-cols-2 gap-4">
                  <div class="bg-green-50 border border-green-200 rounded-lg p-4 text-center">
                    <div class="text-2xl font-bold text-green-600">+35%</div>
                    <div class="text-xs text-green-700">Conversions moyennes</div>
                  </div>
                  <div class="bg-blue-50 border border-blue-200 rounded-lg p-4 text-center">
                    <div class="text-2xl font-bold text-blue-600">24/7</div>
                    <div class="text-xs text-blue-700">Disponibilité</div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>

        <!-- Footer du Modal -->
        <div class="px-8 py-6 bg-gray-50 border-t border-gray-200 flex-shrink-0">
          <div class="flex items-center justify-between">
            <div class="text-sm text-gray-600">
              <span class="font-medium">💡 Conseil :</span> Commencez par configurer votre Vendeur IA pour de meilleurs résultats
            </div>
            <div class="flex items-center space-x-3">
              <button
                @click="skipModal"
                class="px-4 py-2 text-gray-600 hover:text-gray-800 text-sm font-medium transition-colors"
              >
                Je découvrirai plus tard
              </button>
              <button
                @click="goToStep('/agent-config')"
                class="px-6 py-3 bg-gradient-to-r from-blue-500 to-blue-600 text-white text-sm font-semibold rounded-lg hover:from-blue-600 hover:to-blue-700 transition-all transform hover:scale-105 shadow-lg"
              >
                🚀 Commencer la configuration
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>

    <!-- Welcome Banner - Condition mise à jour -->
    <div v-if="showWelcomeBanner && !showWelcomeModal" class="m-8 mb-6">
      <div class="bg-gradient-to-r from-blue-600 to-blue-700 rounded-xl shadow-lg overflow-hidden">
        <div class="px-8 py-6 text-white relative">
          <div class="flex items-center justify-between">
            <div>
              <h2 class="text-2xl font-bold mb-2">🎉 Bon retour sur ChatSeller !</h2>
              <p class="text-blue-100 text-lg">
                Continuez la configuration de votre Vendeur IA pour maximiser vos conversions.
              </p>
              <div class="mt-4 flex flex-wrap gap-3">
                <NuxtLink 
                  to="/agent-config" 
                  class="inline-flex items-center px-4 py-2 bg-white bg-opacity-20 rounded-lg text-white font-medium hover:bg-opacity-30 transition-all"
                >
                  <svg class="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.746 0 3.332.477 4.5 1.253v13C19.832 18.477 18.246 18 16.5 18c-1.746 0-3.332.477-4.5 1.253"/>
                  </svg>
                  Configurer mon Vendeur IA
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

    <!-- Header -->
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
      <!-- KPI Cards -->
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
        <!-- Recent Conversations -->
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

        <!-- Recent Orders -->
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

        <!-- Quick Setup -->
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
              <NuxtLink to="/agent-config" class="flex items-center justify-between w-full">
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
              <NuxtLink to="/agent-config?tab=integration" class="flex items-center justify-between w-full">
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
import { ref, computed, onMounted, onUnmounted } from 'vue'
import { useAuthStore } from '~/stores/auth'
import { useDatabase } from '~~/composables/useDatabase'

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

interface StepStatus {
  vendeurIA: boolean
  knowledgeBase: boolean
  widgetIntegration: boolean
}

// ✅ COMPOSABLES - API PURE
const authStore = useAuthStore()
const db = useDatabase()

// ✅ REACTIVE STATE
const refreshing = ref(false)
const loadingStats = ref(true)
const showSuccessMessage = ref(false)
const successMessage = ref('')

// ✅ NOUVEAUX ÉTATS POUR MODAL DE BIENVENUE
const showWelcomeModal = ref(false)
const showWelcomeBanner = ref(false)

// ✅ CONFETTIS VARIABLES
const confettiCanvas = ref(null)
const canvasWidth = ref(0)
const canvasHeight = ref(0)

// ✅ DONNÉES DYNAMIQUES
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

// ✅ NOUVEAU : STATUS DES ÉTAPES POUR LE MODAL
const stepStatus = ref<StepStatus>({
  vendeurIA: false,
  knowledgeBase: false,
  widgetIntegration: false
})

// ✅ COMPUTED
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

// ✅ SYSTÈME DE CONFETTIS LÉGER
const createConfetti = () => {
  if (!confettiCanvas.value) return
  
  const canvas = confettiCanvas.value
  const ctx = canvas.getContext('2d')
  
  // Ajuster la taille du canvas
  canvasWidth.value = window.innerWidth
  canvasHeight.value = window.innerHeight
  
  const confettiCount = 50
  const confettiArray = []
  
  const colors = ['#FF6B9D', '#4ECDC4', '#45B7D1', '#96CEB4', '#FFEAA7', '#DDA0DD', '#FFB6C1']
  
  // Créer les confettis
  for (let i = 0; i < confettiCount; i++) {
    confettiArray.push({
      x: Math.random() * canvasWidth.value,
      y: -10,
      size: Math.random() * 8 + 3,
      color: colors[Math.floor(Math.random() * colors.length)],
      speed: Math.random() * 3 + 2,
      rotation: Math.random() * 360,
      rotationSpeed: (Math.random() - 0.5) * 10
    })
  }
  
  // Animation
  const animate = () => {
    ctx.clearRect(0, 0, canvasWidth.value, canvasHeight.value)
    
    confettiArray.forEach((confetti, index) => {
      ctx.save()
      ctx.translate(confetti.x, confetti.y)
      ctx.rotate((confetti.rotation * Math.PI) / 180)
      ctx.fillStyle = confetti.color
      ctx.fillRect(-confetti.size / 2, -confetti.size / 2, confetti.size, confetti.size)
      ctx.restore()
      
      // Mise à jour position
      confetti.y += confetti.speed
      confetti.x += Math.sin(confetti.y / 50) * 0.5
      confetti.rotation += confetti.rotationSpeed
      
      // Supprimer si hors écran
      if (confetti.y > canvasHeight.value + 10) {
        confettiArray.splice(index, 1)
      }
    })
    
    if (confettiArray.length > 0) {
      requestAnimationFrame(animate)
    }
  }
  
  animate()
}

// ✅ GESTION MODAL DE BIENVENUE
const checkWelcomeModal = () => {
  const urlParams = new URLSearchParams(window.location.search)
  const showWelcome = urlParams.get('welcome') === 'true'
  const onboardingCompleted = urlParams.get('onboarding') === 'completed'
  const isNewUser = urlParams.get('newuser') === 'true'
  
  if (showWelcome && onboardingCompleted) {
    showWelcomeModal.value = true
    
    // ✅ LANCER LES CONFETTIS APRÈS UN COURT DÉLAI
    setTimeout(() => {
      createConfetti()
    }, 500)
    
    // Nettoyer l'URL
    window.history.replaceState({}, '', window.location.pathname)
  } else if (showWelcome) {
    showWelcomeBanner.value = true
    // Nettoyer l'URL
    window.history.replaceState({}, '', window.location.pathname)
  }
}

const closeWelcomeModal = () => {
  showWelcomeModal.value = false
  localStorage.setItem('chatseller_welcome_modal_seen', 'true')
}

const skipModal = () => {
  closeWelcomeModal()
}

const goToStep = (path: string) => {
  closeWelcomeModal()
  navigateTo(path)
}

const hideWelcomeBanner = () => {
  showWelcomeBanner.value = false
  localStorage.setItem('chatseller_welcome_seen', 'true')
}

// ✅ DATA LOADING - VERSION API PURE
const loadDashboardData = async () => {
  if (!authStore.userShopId) {
    console.warn('Pas de shop ID disponible')
    loadingStats.value = false
    return
  }

  try {
    console.log('🔄 Chargement des données dashboard via API pour shop:', authStore.userShopId)
    
    const [statsData, conversationsData, ordersData, setupData] = await Promise.allSettled([
      loadStats(),
      loadRecentConversations(),
      loadRecentOrders(),
      loadSetupStatus()
    ])

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
      // ✅ CORRECTION : Mapper correctement les propriétés
      stepStatus.value = {
        vendeurIA: setupData.value.agentConfig,
        knowledgeBase: setupData.value.knowledgeBase,
        widgetIntegration: setupData.value.widgetIntegration
      }
    }

    console.log('✅ Données dashboard chargées avec succès via API')
  } catch (error) {
    console.error('❌ Erreur lors du chargement des données dashboard via API:', error)
    showNotification('Erreur lors du chargement des données')
  } finally {
    loadingStats.value = false
  }
}

// ✅ VERSION API PURE
const loadStats = async (): Promise<DashboardStats> => {
  try {
    console.log('📊 Chargement des statistiques via API...')
    
    const stats = await db.getAnalytics()
    
    if (!stats) {
      console.error('❌ Erreur récupération analytics')
      return dashboardStats.value
    }
    
    return {
      conversations: {
        total: stats.totalConversations || 0,
        active: stats.activeConversations || 0
      },
      orders: {
        total: stats.totalOrders || 0,
        conversionRate: stats.conversionRate || 0
      },
      revenue: {
        total: stats.totalRevenue || 0,
        average: stats.averageOrderValue || 0
      },
      performance: {
        responseTime: '< 2s',
        uptime: 99.9
      }
    }
  } catch (error) {
    console.error('❌ Erreur chargement stats via API:', error)
    return dashboardStats.value
  }
}

// ✅ VERSION API PURE
const loadRecentConversations = async (): Promise<Conversation[]> => {
  try {
    console.log('💬 Chargement des conversations récentes via API...')
    
    const conversations = await db.getConversations()
    
    if (!conversations || conversations.length === 0) {
      console.log('ℹ️ Aucune conversation trouvée')
      return []
    }

    return conversations.slice(0, 3).map((conv: any) => ({
      id: conv.id,
      visitor: conv.visitor_name || conv.visitor_id || 'Visiteur anonyme',
      lastMessage: conv.last_message || 'Nouvelle conversation',
      time: new Date(conv.last_activity || conv.started_at),
      unread: conv.status === 'new' || conv.status === 'active'
    }))
  } catch (error) {
    console.error('❌ Erreur chargement conversations via API:', error)
    return []
  }
}

// ✅ VERSION API PURE
const loadRecentOrders = async (): Promise<Order[]> => {
  try {
    console.log('🛒 Chargement des commandes récentes via API...')
    
    const orders = await db.getOrders()
    
    if (!orders || orders.length === 0) {
      console.log('ℹ️ Aucune commande trouvée')
      return []
    }

    return orders.slice(0, 3).map((order: any) => ({
      id: order.id,
      customer: order.customer_name || order.customer_phone || order.customer_email || 'Client',
      amount: order.total_amount || 0,
      time: new Date(order.created_at)
    }))
  } catch (error) {
    console.error('❌ Erreur chargement commandes via API:', error)
    return []
  }
}

// ✅ VERSION API PURE
const loadSetupStatus = async (): Promise<SetupStatus> => {
  try {
    console.log('⚙️ Chargement du statut de configuration via API...')
    
    const [kbDocuments, agents, shop] = await Promise.all([
      db.getKnowledgeBase(),
      db.getAgents(),
      db.getShop()
    ])

    const hasKnowledgeBase = kbDocuments && kbDocuments.length > 0
    const hasAgentConfig = agents && agents.length > 0
    const hasWidgetIntegration = shop && shop.domain

    console.log('✅ Statut de configuration:', {
      knowledgeBase: hasKnowledgeBase,
      agentConfig: hasAgentConfig,
      widgetIntegration: hasWidgetIntegration
    })

    return {
      knowledgeBase: !!hasKnowledgeBase,
      agentConfig: !!hasAgentConfig,
      widgetIntegration: !!hasWidgetIntegration
    }
  } catch (error) {
    console.error('❌ Erreur chargement setup status via API:', error)
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

// ✅ GESTION RESPONSIVE CANVAS
const handleResize = () => {
  canvasWidth.value = window.innerWidth
  canvasHeight.value = window.innerHeight
}

// ✅ LIFECYCLE
onMounted(async () => {
  // Vérifier si modal de bienvenue à afficher
  checkWelcomeModal()
  
  // Gérer le resize pour le canvas
  handleResize()
  window.addEventListener('resize', handleResize)
  
  // Charger les données
  await loadDashboardData()
})

onUnmounted(() => {
  window.removeEventListener('resize', handleResize)
})

// ✅ SEO
useHead({
  title: 'Dashboard - ChatSeller'
})
</script>

<style scoped>
/* ✅ STYLES EXISTANTS INCHANGÉS */
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

/* ✅ NOUVEAUX STYLES POUR MODAL BIENVENUE */
.welcome-step {
  @apply p-4 border border-gray-200 rounded-lg transition-all hover:border-blue-300 hover:bg-blue-50;
}

.welcome-step.completed {
  @apply border-green-200 bg-green-50;
}

.step-number {
  @apply w-8 h-8 rounded-full bg-gray-100 flex items-center justify-center text-sm font-medium flex-shrink-0;
}

.welcome-step.completed .step-number {
  @apply bg-green-100;
}

/* ✅ CHAT PREVIEW AMÉLIORÉ */
.chat-preview {
  @apply bg-white rounded-2xl overflow-hidden;
}

.chat-header {
  @apply px-4 py-3 bg-gradient-to-r from-gray-50 to-blue-50 border-b border-gray-200 flex items-center justify-between;
}

.chat-messages {
  @apply p-4 space-y-3 h-80 overflow-y-auto bg-gradient-to-b from-gray-50 to-white;
}

.ai-message {
  @apply flex items-start space-x-2;
}

.user-message {
  @apply flex items-start space-x-2 justify-end;
}

.message-bubble {
  @apply px-4 py-3 rounded-2xl max-w-xs text-sm shadow-sm;
}

.message-bubble.ai {
  @apply bg-white border border-gray-200 text-gray-800;
}

.message-bubble.user {
  @apply bg-blue-600 text-white;
}

.quick-reply {
  @apply w-full text-left px-3 py-2 bg-blue-50 border border-blue-200 rounded-lg text-xs hover:bg-blue-100 transition-colors font-medium;
}

.chat-input {
  @apply p-4 bg-white border-t border-gray-200;
}

/* ✅ TYPING INDICATOR */
.typing-indicator {
  @apply flex space-x-1 px-4 py-3 bg-gray-100 rounded-2xl max-w-xs;
}

.typing-indicator span {
  @apply w-2 h-2 bg-gray-400 rounded-full animate-bounce;
}

.typing-indicator span:nth-child(2) {
  animation-delay: 0.1s;
}

.typing-indicator span:nth-child(3) {
  animation-delay: 0.2s;
}

/* ✅ ANIMATIONS */
@keyframes bounce {
  0%, 80%, 100% {
    transform: scale(0);
  }
  40% {
    transform: scale(1);
  }
}

@keyframes pulse {
  0%, 100% {
    opacity: 1;
  }
  50% {
    opacity: 0.5;
  }
}

.animate-bounce {
  animation: bounce 1.4s infinite ease-in-out both;
}

.animate-pulse {
  animation: pulse 2s cubic-bezier(0.4, 0, 0.6, 1) infinite;
}

@keyframes spin {
  from { transform: rotate(0deg); }
  to { transform: rotate(360deg); }
}

.animate-spin {
  animation: spin 1s linear infinite;
}

/* ✅ EMPÊCHER LE SCROLL DANS LE MODAL BACKDROP */
.overflow-hidden {
  overflow: hidden !important;
}

/* ✅ RESPONSIVE */
@media (max-width: 768px) {
  .card-modern {
    @apply p-4;
  }
  
  .card-modern-gradient {
    @apply p-4;
  }
  
  .chat-preview {
    @apply mx-2;
  }
  
  .chat-messages {
    height: 250px;
  }
  
  .max-w-5xl {
    max-width: 95vw;
  }
  
  .grid-cols-1.lg\\:grid-cols-2 {
    grid-template-columns: 1fr;
  }
}
</style>