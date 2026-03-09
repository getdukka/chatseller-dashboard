<!-- pages/conversations/[id].vue -->
<template>
  <div class="min-h-screen bg-gray-50/50">
    <!-- Header -->
    <div class="bg-white border-b border-gray-200 sticky top-0 z-40">
      <div class="px-6 py-4">
        <div class="flex items-center justify-between">
          <div class="flex items-center space-x-4">
            <!-- Bouton retour -->
            <button
              @click="$router.back()"
              class="p-2 rounded-lg text-gray-400 hover:text-gray-600 hover:bg-gray-100 transition-colors"
            >
              <svg class="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M10 19l-7-7m0 0l7-7m-7 7h18" />
              </svg>
            </button>

            <!-- Informations de la conversation -->
            <div v-if="conversation && !loading">
              <div class="flex items-center space-x-3">
                <div class="flex h-10 w-10 items-center justify-center rounded-full bg-gray-100">
                  <span class="text-sm font-medium text-gray-700">
                    {{ getInitials(getClientName()) }}
                  </span>
                </div>
                <div>
                  <h1 class="text-lg font-semibold text-gray-900">
                    Conversation avec {{ getClientName() }}
                  </h1>
                  <div class="flex items-center space-x-3 text-sm text-gray-500">
                    <span>{{ getClientEmail() || 'Pas d\'email' }}</span>
                    <span class="inline-flex items-center px-2 py-0.5 rounded-full text-xs font-medium" :class="getStatusBadgeClass(conversation?.status)">
                      {{ getStatusLabel(conversation?.status) }}
                    </span>
                    <span>{{ formatDate(conversation.started_at) }}</span>
                  </div>
                </div>
              </div>
            </div>

            <!-- Loading state -->
            <div v-else-if="loading" class="flex items-center space-x-3">
              <div class="animate-pulse">
                <div class="h-10 w-10 bg-gray-200 rounded-full"></div>
              </div>
              <div class="animate-pulse">
                <div class="h-4 bg-gray-200 rounded w-32 mb-2"></div>
                <div class="h-3 bg-gray-200 rounded w-24"></div>
              </div>
            </div>

            <!-- Error state -->
            <div v-else-if="error" class="flex items-center space-x-3">
              <div class="flex h-10 w-10 items-center justify-center rounded-full bg-red-100">
                <svg class="h-5 w-5 text-red-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-2.5L13.732 4c-.77-.833-1.964-.833-2.732 0L4.268 16.5c-.77.833.192 2.5 1.732 2.5z" />
                </svg>
              </div>
              <div>
                <h1 class="text-lg font-semibold text-red-900">Erreur de chargement</h1>
                <div class="text-sm text-red-600">Conversation ID: {{ conversationId }}</div>
              </div>
            </div>
          </div>

          <!-- Actions -->
          <div class="flex items-center space-x-3">
            <button
              @click="refreshConversation"
              :disabled="refreshing"
              class="inline-flex items-center px-4 py-2 border border-gray-300 rounded-lg text-sm font-medium text-gray-700 bg-white hover:bg-gray-50 disabled:opacity-50 transition-colors"
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
                class="p-2 rounded-lg text-gray-400 hover:text-gray-600 hover:bg-gray-100 transition-colors"
              >
                <svg class="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 5v.01M12 12v.01M12 19v.01" />
                </svg>
              </button>

              <!-- Menu d'actions -->
              <div
                v-if="showActionsMenu"
                class="absolute right-0 mt-2 w-56 bg-white rounded-lg shadow-lg border border-gray-200 z-10"
              >
                <div class="py-1">
                  <button
                    @click="takeOverConversation"
                    v-if="conversation?.status === 'active'"
                    class="flex items-center w-full text-left px-4 py-2.5 text-sm text-gray-700 hover:bg-gray-50 transition-colors"
                  >
                    <svg class="w-4 h-4 mr-3 text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
                    </svg>
                    Prendre en charge
                  </button>
                  <button
                    @click="exportConversation"
                    class="flex items-center w-full text-left px-4 py-2.5 text-sm text-gray-700 hover:bg-gray-50 transition-colors"
                  >
                    <svg class="w-4 h-4 mr-3 text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 10v6m0 0l-3-3m3 3l3-3m2 8H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                    </svg>
                    Exporter
                  </button>
                  <hr class="my-1 border-gray-100">
                  <button
                    @click="deleteConversation"
                    class="flex items-center w-full text-left px-4 py-2.5 text-sm text-red-600 hover:bg-red-50 transition-colors"
                  >
                    <svg class="w-4 h-4 mr-3" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                    </svg>
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
      <div class="w-12 h-12 bg-red-100 rounded-full flex items-center justify-center mx-auto mb-4">
        <svg class="w-6 h-6 text-red-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-2.5L13.732 4c-.77-.833-1.964-.833-2.732 0L4.268 16.5c-.77.833.192 2.5 1.732 2.5z"/>
        </svg>
      </div>
      <h3 class="text-lg font-medium text-gray-900 mb-2">Erreur de chargement</h3>
      <p class="text-gray-500 mb-2">{{ error }}</p>
      <p class="text-xs text-gray-400 mb-4">Conversation ID: {{ conversationId }}</p>
      <div class="space-x-3">
        <button @click="() => loadConversation()" class="inline-flex items-center px-4 py-2 text-sm font-medium rounded-lg btn-brand-primary">
          Réessayer
        </button>
        <button @click="$router.push('/conversations')" class="inline-flex items-center px-4 py-2 border border-gray-300 text-gray-700 text-sm font-medium rounded-lg hover:bg-gray-50 transition-colors">
          Retour aux conversations
        </button>
      </div>
    </div>

    <!-- Contenu principal -->
    <div v-else class="flex" style="height: calc(100vh - 73px);">
      <!-- Zone de chat -->
      <div class="flex-1 flex flex-col relative">
        <!-- Messages - Zone scrollable -->
        <div
          ref="messagesContainer"
          class="flex-1 overflow-y-auto bg-gray-50/50 p-6"
          style="padding-bottom: 160px;"
        >
          <div v-if="loading" class="flex justify-center items-center h-full">
            <div class="animate-spin rounded-full h-8 w-8 border-b-2 border-gray-900"></div>
            <span class="ml-3 text-gray-500">Chargement de la conversation...</span>
          </div>

          <!-- Messages -->
          <div v-else-if="messages && messages.length > 0" class="space-y-5 max-w-3xl mx-auto">
            <div
              v-for="message in messages"
              :key="message.id"
              class="flex"
              :class="getMessageAlignment(message.role)"
            >
              <!-- Message de la Vendeuse IA -->
              <div
                v-if="isAgentMessage(message.role)"
                class="flex items-start space-x-3 max-w-2xl"
              >
                <!-- Avatar -->
                <div class="w-8 h-8 rounded-full overflow-hidden bg-gray-900 flex-shrink-0">
                  <img
                    v-if="agentAvatar"
                    :src="agentAvatar"
                    :alt="getAgentName()"
                    class="w-full h-full object-cover"
                  />
                  <div v-else class="w-full h-full flex items-center justify-center text-white font-medium text-sm">
                    {{ (getAgentName() || 'M').charAt(0).toUpperCase() }}
                  </div>
                </div>

                <!-- Bulle agent -->
                <div class="bg-white rounded-2xl rounded-tl-md border border-gray-200 p-4 relative group shadow-sm">
                  <!-- Nom de l'agent -->
                  <div class="flex items-center justify-between mb-2">
                    <div class="text-xs font-semibold text-gray-900">
                      {{ getAgentName() }}
                    </div>
                    <div class="flex items-center space-x-1 opacity-0 group-hover:opacity-100 transition-opacity">
                      <button
                        v-if="!message.isEditing"
                        @click="startEditMessage(message)"
                        class="p-1 text-gray-400 hover:text-gray-600 rounded hover:bg-gray-100 transition-colors"
                        title="Modifier"
                      >
                        <svg class="h-3.5 w-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                          <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" />
                        </svg>
                      </button>
                      <button
                        @click="copyMessage(message.content)"
                        class="p-1 text-gray-400 hover:text-gray-600 rounded hover:bg-gray-100 transition-colors"
                        title="Copier"
                      >
                        <svg class="h-3.5 w-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                          <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M8 16H6a2 2 0 01-2-2V6a2 2 0 012-2h8a2 2 0 012 2v2m-6 12h8a2 2 0 002-2v-8a2 2 0 00-2-2h-8a2 2 0 00-2 2v8a2 2 0 002 2z" />
                        </svg>
                      </button>
                    </div>
                  </div>

                  <!-- Contenu - Édition -->
                  <div v-if="message.isEditing">
                    <textarea
                      v-model="message.editContent"
                      rows="5"
                      class="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-gray-900 focus:border-gray-900 resize-y min-h-[120px] text-sm"
                      @keydown.enter.exact.prevent="saveEditMessage(message)"
                      @keydown.escape.prevent="cancelEditMessage(message)"
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
                        class="px-3 py-1.5 text-sm font-medium rounded-lg btn-brand-primary"
                      >
                        Sauvegarder
                      </button>
                    </div>
                  </div>

                  <!-- Contenu - Affichage -->
                  <div v-else>
                    <div class="text-sm text-gray-800 leading-relaxed" v-html="formatMessageContent(message.content)"></div>

                    <!-- Meta -->
                    <div class="flex items-center justify-between mt-3 pt-2 border-t border-gray-100">
                      <div class="text-xs text-gray-400">{{ formatTime(message.created_at) }}</div>
                      <div
                        v-if="message.response_time_ms !== undefined && message.response_time_ms > 0"
                        class="flex items-center space-x-1 text-xs text-gray-400"
                        :title="`Temps de réponse: ${message.response_time_ms}ms`"
                      >
                        <svg class="w-3 h-3" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                          <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                        </svg>
                        <span>{{ formatResponseTime(message.response_time_ms) }}</span>
                      </div>
                    </div>
                  </div>
                </div>
              </div>

              <!-- Message du visiteur -->
              <div
                v-else
                class="flex items-start space-x-3 max-w-lg"
              >
                <!-- Bulle visiteur -->
                <div class="bg-gray-900 text-white rounded-2xl rounded-tr-md p-4 shadow-sm">
                  <div class="text-sm leading-relaxed whitespace-pre-wrap">{{ message.content }}</div>
                  <div class="text-gray-400 text-xs mt-2 text-right">{{ formatTime(message.created_at) }}</div>
                </div>

                <!-- Avatar visiteur -->
                <div class="flex h-8 w-8 items-center justify-center rounded-full bg-gray-200 flex-shrink-0">
                  <span class="text-xs font-medium text-gray-600">
                    {{ getInitials(getClientName()) }}
                  </span>
                </div>
              </div>
            </div>
          </div>

          <!-- État vide -->
          <div v-else class="flex justify-center items-center h-full">
            <div class="text-center">
              <div class="w-12 h-12 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-4">
                <svg class="w-6 h-6 text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z" />
                </svg>
              </div>
              <h3 class="text-sm font-medium text-gray-900 mb-1">Aucun message</h3>
              <p class="text-xs text-gray-500">Cette conversation n'a pas encore de messages</p>
            </div>
          </div>
        </div>

        <!-- Zone de saisie -->
        <div class="absolute bottom-0 left-0 right-0 bg-white border-t border-gray-200">
          <div v-if="conversation?.status === 'active'" class="p-4">
            <div class="max-w-3xl mx-auto">
              <div class="flex items-end space-x-3">
                <div class="flex-1">
                  <label class="text-xs font-medium text-gray-500 mb-1.5 block">
                    Répondre en tant que {{ getAgentName() }}
                  </label>
                  <textarea
                    v-model="newMessage"
                    rows="2"
                    placeholder="Écrivez votre réponse..."
                    class="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-gray-900 focus:border-gray-900 resize-none text-sm"
                    @keydown.enter.exact.prevent="sendMessage"
                    @keydown.enter.shift.exact="null"
                    :disabled="sendingMessage"
                  />
                </div>
                <button
                  @click="sendMessage"
                  :disabled="!newMessage.trim() || sendingMessage"
                  class="p-3 rounded-lg disabled:opacity-50 disabled:cursor-not-allowed flex-shrink-0 btn-brand-primary"
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
              <p class="text-xs text-gray-400 mt-1.5">
                Entrée pour envoyer, Shift+Entrée pour nouvelle ligne
              </p>
            </div>
          </div>

          <!-- Conversation inactive -->
          <div v-else class="p-4 bg-gray-50 text-center">
            <p class="text-sm text-gray-500">Cette conversation est {{ getStatusLabel(conversation?.status)?.toLowerCase() || 'terminée' }}</p>
          </div>
        </div>
      </div>

      <!-- Sidebar droite -->
      <div class="w-72 bg-white border-l border-gray-200 flex-shrink-0 overflow-y-auto hidden lg:block">
        <div class="p-5 space-y-6" v-if="conversation && !loading">

          <!-- Client -->
          <div>
            <h3 class="text-xs font-semibold text-gray-400 uppercase tracking-wider mb-3">Client</h3>
            <div class="space-y-2">
              <div class="flex items-center space-x-3">
                <div class="flex h-9 w-9 items-center justify-center rounded-full bg-gray-100">
                  <span class="text-xs font-semibold text-gray-600">{{ getInitials(getClientName()) }}</span>
                </div>
                <div>
                  <p class="text-sm font-medium text-gray-900">{{ getClientName() }}</p>
                  <p class="text-xs text-gray-500">{{ formatDate(conversation.started_at) }}</p>
                </div>
              </div>
              <div v-if="getClientEmail() && getClientEmail() !== 'Non renseigné'" class="text-sm text-gray-600 pl-12">{{ getClientEmail() }}</div>
              <div v-if="getClientPhone() && getClientPhone() !== 'Non renseigné'" class="text-sm text-gray-600 pl-12">{{ getClientPhone() }}</div>
            </div>
          </div>

          <!-- Produit consulté -->
          <div v-if="conversation?.product_name">
            <h3 class="text-xs font-semibold text-gray-400 uppercase tracking-wider mb-3">Produit consulté</h3>
            <div class="bg-gray-50 rounded-lg p-3">
              <p class="text-sm font-medium text-gray-900">{{ conversation.product_name }}</p>
              <p v-if="getProductPrice()" class="text-xs text-emerald-600 mt-1">{{ formatCurrency(getProductPrice()) }}</p>
            </div>
          </div>

          <!-- Métriques -->
          <div>
            <h3 class="text-xs font-semibold text-gray-400 uppercase tracking-wider mb-3">Métriques</h3>
            <div class="space-y-2.5">
              <div class="flex justify-between items-center text-sm">
                <span class="text-gray-500">Messages</span>
                <span class="font-medium text-gray-900">{{ messages.length }}</span>
              </div>
              <div class="flex justify-between items-center text-sm">
                <span class="text-gray-500">Durée</span>
                <span class="font-medium text-gray-900">{{ getConversationDuration() }}</span>
              </div>
              <div class="flex justify-between items-center text-sm">
                <span class="text-gray-500">Statut</span>
                <span class="inline-flex items-center px-2 py-0.5 rounded-full text-xs font-medium" :class="getStatusBadgeClass(conversation?.status)">
                  {{ getStatusLabel(conversation?.status) }}
                </span>
              </div>
              <div class="flex justify-between items-center text-sm">
                <span class="text-gray-500">Conversion</span>
                <span class="font-medium" :class="conversation.conversion_completed ? 'text-emerald-600' : 'text-gray-400'">
                  {{ conversation.conversion_completed ? 'Oui' : 'Non' }}
                </span>
              </div>
            </div>
          </div>

          <!-- Actions -->
          <div>
            <h3 class="text-xs font-semibold text-gray-400 uppercase tracking-wider mb-3">Actions</h3>
            <div class="space-y-2">
              <button
                @click="createOrder"
                class="w-full inline-flex items-center justify-center px-4 py-2 border border-gray-300 text-sm font-medium rounded-lg text-gray-700 bg-white hover:bg-gray-50 transition-colors"
              >
                Créer une commande
              </button>
              <button
                @click="exportConversation"
                class="w-full inline-flex items-center justify-center px-4 py-2 text-sm font-medium rounded-lg text-gray-500 hover:bg-gray-100 transition-colors"
              >
                Exporter
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>

    <!-- Toast Notification -->
    <Transition
      enter-active-class="transition ease-out duration-300"
      enter-from-class="opacity-0 translate-y-2"
      enter-to-class="opacity-100 translate-y-0"
      leave-active-class="transition ease-in duration-200"
      leave-from-class="opacity-100 translate-y-0"
      leave-to-class="opacity-0 translate-y-2"
    >
      <div
        v-if="notification.show"
        class="fixed bottom-4 right-4 max-w-sm w-full bg-white shadow-lg rounded-xl pointer-events-auto border border-gray-200 overflow-hidden z-50"
      >
        <div class="p-4">
          <div class="flex items-center">
            <div class="flex-shrink-0">
              <svg v-if="notification.type === 'success'" class="h-5 w-5 text-emerald-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z"/>
              </svg>
              <svg v-else class="h-5 w-5 text-red-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-2.5L13.732 4c-.77-.833-1.964-.833-2.732 0L4.268 16.5c-.77.833.192 2.5 1.732 2.5z"/>
              </svg>
            </div>
            <div class="ml-3 flex-1">
              <p class="text-sm font-medium text-gray-900">{{ notification.message }}</p>
            </div>
            <button @click="notification.show = false" class="ml-4 text-gray-400 hover:text-gray-500 transition-colors">
              <svg class="h-4 w-4" viewBox="0 0 20 20" fill="currentColor">
                <path fill-rule="evenodd" d="M4.293 4.293a1 1 0 011.414 0L10 8.586l4.293-4.293a1 1 0 111.414 1.414L11.414 10l4.293 4.293a1 1 0 01-1.414 1.414L10 11.414l-4.293 4.293a1 1 0 01-1.414-1.414L8.586 10 4.293 5.707a1 1 0 010-1.414z" clip-rule="evenodd"/>
              </svg>
            </button>
          </div>
        </div>
      </div>
    </Transition>
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
const agentName = ref('Mia')
const agentAvatar = ref<string | null>(null)
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

// METHODS
const getAgentName = (): string => {
  if (conversation.value?.agent_name) return conversation.value.agent_name
  return agentName.value
}

const getStatusLabel = (status: string | undefined): string => {
  if (!status) return 'Inconnu'
  const labels: Record<string, string> = {
    active: 'En cours',
    pending: 'En attente',
    completed: 'Terminée',
    abandoned: 'Interrompue'
  }
  return labels[status] || status
}

const getStatusBadgeClass = (status: string | undefined): string => {
  if (!status) return 'bg-gray-100 text-gray-700'
  const classes: Record<string, string> = {
    active: 'bg-blue-50 text-blue-700',
    pending: 'bg-amber-50 text-amber-700',
    completed: 'bg-emerald-50 text-emerald-700',
    abandoned: 'bg-gray-100 text-gray-600'
  }
  return classes[status] || 'bg-gray-100 text-gray-700'
}

const getInitials = (name: string): string => {
  if (!name) return '??'
  return name.split(' ').map(n => n.charAt(0)).join('').toUpperCase().slice(0, 2)
}

const getClientName = (): string => {
  if (!conversation.value) return 'Visiteur'

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

  return conversation.value.visitor_id ? `Visiteur ${conversation.value.visitor_id.slice(0, 8)}` : 'Visiteur anonyme'
}

const getClientEmail = (): string | null => {
  if (!conversation.value?.customer_data) return null
  const data = conversation.value.customer_data
  if (typeof data === 'string') {
    try { return JSON.parse(data).email || null } catch (e) { return null }
  } else if (typeof data === 'object') {
    return data.email || null
  }
  return null
}

const getClientPhone = (): string | null => {
  if (!conversation.value?.customer_data) return null
  const data = conversation.value.customer_data
  if (typeof data === 'string') {
    try { return JSON.parse(data).phone || null } catch (e) { return null }
  } else if (typeof data === 'object') {
    return data.phone || null
  }
  return null
}

const getProductPrice = (): number | null => {
  return conversation.value?.product_price || null
}

const getMessageAlignment = (role: string): string => {
  return (role === 'user' || role === 'visitor') ? 'justify-end' : 'justify-start'
}

const isAgentMessage = (role: string): boolean => {
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

const formatResponseTime = (ms: number): string => {
  if (ms < 1000) return '< 1s'
  const seconds = Math.round(ms / 1000)
  if (seconds < 60) return `${seconds}s`
  const minutes = Math.floor(seconds / 60)
  const remainingSeconds = seconds % 60
  return remainingSeconds > 0 ? `${minutes}min ${remainingSeconds}s` : `${minutes}min`
}

const formatMessageContent = (content: string): string => {
  if (!content) return ''
  return content
    .replace(/\*\*(.*?)\*\*/g, '<strong class="text-gray-900">$1</strong>')
    .replace(/\*(.*?)\*/g, '<em>$1</em>')
    .replace(/\[([^\]]+)\]\(([^)]+)\)/g, '<a href="$2" target="_blank" class="text-blue-600 hover:underline">$1</a>')
    .replace(/\n/g, '<br>')
    .replace(/^- (.+)$/gm, '<li class="ml-4 text-gray-700">$1</li>')
    .replace(/(<li.*<\/li>)/g, '<ul class="list-disc list-inside space-y-1 my-2">$1</ul>')
}

const getConversationDuration = (): string => {
  if (!conversation.value?.started_at) return 'N/A'
  const start = new Date(conversation.value.started_at)
  const end = conversation.value.completed_at ? new Date(conversation.value.completed_at) : new Date()
  const diffMinutes = Math.floor((end.getTime() - start.getTime()) / (1000 * 60))
  if (diffMinutes > 24 * 60 || diffMinutes < 0) return 'En cours'
  if (diffMinutes < 1) return '< 1min'
  if (diffMinutes < 60) return `${diffMinutes}min`
  const hours = Math.floor(diffMinutes / 60)
  const mins = diffMinutes % 60
  if (hours > 24) return 'En cours'
  return `${hours}h ${mins}min`
}

const showNotification = (message: string, type: 'success' | 'error' = 'success') => {
  notification.value = { show: true, message, type }
  setTimeout(() => { notification.value.show = false }, 4000)
}

const scrollToBottom = () => {
  if (messagesContainer.value) {
    messagesContainer.value.scrollTop = messagesContainer.value.scrollHeight
  }
}

// API METHODS
const loadConversation = async (retryCount = 0) => {
  loading.value = true
  error.value = null

  try {
    if (!conversationId || conversationId === 'undefined') {
      throw new Error('ID de conversation invalide')
    }

    const conversationResponse = await api.conversations.get(conversationId)

    if (!conversationResponse.success) {
      throw new Error(conversationResponse.error || 'Conversation non trouvée')
    }

    conversation.value = conversationResponse.data

    if (conversationResponse.data?.messages) {
      messages.value = conversationResponse.data.messages
    } else {
      await loadMessagesOnly()
    }

    nextTick(() => scrollToBottom())

  } catch (err: any) {
    if (retryCount === 0 && (err.message?.includes('401') || err.message?.includes('Unauthorized'))) {
      setTimeout(() => loadConversation(1), 1500)
      return
    }
    error.value = err.message || 'Erreur lors du chargement'
  } finally {
    loading.value = false
  }
}

const loadMessagesOnly = async () => {
  try {
    const messagesResponse = await api.conversations.getMessages(conversationId)
    messages.value = messagesResponse.success && messagesResponse.data ? messagesResponse.data : []
  } catch (err) {
    messages.value = []
  }
}

const refreshConversation = async () => {
  refreshing.value = true
  try {
    await loadConversation()
    showNotification('Conversation actualisée')
  } catch (err) {
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
    try {
      const response = await api.conversations.sendMessage(conversationId, {
        content: messageContent,
        sender: 'agent'
      })
      if (!response.success) throw new Error(response.error || 'Erreur API')
    } catch (apiError) {
      console.warn('API indisponible, ajout local:', apiError)
    }

    messages.value.push({
      id: `local-${Date.now()}`,
      content: messageContent,
      role: 'agent',
      created_at: new Date().toISOString(),
      tokens_used: 0,
      response_time_ms: 0
    })
    newMessage.value = ''
    nextTick(() => scrollToBottom())
    showNotification('Message envoyé')
  } catch (err: any) {
    showNotification('Erreur lors de l\'envoi', 'error')
  } finally {
    sendingMessage.value = false
  }
}

const createOrder = async () => {
  try {
    if (conversation.value) {
      const orderData = {
        conversationId: conversation.value.id,
        clientName: getClientName(),
        clientEmail: getClientEmail(),
        clientPhone: getClientPhone(),
        productName: conversation.value.product_name,
        productPrice: getProductPrice()
      }
      if (process.client) {
        sessionStorage.setItem('beautyOrderData', JSON.stringify(orderData))
      }
      showNotification('Redirection vers la création de commande...')
      await navigateTo('/orders/create')
    }
  } catch (err) {
    showNotification('Erreur lors de la création de commande', 'error')
  }
}

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
      if (!response.success) throw new Error(response.error || 'API non disponible')
    } catch (apiError) {
      console.warn('API updateMessage indisponible, mise à jour locale:', apiError)
    }
    message.content = message.editContent.trim()
    message.isEditing = false
    delete message.editContent
    showNotification('Message modifié')
  } catch (err: any) {
    showNotification('Erreur lors de la modification', 'error')
  }
}

const copyMessage = async (content: string) => {
  try {
    await navigator.clipboard.writeText(content)
    showNotification('Copié dans le presse-papier')
  } catch (error) {
    showNotification('Erreur lors de la copie', 'error')
  }
}

const takeOverConversation = async () => {
  try {
    const response = await api.conversations.takeover(conversationId)
    if (response.success) {
      showNotification('Conversation prise en charge')
      await loadConversation()
    } else {
      throw new Error(response.error || 'Erreur')
    }
  } catch (err: any) {
    showNotification('Erreur lors de la prise en charge', 'error')
  }
  showActionsMenu.value = false
}

const exportConversation = () => {
  try {
    const data = { conversation: conversation.value, messages: messages.value }
    const blob = new Blob([JSON.stringify(data, null, 2)], { type: 'application/json' })
    const url = URL.createObjectURL(blob)
    const a = document.createElement('a')
    a.href = url
    a.download = `conversation-${conversationId}.json`
    a.click()
    URL.revokeObjectURL(url)
    showNotification('Conversation exportée')
  } catch (err) {
    showNotification('Erreur lors de l\'export', 'error')
  }
  showActionsMenu.value = false
}

const deleteConversation = async () => {
  if (!confirm('Êtes-vous sûr de vouloir supprimer cette conversation ?')) {
    showActionsMenu.value = false
    return
  }
  try {
    const response = await api.conversations.delete(conversationId)
    if (response.success) {
      showNotification('Conversation supprimée')
      navigateTo('/conversations')
    } else {
      throw new Error(response.error || 'Erreur')
    }
  } catch (err: any) {
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
  api.agents.list().then((res: any) => {
    if (res.success && res.data?.length > 0) {
      agentName.value = res.data[0].name || 'Mia'
      agentAvatar.value = res.data[0].avatar || null
    }
  }).catch(() => {})
})

onUnmounted(() => {
  document.removeEventListener('click', closeActionMenu)
})

useHead({
  title: `Conversation ${conversationId.slice(-8)} - ChatSeller`
})
</script>

<style scoped>
.btn-brand-primary {
  background-color: var(--color-primary);
  color: #ffffff;
  transition: background-color 0.2s ease, box-shadow 0.2s ease;
}
.btn-brand-primary:hover:not(:disabled) {
  background-color: var(--color-primary-hover);
  box-shadow: 0 4px 12px rgba(234, 66, 66, 0.25);
}

/* Scrollbar */
.overflow-y-auto::-webkit-scrollbar {
  width: 4px;
}
.overflow-y-auto::-webkit-scrollbar-track {
  background: transparent;
}
.overflow-y-auto::-webkit-scrollbar-thumb {
  background: #d1d5db;
  border-radius: 2px;
}
.overflow-y-auto::-webkit-scrollbar-thumb:hover {
  background: #9ca3af;
}
</style>
