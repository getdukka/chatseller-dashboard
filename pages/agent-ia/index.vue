<!-- pages/agent-ia/index.vue -->
<!--
  Page de redirection automatique vers la Vendeuse IA de l'utilisateur.
  Dans le modèle single-agent, chaque utilisateur a une seule Vendeuse IA
  créée lors de l'onboarding. Cette page redirige vers sa page de gestion.
-->
<template>
  <div class="min-h-screen bg-gradient-to-br from-rose-50 via-pink-50 to-purple-50 flex items-center justify-center">
    <!-- État de chargement -->
    <div v-if="loading" class="text-center">
      <div class="w-16 h-16 mx-auto mb-6 rounded-full border-4 border-rose-200 border-t-rose-500 animate-spin"></div>
      <p class="text-gray-600 font-medium">Chargement de votre Vendeuse IA...</p>
      <p class="text-sm text-gray-500 mt-2">Un instant s'il vous plaît</p>
    </div>

    <!-- État d'erreur : pas d'agent trouvé -->
    <div v-else-if="!loading && !agentId" class="text-center max-w-md mx-auto px-4">
      <div class="bg-white/80 backdrop-blur-sm rounded-2xl p-8 shadow-lg border border-white/60">
        <div class="text-5xl mb-6">💅</div>
        <h2 class="text-xl font-bold text-gray-900 mb-3">Aucune Vendeuse IA trouvée</h2>
        <p class="text-gray-600 mb-6">
          Il semble que vous n'ayez pas encore créé votre Vendeuse IA.
          Complétez la configuration pour commencer.
        </p>
        <NuxtLink
          to="/onboarding"
          class="inline-flex items-center px-6 py-3 bg-gradient-to-r from-rose-500 to-pink-500 text-white font-medium rounded-xl hover:opacity-90 transition-all shadow-lg"
        >
          <svg class="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 6v6m0 0v6m0-6h6m-6 0H6"/>
          </svg>
          Créer ma Vendeuse IA
        </NuxtLink>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, onMounted } from 'vue'
import { useRouter } from 'vue-router'
import { useAuthStore } from '~/stores/auth'

// Page metadata
definePageMeta({
  middleware: 'auth',
  layout: 'default'
})

// Composables
const router = useRouter()
const authStore = useAuthStore()

// State
const loading = ref(true)
const agentId = ref<string | null>(null)

// Récupérer l'agent de l'utilisateur et rediriger
const loadAndRedirect = async () => {
  try {
    loading.value = true

    const config = useRuntimeConfig()
    const baseURL = config.public.apiBaseUrl

    const response = await $fetch('/api/v1/agents', {
      method: 'GET',
      baseURL,
      headers: {
        'Authorization': `Bearer ${authStore.token}`,
        'Content-Type': 'application/json'
      }
    }) as { success: boolean; data: any[] }

    if (response.success && response.data && response.data.length > 0) {
      // Prendre le premier agent (modèle single-agent)
      const agent = response.data[0]
      agentId.value = agent.id

      // Redirection immédiate vers la page de détail
      await router.replace(`/agent-ia/${agent.id}`)
    } else {
      // Pas d'agent trouvé - afficher le message
      loading.value = false
    }
  } catch (error) {
    console.error('Erreur lors du chargement de l\'agent:', error)
    loading.value = false
  }
}

onMounted(() => {
  loadAndRedirect()
})
</script>

<style scoped>
@keyframes spin {
  from {
    transform: rotate(0deg);
  }
  to {
    transform: rotate(360deg);
  }
}

.animate-spin {
  animation: spin 1s linear infinite;
}
</style>
