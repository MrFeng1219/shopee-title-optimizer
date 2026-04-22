<template>
  <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
    <SiteCard
      v-for="site in sites"
      :key="site.code"
      :site="site"
      :versions="results[site.code] || []"
      :loading="loading && currentProgress < totalProgress"
      :isCopied="copiedCode === site.code"
      :isActive="selectedCode === site.code"
      @copy="$emit('copy', site.code, $event)"
    />
  </div>
</template>

<script setup>
import SiteCard from './SiteCard.vue'

defineProps({
  sites: {
    type: Array,
    required: true
  },
  results: {
    type: Object,
    default: () => ({})
  },
  loading: {
    type: Boolean,
    default: false
  },
  currentProgress: {
    type: Number,
    default: 0
  },
  totalProgress: {
    type: Number,
    default: 7
  },
  copiedCode: {
    type: String,
    default: ''
  },
  selectedCode: {
    type: String,
    default: ''
  }
})

defineEmits(['copy'])
</script>
