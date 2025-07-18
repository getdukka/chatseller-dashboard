<template>
  <TransitionRoot :show="isOpen" as="template">
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
            <DialogPanel class="relative transform overflow-hidden rounded-lg bg-white text-left shadow-xl transition-all sm:my-8 sm:w-full sm:max-w-lg">
              <div class="bg-white px-6 py-6">
                <div class="flex items-center justify-between mb-6">
                  <DialogTitle class="text-lg font-semibold text-gray-900">
                    {{ faq ? 'Modifier la FAQ' : 'Ajouter une FAQ' }}
                  </DialogTitle>
                  <button
                    @click="$emit('close')"
                    class="rounded-md text-gray-400 hover:text-gray-500"
                  >
                    <XMarkIcon class="h-6 w-6" />
                  </button>
                </div>
                
                <form @submit.prevent="handleSubmit" class="space-y-6">
                  <!-- Question -->
                  <div>
                    <label class="block text-sm font-medium text-gray-700 mb-2">
                      Question
                    </label>
                    <input
                      v-model="form.question"
                      type="text"
                      required
                      placeholder="Ex: Quels sont vos délais de livraison ?"
                      class="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-blue-500 focus:border-blue-500"
                    />
                  </div>

                  <!-- Réponse -->
                  <div>
                    <label class="block text-sm font-medium text-gray-700 mb-2">
                      Réponse
                    </label>
                    <textarea
                      v-model="form.answer"
                      rows="4"
                      required
                      placeholder="Réponse détaillée à la question..."
                      class="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-blue-500 focus:border-blue-500"
                    ></textarea>
                  </div>

                  <!-- Catégorie -->
                  <div>
                    <label class="block text-sm font-medium text-gray-700 mb-2">
                      Catégorie
                    </label>
                    <select
                      v-model="form.category"
                      required
                      class="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-blue-500 focus:border-blue-500"
                    >
                      <option value="">Sélectionner une catégorie</option>
                      <option value="products">Produits</option>
                      <option value="shipping">Livraison</option>
                      <option value="payment">Paiement</option>
                      <option value="policies">Politiques</option>
                      <option value="support">Support</option>
                    </select>
                  </div>

                  <!-- Actions -->
                  <div class="flex justify-end space-x-3 pt-6 border-t border-gray-200">
                    <button
                      type="button"
                      @click="$emit('close')"
                      class="px-4 py-2 border border-gray-300 rounded-md text-sm font-medium text-gray-700 hover:bg-gray-50"
                    >
                      Annuler
                    </button>
                    <button
                      type="submit"
                      :disabled="!form.question || !form.answer || !form.category"
                      class="px-4 py-2 border border-transparent rounded-md text-sm font-medium text-white bg-blue-600 hover:bg-blue-700 disabled:opacity-50"
                    >
                      {{ faq ? 'Modifier' : 'Ajouter' }}
                    </button>
                  </div>
                </form>
              </div>
            </DialogPanel>
          </TransitionChild>
        </div>
      </div>
    </Dialog>
  </TransitionRoot>
</template>

<script setup lang="ts">
import { reactive, watch } from 'vue'
import { Dialog, DialogPanel, DialogTitle, TransitionRoot, TransitionChild } from '@headlessui/vue'
import { XMarkIcon } from '@heroicons/vue/24/outline'

// Props
const props = defineProps<{
  isOpen: boolean
  faq?: any
}>()

// Emits
const emit = defineEmits<{
  close: []
  save: [faqData: any]
}>()

// État local
const form = reactive({
  question: '',
  answer: '',
  category: ''
})

// Méthodes
const handleSubmit = () => {
  emit('save', { ...form })
  resetForm()
}

const resetForm = () => {
  form.question = ''
  form.answer = ''
  form.category = ''
}

// Watchers
watch(() => props.faq, (newFaq) => {
  if (newFaq) {
    form.question = newFaq.question || ''
    form.answer = newFaq.answer || ''
    form.category = newFaq.category || ''
  } else {
    resetForm()
  }
}, { immediate: true })

watch(() => props.isOpen, (isOpen) => {
  if (!isOpen) {
    resetForm()
  }
})
</script>