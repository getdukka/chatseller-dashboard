<!-- pages/settings.vue -->
<template>
  <div class="min-h-screen bg-gray-50">
    <!-- Header de la page -->
    <div class="bg-white shadow-sm border-b border-gray-200">
      <div class="px-6 py-4">
        <div class="flex items-center justify-between">
          <div>
            <h1 class="text-2xl font-bold text-gray-900">Paramètres</h1>
            <p class="mt-1 text-sm text-gray-600">
              Configurez votre agent IA commercial et vos préférences
            </p>
          </div>
          <div class="flex items-center space-x-4">
            <button
              @click="resetToDefaults"
              class="btn-secondary"
            >
              <svg class="mr-2 h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" />
              </svg>
              Réinitialiser
            </button>
            
            <button
              @click="saveSettings"
              :disabled="saving || !hasChanges"
              :class="hasChanges ? 'btn-primary' : 'btn-secondary'"
            >
              <svg 
                class="mr-2 h-4 w-4" 
                :class="{ 'animate-spin': saving }"
                fill="none" 
                viewBox="0 0 24 24" 
                stroke="currentColor"
              >
                <path v-if="!saving" stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M5 13l4 4L19 7" />
                <circle v-else class="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" stroke-width="4"></circle>
              </svg>
              {{ saving ? 'Sauvegarde...' : 'Enregistrer' }}
            </button>
          </div>
        </div>
      </div>
    </div>

    <!-- Navigation par onglets -->
    <div class="bg-white border-b border-gray-200">
      <div class="px-6">
        <nav class="flex space-x-8">
          <button
            v-for="tab in tabs"
            :key="tab.id"
            @click="activeTab = tab.id"
            class="py-4 px-1 border-b-2 font-medium text-sm transition-colors"
            :class="activeTab === tab.id 
              ? 'border-blue-500 text-blue-600' 
              : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'"
          >
            <component :is="tab.icon" class="mr-2 h-4 w-4 inline" />
            {{ tab.label }}
          </button>
        </nav>
      </div>
    </div>

    <!-- Contenu des onglets -->
    <div class="p-6">
      <!-- Onglet Agent IA -->
      <div v-if="activeTab === 'agent'" class="space-y-6">
        <!-- Configuration de base -->
        <div class="card">
          <div class="px-6 py-4 border-b border-gray-200">
            <h3 class="text-lg font-medium text-gray-900">Configuration de l'agent</h3>
            <p class="mt-1 text-sm text-gray-600">
              Personnalisez le comportement et la personnalité de votre agent IA
            </p>
          </div>
          <div class="p-6 space-y-6">
            <!-- Nom et avatar -->
            <div class="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <label class="block text-sm font-medium text-gray-700 mb-2">
                  Nom de l'agent *
                </label>
                <input
                  v-model="settings.agent.name"
                  type="text"
                  class="input-primary"
                  placeholder="Ex: Sophie, Assistant Commercial..."
                />
                <p class="mt-1 text-xs text-gray-500">
                  Le nom apparaîtra dans les conversations
                </p>
              </div>
              <div>
                <label class="block text-sm font-medium text-gray-700 mb-2">
                  Avatar
                </label>
                <div class="flex items-center space-x-4">
                  <div class="flex h-12 w-12 items-center justify-center rounded-full bg-blue-100">
                    <span class="text-sm font-medium text-blue-700">
                      {{ getInitials(settings.agent.name) }}
                    </span>
                  </div>
                  <button class="btn-secondary btn-sm">
                    Changer l'avatar
                  </button>
                </div>
              </div>
            </div>

            <!-- Message de bienvenue -->
            <div>
              <label class="block text-sm font-medium text-gray-700 mb-2">
                Message de bienvenue *
              </label>
              <textarea
                v-model="settings.agent.welcomeMessage"
                rows="3"
                class="input-primary"
                placeholder="Bonjour ! Je suis votre assistant commercial. Comment puis-je vous aider aujourd'hui ?"
              />
              <p class="mt-1 text-xs text-gray-500">
                Premier message affiché aux visiteurs
              </p>
            </div>

            <!-- Ton et personnalité -->
            <div>
              <label class="block text-sm font-medium text-gray-700 mb-2">
                Ton de communication
              </label>
              <select v-model="settings.agent.tone" class="input-primary">
                <option value="friendly">Amical et décontracté</option>
                <option value="professional">Professionnel et courtois</option>
                <option value="enthusiastic">Enthousiaste et engagé</option>
                <option value="helpful">Serviable et informatif</option>
              </select>
            </div>

            <!-- Instructions personnalisées -->
            <div>
              <label class="block text-sm font-medium text-gray-700 mb-2">
                Instructions spécifiques
              </label>
              <textarea
                v-model="settings.agent.customInstructions"
                rows="4"
                class="input-primary"
                placeholder="Ajoutez des instructions spécifiques sur le comportement de l'agent, les informations à mettre en avant, les offres spéciales..."
              />
              <p class="mt-1 text-xs text-gray-500">
                Instructions personnalisées pour guider l'agent dans ses réponses
              </p>
            </div>
          </div>
        </div>

        <!-- Stratégies de vente -->
        <div class="card">
          <div class="px-6 py-4 border-b border-gray-200">
            <h3 class="text-lg font-medium text-gray-900">Stratégies de vente</h3>
            <p class="mt-1 text-sm text-gray-600">
              Configurez les techniques de vente automatiques
            </p>
          </div>
          <div class="p-6 space-y-6">
            <!-- Upselling -->
            <div class="flex items-start space-x-3">
              <div class="flex items-center h-5">
                <input
                  v-model="settings.sales.enableUpselling"
                  type="checkbox"
                  class="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 rounded"
                />
              </div>
              <div class="flex-1">
                <label class="text-sm font-medium text-gray-900">
                  Activer l'upselling automatique
                </label>
                <p class="text-sm text-gray-600">
                  L'agent proposera automatiquement des produits complémentaires
                </p>
              </div>
            </div>

            <!-- Cross-selling -->
            <div class="flex items-start space-x-3">
              <div class="flex items-center h-5">
                <input
                  v-model="settings.sales.enableCrossSelling"
                  type="checkbox"
                  class="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 rounded"
                />
              </div>
              <div class="flex-1">
                <label class="text-sm font-medium text-gray-900">
                  Activer le cross-selling
                </label>
                <p class="text-sm text-gray-600">
                  L'agent suggérera des produits liés ou similaires
                </p>
              </div>
            </div>

            <!-- Urgence -->
            <div class="flex items-start space-x-3">
              <div class="flex items-center h-5">
                <input
                  v-model="settings.sales.createUrgency"
                  type="checkbox"
                  class="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 rounded"
                />
              </div>
              <div class="flex-1">
                <label class="text-sm font-medium text-gray-900">
                  Créer un sentiment d'urgence
                </label>
                <p class="text-sm text-gray-600">
                  L'agent mentionnera les stocks limités ou offres temporaires
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>

      <!-- Onglet Widget -->
      <div v-if="activeTab === 'widget'" class="space-y-6">
        <!-- Apparence du widget -->
        <div class="card">
          <div class="px-6 py-4 border-b border-gray-200">
            <h3 class="text-lg font-medium text-gray-900">Apparence du widget</h3>
            <p class="mt-1 text-sm text-gray-600">
              Personnalisez l'aspect visuel de votre widget de chat
            </p>
          </div>
          <div class="p-6 space-y-6">
            <!-- Couleurs -->
            <div class="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <label class="block text-sm font-medium text-gray-700 mb-2">
                  Couleur principale
                </label>
                <div class="flex items-center space-x-3">
                  <input
                    v-model="settings.widget.primaryColor"
                    type="color"
                    class="h-10 w-16 rounded border border-gray-300"
                  />
                  <input
                    v-model="settings.widget.primaryColor"
                    type="text"
                    class="input-primary flex-1"
                    placeholder="#2563eb"
                  />
                </div>
              </div>
              <div>
                <label class="block text-sm font-medium text-gray-700 mb-2">
                  Couleur du texte
                </label>
                <div class="flex items-center space-x-3">
                  <input
                    v-model="settings.widget.textColor"
                    type="color"
                    class="h-10 w-16 rounded border border-gray-300"
                  />
                  <input
                    v-model="settings.widget.textColor"
                    type="text"
                    class="input-primary flex-1"
                    placeholder="#ffffff"
                  />
                </div>
              </div>
            </div>

            <!-- Position -->
            <div>
              <label class="block text-sm font-medium text-gray-700 mb-2">
                Position du widget
              </label>
              <select v-model="settings.widget.position" class="input-primary">
                <option value="bottom-right">Bas droite</option>
                <option value="bottom-left">Bas gauche</option>
                <option value="top-right">Haut droite</option>
                <option value="top-left">Haut gauche</option>
              </select>
            </div>

            <!-- Texte du bouton -->
            <div>
              <label class="block text-sm font-medium text-gray-700 mb-2">
                Texte du bouton d'ouverture
              </label>
              <input
                v-model="settings.widget.buttonText"
                type="text"
                class="input-primary"
                placeholder="Besoin d'aide ? Chatez avec nous !"
              />
            </div>

            <!-- Prévisualisation -->
            <div>
              <label class="block text-sm font-medium text-gray-700 mb-2">
                Prévisualisation
              </label>
              <div class="border border-gray-200 rounded-lg p-4 bg-gray-50 relative h-64">
                <div 
                  class="absolute rounded-full shadow-lg flex items-center justify-center cursor-pointer transition-transform hover:scale-105"
                  :class="getWidgetPositionClass()"
                  :style="{
                    backgroundColor: settings.widget.primaryColor,
                    color: settings.widget.textColor
                  }"
                  style="width: 60px; height: 60px;"
                >
                  <svg class="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z" />
                  </svg>
                </div>
                <p class="text-xs text-gray-500 text-center mt-2">
                  Aperçu de votre widget sur le site
                </p>
              </div>
            </div>
          </div>
        </div>

        <!-- Code d'intégration -->
        <div class="card">
          <div class="px-6 py-4 border-b border-gray-200">
            <h3 class="text-lg font-medium text-gray-900">Code d'intégration</h3>
            <p class="mt-1 text-sm text-gray-600">
              Copiez ce code dans votre site web pour activer le widget
            </p>
          </div>
          <div class="p-6">
            <div class="relative">
              <pre class="bg-gray-900 text-gray-100 rounded-lg p-4 text-sm overflow-x-auto"><code>{{ integrationCode }}</code></pre>
              <button
                @click="copyIntegrationCode"
                class="absolute top-2 right-2 btn-secondary btn-sm"
              >
                <svg class="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M8 16H6a2 2 0 01-2-2V6a2 2 0 012-2h8a2 2 0 012 2v2m-6 12h8a2 2 0 002-2v-8a2 2 0 00-2-2h-8a2 2 0 00-2 2v8a2 2 0 002 2z" />
                </svg>
                Copier
              </button>
            </div>
            <p class="mt-3 text-sm text-gray-600">
              Collez ce code juste avant la fermeture de la balise &lt;/body&gt; de votre site web.
            </p>
          </div>
        </div>
      </div>

      <!-- Onglet Notifications -->
      <div v-if="activeTab === 'notifications'" class="space-y-6">
        <div class="card">
          <div class="px-6 py-4 border-b border-gray-200">
            <h3 class="text-lg font-medium text-gray-900">Préférences de notification</h3>
            <p class="mt-1 text-sm text-gray-600">
              Configurez quand et comment vous voulez être notifié
            </p>
          </div>
          <div class="p-6 space-y-6">
            <!-- Email -->
            <div class="space-y-4">
              <h4 class="font-medium text-gray-900">Notifications par email</h4>
              
              <div class="space-y-3">
                <div class="flex items-start space-x-3">
                  <div class="flex items-center h-5">
                    <input
                      v-model="settings.notifications.email.newConversation"
                      type="checkbox"
                      class="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 rounded"
                    />
                  </div>
                  <div class="flex-1">
                    <label class="text-sm font-medium text-gray-900">
                      Nouvelles conversations
                    </label>
                    <p class="text-sm text-gray-600">
                      Recevez un email pour chaque nouvelle conversation
                    </p>
                  </div>
                </div>

                <div class="flex items-start space-x-3">
                  <div class="flex items-center h-5">
                    <input
                      v-model="settings.notifications.email.newOrder"
                      type="checkbox"
                      class="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 rounded"
                    />
                  </div>
                  <div class="flex-1">
                    <label class="text-sm font-medium text-gray-900">
                      Nouvelles commandes
                    </label>
                    <p class="text-sm text-gray-600">
                      Soyez immédiatement informé des ventes
                    </p>
                  </div>
                </div>

                <div class="flex items-start space-x-3">
                  <div class="flex items-center h-5">
                    <input
                      v-model="settings.notifications.email.dailyReport"
                      type="checkbox"
                      class="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 rounded"
                    />
                  </div>
                  <div class="flex-1">
                    <label class="text-sm font-medium text-gray-900">
                      Rapport quotidien
                    </label>
                    <p class="text-sm text-gray-600">
                      Résumé quotidien des performances
                    </p>
                  </div>
                </div>
              </div>
            </div>

            <!-- Slack -->
            <div class="space-y-4">
              <h4 class="font-medium text-gray-900">Intégrations</h4>
              
              <div class="border border-gray-200 rounded-lg p-4">
                <div class="flex items-center justify-between">
                  <div class="flex items-center space-x-3">
                    <div class="flex h-8 w-8 items-center justify-center rounded bg-purple-100">
                      <svg class="h-4 w-4 text-purple-600" fill="currentColor" viewBox="0 0 24 24">
                        <path d="M5.042 15.165a2.528 2.528 0 0 1-2.52 2.523A2.528 2.528 0 0 1 0 15.165a2.527 2.527 0 0 1 2.522-2.52h2.52v2.52zM6.313 15.165a2.527 2.527 0 0 1 2.521-2.52 2.527 2.527 0 0 1 2.521 2.52v6.313A2.528 2.528 0 0 1 8.834 24a2.528 2.528 0 0 1-2.521-2.522v-6.313zM8.834 5.042a2.528 2.528 0 0 1-2.521-2.52A2.528 2.528 0 0 1 8.834 0a2.528 2.528 0 0 1 2.521 2.522v2.52H8.834zM8.834 6.313a2.528 2.528 0 0 1 2.521 2.521 2.528 2.528 0 0 1-2.521 2.521H2.522A2.528 2.528 0 0 1 0 8.834a2.528 2.528 0 0 1 2.522-2.521h6.312zM18.956 8.834a2.528 2.528 0 0 1 2.522-2.521A2.528 2.528 0 0 1 24 8.834a2.528 2.528 0 0 1-2.522 2.521h-2.522V8.834zM17.688 8.834a2.528 2.528 0 0 1-2.523 2.521 2.527 2.527 0 0 1-2.52-2.521V2.522A2.527 2.527 0 0 1 15.165 0a2.528 2.528 0 0 1 2.523 2.522v6.312zM15.165 18.956a2.528 2.528 0 0 1 2.523 2.522A2.528 2.528 0 0 1 15.165 24a2.527 2.527 0 0 1-2.52-2.522v-2.522h2.52zM15.165 17.688a2.527 2.527 0 0 1-2.52-2.523 2.526 2.526 0 0 1 2.52-2.52h6.313A2.527 2.527 0 0 1 24 15.165a2.528 2.528 0 0 1-2.522 2.523h-6.313z"/>
                      </svg>
                    </div>
                    <div>
                      <p class="text-sm font-medium text-gray-900">Slack</p>
                      <p class="text-sm text-gray-600">Recevez les notifications dans Slack</p>
                    </div>
                  </div>
                  <button class="btn-primary btn-sm">
                    Connecter
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      <!-- Onglet Compte -->
      <div v-if="activeTab === 'account'" class="space-y-6">
        <!-- Informations du compte -->
        <div class="card">
          <div class="px-6 py-4 border-b border-gray-200">
            <h3 class="text-lg font-medium text-gray-900">Informations du compte</h3>
            <p class="mt-1 text-sm text-gray-600">
              Gérez vos informations personnelles et d'entreprise
            </p>
          </div>
          <div class="p-6 space-y-6">
            <div class="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <label class="block text-sm font-medium text-gray-700 mb-2">
                  Prénom
                </label>
                <input
                  v-model="settings.account.firstName"
                  type="text"
                  class="input-primary"
                />
              </div>
              <div>
                <label class="block text-sm font-medium text-gray-700 mb-2">
                  Nom
                </label>
                <input
                  v-model="settings.account.lastName"
                  type="text"
                  class="input-primary"
                />
              </div>
            </div>

            <div>
              <label class="block text-sm font-medium text-gray-700 mb-2">
                Email
              </label>
              <input
                v-model="settings.account.email"
                type="email"
                class="input-primary"
              />
            </div>

            <div>
              <label class="block text-sm font-medium text-gray-700 mb-2">
                Entreprise
              </label>
              <input
                v-model="settings.account.company"
                type="text"
                class="input-primary"
              />
            </div>
          </div>
        </div>

        <!-- Sécurité -->
        <div class="card">
          <div class="px-6 py-4 border-b border-gray-200">
            <h3 class="text-lg font-medium text-gray-900">Sécurité</h3>
            <p class="mt-1 text-sm text-gray-600">
              Gérez votre mot de passe et la sécurité de votre compte
            </p>
          </div>
          <div class="p-6 space-y-4">
            <button
              @click="showPasswordModal = true"
              class="btn-secondary"
            >
              <svg class="mr-2 h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M15 7a2 2 0 012 2m4 0a6 6 0 01-7.743 5.743L11 17H9v2H7v2H4a1 1 0 01-1-1v-2.586a1 1 0 01.293-.707l5.964-5.964A6 6 0 1121 9z" />
              </svg>
              Changer le mot de passe
            </button>
          </div>
        </div>
      </div>
    </div>

    <!-- Modal changement de mot de passe -->
    <Modal v-model="showPasswordModal" title="Changer le mot de passe" size="md">
      <div class="space-y-4">
        <div>
          <label class="block text-sm font-medium text-gray-700 mb-2">
            Mot de passe actuel
          </label>
          <input
            v-model="passwordForm.current"
            type="password"
            class="input-primary"
            :class="{ 'input-error': passwordError }"
          />
        </div>
        <div>
          <label class="block text-sm font-medium text-gray-700 mb-2">
            Nouveau mot de passe
          </label>
          <input
            v-model="passwordForm.new"
            type="password"
            class="input-primary"
          />
        </div>
        <div>
          <label class="block text-sm font-medium text-gray-700 mb-2">
            Confirmer le nouveau mot de passe
          </label>
          <input
            v-model="passwordForm.confirm"
            type="password"
            class="input-primary"
            :class="{ 'input-error': passwordForm.new !== passwordForm.confirm }"
          />
        </div>
        <p v-if="passwordError" class="text-sm text-red-600">
          {{ passwordError }}
        </p>
      </div>

      <template #footer>
        <Button variant="secondary" @click="cancelPasswordChange">
          Annuler
        </Button>
        <Button 
          variant="primary" 
          :disabled="!canChangePassword || changingPassword"
          :loading="changingPassword"
          @click="changePassword"
        >
          Changer le mot de passe
        </Button>
      </template>
    </Modal>
  </div>
</template>

<script setup lang="ts">
import { ref, reactive, computed, onMounted, watch } from 'vue'
import { useAuthStore } from '~/stores/auth'

// Middleware d'authentification
definePageMeta({
  middleware: 'auth'
})

// Store
const authStore = useAuthStore()

// État du composant
const saving = ref(false)
const activeTab = ref('agent')
const showPasswordModal = ref(false)
const changingPassword = ref(false)
const passwordError = ref('')

// Configuration des onglets
const tabs = [
  { 
    id: 'agent', 
    label: 'Agent IA', 
    icon: 'svg' // Simplifié pour cet exemple
  },
  { 
    id: 'widget', 
    label: 'Widget', 
    icon: 'svg'
  },
  { 
    id: 'notifications', 
    label: 'Notifications', 
    icon: 'svg'
  },
  { 
    id: 'account', 
    label: 'Compte', 
    icon: 'svg'
  }
]

// Paramètres
const originalSettings = ref({})
const settings = reactive({
  agent: {
    name: 'Sophie',
    welcomeMessage: 'Bonjour ! Je suis Sophie, votre assistante commerciale. Comment puis-je vous aider aujourd\'hui ?',
    tone: 'friendly',
    customInstructions: 'Soyez toujours poli et professionnel. Mettez en avant nos délais de livraison rapides et notre service client exceptionnel.'
  },
  sales: {
    enableUpselling: true,
    enableCrossSelling: true,
    createUrgency: false
  },
  widget: {
    primaryColor: '#2563eb',
    textColor: '#ffffff',
    position: 'bottom-right',
    buttonText: 'Besoin d\'aide ? Chatez avec nous !'
  },
  notifications: {
    email: {
      newConversation: true,
      newOrder: true,
      dailyReport: false
    }
  },
  account: {
    firstName: authStore.user?.firstName || '',
    lastName: authStore.user?.lastName || '',
    email: authStore.user?.email || '',
    company: authStore.user?.company || ''
  }
})

// Formulaire de changement de mot de passe
const passwordForm = reactive({
  current: '',
  new: '',
  confirm: ''
})

// Computed properties
const hasChanges = computed(() => {
  return JSON.stringify(settings) !== JSON.stringify(originalSettings.value)
})

const canChangePassword = computed(() => {
  return passwordForm.current && 
         passwordForm.new && 
         passwordForm.confirm && 
         passwordForm.new === passwordForm.confirm &&
         passwordForm.new.length >= 8
})

const integrationCode = computed(() => {
  return `<!-- ChatSeller Widget -->
<script>
  window.ChatSellerConfig = {
    agentId: '${authStore.user?.id}',
    primaryColor: '${settings.widget.primaryColor}',
    textColor: '${settings.widget.textColor}',
    position: '${settings.widget.position}',
    buttonText: '${settings.widget.buttonText}'
  };
</script>
<script src="https://widget.chatseller.app/widget.js" async></script>
<!-- End ChatSeller Widget -->`
})

// Méthodes utilitaires
const getInitials = (name: string): string => {
  if (!name) return '??'
  return name.split(' ').map(n => n.charAt(0)).join('').toUpperCase().slice(0, 2)
}

const getWidgetPositionClass = (): string => {
  const positions = {
    'bottom-right': 'bottom-4 right-4',
    'bottom-left': 'bottom-4 left-4',
    'top-right': 'top-4 right-4',
    'top-left': 'top-4 left-4'
  }
  return positions[settings.widget.position as keyof typeof positions] || 'bottom-4 right-4'
}

// Actions
const loadSettings = async () => {
  try {
    // Simulation de chargement des paramètres depuis l'API
    await new Promise(resolve => setTimeout(resolve, 500))
    
    // Les paramètres sont déjà initialisés dans le reactive
    originalSettings.value = JSON.parse(JSON.stringify(settings))
  } catch (error) {
    console.error('Erreur lors du chargement des paramètres:', error)
  }
}

const saveSettings = async () => {
  saving.value = true
  try {
    // Appel API pour sauvegarder
    await $fetch('/api/settings', {
      method: 'PUT',
      body: settings,
      headers: {
        Authorization: `Bearer ${authStore.token}`
      }
    })

    // Mise à jour des paramètres de référence
    originalSettings.value = JSON.parse(JSON.stringify(settings))
    
    console.log('✅ Paramètres sauvegardés')
  } catch (error) {
    console.error('❌ Erreur lors de la sauvegarde:', error)
  } finally {
    saving.value = false
  }
}

const resetToDefaults = () => {
  if (confirm('Êtes-vous sûr de vouloir réinitialiser tous les paramètres ?')) {
    Object.assign(settings, originalSettings.value)
  }
}

const copyIntegrationCode = async () => {
  try {
    await navigator.clipboard.writeText(integrationCode.value)
    console.log('✅ Code copié dans le presse-papier')
  } catch (error) {
    console.error('❌ Erreur lors de la copie:', error)
  }
}

const changePassword = async () => {
  changingPassword.value = true
  passwordError.value = ''
  
  try {
    await authStore.changePassword(passwordForm.current, passwordForm.new)
    
    // Réinitialiser le formulaire
    Object.assign(passwordForm, {
      current: '',
      new: '',
      confirm: ''
    })
    
    showPasswordModal.value = false
    console.log('✅ Mot de passe changé avec succès')
  } catch (error: any) {
    passwordError.value = error.message
  } finally {
    changingPassword.value = false
  }
}

const cancelPasswordChange = () => {
  Object.assign(passwordForm, {
    current: '',
    new: '',
    confirm: ''
  })
  passwordError.value = ''
  showPasswordModal.value = false
}

// Watchers
watch(() => settings.account, (newAccount) => {
  // Synchroniser avec le store auth si nécessaire
  if (authStore.user && hasChanges.value) {
    // Marquer comme modifié pour activer le bouton save
  }
}, { deep: true })

// Lifecycle
onMounted(() => {
  loadSettings()
})
</script>

<style scoped>
/* Les styles sont définis dans le fichier CSS global */
</style>