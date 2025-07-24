<!-- components/ui/IntegrationModal.vue - CORRIGÉ COMPLET -->
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

// ✅ INTERFACES LOCALES
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

// ✅ METHODS - TEMPLATE LITERALS CORRIGÉS
const getHtmlCode = (shopId: string): string => {
  return `<!-- ChatSeller Widget -->
<script>
(function() {
  var script = document.createElement('script');
  script.src = 'https://widget.chatseller.app/widget.js';
  script.setAttribute('data-shop-id', '${shopId}');
  script.setAttribute('data-button-text', 'Parler à la vendeuse');
  script.setAttribute('data-primary-color', '#ec4899');
  script.setAttribute('data-position', 'above-cart');
  document.head.appendChild(script);
})();
</script>`
}

const getWordPressCode = (shopId: string): string => {
  return `<!-- Ajouter dans functions.php -->
add_action('wp_footer', 'add_chatseller_widget', 25);
function add_chatseller_widget() {
  echo '<script src="https://widget.chatseller.app/widget.js"
    data-shop-id="${shopId}"
    data-button-text="Parler à la vendeuse"
    data-primary-color="#ec4899"></script>';
}`
}

const getShopifyCode = (shopId: string): string => {
  return `<!-- ChatSeller Widget -->
<script src="https://widget.chatseller.app/widget.js"
  data-shop-id="${shopId}"
  data-button-text="Parler à la vendeuse"
  data-primary-color="#ec4899"></script>`
}

const getWooCommerceCode = (shopId: string): string => {
  return `// Ajouter dans functions.php
add_action('woocommerce_single_product_summary', 'add_chatseller_widget', 25);
function add_chatseller_widget() {
  echo '<script src="https://widget.chatseller.app/widget.js"
    data-shop-id="${shopId}"
    data-button-text="Parler à la vendeuse"
    data-primary-color="#ec4899"></script>';
}`
}

const getSquarespaceCode = (shopId: string): string => {
  return `<!-- Ajouter dans Settings > Advanced > Code Injection > Footer -->
<script>
(function() {
  var script = document.createElement('script');
  script.src = 'https://widget.chatseller.app/widget.js';
  script.setAttribute('data-shop-id', '${shopId}');
  script.setAttribute('data-button-text', 'Parler à la vendeuse');
  script.setAttribute('data-primary-color', '#ec4899');
  document.head.appendChild(script);
})();
</script>`
}

const getWixCode = (shopId: string): string => {
  return `<!-- Ajouter via Wix Editor > Settings > Custom Code > Add Code to Head -->
<script>
(function() {
  var script = document.createElement('script');
  script.src = 'https://widget.chatseller.app/widget.js';
  script.setAttribute('data-shop-id', '${shopId}');
  script.setAttribute('data-button-text', 'Parler à la vendeuse');
  script.setAttribute('data-primary-color', '#ec4899');
  document.head.appendChild(script);
})();
</script>`
}

// ✅ COMPUTED
const integrationCode = computed(() => {
  if (!selectedPlatform.value) return ''
  
  const shopId = auth.userShopId.value || 'YOUR_SHOP_ID'
  
  switch (selectedPlatform.value) {
    case 'html':
      return getHtmlCode(shopId)
    case 'wordpress':
      return getWordPressCode(shopId)
    case 'shopify':
      return getShopifyCode(shopId)
    case 'woocommerce':
      return getWooCommerceCode(shopId)
    case 'squarespace':
      return getSquarespaceCode(shopId)
    case 'wix':
      return getWixCode(shopId)
    default:
      return getHtmlCode(shopId)
  }
})

// ✅ METHODS ADDITIONNELS
const getPlatformName = (platformId: string): string => {
  const platform = platforms.find(p => p.id === platformId)
  return platform ? platform.name : ''
}

const getInstructions = (platformId: string): string => {
  const instructions: Record<string, string> = {
    html: `
      <ol class="list-decimal list-inside space-y-1">
        <li>Copiez le code ci-dessus</li>
        <li>Ouvrez votre fichier HTML</li>
        <li>Collez le code juste avant la balise &lt;/body&gt;</li>
        <li>Sauvegardez le fichier</li>
      </ol>
    `,
    wordpress: `
      <ol class="list-decimal list-inside space-y-1">
        <li>Accédez à Apparence → Éditeur de thème</li>
        <li>Ouvrez le fichier functions.php</li>
        <li>Ajoutez le code à la fin du fichier</li>
        <li>Sauvegardez les modifications</li>
      </ol>
    `,
    shopify: `
      <ol class="list-decimal list-inside space-y-1">
        <li>Accédez à Boutique en ligne → Thèmes</li>
        <li>Cliquez sur Actions → Modifier le code</li>
        <li>Ouvrez le fichier theme.liquid</li>
        <li>Collez le code avant &lt;/body&gt;</li>
        <li>Sauvegardez les modifications</li>
      </ol>
    `,
    woocommerce: `
      <ol class="list-decimal list-inside space-y-1">
        <li>Accédez à Apparence → Éditeur de thème</li>
        <li>Ouvrez le fichier functions.php</li>
        <li>Ajoutez le code à la fin du fichier</li>
        <li>Sauvegardez les modifications</li>
      </ol>
    `,
    squarespace: `
      <ol class="list-decimal list-inside space-y-1">
        <li>Accédez à Settings → Advanced → Code Injection</li>
        <li>Collez le code dans la section Footer</li>
        <li>Cliquez sur Save</li>
      </ol>
    `,
    wix: `
      <ol class="list-decimal list-inside space-y-1">
        <li>Ouvrez l'éditeur Wix</li>
        <li>Accédez à Settings → Custom Code</li>
        <li>Cliquez sur Add Code to Head</li>
        <li>Collez le code et sauvegardez</li>
      </ol>
    `
  }
  
  return instructions[platformId] || instructions.html
}

const copyCode = async () => {
  try {
    await navigator.clipboard.writeText(integrationCode.value)
    copied.value = true
    setTimeout(() => {
      copied.value = false
    }, 3000)
  } catch (error) {
    console.error('Erreur lors de la copie:', error)
  }
}

const openDocumentation = () => {
  const url = `https://docs.chatseller.app/integration/${selectedPlatform.value}`
  window.open(url, '_blank')
}
</script>