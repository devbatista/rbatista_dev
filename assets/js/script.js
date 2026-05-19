// JavaScript para funcionalidades interativas
document.addEventListener('DOMContentLoaded', function () {

  // Inicializar ícones Lucide
  if (typeof lucide !== 'undefined') {
    lucide.createIcons();
  }

  // Smooth scroll para âncoras
  document.querySelectorAll('a[href^="#"]').forEach(anchor => {
    anchor.addEventListener('click', function (e) {
      e.preventDefault();
      const target = document.querySelector(this.getAttribute('href'));
      if (target) {
        target.scrollIntoView({
          behavior: 'smooth',
          block: 'start'
        });
      }
    });
  });

  // Funcionalidade dos botões
  setupButtonHandlers();

  // Animações de entrada
  observeElements();

  // Setup de tooltips
  setupTooltips();

  // Scrollytelling e progresso de leitura
  setupScrollytelling();
  updateScrollProgress();

  // Tema escuro (opcional)
  setupThemeToggle();
});

// Configurar handlers dos botões
function setupButtonHandlers() {
  // Botão Download CV
  const downloadBtn = document.querySelector('[data-action="download-cv"]');
  if (downloadBtn) {
    downloadBtn.addEventListener('click', function () {
      const link = document.createElement('a');
      link.href = './assets/pdf/rafael-batista.pdf';
      link.download = 'Rafael-Batista.pdf';
      link.style.display = 'none';
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);

      showToast('CV baixado com sucesso!', 'success');
    });
  }

  // Botões de contato
  const emailBtn = document.querySelector('[data-action="email"]');
  if (emailBtn) {
    emailBtn.addEventListener('click', function () {
      window.location.href = 'mailto:rafael@devbatista.com';
    });
  }

  const phoneBtn = document.querySelector('[data-action="phone"]');
  if (phoneBtn) {
    phoneBtn.addEventListener('click', function () {
      window.location.href = 'https://wa.me/5511986819042';
    });
  }

  const linkedinBtn = document.querySelector('[data-action="linkedin"]');
  if (linkedinBtn) {
    linkedinBtn.addEventListener('click', function () {
      window.open('https://linkedin.com/in/rbatist10', '_blank');
    });
  }

  const githubBtn = document.querySelector('[data-action="github"]');
  if (githubBtn) {
    githubBtn.addEventListener('click', function () {
      window.open('https://github.com/devbatista', '_blank');
    });
  }

  // Botões de projetos
  document.querySelectorAll('[data-action="project-link"]').forEach(btn => {
    btn.addEventListener('click', function () {
      const projectName = this.getAttribute('data-project');
      const projectUrl = this.getAttribute('data-url');

      if (projectUrl) {
        // Abrir link específico do projeto
        window.open(projectUrl, '_blank');
        showToast(`Abrindo projeto ${projectName}...`, 'success');
      } else {
        // Fallback para projetos sem URL
        console.log(`Abrir projeto: ${projectName}`);
        showToast(`Projeto ${projectName} em desenvolvimento...`, 'info');
      }
    });
  });
}

// Observer para animações de entrada
function observeElements() {
  const observer = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        entry.target.classList.add('animate-in');
      }
    });
  }, {
    threshold: 0.1,
    rootMargin: '0px 0px -50px 0px'
  });

  // Observar cards e blocos narrativos
  document.querySelectorAll('.card, .story-step').forEach(element => {
    observer.observe(element);
  });
}

function setupScrollytelling() {
  const steps = Array.from(document.querySelectorAll('.story-step'));
  const indexItems = Array.from(document.querySelectorAll('.story-index-item'));

  if (!steps.length) return;

  const observer = new IntersectionObserver((entries) => {
    const visibleEntry = entries
      .filter(entry => entry.isIntersecting)
      .sort((a, b) => b.intersectionRatio - a.intersectionRatio)[0];

    if (!visibleEntry) return;

    const activeIndex = steps.indexOf(visibleEntry.target);

    steps.forEach((step, index) => {
      step.classList.toggle('is-active', index === activeIndex);
    });

    indexItems.forEach((item, index) => {
      item.classList.toggle('is-active', index === activeIndex);
    });
  }, {
    threshold: [0.3, 0.45, 0.6, 0.75],
    rootMargin: '-18% 0px -30% 0px'
  });

  steps.forEach(step => observer.observe(step));
}

function updateScrollProgress() {
  const progress = document.querySelector('.scroll-progress');
  if (!progress) return;

  const scrollable = document.documentElement.scrollHeight - window.innerHeight;
  const percentage = scrollable > 0 ? (window.scrollY / scrollable) * 100 : 0;
  progress.style.width = `${Math.min(100, Math.max(0, percentage))}%`;
}

// Setup de tooltips simples
function setupTooltips() {
  const tooltipElements = document.querySelectorAll('[data-tooltip]');

  tooltipElements.forEach(element => {
    element.addEventListener('mouseenter', showTooltip);
    element.addEventListener('mouseleave', hideTooltip);
  });
}

function showTooltip(e) {
  const trigger = e.target.closest('[data-tooltip]');
  if (!trigger) return;

  const text = trigger.getAttribute('data-tooltip');
  const tooltip = document.createElement('div');
  tooltip.className = 'tooltip';
  tooltip.textContent = text;

  // Adicionar CSS do tooltip
  tooltip.style.cssText = `
        position: absolute;
        background: rgb(17 24 39);
        color: white;
        padding: 0.5rem;
        border-radius: 0.25rem;
        font-size: 0.875rem;
        z-index: 1000;
        pointer-events: none;
        white-space: nowrap;
    `;

  document.body.appendChild(tooltip);

  // Posicionar tooltip
  const rect = trigger.getBoundingClientRect();
  tooltip.style.left = rect.left + (rect.width / 2) - (tooltip.offsetWidth / 2) + 'px';
  tooltip.style.top = rect.top - tooltip.offsetHeight - 5 + 'px';

  trigger._tooltip = tooltip;
}

function hideTooltip(e) {
  const trigger = e.target.closest('[data-tooltip]');
  if (trigger && trigger._tooltip) {
    document.body.removeChild(trigger._tooltip);
    delete trigger._tooltip;
  }
}

// Sistema de toast para notificações
function showToast(message, type = 'info') {
  const toast = document.createElement('div');
  toast.className = `toast toast-${type}`;
  toast.textContent = message;

  // Estilo do toast
  toast.style.cssText = `
        position: fixed;
        top: 20px;
        right: 20px;
        background: ${type === 'success' ? 'rgb(34 197 94)' : 'rgb(59 130 246)'};
        color: white;
        padding: 1rem 1.5rem;
        border-radius: 0.5rem;
        z-index: 1000;
        font-size: 0.875rem;
        box-shadow: 0 10px 15px -3px rgb(0 0 0 / 0.1);
        transform: translateX(100%);
        transition: transform 0.3s ease-in-out;
    `;

  document.body.appendChild(toast);

  // Animar entrada
  setTimeout(() => {
    toast.style.transform = 'translateX(0)';
  }, 100);

  // Remover após 3 segundos
  setTimeout(() => {
    toast.style.transform = 'translateX(100%)';
    setTimeout(() => {
      if (document.body.contains(toast)) {
        document.body.removeChild(toast);
      }
    }, 300);
  }, 3000);
}

// Toggle de tema escuro (opcional)
function setupThemeToggle() {
  const themeToggle = document.querySelector('[data-action="theme-toggle"]');

  if (themeToggle) {
    themeToggle.addEventListener('click', function () {
      document.body.classList.toggle('dark-mode');

      const isDark = document.body.classList.contains('dark-mode');
      localStorage.setItem('theme', isDark ? 'dark' : 'light');

      showToast(`Tema ${isDark ? 'escuro' : 'claro'} ativado`);
    });

    // Carregar tema salvo
    const savedTheme = localStorage.getItem('theme');
    if (savedTheme === 'dark') {
      document.body.classList.add('dark-mode');
    }
  }
}

// Funcionalidades de scroll
window.addEventListener('scroll', function () {
  const header = document.querySelector('.hero-nav');
  if (!header) return;

  if (window.scrollY > 100) {
    header.classList.add('scrolled');
  } else {
    header.classList.remove('scrolled');
  }

  updateScrollProgress();
});

// Adicionar classe CSS para header com scroll
const style = document.createElement('style');
style.textContent = `
    .hero-nav.scrolled {
        box-shadow: 0 16px 45px rgb(0 0 0 / 0.18);
        backdrop-filter: blur(8px);
        background-color: rgb(15 23 42 / 0.78);
    }
    
    .animate-in {
        animation: slideInUp 0.6s ease-out forwards;
    }
    
    @keyframes slideInUp {
        from {
            opacity: 0;
            transform: translateY(30px);
        }
        to {
            opacity: 1;
            transform: translateY(0);
        }
    }
    
    /* Tema escuro */
    .dark-mode {
        background: rgb(15 23 42);
        color: rgb(241 245 249);
    }
    
    .dark-mode .card {
        background-color: rgb(30 41 59);
        border-color: rgb(51 65 85);
    }
    
    .dark-mode .btn-outline {
        border-color: rgb(71 85 105);
        color: rgb(203 213 225);
    }
    
    .dark-mode .btn-outline:hover {
        background-color: rgb(51 65 85);
    }
`;
document.head.appendChild(style);

// Utilitários
function debounce(func, wait) {
  let timeout;
  return function executedFunction(...args) {
    const later = () => {
      clearTimeout(timeout);
      func(...args);
    };
    clearTimeout(timeout);
    timeout = setTimeout(later, wait);
  };
}

// Log de inicialização
console.log('✨ Currículo Online carregado com sucesso!');
