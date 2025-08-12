<!-- pages/agent-config.vue - VERSION CORRIGÉE -->
<template>
  <div class="min-h-screen bg-gray-50">
    <!-- Header -->
    <div class="bg-white shadow-sm border-b border-gray-200">
      <div class="px-4 sm:px-6 lg:px-8 py-4 lg:py-6">
        <div class="flex flex-col sm:flex-row sm:items-center justify-between space-y-4 sm:space-y-0">
          <div class="flex items-center space-x-3 lg:space-x-4 min-w-0 flex-1">
            <button @click="goBack" class="p-2 text-gray-400 hover:text-gray-600 rounded-lg hover:bg-gray-100 transition-colors flex-shrink-0">
              <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M15 19l-7-7 7-7"/>
              </svg>
            </button>
            <div class="min-w-0 flex-1">
              <h1 class="text-lg sm:text-xl lg:text-2xl font-bold text-gray-900 truncate">
                {{ agentName }} - Configuration
              </h1>
              <p class="mt-1 text-xs sm:text-sm text-gray-600">
                Vendeur IA • Widget • Test • Intégration
                <!-- ✅ INDICATEUR DE SYNC CORRIGÉ -->
                <span v-if="widgetSyncStatus === 'syncing'" class="ml-2 inline-flex items-center text-blue-600">
                  <svg class="w-4 h-4 mr-1 animate-spin" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15"/>
                  </svg>
                  Synchronisation...
                </span>
                <span v-else-if="widgetSyncStatus === 'synced'" class="ml-2 inline-flex items-center text-green-600">
                  <svg class="w-4 h-4 mr-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M5 13l4 4L19 7"/>
                  </svg>
                  Synchronisé
                </span>
              </p>
            </div>
          </div>
          
          <div class="flex flex-col sm:flex-row items-stretch sm:items-center space-y-2 sm:space-y-0 sm:space-x-3">
            <!-- Navigation par onglets (mobile) -->
            <div class="sm:hidden">
              <select v-model="activeTab" class="w-full border border-gray-300 rounded-lg px-3 py-2 text-sm">
                <option v-for="tab in tabs" :key="tab.id" :value="tab.id">
                  {{ tab.icon }} {{ tab.name }}
                </option>
              </select>
            </div>
            
            <!-- Navigation par onglets (desktop) -->
            <div class="hidden sm:flex space-x-1 bg-gray-100 p-1 rounded-lg">
              <button
                v-for="tab in tabs"
                :key="tab.id"
                @click="activeTab = tab.id"
                :class="[
                  'px-2 lg:px-3 py-1.5 text-xs lg:text-sm font-medium rounded-md transition-colors whitespace-nowrap',
                  activeTab === tab.id 
                    ? 'bg-white text-blue-600 shadow-sm' 
                    : 'text-gray-500 hover:text-gray-700'
                ]"
              >
                <span class="hidden lg:inline">{{ tab.icon }}</span>
                <span class="lg:ml-1">{{ tab.name }}</span>
              </button>
            </div>
            
            <span class="hidden lg:inline text-sm text-gray-500">ID: {{ agentId.substring(0, 8) }}...</span>
            
            <button
              @click="saveAllConfig"
              :disabled="saving || !isConfigValid"
              class="inline-flex items-center justify-center px-3 lg:px-4 py-2 bg-blue-600 text-white text-xs lg:text-sm font-medium rounded-lg hover:bg-blue-700 disabled:opacity-50 transition-colors"
            >
              <svg v-if="saving" class="w-4 h-4 mr-2 animate-spin" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15"/>
              </svg>
              <svg v-else class="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M8 7H5a2 2 0 00-2 2v9a2 2 0 002 2h14a2 2 0 002-2V9a2 2 0 00-2-2h-3m-1 4l-3 3m0 0l-3-3m3 3V4"/>
              </svg>
              <span class="hidden sm:inline">{{ saving ? 'Sauvegarde...' : 'Sauvegarder' }}</span>
            </button>
          </div>
        </div>
      </div>
    </div>

    <!-- Messages -->
    <div class="mx-4 sm:mx-6 lg:mx-8 mt-4 space-y-2">
      <div v-if="successMessage" class="p-3 lg:p-4 bg-green-50 border border-green-200 rounded-lg">
        <div class="flex items-center">
          <svg class="w-5 h-5 text-green-400 mr-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M5 13l4 4L19 7"/>
          </svg>
          <p class="text-green-700 text-sm">{{ successMessage }}</p>
        </div>
      </div>
      
      <div v-if="error" class="p-3 lg:p-4 bg-red-50 border border-red-200 rounded-lg">
        <div class="flex items-center justify-between">
          <div class="flex items-center">
            <svg class="w-5 h-5 text-red-400 mr-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"/>
            </svg>
            <p class="text-red-700 text-sm">{{ error }}</p>
          </div>
          <button @click="clearError" class="text-red-400 hover:text-red-600">
            <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12"/>
            </svg>
          </button>
        </div>
      </div>
    </div>

    <!-- Loading State -->
    <div v-if="loading" class="flex items-center justify-center py-12 lg:py-16">
      <div class="text-center">
        <svg class="animate-spin h-6 lg:h-8 w-6 lg:w-8 text-blue-600 mx-auto mb-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15"/>
        </svg>
        <p class="text-gray-600 text-sm lg:text-base">Chargement de la configuration...</p>
      </div>
    </div>

    <!-- Content avec onglets -->
    <div v-else-if="agentConfig || hasValidAgentData" class="p-4 sm:p-6 lg:p-8">
      
      <!-- ✅ ONGLET 1: CONFIGURATION AGENT -->
      <div v-if="activeTab === 'agent'" class="grid grid-cols-1 xl:grid-cols-3 gap-6 lg:gap-8">
        
        <!-- Configuration Panel -->
        <div class="xl:col-span-2 space-y-6 lg:space-y-8">
          
          <!-- Informations de base -->
          <div class="bg-white rounded-xl shadow-sm border border-gray-200 p-4 lg:p-6">
            <h3 class="text-base lg:text-lg font-semibold text-gray-900 mb-4 lg:mb-6">🤖 Informations du Vendeur IA</h3>
            
            <div class="space-y-4 lg:space-y-6">
              <!-- Nom -->
              <div>
                <label class="block text-sm font-medium text-gray-700 mb-2">Nom du Vendeur IA *</label>
                <input
                  v-model="localConfig.agent.name"
                  type="text"
                  class="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-colors text-sm lg:text-base"
                  placeholder="Ex: Sarah, Expert Produits"
                />
              </div>

              <!-- Type + Personnalité -->
              <div class="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label class="block text-sm font-medium text-gray-700 mb-2">Type de vendeur</label>
                  <select v-model="localConfig.agent.type" class="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 text-sm lg:text-base">
                    <option value="general">🎯 Vendeur généraliste</option>
                    <option value="product_specialist">🛍️ Spécialiste produit</option>
                    <option value="support">🆘 Support & SAV</option>
                    <option value="upsell">💎 Upsell Premium</option>
                  </select>
                </div>
                
                <div>
                  <label class="block text-sm font-medium text-gray-700 mb-2">Personnalité</label>
                  <select v-model="localConfig.agent.personality" class="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 text-sm lg:text-base">
                    <option value="professional">💼 Professionnel</option>
                    <option value="friendly">😊 Amical</option>
                    <option value="expert">🎓 Expert technique</option>
                    <option value="casual">😎 Décontracté</option>
                  </select>
                </div>
              </div>

              <!-- ✅ NOUVEAU : Choix du LLM (Plan Pro) -->
              <div>
                <label class="block text-sm font-medium text-gray-700 mb-2">
                  Intelligence Artificielle
                  <span v-if="!isPaidUser" class="ml-2 inline-flex items-center px-2 py-0.5 rounded text-xs font-medium bg-yellow-100 text-yellow-800">
                    Plan Pro
                  </span>
                </label>
                <div class="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <select 
                      v-model="localConfig.agent.config.aiProvider" 
                      :disabled="!isPaidUser"
                      class="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 text-sm lg:text-base disabled:bg-gray-100 disabled:text-gray-500"
                    >
                      <option value="openai">🤖 GPT-4o-mini (Gratuit)</option>
                      <option value="claude" :disabled="!isPaidUser">🧠 Claude Sonnet (Pro)</option>
                    </select>
                  </div>
                  <div>
                    <select 
                      v-model="localConfig.agent.config.temperature" 
                      :disabled="!isPaidUser"
                      class="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 text-sm lg:text-base disabled:bg-gray-100 disabled:text-gray-500"
                    >
                      <option :value="0.3">🎯 Créatif (0.3)</option>
                      <option :value="0.7">⚖️ Équilibré (0.7)</option>
                      <option :value="1.0">🎨 Créatif (1.0)</option>
                    </select>
                  </div>
                </div>
                <p v-if="!isPaidUser" class="text-xs text-yellow-600 mt-1">
                  💡 Passez au plan Pro pour accéder à Claude AI et paramètres avancés
                </p>
              </div>

              <!-- Messages -->
              <div>
                <label class="block text-sm font-medium text-gray-700 mb-2">Message d'accueil *</label>
                <textarea
                  v-model="localConfig.agent.welcomeMessage"
                  rows="3"
                  class="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 text-sm lg:text-base"
                  placeholder="Bonjour ! Je suis Sarah, spécialiste produits. Comment puis-je vous aider à trouver le produit parfait ?"
                ></textarea>
                <!-- Aperçu en temps réel -->
                <div class="mt-2 p-3 bg-blue-50 border border-blue-200 rounded-lg">
                  <div class="flex items-start space-x-2">
                    <div class="w-6 h-6 bg-blue-600 rounded-full flex items-center justify-center flex-shrink-0">
                      <span class="text-white text-xs">IA</span>
                    </div>
                    <p class="text-sm text-gray-800">{{ localConfig.agent.welcomeMessage || 'Tapez votre message d\'accueil...' }}</p>
                  </div>
                </div>
              </div>
            </div>
          </div>

          <!-- ✅ NOUVELLE SECTION : Base de Connaissances -->
          <div class="bg-white rounded-xl shadow-sm border border-gray-200 p-4 lg:p-6">
            <div class="flex items-center justify-between mb-4 lg:mb-6">
              <h3 class="text-base lg:text-lg font-semibold text-gray-900">📚 Base de Connaissances</h3>
              <button 
                @click="openKnowledgeBaseModal" 
                class="inline-flex items-center px-3 py-1.5 bg-blue-600 text-white text-xs font-medium rounded-lg hover:bg-blue-700 transition-colors"
              >
                <svg class="w-4 h-4 mr-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 6v6m0 0v6m0-6h6m-6 0H6"/>
                </svg>
                Gérer
              </button>
            </div>
            
            <div v-if="linkedKnowledgeBase.length === 0" class="text-center py-8">
              <svg class="w-12 h-12 text-gray-400 mx-auto mb-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z"/>
              </svg>
              <p class="text-gray-600 text-sm">Aucun document lié à cet agent</p>
              <p class="text-gray-500 text-xs mt-1">Liez des documents pour améliorer les réponses de votre agent</p>
            </div>
            
            <div v-else class="space-y-3">
              <div 
                v-for="doc in linkedKnowledgeBase" 
                :key="doc.id"
                class="flex items-center justify-between p-3 bg-gray-50 rounded-lg"
              >
                <div class="flex items-center space-x-3">
                  <div class="w-8 h-8 bg-blue-100 rounded-lg flex items-center justify-center">
                    <svg class="w-4 h-4 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z"/>
                    </svg>
                  </div>
                  <div>
                    <p class="text-sm font-medium text-gray-900">{{ doc.title }}</p>
                    <p class="text-xs text-gray-500">{{ getContentTypeLabel(doc.contentType) }}</p>
                  </div>
                </div>
                <span :class="[
                  'inline-flex items-center px-2 py-1 rounded-full text-xs font-medium',
                  doc.isActive ? 'bg-green-100 text-green-800' : 'bg-gray-100 text-gray-800'
                ]">
                  {{ doc.isActive ? 'Actif' : 'Inactif' }}
                </span>
              </div>
            </div>
          </div>

          <!-- Configuration commerciale -->
          <div class="bg-white rounded-xl shadow-sm border border-gray-200 p-4 lg:p-6">
            <h3 class="text-base lg:text-lg font-semibold text-gray-900 mb-4 lg:mb-6">💼 Configuration Commerciale</h3>
            
            <div class="space-y-4 lg:space-y-6">
              <!-- Collection d'informations -->
              <div>
                <label class="block text-sm font-medium text-gray-700 mb-3">Informations à collecter</label>
                <div class="grid grid-cols-1 sm:grid-cols-2 gap-2">
                  <label class="flex items-center">
                    <input v-model="localConfig.agent.config.collectName" type="checkbox" class="rounded border-gray-300 text-blue-600 focus:ring-blue-500">
                    <span class="ml-2 text-sm text-gray-700">👤 Nom complet</span>
                  </label>
                  <label class="flex items-center">
                    <input v-model="localConfig.agent.config.collectPhone" type="checkbox" class="rounded border-gray-300 text-blue-600 focus:ring-blue-500">
                    <span class="ml-2 text-sm text-gray-700">📞 Téléphone</span>
                  </label>
                  <label class="flex items-center">
                    <input v-model="localConfig.agent.config.collectEmail" type="checkbox" class="rounded border-gray-300 text-blue-600 focus:ring-blue-500">
                    <span class="ml-2 text-sm text-gray-700">📧 Email</span>
                  </label>
                  <label class="flex items-center">
                    <input v-model="localConfig.agent.config.collectAddress" type="checkbox" class="rounded border-gray-300 text-blue-600 focus:ring-blue-500">
                    <span class="ml-2 text-sm text-gray-700">🏠 Adresse</span>
                  </label>
                </div>
              </div>

              <!-- Fonctionnalités commerciales -->
              <div class="space-y-4">
                <div class="flex items-center justify-between p-3 lg:p-4 bg-gray-50 rounded-lg">
                  <div class="flex-1">
                    <div class="flex items-center">
                      <h4 class="text-sm font-medium text-gray-900">💎 Propositions d'upsell</h4>
                      <span v-if="!isPaidUser" class="ml-2 inline-flex items-center px-2 py-0.5 rounded text-xs font-medium bg-yellow-100 text-yellow-800">
                        Plan Pro
                      </span>
                    </div>
                    <p class="text-xs text-gray-500 mt-1">L'agent propose des produits complémentaires</p>
                    <p v-if="!isPaidUser" class="text-xs text-yellow-600 mt-1">
                      💡 Fonctionnalité avancée réservée au plan Pro
                    </p>
                  </div>
                  <button
                    @click="handleUpsellToggle"
                    :disabled="!isPaidUser"
                    :class="[
                      'relative inline-flex h-6 w-11 flex-shrink-0 cursor-pointer rounded-full border-2 border-transparent transition-colors duration-200 ease-in-out focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2',
                      localConfig.agent.config.upsellEnabled && isPaidUser ? 'bg-blue-600' : 'bg-gray-200',
                      !isPaidUser ? 'cursor-not-allowed opacity-50' : ''
                    ]"
                  >
                    <span
                      :class="[
                        'pointer-events-none inline-block h-5 w-5 transform rounded-full bg-white shadow ring-0 transition duration-200 ease-in-out',
                        localConfig.agent.config.upsellEnabled && isPaidUser ? 'translate-x-5' : 'translate-x-0'
                      ]"
                    ></span>
                  </button>
                </div>

                <div class="flex items-center justify-between p-3 lg:p-4 bg-gray-50 rounded-lg">
                  <div class="flex-1">
                    <div class="flex items-center">
                      <h4 class="text-sm font-medium text-gray-900">⚡ Création d'urgence (FOMO)</h4>
                      <span v-if="!isPaidUser" class="ml-2 inline-flex items-center px-2 py-0.5 rounded text-xs font-medium bg-yellow-100 text-yellow-800">
                        Plan Pro
                      </span>
                    </div>
                    <p class="text-xs text-gray-500 mt-1">Stock limité, offres temporaires</p>
                    <p v-if="!isPaidUser" class="text-xs text-yellow-600 mt-1">
                      💡 Fonctionnalité avancée réservée au plan Pro
                    </p>
                  </div>
                  <button
                    @click="handleUrgencyToggle"
                    :disabled="!isPaidUser"
                    :class="[
                      'relative inline-flex h-6 w-11 flex-shrink-0 cursor-pointer rounded-full border-2 border-transparent transition-colors duration-200 ease-in-out focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2',
                      localConfig.agent.config.urgencyEnabled && isPaidUser ? 'bg-blue-600' : 'bg-gray-200',
                      !isPaidUser ? 'cursor-not-allowed opacity-50' : ''
                    ]"
                  >
                    <span
                      :class="[
                        'pointer-events-none inline-block h-5 w-5 transform rounded-full bg-white shadow ring-0 transition duration-200 ease-in-out',
                        localConfig.agent.config.urgencyEnabled && isPaidUser ? 'translate-x-5' : 'translate-x-0'
                      ]"
                    ></span>
                  </button>
                </div>
              </div>

              <!-- Instructions spécifiques -->
              <div>
                <label class="block text-sm font-medium text-gray-700 mb-2">Instructions spécifiques</label>
                <div class="space-y-2">
                  <div v-for="(instruction, index) in localConfig.agent.config.specificInstructions" :key="index" class="flex items-center space-x-2">
                    <input
                      v-model="localConfig.agent.config.specificInstructions[index]"
                      type="text"
                      class="flex-1 px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 text-sm"
                      placeholder="Ex: Toujours demander le prénom du client"
                    />
                    <button
                      @click="removeInstruction(index)"
                      class="p-2 text-red-600 hover:text-red-800 hover:bg-red-50 rounded"
                    >
                      <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16"/>
                      </svg>
                    </button>
                  </div>
                  <button
                    @click="addInstruction"
                    class="w-full p-2 border-2 border-dashed border-gray-300 rounded-lg text-gray-500 hover:border-blue-300 hover:text-blue-600 transition-colors text-sm"
                  >
                    + Ajouter une instruction
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>

        <!-- Info Panel -->
        <div class="space-y-6">
          <!-- Agent Status -->
          <div class="bg-white rounded-xl shadow-sm border border-gray-200 p-4 lg:p-6">
            <h3 class="text-base lg:text-lg font-semibold text-gray-900 mb-4">📊 Statut du Vendeur IA</h3>
            
            <div class="space-y-3 text-sm">
              <div class="flex justify-between">
                <span class="font-medium">ID:</span>
                <span class="font-mono bg-gray-100 px-2 py-1 rounded text-xs">{{ agentId.substring(0, 8) }}...</span>
              </div>
              <div class="flex justify-between">
                <span class="font-medium">Type:</span>
                <span class="capitalize">{{ getTypeLabel(localConfig.agent.type) }}</span>
              </div>
              <div class="flex justify-between">
                <span class="font-medium">Fournisseur d'IA:</span>
                <span class="capitalize">{{ localConfig.agent.config.aiProvider || 'OpenAI' }}</span>
              </div>
              <div class="flex justify-between">
                <span class="font-medium">Base de connaissances:</span>
                <span class="text-blue-600">{{ linkedKnowledgeBase.length }} docs</span>
              </div>
              <div class="flex justify-between">
                <span class="font-medium">Configuration:</span>
                <span :class="isConfigValid ? 'text-green-600' : 'text-red-600'">
                  {{ isConfigValid ? '✅ Valide' : '❌ Invalide' }}
                </span>
              </div>
              <div class="flex justify-between">
                <span class="font-medium">Statut:</span>
                <span :class="localConfig.agent.isActive ? 'text-green-600' : 'text-red-600'">
                  {{ localConfig.agent.isActive ? '🟢 Actif' : '🔴 Inactif' }}
                </span>
              </div>
            </div>
            
            <!-- Toggle statut -->
            <div class="mt-4 pt-4 border-t border-gray-200">
              <div class="flex items-center justify-between">
                <span class="text-sm font-medium">Vendeur IA actif</span>
                <button
                  @click="localConfig.agent.isActive = !localConfig.agent.isActive"
                  :class="[
                    'relative inline-flex h-6 w-11 flex-shrink-0 cursor-pointer rounded-full border-2 border-transparent transition-colors duration-200 ease-in-out focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2',
                    localConfig.agent.isActive ? 'bg-blue-600' : 'bg-gray-200'
                  ]"
                >
                  <span
                    :class="[
                      'pointer-events-none inline-block h-5 w-5 transform rounded-full bg-white shadow ring-0 transition duration-200 ease-in-out',
                      localConfig.agent.isActive ? 'translate-x-5' : 'translate-x-0'
                    ]"
                  ></span>
                </button>
              </div>
            </div>
          </div>

          <!-- Statistics -->
          <div class="bg-white rounded-xl shadow-sm border border-gray-200 p-4 lg:p-6">
            <h3 class="text-base lg:text-lg font-semibold text-gray-900 mb-4">📈 Statistiques</h3>
            <div class="space-y-3">
              <div class="flex justify-between items-center">
                <span class="text-sm text-gray-600">Conversations</span>
                <span class="text-lg font-bold text-blue-600">{{ localConfig.agent.stats.conversations }}</span>
              </div>
              <div class="flex justify-between items-center">
                <span class="text-sm text-gray-600">Conversions</span>
                <span class="text-lg font-bold text-green-600">{{ localConfig.agent.stats.conversions }}</span>
              </div>
              <div class="flex justify-between items-center">
                <span class="text-sm text-gray-600">Taux de conversion</span>
                <span class="text-lg font-bold text-purple-600">
                  {{ localConfig.agent.stats.conversations > 0 ? Math.round((localConfig.agent.stats.conversions / localConfig.agent.stats.conversations) * 100) : 0 }}%
                </span>
              </div>
            </div>
          </div>

          <!-- Quick Actions -->
          <div class="bg-white rounded-xl shadow-sm border border-gray-200 p-4 lg:p-6">
            <h3 class="text-base lg:text-lg font-semibold text-gray-900 mb-4">⚡ Actions Rapides</h3>
            <div class="space-y-3">
              <button
                @click="activeTab = 'playground'"
                class="w-full px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors text-sm lg:text-base"
              >
                🧪 Tester le Vendeur IA
              </button>
              <button
                @click="activeTab = 'widget'"
                class="w-full px-4 py-2 border border-blue-600 text-blue-600 rounded-lg hover:bg-blue-50 transition-colors text-sm lg:text-base"
              >
                🎨 Configurer Widget
              </button>
              <button
                @click="activeTab = 'integration'"
                class="w-full px-4 py-2 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition-colors text-sm lg:text-base"
              >
                🔗 Code d'Intégration
              </button>
            </div>
          </div>
        </div>
      </div>

      <!-- ✅ ONGLET 2: CONFIGURATION WIDGET -->
      <div v-if="activeTab === 'widget'" class="grid grid-cols-1 xl:grid-cols-3 gap-6 lg:gap-8">
        
        <!-- Configuration Panel -->
        <div class="xl:col-span-2 space-y-6 lg:space-y-8">
          
          <!-- Apparence du Widget -->
          <div class="bg-white rounded-xl shadow-sm border border-gray-200 p-4 lg:p-6">
            <h3 class="text-base lg:text-lg font-semibold text-gray-900 mb-4 lg:mb-6">🎨 Apparence du Widget</h3>
            
            <div class="space-y-4 lg:space-y-6">
              <!-- Texte du bouton -->
              <div>
                <label class="block text-sm font-medium text-gray-700 mb-2">Texte du bouton *</label>
                <input
                  v-model="localConfig.widget.buttonText"
                  @input="updateWidgetPreview"
                  type="text"
                  class="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-colors text-sm lg:text-base"
                  placeholder="Ex: Parler à un conseiller"
                />
              </div>

              <!-- Couleur principale -->
              <div>
                <label class="block text-sm font-medium text-gray-700 mb-2">Couleur principale</label>
                <div class="flex items-center space-x-3">
                  <input
                    v-model="localConfig.widget.primaryColor"
                    @input="updateWidgetPreview"
                    type="color"
                    class="w-12 h-10 border border-gray-300 rounded-lg cursor-pointer"
                  />
                  <input
                    v-model="localConfig.widget.primaryColor"
                    @input="updateWidgetPreview"
                    type="text"
                    class="flex-1 px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 text-sm"
                    placeholder="#3B82F6"
                  />
                  <!-- Couleurs prédéfinies -->
                  <div class="flex space-x-2">
                    <button
                      v-for="color in presetColors"
                      :key="color"
                      @click="selectPresetColor(color)"
                      :style="{ backgroundColor: color }"
                      class="w-8 h-8 rounded-lg border-2 hover:scale-110 transition-transform"
                      :class="localConfig.widget.primaryColor === color ? 'border-gray-900' : 'border-gray-300'"
                      :title="color"
                    ></button>
                  </div>
                </div>
              </div>

              <!-- Position et thème -->
              <div class="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label class="block text-sm font-medium text-gray-700 mb-2">Position du widget</label>
                  <select 
                    v-model="localConfig.widget.position" 
                    @change="updateWidgetPreview"
                    class="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 text-sm lg:text-base"
                  >
                    <option value="above-cta">Au-dessus du bouton d'achat</option>
                    <option value="below-cta">En-dessous du bouton d'achat</option>
                    <option value="beside-cta">À côté du bouton d'achat</option>
                    <option value="bottom-right">Coin en bas à droite</option>
                    <option value="bottom-left">Coin en bas à gauche</option>
                  </select>
                </div>
                
                <div>
                  <label class="block text-sm font-medium text-gray-700 mb-2">Thème</label>
                  <select 
                    v-model="localConfig.widget.theme" 
                    @change="updateWidgetPreview"
                    class="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 text-sm lg:text-base"
                  >
                    <option value="modern">Moderne</option>
                    <option value="minimal">Minimaliste</option>
                    <option value="brand_adaptive">Adaptatif à la marque</option>
                  </select>
                </div>
              </div>

              <!-- Taille et bordures -->
              <div class="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label class="block text-sm font-medium text-gray-700 mb-2">Taille du widget</label>
                  <select 
                    v-model="localConfig.widget.widgetSize" 
                    @change="updateWidgetPreview"
                    class="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 text-sm lg:text-base"
                  >
                    <option value="small">Petit</option>
                    <option value="medium">Moyen</option>
                    <option value="large">Grand</option>
                  </select>
                </div>
                
                <div>
                  <label class="block text-sm font-medium text-gray-700 mb-2">Bordures</label>
                  <select 
                    v-model="localConfig.widget.borderRadius" 
                    @change="updateWidgetPreview"
                    class="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 text-sm lg:text-base"
                  >
                    <option value="none">Aucune</option>
                    <option value="sm">Légères</option>
                    <option value="md">Moyennes</option>
                    <option value="lg">Arrondies</option>
                    <option value="xl">Très arrondies</option>
                  </select>
                </div>
              </div>
            </div>
          </div>

          <!-- Comportement du Widget -->
          <div class="bg-white rounded-xl shadow-sm border border-gray-200 p-4 lg:p-6">
            <h3 class="text-base lg:text-lg font-semibold text-gray-900 mb-4 lg:mb-6">⚙️ Comportement</h3>
            
            <div class="space-y-4">
              <!-- Ouverture automatique -->
              <div class="flex items-center justify-between p-3 lg:p-4 bg-gray-50 rounded-lg">
                <div class="flex-1">
                  <h4 class="text-sm font-medium text-gray-900">Ouverture automatique</h4>
                  <p class="text-xs text-gray-500 mt-1">Le chat s'ouvre automatiquement après quelques secondes</p>
                </div>
                <button
                  @click="toggleAutoOpen"
                  :class="[
                    'relative inline-flex h-6 w-11 flex-shrink-0 cursor-pointer rounded-full border-2 border-transparent transition-colors duration-200 ease-in-out focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2',
                    localConfig.widget.autoOpen ? 'bg-blue-600' : 'bg-gray-200'
                  ]"
                >
                  <span
                    :class="[
                      'pointer-events-none inline-block h-5 w-5 transform rounded-full bg-white shadow ring-0 transition duration-200 ease-in-out',
                      localConfig.widget.autoOpen ? 'translate-x-5' : 'translate-x-0'
                    ]"
                  ></span>
                </button>
              </div>

              <!-- Affichage avatar -->
              <div class="flex items-center justify-between p-3 lg:p-4 bg-gray-50 rounded-lg">
                <div class="flex-1">
                  <h4 class="text-sm font-medium text-gray-900">Afficher l'avatar</h4>
                  <p class="text-xs text-gray-500 mt-1">Avatar du Vendeur IA dans les conversations</p>
                </div>
                <button
                  @click="toggleShowAvatar"
                  :class="[
                    'relative inline-flex h-6 w-11 flex-shrink-0 cursor-pointer rounded-full border-2 border-transparent transition-colors duration-200 ease-in-out focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2',
                    localConfig.widget.showAvatar ? 'bg-blue-600' : 'bg-gray-200'
                  ]"
                >
                  <span
                    :class="[
                      'pointer-events-none inline-block h-5 w-5 transform rounded-full bg-white shadow ring-0 transition duration-200 ease-in-out',
                      localConfig.widget.showAvatar ? 'translate-x-5' : 'translate-x-0'
                    ]"
                  ></span>
                </button>
              </div>

              <!-- Sons activés -->
              <div class="flex items-center justify-between p-3 lg:p-4 bg-gray-50 rounded-lg">
                <div class="flex-1">
                  <h4 class="text-sm font-medium text-gray-900">Sons de notification</h4>
                  <p class="text-xs text-gray-500 mt-1">Sons pour les nouveaux messages</p>
                </div>
                <button
                  @click="toggleSoundEnabled"
                  :class="[
                    'relative inline-flex h-6 w-11 flex-shrink-0 cursor-pointer rounded-full border-2 border-transparent transition-colors duration-200 ease-in-out focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2',
                    localConfig.widget.soundEnabled ? 'bg-blue-600' : 'bg-gray-200'
                  ]"
                >
                  <span
                    :class="[
                      'pointer-events-none inline-block h-5 w-5 transform rounded-full bg-white shadow ring-0 transition duration-200 ease-in-out',
                      localConfig.widget.soundEnabled ? 'translate-x-5' : 'translate-x-0'
                    ]"
                  ></span>
                </button>
              </div>

              <!-- Optimisation mobile -->
              <div class="flex items-center justify-between p-3 lg:p-4 bg-gray-50 rounded-lg">
                <div class="flex-1">
                  <h4 class="text-sm font-medium text-gray-900">Optimisation mobile</h4>
                  <p class="text-xs text-gray-500 mt-1">Interface adaptée aux smartphones</p>
                </div>
                <button
                  @click="toggleMobileOptimized"
                  :class="[
                    'relative inline-flex h-6 w-11 flex-shrink-0 cursor-pointer rounded-full border-2 border-transparent transition-colors duration-200 ease-in-out focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2',
                    localConfig.widget.mobileOptimized ? 'bg-blue-600' : 'bg-gray-200'
                  ]"
                >
                  <span
                    :class="[
                      'pointer-events-none inline-block h-5 w-5 transform rounded-full bg-white shadow ring-0 transition duration-200 ease-in-out',
                      localConfig.widget.mobileOptimized ? 'translate-x-5' : 'translate-x-0'
                    ]"
                  ></span>
                </button>
              </div>
            </div>
          </div>

          <!-- Langues et personnalisation -->
          <div class="bg-white rounded-xl shadow-sm border border-gray-200 p-4 lg:p-6">
            <h3 class="text-base lg:text-lg font-semibold text-gray-900 mb-4 lg:mb-6">🌍 Localisation</h3>
            
            <div class="space-y-4">
              <!-- Langue -->
              <div>
                <label class="block text-sm font-medium text-gray-700 mb-2">Langue du widget</label>
                <select 
                  v-model="localConfig.widget.language" 
                  @change="updateWidgetPreview"
                  class="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 text-sm lg:text-base"
                >
                  <option value="fr">🇫🇷 Français</option>
                  <option value="en">🇺🇸 English</option>
                  <option value="wo">🇸🇳 Wolof</option>
                </select>
              </div>

              <!-- Animation -->
              <div>
                <label class="block text-sm font-medium text-gray-700 mb-2">Animation d'apparition</label>
                <select 
                  v-model="localConfig.widget.animation" 
                  @change="updateWidgetPreview"
                  class="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 text-sm lg:text-base"
                >
                  <option value="fade">Fondu</option>
                  <option value="slide">Glissement</option>
                  <option value="bounce">Rebond</option>
                  <option value="none">Aucune</option>
                </select>
              </div>
            </div>
          </div>
        </div>

        <!-- Preview Panel -->
        <div class="space-y-6">
          <!-- Prévisualisation en temps réel -->
          <div class="bg-white rounded-xl shadow-sm border border-gray-200 p-4 lg:p-6">
            <h3 class="text-base lg:text-lg font-semibold text-gray-900 mb-4">👁️ Prévisualisation</h3>
            
            <div class="space-y-4">
              <!-- Preview du bouton -->
              <div>
                <p class="text-sm text-gray-600 mb-2">Bouton sur votre site :</p>
                <div class="bg-gray-100 p-4 rounded-lg">
                  <button
                    :style="{ 
                      backgroundColor: localConfig.widget.primaryColor,
                      borderRadius: getBorderRadiusValue(localConfig.widget.borderRadius),
                      padding: getWidgetPadding(localConfig.widget.widgetSize),
                      fontSize: getWidgetFontSize(localConfig.widget.widgetSize)
                    }"
                    class="w-full text-white font-semibold transition-all hover:opacity-90 flex items-center justify-center space-x-2"
                  >
                    <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-3.582 8-8 8a8.955 8.955 0 01-4.906-1.479L3 21l2.521-5.094A8.955 8.955 0 013 12c0-4.418 3.582-8 8-8s8 3.582 8 8z"></path>
                    </svg>
                    <span>{{ localConfig.widget.buttonText }}</span>
                  </button>
                </div>
              </div>

              <!-- Preview des couleurs -->
              <div>
                <p class="text-sm text-gray-600 mb-2">Palette de couleurs :</p>
                <div class="flex space-x-2">
                  <div 
                    class="w-8 h-8 rounded-lg border border-gray-300"
                    :style="{ backgroundColor: localConfig.widget.primaryColor }"
                    :title="`Principal: ${localConfig.widget.primaryColor}`"
                  ></div>
                  <div 
                    class="w-8 h-8 rounded-lg border border-gray-300"
                    :style="{ backgroundColor: adjustColor(localConfig.widget.primaryColor, -20) }"
                    :title="`Foncé: ${adjustColor(localConfig.widget.primaryColor, -20)}`"
                  ></div>
                  <div 
                    class="w-8 h-8 rounded-lg border border-gray-300"
                    :style="{ backgroundColor: adjustColor(localConfig.widget.primaryColor, 80) }"
                    :title="`Clair: ${adjustColor(localConfig.widget.primaryColor, 80)}`"
                  ></div>
                </div>
              </div>

              <!-- Preview mobile/desktop -->
              <div>
                <p class="text-sm text-gray-600 mb-2">Responsive :</p>
                <div class="flex items-center space-x-2 text-xs">
                  <div class="flex items-center">
                    <svg class="w-4 h-4 mr-1 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M5 13l4 4L19 7"/>
                    </svg>
                    <span>Desktop</span>
                  </div>
                  <div class="flex items-center">
                    <svg 
                      class="w-4 h-4 mr-1" 
                      :class="localConfig.widget.mobileOptimized ? 'text-green-600' : 'text-gray-400'"
                      fill="none" 
                      stroke="currentColor" 
                      viewBox="0 0 24 24"
                    >
                      <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M5 13l4 4L19 7"/>
                    </svg>
                    <span>Mobile</span>
                  </div>
                </div>
              </div>
            </div>
          </div>

          <!-- Informations techniques -->
          <div class="bg-white rounded-xl shadow-sm border border-gray-200 p-4 lg:p-6">
            <h3 class="text-base lg:text-lg font-semibold text-gray-900 mb-4">🔧 Informations</h3>
            
            <div class="space-y-3 text-sm">
              <div class="flex justify-between">
                <span class="font-medium">Thème:</span>
                <span class="capitalize">{{ localConfig.widget.theme }}</span>
              </div>
              <div class="flex justify-between">
                <span class="font-medium">Position:</span>
                <span class="capitalize">{{ getPositionLabel(localConfig.widget.position) }}</span>
              </div>
              <div class="flex justify-between">
                <span class="font-medium">Taille:</span>
                <span class="capitalize">{{ getWidgetSizeLabel(localConfig.widget.widgetSize) }}</span>
              </div>
              <div class="flex justify-between">
                <span class="font-medium">Agent lié:</span>
                <span class="text-blue-600">{{ localConfig.agent.name }}</span>
              </div>
              <div class="flex justify-between">
                <span class="font-medium">Statut:</span>
                <span :class="localConfig.widget.isActive ? 'text-green-600' : 'text-red-600'">
                  {{ localConfig.widget.isActive ? '🟢 Actif' : '🔴 Inactif' }}
                </span>
              </div>
            </div>
            
            <!-- Toggle statut -->
            <div class="mt-4 pt-4 border-t border-gray-200">
              <div class="flex items-center justify-between">
                <span class="text-sm font-medium">Widget actif</span>
                <button
                  @click="localConfig.widget.isActive = !localConfig.widget.isActive"
                  :class="[
                    'relative inline-flex h-6 w-11 flex-shrink-0 cursor-pointer rounded-full border-2 border-transparent transition-colors duration-200 ease-in-out focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2',
                    localConfig.widget.isActive ? 'bg-blue-600' : 'bg-gray-200'
                  ]"
                >
                  <span
                    :class="[
                      'pointer-events-none inline-block h-5 w-5 transform rounded-full bg-white shadow ring-0 transition duration-200 ease-in-out',
                      localConfig.widget.isActive ? 'translate-x-5' : 'translate-x-0'
                    ]"
                  ></span>
                </button>
              </div>
            </div>
          </div>

          <!-- Actions rapides -->
          <div class="bg-white rounded-xl shadow-sm border border-gray-200 p-4 lg:p-6">
            <h3 class="text-base lg:text-lg font-semibold text-gray-900 mb-4">⚡ Actions</h3>
            <div class="space-y-3">
              <button
                @click="activeTab = 'playground'"
                class="w-full px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors text-sm lg:text-base"
              >
                🧪 Tester le Widget
              </button>
              <button
                @click="resetWidgetToDefaults"
                class="w-full px-4 py-2 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition-colors text-sm lg:text-base"
              >
                🔄 Réinitialiser
              </button>
              <button
                @click="activeTab = 'integration'"
                class="w-full px-4 py-2 border border-blue-600 text-blue-600 rounded-lg hover:bg-blue-50 transition-colors text-sm lg:text-base"
              >
                🔗 Obtenir le code
              </button>
            </div>
          </div>
        </div>
      </div>

      <!-- ✅ ONGLET PLAYGROUND AMÉLIORÉ AVEC VRAIE IA -->
      <div v-if="activeTab === 'playground'" class="grid grid-cols-1 lg:grid-cols-2 gap-6 lg:gap-8">
        
        <!-- Chat Interface -->
        <div class="bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden flex flex-col h-96 lg:h-[600px]">
          <div 
            class="px-4 lg:px-6 py-3 lg:py-4 text-white"
            :style="{ background: `linear-gradient(135deg, ${localConfig.widget.primaryColor} 0%, ${adjustColor(localConfig.widget.primaryColor, -20)} 100%)` }"
          >
            <div class="flex items-center space-x-3">
              <div class="w-8 lg:w-10 h-8 lg:h-10 bg-white bg-opacity-20 rounded-full flex items-center justify-center">
                <span class="text-xs lg:text-sm font-medium">{{ localConfig.agent.name.charAt(0) }}</span>
              </div>
              <div>
                <h4 class="font-medium text-sm lg:text-base">{{ localConfig.agent.name }}</h4>
                <p class="text-xs text-white text-opacity-90 flex items-center">
                  {{ getTypeLabel(localConfig.agent.type) }}
                  <!-- ✅ INDICATEUR IA PROVIDER -->
                  <span class="ml-2 px-2 py-0.5 bg-white bg-opacity-20 rounded text-xs">
                    {{ localConfig.agent.config.aiProvider === 'claude' ? '🧠 Claude' : '🤖 OpenAI' }}
                  </span>
                </p>
              </div>
            </div>
          </div>
          
          <div class="flex-1 p-3 lg:p-4 overflow-y-auto bg-gray-50" ref="chatContainer">
            <div class="space-y-3 lg:space-y-4">
              <div 
                v-for="message in testMessages" 
                :key="message.id"
                class="flex items-start space-x-2"
                :class="message.role === 'user' ? 'flex-row-reverse space-x-reverse' : ''"
              >
                <div 
                  :class="[
                    'w-6 lg:w-8 h-6 lg:h-8 rounded-full flex items-center justify-center text-xs font-medium',
                    message.role === 'user' ? 'bg-gray-500 text-white' : 'text-white'
                  ]"
                  :style="message.role === 'assistant' ? { backgroundColor: localConfig.widget.primaryColor } : {}"
                >
                  {{ message.role === 'user' ? 'V' : localConfig.agent.name.charAt(0) }}
                </div>
                <div 
                  :class="[
                    'max-w-xs p-2 lg:p-3 rounded-lg text-xs lg:text-sm',
                    message.role === 'user' 
                      ? 'bg-gray-500 text-white rounded-tr-sm' 
                      : 'bg-white border border-gray-200 rounded-tl-sm'
                  ]"
                >
                  <div v-if="message.loading" class="flex items-center">
                    <svg class="animate-spin h-3 w-3 mr-2" :class="message.role === 'user' ? 'text-white' : 'text-blue-600'" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15"/>
                    </svg>
                    <span class="text-xs">{{ localConfig.agent.config.aiProvider === 'claude' ? 'Claude' : 'OpenAI' }} réfléchit...</span>
                  </div>
                  <div v-else>
                    {{ message.content }}
                    <!-- ✅ INDICATEUR DE PROVIDER POUR RÉPONSES IA -->
                    <div v-if="message.role === 'assistant' && message.provider" class="text-xs opacity-70 mt-1">
                      {{ message.provider === 'claude' ? '🧠' : '🤖' }} {{ message.responseTime }}ms
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
          
          <div class="p-3 lg:p-4 border-t border-gray-200 bg-white">
            <div class="flex space-x-2">
              <input
                v-model="testMessage"
                @keyup.enter="sendTestMessageReal"
                type="text"
                placeholder="Tapez votre message de test..."
                class="flex-1 px-2 lg:px-3 py-1 lg:py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 text-xs lg:text-sm"
                :disabled="sendingTestMessage"
              />
              <button 
                @click="sendTestMessageReal"
                :disabled="!testMessage.trim() || sendingTestMessage"
                class="px-3 lg:px-4 py-1 lg:py-2 text-white rounded-lg hover:opacity-90 transition-colors disabled:opacity-50 text-xs lg:text-sm"
                :style="{ backgroundColor: localConfig.widget.primaryColor }"
              >
                <svg v-if="!sendingTestMessage" class="w-3 lg:w-4 h-3 lg:h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 19l9 2-9-18-9 18 9-2zm0 0v-8"/>
                </svg>
                <svg v-else class="w-3 lg:w-4 h-3 lg:h-4 animate-spin" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15"/>
                </svg>
              </button>
            </div>
          </div>
        </div>

        <!-- Test Controls AMÉLIORÉS -->
        <div class="space-y-6">
          
          <!-- ✅ NOUVEAU : Status IA -->
          <div class="bg-white rounded-xl shadow-sm border border-gray-200 p-4 lg:p-6">
            <h3 class="text-base lg:text-lg font-semibold text-gray-900 mb-4">🤖 Status IA</h3>
            <div class="space-y-3 text-sm">
              <div class="flex justify-between">
                <span>Provider:</span>
                <span class="font-medium capitalize">
                  {{ localConfig.agent.config.aiProvider === 'claude' ? '🧠 Claude Sonnet' : '🤖 OpenAI GPT-4o-mini' }}
                </span>
              </div>
              <div class="flex justify-between">
                <span>Température:</span>
                <span class="font-medium">{{ localConfig.agent.config.temperature || 0.7 }}</span>
              </div>
              <div class="flex justify-between">
                <span>Max Tokens:</span>
                <span class="font-medium">{{ localConfig.agent.config.maxTokens || 1000 }}</span>
              </div>
              <div class="flex justify-between">
                <span>Base KB:</span>
                <span class="font-medium text-blue-600">{{ linkedKnowledgeBase.length }} docs liés</span>
              </div>
            </div>
          </div>

          <!-- Test Scenarios -->
          <div class="bg-white rounded-xl shadow-sm border border-gray-200 p-4 lg:p-6">
            <h3 class="text-base lg:text-lg font-semibold text-gray-900 mb-4">🎯 Scénarios de Test</h3>
            <div class="space-y-2">
              <button
                v-for="scenario in testScenarios"
                :key="scenario.id"
                @click="runTestScenario(scenario)"
                class="w-full text-left p-3 border border-gray-200 rounded-lg hover:bg-gray-50 transition-colors text-sm"
                :disabled="sendingTestMessage"
              >
                <div class="font-medium">{{ scenario.title }}</div>
                <div class="text-xs text-gray-500">{{ scenario.description }}</div>
              </button>
            </div>
          </div>

          <!-- Performance -->
          <div class="bg-white rounded-xl shadow-sm border border-gray-200 p-4 lg:p-6">
            <h3 class="text-base lg:text-lg font-semibold text-gray-900 mb-4">📊 Performance Test</h3>
            <div class="space-y-3 text-sm">
              <div class="flex justify-between">
                <span>Messages envoyés:</span>
                <span class="font-medium">{{ testMessages.filter(m => m.role === 'user').length }}</span>
              </div>
              <div class="flex justify-between">
                <span>Réponses IA:</span>
                <span class="font-medium">{{ testMessages.filter(m => m.role === 'assistant' && !m.loading).length }}</span>
              </div>
              <div class="flex justify-between">
                <span>Temps moyen:</span>
                <span class="font-medium">{{ averageResponseTime }}ms</span>
              </div>
            </div>
            
            <div class="mt-4">
              <button
                @click="resetTestChat"
                class="w-full px-4 py-2 border border-red-300 text-red-600 rounded-lg hover:bg-red-50 transition-colors text-sm lg:text-base"
              >
                🔄 Réinitialiser
              </button>
            </div>
          </div>
        </div>
      </div>

      <!-- ✅ ONGLET INTÉGRATION CORRIGÉ -->
      <div v-if="activeTab === 'integration'" class="max-w-4xl mx-auto">
        
        <!-- Guide d'intégration -->
        <div class="bg-white rounded-xl shadow-sm border border-gray-200 p-6 lg:p-8">
        <!-- ✅ DEBUG TEMPORAIRE - À SUPPRIMER PLUS TARD -->
          <div class="mb-6 p-4 bg-red-50 border border-red-200 rounded-lg">
            <h4 class="text-sm font-medium text-red-800 mb-2">🔧 Debug Temporaire</h4>
            <button
              @click="debugIntegrationCode"
              class="px-4 py-2 bg-red-600 text-white rounded-lg text-sm hover:bg-red-700 mr-4"
            >
              🔍 Debug Code d'Intégration
            </button>
            <div class="mt-2 text-xs text-red-600">
              <p>Statut: {{ integrationCode.includes('Chargement') ? '⏳ En cours de chargement' : '✅ Code prêt' }}</p>
              <p>Agent ID: {{ agentId }}</p>
              <p>Agent Config: {{ !!agentConfig ? '✅' : '❌' }}</p>
              <p>Store Valid: {{ agentConfigStore.hasValidAgent ? '✅' : '❌' }}</p>
            </div>
          </div>
          <h3 class="text-xl lg:text-2xl font-semibold text-gray-900 mb-4 lg:mb-6">🔗 Guide d'Intégration</h3>
          
          <!-- Informations de base -->
          <div class="bg-blue-50 border border-blue-200 rounded-lg p-4 mb-6 lg:mb-8">
            <div class="flex">
              <div class="flex-shrink-0">
                <svg class="h-5 w-5 text-blue-400" fill="currentColor" viewBox="0 0 20 20">
                  <path fill-rule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7-4a1 1 0 11-2 0 1 1 0 012 0zM9 9a1 1 0 000 2v3a1 1 0 001 1h1a1 1 0 100-2v-3a1 1 0 00-1-1H9z" clip-rule="evenodd"/>
                </svg>
              </div>
              <div class="ml-3">
                <h3 class="text-sm font-medium text-blue-800">Instructions d'installation</h3>
                <div class="mt-2 text-sm text-blue-700">
                  <p>Vendeur IA: <strong>{{ localConfig.agent.name }}</strong> • Widget: <strong>{{ localConfig.widget.buttonText }}</strong></p>
                  <p>Copiez le code ci-dessous et collez-le juste avant la balise <code>&lt;/body&gt;</code> de votre site web.</p>
                </div>
              </div>
            </div>
          </div>

          <!-- ✅ CODE D'INTÉGRATION -->
          <div class="space-y-6 lg:space-y-8">
            
            <!-- Code JavaScript -->
            <div class="border-l-4 border-blue-500 pl-4 lg:pl-6">
              <h4 class="text-base lg:text-lg font-medium text-gray-900 mb-3">1. Code d'intégration JavaScript</h4>
              <div class="relative">
                <div class="bg-gray-900 rounded-lg p-3 lg:p-4 overflow-x-auto max-h-80">
                  <pre class="text-green-400 text-xs lg:text-sm whitespace-pre-wrap"><code>{{ integrationCode }}</code></pre>
                </div>
                
                <button
                  @click="copyIntegrationCodeAction"
                  class="absolute top-3 lg:top-4 right-3 lg:right-4 inline-flex items-center px-2 lg:px-3 py-1 border border-gray-600 text-xs font-medium rounded text-gray-300 bg-gray-800 hover:bg-gray-700 transition-colors"
                >
                  <svg class="w-3 lg:w-4 h-3 lg:h-4 mr-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M8 16H6a2 2 0 01-2-2V6a2 2 0 012-2h8a2 2 0 012 2v2m-6 12h8a2 2 0 002-2v-8a2 2 0 00-2-2h-8a2 2 0 00-2 2v8a2 2 0 002 2z"/>
                  </svg>
                  {{ codeCopied ? 'Copié !' : 'Copier' }}
                </button>
              </div>
            </div>

            <!-- Instructions par plateforme -->
            <div class="border-l-4 border-green-500 pl-4 lg:pl-6">
              <h4 class="text-base lg:text-lg font-medium text-gray-900 mb-3">2. Instructions par plateforme</h4>
              
              <!-- Platform tabs -->
              <div class="flex flex-wrap space-x-1 bg-gray-100 p-1 rounded-lg mb-4">
                <button
                  v-for="platform in platforms"
                  :key="platform.id"
                  @click="activePlatform = platform.id"
                  :class="[
                    'px-2 lg:px-3 py-2 text-xs lg:text-sm font-medium rounded-md transition-colors whitespace-nowrap',
                    activePlatform === platform.id 
                      ? 'bg-white text-gray-900 shadow-sm' 
                      : 'text-gray-500 hover:text-gray-700'
                  ]"
                >
                  {{ platform.icon }} {{ platform.name }}
                </button>
              </div>

              <!-- Platform instructions -->
              <div class="bg-gray-50 rounded-lg p-4">
                <div v-if="activePlatform === 'shopify'">
                  <h5 class="font-medium text-gray-900 mb-2">🟢 Shopify</h5>
                  <ol class="text-sm text-gray-700 space-y-1 list-decimal list-inside">
                    <li>Allez dans votre admin Shopify</li>
                    <li>Thème → Actions → Modifier le code</li>
                    <li>Ouvrez le fichier <code>theme.liquid</code></li>
                    <li>Collez le code juste avant <code>&lt;/body&gt;</code></li>
                    <li>Sauvegardez et testez</li>
                  </ol>
                </div>
                
                <div v-else-if="activePlatform === 'wordpress'">
                  <h5 class="font-medium text-gray-900 mb-2">🔵 WordPress</h5>
                  <ol class="text-sm text-gray-700 space-y-1 list-decimal list-inside">
                    <li>Allez dans votre admin WordPress</li>
                    <li>Apparence → Éditeur de thème</li>
                    <li>Ouvrez le fichier <code>footer.php</code></li>
                    <li>Collez le code juste avant <code>&lt;/body&gt;</code></li>
                    <li>Mettez à jour le fichier</li>
                  </ol>
                </div>
                
                <div v-else-if="activePlatform === 'woocommerce'">
                  <h5 class="font-medium text-gray-900 mb-2">🟠 WooCommerce</h5>
                  <ol class="text-sm text-gray-700 space-y-1 list-decimal list-inside">
                    <li>Même processus que WordPress</li>
                    <li>Ou utilisez un plugin comme "Insert Headers and Footers"</li>
                    <li>Collez le code dans la section "Scripts in Footer"</li>
                    <li>Sauvegardez les paramètres</li>
                  </ol>
                </div>
                
                <div v-else>
                  <h5 class="font-medium text-gray-900 mb-2">🌐 Site personnalisé</h5>
                  <ol class="text-sm text-gray-700 space-y-1 list-decimal list-inside">
                    <li>Ouvrez le fichier HTML de votre page</li>
                    <li>Collez le code juste avant <code>&lt;/body&gt;</code></li>
                    <li>Répétez pour toutes les pages où vous voulez le widget</li>
                    <li>Uploadez les fichiers modifiés</li>
                  </ol>
                </div>
              </div>
            </div>

            <!-- Test et validation -->
            <div class="border-l-4 border-purple-500 pl-4 lg:pl-6">
              <h4 class="text-base lg:text-lg font-medium text-gray-900 mb-3">3. Test et validation</h4>
              <div class="space-y-3 text-sm text-gray-600">
                <p><strong>✅ Vérifications à faire:</strong></p>
                <ul class="list-disc list-inside space-y-1 ml-4">
                  <li>Le bouton "{{ localConfig.widget.buttonText }}" apparaît sur votre page</li>
                  <li>Le chat s'ouvre quand vous cliquez sur le bouton</li>
                  <li>L'agent "{{ localConfig.agent.name }}" répond à vos messages</li>
                  <li>La couleur du widget correspond à {{ localConfig.widget.primaryColor }}</li>
                  <li>Les documents de la base de connaissances sont pris en compte ({{ linkedKnowledgeBase.length }} docs)</li>
                </ul>
              </div>
              
              <div class="bg-yellow-50 border border-yellow-200 rounded-lg p-4 mt-4">
                <p class="text-sm text-yellow-800">
                  💡 <strong>Astuce:</strong> Utilisez un navigateur en mode incognito pour tester comme un vrai visiteur.
                </p>
              </div>
            </div>
          </div>

          <!-- Support -->
          <div class="mt-6 lg:mt-8 p-4 lg:p-6 bg-blue-50 border border-blue-200 rounded-lg">
            <h4 class="font-medium text-blue-900 mb-2">🆘 Besoin d'aide ?</h4>
            <p class="text-sm text-blue-800">
              Notre équipe peut vous aider avec l'intégration. Contactez-nous à 
              <a href="mailto:support@chatseller.app" class="underline font-medium">support@chatseller.app</a>
            </p>
          </div>
        </div>
      </div>

      <!-- ✅ MODAL KNOWLEDGE BASE -->
      <div
        v-if="showKnowledgeBaseModal"
        class="fixed inset-0 z-50 bg-black bg-opacity-50 flex items-center justify-center p-4"
        @click.self="closeKnowledgeBaseModal"
      >
        <div class="bg-white rounded-lg shadow-xl max-w-2xl w-full max-h-[80vh] flex flex-col">
          <div class="p-6 border-b border-gray-200">
            <div class="flex items-center justify-between">
              <h3 class="text-lg font-semibold text-gray-900">📚 Gérer la Base de Connaissances</h3>
              <button @click="closeKnowledgeBaseModal" class="text-gray-400 hover:text-gray-600">
                <svg class="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12"/>
                </svg>
              </button>
            </div>
            <p class="text-sm text-gray-600 mt-2">
              Sélectionnez les documents que votre agent doit utiliser pour répondre aux questions.
            </p>
          </div>
          
          <div class="flex-1 p-6 overflow-y-auto">
            <div v-if="knowledgeBaseLoading" class="text-center py-8">
              <svg class="animate-spin h-8 w-8 text-blue-600 mx-auto mb-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15"/>
              </svg>
              <p class="text-gray-600">Chargement des documents...</p>
            </div>
            
            <div v-else-if="availableKnowledgeBase.length === 0" class="text-center py-8">
              <svg class="w-12 h-12 text-gray-400 mx-auto mb-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z"/>
              </svg>
              <p class="text-gray-600 mb-2">Aucun document disponible</p>
              <p class="text-gray-500 text-sm">
                <a href="/knowledge-base" class="text-blue-600 hover:text-blue-800 underline">
                  Créez d'abord des documents
                </a>
                dans votre base de connaissances
              </p>
            </div>
            
            <div v-else class="space-y-3">
              <div 
                v-for="doc in availableKnowledgeBase" 
                :key="doc.id"
                class="flex items-center space-x-3 p-3 border border-gray-200 rounded-lg hover:bg-gray-50"
              >
                <input
                  v-model="selectedKnowledgeBase"
                  :value="doc.id"
                  type="checkbox"
                  class="h-4 w-4 text-blue-600 border-gray-300 rounded focus:ring-blue-500"
                >
                <div class="flex-1 min-w-0">
                  <p class="text-sm font-medium text-gray-900 truncate">{{ doc.title }}</p>
                  <p class="text-xs text-gray-500">{{ getContentTypeLabel(doc.contentType) }}</p>
                  <div class="flex items-center mt-1 space-x-2">
                    <span v-for="tag in doc.tags.slice(0, 3)" :key="tag" class="inline-flex items-center px-2 py-0.5 rounded text-xs font-medium bg-blue-100 text-blue-800">
                      {{ tag }}
                    </span>
                    <span v-if="doc.tags.length > 3" class="text-xs text-gray-500">+{{ doc.tags.length - 3 }}</span>
                  </div>
                </div>
                <span :class="[
                  'inline-flex items-center px-2 py-1 rounded-full text-xs font-medium',
                  doc.isActive ? 'bg-green-100 text-green-800' : 'bg-gray-100 text-gray-800'
                ]">
                  {{ doc.isActive ? 'Actif' : 'Inactif' }}
                </span>
              </div>
            </div>
          </div>
          
          <div class="p-6 border-t border-gray-200">
            <div class="flex justify-between">
              <p class="text-sm text-gray-600">
                {{ selectedKnowledgeBase.length }} document(s) sélectionné(s)
              </p>
              <div class="flex space-x-3">
                <button
                  @click="closeKnowledgeBaseModal"
                  class="px-4 py-2 border border-gray-300 rounded-lg text-sm font-medium text-gray-700 hover:bg-gray-50"
                >
                  Annuler
                </button>
                <button
                  @click="saveKnowledgeBaseSelection"
                  :disabled="savingKnowledgeBase"
                  class="px-4 py-2 bg-blue-600 text-white rounded-lg text-sm font-medium hover:bg-blue-700 disabled:opacity-50"
                >
                  {{ savingKnowledgeBase ? 'Sauvegarde...' : 'Sauvegarder' }}
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>

      <!-- Message de succès pour copie -->
      <div v-if="codeCopied" class="fixed bottom-4 right-4 bg-green-600 text-white px-4 lg:px-6 py-2 lg:py-3 rounded-lg shadow-lg z-50">
        <div class="flex items-center">
          <svg class="w-4 lg:w-5 h-4 lg:h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M5 13l4 4L19 7"/>
          </svg>
          <span class="text-sm lg:text-base">Code d'intégration copié !</span>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, computed, onMounted, nextTick, watch, readonly } from 'vue'
import { useRouter, useRoute } from 'vue-router'
import { useAuthStore } from '~/stores/auth'
import { useAgentConfigStore } from '~/stores/agentConfig'
import { useAgentConfig } from '~/composables/useAgentConfig'
import { useKnowledgeBase } from '~/composables/useKnowledgeBase'

// ✅ TYPES CORRIGÉS
type AgentType = 'general' | 'product_specialist' | 'support' | 'upsell'
type PersonalityType = 'professional' | 'friendly' | 'expert' | 'casual'
type WidgetPosition = 'above-cta' | 'below-cta' | 'beside-cta' | 'bottom-right' | 'bottom-left'
type WidgetSize = 'small' | 'medium' | 'large'
type WidgetTheme = 'modern' | 'minimal' | 'brand_adaptive'

// ✅ PAGE META
definePageMeta({
  middleware: 'auth',
  layout: 'default'
})

// ✅ COMPOSABLES
const router = useRouter()
const route = useRoute()
const authStore = useAuthStore()
const agentConfigStore = useAgentConfigStore()
const config = useRuntimeConfig() 

const { 
  loading, 
  saving, 
  error, 
  agentConfig, 
  isConfigValid,
  integrationCode,
  widgetSyncStatus,
  fetchAgentConfig,
  saveCompleteConfig,
  linkKnowledgeBaseDocuments,
  testAIMessage,
  copyIntegrationCode,
  clearError
} = useAgentConfig()

const {
  documents: knowledgeBaseDocuments,
  loading: knowledgeBaseLoading,
  fetchDocuments: fetchKnowledgeBaseDocuments
} = useKnowledgeBase()

// ✅ REACTIVE STATE
const activeTab = ref('agent')
const activePlatform = ref('shopify')
const successMessage = ref<string | null>(null)
const codeCopied = ref(false)
const hasValidAgentData = ref(false)

// ✅ NOUVEAU STATE POUR KNOWLEDGE BASE
const showKnowledgeBaseModal = ref(false)
const selectedKnowledgeBase = ref<string[]>([])
const savingKnowledgeBase = ref(false)

// ✅ NOUVEAU STATE POUR WIDGET
const presetColors = ref([
  '#3B82F6', '#10B981', '#F59E0B', '#EF4444', 
  '#8B5CF6', '#06B6D4', '#F97316', '#84CC16'
])

// ✅ ÉTAT POUR PLAN UTILISATEUR
const isPaidUser = computed(() => {
  return authStore.user?.subscription_plan === 'professional' || 
         authStore.user?.subscription_plan === 'enterprise'
})

// ✅ LOCAL CONFIG POUR ÉDITION AVEC TYPES CORRECTS
const localConfig = ref({
  agent: {
    id: '',
    name: '',
    type: 'general' as AgentType,
    personality: 'friendly' as PersonalityType,
    description: '',
    welcomeMessage: '',
    fallbackMessage: '',
    avatar: '',
    isActive: true,
    config: {
      collectName: true,
      collectPhone: true,
      collectEmail: true,
      collectAddress: false,
      collectPayment: true,
      upsellEnabled: false,
      urgencyEnabled: false,
      specificInstructions: [] as string[],
      linkedKnowledgeBase: [] as string[],
      aiProvider: 'openai' as 'openai' | 'claude',
      temperature: 0.7,
      maxTokens: 1000,
      systemPrompt: '' as string,
      tone: 'friendly' as string
    },
    stats: { conversations: 0, conversions: 0 },
    knowledgeBase: [] as any[]
  },
  widget: {
    buttonText: 'Parler à un conseiller',
    primaryColor: '#3B82F6',
    position: 'above-cta' as WidgetPosition,
    widgetSize: 'medium' as WidgetSize,
    theme: 'modern' as WidgetTheme,
    borderRadius: 'md' as const,
    animation: 'fade' as const,
    autoOpen: false,
    showAvatar: true,
    soundEnabled: true,
    mobileOptimized: true,
    isActive: true,
    language: 'fr' as 'fr' | 'en' | 'wo'
  }
})

// ✅ TEST PLAYGROUND STATE AMÉLIORÉ
const testMessage = ref('')
const testMessages = ref<any[]>([])
const sendingTestMessage = ref(false)
const responseTimes = ref<number[]>([])

// ✅ COMPUTED
const agentId = computed(() => {
  if (route.query.id && typeof route.query.id === 'string') {
    return route.query.id
  }
  
  const storeAgent = agentConfigStore.getAgentForConfig()
  if (storeAgent?.id) {
    return storeAgent.id
  }
  
  return 'unknown'
})

const agentName = computed(() => {
  return localConfig.value.agent.name || 'Agent IA'
})

const linkedKnowledgeBase = computed(() => {
  return localConfig.value.agent.knowledgeBase || []
})

const availableKnowledgeBase = computed(() => {
  return knowledgeBaseDocuments.value || []
})

const averageResponseTime = computed(() => {
  if (responseTimes.value.length === 0) return 0
  return Math.round(responseTimes.value.reduce((a, b) => a + b, 0) / responseTimes.value.length)
})

// ✅ DATA
const tabs = [
  { id: 'agent', name: 'Agent', icon: '🤖' },
  { id: 'widget', name: 'Widget', icon: '🎨' },
  { id: 'playground', name: 'Test', icon: '🧪' },
  { id: 'integration', name: 'Intégration', icon: '🔗' }
]

const platforms = [
  { id: 'shopify', name: 'Shopify', icon: '🟢' },
  { id: 'wordpress', name: 'WordPress', icon: '🔵' },
  { id: 'woocommerce', name: 'WooCommerce', icon: '🟠' },
  { id: 'custom', name: 'Personnalisé', icon: '🌐' }
]

const testScenarios = [
  {
    id: 'greeting',
    title: '👋 Premier contact',
    description: 'Test du message d\'accueil',
    message: 'Bonjour'
  },
  {
    id: 'product_info',
    title: '🛍️ Demande d\'information produit',
    description: 'Questions sur un produit',
    message: 'Pouvez-vous me parler de vos produits ?'
  },
  {
    id: 'purchase_intent',
    title: '💳 Intention d\'achat',
    description: 'Client prêt à acheter',
    message: 'Je voudrais commander ce produit'
  },
  {
    id: 'objection',
    title: '❓ Objection prix',
    description: 'Gestion des objections',
    message: 'C\'est trop cher pour moi'
  },
  {
    id: 'support',
    title: '🆘 Demande de support',
    description: 'Question technique',
    message: 'J\'ai un problème avec ma commande'
  }
]

// ✅ METHODS

const goBack = () => {
  agentConfigStore.clearAgentConfig()
  router.push('/vendeurs-ia')
}

const loadAgentData = async () => {
  console.log('🔄 [loadAgentData] Début chargement données agent...')
  
  try {
    loading.value = true
    
    // ✅ ÉTAPE 1: Essayer de récupérer depuis le store en premier
    const storeAgent = agentConfigStore.getAgentForConfig()
    if (storeAgent && agentConfigStore.isDataFresh) {
      console.log('✅ [loadAgentData] Données récupérées depuis store:', storeAgent.name)
      
      // ✅ COPIER LES DONNÉES DU STORE VERS localConfig POUR AFFICHAGE IMMÉDIAT
      localConfig.value.agent = {
        id: storeAgent.id,
        name: storeAgent.name,
        type: storeAgent.type as AgentType,
        personality: storeAgent.personality as PersonalityType || 'friendly',
        description: storeAgent.description || '',
        welcomeMessage: storeAgent.welcomeMessage || '',
        fallbackMessage: storeAgent.fallbackMessage || '',
        avatar: storeAgent.avatar || '',
        isActive: storeAgent.isActive,
        config: {
          ...storeAgent.config,
          specificInstructions: storeAgent.config?.specificInstructions || [],
          linkedKnowledgeBase: storeAgent.config?.linkedKnowledgeBase || [],
          aiProvider: storeAgent.config?.aiProvider || 'openai',
          temperature: storeAgent.config?.temperature || 0.7,
          maxTokens: storeAgent.config?.maxTokens || 1000,
          systemPrompt: storeAgent.config?.systemPrompt || '',
          tone: storeAgent.config?.tone || 'friendly'
        },
        stats: storeAgent.stats || { conversations: 0, conversions: 0 },
        knowledgeBase: storeAgent.knowledgeBase || []
      }
      
      hasValidAgentData.value = true
      
      // ✅ CONTINUER À CHARGER LES DONNÉES API EN ARRIÈRE-PLAN
      if (agentId.value && agentId.value !== 'unknown') {
        console.log('🔄 [loadAgentData] Mise à jour depuis API en arrière-plan...')
        
        fetchAgentConfig(agentId.value).then((result) => {
          if (result.success) {
            console.log('✅ [loadAgentData] Données API mises à jour en arrière-plan')
          }
        }).catch((error) => {
          console.warn('⚠️ [loadAgentData] Erreur mise à jour API (non critique):', error)
        })
      }
      
      return
    }
    
    // ✅ ÉTAPE 2: Si pas de données store, essayer l'API directement
    if (agentId.value && agentId.value !== 'unknown') {
      console.log('🌐 [loadAgentData] Récupération depuis API pour ID:', agentId.value)
      
      try {
        const result = await fetchAgentConfig(agentId.value)
        if (result.success) {
          console.log('✅ [loadAgentData] Données récupérées depuis API')
          hasValidAgentData.value = true
          return
        } else {
          throw new Error(result.error || 'Erreur API')
        }
      } catch (apiError) {
        console.warn('⚠️ [loadAgentData] Erreur API:', apiError)
        throw apiError
      }
    }
    
    // ✅ ÉTAPE 3: Si rien ne fonctionne, afficher une erreur
    console.error('❌ [loadAgentData] Aucune donnée agent disponible')
    hasValidAgentData.value = false
    error.value = 'Impossible de charger les données de l\'agent. Veuillez réessayer.'
    
  } catch (globalError) {
    console.error('❌ [loadAgentData] Erreur globale:', globalError)
    hasValidAgentData.value = false
    error.value = 'Erreur lors du chargement des données de l\'agent'
  } finally {
    loading.value = false
  }
}

// ✅ MÉTHODES WIDGET
const selectPresetColor = (color: string) => {
  localConfig.value.widget.primaryColor = color
  updateWidgetPreview()
}

const toggleAutoOpen = () => {
  localConfig.value.widget.autoOpen = !localConfig.value.widget.autoOpen
  updateWidgetPreview()
}

const toggleShowAvatar = () => {
  localConfig.value.widget.showAvatar = !localConfig.value.widget.showAvatar
  updateWidgetPreview()
}

const toggleSoundEnabled = () => {
  localConfig.value.widget.soundEnabled = !localConfig.value.widget.soundEnabled
  updateWidgetPreview()
}

const toggleMobileOptimized = () => {
  localConfig.value.widget.mobileOptimized = !localConfig.value.widget.mobileOptimized
  updateWidgetPreview()
}

const updateWidgetPreview = () => {
  console.log('🎨 Widget configuration updated:', localConfig.value.widget)
  
  if (widgetSyncStatus.value !== 'syncing') {
    widgetSyncStatus.value = 'syncing'
    
    setTimeout(() => {
      widgetSyncStatus.value = 'synced'
      setTimeout(() => {
        widgetSyncStatus.value = 'idle'
      }, 2000)
    }, 500)
  }
}

const resetWidgetToDefaults = () => {
  if (confirm('Êtes-vous sûr de vouloir réinitialiser la configuration du widget ?')) {
    localConfig.value.widget = {
      buttonText: 'Parler à un conseiller',
      primaryColor: '#3B82F6',
      position: 'above-cta',
      widgetSize: 'medium',
      theme: 'modern',
      borderRadius: 'md',
      animation: 'fade',
      autoOpen: false,
      showAvatar: true,
      soundEnabled: true,
      mobileOptimized: true,
      isActive: true,
      language: 'fr'
    }
    updateWidgetPreview()
    
    successMessage.value = '✅ Configuration du widget réinitialisée !'
    setTimeout(() => {
      successMessage.value = null
    }, 3000)
  }
}

// ✅ HELPER METHODS POUR WIDGET
const getBorderRadiusValue = (radius: string): string => {
  const radiusMap = {
    none: '0px', sm: '4px', md: '8px', lg: '12px', xl: '16px'
  }
  return radiusMap[radius as keyof typeof radiusMap] || '8px'
}

const getWidgetPadding = (size: string): string => {
  const paddingMap = {
    small: '8px 16px', medium: '12px 24px', large: '16px 32px'
  }
  return paddingMap[size as keyof typeof paddingMap] || '12px 24px'
}

const getWidgetFontSize = (size: string): string => {
  const fontSizeMap = {
    small: '13px', medium: '15px', large: '17px'
  }
  return fontSizeMap[size as keyof typeof fontSizeMap] || '15px'
}

const getPositionLabel = (position: string): string => {
  const positionLabels = {
    'above-cta': 'Au-dessus du CTA',
    'below-cta': 'En-dessous du CTA',
    'beside-cta': 'À côté du CTA',
    'bottom-right': 'Coin bas droite',
    'bottom-left': 'Coin bas gauche'
  }
  return positionLabels[position as keyof typeof positionLabels] || position
}

const getWidgetSizeLabel = (size: string): string => {
  const sizeLabels = { small: 'Petit', medium: 'Moyen', large: 'Grand' }
  return sizeLabels[size as keyof typeof sizeLabels] || size
}

// ✅ NOUVELLE MÉTHODE : Gérer les toggles avec restrictions plan
const handleUpsellToggle = () => {
  if (!isPaidUser.value) {
    showUpgradeModal('upsell')
    return
  }
  localConfig.value.agent.config.upsellEnabled = !localConfig.value.agent.config.upsellEnabled
}

const handleUrgencyToggle = () => {
  if (!isPaidUser.value) {
    showUpgradeModal('urgency')
    return
  }
  localConfig.value.agent.config.urgencyEnabled = !localConfig.value.agent.config.urgencyEnabled
}

const showUpgradeModal = (feature: string) => {
  const featureNames = {
    upsell: 'Propositions d\'upsell intelligentes',
    urgency: 'Création d\'urgence (FOMO)'
  }
  
  alert(`🔒 ${featureNames[feature as keyof typeof featureNames]} est une fonctionnalité réservée au plan Pro.\n\nPassez au plan Pro pour débloquer toutes les fonctionnalités avancées de ChatSeller.`)
}

// ✅ NOUVELLE MÉTHODE : Gérer Knowledge Base
const openKnowledgeBaseModal = async () => {
  showKnowledgeBaseModal.value = true
  selectedKnowledgeBase.value = [...(localConfig.value.agent.config.linkedKnowledgeBase || [])]
  
  // Charger les documents disponibles
  await fetchKnowledgeBaseDocuments()
}

const closeKnowledgeBaseModal = () => {
  showKnowledgeBaseModal.value = false
  selectedKnowledgeBase.value = []
}

const saveKnowledgeBaseSelection = async () => {
  savingKnowledgeBase.value = true
  
  try {
    const result = await linkKnowledgeBaseDocuments(agentId.value, selectedKnowledgeBase.value)
    
    if (result.success) {
      // Mettre à jour la config locale
      localConfig.value.agent.config.linkedKnowledgeBase = [...selectedKnowledgeBase.value]
      
      // Recharger la config pour avoir les documents complets
      await fetchAgentConfig(agentId.value)
      
      successMessage.value = '✅ Base de connaissances mise à jour avec succès!'
      closeKnowledgeBaseModal()
      
      setTimeout(() => {
        successMessage.value = null
      }, 3000)
    }
  } catch (error) {
    console.error('❌ Erreur sauvegarde KB:', error)
  } finally {
    savingKnowledgeBase.value = false
  }
}

// ✅ NOUVELLE MÉTHODE : Test IA réel
const sendTestMessageReal = async () => {
  if (!testMessage.value.trim() || sendingTestMessage.value) return

  const messageContent = testMessage.value.trim()
  testMessage.value = ''
  sendingTestMessage.value = true

  // Ajouter message utilisateur
  const userMessage = {
    id: Date.now().toString(),
    role: 'user',
    content: messageContent,
    timestamp: new Date()
  }
  testMessages.value.push(userMessage)

  // Ajouter message de chargement
  const loadingMessage = {
    id: (Date.now() + 1).toString(),
    role: 'assistant',
    content: '',
    timestamp: new Date(),
    loading: true
  }
  testMessages.value.push(loadingMessage)

  const startTime = Date.now()

  try {
    // ✅ APPEL IA RÉEL
    const result = await testAIMessage(messageContent, agentId.value)
    
    const responseTime = Date.now() - startTime
    responseTimes.value.push(responseTime)

    if (result.success) {
      // Remplacer le message de chargement
      const messageIndex = testMessages.value.findIndex(m => m.loading)
      if (messageIndex !== -1) {
        testMessages.value[messageIndex] = {
          id: Date.now().toString(),
          role: 'assistant',
          content: result.message,
          timestamp: new Date(),
          provider: result.provider,
          responseTime: responseTime
        }
      }
    } else {
      throw new Error(result.error || 'Erreur lors du test IA')
    }

  } catch (error: any) {
    console.error('❌ Erreur test IA:', error)
    
    // Remplacer par message d'erreur
    const messageIndex = testMessages.value.findIndex(m => m.loading)
    if (messageIndex !== -1) {
      testMessages.value[messageIndex] = {
        id: Date.now().toString(),
        role: 'assistant',
        content: `Erreur: ${error.message}. Vérifiez la configuration de votre agent.`,
        timestamp: new Date()
      }
    }
  } finally {
    sendingTestMessage.value = false
    await nextTick()
    scrollChatToBottom()
  }
}

const runTestScenario = (scenario: any) => {
  testMessage.value = scenario.message
  sendTestMessageReal()
}

const resetTestChat = () => {
  testMessages.value = []
  responseTimes.value = []
  
  // Ajouter message d'accueil
  if (localConfig.value.agent.welcomeMessage) {
    testMessages.value.push({
      id: Date.now().toString(),
      role: 'assistant',
      content: localConfig.value.agent.welcomeMessage,
      timestamp: new Date()
    })
  }
}

const saveAllConfig = async () => {
  const result = await saveCompleteConfig(agentId.value, {
    agent: localConfig.value.agent,
    widget: localConfig.value.widget
  })

  if (result.success) {
    successMessage.value = '✅ Configuration sauvegardée et synchronisée avec succès !'
    setTimeout(() => {
      successMessage.value = null
    }, 3000)
  }
}

// ✅ MÉTHODE POUR COPIER LE CODE D'INTÉGRATION
const copyIntegrationCodeAction = async () => {
  try {
    if (!integrationCode.value) {
      throw new Error('Code d\'intégration non disponible')
    }

    await navigator.clipboard.writeText(integrationCode.value)
    codeCopied.value = true
    
    successMessage.value = '✅ Code d\'intégration copié dans le presse-papiers !'
    
    setTimeout(() => {
      codeCopied.value = false
      successMessage.value = null
    }, 3000)
    
  } catch (err: any) {
    console.error('❌ Erreur copie:', err)
    error.value = 'Impossible de copier le code d\'intégration'
    setTimeout(() => {
      clearError()
    }, 3000)
  }
}

// ✅ FONCTION DEBUG TEMPORAIRE
const debugIntegrationCode = () => {
  console.log('🔍 [DEBUG] Analyse de l\'état des données pour le code d\'intégration:')
  console.log('════════════════════════════════════════════════════════════════')
  
  // Vérifier agentConfig depuis le composable
  console.log('1. agentConfig.value:', agentConfig.value)
  console.log('   - Existe:', !!agentConfig.value)
  console.log('   - Agent ID:', agentConfig.value?.agent?.id)
  console.log('   - Agent Name:', agentConfig.value?.agent?.name)
  
  // Vérifier localConfig
  console.log('2. localConfig.value:', localConfig.value)
  console.log('   - Agent ID:', localConfig.value.agent.id)
  console.log('   - Agent Name:', localConfig.value.agent.name)
  
  // Vérifier agentConfigStore
  console.log('3. agentConfigStore:')
  console.log('   - hasValidAgent:', agentConfigStore.hasValidAgent)
  console.log('   - isDataFresh:', agentConfigStore.isDataFresh)
  const storeAgent = agentConfigStore.getAgentForConfig()
  console.log('   - Store Agent:', storeAgent)
  
  // Vérifier authStore
  console.log('4. authStore:')
  console.log('   - User ID:', authStore.user?.id)
  console.log('   - User Shop ID:', authStore.userShopId)
  console.log('   - Token exists:', !!authStore.token)
  
  // Vérifier l'état du computed integrationCode
  console.log('5. integrationCode:')
  console.log('   - Value preview:', integrationCode.value.substring(0, 100) + '...')
  console.log('   - Is loading?:', integrationCode.value.includes('Chargement'))
  
  console.log('════════════════════════════════════════════════════════════════')
}

// ✅ HELPER METHODS
const getTypeLabel = (type: string): string => {
  const labels = {
    general: 'Vendeur généraliste',
    product_specialist: 'Spécialiste produit', 
    support: 'Support & SAV',
    upsell: 'Upsell & Cross-sell'
  }
  return labels[type as keyof typeof labels] || type
}

const getContentTypeLabel = (type: string): string => {
  const labels = {
    manual: '📝 Manuel',
    file: '📄 Fichier',
    url: '🔗 URL',
    website: '🌐 Site web'
  }
  return labels[type as keyof typeof labels] || type
}

const adjustColor = (color: string, percent: number): string => {
  const hex = color.replace('#', '')
  const r = parseInt(hex.substr(0, 2), 16)
  const g = parseInt(hex.substr(2, 2), 16)
  const b = parseInt(hex.substr(4, 2), 16)
  
  const adjust = (channel: number) => {
    const adjusted = channel + (channel * percent / 100)
    return Math.max(0, Math.min(255, Math.round(adjusted)))
  }
  
  return `rgb(${adjust(r)}, ${adjust(g)}, ${adjust(b)})`
}

const addInstruction = () => {
  localConfig.value.agent.config.specificInstructions.push('')
}

const removeInstruction = (index: number) => {
  localConfig.value.agent.config.specificInstructions.splice(index, 1)
}

const scrollChatToBottom = () => {
  const container = document.querySelector('.overflow-y-auto')
  if (container) {
    container.scrollTop = container.scrollHeight
  }
}

// ✅ WATCH
watch(() => agentConfig.value, (newConfig) => {
  if (newConfig && newConfig.agent && newConfig.agent.id) {
    console.log('🔄 [watcher] Mise à jour localConfig avec données API')
    
    localConfig.value = {
      agent: { 
        ...newConfig.agent,
        config: {
          ...newConfig.agent.config,
          specificInstructions: newConfig.agent.config.specificInstructions || [],
          linkedKnowledgeBase: newConfig.agent.config.linkedKnowledgeBase || [],
          aiProvider: newConfig.agent.config.aiProvider || 'openai',
          temperature: newConfig.agent.config.temperature || 0.7,
          maxTokens: newConfig.agent.config.maxTokens || 1000,
          systemPrompt: newConfig.agent.config.systemPrompt || '',
          tone: newConfig.agent.config.tone || 'friendly'
        }
      },
      widget: { ...newConfig.widget }
    }
    
    hasValidAgentData.value = true
    console.log('✅ [watcher] localConfig mis à jour, code d\'intégration disponible')
  }
}, { immediate: true, deep: true })

// ✅ WATCHER POUR DÉTECTER LES CHANGEMENTS DU CODE D'INTÉGRATION
watch(() => integrationCode.value, (newCode, oldCode) => {
  console.log('🔄 [WATCH] Code d\'intégration changé:')
  console.log('   - Contient "Chargement"?:', newCode?.includes('Chargement'))
  console.log('   - Longueur:', newCode?.length || 0)
  if (newCode && !newCode.includes('Chargement')) {
    console.log('✅ [WATCH] Code d\'intégration prêt !')
  }
}, { immediate: true })

// ✅ NOUVEAU WATCHER POUR WIDGET
watch(() => localConfig.value.widget, (newWidget) => {
  updateWidgetPreview()
}, { deep: true })

// ✅ LIFECYCLE
onMounted(async () => {
  // ✅ DEBUG TEMPORAIRE - Variables d'environnement
  console.log('🔧 [DEBUG] Variables d\'environnement:')
  console.log('  - NODE_ENV:', process.env.NODE_ENV)
  console.log('  - API URL:', config.public.apiBaseUrl)
  console.log('  - Widget URL:', config.public.widgetUrl)
  console.log('  - App URL:', config.public.appUrl)
  console.log('  - Environment:', config.public.environment)

  console.log('🚀 [agent-config] Page montée, chargement config agent...')
  
  // Initialiser le chat de test
  resetTestChat()
  
  // Charger les données de manière sécurisée
  await loadAgentData()
  
  // Charger les documents de base de connaissances
  await fetchKnowledgeBaseDocuments()
})

// ✅ SEO
useHead({
  title: computed(() => `${agentName.value} - Configuration - ChatSeller`)
})
</script>

<style scoped>
@keyframes spin {
  from { transform: rotate(0deg); }
  to { transform: rotate(360deg); }
}

.animate-spin {
  animation: spin 1s linear infinite;
}

/* Scrollbar personnalisé pour le chat */
.overflow-y-auto::-webkit-scrollbar {
  width: 6px;
}

.overflow-y-auto::-webkit-scrollbar-track {
  background: #f1f5f9;
  border-radius: 3px;
}

.overflow-y-auto::-webkit-scrollbar-thumb {
  background: #cbd5e0;
  border-radius: 3px;
}

.overflow-y-auto::-webkit-scrollbar-thumb:hover {
  background: #9ca3af;
}

/* Animation pour les messages */
.space-y-4 > * {
  animation: slideInMessage 0.3s ease-out;
}

@keyframes slideInMessage {
  from {
    opacity: 0;
    transform: translateY(10px);
  }
  to {
    opacity: 1;
    transform: translateY(0);
  }
}

/* Responsive improvements */
@media (max-width: 640px) {
  .bg-white {
    @apply rounded-lg;
  }
  
  .p-4 {
    @apply p-3;
  }
  
  .text-base {
    @apply text-sm;
  }
  
  .grid-cols-2 {
    @apply grid-cols-1;
  }
}

@media (max-width: 768px) {
  .xl\:col-span-2 {
    @apply col-span-1;
  }
  
  .lg\:grid-cols-2 {
    @apply grid-cols-1;
  }
  
  .space-y-8 {
    @apply space-y-6;
  }
}
</style>