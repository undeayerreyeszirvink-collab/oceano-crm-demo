const { useState, useEffect } = React;

// ===== 数据层 =====
const VIRTUAL_EMPLOYEES = [
    // 销售与增长
    { id: 1, role: '商机挖掘员', icon: '🔍', category: 'sales', desc: '自动识别潜在客户、商机评分、线索分配', price: 8500, complexity: 0.7, period: '10-12天' },
    { id: 2, role: '客户跟进员', icon: '📞', category: 'sales', desc: '自动跟进客户、记录沟通、提醒关键节点', price: 7200, complexity: 0.6, period: '8-10天' },
    { id: 3, role: '报价生成员', icon: '💰', category: 'sales', desc: '智能报价计算、成本分析、方案生成', price: 7800, complexity: 0.65, period: '9-11天' },

    // 供应链与运营
    { id: 4, role: '排单员', icon: '📋', category: 'supply', desc: '生产排程优化、产能平衡、交期预测', price: 9200, complexity: 0.8, period: '11-14天' },
    { id: 5, role: '采购员', icon: '🛒', category: 'supply', desc: '供应商比价、采购建议、库存预警', price: 8000, complexity: 0.7, period: '9-12天' },
    { id: 6, role: '库存优化员', icon: '📦', category: 'supply', desc: '库存分析、补货建议、呆滞预警', price: 7500, complexity: 0.65, period: '8-10天' },

    // 财务与风控
    { id: 7, role: '资金分析员', icon: '💵', category: 'finance', desc: '现金流分析、资金预测、风险预警', price: 9500, complexity: 0.8, period: '12-15天' },
    { id: 8, role: '对账员', icon: '🧾', category: 'finance', desc: '自动对账、差异识别、账单核对', price: 6800, complexity: 0.6, period: '8-10天' },
    { id: 9, role: '成本分析员', icon: '📊', category: 'finance', desc: '成本核算、利润分析、成本优化建议', price: 8500, complexity: 0.7, period: '10-12天' },

    // 生产与制造
    { id: 10, role: '生产计划员', icon: '🏭', category: 'production', desc: '生产计划制定、物料需求计算、进度追踪', price: 9000, complexity: 0.75, period: '11-13天' },
    { id: 11, role: '质量监察员', icon: '🔬', category: 'production', desc: '质量数据分析、异常识别、改进建议', price: 8200, complexity: 0.7, period: '9-11天' },

    // 市场与情报
    { id: 12, role: '市场情报分析员', icon: '📈', category: 'market', desc: '市场趋势分析、行业报告生成、机会识别', price: 8800, complexity: 0.75, period: '10-13天' },
    { id: 13, role: '竞品监控员', icon: '👁️', category: 'market', desc: '竞品动态追踪、价格监控、策略分析', price: 7500, complexity: 0.65, period: '8-10天' },
];

const CATEGORIES = [
    { id: 'all', name: '全部岗位', icon: '🎯' },
    { id: 'sales', name: '销售与增长', icon: '📈' },
    { id: 'supply', name: '供应链与运营', icon: '🔗' },
    { id: 'finance', name: '财务与风控', icon: '💰' },
    { id: 'production', name: '生产与制造', icon: '🏭' },
    { id: 'market', name: '市场与情报', icon: '🔍' },
];

const ENGINEERING_MODULES = [
    {
        id: 'interface',
        name: 'A类：接口与接入',
        icon: '🔌',
        atoms: [
            { id: 'wx_login', name: '微信登录接入', price: 1200, days: 1.5, complexity: 0.6, type: 'eng' },
            { id: 'wx_scan', name: '微信扫码触发', price: 800, days: 1, complexity: 0.5, type: 'eng' },
            { id: 'session_mgmt', name: '会话上下文管理', price: 1500, days: 2, complexity: 0.7, type: 'eng' },
            { id: 'webhook', name: 'Webhook回调处理', price: 1000, days: 1.5, complexity: 0.6, type: 'eng' },
        ]
    },
    {
        id: 'data',
        name: 'B类：数据结构',
        icon: '🗃️',
        atoms: [
            { id: 'json_schema', name: '需求字段定义（JSON Schema）', price: 600, days: 0.5, complexity: 0.4, type: 'data' },
            { id: 'form_design', name: '表单结构设计', price: 800, days: 1, complexity: 0.5, type: 'data' },
            { id: 'db_io', name: '数据入库/出库', price: 1000, days: 1.5, complexity: 0.6, type: 'data' },
            { id: 'data_validation', name: '数据校验规则', price: 700, days: 1, complexity: 0.5, type: 'data' },
        ]
    },
    {
        id: 'ai',
        name: 'C类：AI能力封装',
        icon: '🤖',
        atoms: [
            { id: 'prompt_template', name: 'Prompt模板设计', price: 1200, days: 1.5, complexity: 0.7, type: 'ai' },
            { id: 'dialog_fsm', name: '多轮对话状态机', price: 3000, days: 3, complexity: 0.9, type: 'ai' },
            { id: 'intent_recognition', name: '意图识别规则', price: 1500, days: 2, complexity: 0.8, type: 'ai' },
            { id: 'entity_extract', name: '实体提取', price: 1800, days: 2.5, complexity: 0.8, type: 'ai' },
            { id: 'context_understand', name: '上下文理解', price: 2000, days: 2.5, complexity: 0.85, type: 'ai' },
        ]
    },
    {
        id: 'business',
        name: 'D类：业务逻辑',
        icon: '⚙️',
        atoms: [
            { id: 'dispatch_rule', name: '分单规则配置', price: 1200, days: 1.5, complexity: 0.7, type: 'eng' },
            { id: 'state_flow', name: '状态流转逻辑', price: 1000, days: 1.5, complexity: 0.6, type: 'eng' },
            { id: 'exception_handle', name: '异常处理逻辑', price: 800, days: 1, complexity: 0.5, type: 'eng' },
            { id: 'business_rule', name: '业务规则引擎', price: 1500, days: 2, complexity: 0.75, type: 'eng' },
        ]
    },
    {
        id: 'interaction',
        name: 'E类：交互与触达',
        icon: '📱',
        atoms: [
            { id: 'msg_push', name: '消息推送', price: 1000, days: 1.5, complexity: 0.6, type: 'eng' },
            { id: 'feedback_collect', name: '用户反馈收集', price: 800, days: 1, complexity: 0.5, type: 'eng' },
            { id: 'h5_page', name: '页面展示（H5/小程序）', price: 2000, days: 2.5, complexity: 0.7, type: 'eng' },
            { id: 'notification', name: '通知提醒机制', price: 900, days: 1, complexity: 0.55, type: 'eng' },
        ]
    },
];

// ===== 主应用组件 =====
function App() {
    const [currentStep, setCurrentStep] = useState(0);
    const [selectedEmployee, setSelectedEmployee] = useState(null);
    const [userIdea, setUserIdea] = useState('');
    const [complexityScore, setComplexityScore] = useState(null);
    const [selectedModules, setSelectedModules] = useState([]);
    const [productionProgress, setProductionProgress] = useState(0);
    const [isAnalyzing, setIsAnalyzing] = useState(false);

    const steps = [
        { id: 0, name: 'AI人力市场', icon: '🏪' },
        { id: 1, name: '输入想法', icon: '💡' },
        { id: 2, name: '复杂度评估', icon: '📊' },
        { id: 3, name: '工程拆解', icon: '⚙️' },
        { id: 4, name: '生产看板', icon: '🏭' },
        { id: 5, name: '成果交付', icon: '✅' },
        { id: 6, name: '政府监管', icon: '👁️' },
    ];

    const goToStep = (step) => {
        setCurrentStep(step);
    };

    return (
        <div className="min-h-screen">
            {/* 顶部导航 */}
            <nav className="bg-slate-900/50 backdrop-blur-lg border-b border-indigo-500/30 sticky top-0 z-50">
                <div className="max-w-7xl mx-auto px-6 py-4">
                    <div className="flex items-center justify-between">
                        <div className="flex items-center gap-3">
                            <span className="text-2xl">⚡</span>
                            <div>
                                <h1 className="text-xl font-bold text-indigo-400">VirtuForge</h1>
                                <p className="text-xs text-slate-400">虚拟员工制造平台</p>
                            </div>
                        </div>
                        <div className="flex items-center gap-2">
                            {steps.map((step, idx) => (
                                <button
                                    key={step.id}
                                    onClick={() => goToStep(idx)}
                                    className={`px-3 py-1.5 rounded-lg text-sm transition-all ${
                                        currentStep === idx
                                            ? 'bg-indigo-600 text-white'
                                            : 'bg-slate-800/50 text-slate-400 hover:bg-slate-700/50'
                                    }`}
                                >
                                    <span className="mr-1">{step.icon}</span>
                                    <span className="hidden md:inline">{step.name}</span>
                                </button>
                            ))}
                        </div>
                    </div>
                </div>
            </nav>

            {/* 主内容区 */}
            <main className="max-w-7xl mx-auto px-6 py-8">
                {currentStep === 0 && (
                    <MarketplacePage
                        onSelectEmployee={(emp) => {
                            setSelectedEmployee(emp);
                            goToStep(1);
                        }}
                    />
                )}
                {currentStep === 1 && (
                    <IdeaInputPage
                        selectedEmployee={selectedEmployee}
                        userIdea={userIdea}
                        setUserIdea={setUserIdea}
                        isAnalyzing={isAnalyzing}
                        onNext={() => {
                            const trimmedIdea = userIdea.trim();
                            if (isAnalyzing || !selectedEmployee || trimmedIdea.length < 20) return;

                            const ideaRecord = {
                                id: `idea_${Date.now()}`,
                                createdAt: new Date().toISOString(),
                                employeeId: selectedEmployee.id,
                                employeeRole: selectedEmployee.role,
                                employeeCategory: selectedEmployee.category,
                                idea: trimmedIdea,
                                length: trimmedIdea.length,
                            };

                            try {
                                const history = JSON.parse(localStorage.getItem('virtuforge_idea_records') || '[]');
                                history.unshift(ideaRecord);
                                localStorage.setItem('virtuforge_idea_records', JSON.stringify(history.slice(0, 200)));
                                localStorage.setItem('virtuforge_latest_idea', JSON.stringify(ideaRecord));
                            } catch (e) {
                                console.error('保存输入想法记录失败:', e);
                            }

                            setIsAnalyzing(true);
                            setTimeout(() => {
                                setComplexityScore({
                                    overall: 72,
                                    business: 65,
                                    data: 45,
                                    integration: 70,
                                    ai_interaction: 80,
                                    exception: 75,
                                    baseDays: 8,
                                    complexityFactor: 2.3,
                                    riskBuffer: 0.3,
                                    minCost: 20000,
                                    maxCost: 60000,
                                    minDays: 14,
                                    maxDays: 28,
                                    level: '中高',
                                    supportLevel: 'B类试点项目',
                                });
                                setIsAnalyzing(false);
                                goToStep(2);
                            }, 2000);
                        }}
                    />
                )}
                {currentStep === 2 && (
                    <ComplexityPage
                        complexityScore={complexityScore}
                        selectedEmployee={selectedEmployee}
                        onNext={() => goToStep(3)}
                    />
                )}
                {currentStep === 3 && (
                    <EngineeringPage
                        selectedModules={selectedModules}
                        setSelectedModules={setSelectedModules}
                        onNext={() => {
                            setProductionProgress(0);
                            goToStep(4);
                        }}
                    />
                )}
                {currentStep === 4 && (
                    <ProductionPage
                        selectedModules={selectedModules}
                        progress={productionProgress}
                        setProgress={setProductionProgress}
                        onNext={() => goToStep(5)}
                    />
                )}
                {currentStep === 5 && (
                    <DeliveryPage
                        selectedEmployee={selectedEmployee}
                        onNext={() => goToStep(6)}
                    />
                )}
                {currentStep === 6 && (
                    <GovernmentPage
                        selectedEmployee={selectedEmployee}
                        selectedModules={selectedModules}
                        complexityScore={complexityScore}
                    />
                )}
            </main>
        </div>
    );
}

// ===== Step 0: AI人力市场 =====
function MarketplacePage({ onSelectEmployee }) {
    const [category, setCategory] = useState('all');

    const groupedByCategory = CATEGORIES.filter(c => c.id !== 'all').map(cat => ({
        ...cat,
        employees: VIRTUAL_EMPLOYEES.filter(e => e.category === cat.id),
    }));

    const filteredGroups = category === 'all'
        ? groupedByCategory
        : groupedByCategory.filter(g => g.id === category);

    return (
        <div className="fade-in">
            {/* 标题 */}
            <div className="text-center mb-10">
                <div className="inline-block px-3 py-1 bg-indigo-500/10 border border-indigo-500/30 rounded-full text-xs text-indigo-400 mb-4">
                    AI 人力资源市场
                </div>
                <h2 className="text-4xl font-bold mb-3">
                    <span className="bg-gradient-to-r from-indigo-400 to-purple-400 bg-clip-text text-transparent">
                        按职能定位虚拟员工
                    </span>
                </h2>
                <p className="text-slate-400 text-base">选择岗位，AI 自动评估复杂度、拆解工程、生成可交付的虚拟员工</p>
            </div>

            {/* 分类筛选 */}
            <div className="flex flex-wrap justify-center gap-2 mb-10">
                {CATEGORIES.map(cat => (
                    <button
                        key={cat.id}
                        onClick={() => setCategory(cat.id)}
                        className={`px-4 py-2 rounded-full text-sm font-medium transition-all ${
                            category === cat.id
                                ? 'bg-indigo-600 text-white shadow-lg shadow-indigo-500/20'
                                : 'bg-slate-800/50 text-slate-400 hover:bg-slate-700/50 hover:text-slate-200'
                        }`}
                    >
                        <span className="mr-1.5">{cat.icon}</span>
                        {cat.name}
                    </button>
                ))}
            </div>

            {/* 按分类分组展示 */}
            <div className="space-y-10">
                {filteredGroups.map(group => (
                    <div key={group.id}>
                        {/* 分类标题 */}
                        <div className="flex items-center gap-3 mb-4">
                            <span className="text-xl">{group.icon}</span>
                            <h3 className="text-lg font-semibold text-slate-200">{group.name}</h3>
                            <div className="flex-1 h-px bg-slate-700/50" />
                            <span className="text-xs text-slate-500">{group.employees.length} 个岗位</span>
                        </div>

                        {/* 员工卡片 */}
                        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
                            {group.employees.map(emp => (
                                <div
                                    key={emp.id}
                                    onClick={() => onSelectEmployee(emp)}
                                    className="bg-slate-800/30 border border-slate-700/40 rounded-xl p-5 hover:border-indigo-500/50 hover:bg-slate-800/60 transition-all cursor-pointer group"
                                >
                                    <div className="flex items-start justify-between mb-3">
                                        <span className="text-3xl">{emp.icon}</span>
                                        <span className="text-xs px-2 py-1 bg-slate-700/50 text-slate-400 rounded-full">
                                            {emp.period}
                                        </span>
                                    </div>
                                    <h4 className="text-base font-semibold text-slate-100 mb-1.5">{emp.role}</h4>
                                    <p className="text-sm text-slate-400 mb-4 leading-relaxed">{emp.desc}</p>

                                    <div className="flex items-center justify-between">
                                        <span className="text-lg font-bold text-indigo-400">¥{emp.price.toLocaleString()}</span>
                                        <div className="flex items-center gap-1">
                                            {[...Array(5)].map((_, i) => (
                                                <div
                                                    key={i}
                                                    className={`w-1.5 h-1.5 rounded-full ${
                                                        i < Math.round(emp.complexity * 5)
                                                            ? 'bg-indigo-500'
                                                            : 'bg-slate-700'
                                                    }`}
                                                />
                                            ))}
                                        </div>
                                    </div>

                                    <div className="mt-3 pt-3 border-t border-slate-700/40 flex items-center justify-between">
                                        <span className="text-xs text-slate-500">点击定制</span>
                                        <span className="text-xs text-indigo-400 opacity-0 group-hover:opacity-100 transition-opacity">
                                            开始制造 →
                                        </span>
                                    </div>
                                </div>
                            ))}
                        </div>
                    </div>
                ))}
            </div>
        </div>
    );
}

// ===== Step 1: 输入想法 =====
function IdeaInputPage({ selectedEmployee, userIdea, setUserIdea, onNext, isAnalyzing }) {
    const trimmedLen = userIdea.trim().length;
    const canSubmit = trimmedLen >= 20 && !isAnalyzing && !!selectedEmployee;

    const STRUCTURED_PROMPT = {
        goal: '你的业务目标是什么？（例如：提高转化率、缩短处理时长）',
        users: '谁在使用？服务对象是谁？（内部员工/客户/供应商）',
        channel: '通过什么渠道触达？（微信/企微/Web/API/电话）',
        systems: '需要对接哪些系统？（CRM/ERP/WMS/数据库）',
        process: '核心流程是什么？请写出 3-5 步',
        exceptions: '异常情况有哪些？（无效输入/重复提交/超时/权限不足）',
        output: '最终产出是什么？（报表/工单/消息提醒/API写回）',
        sla: '时效和规模要求？（响应时间/日处理量/并发）',
    };

    const templates = {
        '智能客服': '1) 业务目标：提升咨询转化率并降低人工客服压力\n2) 使用对象：公众号访客与售前客户\n3) 触达渠道：微信公众号\n4) 对接系统：CRM\n5) 核心流程：客户咨询→意图识别→知识库回复→高意向线索入CRM→销售跟进\n6) 异常处理：无法理解转人工、重复提问去重、超时提醒\n7) 输出结果：会话记录、线索标签、销售任务\n8) 时效规模：2秒内响应，日均2000次会话',
        '需求收集员': '1) 业务目标：标准化收集需求并减少信息缺失\n2) 使用对象：客户与设计顾问\n3) 触达渠道：企业微信\n4) 对接系统：CRM+数据库\n5) 核心流程：发起问询→采集面积预算风格→自动补问缺失项→生成结构化需求单→分配设计师\n6) 异常处理：预算冲突提醒、字段缺失重试、无效内容过滤\n7) 输出结果：需求单、客户画像、分配记录\n8) 时效规模：单次采集5分钟内完成，日处理300单',
        '订单处理员': '1) 业务目标：降低订单处理错误率并提升履约效率\n2) 使用对象：运营与仓储\n3) 触达渠道：后台任务+消息通知\n4) 对接系统：电商平台API+WMS+ERP\n5) 核心流程：拉取订单→库存校验→地址校验→生成发货单→状态回传\n6) 异常处理：缺货挂起、地址不全补录、重复订单拦截\n7) 输出结果：发货单、异常队列、状态日志\n8) 时效规模：5分钟内同步，日处理5000单',
        '数据分析师': '1) 业务目标：快速识别经营异常并支持决策\n2) 使用对象：管理层与业务负责人\n3) 触达渠道：BI看板+钉钉推送\n4) 对接系统：MySQL+ERP+CRM\n5) 核心流程：定时抽数→清洗聚合→指标计算→异常检测→自动推送\n6) 异常处理：数据缺失告警、口径冲突标记、延迟重跑\n7) 输出结果：日报、预警、专题分析\n8) 时效规模：T+0小时级更新，日分析百万级记录',
        '招聘助理': '1) 业务目标：缩短招聘周期并提升邀约到面率\n2) 使用对象：HR与候选人\n3) 触达渠道：邮件+短信+企微\n4) 对接系统：ATS/HR系统+日历\n5) 核心流程：简历筛选→候选人分层→自动邀约→面试排期→反馈回收\n6) 异常处理：改期冲突重排、联系方式无效补录、重复投递合并\n7) 输出结果：候选人状态、面试日程、漏斗报表\n8) 时效规模：24小时内首触达，周处理2000份简历',
    };

    const currentTemplate = templates[selectedEmployee?.role];

    return (
        <div className="fade-in max-w-4xl mx-auto">
            <div className="text-center mb-8">
                <div className="text-5xl mb-4">{selectedEmployee?.icon}</div>
                <h2 className="text-3xl font-bold mb-2">定制你的AI数字员工</h2>
                <p className="text-slate-400">用结构化方式描述需求，评估会更准确、拆解会更可执行</p>
            </div>

            <div className="bg-slate-800/30 border border-slate-700/50 rounded-xl p-8">
                <div className="mb-4 flex items-start justify-between gap-4">
                    <div>
                        <div className="text-sm text-slate-300 font-semibold">🧭 结构化需求输入</div>
                        <div className="text-xs text-slate-500 mt-1">建议按 1-8 项填写，便于复杂度评估和工程拆解</div>
                    </div>
                    {selectedEmployee?.role && (
                        <div className="text-xs px-2 py-1 rounded-full border border-indigo-500/30 bg-indigo-500/10 text-indigo-300">
                            当前岗位：{selectedEmployee.role}
                        </div>
                    )}
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-2 mb-4">
                    {Object.entries(STRUCTURED_PROMPT).map(([key, q], idx) => (
                        <div key={key} className="text-xs text-slate-400 bg-slate-900/30 border border-slate-700/40 rounded-lg px-3 py-2">
                            <span className="text-indigo-400 mr-1">{idx + 1}.</span>{q}
                        </div>
                    ))}
                </div>

                <label className="block text-sm text-slate-400 mb-3">
                    ✍️ 输入你的需求（可直接按 1-8 回答）
                </label>
                <textarea
                    value={userIdea}
                    onChange={(e) => setUserIdea(e.target.value)}
                    placeholder={`示例格式：\n1) 业务目标：\n2) 使用对象：\n3) 触达渠道：\n4) 对接系统：\n5) 核心流程：\n6) 异常处理：\n7) 输出结果：\n8) 时效规模：`}
                    className="w-full h-56 bg-slate-900/50 border border-slate-700 rounded-lg p-4 text-slate-100 placeholder-slate-500 focus:outline-none focus:border-indigo-500 resize-none"
                />

                {currentTemplate && (
                    <div className="mt-4 bg-indigo-500/5 border border-indigo-500/20 rounded-lg p-4">
                        <div className="flex items-start justify-between gap-3 mb-2">
                            <div className="text-xs text-indigo-400 font-medium">📋 岗位参考模板（结构化）</div>
                            <button
                                onClick={() => setUserIdea(currentTemplate)}
                                className="text-xs px-3 py-1 bg-indigo-600/20 hover:bg-indigo-600/30 text-indigo-300 rounded border border-indigo-500/30 transition-all"
                            >
                                一键填入
                            </button>
                        </div>
                        <div className="text-xs text-slate-400 leading-relaxed whitespace-pre-line">{currentTemplate}</div>
                    </div>
                )}

                <div className="mt-6 flex items-center justify-between">
                    <div className="text-sm text-slate-500">
                        <span className="text-indigo-400 font-semibold">{trimmedLen}</span> 有效字符（总计 {userIdea.length}）
                        {trimmedLen < 20 && <span className="ml-2 text-orange-400">（至少 20 个有效字符）</span>}
                        {!selectedEmployee && <span className="ml-2 text-red-400">（请先在市场选择岗位）</span>}
                    </div>
                    <button
                        onClick={onNext}
                        disabled={!canSubmit}
                        className="px-6 py-3 bg-indigo-600 hover:bg-indigo-700 disabled:bg-slate-700 disabled:text-slate-500 text-white rounded-lg font-semibold transition-all flex items-center gap-2"
                    >
                        {isAnalyzing ? (
                            <><span className="pulse-anim">⚙️</span> AI 分析中...</>
                        ) : '开始AI评估 →'}
                    </button>
                </div>
            </div>
        </div>
    );
}

// ===== Step 2: 复杂度评估 =====
function ComplexityPage({ complexityScore, selectedEmployee, onNext }) {
    // 空值保护：如果没有评估数据，显示提示
    if (!complexityScore) {
        return (
            <div className="fade-in max-w-2xl mx-auto text-center py-20">
                <div className="text-6xl mb-6">📊</div>
                <h2 className="text-2xl font-bold mb-4">尚未完成复杂度评估</h2>
                <p className="text-slate-400 mb-8">请先在「输入想法」页面选择虚拟员工并完成 AI 评估</p>
                <button
                    onClick={() => window.location.hash = '#step-1'}
                    className="px-6 py-3 bg-indigo-600 hover:bg-indigo-700 text-white rounded-lg font-semibold transition-all"
                >
                    返回输入想法 →
                </button>
            </div>
        );
    }

    const dims = [
        { key: 'business', label: '业务复杂度', desc: '存在多轮对话与分支判断', color: 'from-blue-500 to-indigo-500' },
        { key: 'data', label: '数据复杂度', desc: '字段相对清晰，但需结构化', color: 'from-cyan-500 to-blue-500' },
        { key: 'integration', label: '集成复杂度', desc: '涉及微信接入与消息回调', color: 'from-violet-500 to-purple-500' },
        { key: 'ai_interaction', label: 'AI交互复杂度', desc: '用户表达非标准，需多轮澄清', color: 'from-purple-500 to-pink-500' },
        { key: 'exception', label: '异常处理复杂度', desc: '需处理模糊需求、重复输入', color: 'from-orange-500 to-red-500' },
    ];

    const risks = {
        high: [
            '用户自然语言表达不稳定',
            '微信接口权限与消息触达限制',
            '分单规则需要业务方反复确认',
        ],
        mid: [
            '需求字段定义不完整',
            '接单流程未标准化',
        ],
        low: [
            '基础对话采集能力',
            '数据存储与导出',
        ],
    };

    const milestones = [
        { id: 'M0', name: '需求澄清与原型验证', items: ['输出需求字段表', '输出对话流程图', '确认接入方式'] },
        { id: 'M1', name: '最小虚拟员工上线', items: ['完成对话采集', '完成信息结构化', '完成后台查看'] },
        { id: 'M2', name: '业务闭环', items: ['完成分配规则', '完成状态流转', '完成通知机制'] },
        { id: 'M3', name: '试运行与优化', items: ['收集真实对话', '优化异常处理', '固化行业模板'] },
    ];

    return (
        <div className="fade-in max-w-5xl mx-auto">
            <div className="text-center mb-8">
                <h2 className="text-3xl font-bold mb-2">复杂度评估报告</h2>
                <p className="text-slate-400">AI 已完成需求分析 · {selectedEmployee?.role}</p>
            </div>

            {/* 综合评分卡 */}
            <div className="bg-gradient-to-br from-indigo-900/40 to-purple-900/40 border border-indigo-500/30 rounded-xl p-6 mb-6 grid grid-cols-2 md:grid-cols-5 gap-4 items-center">
                <div className="text-center md:col-span-1">
                    <div className="text-xs text-slate-400 mb-1">综合复杂度</div>
                    <div className="text-6xl font-black text-indigo-300">{complexityScore.overall}</div>
                    <div className="text-xs text-slate-500 mt-1">满分 100</div>
                </div>
                <div className="md:col-span-4 grid grid-cols-2 md:grid-cols-4 gap-3">
                    <InfoChip label="复杂度等级" value={complexityScore.level} color="text-yellow-400" />
                    <InfoChip label="扶持建议" value={complexityScore.supportLevel} color="text-green-400" />
                    <InfoChip label="成本区间" value={`¥${(complexityScore.minCost/10000).toFixed(0)}万 - ¥${(complexityScore.maxCost/10000).toFixed(0)}万`} color="text-indigo-400" />
                    <InfoChip label="预计周期" value={`${complexityScore.minDays} - ${complexityScore.maxDays} 天`} color="text-purple-400" />
                </div>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-6">
                {/* 五维评分 */}
                <div className="bg-slate-800/30 border border-slate-700/50 rounded-xl p-6">
                    <h3 className="text-base font-semibold mb-4">五维复杂度评分</h3>
                    <div className="space-y-4">
                        {dims.map(d => (
                            <div key={d.key}>
                                <div className="flex justify-between text-sm mb-1">
                                    <span className="text-slate-300">{d.label}</span>
                                    <span className="font-bold text-slate-200">{complexityScore[d.key]}</span>
                                </div>
                                <div className="h-2 bg-slate-700/50 rounded-full overflow-hidden mb-1">
                                    <div
                                        className={`h-full bg-gradient-to-r ${d.color} transition-all duration-1000`}
                                        style={{ width: `${complexityScore[d.key]}%` }}
                                    />
                                </div>
                                <div className="text-xs text-slate-500">{d.desc}</div>
                            </div>
                        ))}
                    </div>
                </div>

                {/* 成本估算 */}
                <div className="bg-slate-800/30 border border-slate-700/50 rounded-xl p-6">
                    <h3 className="text-base font-semibold mb-4">成本估算区间</h3>
                    <div className="bg-slate-900/50 rounded-lg p-4 mb-4 font-mono text-sm space-y-2">
                        <div className="flex justify-between text-slate-400">
                            <span>基础工作量</span><span className="text-slate-200">{complexityScore.baseDays} 人天</span>
                        </div>
                        <div className="flex justify-between text-slate-400">
                            <span>复杂度系数</span><span className="text-slate-200">× {complexityScore.complexityFactor}</span>
                        </div>
                        <div className="flex justify-between text-slate-400">
                            <span>风险缓冲</span><span className="text-slate-200">+ {complexityScore.riskBuffer * 100}%</span>
                        </div>
                        <div className="border-t border-slate-700 pt-2 flex justify-between text-slate-300">
                            <span>预计工作量</span><span>{complexityScore.minDays} - {complexityScore.maxDays} 人天</span>
                        </div>
                    </div>
                    <div className="text-center bg-indigo-500/10 border border-indigo-500/20 rounded-lg p-4">
                        <div className="text-xs text-slate-400 mb-1">成本区间（不含税）</div>
                        <div className="text-2xl font-bold text-indigo-300">
                            ¥{complexityScore.minCost.toLocaleString()} — ¥{complexityScore.maxCost.toLocaleString()}
                        </div>
                        <div className="text-xs text-slate-500 mt-1">不提供固定报价，仅提供区间参考</div>
                    </div>
                </div>
            </div>

            {/* 风险识别 */}
            <div className="bg-slate-800/30 border border-slate-700/50 rounded-xl p-6 mb-6">
                <h3 className="text-base font-semibold mb-4">⚠️ 风险识别</h3>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                    <RiskBlock level="高风险" color="red" items={risks.high} />
                    <RiskBlock level="中风险" color="yellow" items={risks.mid} />
                    <RiskBlock level="低风险" color="green" items={risks.low} />
                </div>
            </div>

            {/* 实施路径 */}
            <div className="bg-slate-800/30 border border-slate-700/50 rounded-xl p-6 mb-6">
                <h3 className="text-base font-semibold mb-4">🗺️ 推荐实施路径</h3>
                <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
                    {milestones.map((m, idx) => (
                        <div key={m.id} className="relative">
                            {idx < milestones.length - 1 && (
                                <div className="hidden md:block absolute top-5 left-full w-full h-px bg-indigo-500/30 z-0" />
                            )}
                            <div className="bg-slate-900/50 border border-slate-700/50 rounded-lg p-4 relative z-10">
                                <div className="flex items-center gap-2 mb-2">
                                    <span className="text-xs font-bold px-2 py-0.5 bg-indigo-500/20 text-indigo-400 rounded-full">{m.id}</span>
                                </div>
                                <div className="text-sm font-medium text-slate-200 mb-2">{m.name}</div>
                                <ul className="space-y-1">
                                    {m.items.map((item, i) => (
                                        <li key={i} className="text-xs text-slate-500 flex items-start gap-1">
                                            <span className="text-indigo-500 mt-0.5">·</span>{item}
                                        </li>
                                    ))}
                                </ul>
                            </div>
                        </div>
                    ))}
                </div>
            </div>

            <div className="text-center">
                <button
                    onClick={onNext}
                    className="px-8 py-3 bg-indigo-600 hover:bg-indigo-700 text-white rounded-lg font-semibold transition-all"
                >
                    确认评估，进入工程拆解 →
                </button>
            </div>
        </div>
    );
}

function InfoChip({ label, value, color }) {
    return (
        <div className="bg-slate-900/40 rounded-lg p-3 text-center">
            <div className="text-xs text-slate-500 mb-1">{label}</div>
            <div className={`text-sm font-bold ${color}`}>{value}</div>
        </div>
    );
}

function RiskBlock({ level, color, items }) {
    const colors = {
        red: 'border-red-500/30 bg-red-500/5 text-red-400',
        yellow: 'border-yellow-500/30 bg-yellow-500/5 text-yellow-400',
        green: 'border-green-500/30 bg-green-500/5 text-green-400',
    };
    const dotColors = { red: 'bg-red-500', yellow: 'bg-yellow-500', green: 'bg-green-500' };
    return (
        <div className={`border rounded-lg p-4 ${colors[color]}`}>
            <div className="flex items-center gap-2 mb-3 font-semibold text-sm">
                <span className={`w-2 h-2 rounded-full ${dotColors[color]}`} />
                {level}
            </div>
            <ul className="space-y-2">
                {items.map((item, i) => (
                    <li key={i} className="text-xs text-slate-400 flex items-start gap-1.5">
                        <span className="mt-0.5 shrink-0">—</span>{item}
                    </li>
                ))}
            </ul>
        </div>
    );
}

// ===== Step 3: 工程拆解 =====
function EngineeringPage({ selectedModules, setSelectedModules, onNext }) {
    const allAtoms = ENGINEERING_MODULES.flatMap(m => m.atoms);

    useEffect(() => {
        if (selectedModules.length === 0) {
            setSelectedModules(allAtoms.map(a => a.id));
        }
    }, []);

    const toggleModule = (atomId) => {
        setSelectedModules(prev =>
            prev.includes(atomId)
                ? prev.filter(id => id !== atomId)
                : [...prev, atomId]
        );
    };

    const selectedAtoms = allAtoms.filter(a => selectedModules.includes(a.id));
    const totalPrice = selectedAtoms.reduce((sum, a) => sum + a.price, 0);
    const totalDays = selectedAtoms.reduce((sum, a) => sum + a.days, 0);

    const typeColors = {
        eng: 'bg-blue-500/20 text-blue-400',
        ai: 'bg-purple-500/20 text-purple-400',
        data: 'bg-cyan-500/20 text-cyan-400',
    };
    const typeLabels = { eng: '工程', ai: 'AI', data: '数据' };

    return (
        <div className="fade-in">
            <div className="flex items-center justify-between mb-6">
                <div>
                    <h2 className="text-2xl font-bold">工程任务拆解</h2>
                    <p className="text-slate-400 text-sm mt-1">按 ABCDE 五大类标准化原子能力，勾选即计价</p>
                </div>
                <div className="flex gap-2">
                    <button onClick={() => setSelectedModules(allAtoms.map(a => a.id))}
                        className="px-3 py-1.5 text-xs bg-slate-700/50 hover:bg-slate-600/50 text-slate-300 rounded-lg transition-all">全选</button>
                    <button onClick={() => setSelectedModules([])}
                        className="px-3 py-1.5 text-xs bg-slate-700/50 hover:bg-slate-600/50 text-slate-300 rounded-lg transition-all">清空</button>
                </div>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                <div className="lg:col-span-2 space-y-4">
                    {ENGINEERING_MODULES.map(module => {
                        const moduleSelected = module.atoms.filter(a => selectedModules.includes(a.id));
                        const modulePrice = moduleSelected.reduce((sum, a) => sum + a.price, 0);
                        const moduleDays = moduleSelected.reduce((sum, a) => sum + a.days, 0);

                        return (
                            <div key={module.id} className="bg-slate-800/30 border border-slate-700/50 rounded-xl p-5">
                                <div className="flex items-center justify-between mb-4">
                                    <div className="flex items-center gap-3">
                                        <span className="text-xl">{module.icon}</span>
                                        <div>
                                            <h3 className="text-base font-semibold text-slate-100">{module.name}</h3>
                                            <p className="text-xs text-slate-500 mt-0.5">
                                                已选 {moduleSelected.length}/{module.atoms.length} 项 · {moduleDays.toFixed(1)} 天
                                            </p>
                                        </div>
                                    </div>
                                    <div className="text-right">
                                        <div className="text-lg font-bold text-indigo-400">¥{modulePrice.toLocaleString()}</div>
                                    </div>
                                </div>

                                <div className="space-y-2">
                                    {module.atoms.map(atom => (
                                        <label
                                            key={atom.id}
                                            className={`flex items-center justify-between p-3 rounded-lg border cursor-pointer transition-all ${
                                                selectedModules.includes(atom.id)
                                                    ? 'bg-indigo-500/10 border-indigo-500/30'
                                                    : 'bg-slate-900/30 border-slate-700/30 hover:border-slate-600/50'
                                            }`}
                                        >
                                            <div className="flex items-center gap-3">
                                                <input
                                                    type="checkbox"
                                                    checked={selectedModules.includes(atom.id)}
                                                    onChange={() => toggleModule(atom.id)}
                                                    className="w-4 h-4 accent-indigo-500 shrink-0"
                                                />
                                                <div>
                                                    <div className="text-sm font-medium text-slate-200">{atom.name}</div>
                                                    <div className="flex items-center gap-2 mt-0.5">
                                                        <span className={`text-xs px-1.5 py-0.5 rounded ${typeColors[atom.type]}`}>
                                                            {typeLabels[atom.type]}
                                                        </span>
                                                        <span className="text-xs text-slate-500">复杂度 {(atom.complexity * 100).toFixed(0)}%</span>
                                                        <span className="text-xs text-slate-500">{atom.days}天</span>
                                                    </div>
                                                </div>
                                            </div>
                                            <div className="text-sm font-semibold text-indigo-400 shrink-0 ml-2">
                                                ¥{atom.price.toLocaleString()}
                                            </div>
                                        </label>
                                    ))}
                                </div>
                            </div>
                        );
                    })}
                </div>

                <div className="space-y-4">
                    <div className="bg-gradient-to-br from-indigo-900/30 to-purple-900/30 border border-indigo-500/30 rounded-xl p-6 sticky top-24">
                        <h3 className="text-base font-semibold mb-4">方案汇总</h3>
                        <div className="space-y-3 mb-5">
                            <div className="flex justify-between items-center">
                                <span className="text-slate-400 text-sm">已选任务</span>
                                <span className="text-xl font-bold text-indigo-400">{selectedModules.length} 项</span>
                            </div>
                            <div className="flex justify-between items-center">
                                <span className="text-slate-400 text-sm">总工期</span>
                                <span className="text-xl font-bold text-indigo-400">{Math.ceil(totalDays / 2)} 天</span>
                            </div>
                            <div className="flex justify-between items-center">
                                <span className="text-slate-400 text-sm">总成本</span>
                                <span className="text-xl font-bold text-indigo-400">¥{totalPrice.toLocaleString()}</span>
                            </div>
                        </div>

                        <div className="border-t border-slate-700/50 pt-4 mb-5">
                            <div className="text-xs text-slate-500 mb-2">按类型分布</div>
                            {['eng', 'ai', 'data'].map(type => {
                                const typeAtoms = selectedAtoms.filter(a => a.type === type);
                                const typePrice = typeAtoms.reduce((s, a) => s + a.price, 0);
                                return typePrice > 0 ? (
                                    <div key={type} className="flex justify-between text-xs mb-1.5">
                                        <span className={`px-1.5 py-0.5 rounded ${typeColors[type]}`}>{typeLabels[type]}</span>
                                        <span className="text-slate-400">¥{typePrice.toLocaleString()}</span>
                                    </div>
                                ) : null;
                            })}
                        </div>

                        <div className="bg-green-500/10 border border-green-500/20 rounded-lg p-3 mb-5">
                            <div className="text-xs text-slate-400 mb-1">政府补贴建议（30%）</div>
                            <div className="text-xl font-bold text-green-400">¥{Math.round(totalPrice * 0.3).toLocaleString()}</div>
                        </div>

                        <button
                            onClick={onNext}
                            className="w-full py-3 bg-indigo-600 hover:bg-indigo-700 text-white rounded-lg font-semibold transition-all"
                        >
                            进入生产看板 →
                        </button>
                    </div>
                </div>
            </div>
        </div>
    );
}

// ===== Step 4: 生产看板 =====
function ProductionPage({ selectedModules, progress, setProgress, onNext }) {
    useEffect(() => {
        const timer = setInterval(() => {
            setProgress(prev => {
                if (prev >= 100) {
                    clearInterval(timer);
                    return 100;
                }
                return prev + 10;
            });
        }, 800);

        return () => clearInterval(timer);
    }, []);

    const tasks = ENGINEERING_MODULES
        .flatMap(m => m.atoms)
        .filter(a => selectedModules.includes(a.id));

    const doneTasks = tasks.filter((_, idx) => idx < Math.floor(tasks.length * progress / 100));
    const activeTasks = tasks.filter((_, idx) => idx >= doneTasks.length && idx < doneTasks.length + 2);

    return (
        <div className="fade-in">
            <div className="text-center mb-8">
                <h2 className="text-3xl font-bold mb-2">AI + 工程师协同生产</h2>
                <p className="text-slate-400">虚拟员工正在制造流水线上生产中</p>
            </div>

            <div className="grid grid-cols-4 gap-4 mb-8">
                <KPI icon="📦" label="总任务" value={tasks.length} />
                <KPI icon="✅" label="已完成" value={doneTasks.length} color="text-green-400" />
                <KPI icon="⚡" label="进行中" value={activeTasks.length} color="text-yellow-400" />
                <KPI icon="📊" label="总体进度" value={`${progress}%`} color="text-indigo-400" />
            </div>

            <div className="bg-slate-800/30 border border-slate-700/50 rounded-xl p-6 mb-6">
                <div className="flex items-center justify-between mb-3">
                    <span className="text-sm text-slate-400">生产进度</span>
                    <span className="text-lg font-bold text-indigo-400">{progress}%</span>
                </div>
                <div className="h-4 bg-slate-700/50 rounded-full overflow-hidden">
                    <div
                        className="h-full bg-gradient-to-r from-indigo-500 to-purple-500 transition-all duration-700"
                        style={{ width: `${progress}%` }}
                    />
                </div>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
                {tasks.map((task, idx) => {
                    const isDone = idx < doneTasks.length;
                    const isActive = idx >= doneTasks.length && idx < doneTasks.length + 2;

                    return (
                        <div
                            key={task.id}
                            className={`p-4 rounded-lg border transition-all ${
                                isDone
                                    ? 'bg-green-500/10 border-green-500/30'
                                    : isActive
                                    ? 'bg-yellow-500/10 border-yellow-500/30'
                                    : 'bg-slate-800/20 border-slate-700/30'
                            }`}
                        >
                            <div className="flex items-center justify-between">
                                <div>
                                    <div className="font-medium text-slate-200">{task.name}</div>
                                    <div className="text-sm text-slate-500 mt-1">{task.days}天 · ¥{task.price}</div>
                                </div>
                                <div>
                                    {isDone && <span className="text-green-400">✅</span>}
                                    {isActive && <span className="text-yellow-400 pulse-anim">⚡</span>}
                                    {!isDone && !isActive && <span className="text-slate-600">⏳</span>}
                                </div>
                            </div>
                        </div>
                    );
                })}
            </div>

            {progress >= 100 && (
                <div className="text-center mt-8 slide-in">
                    <button
                        onClick={onNext}
                        className="px-8 py-3 bg-green-600 hover:bg-green-700 text-white rounded-lg font-semibold transition-all"
                    >
                        生产完成，查看成果 →
                    </button>
                </div>
            )}
        </div>
    );
}

function KPI({ icon, label, value, color = 'text-slate-100' }) {
    return (
        <div className="bg-slate-800/30 border border-slate-700/50 rounded-xl p-4 text-center">
            <div className="text-2xl mb-1">{icon}</div>
            <div className={`text-2xl font-bold ${color}`}>{value}</div>
            <div className="text-sm text-slate-500 mt-1">{label}</div>
        </div>
    );
}

// ===== Step 5: 成果交付 =====
function DeliveryPage({ selectedEmployee, onNext }) {
    return (
        <div className="fade-in max-w-4xl mx-auto">
            <div className="text-center mb-8">
                <div className="text-7xl mb-4">🎉</div>
                <h2 className="text-3xl font-bold mb-2">虚拟员工交付完成</h2>
                <p className="text-slate-400">{selectedEmployee?.role} 已可投入使用</p>
            </div>

            <div className="bg-gradient-to-br from-green-900/20 to-emerald-900/20 border border-green-500/30 rounded-xl p-8 mb-6">
                <div className="grid grid-cols-3 gap-6">
                    <div className="text-center">
                        <div className="text-3xl mb-2">✅</div>
                        <div className="text-lg font-semibold text-green-400">功能验收通过</div>
                    </div>
                    <div className="text-center">
                        <div className="text-3xl mb-2">🚀</div>
                        <div className="text-lg font-semibold text-green-400">部署上线完成</div>
                    </div>
                    <div className="text-center">
                        <div className="text-3xl mb-2">📚</div>
                        <div className="text-lg font-semibold text-green-400">文档交付完整</div>
                    </div>
                </div>
            </div>

            <div className="bg-slate-800/30 border border-slate-700/50 rounded-xl p-6 mb-6">
                <h3 className="text-lg font-semibold mb-4">交付清单</h3>
                <div className="space-y-3">
                    <DeliveryItem icon="🤖" title="虚拟员工实例" desc="可运行的AI员工系统" />
                    <DeliveryItem icon="🔧" title="管理后台" desc="配置和监控界面" />
                    <DeliveryItem icon="📖" title="操作手册" desc="使用说明和维护文档" />
                    <DeliveryItem icon="🎓" title="培训服务" desc="2小时上手培训" />
                </div>
            </div>

            <div className="text-center">
                <button
                    onClick={onNext}
                    className="px-8 py-3 bg-indigo-600 hover:bg-indigo-700 text-white rounded-lg font-semibold transition-all"
                >
                    查看政府监管视角 →
                </button>
            </div>
        </div>
    );
}

function DeliveryItem({ icon, title, desc }) {
    return (
        <div className="flex items-center gap-3 p-3 bg-slate-900/30 rounded-lg">
            <span className="text-2xl">{icon}</span>
            <div>
                <div className="font-medium text-slate-200">{title}</div>
                <div className="text-sm text-slate-500">{desc}</div>
            </div>
        </div>
    );
}

// ===== Step 6: 政府监管 =====
function GovernmentPage({ selectedEmployee, selectedModules, complexityScore }) {
    const allAtoms = ENGINEERING_MODULES.flatMap(m => m.atoms);
    const selectedAtoms = allAtoms.filter(a => selectedModules.includes(a.id));
    const totalCost = selectedAtoms.reduce((sum, a) => sum + a.price, 0);
    const subsidy = Math.round(totalCost * 0.3);

    return (
        <div className="fade-in max-w-5xl mx-auto">
            <div className="text-center mb-8">
                <h2 className="text-3xl font-bold mb-2">政府监管视角</h2>
                <p className="text-slate-400">每笔补贴对应能力、进度和成果全程可追溯</p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-6">
                <GovCard label="项目总成本" value={`¥${totalCost.toLocaleString()}`} icon="💰" />
                <GovCard label="申请补贴" value={`¥${subsidy.toLocaleString()}`} icon="🏛️" color="text-green-400" />
                <GovCard label="复杂度评分" value={`${(complexityScore?.overall * 100).toFixed(0)}分`} icon="📊" />
                <GovCard label="交付状态" value="已完成" icon="✅" color="text-green-400" />
            </div>

            <div className="bg-slate-800/30 border border-slate-700/50 rounded-xl p-6 mb-6">
                <h3 className="text-lg font-semibold mb-4">补贴能力明细（可审计）</h3>
                <div className="overflow-x-auto">
                    <table className="w-full">
                        <thead>
                            <tr className="border-b border-slate-700/50">
                                <th className="text-left py-3 px-2 text-sm text-slate-400">能力模块</th>
                                <th className="text-left py-3 px-2 text-sm text-slate-400">原子能力</th>
                                <th className="text-right py-3 px-2 text-sm text-slate-400">成本</th>
                                <th className="text-center py-3 px-2 text-sm text-slate-400">状态</th>
                                <th className="text-right py-3 px-2 text-sm text-slate-400">补贴占比</th>
                            </tr>
                        </thead>
                        <tbody>
                            {ENGINEERING_MODULES.map(module =>
                                module.atoms
                                    .filter(atom => selectedModules.includes(atom.id))
                                    .map((atom, idx) => (
                                        <tr key={atom.id} className="border-b border-slate-800/50">
                                            <td className="py-3 px-2 text-sm text-slate-300">
                                                {idx === 0 && (
                                                    <span>
                                                        {module.icon} {module.name}
                                                    </span>
                                                )}
                                            </td>
                                            <td className="py-3 px-2 text-sm text-slate-200">{atom.name}</td>
                                            <td className="py-3 px-2 text-sm text-right text-indigo-400">¥{atom.price.toLocaleString()}</td>
                                            <td className="py-3 px-2 text-center">
                                                <span className="px-2 py-1 bg-green-500/20 text-green-400 rounded text-xs">已交付</span>
                                            </td>
                                            <td className="py-3 px-2 text-sm text-right text-green-400">
                                                ¥{Math.round(atom.price * 0.3).toLocaleString()}
                                            </td>
                                        </tr>
                                    ))
                            )}
                        </tbody>
                    </table>
                </div>
            </div>

            <div className="grid grid-cols-2 gap-4">
                <div className="bg-slate-800/30 border border-slate-700/50 rounded-xl p-5">
                    <h4 className="font-semibold mb-3">监管价值</h4>
                    <ul className="space-y-2 text-sm text-slate-400">
                        <li>✓ 补贴资金去向透明</li>
                        <li>✓ 能力产出可量化</li>
                        <li>✓ 项目进度可追踪</li>
                        <li>✓ 成果交付可验证</li>
                    </ul>
                </div>
                <div className="bg-slate-800/30 border border-slate-700/50 rounded-xl p-5">
                    <h4 className="font-semibold mb-3">决策支持</h4>
                    <ul className="space-y-2 text-sm text-slate-400">
                        <li>✓ 风险预警机制</li>
                        <li>✓ 补贴效果评估</li>
                        <li>✓ 行业数据沉淀</li>
                        <li>✓ 政策优化依据</li>
                    </ul>
                </div>
            </div>
        </div>
    );
}

function GovCard({ label, value, icon, color = 'text-indigo-400' }) {
    return (
        <div className="bg-slate-800/30 border border-slate-700/50 rounded-xl p-4 text-center">
            <div className="text-2xl mb-2">{icon}</div>
            <div className={`text-xl font-bold ${color} mb-1`}>{value}</div>
            <div className="text-xs text-slate-500">{label}</div>
        </div>
    );
}

// 渲染应用
ReactDOM.createRoot(document.getElementById('root')).render(<App />);
