document.addEventListener('DOMContentLoaded', ()=>{
  const today = document.getElementById('today');
  const d = new Date();
  today.textContent = d.toLocaleDateString(undefined,{weekday:'short', month:'short', day:'numeric'});

  const healthEl = document.getElementById('health');
  let target = 92;
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
    detailContent.innerHTML = `<h1>${module}</h1><p>Detailed ${module} view — ready to connect to your data sources. Focused, minimal and full-bleed for executive review.</p>`;
    document.body.style.overflow = 'hidden';
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
  document.querySelectorAll('.nav-item').forEach(btn=>{
    btn.addEventListener('click', ()=>openDetail(btn.textContent.trim()));
  });
  document.querySelectorAll('.kpi-card').forEach(card=>{
    card.addEventListener('click', ()=>{
      const id = card.id || card.dataset.target;
      const title = card.querySelector('.kpi-label')?.textContent || 'Detail';
      openDetail(title);
    });
  });
});
