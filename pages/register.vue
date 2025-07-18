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