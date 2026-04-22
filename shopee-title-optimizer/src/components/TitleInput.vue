<template>
  <div class="mb-4">
    <label class="block text-sm font-medium text-gray-700 mb-2">
      <span class="text-green-500 mr-1">💬</span>原始商品标题
    </label>
    <textarea
      :value="modelValue"
      @input="$emit('update:modelValue', $event.target.value)"
      rows="3"
      class="w-full px-4 py-3 border-2 border-green-100 rounded-xl focus:ring-2 focus:ring-green-400 focus:border-green-300 resize-none bg-green-50/30 transition-all"
      placeholder="请输入您的商品标题，我会为您优化..."
    ></textarea>
    <div class="flex justify-between items-center mt-2">
      <span v-if="error" class="text-red-500 text-sm">{{ error }}</span>
      <span v-else class="text-sm text-green-500">✨ 输入后选择地区即可优化</span>
      <span :class="['text-sm font-medium', charCountColor]">{{ charCount }}/120</span>
    </div>
  </div>
</template>

<script setup>
import { computed } from 'vue'

const props = defineProps({
  modelValue: {
    type: String,
    default: ''
  },
  error: {
    type: String,
    default: ''
  }
})

defineEmits(['update:modelValue'])

const charCount = computed(() => props.modelValue.length)
const charCountColor = computed(() => {
  if (charCount.value > 120) return 'text-red-500'
  if (charCount.value > 100) return 'text-yellow-500'
  return 'text-green-500'
})
</script>
