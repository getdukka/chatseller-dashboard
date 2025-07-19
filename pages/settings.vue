<!-- pages/settings.vue -->
<template>
  <div class="space-y-6">
    <!-- Header -->
    <div class="flex justify-between items-start">
      <div>
        <h1 class="text-2xl font-bold text-gray-900">
          Paramètres
        </h1>
        <p class="text-gray-600 mt-1">
          Configurez votre agent IA commercial
        </p>
      </div>
      
      <!-- Actions -->
      <div class="flex items-center space-x-3">
        <div v-if="hasUnsavedChanges" class="flex items-center text-orange-600">
          <svg class="w-4 h-4 mr-1" fill="currentColor" viewBox="0 0 20 20">
            <path fill-rule="evenodd" d="M8.257 3.099c.765-1.36 2.722-1.36 3.486 0l5.58 9.92c.75 1.334-.213 2.98-1.742 2.98H4.42c-1.53 0-2.493-1.646-1.743-2.98l5.58-9.92zM11 13a1 1 0 11-2 0 1 1 0 012 0zm-1-8a1 1 0 00-1 1v3a1 1 0 002 0V6a1 1 0 00-1-1z" clip-rule="evenodd" />
          </svg>
          <span class="text-sm">Modifications non sauvegardées</span>
        </div>
        
        <button
          v-if="hasUnsavedChanges"
          @click="discardChanges"
          class="px-4 py-2 bg-gray-600 text-white rounded-md shadow-sm text-sm font-medium hover:bg-gray-700"
        >
          Annuler
        </button>
        
        <button
          @click="saveAllSettings"
          :disabled="isSaving || !hasUnsavedChanges"
          class="px-4 py-2 bg-blue-600 text-white rounded-md shadow-sm text-sm font-medium hover:bg-blue-700 disabled:opacity-50"
        >
          <svg v-if="isSaving" class="w-4 h-4 mr-2 inline animate-spin" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" />
          </svg>
          {{ isSaving ? 'Sauvegarde...' : 'Sauvegarder' }}
        </button>
      </div>
    </div>

    <!-- Configuration Score -->
    <div class="bg-white p-6 rounded-lg shadow">
      <div class="flex items-center justify-between mb-4">
        <h3 class="text-lg font-semibold text-gray-900">
          Niveau de configuration
        </h3>
        <span class="text-2xl font-bold text-blue-600">{{ configurationScore }}%</span>
      </div>
      
      <div class="w-full bg-gray-200 rounded-full h-3 mb-4">
        <div 
          class="bg-blue-600 h-3 rounded-full transition-all duration-300"
          :style="{ width: `${configurationScore}%` }"
        ></div>
      </div>
      
      <p class="text-sm text-gray-600">
        <span v-if="configurationScore < 50" class="text-red-600">Configuration minimale requise.</span>
        <span v-else-if="configurationScore < 80" class="text-yellow-600">Bonne configuration, quelques améliorations possibles.</span>
        <span v-else class="text-green-600">Excellente configuration ! Votre agent est prêt.</span>
      </p>
    </div>

    <!-- Loading State -->
    <div v-if="isLoading && !settings" class="space-y-6">
      <div v-for="i in 3" :key="i" class="bg-white p-6 rounded-lg shadow animate-pulse">
        <div class="h-6 bg-gray-200 rounded w-1/4 mb-4"></div>
        <div class="space-y-3">
          <div class="h-4 bg-gray-200 rounded"></div>
          <div class="h-4 bg-gray-200 rounded w-3/4"></div>
        </div>
      </div>
    </div>

    <!-- Error State -->
    <div v-else-if="error" class="bg-red-50 border border-red-200 rounded-lg p-6">
      <div class="flex items-center">
        <svg class="w-5 h-5 text-red-400 mr-3" fill="currentColor" viewBox="0 0 20 20">
          <path fill-rule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z" clip-rule="evenodd" />
        </svg>
        <div>
          <h3 class="text-red-800 font-medium">Erreur de chargement</h3>
          <p class="text-red-700 text-sm mt-1">{{ error }}</p>
        </div>
      </div>
      <button 
        @click="refreshSettings" 
        class="mt-4 px-4 py-2 bg-red-600 text-white rounded-md hover:bg-red-700 text-sm"
      >
        Réessayer
      </button>
    </div>

    <!-- Settings Content -->
    <div v-else-if="settings" class="space-y-6">
      <!-- Basic Agent Settings -->
      <div class="bg-white p-6 rounded-lg shadow">
        <h3 class="text-lg font-semibold text-gray-900 mb-6">Configuration de base</h3>
        
        <div class="grid grid-cols-1 md:grid-cols-2 gap-6">
          <!-- Agent Name -->
          <div>
            <label class="block text-sm font-medium text-gray-700 mb-2">
              Nom de l'agent
            </label>
            <input
              v-model="localSettings.agentName"
              type="text"
              placeholder="Ex: Assistant ChatSeller"
              class="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
          </div>

          <!-- Primary Color -->
          <div>
            <label class="block text-sm font-medium text-gray-700 mb-2">
              Couleur principale
            </label>
            <div class="flex items-center space-x-3">
              <input
                v-model="localSettings.primaryColor"
                type="color"
                class="w-12 h-10 border border-gray-300 rounded-md"
              />
              <input
                v-model="localSettings.primaryColor"
                type="text"
                placeholder="#3B82F6"
                class="flex-1 px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
            </div>
          </div>
        </div>

        <!-- Welcome Message -->
        <div class="mt-6">
          <label class="block text-sm font-medium text-gray-700 mb-2">
            Message de bienvenue
          </label>
          <textarea
            v-model="localSettings.welcomeMessage"
            rows="3"
            placeholder="Bonjour ! Comment puis-je vous aider ?"
            class="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
          ></textarea>
        </div>

        <!-- Fallback Message -->
        <div class="mt-6">
          <label class="block text-sm font-medium text-gray-700 mb-2">
            Message de fallback
          </label>
          <textarea
            v-model="localSettings.fallbackMessage"
            rows="2"
            placeholder="Je transmets votre question à notre équipe..."
            class="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
          ></textarea>
          <p class="text-xs text-gray-500 mt-1">
            Message affiché quand l'IA ne peut pas répondre
          </p>
        </div>
      </div>

      <!-- Auto Responses -->
      <div class="bg-white p-6 rounded-lg shadow">
        <h3 class="text-lg font-semibold text-gray-900 mb-6">Réponses automatiques</h3>
        
        <div class="space-y-6">
          <!-- Greeting -->
          <div>
            <label class="block text-sm font-medium text-gray-700 mb-2">
              Message d'accueil
            </label>
            <textarea
              v-model="localSettings.autoResponses.greeting"
              rows="2"
              placeholder="Bonjour ! Comment puis-je vous aider aujourd'hui ?"
              class="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
            ></textarea>
          </div>

          <!-- Closing -->
          <div>
            <label class="block text-sm font-medium text-gray-700 mb-2">
              Message de fermeture
            </label>
            <textarea
              v-model="localSettings.autoResponses.closing"
              rows="2"
              placeholder="Merci pour votre visite ! N'hésitez pas à revenir."
              class="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
            ></textarea>
          </div>

          <!-- Offline -->
          <div>
            <label class="block text-sm font-medium text-gray-700 mb-2">
              Message hors ligne
            </label>
            <textarea
              v-model="localSettings.autoResponses.offline"
              rows="2"
              placeholder="Nous sommes fermés. Laissez un message."
              class="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
            ></textarea>
          </div>
        </div>
      </div>

      <!-- Business Hours -->
      <div class="bg-white p-6 rounded-lg shadow">
        <div class="flex items-center justify-between mb-6">
          <h3 class="text-lg font-semibold text-gray-900">Horaires d'ouverture</h3>
          <label class="flex items-center">
            <input
              v-model="localSettings.businessHours.enabled"
              type="checkbox"
              class="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 rounded"
            />
            <span class="ml-2 text-sm text-gray-700">Activer les horaires</span>
          </label>
        </div>

        <div v-if="localSettings.businessHours.enabled" class="space-y-4">
          <!-- Timezone -->
          <div>
            <label class="block text-sm font-medium text-gray-700 mb-2">
              Fuseau horaire
            </label>
            <select
              v-model="localSettings.businessHours.timezone"
              class="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
            >
              <option value="Europe/Paris">Europe/Paris (UTC+1)</option>
              <option value="Europe/London">Europe/London (UTC+0)</option>
              <option value="America/New_York">America/New_York (UTC-5)</option>
              <option value="America/Los_Angeles">America/Los_Angeles (UTC-8)</option>
            </select>
          </div>

          <!-- Weekly Schedule -->
          <div class="grid grid-cols-1 gap-4">
            <div
              v-for="(day, dayKey) in localSettings.businessHours.schedule"
              :key="dayKey"
              class="flex items-center justify-between p-4 bg-gray-50 rounded-lg"
            >
              <div class="flex items-center space-x-4">
                <label class="flex items-center">
                  <input
                    v-model="day.enabled"
                    type="checkbox"
                    class="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 rounded"
                  />
                  <span class="ml-2 text-sm font-medium text-gray-700 w-16">
                    {{ getDayLabel(dayKey) }}
                  </span>
                </label>
              </div>
              
              <div v-if="day.enabled" class="flex items-center space-x-2">
                <input
                  v-model="day.openTime"
                  type="time"
                  class="px-2 py-1 border border-gray-300 rounded text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
                <span class="text-gray-500">à</span>
                <input
                  v-model="day.closeTime"
                  type="time"
                  class="px-2 py-1 border border-gray-300 rounded text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
              </div>
              
              <div v-else class="text-sm text-gray-500">Fermé</div>
            </div>
          </div>
        </div>
      </div>

      <!-- Upselling -->
      <div class="bg-white p-6 rounded-lg shadow">
        <div class="flex items-center justify-between mb-6">
          <div>
            <h3 class="text-lg font-semibold text-gray-900">Vente additionnelle (Upsell)</h3>
            <p class="text-sm text-gray-600 mt-1">Configurez des règles pour proposer des produits complémentaires</p>
          </div>
          <label class="flex items-center">
            <input
              v-model="localSettings.enableUpsell"
              type="checkbox"
              class="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 rounded"
            />
            <span class="ml-2 text-sm text-gray-700">Activer l'upsell</span>
          </label>
        </div>

        <div v-if="localSettings.enableUpsell" class="space-y-6">
          <!-- Upsell Rules -->
          <div v-if="localSettings.upsellRules.length > 0" class="space-y-4">
            <h4 class="text-sm font-medium text-gray-700">Règles configurées</h4>
            <div
              v-for="(rule, index) in localSettings.upsellRules"
              :key="rule.id"
              class="p-4 border border-gray-200 rounded-lg"
            >
              <div class="flex items-start justify-between">
                <div class="flex-1">
                  <div class="flex items-center space-x-3 mb-2">
                    <h5 class="font-medium text-gray-900">{{ rule.name }}</h5>
                    <label class="flex items-center">
                      <input
                        v-model="rule.enabled"
                        type="checkbox"
                        class="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 rounded"
                      />
                      <span class="ml-1 text-xs text-gray-600">Active</span>
                    </label>
                  </div>
                  
                  <p class="text-sm text-gray-600 mb-2">
                    <strong>Si:</strong> {{ rule.condition.productNames.join(', ') }}
                    <span v-if="rule.condition.minQuantity"> (min. {{ rule.condition.minQuantity }})</span>
                  </p>
                  
                  <p class="text-sm text-gray-600">
                    <strong>Proposer:</strong> {{ rule.offer.productName }}
                    <span v-if="rule.offer.discount"> (-{{ rule.offer.discount }}%)</span>
                  </p>
                </div>
                
                <div class="flex items-center space-x-2">
                  <button
                    @click="editUpsellRule(index)"
                    class="text-blue-600 hover:text-blue-800 text-sm"
                  >
                    Modifier
                  </button>
                  <button
                    @click="removeUpsellRule(index)"
                    class="text-red-600 hover:text-red-800 text-sm"
                  >
                    Supprimer
                  </button>
                </div>
              </div>
            </div>
          </div>

          <!-- Add Upsell Rule -->
          <div>
            <button
              @click="showUpsellModal = true"
              class="w-full p-4 border-2 border-dashed border-gray-300 rounded-lg text-center hover:border-blue-400 transition-colors"
            >
              <svg class="w-8 h-8 mx-auto text-gray-400 mb-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 6v6m0 0v6m0-6h6m-6 0H6" />
              </svg>
              <p class="text-sm text-gray-600">Ajouter une règle d'upsell</p>
            </button>
          </div>
        </div>
      </div>

      <!-- Preview -->
      <div class="bg-white p-6 rounded-lg shadow">
        <h3 class="text-lg font-semibold text-gray-900 mb-6">Aperçu du widget</h3>
        
        <div class="max-w-sm mx-auto">
          <!-- Widget Preview -->
          <div 
            class="border-2 border-gray-200 rounded-lg p-4"
            :style="{ borderColor: localSettings.primaryColor }"
          >
            <div class="flex items-center space-x-3 mb-3">
              <div 
                class="w-8 h-8 rounded-full flex items-center justify-center text-white text-sm font-medium"
                :style="{ backgroundColor: localSettings.primaryColor }"
              >
                {{ localSettings.agentName.charAt(0) }}
              </div>
              <div>
                <p class="font-medium text-gray-900 text-sm">{{ localSettings.agentName }}</p>
                <p class="text-xs text-gray-500">
                  <span class="w-2 h-2 bg-green-400 rounded-full inline-block mr-1"></span>
                  En ligne
                </p>
              </div>
            </div>
            
            <div class="bg-gray-100 p-3 rounded-lg mb-3">
              <p class="text-sm text-gray-900">{{ localSettings.welcomeMessage }}</p>
            </div>
            
            <div class="grid grid-cols-2 gap-2">
              <button 
                class="px-3 py-2 text-xs rounded-md text-white font-medium"
                :style="{ backgroundColor: localSettings.primaryColor }"
              >
                Je veux l'acheter
              </button>
              <button class="px-3 py-2 text-xs bg-gray-200 text-gray-700 rounded-md">
                J'ai des questions
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>

    <!-- Upsell Rule Modal -->
    <div v-if="showUpsellModal" class="fixed inset-0 bg-gray-600 bg-opacity-50 overflow-y-auto h-full w-full z-50">
      <div class="relative top-20 mx-auto p-5 border w-11/12 md:w-2/3 lg:w-1/2 shadow-lg rounded-md bg-white">
        <div class="space-y-6">
          <!-- Header -->
          <div class="flex justify-between items-center">
            <h3 class="text-lg font-medium text-gray-900">
              {{ editingUpsellIndex !== null ? 'Modifier' : 'Ajouter' }} une règle d'upsell
            </h3>
            <button
              @click="closeUpsellModal"
              class="text-gray-400 hover:text-gray-600"
            >
              <svg class="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12" />
              </svg>
            </button>
          </div>

          <!-- Form -->
          <div class="space-y-4">
            <!-- Rule Name -->
            <div>
              <label class="block text-sm font-medium text-gray-700 mb-2">
                Nom de la règle
              </label>
              <input
                v-model="upsellRule.name"
                type="text"
                placeholder="Ex: Accessoires pour iPhone"
                class="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
            </div>

            <!-- Trigger Products -->
            <div>
              <label class="block text-sm font-medium text-gray-700 mb-2">
                Produits déclencheurs (séparés par des virgules)
              </label>
              <input
                v-model="upsellRule.triggerProducts"
                type="text"
                placeholder="iPhone 15, iPhone 15 Pro"
                class="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
            </div>

            <!-- Min Quantity -->
            <div>
              <label class="block text-sm font-medium text-gray-700 mb-2">
                Quantité minimum (optionnel)
              </label>
              <input
                v-model.number="upsellRule.minQuantity"
                type="number"
                min="1"
                placeholder="1"
                class="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
            </div>

            <!-- Offer Product -->
            <div>
              <label class="block text-sm font-medium text-gray-700 mb-2">
                Produit à proposer
              </label>
              <input
                v-model="upsellRule.offerProduct"
                type="text"
                placeholder="Coque iPhone 15"
                class="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
            </div>

            <!-- Discount -->
            <div>
              <label class="block text-sm font-medium text-gray-700 mb-2">
                Réduction (%, optionnel)
              </label>
              <input
                v-model.number="upsellRule.discount"
                type="number"
                min="0"
                max="100"
                placeholder="10"
                class="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
            </div>

            <!-- Message -->
            <div>
              <label class="block text-sm font-medium text-gray-700 mb-2">
                Message de proposition
              </label>
              <textarea
                v-model="upsellRule.message"
                rows="3"
                placeholder="Je vous recommande aussi notre coque iPhone 15, parfaite pour protéger votre appareil !"
                class="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
              ></textarea>
            </div>
          </div>

          <!-- Actions -->
          <div class="flex justify-end space-x-3">
            <button
              @click="closeUpsellModal"
              class="px-4 py-2 bg-gray-600 text-white rounded-md hover:bg-gray-700"
            >
              Annuler
            </button>
            <button
              @click="saveUpsellRule"
              :disabled="!upsellRule.name.trim() || !upsellRule.triggerProducts.trim() || !upsellRule.offerProduct.trim()"
              class="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 disabled:opacity-50"
            >
              {{ editingUpsellIndex !== null ? 'Modifier' : 'Ajouter' }}
            </button>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
definePageMeta({
  middleware: 'auth'
})

// =====================================
// COMPOSABLES AND STORES
// =====================================

const {
  fetchSettings,
  saveSettings,
  isLoading,
  isSaving,
  error,
  settings,
  hasUnsavedChanges,
  configurationScore,
  discardChanges,
  clearError
} = useSettings()

const { success, handleApiError, confirm } = useNotifications()

// =====================================
// REACTIVE STATE
// =====================================

const localSettings = ref<any>({})
const showUpsellModal = ref(false)
const editingUpsellIndex = ref<number | null>(null)

const upsellRule = reactive({
  name: '',
  triggerProducts: '',
  minQuantity: null as number | null,
  offerProduct: '',
  discount: null as number | null,
  message: ''
})

// =====================================
// WATCHERS
// =====================================

// Watch for settings changes to update local copy
watch(settings, (newSettings) => {
  if (newSettings) {
    localSettings.value = JSON.parse(JSON.stringify(newSettings))
  }
}, { immediate: true, deep: true })

// Watch for local changes to trigger unsaved changes state
watch(localSettings, () => {
  // This will be handled by the store
}, { deep: true })

// =====================================
// METHODS
// =====================================

/**
 * Refresh settings
 */
const refreshSettings = async (): Promise<void> => {
  try {
    await fetchSettings(true)
    success('Paramètres actualisés', 'La configuration a été mise à jour')
  } catch (error: any) {
    handleApiError(error, 'Actualisation des paramètres')
  }
}

/**
 * Save all settings
 */
const saveAllSettings = async (): Promise<void> => {
  try {
    // Update the store with local changes
    if (settings.value) {
      Object.assign(settings.value, localSettings.value)
    }
    
    const success_save = await saveSettings()
    if (success_save) {
      success('Paramètres sauvegardés', 'Votre configuration a été mise à jour')
    }
  } catch (error: any) {
    handleApiError(error, 'Sauvegarde des paramètres')
  }
}

/**
 * Get day label
 */
const getDayLabel = (dayKey: string): string => {
  const labels: Record<string, string> = {
    monday: 'Lundi',
    tuesday: 'Mardi',
    wednesday: 'Mercredi',
    thursday: 'Jeudi',
    friday: 'Vendredi',
    saturday: 'Samedi',
    sunday: 'Dimanche'
  }
  return labels[dayKey] || dayKey
}

// =====================================
// UPSELL METHODS
// =====================================

/**
 * Edit upsell rule
 */
const editUpsellRule = (index: number): void => {
  const rule = localSettings.value.upsellRules[index]
  editingUpsellIndex.value = index
  
  upsellRule.name = rule.name
  upsellRule.triggerProducts = rule.condition.productNames.join(', ')
  upsellRule.minQuantity = rule.condition.minQuantity || null
  upsellRule.offerProduct = rule.offer.productName
  upsellRule.discount = rule.offer.discount || null
  upsellRule.message = rule.offer.message
  
  showUpsellModal.value = true
}

/**
 * Remove upsell rule
 */
const removeUpsellRule = (index: number): void => {
  const rule = localSettings.value.upsellRules[index]
  
  confirm(
    'Supprimer la règle',
    `Êtes-vous sûr de vouloir supprimer la règle "${rule.name}" ?`,
    () => {
      localSettings.value.upsellRules.splice(index, 1)
    },
    undefined,
    {
      confirmLabel: 'Supprimer',
      cancelLabel: 'Annuler',
      type: 'warning'
    }
  )
}

/**
 * Save upsell rule
 */
const saveUpsellRule = (): void => {
  const newRule = {
    id: editingUpsellIndex.value !== null 
      ? localSettings.value.upsellRules[editingUpsellIndex.value].id
      : `upsell_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`,
    name: upsellRule.name.trim(),
    condition: {
      productNames: upsellRule.triggerProducts.split(',').map(p => p.trim()).filter(p => p),
      minQuantity: upsellRule.minQuantity || undefined
    },
    offer: {
      productName: upsellRule.offerProduct.trim(),
      discount: upsellRule.discount || undefined,
      message: upsellRule.message.trim()
    },
    enabled: true
  }

  if (editingUpsellIndex.value !== null) {
    // Edit existing rule
    localSettings.value.upsellRules[editingUpsellIndex.value] = newRule
  } else {
    // Add new rule
    if (!localSettings.value.upsellRules) {
      localSettings.value.upsellRules = []
    }
    localSettings.value.upsellRules.push(newRule)
  }

  closeUpsellModal()
}

/**
 * Close upsell modal
 */
const closeUpsellModal = (): void => {
  showUpsellModal.value = false
  editingUpsellIndex.value = null
  
  // Reset form
  Object.assign(upsellRule, {
    name: '',
    triggerProducts: '',
    minQuantity: null,
    offerProduct: '',
    discount: null,
    message: ''
  })
}

// =====================================
// LIFECYCLE
// =====================================

onMounted(async () => {
  await fetchSettings()
})

// =====================================
// SEO
// =====================================

useHead({
  title: 'Paramètres - ChatSeller',
  meta: [
    {
      name: 'description',
      content: 'Configurez votre agent IA commercial ChatSeller.'
    }
  ]
})
</script>