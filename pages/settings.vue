<!-- pages/settings.vue - VERSION CORRIGÉE COMPLÈTE -->
<template>
  <div class="space-y-6">
    <!-- Header -->
    <div class="flex items-center justify-between">
      <div>
        <h1 class="text-2xl font-bold text-gray-900">Paramètres</h1>
        <p class="text-gray-600">Configurez votre agent IA et personnalisez votre widget</p>
      </div>
      
      <div class="flex space-x-3">
        <button
          @click="resetToDefaults"
          :disabled="saving"
          class="inline-flex items-center px-4 py-2 border border-gray-300 rounded-md shadow-sm text-sm font-medium text-gray-700 bg-white hover:bg-gray-50 disabled:opacity-50"
        >
          <svg class="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15"/>
          </svg>
          Réinitialiser
        </button>
        
        <button
          @click="saveSettings"
          :disabled="saving"
          class="inline-flex items-center px-4 py-2 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-blue-600 hover:bg-blue-700 disabled:opacity-50"
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

    <!-- Tabs Navigation -->
    <div class="border-b border-gray-200">
      <nav class="-mb-px flex space-x-8">
        <button
          v-for="tab in tabs"
          :key="tab.id"
          @click="activeTab = tab.id"
          :class="[
            'py-2 px-1 border-b-2 font-medium text-sm',
            activeTab === tab.id
              ? 'border-blue-500 text-blue-600'
              : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
          ]"
        >
          {{ tab.label }}
        </button>
      </nav>
    </div>

    <!-- Tab Content -->
    <div class="mt-6">
      <!-- Agent Settings Tab -->
      <div v-show="activeTab === 'agent'" class="space-y-6">
        <div class="grid grid-cols-1 gap-6 lg:grid-cols-2">
          <!-- Agent Configuration -->
          <div class="bg-white shadow rounded-lg">
            <div class="px-4 py-5 sm:p-6">
              <h3 class="text-lg leading-6 font-medium text-gray-900 mb-4">
                Configuration de l'agent
              </h3>
              
              <div class="space-y-4">
                <!-- Agent Name -->
                <div>
                  <label class="block text-sm font-medium text-gray-700">
                    Nom de l'agent
                  </label>
                  <input
                    v-model="settings.botName"
                    type="text"
                    class="mt-1 block w-full border border-gray-300 rounded-md px-3 py-2 shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500"
                    placeholder="Assistant IA"
                  >
                </div>

                <!-- Welcome Message -->
                <div>
                  <label class="block text-sm font-medium text-gray-700">
                    Message de bienvenue
                  </label>
                  <textarea
                    v-model="settings.welcomeMessage"
                    rows="3"
                    class="mt-1 block w-full border border-gray-300 rounded-md px-3 py-2 shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500"
                    placeholder="Bonjour ! Comment puis-je vous aider aujourd'hui ?"
                  ></textarea>
                </div>

                <!-- Button Text -->
                <div>
                  <label class="block text-sm font-medium text-gray-700">
                    Texte du bouton
                  </label>
                  <input
                    v-model="settings.buttonText"
                    type="text"
                    class="mt-1 block w-full border border-gray-300 rounded-md px-3 py-2 shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500"
                    placeholder="Parler à un conseiller"
                  >
                </div>
              </div>
            </div>
          </div>

          <!-- Appearance -->
          <div class="bg-white shadow rounded-lg">
            <div class="px-4 py-5 sm:p-6">
              <h3 class="text-lg leading-6 font-medium text-gray-900 mb-4">
                Apparence
              </h3>
              
              <div class="space-y-4">
                <!-- Primary Color -->
                <div>
                  <label class="block text-sm font-medium text-gray-700">
                    Couleur principale
                  </label>
                  <div class="mt-1 flex items-center space-x-3">
                    <input
                      v-model="settings.primaryColor"
                      type="color"
                      class="h-10 w-20 border border-gray-300 rounded-md cursor-pointer"
                    >
                    <input
                      v-model="settings.primaryColor"
                      type="text"
                      class="block w-full border border-gray-300 rounded-md px-3 py-2 shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500"
                      placeholder="#3B82F6"
                    >
                  </div>
                </div>

                <!-- Position -->
                <div>
                  <label class="block text-sm font-medium text-gray-700 mb-2">
                    Position du widget
                  </label>
                  <div class="space-y-2">
                    <label class="flex items-center">
                      <input
                        v-model="settings.position"
                        type="radio"
                        value="bottom-left"
                        class="focus:ring-blue-500 h-4 w-4 text-blue-600 border-gray-300"
                      >
                      <span class="ml-2 text-sm text-gray-700">En bas à gauche</span>
                    </label>
                    <label class="flex items-center">
                      <input
                        v-model="settings.position"
                        type="radio"
                        value="bottom-right"
                        class="focus:ring-blue-500 h-4 w-4 text-blue-600 border-gray-300"
                      >
                      <span class="ml-2 text-sm text-gray-700">En bas à droite</span>
                    </label>
                  </div>
                </div>

                <!-- Widget Status -->
                <div class="flex items-center justify-between">
                  <div>
                    <label class="text-sm font-medium text-gray-700">
                      Widget actif
                    </label>
                    <p class="text-xs text-gray-500">
                      Activez ou désactivez le widget sur votre site
                    </p>
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
        </div>
      </div>

      <!-- Integration Tab -->
      <div v-show="activeTab === 'integration'" class="space-y-6">
        <div class="bg-white shadow rounded-lg">
          <div class="px-4 py-5 sm:p-6">
            <h3 class="text-lg leading-6 font-medium text-gray-900 mb-4">
              Code d'intégration
            </h3>
            
            <p class="text-sm text-gray-600 mb-4">
              Copiez et collez ce code juste avant la balise &lt;/body&gt; de votre site web.
            </p>

            <div class="relative">
              <pre class="bg-gray-50 border border-gray-200 rounded-md p-4 text-sm overflow-x-auto whitespace-pre-wrap"><code>{{ displayWidgetCode }}</code></pre>
              
              <button
                @click="copyWidgetCode"
                class="absolute top-2 right-2 inline-flex items-center px-2 py-1 border border-transparent text-xs font-medium rounded text-gray-700 bg-white hover:bg-gray-50 shadow-sm"
              >
                <svg class="w-4 h-4 mr-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M8 16H6a2 2 0 01-2-2V6a2 2 0 012-2h8a2 2 0 012 2v2m-6 12h8a2 2 0 002-2v-8a2 2 0 00-2-2h-8a2 2 0 00-2 2v8a2 2 0 002 2z"/>
                </svg>
                Copier
              </button>
            </div>

            <div class="mt-6 p-4 bg-blue-50 rounded-md">
              <div class="flex">
                <div class="flex-shrink-0">
                  <svg class="h-5 w-5 text-blue-400" fill="currentColor" viewBox="0 0 20 20">
                    <path fill-rule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7-4a1 1 0 11-2 0 1 1 0 012 0zM9 9a1 1 0 000 2v3a1 1 0 001 1h1a1 1 0 100-2v-3a1 1 0 00-1-1H9z" clip-rule="evenodd"/>
                  </svg>
                </div>
                <div class="ml-3">
                  <h3 class="text-sm font-medium text-blue-800">
                    Instructions d'installation
                  </h3>
                  <div class="mt-2 text-sm text-blue-700">
                    <ul class="list-disc list-inside space-y-1">
                      <li>Copiez le code ci-dessus</li>
                      <li>Ouvrez votre site web ou CMS</li>
                      <li>Collez le code juste avant la balise &lt;/body&gt;</li>
                      <li>Sauvegardez et le widget apparaîtra automatiquement</li>
                    </ul>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      <!-- Account Tab -->
      <div v-show="activeTab === 'account'" class="space-y-6">
        <div class="grid grid-cols-1 gap-6 lg:grid-cols-2">
          <!-- Profile Information -->
          <div class="bg-white shadow rounded-lg">
            <div class="px-4 py-5 sm:p-6">
              <h3 class="text-lg leading-6 font-medium text-gray-900 mb-4">
                Informations du profil
              </h3>
              
              <div class="space-y-4">
                <!-- Profile Avatar -->
                <div class="flex items-center">
                  <div class="flex-shrink-0 h-16 w-16">
                    <div class="h-16 w-16 rounded-full bg-gray-300 flex items-center justify-center">
                      <span class="text-xl font-medium text-gray-700">
                        {{ getInitials(user?.name) }}
                      </span>
                    </div>
                  </div>
                  <div class="ml-5">
                    <button class="bg-white py-2 px-3 border border-gray-300 rounded-md shadow-sm text-sm leading-4 font-medium text-gray-700 hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500">
                      Changer l'avatar
                    </button>
                  </div>
                </div>

                <!-- Name -->
                <div>
                  <label class="block text-sm font-medium text-gray-700">
                    Nom complet
                  </label>
                  <input
                    v-model="profileData.name"
                    type="text"
                    class="mt-1 block w-full border border-gray-300 rounded-md px-3 py-2 shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500"
                  >
                </div>

                <!-- Email -->
                <div>
                  <label class="block text-sm font-medium text-gray-700">
                    Email
                  </label>
                  <input
                    v-model="profileData.email"
                    type="email"
                    class="mt-1 block w-full border border-gray-300 rounded-md px-3 py-2 shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500"
                    disabled
                  >
                  <p class="mt-1 text-xs text-gray-500">
                    L'email ne peut pas être modifié pour des raisons de sécurité.
                  </p>
                </div>
              </div>
            </div>
          </div>

          <!-- Security -->
          <div class="bg-white shadow rounded-lg">
            <div class="px-4 py-5 sm:p-6">
              <h3 class="text-lg leading-6 font-medium text-gray-900 mb-4">
                Sécurité
              </h3>
              
              <div class="space-y-4">
                <div>
                  <label class="block text-sm font-medium text-gray-700">
                    Mot de passe
                  </label>
                  <div class="mt-1">
                    <button
                      @click="showPasswordModal = true"
                      class="inline-flex items-center px-4 py-2 border border-gray-300 shadow-sm text-sm font-medium rounded-md text-gray-700 bg-white hover:bg-gray-50"
                    >
                      Changer le mot de passe
                    </button>
                  </div>
                </div>

                <div>
                  <label class="block text-sm font-medium text-gray-700">
                    Dernière connexion
                  </label>
                  <p class="mt-1 text-sm text-gray-900">
                    {{ formatDate(new Date()) }}
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>

    <!-- Password Change Modal -->
    <Modal
      :show="showPasswordModal"
      title="Changer le mot de passe"
      size="md"
      @close="showPasswordModal = false"
    >
      <div class="space-y-4">
        <div>
          <label class="block text-sm font-medium text-gray-700">
            Mot de passe actuel
          </label>
          <input
            v-model="passwordData.current"
            type="password"
            class="mt-1 block w-full border border-gray-300 rounded-md px-3 py-2 shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500"
          >
        </div>

        <div>
          <label class="block text-sm font-medium text-gray-700">
            Nouveau mot de passe
          </label>
          <input
            v-model="passwordData.new"
            type="password"
            class="mt-1 block w-full border border-gray-300 rounded-md px-3 py-2 shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500"
          >
        </div>

        <div>
          <label class="block text-sm font-medium text-gray-700">
            Confirmer le nouveau mot de passe
          </label>
          <input
            v-model="passwordData.confirm"
            type="password"
            class="mt-1 block w-full border border-gray-300 rounded-md px-3 py-2 shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500"
          >
        </div>

        <div class="flex justify-end space-x-3 pt-4">
          <button
            @click="cancelPasswordChange"
            class="px-4 py-2 border border-gray-300 rounded-md shadow-sm text-sm font-medium text-gray-700 bg-white hover:bg-gray-50"
          >
            Annuler
          </button>
          <button
            @click="changePassword"
            :disabled="!canChangePassword"
            class="px-4 py-2 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-blue-600 hover:bg-blue-700 disabled:opacity-50"
          >
            Changer
          </button>
        </div>
      </div>
    </Modal>
  </div>
</template>

<script setup lang="ts">
// ✅ META PAGE
definePageMeta({
  middleware: 'auth',
  layout: 'dashboard'
})

// ✅ COMPOSABLES
const auth = useAuth()
const api = useApi()

// ✅ REACTIVE DATA
const saving = ref(false)
const activeTab = ref('agent')
const showPasswordModal = ref(false)

const tabs = [
  { id: 'agent', label: 'Agent IA' },
  { id: 'integration', label: 'Intégration' },
  { id: 'account', label: 'Compte' }
]

const settings = ref({
  botName: 'Assistant ChatSeller',
  welcomeMessage: 'Bonjour ! Comment puis-je vous aider aujourd\'hui ?',
  buttonText: 'Parler à un conseiller',
  primaryColor: '#3B82F6',
  position: 'bottom-right' as 'bottom-left' | 'bottom-right',
  isActive: true
})

const profileData = ref({
  name: '',
  email: ''
})

const passwordData = ref({
  current: '',
  new: '',
  confirm: ''
})

// ✅ COMPUTED
const user = computed(() => auth.user.value)

const canChangePassword = computed(() => {
  return passwordData.value.current && 
         passwordData.value.new && 
         passwordData.value.confirm && 
         passwordData.value.new === passwordData.value.confirm &&
         passwordData.value.new.length >= 6
})

// ✅ COMPUTED TEMPLATE LITERAL CORRIGÉ
const displayWidgetCode = computed(() => {
  const shopId = auth.userShopId.value || 'YOUR_SHOP_ID'
  
  // ✅ CORRECTION: Utilisation de template literal sûr
  const scriptContent = [
    '(function() {',
    '  var script = document.createElement(\'script\');',
    '  script.src = \'https://widget.chatseller.app/widget.js\';',
    `  script.setAttribute('data-shop-id', '${shopId}');`,
    `  script.setAttribute('data-bot-name', '${settings.value.botName}');`,
    `  script.setAttribute('data-welcome-message', '${settings.value.welcomeMessage}');`,
    `  script.setAttribute('data-primary-color', '${settings.value.primaryColor}');`,
    `  script.setAttribute('data-position', '${settings.value.position}');`,
    `  script.setAttribute('data-button-text', '${settings.value.buttonText}');`,
    '  document.head.appendChild(script);',
    '})();'
  ].join('\n')
  
  return `<script>\n${scriptContent}\n</script>`
})

// ✅ METHODS
const loadSettings = async () => {
  try {
    // TODO: Charger les paramètres depuis l'API
    if (user.value) {
      profileData.value.name = user.value.name || ''
      profileData.value.email = user.value.email || ''
    }
  } catch (error) {
    console.error('Erreur lors du chargement des paramètres:', error)
  }
}

const saveSettings = async () => {
  saving.value = true
  try {
    // TODO: Sauvegarder via l'API
    await new Promise(resolve => setTimeout(resolve, 1000)) // Simulation
    console.log('Paramètres sauvegardés:', settings.value)
  } catch (error) {
    console.error('Erreur lors de la sauvegarde:', error)
  } finally {
    saving.value = false
  }
}

const resetToDefaults = () => {
  if (confirm('Êtes-vous sûr de vouloir réinitialiser tous les paramètres ?')) {
    settings.value = {
      botName: 'Assistant ChatSeller',
      welcomeMessage: 'Bonjour ! Comment puis-je vous aider aujourd\'hui ?',
      buttonText: 'Parler à un conseiller',
      primaryColor: '#3B82F6',
      position: 'bottom-right',
      isActive: true
    }
  }
}

const copyWidgetCode = async () => {
  try {
    await navigator.clipboard.writeText(displayWidgetCode.value)
    // TODO: Afficher une notification de succès
    console.log('Code copié dans le presse-papier')
  } catch (error) {
    console.error('Erreur lors de la copie:', error)
  }
}

const changePassword = async () => {
  try {
    // TODO: Changer le mot de passe via l'API
    await new Promise(resolve => setTimeout(resolve, 1000)) // Simulation
    showPasswordModal.value = false
    passwordData.value = { current: '', new: '', confirm: '' }
    console.log('Mot de passe changé avec succès')
  } catch (error) {
    console.error('Erreur lors du changement de mot de passe:', error)
  }
}

const cancelPasswordChange = () => {
  showPasswordModal.value = false
  passwordData.value = { current: '', new: '', confirm: '' }
}

const getInitials = (name?: string): string => {
  return auth.getInitials(name)
}

const formatDate = (date: Date): string => {
  return date.toLocaleDateString('fr-FR', {
    year: 'numeric',
    month: 'long',
    day: 'numeric',
    hour: '2-digit',
    minute: '2-digit'
  })
}

// ✅ LIFECYCLE
onMounted(() => {
  loadSettings()
})
</script>