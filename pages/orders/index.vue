<!-- pages/orders/index.vue -->
<template>
  <div class="min-h-screen bg-gradient-to-br from-emerald-50 via-teal-50 to-cyan-50">
    <!-- Header ROI Focused -->
    <div class="bg-white shadow-sm border-b border-gray-200">
      <div class="px-8 py-6">
        <div class="flex items-center justify-between">
          <div>
            <h1 class="text-3xl font-bold text-gray-900">Analytics de Conversion</h1>
            <p class="mt-2 text-gray-600">
              Mesurez l'impact ROI de votre {{ getAgentTypeName() }} sur vos ventes
            </p>
          </div>
          
          <div class="flex items-center space-x-4">
            <!-- ROI Calculator Button -->
            <button
              @click="showROICalculator = true"
              class="inline-flex items-center px-4 py-2 bg-gradient-to-r from-emerald-600 to-teal-600 text-white text-sm font-medium rounded-lg hover:from-emerald-700 hover:to-teal-700 transition-all"
            >
              <svg class="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 7h6m0 10v-3m-3 3h.01M9 17h.01M9 14h.01M12 14h.01M15 11h.01M12 11h.01M9 11h.01M7 21h10a2 2 0 002-2V5a2 2 0 00-2-2H7a2 2 0 00-2 2v14a2 2 0 002 2z"/>
              </svg>
              Calculer ROI
            </button>

            <button
              @click="handleConversionExport"
              :disabled="exporting"
              class="inline-flex items-center px-4 py-2 border border-gray-300 rounded-lg text-sm font-medium text-gray-700 bg-white hover:bg-gray-50 disabled:opacity-50 transition-colors"
            >
              <svg class="w-4 h-4 mr-2" :class="{ 'animate-spin': exporting }" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 10v6m0 0l-3-3m3 3l3-3m2 8H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z"/>
              </svg>
              {{ exporting ? 'Export...' : 'Export Analytics' }}
            </button>
            
            <button
              @click="refreshAnalytics"
              :disabled="loading"
              class="inline-flex items-center px-4 py-2 bg-blue-600 text-white text-sm font-medium rounded-lg hover:bg-blue-700 disabled:opacity-50 transition-colors"
            >
              <svg 
                class="w-4 h-4 mr-2" 
                :class="{ 'animate-spin': loading }"
                fill="none" 
                stroke="currentColor" 
                viewBox="0 0 24 24"
              >
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15"/>
              </svg>
              {{ loading ? 'Actualisation...' : 'Actualiser' }}
            </button>
          </div>
        </div>
      </div>
    </div>

    <!-- Content -->
    <div class="p-8">
      <!-- ROI Dashboard Cards -->
      <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
        <!-- Conversions Attribuées IA -->
        <div class="card-roi-gradient from-emerald-500 to-emerald-600">
          <div class="flex items-center justify-between">
            <div class="text-white">
              <p class="text-emerald-100 text-sm font-medium">Conversions IA</p>
              <p class="text-2xl md:text-3xl font-bold">{{ analyticsData.aiConversions }}</p>
              <p class="text-emerald-100 text-sm mt-1">
                <span class="text-white font-medium">{{ analyticsData.aiConversionRate }}%</span> du trafic
              </p>
            </div>
            <div class="p-3 bg-white bg-opacity-20 rounded-xl">
              <svg class="w-8 h-8 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M13 10V3L4 14h7v7l9-11h-7z"/>
              </svg>
            </div>
          </div>
          <div class="mt-4">
            <div class="flex items-center justify-between text-emerald-100 text-sm">
              <span>vs organiques: {{ analyticsData.organicConversions }}</span>
              <span class="text-white font-medium">+{{ calculateUplift() }}%</span>
            </div>
          </div>
        </div>

        <!-- Revenus Générés IA -->
        <div class="card-roi-gradient from-teal-500 to-teal-600">
          <div class="flex items-center justify-between">
            <div class="text-white">
              <p class="text-teal-100 text-sm font-medium">CA généré par IA</p>
              <p class="text-2xl md:text-3xl font-bold">{{ formatCurrency(analyticsData.aiRevenue) }}</p>
              <p class="text-teal-100 text-sm mt-1">
                <span class="text-white font-medium">{{ formatCurrency(analyticsData.avgOrderValueAI) }}</span> panier IA
              </p>
            </div>
            <div class="p-3 bg-white bg-opacity-20 rounded-xl">
              <svg class="w-8 h-8 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1"/>
              </svg>
            </div>
          </div>
          <div class="mt-4">
            <div class="flex items-center justify-between text-teal-100 text-sm">
              <span>vs organiques: {{ formatCurrency(analyticsData.organicRevenue) }}</span>
              <span class="text-white font-medium">{{ getRevenueGrowthPercent() }}%</span>
            </div>
          </div>
        </div>

        <!-- ROI ChatSeller -->
        <div class="card-roi-gradient from-violet-500 to-purple-600">
          <div class="flex items-center justify-between">
            <div class="text-white">
              <p class="text-violet-100 text-sm font-medium">ROI ChatSeller</p>
              <p class="text-2xl md:text-3xl font-bold">{{ calculateROI() }}x</p>
              <p class="text-violet-100 text-sm mt-1">
                <span class="text-white font-medium">{{ formatCurrency(analyticsData.monthlyCost) }}</span> coût mensuel
              </p>
            </div>
            <div class="p-3 bg-white bg-opacity-20 rounded-xl">
              <svg class="w-8 h-8 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M16 8v8m-4-5v5m-4-2v2m-2 4h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z"/>
              </svg>
            </div>
          </div>
          <div class="mt-4">
            <div class="text-violet-100 text-sm">
              <span>Bénéfice net: </span>
              <span class="text-white font-medium">{{ formatCurrency(calculateNetProfit()) }}</span>
            </div>
          </div>
        </div>

        <!-- Upsells Générés -->
        <div class="card-roi-gradient from-amber-500 to-orange-600">
          <div class="flex items-center justify-between">
            <div class="text-white">
              <p class="text-amber-100 text-sm font-medium">Upsells IA</p>
              <p class="text-2xl md:text-3xl font-bold">{{ analyticsData.upsellConversions }}</p>
              <p class="text-amber-100 text-sm mt-1">
                <span class="text-white font-medium">{{ formatCurrency(analyticsData.upsellRevenue) }}</span> CA additionnel
              </p>
            </div>
            <div class="p-3 bg-white bg-opacity-20 rounded-xl">
              <svg class="w-8 h-8 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M7 11l5-5m0 0l5 5m-5-5v12"/>
              </svg>
            </div>
          </div>
          <div class="mt-4">
            <div class="text-amber-100 text-sm">
              <span>Taux upsell: </span>
              <span class="text-white font-medium">{{ calculateUpsellRate() }}%</span>
            </div>
          </div>
        </div>
      </div>

      <!-- Performance Insights Beauté -->
      <div class="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-8">
        <!-- Top Produits par IA -->
        <div class="card-modern">
          <div class="flex items-center justify-between p-6 border-b border-gray-200">
            <h3 class="text-lg font-semibold text-gray-900">Produits stars de votre IA</h3>
            <span class="text-sm text-emerald-600 font-medium">
              {{ getTopProductsRevenue() }} de CA
            </span>
          </div>
          <div class="p-6">
            <div v-if="topAIProducts.length > 0" class="space-y-4">
              <div 
                v-for="(product, index) in topAIProducts.slice(0, 5)" 
                :key="product.id"
                class="flex items-center justify-between p-3 bg-gray-50 rounded-lg"
              >
                <div class="flex items-center space-x-3">
                  <div class="w-8 h-8 bg-gradient-to-br from-emerald-500 to-teal-600 rounded-lg flex items-center justify-center text-white text-sm font-bold">
                    {{ index + 1 }}
                  </div>
                  <div>
                    <p class="text-sm font-medium text-gray-900">{{ product.name }}</p>
                    <p class="text-xs text-gray-500">{{ getProductCategoryLabel(product.category) }}</p>
                  </div>
                </div>
                <div class="text-right">
                  <p class="text-sm font-medium text-gray-900">{{ product.aiConversions }} ventes IA</p>
                  <p class="text-xs text-emerald-600">{{ formatCurrency(product.aiRevenue) }}</p>
                </div>
              </div>
            </div>
            <div v-else class="text-center py-8">
              <svg class="mx-auto h-12 w-12 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M16 11V7a4 4 0 00-8 0v4M5 9h14l1 12H4L5 9z"/>
              </svg>
              <p class="text-gray-500 text-sm mt-2">Aucune vente IA encore</p>
            </div>
          </div>
        </div>

        <!-- Insights Clientèle Beauté -->
        <div class="card-modern">
          <div class="flex items-center justify-between p-6 border-b border-gray-200">
            <h3 class="text-lg font-semibold text-gray-900">Insights clientèle beauté</h3>
            <button 
              @click="showClientInsights = true"
              class="text-sm text-blue-600 hover:text-blue-700 font-medium"
            >
              Voir détails →
            </button>
          </div>
          <div class="p-6">
            <div class="grid grid-cols-2 gap-4">
              <!-- Age Range -->
              <div class="text-center p-4 bg-rose-50 rounded-lg">
                <p class="text-sm text-rose-600 font-medium">Âge dominant</p>
                <p class="text-2xl font-bold text-rose-700">{{ beautyInsights.dominantAge }}</p>
                <p class="text-xs text-rose-500">{{ beautyInsights.agePercentage }}% des clientes</p>
              </div>

              <!-- Skin Type -->
              <div class="text-center p-4 bg-blue-50 rounded-lg">
                <p class="text-sm text-blue-600 font-medium">Type peau #1</p>
                <p class="text-2xl font-bold text-blue-700">{{ beautyInsights.topSkinType }}</p>
                <p class="text-xs text-blue-500">{{ beautyInsights.skinTypePercentage }}% des consultations</p>
              </div>

              <!-- Budget Range -->
              <div class="text-center p-4 bg-purple-50 rounded-lg">
                <p class="text-sm text-purple-600 font-medium">Budget moyen</p>
                <p class="text-2xl font-bold text-purple-700">{{ formatCurrency(beautyInsights.avgBudget) }}</p>
                <p class="text-xs text-purple-500">par session</p>
              </div>

              <!-- Loyalty -->
              <div class="text-center p-4 bg-green-50 rounded-lg">
                <p class="text-sm text-green-600 font-medium">Clientes fidèles</p>
                <p class="text-2xl font-bold text-green-700">{{ beautyInsights.loyaltyRate }}%</p>
                <p class="text-xs text-green-500">rachètent dans les 30j</p>
              </div>
            </div>
          </div>
        </div>
      </div>

      <!-- Attribution & Tracking -->
      <div class="grid grid-cols-1 lg:grid-cols-3 gap-6 mb-8">
        <!-- Méthodes d'Attribution -->
        <div class="card-modern">
          <div class="p-6 border-b border-gray-200">
            <h3 class="text-lg font-semibold text-gray-900">Attribution des conversions</h3>
          </div>
          <div class="p-6">
            <div class="space-y-3">
              <div class="flex items-center justify-between">
                <span class="text-sm text-gray-600">UTM Tracking</span>
                <span :class="attributionMethods.utm ? 'text-green-600' : 'text-gray-400'">
                  {{ attributionMethods.utm ? '✅ Actif' : '❌ Inactif' }}
                </span>
              </div>
              <div class="flex items-center justify-between">
                <span class="text-sm text-gray-600">Cookie Tracking</span>
                <span :class="attributionMethods.cookie ? 'text-green-600' : 'text-gray-400'">
                  {{ attributionMethods.cookie ? '✅ Actif' : '❌ Inactif' }}
                </span>
              </div>
              <div class="flex items-center justify-between">
                <span class="text-sm text-gray-600">Session ID</span>
                <span :class="attributionMethods.session ? 'text-green-600' : 'text-gray-400'">
                  {{ attributionMethods.session ? '✅ Actif' : '❌ Inactif' }}
                </span>
              </div>
              <div class="flex items-center justify-between">
                <span class="text-sm text-gray-600">Referral Code</span>
                <span :class="attributionMethods.referral ? 'text-green-600' : 'text-gray-400'">
                  {{ attributionMethods.referral ? '✅ Actif' : '❌ Inactif' }}
                </span>
              </div>
            </div>
            <button 
              @click="configureAttribution"
              class="w-full mt-4 px-4 py-2 bg-blue-50 text-blue-700 rounded-lg hover:bg-blue-100 transition-colors text-sm font-medium"
            >
              Configurer attribution
            </button>
          </div>
        </div>

        <!-- Conversion Funnel -->
        <div class="card-modern">
          <div class="p-6 border-b border-gray-200">
            <h3 class="text-lg font-semibold text-gray-900">Funnel de conversion IA</h3>
          </div>
          <div class="p-6">
            <div class="space-y-3">
              <div class="flex items-center justify-between">
                <span class="text-sm text-gray-600">Visiteurs widget</span>
                <span class="text-sm font-medium text-gray-900">{{ conversionFunnel.visitors }}</span>
              </div>
              <div class="w-full bg-gray-200 rounded-full h-2">
                <div class="bg-blue-500 h-2 rounded-full" style="width: 100%"></div>
              </div>
              
              <div class="flex items-center justify-between">
                <span class="text-sm text-gray-600">Conversations initiées</span>
                <span class="text-sm font-medium text-gray-900">{{ conversionFunnel.conversations }}</span>
              </div>
              <div class="w-full bg-gray-200 rounded-full h-2">
                <div class="bg-green-500 h-2 rounded-full" :style="`width: ${(conversionFunnel.conversations / conversionFunnel.visitors * 100)}%`"></div>
              </div>
              
              <div class="flex items-center justify-between">
                <span class="text-sm text-gray-600">Recommandations acceptées</span>
                <span class="text-sm font-medium text-gray-900">{{ conversionFunnel.recommendations }}</span>
              </div>
              <div class="w-full bg-gray-200 rounded-full h-2">
                <div class="bg-yellow-500 h-2 rounded-full" :style="`width: ${(conversionFunnel.recommendations / conversionFunnel.visitors * 100)}%`"></div>
              </div>
              
              <div class="flex items-center justify-between">
                <span class="text-sm text-gray-600">Conversions finales</span>
                <span class="text-sm font-medium text-gray-900">{{ conversionFunnel.conversions }}</span>
              </div>
              <div class="w-full bg-gray-200 rounded-full h-2">
                <div class="bg-emerald-500 h-2 rounded-full" :style="`width: ${(conversionFunnel.conversions / conversionFunnel.visitors * 100)}%`"></div>
              </div>
            </div>
          </div>
        </div>

        <!-- Optimisation Suggestions -->
        <div class="card-modern">
          <div class="p-6 border-b border-gray-200">
            <h3 class="text-lg font-semibold text-gray-900">Suggestions d'optimisation</h3>
          </div>
          <div class="p-6">
            <div class="space-y-4">
              <div v-for="suggestion in optimizationSuggestions" :key="suggestion.id" 
                   class="p-3 rounded-lg border border-gray-200 hover:border-blue-300 transition-colors">
                <div class="flex items-start space-x-3">
                  <div :class="suggestion.priority === 'high' ? 'bg-red-100 text-red-700' : suggestion.priority === 'medium' ? 'bg-orange-100 text-orange-700' : 'bg-green-100 text-green-700'" 
                       class="p-1 rounded">
                    <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"/>
                    </svg>
                  </div>
                  <div class="flex-1">
                    <p class="text-sm font-medium text-gray-900">{{ suggestion.title }}</p>
                    <p class="text-xs text-gray-500 mt-1">{{ suggestion.description }}</p>
                    <p class="text-xs text-emerald-600 mt-1">Gain estimé: {{ suggestion.expectedGain }}</p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      <!-- Detailed Conversions Table -->
      <div class="card-modern">
        <div class="flex items-center justify-between p-6 border-b border-gray-200">
          <div>
            <h3 class="text-lg font-semibold text-gray-900">Conversions attribuées à l'IA</h3>
            <p class="text-sm text-gray-500 mt-1">Ventes directement générées par votre {{ getAgentTypeName() }}</p>
          </div>
          <div class="flex items-center space-x-4">
            <select v-model="filters.timeRange" @change="applyFilters" class="input-modern">
              <option value="today">Aujourd'hui</option>
              <option value="week">Cette semaine</option>
              <option value="month">Ce mois-ci</option>
              <option value="quarter">Ce trimestre</option>
            </select>
            <select v-model="filters.attributionMethod" @change="applyFilters" class="input-modern">
              <option value="">Toutes attributions</option>
              <option value="utm">UTM Tracking</option>
              <option value="cookie">Cookie Tracking</option>
              <option value="session">Session ID</option>
              <option value="referral">Code parrainage</option>
            </select>
          </div>
        </div>

        <!-- Loading State -->
        <div v-if="loading" class="p-12">
          <div class="flex items-center justify-center">
            <div class="animate-spin rounded-full h-8 w-8 border-b-2 border-emerald-600"></div>
            <span class="ml-3 text-gray-600">Chargement des analytics de conversion...</span>
          </div>
        </div>

        <!-- Conversions Table -->
        <div v-else-if="hasConversions" class="overflow-x-auto">
          <table class="min-w-full divide-y divide-gray-200">
            <thead class="bg-gray-50">
              <tr>
                <th class="table-header">Attribution</th>
                <th class="table-header">Client</th>
                <th class="table-header">Produits IA</th>
                <th class="table-header">Conversation</th>
                <th class="table-header">CA IA</th>
                <th class="table-header">Upsells</th>
                <th class="table-header">ROI</th>
                <th class="table-header">Date</th>
                <th class="table-header text-right">Actions</th>
              </tr>
            </thead>
            <tbody class="bg-white divide-y divide-gray-200">
              <tr 
                v-for="conversion in filteredConversions" 
                :key="conversion.id"
                class="hover:bg-gray-50 transition-colors"
              >
                <!-- Attribution Method -->
                <td class="table-cell">
                  <span :class="getAttributionBadgeClass(conversion.attribution_method)" class="attribution-badge">
                    {{ getAttributionLabel(conversion.attribution_method) }}
                  </span>
                  <div v-if="conversion.confidence_score" class="mt-1">
                    <div class="flex items-center">
                      <div class="w-12 bg-gray-200 rounded-full h-1.5">
                        <div 
                          class="bg-green-500 h-1.5 rounded-full" 
                          :style="`width: ${conversion.confidence_score}%`"
                        ></div>
                      </div>
                      <span class="ml-2 text-xs text-gray-500">{{ conversion.confidence_score }}%</span>
                    </div>
                  </div>
                </td>
                
                <!-- Customer Info -->
                <td class="table-cell">
                  <div>
                    <div class="text-sm font-medium text-gray-900">
                      {{ conversion.customer_name || 'Cliente anonyme' }}
                    </div>
                    <div v-if="conversion.customer_profile" class="text-xs text-gray-500">
                      {{ getBeautyProfileSummary(conversion.customer_profile) }}
                    </div>
                    <div v-if="conversion.customer_segment" class="text-xs text-purple-600">
                      Segment: {{ conversion.customer_segment }}
                    </div>
                  </div>
                </td>
                
                <!-- AI Recommended Products -->
                <td class="table-cell">
                  <div class="text-sm text-gray-900">
                    {{ getAIProductCount(conversion) }} produit(s) IA
                  </div>
                  <div class="text-xs text-gray-500">
                    {{ getAIProductSummary(conversion) }}
                  </div>
                  <div v-if="hasPersonalizedRecs(conversion)" class="text-xs text-blue-600 mt-1">
                    ✨ Personnalisées
                  </div>
                </td>
                
                <!-- Conversation Journey -->
                <td class="table-cell">
                  <div class="text-sm text-gray-900">
                    {{ conversion.conversation_duration || '5min' }}
                  </div>
                  <div class="text-xs text-gray-500">
                    {{ conversion.messages_count || 8 }} messages
                  </div>
                  <div v-if="conversion.satisfaction_score" class="text-xs text-green-600">
                    Satisfaction: {{ conversion.satisfaction_score }}/5
                  </div>
                </td>
                
                <!-- AI Revenue -->
                <td class="table-cell">
                  <div class="text-sm font-medium text-gray-900">
                    {{ formatCurrency(conversion.ai_attributed_revenue) }}
                  </div>
                  <div v-if="conversion.organic_revenue" class="text-xs text-gray-500">
                    + {{ formatCurrency(conversion.organic_revenue) }} organique
                  </div>
                </td>
                
                <!-- Upsells -->
                <td class="table-cell">
                  <div v-if="conversion.upsell_revenue > 0" class="text-sm font-medium text-emerald-600">
                    + {{ formatCurrency(conversion.upsell_revenue) }}
                  </div>
                  <div v-else class="text-sm text-gray-400">-</div>
                  <div v-if="conversion.upsell_products" class="text-xs text-gray-500">
                    {{ conversion.upsell_products.length }} produit(s)
                  </div>
                </td>
                
                <!-- Individual ROI -->
                <td class="table-cell">
                  <div class="text-sm font-medium" :class="getROIClass(conversion.roi)">
                    {{ conversion.roi }}x
                  </div>
                  <div class="text-xs text-gray-500">
                    vs coût: {{ formatCurrency(conversion.attributed_cost) }}
                  </div>
                </td>
                
                <!-- Date -->
                <td class="table-cell">
                  <div class="text-sm text-gray-900">
                    {{ formatDate(conversion.created_at) }}
                  </div>
                  <div class="text-xs text-gray-500">
                    {{ formatTime(conversion.created_at) }}
                  </div>
                </td>
                
                <!-- Actions -->
                <td class="table-cell text-right">
                  <div class="flex items-center justify-end space-x-2">
                    <button
                      @click="viewConversationJourney(conversion)"
                      class="action-button-primary"
                      title="Voir parcours"
                    >
                      Parcours
                    </button>
                    <button
                      @click="analyzeConversion(conversion)"
                      class="action-button-secondary"
                      title="Analyser"
                    >
                      📊
                    </button>
                  </div>
                </td>
              </tr>
            </tbody>
          </table>
        </div>

        <!-- Empty State -->
        <div v-else class="text-center py-12">
          <div class="w-20 h-20 bg-gradient-to-br from-emerald-100 to-teal-100 rounded-full flex items-center justify-center mx-auto mb-6">
            <svg class="w-10 h-10 text-emerald-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z"/>
            </svg>
          </div>
          <h3 class="text-xl font-semibold text-gray-900 mb-2">
            {{ hasActiveFilters ? 'Aucune conversion trouvée' : 'Prêt à mesurer vos conversions IA ?' }}
          </h3>
          <p class="text-gray-500 mb-6">
            {{ hasActiveFilters
              ? 'Aucune conversion ne correspond à vos critères'
              : 'Les conversions générées par votre Conseillère IA apparaîtront ici avec tracking ROI complet'
            }}
          </p>
          <div class="space-x-4">
            <button
              v-if="!hasActiveFilters"
              @click="configureAttribution"
              class="inline-flex items-center px-6 py-3 bg-gradient-to-r from-emerald-600 to-teal-600 text-white font-semibold rounded-xl hover:from-emerald-700 hover:to-teal-700 transition-all"
            >
              <svg class="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M10.325 4.317c.426-1.756 2.924-1.756 3.35 0a1.724 1.724 0 002.573 1.066c1.543-.94 3.31.826 2.37 2.37a1.724 1.724 0 001.065 2.572c1.756.426 1.756 2.924 0 3.35a1.724 1.724 0 00-1.066 2.573c.94 1.543-.826 3.31-2.37 2.37a1.724 1.724 0 00-2.572 1.065c-.426 1.756-2.924 1.756-3.35 0a1.724 1.724 0 00-2.573-1.066c-1.543.94-3.31-.826-2.37-2.37a1.724 1.724 0 00-1.065-2.572c-1.756-.426-1.756-2.924 0-3.35a1.724 1.724 0 001.066-2.573c-.94-1.543.826-3.31 2.37-2.37.996.608 2.296.07 2.572-1.065z"/>
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M15 12a3 3 0 11-6 0 3 3 0 016 0z"/>
              </svg>
              Configurer le tracking
            </button>
            <button
              v-else
              @click="clearFilters"
              class="inline-flex items-center px-4 py-2 border border-gray-300 text-gray-700 bg-white hover:bg-gray-50 rounded-lg transition-colors"
            >
              Effacer les filtres
            </button>
          </div>
        </div>
      </div>
    </div>

    <!-- Modals -->
    <ROICalculatorModal v-if="showROICalculator" @close="showROICalculator = false" :data="analyticsData" />
    <ClientInsightsModal v-if="showClientInsights" @close="showClientInsights = false" :insights="beautyInsights" />
    <ConversationJourneyModal v-if="showJourneyModal" :conversion="selectedConversion" @close="showJourneyModal = false" />
    <AttributionConfigModal v-if="showAttributionConfig" @close="showAttributionConfig = false" @save="saveAttributionConfig" />

    <!-- Notification -->
    <NotificationToast
      :show="showNotification"
      :message="notificationMessage"
      :type="notificationType"
      @close="showNotification = false"
    />
  </div>
</template>

<script setup lang="ts">
import { ref, computed, onMounted } from 'vue'
import { useAuthStore } from '~/stores/auth'

definePageMeta({
  middleware: 'auth',
  layout: 'default'
})

// COMPOSABLES
const authStore = useAuthStore()
const api = useApi()

// REACTIVE STATE
const loading = ref(true)
const exporting = ref(false)
const showROICalculator = ref(false)
const showClientInsights = ref(false)
const showJourneyModal = ref(false)
const showAttributionConfig = ref(false)
const showNotification = ref(false)
const notificationMessage = ref('')
const notificationType = ref<'success' | 'error'>('success')

const selectedConversion = ref(null)

// Data
const conversions = ref([])
const analyticsData = ref({
  aiConversions: 47,
  organicConversions: 23,
  aiConversionRate: 8.3,
  aiRevenue: 4750,
  organicRevenue: 2100,
  avgOrderValueAI: 101,
  avgOrderValueOrganic: 91,
  monthlyCost: 149,
  upsellConversions: 18,
  upsellRevenue: 890
})

const topAIProducts = ref([])
const beautyInsights = ref({
  dominantAge: '25-35',
  agePercentage: 42,
  topSkinType: 'Mixte',
  skinTypePercentage: 35,
  avgBudget: 85,
  loyaltyRate: 67
})

const attributionMethods = ref({
  utm: true,
  cookie: true,
  session: true,
  referral: false
})

const conversionFunnel = ref({
  visitors: 1247,
  conversations: 312,
  recommendations: 189,
  conversions: 47
})

const optimizationSuggestions = ref([
  {
    id: 1,
    priority: 'high',
    title: 'Améliorer qualification type de peau',
    description: 'Conversion +15% en ajoutant diagnostic peau automatique',
    expectedGain: '+€720/mois'
  },
  {
    id: 2,
    priority: 'medium',
    title: 'Optimiser timing upsells',
    description: 'Proposer produits complémentaires après première recommandation',
    expectedGain: '+€340/mois'
  },
  {
    id: 3,
    priority: 'medium',
    title: 'Personnaliser selon âge',
    description: 'Adapter recommandations selon tranche d\'âge',
    expectedGain: '+€210/mois'
  }
])

// Filters
const filters = ref({
  timeRange: 'month',
  attributionMethod: ''
})

// COMPUTED
const hasConversions = computed(() => conversions.value.length > 0)
const hasActiveFilters = computed(() => Object.values(filters.value).some(f => f !== '' && f !== 'month'))

const filteredConversions = computed(() => {
  let filtered = conversions.value

  if (filters.value.attributionMethod) {
    filtered = filtered.filter(c => c.attribution_method === filters.value.attributionMethod)
  }

  // Time range filtering would be implemented here
  
  return filtered.sort((a, b) => new Date(b.created_at).getTime() - new Date(a.created_at).getTime())
})

// BEAUTY-SPECIFIC METHODS
const getAgentTypeName = () => {
  const user = authStore.user
  const beautyCategory = user?.shop?.beauty_category || 'multi'
  
  const types = {
    'skincare': 'Esthéticienne IA',
    'makeup': 'Experte Makeup IA',
    'fragrance': 'Conseillère Parfums IA',
    'haircare': 'Experte Capillaire IA',
    'bodycare': 'Experte Soins Corps IA',
    'multi': 'Conseillère Beauté IA'
  }
  
  return types[beautyCategory] || types.multi
}

// CALCULATION METHODS
const calculateUplift = () => {
  const organic = analyticsData.value.organicConversions
  const ai = analyticsData.value.aiConversions
  return organic > 0 ? Math.round(((ai - organic) / organic) * 100) : 0
}

const calculateROI = () => {
  const revenue = analyticsData.value.aiRevenue
  const cost = analyticsData.value.monthlyCost
  return cost > 0 ? (revenue / cost).toFixed(1) : '0.0'
}

const calculateNetProfit = () => {
  return analyticsData.value.aiRevenue - analyticsData.value.monthlyCost
}

const calculateUpsellRate = () => {
  const total = analyticsData.value.aiConversions
  const upsells = analyticsData.value.upsellConversions
  return total > 0 ? Math.round((upsells / total) * 100) : 0
}

const getRevenueGrowthPercent = () => {
  const ai = analyticsData.value.aiRevenue
  const organic = analyticsData.value.organicRevenue
  return organic > 0 ? Math.round(((ai - organic) / organic) * 100) : 0
}

const getTopProductsRevenue = () => {
  const total = topAIProducts.value.reduce((sum, p) => sum + p.aiRevenue, 0)
  return formatCurrency(total)
}

// UTILITY METHODS
const formatCurrency = (amount) => {
  return new Intl.NumberFormat('fr-FR', {
    style: 'currency',
    currency: 'EUR'
  }).format(amount)
}

const formatDate = (date) => {
  return new Date(date).toLocaleDateString('fr-FR', {
    year: 'numeric',
    month: 'short',
    day: 'numeric'
  })
}

const formatTime = (date) => {
  return new Date(date).toLocaleTimeString('fr-FR', {
    hour: '2-digit',
    minute: '2-digit'
  })
}

const getAttributionLabel = (method) => {
  const labels = {
    utm: 'UTM',
    cookie: 'Cookie',
    session: 'Session',
    referral: 'Parrainage'
  }
  return labels[method] || method
}

const getAttributionBadgeClass = (method) => {
  const classes = {
    utm: 'bg-blue-100 text-blue-700',
    cookie: 'bg-green-100 text-green-700',
    session: 'bg-purple-100 text-purple-700',
    referral: 'bg-orange-100 text-orange-700'
  }
  return classes[method] || 'bg-gray-100 text-gray-700'
}

const getBeautyProfileSummary = (profile) => {
  if (!profile) return ''
  const parts = []
  if (profile.skin_type) parts.push(`Peau ${profile.skin_type}`)
  if (profile.age_range) parts.push(profile.age_range)
  return parts.join(', ')
}

const getAIProductCount = (conversion) => {
  return conversion.ai_products?.length || 0
}

const getAIProductSummary = (conversion) => {
  if (!conversion.ai_products || conversion.ai_products.length === 0) return 'Aucun'
  const first = conversion.ai_products[0]
  if (conversion.ai_products.length === 1) return first.name
  return `${first.name} et ${conversion.ai_products.length - 1} autre(s)`
}

const hasPersonalizedRecs = (conversion) => {
  return conversion.personalized_recommendations || false
}

const getProductCategoryLabel = (category) => {
  const labels = {
    'skincare': 'Soin visage',
    'makeup': 'Maquillage',
    'fragrance': 'Parfum',
    'haircare': 'Cheveux',
    'bodycare': 'Corps'
  }
  return labels[category] || 'Beauté'
}

const getROIClass = (roi) => {
  if (roi >= 3) return 'text-green-600'
  if (roi >= 2) return 'text-yellow-600'
  return 'text-red-600'
}

// ACTION METHODS
const refreshAnalytics = async () => {
  loading.value = true
  try {
    // Charger les conversions depuis l'API
    const response = await api.analytics.getConversions(filters.value)
    if (response.success) {
      conversions.value = response.data || []
      await loadAnalyticsData()
    }
  } catch (error) {
    console.error('Erreur refresh analytics:', error)
  } finally {
    loading.value = false
  }
}

const loadAnalyticsData = async () => {
  try {
    // Charger les données analytics
    const [topProducts, insights] = await Promise.allSettled([
      api.analytics.getTopProducts(),
      api.analytics.getBeautyInsights()
    ])

    if (topProducts.status === 'fulfilled') {
      topAIProducts.value = topProducts.value.data || []
    }

    if (insights.status === 'fulfilled') {
      beautyInsights.value = { ...beautyInsights.value, ...insights.value.data }
    }

  } catch (error) {
    console.error('Erreur load analytics data:', error)
  }
}

const handleConversionExport = async () => {
  exporting.value = true
  
  try {
    const headers = [
      'Date', 'Attribution', 'Confiance (%)', 'Client', 'Profil beauté', 
      'Produits IA', 'CA IA', 'Upsells', 'ROI', 'Durée conversation', 'Satisfaction'
    ]
    
    const csvData = filteredConversions.value.map(c => [
      formatDate(c.created_at),
      getAttributionLabel(c.attribution_method),
      c.confidence_score || '',
      c.customer_name || 'Anonyme',
      getBeautyProfileSummary(c.customer_profile),
      getAIProductSummary(c),
      c.ai_attributed_revenue,
      c.upsell_revenue || 0,
      c.roi,
      c.conversation_duration || '',
      c.satisfaction_score || ''
    ])
    
    const csvContent = [
      headers.join(','),
      ...csvData.map(row => row.map(cell => `"${cell}"`).join(','))
    ].join('\n')
    
    const blob = new Blob([csvContent], { type: 'text/csv' })
    const url = window.URL.createObjectURL(blob)
    const a = document.createElement('a')
    a.href = url
    a.download = `analytics-conversion-${new Date().toISOString().split('T')[0]}.csv`
    document.body.appendChild(a)
    a.click()
    document.body.removeChild(a)
    window.URL.revokeObjectURL(url)
    
    showNotification.value = true
    notificationMessage.value = 'Analytics exportées avec succès !'
    notificationType.value = 'success'
    
  } catch (error) {
    console.error('Erreur export:', error)
    showNotification.value = true
    notificationMessage.value = 'Erreur lors de l\'export'
    notificationType.value = 'error'
  } finally {
    exporting.value = false
  }
}

const viewConversationJourney = (conversion) => {
  selectedConversion.value = conversion
  showJourneyModal.value = true
}

const analyzeConversion = async (conversion) => {
  try {
    const response = await api.analytics.analyzeConversion(conversion.id)
    
    if (response.success) {
      // Afficher les insights d'analyse
      console.log('Analyse conversion:', response.data)
    }
    
  } catch (error) {
    console.error('Erreur analyse conversion:', error)
  }
}

const configureAttribution = () => {
  showAttributionConfig.value = true
}

const saveAttributionConfig = async (config) => {
  try {
    const response = await api.settings.updateAttribution(config)
    
    if (response.success) {
      attributionMethods.value = config
      showNotification.value = true
      notificationMessage.value = 'Configuration attribution mise à jour !'
      notificationType.value = 'success'
    }
    
  } catch (error) {
    console.error('Erreur save attribution:', error)
    showNotification.value = true
    notificationMessage.value = 'Erreur lors de la sauvegarde'
    notificationType.value = 'error'
  } finally {
    showAttributionConfig.value = false
  }
}

const applyFilters = () => {
  // Les filtres sont appliqués automatiquement via le computed filteredConversions
}

const clearFilters = () => {
  filters.value = {
    timeRange: 'month',
    attributionMethod: ''
  }
}

// LIFECYCLE
onMounted(async () => {
  await refreshAnalytics()
})

// SEO
useHead({
  title: 'Analytics de Conversion - ChatSeller Dashboard',
  meta: [
    { name: 'description', content: 'Mesurez le ROI de votre Conseillère IA avec analytics avancées et tracking de conversion' }
  ]
})
</script>

<style scoped>
.card-modern {
  @apply bg-white rounded-xl shadow-sm border border-gray-200 p-6;
}

.card-roi-gradient {
  @apply bg-gradient-to-br rounded-xl shadow-lg p-6 text-white;
}

.input-modern {
  @apply px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500 transition-colors text-sm;
}

.table-header {
  @apply px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider;
}

.table-cell {
  @apply px-6 py-4 whitespace-nowrap;
}

.attribution-badge {
  @apply inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium;
}

.action-button-primary {
  @apply text-emerald-600 hover:text-emerald-900 text-sm font-medium transition-colors;
}

.action-button-secondary {
  @apply text-gray-600 hover:text-gray-900 text-sm transition-colors;
}

@keyframes spin {
  from { transform: rotate(0deg); }
  to { transform: rotate(360deg); }
}

.animate-spin {
  animation: spin 1s linear infinite;
}
</style>