import { ref, computed, readonly } from 'vue';
import { u as useAuthStore } from './auth-KgQDcdck.mjs';
import { c as useRuntimeConfig } from './server.mjs';

const useKnowledgeBase = () => {
  const authStore = useAuthStore();
  const config = useRuntimeConfig();
  const documents = ref([]);
  const loading = ref(false);
  const saving = ref(false);
  const error = ref(null);
  const uploadProgress = ref(0);
  const planDetails = computed(() => {
    try {
      return authStore.planDetails || {
        name: "free",
        knowledgeBaseLimit: 10,
        hasExpired: false
      };
    } catch (err) {
      console.warn("\u26A0\uFE0F Erreur planDetails, utilisation fallback:", err);
      return {
        name: "free",
        knowledgeBaseLimit: 10,
        hasExpired: false
      };
    }
  });
  const currentDocumentCount = computed(() => {
    var _a;
    return ((_a = documents.value) == null ? void 0 : _a.length) || 0;
  });
  const documentLimit = computed(() => {
    var _a;
    try {
      return ((_a = planDetails.value) == null ? void 0 : _a.knowledgeBaseLimit) || 10;
    } catch (err) {
      console.warn("\u26A0\uFE0F Erreur documentLimit, fallback:", err);
      return 10;
    }
  });
  const canUploadDocument = computed(() => {
    var _a;
    try {
      if ((_a = planDetails.value) == null ? void 0 : _a.hasExpired) {
        return false;
      }
      if (documentLimit.value === -1) {
        return true;
      }
      return currentDocumentCount.value < documentLimit.value;
    } catch (err) {
      console.warn("\u26A0\uFE0F Erreur canUploadDocument, fallback false:", err);
      return false;
    }
  });
  const documentsRemaining = computed(() => {
    try {
      if (documentLimit.value === -1) {
        return -1;
      }
      return Math.max(0, documentLimit.value - currentDocumentCount.value);
    } catch (err) {
      console.warn("\u26A0\uFE0F Erreur documentsRemaining, fallback 0:", err);
      return 0;
    }
  });
  const isLimitReached = computed(() => {
    try {
      return !canUploadDocument.value && documentLimit.value !== -1;
    } catch (err) {
      console.warn("\u26A0\uFE0F Erreur isLimitReached, fallback true:", err);
      return true;
    }
  });
  const activeDocuments = computed(() => {
    var _a;
    try {
      return ((_a = documents.value) == null ? void 0 : _a.filter((doc) => doc == null ? void 0 : doc.isActive)) || [];
    } catch (err) {
      console.warn("\u26A0\uFE0F Erreur activeDocuments:", err);
      return [];
    }
  });
  const documentsByType = computed(() => {
    var _a;
    try {
      return ((_a = documents.value) == null ? void 0 : _a.reduce((acc, doc) => {
        if (!acc[doc.contentType]) {
          acc[doc.contentType] = [];
        }
        acc[doc.contentType].push(doc);
        return acc;
      }, {})) || {};
    } catch (err) {
      console.warn("\u26A0\uFE0F Erreur documentsByType:", err);
      return {};
    }
  });
  const totalWordCount = computed(() => {
    var _a;
    try {
      return ((_a = documents.value) == null ? void 0 : _a.reduce((total, doc) => {
        var _a2;
        return total + (((_a2 = doc == null ? void 0 : doc.metadata) == null ? void 0 : _a2.wordCount) || 0);
      }, 0)) || 0;
    } catch (err) {
      console.warn("\u26A0\uFE0F Erreur totalWordCount:", err);
      return 0;
    }
  });
  const getAuthHeaders = () => {
    try {
      if (!authStore.token) {
        console.warn("\u26A0\uFE0F [useKnowledgeBase] Pas de token disponible");
        return {
          "Content-Type": "application/json"
        };
      }
      return {
        "Authorization": `Bearer ${authStore.token}`,
        "Content-Type": "application/json"
      };
    } catch (err) {
      console.error("\u274C [useKnowledgeBase] Erreur getAuthHeaders:", err);
      return {
        "Content-Type": "application/json"
      };
    }
  };
  const handleApiError = (err, defaultMessage) => {
    var _a, _b, _c;
    console.error("\u274C KB API Error:", err);
    let errorMessage = defaultMessage;
    try {
      if (((_a = err == null ? void 0 : err.data) == null ? void 0 : _a.error) && typeof err.data.error === "string") {
        errorMessage = err.data.error;
      } else if (((_c = (_b = err == null ? void 0 : err.response) == null ? void 0 : _b.data) == null ? void 0 : _c.error) && typeof err.response.data.error === "string") {
        errorMessage = err.response.data.error;
      } else if ((err == null ? void 0 : err.message) && typeof err.message === "string") {
        errorMessage = err.message;
      } else if ((err == null ? void 0 : err.statusText) && typeof err.statusText === "string") {
        errorMessage = `Erreur ${err.status || "API"}: ${err.statusText}`;
      }
    } catch (parseError) {
      console.warn("\u26A0\uFE0F Erreur parsing error message:", parseError);
    }
    error.value = errorMessage;
    return { success: false, error: errorMessage };
  };
  const checkLimitsBeforeAction = (action) => {
    var _a, _b;
    try {
      if ((_a = planDetails.value) == null ? void 0 : _a.hasExpired) {
        error.value = "\u274C Votre essai gratuit de 7 jours est termin\xE9. Passez au plan Starter pour ajouter des documents \xE0 votre base de connaissances.";
        return false;
      }
      if (action === "create" && !canUploadDocument.value) {
        const limitText = documentLimit.value === -1 ? "illimit\xE9e" : `${documentLimit.value} documents maximum`;
        error.value = `\u274C Limite de votre plan atteinte (${limitText}). Vous avez d\xE9j\xE0 ${currentDocumentCount.value} documents. Passez au plan sup\xE9rieur pour ajouter plus de documents.`;
        return false;
      }
      if (["update", "delete", "toggle"].includes(action) && ((_b = planDetails.value) == null ? void 0 : _b.hasExpired)) {
        error.value = "\u274C Votre essai gratuit est termin\xE9. Passez au plan Starter pour g\xE9rer vos documents.";
        return false;
      }
      return true;
    } catch (err) {
      console.error("\u274C Erreur checkLimitsBeforeAction:", err);
      error.value = "Erreur de v\xE9rification des limites";
      return false;
    }
  };
  const fetchDocuments = async () => {
    var _a, _b;
    loading.value = true;
    error.value = null;
    try {
      console.log("\u{1F50D} [useKnowledgeBase] R\xE9cup\xE9ration des documents via API...");
      if (!((_a = config == null ? void 0 : config.public) == null ? void 0 : _a.apiBaseUrl)) {
        throw new Error("Configuration API manquante");
      }
      const response = await $fetch("/api/v1/knowledge-base", {
        baseURL: config.public.apiBaseUrl,
        headers: getAuthHeaders(),
        timeout: 1e4
      });
      if (response.success && response.data) {
        const validDocuments = response.data.filter((doc) => doc && doc.id);
        documents.value = validDocuments;
        console.log(`\u2705 [useKnowledgeBase] ${validDocuments.length} documents r\xE9cup\xE9r\xE9s via API`);
        return { success: true, data: validDocuments };
      } else {
        throw new Error(response.error || "R\xE9ponse API invalide");
      }
    } catch (err) {
      console.error("\u274C [useKnowledgeBase] Erreur API:", err);
      const fallbackDocuments = [];
      try {
        if (!((_b = planDetails.value) == null ? void 0 : _b.hasExpired)) {
          const baseMockDocuments = [
            {
              id: "kb_demo_001",
              title: "Guide Produits (Mode D\xE9mo)",
              content: "Contenu de d\xE9monstration pour tester les fonctionnalit\xE9s de base de connaissances.",
              contentType: "manual",
              tags: ["demo", "test", "produits"],
              isActive: true,
              shopId: authStore.userShopId || "demo-shop",
              linkedAgents: [],
              createdAt: new Date(Date.now() - 2 * 24 * 60 * 60 * 1e3).toISOString(),
              updatedAt: (/* @__PURE__ */ new Date()).toISOString(),
              metadata: {
                wordCount: 25,
                lastProcessed: (/* @__PURE__ */ new Date()).toISOString()
              }
            }
          ];
          if (documentLimit.value !== -1) {
            fallbackDocuments.push(...baseMockDocuments.slice(0, documentLimit.value));
          } else {
            fallbackDocuments.push(...baseMockDocuments);
          }
        }
      } catch (fallbackError) {
        console.warn("\u26A0\uFE0F Erreur cr\xE9ation fallback:", fallbackError);
      }
      documents.value = fallbackDocuments;
      console.log(`\u26A0\uFE0F [useKnowledgeBase] Mode fallback: ${fallbackDocuments.length} documents`);
      return handleApiError(err, "Erreur lors de la r\xE9cup\xE9ration des documents");
    } finally {
      loading.value = false;
    }
  };
  const createDocument = async (data) => {
    var _a;
    saving.value = true;
    error.value = null;
    try {
      if (!data || !data.title || !data.content) {
        throw new Error("Donn\xE9es de document invalides");
      }
      if (!checkLimitsBeforeAction("create")) {
        return { success: false, error: error.value || "Limite atteinte" };
      }
      const response = await $fetch("/api/v1/knowledge-base", {
        method: "POST",
        baseURL: config.public.apiBaseUrl,
        headers: getAuthHeaders(),
        timeout: 15e3,
        body: {
          ...data,
          shopId: authStore.userShopId || "demo-shop",
          isActive: (_a = data.isActive) != null ? _a : true,
          tags: data.tags || []
        }
      });
      if (response.success && response.data) {
        documents.value.unshift(response.data);
        console.log(`\u2705 Document KB cr\xE9\xE9 via API: ${response.data.id}`);
        return { success: true, data: response.data };
      } else {
        throw new Error(response.error || "R\xE9ponse API invalide");
      }
    } catch (err) {
      return handleApiError(err, "Erreur lors de la cr\xE9ation du document");
    } finally {
      saving.value = false;
    }
  };
  const updateDocument = async (id, data) => {
    saving.value = true;
    error.value = null;
    try {
      console.log("\u{1F4DD} Modification du document KB via API:", id);
      if (!id || !data) {
        throw new Error("ID ou donn\xE9es manquants");
      }
      if (!checkLimitsBeforeAction("update")) {
        return { success: false, error: error.value || "Acc\xE8s limit\xE9" };
      }
      const response = await $fetch(`/api/v1/knowledge-base/${id}`, {
        method: "PUT",
        baseURL: config.public.apiBaseUrl,
        headers: getAuthHeaders(),
        timeout: 15e3,
        body: data
      });
      if (response.success) {
        if (response.data) {
          const index = documents.value.findIndex((doc) => (doc == null ? void 0 : doc.id) === id);
          if (index !== -1) {
            documents.value[index] = { ...documents.value[index], ...response.data };
          }
          console.log(`\u2705 Document KB modifi\xE9 via API: ${id}`);
          return { success: true, data: response.data };
        } else {
          throw new Error("Donn\xE9es de r\xE9ponse manquantes");
        }
      } else {
        throw new Error(response.error || "R\xE9ponse API invalide");
      }
    } catch (err) {
      return handleApiError(err, "Erreur lors de la modification du document");
    } finally {
      saving.value = false;
    }
  };
  const deleteDocument = async (id) => {
    saving.value = true;
    error.value = null;
    try {
      console.log("\u{1F5D1}\uFE0F Suppression du document KB via API:", id);
      if (!id) {
        throw new Error("ID document manquant");
      }
      if (!checkLimitsBeforeAction("delete")) {
        return { success: false, error: error.value || "Acc\xE8s limit\xE9" };
      }
      const response = await $fetch(`/api/v1/knowledge-base/${id}`, {
        method: "DELETE",
        baseURL: config.public.apiBaseUrl,
        headers: getAuthHeaders(),
        timeout: 1e4
      });
      if (response == null ? void 0 : response.success) {
        documents.value = documents.value.filter((doc) => (doc == null ? void 0 : doc.id) !== id);
        console.log(`\u2705 Document KB supprim\xE9 via API: ${id}`);
        console.log(`\u{1F4CA} Nouveau total: ${currentDocumentCount.value}/${documentLimit.value === -1 ? "\u221E" : documentLimit.value}`);
        return { success: true, data: null };
      } else {
        throw new Error("Erreur lors de la suppression");
      }
    } catch (err) {
      return handleApiError(err, "Erreur lors de la suppression du document");
    } finally {
      saving.value = false;
    }
  };
  const toggleDocumentStatus = async (id, isActive) => {
    var _a;
    saving.value = true;
    error.value = null;
    try {
      console.log(`\u{1F504} ${isActive ? "Activation" : "D\xE9sactivation"} du document KB via API:`, id);
      if (!id || typeof isActive !== "boolean") {
        throw new Error("Param\xE8tres invalides");
      }
      if (!checkLimitsBeforeAction("toggle")) {
        return { success: false, error: error.value || "Acc\xE8s limit\xE9" };
      }
      const response = await $fetch(`/api/v1/knowledge-base/${id}/toggle`, {
        method: "PATCH",
        baseURL: config.public.apiBaseUrl,
        headers: getAuthHeaders(),
        timeout: 1e4,
        body: { isActive }
      });
      if (response == null ? void 0 : response.success) {
        const index = documents.value.findIndex((doc) => (doc == null ? void 0 : doc.id) === id);
        if (index !== -1) {
          documents.value[index].isActive = isActive;
          documents.value[index].updatedAt = ((_a = response.data) == null ? void 0 : _a.updatedAt) || (/* @__PURE__ */ new Date()).toISOString();
        }
        console.log(`\u2705 Statut document KB modifi\xE9 via API: ${id} -> ${isActive ? "actif" : "inactif"}`);
        return { success: true, data: null };
      } else {
        throw new Error("Erreur lors de la modification du statut");
      }
    } catch (err) {
      return handleApiError(err, "Erreur lors de la modification du statut");
    } finally {
      saving.value = false;
    }
  };
  const searchDocuments = (query) => {
    try {
      if (!(query == null ? void 0 : query.trim())) return documents.value || [];
      const searchTerm = query.toLowerCase();
      return (documents.value || []).filter(
        (doc) => {
          var _a, _b, _c;
          return ((_a = doc == null ? void 0 : doc.title) == null ? void 0 : _a.toLowerCase().includes(searchTerm)) || ((_b = doc == null ? void 0 : doc.content) == null ? void 0 : _b.toLowerCase().includes(searchTerm)) || ((_c = doc == null ? void 0 : doc.tags) == null ? void 0 : _c.some((tag) => tag == null ? void 0 : tag.toLowerCase().includes(searchTerm)));
        }
      );
    } catch (err) {
      console.warn("\u26A0\uFE0F Erreur searchDocuments:", err);
      return [];
    }
  };
  const getDocumentsForAgent = (agentId) => {
    try {
      if (!agentId) return [];
      return (documents.value || []).filter(
        (doc) => {
          var _a;
          return (doc == null ? void 0 : doc.isActive) && ((_a = doc == null ? void 0 : doc.linkedAgents) == null ? void 0 : _a.includes(agentId));
        }
      );
    } catch (err) {
      console.warn("\u26A0\uFE0F Erreur getDocumentsForAgent:", err);
      return [];
    }
  };
  const getDocument = (id) => {
    try {
      if (!id) return null;
      return (documents.value || []).find((doc) => (doc == null ? void 0 : doc.id) === id) || null;
    } catch (err) {
      console.warn("\u26A0\uFE0F Erreur getDocument:", err);
      return null;
    }
  };
  const getContentTypeLabel = (type) => {
    try {
      const labels = {
        manual: "\u{1F4DD} Manuel",
        file: "\u{1F4C4} Fichier",
        url: "\u{1F517} URL",
        website: "\u{1F310} Site web"
      };
      return labels[type] || type || "Inconnu";
    } catch (err) {
      console.warn("\u26A0\uFE0F Erreur getContentTypeLabel:", err);
      return "Inconnu";
    }
  };
  const formatFileSize = (bytes) => {
    try {
      if (!bytes || bytes === 0) return "0 B";
      const k = 1024;
      const sizes = ["B", "KB", "MB", "GB"];
      const i = Math.floor(Math.log(bytes) / Math.log(k));
      return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + " " + sizes[i];
    } catch (err) {
      console.warn("\u26A0\uFE0F Erreur formatFileSize:", err);
      return "0 B";
    }
  };
  const uploadFile = async (file) => {
    var _a, _b, _c;
    saving.value = true;
    error.value = null;
    uploadProgress.value = 0;
    try {
      console.log("\u{1F4E4} Upload fichier KB:", file.name, file.type, file.size);
      const user = authStore.user;
      if (!user) {
        throw new Error("Utilisateur non connectifi\xE9");
      }
      if (!canUploadDocument.value) {
        const limit = documentLimit.value === -1 ? "illimit\xE9e" : `${documentLimit.value} documents maximum`;
        throw new Error(`Limite de votre plan atteinte (${limit}). Vous avez d\xE9j\xE0 ${currentDocumentCount.value} documents. Passez au plan sup\xE9rieur pour ajouter plus de documents.`);
      }
      const maxSize = ((_a = planDetails.value) == null ? void 0 : _a.fileSizeLimit) || 5 * 1024 * 1024;
      if (file.size > maxSize) {
        throw new Error(`Fichier trop volumineux. Taille maximum : ${Math.round(maxSize / 1024 / 1024)}MB`);
      }
      const allowedTypes = ["application/pdf", "application/msword", "application/vnd.openxmlformats-officedocument.wordprocessingml.document", "text/plain", "text/csv"];
      if (!allowedTypes.includes(file.type)) {
        throw new Error("Type de fichier non support\xE9. Formats accept\xE9s : PDF, DOC, DOCX, TXT, CSV");
      }
      const formData = new FormData();
      formData.append("file", file);
      formData.append("title", file.name);
      formData.append("contentType", "file");
      formData.append("tags", JSON.stringify(["fichier", "upload"]));
      const response = await $fetch("/api/v1/knowledge-base/upload", {
        baseURL: config.public.apiBaseUrl,
        method: "POST",
        headers: {
          "Authorization": `Bearer ${authStore.token}`
        },
        body: formData,
        onUploadProgress: (progress) => {
          uploadProgress.value = Math.round(progress.loaded / progress.total * 100);
        }
      });
      if (response.success) {
        documents.value.unshift(response.data);
        console.log(`\u2705 Fichier upload\xE9 avec succ\xE8s: ${response.data.id}`);
        return { success: true, data: response.data };
      } else {
        throw new Error(response.error || "Erreur lors de l'upload");
      }
    } catch (err) {
      console.error("\u274C Erreur upload fichier:", err);
      const errorMessage = ((_c = (_b = err.response) == null ? void 0 : _b.data) == null ? void 0 : _c.error) || err.message || "Erreur lors de l'upload du fichier";
      error.value = errorMessage;
      return { success: false, error: errorMessage };
    } finally {
      saving.value = false;
      uploadProgress.value = 0;
    }
  };
  const processWebsite = async (url, title, tags) => {
    var _a, _b;
    saving.value = true;
    error.value = null;
    try {
      console.log("\u{1F310} Traitement site web:", url);
      if (!url || !url.startsWith("http")) {
        throw new Error("URL invalide");
      }
      if (!canUploadDocument.value) {
        const limit = documentLimit.value === -1 ? "illimit\xE9e" : `${documentLimit.value} documents maximum`;
        throw new Error(`Limite de votre plan atteinte (${limit}). Vous avez d\xE9j\xE0 ${currentDocumentCount.value} documents. Passez au plan sup\xE9rieur pour ajouter plus de documents.`);
      }
      const response = await $fetch("/api/v1/knowledge-base/website", {
        baseURL: config.public.apiBaseUrl,
        method: "POST",
        headers: getAuthHeaders(),
        body: {
          url: url.trim(),
          title: title == null ? void 0 : title.trim(),
          tags: tags || ["website", "automatique"]
        }
      });
      if (response.success) {
        documents.value.unshift(response.data);
        console.log(`\u2705 Site web trait\xE9 avec succ\xE8s: ${response.data.id}`);
        return { success: true, data: response.data };
      } else {
        throw new Error(response.error || "Erreur lors du traitement du site web");
      }
    } catch (err) {
      console.error("\u274C Erreur traitement site web:", err);
      const errorMessage = ((_b = (_a = err.response) == null ? void 0 : _a.data) == null ? void 0 : _b.error) || err.message || "Erreur lors du traitement du site web";
      error.value = errorMessage;
      return { success: false, error: errorMessage };
    } finally {
      saving.value = false;
    }
  };
  const clearError = () => {
    error.value = null;
  };
  return {
    // State
    documents: readonly(documents),
    loading: readonly(loading),
    saving: readonly(saving),
    error: readonly(error),
    uploadProgress: readonly(uploadProgress),
    // ✅ COMPUTED POUR GESTION PLAN
    planDetails: readonly(planDetails),
    currentDocumentCount,
    documentLimit,
    canUploadDocument,
    documentsRemaining,
    isLimitReached,
    // Computed existants
    activeDocuments,
    documentsByType,
    totalWordCount,
    // Actions API pures
    fetchDocuments,
    createDocument,
    updateDocument,
    deleteDocument,
    toggleDocumentStatus,
    uploadFile,
    processWebsite,
    // Helpers
    searchDocuments,
    getDocumentsForAgent,
    getDocument,
    getContentTypeLabel,
    formatFileSize,
    clearError
  };
};

export { useKnowledgeBase as u };
//# sourceMappingURL=useKnowledgeBase-MXWw3CiM.mjs.map
