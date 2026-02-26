<!-- pages/billing.vue - VERSION ADAPTÉE NOUVEAUX PLANS -->
<template>
  <div class="min-h-screen bg-gray-50">
    <!-- Header -->
    <div class="bg-white shadow-sm border-b border-gray-200">
      <div class="px-8 py-6">
        <div class="flex items-center justify-between">
          <div>
            <h1 class="text-3xl font-bold text-gray-900">Facturation</h1>
            <p class="mt-2 text-gray-600">
              Gérez le salaire de {{ agentName }} et vos factures
            </p>
          </div>
          
          <div class="flex items-center space-x-4">
            <!-- Status Badge -->
            <div v-if="subscriptionData.isActive && !isPlanStarter(subscriptionData.plan)" class="flex items-center space-x-2 px-3 py-2 bg-green-50 border border-green-200 rounded-lg">
              <div class="w-2 h-2 bg-green-500 rounded-full"></div>
              <span class="text-sm font-medium text-green-700">Contrat actif</span>
            </div>
            
            <div v-else-if="isPlanStarter(subscriptionData.plan) && subscriptionData.trialDaysLeft > 0" class="flex items-center space-x-2 px-3 py-2 bg-blue-50 border border-blue-200 rounded-lg">
              <div class="w-2 h-2 bg-blue-500 rounded-full animate-pulse"></div>
              <span class="text-sm font-medium text-blue-700">Période d'essai - {{ subscriptionData.trialDaysLeft }} jour(s)</span>
            </div>
            
            <div v-else class="flex items-center space-x-2 px-3 py-2 bg-red-50 border border-red-200 rounded-lg">
              <div class="w-2 h-2 bg-red-500 rounded-full"></div>
              <span class="text-sm font-medium text-red-700">Contrat suspendu</span>
            </div>
            
            <button
              @click="refreshAllData"
              :disabled="loading.main"
              class="inline-flex items-center px-4 py-2 border border-gray-300 rounded-lg text-sm font-medium text-gray-700 bg-white hover:bg-gray-50 disabled:opacity-50 transition-colors"
            >
              <svg 
                class="w-4 h-4 mr-2" 
                :class="{ 'animate-spin': loading.main }"
                fill="none" 
                stroke="currentColor" 
                viewBox="0 0 24 24"
              >
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15"/>
              </svg>
              {{ loading.main ? 'Actualisation...' : 'Actualiser' }}
            </button>
          </div>
        </div>
      </div>
    </div>

    <!-- Content -->
    <div class="p-8">
      <!-- Loading overlay pendant synchronisation -->
      <div v-if="syncing" class="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
        <div class="bg-white rounded-xl p-8 max-w-md mx-4 text-center">
          <div class="animate-spin h-12 w-12 border-4 border-rose-600 border-t-transparent rounded-full mx-auto mb-4"></div>
          <h3 class="text-lg font-semibold mb-2">Synchronisation en cours...</h3>
          <p class="text-gray-600">Nous mettons à jour votre contrat</p>
          <div class="mt-4 text-sm text-gray-500">
            Tentative {{ syncAttempt }}/{{ maxSyncAttempts }}
          </div>
        </div>
      </div>

      <!-- Alertes selon l'état -->
      <div v-if="isPlanStarter(subscriptionData.plan) && subscriptionData.trialDaysLeft > 0" class="mb-8">
        <div class="bg-gradient-to-r from-rose-600 to-purple-600 rounded-xl shadow-xl overflow-hidden relative">
          <div class="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-yellow-400 to-orange-400 animate-pulse"></div>
          <div class="px-8 py-8 text-white relative">
            <div class="flex items-center justify-between">
              <div class="flex-1">
                <div class="flex items-center mb-4">
                  <div class="mr-4">
                    <div class="w-16 h-16 bg-white bg-opacity-20 rounded-full flex items-center justify-center">
                      <span class="text-2xl font-bold">{{ subscriptionData.trialDaysLeft }}</span>
                    </div>
                  </div>
                  <div>
                    <h2 class="text-3xl font-bold mb-2">
                      Période d'essai : {{ subscriptionData.trialDaysLeft }} jour(s) restant(s)
                    </h2>
                    <p class="text-blue-100 text-lg">
                      {{ agentName }} travaille gratuitement pour vous pendant 14 jours.
                      <br>
                      <span class="font-semibold text-yellow-200">
                        Après {{ subscriptionData.trialDaysLeft }} jour(s), choisissez son salaire pour continuer.
                      </span>
                    </p>
                  </div>
                </div>
                
                <div class="flex flex-wrap gap-4">
                  <button 
                    @click="scrollToPlans"
                    class="inline-flex items-center px-8 py-4 bg-white bg-opacity-20 rounded-xl text-white font-bold text-lg hover:bg-opacity-30 transition-all backdrop-blur-sm shadow-lg"
                  >
                    <svg class="w-6 h-6 mr-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M13 7h8m0 0v8m0-8l-8 8-4-4-6 6"/>
                    </svg>
                    {{ agentName }} Découverte — 45€/mois
                  </button>

                  <button
                    @click="scrollToPlans"
                    class="inline-flex items-center px-8 py-4 bg-gradient-to-r from-yellow-400 to-orange-400 rounded-xl text-gray-900 font-bold text-lg hover:from-yellow-300 hover:to-orange-300 transition-all shadow-lg"
                  >
                    <svg class="w-6 h-6 mr-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M5 3v4M3 5h4M6 17v4m-2-2h4m5-16l2.286 6.857L21 12l-5.714 2.143L13 21l-2.286-6.857L5 12l5.714-2.143L13 3z"/>
                    </svg>
                    {{ agentName }} Pro — 145€/mois
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      <!-- Alerte essai expiré -->
      <div v-if="isPlanStarter(subscriptionData.plan) && subscriptionData.trialDaysLeft === 0" class="mb-8">
        <div class="bg-gradient-to-r from-red-600 to-red-700 rounded-xl shadow-xl overflow-hidden">
          <div class="px-8 py-8 text-white relative">
            <div class="flex items-center justify-between">
              <div class="flex-1">
                <div class="flex items-center mb-4">
                  <div class="mr-4">
                    <div class="w-16 h-16 bg-white bg-opacity-20 rounded-full flex items-center justify-center">
                      <svg class="w-8 h-8 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"/>
                      </svg>
                    </div>
                  </div>
                  <div>
                    <h2 class="text-3xl font-bold mb-2">Le contrat d'essai de {{ agentName }} est terminé</h2>
                    <p class="text-red-100 text-lg">
                      {{ agentName }} a quitté votre boutique.
                      <br>
                      <span class="font-semibold text-yellow-200">
                        Choisissez son salaire pour la réembaucher.
                      </span>
                    </p>
                  </div>
                </div>
                
                <div class="bg-red-800 bg-opacity-50 rounded-lg p-4 mb-6">
                  <h3 class="font-semibold mb-2">Fonctionnalités désactivées :</h3>
                  <ul class="text-sm text-red-100 space-y-1">
                    <li>• {{ agentName }} ne répond plus à vos clients</li>
                    <li>• Son interface a été retirée de votre boutique</li>
                    <li>• Aucune nouvelle conversation ne peut démarrer</li>
                    <li>• L'accès à la configuration est restreint</li>
                  </ul>
                </div>
                
                <div class="flex flex-wrap gap-4">
                  <button 
                    @click="scrollToPlans"
                    class="inline-flex items-center px-8 py-4 bg-white bg-opacity-20 rounded-xl text-white font-bold text-lg hover:bg-opacity-30 transition-all backdrop-blur-sm shadow-lg"
                  >
                    <svg class="w-6 h-6 mr-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M13 7h8m0 0v8m0-8l-8 8-4-4-6 6"/>
                    </svg>
                    Réembaucher {{ agentName }} — Découverte (45€/mois)
                  </button>

                  <button
                    @click="scrollToPlans"
                    class="inline-flex items-center px-8 py-4 bg-gradient-to-r from-yellow-400 to-orange-400 rounded-xl text-gray-900 font-bold text-lg hover:from-yellow-300 hover:to-orange-300 transition-all shadow-lg"
                  >
                    <svg class="w-6 h-6 mr-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M5 3v4M3 5h4M6 17v4m-2-2h4m5-16l2.286 6.857L21 12l-5.714 2.143L13 21l-2.286-6.857L5 12l5.714-2.143L13 3z"/>
                    </svg>
                    Réembaucher {{ agentName }} — Pro (145€/mois)
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      <div class="grid grid-cols-1 lg:grid-cols-3 gap-8">
        <!-- Main Content -->
        <div class="lg:col-span-2 space-y-8">
          
          <!-- Current Plan -->
          <div class="card-modern">
            <div class="flex items-center justify-between mb-6">
              <h2 class="text-xl font-semibold text-gray-900">Salaire actuel</h2>
              <div v-if="isPlanStarter(subscriptionData.plan)" class="plan-upgrade-badge">
                <span class="text-xs font-medium">Choisissez un salaire pour continuer</span>
              </div>
            </div>
            
            <div class="current-plan-card" :class="getPlanCardClass(subscriptionData.plan)">
              <div class="flex items-center justify-between">
                <div class="flex items-center space-x-4">
                  <div class="plan-icon" :class="getPlanIconClass(subscriptionData.plan)">
                    <svg class="w-8 h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" :d="getPlanIcon(subscriptionData.plan)"/>
                    </svg>
                  </div>
                  <div>
                    <h3 class="text-xl font-bold capitalize">{{ getPlanName(subscriptionData.plan) }}</h3>
                    <p class="text-gray-600">
                      {{ getPlanPrice(subscriptionData.plan) }}
                    </p>
                  </div>
                </div>
                
                <div class="text-right">
                  <span class="plan-status-badge" :class="getStatusBadgeClass(subscriptionData.plan)">
                    {{ getStatusLabel(subscriptionData.plan) }}
                  </span>
                  <p v-if="subscriptionData.nextBillingDate && subscriptionData.isActive && !isPlanStarter(subscriptionData.plan)" class="text-sm text-gray-500 mt-2">
                    Prochain salaire : {{ formatDate(subscriptionData.nextBillingDate) }}
                  </p>
                  <p v-else-if="subscriptionData.trialDaysLeft > 0" class="text-sm text-blue-600 mt-2 font-medium">
                    Fin d'essai : {{ formatDate(subscriptionData.trialEndDate) }}
                  </p>
                </div>
              </div>

              <!-- Plan Features Preview -->
              <div class="mt-6 grid grid-cols-2 md:grid-cols-3 gap-4">
                <div v-for="feature in getCurrentPlanFeatures()" :key="feature" class="flex items-center space-x-2">
                  <svg class="w-4 h-4 text-green-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M5 13l4 4L19 7"/>
                  </svg>
                  <span class="text-sm text-gray-700">{{ feature }}</span>
                </div>
              </div>

              <!-- Plan Actions -->
              <div class="mt-6 flex flex-wrap gap-3">
                <button 
                  v-if="subscriptionData.plan === 'starter'"
                  @click="scrollToPlans"
                  class="btn-primary"
                >
                  <svg class="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M13 7h8m0 0v8m0-8l-8 8-4-4-6 6"/>
                  </svg>
                  {{ subscriptionData.trialDaysLeft > 0 ? 'Choisir un salaire' : `Réembaucher ${agentName}` }}
                </button>

                <button 
                  v-if="subscriptionData.plan === 'starter' && subscriptionData.isActive"
                  @click="scrollToPlans"
                  class="btn-primary"
                >
                  <svg class="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M13 7h8m0 0v8m0-8l-8 8-4-4-6 6"/>
                  </svg>
                  Augmenter son salaire
                </button>
                
                <button 
                  v-if="subscriptionData.isActive && !isPlanStarter(subscriptionData.plan)"
                  @click="handleManageSubscription"
                  :disabled="loading.subscription"
                  class="btn-secondary"
                >
                  <svg v-if="loading.subscription" class="w-4 h-4 mr-2 animate-spin" fill="none" viewBox="0 0 24 24">
                    <circle class="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" stroke-width="4"></circle>
                    <path class="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                  </svg>
                  <svg v-else class="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M10.325 4.317c.426-1.756 2.924-1.756 3.35 0a1.724 1.724 0 002.573 1.066c1.543-.94 3.31.826 2.37 2.37a1.724 1.724 0 001.065 2.572c1.756.426 1.756 2.924 0 3.35a1.724 1.724 0 00-1.066 2.573c.94 1.543-.826 3.31-2.37 2.37a1.724 1.724 0 00-2.572 1.065c-.426 1.756-2.924 1.756-3.35 0a1.724 1.724 0 00-2.573-1.066c-1.543.94-3.31-.826-2.37-2.37a1.724 1.724 0 00-1.065-2.572c-1.756-.426-1.756-2.924 0-3.35a1.724 1.724 0 001.066-2.573c-.94-1.543.826-3.31 2.37-2.37.996.608 2.296.07 2.572-1.065z"/>
                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M15 12a3 3 0 11-6 0 3 3 0 016 0z"/>
                  </svg>
                  {{ loading.subscription ? 'Ouverture...' : 'Gérer le contrat' }}
                </button>
              </div>
            </div>
          </div>

          <!-- Plans disponibles -->
          <div v-if="!isPlanPerformance(subscriptionData.plan)" ref="plansSection" class="card-modern">
            <div class="mb-8 text-center">
              <h2 class="text-3xl font-bold text-gray-900 mb-4">Choisir le salaire de {{ agentName }}</h2>
              <p class="text-lg text-gray-600">Une vendeuse en boutique physique coûte 1 800€/mois — congés, charges et imprévus inclus. {{ agentName }} commence à 45€.</p>
            </div>

            <div class="grid md:grid-cols-2 gap-8">
              <!-- Starter Plan -->
              <div class="plan-card">
                <div class="plan-card-header">
                  <div class="text-center mb-6">
                    <div class="plan-icon-large bg-rose-600">
                      <svg class="w-8 h-8 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M13 10V3L4 14h7v7l9-11h-7z"/>
                      </svg>
                    </div>
                    <h3 class="text-2xl font-bold mb-2">{{ agentName }} Découverte</h3>
                    <div class="pricing">
                      <span class="price">45€</span>
                      <span class="period">/mois</span>
                    </div>
                    <p class="text-gray-600 text-sm">~ 29 500 FCFA/mois</p>
                    <p class="text-gray-600">Testez {{ agentName }} sans engagement</p>
                  </div>
                </div>
                
                <div class="plan-features">
                  <div v-for="feature in starterFeatures" :key="feature" class="feature-item">
                    <svg class="w-5 h-5 text-green-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M5 13l4 4L19 7"/>
                    </svg>
                    <span>{{ feature }}</span>
                  </div>
                </div>
                
                <div class="plan-card-footer">
                  <button
                    @click="handleSubscribeToPlan('starter')"
                    :disabled="loading.subscription || (subscriptionData.plan === 'starter' && subscriptionData.trialDaysLeft === 0 && subscriptionData.isActive)"
                    class="btn-plan-secondary"
                    :class="{ 'btn-plan-primary': subscriptionData.plan === 'starter' && subscriptionData.trialDaysLeft > 0 }"
                  >
                    <span v-if="loading.subscription && selectedPlan === 'starter'">
                      <svg class="animate-spin -ml-1 mr-2 h-4 w-4" fill="none" viewBox="0 0 24 24">
                        <circle class="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" stroke-width="4"></circle>
                        <path class="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                      </svg>
                      Traitement...
                    </span>
                    <span v-else-if="subscriptionData.plan === 'starter' && subscriptionData.trialDaysLeft > 0">Rémunérer {{ agentName }}</span>
                    <span v-else-if="subscriptionData.plan === 'starter' && subscriptionData.trialDaysLeft === 0 && !subscriptionData.isActive">Réembaucher {{ agentName }}</span>
                    <span v-else-if="subscriptionData.plan === 'starter'">Salaire actuel</span>
                    <span v-else>Tester {{ agentName }} pendant 14 jours</span>
                  </button>

                  <div class="plan-guarantee">
                    <svg class="w-4 h-4 text-green-500 mr-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 12l2 2 4-4m5.065.01l.032.006M12 21a9 9 0 110-18 9 9 0 010 18z"/>
                    </svg>
                    <span v-if="subscriptionData.plan === 'starter' && subscriptionData.trialDaysLeft > 0" class="text-xs text-gray-600">Résiliable à tout moment • Sans engagement</span>
                    <span v-else class="text-xs text-gray-600">14 jours d'essai sans engagement • Licenciez-la à tout moment</span>
                  </div>
                </div>
              </div>

              <!-- Growth Plan -->
              <div class="plan-card plan-card-featured">
                <div class="plan-card-header">
                  <div class="popular-badge">
                    <span class="text-sm font-bold">Recommandé</span>
                  </div>
                  
                  <div class="text-center mb-6">
                    <div class="plan-icon-large bg-purple-600">
                      <svg class="w-8 h-8 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M5 3v4M3 5h4M6 17v4m-2-2h4m5-16l2.286 6.857L21 12l-5.714 2.143L13 21l-2.286-6.857L5 12l5.714-2.143L13 3z"/>
                      </svg>
                    </div>
                    <h3 class="text-2xl font-bold mb-2">{{ agentName }} Pro</h3>
                    <div class="pricing">
                      <span class="price">145€</span>
                      <span class="period">/mois</span>
                    </div>
                    <p class="text-gray-600 text-sm">~ 95 000 FCFA/mois</p>
                    <p class="text-gray-600">{{ agentName }} vend à pleine puissance</p>
                  </div>
                </div>
                
                <div class="plan-features">
                  <div v-for="feature in growthFeatures" :key="feature" class="feature-item">
                    <svg class="w-5 h-5 text-green-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M5 13l4 4L19 7"/>
                    </svg>
                    <span>{{ feature }}</span>
                  </div>
                </div>
                
                <div class="plan-card-footer">
                  <button 
                    @click="handleSubscribeToPlan('growth')"
                    :disabled="loading.subscription || subscriptionData.plan === 'growth'"
                    class="btn-plan-primary"
                  >
                    <span v-if="loading.subscription && selectedPlan === 'growth'">
                      <svg class="animate-spin -ml-1 mr-2 h-4 w-4" fill="none" viewBox="0 0 24 24">
                        <circle class="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" stroke-width="4"></circle>
                        <path class="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                      </svg>
                      Traitement...
                    </span>
                    <span v-else-if="subscriptionData.plan === 'growth'">Salaire actuel</span>
                    <span v-else>Passer {{ agentName }} en Pro</span>
                  </button>
                  
                  <div class="plan-guarantee">
                    <svg class="w-4 h-4 text-green-500 mr-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 12l2 2 4-4m5.065.01l.032.006M12 21a9 9 0 110-18 9 9 0 010 18z"/>
                    </svg>
                    <span class="text-xs text-gray-600">Licenciez-la à tout moment</span>
                  </div>
                </div>
              </div>
            </div>

            <!-- Performance Plan (Contact) -->
            <div class="mt-8 bg-gradient-to-r from-gray-900 to-gray-800 rounded-2xl p-8 text-white text-center">
              <div class="max-w-2xl mx-auto">
                <div class="w-16 h-16 bg-gradient-to-r from-blue-500 to-purple-600 rounded-2xl flex items-center justify-center mx-auto mb-6">
                  <svg class="w-8 h-8 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-4m-5 0H3m2 0h2M7 3h10M12 13l-3-3 3-3m-3 3h12.5"/>
                  </svg>
                </div>
                <h3 class="text-3xl font-bold mb-4">{{ agentName }} Premium</h3>
                <p class="text-xl text-gray-300 mb-2">299€/mois <span class="text-base text-gray-400">~ 196 000 FCFA/mois</span></p>
                <p class="text-gray-400 mb-6">Pour les boutiques ambitieuses</p>
                <div class="grid grid-cols-2 md:grid-cols-4 gap-4 mb-8 text-sm">
                  <div class="flex items-center justify-center space-x-2">
                    <svg class="w-4 h-4 text-green-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M5 13l4 4L19 7"/>
                    </svg>
                    <span>Tout de {{ agentName }} Pro</span>
                  </div>
                  <div class="flex items-center justify-center space-x-2">
                    <svg class="w-4 h-4 text-green-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M5 13l4 4L19 7"/>
                    </svg>
                    <span>Expert dédié</span>
                  </div>
                  <div class="flex items-center justify-center space-x-2">
                    <svg class="w-4 h-4 text-green-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M5 13l4 4L19 7"/>
                    </svg>
                    <span>Accès API & Webhooks</span>
                  </div>
                  <div class="flex items-center justify-center space-x-2">
                    <svg class="w-4 h-4 text-green-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M5 13l4 4L19 7"/>
                    </svg>
                    <span>Boutiques illimitées</span>
                  </div>
                </div>
                <button 
                  @click="contactSales"
                  class="inline-flex items-center px-8 py-4 bg-gradient-to-r from-blue-600 to-purple-600 text-white font-bold text-lg rounded-xl hover:from-blue-700 hover:to-purple-700 transition-all shadow-lg"
                >
                  <svg class="w-6 h-6 mr-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M3 8l7.89 4.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z"/>
                  </svg>
                  Contactez-nous
                </button>
              </div>
            </div>
          </div>

          <!-- Growth/Performance Features (only show if subscribed) -->
          <div v-if="(isPlanGrowth(subscriptionData.plan) || isPlanPerformance(subscriptionData.plan)) && subscriptionData.isActive" class="card-modern">
            <div class="mb-6 text-center">
              <h2 class="text-2xl font-bold text-gray-900 mb-4">Vos fonctionnalités avancées</h2>
              <p class="text-gray-600">Profitez de toutes ces fonctionnalités exclusives</p>
            </div>

            <div class="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
              <div v-for="feature in getAdvancedFeatures()" :key="feature" class="bg-gradient-to-br from-purple-50 to-indigo-50 border border-purple-200 rounded-xl p-6">
                <div class="flex items-center space-x-3">
                  <div class="w-10 h-10 bg-purple-600 rounded-lg flex items-center justify-center">
                    <svg class="w-5 h-5 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M5 13l4 4L19 7"/>
                    </svg>
                  </div>
                  <span class="text-sm font-medium text-gray-900">{{ feature }}</span>
                </div>
              </div>
            </div>

            <div class="mt-8 text-center">
              <NuxtLink 
                to="/agent-ia"
                class="inline-flex items-center px-6 py-3 bg-purple-600 text-white font-medium rounded-lg hover:bg-purple-700 transition-colors"
              >
                <svg class="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9.663 17h4.673M12 3v1m6.364 1.636l-.707.707M21 12h-1M4 12H3m3.343-5.657l-.707-.707m2.828 9.9a5 5 0 117.072 0l-.548.547A3.374 3.374 0 0014 18.469V19a2 2 0 11-4 0v-.531c0-.895-.356-1.754-.988-2.386l-.548-.547z"/>
                </svg>
                Personnaliser {{ agentName }}
              </NuxtLink>
            </div>
          </div>
        </div>

        <!-- Sidebar -->
        <div class="lg:col-span-1 space-y-6">
          
          <!-- Trial Progress (si essai en cours) -->
          <div v-if="isPlanStarter(subscriptionData.plan) && subscriptionData.trialDaysLeft > 0" class="card-modern bg-gradient-to-br from-blue-50 to-indigo-50 border-blue-200">
            <h3 class="text-lg font-semibold text-gray-900 mb-4">Periode d'essai</h3>
            
            <div class="text-center mb-6">
              <div class="relative inline-flex items-center justify-center w-24 h-24 mb-4">
                <svg class="w-24 h-24 transform -rotate-90" viewBox="0 0 36 36">
                  <circle cx="18" cy="18" r="16" fill="none" stroke="#e5e7eb" stroke-width="2"/>
                  <circle cx="18" cy="18" r="16" fill="none" stroke="#3b82f6" stroke-width="2" 
                    :stroke-dasharray="`${(14 - subscriptionData.trialDaysLeft) * 7.14} 100`"/>
                </svg>
                <div class="absolute inset-0 flex items-center justify-center">
                  <span class="text-2xl font-bold text-blue-600">{{ subscriptionData.trialDaysLeft }}</span>
                </div>
              </div>
              <p class="text-sm text-gray-600">jour(s) restant(s)</p>
            </div>
            
            <div class="space-y-3">
              <div class="flex items-center justify-between text-sm">
                <span class="text-gray-600">{{ agentName }} est active sur le site</span>
                <span class="text-green-600 font-medium">Oui</span>
              </div>
              <div class="flex items-center justify-between text-sm">
                <span class="text-gray-600">Elle accompagne les visiteurs</span>
                <span class="text-green-600 font-medium">Oui</span>
              </div>
              <div class="flex items-center justify-between text-sm">
                <span class="text-gray-600">Elle recommande des produits</span>
                <span class="text-green-600 font-medium">Oui</span>
              </div>
            </div>
            
            <button 
              @click="scrollToPlans"
              class="w-full mt-4 px-4 py-2 bg-blue-600 text-white text-sm font-medium rounded-lg hover:bg-blue-700 transition-colors"
            >
              Choisir le salaire de {{ agentName }}
            </button>
          </div>

          <!-- Support Card -->
          <div class="card-modern bg-gradient-to-br from-blue-50 to-indigo-50 border-blue-200">
            <h3 class="text-lg font-semibold text-gray-900 mb-4">Besoin d'aide ?</h3>
            
            <div class="space-y-3">
              <button 
                @click="contactSupport"
                class="support-button"
              >
                <svg class="w-5 h-5 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M3 8l7.89 4.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z"/>
                </svg>
                <span>Contacter le support</span>
              </button>
              
              <button 
                @click="openDocumentation"
                class="support-button"
              >
                <svg class="w-5 h-5 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.746 0 3.332.477 4.5 1.253v13C19.832 18.477 18.246 18 16.5 18c-1.746 0-3.332.477-4.5 1.253"/>
                </svg>
                <span>Documentation</span>
              </button>
              
              <button 
                @click="scheduleDemo"
                class="support-button"
              >
                <svg class="w-5 h-5 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z"/>
                </svg>
                <span>Planifier une démo</span>
              </button>
            </div>

            <div class="mt-4 p-3 bg-white bg-opacity-70 rounded-lg">
              <p class="text-xs text-gray-600 text-center">
                <strong>Astuce :</strong> Consultez notre guide de démarrage pour optimiser vos conversions
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>

    <!-- 🎉 MODAL DE FÉLICITATIONS BEAUTÉ - VERSION AMÉLIORÉE -->
    <div v-if="successModal.show" class="fixed inset-0 z-50 overflow-y-auto animate-fade-in">
      <div class="flex items-center justify-center min-h-screen pt-4 px-4 pb-20 text-center sm:block sm:p-0">
        <!-- Background overlay avec animation -->
        <div class="fixed inset-0 transition-opacity bg-gradient-to-br from-rose-900/80 via-purple-900/80 to-pink-900/80 backdrop-blur-sm" aria-hidden="true"></div>

        <span class="hidden sm:inline-block sm:align-middle sm:h-screen" aria-hidden="true">&#8203;</span>

        <!-- Modal content avec design beauté premium -->
        <div class="inline-block align-bottom bg-white rounded-2xl px-6 pt-8 pb-6 text-left overflow-hidden shadow-2xl transform transition-all sm:my-8 sm:align-middle sm:max-w-2xl sm:w-full sm:p-10 animate-scale-in">

          <!-- Confetti animation (optionnel - CSS only) -->
          <div class="absolute top-0 left-0 right-0 h-2 bg-gradient-to-r from-rose-500 via-pink-500 to-purple-500"></div>

          <div>
            <!-- Icon premium avec gradient beauté -->
            <div class="mx-auto flex items-center justify-center h-24 w-24 rounded-full bg-gradient-to-br from-rose-500 via-pink-500 to-purple-500 shadow-xl mb-6 animate-bounce-subtle">
              <svg class="h-12 w-12 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M5 13l4 4L19 7"></path>
              </svg>
            </div>

            <!-- Titre et message -->
            <div class="text-center">
              <h3 class="text-3xl sm:text-4xl leading-tight font-bold bg-gradient-to-r from-rose-600 via-pink-600 to-purple-600 bg-clip-text text-transparent mb-4">
                🎉 Félicitations !
              </h3>
              <p class="text-xl text-gray-700 mb-6">
                Vous êtes maintenant abonné au plan <span class="font-bold text-rose-600">{{ successModal.planName }}</span>
              </p>

              <!-- Card des fonctionnalités activées -->
              <div class="bg-gradient-to-br from-rose-50 via-pink-50 to-purple-50 border-2 border-rose-200 rounded-xl p-6 mb-6 text-left">
                <div class="flex items-center mb-4">
                  <div class="w-10 h-10 bg-gradient-to-br from-green-500 to-emerald-500 rounded-full flex items-center justify-center mr-3">
                    <svg class="w-6 h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M13 10V3L4 14h7v7l9-11h-7z"/>
                    </svg>
                  </div>
                  <h4 class="text-lg font-bold text-gray-900">{{ agentName }} est maintenant en poste !</h4>
                </div>
                <ul class="text-sm text-gray-700 space-y-3 ml-2">
                  <li class="flex items-start">
                    <span class="text-green-500 mr-3 text-lg">✓</span>
                    <span><strong>Interface de {{ agentName }}</strong> activée sur votre boutique en ligne</span>
                  </li>
                  <li class="flex items-start">
                    <span class="text-green-500 mr-3 text-lg">✓</span>
                    <span><strong>Conversations</strong> disponibles 24h/24 pour vos clients</span>
                  </li>
                  <li class="flex items-start">
                    <span class="text-green-500 mr-3 text-lg">✓</span>
                    <span><strong>Toutes les fonctionnalités</strong> de votre plan accessibles</span>
                  </li>
                  <li class="flex items-start">
                    <span class="text-green-500 mr-3 text-lg">✓</span>
                    <span><strong>Analytics détaillées</strong> pour suivre vos performances</span>
                  </li>
                </ul>
              </div>

              <!-- Email confirmation -->
              <div class="flex items-center justify-center text-sm text-gray-600 bg-blue-50 border border-blue-200 rounded-lg p-3 mb-6">
                <svg class="w-4 h-4 mr-2 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z"/>
                </svg>
                Un email de confirmation a été envoyé à votre adresse
              </div>
            </div>
          </div>

          <!-- Actions -->
          <div class="mt-8">
            <div class="flex flex-col sm:flex-row gap-4">
              <button
                @click="goToAgents"
                class="flex-1 inline-flex items-center justify-center rounded-xl border border-transparent shadow-lg px-6 py-4 bg-gradient-to-r from-rose-600 to-pink-600 text-base font-bold text-white hover:from-rose-700 hover:to-pink-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-rose-500 transition-all duration-200 hover:scale-105"
              >
                <svg class="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M13 10V3L4 14h7v7l9-11h-7z"/>
                </svg>
                Personnaliser {{ agentName }}
              </button>
              <button
                @click="closeSuccessModal"
                class="flex-1 inline-flex items-center justify-center rounded-xl border-2 border-gray-300 shadow-sm px-6 py-4 bg-white text-base font-semibold text-gray-700 hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-gray-500 transition-all duration-200"
              >
                Continuer sur le tableau de bord
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>

    <!-- Notification -->
    <div v-if="notification.show" 
         class="fixed bottom-4 right-4 z-50 max-w-sm w-full bg-white border border-gray-200 rounded-lg shadow-lg p-4"
         :class="{
           'border-green-200 bg-green-50': notification.type === 'success',
           'border-red-200 bg-red-50': notification.type === 'error'
         }">
      <div class="flex items-center">
        <div class="flex-shrink-0">
          <svg v-if="notification.type === 'success'" class="w-5 h-5 text-green-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M5 13l4 4L19 7"/>
          </svg>
          <svg v-else class="w-5 h-5 text-red-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12"/>
          </svg>
        </div>
        <div class="ml-3">
          <p class="text-sm font-medium" 
             :class="{
               'text-green-800': notification.type === 'success',
               'text-red-800': notification.type === 'error'
             }">
            {{ notification.message }}
          </p>
        </div>
        <div class="ml-auto pl-3">
          <button @click="notification.show = false" class="text-gray-400 hover:text-gray-600">
            <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12"/>
            </svg>
          </button>
        </div>
      </div>
    </div>
  </div>
</template>

<style scoped>
/* Animations pour le modal de félicitations */
@keyframes fade-in {
  from { opacity: 0; }
  to { opacity: 1; }
}

@keyframes scale-in {
  from {
    opacity: 0;
    transform: scale(0.9);
  }
  to {
    opacity: 1;
    transform: scale(1);
  }
}

@keyframes bounce-subtle {
  0%, 100% { transform: translateY(0); }
  50% { transform: translateY(-10px); }
}

.animate-fade-in {
  animation: fade-in 0.3s ease-out;
}

.animate-scale-in {
  animation: scale-in 0.4s cubic-bezier(0.175, 0.885, 0.32, 1.275);
}

.animate-bounce-subtle {
  animation: bounce-subtle 2s ease-in-out infinite;
}
</style>

<script setup lang="ts">
import { ref, computed, onMounted } from 'vue'
import { useAuthStore } from '~/stores/auth'
import { useBilling } from '~~/composables/useBilling'

definePageMeta({
  middleware: 'auth',
  layout: 'default'
})

const authStore = useAuthStore()
const router = useRouter()
const api = useApi()
const agentName = ref('Mia')
const { getSubscriptionStatus, createCheckoutSession, createCustomerPortal, waitForSubscriptionUpdate } = useBilling()

// Types
type SubscriptionPlan = 'starter' | 'growth' | 'performance'

interface SubscriptionData {
  plan: SubscriptionPlan
  isActive: boolean
  trialDaysLeft: number
  trialEndDate: string
  nextBillingDate: string
}

// Reactive state
const loading = ref({
  main: false,
  subscription: false
})

const selectedPlan = ref<SubscriptionPlan | ''>('')
const plansSection = ref<HTMLElement>()

// Nouveaux états pour synchronisation
const syncing = ref(false)
const syncAttempt = ref(0)
const maxSyncAttempts = ref(12)

const successModal = ref({
  show: false,
  planName: '',
  plan: ''
})

const subscriptionData = ref<SubscriptionData>({
  plan: 'starter',
  isActive: true,
  trialDaysLeft: 14,
  trialEndDate: '',
  nextBillingDate: ''
})

// Notification system
const notification = ref({
  show: false,
  type: 'success' as 'success' | 'error',
  message: ''
})

// Features lists avec nouvelles données
const starterFeatures = computed(() => [
  `Apprend et maîtrise tous vos produits`,
  `Répond instantanément, 24h/24, 7j/7`,
  `Affiche vos produits directement dans la conversation`,
  `Passe la main à un humain si nécessaire`,
  `Vous voyez tout ce qu'elle fait et dit`,
  `Vend sur 1 boutique Shopify ou WooCommerce`,
  `Support en français`
])

const growthFeatures = computed(() => [
  `Tout ce qui est inclus dans ${agentName.value} Découverte`,
  `Propose naturellement des produits complémentaires`,
  `Ajoute les produits au panier pour le client`,
  `Vous donne des rapports sur ses ventes et vos clients`,
  `Parle plusieurs langues (FR, EN, et plus)`,
  `Vend sur jusqu'à 3 boutiques simultanément`,
  `Support prioritaire 7j/7`
])

const performanceFeatures = computed(() => [
  `Tout ce qui est inclus dans ${agentName.value} Pro`,
  `Un expert dédié suit ses performances avec vous`,
  `Se connecte à vos outils marketing et CRM`,
  `Personnalisation complète de son interface`,
  `Accès API & Webhooks`,
  `Vend sur un nombre illimité de boutiques`,
  `Support VIP 24/7`
])

// Computed properties
const getCurrentPlanFeatures = (): string[] => {
  const plan = subscriptionData.value.plan
  if (isPlanPerformance(plan)) {
    return performanceFeatures.value.slice(0, 4)
  } else if (isPlanGrowth(plan)) {
    return growthFeatures.value.slice(0, 4)
  } else {
    return starterFeatures.value.slice(0, 3)
  }
}

const getAdvancedFeatures = (): string[] => {
  const plan = subscriptionData.value.plan
  if (isPlanPerformance(plan)) {
    return performanceFeatures.value
  } else if (isPlanGrowth(plan)) {
    return growthFeatures.value
  }
  return []
}

// Utility methods
const getPlanName = (plan: SubscriptionPlan): string => {
  const names: Record<SubscriptionPlan, string> = {
    starter: `${agentName.value} Découverte`,
    growth: `${agentName.value} Pro`,
    performance: `${agentName.value} Premium`
  }
  return names[plan]
}

const getPlanPrice = (plan: SubscriptionPlan): string => {
  if (plan === 'starter') {
    return subscriptionData.value.trialDaysLeft > 0
      ? `Période d'essai — ${subscriptionData.value.trialDaysLeft} jours restants`
      : 'Contrat d\'essai terminé'
  }

  const prices: Record<Exclude<SubscriptionPlan, 'starter'>, string> = {
    growth: '145€/mois',
    performance: '299€/mois'
  }
  return prices[plan] || '45€/mois'
}

const isPlanPerformance = (plan: SubscriptionPlan): boolean => plan === 'performance'
const isPlanGrowth = (plan: SubscriptionPlan): boolean => plan === 'growth'
const isPlanStarter = (plan: SubscriptionPlan): boolean => plan === 'starter'

const getPlanCardClass = (plan: SubscriptionPlan): string => {
  const classes: Record<SubscriptionPlan, string> = {
    starter: subscriptionData.value.trialDaysLeft > 0 ? 'bg-blue-50 border-blue-200' : 'bg-red-50 border-red-200',
    growth: 'bg-purple-50 border-purple-200',
    performance: 'bg-gray-50 border-gray-200'
  }
  return classes[plan]
}

const getPlanIconClass = (plan: SubscriptionPlan): string => {
  const classes: Record<SubscriptionPlan, string> = {
    starter: subscriptionData.value.trialDaysLeft > 0 ? 'bg-blue-100 text-blue-600' : 'bg-red-100 text-red-600',
    growth: 'bg-purple-100 text-purple-600',
    performance: 'bg-gray-100 text-gray-600'
  }
  return classes[plan]
}

const getPlanIcon = (plan: SubscriptionPlan): string => {
  const icons: Record<SubscriptionPlan, string> = {
    starter: 'M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z',
    growth: 'M5 3v4M3 5h4M6 17v4m-2-2h4m5-16l2.286 6.857L21 12l-5.714 2.143L13 21l-2.286-6.857L5 12l5.714-2.143L13 3z',
    performance: 'M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-4m-5 0H3m2 0h2M7 3h10M12 13l-3-3 3-3m-3 3h12.5'
  }
  return icons[plan]
}

const getStatusLabel = (plan: SubscriptionPlan): string => {
  if (isPlanStarter(plan)) {
    return subscriptionData.value.trialDaysLeft > 0 ? 'Période d\'essai' : 'Expiré'
  }
  return subscriptionData.value.isActive ? 'Actif' : 'Inactif'
}

const getStatusBadgeClass = (plan: SubscriptionPlan): string => {
  if (isPlanStarter(plan)) {
    return subscriptionData.value.trialDaysLeft > 0 
      ? 'bg-blue-100 text-blue-800' 
      : 'bg-red-100 text-red-800'
  }
  return subscriptionData.value.isActive ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'
}

const formatDate = (dateString: string): string => {
  if (!dateString) return ''
  return new Date(dateString).toLocaleDateString('fr-FR', {
    year: 'numeric',
    month: 'long',
    day: 'numeric'
  })
}

const showNotification = (type: 'success' | 'error', message: string) => {
  notification.value = { show: true, type, message }
  setTimeout(() => {
    notification.value.show = false
  }, 5000)
}

// Fonction de chargement améliorée
const loadSubscriptionData = async () => {
  loading.value.main = true
  try {
    const data = await getSubscriptionStatus()
    subscriptionData.value = data
    console.log('Données d\'abonnement chargées:', data)
  } catch (error: any) {
    console.error('Erreur chargement abonnement:', error)
    showNotification('error', 'Erreur lors du chargement des données d\'abonnement')
  } finally {
    loading.value.main = false
  }
}

const refreshAllData = async () => {
  await loadSubscriptionData()
  await authStore.restoreSession()
  showNotification('success', 'Données actualisées')
}

// Souscription avec synchronisation intelligente
const handleSubscribeToPlan = async (plan: SubscriptionPlan) => {
  selectedPlan.value = plan
  loading.value.subscription = true
  
  try {
    const response = await createCheckoutSession(
      plan,
      `${window.location.origin}/billing?success=true&plan=${plan}`,
      `${window.location.origin}/billing?cancelled=true`
    )
    
    if (response.checkoutUrl) {
      window.location.href = response.checkoutUrl
    }
    
  } catch (error: any) {
    console.error('Erreur lors de la souscription:', error)
    showNotification('error', error.message || 'Erreur lors de la souscription au plan')
  } finally {
    loading.value.subscription = false
    selectedPlan.value = ''
  }
}

// Gestion d'abonnement avec Customer Portal
const handleManageSubscription = async () => {
  loading.value.subscription = true
  
  try {
    const response = await createCustomerPortal()
    
    if (response.portalUrl) {
      window.open(response.portalUrl, '_blank')
    }
    
  } catch (error: any) {
    console.error('Erreur ouverture portail client:', error)
    showNotification('error', error.message || 'Erreur lors de l\'ouverture du portail client')
  } finally {
    loading.value.subscription = false
  }
}

// Other action methods
const contactSupport = () => {
  window.open('https://chatseller.app/support', '_blank')
}

const contactSales = () => {
  window.location.href = 'mailto:sales@chatseller.app?subject=Demande plan Performance'
}

const openDocumentation = () => {
  window.open('https://docs.chatseller.app/billing', '_blank')
}

const scheduleDemo = () => {
  window.open('https://cal.com/chatseller/demo', '_blank')
}

const scrollToPlans = () => {
  plansSection.value?.scrollIntoView({ behavior: 'smooth' })
}

// Modal functions
const closeSuccessModal = () => {
  successModal.value.show = false
}

const goToAgents = () => {
  successModal.value.show = false
  router.push('/agent-ia')
}

// Lifecycle avec synchronisation robuste
onMounted(async () => {
  console.log('Composant billing monté')
  
  await loadSubscriptionData()

  // Load agent name
  api.agents.list().then((res: any) => {
    if (res.success && res.data?.length > 0) {
      agentName.value = res.data[0].name || 'Mia'
    }
  }).catch(() => {})

  // Gestion du retour de paiement avec synchronisation intelligente
  const urlParams = new URLSearchParams(window.location.search)
  if (urlParams.get('success') === 'true') {
    const planFromUrl = urlParams.get('plan')
    console.log('Retour de paiement réussi détecté pour le plan:', planFromUrl)
    
    // Afficher le modal immédiatement
    successModal.value = {
      show: true,
      planName: getPlanName((planFromUrl as SubscriptionPlan) || 'starter'),
      plan: planFromUrl || 'starter'
    }
    
    // Synchronisation intelligente en arrière-plan
    if (planFromUrl) {
      syncing.value = true
      syncAttempt.value = 0
      
      // Délai initial pour laisser le webhook traiter
      await new Promise(resolve => setTimeout(resolve, 2000))
      
      const success = await waitForSubscriptionUpdate(planFromUrl as SubscriptionPlan, maxSyncAttempts.value, 3000)
      
      if (success) {
        // Recharger les données finales
        await loadSubscriptionData()
        showNotification('success', 'Votre plan a été mis à jour avec succès !')
      } else {
        showNotification('error', 'La mise à jour prend plus de temps que prévu. Actualisez la page dans quelques minutes ou contactez le support.')
      }
      
      syncing.value = false
    }
    
    // Nettoyer l'URL
    window.history.replaceState({}, '', '/billing')
  } else if (urlParams.get('cancelled') === 'true') {
    showNotification('error', 'Le paiement a été annulé')
    window.history.replaceState({}, '', '/billing')
  }
})

useHead({
  title: 'Facturation - ChatSeller Dashboard'
})
</script>

<style scoped>
.card-modern {
  @apply bg-white rounded-xl shadow-sm border border-gray-200 p-6;
}

.btn-primary {
  @apply inline-flex items-center px-4 py-2 bg-rose-600 text-white text-sm font-medium rounded-lg hover:bg-rose-700 disabled:opacity-50 transition-colors;
}

.btn-secondary {
  @apply inline-flex items-center px-4 py-2 border border-gray-300 rounded-lg text-sm font-medium text-gray-700 bg-white hover:bg-gray-50 transition-colors;
}

.plan-upgrade-badge {
  @apply px-3 py-1 bg-gradient-to-r from-red-500 to-orange-600 text-white rounded-full text-xs font-medium animate-pulse;
}

.current-plan-card {
  @apply p-6 border rounded-xl;
}

.plan-icon {
  @apply flex h-12 w-12 items-center justify-center rounded-xl;
}

.plan-status-badge {
  @apply inline-flex items-center px-3 py-1 rounded-full text-sm font-medium;
}

.plan-card {
  @apply relative bg-white rounded-2xl border border-gray-200 p-8 transition-all hover:border-gray-300;
}

.plan-card-featured {
  @apply border-purple-300 bg-purple-50/30 transform scale-105 shadow-lg;
}

.plan-card-header {
  @apply relative;
}

.popular-badge {
  @apply absolute -top-4 left-1/2 transform -translate-x-1/2 bg-gradient-to-r from-purple-600 to-purple-700 text-white px-4 py-1 rounded-full text-sm font-bold;
}

.plan-icon-large {
  @apply w-16 h-16 rounded-2xl flex items-center justify-center mx-auto mb-4;
}

.pricing {
  @apply mb-4;
}

.price {
  @apply text-4xl font-bold text-gray-900;
}

.period {
  @apply text-lg text-gray-600;
}

.plan-features {
  @apply space-y-3 mb-8;
}

.feature-item {
  @apply flex items-center space-x-3 text-sm text-gray-700;
}

.plan-card-footer {
  @apply space-y-4;
}

.btn-plan-primary {
  @apply w-full py-4 px-6 bg-gradient-to-r from-purple-600 to-purple-700 text-white text-lg font-semibold rounded-xl hover:from-purple-700 hover:to-purple-800 focus:ring-4 focus:ring-purple-200 disabled:opacity-50 transition-all;
}

.btn-plan-secondary {
  @apply w-full py-4 px-6 border-2 border-rose-300 text-rose-700 text-lg font-semibold rounded-xl hover:border-rose-400 hover:bg-rose-50 transition-all;
}

.plan-guarantee {
  @apply flex items-center justify-center text-center;
}

.support-button {
  @apply w-full flex items-center space-x-3 px-4 py-3 text-sm font-medium text-gray-700 bg-white rounded-xl hover:bg-gray-50 border border-gray-200 hover:border-gray-300 transition-all;
}

@media (max-width: 768px) {
  .card-modern {
    @apply p-4;
  }
  
  .plan-card {
    @apply p-6;
  }
  
  .plan-card-featured {
    @apply transform-none scale-100;
  }
}

@keyframes spin {
  from { transform: rotate(0deg); }
  to { transform: rotate(360deg); }
}

.animate-spin {
  animation: spin 1s linear infinite;
}

@keyframes pulse {
  0%, 100% { opacity: 1; }
  50% { opacity: .5; }
}

.animate-pulse {
  animation: pulse 2s cubic-bezier(0.4, 0, 0.6, 1) infinite;
}
</style>