<template>
  <div class="min-h-screen bg-gray-50 p-6">
    <!-- Header -->
    <div class="mb-8">
      <div class="flex items-center justify-between">
        <div>
          <h1 class="text-2xl font-bold text-gray-900">Paramètres ChatSeller</h1>
          <p class="text-gray-600">Configurez votre agent IA et votre widget</p>
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
    </div>

    <!-- Tabs Navigation -->
    <div class="border-b border-gray-200 mb-6">
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
    <div class="max-w-6xl mx-auto">
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
              <pre class="bg-gray-50 border border-gray-200 rounded-md p-4 text-sm overflow-x-auto whitespace-pre-wrap"><code>{{ widgetCodeDisplay }}</code></pre>
              
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

            <div v-if="copied" class="mt-4 p-4 bg-green-50 border border-green-200 rounded-md">
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
        <div class="bg-white shadow rounded-lg">
          <div class="px-4 py-5 sm:p-6">
            <h3 class="text-lg leading-6 font-medium text-gray-900 mb-4">
              Informations du compte
            </h3>
            
            <div class="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <label class="block text-sm font-medium text-gray-700 mb-2">Nom</label>
                <input
                  v-model="profileData.name"
                  type="text"
                  class="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                >
              </div>
              
              <div>
                <label class="block text-sm font-medium text-gray-700 mb-2">Email</label>
                <input
                  v-model="profileData.email"
                  type="email"
                  disabled
                  class="w-full px-3 py-2 border border-gray-300 rounded-md bg-gray-50 text-gray-500"
                >
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
// ✅ META PAGE
definePageMeta({
  middleware: 'auth'
})

// ✅ COMPOSABLES
const auth = useAuth()

// ✅ REACTIVE DATA
const saving = ref(false)
const copied = ref(false)
const activeTab = ref('agent')

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
  position: 'bottom-right',
  isActive: true
})

const profileData = ref({
  name: '',
  email: ''
})

// ✅ COMPUTED - Version sans conflit SFC
const widgetCodeDisplay = computed(() => {
  const shopId = auth.userShopId?.value || 'YOUR_SHOP_ID'
  
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
    '  document.head.appendChild(script);',
    '})();'
  ]
  
  const jsContent = jsLines.join('\n')
  
  // ✅ SOLUTION SÛRE : Éviter le conflit Vue SFC parser
  const TAG_NAME = 'script'
  const openTag = '<' + TAG_NAME + '>'
  const closeTag = '</' + TAG_NAME + '>'
  
  return openTag + '\n' + jsContent + '\n' + closeTag
})

// ✅ COMPUTED pour l'utilisateur
const user = computed(() => auth.user?.value)

// ✅ METHODS
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

const saveSettings = async () => {
  saving.value = true
  try {
    await new Promise(resolve => setTimeout(resolve, 1000))
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
    await navigator.clipboard.writeText(widgetCodeDisplay.value)
    copied.value = true
    setTimeout(() => {
      copied.value = false
    }, 3000)
    console.log('Code copié dans le presse-papier')
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
@keyframes spin {
  from { transform: rotate(0deg); }
  to { transform: rotate(360deg); }
}

.animate-spin {
  animation: spin 1s linear infinite;
}
</style>