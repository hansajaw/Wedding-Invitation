/* ===================================================
   Wedding Invitation — script.js (Final Updated)
   =================================================== */

// ── 1. Configuration ───────────────────────────────────
const weddingDate = new Date("2026-08-13T10:00:00").getTime();

// ── 9. Music — declared HERE at the top so loader can access it ──
const musicBtn = document.getElementById('music-btn');
const weddingSong = new Audio('Music/song.mp3');
weddingSong.loop = true;
weddingSong.preload = 'auto';
weddingSong.volume = 0;

let playing = false;
let fadeInterval;

function fadeMusic(targetVolume, duration, callback) {
  clearInterval(fadeInterval);
  const stepTime = 50;
  const steps = duration / stepTime;
  const volumeStep = (targetVolume - weddingSong.volume) / steps;

  fadeInterval = setInterval(() => {
    let nextVolume = weddingSong.volume + volumeStep;
    if ((volumeStep > 0 && nextVolume >= targetVolume) ||
        (volumeStep < 0 && nextVolume <= targetVolume)) {
      weddingSong.volume = Math.max(0, Math.min(1, targetVolume));
      clearInterval(fadeInterval);
      if (callback) callback();
    } else {
      weddingSong.volume = Math.max(0, Math.min(1, nextVolume));
    }
  }, stepTime);
}

// ── Loader & Auto-play ────────────────────────────────
window.addEventListener('load', () => {
  setTimeout(() => {
    const loader = document.getElementById('loader');
    if (loader) loader.classList.add('hidden');

    // Auto-play music after loader hides
    weddingSong.play().then(() => {
      playing = true;
      musicBtn.textContent = '♫';
      musicBtn.classList.add('playing');
      fadeMusic(0.5, 2000);
    }).catch(() => {
      // Browser blocked autoplay — music button still works manually
    });
  }, 2400);
});

// ── 2. Custom Cursor Logic ────────────────────────────
const cursor = document.getElementById('cursor');
const cursorRing = document.getElementById('cursor-ring');
let mouseX = 0, mouseY = 0;
let ringX = 0, ringY = 0;

document.addEventListener('mousemove', e => {
  mouseX = e.clientX;
  mouseY = e.clientY;
  if (cursor) {
    cursor.style.left = mouseX + 'px';
    cursor.style.top = mouseY + 'px';
  }
});

(function animateRing() {
  ringX += (mouseX - ringX) * 0.12;
  ringY += (mouseY - ringY) * 0.12;
  if (cursorRing) {
    cursorRing.style.left = ringX + 'px';
    cursorRing.style.top = ringY + 'px';
  }
  requestAnimationFrame(animateRing);
})();

// Cursor Hover Effects for interactive elements
document.querySelectorAll('a, button, .btn-rsvp, .btn-map, .detail-card, .individual-name-frame').forEach(el => {
  el.addEventListener('mouseenter', () => {
    cursor.style.width = '22px';
    cursor.style.height = '22px';
    cursorRing.style.width = '56px';
    cursorRing.style.height = '56px';
  });
  el.addEventListener('mouseleave', () => {
    cursor.style.width = '12px';
    cursor.style.height = '12px';
    cursorRing.style.width = '36px';
    cursorRing.style.height = '36px';
  });
});

// ── 3. Petal Rain ───────────────────────────────────────
const petalColors = ['#f4c2c2','#f9ddd7','#e8a0a8','#fce4ec','#f7cac9'];

function createPetal() {
  const hero = document.getElementById('hero');
  if (!hero) return;
  
  const petal = document.createElement('div');
  petal.className = 'petal';
  petal.style.cssText = `
    left: ${Math.random() * 100}%;
    width: ${4 + Math.random() * 8}px;
    height: ${8 + Math.random() * 12}px;
    background: ${petalColors[Math.floor(Math.random() * petalColors.length)]};
    animation-duration: ${6 + Math.random() * 8}s;
    animation-delay: ${Math.random() * 8}s;
    border-radius: ${Math.random() > 0.5 ? '50% 0 50% 0' : '0 50% 0 50%'};
    opacity: 0;
  `;
  hero.appendChild(petal);
  setTimeout(() => petal.remove(), 16000);
}

// Initial spawn and interval
for (let i = 0; i < 18; i++) setTimeout(createPetal, i * 400);
setInterval(createPetal, 900);

// ── 4. Scroll Reveal (Animations) ─────────────────────
const revealObserver = new IntersectionObserver((entries) => {
  entries.forEach((entry) => {
    if (entry.isIntersecting) {
      setTimeout(() => {
        entry.target.classList.add('visible');
      }, entry.target.dataset.delay || 0);
      revealObserver.unobserve(entry.target);
    }
  });
}, { threshold: 0.12 });

document.querySelectorAll('.reveal, .reveal-left, .reveal-right').forEach((el) => {
  revealObserver.observe(el);
});

// ── 5. NEW: Interactive Tilt for Name Frames ──────────
// This handles both the Story Frame and the Parents Section Name Frames
function applyTilt(elements, rotateAmount = 8) {
  elements.forEach(el => {
    el.addEventListener('mousemove', e => {
      const rect = el.getBoundingClientRect();
      const cx = rect.left + rect.width / 2;
      const cy = rect.top + rect.height / 2;
      const dx = (e.clientX - cx) / rect.width;
      const dy = (e.clientY - cy) / rect.height;
      el.style.transform = `perspective(800px) rotateY(${dx * rotateAmount}deg) rotateX(${-dy * rotateAmount}deg) translateY(-5px)`;
    });

    el.addEventListener('mouseleave', () => {
      el.style.transform = 'perspective(800px) rotateY(0) rotateX(0) translateY(0)';
    });
    el.style.transition = 'transform 0.1s ease-out';
  });
}

applyTilt(document.querySelectorAll('.individual-name-frame, .story-frame'));

// ── 6. Countdown Timer ──────────────────────────────────
const prevValues = {};
function animateNumber(id, newVal) {
  const el = document.getElementById(id);
  if (!el || prevValues[id] === newVal) return;
  
  el.style.transform = 'translateY(-8px)';
  el.style.opacity = '0.4';
  
  setTimeout(() => {
    el.textContent = newVal;
    el.style.transform = 'translateY(0)';
    el.style.opacity = '1';
  }, 180);
  
  prevValues[id] = newVal;
}

function updateCountdown() {
  const now = new Date().getTime();
  const diff = weddingDate - now;

  if (diff <= 0) {
    ['count-days', 'count-hours', 'count-mins', 'count-secs'].forEach(id => {
      const el = document.getElementById(id);
      if (el) el.textContent = '00';
    });
    return;
  }

  const days = Math.floor(diff / (1000 * 60 * 60 * 24));
  const hours = Math.floor((diff % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60));
  const mins = Math.floor((diff % (1000 * 60 * 60)) / (1000 * 60));
  const secs = Math.floor((diff % (1000 * 60)) / 1000);

  const fmt = n => String(n).padStart(2, '0');

  animateNumber('count-days', fmt(days));
  animateNumber('count-hours', fmt(hours));
  animateNumber('count-mins', fmt(mins));
  animateNumber('count-secs', fmt(secs));
}

document.querySelectorAll('.count-num').forEach(el => {
  el.style.transition = 'transform 0.18s ease, opacity 0.18s ease';
});

setInterval(updateCountdown, 1000);
updateCountdown();

// ── 7. RSVP Form (Fixed to actually send data) ──────────
const rsvpForm = document.getElementById('rsvp-form');
const successMsg = document.getElementById('rsvp-success');

if (rsvpForm) {
  rsvpForm.addEventListener('submit', async function(e) {
    e.preventDefault(); // Stop page reload
    
    const btn = this.querySelector('.btn-rsvp');
    const originalText = btn.querySelector('span').textContent;
    
    // UI Feedback: Show sending state
    btn.querySelector('span').textContent = 'Sending…';
    btn.style.pointerEvents = 'none';

    // Get the form data
    const data = new FormData(this);

    try {
      // Actually send the data to Formspree
      const response = await fetch(this.action, {
        method: 'POST',
        body: data,
        headers: {
          'Accept': 'application/json'
        }
      });

      if (response.ok) {
        // SUCCESS: Hide form and show success message
        this.style.opacity = '0';
        this.style.transform = 'translateY(10px)';
        this.style.transition = 'all 0.4s ease';

        setTimeout(() => {
          this.style.display = 'none';
          successMsg.classList.add('show');
          successMsg.style.display = 'block';
          
          // Burst of petals on success
          for (let i = 0; i < 30; i++) setTimeout(createPetal, i * 80);
        }, 400);
      } else {
        // ERROR: Handle server errors (e.g., wrong ID)
        alert("Oops! There was a problem submitting your RSVP. Please try again.");
        btn.querySelector('span').textContent = originalText;
        btn.style.pointerEvents = 'auto';
      }
    } catch (error) {
      // ERROR: Handle network errors
      alert("Could not connect to the server. Please check your internet.");
      btn.querySelector('span').textContent = originalText;
      btn.style.pointerEvents = 'auto';
    }
  });
}

// ── 8. Parallax & Navigation ──────────────────────────
window.addEventListener('scroll', () => {
  const y = window.scrollY;
  const names = document.querySelector('.hero-inner');
  if (names) names.style.transform = `translateY(${y * 0.18}px)`;
  const bg = document.querySelector('.hero-bg');
  if (bg) bg.style.transform = `translateY(${y * 0.08}px)`;
});

document.getElementById('scroll-hint')?.addEventListener('click', () => {
  document.getElementById('story')?.scrollIntoView({ behavior: 'smooth' });
});

document.getElementById('map-btn')?.addEventListener('click', () => {
  window.open('https://maps.app.goo.gl/iQBjtmKNrXyNw6HV6', '_blank'); // Update with actual venue link
});

// ── Music Button Toggle ───────────────────────────────
musicBtn?.addEventListener('click', () => {
  if (!playing) {
    playing = true;
    
    // UI Feedback
    musicBtn.textContent = '♫';
    musicBtn.classList.add('playing');

    // Start Audio
    weddingSong.play().then(() => {
      fadeMusic(0.5, 2000); // Fade up to 50% over 2 seconds
    }).catch(err => {
      console.warn("Playback blocked by browser policy. Interaction required.");
      playing = false; // Reset state if blocked
    });
    
  } else {
    playing = false;
    
    // UI Feedback (Instant)
    musicBtn.textContent = '♪';
    musicBtn.classList.remove('playing');

    // Audio Logic: Fade out then pause
    fadeMusic(0, 1000, () => {
      weddingSong.pause();
      // Ensure it stays at 0 for the next fade-in
      weddingSong.volume = 0; 
    });
  }
});