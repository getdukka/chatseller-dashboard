<!-- pages/register.vue - VERSION FINALE CORRIGÉE -->
<template>
  <div>
    <!-- Logo et titre -->
    <div class="text-center mb-8">
      <div class="flex justify-center mb-4">
        <div class="flex h-12 w-12 items-center justify-center rounded-xl bg-blue-600 shadow-lg">
          <span class="text-lg font-bold text-white">CS</span>
        </div>
      </div>
      <h2 class="text-3xl font-bold text-gray-900">
        Créer votre compte ChatSeller
      </h2>
      <p class="mt-2 text-sm text-gray-600">
        Déployez votre Agent IA Commercial en quelques minutes
      </p>
    </div>

    <!-- Formulaire d'inscription -->
    <div class="bg-white py-8 px-6 shadow-xl rounded-xl border border-gray-100">
      <form @submit.prevent="handleRegister" class="space-y-6">
        
        <!-- Informations personnelles -->
        <div class="grid grid-cols-1 md:grid-cols-2 gap-4">
          <!-- Prénom -->
          <div>
            <label for="firstName" class="block text-sm font-medium text-gray-700 mb-2">
              Prénom *
            </label>
            <input
              id="firstName"
              v-model="form.firstName"
              type="text"
              required
              autocomplete="given-name"
              class="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-colors"
              :class="{ 'border-red-500 focus:ring-red-500 focus:border-red-500': errors.firstName }"
              placeholder="Jean"
            />
            <p v-if="errors.firstName" class="mt-1 text-sm text-red-600">
              {{ errors.firstName }}
            </p>
          </div>

          <!-- Nom -->
          <div>
            <label for="lastName" class="block text-sm font-medium text-gray-700 mb-2">
              Nom *
            </label>
            <input
              id="lastName"
              v-model="form.lastName"
              type="text"
              required
              autocomplete="family-name"
              class="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-colors"
              :class="{ 'border-red-500 focus:ring-red-500 focus:border-red-500': errors.lastName }"
              placeholder="Dupont"
            />
            <p v-if="errors.lastName" class="mt-1 text-sm text-red-600">
              {{ errors.lastName }}
            </p>
          </div>
        </div>

        <!-- Email -->
        <div>
          <label for="email" class="block text-sm font-medium text-gray-700 mb-2">
            Adresse email professionnelle *
          </label>
          <input
            id="email"
            v-model="form.email"
            type="email"
            required
            autocomplete="email"
            class="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-colors"
            :class="{ 'border-red-500 focus:ring-red-500 focus:border-red-500': errors.email }"
            placeholder="jean.dupont@entreprise.com"
          />
          <p v-if="errors.email" class="mt-1 text-sm text-red-600">
            {{ errors.email }}
          </p>
        </div>

        <!-- Entreprise -->
        <div>
          <label for="company" class="block text-sm font-medium text-gray-700 mb-2">
            Nom de l'entreprise *
          </label>
          <input
            id="company"
            v-model="form.company"
            type="text"
            required
            autocomplete="organization"
            class="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-colors"
            :class="{ 'border-red-500 focus:ring-red-500 focus:border-red-500': errors.company }"
            placeholder="Mon E-commerce"
          />
          <p v-if="errors.company" class="mt-1 text-sm text-red-600">
            {{ errors.company }}
          </p>
        </div>

        <!-- Plateforme e-commerce -->
        <div>
          <label for="platform" class="block text-sm font-medium text-gray-700 mb-2">
            Plateforme e-commerce
          </label>
          <select
            id="platform"
            v-model="form.platform"
            class="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-colors"
          >
            <option value="">Sélectionnez votre plateforme</option>
            <option value="shopify">Shopify</option>
            <option value="woocommerce">WooCommerce</option>
            <option value="wix">Wix</option>
            <option value="prestashop">PrestaShop</option>
            <option value="magento">Magento</option>
            <option value="custom">Site personnalisé</option>
            <option value="other">Autre</option>
          </select>
        </div>

        <!-- Mot de passe -->
        <div>
          <label for="password" class="block text-sm font-medium text-gray-700 mb-2">
            Mot de passe *
          </label>
          <div class="relative">
            <input
              id="password"
              v-model="form.password"
              :type="showPassword ? 'text' : 'password'"
              required
              autocomplete="new-password"
              class="w-full px-4 py-3 pr-12 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-colors"
              :class="{ 'border-red-500 focus:ring-red-500 focus:border-red-500': errors.password }"
              placeholder="••••••••"
            />
            <button
              type="button"
              @click="showPassword = !showPassword"
              class="absolute inset-y-0 right-0 pr-3 flex items-center"
            >
              <svg v-if="!showPassword" class="h-5 w-5 text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" />
              </svg>
              <svg v-else class="h-5 w-5 text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M13.875 18.825A10.05 10.05 0 0112 19c-4.478 0-8.268-2.943-9.543-7a9.97 9.97 0 011.563-3.029m5.858.908a3 3 0 114.243 4.243M9.878 9.878l4.242 4.242M9.878 9.878L3 3m6.878 6.878L21 21" />
              </svg>
            </button>
          </div>
          <p v-if="errors.password" class="mt-1 text-sm text-red-600">
            {{ errors.password }}
          </p>
          <p class="mt-1 text-xs text-gray-500">
            Minimum 8 caractères avec lettres et chiffres
          </p>
        </div>

        <!-- Confirmation mot de passe -->
        <div>
          <label for="confirmPassword" class="block text-sm font-medium text-gray-700 mb-2">
            Confirmer le mot de passe *
          </label>
          <input
            id="confirmPassword"
            v-model="form.confirmPassword"
            type="password"
            required
            autocomplete="new-password"
            class="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-colors"
            :class="{ 'border-red-500 focus:ring-red-500 focus:border-red-500': errors.confirmPassword }"
            placeholder="••••••••"
          />
          <p v-if="errors.confirmPassword" class="mt-1 text-sm text-red-600">
            {{ errors.confirmPassword }}
          </p>
        </div>

        <!-- Acceptation des conditions -->
        <div class="flex items-start">
          <div class="flex items-center h-5">
            <input
              id="terms"
              v-model="form.acceptTerms"
              type="checkbox"
              required
              class="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 rounded"
              :class="{ 'border-red-500': errors.terms }"
            />
          </div>
          <div class="ml-3 text-sm">
            <label for="terms" class="text-gray-700">
              J'accepte les 
              <a href="https://chatseller.app/terms" class="font-medium text-blue-600 hover:text-blue-500" target="_blank">
                conditions d'utilisation
              </a>
              et la 
              <a href="https://chatseller.app/privacy" class="font-medium text-blue-600 hover:text-blue-500" target="_blank">
                politique de confidentialité
              </a>
            </label>
            <p v-if="errors.terms" class="mt-1 text-red-600">
              {{ errors.terms }}
            </p>
          </div>
        </div>

        <!-- Newsletter -->
        <div class="flex items-center">
          <div class="flex items-center h-5">
            <input
              id="newsletter"
              v-model="form.newsletter"
              type="checkbox"
              class="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 rounded"
            />
          </div>
          <div class="ml-3 text-sm">
            <label for="newsletter" class="text-gray-700">
              Recevoir les mises à jour produit et conseils e-commerce (optionnel)
            </label>
          </div>
        </div>

        <!-- Message d'erreur global -->
        <div v-if="registerError" class="p-4 rounded-lg bg-red-50 border border-red-200">
          <div class="flex">
            <svg class="h-5 w-5 text-red-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-2.5L13.732 4c-.77-.833-1.964-.833-2.732 0L3.732 16c-.77.833.192 2.5 1.732 2.5z" />
            </svg>
            <div class="ml-3">
              <p class="text-sm text-red-800">
                {{ registerError }}
              </p>
            </div>
          </div>
        </div>

        <!-- Bouton d'inscription -->
        <button
          type="submit"
          :disabled="loading"
          class="w-full flex justify-center items-center py-3 px-4 border border-transparent rounded-lg text-sm font-medium text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
        >
          <svg v-if="loading" class="animate-spin -ml-1 mr-3 h-5 w-5 text-white" fill="none" viewBox="0 0 24 24">
            <circle class="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" stroke-width="4"></circle>
            <path class="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
          </svg>
          {{ loading ? 'Création du compte...' : 'Créer mon compte' }}
        </button>
      </form>

      <!-- Séparateur -->
      <div class="mt-6">
        <div class="relative">
          <div class="absolute inset-0 flex items-center">
            <div class="w-full border-t border-gray-300" />
          </div>
          <div class="relative flex justify-center text-sm">
            <span class="px-2 bg-white text-gray-500">Déjà un compte ?</span>
          </div>
        </div>

        <!-- Lien vers connexion -->
        <div class="mt-4 text-center">
          <NuxtLink
            to="/login"
            class="inline-flex items-center px-4 py-2 border border-gray-300 rounded-lg text-sm font-medium text-gray-700 bg-white hover:bg-gray-50 transition-colors"
          >
            <svg class="mr-2 h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M11 16l-4-4m0 0l4-4m-4 4h14m-5 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1" />
            </svg>
            Se connecter
          </NuxtLink>
        </div>
      </div>
    </div>

    <!-- Aide et support -->
    <div class="mt-8 text-center">
      <p class="text-sm text-gray-600">
        Questions sur ChatSeller ? 
        <a href="https://chatseller.app/support" class="font-medium text-blue-600 hover:text-blue-500 transition-colors">
          Contactez notre équipe
        </a>
      </p>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, reactive } from 'vue'

// Layout
definePageMeta({
  layout: 'auth'
})

// ✅ UTILISER LE COMPOSABLE AUTH CORRIGÉ
const auth = useAuth()

// État du composant
const loading = ref(false)
const showPassword = ref(false)
const registerError = ref('')

// Formulaire
const form = reactive({
  firstName: '',
  lastName: '',
  email: '',
  company: '',
  platform: '',
  password: '',
  confirmPassword: '',
  acceptTerms: false,
  newsletter: false
})

// Erreurs de validation
const errors = reactive({
  firstName: '',
  lastName: '',
  email: '',
  company: '',
  password: '',
  confirmPassword: '',
  terms: ''
})

// Validation
const validateForm = () => {
  // Reset errors
  Object.keys(errors).forEach(key => {
    errors[key as keyof typeof errors] = ''
  })
  
  let isValid = true
  
  if (!form.firstName.trim()) {
    errors.firstName = 'Le prénom est requis'
    isValid = false
  }
  
  if (!form.lastName.trim()) {
    errors.lastName = 'Le nom est requis'
    isValid = false
  }
  
  if (!form.email.trim()) {
    errors.email = 'L\'adresse email est requise'
    isValid = false
  } else if (!form.email.includes('@') || !form.email.includes('.')) {
    errors.email = 'Veuillez saisir une adresse email valide'
    isValid = false
  }
  
  if (!form.company.trim()) {
    errors.company = 'Le nom de l\'entreprise est requis'
    isValid = false
  }
  
  if (!form.password) {
    errors.password = 'Le mot de passe est requis'
    isValid = false
  } else if (form.password.length < 8) {
    errors.password = 'Le mot de passe doit contenir au moins 8 caractères'
    isValid = false
  } else if (!/(?=.*[a-zA-Z])(?=.*\d)/.test(form.password)) {
    errors.password = 'Le mot de passe doit contenir au moins une lettre et un chiffre'
    isValid = false
  }
  
  if (!form.confirmPassword) {
    errors.confirmPassword = 'Veuillez confirmer votre mot de passe'
    isValid = false
  } else if (form.password !== form.confirmPassword) {
    errors.confirmPassword = 'Les mots de passe ne correspondent pas'
    isValid = false
  }
  
  if (!form.acceptTerms) {
    errors.terms = 'Vous devez accepter les conditions d\'utilisation'
    isValid = false
  }
  
  return isValid
}

// ✅ GESTION DE L'INSCRIPTION - UTILISE LE COMPOSABLE AUTH
const handleRegister = async () => {
  if (!validateForm()) return
  
  loading.value = true
  registerError.value = ''
  
  try {
    console.log('📝 Tentative d\'inscription...')
    
    // ✅ UTILISER LE COMPOSABLE AUTH
    const result = await auth.register({
      firstName: form.firstName.trim(),
      lastName: form.lastName.trim(),
      email: form.email.trim().toLowerCase(),
      company: form.company.trim(),
      platform: form.platform,
      password: form.password,
      newsletter: form.newsletter
    })
    
    if (!result.success) {
      throw new Error(result.error || 'Erreur d\'inscription')
    }
    
    console.log('✅ Inscription réussie!')
    // La navigation se fait automatiquement dans le composable auth
    
  } catch (error: any) {
    console.error('❌ Erreur d\'inscription:', error)
    
    // Messages d'erreur personnalisés
    if (error.message?.includes('email')) {
      registerError.value = 'Cette adresse email est déjà utilisée'
    } else if (error.message?.includes('validation')) {
      registerError.value = 'Veuillez vérifier les informations saisies'
    } else {
      registerError.value = error.message || 'Une erreur s\'est produite lors de la création du compte'
    }
  } finally {
    loading.value = false
  }
}

// Redirection si déjà connecté
onMounted(async () => {
  await auth.restoreSession()
  if (auth.isAuthenticated.value) {
    await navigateTo('/dashboard')
  }
})
</script>

<style scoped>
/* Animations pour les transitions */
.transition-colors {
  transition: color 0.15s ease-in-out, background-color 0.15s ease-in-out, border-color 0.15s ease-in-out;
}

/* Animation de rotation pour le spinner */
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