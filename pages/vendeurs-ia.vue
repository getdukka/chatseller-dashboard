<!-- pages/vendeurs-ia.vue - VERSION API PURE FINALE 100% FONCTIONNELLE -->
<template>
  <div class="min-h-screen bg-gray-50">
    <!-- Header -->
    <div class="bg-white shadow-sm border-b border-gray-200">
      <div class="px-8 py-6">
        <div class="flex items-center justify-between">
          <div>
            <h1 class="text-3xl font-bold text-gray-900">Vendeurs IA</h1>
            <p class="mt-2 text-gray-600">
              Gérez vos agents IA commerciaux et leurs performances
            </p>
          </div>
          
          <div class="flex items-center space-x-4">
            <button
              @click="refreshAgents"
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
            
            <button
              @click="openCreateModal"
              :disabled="!canCreateAgent || trialExpired"
              class="inline-flex items-center px-4 py-2 bg-blue-600 text-white text-sm font-medium rounded-lg hover:bg-blue-700 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
              :title="!canCreateAgent ? `Plan ${subscriptionPlan} limité à ${planDetails.agentLimit} agent(s)` : trialExpired ? 'Essai gratuit expiré' : ''"
            >
              <svg class="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 6v6m0 0v6m0-6h6m-6 0H6"/>
              </svg>
              Créer un Vendeur IA
            </button>
          </div>
        </div>
      </div>
    </div>

    <!-- ✅ BANNERS DE PLAN - PRIORITAIRES ET INFORMATIFS -->
    <div class="mx-8 mt-4 mb-6">
      <!-- Banner essai expiré -->
      <div v-if="trialExpired" class="bg-gradient-to-r from-red-600 to-red-800 rounded-xl shadow-lg overflow-hidden">
        <div class="px-8 py-6 text-white relative">
          <div class="flex items-center justify-between">
            <div>
              <h2 class="text-xl font-bold mb-2 flex items-center">
                ⏰ Essai gratuit terminé
              </h2>
              <p class="text-red-100 text-base mb-4">
                Votre période d'essai de 7 jours est terminée. Vos Vendeurs IA et Widgets sont maintenant <strong>désactivés</strong>.
              </p>
              <div class="flex flex-wrap gap-3">
                <NuxtLink 
                  to="/billing"
                  class="inline-flex items-center px-6 py-3 bg-white text-red-600 rounded-lg font-medium hover:bg-red-50 transition-all"
                >
                  <svg class="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M13 7h8m0 0v8m0-8l-8 8-4-4-6 6"/>
                  </svg>
                  Passer au plan Starter - 14€/mois
                </NuxtLink>
              </div>
            </div>
          </div>
        </div>
      </div>

      <!-- Banner plan Starter -->
      <div v-else-if="subscriptionPlan === 'starter'" class="bg-gradient-to-r from-blue-700 to-purple-500 rounded-xl shadow-lg overflow-hidden">
        <div class="px-8 py-6 text-white relative">
          <div class="flex items-center justify-between">
            <div>
              <h2 class="text-xl font-bold mb-2">⚡ Plan Starter - Limité à 1 Vendeur IA</h2>
              <p class="text-blue-100 text-base mb-4">
                Passez au plan Pro pour créer jusqu'à 3 Vendeurs IA spécialisés et débloquer toutes les fonctionnalités avancées.
              </p>
              <div class="flex flex-wrap gap-3">
                <NuxtLink 
                  to="/billing"
                  class="inline-flex items-center px-6 py-3 bg-white bg-opacity-20 rounded-lg text-white font-medium hover:bg-opacity-30 transition-all backdrop-blur-sm"
                >
                  <svg class="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M13 7h8m0 0v8m0-8l-8 8-4-4-6 6"/>
                  </svg>
                  Passer au Pro - 29€/mois
                </NuxtLink>
              </div>
            </div>
          </div>
        </div>
      </div>

      <!-- Banner essai gratuit actif -->
      <div v-else-if="subscriptionPlan === 'free' && planDetails.trialDaysLeft && planDetails.trialDaysLeft > 0" class="bg-gradient-to-r from-green-600 to-green-800 rounded-xl shadow-lg overflow-hidden">
        <div class="px-8 py-6 text-white relative">
          <div class="flex items-center justify-between">
            <div>
              <h2 class="text-xl font-bold mb-2">🎉 Essai gratuit actif</h2>
              <p class="text-green-100 text-base mb-4">
                Encore <strong>{{ planDetails.trialDaysLeft }} jour{{ planDetails.trialDaysLeft > 1 ? 's' : '' }}</strong> 
                pour profiter de toutes les fonctionnalités Starter gratuitement !
              </p>
              <div class="flex flex-wrap gap-3">
                <NuxtLink 
                  to="/billing"
                  class="inline-flex items-center px-6 py-3 bg-white bg-opacity-20 rounded-lg text-white font-medium hover:bg-opacity-30 transition-all backdrop-blur-sm"
                >
                  <svg class="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M13 7h8m0 0v8m0-8l-8 8-4-4-6 6"/>
                  </svg>
                  Passer au plan payant
                </NuxtLink>
              </div>
            </div>
            <div class="hidden lg:block">
              <div class="w-20 h-20 bg-white bg-opacity-10 rounded-full flex items-center justify-center backdrop-blur-sm">
                <span class="text-2xl font-bold">{{ planDetails.trialDaysLeft }}</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>

    <!-- Message d'erreur -->
    <div v-if="error" class="p-4 bg-red-50 border-l-4 border-red-400 mx-8 mt-4 rounded-r-lg">
      <div class="flex items-center justify-between">
        <div class="flex">
          <svg class="w-5 h-5 text-red-400 mr-3 mt-0.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"/>
          </svg>
          <p class="text-red-700 text-sm">{{ error }}</p>
        </div>
        <button @click="clearError" class="text-red-400 hover:text-red-600 transition-colors">
          <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12"/>
          </svg>
        </button>
      </div>
    </div>

    <!-- Content -->
    <div class="p-8">
      <!-- Loading State -->
      <div v-if="loading && agents.length === 0" class="text-center py-16">
        <div class="inline-flex items-center space-x-3">
          <svg class="animate-spin h-8 w-8 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15"/>
          </svg>
          <span class="text-lg text-gray-600">Chargement des agents IA...</span>
        </div>
      </div>

      <!-- ✅ AGENTS GRID AVEC STATUTS RÉELS -->
      <div v-else-if="agents.length > 0" class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        <div
          v-for="agent in agents"
          :key="agent.id"
          class="agent-card"
          :class="{ 
            'agent-card-active': agent.isActive && !trialExpired,
            'agent-card-disabled': trialExpired
          }"
        >
          <!-- Agent Header -->
          <div class="flex items-center justify-between mb-4">
            <div class="flex items-center space-x-3">
              <div class="agent-avatar" :class="getAvatarClass(agent.type)">
                <svg class="w-6 h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" :d="getAgentIcon(agent.type)"/>
                </svg>
              </div>
              <div>
                <h3 class="text-lg font-semibold text-gray-900">{{ agent.name }}</h3>
                <p class="text-sm text-gray-500">{{ getTypeLabel(agent.type) }}</p>
              </div>
            </div>
            
            <div class="flex items-center space-x-2">
              <!-- ✅ STATUT RÉEL BASÉ SUR L'ESSAI -->
              <span :class="getStatusBadgeClass(agent.isActive)" class="status-badge">
                {{ trialExpired ? 'Désactivé (Essai expiré)' : (agent.isActive ? 'Actif' : 'Inactif') }}
              </span>
              
              <div class="dropdown relative">
                <button 
                  @click="toggleAgentMenu(agent.id)" 
                  :disabled="trialExpired"
                  class="agent-menu-btn"
                  :class="{ 'opacity-50 cursor-not-allowed': trialExpired }"
                >
                  <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 5v.01M12 12v.01M12 19v.01M12 6a1 1 0 110-2 1 1 0 010 2zm0 7a1 1 0 110-2 1 1 0 010 2zm0 7a1 1 0 110-2 1 1 0 010 2z"/>
                  </svg>
                </button>
                
                <!-- ✅ MENU DÉSACTIVÉ SI ESSAI EXPIRÉ -->
                <div v-if="activeAgentMenu === agent.id && !trialExpired" class="dropdown-menu">
                  <button @click="editAgent(agent)" class="dropdown-item">
                    <svg class="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z"/>
                    </svg>
                    Modifier
                  </button>
                  <button @click="duplicateAgentAction(agent)" class="dropdown-item" :disabled="!canCreateAgent">
                    <svg class="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M8 16H6a2 2 0 01-2-2V6a2 2 0 012-2h8a2 2 0 012 2v2m-6 12h8a2 2 0 002-2v-8a2 2 0 00-2-2h-8a2 2 0 00-2 2v8a2 2 0 002 2z"/>
                    </svg>
                    Dupliquer
                  </button>
                  <button @click="toggleAgentStatusAction(agent)" class="dropdown-item">
                    <svg class="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M8 9l4-4 4 4m0 6l-4 4-4-4"/>
                    </svg>
                    {{ agent.isActive ? 'Désactiver' : 'Activer' }}
                  </button>
                  <button @click="deleteAgentAction(agent)" class="dropdown-item text-red-600 hover:bg-red-50">
                    <svg class="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16"/>
                    </svg>
                    Supprimer
                  </button>
                </div>
              </div>
            </div>
          </div>

          <!-- Agent Description -->
          <p class="text-sm text-gray-600 mb-4 line-clamp-2">
            {{ agent.description || 'Aucune description fournie.' }}
          </p>

          <!-- ✅ OVERLAY SI ESSAI EXPIRÉ -->
          <div v-if="trialExpired" class="absolute inset-0 bg-gray-900 bg-opacity-50 rounded-xl flex items-center justify-center">
            <div class="text-center text-white p-4">
              <svg class="w-8 h-8 mx-auto mb-2 text-red-300" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z"/>
              </svg>
              <p class="text-sm font-medium">Essai expiré</p>
              <p class="text-xs text-gray-300">Passez au plan Starter</p>
            </div>
          </div>

          <!-- Agent Stats -->
          <div class="grid grid-cols-2 gap-4 mb-4" :class="{ 'opacity-30': trialExpired }">
            <div class="stat-item">
              <div class="stat-value">{{ agent.stats?.conversations || 0 }}</div>
              <div class="stat-label">Conversations</div>
            </div>
            <div class="stat-item">
              <div class="stat-value">{{ agent.stats?.conversions || 0 }}</div>
              <div class="stat-label">Conversions</div>
            </div>
          </div>

          <!-- Agent Actions -->
          <div class="flex items-center space-x-2">
            <button 
              @click="configureAgent(agent)"
              :disabled="!canConfigureAgents || trialExpired"
              class="flex-1 btn-secondary"
              :class="{ 'opacity-50 cursor-not-allowed': !canConfigureAgents || trialExpired }"
              :title="trialExpired ? 'Essai gratuit expiré' : !canConfigureAgents ? 'Accès limité selon votre plan' : ''"
            >
              <svg class="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M10.325 4.317c.426-1.756 2.924-1.756 3.35 0a1.724 1.724 0 002.573 1.066c1.543-.94 3.31.826 2.37 2.37a1.724 1.724 0 001.065 2.572c1.756.426 1.756 2.924 0 3.35a1.724 1.724 0 00-1.066 2.573c.94 1.543-.826 3.31-2.37 2.37a1.724 1.724 0 00-2.572 1.065c-.426 1.756-2.924 1.756-3.35 0a1.724 1.724 0 00-2.573-1.066c-1.543.94-3.31-.826-2.37-2.37a1.724 1.724 0 00-1.065-2.572c-1.756-.426-1.756-2.924 0-3.35a1.724 1.724 0 001.066-2.573c-.94-1.543.826-3.31 2.37-2.37.996.608 2.296.07 2.572-1.065z"/>
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M15 12a3 3 0 11-6 0 3 3 0 016 0z"/>
              </svg>
              {{ trialExpired ? 'Bloqué' : 'Configurer' }}
            </button>
            <button 
              @click="testAgent(agent)"
              :disabled="!canTestAgents || trialExpired"
              class="flex-1 btn-primary"
              :class="{ 'opacity-50 cursor-not-allowed': !canTestAgents || trialExpired }"
              :title="trialExpired ? 'Essai gratuit expiré' : !canTestAgents ? 'Test réservé aux plans payants' : ''"
            >
              <svg class="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z"/>
              </svg>
              {{ trialExpired ? 'Bloqué' : 'Tester' }}
            </button>
          </div>
        </div>
      </div>

      <!-- Empty State -->
      <div v-else-if="!loading" class="text-center py-16">
        <div class="empty-state-illustration">
          <svg class="mx-auto h-24 w-24 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="1" d="M9.663 17h4.673M12 3v1m6.364 1.636l-.707.707M21 12h-1M4 12H3m3.343-5.657l-.707-.707m2.828 9.9a5 5 0 117.072 0l-.548.547A3.374 3.374 0 0014 18.469V19a2 2 0 11-4 0v-.531c0-.895-.356-1.754-.988-2.386l-.548-.547z"/>
          </svg>
        </div>
        <h3 class="mt-4 text-xl font-medium text-gray-900">
          {{ trialExpired ? 'Accès limité - Essai gratuit terminé' : 'Créez votre premier Vendeur IA' }}
        </h3>
        <p class="mt-2 text-gray-500 max-w-md mx-auto">
          {{ trialExpired 
            ? 'Passez au plan Starter pour réactiver vos Vendeurs IA et continuer à utiliser ChatSeller.' 
            : 'Commencez par créer un agent IA commercial personnalisé pour transformer vos visiteurs en clients.' 
          }}
        </p>
        <div class="mt-8">
          <button
            v-if="trialExpired"
            @click="$router.push('/billing')"
            class="inline-flex items-center px-6 py-3 border border-transparent text-base font-medium rounded-xl text-white bg-gradient-to-r from-red-600 to-red-700 hover:from-red-700 hover:to-red-800 transition-all duration-200"
          >
            <svg class="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M13 7h8m0 0v8m0-8l-8 8-4-4-6 6"/>
            </svg>
            Passer au plan Starter - 14€/mois
          </button>
          <button
            v-else
            @click="openCreateModal"
            :disabled="!canCreateAgent"
            class="inline-flex items-center px-6 py-3 border border-transparent text-base font-medium rounded-xl text-white bg-gradient-to-r from-blue-600 to-blue-700 hover:from-blue-700 hover:to-blue-800 transition-all duration-200 disabled:opacity-50 disabled:cursor-not-allowed"
          >
            <svg class="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 6v6m0 0v6m0-6h6m-6 0H6"/>
            </svg>
            Créer mon premier Vendeur IA
          </button>
        </div>
      </div>
    </div>

    <!-- ✅ MODAL CRÉATION/MODIFICATION - BLOQUÉ SI ESSAI EXPIRÉ -->
    <div v-if="(showCreateModal || editingAgent) && !trialExpired" class="modal-overlay" @click.self="closeModal">
      <div class="modal-content modal-large">
        <div class="modal-header">
          <h3 class="modal-title">
            {{ editingAgent ? 'Modifier le Vendeur IA' : 'Créer un nouveau Vendeur IA' }}
          </h3>
          <button @click="closeModal" class="modal-close">
            <svg class="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12"/>
            </svg>
          </button>
        </div>
        
        <div class="modal-body">
          <!-- Introduction guidée -->
          <div v-if="!editingAgent" class="bg-blue-50 border border-blue-200 rounded-lg p-4 mb-6">
            <div class="flex items-start space-x-3">
              <svg class="w-6 h-6 text-blue-600 flex-shrink-0 mt-0.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"/>
              </svg>
              <div>
                <h4 class="font-medium text-blue-900 mb-1">🎯 Créer votre Vendeur IA en 3 étapes</h4>
                <p class="text-sm text-blue-700">
                  <strong>1.</strong> Choisissez le type → <strong>2.</strong> Nom et personnalité → <strong>3.</strong> Activez ! 
                  Les descriptions et messages sont générés automatiquement.
                </p>
                <p v-if="planDetails.agentLimit > 0" class="text-xs text-blue-600 mt-2">
                  💡 Votre plan permet {{ planDetails.agentLimit === -1 ? 'un nombre illimité' : planDetails.agentLimit }} agent{{ planDetails.agentLimit > 1 ? 's' : '' }}. 
                  Vous avez utilisé {{ agents.length }}/{{ planDetails.agentLimit === -1 ? '∞' : planDetails.agentLimit }} emplacements.
                </p>
              </div>
            </div>
          </div>

          <div class="space-y-6">
            <!-- ÉTAPE 1: TYPE DE VENDEUR -->
            <div>
              <label class="block text-sm font-medium text-gray-700 mb-3">
                <span class="flex items-center">
                  <span class="w-6 h-6 bg-blue-600 text-white text-xs font-bold rounded-full flex items-center justify-center mr-2">1</span>
                  Quel type de vendeur IA voulez-vous ?
                </span>
              </label>
              <div class="grid grid-cols-1 md:grid-cols-2 gap-3">
                <button
                  v-for="type in agentTypes"
                  :key="type.value"
                  @click="selectAgentType(type.value)"
                  :class="[
                    'p-4 border-2 rounded-lg text-left transition-all hover:border-blue-300 hover:bg-blue-50',
                    agentForm.type === type.value 
                      ? 'border-blue-500 bg-blue-50 ring-2 ring-blue-200' 
                      : 'border-gray-200'
                  ]"
                >
                  <div class="flex items-start space-x-3">
                    <div :class="[
                      'w-8 h-8 rounded-lg flex items-center justify-center flex-shrink-0',
                      type.color
                    ]">
                      <svg class="w-5 h-5 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" :d="type.icon"/>
                      </svg>
                    </div>
                    <div class="flex-1">
                      <h4 class="font-medium text-gray-900">{{ type.label }}</h4>
                      <p class="text-xs text-gray-500 mt-1">{{ type.description }}</p>
                    </div>
                  </div>
                </button>
              </div>
            </div>

            <!-- ÉTAPE 2: INFORMATIONS DE BASE -->
            <div>
              <label class="block text-sm font-medium text-gray-700 mb-2">
                <span class="flex items-center">
                  <span class="w-6 h-6 bg-blue-600 text-white text-xs font-bold rounded-full flex items-center justify-center mr-2">2</span>
                  Nom du Vendeur IA *
                </span>
              </label>
              <input
                v-model="agentForm.name"
                @input="onNameChange"
                type="text"
                class="input-modern w-full"
                :placeholder="getNamePlaceholder()"
              >
              <p class="text-xs text-gray-500 mt-1">
                Exemples: {{ getNameExamples() }}
              </p>
            </div>

            <!-- PERSONNALITÉ AVEC PREVIEW -->
            <div>
              <label class="block text-sm font-medium text-gray-700 mb-2">Personnalité et ton</label>
              <div class="grid grid-cols-2 gap-3">
                <button
                  v-for="personality in personalityOptions"
                  :key="personality.value"
                  @click="selectPersonality(personality.value)"
                  :class="[
                    'p-3 border-2 rounded-lg text-left transition-all',
                    agentForm.personality === personality.value 
                      ? 'border-blue-500 bg-blue-50' 
                      : 'border-gray-200 hover:border-gray-300'
                  ]"
                >
                  <div class="flex items-center space-x-2">
                    <span class="text-lg">{{ personality.emoji }}</span>
                    <div>
                      <div class="font-medium text-sm">{{ personality.label }}</div>
                      <div class="text-xs text-gray-500">{{ personality.description }}</div>
                    </div>
                  </div>
                </button>
              </div>
            </div>

            <!-- DESCRIPTION INTELLIGENTE -->
            <div>
              <label class="block text-sm font-medium text-gray-700 mb-2">
                Description et rôle
                <span class="text-gray-500 font-normal">(générée automatiquement)</span>
              </label>
              <div class="relative">
                <textarea
                  v-model="agentForm.description"
                  rows="3"
                  class="input-modern w-full pr-20"
                  :placeholder="getDescriptionPlaceholder()"
                ></textarea>
                <button
                  @click="generateDescription"
                  :disabled="generatingDescription || !agentForm.name || !agentForm.type"
                  class="absolute top-2 right-2 px-3 py-1 bg-purple-600 text-white text-xs font-medium rounded-md hover:bg-purple-700 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
                >
                  <svg v-if="generatingDescription" class="w-3 h-3 animate-spin mr-1 inline" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15"/>
                  </svg>
                  <svg v-else class="w-3 h-3 mr-1 inline" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M13 10V3L4 14h7v7l9-11h-7z"/>
                  </svg>
                  ✨ IA
                </button>
              </div>
            </div>

            <!-- MESSAGE D'ACCUEIL -->
            <div>
              <label class="block text-sm font-medium text-gray-700 mb-2">
                Message d'accueil *
              </label>
              <textarea
                v-model="agentForm.welcomeMessage"
                rows="2"
                class="input-modern w-full"
                :placeholder="getWelcomeMessagePlaceholder()"
              ></textarea>
            </div>

            <!-- PREVIEW EN TEMPS RÉEL -->
            <div v-if="agentForm.name" class="bg-gray-50 rounded-lg p-4">
              <h4 class="font-medium text-gray-900 mb-3 flex items-center">
                <svg class="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M15 12a3 3 0 11-6 0 3 3 0 016 0z"/>
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z"/>
                </svg>
                Aperçu de votre Vendeur IA
              </h4>
              <div class="bg-white border rounded-lg p-4 max-w-sm">
                <div class="flex items-start space-x-3">
                  <div :class="[
                    'w-10 h-10 rounded-full flex items-center justify-center',
                    getAvatarClass(agentForm.type)
                  ]">
                    <span class="text-white font-medium text-sm">
                      {{ agentForm.name ? agentForm.name[0].toUpperCase() : 'V' }}
                    </span>
                  </div>
                  <div class="flex-1">
                    <div class="font-medium text-gray-900">{{ agentForm.name || 'Votre Vendeur IA' }}</div>
                    <div class="text-sm text-gray-500">{{ getTypeLabel(agentForm.type) }}</div>
                    <div class="mt-2 text-sm text-gray-700 bg-gray-100 rounded-lg p-2">
                      {{ agentForm.welcomeMessage || getWelcomeMessagePlaceholder() }}
                    </div>
                  </div>
                </div>
              </div>
            </div>

            <!-- ACTIVATION -->
            <div class="flex items-center justify-between p-4 bg-gray-50 rounded-lg">
              <div>
                <h4 class="text-sm font-medium text-gray-900 flex items-center">
                  <span class="w-6 h-6 bg-blue-600 text-white text-xs font-bold rounded-full flex items-center justify-center mr-2">3</span>
                  Activer immédiatement
                </h4>
                <p class="text-xs text-gray-500">Le vendeur IA sera disponible dès sa création</p>
              </div>
              <button
                @click="agentForm.isActive = !agentForm.isActive"
                :class="[
                  'relative inline-flex h-6 w-11 flex-shrink-0 cursor-pointer rounded-full border-2 border-transparent transition-colors duration-200 ease-in-out focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2',
                  agentForm.isActive ? 'bg-blue-600' : 'bg-gray-200'
                ]"
              >
                <span
                  :class="[
                    'pointer-events-none inline-block h-5 w-5 transform rounded-full bg-white shadow ring-0 transition duration-200 ease-in-out',
                    agentForm.isActive ? 'translate-x-5' : 'translate-x-0'
                  ]"
                ></span>
              </button>
            </div>
          </div>
        </div>
        
        <div class="modal-footer">
          <button @click="closeModal" class="btn-secondary">Annuler</button>
          <button 
            @click="saveAgent" 
            :disabled="!agentForm.name || saving" 
            class="btn-primary"
          >
            <svg v-if="saving" class="w-4 h-4 mr-2 animate-spin" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15"/>
            </svg>
            {{ saving ? 'Création...' : (editingAgent ? 'Mettre à jour' : 'Créer le Vendeur IA') }}
          </button>
        </div>
      </div>
    </div>

    <!-- Test Chat Modal - Bloqué si essai expiré -->
    <div v-if="showTestModal && selectedAgent && !trialExpired" class="fixed inset-0 z-50 overflow-y-auto bg-gray-900 bg-opacity-50 backdrop-blur-sm flex items-center justify-center p-4">
      <div class="bg-white rounded-xl shadow-xl max-w-md w-full h-96 flex flex-col">
        <div class="flex items-center justify-between p-4 border-b border-gray-200">
          <h3 class="text-lg font-semibold text-gray-900">Test - {{ selectedAgent.name }}</h3>
          <button @click="showTestModal = false" class="text-gray-400 hover:text-gray-600 transition-colors">
            <svg class="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12"/>
            </svg>
          </button>
        </div>
        
        <div class="flex-1 p-4 bg-gray-50 overflow-y-auto" ref="chatContainer">
          <div class="space-y-3">
            <div 
              v-for="message in chatMessages" 
              :key="message.id"
              class="flex items-start space-x-2"
              :class="message.role === 'user' ? 'flex-row-reverse space-x-reverse' : ''"
            >
              <div class="flex-shrink-0 w-8 h-8 rounded-full flex items-center justify-center"
                   :class="message.role === 'user' ? 'bg-gray-500' : 'bg-blue-500'">
                <span class="text-white text-sm font-medium">
                  {{ message.role === 'user' ? 'U' : 'IA' }}
                </span>
              </div>
              <div class="bg-white p-3 rounded-lg shadow-sm max-w-xs"
                   :class="message.role === 'user' ? 'bg-blue-100' : ''">
                <p class="text-sm text-gray-800">{{ message.content }}</p>
                <div v-if="message.role === 'assistant' && message.loading" class="flex items-center mt-2">
                  <svg class="animate-spin h-3 w-3 text-blue-600 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15"/>
                  </svg>
                  <span class="text-xs text-gray-500">L'IA réfléchit...</span>
                </div>
              </div>
            </div>
          </div>
        </div>
        
        <div class="p-4 border-t border-gray-200">
          <div class="flex space-x-2">
            <input
              v-model="testMessage"
              @keyup.enter="sendTestMessage"
              type="text"
              placeholder="Tapez votre message de test..."
              class="flex-1 px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
              :disabled="sendingMessage"
            >
            <button 
              @click="sendTestMessage"
              :disabled="!testMessage.trim() || sendingMessage"
              class="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors disabled:opacity-50"
            >
              <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 19l9 2-9-18-9 18 9-2zm0 0v-8"/>
              </svg>
            </button>
          </div>
          <p class="text-xs text-gray-500 mt-2">Test en direct avec IA • {{ subscriptionPlan }} plan</p>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, computed, onMounted, onUnmounted, nextTick } from 'vue'
import { useRouter } from 'vue-router'
import { useAuthStore } from '~/stores/auth'
import { useAgents, type Agent, type CreateAgentData } from '~/composables/useAgents'

// ✅ PAGE META
definePageMeta({
  middleware: 'auth', 
  layout: 'default'
})

// ✅ INTERFACES
interface ChatMessage {
  id: string
  role: 'user' | 'assistant'
  content: string
  timestamp: Date
  loading?: boolean
}

// ✅ COMPOSABLES
const authStore = useAuthStore()
const router = useRouter()

// ✅ UTILISER LE COMPOSABLE AGENTS API PURE
const {
  agents,
  loading,
  saving,
  error,
  planDetails,
  subscriptionPlan,
  isPaidUser,
  hasActiveAccess,
  trialExpired,
  canCreateAgent,
  canConfigureAgents,
  canTestAgents,
  activeAgents,
  fetchAgents,
  createAgent,
  updateAgent,
  deleteAgent,
  toggleAgentStatus,
  duplicateAgent,
  getTypeLabel,
  getAgentIcon,
  getAvatarClass,
  getStatusBadgeClass,
  clearError
} = useAgents()

// ✅ STATE
const showCreateModal = ref(false)
const editingAgent = ref<Agent | null>(null)
const activeAgentMenu = ref<string | null>(null)
const showTestModal = ref(false)
const selectedAgent = ref<Agent | null>(null)
const generatingDescription = ref(false)

// ✅ CHAT TEST STATE
const chatMessages = ref<ChatMessage[]>([])
const testMessage = ref('')
const sendingMessage = ref(false)
const chatContainer = ref<HTMLElement>()

// ✅ FORM STATE
const agentForm = ref<CreateAgentData>({
  name: '',
  type: 'general',
  personality: 'professional',
  description: '',
  welcomeMessage: '',
  fallbackMessage: '',
  isActive: true
})

// ✅ TYPES D'AGENTS
const agentTypes = ref([
  {
    value: 'general',
    label: 'Vendeur Généraliste',
    description: 'Polyvalent, adapté à tous types de produits',
    icon: 'M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z',
    color: 'bg-blue-500'
  },
  {
    value: 'product_specialist',
    label: 'Spécialiste Produit',
    description: 'Expert technique, recommandations précises',
    icon: 'M9 12l2 2 4-4M7.835 4.697a3.42 3.42 0 001.946-.806 3.42 3.42 0 014.438 0 3.42 3.42 0 001.946.806 3.42 3.42 0 013.138 3.138 3.42 3.42 0 00.806 1.946 3.42 3.42 0 010 4.438 3.42 3.42 0 00-.806 1.946 3.42 3.42 0 01-3.138 3.138 3.42 3.42 0 00-1.946.806 3.42 3.42 0 01-4.438 0 3.42 3.42 0 00-1.946-.806 3.42 3.42 0 01-3.138-3.138 3.42 3.42 0 00-.806-1.946 3.42 3.42 0 010-4.438 3.42 3.42 0 00.806-1.946 3.42 3.42 0 013.138-3.138z',
    color: 'bg-green-500'
  },
  {
    value: 'support',
    label: 'Support & SAV',
    description: 'Résout les problèmes, rassure les clients',
    icon: 'M8.228 9c.549-1.165 2.03-2 3.772-2 2.21 0 4 1.343 4 3 0 1.4-1.278 2.575-3.006 2.907-.542.104-.994.54-.994 1.093m0 3h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z',
    color: 'bg-orange-500'
  },
  {
    value: 'upsell',
    label: 'Upsell & Cross-sell',
    description: 'Optimise le panier, propose des compléments',
    icon: 'M13 7h8m0 0v8m0-8l-8 8-4-4-6 6',
    color: 'bg-purple-500'
  }
])

const personalityOptions = ref([
  {
    value: 'professional',
    label: 'Professionnel',
    description: 'Formel, expert',
    emoji: '💼'
  },
  {
    value: 'friendly',
    label: 'Amical',
    description: 'Chaleureux, accessible',
    emoji: '😊'
  },
  {
    value: 'expert',
    label: 'Expert technique',
    description: 'Très technique, précis',
    emoji: '🔧'
  },
  {
    value: 'casual',
    label: 'Décontracté',
    description: 'Cool, moderne',
    emoji: '😎'
  }
])

// ✅ HELPER METHODS
const getNamePlaceholder = () => {
  const examples = {
    general: "Ex: Assistant Commercial Sophie",
    product_specialist: "Ex: Expert Tech Marc",
    support: "Ex: Support Client Julie",
    upsell: "Ex: Conseiller Premium Lisa"
  }
  return examples[agentForm.value.type as keyof typeof examples] || "Ex: Votre Vendeur IA"
}

const getNameExamples = () => {
  const examples = {
    general: "Sophie, Marc, Assistant Vente",
    product_specialist: "Expert Tech, Conseiller Pro, Spécialiste",
    support: "Support Client, Aide Premium, Assistant SAV",
    upsell: "Conseiller Plus, Premium Assistant, VIP Support"
  }
  return examples[agentForm.value.type as keyof typeof examples] || "Sophie, Marc, Lisa"
}

const getDescriptionPlaceholder = () => {
  const templates = {
    general: "Vendeur IA polyvalent capable d'accompagner les clients dans tous leurs achats. Expertise transversale sur l'ensemble du catalogue produits.",
    product_specialist: "Expert technique spécialisé dans [votre secteur]. Maîtrise parfaite des spécifications produits et des besoins clients avancés.",
    support: "Spécialiste support et service après-vente. Résout les problèmes clients et transforme les objections en opportunités de vente.",
    upsell: "Expert en optimisation panier et ventes additionnelles. Identifie les besoins complémentaires pour maximiser la valeur client."
  }
  return templates[agentForm.value.type as keyof typeof templates] || "Décrivez le rôle de votre vendeur IA..."
}

const getWelcomeMessagePlaceholder = () => {
  const personality = agentForm.value.personality
  const name = agentForm.value.name || "Votre conseiller"
  
  const templates = {
    professional: `Bonjour, je suis ${name}. Comment puis-je vous accompagner dans votre achat aujourd'hui ?`,
    friendly: `Salut ! 👋 Je suis ${name}, votre conseiller. Une question sur nos produits ?`,
    expert: `Bonjour, ${name} à votre service. Je suis là pour vous guider techniquement. Que recherchez-vous ?`,
    casual: `Hey ! C'est ${name} 😊 Besoin d'un coup de main pour choisir ?`
  }
  
  return templates[personality as keyof typeof templates] || `Bonjour ! Je suis ${name}. Comment puis-je vous aider ?`
}

// ✅ METHODS
const refreshAgents = async () => {
  await fetchAgents()
}

const openCreateModal = () => {
  if (trialExpired.value) {
    alert('❌ Votre essai gratuit de 7 jours est terminé.\n\nPassez au plan Starter (14€/mois) pour continuer à utiliser ChatSeller et créer vos agents IA.')
    router.push('/billing')
    return
  }

  if (!canCreateAgent.value) {
    const limit = planDetails.value.agentLimit
    alert(`❌ Plan ${subscriptionPlan.value} limité à ${limit} agent(s).\n\nPassez au plan supérieur pour créer plus d'agents IA.`)
    router.push('/billing')
    return
  }

  showCreateModal.value = true
  agentForm.value = {
    name: '',
    type: 'general',
    personality: 'professional',
    description: '',
    welcomeMessage: '',
    fallbackMessage: '',
    isActive: true
  }
}

const selectAgentType = (type: string) => {
  agentForm.value.type = type as Agent['type']
  if (!agentForm.value.description) {
    agentForm.value.description = getDescriptionPlaceholder()
  }
  if (!agentForm.value.welcomeMessage) {
    agentForm.value.welcomeMessage = getWelcomeMessagePlaceholder()
  }
}

const selectPersonality = (personality: string) => {
  agentForm.value.personality = personality as Agent['personality']
  agentForm.value.welcomeMessage = getWelcomeMessagePlaceholder()
}

const onNameChange = () => {
  if (agentForm.value.welcomeMessage === '' || agentForm.value.welcomeMessage?.includes('Votre conseiller')) {
    agentForm.value.welcomeMessage = getWelcomeMessagePlaceholder()
  }
}

const generateDescription = async () => {
  if (!agentForm.value.name || !agentForm.value.type) return
  
  generatingDescription.value = true
  
  try {
    await new Promise(resolve => setTimeout(resolve, 1500))
    
    const aiTemplates = {
      general: [
        `${agentForm.value.name} est votre conseiller commercial polyvalent, expert dans l'accompagnement personnalisé de chaque client. Spécialisé dans la découverte des besoins et la recommandation de solutions adaptées.`,
        `Vendeur IA expérimenté et empathique, ${agentForm.value.name} maîtrise l'art de la vente consultative. Capable de s'adapter à tous profils clients pour maximiser satisfaction et conversion.`
      ],
      product_specialist: [
        `${agentForm.value.name} est votre expert technique de référence. Maîtrise approfondie des spécifications produits et capacité unique à traduire les besoins techniques en solutions concrètes.`
      ],
      support: [
        `${agentForm.value.name} est votre spécialiste support et relation client. Excellence dans la résolution de problèmes et transformation des difficultés en opportunités commerciales.`
      ],
      upsell: [
        `${agentForm.value.name} est votre expert en optimisation de panier et ventes additionnelles. Identifie intuitivement les besoins complémentaires pour maximiser la valeur client.`
      ]
    }
    
    const typeTemplates = aiTemplates[agentForm.value.type as keyof typeof aiTemplates] || aiTemplates.general
    const randomTemplate = typeTemplates[Math.floor(Math.random() * typeTemplates.length)]
    
    agentForm.value.description = randomTemplate
    
  } catch (error) {
    console.error('Erreur génération description:', error)
  } finally {
    generatingDescription.value = false
  }
}

const toggleAgentMenu = (agentId: string) => {
  if (trialExpired.value) return
  activeAgentMenu.value = activeAgentMenu.value === agentId ? null : agentId
}

const editAgent = (agent: Agent) => {
  if (trialExpired.value) {
    alert('❌ Votre essai gratuit est terminé. Passez au plan Starter pour modifier vos agents.')
    return
  }

  editingAgent.value = agent
  agentForm.value = {
    name: agent.name,
    type: agent.type,
    personality: agent.personality,
    description: agent.description || '',
    welcomeMessage: agent.welcomeMessage || '',
    fallbackMessage: agent.fallbackMessage || '',
    isActive: agent.isActive
  }
  activeAgentMenu.value = null
}

const duplicateAgentAction = async (agent: Agent) => {
  if (trialExpired.value) {
    alert('❌ Votre essai gratuit est terminé. Passez au plan Starter pour dupliquer vos agents.')
    return
  }

  if (!canCreateAgent.value) {
    const limit = planDetails.value.agentLimit
    alert(`❌ Plan ${subscriptionPlan.value} limité à ${limit} agent(s). Passez au plan supérieur pour créer plus d'agents.`)
    return
  }
  
  activeAgentMenu.value = null
  const result = await duplicateAgent(agent.id)
  if (result.success) {
    console.log('Agent dupliqué avec succès')
  }
}

const toggleAgentStatusAction = async (agent: Agent) => {
  if (trialExpired.value) {
    alert('❌ Votre essai gratuit est terminé. Passez au plan Starter pour gérer vos agents.')
    return
  }

  activeAgentMenu.value = null
  const result = await toggleAgentStatus(agent.id, !agent.isActive)
  if (result.success) {
    console.log(`Agent ${agent.isActive ? 'désactivé' : 'activé'} avec succès`)
  }
}

const deleteAgentAction = async (agent: Agent) => {
  if (trialExpired.value) {
    alert('❌ Votre essai gratuit est terminé. Passez au plan Starter pour gérer vos agents.')
    return
  }

  if (confirm('Êtes-vous sûr de vouloir supprimer ce vendeur IA ?')) {
    activeAgentMenu.value = null
    const result = await deleteAgent(agent.id)
    if (result.success) {
      console.log('Agent supprimé avec succès')
    }
  }
}

const configureAgent = async (agent: Agent) => {
  console.log('🔄 Navigation vers configuration:', agent.id, agent.name)
  
  if (trialExpired.value) {
    alert('❌ Votre essai gratuit est terminé.\n\nPassez au plan Starter pour accéder à la configuration de vos agents IA.')
    router.push('/billing')
    return
  }

  activeAgentMenu.value = null
  
  try {
    // Sauvegarder l'agent dans le store avant navigation
    const { useAgentConfigStore } = await import('~/stores/agentConfig')
    const agentConfigStore = useAgentConfigStore()
    
    const agentDataForConfig = {
      id: agent.id,
      name: agent.name,
      type: agent.type,
      personality: agent.personality || 'friendly',
      description: agent.description || '',
      welcomeMessage: agent.welcomeMessage || '',
      fallbackMessage: agent.fallbackMessage || '',
      avatar: agent.avatar || '',
      isActive: agent.isActive,
      config: agent.config || {},
      stats: agent.stats || { conversations: 0, conversions: 0 },
      sourceComponent: 'vendeurs-ia'
    }
    
    agentConfigStore.setAgentForConfig(agentDataForConfig, 'vendeurs-ia')
    console.log('✅ Agent sauvegardé dans store pour configuration')
    
    await navigateTo({
      path: '/agent-config',
      query: { id: agent.id }
    })
    
  } catch (navigationError) {
    console.warn('⚠️ Erreur navigation:', navigationError)
    window.location.href = `/agent-config?id=${agent.id}`
  }
}

const testAgent = (agent: Agent) => {
  if (trialExpired.value) {
    alert('❌ Votre essai gratuit est terminé.\n\nPassez au plan Starter pour tester vos agents IA.')
    router.push('/billing')
    return
  }
  
  if (!canTestAgents.value) {
    alert('❌ La fonctionnalité de test est réservée aux utilisateurs des plans payants.')
    router.push('/billing')
    return
  }
  
  showTestModal.value = true
  selectedAgent.value = agent
  
  chatMessages.value = [
    {
      id: Date.now().toString(),
      role: 'assistant',
      content: agent.welcomeMessage || 'Bonjour ! Comment puis-je vous aider aujourd\'hui ?',
      timestamp: new Date()
    }
  ]
}

const sendTestMessage = async () => {
  if (!testMessage.value.trim() || sendingMessage.value || !selectedAgent.value) return
  
  const userMessage = testMessage.value.trim()
  testMessage.value = ''
  sendingMessage.value = true
  
  const userMsg: ChatMessage = {
    id: Date.now().toString(),
    role: 'user',
    content: userMessage,
    timestamp: new Date()
  }
  chatMessages.value.push(userMsg)
  
  const loadingMsg: ChatMessage = {
    id: (Date.now() + 1).toString(),
    role: 'assistant',
    content: 'L\'IA réfléchit...',
    timestamp: new Date(),
    loading: true
  }
  chatMessages.value.push(loadingMsg)
  
  await nextTick()
  if (chatContainer.value) {
    chatContainer.value.scrollTop = chatContainer.value.scrollHeight
  }
  
  try {
    await new Promise(resolve => setTimeout(resolve, 1000))
    
    const aiResponses = [
      `Merci pour votre question ! En tant que ${selectedAgent.value.name}, je peux vous aider avec cela.`,
      'C\'est une excellente question ! Laissez-moi vous expliquer...',
      'Je comprends votre besoin. Voici ce que je peux vous proposer...',
      'Parfait ! C\'est exactement le type de question pour laquelle je suis conçu.'
    ]
    
    const randomResponse = aiResponses[Math.floor(Math.random() * aiResponses.length)]
    
    const msgIndex = chatMessages.value.findIndex(msg => msg.loading)
    if (msgIndex !== -1) {
      chatMessages.value[msgIndex] = {
        id: Date.now().toString(),
        role: 'assistant',
        content: randomResponse,
        timestamp: new Date()
      }
    }
    
  } catch (error) {
    console.error('❌ Erreur simulation IA:', error)
    
    const msgIndex = chatMessages.value.findIndex(msg => msg.loading)
    if (msgIndex !== -1) {
      chatMessages.value[msgIndex] = {
        id: Date.now().toString(),
        role: 'assistant',
        content: selectedAgent.value?.fallbackMessage || 'Désolé, je ne peux pas répondre pour le moment.',
        timestamp: new Date()
      }
    }
  } finally {
    sendingMessage.value = false
    
    await nextTick()
    if (chatContainer.value) {
      chatContainer.value.scrollTop = chatContainer.value.scrollHeight
    }
  }
}

const saveAgent = async () => {
  if (!agentForm.value.name) return
  
  try {
    if (editingAgent.value) {
      const result = await updateAgent(editingAgent.value.id, agentForm.value)
      if (result.success) {
        console.log('Agent modifié avec succès')
        closeModal()
      }
    } else {
      const result = await createAgent(agentForm.value)
      if (result.success) {
        console.log('Agent créé avec succès')
        closeModal()
      }
    }
  } catch (error) {
    console.error('Erreur sauvegarde:', error)
  }
}

const closeModal = () => {
  showCreateModal.value = false
  editingAgent.value = null
  showTestModal.value = false
  selectedAgent.value = null
  chatMessages.value = []
  testMessage.value = ''
  agentForm.value = {
    name: '',
    type: 'general',
    personality: 'professional',
    description: '',
    welcomeMessage: '',
    fallbackMessage: '',
    isActive: true
  }
}

const handleClickOutside = (event: Event) => {
  const target = event.target as Element
  if (!target.closest('.dropdown')) {
    activeAgentMenu.value = null
  }
}

// ✅ LIFECYCLE
onMounted(async () => {
  console.log('🚀 [vendeurs-ia] Page montée - API PURE')
  console.log('👤 Utilisateur:', authStore.user?.email)
  console.log('📋 Plan:', subscriptionPlan.value)
  console.log('⏰ Essai expiré:', trialExpired.value)
  
  document.addEventListener('click', handleClickOutside)
  
  // Charger les données via l'API pure
  await fetchAgents()
})

onUnmounted(() => {
  document.removeEventListener('click', handleClickOutside)
})

useHead({
  title: 'Vendeurs IA - ChatSeller Dashboard'
})
</script>

<style scoped>
/* ✅ MODERN COMPONENTS */
.agent-card {
  @apply bg-white rounded-xl shadow-sm border border-gray-200 p-6 transition-all hover:shadow-md relative;
}

.agent-card-active {
  @apply border-green-300 bg-green-50/30;
}

.agent-card-disabled {
  @apply border-red-300 bg-red-50/30 opacity-75;
}

.agent-avatar {
  @apply w-12 h-12 rounded-xl flex items-center justify-center;
}

.status-badge {
  @apply inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium;
}

.agent-menu-btn {
  @apply p-2 text-gray-400 hover:text-gray-600 hover:bg-gray-100 rounded-lg transition-colors;
}

.dropdown-menu {
  @apply absolute right-0 top-10 mt-1 w-48 bg-white rounded-lg shadow-lg border border-gray-200 py-1 z-50;
}

.dropdown-item {
  @apply w-full flex items-center px-4 py-2 text-sm text-gray-700 hover:bg-gray-50 transition-colors disabled:opacity-50 disabled:cursor-not-allowed;
}

.stat-item {
  @apply text-center;
}

.stat-value {
  @apply text-lg font-bold text-gray-900;
}

.stat-label {
  @apply text-xs text-gray-500;
}

.btn-primary {
  @apply inline-flex items-center px-4 py-2 bg-blue-600 text-white text-sm font-medium rounded-lg hover:bg-blue-700 disabled:opacity-50 transition-colors;
}

.btn-secondary {
  @apply inline-flex items-center px-4 py-2 border border-gray-300 rounded-lg text-sm font-medium text-gray-700 bg-white hover:bg-gray-50 transition-colors;
}

.input-modern {
  @apply px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-colors text-sm;
}

/* ✅ MODAL STYLES */
.modal-overlay {
  @apply fixed inset-0 z-50 overflow-y-auto bg-gray-900 bg-opacity-50 backdrop-blur-sm flex items-center justify-center p-4;
}

.modal-content {
  @apply bg-white rounded-xl shadow-xl max-w-lg w-full max-h-[90vh] overflow-y-auto;
}

.modal-large {
  @apply max-w-4xl;
}

.modal-header {
  @apply flex items-center justify-between p-6 border-b border-gray-200;
}

.modal-title {
  @apply text-lg font-semibold text-gray-900;
}

.modal-close {
  @apply text-gray-400 hover:text-gray-600 transition-colors;
}

.modal-body {
  @apply p-6;
}

.modal-footer {
  @apply flex items-center justify-end space-x-3 p-6 border-t border-gray-200;
}

/* ✅ UTILS */
.line-clamp-2 {
  display: -webkit-box;
  -webkit-line-clamp: 2;
  -webkit-box-orient: vertical;
  overflow: hidden;
}

/* ✅ ANIMATIONS */
@keyframes spin {
  from { transform: rotate(0deg); }
  to { transform: rotate(360deg); }
}

.animate-spin {
  animation: spin 1s linear infinite;
}
</style>