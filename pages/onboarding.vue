<!-- pages/onboarding.vue -->
<template>
  <div class="min-h-screen bg-gradient-to-br from-rose-50 via-pink-50 to-purple-50 relative overflow-hidden">
    
    <!-- Background Elements Premium -->
    <div class="absolute inset-0 overflow-hidden pointer-events-none">
      <div class="absolute inset-0 bg-gradient-to-br from-rose-50/80 via-pink-50/60 to-purple-50/80 animate-gradient-xy"></div>
      <div class="absolute top-20 left-10 w-96 h-96 bg-gradient-to-br from-rose-300/20 to-pink-300/10 rounded-full blur-3xl animate-pulse"></div>
      <div class="absolute bottom-20 right-10 w-80 h-80 bg-gradient-to-br from-purple-300/20 to-rose-300/10 rounded-full blur-3xl animate-pulse" style="animation-delay: 1s"></div>
      <div class="absolute top-1/3 right-1/4 w-32 h-32 bg-gradient-to-br from-pink-400/15 to-rose-400/10 rounded-full blur-2xl animate-bounce" style="animation-delay: 2s"></div>
    </div>
    
    <!-- Header -->
    <header class="relative z-10 p-6">
      <div class="flex items-center justify-between">
        <div class="flex items-center space-x-3">
          <div class="relative">
            <div class="flex h-12 w-12 items-center justify-center bg-transparent">
              <img src="/assets/images/logos/fav.svg" alt="ChatSeller" class="w-10 h-10" />
            </div>
            <div class="absolute inset-0 rounded-2xl bg-gradient-to-tr from-white/20 to-transparent"></div>
          </div>
          <div>
            <span class="text-2xl font-bold text-black">ChatSeller</span><span class="text-2xl font-bold text-rose-600">.</span>
            <div class="text-sm font-medium text-rose-400">by Dukka</div>
          </div>
        </div>
        
        <div v-if="!initializing" class="hidden md:block text-right">
          <p class="text-rose-600 text-sm font-medium">Mia rejoint votre boutique</p>
          <p class="text-gray-800 font-semibold">{{ userFirstName }}, Mia est prête à commencer !</p>
        </div>
      </div>
    </header>

    <!-- Message d'initialisation -->
    <div v-if="initializing" class="relative z-10 flex items-center justify-center min-h-[60vh]">
      <div class="bg-white/80 backdrop-blur-sm border border-rose-200 rounded-2xl p-10 text-center max-w-md shadow-2xl">
        <div class="flex justify-center mb-6">
          <div class="w-16 h-16 bg-gradient-to-br from-rose-100 to-pink-100 rounded-full flex items-center justify-center">
            <svg class="animate-spin w-8 h-8 text-rose-600" fill="none" viewBox="0 0 24 24">
              <circle class="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" stroke-width="4"></circle>
              <path class="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
            </svg>
          </div>
        </div>
        <h3 class="text-2xl font-bold text-gray-900 mb-3">Mia prépare son arrivée...</h3>
        <p class="text-gray-600">Elle se met en route. Ça ne prend que quelques secondes.</p>
      </div>
    </div>

    <!-- Contenu principal -->
    <div v-else class="relative z-10">
      <!-- Progress bar -->
      <div class="px-6 pb-8">
        <div class="max-w-6xl mx-auto">
          <div class="text-center mb-8">
            <div class="inline-flex items-center px-4 py-2 bg-gradient-to-r from-rose-50 to-pink-50 border border-rose-200 rounded-full mb-4">
              <svg class="w-4 h-4 text-green-500 mr-2" fill="currentColor" viewBox="0 0 24 24">
                <path d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z"/>
              </svg>
              <span class="text-sm font-semibold text-rose-700">Email confirmé</span>
              <span class="mx-2 text-rose-300">•</span>
              <span class="text-sm text-rose-600">⏱️ 3 minutes</span>
            </div>
            <h1 class="text-3xl md:text-4xl font-bold bg-gradient-to-r from-gray-900 via-rose-800 to-purple-900 bg-clip-text text-transparent mb-3">
              Mia rejoint votre boutique
            </h1>
            <p class="text-lg text-gray-600 max-w-2xl mx-auto">
              Avant de commencer à travailler pour vous, Mia a besoin d'en savoir plus sur votre marque et vos clients. Plus elle en sait, <span class="font-semibold text-rose-600">mieux elle les sert</span>.
            </p>
          </div>
          
          <div class="flex items-center justify-between text-sm text-gray-600 mb-4">
            <span class="font-medium">Étape {{ currentStep }} sur 4</span>
            <span class="font-medium">{{ Math.round((currentStep / 4) * 100) }}% terminé</span>
          </div>
          
          <div class="w-full bg-rose-100 rounded-full h-3 shadow-inner">
            <div 
              class="h-3 rounded-full bg-gradient-to-r from-rose-500 via-pink-500 to-purple-500 transition-all duration-700 ease-out shadow-lg"
              :style="{ width: `${(currentStep / 4) * 100}%` }"
            ></div>
          </div>
        </div>
      </div>

      <!-- Contenu principal -->
      <div class="px-6 pb-6">
        <div class="max-w-7xl mx-auto">
          
          <!-- ========== ÉTAPE 1: PROFIL MARQUE BEAUTÉ ========== -->
          <div v-if="currentStep === 1" class="transition-all duration-500 ease-in-out">
            <div class="grid lg:grid-cols-2 gap-12 items-center">
              
              <div class="text-center lg:text-left">
                <div class="inline-flex p-4 bg-gradient-to-br from-rose-100 to-pink-100 rounded-2xl mb-8">
                  <svg class="w-12 h-12 text-rose-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 6V4m0 2a2 2 0 100 4m0-4a2 2 0 110 4m-6 8a2 2 0 100-4m0 4a2 2 0 100 4m0-4v2m0-6V4m6 6v10m6-2a2 2 0 100-4m0 4a2 2 0 100 4m0-4v2m0-6V4"/>
                  </svg>
                </div>
                <h1 class="text-4xl sm:text-5xl lg:text-6xl font-bold mb-6 bg-gradient-to-r from-rose-600 via-pink-600 to-purple-600 bg-clip-text text-transparent">
                  Votre marque
                </h1>
                <p class="text-xl lg:text-2xl text-gray-700 mb-8 leading-relaxed">
                  Présentez votre marque à Mia
                </p>

                <div class="bg-gradient-to-r from-rose-50 to-pink-50 border border-rose-200 rounded-xl p-5 text-left">
                  <p class="font-bold text-rose-900 mb-2">Pourquoi nous vous le demandons ?</p>
                  <p class="text-rose-800 text-sm leading-relaxed">
                    Ces informations permettent à Mia de se présenter correctement à vos clients et de parcourir votre boutique pour apprendre ce que vous vendez. Plus elle connaît votre marque, mieux elle la représente.
                  </p>
                </div>
              </div>

              <div class="w-full">
                <form @submit.prevent="nextStep" class="space-y-6">
                  <div class="bg-white/80 backdrop-blur-sm border border-rose-200 rounded-2xl p-8 shadow-xl">
                    <div class="space-y-6">
                      <div>
                        <label class="block text-lg font-semibold text-gray-800 mb-3">
                          Quel est le nom de votre marque ? *
                        </label>
                        <input
                          v-model="form.company"
                          type="text"
                          required
                          class="w-full px-6 py-4 bg-white/70 border border-rose-200 rounded-xl focus:ring-2 focus:ring-rose-500 focus:border-rose-500 transition-all text-gray-900 text-lg placeholder-gray-500"
                          placeholder="Ex: Soso Beauty, Yass Hair, Kari Cosmetics..."
                        />
                        <p class="text-gray-500 text-sm mt-2">Ce nom apparaîtra dans les conversations avec vos clients</p>
                      </div>

                      <div>
                        <label class="block text-lg font-semibold text-gray-800 mb-3">
                          Quelle est l'adresse de votre boutique en ligne ? *
                        </label>
                        <input
                          v-model="form.website"
                          type="url"
                          required
                          class="w-full px-6 py-4 bg-white/70 border border-rose-200 rounded-xl focus:ring-2 focus:ring-rose-500 focus:border-rose-500 transition-all text-gray-900 text-lg placeholder-gray-500"
                          placeholder="https://votremarque.com"
                        />
                        <p class="text-gray-500 text-sm mt-2">
                          <svg class="w-4 h-4 text-green-500 inline mr-1" fill="currentColor" viewBox="0 0 24 24">
                            <path d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z"/>
                          </svg>
                          Mia va parcourir votre site pour apprendre ce que vous vendez
                        </p>
                      </div>

                      <div>
                        <label class="block text-lg font-semibold text-gray-800 mb-3">
                          Dans quel domaine travaille-t-elle ? *
                        </label>
                        <select
                          v-model="form.beautyCategory"
                          required
                          class="w-full px-6 py-4 bg-white/70 border border-rose-200 rounded-xl focus:ring-2 focus:ring-rose-500 focus:border-rose-500 transition-all text-gray-900 text-lg"
                        >
                          <option value="" class="bg-white">Sélectionnez votre spécialité</option>
                          <option value="skincare" class="bg-white">🧴 Skincare & Soins du visage</option>
                          <option value="haircare" class="bg-white">💇‍♀️ Soins capillaires</option>
                          <option value="makeup" class="bg-white">💄 Maquillage & Cosmétiques</option>
                          <option value="fragrance" class="bg-white">🌸 Parfums & Fragrances</option>
                          <option value="bodycare" class="bg-white">🧴 Soins du corps</option>
                          <option value="natural" class="bg-white">🌿 Cosmétiques naturels & Bio</option>
                          <option value="multi" class="bg-white">✨ Multi-catégories beauté</option>
                        </select>
                        <p class="text-gray-500 text-sm mt-2">Mia sera spécialisée dans ce domaine</p>
                      </div>

                      <div>
                        <label class="block text-lg font-semibold text-gray-800 mb-3">
                          Sur quelle plateforme est votre boutique ? *
                        </label>
                        <div class="grid grid-cols-3 gap-3">
                          <!-- Shopify -->
                          <button
                            type="button"
                            @click="form.platform = 'shopify'"
                            class="flex flex-col items-center justify-center p-4 border-2 rounded-xl transition-all bg-white/70 hover:border-rose-300"
                            :class="form.platform === 'shopify' ? 'border-rose-500 bg-rose-50' : 'border-gray-200'"
                          >
                            <img :src="shopifyLogo" class="h-10 w-auto object-contain mb-2" alt="Shopify" />
                            <span class="text-sm font-semibold text-gray-900">Shopify</span>
                          </button>
                          <!-- WooCommerce -->
                          <button
                            type="button"
                            @click="form.platform = 'woocommerce'"
                            class="flex flex-col items-center justify-center p-4 border-2 rounded-xl transition-all bg-white/70 hover:border-rose-300"
                            :class="form.platform === 'woocommerce' ? 'border-rose-500 bg-rose-50' : 'border-gray-200'"
                          >
                            <img :src="woocommerceLogo" class="h-8 w-auto object-contain mb-2" alt="WooCommerce" />
                            <span class="text-sm font-semibold text-gray-900">WooCommerce</span>
                          </button>
                          <!-- Site personnalisé -->
                          <button
                            type="button"
                            @click="form.platform = 'custom'"
                            class="flex flex-col items-center justify-center p-4 border-2 rounded-xl transition-all bg-white/70 hover:border-rose-300"
                            :class="form.platform === 'custom' ? 'border-rose-500 bg-rose-50' : 'border-gray-200'"
                          >
                            <span class="text-3xl mb-2">⚙️</span>
                            <span class="text-sm font-semibold text-gray-900">Site personnalisé</span>
                          </button>
                        </div>
                        <p class="text-gray-500 text-sm mt-2">Pour qu'elle puisse s'intégrer directement à votre boutique</p>
                      </div>
                    </div>

                    <div class="flex justify-end pt-8">
                      <button
                        type="submit"
                        class="px-12 py-4 bg-gradient-to-r from-rose-600 via-pink-600 to-purple-600 text-white text-lg font-bold rounded-xl hover:from-rose-700 hover:via-pink-700 hover:to-purple-700 focus:outline-none focus:ring-4 focus:ring-rose-300 transition-all duration-300 shadow-xl hover:shadow-2xl transform hover:scale-105"
                      >
                        Continuer
                        <svg class="w-5 h-5 inline ml-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 5l7 7-7 7"/>
                        </svg>
                      </button>
                    </div>
                  </div>
                </form>
              </div>
            </div>
          </div>

          <!-- ========== ÉTAPE 2: CLIENTÈLE CIBLE ========== -->
          <div v-if="currentStep === 2" class="transition-all duration-500 ease-in-out">
            <div class="text-center mb-12">
              <div class="inline-flex p-4 bg-gradient-to-br from-purple-100 to-pink-100 rounded-2xl mb-6">
                <svg class="w-12 h-12 text-purple-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 4.354a4 4 0 110 5.292M15 21H3v-1a6 6 0 0112 0v1zm0 0h6v-1a6 6 0 00-9-5.197m13.5-9a2.5 2.5 0 11-5 0 2.5 2.5 0 015 0z"/>
                </svg>
              </div>
              <h1 class="text-4xl sm:text-5xl lg:text-6xl font-bold mb-6 bg-gradient-to-r from-purple-600 via-pink-600 to-rose-600 bg-clip-text text-transparent">
                Vos clients
              </h1>
              <p class="text-xl lg:text-2xl text-gray-700 max-w-4xl mx-auto mb-8">
                Pour bien conseiller vos clients, Mia a besoin de savoir qui ils sont. Ces informations lui permettent d'adapter son approche à chaque profil.
              </p>

              <!-- Indicateur sync en cours -->
              <div v-if="syncStore.isSyncing" class="mt-4 inline-flex items-center px-4 py-2 bg-blue-50 border border-blue-200 rounded-full text-sm text-blue-700">
                <svg class="animate-spin w-4 h-4 mr-2 text-blue-500" fill="none" viewBox="0 0 24 24">
                  <circle class="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" stroke-width="4"></circle>
                  <path class="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                </svg>
                Mia est en train de parcourir votre boutique...
              </div>
              <div v-else-if="syncStore.detectedPriceRange && !form.priceRange" class="mt-4 inline-flex items-center px-4 py-2 bg-green-50 border border-green-200 rounded-full text-sm text-green-700">
                <svg class="w-4 h-4 mr-2 text-green-500" fill="currentColor" viewBox="0 0 24 24"><path d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z"/></svg>
                Gamme de prix détectée depuis votre catalogue
              </div>
            </div>

            <form @submit.prevent="nextStep" class="max-w-4xl mx-auto space-y-8">
              <div class="bg-white/80 backdrop-blur-sm border border-rose-200 rounded-2xl p-8 shadow-xl">

                <!-- Genre de la clientèle -->
                <div class="mb-8">
                  <label class="block text-xl font-semibold text-gray-800 mb-6">
                    Vos clients sont principalement *
                  </label>
                  <div class="grid grid-cols-3 gap-4">
                    <label v-for="gender in genderOptions" :key="gender.value" class="relative group cursor-pointer">
                      <input v-model="form.targetGender" :value="gender.value" type="radio" class="sr-only" required>
                      <div class="p-4 bg-white border-2 rounded-xl transition-all group-hover:bg-rose-50 text-center"
                           :class="form.targetGender === gender.value ? 'border-rose-500 bg-rose-50 shadow-lg shadow-rose-500/20' : 'border-gray-300'">
                        <div class="text-2xl mb-2">{{ gender.icon }}</div>
                        <div class="font-semibold text-gray-800 text-sm">{{ gender.label }}</div>
                        <div v-if="form.targetGender === gender.value" class="absolute top-2 right-2">
                          <div class="w-5 h-5 bg-rose-500 rounded-full flex items-center justify-center">
                            <svg class="w-3 h-3 text-white" fill="currentColor" viewBox="0 0 20 20">
                              <path fill-rule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clip-rule="evenodd"/>
                            </svg>
                          </div>
                        </div>
                      </div>
                    </label>
                  </div>
                </div>

                <!-- Question spécialisée selon domaine -->
                <div class="mb-8">
                  <label class="block text-xl font-semibold text-gray-800 mb-6">
                    {{ getSpecializedQuestion() }}
                  </label>
                  <div class="grid grid-cols-2 md:grid-cols-3 gap-4">
                    <label v-for="option in getSpecializedOptions()" :key="option.value" class="relative group cursor-pointer">
                      <input v-model="form.specializedTarget" :value="option.value" type="checkbox" class="sr-only">
                      <div class="p-4 bg-white border-2 rounded-xl transition-all group-hover:bg-rose-50 text-center"
                           :class="form.specializedTarget.includes(option.value) ? 'border-rose-500 bg-rose-50 shadow-lg shadow-rose-500/20' : 'border-gray-300'">
                        <div class="text-2xl mb-2">{{ option.icon }}</div>
                        <div class="font-semibold text-gray-800">{{ option.label }}</div>
                        <div class="text-sm text-gray-600">{{ option.description }}</div>
                        <div v-if="form.specializedTarget.includes(option.value)" class="absolute top-2 right-2">
                          <div class="w-5 h-5 bg-rose-500 rounded-full flex items-center justify-center">
                            <svg class="w-3 h-3 text-white" fill="currentColor" viewBox="0 0 20 20">
                              <path fill-rule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clip-rule="evenodd"/>
                            </svg>
                          </div>
                        </div>
                      </div>
                    </label>
                  </div>
                </div>

                <!-- Tranche d'âge -->
                <div class="mb-8">
                  <label class="block text-xl font-semibold text-gray-800 mb-6">
                    Quelle est leur tranche d'âge principale ? *
                  </label>
                  <div class="grid grid-cols-2 md:grid-cols-4 gap-4">
                    <label v-for="ageRange in ageRanges" :key="ageRange.value" class="relative group cursor-pointer">
                      <input v-model="form.targetAgeRange" :value="ageRange.value" type="radio" class="sr-only" required>
                      <div class="p-4 bg-white border-2 rounded-xl transition-all group-hover:bg-purple-50 text-center"
                           :class="form.targetAgeRange === ageRange.value ? 'border-purple-500 bg-purple-50 shadow-lg shadow-purple-500/20' : 'border-gray-300'">
                        <div class="font-semibold text-gray-800">{{ ageRange.label }}</div>
                        <div class="text-sm text-gray-600">{{ ageRange.description }}</div>
                        <div v-if="form.targetAgeRange === ageRange.value" class="absolute top-2 right-2">
                          <div class="w-5 h-5 bg-purple-500 rounded-full flex items-center justify-center">
                            <svg class="w-3 h-3 text-white" fill="currentColor" viewBox="0 0 20 20">
                              <path fill-rule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clip-rule="evenodd"/>
                            </svg>
                          </div>
                        </div>
                      </div>
                    </label>
                  </div>
                </div>

                <!-- Gamme de prix -->
                <div class="mb-8">
                  <label class="block text-xl font-semibold text-gray-800 mb-6">
                    Quelle est la gamme de prix de vos produits ? *
                  </label>
                  <div class="grid grid-cols-1 md:grid-cols-3 gap-4">
                    <label v-for="priceRange in priceRanges" :key="priceRange.value" class="relative group cursor-pointer">
                      <input v-model="form.priceRange" :value="priceRange.value" type="radio" class="sr-only" required>
                      <div class="p-4 bg-white border-2 rounded-xl transition-all group-hover:bg-pink-50 text-center"
                           :class="form.priceRange === priceRange.value ? 'border-pink-500 bg-pink-50 shadow-lg shadow-pink-500/20' : 'border-gray-300'">
                        <div class="text-2xl mb-2">{{ priceRange.icon }}</div>
                        <div class="font-semibold text-gray-800">{{ priceRange.label }}</div>
                        <div class="text-sm text-gray-600">{{ priceRange.description }}</div>
                        <div v-if="form.priceRange === priceRange.value" class="absolute top-2 right-2">
                          <div class="w-5 h-5 bg-pink-500 rounded-full flex items-center justify-center">
                            <svg class="w-3 h-3 text-white" fill="currentColor" viewBox="0 0 20 20">
                              <path fill-rule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clip-rule="evenodd"/>
                            </svg>
                          </div>
                        </div>
                      </div>
                    </label>
                  </div>
                </div>

                <div class="flex justify-between pt-8">
                  <button
                    type="button"
                    @click="previousStep"
                    class="px-8 py-4 bg-white border-2 border-gray-300 text-gray-700 text-lg font-semibold rounded-xl hover:bg-gray-50 hover:border-gray-400 transition-all duration-300"
                  >
                    <svg class="w-5 h-5 inline mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M15 19l-7-7 7-7"/>
                    </svg>
                    Retour
                  </button>
                  <button
                    type="submit"
                    class="px-12 py-4 bg-gradient-to-r from-purple-600 via-pink-600 to-rose-600 text-white text-lg font-bold rounded-xl hover:from-purple-700 hover:via-pink-700 hover:to-rose-700 transition-all duration-300 shadow-xl hover:shadow-2xl transform hover:scale-105"
                  >
                    Continuer
                    <svg class="w-5 h-5 inline ml-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 5l7 7-7 7"/>
                    </svg>
                  </button>
                </div>
              </div>
            </form>
          </div>

          <!-- ========== ÉTAPE 3: STYLE DE CONSEIL ========== -->
          <div v-if="currentStep === 3" class="transition-all duration-500 ease-in-out">
            <div class="text-center mb-12">
              <div class="inline-flex p-4 bg-gradient-to-br from-pink-100 to-rose-100 rounded-2xl mb-6">
                <svg class="w-12 h-12 text-pink-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9.663 17h4.673M12 3v1m6.364 1.636l-.707.707M21 12h-1M4 12H3m3.343-5.657l-.707-.707m2.828 9.9a5 5 0 117.072 0l-.548.547A3.374 3.374 0 0014 18.469V19a2 2 0 11-4 0v-.531c0-.895-.356-1.754-.988-2.386l-.548-.547z"/>
                </svg>
              </div>
              <h1 class="text-4xl sm:text-5xl lg:text-6xl font-bold mb-6 bg-gradient-to-r from-pink-600 via-rose-600 to-purple-600 bg-clip-text text-transparent">
                Donnez une personnalité à Mia
              </h1>
              <p class="text-xl lg:text-2xl text-gray-700 max-w-4xl mx-auto mb-8">
                Comment souhaitez-vous que Mia s'adresse à vos clients ?
              </p>
              <div class="bg-gradient-to-r from-pink-50 to-rose-50 border border-pink-200 rounded-xl p-6 max-w-2xl mx-auto">
                <p class="text-pink-800 text-sm leading-relaxed">
                  <strong class="text-pink-900">Personnalité sur-mesure :</strong><br>
                  Mia adoptera le ton et l'approche qui correspondent à votre marque et à vos clients. Comme une nouvelle employée qui s'adapte à la culture de la boutique.
                </p>
              </div>
            </div>

            <form @submit.prevent="nextStep" class="max-w-4xl mx-auto space-y-8">
              <div class="bg-white/80 backdrop-blur-sm border border-rose-200 rounded-2xl p-8 shadow-xl">
                
                <!-- Niveau d'expertise -->
                <div class="mb-8">
                  <label class="block text-xl font-semibold text-gray-800 mb-6">
                    Quel doit être son niveau d'expertise *
                  </label>
                  <div class="grid grid-cols-1 md:grid-cols-3 gap-6">
                    <label v-for="expertise in expertiseLevels" :key="expertise.value" class="relative group cursor-pointer">
                      <input v-model="form.expertiseLevel" :value="expertise.value" type="radio" class="sr-only" required>
                      <div class="p-6 bg-white border-2 rounded-xl transition-all group-hover:bg-pink-50 h-full"
                           :class="form.expertiseLevel === expertise.value ? 'border-pink-500 bg-pink-50 shadow-lg shadow-pink-500/20' : 'border-gray-300'">
                        <div class="text-center space-y-3">
                          <div class="text-3xl">{{ expertise.icon }}</div>
                          <div class="font-bold text-gray-800">{{ expertise.label }}</div>
                          <div class="text-sm text-gray-600">{{ expertise.description }}</div>
                        </div>
                        <div v-if="form.expertiseLevel === expertise.value" class="absolute top-4 right-4">
                          <div class="w-6 h-6 bg-pink-500 rounded-full flex items-center justify-center">
                            <svg class="w-4 h-4 text-white" fill="currentColor" viewBox="0 0 20 20">
                              <path fill-rule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clip-rule="evenodd"/>
                            </svg>
                          </div>
                        </div>
                      </div>
                    </label>
                  </div>
                </div>

                <!-- Ton de communication -->
                <div class="mb-8">
                  <label class="block text-xl font-semibold text-gray-800 mb-6">
                    Quel doit être son ton de communication ? *
                  </label>
                  <div class="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <label v-for="tone in communicationTones" :key="tone.value" class="relative group cursor-pointer">
                      <input v-model="form.communicationTone" :value="tone.value" type="radio" class="sr-only" required>
                      <div class="p-6 bg-white border-2 rounded-xl transition-all group-hover:bg-rose-50 h-full"
                           :class="form.communicationTone === tone.value ? 'border-rose-500 bg-rose-50 shadow-lg shadow-rose-500/20' : 'border-gray-300'">
                        <div class="space-y-3">
                          <div class="flex items-center space-x-3">
                            <div class="text-2xl">{{ tone.icon }}</div>
                            <div class="font-bold text-gray-800">{{ tone.label }}</div>
                          </div>
                          <div class="text-sm text-gray-600">{{ tone.description }}</div>
                          <div class="bg-gray-50 rounded-lg p-3">
                            <div class="text-xs text-gray-500 mb-1">Exemple :</div>
                            <div class="text-sm italic text-gray-700">"{{ tone.example }}"</div>
                          </div>
                        </div>
                        <div v-if="form.communicationTone === tone.value" class="absolute top-4 right-4">
                          <div class="w-6 h-6 bg-rose-500 rounded-full flex items-center justify-center">
                            <svg class="w-4 h-4 text-white" fill="currentColor" viewBox="0 0 20 20">
                              <path fill-rule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clip-rule="evenodd"/>
                            </svg>
                          </div>
                        </div>
                      </div>
                    </label>
                  </div>
                </div>

                <!-- Objectifs de Mia (multi-select, tous pré-cochés) -->
                <div class="mb-8">
                  <label class="block text-xl font-semibold text-gray-800 mb-2">
                    Mia pourra
                  </label>
                  <p class="text-sm text-gray-500 mb-6">Décochez uniquement ce que vous ne souhaitez pas</p>
                  <div class="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <label v-for="goal in primaryGoals" :key="goal.value" class="relative group cursor-pointer">
                      <input v-model="form.primaryGoals" :value="goal.value" type="checkbox" class="sr-only">
                      <div class="p-6 bg-white border-2 rounded-xl transition-all group-hover:bg-purple-50 h-full"
                           :class="form.primaryGoals.includes(goal.value) ? 'border-purple-500 bg-purple-50 shadow-lg shadow-purple-500/20' : 'border-gray-300'">
                        <div class="space-y-3">
                          <div class="flex items-center space-x-3">
                            <div class="text-2xl">{{ goal.icon }}</div>
                            <div class="font-bold text-gray-800">{{ goal.label }}</div>
                          </div>
                          <div class="text-sm text-gray-600">{{ goal.description }}</div>
                        </div>
                        <div v-if="form.primaryGoals.includes(goal.value)" class="absolute top-4 right-4">
                          <div class="w-6 h-6 bg-purple-500 rounded-full flex items-center justify-center">
                            <svg class="w-4 h-4 text-white" fill="currentColor" viewBox="0 0 20 20">
                              <path fill-rule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clip-rule="evenodd"/>
                            </svg>
                          </div>
                        </div>
                      </div>
                    </label>
                  </div>
                </div>

                <div class="flex justify-between pt-8">
                  <button
                    type="button"
                    @click="previousStep"
                    class="px-8 py-4 bg-white border-2 border-gray-300 text-gray-700 text-lg font-semibold rounded-xl hover:bg-gray-50 hover:border-gray-400 transition-all duration-300"
                  >
                    <svg class="w-5 h-5 inline mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M15 19l-7-7 7-7"/>
                    </svg>
                    Retour
                  </button>
                  <button
                    type="submit"
                    class="px-12 py-4 bg-gradient-to-r from-pink-600 via-rose-600 to-purple-600 text-white text-lg font-bold rounded-xl hover:from-pink-700 hover:via-rose-700 hover:to-purple-700 transition-all duration-300 shadow-xl hover:shadow-2xl transform hover:scale-105"
                  >
                    Continuer
                    <svg class="w-5 h-5 inline ml-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 5l7 7-7 7"/>
                    </svg>
                  </button>
                </div>
              </div>
            </form>
          </div>

          <!-- ========== ÉTAPE 4: FINALISATION + AHA MOMENT ========== -->
          <div v-if="currentStep === 4" class="transition-all duration-500 ease-in-out">
            <div class="grid lg:grid-cols-2 gap-12 items-center">

              <!-- Colonne gauche : Aha Moment + Statut Sync -->
              <div class="text-center lg:text-left">
                <div class="inline-flex p-4 bg-gradient-to-br from-emerald-100 to-green-100 rounded-2xl mb-8">
                  <svg v-if="syncStore.isSyncComplete && syncStore.hasAnySuccess" class="w-12 h-12 text-emerald-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M5 13l4 4L19 7"/>
                  </svg>
                  <svg v-else class="w-12 h-12 text-emerald-600 animate-pulse" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M13 10V3L4 14h7v7l9-11h-7z"/>
                  </svg>
                </div>

                <!-- Titre dynamique selon l'état du sync -->
                <h1 v-if="syncStore.isSyncComplete && syncStore.hasAnySuccess" class="text-4xl sm:text-5xl lg:text-6xl font-bold mb-6 bg-gradient-to-r from-emerald-600 via-green-600 to-blue-600 bg-clip-text text-transparent">
                  {{ form.agentName || getDefaultAgentName() }} est là. Elle est prête.
                </h1>
                <h1 v-else-if="syncStore.isSyncing" class="text-4xl sm:text-5xl lg:text-6xl font-bold mb-6 bg-gradient-to-r from-emerald-600 via-green-600 to-blue-600 bg-clip-text text-transparent">
                  {{ form.agentName || getDefaultAgentName() }} apprend encore...
                </h1>
                <h1 v-else class="text-4xl sm:text-5xl lg:text-6xl font-bold mb-6 bg-gradient-to-r from-emerald-600 via-green-600 to-blue-600 bg-clip-text text-transparent">
                  Une dernière chose avant de la lancer.
                </h1>

                <!-- Message dynamique -->
                <p v-if="syncStore.isSyncComplete && syncStore.hasAnySuccess" class="text-xl lg:text-2xl text-gray-700 mb-8">
                  {{ getSyncAhaMessage() }}
                </p>
                <p v-else-if="syncStore.isSyncing" class="text-xl lg:text-2xl text-gray-700 mb-8">
                  {{ form.agentName || getDefaultAgentName() }} est en train de parcourir votre boutique. Elle sera prête dans quelques secondes.
                </p>
                <p v-else class="text-xl lg:text-2xl text-gray-700 mb-8">
                  Donnez-lui un prénom, et elle est prête à accueillir vos clients.
                </p>

                <!-- Statut sync détaillé -->
                <div class="space-y-4 mb-8">

                  <!-- KB Status -->
                  <div v-if="syncStore.kbStatus !== 'idle'" class="bg-white/80 border rounded-xl p-4 text-left flex items-center space-x-3"
                       :class="syncStore.kbStatus === 'success' ? 'border-green-200' : syncStore.kbStatus === 'error' ? 'border-orange-200' : 'border-blue-200'">
                    <!-- Icône -->
                    <div v-if="syncStore.kbStatus === 'pending'" class="flex-shrink-0">
                      <svg class="animate-spin w-5 h-5 text-blue-500" fill="none" viewBox="0 0 24 24">
                        <circle class="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" stroke-width="4"></circle>
                        <path class="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                      </svg>
                    </div>
                    <div v-else-if="syncStore.kbStatus === 'success'" class="flex-shrink-0">
                      <svg class="w-5 h-5 text-green-500" fill="currentColor" viewBox="0 0 24 24"><path d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z"/></svg>
                    </div>
                    <div v-else class="flex-shrink-0">
                      <svg class="w-5 h-5 text-orange-400" fill="currentColor" viewBox="0 0 24 24"><path d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-2.5L13.732 4c-.77-.833-1.924-.833-2.694 0L4.07 16.5c-.77.833.192 2.5 1.732 2.5z"/></svg>
                    </div>
                    <!-- Texte -->
                    <div class="flex-1">
                      <p v-if="syncStore.kbStatus === 'pending'" class="text-sm text-blue-700 font-medium">
                        Mia parcourt votre site...
                      </p>
                      <p v-else-if="syncStore.kbStatus === 'success'" class="text-sm text-green-700 font-medium">
                        {{ syncStore.kbDocumentsCount }} page{{ syncStore.kbDocumentsCount > 1 ? 's' : '' }} de votre site lue{{ syncStore.kbDocumentsCount > 1 ? 's' : '' }} et mémorisée{{ syncStore.kbDocumentsCount > 1 ? 's' : '' }}
                      </p>
                      <p v-else class="text-sm text-orange-600 font-medium">
                        Lecture du site reportée — elle reprendra automatiquement
                      </p>
                    </div>
                  </div>

                  <!-- Products Status -->
                  <div v-if="syncStore.productsStatus !== 'idle'" class="bg-white/80 border rounded-xl p-4 text-left flex items-center space-x-3"
                       :class="syncStore.productsStatus === 'success' ? 'border-green-200' : syncStore.productsStatus === 'error' ? 'border-orange-200' : 'border-blue-200'">
                    <!-- Icône -->
                    <div v-if="syncStore.productsStatus === 'pending'" class="flex-shrink-0">
                      <svg class="animate-spin w-5 h-5 text-blue-500" fill="none" viewBox="0 0 24 24">
                        <circle class="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" stroke-width="4"></circle>
                        <path class="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                      </svg>
                    </div>
                    <div v-else-if="syncStore.productsStatus === 'success'" class="flex-shrink-0">
                      <svg class="w-5 h-5 text-green-500" fill="currentColor" viewBox="0 0 24 24"><path d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z"/></svg>
                    </div>
                    <div v-else class="flex-shrink-0">
                      <svg class="w-5 h-5 text-orange-400" fill="currentColor" viewBox="0 0 24 24"><path d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-2.5L13.732 4c-.77-.833-1.924-.833-2.694 0L4.07 16.5c-.77.833.192 2.5 1.732 2.5z"/></svg>
                    </div>
                    <!-- Texte -->
                    <div class="flex-1">
                      <p v-if="syncStore.productsStatus === 'pending'" class="text-sm text-blue-700 font-medium">
                        Mia importe vos produits depuis {{ getPlatformLabel(form.platform) }}...
                      </p>
                      <p v-else-if="syncStore.productsStatus === 'success'" class="text-sm text-green-700 font-medium">
                        {{ syncStore.productsCount }} produit{{ syncStore.productsCount > 1 ? 's' : '' }} importé{{ syncStore.productsCount > 1 ? 's' : '' }} depuis {{ getPlatformLabel(form.platform) }}
                      </p>
                      <p v-else class="text-sm text-orange-600 font-medium">
                        Import reporté — il reprendra automatiquement
                      </p>
                    </div>
                  </div>

                  <!-- Message plateforme custom -->
                  <div v-if="form.platform === 'custom' && syncStore.kbStatus !== 'idle'" class="bg-gradient-to-r from-purple-50 to-pink-50 border border-purple-200 rounded-xl p-4 text-left">
                    <p class="text-sm text-purple-700">
                      <strong>Site personnalisé :</strong> Mia s'appuie sur le contenu de votre site pour conseiller vos clients. Vous pourrez ajouter vos produits depuis votre espace une fois l'essai lancé.
                    </p>
                  </div>
                </div>

                <!-- Récapitulatif compact -->
                <div class="bg-gradient-to-r from-emerald-50 to-green-50 border border-emerald-200 rounded-2xl p-5 text-left">
                  <h3 class="font-bold text-emerald-800 mb-3 text-sm uppercase tracking-wider">Récapitulatif</h3>
                  <div class="grid grid-cols-2 gap-2 text-sm text-emerald-700">
                    <span class="font-medium">Marque</span>
                    <span class="text-right">{{ form.company }}</span>
                    <span class="font-medium">Domaine</span>
                    <span class="text-right">{{ getBeautyCategoryLabel(form.beautyCategory) }}</span>
                    <span class="font-medium">Style</span>
                    <span class="text-right">{{ getCommunicationToneLabel(form.communicationTone) }}</span>
                  </div>
                </div>
              </div>

              <!-- Colonne droite : Formulaire final -->
              <div class="w-full">
                <form @submit.prevent="completeOnboarding" class="space-y-6">
                  <div class="bg-white/80 backdrop-blur-sm border border-rose-200 rounded-2xl p-8 shadow-xl">
                    <div class="space-y-6">
                      
                      <!-- Nom de Mia -->
                      <div>
                        <label class="block text-lg font-semibold text-gray-800 mb-3">
                          Quel prénom lui donnez-vous ?
                        </label>
                        <input
                          v-model="form.agentName"
                          type="text"
                          class="w-full px-6 py-4 bg-white/70 border border-rose-200 rounded-xl focus:ring-2 focus:ring-rose-500 focus:border-rose-500 transition-all text-gray-900 text-lg placeholder-gray-500"
                          :placeholder="getDefaultAgentName()"
                        />
                        <p class="text-gray-500 text-sm mt-2">Laissez vide pour utiliser "{{ getDefaultAgentName() }}"</p>
                      </div>

                      <!-- Source d'acquisition (optionnel) -->
                      <div>
                        <label class="block text-lg font-semibold text-gray-800 mb-3">
                          Comment avez-vous connu ChatSeller ? <span class="text-gray-400 font-normal">(optionnel)</span>
                        </label>
                        <select
                          v-model="form.acquisitionSource"
                          class="w-full px-6 py-4 bg-white/70 border border-rose-200 rounded-xl focus:ring-2 focus:ring-rose-500 focus:border-rose-500 transition-all text-gray-900 text-lg"
                        >
                          <option value="" class="bg-white">Sélectionnez une source</option>
                          <option value="search_google" class="bg-white">Recherche Google</option>
                          <option value="social_media" class="bg-white">Réseaux sociaux (LinkedIn, Instagram, Facebook)</option>
                          <option value="recommendation" class="bg-white">Recommandation d'une autre marque</option>
                          <option value="whatsapp_group" class="bg-white">Groupe WhatsApp / Telegram</option>
                          <option value="youtube" class="bg-white">YouTube</option>
                          <option value="beauty_event" class="bg-white">Salon beauté / événement professionnel</option>
                          <option value="dukka" class="bg-white">Déjà cliente Dukka</option>
                          <option value="other" class="bg-white">Autre</option>
                        </select>
                      </div>

                      <!-- Essai gratuit reminder -->
                      <div class="bg-gradient-to-r from-green-50 to-emerald-50 border border-green-200 rounded-xl p-6">
                        <div class="flex items-start space-x-4">
                          <svg class="w-8 h-8 text-green-600 mt-1 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z"/>
                          </svg>
                          <div>
                            <p class="font-bold text-green-800 mb-2 text-lg">14 jours d'essai gratuit !</p>
                            <p class="text-green-700 text-sm">
                              {{ form.agentName || getDefaultAgentName() }} vous rejoint pour 14 jours, sans engagement et sans carte bancaire. Testez-la dans votre espace, puis ajoutez le code d'intégration sur votre site pour qu'elle commence à accueillir vos clients.
                            </p>
                          </div>
                        </div>
                      </div>
                    </div>

                    <!-- Erreur inline -->
                    <div v-if="submitError" class="mt-4 p-4 bg-red-50 border border-red-200 rounded-xl flex items-start space-x-3">
                      <svg class="w-5 h-5 text-red-500 flex-shrink-0 mt-0.5" fill="currentColor" viewBox="0 0 24 24">
                        <path d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-2.5L13.732 4c-.77-.833-1.924-.833-2.694 0L4.07 16.5c-.77.833.192 2.5 1.732 2.5z"/>
                      </svg>
                      <p class="text-sm text-red-700">{{ submitError }}</p>
                    </div>

                    <div class="flex flex-col sm:flex-row justify-between gap-4 pt-8">
                      <button
                        type="button"
                        @click="previousStep"
                        class="px-8 py-4 bg-white border-2 border-gray-300 text-gray-700 text-lg font-semibold rounded-xl hover:bg-gray-50 hover:border-gray-400 transition-all duration-300 order-2 sm:order-1"
                      >
                        <svg class="w-5 h-5 inline mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M15 19l-7-7 7-7"/>
                        </svg>
                        Retour
                      </button>
                      <button
                        type="submit"
                        :disabled="loading"
                        class="px-12 py-4 bg-gradient-to-r from-emerald-600 via-green-600 to-blue-600 text-white text-lg font-bold rounded-xl hover:from-emerald-700 hover:via-green-700 hover:to-blue-700 transition-all duration-300 shadow-xl hover:shadow-2xl transform hover:scale-105 disabled:opacity-50 disabled:transform-none order-1 sm:order-2"
                      >
                        <span v-if="loading" class="flex items-center justify-center">
                          <svg class="animate-spin -ml-1 mr-3 h-5 w-5 text-white" fill="none" viewBox="0 0 24 24">
                            <circle class="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" stroke-width="4"></circle>
                            <path class="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                          </svg>
                          Création en cours...
                        </span>
                        <span v-else class="flex items-center justify-center">
                          Lancer {{ form.agentName || getDefaultAgentName() }}
                          <svg class="w-5 h-5 inline ml-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M13 10V3L4 14h7v7l9-11h-7z"/>
                          </svg>
                        </span>
                      </button>
                    </div>
                  </div>
                </form>
              </div>
            </div>
          </div>
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
const currentStep = ref(1)
const loading = ref(false)
const initializing = ref(true)
const submitError = ref('')

// ========== FORMULAIRE ==========
const form = reactive({
  // Étape 1 : Profil marque beauté
  company: '',
  website: '',
  beautyCategory: '',
  platform: '',
  
  // Étape 2 : Clientèle cible
  targetGender: '',
  specializedTarget: [] as string[],
  targetAgeRange: '',
  priceRange: '',
  
  // Étape 3 : Style de conseil
  expertiseLevel: '',
  communicationTone: '',
  primaryGoals: ['conversions', 'upsell', 'support', 'education'] as string[],
  
  // Étape 4 : Finalisation
  agentName: '',
  acquisitionSource: '',
  newsletter: true
})

// ========== OPTIONS SPÉCIALISÉES PAR DOMAINE BEAUTÉ (ADAPTÉ AFRIQUE) ==========
const specializedTargetOptions = {
  skincare: [
    { value: 'normal', icon: '😊', label: 'Peau normale', description: 'Équilibrée, peu de problèmes' },
    { value: 'dry', icon: '💧', label: 'Peau sèche', description: 'Manque d\'hydratation' },
    { value: 'oily', icon: '✨', label: 'Peau grasse', description: 'Excès de sébum' },
    { value: 'combination', icon: '🤔', label: 'Peau mixte', description: 'Zone T grasse, joues sèches' },
    { value: 'sensitive', icon: '🌸', label: 'Peau sensible', description: 'Réactive, intolérances' },
    { value: 'hyperpigmentation', icon: '🎯', label: 'Teint irrégulier', description: 'Taches, hyperpigmentation' }
  ],
  haircare: [
    { value: 'natural_4c', icon: '🔄', label: 'Cheveux crépus 4C', description: 'Texture très serrée' },
    { value: 'natural_4b', icon: '🌀', label: 'Cheveux crépus 4A/4B', description: 'Boucles en Z ou S serrées' },
    { value: 'curly', icon: '➰', label: 'Cheveux bouclés 3A-3C', description: 'Boucles définies' },
    { value: 'relaxed', icon: '📏', label: 'Cheveux défrisés', description: 'Traités chimiquement' },
    { value: 'transitioning', icon: '🔀', label: 'En transition', description: 'Retour au naturel' },
    { value: 'protective', icon: '🛡️', label: 'Coiffures protectrices', description: 'Tresses, locks, tissages' }
  ],
  makeup: [
    { value: 'natural', icon: '🌱', label: 'Look naturel', description: 'Maquillage discret quotidien' },
    { value: 'professional', icon: '👔', label: 'Look professionnel', description: 'Bureau, réunions' },
    { value: 'evening', icon: '🌙', label: 'Look soirée', description: 'Événements, sorties' },
    { value: 'bridal', icon: '👰', label: 'Look mariage', description: 'Mariée, témoins, cérémonies' },
    { value: 'deep_skin', icon: '👑', label: 'Peaux foncées', description: 'Teintes profondes, sous-tons' },
    { value: 'editorial', icon: '📸', label: 'Look créatif', description: 'Artistique, bold' }
  ],
  fragrance: [
    { value: 'floral', icon: '🌸', label: 'Floral', description: 'Rose, jasmin, pivoine' },
    { value: 'woody', icon: '🌲', label: 'Boisé', description: 'Santal, cèdre, oud' },
    { value: 'oriental', icon: '🏺', label: 'Oriental', description: 'Vanille, ambre, épices' },
    { value: 'fresh', icon: '🍃', label: 'Frais', description: 'Agrumes, aquatique' },
    { value: 'musk', icon: '💫', label: 'Musc', description: 'Encens, musc blanc' },
    { value: 'gourmand', icon: '🍰', label: 'Gourmand', description: 'Chocolat, caramel, miel' }
  ],
  bodycare: [
    { value: 'hydrating', icon: '💧', label: 'Hydratation intense', description: 'Peaux très sèches' },
    { value: 'shea_butter', icon: '🧈', label: 'Karité & beurres', description: 'Soins traditionnels' },
    { value: 'brightening', icon: '✨', label: 'Teint unifié', description: 'Éclat, anti-taches' },
    { value: 'exfoliating', icon: '🧽', label: 'Exfoliation', description: 'Gommages, renouvellement' },
    { value: 'stretch_marks', icon: '🎯', label: 'Vergetures', description: 'Prévention et traitement' },
    { value: 'sun', icon: '☀️', label: 'Protection solaire', description: 'SPF pour peaux foncées' }
  ],
  natural: [
    { value: 'shea', icon: '🧈', label: 'Karité pur', description: 'Beurre de karité brut' },
    { value: 'baobab', icon: '🌳', label: 'Baobab', description: 'Huile et poudre de baobab' },
    { value: 'moringa', icon: '🌿', label: 'Moringa', description: 'Huile et extraits' },
    { value: 'black_soap', icon: '🧼', label: 'Savon noir', description: 'Savon noir africain' },
    { value: 'argan', icon: '🫒', label: 'Argan', description: 'Huile d\'argan' },
    { value: 'neem', icon: '🌱', label: 'Neem', description: 'Soins purifiants au neem' }
  ],
  multi: [
    { value: 'skincare', icon: '🧴', label: 'Soins visage', description: 'Routine skincare' },
    { value: 'makeup', icon: '💄', label: 'Maquillage', description: 'Cosmétiques couleur' },
    { value: 'haircare', icon: '💇‍♀️', label: 'Soins cheveux', description: 'Capillaires naturels' },
    { value: 'fragrance', icon: '🌸', label: 'Parfums', description: 'Fragrances' },
    { value: 'bodycare', icon: '🧴', label: 'Soins corps', description: 'Hydratation corporelle' },
    { value: 'natural', icon: '🌿', label: 'Cosmétiques naturels', description: 'Produits bio & naturels' }
  ]
}

// ========== OPTIONS COMMUNES ==========
const genderOptions = [
  { value: 'women', icon: '👩', label: 'Des Femmes' },
  { value: 'men', icon: '👨', label: 'Des Hommes' },
  { value: 'both', icon: '👥', label: 'Hommes & Femmes' }
]

const ageRanges = [
  { value: '18-25', label: '18-25 ans', description: 'Jeunes adultes' },
  { value: '26-35', label: '26-35 ans', description: 'Adultes actives' },
  { value: '36-45', label: '36-45 ans', description: 'Adultes établies' },
  { value: '46+', label: '46+ ans', description: 'Adultes matures' }
]

const priceRanges = [
  { value: 'budget', icon: '💝', label: 'Accessible', description: '5-25€ par produit' },
  { value: 'mid', icon: '💎', label: 'Milieu de gamme', description: '25-80€ par produit' },
  { value: 'luxury', icon: '👑', label: 'Premium', description: '80€+ par produit' }
]

const expertiseLevels = [
  { 
    value: 'beginner', 
    icon: '🌱', 
    label: 'Accessible', 
    description: 'Conseils simples et bienveillants pour débuter' 
  },
  { 
    value: 'expert', 
    icon: '🎓', 
    label: 'Experte', 
    description: 'Conseils techniques approfondis et personnalisés' 
  },
  { 
    value: 'luxury', 
    icon: '💎', 
    label: 'Vendeuse Premium', 
    description: 'Service haut de gamme avec expertise pointue' 
  }
]

// ========== TONS DE COMMUNICATION (ADAPTÉ CONTEXTE AFRICAIN) ==========
const communicationTones = [
  {
    value: 'friendly',
    icon: '😊',
    label: 'Chaleureuse & Proche',
    description: 'Comme une grande sœur qui conseille avec bienveillance',
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
    label: 'Premium & Raffinée',
    description: 'Service VIP personnalisé, attention particulière',
    example: 'Bienvenue dans notre espace beauté. Je suis à votre entière disposition pour vous conseiller.'
  },
  {
    value: 'trendy',
    icon: '🌟',
    label: 'Moderne & Dynamique',
    description: 'Langage actuel, références aux tendances beauté',
    example: 'Hey ! Tu as vu ce sérum dont tout le monde parle ? Je te dis tout sur ses bienfaits !'
  }
]

const primaryGoals = [
  {
    value: 'conversions',
    icon: '📈',
    label: 'Maximiser les ventes',
    description: 'Transformer les visiteurs en acheteurs'
  },
  {
    value: 'upsell',
    icon: '🛍️',
    label: 'Augmenter le panier moyen',
    description: 'Proposer des routines complètes et produits complémentaires'
  },
  {
    value: 'support',
    icon: '💬',
    label: 'Réduire les questions répétitives',
    description: 'Répondre automatiquement aux questions fréquentes'
  },
  {
    value: 'education',
    icon: '🎓',
    label: 'Éduquer et fidéliser',
    description: 'Construire la confiance par l\'expertise beauté'
  }
]

// ========== COMPUTED ==========
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

// ========== HELPERS POUR TEXTES ADAPTATIFS ==========
const getSpecializedQuestion = () => {
  const questions = {
    skincare: 'Quels types de peau traitez-vous principalement ?',
    haircare: 'Quels types de cheveux traitez-vous principalement ?',
    makeup: 'Quels styles de maquillage proposez-vous principalement ?',
    fragrance: 'Quelles familles olfactives proposez-vous principalement ?',
    bodycare: 'Quels types de soins corporels traitez-vous principalement ?',
    natural: 'Quels ingrédients naturels proposez-vous principalement ?',
    multi: 'Quels domaines beauté couvrez-vous principalement ?'
  }
  return questions[form.beautyCategory] || questions.multi
}

const getSpecializedOptions = () => {
  return specializedTargetOptions[form.beautyCategory] || specializedTargetOptions.multi
}

// ========== HELPERS POUR LABELS ==========
const getBeautyCategoryLabel = (value: string) => {
  const categories = {
    'skincare': '🧴 Skincare & Soins du visage',
    'makeup': '💄 Maquillage & Cosmétiques', 
    'fragrance': '🌸 Parfums & Fragrances',
    'haircare': '💇‍♀️ Soins capillaires & Cheveux naturels',
    'bodycare': '🧴 Soins du corps & Karité',
    'natural': '🌿 Cosmétiques naturels & Bio',
    'multi': '✨ Multi-catégories beauté'
  }
  return categories[value] || value
}

const getCommunicationToneLabel = (value: string) => {
  return communicationTones.find(tone => tone.value === value)?.label || value
}

const getPlatformLabel = (value: string) => {
  const platforms = {
    'shopify': 'Shopify',
    'woocommerce': 'WooCommerce',
    'custom': 'Site personnalisé'
  }
  return platforms[value] || value
}

const getDefaultAgentName = () => {
  const names = {
    'skincare': 'Mia',
    'makeup': 'Mia', 
    'fragrance': 'Mia',
    'haircare': 'Mia',
    'bodycare': 'Mia',
    'natural': 'Mia',
    'multi': 'Mia'
  }
  return names[form.beautyCategory] || 'Mia'
}

const getSyncAhaMessage = () => {
  return `Elle a parcouru votre site, appris vos produits et retenu tout ce dont elle a besoin. Donnez-lui un prénom — et elle commence à vendre pour vous.`
}

// ========== NAVIGATION ==========
const nextStep = async () => {
  // Validation étape 1 : plateforme obligatoire (plus de select natif required)
  if (currentStep.value === 1 && !form.platform) return

  // À l'étape 1 : lancer mini shop update + sync background
  if (currentStep.value === 1) {
    await launchStep1Sync()
  }

  if (currentStep.value < 4) {
    currentStep.value++
    window.scrollTo({ top: 0, behavior: 'smooth' })

    // À l'arrivée sur l'étape 2 : pré-remplir si données dispo
    if (currentStep.value === 2) {
      prefillStep2()
    }
  }
}

// ========== SYNC BACKGROUND (ÉTAPE 1) ==========
const launchStep1Sync = async () => {
  if (!form.website || syncStore.isSyncing || syncStore.isSyncComplete) {
    console.log('ℹ️ [Onboarding] Sync déjà lancé ou pas de website')
    return
  }

  const user = authStore.user
  if (!user?.id) return

  // Mini shop update immédiate (domain, platform, plan, trial)
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
    console.warn('⚠️ [Onboarding] Mini shop update échoué (non bloquant):', err)
  }

  // Lancer le sync en background (non bloquant)
  syncStore.startSync({
    website: form.website,
    platform: form.platform,
    beautyCategory: form.beautyCategory,
    companyName: form.company
  })
}

// ========== PRÉ-REMPLISSAGE ÉTAPE 2 ==========
const prefillStep2 = () => {
  if (syncStore.detectedPriceRange && !form.priceRange) {
    form.priceRange = syncStore.detectedPriceRange
    console.log('🔍 [Onboarding] Gamme de prix pré-remplie:', form.priceRange)
  }
}

// Watcher réactif : si le sync termine pendant qu'on est à l'étape 2
watch(() => syncStore.detectedPriceRange, (newRange) => {
  if (newRange && currentStep.value === 2 && !form.priceRange) {
    form.priceRange = newRange
    console.log('🔍 [Onboarding] Gamme de prix pré-remplie (réactif):', newRange)
  }
})

const previousStep = () => {
  if (currentStep.value > 1) {
    currentStep.value--
    window.scrollTo({ top: 0, behavior: 'smooth' })
  }
}

// ========== UTILITAIRES ==========
const extractDomain = (url: string): string | null => {
  if (!url) return null
  try {
    const domain = new URL(url.startsWith('http') ? url : `https://${url}`).hostname
    return domain.replace('www.', '')
  } catch {
    return null
  }
}

// ========== CONFIGURATION AGENT IA ==========
const getOptimizedAgentConfig = () => {
  const agentName = form.agentName || getDefaultAgentName()
  
  const specialties: Record<string, string> = {
    'skincare': 'votre conseillère skincare',
    'makeup': 'votre conseillère maquillage',
    'fragrance': 'votre conseillère parfums',
    'haircare': 'votre conseillère capillaire',
    'bodycare': 'votre conseillère soins du corps',
    'natural': 'votre conseillère cosmétiques naturels',
    'multi': 'votre conseillère beauté'
  }
  const brandName = form.company || 'notre boutique'
  const specialty = specialties[form.beautyCategory] || specialties['multi']
  const welcomeMessage = `Bonjour ! Je suis ${agentName}, ${specialty} chez ${brandName}. Comment puis-je vous aider ?`

  const fallbackMessages = {
    'beginner': `Je transmets votre question à notre équipe pour un conseil personnalisé adapté à vos besoins.`,
    'expert': `Je contacte notre experte senior pour une analyse approfondie de votre demande spécifique.`,
    'luxury': `Je vous mets en relation avec notre consultante premium pour un accompagnement sur mesure.`
  }

  return {
    name: agentName,
    avatar: `https://ui-avatars.com/api/?name=${agentName}&background=E91E63&color=fff`,
    welcomeMessage: welcomeMessage,
    fallbackMessage: fallbackMessages[form.expertiseLevel] || fallbackMessages['expert'],
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
  const colors = {
    'skincare': '#4CAF50',
    'makeup': '#E91E63', 
    'fragrance': '#9C27B0',
    'haircare': '#FF9800',
    'bodycare': '#03DAC5',
    'natural': '#8BC34A',
    'multi': '#E91E63'
  }
  
  const buttonTexts = {
    'skincare': '✨ Conseil skincare',
    'makeup': '💄 Conseil maquillage',
    'fragrance': '🌸 Conseil parfum',
    'haircare': '💇‍♀️ Conseil capillaire',
    'bodycare': '🧴 Conseil soins corps',
    'natural': '🌿 Conseil naturel',
    'multi': '💝 Parler à ma vendeuse'
  }
  
  return {
    theme: 'modern',
    primaryColor: colors[form.beautyCategory] || colors['multi'],
    position: 'bottom-right',
    buttonText: buttonTexts[form.beautyCategory] || buttonTexts['multi'],
    language: 'fr',
    beautyBranding: true,
    showProductRecommendations: true,
    enableSkinTypeQuiz: form.beautyCategory === 'skincare' || form.beautyCategory === 'multi'
  }
}

// ========== COMPLETION ONBOARDING ==========
const completeOnboarding = async () => {
  loading.value = true
  submitError.value = ''

  try {
    console.log('🚀 [Onboarding] Finalisation avec auto-création agent IA...')

    if (!auth.isAuthenticated.value) {
      console.error('❌ [Onboarding] Non connecté')
      await navigateTo('/login')
      return
    }

    const user = authStore.user
    if (!user?.id) {
      throw new Error('Données utilisateur manquantes')
    }

    console.log('✅ [Onboarding] Utilisateur connecté:', user.email)

    // ÉTAPE 1: MISE À JOUR COMPLÈTE DU SHOP (les champs beauté récoltés aux étapes 2-3)
    const shopData = {
      name: form.company || `${getBeautyCategoryLabel(form.beautyCategory)} de ${user.email?.split('@')[0]}`,
      domain: extractDomain(form.website),
      platform: form.platform,

      // Spécialisation beauté (étapes 2-3)
      beauty_category: form.beautyCategory,
      target_gender: form.targetGender,
      specialized_target: form.specializedTarget,
      target_age_range: form.targetAgeRange,
      price_range: form.priceRange,
      expertise_level: form.expertiseLevel,
      communication_tone: form.communicationTone,
      primary_goals: form.primaryGoals,

      // Métadonnées
      acquisition_source: form.acquisitionSource,
      newsletter_subscribed: form.newsletter,
      onboarding_completed: true,
      onboarding_completed_at: new Date().toISOString(),

      // Configuration widget
      widget_config: getOptimizedWidgetConfig()
    }

    console.log('📊 [Onboarding] Mise à jour shop (données beauté):', shopData)

    const shopResponse = await api.shops.update(user.id, shopData)

    if (!shopResponse.success) {
      throw new Error(shopResponse.error || 'Erreur mise à jour shop')
    }

    console.log('✅ [Onboarding] Shop mis à jour')

    // ÉTAPE 2: CRÉER AUTOMATIQUEMENT L'AGENT IA (OBLIGATOIRE)
    console.log('🤖 [Onboarding] Création de la Vendeuse IA...')

    const beautyCategory = form.beautyCategory || 'multi'
    const agentType = `${beautyCategory}_expert` as const
    const agentPersonality = form.communicationTone || 'friendly'

    const validAgentTypes = ['skincare_expert', 'makeup_expert', 'fragrance_expert', 'haircare_expert', 'bodycare_expert', 'beauty_expert', 'natural_expert', 'multi_expert']
    const finalAgentType = validAgentTypes.includes(agentType) ? agentType : 'beauty_expert'

    const validPersonalities = ['professional', 'friendly', 'expert', 'casual', 'luxury', 'trendy']
    const finalPersonality = validPersonalities.includes(agentPersonality) ? agentPersonality : 'friendly'

    const agentConfig = getOptimizedAgentConfig()

    const agentData = {
      name: form.agentName || getDefaultAgentName(),
      type: finalAgentType,
      personality: finalPersonality,
      description: `Mia, vendeuse IA spécialisée pour ${form.company}`,
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

    console.log('🤖 [Onboarding] Données agent à créer:', JSON.stringify(agentData, null, 2))

    const agentResponse = await api.agents.create(agentData)

    if (!agentResponse.success) {
      console.error('❌ [Onboarding] Erreur création agent:', {
        error: agentResponse.error,
        details: (agentResponse as any).details,
        received: (agentResponse as any).received,
        agentData: agentData
      })
      throw new Error(`Mia n'a pas pu démarrer : ${agentResponse.error || 'Erreur inconnue'}`)
    }

    console.log('✅ [Onboarding] Vendeuse IA créée avec succès:', agentResponse.data?.id)

    // ÉTAPE 3: ATTENDRE LE SYNC BACKGROUND (lancé à l'étape 1)
    // Si le sync est toujours en cours, on attend avec timeout
    if (syncStore.isSyncing) {
      console.log('⏳ [Onboarding] Sync encore en cours, attente...')
      const syncResult = await syncStore.waitForCompletion(20000) // 20s max
      console.log('✅ [Onboarding] Sync terminé:', syncResult)
    } else if (!syncStore.isSyncComplete && form.website) {
      // Sync jamais lancé (edge case) → lancer maintenant
      console.log('⚠️ [Onboarding] Sync jamais lancé, lancement de rattrapage...')
      syncStore.startSync({
        website: form.website,
        platform: form.platform,
        beautyCategory: form.beautyCategory,
        companyName: form.company
      })
      await syncStore.waitForCompletion(90000)
    } else {
      console.log('✅ [Onboarding] Sync déjà terminé ou pas de website')
    }

    // Sauvegarder le diagnostic sync en sessionStorage
    try {
      sessionStorage.setItem('chatseller_sync_diagnostic', JSON.stringify({
        productsStatus: syncStore.productsStatus,
        productsCount: syncStore.productsCount,
        kbStatus: syncStore.kbStatus,
        kbDocumentsCount: syncStore.kbDocumentsCount,
        completedAt: new Date().toISOString()
      }))
    } catch (e) {
      console.warn('⚠️ Impossible de sauvegarder le diagnostic sync')
    }

    // ÉTAPE 4: SYNCHRONISER LE STORE AUTH
    if (authStore.user) {
      await authStore.restoreSession(true)
      console.log('✅ [Onboarding] Store synchronisé')
    }

    console.log('🎉 [Onboarding] Onboarding terminé avec succès !')

    sessionStorage.setItem('chatseller_onboarding_just_completed', 'true')

    // REDIRECTION : return navigateTo (sans await) pour éviter que NavigationAborted
    // remonte dans le catch et affiche brièvement une erreur (comportement Nuxt 3 connu)
    return navigateTo(`/?onboarding=completed&beauty=true&agent_created=true&category=${form.beautyCategory}&welcome=true`, { replace: true })

  } catch (error: any) {
    console.error('❌ [Onboarding] Erreur finalisation:', error)

    let userMessage = 'Une erreur s\'est produite. Mia n\'a pas pu être lancée.'

    if (error.message?.includes('Token') || error.message?.includes('401')) {
      userMessage = 'Session expirée. Reconnexion en cours...'
      return navigateTo('/login')
    }

    submitError.value = userMessage + (error.message ? ` (${error.message})` : '')

  } finally {
    loading.value = false
  }
}

// ========== INITIALISATION ==========
onMounted(async () => {
  try {
    console.log('🔄 [Onboarding] Initialisation...')
    
    if (!auth.isAuthenticated.value) {
      console.log('❌ [Onboarding] Non connecté')
      await navigateTo('/login')
      return
    }
    
    const supabase = useSupabase()
    const { data: { user } } = await supabase.auth.getUser()
    
    if (!user || !user.email_confirmed_at) {
      console.log('❌ [Onboarding] Email non confirmé')
      await navigateTo('/register')
      return
    }
    
    // Pré-remplir le formulaire
    if (user.user_metadata?.company) {
      form.company = user.user_metadata.company
    }
    
    console.log('✅ [Onboarding] Initialisé pour:', user.email)
    
  } catch (error: any) {
    console.error('❌ [Onboarding] Erreur initialisation:', error)
    await navigateTo('/login')
  } finally {
    initializing.value = false
  }
})

useHead({
  title: 'Recruter Mia — ChatSeller',
  meta: [
    { name: 'description', content: 'Accueillez Mia dans votre boutique en ligne en 3 minutes. Spécialisée beauté, elle conseille vos clients et crée leurs commandes 24h/24.' },
    { name: 'keywords', content: 'Vendeuse IA, skincare, maquillage, parfums, capillaire, beauté Afrique, e-commerce' }
  ]
})
</script>

<style scoped>
@keyframes gradient-xy {
  0%, 100% {
    background-size: 400% 400%;
    background-position: left center;
  }
  50% {
    background-size: 200% 200%;
    background-position: right center;
  }
}

.animate-gradient-xy {
  animation: gradient-xy 15s ease infinite;
}

@keyframes spin {
  from { transform: rotate(0deg); }
  to { transform: rotate(360deg); }
}

.animate-spin {
  animation: spin 1s linear infinite;
}

.transition-all {
  transition-property: all;
  transition-timing-function: cubic-bezier(0.4, 0, 0.2, 1);
  transition-duration: 300ms;
}

.backdrop-blur-sm {
  backdrop-filter: blur(4px);
}

.transform {
  transition: transform 0.3s ease;
}

.hover\:scale-105:hover {
  transform: scale(1.05);
}

@media (max-width: 768px) {
  .text-4xl {
    font-size: 2.5rem;
  }
  .text-5xl {
    font-size: 3rem;
  }
  .text-6xl {
    font-size: 3.5rem;
  }
}
</style>