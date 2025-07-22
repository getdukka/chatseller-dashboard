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
              class="inline-flex items-center px-4 py-2 border border-gray-300 rounded-md shadow-sm text-sm font-medium text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
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
              class="inline-flex items-center px-4 py-2 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 disabled:opacity-50 disabled:cursor-not-allowed"
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
            <svg class="mr-2 h-4 w-4 inline" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 6V4m0 2a2 2 0 100 4m0-4a2 2 0 110 4m-6 8a2 2 0 100-4m0 4a2 2 0 100 4m0-4v2m0-6V4m6 6v10m6-2a2 2 0 100-4m0 4a2 2 0 100 4m0-4v2m0-6V4" />
            </svg>
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
        <div class="bg-white shadow rounded-lg">
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
                  class="mt-1 block w-full border-gray-300 rounded-md shadow-sm focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
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
                  <button class="inline-flex items-center px-3 py-2 border border-gray-300 shadow-sm text-sm leading-4 font-medium rounded-md text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500">
                    Changer l'avatar
                  </button>
                </div>
              </div>
            </div>

            <!-- Code d'intégration -->
            <div>
              <label class="block text-sm font-medium text-gray-700 mb-2">
                Code d'intégration
              </label>
              <div class="relative">
                <pre class="bg-gray-900 text-gray-100 rounded-lg p-4 text-sm overflow-x-auto">
<code>&lt;!-- ChatSeller Widget --&gt;
&lt;script&gt;
  window.ChatSellerConfig = {
    agentId: '{{ authStore.user?.id }}',
    primaryColor: '{{ settings.widget.primaryColor }}',
    textColor: '{{ settings.widget.textColor }}',
    position: '{{ settings.widget.position }}',
    buttonText: '{{ settings.widget.buttonText }}'
  };
&lt;/script&gt;
&lt;script src="https://widget.chatseller.app/widget.js" async&gt;&lt;/script&gt;
&lt;!-- End ChatSeller Widget --&gt;</code>
                </pre>
                <button
                  @click="copyIntegrationCode"
                  class="absolute top-2 right-2 inline-flex items-center px-2 py-1 border border-transparent text-xs font-medium rounded text-gray-700 bg-gray-200 hover:bg-gray-300 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
                >
                  <svg class="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M8 16H6a2 2 0 01-2-2V6a2 2 0 012-2h8a2 2 0 012 2v2m-6 12h8a2 2 0 002-2v-8a2 2 0 00-2-2h-8a2 2 0 00-2 2v8a2 2 0 002 2z" />
                  </svg>
                  Copier
                </button>
              </div>
            </div>
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
            class="mt-1 block w-full border-gray-300 rounded-md shadow-sm focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
            :class="{ 'border-red-300': passwordError }"
          />
        </div>
        <div>
          <label class="block text-sm font-medium text-gray-700 mb-2">
            Nouveau mot de passe
          </label>
          <input
            v-model="passwordForm.new"
            type="password"
            class="mt-1 block w-full border-gray-300 rounded-md shadow-sm focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
          />
        </div>
        <div>
          <label class="block text-sm font-medium text-gray-700 mb-2">
            Confirmer le nouveau mot de passe
          </label>
          <input
            v-model="passwordForm.confirm"
            type="password"
            class="mt-1 block w-full border-gray-300 rounded-md shadow-sm focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
            :class="{ 'border-red-300': passwordForm.new !== passwordForm.confirm }"
          />
        </div>
        <p v-if="passwordError" class="text-sm text-red-600">
          {{ passwordError }}
        </p>
      </div>

      <template #footer>
        <button @click="cancelPasswordChange" class="inline-flex items-center px-4 py-2 border border-gray-300 rounded-md shadow-sm text-sm font-medium text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500">
          Annuler
        </button>
        <button 
          :disabled="!canChangePassword || changingPassword"
          :class="changingPassword ? 'opacity-50 cursor-not-allowed' : ''"
          @click="changePassword"
          class="ml-3 inline-flex items-center px-4 py-2 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
        >
          <svg v-if="changingPassword" class="animate-spin -ml-1 mr-2 h-4 w-4 text-white" fill="none" viewBox="0 0 24 24">
            <circle class="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" stroke-width="4"></circle>
            <path class="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
          </svg>
          Changer le mot de passe
        </button>
      </template>
    </Modal>
  </div>
</template>

<script setup lang="ts">
import { ref, reactive, computed, onMounted } from 'vue'
import Modal from '~/components/ui/Modal.vue'

// Middleware d'authentification
definePageMeta({
  middleware: 'auth'
})

// État du composant
const saving = ref(false)
const activeTab = ref('agent')
const showPasswordModal = ref(false)
const changingPassword = ref(false)
const passwordError = ref('')

// Store auth
const authStore = useAuthStore()

// Configuration des onglets
const tabs = [
  { id: 'agent', label: 'Agent IA' },
  { id: 'widget', label: 'Widget' },
  { id: 'notifications', label: 'Notifications' },
  { id: 'account', label: 'Compte' }
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

// Méthodes utilitaires
const getInitials = (name: string): string => {
  if (!name) return '??'
  return name.split(' ').map(n => n.charAt(0)).join('').toUpperCase().slice(0, 2)
}

// Actions
const loadSettings = async () => {
  try {
    const response = await $fetch('/api/settings')
    if (response.success) {
      Object.assign(settings, response.data)
      originalSettings.value = JSON.parse(JSON.stringify(settings))
    }
  } catch (error) {
    console.error('Erreur lors du chargement des paramètres:', error)
  }
}

const saveSettings = async () => {
  saving.value = true
  try {
    const response = await $fetch('/api/settings', {
      method: 'PUT',
      body: settings
    })

    if (response.success) {
      originalSettings.value = JSON.parse(JSON.stringify(settings))
      console.log('✅ Paramètres sauvegardés')
    }
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
    const integrationCode = `<!-- ChatSeller Widget -->
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

    await navigator.clipboard.writeText(integrationCode)
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

// Lifecycle
onMounted(() => {
  loadSettings()
})
</script>