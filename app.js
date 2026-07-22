document.addEventListener('DOMContentLoaded', ()=>{
  const today = document.getElementById('today');
  const d = new Date();
  today.textContent = d.toLocaleDateString(undefined,{weekday:'short', month:'short', day:'numeric'});

  const healthEl = document.getElementById('health');
  const healthMetaEl = document.querySelector('.score-meta');
  const businessHealthScore = 90;
  function getBusinessHealthScore(){
    return 90;
  }
  healthEl.textContent = getBusinessHealthScore();

  const businessHealthWeights = {
    revenue: 0.30,
    chairUtilization: 0.20,
    rebooking: 0.20,
    marketing: 0.10,
    retailSales: 0.10,
    staffPerformance: 0.10
  };

  function clampScore(value){
    return Math.max(0, Math.min(100, value));
  }

  function normalizeMetric(metric){
    const { value, target, mode = 'ratio' } = metric;
    if(mode === 'percent') return clampScore(value);
    if(mode === 'currency') return clampScore((value / target) * 100);
    return clampScore((value / target) * 100);
  }

  function calculateBusinessHealth(metrics, weights){
    const components = Object.entries(weights).map(([key, weight])=>{
      const metric = metrics[key];
      const score = normalizeMetric(metric);
      return { key, score, weight };
    });

    const overall = components.reduce((sum, item)=> sum + (item.score * item.weight), 0);
    const rounded = Math.round(overall);

    let status = 'Critical';
    if(rounded >= 85) status = 'Excellent';
    else if(rounded >= 70) status = 'Good';
    else if(rounded >= 50) status = 'Needs Attention';

    const weakest = components.slice().sort((a,b)=>a.score - b.score)[0];
    let recommendation = 'Revenue is below target.';
    if(weakest){
      switch(weakest.key){
        case 'chairUtilization':
          recommendation = 'Move James overflow to Jay.';
          break;
        case 'rebooking':
          recommendation = 'Rebooking has dropped below target.';
          break;
        case 'retailSales':
          recommendation = 'Retail sales are falling.';
          break;
        case 'marketing':
          recommendation = 'Marketing momentum is slipping.';
          break;
        case 'staffPerformance':
          recommendation = 'Staff performance is under target.';
          break;
        default:
          recommendation = 'Revenue is below target.';
      }
    }

    return { score: rounded, status, recommendation };
  }

  const businessHealthMetrics = {
    revenue: { value: 34210, target: 40000, mode: 'currency' },
    chairUtilization: { value: 0.76, target: 1, mode: 'ratio' },
    rebooking: { value: 0.67, target: 1, mode: 'ratio' },
    marketing: { value: 0.68, target: 1, mode: 'ratio' },
    retailSales: { value: 0.58, target: 1, mode: 'ratio' },
    staffPerformance: { value: 0.84, target: 1, mode: 'ratio' }
  };

  const healthState = calculateBusinessHealth(businessHealthMetrics, businessHealthWeights);
  let target = healthState.score;
  let value = 0;
  const dur = 1200;
  const step = Math.max(1, Math.floor(target / (dur / 16)));
  const inc = setInterval(()=>{
    value += step;
    if(value >= target){ value = target; clearInterval(inc); }
    healthEl.textContent = value;
  },16);

  // reveal the large score once the count animation completes
  setTimeout(()=>{
    healthEl.classList.add('revealed');
    if(healthMetaEl){
      healthMetaEl.innerHTML = `<div>${healthState.status}</div><div>${healthState.recommendation}</div>`;
    }
  }, dur + 120);

  // KPI placeholders ready to be wired to real data sources
  const kpi = {
    revenue: { el: document.getElementById('rev-value'), format: v=>`$${v.toLocaleString()}` },
    appointments: { el: document.getElementById('app-value'), format: v=>v },
    rebook: { el: document.getElementById('rebook-value'), format: v=>`${v}%` },
    reviews: { el: document.getElementById('reviews-value'), format: v=>`${v.rating} ★ • ${v.count}` },
    staff: { el: document.getElementById('staff-value'), format: v=>v },
    targets: { el: document.getElementById('targets-value'), format: v=>`${v}%` },
  };

  // sample initialisation (no fake business claims, neutral demo numbers)
  const sampleData = {
    revenue: 0,
    appointments: 0,
    rebook: 0,
    reviews: { rating: 0, count: 0 },
    staff: '—',
    targets: 0,
  };

  // Sample clients (demo data)
  const sampleClients = [
    { id: 'c1', name: 'Luca Romano', lastVisit: '2026-07-15', preferredBarber: 'Marco', rebook: 'Yes', contact: 'luca@example.com', phone: '+1 555 0123', notes: 'Prefers quiet room. Likes beard trim.', appointments: [{date:'2026-07-15', service:'Haircut'},{date:'2026-06-10', service:'Beard Trim'}], nextBooking: '2026-08-12' },
    { id: 'c2', name: 'James Carter', lastVisit: '2026-07-02', preferredBarber: 'Ethan', rebook: 'No', contact: 'j.carter@example.com', phone: '+1 555 0456', notes: 'Early morning client.', appointments: [{date:'2026-07-02', service:'Full Service'}], nextBooking: '—' },
    { id: 'c3', name: 'Owen Park', lastVisit: '2026-07-18', preferredBarber: 'Marco', rebook: 'Yes', contact: 'owen@example.com', phone: '+1 555 0789', notes: 'Allergic to certain products.', appointments: [{date:'2026-07-18', service:'Beard'}, {date:'2026-05-20', service:'Haircut'}], nextBooking: '2026-09-01' }
  ];

  // Sample appointments (demo data)
  const sampleAppointments = [
    { id: 'a1', time: '09:00', client: 'Luca Romano', barber: 'Marco', service: 'Haircut', status: 'Confirmed', price: 65, duration: 45, phone: '+1 555 0123', notes: 'Prefers quiet.' },
    { id: 'a2', time: '10:30', client: 'James Carter', barber: 'Ethan', service: 'Full Service', status: 'Checked In', price: 95, duration: 60, phone: '+1 555 0456', notes: '' },
    { id: 'a3', time: '13:00', client: 'Owen Park', barber: 'Marco', service: 'Beard Trim', status: 'Completed', price: 35, duration: 30, phone: '+1 555 0789', notes: 'Uses hypoallergenic products.' }
  ];

  // Sample revenue dashboard data
  const sampleRevenue = {
    today: 1385,
    week: 8250,
    month: 34210,
    avgTicket: 78,
    trend: [980, 1040, 1120, 1070, 1150, 1220, 1180, 1240, 1310, 1390, 1450, 1500, 1420, 1480, 1520, 1570, 1640, 1690, 1720, 1780, 1840, 1880, 1930, 1970, 2000, 2040, 2060, 2120, 2180, 2250],
    services: [
      { name: 'Haircut', revenue: 18240 },
      { name: 'Full Service', revenue: 12760 },
      { name: 'Beard Trim', revenue: 8200 },
      { name: 'Color', revenue: 6200 },
      { name: 'Signature Package', revenue: 5100 }
    ],
    productSales: [
      { name: 'Studio Pomade', revenue: 710 },
      { name: 'Luxury Shampoo', revenue: 540 },
      { name: 'Aftershave Gel', revenue: 420 }
    ],
    paymentBreakdown: [
      { method: 'Card', amount: 18640 },
      { method: 'Cash', amount: 9300 },
      { method: 'Online', amount: 6280 }
    ],
    transactions: [
      { time: '09:00', client: 'Luca Romano', service: 'Haircut', barber: 'Marco', amount: 65 },
      { time: '10:30', client: 'James Carter', service: 'Full Service', barber: 'Ethan', amount: 95 },
      { time: '12:00', client: 'Miles Dean', service: 'Color', barber: 'Ethan', amount: 120 },
      { time: '14:00', client: 'Noah Reed', service: 'Signature Package', barber: 'Marco', amount: 160 },
      { time: '16:30', client: 'Owen Park', service: 'Beard Trim', barber: 'Marco', amount: 35 }
    ]
  };

  function updateKPI(key, data){
    if(!kpi[key]) return;
    const cfg = kpi[key];
    cfg.el.textContent = cfg.format(data);
    // subtle pop when value updates
    cfg.el.classList.add('animated');
    setTimeout(()=>cfg.el.classList.remove('animated'), 380);
  }

  // simple demo animation to show live-ready cards (keeps values neutral)
  setTimeout(()=>{
    updateKPI('revenue', 0);
    updateKPI('appointments', 0);
    updateKPI('rebook', 0);
    updateKPI('reviews', {rating: 0, count: 0});
    updateKPI('staff', '—');
    updateKPI('targets', 0);
  }, 200);

  const jarvis = document.getElementById('jarvis');
  jarvis.addEventListener('click', ()=>{
    jarvis.classList.toggle('active');
    if(jarvis.classList.contains('active')){
      jarvis.setAttribute('aria-pressed','true');
      jarvis.querySelector('.label').textContent = 'Listening…';
      setTimeout(()=>{
        jarvis.classList.remove('active');
        jarvis.querySelector('.label').textContent = 'Jarvis';
        jarvis.setAttribute('aria-pressed','false');
      },3200);
    }
  });

  const focus = document.querySelector('.focus-panel');
  focus.addEventListener('click', ()=>{
    focus.style.transform = 'translateY(-2px)';
    setTimeout(()=>{focus.style.transform='';},450);
  });

  // Sidebar collapse
  const sidebar = document.getElementById('sidebar');
  const collapse = document.getElementById('collapse');
  collapse.addEventListener('click', ()=>{
    sidebar.classList.toggle('collapsed');
  });

  // KPI cards clickable to open detail overlay
  const detailOverlay = document.getElementById('detail-overlay');
  const detailContent = document.getElementById('detail-content');
  const detailClose = document.getElementById('detail-close');

  function openDetail(module){
    detailOverlay.setAttribute('aria-hidden','false');
    document.body.style.overflow = 'hidden';
    const key = String(module).toLowerCase().trim();
    if(key === 'clients'){
      renderClients();
      return;
    }
    if(key === 'appointments'){
      renderAppointments();
      return;
    }
    if(key === 'revenue'){
      renderRevenue();
      return;
    }
    detailContent.innerHTML = `<h1>${module}</h1><p>Detailed ${module} view — ready to connect to your data sources. Focused, minimal and full-bleed for executive review.</p>`;
  }

  function closeDetail(){
    detailOverlay.setAttribute('aria-hidden','true');
    detailContent.innerHTML = '';
    document.body.style.overflow = '';
  }

  detailClose.addEventListener('click', closeDetail);
  detailOverlay.addEventListener('click', (e)=>{ if(e.target===detailOverlay) closeDetail(); });
  window.addEventListener('keydown', (e)=>{ if(e.key==='Escape') closeDetail(); });

  // attach click handlers to nav items and KPI cards
  const navTitleMap = {
    revenue: 'Revenue',
    appointments: 'Appointments',
    clients: 'Clients',
    rebook: 'Rebooking',
    reviews: 'Reviews',
    staff: 'Team',
    targets: 'Daily Targets'
  };
  document.querySelectorAll('.nav-item').forEach(btn=>{
    btn.addEventListener('click', ()=>{
      const key = btn.dataset.target || btn.textContent.trim().toLowerCase();
      const title = navTitleMap[key] || btn.textContent.trim();
      openDetail(title);
    });
  });
  document.querySelectorAll('.kpi-card').forEach(card=>{
    card.addEventListener('click', ()=>{
      const id = card.id || card.dataset.target;
      const title = card.querySelector('.kpi-label')?.textContent || 'Detail';
      openDetail(title);
    });
  });

  // Clients renderer
  function renderClients(){
    detailContent.innerHTML = `
      <div class="clients-shell">
        <aside class="clients-column">
          <div class="clients-search">
            <input id="client-search" placeholder="Search clients" aria-label="Search clients" />
            <button id="add-client-btn" class="add-client">Add client</button>
          </div>
          <div class="clients-list" id="clients-list"></div>
          <small style="display:block;margin-top:8px;color:var(--muted)">Demo data — not real clients</small>
        </aside>
        <section class="profile-panel" id="profile-panel">
          <div class="profile-header"><h2>Select a client</h2></div>
          <div class="profile-body"><p class="muted">Select a client to view contact details, appointment history and notes.</p></div>
        </section>
      </div>
    `;

    const listEl = document.getElementById('clients-list');
    const searchEl = document.getElementById('client-search');
    const addBtn = document.getElementById('add-client-btn');

    function renderList(filter=''){
      listEl.innerHTML = '';
      const shown = sampleClients.filter(c=>c.name.toLowerCase().includes(filter.toLowerCase()));
      shown.forEach(c=>{
        const row = document.createElement('div');
        row.className = 'client-row';
        row.dataset.id = c.id;
        row.innerHTML = `
          <div>
            <strong>${c.name}</strong>
            <small>Last visit: ${c.lastVisit}</small>
          </div>
          <div class="client-meta">
            <span>${c.preferredBarber}</span>
            <span>${c.rebook === 'Yes' ? 'Rebooked' : 'No rebook'}</span>
          </div>
        `;
        row.addEventListener('click', ()=>showClientProfile(c));
        listEl.appendChild(row);
      });
      if(shown.length===0) listEl.innerHTML = '<small style="color:var(--muted)">No clients found</small>';
    }

    function showClientProfile(c){
      const panel = document.getElementById('profile-panel');
      panel.innerHTML = `
        <div class="profile-header"><h2>${c.name}</h2><div class="client-meta"><small>Preferred: ${c.preferredBarber}</small></div></div>
        <div class="profile-section"><h4>Contact</h4><p>${c.contact} • ${c.phone}</p></div>
        <div class="profile-section"><h4>Last visit</h4><p>${c.lastVisit}</p></div>
        <div class="profile-section"><h4>Next booking</h4><p>${c.nextBooking}</p></div>
        <div class="profile-section"><h4>Appointment history</h4><div class="appointment-list">${c.appointments.map(a=>`<div class="appointment-item"><strong>${a.date}</strong> — ${a.service}</div>`).join('')}</div></div>
        <div class="profile-section"><h4>Notes</h4><p>${c.notes}</p></div>
      `;
    }

    // initial render
    renderList();

    searchEl.addEventListener('input', ()=>renderList(searchEl.value.trim()));

    addBtn.addEventListener('click', ()=>{
      const name = prompt('Add client (demo): Enter full name');
      if(!name) return;
      const id = 'c' + (sampleClients.length + 1);
      const newClient = { id, name, lastVisit: '—', preferredBarber: '—', rebook: 'No', contact: '—', phone: '—', notes: 'New demo client', appointments: [], nextBooking: '—' };
      sampleClients.unshift(newClient);
      renderList();
      showClientProfile(newClient);
    });
  }

  // Appointments renderer
  function renderAppointments(){
    detailContent.innerHTML = `
      <div class="clients-shell appointments-shell">
        <aside class="clients-column">
          <div class="clients-search">
            <input id="appt-date" type="date" value="${new Date().toISOString().slice(0,10)}" aria-label="Select date" />
            <button id="new-appt-btn" class="add-client">New Appointment</button>
          </div>
          <div class="clients-list" id="appt-list"></div>
          <small style="display:block;margin-top:8px;color:var(--muted)">Demo appointments — sample data only</small>
        </aside>
        <section class="profile-panel" id="appt-panel">
          <div class="profile-header"><h2>Today’s Schedule</h2></div>
          <div class="profile-body"><div class="timeline" id="timeline"></div></div>
        </section>
      </div>
    `;

    const listEl = document.getElementById('appt-list');
    const dateEl = document.getElementById('appt-date');
    const newBtn = document.getElementById('new-appt-btn');
    const timeline = document.getElementById('timeline');

    function renderList(){
      listEl.innerHTML = '';
      // simple list view of appointments
      sampleAppointments.forEach(a=>{
        const row = document.createElement('div');
        row.className = 'client-row';
        row.dataset.id = a.id;
        row.innerHTML = `
          <div>
            <strong>${a.time} — ${a.client}</strong>
            <small>${a.service} • ${a.barber}</small>
          </div>
          <div class="client-meta">
            <span class="status-pill ${statusClass(a.status)}">${a.status}</span>
          </div>
        `;
        row.addEventListener('click', ()=>showAppointmentDetail(a));
        listEl.appendChild(row);
      });
    }

    function statusClass(s){
      if(!s) return '';
      return s.toLowerCase().includes('confirm') ? 'status-confirmed' : s.toLowerCase().includes('check') ? 'status-checked' : 'status-completed';
    }

    function renderTimeline(){
      timeline.innerHTML = '';
      // hours 8-20
      for(let h=8; h<=20; h++){
        const hour = String(h).padStart(2,'0')+':00';
        const slot = document.createElement('div');
        slot.className = 'slot';
        slot.dataset.hour = hour;
        slot.innerHTML = `<div class="slot-time">${formatHour(h)}</div><div class="slot-body" id="slot-${h}"></div>`;
        timeline.appendChild(slot);
      }
      // populate appointments
      sampleAppointments.forEach(a=>{
        const hour = parseInt(a.time.split(':')[0],10);
        const container = document.getElementById('slot-'+hour);
        if(container){
          const ap = document.createElement('div');
          ap.className = 'appt '+ statusClass(a.status);
          ap.innerHTML = `<strong>${a.time} — ${a.client}</strong><small>${a.service} • ${a.barber}</small>`;
          ap.addEventListener('click',(e)=>{ e.stopPropagation(); showAppointmentDetail(a); });
          container.appendChild(ap);
        }
      });
    }

    function formatHour(h){
      const am = h<12;
      const hour = ((h+11)%12)+1;
      return `${hour}:00 ${am? 'AM':'PM'}`;
    }

    function showAppointmentDetail(a){
      const panel = document.getElementById('appt-panel');
      panel.innerHTML = `
        <div class="profile-header"><h2>${a.client}</h2><div class="client-meta"><small>${a.time} • ${a.service}</small></div></div>
        <div class="profile-section"><h4>Client</h4><p>${a.client}</p></div>
        <div class="profile-section"><h4>Phone</h4><p>${a.phone}</p></div>
        <div class="profile-section"><h4>Service</h4><p>${a.service}</p></div>
        <div class="profile-section"><h4>Barber</h4><p>${a.barber}</p></div>
        <div class="profile-section"><h4>Price</h4><p>$${a.price}</p></div>
        <div class="profile-section"><h4>Duration</h4><p>${a.duration} minutes</p></div>
        <div class="profile-section"><h4>Notes</h4><p>${a.notes || '—'}</p></div>
      `;
    }

    // initial render
    renderList(); renderTimeline();

    newBtn.addEventListener('click', ()=>{
      const client = prompt('New appointment (demo): Client name');
      if(!client) return;
      const time = prompt('Time (HH:MM) e.g. 14:30', '12:00') || '12:00';
      const id = 'a' + (sampleAppointments.length + 1);
      const newAp = { id, time, client, barber: 'TBD', service: 'Custom', status: 'Confirmed', price: 0, duration: 30, phone: '—', notes: '' };
      sampleAppointments.push(newAp);
      renderList(); renderTimeline();
      showAppointmentDetail(newAp);
    });
  }

  function renderRevenue(){
    detailContent.innerHTML = `
      <div class="revenue-shell">
        <div class="revenue-header">
          <div>
            <p class="eyebrow">Revenue</p>
            <h1>Financial overview</h1>
          </div>
          <div class="export-actions">
            <button class="export-btn">Export CSV</button>
            <button class="export-btn">Export PDF</button>
          </div>
        </div>

        <div class="revenue-summary">
          <article class="revenue-card"><p>Today's revenue</p><strong>$${sampleRevenue.today.toLocaleString()}</strong></article>
          <article class="revenue-card"><p>This week</p><strong>$${sampleRevenue.week.toLocaleString()}</strong></article>
          <article class="revenue-card"><p>This month</p><strong>$${sampleRevenue.month.toLocaleString()}</strong></article>
          <article class="revenue-card"><p>Avg ticket</p><strong>$${sampleRevenue.avgTicket}</strong></article>
        </div>

        <div class="revenue-grid">
          <section class="revenue-chart-panel">
            <div class="chart-header"><p class="eyebrow">30-day trend</p></div>
            <div class="revenue-chart" id="revenue-chart"></div>
          </section>

          <section class="revenue-insights">
            <div class="insight-card">
              <p class="eyebrow">Top services</p>
              <div class="service-list">${sampleRevenue.services.map(s=>`<div class="service-item"><span>${s.name}</span><strong>$${s.revenue.toLocaleString()}</strong></div>`).join('')}</div>
            </div>
            <div class="insight-card">
              <p class="eyebrow">Product sales</p>
              <div class="service-list">${sampleRevenue.productSales.map(p=>`<div class="service-item"><span>${p.name}</span><strong>$${p.revenue.toLocaleString()}</strong></div>`).join('')}</div>
            </div>
            <div class="insight-card">
              <p class="eyebrow">Payment methods</p>
              <div class="payment-breakdown">${sampleRevenue.paymentBreakdown.map(p=>`<div class="payment-row"><span>${p.method}</span><strong>$${p.amount.toLocaleString()}</strong></div>`).join('')}</div>
            </div>
          </section>
        </div>

        <section class="transaction-panel">
          <div class="transaction-header"><p class="eyebrow">Recent transactions</p></div>
          <div class="transaction-list">${sampleRevenue.transactions.map(t=>`<div class="transaction-row"><span>${t.time}</span><span>${t.client}</span><span>${t.service}</span><span>${t.barber}</span><strong>$${t.amount}</strong></div>`).join('')}</div>
        </section>
      </div>
    `;

    document.querySelectorAll('.export-btn').forEach(btn => {
      btn.addEventListener('click', ()=>alert('Export placeholder — demo only'));
    });

    renderRevenueChart();
  }

  function renderRevenueChart(){
    const chart = document.getElementById('revenue-chart');
    const data = sampleRevenue.trend;
    const width = 560;
    const height = 210;
    const max = Math.max(...data);
    const min = Math.min(...data);
    const points = data.map((value,index)=>{
      const x = 40 + index * ((width - 60)/(data.length - 1));
      const y = height - 28 - ((value - min)/(max - min)) * (height - 60);
      return `${x},${y}`;
    }).join(' ');
    chart.innerHTML = `
      <svg viewBox="0 0 ${width} ${height}" width="100%" height="100%" aria-hidden="true">
        <defs><linearGradient id="lineGrad" x1="0" y1="0" x2="1" y2="0"><stop offset="0%" stop-color="#2FC05A"/><stop offset="100%" stop-color="#0ec26a"/></linearGradient></defs>
        <path d="M${points}" fill="none" stroke="url(#lineGrad)" stroke-width="3" stroke-linecap="round" stroke-linejoin="round" />
        ${data.map((value,index)=>{
          const x = 40 + index * ((width - 60)/(data.length - 1));
          const y = height - 28 - ((value - min)/(max - min)) * (height - 60);
          return `<circle cx="${x}" cy="${y}" r="4" fill="#2FC05A" />`;
        }).join('')}
      </svg>
    `;
  }
});
