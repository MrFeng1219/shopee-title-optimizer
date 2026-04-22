<template>
  <button
    @click="$emit('click')"
    :disabled="disabled || loading"
    class="flex-1 py-3 px-6 rounded-xl font-medium transition-all duration-300 shadow-md transform hover:scale-[1.02] active:scale-[0.98]"
    :class="[
      disabled || loading
        ? 'bg-gray-200 text-gray-400 cursor-not-allowed'
        : 'bg-gradient-to-r from-green-500 to-emerald-500 hover:from-green-600 hover:to-emerald-600 text-white hover:shadow-lg'
    ]"
  >
    <span v-if="loading" class="flex items-center justify-center gap-2">
      <svg class="animate-spin h-5 w-5" viewBox="0 0 24 24">
        <circle class="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" stroke-width="4" fill="none" />
        <path class="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z" />
      </svg>
      {{ progress }}
    </span>
    <span v-else>🚀 {{ buttonText }}</span>
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
