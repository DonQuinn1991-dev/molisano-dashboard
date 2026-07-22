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
