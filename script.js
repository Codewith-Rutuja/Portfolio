// -------- Typing effect --------
document.addEventListener('DOMContentLoaded', () => {
  const dynamicText = document.querySelector('.animated-text .highlight');
  const phrases = [
    'Front-End Developer',
    'Creative Problem Solver'
  ];
  let idx = 0, pos = 0, del = false;

  function typeLoop() {
    const phrase = phrases[idx];
    dynamicText.textContent = del ? phrase.slice(0, pos - 1) : phrase.slice(0, pos + 1);
    pos = del ? pos - 1 : pos + 1;
    let wait = del ? 45 : 80;
    if (!del && pos === phrase.length) {
      wait = 1300;
      del = true;
    }
    if (del && pos === 0) {
      del = false;
      idx = (idx + 1) % phrases.length;
      wait = 380;
    }
    setTimeout(typeLoop, wait);
  }
  if (dynamicText) typeLoop();

  // -------- Intersection reveal animation --------
  const reveals = document.querySelectorAll('.reveal');
  const io = new window.IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) entry.target.classList.add('visible');
    });
  }, { threshold: 0.14 });
  reveals.forEach(el => io.observe(el));

  // -------- Theme toggle --------
  const themeToggle = document.getElementById('themeToggle');
  themeToggle?.addEventListener('click', () => {
    const root = document.documentElement;
    root.classList.toggle('light');
    themeToggle.textContent = root.classList.contains('light') ? 'Theme (Light)' : 'Theme';
  });

  // -------- Mobile menu --------
  const menuToggle = document.getElementById('menuToggle');
  const nav = document.getElementById('nav');
  menuToggle?.addEventListener('click', () => {
    const open = nav.style.display === 'flex';
    nav.style.display = open ? 'none' : 'flex';
    nav.style.flexDirection = 'column';
    nav.style.gap = '12px';
    nav.style.padding = '12px 24px';
    menuToggle.setAttribute('aria-expanded', !open);
  });

  // -------- Smooth scroll for anchor links --------
  document.querySelectorAll('a[href^="#"]').forEach(anchor => {
    anchor.addEventListener('click', (e) => {
      const id = anchor.getAttribute('href').slice(1);
      const target = document.getElementById(id);
      if (target) {
        e.preventDefault();
        target.scrollIntoView({ behavior: 'smooth', block: 'start' });
        if (window.innerWidth < 640 && nav.style.display === 'flex')
          nav.style.display = 'none';
      }
    });
  });

  // -------- CONTACT FORM AJAX --------
  const form = document.getElementById('contactForm');
  const statusEl = document.getElementById('formStatus');
  if (form && statusEl) {
    form.addEventListener('submit', async (e) => {
      e.preventDefault();
      statusEl.textContent = 'Sending…';
      const sendBtn = form.querySelector('.primary-btn');
      sendBtn.disabled = true;
      const fd = new FormData(form);
      const payload = Object.fromEntries(fd.entries());

      try {
        const res = await fetch('contact.php', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify(payload)
        });
        if (!res.ok) throw new Error('Network error');
        const data = await res.json();
        if (data.ok) {
          statusEl.textContent = 'Message sent. Thank you!';
          form.reset();
        } else {
          statusEl.textContent = 'Failed to send. Please try again later.';
        }
      } catch (err) {
        statusEl.textContent = 'Network error. Please try again.';
      }
      sendBtn.disabled = false;
    });
  }
});
