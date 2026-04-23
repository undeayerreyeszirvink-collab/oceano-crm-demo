# GEO 内容审计清单 — Dan Koe 方法论 (GEO Content Audit Checklist)

> 基于 Dan Koe 的 GEO 方法论，评估内容是否能被 AI（ChatGPT、Gemini、Perplexity）信任并主动推荐。
> 核心理念：让 AI 成为你的"推荐人"，而非仅被搜索引擎收录。

---

## GEO 评分体系 (GEO Scoring System)

总分 = 各维度得分 × 权重，满分 100 分。

| 维度 | 英文名 | 权重 |
|------|--------|------|
| AI 可推荐性 | AI Recommendability | 30% |
| 技术索引就绪度 | Technical Index Readiness | 25% |
| 跨平台权威性 | Cross-Platform Authority | 25% |
| 内容结构质量 | Content Structure Quality | 20% |

---

## 一、发布前检查 (Pre-Publish Checklist)

> 发布前可控的内容质量、结构和技术标记项目。

### 维度一：AI 可推荐性 (AI Recommendability) — 权重 30%

内容必须直接回答真实用户问题，且经过 AI 验证。

- [ ] 基于 Perplexity 真实问题挖掘选题（非凭空猜测）
- [ ] 将核心论点输入 ChatGPT，AI 能输出清晰的推荐语
- [ ] 每个段落聚焦回应一个具体用户疑虑/痛点
- [ ] 因果链完整度: 🔴 无因果链 / 🟡 部分段落含因果链 / 🟢 所有关键论点含完整因果链
- [ ] 对比框架覆盖度: 🔴 无对比 / 🟡 仅1处对比 / 🟢 关键决策点均有对比框架
- [ ] FAQ 质量: 🔴 无FAQ / 🟡 FAQ少于5条或非源自真实问题 / 🟢 5-8条FAQ且源自Perplexity真实子问题
- [ ] ChatGPT 验证通过度: 🔴 AI无法输出准确摘要 / 🟡 AI部分准确 / 🟢 AI输出清晰准确的推荐回答

### 维度四：内容结构质量 (Content Structure Quality) — 权重 20%

- [ ] 标题层级清晰度: 🔴 层级混乱 / 🟡 基本清晰但有跳级 / 🟢 H1唯一，H2-H3逻辑嵌套
- [ ] 每个章节回答一个明确的子问题
- [ ] 数据支撑: 🔴 无数据 / 🟡 有定性描述 / 🟢 含具体统计数字或量化证据
- [ ] 包含专家引言或第一手经验/案例
- [ ] E-E-A-T 信号: 🔴 缺失 / 🟡 部分覆盖 / 🟢 四要素完整（Experience、Expertise、Authoritativeness、Trustworthiness）
- [ ] 标注内容更新日期（freshness signal）
- [ ] 关键结论前置（inverted pyramid），段落 50-150 字适合 AI 摘取

### 技术标记（发布前部署）

- [ ] 添加 Article Schema（JSON-LD 格式）
- [ ] 添加 FAQPage Schema（对应文末 FAQ 模块）
- [ ] 如适用，添加 HowTo Schema（教程/步骤类内容）
- [ ] Rich Results Test 验证通过（https://search.google.com/test/rich-results）
- [ ] robots.txt 允许 AI 爬虫访问（GPTBot、Google-Extended、Baiduspider 未屏蔽）
- [ ] sitemap.xml 包含该页面

---

## 二、发布后审计 (Post-Publish Audit)

> 发布后需验证的索引、分发和引用追踪项目。

### 维度二：技术索引就绪度 (Technical Index Readiness) — 权重 25%

Dan Koe 强调 Bing 生态优先——ChatGPT 依赖 Bing 索引。

- [ ] IndexNow 已配置并触发提交
- [ ] Bing Webmaster Tools 已正确设置并验证
- [ ] 发布后 24 小时内被 Bing 成功索引
- [ ] sitemap.xml 已提交至 Bing
- [ ] 百度站长平台验证（中国市场）
- [ ] 百度推送 API 已配置并提交（中国市场）
- [ ] Baiduspider 未屏蔽（中国市场）

### 维度三：跨平台权威性 (Cross-Platform Authority) — 权重 25%

AI 通过多个独立来源的一致性判断可信度。多平台出现相似观点时，AI 视为"共识"。

**国际平台：**
- [ ] 核心观点已发布到 Reddit 相关 subreddit
- [ ] 核心观点已发布到 Quora 相关问题下
- [ ] 核心观点已发布到 Medium 作为独立文章

**中国平台：**
- [ ] 知乎专栏/回答发布
- [ ] 小红书笔记发布
- [ ] 微信公众号文章发布
- [ ] 百度百家号文章发布
- [ ] 抖音短视频/图文发布（如适用）

**通用要求：**
- [ ] 各平台内容保持核心信息一致（non-duplicate 但 message-aligned）
- [ ] 多个独立来源引用相似论据
- [ ] 品牌名/作者名在各平台自然出现
- [ ] 跨平台发布在主站上线后 48 小时内完成

### Gemini 引用追踪

- [ ] 发布 48h 后在 Gemini 搜索目标查询，检查是否被引用
- [ ] 发布 1 周后在 Perplexity 搜索，检查是否出现在推荐来源
- [ ] 记录首次 AI 引用时间和引用方式

---

## YMYL 内容附加检查（健康/金融/法律类）

> 若内容涉及 Your Money or Your Life 主题（健康建议、金融产品、法律解读等），需额外满足以下条件：

- [ ] 专业资质/认证声明（如"作者持有XX证书"、"经XX医师审核"）
- [ ] 数据来源标注（学术论文/官方统计/权威机构报告，附引用链接）
- [ ] 免责声明（"本文不构成医疗/投资/法律建议"等）
- [ ] 内容经过专业人士审核（注明审核人姓名及资质）
- [ ] 中国广告法合规检查（护肤/健康/金融类：禁用绝对化用语、虚假功效宣传）

---

## 评分标准 (Scoring Criteria)

| 分数区间 | 等级 | 说明 | 行动建议 |
|----------|------|------|----------|
| 90-100 | GEO 优秀 | AI 高概率主动推荐 | 持续监控，定期更新 |
| 70-89 | GEO 良好 | 需针对性优化 | 按优先级矩阵逐项提升 |
| 50-69 | GEO 一般 | 需系统性优化 | 补齐技术和跨平台短板 |
| <50 | GEO 较差 | 需全面重构 | 从 Step 1 重新走完四步流程 |

---

## 快速诊断模板 (Quick Diagnostic Template)

```
页面 URL：_______________
评估日期：_______________
目标查询（Perplexity）：_______________
市场：国际 / 中国 / 双市场

1. AI 可推荐性         ___/30  ChatGPT验证：通过/未通过
2. 技术索引就绪度      ___/25  Bing索引：已/未  百度索引：已/未/不适用
3. 跨平台权威性        ___/25  国际：Reddit□ Quora□ Medium□
                               中国：知乎□ 小红书□ 公众号□ 百家号□ 抖音□
4. 内容结构质量        ___/20  E-E-A-T：完整/部分/缺失
YMYL：是/否 → 附加检查通过：是/否/不适用

GEO 总分：___/100  等级：[ 优秀 / 良好 / 一般 / 较差 ]

Top 3 优化建议：
1.
2.
3.
```

---

## 四步框架执行检查清单 (Dan Koe's 4-Step Framework Checklist)

Step 1→2 须严格按序。**Step 3（技术部署）和 Step 4（跨平台分发）在网站发布后可并行推进**，以缩短整体上线周期。

### Step 1：问题挖掘 (Perplexity Question Mining)

- [ ] 在 Perplexity 搜索目标主题，收集真实用户提问
- [ ] 整理 5-10 个高频问题作为内容骨架
- [ ] 识别用户核心疑虑和决策障碍
- [ ] 记录 Perplexity 当前推荐的竞品内容作为超越基准

### Step 2：内容重构与验证 (Claude Restructuring + ChatGPT Verification)

- [ ] 用 Claude 将问题重构为完整文章框架
- [ ] 每段对应一个具体问题，加入因果链和对比框架
- [ ] 补充 FAQ 覆盖长尾追问
- [ ] 输入 ChatGPT 验证，确认能输出准确推荐摘要
- [ ] 根据 ChatGPT 反馈迭代优化

### Step 3：技术部署 (Schema Markup + IndexNow) ⇆ 可与 Step 4 并行

- [ ] 添加 Article / FAQPage / HowTo Schema（JSON-LD）
- [ ] Rich Results Test 验证通过
- [ ] 配置 IndexNow 自动提交
- [ ] Bing Webmaster Tools 验证提交成功
- [ ] 24 小时内确认 Bing 已索引
- [ ] 检查 robots.txt 确保 AI 爬虫未被屏蔽
- [ ] 百度站长平台提交（中国市场）

### Step 4：跨平台分发 (Cross-Platform Distribution) ⇆ 可与 Step 3 并行

- [ ] 国际平台：Reddit / Quora / Medium 分别发布核心观点
- [ ] 中国平台：知乎 / 小红书 / 公众号 / 百家号 按需发布
- [ ] 各平台信息一致但表述差异化，品牌名自然融入
- [ ] 48 小时内完成全部分发
- [ ] 一周后复查：AI 是否开始引用你的内容

---

## 效果衡量 KPIs (Measurement KPIs)

> 发布后持续追踪，建议每周检查一次。

| KPI | 数据来源 | 检查频率 |
|-----|----------|----------|
| Gemini 引荐流量 | GA4 → 来源：gemini.google.com | 每周 |
| Bing 索引页面数 | Bing Webmaster Tools → 索引报告 | 每周 |
| 跨平台互动数据（upvotes、views、comments） | 各平台后台 | 每周 |
| AI 引用追踪 | 手动在 Gemini / Perplexity 抽查目标查询 | 每周 |
| 百度 AI 搜索摘要展示 | 百度统计 → AI搜索流量（中国市场） | 每周 |
| ChatGPT 验证通过率 | 内部测试记录 | 每次发布 |

---

## 优化优先级矩阵 (Optimization Priority Matrix)

> **时间估算说明**：下表时间为团队协作估算。**个人创作者（Solo Creator）通常需要 2-3 倍时间**，建议据此调整排期。

### 第一优先级：Quick Wins（高影响 + 低难度）

| 优化项 | 预期影响 | 时间（团队） | 时间（Solo） |
|--------|----------|-------------|-------------|
| Perplexity 挖掘真实问题 | 可推荐性大幅提升 | 1-2h | 2-4h |
| 添加文末 FAQ 模块 | 意图覆盖率显著提升 | 1-2h | 2-4h |
| 执行 ChatGPT 验证测试并迭代 | 确保 AI 能正确推荐 | 0.5-1h | 1-2h |
| 配置 IndexNow + Bing Webmaster Tools | 索引速度缩短至 24h | 2-3h | 4-6h |

### 第二优先级：Strategic Investments（高影响 + 中难度）

| 优化项 | 预期影响 | 时间（团队） | 时间（Solo） |
|--------|----------|-------------|-------------|
| 完整 Schema 标记 + Rich Results Test 验证 | 技术索引全面达标 | 3-5h | 6-10h |
| 国际跨平台分发（Reddit / Quora / Medium） | 跨平台权威性从 0 到 1 | 每篇 3-4h | 每篇 6-8h |
| 中国跨平台分发（知乎 / 小红书 / 公众号 / 百家号） | 中国市场权威性建立 | 每篇 3-4h | 每篇 6-8h |
| Claude 重构加入因果链和对比框架 | 可推荐性系统提升 | 0.5-1d | 1-2d |
| 完善 E-E-A-T 信号 | 权威性系统性提升 | 1-2w | 2-4w |

### 第三优先级：Long-term Projects（中影响 + 高难度）

| 优化项 | 预期影响 | 时间（团队） | 时间（Solo） |
|--------|----------|-------------|-------------|
| 跨平台分发 SOP 和自动化 | 效率持续提升 | 2-4w | 1-2m |
| 原创研究/行业报告 | 可引用性根本提升 | 1-3m | 2-6m |
| Topic Clusters 主题集群 | 整体推荐概率提升 | 2-6m | 4-12m |

### 低优先级 (Deprioritize)

- **关键词密度优化**：AI 引擎不依赖关键词匹配
- **大量内链建设**：对 GEO 影响有限
- **Google Search Console 优先**：Dan Koe 框架优先 Bing 生态

---

> **使用说明**：**发布前**完成"发布前检查"全部项目，**发布后**按"发布后审计"逐项验证。首次审计获取基线，按优先级矩阵迭代，建议每月复审。YMYL 类内容务必完成附加检查。跨平台分发是多数人忽视的环节——正是 Dan Koe 框架区别于传统 SEO 的关键。
