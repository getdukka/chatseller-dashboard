<!-- pages/onboarding.vue -->
<!-- Progressive onboarding: one question per screen, ElevenLabs-style -->
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
        <div class="w-full max-w-lg">

          <!-- ===== SUB-STEP 1: Brand name + website ===== -->
          <Transition name="slide" mode="out-in">
            <div v-if="subStep === 1" key="s1" class="space-y-8">
              <div class="text-center">
                <h1 class="text-2xl md:text-3xl font-bold text-gray-900 mb-2">Parlez-nous de votre marque</h1>
                <p class="text-gray-500">Mia a besoin de connaitre votre marque pour bien la representer.</p>
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
          </Transition>

          <!-- ===== SUB-STEP 2: Beauty category ===== -->
          <Transition name="slide" mode="out-in">
            <div v-if="subStep === 2" key="s2" class="space-y-8">
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
          </Transition>

          <!-- ===== SUB-STEP 3: Platform ===== -->
          <Transition name="slide" mode="out-in">
            <div v-if="subStep === 3" key="s3" class="space-y-8">
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
          </Transition>

          <!-- ===== SUB-STEP 4: Client gender ===== -->
          <Transition name="slide" mode="out-in">
            <div v-if="subStep === 4" key="s4" class="space-y-8">
              <div class="text-center">
                <h1 class="text-2xl md:text-3xl font-bold text-gray-900 mb-2">A qui vendez-vous ?</h1>
                <p class="text-gray-500">Mia adaptera son approche en fonction de votre clientele.</p>
              </div>

              <div class="space-y-3">
                <button
                  v-for="gender in genderOptions"
                  :key="gender.value"
                  type="button"
                  @click="form.targetGender = gender.value"
                  class="w-full flex items-center p-5 border-2 rounded-xl transition-all hover:border-rose-300"
                  :class="form.targetGender === gender.value ? 'border-rose-500 bg-rose-50' : 'border-gray-200 bg-white'"
                >
                  <span class="text-3xl mr-4">{{ gender.icon }}</span>
                  <span class="font-semibold text-gray-900 text-lg">{{ gender.label }}</span>
                  <div v-if="form.targetGender === gender.value" class="ml-auto w-5 h-5 bg-rose-500 rounded-full flex items-center justify-center flex-shrink-0">
                    <svg class="w-3 h-3 text-white" fill="currentColor" viewBox="0 0 20 20"><path fill-rule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clip-rule="evenodd"/></svg>
                  </div>
                </button>
              </div>

              <div class="flex items-center justify-between pt-2">
                <button @click="prevSubStep" class="px-5 py-2.5 text-gray-600 font-medium rounded-lg hover:bg-gray-100 transition-all">Retour</button>
                <button @click="nextSubStep" :disabled="!canProceed" class="px-8 py-2.5 bg-rose-600 text-white font-semibold rounded-lg hover:bg-rose-700 transition-all disabled:opacity-40 disabled:cursor-not-allowed">Continuer</button>
              </div>
            </div>
          </Transition>

          <!-- ===== SUB-STEP 5: Specialized targets ===== -->
          <Transition name="slide" mode="out-in">
            <div v-if="subStep === 5" key="s5" class="space-y-8">
              <div class="text-center">
                <h1 class="text-2xl md:text-3xl font-bold text-gray-900 mb-2">{{ getSpecializedQuestion() }}</h1>
                <p class="text-gray-500">Selectionnez un ou plusieurs choix.</p>
              </div>

              <div class="grid grid-cols-2 gap-3">
                <button
                  v-for="option in getSpecializedOptions()"
                  :key="option.value"
                  type="button"
                  @click="toggleSpecializedTarget(option.value)"
                  class="relative p-4 border-2 rounded-xl text-left transition-all hover:border-rose-300 hover:bg-rose-50/50"
                  :class="form.specializedTarget.includes(option.value) ? 'border-rose-500 bg-rose-50 shadow-sm' : 'border-gray-200 bg-white'"
                >
                  <div class="text-xl mb-1">{{ option.icon }}</div>
                  <div class="font-semibold text-gray-900 text-sm">{{ option.label }}</div>
                  <div class="text-xs text-gray-500 mt-0.5">{{ option.description }}</div>
                  <div v-if="form.specializedTarget.includes(option.value)" class="absolute top-2.5 right-2.5 w-5 h-5 bg-rose-500 rounded-full flex items-center justify-center">
                    <svg class="w-3 h-3 text-white" fill="currentColor" viewBox="0 0 20 20"><path fill-rule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clip-rule="evenodd"/></svg>
                  </div>
                </button>
              </div>

              <div class="flex items-center justify-between pt-2">
                <button @click="prevSubStep" class="px-5 py-2.5 text-gray-600 font-medium rounded-lg hover:bg-gray-100 transition-all">Retour</button>
                <div class="flex items-center space-x-3">
                  <button @click="skipSubStep" class="px-5 py-2.5 text-gray-400 font-medium rounded-lg hover:bg-gray-50 hover:text-gray-600 transition-all">Passer</button>
                  <button @click="nextSubStep" class="px-8 py-2.5 bg-rose-600 text-white font-semibold rounded-lg hover:bg-rose-700 transition-all">Continuer</button>
                </div>
              </div>
            </div>
          </Transition>

          <!-- ===== SUB-STEP 6: Age range ===== -->
          <Transition name="slide" mode="out-in">
            <div v-if="subStep === 6" key="s6" class="space-y-8">
              <div class="text-center">
                <h1 class="text-2xl md:text-3xl font-bold text-gray-900 mb-2">Quel age ont vos clients ?</h1>
                <p class="text-gray-500">Mia adaptera son vocabulaire et ses recommandations.</p>
              </div>

              <div class="space-y-3">
                <button
                  v-for="age in ageRanges"
                  :key="age.value"
                  type="button"
                  @click="form.targetAgeRange = age.value"
                  class="w-full flex items-center justify-between p-4 border-2 rounded-xl transition-all hover:border-rose-300"
                  :class="form.targetAgeRange === age.value ? 'border-rose-500 bg-rose-50' : 'border-gray-200 bg-white'"
                >
                  <div>
                    <div class="font-semibold text-gray-900">{{ age.label }}</div>
                    <div class="text-sm text-gray-500">{{ age.description }}</div>
                  </div>
                  <div v-if="form.targetAgeRange === age.value" class="w-5 h-5 bg-rose-500 rounded-full flex items-center justify-center flex-shrink-0">
                    <svg class="w-3 h-3 text-white" fill="currentColor" viewBox="0 0 20 20"><path fill-rule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clip-rule="evenodd"/></svg>
                  </div>
                </button>
              </div>

              <div class="flex items-center justify-between pt-2">
                <button @click="prevSubStep" class="px-5 py-2.5 text-gray-600 font-medium rounded-lg hover:bg-gray-100 transition-all">Retour</button>
                <button @click="nextSubStep" :disabled="!canProceed" class="px-8 py-2.5 bg-rose-600 text-white font-semibold rounded-lg hover:bg-rose-700 transition-all disabled:opacity-40 disabled:cursor-not-allowed">Continuer</button>
              </div>
            </div>
          </Transition>

          <!-- ===== SUB-STEP 7: Price range ===== -->
          <Transition name="slide" mode="out-in">
            <div v-if="subStep === 7" key="s7" class="space-y-8">
              <div class="text-center">
                <h1 class="text-2xl md:text-3xl font-bold text-gray-900 mb-2">Quelle est votre gamme de prix ?</h1>
                <p class="text-gray-500">Mia saura comment positionner vos produits.</p>
              </div>

              <!-- Sync indicator -->
              <div v-if="syncStore.detectedPriceRange && !form.priceRange" class="flex items-center justify-center px-4 py-2 bg-green-50 border border-green-200 rounded-full text-sm text-green-700">
                <svg class="w-4 h-4 mr-2 text-green-500" fill="currentColor" viewBox="0 0 24 24"><path d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z"/></svg>
                Gamme detectee depuis votre catalogue
              </div>

              <div class="space-y-3">
                <button
                  v-for="price in priceRanges"
                  :key="price.value"
                  type="button"
                  @click="form.priceRange = price.value"
                  class="w-full flex items-center p-5 border-2 rounded-xl transition-all hover:border-rose-300"
                  :class="form.priceRange === price.value ? 'border-rose-500 bg-rose-50' : 'border-gray-200 bg-white'"
                >
                  <span class="text-2xl mr-4">{{ price.icon }}</span>
                  <div class="text-left">
                    <div class="font-semibold text-gray-900">{{ price.label }}</div>
                    <div class="text-sm text-gray-500">{{ price.description }}</div>
                  </div>
                  <div v-if="form.priceRange === price.value" class="ml-auto w-5 h-5 bg-rose-500 rounded-full flex items-center justify-center flex-shrink-0">
                    <svg class="w-3 h-3 text-white" fill="currentColor" viewBox="0 0 20 20"><path fill-rule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clip-rule="evenodd"/></svg>
                  </div>
                </button>
              </div>

              <div class="flex items-center justify-between pt-2">
                <button @click="prevSubStep" class="px-5 py-2.5 text-gray-600 font-medium rounded-lg hover:bg-gray-100 transition-all">Retour</button>
                <button @click="nextSubStep" :disabled="!canProceed" class="px-8 py-2.5 bg-rose-600 text-white font-semibold rounded-lg hover:bg-rose-700 transition-all disabled:opacity-40 disabled:cursor-not-allowed">Continuer</button>
              </div>
            </div>
          </Transition>

          <!-- ===== SUB-STEP 8: Communication tone ===== -->
          <Transition name="slide" mode="out-in">
            <div v-if="subStep === 8" key="s8" class="space-y-8">
              <div class="text-center">
                <h1 class="text-2xl md:text-3xl font-bold text-gray-900 mb-2">Comment Mia doit-elle parler ?</h1>
                <p class="text-gray-500">Son ton s'adaptera a votre marque.</p>
              </div>

              <div class="space-y-3">
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
          </Transition>

          <!-- ===== SUB-STEP 9: Agent name + finalization ===== -->
          <Transition name="slide" mode="out-in">
            <div v-if="subStep === 9" key="s9" class="space-y-8">
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
                  <template v-if="syncStore.isSyncComplete && syncStore.hasAnySuccess">Votre vendeuse est prete !</template>
                  <template v-else-if="syncStore.isSyncing">Encore quelques secondes...</template>
                  <template v-else>Derniere etape</template>
                </h1>
                <p class="text-gray-500">Donnez un prenom a votre vendeuse IA.</p>
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

                <!-- Acquisition source -->
                <div>
                  <label class="block text-sm font-medium text-gray-700 mb-1.5">Comment avez-vous connu ChatSeller ? <span class="text-gray-400 font-normal">(optionnel)</span></label>
                  <select
                    v-model="form.acquisitionSource"
                    class="w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-rose-500 focus:border-rose-500 text-gray-900 transition-all"
                  >
                    <option value="">Selectionnez</option>
                    <option value="search_google">Recherche Google</option>
                    <option value="social_media">Reseaux sociaux</option>
                    <option value="recommendation">Recommandation</option>
                    <option value="whatsapp_group">Groupe WhatsApp / Telegram</option>
                    <option value="youtube">YouTube</option>
                    <option value="beauty_event">Salon beaute / evenement</option>
                    <option value="dukka">Deja client(e) Dukka</option>
                    <option value="other">Autre</option>
                  </select>
                </div>

                <!-- Trial reminder -->
                <div class="flex items-start space-x-3 bg-green-50 border border-green-200 rounded-xl p-4">
                  <svg class="w-5 h-5 text-green-600 mt-0.5 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z"/></svg>
                  <div>
                    <p class="font-semibold text-green-800 text-sm">14 jours d'essai gratuit</p>
                    <p class="text-green-700 text-xs mt-0.5">Sans engagement, sans carte bancaire.</p>
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
                      Creation...
                    </span>
                    <span v-else>Lancer {{ form.agentName || getDefaultAgentName() }}</span>
                  </button>
                </div>
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

definePageMeta({
  layout: false
})

// ========== STATE ==========
const subStep = ref(1)
const totalSubSteps = 9
const loading = ref(false)
const initializing = ref(true)
const submitError = ref('')

// ========== FORM ==========
const form = reactive({
  company: '',
  website: '',
  beautyCategory: '',
  platform: '',
  targetGender: '',
  specializedTarget: [] as string[],
  targetAgeRange: '',
  priceRange: '',
  expertiseLevel: '',
  communicationTone: '',
  primaryGoals: ['conversions', 'upsell', 'support', 'education'] as string[],
  agentName: '',
  acquisitionSource: '',
  newsletter: true
})

// ========== OPTIONS ==========
const beautyCategories = [
  { value: 'skincare', icon: '🧴', label: 'Skincare & Soins visage' },
  { value: 'haircare', icon: '💇‍♀️', label: 'Soins capillaires' },
  { value: 'makeup', icon: '💄', label: 'Maquillage' },
  { value: 'fragrance', icon: '🌸', label: 'Parfums & Fragrances' },
  { value: 'bodycare', icon: '🧴', label: 'Soins du corps' },
  { value: 'natural', icon: '🌿', label: 'Cosmetiques naturels' },
  { value: 'multi', icon: '✨', label: 'Multi-categories' }
]

const platforms = [
  { value: 'shopify', label: 'Shopify', description: 'Import automatique de vos produits', logo: shopifyLogo, icon: '' },
  { value: 'woocommerce', label: 'WooCommerce', description: 'Import automatique de vos produits', logo: woocommerceLogo, icon: '' },
  { value: 'custom', label: 'Site personnalise', description: 'Mia lira votre site pour apprendre', logo: null, icon: '⚙️' }
]

const genderOptions = [
  { value: 'women', icon: '👩', label: 'Des Femmes' },
  { value: 'men', icon: '👨', label: 'Des Hommes' },
  { value: 'both', icon: '👥', label: 'Hommes & Femmes' }
]

const ageRanges = [
  { value: '18-25', label: '18-25 ans', description: 'Jeunes adultes' },
  { value: '26-35', label: '26-35 ans', description: 'Adultes actives' },
  { value: '36-45', label: '36-45 ans', description: 'Adultes etablies' },
  { value: '46+', label: '46+ ans', description: 'Adultes matures' }
]

const priceRanges = [
  { value: 'budget', icon: '💝', label: 'Accessible', description: '5-25 EUR par produit' },
  { value: 'mid', icon: '💎', label: 'Milieu de gamme', description: '25-80 EUR par produit' },
  { value: 'luxury', icon: '👑', label: 'Premium', description: '80 EUR+ par produit' }
]

const expertiseLevels = [
  { value: 'beginner', icon: '🌱', label: 'Accessible', description: 'Conseils simples et bienveillants' },
  { value: 'expert', icon: '🎓', label: 'Experte', description: 'Conseils techniques personnalises' },
  { value: 'luxury', icon: '💎', label: 'Premium', description: 'Service haut de gamme' }
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
    description: 'Approche experte beaute en institut',
    example: 'Bonjour Madame, je suis votre experte beaute. Comment puis-je vous accompagner aujourd\'hui ?'
  },
  {
    value: 'luxury',
    icon: '✨',
    label: 'Premium & Raffinee',
    description: 'Service VIP personnalise, attention particuliere',
    example: 'Bienvenue dans notre espace beaute. Je suis a votre entiere disposition pour vous conseiller.'
  },
  {
    value: 'trendy',
    icon: '🌟',
    label: 'Moderne & Dynamique',
    description: 'Langage actuel, references aux tendances beaute',
    example: 'Hey ! Tu as vu ce serum dont tout le monde parle ? Je te dis tout sur ses bienfaits !'
  }
]

const primaryGoals = [
  { value: 'conversions', icon: '📈', label: 'Maximiser les ventes', description: 'Transformer les visiteurs en acheteurs' },
  { value: 'upsell', icon: '🛍️', label: 'Augmenter le panier moyen', description: 'Proposer des routines completes' },
  { value: 'support', icon: '💬', label: 'Reduire les questions repetitives', description: 'Repondre automatiquement aux FAQ' },
  { value: 'education', icon: '🎓', label: 'Eduquer et fideliser', description: 'Construire la confiance' }
]

const specializedTargetOptions: Record<string, Array<{value: string, icon: string, label: string, description: string}>> = {
  skincare: [
    { value: 'normal', icon: '😊', label: 'Peau normale', description: 'Equilibree' },
    { value: 'dry', icon: '💧', label: 'Peau seche', description: 'Manque d\'hydratation' },
    { value: 'oily', icon: '✨', label: 'Peau grasse', description: 'Exces de sebum' },
    { value: 'combination', icon: '🤔', label: 'Peau mixte', description: 'Zone T grasse' },
    { value: 'sensitive', icon: '🌸', label: 'Peau sensible', description: 'Reactive' },
    { value: 'hyperpigmentation', icon: '🎯', label: 'Teint irregulier', description: 'Taches' }
  ],
  haircare: [
    { value: 'natural_4c', icon: '🔄', label: 'Cheveux crepus 4C', description: 'Texture serree' },
    { value: 'natural_4b', icon: '🌀', label: 'Cheveux crepus 4A/4B', description: 'Boucles en Z' },
    { value: 'curly', icon: '➰', label: 'Cheveux boucles 3A-3C', description: 'Boucles definies' },
    { value: 'relaxed', icon: '📏', label: 'Cheveux defrises', description: 'Traites chimiquement' },
    { value: 'transitioning', icon: '🔀', label: 'En transition', description: 'Retour au naturel' },
    { value: 'protective', icon: '🛡️', label: 'Coiffures protectrices', description: 'Tresses, locks' }
  ],
  makeup: [
    { value: 'natural', icon: '🌱', label: 'Look naturel', description: 'Maquillage discret' },
    { value: 'professional', icon: '👔', label: 'Look professionnel', description: 'Bureau, reunions' },
    { value: 'evening', icon: '🌙', label: 'Look soiree', description: 'Evenements' },
    { value: 'bridal', icon: '👰', label: 'Look mariage', description: 'Ceremonies' },
    { value: 'deep_skin', icon: '👑', label: 'Peaux foncees', description: 'Teintes profondes' },
    { value: 'editorial', icon: '📸', label: 'Look creatif', description: 'Artistique' }
  ],
  fragrance: [
    { value: 'floral', icon: '🌸', label: 'Floral', description: 'Rose, jasmin, pivoine' },
    { value: 'woody', icon: '🌲', label: 'Boise', description: 'Santal, cedre, oud' },
    { value: 'oriental', icon: '🏺', label: 'Oriental', description: 'Vanille, ambre' },
    { value: 'fresh', icon: '🍃', label: 'Frais', description: 'Agrumes, aquatique' },
    { value: 'musk', icon: '💫', label: 'Musc', description: 'Encens, musc blanc' },
    { value: 'gourmand', icon: '🍰', label: 'Gourmand', description: 'Chocolat, caramel' }
  ],
  bodycare: [
    { value: 'hydrating', icon: '💧', label: 'Hydratation intense', description: 'Peaux seches' },
    { value: 'shea_butter', icon: '🧈', label: 'Karite & beurres', description: 'Soins traditionnels' },
    { value: 'brightening', icon: '✨', label: 'Teint unifie', description: 'Eclat, anti-taches' },
    { value: 'exfoliating', icon: '🧽', label: 'Exfoliation', description: 'Gommages' },
    { value: 'stretch_marks', icon: '🎯', label: 'Vergetures', description: 'Prevention' },
    { value: 'sun', icon: '☀️', label: 'Protection solaire', description: 'SPF peaux foncees' }
  ],
  natural: [
    { value: 'shea', icon: '🧈', label: 'Karite pur', description: 'Beurre brut' },
    { value: 'baobab', icon: '🌳', label: 'Baobab', description: 'Huile et poudre' },
    { value: 'moringa', icon: '🌿', label: 'Moringa', description: 'Huile et extraits' },
    { value: 'black_soap', icon: '🧼', label: 'Savon noir', description: 'Savon africain' },
    { value: 'argan', icon: '🫒', label: 'Argan', description: 'Huile d\'argan' },
    { value: 'neem', icon: '🌱', label: 'Neem', description: 'Soins purifiants' }
  ],
  multi: [
    { value: 'skincare', icon: '🧴', label: 'Soins visage', description: 'Routine skincare' },
    { value: 'makeup', icon: '💄', label: 'Maquillage', description: 'Cosmetiques couleur' },
    { value: 'haircare', icon: '💇‍♀️', label: 'Soins cheveux', description: 'Capillaires' },
    { value: 'fragrance', icon: '🌸', label: 'Parfums', description: 'Fragrances' },
    { value: 'bodycare', icon: '🧴', label: 'Soins corps', description: 'Hydratation' },
    { value: 'natural', icon: '🌿', label: 'Cosmetiques naturels', description: 'Bio & naturels' }
  ]
}

// ========== COMPUTED ==========
const canProceed = computed(() => {
  switch (subStep.value) {
    case 1: return form.company.trim() !== '' && form.website.trim() !== ''
    case 2: return form.beautyCategory !== ''
    case 3: return form.platform !== ''
    case 4: return form.targetGender !== ''
    case 5: return true // optional multi-select
    case 6: return form.targetAgeRange !== ''
    case 7: return form.priceRange !== ''
    case 8: return form.communicationTone !== ''
    case 9: return true
    default: return true
  }
})

// ========== HELPERS ==========
const getSpecializedQuestion = () => {
  const questions: Record<string, string> = {
    skincare: 'Quels types de peau traitez-vous ?',
    haircare: 'Quels types de cheveux traitez-vous ?',
    makeup: 'Quels styles de maquillage proposez-vous ?',
    fragrance: 'Quelles familles olfactives proposez-vous ?',
    bodycare: 'Quels types de soins corporels proposez-vous ?',
    natural: 'Quels ingredients naturels proposez-vous ?',
    multi: 'Quels domaines beaute couvrez-vous ?'
  }
  return questions[form.beautyCategory] || questions.multi
}

const getSpecializedOptions = () => {
  return specializedTargetOptions[form.beautyCategory] || specializedTargetOptions.multi
}

const toggleSpecializedTarget = (value: string) => {
  const idx = form.specializedTarget.indexOf(value)
  if (idx >= 0) {
    form.specializedTarget.splice(idx, 1)
  } else {
    form.specializedTarget.push(value)
  }
}

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

const getCommunicationToneLabel = (value: string) => {
  return communicationTones.find(t => t.value === value)?.label || value
}

const getPlatformLabel = (value: string) => {
  return platforms.find(p => p.value === value)?.label || value
}

// ========== NAVIGATION ==========
const nextSubStep = async () => {
  if (!canProceed.value) return

  // After step 3 (platform selected) -> launch sync
  if (subStep.value === 3) {
    await launchStep1Sync()
  }

  // Pre-fill price range when arriving at step 7
  if (subStep.value === 6) {
    prefillPriceRange()
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

const skipSubStep = () => {
  if (subStep.value < totalSubSteps) {
    subStep.value++
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

const prefillPriceRange = () => {
  if (syncStore.detectedPriceRange && !form.priceRange) {
    form.priceRange = syncStore.detectedPriceRange
  }
}

watch(() => syncStore.detectedPriceRange, (newRange) => {
  if (newRange && subStep.value <= 7 && !form.priceRange) {
    form.priceRange = newRange
  }
})

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
    skincare: 'votre conseillere skincare',
    makeup: 'votre conseillere maquillage',
    fragrance: 'votre conseillere parfums',
    haircare: 'votre conseillere capillaire',
    bodycare: 'votre conseillere soins du corps',
    natural: 'votre conseillere cosmetiques naturels',
    multi: 'votre conseillere beaute'
  }
  const brandName = form.company || 'notre boutique'
  const specialty = specialties[form.beautyCategory] || specialties.multi
  const welcomeMessage = `Bonjour ! Je suis ${agentName}, ${specialty} chez ${brandName}. Comment puis-je vous aider ?`

  const fallbackMessages: Record<string, string> = {
    beginner: 'Je transmets votre question a notre equipe pour un conseil personnalise.',
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
      priceRange: form.priceRange,
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
    multi: '💝 Parler a ma vendeuse'
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
      price_range: form.priceRange,
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
    if (!shopResponse.success) throw new Error(shopResponse.error || 'Erreur mise a jour shop')
    console.log('✅ [Onboarding] Shop mis a jour')

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
      throw new Error(`Mia n'a pas pu demarrer : ${agentResponse.error || 'Erreur inconnue'}`)
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
    sessionStorage.setItem('chatseller_onboarding_just_completed', 'true')

    return navigateTo(`/?onboarding=completed&beauty=true&agent_created=true&category=${form.beautyCategory}&welcome=true`, { replace: true })

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
.slide-enter-active,
.slide-leave-active {
  transition: all 0.25s ease;
}
.slide-enter-from {
  opacity: 0;
  transform: translateX(30px);
}
.slide-leave-to {
  opacity: 0;
  transform: translateX(-30px);
}
</style>
