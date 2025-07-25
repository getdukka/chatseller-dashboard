<!-- components/ui/KnowledgeEditModal.vue - TYPES ENTIÈREMENT CORRIGÉS -->
<template>
  <Modal
    :show="true"
    :title="item ? 'Modifier la connaissance' : 'Ajouter une nouvelle connaissance'"
    size="lg"
    @close="$emit('close')"
  >
    <form @submit.prevent="handleSave" class="space-y-6">
      <!-- Title -->
      <div>
        <label class="block text-sm font-medium text-gray-700 mb-2">
          Titre <span class="text-red-500">*</span>
        </label>
        <input
          v-model="form.title"
          type="text"
          required
          class="w-full border border-gray-300 rounded-md px-3 py-2 shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500"
          placeholder="Ex: Guide d'utilisation du produit X"
        >
      </div>

      <!-- Content -->
      <div>
        <label class="block text-sm font-medium text-gray-700 mb-2">
          Contenu <span class="text-red-500">*</span>
        </label>
        <textarea
          v-model="form.content"
          rows="8"
          required
          class="w-full border border-gray-300 rounded-md px-3 py-2 shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500"
          placeholder="Entrez le contenu de votre connaissance..."
        ></textarea>
        <p class="text-xs text-gray-500 mt-1">
          Ce contenu sera utilisé par votre Vendeur IApour répondre aux questions des clients.
        </p>
      </div>

      <!-- Category (optional) -->
      <div>
        <label class="block text-sm font-medium text-gray-700 mb-2">
          Catégorie
        </label>
        <select
          v-model="form.category"
          class="w-full border border-gray-300 rounded-md px-3 py-2 shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500"
        >
          <option value="">Sélectionner une catégorie</option>
          <option value="products">Produits</option>
          <option value="shipping">Livraison</option>
          <option value="returns">Retours</option>
          <option value="support">Support</option>
          <option value="payment">Paiement</option>
          <option value="general">Général</option>
        </select>
      </div>

      <!-- Tags -->
      <div>
        <label class="block text-sm font-medium text-gray-700 mb-2">
          Mots-clés
        </label>
        <input
          v-model="tagsInput"
          type="text"
          class="w-full border border-gray-300 rounded-md px-3 py-2 shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500"
          placeholder="Ex: produit, utilisation, guide (séparés par des virgules)"
          @input="updateTags"
        >
        <p class="text-xs text-gray-500 mt-1">
          Les mots-clés aident l'Vendeur IAà mieux identifier quand utiliser cette connaissance.
        </p>
        
        <!-- Tags Display -->
        <div v-if="form.tags && form.tags.length > 0" class="mt-2 flex flex-wrap gap-1">
          <span
            v-for="tag in form.tags"
            :key="tag"
            class="inline-flex items-center px-2 py-1 rounded-full text-xs font-medium bg-blue-100 text-blue-800"
          >
            {{ tag }}
            <button
              type="button"
              @click="removeTag(tag)"
              class="ml-1 text-blue-600 hover:text-blue-800"
            >
              <svg class="w-3 h-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12"/>
              </svg>
            </button>
          </span>
        </div>
      </div>

      <!-- Active Status -->
      <div class="flex items-center justify-between">
        <div>
          <label class="text-sm font-medium text-gray-700">
            Statut
          </label>
          <p class="text-xs text-gray-500">
            Seules les connaissances actives sont utilisées par l'agent IA
          </p>
        </div>
        <button
          type="button"
          @click="form.isActive = !form.isActive"
          :class="[
            'relative inline-flex h-6 w-11 flex-shrink-0 cursor-pointer rounded-full border-2 border-transparent transition-colors duration-200 ease-in-out focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2',
            form.isActive ? 'bg-blue-600' : 'bg-gray-200'
          ]"
        >
          <span
            :class="[
              'pointer-events-none inline-block h-5 w-5 transform rounded-full bg-white shadow ring-0 transition duration-200 ease-in-out',
              form.isActive ? 'translate-x-5' : 'translate-x-0'
            ]"
          ></span>
        </button>
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
      <div class="flex justify-end space-x-3 pt-4 border-t border-gray-200">
        <button
          type="button"
          @click="$emit('close')"
          class="px-4 py-2 border border-gray-300 rounded-md shadow-sm text-sm font-medium text-gray-700 bg-white hover:bg-gray-50"
        >
          Annuler
        </button>
        <button
          type="submit"
          :disabled="!canSave || saving"
          class="px-4 py-2 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-blue-600 hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed"
        >
          <svg v-if="saving" class="animate-spin -ml-1 mr-2 h-4 w-4 text-white inline" fill="none" viewBox="0 0 24 24">
            <circle class="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" stroke-width="4"></circle>
            <path class="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
          </svg>
          {{ saving ? 'Sauvegarde...' : (item ? 'Mettre à jour' : 'Créer') }}
        </button>
      </div>
    </form>
  </Modal>
</template>

<script setup lang="ts">
import { ref, computed, onMounted, watch } from 'vue'

// ✅ TYPES LOCAUX CORRIGÉS - AVEC PROPRIÉTÉ ID OPTIONNELLE
interface KnowledgeItemForm {
  id?: string               // ✅ AJOUT DE LA PROPRIÉTÉ ID OPTIONNELLE
  title: string
  content: string
  category?: string
  tags?: string[]
  isActive?: boolean
  type?: string
  uploadedAt?: string
}

interface Props {
  item?: KnowledgeItemForm | null
}

interface Emits {
  (e: 'close'): void
  (e: 'save', item: KnowledgeItemForm): void  // ✅ TYPE CORRIGÉ
}

const props = defineProps<Props>()
const emit = defineEmits<Emits>()

// ✅ REACTIVE DATA AVEC TYPES CORRECTS
const saving = ref(false)
const error = ref('')
const tagsInput = ref('')

const form = ref<KnowledgeItemForm>({
  title: '',
  content: '',
  category: '',
  tags: [],
  isActive: true,
  type: 'manual'
})

// ✅ COMPUTED
const canSave = computed(() => {
  return form.value.title?.trim() && form.value.content?.trim()
})

// ✅ METHODS
const updateTags = () => {
  if (tagsInput.value) {
    const tags = tagsInput.value
      .split(',')
      .map(tag => tag.trim())
      .filter(tag => tag.length > 0)
    form.value.tags = [...new Set(tags)] // Remove duplicates
  } else {
    form.value.tags = []
  }
}

const removeTag = (tagToRemove: string) => {
  if (form.value.tags) {
    form.value.tags = form.value.tags.filter(tag => tag !== tagToRemove)
    tagsInput.value = form.value.tags.join(', ')
  }
}

const handleSave = async () => {
  if (!canSave.value) return
  
  saving.value = true
  error.value = ''
  
  try {
    // ✅ PRÉPARATION DES DONNÉES AVEC TYPE CORRIGÉ
    const dataToSave: KnowledgeItemForm = {
      title: form.value.title?.trim() || '',
      content: form.value.content?.trim() || '',
      category: form.value.category || '',
      tags: form.value.tags || [],
      isActive: form.value.isActive !== undefined ? form.value.isActive : true,
      type: form.value.type || 'manual'
    }

    // ✅ SI MODIFICATION, INCLURE L'ID (plus d'erreur TypeScript)
    if (props.item?.id) {
      dataToSave.id = props.item.id
    }
    
    emit('save', dataToSave)
  } catch (err: any) {
    error.value = err.message || 'Erreur lors de la sauvegarde'
  } finally {
    saving.value = false
  }
}

// ✅ INITIALIZATION
onMounted(() => {
  if (props.item) {
    form.value = { ...props.item }
    if (props.item.tags) {
      tagsInput.value = props.item.tags.join(', ')
    }
  }
})

// ✅ WATCHERS
watch(() => props.item, (newItem) => {
  if (newItem) {
    form.value = { ...newItem }
    if (newItem.tags) {
      tagsInput.value = newItem.tags.join(', ')
    }
  } else {
    // Reset form for new item
    form.value = {
      title: '',
      content: '',
      category: '',
      tags: [],
      isActive: true,
      type: 'manual'
    }
    tagsInput.value = ''
  }
}, { immediate: true })
</script>