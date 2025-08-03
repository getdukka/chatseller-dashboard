<!-- components/DeleteAccountModal.vue -->
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
              <div class="sm:flex sm:items-start">
                <div class="mx-auto flex h-12 w-12 flex-shrink-0 items-center justify-center rounded-full bg-red-100 sm:mx-0 sm:h-10 sm:w-10">
                  <ExclamationTriangleIcon class="h-6 w-6 text-red-600" />
                </div>
                <div class="mt-3 text-center sm:ml-4 sm:mt-0 sm:text-left w-full">
                  <DialogTitle as="h3" class="text-lg font-medium leading-6 text-gray-900">
                    Supprimer définitivement votre compte
                  </DialogTitle>
                  <div class="mt-2">
                    <p class="text-sm text-gray-500">
                      Cette action est <strong>irréversible</strong>. Toutes vos données seront définitivement supprimées :
                    </p>
                    
                    <!-- What will be deleted -->
                    <div class="mt-4 bg-red-50 border border-red-200 rounded-md p-4">
                      <ul class="text-sm text-red-700 space-y-1">
                        <li>• Votre profil et paramètres de compte</li>
                        <li>• Toutes vos conversations et historiques</li>
                        <li>• Votre base de connaissance et documents</li>
                        <li>• Toutes les commandes et données analytics</li>
                        <li>• La configuration de votre agent IA</li>
                      </ul>
                    </div>
                    
                    <p class="text-sm text-gray-500 mt-4">
                      Pour confirmer la suppression, tapez <strong>"SUPPRIMER"</strong> dans le champ ci-dessous :
                    </p>
                    
                    <!-- Confirmation Input -->
                    <div class="mt-4">
                      <input
                        v-model="confirmationText"
                        type="text"
                        class="block w-full border-gray-300 rounded-md shadow-sm focus:ring-red-500 focus:border-red-500 sm:text-sm"
                        placeholder="Tapez SUPPRIMER"
                        autocomplete="off"
                      />
                      <p v-if="error" class="mt-2 text-sm text-red-600">{{ error }}</p>
                    </div>
                  </div>
                </div>
              </div>
              
              <div class="mt-5 sm:mt-4 sm:flex sm:flex-row-reverse">
                <button
                  type="button"
                  @click="handleConfirm"
                  :disabled="!canDelete || deleting"
                  class="inline-flex w-full justify-center rounded-md border border-transparent bg-red-600 px-4 py-2 text-base font-medium text-white shadow-sm hover:bg-red-700 focus:outline-none focus:ring-2 focus:ring-red-500 focus:ring-offset-2 disabled:opacity-50 disabled:cursor-not-allowed sm:ml-3 sm:w-auto sm:text-sm"
                >
                  <span v-if="deleting" class="flex items-center">
                    <svg class="animate-spin -ml-1 mr-2 h-4 w-4 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                      <circle class="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" stroke-width="4"></circle>
                      <path class="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                    </svg>
                    Suppression...
                  </span>
                  <span v-else>
                    Supprimer définitivement
                  </span>
                </button>
                <button
                  type="button"
                  @click="$emit('close')"
                  :disabled="deleting"
                  class="mt-3 inline-flex w-full justify-center rounded-md border border-gray-300 bg-white px-4 py-2 text-base font-medium text-gray-700 shadow-sm hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 sm:mt-0 sm:w-auto sm:text-sm disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  Annuler
                </button>
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
import { ExclamationTriangleIcon } from '@heroicons/vue/24/outline'

// Emits
const emit = defineEmits<{
  close: []
  confirm: []
}>()

// State
const confirmationText = ref('')
const deleting = ref(false)
const error = ref('')

// Computed
const canDelete = computed(() => {
  return confirmationText.value.trim().toUpperCase() === 'SUPPRIMER'
})

// Methods
const handleConfirm = async () => {
  if (!canDelete.value) {
    error.value = 'Veuillez taper "SUPPRIMER" pour confirmer'
    return
  }

  deleting.value = true
  error.value = ''

  try {
    // Emit confirm event
    emit('confirm')
  } catch (err) {
    console.error('Delete account error:', err)
    error.value = 'Une erreur est survenue lors de la suppression'
  } finally {
    deleting.value = false
  }
}

// Clear error when user types
watch(confirmationText, () => {
  error.value = ''
})

// Props
const props = defineProps<{
  isOpen: boolean
}>()

// Reset form when modal closes
watch(() => props.isOpen, (newValue) => {
  if (!newValue) {
    confirmationText.value = ''
    error.value = ''
    deleting.value = false
  }
})
</script>