// ===== 数据层 =====
const DATA = {
    templates: [
        { icon: '🏠', name: '家装需求采集助手', desc: '对话式装修需求收集，自动分发设计师', price: '¥8,500' },
        { icon: '🎪', name: '展会报名助手', desc: '展会现场报名、资料采集、现场跟进', price: '¥5,200' },
        { icon: '📊', name: '销售线索筛选助手', desc: '智能筛选高意向客户，自动评分排序', price: '¥6,800' },
    ],
    modules: [
        {
            id: 'dialog', name: '对话采集模块', icon: '💬', atoms: [
                { id: 'prompt', name: 'Prompt 设计', price: 1000, complexity: 0.6, status: 'done', owner: 'AI设计师', time: '1.5天', progress: 100, tag: 'ai' },
                { id: 'fsm', name: '多轮对话状态机', price: 3000, complexity: 0.9, status: 'active', owner: '工程师-张宇', time: '3天', progress: 60, tag: 'eng' },
                { id: 'exception', name: '异常输入处理', price: 800, complexity: 0.5, status: 'pending', owner: '工程师-李明', time: '1天', progress: 0, tag: 'eng' },
            ]
        },
        {
            id: 'wechat', name: '微信接入模块', icon: '📱', atoms: [
                { id: 'wx_qr', name: '微信扫码接入', price: 1500, complexity: 0.7, status: 'done', owner: '工程师-王芳', time: '2天', progress: 100, tag: 'eng' },
                { id: 'wx_id', name: '用户身份识别', price: 600, complexity: 0.4, status: 'done', owner: '工程师-王芳', time: '0.5天', progress: 100, tag: 'eng' },
                { id: 'wx_session', name: '会话管理', price: 800, complexity: 0.5, status: 'active', owner: '工程师-陈磊', time: '1天', progress: 40, tag: 'eng' },
            ]
        },
        {
            id: 'data', name: '数据结构模块', icon: '🗃️', atoms: [
                { id: 'schema', name: '需求字段定义', price: 500, complexity: 0.3, status: 'done', owner: 'AI设计师', time: '0.5天', progress: 100, tag: 'data' },
                { id: 'storage', name: '数据存储结构', price: 700, complexity: 0.4, status: 'done', owner: '工程师-赵伟', time: '1天', progress: 100, tag: 'data' },
            ]
        },
        {
            id: 'dispatch', name: '分单调度模块', icon: '📋', atoms: [
                { id: 'rule', name: '设计师分配规则', price: 1200, complexity: 0.7, status: 'pending', owner: '工程师-刘洋', time: '1.5天', progress: 0, tag: 'eng' },
                { id: 'flow', name: '状态流转逻辑', price: 800, complexity: 0.5, status: 'pending', owner: '工程师-刘洋', time: '1天', progress: 0, tag: 'eng' },
            ]
        }
    ],
    conversations: [
        {
            trigger: '我想装修一个120平的房子',
            replies: [
                { role: 'bot', text: '您好！我是家装需求助手 🏠 很高兴帮您规划装修需求！\n\n您提到120平，请问是住宅还是商用空间呢？' },
                { role: 'user', text: '住宅，自己住的' },
                { role: 'bot', text: '好的！请问房子是新房还是二手房翻新？' },
                { role: 'user', text: '新房，刚拿到钥匙' },
                { role: 'bot', text: '恭喜您！🎉 新房装修更灵活。请问您对装修风格有偏好吗？\n\n① 现代简约  ② 北欧风  ③ 中式  ④ 欧式  ⑤ 其他' },
                { role: 'user', text: '现代简约' },
                { role: 'bot', text: '很好的选择！简约风格既实用又美观。\n\n请问您的装修预算大概在哪个范围？\n\n① 15万以内  ② 15-30万  ③ 30-50万  ④ 50万以上' },
                { role: 'user', text: '20万左右' },
                { role: 'bot', text: '明白了！我已为您生成需求结构化信息，正在匹配合适的设计师... ✅\n\n📋 需求已提交，将在2小时内有设计师与您联系！' },
            ],
            fields: [
                { icon: '📐', label: '面积', value: '120平方米', filled: true },
                { icon: '🏗️', label: '房型', value: '新房住宅', filled: true },
                { icon: '🎨', label: '风格', value: '现代简约', filled: true },
                { icon: '💰', label: '预算', value: '约20万元', filled: true },
                { icon: '📅', label: '工期', value: '未确认', filled: false },
                { icon: '📍', label: '地址', value: '未采集', filled: false },
            ]
        },
        {
            trigger: '我家客厅想改造一下',
            replies: [
                { role: 'bot', text: '您好！我来帮您规划客厅改造方案 🛋️\n\n请问您的客厅大约多少平方米？' },
                { role: 'user', text: '大概30平' },
                { role: 'bot', text: '30平的客厅空间不错！\n请问目前客厅存在哪些问题？\n\n① 采光不好  ② 储物不够  ③ 风格过时  ④ 空间布局不合理' },
                { role: 'user', text: '风格过时，想换个现代点的' },
                { role: 'bot', text: '了解！请问预算大概是多少？\n\n① 3万以内  ② 3-8万  ③ 8万以上' },
                { role: 'user', text: '5万左右' },
                { role: 'bot', text: '好的！根据您的需求，我为您匹配了3位擅长现代风客厅改造的设计师 🎨\n\n需求已记录，设计师将在1小时内联系您！' },
            ],
            fields: [
                { icon: '📐', label: '面积', value: '约30平方米', filled: true },
                { icon: '🏗️', label: '类型', value: '客厅改造', filled: true },
                { icon: '🎨', label: '需求', value: '现代风格翻新', filled: true },
                { icon: '💰', label: '预算', value: '约5万元', filled: true },
                { icon: '📅', label: '工期', value: '未确认', filled: false },
                { icon: '📍', label: '地址', value: '未采集', filled: false },
            ]
        }
    ]
};

// ===== 应用状态 =====
const state = {
    currentPage: 'home',
    chatHistory: [],
    selectedPreset: null,
    chatStep: 0,
    currentConversation: null,
    fieldsData: DATA.conversations[0].fields.map(f => ({ ...f, filled: false })),
    progressInterval: null,
    selectedAtoms: new Set(DATA.modules.flatMap(m => m.atoms).map(a => a.id)),
};

// ===== 路由 =====
function navigate(page) {
    state.currentPage = page;
    document.querySelectorAll('.nav-item').forEach(el => {
        el.classList.toggle('active', el.dataset.page === page);
    });
    renderPage(page);
}

// ===== 主渲染 =====
function renderPage(page) {
    const app = document.getElementById('app');
    app.innerHTML = '';
    app.className = '';
    const div = document.createElement('div');
    div.className = 'page active fade-in';
    div.id = `page-${page}`;
    switch (page) {
        case 'home': div.innerHTML = renderHome(); break;
        case 'decompose': div.innerHTML = renderDecompose(); break;
        case 'production': div.innerHTML = renderProduction(); break;
        case 'result': div.innerHTML = renderResult(); break;
        case 'gov': div.innerHTML = renderGov(); break;
    }
    app.appendChild(div);
    bindEvents(page);
}

// ===== 页面1：首页 =====
function renderHome() {
    return `
    <div class="home-hero">
        <div class="home-kv">Virtual Workforce Factory</div>
        <h1 class="home-title">像工业生产一样<br><span>制造虚拟员工</span></h1>
        <p class="home-subtitle">
            将软件开发拆解为标准化工程原子能力，<br>
            让每一笔投入可计价、可监管、可补贴
        </p>
        <div class="home-stats">
            <div class="stat-card">
                <div class="stat-num">23</div>
                <div class="stat-label">标准原子能力</div>
            </div>
            <div class="stat-card">
                <div class="stat-num">¥6,200</div>
                <div class="stat-label">平均项目成本</div>
            </div>
            <div class="stat-card">
                <div class="stat-num">12天</div>
                <div class="stat-label">平均交付周期</div>
            </div>
        </div>
        <div class="input-section">
            <label class="input-label">描述你想要的虚拟员工</label>
            <textarea class="main-input" id="mainInput" rows="3" placeholder="例如：我要一个家装需求采集助手，能通过微信对话收集客户信息，自动分发给设计师..."></textarea>
            <button class="btn-primary" id="btnGenerate">
                <span>⚙️</span> 开始生成虚拟员工
            </button>
        </div>
    </div>
    <div class="templates-section">
        <div class="templates-title">— 常用模板 —</div>
        <div class="templates-grid">
            ${DATA.templates.map((t, i) => `
            <div class="template-card" data-template="${i}">
                <div class="template-icon">${t.icon}</div>
                <div class="template-name">${t.name}</div>
                <div class="template-desc">${t.desc}</div>
                <div class="template-price">${t.price} 起</div>
            </div>`).join('')}
        </div>
    </div>`;
}

// ===== 生成过渡动画 =====
function showGenerating(callback) {
    const overlay = document.createElement('div');
    overlay.className = 'generating-overlay';
    const steps = [
        { text: '解析业务需求语义...', delay: 600 },
        { text: '匹配工程原子能力库...', delay: 1200 },
        { text: '计算复杂度系数...', delay: 1800 },
        { text: '生成工程拆解方案...', delay: 2400 },
        { text: '自动报价完成 ✓', delay: 2900 },
    ];
    overlay.innerHTML = `
    <div class="generating-box">
        <div class="generating-icon">⚙️</div>
        <div class="generating-title">正在生成工程方案</div>
        <div style="font-size:0.8rem;color:#64748b;">VirtuForge AI 分析引擎处理中</div>
        <div class="generating-steps" id="genSteps">
            ${steps.map((s, i) => `<div class="gen-step" id="step-${i}">
                <span class="gen-step-icon">⬜</span>
                <span>${s.text}</span>
            </div>`).join('')}
        </div>
        <div class="gen-progress"><div class="gen-progress-fill" id="genProg" style="width:0%"></div></div>
    </div>`;
    document.body.appendChild(overlay);
    steps.forEach((s, i) => {
        setTimeout(() => {
            const el = document.getElementById(`step-${i}`);
            if (el) {
                if (i > 0) {
                    const prev = document.getElementById(`step-${i-1}`);
                    if (prev) { prev.className = 'gen-step done'; prev.querySelector('.gen-step-icon').textContent = '✅'; }
                }
                el.className = 'gen-step active';
                el.querySelector('.gen-step-icon').textContent = '⚙️';
            }
            const prog = document.getElementById('genProg');
            if (prog) prog.style.width = `${((i+1)/steps.length)*100}%`;
        }, s.delay);
    });
    setTimeout(() => {
        document.body.removeChild(overlay);
        callback();
    }, 3200);
}

// ===== 页面2：工程拆解 =====
function renderDecompose() {
    const allAtoms = DATA.modules.flatMap(m => m.atoms);
    const selectedAtoms = allAtoms.filter(a => state.selectedAtoms.has(a.id));
    const totalPrice = selectedAtoms.reduce((s, a) => s + a.price, 0);
    const selectedCount = selectedAtoms.length;

    return `
    <div class="section-header">
        <span class="section-title">工程能力拆解方案</span>
        <span class="section-badge">家装需求采集助手</span>
    </div>
    <div class="decompose-layout">
        <!-- 左侧：业务需求树 -->
        <div class="card req-panel">
            <div class="req-title">业务需求</div>
            <div class="req-goal">目标：家装需求采集虚拟员工</div>
            <div class="req-tree">
                ${[
                    { icon: '💬', text: '对话采集客户需求', sub: '微信/小程序触达' },
                    { icon: '🔄', text: '自动结构化信息', sub: '字段提取 + JSON输出' },
                    { icon: '📋', text: '分单给设计师', sub: '规则分配 + 状态追踪' },
                    { icon: '📱', text: '微信触达客户', sub: '接入公众号/企微' },
                    { icon: '📊', text: '数据沉淀与分析', sub: '需求库 + 转化统计' },
                ].map((n, i) => `
                <div class="req-node ${i===0?'selected':''}" data-idx="${i}">
                    <span class="req-node-icon">${n.icon}</span>
                    <div>
                        <div class="req-node-text">${n.text}</div>
                        <div class="req-node-sub">${n.sub}</div>
                    </div>
                </div>`).join('')}
            </div>
        </div>

        <!-- 中间：工程原子拆解 -->
        <div class="card eng-panel">
            <div class="req-title">工程原子能力 <span style="color:#64748b;font-size:0.875rem;margin-left:0.5rem">(已选 ${selectedCount}/${allAtoms.length})</span></div>
            ${DATA.modules.map(m => `
            <div class="module-block">
                <div class="module-header">
                    <span class="module-name">${m.icon} ${m.name}</span>
                    <span class="module-count">${m.atoms.length} 个原子能力</span>
                </div>
                <div class="atom-list">
                    ${m.atoms.map(a => `
                    <div class="atom-item ${state.selectedAtoms.has(a.id) ? 'selected' : ''}" data-atom="${a.id}">
                        <input type="checkbox" class="atom-checkbox" data-atom-id="${a.id}" ${state.selectedAtoms.has(a.id) ? 'checked' : ''}>
                        <div class="atom-left">
                            <span class="atom-icon">${a.tag === 'ai' ? '🤖' : a.tag === 'data' ? '💾' : '⚙️'}</span>
                            <span class="atom-name">${a.name}</span>
                        </div>
                        <span class="atom-price">¥${a.price.toLocaleString()}</span>
                    </div>`).join('')}
                </div>
            </div>`).join('')}
        </div>

        <!-- 右侧：报价 -->
        <div class="quote-panel">
            <div class="card" style="margin-bottom:1rem">
                <div class="quote-total-card">
                    <div class="quote-total-label">项目总报价</div>
                    <div class="quote-total-num" id="totalPrice">¥${totalPrice.toLocaleString()}</div>
                    <div class="quote-total-sub">含税 · 交付周期 12 个工作日</div>
                </div>
                <div class="req-title">费用明细 <span style="color:#64748b;font-size:0.875rem">(${selectedCount} 项)</span></div>
                <div class="quote-items" id="quoteItems">
                    ${selectedAtoms.map(a => `
                    <div class="quote-item" data-atom-id="${a.id}">
                        <div class="quote-item-left">
                            <div class="quote-item-name">${a.name}</div>
                            <div class="quote-item-tag">复杂度 ${a.complexity}x</div>
                        </div>
                        <div class="quote-item-price">¥${a.price.toLocaleString()}</div>
                    </div>`).join('')}
                </div>
            </div>
            <div class="card" style="margin-bottom:1rem">
                <div class="complexity-title">模块复杂度分析</div>
                <div class="complexity-bar">
                    <span class="complexity-label">对话采集</span>
                    <div class="complexity-track"><div class="complexity-fill" style="width:85%"></div></div>
                    <span class="complexity-val">0.8</span>
                </div>
                <div class="complexity-bar">
                    <span class="complexity-label">微信接入</span>
                    <div class="complexity-track"><div class="complexity-fill" style="width:65%"></div></div>
                    <span class="complexity-val">0.6</span>
                </div>
                <div class="complexity-bar">
                    <span class="complexity-label">数据结构</span>
                    <div class="complexity-track"><div class="complexity-fill" style="width:40%"></div></div>
                    <span class="complexity-val">0.4</span>
                </div>
                <div class="complexity-bar">
                    <span class="complexity-label">分单调度</span>
                    <div class="complexity-track"><div class="complexity-fill" style="width:60%"></div></div>
                    <span class="complexity-val">0.6</span>
                </div>
            </div>
            <button class="btn-generate" id="btnStartProd">📋 确认方案，进入生产</button>
        </div>
    </div>`;
}

// 更新工程拆解页面的价格
function updateDecomposePrice() {
    const allAtoms = DATA.modules.flatMap(m => m.atoms);
    const selectedAtoms = allAtoms.filter(a => state.selectedAtoms.has(a.id));
    const totalPrice = selectedAtoms.reduce((s, a) => s + a.price, 0);

    // 更新总价
    const totalPriceEl = document.getElementById('totalPrice');
    if (totalPriceEl) {
        totalPriceEl.textContent = `¥${totalPrice.toLocaleString()}`;
    }

    // 更新费用明细
    const quoteItemsEl = document.getElementById('quoteItems');
    if (quoteItemsEl) {
        quoteItemsEl.innerHTML = selectedAtoms.map(a => `
            <div class="quote-item" data-atom-id="${a.id}">
                <div class="quote-item-left">
                    <div class="quote-item-name">${a.name}</div>
                    <div class="quote-item-tag">复杂度 ${a.complexity}x</div>
                </div>
                <div class="quote-item-price">¥${a.price.toLocaleString()}</div>
            </div>`).join('');
    }

    // 更新选中状态样式
    document.querySelectorAll('.atom-item').forEach(item => {
        const atomId = item.dataset.atom;
        if (state.selectedAtoms.has(atomId)) {
            item.classList.add('selected');
        } else {
            item.classList.remove('selected');
        }
    });

    // 更新标题中的计数
    const engPanel = document.querySelector('.eng-panel .req-title');
    if (engPanel) {
        engPanel.innerHTML = `工程原子能力 <span style="color:#64748b;font-size:0.875rem;margin-left:0.5rem">(已选 ${selectedAtoms.length}/${allAtoms.length})</span>`;
    }

    const quoteTitle = document.querySelector('.quote-panel .req-title');
    if (quoteTitle) {
        quoteTitle.innerHTML = `费用明细 <span style="color:#64748b;font-size:0.875rem">(${selectedAtoms.length} 项)</span>`;
    }
}

// ===== 页面3：生产看板 =====
function renderProduction() {
    const allAtoms = DATA.modules.flatMap(m => m.atoms);
    const done = allAtoms.filter(a => a.status === 'done');
    const active = allAtoms.filter(a => a.status === 'active');
    const pending = allAtoms.filter(a => a.status === 'pending');
    const progress = Math.round((done.length / allAtoms.length) * 100);

    return `
    <div class="section-header">
        <span class="section-title">生产看板</span>
        <span class="section-badge">家装需求采集助手 · 实时追踪</span>
        <div style="margin-left:auto;display:flex;gap:0.5rem">
            <span style="font-size:0.75rem;color:#22c55e;background:rgba(34,197,94,0.1);padding:4px 12px;border-radius:20px;border:1px solid rgba(34,197,94,0.2)">🟢 生产中</span>
        </div>
    </div>
    <div class="kanban-layout">
        <div class="kanban-top">
            <div class="kpi-card">
                <div class="kpi-val blue">${allAtoms.length}</div>
                <div class="kpi-label">原子能力总数</div>
            </div>
            <div class="kpi-card">
                <div class="kpi-val green">${done.length}</div>
                <div class="kpi-label">已完成任务</div>
            </div>
            <div class="kpi-card">
                <div class="kpi-val yellow">${active.length}</div>
                <div class="kpi-label">进行中任务</div>
            </div>
            <div class="progress-card">
                <div class="progress-header">
                    <span class="progress-title">总体进度</span>
                    <span class="progress-pct">${progress}%</span>
                </div>
                <div class="progress-bar">
                    <div class="progress-fill" id="mainProgress" style="width:0%"></div>
                </div>
                <div class="progress-stages">
                    <span class="stage-chip done">需求确认 ✓</span>
                    <span class="stage-chip done">工程设计 ✓</span>
                    <span class="stage-chip active">开发中 ●</span>
                    <span class="stage-chip">测试</span>
                    <span class="stage-chip">上线</span>
                </div>
            </div>
        </div>
        <div class="kanban-main">
            <div>
                <div class="kanban-col-header done">✅ 已完成 <span class="col-badge">${done.length}</span></div>
                ${done.map(a => renderTaskCard(a)).join('')}
            </div>
            <div>
                <div class="kanban-col-header active">⚙️ 进行中 <span class="col-badge">${active.length}</span></div>
                ${active.map(a => renderTaskCard(a)).join('')}
            </div>
            <div>
                <div class="kanban-col-header pending">⬜ 待开始 <span class="col-badge">${pending.length}</span></div>
                ${pending.map(a => renderTaskCard(a)).join('')}
            </div>
        </div>
    </div>`;
}

function renderTaskCard(a) {
    const tagNames = { ai: 'AI能力', eng: '工程', data: '数据' };
    return `
    <div class="task-card">
        <div class="task-top">
            <span class="task-name">${a.name}</span>
            <span class="task-tag ${a.tag}">${tagNames[a.tag]}</span>
        </div>
        <div class="task-meta">
            <span class="task-owner">👤 ${a.owner}</span>
            <span class="task-time">🕐 ${a.time}</span>
        </div>
        <div class="task-bar">
            <div class="task-fill ${a.status}" style="width:${a.progress}%"></div>
        </div>
        <div style="display:flex;justify-content:space-between;margin-top:4px">
            <span style="font-size:0.7rem;color:#475569">${a.progress}% 完成</span>
            <span style="font-size:0.7rem;color:#3b82f6">¥${a.price.toLocaleString()}</span>
        </div>
    </div>`;
}

// ===== 页面4：成果展示 =====
function renderResult() {
    const presets = [
        '我想装修一个120平的房子',
        '我家客厅想改造一下',
    ];
    const fields = state.fieldsData;

    return `
    <div class="section-header">
        <span class="section-title">成果展示</span>
        <span class="section-badge">家装需求采集助手 · 线上运行</span>
    </div>
    <div class="result-layout">
        <!-- 左侧：微信模拟器 -->
        <div class="wechat-simulator">
            <div class="wechat-header">
                <div class="wechat-avatar">🏠</div>
                <div>
                    <div class="wechat-name">家装助手</div>
                    <div class="wechat-sub">VirtuForge · 已认证服务号</div>
                </div>
            </div>
            <div class="wechat-messages" id="chatMessages">
                <div class="msg-time">今天 14:30</div>
                <div class="msg bot">
                    <div class="msg-avatar">🏠</div>
                    <div class="msg-bubble">您好！我是家装需求助手 🏠\n\n我可以帮您快速梳理装修需求，并匹配合适的设计师。请问您想了解什么？</div>
                </div>
            </div>
            <div class="wechat-input-area">
                <input class="wechat-input" id="chatInput" type="text" placeholder="输入消息...">
                <button class="wechat-send" id="chatSend">发送</button>
            </div>
        </div>

        <!-- 右侧：结果面板 -->
        <div class="result-right">
            <!-- 快速测试 -->
            <div class="card">
                <div class="req-title" style="margin-bottom:0.75rem">快速测试场景</div>
                <div class="demo-presets">
                    ${presets.map((p, i) => `
                    <button class="preset-btn" data-preset="${i}">▶ ${p}</button>`).join('')}
                </div>
            </div>

            <!-- 结构化字段提取 -->
            <div class="card">
                <div class="req-title" style="margin-bottom:0.75rem">🔍 实时字段提取</div>
                <div class="extract-fields" id="extractFields">
                    ${fields.map((f, i) => `
                    <div class="field-row ${f.filled ? 'filled' : ''}" id="field-${i}">
                        <span class="field-icon">${f.icon}</span>
                        <span class="field-label">${f.label}</span>
                        <span class="field-value">${f.filled ? f.value : '—'}</span>
                        ${f.filled ? '<span class="field-check">✓</span>' : ''}
                    </div>`).join('')}
                </div>
            </div>

            <!-- JSON输出 -->
            <div class="json-card" id="jsonOutput" style="opacity:0.3">
                <div class="json-header">
                    <span class="json-title">📦 结构化输出 JSON</span>
                    <span class="json-status" id="jsonStatus">等待数据</span>
                </div>
                <div class="json-body" id="jsonBody">
                    <span style="color:#475569">// 完成对话后生成</span>
                </div>
            </div>
        </div>
    </div>`;
}

// ===== 页面5：政府监管 =====
function renderGov() {
    return `
    <div class="section-header">
        <span class="section-title">政府监管视角</span>
        <span class="section-badge">补贴管理 · 能力核验 · 项目审计</span>
    </div>
    <div class="gov-layout">
        <div class="gov-top">
            <div class="gov-kpi">
                <div class="gov-kpi-num" style="color:#3b82f6">12</div>
                <div class="gov-kpi-label">已备案项目</div>
                <div class="gov-kpi-change up">↑ 3 本月新增</div>
            </div>
            <div class="gov-kpi">
                <div class="gov-kpi-num" style="color:#22c55e">¥86,500</div>
                <div class="gov-kpi-label">已发放补贴</div>
                <div class="gov-kpi-change up">↑ ¥12,000 本月</div>
            </div>
            <div class="gov-kpi">
                <div class="gov-kpi-num" style="color:#f59e0b">96%</div>
                <div class="gov-kpi-label">能力核验通过率</div>
                <div class="gov-kpi-change up">↑ 4% 较上期</div>
            </div>
            <div class="gov-kpi">
                <div class="gov-kpi-num" style="color:#a78bfa">8</div>
                <div class="gov-kpi-label">受益创业企业</div>
                <div class="gov-kpi-change up">↑ 2 本月新增</div>
            </div>
        </div>
        <div class="gov-main">
            <!-- 左侧：补贴清单 -->
            <div>
                <div class="req-title" style="margin-bottom:0.75rem">📋 补贴发放明细</div>
                <div class="subsidy-list">
                    ${[
                        {
                            company: '家装速配（张伟团队）',
                            amount: '¥5,100',
                            modules: ['对话采集能力', '微信接入能力', '数据结构能力'],
                            status: '✅ 已核验发放',
                            date: '2026-04-18'
                        },
                        {
                            company: '展一会（王思慧）',
                            amount: '¥3,120',
                            modules: ['表单采集能力', '身份识别能力'],
                            status: '✅ 已核验发放',
                            date: '2026-04-12'
                        },
                        {
                            company: '锐客销售（陈海团队）',
                            amount: '¥4,080',
                            modules: ['线索评分能力', '对话采集能力', '分配调度能力'],
                            status: '🔄 审核中',
                            date: '2026-04-22'
                        },
                    ].map(s => `
                    <div class="subsidy-item">
                        <div class="subsidy-top">
                            <span class="subsidy-company">${s.company}</span>
                            <span class="subsidy-amount">${s.amount}</span>
                        </div>
                        <div class="subsidy-modules">
                            ${s.modules.map(m => `<span class="subsidy-module">${m}</span>`).join('')}
                        </div>
                        <div class="subsidy-bottom">
                            <span class="subsidy-status">${s.status}</span>
                            <span class="subsidy-date">${s.date}</span>
                        </div>
                    </div>`).join('')}
                </div>
            </div>

            <!-- 右侧 -->
            <div style="display:flex;flex-direction:column;gap:1.5rem">
                <!-- 能力使用统计 -->
                <div class="card">
                    <div class="req-title" style="margin-bottom:0.75rem">🏭 原子能力使用统计</div>
                    <div class="capability-list">
                        ${[
                            { icon: '💬', name: '对话采集能力', count: '9 次', pct: 90 },
                            { icon: '📱', name: '微信接入能力', count: '7 次', pct: 70 },
                            { icon: '💾', name: '数据结构能力', count: '11 次', pct: 100 },
                            { icon: '🔄', name: '状态机开发能力', count: '6 次', pct: 60 },
                            { icon: '📋', name: '分配调度能力', count: '5 次', pct: 50 },
                            { icon: '🤖', name: 'Prompt 设计能力', count: '12 次', pct: 100 },
                        ].map(c => `
                        <div class="capability-row">
                            <span class="cap-icon">${c.icon}</span>
                            <span class="cap-name">${c.name}</span>
                            <span class="cap-count">${c.count}</span>
                            <div class="cap-bar-wrap"><div class="cap-bar" style="width:${c.pct}%"></div></div>
                        </div>`).join('')}
                    </div>
                </div>

                <!-- 审计追踪 -->
                <div class="card">
                    <div class="req-title" style="margin-bottom:0.75rem">🔍 链上审计记录</div>
                    <table class="audit-table">
                        <thead>
                            <tr>
                                <th>能力模块</th>
                                <th>完成凭证</th>
                                <th>补贴金额</th>
                                <th>状态</th>
                            </tr>
                        </thead>
                        <tbody>
                            ${[
                                ['对话采集模块', 'TXN#20240418-001', '¥2,400', '✅'],
                                ['微信接入模块', 'TXN#20240418-002', '¥1,500', '✅'],
                                ['数据结构模块', 'TXN#20240418-003', '¥600', '✅'],
                                ['分单调度模块', 'TXN#20240422-004', '¥1,200', '⏳'],
                            ].map(([name, txn, amt, status]) => `
                            <tr>
                                <td>${name}</td>
                                <td style="font-family:monospace;font-size:0.75rem;color:#475569">${txn}</td>
                                <td class="audit-amount">${amt}</td>
                                <td class="audit-verified">${status}</td>
                            </tr>`).join('')}
                        </tbody>
                    </table>
                </div>
            </div>
        </div>
    </div>`;
}

// ===== 事件绑定 =====
function bindEvents(page) {
    // 导航
    document.querySelectorAll('.nav-item').forEach(el => {
        el.addEventListener('click', (e) => {
            e.preventDefault();
            navigate(el.dataset.page);
        });
    });

    if (page === 'home') {
        // 生成按钮
        document.getElementById('btnGenerate')?.addEventListener('click', () => {
            const val = document.getElementById('mainInput').value.trim();
            if (!val) {
                document.getElementById('mainInput').focus();
                document.getElementById('mainInput').style.borderColor = '#ef4444';
                setTimeout(() => { document.getElementById('mainInput').style.borderColor = ''; }, 2000);
                return;
            }
            showGenerating(() => navigate('decompose'));
        });

        // 模板点击
        document.querySelectorAll('.template-card').forEach(el => {
            el.addEventListener('click', () => {
                const t = DATA.templates[el.dataset.template];
                document.getElementById('mainInput').value = `我要一个${t.name}，${t.desc}`;
                document.getElementById('mainInput').focus();
            });
        });
    }

    if (page === 'decompose') {
        document.getElementById('btnStartProd')?.addEventListener('click', () => {
            showGenerating(() => navigate('production'));
        });
        document.querySelectorAll('.req-node').forEach(el => {
            el.addEventListener('click', () => {
                document.querySelectorAll('.req-node').forEach(n => n.classList.remove('selected'));
                el.classList.add('selected');
            });
        });

        // 复选框事件监听
        document.querySelectorAll('.atom-checkbox').forEach(checkbox => {
            checkbox.addEventListener('change', (e) => {
                const atomId = e.target.dataset.atomId;
                if (e.target.checked) {
                    state.selectedAtoms.add(atomId);
                } else {
                    state.selectedAtoms.delete(atomId);
                }
                updateDecomposePrice();
            });
        });
    }

    if (page === 'production') {
        // 进度条动画
        setTimeout(() => {
            const el = document.getElementById('mainProgress');
            if (el) el.style.width = '65%';
        }, 200);
    }

    if (page === 'result') {
        // 预设消息
        document.querySelectorAll('.preset-btn').forEach(el => {
            el.addEventListener('click', () => {
                const idx = parseInt(el.dataset.preset);
                startConversation(idx);
            });
        });

        // 发送按钮
        document.getElementById('chatSend')?.addEventListener('click', sendUserMessage);
        document.getElementById('chatInput')?.addEventListener('keydown', (e) => {
            if (e.key === 'Enter') sendUserMessage();
        });
    }
}

// ===== 聊天逻辑 =====
function startConversation(idx) {
    state.currentConversation = idx;
    state.chatStep = 0;
    state.fieldsData = DATA.conversations[idx].fields.map(f => ({ ...f, filled: false }));

    const messages = document.getElementById('chatMessages');
    if (!messages) return;

    // 清空消息
    messages.innerHTML = `<div class="msg-time">今天 ${new Date().toTimeString().slice(0,5)}</div>`;

    const conv = DATA.conversations[idx];
    const userMsg = conv.trigger;

    // 先显示用户消息
    appendMessage('user', userMsg);
    document.getElementById('chatInput').value = '';

    // 逐步回复
    let step = 0;
    const playNext = () => {
        if (step >= conv.replies.length) {
            // 对话结束，显示JSON
            showJsonOutput(idx);
            return;
        }
        const r = conv.replies[step];
        setTimeout(() => {
            appendMessage(r.role, r.text);
            // 更新字段
            const filled = Math.floor((step / conv.replies.length) * conv.fields.length);
            updateFields(idx, filled);
            step++;
            if (step < conv.replies.length) {
                setTimeout(playNext, 1000 + Math.random() * 600);
            } else {
                setTimeout(() => {
                    updateFields(idx, conv.fields.filter(f => f.filled).length);
                    showJsonOutput(idx);
                }, 600);
            }
        }, 600);
    };
    setTimeout(playNext, 400);
}

function appendMessage(role, text) {
    const messages = document.getElementById('chatMessages');
    if (!messages) return;
    const div = document.createElement('div');
    div.className = `msg ${role}`;
    const avatarContent = role === 'bot' ? '🏠' : '我';
    div.innerHTML = `
        <div class="msg-avatar">${avatarContent}</div>
        <div class="msg-bubble">${text.replace(/\n/g, '<br>')}</div>`;
    messages.appendChild(div);
    messages.scrollTop = messages.scrollHeight;
}

function sendUserMessage() {
    const input = document.getElementById('chatInput');
    if (!input) return;
    const val = input.value.trim();
    if (!val) return;
    input.value = '';
    appendMessage('user', val);

    // 如果没有活跃对话，先匹配
    if (state.currentConversation === null) {
        setTimeout(() => {
            appendMessage('bot', '您好！我是家装需求助手 🏠\n\n点击左侧"快速测试场景"可以体验完整对话流程，或者请描述您的装修需求～');
        }, 600);
        return;
    }

    const conv = DATA.conversations[state.currentConversation];
    if (state.chatStep < conv.replies.length) {
        const r = conv.replies[state.chatStep];
        setTimeout(() => {
            appendMessage(r.role, r.text);
            state.chatStep++;
            const filled = Math.floor((state.chatStep / conv.replies.length) * conv.fields.filter(f => f.filled).length);
            updateFields(state.currentConversation, state.chatStep);
        }, 700);
    }
}

function updateFields(convIdx, step) {
    const fields = DATA.conversations[convIdx].fields;
    const filledCount = Math.min(step, fields.length);
    state.fieldsData = fields.map((f, i) => ({ ...f, filled: i < filledCount }));

    const container = document.getElementById('extractFields');
    if (!container) return;
    container.innerHTML = state.fieldsData.map((f, i) => `
    <div class="field-row ${f.filled ? 'filled' : ''}" id="field-${i}">
        <span class="field-icon">${f.icon}</span>
        <span class="field-label">${f.label}</span>
        <span class="field-value">${f.filled ? f.value : '—'}</span>
        ${f.filled ? '<span class="field-check">✓</span>' : ''}
    </div>`).join('');
}

function showJsonOutput(idx) {
    const conv = DATA.conversations[idx];
    const filledFields = conv.fields.filter(f => f.filled);

    const jsonObj = {
        request_id: `REQ_${Date.now()}`,
        created_at: new Date().toISOString().replace('T', ' ').slice(0, 19),
        source: 'wechat_official_account',
        status: 'pending_match',
        client_info: {
            space_size: filledFields.find(f => f.label === '面积')?.value || null,
            house_type: filledFields.find(f => f.label === '房型' || f.label === '类型')?.value || null,
            style_pref: filledFields.find(f => f.label === '风格' || f.label === '需求')?.value || null,
            budget: filledFields.find(f => f.label === '预算')?.value || null,
        },
        matched_designers: 3,
        next_action: 'designer_contact'
    };

    const el = document.getElementById('jsonOutput');
    const body = document.getElementById('jsonBody');
    const status = document.getElementById('jsonStatus');
    if (!el || !body || !status) return;

    el.style.opacity = '1';
    el.style.borderColor = 'rgba(34,197,94,0.3)';
    status.textContent = '✓ 已生成';

    const jsonStr = JSON.stringify(jsonObj, null, 2);
    body.innerHTML = jsonStr
        .replace(/"([^"]+)":/g, '<span class="json-key">"$1"</span>:')
        .replace(/: "([^"]+)"/g, ': <span class="json-str">"$1"</span>')
        .replace(/: (\d+)/g, ': <span class="json-num">$1</span>')
        .replace(/: (null)/g, ': <span class="json-null">$1</span>');
}

// ===== 初始化 =====
document.addEventListener('DOMContentLoaded', () => {
    renderPage('home');
});
