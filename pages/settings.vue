<!-- pages/settings.vue -->
<template>
  <div class="p-6">
    <div class="max-w-7xl mx-auto">
      <div class="space-y-6">
        <!-- Header -->
        <div class="flex flex-col sm:flex-row sm:items-center sm:justify-between">
          <div>
            <h1 class="text-2xl font-bold text-gray-900">Configuration</h1>
            <p class="mt-1 text-sm text-gray-600">
              Personnalisez votre Agent IA Commercial et gérez les paramètres de votre compte.
            </p>
          </div>
          
          <!-- Save Button -->
          <div class="mt-4 sm:mt-0">
            <button
              @click="saveAllSettings"
              :disabled="!hasUnsavedChanges || saving"
              class="bg-blue-600 text-white px-4 py-2 rounded-md text-sm font-medium hover:bg-blue-700 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
            >
              <span v-if="saving" class="flex items-center">
                <svg class="animate-spin -ml-1 mr-2 h-4 w-4 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                  <circle class="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" stroke-width="4"></circle>
                  <path class="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                </svg>
                Sauvegarde...
              </span>
              <span v-else>
                <CheckIcon class="h-4 w-4 inline mr-2" />
                Sauvegarder
              </span>
            </button>
          </div>
        </div>

        <!-- Settings Tabs -->
        <div class="bg-white shadow rounded-lg">
          <div class="border-b border-gray-200">
            <nav class="-mb-px flex space-x-8 px-6">
              <button
                v-for="tab in settingsTabs"
                :key="tab.id"
                @click="activeTab = tab.id"
                class="whitespace-nowrap py-4 px-1 border-b-2 font-medium text-sm"
                :class="activeTab === tab.id
                  ? 'border-blue-500 text-blue-600'
                  : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'"
              >
                <component :is="tab.icon" class="h-5 w-5 inline mr-2" />
                {{ tab.name }}
              </button>
            </nav>
          </div>

          <!-- Tab Content -->
          <div class="p-6">
            <!-- Agent Settings -->
            <div v-if="activeTab === 'agent'" class="space-y-8">
              <!-- Agent Appearance -->
              <div class="grid grid-cols-1 lg:grid-cols-2 gap-8">
                <div class="space-y-6">
                  <div>
                    <h3 class="text-lg font-medium text-gray-900 mb-4">Apparence de l'agent</h3>
                    
                    <!-- Agent Name -->
                    <div class="mb-6">
                      <label for="agent-name" class="block text-sm font-medium text-gray-700 mb-2">
                        Nom de l'agent
                      </label>
                      <input
                        id="agent-name"
                        v-model="settings.agent.name"
                        type="text"
                        class="form-input"
                        placeholder="Ex: Sophie, Assistant virtuel..."
                      />
                    </div>

                    <!-- Avatar -->
                    <div class="mb-6">
                      <label class="block text-sm font-medium text-gray-700 mb-2">
                        Avatar de l'agent
                      </label>
                      <div class="flex items-center space-x-4">
                        <div class="h-16 w-16 rounded-full bg-gradient-to-r from-blue-500 to-purple-600 flex items-center justify-center">
                          <span class="text-white font-bold text-xl">
                            {{ settings.agent.name.charAt(0).toUpperCase() || 'A' }}
                          </span>
                        </div>
                        <div>
                          <button class="bg-white border border-gray-300 rounded-md px-3 py-2 text-sm font-medium text-gray-700 hover:bg-gray-50">
                            Changer l'avatar
                          </button>
                          <p class="text-xs text-gray-500 mt-1">JPG, PNG max 2MB</p>
                        </div>
                      </div>
                    </div>

                    <!-- Welcome Message -->
                    <div class="mb-6">
                      <label for="welcome-message" class="block text-sm font-medium text-gray-700 mb-2">
                        Message de bienvenue
                      </label>
                      <textarea
                        id="welcome-message"
                        v-model="settings.agent.welcomeMessage"
                        rows="3"
                        class="form-textarea"
                        placeholder="Bonjour ! Je suis là pour vous aider à trouver le produit parfait..."
                      ></textarea>
                    </div>

                    <!-- Language -->
                    <div class="mb-6">
                      <label for="language" class="block text-sm font-medium text-gray-700 mb-2">
                        Langue principale
                      </label>
                      <select
                        id="language"
                        v-model="settings.agent.language"
                        class="form-select"
                      >
                        <option value="fr">Français</option>
                        <option value="en">English</option>
                        <option value="auto">Détection automatique</option>
                      </select>
                    </div>
                  </div>
                </div>

                <!-- Live Preview -->
                <div class="space-y-6">
                  <div>
                    <h3 class="text-lg font-medium text-gray-900 mb-4">Aperçu en temps réel</h3>
                    
                    <!-- Chat Preview -->
                    <div class="bg-gray-50 rounded-lg p-4 border border-gray-200">
                      <div class="bg-white rounded-lg shadow-sm max-w-sm mx-auto">
                        <!-- Chat Header -->
                        <div class="flex items-center p-4 border-b border-gray-200 bg-blue-600 text-white rounded-t-lg">
                          <div class="h-8 w-8 rounded-full bg-white/20 flex items-center justify-center mr-3">
                            <span class="text-white font-medium text-sm">
                              {{ settings.agent.name.charAt(0).toUpperCase() || 'A' }}
                            </span>
                          </div>
                          <div class="flex-1">
                            <h4 class="font-medium text-sm">{{ settings.agent.name || 'Assistant virtuel' }}</h4>
                            <p class="text-xs text-white/80">En ligne</p>
                          </div>
                        </div>
                        
                        <!-- Chat Messages -->
                        <div class="p-4 space-y-3 min-h-[200px]">
                          <div class="flex items-start space-x-2">
                            <div class="h-6 w-6 rounded-full bg-pink-100 flex items-center justify-center flex-shrink-0">
                              <span class="text-blue-600 font-medium text-xs">
                                {{ settings.agent.name.charAt(0).toUpperCase() || 'A' }}
                              </span>
                            </div>
                            <div class="bg-gray-100 rounded-lg px-3 py-2 max-w-[80%]">
                              <p class="text-sm text-gray-800">
                                {{ settings.agent.welcomeMessage || 'Bonjour ! Comment puis-je vous aider ?' }}
                              </p>
                            </div>
                          </div>
                          
                          <div class="flex justify-end">
                            <div class="bg-blue-600 text-white rounded-lg px-3 py-2 max-w-[80%]">
                              <p class="text-sm">Je cherche un smartphone</p>
                            </div>
                          </div>
                          
                          <div class="flex items-start space-x-2">
                            <div class="h-6 w-6 rounded-full bg-pink-100 flex items-center justify-center flex-shrink-0">
                              <span class="text-blue-600 font-medium text-xs">
                                {{ settings.agent.name.charAt(0).toUpperCase() || 'A' }}
                              </span>
                            </div>
                            <div class="bg-gray-100 rounded-lg px-3 py-2 max-w-[80%]">
                              <p class="text-sm text-gray-800">
                                Parfait ! J'ai plusieurs excellents smartphones à vous proposer. Quel est votre budget approximatif ?
                              </p>
                            </div>
                          </div>
                        </div>
                        
                        <!-- Chat Input -->
                        <div class="p-4 border-t border-gray-200 bg-gray-50 rounded-b-lg">
                          <div class="flex items-center space-x-2">
                            <input
                              type="text"
                              class="flex-1 border border-gray-300 rounded-full px-4 py-2 text-sm"
                              placeholder="Tapez votre message..."
                              disabled
                            />
                            <button class="bg-blue-600 text-white rounded-full p-2">
                              <PaperAirplaneIcon class="h-4 w-4" />
                            </button>
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>

              <!-- Behavior Settings -->
              <div>
                <h3 class="text-lg font-medium text-gray-900 mb-4">Comportement de l'agent</h3>
                
                <div class="grid grid-cols-1 lg:grid-cols-2 gap-6">
                  <!-- Response Style -->
                  <div>
                    <label for="response-style" class="block text-sm font-medium text-gray-700 mb-2">
                      Style de réponse
                    </label>
                    <select
                      id="response-style"
                      v-model="settings.agent.responseStyle"
                      class="form-select"
                    >
                      <option value="professional">Professionnel</option>
                      <option value="friendly">Amical</option>
                      <option value="casual">Décontracté</option>
                    </select>
                  </div>

                  <!-- Response Length -->
                  <div>
                    <label for="response-length" class="block text-sm font-medium text-gray-700 mb-2">
                      Longueur des réponses
                    </label>
                    <select
                      id="response-length"
                      v-model="settings.agent.responseLength"
                      class="form-select"
                    >
                      <option value="short">Courtes</option>
                      <option value="medium">Moyennes</option>
                      <option value="detailed">Détaillées</option>
                    </select>
                  </div>

                  <!-- Proactivity -->
                  <div>
                    <label class="flex items-center">
                      <input
                        v-model="settings.agent.proactive"
                        type="checkbox"
                        class="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 rounded"
                      />
                      <span class="ml-2 text-sm text-gray-700">Mode proactif</span>
                    </label>
                    <p class="text-xs text-gray-500 mt-1">L'agent propose des produits sans attendre qu'on lui demande</p>
                  </div>

                  <!-- Upselling -->
                  <div>
                    <label class="flex items-center">
                      <input
                        v-model="settings.agent.enableUpselling"
                        type="checkbox"
                        class="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 rounded"
                      />
                      <span class="ml-2 text-sm text-gray-700">Vente additionnelle automatique</span>
                    </label>
                    <p class="text-xs text-gray-500 mt-1">L'agent propose des produits complémentaires</p>
                  </div>
                </div>
              </div>
            </div>

            <!-- Widget Settings -->
            <div v-if="activeTab === 'widget'" class="space-y-8">
              <!-- Widget Appearance -->
              <div>
                <h3 class="text-lg font-medium text-gray-900 mb-4">Apparence du widget</h3>
                
                <div class="grid grid-cols-1 lg:grid-cols-2 gap-8">
                  <div class="space-y-6">
                    <!-- Widget Position -->
                    <div>
                      <label class="block text-sm font-medium text-gray-700 mb-2">
                        Position du bouton
                      </label>
                      <div class="grid grid-cols-2 gap-3">
                        <label class="flex items-center p-3 border border-gray-300 rounded-lg hover:bg-gray-50 cursor-pointer">
                          <input
                            v-model="settings.widget.position"
                            type="radio"
                            value="bottom-right"
                            class="h-4 w-4 text-blue-600 focus:ring-blue-500"
                          />
                          <span class="ml-2 text-sm">En bas à droite</span>
                        </label>
                        <label class="flex items-center p-3 border border-gray-300 rounded-lg hover:bg-gray-50 cursor-pointer">
                          <input
                            v-model="settings.widget.position"
                            type="radio"
                            value="bottom-left"
                            class="h-4 w-4 text-blue-600 focus:ring-blue-500"
                          />
                          <span class="ml-2 text-sm">En bas à gauche</span>
                        </label>
                      </div>
                    </div>

                    <!-- Primary Color -->
                    <div>
                      <label for="primary-color" class="block text-sm font-medium text-gray-700 mb-2">
                        Couleur principale
                      </label>
                      <div class="flex items-center space-x-3">
                        <input
                          id="primary-color"
                          v-model="settings.widget.primaryColor"
                          type="color"
                          class="h-10 w-20 border border-gray-300 rounded-md"
                        />
                        <input
                          v-model="settings.widget.primaryColor"
                          type="text"
                          class="form-input flex-1"
                          placeholder="#3B82F6"
                        />
                      </div>
                    </div>

                    <!-- Button Text -->
                    <div>
                      <label for="button-text" class="block text-sm font-medium text-gray-700 mb-2">
                        Texte du bouton
                      </label>
                      <input
                        id="button-text"
                        v-model="settings.widget.buttonText"
                        type="text"
                        class="form-input"
                        placeholder="Besoin d'aide ?"
                      />
                    </div>

                    <!-- Auto-open -->
                    <div>
                      <label class="flex items-center">
                        <input
                          v-model="settings.widget.autoOpen"
                          type="checkbox"
                          class="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 rounded"
                        />
                        <span class="ml-2 text-sm text-gray-700">Ouverture automatique</span>
                      </label>
                      <p class="text-xs text-gray-500 mt-1">Le chat s'ouvre automatiquement après 30 secondes</p>
                    </div>

                    <!-- Show on Mobile -->
                    <div>
                      <label class="flex items-center">
                        <input
                          v-model="settings.widget.showOnMobile"
                          type="checkbox"
                          class="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 rounded"
                        />
                        <span class="ml-2 text-sm text-gray-700">Afficher sur mobile</span>
                      </label>
                    </div>
                  </div>

                  <!-- Widget Preview -->
                  <div>
                    <h4 class="text-sm font-medium text-gray-700 mb-4">Aperçu du widget</h4>
                    <div class="bg-gray-100 rounded-lg p-8 relative h-64">
                      <!-- Mock website content -->
                      <div class="space-y-2 mb-4">
                        <div class="h-3 bg-gray-300 rounded w-3/4"></div>
                        <div class="h-3 bg-gray-300 rounded w-1/2"></div>
                        <div class="h-3 bg-gray-300 rounded w-2/3"></div>
                      </div>
                      
                      <!-- Widget Button -->
                      <button
                        class="absolute rounded-full p-3 text-white font-medium text-sm shadow-lg"
                        :class="settings.widget.position === 'bottom-right' ? 'bottom-4 right-4' : 'bottom-4 left-4'"
                        :style="{ backgroundColor: settings.widget.primaryColor }"
                      >
                        {{ settings.widget.buttonText || 'Besoin d\'aide ?' }}
                      </button>
                    </div>
                  </div>
                </div>
              </div>

              <!-- Integration Code -->
              <div>
                <h3 class="text-lg font-medium text-gray-900 mb-4">Code d'intégration</h3>
                <div class="bg-gray-900 rounded-lg p-4">
                  <code class="text-green-400 text-sm font-mono block whitespace-pre">
                    &lt;script src="{{ config.public.widgetUrl }}/widget.js"
                    data-shop-id="{{ user?.id }}"
                    data-primary-color="{{ settings.widget.primaryColor }}"
                    data-position="{{ settings.widget.position }}"
                    data-button-text="{{ settings.widget.buttonText }}"&gt;
                    &lt;/script&gt;</code>
                </div>
                <div class="mt-4 flex justify-between">
                  <p class="text-sm text-gray-500">
                    Copiez ce code dans votre site web pour activer ChatSeller
                  </p>
                  <button
                    @click="copyIntegrationCode"
                    class="text-sm font-medium text-blue-600 hover:text-blue-500"
                  >
                    Copier le code
                  </button>
                </div>
              </div>
            </div>

            <!-- Account Settings -->
            <div v-if="activeTab === 'account'" class="space-y-8">
              <!-- Profile Information -->
              <div>
                <h3 class="text-lg font-medium text-gray-900 mb-4">Informations du profil</h3>
                
                <div class="grid grid-cols-1 sm:grid-cols-2 gap-6">
                  <div>
                    <label for="first-name" class="block text-sm font-medium text-gray-700 mb-2">
                      Prénom
                    </label>
                    <input
                      id="first-name"
                      v-model="settings.account.firstName"
                      type="text"
                      class="form-input"
                    />
                  </div>

                  <div>
                    <label for="last-name" class="block text-sm font-medium text-gray-700 mb-2">
                      Nom
                    </label>
                    <input
                      id="last-name"
                      v-model="settings.account.lastName"
                      type="text"
                      class="form-input"
                    />
                  </div>

                  <div>
                    <label for="email" class="block text-sm font-medium text-gray-700 mb-2">
                      Email
                    </label>
                    <input
                      id="email"
                      v-model="settings.account.email"
                      type="email"
                      class="form-input"
                      readonly
                    />
                    <p class="text-xs text-gray-500 mt-1">Contactez le support pour changer d'email</p>
                  </div>

                  <div>
                    <label for="company" class="block text-sm font-medium text-gray-700 mb-2">
                      Entreprise
                    </label>
                    <input
                      id="company"
                      v-model="settings.account.company"
                      type="text"
                      class="form-input"
                    />
                  </div>

                  <div>
                    <label for="website" class="block text-sm font-medium text-gray-700 mb-2">
                      Site web
                    </label>
                    <input
                      id="website"
                      v-model="settings.account.website"
                      type="url"
                      class="form-input"
                      placeholder="https://votre-site.com"
                    />
                  </div>

                  <div>
                    <label for="phone" class="block text-sm font-medium text-gray-700 mb-2">
                      Téléphone
                    </label>
                    <input
                      id="phone"
                      v-model="settings.account.phone"
                      type="tel"
                      class="form-input"
                      placeholder="+225 07 00 00 00 00"
                    />
                  </div>
                </div>
              </div>

              <!-- Password Change -->
              <div>
                <h3 class="text-lg font-medium text-gray-900 mb-4">Changer le mot de passe</h3>
                <div class="max-w-md space-y-4">
                  <div>
                    <label for="current-password" class="block text-sm font-medium text-gray-700 mb-2">
                      Mot de passe actuel
                    </label>
                    <input
                      id="current-password"
                      v-model="passwordForm.current"
                      type="password"
                      class="form-input"
                    />
                  </div>

                  <div>
                    <label for="new-password" class="block text-sm font-medium text-gray-700 mb-2">
                      Nouveau mot de passe
                    </label>
                    <input
                      id="new-password"
                      v-model="passwordForm.new"
                      type="password"
                      class="form-input"
                    />
                  </div>

                  <div>
                    <label for="confirm-password" class="block text-sm font-medium text-gray-700 mb-2">
                      Confirmer le nouveau mot de passe
                    </label>
                    <input
                      id="confirm-password"
                      v-model="passwordForm.confirm"
                      type="password"
                      class="form-input"
                    />
                  </div>

                  <button
                    @click="changePassword"
                    class="bg-blue-600 text-white px-4 py-2 rounded-md text-sm font-medium hover:bg-blue-700 transition-colors"
                  >
                    Changer le mot de passe
                  </button>
                </div>
              </div>

              <!-- Danger Zone -->
              <div class="border-t border-red-200 pt-8">
                <h3 class="text-lg font-medium text-red-900 mb-4">Zone dangereuse</h3>
                <div class="bg-red-50 border border-red-200 rounded-lg p-4">
                  <div class="flex items-start">
                    <ExclamationTriangleIcon class="h-5 w-5 text-red-400 mt-0.5 mr-3" />
                    <div class="flex-1">
                      <h4 class="text-sm font-medium text-red-800">Supprimer le compte</h4>
                      <p class="text-sm text-red-700 mt-1">
                        Cette action est irréversible. Toutes vos données seront définitivement supprimées.
                      </p>
                      <button
                        @click="showDeleteModal = true"
                        class="mt-3 bg-red-600 text-white px-4 py-2 rounded-md text-sm font-medium hover:bg-red-700 transition-colors"
                      >
                        Supprimer mon compte
                      </button>
                    </div>
                  </div>
                </div>
              </div>
            </div>

            <!-- Notifications Settings -->
            <div v-if="activeTab === 'notifications'" class="space-y-8">
              <div>
                <h3 class="text-lg font-medium text-gray-900 mb-4">Préférences de notifications</h3>
                
                <div class="space-y-6">
                  <!-- Email Notifications -->
                  <div>
                    <h4 class="text-base font-medium text-gray-900 mb-3">Notifications par email</h4>
                    <div class="space-y-3">
                      <label class="flex items-center">
                        <input
                          v-model="settings.notifications.newOrder"
                          type="checkbox"
                          class="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 rounded"
                        />
                        <span class="ml-3 text-sm text-gray-700">Nouvelles commandes</span>
                      </label>
                      
                      <label class="flex items-center">
                        <input
                          v-model="settings.notifications.newConversation"
                          type="checkbox"
                          class="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 rounded"
                        />
                        <span class="ml-3 text-sm text-gray-700">Nouvelles conversations</span>
                      </label>
                      
                      <label class="flex items-center">
                        <input
                          v-model="settings.notifications.weeklyReport"
                          type="checkbox"
                          class="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 rounded"
                        />
                        <span class="ml-3 text-gray-700">Rapport hebdomadaire</span>
                      </label>
                    </div>
                  </div>

                  <!-- Browser Notifications -->
                  <div>
                    <h4 class="text-base font-medium text-gray-900 mb-3">Notifications navigateur</h4>
                    <div class="space-y-3">
                      <label class="flex items-center">
                        <input
                          v-model="settings.notifications.browserNotifications"
                          type="checkbox"
                          class="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 rounded"
                        />
                        <span class="ml-3 text-sm text-gray-700">Activer les notifications navigateur</span>
                      </label>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>

        <!-- Delete Account Modal -->
        <DeleteAccountModal
          :is-open="showDeleteModal"
          @close="showDeleteModal = false"
          @confirm="deleteAccount"
        />
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import {
  CpuChipIcon,
  Cog6ToothIcon,
  UserIcon,
  BellIcon,
  CheckIcon,
  PaperAirplaneIcon,
  ExclamationTriangleIcon
} from '@heroicons/vue/24/outline'

// Define page meta
definePageMeta({
  layout: 'dashboard',
  title: 'Configuration - ChatSeller'
})

// Auth & config
const { user } = useAuth()
const config = useRuntimeConfig()

// State
const activeTab = ref('agent')
const hasUnsavedChanges = ref(false)
const saving = ref(false)
const showDeleteModal = ref(false)

// Settings Tabs
const settingsTabs = [
  { id: 'agent', name: 'Agent IA', icon: CpuChipIcon },
  { id: 'widget', name: 'Widget', icon: Cog6ToothIcon },
  { id: 'account', name: 'Compte', icon: UserIcon },
  { id: 'notifications', name: 'Notifications', icon: BellIcon }
]

// Settings Data
const settings = reactive({
  agent: {
    name: 'Sophie',
    welcomeMessage: 'Bonjour ! Je suis Sophie, votre assistante virtuelle. Comment puis-je vous aider à trouver le produit parfait ?',
    language: 'fr',
    responseStyle: 'friendly',
    responseLength: 'medium',
    proactive: true,
    enableUpselling: true
  },
  widget: {
    position: 'bottom-right',
    primaryColor: '#3B82F6',
    buttonText: 'Besoin d\'aide ?',
    autoOpen: false,
    showOnMobile: true
  },
  account: {
    firstName: user.value?.user_metadata?.firstName || '',
    lastName: user.value?.user_metadata?.lastName || '',
    email: user.value?.email || '',
    company: user.value?.user_metadata?.company || '',
    website: user.value?.user_metadata?.website || '',
    phone: ''
  },
  notifications: {
    newOrder: true,
    newConversation: true,
    weeklyReport: true,
    browserNotifications: false
  }
})

// Password form
const passwordForm = reactive({
  current: '',
  new: '',
  confirm: ''
})

// Watch for changes
watch(settings, () => {
  hasUnsavedChanges.value = true
}, { deep: true })

// Methods
const saveAllSettings = async () => {
  saving.value = true
  
  try {
    // Simulate API call
    await new Promise(resolve => setTimeout(resolve, 2000))
    
    hasUnsavedChanges.value = false
    
    const notification = inject('setNotification') as (message: string) => void
    notification('Paramètres sauvegardés avec succès!')
  } catch (error) {
    console.error('Save settings error:', error)
  } finally {
    saving.value = false
  }
}

const changePassword = async () => {
  if (passwordForm.new !== passwordForm.confirm) {
    alert('Les mots de passe ne correspondent pas')
    return
  }
  
  if (passwordForm.new.length < 8) {
    alert('Le mot de passe doit contenir au moins 8 caractères')
    return
  }
  
  try {
    // Simulate API call
    await new Promise(resolve => setTimeout(resolve, 1000))
    
    passwordForm.current = ''
    passwordForm.new = ''
    passwordForm.confirm = ''
    
    const notification = inject('setNotification') as (message: string) => void
    notification('Mot de passe changé avec succès!')
  } catch (error) {
    console.error('Change password error:', error)
  }
}

const copyIntegrationCode = async () => {
  const scriptStart = '<' + 'script src="' + config.public.widgetUrl + '/widget.js"'
  const dataShopId = ' data-shop-id="' + user.value?.id + '"'
  const dataPrimaryColor = ' data-primary-color="' + settings.widget.primaryColor + '"'
  const dataPosition = ' data-position="' + settings.widget.position + '"'
  const dataButtonText = ' data-button-text="' + settings.widget.buttonText + '"'
  const scriptEnd = '><' + '/script>'
  
  const code = scriptStart + dataShopId + dataPrimaryColor + dataPosition + dataButtonText + scriptEnd
  
  try {
    await navigator.clipboard.writeText(code)
    
    const notification = inject('setNotification') as (message: string) => void
    notification('Code d\'intégration copié dans le presse-papiers!')
  } catch (err) {
    console.error('Failed to copy: ', err)
  }
}

const deleteAccount = async () => {
  try {
    // Simulate API call
    await new Promise(resolve => setTimeout(resolve, 1000))
    
    // Sign out and redirect
    const { signOut } = useAuth()
    await signOut()
  } catch (error) {
    console.error('Delete account error:', error)
  }
}

// Load initial settings on mount
onMounted(() => {
  // Load settings from API
  // For now, we use the reactive defaults
})
</script>