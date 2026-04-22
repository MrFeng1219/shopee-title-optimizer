<template>
  <div
    :class="[
      'bg-white rounded-xl shadow-md hover:shadow-lg transition-all p-4 border-2',
      isActive ? 'border-orange-500' : 'border-transparent'
    ]"
  >
    <div class="flex items-center gap-2 mb-2">
      <span class="text-2xl">{{ site.flag }}</span>
      <span class="font-semibold text-gray-800">{{ site.name }}</span>
      <span class="text-xs text-gray-400 ml-auto">{{ site.language }}</span>
    </div>

    <div v-if="loading" class="flex items-center gap-2 text-gray-500 py-4">
      <svg class="animate-spin h-5 w-5" viewBox="0 0 24 24">
        <circle class="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" stroke-width="4" fill="none" />
        <path class="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z" />
      </svg>
      <span class="text-sm">生成中...</span>
    </div>

    <p v-else-if="optimizedTitle" class="text-gray-700 text-sm leading-relaxed min-h-[60px]">
      {{ optimizedTitle }}
    </p>
    <p v-else class="text-gray-400 text-sm italic py-4">
      输入标题并点击优化按钮
    </p>

    <button
      v-if="optimizedTitle && !loading"
      @click="$emit('copy')"
      :class="[
        'mt-3 w-full py-2 px-4 rounded-lg text-sm font-medium transition-all',
        isCopied
          ? 'bg-green-100 text-green-700 border border-green-300'
          : 'bg-gray-100 hover:bg-gray-200 text-gray-700'
      ]"
    >
      {{ isCopied ? '已复制!' : '复制标题' }}
    </button>
  </div>
</template>

<script setup>
defineProps({
  site: {
    type: Object,
    required: true
  },
  optimizedTitle: {
    type: String,
    default: ''
  },
  loading: {
    type: Boolean,
    default: false
  },
  isCopied: {
    type: Boolean,
    default: false
  },
  isActive: {
    type: Boolean,
    default: false
  }
})

defineEmits(['copy'])
</script>
