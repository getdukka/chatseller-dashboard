<!-- pages/settings.vue - VERSION CTO OPTIMISÉE 100% API PURE -->
<template>
  <div class="min-h-screen bg-gray-50">
    <!-- Header -->
    <div class="bg-white shadow-sm border-b border-gray-200">
      <div class="px-8 py-6">
        <div class="flex items-center justify-between">
          <div>
            <h1 class="text-3xl font-bold text-gray-900">Paramètres du compte</h1>
            <p class="mt-2 text-gray-600">
              Gérez votre profil, votre boutique et vos préférences
            </p>
          </div>
          
          <div class="flex items-center space-x-4">
            <!-- Status Badge -->
            <div class="flex items-center space-x-2">
              <div class="w-2 h-2 bg-green-500 rounded-full"></div>
              <span class="text-sm text-gray-600">{{ connectionStatus }}</span>
            </div>
            
            <!-- Quick Actions -->
            <button
              @click="refreshData"
              :disabled="loading"
              class="inline-flex items-center px-4 py-2 border border-gray-300 rounded-lg text-sm font-medium text-gray-700 bg-white hover:bg-gray-50 disabled:opacity-50 transition-colors"
            >
              <svg class="w-4 h-4 mr-2" :class="{ 'animate-spin': loading }" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15"/>
              </svg>
              Actualiser
            </button>
          </div>
        </div>
      </div>
    </div>

    <!-- Content -->
    <div class="p-8">
      <!-- Tabs Navigation -->
      <div class="border-b border-gray-200 mb-8">
        <nav class="-mb-px flex space-x-8">
          <button
            v-for="tab in tabs"
            :key="tab.id"
            @click="setActiveTab(tab.id)"
            :class="[
              'py-3 px-1 border-b-2 font-medium text-sm transition-colors',
              activeTab === tab.id
                ? 'border-blue-500 text-blue-600'
                : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
            ]"
          >
            <svg class="w-5 h-5 mr-2 inline" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" :d="tab.icon"/>
            </svg>
            {{ tab.label }}
          </button>
        </nav>
      </div>

      <!-- Loading State -->
      <div v-if="initialLoading" class="flex items-center justify-center py-12">
        <div class="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
      </div>

      <!-- Tab Content -->
      <div v-else class="max-w-6xl">
        
        <!-- ✅ ONGLET PROFIL -->
        <div v-show="activeTab === 'profil'" class="space-y-8">
          <div class="grid grid-cols-1 lg:grid-cols-3 gap-8">
            
            <!-- Informations personnelles -->
            <div class="lg:col-span-2">
              <div class="card-modern">
                <div class="flex items-center justify-between mb-6">
                  <h2 class="text-xl font-semibold text-gray-900">Informations personnelles</h2>
                  <button 
                    @click="editingProfile = !editingProfile"
                    class="inline-flex items-center px-4 py-2 text-sm font-medium rounded-xl transition-all duration-200"
                    :class="editingProfile 
                      ? 'bg-gray-100 text-gray-700 hover:bg-gray-200' 
                      : 'bg-blue-50 text-blue-700 hover:bg-blue-100'"
                  >
                    <svg class="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" />
                    </svg>
                    {{ editingProfile ? 'Annuler' : 'Modifier' }}
                  </button>
                </div>

                <form @submit.prevent="updateProfile" class="space-y-6">
                  <div class="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div>
                      <label for="firstName" class="block text-sm font-medium text-gray-700 mb-2">
                        Prénom
                      </label>
                      <input
                        id="firstName"
                        v-model="profileForm.firstName"
                        type="text"
                        :disabled="!editingProfile"
                        class="input-modern w-full disabled:bg-gray-50 disabled:text-gray-500"
                        placeholder="Votre prénom"
                      />
                    </div>
                    
                    <div>
                      <label for="lastName" class="block text-sm font-medium text-gray-700 mb-2">
                        Nom
                      </label>
                      <input
                        id="lastName"
                        v-model="profileForm.lastName"
                        type="text"
                        :disabled="!editingProfile"
                        class="input-modern w-full disabled:bg-gray-50 disabled:text-gray-500"
                        placeholder="Votre nom"
                      />
                    </div>
                  </div>

                  <div>
                    <label for="email" class="block text-sm font-medium text-gray-700 mb-2">
                      Adresse email
                    </label>
                    <input
                      id="email"
                      v-model="profileForm.email"
                      type="email"
                      disabled
                      class="input-modern w-full bg-gray-50 text-gray-500"
                      placeholder="votre@email.com"
                    />
                    <p class="text-xs text-gray-500 mt-1">L'email ne peut pas être modifié</p>
                  </div>

                  <!-- Boutons d'action -->
                  <div v-if="editingProfile" class="flex items-center space-x-4 pt-4">
                    <button
                      type="submit"
                      :disabled="updating"
                      class="inline-flex items-center px-6 py-3 bg-blue-600 text-white font-medium rounded-xl hover:bg-blue-700 focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 transition-all duration-200 disabled:opacity-50 disabled:cursor-not-allowed"
                    >
                      <svg v-if="updating" class="animate-spin -ml-1 mr-3 h-4 w-4 text-white" fill="none" viewBox="0 0 24 24">
                        <circle class="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" stroke-width="4"></circle>
                        <path class="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                      </svg>
                      {{ updating ? 'Mise à jour...' : 'Sauvegarder' }}
                    </button>
                    <button
                      type="button"
                      @click="cancelEdit"
                      class="inline-flex items-center px-6 py-3 bg-white text-gray-700 font-medium rounded-xl border border-gray-200 hover:bg-gray-50 transition-all duration-200"
                    >
                      Annuler
                    </button>
                  </div>
                </form>
              </div>
            </div>

            <!-- Avatar et résumé -->
            <div class="space-y-6">
              <!-- Résumé du compte -->
              <div class="card-modern">
                <h3 class="text-lg font-semibold text-gray-900 mb-4">Activité du compte</h3>
                
                <div class="space-y-4">
                  <div class="flex items-center justify-between">
                    <span class="text-sm text-gray-600">Membre depuis</span>
                    <span class="text-sm font-medium text-gray-900">{{ memberSince }}</span>
                  </div>
                  <div class="flex items-center justify-between">
                    <span class="text-sm text-gray-600">Plan actuel</span>
                    <span class="inline-flex items-center px-2 py-1 rounded-full text-xs font-medium" :class="planBadgeClass">
                      {{ planDisplayName }}
                    </span>
                  </div>
                  <div class="flex items-center justify-between">
                    <span class="text-sm text-gray-600">Conversations</span>
                    <span class="text-sm font-medium text-gray-900">{{ accountStats.totalConversations || 0 }}</span>
                  </div>
                  <div class="flex items-center justify-between">
                    <span class="text-sm text-gray-600">Agents actifs</span>
                    <span class="text-sm font-medium text-gray-900">{{ accountStats.activeAgents || 0 }}</span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>

        <!-- ✅ ONGLET BOUTIQUE -->
        <div v-show="activeTab === 'boutique'" class="space-y-8">
          <div class="grid grid-cols-1 lg:grid-cols-2 gap-8">
            
            <!-- Informations boutique -->
            <div class="card-modern">
              <div class="flex items-center justify-between mb-6">
                <h2 class="text-xl font-semibold text-gray-900">Informations de la boutique</h2>
                <button 
                  @click="editingShop = !editingShop"
                  class="inline-flex items-center px-4 py-2 text-sm font-medium rounded-xl transition-all duration-200"
                  :class="editingShop 
                    ? 'bg-gray-100 text-gray-700 hover:bg-gray-200' 
                    : 'bg-blue-50 text-blue-700 hover:bg-blue-100'"
                >
                  <svg class="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" />
                  </svg>
                  {{ editingShop ? 'Annuler' : 'Modifier' }}
                </button>
              </div>

              <form @submit.prevent="updateShop" class="space-y-6">
                <div>
                  <label for="shopName" class="block text-sm font-medium text-gray-700 mb-2">
                    Nom de la boutique
                  </label>
                  <input
                    id="shopName"
                    v-model="shopForm.name"
                    type="text"
                    :disabled="!editingShop"
                    class="input-modern w-full disabled:bg-gray-50 disabled:text-gray-500"
                    placeholder="Nom de votre boutique"
                  />
                </div>

                <div>
                  <label for="shopDomain" class="block text-sm font-medium text-gray-700 mb-2">
                    Domaine (optionnel)
                  </label>
                  <input
                    id="shopDomain"
                    v-model="shopForm.domain"
                    type="url"
                    :disabled="!editingShop"
                    class="input-modern w-full disabled:bg-gray-50 disabled:text-gray-500"
                    placeholder="https://votreboutique.com"
                  />
                  <p class="text-xs text-gray-500 mt-1">URL de votre site e-commerce</p>
                </div>

                <div>
                  <label class="block text-sm font-medium text-gray-700 mb-2">ID de la boutique</label>
                  <div class="flex items-center space-x-2">
                    <input
                      :value="shopData?.id || authStore.userShopId"
                      readonly
                      class="flex-1 input-modern bg-gray-50 text-gray-500 text-sm font-mono"
                    />
                    <button
                      @click="copyShopId"
                      type="button"
                      class="inline-flex items-center justify-center w-10 h-10 rounded-xl bg-blue-50 text-blue-600 hover:bg-blue-100 transition-all duration-200"
                      title="Copier l'ID"
                    >
                      <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M8 16H6a2 2 0 01-2-2V6a2 2 0 012-2h8a2 2 0 012 2v2m-6 12h8a2 2 0 002-2v-8a2 2 0 00-2-2h-8a2 2 0 00-2 2v8a2 2 0 002 2z" />
                      </svg>
                    </button>
                  </div>
                </div>

                <!-- Boutons d'action -->
                <div v-if="editingShop" class="flex items-center space-x-4 pt-4">
                  <button
                    type="submit"
                    :disabled="updatingShop"
                    class="inline-flex items-center px-6 py-3 bg-blue-600 text-white font-medium rounded-xl hover:bg-blue-700 disabled:opacity-50 transition-all duration-200"
                  >
                    <svg v-if="updatingShop" class="animate-spin -ml-1 mr-3 h-4 w-4 text-white" fill="none" viewBox="0 0 24 24">
                      <circle class="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" stroke-width="4"></circle>
                      <path class="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                    </svg>
                    {{ updatingShop ? 'Mise à jour...' : 'Sauvegarder' }}
                  </button>
                  <button
                    type="button"
                    @click="cancelShopEdit"
                    class="inline-flex items-center px-6 py-3 bg-white text-gray-700 font-medium rounded-xl border border-gray-200 hover:bg-gray-50 transition-all duration-200"
                  >
                    Annuler
                  </button>
                </div>
              </form>
            </div>

            <!-- Statistiques boutique -->
            <div class="card-modern">
              <h2 class="text-xl font-semibold text-gray-900 mb-6">Statistiques de la boutique</h2>
              
              <div class="space-y-6">
                <div class="grid grid-cols-2 gap-4">
                  <div class="text-center p-4 bg-blue-50 rounded-lg">
                    <div class="text-2xl font-bold text-blue-600">{{ accountStats.totalConversations || 0 }}</div>
                    <div class="text-sm text-blue-600">Conversations</div>
                  </div>
                  <div class="text-center p-4 bg-green-50 rounded-lg">
                    <div class="text-2xl font-bold text-green-600">{{ accountStats.totalOrders || 0 }}</div>
                    <div class="text-sm text-green-600">Commandes</div>
                  </div>
                </div>

                <div class="grid grid-cols-2 gap-4">
                  <div class="text-center p-4 bg-purple-50 rounded-lg">
                    <div class="text-2xl font-bold text-purple-600">{{ formatCurrency(accountStats.totalRevenue || 0) }}</div>
                    <div class="text-sm text-purple-600">Revenus</div>
                  </div>
                  <div class="text-center p-4 bg-orange-50 rounded-lg">
                    <div class="text-2xl font-bold text-orange-600">{{ accountStats.conversionRate || 0 }}%</div>
                    <div class="text-sm text-orange-600">Conversion</div>
                  </div>
                </div>

                <!-- Plan et usage -->
                <div class="border-t pt-6">
                  <h3 class="font-medium text-gray-900 mb-3">Plan et utilisation</h3>
                  <div class="space-y-3">
                    <div class="flex items-center justify-between">
                      <span class="text-sm text-gray-600">Plan actuel</span>
                      <div class="flex items-center space-x-2">
                        <span class="inline-flex items-center px-2 py-1 rounded-full text-xs font-medium" :class="planBadgeClass">
                          {{ planDisplayName }}
                        </span>
                        <NuxtLink to="/billing" class="text-xs text-blue-600 hover:text-blue-700 font-medium">
                          Gérer
                        </NuxtLink>
                      </div>
                    </div>
                    
                    <div class="flex items-center justify-between">
                      <span class="text-sm text-gray-600">Agents utilisés</span>
                      <span class="text-sm font-medium text-gray-900">
                        {{ accountStats.activeAgents || 0 }} / {{ planLimits.agents === -1 ? '∞' : planLimits.agents }}
                      </span>
                    </div>
                    
                    <div class="flex items-center justify-between">
                      <span class="text-sm text-gray-600">Documents</span>
                      <span class="text-sm font-medium text-gray-900">
                        {{ accountStats.documentsCount || 0 }} / {{ planLimits.documents === -1 ? '∞' : planLimits.documents }}
                      </span>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>

        <!-- ✅ ONGLET SÉCURITÉ -->
        <div v-show="activeTab === 'securite'" class="space-y-8">
          <div class="max-w-2xl">
            
            <!-- Mot de passe -->
            <div class="card-modern">
              <h2 class="text-xl font-semibold text-gray-900 mb-6">Sécurité du compte</h2>
              
              <div class="space-y-6">
                <div class="flex items-center justify-between py-4 border-b border-gray-100">
                  <div>
                    <h3 class="text-sm font-medium text-gray-900">Mot de passe</h3>
                    <p class="text-sm text-gray-500">Modifiez votre mot de passe pour sécuriser votre compte</p>
                  </div>
                  <button
                    @click="changePassword"
                    class="inline-flex items-center px-4 py-2 text-sm font-medium text-blue-600 bg-blue-50 rounded-xl hover:bg-blue-100 transition-all duration-200"
                  >
                    <svg class="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M15 7a2 2 0 012 2m4 0a6 6 0 01-7.743 5.743L11 17H9v2H7v2H4a1 1 0 01-1-1v-3a1 1 0 011-1h2.586l6.414-6.414a6 6 0 018-8z" />
                    </svg>
                    Modifier
                  </button>
                </div>

                <div class="flex items-center justify-between py-4 border-b border-gray-100">
                  <div>
                    <h3 class="text-sm font-medium text-gray-900">Authentification à deux facteurs</h3>
                    <p class="text-sm text-gray-500">Ajoutez une couche de sécurité supplémentaire</p>
                  </div>
                  <button
                    class="inline-flex items-center px-4 py-2 text-sm font-medium text-gray-400 bg-gray-50 rounded-xl cursor-not-allowed"
                    disabled
                  >
                    <svg class="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" />
                    </svg>
                    Bientôt disponible
                  </button>
                </div>

                <div class="flex items-center justify-between py-4">
                  <div>
                    <h3 class="text-sm font-medium text-gray-900">Sessions actives</h3>
                    <p class="text-sm text-gray-500">Gérez les appareils connectés à votre compte</p>
                  </div>
                  <button
                    @click="viewActiveSessions"
                    class="inline-flex items-center px-4 py-2 text-sm font-medium text-blue-600 bg-blue-50 rounded-xl hover:bg-blue-100 transition-all duration-200"
                  >
                    <svg class="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 12l2 2 4-4M7.835 4.697a3.42 3.42 0 001.946-.806 3.42 3.42 0 014.438 0 3.42 3.42 0 001.946.806 3.42 3.42 0 013.138 3.138 3.42 3.42 0 00.806 1.946 3.42 3.42 0 010 4.438 3.42 3.42 0 00-.806 1.946 3.42 3.42 0 01-3.138 3.138 3.42 3.42 0 00-1.946.806 3.42 3.42 0 01-4.438 0 3.42 3.42 0 00-1.946-.806 3.42 3.42 0 01-3.138-3.138 3.42 3.42 0 00-.806-1.946 3.42 3.42 0 010-4.438 3.42 3.42 0 00.806-1.946 3.42 3.42 0 013.138-3.138z" />
                    </svg>
                    Voir les sessions
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>

        <!-- ✅ ONGLET NOTIFICATIONS -->
        <div v-show="activeTab === 'notifications'" class="space-y-8">
          <div class="max-w-2xl">
            
            <div class="card-modern">
              <h2 class="text-xl font-semibold text-gray-900 mb-6">Préférences de notifications</h2>
              
              <div class="space-y-6">
                <!-- Email Notifications -->
                <div>
                  <h3 class="text-sm font-medium text-gray-900 mb-4">Notifications par email</h3>
                  <div class="space-y-4">
                    <div class="flex items-center justify-between">
                      <div>
                        <p class="text-sm font-medium text-gray-700">Nouvelles conversations</p>
                        <p class="text-xs text-gray-500">Recevez un email quand un visiteur démarre une conversation</p>
                      </div>
                      <button
                        @click="notificationSettings.emailConversations = !notificationSettings.emailConversations"
                        :class="[
                          'relative inline-flex h-6 w-11 flex-shrink-0 cursor-pointer rounded-full border-2 border-transparent transition-colors duration-200 ease-in-out focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2',
                          notificationSettings.emailConversations ? 'bg-blue-600' : 'bg-gray-200'
                        ]"
                      >
                        <span
                          :class="[
                            'pointer-events-none inline-block h-5 w-5 transform rounded-full bg-white shadow ring-0 transition duration-200 ease-in-out',
                            notificationSettings.emailConversations ? 'translate-x-5' : 'translate-x-0'
                          ]"
                        ></span>
                      </button>
                    </div>

                    <div class="flex items-center justify-between">
                      <div>
                        <p class="text-sm font-medium text-gray-700">Nouvelles commandes</p>
                        <p class="text-xs text-gray-500">Recevez un email pour chaque nouvelle commande</p>
                      </div>
                      <button
                        @click="notificationSettings.emailOrders = !notificationSettings.emailOrders"
                        :class="[
                          'relative inline-flex h-6 w-11 flex-shrink-0 cursor-pointer rounded-full border-2 border-transparent transition-colors duration-200 ease-in-out focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2',
                          notificationSettings.emailOrders ? 'bg-blue-600' : 'bg-gray-200'
                        ]"
                      >
                        <span
                          :class="[
                            'pointer-events-none inline-block h-5 w-5 transform rounded-full bg-white shadow ring-0 transition duration-200 ease-in-out',
                            notificationSettings.emailOrders ? 'translate-x-5' : 'translate-x-0'
                          ]"
                        ></span>
                      </button>
                    </div>

                    <div class="flex items-center justify-between">
                      <div>
                        <p class="text-sm font-medium text-gray-700">Rapports hebdomadaires</p>
                        <p class="text-xs text-gray-500">Résumé des performances de vos agents IA</p>
                      </div>
                      <button
                        @click="notificationSettings.emailReports = !notificationSettings.emailReports"
                        :class="[
                          'relative inline-flex h-6 w-11 flex-shrink-0 cursor-pointer rounded-full border-2 border-transparent transition-colors duration-200 ease-in-out focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2',
                          notificationSettings.emailReports ? 'bg-blue-600' : 'bg-gray-200'
                        ]"
                      >
                        <span
                          :class="[
                            'pointer-events-none inline-block h-5 w-5 transform rounded-full bg-white shadow ring-0 transition duration-200 ease-in-out',
                            notificationSettings.emailReports ? 'translate-x-5' : 'translate-x-0'
                          ]"
                        ></span>
                      </button>
                    </div>
                  </div>
                </div>

                <!-- Actions -->
                <div class="pt-6 border-t border-gray-100">
                  <button
                    @click="saveNotificationSettings"
                    :disabled="savingNotifications"
                    class="inline-flex items-center px-6 py-3 bg-blue-600 text-white font-medium rounded-xl hover:bg-blue-700 disabled:opacity-50 transition-all duration-200"
                  >
                    <svg v-if="savingNotifications" class="animate-spin -ml-1 mr-3 h-4 w-4 text-white" fill="none" viewBox="0 0 24 24">
                      <circle class="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" stroke-width="4"></circle>
                      <path class="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                    </svg>
                    {{ savingNotifications ? 'Sauvegarde...' : 'Sauvegarder les préférences' }}
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>

        <!-- ✅ ONGLET DONNÉES -->
        <div v-show="activeTab === 'donnees'" class="space-y-8">
          <div class="max-w-2xl">
            
            <!-- Export de données -->
            <div class="card-modern">
              <h2 class="text-xl font-semibold text-gray-900 mb-6">Gestion des données</h2>
              
              <div class="space-y-6">
                <div class="p-4 bg-blue-50 border border-blue-200 rounded-lg">
                  <div class="flex">
                    <div class="flex-shrink-0">
                      <svg class="h-5 w-5 text-blue-400" fill="currentColor" viewBox="0 0 20 20">
                        <path fill-rule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7-4a1 1 0 11-2 0 1 1 0 012 0zM9 9a1 1 0 000 2v3a1 1 0 001 1h1a1 1 0 100-2v-3a1 1 0 00-1-1H9z" clip-rule="evenodd"/>
                      </svg>
                    </div>
                    <div class="ml-3">
                      <h3 class="text-sm font-medium text-blue-800">Exportation des données</h3>
                      <div class="mt-2 text-sm text-blue-700">
                        <p>Téléchargez toutes vos données en format JSON. Inclut votre profil, conversations, commandes et paramètres.</p>
                      </div>
                    </div>
                  </div>
                </div>

                <div class="flex items-center justify-between py-4 border-b border-gray-100">
                  <div>
                    <h3 class="text-sm font-medium text-gray-900">Exporter mes données</h3>
                    <p class="text-sm text-gray-500">Obtenez une copie complète de vos données</p>
                  </div>
                  <button
                    @click="exportData"
                    :disabled="exporting"
                    class="inline-flex items-center px-4 py-2 text-sm font-medium text-blue-600 bg-blue-50 rounded-xl hover:bg-blue-100 disabled:opacity-50 transition-all duration-200"
                  >
                    <svg v-if="exporting" class="animate-spin w-4 h-4 mr-2" fill="none" viewBox="0 0 24 24">
                      <circle class="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" stroke-width="4"></circle>
                      <path class="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                    </svg>
                    <svg v-else class="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 10v6m0 0l-3-3m3 3l3-3M3 17V7a2 2 0 012-2h6l2 2h6a2 2 0 012 2v8a2 2 0 01-2 2H5a2 2 0 01-2-2z" />
                    </svg>
                    {{ exporting ? 'Export en cours...' : 'Télécharger mes données' }}
                  </button>
                </div>

                <!-- Zone dangereuse -->
                <div class="pt-6 border-t border-red-100">
                  <div class="p-4 bg-red-50 border border-red-200 rounded-lg">
                    <div class="flex">
                      <div class="flex-shrink-0">
                        <svg class="h-5 w-5 text-red-400" fill="currentColor" viewBox="0 0 20 20">
                          <path fill-rule="evenodd" d="M8.257 3.099c.765-1.36 2.722-1.36 3.486 0l5.58 9.92c.75 1.334-.213 2.98-1.742 2.98H4.42c-1.53 0-2.493-1.646-1.743-2.98l5.58-9.92zM11 13a1 1 0 11-2 0 1 1 0 012 0zm-1-8a1 1 0 00-1 1v3a1 1 0 002 0V6a1 1 0 00-1-1z" clip-rule="evenodd"/>
                        </svg>
                      </div>
                      <div class="ml-3">
                        <h3 class="text-sm font-medium text-red-800">Zone dangereuse</h3>
                        <div class="mt-2 text-sm text-red-700">
                          <p>La suppression de votre compte est irréversible. Toutes vos données seront définitivement effacées.</p>
                        </div>
                        <div class="mt-4">
                          <button
                            @click="showDeleteConfirmation = true"
                            class="inline-flex items-center px-4 py-2 text-sm font-medium text-red-600 bg-red-100 rounded-xl hover:bg-red-200 transition-all duration-200"
                          >
                            <svg class="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                            </svg>
                            Supprimer mon compte
                          </button>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>

    <!-- Success Toast -->
    <div
      v-if="showSuccessToast"
      class="fixed bottom-4 right-4 bg-green-600 text-white px-6 py-3 rounded-lg shadow-lg z-50 transform transition-all duration-300"
    >
      <div class="flex items-center">
        <svg class="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M5 13l4 4L19 7"/>
        </svg>
        {{ successMessage }}
      </div>
    </div>

    <!-- Delete Confirmation Modal -->
    <div v-if="showDeleteConfirmation" class="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
      <div class="bg-white rounded-lg p-6 max-w-md mx-4">
        <h3 class="text-lg font-medium text-gray-900 mb-4">Confirmer la suppression</h3>
        <p class="text-sm text-gray-600 mb-6">
          Êtes-vous sûr de vouloir supprimer votre compte ? Cette action est irréversible et toutes vos données seront définitivement effacées.
        </p>
        <div class="flex space-x-4">
          <button
            @click="showDeleteConfirmation = false"
            class="flex-1 px-4 py-2 text-sm font-medium text-gray-700 bg-gray-100 rounded-lg hover:bg-gray-200 transition-colors"
          >
            Annuler
          </button>
          <button
            @click="deleteAccount"
            class="flex-1 px-4 py-2 text-sm font-medium text-white bg-red-600 rounded-lg hover:bg-red-700 transition-colors"
          >
            Supprimer définitivement
          </button>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, reactive, computed, onMounted, watch } from 'vue'
import { useAuthStore } from '~/stores/auth'

// ✅ PAGE META
definePageMeta({
  middleware: 'auth',
  layout: 'default'
})

// ✅ COMPOSABLES
const authStore = useAuthStore()
const route = useRoute()
const api = useApi()

// ✅ REACTIVE STATE
const initialLoading = ref(true)
const loading = ref(false)
const updating = ref(false)
const updatingShop = ref(false)
const exporting = ref(false)
const savingNotifications = ref(false)
const editingProfile = ref(false)
const editingShop = ref(false)
const showSuccessToast = ref(false)
const showDeleteConfirmation = ref(false)
const successMessage = ref('')
const connectionStatus = ref('Connecté')

// ✅ TABS OPTIMISÉS
const tabs = [
  { 
    id: 'profil', 
    label: 'Profil',
    icon: 'M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z'
  },
  { 
    id: 'boutique', 
    label: 'Boutique',
    icon: 'M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4'
  },
  { 
    id: 'securite', 
    label: 'Sécurité',
    icon: 'M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z'
  },
  { 
    id: 'notifications', 
    label: 'Notifications',
    icon: 'M15 17h5l-1.405-1.405A2.032 2.032 0 0118 14.158V11a6.002 6.002 0 00-4-5.659V5a2 2 0 10-4 0v.341C7.67 6.165 6 8.388 6 11v3.159c0 .538-.214 1.055-.595 1.436L4 17h5m6 0v1a3 3 0 11-6 0v-1m6 0H9'
  },
  { 
    id: 'donnees', 
    label: 'Données',
    icon: 'M12 10v6m0 0l-3-3m3 3l3-3M3 17V7a2 2 0 012-2h6l2 2h6a2 2 0 012 2v8a2 2 0 01-2 2H5a2 2 0 01-2-2z'
  }
]

const activeTab = ref('profil')

// ✅ FORMS RÉACTIFS
const profileForm = reactive({
  firstName: '',
  lastName: '',
  email: ''
})

const shopForm = reactive({
  name: '',
  domain: ''
})

const notificationSettings = reactive({
  emailConversations: true,
  emailOrders: true,
  emailReports: false
})

// ✅ DATA STATE
const shopData = ref<any>(null)
const accountStats = ref<any>({
  totalConversations: 0,
  totalOrders: 0,
  totalRevenue: 0,
  conversionRate: 0,
  activeAgents: 0,
  documentsCount: 0
})

// ✅ COMPUTED
const userDisplayName = computed(() => {
  if (profileForm.firstName && profileForm.lastName) {
    return `${profileForm.firstName} ${profileForm.lastName}`
  }
  return authStore.userName || authStore.userEmail?.split('@')[0] || 'Utilisateur'
})

const userInitials = computed(() => {
  if (profileForm.firstName && profileForm.lastName) {
    return `${profileForm.firstName[0]}${profileForm.lastName[0]}`.toUpperCase()
  }
  return authStore.userInitials
})

const memberSince = computed(() => {
  if (authStore.user?.createdAt) {
    return new Date(authStore.user.createdAt).toLocaleDateString('fr-FR', {
      year: 'numeric',
      month: 'long'
    })
  }
  return 'N/A'
})

const planDisplayName = computed(() => {
  const plan = authStore.currentPlan
  switch (plan) {
    case 'free': return 'Essai Gratuit'
    case 'starter': return 'Starter'
    case 'pro': 
    case 'professional': return 'Pro'
    case 'enterprise': return 'Enterprise'
    default: return 'Aucun plan'
  }
})

const planBadgeClass = computed(() => {
  const plan = authStore.currentPlan
  switch (plan) {
    case 'free': return 'bg-gray-100 text-gray-800'
    case 'starter': return 'bg-blue-100 text-blue-800'
    case 'pro':
    case 'professional': return 'bg-purple-100 text-purple-800'
    case 'enterprise': return 'bg-green-100 text-green-800'
    default: return 'bg-gray-100 text-gray-800'
  }
})

const planLimits = computed(() => {
  const plan = authStore.currentPlan
  switch (plan) {
    case 'free': return { agents: 1, documents: 10 }
    case 'starter': return { agents: 1, documents: 10 }
    case 'pro':
    case 'professional': return { agents: 3, documents: 50 }
    case 'enterprise': return { agents: -1, documents: -1 }
    default: return { agents: 0, documents: 0 }
  }
})

// ✅ METHODS
const setActiveTab = (tabId: string) => {
  activeTab.value = tabId
  navigateTo({ query: { ...route.query, tab: tabId } }, { replace: true })
}

const showNotification = (message: string) => {
  successMessage.value = message
  showSuccessToast.value = true
  setTimeout(() => {
    showSuccessToast.value = false
  }, 3000)
}

const formatCurrency = (amount: number) => {
  return new Intl.NumberFormat('fr-FR', {
    style: 'currency',
    currency: 'EUR'
  }).format(amount)
}

// ✅ DATA LOADING
const loadShopData = async () => {
  try {
    const shopId = authStore.userShopId
    if (!shopId) return

    console.log('📊 Chargement données shop:', shopId)
    
    const response = await api.shops.get(shopId)
    if (response.success && response.data) {
      shopData.value = response.data
      
      // Remplir le formulaire shop
      shopForm.name = response.data.name || ''
      shopForm.domain = response.data.domain || ''
      
      console.log('✅ Données shop chargées:', response.data)
    }
  } catch (error) {
    console.error('❌ Erreur chargement shop:', error)
  }
}

const loadAccountStats = async () => {
  try {
    console.log('📊 Chargement statistiques compte...')
    
    const response = await api.analytics.dashboard()
    if (response.success && response.data) {
      accountStats.value = {
        totalConversations: response.data.totalConversations || 0,
        totalOrders: response.data.totalOrders || 0,
        totalRevenue: response.data.totalRevenue || 0,
        conversionRate: response.data.conversionRate || 0,
        activeAgents: response.data.activeAgents || 0,
        documentsCount: response.data.documentsCount || 0
      }
      console.log('✅ Statistiques chargées:', accountStats.value)
    }
  } catch (error) {
    console.error('❌ Erreur chargement statistiques:', error)
    // Garder les valeurs par défaut en cas d'erreur
  }
}

const refreshData = async () => {
  loading.value = true
  try {
    await Promise.all([
      loadShopData(),
      loadAccountStats()
    ])
    showNotification('Données actualisées avec succès !')
  } catch (error) {
    console.error('❌ Erreur actualisation:', error)
  } finally {
    loading.value = false
  }
}

// ✅ PROFILE ACTIONS
const updateProfile = async () => {
  updating.value = true
  
  try {
    const result = await authStore.updateProfile({
      firstName: profileForm.firstName,
      lastName: profileForm.lastName,
      name: `${profileForm.firstName} ${profileForm.lastName}`.trim()
    })
    
    if (result.success) {
      editingProfile.value = false
      showNotification('Profil mis à jour avec succès !')
    } else {
      console.error('❌ Erreur mise à jour profil:', result.error)
    }
  } catch (error) {
    console.error('❌ Erreur:', error)
  } finally {
    updating.value = false
  }
}

const cancelEdit = () => {
  editingProfile.value = false
  // Restaurer les valeurs originales
  profileForm.firstName = authStore.user?.firstName || ''
  profileForm.lastName = authStore.user?.lastName || ''
  profileForm.email = authStore.userEmail || ''
}

// ✅ SHOP ACTIONS
const updateShop = async () => {
  updatingShop.value = true
  
  try {
    const shopId = authStore.userShopId
    if (!shopId) throw new Error('Shop ID manquant')

    const response = await api.shops.update(shopId, {
      name: shopForm.name,
      domain: shopForm.domain || null
    })
    
    if (response.success) {
      editingShop.value = false
      shopData.value = response.data
      showNotification('Boutique mise à jour avec succès !')
    } else {
      console.error('❌ Erreur mise à jour shop:', response.error)
    }
  } catch (error) {
    console.error('❌ Erreur:', error)
  } finally {
    updatingShop.value = false
  }
}

const cancelShopEdit = () => {
  editingShop.value = false
  shopForm.name = shopData.value?.name || ''
  shopForm.domain = shopData.value?.domain || ''
}

const copyShopId = async () => {
  try {
    const shopId = shopData.value?.id || authStore.userShopId
    await navigator.clipboard.writeText(shopId || '')
    showNotification('ID copié dans le presse-papiers !')
  } catch (error) {
    console.error('❌ Erreur copie:', error)
  }
}

// ✅ SECURITY ACTIONS
const changePassword = () => {
  // Redirection vers reset password avec contexte "change"
  navigateTo('/reset-password?mode=change')
}

const viewActiveSessions = () => {
  // Pour l'instant, juste un message
  showNotification('Fonctionnalité des sessions actives bientôt disponible')
}

// ✅ NOTIFICATION ACTIONS
const saveNotificationSettings = async () => {
  savingNotifications.value = true
  
  try {
    // TODO: Sauvegarder via API quand les endpoints seront prêts
    await new Promise(resolve => setTimeout(resolve, 1000))
    showNotification('Préférences de notifications sauvegardées !')
  } catch (error) {
    console.error('❌ Erreur sauvegarde notifications:', error)
  } finally {
    savingNotifications.value = false
  }
}

// ✅ DATA ACTIONS
const exportData = async () => {
  exporting.value = true
  
  try {
    console.log('📥 Export des données utilisateur...')
    
    // Récupérer toutes les données via API
    const [shopResponse, statsResponse] = await Promise.all([
      api.shops.get(authStore.userShopId || '').catch(() => ({ success: false, data: null })),
      api.analytics.dashboard().catch(() => ({ success: false, data: null }))
    ])

    const exportData = {
      profile: {
        firstName: profileForm.firstName,
        lastName: profileForm.lastName,
        email: profileForm.email,
        shopId: authStore.userShopId,
        memberSince: memberSince.value,
        plan: authStore.currentPlan
      },
      shop: shopResponse.success ? shopResponse.data : null,
      statistics: statsResponse.success ? statsResponse.data : null,
      settings: {
        notifications: notificationSettings
      },
      metadata: {
        exportedAt: new Date().toISOString(),
        version: '1.0'
      }
    }

    // Créer et télécharger le fichier
    const dataStr = JSON.stringify(exportData, null, 2)
    const dataBlob = new Blob([dataStr], { type: 'application/json' })
    
    const url = window.URL.createObjectURL(dataBlob)
    const link = document.createElement('a')
    link.href = url
    link.download = `chatseller-export-${new Date().toISOString().split('T')[0]}.json`
    
    document.body.appendChild(link)
    link.click()
    document.body.removeChild(link)
    window.URL.revokeObjectURL(url)
    
    showNotification('Données exportées avec succès !')
    
  } catch (error) {
    console.error('❌ Erreur export:', error)
  } finally {
    exporting.value = false
  }
}

const deleteAccount = async () => {
  try {
    // TODO: Implémenter la suppression de compte via API
    console.log('⚠️ Suppression de compte demandée')
    showDeleteConfirmation.value = false
    
    // Pour l'instant, juste déconnecter
    await authStore.logout()
    navigateTo('/login')
    
  } catch (error) {
    console.error('❌ Erreur suppression compte:', error)
  }
}

// ✅ LIFECYCLE
onMounted(async () => {
  try {
    // Initialiser les formulaires
    profileForm.firstName = authStore.user?.firstName || ''
    profileForm.lastName = authStore.user?.lastName || ''
    profileForm.email = authStore.userEmail || ''

    // Charger les données
    await Promise.all([
      loadShopData(),
      loadAccountStats()
    ])

    // Gestion de l'onglet via URL
    const tab = route.query.tab as string
    if (tab && tabs.some(t => t.id === tab)) {
      activeTab.value = tab
    }
    
  } catch (error) {
    console.error('❌ Erreur initialisation:', error)
  } finally {
    initialLoading.value = false
  }
})

// ✅ WATCH ROUTE
watch(() => route.query.tab, (newTab) => {
  if (newTab && typeof newTab === 'string' && tabs.some(tab => tab.id === newTab)) {
    activeTab.value = newTab
  }
}, { immediate: true })

// ✅ SEO
useHead({
  title: 'Paramètres - ChatSeller Dashboard'
})
</script>

<style scoped>
/* ✅ MODERN COMPONENTS */
.card-modern {
  @apply bg-white rounded-xl shadow-sm border border-gray-200 p-6;
}

.input-modern {
  @apply px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-colors text-sm;
}

/* ✅ RESPONSIVE */
@media (max-width: 768px) {
  .card-modern {
    @apply p-4;
  }
}

/* ✅ ANIMATIONS */
.transition-all {
  transition: all 0.2s cubic-bezier(0.4, 0, 0.2, 1);
}
</style>