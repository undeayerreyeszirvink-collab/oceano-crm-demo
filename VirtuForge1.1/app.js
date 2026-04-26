// ===== 数据层 =====
const DATA = {
    templates: [
        { icon: '🏠', name: '家装需求采集助手', desc: '对话式装修需求收集，自动分发设计师', price: '¥8,500', category: 'sales' },
        { icon: '🎪', name: '展会报名助手', desc: '展会现场报名、资料采集、现场跟进', price: '¥5,200', category: 'sales' },
        { icon: '📊', name: '销售线索筛选助手', desc: '智能筛选高意向客户，自动评分排序', price: '¥6,800', category: 'sales' },
        { icon: '📞', name: '客服自动应答', desc: '7x24小时智能客服，多轮对话理解', price: '¥7,200', category: 'service' },
        { icon: '📝', name: '合同审核助手', desc: 'AI法务审核，风险条款识别', price: '¥9,500', category: 'legal' },
        { icon: '💼', name: '招聘筛选助手', desc: '简历智能筛选，候选人评分排序', price: '¥6,000', category: 'hr' },
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
        },
        {
            id: 'analytics', name: '数据分析模块', icon: '📈', atoms: [
                { id: 'dashboard', name: '数据看板', price: 2000, complexity: 0.8, status: 'pending', owner: '工程师-周杰', time: '2.5天', progress: 0, tag: 'eng' },
                { id: 'export', name: '数据导出', price: 600, complexity: 0.3, status: 'pending', owner: '工程师-周杰', time: '0.5天', progress: 0, tag: 'eng' },
            ]
        }
    ],
    projectStats: {
        totalProjects: 156,
        activeProjects: 23,
        completedProjects: 133,
        totalRevenue: 1245000,
        avgDeliveryDays: 11.5,
        customerSatisfaction: 4.8
    }
};

// ===== 应用状态 =====
const state = {
    currentPage: 'home',
    selectedAtoms: new Set(DATA.modules.flatMap(m => m.atoms).map(a => a.id)),
    selectedTemplate: null,
    filterCategory: 'all',
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
        case 'builder': div.innerHTML = renderBuilder(); break;
        case 'decompose': div.innerHTML = renderDecompose(); break;
        case 'production': div.innerHTML = renderProduction(); break;
        case 'result': div.innerHTML = renderResult(); break;
        case 'analytics': div.innerHTML = renderAnalytics(); break;
    }
    app.appendChild(div);
    bindEvents(page);
}

// ===== 页面1：首页 =====
function renderHome() {
    return `
    <div class="home-hero">
        <div class="home-kv">Virtual Workforce Factory 2.0</div>
        <h1 class="home-title">像工业生产一样<br><span>智造虚拟员工</span></h1>
        <p class="home-subtitle">
            AI驱动的标准化工程能力平台<br>
            让每一笔投入可计价、可监管、可补贴
        </p>
        <div class="home-stats">
            <div class="stat-card">
                <div class="stat-icon">🎯</div>
                <div class="stat-num">${DATA.projectStats.totalProjects}</div>
                <div class="stat-label">累计项目</div>
            </div>
            <div class="stat-card">
                <div class="stat-icon">⚡</div>
                <div class="stat-num">${DATA.projectStats.activeProjects}</div>
                <div class="stat-label">进行中</div>
            </div>
            <div class="stat-card">
                <div class="stat-icon">💰</div>
                <div class="stat-num">¥${(DATA.projectStats.totalRevenue/10000).toFixed(0)}万</div>
                <div class="stat-label">总交易额</div>
            </div>
            <div class="stat-card">
                <div class="stat-icon">⭐</div>
                <div class="stat-num">${DATA.projectStats.customerSatisfaction}</div>
                <div class="stat-label">客户满意度</div>
            </div>
        </div>
        <div class="input-section">
            <label class="input-label">描述你想要的虚拟员工</label>
            <textarea class="main-input" id="mainInput" rows="3" placeholder="例如：我要一个家装需求采集助手，能通过微信对话收集客户信息，自动分发给设计师..."></textarea>
            <button class="btn-primary" id="btnGenerate">
                <span>⚡</span> AI 智能生成方案
            </button>
        </div>
    </div>
    <div class="templates-section">
        <div class="templates-header">
            <div class="templates-title">— 行业模板库 —</div>
            <div class="filter-tabs">
                <button class="filter-tab ${state.filterCategory === 'all' ? 'active' : ''}" data-category="all">全部</button>
                <button class="filter-tab ${state.filterCategory === 'sales' ? 'active' : ''}" data-category="sales">销售</button>
                <button class="filter-tab ${state.filterCategory === 'service' ? 'active' : ''}" data-category="service">客服</button>
                <button class="filter-tab ${state.filterCategory === 'hr' ? 'active' : ''}" data-category="hr">人力</button>
                <button class="filter-tab ${state.filterCategory === 'legal' ? 'active' : ''}" data-category="legal">法务</button>
            </div>
        </div>
        <div class="templates-grid">
            ${DATA.templates.filter(t => state.filterCategory === 'all' || t.category === state.filterCategory).map((t, i) => `
            <div class="template-card" data-template="${i}">
                <div class="template-icon">${t.icon}</div>
                <div class="template-name">${t.name}</div>
                <div class="template-desc">${t.desc}</div>
                <div class="template-footer">
                    <div class="template-price">${t.price} 起</div>
                    <button class="template-btn">立即使用</button>
                </div>
            </div>`).join('')}
        </div>
    </div>`;
}

// ===== 页面2：智能构建器 =====
function renderBuilder() {
    return `
    <div class="section-header">
        <span class="section-title">⚡ AI 智能构建器</span>
        <span class="section-badge">Beta</span>
    </div>
    <div class="builder-layout">
        <div class="builder-left">
            <div class="card">
                <div class="builder-step">
                    <div class="step-header">
                        <span class="step-num">1</span>
                        <span class="step-title">选择行业场景</span>
                    </div>
                    <div class="scenario-grid">
                        ${['销售获客', '客户服务', '人力资源', '法务合规', '财务管理', '供应链'].map((s, i) => `
                        <div class="scenario-item ${i === 0 ? 'selected' : ''}" data-scenario="${i}">
                            <span class="scenario-icon">${['🎯', '💬', '👥', '⚖️', '💰', '📦'][i]}</span>
                            <span class="scenario-name">${s}</span>
                        </div>`).join('')}
                    </div>
                </div>
                <div class="builder-step">
                    <div class="step-header">
                        <span class="step-num">2</span>
                        <span class="step-title">配置核心能力</span>
                    </div>
                    <div class="capability-list">
                        ${['对话理解', '信息提取', '自动分类', '智能推荐', '数据分析'].map((c, i) => `
                        <label class="capability-item">
                            <input type="checkbox" ${i < 3 ? 'checked' : ''}>
                            <span class="capability-name">${c}</span>
                            <span class="capability-price">+¥${[1200, 800, 600, 1000, 1500][i]}</span>
                        </label>`).join('')}
                    </div>
                </div>
                <div class="builder-step">
                    <div class="step-header">
                        <span class="step-num">3</span>
                        <span class="step-title">选择接入渠道</span>
                    </div>
                    <div class="channel-grid">
                        ${['微信', '企微', 'Web', 'APP', '小程序'].map((ch, i) => `
                        <label class="channel-item">
                            <input type="checkbox" ${i < 2 ? 'checked' : ''}>
                            <span class="channel-icon">${['💬', '👔', '🌐', '📱', '📲'][i]}</span>
                            <span class="channel-name">${ch}</span>
                        </label>`).join('')}
                    </div>
                </div>
            </div>
        </div>
        <div class="builder-right">
            <div class="card">
                <div class="preview-title">实时预览</div>
                <div class="preview-box">
                    <div class="preview-header">
                        <span class="preview-icon">🎯</span>
                        <span class="preview-name">销售获客助手</span>
                    </div>
                    <div class="preview-features">
                        <div class="preview-feature">✓ 对话理解</div>
                        <div class="preview-feature">✓ 信息提取</div>
                        <div class="preview-feature">✓ 自动分类</div>
                    </div>
                    <div class="preview-channels">
                        <span class="preview-channel">💬 微信</span>
                        <span class="preview-channel">👔 企微</span>
                    </div>
                </div>
                <div class="preview-price">
                    <div class="preview-price-label">预估价格</div>
                    <div class="preview-price-num">¥8,600</div>
                    <div class="preview-price-sub">交付周期 10-12 个工作日</div>
                </div>
                <button class="btn-generate">生成工程方案</button>
            </div>
        </div>
    </div>`;
}

// ===== 页面3：工程拆解 =====
function renderDecompose() {
    const allAtoms = DATA.modules.flatMap(m => m.atoms);
    const selectedAtoms = allAtoms.filter(a => state.selectedAtoms.has(a.id));
    const totalPrice = selectedAtoms.reduce((s, a) => s + a.price, 0);
    const selectedCount = selectedAtoms.length;

    return `
    <div class="section-header">
        <span class="section-title">工程能力拆解方案</span>
        <span class="section-badge">家装需求采集助手</span>
        <div style="margin-left:auto">
            <button class="btn-secondary" id="btnSelectAll">全选</button>
            <button class="btn-secondary" id="btnDeselectAll">清空</button>
        </div>
    </div>
    <div class="decompose-layout">
        <div class="card eng-panel">
            <div class="req-title">工程原子能力 <span style="color:#64748b;font-size:0.875rem;margin-left:0.5rem">(已选 ${selectedCount}/${allAtoms.length})</span></div>
            ${DATA.modules.map(m => {
                const moduleAtoms = m.atoms;
                const selectedModuleAtoms = moduleAtoms.filter(a => state.selectedAtoms.has(a.id));
                const modulePrice = selectedModuleAtoms.reduce((s, a) => s + a.price, 0);
                return `
            <div class="module-block">
                <div class="module-header">
                    <div>
                        <span class="module-name">${m.icon} ${m.name}</span>
                        <span class="module-count">${selectedModuleAtoms.length}/${moduleAtoms.length} 个原子能力</span>
                    </div>
                    <span class="module-price">¥${modulePrice.toLocaleString()}</span>
                </div>
                <div class="atom-list">
                    ${moduleAtoms.map(a => `
                    <div class="atom-item ${state.selectedAtoms.has(a.id) ? 'selected' : ''}" data-atom="${a.id}">
                        <input type="checkbox" class="atom-checkbox" data-atom-id="${a.id}" ${state.selectedAtoms.has(a.id) ? 'checked' : ''}>
                        <div class="atom-left">
                            <span class="atom-icon">${a.tag === 'ai' ? '🤖' : a.tag === 'data' ? '💾' : '⚙️'}</span>
                            <span class="atom-name">${a.name}</span>
                            <span class="atom-meta">复杂度 ${a.complexity}x · ${a.time}</span>
                        </div>
                        <span class="atom-price">¥${a.price.toLocaleString()}</span>
                    </div>`).join('')}
                </div>
            </div>`;
            }).join('')}
        </div>

        <div class="quote-panel">
            <div class="card">
                <div class="quote-total-card">
                    <div class="quote-total-label">项目总报价</div>
                    <div class="quote-total-num" id="totalPrice">¥${totalPrice.toLocaleString()}</div>
                    <div class="quote-total-sub">含税 · 交付周期 ${Math.ceil(selectedAtoms.reduce((s, a) => s + parseFloat(a.time), 0) / 2)} 个工作日</div>
                </div>
                <div class="quote-breakdown">
                    <div class="breakdown-title">费用构成</div>
                    <div class="breakdown-item">
                        <span>AI 能力开发</span>
                        <span>¥${selectedAtoms.filter(a => a.tag === 'ai').reduce((s, a) => s + a.price, 0).toLocaleString()}</span>
                    </div>
                    <div class="breakdown-item">
                        <span>工程实现</span>
                        <span>¥${selectedAtoms.filter(a => a.tag === 'eng').reduce((s, a) => s + a.price, 0).toLocaleString()}</span>
                    </div>
                    <div class="breakdown-item">
                        <span>数据结构</span>
                        <span>¥${selectedAtoms.filter(a => a.tag === 'data').reduce((s, a) => s + a.price, 0).toLocaleString()}</span>
                    </div>
                </div>
                <button class="btn-generate" id="btnStartProd">确认方案，进入生产</button>
            </div>
        </div>
    </div>`;
}

// ===== 页面4：生产看板 =====
function renderProduction() {
    const allAtoms = DATA.modules.flatMap(m => m.atoms);
    const done = allAtoms.filter(a => a.status === 'done');
    const active = allAtoms.filter(a => a.status === 'active');
    const progress = Math.round((done.length / allAtoms.length) * 100);

    return `
    <div class="section-header">
        <span class="section-title">生产看板</span>
        <span class="section-badge">实时追踪</span>
    </div>
    <div class="production-layout">
        <div class="kpi-row">
            <div class="kpi-card">
                <div class="kpi-icon">📦</div>
                <div class="kpi-val">${allAtoms.length}</div>
                <div class="kpi-label">总任务数</div>
            </div>
            <div class="kpi-card">
                <div class="kpi-icon">✅</div>
                <div class="kpi-val green">${done.length}</div>
                <div class="kpi-label">已完成</div>
            </div>
            <div class="kpi-card">
                <div class="kpi-icon">⚡</div>
                <div class="kpi-val yellow">${active.length}</div>
                <div class="kpi-label">进行中</div>
            </div>
            <div class="kpi-card">
                <div class="kpi-icon">📊</div>
                <div class="kpi-val">${progress}%</div>
                <div class="kpi-label">总体进度</div>
            </div>
        </div>
        <div class="task-board">
            ${DATA.modules.map(m => `
            <div class="card module-card">
                <div class="module-card-header">
                    <span>${m.icon} ${m.name}</span>
                    <span class="module-progress">${m.atoms.filter(a => a.status === 'done').length}/${m.atoms.length}</span>
                </div>
                <div class="task-list">
                    ${m.atoms.map(a => `
                    <div class="task-item status-${a.status}">
                        <div class="task-info">
                            <div class="task-name">${a.name}</div>
                            <div class="task-meta">${a.owner} · ${a.time}</div>
                        </div>
                        <div class="task-status">
                            <span class="status-badge ${a.status}">${a.status === 'done' ? '已完成' : a.status === 'active' ? '进行中' : '待开始'}</span>
                        </div>
                    </div>`).join('')}
                </div>
            </div>`).join('')}
        </div>
    </div>`;
}

// ===== 页面5：成果展示 =====
function renderResult() {
    return `
    <div class="section-header">
        <span class="section-title">成果展示</span>
        <span class="section-badge">家装需求采集助手</span>
    </div>
    <div class="result-layout">
        <div class="card">
            <div class="result-title">🎉 虚拟员工已就绪</div>
            <div class="result-desc">您的家装需求采集助手已完成开发，可以开始工作了！</div>
            <div class="result-actions">
                <button class="btn-primary">立即体验</button>
                <button class="btn-secondary">查看文档</button>
                <button class="btn-secondary">下载部署包</button>
            </div>
        </div>
    </div>`;
}

// ===== 页面6：数据分析 =====
function renderAnalytics() {
    return `
    <div class="section-header">
        <span class="section-title">数据分析</span>
        <span class="section-badge">平台概览</span>
    </div>
    <div class="analytics-layout">
        <div class="analytics-row">
            <div class="card analytics-card">
                <div class="analytics-title">项目统计</div>
                <div class="analytics-chart">
                    <div class="chart-bar" style="height: 60%"><span>156</span></div>
                    <div class="chart-bar" style="height: 80%"><span>203</span></div>
                    <div class="chart-bar" style="height: 45%"><span>142</span></div>
                    <div class="chart-bar" style="height: 90%"><span>278</span></div>
                </div>
                <div class="analytics-labels">
                    <span>Q1</span><span>Q2</span><span>Q3</span><span>Q4</span>
                </div>
            </div>
            <div class="card analytics-card">
                <div class="analytics-title">收入趋势</div>
                <div class="analytics-value">¥124.5万</div>
                <div class="analytics-trend">↑ 23.5% 较上季度</div>
            </div>
        </div>
    </div>`;
}

// 更新工程拆解页面的价格
function updateDecomposePrice() {
    const allAtoms = DATA.modules.flatMap(m => m.atoms);
    const selectedAtoms = allAtoms.filter(a => state.selectedAtoms.has(a.id));
    const totalPrice = selectedAtoms.reduce((s, a) => s + a.price, 0);

    const totalPriceEl = document.getElementById('totalPrice');
    if (totalPriceEl) {
        totalPriceEl.textContent = `¥${totalPrice.toLocaleString()}`;
    }

    document.querySelectorAll('.atom-item').forEach(item => {
        const atomId = item.dataset.atom;
        if (state.selectedAtoms.has(atomId)) {
            item.classList.add('selected');
        } else {
            item.classList.remove('selected');
        }
    });

    // 更新模块价格
    DATA.modules.forEach(m => {
        const moduleAtoms = m.atoms;
        const selectedModuleAtoms = moduleAtoms.filter(a => state.selectedAtoms.has(a.id));
        const modulePrice = selectedModuleAtoms.reduce((s, a) => s + a.price, 0);
        const modulePriceEl = document.querySelector(`[data-module="${m.id}"] .module-price`);
        if (modulePriceEl) {
            modulePriceEl.textContent = `¥${modulePrice.toLocaleString()}`;
        }
    });

    // 更新费用构成
    const aiPrice = selectedAtoms.filter(a => a.tag === 'ai').reduce((s, a) => s + a.price, 0);
    const engPrice = selectedAtoms.filter(a => a.tag === 'eng').reduce((s, a) => s + a.price, 0);
    const dataPrice = selectedAtoms.filter(a => a.tag === 'data').reduce((s, a) => s + a.price, 0);

    const breakdownItems = document.querySelectorAll('.breakdown-item span:last-child');
    if (breakdownItems.length >= 3) {
        breakdownItems[0].textContent = `¥${aiPrice.toLocaleString()}`;
        breakdownItems[1].textContent = `¥${engPrice.toLocaleString()}`;
        breakdownItems[2].textContent = `¥${dataPrice.toLocaleString()}`;
    }

    const engPanel = document.querySelector('.eng-panel .req-title');
    if (engPanel) {
        engPanel.innerHTML = `工程原子能力 <span style="color:#64748b;font-size:0.875rem;margin-left:0.5rem">(已选 ${selectedAtoms.length}/${allAtoms.length})</span>`;
    }
}

// ===== 事件绑定 =====
function bindEvents(page) {
    document.querySelectorAll('.nav-item').forEach(el => {
        el.addEventListener('click', (e) => {
            e.preventDefault();
            navigate(el.dataset.page);
        });
    });

    if (page === 'home') {
        document.getElementById('btnGenerate')?.addEventListener('click', () => {
            navigate('builder');
        });

        document.querySelectorAll('.template-card').forEach(el => {
            el.addEventListener('click', () => {
                navigate('decompose');
            });
        });

        document.querySelectorAll('.filter-tab').forEach(tab => {
            tab.addEventListener('click', () => {
                state.filterCategory = tab.dataset.category;
                renderPage('home');
            });
        });
    }

    if (page === 'decompose') {
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

        document.getElementById('btnSelectAll')?.addEventListener('click', () => {
            DATA.modules.flatMap(m => m.atoms).forEach(a => state.selectedAtoms.add(a.id));
            renderPage('decompose');
        });

        document.getElementById('btnDeselectAll')?.addEventListener('click', () => {
            state.selectedAtoms.clear();
            renderPage('decompose');
        });

        document.getElementById('btnStartProd')?.addEventListener('click', () => {
            navigate('production');
        });
    }
}

// ===== 初始化 =====
document.addEventListener('DOMContentLoaded', () => {
    renderPage('home');
});
