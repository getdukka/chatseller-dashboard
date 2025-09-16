<!-- components/SyncModal.vue -->
<template>
  <div class="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
    <div class="bg-white rounded-xl p-6 max-w-md w-full mx-4">
      <h3 class="text-lg font-semibold mb-4">Synchroniser votre boutique</h3>
      
      <form @submit.prevent="handleSubmit">
        <div class="mb-4">
          <label class="block text-sm font-medium mb-2">Plateforme</label>
          <select v-model="form.platform" class="w-full border rounded-lg px-3 py-2">
            <option value="shopify">Shopify</option>
            <option value="woocommerce">WooCommerce</option>
          </select>
        </div>
        
        <div class="mb-4">
          <label class="block text-sm font-medium mb-2">URL de la boutique</label>
          <input 
            v-model="form.shop_url" 
            type="url" 
            class="w-full border rounded-lg px-3 py-2"
            placeholder="https://votre-boutique.myshopify.com"
          >
        </div>
        
        <div class="mb-6">
          <label class="block text-sm font-medium mb-2">Token d'accès</label>
          <input 
            v-model="form.access_token" 
            type="password" 
            class="w-full border rounded-lg px-3 py-2"
            placeholder="Votre token API"
          >
        </div>
        
        <div class="flex justify-end space-x-3">
          <button 
            type="button" 
            @click="$emit('close')"
            class="px-4 py-2 border rounded-lg hover:bg-gray-50"
          >
            Annuler
          </button>
          <button 
            type="submit"
            class="px-4 py-2 bg-rose-600 text-white rounded-lg hover:bg-rose-700"
          >
            Synchroniser
          </button>
        </div>
      </form>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref } from 'vue'

const emit = defineEmits(['close', 'sync'])

const form = ref({
  platform: 'shopify',
  shop_url: '',
  access_token: ''
})

const handleSubmit = () => {
  emit('sync', form.value.platform, form.value)
}
</script>