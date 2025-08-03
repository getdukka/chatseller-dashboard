<!-- pages/agent-config.vue - VERSION COMPLÈTE AVEC CORRECTIONS TYPESCRIPT -->
<template>
  <div class="min-h-screen bg-gray-50">
    <!-- Header -->
    <div class="bg-white shadow-sm border-b border-gray-200">
      <div class="px-8 py-6">
        <div class="flex items-center justify-between">
          <div class="flex items-center space-x-4">
            <button @click="goBack" class="p-2 text-gray-400 hover:text-gray-600 rounded-lg hover:bg-gray-100 transition-colors">
              <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M15 19l-7-7 7-7"/>
              </svg>
            </button>
            <div>
              <h1 class="text-2xl font-bold text-gray-900">
                {{ agentName }} - Configuration Complète
              </h1>
              <p class="mt-1 text-gray-600">
                Agent IA • Widget • Test • Intégration
              </p>
            </div>
          </div>
          
          <div class="flex items-center space-x-3">
            <!-- Navigation par onglets (mobile) -->
            <div class="lg:hidden">
              <select v-model="activeTab" class="border border-gray-300 rounded-lg px-3 py-2 text-sm">
                <option v-for="tab in tabs" :key="tab.id" :value="tab.id">
                  {{ tab.icon }} {{ tab.name }}
                </option>
              </select>
            </div>
            
            <!-- Navigation par onglets (desktop) -->
            <div class="hidden lg:flex space-x-1 bg-gray-100 p-1 rounded-lg">
              <button
                v-for="tab in tabs"
                :key="tab.id"
                @click="activeTab = tab.id"
                :class="[
                  'px-3 py-1.5 text-sm font-medium rounded-md transition-colors',
                  activeTab === tab.id 
                    ? 'bg-white text-blue-600 shadow-sm' 
                    : 'text-gray-500 hover:text-gray-700'
                ]"
              >
                {{ tab.icon }} {{ tab.name }}
              </button>
            </div>
            
            <span class="text-sm text-gray-500">ID: {{ agentId.substring(0, 8) }}...</span>
            
            <button
              @click="saveAllConfig"
              :disabled="saving || !isConfigValid"
              class="inline-flex items-center px-4 py-2 bg-blue-600 text-white text-sm font-medium rounded-lg hover:bg-blue-700 disabled:opacity-50 transition-colors"
            >
              <svg v-if="saving" class="w-4 h-4 mr-2 animate-spin" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15"/>
              </svg>
              <svg v-else class="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M8 7H5a2 2 0 00-2 2v9a2 2 0 002 2h14a2 2 0 002-2V9a2 2 0 00-2-2h-3m-1 4l-3 3m0 0l-3-3m3 3V4"/>
              </svg>
              {{ saving ? 'Sauvegarde...' : 'Sauvegarder Tout' }}
            </button>
          </div>
        </div>
      </div>
    </div>

    <!-- Messages -->
    <div class="mx-8 mt-4 space-y-2">
      <div v-if="successMessage" class="p-4 bg-green-50 border border-green-200 rounded-lg">
        <div class="flex items-center">
          <svg class="w-5 h-5 text-green-400 mr-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M5 13l4 4L19 7"/>
          </svg>
          <p class="text-green-700">{{ successMessage }}</p>
        </div>
      </div>
      
      <div v-if="error" class="p-4 bg-red-50 border border-red-200 rounded-lg">
        <div class="flex items-center justify-between">
          <div class="flex items-center">
            <svg class="w-5 h-5 text-red-400 mr-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"/>
            </svg>
            <p class="text-red-700">{{ error }}</p>
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
    <div v-if="loading" class="flex items-center justify-center py-16">
      <div class="text-center">
        <svg class="animate-spin h-8 w-8 text-blue-600 mx-auto mb-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15"/>
        </svg>
        <p class="text-gray-600">Chargement de la configuration...</p>
      </div>
    </div>

    <!-- Content avec onglets -->
    <div v-else-if="config" class="p-8">
      
      <!-- ✅ ONGLET 1: CONFIGURATION AGENT -->
      <div v-if="activeTab === 'agent'" class="grid grid-cols-1 lg:grid-cols-3 gap-8">
        
        <!-- Configuration Panel -->
        <div class="lg:col-span-2 space-y-8">
          
          <!-- Informations de base -->
          <div class="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
            <h3 class="text-lg font-semibold text-gray-900 mb-6">🤖 Informations de l'Agent</h3>
            
            <div class="space-y-6">
              <!-- Nom -->
              <div>
                <label class="block text-sm font-medium text-gray-700 mb-2">Nom de l'agent *</label>
                <input
                  v-model="localConfig.agent.name"
                  type="text"
                  class="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-colors"
                  placeholder="Ex: Sarah, Expert Produits"
                />
              </div>

              <!-- Type + Personnalité -->
              <div class="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label class="block text-sm font-medium text-gray-700 mb-2">Type de vendeur</label>
                  <select v-model="localConfig.agent.type" class="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500">
                    <option value="general">🎯 Vendeur généraliste</option>
                    <option value="product_specialist">🛍️ Spécialiste produit</option>
                    <option value="support">🆘 Support & SAV</option>
                    <option value="upsell">💎 Upsell Premium</option>
                  </select>
                </div>
                
                <div>
                  <label class="block text-sm font-medium text-gray-700 mb-2">Personnalité</label>
                  <select v-model="localConfig.agent.personality" class="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500">
                    <option value="professional">💼 Professionnel</option>
                    <option value="friendly">😊 Amical</option>
                    <option value="expert">🎓 Expert technique</option>
                    <option value="casual">😎 Décontracté</option>
                  </select>
                </div>
              </div>

              <!-- Description -->
              <div>
                <label class="block text-sm font-medium text-gray-700 mb-2">Mission de l'agent</label>
                <textarea
                  v-model="localConfig.agent.description"
                  rows="3"
                  class="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                  placeholder="Ex: Spécialisé dans la vente de produits tech, aide les clients à choisir selon leurs besoins..."
                ></textarea>
              </div>

              <!-- Messages -->
              <div>
                <label class="block text-sm font-medium text-gray-700 mb-2">Message d'accueil *</label>
                <textarea
                  v-model="localConfig.agent.welcomeMessage"
                  rows="3"
                  class="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
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

              <div>
                <label class="block text-sm font-medium text-gray-700 mb-2">Message de fallback</label>
                <textarea
                  v-model="localConfig.agent.fallbackMessage"
                  rows="2"
                  class="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                  placeholder="Je transmets votre question à notre équipe, un conseiller vous recontactera bientôt."
                ></textarea>
              </div>
            </div>
          </div>

          <!-- Configuration commerciale -->
          <div class="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
            <h3 class="text-lg font-semibold text-gray-900 mb-6">💼 Configuration Commerciale</h3>
            
            <div class="space-y-6">
              <!-- Collection d'informations -->
              <div>
                <label class="block text-sm font-medium text-gray-700 mb-3">Informations à collecter</label>
                <div class="grid grid-cols-2 gap-2">
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
                <div class="flex items-center justify-between p-4 bg-gray-50 rounded-lg">
                  <div>
                    <h4 class="text-sm font-medium text-gray-900">💎 Propositions d'upsell</h4>
                    <p class="text-xs text-gray-500">L'agent propose des produits complémentaires</p>
                  </div>
                  <button
                    @click="localConfig.agent.config.upsellEnabled = !localConfig.agent.config.upsellEnabled"
                    :class="[
                      'relative inline-flex h-6 w-11 flex-shrink-0 cursor-pointer rounded-full border-2 border-transparent transition-colors duration-200 ease-in-out focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2',
                      localConfig.agent.config.upsellEnabled ? 'bg-blue-600' : 'bg-gray-200'
                    ]"
                  >
                    <span
                      :class="[
                        'pointer-events-none inline-block h-5 w-5 transform rounded-full bg-white shadow ring-0 transition duration-200 ease-in-out',
                        localConfig.agent.config.upsellEnabled ? 'translate-x-5' : 'translate-x-0'
                      ]"
                    ></span>
                  </button>
                </div>

                <div class="flex items-center justify-between p-4 bg-gray-50 rounded-lg">
                  <div>
                    <h4 class="text-sm font-medium text-gray-900">⚡ Création d'urgence</h4>
                    <p class="text-xs text-gray-500">Stock limité, offres temporaires</p>
                  </div>
                  <button
                    @click="localConfig.agent.config.urgencyEnabled = !localConfig.agent.config.urgencyEnabled"
                    :class="[
                      'relative inline-flex h-6 w-11 flex-shrink-0 cursor-pointer rounded-full border-2 border-transparent transition-colors duration-200 ease-in-out focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2',
                      localConfig.agent.config.urgencyEnabled ? 'bg-blue-600' : 'bg-gray-200'
                    ]"
                  >
                    <span
                      :class="[
                        'pointer-events-none inline-block h-5 w-5 transform rounded-full bg-white shadow ring-0 transition duration-200 ease-in-out',
                        localConfig.agent.config.urgencyEnabled ? 'translate-x-5' : 'translate-x-0'
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
          <div class="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
            <h3 class="text-lg font-semibold text-gray-900 mb-4">📊 Statut Agent</h3>
            
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
                <span class="text-sm font-medium">Agent actif</span>
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
          <div class="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
            <h3 class="text-lg font-semibold text-gray-900 mb-4">📈 Statistiques</h3>
            <div class="space-y-3">
              <div class="flex justify-between items-center">
                <span class="text-sm text-gray-600">Conversations</span>
                <span class="text-lg font-bold text-blue-600">{{ config.agent.stats.conversations }}</span>
              </div>
              <div class="flex justify-between items-center">
                <span class="text-sm text-gray-600">Conversions</span>
                <span class="text-lg font-bold text-green-600">{{ config.agent.stats.conversions }}</span>
              </div>
              <div class="flex justify-between items-center">
                <span class="text-sm text-gray-600">Taux de conversion</span>
                <span class="text-lg font-bold text-purple-600">
                  {{ config.agent.stats.conversations > 0 ? Math.round((config.agent.stats.conversions / config.agent.stats.conversations) * 100) : 0 }}%
                </span>
              </div>
            </div>
          </div>

          <!-- Quick Actions -->
          <div class="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
            <h3 class="text-lg font-semibold text-gray-900 mb-4">⚡ Actions Rapides</h3>
            <div class="space-y-3">
              <button
                @click="activeTab = 'playground'"
                class="w-full px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors"
              >
                🧪 Tester l'Agent
              </button>
              <button
                @click="activeTab = 'widget'"
                class="w-full px-4 py-2 border border-blue-600 text-blue-600 rounded-lg hover:bg-blue-50 transition-colors"
              >
                🎨 Configurer Widget
              </button>
              <button
                @click="activeTab = 'integration'"
                class="w-full px-4 py-2 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition-colors"
              >
                🔗 Code d'Intégration
              </button>
            </div>
          </div>
        </div>
      </div>

      <!-- ✅ ONGLET 2: CONFIGURATION WIDGET -->
      <div v-if="activeTab === 'widget'" class="grid grid-cols-1 lg:grid-cols-2 gap-8">
        
        <!-- Widget Configuration -->
        <div class="space-y-8">
          
          <!-- Apparence -->
          <div class="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
            <h3 class="text-lg font-semibold text-gray-900 mb-6">🎨 Apparence du Widget</h3>
            
            <div class="space-y-6">
              <!-- Texte du bouton -->
              <div>
                <label class="block text-sm font-medium text-gray-700 mb-2">Texte du bouton</label>
                <input
                  v-model="localConfig.widget.buttonText"
                  type="text"
                  class="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                  placeholder="Parler au vendeur"
                />
              </div>

              <!-- Couleur principale -->
              <div>
                <label class="block text-sm font-medium text-gray-700 mb-3">Couleur principale</label>
                <div class="flex space-x-2 mb-3">
                  <button
                    v-for="color in predefinedColors"
                    :key="color.value"
                    @click="localConfig.widget.primaryColor = color.value"
                    :class="[
                      'w-10 h-10 rounded-full border-2 transition-transform',
                      localConfig.widget.primaryColor === color.value
                        ? 'border-gray-800 scale-110 shadow-lg'
                        : 'border-gray-300 hover:scale-105'
                    ]"
                    :style="{ backgroundColor: color.value }"
                    :title="color.name"
                  ></button>
                </div>
                <div class="flex space-x-2">
                  <input
                    v-model="localConfig.widget.primaryColor"
                    type="color"
                    class="h-10 w-16 border border-gray-300 rounded-lg cursor-pointer"
                  />
                  <input
                    v-model="localConfig.widget.primaryColor"
                    type="text"
                    class="flex-1 px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                    placeholder="#3B82F6"
                  />
                </div>
              </div>

              <!-- Position -->
              <div>
                <label class="block text-sm font-medium text-gray-700 mb-3">Position sur la page</label>
                <div class="grid grid-cols-2 gap-2">
                  <button
                    v-for="position in widgetPositions"
                    :key="position.value"
                    @click="localConfig.widget.position = position.value"
                    :class="[
                      'p-3 border rounded-lg text-sm transition-colors text-left',
                      localConfig.widget.position === position.value
                        ? 'border-blue-500 bg-blue-50 text-blue-700'
                        : 'border-gray-300 hover:border-gray-400'
                    ]"
                  >
                    <div class="font-medium">{{ position.icon }} {{ position.label }}</div>
                    <div class="text-xs text-gray-500 mt-1">{{ position.description }}</div>
                  </button>
                </div>
              </div>

              <!-- Theme et style -->
              <div class="grid grid-cols-2 gap-4">
                <div>
                  <label class="block text-sm font-medium text-gray-700 mb-2">Thème</label>
                  <select v-model="localConfig.widget.theme" class="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500">
                    <option value="modern">🎨 Moderne</option>
                    <option value="minimal">⚡ Minimal</option>
                    <option value="brand_adaptive">🎭 Adaptatif</option>
                  </select>
                </div>
                
                <div>
                  <label class="block text-sm font-medium text-gray-700 mb-2">Taille</label>
                  <select v-model="localConfig.widget.widgetSize" class="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500">
                    <option value="small">📱 Petit</option>
                    <option value="medium">💻 Moyen</option>
                    <option value="large">🖥️ Grand</option>
                  </select>
                </div>
              </div>
            </div>
          </div>

          <!-- Comportement -->
          <div class="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
            <h3 class="text-lg font-semibold text-gray-900 mb-6">⚙️ Comportement</h3>
            
            <div class="space-y-4">
              <div class="flex items-center justify-between p-4 bg-gray-50 rounded-lg">
                <div>
                  <h4 class="text-sm font-medium text-gray-900">Ouverture automatique</h4>
                  <p class="text-xs text-gray-500">Ouvre le chat automatiquement après 5 secondes</p>
                </div>
                <button
                  @click="localConfig.widget.autoOpen = !localConfig.widget.autoOpen"
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

              <div class="flex items-center justify-between p-4 bg-gray-50 rounded-lg">
                <div>
                  <h4 class="text-sm font-medium text-gray-900">Afficher l'avatar</h4>
                  <p class="text-xs text-gray-500">Montre l'avatar de l'agent dans le chat</p>
                </div>
                <button
                  @click="localConfig.widget.showAvatar = !localConfig.widget.showAvatar"
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

              <div class="flex items-center justify-between p-4 bg-gray-50 rounded-lg">
                <div>
                  <h4 class="text-sm font-medium text-gray-900">Son de notification</h4>
                  <p class="text-xs text-gray-500">Son lors de nouveaux messages</p>
                </div>
                <button
                  @click="localConfig.widget.soundEnabled = !localConfig.widget.soundEnabled"
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

              <!-- Widget Status -->
              <div class="flex items-center justify-between p-4 bg-gray-50 rounded-lg">
                <div>
                  <h4 class="text-sm font-medium text-gray-900">Widget actif</h4>
                  <p class="text-xs text-gray-500">Activez ou désactivez le widget sur votre site</p>
                </div>
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
        </div>

        <!-- Widget Preview -->
        <div class="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
          <h3 class="text-lg font-semibold text-gray-900 mb-6">👁️ Aperçu du Widget</h3>
          
          <!-- Mock browser -->
          <div class="border border-gray-300 rounded-lg overflow-hidden">
            <!-- Browser header -->
            <div class="bg-gray-100 px-4 py-2 border-b border-gray-300">
              <div class="flex items-center space-x-2">
                <div class="w-3 h-3 bg-red-400 rounded-full"></div>
                <div class="w-3 h-3 bg-yellow-400 rounded-full"></div>
                <div class="w-3 h-3 bg-green-400 rounded-full"></div>
                <div class="ml-4 text-sm text-gray-600">votre-boutique.com</div>
              </div>
            </div>
            
            <!-- Browser content avec widget preview -->
            <div class="bg-gray-50 h-80 relative p-6">
              <div class="text-center text-gray-400 mt-12">
                <div class="text-3xl mb-4">🛍️</div>
                <div class="text-lg font-medium mb-2">Votre boutique en ligne</div>
                <div class="text-sm">Aperçu du widget sur votre site</div>
              </div>
              
              <!-- Widget preview button -->
              <div 
                :class="[
                  'absolute transition-all duration-300',
                  getWidgetPositionClass(localConfig.widget.position)
                ]"
              >
                <button
                  @click="showChatPreview = !showChatPreview"
                  :style="{ 
                    backgroundColor: localConfig.widget.primaryColor,
                    ...(getWidgetSizeStyles(localConfig.widget.widgetSize))
                  }"
                  :class="[
                    'text-white rounded-lg font-medium transition-all hover:opacity-90 flex items-center justify-center shadow-lg',
                    getWidgetThemeClasses(localConfig.widget.theme)
                  ]"
                >
                  <svg class="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z"/>
                  </svg>
                  {{ localConfig.widget.buttonText }}
                </button>
              </div>
            </div>
          </div>

          <!-- Chat Preview Modal -->
          <div 
            v-if="showChatPreview"
            class="fixed inset-0 z-50 bg-black bg-opacity-50 flex items-center justify-center p-4"
            @click.self="showChatPreview = false"
          >
            <div class="bg-white rounded-lg shadow-xl max-w-md w-full h-96 flex flex-col">
              <div 
                class="p-4 text-white rounded-t-lg"
                :style="{ backgroundColor: localConfig.widget.primaryColor }"
              >
                <div class="flex items-center space-x-3">
                  <div v-if="localConfig.widget.showAvatar" class="w-10 h-10 bg-white bg-opacity-20 rounded-full flex items-center justify-center">
                    <span class="text-sm font-medium">{{ localConfig.agent.name.charAt(0) }}</span>
                  </div>
                  <div>
                    <h4 class="font-medium">{{ localConfig.agent.name }}</h4>
                    <p class="text-xs opacity-90">En ligne</p>
                  </div>
                </div>
              </div>
              <div class="flex-1 p-4 bg-gray-50">
                <div class="bg-white p-3 rounded-lg shadow-sm max-w-xs">
                  <p class="text-sm">{{ localConfig.agent.welcomeMessage }}</p>
                </div>
              </div>
              <div class="p-4 border-t">
                <div class="flex space-x-2">
                  <input 
                    type="text" 
                    placeholder="Tapez votre message..."
                    class="flex-1 px-3 py-2 border rounded-lg text-sm"
                    disabled
                  />
                  <button 
                    class="px-3 py-2 text-white rounded-lg"
                    :style="{ backgroundColor: localConfig.widget.primaryColor }"
                    disabled
                  >
                    <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 19l9 2-9-18-9 18 9-2zm0 0v-8"/>
                    </svg>
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      <!-- ✅ ONGLET 3: PLAYGROUND -->
      <div v-if="activeTab === 'playground'" class="grid grid-cols-1 lg:grid-cols-2 gap-8">
        
        <!-- Chat Interface -->
        <div class="bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden flex flex-col h-[600px]">
          <div 
            class="px-6 py-4 text-white"
            :style="{ background: `linear-gradient(135deg, ${localConfig.widget.primaryColor} 0%, ${adjustColor(localConfig.widget.primaryColor, -20)} 100%)` }"
          >
            <div class="flex items-center space-x-3">
              <div class="w-10 h-10 bg-white bg-opacity-20 rounded-full flex items-center justify-center">
                <span class="text-sm font-medium">{{ localConfig.agent.name.charAt(0) }}</span>
              </div>
              <div>
                <h4 class="font-medium">{{ localConfig.agent.name }}</h4>
                <p class="text-xs text-white text-opacity-90">{{ getTypeLabel(localConfig.agent.type) }} • Test</p>
              </div>
            </div>
          </div>
          
          <div class="flex-1 p-4 overflow-y-auto bg-gray-50" ref="chatContainer">
            <div class="space-y-4">
              <div 
                v-for="message in testMessages" 
                :key="message.id"
                class="flex items-start space-x-2"
                :class="message.role === 'user' ? 'flex-row-reverse space-x-reverse' : ''"
              >
                <div 
                  :class="[
                    'w-8 h-8 rounded-full flex items-center justify-center text-xs font-medium',
                    message.role === 'user' ? 'bg-gray-500 text-white' : 'text-white'
                  ]"
                  :style="message.role === 'assistant' ? { backgroundColor: localConfig.widget.primaryColor } : {}"
                >
                  {{ message.role === 'user' ? 'V' : localConfig.agent.name.charAt(0) }}
                </div>
                <div 
                  :class="[
                    'max-w-xs p-3 rounded-lg text-sm',
                    message.role === 'user' 
                      ? 'bg-gray-500 text-white rounded-tr-sm' 
                      : 'bg-white border border-gray-200 rounded-tl-sm'
                  ]"
                >
                  {{ message.content }}
                  <div v-if="message.loading" class="flex items-center mt-2">
                    <svg class="animate-spin h-3 w-3 mr-2" :class="message.role === 'user' ? 'text-white' : 'text-blue-600'" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15"/>
                    </svg>
                    <span class="text-xs">L'IA réfléchit...</span>
                  </div>
                </div>
              </div>
            </div>
          </div>
          
          <div class="p-4 border-t border-gray-200 bg-white">
            <div class="flex space-x-2">
              <input
                v-model="testMessage"
                @keyup.enter="sendTestMessage"
                type="text"
                placeholder="Tapez votre message de test..."
                class="flex-1 px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                :disabled="sendingTestMessage"
              />
              <button 
                @click="sendTestMessage"
                :disabled="!testMessage.trim() || sendingTestMessage"
                class="px-4 py-2 text-white rounded-lg hover:opacity-90 transition-colors disabled:opacity-50"
                :style="{ backgroundColor: localConfig.widget.primaryColor }"
              >
                <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 19l9 2-9-18-9 18 9-2zm0 0v-8"/>
                </svg>
              </button>
            </div>
          </div>
        </div>

        <!-- Test Controls -->
        <div class="space-y-6">
          
          <!-- Test Scenarios -->
          <div class="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
            <h3 class="text-lg font-semibold text-gray-900 mb-4">🎯 Scénarios de Test</h3>
            <div class="space-y-2">
              <button
                v-for="scenario in testScenarios"
                :key="scenario.id"
                @click="runTestScenario(scenario)"
                class="w-full text-left p-3 border border-gray-200 rounded-lg hover:bg-gray-50 transition-colors"
                :disabled="sendingTestMessage"
              >
                <div class="font-medium text-sm">{{ scenario.title }}</div>
                <div class="text-xs text-gray-500">{{ scenario.description }}</div>
              </button>
            </div>
          </div>

          <!-- Performance -->
          <div class="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
            <h3 class="text-lg font-semibold text-gray-900 mb-4">📊 Performance Test</h3>
            <div class="space-y-3 text-sm">
              <div class="flex justify-between">
                <span>Messages envoyés:</span>
                <span class="font-medium">{{ testMessages.filter(m => m.role === 'user').length }}</span>
              </div>
              <div class="flex justify-between">
                <span>Réponses IA:</span>
                <span class="font-medium">{{ testMessages.filter(m => m.role === 'assistant').length }}</span>
              </div>
              <div class="flex justify-between">
                <span>Session active:</span>
                <span class="font-medium">{{ testSessionActive ? '🟢 Oui' : '🔴 Non' }}</span>
              </div>
            </div>
          </div>

          <!-- Advanced Testing -->
          <div class="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
            <h3 class="text-lg font-semibold text-gray-900 mb-4">🔬 Test Avancé</h3>
            <div class="space-y-3">
              <button
                @click="startAITestSession"
                :disabled="testSessionActive || !isPaidUser"
                class="w-full px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors disabled:opacity-50"
                :title="!isPaidUser ? 'Réservé aux utilisateurs payants (Starter/Pro)' : ''"
              >
                {{ testSessionActive ? '✅ Session Active' : '🚀 Démarrer Test IA' }}
              </button>
              
              <button
                @click="resetTestChat"
                class="w-full px-4 py-2 border border-red-300 text-red-600 rounded-lg hover:bg-red-50 transition-colors"
              >
                🔄 Réinitialiser
              </button>
              
              <div class="text-xs text-gray-500 bg-blue-50 p-3 rounded-lg">
                💡 <strong>Astuce:</strong> Le test IA utilise votre configuration actuelle d'agent. 
                {{ isPaidUser ? 'Testez différents scénarios pour optimiser vos conversions.' : 'Passez au plan Starter pour activer l\'IA réelle.' }}
              </div>
            </div>
          </div>
        </div>
      </div>

      <!-- ✅ ONGLET 4: INTÉGRATION -->
      <div v-if="activeTab === 'integration'" class="max-w-4xl mx-auto">
        
        <!-- Guide d'intégration -->
        <div class="bg-white rounded-xl shadow-sm border border-gray-200 p-8">
          <h3 class="text-2xl font-semibold text-gray-900 mb-6">🔗 Guide d'Intégration</h3>
          
          <!-- Informations de base -->
          <div class="bg-blue-50 border border-blue-200 rounded-lg p-4 mb-8">
            <div class="flex">
              <div class="flex-shrink-0">
                <svg class="h-5 w-5 text-blue-400" fill="currentColor" viewBox="0 0 20 20">
                  <path fill-rule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7-4a1 1 0 11-2 0 1 1 0 012 0zM9 9a1 1 0 000 2v3a1 1 0 001 1h1a1 1 0 100-2v-3a1 1 0 00-1-1H9z" clip-rule="evenodd"/>
                </svg>
              </div>
              <div class="ml-3">
                <h3 class="text-sm font-medium text-blue-800">Instructions d'installation</h3>
                <div class="mt-2 text-sm text-blue-700">
                  <p>Agent: <strong>{{ localConfig.agent.name }}</strong> • Widget: <strong>{{ localConfig.widget.buttonText }}</strong></p>
                  <p>Copiez le code ci-dessous et collez-le juste avant la balise <code>&lt;/body&gt;</code> de votre site web.</p>
                </div>
              </div>
            </div>
          </div>

          <!-- Code d'intégration -->
          <div class="space-y-8">
            
            <!-- Code JavaScript -->
            <div class="border-l-4 border-blue-500 pl-6">
              <h4 class="text-lg font-medium text-gray-900 mb-3">1. Code d'intégration JavaScript</h4>
              <div class="relative">
                <div class="bg-gray-900 rounded-lg p-4 overflow-x-auto">
                  <pre class="text-green-400 text-sm"><code>{{ integrationCode }}</code></pre>
                </div>
                
                <button
                  @click="copyIntegrationCode"
                  class="absolute top-4 right-4 inline-flex items-center px-3 py-1 border border-gray-600 text-xs font-medium rounded text-gray-300 bg-gray-800 hover:bg-gray-700 transition-colors"
                >
                  <svg class="w-4 h-4 mr-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M8 16H6a2 2 0 01-2-2V6a2 2 0 012-2h8a2 2 0 012 2v2m-6 12h8a2 2 0 002-2v-8a2 2 0 00-2-2h-8a2 2 0 00-2 2v8a2 2 0 002 2z"/>
                  </svg>
                  {{ codeCopied ? 'Copié !' : 'Copier' }}
                </button>
              </div>
            </div>

            <!-- Instructions par plateforme -->
            <div class="border-l-4 border-green-500 pl-6">
              <h4 class="text-lg font-medium text-gray-900 mb-3">2. Instructions par plateforme</h4>
              
              <!-- Platform tabs -->
              <div class="flex space-x-1 bg-gray-100 p-1 rounded-lg mb-4">
                <button
                  v-for="platform in platforms"
                  :key="platform.id"
                  @click="activePlatform = platform.id"
                  :class="[
                    'px-3 py-2 text-sm font-medium rounded-md transition-colors',
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
            <div class="border-l-4 border-purple-500 pl-6">
              <h4 class="text-lg font-medium text-gray-900 mb-3">3. Test et validation</h4>
              <div class="space-y-3 text-sm text-gray-600">
                <p><strong>✅ Vérifications à faire:</strong></p>
                <ul class="list-disc list-inside space-y-1 ml-4">
                  <li>Le bouton "{{ localConfig.widget.buttonText }}" apparaît sur votre page</li>
                  <li>Le chat s'ouvre quand vous cliquez sur le bouton</li>
                  <li>L'agent "{{ localConfig.agent.name }}" répond à vos messages</li>
                  <li>La couleur du widget correspond à {{ localConfig.widget.primaryColor }}</li>
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
          <div class="mt-8 p-6 bg-blue-50 border border-blue-200 rounded-lg">
            <h4 class="font-medium text-blue-900 mb-2">🆘 Besoin d'aide ?</h4>
            <p class="text-sm text-blue-800">
              Notre équipe peut vous aider avec l'intégration. Contactez-nous à 
              <a href="mailto:support@chatseller.app" class="underline font-medium">support@chatseller.app</a>
            </p>
          </div>
        </div>
      </div>

      <!-- Message de succès pour copie -->
      <div v-if="codeCopied" class="fixed bottom-4 right-4 bg-green-600 text-white px-6 py-3 rounded-lg shadow-lg z-50">
        <div class="flex items-center">
          <svg class="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M5 13l4 4L19 7"/>
          </svg>
          Code d'intégration copié !
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, computed, onMounted, nextTick, watch } from 'vue'
import { useRouter, useRoute } from 'vue-router'
import { useAuthStore } from '~/stores/auth'
import { useAgentConfig } from '~/composables/useAgentConfig'
import { useAITest } from '~/composables/useAITest'

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
const { 
  loading, 
  saving, 
  error, 
  agentConfig: config, 
  isConfigValid,
  integrationCode,
  fetchAgentConfig,
  saveCompleteConfig,
  copyIntegrationCode,
  clearError
} = useAgentConfig()

const {
  currentSession,
  messages: aiTestMessages,
  sendingMessage: sendingAIMessage,
  isPaidUser,
  startTestSession,
  sendTestMessage: sendAITestMessage,
  endTestSession,
  clearMessages
} = useAITest()

// ✅ REACTIVE STATE
const activeTab = ref('agent')
const activePlatform = ref('shopify')
const successMessage = ref<string | null>(null)
const codeCopied = ref(false)
const showChatPreview = ref(false)

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
      specificInstructions: [] as string[]
    },
    stats: { conversations: 0, conversions: 0 }
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
    isActive: true
  }
})

// ✅ TEST PLAYGROUND STATE
const testMessage = ref('')
const testMessages = ref<any[]>([])
const sendingTestMessage = ref(false)
const testSessionActive = ref(false)
const chatContainer = ref<HTMLElement>()

// ✅ COMPUTED
const agentId = computed(() => route.query.id as string || 'unknown')
const agentName = computed(() => localConfig.value.agent.name || 'Agent IA')

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

const predefinedColors = [
  { value: '#3B82F6', name: 'Bleu' },
  { value: '#10B981', name: 'Vert' },
  { value: '#8B5CF6', name: 'Violet' },
  { value: '#F59E0B', name: 'Orange' },
  { value: '#EF4444', name: 'Rouge' },
  { value: '#E91E63', name: 'Rose' },
  { value: '#6B7280', name: 'Gris' }
]

const widgetPositions = [
  { 
    value: 'above-cta' as WidgetPosition, 
    label: 'Au-dessus du CTA', 
    icon: '⬆️', 
    description: 'Avant le bouton d\'achat' 
  },
  { 
    value: 'below-cta' as WidgetPosition, 
    label: 'En dessous du CTA', 
    icon: '⬇️', 
    description: 'Après le bouton d\'achat' 
  },
  { 
    value: 'beside-cta' as WidgetPosition, 
    label: 'À côté du CTA', 
    icon: '↔️', 
    description: 'En parallèle du bouton' 
  },
  { 
    value: 'bottom-right' as WidgetPosition, 
    label: 'Flottant (bas droite)', 
    icon: '↘️', 
    description: 'Widget flottant classique' 
  }
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
  router.push('/vendeurs-ia')
}

const saveAllConfig = async () => {
  const result = await saveCompleteConfig(agentId.value, {
    agent: localConfig.value.agent,
    widget: localConfig.value.widget
  })

  if (result.success) {
    successMessage.value = '✅ Configuration sauvegardée avec succès !'
    setTimeout(() => {
      successMessage.value = null
    }, 3000)
  }
}

const copyIntegrationCodeAction = async () => {
  const result = await copyIntegrationCode()
  if (result.success) {
    codeCopied.value = true
    setTimeout(() => {
      codeCopied.value = false
    }, 3000)
  }
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

const getWidgetPositionClass = (position: WidgetPosition): string => {
  const classes = {
    'above-cta': 'top-16 left-1/2 transform -translate-x-1/2',
    'below-cta': 'bottom-16 left-1/2 transform -translate-x-1/2',
    'beside-cta': 'top-1/2 right-4 transform -translate-y-1/2',
    'bottom-right': 'bottom-4 right-4',
    'bottom-left': 'bottom-4 left-4'
  }
  return classes[position] || 'bottom-4 right-4'
}

const getWidgetSizeStyles = (size: WidgetSize) => {
  const styles = {
    small: { padding: '8px 16px', fontSize: '14px' },
    medium: { padding: '12px 20px', fontSize: '15px' },
    large: { padding: '16px 24px', fontSize: '16px' }
  }
  return styles[size] || styles.medium
}

const getWidgetThemeClasses = (theme: WidgetTheme): string => {
  const classes = {
    modern: 'rounded-xl',
    minimal: 'rounded-lg',
    brand_adaptive: 'rounded-2xl'
  }
  return classes[theme] || 'rounded-xl'
}

// ✅ AGENT CONFIG HELPERS
const addInstruction = () => {
  localConfig.value.agent.config.specificInstructions.push('')
}

const removeInstruction = (index: number) => {
  localConfig.value.agent.config.specificInstructions.splice(index, 1)
}

// ✅ PLAYGROUND METHODS
const initializeTestChat = () => {
  testMessages.value = [
    {
      id: Date.now().toString(),
      role: 'assistant',
      content: localConfig.value.agent.welcomeMessage || 'Bonjour ! Comment puis-je vous aider ?',
      timestamp: new Date()
    }
  ]
}

const sendTestMessage = async () => {
  if (!testMessage.value.trim() || sendingTestMessage.value) return
  
  const userMessage = testMessage.value.trim()
  testMessage.value = ''
  sendingTestMessage.value = true
  
  // Ajouter message utilisateur
  testMessages.value.push({
    id: Date.now().toString(),
    role: 'user',
    content: userMessage,
    timestamp: new Date()
  })
  
  // Ajouter message de chargement
  const loadingMessage = {
    id: (Date.now() + 1).toString(),
    role: 'assistant',
    content: 'L\'IA réfléchit...',
    timestamp: new Date(),
    loading: true
  }
  testMessages.value.push(loadingMessage)
  
  await nextTick()
  scrollChatToBottom()
  
  try {
    if (testSessionActive.value && isPaidUser.value) {
      // ✅ UTILISER L'IA RÉELLE
      const result = await sendAITestMessage(userMessage)
      
      // Supprimer le message de chargement
      testMessages.value = testMessages.value.filter(m => !m.loading)
      
      if (result) {
        // Les messages sont gérés par le composable useAITest
        // On synchronise avec notre state local
        testMessages.value = [...aiTestMessages.value]
      }
    } else {
      // ✅ SIMULATION POUR UTILISATEURS GRATUITS
      await new Promise(resolve => setTimeout(resolve, 1000))
      
      const responses = [
        `Merci pour votre question ! En tant que ${localConfig.value.agent.name}, je suis là pour vous aider.`,
        'C\'est une excellente question ! Laissez-moi vous expliquer...',
        'Je comprends votre besoin. Voici ce que je peux vous proposer...',
        'Parfait ! C\'est exactement le type de question pour laquelle je suis conçu.',
        localConfig.value.agent.fallbackMessage || 'Je transmets votre question à notre équipe.'
      ]
      
      const randomResponse = responses[Math.floor(Math.random() * responses.length)]
      
      // Remplacer le message de chargement
      const messageIndex = testMessages.value.findIndex(m => m.loading)
      if (messageIndex !== -1) {
        testMessages.value[messageIndex] = {
          id: Date.now().toString(),
          role: 'assistant',
          content: randomResponse,
          timestamp: new Date()
        }
      }
    }
    
  } catch (error) {
    console.error('❌ Erreur test message:', error)
    
    // Remplacer par message d'erreur
    const messageIndex = testMessages.value.findIndex(m => m.loading)
    if (messageIndex !== -1) {
      testMessages.value[messageIndex] = {
        id: Date.now().toString(),
        role: 'assistant',
        content: localConfig.value.agent.fallbackMessage || 'Désolé, je ne peux pas répondre pour le moment.',
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
  sendTestMessage()
}

const startAITestSession = async () => {
  if (!isPaidUser.value) {
    alert('La fonctionnalité de test IA est réservée aux utilisateurs des plans Starter et Pro.')
    return
  }

  const agentPersona = {
    id: localConfig.value.agent.id,
    name: localConfig.value.agent.name,
    type: localConfig.value.agent.type,
    personality: localConfig.value.agent.personality,
    description: localConfig.value.agent.description,
    welcomeMessage: localConfig.value.agent.welcomeMessage,
    fallbackMessage: localConfig.value.agent.fallbackMessage
  }

  const result = await startTestSession(agentPersona)
  if (result) {
    testSessionActive.value = true
    // Synchroniser avec les messages du composable IA
    testMessages.value = [...aiTestMessages.value]
  }
}

const resetTestChat = () => {
  if (testSessionActive.value) {
    endTestSession()
    testSessionActive.value = false
  }
  initializeTestChat()
}

const scrollChatToBottom = () => {
  if (chatContainer.value) {
    chatContainer.value.scrollTop = chatContainer.value.scrollHeight
  }
}

// ✅ WATCH
watch(() => config.value, (newConfig) => {
  if (newConfig) {
    // Synchroniser la config locale avec la config chargée
    localConfig.value = {
      agent: { ...newConfig.agent },
      widget: { ...newConfig.widget }
    }
    
    // Initialiser les instructions spécifiques si elles n'existent pas
    if (!localConfig.value.agent.config.specificInstructions) {
      localConfig.value.agent.config.specificInstructions = []
    }
  }
}, { immediate: true })

// Synchroniser les messages IA avec notre state local
watch(() => aiTestMessages.value, (newMessages) => {
  if (testSessionActive.value && newMessages.length > 0) {
    testMessages.value = [...newMessages]
    nextTick(() => scrollChatToBottom())
  }
}, { deep: true })

// ✅ LIFECYCLE
onMounted(async () => {
  console.log('🚀 [agent-config] Page montée, chargement config agent:', agentId.value)
  
  // Initialiser le chat de test
  initializeTestChat()
  
  // Charger la configuration
  await fetchAgentConfig(agentId.value)
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
</style>