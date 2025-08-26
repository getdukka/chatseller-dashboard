<!-- pages/billing.vue - VERSION CORRIGÉE -->
<template>
  <div class="min-h-screen bg-gray-50">
    <!-- Header -->
    <div class="bg-white shadow-sm border-b border-gray-200">
      <div class="px-8 py-6">
        <div class="flex items-center justify-between">
          <div>
            <h1 class="text-3xl font-bold text-gray-900">Facturation & Abonnement</h1>
            <p class="mt-2 text-gray-600">
              Gérez votre plan et vos paiements en toute sécurité
            </p>
          </div>
          
          <div class="flex items-center space-x-4">
            <!-- Status Badge -->
            <div v-if="subscriptionData.isActive && !isPlanFree(subscriptionData.plan)" class="flex items-center space-x-2 px-3 py-2 bg-green-50 border border-green-200 rounded-lg">
              <div class="w-2 h-2 bg-green-500 rounded-full"></div>
              <span class="text-sm font-medium text-green-700">Abonnement actif</span>
            </div>
            
            <div v-else-if="isPlanFree(subscriptionData.plan) && subscriptionData.trialDaysLeft > 0" class="flex items-center space-x-2 px-3 py-2 bg-blue-50 border border-blue-200 rounded-lg">
              <div class="w-2 h-2 bg-blue-500 rounded-full animate-pulse"></div>
              <span class="text-sm font-medium text-blue-700">Essai gratuit - {{ subscriptionData.trialDaysLeft }} jour(s)</span>
            </div>
            
            <div v-else class="flex items-center space-x-2 px-3 py-2 bg-red-50 border border-red-200 rounded-lg">
              <div class="w-2 h-2 bg-red-500 rounded-full"></div>
              <span class="text-sm font-medium text-red-700">Accès suspendu</span>
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
          <div class="animate-spin h-12 w-12 border-4 border-blue-600 border-t-transparent rounded-full mx-auto mb-4"></div>
          <h3 class="text-lg font-semibold mb-2">Synchronisation en cours...</h3>
          <p class="text-gray-600">Nous mettons à jour votre abonnement</p>
          <div class="mt-4 text-sm text-gray-500">
            Tentative {{ syncAttempt }}/{{ maxSyncAttempts }}
          </div>
        </div>
      </div>

      <!-- Alertes selon l'état -->
      <div v-if="isPlanFree(subscriptionData.plan) && subscriptionData.trialDaysLeft > 0" class="mb-8">
        <div class="bg-gradient-to-r from-blue-600 to-purple-600 rounded-xl shadow-xl overflow-hidden relative">
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
                      Essai gratuit : {{ subscriptionData.trialDaysLeft }} jour(s) restant(s)
                    </h2>
                    <p class="text-blue-100 text-lg">
                      Profitez de toutes les fonctionnalités Starter gratuitement pendant 7 jours.
                      <br>
                      <span class="font-semibold text-yellow-200">
                        Après {{ subscriptionData.trialDaysLeft }} jour(s), choisissez un plan pour continuer.
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
                    Choisir Starter (19€/mois)
                  </button>
                  
                  <button 
                    @click="scrollToPlans"
                    class="inline-flex items-center px-8 py-4 bg-gradient-to-r from-yellow-400 to-orange-400 rounded-xl text-gray-900 font-bold text-lg hover:from-yellow-300 hover:to-orange-300 transition-all shadow-lg"
                  >
                    <svg class="w-6 h-6 mr-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M5 3v4M3 5h4M6 17v4m-2-2h4m5-16l2.286 6.857L21 12l-5.714 2.143L13 21l-2.286-6.857L5 12l5.714-2.143L13 3z"/>
                    </svg>
                    Passer au Pro (29€/mois)
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      <!-- Alerte essai expiré -->
      <div v-if="isPlanFree(subscriptionData.plan) && subscriptionData.trialDaysLeft === 0" class="mb-8">
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
                    <h2 class="text-3xl font-bold mb-2">Essai gratuit terminé</h2>
                    <p class="text-red-100 text-lg">
                      Votre Vendeur IA et votre widget sont maintenant <span class="font-bold">désactivés</span>.
                      <br>
                      <span class="font-semibold text-yellow-200">
                        Choisissez un plan pour réactiver votre Vendeur IA !
                      </span>
                    </p>
                  </div>
                </div>
                
                <div class="bg-red-800 bg-opacity-50 rounded-lg p-4 mb-6">
                  <h3 class="font-semibold mb-2">Fonctionnalités désactivées :</h3>
                  <ul class="text-sm text-red-100 space-y-1">
                    <li>• Votre Vendeur IA ne répond plus aux visiteurs</li>
                    <li>• Le widget ChatSeller est invisible sur votre site</li>
                    <li>• Aucune nouvelle conversation ne peut être créée</li>
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
                    Choisir Starter (19€/mois)
                  </button>
                  
                  <button 
                    @click="scrollToPlans"
                    class="inline-flex items-center px-8 py-4 bg-gradient-to-r from-yellow-400 to-orange-400 rounded-xl text-gray-900 font-bold text-lg hover:from-yellow-300 hover:to-orange-300 transition-all shadow-lg"
                  >
                    <svg class="w-6 h-6 mr-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M5 3v4M3 5h4M6 17v4m-2-2h4m5-16l2.286 6.857L21 12l-5.714 2.143L13 21l-2.286-6.857L5 12l5.714-2.143L13 3z"/>
                    </svg>
                    Passer au Pro (29€/mois)
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
              <h2 class="text-xl font-semibold text-gray-900">Plan actuel</h2>
              <div v-if="isPlanFree(subscriptionData.plan)" class="plan-upgrade-badge">
                <span class="text-xs font-medium">Choisissez un plan pour continuer</span>
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
                  <p v-if="subscriptionData.nextBillingDate && subscriptionData.isActive && !isPlanFree(subscriptionData.plan)" class="text-sm text-gray-500 mt-2">
                    Prochain paiement : {{ formatDate(subscriptionData.nextBillingDate) }}
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
                  v-if="subscriptionData.plan === 'free'"
                  @click="scrollToPlans"
                  class="btn-primary"
                >
                  <svg class="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M13 7h8m0 0v8m0-8l-8 8-4-4-6 6"/>
                  </svg>
                  {{ subscriptionData.trialDaysLeft > 0 ? 'Choisir un plan' : 'Réactiver votre Vendeur IA' }}
                </button>

                <button 
                  v-if="subscriptionData.plan === 'starter' && subscriptionData.isActive"
                  @click="scrollToPlans"
                  class="btn-primary"
                >
                  <svg class="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M13 7h8m0 0v8m0-8l-8 8-4-4-6 6"/>
                  </svg>
                  Passer au Pro
                </button>
                
                <button 
                  v-if="subscriptionData.isActive && !isPlanFree(subscriptionData.plan)"
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
                  {{ loading.subscription ? 'Ouverture...' : 'Gérer l\'abonnement' }}
                </button>
              </div>
            </div>
          </div>

          <!-- Plans disponibles -->
          <div v-if="!isPlanPro(subscriptionData.plan)" ref="plansSection" class="card-modern">
            <div class="mb-8 text-center">
              <h2 class="text-3xl font-bold text-gray-900 mb-4">Choisissez votre plan</h2>
              <p class="text-lg text-gray-600">Déverrouillez tout le potentiel de ChatSeller</p>
            </div>

            <div class="grid md:grid-cols-2 gap-8">
              <!-- Starter Plan -->
              <div class="plan-card">
                <div class="plan-card-header">
                  <div class="text-center mb-6">
                    <div class="plan-icon-large bg-blue-600">
                      <svg class="w-8 h-8 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M13 10V3L4 14h7v7l9-11h-7z"/>
                      </svg>
                    </div>
                    <h3 class="text-2xl font-bold mb-2">Starter</h3>
                    <div class="pricing">
                      <span class="price">19€</span>
                      <span class="period">/mois</span>
                    </div>
                    <p class="text-gray-600">Pour débuter avec l'IA commerciale</p>
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
                    :disabled="loading.subscription || subscriptionData.plan === 'starter'"
                    class="btn-plan-secondary"
                  >
                    <span v-if="loading.subscription && selectedPlan === 'starter'">
                      <svg class="animate-spin -ml-1 mr-2 h-4 w-4" fill="none" viewBox="0 0 24 24">
                        <circle class="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" stroke-width="4"></circle>
                        <path class="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                      </svg>
                      Traitement...
                    </span>
                    <span v-else-if="subscriptionData.plan === 'starter'">Plan actuel</span>
                    <span v-else>Choisir Starter</span>
                  </button>
                  
                  <div class="plan-guarantee">
                    <svg class="w-4 h-4 text-green-500 mr-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 12l2 2 4-4m5.065.01l.032.006M12 21a9 9 0 110-18 9 9 0 010 18z"/>
                    </svg>
                    <span class="text-xs text-gray-600">Annulation possible à tout moment</span>
                  </div>
                </div>
              </div>

              <!-- Pro Plan -->
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
                    <h3 class="text-2xl font-bold mb-2">Pro</h3>
                    <div class="pricing">
                      <span class="price">29€</span>
                      <span class="period">/mois</span>
                    </div>
                    <p class="text-gray-600">Pour les e-commerçants ambitieux</p>
                  </div>
                </div>
                
                <div class="plan-features">
                  <div v-for="feature in proFeatures" :key="feature" class="feature-item">
                    <svg class="w-5 h-5 text-green-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M5 13l4 4L19 7"/>
                    </svg>
                    <span>{{ feature }}</span>
                  </div>
                </div>
                
                <div class="plan-card-footer">
                  <button 
                    @click="handleSubscribeToPlan('pro')"
                    :disabled="loading.subscription || subscriptionData.plan === 'pro'"
                    class="btn-plan-primary"
                  >
                    <span v-if="loading.subscription && selectedPlan === 'pro'">
                      <svg class="animate-spin -ml-1 mr-2 h-4 w-4" fill="none" viewBox="0 0 24 24">
                        <circle class="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" stroke-width="4"></circle>
                        <path class="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                      </svg>
                      Traitement...
                    </span>
                    <span v-else-if="subscriptionData.plan === 'pro'">Plan actuel</span>
                    <span v-else>Passer au Pro</span>
                  </button>
                  
                  <div class="plan-guarantee">
                    <svg class="w-4 h-4 text-green-500 mr-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 12l2 2 4-4m5.065.01l.032.006M12 21a9 9 0 110-18 9 9 0 010 18z"/>
                    </svg>
                    <span class="text-xs text-gray-600">Annulation possible à tout moment</span>
                  </div>
                </div>
              </div>
            </div>
          </div>

          <!-- Pro Features (only show if Pro) -->
          <div v-if="isPlanPro(subscriptionData.plan) && subscriptionData.isActive" class="card-modern">
            <div class="mb-6 text-center">
              <h2 class="text-2xl font-bold text-gray-900 mb-4">Vos fonctionnalités Pro</h2>
              <p class="text-gray-600">Profitez de toutes ces fonctionnalités avancées</p>
            </div>

            <div class="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
              <div v-for="feature in proFeatures" :key="feature" class="bg-gradient-to-br from-purple-50 to-indigo-50 border border-purple-200 rounded-xl p-6">
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
                to="/vendeurs-ia"
                class="inline-flex items-center px-6 py-3 bg-purple-600 text-white font-medium rounded-lg hover:bg-purple-700 transition-colors"
              >
                <svg class="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9.663 17h4.673M12 3v1m6.364 1.636l-.707.707M21 12h-1M4 12H3m3.343-5.657l-.707-.707m2.828 9.9a5 5 0 117.072 0l-.548.547A3.374 3.374 0 0014 18.469V19a2 2 0 11-4 0v-.531c0-.895-.356-1.754-.988-2.386l-.548-.547z"/>
                </svg>
                Commencer à créer vos Vendeurs IA
              </NuxtLink>
            </div>
          </div>
        </div>

        <!-- Sidebar -->
        <div class="lg:col-span-1 space-y-6">
          
          <!-- Trial Progress (si essai en cours) -->
          <div v-if="isPlanFree(subscriptionData.plan) && subscriptionData.trialDaysLeft > 0" class="card-modern bg-gradient-to-br from-blue-50 to-indigo-50 border-blue-200">
            <h3 class="text-lg font-semibold text-gray-900 mb-4">Votre essai gratuit</h3>
            
            <div class="text-center mb-6">
              <div class="relative inline-flex items-center justify-center w-24 h-24 mb-4">
                <svg class="w-24 h-24 transform -rotate-90" viewBox="0 0 36 36">
                  <circle cx="18" cy="18" r="16" fill="none" stroke="#e5e7eb" stroke-width="2"/>
                  <circle cx="18" cy="18" r="16" fill="none" stroke="#3b82f6" stroke-width="2" 
                    :stroke-dasharray="`${(7 - subscriptionData.trialDaysLeft) * 14.28} 100`"/>
                </svg>
                <div class="absolute inset-0 flex items-center justify-center">
                  <span class="text-2xl font-bold text-blue-600">{{ subscriptionData.trialDaysLeft }}</span>
                </div>
              </div>
              <p class="text-sm text-gray-600">jour(s) restant(s)</p>
            </div>
            
            <div class="space-y-3">
              <div class="flex items-center justify-between text-sm">
                <span class="text-gray-600">Vendeur IA actif</span>
                <span class="text-green-600 font-medium">Oui</span>
              </div>
              <div class="flex items-center justify-between text-sm">
                <span class="text-gray-600">Widget fonctionnel</span>
                <span class="text-green-600 font-medium">Oui</span>
              </div>
              <div class="flex items-center justify-between text-sm">
                <span class="text-gray-600">Conversations illimitées</span>
                <span class="text-green-600 font-medium">Oui</span>
              </div>
            </div>
            
            <button 
              @click="scrollToPlans"
              class="w-full mt-4 px-4 py-2 bg-blue-600 text-white text-sm font-medium rounded-lg hover:bg-blue-700 transition-colors"
            >
              Souscrire maintenant
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

    <!-- Modal de confirmation de paiement (CORRIGÉ) -->
    <div v-if="successModal.show" class="fixed inset-0 z-50 overflow-y-auto">
      <div class="flex items-center justify-center min-h-screen pt-4 px-4 pb-20 text-center sm:block sm:p-0">
        <div class="fixed inset-0 transition-opacity" aria-hidden="true">
          <div class="absolute inset-0 bg-gray-500 opacity-75"></div>
        </div>

        <span class="hidden sm:inline-block sm:align-middle sm:h-screen" aria-hidden="true">&#8203;</span>

        <div class="inline-block align-bottom bg-white rounded-lg px-4 pt-5 pb-4 text-left overflow-hidden shadow-xl transform transition-all sm:my-8 sm:align-middle sm:max-w-lg sm:w-full sm:p-6">
          <div>
            <div class="mx-auto flex items-center justify-center h-16 w-16 rounded-full bg-green-100">
              <svg class="h-8 w-8 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M5 13l4 4L19 7"></path>
              </svg>
            </div>
            <div class="mt-3 text-center sm:mt-5">
              <h3 class="text-2xl leading-6 font-bold text-gray-900">
                Paiement confirmé !
              </h3>
              <div class="mt-4">
                <p class="text-lg text-gray-600 mb-4">
                  Félicitations ! Vous êtes maintenant abonné au plan <strong>{{ successModal.planName }}</strong>.
                </p>
                <div class="bg-green-50 border border-green-200 rounded-lg p-4 mb-4">
                  <h4 class="font-semibold text-green-800 mb-2">Votre Vendeur IA est maintenant actif !</h4>
                  <ul class="text-sm text-green-700 space-y-1">
                    <li>• Widget ChatSeller activé sur votre site</li>
                    <li>• Conversations illimitées disponibles</li>
                    <li>• Accès à toutes les fonctionnalités du plan</li>
                    <li>• Analytics détaillées activées</li>
                  </ul>
                </div>
                <p class="text-sm text-gray-500">
                  Un email de confirmation a été envoyé à votre adresse.
                </p>
              </div>
            </div>
          </div>
          <div class="mt-6 sm:mt-8">
            <div class="flex flex-col sm:flex-row gap-3">
              <button 
                @click="goToAgents"
                class="w-full inline-flex justify-center rounded-md border border-transparent shadow-sm px-4 py-2 bg-blue-600 text-base font-medium text-white hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 sm:text-sm"
              >
                <svg class="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9.663 17h4.673M12 3v1m6.364 1.636l-.707.707M21 12h-1M4 12H3m3.343-5.657l-.707-.707m2.828 9.9a5 5 0 117.072 0l-.548.547A3.374 3.374 0 0014 18.469V19a2 2 0 11-4 0v-.531c0-.895-.356-1.754-.988-2.386l-.548-.547z"/>
                </svg>
                Configurer mon Vendeur IA
              </button>
              <button 
                @click="closeSuccessModal"
                class="w-full inline-flex justify-center rounded-md border border-gray-300 shadow-sm px-4 py-2 bg-white text-base font-medium text-gray-700 hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 sm:text-sm"
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
const { getSubscriptionStatus, createCheckoutSession, createCustomerPortal, waitForSubscriptionUpdate } = useBilling()

// Types
type SubscriptionPlan = 'free' | 'starter' | 'pro'

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

// ✅ NOUVEAUX ÉTATS POUR SYNCHRONISATION
const syncing = ref(false)
const syncAttempt = ref(0)
const maxSyncAttempts = ref(12)

const successModal = ref({
  show: false,
  planName: '',
  plan: ''
})

const subscriptionData = ref<SubscriptionData>({
  plan: 'free',
  isActive: true,
  trialDaysLeft: 7,
  trialEndDate: '',
  nextBillingDate: ''
})

// Notification system
const notification = ref({
  show: false,
  type: 'success' as 'success' | 'error',
  message: ''
})

// Features lists
const starterFeatures = [
  '1 Vendeur IA spécialisé',
  '1000 crédits messages/mois',
  '10 documents dans la base de connaissances',
  'Détection automatique des infos produits',
  'Intégration widget (Shopify, WooCommerce, etc.)',
  'Analytics de base',
  'Support email'
  
]

const proFeatures = [
  'Tout du plan Starter',
  '3 Vendeurs IA spécialisés',
  '5000 crédits messages/mois',
  '50 documents dans la base de connaissances',
  'Upsell automatique intelligent',
  'Analytics avancées & ROI',
  'Support prioritaire',
  'API & webhooks'
]

// Computed properties
const getCurrentPlanFeatures = (): string[] => {
  const plan = subscriptionData.value.plan
  if (isPlanPro(plan)) {
    return proFeatures.slice(0, 4)
  } else if (isPlanStarter(plan)) {
    return starterFeatures.slice(0, 3)
  } else {
    return ['Essai gratuit 7 jours', 'Toutes les fonctionnalités Starter', 'Support par email']
  }
}

// Utility methods
const getPlanName = (plan: SubscriptionPlan): string => {
  const names: Record<SubscriptionPlan, string> = {
    free: 'Essai Gratuit',
    starter: 'Starter',
    pro: 'Pro'
  }
  return names[plan]
}

const getPlanPrice = (plan: SubscriptionPlan): string => {
  if (plan === 'free') {
    return subscriptionData.value.trialDaysLeft > 0 
      ? `${subscriptionData.value.trialDaysLeft} jours gratuits`
      : 'Essai expiré'
  }
  
  const prices: Record<Exclude<SubscriptionPlan, 'free'>, string> = {
    starter: '19€/mois',
    pro: '29€/mois'
  }
  return prices[plan] || ''
}

const isPlanPro = (plan: SubscriptionPlan): boolean => plan === 'pro'
const isPlanStarter = (plan: SubscriptionPlan): boolean => plan === 'starter'
const isPlanFree = (plan: SubscriptionPlan): boolean => plan === 'free'

const getPlanCardClass = (plan: SubscriptionPlan): string => {
  const classes: Record<SubscriptionPlan, string> = {
    free: subscriptionData.value.trialDaysLeft > 0 ? 'bg-blue-50 border-blue-200' : 'bg-red-50 border-red-200',
    starter: 'bg-blue-50 border-blue-200',
    pro: 'bg-purple-50 border-purple-200'
  }
  return classes[plan]
}

const getPlanIconClass = (plan: SubscriptionPlan): string => {
  const classes: Record<SubscriptionPlan, string> = {
    free: subscriptionData.value.trialDaysLeft > 0 ? 'bg-blue-100 text-blue-600' : 'bg-red-100 text-red-600',
    starter: 'bg-blue-100 text-blue-600',
    pro: 'bg-purple-100 text-purple-600'
  }
  return classes[plan]
}

const getPlanIcon = (plan: SubscriptionPlan): string => {
  const icons: Record<SubscriptionPlan, string> = {
    free: 'M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z',
    starter: 'M13 10V3L4 14h7v7l9-11h-7z',
    pro: 'M5 3v4M3 5h4M6 17v4m-2-2h4m5-16l2.286 6.857L21 12l-5.714 2.143L13 21l-2.286-6.857L5 12l5.714-2.143L13 3z'
  }
  return icons[plan]
}

const getStatusLabel = (plan: SubscriptionPlan): string => {
  if (isPlanFree(plan)) {
    return subscriptionData.value.trialDaysLeft > 0 ? 'Essai gratuit' : 'Expiré'
  }
  return subscriptionData.value.isActive ? 'Actif' : 'Inactif'
}

const getStatusBadgeClass = (plan: SubscriptionPlan): string => {
  if (isPlanFree(plan)) {
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

// ✅ FONCTION DE CHARGEMENT AMÉLIORÉE
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

// ✅ SOUSCRIPTION AVEC SYNCHRONISATION INTELLIGENTE
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

// ✅ GESTION D'ABONNEMENT AVEC CUSTOMER PORTAL
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
  window.location.href = 'mailto:support@chatseller.app?subject=Aide avec la facturation'
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
  router.push('/vendeurs-ia')
}

// ✅ LIFECYCLE AVEC SYNCHRONISATION ROBUSTE
onMounted(async () => {
  console.log('Composant billing monté')
  
  await loadSubscriptionData()
  
  // ✅ GESTION DU RETOUR DE PAIEMENT AVEC SYNCHRONISATION INTELLIGENTE
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
    
    // ✅ SYNCHRONISATION INTELLIGENTE EN ARRIÈRE-PLAN
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
  @apply inline-flex items-center px-4 py-2 bg-blue-600 text-white text-sm font-medium rounded-lg hover:bg-blue-700 disabled:opacity-50 transition-colors;
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
  @apply w-full py-4 px-6 border-2 border-blue-300 text-blue-700 text-lg font-semibold rounded-xl hover:border-blue-400 hover:bg-blue-50 transition-all;
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