<template>
  <div class="mb-6">
    <div class="flex flex-wrap gap-2 border-b border-gray-200 pb-2">
      <button
        v-for="site in sites"
        :key="site.code"
        @click="$emit('select', site.code)"
        :class="[
          'px-4 py-2 rounded-lg font-medium transition-all text-sm',
          selectedCode === site.code
            ? 'bg-orange-500 text-white shadow'
            : 'bg-gray-100 hover:bg-gray-200 text-gray-700'
        ]"
      >
        {{ site.flag }} {{ site.name }}
      </button>
    </div>
  </div>
</template>

<script setup>
defineProps({
  sites: {
    type: Array,
    required: true
  },
  selectedCode: {
    type: String,
    default: ''
  }
})

defineEmits(['select'])
</script>
