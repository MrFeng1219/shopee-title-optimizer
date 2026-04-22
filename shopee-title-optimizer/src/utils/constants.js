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
5. Do not include special characters or excessive punctuation

Optimized Title (only output the title, no explanation):`

export function buildPrompt(site, originalTitle) {
  return PROMPT_TEMPLATE
    .replace('{SITE_NAME}', site.name)
    .replace('{SITE_CODE}', site.code)
    .replace('{ORIGINAL_TITLE}', originalTitle)
}
