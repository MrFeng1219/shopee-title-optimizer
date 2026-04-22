<template>
  <div
    v-if="isOpen"
    class="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4"
    @click.self="$emit('close')"
  >
    <div class="bg-white rounded-xl shadow-2xl w-full max-w-md p-6">
      <div class="flex items-center justify-between mb-4">
        <h3 class="text-lg font-semibold text-gray-800">设置</h3>
        <button
          @click="$emit('close')"
          class="text-gray-400 hover:text-gray-600 transition-colors"
        >
          <svg class="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12" />
          </svg>
        </button>
      </div>

      <div class="mb-4">
        <label class="block text-sm font-medium text-gray-700 mb-2">OpenAI API Key</label>
        <input
          v-model="apiKeyInput"
          type="password"
          class="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-orange-500"
          placeholder="sk-..."
        />
        <p class="text-xs text-gray-400 mt-2">API Key仅存储在本地浏览器中</p>
      </div>

      <div class="flex gap-3">
        <button
          @click="$emit('save', apiKeyInput)"
          class="flex-1 bg-orange-500 hover:bg-orange-600 text-white py-2 px-4 rounded-lg font-medium transition-colors"
        >
          保存
        </button>
        <button
          @click="$emit('close')"
          class="flex-1 bg-gray-100 hover:bg-gray-200 text-gray-700 py-2 px-4 rounded-lg font-medium transition-colors"
        >
          取消
        </button>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, watch } from 'vue'

const props = defineProps({
  isOpen: {
    type: Boolean,
    default: false
  },
  apiKey: {
    type: String,
    default: ''
  }
})

const emit = defineEmits(['close', 'save'])

const apiKeyInput = ref('')

watch(() => props.isOpen, (newVal) => {
  if (newVal) {
    apiKeyInput.value = props.apiKey
  }
})
</script>
