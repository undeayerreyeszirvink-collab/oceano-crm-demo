// Global Configuration & Assets
const ARTIE_LOGO_B64 = "data:image/png;base64,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";

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
        { company: "Miami Oasis Retreat", contact: "Sarah Johnson", title: "General Manager", email: "sarah.j@miamioasis.com", phone: "+1 305-555-0123" },
        { company: "Lumina Outdoor Living", contact: "David Rodriguez", title: "Managing Director", email: "david@luminaliving.com", phone: "+1 415-555-0456" },
        { company: "Azure Mediterranean", contact: "Elena Martinez", title: "Procurement Head", email: "elena.m@azuremediterranean.es", phone: "+34 91-555-0789" },
        { company: "Bali Eco Villas", contact: "Komang Widiarta", title: "Project Director", email: "komang@baliecovillas.id", phone: "+62 361-555-0234" },
        { company: "Nordic Summer Furnishings", contact: "Lars Eriksson", title: "Buyer", email: "lars.e@nordicsummer.se", phone: "+46 8-555-0567" },
        { company: "Santorini Cliffside Resort", contact: "Maria Papadopoulos", title: "Owner / CEO", email: "maria.p@santorinicliffside.gr", phone: "+30 22-555-0890" },
        { company: "Maldives Horizon Villas", contact: "Ahmed Rasheed", title: "F&B & Facilities Director", email: "a.rasheed@horizonvillas.mv", phone: "+960 332-5501" },
        { company: "The Beverly Hills Garden Club", contact: "Jessica Lin", title: "Purchasing Manager", email: "jessica.lin@bhgardenclub.com", phone: "+1 310-555-9901" },
        { company: "Casa de Campo Resort", contact: "Carlos Dominguez", title: "Head of Procurement", email: "c.dominguez@casadecampo.com.do", phone: "+1 809-523-3333" },
        { company: "Alila Villas Uluwatu", contact: "Dewi Santoso", title: "Property Manager", email: "dewi.s@alilahotels.com", phone: "+62 361-848-2166" },
        { company: "Tuscany Outdoor Interiors", contact: "Marco Ferraro", title: "Sales Director", email: "marco.f@tuscanyoutdoor.it", phone: "+39 055-555-2341" },
        { company: "Palm Beach Luxury Patios", contact: "Robert Whitfield", title: "Owner", email: "robert@pbuxurypatios.com", phone: "+1 561-555-6677" },
    ];
    const fullLeadsTable = document.querySelector('#fullLeadsTable tbody');
    if (fullLeadsTable) {
        leadsDatabase.forEach(lead => {
            const tr = document.createElement('tr');
            tr.innerHTML = `
                <td><strong>${lead.company}</strong></td>
                <td>${lead.contact}</td>
                <td>${lead.title}</td>
                <td>${lead.email}</td>
                <td>${lead.phone}</td>
                <td><button class="table-btn">View</button></td>
            `;
            fullLeadsTable.appendChild(tr);
        });
    }

    // -------- Emails View Logic --------
    const emailListPane = document.getElementById('emailListPane');
    const emailDetailPane = document.getElementById('emailDetailPane');

    const emailCampaigns = [
        { id: 1, company: "Miami Oasis Retreat", contact: "Sarah Johnson", title: "General Manager", email: "sarah.j@miamioasis.com", status: "已发送", time: "10:30 AM", subject: "Elevating the Outdoor Experience at Miami Oasis", content: `
            <h2>Dear Sarah,</h2>
            <p>I noticed Miami Oasis Retreat recently received the 2024 Best Design Hotel award—a well-deserved recognition for your stunning waterfront spaces.</p>
            <img class="email-hero-img" src="https://images.unsplash.com/photo-1499793983690-e29da59ef1c2?ixlib=rb-4.0.3&auto=format&fit=crop&w=1200&q=80" alt="Artie Outdoor Furniture">
            <p>At <strong>Artie</strong>, we share your passion for weaving wild luxury and romantic aesthetics into outdoor living. Having furnished over 300 upscale resorts globally, our hand-woven collections are designed not just to withstand coastal elements, but to redefine them.</p>
            <p>Given your expansion in the South Beach property, I would love to explore how our tailored solutions can complement your vision.</p>
        `},
        { id: 2, company: "Lumina Outdoor Living", contact: "David Rodriguez", title: "Managing Director", email: "david@luminaliving.com", status: "已发送", time: "11:15 AM", subject: "Partnership: Bringing Wild Luxury to California", content: `
            <h2>Hi David,</h2>
            <p>Following Lumina Outdoor Living's recent expansion to 4 showroom locations across California, I was deeply impressed by your curated selection of high-end patio pieces.</p>
            <img class="email-hero-img" src="https://images.unsplash.com/photo-1499793983690-e29da59ef1c2?ixlib=rb-4.0.3&auto=format&fit=crop&w=1200&q=80" alt="Artie Outdoor Furniture">
            <p>As the Managing Director, you know the Californian market demands both durability and refined aesthetics. <strong>Artie Outdoor Furniture</strong> specializes in creating that exact blend—vacation-style, wild luxury pieces that turn backyards into private resorts.</p>
            <p>I've attached our latest catalog for your buyers. Should we schedule a brief video intro?</p>
        `},
        { id: 3, company: "Santorini Cliffside Resort", contact: "Maria Papadopoulos", title: "Owner / CEO", email: "maria.p@santorinicliffside.gr", status: "已发送", time: "Yesterday", subject: "Artie x Santorini Cliffside: A Romantic Setup", content: `
            <h2>Dear Maria,</h2>
            <p>The Aegean views from Santorini Cliffside are magnificent. To match such a romantic and iconic destination, standard outdoor furniture is simply not enough.</p>
            <p>At <strong>Artie</strong>, our design philosophy revolves around 'wild luxury' and 'romantic aesthetics'. Our woven loungers and parasols are built specifically to endure coastal winds while providing a 5-star tactile experience.</p>
            <p>Let's collaborate to elevate your cliffside terraces.</p>
        `},
        { id: 4, company: "Maldives Horizon Villas", contact: "Ahmed Rasheed", title: "F&B & Facilities Director", email: "a.rasheed@horizonvillas.mv", status: "已发送", time: "2 days ago", subject: "Outdoor Elegance for Maldives Horizon Villas", content: `
            <h2>Dear Ahmed,</h2>
            <p>Your overwater villas at Maldives Horizon are breathtaking. I believe our handcrafted outdoor collections would perfectly complement your resort's aesthetic.</p>
            <p>Artie specializes in weather-resistant, luxury outdoor furniture designed for tropical climates. Our pieces combine durability with the refined elegance your guests expect.</p>
            <p>Would you be open to a brief call to discuss how we can enhance your outdoor spaces?</p>
        `},
        { id: 5, company: "Casa de Campo Resort", contact: "Carlos Dominguez", title: "Head of Procurement", email: "c.dominguez@casadecampo.com.do", status: "已发送", time: "3 days ago", subject: "Premium Outdoor Solutions for Casa de Campo", content: `
            <h2>Hola Carlos,</h2>
            <p>Casa de Campo's reputation for luxury is unmatched in the Caribbean. I wanted to introduce Artie's outdoor furniture collections that align perfectly with your resort's standards.</p>
            <p>Our pieces are designed to withstand Caribbean weather while maintaining the sophisticated aesthetic your guests expect. We've worked with over 50 luxury resorts in similar climates.</p>
            <p>I'd love to share our portfolio with you.</p>
        `}
    ];

    if (emailListPane) {
        emailCampaigns.forEach((email, idx) => {
            const div = document.createElement('div');
            div.className = `email-list-item ${idx === 0 ? 'selected' : ''}`;
            div.innerHTML = `
                <span class="email-time">${email.time}</span>
                <h4>${email.company}</h4>
                <p><strong>${email.contact}</strong> - ${email.title}</p>
                <p style="font-size: 11px; color: var(--text-muted); margin-top: 4px;">${email.email} - ${email.status}</p>
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
            <div class="email-mockup" style="animation: none; overflow-y: auto; height: 100%;">
                <div class="email-header">
                    <div class="email-field"><span>From:</span> AI Agent <span style="opacity:0.5">&lt;alex.chen@artiegarden.com&gt;</span></div>
                    <div class="email-field"><span>To:</span> ${email.contact} &lt;${email.email}&gt; — ${email.title}, ${email.company}</div>
                    <div class="email-field"><span>Subject:</span> ${email.subject}</div>
                    <div class="email-field"><span>Status:</span> <span style="color: var(--success-green); font-weight: 500;">${email.status}</span></div>
                </div>
                <div class="email-body">
                    <div class="email-content">
                        ${email.content}
                        <div class="artie-signature">
                            <div class="artie-logo-dark">
                                <img class="artie-logo-dynamic" src="" alt="Artie Logo" height="22" style="margin-right: 8px; vertical-align: middle;">
                                Artie
                            </div>
                            <div class="artie-tagline">Redefine Home - Enjoy Your Life</div>
                        </div>
                    </div>
                </div>
            </div>
        `;
        refreshIcons(emailDetailPane);
        // Re-inject logo into newly created img tags
        emailDetailPane.querySelectorAll('.artie-logo-dynamic').forEach(img => { img.src = ARTIE_LOGO_B64; });
    }
});
