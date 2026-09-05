/// 主脚本：处理页面交互与优化后的动画
document.addEventListener('DOMContentLoaded', () => {
  initContactForm();
  initSmoothScrollHighlight();
  initScrollReveal();
  initHeroEntrance();
  initNavbarScroll();
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

    submitBtn.textContent = '看吧，发送不了🤣';
    submitBtn.disabled = true;

    setTimeout(() => {
      submitBtn.textContent = originalText;
      submitBtn.disabled = false;
    }, 2000);
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
  }, 100);

  window.addEventListener('scroll', highlightOnScroll);
  highlightOnScroll();
}

/**
 * 优化后的滚动显现动画
 * 使用 IntersectionObserver，配合 CSS 类 .reveal / .reveal-visible
 */
function initScrollReveal() {
  const revealElements = $$('.work-item, .about-highlight, .minimal-card, .contact-form');
  if (!revealElements.length || !('IntersectionObserver' in window)) return;

  // 如果用户偏好减少动画，直接显示
  const prefersReducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
  if (prefersReducedMotion) {
    revealElements.forEach(el => el.classList.add('reveal-visible'));
    return;
  }

  revealElements.forEach(el => el.classList.add('reveal'));

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

  revealElements.forEach(el => observer.observe(el));
}

/**
 * 英雄区入场动画：页面加载后依次淡入上移
 */
function initHeroEntrance() {
  const heroTitle = $('.hero h1');
  const heroDesc = $('.hero p');
  const heroActions = $('.hero-actions');
  const heroVisual = $('.hero-visual .minimal-card');

  if (!heroTitle) return;

  const prefersReducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
  if (prefersReducedMotion) {
    [heroTitle, heroDesc, heroActions, heroVisual].forEach(el => {
      if (el) el.style.opacity = '1';
    });
    return;
  }

  // 初始状态（由 CSS 定义 .hero-animate 初始透明度0，位移）
  heroTitle.classList.add('hero-animate');
  heroDesc.classList.add('hero-animate');
  heroActions.classList.add('hero-animate');
  heroVisual.classList.add('hero-animate');

  // 依次添加显示类
  setTimeout(() => heroTitle.classList.add('hero-animate-visible'), 100);
  setTimeout(() => heroDesc.classList.add('hero-animate-visible'), 300);
  setTimeout(() => heroActions.classList.add('hero-animate-visible'), 500);
  setTimeout(() => heroVisual.classList.add('hero-animate-visible'), 700);
}

/**
 * 导航栏滚动效果：添加阴影和更实的背景
 */
function initNavbarScroll() {
  const navbar = $('.navbar');
  if (!navbar) return;

  const updateNavbar = throttle(() => {
    if (window.scrollY > 20) {
      navbar.classList.add('navbar-scrolled');
    } else {
      navbar.classList.remove('navbar-scrolled');
    }
  }, 50);

  window.addEventListener('scroll', updateNavbar);
  updateNavbar();
}