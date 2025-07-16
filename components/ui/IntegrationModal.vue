<template>
  <TransitionRoot :show="show" as="template">
    <Dialog @close="closeModal" class="relative z-50">
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
                <div class="flex items-center justify-between mb-4">
                  <DialogTitle class="text-lg font-semibold text-gray-900">
                    Code d'intégration ChatSeller
                  </DialogTitle>
                  <button
                    @click="closeModal"
                    class="rounded-md text-gray-400 hover:text-gray-500"
                  >
                    <XMarkIcon class="h-6 w-6" />
                  </button>
                </div>
                
                <p class="text-sm text-gray-600 mb-4">
                  Copiez ce code et collez-le sur vos pages produit où vous souhaitez afficher le bouton ChatSeller.
                </p>
                
                <div class="bg-gray-900 rounded-lg p-4 text-sm text-gray-100 font-mono overflow-x-auto mb-4">
                  <pre><code>&lt;!-- ChatSeller Widget --&gt;
&lt;script src="https://widget.chatseller.app/widget.js" 
        data-shop-id="{{userId || 'YOUR_SHOP_ID'}}"
        data-button-text="Parler à la vendeuse"
        data-primary-color="#ec4899"&gt;&lt;/script&gt;</code></pre>
                </div>
                
                <div class="bg-blue-50 border-l-4 border-blue-400 p-4 mb-4">
                  <div class="flex">
                    <InformationCircleIcon class="h-5 w-5 text-blue-400" />
                    <div class="ml-3">
                      <p class="text-sm text-blue-700">
                        <strong>Instructions :</strong>
                      </p>
                      <ul class="mt-2 text-sm text-blue-600 list-disc list-inside space-y-1">
                        <li>Placez ce code juste avant la balise &lt;/body&gt; de vos pages produit</li>
                        <li>Le bouton apparaîtra automatiquement sur vos pages</li>
                        <li>Personnalisez l'apparence depuis la page Configuration</li>
                      </ul>
                    </div>
                  </div>
                </div>
                
                <div class="flex justify-end space-x-3">
                  <button
                    @click="closeModal"
                    class="inline-flex items-center px-4 py-2 border border-gray-300 rounded-md text-sm font-medium text-gray-700 bg-white hover:bg-gray-50"
                  >
                    Fermer
                  </button>
                  <button
                    @click="copyToClipboard"
                    class="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md text-white bg-blue-600 hover:bg-blue-700"
                  >
                    <ClipboardIcon class="mr-2 h-4 w-4" />
                    Copier le code
                  </button>
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
import { Dialog, DialogPanel, DialogTitle, TransitionRoot, TransitionChild } from '@headlessui/vue'
import { XMarkIcon, ClipboardIcon, InformationCircleIcon } from '@heroicons/vue/24/outline'

interface Props {
  show: boolean
  userId?: string
}

interface Emits {
  (e: 'update:show', value: boolean): void
}

const props = defineProps<Props>()
const emit = defineEmits<Emits>()

const closeModal = () => {
  emit('update:show', false)
}

const copyToClipboard = async () => {
  const userId = props.userId || 'YOUR_SHOP_ID'
  const code = `<!-- ChatSeller Widget -->
<script src="https://widget.chatseller.app/widget.js" 
        data-shop-id="${userId}"
        data-button-text="Parler à la vendeuse"
        data-primary-color="#ec4899"><\/script>`
  
  try {
    await navigator.clipboard.writeText(code)
    // Ici on pourrait ajouter une notification toast
    console.log('Code copié avec succès!')
    closeModal()
  } catch (error) {
    console.error('Erreur lors de la copie:', error)
  }
}
</script>