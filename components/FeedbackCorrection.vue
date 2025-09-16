<!-- components/FeedbackCorrection.vue -->

<template>
  <div class="feedback-correction">
    <!-- ✅ BOUTONS FEEDBACK RAPIDE -->
    <div v-if="!showDetailedForm" class="flex items-center space-x-2 mt-2">
      <!-- Bouton feedback positif -->
      <button
        @click="submitQuickFeedback('positive')"
        :disabled="loading"
        class="inline-flex items-center px-2 py-1 text-xs font-medium rounded-md transition-colors duration-200"
        :class="feedback?.feedbackType === 'validation' 
          ? 'bg-green-100 text-green-800 ring-1 ring-green-600' 
          : 'bg-gray-100 text-gray-700 hover:bg-green-50 hover:text-green-800'"
      >
        <Icon name="heroicons:hand-thumb-up" class="w-3 h-3 mr-1" />
        <span>Utile</span>
      </button>

      <!-- Bouton feedback négatif -->
      <button
        @click="showDetailedForm = true"
        :disabled="loading"
        class="inline-flex items-center px-2 py-1 text-xs font-medium rounded-md transition-colors duration-200"
        :class="feedback?.feedbackType === 'negative' 
          ? 'bg-red-100 text-red-800 ring-1 ring-red-600' 
          : 'bg-gray-100 text-gray-700 hover:bg-red-50 hover:text-red-800'"
      >
        <Icon name="heroicons:hand-thumb-down" class="w-3 h-3 mr-1" />
        <span>À corriger</span>
      </button>

      <!-- Bouton correction rapide -->
      <button
        @click="showDetailedForm = true; feedbackType = 'correction'"
        :disabled="loading"
        class="inline-flex items-center px-2 py-1 text-xs font-medium rounded-md bg-gray-100 text-gray-700 hover:bg-blue-50 hover:text-blue-800 transition-colors duration-200"
      >
        <Icon name="heroicons:pencil-square" class="w-3 h-3 mr-1" />
        <span>Corriger</span>
      </button>
    </div>

    <!-- ✅ FORMULAIRE FEEDBACK DÉTAILLÉ -->
    <div v-if="showDetailedForm" class="mt-4 p-4 bg-gray-50 rounded-lg border">
      <div class="flex items-center justify-between mb-3">
        <h4 class="text-sm font-medium text-gray-900">
          {{ feedbackType === 'correction' ? 'Corriger la réponse' : 'Signaler un problème' }}
        </h4>
        <button
          @click="closeForm"
          class="text-gray-400 hover:text-gray-600"
        >
          <Icon name="heroicons:x-mark" class="w-4 h-4" />
        </button>
      </div>

      <form @submit.prevent="submitDetailedFeedback" class="space-y-4">
        <!-- Type de feedback -->
        <div>
          <label class="text-xs font-medium text-gray-700 mb-1 block">Type de problème</label>
          <select
            v-model="feedbackType"
            class="w-full text-sm border-gray-300 rounded-md focus:ring-pink-500 focus:border-pink-500"
          >
            <option value="correction">Correction nécessaire</option>
            <option value="improvement">Amélioration suggérée</option>
            <option value="negative">Réponse inappropriée</option>
          </select>
        </div>

        <!-- Note (optionnel) -->
        <div v-if="feedbackType !== 'correction'">
          <label class="text-xs font-medium text-gray-700 mb-1 block">Note (optionnel)</label>
          <div class="flex space-x-1">
            <button
              v-for="star in 5"
              :key="star"
              type="button"
              @click="rating = star"
              class="text-lg focus:outline-none transition-colors duration-200"
              :class="star <= (rating || 0) ? 'text-yellow-400' : 'text-gray-300 hover:text-yellow-200'"
            >
              ⭐
            </button>
          </div>
        </div>

        <!-- Réponse corrigée (si correction) -->
        <div v-if="feedbackType === 'correction'">
          <label class="text-xs font-medium text-gray-700 mb-1 block">
            Comment l'agent aurait-il dû répondre ? <span class="text-red-500">*</span>
          </label>
          <textarea
            v-model="correctedResponse"
            rows="4"
            placeholder="Rédigez la réponse idéale que l'agent aurait dû donner..."
            class="w-full text-sm border-gray-300 rounded-md focus:ring-pink-500 focus:border-pink-500"
            required
          ></textarea>
        </div>

        <!-- ✅ CORRECTION : Tags problèmes beauté avec icônes gérées -->
        <div>
          <label class="text-xs font-medium text-gray-700 mb-2 block">
            Aspects à améliorer ({{ selectedTags.length }}/3)
          </label>
          <div class="grid grid-cols-2 gap-2 max-h-32 overflow-y-auto">
            <button
              v-for="tag in beautyTagsWithIcons"
              :key="tag.id"
              type="button"
              @click="toggleTag(tag.id)"
              :disabled="selectedTags.length >= 3 && !selectedTags.includes(tag.id)"
              class="text-left px-2 py-1 text-xs rounded border transition-colors duration-200"
              :class="selectedTags.includes(tag.id) 
                ? 'bg-pink-100 border-pink-300 text-pink-800' 
                : 'bg-white border-gray-200 text-gray-700 hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed'"
            >
              <span class="mr-1">{{ tag.icon }}</span>
              {{ tag.label }}
            </button>
          </div>
        </div>

        <!-- Commentaire libre -->
        <div>
          <label class="text-xs font-medium text-gray-700 mb-1 block">
            Commentaire (optionnel)
          </label>
          <textarea
            v-model="comment"
            rows="2"
            placeholder="Précisions supplémentaires..."
            class="w-full text-sm border-gray-300 rounded-md focus:ring-pink-500 focus:border-pink-500"
          ></textarea>
        </div>

        <!-- Options avancées -->
        <div class="flex items-center space-x-4">
          <label class="inline-flex items-center">
            <input
              v-model="isPublic"
              type="checkbox"
              class="rounded border-gray-300 text-pink-600 shadow-sm focus:border-pink-300 focus:ring focus:ring-pink-200 focus:ring-opacity-50"
            />
            <span class="ml-2 text-xs text-gray-600">
              Partager anonymement pour améliorer l'IA
            </span>
          </label>
        </div>

        <!-- Actions -->
        <div class="flex justify-end space-x-2 pt-2 border-t">
          <button
            type="button"
            @click="closeForm"
            :disabled="loading"
            class="px-3 py-1.5 text-xs font-medium text-gray-700 bg-white border border-gray-300 rounded-md hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-pink-500 disabled:opacity-50"
          >
            Annuler
          </button>
          <button
            type="submit"
            :disabled="loading || (feedbackType === 'correction' && !correctedResponse?.trim())"
            class="px-3 py-1.5 text-xs font-medium text-white bg-pink-600 border border-transparent rounded-md hover:bg-pink-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-pink-500 disabled:opacity-50 disabled:cursor-not-allowed"
          >
            <span v-if="loading" class="inline-flex items-center">
              <Icon name="heroicons:arrow-path" class="w-3 h-3 mr-1 animate-spin" />
              Envoi...
            </span>
            <span v-else>
              {{ feedbackType === 'correction' ? 'Soumettre correction' : 'Envoyer feedback' }}
            </span>
          </button>
        </div>
      </form>
    </div>

    <!-- ✅ FEEDBACK CONFIRMÉ -->
    <div v-if="feedback && !showDetailedForm" class="mt-2 p-2 bg-green-50 rounded border border-green-200">
      <div class="flex items-center text-xs text-green-800">
        <Icon name="heroicons:check-circle" class="w-4 h-4 mr-1 text-green-600" />
        <span>
          Merci pour votre retour ! 
          {{ feedback.feedbackType === 'validation' ? 'Réponse marquée comme utile.' : 'Votre signalement a été enregistré.' }}
        </span>
        <button
          @click="removeFeedback"
          class="ml-auto text-green-600 hover:text-green-800"
        >
          <Icon name="heroicons:x-mark" class="w-3 h-3" />
        </button>
      </div>
    </div>

    <!-- ✅ ERREUR -->
    <div v-if="error" class="mt-2 p-2 bg-red-50 rounded border border-red-200">
      <div class="flex items-center text-xs text-red-800">
        <Icon name="heroicons:exclamation-triangle" class="w-4 h-4 mr-1 text-red-600" />
        <span>{{ error }}</span>
        <button
          @click="error = null"
          class="ml-auto text-red-600 hover:text-red-800"
        >
          <Icon name="heroicons:x-mark" class="w-3 h-3" />
        </button>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, computed, onMounted, watch } from 'vue'
import { useAIFeedback } from '~/composables/useAIFeedback'

// ✅ PROPS
interface Props {
  messageId: string
  agentId: string
  conversationId: string
  originalResponse: string
  existingFeedback?: any
}

const props = defineProps<Props>()

// ✅ EMITS
const emit = defineEmits<{
  close: []
  'feedback-submitted': [feedback: any]
}>()

// ✅ COMPOSABLES
const { 
  submitFeedback, 
  deleteFeedback, 
  loading, 
  error: feedbackError,
  beautyFeedbackTags 
} = useAIFeedback()

// ✅ STATE RÉACTIF
const showDetailedForm = ref(false)
const feedbackType = ref<'correction' | 'improvement' | 'negative'>('improvement')
const rating = ref<number | null>(null)
const correctedResponse = ref('')
const comment = ref('')
const selectedTags = ref<string[]>([])
const isPublic = ref(false)
const feedback = ref(props.existingFeedback || null)
const error = ref<string | null>(null)

// ✅ CORRECTION : Tags beauté avec icônes
const beautyTagsWithIcons = computed(() => {
  // Mapping des icônes par tag ID
  const tagIcons: Record<string, string> = {
    'product_knowledge': '📚',
    'skin_diagnosis': '🔍',
    'makeup_technique': '💄',
    'fragrance_matching': '🌸',
    'hair_analysis': '💇‍♀️',
    'ingredient_explanation': '🧪',
    'routine_building': '📋',
    'color_matching': '🎨',
    'seasonal_advice': '🍂',
    'price_justification': '💰',
    'upsell_relevance': '🛍️',
    'tone_appropriateness': '💬',
    'response_length': '📏',
    'personalization': '👤',
    'urgency_creation': '⚡'
  }

  return beautyFeedbackTags.map(tag => ({
    ...tag,
    icon: tagIcons[tag.id] || '🏷️' // Icône par défaut si pas trouvée
  }))
})

// ✅ MÉTHODES
const toggleTag = (tagId: string) => {
  const index = selectedTags.value.indexOf(tagId)
  if (index > -1) {
    selectedTags.value.splice(index, 1)
  } else if (selectedTags.value.length < 3) {
    selectedTags.value.push(tagId)
  }
}

const submitQuickFeedback = async (type: 'positive' | 'negative') => {
  if (feedback.value) return // Déjà un feedback

  try {
    error.value = null
    
    const feedbackData = {
      messageId: props.messageId,
      agentId: props.agentId,
      conversationId: props.conversationId,
      originalResponse: props.originalResponse,
      feedbackType: type === 'positive' ? 'validation' as const : 'negative' as const,
      feedbackRating: type === 'positive' ? 5 : 1,
      isPublic: false
    }

    const result = await submitFeedback(feedbackData)
    
    if (result.success) {
      feedback.value = result.data
      emit('feedback-submitted', result.data)
      console.log('✅ Feedback rapide soumis:', type)
    } else {
      throw new Error(result.error || 'Erreur lors de l\'envoi du feedback')
    }
  } catch (err: any) {
    console.error('❌ Erreur feedback rapide:', err)
    error.value = err.message || 'Erreur lors de l\'envoi du feedback'
  }
}

const submitDetailedFeedback = async () => {
  if (feedback.value) return // Déjà un feedback

  try {
    error.value = null
    
    // Validation
    if (feedbackType.value === 'correction' && !correctedResponse.value?.trim()) {
      error.value = 'La réponse corrigée est requise'
      return
    }

    const feedbackData = {
      messageId: props.messageId,
      agentId: props.agentId,
      conversationId: props.conversationId,
      originalResponse: props.originalResponse,
      correctedResponse: feedbackType.value === 'correction' ? correctedResponse.value.trim() : undefined,
      feedbackType: feedbackType.value,
      feedbackRating: rating.value,
      feedbackComment: comment.value.trim() || undefined,
      feedbackTags: selectedTags.value,
      isPublic: isPublic.value
    }

    const result = await submitFeedback(feedbackData)
    
    if (result.success) {
      feedback.value = result.data
      showDetailedForm.value = false
      emit('feedback-submitted', result.data)
      resetForm()
      console.log('✅ Feedback détaillé soumis:', feedbackType.value)
    } else {
      throw new Error(result.error || 'Erreur lors de l\'envoi du feedback')
    }
  } catch (err: any) {
    console.error('❌ Erreur feedback détaillé:', err)
    error.value = err.message || 'Erreur lors de l\'envoi du feedback'
  }
}

const removeFeedback = async () => {
  if (!feedback.value?.id) return

  try {
    error.value = null
    
    const result = await deleteFeedback(feedback.value.id)
    
    if (result.success) {
      feedback.value = null
      console.log('✅ Feedback supprimé')
    } else {
      throw new Error(result.error || 'Erreur lors de la suppression')
    }
  } catch (err: any) {
    console.error('❌ Erreur suppression feedback:', err)
    error.value = err.message || 'Erreur lors de la suppression'
  }
}

const closeForm = () => {
  showDetailedForm.value = false
  resetForm()
}

const resetForm = () => {
  feedbackType.value = 'improvement'
  rating.value = null
  correctedResponse.value = ''
  comment.value = ''
  selectedTags.value = []
  isPublic.value = false
  error.value = null
}

// ✅ WATCHERS
watch(() => feedbackError.value, (newError) => {
  if (newError) {
    error.value = newError
  }
})

// ✅ LIFECYCLE
onMounted(() => {
  // Si un feedback existe déjà, l'afficher
  if (props.existingFeedback) {
    feedback.value = props.existingFeedback
  }
})
</script>

<style scoped>
/* Styles personnalisés pour une meilleure UX */
.feedback-correction {
  @apply transition-all duration-200;
}

.feedback-correction button:focus {
  @apply outline-none ring-2 ring-offset-1 ring-pink-500;
}

.feedback-correction textarea:focus,
.feedback-correction select:focus,
.feedback-correction input:focus {
  @apply ring-2 ring-pink-500 border-pink-500;
}

/* Animation pour l'apparition du formulaire */
.feedback-correction .mt-4 {
  animation: slideDown 0.3s ease-out;
}

@keyframes slideDown {
  from {
    opacity: 0;
    transform: translateY(-10px);
  }
  to {
    opacity: 1;
    transform: translateY(0);
  }
}

/* Style pour les tags sélectionnés */
.feedback-correction button.bg-pink-100 {
  @apply ring-1 ring-pink-300;
}

/* Hover states améliorés */
.feedback-correction button:hover:not(:disabled) {
  @apply transform scale-105 transition-transform duration-150;
}

/* Désactivation visuelle pour les boutons */
.feedback-correction button:disabled {
  @apply cursor-not-allowed opacity-50 transform-none;
}
</style>