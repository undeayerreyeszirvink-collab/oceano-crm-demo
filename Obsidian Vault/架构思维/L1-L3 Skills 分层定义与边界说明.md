# L1-L3 Skills 分层定义与边界说明

> 本文档从现有设计材料中抽取并细化 `L1 / L2 / L3 Skills` 的定义、边界、判定方法与示例，目标是形成一份可直接用于产品设计、能力抽取、架构评审和实施交付的独立规范。

> 参考来源：
>
> - [调用机制架构决策文档-V1.0.md](/Users/nigelli/projects/ontology+skills/调用机制架构决策文档-V1.0.md)
>
> 注：本文中的场景示例均采用“某企业”方式表达，避免绑定具体公司，便于在不同垂直行业中复用理解。

---

## 1. 文档目标

本文档回答 5 个问题：

1. `L1 / L2 / L3` 到底分别是什么
2. 三层之间的边界如何判定
3. 一个候选 skill 为什么应该归到这一层，而不是另一层
4. 如何从 SOP / 用户故事 / 业务流程中提炼出不同层级的 skill
5. 哪些设计是错误的，必须避免

---

## 2. 总体原则

### 2.1 三层不是按“复杂度”划分，而是按“复用边界”划分

最常见的误解是：

- L1 简单
- L2 中等
- L3 复杂

这个理解不准确。  
正确的划分方式是看三个维度：

1. 复用范围  
2. 对行业语义和企业语义的依赖程度  
3. 是否承载企业专属流程主权

因此：

- `L1` = 跨行业、跨企业复用的基础原子能力
- `L2` = 行业通用、跨企业可复用的业务能力模块
- `L3` = 绑定企业 ontology、岗位、审批链和 SOP 的专属流程能力

### 2.2 三层的关系不是平铺，而是叠加

推荐的理解方式：

- `L1` 提供“脑干和手脚”
- `L2` 提供“行业语义和判断”
- `L3` 提供“企业的做事方式”

运行时的典型关系是：

`L3 编排 L2，L2 调用 L1，Agent 平台再将它们装配到具体任务中。`

### 2.3 三层都不是 CLI

必须严格区分：

- Skill：为什么做、按什么规则做、顺序是什么
- CLI：真正对业务系统执行什么动作

也就是说：

- Skill 是业务能力表达
- CLI 是受控执行接口

---

## 3. L1 定义

### 3.1 定义

`L1 Skills` 是不带企业私有语义的基础原子能力。  
它们不表达行业专属流程，也不表达企业专属制度，而是为所有场景提供稳定、可复用的基础处理能力。

### 3.2 特征

- 跨行业复用
- 跨企业复用
- 输入输出边界清晰
- 粒度小
- 大多产出中间结果
- 通常不直接触发高风险系统动作

### 3.3 典型职责

- 意图识别
- 实体抽取
- 字段提取
- 摘要生成
- 缺失信息澄清
- 表单草稿生成
- 结构化输出
- 通用对话管理

### 3.4 典型示例

- `intent-detection`
- `invoice-field-extraction`
- `missing-info-clarification`
- `workflow-status-summary`
- `customer-profile-normalization`
- `batch-context-assembly`

### 3.5 不是 L1 的例子

- “判断报销是否符合公司制度”
- “判断经销商是否应该补货”
- “走某企业采购审批流程”

原因：这些都已经依赖行业或企业规则，不再是基础原子能力。

---

## 4. L2 定义

### 4.1 定义

`L2 Skills` 是带行业语义、但不绑定单一企业组织结构和制度的业务能力模块。  
L2 应该在同一行业的不同企业之间具备较高复用性。

### 4.2 特征

- 明显依赖行业对象模型和行业规则
- 通常做判断、评估、匹配、预检、推荐
- 可以依赖行业 ontology
- 不应强绑定某一家企业的审批链和组织结构
- 粒度通常是“模块级”而不是“完整流程级”

### 4.3 典型职责

- 规则预检
- 风险识别
- 评分和预测
- 领域分类
- 匹配与建议
- 行业 SLA / 合规 / 阈值判断

### 4.4 典型示例

制造 / 建材行业：

- `kiln-anomaly-detection`
- `supplier-routing-evaluation`
- `budget-compliance-check`
- `replenishment-recommendation`
- `contract-renewal-risk-evaluation`
- `glaze-body-compatibility-evaluation`

财务 / 采购行业：

- `expense-category-classification`
- `inventory-check`
- `supplier-match`
- `quote-comparison`

### 4.5 不是 L2 的例子

- “某企业采购 RFQ 协同流程”
- “某企业经销商补货审批流程”
- “某企业 CRM 续约与推荐流程”

原因：这些已经绑定企业自身制度、组织角色和审批链，属于 L3。

---

## 5. L3 定义

### 5.1 定义

`L3 Skills` 是绑定企业 ontology、岗位职责、制度规则、审批关系和例外处理逻辑的专属流程能力。  
L3 是企业沉淀业务资产的核心层，也是产品真正的护城河。

### 5.2 特征

- 强依赖企业 ontology
- 强依赖企业岗位、组织、审批链
- 通常表达一个完整业务闭环
- 常编排多个 L2 和 L1
- 常与 CLI Gateway 和 HITL 结合

### 5.3 典型职责

- 企业采购流程编排
- 企业研发试烧协同
- 企业经销商补货审批
- 企业 CRM 跟进与续约闭环
- 企业质量异常升级与复盘

### 5.4 典型示例

- `tenant-procurement-rfq-process`
- `tenant-rnd-trial-collaboration-process`
- `tenant-factory-anomaly-assist-process`
- `tenant-replenishment-approval-process`
- `tenant-crm-renewal-process`

### 5.5 不是 L3 的例子

- “提取采购表单字段”
- “检测窑炉参数异常”
- “根据历史销量生成补货建议”

原因：这些只是能力模块，不是企业专属流程。

---

## 6. 三层边界判定表

| 判定维度 | L1 | L2 | L3 |
|---|---|---|---|
| 复用范围 | 跨行业、跨企业 | 同行业跨企业 | 单企业 / 单租户 |
| 语义依赖 | 极低 | 行业语义 | 企业语义 |
| 典型粒度 | 原子能力 | 模块能力 | 流程能力 |
| 是否绑定企业岗位/组织 | 否 | 一般不绑定 | 强绑定 |
| 是否绑定审批链 | 否 | 最多输出建议 | 强绑定 |
| 是否依赖企业 ontology | 无或弱依赖 | 依赖行业 ontology | 强依赖企业 ontology |
| 是否常与 CLI 结合 | 很少 | 可少量结合 | 常结合 |
| 是否常带 HITL | 否 | 可提示 | 常有 interrupt / resume |
| 是否适合作为平台内建能力 | 是 | 部分是 | 否，通常按租户沉淀 |

---

## 7. 快速判定决策树

拿到一个候选 skill，按下面顺序判断：

### 第一步：脱离行业语义，这个能力还能成立吗？

- 能：优先判为 `L1`
- 不能：继续判断

### 第二步：换一家同行业公司，还能大体复用吗？

- 能：优先判为 `L2`
- 不能：继续判断

### 第三步：这个能力是否强依赖企业自己的 SOP、岗位、审批链、例外规则？

- 是：判为 `L3`

### 第四步：它是在做“单点能力”，还是在做“完整闭环流程”？

- 单点能力：偏 `L1 / L2`
- 完整流程：偏 `L3`

### 第五步：是否需要对高风险动作做审批、中断、恢复？

- 是：通常说明它至少位于 `L3`

---

## 8. 容易混淆的边界案例

### 8.1 案例：发票识别

- “从发票图片里识别字段” -> `L1`
- “判断发票是否符合报销规范” -> `L2`
- “按某企业报销制度发起报销流程并走审批” -> `L3`

### 8.2 案例：采购

- “从采购消息里抽取品类、数量、交期” -> `L1`
- “判断 RFQ 信息是否完整、预算是否超限” -> `L2`
- “按某企业采购流程路由给财务、法务、供应商并追踪闭环” -> `L3`

### 8.3 案例：工厂生产

- “整理批次上下文和传感器摘要” -> `L1`
- “检测窑炉参数异常并给出建议” -> `L2`
- “结合某企业操作规则、当班职责、回退机制执行异常辅助处理” -> `L3`

### 8.4 案例：经销商管理

- “标准化经销商上报的库存字段” -> `L1`
- “计算补货建议和异常报数风险” -> `L2`
- “按某企业区域管理制度形成预算建议并触发确认流程” -> `L3`

### 8.5 案例：CRM

- “汇总最近客户跟进记录” -> `L1`
- “计算续约风险和推荐优先级” -> `L2`
- “按企业客户经营规则创建续约任务并形成闭环” -> `L3`

---

## 9. 一个标准 L3 是怎么由 L1 和 L2 组成的

以“采购 RFQ 协同”为例：

### L1

- `purchase-intent-detection`
- `purchase-form-field-extraction`
- `missing-info-clarification`

### L2

- `rfq-completeness-precheck`
- `budget-compliance-check`
- `procurement-sla-monitor`

### L3

- `tenant-procurement-rfq-process`

### 运行关系

1. L1 负责理解采购需求并补齐输入
2. L2 负责检查这个需求是否达到可流转标准
3. L3 负责把这个需求放进某企业自己的采购协同流程
4. L3 在合适节点调用 CLI
5. 若触发预算、法务、经理审批，则进入 HITL

这就是三层的正确叠加方式。

---

## 10. 跨行业场景直观映射表

下面这张表的目标只有一个：让读者一眼看出，在一个真实业务场景里，`L1 / L2 / L3 / CLI / HITL` 各自放在哪里。

| 垂直行业 | 真实场景 | L1 在做什么 | L2 在做什么 | L3 在做什么 | CLI 连什么系统 | HITL 在哪里 |
|---|---|---|---|---|---|---|
| 建材制造 | 某企业采购专员发起原料 RFQ | 抽取品类、数量、交期、需求部门 | 检查 RFQ 完整性、预算规则、超时风险 | 按企业采购制度路由给财务、法务、供应商并追踪闭环 | ERP、预算系统、合同工作流、供应商门户 | 预算审批、法务确认、异常升级 |
| 建材制造 | 某企业工艺工程师处理窑炉异常 | 整理传感器摘要、批次上下文、异常说明 | 做异常检测、参数建议、传感器健康检查 | 按企业工厂规则组织“建议 -> 人工确认 -> 调整 -> 回退 -> 复盘” | MES、QMS、IoT、维护工单系统 | 操作工确认、工艺工程师审批、质量复核 |
| 美妆制造 | 某企业产品经理发起新品打样 | 提取需求、汇总原料信息、生成评审草稿 | 做成分合规、配方风险、打样周期评估 | 按企业研发制度发起打样评审、试产跟踪、结果闭环 | PLM、LIMS、研发排期系统 | 法规审核、研发经理确认 |
| 连锁零售 | 某企业区域经理做门店补货 | 统一销售与库存字段、汇总门店状态 | 做补货建议、异常报数识别、周转率评估 | 按企业区域补货审批规则生成建议并触发执行 | POS、WMS、补货系统、调拨系统 | 区域经理确认、仓配负责人审批 |
| SaaS / B2B 服务 | 某企业客户成功经理做续约跟进 | 汇总跟进记录、规范客户信息、生成任务草稿 | 评估续约风险、推荐产品、检查应收风险 | 按企业续约制度创建续约任务并形成闭环 | CRM、ERP 应收、营销自动化系统 | 销售确认、区域负责人审批报价 |

---

## 11. 四个完整场景的分层演示

这一节不讲抽象定义，只讲“看一个场景时应该怎么分层”。

### 11.1 建材制造：原料采购 RFQ 协同

场景：

某建材企业的采购专员收到生产需求，需要发起一批釉料原料 RFQ。

如何分层：

- `L1`
  - 识别采购意图
  - 抽取原料名称、数量、交期、需求部门
  - 发现字段缺失后向发起人追问
- `L2`
  - 判断 RFQ 是否完整
  - 判断预算是否超阈值
  - 判断供应商路由策略和 SLA 风险
- `L3`
  - 按该企业自己的采购制度决定先给谁审、卡在哪、超时谁负责
  - 组织需求确认、供应商报价、财务、法务、经理审批的完整流程
- `CLI`
  - 查询 ERP 需求单
  - 查询预算系统
  - 创建 RFQ
  - 创建合同审批流程
- `HITL`
  - 财务审批预算
  - 法务确认条款
  - 采购经理处理异常供应商

一句话理解：

`L1` 看懂采购请求，`L2` 判断这张采购单能不能流转，`L3` 让它按某企业的制度真正跑起来，`CLI` 再把动作落到 ERP 和合同系统。

### 11.2 建材制造：窑炉异常辅助处理

场景：

某建材企业的工艺工程师发现某条窑炉线出现温度波动，担心影响批次良率。

如何分层：

- `L1`
  - 汇总实时传感器摘要
  - 关联当前批次、产品规格、班次信息
- `L2`
  - 检测异常模式
  - 评估可能的质量影响
  - 生成参数调整建议
- `L3`
  - 按企业工艺制度控制“建议 -> 人工确认 -> 执行 -> 回退 -> 复盘”
  - 明确谁能确认、谁对结果负责
- `CLI`
  - 查询 MES 批次上下文
  - 查询 IoT 传感器数据
  - 创建调整申请
  - 创建回退或质量复核任务
- `HITL`
  - 操作工确认是否执行建议
  - 工艺工程师审批高风险调整
  - 质量主管复核异常批次

一句话理解：

`L2` 可以告诉你“可能怎么调”，但只有 `L3` 才知道在这家工厂里“谁能调、怎么调、调完谁复核”。

### 11.3 美妆制造：新品打样评审

场景：

某美妆企业的产品经理发起一款敏感肌面霜打样评审。

如何分层：

- `L1`
  - 读取需求简报
  - 提取功效、肤质、人群、禁限用关键词
- `L2`
  - 判断原料合规性
  - 评估配方风险
  - 估算打样周期和资源占用
- `L3`
  - 按企业新品开发 SOP 发起评审、打样、试产、结论沉淀
  - 明确法规、研发、品质各自的确认顺序
- `CLI`
  - 查询 PLM 配方库
  - 查询法规知识库
  - 创建打样任务和评审单
- `HITL`
  - 法规审核
  - 研发负责人确认
  - 品质确认试产结论

一句话理解：

`L1` 看懂产品需求，`L2` 判断配方和原料有没有风险，`L3` 让“某企业新品开发流程”按规矩推进。

### 11.4 SaaS / B2B 服务：客户续约闭环

场景：

某 B2B 服务企业的客户成功经理要处理下月即将到期的一批客户续约。

如何分层：

- `L1`
  - 汇总客户画像、最近沟通、合同到期时间
- `L2`
  - 评估续约风险
  - 推荐续约优先级和可能的增购方向
  - 检查应收与使用活跃度
- `L3`
  - 按企业续约流程自动建任务、排责任人、跟踪闭环
  - 决定何时升级给销售或负责人
- `CLI`
  - 查询 CRM
  - 查询 ERP 应收
  - 创建续约任务
  - 回写客户分层和结果
- `HITL`
  - 销售确认跟进策略
  - 管理者审批特殊报价

一句话理解：

`L2` 可以算出“这个客户有风险”，但只有 `L3` 才知道在某企业里，续约风险应该怎么分配给谁、怎么跟进、什么时候升级。

---

## 12. 从 SOP 提取三层 Skills 的方法

### 10.1 先抽 Ontology，不要先抽 Skill

正确顺序：

`文档 / SOP / 数据 -> Ontology -> Skill Candidate -> L1/L2/L3 判层 -> SKILL.md`

先从资料中抽取：

- 实体
- 角色
- 关系
- 状态
- 规则
- 事件
- 决策点

没有 ontology，skill 边界就会漂。

### 10.2 再把 SOP 拆成三类语句

#### 识别 / 抽取类

典型关键词：

- 识别
- 提取
- 解析
- 汇总
- 分类

通常对应 `L1`

#### 判断 / 评估类

典型关键词：

- 判断
- 校验
- 匹配
- 评估
- 预警
- 打分

通常对应 `L2`

#### 执行 / 流程类

典型关键词：

- 发起
- 路由
- 审批
- 提交
- 驳回
- 升级
- 复盘

通常对应 `L3`

### 10.3 以最小稳定复用单元来拆 Skill

一个 skill 应该满足：

- 输入边界清晰
- 输出边界清晰
- 职责单一
- 可独立测试
- 可复用

错误做法：

- 把整个部门流程打成一个“超级大 Skill”
- 把企业专属逻辑混进 L1 或 L2
- 把系统调用逻辑直接写进 L1

---

## 13. Skill Candidate 标准模板

每个候选 skill 建议统一补齐以下字段：

```yaml
name:
goal:
trigger:
inputs:
outputs:
steps:
decision_points:
ontology_dependencies:
skill_dependencies:
cli_dependencies:
human_in_the_loop:
candidate_level:
domain:
scope:
reuse_scope:
tenant_specific:
```

### 字段解释

- `candidate_level`：L1 / L2 / L3
- `scope`：atomic / module / workflow
- `reuse_scope`：cross-industry / cross-company-in-industry / tenant-only
- `tenant_specific`：是否企业专属

常见映射：

- `scope=atomic` -> 通常为 `L1`
- `scope=module` -> 通常为 `L2`
- `scope=workflow` -> 通常为 `L3`

---

## 14. 反模式与禁止事项

以下设计必须避免：

### 12.1 把整份 SOP 生成一个大 Skill

问题：

- 边界不清
- 无法复用
- 无法测试
- 依赖混乱

### 12.2 把企业私有规则放进 L1

问题：

- 一旦换企业，L1 就失效
- 基础层被污染
- 所有场景都会被企业特例绑死

### 12.3 把行业判断写成企业流程

问题：

- 本来可以复用的 L2 被错误沉到 L3
- 行业资产无法沉淀成通用能力包

### 12.4 让 L1 直接操作业务系统

问题：

- 越过编排和审批边界
- 审计和权限控制失效

### 12.5 没有 HITL 规则就设计自动闭环

问题：

- 高风险动作无人兜底
- 责任归属不清
- 生产、采购、财务场景会直接失控

---

## 15. 与 Agent 平台、Ontology、CLI 的关系

### 13.1 与 Ontology 的关系

- Ontology 提供业务世界模型
- Skill 使用 Ontology，而不替代 Ontology
- L3 尤其强依赖企业 ontology

### 13.2 与 Agent 平台的关系

- Agent 平台不等于 Skill
- Agent 平台负责把多个 skill 装配成一个执行图
- L1/L2/L3 是编排素材，不是平台本身

### 13.3 与 CLI 的关系

- CLI 是执行手段
- Skill 决定何时应该执行什么 CLI
- 高风险 CLI 必须由 L3 和 HITL 控制

---

## 16. 跨行业示例清单

### 16.1 建材制造：采购域

L1：

- `purchase-intent-detection`
- `purchase-form-field-extraction`
- `workflow-status-summary`

L2：

- `rfq-completeness-precheck`
- `budget-compliance-check`
- `procurement-sla-monitor`

L3：

- `tenant-procurement-rfq-process`

CLI：

- `erp.purchase-request.get`
- `budget.check`
- `procurement.rfq.create`
- `contract.workflow.create`

### 16.2 制造研发：试验 / 打样域

L1：

- `formula-change-detection`
- `trial-batch-data-extraction`

L2：

- `kiln-parameter-quality-check`
- `glaze-body-compatibility-evaluation`
- `trial-result-defect-classification`

L3：

- `tenant-rnd-trial-collaboration-process`

CLI：

- `plm.formula.version.get`
- `trial.task.create`
- `formula.review.create`

### 16.3 工厂制造：设备 / 工艺域

L1：

- `sensor-stream-anomaly-summary`
- `batch-context-assembly`

L2：

- `kiln-anomaly-detection`
- `parameter-adjustment-recommendation`
- `sensor-health-check`

L3：

- `tenant-factory-anomaly-assist-process`

CLI：

- `mes.batch.context.get`
- `iot.sensor.health.get`
- `factory.adjustment.request.create`
- `quality.review.task.create`

### 16.4 零售 / 渠道：补货经营域

L1：

- `dealer-data-normalization`
- `inventory-summary-generation`

L2：

- `dealer-stock-health-evaluation`
- `replenishment-recommendation`
- `abnormal-reporting-detection`

L3：

- `tenant-replenishment-approval-process`

CLI：

- `wms.stock.get`
- `replenishment.proposal.create`
- `inventory.anomaly.case.create`

### 16.5 SaaS / B2B 服务：CRM 域

L1：

- `customer-profile-normalization`
- `followup-record-summary`

L2：

- `contract-renewal-risk-evaluation`
- `product-recommendation-generation`
- `receivable-risk-check`

L3：

- `tenant-crm-renewal-process`

CLI：

- `crm.customer.profile.get`
- `erp.receivable.status.get`
- `crm.followup.task.create`
- `crm.segment.update`

---

## 17. 最终结论

可以把这份文档压缩成三句话：

1. `L1` 是基础原子能力，不带企业私有语义。
2. `L2` 是行业通用能力模块，带行业语义但不绑定单一企业。
3. `L3` 是企业专属流程能力，绑定企业 ontology、岗位和审批链。

如果后续一个候选 skill 无法清楚回答“它为什么属于这一层”，那就不要急着建 skill，先回到 ontology 和流程边界重新拆。

---

## 18. 建议下一步

建议基于本文档继续输出三份更细的实施文档：

1. `L1 Skills 平台内建能力清单.md`
2. `L2 行业能力包设计规范.md`
3. `L3 企业私有 Skills 提取与审核流程.md`

有了这三份，后续做场景设计、编排设计和 PoC 范围裁剪会更稳。
