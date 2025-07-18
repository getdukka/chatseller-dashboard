<script setup lang="ts">
import {
  EnvelopeIcon,
  LockClosedIcon,
  EyeIcon,
  EyeSlashIcon,
  ExclamationCircleIcon,
  CheckIcon,
  ShieldCheckIcon,
  ClockIcon
} from '@heroicons/vue/24/outline'

// Seo
definePageMeta({
  layout: false,
  title: 'Connexion - ChatSeller Dashboard'
})

useSeoMeta({
  title: 'Connexion - ChatSeller Dashboard',
  description: 'Connectez-vous à votre dashboard ChatSeller pour gérer votre Agent IA Commercial'
})

// Auth
const { signIn } = useAuth()
const router = useRouter()

// Form state
const form = reactive({
  email: '',
  password: '',
  rememberMe: false
})

const errors = reactive({
  email: '',
  password: ''
})

const showPassword = ref(false)
const loading = ref(false)
const error = ref('')

// Validation rules
const validateForm = () => {
  errors.email = ''
  errors.password = ''
  
  if (!form.email) {
    errors.email = 'L\'adresse email est requise'
    return false
  }
  
  if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(form.email)) {
    errors.email = 'L\'adresse email n\'est pas valide'
    return false
  }
  
  if (!form.password) {
    errors.password = 'Le mot de passe est requis'
    return false
  }
  
  if (form.password.length < 6) {
    errors.password = 'Le mot de passe doit contenir au moins 6 caractères'
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
    const { data, error: authError } = await signIn(form.email, form.password)
    
    if (authError) {
      switch (authError.message) {
        case 'Invalid login credentials':
          error.value = 'Email ou mot de passe incorrect'
          break
        case 'Email not confirmed':
          error.value = 'Veuillez confirmer votre email avant de vous connecter'
          break
        case 'Too many requests':
          error.value = 'Trop de tentatives de connexion. Veuillez réessayer plus tard'
          break
        default:
          error.value = 'Une erreur est survenue. Veuillez réessayer'
      }
      return
    }
    
    if (data?.user) {
      // Success - redirection automatique via le middleware
      await router.push('/')
    }
  } catch (err) {
    console.error('Login error:', err)
    error.value = 'Une erreur inattendue est survenue'
  } finally {
    loading.value = false
  }
}

// Auto-focus on email field
onMounted(() => {
  const emailInput = document.getElementById('email')
  if (emailInput) {
    emailInput.focus()
  }
})
</script>