<!-- pages/onboarding.vue - PAGE D'ONBOARDING PROFESSIONNELLE -->
<template>
  <div class="min-h-screen bg-gradient-to-br from-blue-50 via-white to-blue-50">
    <!-- Header simple -->
    <header class="relative z-10 bg-white/80 backdrop-blur-sm border-b border-gray-100">
      <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div class="flex justify-center items-center h-16">
          <div class="flex items-center space-x-3">
            <div class="flex h-8 w-8 items-center justify-center rounded-lg bg-blue-600">
              <span class="text-sm font-bold text-white">CS</span>
            </div>
            <span class="text-xl font-bold text-gray-900">ChatSeller</span>
          </div>
        </div>
      </div>
    </header>

    <!-- Contenu principal -->
    <div class="flex-1 flex flex-col justify-center py-12 px-4 sm:px-6 lg:px-8">
      <div class="mx-auto max-w-2xl w-full">
        
        <!-- Progress bar -->
        <div class="mb-8">
          <div class="flex items-center justify-between text-sm font-medium text-gray-600 mb-2">
            <span>Étape {{ currentStep }} sur 3</span>
            <span>{{ Math.round((currentStep / 3) * 100) }}% terminé</span>
          </div>
          <div class="w-full bg-gray-200 rounded-full h-2">
            <div 
              class="bg-blue-600 h-2 rounded-full transition-all duration-500 ease-in-out"
              :style="{ width: `${(currentStep / 3) * 100}%` }"
            ></div>
          </div>
        </div>

        <!-- Étape 1: Informations personnelles -->
        <div v-if="currentStep === 1" class="bg-white rounded-xl shadow-xl border border-gray-100 p-8">
          <div class="text-center mb-8">
            <div class="flex justify-center mb-4">
              <div class="w-16 h-16 bg-blue-100 rounded-full flex items-center justify-center">
                <svg class="w-8 h-8 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z"/>
                </svg>
              </div>
            </div>
            <h2 class="text-2xl font-bold text-gray-900">Parlez-nous de vous</h2>
            <p class="mt-2 text-gray-600">Ces informations nous aident à personnaliser votre expérience</p>
          </div>

          <form @submit.prevent="nextStep" class="space-y-6">
            <div class="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <label for="firstName" class="block text-sm font-medium text-gray-700 mb-2">
                  Prénom *
                </label>
                <input
                  id="firstName"
                  v-model="form.firstName"
                  type="text"
                  required
                  class="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-colors"
                  placeholder="Jean"
                />
              </div>

              <div>
                <label for="lastName" class="block text-sm font-medium text-gray-700 mb-2">
                  Nom *
                </label>
                <input
                  id="lastName"
                  v-model="form.lastName"
                  type="text"
                  required
                  class="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-colors"
                  placeholder="Dupont"
                />
              </div>
            </div>

            <div>
              <label for="jobTitle" class="block text-sm font-medium text-gray-700 mb-2">
                Votre fonction
              </label>
              <select
                id="jobTitle"
                v-model="form.jobTitle"
                class="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-colors"
              >
                <option value="">Sélectionnez votre fonction</option>
                <option value="ceo">CEO / Dirigeant</option>
                <option value="marketing">Responsable Marketing</option>
                <option value="ecommerce">Responsable E-commerce</option>
                <option value="sales">Responsable Commercial</option>
                <option value="developer">Développeur</option>
                <option value="other">Autre</option>
              </select>
            </div>

            <div class="flex justify-end">
              <button
                type="submit"
                class="px-6 py-3 bg-blue-600 text-white font-medium rounded-lg hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 transition-colors"
              >
                Continuer
              </button>
            </div>
          </form>
        </div>

        <!-- Étape 2: Informations entreprise -->
        <div v-if="currentStep === 2" class="bg-white rounded-xl shadow-xl border border-gray-100 p-8">
          <div class="text-center mb-8">
            <div class="flex justify-center mb-4">
              <div class="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center">
                <svg class="w-8 h-8 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-4m-5 0H9m0 0H5m0 0H3m2 0v-4m0 4h4"/>
                </svg>
              </div>
            </div>
            <h2 class="text-2xl font-bold text-gray-900">Votre entreprise</h2>
            <p class="mt-2 text-gray-600">Aidez-nous à configurer ChatSeller pour votre activité</p>
          </div>

          <form @submit.prevent="nextStep" class="space-y-6">
            <div>
              <label for="company" class="block text-sm font-medium text-gray-700 mb-2">
                Nom de l'entreprise *
              </label>
              <input
                id="company"
                v-model="form.company"
                type="text"
                required
                class="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-colors"
                placeholder="Mon E-commerce"
              />
            </div>

            <div>
              <label for="website" class="block text-sm font-medium text-gray-700 mb-2">
                Site web
              </label>
              <input
                id="website"
                v-model="form.website"
                type="url"
                class="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-colors"
                placeholder="https://mon-site.com"
              />
            </div>

            <div>
              <label for="industry" class="block text-sm font-medium text-gray-700 mb-2">
                Secteur d'activité
              </label>
              <select
                id="industry"
                v-model="form.industry"
                class="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-colors"
              >
                <option value="">Sélectionnez votre secteur</option>
                <option value="fashion">Mode et vêtements</option>
                <option value="beauty">Beauté et cosmétiques</option>
                <option value="electronics">Électronique et high-tech</option>
                <option value="home">Maison et décoration</option>
                <option value="sports">Sport et fitness</option>
                <option value="books">Livres et média</option>
                <option value="food">Alimentation</option>
                <option value="health">Santé et bien-être</option>
                <option value="automotive">Automobile</option>
                <option value="jewelry">Bijouterie</option>
                <option value="toys">Jouets et enfants</option>
                <option value="other">Autre</option>
              </select>
            </div>

            <div>
              <label for="teamSize" class="block text-sm font-medium text-gray-700 mb-2">
                Taille de l'équipe
              </label>
              <select
                id="teamSize"
                v-model="form.teamSize"
                class="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-colors"
              >
                <option value="">Sélectionnez la taille</option>
                <option value="solo">Solo (juste moi)</option>
                <option value="small">2-10 personnes</option>
                <option value="medium">11-50 personnes</option>
                <option value="large">51-200 personnes</option>
                <option value="enterprise">200+ personnes</option>
              </select>
            </div>

            <div class="flex justify-between">
              <button
                type="button"
                @click="previousStep"
                class="px-6 py-3 bg-gray-100 text-gray-700 font-medium rounded-lg hover:bg-gray-200 focus:outline-none focus:ring-2 focus:ring-gray-500 focus:ring-offset-2 transition-colors"
              >
                Retour
              </button>
              <button
                type="submit"
                class="px-6 py-3 bg-blue-600 text-white font-medium rounded-lg hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 transition-colors"
              >
                Continuer
              </button>
            </div>
          </form>
        </div>

        <!-- Étape 3: Plateforme e-commerce -->
        <div v-if="currentStep === 3" class="bg-white rounded-xl shadow-xl border border-gray-100 p-8">
          <div class="text-center mb-8">
            <div class="flex justify-center mb-4">
              <div class="w-16 h-16 bg-purple-100 rounded-full flex items-center justify-center">
                <svg class="w-8 h-8 text-purple-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M16 11V7a4 4 0 00-8 0v4M5 9h14l1 12H4L5 9z"/>
                </svg>
              </div>
            </div>
            <h2 class="text-2xl font-bold text-gray-900">Votre plateforme e-commerce</h2>
            <p class="mt-2 text-gray-600">Pour une intégration optimale de ChatSeller</p>
          </div>

          <form @submit.prevent="completeOnboarding" class="space-y-6">
            <div>
              <label class="block text-sm font-medium text-gray-700 mb-4">
                Quelle plateforme utilisez-vous ? *
              </label>
              <div class="grid grid-cols-1 md:grid-cols-2 gap-4">
                <label 
                  v-for="platform in platforms" 
                  :key="platform.value"
                  class="relative flex items-center p-4 border rounded-lg cursor-pointer transition-all hover:border-blue-300"
                  :class="form.platform === platform.value ? 'border-blue-500 bg-blue-50' : 'border-gray-300'"
                >
                  <input
                    v-model="form.platform"
                    type="radio"
                    :value="platform.value"
                    class="sr-only"
                  >
                  <div class="flex items-center space-x-3">
                    <div class="flex-shrink-0">
                      <component :is="platform.icon" class="w-8 h-8" />
                    </div>
                    <div>
                      <div class="text-sm font-medium text-gray-900">{{ platform.name }}</div>
                      <div class="text-xs text-gray-500">{{ platform.description }}</div>
                    </div>
                  </div>
                  <div v-if="form.platform === platform.value" class="absolute top-3 right-3">
                    <svg class="w-5 h-5 text-blue-600" fill="currentColor" viewBox="0 0 20 20">
                      <path fill-rule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clip-rule="evenodd"/>
                    </svg>
                  </div>
                </label>
              </div>
            </div>

            <div>
              <label for="monthlyVisitors" class="block text-sm font-medium text-gray-700 mb-2">
                Visiteurs mensuels approximatifs
              </label>
              <select
                id="monthlyVisitors"
                v-model="form.monthlyVisitors"
                class="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-colors"
              >
                <option value="">Sélectionnez un volume</option>
                <option value="0-1000">0 - 1 000 visiteurs</option>
                <option value="1000-5000">1 000 - 5 000 visiteurs</option>
                <option value="5000-20000">5 000 - 20 000 visiteurs</option>
                <option value="20000-100000">20 000 - 100 000 visiteurs</option>
                <option value="100000+">Plus de 100 000 visiteurs</option>
              </select>
            </div>

            <div>
              <label class="block text-sm font-medium text-gray-700 mb-4">
                Quels sont vos objectifs principaux avec ChatSeller ? (plusieurs choix possibles)
              </label>
              <div class="space-y-3">
                <label v-for="goal in goals" :key="goal.value" class="flex items-center">
                  <input
                    v-model="form.goals"
                    type="checkbox"
                    :value="goal.value"
                    class="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 rounded"
                  >
                  <span class="ml-3 text-sm text-gray-700">{{ goal.label }}</span>
                </label>
              </div>
            </div>

            <div>
              <label for="newsletter" class="flex items-center">
                <input
                  id="newsletter"
                  v-model="form.newsletter"
                  type="checkbox"
                  class="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 rounded"
                >
                <span class="ml-3 text-sm text-gray-700">
                  Recevoir les conseils d'optimisation et les mises à jour produit
                </span>
              </label>
            </div>

            <div class="flex justify-between">
              <button
                type="button"
                @click="previousStep"
                class="px-6 py-3 bg-gray-100 text-gray-700 font-medium rounded-lg hover:bg-gray-200 focus:outline-none focus:ring-2 focus:ring-gray-500 focus:ring-offset-2 transition-colors"
              >
                Retour
              </button>
              <button
                type="submit"
                :disabled="loading || !form.platform"
                class="px-6 py-3 bg-blue-600 text-white font-medium rounded-lg hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
              >
                <span v-if="loading" class="flex items-center">
                  <svg class="animate-spin -ml-1 mr-3 h-4 w-4 text-white" fill="none" viewBox="0 0 24 24">
                    <circle class="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" stroke-width="4"></circle>
                    <path class="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                  </svg>
                  Finalisation...
                </span>
                <span v-else>Terminer l'inscription</span>
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, reactive, onMounted } from 'vue'
import { useAuthStore } from '~/stores/auth'

// ✅ META PAGE
definePageMeta({
  middleware: 'auth'
})

// ✅ COMPOSABLES
const authStore = useAuthStore()
const { $supabase } = useNuxtApp()

// ✅ STATE
const currentStep = ref(1)
const loading = ref(false)
const error = ref('')

// ✅ FORMULAIRE COMPLET
const form = reactive({
  firstName: '',
  lastName: '',
  jobTitle: '',
  company: '',
  website: '',
  industry: '',
  teamSize: '',
  platform: '',
  monthlyVisitors: '',
  goals: [] as string[],
  newsletter: false
})

// ✅ OPTIONS PLATEFORME
const platforms = [
  {
    value: 'shopify',
    name: 'Shopify',
    description: 'Plateforme e-commerce populaire',
    icon: 'ShopifyIcon'
  },
  {
    value: 'woocommerce',
    name: 'WooCommerce',
    description: 'Plugin WordPress',
    icon: 'WooCommerceIcon'
  },
  {
    value: 'wix',
    name: 'Wix',
    description: 'Constructeur de site',
    icon: 'WixIcon'
  },
  {
    value: 'prestashop',
    name: 'PrestaShop',
    description: 'Solution open source',
    icon: 'PrestaShopIcon'
  },
  {
    value: 'magento',
    name: 'Magento',
    description: 'Plateforme Adobe',
    icon: 'MagentoIcon'
  },
  {
    value: 'custom',
    name: 'Site personnalisé',
    description: 'Site développé sur mesure',
    icon: 'CustomIcon'
  }
]

// ✅ OBJECTIFS
const goals = [
  { value: 'increase_conversions', label: 'Augmenter le taux de conversion' },
  { value: 'improve_customer_service', label: 'Améliorer le service client' },
  { value: 'reduce_cart_abandonment', label: 'Réduire l\'abandon de panier' },
  { value: 'increase_average_order', label: 'Augmenter le panier moyen' },
  { value: 'capture_leads', label: 'Capturer plus de prospects' },
  { value: 'automate_sales', label: 'Automatiser les ventes' }
]

// ✅ NAVIGATION ENTRE ÉTAPES
const nextStep = () => {
  if (currentStep.value < 3) {
    currentStep.value++
    window.scrollTo({ top: 0, behavior: 'smooth' })
  }
}

const previousStep = () => {
  if (currentStep.value > 1) {
    currentStep.value--
    window.scrollTo({ top: 0, behavior: 'smooth' })
  }
}

// ✅ FINALISER L'ONBOARDING
const completeOnboarding = async () => {
  if (!form.platform) {
    alert('Veuillez sélectionner une plateforme')
    return
  }
  
  loading.value = true
  error.value = ''
  
  try {
    const userId = authStore.user?.id
    if (!userId) {
      throw new Error('Utilisateur non trouvé')
    }
    
    console.log('✅ Finalisation de l\'onboarding...')
    
    // ✅ METTRE À JOUR LES INFORMATIONS UTILISATEUR
    const { error: updateError } = await $supabase
      .from('users')
      .update({
        first_name: form.firstName,
        last_name: form.lastName,
        company: form.company,
        job_title: form.jobTitle,
        website: form.website,
        industry: form.industry,
        team_size: form.teamSize,
        platform: form.platform,
        monthly_visitors: form.monthlyVisitors,
        goals: form.goals,
        newsletter: form.newsletter,
        onboarding_completed: true,
        updated_at: new Date().toISOString()
      })
      .eq('id', userId)
    
    if (updateError) {
      console.error('❌ Erreur mise à jour utilisateur:', updateError)
      throw updateError
    }
    
    // ✅ METTRE À JOUR LE SHOP AVEC LES NOUVELLES INFOS
    const { error: shopError } = await $supabase
      .from('shops')
      .update({
        name: form.company || `Shop de ${form.firstName}`,
        domain: form.website ? new URL(form.website).hostname : null,
        industry: form.industry,
        platform: form.platform,
        monthly_visitors: form.monthlyVisitors,
        updated_at: new Date().toISOString()
      })
      .eq('id', userId)
    
    if (shopError) {
      console.warn('⚠️ Erreur mise à jour shop:', shopError)
    }
    
    // ✅ METTRE À JOUR LE STORE AUTH
    await authStore.updateProfile({
      firstName: form.firstName,
      lastName: form.lastName,
      name: `${form.firstName} ${form.lastName}`
    })
    
    console.log('✅ Onboarding terminé avec succès!')
    
    // ✅ REDIRECTION VERS LE DASHBOARD
    await navigateTo('/', { replace: true })
    
  } catch (err: any) {
    console.error('❌ Erreur finalisation onboarding:', err)
    error.value = err.message || 'Erreur lors de la finalisation'
  } finally {
    loading.value = false
  }
}

// ✅ VÉRIFIER SI L'UTILISATEUR DOIT FAIRE L'ONBOARDING
onMounted(async () => {
  try {
    // Vérifier si l'onboarding est déjà terminé
    if (authStore.user?.id) {
      const { data: userData, error } = await $supabase
        .from('users')
        .select('onboarding_completed, first_name, last_name, company')
        .eq('id', authStore.user.id)
        .single()
      
      if (!error && userData?.onboarding_completed) {
        console.log('✅ Onboarding déjà terminé, redirection')
        await navigateTo('/', { replace: true })
        return
      }
      
      // Pré-remplir avec les données existantes si disponibles
      if (userData) {
        if (userData.first_name) form.firstName = userData.first_name
        if (userData.last_name) form.lastName = userData.last_name
        if (userData.company) form.company = userData.company
      }
    }
  } catch (err) {
    console.error('❌ Erreur vérification onboarding:', err)
  }
})

// ✅ SEO
useHead({
  title: 'Configuration de votre compte - ChatSeller',
  meta: [
    { name: 'description', content: 'Finalisez la configuration de votre compte ChatSeller' }
  ]
})
</script>

<style scoped>
/* ✅ ANIMATIONS FLUIDES */
.transition-all {
  transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1);
}

/* ✅ GRADIENT ANIMÉ */
.bg-gradient-to-br {
  background-size: 400% 400%;
  animation: gradient 15s ease infinite;
}

@keyframes gradient {
  0% { background-position: 0% 50%; }
  50% { background-position: 100% 50%; }
  100% { background-position: 0% 50%; }
}

/* ✅ BACKDROP BLUR */
.backdrop-blur-sm {
  backdrop-filter: blur(4px);
}

/* ✅ HOVER EFFECTS */
.hover\:border-blue-300:hover {
  border-color: rgb(147 197 253);
}

/* ✅ SPINNER ANIMATION */
@keyframes spin {
  from { transform: rotate(0deg); }
  to { transform: rotate(360deg); }
}

.animate-spin {
  animation: spin 1s linear infinite;
}
</style>