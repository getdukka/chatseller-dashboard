<template>
  <div class="max-w-6xl mx-auto">
    <!-- Navigation par onglets -->
    <div class="border-b border-gray-200 mb-8">
      <nav class="-mb-px flex space-x-8">
        <button
          v-for="tab in tabs"
          :key="tab.id"
          @click="activeTab = tab.id"
          :class="[
            activeTab === tab.id
              ? 'border-blue-500 text-blue-600'
              : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300',
            'whitespace-nowrap py-2 px-1 border-b-2 font-medium text-sm transition-colors duration-200'
          ]"
        >
          <component :is="tab.icon" class="h-5 w-5 mr-2" />
          {{ tab.name }}
        </button>
      </nav>
    </div>

    <!-- Contenu des onglets -->
    <div class="grid grid-cols-1 lg:grid-cols-3 gap-8">
      <!-- Configuration (2/3) -->
      <div class="lg:col-span-2 space-y-6">
        
        <!-- Onglet Agent IA -->
        <div v-show="activeTab === 'agent'" class="space-y-6">
          <!-- Apparence de l'agent -->
          <div class="bg-white rounded-lg border border-gray-200 p-6">
            <h3 class="text-lg font-semibold text-gray-900 mb-6">Apparence de l'agent</h3>
            
            <div class="space-y-6">
              <!-- Nom de l'agent -->
              <div>
                <label class="block text-sm font-medium text-gray-700 mb-2">
                  Nom de l'agent
                </label>
                <input
                  v-model="agentConfig.name"
                  type="text"
                  placeholder="ex: Sophie, Marc, Aïcha..."
                  class="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-blue-500 focus:border-blue-500"
                />
                <p class="text-xs text-gray-500 mt-1">
                  Le nom affiché dans le chat
                </p>
              </div>

              <!-- Avatar de l'agent -->
              <div>
                <label class="block text-sm font-medium text-gray-700 mb-2">
                  Avatar de l'agent
                </label>
                <div class="flex items-center space-x-4">
                  <div class="flex-shrink-0">
                    <img
                      :src="agentConfig.avatarUrl || '/default-agent.png'"
                      :alt="agentConfig.name"
                      class="h-16 w-16 rounded-full object-cover border-2 border-gray-200"
                    />
                  </div>
                  <div class="flex-1">
                    <button
                      @click="uploadAvatar"
                      class="inline-flex items-center px-4 py-2 border border-gray-300 rounded-md text-sm font-medium text-gray-700 bg-white hover:bg-gray-50"
                    >
                      <PhotoIcon class="h-4 w-4 mr-2" />
                      Changer l'avatar
                    </button>
                    <p class="text-xs text-gray-500 mt-1">
                      JPG, PNG max 2MB
                    </p>
                  </div>
                </div>
              </div>

              <!-- Message de bienvenue -->
              <div>
                <label class="block text-sm font-medium text-gray-700 mb-2">
                  Message de bienvenue
                </label>
                <textarea
                  v-model="agentConfig.welcomeMessage"
                  rows="3"
                  placeholder="Bonjour ! Je suis Sophie, votre assistante virtuelle. Comment puis-je vous aider à trouver le produit parfait ?"
                  class="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-blue-500 focus:border-blue-500"
                ></textarea>
                <p class="text-xs text-gray-500 mt-1">
                  Premier message affiché aux visiteurs
                </p>
              </div>

              <!-- Langue principale -->
              <div>
                <label class="block text-sm font-medium text-gray-700 mb-2">
                  Langue principale
                </label>
                <select
                  v-model="agentConfig.language"
                  class="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-blue-500 focus:border-blue-500"
                >
                  <option value="fr">Français</option>
                  <option value="en">English</option>
                  <option value="pt">Português</option>
                </select>
              </div>
            </div>
          </div>

          <!-- Comportement de l'agent -->
          <div class="bg-white rounded-lg border border-gray-200 p-6">
            <h3 class="text-lg font-semibold text-gray-900 mb-6">Comportement de l'agent</h3>
            
            <div class="space-y-6">
              <!-- Style de réponse -->
              <div>
                <label class="block text-sm font-medium text-gray-700 mb-2">
                  Style de réponse
                </label>
                <select
                  v-model="agentConfig.responseStyle"
                  class="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-blue-500 focus:border-blue-500"
                >
                  <option value="friendly">Amical et décontracté</option>
                  <option value="professional">Professionnel</option>
                  <option value="expert">Expert technique</option>
                  <option value="enthusiastic">Enthousiaste</option>
                </select>
              </div>

              <!-- Longueur des réponses -->
              <div>
                <label class="block text-sm font-medium text-gray-700 mb-2">
                  Longueur des réponses
                </label>
                <select
                  v-model="agentConfig.responseLength"
                  class="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-blue-500 focus:border-blue-500"
                >
                  <option value="short">Courtes</option>
                  <option value="medium">Moyennes</option>
                  <option value="long">Détaillées</option>
                </select>
              </div>

              <!-- Options avancées -->
              <div class="space-y-4">
                <div class="flex items-center justify-between">
                  <div>
                    <label class="text-sm font-medium text-gray-700">Mode proactif</label>
                    <p class="text-xs text-gray-500">L'agent propose des produits sans attendre qu'on lui demande</p>
                  </div>
                  <ToggleSwitch v-model="agentConfig.proactiveMode" />
                </div>

                <div class="flex items-center justify-between">
                  <div>
                    <label class="text-sm font-medium text-gray-700">Vente additionnelle automatique</label>
                    <p class="text-xs text-gray-500">L'agent propose des produits complémentaires</p>
                  </div>
                  <ToggleSwitch v-model="agentConfig.upsellEnabled" />
                </div>

                <div class="flex items-center justify-between">
                  <div>
                    <label class="text-sm font-medium text-gray-700">Collecte d'email automatique</label>
                    <p class="text-xs text-gray-500">Demander l'email avant de finaliser une commande</p>
                  </div>
                  <ToggleSwitch v-model="agentConfig.emailCollection" />
                </div>
              </div>
            </div>
          </div>
        </div>

        <!-- Onglet Widget -->
        <div v-show="activeTab === 'widget'" class="space-y-6">
          <!-- Apparence du widget -->
          <div class="bg-white rounded-lg border border-gray-200 p-6">
            <h3 class="text-lg font-semibold text-gray-900 mb-6">Apparence du widget</h3>
            
            <div class="space-y-6">
              <!-- Texte du bouton -->
              <div>
                <label class="block text-sm font-medium text-gray-700 mb-2">
                  Texte du bouton
                </label>
                <input
                  v-model="widgetConfig.buttonText"
                  type="text"
                  placeholder="Parler à la vendeuse"
                  class="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-blue-500 focus:border-blue-500"
                />
              </div>

              <!-- Couleur principale -->
              <div>
                <label class="block text-sm font-medium text-gray-700 mb-2">
                  Couleur principale
                </label>
                <div class="flex items-center space-x-4">
                  <input
                    v-model="widgetConfig.primaryColor"
                    type="color"
                    class="h-10 w-16 rounded border border-gray-300"
                  />
                  <input
                    v-model="widgetConfig.primaryColor"
                    type="text"
                    class="flex-1 px-3 py-2 border border-gray-300 rounded-md focus:ring-blue-500 focus:border-blue-500"
                  />
                </div>
              </div>

              <!-- Position du bouton -->
              <div>
                <label class="block text-sm font-medium text-gray-700 mb-2">
                  Position du bouton
                </label>
                <div class="grid grid-cols-2 gap-3">
                  <label class="flex items-center p-3 border border-gray-200 rounded-lg cursor-pointer hover:bg-gray-50">
                    <input
                      v-model="widgetConfig.buttonPosition"
                      type="radio"
                      value="above-cart"
                      class="text-blue-600 focus:ring-blue-500"
                    />
                    <span class="ml-2 text-sm">Au-dessus du panier</span>
                  </label>
                  <label class="flex items-center p-3 border border-gray-200 rounded-lg cursor-pointer hover:bg-gray-50">
                    <input
                      v-model="widgetConfig.buttonPosition"
                      type="radio"
                      value="below-cart"
                      class="text-blue-600 focus:ring-blue-500"
                    />
                    <span class="ml-2 text-sm">En-dessous du panier</span>
                  </label>
                </div>
              </div>

              <!-- Taille du bouton -->
              <div>
                <label class="block text-sm font-medium text-gray-700 mb-2">
                  Taille du bouton
                </label>
                <select
                  v-model="widgetConfig.buttonSize"
                  class="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-blue-500 focus:border-blue-500"
                >
                  <option value="small">Petit</option>
                  <option value="medium">Moyen</option>
                  <option value="large">Grand</option>
                </select>
              </div>
            </div>
          </div>

          <!-- Boutons d'action rapides -->
          <div class="bg-white rounded-lg border border-gray-200 p-6">
            <h3 class="text-lg font-semibold text-gray-900 mb-6">Boutons d'action rapides</h3>
            
            <div class="space-y-4">
              <div 
                v-for="(button, index) in widgetConfig.quickButtons" 
                :key="index"
                class="flex items-center space-x-3 p-3 border border-gray-200 rounded-lg"
              >
                <input
                  v-model="button.text"
                  type="text"
                  placeholder="Texte du bouton"
                  class="flex-1 px-3 py-2 border border-gray-300 rounded-md focus:ring-blue-500 focus:border-blue-500"
                />
                <button
                  @click="removeQuickButton(index)"
                  class="p-2 text-red-600 hover:text-red-700"
                >
                  <TrashIcon class="h-4 w-4" />
                </button>
              </div>
              
              <button
                @click="addQuickButton"
                class="w-full p-3 border-2 border-dashed border-gray-300 rounded-lg text-gray-500 hover:text-gray-700 hover:border-gray-400 transition-colors duration-200"
              >
                <PlusIcon class="h-4 w-4 mx-auto mb-1" />
                Ajouter un bouton
              </button>
            </div>
          </div>
        </div>

        <!-- Onglet Intégrations -->
        <div v-show="activeTab === 'integrations'" class="space-y-6">
          <!-- Plateforme e-commerce -->
          <div class="bg-white rounded-lg border border-gray-200 p-6">
            <h3 class="text-lg font-semibold text-gray-900 mb-6">Plateforme e-commerce</h3>
            
            <div class="grid grid-cols-1 md:grid-cols-3 gap-4">
              <label class="flex flex-col items-center p-4 border border-gray-200 rounded-lg cursor-pointer hover:border-blue-300 hover:bg-blue-50 transition-all duration-200">
                <input
                  v-model="integrationConfig.platform"
                  type="radio"
                  value="shopify"
                  class="text-blue-600 focus:ring-blue-500 mb-2"
                />
                <img src="/platforms/shopify.png" alt="Shopify" class="h-8 w-8 mb-2" />
                <span class="text-sm font-medium">Shopify</span>
              </label>
              
              <label class="flex flex-col items-center p-4 border border-gray-200 rounded-lg cursor-pointer hover:border-blue-300 hover:bg-blue-50 transition-all duration-200">
                <input
                  v-model="integrationConfig.platform"
                  type="radio"
                  value="woocommerce"
                  class="text-blue-600 focus:ring-blue-500 mb-2"
                />
                <img src="/platforms/woocommerce.png" alt="WooCommerce" class="h-8 w-8 mb-2" />
                <span class="text-sm font-medium">WooCommerce</span>
              </label>
              
              <label class="flex flex-col items-center p-4 border border-gray-200 rounded-lg cursor-pointer hover:border-blue-300 hover:bg-blue-50 transition-all duration-200">
                <input
                  v-model="integrationConfig.platform"
                  type="radio"
                  value="custom"
                  class="text-blue-600 focus:ring-blue-500 mb-2"
                />
                <CodeBracketIcon class="h-8 w-8 text-gray-400 mb-2" />
                <span class="text-sm font-medium">Site personnalisé</span>
              </label>
            </div>
          </div>

          <!-- Code d'intégration -->
          <div class="bg-white rounded-lg border border-gray-200 p-6">
            <h3 class="text-lg font-semibold text-gray-900 mb-6">Code d'intégration</h3>
            
            <div class="bg-gray-900 rounded-lg p-4 text-sm text-gray-100 font-mono overflow-x-auto">
              <pre><code>&lt;!-- ChatSeller Widget --&gt;
&lt;script src="https://widget.chatseller.app/widget.js" 
        data-shop-id="{{ userProfile?.id || 'YOUR_SHOP_ID' }}"
        data-button-text="{{ widgetConfig.buttonText }}"
        data-primary-color="{{ widgetConfig.primaryColor }}"
        data-position="{{ widgetConfig.buttonPosition }}"
        data-size="{{ widgetConfig.buttonSize }}"&gt;&lt;/script&gt;</code></pre>
            </div>
            
            <div class="mt-4 flex justify-end">
              <button
                @click="copyIntegrationCode"
                class="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md text-white bg-blue-600 hover:bg-blue-700"
              >
                <ClipboardIcon class="mr-2 h-4 w-4" />
                Copier le code
              </button>
            </div>
          </div>
        </div>

        <!-- Onglet Notifications -->
        <div v-show="activeTab === 'notifications'" class="space-y-6">
          <!-- Notifications email -->
          <div class="bg-white rounded-lg border border-gray-200 p-6">
            <h3 class="text-lg font-semibold text-gray-900 mb-6">Notifications email</h3>
            
            <div class="space-y-4">
              <div class="flex items-center justify-between">
                <div>
                  <label class="text-sm font-medium text-gray-700">Nouvelles conversations</label>
                  <p class="text-xs text-gray-500">Recevoir un email à chaque nouvelle conversation</p>
                </div>
                <ToggleSwitch v-model="notificationConfig.newConversations" />
              </div>

              <div class="flex items-center justify-between">
                <div>
                  <label class="text-sm font-medium text-gray-700">Nouvelles commandes</label>
                  <p class="text-xs text-gray-500">Recevoir un email à chaque nouvelle commande</p>
                </div>
                <ToggleSwitch v-model="notificationConfig.newOrders" />
              </div>

              <div class="flex items-center justify-between">
                <div>
                  <label class="text-sm font-medium text-gray-700">Rapport quotidien</label>
                  <p class="text-xs text-gray-500">Résumé quotidien des performances</p>
                </div>
                <ToggleSwitch v-model="notificationConfig.dailyReport" />
              </div>

              <div class="flex items-center justify-between">
                <div>
                  <label class="text-sm font-medium text-gray-700">Rapport hebdomadaire</label>
                  <p class="text-xs text-gray-500">Analyse hebdomadaire détaillée</p>
                </div>
                <ToggleSwitch v-model="notificationConfig.weeklyReport" />
              </div>
            </div>
          </div>
        </div>
      </div>

      <!-- Prévisualisation (1/3) -->
      <div class="lg:col-span-1">
        <div class="sticky top-6">
          <div class="bg-white rounded-lg border border-gray-200 p-6">
            <h3 class="text-lg font-semibold text-gray-900 mb-6">Aperçu en temps réel</h3>
            
            <!-- Prévisualisation du widget -->
            <div class="border border-gray-200 rounded-lg p-4 bg-gray-50">
              <div class="mb-4">
                <button
                  :style="{ 
                    backgroundColor: widgetConfig.primaryColor,
                    fontSize: widgetConfig.buttonSize === 'small' ? '14px' : widgetConfig.buttonSize === 'large' ? '18px' : '16px',
                    padding: widgetConfig.buttonSize === 'small' ? '8px 16px' : widgetConfig.buttonSize === 'large' ? '16px 32px' : '12px 24px'
                  }"
                  class="w-full text-white rounded-md font-medium hover:opacity-90 transition-opacity duration-200"
                >
                  {{ widgetConfig.buttonText }}
                </button>
              </div>
              
              <!-- Interface de chat simulée -->
              <div class="bg-white rounded-lg border border-gray-200 p-4 max-h-80 overflow-y-auto">
                <!-- Header du chat -->
                <div class="flex items-center mb-4 pb-2 border-b border-gray-200">
                  <img
                    :src="agentConfig.avatarUrl || '/default-agent.png'"
                    :alt="agentConfig.name"
                    class="h-8 w-8 rounded-full object-cover"
                  />
                  <div class="ml-3">
                    <p class="text-sm font-medium text-gray-900">{{ agentConfig.name }}</p>
                    <p class="text-xs text-green-600">En ligne</p>
                  </div>
                </div>
                
                <!-- Message de bienvenue -->
                <div class="mb-4">
                  <div class="bg-gray-100 rounded-lg p-3">
                    <p class="text-sm text-gray-800">{{ agentConfig.welcomeMessage }}</p>
                  </div>
                </div>
                
                <!-- Boutons rapides -->
                <div v-if="widgetConfig.quickButtons.length > 0" class="space-y-2">
                  <button
                    v-for="(button, index) in widgetConfig.quickButtons"
                    :key="index"
                    class="w-full p-2 text-sm border border-gray-300 rounded-md hover:bg-gray-50 text-left"
                  >
                    {{ button.text }}
                  </button>
                </div>
                
                <!-- Zone de saisie -->
                <div class="mt-4 pt-2 border-t border-gray-200">
                  <div class="flex items-center space-x-2">
                    <input
                      type="text"
                      placeholder="Tapez votre message..."
                      class="flex-1 px-3 py-2 border border-gray-300 rounded-md text-sm"
                      disabled
                    />
                    <button
                      :style="{ backgroundColor: widgetConfig.primaryColor }"
                      class="p-2 text-white rounded-md"
                      disabled
                    >
                      <PaperAirplaneIcon class="h-4 w-4" />
                    </button>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>

    <!-- Boutons d'action -->
    <div class="mt-8 flex justify-between">
      <button
        @click="resetToDefaults"
        class="inline-flex items-center px-4 py-2 border border-gray-300 rounded-md text-sm font-medium text-gray-700 bg-white hover:bg-gray-50"
      >
        Restaurer les valeurs par défaut
      </button>
      
      <div class="flex space-x-3">
        <button
          @click="saveConfig"
          :disabled="saving"
          class="inline-flex items-center px-6 py-2 border border-transparent text-sm font-medium rounded-md text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 disabled:opacity-50"
        >
          <span v-if="saving" class="mr-2">
            <div class="animate-spin h-4 w-4 border-2 border-white border-t-transparent rounded-full"></div>
          </span>
          {{ saving ? 'Sauvegarde...' : 'Sauvegarder' }}
        </button>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, reactive } from 'vue'
import {
  UserIcon,
  CogIcon,
  CodeBracketIcon,
  BellIcon,
  PhotoIcon,
  TrashIcon,
  PlusIcon,
  ClipboardIcon,
  PaperAirplaneIcon
} from '@heroicons/vue/24/outline'

// Authentification
const { userProfile } = useAuth()

// État local
const activeTab = ref('agent')
const saving = ref(false)

// Configuration des onglets
const tabs = [
  { id: 'agent', name: 'Agent IA', icon: UserIcon },
  { id: 'widget', name: 'Widget', icon: CogIcon },
  { id: 'integrations', name: 'Intégrations', icon: CodeBracketIcon },
  { id: 'notifications', name: 'Notifications', icon: BellIcon }
]

// Configuration de l'agent
const agentConfig = reactive({
  name: 'Sophie',
  avatarUrl: '',
  welcomeMessage: 'Bonjour ! Je suis Sophie, votre assistante virtuelle. Comment puis-je vous aider à trouver le produit parfait ?',
  language: 'fr',
  responseStyle: 'friendly',
  responseLength: 'medium',
  proactiveMode: true,
  upsellEnabled: true,
  emailCollection: true
})

// Configuration du widget
const widgetConfig = reactive({
  buttonText: 'Parler à la vendeuse',
  primaryColor: '#ec4899',
  buttonPosition: 'above-cart',
  buttonSize: 'medium',
  quickButtons: [
    { text: 'Je veux l\'acheter maintenant' },
    { text: 'J\'ai des questions à poser' },
    { text: 'Je veux en savoir plus' }
  ]
})

// Configuration des intégrations
const integrationConfig = reactive({
  platform: 'custom'
})

// Configuration des notifications
const notificationConfig = reactive({
  newConversations: true,
  newOrders: true,
  dailyReport: false,
  weeklyReport: true
})

// Actions
const uploadAvatar = () => {
  // Simuler l'upload d'avatar
  console.log('Upload d\'avatar')
}

const addQuickButton = () => {
  widgetConfig.quickButtons.push({ text: '' })
}

const removeQuickButton = (index: number) => {
  widgetConfig.quickButtons.splice(index, 1)
}

const copyIntegrationCode = async () => {
  const userId = userProfile.value?.id || 'YOUR_SHOP_ID'
  const code = `<!-- ChatSeller Widget -->
<script src="https://widget.chatseller.app/widget.js" 
        data-shop-id="${userId}"
        data-button-text="${widgetConfig.buttonText}"
        data-primary-color="${widgetConfig.primaryColor}"
        data-position="${widgetConfig.buttonPosition}"
        data-size="${widgetConfig.buttonSize}"><\/script>`

  try {
    await navigator.clipboard.writeText(code)
    // Ici ajouter une notification de succès
    console.log('Code copié avec succès !')
  } catch (error) {
    console.error('Erreur lors de la copie:', error)
  }
}

const saveConfig = async () => {
  saving.value = true
  try {
    // Simuler la sauvegarde
    await new Promise(resolve => setTimeout(resolve, 1000))
    
    // Ici faire l'appel API pour sauvegarder la configuration
    console.log('Configuration sauvegardée')
  } catch (error) {
    console.error('Erreur lors de la sauvegarde:', error)
  } finally {
    saving.value = false
  }
}

const resetToDefaults = () => {
  // Restaurer les valeurs par défaut
  console.log('Restauration des valeurs par défaut')
}

// Métadonnées de la page
definePageMeta({
  layout: 'default'
})

useSeoMeta({
  title: 'Configuration - ChatSeller',
  description: 'Configurez votre Agent IA Commercial et personnalisez le widget'
})
</script>

<style scoped>
.animate-spin {
  animation: spin 1s linear infinite;
}

@keyframes spin {
  from {
    transform: rotate(0deg);
  }
  to {
    transform: rotate(360deg);
  }
}
</style>