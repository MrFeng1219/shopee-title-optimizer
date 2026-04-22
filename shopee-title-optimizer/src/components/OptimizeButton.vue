<template>
  <button
    @click="$emit('click')"
    :disabled="disabled || loading"
    :class="[
      'w-full py-3 px-6 rounded-lg font-medium transition-all',
      disabled || loading
        ? 'bg-gray-300 text-gray-500 cursor-not-allowed'
        : 'bg-orange-500 hover:bg-orange-600 text-white shadow-lg hover:shadow-xl'
    ]"
  >
    <span v-if="loading" class="flex items-center justify-center gap-2">
      <svg class="animate-spin h-5 w-5" viewBox="0 0 24 24">
        <circle class="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" stroke-width="4" fill="none" />
        <path class="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z" />
      </svg>
      优化中... {{ progress }}
    </span>
    <span v-else>{{ buttonText }}</span>
  </button>
</template>

<script setup>
defineProps({
  loading: {
    type: Boolean,
    default: false
  },
  disabled: {
    type: Boolean,
    default: false
  },
  progress: {
    type: String,
    default: ''
  },
  buttonText: {
    type: String,
    default: 'AI优化标题'
  }
})

defineEmits(['click'])
</script>
