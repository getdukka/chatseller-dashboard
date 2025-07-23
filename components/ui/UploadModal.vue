<!-- components/ui/UploadModal.vue - TYPES CORRIGÉS -->
<template>
  <Modal
    :show="true"
    title="Importer un fichier"
    size="lg"
    @close="$emit('close')"
  >
    <div class="space-y-6">
      <!-- Drop Zone -->
      <div
        :class="[
          'border-2 border-dashed rounded-lg p-6 transition-colors cursor-pointer',
          isDragOver
            ? 'border-blue-400 bg-blue-50'
            : 'border-gray-300 hover:border-gray-400'
        ]"
        @dragover.prevent="isDragOver = true"
        @dragleave.prevent="isDragOver = false"
        @drop.prevent="handleDrop"
        @click="triggerFileInput"
      >
        <div class="text-center">
          <svg class="mx-auto h-12 w-12 text-gray-400" stroke="currentColor" fill="none" viewBox="0 0 48 48">
            <path d="M28 8H12a4 4 0 00-4 4v20m32-12v8m0 0v8a4 4 0 01-4 4H12a4 4 0 01-4-4v-4m32-4l-3.172-3.172a4 4 0 00-5.656 0L28 28M8 32l9.172-9.172a4 4 0 015.656 0L28 28m0 0l4 4m4-24h8m-4-4v8m-12 4h.02" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/>
          </svg>
          <div class="mt-4">
            <p class="text-sm text-gray-600">
              <span class="font-medium text-blue-600 hover:text-blue-500">
                Cliquez pour sélectionner
              </span>
              ou glissez-déposez un fichier
            </p>
            <p class="text-xs text-gray-500 mt-1">
              PDF, Word, CSV jusqu'à 10MB
            </p>
          </div>
        </div>
      </div>

      <!-- File Input (Hidden) -->
      <input
        ref="fileInputRef"
        type="file"
        class="hidden"
        accept=".pdf,.doc,.docx,.csv"
        @change="handleFileSelect"
      >

      <!-- File Preview -->
      <div v-if="selectedFile" class="bg-gray-50 rounded-lg p-4">
        <div class="flex items-center justify-between">
          <div class="flex items-center">
            <div class="flex-shrink-0">
              <svg class="h-8 w-8 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z"/>
              </svg>
            </div>
            <div class="ml-3">
              <p class="text-sm font-medium text-gray-900">
                {{ selectedFile.name }}
              </p>
              <p class="text-xs text-gray-500">
                {{ formatFileSize(selectedFile.size) }}
              </p>
            </div>
          </div>
          <button
            @click="clearFile"
            class="text-red-400 hover:text-red-600"
          >
            <svg class="h-5 w-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12"/>
            </svg>
          </button>
        </div>

        <!-- Upload Progress -->
        <div v-if="uploading" class="mt-4">
          <div class="flex items-center justify-between text-sm">
            <span class="text-gray-600">Upload en cours...</span>
            <span class="text-gray-900">{{ uploadProgress }}%</span>
          </div>
          <div class="mt-2 bg-gray-200 rounded-full h-2">
            <div
              class="bg-blue-600 h-2 rounded-full transition-all duration-300"
              :style="{ width: `${uploadProgress}%` }"
            ></div>
          </div>
        </div>
      </div>

      <!-- Error Message -->
      <div v-if="error" class="bg-red-50 border border-red-200 rounded-md p-4">
        <div class="flex">
          <div class="flex-shrink-0">
            <svg class="h-5 w-5 text-red-400" fill="currentColor" viewBox="0 0 20 20">
              <path fill-rule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z" clip-rule="evenodd"/>
            </svg>
          </div>
          <div class="ml-3">
            <p class="text-sm text-red-800">{{ error }}</p>
          </div>
        </div>
      </div>

      <!-- Actions -->
      <div class="flex justify-end space-x-3">
        <button
          @click="$emit('close')"
          class="px-4 py-2 border border-gray-300 rounded-md shadow-sm text-sm font-medium text-gray-700 bg-white hover:bg-gray-50"
        >
          Annuler
        </button>
        <button
          @click="handleUpload"
          :disabled="!selectedFile || uploading"
          class="px-4 py-2 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-blue-600 hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed"
        >
          {{ uploading ? 'Upload...' : 'Importer' }}
        </button>
      </div>
    </div>
  </Modal>
</template>

<script setup lang="ts">
import { ref } from 'vue'

interface Emits {
  (e: 'close'): void
  (e: 'upload', file: File): void
}

const emit = defineEmits<Emits>()

// ✅ REACTIVE DATA SANS TYPES GÉNÉRIQUES
const isDragOver = ref(false)
const selectedFile = ref(null as File | null)
const uploading = ref(false)
const uploadProgress = ref(0)
const error = ref('')
const fileInputRef = ref(null as HTMLInputElement | null)

// ✅ METHODS
const triggerFileInput = () => {
  if (fileInputRef.value) {
    fileInputRef.value.click()
  }
}

const handleFileSelect = (event: Event) => {
  const target = event.target as HTMLInputElement
  const file = target.files?.[0]
  if (file) {
    validateAndSetFile(file)
  }
}

const handleDrop = (event: DragEvent) => {
  isDragOver.value = false
  const file = event.dataTransfer?.files[0]
  if (file) {
    validateAndSetFile(file)
  }
}

const validateAndSetFile = (file: File) => {
  error.value = ''
  
  // Vérifier le type de fichier
  const allowedTypes = [
    'application/pdf',
    'application/msword',
    'application/vnd.openxmlformats-officedocument.wordprocessingml.document',
    'text/csv'
  ]
  
  if (!allowedTypes.includes(file.type)) {
    error.value = 'Type de fichier non supporté. Utilisez PDF, Word ou CSV.'
    return
  }
  
  // Vérifier la taille (10MB max)
  if (file.size > 10 * 1024 * 1024) {
    error.value = 'Le fichier est trop volumineux. Taille maximale : 10MB.'
    return
  }
  
  selectedFile.value = file
}

const clearFile = () => {
  selectedFile.value = null
  error.value = ''
  uploadProgress.value = 0
  if (fileInputRef.value) {
    fileInputRef.value.value = ''
  }
}

const handleUpload = async () => {
  if (!selectedFile.value) return
  
  uploading.value = true
  uploadProgress.value = 0
  error.value = ''
  
  try {
    // Simuler le progress
    const progressInterval = setInterval(() => {
      uploadProgress.value += 10
      if (uploadProgress.value >= 90) {
        clearInterval(progressInterval)
      }
    }, 200)
    
    // Émettre l'événement upload
    emit('upload', selectedFile.value)
    
    // Finaliser le progress
    setTimeout(() => {
      uploadProgress.value = 100
      clearInterval(progressInterval)
    }, 2000)
    
  } catch (err: any) {
    error.value = err.message || 'Erreur lors de l\'upload'
  } finally {
    uploading.value = false
  }
}

const formatFileSize = (bytes: number): string => {
  if (bytes === 0) return '0 Bytes'
  const k = 1024
  const sizes = ['Bytes', 'KB', 'MB', 'GB']
  const i = Math.floor(Math.log(bytes) / Math.log(k))
  return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i]
}
</script>