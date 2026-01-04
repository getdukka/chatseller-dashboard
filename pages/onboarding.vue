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
          <p class="text-rose-600 text-sm font-medium">Configuration de votre Conseillère IA</p>
          <p class="text-gray-800 font-semibold">{{ userFirstName }}, créons votre assistante beauté !</p>
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
        <h3 class="text-2xl font-bold text-gray-900 mb-3">Préparation de votre espace...</h3>
        <p class="text-gray-600">Configuration de votre tableau de bord ChatSeller.</p>
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
              Créons votre Conseillère IA
            </h1>
            <p class="text-lg text-gray-600 max-w-2xl mx-auto">
              Ces informations nous permettent de créer une Conseillère IA 
              <span class="font-semibold text-rose-600">parfaitement adaptée</span> à votre marque et vos clientes.
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
                  Parlez-nous de votre marque beauté
                </p>
                
                <!-- 🆕 USP WHATSAPP -->
                <div class="bg-gradient-to-r from-green-50 to-emerald-50 border border-green-200 rounded-xl p-5 mb-6 text-left">
                  <div class="flex items-start space-x-4">
                    <span class="text-3xl">📱</span>
                    <div>
                      <p class="font-bold text-green-800 mb-1">Fini les nuits sur WhatsApp !</p>
                      <p class="text-sm text-green-700">Votre Conseillère IA va répondre à vos clientes 24h/24, même quand vous dormez. Plus besoin de répéter les mêmes conseils des dizaines de fois.</p>
                    </div>
                  </div>
                </div>
                
                <div class="bg-gradient-to-r from-rose-50 to-pink-50 border border-rose-200 rounded-xl p-5 text-left">
                  <p class="text-rose-800 text-sm leading-relaxed">
                    <strong class="text-rose-900">Configuration intelligente :</strong><br>
                    Nous analysons votre site web pour créer automatiquement une base de connaissances. Votre Conseillère IA connaîtra vos produits dès le premier jour.
                  </p>
                </div>
              </div>

              <div class="w-full">
                <form @submit.prevent="nextStep" class="space-y-6">
                  <div class="bg-white/80 backdrop-blur-sm border border-rose-200 rounded-2xl p-8 shadow-xl">
                    <div class="space-y-6">
                      <div>
                        <label class="block text-lg font-semibold text-gray-800 mb-3">
                          Nom de votre marque *
                        </label>
                        <input
                          v-model="form.company"
                          type="text"
                          required
                          class="w-full px-6 py-4 bg-white/70 border border-rose-200 rounded-xl focus:ring-2 focus:ring-rose-500 focus:border-rose-500 transition-all text-gray-900 text-lg placeholder-gray-500"
                          placeholder="Ex: Nappy Queen, Carapate Beauty, Mariam Cosmetics..."
                        />
                        <p class="text-gray-500 text-sm mt-2">Ce nom apparaîtra dans les conversations avec vos clientes</p>
                      </div>

                      <div>
                        <label class="block text-lg font-semibold text-gray-800 mb-3">
                          Site web de votre boutique *
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
                          Nous analyserons votre catalogue pour former votre Conseillère IA
                        </p>
                      </div>

                      <div>
                        <label class="block text-lg font-semibold text-gray-800 mb-3">
                          Votre domaine beauté *
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
                        <p class="text-gray-500 text-sm mt-2">Votre Conseillère sera experte dans ce domaine</p>
                      </div>

                      <div>
                        <label class="block text-lg font-semibold text-gray-800 mb-3">
                          Plateforme e-commerce *
                        </label>
                        <select
                          v-model="form.platform"
                          required
                          class="w-full px-6 py-4 bg-white/70 border border-rose-200 rounded-xl focus:ring-2 focus:ring-rose-500 focus:border-rose-500 transition-all text-gray-900 text-lg"
                        >
                          <option value="" class="bg-white">Sélectionnez votre plateforme</option>
                          <option value="shopify" class="bg-white">🛒 Shopify</option>
                          <option value="woocommerce" class="bg-white">🔗 WooCommerce</option>
                          <option value="custom" class="bg-white">⚙️ Site personnalisé</option>
                        </select>
                        <p class="text-gray-500 text-sm mt-2">Pour préparer l'intégration du widget sur votre site</p>
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
                {{ getClienteleTitle() }}
              </h1>
              <p class="text-xl lg:text-2xl text-gray-700 max-w-4xl mx-auto mb-8">
                {{ getClienteleDescription() }}
              </p>
              <div class="bg-gradient-to-r from-purple-50 to-pink-50 border border-purple-200 rounded-xl p-6 max-w-2xl mx-auto">
                <p class="text-purple-800 text-sm leading-relaxed">
                  <strong class="text-purple-900">Conseils personnalisés :</strong><br>
                  {{ getClienteleExplanation() }}
                </p>
              </div>
            </div>

            <form @submit.prevent="nextStep" class="max-w-4xl mx-auto space-y-8">
              <div class="bg-white/80 backdrop-blur-sm border border-rose-200 rounded-2xl p-8 shadow-xl">
                
                <!-- Question spécialisée selon domaine -->
                <div class="mb-8">
                  <label class="block text-xl font-semibold text-gray-800 mb-6">
                    {{ getSpecializedQuestion() }} *
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
                    Tranche d'âge principale de vos clientes *
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
                    Gamme de prix de vos produits *
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
                Personnalité de votre Conseillère
              </h1>
              <p class="text-xl lg:text-2xl text-gray-700 max-w-4xl mx-auto mb-8">
                Comment souhaitez-vous que votre Conseillère IA s'adresse à vos clientes ?
              </p>
              <div class="bg-gradient-to-r from-pink-50 to-rose-50 border border-pink-200 rounded-xl p-6 max-w-2xl mx-auto">
                <p class="text-pink-800 text-sm leading-relaxed">
                  <strong class="text-pink-900">Personnalité adaptée :</strong><br>
                  Votre Conseillère IA adoptera le ton et l'approche qui correspondent à votre marque et vos clientes.
                </p>
              </div>
            </div>

            <form @submit.prevent="nextStep" class="max-w-4xl mx-auto space-y-8">
              <div class="bg-white/80 backdrop-blur-sm border border-rose-200 rounded-2xl p-8 shadow-xl">
                
                <!-- Niveau d'expertise -->
                <div class="mb-8">
                  <label class="block text-xl font-semibold text-gray-800 mb-6">
                    Niveau d'expertise de votre Conseillère *
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
                    Ton de communication souhaité *
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

                <!-- Objectif principal -->
                <div class="mb-8">
                  <label class="block text-xl font-semibold text-gray-800 mb-6">
                    Objectif principal de votre Conseillère *
                  </label>
                  <div class="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <label v-for="goal in primaryGoals" :key="goal.value" class="relative group cursor-pointer">
                      <input v-model="form.primaryGoal" :value="goal.value" type="radio" class="sr-only" required>
                      <div class="p-6 bg-white border-2 rounded-xl transition-all group-hover:bg-purple-50 h-full"
                           :class="form.primaryGoal === goal.value ? 'border-purple-500 bg-purple-50 shadow-lg shadow-purple-500/20' : 'border-gray-300'">
                        <div class="space-y-3">
                          <div class="flex items-center space-x-3">
                            <div class="text-2xl">{{ goal.icon }}</div>
                            <div class="font-bold text-gray-800">{{ goal.label }}</div>
                          </div>
                          <div class="text-sm text-gray-600">{{ goal.description }}</div>
                        </div>
                        <div v-if="form.primaryGoal === goal.value" class="absolute top-4 right-4">
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

          <!-- ========== ÉTAPE 4: FINALISATION ========== -->
          <div v-if="currentStep === 4" class="transition-all duration-500 ease-in-out">
            <div class="grid lg:grid-cols-2 gap-12 items-center">
              
              <!-- Colonne gauche : Récapitulatif -->
              <div class="text-center lg:text-left">
                <div class="inline-flex p-4 bg-gradient-to-br from-emerald-100 to-green-100 rounded-2xl mb-8">
                  <svg class="w-12 h-12 text-emerald-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M5 13l4 4L19 7"/>
                  </svg>
                </div>
                <h1 class="text-4xl sm:text-5xl lg:text-6xl font-bold mb-6 bg-gradient-to-r from-emerald-600 via-green-600 to-blue-600 bg-clip-text text-transparent">
                  Presque terminé !
                </h1>
                <p class="text-xl lg:text-2xl text-gray-700 mb-8">
                  Votre {{ getAgentTypeName() }} va être créée automatiquement
                </p>

                <!-- Récapitulatif des choix -->
                <div class="bg-gradient-to-r from-emerald-50 to-green-50 border border-emerald-200 rounded-2xl p-6 mb-8 text-left">
                  <h3 class="font-bold text-emerald-800 mb-4 text-lg">Récapitulatif de vos choix :</h3>
                  <div class="space-y-3 text-sm text-emerald-700">
                    <div class="flex justify-between">
                      <span class="font-medium">Marque :</span>
                      <span>{{ form.company }}</span>
                    </div>
                    <div class="flex justify-between">
                      <span class="font-medium">Domaine :</span>
                      <span>{{ getBeautyCategoryLabel(form.beautyCategory) }}</span>
                    </div>
                    <div class="flex justify-between">
                      <span class="font-medium">Clientèle :</span>
                      <span>{{ getAgeRangeLabel(form.targetAgeRange) }}</span>
                    </div>
                    <div class="flex justify-between">
                      <span class="font-medium">Style :</span>
                      <span>{{ getCommunicationToneLabel(form.communicationTone) }}</span>
                    </div>
                    <div class="flex justify-between">
                      <span class="font-medium">Niveau d'expertise :</span>
                      <span>{{ getExpertiseLevelLabel(form.expertiseLevel) }}</span>
                    </div>
                  </div>
                </div>

                <!-- Actions automatiques -->
                <div class="bg-gradient-to-r from-blue-50 to-purple-50 border border-blue-200 rounded-2xl p-6 text-left">
                  <h3 class="font-bold text-blue-800 mb-4 text-lg flex items-center">
                    <svg class="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M13 10V3L4 14h7v7l9-11h-7z"/>
                    </svg>
                    Configuration automatique :
                  </h3>
                  <div class="space-y-2 text-sm text-blue-700">
                    <div class="flex items-center">
                      <svg class="w-4 h-4 text-green-500 mr-2" fill="currentColor" viewBox="0 0 24 24">
                        <path d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z"/>
                      </svg>
                      Création de votre {{ getAgentTypeName() }} personnalisée
                    </div>
                    <div class="flex items-center">
                      <svg class="w-4 h-4 text-green-500 mr-2" fill="currentColor" viewBox="0 0 24 24">
                        <path d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z"/>
                      </svg>
                      Configuration du Widget pour {{ getPlatformLabel(form.platform) }}
                    </div>
                    <div class="flex items-center">
                      <svg class="w-4 h-4 text-green-500 mr-2" fill="currentColor" viewBox="0 0 24 24">
                        <path d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z"/>
                      </svg>
                      Indexation automatique de votre site web
                    </div>
                    <div class="flex items-center">
                      <svg class="w-4 h-4 text-green-500 mr-2" fill="currentColor" viewBox="0 0 24 24">
                        <path d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z"/>
                      </svg>
                      Base de connaissances beauté pré-remplie
                    </div>
                  </div>
                </div>
              </div>

              <!-- Colonne droite : Formulaire final -->
              <div class="w-full">
                <form @submit.prevent="completeOnboarding" class="space-y-6">
                  <div class="bg-white/80 backdrop-blur-sm border border-rose-200 rounded-2xl p-8 shadow-xl">
                    <div class="space-y-6">
                      
                      <!-- Nom de la Conseillère -->
                      <div>
                        <label class="block text-lg font-semibold text-gray-800 mb-3">
                          Nom de votre {{ getAgentTypeName() }}
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

                      <!-- Newsletter (optionnel) -->
                      <div class="bg-gradient-to-r from-rose-50 to-pink-50 border border-rose-200 rounded-xl p-6">
                        <div class="flex items-start space-x-4">
                          <div class="flex items-center h-6 mt-1">
                            <input
                              id="newsletter"
                              v-model="form.newsletter"
                              type="checkbox"
                              class="h-5 w-5 text-rose-600 focus:ring-rose-500 border-rose-300 rounded transition-colors duration-200"
                            />
                          </div>
                          <div>
                            <label for="newsletter" class="text-lg font-semibold text-rose-800">
                              Conseils pour vendre plus
                            </label>
                            <p class="text-sm text-rose-700 mt-1">
                              Recevez nos meilleures stratégies pour maximiser vos ventes, les nouvelles fonctionnalités et des études de cas de marques africaines (1-2 emails/mois max)
                            </p>
                          </div>
                        </div>
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
                              Testez toutes les fonctionnalités sans engagement. Aucune carte bancaire requise. Votre Conseillère IA commence à vendre pour vous dès maintenant.
                            </p>
                          </div>
                        </div>
                      </div>
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
                          Créer ma {{ getAgentTypeName() }}
                          <svg class="w-5 h-5 inline ml-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 5l7 7-7 7"/>
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
import { useAuthStore } from '~~/stores/auth'

const auth = useAuth()
const authStore = useAuthStore()
const api = useApi()

definePageMeta({
  layout: false
})

// ========== STATE ==========
const currentStep = ref(1)
const loading = ref(false)
const initializing = ref(true)

// ========== FORMULAIRE ==========
const form = reactive({
  // Étape 1 : Profil marque beauté
  company: '',
  website: '',
  beautyCategory: '',
  platform: '',
  
  // Étape 2 : Clientèle cible
  specializedTarget: [] as string[],
  targetAgeRange: '',
  priceRange: '',
  
  // Étape 3 : Style de conseil
  expertiseLevel: '',
  communicationTone: '',
  primaryGoal: '',
  
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
    label: 'Conseillère Premium', 
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
    description: 'Approche conseillère beauté en institut',
    example: 'Bonjour Madame, je suis votre conseillère beauté. Comment puis-je vous accompagner aujourd\'hui ?'
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
    description: 'Transformer les visiteuses en acheteuses'
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
const getClienteleTitle = () => {
  const titles = {
    skincare: 'Vos clientes skincare',
    haircare: 'Vos clientes capillaires',
    makeup: 'Vos clientes maquillage',
    fragrance: 'Vos clientes parfums',
    bodycare: 'Vos clientes soins corps',
    natural: 'Vos clientes cosmétiques naturels',
    multi: 'Vos clientes'
  }
  return titles[form.beautyCategory] || 'Vos clientes'
}

const getClienteleDescription = () => {
  const descriptions = {
    skincare: 'Qui sont vos clientes ? Cela permet d\'adapter les conseils selon leur type de peau.',
    haircare: 'Qui sont vos clientes ? Cela permet d\'adapter les conseils selon leur type de cheveux et texture.',
    makeup: 'Qui sont vos clientes ? Cela permet d\'adapter les conseils selon leurs occasions et carnation.',
    fragrance: 'Qui sont vos clientes ? Cela permet d\'adapter les conseils selon leurs préférences olfactives.',
    bodycare: 'Qui sont vos clientes ? Cela permet d\'adapter les conseils selon leurs besoins corporels.',
    natural: 'Qui sont vos clientes ? Cela permet d\'adapter les conseils selon leurs préférences naturelles.',
    multi: 'Qui sont vos clientes ? Cela permet d\'adapter le langage et les recommandations de votre Conseillère IA.'
  }
  return descriptions[form.beautyCategory] || descriptions.multi
}

const getClienteleExplanation = () => {
  const explanations = {
    skincare: 'Plus nous connaissons les types de peau de vos clientes, mieux votre Conseillère pourra recommander les soins adaptés.',
    haircare: 'Plus nous connaissons les textures capillaires de vos clientes, mieux votre Conseillère pourra conseiller les soins adaptés.',
    makeup: 'Plus nous connaissons les occasions maquillage de vos clientes, mieux votre Conseillère pourra proposer les looks appropriés.',
    fragrance: 'Plus nous connaissons les goûts olfactifs de vos clientes, mieux votre Conseillère pourra orienter vers les bonnes familles de parfums.',
    bodycare: 'Plus nous connaissons les besoins corporels de vos clientes, mieux votre Conseillère pourra recommander les soins adaptés.',
    natural: 'Plus nous connaissons les préférences de vos clientes, mieux votre Conseillère pourra conseiller les ingrédients naturels adaptés.',
    multi: 'Plus nous connaissons vos clientes, mieux votre Conseillère pourra les accompagner selon leurs besoins beauté.'
  }
  return explanations[form.beautyCategory] || explanations.multi
}

const getSpecializedQuestion = () => {
  const questions = {
    skincare: 'Quels types de peau conseillez-vous principalement ?',
    haircare: 'Quels types de cheveux conseillez-vous principalement ?',
    makeup: 'Quels styles de maquillage proposez-vous principalement ?',
    fragrance: 'Quelles familles olfactives proposez-vous principalement ?',
    bodycare: 'Quels types de soins corporels proposez-vous principalement ?',
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

const getAgeRangeLabel = (value: string) => {
  return ageRanges.find(range => range.value === value)?.label || value
}

const getCommunicationToneLabel = (value: string) => {
  return communicationTones.find(tone => tone.value === value)?.label || value
}

const getExpertiseLevelLabel = (value: string) => {
  return expertiseLevels.find(level => level.value === value)?.label || value
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
    'skincare': 'Awa',
    'makeup': 'Fatou', 
    'fragrance': 'Aïcha',
    'haircare': 'Mariama',
    'bodycare': 'Aminata',
    'natural': 'Binta',
    'multi': 'Adama'
  }
  return names[form.beautyCategory] || 'Adama'
}

const getAgentTypeName = () => {
  const types = {
    'skincare': 'Conseillère Skincare',
    'haircare': 'Conseillère Capillaire',
    'makeup': 'Conseillère Makeup',
    'fragrance': 'Conseillère Parfums',
    'bodycare': 'Conseillère Beauté',
    'natural': 'Conseillère Produits Naturels',
    'multi': 'Conseillère IA'
  }
  return types[form.beautyCategory] || 'Conseillère IA'
}

// ========== NAVIGATION ==========
const nextStep = () => {
  if (currentStep.value < 4) {
    currentStep.value++
    window.scrollTo({ top: 0, behavior: 'smooth' })
  }
}

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
  
  const welcomeMessages = {
    'skincare': `Bonjour ! Je suis ${agentName}, votre conseillère skincare. Quel est votre type de peau ? Je vais vous recommander la routine parfaite !`,
    'makeup': `Salut ! Je suis ${agentName}, votre conseillère maquillage. Pour quelle occasion cherchez-vous le look parfait ?`,
    'fragrance': `Bonjour ! Je suis ${agentName}, votre spécialiste parfums. Quel type de fragrance vous fait rêver ?`,
    'haircare': `Hello ! ${agentName} ici, experte capillaire. Parlez-moi de vos cheveux, je vais vous aider à trouver les soins adaptés !`,
    'bodycare': `Bonjour ! Je suis ${agentName}, spécialiste soins du corps. Comment puis-je sublimer votre routine bien-être ?`,
    'natural': `Bonjour ! Je suis ${agentName}, votre conseillère cosmétiques naturels. Quels sont vos besoins beauté aujourd'hui ?`,
    'multi': `Bonjour ! Je suis ${agentName}, votre conseillère beauté. Dans quel domaine puis-je vous accompagner aujourd'hui ?`
  }

  const fallbackMessages = {
    'beginner': `Je transmets votre question à notre équipe pour un conseil personnalisé adapté à vos besoins.`,
    'expert': `Je contacte notre experte senior pour une analyse approfondie de votre demande spécifique.`,
    'luxury': `Je vous mets en relation avec notre consultante premium pour un accompagnement sur mesure.`
  }

  return {
    name: agentName,
    avatar: `https://ui-avatars.com/api/?name=${agentName}&background=E91E63&color=fff`,
    welcomeMessage: welcomeMessages[form.beautyCategory] || welcomeMessages['multi'],
    fallbackMessage: fallbackMessages[form.expertiseLevel] || fallbackMessages['expert'],
    collectPaymentMethod: true,
    upsellEnabled: form.primaryGoal === 'upsell',
    beautySpecialization: {
      category: form.beautyCategory,
      expertiseLevel: form.expertiseLevel,
      communicationTone: form.communicationTone,
      specializedTarget: form.specializedTarget,
      targetAgeRange: form.targetAgeRange,
      priceRange: form.priceRange,
      primaryGoal: form.primaryGoal
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
    'multi': '💝 Parler à ma conseillère'
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
    
    // ÉTAPE 1: MISE À JOUR SHOP
    const shopData = {
      name: form.company || `${getBeautyCategoryLabel(form.beautyCategory)} de ${user.email?.split('@')[0]}`,
      domain: extractDomain(form.website),
      platform: form.platform,
      
      // Spécialisation beauté
      beauty_category: form.beautyCategory,
      specialized_target: form.specializedTarget,
      target_age_range: form.targetAgeRange,
      price_range: form.priceRange,
      expertise_level: form.expertiseLevel,
      communication_tone: form.communicationTone,
      primary_goal: form.primaryGoal,
      
      // Métadonnées
      acquisition_source: form.acquisitionSource,
      newsletter_subscribed: form.newsletter,
      onboarding_completed: true,
      onboarding_completed_at: new Date().toISOString(),
      
      // Configuration widget
      widget_config: getOptimizedWidgetConfig()
    }
    
    console.log('📊 [Onboarding] Données shop:', shopData)
    
    const shopResponse = await api.shops.update(user.id, shopData)
    
    if (!shopResponse.success) {
      throw new Error(shopResponse.error || 'Erreur mise à jour shop')
    }
    
    console.log('✅ [Onboarding] Shop mis à jour')
    
    // ÉTAPE 2: CRÉER AUTOMATIQUEMENT L'AGENT IA (OBLIGATOIRE)
    console.log('🤖 [Onboarding] Création de la Conseillère IA...')

    // Déterminer le type d'agent basé sur la catégorie beauté
    const beautyCategory = form.beautyCategory || 'multi'
    const agentType = `${beautyCategory}_expert` as const

    // Déterminer la personnalité (défaut: friendly si non sélectionné)
    const agentPersonality = form.communicationTone || 'friendly'

    // Valider que le type est un des types acceptés
    const validAgentTypes = ['skincare_expert', 'makeup_expert', 'fragrance_expert', 'haircare_expert', 'bodycare_expert', 'beauty_expert', 'natural_expert', 'multi_expert']
    const finalAgentType = validAgentTypes.includes(agentType) ? agentType : 'beauty_expert'

    // Valider que la personnalité est une des valeurs acceptées
    const validPersonalities = ['professional', 'friendly', 'expert', 'casual', 'luxury', 'trendy']
    const finalPersonality = validPersonalities.includes(agentPersonality) ? agentPersonality : 'friendly'

    const agentConfig = getOptimizedAgentConfig()

    const agentData = {
      name: form.agentName || getDefaultAgentName(),
      type: finalAgentType,
      personality: finalPersonality,
      description: `${getAgentTypeName()} spécialisée pour ${form.company}`,
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
      // Log détaillé de l'erreur
      console.error('❌ [Onboarding] Erreur création agent:', {
        error: agentResponse.error,
        details: (agentResponse as any).details,
        received: (agentResponse as any).received,
        agentData: agentData
      })

      // ❌ NOUVEAU: La création d'agent est OBLIGATOIRE - on ne peut pas continuer sans
      throw new Error(`Impossible de créer votre Conseillère IA: ${agentResponse.error || 'Erreur inconnue'}`)
    }

    console.log('✅ [Onboarding] Conseillère IA créée avec succès:', agentResponse.data?.id)
    
    // ÉTAPE 3: INDEXATION DU SITE WEB (ASYNCHRONE)
    if (form.website) {
      try {
        console.log('🔍 [Onboarding] Lancement indexation site web...')
        
        api.knowledgeBase.processWebsite({
          url: form.website,
          title: `Site ${form.company}`,
          tags: ['website', 'onboarding', form.beautyCategory || 'multi'],
          beautyCategory: form.beautyCategory
        }).catch(indexError => {
          console.warn('⚠️ [Onboarding] Indexation en arrière-plan échouée (non bloquante):', indexError)
        })
        
      } catch (indexError) {
        console.warn('⚠️ [Onboarding] Erreur lancement indexation (non bloquante):', indexError)
      }
    }
    
    // ÉTAPE 4: SYNCHRONISER LE STORE
    if (authStore.user) {
      await authStore.restoreSession(true)
      console.log('✅ [Onboarding] Store synchronisé')
    }
    
    console.log('🎉 [Onboarding] Onboarding terminé avec succès !')

    // ✅ Sauvegarder un flag en sessionStorage comme backup pour le modal de bienvenue
    sessionStorage.setItem('chatseller_onboarding_just_completed', 'true')

    // REDIRECTION
    window.location.href = `/?onboarding=completed&beauty=true&agent_created=true&category=${form.beautyCategory}&welcome=true`
    
  } catch (error: any) {
    console.error('❌ [Onboarding] Erreur finalisation:', error)
    
    let userMessage = 'Une erreur s\'est produite lors de la création de votre Conseillère IA.'
    
    if (error.message?.includes('Token') || error.message?.includes('401')) {
      userMessage = 'Session expirée. Reconnexion en cours...'
      await navigateTo('/login')
      return
    }
    
    alert(userMessage + '\n\nDétails: ' + (error.message || 'Erreur inconnue'))
    
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
  title: 'Créez votre Conseillère IA - ChatSeller',
  meta: [
    { name: 'description', content: 'Configurez votre Conseillère IA beauté en 3 minutes. Skincare, maquillage, parfums, soins capillaires - votre assistante vend pour vous 24h/24.' },
    { name: 'keywords', content: 'Conseillère IA, skincare, maquillage, parfums, capillaire, beauté Afrique, e-commerce' }
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