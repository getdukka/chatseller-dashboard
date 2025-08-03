<template>
  <Switch
    v-model="enabled"
    :class="[
      enabled ? 'bg-blue-600' : 'bg-gray-200',
      'relative inline-flex h-6 w-11 flex-shrink-0 cursor-pointer rounded-full border-2 border-transparent transition-colors duration-200 ease-in-out focus:outline-none focus:ring-2 focus:ring-blue-600 focus:ring-offset-2'
    ]"
  >
    <span class="sr-only">{{ label }}</span>
    <span
      :class="[
        enabled ? 'translate-x-5' : 'translate-x-0',
        'pointer-events-none inline-block h-5 w-5 transform rounded-full bg-white shadow ring-0 transition duration-200 ease-in-out'
      ]"
    />
  </Switch>
</template>

<script setup lang="ts">
import { computed } from 'vue'
import { Switch } from '@headlessui/vue'

// Props
const props = defineProps<{
  modelValue: boolean
  label?: string
}>()

// Emits
const emit = defineEmits<{
  'update:modelValue': [value: boolean]
}>()

// Computed
const enabled = computed({
  get: () => props.modelValue,
  set: (value) => emit('update:modelValue', value)
})
</script>