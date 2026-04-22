# Shopee Title Optimizer - Requirements Document

## Introduction

一个帮助Shopee卖家将商品标题通过AI优化为各地区站点优势标题的Web工具。用户输入原始商品标题，系统自动针对不同国家和地区的Shopee平台生成符合当地市场习惯、搜索算法的优化标题。

## Glossary

- **Shopee**: 东南亚及台湾地区领先的电商平台
- **TW**: 台湾站点 (shopee.tw)
- **MY**: 马来西亚站点 (shopee.com.my)
- **SG**: 新加坡站点 (shopee.sg)
- **PH**: 菲律宾站点 (shopee.ph)
- **TH**: 泰国站点 (shopee.co.th)
- **VN**: 越南站点 (shopee.vn)
- **ID**: 印度尼西亚站点 (shopee.co.id)

## Requirements

### R1: 商品标题输入

**User Story:** AS a Shopee seller, I want to input my original product title, so that I can get optimized titles for different markets.

#### Acceptance Criteria

1. WHEN user enters a product title in the input field, the system SHALL display the character count.
2. WHEN user clicks the "Optimize" button, the system SHALL validate that the input is not empty and contains at least 3 characters.
3. WHEN user clicks the "Copy" button for a specific optimized title, the system SHALL copy the title to clipboard and display a success notification.
4. WHEN user clicks the "Copy All" button, the system SHALL copy all optimized titles to clipboard in a formatted structure.

### R2: AI标题优化

**User Story:** AS a Shopee seller, I want the AI to optimize my title for each locale, so that I can increase visibility in local search results.

#### Acceptance Criteria

1. WHEN user submits a valid product title, the system SHALL call the AI API to generate optimized titles for all 8 Shopee sites.
2. WHEN the AI returns successful results, the system SHALL display each optimized title in its corresponding site tab/card.
3. WHEN the AI call is in progress, the system SHALL display a loading indicator.
4. WHEN the AI call fails, the system SHALL display an error message and allow the user to retry.
5. WHEN user provides their own API key, the system SHALL use that key for AI requests; otherwise, a default/demo mode SHALL be used.

### R3: 多站点展示

**User Story:** AS a Shopee seller, I want to view optimized titles organized by site, so that I can easily copy titles for specific markets.

#### Acceptance Criteria

1. WHEN user views the results, the system SHALL display tabs or cards for each of the 8 Shopee sites.
2. WHEN user switches between site tabs, the system SHALL display the optimized title for that specific site.
3. WHEN user hovers over a site card, the system SHALL highlight the card with a visual indicator.
4. EACH site card SHALL display the country flag icon and site name.

### R4: 配置管理

**User Story:** AS a user, I want to configure my API key and preferences, so that I can use my own AI account.

#### Acceptance Criteria

1. WHEN user opens the settings panel, the system SHALL allow user to input and save their AI API key.
2. WHEN user saves the API key, the system SHALL store it securely in browser localStorage.
3. WHEN the settings panel is closed, the system SHALL hide the API key with masked characters.

### R5: 错误处理

**User Story:** AS a user, I want clear error messages when something goes wrong, so that I can understand and fix the issue.

#### Acceptance Criteria

1. WHEN AI API returns a quota exceeded error, the system SHALL display a message indicating quota limits and suggest trying later.
2. WHEN network connection fails, the system SHALL display a "Connection Error" message with a retry button.
3. WHEN user input contains potentially sensitive information, the system SHALL warn the user before sending to AI.

## Non-Functional Requirements

- The system SHALL have a response time of less than 5 seconds for AI optimization (excluding API latency).
- The system SHALL be responsive and work on both desktop and mobile browsers.
- All API keys SHALL be stored locally in the user's browser and never sent to any server other than the AI provider.
