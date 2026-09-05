// 主脚本：处理页面交互与动画（全部加速）
document.addEventListener('DOMContentLoaded', () => {
  initContactForm();
  initSmoothScrollHighlight();
  initScrollReveal();
  initHeroEntrance();
  console.log('简明设计工作室 —— 去除多余，保留必要。');
});

/**
 * 联系表单：保持“发送不了信息”的幽默
 */
function initContactForm() {
  const form = $('#contactForm');
  if (!form) return;

  const submitBtn = form.querySelector('button[type="submit"]');
  const originalText = submitBtn.textContent;

  form.addEventListener('submit', (e) => {
    e.preventDefault();

    const name = $('#name').value.trim();
    const email = $('#email').value.trim();
    const msg = $('#msg').value.trim();
    if (!name || !email || !msg) {
      alert('请填写完整信息（虽然填写了也发送不了）');
      return;
    }

    submitBtn.textContent = '看吧，发送不了';
    submitBtn.disabled = true;

    setTimeout(() => {
      submitBtn.textContent = originalText;
      submitBtn.disabled = false;
    }, 1500);
  });
}

/**
 * 导航链接高亮
 */
function initSmoothScrollHighlight() {
  const navLinks = $$('.nav-links a[href^="#"]');
  const sections = navLinks
    .map(link => {
      const id = link.getAttribute('href').slice(1);
      return document.getElementById(id);
    })
    .filter(Boolean);

  if (!navLinks.length || !sections.length) return;

  navLinks.forEach(link => {
    link.addEventListener('click', () => {
      navLinks.forEach(l => l.classList.remove('active'));
      link.classList.add('active');
    });
  });

  const highlightOnScroll = throttle(() => {
    const scrollPos = window.scrollY + 120;
    let currentId = '';

    sections.forEach(section => {
      if (scrollPos >= section.offsetTop) {
        currentId = section.id;
      }
    });

    navLinks.forEach(link => {
      const href = link.getAttribute('href').slice(1);
      link.classList.toggle('active', href === currentId);
    });
  }, 80);

  window.addEventListener('scroll', highlightOnScroll);
  highlightOnScroll();
}

/**
 * 滚动显现动画（作品卡片依次显现，整体加快）
 */
function initScrollReveal() {
  const revealElements = $$('.about-highlight, .minimal-card, .contact-form');
  const workItems = $$('.work-item');

  if (!('IntersectionObserver' in window)) return;

  const prefersReducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
  if (prefersReducedMotion) {
    [...revealElements, ...workItems].forEach(el => el.classList.add('reveal-visible'));
    return;
  }

  // 普通元素：直接添加 reveal 类
  revealElements.forEach(el => el.classList.add('reveal'));

  // 作品卡片：添加 reveal 类，并设置较短的依次延迟
  workItems.forEach((el, index) => {
    el.classList.add('reveal');
    el.style.setProperty('--reveal-delay', `${index * 100}ms`);
  });

  const observer = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        entry.target.classList.add('reveal-visible');
        observer.unobserve(entry.target);
      }
    });
  }, {
    threshold: 0.15,
    rootMargin: '0px 0px -40px 0px'
  });

  [...revealElements, ...workItems].forEach(el => observer.observe(el));
}

/**
 * 英雄区入场动画（加快版，依次上浮淡入，间隔缩短）
 */
function initHeroEntrance() {
  const heroTitle = $('.hero h1.hero-animate');
  const heroDesc = $('.hero p.hero-animate');
  const heroActions = $('.hero-actions.hero-animate');
  const heroVisual = $('.hero-visual .minimal-card.hero-animate');

  if (!heroTitle) return;

  const prefersReducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
  if (prefersReducedMotion) {
    [heroTitle, heroDesc, heroActions, heroVisual].forEach(el => {
      if (el) el.classList.add('hero-animate-visible');
    });
    return;
  }

  setTimeout(() => heroTitle.classList.add('hero-animate-visible'), 0);
  setTimeout(() => heroDesc.classList.add('hero-animate-visible'), 120);
  setTimeout(() => heroActions.classList.add('hero-animate-visible'), 240);
  setTimeout(() => heroVisual.classList.add('hero-animate-visible'), 360);
}