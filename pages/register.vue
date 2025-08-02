<!-- pages/register.vue - VERSION SIMPLIFIÉE -->
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
        Rejoignez ChatSeller
      </h2>
      <p class="mt-2 text-sm text-gray-600">
        Créez votre compte en 30 secondes
      </p>
    </div>

    <!-- Formulaire d'inscription simplifié -->
    <div class="bg-white py-8 px-6 shadow-xl rounded-xl border border-gray-100">
      
      <!-- ✅ MESSAGE DE CONFIRMATION EMAIL -->
      <div v-if="emailSent" class="text-center space-y-6">
        <div class="p-6 bg-green-50 border border-green-200 rounded-xl">
          <div class="flex justify-center mb-4">
            <div class="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center">
              <svg class="w-8 h-8 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M3 8l7.89 4.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z"/>
              </svg>
            </div>
          </div>
          <h3 class="text-lg font-semibold text-green-800 mb-2">Email de confirmation envoyé !</h3>
          <p class="text-sm text-green-700 mb-4">
            Nous venons d'envoyer un lien de confirmation à <strong>{{ form.email }}</strong>
          </p>
          <p class="text-xs text-green-600">
            Cliquez sur le lien dans l'email pour activer votre compte et continuer l'inscription.
          </p>
        </div>
        
        <div class="text-center">
          <p class="text-sm text-gray-600 mb-3">
            Vous n'avez pas reçu l'email ?
          </p>
          <button
            @click="resendConfirmation"
            :disabled="resendCooldown > 0"
            class="text-sm font-medium text-blue-600 hover:text-blue-700 disabled:text-gray-400 disabled:cursor-not-allowed"
          >
            {{ resendCooldown > 0 ? `Renvoyer dans ${resendCooldown}s` : 'Renvoyer l\'email' }}
          </button>
        </div>
      </div>

      <!-- ✅ FORMULAIRE SIMPLIFIÉ -->
      <form v-else @submit.prevent="handleRegister" class="space-y-6">
        <!-- Email -->
        <div>
          <label for="email" class="block text-sm font-medium text-gray-700 mb-2">
            Adresse email professionnelle
          </label>
          <input
            id="email"
            v-model="form.email"
            type="email"
            required
            autocomplete="email"
            class="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-colors"
            :class="{ 'border-red-500 focus:ring-red-500 focus:border-red-500': errors.email }"
            placeholder="votre@entreprise.com"
          />
          <p v-if="errors.email" class="mt-1 text-sm text-red-600">
            {{ errors.email }}
          </p>
        </div>

        <!-- Mot de passe -->
        <div>
          <label for="password" class="block text-sm font-medium text-gray-700 mb-2">
            Mot de passe
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
  </div>
</template>

<script setup lang="ts">
import { ref, reactive } from 'vue'

// Layout
definePageMeta({
  layout: 'auth'
})

// ✅ COMPOSABLE AUTH
const { $supabase } = useNuxtApp()

// État du composant
const loading = ref(false)
const showPassword = ref(false)
const registerError = ref('')
const emailSent = ref(false)
const resendCooldown = ref(0)

// ✅ FORMULAIRE SIMPLIFIÉ
const form = reactive({
  email: '',
  password: '',
  acceptTerms: false
})

// Erreurs de validation
const errors = reactive({
  email: '',
  password: '',
  terms: ''
})

// ✅ VALIDATION SIMPLIFIÉE
const validateForm = () => {
  // Reset errors
  Object.keys(errors).forEach(key => {
    errors[key as keyof typeof errors] = ''
  })
  
  let isValid = true
  
  if (!form.email.trim()) {
    errors.email = 'L\'adresse email est requise'
    isValid = false
  } else if (!form.email.includes('@') || !form.email.includes('.')) {
    errors.email = 'Veuillez saisir une adresse email valide'
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
  
  if (!form.acceptTerms) {
    errors.terms = 'Vous devez accepter les conditions d\'utilisation'
    isValid = false
  }
  
  return isValid
}

// ✅ INSCRIPTION SIMPLIFIÉE AVEC CONFIRMATION EMAIL
const handleRegister = async () => {
  if (!validateForm()) return
  
  loading.value = true
  registerError.value = ''
  
  try {
    console.log('📝 Inscription simplifiée...')
    
    // ✅ INSCRIPTION SUPABASE AVEC CONFIRMATION EMAIL
    const { data: authData, error: authError } = await $supabase.auth.signUp({
      email: form.email.trim().toLowerCase(),
      password: form.password,
      options: {
        emailRedirectTo: `${window.location.origin}/onboarding`
      }
    })

    if (authError) {
      console.error('❌ Erreur Supabase signup:', authError)
      throw new Error(authError.message)
    }

    if (authData.user) {
      console.log('✅ Inscription réussie, email de confirmation envoyé')
      emailSent.value = true
      startResendCooldown()
    } else {
      throw new Error('Erreur lors de la création du compte')
    }
    
  } catch (error: any) {
    console.error('❌ Erreur d\'inscription:', error)
    
    // Messages d'erreur personnalisés
    if (error.message?.includes('email')) {
      registerError.value = 'Cette adresse email est déjà utilisée'
    } else if (error.message?.includes('password')) {
      registerError.value = 'Le mot de passe ne respecte pas les critères'
    } else {
      registerError.value = error.message || 'Une erreur s\'est produite lors de la création du compte'
    }
  } finally {
    loading.value = false
  }
}

// ✅ RENVOYER EMAIL DE CONFIRMATION
const resendConfirmation = async () => {
  if (resendCooldown.value > 0) return
  
  try {
    const { error } = await $supabase.auth.resend({
      type: 'signup',
      email: form.email,
      options: {
        emailRedirectTo: `${window.location.origin}/onboarding`
      }
    })
    
    if (error) throw error
    
    console.log('✅ Email de confirmation renvoyé')
    startResendCooldown()
    
  } catch (error: any) {
    console.error('❌ Erreur renvoie email:', error)
  }
}

// ✅ COOLDOWN POUR ÉVITER LE SPAM
const startResendCooldown = () => {
  resendCooldown.value = 60
  const timer = setInterval(() => {
    resendCooldown.value--
    if (resendCooldown.value <= 0) {
      clearInterval(timer)
    }
  }, 1000)
}

// SEO
useHead({
  title: 'Inscription - ChatSeller',
  meta: [
    { name: 'description', content: 'Créez votre compte ChatSeller et transformez vos visiteurs en clients avec notre vendeur IA.' }
  ]
})
</script>

<style scoped>
/* Animations */
.transition-colors {
  transition: color 0.15s ease-in-out, background-color 0.15s ease-in-out, border-color 0.15s ease-in-out;
}

@keyframes spin {
  from { transform: rotate(0deg); }
  to { transform: rotate(360deg); }
}

.animate-spin {
  animation: spin 1s linear infinite;
}
</style>