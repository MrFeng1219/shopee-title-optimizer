<template>
  <div class="min-h-screen bg-gradient-to-br from-green-50 via-white to-emerald-50">
    <div class="max-w-4xl mx-auto px-4 py-6">
      <header class="text-center mb-6">
        <h1 class="text-2xl md:text-3xl font-bold bg-gradient-to-r from-green-500 to-emerald-500 bg-clip-text text-transparent mb-2">
          ✨ Shopee爆款标题神器 ✨
        </h1>
        <p class="text-gray-500 text-sm">AI智能优化，一键生成多个地区爆款标题</p>
      </header>

      <div class="bg-white rounded-2xl shadow-lg p-5 mb-5 border border-green-100">
        <TitleInput
          v-model="originalTitle"
          :error="inputError"
        />

        <div class="mb-4">
          <label class="block text-sm font-medium text-gray-700 mb-2">选择目标地区</label>
          <div class="flex flex-wrap gap-2">
            <button
              v-for="site in SHOPEE_SITES"
              :key="site.code"
              @click="toggleSite(site.code)"
              class="px-3 py-1.5 rounded-full text-sm font-medium transition-all duration-300 transform hover:scale-105 active:scale-95"
              :class="[
                selectedSites.includes(site.code)
                  ? 'bg-gradient-to-r from-green-500 to-emerald-500 text-white shadow-md'
                  : 'bg-gray-100 text-gray-600 hover:bg-green-50'
              ]"
            >
              {{ site.flag }} {{ site.name }}
            </button>
          </div>
          <p class="text-xs text-gray-400 mt-2">已选择 {{ selectedSites.length }} 个地区</p>
        </div>

        <div class="flex gap-3">
          <OptimizeButton
            @click="handleOptimize"
            :loading="isLoading"
            :disabled="!canOptimize || selectedSites.length === 0"
            :progress="progressText"
            buttonText="开始优化"
          />

          <button
            v-if="hasResults && !isLoading"
            @click="handleCopyAll"
            class="flex-1 py-3 px-4 rounded-xl font-medium transition-all duration-300 shadow-sm transform hover:scale-[1.02] active:scale-[0.98]"
            :class="[
              copiedAll
                ? 'bg-green-600 text-white'
                : 'bg-gradient-to-r from-gray-50 to-gray-100 hover:from-gray-100 hover:to-gray-200 text-gray-700'
            ]"
          >
            {{ copiedAll ? '✓ 已复制!' : '📋 复制全部' }}
          </button>
        </div>

        <div v-if="errorMessage" class="mt-4 p-4 bg-red-50 border border-red-200 rounded-xl">
          <p class="text-red-600 text-sm">{{ errorMessage }}</p>
        </div>
      </div>

      <transition
        enter-active-class="transition-all duration-500 ease-out"
        enter-from-class="opacity-0 translate-y-4"
        enter-to-class="opacity-100 translate-y-0"
      >
        <div v-if="isLoading" class="mb-4">
          <div class="flex items-center justify-between mb-3">
            <h2 class="text-lg font-semibold text-gray-700 flex items-center gap-2">
              <span class="animate-spin">🌀</span> 优化中...
            </h2>
            <span class="text-sm text-green-600 bg-green-50 px-3 py-1 rounded-full font-medium">
              {{ currentProgress }}/{{ totalProgress }} 完成
            </span>
          </div>

          <div class="relative w-full h-3 bg-gray-100 rounded-full overflow-hidden shadow-inner">
            <div
              class="absolute top-0 left-0 h-full bg-gradient-to-r from-green-400 via-emerald-400 to-green-500 rounded-full transition-all duration-500"
              :style="{ width: progressPercent + '%' }"
            >
              <div class="absolute inset-0 bg-gradient-to-r from-transparent via-white/40 to-transparent animate-shimmer"></div>
            </div>
          </div>

          <div class="grid grid-cols-1 md:grid-cols-2 gap-4 mt-6">
            <transition-group
              appear
              enter-active-class="transition-all duration-500 ease-out"
              enter-from-class="opacity-0 translate-y-4 scale-95"
              enter-to-class="opacity-100 translate-y-0 scale-100"
            >
              <SiteCard
                v-for="(site, index) in selectedSitesData"
                :key="site.code"
                :site="site"
                :versions="optimizedResults[site.code] || null"
                :isCopied="copiedCode === site.code"
                :isLoading="!optimizedResults[site.code]"
                :delay="index * 100"
                @copy="handleCopySingle"
              />
            </transition-group>
          </div>
        </div>
      </transition>

      <transition
        enter-active-class="transition-all duration-500 ease-out"
        enter-from-class="opacity-0 translate-y-4"
        enter-to-class="opacity-100 translate-y-0"
      >
        <div v-if="hasResults && !isLoading" class="mb-4">
          <div class="flex items-center justify-between mb-3">
            <h2 class="text-lg font-semibold text-gray-700">优化结果</h2>
            <span class="text-xs text-green-600 bg-green-50 px-3 py-1 rounded-full">
              ✓ 全部完成
            </span>
          </div>

          <div class="grid grid-cols-1 md:grid-cols-2 gap-4">
            <transition-group
              appear
              enter-active-class="transition-all duration-500 ease-out"
              enter-from-class="opacity-0 translate-y-4 scale-95"
              enter-to-class="opacity-100 translate-y-0 scale-100"
            >
              <SiteCard
                v-for="(site, index) in selectedSitesData"
                :key="site.code"
                :site="site"
                :versions="optimizedResults[site.code] || null"
                :isCopied="copiedCode === site.code"
                :delay="index * 80"
                @copy="handleCopySingle"
              />
            </transition-group>
          </div>
        </div>
      </transition>

      <footer class="mt-8 text-center pb-6">
        <button
          @click="showSettings = true"
          class="text-green-600 hover:text-green-700 text-sm transition-colors"
        >
          ⚙️ 设置API Key
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
import SiteCard from './components/SiteCard.vue'
import SettingsPanel from './components/SettingsPanel.vue'
import { SHOPEE_SITES } from './utils/constants.js'
import { optimizeAllSitesAsync } from './services/aiService.js'

const originalTitle = ref('')
const optimizedResults = ref({})
const isLoading = ref(false)
const currentProgress = ref(0)
const totalProgress = ref(0)
const errorMessage = ref('')
const apiKey = ref('')
const showSettings = ref(false)
const copiedCode = ref('')
const copiedAll = ref(false)
const selectedSites = ref(['TW'])

const inputError = computed(() => {
  if (originalTitle.value && originalTitle.value.length < 3) {
    return '标题至少需要3个字符'
  }
  return ''
})

const canOptimize = computed(() => {
  return originalTitle.value.length >= 3 && selectedSites.value.length > 0
})

const hasResults = computed(() => {
  return Object.keys(optimizedResults.value).length > 0
})

const progressPercent = computed(() => {
  if (totalProgress.value === 0) return 0
  return Math.round((currentProgress.value / totalProgress.value) * 100)
})

const progressText = computed(() => {
  if (!isLoading.value) return ''
  return `${currentProgress.value}/${totalProgress.value}`
})

const selectedSitesData = computed(() => {
  return SHOPEE_SITES.filter(site => selectedSites.value.includes(site.code))
})

function toggleSite(code) {
  const idx = selectedSites.value.indexOf(code)
  if (idx === -1) {
    selectedSites.value.push(code)
  } else {
    if (selectedSites.value.length > 1) {
      selectedSites.value.splice(idx, 1)
    }
  }
}

onMounted(() => {
  const savedKey = localStorage.getItem('shopee_optimizer_api_key')
  if (savedKey) {
    apiKey.value = savedKey
  }
})

function handleOptimize() {
  if (!canOptimize.value) return

  if (!apiKey.value) {
    errorMessage.value = '请先设置阿里云百炼API Key'
    showSettings.value = true
    return
  }

  isLoading.value = true
  currentProgress.value = 0
  totalProgress.value = selectedSites.value.length
  errorMessage.value = ''
  optimizedResults.value = {}

  const sitesToOptimize = SHOPEE_SITES.filter(site => selectedSites.value.includes(site.code))

  optimizeAllSitesAsync(
    originalTitle.value,
    sitesToOptimize,
    apiKey.value,
    (code, versions) => {
      optimizedResults.value[code] = versions
    },
    (completed, total) => {
      currentProgress.value = completed
      if (completed === total) {
        isLoading.value = false
      }
    }
  )
}

function handleCopySingle(code, title) {
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
  const allTitles = selectedSitesData.value
    .map(site => {
      const versions = optimizedResults.value[site.code]
      const selectedTitle = versions?.[0]?.title || ''
      return `${site.flag} ${site.name}: ${selectedTitle}`
    })
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

<style>
@keyframes shimmer {
  0% { transform: translateX(-100%); }
  100% { transform: translateX(100%); }
}

.animate-shimmer {
  animation: shimmer 1.5s infinite;
}
</style>
