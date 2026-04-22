import { buildPrompt } from '../utils/constants.js'

const API_ENDPOINT = 'https://api.openai.com/v1/chat/completions'

export async function optimizeTitle(originalTitle, site, apiKey) {
  const prompt = buildPrompt(site, originalTitle)

  const response = await fetch(API_ENDPOINT, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      'Authorization': `Bearer ${apiKey}`
    },
    body: JSON.stringify({
      model: 'gpt-4o',
      messages: [
        {
          role: 'system',
          content: 'You are a helpful assistant that optimizes product titles for e-commerce platforms.'
        },
        {
          role: 'user',
          content: prompt
        }
      ],
      max_tokens: 200,
      temperature: 0.7
    })
  })

  if (!response.ok) {
    const error = await response.json().catch(() => ({}))
    throw new Error(error.error?.message || `API Error: ${response.status}`)
  }

  const data = await response.json()
  return data.choices[0]?.message?.content?.trim() || ''
}

export async function optimizeAllSites(originalTitle, sites, apiKey, onProgress) {
  const results = {}

  for (let i = 0; i < sites.length; i++) {
    const site = sites[i]
    try {
      results[site.code] = await optimizeTitle(originalTitle, site, apiKey)
    } catch (error) {
      results[site.code] = `优化失败: ${error.message}`
    }
    if (onProgress) {
      onProgress(i + 1, sites.length)
    }
  }

  return results
}
