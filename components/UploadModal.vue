<!-- components/UploadModal.vue -->
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
                      Ajouter du contenu
                    </DialogTitle>
                    <p class="mt-2 text-sm text-gray-500">
                      Uploadez des documents pour enrichir la base de connaissance de votre agent IA.
                    </p>
                  </div>

                  <!-- Upload Form -->
                  <form @submit.prevent="handleSubmit" class="space-y-6">
                    <!-- File Upload Area -->
                    <div>
                      <label class="block text-sm font-medium text-gray-700 mb-2">
                        Fichiers
                      </label>
                      <div
                        @drop="handleDrop"
                        @dragover.prevent
                        @dragenter.prevent
                        class="border-2 border-dashed border-gray-300 rounded-lg p-6 text-center hover:border-blue-500 transition-colors"
                        :class="{ 'border-blue-500 bg-blue-50': isDragging }"
                      >
                        <DocumentPlusIcon class="h-12 w-12 text-gray-400 mx-auto mb-4" />
                        <p class="text-sm text-gray-600 mb-2">
                          Glissez-déposez vos fichiers ici, ou
                          <button
                            type="button"
                            @click="fileInput?.click()"
                            class="text-blue-600 hover:text-blue-500 font-medium"
                          >
                            parcourir
                          </button>
                        </p>
                        <p class="text-xs text-gray-500">
                          PDF, Word, CSV, TXT jusqu'à 10MB
                        </p>
                        <input
                          ref="fileInput"
                          type="file"
                          multiple
                          accept=".pdf,.doc,.docx,.csv,.txt"
                          class="hidden"
                          @change="handleFileSelect"
                        />
                      </div>

                      <!-- Selected Files -->
                      <div v-if="selectedFiles.length > 0" class="mt-4 space-y-2">
                        <h4 class="text-sm font-medium text-gray-900">Fichiers sélectionnés:</h4>
                        <div class="space-y-2">
                          <div
                            v-for="(file, index) in selectedFiles"
                            :key="index"
                            class="flex items-center justify-between bg-gray-50 p-3 rounded-md"
                          >
                            <div class="flex items-center space-x-3">
                              <DocumentIcon class="h-5 w-5 text-gray-400" />
                              <div>
                                <p class="text-sm font-medium text-gray-900">{{ file.name }}</p>
                                <p class="text-xs text-gray-500">{{ formatFileSize(file.size) }}</p>
                              </div>
                            </div>
                            <button
                              type="button"
                              @click="removeFile(index)"
                              class="text-red-400 hover:text-red-600"
                            >
                              <XMarkIcon class="h-4 w-4" />
                            </button>
                          </div>
                        </div>
                      </div>
                    </div>

                    <!-- Category -->
                    <div>
                      <label for="category" class="block text-sm font-medium text-gray-700 mb-2">
                        Catégorie
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
                    </div>

                    <!-- Description -->
                    <div>
                      <label for="description" class="block text-sm font-medium text-gray-700 mb-2">
                        Description (optionnelle)
                      </label>
                      <textarea
                        id="description"
                        v-model="form.description"
                        rows="3"
                        class="form-textarea"
                        placeholder="Décrivez le contenu de ces documents..."
                      ></textarea>
                    </div>

                    <!-- Submit Button -->
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
                        :disabled="selectedFiles.length === 0 || uploading"
                        class="bg-blue-600 text-white px-4 py-2 rounded-md text-sm font-medium hover:bg-blue-700 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                      >
                        <span v-if="uploading" class="flex items-center">
                          <svg class="animate-spin -ml-1 mr-2 h-4 w-4 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                            <circle class="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" stroke-width="4"></circle>
                            <path class="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                          </svg>
                          Upload en cours...
                        </span>
                        <span v-else>
                          Uploader {{ selectedFiles.length }} fichier{{ selectedFiles.length > 1 ? 's' : '' }}
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
import { XMarkIcon, DocumentIcon, DocumentPlusIcon } from '@heroicons/vue/24/outline'

// Props
defineProps<{
  isOpen: boolean
}>()

// Emits
const emit = defineEmits<{
  close: []
  upload: [files: FileList]
}>()

// Template refs
const fileInput = ref<HTMLInputElement>()

// State
const selectedFiles = ref<File[]>([])
const isDragging = ref(false)
const uploading = ref(false)

// Form data
const form = reactive({
  category: '',
  description: ''
})

// Methods
const handleDrop = (event: DragEvent) => {
  event.preventDefault()
  isDragging.value = false
  
  const files = event.dataTransfer?.files
  if (files) {
    addFiles(files)
  }
}

const handleFileSelect = (event: Event) => {
  const target = event.target as HTMLInputElement
  if (target.files) {
    addFiles(target.files)
  }
}

const addFiles = (fileList: FileList) => {
  const validTypes = ['.pdf', '.doc', '.docx', '.csv', '.txt']
  const maxSize = 10 * 1024 * 1024 // 10MB

  Array.from(fileList).forEach(file => {
    const extension = '.' + file.name.split('.').pop()?.toLowerCase()
    
    if (!validTypes.includes(extension)) {
      alert(`Type de fichier non supporté: ${file.name}`)
      return
    }
    
    if (file.size > maxSize) {
      alert(`Fichier trop volumineux: ${file.name} (max 10MB)`)
      return
    }
    
    // Check if file already exists
    if (!selectedFiles.value.some(f => f.name === file.name && f.size === file.size)) {
      selectedFiles.value.push(file)
    }
  })
}

const removeFile = (index: number) => {
  selectedFiles.value.splice(index, 1)
}

const formatFileSize = (bytes: number) => {
  if (bytes === 0) return '0 B'
  const k = 1024
  const sizes = ['B', 'KB', 'MB', 'GB']
  const i = Math.floor(Math.log(bytes) / Math.log(k))
  return parseFloat((bytes / Math.pow(k, i)).toFixed(1)) + ' ' + sizes[i]
}

const handleSubmit = async () => {
  if (selectedFiles.value.length === 0) return
  
  uploading.value = true
  
  try {
    // Create FileList from array
    const dt = new DataTransfer()
    selectedFiles.value.forEach(file => dt.items.add(file))
    
    // Emit upload event
    emit('upload', dt.files)
    
    // Reset form
    selectedFiles.value = []
    form.category = ''
    form.description = ''
  } finally {
    uploading.value = false
  }
}

// Drag events
const handleDragEnter = () => {
  isDragging.value = true
}

const handleDragLeave = () => {
  isDragging.value = false
}
</script>