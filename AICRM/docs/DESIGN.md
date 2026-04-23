# AI-Native CRM 设计系统

> 本文档定义了 AI-Native CRM 的视觉语言、组件规范和交互模式。
> 所有开发者必须遵循这些规范以确保产品视觉一致性。

## 设计原则

1. **专业克制** — 企业级应用，避免过度设计
2. **信息密度适中** — 平衡效率与可读性
3. **AI 原生** — 对话优先，表单次之
4. **移动友好** — 桌面和移动端同等重要

---

## 技术栈

| 层级 | 选型 | 理由 |
|------|------|------|
| 组件库 | shadcn/ui | 可定制、无运行时依赖、TypeScript 原生 |
| 样式 | Tailwind CSS | 原子化、一致性、与 shadcn/ui 完美配合 |
| 框架 | Next.js | SSR、API Routes、App Router |
| 图标 | Lucide Icons | shadcn/ui 默认、体积小 |

---

## 颜色系统

### 主色调

```css
/* 主色 - 深灰，专业稳重 */
--primary: slate-900;        /* #0f172a */
--primary-foreground: white;

/* 背景 */
--background: white;         /* 亮色模式 */
--background-dark: slate-950; /* 暗色模式 */
```

### 语义色

| 语义 | 颜色 | Tailwind | 用途 |
|------|------|----------|------|
| 成功 | green-600 | `text-green-600` | 操作成功、正增长 |
| 警告 | amber-500 | `text-amber-500` | 需关注、中等预警 |
| 危险 | red-600 | `text-red-600` | 错误、高优先级预警 |
| 信息 | blue-600 | `text-blue-600` | 提示、链接 |
| 中性 | slate-500 | `text-slate-500` | 辅助文字、禁用态 |

### 预警级别色彩

| 级别 | 背景 | 边框 | 文字 |
|------|------|------|------|
| 高 | red-50 | red-200 | red-700 |
| 中 | amber-50 | amber-200 | amber-700 |
| 低 | slate-50 | slate-200 | slate-700 |

---

## 排版系统

### 字体

```css
font-family: system-ui, "PingFang SC", "Microsoft YaHei", sans-serif;
```

### 字号层级

| 用途 | 大小 | 行高 | 字重 |
|------|------|------|------|
| 页面标题 | 24px / text-2xl | 1.25 | 600 |
| 卡片标题 | 18px / text-lg | 1.4 | 600 |
| 正文 | 14px / text-sm | 1.5 | 400 |
| 辅助文字 | 12px / text-xs | 1.4 | 400 |
| 数字 | 14px / text-sm | 1 | 500, tabular-nums |

### 数字格式

```tsx
// 金额 - 使用 tabular-nums 确保对齐
<span className="font-medium tabular-nums">¥1,280,000</span>

// 百分比 - 带颜色语义
<span className="tabular-nums text-green-600">+12.5%</span>
<span className="tabular-nums text-red-600">-8.3%</span>
```

---

## Emoji 使用规范

### 允许使用

| 场景 | 示例 | 说明 |
|------|------|------|
| 预警级别标识 | ⚠️ 中等预警 | 视觉快速识别 |
| 高优先级标识 | ❗高优先级 | 强调紧急性 |
| 成功确认 | ✅ 已批准 | 状态确认 |

### 禁止使用

| 场景 | 错误示例 | 正确做法 |
|------|----------|----------|
| 正文内容 | 📊 销售数据如下 | 销售数据如下 |
| 空状态 | 🎉 暂无预警 | 暂无预警 + 引导按钮 |
| 按钮文字 | 📤 发送 | 发送 |
| 表格内容 | 任何 emoji | 纯文字 |

---

## 交互状态规范

每个 UI 功能必须定义以下 5 种状态：

### 1. 加载中

```tsx
// 页面级 - 骨架屏
<Skeleton className="h-[200px] w-full" />

// 按钮级 - Spinner
<Button disabled>
  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
  正在查询...
</Button>
```

### 2. 空状态

采用 **引导行动** 模式：

```tsx
<div className="text-center py-12">
  <p className="text-slate-500 mb-4">暂无预警</p>
  <Button variant="outline">查看经销商列表</Button>
</div>
```

### 3. 错误状态

```tsx
<Alert variant="destructive">
  <AlertTitle>查询失败</AlertTitle>
  <AlertDescription>
    无法连接到 BIP 系统，请稍后重试
    <Button variant="link" onClick={retry}>重试</Button>
  </AlertDescription>
</Alert>
```

### 4. 成功状态

```tsx
<Alert variant="success">
  <Check className="h-4 w-4" />
  <AlertTitle>操作成功</AlertTitle>
  <AlertDescription>拜访已安排，已同步到日程</AlertDescription>
</Alert>
```

### 5. 部分状态（降级）

```tsx
<Alert variant="warning">
  <AlertTitle>显示缓存数据</AlertTitle>
  <AlertDescription>
    BIP 系统响应缓慢，当前显示的是今早 6:00 的数据
  </AlertDescription>
</Alert>
```

---

## 企微卡片设计

### 卡片类型

| 类型 | 用途 | 按钮配置 |
|------|------|----------|
| 预警通知 | 异常检测结果 | 批准行动 / 查看详情 / 稍后处理 |
| 任务提醒 | 待办事项 | 开始处理 / 延期 / 完成 |
| 审批请求 | 需要决策的建议 | 批准 / 修改 / 拒绝 |
| 信息汇总 | 日报/周报 | 查看详情 / 分享 |

### 预警卡片模板

```json
{
  "card_type": "button_interaction",
  "source": {
    "desc": "AI-CRM 经销商运营助手"
  },
  "main_title": {
    "title": "⚠️ 发现异常：{经销商名}"
  },
  "sub_title_text": "{异常描述，如：销量连续2月下滑18%}",
  "horizontal_content_list": [
    { "keyname": "经销商", "value": "{名称}" },
    { "keyname": "区域", "value": "{区域}" },
    { "keyname": "严重度", "value": "{高/中/低}" }
  ],
  "button_list": [
    { "text": "批准拜访", "style": 1, "key": "approve_visit" },
    { "text": "查看详情", "style": 2, "key": "view_detail" },
    { "text": "稍后处理", "style": 2, "key": "defer" }
  ]
}
```

### 按钮样式

| style | 含义 | 用途 |
|-------|------|------|
| 1 | 主要按钮（蓝色） | 推荐操作 |
| 2 | 次要按钮（灰色） | 其他选项 |

---

## 响应式设计

### 断点

| 断点 | 宽度 | 设备 |
|------|------|------|
| sm | 640px | 手机横屏 |
| md | 768px | 平板竖屏 |
| lg | 1024px | 平板横屏 / 小屏笔记本 |
| xl | 1280px | 桌面 |

### 移动端适配

| 组件 | 桌面 | 移动端 |
|------|------|--------|
| 导航 | 侧边栏 | 底部导航栏 |
| 数据表格 | 完整表格 | 卡片列表 |
| 筛选器 | 内联 | 底部抽屉 |
| 详情页 | 双栏 | 单栏堆叠 |

### 移动端底部导航

```tsx
<nav className="fixed bottom-0 left-0 right-0 bg-white border-t md:hidden">
  <div className="flex justify-around py-2">
    <NavItem icon={<Home />} label="首页" />
    <NavItem icon={<AlertTriangle />} label="预警" />
    <NavItem icon={<CheckSquare />} label="任务" />
    <NavItem icon={<User />} label="我的" />
  </div>
</nav>
```

---

## 仪表盘布局

### 首屏结构

```
┌─────────────────────────────────────────────────────────┐
│  关键指标卡片（4 列，移动端 2 列）                        │
│  本月销售 | 同比增长 | 待处理预警 | 待办任务              │
├─────────────────────────────────────────────────────────┤
│  待处理预警 (左)           │  待办任务 (右)              │
│  ⚠️ 佛山张总 销量下滑      │  • 拜访深圳李总             │
│  ⚠️ 深圳李总 库存积压      │  • 回款跟进王总             │
│           [查看全部]        │        [查看全部]           │
└─────────────────────────────────────────────────────────┘
```

### 指标卡片

```tsx
<Card>
  <CardHeader className="pb-2">
    <CardDescription>本月销售</CardDescription>
  </CardHeader>
  <CardContent>
    <div className="text-2xl font-bold tabular-nums">¥1,280万</div>
    <p className="text-xs text-green-600 tabular-nums">
      +12% 同比
    </p>
  </CardContent>
</Card>
```

---

## 深色模式

MVP 阶段支持深色模式，使用 shadcn/ui 原生方案：

```tsx
// 在 layout.tsx 中
<html className="dark">
  {/* 或使用 next-themes 动态切换 */}
</html>
```

颜色映射：

| 元素 | 亮色 | 暗色 |
|------|------|------|
| 背景 | white | slate-950 |
| 卡片 | white | slate-900 |
| 文字 | slate-900 | slate-100 |
| 边框 | slate-200 | slate-800 |

---

## 推送通知控制

### 免打扰时段

- **默认:** 20:00 - 08:00
- **用户可自定义**

### 优先级规则

| 优先级 | 免打扰时段行为 | 工作时间行为 |
|--------|----------------|--------------|
| 高 | 即时推送 | 即时推送 |
| 中 | 次日 8:00 汇总 | 即时推送 |
| 低 | 汇总成日报 | 汇总成日报 |

---

## 文件命名约定

| 类型 | 命名 | 示例 |
|------|------|------|
| 组件 | PascalCase | `DealerCard.tsx` |
| 页面 | kebab-case | `dealer-detail/page.tsx` |
| 工具函数 | camelCase | `formatCurrency.ts` |
| 类型定义 | PascalCase | `Dealer.ts` |
| 常量 | SCREAMING_SNAKE | `ALERT_THRESHOLDS.ts` |

---

## 变更记录

| 日期 | 变更 | 来源 |
|------|------|------|
| 2026-03-23 | 初始版本 | /plan-design-review |
