# AI-Native CRM 系统设计文档

> 高端建陶企业 AI Agent 驱动型客户关系管理系统

## 概述

### 项目背景

公司深耕高端建筑陶瓷市场，拥有经销商渠道、工程渠道两大核心营销主线，现有业务人员近 200 人。目前客户管理完全依赖业务人员个人经验，存在客户信息分散、跟进流程不规范、数据无法沉淀复用等问题。

### 设计目标

构建一个 **AI Agent 驱动型 CRM**，而非传统 CRM + AI 增强：
- AI Agent 是主角，自动执行大部分工作
- 人主要做决策和监督
- 通过企业微信对话式交互，零学习成本

### 实施策略

采用**渐进式 Agent 化**方案：

| 阶段 | 范围 | 预算 | 周期 |
|------|------|------|------|
| 第一期 MVP | 经销商运营场景，30 人试用 | 30-50 万 | 4 个月 |
| 第二期扩展 | 多租户 + 商机/外勤 Skills，200 人 | 50-80 万 | 4-6 个月 |

---

## 整体架构

```
┌────────────────────────────────────────────────────────────────┐
│                        用户层                                   │
│  ┌──────────────┐  ┌──────────────┐  ┌──────────────┐         │
│  │ 管理层(5-10) │  │核心业务员(20)│  │  Web 控制台  │         │
│  │  企微对话    │  │  企微对话    │  │  监控/配置   │         │
│  └──────┬───────┘  └──────┬───────┘  └──────┬───────┘         │
└─────────┼─────────────────┼─────────────────┼─────────────────┘
          │                 │                 │
          ▼                 ▼                 ▼
┌────────────────────────────────────────────────────────────────┐
│                    OpenClaw Gateway                            │
│  ┌─────────────┐  ┌─────────────┐  ┌─────────────┐            │
│  │ 企微 Channel│  │ Session Mgr │  │  Tool Router │            │
│  │  (接入层)   │  │ (会话管理)  │  │  (工具路由)  │            │
│  └─────────────┘  └─────────────┘  └─────────────┘            │
└────────────────────────────┬───────────────────────────────────┘
                             │
                             ▼
┌────────────────────────────────────────────────────────────────┐
│                      Skills 层                                  │
│  ┌────────────────────────────────────────────────────────┐   │
│  │              /dealer-ops (经销商运营)                   │   │
│  │  ┌──────────┐ ┌──────────┐ ┌──────────┐ ┌──────────┐  │   │
│  │  │ 经营分析 │ │ 异常预警 │ │ 建议生成 │ │ 行动追踪 │  │   │
│  │  └──────────┘ └──────────┘ └──────────┘ └──────────┘  │   │
│  └────────────────────────────────────────────────────────┘   │
└────────────────────────────┬───────────────────────────────────┘
                             │
                             ▼
┌────────────────────────────────────────────────────────────────┐
│                      CLI 工具层                                 │
│  ┌──────────────┐  ┌──────────────┐  ┌──────────────┐         │
│  │   bip-cli    │  │  wecom-cli   │  │  oa-cli      │         │
│  │ 经销商数据   │  │ 消息推送     │  │ (第二期)     │         │
│  └──────┬───────┘  └──────┬───────┘  └──────────────┘         │
└─────────┼─────────────────┼───────────────────────────────────┘
          │                 │
          ▼                 ▼
┌──────────────────┐  ┌──────────────────┐
│    用友 BIP      │  │    企业微信      │
└──────────────────┘  └──────────────────┘
```

### 关键设计决策

| 决策点 | 选择 | 理由 |
|--------|------|------|
| 技术平台 | OpenClaw | 开源、可自托管、支持多渠道、有 Skills 平台 |
| Agent 入口 | 企业微信对话 | 业务员已经在用，零学习成本 |
| 第一期用户 | 30人 | 可控范围内验证，快速迭代 |
| 第一期 Skill | 只做经销商运营 | 聚焦验证核心价值 |
| 多租户 | 第一期不做 | 用企微 userid 区分权限，降低复杂度 |
| 数据存储 | BIP 为主 + 本地 SQLite 缓存 | 不重复造轮子 |

---

## 经销商运营 Skill 设计

### 能力矩阵

```
/dealer-ops (经销商运营 Skill)
│
├── 经营分析
│   ├── dealer:profile     → 经销商画像
│   ├── dealer:sales       → 销售分析（同比/环比/趋势）
│   ├── dealer:inventory   → 库存状况
│   └── dealer:stores      → 门店表现
│
├── 异常预警（Agent 自动执行）
│   ├── alert:sales-drop   → 销量连续下滑预警
│   ├── alert:inventory    → 库存积压/缺货预警
│   ├── alert:payment      → 回款逾期预警
│   └── alert:inactive     → 长期未活跃经销商
│
├── 建议生成
│   ├── suggest:restock    → 补货建议
│   ├── suggest:visit      → 拜访建议
│   ├── suggest:policy     → 政策建议
│   └── suggest:risk       → 风险提示
│
└── 行动追踪
    ├── action:create      → 创建行动项
    ├── action:assign      → 分配给业务员
    ├── action:follow      → 跟进提醒
    └── action:close       → 完成确认
```

### 自主权分级

| 级别 | 动作类型 | Agent 行为 | 示例 |
|------|----------|------------|------|
| L1 自动 | 信息查询/分析 | 直接执行 | 查销量、生成报告 |
| L2 自动 | 内部提醒 | 直接执行 | 给业务员发预警通知 |
| L3 审批 | 创建任务 | 建议+一键批准 | 安排拜访、补货提醒 |
| L4 审批 | 对外沟通 | 建议+审批 | 给经销商发消息 |
| L5 多级 | 政策/授信调整 | 建议+多级审批 | 调信用额度 |

### 交互示例

**管理层查询：**
```
用户：华南区经销商最近情况怎么样？

Agent：华南区 47 家经销商本月整体表现：
       销售额 1,280 万，同比 +12%，环比 -3%

       需要关注：
       • 佛山张总：连续 2 月销量下滑 18%，建议安排拜访
       • 深圳李总：库存周转 89 天，积压严重
       • 东莞王总：回款逾期 45 万，超 30 天

       要看具体哪位经销商的详情？
```

**建议+审批：**
```
Agent（主动推送）：
       发现异常：佛山张总门店
       销量连续 2 月下滑 18%，上月进货 0 单

       建议行动：
       [批准] 安排区域经理本周拜访
       [批准] 推送新品样品申请
       [修改] 调整建议
       [稍后] 暂不处理
```

---

## CLI 工具层设计

### bip-cli 命令

```bash
# 经销商管理
bip dealer list [--region <区域>] [--level <等级>]
bip dealer get <dealer_id> [--with-stores] [--with-history]
bip dealer stores <dealer_id>

# 销售数据
bip sales query --dealer <id> --period <月/季/年> [--compare]
bip sales rank --region <区域> --period <月> [--top 10]
bip sales trend --dealer <id> --months 6

# 库存数据
bip inventory query --dealer <id> [--category <品类>]
bip inventory turnover --dealer <id> --period <月>
bip inventory alert [--threshold 60]

# 订单数据
bip order list --dealer <id> --status <状态> --period <月>

# 回款数据
bip payment status --dealer <id>
bip payment overdue [--days 30] [--region <区域>]
```

### wecom-cli 命令

```bash
# 消息发送
wecom msg send --to <userid> --text "消息内容"
wecom msg send --to <userid> --card <json_file>
wecom msg template --name <模板名> --data <json>

# 日程/任务
wecom calendar create --user <userid> --title "标题" --time "时间"
wecom task create --user <userid> --title "标题" --due "截止时间"
wecom task update <task_id> --status <状态>
```

### 输出格式

所有 CLI 输出 JSON，方便 Agent 解析：

```json
{
  "dealer_id": "D001",
  "name": "佛山张总建材",
  "region": "华南",
  "level": "A",
  "stats": {
    "ytd_sales": 2800000,
    "mtd_sales": 280000,
    "yoy_growth": 0.12,
    "mom_growth": -0.03
  }
}
```

---

## 数据流设计

### 三种数据流模式

**模式 1：定时同步（预警检测）**
- 每日 6:00 同步昨日数据
- 每 4 小时增量同步订单/库存
- 同步完成后自动运行异常检测
- 检测到异常 → 推送预警

**模式 2：实时查询（用户对话）**
- 先查本地缓存
- 缓存过期则实时查询 BIP
- 查询后更新缓存

**模式 3：行动闭环（审批+追踪）**
- 用户批准 → 写入本地 DB → 同步企微日程
- 定时检查任务状态 → 未完成提醒

### 缓存策略

| 数据类型 | 缓存时间 | 理由 |
|----------|----------|------|
| 经销商基础信息 | 24h | 变化少 |
| 销售汇总 | 4h | 需要相对实时 |
| 库存数据 | 2h | 变化较快 |
| 回款状态 | 1h | 敏感数据 |

### 本地数据模型 (SQLite)

```sql
-- 经销商快照
CREATE TABLE dealer_snapshot (
    id TEXT PRIMARY KEY,
    data JSON,
    synced_at DATETIME,
    region TEXT,
    level TEXT
);

-- 预警记录
CREATE TABLE alerts (
    id INTEGER PRIMARY KEY,
    dealer_id TEXT,
    type TEXT,       -- sales_drop, inventory, payment, inactive
    severity TEXT,   -- high, medium, low
    message TEXT,
    status TEXT,     -- pending, acknowledged, resolved
    created_at DATETIME
);

-- 行动记录
CREATE TABLE actions (
    id INTEGER PRIMARY KEY,
    dealer_id TEXT,
    type TEXT,       -- visit, restock, call, policy
    title TEXT,
    assignee TEXT,
    status TEXT,     -- pending, approved, in_progress, done
    due_date DATETIME,
    created_at DATETIME
);
```

---

## 错误处理与容错

### 故障处理策略

| 故障场景 | 降级策略 | 用户提示 |
|----------|----------|----------|
| BIP 不可用 | 使用本地缓存 | "显示的是今早 6 点的数据" |
| BIP 响应慢 | 先返回缓存，后台刷新 | "先看缓存，正在获取最新..." |
| 企微发送失败 | 写入重试队列 | "消息发送中，稍后送达" |
| LLM 超时 | 降级到规则引擎 | "使用快速分析模式" |

### 熔断器配置

```typescript
const circuitConfig = {
  bip: {
    failureThreshold: 3,
    recoveryTimeout: 60_000,
    timeout: 5_000
  },
  wecom: {
    failureThreshold: 5,
    recoveryTimeout: 30_000,
    timeout: 3_000
  },
  llm: {
    failureThreshold: 2,
    recoveryTimeout: 120_000,
    timeout: 30_000
  }
};
```

### 用户体验降级原则

1. 永远有响应 — 宁可给旧数据，不能无响应
2. 透明告知 — 降级时明确告诉用户数据时效性
3. 静默重试 — 临时故障自动恢复，用户无感
4. 功能分级 — 核心查询 > 建议生成 > 主动推送

---

## 测试与上线计划

### 第一期里程碑（4 个月）

| 月 | 阶段 | 主要任务 |
|----|------|----------|
| M1 | 基础设施 | OpenClaw 部署、CLI 工具开发 |
| M2 | 核心功能 | Skill 开发、Agent 调优 |
| M3 | 集成测试 | 端到端测试、压力测试、安全测试 |
| M4 | 试运行 | 灰度 10→30 人、反馈迭代、正式上线 |

### 核心测试场景

| 场景 | 验收标准 |
|------|----------|
| 用户问"华南区情况" | 5 秒内返回准确汇总 |
| 用户问"张总门店" | 返回完整画像 + 建议 |
| Agent 检测销量下滑 | 自动推送预警 |
| 用户批准拜访建议 | 任务创建 + 日程同步 |
| BIP 故障时查询 | 降级到缓存，明确告知 |

### 成功指标

| 指标 | 目标 |
|------|------|
| 日活率 | > 60% |
| 响应满意度 | > 7/10 |
| 预警准确率 | > 80% |
| 行动完成率 | > 70% |
| 系统可用性 | > 99% |

---

## 第二期规划（概要）

第一期验证成功后，第二期重点：

1. **OpenClaw 多租户改造** — 支持 200 人
2. **新增 Skills**
   - /opportunity — 商机挖掘与跟进
   - /field-ops — 业务员外勤管理
   - /quote — 报价与投标支持
3. **扩展 CLI 工具** — oa-cli 接入
4. **数据分析增强** — BI 报表、趋势预测

---

## 附录

### 技术栈

| 组件 | 技术选型 |
|------|----------|
| Agent 平台 | OpenClaw (自托管) |
| 运行时 | Node.js 24+ |
| 数据库 | SQLite (本地缓存) |
| 消息队列 | BullMQ (Redis) |
| 监控 | Prometheus + Grafana |

### 参考资料

- [OpenClaw GitHub](https://github.com/openclaw/openclaw)
- 用友 BIP API 文档
- 企业微信开发文档
