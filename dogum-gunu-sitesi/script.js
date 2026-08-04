/* =====================================================
   LOAD SEQUENCE
===================================================== */
window.addEventListener('load', () => {
  const loader = document.getElementById('loader');
  setTimeout(() => loader.classList.add('hidden'), 900);
});

/* =====================================================
   CURSOR GLOW (desktop only)
===================================================== */
const cursorGlow = document.getElementById('cursor-glow');
if (window.matchMedia('(hover:hover)').matches) {
  window.addEventListener('mousemove', (e) => {
    cursorGlow.style.left = e.clientX + 'px';
    cursorGlow.style.top = e.clientY + 'px';
    cursorGlow.classList.add('active');
  });
  document.addEventListener('mouseleave', () => cursorGlow.classList.remove('active'));
}

/* =====================================================
   PETAL FIELD — drifting rose petals
===================================================== */
(function createPetals(){
  const field = document.getElementById('petal-field');
  const petalCount = window.innerWidth < 640 ? 10 : 18;
  const glyphs = ['❀','✿','❁'];
  for (let i = 0; i < petalCount; i++) {
    const p = document.createElement('span');
    p.className = 'petal';
    p.textContent = glyphs[Math.floor(Math.random() * glyphs.length)];
    const left = Math.random() * 100;
    const duration = 14 + Math.random() * 16;
    const delay = Math.random() * -30;
    const size = 0.7 + Math.random() * 1.1;
    const drift = (Math.random() * 160 - 80) + 'px';
    p.style.left = left + 'vw';
    p.style.fontSize = size + 'rem';
    p.style.setProperty('--drift', drift);
    p.style.animationDuration = duration + 's';
    p.style.animationDelay = delay + 's';
    p.style.opacity = 0.35 + Math.random() * 0.4;
    field.appendChild(p);
  }
})();

/* =====================================================
   AMBIENT PARTICLE CANVAS — soft sparkling dots
===================================================== */
(function particleCanvas(){
  const canvas = document.getElementById('particle-canvas');
  const ctx = canvas.getContext('2d');
  let particles = [];
  let w, h;

  function resize(){
    w = canvas.width = window.innerWidth;
    h = canvas.height = window.innerHeight;
  }
  window.addEventListener('resize', resize);
  resize();

  const count = window.innerWidth < 640 ? 26 : 50;
  for (let i = 0; i < count; i++) {
    particles.push({
      x: Math.random() * w,
      y: Math.random() * h,
      r: Math.random() * 1.8 + 0.4,
      speed: Math.random() * 0.25 + 0.05,
      drift: (Math.random() - 0.5) * 0.3,
      alpha: Math.random() * 0.5 + 0.2,
      pulse: Math.random() * Math.PI * 2
    });
  }

  function tick(){
    ctx.clearRect(0, 0, w, h);
    particles.forEach(p => {
      p.y -= p.speed;
      p.x += p.drift;
      p.pulse += 0.02;
      if (p.y < -10) { p.y = h + 10; p.x = Math.random() * w; }
      if (p.x < -10) p.x = w + 10;
      if (p.x > w + 10) p.x = -10;
      const a = p.alpha * (0.6 + 0.4 * Math.sin(p.pulse));
      ctx.beginPath();
      ctx.fillStyle = `rgba(255, 220, 235, ${a})`;
      ctx.arc(p.x, p.y, p.r, 0, Math.PI * 2);
      ctx.fill();
    });
    requestAnimationFrame(tick);
  }
  tick();
})();

/* =====================================================
   SCROLL PROGRESS BAR
===================================================== */
const scrollFill = document.getElementById('scroll-indicator-fill');
window.addEventListener('scroll', () => {
  const scrollTop = window.scrollY;
  const docHeight = document.documentElement.scrollHeight - window.innerHeight;
  const pct = docHeight > 0 ? (scrollTop / docHeight) * 100 : 0;
  scrollFill.style.width = pct + '%';
}, { passive: true });

/* =====================================================
   LANDING -> EXPERIENCE TRANSITION
===================================================== */
const openGiftBtn = document.getElementById('open-gift-btn');
const landing = document.getElementById('landing');
const experience = document.getElementById('experience');

openGiftBtn.addEventListener('click', () => {
  landing.style.transition = 'opacity 1s ease, transform 1s ease';
  landing.style.opacity = '0';
  landing.style.transform = 'scale(0.98)';
  setTimeout(() => {
    landing.style.display = 'none';
    experience.classList.add('visible');
    document.getElementById('gallery').scrollIntoView({ behavior: 'smooth' });
  }, 850);
});

/* =====================================================
   SCROLL REVEAL ANIMATIONS
===================================================== */
const revealEls = document.querySelectorAll('[data-reveal]');
const revealObserver = new IntersectionObserver((entries) => {
  entries.forEach(entry => {
    if (entry.isIntersecting) {
      entry.target.classList.add('in-view');
      revealObserver.unobserve(entry.target);
    }
  });
}, { threshold: 0.15 });
revealEls.forEach(el => revealObserver.observe(el));

/* random polaroid rotation from data-rot attr */
document.querySelectorAll('.polaroid').forEach(p => {
  const rot = p.getAttribute('data-rot') || 0;
  p.style.setProperty('--rot', rot + 'deg');
});

/* =====================================================
   LIGHTBOX GALLERY
===================================================== */
const lightbox = document.getElementById('lightbox');
const lightboxImg = document.getElementById('lightbox-img');
const lightboxClose = document.getElementById('lightbox-close');
const lightboxBackdrop = document.getElementById('lightbox-backdrop');

document.querySelectorAll('.polaroid img').forEach(img => {
  img.addEventListener('click', () => {
    lightboxImg.src = img.src;
    lightboxImg.alt = img.alt;
    lightbox.classList.add('open');
    document.body.style.overflow = 'hidden';
  });
});
function closeLightbox(){
  lightbox.classList.remove('open');
  document.body.style.overflow = '';
}
lightboxClose.addEventListener('click', closeLightbox);
lightboxBackdrop.addEventListener('click', closeLightbox);
document.addEventListener('keydown', (e) => { if (e.key === 'Escape') closeLightbox(); });

/* =====================================================
   LOVE LETTER — envelope open + typewriter
===================================================== */
const envelope = document.getElementById('envelope');
const letterPaper = document.getElementById('letter-paper');
const letterSparkles = document.querySelector('.letter-sparkles');
let letterOpened = false;

envelope.addEventListener('click', () => {
  if (letterOpened) return;
  letterOpened = true;
  envelope.classList.add('opened');

  setTimeout(() => {
    letterPaper.classList.add('visible');
    spawnLetterSparkles();
    typewriterLetter();
  }, 650);
});

function spawnLetterSparkles(){
  for (let i = 0; i < 14; i++) {
    const s = document.createElement('span');
    s.textContent = '✦';
    s.style.position = 'absolute';
    s.style.left = Math.random() * 100 + '%';
    s.style.top = Math.random() * 100 + '%';
    s.style.fontSize = (0.5 + Math.random() * 0.6) + 'rem';
    s.style.color = 'rgba(217,161,90,0.7)';
    s.style.opacity = '0';
    s.style.transition = 'opacity 1.2s ease';
    s.style.animation = `heartbeat ${2 + Math.random()*2}s ease-in-out infinite`;
    letterSparkles.appendChild(s);
    setTimeout(() => { s.style.opacity = '1'; }, 100 + i * 80);
  }
}

function typewriterLetter(){
  const lines = document.querySelectorAll('.letter-line, .letter-signature');
  lines.forEach((line, idx) => {
    const fullText = line.textContent;
    line.textContent = '';
    line.style.opacity = '1';
    let i = 0;
    setTimeout(() => {
      const interval = setInterval(() => {
        line.textContent += fullText[i];
        i++;
        if (i >= fullText.length) clearInterval(interval);
      }, 22);
    }, idx * 900);
  });
}

/* =====================================================
   INTERACTIVE CRYSTAL HEART
===================================================== */
const crystalHeart = document.getElementById('crystal-heart');
const burstContainer = document.getElementById('heart-burst-container');
const secretMessage = document.getElementById('secret-message');
let heartClicked = false;

crystalHeart.addEventListener('click', () => {
  if (heartClicked) return;
  heartClicked = true;
  crystalHeart.classList.add('burst');

  const rect = crystalHeart.getBoundingClientRect();
  const stageRect = crystalHeart.closest('.heart-stage').getBoundingClientRect();
  const originX = rect.left - stageRect.left + rect.width / 2;
  const originY = rect.top - stageRect.top + rect.height / 2;

  for (let i = 0; i < 36; i++) {
    const mini = document.createElement('span');
    mini.className = 'mini-heart';
    mini.textContent = '❤';
    const angle = Math.random() * Math.PI * 2;
    const dist = 80 + Math.random() * 220;
    const tx = Math.cos(angle) * dist;
    const ty = Math.sin(angle) * dist;
    mini.style.left = originX + 'px';
    mini.style.top = originY + 'px';
    mini.style.fontSize = (0.7 + Math.random() * 1) + 'rem';
    mini.style.color = Math.random() > 0.5 ? '#d97ea0' : '#e9cf9e';
    mini.animate([
      { transform: 'translate(-50%,-50%) scale(0)', opacity: 0 },
      { transform: `translate(calc(-50% + ${tx*0.4}px), calc(-50% + ${ty*0.4}px)) scale(1)`, opacity: 1, offset: 0.35 },
      { transform: `translate(calc(-50% + ${tx}px), calc(-50% + ${ty}px)) scale(.4)`, opacity: 0 }
    ], { duration: 1400 + Math.random() * 600, easing: 'cubic-bezier(.22,.61,.36,1)' });
    burstContainer.appendChild(mini);
    setTimeout(() => mini.remove(), 2200);
  }

  setTimeout(() => {
    secretMessage.classList.add('visible');
  }, 500);
});

/* =====================================================
   MUSIC PLAYER
===================================================== */
const musicToggle = document.getElementById('music-toggle');
const bgAudio = document.getElementById('bg-audio');
const iconPlay = document.getElementById('icon-play');
const iconPause = document.getElementById('icon-pause');
let isPlaying = false;

musicToggle.addEventListener('click', () => {
  if (!isPlaying) {
    bgAudio.play().catch(() => { /* file not yet added by user */ });
    iconPlay.style.display = 'none';
    iconPause.style.display = 'block';
    musicToggle.classList.add('playing');
    musicToggle.setAttribute('aria-label', 'Arka plan müziğini duraklat');
  } else {
    bgAudio.pause();
    iconPlay.style.display = 'block';
    iconPause.style.display = 'none';
    musicToggle.classList.remove('playing');
    musicToggle.setAttribute('aria-label', 'Arka plan müziğini çal');
  }
  isPlaying = !isPlaying;
});

/* =====================================================
   FINAL SURPRISE SEQUENCE
===================================================== */
const finalBtn = document.getElementById('final-btn');
const finalOverlay = document.getElementById('final-overlay');
const finalStars = document.getElementById('final-stars');
const finalHearts = document.getElementById('final-hearts');
const fireworksHearts = document.getElementById('fireworks-hearts');
const closeFinalBtn = document.getElementById('close-final');

function buildStars(){
  finalStars.innerHTML = '';
  const count = window.innerWidth < 640 ? 60 : 110;
  for (let i = 0; i < count; i++) {
    const s = document.createElement('div');
    s.className = 'star';
    s.style.left = Math.random() * 100 + '%';
    s.style.top = Math.random() * 100 + '%';
    s.style.animationDelay = (Math.random() * 3) + 's';
    finalStars.appendChild(s);
  }
}

let riseInterval;
function startRisingHearts(){
  riseInterval = setInterval(() => {
    const h = document.createElement('span');
    h.className = 'rise-heart';
    h.textContent = Math.random() > 0.5 ? '❤' : '❥';
    h.style.left = Math.random() * 100 + '%';
    h.style.fontSize = (0.8 + Math.random() * 1.6) + 'rem';
    h.style.animationDuration = (5 + Math.random() * 5) + 's';
    finalHearts.appendChild(h);
    setTimeout(() => h.remove(), 11000);
  }, 260);
}

function fireworksBurst(){
  const bursts = 5;
  for (let b = 0; b < bursts; b++) {
    setTimeout(() => {
      const cx = 20 + Math.random() * 60;
      const cy = 20 + Math.random() * 40;
      for (let i = 0; i < 20; i++) {
        const fh = document.createElement('span');
        fh.className = 'fw-heart';
        fh.textContent = '❤';
        const angle = (Math.PI * 2 * i) / 20;
        const dist = 60 + Math.random() * 90;
        fh.style.left = cx + 'vw';
        fh.style.top = cy + 'vh';
        fh.style.fontSize = (0.6 + Math.random() * 0.8) + 'rem';
        fh.style.setProperty('--fx', Math.cos(angle) * dist + 'px');
        fh.style.setProperty('--fy', Math.sin(angle) * dist + 'px');
        fh.style.animationDuration = (1.2 + Math.random() * 0.6) + 's';
        fireworksHearts.appendChild(fh);
        setTimeout(() => fh.remove(), 2200);
      }
    }, b * 900);
  }
}

finalBtn.addEventListener('click', () => {
  buildStars();
  finalOverlay.classList.add('open');
  document.body.style.overflow = 'hidden';
  startRisingHearts();

  const lines = document.querySelectorAll('.final-line');
  lines.forEach((line, idx) => {
    setTimeout(() => line.classList.add('visible'), 700 + idx * 1100);
  });

  setTimeout(fireworksBurst, 700 + lines.length * 1100);
});

closeFinalBtn.addEventListener('click', () => {
  finalOverlay.classList.remove('open');
  document.body.style.overflow = '';
  clearInterval(riseInterval);
  document.querySelectorAll('.final-line').forEach(l => l.classList.remove('visible'));
});
