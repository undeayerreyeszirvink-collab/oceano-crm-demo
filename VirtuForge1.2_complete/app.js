const { useState, useEffect } = React;

// ===== 数据层 =====
const VIRTUAL_EMPLOYEES = [
    // 销售与增长
    { id: 1, role: '商机挖掘员', icon: '🔍', category: 'sales', desc: '自动识别潜在客户、商机评分、线索分配', roi: '每周节省约8小时线索筛选时间', price: 8500, complexity: 0.7, period: '10-12天', painPoints: ['客户太多跟不过来', '不知道哪个客户值得跟'] },
    { id: 2, role: '客户跟进员', icon: '📞', category: 'sales', desc: '自动跟进客户、记录沟通、提醒关键节点', roi: '跟进客户数量提升3倍，不再漏单', price: 7200, complexity: 0.6, period: '8-10天', painPoints: ['客户太多跟不过来', '忘记跟进导致丢单'] },
    { id: 3, role: '报价生成员', icon: '💰', category: 'sales', desc: '智能报价计算、成本分析、方案生成', roi: '报价时间从2小时缩短到5分钟', price: 7800, complexity: 0.65, period: '9-11天', painPoints: ['报价太慢客户等不及', '算错成本导致亏损'] },

    // 供应链与运营
    { id: 4, role: '排单员', icon: '📋', category: 'supply', desc: '生产排程优化、产能平衡、交期预测', roi: '交期准确率提升至95%，减少客户投诉', price: 9200, complexity: 0.8, period: '11-14天', painPoints: ['订单太多排不过来', '交期经常延误'] },
    { id: 5, role: '采购员', icon: '🛒', category: 'supply', desc: '供应商比价、采购建议、库存预警', roi: '采购成本平均降低8-12%', price: 8000, complexity: 0.7, period: '9-12天', painPoints: ['采购价格没底', '库存积压或断货'] },
    { id: 6, role: '库存优化员', icon: '📦', category: 'supply', desc: '库存分析、补货建议、呆滞预警', roi: '库存周转率提升30%，减少资金占用', price: 7500, complexity: 0.65, period: '8-10天', painPoints: ['库存积压或断货', '不知道该备多少货'] },

    // 财务与风控
    { id: 7, role: '资金分析员', icon: '💵', category: 'finance', desc: '现金流分析、资金预测、风险预警', roi: '提前14天预警资金风险，避免断链', price: 9500, complexity: 0.8, period: '12-15天', painPoints: ['账期管理混乱', '不知道下个月能不能发工资'] },
    { id: 8, role: '对账员', icon: '🧾', category: 'finance', desc: '自动对账、差异识别、账单核对', roi: '对账时间从3天缩短到2小时', price: 6800, complexity: 0.6, period: '8-10天', painPoints: ['对账太耗时', '账目经常出错'] },
    { id: 9, role: '成本分析员', icon: '📊', category: 'finance', desc: '成本核算、利润分析、成本优化建议', roi: '精准识别亏损产品，利润率平均提升5%', price: 8500, complexity: 0.7, period: '10-12天', painPoints: ['不知道哪个产品在亏钱', '账目经常出错'] },

    // 生产与制造
    { id: 10, role: '生产计划员', icon: '🏭', category: 'production', desc: '生产计划制定、物料需求计算、进度追踪', roi: '生产效率提升20%，物料浪费减少15%', price: 9000, complexity: 0.75, period: '11-13天', painPoints: ['订单太多排不过来', '交期经常延误'] },
    { id: 11, role: '质量监察员', icon: '🔬', category: 'production', desc: '质量数据分析、异常识别、改进建议', roi: '不良品率降低40%，客诉减少', price: 8200, complexity: 0.7, period: '9-11天', painPoints: ['质量问题频发', '客户投诉处理不过来'] },

    // 市场与情报
    { id: 12, role: '市场情报分析员', icon: '📈', category: 'market', desc: '市场趋势分析、行业报告生成、机会识别', roi: '每周自动生成行业报告，节省6小时调研时间', price: 8800, complexity: 0.75, period: '10-13天', painPoints: ['不了解市场动态', '不知道竞争对手在做什么'] },
    { id: 13, role: '竞品监控员', icon: '👁️', category: 'market', desc: '竞品动态追踪、价格监控、策略分析', roi: '实时掌握竞品价格变动，快速响应市场', price: 7500, complexity: 0.65, period: '8-10天', painPoints: ['不知道竞争对手在做什么', '价格总是被竞争对手打低'] },
];

const CATEGORIES = [
    { id: 'all', name: '全部岗位', icon: '🎯' },
    { id: 'sales', name: '销售与增长', icon: '📈' },
    { id: 'supply', name: '供应链与运营', icon: '🔗' },
    { id: 'finance', name: '财务与风控', icon: '💰' },
    { id: 'production', name: '生产与制造', icon: '🏭' },
    { id: 'market', name: '市场与情报', icon: '🔍' },
];

const PAIN_POINT_OPTIONS = [
    { id: 'overload', label: '客户太多跟不过来' },
    { id: 'miss', label: '忘记跟进导致丢单' },
    { id: 'quote', label: '报价太慢客户等不及' },
    { id: 'cost', label: '算错成本导致亏损' },
    { id: 'schedule', label: '订单太多排不过来' },
    { id: 'deadline', label: '交期经常延误' },
    { id: 'stock', label: '库存积压或断货' },
    { id: 'cashflow', label: '不知道下个月能不能发工资' },
    { id: 'account', label: '对账太耗时' },
    { id: 'profit', label: '不知道哪个产品在亏钱' },
    { id: 'quality', label: '质量问题频发' },
    { id: 'market', label: '不了解市场动态' },
    { id: 'competitor', label: '不知道竞争对手在做什么' },
];

const ENGINEERING_MODULES = [
    {
        id: 'interface',
        name: 'A类：接入与连接',
        icon: '🔌',
        atoms: [
            { id: 'wx_login', name: '微信登录接入', price: 1200, days: 1.5, complexity: 0.6, type: 'eng' },
            { id: 'wx_scan', name: '微信扫码触发', price: 800, days: 1, complexity: 0.5, type: 'eng' },
            { id: 'session_mgmt', name: '对话记忆管理', price: 1500, days: 2, complexity: 0.7, type: 'eng' },
            { id: 'webhook', name: '实时消息接收', price: 1000, days: 1.5, complexity: 0.6, type: 'eng' },
        ]
    },
    {
        id: 'data',
        name: 'B类：信息结构化',
        icon: '🗃️',
        atoms: [
            { id: 'json_schema', name: '需求信息结构化', price: 600, days: 0.5, complexity: 0.4, type: 'data' },
            { id: 'form_design', name: '表单结构设计', price: 800, days: 1, complexity: 0.5, type: 'data' },
            { id: 'db_io', name: '数据存取', price: 1000, days: 1.5, complexity: 0.6, type: 'data' },
            { id: 'data_validation', name: '数据校验规则', price: 700, days: 1, complexity: 0.5, type: 'data' },
        ]
    },
    {
        id: 'ai',
        name: 'C类：AI智能能力',
        icon: '🤖',
        atoms: [
            { id: 'prompt_template', name: 'AI指令设计', price: 1200, days: 1.5, complexity: 0.7, type: 'ai' },
            { id: 'dialog_fsm', name: '智能多轮对话能力', price: 3000, days: 3, complexity: 0.9, type: 'ai' },
            { id: 'intent_recognition', name: '用户意图理解', price: 1500, days: 2, complexity: 0.8, type: 'ai' },
            { id: 'entity_extract', name: '关键信息提取', price: 1800, days: 2.5, complexity: 0.8, type: 'ai' },
            { id: 'context_understand', name: '语境理解能力', price: 2000, days: 2.5, complexity: 0.85, type: 'ai' },
        ]
    },
    {
        id: 'business',
        name: 'D类：业务流程',
        icon: '⚙️',
        atoms: [
            { id: 'dispatch_rule', name: '智能分配规则', price: 1200, days: 1.5, complexity: 0.7, type: 'eng' },
            { id: 'state_flow', name: '业务流程管理', price: 1000, days: 1.5, complexity: 0.6, type: 'eng' },
            { id: 'exception_handle', name: '异常自动处理', price: 800, days: 1, complexity: 0.5, type: 'eng' },
            { id: 'business_rule', name: '业务规则配置', price: 1500, days: 2, complexity: 0.75, type: 'eng' },
        ]
    },
    {
        id: 'interaction',
        name: 'E类：触达与通知',
        icon: '📱',
        atoms: [
            { id: 'msg_push', name: '消息推送', price: 1000, days: 1.5, complexity: 0.6, type: 'eng' },
            { id: 'feedback_collect', name: '用户反馈收集', price: 800, days: 1, complexity: 0.5, type: 'eng' },
            { id: 'h5_page', name: '移动端页面', price: 2000, days: 2.5, complexity: 0.7, type: 'eng' },
            { id: 'notification', name: '通知提醒机制', price: 900, days: 1, complexity: 0.55, type: 'eng' },
        ]
    },
];

// 企业规模补贴政策
const SUBSIDY_POLICY = {
    micro: { label: '小微企业', rate: 0.4, cap: 50000 },
    small: { label: '小型企业', rate: 0.3, cap: 80000 },
    medium: { label: '中型企业', rate: 0.2, cap: 100000 },
};

// 原子能力业务语言映射
const ATOM_BUSINESS_NAMES = {
    wx_login: '员工/客户扫码登录', wx_scan: '扫码触发业务流程', session_mgmt: '多轮对话记忆', webhook: '实时消息接收推送',
    json_schema: '业务数据结构化录入', form_design: '业务表单设计', db_io: '数据存储与查询', data_validation: '数据合规性校验',
    prompt_template: 'AI业务指令配置', dialog_fsm: '智能多轮业务对话', intent_recognition: '客户意图自动识别',
    entity_extract: '关键业务信息提取', context_understand: '上下文语境理解', dispatch_rule: '业务自动分配规则',
    state_flow: '业务流程状态管理', exception_handle: '异常情况自动处理', business_rule: '业务规则灵活配置',
    msg_push: '业务消息主动推送', feedback_collect: '客户反馈自动收集', h5_page: '移动端业务页面', notification: '关键节点提醒通知',
};

// ===== 问诊弹窗组件 =====
function DiagnosisModal({ onClose, onRecommend }) {
    const [step, setStep] = useState(0);
    const [answers, setAnswers] = useState({ pain: null, size: null, save: null });

    const questions = [
        {
            q: '你现在最头疼的事是什么？',
            key: 'pain',
            options: [
                { value: 'sales', label: '客户跟不过来，总是漏单' },
                { value: 'ops', label: '订单/库存/交期经常出问题' },
                { value: 'finance', label: '账目混乱，不知道赚没赚钱' },
                { value: 'market', label: '不了解市场，被竞争对手打' },
            ]
        },
        {
            q: '你的团队规模大概是？',
            key: 'size',
            options: [
                { value: 'solo', label: '就我一个人' },
                { value: 'small', label: '2-5人小团队' },
                { value: 'mid', label: '6-20人' },
                { value: 'large', label: '20人以上' },
            ]
        },
        {
            q: '你最想节省哪类时间？',
            key: 'save',
            options: [
                { value: 'follow', label: '客户跟进和沟通' },
                { value: 'data', label: '数据整理和对账' },
                { value: 'plan', label: '排单和计划制定' },
                { value: 'report', label: '报告和分析' },
            ]
        },
    ];

    const handleSelect = (key, value) => {
        const newAnswers = { ...answers, [key]: value };
        setAnswers(newAnswers);
        if (step < questions.length - 1) {
            setTimeout(() => setStep(step + 1), 300);
        } else {
            // 计算推荐
            const recommended = getRecommendations(newAnswers);
            onRecommend(recommended);
            onClose();
        }
    };

    const getRecommendations = (ans) => {
        const map = {
            sales: [1, 2, 3],
            ops: [4, 5, 6, 10],
            finance: [7, 8, 9],
            market: [12, 13],
        };
        const saveMap = {
            follow: [1, 2],
            data: [8, 9],
            plan: [4, 10],
            report: [12, 9],
        };
        const base = map[ans.pain] || [];
        const extra = saveMap[ans.save] || [];
        return [...new Set([...base, ...extra])];
    };

    const current = questions[step];

    return (
        <div className="fixed inset-0 bg-black/60 backdrop-blur-sm z-50 flex items-center justify-center p-4">
            <div className="bg-slate-900 border border-indigo-500/30 rounded-2xl p-8 max-w-lg w-full fade-in">
                <div className="flex items-center justify-between mb-6">
                    <div className="text-sm text-slate-400">问题 {step + 1} / {questions.length}</div>
                    <button onClick={onClose} className="text-slate-500 hover:text-slate-300 text-xl">✕</button>
                </div>
                <div className="flex gap-1 mb-6">
                    {questions.map((_, i) => (
                        <div key={i} className={`h-1 flex-1 rounded-full transition-all ${i <= step ? 'bg-indigo-500' : 'bg-slate-700'}`} />
                    ))}
                </div>
                <h3 className="text-xl font-bold text-slate-100 mb-6">{current.q}</h3>
                <div className="space-y-3">
                    {current.options.map(opt => (
                        <button
                            key={opt.value}
                            onClick={() => handleSelect(current.key, opt.value)}
                            className={`w-full text-left px-4 py-3 rounded-xl border transition-all ${
                                answers[current.key] === opt.value
                                    ? 'bg-indigo-600/30 border-indigo-500 text-indigo-200'
                                    : 'bg-slate-800/50 border-slate-700/50 text-slate-300 hover:border-indigo-500/50 hover:bg-slate-800'
                            }`}
                        >
                            {opt.label}
                        </button>
                    ))}
                </div>
            </div>
        </div>
    );
}

// ===== 预约顾问弹窗 =====
function ConsultModal({ onClose }) {
    const [form, setForm] = useState({ name: '', phone: '', time: '上午' });
    const [submitted, setSubmitted] = useState(false);
    const [error, setError] = useState('');

    const handleSubmit = () => {
        if (!form.name.trim()) { setError('请填写姓名'); return; }
        if (!/^1[3-9]\d{9}$/.test(form.phone)) { setError('请填写正确的手机号'); return; }
        try {
            const records = JSON.parse(localStorage.getItem('virtuforge_consult_records') || '[]');
            records.unshift({ ...form, createdAt: new Date().toISOString() });
            localStorage.setItem('virtuforge_consult_records', JSON.stringify(records.slice(0, 100)));
        } catch (e) {}
        setSubmitted(true);
    };

    return (
        <div className="fixed inset-0 bg-black/60 backdrop-blur-sm z-50 flex items-center justify-center p-4">
            <div className="bg-slate-900 border border-indigo-500/30 rounded-2xl p-8 max-w-md w-full fade-in">
                <div className="flex items-center justify-between mb-6">
                    <h3 className="text-xl font-bold text-slate-100">预约顾问</h3>
                    <button onClick={onClose} className="text-slate-500 hover:text-slate-300 text-xl">✕</button>
                </div>
                {submitted ? (
                    <div className="text-center py-8">
                        <div className="text-5xl mb-4">✅</div>
                        <div className="text-lg font-semibold text-green-400 mb-2">已收到，顾问将在24小时内联系您</div>
                        <div className="text-sm text-slate-400">联系时间：{form.time}</div>
                        <button onClick={onClose} className="mt-6 px-6 py-2 bg-indigo-600 hover:bg-indigo-700 text-white rounded-lg transition-all">关闭</button>
                    </div>
                ) : (
                    <div className="space-y-4">
                        <div>
                            <label className="block text-sm text-slate-400 mb-1">姓名</label>
                            <input
                                value={form.name}
                                onChange={e => setForm({ ...form, name: e.target.value })}
                                placeholder="请输入您的姓名"
                                className="w-full bg-slate-800/50 border border-slate-700 rounded-lg px-4 py-2.5 text-slate-100 placeholder-slate-500 focus:outline-none focus:border-indigo-500"
                            />
                        </div>
                        <div>
                            <label className="block text-sm text-slate-400 mb-1">手机号</label>
                            <input
                                value={form.phone}
                                onChange={e => setForm({ ...form, phone: e.target.value })}
                                placeholder="请输入手机号"
                                className="w-full bg-slate-800/50 border border-slate-700 rounded-lg px-4 py-2.5 text-slate-100 placeholder-slate-500 focus:outline-none focus:border-indigo-500"
                            />
                        </div>
                        <div>
                            <label className="block text-sm text-slate-400 mb-1">最方便联系时间</label>
                            <div className="flex gap-2">
                                {['上午', '下午', '晚上'].map(t => (
                                    <button
                                        key={t}
                                        onClick={() => setForm({ ...form, time: t })}
                                        className={`flex-1 py-2 rounded-lg border text-sm transition-all ${
                                            form.time === t
                                                ? 'bg-indigo-600/30 border-indigo-500 text-indigo-200'
                                                : 'bg-slate-800/50 border-slate-700 text-slate-400 hover:border-indigo-500/50'
                                        }`}
                                    >
                                        {t}
                                    </button>
                                ))}
                            </div>
                        </div>
                        {error && <div className="text-sm text-red-400">{error}</div>}
                        <button
                            onClick={handleSubmit}
                            className="w-full py-3 bg-indigo-600 hover:bg-indigo-700 text-white rounded-lg font-semibold transition-all mt-2"
                        >
                            提交预约
                        </button>
                    </div>
                )}
            </div>
        </div>
    );
}

// ===== 主应用组件 =====
function App() {
    const [currentStep, setCurrentStep] = useState(0);
    const [selectedEmployee, setSelectedEmployee] = useState(null);
    const [userIdea, setUserIdea] = useState('');
    const [complexityScore, setComplexityScore] = useState(null);
    const [selectedModules, setSelectedModules] = useState([]);
    const [productionProgress, setProductionProgress] = useState(0);
    const [isAnalyzing, setIsAnalyzing] = useState(false);
    const [companySize, setCompanySize] = useState('small');
    const [recommended, setRecommended] = useState([]);
    const [showDiagnosis, setShowDiagnosis] = useState(false);
    const [showConsult, setShowConsult] = useState(false);

    const steps = [
        { id: 0, name: 'AI人力市场', icon: '🏪' },
        { id: 1, name: '输入想法', icon: '💡' },
        { id: 2, name: '复杂度评估', icon: '📊' },
        { id: 3, name: '工程拆解', icon: '⚙️' },
        { id: 4, name: '生产看板', icon: '🏭' },
        { id: 5, name: '成果交付', icon: '✅' },
        { id: 6, name: '补贴申请', icon: '🏛️' },
    ];

    const goToStep = (step) => {
        setCurrentStep(step);
    };

    return (
        <div className="min-h-screen">
            {showDiagnosis && (
                <DiagnosisModal
                    onClose={() => setShowDiagnosis(false)}
                    onRecommend={(ids) => setRecommended(ids)}
                />
            )}
            {showConsult && <ConsultModal onClose={() => setShowConsult(false)} />}

            <nav className="bg-slate-900/50 backdrop-blur-lg border-b border-indigo-500/30 sticky top-0 z-50">
                <div className="max-w-7xl mx-auto px-6 py-4">
                    <div className="flex items-center justify-between">
                        <div className="flex items-center gap-3">
                            <span className="text-2xl">⚡</span>
                            <div>
                                <h1 className="text-xl font-bold text-indigo-400">VirtuForge 1.2</h1>
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

            <main className="max-w-7xl mx-auto px-6 py-8">
                {currentStep === 0 && (
                    <MarketplacePage
                        onSelectEmployee={(emp) => {
                            setSelectedEmployee(emp);
                            goToStep(1);
                        }}
                        recommended={recommended}
                        onShowDiagnosis={() => setShowDiagnosis(true)}
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
                                const score = calcComplexityScore(trimmedIdea, selectedEmployee);
                                setComplexityScore(score);
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
                        companySize={companySize}
                        setCompanySize={setCompanySize}
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
                        onShowConsult={() => setShowConsult(true)}
                    />
                )}
                {currentStep === 6 && (
                    <GovernmentPage
                        selectedEmployee={selectedEmployee}
                        selectedModules={selectedModules}
                        complexityScore={complexityScore}
                        companySize={companySize}
                    />
                )}
            </main>
        </div>
    );
}

// ===== 复杂度规则计算引擎 =====
function calcComplexityScore(idea, employee) {
    const text = idea || '';
    const len = text.trim().length;

    // 基础分：字数
    const baseScore = Math.min(30, Math.floor(len / 10));

    // 集成复杂度关键词
    const integrationKeywords = ['对接', 'ERP', 'CRM', 'WMS', '微信', '企微', 'API', '系统', '数据库', '平台'];
    const integrationHits = integrationKeywords.filter(k => text.includes(k)).length;
    const integration = Math.min(95, 40 + integrationHits * 8 + (employee?.complexity || 0.6) * 20);

    // AI交互复杂度关键词
    const aiKeywords = ['多轮', '意图', '理解', '识别', '智能', '自动', '分析', '预测', '推荐'];
    const aiHits = aiKeywords.filter(k => text.includes(k)).length;
    const aiInteraction = Math.min(95, 35 + aiHits * 8 + (employee?.complexity || 0.6) * 25);

    // 异常处理复杂度关键词
    const exceptionKeywords = ['异常', '超时', '重复', '错误', '失败', '拦截', '校验', '权限', '缺失'];
    const exceptionHits = exceptionKeywords.filter(k => text.includes(k)).length;
    const exception = Math.min(95, 30 + exceptionHits * 10 + (employee?.complexity || 0.6) * 20);

    // 业务复杂度：基于岗位 + 流程关键词
    const processKeywords = ['流程', '步骤', '环节', '审批', '分配', '规则', '条件', '判断'];
    const processHits = processKeywords.filter(k => text.includes(k)).length;
    const business = Math.min(95, 35 + processHits * 7 + (employee?.complexity || 0.6) * 30);

    // 数据复杂度：基于数据相关词
    const dataKeywords = ['字段', '表单', '报表', '数据', '记录', '导出', '统计', '汇总'];
    const dataHits = dataKeywords.filter(k => text.includes(k)).length;
    const data = Math.min(90, 25 + dataHits * 8 + baseScore * 0.5);

    const overall = Math.round((business * 0.25 + data * 0.15 + integration * 0.25 + aiInteraction * 0.2 + exception * 0.15));

    // 成本和工期随复杂度变化
    const complexityFactor = 1.5 + (overall / 100) * 2;
    const baseDays = 6 + Math.floor(overall / 20);
    const riskBuffer = 0.2 + (overall / 100) * 0.3;
    const minDays = Math.round(baseDays * complexityFactor);
    const maxDays = Math.round(minDays * (1 + riskBuffer));
    const minCost = minDays * 1200;
    const maxCost = maxDays * 2200;

    const level = overall >= 80 ? '高' : overall >= 60 ? '中高' : overall >= 40 ? '中' : '低';
    const supportLevel = overall >= 75 ? 'A类重点项目' : overall >= 55 ? 'B类试点项目' : 'C类基础项目';

    return {
        overall,
        business: Math.round(business),
        data: Math.round(data),
        integration: Math.round(integration),
        ai_interaction: Math.round(aiInteraction),
        exception: Math.round(exception),
        baseDays,
        complexityFactor: parseFloat(complexityFactor.toFixed(1)),
        riskBuffer: parseFloat(riskBuffer.toFixed(2)),
        minCost,
        maxCost,
        minDays,
        maxDays,
        level,
        supportLevel,
    };
}

// ===== Step 0: AI人力市场 =====
function MarketplacePage({ onSelectEmployee, recommended, onShowDiagnosis }) {
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
            <div className="text-center mb-10">
                <div className="inline-block px-3 py-1 bg-indigo-500/10 border border-indigo-500/30 rounded-full text-xs text-indigo-400 mb-4">
                    AI 人力资源市场
                </div>
                <h2 className="text-4xl font-bold mb-3">
                    <span className="bg-gradient-to-r from-indigo-400 to-purple-400 bg-clip-text text-transparent">
                        按职能定位虚拟员工
                    </span>
                </h2>
                <p className="text-slate-400 text-base mb-4">选择岗位，AI 自动评估复杂度、拆解工程、生成可交付的虚拟员工</p>
                <button
                    onClick={onShowDiagnosis}
                    className="px-6 py-2.5 bg-gradient-to-r from-purple-600 to-indigo-600 hover:from-purple-700 hover:to-indigo-700 text-white rounded-lg font-medium transition-all shadow-lg shadow-purple-500/20"
                >
                    🩺 不知道选哪个？先做3题诊断
                </button>
            </div>

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

            <div className="space-y-10">
                {filteredGroups.map(group => (
                    <div key={group.id}>
                        <div className="flex items-center gap-3 mb-4">
                            <span className="text-xl">{group.icon}</span>
                            <h3 className="text-lg font-semibold text-slate-200">{group.name}</h3>
                            <div className="flex-1 h-px bg-slate-700/50" />
                            <span className="text-xs text-slate-500">{group.employees.length} 个岗位</span>
                        </div>

                        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
                            {group.employees.map(emp => {
                                const isRecommended = recommended.includes(emp.id);
                                return (
                                    <div
                                        key={emp.id}
                                        onClick={() => onSelectEmployee(emp)}
                                        className={`bg-slate-800/30 border rounded-xl p-5 hover:bg-slate-800/60 transition-all cursor-pointer group relative ${
                                            isRecommended
                                                ? 'border-yellow-500/50 shadow-lg shadow-yellow-500/10'
                                                : 'border-slate-700/40 hover:border-indigo-500/50'
                                        }`}
                                    >
                                        {isRecommended && (
                                            <div className="absolute -top-2 -right-2 bg-yellow-500 text-slate-900 text-xs font-bold px-2 py-1 rounded-full">
                                                推荐
                                            </div>
                                        )}
                                        <div className="flex items-start justify-between mb-3">
                                            <span className="text-3xl">{emp.icon}</span>
                                            <span className="text-xs px-2 py-1 bg-slate-700/50 text-slate-400 rounded-full">
                                                {emp.period}
                                            </span>
                                        </div>
                                        <h4 className="text-base font-semibold text-slate-100 mb-1.5">{emp.role}</h4>
                                        <p className="text-sm text-slate-400 mb-2 leading-relaxed">{emp.desc}</p>
                                        <div className="text-xs text-green-400 mb-3 flex items-start gap-1">
                                            <span>💡</span>
                                            <span>{emp.roi}</span>
                                        </div>

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
                                );
                            })}
                        </div>
                    </div>
                ))}
            </div>
        </div>
    );
}

// ===== Step 1-6: 其他页面组件 =====
function IdeaInputPage({ selectedEmployee, userIdea, setUserIdea, isAnalyzing, onNext }) {
    if (!selectedEmployee) return (
        <div className="text-center text-slate-400 py-20">请先选择一个虚拟员工</div>
    );
    const canSubmit = !isAnalyzing && userIdea.trim().length >= 20;
    return (
        <div className="max-w-3xl mx-auto fade-in">
            <div className="text-center mb-8">
                <div className="text-5xl mb-4">{selectedEmployee.icon}</div>
                <h2 className="text-3xl font-bold text-slate-100 mb-2">定制你的 {selectedEmployee.role}</h2>
                <p className="text-slate-400">描述你的具体需求，AI 将自动评估复杂度并拆解工程</p>
            </div>
            <div className="bg-slate-800/30 border border-slate-700/40 rounded-2xl p-8">
                <label className="block text-sm font-medium text-slate-300 mb-3">详细描述你的需求（至少20字）</label>
                <textarea
                    value={userIdea}
                    onChange={e => setUserIdea(e.target.value)}
                    placeholder="例如：我需要一个能自动跟进客户的虚拟员工，通过企业微信触达，对接CRM系统，自动记录沟通内容并提醒跟进节点..."
                    rows={8}
                    className="w-full bg-slate-900/50 border border-slate-700 rounded-xl px-4 py-3 text-slate-100 placeholder-slate-500 focus:outline-none focus:border-indigo-500 resize-none"
                />
                <div className="flex items-center justify-between mt-4">
                    <span className={`text-sm ${userIdea.trim().length >= 20 ? 'text-green-400' : 'text-slate-500'}`}>
                        {userIdea.trim().length} / 20 字
                    </span>
                    <button
                        onClick={onNext}
                        disabled={!canSubmit}
                        className={`px-8 py-3 rounded-xl font-semibold transition-all ${canSubmit ? 'bg-indigo-600 hover:bg-indigo-700 text-white shadow-lg shadow-indigo-500/20' : 'bg-slate-700/50 text-slate-500 cursor-not-allowed'}`}
                    >
                        {isAnalyzing ? '分析中...' : '开始评估 →'}
                    </button>
                </div>
            </div>
        </div>
    );
}

function ComplexityPage({ complexityScore, selectedEmployee, onNext }) {
    if (!complexityScore) return (
        <div className="text-center text-slate-400 py-20">正在评估...</div>
    );
    const dimensions = [
        { key: 'business', label: '业务复杂度', icon: '⚙️' },
        { key: 'data', label: '数据复杂度', icon: '🗃️' },
        { key: 'integration', label: '集成复杂度', icon: '🔌' },
        { key: 'ai_interaction', label: 'AI交互复杂度', icon: '🤖' },
        { key: 'exception', label: '异常处理复杂度', icon: '🛡️' },
    ];
    return (
        <div className="max-w-4xl mx-auto fade-in">
            <div className="text-center mb-10">
                <h2 className="text-3xl font-bold text-slate-100 mb-2">需求复杂度分析</h2>
                <p className="text-slate-400">基于你的需求描述，AI 已完成评估</p>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8">
                <div className="bg-slate-800/30 border border-slate-700/40 rounded-2xl p-6">
                    <div className="text-center mb-6">
                        <div className="text-6xl font-bold text-indigo-400 mb-2">{complexityScore.overall}</div>
                        <div className="text-sm text-slate-400">综合复杂度评分</div>
                        <div className="mt-2 inline-block px-3 py-1 bg-indigo-500/10 border border-indigo-500/30 rounded-full text-xs text-indigo-400">
                            {complexityScore.level}复杂度 · {complexityScore.supportLevel}
                        </div>
                    </div>
                    <div className="space-y-3">
                        <div className="flex items-center justify-between text-sm">
                            <span className="text-slate-400">预估工期</span>
                            <span className="text-slate-100 font-semibold">{complexityScore.minDays}-{complexityScore.maxDays} 天</span>
                        </div>
                        <div className="flex items-center justify-between text-sm">
                            <span className="text-slate-400">预估成本</span>
                            <span className="text-slate-100 font-semibold">¥{complexityScore.minCost.toLocaleString()}-{complexityScore.maxCost.toLocaleString()}</span>
                        </div>
                        <div className="flex items-center justify-between text-sm">
                            <span className="text-slate-400">复杂度系数</span>
                            <span className="text-slate-100 font-semibold">× {complexityScore.complexityFactor}</span>
                        </div>
                    </div>
                </div>
                <div className="space-y-3">
                    {dimensions.map(dim => (
                        <div key={dim.key} className="bg-slate-800/30 border border-slate-700/40 rounded-xl p-4">
                            <div className="flex items-center justify-between mb-2">
                                <div className="flex items-center gap-2">
                                    <span className="text-lg">{dim.icon}</span>
                                    <span className="text-sm font-medium text-slate-300">{dim.label}</span>
                                </div>
                                <span className="text-lg font-bold text-indigo-400">{complexityScore[dim.key]}</span>
                            </div>
                            <div className="w-full bg-slate-700/30 rounded-full h-2">
                                <div
                                    className="bg-indigo-500 h-2 rounded-full transition-all"
                                    style={{ width: `${complexityScore[dim.key]}%` }}
                                />
                            </div>
                        </div>
                    ))}
                </div>
            </div>
            <div className="text-center">
                <button
                    onClick={onNext}
                    className="px-8 py-3 bg-indigo-600 hover:bg-indigo-700 text-white rounded-xl font-semibold transition-all shadow-lg shadow-indigo-500/20"
                >
                    确认评估，进入工程拆解 →
                </button>
            </div>
        </div>
    );
}

function EngineeringPage({ selectedModules, setSelectedModules, companySize, setCompanySize, onNext }) {
    const toggleAtom = (atomId) => { setSelectedModules(prev => prev.includes(atomId) ? prev.filter(id => id !== atomId) : [...prev, atomId]); };
    const allAtoms = ENGINEERING_MODULES.flatMap(m => m.atoms);
    const selectedAtoms = allAtoms.filter(a => selectedModules.includes(a.id));
    const totalPrice = selectedAtoms.reduce((sum, a) => sum + a.price, 0);
    const totalDays = selectedAtoms.reduce((sum, a) => sum + a.days, 0);
    const policy = SUBSIDY_POLICY[companySize];
    const rawSubsidy = Math.round(totalPrice * policy.rate);
    const subsidy = Math.min(rawSubsidy, policy.cap);
    const netCost = totalPrice - subsidy;
    return (
        <div className="fade-in">
            <div className="text-center mb-8">
                <h2 className="text-3xl font-bold text-slate-100 mb-2">选择所需能力模块</h2>
            </div>
            <div className="bg-slate-800/30 border border-slate-700/40 rounded-2xl p-6 mb-6">
                <h3 className="text-base font-semibold text-slate-200 mb-4">企业规模（影响补贴比例）</h3>
                <div className="flex gap-3">
                    {Object.entries(SUBSIDY_POLICY).map(([key, pol]) => (
                        <button key={key} onClick={() => setCompanySize(key)} className={`flex-1 py-3 px-4 rounded-xl border text-sm font-medium transition-all ${companySize === key ? 'bg-indigo-600/30 border-indigo-500 text-indigo-200' : 'bg-slate-800/50 border-slate-700 text-slate-400 hover:border-indigo-500/50'}`}>
                            <div className="font-semibold">{pol.label}</div>
                            <div className="text-xs mt-1 opacity-70">补贴 {Math.round(pol.rate * 100)}%，上限 {(pol.cap / 10000).toFixed(0)} 万</div>
                        </button>
                    ))}
                </div>
            </div>
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                <div className="lg:col-span-2 space-y-4">
                    {ENGINEERING_MODULES.map(module => (
                        <div key={module.id} className="bg-slate-800/30 border border-slate-700/40 rounded-2xl p-5">
                            <div className="flex items-center gap-2 mb-4">
                                <span className="text-xl">{module.icon}</span>
                                <h3 className="text-base font-semibold text-slate-200">{module.name}</h3>
                            </div>
                            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                                {module.atoms.map(atom => {
                                    const isSelected = selectedModules.includes(atom.id);
                                    const bizName = ATOM_BUSINESS_NAMES[atom.id] || atom.name;
                                    return (
                                        <div key={atom.id} onClick={() => toggleAtom(atom.id)} className={`p-3 rounded-xl border cursor-pointer transition-all ${isSelected ? 'bg-indigo-600/20 border-indigo-500/60 text-indigo-200' : 'bg-slate-900/30 border-slate-700/40 text-slate-400 hover:border-indigo-500/40'}`}>
                                            <div className="flex items-start justify-between gap-2">
                                                <div>
                                                    <div className="text-sm font-medium">{bizName}</div>
                                                    <div className="text-xs opacity-60 mt-0.5">{atom.name}</div>
                                                </div>
                                                <div className={`w-4 h-4 rounded border flex-shrink-0 mt-0.5 flex items-center justify-center ${isSelected ? 'bg-indigo-500 border-indigo-500' : 'border-slate-600'}`}>
                                                    {isSelected && <span className="text-white text-xs">✓</span>}
                                                </div>
                                            </div>
                                            <div className="flex items-center justify-between mt-2 text-xs">
                                                <span className="text-indigo-400">¥{atom.price.toLocaleString()}</span>
                                                <span className="text-slate-500">{atom.days}天</span>
                                            </div>
                                        </div>
                                    );
                                })}
                            </div>
                        </div>
                    ))}
                </div>
                <div className="space-y-4">
                    <div className="bg-slate-800/30 border border-slate-700/40 rounded-2xl p-5 sticky top-24">
                        <h3 className="text-base font-semibold text-slate-200 mb-4">工程汇总</h3>
                        <div className="space-y-3 mb-4">
                            <div className="flex justify-between text-sm">
                                <span className="text-slate-400">已选模块</span>
                                <span className="text-slate-100">{selectedModules.length} 个</span>
                            </div>
                            <div className="flex justify-between text-sm">
                                <span className="text-slate-400">预估工期</span>
                                <span className="text-slate-100">{totalDays.toFixed(1)} 天</span>
                            </div>
                            <div className="flex justify-between text-sm">
                                <span className="text-slate-400">工程总价</span>
                                <span className="text-slate-100 font-semibold">¥{totalPrice.toLocaleString()}</span>
                            </div>
                        </div>
                        <div className="border-t border-slate-700/40 pt-4 mb-4">
                            <div className="text-xs text-slate-500 mb-2">{policy.label}补贴方案</div>
                            <div className="flex justify-between text-sm mb-1">
                                <span className="text-slate-400">补贴比例</span>
                                <span className="text-green-400">{Math.round(policy.rate * 100)}%</span>
                            </div>
                            <div className="flex justify-between text-sm mb-1">
                                <span className="text-slate-400">预计补贴</span>
                                <span className="text-green-400 font-semibold">-¥{subsidy.toLocaleString()}</span>
                            </div>
                            <div className="flex justify-between text-sm font-bold mt-2 pt-2 border-t border-slate-700/40">
                                <span className="text-slate-200">企业实付</span>
                                <span className="text-indigo-400 text-lg">¥{netCost.toLocaleString()}</span>
                            </div>
                        </div>
                        <button onClick={onNext} disabled={selectedModules.length === 0} className={`w-full py-3 rounded-xl font-semibold transition-all ${selectedModules.length > 0 ? 'bg-indigo-600 hover:bg-indigo-700 text-white shadow-lg shadow-indigo-500/20' : 'bg-slate-700/50 text-slate-500 cursor-not-allowed'}`}>开始生产 →</button>
                    </div>
                </div>
            </div>
        </div>
    );
}

function ProductionPage({ selectedModules, progress, setProgress, onNext }) {
    const allAtoms = ENGINEERING_MODULES.flatMap(m => m.atoms);
    const selectedAtoms = allAtoms.filter(a => selectedModules.includes(a.id));
    const [currentTask, setCurrentTask] = useState(0);
    useEffect(() => { if (progress >= 100) return; const timer = setInterval(() => { setProgress(prev => { const next = prev + 2; if (next >= 100) { clearInterval(timer); return 100; } return next; }); }, 120); return () => clearInterval(timer); }, []);
    useEffect(() => { if (selectedAtoms.length > 0) { const taskIdx = Math.floor((progress / 100) * selectedAtoms.length); setCurrentTask(Math.min(taskIdx, selectedAtoms.length - 1)); } }, [progress, selectedAtoms.length]);
    return (
        <div className="max-w-3xl mx-auto fade-in">
            <div className="text-center mb-10">
                <h2 className="text-3xl font-bold text-slate-100 mb-2">正在制造你的虚拟员工</h2>
            </div>
            <div className="bg-slate-800/30 border border-slate-700/40 rounded-2xl p-8 mb-6">
                <div className="flex items-center justify-between mb-3">
                    <span className="text-sm text-slate-400">整体进度</span>
                    <span className="text-2xl font-bold text-indigo-400">{progress}%</span>
                </div>
                <div className="w-full bg-slate-700/30 rounded-full h-3 mb-6">
                    <div className="bg-gradient-to-r from-indigo-500 to-purple-500 h-3 rounded-full transition-all duration-300" style={{ width: `${progress}%` }} />
                </div>
                <div className="space-y-2">
                    {selectedAtoms.map((atom, idx) => {
                        const bizName = ATOM_BUSINESS_NAMES[atom.id] || atom.name;
                        const isDone = idx < currentTask || progress >= 100;
                        const isActive = idx === currentTask && progress < 100;
                        return (
                            <div key={atom.id} className={`flex items-center gap-3 p-3 rounded-lg transition-all ${isActive ? 'bg-indigo-600/20 border border-indigo-500/40' : isDone ? 'opacity-60' : 'opacity-30'}`}>
                                <div className={`w-5 h-5 rounded-full flex items-center justify-center flex-shrink-0 ${isDone ? 'bg-green-500' : isActive ? 'bg-indigo-500 animate-pulse' : 'bg-slate-700'}`}>
                                    {isDone && <span className="text-white text-xs">✓</span>}
                                    {isActive && <span className="text-white text-xs">⚡</span>}
                                </div>
                                <span className={`text-sm ${isActive ? 'text-indigo-200 font-medium' : isDone ? 'text-slate-400' : 'text-slate-600'}`}>{bizName}</span>
                                {isDone && <span className="ml-auto text-xs text-green-400">完成</span>}
                                {isActive && <span className="ml-auto text-xs text-indigo-400">构建中...</span>}
                            </div>
                        );
                    })}
                </div>
            </div>
            {progress >= 100 && (
                <div className="text-center">
                    <div className="text-4xl mb-4">🎉</div>
                    <div className="text-xl font-bold text-green-400 mb-2">虚拟员工制造完成！</div>
                    <button onClick={onNext} className="px-8 py-3 bg-indigo-600 hover:bg-indigo-700 text-white rounded-xl font-semibold transition-all shadow-lg shadow-indigo-500/20">查看成果交付 →</button>
                </div>
            )}
        </div>
    );
}

function DeliveryPage({ selectedEmployee, onNext, onShowConsult }) {
    return (
        <div className="max-w-3xl mx-auto fade-in text-center">
            <div className="text-6xl mb-6">🎉</div>
            <h2 className="text-3xl font-bold text-slate-100 mb-4">虚拟员工制造完成！</h2>
            <p className="text-slate-400 mb-8">您的 {selectedEmployee?.role} 已经准备就绪</p>
            <div className="flex gap-4 justify-center">
                <button onClick={onShowConsult} className="px-8 py-3 bg-purple-600 hover:bg-purple-700 text-white rounded-xl font-semibold transition-all shadow-lg shadow-purple-500/20">预约顾问</button>
                <button onClick={onNext} className="px-8 py-3 bg-indigo-600 hover:bg-indigo-700 text-white rounded-xl font-semibold transition-all shadow-lg shadow-indigo-500/20">申请政府补贴 →</button>
            </div>
        </div>
    );
}

function GovernmentPage({ selectedEmployee, selectedModules, complexityScore, companySize }) {
    const [companyInfo, setCompanyInfo] = useState({ name: '', creditCode: '', legalPerson: '', phone: '' });
    const allAtoms = ENGINEERING_MODULES.flatMap(m => m.atoms);
    const selectedAtoms = allAtoms.filter(a => selectedModules.includes(a.id));
    const totalPrice = selectedAtoms.reduce((sum, a) => sum + a.price, 0);
    const policy = SUBSIDY_POLICY[companySize];
    const rawSubsidy = Math.round(totalPrice * policy.rate);
    const subsidy = Math.min(rawSubsidy, policy.cap);
    const netCost = totalPrice - subsidy;
    return (
        <div className="max-w-4xl mx-auto fade-in">
            <div className="text-center mb-8">
                <h2 className="text-3xl font-bold text-slate-100 mb-2">政府补贴申请</h2>
            </div>
            <div className="bg-slate-800/30 border border-slate-700/40 rounded-2xl p-6 mb-6">
                <h3 className="text-lg font-semibold text-slate-200 mb-4">企业信息</h3>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                        <label className="block text-sm text-slate-400 mb-2">企业名称</label>
                        <input value={companyInfo.name} onChange={e => setCompanyInfo({...companyInfo, name: e.target.value})} placeholder="请输入企业全称" className="w-full bg-slate-900/50 border border-slate-700 rounded-lg px-4 py-2.5 text-slate-100 placeholder-slate-500 focus:outline-none focus:border-indigo-500" />
                    </div>
                    <div>
                        <label className="block text-sm text-slate-400 mb-2">统一社会信用代码</label>
                        <input value={companyInfo.creditCode} onChange={e => setCompanyInfo({...companyInfo, creditCode: e.target.value})} placeholder="18位统一社会信用代码" maxLength={18} className="w-full bg-slate-900/50 border border-slate-700 rounded-lg px-4 py-2.5 text-slate-100 placeholder-slate-500 focus:outline-none focus:border-indigo-500" />
                        {companyInfo.creditCode && companyInfo.creditCode.length !== 18 && <div className="text-xs text-red-400 mt-1">请输入18位统一社会信用代码</div>}
                    </div>
                    <div>
                        <label className="block text-sm text-slate-400 mb-2">法人姓名</label>
                        <input value={companyInfo.legalPerson} onChange={e => setCompanyInfo({...companyInfo, legalPerson: e.target.value})} placeholder="请输入法人姓名" className="w-full bg-slate-900/50 border border-slate-700 rounded-lg px-4 py-2.5 text-slate-100 placeholder-slate-500 focus:outline-none focus:border-indigo-500" />
                    </div>
                    <div>
                        <label className="block text-sm text-slate-400 mb-2">联系电话</label>
                        <input value={companyInfo.phone} onChange={e => setCompanyInfo({...companyInfo, phone: e.target.value})} placeholder="请输入联系电话" className="w-full bg-slate-900/50 border border-slate-700 rounded-lg px-4 py-2.5 text-slate-100 placeholder-slate-500 focus:outline-none focus:border-indigo-500" />
                        {companyInfo.phone && !/^1[3-9]\d{9}$/.test(companyInfo.phone) && <div className="text-xs text-red-400 mt-1">请输入正确的手机号</div>}
                    </div>
                </div>
            </div>
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                <div className="bg-slate-800/30 border border-slate-700/40 rounded-2xl p-6">
                    <h3 className="text-lg font-semibold text-slate-200 mb-4">补贴计算</h3>
                    <div className="space-y-3">
                        <div className="flex justify-between text-sm">
                            <span className="text-slate-400">工程总价</span>
                            <span className="text-slate-100">¥{totalPrice.toLocaleString()}</span>
                        </div>
                        <div className="flex justify-between text-sm">
                            <span className="text-slate-400">企业规模</span>
                            <span className="text-slate-100">{policy.label}</span>
                        </div>
                        <div className="flex justify-between text-sm">
                            <span className="text-slate-400">补贴比例</span>
                            <span className="text-green-400">{Math.round(policy.rate * 100)}%</span>
                        </div>
                        <div className="flex justify-between text-sm">
                            <span className="text-slate-400">补贴上限</span>
                            <span className="text-green-400">¥{policy.cap.toLocaleString()}</span>
                        </div>
                        <div className="flex justify-between text-sm font-bold pt-3 border-t border-slate-700/40">
                            <span className="text-slate-200">预计补贴</span>
                            <span className="text-green-400 text-lg">¥{subsidy.toLocaleString()}</span>
                        </div>
                        <div className="flex justify-between text-sm font-bold">
                            <span className="text-slate-200">企业实付</span>
                            <span className="text-indigo-400 text-lg">¥{netCost.toLocaleString()}</span>
                        </div>
                    </div>
                </div>
                <div className="bg-slate-800/30 border border-slate-700/40 rounded-2xl p-6">
                    <h3 className="text-lg font-semibold text-slate-200 mb-4">申请材料</h3>
                    <div className="space-y-2 text-sm text-slate-400 mb-4">
                        <div>✓ 企业营业执照</div>
                        <div>✓ 项目技术方案</div>
                        <div>✓ 预算明细表</div>
                        <div>✓ 企业信用报告</div>
                    </div>
                    <button onClick={() => alert('申请材料已生成，请查收邮箱')} className="w-full py-3 bg-green-600 hover:bg-green-700 text-white rounded-xl font-semibold transition-all shadow-lg shadow-green-500/20 mb-3">下载申请材料包</button>
                    <button onClick={() => window.location.reload()} className="w-full py-3 bg-slate-700 hover:bg-slate-600 text-slate-200 rounded-xl font-semibold transition-all">返回市场首页</button>
                </div>
            </div>
        </div>
    );
}

// ===== 渲染到 DOM =====
ReactDOM.createRoot(document.getElementById('root')).render(<App />);
