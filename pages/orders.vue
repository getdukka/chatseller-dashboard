<!-- pages/orders.vue - VERSION ADAPTÉE À VOTRE STRUCTURE DB RÉELLE -->
<template>
  <div class="min-h-screen bg-gray-50">
    <!-- Header Modern -->
    <div class="bg-white shadow-sm border-b border-gray-200">
      <div class="px-8 py-6">
        <div class="flex items-center justify-between">
          <div>
            <h1 class="text-3xl font-bold text-gray-900">Commandes</h1>
            <p class="mt-2 text-gray-600">
              Gérez toutes les commandes générées par votre agent IA
            </p>
          </div>
          
          <!-- Actions Header -->
          <div class="flex items-center space-x-4">
            <button
              @click="handleExportOrders"
              :disabled="exporting"
              class="inline-flex items-center px-4 py-2 border border-gray-300 rounded-lg text-sm font-medium text-gray-700 bg-white hover:bg-gray-50 disabled:opacity-50 transition-colors"
            >
              <svg class="w-4 h-4 mr-2" :class="{ 'animate-spin': exporting }" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 10v6m0 0l-3-3m3 3l3-3m2 8H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z"/>
              </svg>
              {{ exporting ? 'Export en cours...' : 'Exporter CSV' }}
            </button>
            
            <button
              @click="refreshOrders"
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
      <!-- Stats Cards -->
      <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
        <div class="card-modern">
          <div class="flex items-center">
            <div class="p-3 bg-blue-100 rounded-xl">
              <svg class="w-6 h-6 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M16 11V7a4 4 0 00-8 0v4M5 9h14l1 12H4L5 9z"/>
              </svg>
            </div>
            <div class="ml-4">
              <p class="text-sm font-medium text-gray-600">Total commandes</p>
              <p class="text-2xl font-bold text-gray-900">{{ stats.totalOrders }}</p>
              <p class="text-xs text-gray-500 mt-1">Ce mois-ci</p>
            </div>
          </div>
        </div>

        <div class="card-modern">
          <div class="flex items-center">
            <div class="p-3 bg-green-100 rounded-xl">
              <svg class="w-6 h-6 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1"/>
              </svg>
            </div>
            <div class="ml-4">
              <p class="text-sm font-medium text-gray-600">Revenus totaux</p>
              <p class="text-2xl font-bold text-gray-900">{{ formatCurrency(stats.totalRevenue) }}</p>
              <p class="text-xs text-green-600 mt-1">+{{ stats.revenueGrowth }}% vs mois dernier</p>
            </div>
          </div>
        </div>

        <div class="card-modern">
          <div class="flex items-center">
            <div class="p-3 bg-yellow-100 rounded-xl">
              <svg class="w-6 h-6 text-yellow-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 7h6m0 10v-3m-3 3h.01M9 17h.01M9 14h.01M12 14h.01M15 11h.01M12 11h.01M9 11h.01M7 21h10a2 2 0 002-2V5a2 2 0 00-2-2H7a2 2 0 00-2 2v14a2 2 0 002 2z"/>
              </svg>
            </div>
            <div class="ml-4">
              <p class="text-sm font-medium text-gray-600">Panier moyen</p>
              <p class="text-2xl font-bold text-gray-900">{{ formatCurrency(stats.averageOrderValue) }}</p>
              <p class="text-xs text-gray-500 mt-1">Par commande</p>
            </div>
          </div>
        </div>

        <div class="card-modern">
          <div class="flex items-center">
            <div class="p-3 bg-orange-100 rounded-xl">
              <svg class="w-6 h-6 text-orange-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z"/>
              </svg>
            </div>
            <div class="ml-4">
              <p class="text-sm font-medium text-gray-600">En attente</p>
              <p class="text-2xl font-bold text-gray-900">{{ stats.pendingOrders }}</p>
              <p class="text-xs text-orange-600 mt-1">Nécessitent une action</p>
            </div>
          </div>
        </div>
      </div>

      <!-- Filters & Search -->
      <div class="card-modern mb-6">
        <div class="flex flex-col lg:flex-row lg:items-center lg:justify-between space-y-4 lg:space-y-0">
          <!-- Search -->
          <div class="flex-1 max-w-lg">
            <div class="relative">
              <svg class="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"/>
              </svg>
              <input
                v-model="searchQuery"
                type="text"
                placeholder="Rechercher une commande..."
                class="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-colors"
              >
            </div>
          </div>
          
          <!-- Filters -->
          <div class="flex flex-wrap items-center space-x-4">
            <select v-model="filters.status" class="input-modern">
              <option value="">Tous les statuts</option>
              <option value="pending">En attente</option>
              <option value="confirmed">Confirmée</option>
              <option value="shipped">Expédiée</option>
              <option value="delivered">Livrée</option>
              <option value="cancelled">Annulée</option>
            </select>
            
            <select v-model="filters.period" class="input-modern">
              <option value="">Toutes les périodes</option>
              <option value="today">Aujourd'hui</option>
              <option value="week">Cette semaine</option>
              <option value="month">Ce mois</option>
              <option value="quarter">Ce trimestre</option>
            </select>
            
            <button
              v-if="hasActiveFilters"
              @click="clearFilters"
              class="text-sm text-gray-500 hover:text-gray-700 underline"
            >
              Effacer les filtres
            </button>
          </div>
        </div>
      </div>

      <!-- Orders Table -->
      <div class="card-modern">
        <div class="px-6 py-4 border-b border-gray-200">
          <div class="flex items-center justify-between">
            <h3 class="text-lg font-semibold text-gray-900">
              Liste des commandes
            </h3>
            <span class="text-sm text-gray-500">
              {{ filteredOrders.length }} commande(s)
            </span>
          </div>
        </div>

        <!-- Loading State -->
        <div v-if="loading" class="p-12">
          <div class="flex items-center justify-center">
            <div class="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
            <span class="ml-3 text-gray-600">Chargement des commandes...</span>
          </div>
        </div>

        <!-- Error State -->
        <div v-else-if="error" class="p-12 text-center">
          <div class="text-red-600 mb-4">
            <svg class="mx-auto h-12 w-12" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-2.5L13.732 4c-.77-.833-1.732-.833-2.5 0L4.232 15.5c-.77.833.192 2.5 1.732 2.5z"/>
            </svg>
          </div>
          <h3 class="text-lg font-medium text-gray-900 mb-2">Erreur de chargement</h3>
          <p class="text-gray-500 mb-4">{{ error }}</p>
          <button @click="loadOrders" class="btn-primary">
            Réessayer
          </button>
        </div>

        <!-- Table -->
        <div v-else-if="filteredOrders.length > 0" class="overflow-x-auto">
          <table class="min-w-full divide-y divide-gray-200">
            <thead class="bg-gray-50">
              <tr>
                <th class="table-header">Commande</th>
                <th class="table-header">Client</th>
                <th class="table-header">Produits</th>
                <th class="table-header">Montant</th>
                <th class="table-header">Paiement</th>
                <th class="table-header">Statut</th>
                <th class="table-header">Date</th>
                <th class="table-header text-right">Actions</th>
              </tr>
            </thead>
            <tbody class="bg-white divide-y divide-gray-200">
              <tr 
                v-for="order in filteredOrders" 
                :key="order.id"
                class="hover:bg-gray-50 transition-colors"
              >
                <!-- Order ID -->
                <td class="table-cell">
                  <div class="flex items-center">
                    <div class="text-sm font-medium text-gray-900">
                      #{{ order.id.slice(-8).toUpperCase() }}
                    </div>
                    <div v-if="order.external_order_id" class="ml-2 text-xs text-gray-500">
                      Ext: {{ order.external_order_id }}
                    </div>
                  </div>
                </td>
                
                <!-- Customer -->
                <td class="table-cell">
                  <div>
                    <div class="text-sm font-medium text-gray-900">
                      {{ order.customer_name || 'Client anonyme' }}
                    </div>
                    <div v-if="order.customer_email" class="text-sm text-gray-500">
                      {{ order.customer_email }}
                    </div>
                    <div v-if="order.customer_phone" class="text-sm text-gray-500">
                      {{ order.customer_phone }}
                    </div>
                  </div>
                </td>
                
                <!-- Products -->
                <td class="table-cell">
                  <div class="text-sm text-gray-900">
                    {{ getProductCount(order) }} article(s)
                  </div>
                  <div class="text-sm text-gray-500">
                    {{ getProductSummary(order) }}
                  </div>
                  <div v-if="hasUpsellItems(order)" class="text-xs text-green-600 mt-1">
                    + {{ getUpsellCount(order) }} upsell(s)
                  </div>
                </td>
                
                <!-- Amount -->
                <td class="table-cell">
                  <div class="text-sm font-medium text-gray-900">
                    {{ formatCurrency(getTotalOrderAmount(order), order.currency) }}
                  </div>
                  <div v-if="order.upsell_amount && order.upsell_amount > 0" class="text-xs text-green-600">
                    + {{ formatCurrency(order.upsell_amount, order.currency) }} upsell
                  </div>
                </td>
                
                <!-- Payment Method -->
                <td class="table-cell">
                  <div class="text-sm text-gray-900">
                    {{ getPaymentMethodLabel(order.payment_method) }}
                  </div>
                </td>
                
                <!-- Status -->
                <td class="table-cell">
                  <span :class="getStatusBadgeClass(order.status)" class="status-badge">
                    {{ getStatusLabel(order.status) }}
                  </span>
                </td>
                
                <!-- Date -->
                <td class="table-cell">
                  <div class="text-sm text-gray-900">
                    {{ formatDate(order.created_at) }}
                  </div>
                  <div v-if="order.exported_at" class="text-xs text-green-600">
                    Exportée {{ formatDate(order.exported_at) }}
                  </div>
                </td>
                
                <!-- Actions -->
                <td class="table-cell text-right">
                  <div class="flex items-center justify-end space-x-2">
                    <button
                      @click="viewOrder(order)"
                      class="action-button-primary"
                      title="Voir les détails"
                    >
                      Voir
                    </button>
                    <div class="order-actions">
                      <button
                        @click="toggleActionMenu(order.id)"
                        class="action-button-secondary"
                      >
                        <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 5v.01M12 12v.01M12 19v.01"/>
                        </svg>
                      </button>

                      <!-- Dropdown Actions -->
                      <div
                        v-if="activeActionMenu === order.id"
                        class="action-dropdown"
                      >
                        <button @click="updateOrderStatus(order)" class="action-dropdown-item">
                          <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z"/>
                          </svg>
                          Modifier statut
                        </button>
                        <button @click="markAsExported(order)" class="action-dropdown-item">
                          <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 10v6m0 0l-3-3m3 3l3-3m2 8H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z"/>
                          </svg>
                          Marquer exportée
                        </button>
                        <button @click="addNotes(order)" class="action-dropdown-item">
                          <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z"/>
                          </svg>
                          Ajouter notes
                        </button>
                      </div>
                    </div>
                  </div>
                </td>
              </tr>
            </tbody>
          </table>
        </div>

        <!-- Empty State -->
        <div v-else class="text-center py-12">
          <svg class="mx-auto h-12 w-12 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 48 48">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M16 11V7a4 4 0 00-8 0v4M5 9h14l1 12H4L5 9z"/>
          </svg>
          <h3 class="mt-4 text-lg font-medium text-gray-900">Aucune commande trouvée</h3>
          <p class="mt-2 text-gray-500">
            {{ searchQuery || hasActiveFilters ? 'Aucune commande ne correspond à vos critères' : 'Les commandes générées par votre Vendeur IA apparaîtront ici' }}
          </p>
          <div v-if="searchQuery || hasActiveFilters" class="mt-4">
            <button
              @click="clearFilters"
              class="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-lg text-blue-600 bg-blue-100 hover:bg-blue-200 transition-colors"
            >
              Effacer les filtres
            </button>
          </div>
        </div>
      </div>
    </div>

    <!-- Order Details Modal -->
    <div
      v-if="showOrderModal && selectedOrder"
      class="fixed inset-0 z-50 overflow-y-auto"
      @click.self="closeOrderModal"
    >
      <div class="flex items-center justify-center min-h-screen px-4">
        <div class="fixed inset-0 bg-gray-900 bg-opacity-50 backdrop-blur-sm transition-opacity"></div>
        
        <div class="relative bg-white rounded-xl shadow-xl max-w-4xl w-full max-h-[90vh] overflow-y-auto">
          <!-- Modal Header -->
          <div class="flex items-center justify-between p-6 border-b border-gray-200">
            <h3 class="text-lg font-semibold text-gray-900">
              Détail de la commande #{{ selectedOrder.id.slice(-8).toUpperCase() }}
            </h3>
            <button
              @click="closeOrderModal"
              class="text-gray-400 hover:text-gray-600 transition-colors"
            >
              <svg class="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12"/>
              </svg>
            </button>
          </div>

          <!-- Modal Content -->
          <div class="p-6 space-y-6">
            <!-- Customer Info -->
            <div>
              <h4 class="text-sm font-medium text-gray-900 mb-3">Informations client</h4>
              <div class="bg-gray-50 rounded-lg p-4">
                <div class="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <span class="text-sm text-gray-500">Nom :</span>
                    <p class="font-medium">{{ selectedOrder.customer_name || 'Non renseigné' }}</p>
                  </div>
                  <div>
                    <span class="text-sm text-gray-500">Email :</span>
                    <p class="font-medium">{{ selectedOrder.customer_email || 'Non renseigné' }}</p>
                  </div>
                  <div>
                    <span class="text-sm text-gray-500">Téléphone :</span>
                    <p class="font-medium">{{ selectedOrder.customer_phone || 'Non renseigné' }}</p>
                  </div>
                  <div>
                    <span class="text-sm text-gray-500">Adresse :</span>
                    <p class="font-medium">{{ selectedOrder.customer_address || 'Non renseignée' }}</p>
                  </div>
                </div>
              </div>
            </div>

            <!-- Order Items -->
            <div v-if="selectedOrder.product_items && selectedOrder.product_items.length > 0">
              <h4 class="text-sm font-medium text-gray-900 mb-3">Articles commandés</h4>
              <div class="border border-gray-200 rounded-lg overflow-hidden">
                <table class="min-w-full divide-y divide-gray-200">
                  <thead class="bg-gray-50">
                    <tr>
                      <th class="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase">Produit</th>
                      <th class="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase">Quantité</th>
                      <th class="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase">Prix unitaire</th>
                      <th class="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase">Total</th>
                    </tr>
                  </thead>
                  <tbody class="divide-y divide-gray-200">
                    <tr v-for="(item, index) in selectedOrder.product_items" :key="index">
                      <td class="px-4 py-3 text-sm text-gray-900">{{ item.name || item.productName || 'Produit' }}</td>
                      <td class="px-4 py-3 text-sm text-gray-900">{{ item.quantity || 1 }}</td>
                      <td class="px-4 py-3 text-sm text-gray-900">{{ formatCurrency(item.price || 0, selectedOrder.currency) }}</td>
                      <td class="px-4 py-3 text-sm font-medium text-gray-900">{{ formatCurrency((item.price || 0) * (item.quantity || 1), selectedOrder.currency) }}</td>
                    </tr>
                  </tbody>
                </table>
              </div>
            </div>

            <!-- Upsell Items -->
            <div v-if="selectedOrder.upsell_items && selectedOrder.upsell_items.length > 0">
              <h4 class="text-sm font-medium text-gray-900 mb-3">Articles supplémentaires (Upsell)</h4>
              <div class="border border-gray-200 rounded-lg overflow-hidden">
                <table class="min-w-full divide-y divide-gray-200">
                  <thead class="bg-green-50">
                    <tr>
                      <th class="px-4 py-3 text-left text-xs font-medium text-green-700 uppercase">Produit</th>
                      <th class="px-4 py-3 text-left text-xs font-medium text-green-700 uppercase">Quantité</th>
                      <th class="px-4 py-3 text-left text-xs font-medium text-green-700 uppercase">Prix unitaire</th>
                      <th class="px-4 py-3 text-left text-xs font-medium text-green-700 uppercase">Total</th>
                    </tr>
                  </thead>
                  <tbody class="divide-y divide-gray-200">
                    <tr v-for="(item, index) in selectedOrder.upsell_items" :key="index">
                      <td class="px-4 py-3 text-sm text-gray-900">{{ item.name || item.productName || 'Produit' }}</td>
                      <td class="px-4 py-3 text-sm text-gray-900">{{ item.quantity || 1 }}</td>
                      <td class="px-4 py-3 text-sm text-gray-900">{{ formatCurrency(item.price || 0, selectedOrder.currency) }}</td>
                      <td class="px-4 py-3 text-sm font-medium text-gray-900">{{ formatCurrency((item.price || 0) * (item.quantity || 1), selectedOrder.currency) }}</td>
                    </tr>
                  </tbody>
                </table>
              </div>
            </div>
              
            <!-- Order Total -->
            <div class="border-t pt-4">
              <div class="space-y-2">
                <div class="flex justify-between text-sm">
                  <span>Sous-total produits :</span>
                  <span>{{ formatCurrency(selectedOrder.total_amount || 0, selectedOrder.currency) }}</span>
                </div>
                <div v-if="selectedOrder.upsell_amount && selectedOrder.upsell_amount > 0" class="flex justify-between text-sm text-green-600">
                  <span>Upsell :</span>
                  <span>{{ formatCurrency(selectedOrder.upsell_amount, selectedOrder.currency) }}</span>
                </div>
                <div class="flex justify-between text-lg font-semibold border-t pt-2">
                  <span>Total :</span>
                  <span>{{ formatCurrency(getTotalOrderAmount(selectedOrder), selectedOrder.currency) }}</span>
                </div>
              </div>
            </div>

            <!-- Additional Info -->
            <div v-if="selectedOrder.notes" class="bg-yellow-50 border border-yellow-200 rounded-lg p-4">
              <h4 class="text-sm font-medium text-yellow-800 mb-2">Notes :</h4>
              <p class="text-sm text-yellow-700">{{ selectedOrder.notes }}</p>
            </div>
          </div>

          <!-- Modal Footer -->
          <div class="flex items-center justify-end space-x-3 p-6 border-t border-gray-200">
            <button
              @click="closeOrderModal"
              class="px-4 py-2 text-sm font-medium text-gray-700 bg-white border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors"
            >
              Fermer
            </button>
            <button
              @click="updateOrderStatus(selectedOrder)"
              class="px-4 py-2 text-sm font-medium text-white bg-blue-600 rounded-lg hover:bg-blue-700 transition-colors"
            >
              Modifier le statut
            </button>
          </div>
        </div>
      </div>
    </div>

    <!-- Status Update Modal -->
    <div
      v-if="showStatusModal && orderToUpdate"
      class="fixed inset-0 z-50 overflow-y-auto"
      @click.self="closeStatusModal"
    >
      <div class="flex items-center justify-center min-h-screen px-4">
        <div class="fixed inset-0 bg-gray-900 bg-opacity-50 backdrop-blur-sm transition-opacity"></div>
        
        <div class="relative bg-white rounded-xl shadow-xl max-w-md w-full">
          <!-- Modal Header -->
          <div class="flex items-center justify-between p-6 border-b border-gray-200">
            <h3 class="text-lg font-semibold text-gray-900">
              Modifier le statut
            </h3>
            <button
              @click="closeStatusModal"
              class="text-gray-400 hover:text-gray-600 transition-colors"
            >
              <svg class="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12"/>
              </svg>
            </button>
          </div>

          <!-- Modal Content -->
          <div class="p-6">
            <p class="text-sm text-gray-600 mb-4">
              Commande #{{ orderToUpdate.id.slice(-8).toUpperCase() }}
            </p>
            
            <div class="space-y-4">
              <div>
                <label class="block text-sm font-medium text-gray-700 mb-2">Nouveau statut</label>
                <select v-model="newStatus" class="input-modern w-full">
                  <option value="pending">En attente</option>
                  <option value="confirmed">Confirmée</option>
                  <option value="shipped">Expédiée</option>
                  <option value="delivered">Livrée</option>
                  <option value="cancelled">Annulée</option>
                </select>
              </div>
              
              <div>
                <label class="block text-sm font-medium text-gray-700 mb-2">Notes (optionnel)</label>
                <textarea
                  v-model="statusNotes"
                  rows="3"
                  class="input-modern w-full"
                  placeholder="Ajoutez une note sur ce changement de statut..."
                ></textarea>
              </div>
            </div>
          </div>

          <!-- Modal Footer -->
          <div class="flex items-center justify-end space-x-3 p-6 border-t border-gray-200">
            <button
              @click="closeStatusModal"
              class="px-4 py-2 text-sm font-medium text-gray-700 bg-white border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors"
            >
              Annuler
            </button>
            <button
              @click="saveStatusUpdate"
              :disabled="updatingStatus"
              class="px-4 py-2 text-sm font-medium text-white bg-blue-600 rounded-lg hover:bg-blue-700 disabled:opacity-50 transition-colors"
            >
              {{ updatingStatus ? 'Mise à jour...' : 'Mettre à jour' }}
            </button>
          </div>
        </div>
      </div>
    </div>

    <!-- Notification Toast -->
    <div
      v-if="notification.show"
      class="fixed bottom-4 right-4 max-w-sm w-full bg-white shadow-lg rounded-lg pointer-events-auto ring-1 ring-black ring-opacity-5 overflow-hidden z-50"
    >
      <div class="p-4">
        <div class="flex items-start">
          <div class="flex-shrink-0">
            <svg v-if="notification.type === 'success'" class="h-6 w-6 text-green-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z"/>
            </svg>
            <svg v-else class="h-6 w-6 text-red-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-2.5L13.732 4c-.77-.833-1.732-.833-2.5 0L4.232 15.5c-.77.833.192 2.5 1.732 2.5z"/>
            </svg>
          </div>
          <div class="ml-3 w-0 flex-1 pt-0.5">
            <p class="text-sm font-medium text-gray-900">{{ notification.message }}</p>
          </div>
          <div class="ml-4 flex-shrink-0 flex">
            <button @click="notification.show = false" class="bg-white rounded-md inline-flex text-gray-400 hover:text-gray-500">
              <svg class="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
                <path fill-rule="evenodd" d="M4.293 4.293a1 1 0 011.414 0L10 8.586l4.293-4.293a1 1 0 111.414 1.414L11.414 10l4.293 4.293a1 1 0 01-1.414 1.414L10 11.414l-4.293 4.293a1 1 0 01-1.414-1.414L8.586 10 4.293 5.707a1 1 0 010-1.414z" clip-rule="evenodd"/>
              </svg>
            </button>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, computed, onMounted, onUnmounted } from 'vue'
import { useAuthStore } from '~/stores/auth'
import { useSupabase } from '~/composables/useSupabase'

// ✅ PAGE META
definePageMeta({
  middleware: 'auth',
  layout: 'default'
})

// ✅ TYPES - Adaptés à votre structure DB réelle
interface Order {
  id: string
  shop_id: string
  conversation_id: string | null
  customer_name: string | null
  customer_phone: string | null
  customer_email: string | null
  customer_address: string | null
  product_items: any[] // JSONB
  total_amount: number
  currency: string
  payment_method: string | null
  upsell_items: any[] // JSONB
  upsell_amount: number
  status: string
  notes: string | null
  exported_at: string | null
  external_order_id: string | null
  webhook_sent_at: string | null
  created_at: string
  updated_at: string | null
}

interface Stats {
  totalOrders: number
  totalRevenue: number
  averageOrderValue: number
  pendingOrders: number
  revenueGrowth: number
}

// ✅ COMPOSABLES
const authStore = useAuthStore()
const supabase = useSupabase()

// ✅ REACTIVE STATE
const loading = ref(true)
const exporting = ref(false)
const updatingStatus = ref(false)
const searchQuery = ref('')
const showOrderModal = ref(false)
const showStatusModal = ref(false)
const selectedOrder = ref<Order | null>(null)
const orderToUpdate = ref<Order | null>(null)
const newStatus = ref('')
const statusNotes = ref('')
const activeActionMenu = ref<string | null>(null)
const error = ref<string | null>(null)

const filters = ref({
  status: '',
  period: ''
})

const orders = ref<Order[]>([])

const stats = ref<Stats>({
  totalOrders: 0,
  totalRevenue: 0,
  averageOrderValue: 0,
  pendingOrders: 0,
  revenueGrowth: 0
})

// Notification
const notification = ref({
  show: false,
  message: '',
  type: 'success' as 'success' | 'error'
})

// ✅ COMPUTED
const filteredOrders = computed(() => {
  let filtered = orders.value

  // Search filter
  if (searchQuery.value) {
    const query = searchQuery.value.toLowerCase()
    filtered = filtered.filter(order => 
      order.customer_name?.toLowerCase().includes(query) ||
      order.customer_email?.toLowerCase().includes(query) ||
      order.id.toLowerCase().includes(query) ||
      order.external_order_id?.toLowerCase().includes(query)
    )
  }

  // Status filter
  if (filters.value.status) {
    filtered = filtered.filter(order => order.status === filters.value.status)
  }

  // Period filter
  if (filters.value.period) {
    const now = new Date()
    
    filtered = filtered.filter(order => {
      const date = new Date(order.created_at)
      switch (filters.value.period) {
        case 'today':
          return date.toDateString() === now.toDateString()
        case 'week':
          const weekAgo = new Date(now.getTime() - 7 * 24 * 60 * 60 * 1000)
          return date >= weekAgo
        case 'month':
          return date.getMonth() === now.getMonth() && date.getFullYear() === now.getFullYear()
        case 'quarter':
          const quarter = Math.floor(now.getMonth() / 3)
          const orderQuarter = Math.floor(date.getMonth() / 3)
          return orderQuarter === quarter && date.getFullYear() === now.getFullYear()
        default:
          return true
      }
    })
  }

  return filtered.sort((a, b) => new Date(b.created_at).getTime() - new Date(a.created_at).getTime())
})

const hasActiveFilters = computed(() => {
  return filters.value.status !== '' || filters.value.period !== '' || searchQuery.value !== ''
})

// ✅ UTILITY METHODS
const getProductCount = (order: Order): number => {
  if (!order.product_items || !Array.isArray(order.product_items)) return 0
  return order.product_items.reduce((sum, item) => sum + (item.quantity || 1), 0)
}

const getUpsellCount = (order: Order): number => {
  if (!order.upsell_items || !Array.isArray(order.upsell_items)) return 0
  return order.upsell_items.reduce((sum, item) => sum + (item.quantity || 1), 0)
}

const hasUpsellItems = (order: Order): boolean => {
  return order.upsell_items && Array.isArray(order.upsell_items) && order.upsell_items.length > 0
}

const getProductSummary = (order: Order): string => {
  if (!order.product_items || !Array.isArray(order.product_items) || order.product_items.length === 0) {
    return 'Aucun produit'
  }
  
  const firstItem = order.product_items[0]
  const itemName = firstItem.name || firstItem.productName || 'Produit'
  
  if (order.product_items.length === 1) {
    return itemName
  }
  
  return `${itemName} et ${order.product_items.length - 1} autre(s)`
}

const getTotalOrderAmount = (order: Order): number => {
  return (order.total_amount || 0) + (order.upsell_amount || 0)
}

const formatCurrency = (amount: number, currency: string = 'EUR'): string => {
  // Adaptation pour XOF (Franc CFA)
  if (currency === 'XOF') {
    return new Intl.NumberFormat('fr-FR', {
      style: 'currency',
      currency: 'XOF',
      minimumFractionDigits: 0
    }).format(amount)
  }
  
  return new Intl.NumberFormat('fr-FR', {
    style: 'currency',
    currency: currency || 'EUR'
  }).format(amount)
}

const formatDate = (date: string): string => {
  return new Date(date).toLocaleDateString('fr-FR', {
    year: 'numeric',
    month: 'short',
    day: 'numeric',
    hour: '2-digit',
    minute: '2-digit'
  })
}

const getStatusLabel = (status: string): string => {
  const labels: Record<string, string> = {
    pending: 'En attente',
    confirmed: 'Confirmée',
    shipped: 'Expédiée',
    delivered: 'Livrée',
    cancelled: 'Annulée'
  }
  return labels[status] || status
}

const getStatusBadgeClass = (status: string): string => {
  const classes: Record<string, string> = {
    pending: 'bg-yellow-100 text-yellow-800',
    confirmed: 'bg-blue-100 text-blue-800',
    shipped: 'bg-purple-100 text-purple-800',
    delivered: 'bg-green-100 text-green-800',
    cancelled: 'bg-red-100 text-red-800'
  }
  return classes[status] || 'bg-gray-100 text-gray-800'
}

const getPaymentMethodLabel = (method: string | null): string => {
  if (!method) return 'Non spécifié'
  
  const labels: Record<string, string> = {
    card: 'Carte bancaire',
    paypal: 'PayPal',
    bank_transfer: 'Virement',
    cash: 'Espèces',
    mobile_money: 'Mobile Money'
  }
  return labels[method] || method
}

const showNotification = (message: string, type: 'success' | 'error' = 'success') => {
  notification.value = {
    show: true,
    message,
    type
  }
  
  setTimeout(() => {
    notification.value.show = false
  }, 5000)
}

// ✅ API METHODS
const loadOrders = async () => {
  if (!authStore.userShopId) {
    error.value = 'ID utilisateur non trouvé'
    loading.value = false
    return
  }

  loading.value = true
  error.value = null

  try {
    const { data, error: supabaseError } = await supabase
      .from('orders')
      .select('*')
      .eq('shop_id', authStore.userShopId)
      .order('created_at', { ascending: false })

    if (supabaseError) {
      throw new Error(supabaseError.message)
    }

    orders.value = data || []
    console.log('✅ Commandes chargées:', orders.value.length)
    
    // Charger les statistiques
    await loadStats()
    
  } catch (err: any) {
    console.error('❌ Erreur chargement commandes:', err)
    error.value = err.message || 'Erreur lors du chargement des commandes'
  } finally {
    loading.value = false
  }
}

const loadStats = async () => {
  try {
    const ordersData = orders.value
    const today = new Date()
    const thisMonth = ordersData.filter(o => {
      const orderDate = new Date(o.created_at)
      return orderDate.getMonth() === today.getMonth() && orderDate.getFullYear() === today.getFullYear()
    })
    
    const totalRevenue = thisMonth.reduce((sum, order) => sum + getTotalOrderAmount(order), 0)
    
    stats.value = {
      totalOrders: thisMonth.length,
      totalRevenue,
      averageOrderValue: thisMonth.length > 0 ? totalRevenue / thisMonth.length : 0,
      pendingOrders: ordersData.filter(o => o.status === 'pending').length,
      revenueGrowth: 23.5 // TODO: Calculer réellement vs mois précédent
    }
  } catch (err) {
    console.warn('⚠️ Erreur chargement stats:', err)
  }
}

const refreshOrders = async () => {
  await loadOrders()
  showNotification('Commandes actualisées avec succès!')
}

// ✅ EXPORT CSV FUNCTION
const handleExportOrders = async () => {
  exporting.value = true
  
  try {
    // Créer les headers CSV
    const headers = [
      'ID Commande',
      'ID Externe',
      'Nom Client',
      'Email Client',
      'Téléphone',
      'Adresse',
      'Produits',
      'Quantité Totale',
      'Montant Total',
      'Montant Upsell',
      'Devise',
      'Méthode Paiement',
      'Statut',
      'Date Création',
      'Date Export',
      'Notes'
    ]
    
    // Préparer les données
    const csvData = filteredOrders.value.map(order => [
      `#${order.id.slice(-8).toUpperCase()}`,
      order.external_order_id || '',
      order.customer_name || '',
      order.customer_email || '',
      order.customer_phone || '',
      order.customer_address || '',
      getProductSummary(order),
      getProductCount(order) + getUpsellCount(order),
      getTotalOrderAmount(order),
      order.upsell_amount || 0,
      order.currency,
      getPaymentMethodLabel(order.payment_method),
      getStatusLabel(order.status),
      formatDate(order.created_at),
      order.exported_at ? formatDate(order.exported_at) : '',
      order.notes || ''
    ])
    
    // Créer le contenu CSV
    const csvContent = [
      headers.join(','),
      ...csvData.map(row => row.map(cell => `"${cell}"`).join(','))
    ].join('\n')
    
    // Créer et télécharger le fichier
    const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' })
    const link = document.createElement('a')
    const url = URL.createObjectURL(blob)
    
    link.setAttribute('href', url)
    link.setAttribute('download', `commandes-chatseller-${new Date().toISOString().split('T')[0]}.csv`)
    link.style.visibility = 'hidden'
    document.body.appendChild(link)
    link.click()
    document.body.removeChild(link)
    
    showNotification(`${filteredOrders.value.length} commande(s) exportée(s) avec succès!`)
    
  } catch (error) {
    console.error('Erreur lors de l\'export CSV:', error)
    showNotification('Erreur lors de l\'export CSV', 'error')
  } finally {
    exporting.value = false
  }
}

// ✅ ACTION METHODS
const viewOrder = (order: Order) => {
  selectedOrder.value = order
  showOrderModal.value = true
  activeActionMenu.value = null
}

const closeOrderModal = () => {
  showOrderModal.value = false
  selectedOrder.value = null
}

const updateOrderStatus = (order: Order) => {
  orderToUpdate.value = order
  newStatus.value = order.status
  statusNotes.value = ''
  showStatusModal.value = true
  activeActionMenu.value = null
}

const closeStatusModal = () => {
  showStatusModal.value = false
  orderToUpdate.value = null
  newStatus.value = ''
  statusNotes.value = ''
}

const saveStatusUpdate = async () => {
  if (!orderToUpdate.value) return
  
  updatingStatus.value = true
  
  try {
    const updateData: any = {
      status: newStatus.value,
      updated_at: new Date().toISOString()
    }
    
    // Ajouter notes si présentes
    if (statusNotes.value.trim()) {
      const existingNotes = orderToUpdate.value.notes || ''
      const newNote = `[${new Date().toLocaleDateString('fr-FR')}] ${statusNotes.value.trim()}`
      updateData.notes = existingNotes ? `${existingNotes}\n${newNote}` : newNote
    }
    
    const { error: supabaseError } = await supabase
      .from('orders')
      .update(updateData)
      .eq('id', orderToUpdate.value.id)

    if (supabaseError) {
      throw new Error(supabaseError.message)
    }

    // Mise à jour locale
    const orderIndex = orders.value.findIndex(o => o.id === orderToUpdate.value!.id)
    if (orderIndex !== -1) {
      orders.value[orderIndex] = { ...orders.value[orderIndex], ...updateData }
    }
    
    // Mise à jour des sélections
    if (selectedOrder.value?.id === orderToUpdate.value.id) {
      selectedOrder.value = { ...selectedOrder.value, ...updateData }
    }

    showNotification('Statut de commande mis à jour avec succès!')
    closeStatusModal()
    await loadStats()
    
  } catch (err: any) {
    console.error('❌ Erreur mise à jour statut:', err)
    showNotification('Erreur lors de la mise à jour du statut', 'error')
  } finally {
    updatingStatus.value = false
  }
}

const markAsExported = async (order: Order) => {
  try {
    const { error: supabaseError } = await supabase
      .from('orders')
      .update({ 
        exported_at: new Date().toISOString(),
        updated_at: new Date().toISOString()
      })
      .eq('id', order.id)

    if (supabaseError) {
      throw new Error(supabaseError.message)
    }

    // Mise à jour locale
    order.exported_at = new Date().toISOString()
    
    showNotification('Commande marquée comme exportée!')
  } catch (err: any) {
    console.error('❌ Erreur mark as exported:', err)
    showNotification('Erreur lors de la mise à jour', 'error')
  } finally {
    activeActionMenu.value = null
  }
}

const addNotes = (order: Order) => {
  const note = prompt('Ajouter une note à cette commande:')
  if (!note || !note.trim()) {
    activeActionMenu.value = null
    return
  }
  
  updateOrderNotes(order, note.trim())
}

const updateOrderNotes = async (order: Order, newNote: string) => {
  try {
    const existingNotes = order.notes || ''
    const timestampedNote = `[${new Date().toLocaleDateString('fr-FR')}] ${newNote}`
    const updatedNotes = existingNotes ? `${existingNotes}\n${timestampedNote}` : timestampedNote
    
    const { error: supabaseError } = await supabase
      .from('orders')
      .update({ 
        notes: updatedNotes,
        updated_at: new Date().toISOString()
      })
      .eq('id', order.id)

    if (supabaseError) {
      throw new Error(supabaseError.message)
    }

    // Mise à jour locale
    order.notes = updatedNotes
    
    showNotification('Note ajoutée avec succès!')
  } catch (err: any) {
    console.error('❌ Erreur ajout note:', err)
    showNotification('Erreur lors de l\'ajout de la note', 'error')
  } finally {
    activeActionMenu.value = null
  }
}

const toggleActionMenu = (orderId: string) => {
  activeActionMenu.value = activeActionMenu.value === orderId ? null : orderId
}

const clearFilters = () => {
  searchQuery.value = ''
  filters.value.status = ''
  filters.value.period = ''
}

// Close action menu when clicking outside
const closeActionMenu = (event: Event) => {
  if (activeActionMenu.value && !(event.target as Element).closest('.order-actions')) {
    activeActionMenu.value = null
  }
}

// ✅ LIFECYCLE
onMounted(() => {
  loadOrders()
  document.addEventListener('click', closeActionMenu)
})

onUnmounted(() => {
  document.removeEventListener('click', closeActionMenu)
})

// ✅ SEO
useHead({
  title: 'Commandes - ChatSeller Dashboard'
})
</script>

<style scoped>
/* ✅ MODERN COMPONENTS */
.card-modern {
  @apply bg-white rounded-xl shadow-sm border border-gray-200 p-6;
}

.input-modern {
  @apply px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-colors text-sm;
}

.btn-primary {
  @apply px-4 py-2 bg-blue-600 text-white text-sm font-medium rounded-lg hover:bg-blue-700 transition-colors;
}

.table-header {
  @apply px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider;
}

.table-cell {
  @apply px-6 py-4 whitespace-nowrap;
}

.status-badge {
  @apply inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium;
}

.action-button-primary {
  @apply text-blue-600 hover:text-blue-900 text-sm font-medium transition-colors;
}

.action-button-secondary {
  @apply p-2 text-gray-400 hover:text-gray-600 hover:bg-gray-100 rounded-lg transition-colors;
}

.order-actions {
  @apply relative;
}

.action-dropdown {
  @apply absolute right-0 mt-2 w-48 bg-white rounded-lg shadow-lg border border-gray-200 z-10 py-1;
}

.action-dropdown-item {
  @apply w-full text-left px-4 py-2 text-sm text-gray-700 hover:bg-gray-100 flex items-center space-x-2 transition-colors;
}

/* ✅ RESPONSIVE */
@media (max-width: 768px) {
  .card-modern {
    @apply p-4;
  }
  
  .table-cell {
    @apply px-4 py-3;
  }
  
  .table-header {
    @apply px-4 py-2;
  }
}

/* ✅ ANIMATIONS */
@keyframes spin {
  from { transform: rotate(0deg); }
  to { transform: rotate(360deg); }
}

.animate-spin {
  animation: spin 1s linear infinite;
}
</style>