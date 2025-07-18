<!-- Dans pages/login.vue, corriger la gestion d'erreur : -->

<script setup lang="ts">
import { ref } from 'vue'
import { LockClosedIcon, XCircleIcon } from '@heroicons/vue/24/solid'
import { useAuthStore } from '~/stores/auth'

// Métadonnées
definePageMeta({
  layout: false
})

// Store
const authStore = useAuthStore()

// État du formulaire
const form = ref({
  email: '',
  password: '',
  remember: false
})

const loading = ref(false)
const errorMessage = ref('')

// ✅ Gestion de la connexion avec typage d'erreur correct
const handleLogin = async () => {
  if (!form.value.email || !form.value.password) {
    errorMessage.value = 'Veuillez remplir tous les champs'
    return
  }

  loading.value = true
  errorMessage.value = ''

  try {
    await authStore.login({
      email: form.value.email,
      password: form.value.password
    })
    
    // Rediriger vers le dashboard
    await navigateTo('/')
  } catch (error: unknown) {
    // ✅ Correction TypeScript : gestion correcte de l'erreur unknown
    if (error instanceof Error) {
      errorMessage.value = error.message
    } else if (typeof error === 'string') {
      errorMessage.value = error
    } else {
      errorMessage.value = 'Erreur de connexion inconnue'
    }
  } finally {
    loading.value = false
  }
}

// Connexion démo rapide
const loginDemo = () => {
  form.value.email = 'admin@chatseller.app'
  form.value.password = 'password'
  handleLogin()
}
</script>