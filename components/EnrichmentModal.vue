<!-- components/EnrichmentModal.vue -->
<template>
  <div class="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 overflow-y-auto">
    <div class="bg-white rounded-xl p-6 max-w-2xl w-full mx-4 my-8">
      <h3 class="text-lg font-semibold mb-4">
        {{ product ? `Enrichir "${product.name}"` : 'Enrichir un produit' }}
      </h3>
      
      <form @submit.prevent="handleSubmit">
        <div class="grid grid-cols-1 md:grid-cols-2 gap-4 mb-6">
          <div>
            <label class="block text-sm font-medium mb-2">Catégorie beauté</label>
            <select v-model="form.beauty_category" class="w-full border rounded-lg px-3 py-2">
              <option value="skincare">Soins visage</option>
              <option value="makeup">Maquillage</option>
              <option value="fragrance">Parfums</option>
              <option value="haircare">Soins cheveux</option>
              <option value="bodycare">Soins corps</option>
            </select>
          </div>
          
          <div>
            <label class="block text-sm font-medium mb-2">Types de peau</label>
            <div class="space-y-1">
              <label v-for="type in skinTypes" :key="type" class="flex items-center">
                <input 
                  type="checkbox" 
                  :value="type" 
                  v-model="form.skin_types"
                  class="mr-2"
                >
                {{ type }}
              </label>
            </div>
          </div>
        </div>
        
        <div class="mb-4">
          <label class="block text-sm font-medium mb-2">Ingrédients clés</label>
          <input 
            v-model="ingredientsInput"
            @keyup.enter="addIngredient"
            class="w-full border rounded-lg px-3 py-2"
            placeholder="Tapez un ingrédient et appuyez sur Entrée"
          >
          <div class="flex flex-wrap gap-2 mt-2">
            <span 
              v-for="ingredient in form.key_ingredients" 
              :key="ingredient"
              class="bg-blue-100 text-blue-800 px-2 py-1 rounded text-sm"
            >
              {{ ingredient }}
              <button @click="removeIngredient(ingredient)" class="ml-1 text-blue-600">×</button>
            </span>
          </div>
        </div>
        
        <div class="mb-4">
          <label class="block text-sm font-medium mb-2">Bienfaits</label>
          <textarea 
            v-model="benefitsInput"
            class="w-full border rounded-lg px-3 py-2"
            rows="3"
            placeholder="Hydratation, Anti-âge, Éclat (séparez par des virgules)"
          ></textarea>
        </div>
        
        <div class="mb-6">
          <label class="block text-sm font-medium mb-2">Notes d'expert</label>
          <textarea 
            v-model="form.expert_notes"
            class="w-full border rounded-lg px-3 py-2"
            rows="3"
            placeholder="Conseils d'utilisation et recommandations d'expert..."
          ></textarea>
        </div>
        
        <div class="flex justify-end space-x-3">
          <button 
            type="button" 
            @click="$emit('close')"
            class="px-4 py-2 border rounded-lg hover:bg-gray-50"
          >
            Annuler
          </button>
          <button 
            type="submit"
            class="px-4 py-2 bg-rose-600 text-white rounded-lg hover:bg-rose-700"
          >
            Sauvegarder
          </button>
        </div>
      </form>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, watch } from 'vue'

const props = defineProps(['product'])
const emit = defineEmits(['close', 'save'])

const skinTypes = ['Normale', 'Sèche', 'Grasse', 'Mixte', 'Sensible', 'Mature']

const form = ref({
  beauty_category: 'skincare',
  skin_types: [],
  key_ingredients: [],
  benefits: [],
  expert_notes: ''
})

const ingredientsInput = ref('')
const benefitsInput = ref('')

// Pré-remplir si produit existant
if (props.product?.beauty_data) {
  form.value = { ...props.product.beauty_data }
  benefitsInput.value = form.value.benefits?.join(', ') || ''
}

const addIngredient = () => {
  if (ingredientsInput.value.trim()) {
    form.value.key_ingredients.push(ingredientsInput.value.trim())
    ingredientsInput.value = ''
  }
}

const removeIngredient = (ingredient: string) => {
  const index = form.value.key_ingredients.indexOf(ingredient)
  if (index > -1) {
    form.value.key_ingredients.splice(index, 1)
  }
}

watch(benefitsInput, (newValue) => {
  form.value.benefits = newValue.split(',').map(b => b.trim()).filter(b => b)
})

const handleSubmit = () => {
  emit('save', form.value)
}
</script>