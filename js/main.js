// Sticky header background on scroll
const header = document.getElementById('siteHeader');
const onScroll = () => {
  if (window.scrollY > 40) header.classList.add('scrolled');
  else header.classList.remove('scrolled');
};
window.addEventListener('scroll', onScroll);
onScroll();

// Mobile nav toggle
const navToggle = document.getElementById('navToggle');
const navToggleIcon = navToggle.querySelector('i');
const navLinks = document.getElementById('navLinks');
navToggle.addEventListener('click', () => {
  const open = navLinks.classList.toggle('open');
  navToggleIcon.classList.toggle('fa-bars', !open);
  navToggleIcon.classList.toggle('fa-xmark', open);
});
navLinks.querySelectorAll('a').forEach(link => {
  link.addEventListener('click', () => {
    navLinks.classList.remove('open');
    navToggleIcon.classList.add('fa-bars');
    navToggleIcon.classList.remove('fa-xmark');
  });
});

// Scroll reveal animations
const revealEls = document.querySelectorAll('.reveal');
const io = new IntersectionObserver((entries) => {
  entries.forEach(entry => {
    if (entry.isIntersecting) {
      entry.target.classList.add('in-view');
      io.unobserve(entry.target);
    }
  });
}, { threshold: 0.15 });
revealEls.forEach(el => io.observe(el));

// Footer year
const yearEl = document.getElementById('year');
if (yearEl) yearEl.textContent = new Date().getFullYear();

// Watches one .reel-item for its Instagram embed turning into a real iframe;
// falls back to a "Reel link needed" state if it never does. Used on the
// homepage (static reel-items, if any) and on category.html (dynamically
// injected reel-items call this themselves after being added to the DOM).
function watchReelEmbed(item) {
  const skeleton = item.querySelector('.reel-skeleton');
  const icon = skeleton?.querySelector('.reel-skeleton-icon');
  const text = skeleton?.querySelector('.reel-skeleton-text');

  const markLoaded = () => {
    item.classList.add('loaded');
    observer.disconnect();
    clearTimeout(timer);
  };

  const observer = new MutationObserver(() => {
    if (item.querySelector('iframe')) markLoaded();
  });
  observer.observe(item, { childList: true, subtree: true });

  const timer = setTimeout(() => {
    if (item.classList.contains('loaded')) return;
    observer.disconnect();
    item.classList.add('failed');
    if (icon) icon.className = 'fa-brands fa-instagram reel-skeleton-icon';
    if (text) text.textContent = 'Reel link needed';
  }, 8000);
}
window.watchReelEmbed = watchReelEmbed;

document.querySelectorAll('.reel-item').forEach(watchReelEmbed);

// Homepage category grid: built from data/work.json so categories/reels
// are managed from one JSON file instead of hardcoded HTML.
const categoryGrid = document.getElementById('categoryGrid');
if (categoryGrid) {
  fetch('data/work.json')
    .then((res) => res.json())
    .then((data) => {
      categoryGrid.innerHTML = data.categories.map((cat) => `
        <a class="category-card reveal" href="category.html?cat=${encodeURIComponent(cat.id)}">
          <i class="${cat.icon}"></i>
          <span class="category-card-name">${cat.name}</span>
          <span class="category-card-count">${cat.reels.length} Reel${cat.reels.length === 1 ? '' : 's'}</span>
        </a>
      `).join('');
      categoryGrid.querySelectorAll('.reveal').forEach((el) => io.observe(el));
    })
    .catch(() => {
      categoryGrid.innerHTML = '<p class="category-grid-error">Couldn\'t load categories right now — please refresh.</p>';
    });
}

// Brand logo cluster: built from data/brands.json, which just lists whatever
// image files are sitting in assets/img/brands/ — drop a file in, add its
// name to the JSON, it shows up here automatically.
const brandLogos = document.getElementById('brandLogos');
if (brandLogos) {
  fetch('data/brands.json')
    .then((res) => res.json())
    .then((data) => {
      brandLogos.innerHTML = data.logos.map((file) => `
        <div class="brand-logo reveal" style="background-image:url('assets/img/brands/${file}')"></div>
      `).join('');
      brandLogos.querySelectorAll('.reveal').forEach((el) => io.observe(el));
    })
    .catch(() => {
      brandLogos.innerHTML = '<p class="category-grid-error">Couldn\'t load brand logos right now — please refresh.</p>';
    });
}
