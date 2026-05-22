/* TITAN — shared JS across all pages
 * - i18n (EN/AR) toggle with dir switching
 * - theme toggle (light/dark)
 * - reveal-on-scroll observer
 * - nav scrolled state
 * - mobile menu
 * - newsletter form
 */

(function(){
  'use strict';

  /* ─────────── REVEAL OBSERVER ─────────── */
  function setupReveal(){
    const els = document.querySelectorAll('.reveal, .reveal-line, .reveal-img, .divider');
    const io = new IntersectionObserver((entries)=>{
      entries.forEach(e=>{
        if(e.isIntersecting){
          e.target.classList.add('is-visible');
          io.unobserve(e.target);
        }
      });
    }, { threshold:0.12, rootMargin:'0px 0px -6% 0px' });
    els.forEach(el=>io.observe(el));
  }

  /* ─────────── NAV ─────────── */
  function setupNav(){
    const nav = document.getElementById('nav');
    if(!nav) return;
    const onScroll = ()=>{ nav.classList.toggle('scrolled', window.scrollY > 30); };
    window.addEventListener('scroll', onScroll, { passive:true });
    onScroll();

    // mark active link
    const path = location.pathname.split('/').pop() || 'index.html';
    nav.querySelectorAll('.nav-links a, .mobile-menu-links a').forEach(a=>{
      const href = a.getAttribute('href');
      if(href === path || (path === '' && href === 'index.html')){
        a.classList.add('is-active');
      }
    });
  }

  /* ─────────── MOBILE MENU ─────────── */
  function setupMobileMenu(){
    const menu = document.getElementById('mobileMenu');
    const btnOpen = document.getElementById('menuBtn');
    const btnClose = document.getElementById('menuClose');
    if(!menu) return;
    btnOpen?.addEventListener('click', ()=> menu.classList.add('open'));
    btnClose?.addEventListener('click', ()=> menu.classList.remove('open'));
    menu.querySelectorAll('a').forEach(a=> a.addEventListener('click', ()=> menu.classList.remove('open')));
  }

  /* ─────────── LANGUAGE TOGGLE ─────────── */
  // i18n strings are page-specific and loaded from each page's window.I18N
  let currentLang = localStorage.getItem('titan-lang') || 'en';

  function applyLang(lang){
    const html = document.documentElement;
    html.setAttribute('lang', lang);
    html.setAttribute('dir', lang === 'ar' ? 'rtl' : 'ltr');

    const dict = (window.I18N && window.I18N[lang]) || {};
    document.querySelectorAll('[data-i18n]').forEach(el=>{
      const key = el.getAttribute('data-i18n');
      if(dict[key] !== undefined){
        el.innerHTML = dict[key];
      }
    });
    document.querySelectorAll('[data-i18n-attr]').forEach(el=>{
      const attr = el.getAttribute('data-i18n-attr');
      const key = el.getAttribute('data-i18n');
      if(dict[key] !== undefined) el.setAttribute(attr, dict[key]);
    });

    const curEl = document.getElementById('langCurrent');
    const othEl = document.getElementById('langOther');
    if(curEl) curEl.textContent = lang === 'en' ? 'EN' : 'ع';
    if(othEl) othEl.textContent = lang === 'en' ? 'ع' : 'EN';

    localStorage.setItem('titan-lang', lang);
    currentLang = lang;
    // notify page-specific code
    document.dispatchEvent(new CustomEvent('titan:lang-changed', { detail:{ lang } }));
  }

  function setupLangToggle(){
    const btn = document.getElementById('langToggle');
    if(!btn) return;
    btn.addEventListener('click', ()=> applyLang(currentLang === 'en' ? 'ar' : 'en'));
  }

  /* ─────────── THEME ─────────── */
  function applyTheme(theme){
    document.documentElement.setAttribute('data-theme', theme);
    const icon = document.getElementById('themeIcon');
    if(icon){
      if(theme === 'dark'){
        icon.innerHTML = '<path d="M21 12.79A9 9 0 1 1 11.21 3 7 7 0 0 0 21 12.79z" stroke="currentColor" stroke-width="2" fill="none" stroke-linejoin="round"/>';
      } else {
        icon.innerHTML = '<circle cx="12" cy="12" r="4" stroke="currentColor" stroke-width="2" fill="none"/><path d="M12 2v2M12 20v2M4.93 4.93l1.41 1.41M17.66 17.66l1.41 1.41M2 12h2M20 12h2M4.93 19.07l1.41-1.41M17.66 6.34l1.41-1.41" stroke="currentColor" stroke-width="2" fill="none"/>';
      }
    }
    localStorage.setItem('titan-theme', theme);
  }

  function setupThemeToggle(){
    const btn = document.getElementById('themeToggle');
    if(!btn) return;
    btn.addEventListener('click', ()=>{
      const cur = document.documentElement.getAttribute('data-theme') || 'light';
      applyTheme(cur === 'dark' ? 'light' : 'dark');
    });
  }

  /* ─────────── NEWSLETTER ─────────── */
  function setupNewsletter(){
    const form = document.getElementById('newsletterForm');
    if(!form) return;
    form.addEventListener('submit', (e)=>{
      e.preventDefault();
      const email = document.getElementById('nlEmail').value.trim();
      const status = document.getElementById('nlStatus');
      const dict = (window.I18N && window.I18N[currentLang]) || {};
      if(!/^[^@]+@[^@]+\.[^@]+$/.test(email)){
        status.textContent = dict['footer.nl.error'] || '// INVALID EMAIL';
        status.style.color = '#C2533A';
        return;
      }
      status.style.color = 'var(--ink)';
      status.textContent = dict['footer.nl.success'] || '// SUBSCRIBED. WELCOME.';
      form.reset();
    });
  }

  /* ─────────── COUNTER ANIMATIONS ─────────── */
  function setupCounters(){
    const grids = document.querySelectorAll('[data-counters]');
    grids.forEach(grid=>{
      const cio = new IntersectionObserver(entries=>{
        entries.forEach(e=>{
          if(e.isIntersecting){
            e.target.querySelectorAll('.counter').forEach((el,i)=>{
              const to = parseFloat(el.dataset.to);
              const dur = 1600 + i*80;
              const start = performance.now();
              const ease = t => 1 - Math.pow(1-t, 3);
              function tick(now){
                const t = Math.min(1, (now-start)/dur);
                el.textContent = Math.round(ease(t)*to).toString();
                if(t<1) requestAnimationFrame(tick);
              }
              requestAnimationFrame(tick);
            });
            cio.unobserve(e.target);
          }
        });
      }, { threshold:0.3 });
      cio.observe(grid);
    });
  }

  /* ─────────── INIT ─────────── */
  document.addEventListener('DOMContentLoaded', ()=>{
    setupReveal();
    setupNav();
    setupMobileMenu();
    setupLangToggle();
    setupThemeToggle();
    setupNewsletter();
    setupCounters();

    // Apply stored preferences
    applyTheme(localStorage.getItem('titan-theme') || 'light');
    applyLang(currentLang);
  });

  // Expose helpers globally
  window.TITAN = { applyLang, applyTheme, setupReveal, setupCounters };
})();
