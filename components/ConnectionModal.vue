<!-- components/ConnectionModal.vue - MODAL CHOIX PLATEFORME -->
<template>
  <div class="modal-overlay" @click.self="$emit('close')">
    <div class="modal-content">
      <div class="modal-header">
        <h3 class="modal-title">Connecter une boutique</h3>
        <button @click="$emit('close')" class="modal-close">
          <svg class="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12"/>
          </svg>
        </button>
      </div>
      
      <div class="modal-body">
        <div class="space-y-4">
          <!-- Shopify -->
          <div 
            class="connection-option" 
            @click="$emit('connect-shopify')"
          >
            <div class="flex items-center space-x-4">
              <div class="p-3 bg-green-100 rounded-lg">
                <svg class="w-8 h-8 text-green-600" fill="currentColor" viewBox="0 0 24 24">
                  <path d="M15.337 2.543c-.161-.026-.322-.04-.483-.04-2.688 0-4.516 1.859-4.516 4.516 0 .201.013.402.04.603l-3.027 3.027c-.201-.027-.402-.04-.603-.04C3.859 10.609 2 12.468 2 15.337c0 2.868 1.859 4.727 4.748 4.727 2.068 0 3.845-.966 4.395-2.401l3.246-3.246c.966.402 2.068.322 2.951-.241 1.449-.966 1.931-2.951.966-4.4-.563-.859-1.449-1.369-2.388-1.369-.322 0-.643.067-.946.188l-3.528-3.528c.121-.308.188-.629.188-.951 0-.939-.51-1.825-1.369-2.388-.668-.441-1.489-.632-2.294-.441zM15.337 3.71c.51-.081 1.047.081 1.449.402.643.429.859 1.208.644 1.852-.215.644-.859 1.047-1.503.93-.644-.134-1.127-.71-1.208-1.369-.081-.644.215-1.288.618-1.815zm-6.969 7.637c.215-.644.859-1.047 1.503-.93.644.134 1.127.71 1.208 1.369.081.644-.215 1.288-.618 1.815-.51.081-1.047-.081-1.449-.402-.643-.429-.859-1.208-.644-1.852zm-1.503 5.778c-2.147 0-3.888-1.741-3.888-3.888s1.741-3.888 3.888-3.888c.215 0 .429.027.644.067l-.617 2.628c-.027.107-.027.215 0 .322l.617 2.628c-.215.04-.429.067-.644.067z"/>
                </svg>
              </div>
              <div class="flex-1">
                <h4 class="text-lg font-medium text-gray-900">Shopify</h4>
                <p class="text-sm text-gray-500">
                  Synchronisez automatiquement votre catalogue Shopify
                </p>
                <div class="mt-2 flex items-center text-xs text-green-600">
                  <svg class="w-4 h-4 mr-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M5 13l4 4L19 7"/>
                  </svg>
                  Synchronisation temps réel
                </div>
              </div>
              <div class="text-green-600">
                <svg class="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 5l7 7-7 7"/>
                </svg>
              </div>
            </div>
          </div>

          <!-- WooCommerce -->
          <div 
            class="connection-option" 
            @click="$emit('connect-woocommerce')"
          >
            <div class="flex items-center space-x-4">
              <div class="p-3 bg-blue-100 rounded-lg">
                <svg class="w-8 h-8 text-blue-600" fill="currentColor" viewBox="0 0 24 24">
                  <path d="M23.527 8.257c-.223-1.37-1.209-2.368-2.587-2.368-1.377 0-2.362.998-2.587 2.368-.033.201-.033.402 0 .603.223 1.37 1.209 2.368 2.587 2.368s2.364-.998 2.587-2.368c.033-.201.033-.402 0-.603zM20.94 7.654c.563 0 1.013.45 1.013 1.013s-.45 1.013-1.013 1.013-1.013-.45-1.013-1.013.45-1.013 1.013-1.013zM8.4 15.6c-.563 0-1.013-.45-1.013-1.013s.45-1.013 1.013-1.013 1.013.45 1.013 1.013-.45 1.013-1.013 1.013zM8.4 12.573c-1.377 0-2.364.998-2.587 2.368-.033.201-.033.402 0 .603.223 1.37 1.209 2.368 2.587 2.368s2.364-.998 2.587-2.368c.033-.201.033-.402 0-.603-.223-1.37-1.209-2.368-2.587-2.368zM14.667 8.16c-.563 0-1.013-.45-1.013-1.013s.45-1.013 1.013-1.013 1.013.45 1.013 1.013-.45 1.013-1.013 1.013zM14.667 5.133c1.377 0 2.364.998 2.587 2.368.033.201.033.402 0 .603-.223 1.37-1.209 2.368-2.587 2.368s-2.364-.998-2.587-2.368c-.033-.201-.033-.402 0-.603.223-1.37 1.209-2.368 2.587-2.368z"/>
                </svg>
              </div>
              <div class="flex-1">
                <h4 class="text-lg font-medium text-gray-900">WooCommerce</h4>
                <p class="text-sm text-gray-500">
                  Connectez votre boutique WordPress WooCommerce
                </p>
                <div class="mt-2 flex items-center text-xs text-blue-600">
                  <svg class="w-4 h-4 mr-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M5 13l4 4L19 7"/>
                  </svg>
                  API REST sécurisée
                </div>
              </div>
              <div class="text-blue-600">
                <svg class="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 5l7 7-7 7"/>
                </svg>
              </div>
            </div>
          </div>

          <!-- Coming Soon -->
          <div class="connection-option disabled">
            <div class="flex items-center space-x-4">
              <div class="p-3 bg-gray-100 rounded-lg">
                <svg class="w-8 h-8 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M8.684 13.342C8.886 12.938 9 12.482 9 12c0-.482-.114-.938-.316-1.342m0 2.684a3 3 0 110-2.684m0 2.684l6.632 3.316m-6.632-6l6.632-3.316m0 0a3 3 0 105.367-2.684 3 3 0 00-5.367 2.684zm0 9.316a3 3 0 105.367 2.684 3 3 0 00-5.367-2.684z"/>
                </svg>
              </div>
              <div class="flex-1">
                <h4 class="text-lg font-medium text-gray-400">Autres plateformes</h4>
                <p class="text-sm text-gray-400">Magento, PrestaShop, BigCommerce</p>
                <div class="mt-2">
                  <span class="text-xs text-gray-400 bg-gray-100 px-2 py-1 rounded">Bientôt disponible</span>
                </div>
              </div>
            </div>
          </div>
        </div>

        <!-- Info Box -->
        <div class="mt-6 bg-blue-50 border border-blue-200 rounded-lg p-4">
          <div class="flex">
            <svg class="w-5 h-5 text-blue-600 mr-2 mt-0.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"/>
            </svg>
            <div>
              <p class="text-sm text-blue-800 font-medium">Pourquoi connecter ma boutique ?</p>
              <p class="text-sm text-blue-700 mt-1">
                Synchronisez automatiquement vos produits pour que votre Vendeur IA ait toujours les informations à jour : prix, stock, descriptions et images.
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
// ✅ EMITS
const emit = defineEmits<{
  close: []
  'connect-shopify': []
  'connect-woocommerce': []
}>()
</script>

<style scoped>
/* ✅ MODAL STYLES */
.modal-overlay {
  @apply fixed inset-0 z-50 overflow-y-auto bg-gray-900 bg-opacity-50 backdrop-blur-sm flex items-center justify-center p-4;
}

.modal-content {
  @apply bg-white rounded-xl shadow-xl max-w-lg w-full max-h-[90vh] overflow-y-auto;
}

.modal-header {
  @apply flex items-center justify-between p-6 border-b border-gray-200;
}

.modal-title {
  @apply text-lg font-semibold text-gray-900;
}

.modal-close {
  @apply text-gray-400 hover:text-gray-600 transition-colors;
}

.modal-body {
  @apply p-6;
}

/* ✅ CONNECTION OPTIONS */
.connection-option {
  @apply p-4 border border-gray-200 rounded-lg cursor-pointer transition-all hover:border-blue-300 hover:bg-blue-50;
}

.connection-option.disabled {
  @apply cursor-not-allowed opacity-60 hover:border-gray-200 hover:bg-white;
}
</style>