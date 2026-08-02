/* ==========================================================================
   HORIZON ESTATES — script.js
   Handles: loader, sticky nav, mobile drawer, search tabs, filter tabs,
   animated counters, EMI calculator, FAQ accordion, gallery lightbox,
   back-to-top, contact form validation, newsletter validation.
   ========================================================================== */

document.addEventListener('DOMContentLoaded', function () {

  /* ---------------- Page loader ---------------- */
  var loader = document.getElementById('page-loader');
  if (loader) {
    window.addEventListener('load', function () {
      setTimeout(function () { loader.classList.add('hidden'); }, 300);
    });
    // fallback in case 'load' already fired
    setTimeout(function () { loader.classList.add('hidden'); }, 1800);
  }

  /* ---------------- Sticky header on scroll ---------------- */
  var header = document.getElementById('siteHeader');
  function onScrollHeader() {
    if (!header) return;
    if (window.scrollY > 40) header.classList.add('scrolled');
    else header.classList.remove('scrolled');
  }
  window.addEventListener('scroll', onScrollHeader, { passive: true });
  onScrollHeader();

  /* ---------------- Mobile drawer ---------------- */
  var navToggle = document.getElementById('navToggle');
  var drawer = document.getElementById('mobileDrawer');
  var drawerBackdrop = document.getElementById('drawerBackdrop');
  var closeDrawer = document.getElementById('closeDrawer');
  function openDrawer() { drawer && drawer.classList.add('open'); drawerBackdrop && drawerBackdrop.classList.add('open'); }
  function closeDrawerFn() { drawer && drawer.classList.remove('open'); drawerBackdrop && drawerBackdrop.classList.remove('open'); }
  navToggle && navToggle.addEventListener('click', openDrawer);
  closeDrawer && closeDrawer.addEventListener('click', closeDrawerFn);
  drawerBackdrop && drawerBackdrop.addEventListener('click', closeDrawerFn);

  /* ---------------- Search console tabs ---------------- */
  var searchTabs = document.querySelectorAll('.search-tabs button');
  searchTabs.forEach(function (btn) {
    btn.addEventListener('click', function () {
      searchTabs.forEach(function (b) { b.classList.remove('active'); });
      btn.classList.add('active');
    });
  });

  var searchForm = document.getElementById('searchForm');
  searchForm && searchForm.addEventListener('submit', function (e) {
    e.preventDefault();
    var results = document.querySelector('.property-grid');
    if (results) {
      results.scrollIntoView({ behavior: 'smooth', block: 'start' });
    }
  });

  /* ---------------- Property filter tabs (visual only) ---------------- */
  var filterTabs = document.querySelectorAll('.tabs-filter button');
  filterTabs.forEach(function (btn) {
    btn.addEventListener('click', function () {
      filterTabs.forEach(function (b) { b.classList.remove('active'); });
      btn.classList.add('active');
    });
  });

  /* ---------------- Animated stat counters ---------------- */
  var counters = document.querySelectorAll('.stat-num[data-count]');
  function animateCounter(el) {
    var target = parseInt(el.getAttribute('data-count'), 10) || 0;
    var duration = 1600;
    var start = null;
    function step(ts) {
      if (!start) start = ts;
      var progress = Math.min((ts - start) / duration, 1);
      var eased = 1 - Math.pow(1 - progress, 3);
      el.textContent = Math.floor(eased * target).toLocaleString('en-IN');
      if (progress < 1) requestAnimationFrame(step);
      else el.textContent = target.toLocaleString('en-IN') + '+';
    }
    requestAnimationFrame(step);
  }
  if (counters.length && 'IntersectionObserver' in window) {
    var counterObserver = new IntersectionObserver(function (entries) {
      entries.forEach(function (entry) {
        if (entry.isIntersecting) {
          animateCounter(entry.target);
          counterObserver.unobserve(entry.target);
        }
      });
    }, { threshold: 0.5 });
    counters.forEach(function (c) { counterObserver.observe(c); });
  }

  /* ---------------- Scroll reveal ---------------- */
  var revealEls = document.querySelectorAll('.reveal');
  if (revealEls.length && 'IntersectionObserver' in window) {
    var revealObserver = new IntersectionObserver(function (entries) {
      entries.forEach(function (entry) {
        if (entry.isIntersecting) {
          entry.target.classList.add('in');
          revealObserver.unobserve(entry.target);
        }
      });
    }, { threshold: 0.12 });
    revealEls.forEach(function (el) { revealObserver.observe(el); });
  } else {
    revealEls.forEach(function (el) { el.classList.add('in'); });
  }

  /* ---------------- EMI Calculator ---------------- */
  var loanAmt = document.getElementById('loanAmt');
  var loanRate = document.getElementById('loanRate');
  var loanTenure = document.getElementById('loanTenure');

  function formatINR(num) {
    return '₹' + Math.round(num).toLocaleString('en-IN');
  }

  function calcEMI() {
    if (!loanAmt || !loanRate || !loanTenure) return;
    var P = parseFloat(loanAmt.value);
    var annualRate = parseFloat(loanRate.value);
    var years = parseFloat(loanTenure.value);
    var r = annualRate / 12 / 100;
    var n = years * 12;

    var emi = r === 0 ? P / n : (P * r * Math.pow(1 + r, n)) / (Math.pow(1 + r, n) - 1);
    var totalPayment = emi * n;
    var totalInterest = totalPayment - P;

    document.getElementById('loanAmtVal').textContent = formatINR(P);
    document.getElementById('loanRateVal').textContent = annualRate.toFixed(1) + '%';
    document.getElementById('loanTenureVal').textContent = years + ' Years';
    document.getElementById('emiMonthly').textContent = formatINR(emi);
    document.getElementById('emiInterest').textContent = formatINR(totalInterest);
    document.getElementById('emiTotal').textContent = formatINR(totalPayment);
  }
  [loanAmt, loanRate, loanTenure].forEach(function (input) {
    input && input.addEventListener('input', calcEMI);
  });
  calcEMI();

  /* ---------------- FAQ accordion ---------------- */
  var faqItems = document.querySelectorAll('.faq-item');
  faqItems.forEach(function (item) {
    var q = item.querySelector('.faq-q');
    q && q.addEventListener('click', function () {
      var wasOpen = item.classList.contains('open');
      faqItems.forEach(function (i) { i.classList.remove('open'); });
      if (!wasOpen) item.classList.add('open');
    });
  });

  /* ---------------- Gallery lightbox ---------------- */
  var galleryItems = document.querySelectorAll('.gallery-item[data-full]');
  var lightbox = document.getElementById('lightbox');
  var lightboxImg = document.getElementById('lightboxImg');
  var lightboxClose = document.getElementById('lightboxClose');
  galleryItems.forEach(function (item) {
    item.addEventListener('click', function () {
      if (!lightbox || !lightboxImg) return;
      lightboxImg.src = item.getAttribute('data-full');
      lightboxImg.alt = item.querySelector('img') ? item.querySelector('img').alt : 'Property photo';
      lightbox.classList.add('open');
    });
  });
  lightboxClose && lightboxClose.addEventListener('click', function () { lightbox.classList.remove('open'); });
  lightbox && lightbox.addEventListener('click', function (e) { if (e.target === lightbox) lightbox.classList.remove('open'); });
  document.addEventListener('keydown', function (e) { if (e.key === 'Escape' && lightbox) lightbox.classList.remove('open'); });

  /* ---------------- Back to top ---------------- */
  var backTop = document.getElementById('backTop');
  window.addEventListener('scroll', function () {
    if (!backTop) return;
    if (window.scrollY > 500) backTop.classList.add('show');
    else backTop.classList.remove('show');
  }, { passive: true });
  backTop && backTop.addEventListener('click', function () {
    window.scrollTo({ top: 0, behavior: 'smooth' });
  });

  /* ---------------- Contact form validation ---------------- */
  var contactForm = document.getElementById('contactForm');
  if (contactForm) {
    contactForm.addEventListener('submit', function (e) {
      e.preventDefault();
      var valid = true;
      var fields = contactForm.querySelectorAll('[data-required]');

      fields.forEach(function (field) {
        var wrapper = field.closest('.form-field');
        var value = field.value.trim();
        var ok = true;

        if (field.hasAttribute('required') && value === '') ok = false;
        if (field.type === 'email' && value !== '') {
          var emailRe = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
          if (!emailRe.test(value)) ok = false;
        }
        if (field.type === 'tel' && value !== '') {
          var phoneRe = /^[6-9]\d{9}$/;
          if (!phoneRe.test(value.replace(/\D/g, '').slice(-10))) ok = false;
        }

        if (!ok) { wrapper && wrapper.classList.add('invalid'); valid = false; }
        else { wrapper && wrapper.classList.remove('invalid'); }
      });

      var statusEl = document.getElementById('formStatus');
      if (valid) {
        statusEl.textContent = "Thank you! Your enquiry has been received — a Horizon Estates advisor will contact you within a few hours.";
        statusEl.className = 'form-status success';
        contactForm.reset();
      } else {
        statusEl.textContent = "Please correct the highlighted fields and try again.";
        statusEl.className = 'form-status error';
      }
    });
  }

  /* ---------------- Newsletter validation ---------------- */
  var newsletterForm = document.getElementById('newsletterForm');
  newsletterForm && newsletterForm.addEventListener('submit', function (e) {
    e.preventDefault();
    var input = newsletterForm.querySelector('input[type=email]');
    var emailRe = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (input && emailRe.test(input.value.trim())) {
      input.value = '';
      input.placeholder = 'Subscribed! Thank you.';
    } else {
      input.placeholder = 'Enter a valid email';
    }
  });

  /* ---------------- Footer year ---------------- */
  var yearEl = document.getElementById('year');
  if (yearEl) yearEl.textContent = new Date().getFullYear();

});
