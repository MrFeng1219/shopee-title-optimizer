import { buildPrompt, parseMultiVersions } from '../utils/constants.js'

const API_ENDPOINT = 'https://dashscope.aliyuncs.com/compatible-mode/v1/chat/completions'
const MODEL = 'qwen-plus'

export async function optimizeTitle(originalTitle, site, apiKey) {
  const prompt = buildPrompt(site, originalTitle)

  const response = await fetch(API_ENDPOINT, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      'Authorization': `Bearer ${apiKey}`
    },
    body: JSON.stringify({
      model: MODEL,
      messages: [
        {
          role: 'system',
          content: 'You are a helpful assistant that optimizes product titles for Shopee e-commerce platform. Follow the output format exactly as specified.'
        },
        {
          role: 'user',
          content: prompt
        }
      ],
      max_tokens: 500,
      temperature: 0.8
    })
  })

  if (!response.ok) {
    const error = await response.json().catch(() => ({}))
    throw new Error(error.error?.message || `API Error: ${response.status}`)
  }

  const data = await response.json()
  const rawResponse = data.choices[0]?.message?.content?.trim() || ''
  return parseMultiVersions(rawResponse)
}

export function optimizeAllSitesAsync(originalTitle, selectedSites, apiKey, onResult, onProgress) {
  let completedCount = 0
  const totalCount = selectedSites.length

  selectedSites.forEach(site => {
    optimizeTitle(originalTitle, site, apiKey)
      .then(versions => {
        completedCount++
        onResult(site.code, versions)
        onProgress(completedCount, totalCount)
      })
      .catch(error => {
        completedCount++
        onResult(site.code, [{ version: 1, title: `优化失败: ${error.message}` }])
        onProgress(completedCount, totalCount)
      })
  })
}
