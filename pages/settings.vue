<!-- pages/settings.vue - PAGE PARAMÈTRES RÉORGANISÉE SELON SPÉCIFICATIONS -->
<template>
  <div class="min-h-screen bg-gray-50">
    <!-- Header -->
    <div class="bg-white shadow-sm border-b border-gray-200">
      <div class="px-8 py-6">
        <div class="flex items-center justify-between">
          <div>
            <h1 class="text-3xl font-bold text-gray-900">Paramètres ChatSeller</h1>
            <p class="mt-2 text-gray-600">
              Configurez votre widget et gérez votre compte
            </p>
          </div>
          
          <div class="flex items-center space-x-4">
            <button
              @click="handleResetToDefaults"
              :disabled="saving"
              class="inline-flex items-center px-4 py-2 border border-gray-300 rounded-lg text-sm font-medium text-gray-700 bg-white hover:bg-gray-50 disabled:opacity-50 transition-colors"
            >
              <svg class="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15"/>
              </svg>
              Réinitialiser
            </button>
            
            <button
              @click="handleSaveSettings"
              :disabled="saving"
              class="inline-flex items-center px-4 py-2 bg-blue-600 text-white text-sm font-medium rounded-lg hover:bg-blue-700 disabled:opacity-50 transition-colors"
            >
              <svg v-if="saving" class="animate-spin -ml-1 mr-2 h-4 w-4 text-white" fill="none" viewBox="0 0 24 24">
                <circle class="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" stroke-width="4"></circle>
                <path class="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
              </svg>
              <svg v-else class="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M5 13l4 4L19 7"/>
              </svg>
              {{ saving ? 'Sauvegarde...' : 'Sauvegarder' }}
            </button>
          </div>
        </div>
      </div>
    </div>

    <!-- Content -->
    <div class="p-8">
      <!-- Tabs Navigation -->
      <div class="border-b border-gray-200 mb-8">
        <nav class="-mb-px flex space-x-8">
          <button
            v-for="tab in tabs"
            :key="tab.id"
            @click="setActiveTab(tab.id)"
            :class="[
              'py-3 px-1 border-b-2 font-medium text-sm transition-colors',
              activeTab === tab.id
                ? 'border-blue-500 text-blue-600'
                : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
            ]"
          >
            <svg class="w-5 h-5 mr-2 inline" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" :d="tab.icon"/>
            </svg>
            {{ tab.label }}
          </button>
        </nav>
      </div>

      <!-- Tab Content -->
      <div class="max-w-6xl">
        
        <!-- ✅ ONGLET WIDGET - CONFIGURATION SEULEMENT (PAS DE VENDEUR IA) -->
        <div v-show="activeTab === 'widget'" class="space-y-8">
          <div class="grid grid-cols-1 lg:grid-cols-2 gap-8">
            <!-- Widget Configuration -->
            <div class="card-modern">
              <div class="flex items-center mb-6">
                <div class="p-2 bg-purple-100 rounded-lg mr-3">
                  <svg class="w-6 h-6 text-purple-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M7 21a4 4 0 01-4-4V5a2 2 0 012-2h4a2 2 0 012 2v12a4 4 0 01-4 4zM21 5a2 2 0 00-2-2h-4a2 2 0 00-2 2v12a4 4 0 004 4h4a2 2 0 002-2V5z"/>
                  </svg>
                </div>
                <h3 class="text-lg font-semibold text-gray-900">Configuration du widget</h3>
              </div>
              
              <div class="space-y-6">
                <!-- Button Text -->
                <div>
                  <label class="block text-sm font-medium text-gray-700 mb-2">
                    Texte du bouton d'ouverture
                  </label>
                  <input
                    v-model="widgetSettings.buttonText"
                    type="text"
                    class="input-modern w-full"
                    placeholder="Parler à un conseiller"
                  >
                  <p class="text-xs text-gray-500 mt-1">Texte affiché sur le bouton pour ouvrir le chat</p>
                </div>

                <!-- Primary Color -->
                <div>
                  <label class="block text-sm font-medium text-gray-700 mb-2">
                    Couleur principale
                  </label>
                  <div class="flex items-center space-x-3">
                    <input
                      v-model="widgetSettings.primaryColor"
                      type="color"
                      class="h-12 w-16 border border-gray-300 rounded-lg cursor-pointer"
                    >
                    <input
                      v-model="widgetSettings.primaryColor"
                      type="text"
                      class="input-modern flex-1"
                      placeholder="#3B82F6"
                    >
                  </div>
                  <p class="text-xs text-gray-500 mt-1">Couleur utilisée pour les boutons et éléments actifs</p>
                </div>

                <!-- Position -->
                <div>
                  <label class="block text-sm font-medium text-gray-700 mb-3">
                    Position du bouton
                  </label>
                  <div class="grid grid-cols-1 gap-3">
                    <label class="position-option" :class="{ 'selected': widgetSettings.position === 'above-cta' }">
                      <input
                        v-model="widgetSettings.position"
                        type="radio"
                        value="above-cta"
                        class="sr-only"
                      >
                      <div class="flex items-center space-x-2">
                        <div class="w-4 h-4 border-2 rounded-full" :class="widgetSettings.position === 'above-cta' ? 'border-blue-500 bg-blue-500' : 'border-gray-300'"></div>
                        <span class="text-sm">Au-dessus du bouton CTA</span>
                      </div>
                    </label>
                    <label class="position-option" :class="{ 'selected': widgetSettings.position === 'below-cta' }">
                      <input
                        v-model="widgetSettings.position"
                        type="radio"
                        value="below-cta"
                        class="sr-only"
                      >
                      <div class="flex items-center space-x-2">
                        <div class="w-4 h-4 border-2 rounded-full" :class="widgetSettings.position === 'below-cta' ? 'border-blue-500 bg-blue-500' : 'border-gray-300'"></div>
                        <span class="text-sm">En dessous du bouton CTA</span>
                      </div>
                    </label>
                    <label class="position-option" :class="{ 'selected': widgetSettings.position === 'beside-cta' }">
                      <input
                        v-model="widgetSettings.position"
                        type="radio"
                        value="beside-cta"
                        class="sr-only"
                      >
                      <div class="flex items-center space-x-2">
                        <div class="w-4 h-4 border-2 rounded-full" :class="widgetSettings.position === 'beside-cta' ? 'border-blue-500 bg-blue-500' : 'border-gray-300'"></div>
                        <span class="text-sm">À côté du bouton CTA</span>
                      </div>
                    </label>
                  </div>
                </div>

                <!-- Widget Size -->
                <div>
                  <label class="block text-sm font-medium text-gray-700 mb-2">
                    Taille du widget
                  </label>
                  <select v-model="widgetSettings.widgetSize" class="input-modern w-full">
                    <option value="small">Petit</option>
                    <option value="medium">Moyen</option>
                    <option value="large">Grand</option>
                  </select>
                </div>

                <!-- Widget Status -->
                <div class="flex items-center justify-between p-4 bg-gray-50 rounded-lg">
                  <div>
                    <h4 class="text-sm font-medium text-gray-900">Widget actif</h4>
                    <p class="text-xs text-gray-500">Activez ou désactivez le widget sur votre site</p>
                  </div>
                  <button
                    @click="toggleWidgetStatus"
                    :class="[
                      'relative inline-flex h-6 w-11 flex-shrink-0 cursor-pointer rounded-full border-2 border-transparent transition-colors duration-200 ease-in-out focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2',
                      widgetSettings.isActive ? 'bg-blue-600' : 'bg-gray-200'
                    ]"
                  >
                    <span class="sr-only">{{ widgetSettings.isActive ? 'Désactiver' : 'Activer' }} le widget</span>
                    <span
                      :class="[
                        'pointer-events-none inline-block h-5 w-5 transform rounded-full bg-white shadow ring-0 transition duration-200 ease-in-out',
                        widgetSettings.isActive ? 'translate-x-5' : 'translate-x-0'
                      ]"
                    ></span>
                  </button>
                </div>
              </div>
            </div>

            <!-- Widget Theme Options -->
            <div class="card-modern">
              <div class="flex items-center mb-6">
                <div class="p-2 bg-indigo-100 rounded-lg mr-3">
                  <svg class="w-6 h-6 text-indigo-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M7 21a4 4 0 01-4-4V5a2 2 0 012-2h4a2 2 0 012 2v12a4 4 0 01-4 4zM21 5a2 2 0 00-2-2h-4a2 2 0 00-2 2v12a4 4 0 004 4h4a2 2 0 002-2V5z"/>
                  </svg>
                </div>
                <h3 class="text-lg font-semibold text-gray-900">Style et thème</h3>
              </div>
              
              <div class="space-y-6">
                <!-- Theme Selection -->
                <div>
                  <label class="block text-sm font-medium text-gray-700 mb-3">
                    Style du widget
                  </label>
                  <div class="grid grid-cols-2 gap-3">
                    <label class="theme-option" :class="{ 'selected': widgetSettings.theme === 'modern' }">
                      <input
                        v-model="widgetSettings.theme"
                        type="radio"
                        value="modern"
                        class="sr-only"
                      >
                      <div class="p-3 border rounded-lg cursor-pointer transition-all">
                        <div class="w-full h-12 bg-gradient-to-r from-blue-500 to-blue-600 rounded mb-2"></div>
                        <span class="text-xs font-medium">Moderne</span>
                      </div>
                    </label>
                    <label class="theme-option" :class="{ 'selected': widgetSettings.theme === 'classic' }">
                      <input
                        v-model="widgetSettings.theme"
                        type="radio"
                        value="classic"
                        class="sr-only"
                      >
                      <div class="p-3 border rounded-lg cursor-pointer transition-all">
                        <div class="w-full h-12 bg-gray-600 rounded mb-2"></div>
                        <span class="text-xs font-medium">Classique</span>
                      </div>
                    </label>
                  </div>
                </div>

                <!-- Corner Radius -->
                <div>
                  <label class="block text-sm font-medium text-gray-700 mb-2">
                    Arrondis des coins
                  </label>
                  <select v-model="widgetSettings.borderRadius" class="input-modern w-full">
                    <option value="none">Aucun (carré)</option>
                    <option value="sm">Petit</option>
                    <option value="md">Moyen</option>
                    <option value="lg">Grand</option>
                    <option value="full">Arrondi complet</option>
                  </select>
                </div>

                <!-- Animation -->
                <div>
                  <label class="block text-sm font-medium text-gray-700 mb-2">
                    Animation d'entrée
                  </label>
                  <select v-model="widgetSettings.animation" class="input-modern w-full">
                    <option value="fade">Fondu</option>
                    <option value="slide">Glissement</option>
                    <option value="bounce">Rebond</option>
                    <option value="none">Aucune</option>
                  </select>
                </div>

                <!-- Sound -->
                <div class="flex items-center justify-between p-4 bg-gray-50 rounded-lg">
                  <div>
                    <h4 class="text-sm font-medium text-gray-900">Son de notification</h4>
                    <p class="text-xs text-gray-500">Son lors de nouveaux messages</p>
                  </div>
                  <button
                    @click="widgetSettings.soundEnabled = !widgetSettings.soundEnabled"
                    :class="[
                      'relative inline-flex h-6 w-11 flex-shrink-0 cursor-pointer rounded-full border-2 border-transparent transition-colors duration-200 ease-in-out focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2',
                      widgetSettings.soundEnabled ? 'bg-blue-600' : 'bg-gray-200'
                    ]"
                  >
                    <span
                      :class="[
                        'pointer-events-none inline-block h-5 w-5 transform rounded-full bg-white shadow ring-0 transition duration-200 ease-in-out',
                        widgetSettings.soundEnabled ? 'translate-x-5' : 'translate-x-0'
                      ]"
                    ></span>
                  </button>
                </div>
              </div>
            </div>
          </div>

          <!-- Widget Preview -->
          <div class="card-modern">
            <div class="flex items-center mb-6">
              <div class="p-2 bg-green-100 rounded-lg mr-3">
                <svg class="w-6 h-6 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M15 12a3 3 0 11-6 0 3 3 0 016 0z"/>
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z"/>
                </svg>
              </div>
              <h3 class="text-lg font-semibold text-gray-900">Aperçu du widget</h3>
            </div>
            
            <div class="bg-gray-100 rounded-lg p-6 relative overflow-hidden" style="height: 500px;">
              <!-- Simulated E-commerce Page -->
              <div class="bg-white rounded-lg h-full shadow-sm border border-gray-200 relative overflow-y-auto">
                <!-- Browser Header -->
                <div class="h-10 bg-gray-50 border-b border-gray-200 flex items-center px-4">
                  <div class="flex space-x-2">
                    <div class="w-3 h-3 bg-red-400 rounded-full"></div>
                    <div class="w-3 h-3 bg-yellow-400 rounded-full"></div>
                    <div class="w-3 h-3 bg-green-400 rounded-full"></div>
                  </div>
                  <div class="flex-1 text-center text-sm text-gray-500">boutique-exemple.com/produit</div>
                </div>
                
                <!-- Product Page Content -->
                <div class="p-6">
                  <div class="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <!-- Product Image -->
                    <div class="aspect-square bg-gray-200 rounded-lg flex items-center justify-center">
                      <svg class="w-16 h-16 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z"/>
                      </svg>
                    </div>
                    
                    <!-- Product Info -->
                    <div>
                      <h1 class="text-2xl font-bold text-gray-900 mb-2">Produit Exemple</h1>
                      <p class="text-xl text-blue-600 font-semibold mb-4">199€</p>
                      <p class="text-gray-600 text-sm mb-6">Description du produit ici...</p>
                      
                      <!-- CTA Section avec Widget -->
                      <div class="space-y-3">
                        <!-- Widget Button Position: Above CTA -->
                        <div v-if="widgetSettings.isActive && widgetSettings.position === 'above-cta'" class="widget-button-container">
                          <button 
                            @click="showChatPreview = !showChatPreview"
                            class="widget-trigger-button"
                            :class="getWidgetButtonClasses()"
                            :style="{ backgroundColor: widgetSettings.primaryColor }"
                          >
                            <svg class="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z"/>
                            </svg>
                            {{ widgetSettings.buttonText }}
                          </button>
                        </div>
                        
                        <!-- Main CTA Button -->
                        <div class="flex space-x-3">
                          <button class="flex-1 bg-black text-white py-3 px-6 rounded-lg font-medium">
                            Ajouter au panier
                          </button>
                          
                          <!-- Widget Button Position: Beside CTA -->
                          <div v-if="widgetSettings.isActive && widgetSettings.position === 'beside-cta'">
                            <button 
                              @click="showChatPreview = !showChatPreview"
                              class="widget-trigger-button-small"
                              :class="getWidgetButtonClasses()"
                              :style="{ backgroundColor: widgetSettings.primaryColor }"
                            >
                              <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z"/>
                              </svg>
                            </button>
                          </div>
                        </div>
                        
                        <!-- Widget Button Position: Below CTA -->
                        <div v-if="widgetSettings.isActive && widgetSettings.position === 'below-cta'" class="widget-button-container">
                          <button 
                            @click="showChatPreview = !showChatPreview"
                            class="widget-trigger-button"
                            :class="getWidgetButtonClasses()"
                            :style="{ backgroundColor: widgetSettings.primaryColor }"
                          >
                            <svg class="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z"/>
                            </svg>
                            {{ widgetSettings.buttonText }}
                          </button>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
              
              <!-- Chat Interface Preview -->
              <div 
                v-if="showChatPreview && widgetSettings.isActive"
                class="absolute inset-4 bg-white rounded-lg shadow-2xl border border-gray-200 flex flex-col z-10"
                :class="getChatPreviewClasses()"
              >
                <!-- Chat Header -->
                <div class="flex items-center justify-between p-4 border-b border-gray-200" :style="{ backgroundColor: widgetSettings.primaryColor }">
                  <div class="flex items-center space-x-3">
                    <div class="w-8 h-8 bg-white bg-opacity-20 rounded-full flex items-center justify-center">
                      <span class="text-white text-sm font-medium">V</span>
                    </div>
                    <div>
                      <h3 class="text-white font-medium text-sm">Vendeur IA</h3>
                      <p class="text-white text-opacity-80 text-xs">En ligne</p>
                    </div>
                  </div>
                  <button 
                    @click="showChatPreview = false"
                    class="text-white text-opacity-80 hover:text-opacity-100"
                  >
                    <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12"/>
                    </svg>
                  </button>
                </div>
                
                <!-- Chat Messages -->
                <div class="flex-1 p-4 space-y-4 overflow-y-auto">
                  <!-- Bot Welcome Message -->
                  <div class="flex items-start space-x-2">
                    <div class="w-6 h-6 rounded-full flex items-center justify-center text-xs font-medium text-white" :style="{ backgroundColor: widgetSettings.primaryColor }">
                      V
                    </div>
                    <div class="bg-gray-100 rounded-lg rounded-tl-none p-3 max-w-xs">
                      <p class="text-sm text-gray-800">Bonjour ! Comment puis-je vous aider avec ce produit ?</p>
                    </div>
                  </div>
                  
                  <!-- Quick Action Buttons -->
                  <div class="space-y-2">
                    <button class="quick-action-button">
                      🛍️ Je veux l'acheter maintenant
                    </button>
                    <button class="quick-action-button">
                      ❓ J'ai des questions à poser
                    </button>
                    <button class="quick-action-button">
                      📋 Je veux en savoir plus
                    </button>
                  </div>
                </div>
                
                <!-- Chat Input -->
                <div class="p-4 border-t border-gray-200">
                  <div class="flex items-center space-x-2">
                    <input 
                      type="text" 
                      placeholder="Tapez votre message..."
                      class="flex-1 px-3 py-2 border border-gray-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
                      disabled
                    >
                    <button 
                      class="p-2 rounded-lg text-white"
                      :style="{ backgroundColor: widgetSettings.primaryColor }"
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

        <!-- ✅ ONGLET INTÉGRATION - INCHANGÉ -->
        <div v-show="activeTab === 'integration'" class="space-y-8">
          <div class="card-modern">
            <div class="flex items-center mb-6">
              <div class="p-2 bg-indigo-100 rounded-lg mr-3">
                <svg class="w-6 h-6 text-indigo-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M10 20l4-16m4 4l4 4-4 4M6 16l-4-4 4-4"/>
                </svg>
              </div>
              <h3 class="text-lg font-semibold text-gray-900">Code d'intégration</h3>
            </div>
            
            <div class="space-y-6">
              <div class="bg-blue-50 border border-blue-200 rounded-lg p-4">
                <div class="flex">
                  <div class="flex-shrink-0">
                    <svg class="h-5 w-5 text-blue-400" fill="currentColor" viewBox="0 0 20 20">
                      <path fill-rule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7-4a1 1 0 11-2 0 1 1 0 012 0zM9 9a1 1 0 000 2v3a1 1 0 001 1h1a1 1 0 100-2v-3a1 1 0 00-1-1H9z" clip-rule="evenodd"/>
                    </svg>
                  </div>
                  <div class="ml-3">
                    <h3 class="text-sm font-medium text-blue-800">Instructions d'installation</h3>
                    <div class="mt-2 text-sm text-blue-700">
                      <p>Copiez le code ci-dessous et collez-le juste avant la balise <code>&lt;/body&gt;</code> de votre site web.</p>
                    </div>
                  </div>
                </div>
              </div>

              <div class="relative">
                <div class="bg-gray-900 rounded-lg p-4 overflow-x-auto">
                  <pre class="text-green-400 text-sm"><code>{{ widgetCodeDisplay }}</code></pre>
                </div>
                
                <button
                  @click="handleCopyWidgetCode"
                  class="absolute top-4 right-4 inline-flex items-center px-3 py-1 border border-gray-600 text-xs font-medium rounded text-gray-300 bg-gray-800 hover:bg-gray-700 transition-colors"
                >
                  <svg class="w-4 h-4 mr-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M8 16H6a2 2 0 01-2-2V6a2 2 0 012-2h8a2 2 0 012 2v2m-6 12h8a2 2 0 002-2v-8a2 2 0 00-2-2h-8a2 2 0 00-2 2v8a2 2 0 002 2z"/>
                  </svg>
                  {{ copied ? 'Copié !' : 'Copier' }}
                </button>
              </div>

              <div v-if="copied" class="success-message">
                <div class="flex">
                  <div class="flex-shrink-0">
                    <svg class="h-5 w-5 text-green-400" fill="currentColor" viewBox="0 0 20 20">
                      <path fill-rule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clip-rule="evenodd"/>
                    </svg>
                  </div>
                  <div class="ml-3">
                    <p class="text-sm text-green-800">✅ Code copié dans le presse-papier !</p>
                  </div>
                </div>
              </div>

              <!-- Platform Specific Instructions -->
              <div class="grid grid-cols-1 md:grid-cols-3 gap-6">
                <div class="platform-card">
                  <div class="platform-icon bg-green-100">
                    <svg class="w-6 h-6 text-green-600" fill="currentColor" viewBox="0 0 24 24">
                      <path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm-2 15l-5-5 1.41-1.41L10 14.17l7.59-7.59L19 8l-9 9z"/>
                    </svg>
                  </div>
                  <h4 class="text-sm font-medium text-gray-900">Shopify</h4>
                  <p class="text-xs text-gray-500">Thème → Actions → Modifier le code → theme.liquid</p>
                </div>

                <div class="platform-card">
                  <div class="platform-icon bg-blue-100">
                    <svg class="w-6 h-6 text-blue-600" fill="currentColor" viewBox="0 0 24 24">
                      <path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm-2 15l-5-5 1.41-1.41L10 14.17l7.59-7.59L19 8l-9 9z"/>
                    </svg>
                  </div>
                  <h4 class="text-sm font-medium text-gray-900">WordPress</h4>
                  <p class="text-xs text-gray-500">Apparence → Éditeur de thème → footer.php</p>
                </div>

                <div class="platform-card">
                  <div class="platform-icon bg-purple-100">
                    <svg class="w-6 h-6 text-purple-600" fill="currentColor" viewBox="0 0 24 24">
                      <path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm-2 15l-5-5 1.41-1.41L10 14.17l7.59-7.59L19 8l-9 9z"/>
                    </svg>
                  </div>
                  <h4 class="text-sm font-medium text-gray-900">Site personnalisé</h4>
                  <p class="text-xs text-gray-500">Avant la balise &lt;/body&gt;</p>
                </div>
              </div>
            </div>
          </div>
        </div>

        <!-- ✅ NOUVEL ONGLET COMPTE - CONTENU DE PROFILE.VUE INTÉGRÉ -->
        <div v-show="activeTab === 'compte'" class="space-y-8">
          <div class="grid grid-cols-1 lg:grid-cols-3 gap-8">
            
            <!-- Colonne principale -->
            <div class="lg:col-span-2 space-y-8">
              
              <!-- Informations personnelles -->
              <div class="card-modern">
                <div class="flex items-center justify-between mb-6">
                  <h2 class="text-xl font-semibold text-gray-900">Informations personnelles</h2>
                  <button 
                    @click="editingProfile = !editingProfile"
                    class="inline-flex items-center px-4 py-2 text-sm font-medium rounded-xl transition-all duration-200"
                    :class="editingProfile 
                      ? 'bg-gray-100 text-gray-700 hover:bg-gray-200' 
                      : 'bg-blue-50 text-blue-700 hover:bg-blue-100'"
                  >
                    <svg class="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" />
                    </svg>
                    {{ editingProfile ? 'Annuler' : 'Modifier' }}
                  </button>
                </div>

                <form @submit.prevent="updateProfile" class="space-y-6">
                  <!-- Nom -->
                  <div>
                    <label for="name" class="block text-sm font-medium text-gray-700 mb-2">
                      Nom complet
                    </label>
                    <input
                      id="name"
                      v-model="profileForm.name"
                      type="text"
                      :disabled="!editingProfile"
                      class="input-modern w-full disabled:bg-gray-50 disabled:text-gray-500"
                      placeholder="Votre nom complet"
                    />
                  </div>

                  <!-- Email -->
                  <div>
                    <label for="email" class="block text-sm font-medium text-gray-700 mb-2">
                      Adresse email
                    </label>
                    <input
                      id="email"
                      v-model="profileForm.email"
                      type="email"
                      :disabled="!editingProfile"
                      class="input-modern w-full disabled:bg-gray-50 disabled:text-gray-500"
                      placeholder="votre@email.com"
                    />
                  </div>

                  <!-- Boutons d'action -->
                  <div v-if="editingProfile" class="flex items-center space-x-4 pt-4">
                    <button
                      type="submit"
                      :disabled="updating"
                      class="inline-flex items-center px-6 py-3 bg-blue-600 text-white font-medium rounded-xl hover:bg-blue-700 focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 transition-all duration-200 disabled:opacity-50 disabled:cursor-not-allowed"
                    >
                      <svg v-if="updating" class="animate-spin -ml-1 mr-3 h-4 w-4 text-white" fill="none" viewBox="0 0 24 24">
                        <circle class="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" stroke-width="4"></circle>
                        <path class="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                      </svg>
                      {{ updating ? 'Mise à jour...' : 'Sauvegarder les modifications' }}
                    </button>
                    <button
                      type="button"
                      @click="cancelEdit"
                      class="inline-flex items-center px-6 py-3 bg-white text-gray-700 font-medium rounded-xl border border-gray-200 hover:bg-gray-50 focus:ring-2 focus:ring-gray-500 focus:ring-offset-2 transition-all duration-200"
                    >
                      Annuler
                    </button>
                  </div>
                </form>
              </div>

              <!-- Informations du shop -->
              <div class="card-modern">
                <h2 class="text-xl font-semibold text-gray-900 mb-6">Informations de la boutique</h2>
                
                <div class="grid grid-cols-1 sm:grid-cols-2 gap-6">
                  <div>
                    <label class="block text-sm font-medium text-gray-700 mb-2">ID de la boutique</label>
                    <div class="flex items-center space-x-2">
                      <input
                        :value="authStore.userShopId"
                        readonly
                        class="flex-1 input-modern bg-gray-50 text-gray-500 text-sm font-mono"
                      />
                      <button
                        @click="copyShopId"
                        class="inline-flex items-center justify-center w-10 h-10 rounded-xl bg-blue-50 text-blue-600 hover:bg-blue-100 transition-all duration-200"
                        title="Copier l'ID"
                      >
                        <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M8 16H6a2 2 0 01-2-2V6a2 2 0 012-2h8a2 2 0 012 2v2m-6 12h8a2 2 0 002-2v-8a2 2 0 00-2-2h-8a2 2 0 00-2 2v8a2 2 0 002 2z" />
                        </svg>
                      </button>
                    </div>
                  </div>

                  <div>
                    <label class="block text-sm font-medium text-gray-700 mb-2">Plan d'abonnement</label>
                    <div class="flex items-center space-x-2">
                      <span class="inline-flex items-center px-3 py-1 rounded-full text-sm font-medium bg-green-100 text-green-800">
                        🚀 Plan Starter
                      </span>
                      <NuxtLink 
                        to="/billing" 
                        class="text-sm text-blue-600 hover:text-blue-700 font-medium"
                      >
                        Upgrade
                      </NuxtLink>
                    </div>
                  </div>
                </div>
              </div>

              <!-- Sécurité -->
              <div class="card-modern">
                <h2 class="text-xl font-semibold text-gray-900 mb-6">Sécurité</h2>
                
                <div class="space-y-4">
                  <div class="flex items-center justify-between py-3">
                    <div>
                      <h3 class="text-sm font-medium text-gray-900">Mot de passe</h3>
                      <p class="text-sm text-gray-500">Dernière modification il y a 30 jours</p>
                    </div>
                    <button
                      @click="changePassword"
                      class="inline-flex items-center px-4 py-2 text-sm font-medium text-blue-600 bg-blue-50 rounded-xl hover:bg-blue-100 transition-all duration-200"
                    >
                      Modifier
                    </button>
                  </div>

                  <hr class="border-gray-100">

                  <div class="flex items-center justify-between py-3">
                    <div>
                      <h3 class="text-sm font-medium text-gray-900">Authentification à deux facteurs</h3>
                      <p class="text-sm text-gray-500">Sécurisez votre compte avec 2FA</p>
                    </div>
                    <button
                      class="inline-flex items-center px-4 py-2 text-sm font-medium text-gray-600 bg-gray-50 rounded-xl hover:bg-gray-100 transition-all duration-200"
                      disabled
                    >
                      Bientôt disponible
                    </button>
                  </div>
                </div>
              </div>
            </div>

            <!-- Sidebar droite -->
            <div class="space-y-6">
              
              <!-- Logo de la boutique -->
              <div class="card-modern">
                <h3 class="text-lg font-semibold text-gray-900 mb-4">Logo de la boutique</h3>
                
                <div class="flex flex-col items-center space-y-4">
                  <!-- Logo actuel -->
                  <div class="relative">
                    <div v-if="logoUrl" class="flex h-24 w-24 items-center justify-center rounded-xl overflow-hidden bg-white border-2 border-gray-200 shadow-lg">
                      <img :src="logoUrl" alt="Logo de la boutique" class="w-full h-full object-contain">
                    </div>
                    <div v-else class="flex h-24 w-24 items-center justify-center rounded-xl bg-gradient-to-br from-blue-500 to-blue-600 shadow-lg">
                      <span class="text-2xl font-bold text-white">
                        {{ authStore.userInitials }}
                      </span>
                    </div>
                    <button
                      @click="triggerLogoUpload"
                      :disabled="uploadingLogo"
                      class="absolute -bottom-1 -right-1 flex h-8 w-8 items-center justify-center rounded-full bg-white shadow-md border-2 border-gray-100 text-gray-600 hover:text-gray-900 hover:bg-gray-50 transition-all duration-200 disabled:opacity-50"
                    >
                      <svg v-if="!uploadingLogo" class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M3 9a2 2 0 012-2h.93a2 2 0 001.664-.89l.812-1.22A2 2 0 0110.07 4h3.86a2 2 0 011.664.89l.812 1.22A2 2 0 0018.07 7H19a2 2 0 012 2v9a2 2 0 01-2 2H5a2 2 0 01-2-2V9z" />
                        <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M15 13a3 3 0 11-6 0 3 3 0 016 0z" />
                      </svg>
                      <svg v-else class="w-4 h-4 animate-spin" fill="none" viewBox="0 0 24 24">
                        <circle class="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" stroke-width="4"></circle>
                        <path class="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                      </svg>
                    </button>
                  </div>

                  <div class="text-center">
                    <p class="text-sm text-gray-600 mb-3">
                      Formats supportés : JPG, PNG, SVG (max 2MB)
                    </p>
                    <button
                      @click="triggerLogoUpload"
                      :disabled="uploadingLogo"
                      class="inline-flex items-center px-4 py-2 text-sm font-medium text-blue-600 bg-blue-50 rounded-xl hover:bg-blue-100 disabled:opacity-50 transition-all duration-200"
                    >
                      <svg class="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M7 16a4 4 0 01-.88-7.903A5 5 0 1115.9 6L16 6a5 5 0 011 9.9M15 13l-3-3m0 0l-3 3m3-3v12" />
                      </svg>
                      {{ uploadingLogo ? 'Upload en cours...' : logoUrl ? 'Changer le logo' : 'Télécharger le logo' }}
                    </button>
                    
                    <div v-if="logoUrl" class="mt-2">
                      <button
                        @click="removeLogo"
                        class="text-xs text-red-600 hover:text-red-700 font-medium"
                      >
                        Supprimer le logo
                      </button>
                    </div>
                  </div>
                </div>
                
                <!-- Hidden file input -->
                <input
                  ref="logoInput"
                  type="file"
                  accept="image/jpeg,image/png,image/svg+xml"
                  class="hidden"
                  @change="handleLogoUpload"
                >
              </div>

              <!-- Statistiques rapides -->
              <div class="card-modern">
                <h3 class="text-lg font-semibold text-gray-900 mb-4">Activité du compte</h3>
                
                <div class="space-y-4">
                  <div class="flex items-center justify-between">
                    <span class="text-sm text-gray-600">Membre depuis</span>
                    <span class="text-sm font-medium text-gray-900">{{ memberSince }}</span>
                  </div>
                  <div class="flex items-center justify-between">
                    <span class="text-sm text-gray-600">Dernière connexion</span>
                    <span class="text-sm font-medium text-gray-900">Maintenant</span>
                  </div>
                  <div class="flex items-center justify-between">
                    <span class="text-sm text-gray-600">Conversations</span>
                    <span class="text-sm font-medium text-gray-900">{{ totalConversations }}</span>
                  </div>
                </div>
              </div>

              <!-- Actions rapides -->
              <div class="card-modern">
                <h3 class="text-lg font-semibold text-gray-900 mb-4">Actions rapides</h3>
                
                <div class="space-y-3">
                  <NuxtLink
                    to="/vendeurs-ia"
                    class="flex items-center w-full px-4 py-3 text-sm font-medium text-left text-gray-700 bg-gray-50 rounded-xl hover:bg-gray-100 transition-all duration-200"
                  >
                    <svg class="w-4 h-4 mr-3 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9.663 17h4.673M12 3v1m6.364 1.636l-.707.707M21 12h-1M4 12H3m3.343-5.657l-.707-.707m2.828 9.9a5 5 0 117.072 0l-.548.547A3.374 3.374 0 0014 18.469V19a2 2 0 11-4 0v-.531c0-.895-.356-1.754-.988-2.386l-.548-.547z"/>
                    </svg>
                    Mes Vendeurs IA
                  </NuxtLink>

                  <NuxtLink
                    to="/knowledge-base"
                    class="flex items-center w-full px-4 py-3 text-sm font-medium text-left text-gray-700 bg-gray-50 rounded-xl hover:bg-gray-100 transition-all duration-200"
                  >
                    <svg class="w-4 h-4 mr-3 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.746 0 3.332.477 4.5 1.253v13C19.832 18.477 18.246 18 16.5 18c-1.746 0-3.332.477-4.5 1.253" />
                    </svg>
                    Base de connaissance
                  </NuxtLink>

                  <button
                    @click="exportData"
                    class="flex items-center w-full px-4 py-3 text-sm font-medium text-left text-gray-700 bg-gray-50 rounded-xl hover:bg-gray-100 transition-all duration-200"
                  >
                    <svg class="w-4 h-4 mr-3 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 10v6m0 0l-3-3m3 3l3-3M3 17V7a2 2 0 012-2h6l2 2h6a2 2 0 012 2v8a2 2 0 01-2 2H5a2 2 0 01-2-2z" />
                    </svg>
                    Exporter mes données
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>

    <!-- Success Toast -->
    <div
      v-if="showSuccessToast"
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
import { ref, reactive, computed, onMounted, watch } from 'vue'
import { useAuthStore } from '~/stores/auth'

// ✅ PAGE META
definePageMeta({
  middleware: 'auth',
  layout: 'default'
})

// ✅ COMPOSABLES
const authStore = useAuthStore()
const route = useRoute()
const { $supabase } = useNuxtApp()

// ✅ REFS
const logoInput = ref<HTMLInputElement>()

// ✅ REACTIVE STATE
const saving = ref(false)
const copied = ref(false)
const showSuccessToast = ref(false)
const showChatPreview = ref(false)
const updating = ref(false)
const editingProfile = ref(false)
const uploadingLogo = ref(false)
const logoFile = ref<File | null>(null)
const logoUrl = ref<string | null>(null)
const successMessage = ref('')

// ✅ TABS - NOUVEAUX 3 ONGLETS
const tabs = [
  { 
    id: 'widget', 
    label: 'Widget',
    icon: 'M7 21a4 4 0 01-4-4V5a2 2 0 012-2h4a2 2 0 012 2v12a4 4 0 01-4 4zM21 5a2 2 0 00-2-2h-4a2 2 0 00-2 2v12a4 4 0 004 4h4a2 2 0 002-2V5z'
  },
  { 
    id: 'integration', 
    label: 'Intégration',
    icon: 'M10 20l4-16m4 4l4 4-4 4M6 16l-4-4 4-4'
  },
  { 
    id: 'compte', 
    label: 'Compte',
    icon: 'M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z'
  }
]

const activeTab = ref('widget')

// ✅ WIDGET SETTINGS - SEULEMENT WIDGET (PAS VENDEUR IA)
const widgetSettings = ref({
  buttonText: 'Parler à un conseiller',
  primaryColor: '#3B82F6',
  position: 'above-cta',
  widgetSize: 'medium',
  isActive: true,
  theme: 'modern',
  borderRadius: 'md',
  animation: 'fade',
  soundEnabled: true
})

// ✅ PROFILE FORM - POUR L'ONGLET COMPTE
const profileForm = reactive({
  name: '',
  email: ''
})

// ✅ COMPUTED
const user = computed(() => authStore.user)
const userShopId = computed(() => authStore.userShopId)

const memberSince = computed(() => {
  if (authStore.user?.createdAt) {
    return new Date(authStore.user.createdAt).toLocaleDateString('fr-FR')
  }
  return 'N/A'
})

const totalConversations = ref(0) // Mock data

const widgetCodeDisplay = computed(() => {
  const shopId = userShopId.value || 'YOUR_SHOP_ID'
  
  const jsLines = [
    '(function() {',
    '  var script = document.createElement(\'script\');',
    '  script.src = \'https://widget.chatseller.app/widget.js\';',
    '  script.setAttribute(\'data-shop-id\', \'' + shopId + '\');',
    '  script.setAttribute(\'data-button-text\', \'' + widgetSettings.value.buttonText + '\');',
    '  script.setAttribute(\'data-primary-color\', \'' + widgetSettings.value.primaryColor + '\');',
    '  script.setAttribute(\'data-position\', \'' + widgetSettings.value.position + '\');',
    '  script.setAttribute(\'data-widget-size\', \'' + widgetSettings.value.widgetSize + '\');',
    '  script.setAttribute(\'data-theme\', \'' + widgetSettings.value.theme + '\');',
    '  script.setAttribute(\'data-border-radius\', \'' + widgetSettings.value.borderRadius + '\');',
    '  script.setAttribute(\'data-animation\', \'' + widgetSettings.value.animation + '\');',
    '  script.setAttribute(\'data-sound\', \'' + widgetSettings.value.soundEnabled + '\');',
    '  script.setAttribute(\'data-active\', \'' + widgetSettings.value.isActive + '\');',
    '  document.head.appendChild(script);',
    '})();'
  ]
  
  const jsContent = jsLines.join('\n')
  const openTag = '<' + 'script' + '>'
  const closeTag = '<' + '/' + 'script' + '>'
  return `${openTag}\n${jsContent}\n${closeTag}`
})

// ✅ WATCH ROUTE POUR GÉRER L'ONGLET VIA URL
watch(() => route.query.tab, (newTab) => {
  if (newTab && typeof newTab === 'string' && tabs.some(tab => tab.id === newTab)) {
    activeTab.value = newTab
  }
}, { immediate: true })

// ✅ METHODS
const setActiveTab = (tabId: string) => {
  activeTab.value = tabId
  navigateTo({ query: { ...route.query, tab: tabId } }, { replace: true })
}

const showNotification = (message: string) => {
  successMessage.value = message
  showSuccessToast.value = true
  setTimeout(() => {
    showSuccessToast.value = false
  }, 3000)
}

const getWidgetButtonClasses = () => {
  let classes = ''
  
  // Border radius
  switch (widgetSettings.value.borderRadius) {
    case 'none': classes += ' rounded-none'; break;
    case 'sm': classes += ' rounded-sm'; break;
    case 'md': classes += ' rounded-lg'; break;
    case 'lg': classes += ' rounded-xl'; break;
    case 'full': classes += ' rounded-full'; break;
    default: classes += ' rounded-lg';
  }
  
  // Size
  switch (widgetSettings.value.widgetSize) {
    case 'small': classes += ' text-sm py-1 px-3'; break;
    case 'medium': classes += ' py-2 px-4'; break;
    case 'large': classes += ' text-lg py-3 px-6'; break;
    default: classes += ' py-2 px-4';
  }
  
  return classes
}

const getChatPreviewClasses = () => {
  let classes = ''
  
  // Border radius for chat window
  switch (widgetSettings.value.borderRadius) {
    case 'none': classes += ' rounded-none'; break;
    case 'sm': classes += ' rounded-sm'; break;
    case 'md': classes += ' rounded-lg'; break;
    case 'lg': classes += ' rounded-xl'; break;
    case 'full': classes += ' rounded-2xl'; break;
    default: classes += ' rounded-lg';
  }
  
  return classes
}

const toggleWidgetStatus = async () => {
  const previousState = widgetSettings.value.isActive
  widgetSettings.value.isActive = !widgetSettings.value.isActive
  
  try {
    await handleSaveSettings()
    console.log('Widget status updated:', widgetSettings.value.isActive)
  } catch (error) {
    widgetSettings.value.isActive = previousState
    console.error('Erreur lors de la mise à jour du statut du widget:', error)
  }
}

const loadSettings = async () => {
  try {
    // TODO: Charger depuis l'API
    console.log('Settings loaded')
  } catch (error) {
    console.error('Erreur lors du chargement des paramètres:', error)
  }
}

const handleSaveSettings = async () => {
  saving.value = true
  try {
    await new Promise(resolve => setTimeout(resolve, 1000))
    
    // TODO: Sauvegarder vers l'API
    console.log('Paramètres sauvegardés:', widgetSettings.value)
    
    showNotification('Paramètres sauvegardés avec succès !')
    
  } catch (error) {
    console.error('Erreur lors de la sauvegarde:', error)
  } finally {
    saving.value = false
  }
}

const handleResetToDefaults = () => {
  if (confirm('Êtes-vous sûr de vouloir réinitialiser tous les paramètres du widget ?')) {
    widgetSettings.value = {
      buttonText: 'Parler à un conseiller',
      primaryColor: '#3B82F6',
      position: 'above-cta',
      widgetSize: 'medium',
      isActive: true,
      theme: 'modern',
      borderRadius: 'md',
      animation: 'fade',
      soundEnabled: true
    }
    showChatPreview.value = false
  }
}

const handleCopyWidgetCode = async () => {
  try {
    await navigator.clipboard.writeText(widgetCodeDisplay.value)
    copied.value = true
    setTimeout(() => {
      copied.value = false
    }, 3000)
  } catch (error) {
    console.error('Erreur lors de la copie:', error)
  }
}

// ✅ MÉTHODES POUR L'ONGLET COMPTE
const updateProfile = async () => {
  updating.value = true
  
  try {
    const result = await authStore.updateProfile({
      name: profileForm.name,
      email: profileForm.email
    })
    
    if (result.success) {
      editingProfile.value = false
      showNotification('Profil mis à jour avec succès !')
      console.log('✅ Profil mis à jour avec succès')
    } else {
      console.error('❌ Erreur mise à jour profil:', result.error)
    }
  } catch (error) {
    console.error('❌ Erreur:', error)
  } finally {
    updating.value = false
  }
}

const cancelEdit = () => {
  editingProfile.value = false
  profileForm.name = authStore.userName || ''
  profileForm.email = authStore.userEmail || ''
}

const copyShopId = async () => {
  try {
    await navigator.clipboard.writeText(authStore.userShopId || '')
    console.log('✅ ID copié dans le presse-papiers')
  } catch (error) {
    console.error('❌ Erreur copie:', error)
  }
}

const changePassword = () => {
  // Redirection vers la page de réinitialisation de mot de passe
  navigateTo('/reset-password')
}

const exportData = async () => {
  try {
    // Collecter toutes les données utilisateur
    const userData = {
      profile: {
        name: authStore.userName,
        email: authStore.userEmail,
        shopId: authStore.userShopId,
        memberSince: memberSince.value
      },
      settings: {
        widget: widgetSettings.value
      },
      // TODO: Ajouter conversations, commandes, etc. depuis l'API
      metadata: {
        exportedAt: new Date().toISOString(),
        version: '1.0'
      }
    }

    // Créer le fichier JSON
    const dataStr = JSON.stringify(userData, null, 2)
    const dataBlob = new Blob([dataStr], { type: 'application/json' })
    
    // Créer le lien de téléchargement
    const url = window.URL.createObjectURL(dataBlob)
    const link = document.createElement('a')
    link.href = url
    link.download = `chatseller-data-${new Date().toISOString().split('T')[0]}.json`
    
    // Déclencher le téléchargement
    document.body.appendChild(link)
    link.click()
    document.body.removeChild(link)
    
    // Nettoyer l'URL
    window.URL.revokeObjectURL(url)
    
    showNotification('Données exportées avec succès !')
    
  } catch (error) {
    console.error('❌ Erreur export des données:', error)
  }
}

// ✅ MÉTHODES POUR L'UPLOAD DE LOGO
const triggerLogoUpload = () => {
  logoInput.value?.click()
}

const handleLogoUpload = async (event: Event) => {
  const target = event.target as HTMLInputElement
  const file = target.files?.[0]
  
  if (!file) return
  
  // Vérifications
  if (file.size > 2 * 1024 * 1024) {
    console.error('❌ Fichier trop volumineux (max 2MB)')
    return
  }
  
  if (!['image/jpeg', 'image/png', 'image/svg+xml'].includes(file.type)) {
    console.error('❌ Format non supporté')
    return
  }
  
  uploadingLogo.value = true
  
  try {
    const shopId = authStore.userShopId
    if (!shopId) {
      throw new Error('Shop ID non trouvé')
    }
    
    // Générer un nom de fichier unique
    const timestamp = Date.now()
    const fileExtension = file.name.split('.').pop()
    const fileName = `logo-${shopId}-${timestamp}.${fileExtension}`
    const filePath = `shops/${shopId}/logo/${fileName}`
    
    // Upload vers Supabase Storage
    const { data, error } = await $supabase.storage
      .from('chatseller-files')
      .upload(filePath, file, {
        cacheControl: '3600',
        upsert: false
      })
    
    if (error) {
      throw error
    }
    
    // Obtenir l'URL publique
    const { data: { publicUrl } } = $supabase.storage
      .from('chatseller-files')
      .getPublicUrl(filePath)
    
    // Mettre à jour l'état local
    logoUrl.value = publicUrl
    
    // TODO: Sauvegarder l'URL du logo dans la base de données
    // await updateShopLogo(shopId, publicUrl)
    
    showNotification('Logo téléchargé avec succès !')
    
  } catch (error: any) {
    console.error('❌ Erreur upload logo:', error)
  } finally {
    uploadingLogo.value = false
    // Réinitialiser l'input
    target.value = ''
  }
}

const removeLogo = async () => {
  if (!logoUrl.value || !confirm('Êtes-vous sûr de vouloir supprimer le logo ?')) {
    return
  }
  
  try {
    // TODO: Supprimer le fichier de Supabase Storage et mettre à jour la DB
    logoUrl.value = null
    showNotification('Logo supprimé avec succès !')
  } catch (error) {
    console.error('❌ Erreur suppression logo:', error)
  }
}

const loadShopLogo = async () => {
  try {
    const shopId = authStore.userShopId
    if (!shopId) return
    
    // TODO: Charger l'URL du logo depuis la base de données
    // const logoUrlFromDB = await getShopLogo(shopId)
    // logoUrl.value = logoUrlFromDB
    
  } catch (error) {
    console.error('❌ Erreur chargement logo:', error)
  }
}

// ✅ LIFECYCLE
onMounted(() => {
  loadSettings()
  loadShopLogo()
  profileForm.name = authStore.userName || ''
  profileForm.email = authStore.userEmail || ''
})

// ✅ SEO
useHead({
  title: 'Paramètres - ChatSeller Dashboard'
})
</script>

<style scoped>
/* ✅ MODERN COMPONENTS */
.card-modern {
  @apply bg-white rounded-xl shadow-sm border border-gray-200 p-6;
}

.input-modern {
  @apply px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-colors text-sm;
}

.position-option {
  @apply p-3 border border-gray-300 rounded-lg cursor-pointer transition-all hover:border-blue-300;
}

.position-option.selected {
  @apply border-blue-500 bg-blue-50;
}

.theme-option {
  @apply cursor-pointer;
}

.theme-option.selected .p-3 {
  @apply border-blue-500 bg-blue-50;
}

.platform-card {
  @apply p-4 border border-gray-200 rounded-lg text-center;
}

.platform-icon {
  @apply w-12 h-12 rounded-lg flex items-center justify-center mx-auto mb-3;
}

.success-message {
  @apply p-4 bg-green-50 border border-green-200 rounded-lg;
}

/* ✅ WIDGET PREVIEW STYLES */
.widget-button-container {
  @apply w-full;
}

.widget-trigger-button {
  @apply w-full flex items-center justify-center text-white font-medium transition-all hover:opacity-90;
}

.widget-trigger-button-small {
  @apply flex items-center justify-center p-3 text-white transition-all hover:opacity-90;
}

.quick-action-button {
  @apply w-full text-left px-3 py-2 text-sm text-gray-700 bg-white border border-gray-200 rounded-lg hover:bg-gray-50 transition-colors;
}

/* ✅ RESPONSIVE */
@media (max-width: 768px) {
  .card-modern {
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

.transition-all {
  transition: all 0.2s cubic-bezier(0.4, 0, 0.2, 1);
}
</style>