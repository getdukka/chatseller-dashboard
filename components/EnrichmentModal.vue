<!-- components/EnrichmentModal.vue -->
<template>
  <div class="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 overflow-y-auto">
    <div class="bg-white rounded-xl p-6 max-w-2xl w-full mx-4 my-8">
      <h3 class="text-lg font-semibold mb-4">
        {{ product ? `Enrichir "${product.name}"` : 'Enrichir un produit' }}
      </h3>

      <form @submit.prevent="handleSubmit">
        <div class="grid grid-cols-1 md:grid-cols-2 gap-4 mb-6">
          <!-- Ingrédients clés -->
          <div>
            <label class="block text-sm font-medium mb-2">Ingrédients clés</label>
            <input
              v-model="ingredientsInput"
              @keyup.enter="addIngredient"
              class="w-full border rounded-lg px-3 py-2"
              placeholder="Tapez et appuyez sur Entrée"
            >
            <div class="flex flex-wrap gap-2 mt-2">
              <span
                v-for="ingredient in form.key_ingredients"
                :key="ingredient"
                class="bg-rose-100 text-rose-800 px-2 py-1 rounded text-sm"
              >
                {{ ingredient }}
                <button type="button" @click="removeIngredient(ingredient)" class="ml-1 text-rose-600">×</button>
              </span>
            </div>
          </div>

          <!-- Types de peau - Seulement pour skincare, makeup, bodycare -->
          <div v-if="showSkinTypes">
            <label class="block text-sm font-medium mb-2">Types de peau adaptés</label>
            <div class="space-y-1 max-h-40 overflow-y-auto">
              <label v-for="type in skinTypes" :key="type" class="flex items-center">
                <input
                  type="checkbox"
                  :value="type"
                  v-model="form.skin_types"
                  class="mr-2 text-rose-600 focus:ring-rose-500"
                >
                {{ type }}
              </label>
            </div>
          </div>

          <!-- Types de cheveux - Seulement pour haircare -->
          <div v-if="showHairTypes">
            <label class="block text-sm font-medium mb-2">Types de cheveux adaptés</label>
            <div class="space-y-1 max-h-40 overflow-y-auto">
              <label v-for="type in hairTypes" :key="type" class="flex items-center">
                <input
                  type="checkbox"
                  :value="type"
                  v-model="form.hair_types"
                  class="mr-2 text-rose-600 focus:ring-rose-500"
                >
                {{ type }}
              </label>
            </div>
          </div>
        </div>

        <div class="mb-4">
          <label class="block text-sm font-medium mb-2">Bienfaits</label>
          <textarea
            v-model="benefitsInput"
            class="w-full border rounded-lg px-3 py-2"
            rows="2"
            :placeholder="benefitsPlaceholder"
          ></textarea>
        </div>

        <div class="mb-6">
          <label class="block text-sm font-medium mb-2">Notes d'expert</label>
          <textarea
            v-model="form.expert_notes"
            class="w-full border rounded-lg px-3 py-2"
            rows="3"
            placeholder="Conseils d'utilisation, recommandations..."
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
import { ref, computed, watch } from 'vue'
import { useAuthStore } from '~/stores/auth'

const props = defineProps(['product'])
const emit = defineEmits(['close', 'save'])

const authStore = useAuthStore()

// Déterminer le domaine de la marque
const shopCategory = computed(() => authStore.user?.shop?.beauty_category || 'multi')

// Afficher les types de peau pour skincare, makeup, bodycare, ou multi
const showSkinTypes = computed(() => {
  const cat = shopCategory.value
  return ['skincare', 'makeup', 'bodycare', 'multi'].includes(cat)
})

// Afficher les types de cheveux pour haircare ou multi
const showHairTypes = computed(() => {
  const cat = shopCategory.value
  return ['haircare', 'multi'].includes(cat)
})

// Placeholder adapté au domaine
const benefitsPlaceholder = computed(() => {
  const cat = shopCategory.value
  if (cat === 'haircare') return 'Hydratation, Brillance, Démêlage (séparez par des virgules)'
  if (cat === 'skincare') return 'Hydratation, Anti-âge, Éclat (séparez par des virgules)'
  if (cat === 'fragrance') return 'Notes de tête, Notes de coeur, Tenue (séparez par des virgules)'
  return 'Bienfaits principaux (séparez par des virgules)'
})

const skinTypes = ['Normale', 'Sèche', 'Grasse', 'Mixte', 'Sensible', 'Mature']
const hairTypes = ['Normaux', 'Secs', 'Gras', 'Bouclés', 'Crépus', 'Colorés', 'Abîmés', 'Fins']

const form = ref({
  key_ingredients: [] as string[],
  skin_types: [] as string[],
  hair_types: [] as string[],
  benefits: [] as string[],
  expert_notes: ''
})

const ingredientsInput = ref('')
const benefitsInput = ref('')

// Pré-remplir si produit existant
if (props.product?.beauty_data) {
  const data = props.product.beauty_data
  form.value = {
    key_ingredients: data.key_ingredients || [],
    skin_types: data.skin_types || [],
    hair_types: data.hair_types || [],
    benefits: data.benefits || [],
    expert_notes: data.expert_notes || ''
  }
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
  // Nettoyer les données non pertinentes selon le domaine
  const data: any = {
    key_ingredients: form.value.key_ingredients,
    benefits: form.value.benefits,
    expert_notes: form.value.expert_notes
  }

  // Inclure seulement les données pertinentes au domaine
  if (showSkinTypes.value && form.value.skin_types.length > 0) {
    data.skin_types = form.value.skin_types
  }
  if (showHairTypes.value && form.value.hair_types.length > 0) {
    data.hair_types = form.value.hair_types
  }

  emit('save', data)
}
</script>
