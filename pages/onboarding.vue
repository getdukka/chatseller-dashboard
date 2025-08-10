<!-- pages/onboarding.vue - VERSION UX AMÉLIORÉE -->
<template>
  <div class="min-h-screen bg-gray-900 text-white relative overflow-hidden">
    
    <!-- Background avec gradient -->
    <div class="absolute inset-0 bg-gradient-to-br from-blue-900 via-gray-900 to-purple-900"></div>
    <div class="absolute inset-0 bg-black/20"></div>
    
    <!-- Header avec logo et progression -->
    <header class="relative z-10 p-6">
      <div class="flex items-center justify-between">
        <div class="flex items-center space-x-3">
          <div class="flex h-10 w-10 items-center justify-center rounded-xl bg-blue-600 shadow-lg">
            <span class="text-lg font-bold text-white">CS</span>
          </div>
          <span class="text-2xl font-bold text-white">ChatSeller</span>
        </div>
        
        <!-- Welcome message -->
        <div v-if="!initializing" class="hidden md:block text-right">
          <p class="text-blue-200 text-sm">Finalisation de votre inscription</p>
          <p class="text-white font-medium">{{ userFirstName }}, configurons votre espace !</p>
        </div>
      </div>
    </header>

    <!-- Message d'initialisation -->
    <div v-if="initializing" class="relative z-10 flex items-center justify-center min-h-[60vh]">
      <div class="bg-gray-800/30 backdrop-blur border border-gray-700 rounded-2xl p-8 text-center max-w-md">
        <div class="flex justify-center mb-4">
          <div class="w-12 h-12 bg-blue-600/20 rounded-full flex items-center justify-center">
            <svg class="animate-spin w-6 h-6 text-blue-400" fill="none" viewBox="0 0 24 24">
              <circle class="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" stroke-width="4"></circle>
              <path class="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
            </svg>
          </div>
        </div>
        <h3 class="text-xl font-semibold text-white mb-2">Préparation de votre espace...</h3>
        <p class="text-gray-300">Configuration de votre tableau de bord ChatSeller</p>
      </div>
    </div>

    <!-- Contenu principal onboarding -->
    <div v-else class="relative z-10">
      <!-- Progress bar moderne -->
      <div class="px-6 pb-8">
        <div class="max-w-6xl mx-auto">
          <!-- Info sur le processus -->
          <div class="text-center mb-6">
            <p class="text-blue-200 text-sm">✅ Email confirmé</p>
            <h1 class="text-2xl md:text-3xl font-bold text-white mt-1">Finalisons votre inscription</h1>
            <p class="text-gray-300 mt-2">Ces informations nous aident à personnaliser votre expérience ChatSeller</p>
          </div>
          
          <div class="flex items-center justify-between text-sm text-gray-300 mb-4">
            <span>Étape {{ currentStep }} sur 4</span>
            <span>{{ Math.round((currentStep / 4) * 100) }}% terminé</span>
          </div>
          
          <!-- Barre de progression moderne -->
          <div class="w-full bg-gray-800 rounded-full h-2 shadow-inner">
            <div 
              class="h-2 rounded-full bg-gradient-to-r from-blue-500 to-purple-500 transition-all duration-700 ease-out shadow-lg"
              :style="{ width: `${(currentStep / 4) * 100}%` }"
            ></div>
          </div>
        </div>
      </div>

      <!-- Contenu principal -->
      <div class="px-6 pb-6">
        <div class="max-w-7xl mx-auto">
          
          <!-- Étape 1: Informations entreprise -->
          <div v-if="currentStep === 1" class="transition-all duration-500 ease-in-out">
            <div class="grid lg:grid-cols-2 gap-12 items-center">
              
              <!-- Colonne gauche : Titre et description -->
              <div class="text-center lg:text-left">
                <div class="inline-flex p-4 bg-blue-600/20 rounded-2xl mb-6 lg:mb-8">
                  <svg class="w-12 h-12 text-blue-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-4m-5 0H9m0 0H5m0 0H3m2 0v-4m0 4h4"/>
                  </svg>
                </div>
                <h1 class="text-4xl sm:text-5xl lg:text-6xl font-bold mb-4 bg-gradient-to-r from-blue-400 to-purple-400 bg-clip-text text-transparent">
                  Votre entreprise
                </h1>
                <p class="text-xl lg:text-2xl text-gray-300 mb-6">
                  Personnalisons ChatSeller pour votre activité
                </p>
                <div class="bg-blue-900/20 border border-blue-800 rounded-xl p-6 text-left">
                  <p class="text-blue-200 text-sm leading-relaxed">
                    <strong class="text-blue-100">Pourquoi ces informations ?</strong><br>
                    Nous utilisons ces données pour configurer automatiquement votre Vendeur IA avec le bon ton, les bons messages d'accueil, et des recommandations adaptées à votre secteur.
                  </p>
                </div>
              </div>

              <!-- Colonne droite : Formulaire -->
              <div class="w-full">
                <form @submit.prevent="nextStep" class="space-y-6">
                  <div class="bg-gray-800/30 backdrop-blur border border-gray-700 rounded-2xl p-8">
                    <div class="space-y-6">
                      <div>
                        <label class="block text-lg font-medium text-gray-200 mb-3">
                          Nom de l'entreprise *
                        </label>
                        <input
                          v-model="form.company"
                          type="text"
                          required
                          class="w-full px-6 py-4 bg-gray-800/50 border border-gray-700 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all text-white text-lg placeholder-gray-400"
                          placeholder="Ex: Boutique Mode Parisienne"
                        />
                        <p class="text-gray-400 text-sm mt-2">Ce nom apparaîtra dans vos paramètres et rapports</p>
                      </div>

                      <div>
                        <label class="block text-lg font-medium text-gray-200 mb-3">
                          Site web
                        </label>
                        <input
                          v-model="form.website"
                          type="url"
                          class="w-full px-6 py-4 bg-gray-800/50 border border-gray-700 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all text-white text-lg placeholder-gray-400"
                          placeholder="https://mon-site.com"
                        />
                        <p class="text-gray-400 text-sm mt-2">Pour configurer automatiquement l'intégration</p>
                      </div>

                      <div>
                        <label class="block text-lg font-medium text-gray-200 mb-3">
                          Secteur d'activité *
                        </label>
                        <select
                          v-model="form.industry"
                          required
                          class="w-full px-6 py-4 bg-gray-800/50 border border-gray-700 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all text-white text-lg"
                        >
                          <option value="" class="bg-gray-800">Sélectionnez votre secteur</option>
                          <option value="fashion" class="bg-gray-800">Mode et vêtements</option>
                          <option value="beauty" class="bg-gray-800">Beauté et cosmétiques</option>
                          <option value="electronics" class="bg-gray-800">Électronique et high-tech</option>
                          <option value="home" class="bg-gray-800">Maison et décoration</option>
                          <option value="sports" class="bg-gray-800">Sport et fitness</option>
                          <option value="food" class="bg-gray-800">Alimentation et gastronomie</option>
                          <option value="health" class="bg-gray-800">Santé et bien-être</option>
                          <option value="automotive" class="bg-gray-800">Automobile</option>
                          <option value="jewelry" class="bg-gray-800">Bijouterie et horlogerie</option>
                          <option value="toys" class="bg-gray-800">Jouets et enfants</option>
                          <option value="books" class="bg-gray-800">Livres et média</option>
                          <option value="digital" class="bg-gray-800">Produits digitaux</option>
                          <option value="services" class="bg-gray-800">Services</option>
                          <option value="other" class="bg-gray-800">Autre</option>
                        </select>
                        <p class="text-gray-400 text-sm mt-2">Nous optimiserons votre Vendeur IA selon votre secteur</p>
                      </div>
                    </div>

                    <div class="flex justify-end pt-8">
                      <button
                        type="submit"
                        class="px-12 py-4 bg-gradient-to-r from-blue-600 to-purple-600 text-white text-lg font-semibold rounded-xl hover:from-blue-700 hover:to-purple-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 focus:ring-offset-gray-900 transition-all shadow-lg transform hover:scale-105"
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

          <!-- Étape 2: Plateforme -->
          <div v-if="currentStep === 2" class="transition-all duration-500 ease-in-out">
            <div class="text-center mb-12">
              <div class="inline-flex p-4 bg-green-600/20 rounded-2xl mb-6">
                <svg class="w-12 h-12 text-green-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M16 11V7a4 4 0 00-8 0v4M5 9h14l1 12H4L5 9z"/>
                </svg>
              </div>
              <h1 class="text-4xl sm:text-5xl lg:text-6xl font-bold mb-4 bg-gradient-to-r from-green-400 to-blue-400 bg-clip-text text-transparent">
                Votre plateforme
              </h1>
              <p class="text-xl lg:text-2xl text-gray-300 max-w-4xl mx-auto mb-6">
                Pour préparer l'intégration de votre Vendeur IA
              </p>
              <div class="bg-green-900/20 border border-green-800 rounded-xl p-6 max-w-2xl mx-auto">
                <p class="text-green-200 text-sm leading-relaxed">
                  <strong class="text-green-100">Pourquoi cette information ?</strong><br>
                  Nous préparerons les instructions d'intégration spécifiques à votre plateforme et des templates optimisés.
                </p>
              </div>
            </div>

            <form @submit.prevent="nextStep" class="space-y-8">
              <div>
                <label class="block text-xl font-medium text-gray-200 mb-8 text-center">
                  Quelle plateforme utilisez-vous pour votre boutique ? *
                </label>
                <div class="grid grid-cols-2 lg:grid-cols-4 gap-6">
                  
                  <!-- Option Shopify -->
                  <label class="relative group cursor-pointer">
                    <input v-model="form.platform" type="radio" value="shopify" class="sr-only" required>
                    <div class="p-6 lg:p-8 bg-gray-800/30 border-2 rounded-2xl transition-all group-hover:bg-gray-800/50 backdrop-blur h-full"
                         :class="form.platform === 'shopify' ? 'border-blue-500 bg-blue-600/20 shadow-lg shadow-blue-500/20' : 'border-gray-700'">
                      <div class="text-center space-y-4 h-full flex flex-col justify-center">
                        <div class="text-4xl lg:text-5xl">🛒</div>
                        <div>
                          <div class="text-lg font-semibold text-white">Shopify</div>
                          <div class="text-sm text-gray-400">Plateforme populaire</div>
                        </div>
                      </div>
                      <div v-if="form.platform === 'shopify'" class="absolute top-4 right-4">
                        <div class="w-6 h-6 bg-blue-500 rounded-full flex items-center justify-center">
                          <svg class="w-4 h-4 text-white" fill="currentColor" viewBox="0 0 20 20">
                            <path fill-rule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clip-rule="evenodd"/>
                          </svg>
                        </div>
                      </div>
                    </div>
                  </label>

                  <label class="relative group cursor-pointer">
                    <input v-model="form.platform" type="radio" value="woocommerce" class="sr-only">
                    <div class="p-6 lg:p-8 bg-gray-800/30 border-2 rounded-2xl transition-all group-hover:bg-gray-800/50 backdrop-blur h-full"
                         :class="form.platform === 'woocommerce' ? 'border-blue-500 bg-blue-600/20 shadow-lg shadow-blue-500/20' : 'border-gray-700'">
                      <div class="text-center space-y-4 h-full flex flex-col justify-center">
                        <div class="text-4xl lg:text-5xl">🔗</div>
                        <div>
                          <div class="text-lg font-semibold text-white">WooCommerce</div>
                          <div class="text-sm text-gray-400">Plugin WordPress</div>
                        </div>
                      </div>
                      <div v-if="form.platform === 'woocommerce'" class="absolute top-4 right-4">
                        <div class="w-6 h-6 bg-blue-500 rounded-full flex items-center justify-center">
                          <svg class="w-4 h-4 text-white" fill="currentColor" viewBox="0 0 20 20">
                            <path fill-rule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clip-rule="evenodd"/>
                          </svg>
                        </div>
                      </div>
                    </div>
                  </label>

                  <label class="relative group cursor-pointer">
                    <input v-model="form.platform" type="radio" value="wix" class="sr-only">
                    <div class="p-6 lg:p-8 bg-gray-800/30 border-2 rounded-2xl transition-all group-hover:bg-gray-800/50 backdrop-blur h-full"
                         :class="form.platform === 'wix' ? 'border-blue-500 bg-blue-600/20 shadow-lg shadow-blue-500/20' : 'border-gray-700'">
                      <div class="text-center space-y-4 h-full flex flex-col justify-center">
                        <div class="text-4xl lg:text-5xl">🎨</div>
                        <div>
                          <div class="text-lg font-semibold text-white">Wix</div>
                          <div class="text-sm text-gray-400">Site builder</div>
                        </div>
                      </div>
                      <div v-if="form.platform === 'wix'" class="absolute top-4 right-4">
                        <div class="w-6 h-6 bg-blue-500 rounded-full flex items-center justify-center">
                          <svg class="w-4 h-4 text-white" fill="currentColor" viewBox="0 0 20 20">
                            <path fill-rule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clip-rule="evenodd"/>
                          </svg>
                        </div>
                      </div>
                    </div>
                  </label>

                  <label class="relative group cursor-pointer">
                    <input v-model="form.platform" type="radio" value="custom" class="sr-only">
                    <div class="p-6 lg:p-8 bg-gray-800/30 border-2 rounded-2xl transition-all group-hover:bg-gray-800/50 backdrop-blur h-full"
                         :class="form.platform === 'custom' ? 'border-blue-500 bg-blue-600/20 shadow-lg shadow-blue-500/20' : 'border-gray-700'">
                      <div class="text-center space-y-4 h-full flex flex-col justify-center">
                        <div class="text-4xl lg:text-5xl">⚙️</div>
                        <div>
                          <div class="text-lg font-semibold text-white">Site personnalisé</div>
                          <div class="text-sm text-gray-400">Développé sur mesure</div>
                        </div>
                      </div>
                      <div v-if="form.platform === 'custom'" class="absolute top-4 right-4">
                        <div class="w-6 h-6 bg-blue-500 rounded-full flex items-center justify-center">
                          <svg class="w-4 h-4 text-white" fill="currentColor" viewBox="0 0 20 20">
                            <path fill-rule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clip-rule="evenodd"/>
                          </svg>
                        </div>
                      </div>
                    </div>
                  </label>
                </div>
              </div>

              <div class="flex justify-between pt-8 max-w-4xl mx-auto">
                <button
                  type="button"
                  @click="previousStep"
                  class="px-8 py-4 bg-gray-800 text-white text-lg font-medium rounded-xl hover:bg-gray-700 transition-all border border-gray-700"
                >
                  <svg class="w-5 h-5 inline mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M15 19l-7-7 7-7"/>
                  </svg>
                  Retour
                </button>
                <button
                  type="submit"
                  class="px-12 py-4 bg-gradient-to-r from-blue-600 to-purple-600 text-white text-lg font-semibold rounded-xl hover:from-blue-700 hover:to-purple-700 transition-all shadow-lg transform hover:scale-105"
                >
                  Continuer
                  <svg class="w-5 h-5 inline ml-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 5l7 7-7 7"/>
                  </svg>
                </button>
              </div>
            </form>
          </div>

          <!-- Étape 3: Objectifs commerciaux -->
          <div v-if="currentStep === 3" class="transition-all duration-500 ease-in-out">
            <div class="text-center mb-12">
              <div class="inline-flex p-4 bg-purple-600/20 rounded-2xl mb-6">
                <svg class="w-12 h-12 text-purple-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z"/>
                </svg>
              </div>
              <h1 class="text-4xl sm:text-5xl lg:text-6xl font-bold mb-4 bg-gradient-to-r from-purple-400 to-pink-400 bg-clip-text text-transparent">
                Vos objectifs
              </h1>
              <p class="text-xl lg:text-2xl text-gray-300 max-w-4xl mx-auto mb-6">
                Optimisons votre Vendeur IA selon vos priorités
              </p>
              <div class="bg-purple-900/20 border border-purple-800 rounded-xl p-6 max-w-2xl mx-auto">
                <p class="text-purple-200 text-sm leading-relaxed">
                  <strong class="text-purple-100">Personnalisation intelligente :</strong><br>
                  Selon vos objectifs, nous configurerons automatiquement les stratégies de vente, messages d'upsell et métriques prioritaires.
                </p>
              </div>
            </div>

            <form @submit.prevent="nextStep" class="space-y-8">
              <div class="max-w-4xl mx-auto">
                <label class="block text-xl font-medium text-gray-200 mb-8 text-center">
                  Quel est votre objectif principal avec ChatSeller ? *
                </label>
                <div class="grid grid-cols-1 md:grid-cols-2 gap-6">
                  
                  <label class="relative group cursor-pointer">
                    <input v-model="form.primaryGoal" type="radio" value="increase_conversions" class="sr-only" required>
                    <div class="p-6 bg-gray-800/30 border-2 rounded-2xl transition-all group-hover:bg-gray-800/50 backdrop-blur h-full"
                         :class="form.primaryGoal === 'increase_conversions' ? 'border-purple-500 bg-purple-600/20 shadow-lg shadow-purple-500/20' : 'border-gray-700'">
                      <div class="space-y-4">
                        <div class="text-3xl">📈</div>
                        <div>
                          <div class="text-lg font-semibold text-white">Augmenter les conversions</div>
                          <div class="text-sm text-gray-400 mt-2">Transformer plus de visiteurs en clients</div>
                        </div>
                      </div>
                      <div v-if="form.primaryGoal === 'increase_conversions'" class="absolute top-4 right-4">
                        <div class="w-6 h-6 bg-purple-500 rounded-full flex items-center justify-center">
                          <svg class="w-4 h-4 text-white" fill="currentColor" viewBox="0 0 20 20">
                            <path fill-rule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clip-rule="evenodd"/>
                          </svg>
                        </div>
                      </div>
                    </div>
                  </label>

                  <label class="relative group cursor-pointer">
                    <input v-model="form.primaryGoal" type="radio" value="increase_average_order" class="sr-only">
                    <div class="p-6 bg-gray-800/30 border-2 rounded-2xl transition-all group-hover:bg-gray-800/50 backdrop-blur h-full"
                         :class="form.primaryGoal === 'increase_average_order' ? 'border-purple-500 bg-purple-600/20 shadow-lg shadow-purple-500/20' : 'border-gray-700'">
                      <div class="space-y-4">
                        <div class="text-3xl">💰</div>
                        <div>
                          <div class="text-lg font-semibold text-white">Augmenter le panier moyen</div>
                          <div class="text-sm text-gray-400 mt-2">Vendre plus par commande (upsell/cross-sell)</div>
                        </div>
                      </div>
                      <div v-if="form.primaryGoal === 'increase_average_order'" class="absolute top-4 right-4">
                        <div class="w-6 h-6 bg-purple-500 rounded-full flex items-center justify-center">
                          <svg class="w-4 h-4 text-white" fill="currentColor" viewBox="0 0 20 20">
                            <path fill-rule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clip-rule="evenodd"/>
                          </svg>
                        </div>
                      </div>
                    </div>
                  </label>

                  <label class="relative group cursor-pointer">
                    <input v-model="form.primaryGoal" type="radio" value="reduce_support" class="sr-only">
                    <div class="p-6 bg-gray-800/30 border-2 rounded-2xl transition-all group-hover:bg-gray-800/50 backdrop-blur h-full"
                         :class="form.primaryGoal === 'reduce_support' ? 'border-purple-500 bg-purple-600/20 shadow-lg shadow-purple-500/20' : 'border-gray-700'">
                      <div class="space-y-4">
                        <div class="text-3xl">🤖</div>
                        <div>
                          <div class="text-lg font-semibold text-white">Automatiser le support</div>
                          <div class="text-sm text-gray-400 mt-2">Réduire les questions répétitives</div>
                        </div>
                      </div>
                      <div v-if="form.primaryGoal === 'reduce_support'" class="absolute top-4 right-4">
                        <div class="w-6 h-6 bg-purple-500 rounded-full flex items-center justify-center">
                          <svg class="w-4 h-4 text-white" fill="currentColor" viewBox="0 0 20 20">
                            <path fill-rule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clip-rule="evenodd"/>
                          </svg>
                        </div>
                      </div>
                    </div>
                  </label>

                  <label class="relative group cursor-pointer">
                    <input v-model="form.primaryGoal" type="radio" value="lead_generation" class="sr-only">
                    <div class="p-6 bg-gray-800/30 border-2 rounded-2xl transition-all group-hover:bg-gray-800/50 backdrop-blur h-full"
                         :class="form.primaryGoal === 'lead_generation' ? 'border-purple-500 bg-purple-600/20 shadow-lg shadow-purple-500/20' : 'border-gray-700'">
                      <div class="space-y-4">
                        <div class="text-3xl">📧</div>
                        <div>
                          <div class="text-lg font-semibold text-white">Générer des leads</div>
                          <div class="text-sm text-gray-400 mt-2">Collecter contacts et informations clients</div>
                        </div>
                      </div>
                      <div v-if="form.primaryGoal === 'lead_generation'" class="absolute top-4 right-4">
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

              <div class="flex justify-between pt-8 max-w-4xl mx-auto">
                <button
                  type="button"
                  @click="previousStep"
                  class="px-8 py-4 bg-gray-800 text-white text-lg font-medium rounded-xl hover:bg-gray-700 transition-all border border-gray-700"
                >
                  <svg class="w-5 h-5 inline mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M15 19l-7-7 7-7"/>
                  </svg>
                  Retour
                </button>
                <button
                  type="submit"
                  class="px-12 py-4 bg-gradient-to-r from-blue-600 to-purple-600 text-white text-lg font-semibold rounded-xl hover:from-blue-700 hover:to-purple-700 transition-all shadow-lg transform hover:scale-105"
                >
                  Continuer
                  <svg class="w-5 h-5 inline ml-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 5l7 7-7 7"/>
                  </svg>
                </button>
              </div>
            </form>
          </div>

          <!-- Étape 4: Finalisation -->
          <div v-if="currentStep === 4" class="transition-all duration-500 ease-in-out">
            <div class="grid lg:grid-cols-2 gap-12 items-center">
              
              <!-- Colonne gauche : Titre et informations -->
              <div class="text-center lg:text-left">
                <div class="inline-flex p-4 bg-emerald-600/20 rounded-2xl mb-6 lg:mb-8">
                  <svg class="w-12 h-12 text-emerald-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M5 13l4 4L19 7"/>
                  </svg>
                </div>
                <h1 class="text-4xl sm:text-5xl lg:text-6xl font-bold mb-4 bg-gradient-to-r from-emerald-400 to-blue-400 bg-clip-text text-transparent">
                  C'est parti !
                </h1>
                <p class="text-xl lg:text-2xl text-gray-300 mb-8">
                  Derniers détails pour finaliser votre inscription
                </p>

                <!-- Info essai gratuit -->
                <div class="hidden lg:block bg-emerald-900/20 border border-emerald-800 rounded-2xl p-6">
                  <div class="flex items-start space-x-4">
                    <svg class="w-8 h-8 text-emerald-400 mt-1 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"/>
                    </svg>
                    <div>
                      <p class="font-semibold text-emerald-300 mb-2 text-xl">🎉 Votre essai gratuit commence maintenant</p>
                      <p class="text-emerald-200 text-lg">
                        <strong>7 jours gratuits</strong> pour tester toutes les fonctionnalités de ChatSeller.
                      </p>
                    </div>
                  </div>
                </div>
              </div>

              <!-- Colonne droite : Formulaire -->
              <div class="w-full">
                <form @submit.prevent="completeOnboarding" class="space-y-6">
                  <div class="bg-gray-800/30 backdrop-blur border border-gray-700 rounded-2xl p-8">
                    <div class="space-y-6">
                      <div>
                        <label class="block text-lg font-medium text-gray-200 mb-3">
                          Comment avez-vous connu ChatSeller ?
                        </label>
                        <select
                          v-model="form.acquisitionSource"
                          class="w-full px-6 py-4 bg-gray-800/50 border border-gray-700 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all text-white text-lg"
                        >
                          <option value="" class="bg-gray-800">Sélectionnez une source</option>
                          <option value="search_google" class="bg-gray-800">Recherche Google</option>
                          <option value="social_media" class="bg-gray-800">Réseaux sociaux (LinkedIn, Facebook, etc.)</option>
                          <option value="recommendation" class="bg-gray-800">Recommandation d'un ami/collègue</option>
                          <option value="blog_article" class="bg-gray-800">Article de blog</option>
                          <option value="youtube" class="bg-gray-800">YouTube</option>
                          <option value="podcast" class="bg-gray-800">Podcast</option>
                          <option value="advertising" class="bg-gray-800">Publicité en ligne</option>
                          <option value="other" class="bg-gray-800">Autre</option>
                        </select>
                      </div>

                      <div class="bg-gray-800/30 border border-gray-700 rounded-xl p-6">
                        <div class="flex items-start space-x-4">
                          <div class="flex items-center h-5 mt-1">
                            <input
                              id="newsletter"
                              v-model="form.newsletter"
                              type="checkbox"
                              class="h-5 w-5 text-blue-600 focus:ring-blue-500 border-gray-600 bg-gray-800 rounded"
                            />
                          </div>
                          <div>
                            <label for="newsletter" class="text-lg font-medium text-gray-200">
                              📧 Recevoir les conseils d'optimisation
                            </label>
                            <p class="text-sm text-gray-400 mt-1">
                              Conseils pour maximiser vos conversions, nouvelles fonctionnalités et bonnes pratiques (1-2 emails/mois maximum)
                            </p>
                          </div>
                        </div>
                      </div>

                      <!-- Info mobile -->
                      <div class="lg:hidden bg-emerald-900/20 border border-emerald-800 rounded-xl p-6">
                        <div class="flex items-start space-x-4">
                          <svg class="w-6 h-6 text-emerald-400 mt-1 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"/>
                          </svg>
                          <div>
                            <p class="font-semibold text-emerald-300 mb-2">🎉 Votre essai gratuit commence maintenant</p>
                            <p class="text-emerald-200">
                              <strong>7 jours gratuits</strong> pour tester toutes les fonctionnalités.
                            </p>
                          </div>
                        </div>
                      </div>
                    </div>

                    <div class="flex flex-col sm:flex-row justify-between gap-4 pt-8">
                      <button
                        type="button"
                        @click="previousStep"
                        class="px-8 py-4 bg-gray-800 text-white text-lg font-medium rounded-xl hover:bg-gray-700 transition-all border border-gray-700 order-2 sm:order-1"
                      >
                        <svg class="w-5 h-5 inline mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M15 19l-7-7 7-7"/>
                        </svg>
                        Retour
                      </button>
                      <button
                        type="submit"
                        :disabled="loading"
                        class="px-12 py-4 bg-gradient-to-r from-emerald-600 to-blue-600 text-white text-lg font-semibold rounded-xl hover:from-emerald-700 hover:to-blue-700 transition-all shadow-lg transform hover:scale-105 disabled:opacity-50 disabled:transform-none order-1 sm:order-2"
                      >
                        <span v-if="loading" class="flex items-center justify-center">
                          <svg class="animate-spin -ml-1 mr-3 h-5 w-5 text-white" fill="none" viewBox="0 0 24 24">
                            <circle class="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" stroke-width="4"></circle>
                            <path class="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                          </svg>
                          Configuration en cours...
                        </span>
                        <span v-else class="flex items-center justify-center">
                          🎉 Accéder à mon Dashboard
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

// ✅ FORMULAIRE ÉTENDU
const form = reactive({
  company: '',
  website: '',
  industry: '',
  platform: '',
  primaryGoal: '',
  acquisitionSource: '',
  newsletter: true
})

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

// ✅ COMPLETION ONBOARDING AMÉLIORÉE
const completeOnboarding = async () => {
  loading.value = true
  
  try {
    console.log('🚀 [Onboarding] Finalisation avec données enrichies...')
    
    const { data: { user } } = await supabase.auth.getUser()
    
    if (!user) {
      console.error('❌ [Onboarding] Pas d\'utilisateur connecté')
      await navigateTo('/login')
      return
    }
    
    console.log('✅ [Onboarding] Utilisateur connecté:', user.email)
    
    // ✅ DONNÉES ENRICHIES POUR LE SHOP
    const shopData = {
      name: form.company || `Shop de ${user.email?.split('@')[0]}`,
      domain: extractDomain(form.website),
      industry: form.industry,
      platform: form.platform,
      primary_goal: form.primaryGoal,
      acquisition_source: form.acquisitionSource,
      newsletter_subscribed: form.newsletter,
      onboarding_completed: true,
      onboarding_completed_at: new Date().toISOString(),
      // ✅ CONFIGURATION AGENT PERSONNALISÉE SELON L'INDUSTRIE
      agent_config: getOptimizedAgentConfig(form.industry, form.primaryGoal),
      // ✅ WIDGET CONFIG OPTIMISÉ
      widget_config: getOptimizedWidgetConfig(form.industry)
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
      
      console.log('✅ [Onboarding] Shop mis à jour avec succès')
      
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
        
        console.log('✅ [Onboarding] Shop créé avec succès')
      } else {
        throw updateError
      }
    }
    
    // ✅ SYNCHRONISER LE STORE
    if (authStore.user) {
      await authStore.restoreSession(true)
      console.log('✅ [Onboarding] Store synchronisé')
    }
    
    console.log('🎉 [Onboarding] Finalisation terminée!')
    
    // ✅ REDIRECTION AVEC PARAMÈTRES DE BIENVENUE
    window.location.href = '/?onboarding=completed&welcome=true&newuser=true'
    
  } catch (error: any) {
    console.error('❌ [Onboarding] Erreur finalisation:', error)
    
    let userMessage = 'Une erreur s\'est produite lors de la finalisation.'
    
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

// ✅ CONFIGURATION AGENT OPTIMISÉE SELON L'INDUSTRIE
const getOptimizedAgentConfig = (industry: string, goal: string) => {
  const baseConfig = {
    name: 'Rose',
    avatar: 'https://ui-avatars.com/api/?name=Rose&background=E91E63&color=fff',
    collectPaymentMethod: true,
    upsellEnabled: goal === 'increase_average_order'
  }
  
  const industryConfigs = {
    fashion: {
      welcomeMessage: 'Bonjour ! Je suis votre conseillère mode. Puis-je vous aider à trouver la pièce parfaite ?',
      fallbackMessage: 'Je transmets votre demande à notre équipe mode, vous recevrez une réponse personnalisée rapidement.'
    },
    beauty: {
      welcomeMessage: 'Salut ! Je suis votre experte beauté. Comment puis-je sublimer votre routine ?',
      fallbackMessage: 'Notre équipe beauté prendra contact avec vous pour des conseils personnalisés.'
    },
    electronics: {
      welcomeMessage: 'Bonjour ! Je suis là pour vous aider à choisir le produit tech qui vous convient.',
      fallbackMessage: 'Je transmets votre question technique à nos experts, vous aurez une réponse détaillée.'
    },
    health: {
      welcomeMessage: 'Bonjour ! Je peux vous conseiller sur nos produits bien-être. Comment puis-je vous aider ?',
      fallbackMessage: 'Notre équipe santé-bien-être vous recontactera pour un conseil personnalisé.'
    },
    default: {
      welcomeMessage: 'Bonjour ! Je suis votre assistante d\'achat. Comment puis-je vous aider aujourd\'hui ?',
      fallbackMessage: 'Je transmets votre question à notre équipe, un conseiller vous recontactera bientôt.'
    }
  }
  
  const config = industryConfigs[industry] || industryConfigs.default
  
  return { ...baseConfig, ...config }
}

// ✅ CONFIGURATION WIDGET OPTIMISÉE
const getOptimizedWidgetConfig = (industry: string) => {
  const colors = {
    fashion: '#E91E63',
    beauty: '#FF6B9D', 
    electronics: '#2196F3',
    health: '#4CAF50',
    default: '#E91E63'
  }
  
  return {
    theme: 'modern',
    primaryColor: colors[industry] || colors.default,
    position: 'bottom-right',
    buttonText: 'Parler au vendeur',
    language: 'fr'
  }
}

// ✅ INITIALISATION
onMounted(async () => {
  try {
    console.log('🔄 [Onboarding] Initialisation...')
    
    if (!auth.isAuthenticated.value) {
      console.log('❌ [Onboarding] Non connecté')
      await navigateTo('/login')
      return
    }
    
    const { data: { user } } = await supabase.auth.getUser()
    
    if (!user || !user.email_confirmed_at) {
      console.log('❌ [Onboarding] Email non confirmé')
      await navigateTo('/register')
      return
    }
    
    // ✅ PRÉ-REMPLIR LE FORMULAIRE SI DONNÉES DISPONIBLES
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
  title: 'Configuration de votre compte - ChatSeller',
  meta: [
    { name: 'description', content: 'Finalisez votre inscription ChatSeller en quelques étapes.' }
  ]
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

.transition-all {
  transition-property: all;
  transition-timing-function: cubic-bezier(0.4, 0, 0.2, 1);
  transition-duration: 300ms;
}

.backdrop-blur {
  backdrop-filter: blur(10px);
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