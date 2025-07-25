<!-- pages/settings.vue - PAGE PARAMÈTRES CORRIGÉE SANS ERREURS -->
<template>
  <div class="min-h-screen bg-gray-50">
    <!-- Header -->
    <div class="bg-white shadow-sm border-b border-gray-200">
      <div class="px-8 py-6">
        <div class="flex items-center justify-between">
          <div>
            <h1 class="text-3xl font-bold text-gray-900">Paramètres ChatSeller</h1>
            <p class="mt-2 text-gray-600">
              Configurez votre Vendeur IA et personnalisez votre widget
            </p>
          </div>
          
          <div class="flex items-center space-x-4">
            <button
              @click="handleResetToDefaults"
              :disabled="saving"
              class="inline-flex items-center px-4 py-2 border border-gray-300 rounded-lg text-sm font-medium text-gray-700 bg-white hover:bg-gray-50 disabled:opacity-50 transition-colors"
            >
              <svg class="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15"/>
              </svg>
              Réinitialiser
            </button>
            
            <button
              @click="handleSaveSettings"
              :disabled="saving"
              class="inline-flex items-center px-4 py-2 bg-blue-600 text-white text-sm font-medium rounded-lg hover:bg-blue-700 disabled:opacity-50 transition-colors"
            >
              <svg v-if="saving" class="animate-spin -ml-1 mr-2 h-4 w-4 text-white" fill="none" viewBox="0 0 24 24">
                <circle class="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" stroke-width="4"></circle>
                <path class="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
              </svg>
              <svg v-else class="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M5 13l4 4L19 7"/>
              </svg>
              {{ saving ? 'Sauvegarde...' : 'Sauvegarder' }}
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
            @click="activeTab = tab.id"
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

      <!-- Tab Content -->
      <div class="max-w-6xl">
        <!-- Vendeur IATab -->
        <div v-show="activeTab === 'agent'" class="space-y-8">
          <div class="grid grid-cols-1 lg:grid-cols-2 gap-8">
            <!-- Agent Configuration -->
            <div class="card-modern">
              <div class="flex items-center mb-6">
                <div class="p-2 bg-blue-100 rounded-lg mr-3">
                  <svg class="w-6 h-6 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9.663 17h4.673M12 3v1m6.364 1.636l-.707.707M21 12h-1M4 12H3m3.343-5.657l-.707-.707m2.828 9.9a5 5 0 117.072 0l-.548.547A3.374 3.374 0 0014 18.469V19a2 2 0 11-4 0v-.531c0-.895-.356-1.754-.988-2.386l-.548-.547z"/>
                  </svg>
                </div>
                <h3 class="text-lg font-semibold text-gray-900">Configuration du Vendeur IA</h3>
              </div>
              
              <div class="space-y-6">
                <!-- Agent Name -->
                <div>
                  <label class="block text-sm font-medium text-gray-700 mb-2">
                    Nom du Vendeur IA
                  </label>
                  <input
                    v-model="settings.botName"
                    type="text"
                    class="input-modern w-full"
                    placeholder="Mia - Assistante d'achat"
                  >
                  <p class="text-xs text-gray-500 mt-1">Ce nom apparaîtra dans les conversations avec vos clients</p>
                </div>

                <!-- Welcome Message -->
                <div>
                  <label class="block text-sm font-medium text-gray-700 mb-2">
                    Message de bienvenue
                  </label>
                  <textarea
                    v-model="settings.welcomeMessage"
                    rows="4"
                    class="input-modern w-full"
                    placeholder="Bonjour, je suis Mia ! Comment puis-je vous aider aujourd'hui ?"
                  ></textarea>
                  <p class="text-xs text-gray-500 mt-1">Premier message que vos visiteurs verront</p>
                </div>

                <!-- Button Text -->
                <div>
                  <label class="block text-sm font-medium text-gray-700 mb-2">
                    Texte du bouton d'ouverture
                  </label>
                  <input
                    v-model="settings.buttonText"
                    type="text"
                    class="input-modern w-full"
                    placeholder="Parler à la vendeuse"
                  >
                  <p class="text-xs text-gray-500 mt-1">Texte affiché sur le bouton pour ouvrir le chat</p>
                </div>

                <!-- Language -->
                <div>
                  <label class="block text-sm font-medium text-gray-700 mb-2">
                    Langue de l'agent
                  </label>
                  <select v-model="settings.language" class="input-modern w-full">
                    <option value="fr">Français</option>
                    <option value="en">English</option>
                  </select>
                </div>
              </div>
            </div>

            <!-- Appearance -->
            <div class="card-modern">
              <div class="flex items-center mb-6">
                <div class="p-2 bg-purple-100 rounded-lg mr-3">
                  <svg class="w-6 h-6 text-purple-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M7 21a4 4 0 01-4-4V5a2 2 0 012-2h4a2 2 0 012 2v12a4 4 0 01-4 4zM21 5a2 2 0 00-2-2h-4a2 2 0 00-2 2v12a4 4 0 004 4h4a2 2 0 002-2V5z"/>
                  </svg>
                </div>
                <h3 class="text-lg font-semibold text-gray-900">Apparence du widget</h3>
              </div>
              
              <div class="space-y-6">
                <!-- Primary Color -->
                <div>
                  <label class="block text-sm font-medium text-gray-700 mb-2">
                    Couleur principale
                  </label>
                  <div class="flex items-center space-x-3">
                    <input
                      v-model="settings.primaryColor"
                      type="color"
                      class="h-12 w-16 border border-gray-300 rounded-lg cursor-pointer"
                    >
                    <input
                      v-model="settings.primaryColor"
                      type="text"
                      class="input-modern flex-1"
                      placeholder="#3B82F6"
                    >
                  </div>
                  <p class="text-xs text-gray-500 mt-1">Couleur utilisée pour les boutons et éléments actifs</p>
                </div>

                <!-- Position -->
                <div>
                  <label class="block text-sm font-medium text-gray-700 mb-3">
                    Position du widget
                  </label>
                  <div class="grid grid-cols-2 gap-3">
                    <label class="position-option" :class="{ 'selected': settings.position === 'bottom-left' }">
                      <input
                        v-model="settings.position"
                        type="radio"
                        value="bottom-left"
                        class="sr-only"
                      >
                      <div class="flex items-center space-x-2">
                        <div class="w-4 h-4 border-2 rounded-full" :class="settings.position === 'bottom-left' ? 'border-blue-500 bg-blue-500' : 'border-gray-300'"></div>
                        <span class="text-sm">En bas à gauche</span>
                      </div>
                    </label>
                    <label class="position-option" :class="{ 'selected': settings.position === 'bottom-right' }">
                      <input
                        v-model="settings.position"
                        type="radio"
                        value="bottom-right"
                        class="sr-only"
                      >
                      <div class="flex items-center space-x-2">
                        <div class="w-4 h-4 border-2 rounded-full" :class="settings.position === 'bottom-right' ? 'border-blue-500 bg-blue-500' : 'border-gray-300'"></div>
                        <span class="text-sm">En bas à droite</span>
                      </div>
                    </label>
                  </div>
                </div>

                <!-- Widget Size -->
                <div>
                  <label class="block text-sm font-medium text-gray-700 mb-2">
                    Taille du widget
                  </label>
                  <select v-model="settings.widgetSize" class="input-modern w-full">
                    <option value="small">Petit</option>
                    <option value="medium">Moyen</option>
                    <option value="large">Grand</option>
                  </select>
                </div>

                <!-- Widget Status -->
                <div class="flex items-center justify-between p-4 bg-gray-50 rounded-lg">
                  <div>
                    <h4 class="text-sm font-medium text-gray-900">Widget actif</h4>
                    <p class="text-xs text-gray-500">Activez ou désactivez le widget sur votre site</p>
                  </div>
                  <button
                    @click="settings.isActive = !settings.isActive"
                    :class="[
                      'relative inline-flex h-6 w-11 flex-shrink-0 cursor-pointer rounded-full border-2 border-transparent transition-colors duration-200 ease-in-out focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2',
                      settings.isActive ? 'bg-blue-600' : 'bg-gray-200'
                    ]"
                  >
                    <span
                      :class="[
                        'pointer-events-none inline-block h-5 w-5 transform rounded-full bg-white shadow ring-0 transition duration-200 ease-in-out',
                        settings.isActive ? 'translate-x-5' : 'translate-x-0'
                      ]"
                    ></span>
                  </button>
                </div>
              </div>
            </div>
          </div>

          <!-- Widget Preview -->
          <div class="card-modern">
            <div class="flex items-center mb-6">
              <div class="p-2 bg-green-100 rounded-lg mr-3">
                <svg class="w-6 h-6 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M15 12a3 3 0 11-6 0 3 3 0 016 0z"/>
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z"/>
                </svg>
              </div>
              <h3 class="text-lg font-semibold text-gray-900">Aperçu du widget</h3>
            </div>
            
            <div class="bg-gray-100 rounded-lg p-6 relative overflow-hidden" style="height: 400px;">
              <!-- Simulated Website -->
              <div class="bg-white rounded-lg h-full shadow-sm border border-gray-200 relative">
                <div class="h-12 bg-gray-50 border-b border-gray-200 flex items-center px-4">
                  <div class="flex space-x-2">
                    <div class="w-3 h-3 bg-red-400 rounded-full"></div>
                    <div class="w-3 h-3 bg-yellow-400 rounded-full"></div>
                    <div class="w-3 h-3 bg-green-400 rounded-full"></div>
                  </div>
                  <div class="flex-1 text-center text-sm text-gray-500">votre-site.com</div>
                </div>
                
                <!-- Widget Preview -->
                <div 
                  v-if="settings.isActive"
                  class="absolute bottom-6 transition-all duration-300"
                  :class="settings.position === 'bottom-left' ? 'left-6' : 'right-6'"
                >
                  <button 
                    class="widget-button"
                    :style="{ backgroundColor: settings.primaryColor }"
                  >
                    <svg class="w-5 h-5 text-white mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z"/>
                    </svg>
                    <span class="text-white text-sm font-medium">{{ settings.buttonText }}</span>
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>

        <!-- Integration Tab -->
        <div v-show="activeTab === 'integration'" class="space-y-8">
          <div class="card-modern">
            <div class="flex items-center mb-6">
              <div class="p-2 bg-indigo-100 rounded-lg mr-3">
                <svg class="w-6 h-6 text-indigo-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M10 20l4-16m4 4l4 4-4 4M6 16l-4-4 4-4"/>
                </svg>
              </div>
              <h3 class="text-lg font-semibold text-gray-900">Code d'intégration</h3>
            </div>
            
            <div class="space-y-6">
              <div class="bg-blue-50 border border-blue-200 rounded-lg p-4">
                <div class="flex">
                  <div class="flex-shrink-0">
                    <svg class="h-5 w-5 text-blue-400" fill="currentColor" viewBox="0 0 20 20">
                      <path fill-rule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7-4a1 1 0 11-2 0 1 1 0 012 0zM9 9a1 1 0 000 2v3a1 1 0 001 1h1a1 1 0 100-2v-3a1 1 0 00-1-1H9z" clip-rule="evenodd"/>
                    </svg>
                  </div>
                  <div class="ml-3">
                    <h3 class="text-sm font-medium text-blue-800">Instructions d'installation</h3>
                    <div class="mt-2 text-sm text-blue-700">
                      <p>Copiez le code ci-dessous et collez-le juste avant la balise <code>&lt;/body&gt;</code> de votre site web.</p>
                    </div>
                  </div>
                </div>
              </div>

              <div class="relative">
                <div class="bg-gray-900 rounded-lg p-4 overflow-x-auto">
                  <pre class="text-green-400 text-sm"><code>{{ widgetCodeDisplay }}</code></pre>
                </div>
                
                <button
                  @click="handleCopyWidgetCode"
                  class="absolute top-4 right-4 inline-flex items-center px-3 py-1 border border-gray-600 text-xs font-medium rounded text-gray-300 bg-gray-800 hover:bg-gray-700 transition-colors"
                >
                  <svg class="w-4 h-4 mr-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M8 16H6a2 2 0 01-2-2V6a2 2 0 012-2h8a2 2 0 012 2v2m-6 12h8a2 2 0 002-2v-8a2 2 0 00-2-2h-8a2 2 0 00-2 2v8a2 2 0 002 2z"/>
                  </svg>
                  {{ copied ? 'Copié !' : 'Copier' }}
                </button>
              </div>

              <div v-if="copied" class="success-message">
                <div class="flex">
                  <div class="flex-shrink-0">
                    <svg class="h-5 w-5 text-green-400" fill="currentColor" viewBox="0 0 20 20">
                      <path fill-rule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clip-rule="evenodd"/>
                    </svg>
                  </div>
                  <div class="ml-3">
                    <p class="text-sm text-green-800">✅ Code copié dans le presse-papier !</p>
                  </div>
                </div>
              </div>

              <!-- Platform Specific Instructions -->
              <div class="grid grid-cols-1 md:grid-cols-3 gap-6">
                <div class="platform-card">
                  <div class="platform-icon bg-green-100">
                    <svg class="w-6 h-6 text-green-600" fill="currentColor" viewBox="0 0 24 24">
                      <path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm-2 15l-5-5 1.41-1.41L10 14.17l7.59-7.59L19 8l-9 9z"/>
                    </svg>
                  </div>
                  <h4 class="text-sm font-medium text-gray-900">Shopify</h4>
                  <p class="text-xs text-gray-500">Thème → Actions → Modifier le code → theme.liquid</p>
                </div>

                <div class="platform-card">
                  <div class="platform-icon bg-blue-100">
                    <svg class="w-6 h-6 text-blue-600" fill="currentColor" viewBox="0 0 24 24">
                      <path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm-2 15l-5-5 1.41-1.41L10 14.17l7.59-7.59L19 8l-9 9z"/>
                    </svg>
                  </div>
                  <h4 class="text-sm font-medium text-gray-900">WordPress</h4>
                  <p class="text-xs text-gray-500">Apparence → Éditeur de thème → footer.php</p>
                </div>

                <div class="platform-card">
                  <div class="platform-icon bg-purple-100">
                    <svg class="w-6 h-6 text-purple-600" fill="currentColor" viewBox="0 0 24 24">
                      <path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm-2 15l-5-5 1.41-1.41L10 14.17l7.59-7.59L19 8l-9 9z"/>
                    </svg>
                  </div>
                  <h4 class="text-sm font-medium text-gray-900">Site personnalisé</h4>
                  <p class="text-xs text-gray-500">Avant la balise &lt;/body&gt;</p>
                </div>
              </div>
            </div>
          </div>
        </div>

        <!-- Account Tab -->
        <div v-show="activeTab === 'account'" class="space-y-8">
          <div class="grid grid-cols-1 lg:grid-cols-2 gap-8">
            <!-- Profile Information -->
            <div class="card-modern">
              <div class="flex items-center mb-6">
                <div class="p-2 bg-gray-100 rounded-lg mr-3">
                  <svg class="w-6 h-6 text-gray-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z"/>
                  </svg>
                </div>
                <h3 class="text-lg font-semibold text-gray-900">Informations du compte</h3>
              </div>
              
              <div class="space-y-6">
                <div>
                  <label class="block text-sm font-medium text-gray-700 mb-2">Nom</label>
                  <input
                    v-model="profileData.name"
                    type="text"
                    class="input-modern w-full"
                    placeholder="Votre nom"
                  >
                </div>
                
                <div>
                  <label class="block text-sm font-medium text-gray-700 mb-2">Email</label>
                  <input
                    v-model="profileData.email"
                    type="email"
                    disabled
                    class="input-modern w-full bg-gray-50 text-gray-500 cursor-not-allowed"
                  >
                  <p class="text-xs text-gray-500 mt-1">L'email ne peut pas être modifié</p>
                </div>

                <div>
                  <label class="block text-sm font-medium text-gray-700 mb-2">Entreprise</label>
                  <input
                    v-model="profileData.company"
                    type="text"
                    class="input-modern w-full"
                    placeholder="Nom de votre entreprise"
                  >
                </div>
              </div>
            </div>

            <!-- Subscription -->
            <div class="card-modern">
              <div class="flex items-center mb-6">
                <div class="p-2 bg-yellow-100 rounded-lg mr-3">
                  <svg class="w-6 h-6 text-yellow-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M5 3v4M3 5h4M6 17v4m-2-2h4m5-16l2.286 6.857L21 12l-5.714 2.143L13 21l-2.286-6.857L5 12l5.714-2.143L13 3z"/>
                  </svg>
                </div>
                <h3 class="text-lg font-semibold text-gray-900">Abonnement</h3>
              </div>
              
              <div class="space-y-4">
                <div class="flex items-center justify-between p-4 bg-gray-50 rounded-lg">
                  <div>
                    <h4 class="text-sm font-medium text-gray-900">Plan actuel</h4>
                    <p class="text-xs text-gray-500">{{ subscriptionData.plan }}</p>
                  </div>
                  <span class="inline-flex items-center px-3 py-1 rounded-full text-xs font-medium bg-green-100 text-green-800">
                    Actif
                  </span>
                </div>

                <div class="flex items-center justify-between p-4 bg-gray-50 rounded-lg">
                  <div>
                    <h4 class="text-sm font-medium text-gray-900">Prochaine facturation</h4>
                    <p class="text-xs text-gray-500">{{ subscriptionData.nextBilling }}</p>
                  </div>
                  <div class="text-right">
                    <p class="text-sm font-medium text-gray-900">{{ subscriptionData.amount }}</p>
                  </div>
                </div>

                <NuxtLink to="/billing" class="w-full btn-secondary block text-center">
                  Gérer l'abonnement
                </NuxtLink>
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
        Paramètres sauvegardés avec succès !
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

// ✅ REACTIVE STATE
const saving = ref(false)
const copied = ref(false)
const activeTab = ref('agent')
const showSuccessToast = ref(false)

const tabs = [
  { 
    id: 'agent', 
    label: 'Agent IA',
    icon: 'M9.663 17h4.673M12 3v1m6.364 1.636l-.707.707M21 12h-1M4 12H3m3.343-5.657l-.707-.707m2.828 9.9a5 5 0 117.072 0l-.548.547A3.374 3.374 0 0014 18.469V19a2 2 0 11-4 0v-.531c0-.895-.356-1.754-.988-2.386l-.548-.547z'
  },
  { 
    id: 'integration', 
    label: 'Intégration',
    icon: 'M10 20l4-16m4 4l4 4-4 4M6 16l-4-4 4-4'
  },
  { 
    id: 'account', 
    label: 'Compte',
    icon: 'M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z'
  }
]

const settings = ref({
  botName: 'Assistant ChatSeller',
  welcomeMessage: 'Bonjour ! Comment puis-je vous aider aujourd\'hui ?',
  buttonText: 'Parler à un conseiller',
  primaryColor: '#3B82F6',
  position: 'bottom-right',
  language: 'fr',
  widgetSize: 'medium',
  isActive: true
})

const profileData = ref({
  name: '',
  email: '',
  company: ''
})

const subscriptionData = ref({
  plan: 'Plan Gratuit',
  nextBilling: '31 janvier 2025',
  amount: '0€'
})

// ✅ COMPUTED - CORRECTIONS APPLIQUÉES
const user = computed(() => authStore.user)
const userShopId = computed(() => authStore.userShopId)

const widgetCodeDisplay = computed(() => {
  const shopId = userShopId.value || 'YOUR_SHOP_ID'
  
  const jsLines = [
    '(function() {',
    '  var script = document.createElement(\'script\');',
    '  script.src = \'https://widget.chatseller.app/widget.js\';',
    '  script.setAttribute(\'data-shop-id\', \'' + shopId + '\');',
    '  script.setAttribute(\'data-bot-name\', \'' + settings.value.botName + '\');',
    '  script.setAttribute(\'data-welcome-message\', \'' + settings.value.welcomeMessage + '\');',
    '  script.setAttribute(\'data-primary-color\', \'' + settings.value.primaryColor + '\');',
    '  script.setAttribute(\'data-position\', \'' + settings.value.position + '\');',
    '  script.setAttribute(\'data-button-text\', \'' + settings.value.buttonText + '\');',
    '  script.setAttribute(\'data-widget-size\', \'' + settings.value.widgetSize + '\');',
    '  script.setAttribute(\'data-language\', \'' + settings.value.language + '\');',
    '  document.head.appendChild(script);',
    '})();'
  ]
  
  const jsContent = jsLines.join('\n')
  // ✅ CORRECTION : Échapper les balises script pour éviter le conflit de parsing Vue
  const openTag = '<' + 'script' + '>'
  const closeTag = '<' + '/' + 'script' + '>'
  return `${openTag}\n${jsContent}\n${closeTag}`
})

// ✅ METHODS - TOUTES LES FONCTIONS DÉFINIES
const loadSettings = async () => {
  try {
    if (user.value) {
      profileData.value.name = user.value.name || ''
      profileData.value.email = user.value.email || ''
    }
  } catch (error) {
    console.error('Erreur lors du chargement des paramètres:', error)
  }
}

const handleSaveSettings = async () => {
  saving.value = true
  try {
    // Simuler une sauvegarde
    await new Promise(resolve => setTimeout(resolve, 1000))
    
    console.log('Paramètres sauvegardés:', settings.value)
    
    showSuccessToast.value = true
    setTimeout(() => {
      showSuccessToast.value = false
    }, 3000)
    
  } catch (error) {
    console.error('Erreur lors de la sauvegarde:', error)
  } finally {
    saving.value = false
  }
}

const handleResetToDefaults = () => {
  if (confirm('Êtes-vous sûr de vouloir réinitialiser tous les paramètres ?')) {
    settings.value = {
      botName: 'Assistant ChatSeller',
      welcomeMessage: 'Bonjour ! Comment puis-je vous aider aujourd\'hui ?',
      buttonText: 'Parler à un conseiller',
      primaryColor: '#3B82F6',
      position: 'bottom-right',
      language: 'fr',
      widgetSize: 'medium',
      isActive: true
    }
  }
}

const handleCopyWidgetCode = async () => {
  try {
    await navigator.clipboard.writeText(widgetCodeDisplay.value)
    copied.value = true
    setTimeout(() => {
      copied.value = false
    }, 3000)
  } catch (error) {
    console.error('Erreur lors de la copie:', error)
  }
}

// ✅ LIFECYCLE
onMounted(() => {
  loadSettings()
})

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

.btn-secondary {
  @apply px-4 py-2 border border-gray-300 rounded-lg text-sm font-medium text-gray-700 bg-white hover:bg-gray-50 transition-colors;
}

.position-option {
  @apply p-3 border border-gray-300 rounded-lg cursor-pointer transition-all hover:border-blue-300;
}

.position-option.selected {
  @apply border-blue-500 bg-blue-50;
}

.widget-button {
  @apply flex items-center px-4 py-2 rounded-lg shadow-lg transition-all hover:shadow-xl;
}

.platform-card {
  @apply p-4 border border-gray-200 rounded-lg text-center;
}

.platform-icon {
  @apply w-12 h-12 rounded-lg flex items-center justify-center mx-auto mb-3;
}

.success-message {
  @apply p-4 bg-green-50 border border-green-200 rounded-lg;
}

/* ✅ RESPONSIVE */
@media (max-width: 768px) {
  .card-modern {
    @apply p-4;
  }
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