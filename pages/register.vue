<!-- pages/register.vue -->
<template>
  <div class="min-h-screen flex items-center justify-center bg-gray-50 py-12 px-4 sm:px-6 lg:px-8">
    <div class="max-w-md w-full space-y-8">
      <!-- Header -->
      <div class="text-center">
        <div class="mx-auto h-12 w-12 bg-blue-600 rounded-xl flex items-center justify-center">
          <span class="text-white font-bold text-lg">CS</span>
        </div>
        <h2 class="mt-6 text-3xl font-extrabold text-gray-900">
          Créer votre compte ChatSeller
        </h2>
        <p class="mt-2 text-sm text-gray-600">
          Démarrez votre essai gratuit de 3 jours
        </p>
      </div>

      <!-- Benefits banner -->
      <div class="bg-blue-50 border border-blue-200 rounded-lg p-4">
        <div class="flex items-center">
          <SparklesIcon class="h-5 w-5 text-blue-500 mr-2" />
          <span class="text-sm font-medium text-blue-800">
            🚀 Augmentez vos conversions de 30% en moyenne
          </span>
        </div>
      </div>

      <!-- Form -->
      <div class="bg-white rounded-lg shadow-md p-8">
        <form @submit.prevent="handleSubmit" class="space-y-6">
          <!-- Name fields -->
          <div class="grid grid-cols-2 gap-4">
            <div>
              <label for="firstName" class="sr-only">Prénom</label>
              <input
                id="firstName"
                v-model="form.firstName"
                type="text"
                autocomplete="given-name"
                required
                class="block w-full px-3 py-3 border border-gray-300 rounded-md leading-5 bg-white placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
                :class="{ 'border-red-300 focus:ring-red-500 focus:border-red-500': errors.firstName }"
                placeholder="Prénom"
              />
              <p v-if="errors.firstName" class="mt-1 text-xs text-red-600">{{ errors.firstName }}</p>
            </div>
            
            <div>
              <label for="lastName" class="sr-only">Nom</label>
              <input
                id="lastName"
                v-model="form.lastName"
                type="text"
                autocomplete="family-name"
                required
                class="block w-full px-3 py-3 border border-gray-300 rounded-md leading-5 bg-white placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
                :class="{ 'border-red-300 focus:ring-red-500 focus:border-red-500': errors.lastName }"
                placeholder="Nom"
              />
              <p v-if="errors.lastName" class="mt-1 text-xs text-red-600">{{ errors.lastName }}</p>
            </div>
          </div>

          <!-- Email field -->
          <div>
            <label for="email" class="sr-only">Adresse email</label>
            <div class="relative">
              <div class="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                <EnvelopeIcon class="h-5 w-5 text-gray-400" />
              </div>
              <input
                id="email"
                v-model="form.email"
                type="email"
                autocomplete="email"
                required
                class="block w-full pl-10 pr-3 py-3 border border-gray-300 rounded-md leading-5 bg-white placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
                :class="{ 'border-red-300 focus:ring-red-500 focus:border-red-500': errors.email }"
                placeholder="votre@email.com"
              />
            </div>
            <p v-if="errors.email" class="mt-2 text-sm text-red-600">{{ errors.email }}</p>
          </div>

          <!-- Company field -->
          <div>
            <label for="company" class="sr-only">Entreprise</label>
            <div class="relative">
              <div class="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                <BuildingOfficeIcon class="h-5 w-5 text-gray-400" />
              </div>
              <input
                id="company"
                v-model="form.company"
                type="text"
                autocomplete="organization"
                required
                class="block w-full pl-10 pr-3 py-3 border border-gray-300 rounded-md leading-5 bg-white placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
                :class="{ 'border-red-300 focus:ring-red-500 focus:border-red-500': errors.company }"
                placeholder="Nom de votre entreprise"
              />
            </div>
            <p v-if="errors.company" class="mt-2 text-sm text-red-600">{{ errors.company }}</p>
          </div>

          <!-- Website field -->
          <div>
            <label for="website" class="sr-only">Site web</label>
            <div class="relative">
              <div class="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                <GlobeAltIcon class="h-5 w-5 text-gray-400" />
              </div>
              <input
                id="website"
                v-model="form.website"
                type="url"
                autocomplete="url"
                class="block w-full pl-10 pr-3 py-3 border border-gray-300 rounded-md leading-5 bg-white placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
                :class="{ 'border-red-300 focus:ring-red-500 focus:border-red-500': errors.website }"
                placeholder="https://votre-site.com (optionnel)"
              />
            </div>
            <p v-if="errors.website" class="mt-2 text-sm text-red-600">{{ errors.website }}</p>
          </div>

          <!-- Password field -->
          <div>
            <label for="password" class="sr-only">Mot de passe</label>
            <div class="relative">
              <div class="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                <LockClosedIcon class="h-5 w-5 text-gray-400" />
              </div>
              <input
                id="password"
                v-model="form.password"
                :type="showPassword ? 'text' : 'password'"
                autocomplete="new-password"
                required
                class="block w-full pl-10 pr-10 py-3 border border-gray-300 rounded-md leading-5 bg-white placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
                :class="{ 'border-red-300 focus:ring-red-500 focus:border-red-500': errors.password }"
                placeholder="Mot de passe (min. 8 caractères)"
              />
              <button
                type="button"
                @click="showPassword = !showPassword"
                class="absolute inset-y-0 right-0 pr-3 flex items-center"
              >
                <EyeIcon v-if="!showPassword" class="h-5 w-5 text-gray-400 hover:text-gray-600" />
                <EyeSlashIcon v-else class="h-5 w-5 text-gray-400 hover:text-gray-600" />
              </button>
            </div>
            <p v-if="errors.password" class="mt-2 text-sm text-red-600">{{ errors.password }}</p>
            
            <!-- Password strength indicator -->
            <div class="mt-2">
              <div class="flex space-x-1">
                <div
                  v-for="i in 4"
                  :key="i"
                  class="h-1 w-full rounded-full"
                  :class="getPasswordStrengthColor(i)"
                ></div>
              </div>
              <p class="mt-1 text-xs text-gray-600">{{ passwordStrengthText }}</p>
            </div>
          </div>

          <!-- Terms and conditions -->
          <div class="flex items-start">
            <input
              id="terms"
              v-model="form.acceptTerms"
              type="checkbox"
              required
              class="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 rounded mt-1"
            />
            <label for="terms" class="ml-2 block text-sm text-gray-900">
              J'accepte les
              <a href="https://chatseller.app/terms" class="text-blue-600 hover:text-blue-500 underline">conditions d'utilisation</a>
              et la
              <a href="https://chatseller.app/privacy" class="text-blue-600 hover:text-blue-500 underline">politique de confidentialité</a>
            </label>
          </div>

          <!-- Error message -->
          <div v-if="error" class="bg-red-50 border border-red-200 rounded-md p-4">
            <div class="flex">
              <ExclamationCircleIcon class="h-5 w-5 text-red-400" />
              <div class="ml-3">
                <h3 class="text-sm font-medium text-red-800">
                  Erreur lors de l'inscription
                </h3>
                <div class="mt-2 text-sm text-red-700">
                  {{ error }}
                </div>
              </div>
            </div>
          </div>

          <!-- Success message -->
          <div v-if="success" class="bg-green-50 border border-green-200 rounded-md p-4">
            <div class="flex">
              <CheckCircleIcon class="h-5 w-5 text-green-400" />
              <div class="ml-3">
                <h3 class="text-sm font-medium text-green-800">
                  Compte créé avec succès !
                </h3>
                <div class="mt-2 text-sm text-green-700">
                  Vérifiez votre email pour confirmer votre compte.
                </div>
              </div>
            </div>
          </div>

          <!-- Submit button -->
          <div>
            <button
              type="submit"
              :disabled="loading || !form.acceptTerms"
              class="group relative w-full flex justify-center py-3 px-4 border border-transparent text-sm font-medium rounded-md text-white bg-blue-500 hover:bg-blue-600 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
            >
              <span class="absolute left-0 inset-y-0 flex items-center pl-3">
                <SparklesIcon class="h-5 w-5 text-blue-500 group-hover:text-blue-400" />
              </span>
              <span v-if="loading" class="flex items-center">
                <svg class="animate-spin -ml-1 mr-3 h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                  <circle class="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" stroke-width="4"></circle>
                  <path class="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                </svg>
                Création du compte...
              </span>
              <span v-else>Démarrer mon essai gratuit</span>
            </button>
          </div>

          <!-- Sign in link -->
          <div class="text-center">
            <p class="text-sm text-gray-600">
              Vous avez déjà un compte ?
              <NuxtLink to="/login" class="font-medium text-blue-500 hover:text-blue-600">
                Se connecter
              </NuxtLink>
            </p>
          </div>
        </form>
      </div>

      <!-- Security & guarantees -->
      <div class="text-center space-y-4">
        <div class="flex justify-center space-x-6">
          <div class="flex items-center text-gray-400">
            <CreditCardIcon class="h-4 w-4 mr-1" />
            <span class="text-xs">Aucune carte requise</span>
          </div>
          <div class="flex items-center text-gray-400">
            <ShieldCheckIcon class="h-4 w-4 mr-1" />
            <span class="text-xs">Données sécurisées</span>
          </div>
          <div class="flex items-center text-gray-400">
            <ClockIcon class="h-4 w-4 mr-1" />
            <span class="text-xs">Annulation facile</span>
          </div>
        </div>
        
        <p class="text-xs text-gray-500">
          Rejoignez plus de 500+ e-commerçants qui augmentent leurs ventes avec ChatSeller
        </p>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import {
  EnvelopeIcon,
  LockClosedIcon,
  EyeIcon,
  EyeSlashIcon,
  BuildingOfficeIcon,
  GlobeAltIcon,
  SparklesIcon,
  ExclamationCircleIcon,
  CheckCircleIcon,
  CreditCardIcon,
  ShieldCheckIcon,
  ClockIcon
} from '@heroicons/vue/24/outline'
import { useAuth } from '~/composables/useAuth'

// Seo
definePageMeta({
  layout: false,
  title: 'Inscription - ChatSeller Dashboard'
})

useSeoMeta({
  title: 'Inscription - ChatSeller Dashboard',
  description: 'Créez votre compte ChatSeller et démarrez votre essai gratuit de 3 jours'
})

// Auth
const { signUp } = useAuth()
const router = useRouter()

// Form state
const form = reactive({
  firstName: '',
  lastName: '',
  email: '',
  company: '',
  website: '',
  password: '',
  acceptTerms: false
})

const errors = reactive({
  firstName: '',
  lastName: '',
  email: '',
  company: '',
  website: '',
  password: ''
})

const showPassword = ref(false)
const loading = ref(false)
const error = ref('')
const success = ref(false)

// Password strength
const passwordStrength = computed(() => {
  const password = form.password
  let strength = 0
  
  if (password.length >= 8) strength++
  if (/[a-z]/.test(password)) strength++
  if (/[A-Z]/.test(password)) strength++
  if (/[0-9]/.test(password)) strength++
  if (/[^A-Za-z0-9]/.test(password)) strength++
  
  return Math.min(strength, 4)
})

const passwordStrengthText = computed(() => {
  switch (passwordStrength.value) {
    case 0:
    case 1:
      return 'Mot de passe faible'
    case 2:
      return 'Mot de passe moyen'
    case 3:
      return 'Mot de passe fort'
    case 4:
      return 'Mot de passe très fort'
    default:
      return ''
  }
})

const getPasswordStrengthColor = (index: number) => {
  if (index <= passwordStrength.value) {
    switch (passwordStrength.value) {
      case 1:
        return 'bg-red-400'
      case 2:
        return 'bg-yellow-400'
      case 3:
        return 'bg-blue-400'
      case 4:
        return 'bg-green-400'
      default:
        return 'bg-gray-200'
    }
  }
  return 'bg-gray-200'
}

// Validation rules
const validateForm = () => {
  errors.firstName = ''
  errors.lastName = ''
  errors.email = ''
  errors.company = ''
  errors.website = ''
  errors.password = ''
  
  let isValid = true
  
  if (!form.firstName.trim()) {
    errors.firstName = 'Le prénom est requis'
    isValid = false
  }
  
  if (!form.lastName.trim()) {
    errors.lastName = 'Le nom est requis'
    isValid = false
  }
  
  if (!form.email) {
    errors.email = 'L\'adresse email est requise'
    isValid = false
  } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(form.email)) {
    errors.email = 'L\'adresse email n\'est pas valide'
    isValid = false
  }
  
  if (!form.company.trim()) {
    errors.company = 'Le nom de l\'entreprise est requis'
    isValid = false
  }
  
  if (form.website && !/^https?:\/\/.+/.test(form.website)) {
    errors.website = 'L\'URL doit commencer par http:// ou https://'
    isValid = false
  }
  
  if (!form.password) {
    errors.password = 'Le mot de passe est requis'
    isValid = false
  } else if (form.password.length < 8) {
    errors.password = 'Le mot de passe doit contenir au moins 8 caractères'
    isValid = false
  }
  
  return isValid
}

// Handle form submission
const handleSubmit = async () => {
  if (!validateForm()) return
  
  loading.value = true
  error.value = ''
  success.value = false
  
  try {
    const { data, error: authError } = await signUp(
      form.email,
      form.password,
      {
        firstName: form.firstName,
        lastName: form.lastName,
        company: form.company,
        website: form.website
      }
    )
    
    if (authError) {
      switch (authError.message) {
        case 'User already registered':
          error.value = 'Un compte existe déjà avec cette adresse email'
          break
        case 'Password should be at least 6 characters':
          error.value = 'Le mot de passe doit contenir au moins 6 caractères'
          break
        case 'Signup requires a valid password':
          error.value = 'Le mot de passe n\'est pas valide'
          break
        default:
          error.value = 'Une erreur est survenue lors de l\'inscription'
      }
      return
    }
    
    if (data?.user) {
      success.value = true
      
      // Si l'utilisateur est automatiquement confirmé
      if (data.session) {
        setTimeout(() => {
          router.push('/')
        }, 2000)
      }
    }
  } catch (err) {
    console.error('Registration error:', err)
    error.value = 'Une erreur inattendue est survenue'
  } finally {
    loading.value = false
  }
}

// Auto-focus on first name field
onMounted(() => {
  const firstNameInput = document.getElementById('firstName')
  if (firstNameInput) {
    firstNameInput.focus()
  }
})
</script>