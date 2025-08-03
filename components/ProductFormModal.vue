<!-- components/ProductFormModal.vue - MODAL CRÉATION/ÉDITION PRODUIT -->
<template>
  <div class="modal-overlay" @click.self="$emit('close')">
    <div class="modal-content modal-large">
      <div class="modal-header">
        <h3 class="modal-title">
          {{ product ? 'Modifier le produit' : 'Ajouter un produit' }}
        </h3>
        <button @click="$emit('close')" class="modal-close">
          <svg class="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12"/>
          </svg>
        </button>
      </div>
      
      <div class="modal-body max-h-[70vh] overflow-y-auto">
        <div class="grid grid-cols-1 md:grid-cols-2 gap-6">
          <!-- Left Column - Basic Info -->
          <div class="space-y-4">
            <!-- Product Name -->
            <div>
              <label class="block text-sm font-medium text-gray-700 mb-2">
                Nom du produit *
              </label>
              <input
                v-model="form.name"
                type="text"
                class="input-modern w-full"
                :class="{ 'border-red-500': errors.name }"
                placeholder="Nom de votre produit"
                @blur="validateField('name')"
              >
              <p v-if="errors.name" class="text-red-500 text-xs mt-1">{{ errors.name }}</p>
            </div>
            
            <!-- Description -->
            <div>
              <label class="block text-sm font-medium text-gray-700 mb-2">
                Description
              </label>
              <textarea
                v-model="form.description"
                rows="4"
                class="input-modern w-full"
                placeholder="Description détaillée de votre produit"
              ></textarea>
            </div>
            
            <!-- Price & Compare Price -->
            <div class="grid grid-cols-2 gap-4">
              <div>
                <label class="block text-sm font-medium text-gray-700 mb-2">
                  Prix (€) *
                </label>
                <input
                  v-model.number="form.price"
                  type="number"
                  step="0.01"
                  min="0"
                  class="input-modern w-full"
                  :class="{ 'border-red-500': errors.price }"
                  placeholder="0.00"
                  @blur="validateField('price')"
                >
                <p v-if="errors.price" class="text-red-500 text-xs mt-1">{{ errors.price }}</p>
              </div>
              
              <div>
                <label class="block text-sm font-medium text-gray-700 mb-2">
                  Prix barré (€)
                </label>
                <input
                  v-model.number="form.compareAtPrice"
                  type="number"
                  step="0.01"
                  min="0"
                  class="input-modern w-full"
                  placeholder="0.00"
                >
              </div>
            </div>
            
            <!-- Category & SKU -->
            <div class="grid grid-cols-2 gap-4">
              <div>
                <label class="block text-sm font-medium text-gray-700 mb-2">
                  Catégorie
                </label>
                <select v-model="form.category" class="input-modern w-full">
                  <option value="">Sélectionner une catégorie</option>
                  <option v-for="category in categories" :key="category" :value="category">
                    {{ category }}
                  </option>
                </select>
              </div>
              
              <div>
                <label class="block text-sm font-medium text-gray-700 mb-2">
                  SKU / Référence
                </label>
                <input
                  v-model="form.sku"
                  type="text"
                  class="input-modern w-full"
                  placeholder="SKU-001"
                >
              </div>
            </div>

            <!-- Weight -->
            <div>
              <label class="block text-sm font-medium text-gray-700 mb-2">
                Poids (grammes)
              </label>
              <input
                v-model.number="form.weight"
                type="number"
                min="0"
                class="input-modern w-full"
                placeholder="0"
              >
            </div>

            <!-- Tags -->
            <div>
              <label class="block text-sm font-medium text-gray-700 mb-2">
                Tags
              </label>
              <div class="space-y-2">
                <div class="flex flex-wrap gap-2 mb-2">
                  <span
                    v-for="(tag, index) in form.tags"
                    :key="index"
                    class="inline-flex items-center px-2 py-1 bg-blue-100 text-blue-800 text-xs rounded-full"
                  >
                    {{ tag }}
                    <button
                      @click="removeTag(index)"
                      class="ml-1 text-blue-600 hover:text-blue-800"
                    >
                      <svg class="w-3 h-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12"/>
                      </svg>
                    </button>
                  </span>
                </div>
                <div class="flex">
                  <input
                    v-model="newTag"
                    type="text"
                    class="input-modern flex-1"
                    placeholder="Ajouter un tag"
                    @keyup.enter="addTag"
                  >
                  <button
                    @click="addTag"
                    type="button"
                    class="ml-2 px-3 py-2 bg-blue-600 text-white text-xs rounded-lg hover:bg-blue-700"
                  >
                    Ajouter
                  </button>
                </div>
              </div>
            </div>
          </div>
          
          <!-- Right Column - Images & Features -->
          <div class="space-y-4">
            <!-- Featured Image -->
            <div>
              <label class="block text-sm font-medium text-gray-700 mb-2">
                Image principale
              </label>
              <div class="image-upload-zone" @click="triggerImageUpload">
                <input 
                  ref="imageInput" 
                  type="file" 
                  accept="image/*" 
                  class="hidden" 
                  @change="handleImageUpload"
                >
                <div v-if="form.featuredImage" class="aspect-square bg-gray-100 rounded-lg overflow-hidden relative">
                  <img :src="form.featuredImage" alt="Aperçu" class="w-full h-full object-cover">
                  <button
                    @click.stop="form.featuredImage = ''"
                    class="absolute top-2 right-2 p-1 bg-red-500 text-white rounded-full hover:bg-red-600"
                  >
                    <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12"/>
                    </svg>
                  </button>
                </div>
                <div v-else class="aspect-square border-2 border-dashed border-gray-300 rounded-lg flex items-center justify-center cursor-pointer hover:border-blue-400 hover:bg-blue-50 transition-colors">
                  <div class="text-center">
                    <svg class="mx-auto h-12 w-12 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z"/>
                    </svg>
                    <p class="text-sm text-gray-500 mt-2">Cliquer pour ajouter une image</p>
                    <p class="text-xs text-gray-400">PNG, JPG jusqu'à 10MB</p>
                  </div>
                </div>
              </div>
            </div>

            <!-- Additional Images -->
            <div>
              <label class="block text-sm font-medium text-gray-700 mb-2">
                Images supplémentaires
              </label>
              <div class="grid grid-cols-3 gap-2">
                <div
                  v-for="(image, index) in form.images"
                  :key="index"
                  class="aspect-square bg-gray-100 rounded-lg overflow-hidden relative"
                >
                  <img :src="image" alt="Image" class="w-full h-full object-cover">
                  <button
                    @click="removeImage(index)"
                    class="absolute top-1 right-1 p-1 bg-red-500 text-white rounded-full hover:bg-red-600"
                  >
                    <svg class="w-3 h-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12"/>
                    </svg>
                  </button>
                </div>
                <div
                  v-if="form.images.length < 5"
                  @click="triggerAdditionalImageUpload"
                  class="aspect-square border-2 border-dashed border-gray-300 rounded-lg flex items-center justify-center cursor-pointer hover:border-blue-400 hover:bg-blue-50 transition-colors"
                >
                  <svg class="w-8 h-8 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 6v6m0 0v6m0-6h6m-6 0H6"/>
                  </svg>
                </div>
              </div>
              <input 
                ref="additionalImageInput" 
                type="file" 
                accept="image/*" 
                multiple
                class="hidden" 
                @change="handleAdditionalImagesUpload"
              >
            </div>
            
            <!-- Features -->
            <div>
              <label class="block text-sm font-medium text-gray-700 mb-2">
                Caractéristiques clés
              </label>
              <div class="space-y-2">
                <div v-for="(feature, index) in form.features" :key="index" class="flex items-center space-x-2">
                  <input
                    v-model="form.features[index]"
                    type="text"
                    class="input-modern flex-1"
                    placeholder="Caractéristique"
                  >
                  <button
                    @click="removeFeature(index)"
                    class="text-red-600 hover:text-red-700"
                  >
                    <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12"/>
                    </svg>
                  </button>
                </div>
                <button
                  @click="addFeature"
                  type="button"
                  class="text-blue-600 hover:text-blue-700 text-sm font-medium"
                >
                  + Ajouter une caractéristique
                </button>
              </div>
            </div>

            <!-- Inventory -->
            <div class="space-y-3">
              <h4 class="text-sm font-medium text-gray-900">Inventaire</h4>
              
              <div class="flex items-center space-x-3">
                <input
                  v-model="form.trackInventory"
                  type="checkbox"
                  id="trackInventory"
                  class="rounded border-gray-300 text-blue-600 focus:ring-blue-500"
                >
                <label for="trackInventory" class="text-sm text-gray-700">
                  Suivre la quantité en stock
                </label>
              </div>

              <div v-if="form.trackInventory">
                <label class="block text-sm font-medium text-gray-700 mb-2">
                  Quantité en stock
                </label>
                <input
                  v-model.number="form.inventoryQuantity"
                  type="number"
                  min="0"
                  class="input-modern w-full"
                  placeholder="0"
                >
              </div>
            </div>

            <!-- Status -->
            <div class="space-y-3">
              <h4 class="text-sm font-medium text-gray-900">Statut</h4>
              
              <div class="space-y-2">
                <div class="flex items-center space-x-3">
                  <input
                    v-model="form.isActive"
                    type="checkbox"
                    id="isActive"
                    class="rounded border-gray-300 text-blue-600 focus:ring-blue-500"
                  >
                  <label for="isActive" class="text-sm text-gray-700">
                    Produit actif
                  </label>
                </div>

                <div class="flex items-center space-x-3">
                  <input
                    v-model="form.isVisible"
                    type="checkbox"
                    id="isVisible"
                    class="rounded border-gray-300 text-blue-600 focus:ring-blue-500"
                  >
                  <label for="isVisible" class="text-sm text-gray-700">
                    Visible dans le catalogue
                  </label>
                </div>

                <div class="flex items-center space-x-3">
                  <input
                    v-model="form.availableForSale"
                    type="checkbox"
                    id="availableForSale"
                    class="rounded border-gray-300 text-blue-600 focus:ring-blue-500"
                  >
                  <label for="availableForSale" class="text-sm text-gray-700">
                    Disponible à la vente
                  </label>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
      
      <div class="modal-footer">
        <button @click="$emit('close')" class="btn-secondary">
          Annuler
        </button>
        <button 
          @click="handleSubmit" 
          :disabled="!isFormValid || submitting" 
          class="btn-primary"
        >
          {{ submitting ? 'Sauvegarde...' : (product ? 'Mettre à jour' : 'Créer') }} le produit
        </button>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, computed, onMounted, watch } from 'vue'
import { useProducts } from '~~/composables/useProducts'

// ✅ PROPS & EMITS
const props = defineProps<{
  product?: any
}>()

const emit = defineEmits<{
  close: []
  success: [message: string]
}>()

// ✅ COMPOSABLES
const { createProduct, updateProduct } = useProducts()

// ✅ REACTIVE STATE
const submitting = ref(false)
const newTag = ref('')

const form = ref({
  name: '',
  description: '',
  price: 0,
  compareAtPrice: null,
  sku: '',
  category: '',
  tags: [] as string[],
  features: [''] as string[],
  featuredImage: '',
  images: [] as string[],
  weight: null,
  inventoryQuantity: 0,
  trackInventory: false,
  isActive: true,
  isVisible: true,
  availableForSale: true
})

const errors = ref({
  name: '',
  price: ''
})

// File input refs
const imageInput = ref<HTMLInputElement>()
const additionalImageInput = ref<HTMLInputElement>()

// ✅ CATEGORIES
const categories = [
  'Électronique',
  'Vêtements',
  'Maison & Jardin',
  'Sports & Loisirs',
  'Beauté & Santé',
  'Livres',
  'Jouets',
  'Autres'
]

// ✅ COMPUTED
const isFormValid = computed(() => {
  return form.value.name.trim() !== '' && 
         form.value.price > 0 && 
         !errors.value.name && 
         !errors.value.price
})

// ✅ VALIDATION
const validateField = (field: string) => {
  switch (field) {
    case 'name':
      errors.value.name = form.value.name.trim() === '' ? 'Le nom est requis' : ''
      break
    case 'price':
      errors.value.price = form.value.price <= 0 ? 'Le prix doit être supérieur à 0' : ''
      break
  }
}

const validateForm = () => {
  validateField('name')
  validateField('price')
  return isFormValid.value
}

// ✅ FORM ACTIONS
const handleSubmit = async () => {
  if (!validateForm()) return

  submitting.value = true

  try {
    // Clean form data
    const cleanedData = {
      ...form.value,
      features: form.value.features.filter(f => f.trim() !== ''),
      tags: form.value.tags.filter(t => t.trim() !== ''),
      images: form.value.images.filter(img => img.trim() !== ''),
      compareAtPrice: form.value.compareAtPrice || undefined,
      weight: form.value.weight || undefined
    }

    let result
    if (props.product) {
      result = await updateProduct(props.product.id, cleanedData)
    } else {
      result = await createProduct(cleanedData)
    }

    if (result.success) {
      emit('success', props.product ? 'Produit modifié avec succès!' : 'Produit créé avec succès!')
      emit('close')
    } else {
      // Handle error - could show in a toast or form error
      console.error('Product save error:', result.error)
    }
  } catch (error) {
    console.error('Form submit error:', error)
  } finally {
    submitting.value = false
  }
}

// ✅ FEATURES MANAGEMENT
const addFeature = () => {
  form.value.features.push('')
}

const removeFeature = (index: number) => {
  form.value.features.splice(index, 1)
}

// ✅ TAGS MANAGEMENT
const addTag = () => {
  if (newTag.value.trim() !== '' && !form.value.tags.includes(newTag.value.trim())) {
    form.value.tags.push(newTag.value.trim())
    newTag.value = ''
  }
}

const removeTag = (index: number) => {
  form.value.tags.splice(index, 1)
}

// ✅ IMAGE UPLOAD
const triggerImageUpload = () => {
  imageInput.value?.click()
}

const triggerAdditionalImageUpload = () => {
  additionalImageInput.value?.click()
}

const handleImageUpload = (event: Event) => {
  const file = (event.target as HTMLInputElement).files?.[0]
  if (file) {
    const reader = new FileReader()
    reader.onload = (e) => {
      form.value.featuredImage = e.target?.result as string
    }
    reader.readAsDataURL(file)
  }
}

const handleAdditionalImagesUpload = (event: Event) => {
  const files = (event.target as HTMLInputElement).files
  if (files) {
    Array.from(files).forEach(file => {
      if (form.value.images.length < 5) {
        const reader = new FileReader()
        reader.onload = (e) => {
          form.value.images.push(e.target?.result as string)
        }
        reader.readAsDataURL(file)
      }
    })
  }
}

const removeImage = (index: number) => {
  form.value.images.splice(index, 1)
}

// ✅ INIT FORM
const initForm = () => {
  if (props.product) {
    form.value = {
      name: props.product.name || '',
      description: props.product.description || '',
      price: props.product.price || 0,
      compareAtPrice: props.product.compareAtPrice || null,
      sku: props.product.sku || '',
      category: props.product.category || '',
      tags: [...(props.product.tags || [])],
      features: [...(props.product.features || [''])],
      featuredImage: props.product.featuredImage || '',
      images: [...(props.product.images || [])],
      weight: props.product.weight || null,
      inventoryQuantity: props.product.inventoryQuantity || 0,
      trackInventory: props.product.trackInventory || false,
      isActive: props.product.isActive !== false,
      isVisible: props.product.isVisible !== false,
      availableForSale: props.product.availableForSale !== false
    }
  } else {
    // Reset for new product
    form.value = {
      name: '',
      description: '',
      price: 0,
      compareAtPrice: null,
      sku: '',
      category: '',
      tags: [],
      features: [''],
      featuredImage: '',
      images: [],
      weight: null,
      inventoryQuantity: 0,
      trackInventory: false,
      isActive: true,
      isVisible: true,
      availableForSale: true
    }
  }
}

// ✅ LIFECYCLE
onMounted(() => {
  initForm()
})

watch(() => props.product, () => {
  initForm()
})
</script>

<style scoped>
/* ✅ MODAL STYLES */
.modal-overlay {
  @apply fixed inset-0 z-50 overflow-y-auto bg-gray-900 bg-opacity-50 backdrop-blur-sm flex items-center justify-center p-4;
}

.modal-content {
  @apply bg-white rounded-xl shadow-xl max-w-2xl w-full max-h-[95vh] overflow-hidden;
}

.modal-large {
  @apply max-w-5xl;
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

.modal-footer {
  @apply flex items-center justify-end space-x-3 p-6 border-t border-gray-200;
}

/* ✅ FORM STYLES */
.input-modern {
  @apply px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-colors text-sm;
}

.btn-primary {
  @apply px-4 py-2 bg-blue-600 text-white text-sm font-medium rounded-lg hover:bg-blue-700 disabled:opacity-50 transition-colors;
}

.btn-secondary {
  @apply px-4 py-2 border border-gray-300 rounded-lg text-sm font-medium text-gray-700 bg-white hover:bg-gray-50 transition-colors;
}

.image-upload-zone {
  @apply cursor-pointer;
}
</style>