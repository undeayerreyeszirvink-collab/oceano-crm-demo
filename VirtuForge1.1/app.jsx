const { useState, useEffect } = React;

// ===== 数据层 =====
const VIRTUAL_EMPLOYEES = [
    { id: 1, role: '销售顾问', icon: '💼', category: 'sales', desc: '客户需求采集、线索筛选、自动跟进', price: 8500, complexity: 0.7, period: '10-12天' },
    { id: 2, role: '客服专员', icon: '💬', category: 'service', desc: '7x24智能应答、工单处理、满意度调查', price: 7200, complexity: 0.6, period: '8-10天' },
    { id: 3, role: '招聘专员', icon: '👥', category: 'hr', desc: '简历筛选、候选人评分、面试安排', price: 6000, complexity: 0.5, period: '7-9天' },
    { id: 4, role: '法务助理', icon: '⚖️', category: 'legal', desc: '合同审核、风险识别、条款建议', price: 9500, complexity: 0.8, period: '12-15天' },
    { id: 5, role: '财务助理', icon: '💰', category: 'finance', desc: '发票识别、报销审核、账目核对', price: 7800, complexity: 0.6, period: '9-11天' },
    { id: 6, role: '数据分析师', icon: '📊', category: 'analytics', desc: '数据清洗、报表生成、趋势分析', price: 8800, complexity: 0.7, period: '10-13天' },
    { id: 7, role: '内容编辑', icon: '✍️', category: 'content', desc: '文案生成、内容审核、SEO优化', price: 6500, complexity: 0.5, period: '7-9天' },
    { id: 8, role: '运营助理', icon: '📱', category: 'operations', desc: '活动策划、用户运营、数据监控', price: 7000, complexity: 0.6, period: '8-10天' },
];

const CATEGORIES = [
    { id: 'all', name: '全部岗位', icon: '🎯' },
    { id: 'sales', name: '销售', icon: '💼' },
    { id: 'service', name: '客服', icon: '💬' },
    { id: 'hr', name: '人力', icon: '👥' },
    { id: 'legal', name: '法务', icon: '⚖️' },
    { id: 'finance', name: '财务', icon: '💰' },
    { id: 'analytics', name: '数据', icon: '📊' },
    { id: 'content', name: '内容', icon: '✍️' },
    { id: 'operations', name: '运营', icon: '📱' },
];

const ENGINEERING_MODULES = [
    {
        id: 'dialog',
        name: '对话理解模块',
        icon: '💬',
        atoms: [
            { id: 'prompt', name: 'Prompt工程设计', price: 1000, days: 1.5, complexity: 0.6, type: 'ai' },
            { id: 'fsm', name: '多轮对话状态机', price: 3000, days: 3, complexity: 0.9, type: 'eng' },
            { id: 'exception', name: '异常输入处理', price: 800, days: 1, complexity: 0.5, type: 'eng' },
        ]
    },
    {
        id: 'channel',
        name: '渠道接入模块',
        icon: '📱',
        atoms: [
            { id: 'wechat', name: '微信接入', price: 1500, days: 2, complexity: 0.7, type: 'eng' },
            { id: 'web', name: 'Web接入', price: 1200, days: 1.5, complexity: 0.6, type: 'eng' },
            { id: 'api', name: 'API接口', price: 800, days: 1, complexity: 0.5, type: 'eng' },
        ]
    },
    {
        id: 'data',
        name: '数据处理模块',
        icon: '🗃️',
        atoms: [
            { id: 'schema', name: '数据结构设计', price: 500, days: 0.5, complexity: 0.3, type: 'data' },
            { id: 'storage', name: '存储方案', price: 700, days: 1, complexity: 0.4, type: 'data' },
            { id: 'export', name: '数据导出', price: 600, days: 0.5, complexity: 0.3, type: 'data' },
        ]
    },
    {
        id: 'intelligence',
        name: '智能决策模块',
        icon: '🤖',
        atoms: [
            { id: 'classify', name: '意图分类', price: 1200, days: 1.5, complexity: 0.7, type: 'ai' },
            { id: 'extract', name: '信息提取', price: 1000, days: 1.5, complexity: 0.6, type: 'ai' },
            { id: 'recommend', name: '智能推荐', price: 1500, days: 2, complexity: 0.8, type: 'ai' },
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
                        onNext={() => {
                            // 模拟AI分析
                            setTimeout(() => {
                                setComplexityScore({
                                    overall: 0.72,
                                    technical: 0.8,
                                    business: 0.65,
                                    risk: 0.7,
                                });
                                goToStep(2);
                            }, 1500);
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
    const filteredEmployees = category === 'all'
        ? VIRTUAL_EMPLOYEES
        : VIRTUAL_EMPLOYEES.filter(e => e.category === category);

    return (
        <div className="fade-in">
            <div className="text-center mb-12">
                <h2 className="text-4xl font-bold mb-4">
                    <span className="bg-gradient-to-r from-indigo-400 to-purple-400 bg-clip-text text-transparent">
                        AI 人力资源市场
                    </span>
                </h2>
                <p className="text-slate-400 text-lg">按职能定位，选择你需要的虚拟员工</p>
            </div>

            {/* 分类筛选 */}
            <div className="flex flex-wrap justify-center gap-2 mb-8">
                {CATEGORIES.map(cat => (
                    <button
                        key={cat.id}
                        onClick={() => setCategory(cat.id)}
                        className={`px-4 py-2 rounded-full text-sm transition-all ${
                            category === cat.id
                                ? 'bg-indigo-600 text-white'
                                : 'bg-slate-800/50 text-slate-400 hover:bg-slate-700/50'
                        }`}
                    >
                        <span className="mr-1">{cat.icon}</span>
                        {cat.name}
                    </button>
                ))}
            </div>

            {/* 员工卡片 */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
                {filteredEmployees.map(emp => (
                    <div
                        key={emp.id}
                        onClick={() => onSelectEmployee(emp)}
                        className="bg-slate-800/30 border border-slate-700/50 rounded-xl p-6 hover:border-indigo-500/50 hover:bg-slate-800/50 transition-all cursor-pointer group"
                    >
                        <div className="text-4xl mb-3">{emp.icon}</div>
                        <h3 className="text-lg font-semibold text-slate-100 mb-2">{emp.role}</h3>
                        <p className="text-sm text-slate-400 mb-4 line-clamp-2">{emp.desc}</p>
                        <div className="flex items-center justify-between text-sm">
                            <span className="text-indigo-400 font-semibold">¥{emp.price.toLocaleString()}</span>
                            <span className="text-slate-500">{emp.period}</span>
                        </div>
                        <div className="mt-3 pt-3 border-t border-slate-700/50">
                            <div className="flex items-center justify-between text-xs">
                                <span className="text-slate-500">复杂度</span>
                                <div className="flex items-center gap-1">
                                    {[...Array(5)].map((_, i) => (
                                        <div
                                            key={i}
                                            className={`w-2 h-2 rounded-full ${
                                                i < emp.complexity * 5 ? 'bg-indigo-500' : 'bg-slate-700'
                                            }`}
                                        />
                                    ))}
                                </div>
                            </div>
                        </div>
                    </div>
                ))}
            </div>
        </div>
    );
}

// ===== Step 1: 输入想法 =====
function IdeaInputPage({ selectedEmployee, userIdea, setUserIdea, onNext }) {
    return (
        <div className="fade-in max-w-3xl mx-auto">
            <div className="text-center mb-8">
                <div className="text-5xl mb-4">{selectedEmployee?.icon}</div>
                <h2 className="text-3xl font-bold mb-2">定制你的{selectedEmployee?.role}</h2>
                <p className="text-slate-400">描述你的具体需求，AI会自动评估复杂度和成本</p>
            </div>

            <div className="bg-slate-800/30 border border-slate-700/50 rounded-xl p-8">
                <label className="block text-sm text-slate-400 mb-3">
                    💡 描述你的想法（越详细越好）
                </label>
                <textarea
                    value={userIdea}
                    onChange={(e) => setUserIdea(e.target.value)}
                    placeholder={`例如：我需要一个${selectedEmployee?.role}，能够通过微信自动回复客户咨询，识别客户意图，并将高意向客户信息自动录入CRM系统...`}
                    className="w-full h-48 bg-slate-900/50 border border-slate-700 rounded-lg p-4 text-slate-100 placeholder-slate-500 focus:outline-none focus:border-indigo-500 resize-none"
                />

                <div className="mt-6 flex items-center justify-between">
                    <div className="text-sm text-slate-500">
                        <span className="text-indigo-400 font-semibold">{userIdea.length}</span> 字符
                    </div>
                    <button
                        onClick={onNext}
                        disabled={userIdea.length < 20}
                        className="px-6 py-3 bg-indigo-600 hover:bg-indigo-700 disabled:bg-slate-700 disabled:text-slate-500 text-white rounded-lg font-semibold transition-all"
                    >
                        开始AI评估 →
                    </button>
                </div>
            </div>

            <div className="mt-8 grid grid-cols-3 gap-4">
                <div className="bg-slate-800/20 border border-slate-700/30 rounded-lg p-4 text-center">
                    <div className="text-2xl mb-2">⚡</div>
                    <div className="text-sm text-slate-400">AI自动评估</div>
                </div>
                <div className="bg-slate-800/20 border border-slate-700/30 rounded-lg p-4 text-center">
                    <div className="text-2xl mb-2">📊</div>
                    <div className="text-sm text-slate-400">复杂度分析</div>
                </div>
                <div className="bg-slate-800/20 border border-slate-700/30 rounded-lg p-4 text-center">
                    <div className="text-2xl mb-2">💰</div>
                    <div className="text-sm text-slate-400">成本预估</div>
                </div>
            </div>
        </div>
    );
}

// ===== Step 2: 复杂度评估 =====
function ComplexityPage({ complexityScore, selectedEmployee, onNext }) {
    if (!complexityScore) {
        return (
            <div className="text-center py-20">
                <div className="text-6xl mb-4 pulse-anim">⚙️</div>
                <p className="text-xl text-slate-400">AI 正在分析复杂度...</p>
            </div>
        );
    }

    const estimatedCost = Math.round(selectedEmployee.price * (0.8 + complexityScore.overall * 0.4));
    const estimatedDays = Math.round(parseInt(selectedEmployee.period) * (0.9 + complexityScore.overall * 0.2));

    return (
        <div className="fade-in max-w-4xl mx-auto">
            <div className="text-center mb-8">
                <h2 className="text-3xl font-bold mb-2">复杂度评估报告</h2>
                <p className="text-slate-400">AI 已完成需求分析</p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8">
                {/* 综合评分 */}
                <div className="bg-gradient-to-br from-indigo-900/30 to-purple-900/30 border border-indigo-500/30 rounded-xl p-6">
                    <div className="text-center">
                        <div className="text-sm text-slate-400 mb-2">综合复杂度</div>
                        <div className="text-6xl font-bold text-indigo-400 mb-2">
                            {(complexityScore.overall * 100).toFixed(0)}
                        </div>
                        <div className="text-sm text-slate-500">满分100分</div>
                    </div>
                </div>

                {/* 维度评分 */}
                <div className="bg-slate-800/30 border border-slate-700/50 rounded-xl p-6">
                    <div className="space-y-4">
                        <ScoreBar label="技术复杂度" score={complexityScore.technical} />
                        <ScoreBar label="业务复杂度" score={complexityScore.business} />
                        <ScoreBar label="风险系数" score={complexityScore.risk} />
                    </div>
                </div>
            </div>

            {/* 成本预估 */}
            <div className="grid grid-cols-3 gap-4 mb-8">
                <div className="bg-slate-800/30 border border-slate-700/50 rounded-xl p-6 text-center">
                    <div className="text-3xl mb-2">💰</div>
                    <div className="text-2xl font-bold text-indigo-400 mb-1">¥{estimatedCost.toLocaleString()}</div>
                    <div className="text-sm text-slate-500">预估成本</div>
                </div>
                <div className="bg-slate-800/30 border border-slate-700/50 rounded-xl p-6 text-center">
                    <div className="text-3xl mb-2">⏱️</div>
                    <div className="text-2xl font-bold text-indigo-400 mb-1">{estimatedDays}天</div>
                    <div className="text-sm text-slate-500">预估工期</div>
                </div>
                <div className="bg-slate-800/30 border border-slate-700/50 rounded-xl p-6 text-center">
                    <div className="text-3xl mb-2">👥</div>
                    <div className="text-2xl font-bold text-indigo-400 mb-1">3人</div>
                    <div className="text-sm text-slate-500">团队规模</div>
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

function ScoreBar({ label, score }) {
    return (
        <div>
            <div className="flex justify-between text-sm mb-1">
                <span className="text-slate-400">{label}</span>
                <span className="text-indigo-400 font-semibold">{(score * 100).toFixed(0)}分</span>
            </div>
            <div className="h-2 bg-slate-700/50 rounded-full overflow-hidden">
                <div
                    className="h-full bg-gradient-to-r from-indigo-500 to-purple-500 transition-all duration-1000"
                    style={{ width: `${score * 100}%` }}
                />
            </div>
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

    const totalPrice = allAtoms
        .filter(a => selectedModules.includes(a.id))
        .reduce((sum, a) => sum + a.price, 0);

    const totalDays = allAtoms
        .filter(a => selectedModules.includes(a.id))
        .reduce((sum, a) => sum + a.days, 0);

    return (
        <div className="fade-in">
            <div className="text-center mb-8">
                <h2 className="text-3xl font-bold mb-2">工程任务拆解</h2>
                <p className="text-slate-400">系统自动拆解为标准化工程原子能力</p>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                <div className="lg:col-span-2 space-y-4">
                    {ENGINEERING_MODULES.map(module => {
                        const moduleSelected = module.atoms.filter(a => selectedModules.includes(a.id));
                        const modulePrice = moduleSelected.reduce((sum, a) => sum + a.price, 0);

                        return (
                            <div key={module.id} className="bg-slate-800/30 border border-slate-700/50 rounded-xl p-5">
                                <div className="flex items-center justify-between mb-4">
                                    <div>
                                        <h3 className="text-lg font-semibold text-slate-100">
                                            <span className="mr-2">{module.icon}</span>
                                            {module.name}
                                        </h3>
                                        <p className="text-sm text-slate-500 mt-1">
                                            已选 {moduleSelected.length}/{module.atoms.length} 项
                                        </p>
                                    </div>
                                    <div className="text-right">
                                        <div className="text-xl font-bold text-indigo-400">¥{modulePrice.toLocaleString()}</div>
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
                                                    className="w-4 h-4 accent-indigo-500"
                                                />
                                                <div>
                                                    <div className="text-sm font-medium text-slate-200">{atom.name}</div>
                                                    <div className="text-xs text-slate-500">
                                                        复杂度 {(atom.complexity * 100).toFixed(0)}% · {atom.days}天
                                                    </div>
                                                </div>
                                            </div>
                                            <div className="text-sm font-semibold text-indigo-400">
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
                        <h3 className="text-lg font-semibold mb-4">方案汇总</h3>

                        <div className="space-y-3 mb-6">
                            <div className="flex justify-between items-center">
                                <span className="text-slate-400">已选任务</span>
                                <span className="text-xl font-bold text-indigo-400">{selectedModules.length}</span>
                            </div>
                            <div className="flex justify-between items-center">
                                <span className="text-slate-400">总成本</span>
                                <span className="text-xl font-bold text-indigo-400">¥{totalPrice.toLocaleString()}</span>
                            </div>
                            <div className="flex justify-between items-center">
                                <span className="text-slate-400">总工期</span>
                                <span className="text-xl font-bold text-indigo-400">{Math.ceil(totalDays / 2)}天</span>
                            </div>
                        </div>

                        <div className="border-t border-slate-700/50 pt-4 mb-6">
                            <div className="text-sm text-slate-500 mb-2">补贴建议</div>
                            <div className="text-2xl font-bold text-green-400">
                                ¥{Math.round(totalPrice * 0.3).toLocaleString()}
                            </div>
                            <div className="text-xs text-slate-500 mt-1">按30%标准补贴</div>
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
