<!-- pages/profile.vue - PAGE PROFIL UTILISATEUR -->
<template>
  <div class="min-h-screen bg-gray-50 py-8">
    <div class="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
      
      <!-- Header de la page -->
      <div class="mb-8">
        <div class="flex items-center space-x-4">
          <button 
            @click="$router.back()"
            class="inline-flex items-center justify-center w-10 h-10 rounded-xl bg-white shadow-sm border border-gray-200 text-gray-600 hover:text-gray-900 hover:bg-gray-50 transition-all duration-200"
          >
            <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M15 19l-7-7 7-7" />
            </svg>
          </button>
          <div>
            <h1 class="text-3xl font-bold text-gray-900">Mon profil</h1>
            <p class="text-gray-600 mt-1">Gérez vos informations personnelles et préférences</p>
          </div>
        </div>
      </div>

      <div class="grid grid-cols-1 lg:grid-cols-3 gap-8">
        
        <!-- Colonne principale -->
        <div class="lg:col-span-2 space-y-8">
          
          <!-- Informations personnelles -->
          <div class="bg-white rounded-2xl shadow-sm border border-gray-100 p-6">
            <div class="flex items-center justify-between mb-6">
              <h2 class="text-xl font-semibold text-gray-900">Informations personnelles</h2>
              <button 
                @click="editingProfile = !editingProfile"
                class="inline-flex items-center px-4 py-2 text-sm font-medium rounded-xl transition-all duration-200"
                :class="editingProfile 
                  ? 'bg-gray-100 text-gray-700 hover:bg-gray-200' 
                  : 'bg-blue-50 text-blue-700 hover:bg-blue-100'"
              >
                <svg class="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" />
                </svg>
                {{ editingProfile ? 'Annuler' : 'Modifier' }}
              </button>
            </div>

            <form @submit.prevent="updateProfile" class="space-y-6">
              <!-- Nom -->
              <div>
                <label for="name" class="block text-sm font-medium text-gray-700 mb-2">
                  Nom complet
                </label>
                <input
                  id="name"
                  v-model="profileForm.name"
                  type="text"
                  :disabled="!editingProfile"
                  class="w-full px-4 py-3 rounded-xl border border-gray-200 focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all duration-200 disabled:bg-gray-50 disabled:text-gray-500"
                  placeholder="Votre nom complet"
                />
              </div>

              <!-- Email -->
              <div>
                <label for="email" class="block text-sm font-medium text-gray-700 mb-2">
                  Adresse email
                </label>
                <input
                  id="email"
                  v-model="profileForm.email"
                  type="email"
                  :disabled="!editingProfile"
                  class="w-full px-4 py-3 rounded-xl border border-gray-200 focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all duration-200 disabled:bg-gray-50 disabled:text-gray-500"
                  placeholder="votre@email.com"
                />
              </div>

              <!-- Boutons d'action -->
              <div v-if="editingProfile" class="flex items-center space-x-4 pt-4">
                <button
                  type="submit"
                  :disabled="updating"
                  class="inline-flex items-center px-6 py-3 bg-blue-600 text-white font-medium rounded-xl hover:bg-blue-700 focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 transition-all duration-200 disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  <svg v-if="updating" class="animate-spin -ml-1 mr-3 h-4 w-4 text-white" fill="none" viewBox="0 0 24 24">
                    <circle class="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" stroke-width="4"></circle>
                    <path class="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                  </svg>
                  {{ updating ? 'Mise à jour...' : 'Sauvegarder les modifications' }}
                </button>
                <button
                  type="button"
                  @click="cancelEdit"
                  class="inline-flex items-center px-6 py-3 bg-white text-gray-700 font-medium rounded-xl border border-gray-200 hover:bg-gray-50 focus:ring-2 focus:ring-gray-500 focus:ring-offset-2 transition-all duration-200"
                >
                  Annuler
                </button>
              </div>
            </form>
          </div>

          <!-- Informations du shop -->
          <div class="bg-white rounded-2xl shadow-sm border border-gray-100 p-6">
            <h2 class="text-xl font-semibold text-gray-900 mb-6">Informations de la boutique</h2>
            
            <div class="grid grid-cols-1 sm:grid-cols-2 gap-6">
              <div>
                <label class="block text-sm font-medium text-gray-700 mb-2">ID de la boutique</label>
                <div class="flex items-center space-x-2">
                  <input
                    :value="authStore.userShopId"
                    readonly
                    class="flex-1 px-4 py-3 rounded-xl border border-gray-200 bg-gray-50 text-gray-500 text-sm font-mono"
                  />
                  <button
                    @click="copyShopId"
                    class="inline-flex items-center justify-center w-10 h-10 rounded-xl bg-blue-50 text-blue-600 hover:bg-blue-100 transition-all duration-200"
                    title="Copier l'ID"
                  >
                    <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M8 16H6a2 2 0 01-2-2V6a2 2 0 012-2h8a2 2 0 012 2v2m-6 12h8a2 2 0 002-2v-8a2 2 0 00-2-2h-8a2 2 0 00-2 2v8a2 2 0 002 2z" />
                    </svg>
                  </button>
                </div>
              </div>

              <div>
                <label class="block text-sm font-medium text-gray-700 mb-2">Plan d'abonnement</label>
                <div class="flex items-center space-x-2">
                  <span class="inline-flex items-center px-3 py-1 rounded-full text-sm font-medium bg-green-100 text-green-800">
                    🚀 Plan Gratuit
                  </span>
                  <NuxtLink 
                    to="/billing" 
                    class="text-sm text-blue-600 hover:text-blue-700 font-medium"
                  >
                    Upgrade
                  </NuxtLink>
                </div>
              </div>
            </div>
          </div>

          <!-- Sécurité -->
          <div class="bg-white rounded-2xl shadow-sm border border-gray-100 p-6">
            <h2 class="text-xl font-semibold text-gray-900 mb-6">Sécurité</h2>
            
            <div class="space-y-4">
              <div class="flex items-center justify-between py-3">
                <div>
                  <h3 class="text-sm font-medium text-gray-900">Mot de passe</h3>
                  <p class="text-sm text-gray-500">Dernière modification il y a 30 jours</p>
                </div>
                <button
                  @click="changePassword"
                  class="inline-flex items-center px-4 py-2 text-sm font-medium text-blue-600 bg-blue-50 rounded-xl hover:bg-blue-100 transition-all duration-200"
                >
                  Modifier
                </button>
              </div>

              <hr class="border-gray-100">

              <div class="flex items-center justify-between py-3">
                <div>
                  <h3 class="text-sm font-medium text-gray-900">Authentification à deux facteurs</h3>
                  <p class="text-sm text-gray-500">Sécurisez votre compte avec 2FA</p>
                </div>
                <button
                  class="inline-flex items-center px-4 py-2 text-sm font-medium text-gray-600 bg-gray-50 rounded-xl hover:bg-gray-100 transition-all duration-200"
                  disabled
                >
                  Bientôt disponible
                </button>
              </div>
            </div>
          </div>
        </div>

        <!-- Sidebar droite -->
        <div class="space-y-6">
          
          <!-- Avatar -->
          <div class="bg-white rounded-2xl shadow-sm border border-gray-100 p-6">
            <h3 class="text-lg font-semibold text-gray-900 mb-4">Photo de profil</h3>
            
            <div class="flex flex-col items-center space-y-4">
              <!-- Avatar actuel -->
              <div class="relative">
                <div class="flex h-24 w-24 items-center justify-center rounded-full bg-gradient-to-br from-blue-500 to-blue-600 shadow-lg">
                  <span class="text-2xl font-bold text-white">
                    {{ authStore.userInitials }}
                  </span>
                </div>
                <button
                  class="absolute -bottom-1 -right-1 flex h-8 w-8 items-center justify-center rounded-full bg-white shadow-md border-2 border-gray-100 text-gray-600 hover:text-gray-900 hover:bg-gray-50 transition-all duration-200"
                >
                  <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M3 9a2 2 0 012-2h.93a2 2 0 001.664-.89l.812-1.22A2 2 0 0110.07 4h3.86a2 2 0 011.664.89l.812 1.22A2 2 0 0018.07 7H19a2 2 0 012 2v9a2 2 0 01-2 2H5a2 2 0 01-2-2V9z" />
                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M15 13a3 3 0 11-6 0 3 3 0 016 0z" />
                  </svg>
                </button>
              </div>

              <div class="text-center">
                <p class="text-sm text-gray-600 mb-3">
                  Formats supportés : JPG, PNG (max 2MB)
                </p>
                <button
                  class="inline-flex items-center px-4 py-2 text-sm font-medium text-gray-600 bg-gray-50 rounded-xl hover:bg-gray-100 transition-all duration-200"
                  disabled
                >
                  <svg class="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M7 16a4 4 0 01-.88-7.903A5 5 0 1115.9 6L16 6a5 5 0 011 9.9M15 13l-3-3m0 0l-3 3m3-3v12" />
                  </svg>
                  Télécharger (bientôt)
                </button>
              </div>
            </div>
          </div>

          <!-- Statistiques rapides -->
          <div class="bg-white rounded-2xl shadow-sm border border-gray-100 p-6">
            <h3 class="text-lg font-semibold text-gray-900 mb-4">Activité du compte</h3>
            
            <div class="space-y-4">
              <div class="flex items-center justify-between">
                <span class="text-sm text-gray-600">Membre depuis</span>
                <span class="text-sm font-medium text-gray-900">{{ memberSince }}</span>
              </div>
              <div class="flex items-center justify-between">
                <span class="text-sm text-gray-600">Dernière connexion</span>
                <span class="text-sm font-medium text-gray-900">Maintenant</span>
              </div>
              <div class="flex items-center justify-between">
                <span class="text-sm text-gray-600">Conversations</span>
                <span class="text-sm font-medium text-gray-900">{{ totalConversations }}</span>
              </div>
            </div>
          </div>

          <!-- Actions rapides -->
          <div class="bg-white rounded-2xl shadow-sm border border-gray-100 p-6">
            <h3 class="text-lg font-semibold text-gray-900 mb-4">Actions rapides</h3>
            
            <div class="space-y-3">
              <NuxtLink
                to="/settings"
                class="flex items-center w-full px-4 py-3 text-sm font-medium text-left text-gray-700 bg-gray-50 rounded-xl hover:bg-gray-100 transition-all duration-200"
              >
                <svg class="w-4 h-4 mr-3 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M10.325 4.317c.426-1.756 2.924-1.756 3.35 0a1.724 1.724 0 002.573 1.066c1.543-.94 3.31.826 2.37 2.37a1.724 1.724 0 001.065 2.572c1.756.426 1.756 2.924 0 3.35a1.724 1.724 0 00-1.066 2.573c.94 1.543-.826 3.31-2.37 2.37a1.724 1.724 0 00-2.572 1.065c-.426 1.756-2.924 1.756-3.35 0a1.724 1.724 0 00-2.573-1.066c-1.543.94-3.31-.826-2.37-2.37a1.724 1.724 0 00-1.065-2.572c-1.756-.426-1.756-2.924 0-3.35a1.724 1.724 0 001.066-2.573c-.94-1.543.826-3.31 2.37-2.37.996.608 2.296.07 2.572-1.065z" />
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                </svg>
                Paramètres du compte
              </NuxtLink>

              <NuxtLink
                to="/knowledge-base"
                class="flex items-center w-full px-4 py-3 text-sm font-medium text-left text-gray-700 bg-gray-50 rounded-xl hover:bg-gray-100 transition-all duration-200"
              >
                <svg class="w-4 h-4 mr-3 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.746 0 3.332.477 4.5 1.253v13C19.832 18.477 18.246 18 16.5 18c-1.746 0-3.332.477-4.5 1.253" />
                </svg>
                Base de connaissance
              </NuxtLink>

              <button
                @click="exportData"
                class="flex items-center w-full px-4 py-3 text-sm font-medium text-left text-gray-700 bg-gray-50 rounded-xl hover:bg-gray-100 transition-all duration-200"
              >
                <svg class="w-4 h-4 mr-3 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 10v6m0 0l-3-3m3 3l3-3M3 17V7a2 2 0 012-2h6l2 2h6a2 2 0 012 2v8a2 2 0 01-2 2H5a2 2 0 01-2-2z" />
                </svg>
                Exporter mes données
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, reactive, computed, onMounted } from 'vue'
import { useAuthStore } from '~~/stores/auth'

// ✅ PROTECTION DE LA ROUTE
definePageMeta({
  middleware: 'auth'
})

// ✅ STORE AUTH
const authStore = useAuthStore()

// ✅ ÉTATS LOCAUX
const editingProfile = ref(false)
const updating = ref(false)

// ✅ FORMULAIRE PROFIL
const profileForm = reactive({
  name: '',
  email: ''
})

// ✅ DONNÉES CALCULÉES
const memberSince = computed(() => {
  if (authStore.user?.createdAt) {
    return new Date(authStore.user.createdAt).toLocaleDateString('fr-FR')
  }
  return 'N/A'
})

const totalConversations = ref(0) // Mock - à remplacer par vraies données

// ✅ INITIALISATION DES DONNÉES
onMounted(() => {
  profileForm.name = authStore.userName || ''
  profileForm.email = authStore.userEmail || ''
})

// ✅ FONCTIONS
const updateProfile = async () => {
  updating.value = true
  
  try {
    const result = await authStore.updateProfile({
      name: profileForm.name,
      email: profileForm.email
    })
    
    if (result.success) {
      editingProfile.value = false
      // Notification de succès (à implémenter)
      console.log('✅ Profil mis à jour avec succès')
    } else {
      // Notification d'erreur (à implémenter)
      console.error('❌ Erreur mise à jour profil:', result.error)
    }
  } catch (error) {
    console.error('❌ Erreur:', error)
  } finally {
    updating.value = false
  }
}

const cancelEdit = () => {
  editingProfile.value = false
  // Restaurer les valeurs originales
  profileForm.name = authStore.userName || ''
  profileForm.email = authStore.userEmail || ''
}

const copyShopId = async () => {
  try {
    await navigator.clipboard.writeText(authStore.userShopId || '')
    // Notification de succès (à implémenter)
    console.log('✅ ID copié dans le presse-papiers')
  } catch (error) {
    console.error('❌ Erreur copie:', error)
  }
}

const changePassword = () => {
  // Redirection vers une page de changement de mot de passe
  // Ou ouvrir un modal
  console.log('🔑 Changement de mot de passe (à implémenter)')
}

const exportData = () => {
  // Fonctionnalité d'export des données utilisateur
  console.log('📄 Export des données (à implémenter)')
}
</script>

<style scoped>
/* ✅ ANIMATIONS PERSONNALISÉES */
.transition-all {
  transition: all 0.2s cubic-bezier(0.4, 0, 0.2, 1);
}

/* ✅ SPINNER ANIMATION */
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