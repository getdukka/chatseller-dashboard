<!-- pages/onboarding.vue - VERSION ANTI-BOUCLE -->
<template>
  <div class="min-h-screen bg-gray-900 text-white relative overflow-hidden">
    
    <!-- Background avec gradient -->
    <div class="absolute inset-0 bg-gradient-to-br from-blue-900 via-gray-900 to-purple-900"></div>
    <div class="absolute inset-0 bg-black/20"></div>
    
    <!-- Header avec logo -->
    <header class="relative z-10 p-6">
      <div class="flex items-center space-x-3">
        <div class="flex h-10 w-10 items-center justify-center rounded-xl bg-blue-600 shadow-lg">
          <span class="text-lg font-bold text-white">CS</span>
        </div>
        <span class="text-2xl font-bold text-white">ChatSeller</span>
      </div>
    </header>

    <!-- Progress bar en haut -->
    <div class="relative z-10 px-6 pb-8">
      <div class="max-w-6xl mx-auto">
        <div class="flex items-center justify-between text-sm text-gray-300 mb-4">
          <span>Étape {{ currentStep }} sur 3</span>
          <span>{{ Math.round((currentStep / 3) * 100) }}% terminé</span>
        </div>
        
        <!-- Barre de progression moderne -->
        <div class="w-full bg-gray-800 rounded-full h-2 shadow-inner">
          <div 
            class="h-2 rounded-full bg-gradient-to-r from-blue-500 to-purple-500 transition-all duration-700 ease-out shadow-lg"
            :style="{ width: `${(currentStep / 3) * 100}%` }"
          ></div>
        </div>
      </div>
    </div>

    <!-- Contenu principal -->
    <div class="relative z-10 px-6 pb-6">
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
              <p class="text-xl lg:text-2xl text-gray-300 mb-8">
                Configurons ChatSeller pour votre activité
              </p>
              
              <!-- Features list sur desktop -->
              <div class="hidden lg:block space-y-4">
                <div class="flex items-center space-x-3 text-gray-300">
                  <div class="w-6 h-6 bg-blue-600 rounded-full flex items-center justify-center flex-shrink-0">
                    <svg class="w-4 h-4 text-white" fill="currentColor" viewBox="0 0 20 20">
                      <path fill-rule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clip-rule="evenodd"/>
                    </svg>
                  </div>
                  <span>Vendeur IA personnalisé</span>
                </div>
                <div class="flex items-center space-x-3 text-gray-300">
                  <div class="w-6 h-6 bg-blue-600 rounded-full flex items-center justify-center flex-shrink-0">
                    <svg class="w-4 h-4 text-white" fill="currentColor" viewBox="0 0 20 20">
                      <path fill-rule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clip-rule="evenodd"/>
                    </svg>
                  </div>
                  <span>Augmentation du taux de conversion</span>
                </div>
                <div class="flex items-center space-x-3 text-gray-300">
                  <div class="w-6 h-6 bg-blue-600 rounded-full flex items-center justify-center flex-shrink-0">
                    <svg class="w-4 h-4 text-white" fill="currentColor" viewBox="0 0 20 20">
                      <path fill-rule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clip-rule="evenodd"/>
                    </svg>
                  </div>
                  <span>Intégration simple et rapide</span>
                </div>
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
                        placeholder="Mon E-commerce"
                      />
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
                    </div>

                    <div>
                      <label class="block text-lg font-medium text-gray-200 mb-3">
                        Secteur d'activité
                      </label>
                      <select
                        v-model="form.industry"
                        class="w-full px-6 py-4 bg-gray-800/50 border border-gray-700 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all text-white text-lg"
                      >
                        <option value="" class="bg-gray-800">Sélectionnez votre secteur</option>
                        <option value="digital" class="bg-gray-800">Produits Digitaux</option>
                        <option value="fashion" class="bg-gray-800">Mode et vêtements</option>
                        <option value="beauty" class="bg-gray-800">Beauté et cosmétiques</option>
                        <option value="electronics" class="bg-gray-800">Électronique et high-tech</option>
                        <option value="home" class="bg-gray-800">Maison et décoration</option>
                        <option value="sports" class="bg-gray-800">Sport et fitness</option>
                        <option value="food" class="bg-gray-800">Alimentation</option>
                        <option value="health" class="bg-gray-800">Santé et bien-être</option>
                        <option value="automotive" class="bg-gray-800">Automobile</option>
                        <option value="jewelry" class="bg-gray-800">Bijouterie</option>
                        <option value="toys" class="bg-gray-800">Jouets et enfants</option>
                        <option value="other" class="bg-gray-800">Autre</option>
                      </select>
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
            <p class="text-xl lg:text-2xl text-gray-300 max-w-4xl mx-auto">
              Pour une intégration optimale de ChatSeller
            </p>
          </div>

          <form @submit.prevent="nextStep" class="space-y-8">
            <div>
              <label class="block text-xl font-medium text-gray-200 mb-8 text-center">
                Quelle plateforme utilisez-vous ? *
              </label>
              <div class="grid grid-cols-2 lg:grid-cols-4 gap-6">
                
                <!-- Option Shopify -->
                <label class="relative group cursor-pointer">
                  <input v-model="form.platform" type="radio" value="shopify" class="sr-only">
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

                <!-- Option WooCommerce -->
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

                <!-- Option Custom -->
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

                <!-- Option Other -->
                <label class="relative group cursor-pointer">
                  <input v-model="form.platform" type="radio" value="other" class="sr-only">
                  <div class="p-6 lg:p-8 bg-gray-800/30 border-2 rounded-2xl transition-all group-hover:bg-gray-800/50 backdrop-blur h-full"
                       :class="form.platform === 'other' ? 'border-blue-500 bg-blue-600/20 shadow-lg shadow-blue-500/20' : 'border-gray-700'">
                    <div class="text-center space-y-4 h-full flex flex-col justify-center">
                      <div class="text-4xl lg:text-5xl">📦</div>
                      <div>
                        <div class="text-lg font-semibold text-white">Autre</div>
                        <div class="text-sm text-gray-400">Autre plateforme</div>
                      </div>
                    </div>
                    <div v-if="form.platform === 'other'" class="absolute top-4 right-4">
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

        <!-- Étape 3: Finalisation -->
        <div v-if="currentStep === 3" class="transition-all duration-500 ease-in-out">
          <div class="grid lg:grid-cols-2 gap-12 items-center">
            
            <!-- Colonne gauche : Titre et informations -->
            <div class="text-center lg:text-left">
              <div class="inline-flex p-4 bg-emerald-600/20 rounded-2xl mb-6 lg:mb-8">
                <svg class="w-12 h-12 text-emerald-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M5 13l4 4L19 7"/>
                </svg>
              </div>
              <h1 class="text-4xl sm:text-5xl lg:text-6xl font-bold mb-4 bg-gradient-to-r from-emerald-400 to-blue-400 bg-clip-text text-transparent">
                Presque terminé !
              </h1>
              <p class="text-xl lg:text-2xl text-gray-300 mb-8">
                Une dernière information pour personnaliser votre expérience
              </p>

              <!-- Info essai gratuit -->
              <div class="hidden lg:block bg-blue-900/20 border border-blue-800 rounded-2xl p-6">
                <div class="flex items-start space-x-4">
                  <svg class="w-8 h-8 text-blue-400 mt-1 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"/>
                  </svg>
                  <div>
                    <p class="font-semibold text-blue-300 mb-2 text-xl">Votre essai gratuit commence maintenant</p>
                    <p class="text-blue-200 text-lg">
                      Vous bénéficiez de <strong>7 jours d'essai gratuit</strong> pour tester toutes les fonctionnalités.
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
                        <option value="social_media" class="bg-gray-800">Réseaux sociaux</option>
                        <option value="recommendation" class="bg-gray-800">Recommandation</option>
                        <option value="blog_article" class="bg-gray-800">Article de blog</option>
                        <option value="youtube" class="bg-gray-800">YouTube</option>
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
                            Recevoir les conseils d'optimisation
                          </label>
                          <p class="text-sm text-gray-400 mt-1">
                            Conseils pour maximiser vos conversions et nouvelles fonctionnalités
                          </p>
                        </div>
                      </div>
                    </div>

                    <!-- Info mobile -->
                    <div class="lg:hidden bg-blue-900/20 border border-blue-800 rounded-xl p-6">
                      <div class="flex items-start space-x-4">
                        <svg class="w-6 h-6 text-blue-400 mt-1 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"/>
                        </svg>
                        <div>
                          <p class="font-semibold text-blue-300 mb-2">Votre essai gratuit commence maintenant</p>
                          <p class="text-blue-200">
                            Vous bénéficiez de <strong>7 jours d'essai gratuit</strong> pour tester toutes les fonctionnalités.
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
                        Finalisation...
                      </span>
                      <span v-else class="flex items-center justify-center">
                        🎉 Accéder à mon dashboard
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
</template>

<script setup lang="ts">
import { useSupabase } from '~~/composables/useSupabase'
import { useAuthStore } from '~~/stores/auth'

// ✅ LAYOUT SANS MIDDLEWARE
definePageMeta({
  layout: false
})

// ✅ COMPOSABLES ET STORES
const auth = useAuth()
const authStore = useAuthStore()
const supabase = useSupabase()

// ✅ STATE
const currentStep = ref(1)
const loading = ref(false)

// ✅ FORMULAIRE
const form = reactive({
  company: '',
  website: '',
  industry: '',
  platform: '',
  acquisitionSource: '',
  newsletter: true
})

// ✅ NAVIGATION
const nextStep = () => {
  if (currentStep.value < 3) {
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

// ✅ COMPLETION ONBOARDING VIA API
const completeOnboarding = async () => {
  loading.value = true
  
  try {
    console.log('🚀 [Onboarding] Début finalisation...')
    
    // ✅ VÉRIFIER SESSION SUPABASE
    const { data: { user } } = await supabase.auth.getUser()
    
    if (!user) {
      console.error('❌ [Onboarding] Pas d\'utilisateur connecté')
      await navigateTo('/login')
      return
    }
    
    console.log('✅ [Onboarding] Utilisateur connecté:', user.email)
    
    // ✅ METTRE À JOUR VIA API
    const api = useApi()
    
    // Mettre à jour le shop avec onboarding_completed = true
    const shopUpdateResponse = await api.shops.update(user.id, {
      name: form.company || `Shop de ${user.email?.split('@')[0]}`,
      domain: extractDomain(form.website),
      industry: form.industry,
      platform: form.platform,
      onboarding_completed: true, // ✅ MARQUER COMME TERMINÉ
      onboarding_completed_at: new Date().toISOString(),
      updated_at: new Date().toISOString()
    })
    
    if (!shopUpdateResponse.success) {
      console.error('❌ [Onboarding] Erreur mise à jour shop:', shopUpdateResponse.error)
      throw new Error('Erreur sauvegarde shop: ' + shopUpdateResponse.error)
    }
    
    console.log('✅ [Onboarding] Shop mis à jour avec succès')
    
    // ✅ METTRE À JOUR LE STORE LOCAL
    if (authStore.user?.shop) {
      authStore.user.shop.onboarding_completed = true
      authStore.user.shop.name = form.company || authStore.user.shop.name
      authStore.user.shop.industry = form.industry
      authStore.user.shop.platform = form.platform
    }
    
    console.log('🎉 [Onboarding] Finalisation terminée avec succès!')
    
    // ✅ REDIRECTION VERS DASHBOARD AVEC PARAMÈTRE DE SUCCÈS
    await navigateTo('/?onboarding=completed&welcome=true')
    
  } catch (error: any) {
    console.error('❌ [Onboarding] Erreur finalisation:', error)
    
    // ✅ GESTION D'ERREUR UTILISATEUR
    let userMessage = 'Une erreur s\'est produite lors de la finalisation.'
    
    if (error.message?.includes('network')) {
      userMessage = 'Problème de connexion. Vérifiez votre internet et réessayez.'
    } else if (error.message?.includes('auth')) {
      userMessage = 'Session expirée. Veuillez vous reconnecter.'
    }
    
    alert(userMessage + '\n\nSi le problème persiste, contactez le support.')
    
  } finally {
    loading.value = false
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

// ✅ INITIALISATION SÉCURISÉE
onMounted(async () => {
  try {
    console.log('🔄 [Onboarding] Vérification accès...')
    
    // ✅ VÉRIFIER QUE L'UTILISATEUR EST CONNECTÉ
    if (!auth.isAuthenticated.value) {
      console.log('❌ [Onboarding] Utilisateur non connecté, redirection login')
      await navigateTo('/login')
      return
    }
    
    // ✅ VÉRIFIER SESSION SUPABASE
    const { data: { user } } = await supabase.auth.getUser()
    
    if (!user || !user.email_confirmed_at) {
      console.log('❌ [Onboarding] Email non confirmé, redirection register')
      await navigateTo('/register')
      return
    }
    
    console.log('✅ [Onboarding] Accès autorisé pour:', user.email)
    
    // ✅ PRÉ-REMPLIR LE FORMULAIRE SI DONNÉES EXISTANTES
    try {
      const api = useApi()
      const shopResponse = await api.shops.get(user.id)
      
      if (shopResponse.success && shopResponse.data) {
        const shopData = shopResponse.data
        
        if (shopData.name && shopData.name !== `Shop de ${user.email?.split('@')[0]}`) {
          form.company = shopData.name
        }
        if (shopData.industry) form.industry = shopData.industry
        if (shopData.platform) form.platform = shopData.platform
        
        console.log('✅ [Onboarding] Formulaire pré-rempli depuis shop existant')
      }
    } catch (prefillError) {
      console.warn('⚠️ [Onboarding] Erreur pré-remplissage (non bloquante):', prefillError)
    }
    
    // ✅ FALLBACK SUR MÉTADONNÉES UTILISATEUR
    if (!form.company && user.user_metadata?.company) {
      form.company = user.user_metadata.company
    }
    
  } catch (error) {
    console.error('❌ [Onboarding] Erreur initialisation:', error)
    
    // ✅ REDIRECTION SÉCURITAIRE EN CAS D'ERREUR
    await navigateTo('/login')
  }
})

// ✅ SEO
useHead({
  title: 'Configuration de votre compte - ChatSeller',
  meta: [
    { name: 'description', content: 'Configurez votre compte ChatSeller en quelques étapes simples.' }
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

/* Transitions fluides */
.transition-all {
  transition-property: all;
  transition-timing-function: cubic-bezier(0.4, 0, 0.2, 1);
  transition-duration: 300ms;
}

/* Effet glassmorphism */
.backdrop-blur {
  backdrop-filter: blur(10px);
}
</style>