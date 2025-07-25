<!-- pages/billing.vue - PAGE BILLING STRIPE -->
<template>
  <div class="min-h-screen bg-gray-50 py-8">
    <div class="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
      
      <!-- Header -->
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
            <h1 class="text-3xl font-bold text-gray-900">Facturation & Abonnement</h1>
            <p class="text-gray-600 mt-1">Gérez votre plan et vos paiements</p>
          </div>
        </div>
      </div>

      <!-- Alerte plan gratuit -->
      <div v-if="currentPlan === 'free'" class="mb-8 bg-blue-50 border border-blue-200 rounded-xl p-6">
        <div class="flex items-start space-x-3">
          <svg class="w-6 h-6 text-blue-600 flex-shrink-0 mt-0.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
          </svg>
          <div>
            <h3 class="text-lg font-semibold text-blue-900 mb-2">Période d'essai gratuite</h3>
            <p class="text-blue-700 mb-4">
              Vous êtes actuellement en période d'essai gratuite. 
              <span class="font-semibold">{{ remainingTrialDays }} jour(s) restant(s)</span>
            </p>
            <button 
              @click="scrollToPlans"
              class="inline-flex items-center px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
            >
              Choisir un plan maintenant
              <svg class="ml-2 w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M19 9l-7 7-7-7" />
              </svg>
            </button>
          </div>
        </div>
      </div>

      <div class="grid grid-cols-1 lg:grid-cols-3 gap-8">
        
        <!-- Colonne principale -->
        <div class="lg:col-span-2 space-y-8">
          
          <!-- Plan actuel -->
          <div class="bg-white rounded-2xl shadow-sm border border-gray-100 p-6">
            <h2 class="text-xl font-semibold text-gray-900 mb-6">Plan actuel</h2>
            
            <div class="flex items-center justify-between p-4 bg-gray-50 rounded-xl">
              <div class="flex items-center space-x-4">
                <div class="flex h-12 w-12 items-center justify-center rounded-xl bg-blue-100">
                  <svg class="w-6 h-6 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M5 3v4M3 5h4M6 17v4m-2-2h4m5-16l2.286 6.857L21 12l-5.714 2.143L13 21l-2.286-6.857L5 12l5.714-2.143L13 3z" />
                  </svg>
                </div>
                <div>
                  <h3 class="text-lg font-semibold capitalize">Plan {{ currentPlan }}</h3>
                  <p class="text-sm text-gray-600">
                    {{ currentPlan === 'free' ? 'Période d\'essai gratuite' : '14€/mois' }}
                  </p>
                </div>
              </div>
              
              <div class="text-right">
                <span :class="currentPlan === 'free' ? 'bg-blue-100 text-blue-800' : 'bg-green-100 text-green-800'" 
                      class="inline-flex items-center px-3 py-1 rounded-full text-sm font-medium">
                  {{ currentPlan === 'free' ? 'Essai gratuit' : 'Actif' }}
                </span>
                <p v-if="currentPlan !== 'free'" class="text-sm text-gray-500 mt-1">
                  Renouvellement: {{ nextBillingDate }}
                </p>
              </div>
            </div>

            <!-- Actions plan actuel -->
            <div class="mt-6 flex flex-wrap gap-3">
              <button 
                v-if="currentPlan === 'free'"
                @click="scrollToPlans"
                class="inline-flex items-center px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
              >
                Choisir un plan payant
              </button>
              <button 
                v-else
                @click="showCancelModal = true"
                class="inline-flex items-center px-4 py-2 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition-colors"
              >
                Annuler l'abonnement
              </button>
              <button 
                v-if="currentPlan !== 'free'"
                @click="downloadInvoices"
                class="inline-flex items-center px-4 py-2 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition-colors"
              >
                <svg class="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 10v6m0 0l-3-3m3 3l3-3M3 17V7a2 2 0 012-2h6l2 2h6a2 2 0 012 2v8a2 2 0 01-2 2H5a2 2 0 01-2-2z" />
                </svg>
                Télécharger factures
              </button>
            </div>
          </div>

          <!-- Méthodes de paiement -->
          <div v-if="currentPlan !== 'free'" class="bg-white rounded-2xl shadow-sm border border-gray-100 p-6">
            <div class="flex items-center justify-between mb-6">
              <h2 class="text-xl font-semibold text-gray-900">Méthodes de paiement</h2>
              <button 
                @click="addPaymentMethod"
                class="inline-flex items-center px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
              >
                <svg class="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 4v16m8-8H4" />
                </svg>
                Ajouter une carte
              </button>
            </div>

            <div v-if="paymentMethods.length === 0" class="text-center py-8">
              <svg class="w-12 h-12 text-gray-400 mx-auto mb-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M3 10h18M7 15h1m4 0h1m-7 4h12a3 3 0 003-3V8a3 3 0 00-3-3H6a3 3 0 00-3 3v8a3 3 0 003 3z" />
              </svg>
              <p class="text-gray-500">Aucune méthode de paiement enregistrée</p>
            </div>

            <div v-else class="space-y-4">
              <div v-for="method in paymentMethods" :key="method.id" 
                   class="flex items-center justify-between p-4 border border-gray-200 rounded-xl">
                <div class="flex items-center space-x-4">
                  <div class="flex h-10 w-10 items-center justify-center rounded-lg bg-gray-100">
                    <svg class="w-5 h-5 text-gray-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M3 10h18M7 15h1m4 0h1m-7 4h12a3 3 0 003-3V8a3 3 0 00-3-3H6a3 3 0 00-3 3v8a3 3 0 003 3z" />
                    </svg>
                  </div>
                  <div>
                    <p class="font-medium">{{ method.cardBrand }} •••• {{ method.cardLast4 }}</p>
                    <p class="text-sm text-gray-500">Expire {{ method.cardExpMonth }}/{{ method.cardExpYear }}</p>
                  </div>
                  <span v-if="method.isDefault" class="inline-flex items-center px-2 py-1 rounded-full text-xs font-medium bg-green-100 text-green-800">
                    Par défaut
                  </span>
                </div>
                <button 
                  @click="removePaymentMethod(method.id)"
                  class="text-red-600 hover:text-red-700 p-2"
                >
                  <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                  </svg>
                </button>
              </div>
            </div>
          </div>

          <!-- Plans disponibles -->
          <div ref="plansSection" class="bg-white rounded-2xl shadow-sm border border-gray-100 p-6">
            <div class="mb-8">
              <h2 class="text-2xl font-semibold text-gray-900 mb-2">Choisissez votre plan</h2>
              <p class="text-gray-600">Changez de plan à tout moment selon vos besoins</p>
            </div>

            <div class="grid md:grid-cols-2 gap-6">
              <!-- Plan Professional -->
              <div class="relative p-6 border border-blue-200 rounded-2xl bg-blue-50/50">
                <div class="absolute -top-3 left-1/2 transform -translate-x-1/2">
                  <span class="bg-blue-600 text-white px-4 py-1 rounded-full text-sm font-medium">
                    Le plus populaire
                  </span>
                </div>
                
                <div class="text-center mb-6">
                  <h3 class="text-2xl font-bold mb-2">Professional</h3>
                  <div class="mb-4">
                    <span class="text-4xl font-bold">14€</span>
                    <span class="text-gray-600">/mois</span>
                  </div>
                  <p class="text-gray-600">Pour les e-commerçants sérieux</p>
                </div>
                
                <div class="space-y-3 mb-6">
                  <div class="flex items-center space-x-3">
                    <svg class="w-5 h-5 text-green-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M5 13l4 4L19 7" />
                    </svg>
                    <span class="text-sm">Conversations illimitées</span>
                  </div>
                  <div class="flex items-center space-x-3">
                    <svg class="w-5 h-5 text-green-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M5 13l4 4L19 7" />
                    </svg>
                    <span class="text-sm">3 Vendeurs IA spécialisés</span>
                  </div>
                  <div class="flex items-center space-x-3">
                    <svg class="w-5 h-5 text-green-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M5 13l4 4L19 7" />
                    </svg>
                    <span class="text-sm">Base de connaissance illimitée</span>
                  </div>
                  <div class="flex items-center space-x-3">
                    <svg class="w-5 h-5 text-green-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M5 13l4 4L19 7" />
                    </svg>
                    <span class="text-sm">Upsell automatique intelligent</span>
                  </div>
                  <div class="flex items-center space-x-3">
                    <svg class="w-5 h-5 text-green-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M5 13l4 4L19 7" />
                    </svg>
                    <span class="text-sm">Analytics avancées & ROI</span>
                  </div>
                  <div class="flex items-center space-x-3">
                    <svg class="w-5 h-5 text-green-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M5 13l4 4L19 7" />
                    </svg>
                    <span class="text-sm">Support prioritaire</span>
                  </div>
                </div>
                
                <button 
                  @click="subscribeToPlan('pro')"
                  :disabled="loading || currentPlan === 'pro'"
                  class="w-full py-3 px-4 bg-blue-600 text-white rounded-xl hover:bg-blue-700 focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 transition-all duration-200 disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  <span v-if="loading && selectedPlan === 'pro'">Traitement en cours...</span>
                  <span v-else-if="currentPlan === 'pro'">Plan actuel</span>
                  <span v-else>{{ currentPlan === 'free' ? 'Commencer l\'essai Pro' : 'Passer au Pro' }}</span>
                </button>
              </div>

              <!-- Plan Enterprise -->
              <div class="p-6 border border-gray-200 rounded-2xl">
                <div class="text-center mb-6">
                  <h3 class="text-2xl font-bold mb-2">Enterprise</h3>
                  <div class="mb-4">
                    <span class="text-4xl font-bold">Sur mesure</span>
                  </div>
                  <p class="text-gray-600">Pour les grandes entreprises</p>
                </div>
                
                <div class="space-y-3 mb-6">
                  <div class="flex items-center space-x-3">
                    <svg class="w-5 h-5 text-green-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M5 13l4 4L19 7" />
                    </svg>
                    <span class="text-sm">Tout du plan Professional</span>
                  </div>
                  <div class="flex items-center space-x-3">
                    <svg class="w-5 h-5 text-green-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M5 13l4 4L19 7" />
                    </svg>
                    <span class="text-sm">Agents IA illimités</span>
                  </div>
                  <div class="flex items-center space-x-3">
                    <svg class="w-5 h-5 text-green-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M5 13l4 4L19 7" />
                    </svg>
                    <span class="text-sm">White-label complet</span>
                  </div>
                  <div class="flex items-center space-x-3">
                    <svg class="w-5 h-5 text-green-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M5 13l4 4L19 7" />
                    </svg>
                    <span class="text-sm">API complète & webhooks</span>
                  </div>
                  <div class="flex items-center space-x-3">
                    <svg class="w-5 h-5 text-green-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M5 13l4 4L19 7" />
                    </svg>
                    <span class="text-sm">Support dédié 24/7</span>
                  </div>
                </div>
                
                <button 
                  @click="contactEnterprise"
                  class="w-full py-3 px-4 border border-gray-300 text-gray-700 rounded-xl hover:bg-gray-50 focus:ring-2 focus:ring-gray-500 focus:ring-offset-2 transition-all duration-200"
                >
                  Nous contacter
                </button>
              </div>
            </div>
          </div>
        </div>

        <!-- Sidebar droite -->
        <div class="space-y-6">
          
          <!-- Factures récentes -->
          <div v-if="currentPlan !== 'free'" class="bg-white rounded-2xl shadow-sm border border-gray-100 p-6">
            <h3 class="text-lg font-semibold text-gray-900 mb-4">Factures récentes</h3>
            
            <div v-if="recentInvoices.length === 0" class="text-center py-6">
              <svg class="w-8 h-8 text-gray-400 mx-auto mb-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
              </svg>
              <p class="text-sm text-gray-500">Aucune facture pour le moment</p>
            </div>

            <div v-else class="space-y-3">
              <div v-for="invoice in recentInvoices" :key="invoice.id" 
                   class="flex items-center justify-between p-3 border border-gray-100 rounded-lg">
                <div>
                  <p class="text-sm font-medium">{{ invoice.amountPaid }}€</p>
                  <p class="text-xs text-gray-500">{{ formatDate(invoice.paidAt) }}</p>
                </div>
                <div class="flex items-center space-x-2">
                  <span :class="invoice.status === 'paid' ? 'bg-green-100 text-green-800' : 'bg-yellow-100 text-yellow-800'" 
                        class="inline-flex items-center px-2 py-1 rounded-full text-xs font-medium">
                    {{ invoice.status === 'paid' ? 'Payée' : 'En attente' }}
                  </span>
                  <button 
                    v-if="invoice.invoicePdf"
                    @click="downloadInvoice(invoice.invoicePdf)"
                    class="text-blue-600 hover:text-blue-700"
                  >
                    <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 10v6m0 0l-3-3m3 3l3-3M3 17V7a2 2 0 012-2h6l2 2h6a2 2 0 012 2v8a2 2 0 01-2 2H5a2 2 0 01-2-2z" />
                    </svg>
                  </button>
                </div>
              </div>
            </div>
          </div>

          <!-- Support & aide -->
          <div class="bg-white rounded-2xl shadow-sm border border-gray-100 p-6">
            <h3 class="text-lg font-semibold text-gray-900 mb-4">Besoin d'aide ?</h3>
            
            <div class="space-y-3">
              <a href="mailto:support@chatseller.app" 
                 class="flex items-center w-full px-4 py-3 text-sm text-left text-gray-700 bg-gray-50 rounded-xl hover:bg-gray-100 transition-colors">
                <svg class="w-4 h-4 mr-3 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M3 8l7.89 4.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
                </svg>
                Contacter le support
              </a>
              
              <a href="https://docs.chatseller.app/billing" 
                 class="flex items-center w-full px-4 py-3 text-sm text-left text-gray-700 bg-gray-50 rounded-xl hover:bg-gray-100 transition-colors">
                <svg class="w-4 h-4 mr-3 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.746 0 3.332.477 4.5 1.253v13C19.832 18.477 18.246 18 16.5 18c-1.746 0-3.332.477-4.5 1.253" />
                </svg>
                Documentation facturation
              </a>
            </div>
          </div>
        </div>
      </div>
    </div>

    <!-- Modal d'annulation -->
    <div v-if="showCancelModal" class="fixed inset-0 bg-gray-900 bg-opacity-50 flex items-center justify-center z-50">
      <div class="bg-white rounded-2xl p-6 max-w-md mx-4">
        <h3 class="text-lg font-semibold text-gray-900 mb-4">Annuler l'abonnement</h3>
        <p class="text-gray-600 mb-6">
          Êtes-vous sûr de vouloir annuler votre abonnement ? Vous continuerez à avoir accès jusqu'à la fin de votre période de facturation.
        </p>
        <div class="flex space-x-3">
          <button 
            @click="showCancelModal = false"
            class="flex-1 px-4 py-2 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition-colors"
          >
            Garder l'abonnement
          </button>
          <button 
            @click="cancelSubscription"
            :disabled="loading"
            class="flex-1 px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 transition-colors disabled:opacity-50"
          >
            {{ loading ? 'Annulation...' : 'Confirmer l\'annulation' }}
          </button>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, computed, onMounted } from 'vue'
import { useAuthStore } from '~~/stores/auth'

// ✅ PROTECTION DE LA ROUTE
definePageMeta({
  middleware: 'auth'
})

// ✅ STORE AUTH
const authStore = useAuthStore()

// ✅ ÉTATS LOCAUX
const loading = ref(false)
const selectedPlan = ref('')
const showCancelModal = ref(false)
const plansSection = ref(null)

// ✅ DONNÉES MOCK (à remplacer par vraies données)
const currentPlan = ref('free') // 'free', 'pro', 'enterprise'
const remainingTrialDays = ref(3)
const nextBillingDate = ref('15 février 2025')
const paymentMethods = ref([])
const recentInvoices = ref([])

// ✅ FONCTIONS STRIPE
const subscribeToPlan = async (plan: string) => {
  selectedPlan.value = plan
  loading.value = true
  
  try {
    console.log(`🔄 Souscription au plan ${plan}`)
    
    // TODO: Intégration Stripe checkout
    const response = await $fetch('/api/v1/billing/create-checkout', {
      method: 'POST',
      body: {
        plan,
        shopId: authStore.userShopId
      }
    })
    
    if (response.url) {
      // Rediriger vers Stripe Checkout
      window.location.href = response.url
    }
  } catch (error) {
    console.error('❌ Erreur souscription:', error)
    // TODO: Afficher notification d'erreur
  } finally {
    loading.value = false
    selectedPlan.value = ''
  }
}

const cancelSubscription = async () => {
  loading.value = true
  
  try {
    console.log('🔄 Annulation abonnement')
    
    const response = await $fetch('/api/v1/billing/cancel-subscription', {
      method: 'POST',
      body: {
        shopId: authStore.userShopId
      }
    })
    
    if (response.success) {
      showCancelModal.value = false
      // TODO: Actualiser les données
      console.log('✅ Abonnement annulé')
    }
  } catch (error) {
    console.error('❌ Erreur annulation:', error)
  } finally {
    loading.value = false
  }
}

const addPaymentMethod = async () => {
  console.log('💳 Ajout méthode de paiement')
  // TODO: Intégration Stripe Elements
}

const removePaymentMethod = async (methodId: string) => {
  console.log('🗑️ Suppression méthode:', methodId)
  // TODO: Supprimer de Stripe
}

const downloadInvoices = () => {
  console.log('📄 Téléchargement factures')
  // TODO: Générer ZIP des factures
}

const downloadInvoice = (pdfUrl: string) => {
  window.open(pdfUrl, '_blank')
}

const contactEnterprise = () => {
  window.location.href = 'mailto:enterprise@chatseller.app?subject=Demande plan Enterprise'
}

const scrollToPlans = () => {
  plansSection.value?.scrollIntoView({ behavior: 'smooth' })
}

// ✅ UTILITAIRES
const formatDate = (date: string) => {
  return new Date(date).toLocaleDateString('fr-FR')
}

// ✅ CHARGEMENT DES DONNÉES
onMounted(async () => {
  try {
    console.log('🔄 Chargement données billing...')
    
    // TODO: Charger les vraies données depuis l'API
    const response = await $fetch(`/api/v1/billing/shop/${authStore.userShopId}`)
    
    if (response) {
      currentPlan.value = response.plan || 'free'
      paymentMethods.value = response.paymentMethods || []
      recentInvoices.value = response.recentInvoices || []
    }
  } catch (error) {
    console.error('❌ Erreur chargement billing:', error)
  }
})
</script>

<style scoped>
/* ✅ ANIMATIONS */
.transition-all {
  transition: all 0.2s cubic-bezier(0.4, 0, 0.2, 1);
}

/* ✅ SCROLLING SMOOTH */
html {
  scroll-behavior: smooth;
}
</style>