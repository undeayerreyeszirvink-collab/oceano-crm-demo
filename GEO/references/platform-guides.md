# Dan Koe GEO 方法论：平台协同指南

> 基于 Dan Koe 的 GEO 框架，六大平台各司其职：Perplexity 挖问题、Claude 重构内容、ChatGPT 验证质量、IndexNow/Bing 即时索引、Gemini 导流量、Reddit/Quora/Medium 建权威。

---

## 1. Perplexity — 问题挖掘引擎

Perplexity 是 Dan Koe 框架第一步的核心工具。它的价值不在于回答本身，而在于自动生成的**后续子问题（follow-up sub-questions）**。这些子问题反映了 AI 引擎处理用户查询时的真实推理路径，是最接近"AI 想知道什么"的信号源。

**工作流**：
1. 在 Perplexity 中搜索核心关键词（如 "best CRM for small business"）
2. 忽略回答，记录页面底部自动生成的 3-5 个后续子问题
3. 点击每个子问题递归挖掘，收集第二层、第三层子问题，构建问题树
4. 将所有子问题按逻辑关系分组，形成文章大纲
5. 每个核心话题收集 20-30 个子问题作为素材库

**高价值问题特征**：含具体场景（"for small teams"）、涉及比较决策（"X vs Y"）、带意图信号（"how to choose"）、反复出现。**低价值**：过于宽泛、纯定义类、仅出现一次。

**技巧**：英文搜索获全球视角，中文搜索获本地视角；同一主题尝试不同措辞对比差异；保留原始表述，不改写为 SEO 关键词格式。

---

## 2. Claude — 内容重构引擎

Claude 是框架中负责内容重构（Content Restructuring）的主力引擎。它在长文本理解、逻辑重组和遵循复杂写作指令方面优势明显，适合将原始素材转化为 AI 引擎友好的结构化内容。重构遵循 Dan Koe 的四原则：

1. **一段一关切**：每段只解决一个具体疑虑，3-5 句话
2. **因果链（Causal Chains）**："因为 X → 所以 Y → 因此 Z"
3. **对比框架（Comparison Frameworks）**："与 A 不同，B 的优势在于……"
4. **FAQ 收尾**：文末附 5-8 个问答对，问题直接用 Perplexity 子问题

**Prompt 模板**：
```
请按以下规则重写：
1. 每段只讨论一个用户关切
2. 每个论点含因果链：因为X → 所以Y → 因此Z
3. 比较处使用对比框架
4. 文末FAQ覆盖：[粘贴Perplexity子问题]
5. 自然语言，避免关键词堆砌
原始内容：[粘贴原文]
```

**重构前**：CRM software helps businesses manage relationships. Many options available. Some expensive, some cheap.
**重构后**：因为5人以下团队核心需求是快速上手而非高级自动化，所以轻量级CRM（如HubSpot Free）比企业级方案更合适。与Salesforce需专职管理员不同，HubSpot Free可30分钟内完成配置。

---

## 3. ChatGPT — 内容验证引擎

在 Dan Koe 的体系中，ChatGPT 的角色严格限定为**验证工具**，不用于内容创作。核心逻辑：如果另一个 AI 引擎能基于你的内容正确理解并给出清晰推荐，那么 Google Gemini 等流量引擎也能做到同样的事。这是一种低成本的内容质量压力测试。

**验证 Prompt**：
```
基于以下内容，为[目标用户]提供具体推荐。
只用文章信息，不用外部知识。
内容：[粘贴内容]
问题：1.[核心问题] 2.[子问题1] 3.[子问题2]
```

**通过**：ChatGPT 输出清晰、具体、准确的推荐。**不通过**：推荐含糊、遗漏关键信息、曲解意图。

不通过时回到 Claude 定向重构（增强因果链、补对比框架、拆分复杂段落），再次验证，直到通过。

---

## 4. IndexNow + Bing — 即时索引通道

传统 SEO 中新内容被索引可能需要数天甚至数周。Dan Koe 方法论的**关键洞察：Google Gemini 使用 Bing 的索引数据**。因此通过 IndexNow 协议将内容快速提交到 Bing，就能让 Gemini 在 24 小时内发现并引用你的内容。这是整个框架中最重要的技术环节。

IndexNow 是由 Microsoft Bing 和 Yandex 共同开发的开放协议，允许网站主动通知搜索引擎"这个 URL 有内容更新"，搜索引擎立即抓取而非等待爬虫下次定期访问。

**topify.ai 操作步骤**：
1. 注册并验证域名
2. 获取 API Key 文件放置网站根目录
3. 发布内容后提交 URL
4. 配置 CMS 插件实现自动提交

**关键链路**：内容发布 → IndexNow → Bing 索引（小时级）→ Gemini 读取 → 用户看到内容

**验证**：24-48h 后检查 Bing Webmaster Tools 索引状态、Gemini 搜索测试、Google Search Console 数据。

---

## 5. Google Gemini — 流量主引擎

在 Dan Koe 的框架中，所有前期工作（问题挖掘、内容重构、验证、快速索引）的最终目标都是让内容出现在 **Google Gemini 的 AI Overview** 中。Gemini 是目前全球用户基数最大的 AI 搜索体验，被引用意味着直接获取高意图流量。Dan Koe 实证数据显示 Gemini 贡献了 **54%** 新增流量。

**Gemini 选择内容的逻辑**：
- 参考 Bing 索引（IndexNow 的意义）
- 偏好因果链、对比框架、FAQ 等结构化内容（Claude 重构的意义）
- 多源验证提升置信度（跨平台建设的意义）
- 偏好近期更新内容

**优化要点**：核心论点在前 200 字呈现；用因果链格式便于 Gemini 提取；FAQ 措辞贴近自然语言查询。

**监控**：GA4 中关注 `gemini.google.com` Referral 流量；GSC 监控 AI Overview 展示数据；定期 Gemini 搜索核心词记录引用变化。

---

## 6. Reddit / Quora / Medium — 权威建设三平台

AI 引擎在生成回答时会大量引用 Reddit、Quora 和 Medium 的内容。这三个平台分别代表社区讨论（Reddit）、专家问答（Quora）和深度文章（Medium）三种内容形态。当 AI 从多个独立来源看到一致观点时，**多源信任原则（Multi-source Trust Principle）** 显著提升该观点的可信度和被引用概率。

**Reddit**：选 10K-500K 成员活跃社区；以经验分享形式发帖；先积累 karma 再发内容；每周 2-3 条。
- **注意**: 多数 subreddit 严禁自我推广（如 r/fitness、r/entrepreneur），违规会被永久封禁。先用 2-4 周参与讨论积累 karma，再自然分享专业观点
- **按领域选社区**: SaaS → r/SaaS, r/startups, r/projectmanagement | 健身 → r/fitness, r/loseit | 营销 → r/marketing, r/SEO | 财经 → r/personalfinance

**Quora**：用 Perplexity 子问题匹配 Quora 问题；开头结论+中间因果链+结尾推荐，300-500 词含数据案例；完善档案争取 Top Writer；每周 3-5 个回答。
- **Quora Spaces**: 加入或���建与你领域相关的 Space，可放大内容分发
- **资质展示**: 完善个人档案，关联专业背景和从业经验

**Medium**：投稿高流量 Publication；用 Dan Koe 内容结构；利用 Medium 高 DA 获额外搜索流量；文中引用自有网站建双向权威；每周 1-2 篇。
- **推荐 Publications**: 科技→ The Startup, Better Programming | 商业→ Entrepreneurship Handbook | 健康→ In Fitness And In Health | 通用→ Better Humans, Towards Data Science

**放大效应**：三平台观点一致但格式各异——Reddit 社区认可、Quora 专家推荐、Medium 深度论证——多源一致性大幅提升 Gemini 引用概率。核心论点一致，但根据平台特性改写，不复制粘贴。

---

## 7. 平台协同工作流

```
Perplexity（子问题）→ Claude（重构）→ ChatGPT（验证）
    → 网站发布 + IndexNow → Bing 索引 → Gemini 引用
    → Reddit/Quora/Medium → 多源信任 → 更多引用 → 飞轮
```

| 时间 | 任务 | 平台 |
|---|---|---|
| 周一 | 问题挖掘，确定 2-3 个选题 | Perplexity |
| 周二 | 内容重构 + 验证迭代 | Claude, ChatGPT |
| 周三 | 发布 + IndexNow 提交 | 网站, topify.ai |
| 周四 | Reddit + Quora 布局 | Reddit, Quora |
| 周五 | Medium 发布 + 互动维护 | Medium |
| 周末 | GA4 复盘 Gemini 引用，优化下周 | GA4, Gemini |

**关键原则**：
- **顺序不可跳过**：必须先挖掘问题，再重构内容，再验证，再索引，再分发。每一步的输出是下一步的输入
- **工具各司其职**：Perplexity 只挖问题、Claude 只重构、ChatGPT 只验证。混淆角色会降低效率
- **一致性优先**：跨平台核心观点一致，格式可不同，结论不能矛盾
- **持续迭代**：每周复盘 Gemini 引用数据，将高引用模式应用到下周内容

---

> **核心提醒**：每个平台不是独立流量渠道，而是信任信号网络的节点。六个环节协同运转时，GEO 飞轮才能启动。

---

## 8. LinkedIn — 职业权威平台

LinkedIn 是 B2B 和个人品牌的高价值权威渠道。LinkedIn 内容被 Bing 索引（间接进入 Gemini），且平台本身 Domain Authority 极高。

**适用场景**: B2B SaaS、咨询/教练类个人品牌、专业服务

**策略**:
- **文章 vs 帖子**: 短帖（300 字以内）获更高互动；长文章获更好搜索索引。建议两者结合
- **核心论点复用**: 将网站文章核心观点改写为 LinkedIn 帖子，首句必须是 hook
- **专业人设建设**: 完善个人档案（标题、简介、经验），与 Person Schema 中的信息一致
- **互动**: 评论同行内容、参与行业讨论，建立专业网络信任
- **频率**: 每周 2-3 条帖子 + 每月 1-2 篇长文章

---

## 9. Schema JSON-LD 代码模板

以下模板可直接复制使用，替换占位符即可。

### Article Schema

```json
{
  "@context": "https://schema.org",
  "@type": "Article",
  "headline": "{{文章标题}}",
  "description": "{{文章摘要，150字以内}}",
  "author": {
    "@type": "Person",
    "name": "{{作者姓名}}",
    "url": "{{作者页面URL}}",
    "jobTitle": "{{职位/头衔}}"
  },
  "datePublished": "{{YYYY-MM-DD}}",
  "dateModified": "{{YYYY-MM-DD}}",
  "publisher": {
    "@type": "Organization",
    "name": "{{网站/品牌名}}",
    "logo": { "@type": "ImageObject", "url": "{{Logo URL}}" }
  },
  "mainEntityOfPage": "{{文章URL}}",
  "image": "{{封面图URL}}"
}
```

### FAQPage Schema

```json
{
  "@context": "https://schema.org",
  "@type": "FAQPage",
  "mainEntity": [
    {
      "@type": "Question",
      "name": "{{问题1}}",
      "acceptedAnswer": {
        "@type": "Answer",
        "text": "{{回答1，2-4句}}"
      }
    },
    {
      "@type": "Question",
      "name": "{{问题2}}",
      "acceptedAnswer": {
        "@type": "Answer",
        "text": "{{回答2，2-4句}}"
      }
    }
  ]
}
```

### Person Schema（个人品牌 E-E-A-T 信号）

```json
{
  "@context": "https://schema.org",
  "@type": "Person",
  "name": "{{姓名}}",
  "url": "{{个人网站}}",
  "jobTitle": "{{职位/专业头衔}}",
  "description": "{{一句话专业介绍}}",
  "sameAs": [
    "{{LinkedIn URL}}",
    "{{Twitter/X URL}}",
    "{{Medium URL}}"
  ],
  "hasCredential": [
    {
      "@type": "EducationalOccupationalCredential",
      "name": "{{资质证书名称}}"
    }
  ]
}
```

---

## 10. 中国市场适配方案

> **核心问题**：Dan Koe 框架的 IndexNow→Bing→Gemini 链路在中国大陆不适用（Google 被屏蔽）。Reddit/Quora/Medium 同样不可访问。以下是完整的中国市场替代方案。

### 平台替换映射

| Dan Koe 框架 | 中国替代方案 | 角色 |
|---|---|---|
| Perplexity | Perplexity（可用）+ 知乎热门问题 + 百度指数 | 问题挖掘 |
| Google / Gemini | 百度 / 文心一言 | 流量主引擎 |
| Bing + IndexNow | 百度站长平台 主动推送 API | 即时索引 |
| Reddit | 小红书 | 社区讨论 / 种草 |
| Quora | 知乎 | 专家问答 |
| Medium | 微信公众号 | 深度文章 |
| LinkedIn | 脉脉 / 领英中国 | 职业权威 |
| — | 百度百家号 | 百度优先索引（关键捷径）|
| — | 抖音 | 短视频搜索 + 电商转化 |

### 知乎策略

- **定位**: 中国最接近 Quora 的专家问答平台，内容被百度索引且被 Kimi、通义千问等中国 AI 模型高频引用
- **反营销文化**: 硬广会被举报降权，必须以专业回答建立权威后再自然提及品牌
- **回答规范**: 300+ 字，含数据/案例，争取 V 认证（实名专业认证）
- **算法偏好**: 早期赞同权重高、回答长度、作者领域匹配度
- **频率**: 每周 3-5 个高质量回答

### 小红书策略

- **定位**: 中国消费决策第一平台，尤其在美妆/护肤/生活方式领域
- **视觉优先**: 封面图质量决定点击率，文字为辅
- **种草文化**: 真实用户体验 > 专家分析，第一人称叙述 > 教科书式内容
- **合规**: 品牌合作必须通过蒲公英平台报备，否则限流
- **标签策略**: 热门话题标签 + 精准垂类标签 + 品牌标签
- **封闭生态**: 无外部索引，内容必须原生发布
- **频率**: 每周 3-5 条图文/视频笔记

### 微信公众号策略

- **定位**: 深度文章 + 私域流量入口，相当于 Newsletter + Medium
- **分发机制**: 依赖社交分享（朋友圈、群聊）和看一看推荐，非搜索驱动
- **搜一搜优化**: 微信内置搜索正快速增长，优化标题和关键词可获搜索流量
- **搜狗索引**: 搜狗搜索会索引公众号文章（腾讯系）
- **频率**: 每周 1-2 篇深度文章

### 百度百家号策略（关键捷径）

- **定位**: 百度自有内容平台，内容获百度搜索优先展示
- **核心价值**: 相当于中国版的 "IndexNow→Bing→Gemini" 捷径 — 在百家号发布内容 → 百度立即索引 → 文心一言优先引用
- **V 认证**: 企业或个人认证后权重更高
- **内容格式**: 遵循百度内容规范，标题含关键词，文章结构清晰

### 抖音策略

- **定位**: 短视频搜索引擎 + 电商转化平台
- **搜索崛起**: 越来越多用户在抖音内搜索产品/知识，尤其美妆/健身/美食
- **优化要点**: 视频完播率、互动率（点赞/评论/转发）、字幕关键词覆盖
- **电商转化**: 内容可直接挂载商品链接，从发现到购买一站完成
- **频率**: 每周 3-5 条短视频

### 百度站长平台（替代 IndexNow + Bing Webmaster Tools）

- **主动推送 API**: 内容发布后调用 API 实时通知百度抓取（等效于 IndexNow）
- **自动推送 JS**: 页面嵌入 JS 代码，用户访问时自动提交百度
- **Sitemap 提交**: 定期提交 sitemap.xml
- **百度统计**: 替代 GA4，监控百度 AI 搜索摘要展示数据

### 中国市场周度排期

| 时间 | 任务 | 平台 |
|---|---|---|
| 周一 | 问题挖掘（Perplexity + 知乎热门 + 百度指数）| Perplexity, 知乎, 百度 |
| 周二 | 内容重构 + AI 验证 | Claude, ChatGPT |
| 周三 | 发布 + 百度站长平台推送 + 百家号同步 | 网站, 百度 |
| 周四 | 知乎回答 + 小红书笔记 | 知乎, 小红书 |
| 周五 | 微信公众号文章 + 抖音短视频 | 微信, 抖音 |
| 周末 | 百度统计复盘 + 文心一言引用检查 | 百度统计 |
