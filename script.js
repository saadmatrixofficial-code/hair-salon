
(function(){
  const body = document.body;
  const navToggle = document.querySelector('[data-nav-toggle]');
  const mobileMenu = document.querySelector('[data-mobile-menu]');
  const topbar = document.querySelector('.topbar');
  const revealItems = document.querySelectorAll('.reveal');
  const counters = document.querySelectorAll('[data-count]');
  const compare = document.querySelector('.compare-stage');
  const compareRange = document.querySelector('[data-compare-range]');
  const faqItems = document.querySelectorAll('.faq-item');
  const testimonialTrack = document.querySelector('[data-testimonial-track]');
  const prevBtn = document.querySelector('[data-testimonial-prev]');
  const nextBtn = document.querySelector('[data-testimonial-next]');
  const yearEl = document.querySelector('[data-year]');

  if (yearEl) yearEl.textContent = new Date().getFullYear();

  if (navToggle && mobileMenu) {
    navToggle.addEventListener('click', () => {
      const open = body.classList.toggle('nav-open');
      mobileMenu.classList.toggle('open', open);
      navToggle.setAttribute('aria-expanded', String(open));
    });
    mobileMenu.querySelectorAll('a').forEach(link => {
      link.addEventListener('click', () => {
        body.classList.remove('nav-open');
        mobileMenu.classList.remove('open');
        navToggle.setAttribute('aria-expanded', 'false');
      });
    });
  }

  const activePath = (location.pathname.split('/').pop() || 'index.html').toLowerCase();
  document.querySelectorAll('.nav-links a, .mobile-menu a, .footer-links a').forEach(a => {
    const href = a.getAttribute('href');
    if (!href) return;
    const clean = href.split('#')[0].toLowerCase();
    if (clean === activePath) {
      a.classList.add('active');
      a.setAttribute('aria-current', 'page');
    }
  });

  const onScroll = () => {
    if (!topbar) return;
    topbar.classList.toggle('is-scrolled', window.scrollY > 8);
  };
  window.addEventListener('scroll', onScroll, {passive:true});
  onScroll();

  const observer = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        entry.target.classList.add('is-visible');
        if (entry.target.hasAttribute('data-count')) {
          animateCount(entry.target);
        }
        observer.unobserve(entry.target);
      }
    });
  }, {threshold: 0.2});

  revealItems.forEach(el => observer.observe(el));
  counters.forEach(el => observer.observe(el));

  function animateCount(el){
    const target = parseFloat(el.dataset.count);
    const duration = 1100;
    const start = performance.now();
    const isPlus = el.dataset.suffix === '+';
    const isPercent = el.dataset.suffix === '%';
    const isDecimal = String(target).includes('.');
    function frame(now){
      const progress = Math.min((now - start) / duration, 1);
      const eased = 1 - Math.pow(1 - progress, 3);
      const value = target * eased;
      let display;
      if (target >= 1000 && !isPercent) {
        display = Math.round(value).toLocaleString();
      } else if (isDecimal) {
        display = value.toFixed(1).replace(/\.0$/, '');
      } else {
        display = Math.round(value).toLocaleString();
      }
      el.textContent = display + (isPlus ? '+' : isPercent ? '%' : '');
      if (progress < 1) requestAnimationFrame(frame);
    }
    requestAnimationFrame(frame);
  }

  faqItems.forEach(item => {
    const btn = item.querySelector('.faq-q');
    btn?.addEventListener('click', () => {
      const open = item.classList.toggle('open');
      btn.setAttribute('aria-expanded', String(open));
    });
  });

  if (compare && compareRange) {
    const afterWrap = compare.querySelector('.after-wrap');
    const setCompare = (value) => {
      afterWrap.style.width = `${value}%`;
    };
    compareRange.addEventListener('input', e => setCompare(e.target.value));
    setCompare(compareRange.value);
  }


  document.querySelectorAll('form[action="#"]').forEach(form => {
    form.addEventListener('submit', (e) => {
      e.preventDefault();
      const submit = form.querySelector('button[type="submit"]');
      if (submit) {
        const original = submit.textContent;
        submit.textContent = 'Request sent';
        submit.disabled = true;
        window.setTimeout(() => {
          submit.textContent = original;
          submit.disabled = false;
        }, 2200);
      }
    });
  });

  function scrollTestimonials(dir){
    if (!testimonialTrack) return;
    testimonialTrack.scrollBy({left: dir * Math.min(480, testimonialTrack.clientWidth * 0.85), behavior:'smooth'});
  }
  prevBtn?.addEventListener('click', () => scrollTestimonials(-1));
  nextBtn?.addEventListener('click', () => scrollTestimonials(1));
})();
