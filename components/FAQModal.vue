<!-- components/FAQModal.vue -->
<template>
  <TransitionRoot as="template" :show="isOpen">
    <Dialog as="div" class="relative z-50" @close="$emit('close')">
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
            <DialogPanel class="relative transform overflow-hidden rounded-lg bg-white px-4 pb-4 pt-5 text-left shadow-xl transition-all sm:my-8 sm:w-full sm:max-w-lg sm:p-6">
              <div class="absolute right-0 top-0 hidden pr-4 pt-4 sm:block">
                <button
                  type="button"
                  class="rounded-md bg-white text-gray-400 hover:text-gray-500 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2"
                  @click="$emit('close')"
                >
                  <span class="sr-only">Fermer</span>
                  <XMarkIcon class="h-6 w-6" />
                </button>
              </div>

              <div class="sm:flex sm:items-start">
                <div class="w-full">
                  <!-- Header -->
                  <div class="mb-6">
                    <DialogTitle as="h3" class="text-lg font-medium leading-6 text-gray-900">
                      {{ faq ? 'Modifier la FAQ' : 'Ajouter une FAQ' }}
                    </DialogTitle>
                    <p class="mt-2 text-sm text-gray-500">
                      {{ faq ? 'Modifiez cette question fréquente.' : 'Ajoutez une nouvelle question fréquente à votre base de connaissance.' }}
                    </p>
                  </div>

                  <!-- FAQ Form -->
                  <form @submit.prevent="handleSubmit" class="space-y-6">
                    <!-- Question -->
                    <div>
                      <label for="question" class="block text-sm font-medium text-gray-700 mb-2">
                        Question *
                      </label>
                      <input
                        id="question"
                        v-model="form.question"
                        type="text"
                        class="form-input"
                        placeholder="Ex: Quels sont vos délais de livraison ?"
                        required
                      />
                      <p v-if="errors.question" class="mt-1 text-sm text-red-600">{{ errors.question }}</p>
                    </div>

                    <!-- Answer -->
                    <div>
                      <label for="answer" class="block text-sm font-medium text-gray-700 mb-2">
                        Réponse *
                      </label>
                      <textarea
                        id="answer"
                        v-model="form.answer"
                        rows="4"
                        class="form-textarea"
                        placeholder="Rédigez une réponse claire et complète..."
                        required
                      ></textarea>
                      <p v-if="errors.answer" class="mt-1 text-sm text-red-600">{{ errors.answer }}</p>
                      <p class="mt-1 text-xs text-gray-500">{{ form.answer.length }}/500 caractères</p>
                    </div>

                    <!-- Category -->
                    <div>
                      <label for="category" class="block text-sm font-medium text-gray-700 mb-2">
                        Catégorie *
                      </label>
                      <select
                        id="category"
                        v-model="form.category"
                        class="form-select"
                        required
                      >
                        <option value="">Sélectionner une catégorie</option>
                        <option value="products">Produits</option>
                        <option value="policies">Politiques</option>
                        <option value="shipping">Livraison</option>
                        <option value="payment">Paiement</option>
                      </select>
                      <p v-if="errors.category" class="mt-1 text-sm text-red-600">{{ errors.category }}</p>
                    </div>

                    <!-- Keywords (Optional) -->
                    <div>
                      <label for="keywords" class="block text-sm font-medium text-gray-700 mb-2">
                        Mots-clés (optionnel)
                      </label>
                      <input
                        id="keywords"
                        v-model="form.keywords"
                        type="text"
                        class="form-input"
                        placeholder="délai, livraison, transport, expédition..."
                      />
                      <p class="mt-1 text-xs text-gray-500">
                        Séparés par des virgules. Aide l'IA à mieux cibler cette FAQ.
                      </p>
                    </div>

                    <!-- Priority -->
                    <div>
                      <label for="priority" class="block text-sm font-medium text-gray-700 mb-2">
                        Priorité
                      </label>
                      <select
                        id="priority"
                        v-model="form.priority"
                        class="form-select"
                      >
                        <option value="low">Basse</option>
                        <option value="normal">Normale</option>
                        <option value="high">Haute</option>
                      </select>
                      <p class="mt-1 text-xs text-gray-500">
                        Les FAQ haute priorité sont privilégiées par l'IA.
                      </p>
                    </div>

                    <!-- Error message -->
                    <div v-if="error" class="bg-red-50 border border-red-200 rounded-md p-4">
                      <div class="flex">
                        <ExclamationCircleIcon class="h-5 w-5 text-red-400" />
                        <div class="ml-3">
                          <h3 class="text-sm font-medium text-red-800">
                            Erreur de validation
                          </h3>
                          <div class="mt-2 text-sm text-red-700">
                            {{ error }}
                          </div>
                        </div>
                      </div>
                    </div>

                    <!-- Submit Buttons -->
                    <div class="flex justify-end space-x-3">
                      <button
                        type="button"
                        @click="$emit('close')"
                        class="bg-white border border-gray-300 text-gray-700 px-4 py-2 rounded-md text-sm font-medium hover:bg-gray-50 transition-colors"
                      >
                        Annuler
                      </button>
                      <button
                        type="submit"
                        :disabled="saving"
                        class="bg-blue-600 text-white px-4 py-2 rounded-md text-sm font-medium hover:bg-blue-700 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                      >
                        <span v-if="saving" class="flex items-center">
                          <svg class="animate-spin -ml-1 mr-2 h-4 w-4 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                            <circle class="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" stroke-width="4"></circle>
                            <path class="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                          </svg>
                          Sauvegarde...
                        </span>
                        <span v-else>
                          {{ faq ? 'Modifier' : 'Ajouter' }} la FAQ
                        </span>
                      </button>
                    </div>
                  </form>
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
import { Dialog, DialogPanel, DialogTitle, TransitionChild, TransitionRoot } from '@headlessui/vue'
import { XMarkIcon, ExclamationCircleIcon } from '@heroicons/vue/24/outline'

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

// State
const saving = ref(false)
const error = ref('')

// Form data
const form = reactive({
  question: '',
  answer: '',
  category: '',
  keywords: '',
  priority: 'normal'
})

// Validation errors
const errors = reactive({
  question: '',
  answer: '',
  category: ''
})

// Watch for FAQ prop changes
watch(() => props.faq, (newFaq) => {
  if (newFaq) {
    form.question = newFaq.question || ''
    form.answer = newFaq.answer || ''
    form.category = newFaq.category || ''
    form.keywords = newFaq.keywords || ''
    form.priority = newFaq.priority || 'normal'
  } else {
    // Reset form for new FAQ
    Object.assign(form, {
      question: '',
      answer: '',
      category: '',
      keywords: '',
      priority: 'normal'
    })
  }
}, { immediate: true })

// Methods
const validateForm = () => {
  // Reset errors
  Object.assign(errors, {
    question: '',
    answer: '',
    category: ''
  })

  let isValid = true

  if (!form.question.trim()) {
    errors.question = 'La question est requise'
    isValid = false
  } else if (form.question.length < 10) {
    errors.question = 'La question doit contenir au moins 10 caractères'
    isValid = false
  }

  if (!form.answer.trim()) {
    errors.answer = 'La réponse est requise'
    isValid = false
  } else if (form.answer.length < 20) {
    errors.answer = 'La réponse doit contenir au moins 20 caractères'
    isValid = false
  } else if (form.answer.length > 500) {
    errors.answer = 'La réponse ne peut pas dépasser 500 caractères'
    isValid = false
  }

  if (!form.category) {
    errors.category = 'La catégorie est requise'
    isValid = false
  }

  return isValid
}

const handleSubmit = async () => {
  if (!validateForm()) return

  saving.value = true
  error.value = ''

  try {
    // Simulate API call
    await new Promise(resolve => setTimeout(resolve, 1000))

    // Prepare FAQ data
    const faqData = {
      question: form.question.trim(),
      answer: form.answer.trim(),
      category: form.category,
      keywords: form.keywords.trim(),
      priority: form.priority
    }

    // Emit save event
    emit('save', faqData)
  } catch (err) {
    console.error('Save FAQ error:', err)
    error.value = 'Une erreur est survenue lors de la sauvegarde'
  } finally {
    saving.value = false
  }
}

// Watch form changes to clear errors
watch(form, () => {
  error.value = ''
  Object.assign(errors, {
    question: '',
    answer: '',
    category: ''
  })
})
</script>