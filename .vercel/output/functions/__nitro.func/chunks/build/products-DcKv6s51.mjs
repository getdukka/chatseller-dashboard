import { defineComponent, ref, computed, mergeProps, unref, watch, useSSRContext } from 'vue';
import { ssrRenderAttrs, ssrInterpolate, ssrIncludeBooleanAttr, ssrRenderAttr, ssrLooseContain, ssrLooseEqual, ssrRenderList, ssrRenderClass, ssrRenderComponent, ssrRenderTeleport, ssrRenderStyle } from 'vue/server-renderer';
import { a as useApi } from './auth-KgQDcdck.mjs';
import { _ as _export_sfc } from './_plugin-vue_export-helper-1tPrXgE0.mjs';
import { u as useHead } from './server.mjs';
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

const useProducts = () => {
  const api = useApi();
  const products2 = ref([]);
  const stats = ref(null);
  const loading = ref(false);
  const saving = ref(false);
  const syncing = ref(false);
  const error = ref(null);
  const hasProducts = computed(() => products2.value.length > 0);
  const fetchProducts = async (filters = {}) => {
    loading.value = true;
    error.value = null;
    try {
      const response = await api.products.list(filters);
      if (response.success && response.data) {
        products2.value = response.data;
        return { success: true, data: response.data };
      } else {
        throw new Error(response.error || "Erreur lors du chargement des produits");
      }
    } catch (err) {
      error.value = err.message || "Erreur lors du chargement des produits";
      return { success: false, error: error.value };
    } finally {
      loading.value = false;
    }
  };
  const fetchStats = async () => {
    loading.value = true;
    error.value = null;
    try {
      if (products2.value.length > 0) {
        const total = products2.value.length;
        const active = products2.value.filter((p) => p.is_active).length;
        const inactive = total - active;
        const bySource = {
          manual: products2.value.filter((p) => p.source === "manual").length,
          shopify: products2.value.filter((p) => p.source === "shopify").length,
          woocommerce: products2.value.filter((p) => p.source === "woocommerce").length
        };
        const categoryCount = products2.value.reduce((acc, product) => {
          if (product.category) {
            acc[product.category] = (acc[product.category] || 0) + 1;
          }
          return acc;
        }, {});
        const categories = Object.entries(categoryCount).map(([name, count]) => ({
          name,
          count
        }));
        stats.value = {
          total,
          active,
          inactive,
          bySource,
          categories
        };
      } else {
        stats.value = {
          total: 0,
          active: 0,
          inactive: 0,
          bySource: { manual: 0, shopify: 0, woocommerce: 0 },
          categories: []
        };
      }
      return { success: true, data: stats.value };
    } catch (err) {
      error.value = err.message || "Erreur lors du calcul des statistiques";
      return { success: false, error: error.value };
    } finally {
      loading.value = false;
    }
  };
  const createProduct = async (data) => {
    saving.value = true;
    error.value = null;
    try {
      const response = await api.products.create(data);
      if (response.success && response.data) {
        products2.value.unshift(response.data);
        await fetchStats();
        return { success: true, data: response.data };
      } else {
        throw new Error(response.error || "Erreur lors de la cr\xE9ation du produit");
      }
    } catch (err) {
      error.value = err.message || "Erreur lors de la cr\xE9ation du produit";
      return { success: false, error: error.value };
    } finally {
      saving.value = false;
    }
  };
  const updateProduct = async (id, data) => {
    saving.value = true;
    error.value = null;
    try {
      const response = await api.products.update(id, data);
      if (response.success && response.data) {
        const index = products2.value.findIndex((p) => p.id === id);
        if (index !== -1) {
          products2.value[index] = response.data;
        }
        await fetchStats();
        return { success: true, data: response.data };
      } else {
        throw new Error(response.error || "Erreur lors de la modification du produit");
      }
    } catch (err) {
      error.value = err.message || "Erreur lors de la modification du produit";
      return { success: false, error: error.value };
    } finally {
      saving.value = false;
    }
  };
  const deleteProduct = async (id) => {
    saving.value = true;
    error.value = null;
    try {
      const response = await api.products.delete(id);
      if (response.success) {
        products2.value = products2.value.filter((p) => p.id !== id);
        await fetchStats();
        return { success: true, message: "Produit supprim\xE9" };
      } else {
        throw new Error(response.error || "Erreur lors de la suppression du produit");
      }
    } catch (err) {
      error.value = err.message || "Erreur lors de la suppression du produit";
      return { success: false, error: error.value };
    } finally {
      saving.value = false;
    }
  };
  const duplicateProduct = async (id) => {
    const sourceProduct = products2.value.find((p) => p.id === id);
    if (!sourceProduct) {
      error.value = "Produit source non trouv\xE9";
      return { success: false, error: error.value };
    }
    const duplicateData = {
      name: `${sourceProduct.name} (Copie)`,
      description: sourceProduct.description,
      price: sourceProduct.price,
      compare_at_price: sourceProduct.compare_at_price,
      category: sourceProduct.category,
      sku: sourceProduct.sku ? `${sourceProduct.sku}-COPY` : void 0,
      featured_image: sourceProduct.featured_image,
      images: sourceProduct.images || [],
      inventory_quantity: sourceProduct.inventory_quantity,
      track_inventory: sourceProduct.track_inventory,
      is_active: false
      // Créer en mode inactif par défaut
    };
    return await createProduct(duplicateData);
  };
  const syncProducts = async (source, credentials) => {
    syncing.value = true;
    error.value = null;
    try {
      console.log(`\u{1F504} Synchronisation ${source} avec:`, credentials);
      await new Promise((resolve) => setTimeout(resolve, 2e3));
      const mockProducts = [
        {
          id: `sync-${Date.now()}-1`,
          name: `Produit ${source} 1`,
          description: `Produit synchronis\xE9 depuis ${source}`,
          price: 29.99,
          category: "Synchronis\xE9",
          source,
          featured_image: "https://via.placeholder.com/300x300",
          images: ["https://via.placeholder.com/300x300"],
          inventory_quantity: 100,
          track_inventory: true,
          is_active: true,
          created_at: (/* @__PURE__ */ new Date()).toISOString(),
          updated_at: (/* @__PURE__ */ new Date()).toISOString()
        },
        {
          id: `sync-${Date.now()}-2`,
          name: `Produit ${source} 2`,
          description: `Autre produit synchronis\xE9 depuis ${source}`,
          price: 49.99,
          category: "Synchronis\xE9",
          source,
          featured_image: "https://via.placeholder.com/300x300",
          images: ["https://via.placeholder.com/300x300"],
          inventory_quantity: 50,
          track_inventory: true,
          is_active: true,
          created_at: (/* @__PURE__ */ new Date()).toISOString(),
          updated_at: (/* @__PURE__ */ new Date()).toISOString()
        }
      ];
      products2.value.push(...mockProducts);
      await fetchStats();
      return {
        success: true,
        message: `${mockProducts.length} produits synchronis\xE9s depuis ${source}`,
        data: mockProducts
      };
    } catch (err) {
      error.value = err.message || "Erreur lors de la synchronisation";
      return { success: false, error: error.value };
    } finally {
      syncing.value = false;
    }
  };
  const clearError = () => {
    error.value = null;
  };
  const formatPrice = (price) => {
    return new Intl.NumberFormat("fr-FR", {
      style: "currency",
      currency: "EUR"
    }).format(price);
  };
  const getSourceLabel = (source) => {
    const labels = {
      manual: "Manuel",
      shopify: "Shopify",
      woocommerce: "WooCommerce"
    };
    return labels[source] || source;
  };
  const getSourceBadgeClass = (source) => {
    const classes = {
      manual: "bg-purple-100 text-purple-800",
      shopify: "bg-green-100 text-green-800",
      woocommerce: "bg-blue-100 text-blue-800"
    };
    return classes[source] || "bg-gray-100 text-gray-800";
  };
  return {
    // State
    products: products2,
    stats,
    loading,
    saving,
    syncing,
    error,
    // Computed
    hasProducts,
    // Actions
    fetchProducts,
    fetchStats,
    createProduct,
    updateProduct,
    deleteProduct,
    duplicateProduct,
    syncProducts,
    clearError,
    // Utilities
    formatPrice,
    getSourceLabel,
    getSourceBadgeClass
  };
};
const _sfc_main$5 = /* @__PURE__ */ defineComponent({
  __name: "ProductFormModal",
  __ssrInlineRender: true,
  props: {
    product: {}
  },
  emits: ["close", "success"],
  setup(__props, { emit: __emit }) {
    const props = __props;
    useProducts();
    const submitting = ref(false);
    const newTag = ref("");
    const form = ref({
      name: "",
      description: "",
      price: 0,
      compareAtPrice: null,
      sku: "",
      category: "",
      tags: [],
      features: [""],
      featuredImage: "",
      images: [],
      weight: null,
      inventoryQuantity: 0,
      trackInventory: false,
      isActive: true,
      isVisible: true,
      availableForSale: true
    });
    const errors = ref({
      name: "",
      price: ""
    });
    ref();
    ref();
    const categories = [
      "\xC9lectronique",
      "V\xEAtements",
      "Maison & Jardin",
      "Sports & Loisirs",
      "Beaut\xE9 & Sant\xE9",
      "Livres",
      "Jouets",
      "Autres"
    ];
    const isFormValid = computed(() => {
      return form.value.name.trim() !== "" && form.value.price > 0 && !errors.value.name && !errors.value.price;
    });
    const initForm = () => {
      if (props.product) {
        form.value = {
          name: props.product.name || "",
          description: props.product.description || "",
          price: props.product.price || 0,
          compareAtPrice: props.product.compareAtPrice || null,
          sku: props.product.sku || "",
          category: props.product.category || "",
          tags: [...props.product.tags || []],
          features: [...props.product.features || [""]],
          featuredImage: props.product.featuredImage || "",
          images: [...props.product.images || []],
          weight: props.product.weight || null,
          inventoryQuantity: props.product.inventoryQuantity || 0,
          trackInventory: props.product.trackInventory || false,
          isActive: props.product.isActive !== false,
          isVisible: props.product.isVisible !== false,
          availableForSale: props.product.availableForSale !== false
        };
      } else {
        form.value = {
          name: "",
          description: "",
          price: 0,
          compareAtPrice: null,
          sku: "",
          category: "",
          tags: [],
          features: [""],
          featuredImage: "",
          images: [],
          weight: null,
          inventoryQuantity: 0,
          trackInventory: false,
          isActive: true,
          isVisible: true,
          availableForSale: true
        };
      }
    };
    watch(() => props.product, () => {
      initForm();
    });
    return (_ctx, _push, _parent, _attrs) => {
      _push(`<div${ssrRenderAttrs(mergeProps({ class: "modal-overlay" }, _attrs))} data-v-0f4de09b><div class="modal-content modal-large" data-v-0f4de09b><div class="modal-header" data-v-0f4de09b><h3 class="modal-title" data-v-0f4de09b>${ssrInterpolate(_ctx.product ? "Modifier le produit" : "Ajouter un produit")}</h3><button class="modal-close" data-v-0f4de09b><svg class="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24" data-v-0f4de09b><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12" data-v-0f4de09b></path></svg></button></div><div class="modal-body max-h-[70vh] overflow-y-auto" data-v-0f4de09b><div class="grid grid-cols-1 md:grid-cols-2 gap-6" data-v-0f4de09b><div class="space-y-4" data-v-0f4de09b><div data-v-0f4de09b><label class="block text-sm font-medium text-gray-700 mb-2" data-v-0f4de09b> Nom du produit * </label><input${ssrRenderAttr("value", form.value.name)} type="text" class="${ssrRenderClass([{ "border-red-500": errors.value.name }, "input-modern w-full"])}" placeholder="Nom de votre produit" data-v-0f4de09b>`);
      if (errors.value.name) {
        _push(`<p class="text-red-500 text-xs mt-1" data-v-0f4de09b>${ssrInterpolate(errors.value.name)}</p>`);
      } else {
        _push(`<!---->`);
      }
      _push(`</div><div data-v-0f4de09b><label class="block text-sm font-medium text-gray-700 mb-2" data-v-0f4de09b> Description </label><textarea rows="4" class="input-modern w-full" placeholder="Description d\xE9taill\xE9e de votre produit" data-v-0f4de09b>${ssrInterpolate(form.value.description)}</textarea></div><div class="grid grid-cols-2 gap-4" data-v-0f4de09b><div data-v-0f4de09b><label class="block text-sm font-medium text-gray-700 mb-2" data-v-0f4de09b> Prix (\u20AC) * </label><input${ssrRenderAttr("value", form.value.price)} type="number" step="0.01" min="0" class="${ssrRenderClass([{ "border-red-500": errors.value.price }, "input-modern w-full"])}" placeholder="0.00" data-v-0f4de09b>`);
      if (errors.value.price) {
        _push(`<p class="text-red-500 text-xs mt-1" data-v-0f4de09b>${ssrInterpolate(errors.value.price)}</p>`);
      } else {
        _push(`<!---->`);
      }
      _push(`</div><div data-v-0f4de09b><label class="block text-sm font-medium text-gray-700 mb-2" data-v-0f4de09b> Prix barr\xE9 (\u20AC) </label><input${ssrRenderAttr("value", form.value.compareAtPrice)} type="number" step="0.01" min="0" class="input-modern w-full" placeholder="0.00" data-v-0f4de09b></div></div><div class="grid grid-cols-2 gap-4" data-v-0f4de09b><div data-v-0f4de09b><label class="block text-sm font-medium text-gray-700 mb-2" data-v-0f4de09b> Cat\xE9gorie </label><select class="input-modern w-full" data-v-0f4de09b><option value="" data-v-0f4de09b${ssrIncludeBooleanAttr(Array.isArray(form.value.category) ? ssrLooseContain(form.value.category, "") : ssrLooseEqual(form.value.category, "")) ? " selected" : ""}>S\xE9lectionner une cat\xE9gorie</option><!--[-->`);
      ssrRenderList(categories, (category) => {
        _push(`<option${ssrRenderAttr("value", category)} data-v-0f4de09b${ssrIncludeBooleanAttr(Array.isArray(form.value.category) ? ssrLooseContain(form.value.category, category) : ssrLooseEqual(form.value.category, category)) ? " selected" : ""}>${ssrInterpolate(category)}</option>`);
      });
      _push(`<!--]--></select></div><div data-v-0f4de09b><label class="block text-sm font-medium text-gray-700 mb-2" data-v-0f4de09b> SKU / R\xE9f\xE9rence </label><input${ssrRenderAttr("value", form.value.sku)} type="text" class="input-modern w-full" placeholder="SKU-001" data-v-0f4de09b></div></div><div data-v-0f4de09b><label class="block text-sm font-medium text-gray-700 mb-2" data-v-0f4de09b> Poids (grammes) </label><input${ssrRenderAttr("value", form.value.weight)} type="number" min="0" class="input-modern w-full" placeholder="0" data-v-0f4de09b></div><div data-v-0f4de09b><label class="block text-sm font-medium text-gray-700 mb-2" data-v-0f4de09b> Tags </label><div class="space-y-2" data-v-0f4de09b><div class="flex flex-wrap gap-2 mb-2" data-v-0f4de09b><!--[-->`);
      ssrRenderList(form.value.tags, (tag, index) => {
        _push(`<span class="inline-flex items-center px-2 py-1 bg-blue-100 text-blue-800 text-xs rounded-full" data-v-0f4de09b>${ssrInterpolate(tag)} <button class="ml-1 text-blue-600 hover:text-blue-800" data-v-0f4de09b><svg class="w-3 h-3" fill="none" stroke="currentColor" viewBox="0 0 24 24" data-v-0f4de09b><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12" data-v-0f4de09b></path></svg></button></span>`);
      });
      _push(`<!--]--></div><div class="flex" data-v-0f4de09b><input${ssrRenderAttr("value", newTag.value)} type="text" class="input-modern flex-1" placeholder="Ajouter un tag" data-v-0f4de09b><button type="button" class="ml-2 px-3 py-2 bg-blue-600 text-white text-xs rounded-lg hover:bg-blue-700" data-v-0f4de09b> Ajouter </button></div></div></div></div><div class="space-y-4" data-v-0f4de09b><div data-v-0f4de09b><label class="block text-sm font-medium text-gray-700 mb-2" data-v-0f4de09b> Image principale </label><div class="image-upload-zone" data-v-0f4de09b><input type="file" accept="image/*" class="hidden" data-v-0f4de09b>`);
      if (form.value.featuredImage) {
        _push(`<div class="aspect-square bg-gray-100 rounded-lg overflow-hidden relative" data-v-0f4de09b><img${ssrRenderAttr("src", form.value.featuredImage)} alt="Aper\xE7u" class="w-full h-full object-cover" data-v-0f4de09b><button class="absolute top-2 right-2 p-1 bg-red-500 text-white rounded-full hover:bg-red-600" data-v-0f4de09b><svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24" data-v-0f4de09b><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12" data-v-0f4de09b></path></svg></button></div>`);
      } else {
        _push(`<div class="aspect-square border-2 border-dashed border-gray-300 rounded-lg flex items-center justify-center cursor-pointer hover:border-blue-400 hover:bg-blue-50 transition-colors" data-v-0f4de09b><div class="text-center" data-v-0f4de09b><svg class="mx-auto h-12 w-12 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24" data-v-0f4de09b><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" data-v-0f4de09b></path></svg><p class="text-sm text-gray-500 mt-2" data-v-0f4de09b>Cliquer pour ajouter une image</p><p class="text-xs text-gray-400" data-v-0f4de09b>PNG, JPG jusqu&#39;\xE0 10MB</p></div></div>`);
      }
      _push(`</div></div><div data-v-0f4de09b><label class="block text-sm font-medium text-gray-700 mb-2" data-v-0f4de09b> Images suppl\xE9mentaires </label><div class="grid grid-cols-3 gap-2" data-v-0f4de09b><!--[-->`);
      ssrRenderList(form.value.images, (image, index) => {
        _push(`<div class="aspect-square bg-gray-100 rounded-lg overflow-hidden relative" data-v-0f4de09b><img${ssrRenderAttr("src", image)} alt="Image" class="w-full h-full object-cover" data-v-0f4de09b><button class="absolute top-1 right-1 p-1 bg-red-500 text-white rounded-full hover:bg-red-600" data-v-0f4de09b><svg class="w-3 h-3" fill="none" stroke="currentColor" viewBox="0 0 24 24" data-v-0f4de09b><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12" data-v-0f4de09b></path></svg></button></div>`);
      });
      _push(`<!--]-->`);
      if (form.value.images.length < 5) {
        _push(`<div class="aspect-square border-2 border-dashed border-gray-300 rounded-lg flex items-center justify-center cursor-pointer hover:border-blue-400 hover:bg-blue-50 transition-colors" data-v-0f4de09b><svg class="w-8 h-8 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24" data-v-0f4de09b><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 6v6m0 0v6m0-6h6m-6 0H6" data-v-0f4de09b></path></svg></div>`);
      } else {
        _push(`<!---->`);
      }
      _push(`</div><input type="file" accept="image/*" multiple class="hidden" data-v-0f4de09b></div><div data-v-0f4de09b><label class="block text-sm font-medium text-gray-700 mb-2" data-v-0f4de09b> Caract\xE9ristiques cl\xE9s </label><div class="space-y-2" data-v-0f4de09b><!--[-->`);
      ssrRenderList(form.value.features, (feature, index) => {
        _push(`<div class="flex items-center space-x-2" data-v-0f4de09b><input${ssrRenderAttr("value", form.value.features[index])} type="text" class="input-modern flex-1" placeholder="Caract\xE9ristique" data-v-0f4de09b><button class="text-red-600 hover:text-red-700" data-v-0f4de09b><svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24" data-v-0f4de09b><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12" data-v-0f4de09b></path></svg></button></div>`);
      });
      _push(`<!--]--><button type="button" class="text-blue-600 hover:text-blue-700 text-sm font-medium" data-v-0f4de09b> + Ajouter une caract\xE9ristique </button></div></div><div class="space-y-3" data-v-0f4de09b><h4 class="text-sm font-medium text-gray-900" data-v-0f4de09b>Inventaire</h4><div class="flex items-center space-x-3" data-v-0f4de09b><input${ssrIncludeBooleanAttr(Array.isArray(form.value.trackInventory) ? ssrLooseContain(form.value.trackInventory, null) : form.value.trackInventory) ? " checked" : ""} type="checkbox" id="trackInventory" class="rounded border-gray-300 text-blue-600 focus:ring-blue-500" data-v-0f4de09b><label for="trackInventory" class="text-sm text-gray-700" data-v-0f4de09b> Suivre la quantit\xE9 en stock </label></div>`);
      if (form.value.trackInventory) {
        _push(`<div data-v-0f4de09b><label class="block text-sm font-medium text-gray-700 mb-2" data-v-0f4de09b> Quantit\xE9 en stock </label><input${ssrRenderAttr("value", form.value.inventoryQuantity)} type="number" min="0" class="input-modern w-full" placeholder="0" data-v-0f4de09b></div>`);
      } else {
        _push(`<!---->`);
      }
      _push(`</div><div class="space-y-3" data-v-0f4de09b><h4 class="text-sm font-medium text-gray-900" data-v-0f4de09b>Statut</h4><div class="space-y-2" data-v-0f4de09b><div class="flex items-center space-x-3" data-v-0f4de09b><input${ssrIncludeBooleanAttr(Array.isArray(form.value.isActive) ? ssrLooseContain(form.value.isActive, null) : form.value.isActive) ? " checked" : ""} type="checkbox" id="isActive" class="rounded border-gray-300 text-blue-600 focus:ring-blue-500" data-v-0f4de09b><label for="isActive" class="text-sm text-gray-700" data-v-0f4de09b> Produit actif </label></div><div class="flex items-center space-x-3" data-v-0f4de09b><input${ssrIncludeBooleanAttr(Array.isArray(form.value.isVisible) ? ssrLooseContain(form.value.isVisible, null) : form.value.isVisible) ? " checked" : ""} type="checkbox" id="isVisible" class="rounded border-gray-300 text-blue-600 focus:ring-blue-500" data-v-0f4de09b><label for="isVisible" class="text-sm text-gray-700" data-v-0f4de09b> Visible dans le catalogue </label></div><div class="flex items-center space-x-3" data-v-0f4de09b><input${ssrIncludeBooleanAttr(Array.isArray(form.value.availableForSale) ? ssrLooseContain(form.value.availableForSale, null) : form.value.availableForSale) ? " checked" : ""} type="checkbox" id="availableForSale" class="rounded border-gray-300 text-blue-600 focus:ring-blue-500" data-v-0f4de09b><label for="availableForSale" class="text-sm text-gray-700" data-v-0f4de09b> Disponible \xE0 la vente </label></div></div></div></div></div></div><div class="modal-footer" data-v-0f4de09b><button class="btn-secondary" data-v-0f4de09b> Annuler </button><button${ssrIncludeBooleanAttr(!isFormValid.value || submitting.value) ? " disabled" : ""} class="btn-primary" data-v-0f4de09b>${ssrInterpolate(submitting.value ? "Sauvegarde..." : _ctx.product ? "Mettre \xE0 jour" : "Cr\xE9er")} le produit </button></div></div></div>`);
    };
  }
});
const _sfc_setup$5 = _sfc_main$5.setup;
_sfc_main$5.setup = (props, ctx) => {
  const ssrContext = useSSRContext();
  (ssrContext.modules || (ssrContext.modules = /* @__PURE__ */ new Set())).add("components/ProductFormModal.vue");
  return _sfc_setup$5 ? _sfc_setup$5(props, ctx) : void 0;
};
const ProductFormModal = /* @__PURE__ */ _export_sfc(_sfc_main$5, [["__scopeId", "data-v-0f4de09b"]]);
const _sfc_main$4 = /* @__PURE__ */ defineComponent({
  __name: "ConnectionModal",
  __ssrInlineRender: true,
  emits: ["close", "connect-shopify", "connect-woocommerce"],
  setup(__props, { emit: __emit }) {
    return (_ctx, _push, _parent, _attrs) => {
      _push(`<div${ssrRenderAttrs(mergeProps({ class: "modal-overlay" }, _attrs))} data-v-7e5717a2><div class="modal-content" data-v-7e5717a2><div class="modal-header" data-v-7e5717a2><h3 class="modal-title" data-v-7e5717a2>Connecter une boutique</h3><button class="modal-close" data-v-7e5717a2><svg class="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24" data-v-7e5717a2><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12" data-v-7e5717a2></path></svg></button></div><div class="modal-body" data-v-7e5717a2><div class="space-y-4" data-v-7e5717a2><div class="connection-option" data-v-7e5717a2><div class="flex items-center space-x-4" data-v-7e5717a2><div class="p-3 bg-green-100 rounded-lg" data-v-7e5717a2><svg class="w-8 h-8 text-green-600" fill="currentColor" viewBox="0 0 24 24" data-v-7e5717a2><path d="M15.337 2.543c-.161-.026-.322-.04-.483-.04-2.688 0-4.516 1.859-4.516 4.516 0 .201.013.402.04.603l-3.027 3.027c-.201-.027-.402-.04-.603-.04C3.859 10.609 2 12.468 2 15.337c0 2.868 1.859 4.727 4.748 4.727 2.068 0 3.845-.966 4.395-2.401l3.246-3.246c.966.402 2.068.322 2.951-.241 1.449-.966 1.931-2.951.966-4.4-.563-.859-1.449-1.369-2.388-1.369-.322 0-.643.067-.946.188l-3.528-3.528c.121-.308.188-.629.188-.951 0-.939-.51-1.825-1.369-2.388-.668-.441-1.489-.632-2.294-.441zM15.337 3.71c.51-.081 1.047.081 1.449.402.643.429.859 1.208.644 1.852-.215.644-.859 1.047-1.503.93-.644-.134-1.127-.71-1.208-1.369-.081-.644.215-1.288.618-1.815zm-6.969 7.637c.215-.644.859-1.047 1.503-.93.644.134 1.127.71 1.208 1.369.081.644-.215 1.288-.618 1.815-.51.081-1.047-.081-1.449-.402-.643-.429-.859-1.208-.644-1.852zm-1.503 5.778c-2.147 0-3.888-1.741-3.888-3.888s1.741-3.888 3.888-3.888c.215 0 .429.027.644.067l-.617 2.628c-.027.107-.027.215 0 .322l.617 2.628c-.215.04-.429.067-.644.067z" data-v-7e5717a2></path></svg></div><div class="flex-1" data-v-7e5717a2><h4 class="text-lg font-medium text-gray-900" data-v-7e5717a2>Shopify</h4><p class="text-sm text-gray-500" data-v-7e5717a2> Synchronisez automatiquement votre catalogue Shopify </p><div class="mt-2 flex items-center text-xs text-green-600" data-v-7e5717a2><svg class="w-4 h-4 mr-1" fill="none" stroke="currentColor" viewBox="0 0 24 24" data-v-7e5717a2><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M5 13l4 4L19 7" data-v-7e5717a2></path></svg> Synchronisation temps r\xE9el </div></div><div class="text-green-600" data-v-7e5717a2><svg class="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24" data-v-7e5717a2><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 5l7 7-7 7" data-v-7e5717a2></path></svg></div></div></div><div class="connection-option" data-v-7e5717a2><div class="flex items-center space-x-4" data-v-7e5717a2><div class="p-3 bg-blue-100 rounded-lg" data-v-7e5717a2><svg class="w-8 h-8 text-blue-600" fill="currentColor" viewBox="0 0 24 24" data-v-7e5717a2><path d="M23.527 8.257c-.223-1.37-1.209-2.368-2.587-2.368-1.377 0-2.362.998-2.587 2.368-.033.201-.033.402 0 .603.223 1.37 1.209 2.368 2.587 2.368s2.364-.998 2.587-2.368c.033-.201.033-.402 0-.603zM20.94 7.654c.563 0 1.013.45 1.013 1.013s-.45 1.013-1.013 1.013-1.013-.45-1.013-1.013.45-1.013 1.013-1.013zM8.4 15.6c-.563 0-1.013-.45-1.013-1.013s.45-1.013 1.013-1.013 1.013.45 1.013 1.013-.45 1.013-1.013 1.013zM8.4 12.573c-1.377 0-2.364.998-2.587 2.368-.033.201-.033.402 0 .603.223 1.37 1.209 2.368 2.587 2.368s2.364-.998 2.587-2.368c.033-.201.033-.402 0-.603-.223-1.37-1.209-2.368-2.587-2.368zM14.667 8.16c-.563 0-1.013-.45-1.013-1.013s.45-1.013 1.013-1.013 1.013.45 1.013 1.013-.45 1.013-1.013 1.013zM14.667 5.133c1.377 0 2.364.998 2.587 2.368.033.201.033.402 0 .603-.223 1.37-1.209 2.368-2.587 2.368s-2.364-.998-2.587-2.368c-.033-.201-.033-.402 0-.603.223-1.37 1.209-2.368 2.587-2.368z" data-v-7e5717a2></path></svg></div><div class="flex-1" data-v-7e5717a2><h4 class="text-lg font-medium text-gray-900" data-v-7e5717a2>WooCommerce</h4><p class="text-sm text-gray-500" data-v-7e5717a2> Connectez votre boutique WordPress WooCommerce </p><div class="mt-2 flex items-center text-xs text-blue-600" data-v-7e5717a2><svg class="w-4 h-4 mr-1" fill="none" stroke="currentColor" viewBox="0 0 24 24" data-v-7e5717a2><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M5 13l4 4L19 7" data-v-7e5717a2></path></svg> API REST s\xE9curis\xE9e </div></div><div class="text-blue-600" data-v-7e5717a2><svg class="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24" data-v-7e5717a2><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 5l7 7-7 7" data-v-7e5717a2></path></svg></div></div></div><div class="connection-option disabled" data-v-7e5717a2><div class="flex items-center space-x-4" data-v-7e5717a2><div class="p-3 bg-gray-100 rounded-lg" data-v-7e5717a2><svg class="w-8 h-8 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24" data-v-7e5717a2><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M8.684 13.342C8.886 12.938 9 12.482 9 12c0-.482-.114-.938-.316-1.342m0 2.684a3 3 0 110-2.684m0 2.684l6.632 3.316m-6.632-6l6.632-3.316m0 0a3 3 0 105.367-2.684 3 3 0 00-5.367 2.684zm0 9.316a3 3 0 105.367 2.684 3 3 0 00-5.367-2.684z" data-v-7e5717a2></path></svg></div><div class="flex-1" data-v-7e5717a2><h4 class="text-lg font-medium text-gray-400" data-v-7e5717a2>Autres plateformes</h4><p class="text-sm text-gray-400" data-v-7e5717a2>Magento, PrestaShop, BigCommerce</p><div class="mt-2" data-v-7e5717a2><span class="text-xs text-gray-400 bg-gray-100 px-2 py-1 rounded" data-v-7e5717a2>Bient\xF4t disponible</span></div></div></div></div></div><div class="mt-6 bg-blue-50 border border-blue-200 rounded-lg p-4" data-v-7e5717a2><div class="flex" data-v-7e5717a2><svg class="w-5 h-5 text-blue-600 mr-2 mt-0.5" fill="none" stroke="currentColor" viewBox="0 0 24 24" data-v-7e5717a2><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" data-v-7e5717a2></path></svg><div data-v-7e5717a2><p class="text-sm text-blue-800 font-medium" data-v-7e5717a2>Pourquoi connecter ma boutique ?</p><p class="text-sm text-blue-700 mt-1" data-v-7e5717a2> Synchronisez automatiquement vos produits pour que votre Vendeur IA ait toujours les informations \xE0 jour : prix, stock, descriptions et images. </p></div></div></div></div></div></div>`);
    };
  }
});
const _sfc_setup$4 = _sfc_main$4.setup;
_sfc_main$4.setup = (props, ctx) => {
  const ssrContext = useSSRContext();
  (ssrContext.modules || (ssrContext.modules = /* @__PURE__ */ new Set())).add("components/ConnectionModal.vue");
  return _sfc_setup$4 ? _sfc_setup$4(props, ctx) : void 0;
};
const ConnectionModal = /* @__PURE__ */ _export_sfc(_sfc_main$4, [["__scopeId", "data-v-7e5717a2"]]);
const _sfc_main$3 = /* @__PURE__ */ defineComponent({
  __name: "ShopifyConnectionModal",
  __ssrInlineRender: true,
  emits: ["close", "success"],
  setup(__props, { emit: __emit }) {
    const connecting = ref(false);
    const connectionMethod = ref("oauth");
    const form = ref({
      shopDomain: "",
      shopUrl: "",
      apiKey: "",
      apiPassword: ""
    });
    const errors = ref({
      shopDomain: "",
      shopUrl: "",
      apiKey: "",
      apiPassword: ""
    });
    const isFormValid = computed(() => {
      if (connectionMethod.value === "oauth") {
        return form.value.shopDomain.trim() !== "" && !errors.value.shopDomain;
      } else {
        return form.value.shopUrl.trim() !== "" && form.value.apiKey.trim() !== "" && form.value.apiPassword.trim() !== "" && !errors.value.shopUrl && !errors.value.apiKey && !errors.value.apiPassword;
      }
    });
    return (_ctx, _push, _parent, _attrs) => {
      _push(`<div${ssrRenderAttrs(mergeProps({ class: "modal-overlay" }, _attrs))} data-v-3b96564b><div class="modal-content" data-v-3b96564b><div class="modal-header" data-v-3b96564b><div class="flex items-center" data-v-3b96564b><div class="p-2 bg-green-100 rounded-lg mr-3" data-v-3b96564b><svg class="w-6 h-6 text-green-600" fill="currentColor" viewBox="0 0 24 24" data-v-3b96564b><path d="M15.337 2.543c-.161-.026-.322-.04-.483-.04-2.688 0-4.516 1.859-4.516 4.516 0 .201.013.402.04.603l-3.027 3.027c-.201-.027-.402-.04-.603-.04C3.859 10.609 2 12.468 2 15.337c0 2.868 1.859 4.727 4.748 4.727 2.068 0 3.845-.966 4.395-2.401l3.246-3.246c.966.402 2.068.322 2.951-.241 1.449-.966 1.931-2.951.966-4.4-.563-.859-1.449-1.369-2.388-1.369-.322 0-.643.067-.946.188l-3.528-3.528c.121-.308.188-.629.188-.951 0-.939-.51-1.825-1.369-2.388-.668-.441-1.489-.632-2.294-.441zM15.337 3.71c.51-.081 1.047.081 1.449.402.643.429.859 1.208.644 1.852-.215.644-.859 1.047-1.503.93-.644-.134-1.127-.71-1.208-1.369-.081-.644.215-1.288.618-1.815zm-6.969 7.637c.215-.644.859-1.047 1.503-.93.644.134 1.127.71 1.208 1.369.081.644-.215 1.288-.618 1.815-.51.081-1.047-.081-1.449-.402-.643-.429-.859-1.208-.644-1.852zm-1.503 5.778c-2.147 0-3.888-1.741-3.888-3.888s1.741-3.888 3.888-3.888c.215 0 .429.027.644.067l-.617 2.628c-.027.107-.027.215 0 .322l.617 2.628c-.215.04-.429.067-.644.067z" data-v-3b96564b></path></svg></div><h3 class="modal-title" data-v-3b96564b>Connecter Shopify</h3></div><button class="modal-close" data-v-3b96564b><svg class="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24" data-v-3b96564b><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12" data-v-3b96564b></path></svg></button></div><div class="modal-body" data-v-3b96564b><div class="space-y-6" data-v-3b96564b><div data-v-3b96564b><h4 class="text-sm font-medium text-gray-900 mb-3" data-v-3b96564b>M\xE9thode de connexion</h4><div class="space-y-3" data-v-3b96564b><label class="flex items-center" data-v-3b96564b><input${ssrIncludeBooleanAttr(ssrLooseEqual(connectionMethod.value, "oauth")) ? " checked" : ""} type="radio" value="oauth" class="form-radio h-4 w-4 text-green-600" data-v-3b96564b><span class="ml-3 text-sm" data-v-3b96564b><span class="text-gray-900 font-medium" data-v-3b96564b>OAuth (Recommand\xE9)</span><span class="text-gray-500 block" data-v-3b96564b>Connexion s\xE9curis\xE9e via Shopify</span></span></label><label class="flex items-center" data-v-3b96564b><input${ssrIncludeBooleanAttr(ssrLooseEqual(connectionMethod.value, "private")) ? " checked" : ""} type="radio" value="private" class="form-radio h-4 w-4 text-green-600" data-v-3b96564b><span class="ml-3 text-sm" data-v-3b96564b><span class="text-gray-900 font-medium" data-v-3b96564b>App priv\xE9e</span><span class="text-gray-500 block" data-v-3b96564b>Utiliser une app priv\xE9e existante</span></span></label></div></div>`);
      if (connectionMethod.value === "oauth") {
        _push(`<div data-v-3b96564b><div data-v-3b96564b><label class="block text-sm font-medium text-gray-700 mb-2" data-v-3b96564b> URL de votre boutique Shopify * </label><div class="flex" data-v-3b96564b><span class="inline-flex items-center px-3 py-2 border border-r-0 border-gray-300 bg-gray-50 text-gray-500 text-sm rounded-l-lg" data-v-3b96564b> https:// </span><input${ssrRenderAttr("value", form.value.shopDomain)} type="text" placeholder="votre-boutique" class="${ssrRenderClass([{ "border-red-500": errors.value.shopDomain }, "flex-1 px-3 py-2 border border-gray-300 rounded-none focus:ring-2 focus:ring-green-500 focus:border-green-500"])}" data-v-3b96564b><span class="inline-flex items-center px-3 py-2 border border-l-0 border-gray-300 bg-gray-50 text-gray-500 text-sm rounded-r-lg" data-v-3b96564b> .myshopify.com </span></div>`);
        if (errors.value.shopDomain) {
          _push(`<p class="text-red-500 text-xs mt-1" data-v-3b96564b>${ssrInterpolate(errors.value.shopDomain)}</p>`);
        } else {
          _push(`<p class="text-gray-500 text-xs mt-1" data-v-3b96564b> Exemple : ma-boutique \u2192 https://ma-boutique.myshopify.com </p>`);
        }
        _push(`</div><div class="bg-green-50 border border-green-200 rounded-lg p-4" data-v-3b96564b><div class="flex" data-v-3b96564b><svg class="w-5 h-5 text-green-600 mr-2 mt-0.5" fill="none" stroke="currentColor" viewBox="0 0 24 24" data-v-3b96564b><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" data-v-3b96564b></path></svg><div data-v-3b96564b><p class="text-sm text-green-800 font-medium" data-v-3b96564b>Connexion s\xE9curis\xE9e</p><p class="text-sm text-green-700 mt-1" data-v-3b96564b> Vous serez redirig\xE9 vers Shopify pour autoriser l&#39;acc\xE8s. Aucun mot de passe requis. </p></div></div></div></div>`);
      } else {
        _push(`<!---->`);
      }
      if (connectionMethod.value === "private") {
        _push(`<div class="space-y-4" data-v-3b96564b><div data-v-3b96564b><label class="block text-sm font-medium text-gray-700 mb-2" data-v-3b96564b> URL de votre boutique Shopify * </label><input${ssrRenderAttr("value", form.value.shopUrl)} type="url" placeholder="https://votre-boutique.myshopify.com" class="${ssrRenderClass([{ "border-red-500": errors.value.shopUrl }, "input-modern w-full"])}" data-v-3b96564b>`);
        if (errors.value.shopUrl) {
          _push(`<p class="text-red-500 text-xs mt-1" data-v-3b96564b>${ssrInterpolate(errors.value.shopUrl)}</p>`);
        } else {
          _push(`<!---->`);
        }
        _push(`</div><div data-v-3b96564b><label class="block text-sm font-medium text-gray-700 mb-2" data-v-3b96564b> API Key * </label><input${ssrRenderAttr("value", form.value.apiKey)} type="text" placeholder="Votre cl\xE9 API Shopify" class="${ssrRenderClass([{ "border-red-500": errors.value.apiKey }, "input-modern w-full"])}" data-v-3b96564b>`);
        if (errors.value.apiKey) {
          _push(`<p class="text-red-500 text-xs mt-1" data-v-3b96564b>${ssrInterpolate(errors.value.apiKey)}</p>`);
        } else {
          _push(`<!---->`);
        }
        _push(`</div><div data-v-3b96564b><label class="block text-sm font-medium text-gray-700 mb-2" data-v-3b96564b> API Secret Key * </label><input${ssrRenderAttr("value", form.value.apiPassword)} type="password" placeholder="Votre cl\xE9 secr\xE8te API" class="${ssrRenderClass([{ "border-red-500": errors.value.apiPassword }, "input-modern w-full"])}" data-v-3b96564b>`);
        if (errors.value.apiPassword) {
          _push(`<p class="text-red-500 text-xs mt-1" data-v-3b96564b>${ssrInterpolate(errors.value.apiPassword)}</p>`);
        } else {
          _push(`<!---->`);
        }
        _push(`</div><div class="bg-blue-50 border border-blue-200 rounded-lg p-4" data-v-3b96564b><div class="flex" data-v-3b96564b><svg class="w-5 h-5 text-blue-600 mr-2 mt-0.5" fill="none" stroke="currentColor" viewBox="0 0 24 24" data-v-3b96564b><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" data-v-3b96564b></path></svg><div data-v-3b96564b><p class="text-sm text-blue-800 font-medium" data-v-3b96564b>Comment cr\xE9er une app priv\xE9e ?</p><ol class="text-sm text-blue-700 mt-2 space-y-1 list-decimal list-inside" data-v-3b96564b><li data-v-3b96564b>Admin Shopify \u2192 Apps \u2192 D\xE9velopper des apps</li><li data-v-3b96564b>Cr\xE9er une app \u2192 App priv\xE9e personnalis\xE9e</li><li data-v-3b96564b>Configuration \u2192 Admin API \u2192 S\xE9lectionner les permissions : Products (read), Inventory (read)</li><li data-v-3b96564b>Installer l&#39;app et r\xE9cup\xE9rer les cl\xE9s API</li></ol></div></div></div></div>`);
      } else {
        _push(`<!---->`);
      }
      _push(`<div class="bg-gray-50 border border-gray-200 rounded-lg p-4" data-v-3b96564b><h5 class="text-sm font-medium text-gray-900 mb-2" data-v-3b96564b>Permissions demand\xE9es :</h5><ul class="text-sm text-gray-700 space-y-1" data-v-3b96564b><li class="flex items-center" data-v-3b96564b><svg class="w-4 h-4 text-green-500 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24" data-v-3b96564b><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M5 13l4 4L19 7" data-v-3b96564b></path></svg> Lecture des produits et collections </li><li class="flex items-center" data-v-3b96564b><svg class="w-4 h-4 text-green-500 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24" data-v-3b96564b><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M5 13l4 4L19 7" data-v-3b96564b></path></svg> Lecture de l&#39;inventaire et des prix </li><li class="flex items-center" data-v-3b96564b><svg class="w-4 h-4 text-green-500 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24" data-v-3b96564b><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M5 13l4 4L19 7" data-v-3b96564b></path></svg> Acc\xE8s aux images et descriptions </li></ul></div></div></div><div class="modal-footer" data-v-3b96564b><button class="btn-secondary" data-v-3b96564b> Annuler </button><button${ssrIncludeBooleanAttr(!isFormValid.value || connecting.value) ? " disabled" : ""} class="btn-primary btn-green" data-v-3b96564b>${ssrInterpolate(connecting.value ? "Connexion..." : "Connecter Shopify")}</button></div></div></div>`);
    };
  }
});
const _sfc_setup$3 = _sfc_main$3.setup;
_sfc_main$3.setup = (props, ctx) => {
  const ssrContext = useSSRContext();
  (ssrContext.modules || (ssrContext.modules = /* @__PURE__ */ new Set())).add("components/ShopifyConnectionModal.vue");
  return _sfc_setup$3 ? _sfc_setup$3(props, ctx) : void 0;
};
const ShopifyConnectionModal = /* @__PURE__ */ _export_sfc(_sfc_main$3, [["__scopeId", "data-v-3b96564b"]]);
const _sfc_main$2 = /* @__PURE__ */ defineComponent({
  __name: "WooCommerceConnectionModal",
  __ssrInlineRender: true,
  emits: ["close", "success"],
  setup(__props, { emit: __emit }) {
    const connecting = ref(false);
    const testing = ref(false);
    const testResult = ref(null);
    const form = ref({
      siteUrl: "",
      consumerKey: "",
      consumerSecret: "",
      apiVersion: "wc/v3",
      forceSsl: true
    });
    const errors = ref({
      siteUrl: "",
      consumerKey: "",
      consumerSecret: ""
    });
    const isFormValid = computed(() => {
      return form.value.siteUrl.trim() !== "" && form.value.consumerKey.trim() !== "" && form.value.consumerSecret.trim() !== "" && !errors.value.siteUrl && !errors.value.consumerKey && !errors.value.consumerSecret;
    });
    return (_ctx, _push, _parent, _attrs) => {
      _push(`<div${ssrRenderAttrs(mergeProps({ class: "modal-overlay" }, _attrs))} data-v-80bfb06d><div class="modal-content" data-v-80bfb06d><div class="modal-header" data-v-80bfb06d><div class="flex items-center" data-v-80bfb06d><div class="p-2 bg-blue-100 rounded-lg mr-3" data-v-80bfb06d><svg class="w-6 h-6 text-blue-600" fill="currentColor" viewBox="0 0 24 24" data-v-80bfb06d><path d="M23.527 8.257c-.223-1.37-1.209-2.368-2.587-2.368-1.377 0-2.362.998-2.587 2.368-.033.201-.033.402 0 .603.223 1.37 1.209 2.368 2.587 2.368s2.364-.998 2.587-2.368c.033-.201.033-.402 0-.603zM20.94 7.654c.563 0 1.013.45 1.013 1.013s-.45 1.013-1.013 1.013-1.013-.45-1.013-1.013.45-1.013 1.013-1.013zM8.4 15.6c-.563 0-1.013-.45-1.013-1.013s.45-1.013 1.013-1.013 1.013.45 1.013 1.013-.45 1.013-1.013 1.013zM8.4 12.573c-1.377 0-2.364.998-2.587 2.368-.033.201-.033.402 0 .603.223 1.37 1.209 2.368 2.587 2.368s2.364-.998 2.587-2.368c.033-.201-.033-.402 0-.603-.223-1.37-1.209-2.368-2.587-2.368zM14.667 8.16c-.563 0-1.013-.45-1.013-1.013s.45-1.013 1.013-1.013 1.013.45 1.013 1.013-.45 1.013-1.013 1.013zM14.667 5.133c1.377 0 2.364.998 2.587 2.368.033.201.033.402 0 .603-.223 1.37-1.209 2.368-2.587 2.368s-2.364-.998-2.587-2.368c-.033-.201-.033-.402 0-.603.223-1.37 1.209-2.368 2.587-2.368z" data-v-80bfb06d></path></svg></div><h3 class="modal-title" data-v-80bfb06d>Connecter WooCommerce</h3></div><button class="modal-close" data-v-80bfb06d><svg class="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24" data-v-80bfb06d><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12" data-v-80bfb06d></path></svg></button></div><div class="modal-body" data-v-80bfb06d><div class="space-y-6" data-v-80bfb06d><div data-v-80bfb06d><label class="block text-sm font-medium text-gray-700 mb-2" data-v-80bfb06d> URL de votre site WordPress * </label><input${ssrRenderAttr("value", form.value.siteUrl)} type="url" placeholder="https://votre-site.com" class="${ssrRenderClass([{ "border-red-500": errors.value.siteUrl }, "input-modern w-full"])}" data-v-80bfb06d>`);
      if (errors.value.siteUrl) {
        _push(`<p class="text-red-500 text-xs mt-1" data-v-80bfb06d>${ssrInterpolate(errors.value.siteUrl)}</p>`);
      } else {
        _push(`<p class="text-gray-500 text-xs mt-1" data-v-80bfb06d> L&#39;URL compl\xE8te de votre site WordPress avec WooCommerce </p>`);
      }
      _push(`</div><div data-v-80bfb06d><label class="block text-sm font-medium text-gray-700 mb-2" data-v-80bfb06d> Consumer Key * </label><input${ssrRenderAttr("value", form.value.consumerKey)} type="text" placeholder="ck_XXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXX" class="${ssrRenderClass([{ "border-red-500": errors.value.consumerKey }, "input-modern w-full"])}" data-v-80bfb06d>`);
      if (errors.value.consumerKey) {
        _push(`<p class="text-red-500 text-xs mt-1" data-v-80bfb06d>${ssrInterpolate(errors.value.consumerKey)}</p>`);
      } else {
        _push(`<p class="text-gray-500 text-xs mt-1" data-v-80bfb06d> Commence par &quot;ck_&quot; suivi de 40 caract\xE8res </p>`);
      }
      _push(`</div><div data-v-80bfb06d><label class="block text-sm font-medium text-gray-700 mb-2" data-v-80bfb06d> Consumer Secret * </label><input${ssrRenderAttr("value", form.value.consumerSecret)} type="password" placeholder="cs_XXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXX" class="${ssrRenderClass([{ "border-red-500": errors.value.consumerSecret }, "input-modern w-full"])}" data-v-80bfb06d>`);
      if (errors.value.consumerSecret) {
        _push(`<p class="text-red-500 text-xs mt-1" data-v-80bfb06d>${ssrInterpolate(errors.value.consumerSecret)}</p>`);
      } else {
        _push(`<p class="text-gray-500 text-xs mt-1" data-v-80bfb06d> Commence par &quot;cs_&quot; suivi de 40 caract\xE8res </p>`);
      }
      _push(`</div><div data-v-80bfb06d><label class="block text-sm font-medium text-gray-700 mb-2" data-v-80bfb06d> Version API WooCommerce </label><select class="input-modern w-full" data-v-80bfb06d><option value="wc/v3" data-v-80bfb06d${ssrIncludeBooleanAttr(Array.isArray(form.value.apiVersion) ? ssrLooseContain(form.value.apiVersion, "wc/v3") : ssrLooseEqual(form.value.apiVersion, "wc/v3")) ? " selected" : ""}>v3 (Recommand\xE9)</option><option value="wc/v2" data-v-80bfb06d${ssrIncludeBooleanAttr(Array.isArray(form.value.apiVersion) ? ssrLooseContain(form.value.apiVersion, "wc/v2") : ssrLooseEqual(form.value.apiVersion, "wc/v2")) ? " selected" : ""}>v2</option><option value="wc/v1" data-v-80bfb06d${ssrIncludeBooleanAttr(Array.isArray(form.value.apiVersion) ? ssrLooseContain(form.value.apiVersion, "wc/v1") : ssrLooseEqual(form.value.apiVersion, "wc/v1")) ? " selected" : ""}>v1</option></select><p class="text-gray-500 text-xs mt-1" data-v-80bfb06d> La version 3 est recommand\xE9e pour les sites WooCommerce r\xE9cents </p></div><div class="flex items-center space-x-3" data-v-80bfb06d><input${ssrIncludeBooleanAttr(Array.isArray(form.value.forceSsl) ? ssrLooseContain(form.value.forceSsl, null) : form.value.forceSsl) ? " checked" : ""} type="checkbox" id="forceSsl" class="rounded border-gray-300 text-blue-600 focus:ring-blue-500" data-v-80bfb06d><label for="forceSsl" class="text-sm text-gray-700" data-v-80bfb06d> Forcer HTTPS (recommand\xE9 si votre site utilise SSL) </label></div><div class="bg-blue-50 border border-blue-200 rounded-lg p-4" data-v-80bfb06d><div class="flex" data-v-80bfb06d><svg class="w-5 h-5 text-blue-600 mr-2 mt-0.5 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24" data-v-80bfb06d><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" data-v-80bfb06d></path></svg><div data-v-80bfb06d><p class="text-sm text-blue-800 font-medium" data-v-80bfb06d>Comment obtenir vos cl\xE9s API ?</p><ol class="text-sm text-blue-700 mt-2 space-y-1 list-decimal list-inside" data-v-80bfb06d><li data-v-80bfb06d>Connectez-vous \xE0 votre admin WordPress</li><li data-v-80bfb06d>WooCommerce \u2192 R\xE9glages \u2192 Avanc\xE9 \u2192 REST API</li><li data-v-80bfb06d>Cliquez sur &quot;Ajouter une cl\xE9&quot;</li><li data-v-80bfb06d><strong data-v-80bfb06d>Description :</strong> ChatSeller Integration </li><li data-v-80bfb06d><strong data-v-80bfb06d>Utilisateur :</strong> Choisissez un admin </li><li data-v-80bfb06d><strong data-v-80bfb06d>Permissions :</strong> Lecture </li><li data-v-80bfb06d>G\xE9n\xE9rez les cl\xE9s et copiez-les ici</li></ol></div></div></div>`);
      if (testResult.value) {
        _push(`<div class="${ssrRenderClass([testResult.value.success ? "bg-green-50 border-green-200" : "bg-red-50 border-red-200", "border rounded-lg p-4"])}" data-v-80bfb06d><div class="flex" data-v-80bfb06d><svg class="${ssrRenderClass([testResult.value.success ? "text-green-600" : "text-red-600", "w-5 h-5 mr-2 mt-0.5"])}" fill="none" stroke="currentColor" viewBox="0 0 24 24" data-v-80bfb06d>`);
        if (testResult.value.success) {
          _push(`<path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" data-v-80bfb06d></path>`);
        } else {
          _push(`<path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" data-v-80bfb06d></path>`);
        }
        _push(`</svg><div data-v-80bfb06d><p class="${ssrRenderClass([testResult.value.success ? "text-green-800" : "text-red-800", "text-sm font-medium"])}" data-v-80bfb06d>${ssrInterpolate(testResult.value.success ? "Connexion r\xE9ussie!" : "Erreur de connexion")}</p><p class="${ssrRenderClass([testResult.value.success ? "text-green-700" : "text-red-700", "text-sm mt-1"])}" data-v-80bfb06d>${ssrInterpolate(testResult.value.message)}</p></div></div></div>`);
      } else {
        _push(`<!---->`);
      }
      _push(`<div class="bg-gray-50 border border-gray-200 rounded-lg p-4" data-v-80bfb06d><h5 class="text-sm font-medium text-gray-900 mb-2" data-v-80bfb06d>Permissions demand\xE9es :</h5><ul class="text-sm text-gray-700 space-y-1" data-v-80bfb06d><li class="flex items-center" data-v-80bfb06d><svg class="w-4 h-4 text-green-500 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24" data-v-80bfb06d><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M5 13l4 4L19 7" data-v-80bfb06d></path></svg> Lecture des produits et cat\xE9gories </li><li class="flex items-center" data-v-80bfb06d><svg class="w-4 h-4 text-green-500 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24" data-v-80bfb06d><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M5 13l4 4L19 7" data-v-80bfb06d></path></svg> Lecture des stocks et prix </li><li class="flex items-center" data-v-80bfb06d><svg class="w-4 h-4 text-green-500 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24" data-v-80bfb06d><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M5 13l4 4L19 7" data-v-80bfb06d></path></svg> Acc\xE8s aux images et attributs </li></ul></div></div></div><div class="modal-footer" data-v-80bfb06d><button class="btn-secondary" data-v-80bfb06d> Annuler </button><button${ssrIncludeBooleanAttr(!isFormValid.value || testing.value) ? " disabled" : ""} class="btn-secondary mr-2" data-v-80bfb06d>${ssrInterpolate(testing.value ? "Test..." : "Tester")}</button><button${ssrIncludeBooleanAttr(!isFormValid.value || connecting.value || testResult.value && !testResult.value.success) ? " disabled" : ""} class="btn-primary btn-blue" data-v-80bfb06d>${ssrInterpolate(connecting.value ? "Connexion..." : "Connecter WooCommerce")}</button></div></div></div>`);
    };
  }
});
const _sfc_setup$2 = _sfc_main$2.setup;
_sfc_main$2.setup = (props, ctx) => {
  const ssrContext = useSSRContext();
  (ssrContext.modules || (ssrContext.modules = /* @__PURE__ */ new Set())).add("components/WooCommerceConnectionModal.vue");
  return _sfc_setup$2 ? _sfc_setup$2(props, ctx) : void 0;
};
const WooCommerceConnectionModal = /* @__PURE__ */ _export_sfc(_sfc_main$2, [["__scopeId", "data-v-80bfb06d"]]);
const intervalError = "[nuxt] `setInterval` should not be used on the server. Consider wrapping it with an `onNuxtReady`, `onBeforeMount` or `onMounted` lifecycle hook, or ensure you only call it in the browser by checking `false`.";
const setInterval = () => {
  console.error(intervalError);
};
const _sfc_main$1 = /* @__PURE__ */ defineComponent({
  __name: "NotificationToast",
  __ssrInlineRender: true,
  props: {
    show: { type: Boolean },
    type: { default: "info" },
    title: {},
    message: {},
    duration: { default: 5e3 },
    persistent: { type: Boolean, default: false }
  },
  emits: ["close"],
  setup(__props, { emit: __emit }) {
    const props = __props;
    const emit = __emit;
    const progress = ref(100);
    let progressInterval = null;
    let autoCloseTimeout = null;
    const getMessageClass = () => {
      const classes = {
        success: "text-green-900",
        error: "text-red-900",
        warning: "text-yellow-900",
        info: "text-blue-900"
      };
      return classes[props.type] || classes.info;
    };
    const getProgressBarClass = () => {
      const classes = {
        success: "bg-green-500",
        error: "bg-red-500",
        warning: "bg-yellow-500",
        info: "bg-blue-500"
      };
      return classes[props.type] || classes.info;
    };
    const getDefaultTitle = () => {
      const titles = {
        success: "Succ\xE8s",
        error: "Erreur",
        warning: "Attention",
        info: "Information"
      };
      return titles[props.type] || titles.info;
    };
    const clearTimers = () => {
      if (progressInterval) {
        clearInterval(progressInterval);
        progressInterval = null;
      }
      if (autoCloseTimeout) {
        clearTimeout(autoCloseTimeout);
        autoCloseTimeout = null;
      }
    };
    const startAutoClose = () => {
      if (props.persistent || !props.duration || props.duration <= 0) {
        return;
      }
      progress.value = 100;
      const intervalDuration = 100;
      intervalDuration / props.duration * 100;
      progressInterval = setInterval();
      autoCloseTimeout = setTimeout(() => {
        clearTimers();
        emit("close");
      }, props.duration);
    };
    watch(() => props.show, (newShow) => {
      if (newShow) {
        startAutoClose();
      } else {
        clearTimers();
      }
    });
    return (_ctx, _push, _parent, _attrs) => {
      ssrRenderTeleport(_push, (_push2) => {
        if (_ctx.show) {
          _push2(`<div class="fixed bottom-4 right-4 max-w-sm w-full bg-white rounded-lg shadow-lg border border-gray-200 z-50" role="alert" data-v-31c739de><div class="p-4" data-v-31c739de><div class="flex items-start" data-v-31c739de><div class="flex-shrink-0" data-v-31c739de>`);
          if (_ctx.type === "success") {
            _push2(`<svg class="w-6 h-6 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24" data-v-31c739de><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" data-v-31c739de></path></svg>`);
          } else if (_ctx.type === "error") {
            _push2(`<svg class="w-6 h-6 text-red-600" fill="none" stroke="currentColor" viewBox="0 0 24 24" data-v-31c739de><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" data-v-31c739de></path></svg>`);
          } else if (_ctx.type === "warning") {
            _push2(`<svg class="w-6 h-6 text-yellow-600" fill="none" stroke="currentColor" viewBox="0 0 24 24" data-v-31c739de><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-2.5L13.732 4c-.77-.833-1.732-.833-2.5 0L4.268 16.5c-.77.833.192 2.5 1.732 2.5z" data-v-31c739de></path></svg>`);
          } else {
            _push2(`<svg class="w-6 h-6 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24" data-v-31c739de><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" data-v-31c739de></path></svg>`);
          }
          _push2(`</div><div class="ml-3 w-0 flex-1" data-v-31c739de><p class="${ssrRenderClass([getMessageClass(), "text-sm font-medium"])}" data-v-31c739de>${ssrInterpolate(_ctx.title || getDefaultTitle())}</p>`);
          if (_ctx.message) {
            _push2(`<p class="mt-1 text-sm text-gray-500" data-v-31c739de>${ssrInterpolate(_ctx.message)}</p>`);
          } else {
            _push2(`<!---->`);
          }
          _push2(`</div><div class="ml-4 flex-shrink-0 flex" data-v-31c739de><button class="bg-white rounded-md inline-flex text-gray-400 hover:text-gray-500 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500" type="button" data-v-31c739de><span class="sr-only" data-v-31c739de>Fermer</span><svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24" data-v-31c739de><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12" data-v-31c739de></path></svg></button></div></div>`);
          if (_ctx.duration && _ctx.duration > 0) {
            _push2(`<div class="mt-3 w-full bg-gray-200 rounded-full h-1" data-v-31c739de><div class="${ssrRenderClass([getProgressBarClass(), "h-1 rounded-full transition-all duration-100 ease-linear"])}" style="${ssrRenderStyle({ width: `${progress.value}%` })}" data-v-31c739de></div></div>`);
          } else {
            _push2(`<!---->`);
          }
          _push2(`</div></div>`);
        } else {
          _push2(`<!---->`);
        }
      }, "body", false, _parent);
    };
  }
});
const _sfc_setup$1 = _sfc_main$1.setup;
_sfc_main$1.setup = (props, ctx) => {
  const ssrContext = useSSRContext();
  (ssrContext.modules || (ssrContext.modules = /* @__PURE__ */ new Set())).add("components/NotificationToast.vue");
  return _sfc_setup$1 ? _sfc_setup$1(props, ctx) : void 0;
};
const NotificationToast = /* @__PURE__ */ _export_sfc(_sfc_main$1, [["__scopeId", "data-v-31c739de"]]);
const _sfc_main = /* @__PURE__ */ defineComponent({
  __name: "products",
  __ssrInlineRender: true,
  setup(__props) {
    const {
      products: products2,
      stats,
      loading,
      syncing,
      error,
      hasProducts,
      fetchProducts,
      fetchStats,
      syncProducts,
      clearError,
      formatPrice,
      getSourceLabel,
      getSourceBadgeClass
    } = useProducts();
    const showProductModal = ref(false);
    const showConnectModal = ref(false);
    const showShopifyModal = ref(false);
    const showWooCommerceModal = ref(false);
    const showNotification = ref(false);
    const notificationMessage = ref("");
    const notificationType = ref("success");
    const editingProduct = ref(null);
    const filters = ref({
      search: "",
      category: "",
      source: ""
    });
    const connectionStatus = ref({
      shopify: {
        connected: false,
        credentials: null,
        lastSync: null
      },
      woocommerce: {
        connected: false,
        credentials: null,
        lastSync: null
      }
    });
    const hasFilters = computed(() => {
      return !!(filters.value.search || filters.value.category || filters.value.source);
    });
    const availableCategories = computed(() => {
      var _a;
      return ((_a = stats.value) == null ? void 0 : _a.categories) || [];
    });
    const refreshProducts = async () => {
      clearError();
      await fetchProducts(filters.value);
      await fetchStats();
    };
    const closeProductModal = () => {
      showProductModal.value = false;
      editingProduct.value = null;
    };
    const handleProductSuccess = (message) => {
      showNotification.value = true;
      notificationMessage.value = message;
      notificationType.value = "success";
      refreshProducts();
    };
    const openShopifyModal = () => {
      showConnectModal.value = false;
      showShopifyModal.value = true;
    };
    const openWooCommerceModal = () => {
      showConnectModal.value = false;
      showWooCommerceModal.value = true;
    };
    const handleShopifyConnected = async () => {
      const connectionData = JSON.parse(localStorage.getItem("shopify_connection") || "{}");
      connectionStatus.value.shopify = {
        connected: true,
        credentials: connectionData,
        lastSync: null
      };
      showNotification.value = true;
      notificationMessage.value = "Boutique Shopify connect\xE9e avec succ\xE8s!";
      notificationType.value = "success";
      setTimeout(() => {
        handleShopifySync();
      }, 1e3);
    };
    const handleWooCommerceConnected = async () => {
      const connectionData = JSON.parse(localStorage.getItem("woocommerce_connection") || "{}");
      connectionStatus.value.woocommerce = {
        connected: true,
        credentials: connectionData,
        lastSync: null
      };
      showNotification.value = true;
      notificationMessage.value = "Boutique WooCommerce connect\xE9e avec succ\xE8s!";
      notificationType.value = "success";
      setTimeout(() => {
        handleWooCommerceSync();
      }, 1e3);
    };
    const handleShopifySync = async () => {
      if (!connectionStatus.value.shopify.credentials) {
        showNotification.value = true;
        notificationMessage.value = "Aucune configuration Shopify trouv\xE9e";
        notificationType.value = "error";
        return;
      }
      const result = await syncProducts("shopify", connectionStatus.value.shopify.credentials);
      if (result.success) {
        connectionStatus.value.shopify.lastSync = (/* @__PURE__ */ new Date()).toISOString();
        showNotification.value = true;
        notificationMessage.value = "Synchronisation Shopify termin\xE9e!";
        notificationType.value = "success";
        refreshProducts();
      } else {
        showNotification.value = true;
        notificationMessage.value = result.error || "Erreur de synchronisation";
        notificationType.value = "error";
      }
    };
    const handleWooCommerceSync = async () => {
      if (!connectionStatus.value.woocommerce.credentials) {
        showNotification.value = true;
        notificationMessage.value = "Aucune configuration WooCommerce trouv\xE9e";
        notificationType.value = "error";
        return;
      }
      const result = await syncProducts("woocommerce", connectionStatus.value.woocommerce.credentials);
      if (result.success) {
        connectionStatus.value.woocommerce.lastSync = (/* @__PURE__ */ new Date()).toISOString();
        showNotification.value = true;
        notificationMessage.value = "Synchronisation WooCommerce termin\xE9e!";
        notificationType.value = "success";
        refreshProducts();
      } else {
        showNotification.value = true;
        notificationMessage.value = result.error || "Erreur de synchronisation";
        notificationType.value = "error";
      }
    };
    const getStockClass = (quantity) => {
      if (quantity <= 0) return "text-red-600";
      if (quantity <= 10) return "text-orange-600";
      return "text-green-600";
    };
    const getStockLabel = (quantity) => {
      if (quantity <= 0) return "Rupture";
      if (quantity <= 10) return "Stock faible";
      return `${quantity} en stock`;
    };
    useHead({
      title: "Produits - ChatSeller Dashboard"
    });
    return (_ctx, _push, _parent, _attrs) => {
      var _a, _b, _c, _d;
      _push(`<div${ssrRenderAttrs(mergeProps({ class: "min-h-screen bg-gray-50" }, _attrs))} data-v-778c8848><div class="bg-white shadow-sm border-b border-gray-200" data-v-778c8848><div class="px-8 py-6" data-v-778c8848><div class="flex items-center justify-between" data-v-778c8848><div data-v-778c8848><h1 class="text-3xl font-bold text-gray-900" data-v-778c8848>Catalogue Produits</h1><p class="mt-2 text-gray-600" data-v-778c8848> G\xE9rez votre catalogue pour que votre Vendeur IA connaisse vos produits </p></div><div class="flex items-center space-x-4" data-v-778c8848><button class="inline-flex items-center px-4 py-2 border border-gray-300 rounded-lg text-sm font-medium text-gray-700 bg-white hover:bg-gray-50 transition-colors" data-v-778c8848><svg class="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24" data-v-778c8848><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M8.684 13.342C8.886 12.938 9 12.482 9 12c0-.482-.114-.938-.316-1.342m0 2.684a3 3 0 110-2.684m0 2.684l6.632 3.316m-6.632-6l6.632-3.316m0 0a3 3 0 105.367-2.684 3 3 0 00-5.367 2.684zm0 9.316a3 3 0 105.367 2.684 3 3 0 00-5.367-2.684z" data-v-778c8848></path></svg> Connecter une boutique </button><button class="inline-flex items-center px-4 py-2 bg-blue-600 text-white text-sm font-medium rounded-lg hover:bg-blue-700 transition-colors" data-v-778c8848><svg class="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24" data-v-778c8848><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 6v6m0 0v6m0-6h6m-6 0H6" data-v-778c8848></path></svg> Ajouter un produit </button></div></div></div></div><div class="p-8" data-v-778c8848><div class="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8" data-v-778c8848><div class="card-modern" data-v-778c8848><div class="flex items-center justify-between mb-4" data-v-778c8848><div class="flex items-center" data-v-778c8848><div class="p-2 bg-purple-100 rounded-lg mr-3" data-v-778c8848><svg class="w-6 h-6 text-purple-600" fill="none" stroke="currentColor" viewBox="0 0 24 24" data-v-778c8848><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" data-v-778c8848></path></svg></div><div data-v-778c8848><h3 class="text-lg font-semibold text-gray-900" data-v-778c8848>Produits manuels</h3><p class="text-sm text-gray-500" data-v-778c8848>Ajout\xE9s directement</p></div></div></div><div class="flex items-center justify-between" data-v-778c8848><div data-v-778c8848><p class="text-2xl font-bold text-gray-900" data-v-778c8848>${ssrInterpolate(((_a = unref(stats)) == null ? void 0 : _a.bySource.manual) || 0)}</p><p class="text-xs text-gray-500" data-v-778c8848>produits</p></div><button class="text-purple-600 hover:text-purple-700 text-sm font-medium" data-v-778c8848> Ajouter \u2192 </button></div></div><div class="card-modern" data-v-778c8848><div class="flex items-center justify-between mb-4" data-v-778c8848><div class="flex items-center" data-v-778c8848><div class="p-2 bg-green-100 rounded-lg mr-3" data-v-778c8848><svg class="w-6 h-6 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24" data-v-778c8848><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M16 11V7a4 4 0 00-8 0v4M5 9h14l1 12H4L5 9z" data-v-778c8848></path></svg></div><div data-v-778c8848><h3 class="text-lg font-semibold text-gray-900" data-v-778c8848>Shopify</h3><p class="text-sm text-gray-500" data-v-778c8848>`);
      if (connectionStatus.value.shopify.connected) {
        _push(`<span class="text-green-600" data-v-778c8848>Connect\xE9</span>`);
      } else {
        _push(`<span class="text-gray-400" data-v-778c8848>Non connect\xE9</span>`);
      }
      _push(`</p></div></div>`);
      if (connectionStatus.value.shopify.connected) {
        _push(`<div class="w-3 h-3 bg-green-500 rounded-full" data-v-778c8848></div>`);
      } else {
        _push(`<!---->`);
      }
      _push(`</div><div class="flex items-center justify-between" data-v-778c8848><div data-v-778c8848><p class="text-2xl font-bold text-gray-900" data-v-778c8848>${ssrInterpolate(((_b = unref(stats)) == null ? void 0 : _b.bySource.shopify) || 0)}</p><p class="text-xs text-gray-500" data-v-778c8848>produits synchronis\xE9s</p></div><button${ssrIncludeBooleanAttr(unref(syncing)) ? " disabled" : ""} class="text-green-600 hover:text-green-700 text-sm font-medium disabled:opacity-50" data-v-778c8848>${ssrInterpolate(unref(syncing) ? "Sync..." : connectionStatus.value.shopify.connected ? "Synchroniser" : "Connecter")} \u2192 </button></div></div><div class="card-modern" data-v-778c8848><div class="flex items-center justify-between mb-4" data-v-778c8848><div class="flex items-center" data-v-778c8848><div class="p-2 bg-blue-100 rounded-lg mr-3" data-v-778c8848><svg class="w-6 h-6 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24" data-v-778c8848><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M21 12a9 9 0 01-9 9m9-9a9 9 0 00-9-9m9 9H3m9 9v-9m0-9v9" data-v-778c8848></path></svg></div><div data-v-778c8848><h3 class="text-lg font-semibold text-gray-900" data-v-778c8848>WooCommerce</h3><p class="text-sm text-gray-500" data-v-778c8848>`);
      if (connectionStatus.value.woocommerce.connected) {
        _push(`<span class="text-blue-600" data-v-778c8848>Connect\xE9</span>`);
      } else {
        _push(`<span class="text-gray-400" data-v-778c8848>Non connect\xE9</span>`);
      }
      _push(`</p></div></div>`);
      if (connectionStatus.value.woocommerce.connected) {
        _push(`<div class="w-3 h-3 bg-blue-500 rounded-full" data-v-778c8848></div>`);
      } else {
        _push(`<!---->`);
      }
      _push(`</div><div class="flex items-center justify-between" data-v-778c8848><div data-v-778c8848><p class="text-2xl font-bold text-gray-900" data-v-778c8848>${ssrInterpolate(((_c = unref(stats)) == null ? void 0 : _c.bySource.woocommerce) || 0)}</p><p class="text-xs text-gray-500" data-v-778c8848>produits synchronis\xE9s</p></div><button${ssrIncludeBooleanAttr(unref(syncing)) ? " disabled" : ""} class="text-blue-600 hover:text-blue-700 text-sm font-medium disabled:opacity-50" data-v-778c8848>${ssrInterpolate(unref(syncing) ? "Sync..." : connectionStatus.value.woocommerce.connected ? "Synchroniser" : "Connecter")} \u2192 </button></div></div></div>`);
      if (unref(syncing)) {
        _push(`<div class="mb-6 bg-blue-50 border border-blue-200 rounded-xl p-4" data-v-778c8848><div class="flex items-center" data-v-778c8848><div class="animate-spin rounded-full h-6 w-6 border-b-2 border-blue-600 mr-3" data-v-778c8848></div><div class="flex-1" data-v-778c8848><h3 class="text-sm font-medium text-blue-800" data-v-778c8848>Synchronisation en cours...</h3><p class="text-sm text-blue-700" data-v-778c8848> Importation des produits depuis votre boutique connect\xE9e. </p></div></div></div>`);
      } else {
        _push(`<!---->`);
      }
      _push(`<div class="card-modern mb-6" data-v-778c8848><div class="flex flex-col lg:flex-row lg:items-center lg:justify-between space-y-4 lg:space-y-0" data-v-778c8848><div class="flex-1 max-w-lg" data-v-778c8848><div class="relative" data-v-778c8848><svg class="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24" data-v-778c8848><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" data-v-778c8848></path></svg><input${ssrRenderAttr("value", filters.value.search)} type="text" placeholder="Rechercher un produit..." class="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-colors" data-v-778c8848></div></div><div class="flex items-center space-x-4" data-v-778c8848><select class="input-modern" data-v-778c8848><option value="" data-v-778c8848${ssrIncludeBooleanAttr(Array.isArray(filters.value.source) ? ssrLooseContain(filters.value.source, "") : ssrLooseEqual(filters.value.source, "")) ? " selected" : ""}>Toutes les sources</option><option value="manual" data-v-778c8848${ssrIncludeBooleanAttr(Array.isArray(filters.value.source) ? ssrLooseContain(filters.value.source, "manual") : ssrLooseEqual(filters.value.source, "manual")) ? " selected" : ""}>Manuel</option><option value="shopify" data-v-778c8848${ssrIncludeBooleanAttr(Array.isArray(filters.value.source) ? ssrLooseContain(filters.value.source, "shopify") : ssrLooseEqual(filters.value.source, "shopify")) ? " selected" : ""}>Shopify</option><option value="woocommerce" data-v-778c8848${ssrIncludeBooleanAttr(Array.isArray(filters.value.source) ? ssrLooseContain(filters.value.source, "woocommerce") : ssrLooseEqual(filters.value.source, "woocommerce")) ? " selected" : ""}>WooCommerce</option></select><select class="input-modern" data-v-778c8848><option value="" data-v-778c8848${ssrIncludeBooleanAttr(Array.isArray(filters.value.category) ? ssrLooseContain(filters.value.category, "") : ssrLooseEqual(filters.value.category, "")) ? " selected" : ""}>Toutes les cat\xE9gories</option><!--[-->`);
      ssrRenderList(availableCategories.value, (category) => {
        _push(`<option${ssrRenderAttr("value", category.name)} data-v-778c8848${ssrIncludeBooleanAttr(Array.isArray(filters.value.category) ? ssrLooseContain(filters.value.category, category.name) : ssrLooseEqual(filters.value.category, category.name)) ? " selected" : ""}>${ssrInterpolate(category.name)} (${ssrInterpolate(category.count)}) </option>`);
      });
      _push(`<!--]--></select><button${ssrIncludeBooleanAttr(!unref(hasProducts)) ? " disabled" : ""} class="text-blue-600 hover:text-blue-700 text-sm font-medium disabled:opacity-50" data-v-778c8848> Exporter CSV </button></div></div></div><div class="card-modern" data-v-778c8848><div class="flex items-center justify-between p-6 border-b border-gray-200" data-v-778c8848><h2 class="text-lg font-semibold text-gray-900" data-v-778c8848> Catalogue produits </h2><div class="flex items-center space-x-4" data-v-778c8848><span class="text-sm text-gray-500" data-v-778c8848>${ssrInterpolate(((_d = unref(stats)) == null ? void 0 : _d.total) || 0)} produit(s) </span><button${ssrIncludeBooleanAttr(unref(loading)) ? " disabled" : ""} class="text-blue-600 hover:text-blue-700 text-sm font-medium disabled:opacity-50" data-v-778c8848>${ssrInterpolate(unref(loading) ? "Actualisation..." : "Actualiser")}</button></div></div>`);
      if (unref(loading)) {
        _push(`<div class="p-12" data-v-778c8848><div class="flex items-center justify-center" data-v-778c8848><div class="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600" data-v-778c8848></div><span class="ml-3 text-gray-600" data-v-778c8848>Chargement des produits...</span></div></div>`);
      } else if (unref(error)) {
        _push(`<div class="p-12 text-center" data-v-778c8848><div class="text-red-500 mb-4" data-v-778c8848><svg class="w-12 h-12 mx-auto" fill="none" stroke="currentColor" viewBox="0 0 24 24" data-v-778c8848><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" data-v-778c8848></path></svg></div><h3 class="text-lg font-medium text-gray-900 mb-2" data-v-778c8848>Erreur de chargement</h3><p class="text-gray-500 mb-4" data-v-778c8848>${ssrInterpolate(unref(error))}</p><button class="btn-primary" data-v-778c8848> R\xE9essayer </button></div>`);
      } else if (unref(hasProducts)) {
        _push(`<div class="p-6" data-v-778c8848><div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6" data-v-778c8848><!--[-->`);
        ssrRenderList(unref(products2), (product) => {
          var _a2;
          _push(`<div class="product-card" data-v-778c8848><div class="aspect-square bg-gray-100 rounded-lg overflow-hidden mb-4" data-v-778c8848>`);
          if (product.featured_image || ((_a2 = product.images) == null ? void 0 : _a2[0])) {
            _push(`<img${ssrRenderAttr("src", product.featured_image || product.images[0])}${ssrRenderAttr("alt", product.name)} class="w-full h-full object-cover hover:scale-105 transition-transform duration-200" data-v-778c8848>`);
          } else {
            _push(`<div class="w-full h-full flex items-center justify-center" data-v-778c8848><svg class="w-12 h-12 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24" data-v-778c8848><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" data-v-778c8848></path></svg></div>`);
          }
          _push(`</div><div class="flex-1" data-v-778c8848><div class="flex items-start justify-between mb-2" data-v-778c8848><h3 class="text-sm font-medium text-gray-900 line-clamp-2" data-v-778c8848>${ssrInterpolate(product.name)}</h3><span class="${ssrRenderClass([unref(getSourceBadgeClass)(product.source), "source-badge ml-2"])}" data-v-778c8848>${ssrInterpolate(unref(getSourceLabel)(product.source))}</span></div>`);
          if (product.description) {
            _push(`<p class="text-xs text-gray-500 line-clamp-2 mb-2" data-v-778c8848>${ssrInterpolate(product.description)}</p>`);
          } else {
            _push(`<!---->`);
          }
          _push(`<div class="flex items-center justify-between mb-3" data-v-778c8848><div class="flex flex-col" data-v-778c8848><span class="text-lg font-bold text-gray-900" data-v-778c8848>${ssrInterpolate(unref(formatPrice)(product.price))}</span>`);
          if (product.compare_at_price && product.compare_at_price > product.price) {
            _push(`<span class="text-xs text-gray-400 line-through" data-v-778c8848>${ssrInterpolate(unref(formatPrice)(product.compare_at_price))}</span>`);
          } else {
            _push(`<!---->`);
          }
          _push(`</div><div class="text-right" data-v-778c8848>`);
          if (product.category) {
            _push(`<span class="text-xs text-gray-500 bg-gray-100 px-2 py-1 rounded block mb-1" data-v-778c8848>${ssrInterpolate(product.category)}</span>`);
          } else {
            _push(`<!---->`);
          }
          if (product.track_inventory) {
            _push(`<span class="${ssrRenderClass([getStockClass(product.inventory_quantity), "text-xs"])}" data-v-778c8848>${ssrInterpolate(getStockLabel(product.inventory_quantity))}</span>`);
          } else {
            _push(`<!---->`);
          }
          _push(`</div></div><div class="mb-3" data-v-778c8848><span class="${ssrRenderClass([product.is_active ? "bg-green-100 text-green-800" : "bg-red-100 text-red-800", "inline-flex items-center px-2 py-1 rounded-full text-xs font-medium"])}" data-v-778c8848>${ssrInterpolate(product.is_active ? "Actif" : "Inactif")}</span></div><div class="flex items-center space-x-2" data-v-778c8848><button class="flex-1 text-xs bg-blue-50 text-blue-700 hover:bg-blue-100 px-3 py-2 rounded-lg transition-colors" data-v-778c8848> Modifier </button><button class="text-xs bg-gray-50 text-gray-700 hover:bg-gray-100 px-3 py-2 rounded-lg transition-colors" title="Dupliquer" data-v-778c8848><svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24" data-v-778c8848><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M8 16H6a2 2 0 01-2-2V6a2 2 0 012-2h8a2 2 0 012 2v2m-6 12h8a2 2 0 002-2v-8a2 2 0 00-2-2h-8a2 2 0 00-2 2v8a2 2 0 002 2z" data-v-778c8848></path></svg></button><button${ssrIncludeBooleanAttr(product.source !== "manual") ? " disabled" : ""} class="text-xs bg-red-50 text-red-700 hover:bg-red-100 px-3 py-2 rounded-lg transition-colors disabled:opacity-50 disabled:cursor-not-allowed" title="Supprimer" data-v-778c8848><svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24" data-v-778c8848><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" data-v-778c8848></path></svg></button></div></div></div>`);
        });
        _push(`<!--]--></div></div>`);
      } else {
        _push(`<div class="text-center py-12" data-v-778c8848><svg class="mx-auto h-16 w-16 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24" data-v-778c8848><path stroke-linecap="round" stroke-linejoin="round" stroke-width="1" d="M16 11V7a4 4 0 00-8 0v4M5 9h14l1 12H4L5 9z" data-v-778c8848></path></svg><h3 class="mt-4 text-lg font-medium text-gray-900" data-v-778c8848>${ssrInterpolate(hasFilters.value ? "Aucun produit trouv\xE9" : "Aucun produit dans votre catalogue")}</h3><p class="mt-2 text-gray-500" data-v-778c8848>${ssrInterpolate(hasFilters.value ? "Aucun produit ne correspond \xE0 vos crit\xE8res de recherche" : "Commencez par ajouter des produits manuellement ou connecter votre boutique")}</p><div class="mt-6" data-v-778c8848>`);
        if (!hasFilters.value) {
          _push(`<button class="inline-flex items-center px-6 py-3 border border-transparent text-base font-medium rounded-lg text-white bg-blue-600 hover:bg-blue-700 transition-colors" data-v-778c8848><svg class="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24" data-v-778c8848><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 6v6m0 0v6m0-6h6m-6 0H6" data-v-778c8848></path></svg> Ajouter votre premier produit </button>`);
        } else {
          _push(`<button class="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-lg text-blue-600 bg-blue-100 hover:bg-blue-200 transition-colors" data-v-778c8848> Effacer les filtres </button>`);
        }
        _push(`</div></div>`);
      }
      _push(`</div></div>`);
      if (showProductModal.value) {
        _push(ssrRenderComponent(ProductFormModal, {
          product: editingProduct.value,
          onClose: closeProductModal,
          onSuccess: handleProductSuccess
        }, null, _parent));
      } else {
        _push(`<!---->`);
      }
      if (showConnectModal.value) {
        _push(ssrRenderComponent(ConnectionModal, {
          onClose: ($event) => showConnectModal.value = false,
          onConnectShopify: openShopifyModal,
          onConnectWoocommerce: openWooCommerceModal
        }, null, _parent));
      } else {
        _push(`<!---->`);
      }
      if (showShopifyModal.value) {
        _push(ssrRenderComponent(ShopifyConnectionModal, {
          onClose: ($event) => showShopifyModal.value = false,
          onSuccess: handleShopifyConnected
        }, null, _parent));
      } else {
        _push(`<!---->`);
      }
      if (showWooCommerceModal.value) {
        _push(ssrRenderComponent(WooCommerceConnectionModal, {
          onClose: ($event) => showWooCommerceModal.value = false,
          onSuccess: handleWooCommerceConnected
        }, null, _parent));
      } else {
        _push(`<!---->`);
      }
      _push(ssrRenderComponent(NotificationToast, {
        show: showNotification.value,
        message: notificationMessage.value,
        type: notificationType.value,
        onClose: ($event) => showNotification.value = false
      }, null, _parent));
      _push(`</div>`);
    };
  }
});
const _sfc_setup = _sfc_main.setup;
_sfc_main.setup = (props, ctx) => {
  const ssrContext = useSSRContext();
  (ssrContext.modules || (ssrContext.modules = /* @__PURE__ */ new Set())).add("pages/products.vue");
  return _sfc_setup ? _sfc_setup(props, ctx) : void 0;
};
const products = /* @__PURE__ */ _export_sfc(_sfc_main, [["__scopeId", "data-v-778c8848"]]);

export { products as default };
//# sourceMappingURL=products-DcKv6s51.mjs.map
