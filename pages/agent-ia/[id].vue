<!-- pages/agent-ia/[id].vue -->
<template>
  <div class="min-h-screen bg-gradient-to-br from-rose-50 via-pink-50 to-purple-50 pb-12">
    
    <!-- Header simplifié et accueillant -->
    <div class="bg-white/80 backdrop-blur-sm border-b border-rose-200">
      <div class="px-4 sm:px-6 lg:px-8 py-4 lg:py-6">
        <div class="flex flex-col sm:flex-row sm:items-center justify-between space-y-4 sm:space-y-0">
          <div class="flex items-center space-x-4 min-w-0 flex-1">
            <!-- Avatar de la conseillère -->
            <div class="relative flex-shrink-0">
              <div class="w-14 h-14 rounded-full overflow-hidden border-3 shadow-md" :class="getAvatarBorderClasses()">
                <img
                  v-if="localConfig?.agent?.avatar"
                  :src="localConfig.agent.avatar"
                  :alt="localConfig.agent.name"
                  class="w-full h-full object-cover"
                />
                <div v-else class="w-full h-full flex items-center justify-center text-white font-bold text-xl" :class="getAvatarBackgroundClasses()">
                  {{ (localConfig?.agent?.name || 'C').charAt(0).toUpperCase() }}
                </div>
              </div>
              <div
                class="absolute -bottom-1 -right-1 w-5 h-5 rounded-full border-2 border-white flex items-center justify-center text-xs"
                :class="localConfig?.agent?.isActive ? 'bg-green-500' : 'bg-gray-400'"
              >
                {{ localConfig?.agent?.isActive ? '✓' : '○' }}
              </div>
            </div>

            <div class="min-w-0 flex-1">
              <h1 class="text-xl lg:text-2xl font-bold text-gray-900">
                {{ agentName || 'Ma Conseillère IA' }}
              </h1>
              <p class="text-sm text-gray-600 flex items-center mt-1">
                <span :class="getBeautyIconClasses()">{{ getBeautyIcon() }}</span>
                <span class="ml-1">{{ getBeautyTypeLabel() }}</span>
                <span class="ml-3 px-2 py-0.5 rounded-full text-xs font-medium"
                      :class="localConfig?.agent?.isActive ? 'bg-green-100 text-green-700' : 'bg-gray-100 text-gray-600'">
                  {{ localConfig?.agent?.isActive ? 'Active' : 'Inactive' }}
                </span>
              </p>
            </div>
          </div>

          <!-- Bouton sauvegarder -->
          <div class="flex items-center space-x-3">
            <button
              @click="saveConfiguration"
              :disabled="saving || !hasChanges"
              class="flex items-center px-5 py-2.5 text-white text-sm font-medium rounded-xl hover:opacity-90 disabled:opacity-50 transition-all shadow-md"
              :class="getSaveButtonClasses()"
            >
              <svg v-if="saving" class="w-4 h-4 mr-2 animate-spin" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15"/>
              </svg>
              <svg v-else class="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M5 13l4 4L19 7"/>
              </svg>
              {{ saving ? 'Sauvegarde...' : (hasChanges ? 'Sauvegarder les modifications' : 'Tout est sauvegardé') }}
            </button>
          </div>
        </div>
      </div>
    </div>

    <!-- ✅ NOUVEAU : Alertes quotas beauté -->
    <div v-if="quotaAlerts.length > 0" class="px-4 sm:px-6 lg:px-8 pt-4">
      <div 
        v-for="alert in quotaAlerts.slice(0, 2)" 
        :key="alert.quota"
        class="p-4 rounded-xl shadow-sm mb-3"
        :class="getAlertClasses(alert.type)"
      >
        <div class="flex items-center">
          <div class="flex-shrink-0">
            <svg 
              class="w-5 h-5"
              :class="getAlertIconClasses(alert.type)"
              fill="none" 
              stroke="currentColor" 
              viewBox="0 0 24 24"
            >
              <path v-if="alert.type === 'exceeded'" stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"/>
              <path v-else stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"/>
            </svg>
          </div>
          <div class="ml-3 flex-1">
            <p class="text-sm font-medium" :class="getAlertTextClasses(alert.type)">
              {{ alert.message }}
            </p>
            <div class="mt-1 w-full bg-white/50 rounded-full h-2">
              <div 
                class="h-2 rounded-full transition-all"
                :class="getAlertProgressClasses(alert.type)"
                :style="{ width: Math.min(alert.percentage, 100) + '%' }"
              ></div>
            </div>
          </div>
          <div class="ml-4">
            <NuxtLink 
              to="/billing"
              class="inline-flex items-center px-3 py-1 rounded-lg text-xs font-medium transition-colors"
              :class="getAlertButtonClasses(alert.type)"
            >
              Upgrader
            </NuxtLink>
          </div>
        </div>
      </div>
    </div>

    <!-- Messages de statut -->
    <div v-if="localSuccessMessage || localError" class="px-4 sm:px-6 lg:px-8 pt-4">
      <div v-if="localSuccessMessage" class="p-4 bg-green-50 border border-green-200 rounded-lg mb-4">
        <div class="flex items-center">
          <svg class="w-5 h-5 text-green-400 mr-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M5 13l4 4L19 7"/>
          </svg>
          <p class="text-green-700 text-sm font-medium">{{ localSuccessMessage }}</p>
        </div>
      </div>
      
      <div v-if="localError" class="p-4 bg-red-50 border border-red-200 rounded-lg mb-4">
        <div class="flex items-center justify-between">
          <div class="flex items-center">
            <svg class="w-5 h-5 text-red-400 mr-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"/>
            </svg>
            <p class="text-red-700 text-sm font-medium">{{ localError }}</p>
          </div>
          <button @click="clearLocalError" class="text-red-400 hover:text-red-600">
            <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12"/>
            </svg>
          </button>
        </div>
      </div>
    </div>

    <!-- État de chargement -->
    <div v-if="loading" class="flex items-center justify-center py-16">
      <div class="text-center">
        <div class="w-12 h-12 mx-auto mb-4 rounded-full border-4 border-t-transparent animate-spin" :class="getLoadingClasses()"></div>
        <p class="text-gray-600">Chargement de votre conseillère...</p>
      </div>
    </div>

    <!-- Navigation onglets -->
    <div v-else class="px-4 sm:px-6 lg:px-8 pt-6">
      <!-- Navigation mobile (dropdown) -->
      <div class="sm:hidden mb-6">
        <select
          v-model="activeTab"
          class="w-full px-4 py-3 border border-gray-300 rounded-xl text-sm font-medium bg-white"
        >
          <option value="agent">1️⃣ Personnaliser</option>
          <option value="buttons">2️⃣ Apparence</option>
          <option value="test">3️⃣ Tester</option>
          <option value="activate">4️⃣ Installer</option>
        </select>
      </div>

      <!-- Navigation desktop - Stepper UX -->
      <div class="hidden sm:block mb-8">
        <!-- Barre de progression -->
        <div class="flex items-center justify-between mb-4">
          <div v-for="(tab, index) in tabs" :key="tab.id" class="flex items-center flex-1">
            <button
              @click="activeTab = tab.id"
              class="flex flex-col items-center group w-full"
            >
              <!-- Cercle numéroté -->
              <div
                :class="[
                  'w-10 h-10 rounded-full flex items-center justify-center text-sm font-bold transition-all duration-200 mb-2',
                  activeTab === tab.id
                    ? 'bg-rose-500 text-white shadow-lg scale-110'
                    : getTabCompletedStatus(tab.id)
                      ? 'bg-green-500 text-white'
                      : 'bg-gray-200 text-gray-600 group-hover:bg-gray-300'
                ]"
              >
                <span v-if="getTabCompletedStatus(tab.id) && activeTab !== tab.id">✓</span>
                <span v-else>{{ index + 1 }}</span>
              </div>
              <!-- Label -->
              <span
                :class="[
                  'text-xs font-medium transition-colors text-center',
                  activeTab === tab.id ? 'text-rose-600' : 'text-gray-600'
                ]"
              >
                {{ tab.name }}
              </span>
            </button>
            <!-- Ligne de connexion -->
            <div
              v-if="index < tabs.length - 1"
              class="flex-1 h-1 mx-2 rounded-full -mt-6"
              :class="getTabCompletedStatus(tab.id) ? 'bg-green-300' : 'bg-gray-200'"
            ></div>
          </div>
        </div>

        <!-- Description de l'étape active -->
        <div class="text-center">
          <p class="text-sm text-gray-600">{{ getActiveTabDescription() }}</p>
        </div>
      </div>

      <!-- Contenu des onglets -->
      <div class="max-w-7xl mx-auto">
        
        <!-- ONGLET 1: MA CONSEILLÈRE -->
        <div v-if="activeTab === 'agent'" class="grid lg:grid-cols-3 gap-8">
          
          <!-- Configuration principale -->
          <div class="lg:col-span-2 space-y-6">
            
            <!-- Identité conseillère -->
            <div class="bg-white/80 backdrop-blur-sm rounded-2xl p-6 shadow-lg border border-white/60">
              <h3 class="text-lg font-semibold text-gray-900 mb-6 flex items-center">
                <span class="mr-3 text-2xl">{{ getBeautyIcon() }}</span>
                Identité de votre {{ getBeautyTypeLabel() }}
              </h3>
              
              <div class="space-y-6">
                <!-- Avatar + Nom côte à côte -->
                <div class="grid md:grid-cols-3 gap-6 items-center">
                  <!-- Avatar -->
                  <div class="text-center">
                    <div class="relative inline-block">
                      <div class="w-20 h-20 rounded-full overflow-hidden border-4 shadow-lg" :class="getAvatarBorderClasses()">
                        <img
                          v-if="localConfig?.agent?.avatar"
                          :src="localConfig.agent.avatar"
                          :alt="localConfig.agent.name"
                          class="w-full h-full object-cover"
                          @error="handleAvatarError"
                        />
                        <div v-else class="w-full h-full flex items-center justify-center text-white font-semibold text-xl" :class="getAvatarBackgroundClasses()">
                          {{ (localConfig?.agent?.name || 'A').charAt(0).toUpperCase() }}
                        </div>
                      </div>
                      <button 
                        @click="triggerAvatarUpload"
                        class="absolute -bottom-1 -right-1 w-8 h-8 rounded-full bg-white border-2 border-gray-300 flex items-center justify-center hover:bg-gray-50 transition-colors"
                      >
                        📷
                      </button>
                    </div>
                    <input
                      ref="avatarUpload"
                      type="file"
                      accept="image/*"
                      @change="handleAvatarUpload"
                      class="hidden"
                    />
                    <p class="text-xs text-gray-500 mt-2">Cliquez pour changer</p>
                  </div>
                  
                  <!-- Nom + Spécialité -->
                  <div class="md:col-span-2 space-y-4">
                    <div>
                      <label class="block text-sm font-medium text-gray-700 mb-2">
                        Nom de votre conseillère *
                      </label>
                      <input
                        v-model="localConfig.agent.name"
                        @input="markAsChanged"
                        type="text"
                        class="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:border-blue-500 transition-colors"
                        :class="getInputFocusClasses()"
                        placeholder="Ex: Camille, Sophie, Marie..."
                      />
                    </div>
                    
                    <div>
                      <label class="block text-sm font-medium text-gray-700 mb-2">
                        Sa spécialité
                      </label>
                      <input
                        v-model="localConfig.agent.title"
                        @input="markAsChanged"
                        type="text"
                        class="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:border-blue-500 transition-colors"
                        :class="getInputFocusClasses()"
                        :placeholder="getSpecialityPlaceholder()"
                      />
                    </div>
                  </div>
                </div>

                <!-- Type et Style côte à côte -->
                <div class="grid md:grid-cols-2 gap-4">
                  <div>
                    <label class="block text-sm font-medium text-gray-700 mb-2">
                      Type d'Agent IA
                    </label>
                    <select 
                      v-model="localConfig.agent.type" 
                      @change="markAsChanged"
                      class="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:border-blue-500"
                      :class="getInputFocusClasses()"
                    >
                      <option v-for="type in getBeautyTypes()" :key="type.value" :value="type.value">
                        {{ type.icon }} {{ type.label }}
                      </option>
                    </select>
                  </div>
                  
                  <div>
                    <label class="block text-sm font-medium text-gray-700 mb-2">
                      Style de communication
                    </label>
                    <select 
                      v-model="localConfig.agent.personality" 
                      @change="markAsChanged"
                      class="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:border-blue-500"
                      :class="getInputFocusClasses()"
                    >
                      <option value="friendly">😊 Chaleureuse</option>
                      <option value="professional">👩‍💼 Professionnelle</option>
                      <option value="expert">🎓 Experte</option>
                      <option value="casual">😎 Décontractée</option>
                    </select>
                  </div>
                </div>

                <!-- ✅ NOUVEAU : Gamme produits beauté -->
                <div>
                  <label class="block text-sm font-medium text-gray-700 mb-2">
                    Gamme de produits beauté
                  </label>
                  <select 
                    v-model="localConfig.agent.productRange" 
                    @change="markAsChanged"
                    class="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:border-blue-500"
                    :class="getInputFocusClasses()"
                  >
                    <option v-for="range in getProductRangeOptions()" :key="range.value" :value="range.value">
                      {{ range.label }}
                    </option>
                  </select>
                  
                  <!-- Champ personnalisé si "custom" sélectionné -->
                  <div v-if="localConfig.agent.productRange === 'custom'" class="mt-3">
                    <input
                      v-model="localConfig.agent.customProductRange"
                      @input="markAsChanged"
                      type="text"
                      class="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:border-blue-500"
                      placeholder="Ex: Cosmétiques coréens, Marques éthiques, Produits anti-âge..."
                    />
                  </div>
                </div>
              </div>
            </div>

            <!-- Message d'accueil -->
            <div class="bg-white/80 backdrop-blur-sm rounded-2xl p-6 shadow-lg border border-white/60">
              <h3 class="text-lg font-semibold text-gray-900 mb-4">
                💬 Son message d'accueil
              </h3>
              
              <div class="space-y-4">
                <!-- Variables disponibles -->
                <div class="p-4 rounded-lg" :class="getVariablesBackgroundClasses()">
                  <p class="text-sm font-medium mb-2" :class="getVariablesTextClasses()">
                    Variables disponibles :
                  </p>
                  <div class="flex flex-wrap gap-2">
                    <button
                      v-for="variable in getAvailableVariables()"
                      :key="variable.name"
                      @click="insertVariable(variable.name)"
                      type="button"
                      class="px-3 py-1 bg-white rounded-lg text-xs font-medium hover:bg-gray-50 transition-colors border"
                      :class="getVariableButtonClasses()"
                    >
                      {{ variable.display }}
                    </button>
                  </div>
                </div>
                
                <!-- Zone de saisie -->
                <div class="space-y-3">
                  <textarea
                    ref="welcomeMessageInput"
                    v-model="localConfig.agent.welcomeMessage"
                    @input="markAsChanged"
                    rows="4"
                    class="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:border-blue-500 transition-colors resize-none"
                    :class="getInputFocusClasses()"
                    :placeholder="getWelcomeMessagePlaceholder()"
                  ></textarea>
                  
                  <div class="flex justify-between">
                    <button 
                      @click="resetWelcomeMessage"
                      type="button"
                      class="text-xs text-gray-500 hover:text-gray-700 underline"
                    >
                      🔄 Message par défaut
                    </button>
                    <button
                      @click="openWelcomePreview"
                      type="button"
                      class="px-3 py-1 text-xs rounded-lg text-white hover:opacity-90 transition-colors"
                      :class="getPreviewButtonClasses()"
                    >
                      👁️ Aperçu
                    </button>
                  </div>
                </div>
              </div>
            </div>

            <!-- Base de connaissances -->
            <div class="bg-white/80 backdrop-blur-sm rounded-2xl p-6 shadow-lg border border-white/60">
              <div class="flex items-center justify-between mb-4">
                <h3 class="text-lg font-semibold text-gray-900">
                  📚 Sa base de connaissances
                </h3>
                <div class="flex items-center space-x-2">
                  <!-- ✅ NOUVEAU : Indicateur quota documents -->
                  <span v-if="quotaSummary?.knowledgeDocuments" class="text-xs text-gray-500">
                    {{ quotaSummary.knowledgeDocuments.used }}/{{ quotaSummary.knowledgeDocuments.limit === -1 ? '∞' : quotaSummary.knowledgeDocuments.limit }}
                  </span>
                  <button 
                    @click="openKnowledgeModal"
                    :disabled="!canAddDocument"
                    class="px-4 py-2 text-white text-sm font-medium rounded-lg hover:opacity-90 disabled:opacity-50 transition-colors"
                    :class="getKnowledgeButtonClasses()"
                    :title="!canAddDocument ? 'Quota documents atteint' : ''"
                  >
                    <svg class="w-4 h-4 mr-2 inline" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 6v6m0 0v6m0-6h6m-6 0H6"/>
                    </svg>
                    Gérer
                  </button>
                </div>
              </div>
              
              <div v-if="knowledgeDocuments.length === 0" class="text-center py-8">
                <div class="text-4xl mb-4">📖</div>
                <p class="text-gray-600 mb-2">Aucun document lié</p>
                <p class="text-sm text-gray-500">Ajoutez des guides produits, FAQs, catalogues...</p>
              </div>
              
              <div v-else class="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div 
                  v-for="doc in knowledgeDocuments.slice(0, 4)" 
                  :key="doc.id"
                  class="flex items-center p-3 bg-gray-50 rounded-lg"
                >
                  <div class="w-8 h-8 rounded-lg flex items-center justify-center mr-3" :class="getDocIconClasses()">
                    <svg class="w-4 h-4 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z"/>
                    </svg>
                  </div>
                  <div class="min-w-0 flex-1">
                    <p class="text-sm font-medium text-gray-900 truncate">{{ doc.title }}</p>
                    <p class="text-xs text-gray-500">{{ getContentTypeLabel(doc.contentType) }}</p>
                  </div>
                </div>
                
                <div v-if="knowledgeDocuments.length > 4" class="flex items-center justify-center p-3 bg-gray-50 rounded-lg border-2 border-dashed border-gray-300">
                  <span class="text-sm text-gray-500">+{{ knowledgeDocuments.length - 4 }} autres</span>
                </div>
              </div>
            </div>

            <!-- ✅ NOUVEAU : Instructions beauté avec templates -->
            <div class="bg-white/80 backdrop-blur-sm rounded-2xl p-6 shadow-lg border border-white/60">
              <div class="flex items-center justify-between mb-4">
                <h3 class="text-lg font-semibold text-gray-900">
                  🎯 Instructions spécialisées beauté
                </h3>
                <button 
                  @click="showAdvancedInstructions = !showAdvancedInstructions"
                  class="text-xs px-3 py-1 rounded-lg transition-colors"
                  :class="showAdvancedInstructions ? 'bg-rose-100 text-rose-700' : 'bg-gray-100 text-gray-600'"
                >
                  {{ showAdvancedInstructions ? 'Mode simple' : 'Mode avancé' }}
                </button>
              </div>
              
              <!-- Mode simple : Templates prédéfinis beauté -->
              <div v-if="!showAdvancedInstructions" class="space-y-4">
                <p class="text-sm text-gray-600 mb-4">
                  Choisissez des comportements spécialisés pour le secteur beauté :
                </p>
                
                <!-- Templates beauté depuis types/beauty.ts -->
                <div class="grid grid-cols-1 gap-3">
                  <label 
                    v-for="template in getBeautyInstructionTemplates()" 
                    :key="template.id"
                    class="relative cursor-pointer"
                  >
                    <input 
                      type="checkbox" 
                      :value="template.id"
                      v-model="selectedInstructionTemplates"
                      @change="markAsChanged"
                      class="sr-only"
                    >
                    <div class="p-4 border-2 rounded-lg transition-all"
                         :class="selectedInstructionTemplates.includes(template.id) 
                           ? 'border-rose-500 bg-rose-50' 
                           : 'border-gray-300 hover:border-gray-400'">
                      <div class="flex items-start space-x-3">
                        <div class="text-2xl">{{ template.icon }}</div>
                        <div class="flex-1">
                          <div class="font-medium text-gray-900">{{ template.title }}</div>
                          <div class="text-sm text-gray-600 mt-1">{{ template.description }}</div>
                          <div class="text-xs text-gray-500 mt-2 italic">
                            "{{ template.instructions.substring(0, 60) }}..."
                          </div>
                        </div>
                      </div>
                    </div>
                  </label>
                </div>
              </div>
              
              <!-- Mode avancé : Instructions libres -->
              <div v-else class="space-y-4">
                <div>
                  <label class="block text-sm font-medium text-gray-700 mb-2">
                    Instructions personnalisées
                  </label>
                  <textarea
                    v-model="customInstructions"
                    @input="markAsChanged"
                    rows="6"
                    class="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:border-rose-500 transition-colors resize-none"
                    placeholder="Ex: Toujours demander le type de peau. Proposer des échantillons. Mentionner les ingrédients clés..."
                  ></textarea>
                  <div class="text-xs text-gray-500 mt-2">
                    {{ customInstructions?.length || 0 }}/500 caractères
                  </div>
                </div>
                
                <!-- ✅ NOUVEAU : Collecte spécifique beauté -->
                <div class="bg-gray-50 p-4 rounded-lg">
                  <h4 class="font-medium text-gray-900 mb-3">Collecte d'informations cliente beauté</h4>
                  <div class="space-y-2">
                    <label class="flex items-center">
                      <input 
                        type="checkbox" 
                        v-model="localConfig.agent.config.collectBeautyProfile"
                        @change="markAsChanged"
                        class="h-4 w-4 text-rose-600 border-gray-300 rounded focus:ring-rose-500"
                      >
                      <span class="ml-2 text-sm text-gray-700">Type de peau/cheveux</span>
                    </label>
                    <label class="flex items-center">
                      <input 
                        type="checkbox" 
                        v-model="localConfig.agent.config.collectAge"
                        @change="markAsChanged"
                        class="h-4 w-4 text-rose-600 border-gray-300 rounded focus:ring-rose-500"
                      >
                      <span class="ml-2 text-sm text-gray-700">Tranche d'âge</span>
                    </label>
                    <label class="flex items-center">
                      <input 
                        type="checkbox" 
                        v-model="localConfig.agent.config.collectBudget"
                        @change="markAsChanged"
                        class="h-4 w-4 text-rose-600 border-gray-300 rounded focus:ring-rose-500"
                      >
                      <span class="ml-2 text-sm text-gray-700">Budget envisagé</span>
                    </label>
                    <label class="flex items-center">
                      <input 
                        type="checkbox" 
                        v-model="localConfig.agent.config.collectPreferences"
                        @change="markAsChanged"
                        class="h-4 w-4 text-rose-600 border-gray-300 rounded focus:ring-rose-500"
                      >
                      <span class="ml-2 text-sm text-gray-700">Préférences (parfums, textures...)</span>
                    </label>
                  </div>
                </div>
                
                <!-- Aperçu prompt système généré -->
                <div class="bg-blue-50 border border-blue-200 rounded-lg p-4">
                  <div class="flex items-start space-x-2">
                    <svg class="w-5 h-5 text-blue-500 mt-0.5 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"/>
                    </svg>
                    <div class="text-sm text-blue-800">
                      <strong>Prompt système généré :</strong>
                      <div class="mt-2 text-xs bg-white p-2 rounded border font-mono max-h-32 overflow-y-auto">
                        {{ getGeneratedSystemPrompt() }}
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>

          <!-- Panneau latéral -->
          <div class="space-y-6">
            <!-- Statut et quotas -->
            <div class="bg-white/80 backdrop-blur-sm rounded-2xl p-6 shadow-lg border border-white/60">
              <h3 class="text-lg font-semibold text-gray-900 mb-4">📊 Statut & Usage</h3>
              
              <div class="space-y-4">
                <!-- Stats conversations -->
                <div class="flex justify-between text-sm">
                  <span class="font-medium">Conversations :</span>
                  <span class="font-semibold" :class="getStatsTextClasses()">{{ agentStats.conversations }}</span>
                </div>
                
                <div class="flex justify-between text-sm">
                  <span class="font-medium">Conversions :</span>
                  <span class="font-semibold text-green-600">{{ agentStats.conversions }}</span>
                </div>
                
                <div class="flex justify-between text-sm">
                  <span class="font-medium">Taux :</span>
                  <span class="font-semibold text-purple-600">{{ conversionRate }}%</span>
                </div>
                
                <hr class="border-gray-200">

                <!-- ✅ NOUVEAU : Résumé quotas -->
                <div v-if="quotaSummary" class="space-y-3">
                  <div class="text-xs font-medium text-gray-500 mb-2">QUOTAS BEAUTÉ</div>
                  <div v-for="(quota, key) in quotaSummary" :key="key" class="flex justify-between items-center text-xs">
                    <span class="flex items-center">
                      <span class="mr-1">{{ quota.icon }}</span>
                      {{ quota.label }}
                    </span>
                    <div class="flex items-center space-x-2">
                      <span :class="quota.color === 'red' ? 'text-red-600' : quota.color === 'orange' ? 'text-orange-600' : 'text-green-600'">
                        {{ quota.used }}{{ quota.limit === -1 ? '' : `/${quota.limit}` }}
                      </span>
                      <div v-if="quota.limit !== -1" class="w-8 bg-gray-200 rounded-full h-1.5">
                        <div 
                          class="h-1.5 rounded-full transition-all"
                          :class="quota.color === 'red' ? 'bg-red-500' : quota.color === 'orange' ? 'bg-orange-500' : 'bg-green-500'"
                          :style="{ width: Math.min((quota.used / quota.limit) * 100, 100) + '%' }"
                        ></div>
                      </div>
                    </div>
                  </div>
                </div>

                <hr class="border-gray-200">
                
                <!-- Toggle activation -->
                <div class="flex items-center justify-between">
                  <span class="text-sm font-medium">Conseillère active</span>
                  <button
                    @click="toggleAgent"
                    class="relative inline-flex h-6 w-11 flex-shrink-0 cursor-pointer rounded-full border-2 border-transparent transition-colors duration-200 ease-in-out focus:outline-none focus:ring-2 focus:ring-offset-2"
                    :class="[
                      localConfig?.agent?.isActive ? getToggleActiveClasses() : 'bg-gray-200',
                      getToggleFocusClasses()
                    ]"
                  >
                    <span
                      class="pointer-events-none inline-block h-5 w-5 transform rounded-full bg-white shadow ring-0 transition duration-200 ease-in-out"
                      :class="localConfig?.agent?.isActive ? 'translate-x-5' : 'translate-x-0'"
                    ></span>
                  </button>
                </div>
              </div>
            </div>

            <!-- Actions rapides -->
            <div class="bg-white/80 backdrop-blur-sm rounded-2xl p-6 shadow-lg border border-white/60">
              <h3 class="text-lg font-semibold text-gray-900 mb-4">⚡ Actions</h3>
              
              <div class="space-y-3">
                <button
                  @click="activeTab = 'test'"
                  class="w-full px-4 py-3 text-white rounded-lg hover:opacity-90 transition-colors text-center font-medium"
                  :class="getTestButtonClasses()"
                >
                  🧪 Tester ma conseillère
                </button>
                
                <button
                  @click="activeTab = 'buttons'"
                  class="w-full px-4 py-3 border rounded-lg hover:bg-gray-50 transition-colors text-center font-medium"
                  :class="getButtonsButtonClasses()"
                >
                  🎨 Configurer les boutons
                </button>
                
                <button
                  @click="activeTab = 'activate'"
                  class="w-full px-4 py-3 border rounded-lg hover:bg-gray-50 transition-colors text-center font-medium"
                  :class="getActivateButtonClasses()"
                >
                  ⚡ Activer sur mon site
                </button>
              </div>
            </div>

            <!-- ✅ NOUVEAU : Feedback IA récent -->
            <div v-if="recentFeedbacks.length > 0" class="bg-white/80 backdrop-blur-sm rounded-2xl p-6 shadow-lg border border-white/60">
              <div class="flex items-center justify-between mb-4">
                <h3 class="text-lg font-semibold text-gray-900">🔍 Feedback récent</h3>
                <button
                  @click="showAllFeedbacks = true"
                  class="text-xs text-gray-500 hover:text-gray-700 underline"
                >
                  Voir tout
                </button>
              </div>
              
              <div class="space-y-3">
                <div 
                  v-for="feedback in recentFeedbacks.slice(0, 3)" 
                  :key="feedback.id"
                  class="p-3 bg-gray-50 rounded-lg text-xs"
                >
                  <div class="flex items-center justify-between mb-1">
                    <span :class="feedback.feedbackType === 'correction' ? 'text-red-600' : feedback.feedbackType === 'validation' ? 'text-green-600' : 'text-orange-600'">
                      {{ feedback.feedbackType === 'correction' ? '🔧' : feedback.feedbackType === 'validation' ? '✅' : '⚠️' }}
                    </span>
                    <span class="text-gray-500">{{ formatTime(new Date(feedback.createdAt)) }}</span>
                  </div>
                  <p class="text-gray-700">{{ feedback.feedbackComment || 'Feedback sans commentaire' }}</p>
                  <div v-if="feedback.feedbackTags?.length" class="mt-2 flex flex-wrap gap-1">
                    <span 
                      v-for="tag in feedback.feedbackTags.slice(0, 2)"
                      :key="tag"
                      class="px-1.5 py-0.5 bg-blue-100 text-blue-700 rounded text-xs"
                    >
                      {{ getBeautyFeedbackTagLabel(tag) }}
                    </span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>

        <!-- ONGLET 2: MES BOUTONS -->
        <div v-if="activeTab === 'buttons'" class="grid lg:grid-cols-2 gap-8">
          
          <!-- Configuration boutons -->
          <div class="space-y-6">
            
            <!-- Bouton principal (pages produits) -->
            <div class="bg-white/80 backdrop-blur-sm rounded-2xl p-6 shadow-lg border border-white/60">
              <h3 class="text-lg font-semibold text-gray-900 mb-4 flex items-center">
                <span class="mr-3">🛍️</span>
                Bouton principal (sur vos pages produits)
              </h3>
              
              <div class="space-y-4">
                <div>
                  <label class="block text-sm font-medium text-gray-700 mb-2">
                    Texte du bouton *
                  </label>
                  <input
                    v-model="localConfig.widget.buttonText"
                    @input="markAsChanged"
                    type="text"
                    class="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:border-blue-500 transition-colors"
                    :class="getInputFocusClasses()"
                    placeholder="Ex: Parler à votre conseillère beauté"
                  />
                </div>
                
                <div>
                  <label class="block text-sm font-medium text-gray-700 mb-2">
                    Position sur la page produit
                  </label>
                  <div class="grid grid-cols-1 md:grid-cols-3 gap-3">
                    <label v-for="position in mainButtonPositions" :key="position.value" class="relative cursor-pointer">
                      <input 
                        v-model="localConfig.widget.position" 
                        :value="position.value" 
                        @change="markAsChanged"
                        type="radio" 
                        class="sr-only"
                      >
                      <div class="p-3 border-2 rounded-lg transition-all text-center text-sm"
                           :class="localConfig.widget.position === position.value 
                             ? 'border-rose-500 bg-rose-50' 
                             : 'border-gray-300 hover:border-gray-400'">
                        <div class="font-medium">{{ position.label }}</div>
                        <div class="text-xs text-gray-500 mt-1">{{ position.description }}</div>
                      </div>
                    </label>
                  </div>
                </div>
              </div>
            </div>

            <!-- Bouton flottant (autres pages) -->
            <div class="bg-white/80 backdrop-blur-sm rounded-2xl p-6 shadow-lg border border-white/60">
              <h3 class="text-lg font-semibold text-gray-900 mb-4 flex items-center">
                <span class="mr-3">💬</span>
                Bouton flottant (autres pages du site)
              </h3>
              
              <div class="space-y-4">
                <div>
                  <label class="block text-sm font-medium text-gray-700 mb-2">
                    Position du bouton flottant
                  </label>
                  <div class="grid grid-cols-2 gap-3">
                    <label v-for="position in floatingButtonPositions" :key="position.value" class="relative cursor-pointer">
                      <input 
                        v-model="localConfig.widget.floatingPosition" 
                        :value="position.value"
                        @change="markAsChanged"
                        type="radio" 
                        class="sr-only"
                      >
                      <div class="p-3 border-2 rounded-lg transition-all text-center text-sm"
                           :class="localConfig.widget.floatingPosition === position.value 
                             ? 'border-rose-500 bg-rose-50' 
                             : 'border-gray-300 hover:border-gray-400'">
                        <div class="font-medium">{{ position.label }}</div>
                      </div>
                    </label>
                  </div>
                </div>
              </div>
            </div>

            <!-- Style des boutons -->
            <div class="bg-white/80 backdrop-blur-sm rounded-2xl p-6 shadow-lg border border-white/60">
              <h3 class="text-lg font-semibold text-gray-900 mb-4 flex items-center">
                <span class="mr-3">🎨</span>
                Style des boutons
              </h3>
              
              <div class="space-y-4">
                <!-- Couleur avec palette beauté -->
                <div>
                  <label class="block text-sm font-medium text-gray-700 mb-2">
                    Couleur principale
                  </label>
                  <div class="flex items-center space-x-3">
                    <input
                      v-model="localConfig.widget.primaryColor"
                      @input="markAsChanged"
                      type="color"
                      class="w-12 h-10 border border-gray-300 rounded-lg cursor-pointer"
                    />
                    <input
                      v-model="localConfig.widget.primaryColor"
                      @input="markAsChanged"
                      type="text"
                      class="flex-1 px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:border-blue-500"
                      :class="getInputFocusClasses()"
                    />
                    <!-- ✅ Couleurs beauté prédéfinies -->
                    <div class="flex space-x-1">
                      <button
                        v-for="color in getBeautyColors()"
                        :key="color"
                        @click="selectColor(color)"
                        :style="{ backgroundColor: color }"
                        class="w-8 h-8 rounded-lg border-2 hover:scale-110 transition-transform"
                        :class="localConfig.widget.primaryColor === color ? 'border-gray-900' : 'border-gray-300'"
                      ></button>
                    </div>
                  </div>
                </div>
                
                <!-- Taille et forme -->
                <div class="grid grid-cols-2 gap-4">
                  <div>
                    <label class="block text-sm font-medium text-gray-700 mb-2">Taille</label>
                    <select 
                      v-model="localConfig.widget.widgetSize" 
                      @change="markAsChanged"
                      class="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:border-blue-500"
                      :class="getInputFocusClasses()"
                    >
                      <option value="small">Discret</option>
                      <option value="medium">Normal</option>
                      <option value="large">Visible</option>
                    </select>
                  </div>
                  
                  <div>
                    <label class="block text-sm font-medium text-gray-700 mb-2">Forme</label>
                    <select 
                      v-model="localConfig.widget.borderRadius" 
                      @change="markAsChanged"
                      class="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:border-blue-500"
                      :class="getInputFocusClasses()"
                    >
                      <option value="sm">Légèrement arrondi</option>
                      <option value="md">Arrondi</option>
                      <option value="lg">Très arrondi</option>
                      <option value="full">Capsule</option>
                    </select>
                  </div>
                </div>

                <!-- Comportement -->
                <div class="space-y-3">
                  <div class="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                    <div>
                      <div class="font-medium text-sm">Ouverture automatique</div>
                      <div class="text-xs text-gray-500">Le chat s'ouvre après quelques secondes</div>
                    </div>
                    <button
                      @click="toggleAutoOpen"
                      class="relative inline-flex h-6 w-11 flex-shrink-0 cursor-pointer rounded-full border-2 border-transparent transition-colors duration-200 ease-in-out"
                      :class="localConfig.widget.autoOpen ? getToggleActiveClasses() : 'bg-gray-200'"
                    >
                      <span
                        class="pointer-events-none inline-block h-5 w-5 transform rounded-full bg-white shadow ring-0 transition duration-200 ease-in-out"
                        :class="localConfig.widget.autoOpen ? 'translate-x-5' : 'translate-x-0'"
                      ></span>
                    </button>
                  </div>
                </div>
              </div>
            </div>
          </div>

          <!-- Prévisualisation -->
          <div class="space-y-6">
            
            <!-- Aperçu bouton principal -->
            <div class="bg-white/80 backdrop-blur-sm rounded-2xl p-6 shadow-lg border border-white/60">
              <h3 class="text-lg font-semibold text-gray-900 mb-4">👁️ Aperçu bouton principal</h3>
              
              <div class="bg-gray-100 p-6 rounded-lg">
                <div class="space-y-4">
                  <div class="text-center">
                    <div class="text-2xl font-bold text-gray-900">Sérum Anti-Âge Vitamine C</div>
                    <div class="text-lg text-gray-600">39,90€</div>
                  </div>
                  
                  <!-- Position du bouton selon configuration -->
                  <div v-if="localConfig.widget.position === 'above-cta'" class="space-y-2">
                    <!-- Notre bouton au-dessus -->
                    <button
                      :style="{ 
                        backgroundColor: localConfig.widget.primaryColor,
                        borderRadius: getBorderRadiusValue(),
                        padding: getWidgetPadding(),
                        fontSize: getWidgetFontSize()
                      }"
                      class="w-full text-white font-semibold transition-all hover:opacity-90 flex items-center justify-center space-x-2"
                    >
                      <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z"/>
                      </svg>
                      <span>{{ localConfig.widget.buttonText }}</span>
                    </button>
                    <!-- Bouton d'achat normal -->
                    <button class="w-full px-6 py-3 bg-black text-white font-semibold rounded-lg">
                      Ajouter au panier
                    </button>
                  </div>
                  
                  <div v-else-if="localConfig.widget.position === 'below-cta'" class="space-y-2">
                    <!-- Bouton d'achat normal -->
                    <button class="w-full px-6 py-3 bg-black text-white font-semibold rounded-lg">
                      Ajouter au panier
                    </button>
                    <!-- Notre bouton en-dessous -->
                    <button
                      :style="{ 
                        backgroundColor: localConfig.widget.primaryColor,
                        borderRadius: getBorderRadiusValue(),
                        padding: getWidgetPadding(),
                        fontSize: getWidgetFontSize()
                      }"
                      class="w-full text-white font-semibold transition-all hover:opacity-90 flex items-center justify-center space-x-2"
                    >
                      <span>{{ getBeautyIcon() }}</span>
                      <span>{{ localConfig.widget.buttonText }}</span>
                    </button>
                  </div>
                  
                  <div v-else class="grid grid-cols-2 gap-2">
                    <!-- Bouton d'achat + notre bouton côte à côte -->
                    <button class="px-6 py-3 bg-black text-white font-semibold rounded-lg">
                      Ajouter au panier
                    </button>
                    <button
                      :style="{ 
                        backgroundColor: localConfig.widget.primaryColor,
                        borderRadius: getBorderRadiusValue(),
                        fontSize: getWidgetFontSize()
                      }"
                      class="px-4 py-3 text-white font-semibold transition-all hover:opacity-90 flex items-center justify-center space-x-1"
                    >
                      <span class="text-sm">{{ getBeautyIcon() }}</span>
                      <span class="text-sm">{{ localConfig.widget.buttonText.length > 15 ? '💬' : localConfig.widget.buttonText }}</span>
                    </button>
                  </div>
                </div>
              </div>
            </div>

            <!-- Aperçu bouton flottant -->
            <div class="bg-white/80 backdrop-blur-sm rounded-2xl p-6 shadow-lg border border-white/60">
              <h3 class="text-lg font-semibold text-gray-900 mb-4">👁️ Aperçu bouton flottant</h3>
              
              <div class="bg-gray-100 p-6 rounded-lg relative h-48">
                <div class="text-center text-gray-500 text-sm">Autres pages de votre site</div>
                
                <!-- Bouton flottant positionné -->
                <div
                  :class="[
                    'absolute bottom-4 w-14 h-14 rounded-full flex items-center justify-center text-white shadow-lg cursor-pointer hover:scale-110 transition-transform',
                    localConfig.widget.floatingPosition === 'bottom-right' ? 'right-4' : 'left-4'
                  ]"
                  :style="{ backgroundColor: localConfig.widget.primaryColor }"
                >
                  <svg class="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z"/>
                  </svg>
                </div>
              </div>
            </div>

            <!-- Informations techniques -->
            <div class="bg-white/80 backdrop-blur-sm rounded-2xl p-6 shadow-lg border border-white/60">
              <h3 class="text-lg font-semibold text-gray-900 mb-4">🔧 Informations</h3>
              
              <div class="space-y-3 text-sm">
                <div class="flex justify-between">
                  <span class="font-medium">Couleur :</span>
                  <div class="flex items-center space-x-2">
                    <div class="w-4 h-4 rounded" :style="{ backgroundColor: localConfig.widget.primaryColor }"></div>
                    <span>{{ localConfig.widget.primaryColor }}</span>
                  </div>
                </div>
                
                <div class="flex justify-between">
                  <span class="font-medium">Ouverture auto :</span>
                  <span :class="localConfig.widget.autoOpen ? 'text-green-600' : 'text-gray-500'">
                    {{ localConfig.widget.autoOpen ? 'Activée' : 'Désactivée' }}
                  </span>
                </div>
                
                <div class="flex justify-between">
                  <span class="font-medium">Taille :</span>
                  <span class="capitalize">{{ getWidgetSizeLabel() }}</span>
                </div>

                <div class="flex justify-between">
                  <span class="font-medium">Thème :</span>
                  <span class="capitalize">{{ localConfig.widget.theme?.replace('_', ' ') || 'Beauty Modern' }}</span>
                </div>
              </div>
            </div>
          </div>
        </div>

        <!-- ONGLET 3: TESTER AVEC FEEDBACK -->
        <div v-if="activeTab === 'test'" class="grid lg:grid-cols-3 gap-8">
          
          <!-- Interface de chat avec feedback -->
          <div class="lg:col-span-2">
            <div class="bg-white rounded-2xl shadow-xl overflow-hidden h-96 lg:h-[600px] flex flex-col">
              
              <!-- Header du chat -->
              <div 
                class="px-6 py-4 text-white flex items-center space-x-3"
                :style="{ background: `linear-gradient(135deg, ${localConfig?.widget?.primaryColor || '#E91E63'} 0%, ${adjustColor(localConfig?.widget?.primaryColor || '#E91E63', -20)} 100%)` }"
              >
                <div class="w-10 h-10 rounded-full overflow-hidden border-2 border-white/30">
                  <img
                    v-if="localConfig?.agent?.avatar"
                    :src="localConfig.agent.avatar"
                    :alt="localConfig?.agent?.name"
                    class="w-full h-full object-cover"
                  />
                  <div v-else class="w-full h-full bg-white/20 flex items-center justify-center font-semibold">
                    {{ (localConfig?.agent?.name || 'A').charAt(0).toUpperCase() }}
                  </div>
                </div>
                <div>
                  <div class="font-semibold">{{ localConfig?.agent?.name || 'Conseillère IA' }}</div>
                  <div class="text-sm text-white/80">{{ localConfig?.agent?.title || getBeautyTypeLabel() }}</div>
                </div>
                <div class="ml-auto">
                  <div class="w-2 h-2 bg-green-400 rounded-full"></div>
                </div>
              </div>
              
              <!-- Messages avec feedback -->
              <div class="flex-1 p-4 overflow-y-auto bg-gray-50" ref="chatContainer">
                <div class="space-y-4">
                  <div 
                    v-for="message in testMessages" 
                    :key="message.id"
                    class="flex items-start space-x-3"
                    :class="message.role === 'user' ? 'flex-row-reverse space-x-reverse' : ''"
                  >
                    <div 
                      class="w-8 h-8 rounded-full flex items-center justify-center text-xs font-semibold flex-shrink-0"
                      :class="message.role === 'user' ? 'bg-gray-500 text-white' : 'text-white'"
                      :style="message.role === 'assistant' ? { backgroundColor: localConfig?.widget?.primaryColor || '#E91E63' } : {}"
                    >
                      {{ message.role === 'user' ? 'V' : (localConfig?.agent?.name || 'A').charAt(0) }}
                    </div>
                    <div 
                      class="max-w-xs relative"
                      :class="message.role === 'user' ? 'items-end' : 'items-start'"
                    >
                      <div
                        class="p-3 rounded-lg text-sm leading-relaxed"
                        :class="message.role === 'user' 
                          ? 'bg-gray-500 text-white rounded-tr-sm' 
                          : 'bg-white border border-gray-200 rounded-tl-sm'"
                      >
                        <div v-if="message.loading" class="flex items-center">
                          <div class="animate-pulse flex space-x-1">
                            <div class="w-2 h-2 bg-gray-400 rounded-full"></div>
                            <div class="w-2 h-2 bg-gray-400 rounded-full"></div>
                            <div class="w-2 h-2 bg-gray-400 rounded-full"></div>
                          </div>
                          <span class="ml-2 text-xs text-gray-500">{{ localConfig?.agent?.name || 'Conseillère' }} écrit...</span>
                        </div>
                        <div v-else v-html="formatMessage(message.content)"></div>
                      </div>
                      
                      <!-- ✅ NOUVEAU : Boutons feedback pour messages IA -->
                      <div v-if="message.role === 'assistant' && !message.loading" class="flex items-center mt-1 space-x-1">
                        <button
                          @click="submitQuickFeedback(message, 'positive')"
                          class="p-1 text-gray-400 hover:text-green-600 transition-colors"
                          title="Bonne réponse"
                        >
                          👍
                        </button>
                        <button
                          @click="submitQuickFeedback(message, 'negative')"
                          class="p-1 text-gray-400 hover:text-red-600 transition-colors"
                          title="Mauvaise réponse"
                        >
                          👎
                        </button>
                        <button
                          @click="openFeedbackModal(message)"
                          class="p-1 text-gray-400 hover:text-blue-600 transition-colors"
                          title="Corriger cette réponse"
                        >
                          ✏️
                        </button>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
              
              <!-- Input message -->
              <div class="p-4 border-t border-gray-200 bg-white">
                <div class="flex space-x-3">
                  <input
                    v-model="testMessage"
                    @keyup.enter="sendTestMessage"
                    type="text"
                    :placeholder="getTestPlaceholder()"
                    class="flex-1 px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:border-blue-500 text-sm"
                    :class="getInputFocusClasses()"
                    :disabled="sendingMessage"
                  />
                  <button 
                    @click="sendTestMessage"
                    :disabled="!testMessage.trim() || sendingMessage || !canUseAI"
                    class="px-4 py-2 text-white rounded-lg hover:opacity-90 transition-colors disabled:opacity-50"
                    :style="{ backgroundColor: localConfig?.widget?.primaryColor || '#E91E63' }"
                    :title="!canUseAI ? 'Quota réponses IA atteint' : ''"
                  >
                    <svg v-if="!sendingMessage" class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 19l9 2-9-18-9 18 9-2zm0 0v-8"/>
                    </svg>
                    <div v-else class="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                  </button>
                </div>
                
                <!-- ✅ Quota warning -->
                <div v-if="!canUseAI" class="mt-2 text-xs text-red-600">
                  ⚠️ Quota réponses IA atteint - {{ quotaSummary?.aiResponses.used }}/{{ quotaSummary?.aiResponses.limit }}
                </div>
              </div>
            </div>
          </div>

          <!-- Contrôles de test -->
          <div class="space-y-6">
            
            <!-- Scénarios prédéfinis beauté -->
            <div class="bg-white/80 backdrop-blur-sm rounded-2xl p-6 shadow-lg border border-white/60">
              <h3 class="text-lg font-semibold text-gray-900 mb-4">🎯 Scénarios beauté</h3>
              
              <div class="space-y-3">
                <button
                  v-for="scenario in getTestScenarios()"
                  :key="scenario.id"
                  @click="runTestScenario(scenario.message)"
                  :disabled="sendingMessage || !canUseAI"
                  class="w-full text-left p-3 border border-gray-200 rounded-lg hover:bg-gray-50 transition-colors disabled:opacity-50"
                >
                  <div class="font-medium text-sm">{{ scenario.title }}</div>
                  <div class="text-xs text-gray-500 mt-1">{{ scenario.description }}</div>
                </button>
              </div>
            </div>

            <!-- Statistiques du test -->
            <div class="bg-white/80 backdrop-blur-sm rounded-2xl p-6 shadow-lg border border-white/60">
              <h3 class="text-lg font-semibold text-gray-900 mb-4">📊 Performance</h3>
              
              <div class="space-y-3 text-sm">
                <div class="flex justify-between">
                  <span>Messages envoyés :</span>
                  <span class="font-semibold">{{ testMessages.filter(m => m.role === 'user').length }}</span>
                </div>
                
                <div class="flex justify-between">
                  <span>Réponses reçues :</span>
                  <span class="font-semibold">{{ testMessages.filter(m => m.role === 'assistant' && !m.loading).length }}</span>
                </div>
                
                <div class="flex justify-between">
                  <span>Temps moyen :</span>
                  <span class="font-semibold">{{ averageResponseTime }}ms</span>
                </div>

                <div class="flex justify-between">
                  <span>Feedback positif :</span>
                  <span class="font-semibold text-green-600">{{ positiveFeedbackCount }}</span>
                </div>

                <div class="flex justify-between">
                  <span>Corrections :</span>
                  <span class="font-semibold text-orange-600">{{ correctionFeedbackCount }}</span>
                </div>
              </div>
              
              <button
                @click="resetTestChat"
                class="w-full mt-4 px-4 py-2 border border-red-300 text-red-600 rounded-lg hover:bg-red-50 transition-colors text-sm font-medium"
              >
                🔄 Réinitialiser
              </button>
            </div>

            <!-- Conseils d'optimisation beauté -->
            <div class="bg-white/80 backdrop-blur-sm rounded-2xl p-6 shadow-lg border border-white/60">
              <h3 class="text-lg font-semibold text-gray-900 mb-4">💡 Conseils beauté</h3>
              
              <div class="space-y-3 text-sm text-gray-600">
                <p>• Testez la qualification automatique du type de peau</p>
                <p>• Vérifiez les recommandations de produits beauté</p>
                <p>• Testez les conseils d'application et d'utilisation</p>
                <p>• Vérifiez la personnalisation selon l'âge/budget</p>
                <p>• Assurez-vous que l'upsell est pertinent</p>
              </div>
            </div>
          </div>
        </div>

        <!-- ONGLET 4: ACTIVER (inchangé mais avec quota checks) -->
        <div v-if="activeTab === 'activate'" class="max-w-4xl mx-auto space-y-8">
          
          <!-- Statut activation -->
          <div class="text-center">
            <div v-if="localConfig?.agent?.isActive && localConfig?.widget?.isActive" class="inline-flex items-center px-6 py-3 bg-green-50 border border-green-200 rounded-full">
              <svg class="w-5 h-5 text-green-500 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M5 13l4 4L19 7"/>
              </svg>
              <span class="text-green-800 font-semibold">{{ localConfig.agent.name }} est active sur votre site !</span>
            </div>
            
            <div v-else class="inline-flex items-center px-6 py-3 bg-orange-50 border border-orange-200 rounded-full">
              <svg class="w-5 h-5 text-orange-500 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 9v2m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"/>
              </svg>
              <span class="text-orange-800 font-semibold">{{ localConfig.agent.name }} n'est pas encore active</span>
            </div>
          </div>

          <!-- Code d'intégration avec instructions beauté -->
          <div class="bg-white/80 backdrop-blur-sm rounded-2xl p-8 shadow-lg border border-white/60">
            <h3 class="text-xl font-semibold text-gray-900 mb-6">
              🔧 Code d'intégration beauté
            </h3>
            
            <div class="space-y-4">
              <div class="p-4 bg-gray-800 rounded-lg relative">
                <pre class="text-green-400 text-xs overflow-x-auto"><code>{{ integrationCodePreview }}</code></pre>
                
                <button
                  @click="copyIntegrationCode"
                  class="absolute top-4 right-4 px-3 py-1 bg-gray-700 text-white text-xs rounded hover:bg-gray-600 transition-colors"
                >
                  {{ codeCopied ? '✅ Copié' : '📋 Copier' }}
                </button>
              </div>
              
              <div class="bg-blue-50 border border-blue-200 rounded-lg p-4">
                <div class="flex items-start space-x-3">
                  <svg class="w-5 h-5 text-blue-500 mt-0.5 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"/>
                  </svg>
                  <div class="text-sm text-blue-800">
                    <p class="font-semibold mb-2">Installation spécialisée beauté :</p>
                    <ol class="list-decimal list-inside space-y-1 text-xs">
                      <li>Copiez le code ci-dessus</li>
                      <li>Collez-le juste avant la balise &lt;/body&gt; de votre site</li>
                      <li>Votre conseillère beauté apparaîtra automatiquement</li>
                      <li>Les boutons s'adaptent selon vos pages produits</li>
                      <li>La collecte du profil beauté est automatique</li>
                    </ol>
                  </div>
                </div>
              </div>
            </div>
          </div>

          <!-- Actions finales -->
          <div class="text-center space-y-4">
            <div class="flex flex-col sm:flex-row gap-4 justify-center">
              <button
                @click="activeTab = 'test'"
                class="px-6 py-3 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition-colors font-medium"
              >
                🧪 Tester à nouveau
              </button>
              
              <button
                @click="goToAnalytics"
                class="px-6 py-3 text-white rounded-lg hover:opacity-90 transition-colors font-medium"
                :class="getAnalyticsButtonClasses()"
              >
                📊 Voir les performances beauté
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>

    <!-- Modals -->
    <!-- Modal de base de connaissances -->
    <div
      v-if="showKnowledgeModal"
      class="fixed inset-0 z-50 bg-black bg-opacity-50 flex items-center justify-center p-4"
      @click.self="closeKnowledgeModal"
    >
      <div class="bg-white rounded-2xl shadow-xl max-w-2xl w-full max-h-[80vh] flex flex-col">
        <div class="p-6 border-b border-gray-200">
          <div class="flex items-center justify-between">
            <h3 class="text-lg font-semibold text-gray-900">📚 Base de connaissances beauté</h3>
            <button @click="closeKnowledgeModal" class="text-gray-400 hover:text-gray-600">
              <svg class="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12"/>
              </svg>
            </button>
          </div>
          <p class="text-sm text-gray-600 mt-2">
            Sélectionnez les documents que votre conseillère doit connaître.
            <span v-if="quotaSummary?.knowledgeDocuments" class="text-blue-600 font-medium ml-2">
              ({{ quotaSummary.knowledgeDocuments.used }}/{{ quotaSummary.knowledgeDocuments.limit === -1 ? '∞' : quotaSummary.knowledgeDocuments.limit }} utilisés)
            </span>
          </p>
        </div>
        
        <div class="flex-1 p-6 overflow-y-auto">
          <div v-if="availableDocuments.length === 0" class="text-center py-8">
            <div class="text-4xl mb-4">📄</div>
            <p class="text-gray-600 mb-2">Aucun document disponible</p>
            <p class="text-sm text-gray-500">
              <nuxt-link to="/knowledge-base" class="text-blue-600 hover:underline">
                Créez des documents beauté
              </nuxt-link>
              dans votre base de connaissances
            </p>
          </div>
          
          <div v-else class="space-y-3">
            <div 
              v-for="doc in availableDocuments" 
              :key="doc.id"
              class="flex items-center space-x-3 p-3 border border-gray-200 rounded-lg hover:bg-gray-50"
            >
              <input
                v-model="selectedDocuments"
                :value="doc.id"
                :disabled="!selectedDocuments.includes(doc.id) && !canAddDocument"
                type="checkbox"
                class="h-4 w-4 border-gray-300 rounded focus:ring-blue-500 text-blue-600 disabled:opacity-50"
              >
              <div class="flex-1 min-w-0">
                <p class="text-sm font-medium text-gray-900 truncate">{{ doc.title }}</p>
                <p class="text-xs text-gray-500">{{ getContentTypeLabel(doc.contentType) }}</p>
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
              {{ selectedDocuments.length }} document(s) sélectionné(s)
            </p>
            <div class="flex space-x-3">
              <button
                @click="closeKnowledgeModal"
                class="px-4 py-2 border border-gray-300 rounded-lg text-sm font-medium text-gray-700 hover:bg-gray-50"
              >
                Annuler
              </button>
              <button
                @click="saveKnowledgeSelection"
                :disabled="savingKnowledge || (!canAddDocument && selectedDocuments.length > (knowledgeDocuments?.length || 0))"
                class="px-4 py-2 text-white rounded-lg text-sm font-medium hover:opacity-90 disabled:opacity-50"
                :class="getSaveButtonClasses()"
              >
                {{ savingKnowledge ? 'Sauvegarde...' : 'Sauvegarder' }}
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>

    <!-- Modal d'aperçu message d'accueil -->
    <div
      v-if="showWelcomePreview"
      class="fixed inset-0 z-50 bg-black bg-opacity-50 flex items-center justify-center p-4"
      @click.self="closeWelcomePreview"
    >
      <div class="bg-white rounded-2xl shadow-xl max-w-md w-full">
        <div class="p-6 border-b border-gray-200">
          <div class="flex items-center justify-between">
            <h3 class="text-lg font-semibold text-gray-900">👁️ Aperçu du message beauté</h3>
            <button @click="closeWelcomePreview" class="text-gray-400 hover:text-gray-600">
              <svg class="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12"/>
              </svg>
            </button>
          </div>
        </div>
        
        <div class="p-6">
          <div class="bg-gray-50 p-4 rounded-lg">
            <div class="flex items-start space-x-3">
              <div class="w-8 h-8 rounded-full overflow-hidden flex-shrink-0">
                <img
                  v-if="localConfig?.agent?.avatar"
                  :src="localConfig.agent.avatar"
                  :alt="localConfig.agent.name"
                  class="w-full h-full object-cover"
                />
                <div v-else class="w-full h-full flex items-center justify-center text-white font-semibold text-sm" :class="getAvatarBackgroundClasses()">
                  {{ (localConfig?.agent?.name || 'A').charAt(0).toUpperCase() }}
                </div>
              </div>
              <div class="flex-1">
                <div class="font-medium text-sm mb-1">{{ localConfig?.agent?.name || 'Conseillère IA' }}</div>
                <div 
                  class="text-sm leading-relaxed bg-white p-3 rounded-lg border"
                  v-html="getPreviewMessage()"
                ></div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>

    <!-- ✅ NOUVEAU : Modal feedback IA correction -->
    <FeedbackCorrection
      v-if="showFeedbackModal && selectedMessageForFeedback"
      :message-id="selectedMessageForFeedback.id"
      :agent-id="agentId"
      :conversation-id="'test-conversation'"
      :original-response="selectedMessageForFeedback.content"
      :existing-feedback="selectedMessageForFeedback.feedback"
      @close="closeFeedbackModal"
      @feedback-submitted="onFeedbackSubmitted"
    />
  </div>
</template>

<script setup lang="ts">
import { ref, computed, onMounted, nextTick } from 'vue'
import { useRouter, useRoute } from 'vue-router'
import { useAuthStore } from '~/stores/auth'
import { useAgentConfig } from '~/composables/useAgentConfig'
import { useKnowledgeBase } from '~/composables/useKnowledgeBase'
import { useQuotas } from '~/composables/useQuotas'
import { useAIFeedback } from '~/composables/useAIFeedback'
import FeedbackCorrection from '~/components/FeedbackCorrection.vue'

// ✅ IMPORTS TYPES CENTRALISÉS BEAUTÉ
import type {
  AgentConfig,
  Agent,
  WidgetConfig,
  AgentType,
  PersonalityType,
  ProductRange,
  BeautyCategory
} from '~/types/beauty'

import {
  BEAUTY_AGENT_TYPES,
  PRODUCT_RANGE_OPTIONS,
  BEAUTY_INSTRUCTION_TEMPLATES,
  BEAUTY_FEEDBACK_TAGS,
  getTypeLabel,
  getProductRangeLabel,
  getAgentIcon,
  getAvatarClass,
  getDefaultWelcomeTemplate
} from '~/types/beauty'

// Page metadata
definePageMeta({
  middleware: 'auth',
  layout: 'default'
})

// Composables
const router = useRouter()
const route = useRoute()
const authStore = useAuthStore()
const { 
  loading, 
  saving, 
  error, 
  agentConfig, 
  fetchAgentConfig, 
  saveCompleteConfig,
  linkKnowledgeBaseDocuments,
  testAIMessage,
  integrationCode,
  clearError,
  previewWelcomeMessage
} = useAgentConfig()

const { 
  documents: availableDocuments, 
  fetchDocuments 
} = useKnowledgeBase()

const {
  quotaAlerts,
  quotaSummary,
  checkQuotaBeforeAction,
  incrementQuota
} = useQuotas()

const {
  feedbacks: recentFeedbacks,
  submitFeedback,
  getFeedbacks,
  createQuickFeedback,
  createCorrectionFeedback,
  beautyFeedbackTags
} = useAIFeedback()

// État réactif
const activeTab = ref('agent')
const localConfig = ref<AgentConfig>({
  agent: {
    id: '',
    name: '',
    title: '',
    type: 'beauty_expert',
    personality: 'friendly',
    productType: 'auto',
    customProductType: '',
    productRange: 'premium',
    customProductRange: '',
    shopName: '',
    description: '',
    welcomeMessage: '',
    fallbackMessage: '',
    avatar: '',
    isActive: true,
    config: {
      collectName: true,
      collectPhone: true,
      collectEmail: false,
      collectAddress: true,
      collectBeautyProfile: true,
      collectAge: false,
      collectBudget: false, 
      collectPreferences: false,
      collectPayment: true,
      upsellEnabled: true,
      urgencyEnabled: false,
      specificInstructions: [],
      linkedKnowledgeBase: [],
      aiProvider: 'openai',
      temperature: 0.7,
      maxTokens: 1000,
      systemPrompt: '',
      generatedSystemPrompt: '',
      tone: 'friendly'
    },
    stats: {
      conversations: 0,
      conversions: 0
    },
    knowledgeBase: [],
    createdAt: '',
    updatedAt: ''
  },
  widget: {
    buttonText: 'Parler à votre conseillère beauté',
    primaryColor: '#E91E63',
    position: 'above-cta',
    floatingPosition: 'bottom-right',
    widgetSize: 'medium',
    theme: 'beauty_modern',
    borderRadius: 'lg',
    animation: 'fade',
    autoOpen: false,
    showAvatar: true,
    soundEnabled: true,
    mobileOptimized: true,
    showTypingIndicator: true,
    offlineMessage: null,
    isActive: true,
    language: 'fr'
  },
  knowledgeBase: []
})

const localSuccessMessage = ref<string | null>(null)
const localError = ref<string | null>(null)
const hasChanges = ref(false)
const beautyProfile = ref<{ beautyCategory: BeautyCategory }>({ beautyCategory: 'multi' })

// États des modals
const showKnowledgeModal = ref(false)
const showWelcomePreview = ref(false)
const selectedDocuments = ref<string[]>([])
const savingKnowledge = ref(false)
const knowledgeDocuments = ref<any[]>([])

// États du test avec feedback
const testMessages = ref<any[]>([])
const testMessage = ref('')
const sendingMessage = ref(false)
const responseTimes = ref<number[]>([])
const showFeedbackModal = ref(false)
const selectedMessageForFeedback = ref<any>(null)
const showAllFeedbacks = ref(false)

// États d'installation
const codeCopied = ref(false)

// Refs HTML
const avatarUpload = ref<HTMLInputElement>()
const welcomeMessageInput = ref<HTMLTextAreaElement>()
const chatContainer = ref<HTMLElement>()

// Instructions beauty
const showAdvancedInstructions = ref(false)
const selectedInstructionTemplates = ref<string[]>([])
const customInstructions = ref('')

// Computed
const agentId = computed(() => route.params.id as string)
const agentName = computed(() => localConfig.value.agent.name)

const agentStats = computed(() => ({
  conversations: agentConfig.value?.agent?.stats?.conversations || 0,
  conversions: agentConfig.value?.agent?.stats?.conversions || 0
}))

const conversionRate = computed(() => {
  const { conversations, conversions } = agentStats.value
  return conversations > 0 ? Math.round((conversions / conversations) * 100) : 0
})

const averageResponseTime = computed(() => {
  if (responseTimes.value.length === 0) return 0
  return Math.round(responseTimes.value.reduce((a, b) => a + b, 0) / responseTimes.value.length)
})

const integrationCodePreview = computed(() => {
  if (!integrationCode.value) return '// Code d\'intégration en cours de génération...'
  return integrationCode.value.substring(0, 300) + '...\n// Code complet'
})

// ✅ NOUVEAUX COMPUTED POUR QUOTAS ET FEEDBACK
const canUseAI = computed(() => {
  const check = checkQuotaBeforeAction('aiResponses', 1)
  return check.allowed
})
const canAddDocument = computed(() => {
  const check = checkQuotaBeforeAction('knowledgeDocuments', 1)
  return check.allowed
})

const positiveFeedbackCount = computed(() => {
  return recentFeedbacks.value.filter(f => f.feedbackType === 'validation').length
})

const correctionFeedbackCount = computed(() => {
  return recentFeedbacks.value.filter(f => f.feedbackType === 'correction').length
})

// Données adaptatives par secteur beauté - Noms plus intuitifs pour non-tech
const tabs = [
  { id: 'agent', name: 'Personnaliser', icon: '👩‍💼', description: 'Donnez une personnalité unique à votre conseillère' },
  { id: 'buttons', name: 'Apparence', icon: '🎨', description: 'Personnalisez l\'apparence du chat sur votre site' },
  { id: 'test', name: 'Tester', icon: '🧪', description: 'Testez les réponses de votre conseillère avant de la publier' },
  { id: 'activate', name: 'Installer', icon: '⚡', description: 'Copiez le code pour activer votre conseillère sur votre site' }
]

// Fonction pour vérifier si un onglet est complété
const getTabCompletedStatus = (tabId: string): boolean => {
  switch (tabId) {
    case 'agent':
      // Onglet personnalisation complété si nom et message d'accueil définis
      return !!(localConfig.value.agent.name && localConfig.value.agent.welcomeMessage)
    case 'buttons':
      // Onglet apparence complété si couleur et texte de bouton définis
      return !!(localConfig.value.widget.primaryColor && localConfig.value.widget.buttonText)
    case 'test':
      // Onglet test complété si au moins un message a été envoyé
      return testMessages.value.length > 0
    case 'activate':
      // Onglet installation complété si l'agent est actif
      return !!(localConfig.value.agent.isActive && localConfig.value.widget.isActive)
    default:
      return false
  }
}

// Fonction pour obtenir la description de l'onglet actif
const getActiveTabDescription = (): string => {
  const tab = tabs.find(t => t.id === activeTab.value)
  return tab?.description || ''
}

const mainButtonPositions = [
  { value: 'above-cta', label: 'Au-dessus', description: 'Sur le bouton d\'achat' },
  { value: 'below-cta', label: 'En-dessous', description: 'Sous le bouton d\'achat' },
  { value: 'beside-cta', label: 'À côté', description: 'À côté du bouton d\'achat' }
]

const floatingButtonPositions = [
  { value: 'bottom-right', label: 'Bas droite' },
  { value: 'bottom-left', label: 'Bas gauche' }
]

// Méthodes utilitaires pour l'adaptation beauté
const loadBeautyProfile = async () => {
  try {
    const user = authStore.user
    if (user?.shop?.beauty_category) {
      beautyProfile.value.beautyCategory = user.shop.beauty_category
    }
  } catch (error) {
    console.warn('Erreur chargement profil beauté:', error)
  }
}

const getBeautyTypeMapping = () => {
  const mappings = {
    skincare: { icon: '✨', label: 'Esthéticienne IA', color: 'rose' },
    makeup: { icon: '💄', label: 'Experte Maquillage IA', color: 'purple' },
    fragrance: { icon: '🌸', label: 'Conseillère Parfums IA', color: 'violet' },
    haircare: { icon: '💇‍♀️', label: 'Experte Capillaire IA', color: 'amber' },
    bodycare: { icon: '🧴', label: 'Experte Soins Corps IA', color: 'teal' },
    multi: { icon: '👤', label: 'Conseillère IA', color: 'pink' }
  }
  return mappings[beautyProfile.value.beautyCategory as keyof typeof mappings] || mappings.multi
}

const getBeautyIcon = () => getBeautyTypeMapping().icon
const getBeautyTypeLabel = () => getBeautyTypeMapping().label
const getColorScheme = () => getBeautyTypeMapping().color

// Classes adaptatives selon le domaine beauté
const getBeautyIconClasses = () => `text-${getColorScheme()}-600`
const getStatusClasses = () => localConfig.value.agent.isActive ? 'text-green-600' : 'text-red-600'
const getSaveButtonClasses = () => `bg-${getColorScheme()}-600 hover:bg-${getColorScheme()}-700`
const getLoadingClasses = () => `border-${getColorScheme()}-500`
const getInputFocusClasses = () => `focus:ring-${getColorScheme()}-500 focus:border-${getColorScheme()}-500`
const getAvatarBorderClasses = () => `border-${getColorScheme()}-200`
const getAvatarBackgroundClasses = () => `bg-${getColorScheme()}-500`
const getVariablesBackgroundClasses = () => `bg-${getColorScheme()}-50 border border-${getColorScheme()}-200`
const getVariablesTextClasses = () => `text-${getColorScheme()}-800`
const getVariableButtonClasses = () => `text-${getColorScheme()}-700 border-${getColorScheme()}-200 hover:bg-${getColorScheme()}-50`
const getPreviewButtonClasses = () => `bg-${getColorScheme()}-600 hover:bg-${getColorScheme()}-700`
const getKnowledgeButtonClasses = () => `bg-${getColorScheme()}-600 hover:bg-${getColorScheme()}-700`
const getDocIconClasses = () => `bg-${getColorScheme()}-100 text-${getColorScheme()}-600`
const getStatsTextClasses = () => `text-${getColorScheme()}-600`
const getToggleActiveClasses = () => `bg-${getColorScheme()}-600`
const getToggleFocusClasses = () => `focus:ring-${getColorScheme()}-500`
const getTestButtonClasses = () => `bg-${getColorScheme()}-600 hover:bg-${getColorScheme()}-700`
const getButtonsButtonClasses = () => `border-${getColorScheme()}-600 text-${getColorScheme()}-600 hover:bg-${getColorScheme()}-50`
const getActivateButtonClasses = () => `border-${getColorScheme()}-600 text-${getColorScheme()}-600 hover:bg-${getColorScheme()}-50`
const getAnalyticsButtonClasses = () => `bg-${getColorScheme()}-600 hover:bg-${getColorScheme()}-700`

// ✅ NOUVEAU : Classes pour alertes quotas
const getAlertClasses = (type: string) => {
  const classMap = {
    warning: 'bg-yellow-50 border border-yellow-200',
    critical: 'bg-orange-50 border border-orange-200',
    exceeded: 'bg-red-50 border border-red-200'
  }
  return classMap[type as keyof typeof classMap]
}

const getAlertIconClasses = (type: string) => {
  const classMap = {
    warning: 'text-yellow-400',
    critical: 'text-orange-400',
    exceeded: 'text-red-400'
  }
  return classMap[type as keyof typeof classMap]
}

const getAlertTextClasses = (type: string) => {
  const classMap = {
    warning: 'text-yellow-800',
    critical: 'text-orange-800',
    exceeded: 'text-red-800'
  }
  return classMap[type as keyof typeof classMap]
}

const getAlertProgressClasses = (type: string) => {
  const classMap = {
    warning: 'bg-yellow-500',
    critical: 'bg-orange-500',
    exceeded: 'bg-red-500'
  }
  return classMap[type as keyof typeof classMap]
}

const getAlertButtonClasses = (type: string) => {
  const classMap = {
    warning: 'bg-yellow-100 text-yellow-800 hover:bg-yellow-200',
    critical: 'bg-orange-100 text-orange-800 hover:bg-orange-200',
    exceeded: 'bg-red-100 text-red-800 hover:bg-red-200'
  }
  return classMap[type as keyof typeof classMap]
}

// Types d'agents beauté selon le profil
const getBeautyTypes = () => {
  const currentMapping = getBeautyTypeMapping()
  return [
    { value: 'beauty_expert', icon: currentMapping.icon, label: currentMapping.label }
  ]
}

const getProductRangeOptions = () => PRODUCT_RANGE_OPTIONS

const getBeautyColors = () => {
  const colorSets = {
    rose: ['#E91E63', '#EC4899', '#F472B6'],
    purple: ['#9C27B0', '#A855F7', '#C084FC'],
    violet: ['#673AB7', '#8B5CF6', '#A78BFA'],
    amber: ['#FF9800', '#F59E0B', '#FBBF24'],
    teal: ['#00BCD4', '#14B8A6', '#5EEAD4'],
    pink: ['#E91E63', '#F472B6', '#FBBF24']
  }
  return colorSets[getColorScheme() as keyof typeof colorSets] || colorSets.pink
}

const getAvailableVariables = () => [
  { name: '{nomConseillere}', display: '👤 Nom conseillère' },
  { name: '{nomMarque}', display: '🏪 Nom marque' }
]

const getSpecialityPlaceholder = () => {
  const placeholders = {
    skincare: 'Ex: Experte soins anti-âge',
    makeup: 'Ex: Artiste maquillage',
    fragrance: 'Ex: Conseillère parfums de luxe',
    haircare: 'Ex: Coiffeur visagiste',
    bodycare: 'Ex: Experte bien-être',
    multi: 'Ex: Conseillère beauté globale'
  }
  return placeholders[beautyProfile.value.beautyCategory as keyof typeof placeholders] || placeholders.multi
}

const getWelcomeMessagePlaceholder = () => {
  const templates = {
    skincare: 'Bonjour ! Je suis {nomConseillere}, votre esthéticienne chez {nomMarque}. Comment puis-je prendre soin de votre peau aujourd\'hui ?',
    makeup: 'Salut ! Moi c\'est {nomConseillere}, experte maquillage chez {nomMarque}. Quel look souhaitez-vous créer ?',
    fragrance: 'Bonjour ! Je suis {nomConseillere}, conseillère parfums chez {nomMarque}. Quelle fragrance vous ferait rêver ?',
    multi: 'Bonjour ! Je suis {nomConseillere}, conseillère beauté chez {nomMarque}. Comment puis-je vous aider ?'
  }
  return templates[beautyProfile.value.beautyCategory as keyof typeof templates] || templates.multi
}

const getTestPlaceholder = () => {
  const placeholders = {
    skincare: 'Ex: Quel soin pour ma peau mixte ?',
    makeup: 'Ex: Comment faire un smoky eye ?',
    fragrance: 'Ex: Quel parfum pour l\'été ?',
    multi: 'Ex: Des conseils beauté personnalisés ?'
  }
  return placeholders[beautyProfile.value.beautyCategory as keyof typeof placeholders] || placeholders.multi
}

const getTestScenarios = () => {
  const scenarios = {
    skincare: [
      { id: 1, title: '🔍 Diagnostic peau', message: 'Bonjour, j\'aimerais connaître mon type de peau', description: 'Test analyse peau' },
      { id: 2, title: '✨ Routine soins', message: 'Pouvez-vous me conseiller une routine anti-âge ?', description: 'Conseils routine' },
      { id: 3, title: '🛒 Intention d\'achat', message: 'J\'aimerais acheter ce produit', description: 'Test conversion' }
    ],
    makeup: [
      { id: 1, title: '💄 Look occasion', message: 'Quel maquillage pour un mariage ?', description: 'Maquillage événement' },
      { id: 2, title: '🎨 Technique', message: 'Comment faire un contouring naturel ?', description: 'Aide technique' },
      { id: 3, title: '🛒 Commande', message: 'Je veux commander ce fard à paupières', description: 'Test achat' }
    ],
    multi: [
      { id: 1, title: '🎀 Routine beauté', message: 'J\'aimerais refaire ma routine beauté', description: 'Conseils globaux' },
      { id: 2, title: '💡 Recommandations', message: 'Quels sont vos produits incontournables ?', description: 'Conseils produits' },
      { id: 3, title: '🛍️ Achat', message: 'Je veux acheter ce produit', description: 'Test conversion' }
    ]
  }
  return scenarios[beautyProfile.value.beautyCategory as keyof typeof scenarios] || scenarios.multi
}

// Templates d'instructions beauté
const getBeautyInstructionTemplates = () => BEAUTY_INSTRUCTION_TEMPLATES

// Helper feedback beauté
const getBeautyFeedbackTagLabel = (tagId: string) => {
  const tag = beautyFeedbackTags.find(t => t.id === tagId)
  return tag?.label || tagId
}

const formatTime = (date: Date) => {
  const now = new Date()
  const diffInSeconds = Math.floor((now.getTime() - date.getTime()) / 1000)
  
  if (diffInSeconds < 60) return `${diffInSeconds}s`
  if (diffInSeconds < 3600) return `${Math.floor(diffInSeconds / 60)}min`
  if (diffInSeconds < 86400) return `${Math.floor(diffInSeconds / 3600)}h`
  
  return date.toLocaleTimeString('fr-FR', { 
    hour: '2-digit', 
    minute: '2-digit' 
  })
}

// Méthodes d'interaction
const markAsChanged = () => {
  hasChanges.value = true
}

const goBack = () => {
  router.push('/')
}

const clearLocalError = () => {
  localError.value = null
  clearError()
}

// Méthodes avatar
const triggerAvatarUpload = () => {
  avatarUpload.value?.click()
}

const handleAvatarUpload = async (event: Event) => {
  const file = (event.target as HTMLInputElement).files?.[0]
  if (!file) return
  
  if (!file.type.startsWith('image/')) {
    localError.value = 'Veuillez sélectionner une image valide.'
    return
  }
  
  const reader = new FileReader()
  reader.onload = (e) => {
    localConfig.value.agent.avatar = e.target?.result as string
    markAsChanged()
  }
  reader.readAsDataURL(file)
}

const handleAvatarError = (event: Event) => {
  const img = event.target as HTMLImageElement
  const name = localConfig.value.agent.name || 'Agent'
  img.src = `https://ui-avatars.com/api/?name=${encodeURIComponent(name)}&background=${getColorScheme()}&color=fff&size=128`
}

// Méthodes message d'accueil
const insertVariable = (variableName: string) => {
  const textarea = welcomeMessageInput.value
  if (textarea) {
    const start = textarea.selectionStart
    const end = textarea.selectionEnd
    const text = localConfig.value.agent.welcomeMessage || ''
    
    localConfig.value.agent.welcomeMessage = 
      text.substring(0, start) + variableName + text.substring(end)
    
    markAsChanged()
    
    nextTick(() => {
      textarea.focus()
      textarea.selectionStart = textarea.selectionEnd = start + variableName.length
    })
  }
}

const resetWelcomeMessage = () => {
  localConfig.value.agent.welcomeMessage = getWelcomeMessagePlaceholder()
  markAsChanged()
}

const openWelcomePreview = () => {
  showWelcomePreview.value = true
}

const closeWelcomePreview = () => {
  showWelcomePreview.value = false
}

const getPreviewMessage = () => {
  let message = localConfig.value.agent.welcomeMessage || getWelcomeMessagePlaceholder()
  
  message = message
    .replace(/{nomConseillere}/g, localConfig.value.agent.name || 'Conseillère')
    .replace(/{nomMarque}/g, authStore.user?.shop?.name || 'Notre Marque')
  
  return message
    .replace(/\*\*(.*?)\*\*/g, '<strong>$1</strong>')
    .replace(/\n/g, '<br>')
}

// Instructions beauté
const getGeneratedSystemPrompt = () => {
  let prompt = `Tu es une conseillère beauté experte spécialisée ${beautyProfile.value.beautyCategory}. `
  
  const selectedTemplates = BEAUTY_INSTRUCTION_TEMPLATES.filter(t => 
    selectedInstructionTemplates.value.includes(t.id)
  )
  
  if (selectedTemplates.length > 0) {
    prompt += `\n\nRÈGLES SPÉCIALISÉES BEAUTÉ :\n`
    selectedTemplates.forEach((template, index) => {
      prompt += `${index + 1}. ${template.instructions}\n`
    })
  }
  
  if (customInstructions.value?.trim()) {
    prompt += `\n\nINSTRUCTIONS PERSONNALISÉES :\n${customInstructions.value.trim()}\n`
  }
  
  const collectRules = []
  if (localConfig.value?.agent?.config?.collectBeautyProfile) {
    collectRules.push('Demander le type de peau/cheveux')
  }
  if (localConfig.value?.agent?.config?.collectAge) {
    collectRules.push('Qualifier l\'âge approximatif')
  }
  if (localConfig.value?.agent?.config?.collectBudget) {
    collectRules.push('Demander le budget envisagé')
  }
  if (localConfig.value?.agent?.config?.collectPreferences) {
    collectRules.push('Demander les préférences (parfums, textures)')
  }
  
  if (collectRules.length > 0) {
    prompt += `\n\nCOLLECTE D'INFORMATIONS BEAUTÉ :\n`
    collectRules.forEach((rule, index) => {
      prompt += `${index + 1}. ${rule}\n`
    })
  }
  
  return prompt.trim() || 'Aucune instruction personnalisée définie.'
}

// Méthodes base de connaissances
const openKnowledgeModal = async () => {
  showKnowledgeModal.value = true
  
  try {
    await fetchDocuments()
    selectedDocuments.value = [...knowledgeDocuments.value.map(doc => doc.id)]
  } catch (err) {
    console.warn('Erreur chargement documents pour modal:', err)
    selectedDocuments.value = [...knowledgeDocuments.value.map(doc => doc.id)]
  }
}

const closeKnowledgeModal = () => {
  showKnowledgeModal.value = false
  selectedDocuments.value = []
}

const saveKnowledgeSelection = async () => {
  savingKnowledge.value = true
  
  try {
    if (typeof linkKnowledgeBaseDocuments === 'function') {
      const result = await linkKnowledgeBaseDocuments(agentId.value, selectedDocuments.value)
      if (result.success) {
        knowledgeDocuments.value = availableDocuments.value.filter(doc => 
          selectedDocuments.value.includes(doc.id)
        )
        
        // ✅ NOUVEAU : Incrémenter quota documents
        await incrementQuota('knowledgeDocuments', selectedDocuments.value.length - (knowledgeDocuments.value?.length || 0))
        
        localSuccessMessage.value = 'Base de connaissances beauté mise à jour !'
        closeKnowledgeModal()
        setTimeout(() => { localSuccessMessage.value = null }, 3000)
      } else {
        throw new Error(result.error || 'Erreur lors de la liaison des documents')
      }
    } else {
      localSuccessMessage.value = 'Configuration sauvegardée'
      closeKnowledgeModal()
      setTimeout(() => { localSuccessMessage.value = null }, 3000)
    }
  } catch (error: any) {
    console.error('Erreur sauvegarde KB:', error)
    localError.value = 'Erreur lors de la sauvegarde des documents. Veuillez réessayer.'
    setTimeout(() => { localError.value = null }, 5000)
  } finally {
    savingKnowledge.value = false
  }
}

const getContentTypeLabel = (type: string) => {
  const labels = {
    manual: '📝 Manuel',
    file: '📄 Fichier',
    url: '🔗 URL',
    website: '🌐 Site web'
  }
  return labels[type as keyof typeof labels] || type
}

// Méthodes widget
const selectColor = (color: string) => {
  localConfig.value.widget.primaryColor = color
  markAsChanged()
}

const toggleAutoOpen = () => {
  localConfig.value.widget.autoOpen = !localConfig.value.widget.autoOpen
  markAsChanged()
}

const toggleAgent = () => {
  localConfig.value.agent.isActive = !localConfig.value.agent.isActive
  markAsChanged()
}

const getBorderRadiusValue = () => {
  const radiusMap = {
    sm: '6px',
    md: '12px', 
    lg: '16px',
    full: '50px'
  }
  return radiusMap[localConfig.value.widget.borderRadius as keyof typeof radiusMap] || '12px'
}

const getWidgetPadding = () => {
  const paddingMap = {
    small: '8px 16px',
    medium: '12px 24px',
    large: '16px 32px'
  }
  return paddingMap[localConfig.value.widget.widgetSize as keyof typeof paddingMap] || '12px 24px'
}

const getWidgetFontSize = () => {
  const fontSizeMap = {
    small: '13px',
    medium: '15px', 
    large: '17px'
  }
  return fontSizeMap[localConfig.value.widget.widgetSize as keyof typeof fontSizeMap] || '15px'
}

const getWidgetSizeLabel = () => {
  const labels = { small: 'Discret', medium: 'Normal', large: 'Visible' }
  return labels[localConfig.value.widget.widgetSize as keyof typeof labels] || 'Normal'
}

const adjustColor = (color: string, percent: number) => {
  try {
    const hex = color.replace('#', '')
    const r = parseInt(hex.substr(0, 2), 16)
    const g = parseInt(hex.substr(2, 2), 16)
    const b = parseInt(hex.substr(4, 2), 16)
    
    const adjust = (channel: number) => {
      const adjusted = channel + (channel * percent / 100)
      return Math.max(0, Math.min(255, Math.round(adjusted)))
    }
    
    return `rgb(${adjust(r)}, ${adjust(g)}, ${adjust(b)})`
  } catch (error) {
    return color
  }
}

// Méthodes de test avec feedback IA
const initTestChat = () => {
  testMessages.value = [{
    id: Date.now().toString(),
    role: 'assistant',
    content: getPreviewMessage(),
    loading: false
  }]
}

const sendTestMessage = async () => {
  if (!testMessage.value.trim() || sendingMessage.value) return
  
  // ✅ NOUVEAU : Vérifier quota avant envoi
  const quotaCheck = checkQuotaBeforeAction('aiResponses', 1)
  if (!quotaCheck.allowed) {
    localError.value = quotaCheck.error
    return
  }
  
  const messageContent = testMessage.value.trim()
  testMessage.value = ''
  sendingMessage.value = true
  
  testMessages.value.push({
    id: Date.now().toString(),
    role: 'user',
    content: messageContent,
    loading: false
  })
  
  const loadingId = (Date.now() + 1).toString()
  testMessages.value.push({
    id: loadingId,
    role: 'assistant',
    content: '',
    loading: true
  })
  
  try {
    const startTime = Date.now()
    
    const result = await testAIMessage(messageContent, agentId.value)
    
    const responseTime = Date.now() - startTime
    responseTimes.value.push(responseTime)
    
    const loadingIndex = testMessages.value.findIndex(msg => msg.id === loadingId)
    if (loadingIndex !== -1) {
      testMessages.value[loadingIndex] = {
        id: loadingId,
        role: 'assistant',
        content: result.success ? result.message : `Désolée, je rencontre un problème technique. ${getBeautyTypeLabel()} sera bientôt de retour !`,
        loading: false
      }
    }
    
    // ✅ NOUVEAU : Incrémenter quota réponses IA
    if (result.success) {
      await incrementQuota('aiResponses', 1)
    }
    
    nextTick(() => {
      if (chatContainer.value) {
        chatContainer.value.scrollTop = chatContainer.value.scrollHeight
      }
    })
    
  } catch (error: any) {
    console.error('Erreur test message:', error)
    
    const loadingIndex = testMessages.value.findIndex(msg => msg.id === loadingId)
    if (loadingIndex !== -1) {
      testMessages.value[loadingIndex] = {
        id: loadingId,
        role: 'assistant',
        content: `Désolée, je rencontre un problème technique temporaire. Votre ${getBeautyTypeLabel()} sera bientôt opérationnelle !`,
        loading: false
      }
    }
  } finally {
    sendingMessage.value = false
  }
}

const runTestScenario = (scenarioMessage: string) => {
  testMessage.value = scenarioMessage
  sendTestMessage()
}

const resetTestChat = () => {
  testMessages.value = []
  responseTimes.value = []
  initTestChat()
}

const formatMessage = (content: string) => {
  return content
    .replace(/\*\*(.*?)\*\*/g, '<strong>$1</strong>')
    .replace(/\*(.*?)\*/g, '<em>$1</em>')
    .replace(/\n/g, '<br>')
}

// ✅ NOUVEAU : Méthodes feedback IA
const submitQuickFeedback = async (message: any, type: 'positive' | 'negative') => {
  if (!message || message.role !== 'assistant') return
  
  try {
    const feedbackData = createQuickFeedback(
      message.id,
      agentId.value,
      'test-conversation',
      message.content,
      type,
      type === 'positive' ? 5 : 2
    )
    
    const result = await submitFeedback(feedbackData)
    if (result.success) {
      // Feedback visuel
      const emoji = type === 'positive' ? '✅' : '❌'
      localSuccessMessage.value = `${emoji} Feedback envoyé !`
      setTimeout(() => { localSuccessMessage.value = null }, 2000)
    }
  } catch (error) {
    console.error('Erreur feedback rapide:', error)
  }
}

const openFeedbackModal = (message: any) => {
  if (!message || message.role !== 'assistant') return
  selectedMessageForFeedback.value = message
  showFeedbackModal.value = true
}

const closeFeedbackModal = () => {
  showFeedbackModal.value = false
  selectedMessageForFeedback.value = null
}

const onFeedbackSubmitted = (feedback: any) => {
  localSuccessMessage.value = '🔧 Correction envoyée ! Merci d\'améliorer notre IA beauté.'
  setTimeout(() => { localSuccessMessage.value = null }, 3000)
  
  // Recharger feedbacks récents
  getFeedbacks(agentId.value, 10)
}

// Méthodes installation
const copyIntegrationCode = async () => {
  try {
    if (!integrationCode.value) {
      throw new Error('Code d\'intégration non disponible')
    }

    await navigator.clipboard.writeText(integrationCode.value)
    codeCopied.value = true
    setTimeout(() => {
      codeCopied.value = false
    }, 2000)
  } catch (error) {
    console.error('Erreur copie code:', error)
    localError.value = 'Impossible de copier le code'
  }
}

// Navigation
const goToAnalytics = () => {
  router.push('/analytics')
}

// Chargement et sauvegarde
const saveConfiguration = async () => {
  if (!hasChanges.value || !localConfig.value) return
  
  try {
    // Sauvegarder instructions beauté
    if (!localConfig.value.agent.config) {
      localConfig.value.agent.config = {}
    }
    localConfig.value.agent.config.specificInstructions = [...selectedInstructionTemplates.value]
    localConfig.value.agent.config.systemPrompt = customInstructions.value?.trim() || ''
    localConfig.value.agent.config.generatedSystemPrompt = getGeneratedSystemPrompt()
    
    const result = await saveCompleteConfig(agentId.value, {
      agent: localConfig.value.agent,
      widget: localConfig.value.widget,
      knowledgeBase: localConfig.value.knowledgeBase
    })
    
    if (result.success) {
      localSuccessMessage.value = `✅ ${localConfig.value.agent.name} a été mise à jour avec succès !`
      hasChanges.value = false
      
      setTimeout(() => {
        localSuccessMessage.value = null
      }, 5000)
    } else {
      throw new Error(result.error || 'Erreur lors de la sauvegarde')
    }
  } catch (err: any) {
    console.error('Erreur sauvegarde:', err)
    localError.value = err.message || 'Erreur lors de la sauvegarde'
    
    setTimeout(() => {
      localError.value = null
    }, 5000)
  }
}

// Watchers pour détection changements
watch(
  () => localConfig.value,
  (newValue, oldValue) => {
    if (newValue && oldValue && JSON.stringify(newValue) !== JSON.stringify(oldValue)) {
      hasChanges.value = true
    }
  },
  { deep: true }
)

watch(selectedInstructionTemplates, () => {
  markAsChanged()
}, { deep: true })

watch(customInstructions, () => {
  markAsChanged()
})

// Chargement initial
onMounted(async () => {
  await loadBeautyProfile()
  
  if (agentId.value && agentId.value !== 'undefined') {
    const result = await fetchAgentConfig(agentId.value)
    
    if (result.success && result.data) {
      localConfig.value = {
        agent: {
          ...result.data.agent,
          config: {
            collectName: true,
            collectPhone: true,
            collectEmail: false,
            collectAddress: true,
            collectBeautyProfile: true,
            collectAge: false,
            collectBudget: false,
            collectPreferences: false,
            collectPayment: true,
            upsellEnabled: true,
            urgencyEnabled: false,
            specificInstructions: [],
            linkedKnowledgeBase: [],
            aiProvider: 'openai',
            temperature: 0.7,
            maxTokens: 1000,
            systemPrompt: '',
            generatedSystemPrompt: '',
            tone: 'friendly',
            ...result.data.agent.config
          }
        },
        widget: {
          buttonText: 'Parler à votre conseillère beauté',
          primaryColor: '#E91E63',
          position: 'above-cta',
          floatingPosition: 'bottom-right',
          widgetSize: 'medium',
          theme: 'beauty_modern',
          borderRadius: 'lg',
          animation: 'fade',
          autoOpen: false,
          showAvatar: true,
          soundEnabled: true,
          mobileOptimized: true,
          showTypingIndicator: true,
          offlineMessage: null,
          isActive: true,
          language: 'fr',
          ...result.data.widget
        },
        knowledgeBase: result.data.knowledgeBase || []
      }
      
      // Charger instructions existantes
      if (localConfig.value?.agent?.config?.specificInstructions) {
        selectedInstructionTemplates.value = [...localConfig.value.agent.config.specificInstructions]
      }
      if (localConfig.value?.agent?.config?.systemPrompt) {
        customInstructions.value = localConfig.value.agent.config.systemPrompt
      }
      
      initTestChat()
      
      try {
        await fetchDocuments()
        const linkedDocs = availableDocuments.value.filter(doc => 
          localConfig.value?.agent?.config?.linkedKnowledgeBase?.includes(doc.id)
        )
        knowledgeDocuments.value = [...linkedDocs]
      } catch (err) {
        console.warn('Erreur chargement documents:', err)
        knowledgeDocuments.value = []
      }
      
      // Charger feedbacks récents
      getFeedbacks(agentId.value, 10)
      
    } else {
      localError.value = result.error || 'Agent non trouvé'
      setTimeout(() => { router.push('/agent-ia') }, 3000)
    }
  } else {
    localError.value = 'ID agent invalide'
    setTimeout(() => { router.push('/agent-ia') }, 3000)
  }
})
</script>

<!-- ✅ STYLES ADAPTÉS BEAUTÉ AVEC RESPONSIVE -->
<style scoped>
/* Espacement amélioré */
.main-content {
  padding-bottom: 3rem;
}

/* Animation pour les modales */
.modal-enter-active, .modal-leave-active {
  transition: opacity 0.3s ease;
}
.modal-enter-from, .modal-leave-to {
  opacity: 0;
}

/* Styles pour les icônes de chat */
.chat-icon {
  transition: all 0.2s ease;
}

.chat-icon:hover {
  transform: scale(1.1);
}

/* Animations pour les transitions */
.fade-enter-active, .fade-leave-active {
  transition: opacity 0.3s ease;
}
.fade-enter-from, .fade-leave-to {
  opacity: 0;
}

/* Styles pour les messages de chat */
.chat-message {
  animation: slideIn 0.3s ease-out;
}

@keyframes slideIn {
  from {
    opacity: 0;
    transform: translateY(10px);
  }
  to {
    opacity: 1;
    transform: translateY(0);
  }
}

/* Styles pour le code d'intégration */
pre {
  font-family: 'Fira Code', 'Consolas', 'Monaco', monospace;
  line-height: 1.4;
}

/* Responsive amélioré */
@media (max-width: 768px) {
  .grid {
    grid-template-columns: 1fr;
  }
  
  .lg\:col-span-2 {
    grid-column: span 1;
  }
}

/* Styles pour les couleurs beauté */
.beauty-gradient {
  background: linear-gradient(135deg, #E91E63 0%, #F472B6 100%);
}

.beauty-shadow {
  box-shadow: 0 10px 25px rgba(233, 30, 99, 0.15);
}

/* Styles pour les boutons adaptatifs */
.beauty-button {
  background: linear-gradient(135deg, var(--primary-color, #E91E63) 0%, var(--primary-color-light, #F472B6) 100%);
  transition: all 0.2s ease;
}

.beauty-button:hover {
  transform: translateY(-1px);
  box-shadow: 0 5px 15px rgba(233, 30, 99, 0.3);
}

/* Styles pour les alertes quotas */
.quota-alert {
  animation: slideInFromTop 0.3s ease-out;
}

@keyframes slideInFromTop {
  from {
    opacity: 0;
    transform: translateY(-20px);
  }
  to {
    opacity: 1;
    transform: translateY(0);
  }
}

/* Styles pour feedback IA */
.feedback-buttons button {
  transition: all 0.2s ease;
}

.feedback-buttons button:hover {
  transform: scale(1.1);
}

/* Glassmorphism pour les cartes beauté */
.bg-white\/80 {
  background: rgba(255, 255, 255, 0.8);
  backdrop-filter: blur(10px);
  -webkit-backdrop-filter: blur(10px);
}

/* Ombres douces pour les cartes */
.shadow-lg {
  box-shadow: 0 10px 25px rgba(0, 0, 0, 0.1), 0 4px 6px rgba(0, 0, 0, 0.05);
}

/* Animations pour les boutons */
button {
  transition: all 0.2s ease;
}

button:not(:disabled):hover {
  transform: translateY(-1px);
}

button:not(:disabled):active {
  transform: translateY(0);
}

/* Styles pour les inputs focus adaptatifs */
input:focus,
textarea:focus,
select:focus {
  transform: scale(1.01);
  box-shadow: 0 0 0 3px rgba(233, 30, 99, 0.1);
}

/* Scrollbar personnalisée beauté */
::-webkit-scrollbar {
  width: 6px;
}

::-webkit-scrollbar-track {
  background: #f1f5f9;
}

::-webkit-scrollbar-thumb {
  background: linear-gradient(135deg, #ec4899, #f43f5e);
  border-radius: 3px;
}

::-webkit-scrollbar-thumb:hover {
  background: linear-gradient(135deg, #db2777, #e11d48);
}

/* Styles pour le mode sombre */
@media (prefers-color-scheme: dark) {
  .bg-white\/80 {
    background: rgba(31, 41, 55, 0.8);
    color: white;
  }
  
  .text-gray-900 {
    color: #f3f4f6;
  }
  
  .text-gray-600 {
    color: #d1d5db;
  }
  
  .border-white\/60 {
    border-color: rgba(75, 85, 99, 0.6);
  }
}

/* High contrast mode */
@media (prefers-contrast: high) {
  .bg-white\/80 {
    background: white;
    border: 2px solid #000;
  }
  
  button {
    border: 2px solid currentColor;
  }
}

/* Reduced motion */
@media (prefers-reduced-motion: reduce) {
  * {
    animation-duration: 0.01ms !important;
    animation-iteration-count: 1 !important;
    transition-duration: 0.01ms !important;
    transform: none !important;
  }
}

/* Print styles */
@media print {
  .bg-gradient-to-br {
    background: white !important;
  }
  
  button,
  .modal-overlay {
    display: none !important;
  }
  
  .beauty-gradient,
  .beauty-button {
    background: #f3f4f6 !important;
    color: black !important;
  }
}

/* Loading states */
.loading-shimmer {
  background: linear-gradient(90deg, #f0f0f0 25%, #e0e0e0 50%, #f0f0f0 75%);
  background-size: 200% 100%;
  animation: shimmer 2s infinite;
}

@keyframes shimmer {
  0% {
    background-position: -200% 0;
  }
  100% {
    background-position: 200% 0;
  }
}

/* Styles pour les templates d'instructions */
.instruction-template {
  transition: all 0.2s ease;
}

.instruction-template:hover {
  transform: translateY(-2px);
  box-shadow: 0 4px 12px rgba(233, 30, 99, 0.15);
}

/* Styles pour les quota alerts */
.quota-progress-bar {
  transition: width 0.5s ease;
}

/* Styles pour le feedback modal */
.feedback-modal .modal-content {
  max-width: 600px;
}

/* Styles pour les boutons de feedback dans le chat */
.feedback-buttons {
  opacity: 0;
  transition: opacity 0.2s ease;
}

.message-container:hover .feedback-buttons {
  opacity: 1;
}

/* Accessibility improvements */
button:focus-visible {
  outline: 2px solid #E91E63;
  outline-offset: 2px;
}

/* Enhanced form styles */
input[type="checkbox"]:checked {
  background-image: url("data:image/svg+xml,%3csvg viewBox='0 0 16 16' fill='white' xmlns='http://www.w3.org/2000/svg'%3e%3cpath d='m13.854 3.646-7.5 7.5a.5.5 0 0 1-.708 0L2.146 7.646a.5.5 0 1 1 .708-.708L6 10.293l7.146-7.147a.5.5 0 0 1 .708.708z'/%3e%3c/svg%3e");
}

/* Beautiful textarea resize handle */
textarea {
  resize: vertical;
  min-height: 80px;
}

textarea::-webkit-resizer {
  background: linear-gradient(-45deg, transparent 2px, #E91E63 2px, #E91E63 4px, transparent 4px);
}
</style>