<template>
  <div
    class="bg-white rounded-2xl shadow-md hover:shadow-lg transition-all duration-500 border border-green-100 overflow-hidden"
    :class="{ 'opacity-0 translate-y-4': isInitial }"
    :style="{ transitionDelay: delay + 'ms' }"
  >
    <div class="bg-gradient-to-r from-green-100 to-emerald-100 px-4 py-3 flex items-center gap-2">
      <span class="text-xl">{{ site.flag }}</span>
      <span class="font-semibold text-gray-700">{{ site.name }}</span>
      <span class="text-xs text-green-600 ml-auto bg-white px-2 py-0.5 rounded-full">
        {{ site.language }}
      </span>
    </div>

    <div class="p-4">
      <transition
        mode="out-in"
        enter-active-class="transition-all duration-500 ease-out"
        enter-from-class="opacity-0 translate-y-2"
        enter-to-class="opacity-100 translate-y-0"
        leave-active-class="transition-all duration-300 ease-in"
        leave-from-class="opacity-100 translate-y-0"
        leave-to-class="opacity-0 -translate-y-2"
      >
        <div v-if="isLoading" key="loading" class="text-center py-6">
          <div class="relative w-12 h-12 mx-auto mb-3">
            <div class="absolute inset-0 border-4 border-green-200 rounded-full"></div>
            <div class="absolute inset-0 border-4 border-green-500 rounded-full border-t-transparent animate-spin"></div>
          </div>
          <p class="text-sm text-green-600 font-medium">正在优化...</p>
        </div>

        <div v-else-if="versions && versions.length > 0" key="content" class="space-y-3">
          <div
            v-for="(v, idx) in versions"
            :key="idx"
            @click="selectedVersion = idx"
            class="p-3 rounded-xl border-2 cursor-pointer transition-all duration-300"
            :class="[
              selectedVersion === idx
                ? 'border-green-400 bg-gradient-to-r from-green-50 to-emerald-50 shadow-sm'
                : 'border-gray-100 hover:border-green-200'
            ]"
            :style="{ animationDelay: (idx * 100) + 'ms' }"
          >
            <div class="flex items-center gap-2 mb-2">
              <span
                :class="[
                  'text-xs px-2 py-0.5 rounded-full font-medium transition-all duration-300',
                  selectedVersion === idx ? 'bg-green-500 text-white' : 'bg-gray-100 text-gray-500'
                ]"
              >
                {{ v.version }}
              </span>
            </div>
            <p class="text-gray-700 text-sm leading-relaxed mb-2">
              {{ v.title }}
            </p>
            <transition
              enter-active-class="transition-all duration-300 ease-out"
              enter-from-class="opacity-0 max-h-0"
              enter-to-class="opacity-100 max-h-20"
              leave-active-class="transition-all duration-200 ease-in"
              leave-from-class="opacity-100 max-h-20"
              leave-to-class="opacity-0 max-h-0"
            >
              <p v-if="v.explanation" class="text-xs text-gray-500 bg-gray-50 p-2 rounded-lg overflow-hidden">
                💡 {{ v.explanation }}
              </p>
            </transition>
          </div>

          <div class="flex gap-2 mt-3">
            <button
              @click="$emit('copy', site.code, versions[selectedVersion].title)"
              class="flex-1 py-2 rounded-xl text-sm font-medium transition-all duration-300 transform hover:scale-[1.02] active:scale-[0.98]"
              :class="[
                isCopied
                  ? 'bg-green-600 text-white'
                  : 'bg-gradient-to-r from-green-500 to-emerald-500 text-white hover:from-green-600 hover:to-emerald-600 shadow-md'
              ]"
            >
              {{ isCopied ? '✓ 已复制' : '📋 复制' }}
            </button>
            <button
              @click="$emit('regenerate', site.code)"
              class="flex-1 py-2 rounded-xl text-sm font-medium transition-all duration-300 transform hover:scale-[1.02] active:scale-[0.98] bg-gray-100 hover:bg-gray-200 text-gray-600"
            >
              🔄 重新生成
            </button>
          </div>
        </div>

        <div v-else key="waiting" class="text-center py-6">
          <p class="text-xs text-gray-400">等待优化...</p>
        </div>
      </transition>
    </div>
  </div>
</template>

<script setup>
import { ref, watch } from 'vue'

const props = defineProps({
  site: {
    type: Object,
    required: true
  },
  versions: {
    type: Array,
    default: null
  },
  isCopied: {
    type: Boolean,
    default: false
  },
  isLoading: {
    type: Boolean,
    default: false
  },
  delay: {
    type: Number,
    default: 0
  },
  isInitial: {
    type: Boolean,
    default: false
  }
})

defineEmits(['copy', 'regenerate'])

const selectedVersion = ref(0)

watch(() => props.versions, () => {
  selectedVersion.value = 0
})
</script>
