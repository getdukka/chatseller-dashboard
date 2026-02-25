<!-- pages/settings.vue -->
<template>
  <div class="min-h-screen bg-gradient-to-br from-rose-50 via-pink-50 to-purple-50">
    <!-- Header Beauté -->
    <div class="bg-white shadow-sm border-b border-gray-200">
      <div class="px-8 py-6">
        <div class="flex items-center justify-between">
          <div>
            <h1 class="text-3xl font-bold text-gray-900">Paramètres de votre marque</h1>
            <p class="mt-2 text-gray-600">
              Configurez votre profil et vos préférences
            </p>
          </div>
          
          <div class="flex items-center space-x-4">
            <!-- Beauty Status Badge -->
            <div class="flex items-center space-x-2 px-3 py-1 bg-gradient-to-r from-rose-100 to-pink-100 rounded-full">
              <div class="w-2 h-2 bg-rose-500 rounded-full animate-pulse"></div>
              <span class="text-sm text-rose-700 font-medium">{{ connectionStatus }}</span>
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
      <!-- Tabs Navigation Beauté -->
      <div class="border-b border-gray-200 mb-8">
        <nav class="-mb-px flex space-x-8">
          <button
            v-for="tab in tabs"
            :key="tab.id"
            @click="setActiveTab(tab.id)"
            :class="[
              'py-3 px-1 border-b-2 font-medium text-sm transition-colors',
              activeTab === tab.id
                ? 'border-rose-500 text-rose-600'
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
        <div class="animate-spin rounded-full h-8 w-8 border-b-2 border-rose-600"></div>
      </div>

      <!-- Tab Content -->
      <div v-else class="max-w-6xl">
        
        <!-- ✅ ONGLET PROFIL BEAUTÉ -->
        <div v-show="activeTab === 'profil'" class="space-y-8">
          <div class="grid grid-cols-1 lg:grid-cols-3 gap-8">
            
            <!-- Informations personnelles -->
            <div class="lg:col-span-2">
              <div class="card-beauty">
                <div class="flex items-center justify-between mb-6">
                  <h2 class="text-xl font-semibold text-gray-900">Votre profil personnel</h2>
                  <button 
                    @click="editingProfile = !editingProfile"
                    class="inline-flex items-center px-4 py-2 text-sm font-medium rounded-xl transition-all duration-200"
                    :class="editingProfile 
                      ? 'bg-gray-100 text-gray-700 hover:bg-gray-200' 
                      : 'bg-rose-50 text-rose-700 hover:bg-rose-100'"
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
                        class="input-beauty w-full disabled:bg-gray-50 disabled:text-gray-500"
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
                        class="input-beauty w-full disabled:bg-gray-50 disabled:text-gray-500"
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
                      class="input-beauty w-full bg-gray-50 text-gray-500"
                      placeholder="votre@email.com"
                    />
                    <p class="text-xs text-gray-500 mt-1">L'email ne peut pas être modifié</p>
                  </div>

                  <!-- Position chez la marque -->
                  <div>
                    <label for="role" class="block text-sm font-medium text-gray-700 mb-2">
                      Votre position chez {{ brandForm.name || 'votre marque' }}
                    </label>
                    <select
                      id="role"
                      v-model="profileForm.beautyRole"
                      :disabled="!editingProfile"
                      class="input-beauty w-full disabled:bg-gray-50 disabled:text-gray-500"
                    >
                      <option value="">Sélectionnez votre rôle</option>
                      <option value="founder">Fondateur/Fondatrice</option>
                      <option value="brand_manager">Brand Manager</option>
                      <option value="marketing_manager">Responsable Marketing</option>
                      <option value="ecommerce_manager">Responsable E-commerce</option>
                      <option value="beauty_expert">Expert(e) Beauté</option>
                      <option value="other">Autre</option>
                    </select>
                  </div>

                  <!-- Expérience -->
                  <div>
                    <label for="experience" class="block text-sm font-medium text-gray-700 mb-2">
                      Années d'expérience
                    </label>
                    <select
                      id="experience"
                      v-model="profileForm.beautyExperience"
                      :disabled="!editingProfile"
                      class="input-beauty w-full disabled:bg-gray-50 disabled:text-gray-500"
                    >
                      <option value="">Sélectionnez</option>
                      <option value="0-1">0-1 an</option>
                      <option value="2-5">2-5 ans</option>
                      <option value="6-10">6-10 ans</option>
                      <option value="10+">Plus de 10 ans</option>
                    </select>
                  </div>

                  <!-- Boutons d'action -->
                  <div v-if="editingProfile" class="flex items-center space-x-4 pt-4">
                    <button
                      type="submit"
                      :disabled="updating"
                      class="inline-flex items-center px-6 py-3 bg-gradient-to-r from-rose-600 to-pink-600 text-white font-medium rounded-xl hover:from-rose-700 hover:to-pink-700 focus:ring-2 focus:ring-rose-500 focus:ring-offset-2 transition-all duration-200 disabled:opacity-50 disabled:cursor-not-allowed"
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

            <!-- Résumé du compte beauté -->
            <div class="space-y-6">
              <!-- Activité du compte -->
              <div class="card-beauty">
                <h3 class="text-lg font-semibold text-gray-900 mb-4">Activité de votre marque</h3>
                
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
                    <span class="text-sm text-gray-600">Conversations avec vos clients</span>
                    <span class="text-sm font-medium text-gray-900">{{ beautyStats.totalConsultations || 0 }}</span>
                  </div>
                  <div class="flex items-center justify-between">
                    <span class="text-sm text-gray-600">Taux de conversion</span>
                    <span class="text-sm font-medium text-rose-600">{{ beautyStats.conversionRate || 0 }}%</span>
                  </div>
                </div>
              </div>

            </div>
          </div>
        </div>

        <!-- ✅ ONGLET MARQUE BEAUTÉ -->
        <div v-show="activeTab === 'marque'" class="space-y-8">
          <div class="grid grid-cols-1 lg:grid-cols-2 gap-8">
            
            <!-- Informations marque beauté -->
            <div class="card-beauty">
              <div class="flex items-center justify-between mb-6">
                <h2 class="text-xl font-semibold text-gray-900">Informations de votre marque</h2>
                <button 
                  @click="editingBrand = !editingBrand"
                  class="inline-flex items-center px-4 py-2 text-sm font-medium rounded-xl transition-all duration-200"
                  :class="editingBrand 
                    ? 'bg-gray-100 text-gray-700 hover:bg-gray-200' 
                    : 'bg-rose-50 text-rose-700 hover:bg-rose-100'"
                >
                  <svg class="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" />
                  </svg>
                  {{ editingBrand ? 'Annuler' : 'Modifier' }}
                </button>
              </div>

              <form @submit.prevent="updateBrand" class="space-y-6">
                <div>
                  <label for="brandName" class="block text-sm font-medium text-gray-700 mb-2">
                    Nom de votre marque
                  </label>
                  <input
                    id="brandName"
                    v-model="brandForm.name"
                    type="text"
                    :disabled="!editingBrand"
                    class="input-beauty w-full disabled:bg-gray-50 disabled:text-gray-500"
                    placeholder="Nom de votre marque"
                  />
                </div>

                <!-- Catégorie beauté -->
                <div>
                  <label for="beautyCategory" class="block text-sm font-medium text-gray-700 mb-2">
                    Domaine de spécialité
                  </label>
                  <select
                    id="beautyCategory"
                    v-model="brandForm.beautyCategory"
                    :disabled="!editingBrand"
                    class="input-beauty w-full disabled:bg-gray-50 disabled:text-gray-500"
                  >
                    <option value="">Sélectionnez votre spécialité</option>
                    <option value="skincare">Soins visage (Skincare)</option>
                    <option value="makeup">Maquillage</option>
                    <option value="fragrance">Parfums & Fragrances</option>
                    <option value="haircare">Soins capillaires</option>
                    <option value="bodycare">Soins corps</option>
                    <option value="multi">Multi-spécialités</option>
                  </select>
                </div>

                <!-- Plateforme e-commerce -->
                <div>
                  <label for="platform" class="block text-sm font-medium text-gray-700 mb-2">
                    Plateforme e-commerce
                  </label>
                  <select
                    id="platform"
                    v-model="brandForm.platform"
                    :disabled="!editingBrand"
                    class="input-beauty w-full disabled:bg-gray-50 disabled:text-gray-500"
                  >
                    <option value="">Sélectionnez votre plateforme</option>
                    <option value="shopify">Shopify</option>
                    <option value="woocommerce">WooCommerce</option>
                    <option value="other">Autre</option>
                  </select>
                </div>

                <div>
                  <label for="website" class="block text-sm font-medium text-gray-700 mb-2">
                    Site web 
                  </label>
                  <input
                    id="website"
                    v-model="brandForm.website"
                    type="url"
                    :disabled="!editingBrand"
                    class="input-beauty w-full disabled:bg-gray-50 disabled:text-gray-500"
                    placeholder="https://votreboutique.com"
                  />
                  <p class="text-xs text-gray-500 mt-1">URL de votre boutique en ligne</p>
                </div>

                <!-- Devise par défaut -->
                <div>
                  <label for="defaultCurrency" class="block text-sm font-medium text-gray-700 mb-2">
                    Devise d'affichage
                  </label>
                  <select
                    id="defaultCurrency"
                    v-model="brandForm.defaultCurrency"
                    :disabled="!editingBrand"
                    class="input-beauty w-full disabled:bg-gray-50 disabled:text-gray-500"
                  >
                    <option value="XOF">Franc CFA (XOF) - Afrique de l'Ouest</option>
                    <option value="EUR">Euro (EUR)</option>
                    <option value="USD">Dollar US (USD)</option>
                    <option value="GBP">Livre Sterling (GBP)</option>
                    <option value="MAD">Dirham Marocain (MAD)</option>
                    <option value="TND">Dinar Tunisien (TND)</option>
                    <option value="DZD">Dinar Algérien (DZD)</option>
                  </select>
                  <p class="text-xs text-gray-500 mt-1">Devise utilisée pour afficher les prix dans le Dashboard et le Widget</p>
                </div>

                <!-- Gamme de prix -->
                <div>
                  <label for="priceRange" class="block text-sm font-medium text-gray-700 mb-2">
                    Gamme de prix
                  </label>
                  <select
                    id="priceRange"
                    v-model="brandForm.priceRange"
                    :disabled="!editingBrand"
                    class="input-beauty w-full disabled:bg-gray-50 disabled:text-gray-500"
                  >
                    <option value="">Sélectionnez votre gamme</option>
                    <option value="budget">Budget (0-25€)</option>
                    <option value="mid_range">Moyenne gamme (25-75€)</option>
                    <option value="premium">Premium (75-150€)</option>
                    <option value="luxury">Luxe (150€+)</option>
                  </select>
                </div>

                <!-- Cible d'âge -->
                <div>
                  <label for="targetAge" class="block text-sm font-medium text-gray-700 mb-2">
                    Clientèle cible (âge)
                  </label>
                  <select
                    id="targetAge"
                    v-model="brandForm.targetAge"
                    :disabled="!editingBrand"
                    class="input-beauty w-full disabled:bg-gray-50 disabled:text-gray-500"
                  >
                    <option value="">Sélectionnez</option>
                    <option value="teen">Adolescents (13-19 ans)</option>
                    <option value="young_adult">Jeunes adultes (20-29 ans)</option>
                    <option value="adult">Adultes (30-45 ans)</option>
                    <option value="mature">Matures (45+ ans)</option>
                    <option value="all_ages">Tous âges</option>
                  </select>
                </div>

                <div>
                  <label class="block text-sm font-medium text-gray-700 mb-2">ID de la marque</label>
                  <div class="flex items-center space-x-2">
                    <input
                      :value="shopData?.id || authStore.userShopId"
                      readonly
                      class="flex-1 input-beauty bg-gray-50 text-gray-500 text-sm font-mono"
                    />
                    <button
                      @click="copyBrandId"
                      type="button"
                      class="inline-flex items-center justify-center w-10 h-10 rounded-xl bg-rose-50 text-rose-600 hover:bg-rose-100 transition-all duration-200"
                      title="Copier l'ID"
                    >
                      <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M8 16H6a2 2 0 01-2-2V6a2 2 0 012-2h8a2 2 0 012 2v2m-6 12h8a2 2 0 002-2v-8a2 2 0 00-2-2h-8a2 2 0 00-2 2v8a2 2 0 002 2z" />
                      </svg>
                    </button>
                  </div>
                </div>

                <!-- Boutons d'action -->
                <div v-if="editingBrand" class="flex items-center space-x-4 pt-4">
                  <button
                    type="submit"
                    :disabled="updatingBrand"
                    class="inline-flex items-center px-6 py-3 bg-gradient-to-r from-rose-600 to-pink-600 text-white font-medium rounded-xl hover:from-rose-700 hover:to-pink-700 disabled:opacity-50 transition-all duration-200"
                  >
                    <svg v-if="updatingBrand" class="animate-spin -ml-1 mr-3 h-4 w-4 text-white" fill="none" viewBox="0 0 24 24">
                      <circle class="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" stroke-width="4"></circle>
                      <path class="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                    </svg>
                    {{ updatingBrand ? 'Mise à jour...' : 'Sauvegarder' }}
                  </button>
                  <button
                    type="button"
                    @click="cancelBrandEdit"
                    class="inline-flex items-center px-6 py-3 bg-white text-gray-700 font-medium rounded-xl border border-gray-200 hover:bg-gray-50 transition-all duration-200"
                  >
                    Annuler
                  </button>
                </div>
              </form>
            </div>

            <!-- Analytics marque beauté -->
            <div class="card-beauty">
              <h2 class="text-xl font-semibold text-gray-900 mb-6">Analytics de votre marque</h2>
              
              <div class="space-y-6">
                <div class="grid grid-cols-2 gap-4">
                  <div class="text-center p-4 bg-rose-50 rounded-lg">
                    <div class="text-2xl font-bold text-rose-600">{{ beautyStats.totalConsultations || 0 }}</div>
                    <div class="text-sm text-rose-600">Conversations avec vos clients</div>
                  </div>
                  <div class="text-center p-4 bg-purple-50 rounded-lg">
                    <div class="text-2xl font-bold text-purple-600">{{ beautyStats.conversions || 0 }}</div>
                    <div class="text-sm text-purple-600">Conversions</div>
                  </div>
                </div>

                <div class="grid grid-cols-2 gap-4">
                  <div class="text-center p-4 bg-emerald-50 rounded-lg">
                    <div class="text-2xl font-bold text-emerald-600">{{ formatCurrency(beautyStats.revenue || 0) }}</div>
                    <div class="text-sm text-emerald-600">CA généré</div>
                  </div>
                  <div class="text-center p-4 bg-amber-50 rounded-lg">
                    <div class="text-2xl font-bold text-amber-600">{{ beautyStats.conversionRate || 0 }}%</div>
                    <div class="text-sm text-amber-600">Taux conversion</div>
                  </div>
                </div>

                <!-- Plan et usage nouveaux plans -->
                <div class="border-t pt-6">
                  <h3 class="font-medium text-gray-900 mb-3">Plan ChatSeller</h3>
                  <div class="space-y-3">
                    <div class="flex items-center justify-between">
                      <span class="text-sm text-gray-600">Plan actuel</span>
                      <div class="flex items-center space-x-2">
                        <span class="inline-flex items-center px-2 py-1 rounded-full text-xs font-medium" :class="planBadgeClass">
                          {{ planDisplayName }}
                        </span>
                        <NuxtLink to="/billing" class="text-xs text-rose-600 hover:text-rose-700 font-medium">
                          Gérer
                        </NuxtLink>
                      </div>
                    </div>
                    
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>

        <!-- ✅ ONGLET NOTIFICATIONS BEAUTÉ -->
        <div v-show="activeTab === 'notifications'" class="space-y-8">
          <div class="max-w-2xl">
            
            <div class="card-beauty">
              <h2 class="text-xl font-semibold text-gray-900 mb-6">Notifications</h2>

              <div class="space-y-6">
                <!-- Notifications activité -->
                <div>
                  <h3 class="text-sm font-medium text-gray-900 mb-4">Activité ChatSeller</h3>
                  <div class="space-y-4">
                    <div class="flex items-center justify-between">
                      <div>
                        <p class="text-sm font-medium text-gray-700">Nouvelles conversations</p>
                        <p class="text-xs text-gray-500">Notification quand une cliente démarre une conversation</p>
                      </div>
                      <ToggleSwitch 
                        :modelValue="notificationSettings.beautyConsultations"
                        @update:modelValue="(value) => updateNotificationSetting('beautyConsultations', value)"
                      />
                    </div>

                    <div class="flex items-center justify-between">
                      <div>
                        <p class="text-sm font-medium text-gray-700">Nouvelles commandes via chat</p>
                        <p class="text-xs text-gray-500">Alerte quand une commande est passée via votre Vendeuse IA</p>
                      </div>
                      <ToggleSwitch
                        :modelValue="notificationSettings.routineConversions"
                        @update:modelValue="(value) => updateNotificationSetting('routineConversions', value)"
                      />
                    </div>

                    <div class="flex items-center justify-between">
                      <div>
                        <p class="text-sm font-medium text-gray-700">Résumé hebdomadaire</p>
                        <p class="text-xs text-gray-500">Bilan de la semaine : conversations, ventes, taux de conversion</p>
                      </div>
                      <ToggleSwitch
                        :modelValue="notificationSettings.beautyInsights"
                        @update:modelValue="(value) => updateNotificationSetting('beautyInsights', value)"
                      />
                    </div>
                  </div>
                </div>

                <!-- Notifications business -->
                <div class="pt-6 border-t border-gray-100">
                  <h3 class="text-sm font-medium text-gray-900 mb-4">Emails & alertes</h3>
                  <div class="space-y-4">
                    <div class="flex items-center justify-between">
                      <div>
                        <p class="text-sm font-medium text-gray-700">Email par vente</p>
                        <p class="text-xs text-gray-500">Recevoir un email pour chaque vente générée par votre Vendeuse IA</p>
                      </div>
                      <ToggleSwitch 
                        :modelValue="notificationSettings.sales"
                        @update:modelValue="(value) => updateNotificationSetting('sales', value)"
                      />
                    </div>

                    <div class="flex items-center justify-between">
                      <div>
                        <p class="text-sm font-medium text-gray-700">Rapports de performance</p>
                        <p class="text-xs text-gray-500">Analytics hebdomadaires de votre Vendeuse IA</p>
                      </div>
                      <ToggleSwitch 
                        :modelValue="notificationSettings.performanceReports"
                        @update:modelValue="(value) => updateNotificationSetting('performanceReports', value)"
                      />
                    </div>

                    <div class="flex items-center justify-between">
                      <div>
                        <p class="text-sm font-medium text-gray-700">Alertes quota</p>
                        <p class="text-xs text-gray-500">Prévenir quand vous approchez des limites de votre plan</p>
                      </div>
                      <ToggleSwitch 
                        :modelValue="notificationSettings.quotaAlerts"
                        @update:modelValue="(value) => updateNotificationSetting('quotaAlerts', value)"
                      />
                    </div>
                  </div>
                </div>

                <!-- Actions -->
                <div class="pt-6 border-t border-gray-100">
                  <div v-if="savingNotifications" class="flex items-center justify-center py-3">
                    <svg class="animate-spin h-4 w-4 text-rose-600 mr-2" fill="none" viewBox="0 0 24 24">
                      <circle class="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" stroke-width="4"></circle>
                      <path class="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                    </svg>
                    <span class="text-sm text-gray-600">Sauvegarde des préférences...</span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>

        <!-- ✅ ONGLET DONNÉES BEAUTÉ -->
        <div v-show="activeTab === 'donnees'" class="space-y-8">
          <div class="max-w-2xl">
            
            <!-- Export de données beauté -->
            <div class="card-beauty">
              <h2 class="text-xl font-semibold text-gray-900 mb-6">Gestion des données</h2>
              
              <div class="space-y-6">
                <div class="p-4 bg-rose-50 border border-rose-200 rounded-lg">
                  <div class="flex">
                    <div class="flex-shrink-0">
                      <svg class="h-5 w-5 text-rose-400" fill="currentColor" viewBox="0 0 20 20">
                        <path fill-rule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7-4a1 1 0 11-2 0 1 1 0 012 0zM9 9a1 1 0 000 2v3a1 1 0 001 1h1a1 1 0 100-2v-3a1 1 0 00-1-1H9z" clip-rule="evenodd"/>
                      </svg>
                    </div>
                    <div class="ml-3">
                      <h3 class="text-sm font-medium text-rose-800">Export complet de vos données</h3>
                      <div class="mt-2 text-sm text-rose-700">
                        <p>Inclut les conversations, commandes, analytics et configurations de votre boutique.</p>
                      </div>
                    </div>
                  </div>
                </div>

                <div class="flex items-center justify-between py-4 border-b border-gray-100">
                  <div>
                    <h3 class="text-sm font-medium text-gray-900">Exporter mes données</h3>
                    <p class="text-sm text-gray-500">Conversations, commandes, analytics et paramètres</p>
                  </div>
                  <button
                    @click="exportBeautyData"
                    :disabled="exporting"
                    class="inline-flex items-center px-4 py-2 text-sm font-medium text-rose-600 bg-rose-50 rounded-xl hover:bg-rose-100 disabled:opacity-50 transition-all duration-200"
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

                <!-- Conformité RGPD beauté -->
                <div class="p-4 bg-blue-50 border border-blue-200 rounded-lg">
                  <div class="flex">
                    <div class="flex-shrink-0">
                      <svg class="h-5 w-5 text-blue-400" fill="currentColor" viewBox="0 0 20 20">
                        <path fill-rule="evenodd" d="M2.166 4.999A11.954 11.954 0 0010 1.944 11.954 11.954 0 0017.834 5c.11.65.166 1.32.166 2.001 0 5.225-3.34 9.67-8 11.317C5.34 16.67 2 12.225 2 7c0-.682.057-1.35.166-2.001zm11.541 3.708a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clip-rule="evenodd"/>
                      </svg>
                    </div>
                    <div class="ml-3">
                      <h3 class="text-sm font-medium text-blue-800">Conformité RGPD</h3>
                      <div class="mt-2 text-sm text-blue-700">
                        <p>Vos données clients sont protégées selon le RGPD. Vous pouvez les exporter ou les supprimer à tout moment.</p>
                      </div>
                    </div>
                  </div>
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
                        <h3 class="text-sm font-medium text-red-800">Suppression du compte</h3>
                        <div class="mt-2 text-sm text-red-700">
                          <p>Suppression définitive de toutes vos données : conversations, commandes, produits et configuration de votre Vendeuse IA.</p>
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

    <!-- Toast de succès -->
    <div
      v-if="showSuccessToast"
      class="fixed bottom-4 right-4 bg-gradient-to-r from-emerald-600 to-teal-600 text-white px-6 py-3 rounded-xl shadow-lg z-50 transform transition-all duration-300"
    >
      <div class="flex items-center">
        <svg class="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M5 13l4 4L19 7"/>
        </svg>
        {{ successMessage }}
      </div>
    </div>

    <!-- Modal de confirmation suppression -->
    <div v-if="showDeleteConfirmation" class="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
      <div class="bg-white rounded-xl p-6 max-w-md mx-4">
        <div class="text-center">
          <div class="w-12 h-12 bg-red-100 rounded-full flex items-center justify-center mx-auto mb-4">
            <svg class="w-6 h-6 text-red-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-2.5L13.732 4c-.77-.833-1.732-.833-2.5 0L4.232 15.5c-.77.833.192 2.5 1.732 2.5z"/>
            </svg>
          </div>
          <h3 class="text-lg font-semibold text-gray-900 mb-2">Supprimer votre compte ?</h3>
          <p class="text-sm text-gray-600 mb-6">
            Cette action supprimera définitivement toutes vos données : conversations, commandes, produits et votre Vendeuse IA. Cette action est irréversible.
          </p>
          <div class="flex space-x-4">
            <button
              @click="showDeleteConfirmation = false"
              class="flex-1 px-4 py-2 text-sm font-medium text-gray-700 bg-gray-100 rounded-lg hover:bg-gray-200 transition-colors"
            >
              Annuler
            </button>
            <button
              @click="deleteBeautyBrand"
              class="flex-1 px-4 py-2 text-sm font-medium text-white bg-red-600 rounded-lg hover:bg-red-700 transition-colors"
            >
              Supprimer définitivement
            </button>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, reactive, computed, onMounted, watch } from 'vue'
import { useAuthStore } from '~/stores/auth'

// ✅ COMPOSANT TOGGLE SWITCH
const ToggleSwitch = {
  props: ['modelValue'],
  emits: ['update:modelValue'],
  template: `
    <button
      @click="$emit('update:modelValue', !modelValue)"
      :class="[
        'relative inline-flex h-6 w-11 flex-shrink-0 cursor-pointer rounded-full border-2 border-transparent transition-colors duration-200 ease-in-out focus:outline-none focus:ring-2 focus:ring-rose-500 focus:ring-offset-2',
        modelValue ? 'bg-rose-600' : 'bg-gray-200'
      ]"
    >
      <span
        :class="[
          'pointer-events-none inline-block h-5 w-5 transform rounded-full bg-white shadow ring-0 transition duration-200 ease-in-out',
          modelValue ? 'translate-x-5' : 'translate-x-0'
        ]"
      ></span>
    </button>
  `
}

// ✅ PAGE META
definePageMeta({
  middleware: 'auth',
  layout: 'default'
})

// ✅ COMPOSABLES
const authStore = useAuthStore()
const route = useRoute()
const api = useApi()

const agentName = ref('Mia')

// ✅ REACTIVE STATE
const initialLoading = ref(true)
const loading = ref(false)
const updating = ref(false)
const updatingBrand = ref(false)
const exporting = ref(false)
const savingNotifications = ref(false)
const savingAgents = ref(false)
const editingProfile = ref(false)
const editingBrand = ref(false)
const showSuccessToast = ref(false)
const showDeleteConfirmation = ref(false)
const successMessage = ref('')
const connectionStatus = computed(() => `${agentName.value} est active`)

// ✅ TABS BEAUTÉ SPÉCIALISÉS
const tabs = [
  { 
    id: 'profil', 
    label: 'Profil',
    icon: 'M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z'
  },
  { 
    id: 'marque', 
    label: 'Votre marque',
    icon: 'M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4'
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

// ✅ FORMS BEAUTÉ SPÉCIALISÉS
const profileForm = reactive({
  firstName: '',
  lastName: '',
  email: '',
  beautyRole: '',
  beautyExperience: ''
})

const brandForm = reactive({
  name: '',
  beautyCategory: '',
  platform: '',
  website: '',
  defaultCurrency: 'XOF',
  priceRange: '',
  targetAge: ''
})

const agentSettings = reactive({
  communicationTone: 'professional',
  expertiseLevel: 'intermediate',
  collectSkinType: true,
  collectAge: true,
  collectBudget: true,
  collectAllergies: false,
  enableUpselling: true,
  enableRoutineBuilding: true,
  enableSeasonalRecommendations: false,
  aiProvider: 'openai',
  creativity: 'balanced'
})

const notificationSettings = reactive({
  beautyConsultations: true,
  routineConversions: true,
  beautyInsights: true,
  seasonalTrends: false,
  sales: true,
  performanceReports: true,
  quotaAlerts: true
})

// ✅ DATA STATE
const shopData = ref<any>(null)
const beautyStats = ref<any>({
  totalConsultations: 0,
  conversions: 0,
  revenue: 0,
  conversionRate: 0
})

// ✅ COMPUTED BEAUTÉ
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
    case 'starter': return 'Starter'
    case 'growth': return 'Growth'
    case 'performance': return 'Performance'
    default: return 'Starter'
  }
})

const planBadgeClass = computed(() => {
  const plan = authStore.currentPlan
  switch (plan) {
    case 'starter': return 'bg-blue-100 text-blue-800'
    case 'growth': return 'bg-purple-100 text-purple-800'
    case 'performance': return 'bg-emerald-100 text-emerald-800'
    default: return 'bg-blue-100 text-blue-800'
  }
})


// ✅ UTILITY METHODS
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
  const shopCurrency = authStore.user?.shop?.default_currency || brandForm.defaultCurrency || 'XOF'

  const localeMap: Record<string, string> = {
    'XOF': 'fr-SN',
    'EUR': 'fr-FR',
    'USD': 'en-US',
    'GBP': 'en-GB',
    'MAD': 'fr-MA',
    'TND': 'fr-TN',
    'DZD': 'fr-DZ'
  }

  return new Intl.NumberFormat(localeMap[shopCurrency] || 'fr-FR', {
    style: 'currency',
    currency: shopCurrency,
    minimumFractionDigits: 0,
    maximumFractionDigits: shopCurrency === 'XOF' ? 0 : 2
  }).format(amount)
}

// ✅ DATA LOADING BEAUTÉ (UTILISE APIs EXISTANTES)
const loadBeautyData = async () => {
  try {
    const shopId = authStore.userShopId
    if (!shopId) return

    console.log('📊 Chargement données marque beauté:', shopId)
    
    const response = await api.shops.get(shopId)
    if (response.success && response.data) {
      shopData.value = response.data
      
      // Remplir formulaires avec données beauté
      brandForm.name = response.data.name || ''
      brandForm.beautyCategory = response.data.beauty_category || 'multi'
      brandForm.platform = response.data.platform || ''
      brandForm.website = response.data.domain || response.data.website || ''
      brandForm.defaultCurrency = response.data.default_currency || 'XOF'
      brandForm.priceRange = response.data.price_range || ''
      brandForm.targetAge = response.data.target_age_range || response.data.target_age || ''
      
      console.log('✅ Données marque beauté chargées:', response.data)
    }
  } catch (error) {
    console.error('❌ Erreur chargement marque beauté:', error)
  }
}

const loadBeautyStats = async () => {
  try {
    console.log('📊 Chargement statistiques beauté...')
    
    // ✅ UTILISER L'API EXISTANTE dashboard au lieu de beautyDashboard
    const response = await api.analytics.dashboard()
    if (response.success && response.data) {
      beautyStats.value = {
        totalConsultations: response.data.conversations?.current || 0,
        conversions: response.data.orders?.current || 0,
        revenue: response.data.revenue?.current || 0,
        conversionRate: response.data.conversionRate?.current || 0
      }
      console.log('✅ Stats beauté chargées:', beautyStats.value)
    }
  } catch (error) {
    console.error('❌ Erreur chargement stats beauté:', error)
  }
}

const refreshData = async () => {
  loading.value = true
  try {
    await Promise.all([
      loadBeautyData(),
      loadBeautyStats()
    ])
    showNotification('Données actualisées avec succès !')
  } catch (error) {
    console.error('❌ Erreur actualisation:', error)
  } finally {
    loading.value = false
  }
}

// ✅ PROFILE ACTIONS (UTILISE authStore EXISTANT)
const updateProfile = async () => {
  updating.value = true
  
  try {
    const result = await authStore.updateProfile({
      firstName: profileForm.firstName,
      lastName: profileForm.lastName,
      name: `${profileForm.firstName} ${profileForm.lastName}`.trim(),
      beautyRole: profileForm.beautyRole,
      beautyExperience: profileForm.beautyExperience
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
  profileForm.firstName = authStore.user?.firstName || ''
  profileForm.lastName = authStore.user?.lastName || ''
  profileForm.email = authStore.userEmail || ''
  profileForm.beautyRole = authStore.user?.beautyRole || ''
  profileForm.beautyExperience = authStore.user?.beautyExperience || ''
}

// ✅ BRAND ACTIONS (UTILISE api.shops EXISTANT)
const updateBrand = async () => {
  updatingBrand.value = true
  
  try {
    const shopId = authStore.userShopId
    if (!shopId) throw new Error('Shop ID manquant')

    const response = await api.shops.update(shopId, {
      name: brandForm.name,
      beauty_category: brandForm.beautyCategory,
      platform: brandForm.platform,
      domain: brandForm.website || null,
      default_currency: brandForm.defaultCurrency,
      price_range: brandForm.priceRange,
      target_age_range: brandForm.targetAge
    })

    if (response.success) {
      editingBrand.value = false
      shopData.value = response.data
      showNotification('Marque mise à jour avec succès !')
    } else {
      console.error('❌ Erreur mise à jour marque:', response.error)
    }
  } catch (error) {
    console.error('❌ Erreur:', error)
  } finally {
    updatingBrand.value = false
  }
}

const cancelBrandEdit = () => {
  editingBrand.value = false
  brandForm.name = shopData.value?.name || ''
  brandForm.beautyCategory = shopData.value?.beauty_category || 'multi'
  brandForm.platform = shopData.value?.platform || ''
  brandForm.website = shopData.value?.domain || shopData.value?.website || ''
  brandForm.defaultCurrency = shopData.value?.default_currency || 'XOF'
  brandForm.priceRange = shopData.value?.price_range || ''
  brandForm.targetAge = shopData.value?.target_age_range || shopData.value?.target_age || ''
}

const copyBrandId = async () => {
  try {
    const brandId = shopData.value?.id || authStore.userShopId
    await navigator.clipboard.writeText(brandId || '')
    showNotification('ID marque copié dans le presse-papiers !')
  } catch (error) {
    console.error('❌ Erreur copie:', error)
  }
}

// ✅ AGENT ACTIONS (UTILISE api.shops.update POUR STOCKER CONFIG)
const saveAgentSettingsDebounced = async () => {
  // Debounce pour éviter trop d'appels API
  if (savingAgents.value) return
  
  savingAgents.value = true
  
  try {
    const shopId = authStore.userShopId
    if (!shopId) throw new Error('Shop ID manquant')

    // Utiliser l'API shops.update pour sauvegarder les settings agents
    const response = await api.shops.update(shopId, {
      agent_global_settings: agentSettings
    })
    
    if (response.success) {
      console.log('✅ Paramètres agents sauvegardés')
    }
    
  } catch (error) {
    console.error('❌ Erreur sauvegarde agents:', error)
  } finally {
    setTimeout(() => {
      savingAgents.value = false
    }, 1000)
  }
}

// ✅ NOTIFICATION ACTIONS (UTILISE api.shops.update POUR STOCKER CONFIG)
const updateNotificationSetting = (key: string, value: boolean) => {
  notificationSettings[key] = value
  saveNotificationSettingsDebounced()
}

const saveNotificationSettingsDebounced = async () => {
  if (savingNotifications.value) return
  
  savingNotifications.value = true
  
  try {
    const shopId = authStore.userShopId
    if (!shopId) throw new Error('Shop ID manquant')

    // Utiliser l'API shops.update pour sauvegarder les notifications
    const response = await api.shops.update(shopId, {
      notification_settings: notificationSettings
    })
    
    if (response.success) {
      console.log('✅ Notifications sauvegardées')
    }
    
  } catch (error) {
    console.error('❌ Erreur sauvegarde notifications:', error)
  } finally {
    setTimeout(() => {
      savingNotifications.value = false
    }, 1000)
  }
}

// ✅ DATA ACTIONS BEAUTÉ (UTILISE API EXISTANTE)
const exportBeautyData = async () => {
  exporting.value = true
  
  try {
    console.log('📥 Export des données...')
    
    // Utiliser les APIs existantes
    const [brandResponse, statsResponse] = await Promise.all([
      api.shops.get(authStore.userShopId || '').catch(() => ({ success: false, data: null })),
      api.analytics.dashboard().catch(() => ({ success: false, data: null }))
    ])

    const exportData = {
      brand: {
        ...profileForm,
        ...brandForm,
        shopId: authStore.userShopId,
        memberSince: memberSince.value,
        plan: authStore.currentPlan
      },
      beautyData: brandResponse.success ? brandResponse.data : null,
      statistics: statsResponse.success ? statsResponse.data : null,
      settings: {
        agents: agentSettings,
        notifications: notificationSettings
      },
      metadata: {
        exportedAt: new Date().toISOString(),
        version: '2.0'
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
    console.error('❌ Erreur export beauté:', error)
  } finally {
    exporting.value = false
  }
}

const deleteBeautyBrand = async () => {
  try {
    console.log('⚠️ Suppression compte demandée')
    showDeleteConfirmation.value = false
    
    // Pour l'instant, juste déconnecter (API delete pas disponible)
    await authStore.logout()
    navigateTo('/login')
    
  } catch (error) {
    console.error('❌ Erreur suppression marque beauté:', error)
  }
}

// ✅ LIFECYCLE
onMounted(async () => {
  try {
    // Initialiser les formulaires avec les données existantes
    profileForm.firstName = authStore.user?.firstName || ''
    profileForm.lastName = authStore.user?.lastName || ''
    profileForm.email = authStore.userEmail || ''
    profileForm.beautyRole = authStore.user?.beautyRole || ''
    profileForm.beautyExperience = authStore.user?.beautyExperience || ''

    // Load agent name
    api.agents.list().then((res: any) => {
      if (res.success && res.data?.length > 0) {
        agentName.value = res.data[0].name || 'Mia'
      }
    }).catch(() => {})

    // Charger les données beauté
    await Promise.all([
      loadBeautyData(),
      loadBeautyStats()
    ])

    // Gestion de l'onglet via URL
    const tab = route.query.tab as string
    if (tab && tabs.some(t => t.id === tab)) {
      activeTab.value = tab
    }
    
  } catch (error) {
    console.error('❌ Erreur initialisation beauté:', error)
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
/* ✅ BEAUTÉ COMPONENTS */
.card-beauty {
  @apply bg-white rounded-xl shadow-sm border border-gray-200 p-6;
}

.input-beauty {
  @apply px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-rose-500 focus:border-rose-500 transition-colors text-sm;
}

/* ✅ RESPONSIVE */
@media (max-width: 768px) {
  .card-beauty {
    @apply p-4;
  }
}

/* ✅ ANIMATIONS */
.transition-all {
  transition: all 0.2s cubic-bezier(0.4, 0, 0.2, 1);
}

@keyframes spin {
  from { transform: rotate(0deg); }
  to { transform: rotate(360deg); }
}

.animate-spin {
  animation: spin 1s linear infinite;
}
</style>