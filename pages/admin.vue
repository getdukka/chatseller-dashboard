<!-- pages/admin.vue — Super Admin Dashboard -->
<template>
  <div class="min-h-screen bg-gray-950 text-gray-100">

    <!-- Header -->
    <header class="border-b border-gray-800 bg-gray-900/80 backdrop-blur-sm sticky top-0 z-30">
      <div class="max-w-[1600px] mx-auto px-6 py-4 flex items-center justify-between">
        <div class="flex items-center gap-3">
          <div class="w-8 h-8 bg-rose-600 rounded-lg flex items-center justify-center">
            <svg class="w-4 h-4 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z"/>
            </svg>
          </div>
          <div>
            <h1 class="text-lg font-bold text-white">ChatSeller Admin</h1>
            <p class="text-xs text-gray-500">Super Admin Panel</p>
          </div>
        </div>
        <div class="flex items-center gap-4">
          <span class="text-xs text-gray-500">{{ adminEmail }}</span>
          <NuxtLink to="/" class="text-sm text-gray-400 hover:text-white transition-colors">
            Retour au dashboard
          </NuxtLink>
        </div>
      </div>
    </header>

    <!-- Loading -->
    <div v-if="loading" class="flex items-center justify-center py-32">
      <div class="text-center">
        <svg class="animate-spin w-8 h-8 text-rose-500 mx-auto mb-4" fill="none" viewBox="0 0 24 24">
          <circle class="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" stroke-width="4"></circle>
          <path class="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
        </svg>
        <p class="text-gray-500">Chargement des donnees...</p>
      </div>
    </div>

    <!-- Main Content -->
    <div v-else class="max-w-[1600px] mx-auto px-6 py-8 space-y-8">

      <!-- Tab Navigation -->
      <div class="flex gap-1 bg-gray-900 rounded-xl p-1 w-fit">
        <button
          v-for="tab in tabs"
          :key="tab.id"
          @click="activeTab = tab.id"
          class="px-5 py-2 text-sm font-medium rounded-lg transition-all"
          :class="activeTab === tab.id ? 'bg-gray-800 text-white shadow-sm' : 'text-gray-400 hover:text-gray-200'"
        >
          {{ tab.label }}
        </button>
      </div>

      <!-- ===== TAB: Overview ===== -->
      <div v-if="activeTab === 'overview'">

        <!-- Top KPIs -->
        <div class="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-6 gap-4 mb-8">
          <div class="kpi-card"><p class="kpi-label">Utilisateurs</p><p class="text-2xl font-bold text-white">{{ overview.total_shops }}</p></div>
          <div class="kpi-card"><p class="kpi-label">Inscrits ce mois</p><p class="text-2xl font-bold text-white">{{ overview.signups_this_month }}</p><span v-if="overview.signup_growth_percent != null" class="text-xs font-medium" :class="overview.signup_growth_percent >= 0 ? 'text-green-400' : 'text-red-400'">{{ overview.signup_growth_percent >= 0 ? '+' : '' }}{{ overview.signup_growth_percent }}%</span></div>
          <div class="kpi-card"><p class="kpi-label">MRR</p><p class="text-2xl font-bold text-green-400">{{ formatCurrency(overview.mrr) }}</p></div>
          <div class="kpi-card"><p class="kpi-label">Abonnements actifs</p><p class="text-2xl font-bold text-green-400">{{ overview.active_subscriptions }}</p></div>
          <div class="kpi-card"><p class="kpi-label">Essais actifs</p><p class="text-2xl font-bold text-amber-400">{{ overview.active_trials }}</p></div>
          <div class="kpi-card"><p class="kpi-label">Essais expires</p><p class="text-2xl font-bold text-red-400">{{ overview.expired_trials }}</p></div>
        </div>

        <!-- Secondary KPIs -->
        <div class="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-5 gap-4 mb-8">
          <div class="kpi-card"><p class="kpi-label">Conversations</p><p class="text-2xl font-bold text-white">{{ overview.total_conversations }}</p><span class="text-xs text-gray-500">{{ overview.conversations_this_month }} ce mois</span></div>
          <div class="kpi-card"><p class="kpi-label">Messages</p><p class="text-2xl font-bold text-white">{{ overview.total_messages }}</p><span class="text-xs text-gray-500">~{{ overview.avg_messages_per_conversation }} / conv.</span></div>
          <div class="kpi-card"><p class="kpi-label">Commandes</p><p class="text-2xl font-bold text-green-400">{{ overview.total_orders }}</p><span class="text-xs text-gray-500">{{ overview.orders_this_month }} ce mois</span></div>
          <div class="kpi-card"><p class="kpi-label">Produits</p><p class="text-2xl font-bold text-white">{{ overview.total_products }}</p></div>
          <div class="kpi-card"><p class="kpi-label">Docs KB</p><p class="text-2xl font-bold text-white">{{ overview.total_knowledge_base }}</p></div>
        </div>

        <!-- Plans breakdown + Onboarding -->
        <div class="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8">
          <!-- Plans -->
          <div class="bg-gray-900 rounded-xl border border-gray-800 p-6">
            <h3 class="text-sm font-semibold text-gray-400 uppercase tracking-wider mb-4">Repartition par plan</h3>
            <div class="space-y-3">
              <div v-for="plan in planBars" :key="plan.label">
                <div class="flex justify-between text-sm mb-1">
                  <span class="text-gray-300">{{ plan.label }}</span>
                  <span class="text-white font-mono">{{ plan.count }} <span class="text-gray-600">({{ plan.pct }}%)</span></span>
                </div>
                <div class="h-2 bg-gray-800 rounded-full overflow-hidden">
                  <div class="h-full rounded-full transition-all" :class="plan.barColor" :style="{ width: plan.pct + '%' }"></div>
                </div>
              </div>
            </div>
          </div>

          <!-- Onboarding funnel -->
          <div class="bg-gray-900 rounded-xl border border-gray-800 p-6">
            <h3 class="text-sm font-semibold text-gray-400 uppercase tracking-wider mb-4">Onboarding</h3>
            <div class="space-y-4">
              <div>
                <div class="flex justify-between text-sm mb-1">
                  <span class="text-gray-300">Complete</span>
                  <span class="text-green-400 font-mono">{{ overview.onboarding_completed }}</span>
                </div>
                <div class="h-2 bg-gray-800 rounded-full overflow-hidden">
                  <div class="h-full bg-green-500 rounded-full transition-all" :style="{ width: onboardingRate + '%' }"></div>
                </div>
              </div>
              <div>
                <div class="flex justify-between text-sm mb-1">
                  <span class="text-gray-300">Non complete</span>
                  <span class="text-amber-400 font-mono">{{ overview.onboarding_not_completed }}</span>
                </div>
                <div class="h-2 bg-gray-800 rounded-full overflow-hidden">
                  <div class="h-full bg-amber-500 rounded-full transition-all" :style="{ width: (100 - onboardingRate) + '%' }"></div>
                </div>
              </div>
              <p class="text-xs text-gray-500 pt-2">
                Taux de completion : <span class="text-white font-semibold">{{ onboardingRate }}%</span>
              </p>
            </div>
          </div>
        </div>

        <!-- Revenue from orders -->
        <div class="bg-gray-900 rounded-xl border border-gray-800 p-6 mb-8">
          <h3 class="text-sm font-semibold text-gray-400 uppercase tracking-wider mb-4">Revenus commandes (via widget)</h3>
          <div class="grid grid-cols-2 md:grid-cols-4 gap-6">
            <div>
              <p class="text-2xl font-bold text-white">{{ formatNumber(overview.total_revenue) }}</p>
              <p class="text-xs text-gray-500 mt-1">Revenu total (FCFA)</p>
            </div>
            <div>
              <p class="text-2xl font-bold text-white">{{ formatNumber(overview.revenue_this_month) }}</p>
              <p class="text-xs text-gray-500 mt-1">Ce mois (FCFA)</p>
            </div>
            <div>
              <p class="text-2xl font-bold text-white">{{ overview.total_orders }}</p>
              <p class="text-xs text-gray-500 mt-1">Commandes totales</p>
            </div>
            <div>
              <p class="text-2xl font-bold text-white">{{ overview.orders_this_month }}</p>
              <p class="text-xs text-gray-500 mt-1">Ce mois</p>
            </div>
          </div>
        </div>

        <!-- Activity feed -->
        <div class="bg-gray-900 rounded-xl border border-gray-800 p-6">
          <div class="flex items-center justify-between mb-4">
            <h3 class="text-sm font-semibold text-gray-400 uppercase tracking-wider">Activite recente (7 jours)</h3>
            <button @click="loadActivity" class="text-xs text-rose-400 hover:text-rose-300 transition-colors">Rafraichir</button>
          </div>
          <div v-if="activities.length === 0" class="text-center py-8 text-gray-600">
            Aucune activite recente
          </div>
          <div v-else class="space-y-2 max-h-[400px] overflow-y-auto">
            <div
              v-for="(activity, idx) in activities"
              :key="idx"
              class="flex items-start gap-3 py-2.5 px-3 rounded-lg hover:bg-gray-800/50 transition-colors"
            >
              <div
                class="w-2 h-2 rounded-full mt-2 flex-shrink-0"
                :class="{
                  'bg-blue-400': activity.type === 'signup',
                  'bg-gray-500': activity.type === 'conversation',
                  'bg-green-400': activity.type === 'order'
                }"
              ></div>
              <div class="flex-1 min-w-0">
                <p class="text-sm text-gray-300 truncate">{{ activity.description }}</p>
                <p class="text-xs text-gray-600">{{ formatRelativeTime(activity.timestamp) }}</p>
              </div>
              <span
                class="text-[10px] uppercase font-semibold px-2 py-0.5 rounded-full flex-shrink-0"
                :class="{
                  'bg-blue-900/50 text-blue-300': activity.type === 'signup',
                  'bg-gray-800 text-gray-400': activity.type === 'conversation',
                  'bg-green-900/50 text-green-300': activity.type === 'order'
                }"
              >
                {{ activity.type }}
              </span>
            </div>
          </div>
        </div>
      </div>

      <!-- ===== TAB: Users ===== -->
      <div v-if="activeTab === 'users'">

        <!-- Filters -->
        <div class="flex flex-wrap items-center gap-3 mb-6">
          <div class="relative flex-1 min-w-[200px] max-w-md">
            <input
              v-model="userSearch"
              type="text"
              placeholder="Rechercher par nom ou email..."
              class="w-full bg-gray-900 border border-gray-700 rounded-lg px-4 py-2.5 text-sm text-white placeholder-gray-500 focus:ring-2 focus:ring-rose-500 focus:border-rose-500 outline-none"
              @input="debouncedLoadUsers"
            />
          </div>
          <select
            v-model="userPlanFilter"
            @change="loadUsers"
            class="bg-gray-900 border border-gray-700 rounded-lg px-3 py-2.5 text-sm text-white focus:ring-2 focus:ring-rose-500 outline-none"
          >
            <option value="">Tous les plans</option>
            <option value="starter">Starter</option>
            <option value="growth">Growth</option>
            <option value="performance">Performance</option>
          </select>
          <select
            v-model="userSort"
            @change="loadUsers"
            class="bg-gray-900 border border-gray-700 rounded-lg px-3 py-2.5 text-sm text-white focus:ring-2 focus:ring-rose-500 outline-none"
          >
            <option value="created_at">Plus recents</option>
            <option value="name">Nom A-Z</option>
            <option value="revenue">Revenu</option>
          </select>
          <span class="text-sm text-gray-500">{{ usersTotal }} utilisateur{{ usersTotal > 1 ? 's' : '' }}</span>
        </div>

        <!-- Users table -->
        <div class="bg-gray-900 rounded-xl border border-gray-800 overflow-hidden">
          <div class="overflow-x-auto">
            <table class="w-full text-sm">
              <thead>
                <tr class="border-b border-gray-800">
                  <th class="text-left px-4 py-3 text-gray-400 font-medium">Utilisateur</th>
                  <th class="text-left px-4 py-3 text-gray-400 font-medium">Plan</th>
                  <th class="text-left px-4 py-3 text-gray-400 font-medium">Statut</th>
                  <th class="text-right px-4 py-3 text-gray-400 font-medium">Conversations</th>
                  <th class="text-right px-4 py-3 text-gray-400 font-medium">Commandes</th>
                  <th class="text-right px-4 py-3 text-gray-400 font-medium">Produits</th>
                  <th class="text-right px-4 py-3 text-gray-400 font-medium">Revenu</th>
                  <th class="text-left px-4 py-3 text-gray-400 font-medium">Inscription</th>
                  <th class="text-center px-4 py-3 text-gray-400 font-medium">Actions</th>
                </tr>
              </thead>
              <tbody>
                <tr
                  v-for="user in users"
                  :key="user.id"
                  class="border-b border-gray-800/50 hover:bg-gray-800/30 transition-colors"
                >
                  <td class="px-4 py-3">
                    <div>
                      <p class="text-white font-medium">{{ user.name || 'Sans nom' }}</p>
                      <p class="text-xs text-gray-500">{{ user.email }}</p>
                      <p v-if="user.domain" class="text-xs text-gray-600">{{ user.domain }}</p>
                    </div>
                  </td>
                  <td class="px-4 py-3">
                    <span
                      class="text-xs font-semibold px-2 py-1 rounded-full"
                      :class="{
                        'bg-gray-800 text-gray-300': user.subscription_plan === 'starter',
                        'bg-rose-900/50 text-rose-300': user.subscription_plan === 'growth',
                        'bg-violet-900/50 text-violet-300': user.subscription_plan === 'performance'
                      }"
                    >
                      {{ user.subscription_plan }}
                    </span>
                  </td>
                  <td class="px-4 py-3">
                    <div class="flex flex-col gap-1">
                      <span
                        class="text-xs font-medium"
                        :class="user.is_active !== false ? 'text-green-400' : 'text-red-400'"
                      >
                        {{ user.is_active !== false ? 'Actif' : 'Inactif' }}
                      </span>
                      <span v-if="!user.onboarding_completed" class="text-[10px] text-amber-500">Onboarding incomplet</span>
                      <span v-if="user.trial_ends_at && !user.stripe_subscription_id" class="text-[10px] text-gray-500">
                        Trial : {{ isTrialActive(user.trial_ends_at) ? 'Actif' : 'Expire' }}
                      </span>
                      <span v-if="user.stripe_subscription_id" class="text-[10px] text-green-600">Stripe actif</span>
                    </div>
                  </td>
                  <td class="px-4 py-3 text-right font-mono text-gray-300">{{ user.conversations_count }}</td>
                  <td class="px-4 py-3 text-right font-mono text-gray-300">{{ user.orders_count }}</td>
                  <td class="px-4 py-3 text-right font-mono text-gray-300">{{ user.products_count }}</td>
                  <td class="px-4 py-3 text-right font-mono text-green-400">
                    {{ user.total_revenue > 0 ? formatNumber(user.total_revenue) : '-' }}
                  </td>
                  <td class="px-4 py-3 text-gray-400 text-xs">
                    {{ formatDate(user.created_at) }}
                  </td>
                  <td class="px-4 py-3 text-center">
                    <button
                      @click="openUserDetail(user)"
                      class="text-xs text-rose-400 hover:text-rose-300 transition-colors underline"
                    >
                      Detail
                    </button>
                  </td>
                </tr>
              </tbody>
            </table>
          </div>

          <!-- Pagination -->
          <div v-if="usersTotal > 50" class="flex items-center justify-between px-4 py-3 border-t border-gray-800">
            <button
              @click="usersOffset = Math.max(0, usersOffset - 50); loadUsers()"
              :disabled="usersOffset === 0"
              class="text-sm text-gray-400 hover:text-white disabled:opacity-30 disabled:cursor-not-allowed"
            >
              Precedent
            </button>
            <span class="text-xs text-gray-500">{{ usersOffset + 1 }}-{{ Math.min(usersOffset + 50, usersTotal) }} / {{ usersTotal }}</span>
            <button
              @click="usersOffset += 50; loadUsers()"
              :disabled="usersOffset + 50 >= usersTotal"
              class="text-sm text-gray-400 hover:text-white disabled:opacity-30 disabled:cursor-not-allowed"
            >
              Suivant
            </button>
          </div>
        </div>
      </div>

      <!-- ===== TAB: Revenue ===== -->
      <div v-if="activeTab === 'revenue'">
        <div class="grid grid-cols-1 md:grid-cols-3 gap-4 mb-8">
          <div class="bg-gray-900 rounded-xl border border-gray-800 p-6">
            <p class="text-xs text-gray-500 uppercase tracking-wider mb-2">MRR Actuel</p>
            <p class="text-3xl font-bold text-green-400">{{ formatCurrency(revenue.mrr) }}</p>
          </div>
          <div class="bg-gray-900 rounded-xl border border-gray-800 p-6">
            <p class="text-xs text-gray-500 uppercase tracking-wider mb-2">Abonnements Stripe</p>
            <p class="text-3xl font-bold text-white">{{ revenue.stripe_subscriptions?.length || 0 }}</p>
          </div>
          <div class="bg-gray-900 rounded-xl border border-gray-800 p-6">
            <p class="text-xs text-gray-500 uppercase tracking-wider mb-2">Churn total (6 mois)</p>
            <p class="text-3xl font-bold text-red-400">{{ totalChurn }}</p>
          </div>
        </div>

        <!-- Monthly Stripe Revenue -->
        <div class="bg-gray-900 rounded-xl border border-gray-800 p-6 mb-8">
          <h3 class="text-sm font-semibold text-gray-400 uppercase tracking-wider mb-4">Revenu Stripe mensuel (12 mois)</h3>
          <div v-if="Object.keys(revenue.stripe_monthly_revenue || {}).length === 0" class="text-center py-8 text-gray-600">
            Aucune donnee Stripe disponible
          </div>
          <div v-else class="flex items-end gap-2 h-40">
            <div
              v-for="(amount, month) in sortedMonthlyRevenue"
              :key="month"
              class="flex-1 flex flex-col items-center gap-1"
            >
              <span class="text-[10px] text-gray-400 font-mono">{{ formatCurrency(amount) }}</span>
              <div
                class="w-full bg-green-600 rounded-t"
                :style="{ height: maxMonthlyRevenue > 0 ? `${Math.max(4, (amount / maxMonthlyRevenue) * 120)}px` : '4px' }"
              ></div>
              <span class="text-[10px] text-gray-500">{{ formatMonthLabel(month) }}</span>
            </div>
          </div>
        </div>

        <!-- Churn by month -->
        <div class="bg-gray-900 rounded-xl border border-gray-800 p-6 mb-8">
          <h3 class="text-sm font-semibold text-gray-400 uppercase tracking-wider mb-4">Churn mensuel (6 mois)</h3>
          <div v-if="Object.keys(revenue.churn_by_month || {}).length === 0" class="text-center py-8 text-gray-600">
            Aucun churn enregistre
          </div>
          <div v-else class="flex items-end gap-3 h-32">
            <div
              v-for="(count, month) in revenue.churn_by_month"
              :key="month"
              class="flex-1 flex flex-col items-center gap-1"
            >
              <span class="text-xs text-red-400 font-mono">{{ count }}</span>
              <div
                class="w-full bg-red-600 rounded-t"
                :style="{ height: `${Math.max(4, count * 30)}px` }"
              ></div>
              <span class="text-[10px] text-gray-500">{{ formatMonthLabel(month) }}</span>
            </div>
          </div>
        </div>

        <!-- Stripe Subscriptions table -->
        <div class="bg-gray-900 rounded-xl border border-gray-800 p-6">
          <h3 class="text-sm font-semibold text-gray-400 uppercase tracking-wider mb-4">Abonnements Stripe actifs</h3>
          <div v-if="!revenue.stripe_subscriptions?.length" class="text-center py-8 text-gray-600">
            Aucun abonnement actif
          </div>
          <table v-else class="w-full text-sm">
            <thead>
              <tr class="border-b border-gray-800">
                <th class="text-left py-2 text-gray-400">Email</th>
                <th class="text-left py-2 text-gray-400">Plan</th>
                <th class="text-right py-2 text-gray-400">Montant</th>
                <th class="text-left py-2 text-gray-400">Depuis</th>
                <th class="text-left py-2 text-gray-400">Prochaine facture</th>
              </tr>
            </thead>
            <tbody>
              <tr v-for="sub in revenue.stripe_subscriptions" :key="sub.subscription_id" class="border-b border-gray-800/50">
                <td class="py-2 text-gray-300">{{ sub.customer_email || '-' }}</td>
                <td class="py-2 text-gray-300">{{ sub.plan_name || '-' }}</td>
                <td class="py-2 text-right text-green-400 font-mono">{{ sub.plan_amount }}{{ sub.plan_currency?.toUpperCase() }}/{{ sub.plan_interval }}</td>
                <td class="py-2 text-gray-400 text-xs">{{ formatDate(sub.created) }}</td>
                <td class="py-2 text-gray-400 text-xs">{{ formatDate(sub.current_period_end) }}</td>
              </tr>
            </tbody>
          </table>
        </div>
      </div>

    </div>

    <!-- ===== USER DETAIL MODAL ===== -->
    <Transition
      enter-active-class="transition ease-out duration-200"
      enter-from-class="opacity-0"
      enter-to-class="opacity-100"
      leave-active-class="transition ease-in duration-150"
      leave-from-class="opacity-100"
      leave-to-class="opacity-0"
    >
      <div v-if="selectedUser" class="fixed inset-0 bg-black/60 backdrop-blur-sm z-50 flex items-start justify-center pt-12 px-4 overflow-y-auto">
        <div class="bg-gray-900 rounded-2xl border border-gray-700 max-w-3xl w-full mb-12 shadow-2xl">
          <!-- Modal header -->
          <div class="flex items-center justify-between px-6 py-4 border-b border-gray-800">
            <div>
              <h2 class="text-lg font-bold text-white">{{ selectedUser.shop?.name || 'Utilisateur' }}</h2>
              <p class="text-sm text-gray-400">{{ selectedUser.shop?.email }}</p>
            </div>
            <button @click="selectedUser = null" class="text-gray-500 hover:text-white transition-colors">
              <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12"/>
              </svg>
            </button>
          </div>

          <!-- Modal body -->
          <div class="p-6 space-y-6 max-h-[70vh] overflow-y-auto">

            <!-- Quick info -->
            <div class="grid grid-cols-2 md:grid-cols-4 gap-4">
              <div class="bg-gray-800 rounded-lg p-3">
                <p class="text-xs text-gray-500">Plan</p>
                <p class="text-sm font-semibold text-white">{{ selectedUser.shop?.subscription_plan }}</p>
              </div>
              <div class="bg-gray-800 rounded-lg p-3">
                <p class="text-xs text-gray-500">Plateforme</p>
                <p class="text-sm font-semibold text-white">{{ selectedUser.shop?.platform || '-' }}</p>
              </div>
              <div class="bg-gray-800 rounded-lg p-3">
                <p class="text-xs text-gray-500">Produits</p>
                <p class="text-sm font-semibold text-white">{{ selectedUser.products_count }}</p>
              </div>
              <div class="bg-gray-800 rounded-lg p-3">
                <p class="text-xs text-gray-500">Docs KB</p>
                <p class="text-sm font-semibold text-white">{{ selectedUser.knowledge_base_count }}</p>
              </div>
            </div>

            <!-- Stripe info -->
            <div v-if="selectedUser.stripe" class="bg-green-900/20 rounded-xl border border-green-800/30 p-4">
              <h4 class="text-xs font-semibold text-green-400 uppercase tracking-wider mb-3">Stripe</h4>
              <div class="grid grid-cols-2 gap-3 text-sm">
                <div><span class="text-gray-500">Statut : </span><span class="text-green-400">{{ selectedUser.stripe.status }}</span></div>
                <div><span class="text-gray-500">Montant : </span><span class="text-white">{{ selectedUser.stripe.plan_amount }} {{ selectedUser.stripe.plan_currency?.toUpperCase() }}/{{ selectedUser.stripe.plan_interval }}</span></div>
                <div><span class="text-gray-500">Fin periode : </span><span class="text-white">{{ formatDate(selectedUser.stripe.current_period_end) }}</span></div>
                <div><span class="text-gray-500">Annulation prevue : </span><span :class="selectedUser.stripe.cancel_at_period_end ? 'text-red-400' : 'text-green-400'">{{ selectedUser.stripe.cancel_at_period_end ? 'Oui' : 'Non' }}</span></div>
              </div>
            </div>

            <!-- Agent(s) -->
            <div v-if="selectedUser.agents?.length">
              <h4 class="text-xs font-semibold text-gray-400 uppercase tracking-wider mb-3">Agent(s) IA</h4>
              <div v-for="agent in selectedUser.agents" :key="agent.id" class="bg-gray-800 rounded-lg p-3 flex items-center gap-3 mb-2">
                <div class="w-8 h-8 bg-rose-600 rounded-full flex items-center justify-center text-white text-xs font-bold">
                  {{ (agent.name || 'M').charAt(0) }}
                </div>
                <div>
                  <p class="text-sm text-white font-medium">{{ agent.name }}</p>
                  <p class="text-xs text-gray-500">{{ agent.type }} · {{ agent.personality }}</p>
                </div>
              </div>
            </div>

            <!-- Recent conversations -->
            <div v-if="selectedUser.conversations?.length">
              <h4 class="text-xs font-semibold text-gray-400 uppercase tracking-wider mb-3">Conversations recentes</h4>
              <div class="space-y-1">
                <div v-for="conv in selectedUser.conversations" :key="conv.id" class="flex items-center justify-between py-2 px-3 bg-gray-800/50 rounded-lg text-sm">
                  <span class="text-gray-300 text-xs font-mono">{{ conv.id.slice(0, 8) }}...</span>
                  <span class="text-gray-400">{{ conv.message_count }} msgs</span>
                  <span class="text-xs" :class="conv.status === 'active' ? 'text-green-400' : 'text-gray-500'">{{ conv.status }}</span>
                  <span class="text-gray-500 text-xs">{{ formatDate(conv.created_at) }}</span>
                </div>
              </div>
            </div>

            <!-- Recent orders -->
            <div v-if="selectedUser.orders?.length">
              <h4 class="text-xs font-semibold text-gray-400 uppercase tracking-wider mb-3">Commandes recentes</h4>
              <div class="space-y-1">
                <div v-for="order in selectedUser.orders" :key="order.id" class="flex items-center justify-between py-2 px-3 bg-gray-800/50 rounded-lg text-sm">
                  <span class="text-gray-300">{{ order.customer_name || 'Client' }}</span>
                  <span class="text-green-400 font-mono">{{ formatNumber(order.total_amount) }} {{ order.currency }}</span>
                  <span class="text-xs" :class="{
                    'text-green-400': order.status === 'confirmed' || order.status === 'delivered',
                    'text-amber-400': order.status === 'pending',
                    'text-red-400': order.status === 'cancelled'
                  }">{{ order.status }}</span>
                  <span class="text-gray-500 text-xs">{{ formatDate(order.created_at) }}</span>
                </div>
              </div>
            </div>

            <!-- Admin actions -->
            <div class="border-t border-gray-800 pt-4">
              <h4 class="text-xs font-semibold text-gray-400 uppercase tracking-wider mb-3">Actions admin</h4>
              <div class="flex flex-wrap gap-3">
                <select
                  v-model="adminAction.plan"
                  class="bg-gray-800 border border-gray-700 rounded-lg px-3 py-2 text-sm text-white"
                >
                  <option value="">Changer le plan...</option>
                  <option value="starter">Starter</option>
                  <option value="growth">Growth</option>
                  <option value="performance">Performance</option>
                </select>
                <button
                  v-if="adminAction.plan"
                  @click="updateUser(selectedUser.shop.id, { subscription_plan: adminAction.plan })"
                  class="px-4 py-2 bg-rose-600 text-white text-sm rounded-lg hover:bg-rose-700 transition-colors"
                >
                  Appliquer
                </button>
                <button
                  @click="updateUser(selectedUser.shop.id, { is_active: !(selectedUser.shop.is_active !== false) })"
                  class="px-4 py-2 text-sm rounded-lg transition-colors"
                  :class="selectedUser.shop.is_active !== false ? 'bg-red-900/50 text-red-300 hover:bg-red-800/50' : 'bg-green-900/50 text-green-300 hover:bg-green-800/50'"
                >
                  {{ selectedUser.shop.is_active !== false ? 'Desactiver' : 'Reactiver' }}
                </button>
                <button
                  @click="extendTrial(selectedUser.shop.id)"
                  class="px-4 py-2 bg-amber-900/50 text-amber-300 text-sm rounded-lg hover:bg-amber-800/50 transition-colors"
                >
                  +14j trial
                </button>
              </div>
              <p v-if="adminActionMessage" class="text-xs mt-2" :class="adminActionError ? 'text-red-400' : 'text-green-400'">
                {{ adminActionMessage }}
              </p>
            </div>
          </div>
        </div>
      </div>
    </Transition>
  </div>
</template>

<script setup lang="ts">
import { useAuthStore } from '~~/stores/auth'
import { useSupabase } from '~~/composables/useSupabase'

definePageMeta({
  layout: false,
  middleware: ['admin']
})

const config = useRuntimeConfig()
const authStore = useAuthStore()
const adminEmail = authStore.user?.email || authStore.userEmail

// ===== State =====
const loading = ref(true)
const activeTab = ref('overview')
const tabs = [
  { id: 'overview', label: 'Vue d\'ensemble' },
  { id: 'users', label: 'Utilisateurs' },
  { id: 'revenue', label: 'Revenus' }
]

// Overview
const overview = ref<any>({
  total_shops: 0, signups_this_month: 0, signups_last_month: 0, signup_growth_percent: null,
  plans: { starter: 0, growth: 0, performance: 0 },
  active_trials: 0, expired_trials: 0,
  onboarding_completed: 0, onboarding_not_completed: 0,
  total_conversations: 0, conversations_this_month: 0,
  total_orders: 0, total_revenue: 0, orders_this_month: 0, revenue_this_month: 0,
  total_messages: 0, total_products: 0, total_knowledge_base: 0,
  avg_messages_per_conversation: 0, mrr: 0, active_subscriptions: 0
})
const activities = ref<any[]>([])

// Users
const users = ref<any[]>([])
const usersTotal = ref(0)
const userSearch = ref('')
const userPlanFilter = ref('')
const userSort = ref('created_at')
const usersOffset = ref(0)

// Revenue
const revenue = ref<any>({
  mrr: 0, stripe_monthly_revenue: {}, stripe_subscriptions: [],
  churn_by_month: {}, orders_by_month: {}
})

// User detail modal
const selectedUser = ref<any>(null)
const adminAction = reactive({ plan: '' })
const adminActionMessage = ref('')
const adminActionError = ref(false)

// ===== Computed =====
const planBars = computed(() => {
  const total = overview.value.total_shops || 1
  const plans = [
    { label: 'Starter', count: overview.value.plans.starter, barColor: 'bg-gray-600' },
    { label: 'Growth', count: overview.value.plans.growth, barColor: 'bg-rose-500' },
    { label: 'Performance', count: overview.value.plans.performance, barColor: 'bg-violet-500' }
  ]
  return plans.map(p => ({ ...p, pct: Math.round((p.count / total) * 100) }))
})

const onboardingRate = computed(() => {
  const total = overview.value.total_shops
  if (!total) return 0
  return Math.round((overview.value.onboarding_completed / total) * 100)
})

const sortedMonthlyRevenue = computed(() => {
  const obj = revenue.value.stripe_monthly_revenue || {}
  const sorted: Record<string, number> = {}
  Object.keys(obj).sort().forEach(k => { sorted[k] = obj[k] })
  return sorted
})

const maxMonthlyRevenue = computed(() => {
  return Math.max(...Object.values(revenue.value.stripe_monthly_revenue || { '': 0 }).map(Number), 1)
})

const totalChurn = computed(() => {
  return Object.values(revenue.value.churn_by_month || {}).reduce((s: number, v: any) => s + Number(v), 0)
})

// ===== API helpers =====
const apiBase = config.public.apiBaseUrl || 'https://chatseller-api-production.up.railway.app'

const adminFetch = async (path: string, options: RequestInit = {}) => {
  const supabase = useSupabase()
  const { data: { session } } = await supabase.auth.getSession()
  const token = session?.access_token

  if (!token) throw new Error('Not authenticated')

  const res = await fetch(`${apiBase}/api/v1/admin${path}`, {
    ...options,
    headers: {
      'Content-Type': 'application/json',
      'Authorization': `Bearer ${token}`,
      ...options.headers
    }
  })

  if (!res.ok) {
    const text = await res.text()
    throw new Error(`Admin API error ${res.status}: ${text}`)
  }

  return res.json()
}

// ===== Data loading =====
const loadOverview = async () => {
  try {
    overview.value = await adminFetch('/overview')
  } catch (err: any) {
    console.error('Admin overview error:', err)
  }
}

const loadActivity = async () => {
  try {
    const data = await adminFetch('/activity')
    activities.value = data.activities || []
  } catch (err: any) {
    console.error('Admin activity error:', err)
  }
}

const loadUsers = async () => {
  try {
    const params = new URLSearchParams()
    if (userPlanFilter.value) params.set('plan', userPlanFilter.value)
    if (userSearch.value) params.set('search', userSearch.value)
    if (userSort.value) params.set('sort', userSort.value)
    params.set('order', userSort.value === 'name' ? 'asc' : 'desc')
    params.set('limit', '50')
    params.set('offset', String(usersOffset.value))

    const data = await adminFetch(`/users?${params.toString()}`)
    users.value = data.users || []
    usersTotal.value = data.total || 0
  } catch (err: any) {
    console.error('Admin users error:', err)
  }
}

const loadRevenue = async () => {
  try {
    revenue.value = await adminFetch('/revenue')
  } catch (err: any) {
    console.error('Admin revenue error:', err)
  }
}

let debounceTimer: any = null
const debouncedLoadUsers = () => {
  clearTimeout(debounceTimer)
  debounceTimer = setTimeout(() => {
    usersOffset.value = 0
    loadUsers()
  }, 400)
}

const openUserDetail = async (user: any) => {
  try {
    const data = await adminFetch(`/users/${user.id}`)
    selectedUser.value = data
    adminAction.plan = ''
    adminActionMessage.value = ''
  } catch (err: any) {
    console.error('Admin user detail error:', err)
  }
}

const updateUser = async (userId: string, updates: any) => {
  try {
    adminActionMessage.value = ''
    adminActionError.value = false
    const data = await adminFetch(`/users/${userId}`, {
      method: 'PUT',
      body: JSON.stringify(updates)
    })
    if (data.success) {
      adminActionMessage.value = 'Mise a jour effectuee'
      // Refresh user detail
      const refreshed = await adminFetch(`/users/${userId}`)
      selectedUser.value = refreshed
      // Refresh lists
      loadOverview()
      loadUsers()
    }
  } catch (err: any) {
    adminActionMessage.value = err.message
    adminActionError.value = true
  }
}

const extendTrial = async (userId: string) => {
  const newDate = new Date()
  newDate.setDate(newDate.getDate() + 14)
  await updateUser(userId, { trial_ends_at: newDate.toISOString() })
}

// ===== Formatting =====
const formatCurrency = (val: number) => {
  if (!val) return '0 EUR'
  return val.toLocaleString('fr-FR', { minimumFractionDigits: 0, maximumFractionDigits: 0 }) + ' EUR'
}

const formatNumber = (val: number) => {
  if (!val) return '0'
  return val.toLocaleString('fr-FR')
}

const formatDate = (dateStr: string) => {
  if (!dateStr) return '-'
  return new Date(dateStr).toLocaleDateString('fr-FR', { day: 'numeric', month: 'short', year: 'numeric' })
}

const formatRelativeTime = (dateStr: string) => {
  const diff = Date.now() - new Date(dateStr).getTime()
  const mins = Math.floor(diff / 60000)
  if (mins < 1) return 'A l\'instant'
  if (mins < 60) return `Il y a ${mins}min`
  const hours = Math.floor(mins / 60)
  if (hours < 24) return `Il y a ${hours}h`
  const days = Math.floor(hours / 24)
  return `Il y a ${days}j`
}

const formatMonthLabel = (monthKey: string) => {
  const [y, m] = monthKey.split('-')
  const months = ['Jan', 'Fev', 'Mar', 'Avr', 'Mai', 'Jun', 'Jul', 'Aou', 'Sep', 'Oct', 'Nov', 'Dec']
  return months[parseInt(m) - 1] || m
}

const isTrialActive = (trialEnds: string) => {
  return new Date(trialEnds) > new Date()
}

// ===== Init =====
onMounted(async () => {
  try {
    await Promise.all([loadOverview(), loadActivity(), loadUsers(), loadRevenue()])
  } catch (err) {
    console.error('Admin init error:', err)
  } finally {
    loading.value = false
  }
})

// Watch tab changes to refresh data
watch(activeTab, (tab) => {
  if (tab === 'users') loadUsers()
  if (tab === 'revenue') loadRevenue()
})

useHead({
  title: 'Admin - ChatSeller',
  meta: [{ name: 'robots', content: 'noindex, nofollow' }]
})
</script>

<style scoped>
.kpi-card {
  @apply bg-gray-900 rounded-xl border border-gray-800 p-4;
}
.kpi-label {
  @apply text-xs text-gray-500 uppercase tracking-wider mb-2;
}
</style>
