/* TITAN — shared JS for all subpages */
(function(){
'use strict';

/* PROGRESS BAR */
const spb = document.getElementById('spb');
if(spb){
  window.addEventListener('scroll',()=>{
    const max = document.body.scrollHeight - window.innerHeight;
    spb.style.width = (max>0 ? window.scrollY/max*100 : 0)+'%';
  },{passive:true});
}

/* NAV SCROLL STATE */
const nav = document.querySelector('nav');
if(nav){
  const onScroll = () => nav.classList.toggle('scrolled', window.scrollY > 40);
  window.addEventListener('scroll', onScroll, {passive:true});
  onScroll();
  // Active link
  const path = location.pathname.split('/').pop();
  nav.querySelectorAll('.nlinks a').forEach(a=>{
    if(a.getAttribute('href') === path) a.classList.add('active');
  });
}

/* REVEAL ON SCROLL */
const revEls = Array.from(document.querySelectorAll('.r,.rl,.ri,.divider'));
function checkReveal(){
  const vh = window.innerHeight;
  revEls.forEach(el=>{
    if(el.classList.contains('v')) return;
    const top = el.getBoundingClientRect().top;
    if(top < vh * 0.9) el.classList.add('v');
  });
}
window.addEventListener('scroll', checkReveal, {passive:true});
window.addEventListener('resize', checkReveal);
checkReveal();

/* HERO PARALLAX */
const heroBg = document.querySelector('.page-hero-bg img');
const heroContent = document.querySelector('.page-hero-content');
if(heroBg){
  let raf = false;
  window.addEventListener('scroll',()=>{
    if(raf) return; raf=true;
    requestAnimationFrame(()=>{
      const y = window.scrollY;
      heroBg.style.transform = `scale(1.08) translateY(${y*.12}px)`;
      if(heroContent){
        heroContent.style.opacity = Math.max(0, 1-y/(window.innerHeight*.7));
        heroContent.style.transform = `translateY(${y*.08}px)`;
      }
      raf=false;
    });
  },{passive:true});
}

/* COUNTERS */
let cDone = {};
document.querySelectorAll('[data-counters]').forEach(wrap=>{
  const io = new IntersectionObserver(entries=>{
    if(!entries[0].isIntersecting || cDone[wrap.id]) return;
    cDone[wrap.id] = true;
    wrap.querySelectorAll('.counter').forEach((el,i)=>{
      const to=parseFloat(el.dataset.to), dur=1800+i*130, t0=performance.now();
      const ease=t=>1-Math.pow(1-t,4);
      (function tk(now){ const t=Math.min(1,(now-t0)/dur); el.textContent=Math.round(ease(t)*to); if(t<1) requestAnimationFrame(tk); })(t0);
    });
    io.disconnect();
  },{threshold:.3});
  io.observe(wrap);
});

/* PAGE TRANSITION */
document.querySelectorAll('a[href]').forEach(a=>{
  const h=a.getAttribute('href');
  if(!h||h==='#'||h.startsWith('mailto')||h.startsWith('http')||h.startsWith('tel')) return;
  a.addEventListener('click',e=>{
    e.preventDefault();
    document.body.style.transition='opacity .25s ease';
    document.body.style.opacity='0';
    setTimeout(()=>{ location.href=h; },230);
  });
});

/* NEWSLETTER */
document.querySelectorAll('form.fnl').forEach(form=>{
  form.addEventListener('submit',e=>{
    e.preventDefault();
    const inp = form.querySelector('input[type=email]');
    if(!inp||!/^[^@]+@[^@]+\.[^@]+$/.test(inp.value.trim())) return;
    inp.value='';
    const btn = form.querySelector('button');
    if(btn){ const orig=btn.textContent; btn.textContent='✓ Subscribed'; setTimeout(()=>btn.textContent=orig,2500); }
  });
});

})();
