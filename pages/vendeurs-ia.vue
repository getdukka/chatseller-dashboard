<!-- pages/vendeurs-ia.vue - VERSION COMPLÈTE AVEC NAVIGATION CORRIGÉE -->
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
              :disabled="!canCreateAgent"
              class="inline-flex items-center px-4 py-2 bg-blue-600 text-white text-sm font-medium rounded-lg hover:bg-blue-700 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
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

    <!-- Error Banner -->
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
      <!-- Plan Limitation Banner -->
      <div v-if="subscriptionPlan === 'starter'" class="mb-8">
        <div class="bg-gradient-to-r from-blue-700 to-purple-500 rounded-xl shadow-lg overflow-hidden">
          <div class="px-8 py-6 text-white relative">
            <div class="flex items-center justify-between">
              <div>
                <h2 class="text-xl font-bold mb-2">⚡ Plan Starter - Limité à 1 Vendeur IA</h2>
                <p class="text-orange-100 text-base mb-4">
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
              <div class="hidden lg:block">
                <div class="w-20 h-20 bg-white bg-opacity-10 rounded-full flex items-center justify-center backdrop-blur-sm">
                  <svg class="w-10 h-10 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M5 3v4M3 5h4M6 17v4m-2-2h4m5-16l2.286 6.857L21 12l-5.714 2.143L13 21l-2.286-6.857L5 12l5.714-2.143L13 3z"/>
                  </svg>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      <!-- Loading State -->
      <div v-if="loading && agents.length === 0" class="text-center py-16">
        <div class="inline-flex items-center space-x-3">
          <svg class="animate-spin h-8 w-8 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15"/>
          </svg>
          <span class="text-lg text-gray-600">Chargement des agents IA...</span>
        </div>
      </div>

      <!-- Agents Grid -->
      <div v-else-if="agents.length > 0" class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        <div
          v-for="agent in agents"
          :key="agent.id"
          class="agent-card"
          :class="{ 'agent-card-active': agent.isActive }"
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
              <span :class="getStatusBadgeClass(agent.isActive)" class="status-badge">
                {{ agent.isActive ? 'Actif' : 'Inactif' }}
              </span>
              
              <div class="dropdown relative">
                <button @click="toggleAgentMenu(agent.id)" class="agent-menu-btn">
                  <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 5v.01M12 12v.01M12 19v.01M12 6a1 1 0 110-2 1 1 0 010 2zm0 7a1 1 0 110-2 1 1 0 010 2zm0 7a1 1 0 110-2 1 1 0 010 2z"/>
                  </svg>
                </button>
                
                <div v-if="activeAgentMenu === agent.id" class="dropdown-menu">
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

          <!-- Agent Stats -->
          <div class="grid grid-cols-2 gap-4 mb-4">
            <div class="stat-item">
              <div class="stat-value">{{ agent.stats.conversations }}</div>
              <div class="stat-label">Conversations</div>
            </div>
            <div class="stat-item">
              <div class="stat-value">{{ agent.stats.conversions }}</div>
              <div class="stat-label">Conversions</div>
            </div>
          </div>

          <!-- Agent Actions -->
          <div class="flex items-center space-x-2">
            <button 
              @click="configureAgent(agent)"
              class="flex-1 btn-secondary"
            >
              <svg class="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M10.325 4.317c.426-1.756 2.924-1.756 3.35 0a1.724 1.724 0 002.573 1.066c1.543-.94 3.31.826 2.37 2.37a1.724 1.724 0 001.065 2.572c1.756.426 1.756 2.924 0 3.35a1.724 1.724 0 00-1.066 2.573c.94 1.543-.826 3.31-2.37 2.37a1.724 1.724 0 00-2.572 1.065c-.426 1.756-2.924 1.756-3.35 0a1.724 1.724 0 00-2.573-1.066c-1.543.94-3.31-.826-2.37-2.37a1.724 1.724 0 00-1.065-2.572c-1.756-.426-1.756-2.924 0-3.35a1.724 1.724 0 001.066-2.573c-.94-1.543.826-3.31 2.37-2.37.996.608 2.296.07 2.572-1.065z"/>
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M15 12a3 3 0 11-6 0 3 3 0 016 0z"/>
              </svg>
              Configurer
            </button>
            <button 
              @click="testAgent(agent)"
              :disabled="!isPaidUser"
              class="flex-1 btn-primary"
              :class="{ 'opacity-50 cursor-not-allowed': !isPaidUser }"
              :title="!isPaidUser ? 'Réservé aux utilisateurs payants (Starter/Pro)' : ''"
            >
              <svg class="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z"/>
              </svg>
              Tester
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
        <h3 class="mt-4 text-xl font-medium text-gray-900">Créez votre premier Vendeur IA</h3>
        <p class="mt-2 text-gray-500 max-w-md mx-auto">
          Commencez par créer un agent IA commercial personnalisé pour transformer vos visiteurs en clients.
        </p>
        <div class="mt-8">
          <button
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

    <!-- Create/Edit Agent Modal -->
    <div v-if="showCreateModal || editingAgent" class="modal-overlay" @click.self="closeModal">
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
          <div class="space-y-6">
            <!-- Basic Info -->
            <div>
              <label class="block text-sm font-medium text-gray-700 mb-2">Nom du Vendeur IA *</label>
              <input
                v-model="agentForm.name"
                type="text"
                class="input-modern w-full"
                placeholder="Ex: Assistant vente produits tech"
              >
            </div>
            
            <div>
              <label class="block text-sm font-medium text-gray-700 mb-2">Type de vendeur</label>
              <select v-model="agentForm.type" class="input-modern w-full">
                <option value="general">Vendeur généraliste</option>
                <option value="product_specialist">Spécialiste produit</option>
                <option value="support">Support & SAV</option>
                <option value="upsell">Upsell & Cross-sell</option>
              </select>
            </div>
            
            <div>
              <label class="block text-sm font-medium text-gray-700 mb-2">Description</label>
              <textarea
                v-model="agentForm.description"
                rows="3"
                class="input-modern w-full"
                placeholder="Décrivez le rôle et les objectifs de ce vendeur IA..."
              ></textarea>
            </div>

            <!-- Personality -->
            <div>
              <label class="block text-sm font-medium text-gray-700 mb-2">Personnalité</label>
              <select v-model="agentForm.personality" class="input-modern w-full">
                <option value="professional">Professionnel</option>
                <option value="friendly">Amical</option>
                <option value="expert">Expert technique</option>
                <option value="casual">Décontracté</option>
              </select>
            </div>

            <!-- Messages -->
            <div>
              <label class="block text-sm font-medium text-gray-700 mb-2">Message d'accueil</label>
              <textarea
                v-model="agentForm.welcomeMessage"
                rows="2"
                class="input-modern w-full"
                placeholder="Bonjour ! Comment puis-je vous aider aujourd'hui ?"
              ></textarea>
            </div>

            <div>
              <label class="block text-sm font-medium text-gray-700 mb-2">Message de fallback</label>
              <textarea
                v-model="agentForm.fallbackMessage"
                rows="2"
                class="input-modern w-full"
                placeholder="Je transmets votre question à notre équipe, un conseiller vous recontactera bientôt."
              ></textarea>
            </div>

            <!-- Activation -->
            <div class="flex items-center justify-between p-4 bg-gray-50 rounded-lg">
              <div>
                <h4 class="text-sm font-medium text-gray-900">Activer immédiatement</h4>
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
            {{ saving ? 'Sauvegarde...' : (editingAgent ? 'Mettre à jour' : 'Créer le Vendeur IA') }}
          </button>
        </div>
      </div>
    </div>

    <!-- Test Chat Modal -->
    <div v-if="showTestModal && selectedAgent" class="fixed inset-0 z-50 overflow-y-auto bg-gray-900 bg-opacity-50 backdrop-blur-sm flex items-center justify-center p-4">
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
          <p class="text-xs text-gray-500 mt-2">Test en direct avec IA • Réservé aux utilisateurs payants</p>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, computed, onMounted, onUnmounted, nextTick } from 'vue'
import { useAuthStore } from '~/stores/auth'
import { useAgents, type Agent, type CreateAgentData, type UpdateAgentData } from '~/composables/useAgents'

// ✅ PAGE META
definePageMeta({
  middleware: 'auth',
  layout: 'default'
})

// ✅ TYPES POUR LE CHAT
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
const {
  agents,
  loading,
  saving,
  error,
  planLimit,
  canCreateAgent,
  planLimitReached,
  fetchAgents,
  createAgent,
  updateAgent,
  deleteAgent,
  toggleAgentStatus,
  duplicateAgent,
  getTypeLabel,
  getPersonalityLabel,
  getAgentIcon,
  getAvatarClass,
  getStatusBadgeClass,
  clearError
} = useAgents()

// ✅ REACTIVE STATE
const showCreateModal = ref(false)
const editingAgent = ref<Agent | null>(null)
const activeAgentMenu = ref<string | null>(null)
const showTestModal = ref(false)
const selectedAgent = ref<Agent | null>(null)

// ✅ CHAT TEST STATE
const chatMessages = ref<ChatMessage[]>([])
const testMessage = ref('')
const sendingMessage = ref(false)
const chatContainer = ref<HTMLElement | null>(null)

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

// ✅ COMPUTED
const subscriptionPlan = computed(() => {
  return authStore.user?.shop?.subscription_plan || 'starter'
})

const isPaidUser = computed(() => {
  const plan = subscriptionPlan.value
  return plan === 'starter' || plan === 'pro'
})

// ✅ ACTION METHODS
const refreshAgents = async () => {
  await fetchAgents()
}

const openCreateModal = () => {
  if (!canCreateAgent.value) {
    alert(`Plan ${subscriptionPlan.value} limité à ${planLimit.value} agent(s). Passez au plan supérieur pour en créer plus.`)
    return
  }
  showCreateModal.value = true
}

const toggleAgentMenu = (agentId: string) => {
  activeAgentMenu.value = activeAgentMenu.value === agentId ? null : agentId
}

const editAgent = (agent: Agent) => {
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
  if (!canCreateAgent.value) {
    alert(`Plan ${subscriptionPlan.value} limité à ${planLimit.value} agent(s). Passez au plan supérieur pour en créer plus.`)
    return
  }

  activeAgentMenu.value = null
  const result = await duplicateAgent(agent.id)
  
  if (!result.success) {
    console.error('Erreur duplication:', error.value)
  }
}

const toggleAgentStatusAction = async (agent: Agent) => {
  activeAgentMenu.value = null
  const result = await toggleAgentStatus(agent.id, !agent.isActive)
  
  if (!result.success) {
    console.error('Erreur modification statut:', error.value)
  }
}

const deleteAgentAction = async (agent: Agent) => {
  if (confirm('Êtes-vous sûr de vouloir supprimer ce vendeur IA ?')) {
    activeAgentMenu.value = null
    const result = await deleteAgent(agent.id)
    
    if (!result.success) {
      console.error('Erreur suppression:', error.value)
    }
  }
}

// ✅ NAVIGATION VERS CONFIGURATION - COMPLÈTEMENT REÉCRITE ET ULTRA-ROBUSTE
const configureAgent = async (agent: Agent) => {
  console.log('🔄 [configureAgent] Navigation vers configuration:', agent.id, agent.name)
  
  activeAgentMenu.value = null
  
  // ✅ VALIDATION DE L'ID AGENT
  if (!agent.id || agent.id === 'undefined' || agent.id === 'null') {
    console.error('❌ [configureAgent] ID agent invalide:', agent.id)
    alert('Erreur: ID agent invalide')
    return
  }
  
  try {
    // ✅ NAVIGATION VERS LA ROUTE DE CONFIGURATION ALTERNATIVE
    console.log('🚀 [configureAgent] Navigation vers /agent-config...')
    
    await navigateTo({
      path: '/agent-config',
      query: {
        id: agent.id,
        name: agent.name,
        type: agent.type,
        description: agent.description || '',
        welcomeMessage: agent.welcomeMessage || '',
        fallbackMessage: agent.fallbackMessage || ''
      }
    })
    
    console.log('✅ [configureAgent] Navigation réussie vers page de configuration')
    
  } catch (navigationError) {
    console.warn('⚠️ [configureAgent] Erreur navigateTo, tentative fallback:', navigationError)
    
    // ✅ FALLBACK AVEC WINDOW.LOCATION
    const queryParams = new URLSearchParams({
      id: agent.id,
      name: agent.name,
      type: agent.type,
      ...(agent.description && { description: agent.description }),
      ...(agent.welcomeMessage && { welcomeMessage: agent.welcomeMessage }),
      ...(agent.fallbackMessage && { fallbackMessage: agent.fallbackMessage })
    })
    
    const targetUrl = `/agent-config?${queryParams.toString()}`
    console.log('🔗 [configureAgent] URL de fallback:', targetUrl)
    
    setTimeout(() => {
      window.location.href = targetUrl
    }, 100)
  }
}

const testAgent = (agent: Agent) => {
  if (!isPaidUser.value) {
    alert('La fonctionnalité de test est réservée aux utilisateurs des plans Starter et Pro.')
    return
  }
  
  showTestModal.value = true
  selectedAgent.value = agent
  
  // Initialiser la conversation
  chatMessages.value = [
    {
      id: Date.now().toString(),
      role: 'assistant',
      content: agent.welcomeMessage || 'Bonjour ! Comment puis-je vous aider aujourd\'hui ?',
      timestamp: new Date()
    }
  ]
}

// ✅ ENVOYER MESSAGE DE TEST
const sendTestMessage = async () => {
  if (!testMessage.value.trim() || sendingMessage.value || !selectedAgent.value) return
  
  const userMessage = testMessage.value.trim()
  testMessage.value = ''
  sendingMessage.value = true
  
  // Ajouter le message utilisateur
  const userMsg: ChatMessage = {
    id: Date.now().toString(),
    role: 'user',
    content: userMessage,
    timestamp: new Date()
  }
  chatMessages.value.push(userMsg)
  
  // Ajouter un message de chargement pour l'IA
  const loadingMsg: ChatMessage = {
    id: (Date.now() + 1).toString(),
    role: 'assistant',
    content: 'L\'IA réfléchit...',
    timestamp: new Date(),
    loading: true
  }
  chatMessages.value.push(loadingMsg)
  
  // Scroll vers le bas
  await nextTick()
  if (chatContainer.value) {
    chatContainer.value.scrollTop = chatContainer.value.scrollHeight
  }
  
  try {
    // ✅ SIMULATION DE RÉPONSE IA
    await new Promise(resolve => setTimeout(resolve, 1000))
    
    const aiResponses = [
      `Merci pour votre question ! En tant que ${selectedAgent.value.name}, je peux vous aider avec cela.`,
      'C\'est une excellente question ! Laissez-moi vous expliquer...',
      'Je comprends votre besoin. Voici ce que je peux vous proposer...',
      'Parfait ! C\'est exactement le type de question pour laquelle je suis conçu.'
    ]
    
    const randomResponse = aiResponses[Math.floor(Math.random() * aiResponses.length)]
    
    // Remplacer le message de chargement par la vraie réponse
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
    
    // Remplacer par un message d'erreur
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
    
    // Scroll vers le bas
    await nextTick()
    if (chatContainer.value) {
      chatContainer.value.scrollTop = chatContainer.value.scrollHeight
    }
  }
}

const saveAgent = async () => {
  if (!agentForm.value.name) return

  let result
  
  if (editingAgent.value) {
    result = await updateAgent(editingAgent.value.id, agentForm.value as UpdateAgentData)
  } else {
    result = await createAgent(agentForm.value)
  }

  if (result.success) {
    closeModal()
  } else {
    console.error('Erreur sauvegarde:', error.value)
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

// Close dropdown on outside click
const handleClickOutside = (event: Event) => {
  const target = event.target as Element
  if (!target.closest('.dropdown')) {
    activeAgentMenu.value = null
  }
}

// ✅ LIFECYCLE
onMounted(async () => {
  console.log('🚀 [vendeurs-ia] Page montée, chargement des agents...')
  document.addEventListener('click', handleClickOutside)
  await fetchAgents()
})

onUnmounted(() => {
  document.removeEventListener('click', handleClickOutside)
})

// ✅ SEO
useHead({
  title: 'Vendeurs IA - ChatSeller Dashboard'
})
</script>

<style scoped>
/* ✅ MODERN COMPONENTS */
.agent-card {
  @apply bg-white rounded-xl shadow-sm border border-gray-200 p-6 transition-all hover:shadow-md;
}

.agent-card-active {
  @apply border-green-300 bg-green-50/30;
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
  @apply max-w-2xl;
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