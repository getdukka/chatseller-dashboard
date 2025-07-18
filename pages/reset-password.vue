<script setup lang="ts">
import {
  EnvelopeIcon,
  PaperAirplaneIcon,
  ExclamationCircleIcon,
  CheckCircleIcon,
  ArrowLeftIcon
} from '@heroicons/vue/24/outline'

// Seo
definePageMeta({
  layout: false,
  title: 'Réinitialisation du mot de passe - ChatSeller'
})

useSeoMeta({
  title: 'Réinitialisation du mot de passe - ChatSeller',
  description: 'Réinitialisez votre mot de passe ChatSeller'
})

// Auth
const { resetPassword } = useAuth()

// Form state
const form = reactive({
  email: ''
})

const errors = reactive({
  email: ''
})

const loading = ref(false)
const error = ref('')
const success = ref(false)
const resendCooldown = ref(0)

// Validation
const validateForm = () => {
  errors.email = ''
  
  if (!form.email) {
    errors.email = 'L\'adresse email est requise'
    return false
  }
  
  if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(form.email)) {
    errors.email = 'L\'adresse email n\'est pas valide'
    return false
  }
  
  return true
}

// Handle form submission
const handleSubmit = async () => {
  if (!validateForm()) return
  
  loading.value = true
  error.value = ''
  
  try {
    const { error: authError } = await resetPassword(form.email)
    
    if (authError) {
      switch (authError.message) {
        case 'User not found':
          error.value = 'Aucun compte trouvé avec cette adresse email'
          break
        case 'Email rate limit exceeded':
          error.value = 'Trop de demandes. Veuillez réessayer plus tard'
          break
        default:
          error.value = 'Une erreur est survenue. Veuillez réessayer'
      }
      return
    }
    
    success.value = true
    startResendCooldown()
  } catch (err) {
    console.error('Reset password error:', err)
    error.value = 'Une erreur inattendue est survenue'
  } finally {
    loading.value = false
  }
}

// Resend email
const resendEmail = async () => {
  if (resendCooldown.value > 0) return
  
  await handleSubmit()
}

// Start cooldown timer
const startResendCooldown = () => {
  resendCooldown.value = 60
  const timer = setInterval(() => {
    resendCooldown.value--
    if (resendCooldown.value <= 0) {
      clearInterval(timer)
    }
  }, 1000)
}

// Auto-focus on email field
onMounted(() => {
  const emailInput = document.getElementById('email')
  if (emailInput) {
    emailInput.focus()
  }
})
</script>