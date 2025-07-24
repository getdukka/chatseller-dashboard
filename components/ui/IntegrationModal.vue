<!-- components/ui/IntegrationModal.vue - VERSION FINALE SANS GÉNÉRIQUES -->
<template>
  <Modal
    :show="true"
    title="Intégration du widget"
    size="xl"
    @close="$emit('close')"
  >
    <div class="space-y-6">
      <!-- Platform Selection -->
      <div>
        <h3 class="text-lg font-medium text-gray-900 mb-4">
          Choisissez votre plateforme
        </h3>
        
        <div class="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
          <button
            v-for="platform in platforms"
            :key="platform.id"
            @click="selectedPlatform = platform.id"
            :class="[
              'relative rounded-lg border p-4 flex flex-col items-center space-y-2 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500',
              selectedPlatform === platform.id
                ? 'border-blue-500 ring-2 ring-blue-500'
                : 'border-gray-300 hover:border-gray-400'
            ]"
          >
            <div class="w-12 h-12 bg-gray-100 rounded-lg flex items-center justify-center">
              <span class="text-xl">{{ platform.icon }}</span>
            </div>
            <span class="text-sm font-medium text-gray-900">{{ platform.name }}</span>
            <span v-if="selectedPlatform === platform.id" class="absolute top-2 right-2">
              <svg class="w-5 h-5 text-blue-500" fill="currentColor" viewBox="0 0 20 20">
                <path fill-rule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clip-rule="evenodd"/>
              </svg>
            </span>
          </button>
        </div>
      </div>

      <!-- Integration Code -->
      <div v-if="selectedPlatform">
        <h3 class="text-lg font-medium text-gray-900 mb-4">
          Code d'intégration pour {{ getPlatformName(selectedPlatform) }}
        </h3>
        
        <div class="relative">
          <pre class="bg-gray-50 border border-gray-200 rounded-md p-4 text-sm overflow-x-auto max-h-64"><code>{{ integrationCode }}</code></pre>
          
          <button
            @click="copyCode"
            class="absolute top-2 right-2 inline-flex items-center px-2 py-1 border border-transparent text-xs font-medium rounded text-gray-700 bg-white hover:bg-gray-50 shadow-sm"
          >
            <svg class="w-4 h-4 mr-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M8 16H6a2 2 0 01-2-2V6a2 2 0 012-2h8a2 2 0 012 2v2m-6 12h8a2 2 0 002-2v-8a2 2 0 00-2-2h-8a2 2 0 00-2 2v8a2 2 0 002 2z"/>
            </svg>
            Copier
          </button>
        </div>

        <!-- Instructions spécifiques -->
        <div class="mt-4 p-4 bg-blue-50 rounded-md">
          <div class="flex">
            <div class="flex-shrink-0">
              <svg class="h-5 w-5 text-blue-400" fill="currentColor" viewBox="0 0 20 20">
                <path fill-rule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7-4a1 1 0 11-2 0 1 1 0 012 0zM9 9a1 1 0 000 2v3a1 1 0 001 1h1a1 1 0 100-2v-3a1 1 0 00-1-1H9z" clip-rule="evenodd"/>
              </svg>
            </div>
            <div class="ml-3">
              <h3 class="text-sm font-medium text-blue-800">
                Instructions pour {{ getPlatformName(selectedPlatform) }}
              </h3>
              <div class="mt-2 text-sm text-blue-700">
                <div v-html="getInstructions(selectedPlatform)"></div>
              </div>
            </div>
          </div>
        </div>
      </div>

      <!-- Success Message -->
      <div v-if="copied" class="bg-green-50 border border-green-200 rounded-md p-4">
        <div class="flex">
          <div class="flex-shrink-0">
            <svg class="h-5 w-5 text-green-400" fill="currentColor" viewBox="0 0 20 20">
              <path fill-rule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clip-rule="evenodd"/>
            </svg>
          </div>
          <div class="ml-3">
            <p class="text-sm text-green-800">
              Code copié dans le presse-papier !
            </p>
          </div>
        </div>
      </div>

      <!-- Actions -->
      <div class="flex justify-end space-x-3 pt-4 border-t border-gray-200">
        <button
          @click="$emit('close')"
          class="px-4 py-2 border border-gray-300 rounded-md shadow-sm text-sm font-medium text-gray-700 bg-white hover:bg-gray-50"
        >
          Fermer
        </button>
        <button
          v-if="selectedPlatform"
          @click="openDocumentation"
          class="px-4 py-2 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-blue-600 hover:bg-blue-700"
        >
          Voir la documentation
        </button>
      </div>
    </div>
  </Modal>
</template>

<script setup lang="ts">
import { ref, computed } from 'vue'

// ✅ INTERFACES SIMPLES SANS GÉNÉRIQUES
interface Platform {
  id: string
  name: string
  icon: string
}

interface Emits {
  (e: 'close'): void
}

const emit = defineEmits<Emits>()

// ✅ COMPOSABLES
const auth = useAuth()

// ✅ REACTIVE DATA
const selectedPlatform = ref('')
const copied = ref(false)

const platforms: Platform[] = [
  { id: 'html', name: 'Site Web HTML', icon: '🌐' },
  { id: 'wordpress', name: 'WordPress', icon: '📝' },
  { id: 'shopify', name: 'Shopify', icon: '🛍️' },
  { id: 'woocommerce', name: 'WooCommerce', icon: '🛒' },
  { id: 'squarespace', name: 'Squarespace', icon: '⬜' },
  { id: 'wix', name: 'Wix', icon: '🎨' }
]

// ✅ CONSTANTES SÉCURISÉES
const WIDGET_URL = 'https://widget.chatseller.app/widget.js'
const SCRIPT_OPEN = '<script'
const SCRIPT_CLOSE = '</script>'

// ✅ HELPER FUNCTIONS - SANS TYPES GÉNÉRIQUES
const generateScriptTag = (shopId: string, attributes: any = {}) => {
  const defaultAttrs = {
    'data-shop-id': shopId,
    'data-button-text': 'Parler à la vendeuse',
    'data-primary-color': '#ec4899'
  }
  
  const allAttrs = { ...defaultAttrs, ...attributes }
  
  const attrString = Object.entries(allAttrs)
    .map(([key, value]) => '  ' + key + '="' + value + '"')
    .join('\n')
  
  return SCRIPT_OPEN + ' src="' + WIDGET_URL + '"\n' + attrString + '>' + SCRIPT_CLOSE
}

const generateDynamicScript = (shopId: string) => {
  const lines = [
    SCRIPT_OPEN + '>',
    '(function() {',
    '  var script = document.createElement(\'script\');',
    '  script.src = \'' + WIDGET_URL + '\';',
    '  script.setAttribute(\'data-shop-id\', \'' + shopId + '\');',
    '  script.setAttribute(\'data-button-text\', \'Parler à la vendeuse\');',
    '  script.setAttribute(\'data-primary-color\', \'#ec4899\');',
    '  script.setAttribute(\'data-position\', \'above-cart\');',
    '  document.head.appendChild(script);',
    '})();',
    SCRIPT_CLOSE
  ]
  
  return lines.join('\n')
}

// ✅ CODE GENERATORS OBJECT
const codeGenerators = {
  html: (shopId: string) => {
    return '<!-- ChatSeller Widget -->\n' + generateDynamicScript(shopId)
  },
  
  wordpress: (shopId: string) => {
    const phpCode = [
      '// Ajouter dans functions.php',
      'add_action(\'wp_footer\', \'add_chatseller_widget\', 25);',
      'function add_chatseller_widget() {',
      '  echo \'' + generateScriptTag(shopId) + '\';',
      '}'
    ]
    return phpCode.join('\n')
  },
  
  shopify: (shopId: string) => {
    return '<!-- ChatSeller Widget -->\n' + generateScriptTag(shopId)
  },
  
  woocommerce: (shopId: string) => {
    const phpCode = [
      '// Ajouter dans functions.php',
      'add_action(\'woocommerce_single_product_summary\', \'add_chatseller_widget\', 25);',
      'function add_chatseller_widget() {',
      '  echo \'' + generateScriptTag(shopId) + '\';',
      '}'
    ]
    return phpCode.join('\n')
  },
  
  squarespace: (shopId: string) => {
    return '<!-- Ajouter dans Settings > Advanced > Code Injection > Footer -->\n' + generateDynamicScript(shopId)
  },
  
  wix: (shopId: string) => {
    return '<!-- Ajouter via Wix Editor > Settings > Custom Code > Add Code to Head -->\n' + generateDynamicScript(shopId)
  }
}

// ✅ COMPUTED PROPERTIES
const integrationCode = computed(() => {
  if (!selectedPlatform.value) return ''
  
  const shopId = auth?.userShopId?.value || 'YOUR_SHOP_ID'
  const generator = codeGenerators[selectedPlatform.value as keyof typeof codeGenerators]
  
  return generator ? generator(shopId) : codeGenerators.html(shopId)
})

// ✅ UTILITY METHODS
const getPlatformName = (platformId: string) => {
  const platform = platforms.find(p => p.id === platformId)
  return platform?.name || ''
}

// ✅ INSTRUCTIONS - APPROCHE OBJET SIMPLE
const getInstructions = (platformId: string) => {
  const createList = (items: string[]) => {
    const listItems = items.map(item => '<li>' + item + '</li>').join('')
    return '<ol class="list-decimal list-inside space-y-1">' + listItems + '</ol>'
  }

  // ✅ OBJET SIMPLE SANS GÉNÉRIQUES TYPESCRIPT
  const instructionsData = {
    html: [
      'Copiez le code ci-dessus',
      'Ouvrez votre fichier HTML',
      'Collez le code juste avant la balise &lt;/body&gt;',
      'Sauvegardez le fichier'
    ],
    wordpress: [
      'Accédez à Apparence → Éditeur de thème',
      'Ouvrez le fichier functions.php',
      'Ajoutez le code à la fin du fichier',
      'Sauvegardez les modifications'
    ],
    shopify: [
      'Accédez à Boutique en ligne → Thèmes',
      'Cliquez sur Actions → Modifier le code',
      'Ouvrez le fichier theme.liquid',
      'Collez le code avant &lt;/body&gt;',
      'Sauvegardez les modifications'
    ],
    woocommerce: [
      'Accédez à Apparence → Éditeur de thème',
      'Ouvrez le fichier functions.php',
      'Ajoutez le code à la fin du fichier',
      'Sauvegardez les modifications'
    ],
    squarespace: [
      'Accédez à Settings → Advanced → Code Injection',
      'Collez le code dans la section Footer',
      'Cliquez sur Save'
    ],
    wix: [
      'Ouvrez l\'éditeur Wix',
      'Accédez à Settings → Custom Code',
      'Cliquez sur Add Code to Head',
      'Collez le code et sauvegardez'
    ]
  }
  
  const items = instructionsData[platformId as keyof typeof instructionsData] || instructionsData.html
  return createList(items)
}

// ✅ ACTION METHODS
const copyCode = async () => {
  try {
    await navigator.clipboard.writeText(integrationCode.value)
    copied.value = true
    setTimeout(() => {
      copied.value = false
    }, 3000)
  } catch (error) {
    console.error('Erreur lors de la copie:', error)
    fallbackCopyToClipboard(integrationCode.value)
  }
}

const fallbackCopyToClipboard = (text: string) => {
  const textArea = document.createElement('textarea')
  textArea.value = text
  textArea.style.position = 'fixed'
  textArea.style.left = '-999999px'
  textArea.style.top = '-999999px'
  document.body.appendChild(textArea)
  textArea.focus()
  textArea.select()
  
  try {
    document.execCommand('copy')
    copied.value = true
    setTimeout(() => {
      copied.value = false
    }, 3000)
  } catch (err) {
    console.error('Fallback copy failed:', err)
  }
  
  document.body.removeChild(textArea)
}

const openDocumentation = () => {
  const url = 'https://docs.chatseller.app/integration/' + selectedPlatform.value
  window.open(url, '_blank', 'noopener,noreferrer')
}
</script>