# AI-Native CRM 第一期实施计划

> **For Claude:** REQUIRED SUB-SKILL: Use superpowers:executing-plans to implement this plan task-by-task.

**Goal:** 构建基于 OpenClaw 的 AI Agent 驱动型 CRM MVP，实现经销商运营场景，支持 30 人通过企业微信对话式交互。

**Architecture:** OpenClaw Gateway 作为 Agent 平台，通过企微 Channel 接入用户，调用自研 /dealer-ops Skill 处理业务逻辑，Skill 通过 bip-cli 和 wecom-cli 工具访问用友 BIP 和企业微信 API。本地 SQLite 做数据缓存和状态管理。

**Tech Stack:** Node.js 24+, TypeScript, OpenClaw, SQLite, BullMQ/Redis, 用友 BIP API, 企业微信 API

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

### Task 3: SQLite 数据库层

**Files:**
- Create: `src/db/index.ts`
- Create: `src/db/schema.sql`
- Create: `src/db/migrations.ts`
- Test: `src/db/db.test.ts`

**Step 1: 创建 SQL schema**

```sql
-- src/db/schema.sql

-- 经销商快照
CREATE TABLE IF NOT EXISTS dealer_snapshot (
    id TEXT PRIMARY KEY,
    data JSON NOT NULL,
    synced_at DATETIME DEFAULT CURRENT_TIMESTAMP,
    region TEXT,
    level TEXT
);

CREATE INDEX IF NOT EXISTS idx_dealer_region ON dealer_snapshot(region);
CREATE INDEX IF NOT EXISTS idx_dealer_level ON dealer_snapshot(level);

-- 预警记录
CREATE TABLE IF NOT EXISTS alerts (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    dealer_id TEXT NOT NULL,
    type TEXT NOT NULL CHECK(type IN ('sales_drop', 'inventory', 'payment', 'inactive')),
    severity TEXT NOT NULL CHECK(severity IN ('high', 'medium', 'low')),
    message TEXT NOT NULL,
    data JSON,
    status TEXT DEFAULT 'pending' CHECK(status IN ('pending', 'acknowledged', 'resolved')),
    created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
    resolved_at DATETIME,
    FOREIGN KEY (dealer_id) REFERENCES dealer_snapshot(id)
);

CREATE INDEX IF NOT EXISTS idx_alerts_dealer ON alerts(dealer_id);
CREATE INDEX IF NOT EXISTS idx_alerts_status ON alerts(status);

-- 行动记录
CREATE TABLE IF NOT EXISTS actions (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    dealer_id TEXT NOT NULL,
    type TEXT NOT NULL CHECK(type IN ('visit', 'restock', 'call', 'policy')),
    title TEXT NOT NULL,
    description TEXT,
    assignee TEXT,
    status TEXT DEFAULT 'pending' CHECK(status IN ('pending', 'approved', 'in_progress', 'done', 'cancelled')),
    due_date DATETIME,
    created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
    completed_at DATETIME,
    source TEXT DEFAULT 'manual' CHECK(source IN ('agent_suggest', 'manual')),
    FOREIGN KEY (dealer_id) REFERENCES dealer_snapshot(id)
);

CREATE INDEX IF NOT EXISTS idx_actions_dealer ON actions(dealer_id);
CREATE INDEX IF NOT EXISTS idx_actions_assignee ON actions(assignee);
CREATE INDEX IF NOT EXISTS idx_actions_status ON actions(status);
```

**Step 2: 创建数据库模块**

```typescript
// src/db/index.ts
import Database from "better-sqlite3";
import { readFileSync } from "fs";
import { dirname, join } from "path";
import { fileURLToPath } from "url";

const __dirname = dirname(fileURLToPath(import.meta.url));

export function createDatabase(dbPath: string): Database.Database {
  const db = new Database(dbPath);
  db.pragma("journal_mode = WAL");
  db.pragma("foreign_keys = ON");
  return db;
}

export function initializeSchema(db: Database.Database): void {
  const schema = readFileSync(join(__dirname, "schema.sql"), "utf-8");
  db.exec(schema);
}

export function getDatabase(dbPath: string): Database.Database {
  const db = createDatabase(dbPath);
  initializeSchema(db);
  return db;
}
```

**Step 3: 写测试**

```typescript
// src/db/db.test.ts
import { describe, it, expect, beforeEach, afterEach } from "vitest";
import { getDatabase } from "./index.js";
import Database from "better-sqlite3";
import { unlinkSync, existsSync } from "fs";

describe("Database", () => {
  const testDbPath = "./test-crm.db";
  let db: Database.Database;

  beforeEach(() => {
    db = getDatabase(testDbPath);
  });

  afterEach(() => {
    db.close();
    if (existsSync(testDbPath)) unlinkSync(testDbPath);
    if (existsSync(testDbPath + "-wal")) unlinkSync(testDbPath + "-wal");
    if (existsSync(testDbPath + "-shm")) unlinkSync(testDbPath + "-shm");
  });

  it("should create all tables", () => {
    const tables = db
      .prepare("SELECT name FROM sqlite_master WHERE type='table'")
      .all() as { name: string }[];
    const tableNames = tables.map((t) => t.name);

    expect(tableNames).toContain("dealer_snapshot");
    expect(tableNames).toContain("alerts");
    expect(tableNames).toContain("actions");
  });

  it("should insert and query dealer snapshot", () => {
    const stmt = db.prepare(
      "INSERT INTO dealer_snapshot (id, data, region, level) VALUES (?, ?, ?, ?)"
    );
    stmt.run("D001", JSON.stringify({ name: "张总" }), "华南", "A");

    const row = db
      .prepare("SELECT * FROM dealer_snapshot WHERE id = ?")
      .get("D001") as any;
    expect(row.id).toBe("D001");
    expect(JSON.parse(row.data).name).toBe("张总");
  });

  it("should enforce foreign key constraints", () => {
    const stmt = db.prepare(
      "INSERT INTO alerts (dealer_id, type, severity, message) VALUES (?, ?, ?, ?)"
    );
    expect(() => {
      stmt.run("NONEXISTENT", "sales_drop", "high", "Test alert");
    }).toThrow();
  });
});
```

**Step 4: 运行测试**

Run: `npx vitest run src/db/db.test.ts`
Expected: 3 tests pass

**Step 5: Commit**

```bash
git add -A
git commit -m "feat: add SQLite database layer with schema"
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

```typescript
// src/openclaw/tools/bip.ts
import { exec } from "child_process";
import { promisify } from "util";

const execAsync = promisify(exec);

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
    let cmd = `bip-cli dealer ${params.action}`;

    if (params.action === "get" && params.dealer_id) {
      cmd += ` ${params.dealer_id}`;
    }
    if (params.region) cmd += ` --region "${params.region}"`;
    if (params.level) cmd += ` --level "${params.level}"`;

    const { stdout } = await execAsync(cmd);
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
    let cmd = `bip-cli sales ${params.action}`;

    if (params.dealer_id) cmd += ` --dealer "${params.dealer_id}"`;
    if (params.region) cmd += ` --region "${params.region}"`;
    if (params.period) cmd += ` --period "${params.period}"`;

    const { stdout } = await execAsync(cmd);
    return stdout;
  },
};
```

**Step 2: 创建 WeCom Tool 定义**

```typescript
// src/openclaw/tools/wecom.ts
import { exec } from "child_process";
import { promisify } from "util";

const execAsync = promisify(exec);

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
    const cmd = `wecom-cli msg send --to "${params.to_user}" --text "${params.content}"`;
    const { stdout } = await execAsync(cmd);
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
    const cmd = `wecom-cli calendar create --user "${params.user}" --title "${params.title}" --time "${params.time}"`;
    const { stdout } = await execAsync(cmd);
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

**Step 2: 创建仓库**

```typescript
// src/dealer/repository.ts
import Database from "better-sqlite3";
import { Dealer, DealerSnapshot } from "./types.js";

export class DealerRepository {
  constructor(private db: Database.Database) {}

  upsert(dealer: Dealer): void {
    const stmt = this.db.prepare(`
      INSERT INTO dealer_snapshot (id, data, region, level, synced_at)
      VALUES (?, ?, ?, ?, CURRENT_TIMESTAMP)
      ON CONFLICT(id) DO UPDATE SET
        data = excluded.data,
        region = excluded.region,
        level = excluded.level,
        synced_at = CURRENT_TIMESTAMP
    `);
    stmt.run(dealer.id, JSON.stringify(dealer), dealer.region, dealer.level);
  }

  getById(id: string): DealerSnapshot | null {
    const row = this.db
      .prepare("SELECT * FROM dealer_snapshot WHERE id = ?")
      .get(id) as any;

    if (!row) return null;

    return {
      id: row.id,
      data: JSON.parse(row.data),
      synced_at: new Date(row.synced_at),
      region: row.region,
      level: row.level,
    };
  }

  listByRegion(region: string): DealerSnapshot[] {
    const rows = this.db
      .prepare("SELECT * FROM dealer_snapshot WHERE region = ?")
      .all(region) as any[];

    return rows.map((row) => ({
      id: row.id,
      data: JSON.parse(row.data),
      synced_at: new Date(row.synced_at),
      region: row.region,
      level: row.level,
    }));
  }

  getStaleIds(maxAgeHours: number): string[] {
    const rows = this.db
      .prepare(
        `SELECT id FROM dealer_snapshot
         WHERE synced_at < datetime('now', '-' || ? || ' hours')`
      )
      .all(maxAgeHours) as { id: string }[];

    return rows.map((r) => r.id);
  }
}
```

**Step 3: 写测试**

```typescript
// src/dealer/dealer.test.ts
import { describe, it, expect, beforeEach, afterEach } from "vitest";
import { DealerRepository } from "./repository.js";
import { Dealer } from "./types.js";
import { getDatabase } from "../db/index.js";
import Database from "better-sqlite3";
import { unlinkSync, existsSync } from "fs";

describe("DealerRepository", () => {
  const testDbPath = "./test-dealer.db";
  let db: Database.Database;
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

  beforeEach(() => {
    db = getDatabase(testDbPath);
    repo = new DealerRepository(db);
  });

  afterEach(() => {
    db.close();
    if (existsSync(testDbPath)) unlinkSync(testDbPath);
    if (existsSync(testDbPath + "-wal")) unlinkSync(testDbPath + "-wal");
    if (existsSync(testDbPath + "-shm")) unlinkSync(testDbPath + "-shm");
  });

  it("should insert and retrieve dealer", () => {
    repo.upsert(mockDealer);
    const result = repo.getById("D001");

    expect(result).not.toBeNull();
    expect(result!.data.name).toBe("佛山张总");
    expect(result!.data.stats.ytd_sales).toBe(2800000);
  });

  it("should update existing dealer", () => {
    repo.upsert(mockDealer);
    repo.upsert({ ...mockDealer, name: "佛山张总（更新）" });

    const result = repo.getById("D001");
    expect(result!.data.name).toBe("佛山张总（更新）");
  });

  it("should list by region", () => {
    repo.upsert(mockDealer);
    repo.upsert({ ...mockDealer, id: "D002", name: "深圳李总" });

    const results = repo.listByRegion("华南");
    expect(results).toHaveLength(2);
  });
});
```

**Step 4: 运行测试**

Run: `npx vitest run src/dealer/dealer.test.ts`
Expected: 3 tests pass

**Step 5: Commit**

```bash
git add -A
git commit -m "feat: add dealer repository with CRUD operations"
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

### Task 11-15: 集成测试、压力测试、安全测试、灰度发布

（此处省略详细步骤，结构与前面类似）

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

```
AICRM/
├── package.json
├── tsconfig.json
├── .env.example
├── .gitignore
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
│   │   └── schema.sql
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
│   │       ├── bip.ts
│   │       └── wecom.ts
│   ├── dealer/
│   │   ├── repository.ts
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
└── docs/
    └── plans/
        ├── 2026-03-21-ai-native-crm-design.md
        └── 2026-03-21-ai-native-crm-implementation.md
```
