<!-- pages/billing.vue - VERSION AVEC ÉTAT MIS À JOUR APRÈS PAIEMENT -->
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
            <div v-if="subscriptionData.isActive" class="flex items-center space-x-2 px-3 py-2 bg-green-50 border border-green-200 rounded-lg">
              <div class="w-2 h-2 bg-green-500 rounded-full"></div>
              <span class="text-sm font-medium text-green-700">Abonnement actif</span>
            </div>
            
            <button
              @click="refreshBillingData"
              :disabled="loading"
              class="inline-flex items-center px-4 py-2 border border-gray-300 rounded-lg text-sm font-medium text-gray-700 bg-white hover:bg-gray-50 disabled:opacity-50 transition-colors"
            >
              <svg 
                class="w-4 h-4 mr-2" 
                :class="{ 'animate-spin': loading }"
                fill="none" 
                stroke="currentColor" 
                viewBox="0 0 24 24"
              >
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15"/>
              </svg>
              {{ loading ? 'Actualisation...' : 'Actualiser' }}
            </button>
          </div>
        </div>
      </div>
    </div>

    <!-- Content -->
    <div class="p-8">
      <!-- Success Alert Pro -->
      <div v-if="subscriptionData.plan === 'professional' && subscriptionData.isActive" class="mb-8">
        <div class="bg-gradient-to-r from-green-600 to-emerald-600 rounded-xl shadow-lg overflow-hidden">
          <div class="px-8 py-6 text-white relative">
            <div class="flex items-center justify-between">
              <div>
                <h2 class="text-2xl font-bold mb-2">🎉 Félicitations ! Vous êtes maintenant Pro</h2>
                <p class="text-green-100 text-lg mb-4">
                  Profitez de toutes les fonctionnalités avancées de ChatSeller.
                  <span class="font-semibold">Votre abonnement est maintenant actif !</span>
                </p>
                <div class="flex flex-wrap gap-3">
                  <NuxtLink 
                    to="/vendeurs-ia"
                    class="inline-flex items-center px-6 py-3 bg-white bg-opacity-20 rounded-lg text-white font-medium hover:bg-opacity-30 transition-all backdrop-blur-sm"
                  >
                    <svg class="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9.663 17h4.673M12 3v1m6.364 1.636l-.707.707M21 12h-1M4 12H3m3.343-5.657l-.707-.707m2.828 9.9a5 5 0 117.072 0l-.548.547A3.374 3.374 0 0014 18.469V19a2 2 0 11-4 0v-.531c0-.895-.356-1.754-.988-2.386l-.548-.547z"/>
                    </svg>
                    Créer vos Vendeurs IA
                  </NuxtLink>
                  <button 
                    @click="manageSubscription"
                    class="inline-flex items-center px-6 py-3 bg-white bg-opacity-10 border border-white border-opacity-30 rounded-lg text-white font-medium hover:bg-opacity-20 transition-all backdrop-blur-sm"
                  >
                    <svg class="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M10.325 4.317c.426-1.756 2.924-1.756 3.35 0a1.724 1.724 0 002.573 1.066c1.543-.94 3.31.826 2.37 2.37a1.724 1.724 0 001.065 2.572c1.756.426 1.756 2.924 0 3.35a1.724 1.724 0 00-1.066 2.573c.94 1.543-.826 3.31-2.37 2.37a1.724 1.724 0 00-2.572 1.065c-.426 1.756-2.924 1.756-3.35 0a1.724 1.724 0 00-2.573-1.066c-1.543.94-3.31-.826-2.37-2.37a1.724 1.724 0 00-1.065-2.572c-1.756-.426-1.756-2.924 0-3.35a1.724 1.724 0 001.066-2.573c-.94-1.543.826-3.31 2.37-2.37.996.608 2.296.07 2.572-1.065z"/>
                      <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M15 12a3 3 0 11-6 0 3 3 0 016 0z"/>
                    </svg>
                    Gérer l'abonnement
                  </button>
                </div>
              </div>
              <div class="hidden lg:block">
                <div class="w-32 h-32 bg-white bg-opacity-10 rounded-full flex items-center justify-center backdrop-blur-sm">
                  <div class="text-center">
                    <div class="text-3xl font-bold">PRO</div>
                    <div class="text-sm opacity-80">Actif</div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      <!-- Trial Alert (only if still on free) -->
      <div v-else-if="subscriptionData.plan === 'free' && subscriptionData.trialDaysLeft > 0" class="mb-8">
        <div class="bg-gradient-to-r from-blue-600 to-purple-600 rounded-xl shadow-lg overflow-hidden">
          <div class="px-8 py-6 text-white relative">
            <div class="flex items-center justify-between">
              <div>
                <h2 class="text-2xl font-bold mb-2">🎉 Période d'essai gratuite</h2>
                <p class="text-blue-100 text-lg mb-4">
                  Profitez de toutes les fonctionnalités Starter gratuitement.
                  <span class="font-semibold">{{ subscriptionData.trialDaysLeft }} jour(s) restant(s)</span>
                </p>
                <div class="flex flex-wrap gap-3">
                  <button 
                    @click="scrollToPlans"
                    class="inline-flex items-center px-6 py-3 bg-white bg-opacity-20 rounded-lg text-white font-medium hover:bg-opacity-30 transition-all backdrop-blur-sm"
                  >
                    <svg class="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M5 3v4M3 5h4M6 17v4m-2-2h4m5-16l2.286 6.857L21 12l-5.714 2.143L13 21l-2.286-6.857L5 12l5.714-2.143L13 3z"/>
                    </svg>
                    Choisir un plan maintenant
                  </button>
                  <button 
                    @click="contactSupport"
                    class="inline-flex items-center px-6 py-3 bg-white bg-opacity-10 border border-white border-opacity-30 rounded-lg text-white font-medium hover:bg-opacity-20 transition-all backdrop-blur-sm"
                  >
                    <svg class="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M8.228 9c.549-1.165 2.03-2 3.772-2 2.21 0 4 1.343 4 3 0 1.4-1.278 2.575-3.006 2.907-.542.104-.994.54-.994 1.093m0 3h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"/>
                    </svg>
                    Besoin d'aide ?
                  </button>
                </div>
              </div>
              <div class="hidden lg:block">
                <div class="w-32 h-32 bg-white bg-opacity-10 rounded-full flex items-center justify-center backdrop-blur-sm">
                  <div class="text-center">
                    <div class="text-3xl font-bold">{{ subscriptionData.trialDaysLeft }}</div>
                    <div class="text-sm opacity-80">jour(s)</div>
                  </div>
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
              <div class="plan-upgrade-badge" v-if="subscriptionData.plan === 'free'">
                <span class="text-xs font-medium">Passez au Pro pour débloquer tout le potentiel</span>
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
                  <p v-if="subscriptionData.nextBillingDate && subscriptionData.plan !== 'free'" class="text-sm text-gray-500 mt-2">
                    Prochain paiement : {{ formatDate(subscriptionData.nextBillingDate) }}
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
                  Passer au Pro
                </button>
                
                <button 
                  v-if="subscriptionData.plan === 'professional'"
                  @click="manageSubscription"
                  class="btn-secondary"
                >
                  <svg class="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M10.325 4.317c.426-1.756 2.924-1.756 3.35 0a1.724 1.724 0 002.573 1.066c1.543-.94 3.31.826 2.37 2.37a1.724 1.724 0 001.065 2.572c1.756.426 1.756 2.924 0 3.35a1.724 1.724 0 00-1.066 2.573c.94 1.543-.826 3.31-2.37 2.37a1.724 1.724 0 00-2.572 1.065c-.426 1.756-2.924 1.756-3.35 0a1.724 1.724 0 00-2.573-1.066c-1.543.94-3.31-.826-2.37-2.37a1.724 1.724 0 00-1.065-2.572c-1.756-.426-1.756-2.924 0-3.35a1.724 1.724 0 001.066-2.573c-.94-1.543.826-3.31 2.37-2.37.996.608 2.296.07 2.572-1.065z"/>
                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M15 12a3 3 0 11-6 0 3 3 0 016 0z"/>
                  </svg>
                  Gérer l'abonnement
                </button>
                
                <button 
                  v-if="subscriptionData.plan !== 'free'"
                  @click="showCancelModal = true"
                  class="btn-danger"
                >
                  <svg class="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12"/>
                  </svg>
                  Annuler l'abonnement
                </button>
              </div>
            </div>
          </div>

          <!-- Available Plans (only show if not Professional) -->
          <div v-if="subscriptionData.plan !== 'professional'" ref="plansSection" class="card-modern">
            <div class="mb-8 text-center">
              <h2 class="text-3xl font-bold text-gray-900 mb-4">Choisissez votre plan</h2>
              <p class="text-lg text-gray-600">Déverrouillez tout le potentiel de ChatSeller</p>
            </div>

            <div class="grid md:grid-cols-2 gap-8">
              <!-- Professional Plan -->
              <div class="plan-card plan-card-featured">
                <div class="plan-card-header">
                  <div class="popular-badge">
                    <span class="text-sm font-bold">Le plus populaire</span>
                  </div>
                  
                  <div class="text-center mb-6">
                    <div class="plan-icon-large bg-blue-600">
                      <svg class="w-8 h-8 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M5 3v4M3 5h4M6 17v4m-2-2h4m5-16l2.286 6.857L21 12l-5.714 2.143L13 21l-2.286-6.857L5 12l5.714-2.143L13 3z"/>
                      </svg>
                    </div>
                    <h3 class="text-2xl font-bold mb-2">Professional</h3>
                    <div class="pricing">
                      <span class="price">14€</span>
                      <span class="period">/mois</span>
                    </div>
                    <p class="text-gray-600">Pour les e-commerçants ambitieux</p>
                  </div>
                </div>
                
                <div class="plan-features">
                  <div v-for="feature in professionalFeatures" :key="feature" class="feature-item">
                    <svg class="w-5 h-5 text-green-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M5 13l4 4L19 7"/>
                    </svg>
                    <span>{{ feature }}</span>
                  </div>
                </div>
                
                <div class="plan-card-footer">
                  <button 
                    @click="handleSubscribeToPlan('professional')"
                    :disabled="subscriptionLoading || subscriptionData.plan === 'professional'"
                    class="btn-plan-primary"
                  >
                    <span v-if="subscriptionLoading && selectedPlan === 'professional'">
                      <svg class="animate-spin -ml-1 mr-2 h-4 w-4" fill="none" viewBox="0 0 24 24">
                        <circle class="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" stroke-width="4"></circle>
                        <path class="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                      </svg>
                      Traitement...
                    </span>
                    <span v-else-if="subscriptionData.plan === 'professional'">Plan actuel</span>
                    <span v-else>{{ subscriptionData.plan === 'free' ? 'Passer au Plan Pro' : 'Passer au Pro' }}</span>
                  </button>
                  
                  <div class="plan-guarantee">
                    <svg class="w-4 h-4 text-green-500 mr-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 12l2 2 4-4m5.065.01l.032.006M12 21a9 9 0 110-18 9 9 0 010 18z"/>
                    </svg>
                    <span class="text-xs text-gray-600">Annulation possible à tout moment</span>
                  </div>
                </div>
              </div>

              <!-- Enterprise Plan -->
              <div class="plan-card">
                <div class="plan-card-header">
                  <div class="text-center mb-6">
                    <div class="plan-icon-large bg-purple-600">
                      <svg class="w-8 h-8 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4"/>
                      </svg>
                    </div>
                    <h3 class="text-2xl font-bold mb-2">Enterprise</h3>
                    <div class="pricing">
                      <span class="price">Sur mesure</span>
                    </div>
                    <p class="text-gray-600">Pour les grandes entreprises</p>
                  </div>
                </div>
                
                <div class="plan-features">
                  <div v-for="feature in enterpriseFeatures" :key="feature" class="feature-item">
                    <svg class="w-5 h-5 text-green-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M5 13l4 4L19 7"/>
                    </svg>
                    <span>{{ feature }}</span>
                  </div>
                </div>
                
                <div class="plan-card-footer">
                  <button 
                    @click="contactEnterprise"
                    class="btn-plan-secondary"
                  >
                    Demander un devis
                  </button>
                  
                  <div class="plan-guarantee">
                    <svg class="w-4 h-4 text-blue-500 mr-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M8.228 9c.549-1.165 2.03-2 3.772-2 2.21 0 4 1.343 4 3 0 1.4-1.278 2.575-3.006 2.907-.542.104-.994.54-.994 1.093m0 3h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"/>
                    </svg>
                    <span class="text-xs text-gray-600">Support dédié inclus</span>
                  </div>
                </div>
              </div>
            </div>
          </div>

          <!-- Professional Features (only show if Professional) -->
          <div v-if="subscriptionData.plan === 'professional'" class="card-modern">
            <div class="mb-6 text-center">
              <h2 class="text-2xl font-bold text-gray-900 mb-4">🎉 Vos fonctionnalités Pro</h2>
              <p class="text-gray-600">Profitez de toutes ces fonctionnalités avancées</p>
            </div>

            <div class="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
              <div v-for="feature in professionalFeatures" :key="feature" class="bg-gradient-to-br from-blue-50 to-indigo-50 border border-blue-200 rounded-xl p-6">
                <div class="flex items-center space-x-3">
                  <div class="w-10 h-10 bg-blue-600 rounded-lg flex items-center justify-center">
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
                class="inline-flex items-center px-6 py-3 bg-blue-600 text-white font-medium rounded-lg hover:bg-blue-700 transition-colors"
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
          
          <!-- Usage Stats -->
          <div v-if="subscriptionData.plan !== 'free'" class="card-modern">
            <h3 class="text-lg font-semibold text-gray-900 mb-4">Utilisation ce mois</h3>
            
            <div class="space-y-4">
              <div class="usage-item">
                <div class="flex justify-between items-center mb-2">
                  <span class="text-sm font-medium text-gray-700">Conversations</span>
                  <span class="text-sm text-gray-900">{{ usageStats.conversations }} / ∞</span>
                </div>
                <div class="usage-bar">
                  <div class="usage-bar-fill bg-blue-500" style="width: 45%"></div>
                </div>
              </div>

              <div class="usage-item">
                <div class="flex justify-between items-center mb-2">
                  <span class="text-sm font-medium text-gray-700">Documents IA</span>
                  <span class="text-sm text-gray-900">{{ usageStats.documents }} / ∞</span>
                </div>
                <div class="usage-bar">
                  <div class="usage-bar-fill bg-green-500" style="width: 32%"></div>
                </div>
              </div>

              <div class="usage-item">
                <div class="flex justify-between items-center mb-2">
                  <span class="text-sm font-medium text-gray-700">Agents IA</span>
                  <span class="text-sm text-gray-900">{{ usageStats.agents }} / 3</span>
                </div>
                <div class="usage-bar">
                  <div class="usage-bar-fill bg-purple-500" style="width: 66%"></div>
                </div>
              </div>
            </div>
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
                💡 <strong>Astuce :</strong> Consultez notre guide de démarrage pour optimiser vos conversions
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>

    <!-- Cancel Subscription Modal -->
    <div v-if="showCancelModal" class="modal-overlay">
      <div class="modal-content">
        <div class="modal-header">
          <h3 class="text-lg font-semibold text-gray-900">Annuler l'abonnement</h3>
          <button @click="showCancelModal = false" class="modal-close">
            <svg class="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12"/>
            </svg>
          </button>
        </div>
        
        <div class="modal-body">
          <div class="text-center mb-6">
            <div class="w-16 h-16 bg-red-100 rounded-full flex items-center justify-center mx-auto mb-4">
              <svg class="w-8 h-8 text-red-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-2.5L13.732 4c-.77-.833-1.732-.833-2.464 0L4.35 16.5c-.77.833.192 2.5 1.732 2.5z"/>
              </svg>
            </div>
            <h4 class="text-lg font-medium text-gray-900 mb-2">Êtes-vous sûr ?</h4>
            <p class="text-gray-600">
              En annulant votre abonnement, vous perdrez l'accès aux fonctionnalités Pro à la fin de votre période de facturation actuelle 
              <span class="font-medium">({{ formatDate(subscriptionData.nextBillingDate) }})</span>.
            </p>
          </div>
        </div>
        
        <div class="modal-footer">
          <button @click="showCancelModal = false" class="btn-secondary flex-1">
            Garder mon abonnement
          </button>
          <button 
            @click="cancelSubscription"
            :disabled="subscriptionLoading"
            class="btn-danger flex-1"
          >
            {{ subscriptionLoading ? 'Annulation...' : 'Confirmer l\'annulation' }}
          </button>
        </div>
      </div>
    </div>

    <!-- Success/Error Notifications -->
    <div v-if="notification.show" class="notification" :class="notification.type === 'success' ? 'notification-success' : 'notification-error'">
      <div class="flex items-center">
        <svg v-if="notification.type === 'success'" class="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M5 13l4 4L19 7"/>
        </svg>
        <svg v-else class="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12"/>
        </svg>
        {{ notification.message }}
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, computed, onMounted } from 'vue'
import { useAuthStore } from '~/stores/auth'

// ✅ PAGE META
definePageMeta({
  middleware: 'auth',
  layout: 'default'
})

// ✅ COMPOSABLES
const authStore = useAuthStore()
const config = useRuntimeConfig()

// ✅ REACTIVE STATE
const loading = ref(false)
const subscriptionLoading = ref(false)
const selectedPlan = ref('')
const showCancelModal = ref(false)
const plansSection = ref<HTMLElement>()

// Subscription data
const subscriptionData = ref({
  plan: 'free', // 'free', 'professional', 'enterprise'
  isActive: false,
  trialDaysLeft: 7,
  nextBillingDate: '2025-02-15T00:00:00Z'
})

// Usage stats
const usageStats = ref({
  conversations: 234,
  documents: 12,
  agents: 2
})

// Notification system
const notification = ref({
  show: false,
  type: 'success',
  message: ''
})

// Plan features
const professionalFeatures = [
  'Conversations illimitées',
  '3 Agents IA spécialisés',
  'Base de connaissance illimitée',
  'Upsell automatique intelligent',
  'Analytics avancées & ROI',
  'Support prioritaire'
]

const enterpriseFeatures = [
  'Tout du plan Professional',
  'Agents IA illimités',
  'White-label complet',
  'API complète & webhooks',
  'Support dédié 24/7',
  'SLA garanti 99.9%'
]

// ✅ COMPUTED
const getCurrentPlanFeatures = (): string[] => {
  switch (subscriptionData.value.plan) {
    case 'professional':
      return professionalFeatures.slice(0, 3)
    case 'enterprise':
      return enterpriseFeatures.slice(0, 3)
    default:
      return ['7 jours d\'essai gratuit', '1 Agent IA', '10 documents max']
  }
}

// ✅ UTILITY METHODS
const getPlanName = (plan: string): string => {
  const names = {
    free: 'Gratuit',
    professional: 'Professional',
    enterprise: 'Enterprise'
  }
  return names[plan as keyof typeof names] || plan
}

const getPlanPrice = (plan: string): string => {
  const prices = {
    free: subscriptionData.value.trialDaysLeft > 0 ? `${subscriptionData.value.trialDaysLeft} jours d'essai restants` : 'Plan gratuit',
    professional: '14€/mois',
    enterprise: 'Sur mesure'
  }
  return prices[plan as keyof typeof prices] || ''
}

const getPlanCardClass = (plan: string): string => {
  const classes = {
    free: 'bg-gray-50 border-gray-200',
    professional: 'bg-blue-50 border-blue-200',
    enterprise: 'bg-purple-50 border-purple-200'
  }
  return classes[plan as keyof typeof classes] || 'bg-gray-50 border-gray-200'
}

const getPlanIconClass = (plan: string): string => {
  const classes = {
    free: 'bg-gray-100 text-gray-600',
    professional: 'bg-blue-100 text-blue-600',
    enterprise: 'bg-purple-100 text-purple-600'
  }
  return classes[plan as keyof typeof classes] || 'bg-gray-100 text-gray-600'
}

const getPlanIcon = (plan: string): string => {
  const icons = {
    free: 'M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1',
    professional: 'M5 3v4M3 5h4M6 17v4m-2-2h4m5-16l2.286 6.857L21 12l-5.714 2.143L13 21l-2.286-6.857L5 12l5.714-2.143L13 3z',
    enterprise: 'M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4'
  }
  return icons[plan as keyof typeof icons] || icons.free
}

const getStatusLabel = (plan: string): string => {
  if (plan === 'free') {
    return subscriptionData.value.trialDaysLeft > 0 ? 'Essai gratuit' : 'Plan gratuit'
  }
  return subscriptionData.value.isActive ? 'Actif' : 'Inactif'
}

const getStatusBadgeClass = (plan: string): string => {
  if (plan === 'free') {
    return subscriptionData.value.trialDaysLeft > 0 ? 'bg-blue-100 text-blue-800' : 'bg-gray-100 text-gray-800'
  }
  return subscriptionData.value.isActive ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'
}

const formatDate = (dateString: string): string => {
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

// ✅ ACTION METHODS - PAIEMENT
const handleSubscribeToPlan = async (plan: string) => {
  selectedPlan.value = plan
  subscriptionLoading.value = true
  
  try {
    console.log('🚀 Initiation du paiement pour le plan:', plan)
    
    const response = await $fetch(`${config.public.apiBaseUrl}/api/v1/billing/create-checkout-session`, {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${authStore.token}`,
        'Content-Type': 'application/json'
      },
      body: {
        plan: plan,
        successUrl: `${window.location.origin}/billing?success=true`,
        cancelUrl: `${window.location.origin}/billing?cancelled=true`
      }
    })
    
    console.log('💳 Réponse API checkout:', response)
    
    if (response.success && response.checkoutUrl) {
      console.log('🔄 Redirection vers Stripe Checkout:', response.checkoutUrl)
      window.location.href = response.checkoutUrl
    } else {
      throw new Error(response.error || 'Impossible de créer la session de paiement')
    }
    
  } catch (error: any) {
    console.error('❌ Erreur lors de la souscription:', error)
    showNotification('error', error.message || 'Erreur lors de la souscription au plan')
  } finally {
    subscriptionLoading.value = false
    selectedPlan.value = ''
  }
}

// ✅ CHARGEMENT DES DONNÉES - CORRIGÉ
const loadBillingData = async () => {
  loading.value = true
  try {
    console.log('🔄 Chargement des données de facturation...')
    
    const response = await $fetch(`${config.public.apiBaseUrl}/api/v1/billing/subscription-status`, {
      headers: {
        Authorization: `Bearer ${authStore.token}`
      }
    })
    
    console.log('📊 Données reçues:', response)
    
    if (response.success) {
      // ✅ MISE À JOUR COMPLÈTE DES DONNÉES
      subscriptionData.value = {
        plan: response.subscription.plan,
        isActive: response.subscription.isActive,
        trialDaysLeft: response.subscription.plan === 'free' ? 7 : 0, // À adapter selon vos besoins
        nextBillingDate: response.subscription.nextBillingDate || '2025-02-15T00:00:00Z'
      }
      
      console.log('✅ État mis à jour:', subscriptionData.value)
    }
  } catch (error) {
    console.error('❌ Erreur chargement billing:', error)
    // En cas d'erreur, on garde les données mockées
  } finally {
    loading.value = false
  }
}

const refreshBillingData = async () => {
  await loadBillingData()
  showNotification('success', 'Données de facturation actualisées')
}

const cancelSubscription = async () => {
  subscriptionLoading.value = true
  
  try {
    const response = await $fetch(`${config.public.apiBaseUrl}/api/v1/billing/cancel-subscription`, {
      method: 'POST',
      headers: {
        Authorization: `Bearer ${authStore.token}`
      }
    })
    
    if (response.success) {
      showCancelModal.value = false
      subscriptionData.value.isActive = false
      showNotification('success', 'Votre abonnement sera annulé à la fin de la période de facturation')
    }
  } catch (error: any) {
    console.error('Erreur annulation:', error)
    showNotification('error', 'Erreur lors de l\'annulation')
  } finally {
    subscriptionLoading.value = false
  }
}

const manageSubscription = () => {
  window.open('https://billing.stripe.com/p/login/test_123', '_blank')
}

const contactSupport = () => {
  window.location.href = 'mailto:support@chatseller.app?subject=Aide avec la facturation'
}

const contactEnterprise = () => {
  window.location.href = 'mailto:enterprise@chatseller.app?subject=Demande de devis Enterprise'
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

// ✅ LIFECYCLE - AVEC RECHARGEMENT AUTOMATIQUE
onMounted(async () => {
  console.log('🚀 Composant billing monté')
  
  // Charger les données de facturation
  await loadBillingData()
  
  // ✅ VÉRIFIER LES PARAMÈTRES D'URL ET RECHARGER LES DONNÉES
  const urlParams = new URLSearchParams(window.location.search)
  if (urlParams.get('success') === 'true') {
    console.log('✅ Retour de paiement réussi - rechargement des données...')
    
    // Attendre un peu pour laisser le webhook Stripe se déclencher
    setTimeout(async () => {
      await loadBillingData()
      showNotification('success', 'Votre abonnement a été activé avec succès !')
    }, 2000)
    
    window.history.replaceState({}, '', '/billing')
  } else if (urlParams.get('cancelled') === 'true') {
    showNotification('error', 'Le paiement a été annulé')
    window.history.replaceState({}, '', '/billing')
  }
})

// ✅ SEO
useHead({
  title: 'Facturation - ChatSeller Dashboard'
})
</script>

<style scoped>
/* Les styles CSS restent identiques... */
.card-modern {
  @apply bg-white rounded-xl shadow-sm border border-gray-200 p-6;
}

.btn-primary {
  @apply inline-flex items-center px-4 py-2 bg-blue-600 text-white text-sm font-medium rounded-lg hover:bg-blue-700 disabled:opacity-50 transition-colors;
}

.btn-secondary {
  @apply inline-flex items-center px-4 py-2 border border-gray-300 rounded-lg text-sm font-medium text-gray-700 bg-white hover:bg-gray-50 transition-colors;
}

.btn-danger {
  @apply inline-flex items-center px-4 py-2 bg-red-600 text-white text-sm font-medium rounded-lg hover:bg-red-700 disabled:opacity-50 transition-colors;
}

.plan-upgrade-badge {
  @apply px-3 py-1 bg-gradient-to-r from-blue-500 to-purple-600 text-white rounded-full text-xs font-medium;
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
  @apply border-blue-300 bg-blue-50/30 transform scale-105 shadow-lg;
}

.plan-card-header {
  @apply relative;
}

.popular-badge {
  @apply absolute -top-4 left-1/2 transform -translate-x-1/2 bg-gradient-to-r from-blue-600 to-purple-600 text-white px-4 py-1 rounded-full text-sm font-bold;
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
  @apply w-full py-4 px-6 bg-gradient-to-r from-blue-600 to-purple-600 text-white text-lg font-semibold rounded-xl hover:from-blue-700 hover:to-purple-700 focus:ring-4 focus:ring-blue-200 disabled:opacity-50 transition-all;
}

.btn-plan-secondary {
  @apply w-full py-4 px-6 border-2 border-gray-300 text-gray-700 text-lg font-semibold rounded-xl hover:border-gray-400 hover:bg-gray-50 transition-all;
}

.plan-guarantee {
  @apply flex items-center justify-center text-center;
}

.usage-item {
  @apply space-y-2;
}

.usage-bar {
  @apply w-full bg-gray-200 rounded-full h-2;
}

.usage-bar-fill {
  @apply h-2 rounded-full transition-all duration-300;
}

.support-button {
  @apply w-full flex items-center space-x-3 px-4 py-3 text-sm font-medium text-gray-700 bg-white rounded-xl hover:bg-gray-50 border border-gray-200 hover:border-gray-300 transition-all;
}

.modal-overlay {
  @apply fixed inset-0 z-50 overflow-y-auto bg-gray-900 bg-opacity-50 backdrop-blur-sm flex items-center justify-center p-4;
}

.modal-content {
  @apply bg-white rounded-xl shadow-xl max-w-md w-full;
}

.modal-header {
  @apply flex items-center justify-between p-6 border-b border-gray-200;
}

.modal-close {
  @apply text-gray-400 hover:text-gray-600 transition-colors;
}

.modal-body {
  @apply p-6;
}

.modal-footer {
  @apply flex items-center space-x-3 p-6 border-t border-gray-200;
}

.notification {
  @apply fixed bottom-4 right-4 px-6 py-3 rounded-lg shadow-lg z-50 transform transition-all duration-300;
}

.notification-success {
  @apply bg-green-600 text-white;
}

.notification-error {
  @apply bg-red-600 text-white;
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
</style>