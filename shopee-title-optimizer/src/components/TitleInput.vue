<template>
  <div class="mb-4">
    <label class="block text-sm font-medium text-gray-700 mb-2">原始商品标题</label>
    <textarea
      :value="modelValue"
      @input="$emit('update:modelValue', $event.target.value)"
      rows="3"
      class="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-orange-500 resize-none"
      placeholder="请输入您的商品标题..."
    ></textarea>
    <div class="flex justify-between items-center mt-1">
      <span v-if="error" class="text-red-500 text-sm">{{ error }}</span>
      <span v-else class="text-sm text-gray-400">最少3个字符</span>
      <span :class="['text-sm', charCountColor]">{{ charCount }}/120</span>
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
  return 'text-gray-400'
})
</script>
