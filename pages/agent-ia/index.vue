<!-- pages/agent-ia/index.vue -->
<template>
  <div class="min-h-screen bg-gradient-to-br from-rose-50 via-pink-50 to-purple-50">
    <!-- Header adaptatif -->
    <div class="bg-white/80 backdrop-blur-sm border-b border-rose-200">
      <div class="px-4 sm:px-6 lg:px-8 py-4 lg:py-6">
        <div class="flex flex-col sm:flex-row sm:items-center justify-between space-y-4 sm:space-y-0">
          <div>
            <h1 class="text-2xl lg:text-3xl font-bold text-gray-900">
              {{ getPageTitle() }}
            </h1>
            <p class="mt-2 text-sm lg:text-base text-gray-600">
              {{ getPageDescription() }}
            </p>
          </div>
          
          <div class="flex items-center space-x-3 lg:space-x-4">
            <button
              @click="refreshAgents"
              :disabled="loading"
              class="inline-flex items-center px-3 lg:px-4 py-2 border border-gray-300 rounded-lg text-sm font-medium text-gray-700 bg-white hover:bg-gray-50 disabled:opacity-50 transition-colors"
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
              class="inline-flex items-center px-3 lg:px-4 py-2 text-white text-sm font-medium rounded-lg hover:opacity-90 transition-all disabled:opacity-50 disabled:cursor-not-allowed"
              :class="getCreateButtonClasses()"
              :title="!canCreateAgent ? 'Vérifiez vos quotas ou votre plan' : trialExpired ? 'Essai gratuit expiré' : ''"
            >
              <svg class="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 6v6m0 0v6m0-6h6m-6 0H6"/>
              </svg>
              {{ getCreateButtonText() }}
            </button>
          </div>
        </div>
      </div>
    </div>

    <!-- ✅ NOUVEAU : Alertes quotas beauté -->
    <div v-if="quotaAlerts.length > 0" class="mx-4 sm:mx-6 lg:mx-8 mt-4">
      <div 
        v-for="alert in quotaAlerts.slice(0, 2)" 
        :key="alert.quota"
        class="p-4 rounded-xl shadow-sm mb-3"
        :class="getAlertClasses(alert.type)"
      >
        <div class="flex items-center">
          <div class="flex-shrink-0">
            <svg 
              class="w-5 h-5"
              :class="getAlertIconClasses(alert.type)"
              fill="none" 
              stroke="currentColor" 
              viewBox="0 0 24 24"
            >
              <path v-if="alert.type === 'exceeded'" stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"/>
              <path v-else stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"/>
            </svg>
          </div>
          <div class="ml-3 flex-1">
            <p class="text-sm font-medium" :class="getAlertTextClasses(alert.type)">
              {{ alert.message }}
            </p>
            <div class="mt-1 w-full bg-white/50 rounded-full h-2">
              <div 
                class="h-2 rounded-full transition-all"
                :class="getAlertProgressClasses(alert.type)"
                :style="{ width: Math.min(alert.percentage, 100) + '%' }"
              ></div>
            </div>
          </div>
          <div class="ml-4">
            <NuxtLink 
              to="/billing"
              class="inline-flex items-center px-3 py-1 rounded-lg text-xs font-medium transition-colors"
              :class="getAlertButtonClasses(alert.type)"
            >
              Upgrader
            </NuxtLink>
          </div>
        </div>
      </div>
    </div>

    <!-- ✅ NOUVEAU : Bannière coût agents (si > 1 agent) -->
    <div v-if="monthlyAgentsCost > 0" class="mx-4 sm:mx-6 lg:mx-8 mt-4 mb-6">
      <div class="bg-gradient-to-r from-blue-600 to-purple-600 rounded-xl shadow-lg overflow-hidden">
        <div class="px-6 lg:px-8 py-4 text-white">
          <div class="flex items-center justify-between">
            <div class="flex items-center">
              <div class="w-10 h-10 bg-white/20 rounded-full flex items-center justify-center mr-4">
                <svg class="w-5 h-5" fill="currentColor" viewBox="0 0 20 20">
                  <path d="M8.433 7.418c.155-.103.346-.196.567-.267v1.698a2.305 2.305 0 01-.567-.267C8.07 8.34 8 8.114 8 8c0-.114.07-.34.433-.582zM11 12.849v-1.698c.22.071.412.164.567.267.364.243.433.468.433.582 0 .114-.07.34-.433.582a2.305 2.305 0 01-.567.267z"/>
                  <path fill-rule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm1-13a1 1 0 10-2 0v.092a4.535 4.535 0 00-1.676.662C6.602 6.234 6 7.009 6 8c0 .99.602 1.765 1.324 2.246.48.32 1.054.545 1.676.662v1.941c-.391-.127-.68-.317-.843-.504a1 1 0 10-1.51 1.31c.562.649 1.413 1.076 2.353 1.253V15a1 1 0 102 0v-.092a4.535 4.535 0 001.676-.662C13.398 13.766 14 12.991 14 12c0-.99-.602-1.765-1.324-2.246A4.535 4.535 0 0011 9.092V7.151c.391.127.68.317.843.504a1 1 0 101.51-1.31c-.562-.649-1.413-1.076-2.353-1.253V5z" clip-rule="evenodd"/>
                </svg>
              </div>
              <div>
                <h3 class="font-semibold">{{ agents.length }} {{ agents.length > 1 ? 'Conseillères' : 'Conseillère' }} active{{ agents.length > 1 ? 's' : '' }}</h3>
                <p class="text-sm text-white/80">
                  Coût additionnel : <strong>{{ monthlyAgentsCost }}€/mois</strong>
                  {{ estimatedYearlyAgentsCost > 0 ? `(${estimatedYearlyAgentsCost}€/an)` : '' }}
                </p>
              </div>
            </div>
            <div class="text-right">
              <div class="text-xs text-white/60">Total facturé</div>
              <div class="text-lg font-bold">{{ totalMonthlyCost }}€/mois</div>
            </div>
          </div>
        </div>
      </div>
    </div>

    <!-- Plan Banner Adaptatifs NOUVEAU SYSTÈME -->
    <div class="mx-4 sm:mx-6 lg:mx-8 mt-4 mb-6">
      <!-- Banner essai expiré -->
      <div v-if="trialExpired" class="bg-gradient-to-r from-red-600 to-red-800 rounded-xl shadow-lg overflow-hidden">
        <div class="px-6 lg:px-8 py-6 text-white relative">
          <div class="flex items-center justify-between">
            <div>
              <h2 class="text-lg lg:text-xl font-bold mb-2 flex items-center">
                ⏰ Essai gratuit terminé
              </h2>
              <p class="text-red-100 text-sm lg:text-base mb-4">
                Votre période d'essai de {{ planDetails.trialDays }} jours est terminée. Vos {{ getAgentTypePlural().toLowerCase() }} {{ agents.length > 1 ? 'sont maintenant désactivées' : 'est maintenant désactivée' }}.
              </p>
              <div class="flex flex-wrap gap-3">
                <NuxtLink 
                  to="/billing"
                  class="inline-flex items-center px-4 lg:px-6 py-2 lg:py-3 bg-white text-red-600 rounded-lg font-medium hover:bg-red-50 transition-all text-sm lg:text-base"
                >
                  <svg class="w-4 lg:w-5 h-4 lg:h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M13 7h8m0 0v8m0-8l-8 8-4-4-6 6"/>
                  </svg>
                  Passer au plan Starter - {{ planDetails.monthlyPrice }}€/mois
                </NuxtLink>
              </div>
            </div>
          </div>
        </div>
      </div>

      <!-- ✅ NOUVEAU : Banner plan actuel avec quotas -->
      <div v-else-if="!trialExpired && planDetails" class="rounded-xl shadow-lg overflow-hidden" :class="getPlanBannerClasses()">
        <div class="px-6 lg:px-8 py-6 text-white relative">
          <div class="flex items-center justify-between">
            <div class="flex-1">
              <h2 class="text-lg lg:text-xl font-bold mb-3">
                ✨ Plan {{ planDetails.name }} 
                <span v-if="planDetails.trialDaysLeft > 0" class="text-sm font-normal opacity-90">
                  - {{ planDetails.trialDaysLeft }} jour{{ planDetails.trialDaysLeft > 1 ? 's' : '' }} d'essai restant{{ planDetails.trialDaysLeft > 1 ? 's' : '' }}
                </span>
              </h2>
              
               <!-- ✅ NOUVEAU : Quotas résumé -->
              <div class="grid grid-cols-2 md:grid-cols-4 gap-4 mb-4">
                <div v-if="quotaSummary" v-for="(quota, key) in quotaSummary" :key="key" class="text-center">
                  <div class="text-xs opacity-75">{{ quota.label }}</div>
                  <div class="font-semibold">
                    {{ quota.used }}{{ quota.limit === -1 ? '' : `/${quota.limit}` }}
                    <span v-if="key === 'agents' && 'costInfo' in quota" class="text-xs ml-1">{{ (quota as any).costInfo }}</span>
                  </div>
                  <div v-if="quota.limit !== -1" class="w-full bg-white/20 rounded-full h-1 mt-1">
                    <div 
                      class="bg-white h-1 rounded-full transition-all"
                      :style="{ width: Math.min((quota.used / quota.limit) * 100, 100) + '%' }"
                    ></div>
                  </div>
                </div>
              </div>

              <div class="flex flex-wrap gap-3">
                <NuxtLink 
                  to="/billing"
                  class="inline-flex items-center px-4 lg:px-6 py-2 lg:py-3 bg-white bg-opacity-20 rounded-lg text-white font-medium hover:bg-opacity-30 transition-all backdrop-blur-sm text-sm lg:text-base"
                >
                  <svg class="w-4 lg:w-5 h-4 lg:h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M13 7h8m0 0v8m0-8l-8 8-4-4-6 6"/>
                  </svg>
                  {{ planDetails.name === 'Starter' ? 'Passer au Growth' : 'Voir tous les plans' }}
                </NuxtLink>
                
                <NuxtLink 
                  to="/quotas"
                  class="inline-flex items-center px-4 py-2 bg-white bg-opacity-10 rounded-lg text-white font-medium hover:bg-opacity-20 transition-all text-sm"
                >
                  <svg class="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z"/>
                  </svg>
                  Voir quotas
                </NuxtLink>
              </div>
            </div>
            
            <!-- Plan badge -->
            <div class="hidden lg:block ml-6">
              <div class="w-20 h-20 bg-white bg-opacity-10 rounded-full flex items-center justify-center backdrop-blur-sm">
                <div class="text-center">
                  <div class="text-2xl font-bold">{{ agents.length }}</div>
                  <div class="text-xs opacity-75">Agent{{ agents.length > 1 ? 's' : '' }}</div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>

    <!-- Message d'erreur -->
    <div v-if="error" class="p-4 bg-red-50 border-l-4 border-red-400 mx-4 sm:mx-6 lg:mx-8 mt-4 rounded-r-lg">
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
    <div class="p-4 sm:p-6 lg:p-8">
      <!-- Loading State -->
      <div v-if="loading && agents.length === 0" class="text-center py-16">
        <div class="inline-flex items-center space-x-3">
          <svg class="animate-spin h-8 w-8" :class="getLoadingSpinnerClasses()" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15"/>
          </svg>
          <span class="text-lg text-gray-600">{{ getLoadingText() }}</span>
        </div>
      </div>

      <!-- Agents Grid -->
      <div v-else-if="agents.length > 0" class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 lg:gap-6">
        <div
          v-for="agent in agents"
          :key="agent.id"
          class="agent-card"
          :class="getAgentCardClasses(agent)"
        >
          <!-- ✅ NOUVEAU : Badge coût par agent (si > 1 agent) -->
          <div v-if="agents.length > 1 && !trialExpired" class="absolute -top-2 -right-2">
            <div class="bg-blue-500 text-white text-xs font-bold px-2 py-1 rounded-full shadow-lg">
              +10€/mois
            </div>
          </div>

          <!-- Agent Header -->
          <div class="flex items-center justify-between mb-4">
            <div class="flex items-center space-x-3">
              <div class="agent-avatar" :class="getAgentAvatarClasses()">
                <img
                  v-if="agent.avatar"
                  :src="agent.avatar"
                  :alt="agent.name"
                  class="w-full h-full object-cover rounded-full"
                  @error="handleAvatarError"
                />
                <span v-else class="text-white font-medium text-lg">
                  {{ agent.name.charAt(0) }}
                </span>
              </div>
              <div>
                <h3 class="text-lg font-semibold text-gray-900">{{ agent.name }}</h3>
                <p class="text-sm" :class="getAgentSubtitleClasses()">
                  {{ getAgentTypeLabel(agent.type) }}
                </p>
              </div>
            </div>
            
            <div class="flex items-center space-x-2">
              <!-- Statut réel basé sur l'essai -->
              <span :class="getStatusBadgeClass(agent.isActive)" class="status-badge">
                {{ trialExpired ? 'Désactivée (Essai expiré)' : (agent.isActive ? 'Active' : 'Inactive') }}
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
                
                <!-- Menu désactivé si essai expiré -->
                <div v-if="activeAgentMenu === agent.id && !trialExpired" class="dropdown-menu">
                  <button @click="editAgent(agent)" class="dropdown-item">
                    <svg class="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z"/>
                    </svg>
                    Modifier
                  </button>
                  <button @click="duplicateAgentAction(agent)" class="dropdown-item">
                    <svg class="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M8 16H6a2 2 0 01-2-2V6a2 2 0 012-2h8a2 2 0 012 2v2m-6 12h8a2 2 0 002-2v-8a2 2 0 00-2-2h-8a2 2 0 00-2 2v8a2 2 0 002 2z"/>
                    </svg>
                    Dupliquer (+10€/mois)
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
                    Supprimer {{ agents.length > 1 ? '(-10€/mois)' : '' }}
                  </button>
                </div>
              </div>
            </div>
          </div>

          <!-- Agent Description -->
          <p class="text-sm text-gray-600 mb-4 line-clamp-2">
            {{ agent.description || getDefaultDescription(agent.type) }}
          </p>

          <!-- Overlay si essai expiré -->
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
              <div class="stat-label">{{ getConversationsLabel() }}</div>
            </div>
            <div class="stat-item">
              <div class="stat-value">{{ agent.stats?.conversions || 0 }}</div>
              <div class="stat-label">{{ getConversionsLabel() }}</div>
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
              :class="[{ 'opacity-50 cursor-not-allowed': !canTestAgents || trialExpired }, getTestButtonClasses()]"
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

      <!-- Empty State Adaptatif -->
      <div v-else-if="!loading" class="text-center py-16">
        <div class="empty-state-illustration">
          <div class="w-24 h-24 mx-auto mb-6 rounded-full flex items-center justify-center" :class="getEmptyStateClasses()">
            <span class="text-4xl">{{ getEmptyStateIcon() }}</span>
          </div>
        </div>
        <h3 class="mt-4 text-xl font-medium text-gray-900">
          {{ trialExpired ? 'Accès limité - Essai gratuit terminé' : getEmptyStateTitle() }}
        </h3>
        <p class="mt-2 text-gray-500 max-w-md mx-auto text-sm lg:text-base">
          {{ trialExpired 
            ? getEmptyStateTrialExpiredMessage() 
            : getEmptyStateDescription() 
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
            Passer au plan Starter - {{ planDetails.monthlyPrice }}€/mois
          </button>
          <button
            v-else
            @click="openCreateModal"
            :disabled="!canCreateAgent"
            class="inline-flex items-center px-6 py-3 border border-transparent text-base font-medium rounded-xl text-white transition-all duration-200 disabled:opacity-50 disabled:cursor-not-allowed"
            :class="getCreateEmptyButtonClasses()"
          >
            <svg class="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 6v6m0 0v6m0-6h6m-6 0H6"/>
            </svg>
            {{ getCreateFirstAgentText() }}
          </button>
        </div>
      </div>
    </div>

    <!-- ✅ MODAL CRÉATION MODERNISÉ AVEC NOUVEAU SYSTÈME -->
    <div v-if="(showCreateModal || editingAgent) && !trialExpired" class="modal-overlay" @click.self="closeModal">
      <div class="modal-content modal-large">
        <div class="modal-header">
          <h3 class="modal-title">
            {{ editingAgent ? `Modifier votre ${getAgentTypeSingular()}` : `Créer votre ${getAgentTypeSingular()}` }}
          </h3>
          <button @click="closeModal" class="modal-close">
            <svg class="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12"/>
            </svg>
          </button>
        </div>
        
        <div class="modal-body">
          <!-- ✅ NOUVEAU : Alerte coût si > 1 agent -->
          <div v-if="!editingAgent && agents.length >= 1" class="rounded-lg p-4 mb-6 border border-blue-200 bg-blue-50">
            <div class="flex items-start space-x-3">
              <div class="w-8 h-8 bg-blue-500 rounded-full flex items-center justify-center flex-shrink-0 mt-0.5">
                <svg class="w-4 h-4 text-white" fill="currentColor" viewBox="0 0 20 20">
                  <path d="M8.433 7.418c.155-.103.346-.196.567-.267v1.698a2.305 2.305 0 01-.567-.267C8.07 8.34 8 8.114 8 8c0-.114.07-.34.433-.582zM11 12.849v-1.698c.22.071.412.164.567.267.364.243.433.468.433.582 0 .114-.07.34-.433.582a2.305 2.305 0 01-.567.267z"/>
                  <path fill-rule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm1-13a1 1 0 10-2 0v.092a4.535 4.535 0 00-1.676.662C6.602 6.234 6 7.009 6 8c0 .99.602 1.765 1.324 2.246.48.32 1.054.545 1.676.662v1.941c-.391-.127-.68-.317-.843-.504a1 1 0 10-1.51 1.31c.562.649 1.413 1.076 2.353 1.253V15a1 1 0 102 0v-.092a4.535 4.535 0 001.676-.662C13.398 13.766 14 12.991 14 12c0-.99-.602-1.765-1.324-2.246A4.535 4.535 0 0011 9.092V7.151c.391.127.68.317.843.504a1 1 0 101.51-1.31c-.562-.649-1.413-1.076-2.353-1.253V5z" clip-rule="evenodd"/>
                </svg>
              </div>
              <div>
                <h4 class="font-medium text-blue-900 mb-1">
                  💡 Nouveau modèle économique
                </h4>
                <p class="text-sm text-blue-800">
                  <strong>Agents illimités</strong> dans votre plan {{ planDetails.name }}. 
                  Chaque agent supplémentaire coûte <strong>10€/mois</strong>.
                </p>
                <p class="text-xs text-blue-700 mt-2">
                  Coût actuel : {{ monthlyAgentsCost }}€/mois ({{ agents.length }} agent{{ agents.length > 1 ? 's' : '' }})
                  → Nouveau coût : {{ monthlyAgentsCost + 10 }}€/mois ({{ agents.length + 1 }} agents)
                </p>
              </div>
            </div>
          </div>

          <!-- Introduction guidée adaptative -->
          <div v-if="!editingAgent" class="rounded-lg p-4 mb-6" :class="getIntroClasses()">
            <div class="flex items-start space-x-3">
              <div class="w-8 h-8 rounded-full flex items-center justify-center flex-shrink-0 mt-0.5" :class="getIntroIconClasses()">
                <span class="text-lg">{{ getIntroIcon() }}</span>
              </div>
              <div>
                <h4 class="font-medium mb-1" :class="getIntroTitleClasses()">
                  {{ getIntroTitle() }}
                </h4>
                <p class="text-sm" :class="getIntroDescriptionClasses()">
                  {{ getIntroDescription() }}
                </p>
              </div>
            </div>
          </div>

          <div class="space-y-6">
            <!-- ÉTAPE 1: Type de Conseillère Adaptatif -->
            <div>
              <label class="block text-sm font-medium text-gray-700 mb-3">
                <span class="flex items-center">
                  <span class="w-6 h-6 text-white text-xs font-bold rounded-full flex items-center justify-center mr-2" :class="getStepNumberClasses()">1</span>
                  {{ getAgentTypeSelectionTitle() }}
                </span>
              </label>
              <div class="grid grid-cols-1 md:grid-cols-2 gap-3">
                <button
                  v-for="type in getAvailableAgentTypes()"
                  :key="type.value"
                  @click="selectAgentType(type.value)"
                  :class="[
                    'p-4 border-2 rounded-lg text-left transition-all hover:border-opacity-70',
                    agentForm.type === type.value 
                      ? `${type.selectedClasses} ring-2 ring-opacity-20` 
                      : 'border-gray-200 hover:border-gray-300'
                  ]"
                >
                  <div class="flex items-start space-x-3">
                    <div :class="[
                      'w-8 h-8 rounded-lg flex items-center justify-center flex-shrink-0',
                      type.colorClasses
                    ]">
                      <span class="text-lg text-white">{{ type.icon }}</span>
                    </div>
                    <div class="flex-1">
                      <h4 class="font-medium text-gray-900">{{ type.label }}</h4>
                      <p class="text-xs text-gray-500 mt-1">{{ type.description }}</p>
                    </div>
                  </div>
                </button>
              </div>
            </div>

            <!-- ÉTAPE 2: Nom personnalisé -->
            <div>
              <label class="block text-sm font-medium text-gray-700 mb-2">
                <span class="flex items-center">
                  <span class="w-6 h-6 text-white text-xs font-bold rounded-full flex items-center justify-center mr-2" :class="getStepNumberClasses()">2</span>
                  Nom de votre {{ getAgentTypeSingular().toLowerCase() }} *
                </span>
              </label>
              <input
                v-model="agentForm.name"
                @input="onNameChange"
                type="text"
                class="input-modern w-full"
                :placeholder="getNamePlaceholder()"
              />
              <p class="text-xs text-gray-500 mt-1">
                Exemples: {{ getNameExamples() }}
              </p>
            </div>

            <!-- Personnalité avec preview adaptatif -->
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
                      ? `${getPersonalitySelectedClasses()}` 
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

            <!-- Description intelligente -->
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
                  class="absolute top-2 right-2 px-3 py-1 text-white text-xs font-medium rounded-md hover:opacity-90 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
                  :class="getGenerateButtonClasses()"
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

            <!-- Message d'accueil adaptatif -->
            <div>
              <label class="block text-sm font-medium text-gray-700 mb-2">
                Message d'accueil personnalisé *
              </label>
              <textarea
                v-model="agentForm.welcomeMessage"
                rows="3"
                class="input-modern w-full"
                :placeholder="getWelcomeMessagePlaceholder()"
              ></textarea>
              <p class="text-xs text-gray-500 mt-1">
                {{ getWelcomeMessageHelper() }}
              </p>
            </div>

            <!-- Preview en temps réel adaptatif -->
            <div v-if="agentForm.name" class="bg-gray-50 rounded-lg p-4">
              <h4 class="font-medium text-gray-900 mb-3 flex items-center">
                <svg class="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M15 12a3 3 0 11-6 0 3 3 0 016 0z"/>
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z"/>
                </svg>
                Aperçu de votre {{ getAgentTypeSingular() }}
              </h4>
              <div class="bg-white border rounded-lg p-4 max-w-sm">
                <div class="flex items-start space-x-3">
                  <div :class="[
                    'w-10 h-10 rounded-full flex items-center justify-center',
                    getPreviewAvatarClasses()
                  ]">
                    <span class="text-white font-medium text-sm">
                      {{ agentForm.name ? agentForm.name[0].toUpperCase() : '?' }}
                    </span>
                  </div>
                  <div class="flex-1">
                    <div class="font-medium text-gray-900">{{ agentForm.name || `Votre ${getAgentTypeSingular()}` }}</div>
                    <div class="text-sm" :class="getPreviewSubtitleClasses()">{{ getAgentTypeLabel(agentForm.type) }}</div>
                    <div class="mt-2 text-sm text-gray-700 bg-gray-100 rounded-lg p-2">
                      {{ agentForm.welcomeMessage || getWelcomeMessagePlaceholder() }}
                    </div>
                  </div>
                </div>
              </div>
            </div>

            <!-- Activation -->
            <div class="flex items-center justify-between p-4 bg-gray-50 rounded-lg">
              <div>
                <h4 class="text-sm font-medium text-gray-900 flex items-center">
                  <span class="w-6 h-6 text-white text-xs font-bold rounded-full flex items-center justify-center mr-2" :class="getStepNumberClasses()">3</span>
                  Activer immédiatement
                </h4>
                <p class="text-xs text-gray-500">{{ getActivationHelper() }}</p>
              </div>
              <button
                @click="agentForm.isActive = !agentForm.isActive"
                :class="[
                  'relative inline-flex h-6 w-11 flex-shrink-0 cursor-pointer rounded-full border-2 border-transparent transition-colors duration-200 ease-in-out focus:outline-none focus:ring-2 focus:ring-offset-2',
                  agentForm.isActive ? getToggleActiveClasses() : 'bg-gray-200',
                  `focus:ring-${getColorScheme()}-500`
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
            :class="getSaveButtonClasses()"
          >
            <svg v-if="saving" class="w-4 h-4 mr-2 animate-spin" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15"/>
            </svg>
            {{ saving ? 'Création...' : (editingAgent ? 'Mettre à jour' : `Créer ma ${getAgentTypeSingular()} (+${editingAgent ? '0' : '10'}€/mois)`) }}
          </button>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, computed, onMounted, onUnmounted } from 'vue'
import { useRouter } from 'vue-router'
import { useAuthStore } from '~/stores/auth'
import { useAgents, type CreateAgentData } from '~/composables/useAgents'
import { useQuotas, type QuotaAlert } from '~/composables/useQuotas'

// ✅ IMPORTS TYPES CENTRALISÉS BEAUTÉ
import type {
  Agent,
  AgentType,
  BeautyAgentType,
  PersonalityType,
  BeautyCategory
} from '~/types/beauty'

import {
  BEAUTY_AGENT_TYPES,
  getTypeLabel,
  getAgentIcon,
  getAvatarClass
} from '~/types/beauty'

// PAGE META
definePageMeta({
  middleware: 'auth', 
  layout: 'default'
})

// COMPOSABLES
const authStore = useAuthStore()
const router = useRouter()

// ✅ AGENTS COMPOSABLE AVEC NOUVEAU SYSTÈME
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
  monthlyAgentsCost,
  estimateAgentCost,
  fetchAgents,
  createAgent,
  updateAgent,
  deleteAgent,
  toggleAgentStatus,
  duplicateAgent,
  clearError
} = useAgents()

// ✅ NOUVEAU : QUOTAS COMPOSABLE
const {
  quotaAlerts,
  quotaSummary,
  checkQuotaBeforeAction,
  incrementQuota
} = useQuotas()

// STATE
const showCreateModal = ref(false)
const editingAgent = ref<Agent | null>(null)
const activeAgentMenu = ref<string | null>(null)
const generatingDescription = ref(false)

// BEAUTY PROFILE STATE
const beautyProfile = ref<{ beautyCategory: BeautyCategory }>({
  beautyCategory: 'multi'
})

// FORM STATE
const agentForm = ref<CreateAgentData>({
  name: '',
  type: 'general' as AgentType,
  personality: 'professional' as PersonalityType,
  description: '',
  welcomeMessage: '',
  fallbackMessage: '',
  isActive: true
})

// ✅ TYPES D'AGENTS BEAUTÉ ADAPTATIFS
const beautyAgentTypes = computed(() => {
  const currentCategory = beautyProfile.value.beautyCategory
  
  const typeMapping = {
    skincare: ['skincare_expert', 'beauty_expert'],
    makeup: ['makeup_expert', 'beauty_expert'],
    fragrance: ['fragrance_expert', 'beauty_expert'],
    haircare: ['haircare_expert', 'beauty_expert'],
    bodycare: ['bodycare_expert', 'beauty_expert'],
    multi: Object.keys(BEAUTY_AGENT_TYPES)
  }
  
  const availableTypes = typeMapping[currentCategory] || Object.keys(BEAUTY_AGENT_TYPES)
  
  return availableTypes.map(typeKey => {
    const beautyType = BEAUTY_AGENT_TYPES[typeKey as BeautyAgentType]
    return {
      value: typeKey,
      label: beautyType.label,
      description: beautyType.description,
      icon: beautyType.icon,
      colorClasses: getAvatarClass(typeKey as AgentType),
      selectedClasses: `border-${beautyType.color}-500 bg-${beautyType.color}-50`,
      defaultName: beautyType.defaultName,
      defaultDescription: beautyType.description,
      welcomeTemplate: beautyType.welcomeTemplate
    }
  })
})

const personalityOptions = ref([
  {
    value: 'professional',
    label: 'Professionnelle',
    description: 'Experte, technique',
    emoji: '👩‍💼'
  },
  {
    value: 'friendly',
    label: 'Bienveillante', 
    description: 'Chaleureuse, empathique',
    emoji: '😊'
  },
  {
    value: 'expert',
    label: 'Ultra-experte',
    description: 'Très technique, précise',
    emoji: '🎓'
  },
  {
    value: 'casual',
    label: 'Décontractée',
    description: 'Cool, accessible',
    emoji: '😎'
  }
])

// ✅ COMPUTED - SYSTÈME ADAPTATIF AVEC NOUVEAU MODÈLE
const getPageTitle = () => {
  const titles = {
    skincare: 'Mes Esthéticiennes IA',
    makeup: 'Mes Expertes Makeup IA', 
    fragrance: 'Mes Conseillères Parfums IA',
    haircare: 'Mes Expertes Capillaires IA',
    bodycare: 'Mes Expertes Soins Corps IA',
    multi: 'Mes Conseillères IA'
  }
  return titles[beautyProfile.value.beautyCategory] || titles.multi
}

const getPageDescription = () => {
  const descriptions = {
    skincare: 'Gérez vos Conseillères IA spécialisées en soins visage et conseils peau',
    makeup: 'Gérez vos Conseillères IA spécialisées en maquillage et création de looks',
    fragrance: 'Gérez vos Conseillères IA spécialisées en parfums et familles olfactives',
    haircare: 'Gérez vos Conseillères IA spécialisées en soins capillaires', 
    bodycare: 'Gérez vos Conseillères IA spécialisées en soins corporels et bien-être',
    multi: 'Gérez vos Conseillères IA spécialisés dans le secteur de la beauté'
  }
  return descriptions[beautyProfile.value.beautyCategory] || descriptions.multi
}

const getAgentTypeSingular = () => {
  const types = {
    skincare: 'Conseillère Beauté IA',
    makeup: 'Conseillère Beauté IA',
    fragrance: 'Conseillère Parfums IA',
    haircare: 'Experte Capillaire IA',
    bodycare: 'Experte Soins Corps IA',
    multi: 'Conseillère IA'
  }
  return types[beautyProfile.value.beautyCategory] || types.multi
}

const getAgentTypePlural = () => {
  const plurals = {
    skincare: 'Conseillères Beauté IA',
    makeup: 'Conseillères Beauté IA',
    fragrance: 'Conseillères Parfums IA', 
    haircare: 'Expertes Capillaires IA',
    bodycare: 'Expertes Soins Corps IA',
    multi: 'Conseillères IA'
  }
  return plurals[beautyProfile.value.beautyCategory] || plurals.multi
}

const getColorScheme = () => {
  const schemes = {
    skincare: 'pink',
    makeup: 'purple',
    fragrance: 'violet',
    haircare: 'amber',
    bodycare: 'teal', 
    multi: 'rose'
  }
  return schemes[beautyProfile.value.beautyCategory] || schemes.multi
}

// ✅ NOUVEAU : Computed coûts
const estimatedYearlyAgentsCost = computed(() => {
  return monthlyAgentsCost.value * 12
})

const totalMonthlyCost = computed(() => {
  return planDetails.value.monthlyPrice + monthlyAgentsCost.value
})

const getConversationsLabel = () => {
  return 'Conversations'
}

const getConversionsLabel = () => {
  const labels = {
    skincare: 'Routines vendues',
    makeup: 'Looks créés',
    fragrance: 'Parfums choisis',
    haircare: 'Soins recommandés',
    bodycare: 'Rituels adoptés',
    multi: 'Conversions'
  }
  return labels[beautyProfile.value.beautyCategory] || labels.multi
}

// ✅ NOUVEAU : Classes pour alertes quotas
const getAlertClasses = (type: QuotaAlert['type']) => {
  const classMap = {
    warning: 'bg-yellow-50 border border-yellow-200',
    critical: 'bg-orange-50 border border-orange-200',
    exceeded: 'bg-red-50 border border-red-200'
  }
  return classMap[type]
}

const getAlertIconClasses = (type: QuotaAlert['type']) => {
  const classMap = {
    warning: 'text-yellow-400',
    critical: 'text-orange-400',
    exceeded: 'text-red-400'
  }
  return classMap[type]
}

const getAlertTextClasses = (type: QuotaAlert['type']) => {
  const classMap = {
    warning: 'text-yellow-800',
    critical: 'text-orange-800',
    exceeded: 'text-red-800'
  }
  return classMap[type]
}

const getAlertProgressClasses = (type: QuotaAlert['type']) => {
  const classMap = {
    warning: 'bg-yellow-500',
    critical: 'bg-orange-500',
    exceeded: 'bg-red-500'
  }
  return classMap[type]
}

const getAlertButtonClasses = (type: QuotaAlert['type']) => {
  const classMap = {
    warning: 'bg-yellow-100 text-yellow-800 hover:bg-yellow-200',
    critical: 'bg-orange-100 text-orange-800 hover:bg-orange-200',
    exceeded: 'bg-red-100 text-red-800 hover:bg-red-200'
  }
  return classMap[type]
}

// CLASSES ADAPTATIVES
const getCreateButtonClasses = () => {
  const schemes = {
    skincare: 'bg-gradient-to-r from-pink-600 to-rose-600 hover:from-pink-700 hover:to-rose-700',
    makeup: 'bg-gradient-to-r from-purple-600 to-pink-600 hover:from-purple-700 hover:to-pink-700',
    fragrance: 'bg-gradient-to-r from-violet-600 to-purple-600 hover:from-violet-700 hover:to-purple-700',
    haircare: 'bg-gradient-to-r from-amber-600 to-orange-600 hover:from-amber-700 hover:to-orange-700',
    bodycare: 'bg-gradient-to-r from-teal-600 to-cyan-600 hover:from-teal-700 hover:to-cyan-700',
    multi: 'bg-gradient-to-r from-rose-600 to-pink-600 hover:from-rose-700 hover:to-pink-700'
  }
  return schemes[beautyProfile.value.beautyCategory] || schemes.multi
}

const getPlanBannerClasses = () => {
  const schemes = {
    skincare: 'bg-gradient-to-r from-pink-700 to-rose-500',
    makeup: 'bg-gradient-to-r from-purple-700 to-pink-500', 
    fragrance: 'bg-gradient-to-r from-violet-700 to-purple-500',
    haircare: 'bg-gradient-to-r from-amber-700 to-orange-500',
    bodycare: 'bg-gradient-to-r from-teal-700 to-cyan-500',
    multi: 'bg-gradient-to-r from-blue-700 to-purple-500'
  }
  return schemes[beautyProfile.value.beautyCategory] || schemes.multi
}

const getLoadingSpinnerClasses = () => {
  const schemes = {
    skincare: 'text-pink-600',
    makeup: 'text-purple-600',
    fragrance: 'text-violet-600', 
    haircare: 'text-amber-600',
    bodycare: 'text-teal-600',
    multi: 'text-rose-600'
  }
  return schemes[beautyProfile.value.beautyCategory] || schemes.multi
}

const getAgentAvatarClasses = () => {
  const currentType = BEAUTY_AGENT_TYPES[beautyProfile.value.beautyCategory === 'multi' ? 'beauty_expert' : `${beautyProfile.value.beautyCategory}_expert` as BeautyAgentType]
  return getAvatarClass(currentType ? `${beautyProfile.value.beautyCategory}_expert` as AgentType : 'beauty_expert' as AgentType)
}

const getAgentSubtitleClasses = () => {
  const schemes = {
    skincare: 'text-pink-600',
    makeup: 'text-purple-600',
    fragrance: 'text-violet-600',
    haircare: 'text-amber-600', 
    bodycare: 'text-teal-600',
    multi: 'text-rose-600'
  }
  return schemes[beautyProfile.value.beautyCategory] || schemes.multi
}

const getTestButtonClasses = () => {
  const schemes = {
    skincare: 'bg-pink-600 hover:bg-pink-700',
    makeup: 'bg-purple-600 hover:bg-purple-700',
    fragrance: 'bg-violet-600 hover:bg-violet-700',
    haircare: 'bg-amber-600 hover:bg-amber-700',
    bodycare: 'bg-teal-600 hover:bg-teal-700', 
    multi: 'bg-rose-600 hover:bg-rose-700'
  }
  return schemes[beautyProfile.value.beautyCategory] || schemes.multi
}

// MÉTHODES ADAPTATIVES
const getCreateButtonText = () => {
  const texts = {
    skincare: 'Créer mon Esthéticienne IA',
    makeup: 'Créer mon Experte Makeup IA',
    fragrance: 'Créer ma Conseillère Parfums IA',
    haircare: 'Créer mon Experte Capillaire IA',
    bodycare: 'Créer mon Experte Soins Corps IA',
    multi: 'Créer ma Conseillère IA'
  }
  return texts[beautyProfile.value.beautyCategory] || texts.multi
}

const getLoadingText = () => {
  return `Chargement de vos ${getAgentTypePlural().toLowerCase()}...`
}

const getAgentCardClasses = (agent: Agent) => {
  const baseClasses = 'bg-white rounded-xl shadow-sm border border-gray-200 p-6 transition-all hover:shadow-md relative'
  
  if (trialExpired) return `${baseClasses} border-red-300 bg-red-50/30 opacity-75`
  if (agent.isActive) return `${baseClasses} ${getActiveAgentBorderClasses()}`
  return baseClasses
}

const getActiveAgentBorderClasses = () => {
  const schemes = {
    skincare: 'border-pink-300 bg-pink-50/30',
    makeup: 'border-purple-300 bg-purple-50/30',
    fragrance: 'border-violet-300 bg-violet-50/30',
    haircare: 'border-amber-300 bg-amber-50/30',
    bodycare: 'border-teal-300 bg-teal-50/30',
    multi: 'border-rose-300 bg-rose-50/30'
  }
  return schemes[beautyProfile.value.beautyCategory] || schemes.multi
}

const getEmptyStateClasses = () => {
  const currentType = BEAUTY_AGENT_TYPES[beautyProfile.value.beautyCategory === 'multi' ? 'beauty_expert' : `${beautyProfile.value.beautyCategory}_expert` as BeautyAgentType]
  return getAvatarClass(currentType ? `${beautyProfile.value.beautyCategory}_expert` as AgentType : 'beauty_expert' as AgentType)
}

const getEmptyStateIcon = () => {
  const currentType = BEAUTY_AGENT_TYPES[beautyProfile.value.beautyCategory === 'multi' ? 'beauty_expert' : `${beautyProfile.value.beautyCategory}_expert` as BeautyAgentType]
  return currentType?.icon || '🎀'
}

const getEmptyStateTitle = () => {
  const titles = {
    skincare: 'Créez votre première Esthéticienne IA',
    makeup: 'Créez votre première Experte Makeup IA', 
    fragrance: 'Créez votre première Conseillère Parfums IA',
    haircare: 'Créez votre première Experte Capillaire IA',
    bodycare: 'Créez votre première Experte Soins Corps IA',
    multi: 'Créez votre première Conseillère IA'
  }
  return titles[beautyProfile.value.beautyCategory] || titles.multi
}

const getEmptyStateDescription = () => {
  const descriptions = {
    skincare: 'Commencez par créer une Conseillère Beauté IA experte en soins visage pour transformer vos visiteurs en clientes.',
    makeup: 'Commencez par créer une Conseillère Makeup IA spécialisée pour conseiller vos clientes et booster vos ventes.',
    fragrance: 'Commencez par créer un.e Conseillère Parfums IA experte en familles olfactives pour personnaliser l\'expérience.',
    haircare: 'Commencez par créer une Conseillère Capillaire IA spécialisée pour conseiller vos clientes selon leur type de cheveux.',
    bodycare: 'Commencez par créer une Experte IA en soins du corps pour accompagner vos clientes dans leurs rituels bien-être.',
    multi: 'Commencez par créer une Conseillère IA multi-spécialités pour transformer vos visiteurs en clientes fidèles.'
  }
  return descriptions[beautyProfile.value.beautyCategory] || descriptions.multi
}

const getEmptyStateTrialExpiredMessage = () => {
  return `Passez au plan Starter pour réactiver vos ${getAgentTypePlural().toLowerCase()} et continuer à utiliser ChatSeller.`
}

const getCreateEmptyButtonClasses = () => {
  return getCreateButtonClasses()
}

const getCreateFirstAgentText = () => {
  const texts = {
    skincare: 'Créer ma première Esthéticienne IA',
    makeup: 'Créer ma première Experte Makeup IA',
    fragrance: 'Créer ma première Conseillère Parfums IA', 
    haircare: 'Créer ma première Experte Capillaire IA',
    bodycare: 'Créer ma première Experte Soins Corps IA',
    multi: 'Créer ma première Conseillère IA'
  }
  return texts[beautyProfile.value.beautyCategory] || texts.multi
}

// MODAL CLASSES
const getIntroClasses = () => {
  const schemes = {
    skincare: 'bg-pink-50 border border-pink-200',
    makeup: 'bg-purple-50 border border-purple-200',
    fragrance: 'bg-violet-50 border border-violet-200',
    haircare: 'bg-amber-50 border border-amber-200',
    bodycare: 'bg-teal-50 border border-teal-200',
    multi: 'bg-rose-50 border border-rose-200'
  }
  return schemes[beautyProfile.value.beautyCategory] || schemes.multi
}

const getIntroIconClasses = () => {
  const schemes = {
    skincare: 'bg-pink-600 text-white',
    makeup: 'bg-purple-600 text-white',
    fragrance: 'bg-violet-600 text-white',
    haircare: 'bg-amber-600 text-white',
    bodycare: 'bg-teal-600 text-white',
    multi: 'bg-rose-600 text-white'
  }
  return schemes[beautyProfile.value.beautyCategory] || schemes.multi
}

const getIntroIcon = () => {
  const currentType = BEAUTY_AGENT_TYPES[beautyProfile.value.beautyCategory === 'multi' ? 'beauty_expert' : `${beautyProfile.value.beautyCategory}_expert` as BeautyAgentType]
  return currentType?.icon || '🎀'
}

const getIntroTitle = () => {
  const titles = {
    skincare: '✨ Créer votre Esthéticienne IA en 3 étapes',
    makeup: '💄 Créer votre Experte Makeup IA en 3 étapes',
    fragrance: '🌸 Créer votre Conseillère Parfums IA en 3 étapes',
    haircare: '💇 Créer votre Experte Capillaire IA en 3 étapes',
    bodycare: '🧴 Créer votre Experte Soins Corps IA en 3 étapes',
    multi: '🎀 Créer votre Conseillère IA en 3 étapes'
  }
  return titles[beautyProfile.value.beautyCategory] || titles.multi
}

const getIntroDescription = () => {
  const descriptions = {
    skincare: '1. Choisissez le type d\'experte → 2. Nom et personnalité → 3. Activez ! Conseils peau personnalisés automatiques.',
    makeup: '1. Choisissez le type d\'experte → 2. Nom et personnalité → 3. Activez ! Conseils makeup et looks automatiques.',
    fragrance: '1. Choisissez le type d\'experte → 2. Nom et personnalité → 3. Activez ! Conseils parfums et familles olfactives automatiques.',
    haircare: '1. Choisissez le type d\'experte → 2. Nom et personnalité → 3. Activez ! Conseils capillaires personnalisés automatiques.',
    bodycare: '1. Choisissez le type d\'experte → 2. Nom et personnalité → 3. Activez ! Conseils soins corps et rituels automatiques.',
    multi: '1. Choisissez le type d\'experte → 2. Nom et personnalité → 3. Activez ! Conseils beauté multi-spécialités automatiques.'
  }
  return descriptions[beautyProfile.value.beautyCategory] || descriptions.multi
}

const getIntroTitleClasses = () => {
  const schemes = {
    skincare: 'text-pink-900',
    makeup: 'text-purple-900',
    fragrance: 'text-violet-900',
    haircare: 'text-amber-900', 
    bodycare: 'text-teal-900',
    multi: 'text-rose-900'
  }
  return schemes[beautyProfile.value.beautyCategory] || schemes.multi
}

const getIntroDescriptionClasses = () => {
  const schemes = {
    skincare: 'text-pink-700',
    makeup: 'text-purple-700',
    fragrance: 'text-violet-700',
    haircare: 'text-amber-700',
    bodycare: 'text-teal-700',
    multi: 'text-rose-700'
  }
  return schemes[beautyProfile.value.beautyCategory] || schemes.multi
}

const getStepNumberClasses = () => {
  const schemes = {
    skincare: 'bg-pink-600',
    makeup: 'bg-purple-600',
    fragrance: 'bg-violet-600',
    haircare: 'bg-amber-600',
    bodycare: 'bg-teal-600',
    multi: 'bg-rose-600'
  }
  return schemes[beautyProfile.value.beautyCategory] || schemes.multi
}

const getPersonalitySelectedClasses = () => {
  const schemes = {
    skincare: 'border-pink-500 bg-pink-50',
    makeup: 'border-purple-500 bg-purple-50',
    fragrance: 'border-violet-500 bg-violet-50',
    haircare: 'border-amber-500 bg-amber-50',
    bodycare: 'border-teal-500 bg-teal-50',
    multi: 'border-rose-500 bg-rose-50'
  }
  return schemes[beautyProfile.value.beautyCategory] || schemes.multi
}

const getGenerateButtonClasses = () => {
  const schemes = {
    skincare: 'bg-pink-600 hover:bg-pink-700',
    makeup: 'bg-purple-600 hover:bg-purple-700',
    fragrance: 'bg-violet-600 hover:bg-violet-700',
    haircare: 'bg-amber-600 hover:bg-amber-700',
    bodycare: 'bg-teal-600 hover:bg-teal-700',
    multi: 'bg-rose-600 hover:bg-rose-700'
  }
  return schemes[beautyProfile.value.beautyCategory] || schemes.multi
}

const getPreviewAvatarClasses = () => {
  const currentType = BEAUTY_AGENT_TYPES[beautyProfile.value.beautyCategory === 'multi' ? 'beauty_expert' : `${beautyProfile.value.beautyCategory}_expert` as BeautyAgentType]
  return getAvatarClass(currentType ? `${beautyProfile.value.beautyCategory}_expert` as AgentType : 'beauty_expert' as AgentType)
}

const getPreviewSubtitleClasses = () => {
  const schemes = {
    skincare: 'text-pink-600',
    makeup: 'text-purple-600',
    fragrance: 'text-violet-600',
    haircare: 'text-amber-600',
    bodycare: 'text-teal-600',
    multi: 'text-rose-600'
  }
  return schemes[beautyProfile.value.beautyCategory] || schemes.multi
}

const getToggleActiveClasses = () => {
  const schemes = {
    skincare: 'bg-pink-600',
    makeup: 'bg-purple-600',
    fragrance: 'bg-violet-600',
    haircare: 'bg-amber-600',
    bodycare: 'bg-teal-600',
    multi: 'bg-rose-600'
  }
  return schemes[beautyProfile.value.beautyCategory] || schemes.multi
}

const getSaveButtonClasses = () => {
  const schemes = {
    skincare: 'bg-pink-600 hover:bg-pink-700',
    makeup: 'bg-purple-600 hover:bg-purple-700',
    fragrance: 'bg-violet-600 hover:bg-violet-700',
    haircare: 'bg-amber-600 hover:bg-amber-700',
    bodycare: 'bg-teal-600 hover:bg-teal-700',
    multi: 'bg-rose-600 hover:bg-rose-700'
  }
  return schemes[beautyProfile.value.beautyCategory] || schemes.multi
}

// MÉTHODES MODALES
const getAgentTypeSelectionTitle = () => {
  const titles = {
    skincare: 'Quel type d\'esthéticienne IA voulez-vous ?',
    makeup: 'Quel type d\'experte makeup IA voulez-vous ?',
    fragrance: 'Quel type de conseillère parfums IA voulez-vous ?',
    haircare: 'Quel type d\'experte capillaire IA voulez-vous ?',
    bodycare: 'Quel type d\'experte soins corps IA voulez-vous ?',
    multi: 'Quel type de Conseillère IA voulez-vous ?'
  }
  return titles[beautyProfile.value.beautyCategory] || titles.multi
}

const getAvailableAgentTypes = () => {
  return beautyAgentTypes.value
}

const getAgentTypeLabel = (type: string): string => {
  return getTypeLabel(type as AgentType)
}

const getDefaultDescription = (type: string): string => {
  const beautyType = BEAUTY_AGENT_TYPES[type as BeautyAgentType]
  if (beautyType) {
    return beautyType.description
  }
  
  const fallback = BEAUTY_AGENT_TYPES[beautyProfile.value.beautyCategory === 'multi' ? 'beauty_expert' : `${beautyProfile.value.beautyCategory}_expert` as BeautyAgentType]
  return fallback?.description || 'Agent IA spécialisé beauté'
}

const getNamePlaceholder = () => {
  const currentType = BEAUTY_AGENT_TYPES[beautyProfile.value.beautyCategory === 'multi' ? 'beauty_expert' : `${beautyProfile.value.beautyCategory}_expert` as BeautyAgentType]
  return `Ex: ${currentType?.defaultName || 'Rose'}, Sophie, Marie, Julie...`
}

const getNameExamples = () => {
  const examples = {
    skincare: 'Camille, Sophie, Marie, Emma',
    makeup: 'Léa, Clara, Manon, Chloé',
    fragrance: 'Chloé, Jade, Inès, Léna',
    haircare: 'Amélie, Laura, Sarah, Océane',
    bodycare: 'Sarah, Luna, Zoé, Maya',
    multi: 'Rose, Julie, Lisa, Anna'
  }
  return examples[beautyProfile.value.beautyCategory] || examples.multi
}

const getDescriptionPlaceholder = () => {
  const currentType = BEAUTY_AGENT_TYPES[beautyProfile.value.beautyCategory === 'multi' ? 'beauty_expert' : `${beautyProfile.value.beautyCategory}_expert` as BeautyAgentType]
  return currentType?.description || 'Agent IA spécialisé beauté'
}

const getWelcomeMessagePlaceholder = () => {
  const currentType = BEAUTY_AGENT_TYPES[beautyProfile.value.beautyCategory === 'multi' ? 'beauty_expert' : `${beautyProfile.value.beautyCategory}_expert` as BeautyAgentType]
  const template = currentType?.welcomeTemplate || 'Bonjour ! Je suis {agentName}, conseillère beauté chez {shopName}. Comment puis-je vous aider ?'
  const name = agentForm.value.name || currentType?.defaultName || 'Rose'
  
  return template
    .replace('{agentName}', name)
    .replace('{shopName}', 'votre boutique')
}

const getWelcomeMessageHelper = () => {
  const helpers = {
    skincare: 'Message accueillant pour rassurer sur l\'expertise peau et personnalisation.',
    makeup: 'Message inspirant pour mettre en valeur l\'expertise makeup et créativité.',
    fragrance: 'Message raffiné pour souligner l\'expertise parfums et personnalisation olfactive.',
    haircare: 'Message bienveillant pour rassurer sur l\'expertise capillaire et soins adaptés.',
    bodycare: 'Message apaisant pour mettre en valeur l\'expertise bien-être et rituels personnalisés.',
    multi: 'Message polyvalent pour souligner l\'expertise beauté transversale.'
  }
  return helpers[beautyProfile.value.beautyCategory] || helpers.multi
}

const getActivationHelper = () => {
  const helpers = {
    skincare: 'Votre esthéticienne IA sera disponible dès sa création',
    makeup: 'Votre experte makeup IA sera disponible dès sa création',
    fragrance: 'Votre conseillère parfums IA sera disponible dès sa création',
    haircare: 'Votre experte capillaire IA sera disponible dès sa création',
    bodycare: 'Votre experte soins corps IA sera disponible dès sa création',
    multi: 'Votre Conseillère IA sera disponible dès sa création'
  }
  return helpers[beautyProfile.value.beautyCategory] || helpers.multi
}

// MÉTHODES
const loadBeautyProfile = async () => {
  try {
    const user = authStore.user
    if (!user?.id) return
    
    if (user?.shop?.beauty_category) {
      beautyProfile.value.beautyCategory = user.shop.beauty_category as BeautyCategory
    }
    
    console.log('Beauty profile chargé:', beautyProfile.value)
  } catch (error) {
    console.error('Erreur chargement beauty profile:', error)
  }
}

const refreshAgents = async () => {
  await fetchAgents()
}

// ✅ MODAL CRÉATION AVEC NOUVEAU SYSTÈME COÛT
const openCreateModal = () => {
  if (trialExpired.value) {
    alert(`❌ Votre essai gratuit de ${planDetails.value.trialDays} jours est terminé.\n\nPassez au plan Starter (${planDetails.value.monthlyPrice}€/mois) pour continuer à utiliser ChatSeller et créer vos ${getAgentTypePlural().toLowerCase()}.`)
    router.push('/billing')
    return
  }

  if (!canCreateAgent.value) {
    alert(`❌ Impossible de créer un nouvel agent.\n\nVérifiez vos quotas ou contactez le support.`)
    return
  }

  // ✅ NOUVEAU : Confirmation coût si > 1 agent
  if (agents.value.length >= 1) {
    const additionalCost = 10
    const newTotalCost = monthlyAgentsCost.value + additionalCost
    const confirmed = confirm(
      `💡 Agents illimités dans votre plan ${planDetails.value.name}\n\n` +
      `Coût actuel : ${monthlyAgentsCost.value}€/mois (${agents.value.length} agent${agents.value.length > 1 ? 's' : ''})\n` +
      `Nouveau coût : ${newTotalCost}€/mois (${agents.value.length + 1} agents)\n\n` +
      `Souhaitez-vous créer cette nouvelle ${getAgentTypeSingular()} pour +${additionalCost}€/mois ?`
    )
    
    if (!confirmed) {
      return
    }
  }

  showCreateModal.value = true
  
  // Pré-remplir avec le type approprié selon la beautyCategory
  const currentType = beautyAgentTypes.value[0] || beautyAgentTypes.value.find(t => t.value.includes(beautyProfile.value.beautyCategory))
  if (currentType) {
    agentForm.value = {
      name: currentType.defaultName,
      type: currentType.value as AgentType,
      personality: 'friendly',
      description: currentType.defaultDescription,
      welcomeMessage: currentType.welcomeTemplate
        .replace('{agentName}', currentType.defaultName)
        .replace('{shopName}', 'votre boutique'),
      fallbackMessage: '',
      isActive: true
    }
  }
}

const selectAgentType = (type: string) => {
  agentForm.value.type = type as AgentType
  
  const selectedType = beautyAgentTypes.value.find(t => t.value === type)
  
  if (selectedType) {
    if (!agentForm.value.name || agentForm.value.name === beautyAgentTypes.value[0]?.defaultName) {
      agentForm.value.name = selectedType.defaultName
    }
    agentForm.value.description = selectedType.defaultDescription
    agentForm.value.welcomeMessage = selectedType.welcomeTemplate
      .replace('{agentName}', agentForm.value.name || selectedType.defaultName)
      .replace('{shopName}', 'votre boutique')
  }
}

const selectPersonality = (personality: string) => {
  agentForm.value.personality = personality as PersonalityType
}

const onNameChange = () => {
  if (agentForm.value.name && agentForm.value.welcomeMessage) {
    const selectedType = beautyAgentTypes.value.find(t => t.value === agentForm.value.type)
    if (selectedType) {
      agentForm.value.welcomeMessage = selectedType.welcomeTemplate
        .replace('{agentName}', agentForm.value.name)
        .replace('{shopName}', 'votre boutique')
    }
  }
}

const generateDescription = async () => {
  if (!agentForm.value.name || !agentForm.value.type) return
  
  generatingDescription.value = true
  
  try {
    await new Promise(resolve => setTimeout(resolve, 1500))
    
    const selectedType = beautyAgentTypes.value.find(t => t.value === agentForm.value.type)
    if (selectedType) {
      agentForm.value.description = `${agentForm.value.name} est votre ${selectedType.label.toLowerCase()} experte et empathique. ${selectedType.defaultDescription}`
    }
    
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
    alert(`❌ Votre essai gratuit est terminé. Passez au plan Starter pour modifier vos ${getAgentTypePlural().toLowerCase()}.`)
    return
  }

  editingAgent.value = agent
  agentForm.value = {
    name: agent.name,
    type: agent.type,
    personality: agent.personality || 'friendly',
    description: agent.description || '',
    welcomeMessage: agent.welcomeMessage || '',
    fallbackMessage: agent.fallbackMessage || '',
    isActive: agent.isActive
  }
  activeAgentMenu.value = null
}

// ✅ NOUVEAU : Duplication avec confirmation coût
const duplicateAgentAction = async (agent: Agent) => {
  if (trialExpired.value) {
    alert(`❌ Votre essai gratuit est terminé. Passez au plan Starter pour dupliquer vos ${getAgentTypePlural().toLowerCase()}.`)
    return
  }

  if (!canCreateAgent.value) {
    alert(`❌ Impossible de dupliquer cet agent. Vérifiez vos quotas.`)
    return
  }
  
  // Confirmation avec coût
  const additionalCost = 10
  const newTotalCost = monthlyAgentsCost.value + additionalCost
  const confirmed = confirm(
    `🔄 Dupliquer "${agent.name}" ?\n\n` +
    `Coût actuel : ${monthlyAgentsCost.value}€/mois (${agents.value.length} agent${agents.value.length > 1 ? 's' : ''})\n` +
    `Nouveau coût : ${newTotalCost}€/mois (${agents.value.length + 1} agents)\n\n` +
    `Cette duplication ajoutera +${additionalCost}€/mois à votre facture.`
  )
  
  if (!confirmed) {
    return
  }
  
  activeAgentMenu.value = null
  const result = await duplicateAgent(agent.id)
  if (result.success) {
    console.log('Agent dupliqué avec succès - nouveau coût:', newTotalCost, '€/mois')
  }
}

const toggleAgentStatusAction = async (agent: Agent) => {
  if (trialExpired.value) {
    alert(`❌ Votre essai gratuit est terminé. Passez au plan Starter pour gérer vos ${getAgentTypePlural().toLowerCase()}.`)
    return
  }

  activeAgentMenu.value = null
  const result = await toggleAgentStatus(agent.id, !agent.isActive)
  if (result.success) {
    console.log(`Agent ${agent.isActive ? 'désactivé' : 'activé'} avec succès`)
  }
}

// ✅ NOUVEAU : Suppression avec calcul économie
const deleteAgentAction = async (agent: Agent) => {
  if (trialExpired.value) {
    alert(`❌ Votre essai gratuit est terminé. Passez au plan Starter pour gérer vos ${getAgentTypePlural().toLowerCase()}.`)
    return
  }

  const savings = agents.value.length > 1 ? 10 : 0
  const newTotalCost = Math.max(0, monthlyAgentsCost.value - savings)
  
  const confirmMessage = savings > 0 
    ? `🗑️ Supprimer "${agent.name}" ?\n\nÉconomie : -${savings}€/mois\nNouveau coût total : ${newTotalCost}€/mois\n\nCette action est irréversible.`
    : `🗑️ Supprimer "${agent.name}" ?\n\nCette action est irréversible.`

  if (confirm(confirmMessage)) {
    activeAgentMenu.value = null
    const result = await deleteAgent(agent.id)
    if (result.success) {
      console.log('Agent supprimé avec succès')
      if (savings > 0) {
        console.log(`Économie mensuelle : ${savings}€`)
      }
    }
  }
}

const configureAgent = async (agent: Agent) => {
  console.log('🔄 Navigation vers configuration:', agent.id, agent.name)
  
  if (trialExpired.value) {
    alert(`❌ Votre essai gratuit est terminé.\n\nPassez au plan Starter pour accéder à la configuration de vos ${getAgentTypePlural().toLowerCase()}.`)
    router.push('/billing')
    return
  }

  activeAgentMenu.value = null
  
  try {
    await navigateTo(`/agent-ia/${agent.id}`)
  } catch (navigationError) {
    console.warn('⚠️ Erreur navigation:', navigationError)
    window.location.href = `/agent-ia/${agent.id}`
  }
}

const testAgent = async (agent: Agent) => {
  if (trialExpired.value) {
    alert(`❌ Votre essai gratuit est terminé.\n\nPassez au plan Starter pour tester vos ${getAgentTypePlural().toLowerCase()}.`)
    router.push('/billing')
    return
  }
  
  if (!canTestAgents.value) {
    alert('❌ La fonctionnalité de test est réservée aux utilisateurs des plans payants.')
    router.push('/billing')
    return
  }
  
  console.log('🧪 Redirection vers test playground pour agent:', agent.id, agent.name)
  
  try {
    await navigateTo({
      path: `/agent-ia/${agent.id}`,
      query: { 
        tab: 'playground'
      }
    })
    
    console.log('✅ Navigation vers playground réussie')
    
  } catch (navigationError) {
    console.warn('⚠️ Erreur navigation:', navigationError)
    window.location.href = `/agent-ia/${agent.id}?tab=playground`
  }
}

// ✅ SAUVEGARDE AVEC INCRÉMENT QUOTA
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
      // ✅ NOUVEAU : Vérifier quota avant création
      const quotaCheck = checkQuotaBeforeAction('agents', 1)
      if (!quotaCheck.allowed && quotaCheck.error) {
        alert(quotaCheck.error)
        return
      }
      
      const result = await createAgent(agentForm.value)
      if (result.success) {
        console.log('Agent créé avec succès')
        
        // ✅ NOUVEAU : Incrémenter quota agents (pour tracking)
        await incrementQuota('agents', 1)
        
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
  agentForm.value = {
    name: '',
    type: 'general' as AgentType,
    personality: 'professional',
    description: '',
    welcomeMessage: '',
    fallbackMessage: '',
    isActive: true
  }
}

const handleAvatarError = (event: Event) => {
  const img = event.target as HTMLImageElement
  const name = encodeURIComponent('Agent')
  const color = getColorScheme()
  img.src = `https://ui-avatars.com/api/?name=${name}&background=${color}&color=fff&size=200&rounded=true&font-size=0.4`
}

const handleClickOutside = (event: Event) => {
  const target = event.target as Element
  if (!target.closest('.dropdown')) {
    activeAgentMenu.value = null
  }
}

const getStatusBadgeClass = (isActive: boolean) => {
  if (trialExpired.value) {
    return 'bg-red-100 text-red-800'
  }
  return isActive ? 'bg-green-100 text-green-800' : 'bg-gray-100 text-gray-800'
}

// LIFECYCLE
onMounted(async () => {
  console.log('🚀 [agent-ia/index] Page montée - Système beauté adaptatif avec quotas')
  console.log('👤 Utilisateur:', authStore.user?.email)
  console.log('📋 Plan:', planDetails.value.name, '- Coût agents:', monthlyAgentsCost.value, '€/mois')
  
  document.addEventListener('click', handleClickOutside)
  
  // Charger le profil beauté en premier
  await loadBeautyProfile()
  
  // Puis charger les agents
  await fetchAgents()
  
  console.log('✅ Initialisation complète - Agents:', agents.value.length, '/ Coût:', monthlyAgentsCost.value, '€/mois')
})

onUnmounted(() => {
  document.removeEventListener('click', handleClickOutside)
})

useHead({
  title: computed(() => `${getPageTitle()} - ChatSeller Dashboard`),
  meta: [
    { 
      name: 'description', 
      content: computed(() => `${getPageDescription()} - Plan ${planDetails.value.name} - ${agents.value.length} agent${agents.value.length > 1 ? 's' : ''} actif${agents.value.length > 1 ? 's' : ''}`) 
    }
  ]
})
</script>

<style scoped>
/* MODERN COMPONENTS BEAUTÉ */
.agent-card {
  @apply bg-white rounded-xl shadow-sm border border-gray-200 p-6 transition-all hover:shadow-md relative;
  backdrop-filter: blur(10px);
  background: rgba(255, 255, 255, 0.95);
}

.agent-card:hover {
  @apply shadow-lg;
  transform: translateY(-2px);
}

.agent-avatar {
  @apply w-12 h-12 rounded-full flex items-center justify-center;
}

.status-badge {
  @apply inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium;
}

.agent-menu-btn {
  @apply p-2 text-gray-400 hover:text-gray-600 hover:bg-gray-100 rounded-lg transition-colors;
}

.dropdown-menu {
  @apply absolute right-0 top-10 mt-1 w-48 bg-white rounded-lg shadow-lg border border-gray-200 py-1 z-50;
  animation: fadeInScale 0.15s ease-out;
  transform-origin: top right;
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
  @apply inline-flex items-center px-4 py-2 text-white text-sm font-medium rounded-lg hover:opacity-90 transition-all;
  transform: translateY(0);
}

.btn-primary:hover {
  transform: translateY(-1px);
}

.btn-secondary {
  @apply inline-flex items-center px-4 py-2 border border-gray-300 rounded-lg text-sm font-medium text-gray-700 bg-white hover:bg-gray-50 transition-all;
  transform: translateY(0);
}

.btn-secondary:hover {
  transform: translateY(-1px);
}

.input-modern {
  @apply px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-colors text-sm;
}

.input-modern:focus {
  @apply ring-opacity-50;
}

/* MODAL STYLES BEAUTÉ */
.modal-overlay {
  @apply fixed inset-0 z-50 overflow-y-auto bg-gray-900 bg-opacity-50 backdrop-blur-sm flex items-center justify-center p-4;
  animation: fadeIn 0.2s ease-out;
}

.modal-content {
  @apply bg-white rounded-xl shadow-xl max-w-lg w-full max-h-[90vh] overflow-y-auto;
  animation: modalSlideIn 0.2s ease-out;
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

/* UTILS */
.line-clamp-2 {
  display: -webkit-box;
  -webkit-line-clamp: 2;
  -webkit-box-orient: vertical;
  overflow: hidden;
}

/* ANIMATIONS BEAUTÉ */
@keyframes fadeIn {
  from { opacity: 0; }
  to { opacity: 1; }
}

@keyframes fadeInScale {
  from {
    opacity: 0;
    transform: scale(0.95) translateY(-10px);
  }
  to {
    opacity: 1;
    transform: scale(1) translateY(0);
  }
}

@keyframes modalSlideIn {
  from {
    opacity: 0;
    transform: scale(0.95) translateY(-20px);
  }
  to {
    opacity: 1;
    transform: scale(1) translateY(0);
  }
}

@keyframes spin {
  from { transform: rotate(0deg); }
  to { transform: rotate(360deg); }
}

@keyframes pulse {
  0%, 100% { opacity: 1; }
  50% { opacity: .5; }
}

.animate-spin {
  animation: spin 1s linear infinite;
}

.animate-pulse {
  animation: pulse 2s cubic-bezier(0.4, 0, 0.6, 1) infinite;
}

/* RESPONSIVE ADAPTATIONS BEAUTÉ */
@media (max-width: 640px) {
  .agent-card {
    @apply p-4;
  }
  
  .modal-body {
    @apply p-4;
  }
  
  .modal-header {
    @apply p-4;
  }
  
  .modal-footer {
    @apply p-4;
  }
  
  .stat-value {
    @apply text-base;
  }
  
  .agent-avatar {
    @apply w-10 h-10;
  }
}

/* BEAUTY SPECIFIC GRADIENTS */
.beauty-gradient-pink {
  background: linear-gradient(135deg, #ec4899 0%, #f43f5e 100%);
}

.beauty-gradient-purple {
  background: linear-gradient(135deg, #8b5cf6 0%, #ec4899 100%);
}

.beauty-gradient-violet {
  background: linear-gradient(135deg, #7c3aed 0%, #8b5cf6 100%);
}

.beauty-gradient-amber {
  background: linear-gradient(135deg, #f59e0b 0%, #ea580c 100%);
}

.beauty-gradient-teal {
  background: linear-gradient(135deg, #14b8a6 0%, #06b6d4 100%);
}

.beauty-gradient-rose {
  background: linear-gradient(135deg, #f43f5e 0%, #ec4899 100%);
}

/* ENHANCED BUTTON STATES */
button:disabled {
  @apply cursor-not-allowed opacity-50;
  transform: none !important;
}

button:focus {
  @apply outline-none;
}

/* QUOTA ALERT ANIMATIONS */
.quota-alert {
  animation: slideInFromTop 0.3s ease-out;
}

@keyframes slideInFromTop {
  from {
    opacity: 0;
    transform: translateY(-20px);
  }
  to {
    opacity: 1;
    transform: translateY(0);
  }
}

/* ACCESSIBILITY */
@media (prefers-reduced-motion: reduce) {
  * {
    animation-duration: 0.01ms !important;
    animation-iteration-count: 1 !important;
    transition-duration: 0.01ms !important;
    transform: none !important;
  }
}

/* HIGH CONTRAST MODE */
@media (prefers-contrast: high) {
  .agent-card {
    @apply border-2 border-gray-900;
  }
  
  .btn-primary {
    @apply border-2 border-white;
  }
  
  .status-badge {
    @apply border border-current;
  }
}

/* DARK MODE SUPPORT */
@media (prefers-color-scheme: dark) {
  .modal-overlay {
    @apply bg-gray-800 bg-opacity-75;
  }
  
  .modal-content {
    @apply bg-gray-800 text-white;
  }
  
  .agent-card {
    @apply bg-gray-800 border-gray-700 text-white;
    background: rgba(31, 41, 55, 0.95);
  }
}

/* PRINT STYLES */
@media print {
  .modal-overlay,
  .dropdown-menu,
  button,
  .quota-alert {
    @apply hidden;
  }
  
  .agent-card {
    @apply break-inside-avoid shadow-none border border-gray-300;
  }
  
  .beauty-gradient-pink,
  .beauty-gradient-purple,
  .beauty-gradient-violet,
  .beauty-gradient-amber,
  .beauty-gradient-teal,
  .beauty-gradient-rose {
    background: #f3f4f6 !important;
    color: #111827 !important;
  }
}

/* CUSTOM SCROLLBARS BEAUTÉ */
::-webkit-scrollbar {
  width: 6px;
}

::-webkit-scrollbar-track {
  background: #f1f5f9;
}

::-webkit-scrollbar-thumb {
  background: linear-gradient(135deg, #ec4899, #f43f5e);
  border-radius: 3px;
}

::-webkit-scrollbar-thumb:hover {
  background: linear-gradient(135deg, #db2777, #e11d48);
}

/* LOADING STATES */
.loading-shimmer {
  background: linear-gradient(90deg, #f0f0f0 25%, #e0e0e0 50%, #f0f0f0 75%);
  background-size: 200% 100%;
  animation: shimmer 2s infinite;
}

@keyframes shimmer {
  0% {
    background-position: -200% 0;
  }
  100% {
    background-position: 200% 0;
  }
}

/* FOCUS RINGS ADAPTÉS */
.focus-ring-pink:focus {
  @apply ring-2 ring-pink-500 ring-opacity-50;
}

.focus-ring-purple:focus {
  @apply ring-2 ring-purple-500 ring-opacity-50;
}

.focus-ring-violet:focus {
  @apply ring-2 ring-violet-500 ring-opacity-50;
}

.focus-ring-amber:focus {
  @apply ring-2 ring-amber-500 ring-opacity-50;
}

.focus-ring-teal:focus {
  @apply ring-2 ring-teal-500 ring-opacity-50;
}

.focus-ring-rose:focus {
  @apply ring-2 ring-rose-500 ring-opacity-50;
}
</style>