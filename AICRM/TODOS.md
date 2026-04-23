# AI-Native CRM TODOs

## 设计相关

### ~~TODO-001: 创建 DESIGN.md 设计系统文档~~ ✅ RESOLVED
- **What:** 将 /plan-design-review 审查的设计决策整理成正式设计系统文档
- **Why:** 确保所有开发者遵循统一的设计规范，避免视觉不一致
- **Pros:** 加速开发、减少设计决策讨论、方便后续维护
- **Cons:** 需要额外 1-2 小时整理
- **Context:** 审查定义了 shadcn/ui + Tailwind 技术栈、颜色系统、emoji 使用规范、卡片结构等
- **Depends on:** 无
- **Added:** 2026-03-23 via /plan-design-review
- **Resolved:** 2026-03-23 — 已创建 docs/DESIGN.md，包含完整设计系统规范

### TODO-002: 企微卡片模板库
- **What:** 将审查中定义的 4 种卡片类型（预警通知、任务提醒、审批请求、信息汇总）封装成可复用模板
- **Why:** 避免每次发消息都手写 JSON，确保卡片样式一致
- **Pros:** 提高开发效率、保持视觉一致性
- **Cons:** 增加 wecom-cli 的复杂度
- **Context:** 卡片 JSON 结构已在审查中定义，包含按钮配置和样式规范
- **Depends on:** TODO-001 (参考设计系统)
- **Added:** 2026-03-23 via /plan-design-review

### TODO-003: 响应式设计细化
- **What:** 为 Web 控制台每个页面创建移动端线框图
- **Why:** 用户表示桌面和移动端同等重要，需要专门设计移动端布局
- **Pros:** 确保移动端体验不是"堆叠的桌面版"
- **Cons:** 增加设计工作量
- **Context:** 已定义基础响应式规范（底部导航、单列布局），但缺少具体页面的移动端设计
- **Depends on:** TODO-001
- **Added:** 2026-03-23 via /plan-design-review

---

## 技术相关

（从技术方案审查中提取的待办事项）

### ~~TODO-004: 修复命令注入漏洞~~ ✅ RESOLVED
- **What:** 将 bip-cli 和 wecom-cli 的 shell 命令执行改为 execFile + 参数数组
- **Why:** 当前实现存在命令注入风险（安全关键）
- **Pros:** 消除安全漏洞
- **Cons:** 需要修改工具调用方式
- **Context:** 见设计文档 src/openclaw/tools/bip.ts 和 wecom.ts
- **Depends on:** 无
- **Priority:** 高（安全关键）
- **Added:** 2026-03-23 via 技术方案审查
- **Resolved:** 2026-03-23 — 实施计划已更新，使用 execFile() + 参数数组替代 exec() 字符串拼接

### TODO-005: 确认 Agent 平台选型
- **What:** 确认 OpenClaw 可用性或选择替代方案（LangChain/LangGraph、Vercel AI SDK）
- **Why:** 设计文档引用的 OpenClaw 项目需要验证是否符合需求
- **Pros:** 避免中途更换技术栈
- **Cons:** 需要评估时间
- **Context:** OpenClaw 确实存在且功能丰富，但需要验证企微 Channel 集成能力
- **Depends on:** 无
- **Added:** 2026-03-23 via 技术方案审查

### ~~TODO-006: Node.js 版本调整~~ ✅ RESOLVED
- **What:** 将目标 Node.js 版本从 24 改为 22 LTS
- **Why:** Node 24 预计 2025 年 4 月才发布，当前应使用稳定的 LTS 版本
- **Pros:** 使用稳定版本，减少兼容性问题
- **Cons:** 无明显缺点
- **Context:** tsconfig.json 和 package.json 中的 engines 字段需要修改
- **Depends on:** 无
- **Added:** 2026-03-23 via 技术方案审查
- **Resolved:** 2026-03-23 — 实施计划 Tech Stack 已改为 Node.js 22 LTS

---

## 工程审查相关

（从 /plan-eng-review 2026-03-23 中提取的待办事项）

### TODO-007: 切换 PostgreSQL 数据库
- **What:** 将数据库从 SQLite 切换到 PostgreSQL (Supabase)
- **Why:** SQLite 单文件锁对 30 人并发 + 后台同步可能产生瓶颈，且未来 200 人扩展困难
- **Pros:** 更好的并发支持、云原生、未来无需迁移
- **Cons:** 增加部署复杂度、需要额外基础设施
- **Context:** 影响 Task 3 (schema.sql → PostgreSQL DDL) 和 Task 7 (better-sqlite3 → pg/postgres)
- **Depends on:** 无
- **Priority:** 高（需在实施前更新计划）
- **Added:** 2026-03-23 via /plan-eng-review

### TODO-008: 补充 Phase 3 详细测试计划
- **What:** 为 Phase 3 添加集成测试和 e2e 测试的详细 Task 步骤
- **Why:** 当前 Phase 3 只有"集成测试"标题，缺少具体步骤
- **Pros:** 确保测试覆盖完整、可执行
- **Cons:** 增加计划长度
- **Context:** 需要 mock server、熔断器测试、完整用户流程测试
- **Depends on:** TODO-007 (测试需要基于最终数据库选型)
- **Added:** 2026-03-23 via /plan-eng-review

### TODO-009: Redis AOF 持久化配置要求
- **What:** 在部署文档中添加 Redis AOF=everysec 配置要求
- **Why:** 避免 Redis 重启时丢失未处理的预警消息
- **Pros:** 消息可靠性
- **Cons:** Redis 写入性能略微下降（可忽略）
- **Context:** BullMQ 依赖 Redis 存储任务队列
- **Depends on:** 无
- **Added:** 2026-03-23 via /plan-eng-review

### TODO-010: 故障处理增强
- **What:** 在 Task 8 预警检测和 wecom-cli 中添加故障处理
- **Why:** 当前缺少对空数据（同步失败）和企微频率限制的处理
- **Pros:** 提高系统健壮性
- **Cons:** 增加代码复杂度
- **Context:**
  - 预警检测：同步失败时跳过检测并告警
  - wecom-cli：遇到频率限制时指数退避重试
- **Depends on:** 无
- **Added:** 2026-03-23 via /plan-eng-review

### TODO-011: 预警检测边界测试
- **What:** 在 Task 8 测试中添加阈值边界条件测试
- **Why:** 当前测试未覆盖边界值（如 -0.15 vs -0.149）
- **Pros:** 确保阈值判断正确
- **Cons:** 增加测试数量
- **Context:** 每个预警规则的触发阈值都需要边界测试
- **Depends on:** 无
- **Added:** 2026-03-23 via /plan-eng-review
