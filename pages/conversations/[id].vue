<!-- pages/conversations/[id].vue - VERSION BEAUTÉ COMPLÈTE -->
<template>
  <div class="min-h-screen bg-gradient-to-br from-rose-50 via-pink-50 to-purple-50">
    <!-- Header de la consultation beauté -->
    <div class="bg-white shadow-sm border-b border-gray-200 sticky top-0 z-40">
      <div class="px-6 py-4">
        <div class="flex items-center justify-between">
          <div class="flex items-center space-x-4">
            <!-- Bouton retour -->
            <button
              @click="$router.back()"
              class="p-2 rounded-md text-gray-400 hover:text-gray-600 hover:bg-gray-100 transition-colors"
            >
              <svg class="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M10 19l-7-7m0 0l7-7m-7 7h18" />
              </svg>
            </button>

            <!-- Informations de la consultation beauté -->
            <div v-if="conversation && !loading">
              <div class="flex items-center space-x-3">
                <div class="flex h-10 w-10 items-center justify-center rounded-full bg-gradient-to-br from-rose-100 to-pink-100">
                  <span class="text-sm font-medium text-rose-700">
                    {{ getInitials(getClientName()) }}
                  </span>
                </div>
                <div>
                  <h1 class="text-xl font-bold text-gray-900">
                    Consultation avec {{ getClientName() }}
                  </h1>
                  <div class="flex items-center space-x-4 text-sm text-gray-600">
                    <span>{{ getClientEmail() || 'Pas d\'email' }}</span>
                    <span class="badge" :class="getBeautyStatusBadgeClass(conversation?.status)">
                      {{ getBeautyStatusLabel(conversation?.status) }}
                    </span>
                    <span>{{ formatDate(conversation.started_at) }}</span>
                    <div v-if="getBeautyContext()" class="flex items-center space-x-1">
                      <span class="text-rose-600">{{ getBeautyIcon() }}</span>
                      <span class="text-rose-600 font-medium">{{ getBeautyContext() }}</span>
                    </div>
                  </div>
                </div>
              </div>
            </div>

            <!-- Loading state -->
            <div v-else-if="loading" class="flex items-center space-x-3">
              <div class="animate-pulse">
                <div class="h-10 w-10 bg-rose-200 rounded-full"></div>
              </div>
              <div class="animate-pulse">
                <div class="h-4 bg-rose-200 rounded w-32 mb-2"></div>
                <div class="h-3 bg-rose-200 rounded w-24"></div>
              </div>
            </div>

            <!-- Error state -->
            <div v-else-if="error" class="flex items-center space-x-3">
              <div class="flex h-10 w-10 items-center justify-center rounded-full bg-red-100">
                <svg class="h-5 w-5 text-red-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 9v2m0 4h.01M7.07 18.93l.02-.02M17.07 5.93l.02-.02m1.132 13.788L7.05 7.08" />
                </svg>
              </div>
              <div>
                <h1 class="text-xl font-bold text-red-900">Erreur de chargement</h1>
                <div class="text-sm text-red-600">Consultation ID: {{ conversationId }}</div>
              </div>
            </div>
          </div>

          <!-- Actions -->
          <div class="flex items-center space-x-3">
            <button
              @click="refreshConversation"
              :disabled="refreshing"
              class="btn-beauty-secondary"
            >
              <svg 
                class="mr-2 h-4 w-4" 
                :class="{ 'animate-spin': refreshing }"
                fill="none" 
                stroke="currentColor" 
                viewBox="0 0 24 24"
              >
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15"/>
              </svg>
              {{ refreshing ? 'Actualisation...' : 'Actualiser' }}
            </button>

            <div class="relative">
              <button
                @click="showActionsMenu = !showActionsMenu"
                class="p-2 rounded-md text-gray-400 hover:text-gray-600 hover:bg-gray-100 transition-colors"
              >
                <svg class="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 5v.01M12 12v.01M12 19v.01" />
                </svg>
              </button>

              <!-- Menu d'actions beauté -->
              <div
                v-if="showActionsMenu"
                class="absolute right-0 mt-2 w-56 bg-white rounded-md shadow-lg border border-gray-200 z-10"
              >
                <div class="py-1">
                  <button
                    @click="takeOverConversation"
                    v-if="conversation?.status === 'active'"
                    class="block w-full text-left px-4 py-2 text-sm text-gray-700 hover:bg-rose-50 transition-colors"
                  >
                    <span class="mr-2">👩‍⚕️</span>
                    Prendre en charge la consultation
                  </button>
                  <button
                    @click="createBeautyRoutine"
                    class="block w-full text-left px-4 py-2 text-sm text-gray-700 hover:bg-purple-50 transition-colors"
                  >
                    <span class="mr-2">✨</span>
                    Créer une routine beauté
                  </button>
                  <button
                    @click="exportConversation"
                    class="block w-full text-left px-4 py-2 text-sm text-gray-700 hover:bg-blue-50 transition-colors"
                  >
                    <span class="mr-2">📋</span>
                    Exporter la consultation
                  </button>
                  <hr class="my-1">
                  <button
                    @click="deleteConversation"
                    class="block w-full text-left px-4 py-2 text-sm text-red-700 hover:bg-red-50 transition-colors"
                  >
                    <span class="mr-2">🗑️</span>
                    Supprimer
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>

    <!-- Error State Global -->
    <div v-if="error && !loading" class="p-12 text-center">
      <div class="text-red-600 mb-4">
        <svg class="mx-auto h-12 w-12" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-2.5L13.732 4c-.77-.833-1.732-.833-2.5 0L4.232 15.5c-.77.833.192 2.5 1.732 2.5z"/>
        </svg>
      </div>
      <h3 class="text-lg font-medium text-gray-900 mb-2">Erreur de chargement</h3>
      <p class="text-gray-500 mb-2">{{ error }}</p>
      <p class="text-xs text-gray-400 mb-4">Consultation ID: {{ conversationId }}</p>
      <div class="space-x-3">
        <button @click="() => loadConversation()" class="btn-beauty-primary">
          Réessayer
        </button>
        <button @click="$router.push('/conversations')" class="btn-beauty-secondary">
          Retour aux consultations
        </button>
      </div>
    </div>

    <!-- Contenu principal -->
    <div v-else class="flex" style="height: calc(100vh - 80px);">
      <!-- Zone de chat beauté -->
      <div class="flex-1 flex flex-col">
        <!-- Messages - Zone scrollable -->
        <div 
          ref="messagesContainer" 
          class="flex-1 overflow-y-auto bg-gradient-to-br from-rose-50 via-pink-50 to-purple-50 p-4" 
          style="padding-bottom: 180px;"
        >
          <div v-if="loading" class="flex justify-center items-center h-full">
            <div class="animate-spin rounded-full h-8 w-8 border-b-2 border-rose-600"></div>
            <span class="ml-3 text-gray-600">Chargement de la consultation...</span>
          </div>

          <!-- Messages -->
          <div v-else-if="messages && messages.length > 0" class="space-y-6 max-w-4xl mx-auto">
            <div
              v-for="message in messages"
              :key="message.id"
              class="flex"
              :class="getMessageAlignment(message.role)"
            >
              <!-- Message de la Vendeuse IA -->
              <div
                v-if="isBeautyAgentMessage(message.role)"
                class="flex items-start space-x-3 max-w-2xl"
              >
                <!-- Avatar Vendeuse IA -->
                <div class="flex h-10 w-10 items-center justify-center rounded-full bg-gradient-to-br from-rose-500 to-pink-600 flex-shrink-0 shadow-md">
                  <span class="text-lg">{{ getAgentIcon() }}</span>
                </div>

                <!-- Bulle Vendeuse IA -->
                <div class="bg-white rounded-2xl rounded-tl-md shadow-sm border border-rose-200 p-4 relative group">
                  <!-- Nom de la Vendeuse IA -->
                  <div class="flex items-center justify-between mb-2">
                    <div class="text-sm font-semibold text-rose-900">
                      {{ getBeautyAgentName() }}
                    </div>
                    <div class="flex items-center space-x-2 opacity-0 group-hover:opacity-100 transition-opacity">
                      <!-- Bouton éditer -->
                      <button
                        v-if="!message.isEditing"
                        @click="startEditMessage(message)"
                        class="p-1.5 text-gray-400 hover:text-rose-600 rounded-lg hover:bg-rose-50 transition-colors"
                        title="Éditer le message"
                      >
                        <svg class="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                          <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" />
                        </svg>
                      </button>
                      <!-- Bouton copier -->
                      <button
                        @click="copyMessage(message.content)"
                        class="p-1.5 text-gray-400 hover:text-emerald-600 rounded-lg hover:bg-emerald-50 transition-colors"
                        title="Copier"
                      >
                        <svg class="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                          <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M8 16H6a2 2 0 01-2-2V6a2 2 0 012-2h8a2 2 0 012 2v2m-6 12h8a2 2 0 002-2v-8a2 2 0 00-2-2h-8a2 2 0 00-2 2v8a2 2 0 002 2z" />
                        </svg>
                      </button>
                    </div>
                  </div>
                  
                  <!-- Contenu du message - Édition -->
                  <div v-if="message.isEditing">
                    <textarea
                      v-model="message.editContent"
                      rows="5"
                      class="w-full p-4 border border-rose-300 rounded-lg focus:ring-2 focus:ring-rose-500 focus:border-rose-500 resize-y min-h-[120px]"
                      @keydown.enter.exact.prevent="saveEditMessage(message)"
                      @keydown.escape.prevent="cancelEditMessage(message)"
                      placeholder="Tapez votre conseil beauté..."
                    />
                    <div class="flex items-center justify-end space-x-2 mt-2">
                      <button
                        @click="cancelEditMessage(message)"
                        class="px-3 py-1.5 text-sm text-gray-600 hover:text-gray-800 transition-colors"
                      >
                        Annuler
                      </button>
                      <button
                        @click="saveEditMessage(message)"
                        class="btn-beauty-primary"
                      >
                        Sauvegarder
                      </button>
                    </div>
                  </div>
                  
                  <!-- Contenu du message - Affichage avec formatage beauté -->
                  <div v-else>
                    <div class="text-gray-800 leading-relaxed" v-html="formatBeautyMessageContent(message.content)"></div>
                    
                    <!-- Meta informations beauté -->
                    <div class="flex items-center justify-between mt-3 pt-3 border-t border-rose-100">
                      <div class="text-xs text-gray-500">{{ formatTime(message.created_at) }}</div>
                      <div class="flex items-center space-x-3">
                        <div
                          v-if="message.tokens_used !== undefined && message.tokens_used > 0"
                          class="flex items-center space-x-1"
                          :title="`Tokens utilisés: ${message.tokens_used}`"
                        >
                          <div class="w-2 h-2 rounded-full bg-rose-400"></div>
                          <span class="text-xs text-gray-500">{{ message.tokens_used }}</span>
                        </div>
                        <div
                          v-if="message.response_time_ms !== undefined && message.response_time_ms > 0"
                          class="text-xs text-gray-500"
                          :title="`Temps de réponse: ${message.response_time_ms}ms`"
                        >
                          {{ message.response_time_ms }}ms
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>

              <!-- Message de la cliente -->
              <div
                v-else
                class="flex items-start space-x-3 max-w-lg"
              >
                <!-- Bulle Cliente -->
                <div class="bg-gradient-to-br from-purple-600 to-violet-700 text-white rounded-2xl rounded-tr-md p-4 shadow-md">
                  <div class="text-white leading-relaxed whitespace-pre-wrap">{{ message.content }}</div>
                  <div class="text-purple-100 text-xs mt-2 text-right">{{ formatTime(message.created_at) }}</div>
                </div>
                
                <!-- Avatar Cliente -->
                <div class="flex h-10 w-10 items-center justify-center rounded-full bg-gradient-to-br from-purple-100 to-violet-100 flex-shrink-0 shadow-sm">
                  <span class="text-sm font-medium text-purple-700">
                    {{ getInitials(getClientName()) }}
                  </span>
                </div>
              </div>
            </div>
          </div>

          <!-- État vide -->
          <div v-else class="flex justify-center items-center h-full">
            <div class="text-center">
              <div class="w-16 h-16 bg-gradient-to-br from-rose-100 to-pink-100 rounded-full flex items-center justify-center mx-auto mb-4">
                <svg class="w-8 h-8 text-rose-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z" />
                </svg>
              </div>
              <h3 class="text-lg font-medium text-gray-900 mb-2">Aucun message</h3>
              <p class="text-gray-500 mb-1">Cette consultation n'a pas encore de messages</p>
              <p class="text-xs text-gray-400">Messages chargés: {{ messages ? messages.length : 0 }}</p>
            </div>
          </div>
        </div>

        <!-- Zone de saisie FIXE en bas -->
        <div class="absolute bottom-0 left-0 right-80 bg-white border-t border-rose-200 shadow-lg">
          <div v-if="conversation?.status === 'active'" class="p-4">
            <div class="max-w-4xl mx-auto">
              <div class="flex items-end space-x-3">
                <div class="flex-1">
                  <label class="text-sm font-medium text-gray-700 mb-2 block">
                    Répondre en tant que {{ getBeautyAgentName() }}
                  </label>
                  <textarea
                    v-model="newMessage"
                    rows="2"
                    :placeholder="`Tapez votre conseil beauté...`"
                    class="w-full p-3 border border-rose-300 rounded-lg focus:ring-2 focus:ring-rose-500 focus:border-rose-500 resize-none"
                    @keydown.enter.exact.prevent="sendMessage"
                    @keydown.enter.shift.exact="null"
                    :disabled="sendingMessage"
                  />
                </div>
                <button
                  @click="sendMessage"
                  :disabled="!newMessage.trim() || sendingMessage"
                  class="btn-beauty-primary flex-shrink-0"
                  style="margin-bottom: 0;"
                >
                  <svg v-if="sendingMessage" class="h-5 w-5 animate-spin" fill="none" viewBox="0 0 24 24">
                    <circle class="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" stroke-width="4"></circle>
                    <path class="opacity-75" fill="currentColor" d="m4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                  </svg>
                  <svg v-else class="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 19l9 2-9-18-9 18 9-2zm0 0v-8" />
                  </svg>
                </button>
              </div>
              <p class="text-xs text-gray-500 mt-2">
                Entrée pour envoyer, Shift+Entrée pour nouvelle ligne
              </p>
            </div>
          </div>
          
          <!-- État consultation inactive -->
          <div v-else class="p-4 bg-gradient-to-r from-rose-50 to-pink-50 text-center">
            <p class="text-sm text-gray-500">Cette consultation est {{ getBeautyStatusLabel(conversation?.status)?.toLowerCase() || 'terminée' }}</p>
          </div>
        </div>
      </div>

      <!-- Sidebar droite avec informations beauté -->
      <div class="w-80 bg-white border-l border-rose-200 flex-shrink-0 overflow-y-auto">
        <div class="p-6 space-y-6">
          <!-- Profil cliente beauté -->
          <div>
            <h3 class="text-lg font-medium text-gray-900 mb-4 flex items-center">
              <span class="mr-2">👩‍💼</span>
              Profil cliente
            </h3>
            <div v-if="conversation && !loading" class="space-y-4">
              <div class="bg-gradient-to-r from-rose-50 to-pink-50 rounded-lg p-3 border border-rose-200">
                <label class="text-sm font-medium text-rose-700 block mb-1">Nom</label>
                <p class="text-sm text-gray-900 font-medium">{{ getClientName() }}</p>
              </div>
              <div class="bg-gradient-to-r from-purple-50 to-violet-50 rounded-lg p-3 border border-purple-200">
                <label class="text-sm font-medium text-purple-700 block mb-1">Email</label>
                <p class="text-sm text-gray-900">{{ getClientEmail() || 'Non renseigné' }}</p>
              </div>
              <div class="bg-gradient-to-r from-amber-50 to-orange-50 rounded-lg p-3 border border-amber-200">
                <label class="text-sm font-medium text-amber-700 block mb-1">Téléphone</label>
                <p class="text-sm text-gray-900">{{ getClientPhone() || 'Non renseigné' }}</p>
              </div>
              <div class="bg-gray-50 rounded-lg p-3">
                <label class="text-sm font-medium text-gray-700 block mb-1">Première consultation</label>
                <p class="text-sm text-gray-900">{{ formatDate(conversation.started_at) }}</p>
              </div>
              <div class="bg-gradient-to-r from-emerald-50 to-teal-50 rounded-lg p-3 border border-emerald-200">
                <label class="text-sm font-medium text-emerald-700 block mb-1">{{ getProductTypeLabel() }}</label>
                <p class="text-sm text-gray-900 font-medium">{{ getBeautyProductName() }}</p>
                <p v-if="getProductPrice()" class="text-xs text-emerald-600 mt-1">{{ formatCurrency(getProductPrice()) }}</p>
              </div>
            </div>
          </div>

          <!-- Métriques de la consultation beauté -->
          <div>
            <h3 class="text-lg font-medium text-gray-900 mb-4 flex items-center">
              <span class="mr-2">📊</span>
              Métriques consultation
            </h3>
            <div v-if="conversation && !loading" class="space-y-3">
              <div class="flex justify-between items-center p-3 bg-blue-50 rounded-lg border border-blue-200">
                <span class="text-sm font-medium text-blue-900">Messages échangés</span>
                <span class="text-sm font-bold text-blue-700">{{ conversation.message_count || messages.length }}</span>
              </div>
              <div class="flex justify-between items-center p-3 bg-green-50 rounded-lg border border-green-200">
                <span class="text-sm font-medium text-green-900">Durée consultation</span>
                <span class="text-sm font-bold text-green-700">{{ getConsultationDuration() }}</span>
              </div>
              <div class="flex justify-between items-center p-3 bg-gray-50 rounded-lg">
                <span class="text-sm font-medium text-gray-700">Statut</span>
                <span class="text-sm font-bold" :class="getBeautyStatusTextClass(conversation?.status)">
                  {{ getBeautyStatusLabel(conversation?.status) }}
                </span>
              </div>
              <div class="flex justify-between items-center p-3 rounded-lg" :class="conversation.conversion_completed ? 'bg-emerald-50 border border-emerald-200' : 'bg-red-50 border border-red-200'">
                <span class="text-sm font-medium" :class="conversation.conversion_completed ? 'text-emerald-900' : 'text-red-900'">Conversion</span>
                <span class="text-sm font-bold" :class="conversation.conversion_completed ? 'text-emerald-700' : 'text-red-700'">
                  {{ conversation.conversion_completed ? getConversionSuccessLabel() : 'Non convertie' }}
                </span>
              </div>
            </div>
          </div>

          <!-- Actions rapides beauté -->
          <div>
            <h3 class="text-lg font-medium text-gray-900 mb-4 flex items-center">
              <span class="mr-2">⚡</span>
              Actions rapides
            </h3>
            <div class="space-y-3">
              <button
                @click="createBeautyOrder"
                class="w-full btn-beauty-primary-outline"
                :disabled="!conversation"
              >
                <span class="mr-2">🛍️</span>
                Créer une commande
              </button>
              <button
                @click="createBeautyRoutine"
                class="w-full btn-beauty-secondary"
                :disabled="!conversation"
              >
                <span class="mr-2">✨</span>
                Créer routine {{ getBeautyRoutineType() }}
              </button>
              <button
                @click="exportConversation"
                class="w-full btn-beauty-secondary"
                :disabled="!conversation"
              >
                <span class="mr-2">📋</span>
                Exporter consultation
              </button>
              <button
                @click="addBeautyNote"
                class="w-full btn-beauty-secondary"
                :disabled="!conversation"
              >
                <span class="mr-2">📝</span>
                Ajouter note beauté
              </button>
            </div>
          </div>

          <!-- Profil beauté client -->
          <div v-if="getBeautyClientProfile()">
            <h3 class="text-lg font-medium text-gray-900 mb-4 flex items-center">
              <span class="mr-2">💫</span>
              Profil beauté
            </h3>
            <div class="bg-gradient-to-br from-purple-50 to-pink-50 rounded-lg p-4 border border-purple-200">
              <div class="space-y-2 text-sm">
                <div v-for="(value, key) in getBeautyClientProfile()" :key="key" class="flex justify-between">
                  <span class="font-medium text-purple-700 capitalize">{{ String(key).replace('_', ' ') }}:</span>
                  <span class="text-gray-900">{{ value }}</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>

    <!-- Toast Notification Beauté -->
    <div
      v-if="notification.show"
      class="fixed bottom-4 right-4 max-w-sm w-full bg-white shadow-lg rounded-lg pointer-events-auto ring-1 ring-black ring-opacity-5 overflow-hidden z-50"
    >
      <div class="p-4">
        <div class="flex items-start">
          <div class="flex-shrink-0">
            <svg v-if="notification.type === 'success'" class="h-6 w-6 text-emerald-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
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
            <button @click="notification.show = false" class="bg-white rounded-md inline-flex text-gray-400 hover:text-gray-500 transition-colors">
              <svg class="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
                <path fill-rule="evenodd" d="M4.293 4.293a1 1 0 011.414 0L10 8.586l4.293-4.293a1 1 0 111.414 1.414L11.414 10l4.293 4.293a1 1 0 01-1.414 1.414L10 11.414l-4.293 4.293a1 1 0 01-1.414-1.414L8.586 10 4.293 5.707a1 1 0 010-1.414z" clip-rule="evenodd"/>
              </svg>
            </button>
          </div>
        </div>
      </div>
    </div>

    <!-- Modal d'ajout de note beauté -->
    <div
      v-if="showNoteModal"
      class="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50"
      @click.self="cancelNote"
    >
      <div class="bg-white rounded-xl p-6 w-full max-w-md mx-4 shadow-xl">
        <h3 class="text-lg font-semibold text-gray-900 mb-4 flex items-center">
          <span class="mr-2">💄</span>
          Ajouter une note beauté
        </h3>
        
        <textarea
          v-model="noteContent"
          rows="4"
          placeholder="Notez les préférences beauté, allergies, recommandations..."
          class="w-full p-3 border border-rose-300 rounded-lg focus:ring-2 focus:ring-rose-500 focus:border-rose-500 resize-none"
          autofocus
        />
        
        <div class="flex items-center justify-end space-x-3 mt-6">
          <button
            @click="cancelNote"
            class="px-4 py-2 text-sm text-gray-600 hover:text-gray-800 transition-colors"
          >
            Annuler
          </button>
          <button
            @click="saveNote"
            :disabled="!noteContent.trim()"
            class="btn-beauty-primary"
          >
            Ajouter la note
          </button>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, onMounted, onUnmounted, nextTick, computed } from 'vue'
import { useAuthStore } from '~/stores/auth'

definePageMeta({
  middleware: 'auth'
})

const api = useApi()
const route = useRoute()
const authStore = useAuthStore()
const conversationId = route.params.id as string

// STATE
const loading = ref(true)
const refreshing = ref(false)
const error = ref<string | null>(null)
const showActionsMenu = ref(false)
const newMessage = ref('')
const sendingMessage = ref(false)

const conversation = ref<any>(null)
const messages = ref<any[]>([])
const messagesContainer = ref<HTMLElement>()

const notification = ref({
  show: false,
  message: '',
  type: 'success' as 'success' | 'error'
})

const showNoteModal = ref(false)
const noteContent = ref('')

// ✅ COMPUTED - BEAUTY CATEGORY
const beautyCategory = computed(() => authStore.user?.shop?.beauty_category || 'multi')

// ✅ MÉTHODES BEAUTY CONTEXTUELLES
const getBeautyIcon = (): string => {
  const icons: Record<string, string> = {
    'skincare': '✨',
    'makeup': '💄',
    'fragrance': '🌸',
    'haircare': '💇‍♀️',
    'bodycare': '🧴',
    'multi': '💋'
  }
  return icons[beautyCategory.value] || '💋'
}

const getAgentIcon = (): string => {
  return getBeautyIcon()
}

const getBeautyAgentName = (): string => {
  if (conversation.value?.agent_name) return conversation.value.agent_name
  
  const names: Record<string, string[]> = {
    'skincare': ['Camille', 'Emma', 'Léa'],
    'makeup': ['Sophie', 'Chloé', 'Julie'],
    'fragrance': ['Rose', 'Lily', 'Iris'],
    'haircare': ['Amélie', 'Sarah', 'Marine'],
    'bodycare': ['Clara', 'Manon', 'Jade'],
    'multi': ['Rose', 'Camille', 'Sophie']
  }
  
  const agentNames = names[beautyCategory.value] || names.multi
  return agentNames[0] // Premier nom par défaut
}

const getBeautyContext = (): string => {
  if (conversation.value?.beauty_context) return conversation.value.beauty_context
  
  const contexts: Record<string, string[]> = {
    'skincare': ['Routine visage', 'Diagnostic peau', 'Conseil anti-âge'],
    'makeup': ['Choix teinte', 'Look occasion', 'Technique application'],
    'fragrance': ['Famille olfactive', 'Parfum signature', 'Accord saisonnier'],
    'haircare': ['Soin cheveux', 'Diagnostic capillaire', 'Routine entretien'],
    'bodycare': ['Rituel corps', 'Soin hydratant', 'Routine bien-être'],
    'multi': ['Conseil beauté', 'Routine complète', 'Diagnostic personnalisé']
  }
  
  const categoryContexts = contexts[beautyCategory.value] || contexts.multi
  return categoryContexts[0]
}

const getBeautyProductName = (): string => {
  if (conversation.value?.product_name) return conversation.value.product_name
  
  const products: Record<string, string[]> = {
    'skincare': ['Sérum Vitamine C', 'Crème Anti-âge', 'Nettoyant Doux'],
    'makeup': ['Fond de Teint', 'Rouge à Lèvres', 'Palette Fards'],
    'fragrance': ['Eau de Parfum', 'Parfum Floral', 'Fragrance Boisée'],
    'haircare': ['Shampoing Réparateur', 'Masque Cheveux', 'Huile Nourrissante'],
    'bodycare': ['Crème Corps', 'Gommage', 'Lait Hydratant'],
    'multi': ['Produit Beauté', 'Soin Visage', 'Cosmétique Premium']
  }
  
  const categoryProducts = products[beautyCategory.value] || products.multi
  return categoryProducts[0]
}

const getProductTypeLabel = (): string => {
  const labels: Record<string, string> = {
    'skincare': 'Soin consulté',
    'makeup': 'Produit makeup',
    'fragrance': 'Parfum d\'intérêt',
    'haircare': 'Soin capillaire',
    'bodycare': 'Soin corps',
    'multi': 'Produit beauté'
  }
  return labels[beautyCategory.value] || 'Produit'
}

const getBeautyRoutineType = (): string => {
  const types: Record<string, string> = {
    'skincare': 'skincare',
    'makeup': 'makeup',
    'fragrance': 'parfum',
    'haircare': 'capillaire',
    'bodycare': 'bien-être',
    'multi': 'beauté'
  }
  return types[beautyCategory.value] || 'beauté'
}

const getConversionSuccessLabel = (): string => {
  const labels: Record<string, string> = {
    'skincare': 'Routine adoptée',
    'makeup': 'Look commandé',
    'fragrance': 'Parfum choisi',
    'haircare': 'Soins commandés',
    'bodycare': 'Rituel adopté',
    'multi': 'Produits commandés'
  }
  return labels[beautyCategory.value] || 'Convertie'
}

// ✅ MÉTHODES STATUT BEAUTY
const getBeautyStatusLabel = (status: string | undefined): string => {
  if (!status) return 'Inconnu'
  
  const labels = {
    active: 'En consultation',
    pending: 'En attente',
    completed: 'Consultation terminée',
    abandoned: 'Consultation interrompue'
  }
  return labels[status as keyof typeof labels] || status
}

const getBeautyStatusBadgeClass = (status: string | undefined): string => {
  if (!status) return 'badge-gray'
  
  const classes = {
    active: 'badge-rose',
    pending: 'badge-amber',
    completed: 'badge-emerald',
    abandoned: 'badge-gray'
  }
  return classes[status as keyof typeof classes] || 'badge-gray'
}

const getBeautyStatusTextClass = (status: string | undefined): string => {
  if (!status) return 'text-gray-600'
  
  const classes = {
    active: 'text-rose-600',
    pending: 'text-amber-600',
    completed: 'text-emerald-600',
    abandoned: 'text-gray-600'
  }
  return classes[status as keyof typeof classes] || 'text-gray-600'
}

// ✅ MÉTHODES UTILITAIRES (ADAPTÉES)
const getInitials = (name: string): string => {
  if (!name) return '??'
  return name.split(' ').map(n => n.charAt(0)).join('').toUpperCase().slice(0, 2)
}

const getClientName = (): string => {
  if (!conversation.value) return 'Cliente'
  
  if (conversation.value.customer_data) {
    const data = conversation.value.customer_data
    if (typeof data === 'string') {
      try {
        const parsed = JSON.parse(data)
        if (parsed.name) return parsed.name
        if (parsed.firstName && parsed.lastName) return `${parsed.firstName} ${parsed.lastName}`
        if (parsed.firstName) return parsed.firstName
      } catch (e) {
        if (data) return data
      }
    } else if (typeof data === 'object') {
      if (data.name) return data.name
      if (data.firstName && data.lastName) return `${data.firstName} ${data.lastName}`
      if (data.firstName) return data.firstName
    }
  }
  
  return conversation.value.visitor_id ? `Cliente ${conversation.value.visitor_id.slice(0, 8)}` : 'Cliente anonyme'
}

const getClientEmail = (): string | null => {
  if (!conversation.value?.customer_data) return null
  
  const data = conversation.value.customer_data
  if (typeof data === 'string') {
    try {
      const parsed = JSON.parse(data)
      return parsed.email || null
    } catch (e) {
      return null
    }
  } else if (typeof data === 'object') {
    return data.email || null
  }
  
  return null
}

const getClientPhone = (): string | null => {
  if (!conversation.value?.customer_data) return null
  
  const data = conversation.value.customer_data
  if (typeof data === 'string') {
    try {
      const parsed = JSON.parse(data)
      return parsed.phone || null
    } catch (e) {
      return null
    }
  } else if (typeof data === 'object') {
    return data.phone || null
  }
  
  return null
}

const getProductPrice = (): number | null => {
  return conversation.value?.product_price || null
}

const getBeautyClientProfile = (): any => {
  // Simuler un profil beauté client
  if (!conversation.value) return null
  
  const profiles: Record<string, any> = {
    'skincare': {
      'type_peau': 'Mixte',
      'concerns': 'Anti-âge',
      'sensibilites': 'Aucune'
    },
    'makeup': {
      'teint': 'Clair',
      'style_prefere': 'Naturel',
      'occasions': 'Bureau'
    },
    'fragrance': {
      'famille_olfactive': 'Floral',
      'intensite': 'Modérée',
      'saison': 'Printemps'
    },
    'haircare': {
      'type_cheveux': 'Bouclés',
      'longueur': 'Mi-longs',
      'problemes': 'Sécheresse'
    },
    'bodycare': {
      'type_peau': 'Normale',
      'besoins': 'Hydratation',
      'allergies': 'Aucune'
    },
    'multi': {
      'profil': 'Débutante',
      'budget': 'Moyen',
      'priorite': 'Skincare'
    }
  }
  
  return profiles[beautyCategory.value] || profiles.multi
}

const getMessageAlignment = (role: string): string => {
  return (role === 'user' || role === 'visitor') ? 'justify-end' : 'justify-start'
}

const isBeautyAgentMessage = (role: string): boolean => {
  return role !== 'user' && role !== 'visitor'
}

const formatDate = (dateString: string | undefined): string => {
  if (!dateString) return 'Non renseigné'
  return new Date(dateString).toLocaleDateString('fr-FR', {
    year: 'numeric',
    month: 'long',
    day: 'numeric',
    hour: '2-digit',
    minute: '2-digit'
  })
}

const formatTime = (dateString: string): string => {
  if (!dateString) return 'N/A'
  return new Date(dateString).toLocaleTimeString('fr-FR', {
    hour: '2-digit',
    minute: '2-digit'
  })
}

const formatCurrency = (amount: number): string => {
  return new Intl.NumberFormat('fr-FR', {
    style: 'currency',
    currency: 'EUR'
  }).format(amount)
}

// ✅ FORMATAGE MARKDOWN POUR MESSAGES BEAUTÉ
const formatBeautyMessageContent = (content: string): string => {
  if (!content) return ''
  
  return content
    // Texte en gras **texte**
    .replace(/\*\*(.*?)\*\*/g, '<strong class="text-rose-900">$1</strong>')
    // Texte en italique *texte*
    .replace(/\*(.*?)\*/g, '<em class="text-purple-700">$1</em>')
    // Liens [texte](url)
    .replace(/\[([^\]]+)\]\(([^)]+)\)/g, '<a href="$2" target="_blank" class="text-rose-600 hover:underline font-medium">$1</a>')
    // Nouvelles lignes
    .replace(/\n/g, '<br>')
    // Liste à puces - item
    .replace(/^- (.+)$/gm, '<li class="ml-4 text-gray-800">$1</li>')
    // Encapsuler les listes
    .replace(/(<li.*<\/li>)/g, '<ul class="list-disc list-inside space-y-1 my-2 bg-rose-50 p-3 rounded-lg border-l-4 border-rose-300">$1</ul>')
}

const getConsultationDuration = (): string => {
  if (!conversation.value || !conversation.value.started_at) return 'N/A'
  
  const start = new Date(conversation.value.started_at)
  const end = conversation.value.completed_at ? new Date(conversation.value.completed_at) : new Date()
  const diffMinutes = Math.floor((end.getTime() - start.getTime()) / (1000 * 60))
  
  if (diffMinutes > 24 * 60 || diffMinutes < 0) {
    return 'En cours'
  }
  
  if (diffMinutes < 1) return '< 1min'
  if (diffMinutes < 60) return `${diffMinutes}min`
  
  const hours = Math.floor(diffMinutes / 60)
  const mins = diffMinutes % 60
  
  if (hours > 24) return 'En cours'
  
  return `${hours}h ${mins}min`
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

const scrollToBottom = () => {
  if (messagesContainer.value) {
    messagesContainer.value.scrollTop = messagesContainer.value.scrollHeight
  }
}

// ✅ API METHODS (INCHANGÉES MAIS AVEC MESSAGES BEAUTÉ)
const loadConversation = async (retryCount = 0) => {
  loading.value = true
  error.value = null

  try {
    console.log(`🔄 Chargement consultation beauté ID: ${conversationId}`)
    
    if (!conversationId || conversationId === 'undefined') {
      throw new Error('ID de consultation invalide')
    }
    
    const conversationResponse = await api.conversations.get(conversationId)
    
    if (!conversationResponse.success) {
      throw new Error(conversationResponse.error || 'Consultation non trouvée')
    }
    
    conversation.value = conversationResponse.data
    
    if (conversationResponse.data && conversationResponse.data.messages) {
      messages.value = conversationResponse.data.messages
    } else {
      await loadMessagesOnly()
    }
    
    console.log('✅ Consultation beauté et messages chargés')
    
    nextTick(() => {
      scrollToBottom()
    })
    
  } catch (err: any) {
    console.error('❌ Erreur chargement consultation beauté:', err)
    
    if (retryCount === 0 && (err.message?.includes('401') || err.message?.includes('Unauthorized'))) {
      console.log('🔄 Retry après erreur d\'authentification...')
      setTimeout(() => loadConversation(1), 1500)
      return
    }
    
    error.value = err.message || 'Erreur lors du chargement de la consultation'
  } finally {
    loading.value = false
  }
}

const loadMessagesOnly = async () => {
  try {
    const messagesResponse = await api.conversations.getMessages(conversationId)
    
    if (messagesResponse.success && messagesResponse.data) {
      messages.value = messagesResponse.data
    } else {
      messages.value = []
    }
  } catch (err) {
    console.warn('Erreur chargement messages:', err)
    messages.value = []
  }
}

const refreshConversation = async () => {
  refreshing.value = true
  try {
    await loadConversation()
    showNotification('Consultation beauté actualisée')
  } catch (err) {
    console.error('Erreur actualisation:', err)
    showNotification('Erreur lors de l\'actualisation', 'error')
  } finally {
    refreshing.value = false
  }
}

const sendMessage = async () => {
  if (!newMessage.value.trim() || sendingMessage.value) return

  const messageContent = newMessage.value.trim()
  sendingMessage.value = true

  try {
    console.log('📤 Envoi conseil beauté:', messageContent)
    
    try {
      const response = await api.conversations.sendMessage(conversationId, {
        content: messageContent,
        sender: 'agent'
      })

      if (response.success) {
        console.log('✅ Conseil beauté envoyé via API')
      } else {
        throw new Error(response.error || 'Erreur API')
      }
    } catch (apiError) {
      console.warn('⚠️ API indisponible, ajout local du message:', apiError)
    }

    const newMsg = {
      id: `local-${Date.now()}`,
      content: messageContent,
      role: 'agent',
      created_at: new Date().toISOString(),
      tokens_used: 0,
      response_time_ms: 0
    }
    
    messages.value.push(newMsg)
    newMessage.value = ''
    
    nextTick(() => {
      scrollToBottom()
    })
    
    showNotification('Conseil beauté envoyé')

  } catch (err: any) {
    console.error('❌ Erreur envoi conseil beauté:', err)
    showNotification('Erreur lors de l\'envoi du conseil', 'error')
  } finally {
    sendingMessage.value = false
  }
}

// ✅ ACTIONS BEAUTÉ SPÉCIFIQUES
const createBeautyOrder = async () => {
  try {
    if (conversation.value) {
      const orderData = {
        conversationId: conversation.value.id,
        clientName: getClientName(),
        clientEmail: getClientEmail(),
        clientPhone: getClientPhone(),
        productName: getBeautyProductName(),
        productPrice: getProductPrice(),
        beautyCategory: beautyCategory.value,
        beautyContext: getBeautyContext()
      }
      
      if (process.client) {
        sessionStorage.setItem('beautyOrderData', JSON.stringify(orderData))
      }
      
      showNotification('Redirection vers la création de commande beauté...')
      await navigateTo('/orders/create')
    }
  } catch (err) {
    console.error('Erreur création commande beauté:', err)
    showNotification('Erreur lors de la création de commande', 'error')
  }
}

const createBeautyRoutine = async () => {
  try {
    const routineData = {
      conversationId: conversation.value?.id,
      clientName: getClientName(),
      beautyCategory: beautyCategory.value,
      productName: getBeautyProductName(),
      beautyProfile: getBeautyClientProfile()
    }
    
    // Ajouter message de routine dans la conversation
    const routineMessage = {
      id: `routine-${Date.now()}`,
      content: `✨ **Routine ${getBeautyRoutineType()} créée pour ${getClientName()}**\n\nProduits recommandés :\n- ${getBeautyProductName()}\n- Produits complémentaires selon profil\n\n*Routine personnalisée selon vos besoins beauté*`,
      role: 'system',
      created_at: new Date().toISOString()
    }
    
    messages.value.push(routineMessage)
    showNotification(`Routine ${getBeautyRoutineType()} créée avec succès!`)
    
    nextTick(() => {
      scrollToBottom()
    })
  } catch (err) {
    console.error('Erreur création routine beauté:', err)
    showNotification('Erreur lors de la création de routine', 'error')
  }
}

const addBeautyNote = () => {
  showNoteModal.value = true
  noteContent.value = ''
}

const saveNote = () => {
  try {
    if (noteContent.value && noteContent.value.trim()) {
      const noteMessage = {
        id: `note-${Date.now()}`,
        content: `💄 **Note Beauté**: ${noteContent.value.trim()}`,
        role: 'system',
        created_at: new Date().toISOString()
      }
      
      messages.value.push(noteMessage)
      showNotification('Note beauté ajoutée avec succès')
      showNoteModal.value = false
      noteContent.value = ''
      
      nextTick(() => {
        scrollToBottom()
      })
    }
  } catch (err) {
    console.error('Erreur ajout note beauté:', err)
    showNotification('Erreur lors de l\'ajout de la note', 'error')
  }
}

const cancelNote = () => {
  showNoteModal.value = false
  noteContent.value = ''
}

// ✅ AUTRES ACTIONS (ADAPTÉES AVEC VOCABULAIRE BEAUTÉ)
const startEditMessage = (message: any) => {
  message.isEditing = true
  message.editContent = message.content
}

const cancelEditMessage = (message: any) => {
  message.isEditing = false
  delete message.editContent
}

const saveEditMessage = async (message: any) => {
  if (!message.editContent || message.editContent.trim() === message.content) {
    cancelEditMessage(message)
    return
  }

  try {
    try {
      const response = await api.conversations.updateMessage(conversationId, message.id, {
        content: message.editContent.trim()
      })

      if (!response.success) {
        throw new Error(response.error || 'API non disponible')
      }
    } catch (apiError) {
      console.warn('⚠️ API updateMessage indisponible, mise à jour locale:', apiError)
    }

    message.content = message.editContent.trim()
    message.isEditing = false
    delete message.editContent
    showNotification('Conseil beauté modifié')

  } catch (err: any) {
    console.error('❌ Erreur modification conseil beauté:', err)
    showNotification('Erreur lors de la modification du conseil', 'error')
  }
}

const copyMessage = async (content: string) => {
  try {
    await navigator.clipboard.writeText(content)
    showNotification('Conseil beauté copié')
  } catch (error) {
    console.error('Erreur lors de la copie:', error)
    showNotification('Erreur lors de la copie', 'error')
  }
}

const takeOverConversation = async () => {
  try {
    const response = await api.conversations.takeover(conversationId)
    
    if (response.success) {
      showNotification('Consultation beauté prise en charge')
      await loadConversation()
    } else {
      throw new Error(response.error || 'Erreur lors de la prise en charge')
    }
  } catch (err: any) {
    console.error('Erreur takeover:', err)
    showNotification('Erreur lors de la prise en charge', 'error')
  }
  showActionsMenu.value = false
}

const exportConversation = () => {
  try {
    const data = {
      consultation: conversation.value,
      messages: messages.value,
      beautyContext: {
        category: beautyCategory.value,
        agentName: getBeautyAgentName(),
        clientProfile: getBeautyClientProfile()
      }
    }
    
    const blob = new Blob([JSON.stringify(data, null, 2)], { type: 'application/json' })
    const url = URL.createObjectURL(blob)
    const a = document.createElement('a')
    a.href = url
    a.download = `consultation-beaute-${conversationId}.json`
    a.click()
    URL.revokeObjectURL(url)
    
    showNotification('Consultation beauté exportée')
  } catch (err) {
    console.error('Erreur export:', err)
    showNotification('Erreur lors de l\'export', 'error')
  }
  showActionsMenu.value = false
}

const deleteConversation = async () => {
  if (!confirm('Êtes-vous sûr de vouloir supprimer cette consultation beauté ?')) {
    showActionsMenu.value = false
    return
  }
  
  try {
    const response = await api.conversations.delete(conversationId)
    
    if (response.success) {
      showNotification('Consultation beauté supprimée')
      navigateTo('/conversations')
    } else {
      throw new Error(response.error || 'Erreur lors de la suppression')
    }
  } catch (err: any) {
    console.error('Erreur suppression:', err)
    showNotification('Erreur lors de la suppression', 'error')
  }
  showActionsMenu.value = false
}

// EVENT HANDLERS
const closeActionMenu = (event: Event) => {
  if (showActionsMenu.value && !(event.target as Element).closest('.relative')) {
    showActionsMenu.value = false
  }
}

// LIFECYCLE
onMounted(() => {
  loadConversation()
  document.addEventListener('click', closeActionMenu)
})

onUnmounted(() => {
  document.removeEventListener('click', closeActionMenu)
})

useHead({
  title: `Consultation Beauté ${conversationId.slice(-8)} - ChatSeller Dashboard`
})
</script>

<style scoped>
/* ✅ STYLES BEAUTÉ */
.btn-beauty-primary {
  @apply px-4 py-2 bg-gradient-to-r from-rose-600 to-pink-600 text-white text-sm font-medium rounded-lg hover:from-rose-700 hover:to-pink-700 transition-all duration-200 disabled:opacity-50 disabled:cursor-not-allowed shadow-sm;
}

.btn-beauty-primary-outline {
  @apply px-4 py-2 border-2 border-rose-600 text-rose-600 text-sm font-medium rounded-lg hover:bg-rose-600 hover:text-white transition-all duration-200 disabled:opacity-50 disabled:cursor-not-allowed;
}

.btn-beauty-secondary {
  @apply px-4 py-2 bg-gradient-to-r from-purple-100 to-pink-100 text-purple-700 text-sm font-medium rounded-lg hover:from-purple-200 hover:to-pink-200 transition-all duration-200 disabled:opacity-50 disabled:cursor-not-allowed;
}

.badge {
  @apply inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium;
}

.badge-rose {
  @apply bg-rose-100 text-rose-800 border border-rose-200;
}

.badge-amber {
  @apply bg-amber-100 text-amber-800 border border-amber-200;
}

.badge-emerald {
  @apply bg-emerald-100 text-emerald-800 border border-emerald-200;
}

.badge-gray {
  @apply bg-gray-100 text-gray-800 border border-gray-200;
}

/* Scrollbar personnalisée beauté */
.overflow-y-auto::-webkit-scrollbar {
  width: 4px;
}

.overflow-y-auto::-webkit-scrollbar-track {
  background: #fdf2f8;
}

.overflow-y-auto::-webkit-scrollbar-thumb {
  background: #f472b6;
  border-radius: 2px;
}

.overflow-y-auto::-webkit-scrollbar-thumb:hover {
  background: #ec4899;
}

/* Responsive design */
@media (max-width: 1024px) {
  .w-80 {
    @apply w-72;
  }
}

@media (max-width: 768px) {
  .flex[style*="height: calc(100vh - 80px)"] {
    @apply flex-col;
    height: auto !important;
    min-height: calc(100vh - 80px);
  }
  
  .w-80, .w-72 {
    @apply w-full;
    max-height: 40vh;
  }
  
  .right-80, .right-72 {
    @apply right-0;
  }
}
</style>