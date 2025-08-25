<!-- pages/agent-config.vue -->
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
                <span v-if="hasUnsavedChanges" class="ml-2 inline-flex items-center text-orange-600">
                  <svg class="w-4 h-4 mr-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z"/>
                  </svg>
                  Sauvegarde dans 2min
                </span>

                <span v-if="lastAutoSave" class="ml-2 inline-flex items-center text-green-600 text-xs">
                  Sauvé auto: {{ formatTime(lastAutoSave) }}
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
      
      <div v-if="displayError" class="p-3 lg:p-4 bg-red-50 border border-red-200 rounded-lg">
        <div class="flex items-center justify-between">
          <div class="flex items-center">
            <svg class="w-5 h-5 text-red-400 mr-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"/>
            </svg>
            <p class="text-red-700 text-sm">{{ displayError }}</p>
          </div>
          <button @click="clearLocalError" class="text-red-400 hover:text-red-600">
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
            <!-- ✅ NOUVEAU : Nom ET Titre côte à côte -->
            <div class="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label class="block text-sm font-medium text-gray-700 mb-2">Nom du Vendeur IA *</label>
                <input
                  v-model="localConfig.agent.name"
                  @input="handleConfigChange"
                  type="text"
                  class="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-colors text-sm lg:text-base"
                  placeholder="Ex: Sarah, Marc, Lisa, Sophie..."
                />
                <p class="text-xs text-gray-500 mt-1">
                  Ce nom apparaîtra dans les conversations
                </p>
              </div>
              
              <div>
                <label class="block text-sm font-medium text-gray-700 mb-2">Titre/Fonction *</label>
                <input
                  v-model="localConfig.agent.title"
                  @input="handleConfigChange"
                  type="text"
                  class="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-colors text-sm lg:text-base"
                  placeholder="Ex: Conseillère produit, Vendeur expert..."
                />
                <p class="text-xs text-gray-500 mt-1">
                  Affiché sous le nom dans le chat
                </p>
              </div>
            </div>

            <!-- ✅ OPTIMISÉ : Avatar du Vendeur IA avec prévisualisation améliorée -->
            <div>
              <label class="block text-sm font-medium text-gray-700 mb-2">Avatar du Vendeur IA</label>
              <div class="flex items-center space-x-4">
                <!-- Prévisualisation de l'avatar -->
                <div class="w-16 h-16 rounded-full overflow-hidden border-2 border-gray-300 bg-gray-100 flex items-center justify-center">
                  <img
                    v-if="localConfig.agent.avatar"
                    :src="localConfig.agent.avatar"
                    :alt="localConfig.agent.name"
                    class="w-full h-full object-cover"
                    @error="handleAvatarError"
                  />
                  <div v-else class="text-gray-400 text-xs text-center">
                    {{ localConfig.agent.name ? localConfig.agent.name.charAt(0).toUpperCase() : '?' }}
                  </div>
                </div>
                
                <!-- Options d'avatar -->
                <div class="flex-1 space-y-3">
                  <div>
                    <input
                      v-model="localConfig.agent.avatar"
                      @input="handleConfigChange"
                      type="url"
                      class="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-colors text-sm"
                      placeholder="https://example.com/avatar.jpg (optionnel)"
                    />
                    <p class="text-xs text-gray-500 mt-1">
                      URL d'image pour l'avatar personnalisé
                    </p>
                  </div>
                  
                  <!-- ✅ CORRECTION : Upload d'image avec ref correcte -->
                  <div class="flex items-center space-x-2">
                    <input
                      ref="avatarUploadRef"
                      type="file"
                      accept="image/*"
                      @change="handleAvatarUpload"
                      class="hidden"
                    />
                    <button
                      @click="triggerAvatarUpload"
                      type="button"
                      class="px-3 py-2 bg-blue-100 text-blue-700 rounded-lg hover:bg-blue-200 transition-colors text-sm font-medium"
                    >
                      📁 Choisir une image
                    </button>
                    <button
                      @click="generateAvatar"
                      type="button"
                      class="px-3 py-2 bg-gray-100 text-gray-600 rounded-lg hover:bg-gray-200 transition-colors text-sm font-medium"
                    >
                      🎨 Générer
                    </button>
                  </div>
                </div>
              </div>
            </div>

            <!-- Type + Personnalité (optimisé) -->
            <div class="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label class="block text-sm font-medium text-gray-700 mb-2">Type de vendeur</label>
                <select v-model="localConfig.agent.type" @change="handleConfigChange" class="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 text-sm lg:text-base">
                  <option value="general">🎯 Vendeur généraliste</option>
                  <option value="product_specialist">🛍️ Spécialiste produit</option>
                  <option value="support">🆘 Support & SAV</option>
                  <option value="upsell">💎 Upsell Premium</option>
                </select>
              </div>
              
              <div>
                <label class="block text-sm font-medium text-gray-700 mb-2">Personnalité</label>
                <select v-model="localConfig.agent.personality" @change="handleConfigChange" class="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 text-sm lg:text-base">
                  <option value="professional">💼 Professionnel</option>
                  <option value="friendly">😊 Amical</option>
                  <option value="expert">🎓 Expert technique</option>
                  <option value="casual">😎 Décontracté</option>
                </select>
              </div>
            </div>

            <!-- ✅ NOUVEAU : Type de produit avec champ personnalisé -->
            <div>
              <label class="block text-sm font-medium text-gray-700 mb-2">
                Type de produit proposé
                <span class="ml-1 text-xs text-gray-500">(pour personnaliser les réponses)</span>
              </label>
              <div class="space-y-3">
                <select 
                  v-model="localConfig.agent.productType" 
                  @change="handleProductTypeChange"
                  class="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 text-sm lg:text-base"
                >
                  <option 
                    v-for="option in getProductTypeOptions()" 
                    :key="option.value" 
                    :value="option.value"
                  >
                    {{ option.label }}
                  </option>
                </select>
                
                <!-- ✅ Champ personnalisé quand "Autre produit" est sélectionné -->
                <div v-if="localConfig.agent.productType === 'produit'" class="space-y-2">
                  <input
                    v-model="localConfig.agent.customProductType"
                    @input="handleConfigChange"
                    type="text"
                    class="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 text-sm"
                    placeholder="Ex: bijou, meuble, cosmétique, jeu..."
                  />
                  <p class="text-xs text-gray-500">
                    Spécifiez le type de produit exact (ex: "jeu" au lieu de "produit")
                  </p>
                </div>
                
                <p class="text-xs text-gray-500">
                  {{ getProductTypeOptions().find(opt => opt.value === localConfig.agent.productType)?.description || 'Sélectionnez le type de produit' }}
                </p>
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
                    @change="handleConfigChange"
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
                    @change="handleConfigChange"
                    class="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 text-sm lg:text-base disabled:bg-gray-100 disabled:text-gray-500"
                  >
                    <option :value="0.3">🎯 Précis (0.3)</option>
                    <option :value="0.7">⚖️ Équilibré (0.7)</option>
                    <option :value="1.0">🎨 Créatif (1.0)</option>
                  </select>
                </div>
              </div>
              <p v-if="!isPaidUser" class="text-xs text-yellow-600 mt-1">
                💡 Passez au plan Pro pour accéder à Claude Sonnet et aux paramètres avancés
              </p>
            </div>

            <!-- ✅ Message d'accueil avec variables dynamiques AMÉLIORÉ -->
            <div class="space-y-4">
              <label class="block text-sm font-medium text-gray-700">
                Message d'accueil personnalisé *
                <span class="text-gray-500 font-normal ml-2">(Avec variables dynamiques)</span>
              </label>
              
              <!-- Variables disponibles avec boutons -->
              <div class="bg-blue-50 p-4 rounded-lg text-sm">
                <p class="font-medium text-blue-800 mb-3">🔧 Variables disponibles :</p>
                <div class="grid grid-cols-2 md:grid-cols-3 gap-2">
                  <button
                    v-for="variable in availableVariables"
                    :key="variable.name"
                    @click="insertVariable(variable.name)"
                    type="button"
                    class="px-2 py-1 bg-white text-blue-700 rounded border hover:bg-blue-50 transition-colors text-xs"
                  >
                    {{ variable.display }}
                  </button>
                </div>
                <div class="mt-3 flex space-x-2">
                  <button 
                    @click="resetToDefaultTemplate"
                    type="button"
                    class="text-xs text-blue-600 hover:text-blue-800 underline"
                  >
                    🔄 Template par défaut
                  </button>
                  <button 
                    @click="testWelcomeMessagePreview"
                    type="button"
                    class="text-xs bg-green-100 text-green-700 px-2 py-1 rounded hover:bg-green-200"
                  >
                    🧪 Tester le message réel
                  </button>
                </div>
              </div>
              
              <!-- ✅ CORRECTION : Champ de saisie avec ref correcte -->
              <div>
                <textarea 
                  ref="welcomeMessageInputRef"
                  v-model="localConfig.agent.welcomeMessage"
                  @input="handleConfigChange"
                  placeholder="Tapez votre message d'accueil avec des variables..."
                  class="w-full p-3 border rounded-lg font-mono text-sm"
                  rows="4"
                />
              </div>
              
              <!-- Aperçu en temps réel -->
              <div class="bg-gray-50 p-4 rounded-lg border">
                <div class="flex items-center justify-between mb-2">
                  <p class="text-xs font-medium text-gray-600">📋 Aperçu en temps réel :</p>
                </div>
                <div 
                  class="text-sm p-3 bg-white rounded border min-h-[60px]" 
                  v-html="previewWelcomeMessage || '<em class=&quot;text-gray-400&quot;>Votre aperçu apparaîtra ici...</em>'"
                />
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
                    <input v-model="localConfig.agent.config.collectName" @input="handleConfigChange" type="checkbox" class="rounded border-gray-300 text-blue-600 focus:ring-blue-500">
                    <span class="ml-2 text-sm text-gray-700">👤 Nom complet</span>
                  </label>
                  <label class="flex items-center">
                    <input v-model="localConfig.agent.config.collectPhone" @input="handleConfigChange" type="checkbox" class="rounded border-gray-300 text-blue-600 focus:ring-blue-500">
                    <span class="ml-2 text-sm text-gray-700">📞 Téléphone</span>
                  </label>
                  <label class="flex items-center">
                    <input v-model="localConfig.agent.config.collectEmail" @input="handleConfigChange" type="checkbox" class="rounded border-gray-300 text-blue-600 focus:ring-blue-500">
                    <span class="ml-2 text-sm text-gray-700">📧 Email</span>
                  </label>
                  <label class="flex items-center">
                    <input v-model="localConfig.agent.config.collectAddress" @input="handleConfigChange" type="checkbox" class="rounded border-gray-300 text-blue-600 focus:ring-blue-500">
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
                <div 
                  v-for="(instruction, index) in (localConfig.agent.config.specificInstructions || [])" 
                  :key="index" 
                  class="flex items-center space-x-2"
                >
                  <input
                    v-model="localConfig.agent.config.specificInstructions[index]"
                    @input="handleConfigChange"
                    type="text"
                    class="flex-1 px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 text-sm"
                    placeholder="Ex: Toujours demander le prénom du client"
                  />
                  <button
                    @click="removeInstruction(index)"
                    type="button"
                    class="p-2 text-red-600 hover:text-red-800 hover:bg-red-50 rounded"
                    title="Supprimer cette instruction"
                  >
                    <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16"/>
                    </svg>
                  </button>
                </div>
                <button
                  @click="addInstruction"
                  type="button"
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
                <span class="font-medium">Titre:</span>
                <span class="text-blue-600">{{ localConfig.agent.title || getTypeLabel(localConfig.agent.type) }}</span>
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
                  @click="localConfig.agent.isActive = !localConfig.agent.isActive; handleConfigChange()"
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
                      type="button"
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
                    <option value="full">Très arrondies</option>
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
                  @click="handleToggleAndChange(() => localConfig.widget.autoOpen = !localConfig.widget.autoOpen)"
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
                  @click="handleToggleAndChange(() => localConfig.widget.showAvatar = !localConfig.widget.showAvatar)"
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
                  @click="handleToggleAndChange(() => localConfig.widget.soundEnabled = !localConfig.widget.soundEnabled)"
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
                  @click="handleToggleAndChange(() => localConfig.widget.mobileOptimized = !localConfig.widget.mobileOptimized)"
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
                  @click="localConfig.widget.isActive = !localConfig.widget.isActive; handleConfigChange()"
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
              {{ localConfig.agent.title || getTypeLabel(localConfig.agent.type) }}
              <span class="ml-2 px-2 py-0.5 bg-white bg-opacity-20 rounded text-xs">
                {{ localConfig.agent.config.aiProvider === 'claude' ? '🧠 Claude' : '🤖 OpenAI' }}
              </span>
            </p>
          </div>
        </div>
      </div>
      
      <div class="flex-1 p-3 lg:p-4 overflow-y-auto bg-gray-50" ref="chatContainerRef">
        <div class="space-y-3 lg:space-y-4">
          <div 
            v-for="message in testMessages" 
            :key="message.id"
            class="flex items-start space-x-2"
            :class="message.role === 'user' ? 'flex-row-reverse space-x-reverse' : ''"
          >
            <div 
              :class="[
                'w-6 lg:w-8 h-6 lg:h-8 rounded-full flex items-center justify-center text-xs font-medium flex-shrink-0',
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
                <span class="text-xs text-gray-500 mr-2">{{ agentName }} est en train d'écrire...</span>
              </div>
              <!-- ✅ CORRECTION PRINCIPALE : Utiliser v-html avec formatage -->
              <div v-else>
                <div 
                  v-if="message.role === 'assistant'"
                  class="message-formatted leading-relaxed"
                  v-html="formatMessage(message.content)"
                ></div>
                <div v-else>
                  {{ message.content }}
                </div>
                <!-- ✅ INDICATEUR DE PROVIDER POUR RÉPONSES IA -->
                <div v-if="message.role === 'assistant' && message.provider" class="text-xs opacity-70 mt-1">
                  {{ message.provider === 'claude' ? '🧠' : '🤖' }} {{ message.responseTime }}ms
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
      
      <!-- Input reste identique -->
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
                type="button"
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
                type="button"
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
                  type="button"
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
                  type="button"
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
// ✅ IMPORTS CORRIGÉS AVEC TYPES DU COMPOSABLE
import { ref, computed, onMounted, nextTick, watch } from 'vue'
import { useRouter, useRoute } from 'vue-router'
import { useAuthStore } from '~/stores/auth'
import { useAgentConfigStore } from '~/stores/agentConfig'
import { useKnowledgeBase } from '~/composables/useKnowledgeBase'
import { useAgentConfig } from '~~/composables/useAgentConfig'

// ✅ TYPES SIMPLIFIÉS COMPATIBLES AVEC LE COMPOSABLE
type AgentType = 'general' | 'product_specialist' | 'support' | 'upsell'
type PersonalityType = 'professional' | 'friendly' | 'expert' | 'casual'
type ProductType = 'auto' | 'jeu' | 'livre' | 'formation' | 'smartphone' | 'ordinateur' | 'vêtement' | 'service' | 'bijou' | 'produit'

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

// ✅ COMPOSABLE CORRIGÉ AVEC DESTRUCTURATION COMPLÈTE
const { 
  loading: composableLoading,
  saving, 
  error, 
  agentConfig, 
  isConfigValid,
  integrationCode,
  widgetSyncStatus,
  hasUnsavedChanges,
  lastAutoSave,
  getProductTypeOptions,
  getTypeLabel,
  formatTime,
  fetchAgentConfig,
  saveCompleteConfig,
  linkKnowledgeBaseDocuments,
  testAIMessage,
  copyIntegrationCode,
  triggerAutoSave,
  clearError,
  previewWelcomeMessage,
  getDefaultWelcomeTemplate,
  testWelcomeMessage
} = useAgentConfig()

// Local reactive state for loading
const loading = ref(false)

// ✅ KNOWLEDGE BASE COMPOSABLE
const {
  documents: knowledgeBaseDocuments,
  loading: knowledgeBaseLoading,
  fetchDocuments: fetchKnowledgeBaseDocuments
} = useKnowledgeBase()

// ✅ REACTIVE STATE - TOUS LES REFS CORRIGÉS
const activeTab = ref<string>('agent')
const activePlatform = ref<string>('shopify')
const successMessage = ref<string | null>(null)
const codeCopied = ref<boolean>(false)
const hasValidAgentData = ref<boolean>(false)

// ✅ LOCAL ERROR STATE POUR ÉVITER READONLY
const localError = ref<string | null>(null)

// ✅ NOUVEAU STATE POUR KNOWLEDGE BASE
const showKnowledgeBaseModal = ref<boolean>(false)
const selectedKnowledgeBase = ref<string[]>([])
const savingKnowledgeBase = ref<boolean>(false)

// ✅ NOUVEAU STATE POUR WIDGET
const presetColors = ref<string[]>([
  '#3B82F6', '#10B981', '#F59E0B', '#EF4444', 
  '#8B5CF6', '#06B6D4', '#F97316', '#84CC16'
])

// ✅ CORRECTION MAJEURE : Refs HTML avec noms corrects
const avatarUploadRef = ref<HTMLInputElement>()
const welcomeMessageInputRef = ref<HTMLTextAreaElement>()
const chatContainerRef = ref<HTMLElement>()

// ✅ ÉTAT POUR PLAN UTILISATEUR
const isPaidUser = computed(() => {
  return authStore.user?.subscription_plan === 'professional' || 
         authStore.user?.subscription_plan === 'enterprise'
})

// ✅ LOCAL CONFIG UTILISANT LES TYPES DU COMPOSABLE - CORRECTION MAJEURE
const localConfig = ref({
  agent: {
    id: '',
    name: '',
    title: '',
    type: 'general' as AgentType,
    personality: 'friendly' as PersonalityType,
    productType: 'auto' as ProductType,
    customProductType: '', // ✅ NOUVEAU : Type de produit personnalisé
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
      systemPrompt: '',
      tone: 'friendly'
    },
    stats: { conversations: 0, conversions: 0 },
    knowledgeBase: [] as Array<{
      id: string
      title: string
      contentType: string
      isActive: boolean
      tags: string[]
    }>
  },
  widget: {
    buttonText: 'Parler à la vendueuse',
    primaryColor: '#3B82F6',
    position: 'above-cta' as 'above-cta' | 'below-cta' | 'beside-cta' | 'bottom-right' | 'bottom-left',
    widgetSize: 'medium' as 'small' | 'medium' | 'large',
    theme: 'modern' as 'modern' | 'minimal' | 'brand_adaptive',
    borderRadius: 'lg' as 'none' | 'sm' | 'md' | 'lg' | 'full', // ✅ CORRECTION : 'xl' supprimé
    animation: 'fade' as 'fade' | 'slide' | 'bounce' | 'none',
    autoOpen: false,
    showAvatar: true,
    soundEnabled: true,
    mobileOptimized: true,
    isActive: true,
    language: 'fr' as 'fr' | 'en' | 'wo'
  }
})

// ✅ TEST PLAYGROUND STATE AMÉLIORÉ - TYPES CORRECTS
const testMessage = ref<string>('')
const testMessages = ref<Array<{
  id: string
  role: 'user' | 'assistant'
  content: string
  timestamp: Date
  loading?: boolean
  provider?: string
  responseTime?: number
}>>([])
const sendingTestMessage = ref<boolean>(false)
const responseTimes = ref<number[]>([])

// ✅ NOUVEAU : Variables dynamiques disponibles
const availableVariables = ref([
  { name: '${agentName}', display: '👤 Nom vendeur' },
  { name: '${agentTitle}', display: '💼 Titre vendeur' },
  { name: '${shopName}', display: '🏪 Nom boutique' },
  { name: '${productName}', display: '📦 Nom produit' },
  { name: '${productType}', display: '🏷️ Type produit' },
  { name: '${greeting}', display: '👋 Salutation' }
])

// ✅ COMPUTED AVEC TYPES CORRECTS
const agentId = computed<string>(() => {
  if (route.query.id && typeof route.query.id === 'string') {
    return route.query.id
  }
  
  const storeAgent = agentConfigStore.getAgentForConfig()
  if (storeAgent?.id) {
    return storeAgent.id
  }
  
  return 'unknown'
})

// ✅ CORRECTION : Fonction pour copier les données readonly vers mutable
const copyReadonlyData = <T>(data: T): T => {
  return JSON.parse(JSON.stringify(data))
}

const agentName = computed<string>(() => {
  return localConfig.value.agent.name || 'Vendeur IA'
})

const linkedKnowledgeBase = computed(() => {
  return localConfig.value.agent.knowledgeBase || []
})

const availableKnowledgeBase = computed(() => {
  return knowledgeBaseDocuments.value || []
})

const averageResponseTime = computed<number>(() => {
  if (responseTimes.value.length === 0) return 0
  return Math.round(responseTimes.value.reduce((a, b) => a + b, 0) / responseTimes.value.length)
})

// ✅ DATA AVEC TYPES CORRECTS
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

// ✅ METHODS AVEC TYPES CORRECTS ET CORRECTION SETERROR

const goBack = (): void => {
  agentConfigStore.clearAgentConfig()
  router.push('/vendeurs-ia')
}

const handleToggleAndChange = (toggleFunction: () => void): void => {
  toggleFunction()
  handleConfigChange()
}

// ✅ CORRECTION MAJEURE : setError utilise localError au lieu de error readonly
const setError = (message: string): void => {
  localError.value = message
}

// ✅ COMPUTED POUR GÉRER L'ERREUR COMBINÉE
const displayError = computed(() => {
  return localError.value || error.value
})

const clearLocalError = (): void => {
  localError.value = null
  clearError()
}

// ✅ CORRECTION MAJEURE : Fonction triggerAvatarUpload pour éviter l'erreur 'click'
const triggerAvatarUpload = (): void => {
  if (avatarUploadRef.value) {
    avatarUploadRef.value.click()
  }
}

// Réinitialiser au template par défaut
const resetToDefaultTemplate = () => {
  if (localConfig.value?.agent) {
    localConfig.value.agent.welcomeMessage = getDefaultWelcomeTemplate()
    triggerAutoSave()
  }
}

// Tester le vrai message d'accueil
const testWelcomeMessagePreview = async () => {
  if (!agentConfig.value?.agent.id) return
  
  try {
    const result = await testWelcomeMessage(agentConfig.value.agent.id)
    if (result.success) {
      alert(`Message d'accueil réel :\n\n${result.message}`)
    } else {
      alert(`Erreur test : ${result.error}`)
    }
  } catch (error) {
    console.error('Erreur test message d\'accueil:', error)
  }
}

const loadAgentData = async (): Promise<void> => {
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
        title: storeAgent.title || getTypeLabel(storeAgent.type || 'general'),
        type: (storeAgent.type as AgentType) || 'general',
        personality: (storeAgent.personality as PersonalityType) || 'friendly',
        productType: (storeAgent.productType as ProductType) || 'auto',
        customProductType: storeAgent.customProductType || '', 
        description: storeAgent.description || '',
        welcomeMessage: storeAgent.welcomeMessage || '',
        fallbackMessage: storeAgent.fallbackMessage || '',
        avatar: storeAgent.avatar || '',
        isActive: storeAgent.isActive,
        config: {
          collectName: storeAgent.config?.collectName ?? true,
          collectPhone: storeAgent.config?.collectPhone ?? true,
          collectEmail: storeAgent.config?.collectEmail ?? true,
          collectAddress: storeAgent.config?.collectAddress ?? false,
          collectPayment: storeAgent.config?.collectPayment ?? true,
          upsellEnabled: storeAgent.config?.upsellEnabled ?? false,
          urgencyEnabled: storeAgent.config?.urgencyEnabled ?? false,
          specificInstructions: storeAgent.config?.specificInstructions ? [...storeAgent.config.specificInstructions] : [],
          linkedKnowledgeBase: storeAgent.config?.linkedKnowledgeBase ? [...storeAgent.config.linkedKnowledgeBase] : [],
          aiProvider: (storeAgent.config?.aiProvider as 'openai' | 'claude') || 'openai',
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
    setError('Impossible de charger les données de l\'agent. Veuillez réessayer.')
    
  } catch (globalError) {
    console.error('❌ [loadAgentData] Erreur globale:', globalError)
    hasValidAgentData.value = false
    setError('Erreur lors du chargement des données de l\'agent')
  } finally {
    loading.value = false
  }
}

// ✅ NOUVELLE FONCTION : Formatage des messages identique au widget
const formatMessage = (content: string): string => {
  return content
    // Préserver les emojis AVANT tout autre traitement
    .replace(/([\u{1F600}-\u{1F64F}]|[\u{1F300}-\u{1F5FF}]|[\u{1F680}-\u{1F6FF}]|[\u{1F1E0}-\u{1F1FF}]|[\u{2600}-\u{26FF}]|[\u{2700}-\u{27BF}])/gu, '<span class="emoji">$1</span>')
    
    // Gestion des markdown
    .replace(/\*\*(.*?)\*\*/g, '<strong class="font-semibold text-gray-900">$1</strong>')
    .replace(/\*(.*?)\*/g, '<em class="italic text-gray-700">$1</em>')
    
    // Gestion des liens
    .replace(/(https?:\/\/[^\s]+)/g, '<a href="$1" target="_blank" class="text-blue-600 underline hover:text-blue-800 transition-colors">$1</a>')
    
    // Gestion des sauts de ligne
    .replace(/\n\n/g, '<br><br class="my-2">')
    .replace(/\n/g, '<br class="my-1">')
    
    // Amélioration des listes
    .replace(/^\- (.*)/gm, '<span class="block ml-2 relative"><span class="absolute -ml-2 text-blue-600">•</span>$1</span>')
    
    // Amélioration des prix
    .replace(/(\d+(?:[.,]\d{2})?\s*(?:FCFA|€|USD|\$))/g, '<span class="font-semibold text-green-600 bg-green-50 px-1 rounded">$1</span>')
}

// ✅ MÉTHODES WIDGET
const selectPresetColor = (color: string): void => {
  localConfig.value.widget.primaryColor = color
  updateWidgetPreview()
}

// Add local sync status
const localWidgetSyncStatus = ref<'idle' | 'syncing' | 'synced'>('idle')

const updateWidgetPreview = (): void => {
  console.log('🎨 Widget configuration updated:', localConfig.value.widget)
  
  if (localWidgetSyncStatus.value !== 'syncing') {
    localWidgetSyncStatus.value = 'syncing'
    
    setTimeout(() => {
      localWidgetSyncStatus.value = 'synced'
      setTimeout(() => {
        localWidgetSyncStatus.value = 'idle'
      }, 2000)
    }, 500)
  }
  
  handleConfigChange()
}

const resetWidgetToDefaults = (): void => {
  if (confirm('Êtes-vous sûr de vouloir réinitialiser la configuration du widget ?')) {
    localConfig.value.widget = {
      buttonText: 'Parler à un conseiller',
      primaryColor: '#3B82F6',
      position: 'above-cta',
      widgetSize: 'medium',
      theme: 'modern',
      borderRadius: 'lg', // ✅ CORRECTION : 'md' remplacé par 'lg'
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

// ✅ NOUVEAU : Fonction d'insertion de variables
const insertVariable = (variableName: string) => {
  const textarea = welcomeMessageInputRef.value
  if (textarea) {
    const start = textarea.selectionStart
    const end = textarea.selectionEnd
    const text = localConfig.value.agent.welcomeMessage || ''
    
    localConfig.value.agent.welcomeMessage = 
      text.substring(0, start) + variableName + text.substring(end)
    
    // Remettre le focus et positionner le curseur
    nextTick(() => {
      textarea.focus()
      textarea.selectionStart = textarea.selectionEnd = start + variableName.length
    })
    
    triggerAutoSave()
  }
}

// ✅ NOUVEAU : Gestion upload d'avatar
const handleAvatarUpload = async (event: Event) => {
  const target = event.target as HTMLInputElement
  const file = target.files?.[0]
  
  if (!file) return
  
  // Vérifier que c'est une image
  if (!file.type.startsWith('image/')) {
    alert('Veuillez sélectionner un fichier image valide.')
    return
  }
  
  // Vérifier la taille (max 5MB)
  if (file.size > 5 * 1024 * 1024) {
    alert('L\'image doit faire moins de 5MB.')
    return
  }
  
  try {
    // Convertir en base64 pour prévisualisation immédiate
    const reader = new FileReader()
    reader.onload = (e) => {
      if (e.target?.result) {
        localConfig.value.agent.avatar = e.target.result as string
        handleConfigChange()
      }
    }
    reader.readAsDataURL(file)
    
    // TODO: Ici, vous pourrez plus tard ajouter l'upload vers un service cloud
    // comme Cloudinary, AWS S3, ou Supabase Storage
    console.log('📁 Image sélectionnée:', file.name)
    
  } catch (error) {
    console.error('❌ Erreur upload avatar:', error)
    alert('Erreur lors du téléchargement de l\'image.')
  }
}

// ✅ NOUVEAU : Gestion changement type de produit
const handleProductTypeChange = () => {
  // Si ce n'est pas "produit", réinitialiser le type personnalisé
  if (localConfig.value.agent.productType !== 'produit') {
    localConfig.value.agent.customProductType = ''
  }
  handleConfigChange()
}

// ✅ NOUVELLE MÉTHODE : Générer avatar automatique
const generateAvatar = (): void => {
  if (localConfig.value.agent.name) {
    // Utilise nom + titre pour un avatar plus descriptif
    const displayName = localConfig.value.agent.title 
      ? `${localConfig.value.agent.name} ${localConfig.value.agent.title}`
      : localConfig.value.agent.name
      
    const name = encodeURIComponent(displayName)
    const color = localConfig.value.widget?.primaryColor?.replace('#', '') || '3B82F6'
    localConfig.value.agent.avatar = `https://ui-avatars.com/api/?name=${name}&background=${color}&color=fff&size=200&rounded=true&font-size=0.4`
    
    handleConfigChange()
    console.log('✅ Avatar généré pour:', displayName)
  }
}

// ✅ NOUVELLE MÉTHODE : Gérer erreur avatar
const handleAvatarError = (event: Event): void => {
  const img = event.target as HTMLImageElement
  const name = encodeURIComponent(localConfig.value.agent.name || 'Agent')
  const color = localConfig.value.widget?.primaryColor?.replace('#', '') || '6B7280'
  img.src = `https://ui-avatars.com/api/?name=${name}&background=${color}&color=fff&size=200&rounded=true&font-size=0.4`
}

// ✅ HELPER METHODS POUR WIDGET - VALEURS CORRIGÉES
const getBorderRadiusValue = (radius: string): string => {
  const radiusMap = {
    none: '0px', 
    sm: '6px', 
    md: '12px', 
    lg: '16px', 
    full: '50px'  // ✅ 'xl' supprimé complètement
  }
  return radiusMap[radius as keyof typeof radiusMap] || '12px'
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
const handleUpsellToggle = (): void => {
  if (!isPaidUser.value) {
    showUpgradeModal('upsell')
    return
  }
  localConfig.value.agent.config.upsellEnabled = !localConfig.value.agent.config.upsellEnabled
  handleConfigChange()
}

const handleUrgencyToggle = (): void => {
  if (!isPaidUser.value) {
    showUpgradeModal('urgency')
    return
  }
  localConfig.value.agent.config.urgencyEnabled = !localConfig.value.agent.config.urgencyEnabled
  handleConfigChange()
}

const showUpgradeModal = (feature: string): void => {
  const featureNames = {
    upsell: 'Propositions d\'upsell intelligentes',
    urgency: 'Création d\'urgence (FOMO)'
  }
  
  alert(`🔒 ${featureNames[feature as keyof typeof featureNames]} est une fonctionnalité réservée au plan Pro.\n\nPassez au plan Pro pour débloquer toutes les fonctionnalités avancées de ChatSeller.`)
}

// ✅ NOUVELLE MÉTHODE : Gérer Knowledge Base
const openKnowledgeBaseModal = async (): Promise<void> => {
  showKnowledgeBaseModal.value = true
  selectedKnowledgeBase.value = [...(localConfig.value.agent.config.linkedKnowledgeBase || [])]
  
  // Charger les documents disponibles
  await fetchKnowledgeBaseDocuments()
}

const closeKnowledgeBaseModal = (): void => {
  showKnowledgeBaseModal.value = false
  selectedKnowledgeBase.value = []
}

const saveKnowledgeBaseSelection = async (): Promise<void> => {
  savingKnowledgeBase.value = true
  
  try {
    const result = await linkKnowledgeBaseDocuments(agentId.value, selectedKnowledgeBase.value)
    
    if (result.success) {
      // Mettre à jour la config locale - CORRECTION MAJEURE POUR ÉVITER READONLY
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
const sendTestMessageReal = async (): Promise<void> => {
  if (!testMessage.value.trim() || sendingTestMessage.value) return

  const messageContent = testMessage.value.trim()
  testMessage.value = ''
  sendingTestMessage.value = true

  // Ajouter message utilisateur
  const userMessage = {
    id: Date.now().toString(),
    role: 'user' as const,
    content: messageContent,
    timestamp: new Date()
  }
  testMessages.value.push(userMessage)

  // Ajouter message de chargement
  const loadingMessage = {
    id: (Date.now() + 1).toString(),
    role: 'assistant' as const,
    content: '',
    timestamp: new Date(),
    loading: true
  }
  testMessages.value.push(loadingMessage)

  const startTime = Date.now()

  try {
    console.log('🧪 [TEST AI] Début test avec agent:', agentId.value)
    console.log('🧪 [TEST AI] Message:', messageContent)
    
    // ✅ APPEL IA RÉEL AVEC MEILLEUR DEBUG
    const result = await testAIMessage(messageContent, agentId.value)
    
    console.log('📥 [TEST AI] Résultat complet:', result)
    
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
          provider: result.provider || localConfig.value.agent.config.aiProvider || 'openai',
          responseTime: responseTime
        }
      }
      
      console.log('✅ [TEST AI] Message IA ajouté avec succès')
    } else {
      throw new Error(result.error || 'Erreur lors du test IA')
    }

  } catch (error: any) {
    console.error('❌ [TEST AI] Erreur complète:', error)
    
    // ✅ SIMULER UNE RÉPONSE RÉALISTE avec nom et titre corrects
    const messageIndex = testMessages.value.findIndex(m => m.loading)
    if (messageIndex !== -1) {
      const agentName = localConfig.value.agent.name || 'Assistant'
      const agentTitle = localConfig.value.agent.title || 'Conseiller'
      
      let simulatedResponse = ''
      
      const msg = messageContent.toLowerCase()
      if (msg.includes('prix') || msg.includes('coût')) {
        simulatedResponse = `Merci pour votre question sur les tarifs ! 💰

Je suis **${agentName}**, votre ${agentTitle}. Je vous mets en relation avec notre équipe pour vous donner les informations les plus précises.

Y a-t-il autre chose que je puisse vous aider ? 😊`
      } else if (msg.includes('acheter') || msg.includes('commander')) {
        simulatedResponse = `Parfait ! Je vais vous aider à finaliser votre commande. ✨

Pouvez-vous me donner plus de détails sur ce qui vous intéresse ? 📦`
      } else {
        simulatedResponse = `Merci pour votre question ! Je suis **${agentName}**, ${agentTitle}.

Je vous mets en relation avec notre équipe pour vous donner les meilleures informations.

Y a-t-il autre chose que je puisse vous aider ? 😊`
      }
      
      testMessages.value[messageIndex] = {
        id: Date.now().toString(),
        role: 'assistant',
        content: simulatedResponse,
        timestamp: new Date(),
        provider: localConfig.value.agent.config.aiProvider || 'openai',
        responseTime: Date.now() - startTime
      }
      
      console.log('⚠️ [TEST AI] Réponse simulée utilisée avec agent:', agentName)
    }
  } finally {
    sendingTestMessage.value = false
    await nextTick()
    scrollChatToBottom()
  }
}

const runTestScenario = (scenario: any): void => {
  // Messages contextualisés pour le produit
  const contextualizedMessages = {
    greeting: 'Bonjour',
    product_info: 'Pouvez-vous me parler de ce jeu de cartes ?',
    purchase_intent: 'Je voudrais commander ce jeu',
    objection: 'C\'est un peu cher pour moi',
    support: 'Comment ça fonctionne exactement ?'
  }
  
  testMessage.value = contextualizedMessages[scenario.id as keyof typeof contextualizedMessages] || scenario.message
  sendTestMessageReal()
}

const resetTestChat = (): void => {
  testMessages.value = []
  responseTimes.value = []
  
  // ✅ CORRECTION : Utiliser les bonnes sources de données avec fallbacks robustes
  const agentName = localConfig.value.agent.name || 
                   agentConfig.value?.agent?.name || 
                   'Assistant IA'
                   
  const agentTitle = localConfig.value.agent.title || 
                    agentConfig.value?.agent?.title || 
                    getTypeLabel(localConfig.value.agent.type || 'general')
                    
  const productType = localConfig.value.agent.productType || 'auto'
  const getProductTypeLabel = (type: string, customType?: string): string => {
    // Si c'est un type personnalisé, utiliser la valeur personnalisée
    if (type === 'produit' && customType) {
      return customType
    }
    
    const option = getProductTypeOptions().find(opt => opt.value === type)
    return option ? option.label : '🎯 Détection automatique'
  }
  
  console.log('🧪 [PLAYGROUND] Initialisation chat avec:', {
    name: agentName,
    title: agentTitle,
    type: localConfig.value.agent.type,
    productType,
    hasLocalConfig: !!localConfig.value.agent.name,
    hasAgentConfig: !!agentConfig.value?.agent?.name
  })
  
  // ✅ Message d'accueil cohérent avec le Widget
  let welcomeMessage = ''
  
  if (localConfig.value.agent.welcomeMessage) {
    welcomeMessage = localConfig.value.agent.welcomeMessage
  } else {
    // ✅ Simuler un produit de test selon le type choisi
    const testProduct = productType !== 'auto' 
      ? `notre ${getProductTypeLabel(productType, localConfig.value.agent.customProductType).toLowerCase().replace(/[🎯🎮📚🎓📱💻👗🔧💎📦]/g, '').trim()} de test`
      : 'ce produit de démonstration'
      
    welcomeMessage = `Bonjour ! 👋 Je suis **${agentName}**, ${agentTitle}.

Je vois que vous vous intéressez à ${testProduct}. Excellent choix ! ✨

Comment puis-je vous aider ? 😊

*Note : Ceci est un aperçu de test. Sur votre site, je détecterai automatiquement vos vrais produits.*`
  }
  
  testMessages.value.push({
    id: Date.now().toString(),
    role: 'assistant',
    content: welcomeMessage,
    timestamp: new Date(),
    provider: localConfig.value.agent.config.aiProvider || 'openai'
  })
  
  console.log('✅ [PLAYGROUND] Chat initialisé avec message d\'accueil cohérent:', welcomeMessage.substring(0, 50))
}

const saveAllConfig = async (): Promise<void> => {
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

// ✅ MÉTHODE POUR COPIER LE CODE D'INTÉGRATION - CORRIGÉE
const copyIntegrationCodeAction = async (): Promise<void> => {
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
    setError('Impossible de copier le code d\'intégration')
    setTimeout(() => {
      clearLocalError()
    }, 3000)
  }
}

// ✅ HELPER METHODS
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

const addInstruction = (): void => {
  if (!localConfig.value.agent.config.specificInstructions) {
    localConfig.value.agent.config.specificInstructions = []
  }
  localConfig.value.agent.config.specificInstructions.push('')
  handleConfigChange()
}

const removeInstruction = (index: number): void => {
  if (localConfig.value.agent.config.specificInstructions) {
    localConfig.value.agent.config.specificInstructions.splice(index, 1)
    handleConfigChange()
  }
}

// Gestion des changements avec sauvegarde auto
const handleConfigChange = (): void => {
  console.log('🔄 [CONFIG CHANGE] Changement détecté, déclenchement auto-save')
  triggerAutoSave()
}

const scrollChatToBottom = (): void => {
  const container = chatContainerRef.value
  if (container) {
    container.scrollTop = container.scrollHeight
  }
}

// ✅ WATCH CORRIGÉS AVEC TYPES ET DEEP COPY COMPATIBLE
watch(() => agentConfig.value, (newConfig) => {
  if (newConfig?.agent) {
    try {
      localConfig.value.agent = {
        id: newConfig.agent.id,
        name: newConfig.agent.name,
        title: newConfig.agent.title || getTypeLabel(newConfig.agent.type || 'general'),
        type: (newConfig.agent.type as AgentType) || 'general',
        personality: (newConfig.agent.personality as PersonalityType) || 'friendly',
        productType: (newConfig.agent.productType as ProductType) || 'auto',
        customProductType: newConfig.agent.customProductType || '', // ✅ NOUVEAU
        description: newConfig.agent.description || '',
        welcomeMessage: newConfig.agent.welcomeMessage || '',
        fallbackMessage: newConfig.agent.fallbackMessage || '',
        avatar: newConfig.agent.avatar || '',
        isActive: newConfig.agent.isActive ?? true,
        config: {
          collectName: newConfig.agent.config?.collectName ?? true,
          collectPhone: newConfig.agent.config?.collectPhone ?? true,
          collectEmail: newConfig.agent.config?.collectEmail ?? true,
          collectAddress: newConfig.agent.config?.collectAddress ?? false,
          collectPayment: newConfig.agent.config?.collectPayment ?? true,
          upsellEnabled: newConfig.agent.config?.upsellEnabled ?? false,
          urgencyEnabled: newConfig.agent.config?.urgencyEnabled ?? false,
          specificInstructions: newConfig.agent.config?.specificInstructions ? 
            [...newConfig.agent.config.specificInstructions] : [],
          linkedKnowledgeBase: newConfig.agent.config?.linkedKnowledgeBase ? 
            [...newConfig.agent.config.linkedKnowledgeBase] : [],
          aiProvider: (newConfig.agent.config?.aiProvider as 'openai' | 'claude') || 'openai',
          temperature: newConfig.agent.config?.temperature || 0.7,
          maxTokens: newConfig.agent.config?.maxTokens || 1000,
          systemPrompt: newConfig.agent.config?.systemPrompt || '',
          tone: newConfig.agent.config?.tone || 'friendly'
        },
        stats: newConfig.agent.stats || { conversations: 0, conversions: 0 },
        knowledgeBase: newConfig.agent.knowledgeBase ? newConfig.agent.knowledgeBase.map(doc => ({
          id: doc.id,
          title: doc.title,
          contentType: doc.contentType,
          isActive: doc.isActive,
          tags: [...doc.tags]
        })) : []
      }
        
        if (newConfig.widget) {
          localConfig.value.widget = {
            buttonText: newConfig.widget.buttonText || 'Parler à un conseiller',
            primaryColor: newConfig.widget.primaryColor || '#3B82F6',
            position: newConfig.widget.position || 'above-cta',
            widgetSize: newConfig.widget.widgetSize || 'medium',
            theme: newConfig.widget.theme || 'modern',
            borderRadius: (['none', 'sm', 'md', 'lg', 'full'].includes(newConfig.widget.borderRadius as string)) 
              ? newConfig.widget.borderRadius as 'none' | 'sm' | 'md' | 'lg' | 'full'
              : 'lg', // ✅ CORRECTION : 'md' remplacé par 'lg' par défaut
            animation: newConfig.widget.animation || 'fade',
            autoOpen: newConfig.widget.autoOpen ?? false,
            showAvatar: newConfig.widget.showAvatar ?? true,
            soundEnabled: newConfig.widget.soundEnabled ?? true,
            mobileOptimized: newConfig.widget.mobileOptimized ?? true,
            isActive: newConfig.widget.isActive ?? true,
            language: newConfig.widget.language || 'fr'
          }
        }
        
        hasValidAgentData.value = true
        console.log('✅ [watcher] localConfig mis à jour avec nouveaux champs')
        
      } catch (watchError) {
        console.error('❌ [watcher] Erreur mise à jour localConfig:', watchError)
        setError('Erreur lors de la mise à jour de la configuration')
      }
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
watch(() => localConfig.value, (newConfig) => {
  if (newConfig && newConfig.agent && newConfig.agent.name) {
    handleConfigChange()
  }
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

  // ✅ NOUVELLE LOGIQUE : Détecter l'onglet depuis l'URL
  if (route.query.tab && typeof route.query.tab === 'string') {
    const requestedTab = route.query.tab
    const validTabs = ['agent', 'widget', 'playground', 'integration']
    
    if (validTabs.includes(requestedTab)) {
      activeTab.value = requestedTab
      console.log(`🎯 Onglet automatique activé: ${requestedTab}`)
      
      // Si c'est playground, initialiser le chat de test
      if (requestedTab === 'playground') {
        resetTestChat()
        console.log('🧪 Playground initialisé automatiquement')
      }
    }
  }
  
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
/* ✅ STYLES ESSENTIELS SANS CONFLITS TAILWIND */

/* Animation pour les spinners */
@keyframes spin {
  from { transform: rotate(0deg); }
  to { transform: rotate(360deg); }
}

/* Animation pour les indicateurs pulse */
@keyframes pulse {
  0%, 100% { opacity: 1; }
  50% { opacity: 0.5; }
}

/* ✅ NOUVEAU : Styles pour upload d'avatar */
.avatar-upload-area {
  transition: all 0.2s ease;
}

.avatar-upload-area:hover {
  background-color: #f8fafc;
  border-color: #3b82f6;
}

/* ✅ AMÉLIORATION : Formatage des messages dans le chat */
.message-formatted {
  line-height: 1.6;
  word-break: break-word;
}

.message-formatted strong {
  font-weight: 600;
  color: #1f2937;
}

.message-formatted em {
  font-style: italic;
  color: #4b5563;
}

/* ✅ NOUVEAU : Styles pour les liens formatés */
.message-formatted a {
  color: #2563eb;
  text-decoration: underline;
  transition: color 0.2s ease;
}

.message-formatted a:hover {
  color: #1d4ed8;
}

/* ✅ Emojis optimisés */
.emoji {
  display: inline-block;
  margin: 0 1px;
  font-family: "Apple Color Emoji", "Segoe UI Emoji", sans-serif;
  font-size: 1.1em;
  line-height: 1;
}

/* ✅ NOUVEAU : Styles pour les variables dynamiques */
.variable-button {
  transition: all 0.2s ease;
  border: 1px solid #e5e7eb;
}

.variable-button:hover {
  background-color: #eff6ff;
  border-color: #3b82f6;
  transform: translateY(-1px);
}

/* ✅ NOUVEAU : Styles pour la prévisualisation du message d'accueil */
.welcome-preview {
  background: linear-gradient(135deg, #f9fafb 0%, #f3f4f6 100%);
  border: 1px solid #e5e7eb;
  border-radius: 8px;
}

/* ✅ AMÉLIORATION : Scrollbar personnalisé pour le chat uniquement */
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
  transition: background 0.2s ease;
}

.overflow-y-auto::-webkit-scrollbar-thumb:hover {
  background: #9ca3af;
}

/* ✅ NOUVEAU : Styles pour les toggles améliorés */
.toggle-switch {
  position: relative;
  display: inline-flex;
  height: 24px;
  width: 44px;
  flex-shrink: 0;
  cursor: pointer;
  border-radius: 9999px;
  border: 2px solid transparent;
  transition: all 0.2s ease;
  outline: none;
}

.toggle-switch:focus {
  box-shadow: 0 0 0 2px #3b82f6, 0 0 0 4px rgba(59, 130, 246, 0.1);
}

.toggle-switch.active {
  background-color: #3b82f6;
}

.toggle-switch.inactive {
  background-color: #d1d5db;
}

.toggle-switch.disabled {
  cursor: not-allowed;
  opacity: 0.5;
}

.toggle-knob {
  pointer-events: none;
  display: inline-block;
  height: 20px;
  width: 20px;
  transform: translateX(0);
  border-radius: 50%;
  background-color: white;
  box-shadow: 0 1px 3px 0 rgba(0, 0, 0, 0.1);
  transition: transform 0.2s ease;
}

.toggle-knob.active {
  transform: translateX(20px);
}

/* ✅ NOUVEAU : Styles pour les couleurs prédéfinies */
.color-preset-button {
  transition: all 0.2s ease;
  border: 2px solid transparent;
}

.color-preset-button:hover {
  transform: scale(1.1);
  box-shadow: 0 4px 8px rgba(0, 0, 0, 0.1);
}

.color-preset-button.active {
  border-color: #1f2937;
  box-shadow: 0 0 0 2px rgba(31, 41, 55, 0.2);
}

/* ✅ NOUVEAU : Animations pour les modales */
@keyframes fadeIn {
  from { 
    opacity: 0; 
    transform: scale(0.95);
  }
  to { 
    opacity: 1; 
    transform: scale(1);
  }
}

@keyframes slideIn {
  from {
    opacity: 0;
    transform: translateY(-10px);
  }
  to {
    opacity: 1;
    transform: translateY(0);
  }
}

.modal-enter {
  animation: fadeIn 0.2s ease-out;
}

/* ✅ NOUVEAU : Styles pour les instructions spécifiques */
.instruction-input {
  transition: all 0.2s ease;
}

.instruction-input:focus {
  transform: translateY(-1px);
  box-shadow: 0 4px 8px rgba(0, 0, 0, 0.1);
}

.instruction-remove-button {
  transition: all 0.2s ease;
  border-radius: 6px;
}

.instruction-remove-button:hover {
  background-color: #fef2f2;
  color: #dc2626;
  transform: scale(1.1);
}

/* ✅ NOUVEAU : Styles pour les scénarios de test */
.test-scenario-button {
  transition: all 0.2s ease;
  position: relative;
  overflow: hidden;
}

.test-scenario-button:hover {
  background-color: #f9fafb;
  transform: translateY(-1px);
  box-shadow: 0 4px 8px rgba(0, 0, 0, 0.1);
}

.test-scenario-button:disabled {
  opacity: 0.6;
  cursor: not-allowed;
  transform: none;
}

/* ✅ NOUVEAU : Styles pour le code d'intégration */
.integration-code-block {
  font-family: 'Monaco', 'Menlo', 'Ubuntu Mono', monospace;
  font-size: 12px;
  line-height: 1.4;
}

.copy-button {
  transition: all 0.2s ease;
}

.copy-button:hover {
  background-color: #374151;
  transform: translateY(-1px);
}

/* ✅ NOUVEAU : Styles pour les statistiques */
.stat-item {
  transition: all 0.2s ease;
  padding: 12px;
  border-radius: 8px;
}

.stat-item:hover {
  background-color: #f9fafb;
  transform: translateY(-1px);
}

/* ✅ AMÉLIORATION : Styles responsifs pour mobile */
@media (max-width: 640px) {
  .avatar-upload-area {
    flex-direction: column;
    align-items: center;
    gap: 12px;
  }
  
  .variable-button {
    font-size: 11px;
    padding: 4px 8px;
  }
  
  .integration-code-block {
    font-size: 11px;
  }
  
  .stat-item {
    padding: 8px;
  }
}

/* ✅ NOUVEAU : Styles pour les alertes et notifications */
.alert-success {
  background: linear-gradient(135deg, #ecfdf5 0%, #d1fae5 100%);
  border: 1px solid #a7f3d0;
  animation: slideIn 0.3s ease-out;
}

.alert-error {
  background: linear-gradient(135deg, #fef2f2 0%, #fecaca 100%);
  border: 1px solid #fca5a5;
  animation: slideIn 0.3s ease-out;
}

.alert-warning {
  background: linear-gradient(135deg, #fffbeb 0%, #fef3c7 100%);
  border: 1px solid #fcd34d;
  animation: slideIn 0.3s ease-out;
}

/* ✅ NOUVEAU : Styles pour les badges de statut */
.status-badge {
  display: inline-flex;
  align-items: center;
  padding: 4px 8px;
  border-radius: 12px;
  font-size: 11px;
  font-weight: 600;
  text-transform: uppercase;
  letter-spacing: 0.5px;
}

.status-badge.active {
  background-color: #dcfce7;
  color: #166534;
}

.status-badge.inactive {
  background-color: #f3f4f6;
  color: #6b7280;
}

.status-badge.pro {
  background-color: #fef3c7;
  color: #d97706;
}

/* ✅ NOUVEAU : Styles pour les onglets améliorés */
.tab-button {
  transition: all 0.2s ease;
  position: relative;
}

.tab-button.active::after {
  content: '';
  position: absolute;
  bottom: -2px;
  left: 50%;
  width: 24px;
  height: 2px;
  background-color: #3b82f6;
  border-radius: 1px;
  transform: translateX(-50%);
}

.tab-button:hover:not(.active) {
  color: #374151;
  background-color: rgba(59, 130, 246, 0.05);
}

/* ✅ NOUVEAU : Styles pour les tooltips */
.tooltip {
  position: relative;
}

.tooltip:hover::after {
  content: attr(data-tooltip);
  position: absolute;
  bottom: 100%;
  left: 50%;
  transform: translateX(-50%);
  padding: 6px 8px;
  background-color: #1f2937;
  color: white;
  font-size: 12px;
  border-radius: 4px;
  white-space: nowrap;
  z-index: 1000;
  opacity: 0;
  animation: fadeIn 0.2s ease-out forwards;
}

/* ✅ CORRECTION : Support des préférences utilisateur pour l'accessibilité */
@media (prefers-reduced-motion: reduce) {
  * {
    animation-duration: 0.01ms !important;
    animation-iteration-count: 1 !important;
    transition-duration: 0.01ms !important;
  }
  
  .toggle-switch,
  .toggle-knob,
  .color-preset-button,
  .test-scenario-button,
  .instruction-input,
  .variable-button {
    transition: none !important;
    transform: none !important;
  }
}

/* ✅ NOUVEAU : Styles pour le focus clavier (accessibilité) */
.focus-visible:focus {
  outline: 2px solid #3b82f6;
  outline-offset: 2px;
}

button:focus-visible,
input:focus-visible,
select:focus-visible,
textarea:focus-visible {
  outline: 2px solid #3b82f6;
  outline-offset: 2px;
}

/* ✅ NOUVEAU : Styles pour les états de chargement */
.loading-spinner {
  animation: spin 1s linear infinite;
}

.loading-dots::after {
  content: '';
  animation: loading-dots 1.5s linear infinite;
}

@keyframes loading-dots {
  0%, 20% { content: '.'; }
  40% { content: '..'; }
  60%, 100% { content: '...'; }
}

/* ✅ NOUVEAU : Styles pour les transitions de page */
.page-enter-active,
.page-leave-active {
  transition: all 0.2s ease;
}

.page-enter-from {
  opacity: 0;
  transform: translateY(10px);
}

.page-leave-to {
  opacity: 0;
  transform: translateY(-10px);
}

/* ✅ NOUVEAU : Styles pour améliorer la lisibilité */
.text-readable {
  line-height: 1.6;
  letter-spacing: 0.02em;
}

.code-readable {
  font-family: 'SF Mono', 'Monaco', 'Inconsolata', 'Roboto Mono', monospace;
  font-size: 13px;
  line-height: 1.5;
  letter-spacing: 0.05em;
}

/* ✅ NOUVEAU : Styles pour les cards avec hover effects */
.card-hover {
  transition: all 0.2s ease;
  border: 1px solid #e5e7eb;
}

.card-hover:hover {
  border-color: #d1d5db;
  box-shadow: 0 10px 25px rgba(0, 0, 0, 0.08);
  transform: translateY(-2px);
}

/* ✅ NOUVEAU : Styles pour les inputs avec validation */
.input-valid {
  border-color: #10b981;
  box-shadow: 0 0 0 1px #10b981;
}

.input-invalid {
  border-color: #ef4444;
  box-shadow: 0 0 0 1px #ef4444;
}

.input-valid:focus {
  ring-color: #10b981;
}

.input-invalid:focus {
  ring-color: #ef4444;
}

/* ✅ NOUVEAU : Styles pour les drag & drop zones */
.drop-zone {
  transition: all 0.2s ease;
  border: 2px dashed #d1d5db;
}

.drop-zone.drag-over {
  border-color: #3b82f6;
  background-color: #eff6ff;
}

/* ✅ FINAL : Reset pour éviter les conflits avec d'autres styles */
.agent-config-container * {
  box-sizing: border-box;
}

.agent-config-container button {
  outline: none;
}

.agent-config-container input,
.agent-config-container select,
.agent-config-container textarea {
  outline: none;
}
</style>