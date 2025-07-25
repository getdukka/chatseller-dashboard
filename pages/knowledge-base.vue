<!-- pages/knowledge-base.vue - PAGE BASE DE CONNAISSANCE CORRIGÉE -->
<template>
  <div class="min-h-screen bg-gray-50">
    <!-- Header -->
    <div class="bg-white shadow-sm border-b border-gray-200">
      <div class="px-8 py-6">
        <div class="flex items-center justify-between">
          <div>
            <h1 class="text-3xl font-bold text-gray-900">Base de connaissances</h1>
            <p class="mt-2 text-gray-600">
              Entraînez votre Vendeur IA avec vos données pour des réponses plus précises
            </p>
          </div>
          
          <div class="flex items-center space-x-4">
            <button
              @click="showBulkImport = true"
              class="inline-flex items-center px-4 py-2 border border-gray-300 rounded-lg text-sm font-medium text-gray-700 bg-white hover:bg-gray-50 transition-colors"
            >
              <svg class="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M7 16a4 4 0 01-.88-7.903A5 5 0 1115.9 6L16 6a5 5 0 011 9.9M9 19l3 3m0 0l3-3m-3 3V10"/>
              </svg>
              Import en masse
            </button>
            
            <button
              @click="showAddModal = true"
              class="inline-flex items-center px-4 py-2 bg-blue-600 text-white text-sm font-medium rounded-lg hover:bg-blue-700 transition-colors"
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
      <div v-if="trainingStatus.isTraining" class="mb-6 bg-blue-50 border border-blue-200 rounded-xl p-4">
        <div class="flex items-center">
          <div class="animate-spin rounded-full h-6 w-6 border-b-2 border-blue-600 mr-3"></div>
          <div class="flex-1">
            <h3 class="text-sm font-medium text-blue-800">Entraînement en cours...</h3>
            <p class="text-sm text-blue-700">
              Votre Vendeur IA apprend de nouvelles données. Cela peut prendre quelques minutes.
            </p>
            <div class="mt-2 bg-blue-200 rounded-full h-2">
              <div 
                class="bg-blue-600 h-2 rounded-full transition-all duration-300"
                :style="{ width: trainingStatus.progress + '%' }"
              ></div>
            </div>
          </div>
        </div>
      </div>

      <!-- Quick Add Section -->
      <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
        <!-- Upload Files -->
        <div class="add-source-card" @click="handleOpenFileUpload">
          <div class="add-source-icon bg-blue-100">
            <svg class="w-8 h-8 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z"/>
            </svg>
          </div>
          <h3 class="text-lg font-semibold text-gray-900">Fichiers</h3>
          <p class="text-sm text-gray-600">PDF, Word, Excel, CSV</p>
          <div class="mt-3 flex items-center text-blue-600 text-sm font-medium">
            Importer
            <svg class="w-4 h-4 ml-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 5l7 7-7 7"/>
            </svg>
          </div>
        </div>

        <!-- Add Website -->
        <div class="add-source-card" @click="handleShowWebsiteModal">
          <div class="add-source-icon bg-green-100">
            <svg class="w-8 h-8 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M21 12a9 9 0 01-9 9m9-9a9 9 0 00-9-9m9 9H3m9 9v-9m0-9v9"/>
            </svg>
          </div>
          <h3 class="text-lg font-semibold text-gray-900">Site Web</h3>
          <p class="text-sm text-gray-600">Pages, FAQ, blog</p>
          <div class="mt-3 flex items-center text-green-600 text-sm font-medium">
            Indexer
            <svg class="w-4 h-4 ml-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 5l7 7-7 7"/>
            </svg>
          </div>
        </div>

        <!-- Add Text -->
        <div class="add-source-card" @click="handleShowTextModal">
          <div class="add-source-icon bg-purple-100">
            <svg class="w-8 h-8 text-purple-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z"/>
            </svg>
          </div>
          <h3 class="text-lg font-semibold text-gray-900">Texte libre</h3>
          <p class="text-sm text-gray-600">FAQ, infos produits</p>
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
          <h3 class="text-lg font-semibold text-gray-400">API / CRM</h3>
          <p class="text-sm text-gray-400">Zendesk, Notion</p>
          <div class="mt-3 flex items-center text-gray-400 text-sm">
            Bientôt disponible
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
                class="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-colors"
              >
            </div>
          </div>
          
          <!-- Filters -->
          <div class="flex items-center space-x-4">
            <select v-model="selectedType" class="input-modern">
              <option value="">Tous les types</option>
              <option value="file">Fichiers</option>
              <option value="website">Sites web</option>
              <option value="text">Texte libre</option>
              <option value="faq">FAQ</option>
            </select>
            
            <select v-model="selectedStatus" class="input-modern">
              <option value="">Tous les statuts</option>
              <option value="trained">Entraîné</option>
              <option value="training">En cours</option>
              <option value="error">Erreur</option>
            </select>
          </div>
        </div>
      </div>

      <!-- Knowledge Items List -->
      <div class="card-modern">
        <div class="flex items-center justify-between p-6 border-b border-gray-200">
          <h2 class="text-lg font-semibold text-gray-900">
            Sources de connaissances
          </h2>
          <div class="flex items-center space-x-4">
            <span class="text-sm text-gray-500">
              {{ filteredKnowledge.length }} source(s)
            </span>
            <button
              @click="handleRetrainAll"
              :disabled="trainingStatus.isTraining"
              class="text-blue-600 hover:text-blue-700 text-sm font-medium disabled:opacity-50"
            >
              Ré-entraîner tout
            </button>
          </div>
        </div>

        <!-- Loading State -->
        <div v-if="loading" class="p-12">
          <div class="flex items-center justify-center">
            <div class="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
            <span class="ml-3 text-gray-600">Chargement des connaissances...</span>
          </div>
        </div>

        <!-- Knowledge Items -->
        <div v-else-if="filteredKnowledge.length > 0" class="divide-y divide-gray-200">
          <div
            v-for="item in filteredKnowledge"
            :key="item.id"
            class="p-6 hover:bg-gray-50 transition-colors"
          >
            <div class="flex items-start justify-between">
              <div class="flex items-start space-x-4 flex-1">
                <!-- Type Icon -->
                <div class="knowledge-type-icon" :class="getTypeIconClass(item.type)">
                  <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" :d="getTypeIcon(item.type)"/>
                  </svg>
                </div>

                <!-- Content -->
                <div class="flex-1 min-w-0">
                  <div class="flex items-center space-x-3 mb-2">
                    <h3 class="text-sm font-medium text-gray-900 truncate">
                      {{ item.title }}
                    </h3>
                    
                    <span :class="getStatusBadgeClass(item.status)" class="status-badge">
                      {{ getStatusLabel(item.status) }}
                    </span>
                    
                    <span :class="getTypeBadgeClass(item.type)" class="type-badge">
                      {{ getTypeLabel(item.type) }}
                    </span>
                  </div>
                  
                  <p class="text-sm text-gray-600 line-clamp-2 mb-2">
                    {{ item.description || item.content }}
                  </p>
                  
                  <div class="flex items-center text-xs text-gray-500 space-x-4">
                    <span>Ajouté le {{ formatDate(item.createdAt) }}</span>
                    <span v-if="item.size">{{ formatFileSize(item.size) }}</span>
                    <span v-if="item.lastTrained">Entraîné le {{ formatDate(item.lastTrained) }}</span>
                  </div>
                </div>
              </div>
              
              <!-- Actions -->
              <div class="flex items-center space-x-2 ml-4">
                <button
                  @click="editItem(item)"
                  class="action-button"
                  title="Modifier"
                >
                  <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z"/>
                  </svg>
                </button>
                
                <button
                  @click="retrainItem(item)"
                  :disabled="item.status === 'training'"
                  class="action-button"
                  title="Ré-entraîner"
                >
                  <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15"/>
                  </svg>
                </button>
                
                <button
                  @click="deleteItem(item)"
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
            <svg class="mx-auto h-16 w-16 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="1" d="M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.746 0 3.332.477 4.5 1.253v13C19.832 18.477 18.246 18 16.5 18c-1.746 0-3.332.477-4.5 1.253"/>
            </svg>
          </div>
          <h3 class="mt-4 text-lg font-medium text-gray-900">
            {{ searchQuery || selectedType || selectedStatus ? 'Aucune connaissance trouvée' : 'Commencez à entraîner votre agent IA' }}
          </h3>
          <p class="mt-2 text-gray-500">
            {{ searchQuery || selectedType || selectedStatus 
              ? 'Aucune connaissance ne correspond à vos critères de recherche'
              : 'Ajoutez vos premières connaissances pour que votre Vendeur IA puisse répondre aux questions de vos clients'
            }}
          </p>
          <div class="mt-6">
            <button
              v-if="!searchQuery && !selectedType && !selectedStatus"
              @click="showAddModal = true"
              class="inline-flex items-center px-6 py-3 border border-transparent text-base font-medium rounded-lg text-white bg-blue-600 hover:bg-blue-700 transition-colors"
            >
              <svg class="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 6v6m0 0v6m0-6h6m-6 0H6"/>
              </svg>
              Ajouter votre première connaissance
            </button>
            <button
              v-else
              @click="clearFilters"
              class="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-lg text-blue-600 bg-blue-100 hover:bg-blue-200 transition-colors"
            >
              Effacer les filtres
            </button>
          </div>
        </div>
      </div>
    </div>

    <!-- Modals -->
    <!-- File Upload Modal -->
    <div v-if="showFileUpload" class="modal-overlay" @click.self="showFileUpload = false">
      <div class="modal-content">
        <div class="modal-header">
          <h3 class="modal-title">Télécharger des fichiers</h3>
          <button @click="showFileUpload = false" class="modal-close">
            <svg class="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12"/>
            </svg>
          </button>
        </div>
        
        <div class="modal-body">
          <div class="file-upload-zone" @click="triggerFileInput" @drop="handleFileDrop" @dragover.prevent @dragenter.prevent>
            <input ref="fileInput" type="file" multiple accept=".pdf,.doc,.docx,.csv,.txt,.xlsx" class="hidden" @change="handleFileSelect">
            <svg class="w-12 h-12 text-gray-400 mx-auto mb-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M7 16a4 4 0 01-.88-7.903A5 5 0 1115.9 6L16 6a5 5 0 011 9.9M9 19l3 3m0 0l3-3m-3 3V10"/>
            </svg>
            <p class="text-lg font-medium text-gray-900">Glissez vos fichiers ici</p>
            <p class="text-sm text-gray-500 mt-1">ou cliquez pour sélectionner</p>
            <p class="text-xs text-gray-400 mt-2">PDF, Word, Excel, CSV, TXT (max 10 MB par fichier)</p>
          </div>
          
          <div v-if="uploadQueue.length > 0" class="mt-6">
            <h4 class="text-sm font-medium text-gray-900 mb-3">Fichiers en attente</h4>
            <div class="space-y-2">
              <div v-for="(file, index) in uploadQueue" :key="`${file.name}-${index}`" class="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                <div class="flex items-center space-x-3">
                  <div class="file-type-icon">{{ getFileTypeIcon(file.name) }}</div>
                  <div>
                    <p class="text-sm font-medium text-gray-900">{{ file.name }}</p>
                    <p class="text-xs text-gray-500">{{ formatFileSize(file.size) }}</p>
                  </div>
                </div>
                <button @click="removeFromQueue(index)" class="text-red-600 hover:text-red-700">
                  <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12"/>
                  </svg>
                </button>
              </div>
            </div>
          </div>
        </div>
        
        <div class="modal-footer">
          <button @click="showFileUpload = false" class="btn-secondary">Annuler</button>
          <button 
            @click="handleUploadFiles" 
            :disabled="uploadQueue.length === 0 || uploading"
            class="btn-primary"
          >
            {{ uploading ? 'Téléchargement...' : `Télécharger ${uploadQueue.length} fichier(s)` }}
          </button>
        </div>
      </div>
    </div>

    <!-- Website Modal -->
    <div v-if="showWebsiteModal" class="modal-overlay" @click.self="showWebsiteModal = false">
      <div class="modal-content">
        <div class="modal-header">
          <h3 class="modal-title">Indexer un site web</h3>
          <button @click="showWebsiteModal = false" class="modal-close">
            <svg class="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12"/>
            </svg>
          </button>
        </div>
        
        <div class="modal-body">
          <div class="space-y-4">
            <div>
              <label class="block text-sm font-medium text-gray-700 mb-2">URL du site web</label>
              <input
                v-model="websiteForm.url"
                type="url"
                placeholder="https://votre-site.com"
                class="input-modern w-full"
              >
            </div>
            
            <div>
              <label class="block text-sm font-medium text-gray-700 mb-2">Nom (optionnel)</label>
              <input
                v-model="websiteForm.name"
                type="text"
                placeholder="Site principal, FAQ, Blog..."
                class="input-modern w-full"
              >
            </div>
            
            <div>
              <label class="block text-sm font-medium text-gray-700 mb-2">Options d'indexation</label>
              <div class="space-y-2">
                <label class="flex items-center">
                  <input v-model="websiteForm.includeSubpages" type="checkbox" class="rounded">
                  <span class="ml-2 text-sm text-gray-700">Inclure les sous-pages</span>
                </label>
                <label class="flex items-center">
                  <input v-model="websiteForm.autoUpdate" type="checkbox" class="rounded">
                  <span class="ml-2 text-sm text-gray-700">Mise à jour automatique (quotidienne)</span>
                </label>
              </div>
            </div>
          </div>
        </div>
        
        <div class="modal-footer">
          <button @click="showWebsiteModal = false" class="btn-secondary">Annuler</button>
          <button 
            @click="handleIndexWebsite" 
            :disabled="!websiteForm.url || indexingWebsite" 
            class="btn-primary"
          >
            {{ indexingWebsite ? 'Indexation...' : 'Indexer le site' }}
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
                placeholder="FAQ Produits, Informations livraison..."
                class="input-modern w-full"
              >
            </div>
            
            <div>
              <label class="block text-sm font-medium text-gray-700 mb-2">Type de contenu</label>
              <select v-model="textForm.type" class="input-modern w-full">
                <option value="faq">FAQ</option>
                <option value="product-info">Informations produit</option>
                <option value="policy">Politique</option>
                <option value="guide">Guide/Tutoriel</option>
                <option value="other">Autre</option>
              </select>
            </div>
            
            <div>
              <label class="block text-sm font-medium text-gray-700 mb-2">Contenu</label>
              <textarea
                v-model="textForm.content"
                rows="10"
                placeholder="Saisissez votre contenu ici...

Exemple pour une FAQ :
Q: Quels sont vos délais de livraison ?
R: Nos délais de livraison sont de 2-3 jours ouvrables en France métropolitaine.

Q: Acceptez-vous les retours ?
R: Oui, vous pouvez retourner vos articles dans les 30 jours suivant la réception."
                class="input-modern w-full"
              ></textarea>
            </div>
          </div>
        </div>
        
        <div class="modal-footer">
          <button @click="showTextModal = false" class="btn-secondary">Annuler</button>
          <button 
            @click="handleSaveTextContent" 
            :disabled="!textForm.title || !textForm.content || savingText"
            class="btn-primary"
          >
            {{ savingText ? 'Sauvegarde...' : 'Sauvegarder' }}
          </button>
        </div>
      </div>
    </div>

    <!-- Success Notification -->
    <div
      v-if="showSuccessMessage"
      class="fixed bottom-4 right-4 bg-green-600 text-white px-6 py-3 rounded-lg shadow-lg z-50 transform transition-all duration-300"
    >
      <div class="flex items-center">
        <svg class="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M5 13l4 4L19 7"/>
        </svg>
        {{ successMessage }}
      </div>
    </div>

    <!-- Hidden file input -->
    <input ref="fileInput" type="file" multiple accept=".pdf,.doc,.docx,.csv,.txt,.xlsx" class="hidden" @change="handleFileSelect">
  </div>
</template>

<script setup lang="ts">
import { ref, computed, onMounted } from 'vue'
import { useAuthStore } from '~/stores/auth'

// ✅ PAGE META
definePageMeta({
  middleware: 'auth',
  layout: 'default'
})

// ✅ TYPES
interface KnowledgeItem {
  id: string
  title: string
  type: 'file' | 'website' | 'text' | 'faq'
  status: 'trained' | 'training' | 'error'
  content?: string
  description?: string
  url?: string
  fileName?: string
  size?: number
  createdAt: string
  lastTrained?: string
}

// ✅ COMPOSABLES
const authStore = useAuthStore()

// ✅ REACTIVE STATE
const loading = ref(false)
const uploading = ref(false) // ✅ AJOUTÉ
const indexingWebsite = ref(false) // ✅ AJOUTÉ
const savingText = ref(false) // ✅ AJOUTÉ
const searchQuery = ref('')
const selectedType = ref('')
const selectedStatus = ref('')
const showSuccessMessage = ref(false)
const successMessage = ref('')

// Modals
const showAddModal = ref(false)
const showFileUpload = ref(false)
const showWebsiteModal = ref(false)
const showTextModal = ref(false)
const showBulkImport = ref(false)

// Training status
const trainingStatus = ref({
  isTraining: false,
  progress: 0
})

// File upload
const fileInput = ref<HTMLInputElement>()
const uploadQueue = ref<File[]>([])

// Forms
const websiteForm = ref({
  url: '',
  name: '',
  includeSubpages: true,
  autoUpdate: false
})

const textForm = ref({
  title: '',
  type: 'faq',
  content: ''
})

// Knowledge items
const knowledgeItems = ref<KnowledgeItem[]>([
  {
    id: '1',
    title: 'FAQ Produits',
    type: 'text',
    status: 'trained',
    content: 'Questions fréquentes sur nos produits et services...',
    createdAt: new Date(Date.now() - 24 * 60 * 60 * 1000).toISOString(),
    lastTrained: new Date(Date.now() - 12 * 60 * 60 * 1000).toISOString()
  },
  {
    id: '2',
    title: 'Catalogue Produits 2024',
    type: 'file',
    status: 'trained',
    fileName: 'catalogue-2024.pdf',
    size: 2456789,
    description: 'Catalogue complet de nos produits avec descriptions et prix',
    createdAt: new Date(Date.now() - 3 * 24 * 60 * 60 * 1000).toISOString(),
    lastTrained: new Date(Date.now() - 2 * 24 * 60 * 60 * 1000).toISOString()
  },
  {
    id: '3',
    title: 'Site principal',
    type: 'website',
    status: 'training',
    url: 'https://votre-site.com',
    description: 'Pages principales du site web',
    createdAt: new Date(Date.now() - 60 * 60 * 1000).toISOString()
  }
])

// ✅ COMPUTED
const filteredKnowledge = computed(() => {
  let filtered = knowledgeItems.value

  if (searchQuery.value) {
    const query = searchQuery.value.toLowerCase()
    filtered = filtered.filter(item => 
      item.title.toLowerCase().includes(query) ||
      item.description?.toLowerCase().includes(query) ||
      item.content?.toLowerCase().includes(query)
    )
  }

  if (selectedType.value) {
    filtered = filtered.filter(item => item.type === selectedType.value)
  }

  if (selectedStatus.value) {
    filtered = filtered.filter(item => item.status === selectedStatus.value)
  }

  return filtered.sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime())
})

// ✅ UTILITY METHODS
const formatDate = (date: string): string => {
  return new Date(date).toLocaleDateString('fr-FR', {
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
    file: 'Fichier',
    website: 'Site web',
    text: 'Texte',
    faq: 'FAQ'
  }
  return labels[type] || type
}

const getStatusLabel = (status: string): string => {
  const labels: Record<string, string> = {
    trained: 'Entraîné',
    training: 'En cours',
    error: 'Erreur'
  }
  return labels[status] || status
}

const getTypeIcon = (type: string): string => {
  const icons: Record<string, string> = {
    file: 'M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z',
    website: 'M21 12a9 9 0 01-9 9m9-9a9 9 0 00-9-9m9 9H3m9 9v-9m0-9v9',
    text: 'M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z',
    faq: 'M8.228 9c.549-1.165 2.03-2 3.772-2 2.21 0 4 1.343 4 3 0 1.4-1.278 2.575-3.006 2.907-.542.104-.994.54-.994 1.093m0 3h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z'
  }
  return icons[type] || icons.text
}

const getTypeIconClass = (type: string): string => {
  const classes: Record<string, string> = {
    file: 'bg-red-100 text-red-600',
    website: 'bg-green-100 text-green-600',
    text: 'bg-purple-100 text-purple-600',
    faq: 'bg-blue-100 text-blue-600'
  }
  return classes[type] || 'bg-gray-100 text-gray-600'
}

const getStatusBadgeClass = (status: string): string => {
  const classes: Record<string, string> = {
    trained: 'bg-green-100 text-green-800',
    training: 'bg-yellow-100 text-yellow-800',
    error: 'bg-red-100 text-red-800'
  }
  return classes[status] || 'bg-gray-100 text-gray-800'
}

const getTypeBadgeClass = (type: string): string => {
  const classes: Record<string, string> = {
    file: 'bg-red-100 text-red-800',
    website: 'bg-green-100 text-green-800',
    text: 'bg-purple-100 text-purple-800',
    faq: 'bg-blue-100 text-blue-800'
  }
  return classes[type] || 'bg-gray-100 text-gray-800'
}

const showNotification = (message: string) => {
  successMessage.value = message
  showSuccessMessage.value = true
  setTimeout(() => {
    showSuccessMessage.value = false
  }, 3000)
}

// ✅ ACTION METHODS - CORRECTIONS MAJEURES
const handleOpenFileUpload = () => {
  showFileUpload.value = true
}

const handleShowWebsiteModal = () => {
  showWebsiteModal.value = true
}

const handleShowTextModal = () => {
  showTextModal.value = true
}

const triggerFileInput = () => {
  fileInput.value?.click()
}

const handleFileSelect = (event: Event) => {
  const files = (event.target as HTMLInputElement).files
  if (files) {
    const validFiles = Array.from(files).filter(file => {
      // Vérifier la taille (max 10MB)
      if (file.size > 10 * 1024 * 1024) {
        showNotification(`Le fichier ${file.name} est trop volumineux (max 10MB)`)
        return false
      }
      return true
    })
    uploadQueue.value = [...uploadQueue.value, ...validFiles]
  }
}

const handleFileDrop = (event: DragEvent) => {
  event.preventDefault()
  const files = event.dataTransfer?.files
  if (files) {
    const validFiles = Array.from(files).filter(file => {
      if (file.size > 10 * 1024 * 1024) {
        showNotification(`Le fichier ${file.name} est trop volumineux (max 10MB)`)
        return false
      }
      return true
    })
    uploadQueue.value = [...uploadQueue.value, ...validFiles]
  }
}

const removeFromQueue = (index: number) => {
  uploadQueue.value.splice(index, 1)
}

const handleUploadFiles = async () => {
  uploading.value = true
  
  try {
    for (const file of uploadQueue.value) {
      // ✅ TODO: Remplacer par un vrai appel API
      await new Promise(resolve => setTimeout(resolve, 1000))
      
      const newItem: KnowledgeItem = {
        id: Date.now().toString() + Math.random().toString(36).substr(2, 9),
        title: file.name,
        type: 'file',
        status: 'training',
        fileName: file.name,
        size: file.size,
        description: `Fichier téléchargé: ${file.name}`,
        createdAt: new Date().toISOString()
      }
      
      knowledgeItems.value.unshift(newItem)
      
      // Simuler l'entraînement
      setTimeout(() => {
        const item = knowledgeItems.value.find(i => i.id === newItem.id)
        if (item) {
          item.status = 'trained'
          item.lastTrained = new Date().toISOString()
        }
      }, 3000)
    }
    
    showNotification(`${uploadQueue.value.length} fichier(s) téléchargé(s) avec succès!`)
    uploadQueue.value = []
    showFileUpload.value = false
    
  } catch (error) {
    console.error('Erreur lors de l\'upload:', error)
    showNotification('Erreur lors du téléchargement des fichiers')
  } finally {
    uploading.value = false
  }
}

const handleIndexWebsite = async () => {
  indexingWebsite.value = true
  
  try {
    // ✅ TODO: Remplacer par un vrai appel API
    await new Promise(resolve => setTimeout(resolve, 2000))
    
    const newItem: KnowledgeItem = {
      id: Date.now().toString() + Math.random().toString(36).substr(2, 9),
      title: websiteForm.value.name || new URL(websiteForm.value.url).hostname,
      type: 'website',
      status: 'training',
      url: websiteForm.value.url,
      description: `Site web indexé: ${websiteForm.value.url}`,
      createdAt: new Date().toISOString()
    }
    
    knowledgeItems.value.unshift(newItem)
    
    // Simuler l'indexation
    setTimeout(() => {
      const item = knowledgeItems.value.find(i => i.id === newItem.id)
      if (item) {
        item.status = 'trained'
        item.lastTrained = new Date().toISOString()
      }
    }, 5000)
    
    showNotification('Site web indexé avec succès!')
    websiteForm.value = { url: '', name: '', includeSubpages: true, autoUpdate: false }
    showWebsiteModal.value = false
    
  } catch (error) {
    console.error('Erreur lors de l\'indexation:', error)
    showNotification('Erreur lors de l\'indexation du site web')
  } finally {
    indexingWebsite.value = false
  }
}

const handleSaveTextContent = async () => {
  savingText.value = true
  
  try {
    // ✅ TODO: Remplacer par un vrai appel API
    await new Promise(resolve => setTimeout(resolve, 1500))
    
    const newItem: KnowledgeItem = {
      id: Date.now().toString() + Math.random().toString(36).substr(2, 9),
      title: textForm.value.title,
      type: textForm.value.type as 'text' | 'faq',
      status: 'training',
      content: textForm.value.content,
      description: textForm.value.content.substring(0, 150) + '...',
      createdAt: new Date().toISOString()
    }
    
    knowledgeItems.value.unshift(newItem)
    
    // Simuler l'entraînement
    setTimeout(() => {
      const item = knowledgeItems.value.find(i => i.id === newItem.id)
      if (item) {
        item.status = 'trained'
        item.lastTrained = new Date().toISOString()
      }
    }, 2000)
    
    showNotification('Contenu ajouté avec succès!')
    textForm.value = { title: '', type: 'faq', content: '' }
    showTextModal.value = false
    
  } catch (error) {
    console.error('Erreur lors de la sauvegarde:', error)
    showNotification('Erreur lors de la sauvegarde du contenu')
  } finally {
    savingText.value = false
  }
}

const editItem = (item: KnowledgeItem) => {
  // TODO: Implémenter l'édition
  showNotification('Fonctionnalité d\'édition à venir')
}

const retrainItem = async (item: KnowledgeItem) => {
  item.status = 'training'
  
  setTimeout(() => {
    item.status = 'trained'
    item.lastTrained = new Date().toISOString()
  }, 3000)
  
  showNotification(`${item.title} en cours de ré-entraînement`)
}

const deleteItem = async (item: KnowledgeItem) => {
  if (confirm('Êtes-vous sûr de vouloir supprimer cette connaissance ?')) {
    knowledgeItems.value = knowledgeItems.value.filter(i => i.id !== item.id)
    showNotification('Connaissance supprimée avec succès!')
  }
}

const handleRetrainAll = async () => {
  trainingStatus.value.isTraining = true
  trainingStatus.value.progress = 0
  
  const interval = setInterval(() => {
    trainingStatus.value.progress += 10
    if (trainingStatus.value.progress >= 100) {
      clearInterval(interval)
      trainingStatus.value.isTraining = false
      trainingStatus.value.progress = 0
      
      // Mettre à jour tous les éléments
      knowledgeItems.value.forEach(item => {
        item.status = 'trained'
        item.lastTrained = new Date().toISOString()
      })
      
      showNotification('Toutes les connaissances ont été ré-entraînées!')
    }
  }, 500)
}

const clearFilters = () => {
  searchQuery.value = ''
  selectedType.value = ''
  selectedStatus.value = ''
}

// ✅ LIFECYCLE
onMounted(() => {
  // Charger les données
  console.log('Base de connaissance chargée')
})

// ✅ SEO
useHead({
  title: 'Base de connaissances - ChatSeller Dashboard'
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
  @apply px-4 py-2 bg-blue-600 text-white text-sm font-medium rounded-lg hover:bg-blue-700 disabled:opacity-50 transition-colors;
}

.btn-secondary {
  @apply px-4 py-2 border border-gray-300 rounded-lg text-sm font-medium text-gray-700 bg-white hover:bg-gray-50 transition-colors;
}

.add-source-card {
  @apply bg-white rounded-xl shadow-sm border border-gray-200 p-6 text-center cursor-pointer transition-all hover:shadow-md hover:border-blue-300 hover:bg-blue-50;
}

.add-source-card.disabled {
  @apply cursor-not-allowed opacity-60 hover:shadow-sm hover:border-gray-200 hover:bg-white;
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
  @apply p-2 text-gray-400 hover:text-gray-600 hover:bg-gray-100 rounded-lg transition-colors;
}

.knowledge-empty-illustration {
  @apply relative;
}

/* ✅ MODAL STYLES */
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
  @apply flex items-center justify-between p-6 border-b border-gray-200;
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
  @apply flex items-center justify-end space-x-3 p-6 border-t border-gray-200;
}

/* ✅ FILE UPLOAD */
.file-upload-zone {
  @apply border-2 border-dashed border-gray-300 rounded-lg p-8 text-center cursor-pointer transition-colors hover:border-blue-400 hover:bg-blue-50;
}

.file-type-icon {
  @apply text-xl;
}

/* ✅ RESPONSIVE */
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
}

/* ✅ ANIMATIONS */
@keyframes spin {
  from { transform: rotate(0deg); }
  to { transform: rotate(360deg); }
}

.animate-spin {
  animation: spin 1s linear infinite;
}

/* ✅ TEXT UTILS */
.line-clamp-2 {
  display: -webkit-box;
  -webkit-line-clamp: 2;
  -webkit-box-orient: vertical;
  overflow: hidden;
}
</style>