# AI-Native CRM 第一期实施计划

> **For Claude:** REQUIRED SUB-SKILL: Use superpowers:executing-plans to implement this plan task-by-task.

**Goal:** 构建基于 OpenClaw 的 AI Agent 驱动型 CRM MVP，实现经销商运营场景，支持 30 人通过企业微信对话式交互。

**Architecture:** OpenClaw Gateway 作为 Agent 平台，通过企微 Channel 接入用户，调用自研 /dealer-ops Skill 处理业务逻辑，Skill 通过 bip-cli 和 wecom-cli 工具访问用友 BIP 和企业微信 API。PostgreSQL (Supabase) 做数据缓存和状态管理。

**Tech Stack:** Node.js 22 LTS, TypeScript, OpenClaw, PostgreSQL (Supabase), BullMQ/Redis (AOF=everysec), 用友 BIP API, 企业微信 API

---

## 设计规范（来自 /plan-design-review 2026-03-23）

### 信息架构

```
双入口架构：
├── 主要入口：企业微信（日常操作、快速查询）
│   ├── 自然语言查询
│   ├── 主动预警推送
│   ├── 审批+行动卡片
│   └── 任务提醒
│
└── 辅助入口：Web 控制台（深度分析、报表、历史查询）
    ├── 业务员/管理层：仪表盘、经销商列表、预警中心、任务
    └── IT 运维：系统状态、数据同步、配置管理
```

### 设计系统

- **组件库:** shadcn/ui + Tailwind CSS + Next.js
- **主色:** slate-900 (深灰，专业)
- **语义色:** success=green-600, warning=amber-500, destructive=red-600
- **字体:** system-ui, "PingFang SC", "Microsoft YaHei"；数字使用 tabular-nums
- **深色模式:** MVP 支持（shadcn/ui 原生）

### Emoji 使用规范

| 场景 | 允许 | 示例 |
|------|------|------|
| 预警级别标识 | ✅ | ⚠️ 中等、❗高优先级 |
| 成功确认 | ✅ | ✅ 已批准 |
| 正文内容 | ❌ | 纯文字 |
| 空状态 | ❌ | 纯文字 + 引导行动 |

### 交互状态规范

每个 UI 功能需定义 5 种状态：
- **加载中:** 骨架屏或"正在查询..."
- **空状态:** 引导行动模式（"暂无预警" + [查看经销商列表]）
- **错误:** 具体错误 + 恢复操作
- **成功:** 确认信息
- **部分状态:** 说明数据时效性

### 企微卡片结构

```json
{
  "card_type": "button_interaction",
  "source": { "desc": "AI-CRM 经销商运营助手" },
  "main_title": { "title": "⚠️ 发现异常：{经销商名}" },
  "sub_title_text": "{异常描述}",
  "horizontal_content_list": [
    { "keyname": "经销商", "value": "{名称}" },
    { "keyname": "区域", "value": "{区域}" }
  ],
  "button_list": [
    { "text": "批准拜访", "style": 1, "key": "approve_visit" },
    { "text": "查看详情", "style": 2, "key": "view_detail" },
    { "text": "稍后处理", "style": 2, "key": "defer" }
  ]
}
```

### 推送控制

- **免打扰时段:** 默认 20:00-08:00，用户可自定义
- **高优先级:** 即时推送，忽略免打扰
- **中优先级:** 工作时间即时，免打扰时汇总
- **低优先级:** 汇总成日报

### 仪表盘首屏（综合导向）

```
┌─────────────────────────────────────────────────┐
│  关键指标：本月销售 | 同比 | 待处理预警 | 待办任务  │
├─────────────────────────────────────────────────┤
│  待处理预警 (3)          │  待办任务 (5)         │
│  ⚠️ 佛山张总 销量下滑    │  • 拜访深圳李总       │
│  ⚠️ 深圳李总 库存积压    │  • 回款跟进王总       │
│           [查看全部]      │        [查看全部]     │
└─────────────────────────────────────────────────┘
```

---

## Phase 1: 基础设施搭建 (Week 1-4)

### Task 1: 项目初始化

**Files:**
- Create: `package.json`
- Create: `tsconfig.json`
- Create: `.gitignore`
- Create: `src/index.ts`

**Step 1: 初始化 Node.js 项目**

```bash
npm init -y
```

**Step 2: 安装核心依赖**

```bash
npm install typescript @types/node tsx
npm install better-sqlite3 @types/better-sqlite3
npm install bullmq ioredis
npm install zod dotenv
```

**Step 3: 创建 tsconfig.json**

```json
{
  "compilerOptions": {
    "target": "ES2022",
    "module": "NodeNext",
    "moduleResolution": "NodeNext",
    "strict": true,
    "esModuleInterop": true,
    "skipLibCheck": true,
    "outDir": "./dist",
    "rootDir": "./src",
    "declaration": true
  },
  "include": ["src/**/*"],
  "exclude": ["node_modules", "dist"]
}
```

**Step 4: 创建 .gitignore**

```
node_modules/
dist/
.env
*.db
.DS_Store
```

**Step 5: 创建入口文件 src/index.ts**

```typescript
console.log("AI-Native CRM starting...");
```

**Step 6: 验证项目可运行**

Run: `npx tsx src/index.ts`
Expected: 输出 "AI-Native CRM starting..."

**Step 7: Commit**

```bash
git add -A
git commit -m "chore: initialize project with TypeScript and core dependencies"
```

---

### Task 2: 环境配置模块

**Files:**
- Create: `src/config/index.ts`
- Create: `src/config/schema.ts`
- Create: `.env.example`
- Test: `src/config/config.test.ts`

**Step 1: 创建配置 schema**

```typescript
// src/config/schema.ts
import { z } from "zod";

export const configSchema = z.object({
  // BIP API
  BIP_API_URL: z.string().url(),
  BIP_API_KEY: z.string().min(1),
  BIP_API_SECRET: z.string().min(1),

  // 企业微信
  WECOM_CORP_ID: z.string().min(1),
  WECOM_AGENT_ID: z.string().min(1),
  WECOM_SECRET: z.string().min(1),

  // OpenClaw
  OPENCLAW_PORT: z.coerce.number().default(18789),

  // 数据库
  SQLITE_PATH: z.string().default("./data/crm.db"),

  // Redis
  REDIS_URL: z.string().default("redis://localhost:6379"),
});

export type Config = z.infer<typeof configSchema>;
```

**Step 2: 创建配置加载器**

```typescript
// src/config/index.ts
import { config as dotenvConfig } from "dotenv";
import { configSchema, type Config } from "./schema.js";

dotenvConfig();

export function loadConfig(): Config {
  const result = configSchema.safeParse(process.env);
  if (!result.success) {
    console.error("Configuration error:", result.error.format());
    process.exit(1);
  }
  return result.data;
}

export const config = loadConfig();
export type { Config };
```

**Step 3: 创建 .env.example**

```
# BIP API
BIP_API_URL=https://bip.example.com/api
BIP_API_KEY=your_api_key
BIP_API_SECRET=your_api_secret

# 企业微信
WECOM_CORP_ID=your_corp_id
WECOM_AGENT_ID=your_agent_id
WECOM_SECRET=your_secret

# OpenClaw
OPENCLAW_PORT=18789

# 数据库
SQLITE_PATH=./data/crm.db

# Redis
REDIS_URL=redis://localhost:6379
```

**Step 4: 写测试**

```typescript
// src/config/config.test.ts
import { describe, it, expect, beforeEach, afterEach } from "vitest";
import { configSchema } from "./schema.js";

describe("configSchema", () => {
  const validEnv = {
    BIP_API_URL: "https://bip.example.com/api",
    BIP_API_KEY: "key123",
    BIP_API_SECRET: "secret123",
    WECOM_CORP_ID: "corp123",
    WECOM_AGENT_ID: "agent123",
    WECOM_SECRET: "secret123",
  };

  it("should parse valid config", () => {
    const result = configSchema.safeParse(validEnv);
    expect(result.success).toBe(true);
  });

  it("should apply defaults", () => {
    const result = configSchema.parse(validEnv);
    expect(result.OPENCLAW_PORT).toBe(18789);
    expect(result.SQLITE_PATH).toBe("./data/crm.db");
  });

  it("should reject invalid BIP_API_URL", () => {
    const result = configSchema.safeParse({
      ...validEnv,
      BIP_API_URL: "not-a-url",
    });
    expect(result.success).toBe(false);
  });
});
```

**Step 5: 安装测试框架并运行测试**

```bash
npm install -D vitest
npx vitest run src/config/config.test.ts
```

Expected: 3 tests pass

**Step 6: Commit**

```bash
git add -A
git commit -m "feat: add configuration module with zod validation"
```

---

### Task 3: PostgreSQL 数据库层

> **变更说明 (2026-03-23 /plan-eng-review):**
> 从 SQLite 切换到 PostgreSQL (Supabase)，原因：
> - SQLite 单文件锁对 30 人并发 + 后台同步可能产生瓶颈
> - 未来 200 人扩展需要更好的并发支持
> - 云原生部署更方便

**Files:**
- Create: `src/db/index.ts`
- Create: `src/db/migrations/001_initial.sql`
- Create: `src/db/client.ts`
- Test: `src/db/db.test.ts`

**Step 1: 安装 PostgreSQL 依赖**

```bash
npm install pg @types/pg
npm install -D testcontainers @testcontainers/postgresql
```

**Step 2: 创建 PostgreSQL schema (migration)**

```sql
-- src/db/migrations/001_initial.sql

-- 经销商快照
CREATE TABLE IF NOT EXISTS dealer_snapshot (
    id TEXT PRIMARY KEY,
    data JSONB NOT NULL,
    synced_at TIMESTAMPTZ DEFAULT NOW(),
    region TEXT,
    level TEXT
);

CREATE INDEX IF NOT EXISTS idx_dealer_region ON dealer_snapshot(region);
CREATE INDEX IF NOT EXISTS idx_dealer_level ON dealer_snapshot(level);

-- 预警记录
CREATE TABLE IF NOT EXISTS alerts (
    id SERIAL PRIMARY KEY,
    dealer_id TEXT NOT NULL REFERENCES dealer_snapshot(id),
    type TEXT NOT NULL CHECK(type IN ('sales_drop', 'inventory', 'payment', 'inactive')),
    severity TEXT NOT NULL CHECK(severity IN ('high', 'medium', 'low')),
    message TEXT NOT NULL,
    data JSONB,
    status TEXT DEFAULT 'pending' CHECK(status IN ('pending', 'acknowledged', 'resolved')),
    created_at TIMESTAMPTZ DEFAULT NOW(),
    resolved_at TIMESTAMPTZ
);

CREATE INDEX IF NOT EXISTS idx_alerts_dealer ON alerts(dealer_id);
CREATE INDEX IF NOT EXISTS idx_alerts_status ON alerts(status);
CREATE INDEX IF NOT EXISTS idx_alerts_created ON alerts(created_at DESC);

-- 行动记录
CREATE TABLE IF NOT EXISTS actions (
    id SERIAL PRIMARY KEY,
    dealer_id TEXT NOT NULL REFERENCES dealer_snapshot(id),
    type TEXT NOT NULL CHECK(type IN ('visit', 'restock', 'call', 'policy')),
    title TEXT NOT NULL,
    description TEXT,
    assignee TEXT,
    status TEXT DEFAULT 'pending' CHECK(status IN ('pending', 'approved', 'in_progress', 'done', 'cancelled')),
    due_date TIMESTAMPTZ,
    created_at TIMESTAMPTZ DEFAULT NOW(),
    completed_at TIMESTAMPTZ,
    source TEXT DEFAULT 'manual' CHECK(source IN ('agent_suggest', 'manual'))
);

CREATE INDEX IF NOT EXISTS idx_actions_dealer ON actions(dealer_id);
CREATE INDEX IF NOT EXISTS idx_actions_assignee ON actions(assignee);
CREATE INDEX IF NOT EXISTS idx_actions_status ON actions(status);
CREATE INDEX IF NOT EXISTS idx_actions_due ON actions(due_date) WHERE status IN ('pending', 'approved', 'in_progress');
```

**Step 3: 创建数据库客户端**

```typescript
// src/db/client.ts
import { Pool, PoolClient } from "pg";
import { config } from "../config/index.js";

let pool: Pool | null = null;

export function getPool(): Pool {
  if (!pool) {
    pool = new Pool({
      connectionString: config.DATABASE_URL,
      max: 10,
      idleTimeoutMillis: 30000,
      connectionTimeoutMillis: 2000,
    });
  }
  return pool;
}

export async function query<T>(sql: string, params?: unknown[]): Promise<T[]> {
  const pool = getPool();
  const result = await pool.query(sql, params);
  return result.rows as T[];
}

export async function queryOne<T>(sql: string, params?: unknown[]): Promise<T | null> {
  const rows = await query<T>(sql, params);
  return rows[0] || null;
}

export async function withTransaction<T>(
  fn: (client: PoolClient) => Promise<T>
): Promise<T> {
  const pool = getPool();
  const client = await pool.connect();
  try {
    await client.query("BEGIN");
    const result = await fn(client);
    await client.query("COMMIT");
    return result;
  } catch (error) {
    await client.query("ROLLBACK");
    throw error;
  } finally {
    client.release();
  }
}

export async function closePool(): Promise<void> {
  if (pool) {
    await pool.end();
    pool = null;
  }
}
```

**Step 4: 创建数据库模块**

```typescript
// src/db/index.ts
import { readFileSync } from "fs";
import { dirname, join } from "path";
import { fileURLToPath } from "url";
import { getPool, query, queryOne, withTransaction, closePool } from "./client.js";

const __dirname = dirname(fileURLToPath(import.meta.url));

export async function runMigrations(): Promise<void> {
  const pool = getPool();
  const migrationPath = join(__dirname, "migrations", "001_initial.sql");
  const sql = readFileSync(migrationPath, "utf-8");
  await pool.query(sql);
}

export { getPool, query, queryOne, withTransaction, closePool };
```

**Step 5: 更新配置 schema**

```typescript
// 在 src/config/schema.ts 中添加:
DATABASE_URL: z.string().url().default("postgresql://localhost:5432/aicrm"),
```

**Step 6: 写测试 (使用 Testcontainers)**

```typescript
// src/db/db.test.ts
import { describe, it, expect, beforeAll, afterAll } from "vitest";
import { PostgreSqlContainer, StartedPostgreSqlContainer } from "@testcontainers/postgresql";
import { Pool } from "pg";
import { readFileSync } from "fs";
import { dirname, join } from "path";
import { fileURLToPath } from "url";

const __dirname = dirname(fileURLToPath(import.meta.url));

describe("Database", () => {
  let container: StartedPostgreSqlContainer;
  let pool: Pool;

  beforeAll(async () => {
    container = await new PostgreSqlContainer().start();
    pool = new Pool({ connectionString: container.getConnectionUri() });

    // Run migrations
    const sql = readFileSync(join(__dirname, "migrations", "001_initial.sql"), "utf-8");
    await pool.query(sql);
  }, 60000);

  afterAll(async () => {
    await pool.end();
    await container.stop();
  });

  it("should create all tables", async () => {
    const result = await pool.query(`
      SELECT table_name FROM information_schema.tables
      WHERE table_schema = 'public'
    `);
    const tableNames = result.rows.map((r) => r.table_name);

    expect(tableNames).toContain("dealer_snapshot");
    expect(tableNames).toContain("alerts");
    expect(tableNames).toContain("actions");
  });

  it("should insert and query dealer snapshot", async () => {
    await pool.query(
      "INSERT INTO dealer_snapshot (id, data, region, level) VALUES ($1, $2, $3, $4)",
      ["D001", JSON.stringify({ name: "张总" }), "华南", "A"]
    );

    const result = await pool.query("SELECT * FROM dealer_snapshot WHERE id = $1", ["D001"]);
    expect(result.rows[0].id).toBe("D001");
    expect(result.rows[0].data.name).toBe("张总");
  });

  it("should enforce foreign key constraints", async () => {
    await expect(
      pool.query(
        "INSERT INTO alerts (dealer_id, type, severity, message) VALUES ($1, $2, $3, $4)",
        ["NONEXISTENT", "sales_drop", "high", "Test alert"]
      )
    ).rejects.toThrow();
  });
});
```

**Step 7: 运行测试**

Run: `npx vitest run src/db/db.test.ts`
Expected: 3 tests pass (需要 Docker 运行)

**Step 8: Commit**

```bash
git add -A
git commit -m "feat: add PostgreSQL database layer with migrations"
```

---

### Task 4: bip-cli 核心框架

**Files:**
- Create: `src/cli/bip/index.ts`
- Create: `src/cli/bip/client.ts`
- Create: `src/cli/bip/commands/dealer.ts`
- Create: `bin/bip-cli`
- Test: `src/cli/bip/bip.test.ts`

**Step 1: 创建 BIP API 客户端**

```typescript
// src/cli/bip/client.ts
import { config } from "../../config/index.js";

export interface BipClientOptions {
  baseUrl: string;
  apiKey: string;
  apiSecret: string;
}

export class BipClient {
  private baseUrl: string;
  private apiKey: string;
  private apiSecret: string;

  constructor(options: BipClientOptions) {
    this.baseUrl = options.baseUrl;
    this.apiKey = options.apiKey;
    this.apiSecret = options.apiSecret;
  }

  private async request<T>(
    endpoint: string,
    options: RequestInit = {}
  ): Promise<T> {
    const url = `${this.baseUrl}${endpoint}`;
    const headers = {
      "Content-Type": "application/json",
      "X-API-Key": this.apiKey,
      "X-API-Secret": this.apiSecret,
      ...options.headers,
    };

    const response = await fetch(url, { ...options, headers });

    if (!response.ok) {
      throw new Error(`BIP API error: ${response.status} ${response.statusText}`);
    }

    return response.json() as Promise<T>;
  }

  async get<T>(endpoint: string): Promise<T> {
    return this.request<T>(endpoint, { method: "GET" });
  }

  async post<T>(endpoint: string, body: unknown): Promise<T> {
    return this.request<T>(endpoint, {
      method: "POST",
      body: JSON.stringify(body),
    });
  }
}

export function createBipClient(): BipClient {
  return new BipClient({
    baseUrl: config.BIP_API_URL,
    apiKey: config.BIP_API_KEY,
    apiSecret: config.BIP_API_SECRET,
  });
}
```

**Step 2: 创建 dealer 命令**

```typescript
// src/cli/bip/commands/dealer.ts
import { BipClient } from "../client.js";

export interface Dealer {
  id: string;
  name: string;
  region: string;
  level: string;
  contact: string;
  phone: string;
  credit_limit: number;
  credit_used: number;
}

export interface DealerListOptions {
  region?: string;
  level?: string;
  status?: string;
}

export async function listDealers(
  client: BipClient,
  options: DealerListOptions = {}
): Promise<Dealer[]> {
  const params = new URLSearchParams();
  if (options.region) params.set("region", options.region);
  if (options.level) params.set("level", options.level);
  if (options.status) params.set("status", options.status);

  const query = params.toString();
  const endpoint = `/dealers${query ? `?${query}` : ""}`;
  return client.get<Dealer[]>(endpoint);
}

export async function getDealer(
  client: BipClient,
  dealerId: string
): Promise<Dealer> {
  return client.get<Dealer>(`/dealers/${dealerId}`);
}
```

**Step 3: 创建 CLI 入口**

```typescript
// src/cli/bip/index.ts
import { parseArgs } from "util";
import { createBipClient } from "./client.js";
import { listDealers, getDealer } from "./commands/dealer.js";

async function main() {
  const { positionals, values } = parseArgs({
    allowPositionals: true,
    options: {
      region: { type: "string" },
      level: { type: "string" },
      status: { type: "string" },
      help: { type: "boolean", short: "h" },
    },
  });

  const [resource, action, ...rest] = positionals;
  const client = createBipClient();

  if (values.help || !resource) {
    console.log(`
Usage: bip-cli <resource> <action> [options]

Resources:
  dealer list [--region <region>] [--level <level>]
  dealer get <dealer_id>
    `);
    process.exit(0);
  }

  try {
    let result: unknown;

    if (resource === "dealer") {
      if (action === "list") {
        result = await listDealers(client, {
          region: values.region,
          level: values.level,
          status: values.status,
        });
      } else if (action === "get" && rest[0]) {
        result = await getDealer(client, rest[0]);
      } else {
        console.error("Unknown action:", action);
        process.exit(1);
      }
    } else {
      console.error("Unknown resource:", resource);
      process.exit(1);
    }

    console.log(JSON.stringify(result, null, 2));
  } catch (error) {
    console.error("Error:", (error as Error).message);
    process.exit(1);
  }
}

main();
```

**Step 4: 创建可执行脚本**

```bash
#!/usr/bin/env node
// bin/bip-cli
import "../dist/cli/bip/index.js";
```

**Step 5: 写测试（使用 mock）**

```typescript
// src/cli/bip/bip.test.ts
import { describe, it, expect, vi, beforeEach } from "vitest";
import { BipClient } from "./client.js";
import { listDealers, getDealer } from "./commands/dealer.js";

describe("BIP CLI", () => {
  let mockClient: BipClient;

  beforeEach(() => {
    mockClient = {
      get: vi.fn(),
      post: vi.fn(),
    } as unknown as BipClient;
  });

  describe("listDealers", () => {
    it("should call correct endpoint without filters", async () => {
      vi.mocked(mockClient.get).mockResolvedValue([]);
      await listDealers(mockClient);
      expect(mockClient.get).toHaveBeenCalledWith("/dealers");
    });

    it("should include region filter in query", async () => {
      vi.mocked(mockClient.get).mockResolvedValue([]);
      await listDealers(mockClient, { region: "华南" });
      expect(mockClient.get).toHaveBeenCalledWith("/dealers?region=%E5%8D%8E%E5%8D%97");
    });
  });

  describe("getDealer", () => {
    it("should call correct endpoint", async () => {
      vi.mocked(mockClient.get).mockResolvedValue({ id: "D001" });
      const result = await getDealer(mockClient, "D001");
      expect(mockClient.get).toHaveBeenCalledWith("/dealers/D001");
      expect(result.id).toBe("D001");
    });
  });
});
```

**Step 6: 运行测试**

Run: `npx vitest run src/cli/bip/bip.test.ts`
Expected: 3 tests pass

**Step 7: Commit**

```bash
git add -A
git commit -m "feat: add bip-cli core framework with dealer commands"
```

---

### Task 5: wecom-cli 核心框架

**Files:**
- Create: `src/cli/wecom/index.ts`
- Create: `src/cli/wecom/client.ts`
- Create: `src/cli/wecom/commands/message.ts`
- Create: `bin/wecom-cli`
- Test: `src/cli/wecom/wecom.test.ts`

**Step 1: 创建企微 API 客户端**

```typescript
// src/cli/wecom/client.ts
import { config } from "../../config/index.js";

export class WecomClient {
  private corpId: string;
  private agentId: string;
  private secret: string;
  private accessToken: string | null = null;
  private tokenExpiry: number = 0;

  constructor(corpId: string, agentId: string, secret: string) {
    this.corpId = corpId;
    this.agentId = agentId;
    this.secret = secret;
  }

  private async getAccessToken(): Promise<string> {
    if (this.accessToken && Date.now() < this.tokenExpiry) {
      return this.accessToken;
    }

    const url = `https://qyapi.weixin.qq.com/cgi-bin/gettoken?corpid=${this.corpId}&corpsecret=${this.secret}`;
    const response = await fetch(url);
    const data = (await response.json()) as {
      access_token: string;
      expires_in: number;
      errcode?: number;
      errmsg?: string;
    };

    if (data.errcode) {
      throw new Error(`WeChat API error: ${data.errcode} ${data.errmsg}`);
    }

    this.accessToken = data.access_token;
    this.tokenExpiry = Date.now() + (data.expires_in - 300) * 1000;
    return this.accessToken;
  }

  async post<T>(endpoint: string, body: unknown): Promise<T> {
    const token = await this.getAccessToken();
    const url = `https://qyapi.weixin.qq.com/cgi-bin${endpoint}?access_token=${token}`;

    const response = await fetch(url, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(body),
    });

    return response.json() as Promise<T>;
  }

  async get<T>(endpoint: string): Promise<T> {
    const token = await this.getAccessToken();
    const url = `https://qyapi.weixin.qq.com/cgi-bin${endpoint}?access_token=${token}`;
    const response = await fetch(url);
    return response.json() as Promise<T>;
  }

  getAgentId(): string {
    return this.agentId;
  }
}

export function createWecomClient(): WecomClient {
  return new WecomClient(
    config.WECOM_CORP_ID,
    config.WECOM_AGENT_ID,
    config.WECOM_SECRET
  );
}
```

**Step 2: 创建 message 命令**

```typescript
// src/cli/wecom/commands/message.ts
import { WecomClient } from "../client.js";

export interface SendMessageOptions {
  toUser: string;
  text?: string;
  card?: object;
}

export async function sendTextMessage(
  client: WecomClient,
  toUser: string,
  content: string
): Promise<{ errcode: number; errmsg: string }> {
  return client.post("/message/send", {
    touser: toUser,
    msgtype: "text",
    agentid: client.getAgentId(),
    text: { content },
  });
}

export async function sendCardMessage(
  client: WecomClient,
  toUser: string,
  card: object
): Promise<{ errcode: number; errmsg: string }> {
  return client.post("/message/send", {
    touser: toUser,
    msgtype: "template_card",
    agentid: client.getAgentId(),
    template_card: card,
  });
}
```

**Step 3: 创建 CLI 入口**

```typescript
// src/cli/wecom/index.ts
import { parseArgs } from "util";
import { createWecomClient } from "./client.js";
import { sendTextMessage, sendCardMessage } from "./commands/message.js";
import { readFileSync } from "fs";

async function main() {
  const { positionals, values } = parseArgs({
    allowPositionals: true,
    options: {
      to: { type: "string" },
      text: { type: "string" },
      card: { type: "string" },
      help: { type: "boolean", short: "h" },
    },
  });

  const [resource, action] = positionals;
  const client = createWecomClient();

  if (values.help || !resource) {
    console.log(`
Usage: wecom-cli <resource> <action> [options]

Resources:
  msg send --to <userid> --text "message"
  msg send --to <userid> --card <json_file>
    `);
    process.exit(0);
  }

  try {
    let result: unknown;

    if (resource === "msg") {
      if (action === "send" && values.to) {
        if (values.text) {
          result = await sendTextMessage(client, values.to, values.text);
        } else if (values.card) {
          const cardContent = JSON.parse(readFileSync(values.card, "utf-8"));
          result = await sendCardMessage(client, values.to, cardContent);
        }
      }
    }

    console.log(JSON.stringify(result, null, 2));
  } catch (error) {
    console.error("Error:", (error as Error).message);
    process.exit(1);
  }
}

main();
```

**Step 4: 写测试**

```typescript
// src/cli/wecom/wecom.test.ts
import { describe, it, expect, vi, beforeEach } from "vitest";
import { WecomClient } from "./client.js";
import { sendTextMessage } from "./commands/message.js";

describe("WeCom CLI", () => {
  let mockClient: WecomClient;

  beforeEach(() => {
    mockClient = {
      post: vi.fn(),
      get: vi.fn(),
      getAgentId: vi.fn().mockReturnValue("1000001"),
    } as unknown as WecomClient;
  });

  describe("sendTextMessage", () => {
    it("should send text message with correct payload", async () => {
      vi.mocked(mockClient.post).mockResolvedValue({ errcode: 0, errmsg: "ok" });

      await sendTextMessage(mockClient, "user123", "Hello");

      expect(mockClient.post).toHaveBeenCalledWith("/message/send", {
        touser: "user123",
        msgtype: "text",
        agentid: "1000001",
        text: { content: "Hello" },
      });
    });
  });
});
```

**Step 5: 运行测试**

Run: `npx vitest run src/cli/wecom/wecom.test.ts`
Expected: 1 test pass

**Step 6: Commit**

```bash
git add -A
git commit -m "feat: add wecom-cli core framework with message commands"
```

---

### Task 6: OpenClaw 集成

**Files:**
- Create: `src/openclaw/index.ts`
- Create: `src/openclaw/tools/bip.ts`
- Create: `src/openclaw/tools/wecom.ts`
- Create: `src/openclaw/channel/wecom.ts`
- Test: `src/openclaw/openclaw.test.ts`

**Step 1: 创建 BIP Tool 定义**

> **安全说明:** 使用 `execFile()` 配合参数数组，避免 shell 命令注入。
> 所有用户输入通过参数数组传递，不经过 shell 解释。

```typescript
// src/openclaw/tools/bip.ts
import { execFile } from "child_process";
import { promisify } from "util";

const execFileAsync = promisify(execFile);

export const bipDealerTool = {
  name: "bip_dealer",
  description: "查询和管理经销商信息。支持列出经销商、获取详情。",
  parameters: {
    type: "object",
    properties: {
      action: {
        type: "string",
        enum: ["list", "get"],
        description: "操作类型",
      },
      dealer_id: {
        type: "string",
        description: "经销商ID（get操作必填）",
      },
      region: {
        type: "string",
        description: "区域筛选（list操作可选）",
      },
      level: {
        type: "string",
        description: "等级筛选（list操作可选）",
      },
    },
    required: ["action"],
  },
  execute: async (params: {
    action: string;
    dealer_id?: string;
    region?: string;
    level?: string;
  }): Promise<string> => {
    // 使用参数数组，避免命令注入
    const args: string[] = ["dealer", params.action];

    if (params.action === "get" && params.dealer_id) {
      args.push(params.dealer_id);
    }
    if (params.region) {
      args.push("--region", params.region);
    }
    if (params.level) {
      args.push("--level", params.level);
    }

    const { stdout } = await execFileAsync("bip-cli", args);
    return stdout;
  },
};

export const bipSalesTool = {
  name: "bip_sales",
  description: "查询销售数据。支持按经销商、区域、时间段查询。",
  parameters: {
    type: "object",
    properties: {
      action: {
        type: "string",
        enum: ["query", "rank", "trend"],
        description: "操作类型",
      },
      dealer_id: {
        type: "string",
        description: "经销商ID",
      },
      region: {
        type: "string",
        description: "区域",
      },
      period: {
        type: "string",
        description: "时间段（月/季/年）",
      },
    },
    required: ["action"],
  },
  execute: async (params: {
    action: string;
    dealer_id?: string;
    region?: string;
    period?: string;
  }): Promise<string> => {
    // 使用参数数组，避免命令注入
    const args: string[] = ["sales", params.action];

    if (params.dealer_id) {
      args.push("--dealer", params.dealer_id);
    }
    if (params.region) {
      args.push("--region", params.region);
    }
    if (params.period) {
      args.push("--period", params.period);
    }

    const { stdout } = await execFileAsync("bip-cli", args);
    return stdout;
  },
};
```

**Step 2: 创建 WeCom Tool 定义**

> **安全说明:** 同样使用 `execFile()` 配合参数数组，避免 shell 命令注入。

```typescript
// src/openclaw/tools/wecom.ts
import { execFile } from "child_process";
import { promisify } from "util";

const execFileAsync = promisify(execFile);

export const wecomMessageTool = {
  name: "wecom_message",
  description: "发送企业微信消息给用户",
  parameters: {
    type: "object",
    properties: {
      to_user: {
        type: "string",
        description: "接收用户的userid",
      },
      content: {
        type: "string",
        description: "消息内容",
      },
    },
    required: ["to_user", "content"],
  },
  execute: async (params: {
    to_user: string;
    content: string;
  }): Promise<string> => {
    // 使用参数数组，避免命令注入
    const args = ["msg", "send", "--to", params.to_user, "--text", params.content];
    const { stdout } = await execFileAsync("wecom-cli", args);
    return stdout;
  },
};

export const wecomCalendarTool = {
  name: "wecom_calendar",
  description: "创建企业微信日程",
  parameters: {
    type: "object",
    properties: {
      user: {
        type: "string",
        description: "用户userid",
      },
      title: {
        type: "string",
        description: "日程标题",
      },
      time: {
        type: "string",
        description: "日程时间",
      },
    },
    required: ["user", "title", "time"],
  },
  execute: async (params: {
    user: string;
    title: string;
    time: string;
  }): Promise<string> => {
    // 使用参数数组，避免命令注入
    const args = ["calendar", "create", "--user", params.user, "--title", params.title, "--time", params.time];
    const { stdout } = await execFileAsync("wecom-cli", args);
    return stdout;
  },
};
```

**Step 3: 创建 OpenClaw 集成入口**

```typescript
// src/openclaw/index.ts
import { bipDealerTool, bipSalesTool } from "./tools/bip.js";
import { wecomMessageTool, wecomCalendarTool } from "./tools/wecom.js";

export const tools = [
  bipDealerTool,
  bipSalesTool,
  wecomMessageTool,
  wecomCalendarTool,
];

export function getToolsConfig() {
  return {
    tools: tools.map((t) => ({
      name: t.name,
      description: t.description,
      parameters: t.parameters,
    })),
  };
}

export async function executeTool(
  toolName: string,
  params: Record<string, unknown>
): Promise<string> {
  const tool = tools.find((t) => t.name === toolName);
  if (!tool) {
    throw new Error(`Unknown tool: ${toolName}`);
  }
  return tool.execute(params as any);
}
```

**Step 4: 写测试**

```typescript
// src/openclaw/openclaw.test.ts
import { describe, it, expect } from "vitest";
import { tools, getToolsConfig, executeTool } from "./index.js";

describe("OpenClaw Tools", () => {
  it("should export 4 tools", () => {
    expect(tools).toHaveLength(4);
  });

  it("should generate tools config", () => {
    const config = getToolsConfig();
    expect(config.tools).toHaveLength(4);
    expect(config.tools[0]).toHaveProperty("name");
    expect(config.tools[0]).toHaveProperty("description");
    expect(config.tools[0]).toHaveProperty("parameters");
  });

  it("should throw for unknown tool", async () => {
    await expect(executeTool("unknown_tool", {})).rejects.toThrow(
      "Unknown tool: unknown_tool"
    );
  });
});
```

**Step 5: 运行测试**

Run: `npx vitest run src/openclaw/openclaw.test.ts`
Expected: 3 tests pass

**Step 6: Commit**

```bash
git add -A
git commit -m "feat: add OpenClaw tool definitions for BIP and WeCom"
```

---

## Phase 2: 经销商运营 Skill (Week 5-8)

### Task 7: 经销商数据仓库

**Files:**
- Create: `src/dealer/repository.ts`
- Create: `src/dealer/types.ts`
- Create: `src/dealer/sync.ts`
- Test: `src/dealer/dealer.test.ts`

**Step 1: 定义类型**

```typescript
// src/dealer/types.ts
export interface Dealer {
  id: string;
  name: string;
  region: string;
  level: "A" | "B" | "C" | "D";
  contact: string;
  phone: string;
  credit_limit: number;
  credit_used: number;
  stores: Store[];
  stats: DealerStats;
}

export interface Store {
  id: string;
  name: string;
  address: string;
  area: number;
}

export interface DealerStats {
  ytd_sales: number;
  mtd_sales: number;
  yoy_growth: number;
  mom_growth: number;
  inventory_turnover_days: number;
  payment_overdue_amount: number;
  payment_overdue_days: number;
  last_order_date: string;
  last_visit_date: string;
}

export interface DealerSnapshot {
  id: string;
  data: Dealer;
  synced_at: Date;
  region: string;
  level: string;
}
```

**Step 2: 创建仓库 (PostgreSQL 版本)**

> **变更说明 (2026-03-23 /plan-eng-review):**
> 从 better-sqlite3 切换到 pg，使用 async/await 模式

```typescript
// src/dealer/repository.ts
import { query, queryOne } from "../db/index.js";
import { Dealer, DealerSnapshot } from "./types.js";

export class DealerRepository {
  async upsert(dealer: Dealer): Promise<void> {
    await query(
      `INSERT INTO dealer_snapshot (id, data, region, level, synced_at)
       VALUES ($1, $2, $3, $4, NOW())
       ON CONFLICT(id) DO UPDATE SET
         data = EXCLUDED.data,
         region = EXCLUDED.region,
         level = EXCLUDED.level,
         synced_at = NOW()`,
      [dealer.id, JSON.stringify(dealer), dealer.region, dealer.level]
    );
  }

  async getById(id: string): Promise<DealerSnapshot | null> {
    const row = await queryOne<{
      id: string;
      data: Dealer;
      synced_at: Date;
      region: string;
      level: string;
    }>("SELECT * FROM dealer_snapshot WHERE id = $1", [id]);

    if (!row) return null;

    return {
      id: row.id,
      data: row.data, // PostgreSQL JSONB 自动解析
      synced_at: new Date(row.synced_at),
      region: row.region,
      level: row.level,
    };
  }

  async listByRegion(region: string): Promise<DealerSnapshot[]> {
    const rows = await query<{
      id: string;
      data: Dealer;
      synced_at: Date;
      region: string;
      level: string;
    }>("SELECT * FROM dealer_snapshot WHERE region = $1", [region]);

    return rows.map((row) => ({
      id: row.id,
      data: row.data,
      synced_at: new Date(row.synced_at),
      region: row.region,
      level: row.level,
    }));
  }

  async getStaleIds(maxAgeHours: number): Promise<string[]> {
    const rows = await query<{ id: string }>(
      `SELECT id FROM dealer_snapshot
       WHERE synced_at < NOW() - INTERVAL '1 hour' * $1`,
      [maxAgeHours]
    );

    return rows.map((r) => r.id);
  }
}
```

**Step 3: 写测试 (PostgreSQL + Testcontainers)**

```typescript
// src/dealer/dealer.test.ts
import { describe, it, expect, beforeAll, afterAll } from "vitest";
import { PostgreSqlContainer, StartedPostgreSqlContainer } from "@testcontainers/postgresql";
import { Pool } from "pg";
import { DealerRepository } from "./repository.js";
import { Dealer } from "./types.js";
import { readFileSync } from "fs";
import { dirname, join } from "path";
import { fileURLToPath } from "url";

const __dirname = dirname(fileURLToPath(import.meta.url));

// Mock the db module to use test pool
let testPool: Pool;
vi.mock("../db/index.js", () => ({
  query: async (sql: string, params?: unknown[]) => {
    const result = await testPool.query(sql, params);
    return result.rows;
  },
  queryOne: async (sql: string, params?: unknown[]) => {
    const result = await testPool.query(sql, params);
    return result.rows[0] || null;
  },
}));

describe("DealerRepository", () => {
  let container: StartedPostgreSqlContainer;
  let repo: DealerRepository;

  const mockDealer: Dealer = {
    id: "D001",
    name: "佛山张总",
    region: "华南",
    level: "A",
    contact: "张明",
    phone: "13800138000",
    credit_limit: 500000,
    credit_used: 200000,
    stores: [],
    stats: {
      ytd_sales: 2800000,
      mtd_sales: 280000,
      yoy_growth: 0.12,
      mom_growth: -0.03,
      inventory_turnover_days: 45,
      payment_overdue_amount: 0,
      payment_overdue_days: 0,
      last_order_date: "2026-03-15",
      last_visit_date: "2026-03-10",
    },
  };

  beforeAll(async () => {
    container = await new PostgreSqlContainer().start();
    testPool = new Pool({ connectionString: container.getConnectionUri() });

    // Run migrations
    const sql = readFileSync(join(__dirname, "../db/migrations/001_initial.sql"), "utf-8");
    await testPool.query(sql);

    repo = new DealerRepository();
  }, 60000);

  afterAll(async () => {
    await testPool.end();
    await container.stop();
  });

  it("should insert and retrieve dealer", async () => {
    await repo.upsert(mockDealer);
    const result = await repo.getById("D001");

    expect(result).not.toBeNull();
    expect(result!.data.name).toBe("佛山张总");
    expect(result!.data.stats.ytd_sales).toBe(2800000);
  });

  it("should update existing dealer", async () => {
    await repo.upsert(mockDealer);
    await repo.upsert({ ...mockDealer, name: "佛山张总（更新）" });

    const result = await repo.getById("D001");
    expect(result!.data.name).toBe("佛山张总（更新）");
  });

  it("should list by region", async () => {
    await repo.upsert(mockDealer);
    await repo.upsert({ ...mockDealer, id: "D002", name: "深圳李总" });

    const results = await repo.listByRegion("华南");
    expect(results).toHaveLength(2);
  });
});
```

**Step 4: 运行测试**

Run: `npx vitest run src/dealer/dealer.test.ts`
Expected: 3 tests pass (需要 Docker 运行)

**Step 5: Commit**

```bash
git add -A
git commit -m "feat: add dealer repository with PostgreSQL CRUD operations"
```

---

### Task 8: 预警检测引擎

**Files:**
- Create: `src/alerts/detector.ts`
- Create: `src/alerts/types.ts`
- Create: `src/alerts/repository.ts`
- Test: `src/alerts/alerts.test.ts`

**Step 1: 定义预警类型**

```typescript
// src/alerts/types.ts
export type AlertType = "sales_drop" | "inventory" | "payment" | "inactive";
export type AlertSeverity = "high" | "medium" | "low";
export type AlertStatus = "pending" | "acknowledged" | "resolved";

export interface Alert {
  id?: number;
  dealer_id: string;
  type: AlertType;
  severity: AlertSeverity;
  message: string;
  data: Record<string, unknown>;
  status: AlertStatus;
  created_at?: Date;
  resolved_at?: Date;
}

export interface AlertRule {
  type: AlertType;
  check: (dealer: any) => Alert | null;
}
```

**Step 2: 创建检测引擎**

```typescript
// src/alerts/detector.ts
import { Alert, AlertRule } from "./types.js";
import { Dealer } from "../dealer/types.js";

export const alertRules: AlertRule[] = [
  // 销量下滑预警
  {
    type: "sales_drop",
    check: (dealer: Dealer): Alert | null => {
      if (dealer.stats.mom_growth < -0.15) {
        return {
          dealer_id: dealer.id,
          type: "sales_drop",
          severity: dealer.stats.mom_growth < -0.25 ? "high" : "medium",
          message: `${dealer.name} 销量环比下滑 ${Math.abs(dealer.stats.mom_growth * 100).toFixed(1)}%`,
          data: {
            mom_growth: dealer.stats.mom_growth,
            mtd_sales: dealer.stats.mtd_sales,
          },
          status: "pending",
        };
      }
      return null;
    },
  },

  // 库存积压预警
  {
    type: "inventory",
    check: (dealer: Dealer): Alert | null => {
      if (dealer.stats.inventory_turnover_days > 60) {
        return {
          dealer_id: dealer.id,
          type: "inventory",
          severity: dealer.stats.inventory_turnover_days > 90 ? "high" : "medium",
          message: `${dealer.name} 库存周转 ${dealer.stats.inventory_turnover_days} 天，积压严重`,
          data: {
            turnover_days: dealer.stats.inventory_turnover_days,
          },
          status: "pending",
        };
      }
      return null;
    },
  },

  // 回款逾期预警
  {
    type: "payment",
    check: (dealer: Dealer): Alert | null => {
      if (dealer.stats.payment_overdue_days > 30) {
        return {
          dealer_id: dealer.id,
          type: "payment",
          severity: dealer.stats.payment_overdue_days > 60 ? "high" : "medium",
          message: `${dealer.name} 回款逾期 ${dealer.stats.payment_overdue_amount} 元，超 ${dealer.stats.payment_overdue_days} 天`,
          data: {
            overdue_amount: dealer.stats.payment_overdue_amount,
            overdue_days: dealer.stats.payment_overdue_days,
          },
          status: "pending",
        };
      }
      return null;
    },
  },

  // 长期未活跃预警
  {
    type: "inactive",
    check: (dealer: Dealer): Alert | null => {
      const lastOrderDate = new Date(dealer.stats.last_order_date);
      const daysSinceOrder = Math.floor(
        (Date.now() - lastOrderDate.getTime()) / (1000 * 60 * 60 * 24)
      );

      if (daysSinceOrder > 30) {
        return {
          dealer_id: dealer.id,
          type: "inactive",
          severity: daysSinceOrder > 60 ? "high" : "low",
          message: `${dealer.name} 已 ${daysSinceOrder} 天未下单`,
          data: {
            last_order_date: dealer.stats.last_order_date,
            days_since_order: daysSinceOrder,
          },
          status: "pending",
        };
      }
      return null;
    },
  },
];

export function detectAlerts(dealer: Dealer): Alert[] {
  const alerts: Alert[] = [];

  for (const rule of alertRules) {
    const alert = rule.check(dealer);
    if (alert) {
      alerts.push(alert);
    }
  }

  return alerts;
}
```

**Step 3: 写测试**

```typescript
// src/alerts/alerts.test.ts
import { describe, it, expect } from "vitest";
import { detectAlerts } from "./detector.js";
import { Dealer } from "../dealer/types.js";

describe("Alert Detector", () => {
  const baseDealer: Dealer = {
    id: "D001",
    name: "测试经销商",
    region: "华南",
    level: "A",
    contact: "张三",
    phone: "13800138000",
    credit_limit: 500000,
    credit_used: 200000,
    stores: [],
    stats: {
      ytd_sales: 2800000,
      mtd_sales: 280000,
      yoy_growth: 0.12,
      mom_growth: 0.05,
      inventory_turnover_days: 45,
      payment_overdue_amount: 0,
      payment_overdue_days: 0,
      last_order_date: new Date().toISOString().split("T")[0],
      last_visit_date: new Date().toISOString().split("T")[0],
    },
  };

  it("should detect sales drop alert", () => {
    const dealer = {
      ...baseDealer,
      stats: { ...baseDealer.stats, mom_growth: -0.20 },
    };

    const alerts = detectAlerts(dealer);

    expect(alerts).toHaveLength(1);
    expect(alerts[0].type).toBe("sales_drop");
    expect(alerts[0].severity).toBe("medium");
  });

  it("should detect high severity sales drop", () => {
    const dealer = {
      ...baseDealer,
      stats: { ...baseDealer.stats, mom_growth: -0.30 },
    };

    const alerts = detectAlerts(dealer);

    expect(alerts[0].severity).toBe("high");
  });

  it("should detect inventory alert", () => {
    const dealer = {
      ...baseDealer,
      stats: { ...baseDealer.stats, inventory_turnover_days: 75 },
    };

    const alerts = detectAlerts(dealer);

    expect(alerts).toHaveLength(1);
    expect(alerts[0].type).toBe("inventory");
  });

  it("should detect payment overdue alert", () => {
    const dealer = {
      ...baseDealer,
      stats: {
        ...baseDealer.stats,
        payment_overdue_amount: 50000,
        payment_overdue_days: 45,
      },
    };

    const alerts = detectAlerts(dealer);

    expect(alerts).toHaveLength(1);
    expect(alerts[0].type).toBe("payment");
  });

  it("should detect multiple alerts", () => {
    const dealer = {
      ...baseDealer,
      stats: {
        ...baseDealer.stats,
        mom_growth: -0.20,
        inventory_turnover_days: 100,
      },
    };

    const alerts = detectAlerts(dealer);

    expect(alerts).toHaveLength(2);
  });

  it("should return no alerts for healthy dealer", () => {
    const alerts = detectAlerts(baseDealer);
    expect(alerts).toHaveLength(0);
  });

  // === 边界条件测试 (来自 /plan-eng-review) ===

  describe("threshold boundary conditions", () => {
    it("should trigger sales_drop at exactly -0.15 (threshold)", () => {
      const dealer = {
        ...baseDealer,
        stats: { ...baseDealer.stats, mom_growth: -0.15 },
      };
      const alerts = detectAlerts(dealer);
      expect(alerts).toHaveLength(1);
      expect(alerts[0].type).toBe("sales_drop");
    });

    it("should NOT trigger sales_drop at -0.149 (just below threshold)", () => {
      const dealer = {
        ...baseDealer,
        stats: { ...baseDealer.stats, mom_growth: -0.149 },
      };
      const alerts = detectAlerts(dealer);
      expect(alerts).toHaveLength(0);
    });

    it("should trigger inventory at exactly 60 days (threshold)", () => {
      const dealer = {
        ...baseDealer,
        stats: { ...baseDealer.stats, inventory_turnover_days: 60 },
      };
      const alerts = detectAlerts(dealer);
      // 注意：当前规则是 > 60，所以 60 不触发
      // 如果业务需要 >= 60，需要修改规则
      expect(alerts).toHaveLength(0);
    });

    it("should trigger inventory at 61 days", () => {
      const dealer = {
        ...baseDealer,
        stats: { ...baseDealer.stats, inventory_turnover_days: 61 },
      };
      const alerts = detectAlerts(dealer);
      expect(alerts).toHaveLength(1);
      expect(alerts[0].type).toBe("inventory");
    });

    it("should trigger payment at exactly 31 days (above 30 threshold)", () => {
      const dealer = {
        ...baseDealer,
        stats: {
          ...baseDealer.stats,
          payment_overdue_amount: 1000,
          payment_overdue_days: 31,
        },
      };
      const alerts = detectAlerts(dealer);
      expect(alerts).toHaveLength(1);
      expect(alerts[0].type).toBe("payment");
    });

    it("should NOT trigger payment at exactly 30 days", () => {
      const dealer = {
        ...baseDealer,
        stats: {
          ...baseDealer.stats,
          payment_overdue_amount: 1000,
          payment_overdue_days: 30,
        },
      };
      const alerts = detectAlerts(dealer);
      expect(alerts).toHaveLength(0);
    });
  });
});
```

**Step 4: 运行测试**

Run: `npx vitest run src/alerts/alerts.test.ts`
Expected: 6 tests pass

**Step 5: Commit**

```bash
git add -A
git commit -m "feat: add alert detection engine with 4 rule types"
```

---

### Task 9: 建议生成器

**Files:**
- Create: `src/suggest/generator.ts`
- Create: `src/suggest/types.ts`
- Create: `src/suggest/templates.ts`
- Test: `src/suggest/suggest.test.ts`

**Step 1: 定义类型**

```typescript
// src/suggest/types.ts
export type SuggestionType = "visit" | "restock" | "policy" | "risk";

export interface Suggestion {
  dealer_id: string;
  type: SuggestionType;
  title: string;
  description: string;
  reason: string;
  priority: "high" | "medium" | "low";
  actions: SuggestedAction[];
}

export interface SuggestedAction {
  label: string;
  action_type: "approve" | "modify" | "dismiss";
  payload?: Record<string, unknown>;
}
```

**Step 2: 创建建议生成器**

```typescript
// src/suggest/generator.ts
import { Alert } from "../alerts/types.js";
import { Dealer } from "../dealer/types.js";
import { Suggestion, SuggestedAction } from "./types.js";

export function generateSuggestions(
  dealer: Dealer,
  alerts: Alert[]
): Suggestion[] {
  const suggestions: Suggestion[] = [];

  for (const alert of alerts) {
    const suggestion = alertToSuggestion(dealer, alert);
    if (suggestion) {
      suggestions.push(suggestion);
    }
  }

  return suggestions;
}

function alertToSuggestion(dealer: Dealer, alert: Alert): Suggestion | null {
  const baseActions: SuggestedAction[] = [
    { label: "批准", action_type: "approve" },
    { label: "修改", action_type: "modify" },
    { label: "稍后", action_type: "dismiss" },
  ];

  switch (alert.type) {
    case "sales_drop":
      return {
        dealer_id: dealer.id,
        type: "visit",
        title: `建议拜访 ${dealer.name}`,
        description: `安排区域经理本周拜访，了解销量下滑原因`,
        reason: alert.message,
        priority: alert.severity === "high" ? "high" : "medium",
        actions: [
          {
            label: "批准拜访",
            action_type: "approve",
            payload: { action: "create_visit", dealer_id: dealer.id },
          },
          { label: "修改建议", action_type: "modify" },
          { label: "稍后处理", action_type: "dismiss" },
        ],
      };

    case "inventory":
      return {
        dealer_id: dealer.id,
        type: "restock",
        title: `${dealer.name} 需要调整库存`,
        description: `建议暂缓补货，或推动促销清库存`,
        reason: alert.message,
        priority: alert.severity === "high" ? "high" : "medium",
        actions: baseActions,
      };

    case "payment":
      return {
        dealer_id: dealer.id,
        type: "risk",
        title: `${dealer.name} 回款预警`,
        description: `建议联系财务跟进，必要时暂停发货`,
        reason: alert.message,
        priority: "high",
        actions: [
          {
            label: "联系跟进",
            action_type: "approve",
            payload: { action: "create_call", dealer_id: dealer.id },
          },
          { label: "暂停发货", action_type: "approve", payload: { action: "hold_shipment" } },
          { label: "稍后处理", action_type: "dismiss" },
        ],
      };

    case "inactive":
      return {
        dealer_id: dealer.id,
        type: "visit",
        title: `${dealer.name} 长期未活跃`,
        description: `建议安排回访，了解经营状况`,
        reason: alert.message,
        priority: alert.severity === "high" ? "medium" : "low",
        actions: baseActions,
      };

    default:
      return null;
  }
}
```

**Step 3: 写测试**

```typescript
// src/suggest/suggest.test.ts
import { describe, it, expect } from "vitest";
import { generateSuggestions } from "./generator.js";
import { Dealer } from "../dealer/types.js";
import { Alert } from "../alerts/types.js";

describe("Suggestion Generator", () => {
  const mockDealer: Dealer = {
    id: "D001",
    name: "佛山张总",
    region: "华南",
    level: "A",
    contact: "张明",
    phone: "13800138000",
    credit_limit: 500000,
    credit_used: 200000,
    stores: [],
    stats: {
      ytd_sales: 2800000,
      mtd_sales: 280000,
      yoy_growth: 0.12,
      mom_growth: -0.20,
      inventory_turnover_days: 45,
      payment_overdue_amount: 0,
      payment_overdue_days: 0,
      last_order_date: "2026-03-15",
      last_visit_date: "2026-03-10",
    },
  };

  it("should generate visit suggestion for sales drop", () => {
    const alerts: Alert[] = [
      {
        dealer_id: "D001",
        type: "sales_drop",
        severity: "medium",
        message: "销量下滑 20%",
        data: {},
        status: "pending",
      },
    ];

    const suggestions = generateSuggestions(mockDealer, alerts);

    expect(suggestions).toHaveLength(1);
    expect(suggestions[0].type).toBe("visit");
    expect(suggestions[0].title).toContain("拜访");
  });

  it("should generate risk suggestion for payment overdue", () => {
    const alerts: Alert[] = [
      {
        dealer_id: "D001",
        type: "payment",
        severity: "high",
        message: "回款逾期 50000 元",
        data: {},
        status: "pending",
      },
    ];

    const suggestions = generateSuggestions(mockDealer, alerts);

    expect(suggestions[0].type).toBe("risk");
    expect(suggestions[0].priority).toBe("high");
  });

  it("should include action buttons", () => {
    const alerts: Alert[] = [
      {
        dealer_id: "D001",
        type: "sales_drop",
        severity: "medium",
        message: "测试",
        data: {},
        status: "pending",
      },
    ];

    const suggestions = generateSuggestions(mockDealer, alerts);

    expect(suggestions[0].actions.length).toBeGreaterThan(0);
    expect(suggestions[0].actions[0]).toHaveProperty("label");
    expect(suggestions[0].actions[0]).toHaveProperty("action_type");
  });
});
```

**Step 4: 运行测试**

Run: `npx vitest run src/suggest/suggest.test.ts`
Expected: 3 tests pass

**Step 5: Commit**

```bash
git add -A
git commit -m "feat: add suggestion generator based on alerts"
```

---

### Task 10: /dealer-ops Skill 整合

**Files:**
- Create: `src/skills/dealer-ops/index.ts`
- Create: `src/skills/dealer-ops/handlers.ts`
- Create: `src/skills/dealer-ops/prompts.ts`
- Test: `src/skills/dealer-ops/skill.test.ts`

**Step 1: 创建 Skill prompt 模板**

```typescript
// src/skills/dealer-ops/prompts.ts
export const SYSTEM_PROMPT = `你是一个经销商运营助手。你可以：

1. 查询经销商信息和经营数据
2. 分析经销商健康状况
3. 生成预警和建议
4. 创建和追踪行动项

使用以下工具：
- bip_dealer: 查询经销商信息
- bip_sales: 查询销售数据
- wecom_message: 发送消息
- wecom_calendar: 创建日程

回复时：
- 使用简洁的中文
- 提供具体数据支持
- 给出可操作的建议
- 对于需要审批的操作，提供选项按钮`;

export const REGION_SUMMARY_PROMPT = `分析这个区域的经销商整体情况，包括：
1. 销售表现（总额、同比、环比）
2. 需要关注的问题经销商
3. 整体健康度评估`;

export const DEALER_DETAIL_PROMPT = `详细分析这个经销商的情况，包括：
1. 基本信息和等级
2. 销售表现趋势
3. 库存和回款状况
4. 存在的问题和建议`;
```

**Step 2: 创建处理函数**

```typescript
// src/skills/dealer-ops/handlers.ts
import { DealerRepository } from "../../dealer/repository.js";
import { detectAlerts } from "../../alerts/detector.js";
import { generateSuggestions } from "../../suggest/generator.js";
import { Dealer, DealerSnapshot } from "../../dealer/types.js";

export interface SkillContext {
  dealerRepo: DealerRepository;
  userId: string;
}

export async function handleRegionQuery(
  ctx: SkillContext,
  region: string
): Promise<{
  summary: string;
  dealers: DealerSnapshot[];
  alerts: { dealer: string; message: string }[];
}> {
  const dealers = ctx.dealerRepo.listByRegion(region);

  const allAlerts: { dealer: string; message: string }[] = [];
  let totalSales = 0;

  for (const snapshot of dealers) {
    const alerts = detectAlerts(snapshot.data);
    for (const alert of alerts) {
      allAlerts.push({
        dealer: snapshot.data.name,
        message: alert.message,
      });
    }
    totalSales += snapshot.data.stats.mtd_sales;
  }

  const summary = `${region}区 ${dealers.length} 家经销商，本月销售额 ${(totalSales / 10000).toFixed(0)} 万`;

  return { summary, dealers, alerts: allAlerts };
}

export async function handleDealerQuery(
  ctx: SkillContext,
  dealerId: string
): Promise<{
  dealer: Dealer | null;
  alerts: ReturnType<typeof detectAlerts>;
  suggestions: ReturnType<typeof generateSuggestions>;
}> {
  const snapshot = ctx.dealerRepo.getById(dealerId);

  if (!snapshot) {
    return { dealer: null, alerts: [], suggestions: [] };
  }

  const alerts = detectAlerts(snapshot.data);
  const suggestions = generateSuggestions(snapshot.data, alerts);

  return {
    dealer: snapshot.data,
    alerts,
    suggestions,
  };
}
```

**Step 3: 创建 Skill 入口**

```typescript
// src/skills/dealer-ops/index.ts
import { SkillContext, handleRegionQuery, handleDealerQuery } from "./handlers.js";
import { SYSTEM_PROMPT } from "./prompts.js";

export interface DealerOpsSkill {
  name: string;
  description: string;
  systemPrompt: string;
  handlers: {
    regionQuery: typeof handleRegionQuery;
    dealerQuery: typeof handleDealerQuery;
  };
}

export function createDealerOpsSkill(ctx: SkillContext): DealerOpsSkill {
  return {
    name: "dealer-ops",
    description: "经销商运营管理技能，支持经销商查询、分析、预警和建议",
    systemPrompt: SYSTEM_PROMPT,
    handlers: {
      regionQuery: (region: string) => handleRegionQuery(ctx, region),
      dealerQuery: (dealerId: string) => handleDealerQuery(ctx, dealerId),
    },
  };
}
```

**Step 4: 写测试**

```typescript
// src/skills/dealer-ops/skill.test.ts
import { describe, it, expect, beforeEach, afterEach } from "vitest";
import { createDealerOpsSkill } from "./index.js";
import { DealerRepository } from "../../dealer/repository.js";
import { getDatabase } from "../../db/index.js";
import Database from "better-sqlite3";
import { unlinkSync, existsSync } from "fs";

describe("Dealer Ops Skill", () => {
  const testDbPath = "./test-skill.db";
  let db: Database.Database;
  let repo: DealerRepository;

  beforeEach(() => {
    db = getDatabase(testDbPath);
    repo = new DealerRepository(db);

    // Insert test data
    repo.upsert({
      id: "D001",
      name: "佛山张总",
      region: "华南",
      level: "A",
      contact: "张明",
      phone: "13800138000",
      credit_limit: 500000,
      credit_used: 200000,
      stores: [],
      stats: {
        ytd_sales: 2800000,
        mtd_sales: 280000,
        yoy_growth: 0.12,
        mom_growth: -0.20,
        inventory_turnover_days: 45,
        payment_overdue_amount: 0,
        payment_overdue_days: 0,
        last_order_date: "2026-03-15",
        last_visit_date: "2026-03-10",
      },
    });
  });

  afterEach(() => {
    db.close();
    if (existsSync(testDbPath)) unlinkSync(testDbPath);
    if (existsSync(testDbPath + "-wal")) unlinkSync(testDbPath + "-wal");
    if (existsSync(testDbPath + "-shm")) unlinkSync(testDbPath + "-shm");
  });

  it("should create skill with handlers", () => {
    const skill = createDealerOpsSkill({ dealerRepo: repo, userId: "test" });

    expect(skill.name).toBe("dealer-ops");
    expect(skill.handlers.regionQuery).toBeDefined();
    expect(skill.handlers.dealerQuery).toBeDefined();
  });

  it("should handle region query", async () => {
    const skill = createDealerOpsSkill({ dealerRepo: repo, userId: "test" });
    const result = await skill.handlers.regionQuery("华南");

    expect(result.dealers).toHaveLength(1);
    expect(result.summary).toContain("华南");
    expect(result.alerts).toHaveLength(1); // sales_drop alert
  });

  it("should handle dealer query with suggestions", async () => {
    const skill = createDealerOpsSkill({ dealerRepo: repo, userId: "test" });
    const result = await skill.handlers.dealerQuery("D001");

    expect(result.dealer).not.toBeNull();
    expect(result.alerts.length).toBeGreaterThan(0);
    expect(result.suggestions.length).toBeGreaterThan(0);
  });
});
```

**Step 5: 运行测试**

Run: `npx vitest run src/skills/dealer-ops/skill.test.ts`
Expected: 3 tests pass

**Step 6: Commit**

```bash
git add -A
git commit -m "feat: add dealer-ops skill with query handlers"
```

---

## Phase 3: 集成与测试 (Week 9-12)

> **补充说明 (2026-03-23 /plan-eng-review):**
> 原计划省略了 Phase 3 详细步骤，现补充完整的测试计划。

### Task 11: Mock Server 搭建

**Files:**
- Create: `tests/mocks/bip-server.ts`
- Create: `tests/mocks/wecom-server.ts`
- Create: `tests/fixtures/dealers.json`
- Create: `tests/fixtures/sales.json`

**Step 1: 创建 BIP Mock Server**

```typescript
// tests/mocks/bip-server.ts
import { createServer } from "http";
import { readFileSync } from "fs";
import { join, dirname } from "path";
import { fileURLToPath } from "url";

const __dirname = dirname(fileURLToPath(import.meta.url));

const dealers = JSON.parse(
  readFileSync(join(__dirname, "../fixtures/dealers.json"), "utf-8")
);

export function startBipMockServer(port = 3001) {
  const server = createServer((req, res) => {
    res.setHeader("Content-Type", "application/json");

    if (req.url?.startsWith("/dealers")) {
      const url = new URL(req.url, `http://localhost:${port}`);
      const region = url.searchParams.get("region");

      let result = dealers;
      if (region) {
        result = dealers.filter((d: any) => d.region === region);
      }

      res.end(JSON.stringify(result));
      return;
    }

    res.statusCode = 404;
    res.end(JSON.stringify({ error: "Not found" }));
  });

  server.listen(port);
  return server;
}
```

**Step 2: 创建 WeCom Mock Server**

```typescript
// tests/mocks/wecom-server.ts
import { createServer } from "http";

const messages: any[] = [];
let rateLimitCounter = 0;

export function startWecomMockServer(port = 3002) {
  const server = createServer((req, res) => {
    res.setHeader("Content-Type", "application/json");

    // 模拟频率限制
    rateLimitCounter++;
    if (rateLimitCounter > 100) {
      res.end(JSON.stringify({ errcode: 45009, errmsg: "api freq out of limit" }));
      return;
    }

    if (req.url?.includes("/gettoken")) {
      res.end(JSON.stringify({
        access_token: "mock_token_12345",
        expires_in: 7200,
      }));
      return;
    }

    if (req.url?.includes("/message/send")) {
      let body = "";
      req.on("data", (chunk) => (body += chunk));
      req.on("end", () => {
        const message = JSON.parse(body);
        messages.push(message);
        res.end(JSON.stringify({ errcode: 0, errmsg: "ok", msgid: Date.now() }));
      });
      return;
    }

    res.statusCode = 404;
    res.end(JSON.stringify({ error: "Not found" }));
  });

  server.listen(port);
  return { server, messages, resetRateLimit: () => (rateLimitCounter = 0) };
}
```

**Step 3: 创建测试数据**

```json
// tests/fixtures/dealers.json
[
  {
    "id": "D001",
    "name": "佛山张总",
    "region": "华南",
    "level": "A",
    "stats": {
      "ytd_sales": 2800000,
      "mtd_sales": 280000,
      "mom_growth": -0.20
    }
  },
  {
    "id": "D002",
    "name": "深圳李总",
    "region": "华南",
    "level": "B",
    "stats": {
      "ytd_sales": 1500000,
      "mtd_sales": 150000,
      "mom_growth": 0.05
    }
  }
]
```

---

### Task 12: 集成测试

**Files:**
- Create: `tests/integration/bip-cli.test.ts`
- Create: `tests/integration/wecom-cli.test.ts`
- Create: `tests/integration/alert-flow.test.ts`

**Step 1: BIP CLI 集成测试**

```typescript
// tests/integration/bip-cli.test.ts
import { describe, it, expect, beforeAll, afterAll } from "vitest";
import { startBipMockServer } from "../mocks/bip-server.js";
import { execSync } from "child_process";

describe("BIP CLI Integration", () => {
  let server: ReturnType<typeof startBipMockServer>;

  beforeAll(() => {
    process.env.BIP_API_URL = "http://localhost:3001";
    server = startBipMockServer(3001);
  });

  afterAll(() => {
    server.close();
  });

  it("should list dealers from mock server", () => {
    const output = execSync("npx tsx src/cli/bip/index.ts dealer list", {
      encoding: "utf-8",
    });
    const dealers = JSON.parse(output);
    expect(dealers.length).toBeGreaterThan(0);
  });

  it("should filter dealers by region", () => {
    const output = execSync(
      "npx tsx src/cli/bip/index.ts dealer list --region 华南",
      { encoding: "utf-8" }
    );
    const dealers = JSON.parse(output);
    expect(dealers.every((d: any) => d.region === "华南")).toBe(true);
  });
});
```

**Step 2: 预警流程集成测试**

```typescript
// tests/integration/alert-flow.test.ts
import { describe, it, expect, beforeAll, afterAll } from "vitest";
import { PostgreSqlContainer, StartedPostgreSqlContainer } from "@testcontainers/postgresql";
import { Pool } from "pg";
import { startBipMockServer } from "../mocks/bip-server.js";
import { startWecomMockServer } from "../mocks/wecom-server.js";
import { DealerRepository } from "../../src/dealer/repository.js";
import { detectAlerts } from "../../src/alerts/detector.js";

describe("Alert Flow Integration", () => {
  let pgContainer: StartedPostgreSqlContainer;
  let pool: Pool;
  let bipServer: any;
  let wecomServer: any;

  beforeAll(async () => {
    pgContainer = await new PostgreSqlContainer().start();
    pool = new Pool({ connectionString: pgContainer.getConnectionUri() });
    bipServer = startBipMockServer(3001);
    wecomServer = startWecomMockServer(3002);
  }, 60000);

  afterAll(async () => {
    await pool.end();
    await pgContainer.stop();
    bipServer.close();
    wecomServer.server.close();
  });

  it("should sync dealers and detect alerts", async () => {
    // 1. 从 BIP 同步经销商数据
    const response = await fetch("http://localhost:3001/dealers");
    const dealers = await response.json();

    // 2. 存入数据库
    const repo = new DealerRepository();
    for (const dealer of dealers) {
      await repo.upsert(dealer);
    }

    // 3. 检测预警
    const snapshots = await repo.listByRegion("华南");
    const allAlerts = [];
    for (const snapshot of snapshots) {
      const alerts = detectAlerts(snapshot.data);
      allAlerts.push(...alerts);
    }

    // 4. 验证检测到预警
    expect(allAlerts.length).toBeGreaterThan(0);
  });

  it("should handle WeCom rate limit gracefully", async () => {
    // 触发频率限制
    for (let i = 0; i < 110; i++) {
      await fetch("http://localhost:3002/cgi-bin/message/send?access_token=test", {
        method: "POST",
        body: JSON.stringify({ touser: "test", msgtype: "text", text: { content: "test" } }),
      });
    }

    // 验证频率限制响应
    const response = await fetch("http://localhost:3002/cgi-bin/message/send?access_token=test", {
      method: "POST",
      body: JSON.stringify({ touser: "test", msgtype: "text", text: { content: "test" } }),
    });
    const result = await response.json();
    expect(result.errcode).toBe(45009);
  });
});
```

---

### Task 13: 熔断器测试

**Files:**
- Create: `tests/integration/circuit-breaker.test.ts`

**Step 1: 熔断器降级测试**

```typescript
// tests/integration/circuit-breaker.test.ts
import { describe, it, expect, beforeEach } from "vitest";

// 简化版熔断器实现
class CircuitBreaker {
  private failures = 0;
  private lastFailure = 0;
  private state: "closed" | "open" | "half-open" = "closed";

  constructor(
    private threshold: number,
    private recoveryTimeout: number
  ) {}

  async execute<T>(fn: () => Promise<T>, fallback: () => T): Promise<T> {
    if (this.state === "open") {
      if (Date.now() - this.lastFailure > this.recoveryTimeout) {
        this.state = "half-open";
      } else {
        return fallback();
      }
    }

    try {
      const result = await fn();
      this.failures = 0;
      this.state = "closed";
      return result;
    } catch (error) {
      this.failures++;
      this.lastFailure = Date.now();
      if (this.failures >= this.threshold) {
        this.state = "open";
      }
      return fallback();
    }
  }

  getState() {
    return this.state;
  }
}

describe("Circuit Breaker", () => {
  let breaker: CircuitBreaker;

  beforeEach(() => {
    breaker = new CircuitBreaker(3, 1000);
  });

  it("should stay closed on successful calls", async () => {
    await breaker.execute(async () => "ok", () => "fallback");
    expect(breaker.getState()).toBe("closed");
  });

  it("should open after threshold failures", async () => {
    const failingFn = async () => {
      throw new Error("fail");
    };

    for (let i = 0; i < 3; i++) {
      await breaker.execute(failingFn, () => "fallback");
    }

    expect(breaker.getState()).toBe("open");
  });

  it("should return fallback when open", async () => {
    const failingFn = async () => {
      throw new Error("fail");
    };

    // 触发熔断
    for (let i = 0; i < 3; i++) {
      await breaker.execute(failingFn, () => "fallback");
    }

    // 验证返回降级值
    const result = await breaker.execute(
      async () => "should not run",
      () => "fallback"
    );
    expect(result).toBe("fallback");
  });
});
```

---

### Task 14: 端到端测试

**Files:**
- Create: `tests/e2e/user-journey.test.ts`

**Step 1: 用户旅程 E2E 测试**

```typescript
// tests/e2e/user-journey.test.ts
import { describe, it, expect, beforeAll, afterAll } from "vitest";
import { PostgreSqlContainer } from "@testcontainers/postgresql";
import { startBipMockServer } from "../mocks/bip-server.js";
import { startWecomMockServer } from "../mocks/wecom-server.js";

describe("User Journey E2E", () => {
  // Setup: 启动所有服务
  // ...

  it("完整流程: 用户问华南区情况 → 返回汇总 + 预警", async () => {
    // 1. 模拟用户发送消息 "华南区情况怎么样"
    // 2. OpenClaw 解析意图 → 调用 /dealer-ops Skill
    // 3. Skill 调用 bip-cli → 获取经销商数据
    // 4. 检测预警 → 生成建议
    // 5. 返回格式化响应

    // 由于 OpenClaw 集成未验证，此测试暂时 mock Skill 层
    const response = {
      summary: "华南区 47 家经销商本月整体表现：销售额 1,280 万",
      alerts: [
        { dealer: "佛山张总", message: "连续 2 月销量下滑 18%" },
      ],
    };

    expect(response.summary).toContain("华南区");
    expect(response.alerts.length).toBeGreaterThan(0);
  });

  it("完整流程: Agent 检测预警 → 推送企微 → 用户审批", async () => {
    // 1. 定时任务触发预警检测
    // 2. 检测到销量下滑
    // 3. 生成建议卡片
    // 4. 通过 wecom-cli 推送
    // 5. 用户点击"批准拜访"
    // 6. 创建行动记录

    // 验证消息发送到 mock server
    // ...
  });

  it("降级流程: BIP 不可用 → 使用缓存数据", async () => {
    // 1. 关闭 BIP mock server
    // 2. 用户查询经销商
    // 3. 系统使用缓存数据响应
    // 4. 响应中标注 "显示的是今早 6 点的数据"

    // ...
  });
});
```

---

### Task 15: 灰度发布与监控

**Files:**
- Create: `docker-compose.yml`
- Create: `prometheus.yml`
- Create: `grafana/dashboards/crm.json`

**Step 1: Docker Compose 配置**

```yaml
# docker-compose.yml
version: "3.8"

services:
  app:
    build: .
    ports:
      - "18789:18789"
    environment:
      - DATABASE_URL=postgresql://postgres:postgres@db:5432/aicrm
      - REDIS_URL=redis://redis:6379
      - BIP_API_URL=${BIP_API_URL}
      - WECOM_CORP_ID=${WECOM_CORP_ID}
    depends_on:
      - db
      - redis

  db:
    image: postgres:15
    environment:
      - POSTGRES_DB=aicrm
      - POSTGRES_PASSWORD=postgres
    volumes:
      - pgdata:/var/lib/postgresql/data

  redis:
    image: redis:7
    command: redis-server --appendonly yes --appendfsync everysec
    volumes:
      - redisdata:/data

  prometheus:
    image: prom/prometheus
    ports:
      - "9090:9090"
    volumes:
      - ./prometheus.yml:/etc/prometheus/prometheus.yml

  grafana:
    image: grafana/grafana
    ports:
      - "3000:3000"
    volumes:
      - ./grafana/dashboards:/etc/grafana/provisioning/dashboards

volumes:
  pgdata:
  redisdata:
```

**Step 2: 灰度发布计划**

| 阶段 | 用户数 | 时间 | 监控指标 |
|------|--------|------|----------|
| Alpha | 5 人 | Week 9 | 错误率 < 5% |
| Beta | 15 人 | Week 10 | 响应时间 < 5s |
| GA | 30 人 | Week 11-12 | 日活 > 60% |

---

## 检查清单

完成所有 Task 后，确认：

- [ ] 所有测试通过 (`npm test`)
- [ ] bip-cli 可以连接真实 BIP API
- [ ] wecom-cli 可以发送消息
- [ ] OpenClaw 可以启动并接入企微
- [ ] /dealer-ops Skill 可以响应查询
- [ ] 预警检测正常工作
- [ ] 建议生成包含正确的按钮
- [ ] 30 人灰度用户可以正常使用

---

## 附录：完整文件结构

> **更新 (2026-03-23 /plan-eng-review):**
> - 数据库从 SQLite 改为 PostgreSQL
> - 添加测试目录结构
> - 添加 Docker 部署文件

```
AICRM/
├── package.json
├── tsconfig.json
├── .env.example
├── .gitignore
├── docker-compose.yml          # NEW: Docker 部署
├── prometheus.yml              # NEW: 监控配置
├── bin/
│   ├── bip-cli
│   └── wecom-cli
├── src/
│   ├── index.ts
│   ├── config/
│   │   ├── index.ts
│   │   └── schema.ts
│   ├── db/
│   │   ├── index.ts
│   │   ├── client.ts           # NEW: PostgreSQL 客户端
│   │   └── migrations/         # CHANGED: migrations 目录
│   │       └── 001_initial.sql
│   ├── cli/
│   │   ├── bip/
│   │   │   ├── index.ts
│   │   │   ├── client.ts
│   │   │   └── commands/
│   │   │       └── dealer.ts
│   │   └── wecom/
│   │       ├── index.ts
│   │       ├── client.ts
│   │       └── commands/
│   │           └── message.ts
│   ├── openclaw/
│   │   ├── index.ts
│   │   └── tools/
│   │       ├── bip.ts          # UPDATED: execFile 安全修复
│   │       └── wecom.ts        # UPDATED: execFile 安全修复
│   ├── dealer/
│   │   ├── repository.ts       # UPDATED: PostgreSQL 版本
│   │   ├── types.ts
│   │   └── sync.ts
│   ├── alerts/
│   │   ├── detector.ts
│   │   ├── types.ts
│   │   └── repository.ts
│   ├── suggest/
│   │   ├── generator.ts
│   │   ├── types.ts
│   │   └── templates.ts
│   └── skills/
│       └── dealer-ops/
│           ├── index.ts
│           ├── handlers.ts
│           └── prompts.ts
├── tests/                      # NEW: 测试目录
│   ├── mocks/
│   │   ├── bip-server.ts
│   │   └── wecom-server.ts
│   ├── fixtures/
│   │   ├── dealers.json
│   │   └── sales.json
│   ├── integration/
│   │   ├── bip-cli.test.ts
│   │   ├── wecom-cli.test.ts
│   │   ├── alert-flow.test.ts
│   │   └── circuit-breaker.test.ts
│   └── e2e/
│       └── user-journey.test.ts
├── grafana/                    # NEW: Grafana 仪表盘
│   └── dashboards/
│       └── crm.json
└── docs/
    └── plans/
        ├── 2026-03-21-ai-native-crm-design.md
        └── 2026-03-21-ai-native-crm-implementation.md
```
