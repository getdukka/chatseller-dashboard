<!-- pages/agent-ia/[id].vue - VERSION MVP REFONTE -->
<template>
  <div class="min-h-screen bg-gradient-to-br from-rose-50 via-pink-50 to-purple-50">

    <!-- ========== HEADER MOBILE-FRIENDLY ========== -->
    <header class="sticky top-0 z-40 bg-white/95 backdrop-blur-sm border-b border-rose-100 shadow-sm">
      <div class="px-4 py-3 sm:px-6 lg:px-8">
        <div class="flex items-center justify-between">
          <!-- Retour + Avatar + Nom -->
          <div class="flex items-center space-x-3 min-w-0 flex-1">
            <button
              @click="goBack"
              class="p-2 -ml-2 text-gray-500 hover:text-gray-700 hover:bg-gray-100 rounded-lg transition-colors"
              aria-label="Retour"
            >
              <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M15 19l-7-7 7-7"/>
              </svg>
            </button>

            <div class="relative flex-shrink-0">
              <div class="w-10 h-10 sm:w-12 sm:h-12 rounded-full overflow-hidden border-2 border-rose-200 bg-gradient-to-br from-rose-400 to-pink-500">
                <img
                  v-if="localConfig.agent.avatar"
                  :src="localConfig.agent.avatar"
                  :alt="localConfig.agent.name"
                  class="w-full h-full object-cover"
                />
                <div v-else class="w-full h-full flex items-center justify-center text-white font-bold text-lg">
                  {{ (localConfig.agent.name || 'C').charAt(0).toUpperCase() }}
                </div>
              </div>
              <div
                class="absolute -bottom-0.5 -right-0.5 w-4 h-4 rounded-full border-2 border-white"
                :class="localConfig.agent.isActive ? 'bg-green-500' : 'bg-gray-400'"
              ></div>
            </div>

            <div class="min-w-0 flex-1">
              <h1 class="text-base sm:text-lg font-semibold text-gray-900 truncate">
                {{ localConfig.agent.name || 'Ma Conseillère' }}
              </h1>
              <p class="text-xs sm:text-sm text-gray-500 truncate">
                {{ localConfig.agent.isActive ? 'Active' : 'Inactive' }}
              </p>
            </div>
          </div>

          <!-- Bouton Sauvegarder -->
          <button
            @click="saveConfiguration"
            :disabled="saving || !hasChanges"
            class="flex items-center px-3 py-2 sm:px-4 text-sm font-medium text-white bg-gradient-to-r from-rose-500 to-pink-500 rounded-lg hover:from-rose-600 hover:to-pink-600 disabled:opacity-50 disabled:cursor-not-allowed transition-all shadow-sm"
          >
            <svg v-if="saving" class="w-4 h-4 mr-1.5 animate-spin" fill="none" viewBox="0 0 24 24">
              <circle class="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" stroke-width="4"/>
              <path class="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"/>
            </svg>
            <svg v-else-if="!hasChanges" class="w-4 h-4 mr-1.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M5 13l4 4L19 7"/>
            </svg>
            <span class="hidden sm:inline">{{ saving ? 'Sauvegarde...' : (hasChanges ? 'Sauvegarder' : 'Sauvegardé') }}</span>
            <span class="sm:hidden">{{ saving ? '...' : (hasChanges ? 'Save' : '✓') }}</span>
          </button>
        </div>
      </div>
    </header>

    <!-- ========== MESSAGES STATUS ========== -->
    <Transition name="slide-down">
      <div v-if="successMessage" class="px-4 sm:px-6 lg:px-8 pt-3">
        <div class="p-3 bg-green-50 border border-green-200 rounded-xl flex items-center">
          <svg class="w-5 h-5 text-green-500 mr-2 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M5 13l4 4L19 7"/>
          </svg>
          <span class="text-sm text-green-700">{{ successMessage }}</span>
        </div>
      </div>
    </Transition>

    <Transition name="slide-down">
      <div v-if="errorMessage" class="px-4 sm:px-6 lg:px-8 pt-3">
        <div class="p-3 bg-red-50 border border-red-200 rounded-xl flex items-center justify-between">
          <div class="flex items-center">
            <svg class="w-5 h-5 text-red-500 mr-2 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"/>
            </svg>
            <span class="text-sm text-red-700">{{ errorMessage }}</span>
          </div>
          <button @click="errorMessage = ''" class="p-1 text-red-400 hover:text-red-600">
            <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12"/>
            </svg>
          </button>
        </div>
      </div>
    </Transition>

    <!-- ========== LOADING STATE ========== -->
    <div v-if="loading" class="flex items-center justify-center py-20">
      <div class="text-center">
        <div class="w-12 h-12 mx-auto mb-4 rounded-full border-4 border-rose-200 border-t-rose-500 animate-spin"></div>
        <p class="text-gray-600">Chargement de votre conseillère...</p>
      </div>
    </div>

    <!-- ========== MAIN CONTENT ========== -->
    <main v-else class="pb-24 sm:pb-8">

      <!-- Navigation Tabs - Mobile: Fixed bottom, Desktop: Top -->
      <nav class="hidden sm:block px-4 sm:px-6 lg:px-8 py-4">
        <div class="flex space-x-1 bg-white/80 backdrop-blur-sm rounded-xl p-1 shadow-sm border border-rose-100 max-w-2xl mx-auto">
          <button
            v-for="tab in tabs"
            :key="tab.id"
            @click="activeTab = tab.id"
            class="flex-1 flex items-center justify-center px-4 py-2.5 text-sm font-medium rounded-lg transition-all"
            :class="activeTab === tab.id
              ? 'bg-gradient-to-r from-rose-500 to-pink-500 text-white shadow-sm'
              : 'text-gray-600 hover:text-gray-900 hover:bg-gray-50'"
          >
            <span class="mr-2">{{ tab.icon }}</span>
            {{ tab.name }}
          </button>
        </div>
      </nav>

      <!-- Mobile Bottom Navigation -->
      <nav class="sm:hidden fixed bottom-0 left-0 right-0 z-50 bg-white border-t border-gray-200 px-2 py-2 shadow-lg">
        <div class="flex justify-around">
          <button
            v-for="tab in tabs"
            :key="tab.id"
            @click="activeTab = tab.id"
            class="flex flex-col items-center px-3 py-1.5 rounded-lg transition-colors min-w-[70px]"
            :class="activeTab === tab.id
              ? 'text-rose-600 bg-rose-50'
              : 'text-gray-500'"
          >
            <span class="text-lg mb-0.5">{{ tab.icon }}</span>
            <span class="text-xs font-medium">{{ tab.name }}</span>
          </button>
        </div>
      </nav>

      <!-- ========== ONGLET 1: PERSONNALISER ========== -->
      <section v-show="activeTab === 'customize'" class="px-4 sm:px-6 lg:px-8 py-4 space-y-4 sm:space-y-6 max-w-4xl mx-auto">

        <!-- Card: Identité -->
        <div class="bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden">
          <div class="px-4 py-3 sm:px-6 sm:py-4 border-b border-gray-100 bg-gradient-to-r from-rose-50 to-pink-50">
            <h2 class="text-base sm:text-lg font-semibold text-gray-900 flex items-center">
              <span class="mr-2">👩‍💼</span>
              Identité de votre conseillère
            </h2>
          </div>

          <div class="p-4 sm:p-6 space-y-5">
            <!-- Avatar -->
            <div class="flex items-center space-x-4">
              <div
                @click="triggerAvatarUpload"
                class="relative w-20 h-20 sm:w-24 sm:h-24 rounded-full overflow-hidden cursor-pointer group border-3 border-rose-200 shadow-md flex-shrink-0"
              >
                <img
                  v-if="localConfig.agent.avatar"
                  :src="localConfig.agent.avatar"
                  :alt="localConfig.agent.name"
                  class="w-full h-full object-cover"
                />
                <div v-else class="w-full h-full bg-gradient-to-br from-rose-400 to-pink-500 flex items-center justify-center text-white font-bold text-2xl">
                  {{ (localConfig.agent.name || 'C').charAt(0).toUpperCase() }}
                </div>
                <div class="absolute inset-0 bg-black/40 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity">
                  <svg class="w-6 h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M3 9a2 2 0 012-2h.93a2 2 0 001.664-.89l.812-1.22A2 2 0 0110.07 4h3.86a2 2 0 011.664.89l.812 1.22A2 2 0 0018.07 7H19a2 2 0 012 2v9a2 2 0 01-2 2H5a2 2 0 01-2-2V9z"/>
                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M15 13a3 3 0 11-6 0 3 3 0 016 0z"/>
                  </svg>
                </div>
                <input
                  ref="avatarInput"
                  type="file"
                  accept="image/*"
                  class="hidden"
                  @change="handleAvatarUpload"
                />
              </div>

              <div class="flex-1 min-w-0">
                <label class="block text-sm font-medium text-gray-700 mb-1.5">
                  Nom de votre conseillère *
                </label>
                <input
                  v-model="localConfig.agent.name"
                  @input="markAsChanged"
                  type="text"
                  placeholder="Ex: Sophie, Amara, Fatou..."
                  class="w-full px-3 py-2.5 border border-gray-200 rounded-xl focus:ring-2 focus:ring-rose-500 focus:border-rose-500 transition-colors"
                />
              </div>
            </div>

            <!-- Spécialité -->
            <div>
              <label class="block text-sm font-medium text-gray-700 mb-1.5">
                Sa spécialité (optionnel)
              </label>
              <input
                v-model="localConfig.agent.title"
                @input="markAsChanged"
                type="text"
                placeholder="Ex: Experte skincare, Conseillère maquillage..."
                class="w-full px-3 py-2.5 border border-gray-200 rounded-xl focus:ring-2 focus:ring-rose-500 focus:border-rose-500 transition-colors"
              />
            </div>

            <!-- Personnalité -->
            <div>
              <label class="block text-sm font-medium text-gray-700 mb-2">
                Style de communication
              </label>
              <div class="grid grid-cols-2 gap-2 sm:gap-3">
                <button
                  v-for="personality in personalities"
                  :key="personality.value"
                  @click="selectPersonality(personality.value)"
                  class="p-3 sm:p-4 border-2 rounded-xl text-left transition-all"
                  :class="localConfig.agent.personality === personality.value
                    ? 'border-rose-500 bg-rose-50'
                    : 'border-gray-200 hover:border-gray-300 bg-white'"
                >
                  <span class="text-xl sm:text-2xl block mb-1">{{ personality.icon }}</span>
                  <span class="text-sm font-medium text-gray-900 block">{{ personality.label }}</span>
                  <span class="text-xs text-gray-500 hidden sm:block mt-0.5">{{ personality.description }}</span>
                </button>
              </div>
            </div>
          </div>
        </div>

        <!-- Card: Message d'accueil -->
        <div class="bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden">
          <div class="px-4 py-3 sm:px-6 sm:py-4 border-b border-gray-100 bg-gradient-to-r from-rose-50 to-pink-50">
            <h2 class="text-base sm:text-lg font-semibold text-gray-900 flex items-center">
              <span class="mr-2">💬</span>
              Message d'accueil
            </h2>
          </div>

          <div class="p-4 sm:p-6">
            <p class="text-sm text-gray-600 mb-3">
              C'est le premier message que vos visiteurs verront
            </p>

            <textarea
              v-model="localConfig.agent.welcomeMessage"
              @input="markAsChanged"
              rows="3"
              :placeholder="getWelcomePlaceholder()"
              class="w-full px-3 py-2.5 border border-gray-200 rounded-xl focus:ring-2 focus:ring-rose-500 focus:border-rose-500 resize-none transition-colors"
            ></textarea>

            <!-- Variables rapides -->
            <div class="mt-3">
              <div class="flex flex-wrap gap-2 items-center">
                <span class="text-xs text-gray-500">Variables :</span>
                <button
                  v-for="variable in availableVariables"
                  :key="variable.name"
                  @click="insertVariable(variable.name)"
                  class="text-xs px-2 py-1 bg-rose-50 text-rose-700 rounded-lg hover:bg-rose-100 transition-colors"
                >
                  {{ variable.display }}
                </button>
              </div>
              <p class="text-xs text-gray-500 mt-2 flex items-start">
                <svg class="w-3.5 h-3.5 mr-1 mt-0.5 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"/>
                </svg>
                Ces variables seront automatiquement remplacées par les vraies valeurs dans le chat
              </p>
            </div>
          </div>
        </div>

        <!-- Card: Base de connaissances -->
        <div class="bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden">
          <div class="px-4 py-3 sm:px-6 sm:py-4 border-b border-gray-100 bg-gradient-to-r from-rose-50 to-pink-50">
            <div class="flex items-center justify-between">
              <h2 class="text-base sm:text-lg font-semibold text-gray-900 flex items-center">
                <span class="mr-2">📚</span>
                Connaissances
              </h2>
              <span class="text-xs text-gray-500">
                {{ selectedDocuments.length }} document{{ selectedDocuments.length !== 1 ? 's' : '' }}
              </span>
            </div>
          </div>

          <div class="p-4 sm:p-6">
            <p class="text-sm text-gray-600 mb-4">
              Sélectionnez les documents que votre conseillère doit connaître pour bien conseiller vos clientes.
            </p>

            <button
              @click="showKnowledgeModal = true"
              class="w-full py-3 px-4 border-2 border-dashed border-gray-300 rounded-xl text-gray-600 hover:border-rose-400 hover:text-rose-600 hover:bg-rose-50 transition-all flex items-center justify-center"
            >
              <svg class="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 6v6m0 0v6m0-6h6m-6 0H6"/>
              </svg>
              Gérer les documents
            </button>

            <!-- Documents liés -->
            <div v-if="linkedDocuments.length > 0" class="mt-4 space-y-2">
              <div
                v-for="doc in linkedDocuments.slice(0, 3)"
                :key="doc.id"
                class="flex items-center p-2 bg-gray-50 rounded-lg"
              >
                <div class="w-8 h-8 bg-rose-100 rounded-lg flex items-center justify-center mr-3 flex-shrink-0">
                  <svg class="w-4 h-4 text-rose-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z"/>
                  </svg>
                </div>
                <span class="text-sm text-gray-700 truncate">{{ doc.title }}</span>
              </div>
              <p v-if="linkedDocuments.length > 3" class="text-xs text-gray-500 text-center">
                + {{ linkedDocuments.length - 3 }} autre{{ linkedDocuments.length - 3 > 1 ? 's' : '' }}
              </p>
            </div>
          </div>
        </div>

        <!-- Toggle Activation -->
        <div class="bg-white rounded-2xl shadow-sm border border-gray-100 p-4 sm:p-6">
          <div class="flex items-center justify-between">
            <div>
              <h3 class="font-medium text-gray-900">Activer la conseillère</h3>
              <p class="text-sm text-gray-500">Elle pourra répondre à vos visiteurs</p>
            </div>
            <button
              @click="toggleActive"
              class="relative inline-flex h-6 w-11 flex-shrink-0 cursor-pointer rounded-full border-2 border-transparent transition-colors duration-200 ease-in-out focus:outline-none focus:ring-2 focus:ring-rose-500 focus:ring-offset-2"
              :class="localConfig.agent.isActive ? 'bg-rose-500' : 'bg-gray-200'"
            >
              <span
                class="pointer-events-none inline-block h-5 w-5 transform rounded-full bg-white shadow ring-0 transition duration-200 ease-in-out"
                :class="localConfig.agent.isActive ? 'translate-x-5' : 'translate-x-0'"
              ></span>
            </button>
          </div>
        </div>
      </section>

      <!-- ========== ONGLET 2: APPARENCE ========== -->
      <section v-show="activeTab === 'appearance'" class="px-4 sm:px-6 lg:px-8 py-4 space-y-4 sm:space-y-6 max-w-4xl mx-auto">

        <!-- Card: Texte du bouton -->
        <div class="bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden">
          <div class="px-4 py-3 sm:px-6 sm:py-4 border-b border-gray-100 bg-gradient-to-r from-rose-50 to-pink-50">
            <h2 class="text-base sm:text-lg font-semibold text-gray-900 flex items-center">
              <span class="mr-2">✏️</span>
              Texte du bouton
            </h2>
          </div>

          <div class="p-4 sm:p-6">
            <input
              v-model="localConfig.widget.buttonText"
              @input="markAsChanged"
              type="text"
              placeholder="Parler à une conseillère"
              class="w-full px-3 py-2.5 border border-gray-200 rounded-xl focus:ring-2 focus:ring-rose-500 focus:border-rose-500 transition-colors"
            />
          </div>
        </div>

        <!-- Card: Couleur principale -->
        <div class="bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden">
          <div class="px-4 py-3 sm:px-6 sm:py-4 border-b border-gray-100 bg-gradient-to-r from-rose-50 to-pink-50">
            <h2 class="text-base sm:text-lg font-semibold text-gray-900 flex items-center">
              <span class="mr-2">🎨</span>
              Couleur principale
            </h2>
          </div>

          <div class="p-4 sm:p-6">
            <div class="flex flex-wrap gap-3">
              <button
                v-for="color in beautyColors"
                :key="color.value"
                @click="selectColor(color.value)"
                class="w-12 h-12 sm:w-14 sm:h-14 rounded-xl border-3 transition-all shadow-sm hover:scale-105"
                :style="{ backgroundColor: color.value }"
                :class="localConfig.widget.primaryColor === color.value ? 'border-gray-900 ring-2 ring-offset-2 ring-gray-400' : 'border-white'"
                :title="color.name"
              ></button>

              <!-- Color picker custom -->
              <label class="w-12 h-12 sm:w-14 sm:h-14 rounded-xl border-2 border-dashed border-gray-300 flex items-center justify-center cursor-pointer hover:border-gray-400 transition-colors">
                <input
                  v-model="localConfig.widget.primaryColor"
                  @input="markAsChanged"
                  type="color"
                  class="sr-only"
                />
                <svg class="w-5 h-5 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 4v16m8-8H4"/>
                </svg>
              </label>
            </div>
          </div>
        </div>

        <!-- Card: Position -->
        <div class="bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden">
          <div class="px-4 py-3 sm:px-6 sm:py-4 border-b border-gray-100 bg-gradient-to-r from-rose-50 to-pink-50">
            <h2 class="text-base sm:text-lg font-semibold text-gray-900 flex items-center">
              <span class="mr-2">📍</span>
              Position du bouton
            </h2>
          </div>

          <div class="p-4 sm:p-6 space-y-4">
            <div>
              <label class="block text-sm font-medium text-gray-700 mb-2">Sur la page produit</label>
              <div class="grid grid-cols-1 sm:grid-cols-3 gap-2">
                <button
                  v-for="pos in buttonPositions"
                  :key="pos.value"
                  @click="selectPosition(pos.value)"
                  class="p-3 border-2 rounded-xl text-center transition-all"
                  :class="localConfig.widget.position === pos.value
                    ? 'border-rose-500 bg-rose-50'
                    : 'border-gray-200 hover:border-gray-300'"
                >
                  <span class="text-sm font-medium text-gray-900">{{ pos.label }}</span>
                </button>
              </div>
            </div>

            <div>
              <label class="block text-sm font-medium text-gray-700 mb-2">Bouton flottant (autres pages)</label>
              <div class="grid grid-cols-2 gap-2">
                <button
                  v-for="pos in floatingPositions"
                  :key="pos.value"
                  @click="selectFloatingPosition(pos.value)"
                  class="p-3 border-2 rounded-xl text-center transition-all"
                  :class="localConfig.widget.floatingPosition === pos.value
                    ? 'border-rose-500 bg-rose-50'
                    : 'border-gray-200 hover:border-gray-300'"
                >
                  <span class="text-sm font-medium text-gray-900">{{ pos.label }}</span>
                </button>
              </div>
            </div>
          </div>
        </div>

        <!-- Card: Aperçu -->
        <div class="bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden">
          <div class="px-4 py-3 sm:px-6 sm:py-4 border-b border-gray-100 bg-gradient-to-r from-rose-50 to-pink-50">
            <h2 class="text-base sm:text-lg font-semibold text-gray-900 flex items-center">
              <span class="mr-2">👁️</span>
              Aperçu
            </h2>
          </div>

          <div class="p-4 sm:p-6">
            <!-- Aperçu bouton -->
            <div class="bg-gray-100 rounded-xl p-6 relative">
              <div class="text-center mb-4">
                <div class="text-sm font-medium text-gray-600">Votre produit beauté</div>
                <div class="text-lg font-bold text-gray-900">39,90€</div>
              </div>

              <div class="space-y-2">
                <button
                  v-if="localConfig.widget.position === 'above-cta'"
                  :style="{ backgroundColor: localConfig.widget.primaryColor }"
                  class="w-full py-2.5 px-4 text-white font-medium rounded-lg text-sm"
                >
                  {{ localConfig.widget.buttonText || 'Parler à une conseillère' }}
                </button>

                <button class="w-full py-2.5 px-4 bg-gray-900 text-white font-medium rounded-lg text-sm">
                  Ajouter au panier
                </button>

                <button
                  v-if="localConfig.widget.position === 'below-cta'"
                  :style="{ backgroundColor: localConfig.widget.primaryColor }"
                  class="w-full py-2.5 px-4 text-white font-medium rounded-lg text-sm"
                >
                  {{ localConfig.widget.buttonText || 'Parler à une conseillère' }}
                </button>
              </div>

              <!-- Bouton flottant -->
              <div
                class="absolute bottom-3 w-12 h-12 rounded-full flex items-center justify-center text-white shadow-lg"
                :class="localConfig.widget.floatingPosition === 'bottom-right' ? 'right-3' : 'left-3'"
                :style="{ backgroundColor: localConfig.widget.primaryColor }"
              >
                <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z"/>
                </svg>
              </div>
            </div>
          </div>
        </div>
      </section>

      <!-- ========== ONGLET 3: TESTER / PLAYGROUND ========== -->
      <section v-show="activeTab === 'test'" class="px-4 sm:px-6 lg:px-8 py-4 space-y-4 sm:space-y-6 max-w-4xl mx-auto">

        <!-- Info -->
        <div class="bg-gradient-to-r from-purple-50 to-pink-50 border border-purple-200 rounded-2xl p-4 sm:p-6">
          <div class="flex items-start space-x-3">
            <div class="w-10 h-10 bg-purple-100 rounded-xl flex items-center justify-center flex-shrink-0">
              <span class="text-xl">🧪</span>
            </div>
            <div>
              <h3 class="font-semibold text-gray-900">Testez {{ localConfig.agent.name || 'votre Conseillère' }}</h3>
              <p class="text-sm text-gray-600 mt-1">
                Simulez une conversation avec {{ localConfig.agent.name || 'votre conseillère' }} avant de l'activer sur votre site.
              </p>
            </div>
          </div>
        </div>

        <!-- Card: Playground -->
        <div class="bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden">
          <!-- Header dynamique avec couleur du widget -->
          <div
            class="px-4 py-3 sm:px-6 sm:py-4 border-b"
            :style="{
              background: `linear-gradient(135deg, ${localConfig.widget.primaryColor}15 0%, ${localConfig.widget.primaryColor}25 100%)`,
              borderColor: `${localConfig.widget.primaryColor}30`
            }"
          >
            <div class="flex items-center justify-between">
              <h2 class="text-base sm:text-lg font-semibold text-gray-900 flex items-center">
                <span class="mr-2">💬</span>
                Playground
                <span class="ml-2 text-xs font-normal text-gray-500">(aperçu réel)</span>
              </h2>
              <button
                @click="resetPlayground"
                class="text-sm font-medium flex items-center transition-colors"
                :style="{ color: localConfig.widget.primaryColor }"
              >
                <svg class="w-4 h-4 mr-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15"/>
                </svg>
                Recommencer
              </button>
            </div>
          </div>

          <div class="h-96 sm:h-[500px] flex flex-col">
            <!-- Zone de messages -->
            <div ref="playgroundMessages" class="flex-1 overflow-y-auto p-4 space-y-4 bg-gray-50">
              <!-- Message de bienvenue -->
              <div v-if="playgroundConversation.length === 0" class="flex items-start space-x-3">
                <div
                  class="w-8 h-8 rounded-full overflow-hidden flex-shrink-0"
                  :style="playgroundGradientStyle"
                >
                  <img
                    v-if="localConfig.agent.avatar"
                    :src="localConfig.agent.avatar"
                    :alt="localConfig.agent.name"
                    class="w-full h-full object-cover"
                  />
                  <div v-else class="w-full h-full flex items-center justify-center text-white text-sm font-bold">
                    {{ (localConfig.agent.name || 'C').charAt(0).toUpperCase() }}
                  </div>
                </div>
                <div class="max-w-[80%]">
                  <p class="text-xs text-gray-500 mb-1">{{ localConfig.agent.name || 'Conseillère' }}</p>
                  <div class="bg-white rounded-2xl rounded-tl-sm p-3 shadow-sm border border-gray-100">
                    <p class="text-sm text-gray-800">
                      {{ processedWelcomeMessage }}
                    </p>
                  </div>
                </div>
              </div>

              <!-- Messages de la conversation -->
              <template v-for="(msg, index) in playgroundConversation" :key="index">
                <!-- Message utilisateur -->
                <div v-if="msg.role === 'user'" class="flex justify-end">
                  <div class="max-w-[80%]">
                    <p class="text-xs text-gray-500 mb-1 text-right">Vous</p>
                    <div
                      class="rounded-2xl rounded-tr-sm p-3 text-white"
                      :style="{ backgroundColor: localConfig.widget.primaryColor }"
                    >
                      <p class="text-sm">{{ msg.content }}</p>
                    </div>
                  </div>
                </div>

                <!-- Message assistant -->
                <div v-else class="flex items-start space-x-3">
                  <div
                    class="w-8 h-8 rounded-full overflow-hidden flex-shrink-0"
                    :style="playgroundGradientStyle"
                  >
                    <img
                      v-if="localConfig.agent.avatar"
                      :src="localConfig.agent.avatar"
                      :alt="localConfig.agent.name"
                      class="w-full h-full object-cover"
                    />
                    <div v-else class="w-full h-full flex items-center justify-center text-white text-sm font-bold">
                      {{ (localConfig.agent.name || 'C').charAt(0).toUpperCase() }}
                    </div>
                  </div>
                  <div class="max-w-[80%]">
                    <p class="text-xs text-gray-500 mb-1">{{ localConfig.agent.name || 'Conseillère' }}</p>
                    <div class="bg-white rounded-2xl rounded-tl-sm p-3 shadow-sm border border-gray-100">
                      <p class="text-sm text-gray-800 whitespace-pre-wrap">{{ msg.content }}</p>
                    </div>
                  </div>
                </div>
              </template>

              <!-- Indicateur de frappe -->
              <div v-if="playgroundTyping" class="flex items-start space-x-3">
                <div
                  class="w-8 h-8 rounded-full overflow-hidden flex-shrink-0"
                  :style="playgroundGradientStyle"
                >
                  <div class="w-full h-full flex items-center justify-center text-white text-sm font-bold">
                    {{ (localConfig.agent.name || 'C').charAt(0).toUpperCase() }}
                  </div>
                </div>
                <div class="bg-white rounded-2xl rounded-tl-sm p-3 shadow-sm border border-gray-100">
                  <div class="flex space-x-1">
                    <div
                      class="w-2 h-2 rounded-full animate-bounce"
                      :style="{ backgroundColor: localConfig.widget.primaryColor, animationDelay: '0ms' }"
                    ></div>
                    <div
                      class="w-2 h-2 rounded-full animate-bounce"
                      :style="{ backgroundColor: localConfig.widget.primaryColor, animationDelay: '150ms' }"
                    ></div>
                    <div
                      class="w-2 h-2 rounded-full animate-bounce"
                      :style="{ backgroundColor: localConfig.widget.primaryColor, animationDelay: '300ms' }"
                    ></div>
                  </div>
                </div>
              </div>
            </div>

            <!-- Zone de saisie -->
            <div
              class="p-4 border-t bg-white"
              :style="{ borderColor: `${localConfig.widget.primaryColor}20` }"
            >
              <div class="flex items-center space-x-2">
                <input
                  v-model="playgroundInput"
                  @keypress.enter="sendPlaygroundMessage"
                  type="text"
                  placeholder="Tapez votre message..."
                  :disabled="playgroundTyping"
                  class="flex-1 px-4 py-2.5 border border-gray-200 rounded-full transition-colors disabled:opacity-50 focus:outline-none focus:ring-2"
                  :style="{
                    '--tw-ring-color': localConfig.widget.primaryColor,
                    borderColor: 'transparent'
                  }"
                  @focus="($event.target as HTMLInputElement).style.borderColor = localConfig.widget.primaryColor"
                  @blur="($event.target as HTMLInputElement).style.borderColor = '#e5e7eb'"
                />
                <button
                  @click="sendPlaygroundMessage"
                  :disabled="!playgroundInput.trim() || playgroundTyping"
                  class="w-10 h-10 rounded-full flex items-center justify-center text-white transition-all disabled:opacity-50 hover:opacity-90"
                  :style="{ backgroundColor: localConfig.widget.primaryColor }"
                >
                  <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 19l9 2-9-18-9 18 9-2zm0 0v-8"/>
                  </svg>
                </button>
              </div>
            </div>
          </div>
        </div>

        <!-- Note importante -->
        <div class="bg-amber-50 border border-amber-200 rounded-2xl p-4">
          <div class="flex items-start space-x-3">
            <svg class="w-5 h-5 text-amber-500 flex-shrink-0 mt-0.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"/>
            </svg>
            <div>
              <p class="font-medium text-amber-800">Important</p>
              <p class="text-sm text-amber-700 mt-1">
                Les réponses ici sont générées par l'IA en utilisant la configuration et la base de connaissances de votre conseillère.
                Assurez-vous d'avoir <strong>sauvegardé vos modifications</strong> avant de tester.
              </p>
            </div>
          </div>
        </div>
      </section>

      <!-- ========== ONGLET 4: INSTALLER ========== -->
      <section v-show="activeTab === 'install'" class="px-4 sm:px-6 lg:px-8 py-4 space-y-4 sm:space-y-6 max-w-4xl mx-auto">

        <!-- Statut -->
        <div class="text-center py-4">
          <div
            v-if="localConfig.agent.isActive"
            class="inline-flex items-center px-4 py-2 bg-green-50 border border-green-200 rounded-full"
          >
            <div class="w-2 h-2 bg-green-500 rounded-full mr-2 animate-pulse"></div>
            <span class="text-green-700 font-medium text-sm">{{ localConfig.agent.name }} est prête !</span>
          </div>
          <div
            v-else
            class="inline-flex items-center px-4 py-2 bg-orange-50 border border-orange-200 rounded-full"
          >
            <svg class="w-4 h-4 text-orange-500 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 9v2m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"/>
            </svg>
            <span class="text-orange-700 font-medium text-sm">Activez votre conseillère d'abord</span>
          </div>
        </div>

        <!-- Card: Code d'intégration -->
        <div class="bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden">
          <div class="px-4 py-3 sm:px-6 sm:py-4 border-b border-gray-100 bg-gradient-to-r from-rose-50 to-pink-50">
            <h2 class="text-base sm:text-lg font-semibold text-gray-900 flex items-center">
              <span class="mr-2">🔧</span>
              Code d'intégration
            </h2>
          </div>

          <div class="p-4 sm:p-6">
            <p class="text-sm text-gray-600 mb-4">
              Copiez ce code et collez-le juste avant la balise <code class="bg-gray-100 px-1 rounded">&lt;/body&gt;</code> de votre site.
            </p>

            <div class="relative">
              <div class="bg-gray-900 rounded-xl p-4 overflow-x-auto">
                <pre class="text-green-400 text-xs sm:text-sm font-mono whitespace-pre-wrap break-all">{{ integrationCode }}</pre>
              </div>

              <button
                @click="copyCode"
                class="absolute top-3 right-3 px-3 py-1.5 bg-gray-700 hover:bg-gray-600 text-white text-xs font-medium rounded-lg transition-colors flex items-center"
              >
                <svg v-if="!codeCopied" class="w-4 h-4 mr-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M8 16H6a2 2 0 01-2-2V6a2 2 0 012-2h8a2 2 0 012 2v2m-6 12h8a2 2 0 002-2v-8a2 2 0 00-2-2h-8a2 2 0 00-2 2v8a2 2 0 002 2z"/>
                </svg>
                <svg v-else class="w-4 h-4 mr-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M5 13l4 4L19 7"/>
                </svg>
                {{ codeCopied ? 'Copié !' : 'Copier' }}
              </button>
            </div>
          </div>
        </div>

        <!-- Card: Instructions -->
        <div class="bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden">
          <div class="px-4 py-3 sm:px-6 sm:py-4 border-b border-gray-100 bg-gradient-to-r from-rose-50 to-pink-50">
            <h2 class="text-base sm:text-lg font-semibold text-gray-900 flex items-center">
              <span class="mr-2">📋</span>
              Instructions d'installation
            </h2>
          </div>

          <div class="p-4 sm:p-6">
            <ol class="space-y-4">
              <li class="flex items-start">
                <span class="flex-shrink-0 w-6 h-6 bg-rose-100 text-rose-600 rounded-full flex items-center justify-center text-sm font-bold mr-3">1</span>
                <div>
                  <p class="font-medium text-gray-900">Copiez le code ci-dessus</p>
                  <p class="text-sm text-gray-500">Cliquez sur le bouton "Copier"</p>
                </div>
              </li>
              <li class="flex items-start">
                <span class="flex-shrink-0 w-6 h-6 bg-rose-100 text-rose-600 rounded-full flex items-center justify-center text-sm font-bold mr-3">2</span>
                <div>
                  <p class="font-medium text-gray-900">Accédez au code de votre site</p>
                  <p class="text-sm text-gray-500">Shopify, WooCommerce, ou votre éditeur HTML</p>
                </div>
              </li>
              <li class="flex items-start">
                <span class="flex-shrink-0 w-6 h-6 bg-rose-100 text-rose-600 rounded-full flex items-center justify-center text-sm font-bold mr-3">3</span>
                <div>
                  <p class="font-medium text-gray-900">Collez avant &lt;/body&gt;</p>
                  <p class="text-sm text-gray-500">Juste avant la balise de fermeture body</p>
                </div>
              </li>
              <li class="flex items-start">
                <span class="flex-shrink-0 w-6 h-6 bg-green-100 text-green-600 rounded-full flex items-center justify-center text-sm font-bold mr-3">✓</span>
                <div>
                  <p class="font-medium text-gray-900">C'est terminé !</p>
                  <p class="text-sm text-gray-500">Votre conseillère apparaîtra automatiquement</p>
                </div>
              </li>
            </ol>
          </div>
        </div>

        <!-- Débogage -->
        <div class="bg-purple-50 border border-purple-200 rounded-2xl p-4 sm:p-6">
          <div class="flex items-start space-x-3">
            <svg class="w-5 h-5 text-purple-500 flex-shrink-0 mt-0.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M10 20l4-16m4 4l4 4-4 4M6 16l-4-4 4-4"/>
            </svg>
            <div class="flex-1">
              <p class="font-medium text-purple-800">Le widget ne s'affiche pas ?</p>
              <div class="text-sm text-purple-700 mt-2 space-y-2">
                <p>1. <strong>Ouvrez la console</strong> de votre navigateur (F12 ou clic droit > Inspecter)</p>
                <p>2. <strong>Recherchez les logs</strong> commençant par <code class="px-1.5 py-0.5 bg-purple-100 rounded text-xs">[ChatSeller]</code></p>
                <p>3. <strong>Vérifiez les erreurs</strong> en rouge - elles indiqueront le problème</p>
                <p class="mt-3 pt-2 border-t border-purple-200">
                  <strong>Erreurs courantes :</strong>
                </p>
                <ul class="list-disc list-inside space-y-1 ml-2">
                  <li>Erreur 404 : Le fichier embed.js n'est pas accessible</li>
                  <li>CORS error : Problème de permissions entre domaines</li>
                  <li>shopId invalide : Vérifiez votre configuration</li>
                </ul>
              </div>
            </div>
          </div>
        </div>

        <!-- Besoin d'aide -->
        <div class="bg-blue-50 border border-blue-200 rounded-2xl p-4 sm:p-6">
          <div class="flex items-start space-x-3">
            <svg class="w-5 h-5 text-blue-500 flex-shrink-0 mt-0.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"/>
            </svg>
            <div>
              <p class="font-medium text-blue-800">Besoin d'aide pour l'installation ?</p>
              <p class="text-sm text-blue-700 mt-1">
                Contactez-nous et nous vous aiderons à installer le widget sur votre site gratuitement.
              </p>
              <a
                href="mailto:support@chatseller.io?subject=Aide installation widget"
                class="inline-flex items-center mt-2 text-sm font-medium text-blue-600 hover:text-blue-800"
              >
                Demander de l'aide
                <svg class="w-4 h-4 ml-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M14 5l7 7m0 0l-7 7m7-7H3"/>
                </svg>
              </a>
            </div>
          </div>
        </div>
      </section>
    </main>

    <!-- ========== MODAL BASE DE CONNAISSANCES ========== -->
    <Teleport to="body">
      <Transition name="modal">
        <div
          v-if="showKnowledgeModal"
          class="fixed inset-0 z-50 overflow-y-auto"
        >
          <div class="min-h-screen px-4 text-center">
            <!-- Overlay -->
            <div
              class="fixed inset-0 bg-black/50 transition-opacity"
              @click="showKnowledgeModal = false"
            ></div>

            <!-- Spacer pour centrer -->
            <span class="inline-block h-screen align-middle" aria-hidden="true">&#8203;</span>

            <!-- Modal -->
            <div class="inline-block w-full max-w-lg text-left align-middle transition-all transform bg-white shadow-xl rounded-2xl relative">
              <div class="px-4 py-4 sm:px-6 border-b border-gray-200">
                <div class="flex items-center justify-between">
                  <h3 class="text-lg font-semibold text-gray-900">Base de connaissances</h3>
                  <button
                    @click="showKnowledgeModal = false"
                    class="p-2 text-gray-400 hover:text-gray-600 rounded-lg hover:bg-gray-100"
                  >
                    <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12"/>
                    </svg>
                  </button>
                </div>
              </div>

              <div class="px-4 py-4 sm:px-6 max-h-96 overflow-y-auto">
                <div v-if="availableDocuments.length === 0" class="text-center py-8">
                  <div class="w-16 h-16 mx-auto mb-4 bg-gray-100 rounded-full flex items-center justify-center">
                    <svg class="w-8 h-8 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z"/>
                    </svg>
                  </div>
                  <p class="text-gray-600 font-medium">Aucun document disponible</p>
                  <p class="text-sm text-gray-500 mt-1">Créez des documents dans votre base de connaissances</p>
                  <NuxtLink
                    to="/knowledge-base"
                    class="inline-flex items-center mt-4 px-4 py-2 bg-rose-500 text-white text-sm font-medium rounded-lg hover:bg-rose-600"
                  >
                    Créer un document
                  </NuxtLink>
                </div>

                <div v-else class="space-y-2">
                  <label
                    v-for="doc in availableDocuments"
                    :key="doc.id"
                    class="flex items-center p-3 border border-gray-200 rounded-xl hover:bg-gray-50 cursor-pointer transition-colors"
                    :class="{ 'border-rose-500 bg-rose-50': selectedDocuments.includes(doc.id) }"
                  >
                    <input
                      type="checkbox"
                      :value="doc.id"
                      v-model="selectedDocuments"
                      @change="markAsChanged"
                      class="w-4 h-4 text-rose-500 border-gray-300 rounded focus:ring-rose-500"
                    />
                    <div class="ml-3 flex-1 min-w-0">
                      <p class="text-sm font-medium text-gray-900 truncate">{{ doc.title }}</p>
                      <p class="text-xs text-gray-500">{{ doc.content_type || 'Document' }}</p>
                    </div>
                  </label>
                </div>
              </div>

              <div class="px-4 py-4 sm:px-6 border-t border-gray-200 flex justify-end space-x-3">
                <button
                  @click="showKnowledgeModal = false"
                  class="px-4 py-2 text-sm font-medium text-gray-700 bg-gray-100 rounded-lg hover:bg-gray-200"
                >
                  Fermer
                </button>
                <button
                  @click="saveKnowledgeSelection"
                  :disabled="savingKnowledge"
                  class="px-4 py-2 text-sm font-medium text-white bg-rose-500 rounded-lg hover:bg-rose-600 disabled:opacity-50"
                >
                  {{ savingKnowledge ? 'Sauvegarde...' : 'Appliquer' }}
                </button>
              </div>
            </div>
          </div>
        </div>
      </Transition>
    </Teleport>
  </div>
</template>

<script setup lang="ts">
import { ref, computed, onMounted, nextTick } from 'vue'
import { useRouter, useRoute } from 'vue-router'
import { useAuthStore } from '~/stores/auth'

// Page metadata
definePageMeta({
  middleware: 'auth',
  layout: 'default'
})

// Types
interface AgentConfig {
  agent: {
    id: string
    name: string
    title: string
    type: string
    personality: string
    welcomeMessage: string
    fallbackMessage: string
    avatar: string
    isActive: boolean
    config: Record<string, any>
  }
  widget: {
    buttonText: string
    primaryColor: string
    position: string
    floatingPosition: string
    widgetSize: string
    borderRadius: string
    isActive: boolean
  }
}

interface KnowledgeDocument {
  id: string
  title: string
  content_type?: string
  is_active?: boolean
}

// Composables
const router = useRouter()
const route = useRoute()
const authStore = useAuthStore()

// State
const loading = ref(true)
const saving = ref(false)
const hasChanges = ref(false)
const successMessage = ref('')
const errorMessage = ref('')
const activeTab = ref('customize')
const codeCopied = ref(false)
const showKnowledgeModal = ref(false)
const savingKnowledge = ref(false)

// Playground state
const playgroundInput = ref('')
const playgroundTyping = ref(false)
const playgroundConversation = ref<Array<{ role: 'user' | 'assistant'; content: string }>>([])
const playgroundMessages = ref<HTMLElement>()
const playgroundConversationId = ref<string | null>(null)

const localConfig = ref<AgentConfig>({
  agent: {
    id: '',
    name: '',
    title: '',
    type: 'beauty_expert',
    personality: 'friendly',
    welcomeMessage: '',
    fallbackMessage: '',
    avatar: '',
    isActive: true,
    config: {}
  },
  widget: {
    buttonText: 'Parler à une conseillère',
    primaryColor: '#E91E63',
    position: 'above-cta',
    floatingPosition: 'bottom-right',
    widgetSize: 'medium',
    borderRadius: 'lg',
    isActive: true
  }
})

const availableDocuments = ref<KnowledgeDocument[]>([])
const selectedDocuments = ref<string[]>([])
const linkedDocuments = ref<KnowledgeDocument[]>([])

// Refs
const avatarInput = ref<HTMLInputElement>()

// Computed
const agentId = computed(() => route.params.id as string)

// Processed welcome message with variable replacement
const processedWelcomeMessage = computed(() => {
  let message = localConfig.value.agent.welcomeMessage || getWelcomePlaceholder()

  // Replace variables with actual values
  const variables: Record<string, string> = {
    '{nomConseillere}': localConfig.value.agent.name || 'Conseillère',
    '{nomMarque}': authStore.user?.shop?.name || authStore.user?.name || 'Votre marque',
    '{prenom}': authStore.user?.firstName || 'Client',
  }

  for (const [variable, value] of Object.entries(variables)) {
    message = message.replace(new RegExp(variable.replace(/[{}]/g, '\\$&'), 'g'), value)
  }

  return message
})

// Helper to generate gradient colors from primary color
const playgroundGradientStyle = computed(() => {
  const primary = localConfig.value.widget.primaryColor || '#E91E63'
  return {
    background: `linear-gradient(135deg, ${primary} 0%, ${adjustColor(primary, -20)} 100%)`
  }
})

// Helper to darken/lighten a hex color
function adjustColor(hex: string, amount: number): string {
  // Remove # if present
  hex = hex.replace('#', '')

  // Parse hex
  let r = parseInt(hex.substring(0, 2), 16)
  let g = parseInt(hex.substring(2, 4), 16)
  let b = parseInt(hex.substring(4, 6), 16)

  // Adjust values
  r = Math.max(0, Math.min(255, r + amount))
  g = Math.max(0, Math.min(255, g + amount))
  b = Math.max(0, Math.min(255, b + amount))

  // Convert back to hex
  return `#${r.toString(16).padStart(2, '0')}${g.toString(16).padStart(2, '0')}${b.toString(16).padStart(2, '0')}`
}

const integrationCode = computed(() => {
  const shopId = authStore.user?.id || 'YOUR_SHOP_ID'
  const agent = localConfig.value.agent
  const widget = localConfig.value.widget
  const config = useRuntimeConfig()
  const apiUrl = config.public.apiBaseUrl || 'https://chatseller-api-production.up.railway.app'

  return `<!-- ChatSeller Widget - Agent: ${agent.name || 'Conseillère'} -->
<script>
(function() {
  'use strict';

  // Configuration du widget ChatSeller
  window.ChatSellerConfig = {
    shopId: '${shopId}',
    agentId: '${agent.id}',
    apiUrl: '${apiUrl}',
    buttonText: '${widget.buttonText || 'Parler à une conseillère'}',
    primaryColor: '${widget.primaryColor}',
    position: '${widget.position}',
    floatingPosition: '${widget.floatingPosition}',
    theme: 'modern',
    language: 'fr',
    borderRadius: '${widget.borderRadius || 'full'}',
    autoDetectProduct: true,
    debug: true, // Mode debug activé pour voir les logs console
    agentConfig: {
      id: '${agent.id}',
      name: '${agent.name}',
      title: '${agent.title || 'Conseillère beauté'}',
      welcomeMessage: '${(agent.welcomeMessage || getWelcomePlaceholder()).replace(/'/g, "\\'")}',
      fallbackMessage: '${(agent.fallbackMessage || 'Je transmets votre question à notre équipe, un conseiller vous recontactera bientôt.').replace(/'/g, "\\'")}',
      personality: '${agent.personality}'
    }
  };

  // Protection anti-double chargement
  if (window.ChatSellerInitialized) return;
  window.ChatSellerInitialized = true;

  // Chargement du widget
  function loadWidget() {
    if (window.ChatSellerLoaded) return;
    window.ChatSellerLoaded = true;

    var script = document.createElement('script');
    script.src = 'https://widget.chatseller.app/embed.js?v=' + Date.now();
    script.async = true;

    script.onload = function() {
      var attempts = 0;
      function tryInit() {
        if (window.ChatSeller && window.ChatSeller.init) {
          window.ChatSeller.init(window.ChatSellerConfig);
        } else if (attempts++ < 20) {
          setTimeout(tryInit, 300);
        }
      }
      tryInit();
    };

    document.head.appendChild(script);
  }

  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', loadWidget);
  } else {
    setTimeout(loadWidget, 100);
  }
})();
<\/script>
<!-- Fin ChatSeller Widget -->`
})

// Static data
const tabs = [
  { id: 'customize', name: 'Personnaliser', icon: '👩‍💼' },
  { id: 'appearance', name: 'Apparence', icon: '🎨' },
  { id: 'test', name: 'Tester', icon: '🧪' },
  { id: 'install', name: 'Installer', icon: '⚡' }
]

const personalities = [
  { value: 'friendly', label: 'Amicale', icon: '😊', description: 'Chaleureuse et accessible' },
  { value: 'professional', label: 'Pro', icon: '👔', description: 'Sérieuse et experte' },
  { value: 'expert', label: 'Experte', icon: '🎓', description: 'Technique et pointue' },
  { value: 'casual', label: 'Décontractée', icon: '✌️', description: 'Cool et moderne' }
]

const beautyColors = [
  { value: '#E91E63', name: 'Rose' },
  { value: '#9C27B0', name: 'Violet' },
  { value: '#673AB7', name: 'Indigo' },
  { value: '#FF5722', name: 'Corail' },
  { value: '#00BCD4', name: 'Turquoise' },
  { value: '#000000', name: 'Noir' }
]

const buttonPositions = [
  { value: 'above-cta', label: 'Au-dessus' },
  { value: 'below-cta', label: 'En-dessous' },
  { value: 'beside-cta', label: 'À côté' }
]

const floatingPositions = [
  { value: 'bottom-right', label: 'Bas droite' },
  { value: 'bottom-left', label: 'Bas gauche' }
]

const availableVariables = [
  { name: '{nomConseillere}', display: 'Nom conseillère' },
  { name: '{nomMarque}', display: 'Nom marque' }
]

// Methods
const goBack = () => {
  router.push('/')
}

const markAsChanged = () => {
  hasChanges.value = true
}

const getWelcomePlaceholder = () => {
  return `Bonjour ! Je suis ${localConfig.value.agent.name || 'votre conseillère'}, comment puis-je vous aider ?`
}

const triggerAvatarUpload = () => {
  avatarInput.value?.click()
}

const handleAvatarUpload = async (event: Event) => {
  const file = (event.target as HTMLInputElement).files?.[0]
  if (!file) return

  if (!file.type.startsWith('image/')) {
    errorMessage.value = 'Veuillez sélectionner une image'
    return
  }

  const reader = new FileReader()
  reader.onload = (e) => {
    localConfig.value.agent.avatar = e.target?.result as string
    markAsChanged()
  }
  reader.readAsDataURL(file)
}

const selectPersonality = (personality: string) => {
  localConfig.value.agent.personality = personality
  markAsChanged()
}

const selectColor = (color: string) => {
  localConfig.value.widget.primaryColor = color
  markAsChanged()
}

const selectPosition = (position: string) => {
  localConfig.value.widget.position = position
  markAsChanged()
}

const selectFloatingPosition = (position: string) => {
  localConfig.value.widget.floatingPosition = position
  markAsChanged()
}

const toggleActive = () => {
  localConfig.value.agent.isActive = !localConfig.value.agent.isActive
  markAsChanged()
}

const insertVariable = (variable: string) => {
  localConfig.value.agent.welcomeMessage += ` ${variable}`
  markAsChanged()
}

const copyCode = async () => {
  try {
    await navigator.clipboard.writeText(integrationCode.value)
    codeCopied.value = true
    setTimeout(() => codeCopied.value = false, 2000)
  } catch (error) {
    console.error('Erreur copie:', error)
  }
}

// Playground Methods
const resetPlayground = () => {
  playgroundConversation.value = []
  playgroundInput.value = ''
  playgroundConversationId.value = null
}

const scrollToBottom = () => {
  nextTick(() => {
    if (playgroundMessages.value) {
      playgroundMessages.value.scrollTop = playgroundMessages.value.scrollHeight
    }
  })
}

const sendPlaygroundMessage = async () => {
  const message = playgroundInput.value.trim()
  if (!message || playgroundTyping.value) return

  // Ajouter le message utilisateur
  playgroundConversation.value.push({ role: 'user', content: message })
  playgroundInput.value = ''
  scrollToBottom()

  // Afficher l'indicateur de frappe
  playgroundTyping.value = true

  try {
    const config = useRuntimeConfig()
    const baseURL = config.public.apiBaseUrl

    // Appeler l'API de chat TEST (route correcte)
    const response = await $fetch('/api/v1/chat/test', {
      method: 'POST',
      baseURL,
      headers: {
        'Authorization': `Bearer ${authStore.token}`,
        'Content-Type': 'application/json'
      },
      body: {
        shopId: authStore.user?.id,
        agentId: localConfig.value.agent.id,
        message,
        testMode: true
      }
    }) as { success: boolean; data: { message: string } }

    if (response.success && response.data) {
      playgroundConversation.value.push({
        role: 'assistant',
        content: response.data.message
      })
    } else {
      throw new Error('Réponse invalide')
    }

  } catch (error: any) {
    console.error('Erreur playground:', error)
    // Message d'erreur utilisateur-friendly
    playgroundConversation.value.push({
      role: 'assistant',
      content: `Désolée, je n'ai pas pu traiter votre demande. ${error.data?.error || error.message || 'Veuillez réessayer.'}`
    })
  } finally {
    playgroundTyping.value = false
    scrollToBottom()
  }
}

// API Methods
const fetchAgentConfig = async () => {
  try {
    loading.value = true
    const config = useRuntimeConfig()
    const baseURL = config.public.apiBaseUrl

    // Fetch agent config
    const response = await $fetch(`/api/v1/agents/${agentId.value}/config`, {
      method: 'GET',
      baseURL,
      headers: {
        'Authorization': `Bearer ${authStore.token}`,
        'Content-Type': 'application/json'
      }
    }) as { success: boolean; data: any }

    if (response.success && response.data) {
      const { agent, knowledgeBase } = response.data

      console.log('📥 Chargement agent:', {
        welcome_message: agent.welcome_message,
        welcomeMessage: agent.welcomeMessage,
        name: agent.name
      })

      localConfig.value = {
        agent: {
          id: agent.id,
          name: agent.name || '',
          title: agent.title || '',
          type: agent.type || 'beauty_expert',
          personality: agent.personality || 'friendly',
          welcomeMessage: agent.welcome_message || agent.welcomeMessage || '',
          fallbackMessage: agent.fallback_message || agent.fallbackMessage || '',
          avatar: agent.avatar || '',
          isActive: agent.is_active ?? true,
          config: agent.config || {}
        },
        widget: {
          buttonText: agent.config?.widget?.buttonText || 'Parler à une conseillère',
          primaryColor: agent.config?.widget?.primaryColor || '#E91E63',
          position: agent.config?.widget?.position || 'above-cta',
          floatingPosition: agent.config?.widget?.floatingPosition || 'bottom-right',
          widgetSize: agent.config?.widget?.widgetSize || 'medium',
          borderRadius: agent.config?.widget?.borderRadius || 'lg',
          isActive: agent.config?.widget?.isActive ?? true
        }
      }

      console.log('✅ Config chargée:', localConfig.value.agent.welcomeMessage)

      // Documents liés
      if (knowledgeBase && Array.isArray(knowledgeBase)) {
        linkedDocuments.value = knowledgeBase
        selectedDocuments.value = knowledgeBase.map((doc: any) => doc.id)
      }
    }

    // Fetch available documents
    await fetchAvailableDocuments()

  } catch (error) {
    console.error('Erreur chargement config:', error)
    errorMessage.value = 'Erreur lors du chargement de la configuration'
  } finally {
    loading.value = false
  }
}

const fetchAvailableDocuments = async () => {
  try {
    const config = useRuntimeConfig()
    const baseURL = config.public.apiBaseUrl

    const response = await $fetch('/api/v1/knowledge-base', {
      method: 'GET',
      baseURL,
      headers: {
        'Authorization': `Bearer ${authStore.token}`,
        'Content-Type': 'application/json'
      }
    }) as { success: boolean; data: any[] }

    if (response.success && response.data) {
      availableDocuments.value = response.data
    }
  } catch (error) {
    console.error('Erreur chargement documents:', error)
  }
}

const saveConfiguration = async () => {
  try {
    saving.value = true
    errorMessage.value = ''

    const config = useRuntimeConfig()
    const baseURL = config.public.apiBaseUrl

    console.log('💾 Sauvegarde configuration:', {
      welcomeMessage: localConfig.value.agent.welcomeMessage,
      name: localConfig.value.agent.name,
      title: localConfig.value.agent.title
    })

    // Save agent
    const response = await $fetch(`/api/v1/agents/${agentId.value}`, {
      method: 'PUT',
      baseURL,
      headers: {
        'Authorization': `Bearer ${authStore.token}`,
        'Content-Type': 'application/json'
      },
      body: {
        name: localConfig.value.agent.name,
        title: localConfig.value.agent.title,
        type: localConfig.value.agent.type,
        personality: localConfig.value.agent.personality,
        welcomeMessage: localConfig.value.agent.welcomeMessage,
        fallbackMessage: localConfig.value.agent.fallbackMessage,
        avatar: localConfig.value.agent.avatar,
        isActive: localConfig.value.agent.isActive,
        config: {
          ...localConfig.value.agent.config,
          widget: localConfig.value.widget
        }
      }
    }) as { success: boolean; data: any }

    console.log('✅ Réponse sauvegarde:', response)

    // Save knowledge base links
    if (selectedDocuments.value.length > 0 || linkedDocuments.value.length > 0) {
      await $fetch(`/api/v1/agents/${agentId.value}/knowledge-base`, {
        method: 'PUT',
        baseURL,
        headers: {
          'Authorization': `Bearer ${authStore.token}`,
          'Content-Type': 'application/json'
        },
        body: {
          documentIds: selectedDocuments.value
        }
      })
    }

    hasChanges.value = false
    successMessage.value = 'Configuration sauvegardée !'
    setTimeout(() => successMessage.value = '', 3000)

  } catch (error: any) {
    console.error('Erreur sauvegarde:', error)
    errorMessage.value = error.data?.error || 'Erreur lors de la sauvegarde'
  } finally {
    saving.value = false
  }
}

const saveKnowledgeSelection = async () => {
  try {
    savingKnowledge.value = true

    const config = useRuntimeConfig()
    const baseURL = config.public.apiBaseUrl

    await $fetch(`/api/v1/agents/${agentId.value}/knowledge-base`, {
      method: 'PUT',
      baseURL,
      headers: {
        'Authorization': `Bearer ${authStore.token}`,
        'Content-Type': 'application/json'
      },
      body: {
        documentIds: selectedDocuments.value
      }
    })

    // Update linked documents display
    linkedDocuments.value = availableDocuments.value.filter(doc =>
      selectedDocuments.value.includes(doc.id)
    )

    showKnowledgeModal.value = false
    successMessage.value = 'Documents mis à jour !'
    setTimeout(() => successMessage.value = '', 3000)

  } catch (error: any) {
    console.error('Erreur sauvegarde KB:', error)
    errorMessage.value = error.data?.error || 'Erreur lors de la mise à jour'
  } finally {
    savingKnowledge.value = false
  }
}

// Lifecycle
onMounted(() => {
  fetchAgentConfig()
})

// SEO
useHead({
  title: computed(() => `${localConfig.value.agent.name || 'Ma Conseillère'} - ChatSeller`)
})
</script>

<style scoped>
/* Transitions */
.slide-down-enter-active,
.slide-down-leave-active {
  transition: all 0.3s ease;
}
.slide-down-enter-from,
.slide-down-leave-to {
  opacity: 0;
  transform: translateY(-10px);
}

/* Modal */
.modal-enter-active,
.modal-leave-active {
  transition: all 0.3s ease;
}
.modal-enter-from,
.modal-leave-to {
  opacity: 0;
}
.modal-enter-from .inline-block,
.modal-leave-to .inline-block {
  transform: scale(0.95);
}

/* Custom checkbox */
input[type="checkbox"] {
  @apply rounded border-gray-300 text-rose-500 focus:ring-rose-500;
}

/* Smooth scrolling for mobile */
@media (max-width: 640px) {
  section {
    scroll-behavior: smooth;
  }
}
</style>
