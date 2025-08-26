import { defineComponent, ref, computed, mergeProps, unref, useSSRContext } from 'vue';
import { ssrRenderAttrs, ssrIncludeBooleanAttr, ssrInterpolate, ssrRenderStyle, ssrRenderAttr, ssrLooseContain, ssrLooseEqual, ssrRenderList, ssrRenderClass } from 'vue/server-renderer';
import { u as useKnowledgeBase } from './useKnowledgeBase-MXWw3CiM.mjs';
import { u as useHead } from './server.mjs';
import { _ as _export_sfc } from './_plugin-vue_export-helper-1tPrXgE0.mjs';
import './auth-KgQDcdck.mjs';
import './useSupabase-CFkBc_As.mjs';
import '@supabase/supabase-js';
import '../nitro/nitro.mjs';
import 'node:http';
import 'node:https';
import 'node:events';
import 'node:buffer';
import 'node:fs';
import 'node:path';
import 'node:crypto';
import '../routes/renderer.mjs';
import 'vue-bundle-renderer/runtime';
import 'unhead/server';
import 'devalue';
import 'unhead/utils';
import 'unhead/plugins';
import 'vue-router';
import '@heroicons/vue/24/outline';

const _sfc_main = /* @__PURE__ */ defineComponent({
  __name: "knowledge-base",
  __ssrInlineRender: true,
  setup(__props) {
    const {
      documents,
      loading,
      saving,
      error,
      uploadProgress,
      activeDocuments,
      documentsByType,
      totalWordCount,
      searchDocuments
    } = useKnowledgeBase();
    const searchQuery = ref("");
    const selectedType = ref("");
    const selectedStatus = ref("");
    const showSuccessMessage = ref(false);
    const successMessage = ref("");
    const showBulkImportModal = ref(false);
    const showQuickAddModal = ref(false);
    const showFileUpload = ref(false);
    const showWebsiteModal = ref(false);
    const showTextModal = ref(false);
    const showEditModal = ref(false);
    const showViewModal = ref(false);
    const showDeleteModal = ref(false);
    ref();
    ref();
    const selectedFile = ref(null);
    const bulkUploadQueue = ref([]);
    const documentToDelete = ref(null);
    const currentViewDocument = ref(null);
    const quickAddForm = ref({
      title: "",
      type: "manual",
      content: "",
      tagsInput: ""
    });
    const websiteForm = ref({
      url: "",
      name: "",
      includeSubpages: true,
      autoUpdate: false
    });
    const textForm = ref({
      title: "",
      type: "manual",
      content: ""
    });
    const editForm = ref({
      id: "",
      title: "",
      content: "",
      contentType: "manual",
      sourceFile: "",
      sourceUrl: "",
      tagsInput: "",
      isActive: true
    });
    const filteredDocuments = computed(() => {
      let filtered = documents.value;
      if (searchQuery.value) {
        filtered = searchDocuments(searchQuery.value);
      }
      if (selectedType.value) {
        filtered = filtered.filter((doc) => doc.contentType === selectedType.value);
      }
      if (selectedStatus.value) {
        const isActive = selectedStatus.value === "true";
        filtered = filtered.filter((doc) => doc.isActive === isActive);
      }
      return filtered.sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime());
    });
    const hasActiveFilters = computed(() => {
      return searchQuery.value || selectedType.value || selectedStatus.value;
    });
    const formatDate = (dateString) => {
      return new Date(dateString).toLocaleDateString("fr-FR", {
        year: "numeric",
        month: "short",
        day: "numeric",
        hour: "2-digit",
        minute: "2-digit"
      });
    };
    const formatFileSize = (bytes) => {
      if (bytes === 0) return "0 B";
      const k = 1024;
      const sizes = ["B", "KB", "MB", "GB"];
      const i = Math.floor(Math.log(bytes) / Math.log(k));
      return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + " " + sizes[i];
    };
    const getFileTypeIcon = (fileName) => {
      var _a;
      const ext = (_a = fileName.split(".").pop()) == null ? void 0 : _a.toLowerCase();
      const icons = {
        pdf: "\u{1F4C4}",
        doc: "\u{1F4C4}",
        docx: "\u{1F4C4}",
        csv: "\u{1F4CA}",
        xlsx: "\u{1F4CA}",
        txt: "\u{1F4DD}"
      };
      return icons[ext || ""] || "\u{1F4C4}";
    };
    const getTypeLabel = (type) => {
      const labels = {
        file: "Fichier",
        website: "Site web",
        manual: "Texte libre",
        url: "URL",
        faq: "FAQ"
      };
      return labels[type] || type;
    };
    const getTypeIcon = (type) => {
      const icons = {
        file: "M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z",
        website: "M21 12a9 9 0 01-9 9m9-9a9 9 0 00-9-9m9 9H3m9 9v-9m0-9v9",
        manual: "M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z",
        url: "M13.828 10.172a4 4 0 00-5.656 0l-4 4a4 4 0 105.656 5.656l1.102-1.101m-.758-4.899a4 4 0 005.656 0l4-4a4 4 0 00-5.656-5.656l-1.1 1.1"
      };
      return icons[type] || icons.manual;
    };
    const getTypeIconClass = (type) => {
      const classes = {
        file: "bg-red-100 text-red-600",
        website: "bg-green-100 text-green-600",
        manual: "bg-purple-100 text-purple-600",
        url: "bg-blue-100 text-blue-600"
      };
      return classes[type] || "bg-gray-100 text-gray-600";
    };
    const getTypeBadgeClass = (type) => {
      const classes = {
        file: "bg-red-100 text-red-800",
        website: "bg-green-100 text-green-800",
        manual: "bg-purple-100 text-purple-800",
        url: "bg-blue-100 text-blue-800"
      };
      return classes[type] || "bg-gray-100 text-gray-800";
    };
    useHead({
      title: "Base de connaissances - ChatSeller Dashboard"
    });
    return (_ctx, _push, _parent, _attrs) => {
      var _a, _b, _c;
      _push(`<div${ssrRenderAttrs(mergeProps({ class: "min-h-screen bg-gray-50" }, _attrs))} data-v-f28de938><div class="bg-white shadow-sm border-b border-gray-200" data-v-f28de938><div class="px-8 py-6" data-v-f28de938><div class="flex items-center justify-between" data-v-f28de938><div data-v-f28de938><h1 class="text-3xl font-bold text-gray-900" data-v-f28de938>Base de connaissances</h1><p class="mt-2 text-gray-600" data-v-f28de938> Entra\xEEnez vos Vendeurs IA avec vos donn\xE9es pour des r\xE9ponses plus pr\xE9cises </p></div><div class="flex items-center space-x-4" data-v-f28de938><button${ssrIncludeBooleanAttr(unref(loading) || unref(saving)) ? " disabled" : ""} class="inline-flex items-center px-4 py-2 border border-gray-300 rounded-lg text-sm font-medium text-gray-700 bg-white hover:bg-gray-50 disabled:opacity-50 transition-colors" data-v-f28de938><svg class="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24" data-v-f28de938><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M7 16a4 4 0 01-.88-7.903A5 5 0 1115.9 6L16 6a5 5 0 011 9.9M9 19l3 3m0 0l3-3m-3 3V10" data-v-f28de938></path></svg> Import en masse </button><button${ssrIncludeBooleanAttr(unref(loading) || unref(saving)) ? " disabled" : ""} class="inline-flex items-center px-4 py-2 bg-blue-600 text-white text-sm font-medium rounded-lg hover:bg-blue-700 disabled:opacity-50 transition-colors" data-v-f28de938><svg class="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24" data-v-f28de938><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 6v6m0 0v6m0-6h6m-6 0H6" data-v-f28de938></path></svg> Ajouter des connaissances </button></div></div></div></div><div class="p-8" data-v-f28de938>`);
      if (unref(saving) || unref(uploadProgress) > 0) {
        _push(`<div class="mb-6 bg-blue-50 border border-blue-200 rounded-xl p-4" data-v-f28de938><div class="flex items-center" data-v-f28de938><div class="animate-spin rounded-full h-6 w-6 border-b-2 border-blue-600 mr-3" data-v-f28de938></div><div class="flex-1" data-v-f28de938><h3 class="text-sm font-medium text-blue-800" data-v-f28de938>${ssrInterpolate(unref(uploadProgress) > 0 ? "Upload en cours..." : "Traitement en cours...")}</h3><p class="text-sm text-blue-700" data-v-f28de938>${ssrInterpolate(unref(uploadProgress) > 0 ? "T\xE9l\xE9chargement de vos fichiers" : "Votre Vendeur IA apprend de nouvelles donn\xE9es")}</p>`);
        if (unref(uploadProgress) > 0) {
          _push(`<div class="mt-2 bg-blue-200 rounded-full h-2" data-v-f28de938><div class="bg-blue-600 h-2 rounded-full transition-all duration-300" style="${ssrRenderStyle({ width: unref(uploadProgress) + "%" })}" data-v-f28de938></div></div>`);
        } else {
          _push(`<!---->`);
        }
        _push(`</div></div></div>`);
      } else {
        _push(`<!---->`);
      }
      _push(`<div class="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8" data-v-f28de938><div class="stats-card" data-v-f28de938><div class="stats-icon bg-blue-100 text-blue-600" data-v-f28de938><svg class="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24" data-v-f28de938><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" data-v-f28de938></path></svg></div><div data-v-f28de938><p class="text-2xl font-bold text-gray-900" data-v-f28de938>${ssrInterpolate(unref(documents).length)}</p><p class="text-sm text-gray-600" data-v-f28de938>Documents total</p></div></div><div class="stats-card" data-v-f28de938><div class="stats-icon bg-green-100 text-green-600" data-v-f28de938><svg class="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24" data-v-f28de938><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" data-v-f28de938></path></svg></div><div data-v-f28de938><p class="text-2xl font-bold text-gray-900" data-v-f28de938>${ssrInterpolate(unref(activeDocuments).length)}</p><p class="text-sm text-gray-600" data-v-f28de938>Documents actifs</p></div></div><div class="stats-card" data-v-f28de938><div class="stats-icon bg-purple-100 text-purple-600" data-v-f28de938><svg class="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24" data-v-f28de938><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M7 4V2a1 1 0 011-1h4a1 1 0 011 1v2h4a1 1 0 110 2h-1v12a2 2 0 01-2 2H6a2 2 0 01-2-2V6H3a1 1 0 110-2h4z" data-v-f28de938></path></svg></div><div data-v-f28de938><p class="text-2xl font-bold text-gray-900" data-v-f28de938>${ssrInterpolate(unref(totalWordCount).toLocaleString())}</p><p class="text-sm text-gray-600" data-v-f28de938>Mots trait\xE9s</p></div></div><div class="stats-card" data-v-f28de938><div class="stats-icon bg-orange-100 text-orange-600" data-v-f28de938><svg class="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24" data-v-f28de938><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M10.325 4.317c.426-1.756 2.924-1.756 3.35 0a1.724 1.724 0 002.573 1.066c1.543-.94 3.31.826 2.37 2.37a1.724 1.724 0 001.065 2.572c1.756.426 1.756 2.924 0 3.35a1.724 1.724 0 00-1.066 2.573c.94 1.543-.826 3.31-2.37 2.37a1.724 1.724 0 00-2.572 1.065c-.426 1.756-2.924 1.756-3.35 0a1.724 1.724 0 00-2.573-1.066c-1.543.94-3.31-.826-2.37-2.37a1.724 1.724 0 00-1.065-2.572c-1.756-.426-1.756-2.924 0-3.35a1.724 1.724 0 001.066-2.573c-.94-1.543.826-3.31 2.37-2.37.996.608 2.296.07 2.572-1.065z" data-v-f28de938></path><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" data-v-f28de938></path></svg></div><div data-v-f28de938><p class="text-2xl font-bold text-gray-900" data-v-f28de938>${ssrInterpolate(Object.keys(unref(documentsByType)).length)}</p><p class="text-sm text-gray-600" data-v-f28de938>Types de sources</p></div></div></div><div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8" data-v-f28de938><div class="add-source-card" data-v-f28de938><div class="add-source-icon bg-blue-100" data-v-f28de938><svg class="w-8 h-8 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24" data-v-f28de938><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" data-v-f28de938></path></svg></div><h3 class="text-lg font-semibold text-gray-900" data-v-f28de938>Fichiers</h3><p class="text-sm text-gray-600" data-v-f28de938>PDF, Word, Excel, CSV</p><div class="mt-3 flex items-center text-blue-600 text-sm font-medium" data-v-f28de938> Importer <svg class="w-4 h-4 ml-1" fill="none" stroke="currentColor" viewBox="0 0 24 24" data-v-f28de938><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 5l7 7-7 7" data-v-f28de938></path></svg></div></div><div class="add-source-card" data-v-f28de938><div class="add-source-icon bg-green-100" data-v-f28de938><svg class="w-8 h-8 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24" data-v-f28de938><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M21 12a9 9 0 01-9 9m9-9a9 9 0 00-9-9m9 9H3m9 9v-9m0-9v9" data-v-f28de938></path></svg></div><h3 class="text-lg font-semibold text-gray-900" data-v-f28de938>Site Web</h3><p class="text-sm text-gray-600" data-v-f28de938>Pages, FAQ, blog</p><div class="mt-3 flex items-center text-green-600 text-sm font-medium" data-v-f28de938> Indexer <svg class="w-4 h-4 ml-1" fill="none" stroke="currentColor" viewBox="0 0 24 24" data-v-f28de938><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 5l7 7-7 7" data-v-f28de938></path></svg></div></div><div class="add-source-card" data-v-f28de938><div class="add-source-icon bg-purple-100" data-v-f28de938><svg class="w-8 h-8 text-purple-600" fill="none" stroke="currentColor" viewBox="0 0 24 24" data-v-f28de938><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" data-v-f28de938></path></svg></div><h3 class="text-lg font-semibold text-gray-900" data-v-f28de938>Texte libre</h3><p class="text-sm text-gray-600" data-v-f28de938>FAQ, infos produits</p><div class="mt-3 flex items-center text-purple-600 text-sm font-medium" data-v-f28de938> R\xE9diger <svg class="w-4 h-4 ml-1" fill="none" stroke="currentColor" viewBox="0 0 24 24" data-v-f28de938><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 5l7 7-7 7" data-v-f28de938></path></svg></div></div><div class="add-source-card disabled" data-v-f28de938><div class="add-source-icon bg-gray-100" data-v-f28de938><svg class="w-8 h-8 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24" data-v-f28de938><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M8.684 13.342C8.886 12.938 9 12.482 9 12c0-.482-.114-.938-.316-1.342m0 2.684a3 3 0 110-2.684m0 2.684l6.632 3.316m-6.632-6l6.632-3.316m0 0a3 3 0 105.367-2.684 3 3 0 00-5.367 2.684zm0 9.316a3 3 0 105.367 2.684 3 3 0 00-5.367-2.684z" data-v-f28de938></path></svg></div><h3 class="text-lg font-semibold text-gray-400" data-v-f28de938>API / CRM</h3><p class="text-sm text-gray-400" data-v-f28de938>Zendesk, Notion</p><div class="mt-3 flex items-center text-gray-400 text-sm" data-v-f28de938> Bient\xF4t disponible </div></div></div><div class="card-modern mb-6" data-v-f28de938><div class="flex flex-col lg:flex-row lg:items-center lg:justify-between space-y-4 lg:space-y-0" data-v-f28de938><div class="flex-1 max-w-lg" data-v-f28de938><div class="relative" data-v-f28de938><svg class="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24" data-v-f28de938><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" data-v-f28de938></path></svg><input${ssrRenderAttr("value", searchQuery.value)} type="text" placeholder="Rechercher dans la base de connaissances..." class="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-colors" data-v-f28de938></div></div><div class="flex items-center space-x-4" data-v-f28de938><select class="input-modern" data-v-f28de938><option value="" data-v-f28de938${ssrIncludeBooleanAttr(Array.isArray(selectedType.value) ? ssrLooseContain(selectedType.value, "") : ssrLooseEqual(selectedType.value, "")) ? " selected" : ""}>Tous les types</option><option value="file" data-v-f28de938${ssrIncludeBooleanAttr(Array.isArray(selectedType.value) ? ssrLooseContain(selectedType.value, "file") : ssrLooseEqual(selectedType.value, "file")) ? " selected" : ""}>Fichiers</option><option value="website" data-v-f28de938${ssrIncludeBooleanAttr(Array.isArray(selectedType.value) ? ssrLooseContain(selectedType.value, "website") : ssrLooseEqual(selectedType.value, "website")) ? " selected" : ""}>Sites web</option><option value="manual" data-v-f28de938${ssrIncludeBooleanAttr(Array.isArray(selectedType.value) ? ssrLooseContain(selectedType.value, "manual") : ssrLooseEqual(selectedType.value, "manual")) ? " selected" : ""}>Texte libre</option><option value="url" data-v-f28de938${ssrIncludeBooleanAttr(Array.isArray(selectedType.value) ? ssrLooseContain(selectedType.value, "url") : ssrLooseEqual(selectedType.value, "url")) ? " selected" : ""}>URLs</option></select><select class="input-modern" data-v-f28de938><option value="" data-v-f28de938${ssrIncludeBooleanAttr(Array.isArray(selectedStatus.value) ? ssrLooseContain(selectedStatus.value, "") : ssrLooseEqual(selectedStatus.value, "")) ? " selected" : ""}>Tous les statuts</option><option value="true" data-v-f28de938${ssrIncludeBooleanAttr(Array.isArray(selectedStatus.value) ? ssrLooseContain(selectedStatus.value, "true") : ssrLooseEqual(selectedStatus.value, "true")) ? " selected" : ""}>Actifs</option><option value="false" data-v-f28de938${ssrIncludeBooleanAttr(Array.isArray(selectedStatus.value) ? ssrLooseContain(selectedStatus.value, "false") : ssrLooseEqual(selectedStatus.value, "false")) ? " selected" : ""}>Inactifs</option></select></div></div></div><div class="card-modern" data-v-f28de938><div class="flex items-center justify-between p-6 border-b border-gray-200" data-v-f28de938><h2 class="text-lg font-semibold text-gray-900" data-v-f28de938> Sources de connaissances </h2><div class="flex items-center space-x-4" data-v-f28de938><span class="text-sm text-gray-500" data-v-f28de938>${ssrInterpolate(filteredDocuments.value.length)} source(s) </span><button${ssrIncludeBooleanAttr(unref(loading) || unref(saving)) ? " disabled" : ""} class="text-blue-600 hover:text-blue-700 text-sm font-medium disabled:opacity-50 transition-colors" data-v-f28de938>${ssrInterpolate(unref(loading) ? "Actualisation..." : "Actualiser")}</button></div></div>`);
      if (unref(loading)) {
        _push(`<div class="p-12" data-v-f28de938><div class="flex items-center justify-center" data-v-f28de938><div class="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600" data-v-f28de938></div><span class="ml-3 text-gray-600" data-v-f28de938>Chargement des connaissances...</span></div></div>`);
      } else if (filteredDocuments.value.length > 0) {
        _push(`<div class="divide-y divide-gray-200" data-v-f28de938><!--[-->`);
        ssrRenderList(filteredDocuments.value, (item) => {
          var _a2, _b2, _c2;
          _push(`<div class="p-6 hover:bg-gray-50 transition-colors" data-v-f28de938><div class="flex items-start justify-between" data-v-f28de938><div class="flex items-start space-x-4 flex-1" data-v-f28de938><div class="${ssrRenderClass([getTypeIconClass(item.contentType), "knowledge-type-icon"])}" data-v-f28de938><svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24" data-v-f28de938><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2"${ssrRenderAttr("d", getTypeIcon(item.contentType))} data-v-f28de938></path></svg></div><div class="flex-1 min-w-0" data-v-f28de938><div class="flex items-center space-x-3 mb-2" data-v-f28de938><h3 class="text-sm font-medium text-gray-900 truncate" data-v-f28de938>${ssrInterpolate(item.title)}</h3><span class="${ssrRenderClass([item.isActive ? "bg-green-100 text-green-800" : "bg-gray-100 text-gray-800", "status-badge"])}" data-v-f28de938>${ssrInterpolate(item.isActive ? "Actif" : "Inactif")}</span><span class="${ssrRenderClass([getTypeBadgeClass(item.contentType), "type-badge"])}" data-v-f28de938>${ssrInterpolate(getTypeLabel(item.contentType))}</span></div><p class="text-sm text-gray-600 line-clamp-2 mb-2" data-v-f28de938>${ssrInterpolate(item.content.substring(0, 150))}${ssrInterpolate(item.content.length > 150 ? "..." : "")}</p><div class="flex items-center text-xs text-gray-500 space-x-4" data-v-f28de938><span data-v-f28de938>Ajout\xE9 le ${ssrInterpolate(formatDate(item.createdAt))}</span>`);
          if ((_a2 = item.metadata) == null ? void 0 : _a2.fileSize) {
            _push(`<span data-v-f28de938>${ssrInterpolate(formatFileSize(item.metadata.fileSize))}</span>`);
          } else {
            _push(`<!---->`);
          }
          if ((_b2 = item.metadata) == null ? void 0 : _b2.wordCount) {
            _push(`<span data-v-f28de938>${ssrInterpolate(item.metadata.wordCount)} mots</span>`);
          } else {
            _push(`<!---->`);
          }
          if ((_c2 = item.linkedAgents) == null ? void 0 : _c2.length) {
            _push(`<span data-v-f28de938>Li\xE9 \xE0 ${ssrInterpolate(item.linkedAgents.length)} agent(s)</span>`);
          } else {
            _push(`<!---->`);
          }
          if (item.tags.length) {
            _push(`<span class="flex items-center" data-v-f28de938><svg class="w-3 h-3 mr-1" fill="none" stroke="currentColor" viewBox="0 0 24 24" data-v-f28de938><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M7 7h.01M7 3h5c.512 0 1.024.195 1.414.586l7 7a2 2 0 010 2.828l-7 7a2 2 0 01-2.828 0l-7-7A1.994 1.994 0 013 12V7a4 4 0 014-4z" data-v-f28de938></path></svg> ${ssrInterpolate(item.tags.slice(0, 2).join(", "))}${ssrInterpolate(item.tags.length > 2 ? "..." : "")}</span>`);
          } else {
            _push(`<!---->`);
          }
          _push(`</div></div></div><div class="flex items-center space-x-2 ml-4" data-v-f28de938><button${ssrIncludeBooleanAttr(unref(saving)) ? " disabled" : ""} class="${ssrRenderClass([item.isActive ? "text-orange-600 hover:text-orange-700 hover:bg-orange-50" : "text-green-600 hover:text-green-700 hover:bg-green-50", "action-button"])}"${ssrRenderAttr("title", item.isActive ? "D\xE9sactiver" : "Activer")} data-v-f28de938><svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24" data-v-f28de938>`);
          if (item.isActive) {
            _push(`<path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M18.364 18.364A9 9 0 005.636 5.636m12.728 12.728L5.636 5.636m12.728 12.728L18.364 5.636M5.636 18.364l12.728-12.728" data-v-f28de938></path>`);
          } else {
            _push(`<path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" data-v-f28de938></path>`);
          }
          _push(`</svg></button><button${ssrIncludeBooleanAttr(unref(saving)) ? " disabled" : ""} class="action-button text-blue-600 hover:text-blue-700 hover:bg-blue-50" title="Modifier" data-v-f28de938><svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24" data-v-f28de938><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" data-v-f28de938></path></svg></button><button${ssrIncludeBooleanAttr(unref(saving)) ? " disabled" : ""} class="action-button text-purple-600 hover:text-purple-700 hover:bg-purple-50" title="Voir d\xE9tails" data-v-f28de938><svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24" data-v-f28de938><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" data-v-f28de938></path><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" data-v-f28de938></path></svg></button><button${ssrIncludeBooleanAttr(unref(saving)) ? " disabled" : ""} class="action-button text-red-600 hover:text-red-700 hover:bg-red-50" title="Supprimer" data-v-f28de938><svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24" data-v-f28de938><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" data-v-f28de938></path></svg></button></div></div></div>`);
        });
        _push(`<!--]--></div>`);
      } else {
        _push(`<div class="text-center py-12" data-v-f28de938><div class="knowledge-empty-illustration" data-v-f28de938><svg class="mx-auto h-16 w-16 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24" data-v-f28de938><path stroke-linecap="round" stroke-linejoin="round" stroke-width="1" d="M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.746 0 3.332.477 4.5 1.253v13C19.832 18.477 18.246 18 16.5 18c-1.746 0-3.332.477-4.5 1.253" data-v-f28de938></path></svg></div><h3 class="mt-4 text-lg font-medium text-gray-900" data-v-f28de938>${ssrInterpolate(hasActiveFilters.value ? "Aucune connaissance trouv\xE9e" : "Commencez \xE0 entra\xEEner votre agent IA")}</h3><p class="mt-2 text-gray-500" data-v-f28de938>${ssrInterpolate(hasActiveFilters.value ? "Aucune connaissance ne correspond \xE0 vos crit\xE8res de recherche" : "Ajoutez vos premi\xE8res connaissances pour que votre Vendeur IA puisse r\xE9pondre aux questions de vos clients")}</p><div class="mt-6" data-v-f28de938>`);
        if (!hasActiveFilters.value) {
          _push(`<button class="inline-flex items-center px-6 py-3 border border-transparent text-base font-medium rounded-lg text-white bg-blue-600 hover:bg-blue-700 transition-colors" data-v-f28de938><svg class="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24" data-v-f28de938><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 6v6m0 0v6m0-6h6m-6 0H6" data-v-f28de938></path></svg> Ajouter votre premi\xE8re connaissance </button>`);
        } else {
          _push(`<button class="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-lg text-blue-600 bg-blue-100 hover:bg-blue-200 transition-colors" data-v-f28de938> Effacer les filtres </button>`);
        }
        _push(`</div></div>`);
      }
      _push(`</div></div>`);
      if (showBulkImportModal.value) {
        _push(`<div class="modal-overlay" data-v-f28de938><div class="modal-content modal-large" data-v-f28de938><div class="modal-header" data-v-f28de938><h3 class="modal-title" data-v-f28de938>Import en masse de fichiers</h3><button class="modal-close" data-v-f28de938><svg class="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24" data-v-f28de938><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12" data-v-f28de938></path></svg></button></div><div class="modal-body" data-v-f28de938><div class="bulk-upload-zone" data-v-f28de938><input type="file" multiple accept=".pdf,.doc,.docx,.csv,.txt,.xlsx" class="hidden" data-v-f28de938><svg class="w-16 h-16 text-gray-400 mx-auto mb-4" fill="none" stroke="currentColor" viewBox="0 0 24 24" data-v-f28de938><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M7 16a4 4 0 01-.88-7.903A5 5 0 1115.9 6L16 6a5 5 0 011 9.9M9 19l3 3m0 0l3-3m-3 3V10" data-v-f28de938></path></svg><p class="text-xl font-medium text-gray-900" data-v-f28de938>Glissez jusqu&#39;\xE0 10 fichiers ici</p><p class="text-sm text-gray-500 mt-1" data-v-f28de938>ou cliquez pour s\xE9lectionner</p><p class="text-xs text-gray-400 mt-2" data-v-f28de938>PDF, Word, Excel, CSV, TXT (max 10 MB par fichier)</p></div>`);
        if (bulkUploadQueue.value.length > 0) {
          _push(`<div class="mt-6" data-v-f28de938><div class="flex items-center justify-between mb-3" data-v-f28de938><h4 class="text-sm font-medium text-gray-900" data-v-f28de938>${ssrInterpolate(bulkUploadQueue.value.length)} fichier(s) s\xE9lectionn\xE9(s)</h4><button class="text-red-600 hover:text-red-700 text-sm" data-v-f28de938>Tout effacer</button></div><div class="space-y-2 max-h-64 overflow-y-auto" data-v-f28de938><!--[-->`);
          ssrRenderList(bulkUploadQueue.value, (file, index) => {
            _push(`<div class="flex items-center justify-between p-3 bg-gray-50 rounded-lg" data-v-f28de938><div class="flex items-center space-x-3" data-v-f28de938><div class="file-type-icon" data-v-f28de938>${ssrInterpolate(getFileTypeIcon(file.name))}</div><div data-v-f28de938><p class="text-sm font-medium text-gray-900" data-v-f28de938>${ssrInterpolate(file.name)}</p><p class="text-xs text-gray-500" data-v-f28de938>${ssrInterpolate(formatFileSize(file.size))}</p></div></div><button class="text-red-600 hover:text-red-700" data-v-f28de938><svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24" data-v-f28de938><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12" data-v-f28de938></path></svg></button></div>`);
          });
          _push(`<!--]--></div></div>`);
        } else {
          _push(`<!---->`);
        }
        _push(`</div><div class="modal-footer" data-v-f28de938><button class="btn-secondary" data-v-f28de938>Annuler</button><button${ssrIncludeBooleanAttr(bulkUploadQueue.value.length === 0 || unref(saving)) ? " disabled" : ""} class="btn-primary" data-v-f28de938>${ssrInterpolate(unref(saving) ? "Import en cours..." : `Importer ${bulkUploadQueue.value.length} fichier(s)`)}</button></div></div></div>`);
      } else {
        _push(`<!---->`);
      }
      if (showQuickAddModal.value) {
        _push(`<div class="modal-overlay" data-v-f28de938><div class="modal-content modal-large" data-v-f28de938><div class="modal-header" data-v-f28de938><h3 class="modal-title" data-v-f28de938>Ajouter des connaissances rapidement</h3><button class="modal-close" data-v-f28de938><svg class="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24" data-v-f28de938><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12" data-v-f28de938></path></svg></button></div><div class="modal-body" data-v-f28de938><div class="space-y-4" data-v-f28de938><div data-v-f28de938><label class="block text-sm font-medium text-gray-700 mb-2" data-v-f28de938>Titre de la connaissance</label><input${ssrRenderAttr("value", quickAddForm.value.title)} type="text" placeholder="Ex: FAQ Produits, Guide d&#39;utilisation, Conditions de livraison..." class="input-modern w-full" data-v-f28de938></div><div data-v-f28de938><label class="block text-sm font-medium text-gray-700 mb-2" data-v-f28de938>Type de contenu</label><select class="input-modern w-full" data-v-f28de938><option value="manual" data-v-f28de938${ssrIncludeBooleanAttr(Array.isArray(quickAddForm.value.type) ? ssrLooseContain(quickAddForm.value.type, "manual") : ssrLooseEqual(quickAddForm.value.type, "manual")) ? " selected" : ""}>Texte libre</option><option value="faq" data-v-f28de938${ssrIncludeBooleanAttr(Array.isArray(quickAddForm.value.type) ? ssrLooseContain(quickAddForm.value.type, "faq") : ssrLooseEqual(quickAddForm.value.type, "faq")) ? " selected" : ""}>FAQ</option><option value="policy" data-v-f28de938${ssrIncludeBooleanAttr(Array.isArray(quickAddForm.value.type) ? ssrLooseContain(quickAddForm.value.type, "policy") : ssrLooseEqual(quickAddForm.value.type, "policy")) ? " selected" : ""}>Politique/Conditions</option><option value="guide" data-v-f28de938${ssrIncludeBooleanAttr(Array.isArray(quickAddForm.value.type) ? ssrLooseContain(quickAddForm.value.type, "guide") : ssrLooseEqual(quickAddForm.value.type, "guide")) ? " selected" : ""}>Guide/Tutoriel</option><option value="product-info" data-v-f28de938${ssrIncludeBooleanAttr(Array.isArray(quickAddForm.value.type) ? ssrLooseContain(quickAddForm.value.type, "product-info") : ssrLooseEqual(quickAddForm.value.type, "product-info")) ? " selected" : ""}>Information produit</option></select></div><div data-v-f28de938><label class="block text-sm font-medium text-gray-700 mb-2" data-v-f28de938>Contenu</label><textarea rows="12" placeholder="Saisissez votre contenu ici...

Exemple pour une FAQ :
Q: Quels sont vos d\xE9lais de livraison ?
R: Nos d\xE9lais de livraison sont de 2-3 jours ouvrables en France m\xE9tropolitaine.

Q: Acceptez-vous les retours ?
R: Oui, vous pouvez retourner vos articles dans les 30 jours suivant la r\xE9ception.

Exemple pour des informations produit :
Notre produit X est con\xE7u pour r\xE9pondre aux besoins de performance et de durabilit\xE9. 
Caract\xE9ristiques principales :
- Mat\xE9riau haute qualit\xE9
- Garantie 2 ans
- Compatible avec tous les mod\xE8les Y et Z" class="input-modern w-full resize-none" data-v-f28de938>${ssrInterpolate(quickAddForm.value.content)}</textarea><p class="text-xs text-gray-500 mt-1" data-v-f28de938>${ssrInterpolate(quickAddForm.value.content.length)} caract\xE8res</p></div><div data-v-f28de938><label class="block text-sm font-medium text-gray-700 mb-2" data-v-f28de938>Tags (optionnel)</label><input${ssrRenderAttr("value", quickAddForm.value.tagsInput)} type="text" placeholder="Ex: faq, livraison, retour, garantie (s\xE9par\xE9s par des virgules)" class="input-modern w-full" data-v-f28de938><p class="text-xs text-gray-500 mt-1" data-v-f28de938>Utilisez des tags pour organiser vos connaissances</p></div></div></div><div class="modal-footer" data-v-f28de938><button class="btn-secondary" data-v-f28de938>Annuler</button><button${ssrIncludeBooleanAttr(!quickAddForm.value.title || !quickAddForm.value.content || unref(saving)) ? " disabled" : ""} class="btn-primary" data-v-f28de938>${ssrInterpolate(unref(saving) ? "Sauvegarde..." : "Ajouter la connaissance")}</button></div></div></div>`);
      } else {
        _push(`<!---->`);
      }
      if (showEditModal.value) {
        _push(`<div class="modal-overlay" data-v-f28de938><div class="modal-content modal-large" data-v-f28de938><div class="modal-header" data-v-f28de938><h3 class="modal-title" data-v-f28de938>${ssrInterpolate(editForm.value.contentType === "file" ? "Modifier les m\xE9tadonn\xE9es du fichier" : "Modifier le contenu")}</h3><button class="modal-close" data-v-f28de938><svg class="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24" data-v-f28de938><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12" data-v-f28de938></path></svg></button></div><div class="modal-body" data-v-f28de938><div class="space-y-4" data-v-f28de938><div data-v-f28de938><label class="block text-sm font-medium text-gray-700 mb-2" data-v-f28de938>Titre</label><input${ssrRenderAttr("value", editForm.value.title)} type="text" class="input-modern w-full" data-v-f28de938></div>`);
        if (editForm.value.contentType !== "file") {
          _push(`<div data-v-f28de938><label class="block text-sm font-medium text-gray-700 mb-2" data-v-f28de938>Contenu</label><textarea rows="12" class="input-modern w-full resize-none" data-v-f28de938>${ssrInterpolate(editForm.value.content)}</textarea><p class="text-xs text-gray-500 mt-1" data-v-f28de938>${ssrInterpolate(editForm.value.content.length)} caract\xE8res</p></div>`);
        } else {
          _push(`<div class="bg-yellow-50 border border-yellow-200 rounded-lg p-4" data-v-f28de938><div class="flex" data-v-f28de938><svg class="w-5 h-5 text-yellow-600 mt-0.5 mr-3" fill="none" stroke="currentColor" viewBox="0 0 24 24" data-v-f28de938><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" data-v-f28de938></path></svg><div data-v-f28de938><h4 class="text-sm font-medium text-yellow-800 mb-1" data-v-f28de938>Fichier import\xE9</h4><p class="text-sm text-yellow-700" data-v-f28de938> Le contenu de ce fichier a \xE9t\xE9 extrait automatiquement. Vous pouvez modifier le titre et les tags, mais pas le contenu source. </p><p class="text-xs text-yellow-600 mt-2" data-v-f28de938><strong data-v-f28de938>Fichier :</strong> ${ssrInterpolate(editForm.value.sourceFile || "Fichier inconnu")}</p></div></div></div>`);
        }
        _push(`<div data-v-f28de938><label class="block text-sm font-medium text-gray-700 mb-2" data-v-f28de938>Tags</label><input${ssrRenderAttr("value", editForm.value.tagsInput)} type="text" placeholder="S\xE9par\xE9s par des virgules" class="input-modern w-full" data-v-f28de938></div><div class="flex items-center" data-v-f28de938><input${ssrIncludeBooleanAttr(Array.isArray(editForm.value.isActive) ? ssrLooseContain(editForm.value.isActive, null) : editForm.value.isActive) ? " checked" : ""} type="checkbox" id="editActive" class="rounded border-gray-300 text-blue-600 focus:ring-blue-500" data-v-f28de938><label for="editActive" class="ml-2 text-sm text-gray-700" data-v-f28de938> Document actif (utilis\xE9 par le Vendeur IA) </label></div></div></div><div class="modal-footer" data-v-f28de938><button class="btn-secondary" data-v-f28de938>Annuler</button><button${ssrIncludeBooleanAttr(!editForm.value.title || unref(saving)) ? " disabled" : ""} class="btn-primary" data-v-f28de938>${ssrInterpolate(unref(saving) ? "Sauvegarde..." : "Sauvegarder les modifications")}</button></div></div></div>`);
      } else {
        _push(`<!---->`);
      }
      if (showViewModal.value) {
        _push(`<div class="modal-overlay" data-v-f28de938><div class="modal-content modal-large" data-v-f28de938><div class="modal-header" data-v-f28de938><h3 class="modal-title" data-v-f28de938>D\xE9tails du document</h3><button class="modal-close" data-v-f28de938><svg class="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24" data-v-f28de938><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12" data-v-f28de938></path></svg></button></div>`);
        if (currentViewDocument.value) {
          _push(`<div class="modal-body" data-v-f28de938><div class="space-y-6" data-v-f28de938><div class="flex items-start justify-between" data-v-f28de938><div data-v-f28de938><h4 class="text-lg font-semibold text-gray-900" data-v-f28de938>${ssrInterpolate(currentViewDocument.value.title)}</h4><div class="flex items-center space-x-3 mt-2" data-v-f28de938><span class="${ssrRenderClass([currentViewDocument.value.isActive ? "bg-green-100 text-green-800" : "bg-gray-100 text-gray-800", "status-badge"])}" data-v-f28de938>${ssrInterpolate(currentViewDocument.value.isActive ? "Actif" : "Inactif")}</span><span class="${ssrRenderClass([getTypeBadgeClass(currentViewDocument.value.contentType), "type-badge"])}" data-v-f28de938>${ssrInterpolate(getTypeLabel(currentViewDocument.value.contentType))}</span></div></div><button class="inline-flex items-center px-3 py-2 border border-gray-300 rounded-lg text-sm font-medium text-gray-700 bg-white hover:bg-gray-50 transition-colors" data-v-f28de938><svg class="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24" data-v-f28de938><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" data-v-f28de938></path></svg> Modifier </button></div><div class="grid grid-cols-2 gap-4 p-4 bg-gray-50 rounded-lg" data-v-f28de938><div data-v-f28de938><p class="text-xs text-gray-500 uppercase tracking-wide" data-v-f28de938>Cr\xE9\xE9 le</p><p class="text-sm font-medium text-gray-900" data-v-f28de938>${ssrInterpolate(formatDate(currentViewDocument.value.createdAt))}</p></div><div data-v-f28de938><p class="text-xs text-gray-500 uppercase tracking-wide" data-v-f28de938>Modifi\xE9 le</p><p class="text-sm font-medium text-gray-900" data-v-f28de938>${ssrInterpolate(formatDate(currentViewDocument.value.updatedAt))}</p></div>`);
          if ((_a = currentViewDocument.value.metadata) == null ? void 0 : _a.wordCount) {
            _push(`<div data-v-f28de938><p class="text-xs text-gray-500 uppercase tracking-wide" data-v-f28de938>Nombre de mots</p><p class="text-sm font-medium text-gray-900" data-v-f28de938>${ssrInterpolate(currentViewDocument.value.metadata.wordCount.toLocaleString())}</p></div>`);
          } else {
            _push(`<!---->`);
          }
          if ((_b = currentViewDocument.value.metadata) == null ? void 0 : _b.fileSize) {
            _push(`<div data-v-f28de938><p class="text-xs text-gray-500 uppercase tracking-wide" data-v-f28de938>Taille du fichier</p><p class="text-sm font-medium text-gray-900" data-v-f28de938>${ssrInterpolate(formatFileSize(currentViewDocument.value.metadata.fileSize))}</p></div>`);
          } else {
            _push(`<!---->`);
          }
          _push(`</div>`);
          if (currentViewDocument.value.sourceFile || currentViewDocument.value.sourceUrl) {
            _push(`<div class="p-4 bg-blue-50 rounded-lg" data-v-f28de938><h5 class="text-sm font-medium text-blue-900 mb-2" data-v-f28de938>Source</h5><p class="text-sm text-blue-800" data-v-f28de938>`);
            if (currentViewDocument.value.sourceFile) {
              _push(`<span data-v-f28de938>\u{1F4C4} ${ssrInterpolate(currentViewDocument.value.sourceFile)}</span>`);
            } else {
              _push(`<!---->`);
            }
            if (currentViewDocument.value.sourceUrl) {
              _push(`<span data-v-f28de938>\u{1F310} ${ssrInterpolate(currentViewDocument.value.sourceUrl)}</span>`);
            } else {
              _push(`<!---->`);
            }
            _push(`</p></div>`);
          } else {
            _push(`<!---->`);
          }
          if (currentViewDocument.value.tags.length) {
            _push(`<div class="space-y-2" data-v-f28de938><h5 class="text-sm font-medium text-gray-900" data-v-f28de938>Tags</h5><div class="flex flex-wrap gap-2" data-v-f28de938><!--[-->`);
            ssrRenderList(currentViewDocument.value.tags, (tag) => {
              _push(`<span class="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-blue-100 text-blue-800" data-v-f28de938>${ssrInterpolate(tag)}</span>`);
            });
            _push(`<!--]--></div></div>`);
          } else {
            _push(`<!---->`);
          }
          _push(`<div class="space-y-2" data-v-f28de938><h5 class="text-sm font-medium text-gray-900" data-v-f28de938>Contenu</h5><div class="max-h-96 overflow-y-auto p-4 bg-white border border-gray-200 rounded-lg" data-v-f28de938><p class="text-sm text-gray-700 whitespace-pre-wrap" data-v-f28de938>${ssrInterpolate(currentViewDocument.value.content)}</p></div></div></div></div>`);
        } else {
          _push(`<!---->`);
        }
        _push(`<div class="modal-footer" data-v-f28de938><button class="btn-secondary" data-v-f28de938>Fermer</button><button class="btn-primary" data-v-f28de938> Modifier ce document </button></div></div></div>`);
      } else {
        _push(`<!---->`);
      }
      if (showFileUpload.value) {
        _push(`<div class="modal-overlay" data-v-f28de938><div class="modal-content" data-v-f28de938><div class="modal-header" data-v-f28de938><h3 class="modal-title" data-v-f28de938>T\xE9l\xE9charger un fichier</h3><button class="modal-close" data-v-f28de938><svg class="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24" data-v-f28de938><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12" data-v-f28de938></path></svg></button></div><div class="modal-body" data-v-f28de938><div class="file-upload-zone" data-v-f28de938><input type="file" accept=".pdf,.doc,.docx,.csv,.txt,.xlsx" class="hidden" data-v-f28de938><svg class="w-12 h-12 text-gray-400 mx-auto mb-4" fill="none" stroke="currentColor" viewBox="0 0 24 24" data-v-f28de938><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M7 16a4 4 0 01-.88-7.903A5 5 0 1115.9 6L16 6a5 5 0 011 9.9M9 19l3 3m0 0l3-3m-3 3V10" data-v-f28de938></path></svg><p class="text-lg font-medium text-gray-900" data-v-f28de938>Glissez votre fichier ici</p><p class="text-sm text-gray-500 mt-1" data-v-f28de938>ou cliquez pour s\xE9lectionner</p><p class="text-xs text-gray-400 mt-2" data-v-f28de938>PDF, Word, Excel, CSV, TXT (max 10 MB)</p></div>`);
        if (selectedFile.value) {
          _push(`<div class="mt-4 p-3 bg-gray-50 rounded-lg flex items-center justify-between" data-v-f28de938><div class="flex items-center space-x-3" data-v-f28de938><div class="file-type-icon" data-v-f28de938>${ssrInterpolate(getFileTypeIcon(selectedFile.value.name))}</div><div data-v-f28de938><p class="text-sm font-medium text-gray-900" data-v-f28de938>${ssrInterpolate(selectedFile.value.name)}</p><p class="text-xs text-gray-500" data-v-f28de938>${ssrInterpolate(formatFileSize(selectedFile.value.size))}</p></div></div><button class="text-red-600 hover:text-red-700" data-v-f28de938><svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24" data-v-f28de938><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12" data-v-f28de938></path></svg></button></div>`);
        } else {
          _push(`<!---->`);
        }
        _push(`</div><div class="modal-footer" data-v-f28de938><button class="btn-secondary" data-v-f28de938>Annuler</button><button${ssrIncludeBooleanAttr(!selectedFile.value || unref(saving)) ? " disabled" : ""} class="btn-primary" data-v-f28de938>${ssrInterpolate(unref(saving) ? "Upload..." : "T\xE9l\xE9charger le fichier")}</button></div></div></div>`);
      } else {
        _push(`<!---->`);
      }
      if (showWebsiteModal.value) {
        _push(`<div class="modal-overlay" data-v-f28de938><div class="modal-content" data-v-f28de938><div class="modal-header" data-v-f28de938><h3 class="modal-title" data-v-f28de938>Indexer un site web</h3><button class="modal-close" data-v-f28de938><svg class="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24" data-v-f28de938><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12" data-v-f28de938></path></svg></button></div><div class="modal-body" data-v-f28de938><div class="space-y-4" data-v-f28de938><div data-v-f28de938><label class="block text-sm font-medium text-gray-700 mb-2" data-v-f28de938>URL du site web</label><input${ssrRenderAttr("value", websiteForm.value.url)} type="url" placeholder="https://votre-site.com" class="input-modern w-full" data-v-f28de938></div><div data-v-f28de938><label class="block text-sm font-medium text-gray-700 mb-2" data-v-f28de938>Nom (optionnel)</label><input${ssrRenderAttr("value", websiteForm.value.name)} type="text" placeholder="Site principal, FAQ, Blog..." class="input-modern w-full" data-v-f28de938></div><div data-v-f28de938><label class="block text-sm font-medium text-gray-700 mb-2" data-v-f28de938>Options d&#39;indexation</label><div class="space-y-2" data-v-f28de938><label class="flex items-center" data-v-f28de938><input${ssrIncludeBooleanAttr(Array.isArray(websiteForm.value.includeSubpages) ? ssrLooseContain(websiteForm.value.includeSubpages, null) : websiteForm.value.includeSubpages) ? " checked" : ""} type="checkbox" class="rounded" data-v-f28de938><span class="ml-2 text-sm text-gray-700" data-v-f28de938>Inclure les sous-pages</span></label><label class="flex items-center" data-v-f28de938><input${ssrIncludeBooleanAttr(Array.isArray(websiteForm.value.autoUpdate) ? ssrLooseContain(websiteForm.value.autoUpdate, null) : websiteForm.value.autoUpdate) ? " checked" : ""} type="checkbox" class="rounded" data-v-f28de938><span class="ml-2 text-sm text-gray-700" data-v-f28de938>Mise \xE0 jour automatique (quotidienne)</span></label></div></div></div></div><div class="modal-footer" data-v-f28de938><button class="btn-secondary" data-v-f28de938>Annuler</button><button${ssrIncludeBooleanAttr(!websiteForm.value.url || unref(saving)) ? " disabled" : ""} class="btn-primary" data-v-f28de938>${ssrInterpolate(unref(saving) ? "Indexation..." : "Indexer le site")}</button></div></div></div>`);
      } else {
        _push(`<!---->`);
      }
      if (showTextModal.value) {
        _push(`<div class="modal-overlay" data-v-f28de938><div class="modal-content modal-large" data-v-f28de938><div class="modal-header" data-v-f28de938><h3 class="modal-title" data-v-f28de938>Ajouter du contenu textuel</h3><button class="modal-close" data-v-f28de938><svg class="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24" data-v-f28de938><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12" data-v-f28de938></path></svg></button></div><div class="modal-body" data-v-f28de938><div class="space-y-4" data-v-f28de938><div data-v-f28de938><label class="block text-sm font-medium text-gray-700 mb-2" data-v-f28de938>Titre</label><input${ssrRenderAttr("value", textForm.value.title)} type="text" placeholder="FAQ Produits, Informations livraison..." class="input-modern w-full" data-v-f28de938></div><div data-v-f28de938><label class="block text-sm font-medium text-gray-700 mb-2" data-v-f28de938>Type de contenu</label><select class="input-modern w-full" data-v-f28de938><option value="manual" data-v-f28de938${ssrIncludeBooleanAttr(Array.isArray(textForm.value.type) ? ssrLooseContain(textForm.value.type, "manual") : ssrLooseEqual(textForm.value.type, "manual")) ? " selected" : ""}>Texte libre</option><option value="faq" data-v-f28de938${ssrIncludeBooleanAttr(Array.isArray(textForm.value.type) ? ssrLooseContain(textForm.value.type, "faq") : ssrLooseEqual(textForm.value.type, "faq")) ? " selected" : ""}>FAQ</option><option value="policy" data-v-f28de938${ssrIncludeBooleanAttr(Array.isArray(textForm.value.type) ? ssrLooseContain(textForm.value.type, "policy") : ssrLooseEqual(textForm.value.type, "policy")) ? " selected" : ""}>Politique</option><option value="guide" data-v-f28de938${ssrIncludeBooleanAttr(Array.isArray(textForm.value.type) ? ssrLooseContain(textForm.value.type, "guide") : ssrLooseEqual(textForm.value.type, "guide")) ? " selected" : ""}>Guide/Tutoriel</option><option value="product-info" data-v-f28de938${ssrIncludeBooleanAttr(Array.isArray(textForm.value.type) ? ssrLooseContain(textForm.value.type, "product-info") : ssrLooseEqual(textForm.value.type, "product-info")) ? " selected" : ""}>Info produit</option></select></div><div data-v-f28de938><label class="block text-sm font-medium text-gray-700 mb-2" data-v-f28de938>Contenu</label><textarea rows="10" placeholder="Saisissez votre contenu ici..." class="input-modern w-full" data-v-f28de938>${ssrInterpolate(textForm.value.content)}</textarea></div></div></div><div class="modal-footer" data-v-f28de938><button class="btn-secondary" data-v-f28de938>Annuler</button><button${ssrIncludeBooleanAttr(!textForm.value.title || !textForm.value.content || unref(saving)) ? " disabled" : ""} class="btn-primary" data-v-f28de938>${ssrInterpolate(unref(saving) ? "Sauvegarde..." : "Sauvegarder")}</button></div></div></div>`);
      } else {
        _push(`<!---->`);
      }
      if (showDeleteModal.value) {
        _push(`<div class="modal-overlay" data-v-f28de938><div class="modal-content" data-v-f28de938><div class="modal-header" data-v-f28de938><h3 class="text-lg font-semibold text-gray-900" data-v-f28de938>Confirmer la suppression</h3><button class="modal-close" data-v-f28de938><svg class="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24" data-v-f28de938><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12" data-v-f28de938></path></svg></button></div><div class="modal-body" data-v-f28de938><div class="text-center" data-v-f28de938><div class="w-16 h-16 bg-red-100 rounded-full flex items-center justify-center mx-auto mb-4" data-v-f28de938><svg class="w-8 h-8 text-red-600" fill="none" stroke="currentColor" viewBox="0 0 24 24" data-v-f28de938><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" data-v-f28de938></path></svg></div><h4 class="text-lg font-medium text-gray-900 mb-2" data-v-f28de938>\xCAtes-vous s\xFBr ?</h4><p class="text-gray-600 mb-4" data-v-f28de938> Vous \xEAtes sur le point de supprimer d\xE9finitivement le document : </p><p class="font-medium text-gray-900 mb-4" data-v-f28de938> &quot;${ssrInterpolate((_c = documentToDelete.value) == null ? void 0 : _c.title)}&quot; </p><div class="bg-red-50 border border-red-200 rounded-lg p-3 mb-4" data-v-f28de938><p class="text-sm text-red-800" data-v-f28de938> \u26A0\uFE0F Cette action est irr\xE9versible. Le document et son fichier associ\xE9 seront supprim\xE9s d\xE9finitivement. </p></div></div></div><div class="modal-footer" data-v-f28de938><button class="btn-secondary flex-1" data-v-f28de938> Annuler </button><button${ssrIncludeBooleanAttr(unref(saving)) ? " disabled" : ""} class="btn-danger flex-1" data-v-f28de938>${ssrInterpolate(unref(saving) ? "Suppression..." : "Supprimer d\xE9finitivement")}</button></div></div></div>`);
      } else {
        _push(`<!---->`);
      }
      if (showSuccessMessage.value) {
        _push(`<div class="fixed bottom-4 right-4 bg-green-600 text-white px-6 py-3 rounded-lg shadow-lg z-50 transform transition-all duration-300" data-v-f28de938><div class="flex items-center" data-v-f28de938><svg class="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24" data-v-f28de938><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M5 13l4 4L19 7" data-v-f28de938></path></svg> ${ssrInterpolate(successMessage.value)}</div></div>`);
      } else {
        _push(`<!---->`);
      }
      if (unref(error)) {
        _push(`<div class="fixed bottom-4 right-4 bg-red-600 text-white px-6 py-3 rounded-lg shadow-lg z-50 transform transition-all duration-300" data-v-f28de938><div class="flex items-center justify-between" data-v-f28de938><div class="flex items-center" data-v-f28de938><svg class="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24" data-v-f28de938><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" data-v-f28de938></path></svg> ${ssrInterpolate(unref(error))}</div><button class="ml-4 text-white hover:text-gray-200" data-v-f28de938><svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24" data-v-f28de938><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12" data-v-f28de938></path></svg></button></div></div>`);
      } else {
        _push(`<!---->`);
      }
      _push(`</div>`);
    };
  }
});
const _sfc_setup = _sfc_main.setup;
_sfc_main.setup = (props, ctx) => {
  const ssrContext = useSSRContext();
  (ssrContext.modules || (ssrContext.modules = /* @__PURE__ */ new Set())).add("pages/knowledge-base.vue");
  return _sfc_setup ? _sfc_setup(props, ctx) : void 0;
};
const knowledgeBase = /* @__PURE__ */ _export_sfc(_sfc_main, [["__scopeId", "data-v-f28de938"]]);

export { knowledgeBase as default };
//# sourceMappingURL=knowledge-base-DFlCFW0X.mjs.map
