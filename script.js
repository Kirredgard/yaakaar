/* ══════════════════════════════════════════════
   YAAKAAR — script.js v2
   Tous les scripts unifiés et corrigés
══════════════════════════════════════════════ */

document.addEventListener('DOMContentLoaded', () => {

  /* ── HEADER SCROLL ── */
  const header = document.getElementById('header');
  window.addEventListener('scroll', () => {
    header.classList.toggle('scrolled', window.scrollY > 20);
  }, { passive: true });
/* ── FORCE AUTOPLAY iOS ── */
const heroVid = document.getElementById('heroVideo');
if (heroVid) {
  heroVid.play().catch(() => {
    // Si autoplay bloqué, on rejoue au premier touch
    document.addEventListener('touchstart', () => heroVid.play(), { once: true });
  });
}
  /* ── BURGER MENU ── */
  const burger = document.getElementById('burger');
  const nav    = document.getElementById('nav');
  burger?.addEventListener('click', () => {
    burger.classList.toggle('open');
    nav.classList.toggle('open');
    document.body.style.overflow = nav.classList.contains('open') ? 'hidden' : '';
  });

  /* ── REVEAL AU SCROLL ── */
  const reveals = document.querySelectorAll('.reveal');
  const revealObserver = new IntersectionObserver(entries => {
    entries.forEach(e => { if (e.isIntersecting) e.target.classList.add('visible'); });
  }, { threshold: 0.12 });
  reveals.forEach(el => revealObserver.observe(el));

  /* ── COMPTEURS ANIMÉS ── */
  const counters = document.querySelectorAll('.stat-num');
  const counterObserver = new IntersectionObserver(entries => {
    entries.forEach(e => {
      if (!e.isIntersecting) return;
      const el     = e.target;
      const target = parseInt(el.dataset.target, 10);
      const dur    = 1600;
      const step   = 16;
      const inc    = target / (dur / step);
      let current  = 0;
      const timer  = setInterval(() => {
        current += inc;
        if (current >= target) { el.textContent = target; clearInterval(timer); }
        else { el.textContent = Math.floor(current); }
      }, step);
      counterObserver.unobserve(el);
    });
  }, { threshold: 0.5 });
  counters.forEach(c => counterObserver.observe(c));

  /* ── CARTE LEAFLET ── */
  const mapEl = document.getElementById('map');
  if (mapEl) {
    const map = L.map('map', { zoomControl: false }).setView([16.51038, -15.50426], 10);
    L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
      attribution: '&copy; OpenStreetMap'
    }).addTo(map);
    L.marker([16.51038, -15.50426])
      .addTo(map)
      .bindPopup('<strong>Yaakaar Takku Suxali Walo</strong><br>Walo, Sénégal')
      .openPopup();
    L.control.zoom({ position: 'bottomright' }).addTo(map);
    map.scrollWheelZoom.disable();
    setTimeout(() => map.invalidateSize(), 300);
  }

  /* ── MODAL CONTACT ── */
  const modal     = document.getElementById('contactModal');
  const closeBtn  = document.getElementById('closeModal');

  function openModal(e) {
    e?.preventDefault();
    modal.classList.add('open');
    document.body.style.overflow = 'hidden';
  }
  function closeModal() {
    modal.classList.remove('open');
    document.body.style.overflow = '';
  }

  // Tous les déclencheurs (IDs uniques)
  document.getElementById('contactBtn')?.addEventListener('click', openModal);
  document.getElementById('openContactFooter')?.addEventListener('click', openModal);
  document.getElementById('openContactFloat')?.addEventListener('click', openModal);
  closeBtn?.addEventListener('click', closeModal);
  modal?.addEventListener('click', e => { if (e.target === modal) closeModal(); });
  document.addEventListener('keydown', e => { if (e.key === 'Escape' && modal.classList.contains('open')) closeModal(); });

  /* ── FLOATING WIDGET ── */
  const floatWidget = document.getElementById('floatWidget');
  const floatToggle = document.getElementById('floatToggle');
  const iconChat    = floatToggle?.querySelector('.icon-chat');
  const iconClose   = floatToggle?.querySelector('.icon-close');

  floatToggle?.addEventListener('click', () => {
    floatWidget.classList.toggle('open');
    const isOpen = floatWidget.classList.contains('open');
    if (iconChat)  iconChat.style.display  = isOpen ? 'none' : '';
    if (iconClose) iconClose.style.display = isOpen ? ''     : 'none';
  });

  /* ── VIDÉO 1 ── */
  setupVideo('myVideo', 'videoOverlay', 'playPause', 'progress', 'muteBtn', 'fullBtn');

  /* ── VIDÉO 2 ── */
  setupVideo('myVideo2', 'videoOverlay2', 'playPause2', 'progress2', 'muteBtn2', 'fullBtn2');

  function setupVideo(vidId, ovId, ppId, progId, muteId, fullId) {
    const vid      = document.getElementById(vidId);
    const overlay  = document.getElementById(ovId);
    const ppBtn    = document.getElementById(ppId);
    const progress = document.getElementById(progId);
    const muteBtn  = document.getElementById(muteId);
    const fullBtn  = document.getElementById(fullId);
    if (!vid) return;

    function togglePlay() {
      if (vid.paused) {
        vid.play();
        overlay.style.display = 'none';
      } else {
        vid.pause();
        overlay.style.display = 'flex';
      }
    }

    overlay?.addEventListener('click', togglePlay);
    ppBtn?.addEventListener('click', togglePlay);

    vid.addEventListener('timeupdate', () => {
      if (progress) progress.value = (vid.currentTime / vid.duration) * 100 || 0;
    });
    progress?.addEventListener('input', () => {
      vid.currentTime = (progress.value / 100) * vid.duration;
    });
    muteBtn?.addEventListener('click', () => {
      vid.muted = !vid.muted;
      muteBtn.textContent = vid.muted ? '🔇' : '🔊';
    });
    fullBtn?.addEventListener('click', () => {
      if (!document.fullscreenElement) vid.requestFullscreen();
      else document.exitFullscreen();
    });

    // Pause auto quand hors viewport
    const vObs = new IntersectionObserver(entries => {
      entries.forEach(entry => {
        if (!entry.isIntersecting && !vid.paused) {
          vid.pause();
          if (overlay) overlay.style.display = 'flex';
        }
      });
    }, { threshold: 0.35 });
    vObs.observe(vid);

    // Pause si onglet caché
    document.addEventListener('visibilitychange', () => {
      if (document.hidden && !vid.paused) {
        vid.pause();
        if (overlay) overlay.style.display = 'flex';
      }
    });
  }

  /* ── SLIDER 1 (santé, 13 photos) ── */
  setupSlider('cardSlider', 'cardPrev', 'cardNext', 'cardDots', 13, 'cardMedia', 'lightbox', 'lbTrack', 'lbCounter', 'lbClose', 'lbPrev', 'lbNext', 'lbDots');

  /* ── SLIDER 2 (invitation, 6 photos) ── */
  setupSlider('cardSlider2', 'cardPrev2', 'cardNext2', 'cardDots2', 6, 'cardMedia2', 'lightbox2', 'lbTrack2', 'lbCounter2', 'lbClose2', 'lbPrev2', 'lbNext2', null);

  function setupSlider(sliderId, prevId, nextId, dotsId, total, mediaId, lbId, lbTrackId, lbCounterId, lbCloseId, lbPrevId, lbNextId, lbDotsId) {
    const sliderEl = document.getElementById(sliderId);
    const dotsEl   = document.getElementById(dotsId);
    const lbEl     = document.getElementById(lbId);
    const lbTrack  = document.getElementById(lbTrackId);
    const lbCount  = document.getElementById(lbCounterId);
    if (!sliderEl) return;

    let idx   = 0;
    let lbIdx = 0;
    const dots = dotsEl?.children ? Array.from(dotsEl.children) : [];

    function goSlide(i) {
      idx = ((i % total) + total) % total;
      sliderEl.style.transform = `translateX(-${idx * 100}%)`;
      dots.forEach((d, j) => d.classList.toggle('active', j === idx));
    }

    function goLb(i) {
      lbIdx = ((i % total) + total) % total;
      if (lbTrack) lbTrack.style.transform = `translateX(-${lbIdx * 100}%)`;
      if (lbCount) lbCount.textContent = `${lbIdx + 1} / ${total}`;
    }

    document.getElementById(prevId)?.addEventListener('click', e => { e.stopPropagation(); goSlide(idx - 1); });
    document.getElementById(nextId)?.addEventListener('click', e => { e.stopPropagation(); goSlide(idx + 1); });
    dots.forEach((d, i) => d.addEventListener('click', e => { e.stopPropagation(); goSlide(i); }));

    // Swipe tactile slider
    let tx = 0;
    sliderEl.addEventListener('touchstart', e => { tx = e.touches[0].clientX; }, { passive: true });
    sliderEl.addEventListener('touchend', e => {
      const diff = tx - e.changedTouches[0].clientX;
      if (Math.abs(diff) > 40) goSlide(diff > 0 ? idx + 1 : idx - 1);
    }, { passive: true });

    // Ouvrir lightbox
    document.getElementById(mediaId)?.addEventListener('click', () => {
      if (!lbEl) return;
      goLb(idx);
      lbEl.classList.add('open');
      document.body.style.overflow = 'hidden';
    });

    // Lightbox controls
    document.getElementById(lbCloseId)?.addEventListener('click', () => {
      lbEl.classList.remove('open');
      document.body.style.overflow = '';
    });
    lbEl?.addEventListener('click', e => {
      if (e.target === lbEl) { lbEl.classList.remove('open'); document.body.style.overflow = ''; }
    });
    document.getElementById(lbPrevId)?.addEventListener('click', e => { e.stopPropagation(); goLb(lbIdx - 1); });
    document.getElementById(lbNextId)?.addEventListener('click', e => { e.stopPropagation(); goLb(lbIdx + 1); });

    // Swipe tactile lightbox
    let ltx = 0;
    lbTrack?.addEventListener('touchstart', e => { ltx = e.touches[0].clientX; }, { passive: true });
    lbTrack?.addEventListener('touchend', e => {
      const diff = ltx - e.changedTouches[0].clientX;
      if (Math.abs(diff) > 40) goLb(diff > 0 ? lbIdx + 1 : lbIdx - 1);
    }, { passive: true });
  }

  /* ── CLAVIER LIGHTBOX ── */
  document.addEventListener('keydown', e => {
    const lb1 = document.getElementById('lightbox');
    const lb2 = document.getElementById('lightbox2');
    if (lb1?.classList.contains('open')) {
      if (e.key === 'ArrowRight') document.getElementById('lbNext')?.click();
      if (e.key === 'ArrowLeft')  document.getElementById('lbPrev')?.click();
      if (e.key === 'Escape')     { lb1.classList.remove('open'); document.body.style.overflow = ''; }
    }
    if (lb2?.classList.contains('open')) {
      if (e.key === 'ArrowRight') document.getElementById('lbNext2')?.click();
      if (e.key === 'ArrowLeft')  document.getElementById('lbPrev2')?.click();
      if (e.key === 'Escape')     { lb2.classList.remove('open'); document.body.style.overflow = ''; }
    }
  });

}); // end DOMContentLoaded
