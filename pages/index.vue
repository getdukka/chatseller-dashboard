<!-- pages/index.vue -->
<template>
  <div class="min-h-screen bg-gray-50/50">

    <!-- ========== WELCOME MODAL (post-onboarding, shown once) ========== -->
    <Transition
      enter-active-class="transition ease-out duration-300"
      enter-from-class="opacity-0"
      enter-to-class="opacity-100"
      leave-active-class="transition ease-in duration-200"
      leave-from-class="opacity-100"
      leave-to-class="opacity-0"
    >
      <div v-if="showWelcomeModal" class="fixed inset-0 bg-black/40 backdrop-blur-sm flex items-center justify-center z-50 p-4">
        <!-- Confetti -->
        <div class="confetti-container" aria-hidden="true">
          <div v-for="i in 40" :key="i" class="confetti-piece" :style="confettiStyle(i)"></div>
        </div>
        <div class="bg-white rounded-2xl shadow-2xl max-w-lg w-full overflow-hidden relative z-10">
          <!-- Header -->
          <div class="px-8 pt-10 pb-6 text-center">
            <div class="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-5">
              <svg class="w-8 h-8 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M5 13l4 4L19 7"/>
              </svg>
            </div>
            <h2 class="text-2xl font-bold text-gray-900 mb-2">
              {{ agentInfo?.name || 'Mia' }} est prête !
            </h2>
            <p class="text-gray-500">
              Votre vendeuse IA va accueillir vos visiteurs et les guider vers l'achat, 24h/24.
            </p>
          </div>

          <!-- Steps summary -->
          <div class="px-8 pb-6">
            <div class="space-y-3 mb-6">
              <div class="flex items-center gap-3 p-3 bg-green-50 rounded-xl">
                <div class="w-6 h-6 bg-green-500 rounded-full flex items-center justify-center flex-shrink-0">
                  <svg class="w-3.5 h-3.5 text-white" fill="currentColor" viewBox="0 0 20 20">
                    <path fill-rule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clip-rule="evenodd"/>
                  </svg>
                </div>
                <span class="text-sm text-green-800 font-medium">{{ agentInfo?.name || 'Mia' }} a rejoint votre équipe</span>
              </div>
              <div
                class="flex items-center gap-3 p-3 rounded-xl"
                :class="setupStatus.productsSynced ? 'bg-green-50' : 'bg-amber-50'"
              >
                <div
                  class="w-6 h-6 rounded-full flex items-center justify-center flex-shrink-0"
                  :class="setupStatus.productsSynced ? 'bg-green-500' : 'bg-amber-400'"
                >
                  <svg v-if="setupStatus.productsSynced" class="w-3.5 h-3.5 text-white" fill="currentColor" viewBox="0 0 20 20">
                    <path fill-rule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clip-rule="evenodd"/>
                  </svg>
                  <span v-else class="text-xs text-white font-bold">2</span>
                </div>
                <span class="text-sm font-medium" :class="setupStatus.productsSynced ? 'text-green-800' : 'text-amber-800'">
                  {{ setupStatus.productsSynced ? `${dashboardStats.products.total} produits mémorisés` : 'Produits à importer' }}
                </span>
              </div>
              <div class="flex items-center gap-3 p-3 bg-rose-50 rounded-xl">
                <div class="w-6 h-6 bg-rose-400 rounded-full flex items-center justify-center flex-shrink-0">
                  <span class="text-xs text-white font-bold">3</span>
                </div>
                <span class="text-sm text-rose-800 font-medium">Tester {{ agentInfo?.name || 'Mia' }} avant de l'activer</span>
              </div>
            </div>

            <button
              @click="navigateToTestAgent"
              class="w-full py-3 font-medium rounded-xl mb-3 btn-brand-primary"
            >
              Tester {{ agentInfo?.name || 'Mia' }} maintenant
            </button>
            <button
              @click="closeWelcomeModal"
              class="w-full py-3 text-gray-500 font-medium hover:text-gray-700 transition-colors"
            >
              Explorer le tableau de bord
            </button>
          </div>
        </div>
      </div>
    </Transition>

    <!-- ========== PAGE CONTENT ========== -->
    <div class="px-4 md:px-8 py-6 md:py-8 max-w-[1400px] mx-auto">

      <!-- Header: Greeting -->
      <div class="mb-8">
        <h1 class="text-2xl md:text-3xl font-bold text-gray-900">
          {{ greeting }}, {{ userFirstName }}
        </h1>
        <p class="mt-1 text-gray-500">
          {{ getDashboardSubtitle() }}
        </p>
      </div>

      <!-- ========== SETUP GUIDE (when not fully configured) ========== -->
      <div v-if="!isFullySetup && !loadingStats" class="mb-8">
        <div class="bg-white rounded-2xl border border-gray-200 overflow-hidden">
          <!-- Progress bar -->
          <div class="h-1 bg-gray-100">
            <div
              class="h-full transition-all duration-700 ease-out bg-[var(--color-primary)]"
              :style="{ width: `${(completedSteps / 3) * 100}%` }"
            ></div>
          </div>

          <div class="p-6 md:p-8">
            <div class="flex items-start justify-between mb-6">
              <div>
                <h2 class="text-lg font-semibold text-gray-900">
                  Préparez {{ agentInfo?.name || 'Mia' }} pour vos clients
                </h2>
                <p class="text-sm text-gray-500 mt-1">
                  {{ completedSteps }} sur 3 étapes terminées
                </p>
              </div>
              <button
                v-if="completedSteps > 0"
                @click="dismissReminder"
                class="text-gray-400 hover:text-gray-600 p-1"
              >
                <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12"/>
                </svg>
              </button>
            </div>

            <div class="grid grid-cols-1 md:grid-cols-3 gap-4">
              <!-- Step 1: Agent created -->
              <div class="flex items-start gap-4 p-4 rounded-xl" :class="setupStatus.agentCreated ? 'bg-gray-50' : 'bg-amber-50 border border-amber-200'">
                <div
                  class="w-8 h-8 rounded-full flex items-center justify-center flex-shrink-0 mt-0.5"
                  :class="setupStatus.agentCreated ? 'bg-green-500' : 'bg-amber-400'"
                >
                  <svg v-if="setupStatus.agentCreated" class="w-4 h-4 text-white" fill="currentColor" viewBox="0 0 20 20">
                    <path fill-rule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clip-rule="evenodd"/>
                  </svg>
                  <span v-else class="text-sm text-white font-bold">1</span>
                </div>
                <div>
                  <p class="font-medium text-gray-900 text-sm">Recruter {{ agentInfo?.name || 'Mia' }}</p>
                  <p class="text-xs text-gray-500 mt-0.5">
                    {{ setupStatus.agentCreated ? 'Fait' : 'Creez votre vendeuse IA' }}
                  </p>
                </div>
              </div>

              <!-- Step 2: Products synced -->
              <div
                class="flex items-start gap-4 p-4 rounded-xl cursor-pointer transition-colors"
                :class="setupStatus.productsSynced ? 'bg-gray-50' : 'bg-amber-50 border border-amber-200 hover:bg-amber-100'"
                @click="!setupStatus.productsSynced && goToProducts()"
              >
                <div
                  class="w-8 h-8 rounded-full flex items-center justify-center flex-shrink-0 mt-0.5"
                  :class="setupStatus.productsSynced ? 'bg-green-500' : 'bg-amber-400'"
                >
                  <svg v-if="setupStatus.productsSynced" class="w-4 h-4 text-white" fill="currentColor" viewBox="0 0 20 20">
                    <path fill-rule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clip-rule="evenodd"/>
                  </svg>
                  <span v-else class="text-sm text-white font-bold">2</span>
                </div>
                <div class="flex-1">
                  <p class="font-medium text-gray-900 text-sm">Importer vos produits</p>
                  <p class="text-xs text-gray-500 mt-0.5">
                    {{ setupStatus.productsSynced ? `${dashboardStats.products.total} produits importés` : 'Pour que ' + (agentInfo?.name || 'Mia') + ' puisse les recommander' }}
                  </p>
                  <span v-if="!setupStatus.productsSynced" class="inline-flex items-center text-xs font-medium text-amber-700 mt-2">
                    Importer
                    <svg class="w-3 h-3 ml-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 5l7 7-7 7"/>
                    </svg>
                  </span>
                </div>
              </div>

              <!-- Step 3: Test & activate -->
              <div
                class="flex items-start gap-4 p-4 rounded-xl cursor-pointer transition-colors"
                :class="setupStatus.widgetIntegrated ? 'bg-gray-50' : 'bg-rose-50 border border-rose-200 hover:bg-rose-100'"
                @click="!setupStatus.widgetIntegrated && navigateToTestAgent()"
              >
                <div
                  class="w-8 h-8 rounded-full flex items-center justify-center flex-shrink-0 mt-0.5"
                  :class="setupStatus.widgetIntegrated ? 'bg-green-500' : 'bg-rose-400'"
                >
                  <svg v-if="setupStatus.widgetIntegrated" class="w-4 h-4 text-white" fill="currentColor" viewBox="0 0 20 20">
                    <path fill-rule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clip-rule="evenodd"/>
                  </svg>
                  <span v-else class="text-sm text-white font-bold">3</span>
                </div>
                <div class="flex-1">
                  <p class="font-medium text-gray-900 text-sm">Tester et activer</p>
                  <p class="text-xs text-gray-500 mt-0.5">
                    {{ setupStatus.widgetIntegrated ? 'Active sur votre site' : 'Vérifiez les réponses puis activez sur votre site' }}
                  </p>
                  <span v-if="!setupStatus.widgetIntegrated" class="inline-flex items-center text-xs font-medium text-rose-700 mt-2">
                    Commencer le test
                    <svg class="w-3 h-3 ml-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 5l7 7-7 7"/>
                    </svg>
                  </span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      <!-- ========== LOADING STATE ========== -->
      <div v-if="loadingStats" class="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
        <div v-for="i in 4" :key="i" class="bg-white rounded-xl border border-gray-200 p-5 animate-pulse">
          <div class="h-4 bg-gray-200 rounded w-24 mb-3"></div>
          <div class="h-8 bg-gray-200 rounded w-16 mb-2"></div>
          <div class="h-3 bg-gray-100 rounded w-32"></div>
        </div>
      </div>

      <!-- ========== KPI CARDS ========== -->
      <div v-if="!loadingStats" class="grid grid-cols-2 lg:grid-cols-4 gap-3 md:gap-4 mb-8">

        <!-- Conversations -->
        <NuxtLink to="/conversations" class="bg-white rounded-xl border border-gray-200 p-4 md:p-5 hover:shadow-md hover:border-gray-300 transition-all group">
          <div class="flex items-center justify-between mb-3">
            <span class="text-xs font-medium text-gray-500 uppercase tracking-wider">Conversations</span>
            <div class="w-8 h-8 rounded-lg flex items-center justify-center" style="background-color: var(--color-primary-light);">
              <svg class="w-4 h-4" style="color: var(--color-brand-rose);" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z"/>
              </svg>
            </div>
          </div>
          <p class="text-2xl md:text-3xl font-bold text-gray-900">{{ dashboardStats.conversations.total }}</p>
          <p class="text-xs text-gray-500 mt-1">
            <span v-if="dashboardStats.conversations.active > 0" class="text-blue-600 font-medium">{{ dashboardStats.conversations.active }} en cours</span>
            <span v-else>Aucune en cours</span>
          </p>
        </NuxtLink>

        <!-- Ventes -->
        <NuxtLink to="/orders" class="bg-white rounded-xl border border-gray-200 p-4 md:p-5 hover:shadow-md transition-all group">
          <div class="flex items-center justify-between mb-3">
            <span class="text-xs font-medium text-gray-500 uppercase tracking-wider">Ventes</span>
            <div class="w-8 h-8 rounded-lg bg-green-50 flex items-center justify-center">
              <svg class="w-4 h-4 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M16 11V7a4 4 0 00-8 0v4M5 9h14l1 12H4L5 9z"/>
              </svg>
            </div>
          </div>
          <p class="text-2xl md:text-3xl font-bold text-gray-900">{{ dashboardStats.orders.total }}</p>
          <p class="text-xs text-gray-500 mt-1">
            <span v-if="dashboardStats.orders.total > 0" class="text-green-600 font-medium">{{ formatConversionRate(dashboardStats.orders.conversionRate) }} conversion</span>
            <span v-else>Réalisées par {{ agentInfo?.name || 'Mia' }}</span>
          </p>
        </NuxtLink>

        <!-- Chiffre d'affaires -->
        <div class="bg-white rounded-xl border border-gray-200 p-4 md:p-5">
          <div class="flex items-center justify-between mb-3">
            <span class="text-xs font-medium text-gray-500 uppercase tracking-wider">Revenus</span>
            <div class="w-8 h-8 rounded-lg flex items-center justify-center" style="background-color: var(--color-primary-light);">
              <svg class="w-4 h-4" style="color: var(--color-brand-rose);" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1"/>
              </svg>
            </div>
          </div>
          <p class="text-2xl md:text-3xl font-bold text-gray-900">{{ formatCurrency(dashboardStats.revenue.total) }}</p>
          <p class="text-xs text-gray-500 mt-1">
            <span v-if="dashboardStats.revenue.average > 0">Panier moyen : {{ formatCurrency(dashboardStats.revenue.average) }}</span>
            <span v-else>Généré par {{ agentInfo?.name || 'Mia' }}</span>
          </p>
        </div>

        <!-- Produits -->
        <NuxtLink to="/products" class="bg-white rounded-xl border border-gray-200 p-4 md:p-5 hover:shadow-md transition-all group">
          <div class="flex items-center justify-between mb-3">
            <span class="text-xs font-medium text-gray-500 uppercase tracking-wider">Produits</span>
            <div class="w-8 h-8 rounded-lg flex items-center justify-center" style="background-color: var(--color-primary-light);">
              <svg class="w-4 h-4" style="color: var(--color-brand-rose);" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M20 7l-8-4-8 4m16 0l-8 4m8-4v10l-8 4m0-10L4 7m8 4v10M4 7v10l8 4"/>
              </svg>
            </div>
          </div>
          <p class="text-2xl md:text-3xl font-bold text-gray-900">{{ dashboardStats.products.total }}</p>
          <p class="text-xs text-gray-500 mt-1">
            <span v-if="dashboardStats.beautyInsights?.productsRecommended">{{ dashboardStats.beautyInsights.productsRecommended }} recommandés</span>
            <span v-else>Importés depuis votre boutique</span>
          </p>
        </NuxtLink>
      </div>

      <!-- ========== MAIN GRID ========== -->
      <div v-if="!loadingStats" class="grid grid-cols-1 lg:grid-cols-12 gap-4 md:gap-6">

        <!-- LEFT COLUMN: Agent + Performance (8 cols) -->
        <div class="lg:col-span-8 space-y-4 md:space-y-6">

          <!-- Agent Status Card -->
          <div class="rounded-xl p-5 md:p-6" style="background: linear-gradient(135deg, #fdf0f0 0%, #f5eeff 100%); border: 1px solid #f0d8d8;">
            <div v-if="agentInfo">
              <!-- Row 1: Avatar + Info + Actions (responsive) -->
              <div class="flex items-start gap-4">
                <!-- Avatar -->
                <div class="w-12 h-12 md:w-14 md:h-14 rounded-full flex items-center justify-center flex-shrink-0" style="border: 3px solid var(--color-brand-rose); background: white;">
                  <img
                    v-if="agentInfo.avatar"
                    :src="agentInfo.avatar"
                    :alt="agentInfo.name"
                    class="w-12 h-12 md:w-14 md:h-14 rounded-full object-cover"
                  />
                  <span v-else class="text-xl font-bold" style="color: var(--color-brand-rose);">
                    {{ agentInfo.name.charAt(0) }}
                  </span>
                </div>

                <!-- Info -->
                <div class="flex-1 min-w-0">
                  <!-- Name + pill -->
                  <div class="flex items-center gap-2 flex-wrap mb-0.5">
                    <h3 class="text-base md:text-lg font-semibold text-gray-900">{{ agentInfo.name }}</h3>
                    <span
                      class="inline-flex items-center px-2 py-0.5 rounded-full text-xs font-medium flex-shrink-0"
                      :class="agentInfo.isActive
                        ? 'bg-green-100 text-green-700'
                        : 'bg-gray-100 text-gray-600'"
                    >
                      <span
                        class="w-1.5 h-1.5 rounded-full mr-1"
                        :class="agentInfo.isActive ? 'bg-green-500' : 'bg-gray-400'"
                      ></span>
                      {{ agentInfo.isActive ? 'Active' : 'Inactive' }}
                    </span>
                  </div>
                  <p class="text-xs md:text-sm text-gray-500">{{ agentInfo.title || 'Vendeuse IA' }}</p>

                  <!-- Actions: inline on md+, hidden on mobile -->
                  <div class="hidden md:flex gap-2 mt-3">
                    <button
                      @click="navigateToTestAgent"
                      class="px-4 py-2 text-sm font-medium rounded-lg btn-brand-primary"
                    >
                      Tester {{ agentInfo?.name || 'Mia' }}
                    </button>
                    <button
                      @click="navigateToAgentDetail"
                      class="px-4 py-2 text-sm font-medium rounded-lg btn-brand-secondary"
                    >
                      Configurer
                    </button>
                  </div>
                </div>
              </div>

              <!-- Mobile actions row -->
              <div class="flex gap-2 mt-4 md:hidden">
                <button
                  @click="navigateToTestAgent"
                  class="flex-1 py-2 text-sm font-medium rounded-lg btn-brand-primary text-center"
                >
                  Tester {{ agentInfo?.name || 'Mia' }}
                </button>
                <button
                  @click="navigateToAgentDetail"
                  class="flex-1 py-2 text-sm font-medium rounded-lg btn-brand-secondary text-center"
                >
                  Configurer
                </button>
              </div>

              <!-- Quick stats -->
              <div class="flex items-center gap-4 md:gap-6 mt-4 pt-4 border-t border-white/50">
                <div>
                  <p class="text-xs text-gray-400 uppercase tracking-wider">Réponse</p>
                  <p class="text-sm font-semibold text-gray-900 mt-0.5">{{ dashboardStats.performance.responseTime }}</p>
                </div>
                <div class="w-px h-6 bg-gray-200"></div>
                <div>
                  <p class="text-xs text-gray-400 uppercase tracking-wider">Dispo.</p>
                  <p class="text-sm font-semibold text-gray-900 mt-0.5">{{ dashboardStats.performance.uptime }}%</p>
                </div>
                <div class="w-px h-6 bg-gray-200"></div>
                <div>
                  <p class="text-xs text-gray-400 uppercase tracking-wider">Docs</p>
                  <p class="text-sm font-semibold text-gray-900 mt-0.5">{{ agentInfo.knowledgeBaseCount }}</p>
                </div>
              </div>
            </div>

            <!-- No agent state -->
            <div v-else class="text-center py-8">
              <div class="w-14 h-14 bg-rose-100 rounded-2xl flex items-center justify-center mx-auto mb-4">
                <svg class="w-7 h-7 text-rose-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9.663 17h4.673M12 3v1m6.364 1.636l-.707.707M21 12h-1M4 12H3m3.343-5.657l-.707-.707m2.828 9.9a5 5 0 117.072 0l-.548.547A3.374 3.374 0 0014 18.469V19a2 2 0 11-4 0v-.531c0-.895-.356-1.754-.988-2.386l-.548-.547z"/>
                </svg>
              </div>
              <p class="font-medium text-gray-900 mb-1">Votre vendeuse IA n'est pas encore prete</p>
              <p class="text-sm text-gray-500 mb-4">Completez la configuration pour commencer</p>
              <NuxtLink
                to="/onboarding"
                class="inline-flex items-center px-4 py-2 text-sm font-medium rounded-lg btn-brand-primary"
              >
                Commencer la configuration
              </NuxtLink>
            </div>

            <!-- Setup alerts inside agent card -->
            <div v-if="agentInfo && (!setupStatus.productsSynced || !setupStatus.widgetIntegrated)" class="mt-5 pt-5 border-t border-gray-100 space-y-3">
              <div
                v-if="!setupStatus.productsSynced"
                class="flex items-center justify-between p-3 bg-amber-50 rounded-lg"
              >
                <div class="flex items-center gap-3">
                  <svg class="w-4 h-4 text-amber-500 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-2.5L13.732 4c-.77-.833-1.964-.833-2.732 0L4.082 16.5c-.77.833.192 2.5 1.732 2.5z"/>
                  </svg>
                  <span class="text-sm text-amber-800">{{ agentInfo.name }} ne connait pas encore vos produits</span>
                </div>
                <NuxtLink to="/products" class="text-xs font-medium text-amber-700 hover:text-amber-900 whitespace-nowrap">
                  Importer &rarr;
                </NuxtLink>
              </div>
              <div
                v-if="!setupStatus.widgetIntegrated && setupStatus.productsSynced"
                class="flex items-center justify-between p-3 bg-blue-50 rounded-lg"
              >
                <div class="flex items-center gap-3">
                  <svg class="w-4 h-4 text-blue-500 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"/>
                  </svg>
                  <span class="text-sm text-blue-800">{{ agentInfo.name }} n'est pas encore active sur votre site</span>
                </div>
                <div class="flex items-center gap-3">
                  <NuxtLink to="/agent-ia?tab=integration" class="text-xs font-medium text-blue-700 hover:text-blue-900 whitespace-nowrap">
                    Code d'integration &rarr;
                  </NuxtLink>
                  <button
                    @click="markWidgetAsIntegrated"
                    class="text-xs font-medium text-green-700 hover:text-green-900 whitespace-nowrap"
                  >
                    Deja fait
                  </button>
                </div>
              </div>
            </div>
          </div>

          <!-- Empty state: No data yet -->
          <div
            v-if="hasNoData && isFullySetup"
            class="bg-white rounded-xl border border-gray-200 p-8 text-center"
          >
            <div class="w-16 h-16 bg-blue-50 rounded-2xl flex items-center justify-center mx-auto mb-4">
              <svg class="w-8 h-8 text-blue-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"/>
              </svg>
            </div>
            <h3 class="font-semibold text-gray-900 mb-1">En attente de vos premiers visiteurs</h3>
            <p class="text-sm text-gray-500 max-w-md mx-auto mb-5">
              Des que des clients discuteront avec {{ agentInfo?.name || 'Mia' }},
              vous verrez ici vos conversations, ventes et revenus en temps reel.
            </p>
            <NuxtLink
              to="/agent-ia?tab=test"
              class="inline-flex items-center px-4 py-2 text-sm font-medium rounded-lg btn-brand-primary"
            >
              Tester {{ agentInfo?.name || 'Mia' }} en attendant
            </NuxtLink>
          </div>

          <!-- Performance metrics (when has data) -->
          <div v-if="!hasNoData" class="bg-white rounded-xl border border-gray-200 p-5 md:p-6">
            <div class="flex items-center justify-between mb-5">
              <h3 class="font-semibold text-gray-900">Activité récente</h3>
              <NuxtLink to="/analytics" class="text-xs font-medium text-gray-500 hover:text-gray-700 transition-colors">
                Voir les analytics &rarr;
              </NuxtLink>
            </div>
            <div class="grid grid-cols-3 gap-4">
              <div class="text-center p-4 bg-gray-50 rounded-xl">
                <p class="text-2xl font-bold text-gray-900">{{ dashboardStats.conversations.active }}</p>
                <p class="text-xs text-gray-500 mt-1">Conversations en cours</p>
              </div>
              <div class="text-center p-4 bg-gray-50 rounded-xl">
                <p class="text-2xl font-bold text-gray-900">{{ dashboardStats.beautyInsights?.productsRecommended || 0 }}</p>
                <p class="text-xs text-gray-500 mt-1">Produits recommandés</p>
              </div>
              <div class="text-center p-4 bg-gray-50 rounded-xl">
                <p class="text-2xl font-bold text-gray-900">{{ formatConversionRate(dashboardStats.orders.conversionRate) }}</p>
                <p class="text-xs text-gray-500 mt-1">Taux de conversion</p>
              </div>
            </div>
          </div>
        </div>

        <!-- RIGHT COLUMN: Quick Actions (4 cols) -->
        <div class="lg:col-span-4 space-y-4 md:space-y-6">

          <!-- Quick Actions -->
          <div class="bg-white rounded-xl border border-gray-200 p-5 md:p-6">
            <h3 class="font-semibold text-gray-900 mb-4">Actions rapides</h3>
            <div class="space-y-2">
              <NuxtLink
                to="/knowledge-base"
                class="flex items-center gap-3 p-3 rounded-xl hover:bg-[var(--color-primary-light)] transition-colors group border border-transparent hover:border-[var(--color-brand-rose)]"
              >
                <div class="w-9 h-9 rounded-lg bg-purple-50 flex items-center justify-center flex-shrink-0 group-hover:bg-purple-100 transition-colors">
                  <svg class="w-4.5 h-4.5 text-purple-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.746 0 3.332.477 4.5 1.253v13C19.832 18.477 18.246 18 16.5 18c-1.746 0-3.332.477-4.5 1.253"/>
                  </svg>
                </div>
                <div class="flex-1 min-w-0">
                  <p class="text-sm font-medium text-gray-900">Former {{ agentInfo?.name || 'Mia' }}</p>
                  <p class="text-xs text-gray-500">Ajouter des connaissances sur votre marque</p>
                </div>
                <svg class="w-4 h-4 text-gray-300 group-hover:text-[var(--color-brand-rose)] transition-colors flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 5l7 7-7 7"/>
                </svg>
              </NuxtLink>

              <NuxtLink
                to="/products"
                class="flex items-center gap-3 p-3 rounded-xl hover:bg-[var(--color-primary-light)] transition-colors group border border-transparent hover:border-[var(--color-brand-rose)]"
              >
                <div class="w-9 h-9 rounded-lg flex items-center justify-center flex-shrink-0 transition-colors" style="background-color: var(--color-primary-light);">
                  <svg class="w-4.5 h-4.5" style="color: var(--color-brand-rose);" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M20 7l-8-4-8 4m16 0l-8 4m8-4v10l-8 4m0-10L4 7m8 4v10M4 7v10l8 4"/>
                  </svg>
                </div>
                <div class="flex-1 min-w-0">
                  <p class="text-sm font-medium text-gray-900">Catalogue produits</p>
                  <p class="text-xs text-gray-500">{{ dashboardStats.products.total }} produit{{ dashboardStats.products.total !== 1 ? 's' : '' }} importe{{ dashboardStats.products.total !== 1 ? 's' : '' }}</p>
                </div>
                <svg class="w-4 h-4 text-gray-300 group-hover:text-[var(--color-brand-rose)] transition-colors flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 5l7 7-7 7"/>
                </svg>
              </NuxtLink>

              <NuxtLink
                to="/agent-ia?tab=integration"
                class="flex items-center gap-3 p-3 rounded-xl hover:bg-[var(--color-primary-light)] transition-colors group border border-transparent hover:border-[var(--color-brand-rose)]"
              >
                <div class="w-9 h-9 rounded-lg bg-gray-100 flex items-center justify-center flex-shrink-0 group-hover:bg-gray-200 transition-colors">
                  <svg class="w-4.5 h-4.5 text-gray-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M10 20l4-16m4 4l4 4-4 4M6 16l-4-4 4-4"/>
                  </svg>
                </div>
                <div class="flex-1 min-w-0">
                  <p class="text-sm font-medium text-gray-900">Integration</p>
                  <p class="text-xs text-gray-500">Activer {{ agentInfo?.name || 'Mia' }} sur votre site</p>
                </div>
                <svg class="w-4 h-4 text-gray-300 group-hover:text-[var(--color-brand-rose)] transition-colors flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 5l7 7-7 7"/>
                </svg>
              </NuxtLink>

              <NuxtLink
                to="/conversations"
                class="flex items-center gap-3 p-3 rounded-xl hover:bg-[var(--color-primary-light)] transition-colors group border border-transparent hover:border-[var(--color-brand-rose)]"
              >
                <div class="w-9 h-9 rounded-lg bg-gray-100 flex items-center justify-center flex-shrink-0 group-hover:bg-gray-200 transition-colors">
                  <svg class="w-4.5 h-4.5 text-gray-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z"/>
                  </svg>
                </div>
                <div class="flex-1 min-w-0">
                  <p class="text-sm font-medium text-gray-900">Conversations</p>
                  <p class="text-xs text-gray-500">
                    {{ dashboardStats.conversations.active > 0 ? `${dashboardStats.conversations.active} active${dashboardStats.conversations.active > 1 ? 's' : ''}` : 'Suivre les echanges' }}
                  </p>
                </div>
                <svg class="w-4 h-4 text-gray-300 group-hover:text-[var(--color-brand-rose)] transition-colors flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 5l7 7-7 7"/>
                </svg>
              </NuxtLink>
            </div>
          </div>

          <!-- Helpful tip card -->
          <div class="rounded-xl p-5 text-white" style="background: linear-gradient(135deg, #ea4242, #8c3dda);">
            <div class="flex items-start gap-3 mb-3">
              <div class="w-8 h-8 bg-white/20 rounded-lg flex items-center justify-center flex-shrink-0">
                <svg class="w-4 h-4 text-white" fill="currentColor" viewBox="0 0 20 20">
                  <path d="M11 3a1 1 0 10-2 0v1a1 1 0 102 0V3zM15.657 5.757a1 1 0 00-1.414-1.414l-.707.707a1 1 0 001.414 1.414l.707-.707zM18 10a1 1 0 01-1 1h-1a1 1 0 110-2h1a1 1 0 011 1zM5.05 6.464A1 1 0 106.464 5.05l-.707-.707a1 1 0 00-1.414 1.414l.707.707zM5 10a1 1 0 01-1 1H3a1 1 0 110-2h1a1 1 0 011 1zM8 16v-1h4v1a2 2 0 11-4 0zM12 14c.015-.34.208-.646.477-.859a4 4 0 10-4.954 0c.27.213.462.519.476.859h4.002z"/>
                </svg>
              </div>
              <div>
                <p class="text-sm font-medium text-white">L'astuce à retenir</p>
              </div>
            </div>
            <p class="text-sm text-white/85 leading-relaxed">
              Plus {{ agentInfo?.name || 'Mia' }} connait votre marque, mieux elle vend.
              Ajoutez vos pages "A propos", vos FAQ et vos guides d'utilisation dans la
              <NuxtLink to="/knowledge-base" class="text-white underline underline-offset-2 hover:text-white/70 transition-colors">base de connaissances</NuxtLink>.
            </p>
          </div>
        </div>
      </div>
    </div>

    <!-- ========== SUCCESS TOAST ========== -->
    <Transition
      enter-active-class="transform ease-out duration-300 transition"
      enter-from-class="translate-y-2 opacity-0"
      enter-to-class="translate-y-0 opacity-100"
      leave-active-class="transition ease-in duration-100"
      leave-from-class="opacity-100"
      leave-to-class="opacity-0"
    >
      <div
        v-if="showSuccessMessage"
        class="fixed bottom-4 right-4 left-4 md:left-auto bg-gray-900 text-white px-5 py-3 rounded-xl shadow-lg z-50"
      >
        <div class="flex items-center">
          <svg class="w-4 h-4 mr-2 text-green-400 flex-shrink-0" fill="currentColor" viewBox="0 0 20 20">
            <path fill-rule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clip-rule="evenodd"/>
          </svg>
          <span class="text-sm">{{ successMessage }}</span>
        </div>
      </div>
    </Transition>
  </div>
</template>

<script setup lang="ts">
import { ref, computed, onMounted } from 'vue'
import { useAuthStore } from '~/stores/auth'

definePageMeta({
  middleware: 'auth',
  layout: 'default'
})

// ========== INTERFACES ==========
interface DashboardStats {
  conversations: {
    total: number
    active: number
  }
  orders: {
    total: number
    conversionRate: number
  }
  revenue: {
    total: number
    average: number
  }
  performance: {
    responseTime: string
    uptime: number
  }
  products: {
    total: number
  }
  beautyInsights?: {
    productsRecommended?: number
    topProduct?: string
    [key: string]: any
  }
}

interface SetupStatus {
  agentCreated: boolean
  productsSynced: boolean
  widgetIntegrated: boolean
  knowledgeBase: boolean
}

interface BeautyProfile {
  beautyCategory: 'skincare' | 'haircare' | 'makeup' | 'fragrance' | 'bodycare' | 'natural' | 'multi'
  specializedTarget: string[]
  targetAgeRange: string
  priceRange: string
  communicationTone: string
  expertiseLevel: string
  primaryGoal: string
  agentName?: string
}

interface AgentInfo {
  id: string
  name: string
  title: string
  avatar: string | null
  isActive: boolean
  knowledgeBaseCount: number
}

// ========== COMPOSABLES ==========
const authStore = useAuthStore()
const api = useApi()

// ========== REACTIVE STATE ==========
const refreshing = ref(false)
const loadingStats = ref(true)
const showSuccessMessage = ref(false)
const showWelcomeModal = ref(false)
const reminderDismissed = ref(false)
const successMessage = ref('')

const dashboardStats = ref<DashboardStats>({
  conversations: { total: 0, active: 0 },
  orders: { total: 0, conversionRate: 0 },
  revenue: { total: 0, average: 0 },
  performance: { responseTime: '< 2s', uptime: 99.9 },
  products: { total: 0 },
  beautyInsights: {}
})

const setupStatus = ref<SetupStatus>({
  agentCreated: false,
  productsSynced: false,
  widgetIntegrated: false,
  knowledgeBase: false
})

const beautyProfile = ref<BeautyProfile>({
  beautyCategory: 'multi',
  specializedTarget: [],
  targetAgeRange: '',
  priceRange: '',
  communicationTone: '',
  expertiseLevel: '',
  primaryGoal: '',
  agentName: ''
})

const agentId = ref<string | null>(null)
const agentInfo = ref<AgentInfo | null>(null)
const shopCurrency = ref('XOF')

// ========== COMPUTED ==========
const greeting = computed(() => {
  const hour = new Date().getHours()
  if (hour >= 5 && hour < 12) return 'Bonjour'
  if (hour >= 12 && hour < 18) return 'Bon apres-midi'
  if (hour >= 18 && hour < 22) return 'Bonsoir'
  return 'Bonne nuit'
})

const userFirstName = computed(() => {
  const userName = authStore.userName
  const userEmail = authStore.userEmail

  if (userName && !userName.includes('@')) {
    const firstName = userName.split(' ')[0]
    return firstName.charAt(0).toUpperCase() + firstName.slice(1).toLowerCase()
  }

  if (userEmail) {
    const emailPrefix = userEmail.split('@')[0]
    const firstName = emailPrefix.split(/[._-]/)[0]
    return firstName.charAt(0).toUpperCase() + firstName.slice(1).toLowerCase()
  }

  return 'Utilisateur'
})

const completedSteps = computed(() => {
  let count = 0
  if (setupStatus.value.agentCreated) count++
  if (setupStatus.value.productsSynced) count++
  if (setupStatus.value.widgetIntegrated) count++
  return count
})

const isFullySetup = computed(() => {
  return completedSteps.value === 3 || reminderDismissed.value
})

const hasNoData = computed(() => {
  return dashboardStats.value.conversations.total === 0 &&
         dashboardStats.value.orders.total === 0 &&
         dashboardStats.value.revenue.total === 0
})

// ========== UTILITY METHODS ==========
const formatCurrency = (amount: number, currency?: string): string => {
  const cur = currency || shopCurrency.value || 'XOF'
  if (cur === 'XOF') {
    return new Intl.NumberFormat('fr-FR', {
      style: 'currency',
      currency: 'XOF',
      minimumFractionDigits: 0,
      maximumFractionDigits: 0
    }).format(amount)
  }
  return new Intl.NumberFormat('fr-FR', {
    style: 'currency',
    currency: cur,
    minimumFractionDigits: 0,
    maximumFractionDigits: 0
  }).format(amount)
}

const formatConversionRate = (rate: any): string => {
  if (typeof rate === 'number' && !isNaN(rate)) {
    if (rate === 0) return '0%'
    return `${rate.toFixed(1)}%`
  }
  if (typeof rate === 'string' && rate.includes('%')) {
    return rate
  }
  return '0%'
}

const showNotification = (message: string) => {
  successMessage.value = message
  showSuccessMessage.value = true
  setTimeout(() => {
    showSuccessMessage.value = false
  }, 3000)
}

const dismissReminder = () => {
  reminderDismissed.value = true
  sessionStorage.setItem('chatseller_reminder_dismissed', 'true')
}

const getDashboardSubtitle = () => {
  if (!agentInfo.value) {
    return 'Configurez votre vendeuse IA pour commencer'
  }
  if (hasNoData.value) {
    return `${agentInfo.value.name} est prete et attend vos premiers visiteurs`
  }
  return `Voici les performances de ${agentInfo.value.name} aujourd'hui`
}

// ========== NAVIGATION ==========
const navigateToAgentDetail = () => {
  if (agentId.value) {
    navigateTo(`/agent-ia/${agentId.value}`)
  } else {
    navigateTo('/agent-ia')
  }
}

const goToProducts = () => {
  navigateTo('/products')
}

const navigateToTestAgent = () => {
  closeWelcomeModal()
  if (agentId.value) {
    navigateTo(`/agent-ia/${agentId.value}?tab=test`)
  } else {
    navigateTo('/agent-ia?tab=test')
  }
}

const confettiColors = ['#f43f5e', '#ec4899', '#8b5cf6', '#06b6d4', '#10b981', '#f59e0b', '#ef4444']
const confettiStyle = (i: number) => ({
  left: `${Math.random() * 100}%`,
  animationDelay: `${Math.random() * 2}s`,
  animationDuration: `${2 + Math.random() * 2}s`,
  backgroundColor: confettiColors[i % confettiColors.length],
  transform: `rotate(${Math.random() * 360}deg)`,
})

const closeWelcomeModal = () => {
  showWelcomeModal.value = false
  localStorage.setItem('chatseller_welcome_shown', 'true')
}

// ========== DATA LOADING ==========
const loadAgent = async () => {
  try {
    const config = useRuntimeConfig()
    const baseURL = config.public.apiBaseUrl

    const response = await $fetch('/api/v1/agents', {
      method: 'GET',
      baseURL,
      headers: {
        'Authorization': `Bearer ${authStore.token}`,
        'Content-Type': 'application/json'
      }
    }) as { success: boolean; data: any[] }

    if (response.success && response.data && response.data.length > 0) {
      const agent = response.data[0]
      agentId.value = agent.id

      const knowledgeBase = agent.agent_knowledge_base || []
      agentInfo.value = {
        id: agent.id,
        name: agent.name || 'Mia',
        title: agent.title || '',
        avatar: agent.avatar || null,
        isActive: agent.is_active ?? true,
        knowledgeBaseCount: knowledgeBase.length
      }

      setupStatus.value.agentCreated = true
      setupStatus.value.knowledgeBase = knowledgeBase.length > 0
    }
  } catch (error) {
    console.error('[Dashboard] Erreur chargement agent:', error)
  }
}

const loadBeautyProfile = async () => {
  try {
    const user = authStore.user
    if (!user?.id) return

    const config = useRuntimeConfig()
    const baseURL = config.public.apiBaseUrl

    const shopResponse = await $fetch(`/api/v1/shops/${user.id}`, {
      method: 'GET',
      baseURL,
      headers: {
        'Authorization': `Bearer ${authStore.token}`,
        'Content-Type': 'application/json'
      }
    }) as { success: boolean; data: any }

    if (shopResponse.success && shopResponse.data) {
      const shop = shopResponse.data

      beautyProfile.value = {
        beautyCategory: shop.beauty_category || 'multi',
        specializedTarget: shop.specialized_target || [],
        targetAgeRange: shop.target_age_range || '',
        priceRange: shop.price_range || '',
        communicationTone: shop.communication_tone || '',
        expertiseLevel: shop.expertise_level || '',
        primaryGoal: shop.primary_goal || '',
        agentName: shop.agent_config?.name || ''
      }

      setupStatus.value.widgetIntegrated = shop.widget_integrated === true
      shopCurrency.value = shop.default_currency || 'XOF'
    }
  } catch (error) {
    console.error('[Dashboard] Erreur chargement beauty profile:', error)
  }
}

const loadProducts = async () => {
  try {
    const response = await api.products.list()
    if (response.success && response.data) {
      dashboardStats.value.products.total = response.data.length
      setupStatus.value.productsSynced = response.data.length > 0
      return response.data
    }
    return []
  } catch (error) {
    console.error('[Dashboard] Erreur chargement produits:', error)
    return []
  }
}

const loadConversations = async () => {
  try {
    const response = await api.conversations.list()
    if (response.success && response.data) {
      return response.data
    }
    return []
  } catch (error) {
    console.error('[Dashboard] Erreur chargement conversations:', error)
    return []
  }
}

const loadOrders = async () => {
  try {
    const response = await api.orders.list()
    if (response.success && response.data) {
      // L'API retourne { orders: [...], pagination: {...}, analytics: {...} }
      return response.data.orders || response.data
    }
    return []
  } catch (error) {
    console.error('[Dashboard] Erreur chargement commandes:', error)
    return []
  }
}

const loadDashboardData = async () => {
  try {
    const [conversationsData, ordersData, productsData] = await Promise.allSettled([
      loadConversations(),
      loadOrders(),
      loadProducts()
    ])

    if (conversationsData.status === 'fulfilled') {
      const convs = conversationsData.value
      dashboardStats.value.conversations = {
        total: convs.length,
        active: convs.filter((c: any) => c.status === 'active' || c.status === 'open').length
      }
    }

    if (ordersData.status === 'fulfilled') {
      const orders = ordersData.value
      const totalConversations = dashboardStats.value.conversations.total
      const orderCount = Array.isArray(orders) ? orders.length : 0

      dashboardStats.value.orders = {
        total: orderCount,
        conversionRate: totalConversations > 0 ? Math.round((orderCount / totalConversations) * 100) : 0
      }

      if (orderCount > 0) {
        // Détecter la devise depuis la première commande
        if (orders[0]?.currency) shopCurrency.value = orders[0].currency
        const totalRevenue = orders.reduce((sum: number, order: any) => sum + (parseFloat(order.total_amount) || order.amount || 0), 0)
        dashboardStats.value.revenue = {
          total: totalRevenue,
          average: Math.round(totalRevenue / orderCount)
        }
      }
    }

    if (productsData.status === 'fulfilled') {
      const products = productsData.value
      dashboardStats.value.products.total = products.length
    }
  } catch (error) {
    console.error('[Dashboard] Erreur chargement dashboard:', error)
  } finally {
    loadingStats.value = false
  }
}

const markWidgetAsIntegrated = async () => {
  try {
    const shopId = authStore.userShopId
    if (!shopId) return

    const response = await api.shops.update(shopId, {
      widget_integrated: true
    })

    if (response.success) {
      setupStatus.value.widgetIntegrated = true
      showNotification('Widget marqué comme intégré')
    }
  } catch (error) {
    console.error('[Dashboard] Erreur markWidgetAsIntegrated:', error)
  }
}

const handleRefreshData = async () => {
  refreshing.value = true
  try {
    await Promise.all([
      loadAgent(),
      loadDashboardData()
    ])
    showNotification('Donnees actualisees')
  } catch (error) {
    console.error('[Dashboard] Erreur rafraichissement:', error)
  } finally {
    refreshing.value = false
  }
}

// ========== LIFECYCLE ==========
onMounted(async () => {
  // Handle auth token in hash (redirect from Supabase)
  const hash = window.location.hash
  if (hash && hash.includes('access_token')) {
    window.location.href = `/auth/callback${hash}`
    return
  }

  // Capture URL params before async calls
  const urlParams = new URLSearchParams(window.location.search)
  const onboardingCompleted = urlParams.get('onboarding') === 'completed'
  const welcomeParam = urlParams.get('welcome') === 'true'
  const welcomeShown = localStorage.getItem('chatseller_welcome_shown')
  const justCompletedOnboarding = sessionStorage.getItem('chatseller_onboarding_just_completed')

  const shouldShowWelcomeModal = !welcomeShown && (onboardingCompleted || welcomeParam || justCompletedOnboarding)

  if (shouldShowWelcomeModal) {
    sessionStorage.removeItem('chatseller_onboarding_just_completed')
    window.history.replaceState({}, '', '/')
  }

  // Check dismissed reminder
  const reminderWasDismissed = sessionStorage.getItem('chatseller_reminder_dismissed')
  if (reminderWasDismissed) {
    reminderDismissed.value = true
  }

  // Read sync diagnostic from onboarding (if exists)
  try {
    const syncDiag = sessionStorage.getItem('chatseller_sync_diagnostic')
    if (syncDiag) {
      const diagnostic = JSON.parse(syncDiag)
      console.log('[Dashboard] Sync diagnostic:', diagnostic)
    }
  } catch (e) { /* ignore */ }

  // Load data
  await loadAgent()
  await loadBeautyProfile()
  await loadDashboardData()

  // Show welcome modal after data is loaded
  if (shouldShowWelcomeModal) {
    showWelcomeModal.value = true
  }
})

// ========== SEO ==========
useHead({
  title: 'Tableau de bord - ChatSeller',
  meta: [
    { name: 'description', content: 'Gerez votre vendeuse IA - Conversations, Ventes et Performances' }
  ]
})
</script>

<style scoped>
/* Brand buttons */
.btn-brand-primary {
  background-color: var(--color-primary);
  color: #ffffff;
  transition: background-color 0.2s ease, box-shadow 0.2s ease;
}
.btn-brand-primary:hover {
  background-color: var(--color-primary-hover);
  box-shadow: 0 4px 12px rgba(234, 66, 66, 0.25);
}

.btn-brand-secondary {
  background-color: transparent;
  color: var(--color-primary);
  border: 1.5px solid var(--color-primary);
  transition: background-color 0.2s ease;
}
.btn-brand-secondary:hover {
  background-color: var(--color-primary-light);
}

/* Smooth loading animation */
@keyframes pulse {
  0%, 100% { opacity: 1; }
  50% { opacity: 0.5; }
}
.animate-pulse {
  animation: pulse 2s cubic-bezier(0.4, 0, 0.6, 1) infinite;
}

/* Touch-friendly */
@media (pointer: coarse) {
  button, a {
    min-height: 44px;
  }
}

/* Confetti animation */
.confetti-container {
  position: fixed;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  pointer-events: none;
  overflow: hidden;
  z-index: 51;
}
.confetti-piece {
  position: absolute;
  top: -10px;
  width: 10px;
  height: 10px;
  border-radius: 2px;
  animation: confetti-fall linear forwards;
  opacity: 0.9;
}
.confetti-piece:nth-child(odd) {
  width: 6px;
  height: 14px;
  border-radius: 3px;
}
@keyframes confetti-fall {
  0% {
    transform: translateY(-10px) rotate(0deg);
    opacity: 1;
  }
  100% {
    transform: translateY(100vh) rotate(720deg);
    opacity: 0;
  }
}
</style>
