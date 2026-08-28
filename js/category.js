const params = new URLSearchParams(window.location.search);
const catId = params.get('cat');

const titleEl = document.getElementById('categoryTitle');
const iconEl = document.getElementById('categoryIcon');
const countEl = document.getElementById('categoryCount');
const rowEl = document.getElementById('reelRow');
const stateEl = document.getElementById('categoryState');

function showError(message, title) {
  document.title = 'Category Not Found | Vraj Patel';
  titleEl.textContent = title || 'Category Not Found';
  iconEl.className = 'fa-solid fa-circle-exclamation';
  countEl.textContent = '';
  stateEl.textContent = message;
  stateEl.hidden = false;
  rowEl.hidden = true;
}

function renderReels(category) {
  document.title = `${category.name} Reels | Vraj Patel`;
  titleEl.textContent = category.name;
  iconEl.className = category.icon;

  if (!category.reels || category.reels.length === 0) {
    countEl.textContent = 'No Reels added yet';
    stateEl.textContent = 'No Reels have been added for this category yet — check back soon.';
    stateEl.hidden = false;
    rowEl.hidden = true;
    return;
  }

  countEl.textContent = `${category.reels.length} Reel${category.reels.length === 1 ? '' : 's'}`;

  rowEl.innerHTML = category.reels.map((url) => `
    <div class="reel-item">
      <div class="reel-skeleton"><i class="fa-solid fa-play reel-skeleton-icon"></i><span class="reel-skeleton-text">Loading reel</span></div>
      <blockquote class="instagram-media" data-instgrm-permalink="${url}" data-instgrm-version="14"></blockquote>
    </div>
  `).join('');

  rowEl.querySelectorAll('.reel-item').forEach((item) => window.watchReelEmbed(item));

  // Instagram's embed.js only auto-scans the page once on its own load;
  // content injected afterwards needs an explicit re-scan.
  let attempts = 0;
  (function processEmbeds() {
    if (window.instgrm) {
      window.instgrm.Embeds.process();
    } else if (attempts < 40) {
      attempts += 1;
      setTimeout(processEmbeds, 150);
    }
  })();
}

if (!catId) {
  showError('No category selected — head back home and pick a category.');
} else {
  fetch('data/work.json')
    .then((res) => res.json())
    .then((data) => {
      const category = data.categories.find((c) => c.id === catId);
      if (!category) {
        showError(`Category "${catId}" wasn't found.`);
        return;
      }
      renderReels(category);
    })
    .catch(() => showError('Couldn\'t load this category right now — please refresh.'));
}
