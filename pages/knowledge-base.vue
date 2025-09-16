<!-- pages/knowledge-base.vue  -->
<template>
  <div class="min-h-screen bg-gradient-to-br from-rose-50 via-pink-50 to-purple-50">
    <!-- Header Beauté -->
    <div class="bg-white shadow-sm border-b border-rose-200">
      <div class="px-8 py-6">
        <div class="flex items-center justify-between">
          <div>
            <h1 class="text-3xl font-bold bg-gradient-to-r from-rose-600 via-pink-600 to-purple-600 bg-clip-text text-transparent">
              Base de connaissances
            </h1>
            <p class="mt-2 text-gray-600">
              Formez vos Conseillères IA avec des informations sur votre marque et vos produits
            </p>
          </div>

          <div class="flex items-center space-x-4">
            <button
              @click="handleBulkImport"
              :disabled="loading || saving"
              class="inline-flex items-center px-4 py-2 border border-rose-300 rounded-lg text-sm font-medium text-rose-700 bg-white hover:bg-rose-50 disabled:opacity-50 transition-colors"
            >
              <svg class="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M7 16a4 4 0 01-.88-7.903A5 5 0 1115.9 6L16 6a5 5 0 011 9.9M9 19l3 3m0 0l3-3m-3 3V10"/>
              </svg>
              Import en masse
            </button>

            <button
              @click="handleQuickAddKnowledge"
              :disabled="loading || saving"
              class="inline-flex items-center px-4 py-2 bg-gradient-to-r from-rose-600 via-pink-600 to-purple-600 text-white text-sm font-medium rounded-lg hover:from-rose-700 hover:via-pink-700 hover:to-purple-700 disabled:opacity-50 transition-all duration-300 shadow-lg hover:shadow-xl"
            >
              <svg class="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 6v6m0 0v6m0-6h6m-6 0H6"/>
              </svg>
              Ajouter des connaissances
            </button>
          </div>
        </div>
      </div>
    </div>

    <!-- Content -->
    <div class="p-8">
      <!-- Training Status Banner -->
      <div v-if="saving || uploadProgress > 0" class="mb-6 bg-gradient-to-r from-rose-50 to-pink-50 border border-rose-200 rounded-xl p-4">
        <div class="flex items-center">
          <div class="animate-spin rounded-full h-6 w-6 border-b-2 border-rose-600 mr-3"></div>
          <div class="flex-1">
            <h3 class="text-sm font-medium text-rose-800">
              {{ uploadProgress > 0 ? 'Upload en cours...' : 'Entraînement en cours...' }}
            </h3>
            <p class="text-sm text-rose-700">
              {{ uploadProgress > 0 ? 'Téléchargement de vos fichiers beauté' : 'Votre Conseillère IA apprend de nouvelles données beauté' }}
            </p>
            <div v-if="uploadProgress > 0" class="mt-2 bg-rose-200 rounded-full h-2">
              <div 
                class="bg-gradient-to-r from-rose-500 to-pink-500 h-2 rounded-full transition-all duration-300"
                :style="{ width: uploadProgress + '%' }"
              ></div>
            </div>
          </div>
        </div>
      </div>

      <!-- Statistics Cards Beauté -->
      <div class="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
        <div class="stats-card">
          <div class="stats-icon bg-rose-100 text-rose-600">
            <svg class="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z"/>
            </svg>
          </div>
          <div>
            <p class="text-2xl font-bold text-gray-900">{{ documents.length }}</p>
            <p class="text-sm text-gray-600">Documents</p>
          </div>
        </div>

        <div class="stats-card">
          <div class="stats-icon bg-pink-100 text-pink-600">
            <svg class="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z"/>
            </svg>
          </div>
          <div>
            <p class="text-2xl font-bold text-gray-900">{{ activeDocuments.length }}</p>
            <p class="text-sm text-gray-600">Sources actives</p>
          </div>
        </div>

        <div class="stats-card">
          <div class="stats-icon bg-purple-100 text-purple-600">
            <svg class="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M7 4V2a1 1 0 011-1h4a1 1 0 011 1v2h4a1 1 0 110 2h-1v12a2 2 0 01-2 2H6a2 2 0 01-2-2V6H3a1 1 0 110-2h4z"/>
            </svg>
          </div>
          <div>
            <p class="text-2xl font-bold text-gray-900">{{ totalWordCount.toLocaleString() }}</p>
            <p class="text-sm text-gray-600">Mots analysés</p>
          </div>
        </div>

        <div class="stats-card">
          <div class="stats-icon bg-gradient-to-r from-rose-100 to-pink-100 text-rose-600">
            <svg class="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M10.325 4.317c.426-1.756 2.924-1.756 3.35 0a1.724 1.724 0 002.573 1.066c1.543-.94 3.31.826 2.37 2.37a1.724 1.724 0 001.065 2.572c1.756.426 1.756 2.924 0 3.35a1.724 1.724 0 00-1.066 2.573c.94 1.543-.826 3.31-2.37 2.37a1.724 1.724 0 00-2.572 1.065c-.426 1.756-2.924 1.756-3.35 0a1.724 1.724 0 00-2.573-1.066c-1.543.94-3.31-.826-2.37-2.37a1.724 1.724 0 00-1.065-2.572c-1.756-.426-1.756-2.924 0-3.35a1.724 1.724 0 001.066-2.573c-.94-1.543.826-3.31 2.37-2.37.996.608 2.296.07 2.572-1.065z"/>
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M15 12a3 3 0 11-6 0 3 3 0 016 0z"/>
            </svg>
          </div>
          <div>
            <p class="text-2xl font-bold text-gray-900">{{ Object.keys(documentsByType).length }}</p>
            <p class="text-sm text-gray-600">Types de sources</p>
          </div>
        </div>
      </div>

      <!-- Quick Add Section Beauté -->
      <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
        <!-- Upload Files -->
        <div class="add-source-card beauty-card" @click="handleOpenFileUpload">
          <div class="add-source-icon bg-gradient-to-br from-rose-100 to-pink-100">
            <svg class="w-8 h-8 text-rose-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z"/>
            </svg>
          </div>
          <h3 class="text-lg font-semibold text-gray-900">Fichiers</h3>
          <p class="text-sm text-gray-600">PDF, Docx, CSV</p>
          <div class="mt-3 flex items-center text-rose-600 text-sm font-medium">
            Importer
            <svg class="w-4 h-4 ml-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 5l7 7-7 7"/>
            </svg>
          </div>
        </div>

        <!-- Add Website -->
        <div class="add-source-card beauty-card" @click="handleShowWebsiteModal">
          <div class="add-source-icon bg-gradient-to-br from-pink-100 to-purple-100">
            <svg class="w-8 h-8 text-pink-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M21 12a9 9 0 01-9 9m9-9a9 9 0 00-9-9m9 9H3m9 9v-9m0-9v9"/>
            </svg>
          </div>
          <h3 class="text-lg font-semibold text-gray-900">Site web</h3>
          <p class="text-sm text-gray-600">Pages, Blog, Politiques</p>
          <div class="mt-3 flex items-center text-pink-600 text-sm font-medium">
            Indexer
            <svg class="w-4 h-4 ml-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 5l7 7-7 7"/>
            </svg>
          </div>
        </div>

        <!-- Add Text -->
        <div class="add-source-card beauty-card" @click="handleShowTextModal">
          <div class="add-source-icon bg-gradient-to-br from-purple-100 to-rose-100">
            <svg class="w-8 h-8 text-purple-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z"/>
            </svg>
          </div>
          <h3 class="text-lg font-semibold text-gray-900">Texte libre</h3>
          <p class="text-sm text-gray-600">FAQ, routines, ingrédients</p>
          <div class="mt-3 flex items-center text-purple-600 text-sm font-medium">
            Rédiger
            <svg class="w-4 h-4 ml-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 5l7 7-7 7"/>
            </svg>
          </div>
        </div>

        <!-- Import API -->
        <div class="add-source-card disabled">
          <div class="add-source-icon bg-gray-100">
            <svg class="w-8 h-8 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M8.684 13.342C8.886 12.938 9 12.482 9 12c0-.482-.114-.938-.316-1.342m0 2.684a3 3 0 110-2.684m0 2.684l6.632 3.316m-6.632-6l6.632-3.316m0 0a3 3 0 105.367-2.684 3 3 0 00-5.367 2.684zm0 9.316a3 3 0 105.367 2.684 3 3 0 00-5.367-2.684z"/>
            </svg>
          </div>
          <h3 class="text-lg font-semibold text-gray-400">API/CRM</h3>
          <p class="text-sm text-gray-400">Notion, Zendesk</p>
          <div class="mt-3 flex items-center text-gray-400 text-sm">
            Bientôt disponible
          </div>
        </div>
      </div>

      <!-- Plan Limits Banner Beauté -->
      <div class="mb-6 bg-gradient-to-r from-rose-50 via-pink-50 to-purple-50 border border-rose-200 rounded-xl p-6">
        <div class="flex items-center justify-between">
          <div>
            <h3 class="text-lg font-semibold text-gray-900 mb-2">Limites de votre plan {{ planDetails.name }}</h3>
            <div class="grid grid-cols-2 md:grid-cols-3 gap-4 text-sm">
              <div class="flex items-center">
                <div class="w-3 h-3 rounded-full mr-2" :class="documentsRemaining > 0 ? 'bg-green-500' : 'bg-orange-500'"></div>
                <span class="text-gray-700">
                  <span class="font-semibold">{{ documents.length }}</span> / 
                  <span class="font-semibold">{{ documentLimit === -1 ? '∞' : documentLimit }}</span> documents
                </span>
              </div>
              <div class="flex items-center">
                <div class="w-3 h-3 rounded-full mr-2 bg-rose-500"></div>
                <span class="text-gray-700">
                  <span class="font-semibold">{{ planDetails.quotasStatus.indexablePages.used || 0 }}</span> / 
                  <span class="font-semibold">{{ planDetails.quotasStatus.indexablePages.limit === -1 ? '∞' : planDetails.quotasStatus.indexablePages.limit }}</span> pages indexées
                </span>
              </div>
              <div class="flex items-center">
                <div class="w-3 h-3 rounded-full mr-2 bg-purple-500"></div>
                <span class="text-gray-700">Plan <span class="font-semibold">{{ planDetails.name }}</span></span>
              </div>
            </div>
          </div>
          <div v-if="!canUploadDocument" class="text-right">
            <p class="text-sm text-orange-600 font-medium mb-2">Limite atteinte</p>
            <a href="/billing" class="text-sm text-rose-600 hover:text-rose-700 font-medium underline">
              Passer au plan supérieur
            </a>
          </div>
        </div>
      </div>

      <!-- Search and Filters -->
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
                placeholder="Rechercher dans la base de connaissances..."
                class="w-full pl-10 pr-4 py-2 border border-rose-300 rounded-lg focus:ring-2 focus:ring-rose-500 focus:border-rose-500 transition-colors"
              >
            </div>
          </div>

          <!-- Filters -->
          <div class="flex items-center space-x-4">
            <select v-model="selectedType" class="input-modern border-rose-300 focus:border-rose-500 focus:ring-rose-500">
              <option value="">Tous les types</option>
              <option value="file">Fichiers</option>
              <option value="website">Sites web</option>
              <option value="manual">Textes libres</option>
              <option value="url">URLs</option>
            </select>

            <select v-model="selectedStatus" class="input-modern border-rose-300 focus:border-rose-500 focus:ring-rose-500">
              <option value="">Tous les statuts</option>
              <option value="true">Actifs</option>
              <option value="false">Inactifs</option>
            </select>
          </div>
        </div>
      </div>

      <!-- Knowledge Items List -->
      <div class="card-modern">
        <div class="flex items-center justify-between p-6 border-b border-rose-200">
          <h2 class="text-lg font-semibold text-gray-900">
            Sources de connaissances
          </h2>
          <div class="flex items-center space-x-4">
            <span class="text-sm text-gray-500">
              {{ filteredDocuments.length }} source(s)
            </span>
            <button
              @click="handleRefreshAll"
              :disabled="loading || saving"
              class="text-rose-600 hover:text-rose-700 text-sm font-medium disabled:opacity-50 transition-colors"
            >
              {{ loading ? 'Actualisation...' : 'Actualiser' }}
            </button>
          </div>
        </div>

        <!-- Loading State -->
        <div v-if="loading" class="p-12">
          <div class="flex items-center justify-center">
            <div class="animate-spin rounded-full h-8 w-8 border-b-2 border-rose-600"></div>
            <span class="ml-3 text-gray-600">Chargement de vos connaissances...</span>
          </div>
        </div>

        <!-- Knowledge Items -->
        <div v-else-if="filteredDocuments.length > 0" class="divide-y divide-rose-200">
          <div
            v-for="item in filteredDocuments"
            :key="item.id"
            class="p-6 hover:bg-gradient-to-r hover:from-rose-50 hover:to-pink-50 transition-all duration-300"
          >
            <div class="flex items-start justify-between">
              <div class="flex items-start space-x-4 flex-1">
                <!-- Type Icon -->
                <div class="knowledge-type-icon" :class="getTypeIconClass(item.contentType)">
                  <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" :d="getTypeIcon(item.contentType)"/>
                  </svg>
                </div>

                <!-- Content -->
                <div class="flex-1 min-w-0">
                  <div class="flex items-center space-x-3 mb-2">
                    <h3 class="text-sm font-medium text-gray-900 truncate">
                      {{ item.title }}
                    </h3>

                    <span :class="item.isActive ? 'bg-green-100 text-green-800' : 'bg-gray-100 text-gray-800'" class="status-badge">
                      {{ item.isActive ? 'Actif' : 'Inactif' }}
                    </span>

                    <span :class="getTypeBadgeClass(item.contentType)" class="type-badge">
                      {{ getTypeLabel(item.contentType) }}
                    </span>
                  </div>

                  <p class="text-sm text-gray-600 line-clamp-2 mb-2">
                    {{ item.content.substring(0, 150) }}{{ item.content.length > 150 ? '...' : '' }}
                  </p>

                  <div class="flex items-center text-xs text-gray-500 space-x-4">
                    <span>Ajouté le {{ formatDate(item.createdAt) }}</span>
                    <span v-if="item.metadata?.fileSize">{{ formatFileSize(item.metadata.fileSize) }}</span>
                    <span v-if="item.metadata?.wordCount">{{ item.metadata.wordCount }} mots</span>
                    <span v-if="item.linkedAgents?.length">Lié à {{ item.linkedAgents.length }} conseillère(s)</span>
                    <span v-if="item.tags.length" class="flex items-center">
                      <svg class="w-3 h-3 mr-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M7 7h.01M7 3h5c.512 0 1.024.195 1.414.586l7 7a2 2 0 010 2.828l-7 7a2 2 0 01-2.828 0l-7-7A1.994 1.994 0 013 12V7a4 4 0 014-4z"/>
                      </svg>
                      {{ item.tags.slice(0, 2).join(', ') }}{{ item.tags.length > 2 ? '...' : '' }}
                    </span>
                  </div>
                </div>
              </div>

              <!-- Actions -->
              <div class="flex items-center space-x-2 ml-4">
                <button
                  @click="toggleDocumentStatus(item.id, !item.isActive)"
                  :disabled="saving"
                  class="action-button"
                  :class="item.isActive ? 'text-orange-600 hover:text-orange-700 hover:bg-orange-50' : 'text-green-600 hover:text-green-700 hover:bg-green-50'"
                  :title="item.isActive ? 'Désactiver' : 'Activer'"
                >
                  <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path v-if="item.isActive" stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M18.364 18.364A9 9 0 005.636 5.636m12.728 12.728L5.636 5.636m12.728 12.728L18.364 5.636M5.636 18.364l12.728-12.728"/>
                    <path v-else stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z"/>
                  </svg>
                </button>

                <button
                  @click="editDocument(item)"
                  :disabled="saving"
                  class="action-button text-rose-600 hover:text-rose-700 hover:bg-rose-50"
                  title="Modifier"
                >
                  <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z"/>
                  </svg>
                </button>

                <button
                  @click="viewDocument(item)"
                  :disabled="saving"
                  class="action-button text-purple-600 hover:text-purple-700 hover:bg-purple-50"
                  title="Voir détails"
                >
                  <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M15 12a3 3 0 11-6 0 3 3 0 016 0z"/>
                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z"/>
                  </svg>
                </button>

                <button
                  @click="confirmDeleteDocument(item)"
                  :disabled="saving"
                  class="action-button text-red-600 hover:text-red-700 hover:bg-red-50"
                  title="Supprimer"
                >
                  <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16"/>
                  </svg>
                </button>
              </div>
            </div>
          </div>
        </div>

        <!-- Empty State -->
        <div v-else class="text-center py-12">
          <div class="knowledge-empty-illustration">
            <div class="mx-auto h-16 w-16 text-rose-400 mb-4 rounded-full bg-gradient-to-br from-rose-100 to-pink-100 flex items-center justify-center">
              <svg class="h-8 w-8" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="1" d="M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.746 0 3.332.477 4.5 1.253v13C19.832 18.477 18.246 18 16.5 18c-1.746 0-3.332.477-4.5 1.253"/>
              </svg>
            </div>
          </div>
          <h3 class="mt-4 text-lg font-medium text-gray-900">
            {{ hasActiveFilters ? 'Aucune connaissance trouvée' : 'Créez votre première base de connaissances' }}
          </h3>
          <p class="mt-2 text-gray-500">
            {{ hasActiveFilters 
              ? 'Aucune connaissance ne correspond à vos critères de recherche'
              : 'Ajoutez vos premières connaissances pour former votre Conseillère IA afin que ses réponses soient plus précises.'
            }}
          </p>
          <div class="mt-6">
            <button
              v-if="!hasActiveFilters"
              @click="handleQuickAddKnowledge"
              class="inline-flex items-center px-6 py-3 border border-transparent text-base font-medium rounded-lg text-white bg-gradient-to-r from-rose-600 via-pink-600 to-purple-600 hover:from-rose-700 hover:via-pink-700 hover:to-purple-700 transition-all duration-300 shadow-lg hover:shadow-xl"
            >
              <svg class="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 6v6m0 0v6m0-6h6m-6 0H6"/>
              </svg>
              Ajouter votre première connaissance
            </button>
            <button
              v-else
              @click="clearFilters"
              class="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-lg text-rose-600 bg-rose-100 hover:bg-rose-200 transition-colors"
            >
              Effacer les filtres
            </button>
          </div>
        </div>
      </div>
    </div>

    <!-- MODALS BEAUTÉ COMPLETS -->

    <!-- Bulk Import Modal -->
    <div v-if="showBulkImportModal" class="modal-overlay" @click.self="showBulkImportModal = false">
      <div class="modal-content modal-large">
        <div class="modal-header">
          <h3 class="modal-title">Import en masse de fichiers</h3>
          <button @click="showBulkImportModal = false" class="modal-close">
            <svg class="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12"/>
            </svg>
          </button>
        </div>

        <div class="modal-body">
          <div class="bulk-upload-zone" @click="triggerBulkFileInput" @drop="handleBulkFileDrop" @dragover.prevent @dragenter.prevent>
            <input ref="bulkFileInput" type="file" multiple accept=".pdf,.doc,.docx,.csv,.txt,.xlsx" class="hidden" @change="handleBulkFileSelect">
            <svg class="w-16 h-16 text-rose-400 mx-auto mb-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M7 16a4 4 0 01-.88-7.903A5 5 0 1115.9 6L16 6a5 5 0 011 9.9M9 19l3 3m0 0l3-3m-3 3V10"/>
            </svg>
            <p class="text-xl font-medium text-gray-900">Glissez jusqu'à 10 fichiers ici</p>
            <p class="text-sm text-gray-500 mt-1">ou cliquez pour sélectionner</p>
            <p class="text-xs text-gray-400 mt-2">PDF, Docx, CSV (max 10 MB par fichier)</p>
          </div>

          <div v-if="bulkUploadQueue.length > 0" class="mt-6">
            <div class="flex items-center justify-between mb-3">
              <h4 class="text-sm font-medium text-gray-900">{{ bulkUploadQueue.length }} fichier(s) sélectionné(s)</h4>
              <button @click="clearBulkQueue" class="text-red-600 hover:text-red-700 text-sm">Tout effacer</button>
            </div>
            <div class="space-y-2 max-h-64 overflow-y-auto">
              <div v-for="(file, index) in bulkUploadQueue" :key="`bulk-${file.name}-${index}`" class="flex items-center justify-between p-3 bg-rose-50 rounded-lg">
                <div class="flex items-center space-x-3">
                  <div class="file-type-icon">{{ getFileTypeIcon(file.name) }}</div>
                  <div>
                    <p class="text-sm font-medium text-gray-900">{{ file.name }}</p>
                    <p class="text-xs text-gray-500">{{ formatFileSize(file.size) }}</p>
                  </div>
                </div>
                <button @click="removeFromBulkQueue(index)" class="text-red-600 hover:text-red-700">
                  <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12"/>
                  </svg>
                </button>
              </div>
            </div>
          </div>
        </div>

        <div class="modal-footer">
          <button @click="showBulkImportModal = false" class="btn-secondary">Annuler</button>
          <button 
            @click="handleProcessBulkUpload" 
            :disabled="bulkUploadQueue.length === 0 || saving"
            class="btn-primary"
          >
            {{ saving ? 'Import en cours...' : `Importer ${bulkUploadQueue.length} fichier(s)` }}
          </button>
        </div>
      </div>
    </div>

    <!-- Quick Add Knowledge Modal -->
    <div v-if="showQuickAddModal" class="modal-overlay" @click.self="showQuickAddModal = false">
      <div class="modal-content modal-large">
        <div class="modal-header">
          <h3 class="modal-title">Ajouter des connaissances rapidement</h3>
          <button @click="showQuickAddModal = false" class="modal-close">
            <svg class="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12"/>
            </svg>
          </button>
        </div>

        <div class="modal-body">
          <div class="space-y-4">
            <div>
              <label class="block text-sm font-medium text-gray-700 mb-2">Titre de la connaissance</label>
              <input
                v-model="quickAddForm.title"
                type="text"
                placeholder="Ex: Routine anti-âge, Guide teintes fond de teint, Conseils peaux sensibles..."
                class="input-modern w-full"
              >
            </div>

            <div>
              <label class="block text-sm font-medium text-gray-700 mb-2">Type de contenu</label>
              <select v-model="quickAddForm.type" class="input-modern w-full">
                <option value="manual">Conseils/Mode d'emploi</option>
                <option value="faq">FAQ</option>
                <option value="policy">Conditions/Politique</option>
                <option value="guide">Guide/Tutoriel</option>
                <option value="product-info">Informations produits</option>
              </select>
            </div>

            <div>
              <label class="block text-sm font-medium text-gray-700 mb-2">Contenu</label>
              <textarea
                v-model="quickAddForm.content"
                rows="12"
                placeholder="Saisissez vos connaissances ici...

Exemple pour une routine skincare :
Q: Quelle routine pour peau mixte ?
R: Pour les peaux mixtes, je recommande :
1. Nettoyage matin/soir avec un gel doux
2. Tonique équilibrant 
3. Sérum à l'acide hyaluronique
4. Crème hydratante légère
5. Protection solaire le matin

Exemple pour conseils maquillage :
Pour un teint parfait, choisissez votre fond de teint selon votre sous-ton :
- Sous-ton chaud : teintes dorées, pêche
- Sous-ton froid : teintes rosées, beiges froids  
- Sous-ton neutre : teintes équilibrées"
                class="input-modern w-full resize-none"
              ></textarea>
              <p class="text-xs text-gray-500 mt-1">{{ quickAddForm.content.length }} caractères</p>
            </div>

            <div>
              <label class="block text-sm font-medium text-gray-700 mb-2">Tags (optionnel)</label>
              <input
                v-model="quickAddForm.tagsInput"
                type="text"
                placeholder="Ex: skincare, routine, peau-mixte, anti-age, maquillage (séparés par des virgules)"
                class="input-modern w-full"
              >
              <p class="text-xs text-gray-500 mt-1">Utilisez des tags pour organiser vos connaissances</p>
            </div>
          </div>
        </div>

        <div class="modal-footer">
          <button @click="showQuickAddModal = false" class="btn-secondary">Annuler</button>
          <button 
            @click="handleSaveQuickAdd" 
            :disabled="!quickAddForm.title || !quickAddForm.content || saving"
            class="btn-primary"
          >
            {{ saving ? 'Sauvegarde...' : 'Ajouter la connaissance' }}
          </button>
        </div>
      </div>
    </div>

    <!-- File Upload Modal -->
    <div v-if="showFileUpload" class="modal-overlay" @click.self="showFileUpload = false">
      <div class="modal-content">
        <div class="modal-header">
          <h3 class="modal-title">Importer un fichier</h3>
          <button @click="showFileUpload = false" class="modal-close">
            <svg class="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12"/>
            </svg>
          </button>
        </div>

        <div class="modal-body">
          <div class="file-upload-zone" @click="triggerFileInput" @drop="handleFileDrop" @dragover.prevent @dragenter.prevent>
            <input ref="fileInput" type="file" accept=".pdf,.doc,.docx,.csv,.txt,.xlsx" class="hidden" @change="handleFileSelect">
            <svg class="w-12 h-12 text-rose-400 mx-auto mb-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M7 16a4 4 0 01-.88-7.903A5 5 0 1115.9 6L16 6a5 5 0 011 9.9M9 19l3 3m0 0l3-3m-3 3V10"/>
            </svg>
            <p class="text-lg font-medium text-gray-900">Glissez votre fichier ici</p>
            <p class="text-sm text-gray-500 mt-1">ou cliquez pour sélectionner</p>
            <p class="text-xs text-gray-400 mt-2">PDF, Docx, CSV (max 10 MB)</p>
          </div>

          <div v-if="selectedFile" class="mt-4 p-3 bg-rose-50 rounded-lg flex items-center justify-between">
            <div class="flex items-center space-x-3">
              <div class="file-type-icon">{{ getFileTypeIcon(selectedFile.name) }}</div>
              <div>
                <p class="text-sm font-medium text-gray-900">{{ selectedFile.name }}</p>
                <p class="text-xs text-gray-500">{{ formatFileSize(selectedFile.size) }}</p>
              </div>
            </div>
            <button @click="selectedFile = null" class="text-red-600 hover:text-red-700">
              <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12"/>
              </svg>
            </button>
          </div>
        </div>

        <div class="modal-footer">
          <button @click="showFileUpload = false" class="btn-secondary">Annuler</button>
          <button 
            @click="handleUploadFile" 
            :disabled="!selectedFile || saving"
            class="btn-primary"
          >
            {{ saving ? 'Upload...' : 'Importer le fichier' }}
          </button>
        </div>
      </div>
    </div>

    <!-- Website Modal -->
    <div v-if="showWebsiteModal" class="modal-overlay" @click.self="showWebsiteModal = false">
      <div class="modal-content modal-large">
        <div class="modal-header">
          <h3 class="modal-title">Indexer un site web complet</h3>
          <button @click="showWebsiteModal = false" class="modal-close">
            <svg class="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12"/>
            </svg>
          </button>
        </div>

        <div class="modal-body">
          <div class="space-y-6">
            <!-- URL Input -->
            <div>
              <label class="block text-sm font-medium text-gray-700 mb-2">URL du site web</label>
              <input
                v-model="websiteForm.url"
                type="url"
                placeholder="https://votre-marque-beaute.com"
                class="input-modern w-full"
                :disabled="saving"
              >
              <p class="text-xs text-gray-500 mt-1">
                Nous recupérerons automatiquement toutes les pages de votre site
              </p>
            </div>

            <!-- Title Input -->
            <div>
              <label class="block text-sm font-medium text-gray-700 mb-2">Nom du projet (optionnel)</label>
              <input
                v-model="websiteForm.name"
                type="text"
                placeholder="Ex: Site principal, Blog beauté, E-shop..."
                class="input-modern w-full"
                :disabled="saving"
              >
              <p class="text-xs text-gray-500 mt-1">
                Ce nom sera utilisé comme préfixe pour tous les documents créés
              </p>
            </div>

            <!-- Indexation Options -->
            <div class="space-y-4">
              <h4 class="text-sm font-medium text-gray-900">Options d'indexation</h4>

              <div class="bg-gradient-to-r from-rose-50 to-pink-50 border border-rose-200 rounded-lg p-4">
                <div class="flex items-start">
                  <svg class="w-5 h-5 text-rose-600 mt-0.5 mr-3 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"/>
                  </svg>
                  <div class="flex-1">
                    <h5 class="text-sm font-medium text-rose-800 mb-1">Indexation intelligente</h5>
                    <p class="text-sm text-rose-700 mb-3">
                      Notre système recupère automatiquement toutes les pages de votre site via le sitemap.xml 
                      ou en explorant les liens internes (produits, conseils, blog, etc.).
                    </p>
                    <div class="space-y-2">
                      <label class="flex items-center text-sm">
                        <input 
                          v-model="websiteForm.includeSubpages" 
                          type="checkbox" 
                          class="rounded border-gray-300 text-rose-600 focus:ring-rose-500 mr-2"
                          :disabled="saving"
                        >
                        <span class="text-rose-800">
                          Indexer toutes les pages découvertes (recommandé)
                        </span>
                      </label>

                      <div v-if="!websiteForm.includeSubpages" class="bg-yellow-50 border border-yellow-200 rounded p-2 ml-6">
                        <p class="text-xs text-yellow-700">
                          Seule la page principale sera indexée si cette option est désactivée
                        </p>
                      </div>
                    </div>
                  </div>
                </div>
              </div>

              <!-- Plan Limits Info -->
              <div class="bg-gradient-to-r from-purple-50 to-rose-50 border border-purple-200 rounded-lg p-4">
                <h5 class="text-sm font-medium text-gray-900 mb-2">Limites de votre plan {{ planDetails.name }}</h5>
                <div class="grid grid-cols-2 gap-4 text-sm">
                  <div>
                    <span class="text-gray-600">Documents disponibles:</span>
                    <span class="ml-2 font-medium">
                      {{ documentsRemaining === -1 ? 'Illimité' : documentsRemaining }}
                    </span>
                  </div>
                  <div>
                    <span class="text-gray-600">Pages max par site:</span>
                    <span class="ml-2 font-medium">
                      {{ planDetails.name === 'starter' ? '500' : 
                         planDetails.name === 'growth' ? '2000' : 'Illimité' }}
                    </span>
                  </div>
                </div>
                <p class="text-xs text-gray-500 mt-2">
                  Chaque page recupérée créera un document séparé dans votre base de connaissances
                </p>
              </div>

              <!-- Future feature -->
              <div class="opacity-50">
                <label class="flex items-center text-sm text-gray-400">
                  <input 
                    type="checkbox" 
                    disabled
                    class="rounded border-gray-300 mr-2"
                  >
                  <span>Mise à jour automatique (quotidienne) - Bientôt disponible</span>
                </label>
              </div>
            </div>
          </div>
        </div>

        <div class="modal-footer">
          <button 
            @click="showWebsiteModal = false" 
            :disabled="saving"
            class="btn-secondary flex-1"
          >
            Annuler
          </button>
          <button 
            @click="handleIndexWebsite" 
            :disabled="!websiteForm.url || saving || !canUploadDocument" 
            class="btn-primary flex-1"
          >
            <div v-if="saving" class="flex items-center justify-center">
              <div class="animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2"></div>
              Indexation...
            </div>
            <span v-else>
              Indexer le site web
            </span>
          </button>
        </div>
      </div>
    </div>

    <!-- Text Modal -->
    <div v-if="showTextModal" class="modal-overlay" @click.self="showTextModal = false">
      <div class="modal-content modal-large">
        <div class="modal-header">
          <h3 class="modal-title">Ajouter du contenu textuel</h3>
          <button @click="showTextModal = false" class="modal-close">
            <svg class="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12"/>
            </svg>
          </button>
        </div>

        <div class="modal-body">
          <div class="space-y-4">
            <div>
              <label class="block text-sm font-medium text-gray-700 mb-2">Titre</label>
              <input
                v-model="textForm.title"
                type="text"
                placeholder="FAQ Skincare, Conseils Maquillage, Guide Anti-âge..."
                class="input-modern w-full"
              >
            </div>

            <div>
              <label class="block text-sm font-medium text-gray-700 mb-2">Type de contenu</label>
              <select v-model="textForm.type" class="input-modern w-full">
                <option value="manual">Conseils/Mode d'emploi</option>
                <option value="faq">FAQ</option>
                <option value="policy">Politique/Conditions</option>
                <option value="guide">Guide/Tutoriel beauté</option>
                <option value="product-info">Informations produits</option>
              </select>
            </div>

            <div>
              <label class="block text-sm font-medium text-gray-700 mb-2">Contenu</label>
              <textarea
                v-model="textForm.content"
                rows="10"
                placeholder="Rédigez ou collez votre texte ici...

Exemple routine skincare :
Pour une peau éclatante, suivez cette routine quotidienne :
1. Nettoyage doux matin et soir
2. Tonique hydratant
3. Sérum vitamin C le matin
4. Crème hydratante adaptée à votre type de peau
5. Protection solaire obligatoire le matin

Exemple conseils maquillage :
Pour choisir son fond de teint :
- Testez toujours sur la mâchoire
- Choisissez selon votre sous-ton (chaud/froid/neutre)
- Adaptez la couvrance à vos besoins
- N'oubliez pas le primer pour une tenue optimale"
                class="input-modern w-full"
              ></textarea>
            </div>
          </div>
        </div>

        <div class="modal-footer">
          <button @click="showTextModal = false" class="btn-secondary">Annuler</button>
          <button 
            @click="handleSaveTextContent" 
            :disabled="!textForm.title || !textForm.content || saving"
            class="btn-primary"
          >
            {{ saving ? 'Sauvegarde...' : 'Sauvegarder' }}
          </button>
        </div>
      </div>
    </div>

    <!-- Edit Document Modal -->
    <div v-if="showEditModal" class="modal-overlay" @click.self="showEditModal = false">
      <div class="modal-content modal-large">
        <div class="modal-header">
          <h3 class="modal-title">
            {{ editForm.contentType === 'file' ? 'Modifier les métadonnées du fichier' : 'Modifier le contenu' }}
          </h3>
          <button @click="showEditModal = false" class="modal-close">
            <svg class="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12"/>
            </svg>
          </button>
        </div>

        <div class="modal-body">
          <div class="space-y-4">
            <div>
              <label class="block text-sm font-medium text-gray-700 mb-2">Titre</label>
              <input
                v-model="editForm.title"
                type="text"
                class="input-modern w-full"
              >
            </div>

            <div v-if="editForm.contentType !== 'file'">
              <label class="block text-sm font-medium text-gray-700 mb-2">Contenu</label>
              <textarea
                v-model="editForm.content"
                rows="12"
                class="input-modern w-full resize-none"
              ></textarea>
              <p class="text-xs text-gray-500 mt-1">{{ editForm.content.length }} caractères</p>
            </div>

            <div v-else class="bg-yellow-50 border border-yellow-200 rounded-lg p-4">
              <div class="flex">
                <svg class="w-5 h-5 text-yellow-600 mt-0.5 mr-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"/>
                </svg>
                <div>
                  <h4 class="text-sm font-medium text-yellow-800 mb-1">Fichier importé</h4>
                  <p class="text-sm text-yellow-700">
                    Le contenu de ce fichier a été extrait automatiquement. 
                    Vous pouvez modifier le titre et les tags, mais pas le contenu source.
                  </p>
                  <p class="text-xs text-yellow-600 mt-2">
                    <strong>Fichier :</strong> {{ editForm.sourceFile || 'Fichier inconnu' }}
                  </p>
                </div>
              </div>
            </div>

            <div>
              <label class="block text-sm font-medium text-gray-700 mb-2">Tags</label>
              <input
                v-model="editForm.tagsInput"
                type="text"
                placeholder="Séparés par des virgules"
                class="input-modern w-full"
              >
            </div>

            <div class="flex items-center">
              <input
                v-model="editForm.isActive"
                type="checkbox"
                id="editActive"
                class="rounded border-gray-300 text-rose-600 focus:ring-rose-500"
              >
              <label for="editActive" class="ml-2 text-sm text-gray-700">
                Document actif (utilisé par la Conseillère IA)
              </label>
            </div>
          </div>
        </div>

        <div class="modal-footer">
          <button @click="showEditModal = false" class="btn-secondary">Annuler</button>
          <button 
            @click="handleSaveEdit" 
            :disabled="!editForm.title || saving"
            class="btn-primary"
          >
            {{ saving ? 'Sauvegarde...' : 'Sauvegarder les modifications' }}
          </button>
        </div>
      </div>
    </div>

    <!-- View Document Modal -->
    <div v-if="showViewModal" class="modal-overlay" @click.self="showViewModal = false">
      <div class="modal-content modal-large">
        <div class="modal-header">
          <h3 class="modal-title">Détails du document</h3>
          <button @click="showViewModal = false" class="modal-close">
            <svg class="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12"/>
            </svg>
          </button>
        </div>

        <div class="modal-body" v-if="currentViewDocument">
          <div class="space-y-6">
            <!-- Header -->
            <div class="flex items-start justify-between">
              <div>
                <h4 class="text-lg font-semibold text-gray-900">{{ currentViewDocument.title }}</h4>
                <div class="flex items-center space-x-3 mt-2">
                  <span :class="currentViewDocument.isActive ? 'bg-green-100 text-green-800' : 'bg-gray-100 text-gray-800'" class="status-badge">
                    {{ currentViewDocument.isActive ? 'Actif' : 'Inactif' }}
                  </span>
                  <span :class="getTypeBadgeClass(currentViewDocument.contentType)" class="type-badge">
                    {{ getTypeLabel(currentViewDocument.contentType) }}
                  </span>
                </div>
              </div>
              <button 
                @click="editDocument(currentViewDocument)"
                class="inline-flex items-center px-3 py-2 border border-rose-300 rounded-lg text-sm font-medium text-rose-700 bg-white hover:bg-rose-50 transition-colors"
              >
                <svg class="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z"/>
                </svg>
                Modifier
              </button>
            </div>

            <!-- Metadata -->
            <div class="grid grid-cols-2 gap-4 p-4 bg-gradient-to-r from-rose-50 to-pink-50 rounded-lg">
              <div>
                <p class="text-xs text-gray-500 uppercase tracking-wide">Créé le</p>
                <p class="text-sm font-medium text-gray-900">{{ formatDate(currentViewDocument.createdAt) }}</p>
              </div>
              <div>
                <p class="text-xs text-gray-500 uppercase tracking-wide">Modifié le</p>
                <p class="text-sm font-medium text-gray-900">{{ formatDate(currentViewDocument.updatedAt) }}</p>
              </div>
              <div v-if="currentViewDocument.metadata?.wordCount">
                <p class="text-xs text-gray-500 uppercase tracking-wide">Nombre de mots</p>
                <p class="text-sm font-medium text-gray-900">{{ currentViewDocument.metadata.wordCount.toLocaleString() }}</p>
              </div>
              <div v-if="currentViewDocument.metadata?.fileSize">
                <p class="text-xs text-gray-500 uppercase tracking-wide">Taille du fichier</p>
                <p class="text-sm font-medium text-gray-900">{{ formatFileSize(currentViewDocument.metadata.fileSize) }}</p>
              </div>
            </div>

            <!-- Source Info -->
            <div v-if="currentViewDocument.sourceFile || currentViewDocument.sourceUrl" class="p-4 bg-gradient-to-r from-purple-50 to-rose-50 rounded-lg">
              <h5 class="text-sm font-medium text-purple-900 mb-2">Source</h5>
              <p class="text-sm text-purple-800">
                <span v-if="currentViewDocument.sourceFile">📄 {{ currentViewDocument.sourceFile }}</span>
                <span v-if="currentViewDocument.sourceUrl">🌐 {{ currentViewDocument.sourceUrl }}</span>
              </p>
            </div>

            <!-- Tags -->
            <div v-if="currentViewDocument.tags.length" class="space-y-2">
              <h5 class="text-sm font-medium text-gray-900">Tags</h5>
              <div class="flex flex-wrap gap-2">
                <span 
                  v-for="tag in currentViewDocument.tags" 
                  :key="tag"
                  class="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-rose-100 text-rose-800"
                >
                  {{ tag }}
                </span>
              </div>
            </div>

            <!-- Content -->
            <div class="space-y-2">
              <h5 class="text-sm font-medium text-gray-900">Contenu</h5>
              <div class="max-h-96 overflow-y-auto p-4 bg-white border border-rose-200 rounded-lg">
                <p class="text-sm text-gray-700 whitespace-pre-wrap">{{ currentViewDocument.content }}</p>
              </div>
            </div>
          </div>
        </div>

        <div class="modal-footer">
          <button @click="showViewModal = false" class="btn-secondary">Fermer</button>
          <button 
            @click="editDocument(currentViewDocument!)"
            class="btn-primary"
          >
            Modifier ce document
          </button>
        </div>
      </div>
    </div>

    <!-- Delete Confirmation Modal -->
    <div v-if="showDeleteModal" class="modal-overlay" @click.self="showDeleteModal = false">
      <div class="modal-content">
        <div class="modal-header">
          <h3 class="text-lg font-semibold text-gray-900">Confirmer la suppression</h3>
          <button @click="showDeleteModal = false" class="modal-close">
            <svg class="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12"/>
            </svg>
          </button>
        </div>

        <div class="modal-body">
          <div class="text-center">
            <div class="w-16 h-16 bg-red-100 rounded-full flex items-center justify-center mx-auto mb-4">
              <svg class="w-8 h-8 text-red-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16"/>
              </svg>
            </div>
            <h4 class="text-lg font-medium text-gray-900 mb-2">Êtes-vous sûr ?</h4>
            <p class="text-gray-600 mb-4">
              Vous êtes sur le point de supprimer définitivement le document :
            </p>
            <p class="font-medium text-gray-900 mb-4">
              "{{ documentToDelete?.title }}"
            </p>
            <div class="bg-red-50 border border-red-200 rounded-lg p-3 mb-4">
              <p class="text-sm text-red-800">
                ⚠️ Cette action est irréversible. Le document et son fichier associé seront supprimés définitivement.
              </p>
            </div>
          </div>
        </div>

        <div class="modal-footer">
          <button @click="showDeleteModal = false" class="btn-secondary flex-1">
            Annuler
          </button>
          <button 
            @click="handleDeleteDocument"
            :disabled="saving"
            class="btn-danger flex-1"
          >
            {{ saving ? 'Suppression...' : 'Supprimer définitivement' }}
          </button>
        </div>
      </div>
    </div>

    <!-- Success Notification -->
    <div
      v-if="showSuccessMessage"
      class="fixed bottom-4 right-4 bg-gradient-to-r from-green-500 to-emerald-500 text-white px-6 py-3 rounded-lg shadow-lg z-50 transform transition-all duration-300"
    >
      <div class="flex items-center">
        <svg class="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M5 13l4 4L19 7"/>
        </svg>
        {{ successMessage }}
      </div>
    </div>

    <!-- Error Notification -->
    <div
      v-if="error"
      class="fixed bottom-4 right-4 bg-red-600 text-white px-6 py-3 rounded-lg shadow-lg z-50 transform transition-all duration-300"
    >
      <div class="flex items-center justify-between">
        <div class="flex items-center">
          <svg class="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"/>
          </svg>
          {{ error }}
        </div>
        <button @click="clearError" class="ml-4 text-white hover:text-gray-200">
          <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12"/>
          </svg>
        </button>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, computed, onMounted } from 'vue'
import { useKnowledgeBase } from '~/composables/useKnowledgeBase'
import type { KnowledgeBaseDocument } from '~/composables/useKnowledgeBase'

// PAGE META
definePageMeta({
  middleware: 'auth',
  layout: 'default'
})

// COMPOSABLE PRINCIPAL
const {
  documents,
  loading,
  saving,
  error,
  uploadProgress,
  activeDocuments,
  documentsByType,
  totalWordCount,
  planDetails,
  currentDocumentCount,
  documentLimit,
  canUploadDocument,
  documentsRemaining,
  isLimitReached,
  fetchDocuments,
  createDocument,
  updateDocument,
  deleteDocument,
  toggleDocumentStatus,
  uploadFile,
  processWebsite,
  searchDocuments,
  clearError
} = useKnowledgeBase()

// REACTIVE STATE
const searchQuery = ref('')
const selectedType = ref('')
const selectedStatus = ref('')
const showSuccessMessage = ref(false)
const successMessage = ref('')

// Modals
const showBulkImportModal = ref(false)
const showQuickAddModal = ref(false)
const showFileUpload = ref(false)
const showWebsiteModal = ref(false)
const showTextModal = ref(false)
const showEditModal = ref(false)
const showViewModal = ref(false)
const showDeleteModal = ref(false)

// File handling
const fileInput = ref<HTMLInputElement>()
const bulkFileInput = ref<HTMLInputElement>()
const selectedFile = ref<File | null>(null)
const bulkUploadQueue = ref<File[]>([])

// Document management
const documentToDelete = ref<KnowledgeBaseDocument | null>(null)
const currentViewDocument = ref<KnowledgeBaseDocument | null>(null)

// Forms
const quickAddForm = ref({
  title: '',
  type: 'manual',
  content: '',
  tagsInput: ''
})

const websiteForm = ref({
  url: '',
  name: '',
  includeSubpages: true,
  autoUpdate: false
})

const textForm = ref({
  title: '',
  type: 'manual',
  content: ''
})

const editForm = ref({
  id: '',
  title: '',
  content: '',
  contentType: 'manual' as any,
  sourceFile: '',
  sourceUrl: '',
  tagsInput: '',
  isActive: true
})

// COMPUTED
const filteredDocuments = computed(() => {
  let filtered = documents.value

  if (searchQuery.value) {
    filtered = searchDocuments(searchQuery.value)
  }

  if (selectedType.value) {
    filtered = filtered.filter(doc => doc.contentType === selectedType.value)
  }

  if (selectedStatus.value) {
    const isActive = selectedStatus.value === 'true'
    filtered = filtered.filter(doc => doc.isActive === isActive)
  }

  return filtered.sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime())
})

const hasActiveFilters = computed(() => {
  return searchQuery.value || selectedType.value || selectedStatus.value
})

// UTILITY METHODS
const formatDate = (dateString: string): string => {
  return new Date(dateString).toLocaleDateString('fr-FR', {
    year: 'numeric',
    month: 'short',
    day: 'numeric',
    hour: '2-digit',
    minute: '2-digit'
  })
}

const formatFileSize = (bytes: number): string => {
  if (bytes === 0) return '0 B'
  const k = 1024
  const sizes = ['B', 'KB', 'MB', 'GB']
  const i = Math.floor(Math.log(bytes) / Math.log(k))
  return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i]
}

const getFileTypeIcon = (fileName: string): string => {
  const ext = fileName.split('.').pop()?.toLowerCase()
  const icons: Record<string, string> = {
    pdf: '📄',
    doc: '📄',
    docx: '📄',
    csv: '📊',
    xlsx: '📊',
    txt: '📝'
  }
  return icons[ext || ''] || '📄'
}

const getTypeLabel = (type: string): string => {
  const labels: Record<string, string> = {
    file: 'Catalogue',
    website: 'Site beauté',
    manual: 'Conseils beauté',
    url: 'URL',
    faq: 'FAQ'
  }
  return labels[type] || type
}

const getTypeIcon = (type: string): string => {
  const icons: Record<string, string> = {
    file: 'M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z',
    website: 'M21 12a9 9 0 01-9 9m9-9a9 9 0 00-9-9m9 9H3m9 9v-9m0-9v9',
    manual: 'M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z',
    url: 'M13.828 10.172a4 4 0 00-5.656 0l-4 4a4 4 0 105.656 5.656l1.102-1.101m-.758-4.899a4 4 0 005.656 0l4-4a4 4 0 00-5.656-5.656l-1.1 1.1'
  }
  return icons[type] || icons.manual
}

const getTypeIconClass = (type: string): string => {
  const classes: Record<string, string> = {
    file: 'bg-gradient-to-br from-rose-100 to-pink-100 text-rose-600',
    website: 'bg-gradient-to-br from-pink-100 to-purple-100 text-pink-600',
    manual: 'bg-gradient-to-br from-purple-100 to-rose-100 text-purple-600',
    url: 'bg-gradient-to-br from-rose-100 to-pink-100 text-rose-600'
  }
  return classes[type] || 'bg-gray-100 text-gray-600'
}

const getTypeBadgeClass = (type: string): string => {
  const classes: Record<string, string> = {
    file: 'bg-rose-100 text-rose-800',
    website: 'bg-pink-100 text-pink-800',
    manual: 'bg-purple-100 text-purple-800',
    url: 'bg-rose-100 text-rose-800'
  }
  return classes[type] || 'bg-gray-100 text-gray-800'
}

const showNotification = (message: string, isError: boolean = false) => {
  if (isError) {
    return
  }
  successMessage.value = message
  showSuccessMessage.value = true
  setTimeout(() => {
    showSuccessMessage.value = false
  }, 3000)
}

// ACTION METHODS

// Header buttons
const handleBulkImport = () => {
  showBulkImportModal.value = true
}

const handleQuickAddKnowledge = () => {
  showQuickAddModal.value = true
}

// Quick add cards
const handleOpenFileUpload = () => {
  showFileUpload.value = true
}

const handleShowWebsiteModal = () => {
  showWebsiteModal.value = true
}

const handleShowTextModal = () => {
  showTextModal.value = true
}

const handleRefreshAll = async () => {
  await fetchDocuments()
  showNotification('Données beauté actualisées!')
}

// Bulk upload
const triggerBulkFileInput = () => {
  bulkFileInput.value?.click()
}

const handleBulkFileSelect = (event: Event) => {
  const files = (event.target as HTMLInputElement).files
  if (files) {
    const validFiles = Array.from(files).slice(0, 10).filter(file => {
      if (file.size > 10 * 1024 * 1024) {
        showNotification(`Le fichier ${file.name} est trop volumineux (max 10MB)`, true)
        return false
      }
      return true
    })
    bulkUploadQueue.value = validFiles
  }
}

const handleBulkFileDrop = (event: DragEvent) => {
  event.preventDefault()
  const files = event.dataTransfer?.files
  if (files) {
    const validFiles = Array.from(files).slice(0, 10).filter(file => {
      if (file.size > 10 * 1024 * 1024) {
        showNotification(`Le fichier ${file.name} est trop volumineux (max 10MB)`, true)
        return false
      }
      return true
    })
    bulkUploadQueue.value = validFiles
  }
}

const removeFromBulkQueue = (index: number) => {
  bulkUploadQueue.value.splice(index, 1)
}

const clearBulkQueue = () => {
  bulkUploadQueue.value = []
}

const handleProcessBulkUpload = async () => {
  for (const file of bulkUploadQueue.value) {
    const result = await uploadFile(file)
    if (!result.success) {
      console.error(`Erreur pour ${file.name}:`, result)
      break
    }
  }

  if (bulkUploadQueue.value.length > 0) {
    showNotification(`${bulkUploadQueue.value.length} fichier(s) importé(s) avec succès!`)
  }

  bulkUploadQueue.value = []
  showBulkImportModal.value = false
}

// Quick add modal
const handleSaveQuickAdd = async () => {
  const tags = quickAddForm.value.tagsInput
    ? quickAddForm.value.tagsInput.split(',').map(tag => tag.trim()).filter(Boolean)
    : []

  const result = await createDocument({
    title: quickAddForm.value.title,
    content: quickAddForm.value.content,
    contentType: quickAddForm.value.type as any,
    tags
  })

  if (result.success) {
    showNotification('Connaissance beauté ajoutée avec succès!')
    quickAddForm.value = { title: '', type: 'manual', content: '', tagsInput: '' }
    showQuickAddModal.value = false
  } else {
    console.error('Erreur lors de la création:', result)
  }
}

// Single file upload
const triggerFileInput = () => {
  fileInput.value?.click()
}

const handleFileSelect = (event: Event) => {
  const files = (event.target as HTMLInputElement).files
  if (files && files[0]) {
    selectedFile.value = files[0]
  }
}

const handleFileDrop = (event: DragEvent) => {
  event.preventDefault()
  const files = event.dataTransfer?.files
  if (files && files[0]) {
    selectedFile.value = files[0]
  }
}

const handleUploadFile = async () => {
  if (!selectedFile.value) return

  const result = await uploadFile(selectedFile.value)
  if (result.success) {
    showNotification('Fichier beauté téléchargé avec succès!')
    selectedFile.value = null
    showFileUpload.value = false
  } else {
    console.error('Erreur lors de l\'upload:', result)
  }
}

// Website processing
const handleIndexWebsite = async () => {
  try {
    if (!websiteForm.value.url.trim()) {
      error.value = 'Veuillez saisir une URL valide'
      return
    }

    saving.value = true
    error.value = null

    successMessage.value = `🔍 Découverte des pages du site ${websiteForm.value.url}...`
    showSuccessMessage.value = true

    const result = await processWebsite(
      websiteForm.value.url,
      websiteForm.value.name || undefined,
      websiteForm.value.includeSubpages ? ['website', 'multi-page'] : ['website', 'page-unique']
    )

    if (result.success) {
      const documentsCreated = Array.isArray(result.data) ? result.data : [result.data]
      const meta = (result as any).meta

      if (documentsCreated.length === 1) {
        showNotification(`Site beauté indexé avec succès! 1 page traitée.`)
      } else {
        showNotification(`Site beauté indexé avec succès! ${documentsCreated.length} pages traitées.`)
      }

      if (meta?.totalPagesDiscovered && meta.totalPagesDiscovered > 1) {
        setTimeout(() => {
          showNotification(
            `📊 Résumé: ${meta.totalPagesDiscovered} pages découvertes, ${meta.totalDocumentsCreated} documents créés`,
            false
          )
        }, 2000)
      }

      websiteForm.value = { 
        url: '', 
        name: '', 
        includeSubpages: true, 
        autoUpdate: false 
      }
      showWebsiteModal.value = false

    } else {
      console.error('Erreur lors de l\'indexation:', result)

      let errorMsg = result.error || 'Erreur lors de l\'indexation du site beauté'

      if (errorMsg.includes('Limite de votre plan atteinte')) {
        errorMsg += '\n\n💡 Conseil: Passez au plan supérieur pour indexer plus de pages simultanément.'
      } else if (errorMsg.includes('Pas assez d\'espace')) {
        errorMsg += '\n\n💡 Conseil: Supprimez quelques documents existants ou passez au plan supérieur.'
      }

      error.value = errorMsg
    }

  } catch (err: any) {
    console.error('Erreur handleIndexWebsite:', err)
    error.value = err.message || 'Erreur inattendue lors de l\'indexation'
  }
}

// Text content
const handleSaveTextContent = async () => {
  const result = await createDocument({
    title: textForm.value.title,
    content: textForm.value.content,
    contentType: textForm.value.type as any
  })

  if (result.success) {
    showNotification('Contenu beauté ajouté avec succès!')
    textForm.value = { title: '', type: 'manual', content: '' }
    showTextModal.value = false
  } else {
    console.error('Erreur lors de la sauvegarde:', result)
  }
}

// Document management
const editDocument = (doc: KnowledgeBaseDocument) => {
  editForm.value = {
    id: doc.id,
    title: doc.title,
    content: doc.content,
    contentType: doc.contentType,
    sourceFile: doc.sourceFile || '',
    sourceUrl: doc.sourceUrl || '',
    tagsInput: doc.tags.join(', '),
    isActive: doc.isActive
  }
  showViewModal.value = false
  showEditModal.value = true
}

const handleSaveEdit = async () => {
  const tags = editForm.value.tagsInput
    ? editForm.value.tagsInput.split(',').map(tag => tag.trim()).filter(Boolean)
    : []

  const updateData: any = {
    title: editForm.value.title,
    tags: tags,
    isActive: editForm.value.isActive
  }

  if (editForm.value.contentType !== 'file') {
    updateData.content = editForm.value.content
  }

  const result = await updateDocument(editForm.value.id, updateData)

  if (result.success) {
    showNotification('Document beauté modifié avec succès!')
    showEditModal.value = false
  } else {
    console.error('Erreur lors de la modification:', result)
  }
}

const viewDocument = (doc: KnowledgeBaseDocument) => {
  currentViewDocument.value = doc
  showViewModal.value = true
}

const confirmDeleteDocument = (doc: KnowledgeBaseDocument) => {
  documentToDelete.value = doc
  showDeleteModal.value = true
}

const handleDeleteDocument = async () => {
  if (!documentToDelete.value) return

  const result = await deleteDocument(documentToDelete.value.id)
  if (result.success) {
    showNotification('Document beauté supprimé avec succès!')
    showDeleteModal.value = false
    documentToDelete.value = null
  } else {
    console.error('Erreur lors de la suppression:', result)
  }
}

// Filters
const clearFilters = () => {
  searchQuery.value = ''
  selectedType.value = ''
  selectedStatus.value = ''
}

// LIFECYCLE
onMounted(async () => {
  await fetchDocuments()
})

// SEO
useHead({
  title: 'Base de connaissances beauté - ChatSeller Dashboard'
})
</script>

<style scoped>
/* COMPOSANTS BEAUTÉ MODERNES */
.card-modern {
  @apply bg-white rounded-xl shadow-sm border border-rose-200 p-6;
}

.input-modern {
  @apply px-3 py-2 border border-rose-300 rounded-lg focus:ring-2 focus:ring-rose-500 focus:border-rose-500 transition-colors text-sm;
}

.btn-primary {
  @apply px-4 py-2 bg-gradient-to-r from-rose-600 via-pink-600 to-purple-600 text-white text-sm font-medium rounded-lg hover:from-rose-700 hover:via-pink-700 hover:to-purple-700 disabled:opacity-50 transition-all duration-300 shadow-lg hover:shadow-xl;
}

.btn-secondary {
  @apply px-4 py-2 border border-rose-300 rounded-lg text-sm font-medium text-rose-700 bg-white hover:bg-rose-50 transition-colors;
}

.btn-danger {
  @apply px-4 py-2 bg-red-600 text-white text-sm font-medium rounded-lg hover:bg-red-700 disabled:opacity-50 transition-colors;
}

.stats-card {
  @apply bg-white rounded-xl shadow-sm border border-rose-200 p-6 flex items-center space-x-4;
}

.stats-icon {
  @apply w-12 h-12 rounded-xl flex items-center justify-center;
}

.add-source-card {
  @apply bg-white rounded-xl shadow-sm border border-rose-200 p-6 text-center cursor-pointer transition-all hover:shadow-md hover:border-rose-300 hover:bg-gradient-to-br hover:from-rose-50 hover:to-pink-50;
}

.beauty-card {
  @apply transform hover:scale-105;
}

.add-source-card.disabled {
  @apply cursor-not-allowed opacity-60 hover:shadow-sm hover:border-rose-200 hover:bg-white hover:scale-100;
}

.add-source-icon {
  @apply w-16 h-16 rounded-xl flex items-center justify-center mx-auto mb-4;
}

.knowledge-type-icon {
  @apply w-10 h-10 rounded-lg flex items-center justify-center flex-shrink-0;
}

.status-badge {
  @apply inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium;
}

.type-badge {
  @apply inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium;
}

.action-button {
  @apply p-2 text-gray-400 hover:text-gray-600 rounded-lg transition-colors disabled:opacity-50;
}

.knowledge-empty-illustration {
  @apply relative;
}

/* MODAL STYLES */
.modal-overlay {
  @apply fixed inset-0 z-50 overflow-y-auto bg-gray-900 bg-opacity-50 backdrop-blur-sm flex items-center justify-center p-4;
}

.modal-content {
  @apply bg-white rounded-xl shadow-xl max-w-lg w-full max-h-[90vh] overflow-y-auto;
}

.modal-large {
  @apply max-w-2xl;
}

.modal-header {
  @apply flex items-center justify-between p-6 border-b border-rose-200;
}

.modal-title {
  @apply text-lg font-semibold text-gray-900;
}

.modal-close {
  @apply text-gray-400 hover:text-gray-600 transition-colors;
}

.modal-body {
  @apply p-6;
}

.modal-footer {
  @apply flex items-center justify-end space-x-3 p-6 border-t border-rose-200;
}

/* FILE UPLOAD */
.file-upload-zone {
  @apply border-2 border-dashed border-rose-300 rounded-lg p-8 text-center cursor-pointer transition-colors hover:border-rose-400 hover:bg-rose-50;
}

.bulk-upload-zone {
  @apply border-2 border-dashed border-rose-300 rounded-lg p-12 text-center cursor-pointer transition-colors hover:border-rose-400 hover:bg-rose-50;
}

.file-type-icon {
  @apply text-xl;
}

/* TEXT UTILS */
.line-clamp-2 {
  display: -webkit-box;
  -webkit-line-clamp: 2;
  -webkit-box-orient: vertical;
  overflow: hidden;
}

/* RESPONSIVE */
@media (max-width: 768px) {
  .card-modern {
    @apply p-4;
  }

  .add-source-card {
    @apply p-4;
  }

  .add-source-icon {
    @apply w-12 h-12 mb-3;
  }

  .stats-card {
    @apply p-4;
  }

  .modal-footer {
    @apply flex-col space-x-0 space-y-3;
  }
}

/* ANIMATIONS */
@keyframes spin {
  from { transform: rotate(0deg); }
  to { transform: rotate(360deg); }
}

.animate-spin {
  animation: spin 1s linear infinite;
}
</style>