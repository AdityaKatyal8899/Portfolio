// Smooth scroll offset fix for fixed navbar
const navHeight = 64; // approx
document.querySelectorAll('a[href^="#"]').forEach(a => {
  a.addEventListener('click', (e) => {
    const target = document.querySelector(a.getAttribute('href'));
    if(target){
      e.preventDefault();
      const y = target.getBoundingClientRect().top + window.scrollY - (navHeight - 8);
      window.scrollTo({ top: y, behavior: 'smooth' });
    }
  });
});

// Mode toggle (Normal vs Calm)
const body = document.body;
const switchEl = document.getElementById('modeSwitch');
const loaderEl = document.getElementById('matrixLoader');
const overlayEl = document.getElementById('overlay');
function applyMode(mode){
  if(mode === 'normal') { body.classList.remove('calm'); body.classList.add('normal'); }
  else { body.classList.remove('normal'); body.classList.add('calm'); }
  localStorage.setItem('mode', mode);
}
// Initialize mode: always Calm (mode switch removed)
const saved = 'calm';
applyMode(saved);
if (switchEl) switchEl.setAttribute('aria-checked', saved === 'calm');
function toggleMode(){
  const next = body.classList.contains('calm') ? 'normal' : 'calm';
  // Show loader for both directions
  if (overlayEl){ overlayEl.classList.add('show'); }
  if (loaderEl){ loaderEl.style.display = 'grid'; }
  const toCalm = (next === 'calm');
  disableCalmEffects();
  applyMode(next);
  if (switchEl) switchEl.setAttribute('aria-checked', toCalm);
  setTimeout(()=>{
    if (loaderEl){ loaderEl.style.display = 'none'; }
    if (overlayEl){ overlayEl.classList.remove('show'); }
    if (toCalm){ enableCalmEffects(); }
  }, 2000);
}
if (switchEl){
  switchEl.addEventListener('click', toggleMode);
  switchEl.addEventListener('keydown', (e)=>{ if(e.key==='Enter' || e.key===' ') { e.preventDefault(); toggleMode(); } });
}

// Particles (Calm only)
const canvas = document.getElementById('particles');
let ctx = null, particles = [], rafId = null;
function initParticles(){
  if(!canvas) return;
  ctx = canvas.getContext('2d');
  resizeCanvas();
  particles = [];
  const colors = ['#f72585','#7209b7','#3f8efc'];
  const count = 80; // Increase this value for higher density
  for(let i=0;i<count;i++){
    particles.push({ x:Math.random()*canvas.width, y:Math.random()*canvas.height, r:1+Math.random()*2, vx:(Math.random()-.5)*0.4, vy:(Math.random()-.5)*0.4, c: colors[(Math.random()*colors.length)|0] });
  }
  if(rafId) cancelAnimationFrame(rafId);
  loopParticles();
}
function resizeCanvas(){ if(!canvas) return; canvas.width = canvas.offsetWidth; canvas.height = canvas.offsetHeight; }
window.addEventListener('resize', ()=>{ if(body.classList.contains('calm')){ resizeCanvas(); } });
function loopParticles(){
  if(!ctx) return;
  ctx.clearRect(0,0,canvas.width,canvas.height);
  particles.forEach(p=>{
    p.x += p.vx; p.y += p.vy;
    if(p.x<0) p.x = canvas.width; if(p.x>canvas.width) p.x = 0;
    if(p.y<0) p.y = canvas.height; if(p.y>canvas.height) p.y = 0;
    const g = ctx.createRadialGradient(p.x,p.y,0,p.x,p.y,p.r*5);
    g.addColorStop(0,p.c); g.addColorStop(1,'rgba(0,0,0,0)');
    ctx.fillStyle = g; ctx.beginPath(); ctx.arc(p.x,p.y,p.r,0,Math.PI*2); ctx.fill();
  });
  rafId = requestAnimationFrame(loopParticles);
}
function stopParticles(){ if(rafId){ cancelAnimationFrame(rafId); rafId=null; } if(ctx){ ctx.clearRect(0,0,canvas.width,canvas.height); } }

// Sakura petals (Calm only)
const observer = new IntersectionObserver((entries)=>{
  entries.forEach(en=>{
    if(en.isIntersecting){
      en.target.classList.add('show');
      if(en.target.id === 'skillsWrap'){
        en.target.querySelectorAll('.bar').forEach(b=>{
          const lvl = b.getAttribute('data-level') || '70';
          const fill = b.querySelector('.fill');
          requestAnimationFrame(()=>{ fill.style.width = lvl + '%'; });
        });
      }
      observer.unobserve(en.target);
    }
  });
}, { threshold: 0.25 });
document.querySelectorAll('.reveal').forEach(el=> observer.observe(el));

// Calm effects toggling (particles + parallax only)
function enableCalmEffects(){
  // Particles
  initParticles();
  // Parallax
  parallaxActive = true;
  updateParallax();
}
function disableCalmEffects(){
  stopParticles();
  // Reset parallax transforms
  document.querySelectorAll('.parallax-bg, .parallax-fg').forEach(el=>{ el.style.transform = ''; });
  parallaxActive = false;
}

// Parallax scrolling (only in Calm mode)
let parallaxActive = body.classList.contains('calm');
const sections = Array.from(document.querySelectorAll('section'));
function updateParallax(){
  if(!parallaxActive) return;
  const vh = window.innerHeight;
  const isMobile = window.matchMedia('(max-width: 720px)').matches;
  sections.forEach(sec=>{
    const rect = sec.getBoundingClientRect();
    const bg = sec.querySelector('.parallax-bg');
    const fg = sec.querySelector('.parallax-fg');
    if(!bg && !fg) return;
    const centerOffset = (rect.top + rect.height/2) - (vh/2);
    const bgSpeed = isMobile ? 0.15 : 0.30;
    const fgSpeed = isMobile ? 0.30 : 0.60;
    if(bg){ bg.style.transform = `translate3d(0, ${(-centerOffset*bgSpeed).toFixed(2)}px, 0)`; }
    if(fg){ fg.style.transform = `translate3d(0, ${(-centerOffset*fgSpeed).toFixed(2)}px, 0)`; }
  });
}
window.addEventListener('scroll', ()=>{ if(parallaxActive) updateParallax(); }, { passive:true });
window.addEventListener('resize', ()=>{ if(parallaxActive) updateParallax(); }, { passive:true });

// Initial overlay + loader on first load
window.addEventListener('load', ()=>{
  // Always show a short loader on initial load for consistency
  if (overlayEl){ overlayEl.classList.add('show'); }
  if (loaderEl){ loaderEl.style.display = 'grid'; }
  if (saved === 'calm') enableCalmEffects();
  setTimeout(()=>{
    if (loaderEl){ loaderEl.style.display = 'none'; }
    if (overlayEl){ overlayEl.classList.remove('show'); }
  }, 1200);
});

// Mobile hamburger menu (SVG checkbox)
const hamburger = document.getElementById('hamburger');
const navMenu = document.getElementById('primary-nav');
const navCheckbox = document.getElementById('navToggle');
function setMenu(open){
  if(!hamburger || !navMenu) return;
  hamburger.setAttribute('aria-expanded', String(open));
  navMenu.classList.toggle('show', open);
  if(navCheckbox) navCheckbox.checked = open;
}
if (navCheckbox && navMenu){
  navCheckbox.addEventListener('change', ()=>{ setMenu(navCheckbox.checked); });
}
// Fallback: toggle on label click as well
if (hamburger && !navCheckbox){
  hamburger.addEventListener('click', ()=>{ const open = hamburger.getAttribute('aria-expanded') !== 'true'; setMenu(open); });
}
// Hide menu on link click
if (navMenu){
  navMenu.querySelectorAll('a[href^="#"]').forEach(link=>{
    link.addEventListener('click', ()=> setMenu(false));
  });
}

// Contact form submission (client-only via mailto, no backend)
(function(){
  const form = document.querySelector('form[name="contact"]');
  const msgBox = document.getElementById('contactMsg');
  const sendBtn = form ? form.querySelector('button[type="submit"]') : null;

  if(!form || !msgBox) return;

  function renderSuccess(message){
    msgBox.innerHTML = `
    <div class="success">
      <div class="success__icon">
        <svg fill="none" height="24" viewBox="0 0 24 24" width="24" xmlns="http://www.w3.org/2000/svg"><path clip-rule="evenodd" d="m12 1c-6.075 0-11 4.925-11 11s4.925 11 11 11 11-4.925 11-11-4.925-11-11-11zm4.768 9.14c.0878-.1004.1546-.21726.1966-.34383.0419-.12657.0581-.26026.0477-.39319-.0105-.13293-.0475-.26242-.1087-.38085-.0613-.11844-.1456-.22342-.2481-.30879-.1024-.08536-.2209-.14938-.3484-.18828s-.2616-.0519-.3942-.03823c-.1327.01366-.2612.05372-.3782.1178-.1169.06409-.2198.15091-.3027.25537l-4.3 5.159-2.225-2.226c-.1886-.1822-.4412-.283-.7034-.2807s-.51301.1075-.69842.2929-.29058.4362-.29285.6984c-.00228.2622.09851.5148.28067.7034l3 3c.0983.0982.2159.1748.3454.2251.1295.0502.2681.0729.4069.0665.1387-.0063.2747-.0414.3991-.1032.1244-.0617.2347-.1487.3236-.2554z" fill="#84D65A" fill-rule="evenodd"></path></svg>
      </div>
      <div class="success__title">${message}</div>
      <div class="success__close" role="button" aria-label="Close alert"><svg height="20" viewBox="0 0 20 20" width="20" xmlns="http://www.w3.org/2000/svg"><path d="m15.8333 5.34166-1.175-1.175-4.6583 4.65834-4.65833-4.65834-1.175 1.175 4.65833 4.65834-4.65833 4.6583 1.175 1.175 4.65833-4.6583 4.6583 4.6583 1.175-1.175-4.6583-4.6583z" fill="#7cc769"></path></svg></div>
    </div>`;
    const closer = msgBox.querySelector('.success__close');
    if(closer) closer.addEventListener('click', ()=> msgBox.innerHTML = '');
  }

  function renderError(message){
    msgBox.innerHTML = `
    <div class="error">
      <div class="error__icon">
        <svg fill="none" height="24" viewBox="0 0 24 24" width="24" xmlns="http://www.w3.org/2000/svg"><path d="M12 0a12 12 0 1012 12A12.014 12.014 0 0012 0zm1 17h-2v-2h2zm0-4h-2V7h2z" fill="#ff4d6d"/></svg>
      </div>
      <div class="error__title">${message}</div>
      <div class="error__close" role="button" aria-label="Close alert"><svg height="20" viewBox="0 0 20 20" width="20" xmlns="http://www.w3.org/2000/svg"><path d="m15.8333 5.34166-1.175-1.175-4.6583 4.65834-4.65833-4.65834-1.175 1.175 4.65833 4.65834-4.65833 4.6583 1.175 1.175 4.65833-4.6583 4.6583 4.6583 1.175-1.175-4.6583-4.6583z" fill="#ffb0bf"></path></svg></div>
    </div>`;
    const closer = msgBox.querySelector('.error__close');
    if(closer) closer.addEventListener('click', ()=> msgBox.innerHTML = '');
  }

  form.addEventListener('submit', async (e)=>{
    e.preventDefault();
    // Collect and validate inputs
    const name = (form.name?.value || '').trim();
    const email = (form.email?.value || '').trim();
    const message = (form.message?.value || '').trim();
    if(!name || !email || !message){
      renderError('All fields (name, email, message) are required.');
      return;
    }

    // animate button and disable during send
    if (sendBtn){ sendBtn.disabled = true; sendBtn.dataset.originalText = sendBtn.textContent; sendBtn.textContent = 'Sending...'; }

    try{
      const to = (form.querySelector('input[name="to_email"]')?.value || '').trim();
      const subject = (form.querySelector('input[name="subject"]')?.value || 'New message from Portfolio').trim();
      const body = `Name: ${name}\nEmail: ${email}\n\nMessage:\n${message}`;

      const mailto = new URL('mailto:' + encodeURIComponent(to || ''));
      mailto.searchParams.set('subject', subject);
      mailto.searchParams.set('body', body);

      // Open default mail client
      window.location.href = mailto.toString();
      renderSuccess('Opening your email client to send the message...');
      form.reset();
    } catch(err){
      console.error('Mailto error:', err);
      renderError('Could not open your email client. Please send an email manually.');
    } finally {
      if (sendBtn){ sendBtn.disabled = false; sendBtn.textContent = sendBtn.dataset.originalText || 'Send'; }
    }
  });
})();

