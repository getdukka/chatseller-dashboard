<template>
  <TransitionRoot :show="show" as="template">
    <Dialog @close="$emit('close')" class="relative z-50">
      <TransitionChild
        as="template"
        enter="ease-out duration-300"
        enter-from="opacity-0"
        enter-to="opacity-100"
        leave="ease-in duration-200"
        leave-from="opacity-100"
        leave-to="opacity-0"
      >
        <div class="fixed inset-0 bg-gray-500 bg-opacity-75 transition-opacity" />
      </TransitionChild>

      <div class="fixed inset-0 z-10 overflow-y-auto">
        <div class="flex min-h-full items-end justify-center p-4 text-center sm:items-center sm:p-0">
          <TransitionChild
            as="template"
            enter="ease-out duration-300"
            enter-from="opacity-0 translate-y-4 sm:translate-y-0 sm:scale-95"
            enter-to="opacity-100 translate-y-0 sm:scale-100"
            leave="ease-in duration-200"
            leave-from="opacity-100 translate-y-0 sm:scale-100"
            leave-to="opacity-0 translate-y-4 sm:translate-y-0 sm:scale-95"
          >
            <DialogPanel class="relative transform overflow-hidden rounded-lg bg-white text-left shadow-xl transition-all sm:my-8 sm:w-full sm:max-w-2xl">
              <div class="bg-white px-6 py-6">
                <div class="flex items-center justify-between mb-6">
                  <div>
                    <DialogTitle class="text-lg font-semibold text-gray-900">
                      Code d'intégration ChatSeller
                    </DialogTitle>
                    <p class="text-sm text-gray-600 mt-1">
                      Copiez ce code et collez-le sur vos pages produit
                    </p>
                  </div>
                  <button
                    @click="$emit('close')"
                    class="rounded-md text-gray-400 hover:text-gray-500 focus:outline-none focus:ring-2 focus:ring-blue-500"
                  >
                    <XMarkIcon class="h-6 w-6" />
                  </button>
                </div>
                
                <!-- Onglets -->
                <div class="border-b border-gray-200 mb-6">
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
                      {{ tab.name }}
                    </button>
                  </nav>
                </div>

                <!-- Contenu des onglets -->
                <div v-if="activeTab === 'script'">
                  <div class="mb-4">
                    <label class="block text-sm font-medium text-gray-700 mb-2">
                      Code JavaScript (recommandé)
                    </label>
                    <div class="bg-gray-900 rounded-lg p-4 text-sm text-gray-100 font-mono overflow-x-auto">
                      <pre><code>&lt;!-- ChatSeller Widget --&gt;
&lt;script src="https://widget.chatseller.app/widget.js" 
        data-shop-id="{{ userId }}"
        data-button-text="Parler à la vendeuse"
        data-primary-color="#ec4899"
        data-position="above-cart"&gt;&lt;/script&gt;</code></pre>
                    </div>
                  </div>
                </div>

                <div v-if="activeTab === 'shopify'">
                  <div class="mb-4">
                    <label class="block text-sm font-medium text-gray-700 mb-2">
                      Installation Shopify
                    </label>
                    <div class="prose text-sm text-gray-600 mb-4">
                      <ol class="list-decimal list-inside space-y-2">
                        <li>Allez dans votre admin Shopify → Boutique en ligne → Thèmes</li>
                        <li>Cliquez sur "Actions" → "Modifier le code"</li>
                        <li>Dans Templates, ouvrez "product.liquid"</li>
                        <li>Collez le code ci-dessous avant la balise &lt;/form&gt;</li>
                      </ol>
                    </div>
                    <div class="bg-gray-900 rounded-lg p-4 text-sm text-gray-100 font-mono overflow-x-auto">
                      <pre><code>&lt;!-- ChatSeller Widget --&gt;
&lt;script src="https://widget.chatseller.app/widget.js" 
        data-shop-id="{{ userId }}"
        data-button-text="Parler à la vendeuse"
        data-primary-color="#ec4899"&gt;&lt;/script&gt;</code></pre>
                    </div>
                  </div>
                </div>

                <div v-if="activeTab === 'woocommerce'">
                  <div class="mb-4">
                    <label class="block text-sm font-medium text-gray-700 mb-2">
                      Installation WooCommerce
                    </label>
                    <div class="prose text-sm text-gray-600 mb-4">
                      <ol class="list-decimal list-inside space-y-2">
                        <li>Allez dans WordPress Admin → Apparence → Éditeur de thème</li>
                        <li>Ouvrez le fichier "single-product.php"</li>
                        <li>Ou utilisez l'action WordPress ci-dessous dans functions.php</li>
                      </ol>
                    </div>
                    <div class="bg-gray-900 rounded-lg p-4 text-sm text-gray-100 font-mono overflow-x-auto">
                      <pre><code>// Ajouter dans functions.php
add_action('woocommerce_single_product_summary', 'add_chatseller_widget', 25);
function add_chatseller_widget() {
    echo '&lt;script src="https://widget.chatseller.app/widget.js" 
               data-shop-id="{{ userId }}"
               data-button-text="Parler à la vendeuse"
               data-primary-color="#ec4899"&gt;&lt;/script&gt;';
}</code></pre>
                    </div>
                  </div>
                </div>
                
                <!-- Actions -->
                <div class="flex items-center justify-between pt-4 border-t border-gray-200">
                  <div class="flex items-center text-sm text-gray-500">
                    <InformationCircleIcon class="h-4 w-4 mr-2" />
                    Le widget s'adapte automatiquement à votre design
                  </div>
                  <div class="flex space-x-3">
                    <button
                      @click="copyToClipboard"
                      class="inline-flex items-center px-4 py-2 border border-gray-300 rounded-md text-sm font-medium text-gray-700 bg-white hover:bg-gray-50 transition-colors duration-200"
                    >
                      <ClipboardIcon class="mr-2 h-4 w-4" />
                      Copier le code
                    </button>
                    <NuxtLink
                      to="/settings"
                      @click="$emit('close')"
                      class="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md text-white bg-blue-600 hover:bg-blue-700 transition-colors duration-200"
                    >
                      <Cog6ToothIcon class="mr-2 h-4 w-4" />
                      Personnaliser
                    </NuxtLink>
                  </div>
                </div>
              </div>
            </DialogPanel>
          </TransitionChild>
        </div>
      </div>
    </Dialog>
  </TransitionRoot>
</template>

<script setup lang="ts">
import { ref } from 'vue'
import { Dialog, DialogPanel, DialogTitle, TransitionRoot, TransitionChild } from '@headlessui/vue'
import {
  XMarkIcon,
  ClipboardIcon,
  Cog6ToothIcon,
  InformationCircleIcon
} from '@heroicons/vue/24/outline'

// Props
const props = defineProps<{
  show: boolean
  userId?: string
}>()

// Emits
const emit = defineEmits<{
  close: []
}>()

// État local
const activeTab = ref('script')

const tabs = [
  { id: 'script', name: 'Script universel' },
  { id: 'shopify', name: 'Shopify' },
  { id: 'woocommerce', name: 'WooCommerce' }
]

// Computed
const userId = computed(() => props.userId || 'YOUR_SHOP_ID')

// Méthodes
const copyToClipboard = async () => {
  let code = ''
  
  switch (activeTab.value) {
    case 'script':
      code = `<!-- ChatSeller Widget -->
<script src="https://widget.chatseller.app/widget.js" 
        data-shop-id="${userId.value}"
        data-button-text="Parler à la vendeuse"
        data-primary-color="#ec4899"
        data-position="above-cart"><\/script>`
      break
    case 'shopify':
      code = `<!-- ChatSeller Widget -->
<script src="https://widget.chatseller.app/widget.js" 
        data-shop-id="${userId.value}"
        data-button-text="Parler à la vendeuse"
        data-primary-color="#ec4899"><\/script>`
      break
    case 'woocommerce':
      code = `// Ajouter dans functions.php
add_action('woocommerce_single_product_summary', 'add_chatseller_widget', 25);
function add_chatseller_widget() {
    echo '<script src="https://widget.chatseller.app/widget.js" 
               data-shop-id="${userId.value}"
               data-button-text="Parler à la vendeuse"
               data-primary-color="#ec4899"><\/script>';
}`
      break
  }
  
  try {
    await navigator.clipboard.writeText(code)
    // Émettre une notification de succès
    const showNotification = inject('showNotification') as (message: string, type: string) => void
    if (showNotification) {
      showNotification('Code copié avec succès !', 'success')
    }
  } catch (error) {
    console.error('Erreur lors de la copie:', error)
  }
}
</script>