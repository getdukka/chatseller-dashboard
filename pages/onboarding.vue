<!-- pages/onboarding.vue -->
<!-- Progressive onboarding: one question per screen, ElevenLabs-style -->
<!-- Refactored: 7 steps (was 9) — removed gender, specializedTarget, ageRange, priceRange -->
<!-- Added: step 6 (test immédiat) + step 7 (activation guidée) -->
<template>
  <div class="min-h-screen bg-white flex flex-col">

    <!-- Header compact -->
    <header class="flex items-center justify-between px-6 py-4 border-b border-gray-100">
      <div class="flex items-center space-x-2">
        <img src="/assets/images/logos/fav.svg" alt="ChatSeller" class="w-7 h-7" />
        <span class="text-lg font-bold text-gray-900">ChatSeller</span><span class="text-lg font-bold text-rose-500">.</span>
      </div>

      <!-- Dot pagination -->
      <div class="flex items-center space-x-1.5">
        <div
          v-for="i in totalSubSteps"
          :key="i"
          class="w-2 h-2 rounded-full transition-all duration-300"
          :class="i <= subStep ? 'bg-rose-500' : 'bg-gray-200'"
        ></div>
      </div>

      <div class="text-sm text-gray-400 font-medium w-20 text-right">
        {{ subStep }}/{{ totalSubSteps }}
      </div>
    </header>

    <!-- Loading state -->
    <div v-if="initializing" class="flex-1 flex items-center justify-center">
      <div class="text-center">
        <svg class="animate-spin w-8 h-8 text-rose-500 mx-auto mb-4" fill="none" viewBox="0 0 24 24">
          <circle class="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" stroke-width="4"></circle>
          <path class="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
        </svg>
        <p class="text-gray-500">Chargement...</p>
      </div>
    </div>

    <!-- Main content area -->
    <div v-else class="flex-1 overflow-y-auto">

      <!-- Scrollable content centered -->
      <div class="min-h-[calc(100vh-65px)] flex items-center justify-center px-6 py-8">
        <!-- Single Transition keyed by subStep: proper out-in with no gap between steps -->
        <div class="w-full max-w-2xl">
          <Transition name="slide" mode="out-in">
          <div :key="subStep">

          <!-- ===== SUB-STEP 1: Brand name + website ===== -->
            <div v-if="subStep === 1" class="space-y-8">
              <div class="text-center">
                <h1 class="text-2xl md:text-3xl font-bold text-gray-900 mb-2">Parlez-nous de votre marque</h1>
                <p class="text-gray-500">Mia a besoin de connaître votre marque pour bien la représenter.</p>
              </div>

              <div class="space-y-5">
                <div>
                  <label class="block text-sm font-medium text-gray-700 mb-1.5">Nom de votre marque</label>
                  <input
                    v-model="form.company"
                    type="text"
                    required
                    class="w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-rose-500 focus:border-rose-500 text-gray-900 placeholder-gray-400 transition-all"
                    placeholder="Ex: Soso Beauty, Yass Hair..."
                  />
                </div>
                <div>
                  <label class="block text-sm font-medium text-gray-700 mb-1.5">Adresse de votre boutique en ligne</label>
                  <input
                    v-model="form.website"
                    type="url"
                    required
                    class="w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-rose-500 focus:border-rose-500 text-gray-900 placeholder-gray-400 transition-all"
                    placeholder="https://votremarque.com"
                  />
                  <p class="text-xs text-gray-400 mt-1.5">Mia parcourra votre site pour apprendre vos produits</p>
                </div>
              </div>

              <!-- Buttons inline -->
              <div class="flex justify-end pt-2">
                <button @click="nextSubStep" :disabled="!canProceed" class="px-8 py-2.5 bg-rose-600 text-white font-semibold rounded-lg hover:bg-rose-700 transition-all disabled:opacity-40 disabled:cursor-not-allowed">
                  Continuer
                </button>
              </div>
            </div>

          <!-- ===== SUB-STEP 2: Beauty category ===== -->
            <div v-if="subStep === 2" class="space-y-8">
              <div class="text-center">
                <h1 class="text-2xl md:text-3xl font-bold text-gray-900 mb-2">Dans quel domaine travaillez-vous ?</h1>
                <p class="text-gray-500">Mia sera specialisee dans ce domaine.</p>
              </div>

              <div class="grid grid-cols-2 gap-3">
                <button
                  v-for="cat in beautyCategories"
                  :key="cat.value"
                  type="button"
                  @click="form.beautyCategory = cat.value"
                  class="relative p-4 border-2 rounded-xl text-left transition-all hover:border-rose-300 hover:bg-rose-50/50"
                  :class="form.beautyCategory === cat.value ? 'border-rose-500 bg-rose-50 shadow-sm' : 'border-gray-200 bg-white'"
                >
                  <div class="text-xl mb-1">{{ cat.icon }}</div>
                  <div class="font-semibold text-gray-900 text-sm">{{ cat.label }}</div>
                  <div v-if="form.beautyCategory === cat.value" class="absolute top-2.5 right-2.5 w-5 h-5 bg-rose-500 rounded-full flex items-center justify-center">
                    <svg class="w-3 h-3 text-white" fill="currentColor" viewBox="0 0 20 20"><path fill-rule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clip-rule="evenodd"/></svg>
                  </div>
                </button>
              </div>

              <div class="flex items-center justify-between pt-2">
                <button @click="prevSubStep" class="px-5 py-2.5 text-gray-600 font-medium rounded-lg hover:bg-gray-100 transition-all">Retour</button>
                <button @click="nextSubStep" :disabled="!canProceed" class="px-8 py-2.5 bg-rose-600 text-white font-semibold rounded-lg hover:bg-rose-700 transition-all disabled:opacity-40 disabled:cursor-not-allowed">Continuer</button>
              </div>
            </div>

          <!-- ===== SUB-STEP 3: Platform ===== -->
            <div v-if="subStep === 3" class="space-y-8">
              <div class="text-center">
                <h1 class="text-2xl md:text-3xl font-bold text-gray-900 mb-2">Sur quelle plateforme est votre boutique ?</h1>
                <p class="text-gray-500">Pour que Mia puisse importer vos produits automatiquement.</p>
              </div>

              <div class="space-y-3">
                <button
                  v-for="plat in platforms"
                  :key="plat.value"
                  type="button"
                  @click="form.platform = plat.value"
                  class="w-full flex items-center p-4 border-2 rounded-xl transition-all hover:border-rose-300"
                  :class="form.platform === plat.value ? 'border-rose-500 bg-rose-50' : 'border-gray-200 bg-white'"
                >
                  <img v-if="plat.logo" :src="plat.logo" :alt="plat.label" class="h-8 w-auto mr-4" />
                  <span v-else class="text-2xl mr-4">{{ plat.icon }}</span>
                  <div class="text-left">
                    <div class="font-semibold text-gray-900">{{ plat.label }}</div>
                    <div class="text-sm text-gray-500">{{ plat.description }}</div>
                  </div>
                  <div v-if="form.platform === plat.value" class="ml-auto w-5 h-5 bg-rose-500 rounded-full flex items-center justify-center flex-shrink-0">
                    <svg class="w-3 h-3 text-white" fill="currentColor" viewBox="0 0 20 20"><path fill-rule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clip-rule="evenodd"/></svg>
                  </div>
                </button>
              </div>

              <div class="flex items-center justify-between pt-2">
                <button @click="prevSubStep" class="px-5 py-2.5 text-gray-600 font-medium rounded-lg hover:bg-gray-100 transition-all">Retour</button>
                <button @click="nextSubStep" :disabled="!canProceed" class="px-8 py-2.5 bg-rose-600 text-white font-semibold rounded-lg hover:bg-rose-700 transition-all disabled:opacity-40 disabled:cursor-not-allowed">Continuer</button>
              </div>
            </div>

          <!-- ===== SUB-STEP 4: Communication tone (was step 8) ===== -->
            <div v-if="subStep === 4" class="space-y-8">
              <div class="text-center">
                <h1 class="text-2xl md:text-3xl font-bold text-gray-900 mb-2">Comment Mia doit-elle parler ?</h1>
                <p class="text-gray-500">Son ton s'adaptera à votre marque.</p>
              </div>

              <div class="grid grid-cols-1 md:grid-cols-2 gap-3">
                <button
                  v-for="tone in communicationTones"
                  :key="tone.value"
                  type="button"
                  @click="selectTone(tone.value)"
                  class="w-full p-4 border-2 rounded-xl text-left transition-all hover:border-rose-300"
                  :class="form.communicationTone === tone.value ? 'border-rose-500 bg-rose-50' : 'border-gray-200 bg-white'"
                >
                  <div class="flex items-center justify-between mb-2">
                    <div class="flex items-center space-x-3">
                      <span class="text-xl">{{ tone.icon }}</span>
                      <span class="font-semibold text-gray-900">{{ tone.label }}</span>
                    </div>
                    <div v-if="form.communicationTone === tone.value" class="w-5 h-5 bg-rose-500 rounded-full flex items-center justify-center flex-shrink-0">
                      <svg class="w-3 h-3 text-white" fill="currentColor" viewBox="0 0 20 20"><path fill-rule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clip-rule="evenodd"/></svg>
                    </div>
                  </div>
                  <p class="text-sm text-gray-500 mb-2">{{ tone.description }}</p>
                  <div class="bg-gray-50 rounded-lg px-3 py-2">
                    <p class="text-xs text-gray-400 mb-0.5">Exemple :</p>
                    <p class="text-sm italic text-gray-600">"{{ tone.example }}"</p>
                  </div>
                </button>
              </div>

              <div class="flex items-center justify-between pt-2">
                <button @click="prevSubStep" class="px-5 py-2.5 text-gray-600 font-medium rounded-lg hover:bg-gray-100 transition-all">Retour</button>
                <button @click="nextSubStep" :disabled="!canProceed" class="px-8 py-2.5 bg-rose-600 text-white font-semibold rounded-lg hover:bg-rose-700 transition-all disabled:opacity-40 disabled:cursor-not-allowed">Continuer</button>
              </div>
            </div>

          <!-- ===== SUB-STEP 5: Agent name + launch (was step 9, simplified) ===== -->
            <div v-if="subStep === 5" class="space-y-8">
              <div class="text-center">
                <!-- Dynamic title based on sync status -->
                <div v-if="syncStore.isSyncComplete && syncStore.hasAnySuccess" class="w-14 h-14 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-4">
                  <svg class="w-7 h-7 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M5 13l4 4L19 7"/></svg>
                </div>
                <div v-else-if="syncStore.isSyncing" class="w-14 h-14 bg-blue-100 rounded-full flex items-center justify-center mx-auto mb-4">
                  <svg class="animate-spin w-7 h-7 text-blue-600" fill="none" viewBox="0 0 24 24">
                    <circle class="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" stroke-width="4"></circle>
                    <path class="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                  </svg>
                </div>

                <h1 class="text-2xl md:text-3xl font-bold text-gray-900 mb-2">
                  <template v-if="syncStore.isSyncComplete && syncStore.hasAnySuccess">Votre vendeuse est prête !</template>
                  <template v-else-if="syncStore.isSyncing">Encore quelques secondes...</template>
                  <template v-else>Dernière étape</template>
                </h1>
                <p class="text-gray-500">Donnez un prénom à votre vendeuse IA.</p>
              </div>

              <div class="space-y-5">
                <div>
                  <label class="block text-sm font-medium text-gray-700 mb-1.5">Prenom de votre vendeuse</label>
                  <input
                    v-model="form.agentName"
                    type="text"
                    class="w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-rose-500 focus:border-rose-500 text-gray-900 placeholder-gray-400 transition-all"
                    :placeholder="getDefaultAgentName()"
                  />
                  <p class="text-xs text-gray-400 mt-1.5">Laissez vide pour "{{ getDefaultAgentName() }}"</p>
                </div>

                <!-- Sync status compact -->
                <div v-if="syncStore.productsStatus !== 'idle' || syncStore.kbStatus !== 'idle'" class="space-y-2">
                  <div v-if="syncStore.kbStatus !== 'idle'" class="flex items-center space-x-2 text-sm" :class="syncStore.kbStatus === 'success' ? 'text-green-600' : syncStore.kbStatus === 'error' ? 'text-orange-500' : 'text-blue-600'">
                    <svg v-if="syncStore.kbStatus === 'pending'" class="animate-spin w-4 h-4" fill="none" viewBox="0 0 24 24"><circle class="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" stroke-width="4"></circle><path class="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path></svg>
                    <svg v-else-if="syncStore.kbStatus === 'success'" class="w-4 h-4" fill="currentColor" viewBox="0 0 24 24"><path d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z"/></svg>
                    <svg v-else class="w-4 h-4" fill="currentColor" viewBox="0 0 24 24"><path d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-2.5L13.732 4c-.77-.833-1.924-.833-2.694 0L4.07 16.5c-.77.833.192 2.5 1.732 2.5z"/></svg>
                    <span v-if="syncStore.kbStatus === 'pending'">Lecture de votre site...</span>
                    <span v-else-if="syncStore.kbStatus === 'success'">{{ syncStore.kbDocumentsCount }} page{{ syncStore.kbDocumentsCount > 1 ? 's' : '' }} lue{{ syncStore.kbDocumentsCount > 1 ? 's' : '' }}</span>
                    <span v-else>Lecture reportee</span>
                  </div>
                  <div v-if="syncStore.productsStatus !== 'idle'" class="flex items-center space-x-2 text-sm" :class="syncStore.productsStatus === 'success' ? 'text-green-600' : syncStore.productsStatus === 'error' ? 'text-orange-500' : 'text-blue-600'">
                    <svg v-if="syncStore.productsStatus === 'pending'" class="animate-spin w-4 h-4" fill="none" viewBox="0 0 24 24"><circle class="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" stroke-width="4"></circle><path class="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path></svg>
                    <svg v-else-if="syncStore.productsStatus === 'success'" class="w-4 h-4" fill="currentColor" viewBox="0 0 24 24"><path d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z"/></svg>
                    <svg v-else class="w-4 h-4" fill="currentColor" viewBox="0 0 24 24"><path d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-2.5L13.732 4c-.77-.833-1.924-.833-2.694 0L4.07 16.5c-.77.833.192 2.5 1.732 2.5z"/></svg>
                    <span v-if="syncStore.productsStatus === 'pending'">Import des produits...</span>
                    <span v-else-if="syncStore.productsStatus === 'success'">{{ syncStore.productsCount }} produit{{ syncStore.productsCount > 1 ? 's' : '' }} importe{{ syncStore.productsCount > 1 ? 's' : '' }}</span>
                    <span v-else>Import reporte</span>
                  </div>
                </div>

                <!-- Error -->
                <div v-if="submitError" class="p-3 bg-red-50 border border-red-200 rounded-xl text-sm text-red-700">
                  {{ submitError }}
                </div>

                <!-- Buttons inline -->
                <div class="flex items-center justify-between pt-2">
                  <button @click="prevSubStep" class="px-5 py-2.5 text-gray-600 font-medium rounded-lg hover:bg-gray-100 transition-all">Retour</button>
                  <button
                    @click="completeOnboarding"
                    :disabled="loading"
                    class="px-8 py-2.5 bg-rose-600 text-white font-semibold rounded-lg hover:bg-rose-700 transition-all disabled:opacity-40"
                  >
                    <span v-if="loading" class="flex items-center">
                      <svg class="animate-spin -ml-1 mr-2 h-4 w-4 text-white" fill="none" viewBox="0 0 24 24">
                        <circle class="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" stroke-width="4"></circle>
                        <path class="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                      </svg>
                      Creation en cours...
                    </span>
                    <span v-else>Lancer {{ form.agentName || getDefaultAgentName() }} →</span>
                  </button>
                </div>
              </div>
            </div>

          <!-- ===== SUB-STEP 6: Test immédiat ===== -->
            <div v-if="subStep === 6" class="space-y-6">

              <!-- En-tête -->
              <div class="text-center">
                <div class="w-14 h-14 bg-rose-100 rounded-full flex items-center justify-center mx-auto mb-4">
                  <span class="text-2xl">🎉</span>
                </div>
                <h1 class="text-2xl md:text-3xl font-bold text-gray-900 mb-2">
                  {{ form.agentName || getDefaultAgentName() }} est prête !
                </h1>
                <p class="text-gray-500">
                  Posez-lui les vraies questions de vos clientes.
                </p>
              </div>

              <!-- Zone de chat -->
              <div class="border border-gray-200 rounded-2xl overflow-hidden bg-white shadow-sm">

                <!-- Header du chat -->
                <div class="flex items-center space-x-3 px-4 py-3 border-b border-gray-100 bg-gray-50">
                  <div class="w-8 h-8 rounded-full bg-rose-500 flex items-center justify-center text-white text-sm font-bold flex-shrink-0">
                    {{ (form.agentName || getDefaultAgentName()).charAt(0) }}
                  </div>
                  <div>
                    <p class="text-sm font-semibold text-gray-900">{{ form.agentName || getDefaultAgentName() }}</p>
                    <p class="text-xs text-green-600 flex items-center">
                      <span class="w-1.5 h-1.5 bg-green-500 rounded-full mr-1"></span>
                      En ligne · Experte {{ getBeautyCategoryLabel(form.beautyCategory) }}
                    </p>
                  </div>
                </div>

                <!-- Messages -->
                <div class="h-56 overflow-y-auto p-4 space-y-3 bg-white" ref="chatScrollRef">
                  <!-- Message de bienvenue automatique -->
                  <div class="flex items-start space-x-2">
                    <div class="w-7 h-7 rounded-full bg-rose-500 flex items-center justify-center text-white text-xs font-bold flex-shrink-0 mt-0.5">
                      {{ (form.agentName || getDefaultAgentName()).charAt(0) }}
                    </div>
                    <div class="bg-gray-100 rounded-2xl rounded-tl-sm px-3 py-2 max-w-xs">
                      <p class="text-sm text-gray-800">{{ getWelcomeMessage() }}</p>
                    </div>
                  </div>

                  <!-- Messages de la conversation -->
                  <template v-for="msg in testMessages" :key="msg.id">
                    <!-- Message utilisateur -->
                    <div v-if="msg.role === 'user'" class="flex justify-end">
                      <div class="bg-rose-500 rounded-2xl rounded-tr-sm px-3 py-2 max-w-xs">
                        <p class="text-sm text-white">{{ msg.content }}</p>
                      </div>
                    </div>
                    <!-- Réponse de la Vendeuse -->
                    <div v-else class="flex items-start space-x-2">
                      <div class="w-7 h-7 rounded-full bg-rose-500 flex items-center justify-center text-white text-xs font-bold flex-shrink-0 mt-0.5">
                        {{ (form.agentName || getDefaultAgentName()).charAt(0) }}
                      </div>
                      <div class="bg-gray-100 rounded-2xl rounded-tl-sm px-3 py-2 max-w-xs">
                        <div class="text-sm text-gray-800 ai-message-content" v-html="formatAiMessage(msg.content)"></div>
                      </div>
                    </div>
                  </template>

                  <!-- Indicateur de frappe -->
                  <div v-if="testLoading" class="flex items-start space-x-2">
                    <div class="w-7 h-7 rounded-full bg-rose-500 flex items-center justify-center text-white text-xs font-bold flex-shrink-0">
                      {{ (form.agentName || getDefaultAgentName()).charAt(0) }}
                    </div>
                    <div class="bg-gray-100 rounded-2xl rounded-tl-sm px-3 py-2">
                      <div class="flex space-x-1">
                        <div class="w-2 h-2 bg-gray-400 rounded-full animate-bounce" style="animation-delay:0ms"></div>
                        <div class="w-2 h-2 bg-gray-400 rounded-full animate-bounce" style="animation-delay:150ms"></div>
                        <div class="w-2 h-2 bg-gray-400 rounded-full animate-bounce" style="animation-delay:300ms"></div>
                      </div>
                    </div>
                  </div>
                </div>

                <!-- Suggestions de questions -->
                <div v-if="testMessages.length === 0" class="px-4 py-2 border-t border-gray-100 flex flex-wrap gap-2">
                  <button
                    v-for="suggestion in getTestSuggestions()"
                    :key="suggestion"
                    @click="sendTestMessage(suggestion)"
                    class="text-xs px-3 py-1.5 bg-rose-50 text-rose-700 rounded-full border border-rose-200 hover:bg-rose-100 transition-all"
                  >
                    {{ suggestion }}
                  </button>
                </div>

                <!-- Input -->
                <div class="flex items-center space-x-2 px-3 py-3 border-t border-gray-100">
                  <input
                    v-model="testInput"
                    type="text"
                    placeholder="Posez une question à votre Vendeuse..."
                    class="flex-1 px-3 py-2 text-sm border border-gray-200 rounded-xl focus:ring-2 focus:ring-rose-500 focus:border-rose-500 outline-none"
                    @keyup.enter="sendTestMessage()"
                    :disabled="testLoading"
                  />
                  <button
                    @click="sendTestMessage()"
                    :disabled="!testInput.trim() || testLoading"
                    class="w-9 h-9 bg-rose-500 rounded-xl flex items-center justify-center text-white hover:bg-rose-600 disabled:opacity-40 transition-all flex-shrink-0"
                  >
                    <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 19l9 2-9-18-9 18 9-2zm0 0v-8"/>
                    </svg>
                  </button>
                </div>
              </div>

              <!-- Navigation -->
              <div class="flex flex-col sm:flex-row items-center justify-between gap-3 pt-2">
                <p class="text-sm text-gray-400 italic">Elle apprendra encore mieux dans les prochains jours.</p>
                <button @click="nextSubStep" class="px-8 py-2.5 bg-rose-600 text-white font-semibold rounded-lg hover:bg-rose-700 transition-all whitespace-nowrap">
                  Installer sur ma boutique →
                </button>
              </div>

            </div>

          <!-- ===== SUB-STEP 7: Activation guidée ===== -->
            <div v-if="subStep === 7" class="space-y-8">

              <div class="text-center">
                <h1 class="text-2xl md:text-3xl font-bold text-gray-900 mb-2">
                  Une dernière étape.
                </h1>
                <p class="text-gray-500">
                  Installez {{ form.agentName || getDefaultAgentName() }} sur votre boutique pour qu'elle commence à vendre.
                </p>
              </div>

              <!-- CAS SHOPIFY -->
              <div v-if="form.platform === 'shopify'" class="space-y-5">
                <div class="border border-gray-200 rounded-2xl p-6 space-y-4">
                  <div class="flex items-center space-x-3">
                    <img :src="shopifyLogo" alt="Shopify" class="h-7 w-auto" />
                    <span class="font-semibold text-gray-900">Installation Shopify</span>
                  </div>
                  <p class="text-sm text-gray-500">
                    Copiez ce code et collez-le dans votre thème Shopify
                    (<strong>Online Store → Themes → Edit code → theme.liquid</strong>)
                    juste avant la balise <code class="bg-gray-100 px-1 rounded">&lt;/body&gt;</code>.
                  </p>
                  <div class="relative">
                    <div class="bg-gray-900 rounded-xl p-4 overflow-x-auto">
                      <pre class="text-xs text-green-400 font-mono whitespace-pre-wrap">{{ getWidgetSnippet() }}</pre>
                    </div>
                    <button
                      @click="copyWidgetSnippet"
                      class="absolute top-2 right-2 px-3 py-1 text-xs bg-white text-gray-700 rounded-lg border border-gray-200 hover:bg-gray-50 transition-all"
                    >
                      {{ snippetCopied ? '✓ Copié !' : 'Copier' }}
                    </button>
                  </div>
                </div>
              </div>

              <!-- CAS WOOCOMMERCE -->
              <div v-else-if="form.platform === 'woocommerce'" class="space-y-5">
                <div class="border border-gray-200 rounded-2xl p-6 space-y-4">
                  <div class="flex items-center space-x-3">
                    <img :src="woocommerceLogo" alt="WooCommerce" class="h-7 w-auto" />
                    <span class="font-semibold text-gray-900">Installation WooCommerce</span>
                  </div>
                  <p class="text-sm text-gray-500">
                    Copiez ce code et collez-le avant la balise <code class="bg-gray-100 px-1 rounded">&lt;/body&gt;</code>
                    de votre site, ou utilisez un plugin d'injection de scripts.
                  </p>
                  <div class="relative">
                    <div class="bg-gray-900 rounded-xl p-4 overflow-x-auto">
                      <pre class="text-xs text-green-400 font-mono whitespace-pre-wrap">{{ getWidgetSnippet() }}</pre>
                    </div>
                    <button
                      @click="copyWidgetSnippet"
                      class="absolute top-2 right-2 px-3 py-1 text-xs bg-white text-gray-700 rounded-lg border border-gray-200 hover:bg-gray-50 transition-all"
                    >
                      {{ snippetCopied ? '✓ Copié !' : 'Copier' }}
                    </button>
                  </div>
                </div>
              </div>

              <!-- CAS AUTRE PLATEFORME -->
              <div v-else class="space-y-5">
                <div class="border border-gray-200 rounded-2xl p-6 space-y-4">
                  <p class="font-semibold text-gray-900">Code à intégrer sur votre site</p>
                  <p class="text-sm text-gray-500">
                    Copiez ce code et collez-le avant la balise <code class="bg-gray-100 px-1 rounded">&lt;/body&gt;</code> de votre site.
                  </p>
                  <div class="relative">
                    <div class="bg-gray-900 rounded-xl p-4 overflow-x-auto">
                      <pre class="text-xs text-green-400 font-mono whitespace-pre-wrap">{{ getWidgetSnippet() }}</pre>
                    </div>
                    <button
                      @click="copyWidgetSnippet"
                      class="absolute top-2 right-2 px-3 py-1 text-xs bg-white text-gray-700 rounded-lg border border-gray-200 hover:bg-gray-50 transition-all"
                    >
                      {{ snippetCopied ? '✓ Copié !' : 'Copier' }}
                    </button>
                  </div>
                </div>
              </div>

              <!-- Lien "Plus tard" -->
              <div class="text-center">
                <button @click="goToDashboard" class="text-sm text-gray-400 hover:text-gray-600 transition-all underline">
                  Je le ferai plus tard → Aller au dashboard
                </button>
              </div>

              <!-- Bouton principal vers le dashboard -->
              <button @click="goToDashboard" class="w-full px-8 py-3 bg-gray-900 text-white font-semibold rounded-xl hover:bg-gray-800 transition-all">
                Terminer et aller au dashboard
              </button>

            </div>

          </div>
          </Transition>

        </div>
      </div>

    </div>
  </div>
</template>

<script setup lang="ts">
import { useSupabase } from '~~/composables/useSupabase'
import shopifyLogo from '~/assets/images/logos/shopify.svg'
import woocommerceLogo from '~/assets/images/logos/woocommerce.svg'
import { useAuthStore } from '~~/stores/auth'
import { useSyncStore } from '~~/stores/sync'

const auth = useAuth()
const authStore = useAuthStore()
const syncStore = useSyncStore()
const api = useApi()
const runtimeConfig = useRuntimeConfig()

definePageMeta({
  layout: false
})

// ========== STATE ==========
const subStep = ref(1)
const totalSubSteps = 7
const loading = ref(false)
const initializing = ref(true)
const submitError = ref('')

// Refs for step 6 (test immédiat)
const createdAgentId = ref(null as string | null)
const testMessages = ref([] as Array<{id: string, role: string, content: string}>)
const testInput = ref('')
const testLoading = ref(false)
const chatScrollRef = ref(null as HTMLElement | null)
const testConversationId = ref(null as string | null)

// Refs for step 7 (activation guidée)
const snippetCopied = ref(false)

// ========== FORM ==========
const form = reactive({
  company: '',
  website: '',
  beautyCategory: '',
  platform: '',
  communicationTone: '',
  agentName: '',
  newsletter: true,
  // Champs auto-déterminés (non demandés à l'utilisatrice)
  targetGender: 'both',
  specializedTarget: [] as string[],
  targetAgeRange: '26-35',
  priceRange: '',
  expertiseLevel: '',
  primaryGoals: ['conversions', 'upsell', 'support', 'education'] as string[],
  acquisitionSource: ''
})

// ========== OPTIONS ==========
const beautyCategories = [
  { value: 'skincare', icon: '🧴', label: 'Skincare & Soins visage' },
  { value: 'haircare', icon: '💇‍♀️', label: 'Soins capillaires' },
  { value: 'makeup', icon: '💄', label: 'Maquillage' },
  { value: 'fragrance', icon: '🌸', label: 'Parfums & Fragrances' },
  { value: 'bodycare', icon: '🧴', label: 'Soins du corps' },
  { value: 'natural', icon: '🌿', label: 'Cosmétiques naturels' },
  { value: 'multi', icon: '✨', label: 'Multi-categories' }
]

const platforms = [
  { value: 'shopify', label: 'Shopify', description: 'Import automatique de vos produits', logo: shopifyLogo, icon: '' },
  { value: 'woocommerce', label: 'WooCommerce', description: 'Import automatique de vos produits', logo: woocommerceLogo, icon: '' },
  { value: 'custom', label: 'Site personnalisé', description: 'Mia lira votre site pour apprendre', logo: null, icon: '⚙️' }
]

const communicationTones = [
  {
    value: 'friendly',
    icon: '😊',
    label: 'Chaleureuse & Proche',
    description: 'Comme une grande soeur qui conseille avec bienveillance',
    example: 'Salut ma belle ! Dis-moi ton type de peau, je vais te trouver le soin parfait pour toi.'
  },
  {
    value: 'professional',
    icon: '👩‍💼',
    label: 'Professionnelle & Experte',
    description: 'Approche experte beauté en institut',
    example: 'Bonjour Madame, je suis votre experte beauté. Comment puis-je vous accompagner aujourd\'hui ?'
  },
  {
    value: 'luxury',
    icon: '✨',
    label: 'Premium & Raffinee',
    description: 'Service VIP personnalisé, attention particulière',
    example: 'Bienvenue dans notre espace beauté. Je suis à votre entière disposition pour vous conseiller.'
  },
  {
    value: 'trendy',
    icon: '🌟',
    label: 'Moderne & Dynamique',
    description: 'Langage actuel, références aux tendances beauté',
    example: 'Hey ! Tu as vu ce serum dont tout le monde parle ? Je te dis tout sur ses bienfaits !'
  }
]

// ========== COMPUTED ==========
const canProceed = computed(() => {
  switch (subStep.value) {
    case 1: return form.company.trim() !== '' && form.website.trim() !== ''
    case 2: return form.beautyCategory !== ''
    case 3: return form.platform !== ''
    case 4: return form.communicationTone !== ''
    case 5: return true // agentName est optionnel
    case 6: return true // test immédiat — non bloquant
    case 7: return true // activation guidée — non bloquant
    default: return true
  }
})

// ========== HELPERS ==========
const selectTone = (value: string) => {
  form.communicationTone = value
  // Auto-set expertise based on tone for simplicity
  if (value === 'luxury') {
    form.expertiseLevel = 'luxury'
  } else if (value === 'professional') {
    form.expertiseLevel = 'expert'
  } else {
    form.expertiseLevel = 'beginner'
  }
}

const getDefaultAgentName = () => 'Mia'

const getBeautyCategoryLabel = (value: string) => {
  return beautyCategories.find(c => c.value === value)?.label || value
}

// ========== NAVIGATION ==========
const nextSubStep = async () => {
  if (!canProceed.value) return

  // After step 3 (platform selected) -> launch sync (non-blocking)
  if (subStep.value === 3) {
    launchStep1Sync().catch(err => console.warn('Sync error:', err))
  }

  if (subStep.value < totalSubSteps) {
    subStep.value++
  }
}

const prevSubStep = () => {
  if (subStep.value > 1) {
    subStep.value--
  }
}

// ========== SYNC BACKGROUND ==========
const launchStep1Sync = async () => {
  if (!form.website || syncStore.isSyncing || syncStore.isSyncComplete) return

  const user = authStore.user
  if (!user?.id) return

  try {
    const trialEndsAt = new Date()
    trialEndsAt.setDate(trialEndsAt.getDate() + 14)

    await api.shops.update(user.id, {
      name: form.company || undefined,
      domain: extractDomain(form.website),
      platform: form.platform,
      beauty_category: form.beautyCategory,
      subscription_plan: 'starter',
      trial_ends_at: trialEndsAt.toISOString()
    })
    console.log('✅ [Onboarding] Mini shop update OK')
  } catch (err) {
    console.warn('⚠️ [Onboarding] Mini shop update failed (non-blocking):', err)
  }

  syncStore.startSync({
    website: form.website,
    platform: form.platform,
    beautyCategory: form.beautyCategory,
    companyName: form.company
  })
}

// ========== UTILITIES ==========
const extractDomain = (url: string): string | null => {
  if (!url) return null
  try {
    const domain = new URL(url.startsWith('http') ? url : `https://${url}`).hostname
    return domain.replace('www.', '')
  } catch {
    return null
  }
}

// ========== AGENT CONFIG ==========
const getOptimizedAgentConfig = () => {
  const agentName = form.agentName || getDefaultAgentName()
  const specialties: Record<string, string> = {
    skincare: 'votre conseillère skincare',
    makeup: 'votre conseillère maquillage',
    fragrance: 'votre conseillère parfums',
    haircare: 'votre conseillère capillaire',
    bodycare: 'votre conseillère soins du corps',
    natural: 'votre conseillère cosmétiques naturels',
    multi: 'votre conseillère beauté'
  }
  const brandName = form.company || 'notre boutique'
  const specialty = specialties[form.beautyCategory] || specialties.multi
  const welcomeMessage = `Bonjour ! Je suis ${agentName}, ${specialty} chez ${brandName}. Comment puis-je vous aider ?`

  const fallbackMessages: Record<string, string> = {
    beginner: 'Je transmets votre question à notre équipe pour un conseil personnalisé.',
    expert: 'Je contacte notre experte senior pour une analyse approfondie de votre demande.',
    luxury: 'Je vous mets en relation avec notre consultante premium pour un accompagnement sur mesure.'
  }

  return {
    name: agentName,
    avatar: `https://ui-avatars.com/api/?name=${agentName}&background=E91E63&color=fff`,
    welcomeMessage,
    fallbackMessage: fallbackMessages[form.expertiseLevel] || fallbackMessages.expert,
    collectPaymentMethod: true,
    upsellEnabled: form.primaryGoals.includes('upsell'),
    beautySpecialization: {
      category: form.beautyCategory,
      targetGender: form.targetGender,
      expertiseLevel: form.expertiseLevel,
      communicationTone: form.communicationTone,
      specializedTarget: form.specializedTarget,
      targetAgeRange: form.targetAgeRange,
      priceRange: form.priceRange || syncStore.detectedPriceRange || 'mid',
      primaryGoals: form.primaryGoals
    }
  }
}

const getOptimizedWidgetConfig = () => {
  const colors: Record<string, string> = {
    skincare: '#4CAF50',
    makeup: '#E91E63',
    fragrance: '#9C27B0',
    haircare: '#FF9800',
    bodycare: '#03DAC5',
    natural: '#8BC34A',
    multi: '#E91E63'
  }
  const buttonTexts: Record<string, string> = {
    skincare: '✨ Conseil skincare',
    makeup: '💄 Conseil maquillage',
    fragrance: '🌸 Conseil parfum',
    haircare: '💇‍♀️ Conseil capillaire',
    bodycare: '🧴 Conseil soins corps',
    natural: '🌿 Conseil naturel',
    multi: '💝 Parler à ma vendeuse'
  }
  return {
    theme: 'modern',
    primaryColor: colors[form.beautyCategory] || colors.multi,
    position: 'bottom-right',
    buttonText: buttonTexts[form.beautyCategory] || buttonTexts.multi,
    language: 'fr',
    beautyBranding: true,
    showProductRecommendations: true,
    enableSkinTypeQuiz: form.beautyCategory === 'skincare' || form.beautyCategory === 'multi'
  }
}

// ========== COMPLETE ONBOARDING ==========
const completeOnboarding = async () => {
  loading.value = true
  submitError.value = ''

  try {
    console.log('🚀 [Onboarding] Finalisation...')

    if (!auth.isAuthenticated.value) {
      await navigateTo('/login')
      return
    }

    const user = authStore.user
    if (!user?.id) throw new Error('Donnees utilisateur manquantes')

    // Step 1: Update shop
    const shopData = {
      name: form.company || `Boutique de ${user.email?.split('@')[0]}`,
      domain: extractDomain(form.website),
      platform: form.platform,
      beauty_category: form.beautyCategory,
      target_gender: form.targetGender,
      specialized_target: form.specializedTarget,
      target_age_range: form.targetAgeRange,
      price_range: form.priceRange || syncStore.detectedPriceRange || 'mid',
      expertise_level: form.expertiseLevel,
      communication_tone: form.communicationTone,
      primary_goals: form.primaryGoals,
      acquisition_source: form.acquisitionSource,
      newsletter_subscribed: form.newsletter,
      onboarding_completed: true,
      onboarding_completed_at: new Date().toISOString(),
      widget_config: getOptimizedWidgetConfig()
    }

    const shopResponse = await api.shops.update(user.id, shopData)
    if (!shopResponse.success) throw new Error(shopResponse.error || 'Erreur mise à jour shop')
    console.log('✅ [Onboarding] Shop mis à jour')

    // Step 2: Create agent
    const beautyCategory = form.beautyCategory || 'multi'
    const agentType = `${beautyCategory}_expert`
    const validAgentTypes = ['skincare_expert', 'makeup_expert', 'fragrance_expert', 'haircare_expert', 'bodycare_expert', 'beauty_expert', 'natural_expert', 'multi_expert']
    const finalAgentType = validAgentTypes.includes(agentType) ? agentType : 'beauty_expert'

    const agentPersonality = form.communicationTone || 'friendly'
    const validPersonalities = ['professional', 'friendly', 'expert', 'casual', 'luxury', 'trendy']
    const finalPersonality = validPersonalities.includes(agentPersonality) ? agentPersonality : 'friendly'

    const agentConfig = getOptimizedAgentConfig()
    const agentData = {
      name: form.agentName || getDefaultAgentName(),
      type: finalAgentType,
      personality: finalPersonality,
      description: `Mia, vendeuse IA specialisee pour ${form.company}`,
      welcomeMessage: agentConfig.welcomeMessage,
      fallbackMessage: agentConfig.fallbackMessage,
      avatar: agentConfig.avatar,
      isActive: true,
      config: agentConfig.beautySpecialization,
      productRange: form.priceRange === 'luxury' ? 'premium' : 'accessible',
      customProductRange: form.priceRange === 'luxury' ? 'Premium' : '',
      shopName: form.company,
      productType: beautyCategory
    }

    const agentResponse = await api.agents.create(agentData)
    if (!agentResponse.success) {
      console.error('❌ [Onboarding] Agent creation error:', agentResponse)
      throw new Error(`Mia n'a pas pu démarrer : ${agentResponse.error || 'Erreur inconnue'}`)
    }
    console.log('✅ [Onboarding] Agent cree:', agentResponse.data?.id)

    // Step 3: Wait for sync
    if (syncStore.isSyncing) {
      console.log('⏳ [Onboarding] Waiting for sync...')
      await syncStore.waitForCompletion(20000)
    } else if (!syncStore.isSyncComplete && form.website) {
      syncStore.startSync({
        website: form.website,
        platform: form.platform,
        beautyCategory: form.beautyCategory,
        companyName: form.company
      })
      await syncStore.waitForCompletion(90000)
    }

    // Save diagnostic
    try {
      sessionStorage.setItem('chatseller_sync_diagnostic', JSON.stringify({
        productsStatus: syncStore.productsStatus,
        productsCount: syncStore.productsCount,
        kbStatus: syncStore.kbStatus,
        kbDocumentsCount: syncStore.kbDocumentsCount,
        completedAt: new Date().toISOString()
      }))
    } catch {}

    // Sync auth store
    if (authStore.user) {
      await authStore.restoreSession(true)
    }

    console.log('🎉 [Onboarding] Complete!')

    // Store agentId and advance to step 6 (test immédiat)
    createdAgentId.value = agentResponse.data?.id || null
    sessionStorage.setItem('chatseller_onboarding_just_completed', 'true')
    subStep.value = 6

  } catch (error: any) {
    console.error('❌ [Onboarding] Error:', error)
    let userMessage = 'Une erreur s\'est produite.'
    if (error.message?.includes('Token') || error.message?.includes('401')) {
      return navigateTo('/login')
    }
    submitError.value = userMessage + (error.message ? ` (${error.message})` : '')
  } finally {
    loading.value = false
  }
}

// ========== STEP 6: TEST IMMÉDIAT ==========

// Scroll automatique vers le bas du chat
const scrollChatToBottom = () => {
  nextTick(() => {
    if (chatScrollRef.value) {
      chatScrollRef.value.scrollTop = chatScrollRef.value.scrollHeight
    }
  })
}

// Message de bienvenue affiché dans le chat de test
/** Format AI message: convert **bold**, newlines, and basic markdown to HTML */
const formatAiMessage = (content: string): string => {
  if (!content) return ''
  return content
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/\*\*(.*?)\*\*/g, '<strong>$1</strong>')
    .replace(/\n\n/g, '<br><br>')
    .replace(/\n/g, '<br>')
}

const getWelcomeMessage = () => {
  const name = form.agentName || getDefaultAgentName()
  const specialties: Record<string, string> = {
    skincare: 'experte skincare',
    makeup: 'experte maquillage',
    fragrance: 'experte parfums',
    haircare: 'experte capillaire',
    bodycare: 'experte soins du corps',
    natural: 'experte cosmétiques naturels',
    multi: 'conseillère beauté'
  }
  const specialty = specialties[form.beautyCategory] || specialties.multi
  return `Bonjour ! Je suis ${name}, votre ${specialty} chez ${form.company || 'votre boutique'}. Comment puis-je vous aider ?`
}

// Suggestions de questions selon la catégorie
const getTestSuggestions = (): string[] => {
  const suggestions: Record<string, string[]> = {
    skincare: ["C'est pour quel type de peau ?", "Pour les taches, vous avez quoi ?", "Quel est le prix ?"],
    haircare: ["Vous avez quoi pour cheveux 4C ?", "Comment l'utiliser ?", "C'est naturel ?"],
    makeup: ["Vous avez du fond de teint pour peaux foncées ?", "Ça tient combien de temps ?", "C'est waterproof ?"],
    fragrance: ["C'est quoi les notes ?", "Ça sent fort ?", "Combien ça coûte ?"],
    bodycare: ["C'est hydratant ?", "Pour les vergetures vous avez quoi ?", "C'est à base de karité ?"],
    natural: ["C'est 100% naturel ?", "Vous avez du karité pur ?", "Livraison en combien de temps ?"],
    multi: ["Vous avez quoi pour le visage ?", "Quel est votre best-seller ?", "Vous livrez où ?"]
  }
  return suggestions[form.beautyCategory] || suggestions.multi
}

// Envoyer un message de test à la Vendeuse IA
const sendTestMessage = async (message?: string) => {
  const text = message || testInput.value
  if (!text.trim() || testLoading.value) return

  // Ajouter le message utilisateur
  testMessages.value.push({ id: Date.now().toString(), role: 'user', content: text })
  testInput.value = ''
  testLoading.value = true
  scrollChatToBottom()

  try {
    const baseURL = runtimeConfig.public.apiBaseUrl || 'https://chatseller-api-production.up.railway.app'
    const shopId = authStore.user?.id

    // Si pas encore de conversationId, init d'abord
    if (!testConversationId.value) {
      console.log('🔍 [Test Chat] Initialisation conversation...')
      const initResponse = await $fetch('/api/v1/public/chat', {
        method: 'POST',
        baseURL,
        body: {
          shopId,
          message: 'init',
          isFirstMessage: true
        }
      }) as any

      if (initResponse?.success && initResponse?.data?.conversationId) {
        testConversationId.value = initResponse.data.conversationId
        console.log('✅ [Test Chat] Conversation créée:', testConversationId.value)
      }
    }

    // Envoyer le message
    const response = await $fetch('/api/v1/public/chat', {
      method: 'POST',
      baseURL,
      body: {
        shopId,
        message: text,
        conversationId: testConversationId.value,
        isFirstMessage: false
      }
    }) as any

    if (response?.success && response?.data) {
      // Sauvegarder le conversationId si retourné
      if (response.data.conversationId && !testConversationId.value) {
        testConversationId.value = response.data.conversationId
      }

      testMessages.value.push({
        id: (Date.now() + 1).toString(),
        role: 'assistant',
        content: response.data.message || response.data.content || 'Je suis prête à vous aider !'
      })
    } else {
      testMessages.value.push({
        id: (Date.now() + 1).toString(),
        role: 'assistant',
        content: "Je suis en train de finir de me préparer. Revenez dans quelques instants !"
      })
    }
  } catch (err) {
    console.warn('[Test chat] Erreur:', err)
    testMessages.value.push({
      id: (Date.now() + 1).toString(),
      role: 'assistant',
      content: "Je finalise ma formation. Vous pourrez me tester dans le Playground du dashboard !"
    })
  } finally {
    testLoading.value = false
    scrollChatToBottom()
  }
}

// ========== STEP 7: ACTIVATION GUIDÉE ==========

// Snippet d'intégration du widget
const getWidgetSnippet = (): string => {
  const shopId = authStore.user?.id || 'YOUR_SHOP_ID'
  const baseURL = runtimeConfig.public.apiBaseUrl || 'https://chatseller-api-production.up.railway.app'
  return `<!-- ChatSeller Widget -->
<script>
(function() {
  window.ChatSellerConfig = {
    shopId: '${shopId}',
    apiUrl: '${baseURL}'
  };
  var s = document.createElement('script');
  s.src = 'https://widget.chatseller.app/embed.js';
  s.async = true;
  document.body.appendChild(s);
})();
<\/script>`
}

// Copier le snippet dans le presse-papier
const copyWidgetSnippet = async () => {
  try {
    await navigator.clipboard.writeText(getWidgetSnippet())
    snippetCopied.value = true
    setTimeout(() => { snippetCopied.value = false }, 2000)
  } catch {
    // Fallback pour navigateurs sans clipboard API
    const el = document.createElement('textarea')
    el.value = getWidgetSnippet()
    document.body.appendChild(el)
    el.select()
    document.execCommand('copy')
    document.body.removeChild(el)
    snippetCopied.value = true
    setTimeout(() => { snippetCopied.value = false }, 2000)
  }
}

// Redirection finale vers le dashboard
const goToDashboard = () => {
  return navigateTo(
    `/?onboarding=completed&beauty=true&agent_created=true&category=${form.beautyCategory}&welcome=true`,
    { replace: true }
  )
}

// ========== INIT ==========
onMounted(async () => {
  try {
    if (!auth.isAuthenticated.value) {
      await navigateTo('/login')
      return
    }

    const supabase = useSupabase()
    const { data: { user } } = await supabase.auth.getUser()

    if (!user || !user.email_confirmed_at) {
      await navigateTo('/register')
      return
    }

    if (user.user_metadata?.company) {
      form.company = user.user_metadata.company
    }

    console.log('✅ [Onboarding] Init for:', user.email)
  } catch (error) {
    console.error('❌ [Onboarding] Init error:', error)
    await navigateTo('/login')
  } finally {
    initializing.value = false
  }
})

useHead({
  title: 'Recruter Mia — ChatSeller',
  meta: [
    { name: 'description', content: 'Accueillez Mia dans votre boutique en ligne en 3 minutes.' }
  ]
})
</script>

<style scoped>
/* ✅ Opacity-only transition: évite le flash causé par translateX
   (les 7 <Transition> s'animent en parallèle, pas en séquence) */
.slide-enter-active {
  transition: opacity 0.15s ease;
}
.slide-leave-active {
  transition: opacity 0.1s ease;
}
.slide-enter-from {
  opacity: 0;
}
.slide-leave-to {
  opacity: 0;
}
.ai-message-content :deep(strong) {
  font-weight: 600;
  color: #1f2937;
}
</style>
