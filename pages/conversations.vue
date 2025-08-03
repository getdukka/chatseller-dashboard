<!-- pages/conversations.vue - VERSION ADAPTÉE À VOTRE STRUCTURE DB -->
<template>
  <div class="min-h-screen bg-gray-50">
    <!-- Header -->
    <div class="bg-white shadow-sm border-b border-gray-200">
      <div class="px-8 py-6">
        <div class="flex items-center justify-between">
          <div>
            <h1 class="text-3xl font-bold text-gray-900">Conversations</h1>
            <p class="mt-2 text-gray-600">
              Gérez toutes vos conversations en temps réel
            </p>
          </div>
          
          <div class="flex items-center space-x-4">
            <!-- Live indicator -->
            <div class="flex items-center space-x-2 px-3 py-2 bg-green-50 border border-green-200 rounded-lg">
              <div class="w-2 h-2 bg-green-500 rounded-full animate-pulse"></div>
              <span class="text-sm font-medium text-green-700">En direct</span>
            </div>
            
            <button
              @click="refreshConversations"
              :disabled="refreshing"
              class="inline-flex items-center px-4 py-2 border border-gray-300 rounded-lg text-sm font-medium text-gray-700 bg-white hover:bg-gray-50 disabled:opacity-50 transition-colors"
            >
              <svg 
                class="w-4 h-4 mr-2" 
                :class="{ 'animate-spin': refreshing }"
                fill="none" 
                stroke="currentColor" 
                viewBox="0 0 24 24"
              >
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15"/>
              </svg>
              {{ refreshing ? 'Actualisation...' : 'Actualiser' }}
            </button>
            
            <button
              @click="showFilters = !showFilters"
              class="inline-flex items-center px-4 py-2 bg-blue-600 text-white text-sm font-medium rounded-lg hover:bg-blue-700 transition-colors"
              :class="{ 'bg-blue-700': activeFiltersCount > 0 }"
            >
              <svg class="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M3 4a1 1 0 011-1h16a1 1 0 011 1v2.586a1 1 0 01-.293.707l-6.414 6.414a1 1 0 00-.293.707V17l-4 4v-6.586a1 1 0 00-.293-.707L3.293 7.207A1 1 0 013 6.5V4z"/>
              </svg>
              Filtres
              <span v-if="activeFiltersCount > 0" class="ml-2 inline-flex items-center justify-center px-2 py-1 text-xs font-bold leading-none text-blue-600 bg-white rounded-full">
                {{ activeFiltersCount }}
              </span>
            </button>
          </div>
        </div>
      </div>
    </div>

    <!-- Content -->
    <div class="p-8">
      <!-- Stats Cards -->
      <div class="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
        <div class="card-modern-gradient from-green-500 to-green-600">
          <div class="flex items-center justify-between text-white">
            <div>
              <p class="text-green-100 text-sm font-medium">Actives</p>
              <p class="text-3xl font-bold">{{ stats.active }}</p>
              <p class="text-green-100 text-sm mt-1">
                +{{ stats.newToday }} aujourd'hui
              </p>
            </div>
            <div class="p-3 bg-white bg-opacity-20 rounded-xl">
              <svg class="w-8 h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z"/>
              </svg>
            </div>
          </div>
        </div>

        <div class="card-modern-gradient from-blue-500 to-blue-600">
          <div class="flex items-center justify-between text-white">
            <div>
              <p class="text-blue-100 text-sm font-medium">Terminées</p>
              <p class="text-3xl font-bold">{{ stats.completed }}</p>
              <p class="text-blue-100 text-sm mt-1">
                {{ stats.completionRate }}% résolution
              </p>
            </div>
            <div class="p-3 bg-white bg-opacity-20 rounded-xl">
              <svg class="w-8 h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z"/>
              </svg>
            </div>
          </div>
        </div>

        <div class="card-modern-gradient from-yellow-500 to-orange-500">
          <div class="flex items-center justify-between text-white">
            <div>
              <p class="text-orange-100 text-sm font-medium">En cours</p>
              <p class="text-3xl font-bold">{{ stats.inProgress }}</p>
              <p class="text-orange-100 text-sm mt-1">
                {{ stats.averageWaitTime }}min moyenne
              </p>
            </div>
            <div class="p-3 bg-white bg-opacity-20 rounded-xl">
              <svg class="w-8 h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z"/>
              </svg>
            </div>
          </div>
        </div>

        <div class="card-modern-gradient from-purple-500 to-purple-600">
          <div class="flex items-center justify-between text-white">
            <div>
              <p class="text-purple-100 text-sm font-medium">Conversion</p>
              <p class="text-3xl font-bold">{{ stats.conversionRate }}%</p>
              <p class="text-purple-100 text-sm mt-1">
                +{{ stats.conversionGrowth }}% ce mois
              </p>
            </div>
            <div class="p-3 bg-white bg-opacity-20 rounded-xl">
              <svg class="w-8 h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M13 7h8m0 0v8m0-8l-8 8-4-4-6 6"/>
              </svg>
            </div>
          </div>
        </div>
      </div>

      <!-- Filters Panel -->
      <div v-if="showFilters" class="card-modern mb-6 animate-slide-in-up">
        <h3 class="text-lg font-semibold text-gray-900 mb-4">Filtres avancés</h3>
        <div class="grid grid-cols-1 md:grid-cols-5 gap-4">
          <!-- Status Filter -->
          <div>
            <label class="block text-sm font-medium text-gray-700 mb-2">Statut</label>
            <select v-model="filters.status" class="input-modern w-full">
              <option value="">Tous les statuts</option>
              <option value="active">Actives</option>
              <option value="completed">Terminées</option>
              <option value="abandoned">Abandonnées</option>
            </select>
          </div>

          <!-- Product Filter -->
          <div>
            <label class="block text-sm font-medium text-gray-700 mb-2">Produit</label>
            <select v-model="filters.product" class="input-modern w-full">
              <option value="">Tous les produits</option>
              <option v-for="product in uniqueProducts" :key="product" :value="product">
                {{ product }}
              </option>
            </select>
          </div>

          <!-- Period Filter -->
          <div>
            <label class="block text-sm font-medium text-gray-700 mb-2">Période</label>
            <select v-model="filters.period" class="input-modern w-full">
              <option value="">Toutes les périodes</option>
              <option value="today">Aujourd'hui</option>
              <option value="week">Cette semaine</option>
              <option value="month">Ce mois</option>
            </select>
          </div>

          <!-- Search -->
          <div>
            <label class="block text-sm font-medium text-gray-700 mb-2">Recherche</label>
            <input
              v-model="filters.search"
              type="text"
              placeholder="Produit, visiteur..."
              class="input-modern w-full"
            >
          </div>

          <!-- Actions -->
          <div class="flex items-end space-x-2">
            <button @click="applyFilters" class="btn-primary flex-1">
              Appliquer
            </button>
            <button @click="clearFilters" class="btn-secondary">
              <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12"/>
              </svg>
            </button>
          </div>
        </div>
      </div>

      <!-- Conversations Layout -->
      <div class="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <!-- Conversations List -->
        <div class="lg:col-span-2">
          <div class="card-modern">
            <div class="flex items-center justify-between p-6 border-b border-gray-200">
              <h2 class="text-lg font-semibold text-gray-900">
                Conversations récentes
              </h2>
              <div class="flex items-center space-x-3">
                <span class="text-sm text-gray-500">
                  {{ filteredConversations.length }} conversation(s)
                </span>
                <div class="flex items-center space-x-1">
                  <button
                    @click="currentPage > 1 && changePage(currentPage - 1)"
                    :disabled="currentPage <= 1"
                    class="p-2 rounded-lg hover:bg-gray-100 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
                  >
                    <svg class="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M15 19l-7-7 7-7"/>
                    </svg>
                  </button>
                  <span class="text-sm text-gray-500 px-2">
                    {{ currentPage }} / {{ totalPages }}
                  </span>
                  <button
                    @click="currentPage < totalPages && changePage(currentPage + 1)"
                    :disabled="currentPage >= totalPages"
                    class="p-2 rounded-lg hover:bg-gray-100 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
                  >
                    <svg class="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 5l7 7-7 7"/>
                    </svg>
                  </button>
                </div>
              </div>
            </div>

            <!-- Loading State -->
            <div v-if="loading" class="p-12">
              <div class="flex items-center justify-center">
                <div class="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
                <span class="ml-3 text-gray-600">Chargement des conversations...</span>
              </div>
            </div>

            <!-- Error State -->
            <div v-else-if="error" class="p-12 text-center">
              <div class="text-red-600 mb-4">
                <svg class="mx-auto h-12 w-12" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-2.5L13.732 4c-.77-.833-1.732-.833-2.5 0L4.232 15.5c-.77.833.192 2.5 1.732 2.5z"/>
                </svg>
              </div>
              <h3 class="text-lg font-medium text-gray-900 mb-2">Erreur de chargement</h3>
              <p class="text-gray-500 mb-4">{{ error }}</p>
              <button @click="loadConversations" class="btn-primary">
                Réessayer
              </button>
            </div>

            <!-- Conversations List -->
            <div v-else-if="filteredConversations.length > 0" class="divide-y divide-gray-200">
              <div
                v-for="conversation in paginatedConversations"
                :key="conversation.id"
                class="conversation-item"
                :class="{ 'selected': selectedConversation?.id === conversation.id }"
                @click="selectConversation(conversation)"
              >
                <div class="flex items-center space-x-4">
                  <!-- Avatar -->
                  <div class="conversation-avatar" :class="getStatusColor(conversation.status)">
                    <span class="text-sm font-medium text-white">
                      {{ getInitials(conversation.product_name) }}
                    </span>
                  </div>

                  <!-- Content -->
                  <div class="flex-1 min-w-0">
                    <div class="flex items-center justify-between mb-1">
                      <div class="flex items-center space-x-2">
                        <h3 class="text-sm font-medium text-gray-900 truncate">
                          {{ conversation.product_name || 'Produit non spécifié' }}
                        </h3>
                        <span 
                          class="conversation-status-badge"
                          :class="getStatusBadgeClass(conversation.status)"
                        >
                          {{ getStatusLabel(conversation.status) }}
                        </span>
                      </div>
                      <div class="flex items-center space-x-2">
                        <span class="text-xs text-gray-400">
                          {{ formatTimeAgo(conversation.last_activity) }}
                        </span>
                        <div v-if="conversation.conversion_completed" class="conversion-badge">
                          💰
                        </div>
                      </div>
                    </div>
                    
                    <p class="text-sm text-gray-600 truncate mb-1">
                      {{ getVisitorInfo(conversation) }}
                    </p>
                    
                    <div class="flex items-center space-x-4 text-xs text-gray-500">
                      <span>{{ conversation.message_count }} messages</span>
                      <span v-if="conversation.product_price">{{ formatPrice(conversation.product_price) }}</span>
                      <span class="capitalize">{{ conversation.language || 'fr' }}</span>
                      <span v-if="conversation.conversion_completed" class="text-green-600 font-medium">
                        ✓ Convertie
                      </span>
                    </div>
                  </div>

                  <!-- Actions -->
                  <div class="flex items-center space-x-2">
                    <button
                      v-if="conversation.status === 'active'"
                      @click.stop="takeOver(conversation)"
                      class="action-button-primary"
                      title="Reprendre la conversation"
                    >
                      <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z"/>
                      </svg>
                    </button>
                    
                    <div class="conversation-actions">
                      <button
                        @click.stop="toggleActionMenu(conversation.id)"
                        class="action-button-secondary"
                      >
                        <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 5v.01M12 12v.01M12 19v.01"/>
                        </svg>
                      </button>

                      <!-- Dropdown Actions -->
                      <div
                        v-if="activeActionMenu === conversation.id"
                        class="action-dropdown"
                      >
                        <button @click="viewDetails(conversation)" class="action-dropdown-item">
                          <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M15 12a3 3 0 11-6 0 3 3 0 016 0z"/>
                            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z"/>
                          </svg>
                          Voir détails
                        </button>
                        <button @click="markAsCompleted(conversation)" class="action-dropdown-item">
                          <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M5 13l4 4L19 7"/>
                          </svg>
                          Marquer terminée
                        </button>
                        <button @click="archiveConversation(conversation)" class="action-dropdown-item">
                          <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M5 8h14M5 8a2 2 0 110-4h14a2 2 0 110 4M5 8v10a2 2 0 002 2h10a2 2 0 002-2V8m-9 4h4"/>
                          </svg>
                          Archiver
                        </button>
                        <hr class="my-1">
                        <button @click="deleteConversation(conversation)" class="action-dropdown-item text-red-600 hover:bg-red-50">
                          <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16"/>
                          </svg>
                          Supprimer
                        </button>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>

            <!-- Empty State -->
            <div v-else class="text-center py-12">
              <svg class="mx-auto h-12 w-12 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z"/>
              </svg>
              <h3 class="mt-4 text-lg font-medium text-gray-900">
                {{ hasActiveFilters ? 'Aucune conversation trouvée' : 'Aucune conversation' }}
              </h3>
              <p class="mt-2 text-gray-500">
                {{ hasActiveFilters 
                  ? 'Aucune conversation ne correspond à vos critères'
                  : 'Les nouvelles conversations apparaîtront ici'
                }}
              </p>
              <div v-if="hasActiveFilters" class="mt-4">
                <button @click="clearFilters" class="btn-primary">
                  Effacer les filtres
                </button>
              </div>
            </div>
          </div>
        </div>

        <!-- Conversation Detail Panel -->
        <div class="lg:col-span-1">
          <div class="card-modern h-full">
            <div v-if="!selectedConversation" class="flex items-center justify-center h-96 text-gray-500">
              <div class="text-center">
                <svg class="mx-auto h-12 w-12 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z"/>
                </svg>
                <p class="mt-2 text-sm">Sélectionnez une conversation</p>
                <p class="text-xs text-gray-400">pour voir les détails</p>
              </div>
            </div>

            <div v-else class="h-full flex flex-col">
              <!-- Conversation Header -->
              <div class="conversation-detail-header">
                <div class="flex items-center space-x-3">
                  <div class="conversation-avatar" :class="getStatusColor(selectedConversation.status)">
                    <span class="text-sm font-medium text-white">
                      {{ getInitials(selectedConversation.product_name) }}
                    </span>
                  </div>
                  <div>
                    <h3 class="font-medium text-gray-900">{{ selectedConversation.product_name || 'Produit non spécifié' }}</h3>
                    <p class="text-sm text-gray-500">{{ getVisitorInfo(selectedConversation) }}</p>
                  </div>
                </div>
                <span 
                  class="conversation-status-badge"
                  :class="getStatusBadgeClass(selectedConversation.status)"
                >
                  {{ getStatusLabel(selectedConversation.status) }}
                </span>
              </div>

              <!-- Messages Loading -->
              <div v-if="loadingMessages" class="flex-1 flex items-center justify-center">
                <div class="animate-spin rounded-full h-6 w-6 border-b-2 border-blue-600"></div>
                <span class="ml-2 text-sm text-gray-600">Chargement des messages...</span>
              </div>

              <!-- Conversation Messages -->
              <div v-else class="conversation-messages">
                <div v-for="message in selectedConversationMessages" :key="message.id" class="message-item" :class="{ 'from-agent': message.role === 'assistant' }">
                  <div class="message-content">
                    <p class="text-sm">{{ message.content }}</p>
                    <span class="message-time">{{ formatTime(message.created_at) }}</span>
                  </div>
                </div>
                
                <div v-if="selectedConversationMessages.length === 0" class="text-center py-8 text-gray-500">
                  <p class="text-sm">Aucun message dans cette conversation</p>
                </div>
              </div>

              <!-- Conversation Info -->
              <div class="conversation-info">
                <div class="info-item">
                  <span class="info-label">Durée :</span>
                  <span class="info-value">{{ calculateDuration(selectedConversation) }}</span>
                </div>
                <div class="info-item">
                  <span class="info-label">Messages :</span>
                  <span class="info-value">{{ selectedConversation.message_count }}</span>
                </div>
                <div v-if="selectedConversation.product_price" class="info-item">
                  <span class="info-label">Prix produit :</span>
                  <span class="info-value">{{ formatPrice(selectedConversation.product_price) }}</span>
                </div>
                <div v-if="selectedConversation.conversion_completed" class="info-item">
                  <span class="info-label">Conversion :</span>
                  <span class="info-value text-green-600">✓ Réussie</span>
                </div>
                <div class="info-item">
                  <span class="info-label">Langue :</span>
                  <span class="info-value uppercase">{{ selectedConversation.language || 'FR' }}</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>

    <!-- Notification Toast -->
    <div
      v-if="notification.show"
      class="fixed bottom-4 right-4 max-w-sm w-full bg-white shadow-lg rounded-lg pointer-events-auto ring-1 ring-black ring-opacity-5 overflow-hidden z-50"
    >
      <div class="p-4">
        <div class="flex items-start">
          <div class="flex-shrink-0">
            <svg v-if="notification.type === 'success'" class="h-6 w-6 text-green-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z"/>
            </svg>
            <svg v-else class="h-6 w-6 text-red-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-2.5L13.732 4c-.77-.833-1.732-.833-2.5 0L4.232 15.5c-.77.833.192 2.5 1.732 2.5z"/>
            </svg>
          </div>
          <div class="ml-3 w-0 flex-1 pt-0.5">
            <p class="text-sm font-medium text-gray-900">{{ notification.message }}</p>
          </div>
          <div class="ml-4 flex-shrink-0 flex">
            <button @click="notification.show = false" class="bg-white rounded-md inline-flex text-gray-400 hover:text-gray-500">
              <svg class="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
                <path fill-rule="evenodd" d="M4.293 4.293a1 1 0 011.414 0L10 8.586l4.293-4.293a1 1 0 111.414 1.414L11.414 10l4.293 4.293a1 1 0 01-1.414 1.414L10 11.414l-4.293 4.293a1 1 0 01-1.414-1.414L8.586 10 4.293 5.707a1 1 0 010-1.414z" clip-rule="evenodd"/>
              </svg>
            </button>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, computed, onMounted, onUnmounted, watch } from 'vue'
import { useAuthStore } from '~/stores/auth'
import { useSupabase } from '~/composables/useSupabase'

// ✅ PAGE META
definePageMeta({
  middleware: 'auth',
  layout: 'default'
})

// ✅ TYPES - Adaptés à votre structure DB
interface Conversation {
  id: string
  shop_id: string
  visitor_id: string | null
  visitor_ip: string | null
  visitor_user_agent: string | null
  product_id: string | null
  product_name: string | null
  product_url: string | null
  product_price: number | null
  status: 'active' | 'completed' | 'abandoned'
  language: string | null
  customer_data: any
  started_at: string
  last_activity: string
  completed_at: string | null
  message_count: number
  conversion_completed: boolean
  agent_id: string | null
}

interface Message {
  id: string
  conversation_id: string
  role: string
  content: string
  content_type: string
  tokens_used: number | null
  response_time: number | null
  model_used: string | null
  action_taken: string | null
  action_data: any
  created_at: string
}

interface Stats {
  active: number
  completed: number
  inProgress: number
  abandoned: number
  conversionRate: number
  newToday: number
  completionRate: number
  averageWaitTime: number
  conversionGrowth: number
}

// ✅ COMPOSABLES
const authStore = useAuthStore()
const supabase = useSupabase()

// ✅ REACTIVE STATE
const loading = ref(true)
const refreshing = ref(false)
const loadingMessages = ref(false)
const showFilters = ref(false)
const activeActionMenu = ref<string | null>(null)
const selectedConversation = ref<Conversation | null>(null)
const selectedConversationMessages = ref<Message[]>([])
const error = ref<string | null>(null)

// Pagination
const currentPage = ref(1)
const pageSize = ref(20)

// Filters
const filters = ref({
  status: '',
  product: '',
  period: '',
  search: ''
})

// Data
const conversations = ref<Conversation[]>([])
const stats = ref<Stats>({
  active: 0,
  completed: 0,
  inProgress: 0,
  abandoned: 0,
  conversionRate: 0,
  newToday: 0,
  completionRate: 0,
  averageWaitTime: 0,
  conversionGrowth: 0
})

// Notification
const notification = ref({
  show: false,
  message: '',
  type: 'success' as 'success' | 'error'
})

// ✅ COMPUTED
const filteredConversations = computed(() => {
  let filtered = conversations.value

  if (filters.value.search) {
    const query = filters.value.search.toLowerCase()
    filtered = filtered.filter(conv => 
      conv.product_name?.toLowerCase().includes(query) ||
      conv.visitor_id?.toLowerCase().includes(query)
    )
  }

  if (filters.value.status) {
    filtered = filtered.filter(conv => conv.status === filters.value.status)
  }

  if (filters.value.product) {
    filtered = filtered.filter(conv => 
      conv.product_name?.toLowerCase().includes(filters.value.product.toLowerCase())
    )
  }

  if (filters.value.period) {
    const now = new Date()
    filtered = filtered.filter(conv => {
      const date = new Date(conv.last_activity)
      switch (filters.value.period) {
        case 'today':
          return date.toDateString() === now.toDateString()
        case 'week':
          const weekAgo = new Date(now.getTime() - 7 * 24 * 60 * 60 * 1000)
          return date >= weekAgo
        case 'month':
          return date.getMonth() === now.getMonth() && date.getFullYear() === now.getFullYear()
        default:
          return true
      }
    })
  }

  return filtered.sort((a, b) => new Date(b.last_activity).getTime() - new Date(a.last_activity).getTime())
})

const paginatedConversations = computed(() => {
  const start = (currentPage.value - 1) * pageSize.value
  const end = start + pageSize.value
  return filteredConversations.value.slice(start, end)
})

const totalPages = computed(() => Math.ceil(filteredConversations.value.length / pageSize.value))
const activeFiltersCount = computed(() => Object.values(filters.value).filter(value => value !== '').length)
const hasActiveFilters = computed(() => activeFiltersCount.value > 0)

const uniqueProducts = computed(() => {
  const products = conversations.value
    .map(c => c.product_name)
    .filter(Boolean)
    .filter((value, index, self) => self.indexOf(value) === index)
  return products.slice(0, 10) // Limite à 10 produits max
})

// ✅ UTILITY METHODS
const getInitials = (name: string | null): string => {
  if (!name) return '??'
  return name.split(' ').map(n => n.charAt(0)).join('').toUpperCase().slice(0, 2)
}

const getStatusLabel = (status: string): string => {
  const labels = {
    active: 'Active',
    completed: 'Terminée',
    abandoned: 'Abandonnée'
  }
  return labels[status as keyof typeof labels] || status
}

const getStatusBadgeClass = (status: string): string => {
  const classes = {
    active: 'bg-green-100 text-green-800',
    completed: 'bg-blue-100 text-blue-800',
    abandoned: 'bg-gray-100 text-gray-800'
  }
  return classes[status as keyof typeof classes] || 'bg-gray-100 text-gray-800'
}

const getStatusColor = (status: string): string => {
  const colors = {
    active: 'bg-green-500',
    completed: 'bg-blue-500',
    abandoned: 'bg-gray-500'
  }
  return colors[status as keyof typeof colors] || 'bg-gray-500'
}

const getVisitorInfo = (conversation: Conversation): string => {
  if (conversation.customer_data && typeof conversation.customer_data === 'object') {
    const data = conversation.customer_data
    if (data.name) return data.name
    if (data.email) return data.email
  }
  return conversation.visitor_id ? `Visiteur ${conversation.visitor_id.slice(0, 8)}` : 'Visiteur anonyme'
}

const formatTimeAgo = (date: string): string => {
  const now = new Date()
  const diffInMinutes = Math.floor((now.getTime() - new Date(date).getTime()) / (1000 * 60))

  if (diffInMinutes < 1) return 'À l\'instant'
  if (diffInMinutes < 60) return `${diffInMinutes}min`
  if (diffInMinutes < 24 * 60) return `${Math.floor(diffInMinutes / 60)}h`
  return new Date(date).toLocaleDateString('fr-FR')
}

const formatTime = (date: string): string => {
  return new Date(date).toLocaleTimeString('fr-FR', { hour: '2-digit', minute: '2-digit' })
}

const formatPrice = (price: number | null): string => {
  if (!price) return '-'
  return new Intl.NumberFormat('fr-FR', {
    style: 'currency',
    currency: 'EUR'
  }).format(price)
}

const calculateDuration = (conversation: Conversation): string => {
  const start = new Date(conversation.started_at)
  const end = conversation.completed_at ? new Date(conversation.completed_at) : new Date(conversation.last_activity)
  const diffInMinutes = Math.floor((end.getTime() - start.getTime()) / (1000 * 60))
  
  if (diffInMinutes < 60) return `${diffInMinutes}min`
  const hours = Math.floor(diffInMinutes / 60)
  const minutes = diffInMinutes % 60
  return `${hours}h ${minutes}min`
}

const showNotification = (message: string, type: 'success' | 'error' = 'success') => {
  notification.value = {
    show: true,
    message,
    type
  }
  
  setTimeout(() => {
    notification.value.show = false
  }, 5000)
}

// ✅ API METHODS
const loadConversations = async () => {
  if (!authStore.userShopId) {
    error.value = 'ID utilisateur non trouvé'
    loading.value = false
    return
  }

  loading.value = true
  error.value = null

  try {
    const { data, error: supabaseError } = await supabase
      .from('conversations')
      .select('*')
      .eq('shop_id', authStore.userShopId)
      .order('last_activity', { ascending: false })

    if (supabaseError) {
      throw new Error(supabaseError.message)
    }

    conversations.value = data || []
    console.log('✅ Conversations chargées:', conversations.value.length)
    
    // Charger les statistiques
    await loadStats()
    
  } catch (err: any) {
    console.error('❌ Erreur chargement conversations:', err)
    error.value = err.message || 'Erreur lors du chargement des conversations'
  } finally {
    loading.value = false
  }
}

const loadStats = async () => {
  try {
    const convs = conversations.value
    const today = new Date().toDateString()
    
    stats.value = {
      active: convs.filter(c => c.status === 'active').length,
      completed: convs.filter(c => c.status === 'completed').length,
      inProgress: convs.filter(c => c.status === 'active').length, // Même que active
      abandoned: convs.filter(c => c.status === 'abandoned').length,
      newToday: convs.filter(c => new Date(c.started_at).toDateString() === today).length,
      conversionRate: convs.length > 0 ? Math.round((convs.filter(c => c.conversion_completed).length / convs.length) * 100) : 0,
      completionRate: convs.length > 0 ? Math.round((convs.filter(c => c.status === 'completed').length / convs.length) * 100) : 0,
      averageWaitTime: 3, // TODO: Calculer réellement
      conversionGrowth: 12 // TODO: Calculer réellement
    }
  } catch (err) {
    console.warn('⚠️ Erreur chargement stats:', err)
  }
}

const loadConversationMessages = async (conversationId: string) => {
  loadingMessages.value = true
  
  try {
    const { data, error: supabaseError } = await supabase
      .from('messages')
      .select('*')
      .eq('conversation_id', conversationId)
      .order('created_at', { ascending: true })

    if (supabaseError) {
      throw new Error(supabaseError.message)
    }

    selectedConversationMessages.value = data || []
    console.log('✅ Messages chargés:', selectedConversationMessages.value.length)
    
  } catch (err: any) {
    console.error('❌ Erreur chargement messages:', err)
    showNotification('Erreur lors du chargement des messages', 'error')
  } finally {
    loadingMessages.value = false
  }
}

const refreshConversations = async () => {
  refreshing.value = true
  try {
    await loadConversations()
    showNotification('Conversations actualisées')
  } finally {
    refreshing.value = false
  }
}

// ✅ ACTION METHODS
const selectConversation = async (conversation: Conversation) => {
  selectedConversation.value = conversation
  await loadConversationMessages(conversation.id)
}

const changePage = (page: number) => {
  currentPage.value = page
}

const applyFilters = () => {
  currentPage.value = 1
}

const clearFilters = () => {
  Object.assign(filters.value, {
    status: '',
    product: '',
    period: '',
    search: ''
  })
  currentPage.value = 1
}

const toggleActionMenu = (conversationId: string) => {
  activeActionMenu.value = activeActionMenu.value === conversationId ? null : conversationId
}

const viewDetails = (conversation: Conversation) => {
  selectConversation(conversation)
  activeActionMenu.value = null
}

const markAsCompleted = async (conversation: Conversation) => {
  try {
    const { error: supabaseError } = await supabase
      .from('conversations')
      .update({ 
        status: 'completed',
        completed_at: new Date().toISOString()
      })
      .eq('id', conversation.id)

    if (supabaseError) {
      throw new Error(supabaseError.message)
    }

    // Mise à jour locale
    conversation.status = 'completed'
    conversation.completed_at = new Date().toISOString()
    if (selectedConversation.value?.id === conversation.id) {
      selectedConversation.value.status = 'completed'
      selectedConversation.value.completed_at = conversation.completed_at
    }

    await loadStats()
    showNotification('Conversation marquée comme terminée')
  } catch (err: any) {
    console.error('❌ Erreur mark as completed:', err)
    showNotification('Erreur lors de la mise à jour', 'error')
  } finally {
    activeActionMenu.value = null
  }
}

const archiveConversation = async (conversation: Conversation) => {
  try {
    const { error: supabaseError } = await supabase
      .from('conversations')
      .update({ status: 'completed' })
      .eq('id', conversation.id)

    if (supabaseError) {
      throw new Error(supabaseError.message)
    }

    // Mise à jour locale
    conversation.status = 'completed'
    if (selectedConversation.value?.id === conversation.id) {
      selectedConversation.value.status = 'completed'
    }

    await loadStats()
    showNotification('Conversation archivée')
  } catch (err: any) {
    console.error('❌ Erreur archive:', err)
    showNotification('Erreur lors de l\'archivage', 'error')
  } finally {
    activeActionMenu.value = null
  }
}

const deleteConversation = async (conversation: Conversation) => {
  if (!confirm('Supprimer définitivement cette conversation ?')) {
    activeActionMenu.value = null
    return
  }

  try {
    const { error: supabaseError } = await supabase
      .from('conversations')
      .delete()
      .eq('id', conversation.id)

    if (supabaseError) {
      throw new Error(supabaseError.message)
    }

    // Suppression locale
    conversations.value = conversations.value.filter(c => c.id !== conversation.id)
    if (selectedConversation.value?.id === conversation.id) {
      selectedConversation.value = null
      selectedConversationMessages.value = []
    }

    await loadStats()
    showNotification('Conversation supprimée')
  } catch (err: any) {
    console.error('❌ Erreur delete:', err)
    showNotification('Erreur lors de la suppression', 'error')
  } finally {
    activeActionMenu.value = null
  }
}

const takeOver = async (conversation: Conversation) => {
  try {
    // TODO: Logique de prise en charge humaine
    showNotification('Fonctionnalité de prise en charge en développement')
  } catch (err: any) {
    console.error('❌ Erreur takeover:', err)
    showNotification('Erreur lors de la prise en charge', 'error')
  }
}

// Close action menu when clicking outside
const closeActionMenu = (event: Event) => {
  if (activeActionMenu.value && !(event.target as Element).closest('.conversation-actions')) {
    activeActionMenu.value = null
  }
}

// ✅ WATCHERS
watch(() => filters.value, () => {
  if (hasActiveFilters.value) {
    applyFilters()
  }
}, { deep: true })

// ✅ LIFECYCLE
onMounted(() => {
  loadConversations()
  document.addEventListener('click', closeActionMenu)
})

onUnmounted(() => {
  document.removeEventListener('click', closeActionMenu)
})

// ✅ SEO
useHead({
  title: 'Conversations - ChatSeller Dashboard'
})
</script>

<style scoped>
/* ✅ MODERN COMPONENTS */
.card-modern {
  @apply bg-white rounded-xl shadow-sm border border-gray-200 p-6;
}

.card-modern-gradient {
  @apply bg-gradient-to-br rounded-xl shadow-lg p-6;
}

.input-modern {
  @apply px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-colors text-sm;
}

.btn-primary {
  @apply px-4 py-2 bg-blue-600 text-white text-sm font-medium rounded-lg hover:bg-blue-700 transition-colors;
}

.btn-secondary {
  @apply px-3 py-2 border border-gray-300 rounded-lg text-gray-700 hover:bg-gray-50 transition-colors;
}

/* ✅ CONVERSATION COMPONENTS */
.conversation-item {
  @apply p-4 hover:bg-gray-50 transition-colors cursor-pointer border-l-4 border-transparent;
}

.conversation-item.selected {
  @apply bg-blue-50 border-l-blue-500;
}

.conversation-avatar {
  @apply flex h-10 w-10 items-center justify-center rounded-full flex-shrink-0;
}

.conversation-status-badge {
  @apply inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium;
}

.conversion-badge {
  @apply flex items-center justify-center w-6 h-6 text-xs bg-green-100 rounded-full;
}

.action-button-primary {
  @apply p-2 text-blue-600 hover:text-blue-700 hover:bg-blue-50 rounded-lg transition-colors;
}

.action-button-secondary {
  @apply p-2 text-gray-400 hover:text-gray-600 hover:bg-gray-100 rounded-lg transition-colors;
}

.conversation-actions {
  @apply relative;
}

.action-dropdown {
  @apply absolute right-0 mt-2 w-48 bg-white rounded-lg shadow-lg border border-gray-200 z-10 py-1;
}

.action-dropdown-item {
  @apply w-full text-left px-4 py-2 text-sm text-gray-700 hover:bg-gray-100 flex items-center space-x-2 transition-colors;
}

/* ✅ CONVERSATION DETAIL */
.conversation-detail-header {
  @apply flex items-center justify-between p-4 border-b border-gray-200;
}

.conversation-messages {
  @apply flex-1 overflow-y-auto p-4 space-y-4 max-h-96;
}

.message-item {
  @apply flex;
}

.message-item.from-agent {
  @apply justify-start;
}

.message-item:not(.from-agent) {
  @apply justify-end;
}

.message-content {
  @apply max-w-xs px-3 py-2 rounded-lg;
}

.message-item.from-agent .message-content {
  @apply bg-gray-100 text-gray-900;
}

.message-item:not(.from-agent) .message-content {
  @apply bg-blue-600 text-white;
}

.message-time {
  @apply block text-xs opacity-70 mt-1;
}

.conversation-info {
  @apply p-4 border-t border-gray-200 space-y-2;
}

.info-item {
  @apply flex justify-between text-sm;
}

.info-label {
  @apply text-gray-500;
}

.info-value {
  @apply font-medium text-gray-900;
}

/* ✅ ANIMATIONS */
@keyframes slide-in-up {
  from {
    opacity: 0;
    transform: translateY(10px);
  }
  to {
    opacity: 1;
    transform: translateY(0);
  }
}

.animate-slide-in-up {
  animation: slide-in-up 0.3s ease-out;
}

/* ✅ RESPONSIVE */
@media (max-width: 768px) {
  .card-modern {
    @apply p-4;
  }
  
  .conversation-item {
    @apply p-3;
  }
}
</style>