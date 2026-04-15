<!-- pages/register.vue -->
<template>
  <div class="w-full max-w-md mx-auto">
    <!-- Titre et sous-titre -->
    <div class="text-center mb-6">
      <h2 class="text-3xl sm:text-4xl font-bold bg-gradient-to-r from-gray-900 via-rose-800 to-purple-900 bg-clip-text text-transparent mb-3">
        Recrutez Mia pour votre boutique en ligne
      </h2>
      <p class="text-sm text-gray-600 leading-relaxed">
        Rejoignez les marques qui augmentent leurs ventes de <span class="font-semibold text-rose-600">+150%</span> grâce à Mia.
        <span class="font-semibold text-rose-600">14 jours d'essai</span>, sans engagement.
      </p>
    </div>

    <!-- Écran OTP (après inscription réussie) -->
    <div v-if="registrationSuccess" class="bg-white py-8 px-6 shadow-2xl rounded-2xl border border-rose-100 backdrop-blur-sm">
      <div class="text-center">
        <!-- Icône -->
        <div class="flex justify-center mb-5">
          <div class="w-16 h-16 bg-gradient-to-br from-rose-100 to-pink-100 rounded-full flex items-center justify-center">
            <svg class="w-8 h-8 text-rose-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M3 8l7.89 3.26a2 2 0 001.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z"/>
            </svg>
          </div>
        </div>

        <h3 class="text-xl font-bold text-gray-900 mb-2">
          Code envoyé !
        </h3>
        <p class="text-sm text-gray-500 mb-6 leading-relaxed">
          Entrez le code à 6 chiffres envoyé à<br>
          <strong class="text-rose-600">{{ form.email }}</strong>
        </p>

        <!-- 6 cases OTP -->
        <div class="flex justify-center gap-2 mb-6" @paste.prevent="handleOtpPaste">
          <input
            v-for="(_, idx) in 6"
            :key="idx"
            :ref="(el) => { if (el) otpRefs[idx] = el as HTMLInputElement }"
            v-model="otpDigits[idx]"
            type="text"
            inputmode="numeric"
            pattern="[0-9]*"
            maxlength="1"
            autocomplete="one-time-code"
            class="otp-box"
            :class="{
              'border-rose-500 ring-2 ring-rose-200': otpDigits[idx],
              'border-red-400 ring-2 ring-red-200': otpError && !otpLoading
            }"
            @input="handleOtpInput(idx)"
            @keydown="handleOtpKeydown(idx, $event)"
            @focus="($event.target as HTMLInputElement).select()"
          />
        </div>

        <!-- Erreur OTP -->
        <div v-if="otpError" class="mb-4 p-3 rounded-xl bg-red-50 border border-red-200">
          <p class="text-xs text-red-800 font-medium">{{ otpError }}</p>
        </div>

        <!-- Bouton vérifier (visible uniquement si auto-submit ne s'est pas déclenché) -->
        <button
          v-if="otpDigits.join('').length === 6 && !otpLoading"
          @click="handleOtpVerify"
          class="w-full flex justify-center items-center py-3 px-4 rounded-xl text-sm font-bold text-white bg-gradient-to-r from-rose-600 via-pink-600 to-purple-600 hover:from-rose-700 hover:via-pink-700 hover:to-purple-700 transition-all duration-300 shadow-xl mb-4"
        >
          Confirmer mon inscription
        </button>

        <!-- Loading -->
        <div v-if="otpLoading" class="flex justify-center items-center gap-2 py-3 mb-4 text-rose-600">
          <svg class="animate-spin h-5 w-5" fill="none" viewBox="0 0 24 24">
            <circle class="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" stroke-width="4"></circle>
            <path class="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
          </svg>
          <span class="text-sm font-medium">Vérification en cours...</span>
        </div>

        <!-- Renvoyer le code -->
        <button
          @click="resendOtp"
          :disabled="resendLoading || resendCooldown > 0"
          class="text-xs font-semibold transition-all duration-300 px-3 py-2 rounded-lg"
          :class="resendCooldown > 0 ? 'text-gray-400 cursor-not-allowed' : 'text-rose-600 hover:text-rose-800 hover:bg-rose-50'"
        >
          {{ resendCooldown > 0 ? `Renvoyer dans ${resendCooldown}s` : (resendLoading ? 'Renvoi...' : 'Renvoyer le code') }}
        </button>

        <!-- Changer d'email -->
        <div class="mt-4 pt-4 border-t border-gray-100">
          <button
            @click="registrationSuccess = false; otpDigits = Array(6).fill(''); otpError = ''"
            class="text-xs text-gray-400 hover:text-gray-600 transition-colors"
          >
            ← Modifier mon adresse email
          </button>
        </div>
      </div>
    </div>

    <!-- Formulaire d'inscription -->
    <div v-else class="bg-white/80 backdrop-blur-sm py-6 px-5 shadow-2xl rounded-2xl border border-rose-100">

      <!-- Bouton Google OAuth -->
      <button
        type="button"
        @click="handleGoogleSignIn"
        :disabled="googleLoading"
        class="w-full flex items-center justify-center gap-3 py-2.5 px-4 border-2 border-gray-200 rounded-xl text-sm font-semibold text-gray-700 bg-white hover:bg-gray-50 hover:border-gray-300 transition-all duration-200 mb-5"
      >
        <svg v-if="!googleLoading" class="w-5 h-5" viewBox="0 0 24 24">
          <path d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92a5.06 5.06 0 01-2.2 3.32v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.1z" fill="#4285F4"/>
          <path d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" fill="#34A853"/>
          <path d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z" fill="#FBBC05"/>
          <path d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z" fill="#EA4335"/>
        </svg>
        <svg v-else class="animate-spin w-5 h-5 text-gray-400" fill="none" viewBox="0 0 24 24">
          <circle class="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" stroke-width="4"></circle>
          <path class="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
        </svg>
        {{ googleLoading ? 'Connexion...' : 'Continuer avec Google' }}
      </button>

      <!-- Séparateur -->
      <div class="relative mb-5">
        <div class="absolute inset-0 flex items-center">
          <div class="w-full border-t border-gray-200" />
        </div>
        <div class="relative flex justify-center text-xs">
          <span class="px-3 bg-white text-gray-400">ou</span>
        </div>
      </div>

      <form @submit.prevent="handleRegister" class="space-y-4">

        <!-- Email -->
        <div>
          <label for="email" class="block text-sm font-semibold text-gray-700 mb-1">
            Adresse email
          </label>
          <input
            id="email"
            v-model="form.email"
            type="email"
            required
            autocomplete="email"
            class="w-full px-3 py-2.5 border border-rose-200 rounded-xl focus:ring-2 focus:ring-rose-500 focus:border-rose-500 transition-all duration-300 bg-white/50 backdrop-blur-sm text-gray-900 placeholder-gray-500 text-sm"
            placeholder="prenom@mamarque.com"
          />
        </div>

        <!-- Mot de passe -->
        <div>
          <label for="password" class="block text-sm font-semibold text-gray-700 mb-1">
            Mot de passe
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
          <p class="mt-1 text-xs text-gray-500">Minimum 8 caractères</p>
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
              <a href="https://chatseller.app/terms" class="font-semibold text-rose-600 hover:text-rose-800 transition-colors underline" target="_blank">conditions</a>
              et la
              <a href="https://chatseller.app/privacy" class="font-semibold text-rose-600 hover:text-rose-800 transition-colors underline" target="_blank">confidentialité</a>
            </label>
          </div>
        </div>

        <!-- Erreur -->
        <div v-if="registerError" class="p-3 rounded-xl bg-red-50 border border-red-200">
          <div class="flex">
            <svg class="h-4 w-4 text-red-400 flex-shrink-0 mt-0.5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-2.5L13.732 4c-.77-.833-1.964-.833-2.732 0L3.732 16c-.77.833.192 2.5 1.732 2.5z" />
            </svg>
            <p class="ml-2 text-xs text-red-800 font-medium">{{ registerError }}</p>
          </div>
        </div>

        <!-- Bouton inscription -->
        <button
          type="submit"
          :disabled="loading"
          class="w-full flex justify-center items-center py-3 px-4 border-0 rounded-xl text-sm font-bold text-white bg-gradient-to-r from-rose-600 via-pink-600 to-purple-600 hover:from-rose-700 hover:via-pink-700 hover:to-purple-700 focus:outline-none focus:ring-4 focus:ring-rose-300 disabled:opacity-50 disabled:cursor-not-allowed transition-all duration-300 shadow-xl hover:shadow-2xl transform hover:scale-105"
        >
          <svg v-if="loading" class="animate-spin -ml-1 mr-3 h-4 w-4 text-white" fill="none" viewBox="0 0 24 24">
            <circle class="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" stroke-width="4"></circle>
            <path class="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
          </svg>
          {{ loading ? 'Recrutement en cours...' : 'Essayer Mia pendant 14 jours' }}
        </button>

        <p class="text-center text-xs text-gray-500">14 jours d'essai, sans engagement</p>
      </form>

      <!-- Lien connexion -->
      <div class="mt-6">
        <div class="relative">
          <div class="absolute inset-0 flex items-center">
            <div class="w-full border-t border-rose-200" />
          </div>
          <div class="relative flex justify-center text-sm">
            <span class="px-3 bg-white rounded-xl text-rose-500 font-semibold">Mia vous attend déjà ?</span>
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
            Rejoindre Mia
          </NuxtLink>
        </div>
      </div>
    </div>

  </div>
</template>

<script setup lang="ts">
import { useSupabase } from '~~/composables/useSupabase'

const auth = useAuth()
const config = useRuntimeConfig()

definePageMeta({
  layout: 'auth'
})

// ── État formulaire ────────────────────────────────────────────────────────────
const loading = ref(false)
const googleLoading = ref(false)
const showPassword = ref(false)
const registerError = ref('')
const registrationSuccess = ref(false)

const form = reactive({
  email: '',
  password: '',
  acceptTerms: false
})

// ── État OTP ───────────────────────────────────────────────────────────────────
const otpDigits = ref(Array(6).fill('') as string[])
const otpRefs = ref([] as HTMLInputElement[])
const otpLoading = ref(false)
const otpError = ref('')
const resendLoading = ref(false)
const resendCooldown = ref(0)

// ── INSCRIPTION VIA GOOGLE OAUTH ───────────────────────────────────────────────
const handleGoogleSignIn = async () => {
  googleLoading.value = true
  registerError.value = ''
  try {
    const result = await auth.signInWithGoogle()
    if (!result.success) throw new Error(result.error || 'Erreur de connexion Google')
  } catch (error: any) {
    registerError.value = error.message || 'Erreur de connexion avec Google.'
    googleLoading.value = false
  }
}

// ── INSCRIPTION VIA EMAIL/PASSWORD ─────────────────────────────────────────────
const handleRegister = async () => {
  if (!validateForm()) return

  loading.value = true
  registerError.value = ''

  try {
    const result = await auth.register({
      email: form.email.trim().toLowerCase(),
      password: form.password,
      firstName: '',
      lastName: '',
      company: '',
      platform: '',
      newsletter: true
    })

    if (!result.success) throw new Error(result.error || 'Erreur de création de compte')

    // Afficher l'écran OTP et focus la première case
    registrationSuccess.value = true
    startResendCooldown()
    await nextTick()
    otpRefs.value[0]?.focus()

  } catch (error: any) {
    registerError.value = getErrorMessage(error)
  } finally {
    loading.value = false
  }
}

// ── OTP : SAISIE ───────────────────────────────────────────────────────────────
const handleOtpInput = async (idx: number) => {
  const val = otpDigits.value[idx]

  // Garder uniquement le dernier chiffre tapé (au cas où maxlength ne suffit pas)
  if (val && val.length > 1) {
    otpDigits.value[idx] = val.slice(-1)
  }

  // Autoriser uniquement les chiffres
  if (val && !/^\d$/.test(otpDigits.value[idx])) {
    otpDigits.value[idx] = ''
    return
  }

  otpError.value = ''

  // Avancer automatiquement au champ suivant
  if (otpDigits.value[idx] && idx < 5) {
    await nextTick()
    otpRefs.value[idx + 1]?.focus()
  }

  // Auto-submit quand les 6 cases sont remplies
  if (otpDigits.value.join('').length === 6) {
    await nextTick()
    handleOtpVerify()
  }
}

const handleOtpKeydown = (idx: number, event: KeyboardEvent) => {
  if (event.key === 'Backspace') {
    if (otpDigits.value[idx]) {
      otpDigits.value[idx] = ''
    } else if (idx > 0) {
      otpDigits.value[idx - 1] = ''
      otpRefs.value[idx - 1]?.focus()
    }
  } else if (event.key === 'ArrowLeft' && idx > 0) {
    otpRefs.value[idx - 1]?.focus()
  } else if (event.key === 'ArrowRight' && idx < 5) {
    otpRefs.value[idx + 1]?.focus()
  }
}

// Coller 6 chiffres depuis le presse-papier (ex: code copié depuis l'email)
const handleOtpPaste = async (event: ClipboardEvent) => {
  const pasted = event.clipboardData?.getData('text')?.replace(/\D/g, '').slice(0, 6)
  if (!pasted) return

  for (let i = 0; i < 6; i++) {
    otpDigits.value[i] = pasted[i] || ''
  }

  await nextTick()
  const lastFilled = Math.min(pasted.length - 1, 5)
  otpRefs.value[lastFilled]?.focus()

  if (pasted.length === 6) {
    handleOtpVerify()
  }
}

// ── OTP : VÉRIFICATION ─────────────────────────────────────────────────────────
const handleOtpVerify = async () => {
  const otp = otpDigits.value.join('')
  if (otp.length !== 6 || otpLoading.value) return

  otpLoading.value = true
  otpError.value = ''

  try {
    const supabase = useSupabase()

    const { data, error } = await supabase.auth.verifyOtp({
      email: form.email.trim().toLowerCase(),
      token: otp,
      type: 'signup'
    })

    if (error) throw error

    // Session disponible → créer le shop puis rediriger
    if (data.session && data.user) {
      await createShop(data.user.id, data.session.access_token)
    }

    // Full reload pour que le Supabase singleton relise la session depuis localStorage
    window.location.href = '/onboarding'

  } catch (error: any) {
    console.error('❌ [OTP] Erreur vérification:', error)
    otpError.value = getOtpErrorMessage(error)
    otpLoading.value = false
    // Vider les cases et refocus la première
    otpDigits.value = Array(6).fill('')
    await nextTick()
    otpRefs.value[0]?.focus()
  }
}

// ── CRÉATION DU SHOP APRÈS VÉRIFICATION ──────────────────────────────────────
const createShop = async (userId: string, accessToken: string) => {
  try {
    const baseURL = config.public.apiBaseUrl
    await $fetch('/api/v1/shops', {
      method: 'POST',
      baseURL,
      headers: {
        'Authorization': `Bearer ${accessToken}`,
        'Content-Type': 'application/json'
      },
      body: {
        id: userId,
        name: 'Ma Boutique',
        email: form.email.trim().toLowerCase(),
        subscription_plan: 'starter',
        is_active: true,
        widget_config: {
          theme: 'beauty_modern',
          primaryColor: '#E91E63',
          position: 'above-cta',
          buttonText: 'Parler à votre vendeuse beauté',
          language: 'fr'
        },
        agent_config: {
          name: 'Mia',
          title: 'Vendeuse IA',
          type: 'beauty_expert',
          avatar: `https://ui-avatars.com/api/?name=Mia&background=E91E63&color=fff`,
          welcomeMessage: 'Bonjour ! Je suis Mia, votre experte beauté. Comment puis-je vous aider ?',
          fallbackMessage: 'Je transmets votre question à notre équipe beauté.',
          collectBeautyProfile: true,
          upsellEnabled: true
        }
      }
    })
    console.log('✅ [Register] Shop créé après vérification OTP')
  } catch (err) {
    // Non bloquant — le shop peut être créé lors du premier chargement du dashboard
    console.warn('⚠️ [Register] Création shop échouée (sera re-tentée):', err)
  }
}

// ── RENVOYER LE CODE ──────────────────────────────────────────────────────────
const resendOtp = async () => {
  if (resendCooldown.value > 0 || resendLoading.value) return

  resendLoading.value = true
  otpError.value = ''

  try {
    const supabase = useSupabase()
    const { error } = await supabase.auth.resend({
      type: 'signup',
      email: form.email.trim().toLowerCase()
    })
    if (error) throw error

    otpDigits.value = Array(6).fill('')
    await nextTick()
    otpRefs.value[0]?.focus()
    startResendCooldown()

  } catch (error: any) {
    otpError.value = `Erreur lors du renvoi : ${error.message}`
  } finally {
    resendLoading.value = false
  }
}

// ── COOLDOWN ───────────────────────────────────────────────────────────────────
const startResendCooldown = () => {
  resendCooldown.value = 60
  const timer = setInterval(() => {
    resendCooldown.value--
    if (resendCooldown.value <= 0) clearInterval(timer)
  }, 1000)
}

// ── MESSAGES D'ERREUR ──────────────────────────────────────────────────────────
const getErrorMessage = (error: any): string => {
  const msg = error.message || error
  if (msg.includes('User already registered') || msg.includes('already registered'))
    return 'Cette adresse email est déjà utilisée. Essayez de vous connecter.'
  if (msg.includes('email')) return "Problème avec l'adresse email fournie"
  if (msg.includes('password')) return 'Le mot de passe doit contenir au moins 8 caractères'
  if (msg.includes('rate limit')) return 'Trop de tentatives. Veuillez patienter quelques minutes.'
  return msg || "Une erreur s'est produite lors de la création de votre compte"
}

const getOtpErrorMessage = (error: any): string => {
  const msg = error.message || ''
  if (msg.includes('expired') || msg.includes('expiré')) return 'Ce code a expiré. Cliquez sur "Renvoyer le code".'
  if (msg.includes('invalid') || msg.includes('Token')) return 'Code incorrect. Vérifiez et réessayez.'
  if (msg.includes('rate')) return 'Trop de tentatives. Patientez quelques minutes.'
  return 'Code incorrect. Vérifiez votre email et réessayez.'
}

// ── VALIDATION ─────────────────────────────────────────────────────────────────
const validateForm = () => {
  registerError.value = ''
  if (!form.email.trim() || !form.password || !form.acceptTerms) {
    registerError.value = 'Veuillez remplir tous les champs et accepter les conditions'
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

// ── REDIRECTION SI DÉJÀ CONNECTÉ ───────────────────────────────────────────────
onMounted(async () => {
  if (auth.isAuthenticated.value) {
    await navigateTo('/')
  }
})

// ── SEO ────────────────────────────────────────────────────────────────────────
useHead({
  title: 'Créer un compte - ChatSeller',
  meta: [
    { name: 'description', content: "Créez votre vendeuse IA beauté en 5 minutes. +150% de conversions en moyenne. 14 jours d'essai gratuits." }
  ]
})
</script>

<style scoped>
.otp-box {
  width: 44px;
  height: 54px;
  text-align: center;
  font-size: 22px;
  font-weight: 700;
  color: #1f2937;
  border: 2px solid #e5e7eb;
  border-radius: 12px;
  outline: none;
  transition: border-color 0.15s, box-shadow 0.15s;
  background: #fafafa;
  caret-color: transparent;
}

.otp-box:focus {
  border-color: #f43f5e;
  box-shadow: 0 0 0 3px rgba(244, 63, 94, 0.15);
  background: #fff;
}

@keyframes spin {
  from { transform: rotate(0deg); }
  to { transform: rotate(360deg); }
}
.animate-spin { animation: spin 1s linear infinite; }

.backdrop-blur-sm { backdrop-filter: blur(4px); }
.focus\:ring-rose-500:focus { box-shadow: 0 0 0 3px rgba(251, 113, 133, 0.1); }
</style>
