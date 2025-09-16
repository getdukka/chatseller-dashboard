<!-- pages/onboarding.vue - ONBOARDING SECTEUR BEAUTÉ -->
<template>
  <div class="min-h-screen bg-gradient-to-br from-rose-50 via-pink-50 to-purple-50 relative overflow-hidden">
    
    <!-- Background Elements Premium -->
    <div class="absolute inset-0 overflow-hidden pointer-events-none">
      <!-- Gradient animé principal -->
      <div class="absolute inset-0 bg-gradient-to-br from-rose-50/80 via-pink-50/60 to-purple-50/80 animate-gradient-xy"></div>
      
      <!-- Éléments décoratifs flottants -->
      <div class="absolute top-20 left-10 w-96 h-96 bg-gradient-to-br from-rose-300/20 to-pink-300/10 rounded-full blur-3xl animate-pulse"></div>
      <div class="absolute bottom-20 right-10 w-80 h-80 bg-gradient-to-br from-purple-300/20 to-rose-300/10 rounded-full blur-3xl animate-pulse" style="animation-delay: 1s"></div>
      <div class="absolute top-1/3 right-1/4 w-32 h-32 bg-gradient-to-br from-pink-400/15 to-rose-400/10 rounded-full blur-2xl animate-bounce" style="animation-delay: 2s"></div>
    </div>
    
    <!-- Header avec logo et progression -->
    <header class="relative z-10 p-6">
      <div class="flex items-center justify-between">
        <!-- Logo  premium -->
        <div class="flex items-center space-x-3">
          <div class="relative">
            <div class="flex h-12 w-12 items-center justify-center bg-transparent">
              <img 
                src="/assets/images/logos/fav.svg" 
                alt="ChatSeller" 
                class="w-10 h-10"
              />
            </div>
            <div class="absolute inset-0 rounded-2xl bg-gradient-to-tr from-white/20 to-transparent"></div>
          </div>
          <div>
            <span class="text-2xl font-bold text-black">ChatSeller</span><span class="text-2xl font-bold text-rose-600">.</span>
            <div class="text-sm font-medium text-rose-400">by Dukka</div>
          </div>
        </div>
        
        <!-- Welcome message beauté -->
        <div v-if="!initializing" class="hidden md:block text-right">
          <p class="text-rose-600 text-sm font-medium">Configuration de votre espace Chatseller</p>
          <p class="text-gray-800 font-semibold">{{ userFirstName }}, personnalisons votre expérience !</p>
        </div>
      </div>
    </header>

    <!-- Message d'initialisation beauté -->
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
        <h3 class="text-2xl font-bold text-gray-900 mb-3">Préparation de votre tableau de bord...</h3>
        <p class="text-gray-600">Configuration de votre espace Chatseller.</p>
      </div>
    </div>

    <!-- Contenu principal onboarding beauté -->
    <div v-else class="relative z-10">
      <!-- Progress bar beauté premium -->
      <div class="px-6 pb-8">
        <div class="max-w-6xl mx-auto">
          <!-- Info sur le processus beauté -->
          <div class="text-center mb-8">
            <div class="inline-flex items-center px-4 py-2 bg-gradient-to-r from-rose-50 to-pink-50 border border-rose-200 rounded-full mb-4">
              <svg class="w-4 h-4 text-green-500 mr-2" fill="currentColor" viewBox="0 0 24 24">
                <path d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z"/>
              </svg>
              <span class="text-sm font-semibold text-rose-700">Email confirmé</span>
            </div>
            <h1 class="text-3xl md:text-4xl font-bold bg-gradient-to-r from-gray-900 via-rose-800 to-purple-900 bg-clip-text text-transparent mb-3">
              Configurons votre espace Chatseller
            </h1>
            <p class="text-lg text-gray-600 max-w-2xl mx-auto">
              Ces informations nous permettent de créer une expérience personnalisée 
              <span class="font-semibold text-rose-600">parfaitement adaptée</span> à votre marque.
            </p>
          </div>
          
          <div class="flex items-center justify-between text-sm text-gray-600 mb-4">
            <span class="font-medium">Étape {{ currentStep }} sur 4</span>
            <span class="font-medium">{{ Math.round((currentStep / 4) * 100) }}% terminé</span>
          </div>
          
          <!-- Barre de progression beauté -->
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
          
          <!-- Étape 1: Profil marque beauté -->
          <div v-if="currentStep === 1" class="transition-all duration-500 ease-in-out">
            <div class="grid lg:grid-cols-2 gap-12 items-center">
              
              <!-- Colonne gauche : Titre et description -->
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
                  Parlez-nous de votre marque et de votre activité
                </p>
                <div class="bg-gradient-to-r from-rose-50 to-pink-50 border border-rose-200 rounded-xl p-6 text-left">
                  <p class="text-rose-800 text-sm leading-relaxed">
                    <strong class="text-rose-900">Personnalisation intelligente :</strong><br>
                    Nous analysons votre site web et créons automatiquement une base de connaissances pour votre Conseillère IA, afin qu'elle puisse se familiariser avec vos produits et votre marque.                    
                  </p>
                </div>
              </div>

              <!-- Colonne droite : Formulaire -->
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
                          placeholder="Ex: Belle Étoile Cosmétiques"
                        />
                        <p class="text-gray-500 text-sm mt-2">Ce nom apparaîtra dans vos conversations avec vos clients</p>
                      </div>

                      <div>
                        <label class="block text-lg font-semibold text-gray-800 mb-3">
                          Site web de votre marque *
                        </label>
                        <input
                          v-model="form.website"
                          type="url"
                          required
                          class="w-full px-6 py-4 bg-white/70 border border-rose-200 rounded-xl focus:ring-2 focus:ring-rose-500 focus:border-rose-500 transition-all text-gray-900 text-lg placeholder-gray-500"
                          placeholder="https://belletoile-cosmetiques.fr"
                        />
                        <p class="text-gray-500 text-sm mt-2">
                          <svg class="w-4 h-4 text-green-500 inline mr-1" fill="currentColor" viewBox="0 0 24 24">
                            <path d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z"/>
                          </svg>
                          Nous utiliserons son contenu pour former votre Conseillère IA
                        </p>
                      </div>

                      <div>
                        <label class="block text-lg font-semibold text-gray-800 mb-3">
                          Votre domaine d'activité *
                        </label>
                        <select
                          v-model="form.beautyCategory"
                          required
                          class="w-full px-6 py-4 bg-white/70 border border-rose-200 rounded-xl focus:ring-2 focus:ring-rose-500 focus:border-rose-500 transition-all text-gray-900 text-lg"
                        >
                          <option value="" class="bg-white">Sélectionnez votre spécialité</option>
                          <option value="skincare" class="bg-white">🧴 Skincare & Soins du visage</option>
                          <option value="makeup" class="bg-white">💄 Maquillage & Cosmétiques</option>
                          <option value="fragrance" class="bg-white">🌸 Parfums & Fragrances</option>
                          <option value="haircare" class="bg-white">💇‍♀️ Soins capillaires</option>
                          <option value="bodycare" class="bg-white">🧴 Soins du corps</option>
                          <option value="multi" class="bg-white">✨ Multi-catégories beauté</option>
                        </select>
                        <p class="text-gray-500 text-sm mt-2">Votre Conseillère sera spécialisée dans ce domaine</p>
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
                        <p class="text-gray-500 text-sm mt-2">Pour préparer l'intégration de votre widget</p>
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

          <!-- Étape 2: Clientèle cible beauté (ADAPTATIVE) -->
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
                    Tranche d'âge principale de vos client.e.s *
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

          <!-- Étape 3: Style de conseil et expertise -->
          <div v-if="currentStep === 3" class="transition-all duration-500 ease-in-out">
            <div class="text-center mb-12">
              <div class="inline-flex p-4 bg-gradient-to-br from-pink-100 to-rose-100 rounded-2xl mb-6">
                <svg class="w-12 h-12 text-pink-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9.663 17h4.673M12 3v1m6.364 1.636l-.707.707M21 12h-1M4 12H3m3.343-5.657l-.707-.707m2.828 9.9a5 5 0 117.072 0l-.548.547A3.374 3.374 0 0014 18.469V19a2 2 0 11-4 0v-.531c0-.895-.356-1.754-.988-2.386l-.548-.547z"/>
                </svg>
              </div>
              <h1 class="text-4xl sm:text-5xl lg:text-6xl font-bold mb-6 bg-gradient-to-r from-pink-600 via-rose-600 to-purple-600 bg-clip-text text-transparent">
                Votre style de conseil
              </h1>
              <p class="text-xl lg:text-2xl text-gray-700 max-w-4xl mx-auto mb-8">
                Comment souhaitez-vous que votre Conseillère IA interagisse avec vos client.e.s ?
              </p>
              <div class="bg-gradient-to-r from-pink-50 to-rose-50 border border-pink-200 rounded-xl p-6 max-w-2xl mx-auto">
                <p class="text-pink-800 text-sm leading-relaxed">
                  <strong class="text-pink-900">Personnalité adaptée :</strong><br>
                  Votre Conseillère IA adoptera le ton et l'approche qui correspondent à votre clientèle.
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

          <!-- Étape 4: Finalisation et lancement -->
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
                  Prêt à décoller !
                </h1>
                <p class="text-xl lg:text-2xl text-gray-700 mb-8">
                  Votre Conseillère IA va être créée avec vos paramètres
                </p>

                <!-- Récapitulatif des choix -->
                <div class="bg-gradient-to-r from-emerald-50 to-green-50 border border-emerald-200 rounded-2xl p-6 mb-8 text-left">
                  <h3 class="font-bold text-emerald-800 mb-4 text-lg">Récapitulatif de vos réponses :</h3>
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
                      Indexation automatique de votre site web
                    </div>
                    <div class="flex items-center">
                      <svg class="w-4 h-4 text-green-500 mr-2" fill="currentColor" viewBox="0 0 24 24">
                        <path d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z"/>
                      </svg>
                      Base de connaissances pré-remplie
                    </div>
                    <div class="flex items-center">
                      <svg class="w-4 h-4 text-green-500 mr-2" fill="currentColor" viewBox="0 0 24 24">
                        <path d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z"/>
                      </svg>
                      Personnalité adaptée à vos clients
                    </div>
                    <div class="flex items-center">
                      <svg class="w-4 h-4 text-green-500 mr-2" fill="currentColor" viewBox="0 0 24 24">
                        <path d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z"/>
                      </svg>
                      Widget prêt pour {{ form.platform }}
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
                          Nom de votre Conseillère IA
                        </label>
                        <input
                          v-model="form.agentName"
                          type="text"
                          class="w-full px-6 py-4 bg-white/70 border border-rose-200 rounded-xl focus:ring-2 focus:ring-rose-500 focus:border-rose-500 transition-all text-gray-900 text-lg placeholder-gray-500"
                          :placeholder="getDefaultAgentName()"
                        />
                        <p class="text-gray-500 text-sm mt-2">Laissez vide pour utiliser le nom suggéré selon votre domaine</p>
                      </div>

                      <!-- Acquisition source -->
                      <div>
                        <label class="block text-lg font-semibold text-gray-800 mb-3">
                          Comment avez-vous connu ChatSeller ?
                        </label>
                        <select
                          v-model="form.acquisitionSource"
                          class="w-full px-6 py-4 bg-white/70 border border-rose-200 rounded-xl focus:ring-2 focus:ring-rose-500 focus:border-rose-500 transition-all text-gray-900 text-lg"
                        >
                          <option value="" class="bg-white">Sélectionnez une source</option>
                          <option value="search_google" class="bg-white">Recherche Google</option>
                          <option value="social_media" class="bg-white">Réseaux sociaux (LinkedIn, Instagram, Facebook)</option>
                          <option value="recommendation" class="bg-white">Recommandation d'une autre marque beauté</option>
                          <option value="beauty_blog" class="bg-white">Blog ou média beauté</option>
                          <option value="youtube" class="bg-white">YouTube</option>
                          <option value="beauty_event" class="bg-white">Salon beauté / événement professionnel</option>
                          <option value="advertising" class="bg-white">Publicité en ligne</option>
                          <option value="other" class="bg-white">Autre</option>
                        </select>
                      </div>

                      <!-- Newsletter -->
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
                              Conseils d'optimisation
                            </label>
                            <p class="text-sm text-rose-700 mt-1">
                              Recevez nos meilleures pratiques pour maximiser vos conversions, nouvelles fonctionnalités et études de cas de marques (1-2 emails/mois maximum)
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
                            <p class="font-bold text-green-800 mb-2 text-lg">Votre essai gratuit de 14 jours commence maintenant !</p>
                            <p class="text-green-700 text-sm">
                              Testez toutes les fonctionnalités premium sans engagement. Aucune carte de crédit requise.
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
                          Configuration de votre espace...
                        </span>
                        <span v-else class="flex items-center justify-center">
                          Accéder à votre espace
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

definePageMeta({
  layout: false
})

// ✅ COMPOSABLES
const auth = useAuth()
const authStore = useAuthStore()
const supabase = useSupabase()

// ✅ STATE
const currentStep = ref(1)
const loading = ref(false)
const initializing = ref(true)

// ✅ FORMULAIRE ADAPTATIF BEAUTÉ
const form = reactive({
  // Étape 1 : Profil marque beauté
  company: '',
  website: '',
  beautyCategory: '', // skincare, makeup, fragrance, haircare, bodycare, multi
  platform: '',
  
  // Étape 2 : Clientèle cible (ADAPTATIVE)
  specializedTarget: [] as string[], // Variable adaptative selon domaine
  targetAgeRange: '', // 18-25, 26-35, 36-45, 46+
  priceRange: '', // budget, mid, luxury
  
  // Étape 3 : Style de conseil
  expertiseLevel: '', // beginner, expert, luxury
  communicationTone: '', // friendly, professional, luxury, trendy
  primaryGoal: '', // conversions, upsell, support, education
  
  // Étape 4 : Finalisation
  agentName: '',
  acquisitionSource: '',
  newsletter: true
})

// ✅ OPTIONS SPÉCIALISÉES PAR DOMAINE BEAUTÉ
const specializedTargetOptions = {
  skincare: [
    { value: 'normal', icon: '😊', label: 'Peau normale', description: 'Équilibrée, peu de problèmes' },
    { value: 'dry', icon: '💧', label: 'Peau sèche', description: 'Manque d\'hydratation' },
    { value: 'oily', icon: '✨', label: 'Peau grasse', description: 'Excès de sébum' },
    { value: 'combination', icon: '🤔', label: 'Peau mixte', description: 'Zone T grasse, joues sèches' },
    { value: 'sensitive', icon: '🌸', label: 'Peau sensible', description: 'Réactive, intolérances' },
    { value: 'mature', icon: '👑', label: 'Peau mature', description: 'Anti-âge, fermeté' }
  ],
  haircare: [
    { value: 'straight', icon: '📏', label: 'Cheveux lisses', description: 'Naturellement droits' },
    { value: 'wavy', icon: '〰️', label: 'Cheveux ondulés', description: 'Légèrement bouclés' },
    { value: 'curly', icon: '🌀', label: 'Cheveux bouclés', description: 'Boucles marquées' },
    { value: 'coily', icon: '🔄', label: 'Cheveux crépus', description: 'Texture afro, spiralée' },
    { value: 'fine', icon: '🪶', label: 'Cheveux fins', description: 'Texture délicate' },
    { value: 'thick', icon: '💪', label: 'Cheveux épais', description: 'Volume naturel' }
  ],
  makeup: [
    { value: 'natural', icon: '🌱', label: 'Look naturel', description: 'Maquillage discret quotidien' },
    { value: 'professional', icon: '👔', label: 'Look professionnel', description: 'Bureau, réunions' },
    { value: 'evening', icon: '🌙', label: 'Look soirée', description: 'Événements, sorties' },
    { value: 'glamour', icon: '✨', label: 'Look glamour', description: 'Occasions spéciales' },
    { value: 'editorial', icon: '📸', label: 'Look éditorial', description: 'Créatif, artistique' },
    { value: 'bridal', icon: '👰', label: 'Look mariage', description: 'Mariée, témoins' }
  ],
  fragrance: [
    { value: 'floral', icon: '🌸', label: 'Floral', description: 'Rose, jasmin, pivoine' },
    { value: 'woody', icon: '🌲', label: 'Boisé', description: 'Santal, cèdre, patchouli' },
    { value: 'oriental', icon: '🏺', label: 'Oriental', description: 'Vanille, ambre, épices' },
    { value: 'fresh', icon: '🍃', label: 'Frais', description: 'Agrumes, aquatique' },
    { value: 'fruity', icon: '🍑', label: 'Fruité', description: 'Pêche, pomme, baies' },
    { value: 'gourmand', icon: '🍰', label: 'Gourmand', description: 'Chocolat, caramel, miel' }
  ],
  bodycare: [
    { value: 'hydrating', icon: '💧', label: 'Hydratation', description: 'Peaux sèches, déshydratées' },
    { value: 'firming', icon: '💪', label: 'Fermeté', description: 'Anti-âge corporel' },
    { value: 'exfoliating', icon: '✨', label: 'Exfoliation', description: 'Gommages, renouvellement' },
    { value: 'cellulite', icon: '🎯', label: 'Anti-cellulite', description: 'Raffermissement ciblé' },
    { value: 'sensitive', icon: '🌸', label: 'Peaux sensibles', description: 'Formules douces' },
    { value: 'sun', icon: '☀️', label: 'Solaire', description: 'Protection, après-soleil' }
  ],
  multi: [
    { value: 'skincare', icon: '🧴', label: 'Soins visage', description: 'Routine skincare' },
    { value: 'makeup', icon: '💄', label: 'Maquillage', description: 'Cosmétiques couleur' },
    { value: 'haircare', icon: '💇‍♀️', label: 'Soins cheveux', description: 'Shampooings, masques' },
    { value: 'fragrance', icon: '🌸', label: 'Parfums', description: 'Eaux de parfum, toilette' },
    { value: 'bodycare', icon: '🧴', label: 'Soins corps', description: 'Hydratation corporelle' },
    { value: 'wellness', icon: '🧘‍♀️', label: 'Bien-être', description: 'Aromathérapie, détente' }
  ]
}

// ✅ OPTIONS COMMUNES
const ageRanges = [
  { value: '18-25', label: '18-25 ans', description: 'Jeunes adultes' },
  { value: '26-35', label: '26-35 ans', description: 'Adultes actifs' },
  { value: '36-45', label: '36-45 ans', description: 'Adultes établis' },
  { value: '46+', label: '46+ ans', description: 'Adultes matures' }
]

const priceRanges = [
  { value: 'budget', icon: '💝', label: 'Accessible', description: '5-25€ par produit' },
  { value: 'mid', icon: '💎', label: 'Milieu de gamme', description: '25-80€ par produit' },
  { value: 'luxury', icon: '👑', label: 'Luxe & Premium', description: '80€+ par produit' }
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
    label: 'Conseillère de luxe', 
    description: 'Service premium avec expertise pointue' 
  }
]

const communicationTones = [
  {
    value: 'friendly',
    icon: '😊',
    label: 'Amicale & Chaleureuse',
    description: 'Ton bienveillant, comme une amie qui conseille',
    example: 'Salut ma belle ! Je vais t\'aider à trouver le parfait soin pour ta peau.'
  },
  {
    value: 'professional',
    icon: '👩‍💼',
    label: 'Professionnelle & Experte',
    description: 'Approche consultante, crédible et rassurante',
    example: 'Bonjour, je suis votre conseillère beauté. Analysons ensemble vos besoins.'
  },
  {
    value: 'luxury',
    icon: '✨',
    label: 'Luxe & Raffinée',
    description: 'Service premium, attention particulière',
    example: 'Madame, il me fait plaisir de vous accompagner dans votre quête de beauté.'
  },
  {
    value: 'trendy',
    icon: '🌟',
    label: 'Tendance & Moderne',
    description: 'Langage actuel, références aux tendances',
    example: 'Hey ! Tu vas adorer cette routine skincare qui cartonne sur TikTok !'
  }
]

const primaryGoals = [
  {
    value: 'conversions',
    icon: '📈',
    label: 'Maximiser les conversions',
    description: 'Focus sur la transformation visiteur → acheteur'
  },
  {
    value: 'upsell',
    icon: '🛍️',
    label: 'Augmenter le panier moyen',
    description: 'Routines complètes et ventes additionnelles'
  },
  {
    value: 'support',
    icon: '💬',
    label: 'Réduire les questions SAV',
    description: 'Réponses autonomes aux questions fréquentes'
  },
  {
    value: 'education',
    icon: '🎓',
    label: 'Éduquer et fidéliser',
    description: 'Construire la confiance par l\'expertise'
  }
]

// ✅ COMPUTED
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

// ✅ HELPERS POUR TEXTES ADAPTATIFS (ÉTAPE 2)
const getClienteleTitle = () => {
  const titles = {
    skincare: 'Vos client.e.s skincare',
    haircare: 'Vos client.e.s capillaires',
    makeup: 'Vos client.e.s maquillage',
    fragrance: 'Vos client.e.s parfums',
    bodycare: 'Vos client.e.s soins corps',
    multi: 'Vos client.e.s'
  }
  return titles[form.beautyCategory] || 'Vos client.e.s'
}

const getClienteleDescription = () => {
  const descriptions = {
    skincare: 'Qui sont vos client.e.s ? Cela nous aide à adapter les conseils selon leur type de peau et besoins.',
    haircare: 'Qui sont vos client.e.s ? Cela nous aide à adapter les conseils selon leur type de cheveux et routine.',
    makeup: 'Qui sont vos client.e.s ? Cela nous aide à adapter les conseils selon leurs occasions et style de maquillage.',
    fragrance: 'Qui sont vos client.e.s ? Cela nous aide à adapter les conseils selon leurs préférences olfactives.',
    bodycare: 'Qui sont vos client.e.s ? Cela nous aide à adapter les conseils selon leurs besoins corporels spécifiques.',
    multi: 'Qui sont vos client.e.s ? Cela nous aide à adapter le langage et les réponses de votre Conseillère IA.'
  }
  return descriptions[form.beautyCategory] || 'Qui sont vos client.e.s ? Cela nous aide à adapter le langage et les réponses de votre Conseillère IA.'
}

const getClienteleExplanation = () => {
  const explanations = {
    skincare: 'Plus nous connaissons les types de peau de vos client.e.s, mieux votre Conseillère pourra recommander les soins adaptés.',
    haircare: 'Plus nous connaissons les types de cheveux de vos client.e.s, mieux votre Conseillère pourra conseiller les soins capillaires.',
    makeup: 'Plus nous connaissons les occasions maquillage de vos client.e.s, mieux votre Conseillère pourra proposer les looks appropriés.',
    fragrance: 'Plus nous connaissons les goûts olfactifs de vos client.e.s, mieux votre Conseillère pourra orienter vers les bonnes familles de parfums.',
    bodycare: 'Plus nous connaissons les besoins corporels de vos client.e.s, mieux votre Conseillère pourra recommander les soins adaptés.',
    multi: 'Plus nous connaissons vos client.e.s, mieux votre Conseillère pourra les accompagner selon leurs besoins beauté variés.'
  }
  return explanations[form.beautyCategory] || 'Plus nous connaissons vos client.e.s, mieux votre Conseillère pourra les accompagner selon leurs besoins.'
}

const getSpecializedQuestion = () => {
  const questions = {
    skincare: 'Quels types de peau conseillez-vous principalement ?',
    haircare: 'Quels types de cheveux conseillez-vous principalement ?',
    makeup: 'Quels styles de maquillage proposez-vous principalement ?',
    fragrance: 'Quelles familles olfactives proposez-vous principalement ?',
    bodycare: 'Quels types de soins corporels proposez-vous principalement ?',
    multi: 'Quels domaines beauté couvrez-vous principalement ?'
  }
  return questions[form.beautyCategory] || 'Quels sont vos domaines de spécialité principaux ?'
}

const getSpecializedOptions = () => {
  return specializedTargetOptions[form.beautyCategory] || specializedTargetOptions.multi
}

// ✅ HELPERS POUR LABELS
const getBeautyCategoryLabel = (value: string) => {
  const categories = {
    'skincare': '🧴 Skincare & Soins du visage',
    'makeup': '💄 Maquillage & Cosmétiques', 
    'fragrance': '🌸 Parfums & Fragrances',
    'haircare': '💇‍♀️ Soins capillaires',
    'bodycare': '🧴 Soins du corps',
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

const getDefaultAgentName = () => {
  const names = {
    'skincare': 'Camille',
    'makeup': 'Léa', 
    'fragrance': 'Chloé',
    'haircare': 'Amélie',
    'bodycare': 'Sarah',
    'multi': 'Rose'
  }
  return names[form.beautyCategory] || 'Rose'
}

// ✅ NAVIGATION
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

// ✅ HELPER POUR EXTRAIRE DOMAINE
const extractDomain = (url: string): string | null => {
  if (!url) return null
  try {
    const domain = new URL(url.startsWith('http') ? url : `https://${url}`).hostname
    return domain.replace('www.', '')
  } catch {
    return null
  }
}

// ✅ CONFIGURATION AGENT SPÉCIALISÉE BEAUTÉ
const getOptimizedAgentConfig = () => {
  const agentName = form.agentName || getDefaultAgentName()
  
  // Messages selon domaine beauté
  const welcomeMessages = {
    'skincare': `Bonjour ! Je suis ${agentName}, votre experte skincare. Quel est votre type de peau ? Je vais vous conseiller la routine parfaite !`,
    'makeup': `Salut ! ${agentName}, votre conseillère maquillage. Pour quelle occasion cherchez-vous le look parfait ?`,
    'fragrance': `Bonjour ! Je suis ${agentName}, votre spécialiste parfums. Quel type de fragrance vous fait rêver ?`,
    'haircare': `Hello ! ${agentName} ici, experte capillaire. Parlez-moi de vos cheveux, je vais vous chouchouter !`,
    'bodycare': `Bonjour ! ${agentName}, spécialiste soins du corps. Comment puis-je sublimer votre routine bien-être ?`,
    'multi': `Bonjour ! Je suis ${agentName}, votre conseillère beauté. Dans quel domaine puis-je vous accompagner aujourd'hui ?`
  }

  // Messages fallback selon expertise
  const fallbackMessages = {
    'beginner': `Je transmets votre question à notre équipe beauté pour un conseil personnalisé adapté à vos besoins.`,
    'expert': `Je contacte notre experte senior pour une analyse approfondie de votre demande spécifique.`,
    'luxury': `Je vous mets en relation avec notre consultante premium pour un accompagnement sur mesure.`
  }

  // Personnalité selon ton
  const personalities = {
    'friendly': { warmth: 'high', formality: 'low', enthusiasm: 'high' },
    'professional': { warmth: 'medium', formality: 'high', enthusiasm: 'medium' },
    'luxury': { warmth: 'medium', formality: 'high', enthusiasm: 'refined' },
    'trendy': { warmth: 'high', formality: 'low', enthusiasm: 'very_high' }
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
      specializedTarget: form.specializedTarget, // ✅ Données adaptatives
      targetAgeRange: form.targetAgeRange,
      priceRange: form.priceRange,
      primaryGoal: form.primaryGoal,
      personality: personalities[form.communicationTone] || personalities['professional']
    }
  }
}

// ✅ CONFIGURATION WIDGET BEAUTÉ
const getOptimizedWidgetConfig = () => {
  const colors = {
    'skincare': '#4CAF50',
    'makeup': '#E91E63', 
    'fragrance': '#9C27B0',
    'haircare': '#FF9800',
    'bodycare': '#03DAC5',
    'multi': '#E91E63'
  }
  
  const buttonTexts = {
    'skincare': '✨ Conseil skincare',
    'makeup': '💄 Conseil maquillage',
    'fragrance': '🌸 Conseil parfum',
    'haircare': '💇‍♀️ Conseil capillaire',
    'bodycare': '🧴 Conseil corps',
    'multi': '💝 Parler à la conseillère'
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

// ✅ COMPLETION ONBOARDING AVEC INDEXATION
const completeOnboarding = async () => {
  loading.value = true
  
  try {
    console.log('🚀 [Onboarding Beauty] Finalisation avec données beauté...')
    
    const { data: { user } } = await supabase.auth.getUser()
    
    if (!user) {
      console.error('❌ [Onboarding Beauty] Pas d\'utilisateur connecté')
      await navigateTo('/login')
      return
    }
    
    console.log('✅ [Onboarding Beauty] Utilisateur connecté:', user.email)
    
    // ✅ DONNÉES SHOP BEAUTÉ ENRICHIES
    const shopData = {
      name: form.company || `${getBeautyCategoryLabel(form.beautyCategory)} de ${user.email?.split('@')[0]}`,
      domain: extractDomain(form.website),
      platform: form.platform,
      
      // ✅ SPÉCIALISATION BEAUTÉ
      beauty_category: form.beautyCategory,
      specialized_target: form.specializedTarget, // ✅ Données adaptatives sauvées
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
      
      // ✅ CONFIGURATION SPÉCIALISÉE BEAUTÉ
      agent_config: getOptimizedAgentConfig(),
      widget_config: getOptimizedWidgetConfig()
    }
    
    const config = useRuntimeConfig()
    const baseURL = config.public.apiBaseUrl
    
    // ✅ MISE À JOUR VIA API
    try {
      const shopResponse = await $fetch(`/api/v1/shops/${user.id}`, {
        method: 'PUT',
        baseURL,
        headers: {
          'Authorization': `Bearer ${authStore.token}`,
          'Content-Type': 'application/json'
        },
        body: shopData
      })
      
      console.log('✅ [Onboarding Beauty] Shop mis à jour avec données beauté')
      
    } catch (updateError: any) {
      if (updateError.status === 404) {
        // Créer le shop s'il n'existe pas
        const createResponse = await $fetch('/api/v1/shops', {
          method: 'POST',
          baseURL,
          headers: {
            'Authorization': `Bearer ${authStore.token}`,
            'Content-Type': 'application/json'
          },
          body: {
            id: user.id,
            email: user.email,
            subscription_plan: 'free',
            is_active: true,
            ...shopData
          }
        })
        
        console.log('✅ [Onboarding Beauty] Shop créé avec spécialisation beauté')
      } else {
        throw updateError
      }
    }
    
    // ✅ LANCER L'INDEXATION DU SITE WEB (ASYNCHRONE)
    if (form.website) {
      try {
        console.log('🔍 [Onboarding Beauty] Lancement indexation site web...')
        
        // Lancer l'indexation en arrière-plan (fire & forget)
        $fetch('/api/v1/knowledge-base/index-website', {
          method: 'POST',
          baseURL,
          headers: {
            'Authorization': `Bearer ${authStore.token}`,
            'Content-Type': 'application/json'
          },
          body: {
            shop_id: user.id,
            website_url: form.website,
            beauty_category: form.beautyCategory,
            priority: 'high'
          }
        }).catch(indexError => {
          console.warn('⚠️ [Onboarding Beauty] Indexation en arrière-plan:', indexError)
          // Ne pas bloquer l'onboarding si l'indexation échoue
        })
        
      } catch (indexError) {
        console.warn('⚠️ [Onboarding Beauty] Erreur indexation (non bloquante):', indexError)
        // Continuer même si l'indexation échoue
      }
    }
    
    // ✅ SYNCHRONISER LE STORE
    if (authStore.user) {
      await authStore.restoreSession(true)
      console.log('✅ [Onboarding Beauty] Store synchronisé')
    }
    
    console.log('🎉 [Onboarding Beauty] Finalisation terminée!')
    
    // ✅ REDIRECTION AVEC PARAMÈTRES BEAUTÉ
    window.location.href = `/?onboarding=completed&beauty=true&category=${form.beautyCategory}&welcome=true`
    
  } catch (error: any) {
    console.error('❌ [Onboarding Beauty] Erreur finalisation:', error)
    
    let userMessage = 'Une erreur s\'est produite lors de la création de votre Conseillère Beauté.'
    
    if (error.status === 401) {
      userMessage = 'Session expirée. Reconnexion en cours...'
      await navigateTo('/login')
      return
    }
    
    alert(userMessage + '\n\nDétails: ' + (error.message || 'Erreur inconnue'))
    
  } finally {
    loading.value = false
  }
}

// ✅ INITIALISATION
onMounted(async () => {
  try {
    console.log('🔄 [Onboarding Beauty] Initialisation...')
    
    if (!auth.isAuthenticated.value) {
      console.log('❌ [Onboarding Beauty] Non connecté')
      await navigateTo('/login')
      return
    }
    
    const { data: { user } } = await supabase.auth.getUser()
    
    if (!user || !user.email_confirmed_at) {
      console.log('❌ [Onboarding Beauty] Email non confirmé')
      await navigateTo('/register')
      return
    }
    
    // ✅ PRÉ-REMPLIR LE FORMULAIRE
    if (user.user_metadata?.company) {
      form.company = user.user_metadata.company
    }
    
    console.log('✅ [Onboarding Beauty] Initialisé pour marque beauté:', user.email)
    
  } catch (error: any) {
    console.error('❌ [Onboarding Beauty] Erreur initialisation:', error)
    await navigateTo('/login')
  } finally {
    initializing.value = false
  }
})

useHead({
  title: 'Configuration de votre Conseillère IA - ChatSeller',
  meta: [
    { name: 'description', content: 'Configurez votre Conseillère IA spécialisée selon votre marque : skincare, maquillage, parfums ou soins capillaires.' },
    { name: 'keywords', content: 'Conseillère IA, skincare, maquillage, parfums, capillaire, onboarding beauté' }
  ]
})
</script>

<style scoped>
/* Gradient animé pour le background */
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

.hover\\:scale-105:hover {
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