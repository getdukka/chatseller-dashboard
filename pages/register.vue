<!-- pages/register.vue -->
<template>
  <div class="w-full max-w-md mx-auto">
    <!-- Logo et titre premium beauté -->
    <div class="text-center mb-6">
      <h2 class="text-4xl font-bold bg-gradient-to-r from-gray-900 via-rose-800 to-purple-900 bg-clip-text text-transparent mb-3">
        Créez et activez votre Conseillère IA
      </h2>
      <p class="text-sm text-gray-600 leading-relaxed mb-3">
        Rejoignez les marques beauté qui augmentent leurs conversions de
        <span class="font-semibold text-rose-600">+267%</span> grâce à Chatseller.
      </p>
      
      <!-- Badge premium -->
      <div class="inline-flex items-center px-3 py-1 bg-gradient-to-r from-rose-50 to-pink-50 border border-rose-200 rounded-full">
        <svg class="w-3 h-3 text-rose-500 mr-1" fill="currentColor" viewBox="0 0 24 24">
          <path d="M12 2l3.09 6.26L22 9.27l-5 4.87 1.18 6.88L12 17.77l-6.18 3.25L7 14.14 2 9.27l6.91-1.01L12 2z"/>
        </svg>
        <span class="text-xs font-semibold text-rose-700">14 jours d'essai gratuits - Conversions garanties</span>
      </div>
    </div>

    <!-- Message de succès après inscription -->
    <div v-if="registrationSuccess" class="bg-white py-6 px-5 shadow-2xl rounded-2xl border border-rose-100 backdrop-blur-sm">
      <div class="text-center">
        <div class="flex justify-center mb-4">
          <div class="w-14 h-14 bg-gradient-to-br from-green-100 to-emerald-100 rounded-full flex items-center justify-center">
            <svg class="w-7 h-7 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M3 8l7.89 3.26a2 2 0 001.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z"/>
            </svg>
          </div>
        </div>
        
        <h3 class="text-lg font-bold text-gray-900 mb-3">
          ✨ Confirmez votre email pour démarrer
        </h3>
        <p class="text-gray-600 mb-4 text-sm">
          Un email de confirmation a été envoyé à<br>
          <strong class="text-rose-600">{{ form.email }}</strong>
        </p>
        
        <!-- Étapes visuelles compactes -->
        <div class="bg-gradient-to-r from-rose-50 to-pink-50 border border-rose-200 rounded-xl p-3 mb-4">
          <h4 class="font-semibold text-rose-800 mb-2 text-xs">
            Prochaines étapes (3 minutes) :
          </h4>
          <div class="space-y-2 text-xs">
            <div class="flex items-center text-rose-700">
              <div class="w-5 h-5 bg-rose-500 text-white rounded-full flex items-center justify-center mr-2 text-xs font-bold">1</div>
              <div class="text-left">
                <div class="font-semibold">Confirmation de votre e-mail</div>
              </div>
            </div>
            <div class="flex items-center text-rose-700">
              <div class="w-5 h-5 bg-rose-500 text-white rounded-full flex items-center justify-center mr-2 text-xs font-bold">2</div>
              <div class="text-left">
                <div class="font-semibold">Configuration de votre compte</div>
              </div>
            </div>
            <div class="flex items-center text-rose-700">
              <div class="w-5 h-5 bg-rose-500 text-white rounded-full flex items-center justify-center mr-2 text-xs font-bold">3</div>
              <div class="text-left">
                <div class="font-semibold">Création de votre Conseillère IA</div>
              </div>
            </div>
          </div>
        </div>
        
        <!-- Boutons email compacts -->
        <div class="flex gap-2 mb-4">
          <a 
            :href="getGmailUrl(form.email)"
            target="_blank"
            class="flex-1 inline-flex items-center justify-center px-3 py-2 bg-gradient-to-r from-red-600 to-red-700 text-white rounded-xl hover:from-red-700 hover:to-red-800 transition-all duration-300 font-semibold shadow-lg hover:shadow-xl transform hover:scale-105 text-xs"
          >
            <svg class="w-3 h-3 mr-1" viewBox="0 0 24 24" fill="currentColor">
              <path d="M24 5.457v13.909c0 .904-.732 1.636-1.636 1.636h-3.819V11.73L12 16.64l-6.545-4.91v9.273H1.636A1.636 1.636 0 0 1 0 19.366V5.457c0-2.023 2.309-3.178 3.927-1.964L5.455 4.64 12 9.548l6.545-4.91 1.528-1.145C21.69 2.28 24 3.434 24 5.457z"/>
            </svg>
            Gmail
          </a>
          
          <a 
            :href="getOutlookUrl(form.email)"
            target="_blank"
            class="flex-1 inline-flex items-center justify-center px-3 py-2 bg-gradient-to-r from-blue-600 to-blue-700 text-white rounded-xl hover:from-blue-700 hover:to-blue-800 transition-all duration-300 font-semibold shadow-lg hover:shadow-xl transform hover:scale-105 text-xs"
          >
            <svg class="w-3 h-3 mr-1" viewBox="0 0 24 24" fill="currentColor">
              <path d="M7.88 12.04q0 .45-.11.87-.1.41-.33.74-.22.33-.58.52-.37.2-.87.2t-.85-.2q-.35-.21-.57-.55-.22-.33-.33-.75-.1-.42-.1-.83 0-.46.1-.87.1-.41.33-.74.22-.33.57-.52.36-.19.85-.19t.87.19q.36.19.58.52.22.33.33.74.11.41.11.87zM21.5 12v.13q0 2.06-1.32 3.54-1.32 1.48-3.5 1.48-2.04 0-3.44-1.48Q12 14.19 12 12.13v-.26q0-2.06 1.24-3.54 1.24-1.48 3.44-1.48 2.18 0 3.5 1.48Q21.5 9.81 21.5 12z"/>
            </svg>
            Outlook
          </a>
        </div>

        <!-- Troubleshooting compact -->
        <div class="bg-gradient-to-r from-amber-50 to-orange-50 border border-amber-200 rounded-xl p-3 mb-4">
          <div class="text-xs text-amber-800">
            <p class="font-semibold mb-1">Pas d'email ?</p>
            <div class="text-left space-y-1">
              <div>• Vérifiez vos spams</div>
              <div>• Patientez 2-3 minutes</div>
            </div>
          </div>
        </div>

        <!-- Bouton renvoyer -->
        <button
          @click="resendEmail"
          :disabled="resendLoading || resendCooldown > 0"
          class="text-xs font-semibold transition-all duration-300 px-3 py-2 rounded-lg"
          :class="resendCooldown > 0 ? 'text-gray-400 cursor-not-allowed bg-gray-100' : 'text-rose-600 hover:text-rose-800 hover:bg-rose-50 border border-rose-200'"
        >
          {{ resendCooldown > 0 ? `Renvoyer dans ${resendCooldown}s` : (resendLoading ? 'Renvoi en cours...' : 'Renvoyer l\'email') }}
        </button>
      </div>
    </div>

    <!-- Formulaire d'inscription optimisé -->
    <div v-else class="bg-white/80 backdrop-blur-sm py-6 px-5 shadow-2xl rounded-2xl border border-rose-100">
      <form @submit.prevent="handleRegister" class="space-y-4">
        
        <!-- Promesses conversion compactes -->
        <div class="text-center mb-4">
          <div class="grid grid-cols-3 gap-2 mb-3">
            <div class="text-center">
              <div class="w-8 h-8 bg-gradient-to-br from-rose-100 to-pink-100 rounded-lg flex items-center justify-center mx-auto mb-1">
                <svg class="w-4 h-4 text-rose-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M13 10V3L4 14h7v7l9-11h-7z" />
                </svg>
              </div>
              <div class="text-xs font-semibold text-gray-700">Installation</div>
              <div class="text-xs text-gray-500">2 minutes</div>
            </div>
            <div class="text-center">
              <div class="w-8 h-8 bg-gradient-to-br from-green-100 to-emerald-100 rounded-lg flex items-center justify-center mx-auto mb-1">
                <svg class="w-4 h-4 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M13 7h8m0 0v8m0-8l-8 8-4-4-6 6" />
                </svg>
              </div>
              <div class="text-xs font-semibold text-gray-700">Conversion</div>
              <div class="text-xs text-gray-500">+267% ventes</div>
            </div>
            <div class="text-center">
              <div class="w-8 h-8 bg-gradient-to-br from-purple-100 to-rose-100 rounded-lg flex items-center justify-center mx-auto mb-1">
                <svg class="w-4 h-4 text-purple-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z" />
                </svg>
              </div>
              <div class="text-xs font-semibold text-gray-700">Satisfaction</div>
              <div class="text-xs text-gray-500">94% clients</div>
            </div>
          </div>
        </div>
        
        <!-- Prénom et Nom -->
        <div class="grid grid-cols-2 gap-3">
          <div>
            <label for="firstName" class="block text-sm font-semibold text-gray-700 mb-1">
              Prénom *
            </label>
            <input
              id="firstName"
              v-model="form.firstName"
              type="text"
              required
              autocomplete="given-name"
              class="w-full px-3 py-2.5 border border-rose-200 rounded-xl focus:ring-2 focus:ring-rose-500 focus:border-rose-500 transition-all duration-300 bg-white/50 backdrop-blur-sm text-gray-900 placeholder-gray-500 text-sm"
              placeholder="Camille"
            />
          </div>

          <div>
            <label for="lastName" class="block text-sm font-semibold text-gray-700 mb-1">
              Nom *
            </label>
            <input
              id="lastName"
              v-model="form.lastName"
              type="text"
              required
              autocomplete="family-name"
              class="w-full px-3 py-2.5 border border-rose-200 rounded-xl focus:ring-2 focus:ring-rose-500 focus:border-rose-500 transition-all duration-300 bg-white/50 backdrop-blur-sm text-gray-900 placeholder-gray-500 text-sm"
              placeholder="Martin"
            />
          </div>
        </div>

        <!-- Email -->
        <div>
          <label for="email" class="block text-sm font-semibold text-gray-700 mb-1">
            Email professionnel *
          </label>
          <input
            id="email"
            v-model="form.email"
            type="email"
            required
            autocomplete="email"
            class="w-full px-3 py-2.5 border border-rose-200 rounded-xl focus:ring-2 focus:ring-rose-500 focus:border-rose-500 transition-all duration-300 bg-white/50 backdrop-blur-sm text-gray-900 placeholder-gray-500 text-sm"
            placeholder="camille@belle-etoile.fr"
          />
          <p class="mt-1 text-xs text-gray-500">
            Pour personnaliser votre expérience
          </p>
        </div>

        <!-- Mot de passe -->
        <div>
          <label for="password" class="block text-sm font-semibold text-gray-700 mb-1">
            Mot de passe *
          </label>
          <div class="relative">
            <input
              id="password"
              v-model="form.password"
              :type="showPassword ? 'text' : 'password'"
              required
              autocomplete="new-password"
              class="w-full px-3 py-2.5 pr-10 border border-rose-200 rounded-xl focus:ring-2 focus:ring-rose-500 focus:border-rose-500 transition-all duration-300 bg-white/50 backdrop-blur-sm text-gray-900 placeholder-gray-500 text-sm"
              placeholder="••••••••"
            />
            <button
              type="button"
              @click="showPassword = !showPassword"
              class="absolute inset-y-0 right-0 pr-3 flex items-center text-rose-400 hover:text-rose-600 transition-colors duration-200"
            >
              <svg v-if="!showPassword" class="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" />
              </svg>
              <svg v-else class="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M13.875 18.825A10.05 10.05 0 0112 19c-4.478 0-8.268-2.943-9.543-7a9.97 9.97 0 011.563-3.029m5.858.908a3 3 0 114.243 4.243M9.878 9.878l4.242 4.242M9.878 9.878L3 3m6.878 6.878L21 21" />
              </svg>
            </button>
          </div>
          <p class="mt-1 text-xs text-gray-500">
            Minimum 8 caractères
          </p>
        </div>

        <!-- Conditions -->
        <div class="flex items-start">
          <div class="flex items-center h-5 mt-0.5">
            <input
              id="terms"
              v-model="form.acceptTerms"
              type="checkbox"
              required
              class="h-4 w-4 text-rose-600 focus:ring-rose-500 border-rose-300 rounded transition-colors duration-200"
            />
          </div>
          <div class="ml-2 text-xs leading-relaxed">
            <label for="terms" class="text-gray-700">
              J'accepte les 
              <a href="https://chatseller.app/terms" class="font-semibold text-rose-600 hover:text-rose-800 transition-colors underline" target="_blank">
                conditions
              </a>
              et la 
              <a href="https://chatseller.app/privacy" class="font-semibold text-rose-600 hover:text-rose-800 transition-colors underline" target="_blank">
                confidentialité
              </a>
            </label>
          </div>
        </div>

        <!-- Erreur -->
        <div v-if="registerError" class="p-3 rounded-xl bg-red-50 border border-red-200">
          <div class="flex">
            <svg class="h-4 w-4 text-red-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-2.5L13.732 4c-.77-.833-1.964-.833-2.732 0L3.732 16c-.77.833.192 2.5 1.732 2.5z" />
            </svg>
            <div class="ml-2">
              <p class="text-xs text-red-800 font-medium">
                {{ registerError }}
              </p>
            </div>
          </div>
        </div>

        <!-- Bouton inscription optimisé -->
        <button
          type="submit"
          :disabled="loading"
          class="w-full flex justify-center items-center py-3 px-4 border-0 rounded-xl text-sm font-bold text-white bg-gradient-to-r from-rose-600 via-pink-600 to-purple-600 hover:from-rose-700 hover:via-pink-700 hover:to-purple-700 focus:outline-none focus:ring-4 focus:ring-rose-300 disabled:opacity-50 disabled:cursor-not-allowed transition-all duration-300 shadow-xl hover:shadow-2xl transform hover:scale-105"
        >
          <svg v-if="loading" class="animate-spin -ml-1 mr-3 h-4 w-4 text-white" fill="none" viewBox="0 0 24 24">
            <circle class="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" stroke-width="4"></circle>
            <path class="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
          </svg>
          <svg v-else class="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M13 7h8m0 0v8m0-8l-8 8-4-4-6 6"/>
          </svg>
          {{ loading ? 'Préparation de votre solution...' : 'Commencer l\'essai gratuit' }}
        </button>
      </form>

      <!-- Séparateur simplifié -->
      <div class="mt-6">
        <div class="relative">
          <div class="absolute inset-0 flex items-center">
            <div class="w-full border-t border-rose-200" />
          </div>
          <div class="relative flex justify-center text-sm">
            <span class="px-3 bg-white rounded-xl text-rose-500 font-semibold">Déjà client ?</span>
          </div>
        </div>

        <div class="mt-4 text-center">
          <NuxtLink
            to="/login"
            class="inline-flex items-center px-4 py-2 border border-rose-300 rounded-xl text-sm font-semibold text-rose-700 bg-gradient-to-r from-rose-50 to-pink-50 hover:from-rose-100 hover:to-pink-100 transition-all duration-300 shadow-md hover:shadow-lg transform hover:scale-105"
          >
            <svg class="mr-2 h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M11 16l-4-4m0 0l4-4m-4 4h14m-5 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1" />
            </svg>
            Accéder à mon compte Chatseller
          </NuxtLink>
        </div>
      </div>
    </div>

    <!-- Support compact -->
    <div class="mt-6 text-center">
      <div class="flex flex-col gap-1 justify-center items-center">
        <a 
          href="https://chatseller.app/support" 
          class="font-semibold text-rose-600 hover:text-rose-800 transition-colors inline-flex items-center text-sm"
        >
          <svg class="w-3 h-3 mr-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M8.228 9c.549-1.165 2.03-2 3.772-2 2.21 0 4 1.343 4 3 0 1.4-1.278 2.575-3.006 2.907-.542.104-.994.54-.994 1.093m0 3h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
          </svg>
          Contacter le Support 
        </a>
        <span class="text-xs text-gray-500">
          Réponse sous 2h
        </span>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { useSupabase } from '~~/composables/useSupabase'

// ✅ UTILISATION DU COMPOSABLE AUTH CORRIGÉ
const auth = useAuth()

// Layout
definePageMeta({
  layout: 'auth'
})

// État du composant
const loading = ref(false)
const showPassword = ref(false)
const registerError = ref('')
const registrationSuccess = ref(false)
const resendLoading = ref(false)
const resendCooldown = ref(0)

// Formulaire avec placeholders beauté
const form = reactive({
  firstName: '',
  lastName: '',
  email: '',
  password: '',
  acceptTerms: false
})

// ✅ INSCRIPTION VIA COMPOSABLE AUTH
const handleRegister = async () => {
  if (!validateForm()) return
  
  loading.value = true
  registerError.value = ''
  
  try {
    console.log('📝 [Register ] Inscription via composable auth...')
    
    const result = await auth.register({
      email: form.email.trim().toLowerCase(),
      password: form.password,
      firstName: form.firstName.trim(),
      lastName: form.lastName.trim(),
      company: '',
      platform: '',
      newsletter: true
    })
    
    if (!result.success) {
      throw new Error(result.error || 'Erreur de création de compte')
    }
    
    console.log('✅ [Register ] Inscription réussie')
    registrationSuccess.value = true
    startResendCooldown()
    
  } catch (error: any) {
    console.error('❌ [Register ] Erreur inscription:', error)
    registerError.value = getErrorMessage(error)
  } finally {
    loading.value = false
  }
}

// ✅ MESSAGES D'ERREUR PERSONNALISÉS BEAUTÉ
const getErrorMessage = (error: any): string => {
  const message = error.message || error
  
  if (message.includes('User already registered') || message.includes('already registered')) {
    return 'Cette adresse email est déjà utilisée. Essayez de vous connecter.'
  }
  
  if (message.includes('email')) {
    return 'Problème avec l\'adresse email fournie'
  }
  
  if (message.includes('password')) {
    return 'Le mot de passe ne respecte pas les critères (minimum 8 caractères)'
  }
  
  if (message.includes('rate limit')) {
    return 'Trop de tentatives. Veuillez patienter quelques minutes.'
  }
  
  return message || 'Une erreur s\'est produite lors de la création de votre compte'
}

// ✅ VALIDATION
const validateForm = () => {
  registerError.value = ''
  
  if (!form.firstName.trim() || !form.lastName.trim() || !form.email.trim() || !form.password || !form.acceptTerms) {
    registerError.value = 'Veuillez remplir tous les champs obligatoires'
    return false
  }
  
  if (form.password.length < 8) {
    registerError.value = 'Le mot de passe doit contenir au moins 8 caractères'
    return false
  }
  
  if (!form.email.includes('@') || !form.email.includes('.')) {
    registerError.value = 'Veuillez saisir une adresse email valide'
    return false
  }
  
  return true
}

// ✅ RENVOYER EMAIL
const resendEmail = async () => {
  if (resendCooldown.value > 0) return
  
  resendLoading.value = true
  
  try {
    console.log('🔄 [Register Beauty] Renvoi email de confirmation...')
    
    // ✅ UTILISER SUPABASE DIRECTEMENT POUR RENVOYER EMAIL CONFIRMATION
    const supabase = useSupabase()
    
    const { error } = await supabase.auth.resend({
      type: 'signup',
      email: form.email.trim().toLowerCase()
    })
    
    if (error) {
      throw new Error(error.message)
    }
    
    console.log('✅ [Register Beauty] Email de confirmation renvoyé')
    startResendCooldown()
    
  } catch (error: any) {
    console.error('❌ [Register Beauty] Erreur renvoi email:', error)
    registerError.value = `Erreur lors du renvoi: ${error.message}`
  } finally {
    resendLoading.value = false
  }
}

// ✅ COOLDOWN
const startResendCooldown = () => {
  resendCooldown.value = 60
  const timer = setInterval(() => {
    resendCooldown.value--
    if (resendCooldown.value <= 0) {
      clearInterval(timer)
    }
  }, 1000)
}

// Générer URL Gmail
const getGmailUrl = (email: string) => {
  const domain = email.split('@')[1]
  if (domain === 'gmail.com') {
    return 'https://mail.google.com/mail/u/0/#inbox'
  }
  return 'https://mail.google.com/'
}

// Générer URL Outlook
const getOutlookUrl = (email: string) => {
  const domain = email.split('@')[1]
  if (['outlook.com', 'hotmail.com', 'live.com'].includes(domain)) {
    return 'https://outlook.live.com/mail/0/inbox'
  }
  return 'https://outlook.office.com/mail/'
}

// ✅ REDIRECTION SI DÉJÀ CONNECTÉ
onMounted(async () => {
  if (auth.isAuthenticated.value) {
    await navigateTo('/')
  }
})

// ✅ SEO BEAUTÉ
useHead({
  title: 'Boostez vos ventes beauté de 267% - ChatSeller',
  meta: [
    { name: 'description', content: 'Offrez l\'expérience conseil d\'une boutique physique premium directement sur votre site beauté. +267% de conversions garanties.' },
    { name: 'keywords', content: 'conversion beauté, ventes beauté, conseil en ligne, marque beauté, skincare, maquillage' }
  ]
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

/* Animations premium */
.transform {
  transition: transform 0.3s ease;
}

.hover\\:scale-105:hover {
  transform: scale(1.05);
}

/* Effet glassmorphism */
.backdrop-blur-sm {
  backdrop-filter: blur(4px);
}

/* Focus states premium */
.focus\\:ring-rose-500:focus {
  box-shadow: 0 0 0 3px rgba(251, 113, 133, 0.1);
}
</style>