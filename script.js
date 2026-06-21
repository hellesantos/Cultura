const yearElement = document.getElementById('year');
const navLinks = Array.from(document.querySelectorAll('.tab-link'));
const sections = navLinks
  .map((link) => link.getAttribute('href') || '')
  .filter((href) => href.startsWith('#'))
  .map((href) => document.querySelector(href))
  .filter(Boolean);

if (yearElement) {
  yearElement.textContent = new Date().getFullYear();
}

const setActiveLink = (link) => {
  navLinks.forEach((link) => link.classList.remove('active'));
  if (link) {
    link.classList.add('active');
    link.setAttribute('aria-current', 'page');
  }
};

const currentFile = window.location.pathname.split('/').pop() || 'index.html';

const normalizeHref = (href) => {
  if (!href) {
    return '';
  }

  const [path] = href.split('#');
  return path.split('/').pop() || '';
};

const pageLink = navLinks.find((link) => {
  const href = normalizeHref(link.getAttribute('href'));
  return href === currentFile || (currentFile === 'index.html' && (href === '' || href === 'index.html'));
});

if (pageLink) {
  setActiveLink(pageLink);
}

if ('IntersectionObserver' in window && sections.length > 0) {
  const observer = new IntersectionObserver(
    (entries) => {
      const visibleEntry = entries
        .filter((entry) => entry.isIntersecting)
        .sort((a, b) => b.intersectionRatio - a.intersectionRatio)[0];

      if (visibleEntry?.target?.id) {
        const sectionLink = navLinks.find((link) => link.getAttribute('href') === `#${visibleEntry.target.id}`);
        setActiveLink(sectionLink);
      }
    },
    {
      threshold: [0.25, 0.4, 0.6],
      rootMargin: '-10% 0px -55% 0px',
    }
  );

  sections.forEach((section) => observer.observe(section));
}

const decorativeCards = Array.from(document.querySelectorAll('.rail-card, .content-section, .tab-link'));

decorativeCards.forEach((element, index) => {
  element.style.setProperty('--lift-delay', `${index * 70}ms`);
});

const backToTopButton = document.querySelector('.back-to-top');

if (backToTopButton) {
  const updateBackToTopVisibility = () => {
    backToTopButton.classList.toggle('is-hidden', window.scrollY < 300);
  };

  updateBackToTopVisibility();
  window.addEventListener('scroll', updateBackToTopVisibility, { passive: true });
}
