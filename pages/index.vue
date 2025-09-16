<!-- pages/index.vue -->
<template>
  <div class="min-h-screen bg-gradient-to-br from-rose-50 via-pink-50 to-purple-50">
    <!-- Welcome Modal Post-Onboarding -->
    <div v-if="showWelcomeModal" class="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
      <div class="bg-white rounded-2xl p-8 max-w-2xl w-full shadow-2xl">
        <div class="text-center">
          <div class="w-20 h-20 bg-gradient-to-br from-rose-100 to-pink-100 rounded-full flex items-center justify-center mx-auto mb-6">
            <svg class="w-10 h-10 text-rose-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M5 13l4 4L19 7"/>
            </svg>
          </div>
          <h2 class="text-2xl font-bold text-gray-900 mb-4">
            {{ getWelcomeTitle() }}
          </h2>
          <p class="text-gray-600 mb-8">
            {{ getWelcomeDescription() }}
          </p>
          <div class="flex flex-col sm:flex-row gap-4 justify-center">
            <button
              @click="navigateToAgentSetup"
              class="px-8 py-3 bg-gradient-to-r from-rose-600 to-pink-600 text-white font-semibold rounded-xl hover:from-rose-700 hover:to-pink-700 transition-all"
            >
              {{ getCreateAgentText() }}
            </button>
            <button
              @click="navigateToKnowledgeBase"
              class="px-8 py-3 bg-white border-2 border-gray-300 text-gray-700 font-semibold rounded-xl hover:bg-gray-50 transition-all"
            >
              {{ getTrainAgentText() }}
            </button>
            <button
              @click="closeWelcomeModal"
              class="px-6 py-3 text-gray-500 hover:text-gray-700 transition-colors"
            >
              Plus tard
            </button>
          </div>
        </div>
      </div>
    </div>

    <!-- Header -->
    <div class="px-4 md:px-8 py-6">
      <div class="flex items-center justify-between">
        <div>
          <h1 class="text-2xl md:text-3xl font-bold text-gray-900">
            {{ greeting }}, {{ userFirstName }}
          </h1>
          <p class="mt-2 text-gray-600">
            {{ getDashboardSubtitle() }}
          </p>
        </div>
        
        <!-- Quick Actions -->
        <div class="flex items-center space-x-2 md:space-x-4">
          <button
            @click="handleRefreshData"
            :disabled="refreshing"
            class="inline-flex items-center px-3 md:px-4 py-2 border border-gray-300 rounded-lg text-sm font-medium text-gray-700 bg-white hover:bg-gray-50 disabled:opacity-50 transition-colors"
          >
            <svg 
              class="w-4 h-4 mr-1 md:mr-2" 
              :class="{ 'animate-spin': refreshing }"
              fill="none" 
              stroke="currentColor" 
              viewBox="0 0 24 24"
            >
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15"/>
            </svg>
            <span class="hidden sm:inline">{{ refreshing ? 'Actualisation...' : 'Actualiser' }}</span>
          </button>
          
          <NuxtLink
            to="/agent-ia"
            class="inline-flex items-center px-3 md:px-4 py-2 bg-gradient-to-r from-rose-600 to-pink-600 text-white text-sm font-medium rounded-lg hover:from-rose-700 hover:to-pink-700 transition-all"
          >
            <svg class="w-4 h-4 mr-1 md:mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M10.325 4.317c.426-1.756 2.924-1.756 3.35 0a1.724 1.724 0 002.573 1.066c1.543-.94 3.31.826 2.37 2.37a1.724 1.724 0 001.065 2.572c1.756.426 1.756 2.924 0 3.35a1.724 1.724 0 00-1.066 2.573c.94 1.543-.826 3.31-2.37 2.37a1.724 1.724 0 00-2.572 1.065c-.426 1.756-2.924 1.756-3.35 0a1.724 1.724 0 00-2.573-1.066c-1.543.94-3.31-.826-2.37-2.37a1.724 1.724 0 00-1.065-2.572c-1.756-.426-1.756-2.924 0-3.35a1.724 1.724 0 001.066-2.573c-.94-1.543.826-3.31 2.37-2.37.996.608 2.296.07 2.572-1.065z"/>
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M15 12a3 3 0 11-6 0 3 3 0 016 0z"/>
            </svg>
            <span class="hidden sm:inline">{{ getConfigureButtonText() }}</span>
            <span class="sm:hidden">Config</span>
          </NuxtLink>
        </div>
      </div>
    </div>

    <!-- Loading State -->
    <div v-if="loadingStats" class="px-4 md:px-8 pb-8">
      <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 md:gap-6 mb-8">
        <div v-for="i in 4" :key="i" class="card-modern animate-pulse">
          <div class="h-24 bg-gray-200 rounded"></div>
        </div>
      </div>
    </div>

    <!-- Main Content -->
    <div v-else class="px-4 md:px-8 pb-8">
      <!-- KPI Cards Contextuelles -->
      <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 md:gap-6 mb-8">
        <!-- Conversations/Conversations Card -->
        <div class="card-modern-gradient from-blue-500 to-blue-600">
          <div class="flex items-center justify-between">
            <div class="text-white">
              <p class="text-blue-100 text-sm font-medium">{{ getConversationsLabel() }}</p>
              <p class="text-2xl md:text-3xl font-bold">{{ dashboardStats.conversations.total }}</p>
              <p class="text-blue-100 text-sm mt-1">
                <span class="text-white font-medium">{{ dashboardStats.conversations.active }}</span> {{ getActiveLabel() }}
              </p>
            </div>
            <div class="p-3 bg-white bg-opacity-20 rounded-xl">
              <svg class="w-8 h-8 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z"/>
              </svg>
            </div>
          </div>
          <div class="mt-4">
            <NuxtLink 
              to="/conversations"
              class="text-white text-sm font-medium hover:text-blue-100 transition-colors inline-flex items-center"
            >
              {{ getViewAllText() }}
              <svg class="w-4 h-4 ml-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 5l7 7-7 7"/>
              </svg>
            </NuxtLink>
          </div>
        </div>

        <!-- Conversions Card -->
        <div class="card-modern-gradient from-green-500 to-green-600">
          <div class="flex items-center justify-between">
            <div class="text-white">
              <p class="text-green-100 text-sm font-medium">{{ getConversionsLabel() }}</p>
              <p class="text-2xl md:text-3xl font-bold">{{ dashboardStats.orders.total }}</p>
              <p class="text-green-100 text-sm mt-1">
                <span class="text-white font-medium">{{ formatConversionRate(dashboardStats.orders.conversionRate) }}</span> conversion
              </p>
            </div>
            <div class="p-3 bg-white bg-opacity-20 rounded-xl">
              <svg class="w-8 h-8 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M16 11V7a4 4 0 00-8 0v4M5 9h14l1 12H4L5 9z"/>
              </svg>
            </div>
          </div>
          <div class="mt-4">
            <NuxtLink 
              to="/orders"
              class="text-white text-sm font-medium hover:text-green-100 transition-colors inline-flex items-center"
            >
              {{ getOrdersLinkText() }}
              <svg class="w-4 h-4 ml-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 5l7 7-7 7"/>
              </svg>
            </NuxtLink>
          </div>
        </div>

        <!-- Revenue Card -->
        <div class="card-modern-gradient from-yellow-500 to-orange-500">
          <div class="flex items-center justify-between">
            <div class="text-white">
              <p class="text-orange-100 text-sm font-medium">Chiffre d'affaires</p>
              <p class="text-2xl md:text-3xl font-bold">{{ formatCurrency(dashboardStats.revenue.total) }}</p>
              <p class="text-orange-100 text-sm mt-1">
                <span class="text-white font-medium">{{ formatCurrency(dashboardStats.revenue.average) }}</span> {{ getAverageBasketLabel() }}
              </p>
            </div>
            <div class="p-3 bg-white bg-opacity-20 rounded-xl">
              <svg class="w-8 h-8 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1"/>
              </svg>
            </div>
          </div>
          <div class="mt-4">
            <NuxtLink 
              to="/analytics"
              class="text-white text-sm font-medium hover:text-orange-100 transition-colors inline-flex items-center"
            >
              Voir analytics 
              <svg class="w-4 h-4 ml-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 5l7 7-7 7"/>
              </svg>
            </NuxtLink>
          </div>
        </div>

        <!-- Insights Spécialisés Card -->
        <div class="card-modern-gradient from-purple-500 to-purple-600">
          <div class="flex items-center justify-between">
            <div class="text-white">
              <p class="text-purple-100 text-sm font-medium">{{ getInsightsLabel() }}</p>
              <p class="text-2xl md:text-3xl font-bold">{{ getTopInsightValue() }}</p>
              <p class="text-purple-100 text-sm mt-1">
                <span class="text-white font-medium">{{ getSecondaryInsight() }}</span>
              </p>
            </div>
            <div class="p-3 bg-white bg-opacity-20 rounded-xl">
              <svg class="w-8 h-8 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                {{ getInsightIcon() }}
              </svg>
            </div>
          </div>
          <div class="mt-4">
            <NuxtLink 
              to="/analytics"
              class="text-purple-100 text-sm font-medium hover:text-purple-200 transition-colors"
            >
              {{ getInsightActionText() }}
            </NuxtLink>
          </div>
        </div>
      </div>

      <!-- Main Content Grid -->
      <div class="grid grid-cols-1 lg:grid-cols-3 gap-4 md:gap-6">
        <!-- Recent Conversations -->
        <div class="card-modern">
          <div class="flex items-center justify-between mb-6">
            <h3 class="text-lg font-semibold text-gray-900">{{ getRecentConversationsTitle() }}</h3>
            <NuxtLink 
              to="/conversations"
              class="text-rose-600 hover:text-rose-700 text-sm font-medium transition-colors"
            >
              {{ getManageConversationsText() }}
            </NuxtLink>
          </div>
          
          <div v-if="recentConversations.length > 0" class="space-y-4">
            <div 
              v-for="conversation in recentConversations" 
              :key="conversation.id"
              class="conversation-item"
              @click="goToConversation(conversation.id)"
            >
              <div class="flex items-center space-x-3">
                <div class="avatar-circle">
                  <span class="text-sm font-medium text-white">
                    {{ getInitials(conversation.visitor) }}
                  </span>
                </div>
                <div class="flex-1 min-w-0">
                  <p class="text-sm font-medium text-gray-900 truncate">
                    {{ conversation.visitor }}
                  </p>
                  <p class="text-xs text-gray-500 truncate">
                    {{ getContextualLastMessage(conversation) }}
                  </p>
                </div>
                <div class="flex flex-col items-end">
                  <div class="text-xs text-gray-400">
                    {{ formatTime(conversation.time) }}
                  </div>
                  <div 
                    v-if="conversation.unread" 
                    class="w-2 h-2 bg-rose-500 rounded-full mt-1"
                  ></div>
                </div>
              </div>
            </div>
          </div>
          
          <div v-else class="empty-state">
            <svg class="w-12 h-12 text-gray-400 mx-auto" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z"/>
            </svg>
            <p class="text-gray-500 text-sm mt-2">{{ getNoConversationsText() }}</p>
            <p class="text-gray-400 text-xs mt-1">{{ getNoConversationsSubtext() }}</p>
          </div>
        </div>

        <!-- Recent Orders -->
        <div class="card-modern">
          <div class="flex items-center justify-between mb-6">
            <h3 class="text-lg font-semibold text-gray-900">{{ getRecentOrdersTitle() }}</h3>
            <NuxtLink 
              to="/orders"
              class="text-rose-600 hover:text-rose-700 text-sm font-medium transition-colors"
            >
              {{ getSalesTrackingText() }}
            </NuxtLink>
          </div>
          
          <div v-if="recentOrders.length > 0" class="space-y-4">
            <div 
              v-for="order in recentOrders" 
              :key="order.id"
              class="order-item"
              @click="goToOrder(order.id)"
            >
              <div class="flex items-center justify-between">
                <div class="flex items-center space-x-3">
                  <div class="w-8 h-8 bg-green-100 rounded-lg flex items-center justify-center">
                    <svg class="w-4 h-4 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M16 11V7a4 4 0 00-8 0v4M5 9h14l1 12H4L5 9z"/>
                    </svg>
                  </div>
                  <div>
                    <p class="text-sm font-medium text-gray-900">
                      {{ order.customer }}
                    </p>
                    <p class="text-xs text-gray-500">
                      {{ getOrderLabel() }} #{{ order.id.slice(-6).toUpperCase() }}
                    </p>
                  </div>
                </div>
                <div class="text-right">
                  <p class="text-sm font-medium text-gray-900">
                    {{ formatCurrency(order.amount) }}
                  </p>
                  <p class="text-xs text-gray-500">
                    {{ formatTime(order.time) }}
                  </p>
                </div>
              </div>
            </div>
          </div>
          
          <div v-else class="empty-state">
            <svg class="w-12 h-12 text-gray-400 mx-auto" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M16 11V7a4 4 0 00-8 0v4M5 9h14l1 12H4L5 9z"/>
            </svg>
            <p class="text-gray-500 text-sm mt-2">{{ getNoOrdersText() }}</p>
            <p class="text-gray-400 text-xs mt-1">{{ getNoOrdersSubtext() }}</p>
          </div>
        </div>

        <!-- Quick Setup Contextuel -->
        <div class="card-modern">
          <div class="flex items-center justify-between mb-6">
            <h3 class="text-lg font-semibold text-gray-900">{{ getQuickSetupTitle() }}</h3>
            <div class="progress-circle">
              <span class="text-xs text-gray-600">{{ configurationProgress }}%</span>
            </div>
          </div>
          
          <div class="space-y-4">
            <div class="setup-item" :class="{ 'completed': setupStatus.knowledgeBase }">
              <NuxtLink to="/knowledge-base" class="flex items-center justify-between w-full">
                <div class="flex items-center space-x-3">
                  <div class="setup-icon" :class="setupStatus.knowledgeBase ? 'bg-green-100 text-green-600' : 'bg-purple-100 text-purple-600'">
                    <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.746 0 3.332.477 4.5 1.253v13C19.832 18.477 18.246 18 16.5 18c-1.746 0-3.332.477-4.5 1.253"/>
                    </svg>
                  </div>
                  <div>
                    <p class="text-sm font-medium text-gray-900">{{ getKnowledgeBaseTitle() }}</p>
                    <p class="text-xs text-gray-500">{{ getKnowledgeBaseSubtitle() }}</p>
                  </div>
                </div>
                <div class="flex items-center">
                  <span class="text-xs text-gray-400">{{ setupStatus.knowledgeBase ? 'Configuré' : 'Vide' }}</span>
                  <svg class="w-4 h-4 text-gray-400 ml-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 5l7 7-7 7"/>
                  </svg>
                </div>
              </NuxtLink>
            </div>

            <div class="setup-item" :class="{ 'completed': setupStatus.agentConfig }">
              <NuxtLink to="/agent-ia" class="flex items-center justify-between w-full">
                <div class="flex items-center space-x-3">
                  <div class="setup-icon" :class="setupStatus.agentConfig ? 'bg-green-100 text-green-600' : 'bg-rose-100 text-rose-600'">
                    <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M10.325 4.317c.426-1.756 2.924-1.756 3.35 0a1.724 1.724 0 002.573 1.066c1.543-.94 3.31.826 2.37 2.37a1.724 1.724 0 001.065 2.572c1.756.426 1.756 2.924 0 3.35a1.724 1.724 0 00-1.066 2.573c.94 1.543-.826 3.31-2.37 2.37a1.724 1.724 0 00-2.572 1.065c-.426 1.756-2.924 1.756-3.35 0a1.724 1.724 0 00-2.573-1.066c-1.543.94-3.31-.826-2.37-2.37a1.724 1.724 0 00-1.065-2.572c-1.756-.426-1.756-2.924 0-3.35a1.724 1.724 0 001.066-2.573c-.94-1.543.826-3.31 2.37-2.37.996.608 2.296.07 2.572-1.065z"/>
                      <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M15 12a3 3 0 11-6 0 3 3 0 016 0z"/>
                    </svg>
                  </div>
                  <div>
                    <p class="text-sm font-medium text-gray-900">{{ getAgentConfigTitle() }}</p>
                    <p class="text-xs text-gray-500">{{ getAgentConfigSubtitle() }}</p>
                  </div>
                </div>
                <div class="flex items-center">
                  <span class="text-xs text-gray-400">{{ setupStatus.agentConfig ? 'Configuré' : 'À configurer' }}</span>
                  <svg class="w-4 h-4 text-gray-400 ml-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 5l7 7-7 7"/>
                  </svg>
                </div>
              </NuxtLink>
            </div>

            <div class="setup-item" :class="{ 'completed': setupStatus.widgetIntegration }">
              <NuxtLink to="/agent-ia?tab=integration" class="flex items-center justify-between w-full">
                <div class="flex items-center space-x-3">
                  <div class="setup-icon" :class="setupStatus.widgetIntegration ? 'bg-green-100 text-green-600' : 'bg-orange-100 text-orange-600'">
                    <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M10 20l4-16m4 4l4 4-4 4M6 16l-4-4 4-4"/>
                    </svg>
                  </div>
                  <div>
                    <p class="text-sm font-medium text-gray-900">{{ getWidgetTitle() }}</p>
                    <p class="text-xs text-gray-500">{{ getWidgetSubtitle() }}</p>
                  </div>
                </div>
                <div class="flex items-center">
                  <span class="text-xs text-gray-400">{{ setupStatus.widgetIntegration ? 'Intégré' : 'À intégrer' }}</span>
                  <svg class="w-4 h-4 text-gray-400 ml-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 5l7 7-7 7"/>
                  </svg>
                </div>
              </NuxtLink>
            </div>
          </div>
        </div>
      </div>
    </div>

    <!-- Success Notification -->
    <div
      v-if="showSuccessMessage"
      class="fixed bottom-4 right-4 bg-green-600 text-white px-6 py-3 rounded-lg shadow-lg z-50 transform transition-all duration-300"
    >
      <div class="flex items-center">
        <svg class="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M5 13l4 4L19 7"/>
        </svg>
        {{ successMessage }}
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, computed, onMounted } from 'vue'
import { useAuthStore } from '~/stores/auth'

definePageMeta({
  middleware: 'auth',
  layout: 'default'
})

interface DashboardStats {
  conversations: {
    total: number
    active: number
  }
  orders: {
    total: number
    conversionRate: number
  }
  revenue: {
    total: number
    average: number
  }
  performance: {
    responseTime: string
    uptime: number
  }
  beautyInsights?: {
    [key: string]: any
  }
}

interface Conversation {
  id: string
  visitor: string
  lastMessage: string
  time: Date
  unread: boolean
  context?: string
}

interface Order {
  id: string
  customer: string
  amount: number
  time: Date
}

interface SetupStatus {
  knowledgeBase: boolean
  agentConfig: boolean
  widgetIntegration: boolean
}

interface BeautyProfile {
  beautyCategory: 'skincare' | 'haircare' | 'makeup' | 'fragrance' | 'bodycare' | 'multi'
  specializedTarget: string[]
  targetAgeRange: string
  priceRange: string
  communicationTone: string
  expertiseLevel: string
  primaryGoal: string
  agentName?: string
}

// COMPOSABLES
const authStore = useAuthStore()
const api = useApi()
const route = useRoute()

// REACTIVE STATE
const refreshing = ref(false)
const loadingStats = ref(true)
const showSuccessMessage = ref(false)
const showWelcomeModal = ref(false)
const successMessage = ref('')

const dashboardStats = ref<DashboardStats>({
  conversations: { total: 0, active: 0 },
  orders: { total: 0, conversionRate: 0 },
  revenue: { total: 0, average: 0 },
  performance: { responseTime: '< 2s', uptime: 99.9 },
  beautyInsights: {}
})

const recentConversations = ref<Conversation[]>([])
const recentOrders = ref<Order[]>([])
const setupStatus = ref<SetupStatus>({
  knowledgeBase: false,
  agentConfig: false,
  widgetIntegration: false
})

const beautyProfile = ref<BeautyProfile>({
  beautyCategory: 'multi',
  specializedTarget: [],
  targetAgeRange: '',
  priceRange: '',
  communicationTone: '',
  expertiseLevel: '',
  primaryGoal: '',
  agentName: ''
})

// COMPUTED
const greeting = computed(() => {
  const hour = new Date().getHours()
  if (hour >= 5 && hour < 12) return 'Bonjour'
  if (hour >= 12 && hour < 18) return 'Bon après-midi'
  if (hour >= 18 && hour < 22) return 'Bonsoir'
  return 'Bonne nuit'
})

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

const configurationProgress = computed(() => {
  const total = Object.keys(setupStatus.value).length
  const completed = Object.values(setupStatus.value).filter(Boolean).length
  return Math.round((completed / total) * 100)
})

// UTILITY METHODS
const formatCurrency = (amount: number): string => {
  return new Intl.NumberFormat('fr-FR', {
    style: 'currency',
    currency: 'EUR'
  }).format(amount)
}

const formatConversionRate = (rate: any): string => {
  if (typeof rate === 'number') {
    return `${rate.toFixed(1)}%`
  }
  if (typeof rate === 'string' && rate.includes('%')) {
    return rate
  }
  return '0%'
}

const formatTime = (date: Date): string => {
  const now = new Date()
  const diffInMinutes = Math.floor((now.getTime() - date.getTime()) / (1000 * 60))
  
  if (diffInMinutes < 1) return 'À l\'instant'
  if (diffInMinutes < 60) return `Il y a ${diffInMinutes}min`
  if (diffInMinutes < 24 * 60) return `Il y a ${Math.floor(diffInMinutes / 60)}h`
  return date.toLocaleDateString('fr-FR')
}

const getInitials = (name: string): string => {
  return name
    .split(' ')
    .map(n => n[0])
    .join('')
    .toUpperCase()
    .slice(0, 2)
}

const showNotification = (message: string) => {
  successMessage.value = message
  showSuccessMessage.value = true
  setTimeout(() => {
    showSuccessMessage.value = false
  }, 3000)
}

// MÉTHODES CONTEXTUELLES BEAUTÉ

// Dashboard Subtitle
const getDashboardSubtitle = () => {
  const subtitles = {
    'skincare': 'Voici les performances de votre Esthéticienne IA',
    'haircare': 'Voici les performances de votre Experte Capillaire IA',
    'makeup': 'Voici les performances de votre Conseillère Maquillage IA',
    'fragrance': 'Voici les performances de votre Conseillère Parfums IA',
    'bodycare': 'Voici les performances de votre Experte Soins Corps IA',
    'multi': 'Voici les performances de votre Conseillère IA'
  }
  return subtitles[beautyProfile.value.beautyCategory] || subtitles.multi
}

// Welcome Modal
const getWelcomeTitle = () => {
  return `Votre ${getAgentTypeName()} est prête !`
}

const getWelcomeDescription = () => {
  const descriptions = {
    'skincare': 'Votre Esthéticienne IA spécialisée en soins du visage est configurée selon vos paramètres. Personnalisez ses conseils et intégrez-la à votre site.',
    'haircare': 'Votre Experte Capillaire IA spécialisée selon vos types de cheveux est prête. Affinez ses recommandations et activez-la sur votre boutique.',
    'makeup': 'Votre Conseillère Maquillage IA adaptée à vos styles et occasions est configurée. Personnalisez ses looks et intégrez-la à votre site.',
    'fragrance': 'Votre Conseillère Parfums IA experte en familles olfactives est prête. Affinez ses recommandations et activez-la sur votre boutique.',
    'bodycare': 'Votre Experte Soins Corps IA spécialisée selon vos produits est configurée. Personnalisez ses routines et intégrez-la à votre site.',
    'multi': 'Votre Conseillère IA multi-spécialités est prête. Affinez ses domaines d\'expertise et intégrez-la à votre site.'
  }
  return descriptions[beautyProfile.value.beautyCategory] || descriptions.multi
}

const getCreateAgentText = () => {
  return `Personnaliser ma ${getAgentTypeName()}`
}

const getTrainAgentText = () => {
  const texts = {
    'skincare': 'Ajouter mes routines skincare',
    'haircare': 'Ajouter mes soins capillaires',
    'makeup': 'Ajouter mes looks & tutos',
    'fragrance': 'Ajouter mes fragrances',
    'bodycare': 'Ajouter mes soins corps',
    'multi': 'Ajouter mes connaissances'
  }
  return texts[beautyProfile.value.beautyCategory] || texts.multi
}

// Agent Type Name
const getAgentTypeName = () => {
  const types = {
    'skincare': 'Esthéticienne IA',
    'haircare': 'Experte Capillaire IA',
    'makeup': 'Conseillère Maquillage IA',
    'fragrance': 'Conseillère Parfums IA',
    'bodycare': 'Experte Soins Corps IA',
    'multi': 'Conseillère IA'
  }
  return types[beautyProfile.value.beautyCategory] || types.multi
}

// Button Texts
const getConfigureButtonText = () => {
  return `Configurer ma ${getAgentTypeName()}`
}

// KPI Labels
const getConversationsLabel = () => {
  const labels = {
    'skincare': 'Conversations',
    'haircare': 'Conversations', 
    'makeup': 'Conversations',
    'fragrance': 'Conversations',
    'bodycare': 'Conversations',
    'multi': 'Conversations'
  }
  return labels[beautyProfile.value.beautyCategory] || labels.multi
}

const getConversionsLabel = () => {
  const labels = {
    'skincare': 'Routines vendues',
    'haircare': 'Soins recommandés',
    'makeup': 'Looks créés',
    'fragrance': 'Parfums choisis',
    'bodycare': 'Rituels adoptés',
    'multi': 'Conversions'
  }
  return labels[beautyProfile.value.beautyCategory] || labels.multi
}

const getActiveLabel = () => {
  return 'actives'
}

const getViewAllText = () => {
  return 'Voir tout'
}

const getOrdersLinkText = () => {
  const texts = {
    'skincare': 'Suivi routines',
    'haircare': 'Suivi soins',
    'makeup': 'Suivi commandes',
    'fragrance': 'Suivi parfums',
    'bodycare': 'Suivi rituels',
    'multi': 'Suivi des ventes'
  }
  return texts[beautyProfile.value.beautyCategory] || texts.multi
}

const getAverageBasketLabel = () => {
  const labels = {
    'skincare': 'routine moyenne',
    'haircare': 'panier cheveux',
    'makeup': 'look moyen',
    'fragrance': 'panier parfum',
    'bodycare': 'rituel moyen',
    'multi': 'panier moyen'
  }
  return labels[beautyProfile.value.beautyCategory] || labels.multi
}

// Insights spécialisés
const getInsightsLabel = () => {
  const labels = {
    'skincare': 'Type de peau top',
    'haircare': 'Type cheveux top',
    'makeup': 'Style préféré',
    'fragrance': 'Famille olfactive top',
    'bodycare': 'Besoin corporel top',
    'multi': 'Catégorie top'
  }
  return labels[beautyProfile.value.beautyCategory] || labels.multi
}

const getTopInsightValue = () => {
  // Simulation d'insights contextuels
  const insights = {
    'skincare': 'Mixte',
    'haircare': 'Bouclés', 
    'makeup': 'Naturel',
    'fragrance': 'Floral',
    'bodycare': 'Hydratant',
    'multi': 'Skincare'
  }
  return insights[beautyProfile.value.beautyCategory] || '42%'
}

const getSecondaryInsight = () => {
  const insights = {
    'skincare': '32% de vos clientes',
    'haircare': '28% de vos clientes',
    'makeup': '45% des Conversations',
    'fragrance': '38% des achats',
    'bodycare': '31% des demandes',
    'multi': '35% des Conversations'
  }
  return insights[beautyProfile.value.beautyCategory] || 'engagement'
}

const getInsightIcon = () => {
  const icons = {
    'skincare': '<path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z"/>',
    'haircare': '<path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 6V4m0 2a2 2 0 100 4m0-4a2 2 0 110 4m-6 8a2 2 0 100-4m0 4a2 2 0 100 4m0-4v2m0-6V4m6 6v10m6-2a2 2 0 100-4m0 4a2 2 0 100 4m0-4v2m0-6V4"/>',
    'makeup': '<path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M15.232 5.232l3.536 3.536m-2.036-5.036a2.5 2.5 0 113.536 3.536L6.5 21.036H3v-3.572L16.732 3.732z"/>',
    'fragrance': '<path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z"/>',
    'bodycare': '<path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z"/>',
    'multi': '<path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z"/>'
  }
  return icons[beautyProfile.value.beautyCategory] || icons.multi
}

const getInsightActionText = () => {
  return 'Analytics détaillées'
}

// Consultation Texts
const getRecentConversationsTitle = () => {
  return `${getConversationsLabel()} récentes`
}

const getManageConversationsText = () => {
  return 'Gérer les Conversations'
}

const getContextualLastMessage = (conversation: Conversation) => {
  if (conversation.context) return conversation.context
  
  const defaultMessages = {
    'skincare': 'Question sur routine visage',
    'haircare': 'Demande conseil cheveux',
    'makeup': 'Recherche look parfait',
    'fragrance': 'Aide choix parfum',
    'bodycare': 'Conseil soins corps',
    'multi': 'Nouvelle consultation'
  }
  return conversation.lastMessage || defaultMessages[beautyProfile.value.beautyCategory] || 'Nouvelle consultation'
}

const getNoConversationsText = () => {
  return `Aucune ${getConversationsLabel().toLowerCase()}`
}

const getNoConversationsSubtext = () => {
  const texts = {
    'skincare': 'Les Conversations peau apparaîtront ici',
    'haircare': 'Les Conversations cheveux apparaîtront ici',
    'makeup': 'Les Conversations maquillage apparaîtront ici', 
    'fragrance': 'Les Conversations parfum apparaîtront ici',
    'bodycare': 'Les Conversations corps apparaîtront ici',
    'multi': 'Les nouvelles Conversations apparaîtront ici'
  }
  return texts[beautyProfile.value.beautyCategory] || texts.multi
}

// Orders Texts
const getRecentOrdersTitle = () => {
  return `${getConversionsLabel()} récentes`
}

const getSalesTrackingText = () => {
  return 'Suivi des ventes'
}

const getOrderLabel = () => {
  const labels = {
    'skincare': 'Routine',
    'haircare': 'Soin', 
    'makeup': 'Commande',
    'fragrance': 'Parfum',
    'bodycare': 'Rituel',
    'multi': 'Commande'
  }
  return labels[beautyProfile.value.beautyCategory] || labels.multi
}

const getNoOrdersText = () => {
  return `Aucune ${getConversionsLabel().toLowerCase()}`
}

const getNoOrdersSubtext = () => {
  return 'Les nouvelles ventes apparaîtront ici'
}

// Setup Texts
const getQuickSetupTitle = () => {
  return 'Configuration rapide'
}

const getKnowledgeBaseTitle = () => {
  const titles = {
    'skincare': 'Expertise skincare',
    'haircare': 'Expertise capillaire',
    'makeup': 'Looks & techniques',
    'fragrance': 'Familles olfactives',
    'bodycare': 'Soins corporels',
    'multi': 'Base de connaissances'
  }
  return titles[beautyProfile.value.beautyCategory] || titles.multi
}

const getKnowledgeBaseSubtitle = () => {
  return `Former votre ${getAgentTypeName()}`
}

const getAgentConfigTitle = () => {
  return `Paramètres ${getAgentTypeName()}`
}

const getAgentConfigSubtitle = () => {
  return 'Personnaliser le comportement'
}

const getWidgetTitle = () => {
  return 'Widget intégration'
}

const getWidgetSubtitle = () => {
  return 'Code à intégrer sur votre site'
}

// NAVIGATION ACTIONS
const navigateToAgentSetup = () => {
  closeWelcomeModal()
  navigateTo('/agent-ia')
}

const navigateToKnowledgeBase = () => {
  closeWelcomeModal()
  navigateTo('/knowledge-base')
}

const closeWelcomeModal = () => {
  showWelcomeModal.value = false
  localStorage.setItem('chatseller_welcome_shown', 'true')
}

// DATA LOADING
const loadBeautyProfile = async () => {
  try {
    const user = authStore.user
    if (!user?.id) return
    
    const config = useRuntimeConfig()
    const baseURL = config.public.apiBaseUrl
    
    const shopResponse = await $fetch(`/api/v1/shops/${user.id}`, {
      method: 'GET',
      baseURL,
      headers: {
        'Authorization': `Bearer ${authStore.token}`,
        'Content-Type': 'application/json'
      }
    })
    
    if (shopResponse.success && shopResponse.data) {
      const shop = shopResponse.data
      
      beautyProfile.value = {
        beautyCategory: shop.beauty_category || 'multi',
        specializedTarget: shop.specialized_target || [],
        targetAgeRange: shop.target_age_range || '',
        priceRange: shop.price_range || '',
        communicationTone: shop.communication_tone || '',
        expertiseLevel: shop.expertise_level || '',
        primaryGoal: shop.primary_goal || '',
        agentName: shop.agent_config?.name || ''
      }
      
      console.log('Beauty profile chargé:', beautyProfile.value)
    }
  } catch (error) {
    console.error('Erreur chargement beauty profile:', error)
    // Utiliser les valeurs par défaut
  }
}

const loadDashboardData = async () => {
  try {
    console.log('Chargement des données dashboard avec contexte beauté...')
    
    const [conversationsData, ordersData] = await Promise.allSettled([
      loadConversations(),
      loadOrders()
    ])

    if (conversationsData.status === 'fulfilled') {
      const convs = conversationsData.value
      dashboardStats.value.conversations = {
        total: convs.length,
        active: convs.filter(c => c.status === 'active').length
      }
      
      // Conversations avec contexte beauté
      recentConversations.value = convs.slice(0, 3).map((conv: any) => ({
        id: conv.id,
        visitor: conv.visitor_id ? `Cliente ${conv.visitor_id.slice(0, 8)}` : 'Cliente anonyme',
        lastMessage: 'Nouvelle consultation',
        time: new Date(conv.started_at || Date.now()),
        unread: conv.status === 'active',
        context: getContextualLastMessage({ lastMessage: '', context: '' } as Conversation)
      }))
    }
    
    if (ordersData.status === 'fulfilled') {
      const orders = ordersData.value
      const totalConversations = dashboardStats.value.conversations.total
      
      dashboardStats.value.orders = {
        total: orders.length,
        conversionRate: totalConversations > 0 ? Math.round((orders.length / totalConversations) * 100) : 0
      }
      
      if (orders.length > 0) {
        const totalRevenue = orders.reduce((sum: number, order: any) => sum + (order.amount || 0), 0)
        dashboardStats.value.revenue = {
          total: totalRevenue,
          average: totalRevenue / orders.length
        }
        
        recentOrders.value = orders.slice(0, 3).map((order: any) => ({
          id: order.id,
          customer: order.customer_name || 'Cliente',
          amount: order.amount || 0,
          time: new Date(order.created_at || Date.now())
        }))
      }
    }

    // Statut de configuration
    setupStatus.value = {
      knowledgeBase: Math.random() > 0.3, // Simulation
      agentConfig: Math.random() > 0.4,
      widgetIntegration: Math.random() > 0.6
    }

    console.log('Données dashboard beauté chargées avec succès')
  } catch (error) {
    console.error('Erreur lors du chargement des données dashboard beauté:', error)
  } finally {
    loadingStats.value = false
  }
}

const loadConversations = async () => {
  try {
    const response = await api.conversations.list()
    if (response.success && response.data) {
      return response.data
    }
    return []
  } catch (error) {
    console.error('Erreur chargement conversations:', error)
    return []
  }
}

const loadOrders = async () => {
  try {
    // Simulation d'ordres car l'endpoint n'existe peut-être pas encore
    return []
  } catch (error) {
    console.error('Erreur chargement commandes:', error)
    return []
  }
}

// ACTION METHODS
const handleRefreshData = async () => {
  refreshing.value = true
  
  try {
    await loadDashboardData()
    showNotification('Données actualisées avec succès!')
  } catch (error) {
    console.error('Erreur lors du rafraîchissement:', error)
    showNotification('Erreur lors de l\'actualisation')
  } finally {
    refreshing.value = false
  }
}

const goToConversation = (id: string) => {
  try {
    navigateTo(`/conversations/${id}`)
  } catch (error) {
    console.error('Erreur navigation conversation:', error)
  }
}

const goToOrder = (id: string) => {
  try {
    navigateTo(`/orders/${id}`)
  } catch (error) {
    console.error('Erreur navigation commande:', error)
  }
}

// LIFECYCLE
onMounted(async () => {
  // Charger le profil beauté en premier
  await loadBeautyProfile()
  
  // Puis charger les données dashboard avec le contexte
  await loadDashboardData()
  
  // Vérifier si on doit afficher le welcome modal
  const urlParams = new URLSearchParams(window.location.search)
  const onboardingCompleted = urlParams.get('onboarding') === 'completed'
  const welcomeShown = localStorage.getItem('chatseller_welcome_shown')
  
  if (onboardingCompleted && !welcomeShown) {
    showWelcomeModal.value = true
  }
})

// SEO
useHead({
  title: 'Dashboard - ChatSeller',
  meta: [
    { name: 'description', content: 'Tableau de bord de votre Conseillère IA - Conversations, conversions et insights spécialisés pour votre marque beauté' }
  ]
})
</script>

<style scoped>
.card-modern {
  @apply bg-white rounded-xl shadow-sm border border-gray-200 p-6;
}

.card-modern-gradient {
  @apply bg-gradient-to-br rounded-xl shadow-lg p-6 text-white;
}

.conversation-item {
  @apply p-3 rounded-lg hover:bg-gray-50 transition-colors cursor-pointer;
}

.order-item {
  @apply p-3 rounded-lg hover:bg-gray-50 transition-colors cursor-pointer;
}

.avatar-circle {
  @apply flex h-10 w-10 items-center justify-center rounded-full bg-gradient-to-br from-rose-500 to-pink-600;
}

.empty-state {
  @apply text-center py-8;
}

.setup-item {
  @apply p-3 rounded-lg border border-gray-200 hover:border-rose-300 hover:bg-rose-50 transition-all;
}

.setup-item.completed {
  @apply border-green-200 bg-green-50;
}

.setup-icon {
  @apply w-10 h-10 rounded-lg flex items-center justify-center;
}

.progress-circle {
  @apply w-12 h-12 rounded-full border-4 border-gray-200 flex items-center justify-center;
}

@keyframes spin {
  from { transform: rotate(0deg); }
  to { transform: rotate(360deg); }
}

.animate-spin {
  animation: spin 1s linear infinite;
}

.animate-pulse {
  animation: pulse 2s cubic-bezier(0.4, 0, 0.6, 1) infinite;
}

@keyframes pulse {
  0%, 100% {
    opacity: 1;
  }
  50% {
    opacity: .5;
  }
}

/* Mobile optimizations */
@media (max-width: 768px) {
  .card-modern {
    @apply p-4;
  }
  
  .card-modern-gradient {
    @apply p-4;
  }
}
</style>