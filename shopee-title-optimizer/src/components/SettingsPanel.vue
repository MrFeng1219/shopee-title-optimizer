<template>
  <div
    v-if="isOpen"
    class="fixed inset-0 bg-black/40 backdrop-blur-sm flex items-center justify-center z-50 p-4"
    @click.self="$emit('close')"
  >
    <div class="bg-white rounded-3xl shadow-2xl w-full max-w-md p-6 border border-green-100">
      <div class="flex items-center justify-between mb-6">
        <h3 class="text-lg font-bold text-gray-800 flex items-center gap-2">
          <span>⚙️</span> 设置
        </h3>
        <button
          @click="$emit('close')"
          class="text-gray-400 hover:text-green-500 transition-colors"
        >
          <svg class="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12" />
          </svg>
        </button>
      </div>

      <div class="mb-6">
        <label class="block text-sm font-medium text-gray-700 mb-2">
          🔑 阿里云百炼 API Key
        </label>
        <input
          v-model="apiKeyInput"
          type="password"
          class="w-full px-4 py-3 border-2 border-green-100 rounded-xl focus:ring-2 focus:ring-green-400 focus:border-green-300 bg-green-50/30 transition-all"
          placeholder="sk-..."
        />
        <p class="text-xs text-gray-400 mt-2">
          <a href="https://bailian.console.aliyun.com" target="_blank" class="text-green-500 hover:underline">点击获取API Key</a>
        </p>
      </div>

      <div class="flex gap-3">
        <button
          @click="$emit('save', apiKeyInput)"
          class="flex-1 bg-gradient-to-r from-green-500 to-emerald-500 hover:from-green-600 hover:to-emerald-600 text-white py-3 px-4 rounded-xl font-medium transition-all shadow-md hover:shadow-lg"
        >
          ✓ 保存
        </button>
        <button
          @click="$emit('close')"
          class="flex-1 bg-gray-100 hover:bg-gray-200 text-gray-700 py-3 px-4 rounded-xl font-medium transition-all"
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
