export const SHOPEE_SITES = [
  { code: 'TW', name: '台湾', flag: '🇹🇼', currency: 'TWD', language: 'zh-TW' },
  { code: 'MY', name: '马来西亚', flag: '🇲🇾', currency: 'MYR', language: 'en-MY' },
  { code: 'SG', name: '新加坡', flag: '🇸🇬', currency: 'SGD', language: 'en-SG' },
  { code: 'PH', name: '菲律宾', flag: '🇵🇭', currency: 'PHP', language: 'en-PH' },
  { code: 'TH', name: '泰国', flag: '🇹🇭', currency: 'THB', language: 'th-TH' },
  { code: 'VN', name: '越南', flag: '🇻🇳', currency: 'VND', language: 'vi-VN' },
  { code: 'ID', name: '印度尼西亚', flag: '🇮🇩', currency: 'IDR', language: 'id-ID' }
]

export const PROMPT_TEMPLATE = `You are a Shopee marketplace expert for {SITE_NAME} market.

Original Title: {ORIGINAL_TITLE}

CRITICAL REQUIREMENTS:
1. The optimized title MUST be written in {SITE_LANGUAGE} ONLY - do NOT mix in Chinese characters
2. Keep the title within 50-120 characters for Shopee SEO
3. Include popular local search keywords for {SITE_NAME} market
4. Use local language style, search habits and expressions
5. Add 1-3 relevant emoji icons to make it attractive
6. Provide EXACTLY 3 different versions with distinct styles/approaches

Output format (MUST follow exactly):
[Version 1] <optimized title in {SITE_LANGUAGE} only, with emoji>
<中文释义: 简要说明此版本的优化策略>
[Version 2] <optimized title in {SITE_LANGUAGE} only, with emoji>
<中文释义: 简要说明此版本的优化策略>
[Version 3] <optimized title in {SITE_LANGUAGE} only, with emoji>
<中文释义: 简要说明此版本的优化策略>

IMPORTANT: The title itself must contain ONLY {SITE_LANGUAGE} text and emojis. No Chinese characters in the title lines. Only the explanation line should be in Chinese.`

export function buildPrompt(site, originalTitle) {
  return PROMPT_TEMPLATE
    .replace('{SITE_NAME}', site.name)
    .replace('{SITE_CODE}', site.code)
    .replace('{SITE_LANGUAGE}', site.language)
    .replace('{ORIGINAL_TITLE}', originalTitle)
}

export function parseMultiVersions(response) {
  const versions = []
  const lines = response.split('\n')

  let currentVersion = null

  for (const line of lines) {
    const trimmedLine = line.trim()
    if (!trimmedLine) continue

    const versionMatch = trimmedLine.match(/\[Version\s*(\d+)\]\s*(.+)/i)
    if (versionMatch) {
      if (currentVersion) {
        versions.push(currentVersion)
      }
      currentVersion = {
        version: parseInt(versionMatch[1]),
        title: versionMatch[2].trim(),
        explanation: ''
      }
      continue
    }

    const explanationMatch = trimmedLine.match(/^<中文释义:\s*(.+)>$/i)
    if (explanationMatch && currentVersion) {
      currentVersion.explanation = explanationMatch[1].trim()
    }
  }

  if (currentVersion) {
    versions.push(currentVersion)
  }

  if (versions.length === 0) {
    lines.forEach((line, idx) => {
      const trimmed = line.trim()
      if (trimmed && idx < 3) {
        versions.push({
          version: idx + 1,
          title: trimmed,
          explanation: ''
        })
      }
    })
  }

  return versions.slice(0, 3)
}
