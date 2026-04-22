export const SHOPEE_SITES = [
  { code: 'TW', name: '台湾', flag: '🇹🇼', currency: 'TWD', language: '中文' },
  { code: 'MY', name: '马来西亚', flag: '🇲🇾', currency: 'MYR', language: '英语' },
  { code: 'SG', name: '新加坡', flag: '🇸🇬', currency: 'SGD', language: '英语' },
  { code: 'PH', name: '菲律宾', flag: '🇵🇭', currency: 'PHP', language: '英语' },
  { code: 'TH', name: '泰国', flag: '🇹🇭', currency: 'THB', language: '泰语' },
  { code: 'VN', name: '越南', flag: '🇻🇳', currency: 'VND', language: '越南语' },
  { code: 'ID', name: '印度尼西亚', flag: '🇮🇩', currency: 'IDR', language: '印尼语' }
]

export const PROMPT_TEMPLATE = `You are a Shopee marketplace expert. Optimize the following product title for the {SITE_NAME} ({SITE_CODE}) Shopee marketplace.

Original Title: {ORIGINAL_TITLE}

Requirements:
1. Keep the title within 50-120 characters for Shopee SEO
2. Include popular search keywords for {SITE_NAME} market
3. Use local language style and search habits
4. Highlight key product features
5. Add relevant emoji icons at appropriate positions (1-3 emojis)
6. Provide EXACTLY 3 different versions with distinct advantages
7. For each version, provide a brief Chinese explanation of the optimization strategy

Output format (MUST follow exactly):
[Version 1] <optimized title with emoji>
<中文释义: xxx>
[Version 2] <optimized title with emoji>
<中文释义: xxx>
[Version 3] <optimized title with emoji>
<中文释义: xxx>

Do NOT include any other text.`

export function buildPrompt(site, originalTitle) {
  return PROMPT_TEMPLATE
    .replace('{SITE_NAME}', site.name)
    .replace('{SITE_CODE}', site.code)
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

    const explanationMatch = trimmedLine.match(/^<中文释义:\s*(.+)>$/)
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
