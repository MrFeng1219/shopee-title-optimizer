<template>
  <div class="min-h-screen bg-gradient-to-br from-orange-50 to-amber-50 py-8 px-4">
    <div class="max-w-4xl mx-auto">
      <header class="text-center mb-8">
        <h1 class="text-3xl font-bold text-gray-800 mb-2">Shopee Title Optimizer</h1>
        <p class="text-gray-500">AI驱动的多站点商品标题优化工具</p>
      </header>

      <div class="bg-white rounded-2xl shadow-xl p-6 mb-6">
        <TitleInput
          v-model="originalTitle"
          :error="inputError"
        />

        <div class="flex gap-3 mb-4">
          <OptimizeButton
            @click="handleOptimize"
            :loading="isLoading"
            :disabled="!canOptimize"
            :progress="progressText"
            buttonText="AI优化标题"
          />

          <button
            v-if="hasResults"
            @click="handleCopyAll"
            :class="[
              'py-3 px-6 rounded-lg font-medium transition-all',
              copiedAll
                ? 'bg-green-100 text-green-700 border border-green-300'
                : 'bg-gray-100 hover:bg-gray-200 text-gray-700'
            ]"
          >
            {{ copiedAll ? '已全部复制!' : '复制全部' }}
          </button>
        </div>

        <div v-if="errorMessage" class="mb-4 p-4 bg-red-50 border border-red-200 rounded-lg">
          <p class="text-red-600 text-sm">{{ errorMessage }}</p>
          <button
            @click="errorMessage = ''"
            class="text-red-400 hover:text-red-600 text-xs mt-1"
          >
            关闭
          </button>
        </div>
      </div>

      <SiteTabs
        v-if="hasResults"
        :sites="SHOPEE_SITES"
        :selectedCode="selectedSite"
        @select="selectedSite = $event"
      />

      <ResultPanel
        v-if="hasResults"
        :sites="SHOPEE_SITES"
        :results="optimizedResults"
        :loading="isLoading"
        :currentProgress="currentProgress"
        :totalProgress="SHOPEE_SITES.length"
        :copiedCode="copiedCode"
        :selectedCode="selectedSite"
        @copy="handleCopySingle"
      />

      <footer class="mt-8 text-center">
        <button
          @click="showSettings = true"
          class="text-gray-400 hover:text-gray-600 text-sm transition-colors"
        >
          设置 API Key
        </button>
      </footer>
    </div>

    <SettingsPanel
      :isOpen="showSettings"
      :apiKey="apiKey"
      @close="showSettings = false"
      @save="handleSaveApiKey"
    />
  </div>
</template>

<script setup>
import { ref, computed, onMounted } from 'vue'
import TitleInput from './components/TitleInput.vue'
import OptimizeButton from './components/OptimizeButton.vue'
import SiteTabs from './components/SiteTabs.vue'
import ResultPanel from './components/ResultPanel.vue'
import SettingsPanel from './components/SettingsPanel.vue'
import { SHOPEE_SITES } from './utils/constants.js'
import { optimizeAllSites } from './services/aiService.js'

const originalTitle = ref('')
const optimizedResults = ref({})
const isLoading = ref(false)
const currentProgress = ref(0)
const errorMessage = ref('')
const apiKey = ref('')
const showSettings = ref(false)
const copiedCode = ref('')
const copiedAll = ref(false)
const selectedSite = ref('TW')

const inputError = computed(() => {
  if (originalTitle.value && originalTitle.value.length < 3) {
    return '标题至少需要3个字符'
  }
  return ''
})

const canOptimize = computed(() => {
  return originalTitle.value.length >= 3
})

const hasResults = computed(() => {
  return Object.keys(optimizedResults.value).length > 0
})

const progressText = computed(() => {
  if (!isLoading.value) return ''
  return `${currentProgress.value}/${SHOPEE_SITES.length}`
})

onMounted(() => {
  const savedKey = localStorage.getItem('shopee_optimizer_api_key')
  if (savedKey) {
    apiKey.value = savedKey
  }
})

async function handleOptimize() {
  if (!canOptimize.value) return

  if (!apiKey.value) {
    errorMessage.value = '请先设置API Key'
    showSettings.value = true
    return
  }

  isLoading.value = true
  currentProgress.value = 0
  errorMessage.value = ''
  optimizedResults.value = {}

  try {
    optimizedResults.value = await optimizeAllSites(
      originalTitle.value,
      SHOPEE_SITES,
      apiKey.value,
      (current, total) => {
        currentProgress.value = current
      }
    )
  } catch (error) {
    errorMessage.value = error.message || '优化失败，请重试'
  } finally {
    isLoading.value = false
  }
}

function handleCopySingle(code) {
  const title = optimizedResults.value[code]
  if (title) {
    navigator.clipboard.writeText(title).then(() => {
      copiedCode.value = code
      setTimeout(() => {
        copiedCode.value = ''
      }, 2000)
    })
  }
}

function handleCopyAll() {
  const allTitles = SHOPEE_SITES
    .map(site => `${site.flag} ${site.name}: ${optimizedResults.value[site.code] || ''}`)
    .join('\n')

  navigator.clipboard.writeText(allTitles).then(() => {
    copiedAll.value = true
    setTimeout(() => {
      copiedAll.value = false
    }, 2000)
  })
}

function handleSaveApiKey(key) {
  apiKey.value = key
  localStorage.setItem('shopee_optimizer_api_key', key)
  showSettings.value = false
}
</script>
