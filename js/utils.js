/* ============================================================
   UTILITY FUNCTIONS
   ============================================================ */

// Date formatters
function formatDate(str) {
  if (!str) return '—';
  const d = new Date(str);
  if (isNaN(d)) return '—';
  return d.toLocaleDateString('vi-VN', { day:'2-digit', month:'2-digit', year:'numeric' });
}

function formatDateTime(str) {
  if (!str) return '—';
  const d = new Date(str);
  if (isNaN(d)) return '—';
  return d.toLocaleString('vi-VN', { day:'2-digit', month:'2-digit', year:'numeric', hour:'2-digit', minute:'2-digit' });
}

// Team logo helper
function teamLogoHtml(team, size='sm') {
  const px = size === 'sm' ? 52 : 36;
  const cls = size === 'sm' ? 'team-logo-sm' : 'result-team-logo';
  const phCls = size === 'sm' ? 'team-logo-placeholder' : 'result-team-logo-ph';
  if (!team) return `<div class="${phCls}">⚽</div>`;
  if (team.logo) return `<img src="${team.logo}" class="${cls}" alt="${team.name}" onerror="this.style.display='none'">`;
  return `<div class="${phCls}">⚽</div>`;
}

// Position label
function positionLabel(pos) {
  const map = {
    GK:'Thủ Môn', CB:'Trung Vệ', LB:'Hậu Vệ Trái', RB:'Hậu Vệ Phải',
    CM:'Tiền Vệ Trung Tâm', DM:'Tiền Vệ Phòng Thủ', AM:'Tiền Vệ Tấn Công',
    LW:'Cánh Trái', RW:'Cánh Phải', ST:'Tiền Đạo', SS:'Tiền Đạo Lùi'
  };
  return map[pos] || pos;
}

// Position group
function posGroup(pos) {
  if (!pos) return 'other';
  if (pos === 'GK') return 'gk';
  if (['CB','LB','RB'].includes(pos)) return 'def';
  if (['CM','DM','AM'].includes(pos)) return 'mid';
  if (['LW','RW','ST','SS'].includes(pos)) return 'att';
  return 'other';
}

// Toast notification
let toastEl;
function showToast(msg, type='success') {
  if (!toastEl) {
    toastEl = document.createElement('div');
    toastEl.className = 'toast';
    document.body.appendChild(toastEl);
  }
  toastEl.className = 'toast' + (type === 'error' ? ' error' : '');
  toastEl.innerHTML = (type === 'success' ? '✅' : '❌') + ' ' + msg;
  toastEl.classList.add('show');
  clearTimeout(toastEl._t);
  toastEl._t = setTimeout(() => toastEl.classList.remove('show'), 2800);
}

// Modal
function openModal(html) {
  document.getElementById('modal-content').innerHTML = html;
  document.getElementById('modal-overlay').classList.add('open');
}

function closeModal() {
  document.getElementById('modal-overlay').classList.remove('open');
}

// Theme
function applyTheme(t) {
  const theme = t || localStorage.getItem('theme') || 'dark';
  document.documentElement.setAttribute('data-theme', theme);
  if (t) {
    localStorage.setItem('theme', t);
  }
}

function toggleTheme() {
  const cur = document.documentElement.getAttribute('data-theme') || 'dark';
  const newTheme = cur === 'dark' ? 'light' : 'dark';
  applyTheme(newTheme);
}

// Slider
let sliderIdx = 0;
function initSlider() {
  const track = document.getElementById('slider-track');
  const slides = track ? track.querySelectorAll('.match-slide') : [];
  const prev = document.getElementById('slider-prev');
  const next = document.getElementById('slider-next');
  if (!track || slides.length === 0) return;
  sliderIdx = 0;

  function getVisible() {
    const w = window.innerWidth;
    if (w >= 1200) return 3;
    if (w >= 768) return 2;
    return 1;
  }

  function updateSlider() {
    const visible = getVisible();
    const maxIdx = Math.max(0, slides.length - visible);
    sliderIdx = Math.min(sliderIdx, maxIdx);
    const offset = sliderIdx * (320 + 24);
    track.style.transform = `translateX(-${offset}px)`;
    if (prev) prev.style.opacity = sliderIdx === 0 ? '0.3' : '1';
    if (next) next.style.opacity = sliderIdx >= maxIdx ? '0.3' : '1';
  }

  if (prev) prev.addEventListener('click', () => { if (sliderIdx > 0) { sliderIdx--; updateSlider(); } });
  if (next) next.addEventListener('click', () => { const maxIdx = Math.max(0, slides.length - getVisible()); if (sliderIdx < maxIdx) { sliderIdx++; updateSlider(); } });

  updateSlider();
  window.addEventListener('resize', updateSlider);
}

// Filter
function initFilter(containerId, gridId, items, renderFn) {
  const container = document.getElementById(containerId);
  if (!container) return;
  const tournaments = [...new Set(items.map(m => m.tournament).filter(Boolean))];
  container.innerHTML = `
    <button class="filter-btn active" data-filter="all">Tất cả</button>
    ${tournaments.map(t => `<button class="filter-btn" data-filter="${t}">${t}</button>`).join('')}
  `;
  let active = 'all';
  container.querySelectorAll('.filter-btn').forEach(btn => {
    btn.addEventListener('click', () => {
      active = btn.dataset.filter;
      container.querySelectorAll('.filter-btn').forEach(b => b.classList.remove('active'));
      btn.classList.add('active');
      const grid = document.getElementById(gridId);
      const filtered = active === 'all' ? items : items.filter(m => m.tournament === active);
      if (grid) grid.innerHTML = renderFn(filtered);
    });
  });
}
