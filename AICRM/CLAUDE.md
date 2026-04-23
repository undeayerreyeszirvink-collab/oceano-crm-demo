# AI-Native CRM

> AI Agent 驱动型客户关系管理系统，面向高端建陶企业

## Overview

构建一个 **AI Agent 驱动型 CRM**，而非传统 CRM + AI 增强：
- AI Agent 是主角，自动执行大部分工作
- 人主要做决策和监督
- 通过企业微信对话式交互，零学习成本

**第一期 MVP:** 经销商运营场景，30 人试用，4 个月

## Tech Stack

| 组件 | 技术选型 |
|------|----------|
| 运行时 | Node.js 22 LTS |
| 语言 | TypeScript |
| Agent 平台 | OpenClaw (自托管) |
| 数据库 | PostgreSQL (Supabase) |
| 消息队列 | BullMQ + Redis (AOF=everysec) |
| 前端 | Next.js + shadcn/ui + Tailwind CSS |
| 外部 API | 用友 BIP API, 企业微信 API |

## Architecture

```
用户层 (企微/Web) → OpenClaw Gateway → Skills 层 → CLI 工具层 → 外部系统 (BIP/企微)
```

详细架构见 [docs/plans/2026-03-21-ai-native-crm-design.md](docs/plans/2026-03-21-ai-native-crm-design.md)

### 核心组件

- **OpenClaw Gateway** — Agent 平台，接入企微 Channel
- **/dealer-ops Skill** — 经销商运营技能（经营分析、异常预警、建议生成、行动追踪）
- **bip-cli** — 用友 BIP 数据查询工具
- **wecom-cli** — 企业微信消息推送工具

## Quick Commands

```bash
# 开发
npm install          # 安装依赖
npm run dev          # 启动开发服务器
npm test             # 运行测试

# CLI 工具
npx tsx src/cli/bip/index.ts dealer list --region 华南
npx tsx src/cli/wecom/index.ts msg send --to <userid> --text "消息"

# 数据库
npm run db:migrate   # 运行迁移
npm run db:seed      # 填充测试数据

# 部署
docker-compose up -d # 启动所有服务
```

## Project Structure

```
AICRM/
├── src/
│   ├── config/       # 配置管理 (zod 验证)
│   ├── db/           # PostgreSQL 数据库层
│   ├── cli/
│   │   ├── bip/      # BIP API CLI 工具
│   │   └── wecom/    # 企微 API CLI 工具
│   ├── openclaw/     # OpenClaw 工具定义
│   ├── dealer/       # 经销商数据仓库
│   ├── alerts/       # 预警检测引擎
│   ├── suggest/      # 建议生成器
│   └── skills/
│       └── dealer-ops/  # 经销商运营 Skill
├── tests/
│   ├── mocks/        # Mock servers
│   ├── integration/  # 集成测试
│   └── e2e/          # 端到端测试
└── docs/
    └── plans/        # 设计与实施文档
```

## Design System

- **组件库:** shadcn/ui + Tailwind CSS
- **主色:** slate-900 (深灰，专业)
- **语义色:** success=green-600, warning=amber-500, destructive=red-600
- **深色模式:** MVP 支持

详细规范见 [docs/plans/2026-03-21-ai-native-crm-implementation.md](docs/plans/2026-03-21-ai-native-crm-implementation.md#设计规范)

## Code Conventions

- 使用 `execFile()` + 参数数组执行 shell 命令，**禁止** `exec()` 字符串拼接（安全）
- 所有异步操作使用 async/await
- 测试使用 vitest + Testcontainers (PostgreSQL)
- CLI 工具输出 JSON 格式，方便 Agent 解析

## Critical Rules

1. **安全第一** — 所有用户输入必须验证，禁止命令注入
2. **永远有响应** — 外部 API 故障时使用缓存数据，明确告知用户数据时效性
3. **预警阈值** — 销量下滑 >15%、库存周转 >60 天、回款逾期 >30 天、未活跃 >30 天
4. **推送克制** — 免打扰时段 20:00-08:00，高优先级例外

## Git Workflow

- 分支策略: `main` (生产) ← `feat/*` / `fix/*`
- Commit 格式: `type: description` (feat/fix/docs/chore)
- PR 必须通过 /plan-eng-review 审查

## Development Status

**当前阶段:** 设计完成，准备实施

**审查状态:**
- [x] /plan-design-review (7/10)
- [x] /plan-eng-review (clean)

**待办清单:** 见 [TODOS.md](TODOS.md)

**实施计划:** 见 [docs/plans/2026-03-21-ai-native-crm-implementation.md](docs/plans/2026-03-21-ai-native-crm-implementation.md)
