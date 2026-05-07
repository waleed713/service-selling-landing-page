/**
 * AEVUM — Premium Luxury Landing Page
 * JavaScript: Scroll, Navigation, Reveal Animations
 * Author: Waleed | 03215459190
 */

/* ──────────────────────────────────────────
   1. DOM READY INIT
   ────────────────────────────────────────── */
document.addEventListener('DOMContentLoaded', () => {
  initStickyHeader();
  initSmoothScroll();
  initActiveNavLinks();
  initScrollReveal();
  initMobileNav();
});

/* ──────────────────────────────────────────
   2. STICKY HEADER — scrolled class toggle
   ────────────────────────────────────────── */
function initStickyHeader() {
  const header = document.getElementById('header');
  if (!header) return;

  const onScroll = () => {
    if (window.scrollY > 60) {
      header.classList.add('scrolled');
    } else {
      header.classList.remove('scrolled');
    }
  };

  window.addEventListener('scroll', onScroll, { passive: true });
  onScroll(); // Run once on load
}

/* ──────────────────────────────────────────
   3. SMOOTH SCROLL — internal anchor links
   ────────────────────────────────────────── */
function initSmoothScroll() {
  const HEADER_OFFSET = 80; // px — accounts for fixed header height

  document.querySelectorAll('a[href^="#"]').forEach(anchor => {
    anchor.addEventListener('click', e => {
      const targetId = anchor.getAttribute('href');
      if (!targetId || targetId === '#') return;

      const target = document.querySelector(targetId);
      if (!target) return;

      e.preventDefault();

      const targetTop = target.getBoundingClientRect().top + window.scrollY - HEADER_OFFSET;

      window.scrollTo({
        top: targetTop,
        behavior: 'smooth'
      });

      // Close mobile nav if open
      closeMobileNav();
    });
  });
}

/* ──────────────────────────────────────────
   4. ACTIVE NAV LINK HIGHLIGHTING
   Uses IntersectionObserver for accuracy
   ────────────────────────────────────────── */
function initActiveNavLinks() {
  const navLinks = document.querySelectorAll('.nav__link');
  const sections = document.querySelectorAll('main section[id]');

  if (!navLinks.length || !sections.length) return;

  const observerOptions = {
    root: null,
    rootMargin: '-20% 0px -60% 0px',
    threshold: 0
  };

  const observer = new IntersectionObserver(entries => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        const sectionId = entry.target.getAttribute('id');

        navLinks.forEach(link => {
          link.classList.remove('active');
          if (link.getAttribute('href') === `#${sectionId}`) {
            link.classList.add('active');
          }
        });
      }
    });
  }, observerOptions);

  sections.forEach(section => observer.observe(section));
}

/* ──────────────────────────────────────────
   5. SCROLL REVEAL ANIMATIONS
   Observes .reveal elements, adds .is-visible
   ────────────────────────────────────────── */
function initScrollReveal() {
  const revealElements = document.querySelectorAll('.reveal');
  if (!revealElements.length) return;

  const revealObserver = new IntersectionObserver(
    (entries) => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          entry.target.classList.add('is-visible');
          // Unobserve after animating (performance)
          revealObserver.unobserve(entry.target);
        }
      });
    },
    {
      root: null,
      rootMargin: '0px 0px -80px 0px',
      threshold: 0.1
    }
  );

  revealElements.forEach(el => revealObserver.observe(el));
}

/* ──────────────────────────────────────────
   6. MOBILE NAV TOGGLE
   ────────────────────────────────────────── */
function initMobileNav() {
  const toggle = document.getElementById('navToggle');
  const nav    = document.getElementById('nav');

  if (!toggle || !nav) return;

  toggle.addEventListener('click', () => {
    const isOpen = nav.classList.contains('open');
    if (isOpen) {
      closeMobileNav();
    } else {
      openMobileNav();
    }
  });

  // Close on outside click
  document.addEventListener('click', e => {
    if (!toggle.contains(e.target) && !nav.contains(e.target)) {
      closeMobileNav();
    }
  });
}

function openMobileNav() {
  const nav    = document.getElementById('nav');
  const toggle = document.getElementById('navToggle');
  if (!nav || !toggle) return;

  nav.classList.add('open');
  toggle.setAttribute('aria-expanded', 'true');

  // Animate hamburger → X
  const spans = toggle.querySelectorAll('span');
  if (spans.length === 3) {
    spans[0].style.transform = 'translateY(7px) rotate(45deg)';
    spans[1].style.opacity   = '0';
    spans[2].style.transform = 'translateY(-7px) rotate(-45deg)';
  }
}

function closeMobileNav() {
  const nav    = document.getElementById('nav');
  const toggle = document.getElementById('navToggle');
  if (!nav || !toggle) return;

  nav.classList.remove('open');
  toggle.setAttribute('aria-expanded', 'false');

  // Reset hamburger
  const spans = toggle.querySelectorAll('span');
  if (spans.length === 3) {
    spans[0].style.transform = '';
    spans[1].style.opacity   = '1';
    spans[2].style.transform = '';
  }
}

/* ──────────────────────────────────────────
   7. SUBTLE CURSOR GLOW (Optional Enhancement)
   Adds a premium soft cursor effect on desktop
   ────────────────────────────────────────── */
(function initCursorGlow() {
  // Only on non-touch devices
  if (window.matchMedia('(pointer: coarse)').matches) return;

  const glow = document.createElement('div');
  glow.style.cssText = `
    position: fixed;
    pointer-events: none;
    z-index: 9999;
    width: 320px;
    height: 320px;
    border-radius: 50%;
    background: radial-gradient(circle, rgba(0,212,200,0.04) 0%, transparent 70%);
    transform: translate(-50%, -50%);
    transition: left 0.5s ease, top 0.5s ease;
    will-change: left, top;
  `;
  document.body.appendChild(glow);

  document.addEventListener('mousemove', e => {
    glow.style.left = e.clientX + 'px';
    glow.style.top  = e.clientY + 'px';
  }, { passive: true });
})();
