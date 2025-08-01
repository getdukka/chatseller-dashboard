<!-- pages/agent-config.vue - VERSION COMPLÈTE AVEC WIDGET + PLAYGROUND -->
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
                Agent • Widget • Intégration • Test
              </p>
            </div>
          </div>
          
          <div class="flex items-center space-x-3">
            <!-- ✅ NOUVEAU : Navigation par onglets -->
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
              @click="saveConfig"
              :disabled="saving || !isConfigValid"
              class="inline-flex items-center px-4 py-2 bg-blue-600 text-white text-sm font-medium rounded-lg hover:bg-blue-700 disabled:opacity-50 transition-colors"
            >
              <svg v-if="saving" class="w-4 h-4 mr-2 animate-spin" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15"/>
              </svg>
              <svg v-else class="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M8 7H5a2 2 0 00-2 2v9a2 2 0 002 2h14a2 2 0 002-2V9a2 2 0 00-2-2h-3m-1 4l-3 3m0 0l-3-3m3 3V4"/>
              </svg>
              Sauvegarder Tout
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
    </div>

    <!-- Content avec onglets -->
    <div class="p-8">
      <!-- ✅ ONGLET 1: CONFIGURATION AGENT -->
      <div v-if="activeTab === 'agent'" class="grid grid-cols-1 lg:grid-cols-3 gap-8">
        
        <!-- Configuration Panel -->
        <div class="lg:col-span-2 space-y-8">
          
          <!-- Agent Settings -->
          <div class="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
            <h3 class="text-lg font-semibold text-gray-900 mb-6">🤖 Personnalité de l'Agent</h3>
            
            <div class="space-y-6">
              <!-- Nom -->
              <div>
                <label class="block text-sm font-medium text-gray-700 mb-2">Nom de l'agent *</label>
                <input
                  v-model="config.agent.name"
                  type="text"
                  class="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-colors"
                  placeholder="Ex: Sarah, Expert Produits"
                />
              </div>

              <!-- Type + Personnalité en ligne -->
              <div class="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label class="block text-sm font-medium text-gray-700 mb-2">Type de vendeur</label>
                  <select v-model="config.agent.type" class="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500">
                    <option value="general">🎯 Vendeur généraliste</option>
                    <option value="product_specialist">🛍️ Spécialiste produit</option>
                    <option value="support">🆘 Support & SAV</option>
                    <option value="upsell">💎 Upsell Premium</option>
                  </select>
                </div>
                
                <div>
                  <label class="block text-sm font-medium text-gray-700 mb-2">Personnalité</label>
                  <select v-model="config.agent.personality" class="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500">
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
                  v-model="config.agent.description"
                  rows="3"
                  class="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                  placeholder="Ex: Spécialisé dans la vente de produits tech, aide les clients à choisir selon leurs besoins..."
                ></textarea>
              </div>

              <!-- Messages -->
              <div>
                <label class="block text-sm font-medium text-gray-700 mb-2">Message d'accueil *</label>
                <textarea
                  v-model="config.agent.welcomeMessage"
                  rows="3"
                  class="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                  placeholder="Bonjour ! Je suis Sarah, spécialiste produits. Comment puis-je vous aider à trouver le produit parfait ?"
                ></textarea>
                <!-- ✅ NOUVEAU : Aperçu en temps réel -->
                <div class="mt-2 p-3 bg-blue-50 border border-blue-200 rounded-lg">
                  <div class="flex items-start space-x-2">
                    <div class="w-6 h-6 bg-blue-600 rounded-full flex items-center justify-center flex-shrink-0">
                      <span class="text-white text-xs">IA</span>
                    </div>
                    <p class="text-sm text-gray-800">{{ config.agent.welcomeMessage || 'Tapez votre message d\'accueil...' }}</p>
                  </div>
                </div>
              </div>

              <div>
                <label class="block text-sm font-medium text-gray-700 mb-2">Message de fallback</label>
                <textarea
                  v-model="config.agent.fallbackMessage"
                  rows="2"
                  class="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                  placeholder="Je transmets votre question à notre équipe, un conseiller vous recontactera bientôt."
                ></textarea>
              </div>
            </div>
          </div>

          <!-- Commercial Settings -->
          <div class="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
            <h3 class="text-lg font-semibold text-gray-900 mb-6">💼 Configuration Commerciale</h3>
            
            <div class="space-y-6">
              <!-- Collection d'informations -->
              <div>
                <label class="block text-sm font-medium text-gray-700 mb-3">Informations à collecter</label>
                <div class="grid grid-cols-2 gap-2">
                  <label class="flex items-center">
                    <input v-model="config.agent.collectName" type="checkbox" class="rounded border-gray-300 text-blue-600 focus:ring-blue-500">
                    <span class="ml-2 text-sm text-gray-700">👤 Nom complet</span>
                  </label>
                  <label class="flex items-center">
                    <input v-model="config.agent.collectPhone" type="checkbox" class="rounded border-gray-300 text-blue-600 focus:ring-blue-500">
                    <span class="ml-2 text-sm text-gray-700">📞 Téléphone</span>
                  </label>
                  <label class="flex items-center">
                    <input v-model="config.agent.collectEmail" type="checkbox" class="rounded border-gray-300 text-blue-600 focus:ring-blue-500">
                    <span class="ml-2 text-sm text-gray-700">📧 Email</span>
                  </label>
                  <label class="flex items-center">
                    <input v-model="config.agent.collectAddress" type="checkbox" class="rounded border-gray-300 text-blue-600 focus:ring-blue-500">
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
                    @click="config.agent.upsellEnabled = !config.agent.upsellEnabled"
                    :class="[
                      'relative inline-flex h-6 w-11 flex-shrink-0 cursor-pointer rounded-full border-2 border-transparent transition-colors duration-200 ease-in-out focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2',
                      config.agent.upsellEnabled ? 'bg-blue-600' : 'bg-gray-200'
                    ]"
                  >
                    <span
                      :class="[
                        'pointer-events-none inline-block h-5 w-5 transform rounded-full bg-white shadow ring-0 transition duration-200 ease-in-out',
                        config.agent.upsellEnabled ? 'translate-x-5' : 'translate-x-0'
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
                    @click="config.agent.urgencyEnabled = !config.agent.urgencyEnabled"
                    :class="[
                      'relative inline-flex h-6 w-11 flex-shrink-0 cursor-pointer rounded-full border-2 border-transparent transition-colors duration-200 ease-in-out focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2',
                      config.agent.urgencyEnabled ? 'bg-blue-600' : 'bg-gray-200'
                    ]"
                  >
                    <span
                      :class="[
                        'pointer-events-none inline-block h-5 w-5 transform rounded-full bg-white shadow ring-0 transition duration-200 ease-in-out',
                        config.agent.urgencyEnabled ? 'translate-x-5' : 'translate-x-0'
                      ]"
                    ></span>
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
                <span class="capitalize">{{ getTypeLabel(config.agent.type) }}</span>
              </div>
              <div class="flex justify-between">
                <span class="font-medium">Configuration:</span>
                <span :class="isConfigValid ? 'text-green-600' : 'text-red-600'">
                  {{ isConfigValid ? '✅ Valide' : '❌ Invalide' }}
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
              <!-- Position -->
              <div>
                <label class="block text-sm font-medium text-gray-700 mb-3">Position sur la page</label>
                <div class="grid grid-cols-2 gap-2">
                  <button
                    v-for="position in positions"
                    :key="position.value"
                    @click="config.widget.position = position.value"
                    :class="[
                      'p-3 border rounded-lg text-sm transition-colors',
                      config.widget.position === position.value
                        ? 'border-blue-500 bg-blue-50 text-blue-700'
                        : 'border-gray-300 hover:border-gray-400'
                    ]"
                  >
                    {{ position.icon }} {{ position.label }}
                  </button>
                </div>
              </div>

              <!-- Couleurs -->
              <div>
                <label class="block text-sm font-medium text-gray-700 mb-3">Couleur principale</label>
                <div class="flex space-x-2">
                  <button
                    v-for="color in colors"
                    :key="color.value"
                    @click="config.widget.primaryColor = color.value"
                    :class="[
                      'w-8 h-8 rounded-full border-2 transition-transform',
                      config.widget.primaryColor === color.value
                        ? 'border-gray-800 scale-110'
                        : 'border-gray-300'
                    ]"
                    :style="{ backgroundColor: color.value }"
                  ></button>
                </div>
              </div>

              <!-- Texte du bouton -->
              <div>
                <label class="block text-sm font-medium text-gray-700 mb-2">Texte du bouton</label>
                <input
                  v-model="config.widget.buttonText"
                  type="text"
                  class="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                  placeholder="Parler au vendeur"
                />
              </div>

              <!-- Mode -->
              <div>
                <label class="block text-sm font-medium text-gray-700 mb-3">Mode d'affichage</label>
                <div class="space-y-2">
                  <label class="flex items-center">
                    <input v-model="config.widget.autoOpen" type="checkbox" class="rounded border-gray-300 text-blue-600 focus:ring-blue-500">
                    <span class="ml-2 text-sm text-gray-700">Ouverture automatique</span>
                  </label>
                  <label class="flex items-center">
                    <input v-model="config.widget.showAvatar" type="checkbox" class="rounded border-gray-300 text-blue-600 focus:ring-blue-500">
                    <span class="ml-2 text-sm text-gray-700">Afficher l'avatar de l'agent</span>
                  </label>
                </div>
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
            
            <!-- Browser content -->
            <div class="bg-gray-50 h-64 relative p-4">
              <div class="text-center text-gray-400 mt-8">
                <div class="text-2xl mb-2">🛍️</div>
                <div class="text-sm">Votre boutique en ligne</div>
              </div>
              
              <!-- Widget preview -->
              <div 
                :class="[
                  'absolute transition-all duration-300',
                  getWidgetPositionClass(config.widget.position)
                ]"
              >
                <button
                  :style="{ backgroundColor: config.widget.primaryColor }"
                  class="px-4 py-2 text-white rounded-full shadow-lg hover:shadow-xl transition-shadow text-sm font-medium"
                >
                  {{ config.widget.buttonText }}
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>

      <!-- ✅ ONGLET 3: PLAYGROUND -->
      <div v-if="activeTab === 'playground'" class="grid grid-cols-1 lg:grid-cols-2 gap-8">
        
        <!-- Chat Interface -->
        <div class="bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden flex flex-col h-96">
          <div class="bg-gradient-to-r from-blue-600 to-blue-700 px-6 py-4 text-white">
            <div class="flex items-center space-x-3">
              <div class="w-8 h-8 bg-white bg-opacity-20 rounded-full flex items-center justify-center">
                <span class="text-sm font-medium">IA</span>
              </div>
              <div>
                <h4 class="font-medium">{{ config.agent.name }}</h4>
                <p class="text-xs text-blue-100">{{ getTypeLabel(config.agent.type) }}</p>
              </div>
            </div>
          </div>
          
          <div class="flex-1 p-4 overflow-y-auto bg-gray-50" ref="chatContainer">
            <div class="space-y-3">
              <div 
                v-for="message in chatMessages" 
                :key="message.id"
                class="flex items-start space-x-2"
                :class="message.role === 'user' ? 'flex-row-reverse space-x-reverse' : ''"
              >
                <div 
                  :class="[
                    'w-6 h-6 rounded-full flex items-center justify-center text-xs font-medium',
                    message.role === 'user' ? 'bg-gray-500 text-white' : 'bg-blue-600 text-white'
                  ]"
                >
                  {{ message.role === 'user' ? 'U' : 'IA' }}
                </div>
                <div 
                  :class="[
                    'max-w-xs p-3 rounded-lg text-sm',
                    message.role === 'user' 
                      ? 'bg-gray-500 text-white' 
                      : 'bg-white border border-gray-200'
                  ]"
                >
                  {{ message.content }}
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
                :disabled="sendingMessage"
              >
              <button 
                @click="sendTestMessage"
                :disabled="!testMessage.trim() || sendingMessage"
                class="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors disabled:opacity-50"
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
                @click="runScenario(scenario)"
                class="w-full text-left p-3 border border-gray-200 rounded-lg hover:bg-gray-50 transition-colors"
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
                <span class="font-medium">{{ chatMessages.filter(m => m.role === 'user').length }}</span>
              </div>
              <div class="flex justify-between">
                <span>Réponses IA:</span>
                <span class="font-medium">{{ chatMessages.filter(m => m.role === 'assistant').length }}</span>
              </div>
              <div class="flex justify-between">
                <span>Temps de réponse moyen:</span>
                <span class="font-medium">0.8s</span>
              </div>
            </div>
          </div>

          <!-- Reset -->
          <button
            @click="resetChat"
            class="w-full px-4 py-2 border border-red-300 text-red-600 rounded-lg hover:bg-red-50 transition-colors"
          >
            🔄 Réinitialiser la conversation
          </button>
        </div>
      </div>

      <!-- ✅ ONGLET 4: INTÉGRATION -->
      <div v-if="activeTab === 'integration'" class="max-w-4xl mx-auto">
        
        <!-- Guide d'intégration -->
        <div class="bg-white rounded-xl shadow-sm border border-gray-200 p-8">
          <h3 class="text-2xl font-semibold text-gray-900 mb-6">🔗 Guide d'Intégration</h3>
          
          <!-- Étapes -->
          <div class="space-y-8">
            
            <!-- Étape 1 -->
            <div class="border-l-4 border-blue-500 pl-6">
              <h4 class="text-lg font-medium text-gray-900 mb-3">1. Copier le code d'intégration</h4>
              <div class="bg-gray-900 text-green-400 p-4 rounded-lg text-sm overflow-x-auto mb-4">
                <pre><code>{{ integrationCode }}</code></pre>
              </div>
              <button 
                @click="copyCode"
                class="inline-flex items-center px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
              >
                📋 Copier le code
              </button>
            </div>

            <!-- Étape 2 -->
            <div class="border-l-4 border-green-500 pl-6">
              <h4 class="text-lg font-medium text-gray-900 mb-3">2. Ajouter à votre site</h4>
              <div class="space-y-3 text-sm text-gray-600">
                <p><strong>Shopify:</strong> Thème → Actions → Modifier le code → theme.liquid → Coller avant &lt;/body&gt;</p>
                <p><strong>WordPress:</strong> Apparence → Éditeur de thème → footer.php → Coller avant &lt;/body&gt;</p>
                <p><strong>WooCommerce:</strong> Idem WordPress</p>
                <p><strong>Site personnalisé:</strong> Coller dans le HTML de chaque page avant &lt;/body&gt;</p>
              </div>
            </div>

            <!-- Étape 3 -->
            <div class="border-l-4 border-purple-500 pl-6">
              <h4 class="text-lg font-medium text-gray-900 mb-3">3. Tester l'intégration</h4>
              <p class="text-sm text-gray-600 mb-3">
                Une fois le code ajouté, visitez votre boutique et vérifiez que le widget apparaît.
              </p>
              <div class="bg-yellow-50 border border-yellow-200 rounded-lg p-4">
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
              <a href="mailto:support@chatseller.app" class="underline">support@chatseller.app</a>
            </p>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, computed, onMounted, nextTick } from 'vue'

// ✅ PAGE META
definePageMeta({
  middleware: 'auth',
  layout: 'default'
})

// ✅ COMPOSABLES
const route = useRoute()
const router = useRouter()

// ✅ REACTIVE STATE
const saving = ref(false)
const successMessage = ref<string | null>(null)
const activeTab = ref('agent')
const sendingMessage = ref(false)
const testMessage = ref('')
const chatMessages = ref<any[]>([])
const chatContainer = ref<HTMLElement | null>(null)

// ✅ COMPUTED PROPERTIES
const agentId = computed(() => route.query.id as string || 'unknown')
const agentName = computed(() => route.query.name as string || 'Agent IA')

// ✅ DATA
const tabs = [
  { id: 'agent', name: 'Agent', icon: '🤖' },
  { id: 'widget', name: 'Widget', icon: '🎨' },
  { id: 'playground', name: 'Test', icon: '🧪' },
  { id: 'integration', name: 'Intégration', icon: '🔗' }
]

const positions = [
  { value: 'bottom-right', label: 'Bas droite', icon: '↘️' },
  { value: 'bottom-left', label: 'Bas gauche', icon: '↙️' },
  { value: 'top-right', label: 'Haut droite', icon: '↗️' },
  { value: 'top-left', label: 'Haut gauche', icon: '↖️' }
]

const colors = [
  { value: '#3B82F6', name: 'Bleu' },
  { value: '#10B981', name: 'Vert' },
  { value: '#8B5CF6', name: 'Violet' },
  { value: '#F59E0B', name: 'Orange' },
  { value: '#EF4444', name: 'Rouge' },
  { value: '#6B7280', name: 'Gris' }
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
  }
]

// ✅ CONFIGURATION STATE UNIFIÉE
const config = ref({
  agent: {
    name: route.query.name as string || 'Agent IA',
    type: route.query.type as string || 'general',
    personality: 'friendly',
    description: route.query.description as string || '',
    welcomeMessage: route.query.welcomeMessage as string || 'Bonjour ! Comment puis-je vous aider aujourd\'hui ?',
    fallbackMessage: route.query.fallbackMessage as string || 'Je transmets votre question à notre équipe.',
    collectName: true,
    collectPhone: true,
    collectEmail: true,
    collectAddress: false,
    upsellEnabled: false,
    urgencyEnabled: false
  },
  widget: {
    position: 'bottom-right',
    primaryColor: '#3B82F6',
    buttonText: 'Parler au vendeur',
    autoOpen: false,
    showAvatar: true
  }
})

// ✅ COMPUTED
const isConfigValid = computed(() => {
  return config.value.agent.name.trim().length > 0 && 
         config.value.agent.welcomeMessage.trim().length > 0
})

const integrationCode = computed(() => {
  return `<script>
(function() {
  var script = document.createElement('script');
  script.src = 'https://widget.chatseller.app/widget.js';
  script.setAttribute('data-agent-id', '${agentId.value}');
  script.setAttribute('data-shop-id', 'your-shop-id');
  script.setAttribute('data-config', '${JSON.stringify(config.value)}');
  document.head.appendChild(script);
})();
<\/script>`
})

// ✅ METHODS
const goBack = () => {
  router.push('/vendeurs-ia')
}

const saveConfig = async () => {
  saving.value = true
  successMessage.value = null

  try {
    // Simulation
    await new Promise(resolve => setTimeout(resolve, 1000))
    successMessage.value = '✅ Configuration complète sauvegardée !'
    
    setTimeout(() => {
      successMessage.value = null
    }, 3000)
  } catch (error) {
    console.error('❌ Erreur sauvegarde:', error)
  } finally {
    saving.value = false
  }
}

const getTypeLabel = (type: string) => {
  const labels: Record<string, string> = {
    general: 'Vendeur généraliste',
    product_specialist: 'Spécialiste produit',
    support: 'Support & SAV',
    upsell: 'Upsell & Cross-sell'
  }
  return labels[type] || type
}

const getWidgetPositionClass = (position: string) => {
  const classes: Record<string, string> = {
    'bottom-right': 'bottom-4 right-4',
    'bottom-left': 'bottom-4 left-4',
    'top-right': 'top-4 right-4',
    'top-left': 'top-4 left-4'
  }
  return classes[position] || 'bottom-4 right-4'
}

const copyCode = async () => {
  try {
    await navigator.clipboard.writeText(integrationCode.value)
    successMessage.value = '📋 Code d\'intégration copié !'
    setTimeout(() => { successMessage.value = null }, 3000)
  } catch (err) {
    console.error('Erreur copie:', err)
  }
}

// ✅ PLAYGROUND METHODS
const initializeChat = () => {
  chatMessages.value = [
    {
      id: Date.now().toString(),
      role: 'assistant',
      content: config.value.agent.welcomeMessage,
      timestamp: new Date()
    }
  ]
}

const sendTestMessage = async () => {
  if (!testMessage.value.trim() || sendingMessage.value) return
  
  const userMessage = testMessage.value.trim()
  testMessage.value = ''
  sendingMessage.value = true
  
  // Ajouter message utilisateur
  chatMessages.value.push({
    id: Date.now().toString(),
    role: 'user',
    content: userMessage,
    timestamp: new Date()
  })
  
  // Simuler réponse IA
  await new Promise(resolve => setTimeout(resolve, 1000))
  
  const responses = [
    `Merci pour votre question ! En tant que ${config.value.agent.name}, je suis là pour vous aider.`,
    'C\'est une excellente question ! Laissez-moi vous expliquer...',
    'Je comprends votre besoin. Voici ce que je peux vous proposer...',
    'Parfait ! C\'est exactement le type de question pour laquelle je suis conçu.'
  ]
  
  chatMessages.value.push({
    id: (Date.now() + 1).toString(),
    role: 'assistant',
    content: responses[Math.floor(Math.random() * responses.length)],
    timestamp: new Date()
  })
  
  sendingMessage.value = false
  
  // Scroll vers le bas
  await nextTick()
  if (chatContainer.value) {
    chatContainer.value.scrollTop = chatContainer.value.scrollHeight
  }
}

const runScenario = async (scenario: any) => {
  testMessage.value = scenario.message
  await sendTestMessage()
}

const resetChat = () => {
  initializeChat()
}

// ✅ LIFECYCLE
onMounted(() => {
  initializeChat()
})

// ✅ SEO
useHead({
  title: computed(() => `${agentName.value} - Configuration Complète - ChatSeller`)
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
</style>