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
});
