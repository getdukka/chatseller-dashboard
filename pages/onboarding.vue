<!-- pages/onboarding.vue - VERSION SIMPLE FONCTIONNELLE -->
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

    <!-- Contenu principal responsive -->
    <div class="flex-1 flex flex-col justify-center py-8 sm:py-12 px-4 sm:px-6 lg:px-8">
      <div class="mx-auto max-w-4xl w-full">
        
        <!-- Progress bar responsive -->
        <div class="mb-6 sm:mb-8">
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

        <!-- Étape 1: Informations entreprise -->
        <div v-if="currentStep === 1" class="bg-white rounded-xl shadow-xl border border-gray-100 p-6 sm:p-8 lg:p-10">
          <div class="text-center mb-6 sm:mb-8">
            <div class="flex justify-center mb-4">
              <div class="w-16 h-16 bg-blue-100 rounded-full flex items-center justify-center">
                <svg class="w-8 h-8 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-4m-5 0H9m0 0H5m0 0H3m2 0v-4m0 4h4"/>
                </svg>
              </div>
            </div>
            <h2 class="text-2xl sm:text-3xl font-bold text-gray-900">Votre entreprise</h2>
            <p class="mt-2 text-gray-600 max-w-2xl mx-auto">Aidez-nous à configurer ChatSeller pour votre activité</p>
          </div>

          <form @submit.prevent="nextStep" class="space-y-6 max-w-2xl mx-auto">
            <div>
              <label for="company" class="block text-sm font-medium text-gray-700 mb-2">
                Nom de l'entreprise *
              </label>
              <input
                id="company"
                v-model="form.company"
                type="text"
                required
                class="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-colors text-base"
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
                class="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-colors text-base"
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
                class="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-colors text-base"
              >
                <option value="">Sélectionnez votre secteur</option>
                <option value="fashion">Mode et vêtements</option>
                <option value="beauty">Beauté et cosmétiques</option>
                <option value="electronics">Électronique et high-tech</option>
                <option value="home">Maison et décoration</option>
                <option value="sports">Sport et fitness</option>
                <option value="food">Alimentation</option>
                <option value="health">Santé et bien-être</option>
                <option value="automotive">Automobile</option>
                <option value="jewelry">Bijouterie</option>
                <option value="toys">Jouets et enfants</option>
                <option value="other">Autre</option>
              </select>
            </div>

            <div class="flex justify-end pt-4">
              <button
                type="submit"
                class="px-8 py-3 bg-blue-600 text-white font-medium rounded-lg hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 transition-colors text-base"
              >
                Continuer
              </button>
            </div>
          </form>
        </div>

        <!-- Étape 2: Plateforme -->
        <div v-if="currentStep === 2" class="bg-white rounded-xl shadow-xl border border-gray-100 p-6 sm:p-8 lg:p-10">
          <div class="text-center mb-6 sm:mb-8">
            <div class="flex justify-center mb-4">
              <div class="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center">
                <svg class="w-8 h-8 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M16 11V7a4 4 0 00-8 0v4M5 9h14l1 12H4L5 9z"/>
                </svg>
              </div>
            </div>
            <h2 class="text-2xl sm:text-3xl font-bold text-gray-900">Votre plateforme</h2>
            <p class="mt-2 text-gray-600 max-w-2xl mx-auto">Pour une intégration optimale de ChatSeller</p>
          </div>

          <form @submit.prevent="nextStep" class="space-y-6 max-w-4xl mx-auto">
            <div>
              <label class="block text-sm font-medium text-gray-700 mb-4 text-center">
                Quelle plateforme utilisez-vous ? *
              </label>
              <div class="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
                <label class="relative flex items-center p-4 sm:p-6 border rounded-lg cursor-pointer hover:border-blue-300 transition-all"
                       :class="form.platform === 'shopify' ? 'border-blue-500 bg-blue-50 ring-2 ring-blue-200' : 'border-gray-300'">
                  <input v-model="form.platform" type="radio" value="shopify" class="sr-only">
                  <div class="flex flex-col items-center text-center space-y-3 w-full">
                    <div class="text-3xl">🛒</div>
                    <div>
                      <div class="text-sm font-medium text-gray-900">Shopify</div>
                      <div class="text-xs text-gray-500">Plateforme populaire</div>
                    </div>
                  </div>
                  <div v-if="form.platform === 'shopify'" class="absolute top-3 right-3">
                    <svg class="w-5 h-5 text-blue-600" fill="currentColor" viewBox="0 0 20 20">
                      <path fill-rule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clip-rule="evenodd"/>
                    </svg>
                  </div>
                </label>
                
                <label class="relative flex items-center p-4 sm:p-6 border rounded-lg cursor-pointer hover:border-blue-300 transition-all"
                       :class="form.platform === 'woocommerce' ? 'border-blue-500 bg-blue-50 ring-2 ring-blue-200' : 'border-gray-300'">
                  <input v-model="form.platform" type="radio" value="woocommerce" class="sr-only">
                  <div class="flex flex-col items-center text-center space-y-3 w-full">
                    <div class="text-3xl">🔗</div>
                    <div>
                      <div class="text-sm font-medium text-gray-900">WooCommerce</div>
                      <div class="text-xs text-gray-500">Plugin WordPress</div>
                    </div>
                  </div>
                  <div v-if="form.platform === 'woocommerce'" class="absolute top-3 right-3">
                    <svg class="w-5 h-5 text-blue-600" fill="currentColor" viewBox="0 0 20 20">
                      <path fill-rule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clip-rule="evenodd"/>
                    </svg>
                  </div>
                </label>
                
                <label class="relative flex items-center p-4 sm:p-6 border rounded-lg cursor-pointer hover:border-blue-300 transition-all"
                       :class="form.platform === 'prestashop' ? 'border-blue-500 bg-blue-50 ring-2 ring-blue-200' : 'border-gray-300'">
                  <input v-model="form.platform" type="radio" value="prestashop" class="sr-only">
                  <div class="flex flex-col items-center text-center space-y-3 w-full">
                    <div class="text-3xl">🏪</div>
                    <div>
                      <div class="text-sm font-medium text-gray-900">PrestaShop</div>
                      <div class="text-xs text-gray-500">Solution open source</div>
                    </div>
                  </div>
                  <div v-if="form.platform === 'prestashop'" class="absolute top-3 right-3">
                    <svg class="w-5 h-5 text-blue-600" fill="currentColor" viewBox="0 0 20 20">
                      <path fill-rule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clip-rule="evenodd"/>
                    </svg>
                  </div>
                </label>
                
                <label class="relative flex items-center p-4 sm:p-6 border rounded-lg cursor-pointer hover:border-blue-300 transition-all"
                       :class="form.platform === 'wix' ? 'border-blue-500 bg-blue-50 ring-2 ring-blue-200' : 'border-gray-300'">
                  <input v-model="form.platform" type="radio" value="wix" class="sr-only">
                  <div class="flex flex-col items-center text-center space-y-3 w-full">
                    <div class="text-3xl">🎨</div>
                    <div>
                      <div class="text-sm font-medium text-gray-900">Wix</div>
                      <div class="text-xs text-gray-500">Constructeur de site</div>
                    </div>
                  </div>
                  <div v-if="form.platform === 'wix'" class="absolute top-3 right-3">
                    <svg class="w-5 h-5 text-blue-600" fill="currentColor" viewBox="0 0 20 20">
                      <path fill-rule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clip-rule="evenodd"/>
                    </svg>
                  </div>
                </label>
                
                <label class="relative flex items-center p-4 sm:p-6 border rounded-lg cursor-pointer hover:border-blue-300 transition-all"
                       :class="form.platform === 'custom' ? 'border-blue-500 bg-blue-50 ring-2 ring-blue-200' : 'border-gray-300'">
                  <input v-model="form.platform" type="radio" value="custom" class="sr-only">
                  <div class="flex flex-col items-center text-center space-y-3 w-full">
                    <div class="text-3xl">⚙️</div>
                    <div>
                      <div class="text-sm font-medium text-gray-900">Site personnalisé</div>
                      <div class="text-xs text-gray-500">Développé sur mesure</div>
                    </div>
                  </div>
                  <div v-if="form.platform === 'custom'" class="absolute top-3 right-3">
                    <svg class="w-5 h-5 text-blue-600" fill="currentColor" viewBox="0 0 20 20">
                      <path fill-rule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clip-rule="evenodd"/>
                    </svg>
                  </div>
                </label>
                
                <label class="relative flex items-center p-4 sm:p-6 border rounded-lg cursor-pointer hover:border-blue-300 transition-all"
                       :class="form.platform === 'other' ? 'border-blue-500 bg-blue-50 ring-2 ring-blue-200' : 'border-gray-300'">
                  <input v-model="form.platform" type="radio" value="other" class="sr-only">
                  <div class="flex flex-col items-center text-center space-y-3 w-full">
                    <div class="text-3xl">📦</div>
                    <div>
                      <div class="text-sm font-medium text-gray-900">Autre</div>
                      <div class="text-xs text-gray-500">Autre plateforme</div>
                    </div>
                  </div>
                  <div v-if="form.platform === 'other'" class="absolute top-3 right-3">
                    <svg class="w-5 h-5 text-blue-600" fill="currentColor" viewBox="0 0 20 20">
                      <path fill-rule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clip-rule="evenodd"/>
                    </svg>
                  </div>
                </label>
              </div>
            </div>

            <div class="flex flex-col sm:flex-row justify-between gap-4 pt-4">
              <button
                type="button"
                @click="previousStep"
                class="px-8 py-3 bg-gray-100 text-gray-700 font-medium rounded-lg hover:bg-gray-200 transition-colors text-base order-2 sm:order-1"
              >
                Retour
              </button>
              <button
                type="submit"
                class="px-8 py-3 bg-blue-600 text-white font-medium rounded-lg hover:bg-blue-700 transition-colors text-base order-1 sm:order-2"
              >
                Continuer
              </button>
            </div>
          </form>
        </div>

        <!-- Étape 3: Finalisation -->
        <div v-if="currentStep === 3" class="bg-white rounded-xl shadow-xl border border-gray-100 p-6 sm:p-8 lg:p-10">
          <div class="text-center mb-6 sm:mb-8">
            <div class="flex justify-center mb-4">
              <div class="w-16 h-16 bg-emerald-100 rounded-full flex items-center justify-center">
                <svg class="w-8 h-8 text-emerald-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M5 13l4 4L19 7"/>
                </svg>
              </div>
            </div>
            <h2 class="text-2xl sm:text-3xl font-bold text-gray-900">Presque terminé !</h2>
            <p class="mt-2 text-gray-600 max-w-2xl mx-auto">Comment avez-vous connu ChatSeller ?</p>
          </div>

          <form @submit.prevent="completeOnboarding" class="space-y-6 max-w-2xl mx-auto">
            <div>
              <label for="source" class="block text-sm font-medium text-gray-700 mb-2">
                Source de découverte
              </label>
              <select
                id="source"
                v-model="form.acquisitionSource"
                class="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-colors text-base"
              >
                <option value="">Sélectionnez une source</option>
                <option value="search_google">Recherche Google</option>
                <option value="social_media">Réseaux sociaux</option>
                <option value="recommendation">Recommandation</option>
                <option value="blog_article">Article de blog</option>
                <option value="youtube">YouTube</option>
                <option value="conference">Conférence / Événement</option>
                <option value="newsletter">Newsletter e-commerce</option>
                <option value="shopify_app_store">Shopify App Store</option>
                <option value="competitor_comparison">Comparaison avec un concurrent</option>
                <option value="podcast">Podcast</option>
                <option value="other">Autre</option>
              </select>
            </div>

            <div class="flex items-start">
              <div class="flex items-center h-5">
                <input
                  id="newsletter"
                  v-model="form.newsletter"
                  type="checkbox"
                  class="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 rounded"
                />
              </div>
              <div class="ml-3">
                <label for="newsletter" class="text-sm font-medium text-gray-700">
                  Recevoir les conseils d'optimisation et les mises à jour produit
                </label>
                <p class="text-xs text-gray-500 mt-1">
                  Conseils pour maximiser vos conversions et nouvelles fonctionnalités.
                </p>
              </div>
            </div>

            <div class="bg-blue-50 border border-blue-200 rounded-lg p-4 sm:p-6">
              <div class="flex items-start">
                <svg class="w-5 h-5 text-blue-600 mt-0.5 mr-3 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"/>
                </svg>
                <div class="text-sm">
                  <p class="font-medium text-blue-800 mb-1">Votre essai gratuit commence maintenant</p>
                  <p class="text-blue-700">
                    Vous bénéficiez de <strong>7 jours d'essai gratuit</strong> pour tester toutes les fonctionnalités.
                  </p>
                </div>
              </div>
            </div>

            <div class="flex flex-col sm:flex-row justify-between gap-4 pt-4">
              <button
                type="button"
                @click="previousStep"
                class="px-8 py-3 bg-gray-100 text-gray-700 font-medium rounded-lg hover:bg-gray-200 transition-colors text-base order-2 sm:order-1"
              >
                Retour
              </button>
              <button
                type="submit"
                :disabled="loading"
                class="px-8 py-3 bg-emerald-600 text-white font-medium rounded-lg hover:bg-emerald-700 transition-colors disabled:opacity-50 text-base order-1 sm:order-2"
              >
                <span v-if="loading" class="flex items-center justify-center">
                  <svg class="animate-spin -ml-1 mr-3 h-4 w-4 text-white" fill="none" viewBox="0 0 24 24">
                    <circle class="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" stroke-width="4"></circle>
                    <path class="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                  </svg>
                  Finalisation...
                </span>
                <span v-else>Accéder à mon dashboard</span>
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
import { createClient } from '@supabase/supabase-js'

// Layout
definePageMeta({
  layout: 'auth'
})

// ✅ CLIENT SUPABASE DIRECT
const config = useRuntimeConfig()
const supabase = createClient(
  config.public.supabaseUrl,
  config.public.supabaseAnonKey
)

// State
const currentStep = ref(1)
const loading = ref(false)

// Formulaire
const form = reactive({
  company: '',
  website: '',
  industry: '',
  platform: '',
  acquisitionSource: '',
  newsletter: true
})

// Navigation
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

// Finaliser l'onboarding
const completeOnboarding = async () => {
  loading.value = true
  
  try {
    // Récupérer l'utilisateur actuel
    const { data: { user } } = await supabase.auth.getUser()
    
    if (!user) {
      throw new Error('Utilisateur non trouvé')
    }
    
    console.log('✅ Finalisation de l\'onboarding pour:', user.email)
    
    // Mettre à jour la table users
    const { error: updateUserError } = await supabase
      .from('users')
      .update({
        company: form.company,
        website: form.website,
        industry: form.industry,
        platform: form.platform,
        acquisition_source: form.acquisitionSource,
        newsletter: form.newsletter,
        onboarding_completed: true,
        onboarding_completed_at: new Date().toISOString(),
        updated_at: new Date().toISOString()
      })
      .eq('id', user.id)
    
    if (updateUserError) {
      console.error('❌ Erreur mise à jour utilisateur:', updateUserError)
    }
    
    // Créer le shop
    const { error: shopError } = await supabase
      .from('shops')
      .upsert({
        id: user.id,
        name: form.company || `Shop de ${user.user_metadata?.first_name || 'Utilisateur'}`,
        email: user.email,
        domain: extractDomain(form.website),
        industry: form.industry,
        platform: form.platform,
        subscription_plan: 'free',
        is_active: true,
        trial_started_at: new Date().toISOString(),
        created_at: new Date().toISOString(),
        updated_at: new Date().toISOString()
      })
    
    if (shopError) {
      console.error('❌ Erreur création shop:', shopError)
    }
    
    console.log('✅ Onboarding terminé avec succès!')
    
    // Redirection vers le dashboard
    await navigateTo('/', { replace: true })
    
  } catch (error) {
    console.error('❌ Erreur finalisation onboarding:', error)
    alert('Une erreur s\'est produite. Veuillez réessayer.')
  } finally {
    loading.value = false
  }
}

// Helper pour extraire le domaine
const extractDomain = (url: string): string | null => {
  if (!url) return null
  try {
    const domain = new URL(url.startsWith('http') ? url : `https://${url}`).hostname
    return domain.replace('www.', '')
  } catch {
    return null
  }
}

// Vérification au montage
onMounted(async () => {
  try {
    const { data: { user } } = await supabase.auth.getUser()
    
    if (!user) {
      console.log('❌ Utilisateur non connecté, redirection vers register')
      await navigateTo('/register', { replace: true })
      return
    }
    
    // ✅ VÉRIFIER QUE L'EMAIL EST CONFIRMÉ
    if (!user.email_confirmed_at) {
      console.log('❌ Email non confirmé, redirection vers register')
      await navigateTo('/register', { replace: true })
      return
    }
    
    console.log('✅ Utilisateur connecté avec email confirmé:', user.email)
    
    // Vérifier si l'onboarding est déjà terminé
    const { data: userData } = await supabase
      .from('users')
      .select('onboarding_completed, company')
      .eq('id', user.id)
      .single()
    
    if (userData?.onboarding_completed) {
      console.log('✅ Onboarding déjà terminé, redirection vers dashboard')
      await navigateTo('/', { replace: true })
      return
    }
    
    // Pré-remplir avec les données existantes si disponibles
    if (userData?.company) {
      form.company = userData.company
    }
    
  } catch (error) {
    console.error('❌ Erreur vérification onboarding:', error)
    await navigateTo('/register', { replace: true })
  }
})
</script>

<style scoped>
.animate-spin {
  animation: spin 1s linear infinite;
}

@keyframes spin {
  from { transform: rotate(0deg); }
  to { transform: rotate(360deg); }
}

.bg-gradient-to-br {
  background-size: 400% 400%;
  animation: gradient 15s ease infinite;
}

@keyframes gradient {
  0% { background-position: 0% 50%; }
  50% { background-position: 100% 50%; }
  100% { background-position: 0% 50%; }
}

.backdrop-blur-sm {
  backdrop-filter: blur(4px);
}
</style>