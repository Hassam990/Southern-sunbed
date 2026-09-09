/* =============================================================
   SOUTHERN SUNBED HIRE — Modern Interactive Controller
   Features:
   · Lucide Icons initialization
   · GSAP & ScrollTrigger Luxury Animations
   · Silk/Particle Hero Canvas
   · Interactive Hire Price & Package Calculator
   · Instant Postcode & Delivery Area Validator
   · Solarium UV Lighting Mode Switch
   · Safe Tanning Skin Type Advisor
   · Confetti Celebration & Form Validation
   · Mobile Navigation Drawer & Sticky Header
   ============================================================= */

(function () {
  'use strict';

  // ── HELPER UTILITIES ──
  const $ = (sel, ctx = document) => ctx.querySelector(sel);
  const $$ = (sel, ctx = document) => [...ctx.querySelectorAll(sel)];
  const raf = requestAnimationFrame;

  /* =============================================================
     1. INITIALIZE LUCIDE ICONS
     ============================================================= */
  function initLucide() {
    if (window.lucide && typeof window.lucide.createIcons === 'function') {
      window.lucide.createIcons();
    }
  }
  initLucide();

  /* =============================================================
     2. HERO SILK WAVE CANVAS
     ============================================================= */
  const canvas = document.getElementById('heroCanvas');
  if (canvas) {
    const ctx = canvas.getContext('2d');
    let W, H, t = 0;

    const resize = () => {
      W = canvas.width = canvas.offsetWidth;
      H = canvas.height = canvas.offsetHeight;
    };
    resize();
    window.addEventListener('resize', resize, { passive: true });

    const LINES = 16;
    function drawCanvas() {
      ctx.clearRect(0, 0, W, H);

      for (let i = 0; i < LINES; i++) {
        const y0 = (i / (LINES - 1)) * H;
        const amp = 35 + Math.sin(i * 0.45) * 25;
        const freq = 0.0055 + i * 0.00025;
        const speed = 0.001 + i * 0.00007;
        const phase = i * 0.55;
        const alpha = 0.035 + (i % 3) * 0.015;

        ctx.beginPath();
        ctx.moveTo(0, y0);
        for (let x = 0; x <= W; x += 4) {
          const y = y0
            + Math.sin(x * freq + t * speed + phase) * amp
            + Math.sin(x * freq * 0.5 - t * speed * 0.7 + phase) * (amp * 0.35);
          ctx.lineTo(x, y);
        }
        ctx.strokeStyle = `rgba(200, 121, 65, ${alpha})`;
        ctx.lineWidth = 1.2;
        ctx.stroke();
      }

      t += 1;
      raf(drawCanvas);
    }
    drawCanvas();
  }

  /* =============================================================
     3. GSAP & SCROLL ANIMATIONS
     ============================================================= */
  function initGSAP() {
    if (!window.gsap) return;

    // Register ScrollTrigger if available
    if (window.ScrollTrigger) {
      gsap.registerPlugin(ScrollTrigger);
    }

    // Hero Timeline
    const tl = gsap.timeline({ defaults: { ease: 'power3.out' } });
    tl.from('.hero__eyebrow', { opacity: 0, y: -20, duration: 0.8, delay: 0.2 })
      .from('.hero__h1 .hero__line', { opacity: 0, y: 30, duration: 0.9, stagger: 0.15 }, '-=0.4')
      .from('.hero__sub', { opacity: 0, y: 20, duration: 0.8 }, '-=0.5')
      .from('.hero__actions', { opacity: 0, y: 20, duration: 0.7 }, '-=0.5')
      .from('.perk-item', { opacity: 0, y: 15, duration: 0.6, stagger: 0.1 }, '-=0.4')
      .from('.hero-card-display', { opacity: 0, scale: 0.95, y: 30, duration: 1 }, '-=0.8');

    // ScrollTrigger elements - safely animate translation with clearProps so cards are NEVER stuck faded
    if (window.ScrollTrigger) {
      gsap.from('.postcode-checker-box', {
        scrollTrigger: { trigger: '.postcode-checker-section', start: 'top 90%', once: true },
        y: 25,
        duration: 0.8,
        ease: 'power2.out',
        clearProps: 'all'
      });

      gsap.from('.bed-card', {
        scrollTrigger: { trigger: '.sunbeds-grid', start: 'top 90%', once: true },
        y: 30,
        duration: 0.7,
        stagger: 0.12,
        ease: 'power2.out',
        clearProps: 'all'
      });

      gsap.from('.hiw-card', {
        scrollTrigger: { trigger: '.hiw-grid', start: 'top 90%', once: true },
        y: 25,
        duration: 0.6,
        stagger: 0.1,
        ease: 'power2.out',
        clearProps: 'all'
      });

      gsap.from('.why-card', {
        scrollTrigger: { trigger: '.why-grid', start: 'top 90%', once: true },
        y: 25,
        duration: 0.6,
        stagger: 0.08,
        ease: 'power2.out',
        clearProps: 'all'
      });

      gsap.from('.review-card', {
        scrollTrigger: { trigger: '.reviews-grid', start: 'top 90%', once: true },
        y: 25,
        duration: 0.6,
        stagger: 0.1,
        ease: 'power2.out',
        clearProps: 'all'
      });
    }
  }

  // Run GSAP after DOM content loads
  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', initGSAP);
  } else {
    initGSAP();
  }

  /* =============================================================
     4. NUMBER COUNTER ANIMATION
     ============================================================= */
  let statsTriggered = false;
  const statsSection = $('.stats-section');

  function runCounters() {
    if (statsTriggered || !statsSection) return;
    const rect = statsSection.getBoundingClientRect();
    if (rect.top > window.innerHeight - 50) return;
    statsTriggered = true;

    $$('.counter').forEach(el => {
      const target = parseInt(el.dataset.target, 10);
      if (isNaN(target)) return;

      const duration = 1800;
      const start = performance.now();

      function update(now) {
        const progress = Math.min((now - start) / duration, 1);
        const ease = 1 - Math.pow(1 - progress, 3);
        el.textContent = Math.floor(ease * target);
        if (progress < 1) {
          raf(update);
        } else {
          el.textContent = target;
        }
      }
      raf(update);
    });
  }
  window.addEventListener('scroll', runCounters, { passive: true });

  /* =============================================================
     5. STICKY NAV & MOBILE MENU
     ============================================================= */
  const navWrap = $('#navWrap');
  const bttBtn = $('#bttBtn');

  function onWindowScroll() {
    const top = window.scrollY;
    if (navWrap) {
      navWrap.classList.toggle('scrolled', top > 20);
    }
    if (bttBtn) {
      bttBtn.classList.toggle('show', top > 400);
    }
    runCounters();
  }
  window.addEventListener('scroll', onWindowScroll, { passive: true });

  if (bttBtn) {
    bttBtn.addEventListener('click', () => {
      window.scrollTo({ top: 0, behavior: 'smooth' });
    });
  }

  const burger = $('#burger');
  const navLinks = $('#navLinks');

  if (burger && navLinks) {
    const toggleMenu = () => {
      const isOpen = navLinks.classList.contains('open');
      burger.classList.toggle('open', !isOpen);
      navLinks.classList.toggle('open', !isOpen);
      burger.setAttribute('aria-expanded', !isOpen);
      document.body.style.overflow = !isOpen ? 'hidden' : '';
    };

    burger.addEventListener('click', toggleMenu);
    $$('.nav__link, .nav__cta', navLinks).forEach(item => {
      item.addEventListener('click', () => {
        burger.classList.remove('open');
        navLinks.classList.remove('open');
        burger.setAttribute('aria-expanded', 'false');
        document.body.style.overflow = '';
      });
    });
  }

  /* =============================================================
     6. INTERACTIVE POSTCODE & DELIVERY CHECKER
     ============================================================= */
  const postcodeInput = $('#postcodeInput');
  const checkPostcodeBtn = $('#checkPostcodeBtn');
  const postcodeResult = $('#postcodeResult');

  // Covered regions: Hampshire & Berkshire towns & postcodes
  const coverageData = [
    { key: 'RG21', town: 'Basingstoke', sameDay: true },
    { key: 'RG22', town: 'Basingstoke', sameDay: true },
    { key: 'RG23', town: 'Basingstoke', sameDay: true },
    { key: 'RG24', town: 'Basingstoke', sameDay: true },
    { key: 'BASINGSTOKE', town: 'Basingstoke', sameDay: true },
    { key: 'RG1', town: 'Reading', sameDay: true },
    { key: 'RG2', town: 'Reading', sameDay: true },
    { key: 'RG4', town: 'Reading', sameDay: true },
    { key: 'RG5', town: 'Reading', sameDay: true },
    { key: 'RG6', town: 'Reading', sameDay: true },
    { key: 'RG30', town: 'Reading', sameDay: true },
    { key: 'READING', town: 'Reading', sameDay: true },
    { key: 'GU14', town: 'Farnborough', sameDay: true },
    { key: 'FARNBOROUGH', town: 'Farnborough', sameDay: true },
    { key: 'GU11', town: 'Aldershot', sameDay: true },
    { key: 'GU51', town: 'Fleet', sameDay: true },
    { key: 'RG14', town: 'Newbury', sameDay: true },
    { key: 'NEWBURY', town: 'Newbury', sameDay: true },
    { key: 'SP10', town: 'Andover', sameDay: true },
    { key: 'ANDOVER', town: 'Andover', sameDay: true },
    { key: 'SO14', town: 'Southampton', sameDay: false },
    { key: 'SO15', town: 'Southampton', sameDay: false },
    { key: 'SOUTHAMPTON', town: 'Southampton', sameDay: false },
    { key: 'SO23', town: 'Winchester', sameDay: true },
    { key: 'WINCHESTER', town: 'Winchester', sameDay: true },
    { key: 'GU1', town: 'Guildford', sameDay: true },
    { key: 'GU2', town: 'Guildford', sameDay: true },
    { key: 'GUILDFORD', town: 'Guildford', sameDay: true },
    { key: 'RG12', town: 'Bracknell', sameDay: true },
    { key: 'RG40', town: 'Wokingham', sameDay: true },
  ];

  function evaluatePostcode(query) {
    const q = query.trim().toUpperCase().replace(/\s+/g, '');
    if (!q) return;

    // Check exact or prefix match
    let match = coverageData.find(c => q.includes(c.key) || c.key.includes(q));

    // Check general area prefixes (RG, SO, GU, SL, SP, PO)
    const validPrefixes = ['RG', 'SO', 'GU', 'SL', 'SP', 'PO'];
    const prefixMatch = validPrefixes.some(p => q.startsWith(p));

    postcodeResult.style.display = 'flex';

    if (match) {
      postcodeResult.className = 'pc-result pc-result--success';
      postcodeResult.innerHTML = `
        <i data-lucide="check-circle" style="color:#059669;width:20px;height:20px;"></i>
        <div>
          <strong>Great News! 100% Free Delivery to ${match.town} (${q})</strong>
          <p style="font-size:0.85rem;margin-top:2px;">${match.sameDay ? '⚡ Same-day delivery is frequently available!' : 'Fast delivery and free installation included.'} Free goggles with every hire.</p>
        </div>
      `;
    } else if (prefixMatch) {
      postcodeResult.className = 'pc-result pc-result--success';
      postcodeResult.innerHTML = `
        <i data-lucide="check-circle" style="color:#059669;width:20px;height:20px;"></i>
        <div>
          <strong>Delivery Available to your district (${q})!</strong>
          <p style="font-size:0.85rem;margin-top:2px;">Free delivery, professional installation, and collection across your area.</p>
        </div>
      `;
    } else {
      postcodeResult.className = 'pc-result pc-result--info';
      postcodeResult.innerHTML = `
        <i data-lucide="map-pin" style="color:#2563EB;width:20px;height:20px;"></i>
        <div>
          <strong>We regularly deliver across Hampshire & Berkshire</strong>
          <p style="font-size:0.85rem;margin-top:2px;">Call us on <strong>07306 885 759</strong> to confirm delivery to "${q}" — we will do our best to accommodate you!</p>
        </div>
      `;
    }
    initLucide();
  }

  if (checkPostcodeBtn && postcodeInput) {
    checkPostcodeBtn.addEventListener('click', () => evaluatePostcode(postcodeInput.value));
    postcodeInput.addEventListener('keydown', e => {
      if (e.key === 'Enter') evaluatePostcode(postcodeInput.value);
    });
  }

  // Fast pill tags
  $$('.area-tag').forEach(tag => {
    tag.addEventListener('click', () => {
      const area = tag.dataset.area;
      if (postcodeInput) {
        postcodeInput.value = area;
        evaluatePostcode(area);
      }
    });
  });

  /* =============================================================
     7. UV SOLARIUM GLOW TOGGLE
     ============================================================= */
  const uvToggle = $('#uvGlowToggle');
  const uvGlows = $$('.bed-card__uv-glow');
  const glowLabels = $$('.glow-label');

  if (uvToggle) {
    uvToggle.addEventListener('change', () => {
      const active = uvToggle.checked;
      uvGlows.forEach(glow => {
        glow.classList.toggle('uv-glow--active', active);
      });
      if (glowLabels.length >= 2) {
        glowLabels[0].classList.toggle('active', !active);
        glowLabels[1].classList.toggle('active', active);
      }
    });
  }

  /* =============================================================
     8. HIRE PRICE CALCULATOR LOGIC
     ============================================================= */
  const calcState = {
    unit: 'Caribbean 26-Tube (Most Popular)',
    baseRate: 55,
    weeks: 4,
    discount: 0.20,
    lotion: true,
    goggles: false
  };

  const summaryUnit = $('#summaryUnit');
  const summaryDuration = $('#summaryDuration');
  const summaryTotal = $('#summaryTotal');
  const addonLotion = $('#addonLotion');
  const addonGoggles = $('#addonGoggles');

  function calculatePackage() {
    const rawRent = calcState.baseRate * calcState.weeks;
    const discountedRent = rawRent * (1 - calcState.discount);
    
    let extras = 0;
    if (calcState.lotion) extras += 15;
    if (calcState.goggles) extras += 5;

    const total = Math.round(discountedRent + extras);

    if (summaryUnit) summaryUnit.textContent = calcState.unit;
    if (summaryDuration) {
      const discPct = Math.round(calcState.discount * 100);
      summaryDuration.textContent = discPct > 0 
        ? `${calcState.weeks} Weeks (${discPct}% Multi-Week Discount)`
        : `${calcState.weeks} Week (Standard)`;
    }
    if (summaryTotal) {
      summaryTotal.textContent = `£${total}`;
    }
  }

  // Model pills
  const modelPills = $$('.model-pill');
  modelPills.forEach(pill => {
    pill.addEventListener('click', () => {
      modelPills.forEach(p => p.classList.remove('active'));
      pill.classList.add('active');
      calcState.unit = pill.dataset.unit;
      calcState.baseRate = parseInt(pill.dataset.rate, 10);
      calculatePackage();
    });
  });

  // Duration buttons
  const durationBtns = $$('.duration-btn');
  durationBtns.forEach(btn => {
    btn.addEventListener('click', () => {
      durationBtns.forEach(b => b.classList.remove('active'));
      btn.classList.add('active');
      calcState.weeks = parseInt(btn.dataset.weeks, 10);
      calcState.discount = parseFloat(btn.dataset.discount);
      calculatePackage();
    });
  });

  // Addons
  if (addonLotion) {
    addonLotion.addEventListener('change', () => {
      calcState.lotion = addonLotion.checked;
      calculatePackage();
    });
  }
  if (addonGoggles) {
    addonGoggles.addEventListener('change', () => {
      calcState.goggles = addonGoggles.checked;
      calculatePackage();
    });
  }

  // Direct bed card select buttons
  $$('.select-bed-btn').forEach(btn => {
    btn.addEventListener('click', () => {
      const name = btn.dataset.bedName;
      const rate = parseInt(btn.dataset.bedRate, 10);
      calcState.unit = name;
      calcState.baseRate = rate;

      modelPills.forEach(pill => {
        pill.classList.toggle('active', pill.dataset.unit === name);
      });

      calculatePackage();
      const calcEl = $('#calculator');
      if (calcEl) {
        calcEl.scrollIntoView({ behavior: 'smooth' });
      }
    });
  });

  // Direct quick book buttons
  $$('.quick-book-btn').forEach(btn => {
    btn.addEventListener('click', () => {
      const name = btn.dataset.bedName;
      const select = $('#formSunbed');
      if (select) {
        select.value = name;
      }
    });
  });

  // "Proceed With This Package" button
  const applyToFormBtn = $('#applyToFormBtn');
  if (applyToFormBtn) {
    applyToFormBtn.addEventListener('click', () => {
      const formSunbed = $('#formSunbed');
      const formDuration = $('#formDuration');
      const formMessage = $('#formMessage');

      if (formSunbed) formSunbed.value = calcState.unit;
      if (formDuration) {
        if (calcState.weeks === 1) formDuration.value = '1 Week';
        else if (calcState.weeks === 2) formDuration.value = '2 Weeks';
        else if (calcState.weeks === 4) formDuration.value = '4 Weeks';
        else if (calcState.weeks === 8) formDuration.value = '8 Weeks';
      }

      if (formMessage) {
        const addOnsList = [];
        if (calcState.lotion) addOnsList.push('Tan Accelerator Cream (+£15)');
        if (calcState.goggles) addOnsList.push('Extra Safety Goggles (+£5)');
        const addOnText = addOnsList.length ? ` Includes add-ons: ${addOnsList.join(', ')}.` : '';
        formMessage.value = `Package Quote: ${calcState.unit} for ${calcState.weeks} weeks.${addOnText}`;
      }

      const contactSection = $('#contact');
      if (contactSection) {
        contactSection.scrollIntoView({ behavior: 'smooth' });
        const nameField = $('#formName');
        if (nameField) setTimeout(() => nameField.focus(), 600);
      }
    });
  }

  // Initial calculation
  calculatePackage();

  /* =============================================================
     9. SAFE TANNING SKIN TYPE ADVISOR
     ============================================================= */
  const skinData = {
    1: {
      title: 'Skin Type I — Fair / Highly Sensitive',
      desc: 'Typically fair skin with freckles, blonde or red hair, and blue/green eyes. Burns very easily and tans with difficulty. Advisement: Keep initial session times strictly limited to 3–4 minutes with high skin moisturization.',
      time: 'Max Initial Session: <strong>3–4 Minutes</strong>'
    },
    2: {
      title: 'Skin Type II — Fair to Light Skin',
      desc: 'Fair to medium skin tone, blonde to brown hair. Usually burns initially, but gradually develops a golden sun-kissed tan with safe progressive exposure.',
      time: 'Max Initial Session: <strong>5–6 Minutes</strong>'
    },
    3: {
      title: 'Skin Type III — Medium / Olive Complexion',
      desc: 'Caucasian to Mediterranean skin tone, dark blonde to brown hair, hazel or brown eyes. Rarely burns severely and tans moderately fast into a deep honey tone.',
      time: 'Max Initial Session: <strong>7–9 Minutes</strong>'
    },
    4: {
      title: 'Skin Type IV — Dark / Highly UV Tolerant',
      desc: 'Naturally light brown or olive skin, dark hair and dark eyes. Burns minimally, tans easily and quickly develops deep bronze pigmentation.',
      time: 'Max Initial Session: <strong>10–12 Minutes</strong>'
    }
  };

  const skinTabs = $$('.sg-tab');
  const skinTitle = $('#skinTitle');
  const skinDesc = $('#skinDesc');
  const skinTime = $('#skinTime');

  skinTabs.forEach(tab => {
    tab.addEventListener('click', () => {
      skinTabs.forEach(t => t.classList.remove('active'));
      tab.classList.add('active');
      const type = tab.dataset.type;
      const data = skinData[type];
      if (data) {
        if (skinTitle) skinTitle.textContent = data.title;
        if (skinDesc) skinDesc.textContent = data.desc;
        if (skinTime) skinTime.innerHTML = data.time;
      }
    });
  });

  /* =============================================================
     10. CONTACT FORM & CONFETTI SUBMISSION
     ============================================================= */
  const bookingForm = $('#bookingForm');
  const submitBtn = $('#submitBtn');
  const successAlert = $('#formSuccessAlert');

  if (bookingForm) {
    bookingForm.addEventListener('submit', e => {
      e.preventDefault();

      let valid = true;
      const requiredInputs = $$('[required]', bookingForm);

      requiredInputs.forEach(input => {
        input.style.borderColor = '';
        const isCheckbox = input.type === 'checkbox';
        const isEmpty = isCheckbox ? !input.checked : !input.value.trim();

        if (isEmpty) {
          valid = false;
          input.style.borderColor = '#EF4444';
          if (isCheckbox) {
            const box = $('.age-custom-box', input.parentElement);
            if (box) box.style.borderColor = '#EF4444';
          }
        }
      });

      if (!valid) {
        const firstInvalid = requiredInputs.find(i => (i.type === 'checkbox' ? !i.checked : !i.value.trim()));
        if (firstInvalid) {
          firstInvalid.focus();
          firstInvalid.scrollIntoView({ behavior: 'smooth', block: 'center' });
        }
        return;
      }

      // Submit feedback
      const originalBtnText = submitBtn.innerHTML;
      submitBtn.innerHTML = '<span>Processing Booking...</span> <i data-lucide="loader"></i>';
      submitBtn.disabled = true;
      initLucide();

      setTimeout(() => {
        // Trigger Canvas Confetti celebration
        if (typeof window.confetti === 'function') {
          window.confetti({
            particleCount: 100,
            spread: 70,
            origin: { y: 0.6 },
            colors: ['#C87941', '#DF945B', '#F59E0B', '#10B981', '#ffffff']
          });
        }

        // Reset inputs
        bookingForm.reset();
        submitBtn.innerHTML = originalBtnText;
        submitBtn.disabled = false;
        initLucide();

        // Show success alert
        if (successAlert) {
          successAlert.style.display = 'flex';
          initLucide();
          successAlert.scrollIntoView({ behavior: 'smooth', block: 'nearest' });
          setTimeout(() => {
            successAlert.style.display = 'none';
          }, 8000);
        }
      }, 1200);
    });

    // Reset red border on typing
    $$('input, select, textarea', bookingForm).forEach(el => {
      el.addEventListener('input', () => {
        el.style.borderColor = '';
      });
    });
  }

  /* =============================================================
     11. CARD HOVER 3D TILT EFFECT
     ============================================================= */
  $$('.bed-card').forEach(card => {
    card.addEventListener('mousemove', e => {
      const rect = card.getBoundingClientRect();
      const cx = rect.left + rect.width / 2;
      const cy = rect.top + rect.height / 2;
      const dx = (e.clientX - cx) / (rect.width / 2);
      const dy = (e.clientY - cy) / (rect.height / 2);
      card.style.transform = `translateY(-8px) rotateX(${-dy * 2.5}deg) rotateY(${dx * 2.5}deg)`;
    });

    card.addEventListener('mouseleave', () => {
      card.style.transform = '';
    });
  });

  /* =============================================================
     12. CLIENT WELCOME PACK 3D FOLDER & DOSSIER LOGIC
     ============================================================= */
  const folderToggle = $('#folderToggle');
  const folderSearchInput = $('#folderSearchInput');
  const folderFiles = $$('.dossier-section .file');
  const docTitle = $('#docTitle');
  const docDesc = $('#docDesc');
  const docMeta = $('#docMeta');
  const docType = $('#docType');
  const previewDocBtn = $('#previewDocBtn');

  // File click / hover to update Document Preview Card
  folderFiles.forEach(file => {
    const updatePreview = () => {
      const title = file.dataset.title;
      const desc = file.dataset.desc;
      const tag = file.dataset.tag;
      const type = file.dataset.type;

      if (title && docTitle) docTitle.textContent = title;
      if (desc && docDesc) docDesc.textContent = desc;
      if (tag && docMeta) docMeta.innerHTML = `<i data-lucide="file-text"></i> ${tag}`;
      if (type && docType) docType.textContent = type;
      initLucide();
    };

    file.addEventListener('mouseenter', updatePreview);
    file.addEventListener('click', (e) => {
      e.stopPropagation();
      updatePreview();
      const card = $('#docPreviewCard');
      if (card) {
        card.style.transform = 'scale(1.02)';
        setTimeout(() => { card.style.transform = ''; }, 250);
      }
    });
  });

  // Folder Search Live Filter
  if (folderSearchInput) {
    folderSearchInput.addEventListener('input', () => {
      const q = folderSearchInput.value.toLowerCase().trim();
      folderFiles.forEach(file => {
        const title = (file.dataset.title || '').toLowerCase();
        const text = (file.querySelector('.file-text')?.textContent || '').toLowerCase();
        const type = (file.dataset.type || '').toLowerCase();

        if (!q || title.includes(q) || text.includes(q) || type.includes(q)) {
          file.style.opacity = '1';
          file.style.filter = '';
        } else {
          file.style.opacity = '0.35';
          file.style.filter = 'grayscale(0.8)';
        }
      });
    });

    // Prevent checkbox from closing when clicking inside search input
    folderSearchInput.addEventListener('click', (e) => {
      e.stopPropagation();
    });
  }

  // Preview Document Button interaction
  if (previewDocBtn) {
    previewDocBtn.addEventListener('click', () => {
      const origText = previewDocBtn.innerHTML;
      previewDocBtn.innerHTML = '<i data-lucide="check"></i> <span>Document Verified</span>';
      initLucide();
      setTimeout(() => {
        previewDocBtn.innerHTML = origText;
        initLucide();
      }, 2500);
    });
  }

})();

