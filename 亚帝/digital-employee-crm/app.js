// Global Configuration & Assets
const ARTIE_LOGO_B64 = "data:image/png;base64,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0nQ/pB9b+Cn0nQ/pB9b+Cn0nQ/pB9b+Cn0nQ/pB9b+Cn0nQ/pB9b+Cn0nQ/pB9b+Cn0nQ/pB9b+Cn0nQ/pB9b+Cn0nQ/pB9b+Cn0nQ/pB9b+Cn0nQ/pB9b+Cn0nQ/pB9b+Cn0nQ/pB9b+Cn0nQ/pB9b+Cn0nQ/pB9b+Cn0nQ/pB9b+Cn0nQ/pB9b+Cn0nQ/pB9b+Cn0nQ/pB9b+Cn0nQ/pB9b+Cn0nQ/pB9b+Cn0nQ/pB9b+Cn0nQ/pB9b+Cn0nQ/pB9b+Cn0nQ/pB9b+Cn0nQ/pB9b+Cn0nQ/pB9b+Cn0nQ/pB9b+Cn0nQ/pB9b+Cn0nQ/pB9b+Cn0nQ/pB9b+Cn0nQ/pB9b+Cn0nQ/pB9b+Cn0nQ/pB9b+Cn0nQ/pB9b+Cn0nQ/pB9b+Cn0nQ/pB9b+Cn0nQ/pB9b+Cn0nQ/pB9b+Cn0nQ/pB9b+Cn0nQ/pB9b+Cn0nQ/pB9b+Cn0nQ/pB9b+Cn0nQ/pB9b+Cn0nQ/pB9b+Cn0nQ/pB9b+Cn0nQ/pB9b+Cn0nQ/pB9b+Cn0nQ/pB9b+Cn0nQ/pB9b+Cn0nQ/pB9b+Cn0nQ/pB9b+Cn0nQ/pB9b+Cn0nQ/pB9b+Cn0nQ/pB9b+Cn0nQ/pB9b+Cn0nQ/pB9b+Cn0nQ/pB9b+Cn0nQ/pB9b+Cn0nQ/pB9b+Cn0nQ/pB9b+Cn0nQ/pB9b+Cn0nQ/pB9b+Cn0nQ/pB9b+Cn0nQ/pB9b+Cn0nQ/pB9b+Cn0nQ/pB9b+Cn0nQ/pB9b+Cn0nQ/pB9b+Cn0nQ/pB9b+Cn0nQ/pB9b+Cn0nQ/pB9b+Cn0nQ/pB9b+Cn0nQ/pB9b+Cn0nQ/pB9b+Cn0nQ/pB9b+Cn0nQ/pB9b+Cn0nQ/pB9b+Cn0nQ/pB9b+Cn0nQ/pB9b+Cn0nQ/pB9b+Cn0nQ/pB9b+Cn0nQ/pB9b+Cn0nQ/pB9b+Cn0nQ/pB9b+Cn0nQ/pB9b+Cn0nQ/pB9b+Cn0nQ/pB9b+Cn0nQ/pB9b+Cn0nQ/pB9b+Cn0nQ/pB9b+Cn0nQ/pB9b+Cn0nQ/pB9b+Cn0nQ/pB9b+Cn0nQ/pB9b+Cn0nQ/pB9b+Cn0nQ/pB9b+Cn0nQ/pB9b+Cn0nQ/pB9b+Cn0nQ/pB9b+Cn0nQ/pB9b+Cn0nQ/pB9b+Cn0nQ/pB9b+Cn0nQ/pB9b+Cn0nQ/pB9b+Cn0nQ/pB9b+Cn0nQ/pB9b+Cn0nQ/pB9b+Cn0nQ/pB9b+Cn0nQ/pB9b+Cn0nQ/pB9b+Cn0nQ/pB9b+Cn0nQ/pB9b+Cn0nQ/pB9b+Cn0nQ/pB9b+Cn0nQ/pB9b+Cn0nQ/pB9b+Cn0nQ/pB9b+Cn0nQ/pB9b+Cn0nQ/pB9b+Cn0nQ/pB9b+Cn0nQ/pB9b+Cn0nQ/pB9b+Cn0nQ/pB9b+Cn0nQ/pB9b+Cn0nQ/pB9b+Cn0nQ/pB9b+Cn0nQ/pB9b+Cn0nQ/pB9b+Cn0nQ/pB9b+Cn0nQ/pB9b+Cn0nQ/pB9b+Cn0nQ/pB9b+Cn0nQ/pB9b+Cn0nQ/pB9b+Cn0nQ/pB9b+Cn0nQ/pB9b+Cn0nQ/pB9b+Cn0nQ/pB9b+Cn0nQ/pB9b+Cn0nQ/pB9b+Cn0nQ/pB9b+Cn0nQ/pB9b+Cn0nQ/pB9b+Cn0nQ/pB9b+Cn0nQ/pB9b+Cn0nQ/pB9b+Cn0nQ/pB9b+Cn0nQ/pB9b+Cn0nQ/pB9b+Cn0nQ/pB9b+Cn0nQ/pB9b+Cn0nQ/pB9b+Cn0nQ/pB9b+Cn0nQ/pB9b+Cn0nQ/pB9b+Cn0nQ/pB9b+Cn0nQ/pB9b+Cn0nQ/pB9b+Cn0nQ/pB9b+Cn0nQ/pB9b+Cn0nQ/pB9b+Cn0nQ/pB9b+Cn0nQ/pB9b+Cn0nQ/pB9b+Cn0nQ/pB9b+Cn0nQ/pB9b+Cn0nQ/pB9b+Cn0nQ/pB9b+Cn0nQ/pB9b+Cn0nQ/pB9b+Cn0nQ/pB9b+Cn0nQ/pB9b+Cn0nQ/pB9b+Cn0nQ/pB9b+Cn0nQ/pB9b+Cn0nQ/pB9b+Cn0nQ/pB9b+Cn0nQ/pB9b+Cn0nQ/pB9b+Cn0nQ/pB9b+Cn0nQ/pB9b+Cn0nQ/pB9b+Cn0nQ/pB9b+Cn0nQ/pB9b+Cn0nQ/pB9b+Cn0nQ/pB9b+Cn0nQ/pB9b+Cn0nQ/pB9b+Cn0nQ/pB9b+Cn0nQ/pB9b+Cn0nQ/pB9b+Cn0nQ/pB9b+Cn0nQ/pB9b+Cn0nQ/pB9b+Cn0nQ/pB9b+Cn0nQ/pB9b+Cn0nQ/pB9b+Cn0nQ/pB9b+Cn0nQ/pB9b+Cn0nQ/pB9b+Cn0nQ/pB9b+Cn0nQ/pB9b+Cn0nQ/pB9b+Cn0nQ/pB9b+Cn0nQ/pB9b+Cn0nQ/pB9b+Cn0nQ/pB9b+Cn0nQ/pB9b+Cn0nQ/pB9b+Cn0nQ/pB9b+Cn0nQ/pB9b+Cn0nQ/pB9b+Cn0nQ/pB9b+Cn0nQ/pB9b+Cn0nQ/pB9b+Cn0nQ/pB9b+Cn0nQ/pB9b+Cn0nQ/pB9b+Cn0nQ/pB9b+Cn0nQ/pB9b+Cn0nQ/pB9b+Cn0nQ/pB9b+Cn0nQ/pB9b+Cn0nQ/pB9b+Cn0nQ/pB9b+Cn0nQ/pB9b+Cn0nQ/pB9b+Cn0nQ/pB9b+Cn0nQ/pB9b+Cn0nQ/pB9b+Cn0nQ/pB9b+Cn0nQ/pB9b+Cn1n7p8v/A/pB4J6N007vAAAAABJRU5ErkJggg==";

// Initialize icons Helper
const refreshIcons = (root = document) => {
    if (window.lucide) {
        window.lucide.createIcons({ root });
    }
};

document.addEventListener('DOMContentLoaded', () => {
    // Inject Logos from single source
    document.querySelectorAll('.artie-logo-dynamic').forEach(img => {
        img.src = ARTIE_LOGO_B64;
    });

    // Initial icon creation
    refreshIcons();

    // Nav logic
    const navLinks = document.querySelectorAll('.nav-link');
    const pageViews = document.querySelectorAll('.page-view');

    navLinks.forEach(link => {
        link.addEventListener('click', (e) => {
            e.preventDefault();
            const targetId = link.getAttribute('data-target');
            
            navLinks.forEach(l => l.classList.remove('active'));
            link.classList.add('active');

            pageViews.forEach(view => {
                view.classList.remove('active');
                if (view.id === `view-${targetId}`) {
                    view.classList.add('active');
                }
            });
            
            // Re-init icons for newly shown views if they have un-initialized icons
            refreshIcons();
        });
    });

    // -------- Dashboard Logic --------
    const startBtn = document.getElementById('startAutoBtn');
    const progressContainer = document.getElementById('progressContainer');
    const progressBar = document.getElementById('progressBar');
    
    const panelAutomation = document.getElementById('automationPanel');
    const panelResults = document.getElementById('resultsPanel');
    const panelCampaign = document.getElementById('campaignPanel');
    
    const terminal = document.getElementById('terminalOutput');
    const leadsGrid = document.getElementById('leadsGrid');
    const okkiSync = document.getElementById('okkiSync');

    // Dashboard Leads Data
    const leadsData = [
        {
            title: "Miami Oasis Retreat",
            tag: "Luxury Resort",
            location: "Miami, FL (Found via IG)",
            stores: "1 Location (Massive Project)",
            contact: "Sarah J. (Purchasing Manager)",
            email: "sarah.j@miamioasis.com (Verified Apollo.io)"
        },
        {
            title: "Lumina Outdoor Living",
            tag: "Retailer (A-Level)",
            location: "California (Found via Google)",
            stores: "4 Stores (Map verified)",
            contact: "David R. (Managing Director)",
            email: "david@luminaliving.com (Verified Hunter.io)"
        },
        {
            title: "Azure Mediterranean",
            tag: "High-End Retailer",
            location: "Spain (Found via LinkedIn)",
            stores: "3 Stores",
            contact: "Elena M. (Product Dev)",
            email: "elena.m@azure-med.com"
        }
    ];

    function getTimestamp() {
        const now = new Date();
        return `[${now.getHours().toString().padStart(2, '0')}:${now.getMinutes().toString().padStart(2, '0')}:${now.getSeconds().toString().padStart(2, '0')}]`;
    }

    function addLog(text, type = 'info', targetTerminal = terminal) {
        const line = document.createElement('div');
        line.className = 'log-line';
        let content = `<span class="log-time">${getTimestamp()}</span> `;
        
        if (type === 'warn') content += `<span class="log-warn">${text}</span>`;
        else if (type === 'highlight') content += `<span class="log-highlight">${text}</span>`;
        else if (type === 'gold') content += `<span class="log-gold">${text}</span>`;
        else content += `<span class="log-info">${text}</span>`;
        
        line.innerHTML = content;
        targetTerminal.appendChild(line);
        targetTerminal.scrollTop = targetTerminal.scrollHeight;
    }

    function populateDashboardLeads() {
        if (!leadsGrid) return;
        leadsGrid.innerHTML = '';
        leadsData.forEach((lead) => {
            const card = document.createElement('div');
            card.className = 'lead-card';
            card.innerHTML = `
                <div class="lead-badge">${lead.tag}</div>
                <h3 class="lead-title">${lead.title}</h3>
                <div class="lead-meta"><i data-lucide="map-pin" size="14"></i> ${lead.location}</div>
                <div class="lead-detail">
                    <i data-lucide="store" size="16" class="lead-detail-icon"></i>
                    <span>Scale: ${lead.stores}</span>
                </div>
                <div class="lead-detail">
                    <i data-lucide="user" size="16" class="lead-detail-icon"></i>
                    <span>Contact: ${lead.contact}</span>
                </div>
                <div class="lead-detail">
                    <i data-lucide="mail" size="16" class="lead-detail-icon"></i>
                    <span>Email: ${lead.email}</span>
                </div>
            `;
            leadsGrid.appendChild(card);
        });
        refreshIcons(leadsGrid);
    }

    const wait = (ms) => new Promise(resolve => setTimeout(resolve, ms));

    async function runSimulation() {
        if(!startBtn) return;
        
        // Reset State for re-runs
        startBtn.disabled = true;
        const originalBtnHTML = startBtn.innerHTML;
        startBtn.innerHTML = `<i data-lucide="loader-2" class="lucide-spin" style="animation: spin 2s linear infinite;"></i> Processing Workflow...`;
        refreshIcons(startBtn);

        if (progressContainer) progressContainer.style.display = 'block';
        if (progressBar) progressBar.style.width = '0%';
        
        [panelAutomation, panelResults, panelCampaign].forEach(p => p && p.classList.remove('visible'));
        if (okkiSync) okkiSync.style.display = 'none';
        
        if (terminal) terminal.innerHTML = ''; 

        // Show Automation Panel
        if (panelAutomation) panelAutomation.classList.add('visible');
        
        // STEP 1
        addLog("INITIATING STEP 1: Automated Discovery", "gold");
        addLog("Scanning Instagram, Facebook for '#luxuryoutdoor' & '#resortliving'...");
        if (progressBar) progressBar.style.width = '10%';
        await wait(1500);
        addLog("Found 1,245 posts in the last 24 hours.");
        addLog("Extracting company names and website URLs cross-matched with LinkedIn...");
        if (progressBar) progressBar.style.width = '20%';
        await wait(2000);
        addLog("214 unique companies identified.");

        // STEP 2
        addLog("INITIATING STEP 2: Vision Filtering (Aesthetics Check)", "gold");
        addLog("Deploying Vision AI models to analyze prospect product pages...");
        if (progressBar) progressBar.style.width = '30%';
        await wait(2000);
        addLog("Analyzing for: 'vacation-style', 'wild luxury', 'romantic', 'refined'.");
        await wait(1800);
        addLog("Filter Results: 189 rejected (mismatched aesthetics/too generic).");
        addLog("Filter Results: 25 companies pass the Artie aesthetic standard.", "highlight");
        if (progressBar) progressBar.style.width = '45%';

        // STEP 3
        addLog("INITIATING STEP 3: Scale Verification", "gold");
        addLog("Querying Google Maps API for physical store footprint...");
        await wait(2000);
        addLog("Filtering out retailers with < 3 stores (except 5-Star Hotel projects).");
        addLog("Finalist shortlist generated: 7 High-Value Leads.");
        if (progressBar) progressBar.style.width = '60%';

        // STEP 4
        addLog("INITIATING STEP 4: Network Tracing & Decison Makers", "gold");
        addLog("Connecting to LinkedIn Sales Navigator API...");
        if (progressBar) progressBar.style.width = '70%';
        await wait(1500);
        addLog("Searching titles: 'Purchasing Manager', 'Managing Director', 'Product Dev'.");
        await wait(1500);
        addLog("Passing profiles to Apollo.io & Hunter.io for email extraction...");
        addLog("Successfully extracted 3 verified contacts for Top A-Level Leads.", "highlight");
        if (progressBar) progressBar.style.width = '85%';
        await wait(1000);

        // STEP 5
        addLog("INITIATING STEP 5: Generating Daily Report", "gold");
        addLog("Compiling data into morning dashboard view...");
        await wait(1000);
        if (panelResults) panelResults.classList.add('visible');
        populateDashboardLeads();
        if (progressBar) progressBar.style.width = '95%';
        
        await wait(2000);
        
        // STEP 6 & 7 & 8
        addLog("INITIATING STEP 6 & 7: Generating Personalized Emails", "gold");
        addLog("Writing custom outreach referencing specific architectural details...");
        await wait(1000);
        addLog("Emails Sent to Outbox.");
        if (panelCampaign) panelCampaign.classList.add('visible');
        
        await wait(3000);
        addLog("INCOMING: Reply from Target Lead ('Yes, send catalog!')", "highlight");
        
        // Step 8
        await wait(1000);
        addLog("INITIATING STEP 8: OKKI CRM Sync", "gold");
        if (okkiSync) {
            okkiSync.style.display = 'flex';
            okkiSync.animate([ {opacity: 0, transform: 'translateY(10px)'}, {opacity: 1, transform: 'translateY(0)'} ], {duration: 500});
        }
        addLog("Data mapped and pushed to OKKI API. Lead Stage: Qualified.", "gold");

        if (progressBar) progressBar.style.width = '100%';
        startBtn.disabled = false;
        startBtn.innerHTML = `<i data-lucide="check"></i> Workflow Complete`;
        refreshIcons(startBtn);
    }

    if(startBtn) {
        startBtn.addEventListener('click', runSimulation);
    }

    // -------- Leads View Logic --------
    const leadsDatabase = [
        { name: "Miami Oasis Retreat", type: "Luxury Resort", loc: "USA", rating: "98% (A-Level)", contact: "Sarah J.", action: "Email Sent" },
        { name: "Lumina Outdoor Living", type: "Retailer (4 stores)", loc: "USA", rating: "92% (A-Level)", contact: "David R.", action: "Email Sent" },
        { name: "Azure Mediterranean", type: "Retailer (3 stores)", loc: "Spain", rating: "89% (A-Level)", contact: "Elena M.", action: "Drafting" },
        { name: "Bali Eco Villas", type: "Hotel Project", loc: "Indonesia", rating: "95% (A-Level)", contact: "Komang W.", action: "Review" },
        { name: "Nordic Summer Furnishings", type: "Retailer (7 stores)", loc: "Sweden", rating: "72% (B-Level)", contact: "Lars E.", action: "Review" },
        { name: "Santorini Cliffside", type: "Luxury Resort", loc: "Greece", rating: "99% (Perfect Match)", contact: "Maria P.", action: "Drafting" },
        { name: "Gold Coast Patios", type: "Retailer (2 stores)", loc: "Australia", rating: "Rejected (Scale < 3)", contact: "N/A", action: "Discarded" },
    ];
    const fullLeadsTable = document.querySelector('#fullLeadsTable tbody');
    if (fullLeadsTable) {
        leadsDatabase.forEach(lead => {
            const tr = document.createElement('tr');
            tr.innerHTML = `
                <td><strong>${lead.name}</strong></td>
                <td>${lead.type}</td>
                <td>${lead.loc}</td>
                <td><span style="color: ${lead.rating.includes('A-Level')||lead.rating.includes('Perfect') ? 'var(--success-green)' : (lead.rating.includes('Rejected') ? 'var(--text-muted)' : 'inherit')}">${lead.rating}</span></td>
                <td>${lead.contact}</td>
                <td><button class="table-btn">${lead.action}</button></td>
            `;
            fullLeadsTable.appendChild(tr);
        });
    }

    // -------- Emails View Logic --------
    const emailListPane = document.getElementById('emailListPane');
    const emailDetailPane = document.getElementById('emailDetailPane');
    
    const emailCampaigns = [
        { id: 1, to: "sarah.j@miamioasis.com", name: "Miami Oasis Retreat", time: "10:30 AM", subject: "Elevating the Outdoor Experience at Miami Oasis", content: `
            <h2>Dear Sarah,</h2>
            <p>I noticed Miami Oasis Retreat recently received the 2024 Best Design Hotel award—a well-deserved recognition for your stunning waterfront spaces.</p>
            <img class="email-hero-img" src="https://images.unsplash.com/photo-1499793983690-e29da59ef1c2?ixlib=rb-4.0.3&auto=format&fit=crop&w=1200&q=80" alt="Artie Outdoor Furniture">
            <p>At <strong>Artie</strong>, we share your passion for weaving wild luxury and romantic aesthetics into outdoor living. Having furnished over 300 upscale resorts globally, our hand-woven collections are designed not just to withstand coastal elements, but to redefine them.</p>
            <p>Given your expansion in the South Beach property, I would love to explore how our tailored solutions can complement your vision.</p>
        `},
        { id: 2, to: "david@luminaliving.com", name: "Lumina Outdoor", time: "11:15 AM", subject: "Partnership: Bringing Wild Luxury to California", content: `
            <h2>Hi David,</h2>
            <p>Following Lumina Outdoor Living's recent expansion to 4 showroom locations across California, I was deeply impressed by your curated selection of high-end patio pieces.</p>
            <img class="email-hero-img" src="https://images.unsplash.com/photo-1499793983690-e29da59ef1c2?ixlib=rb-4.0.3&auto=format&fit=crop&w=1200&q=80" alt="Artie Outdoor Furniture">
            <p>As the Managing Director, you know the Californian market demands both durability and refined aesthetics. <strong>Artie Outdoor Furniture</strong> specializes in creating that exact blend—vacation-style, wild luxury pieces that turn backyards into private resorts.</p>
            <p>I've attached our latest catalog for your buyers. Should we schedule a brief video intro?</p>
        `},
        { id: 3, to: "maria.p@santorinicliffside.gr", name: "Santorini Cliffside", time: "Pending", subject: "Artie x Santorini Cliffside: A Romantic Setup", content: `
            <h2>Dear Maria,</h2>
            <p>The Aegean views from Santorini Cliffside are magnificent. To match such a romantic and iconic destination, standard outdoor furniture is simply not enough.</p>
            <p>At <strong>Artie</strong>, our design philosophy revolves around 'wild luxury' and 'romantic aesthetics'. Our woven loungers and parasols are built specifically to endure coastal winds while providing a 5-star tactile experience.</p>
            <p>Let's collaborate to elevate your cliffside terraces.</p>
        `}
    ];

    if (emailListPane) {
        emailCampaigns.forEach((email, idx) => {
            const div = document.createElement('div');
            div.className = `email-list-item ${idx === 0 ? 'selected' : ''}`;
            div.innerHTML = `
                <span class="email-time">${email.time}</span>
                <h4>${email.name}</h4>
                <p><strong>Subj:</strong> ${email.subject}</p>
            `;
            div.addEventListener('click', () => {
                document.querySelectorAll('.email-list-item').forEach(el => el.classList.remove('selected'));
                div.classList.add('selected');
                showEmailDetail(email);
            });
            emailListPane.appendChild(div);
        });

        // Show first email by default
        showEmailDetail(emailCampaigns[0]);
    }

    function showEmailDetail(email) {
        emailDetailPane.innerHTML = `
            <div class="email-mockup" style="animation: none;">
                <div class="email-header">
                    <div class="email-field"><span>From:</span> AI Agent <span style="opacity:0.5">&lt;alex.chen@artiegarden.com&gt;</span></div>
                    <div class="email-field"><span>To:</span> ${email.to}</div>
                    <div class="email-field"><span>Subject:</span> ${email.subject}</div>
                </div>
                <div class="email-body">
                    <div class="email-content">
                        ${email.content}
                        <div class="artie-signature">
                            <div class="artie-logo-dark">
                                <img src="data:image/png;base64,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0nQ/pB9b+Cn0nQ/pB9b+Cn0nQ/pB9b+Cn0nQ/pB9b+Cn0nQ/pB9b+Cn0nQ/pB9b+Cn0nQ/pB9b+Cn0nQ/pB9b+Cn0nQ/pB9b+Cn0nQ/pB9b+Cn0nQ/pB9b+Cn0nQ/pB9b+Cn0nQ/pB9b+Cn0nQ/pB9b+Cn0nQ/pB9b+Cn0nQ/pB9b+Cn0nQ/pB9b+Cn0nQ/pB9b+Cn0nQ/pB9b+Cn0nQ/pB9b+Cn0nQ/pB9b+Cn0nQ/pB9b+Cn0nQ/pB9b+Cn0nQ/pB9b+Cn0nQ/pB9b+Cn0nQ/pB9b+Cn0nQ/pB9b+Cn0nQ/pB9b+Cn0nQ/pB9b+Cn0nQ/pB9b+Cn0nQ/pB9b+Cn0nQ/pB9b+Cn0nQ/pB9b+Cn0nQ/pB9b+Cn0nQ/pB9b+Cn0nQ/pB9b+Cn0nQ/pB9b+Cn0nQ/pB9b+Cn0nQ/pB9b+Cn0nQ/pB9b+Cn0nQ/pB9b+Cn0nQ/pB9b+Cn0nQ/pB9b+Cn0nQ/pB9b+Cn0nQ/pB9b+Cn0nQ/pB9b+Cn0nQ/pB9b+Cn0nQ/pB9b+Cn0nQ/pB9b+Cn0nQ/pB9b+Cn0nQ/pB9b+Cn0nQ/pB9b+Cn0nQ/pB9b+Cn0nQ/pB9b+Cn0nQ/pB9b+Cn0nQ/pB9b+Cn0nQ/pB9b+Cn0nQ/pB9b+Cn0nQ/pB9b+Cn0nQ/pB9b+Cn0nQ/pB9b+Cn0nQ/pB9b+Cn0nQ/pB9b+Cn0nQ/pB9b+Cn0nQ/pB9b+Cn0nQ/pB9b+Cn0nQ/pB9b+Cn0nQ/pB9b+Cn0nQ/pB9b+Cn0nQ/pB9b+Cn0nQ/pB9b+Cn0nQ/pB9b+Cn0nQ/pB9b+Cn0nQ/pB9b+Cn0nQ/pB9b+Cn0nQ/pB9b+Cn0nQ/pB9b+Cn0nQ/pB9b+Cn0nQ/pB9b+Cn0nQ/pB9b+Cn0nQ/pB9b+Cn0nQ/pB9b+Cn0nQ/pB9b+Cn0nQ/pB9b+Cn0nQ/pB9b+Cn0nQ/pB9b+Cn0nQ/pB9b+Cn0nQ/pB9b+Cn0nQ/pB9b+Cn0nQ/pB9b+Cn0nQ/pB9b+Cn0nQ/pB9b+Cn0nQ/pB9b+Cn0nQ/pB9b+Cn0nQ/pB9b+Cn0nQ/pB9b+Cn0nQ/pB9b+Cn0nQ/pB9b+Cn0nQ/pB9b+Cn0nQ/pB9b+Cn0nQ/pB9b+Cn0nQ/pB9b+Cn0nQ/pB9b+Cn0nQ/pB9b+Cn0nQ/pB9b+Cn0nQ/pB9b+Cn0nQ/pB9b+Cn0nQ/pB9b+Cn0nQ/pB9b+Cn0nQ/pB9b+Cn0nQ/pB9b+Cn0nQ/pB9b+Cn0nQ/pB9b+Cn0nQ/pB9b+Cn0nQ/pB9b+Cn0nQ/pB9b+Cn0nQ/pB9b+Cn0nQ/pB9b+Cn0nQ/pB9b+Cn0nQ/pB9b+Cn0nQ/pB9b+Cn0nQ/pB9b+Cn0nQ/pB9b+Cn0nQ/pB9b+Cn0nQ/pB9b+Cn0nQ/pB9b+Cn0nQ/pB9b+Cn0nQ/pB9b+Cn0nQ/pB9b+Cn0nQ/pB9b+Cn0nQ/pB9b+Cn0nQ/pB9b+Cn0nQ/pB9b+Cn0nQ/pB9b+Cn0nQ/pB9b+Cn0nQ/pB9b+Cn0nQ/pB9b+Cn0nQ/pB9b+Cn0nQ/pB9b+Cn0nQ/pB9b+Cn0nQ/pB9b+Cn0nQ/pB9b+Cn0nQ/pB9b+Cn0nQ/pB9b+Cn0nQ/pB9b+Cn0nQ/pB9b+Cn0nQ/pB9b+Cn0nQ/pB9b+Cn0nQ/pB9b+Cn0nQ/pB9b+Cn0nQ/pB9b+Cn0nQ/pB9b+Cn0nQ/pB9b+Cn0nQ/pB9b+Cn0nQ/pB9b+Cn0nQ/pB9b+Cn0nQ/pB9b+Cn0nQ/pB9b+Cn0nQ/pB9b+Cn0nQ/pB9b+Cn0nQ/pB9b+Cn0nQ/pB9b+Cn0nQ/pB9b+Cn0nQ/pB9b+Cn0nQ/pB9b+Cn0nQ/pB9b+Cn0nQ/pB9b+Cn0nQ/pB9b+Cn0nQ/pB9b+Cn0nQ/pB9b+Cn0nQ/pB9b+Cn0nQ/pB9b+Cn0nQ/pB9b+Cn0nQ/pB9b+Cn0nQ/pB9b+Cn0nQ/pB9b+Cn0nQ/pB9b+Cn0nQ/pB9b+Cn0nQ/pB9b+Cn0nQ/pB9b+Cn0nQ/pB9b+Cn0nQ/pB9b+Cn0nQ/pB9b+Cn0nQ/pB9b+Cn0nQ/pB9b+Cn0nQ/pB9b+Cn0nQ/pB9b+Cn0nQ/pB9b+Cn0nQ/pB9b+Cn0nQ/pB9b+Cn0nQ/pB9b+Cn0nQ/pB9b+Cn0nQ/pB9b+Cn0nQ/pB9b+Cn0nQ/pB9b+Cn0nQ/pB9b+Cn0nQ/pB9b+Cn0nQ/pB9b+Cn0nQ/pB9b+Cn0nQ/pB9b+Cn0nQ/pB9b+Cn0nQ/pB9b+Cn0nQ/pB9b+Cn0nQ/pB9b+Cn0nQ/pB9b+Cn1n7p8v/A/pB4J6N007vAAAAABJRU5ErkJggg==" alt="Artie Logo" height="24" style="margin-right: 8px; vertical-align: middle;">
                                 Artie
                             </div>
                             <div class="artie-tagline">Redefine Home - Enjoy Your Life</div>
                         </div>
                     </div>
                 </div>
             </div>
         `;
    }

    // -------- CRM Sync Logs --------
    const crmLogsOutput = document.getElementById('crmLogsOutput');
    if (crmLogsOutput) {
        const crmLogs = [
            "[CRON] Heartbeat check. OKKI API connection active... OK",
            "[POST] /api/v1/leads - Payload: {name: 'Miami Oasis Retreat', industry: 'Hospitality'}... SUCCESS",
            "[INFO] Lead ID 89441 mapped successfully.",
            "[SYNC] Pulling latest reply status from Outlook Server...",
            "[EVENT] Inbound Email Detected.",
            "[NLP] Sentiment Analysis: POSITIVE ('Yes, send catalog!')",
            "[PATCH] /api/v1/leads/89441 - Update status to 'Qualified'... SUCCESS",
            "[NOTIFY] Alerted Sales Rep: Alex Chen."
        ];
        
        let logIdx = 0;
        const crmLogIntervalId = setInterval(() => {
            const viewCrm = document.getElementById('view-crm');
            if (!viewCrm) {
                clearInterval(crmLogIntervalId);
                return;
            }

            if(logIdx < crmLogs.length && viewCrm.classList.contains('active')) {
                addLog(crmLogs[logIdx], crmLogs[logIdx].includes('SUCCESS') ? 'info' : (crmLogs[logIdx].includes('POSITIVE') ? 'highlight' : 'warn'), crmLogsOutput);
                logIdx++;
            } else if (logIdx >= crmLogs.length) {
                logIdx = 0; // restart mock logs
            }
        }, 1500);
    }
});
