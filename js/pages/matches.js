/* ============================================================
   MATCHES PAGE
   ============================================================ */

function renderMatches() {
  const app = document.getElementById('app');
  const recent = getRecent();

  const tournaments = [...new Set(recent.map(m => m.tournament).filter(Boolean))];

  app.innerHTML = `
    <div class="page">
      <section class="page-header">
        <div class="page-header-content">
          <div class="page-header-icon">⚽</div>
          <div>
            <h1 class="page-header-title">Trận Đấu</h1>
            <p class="page-header-desc">Kết quả và lịch sử các trận đấu</p>
          </div>
        </div>
      </section>

      <section class="section">
        <div class="filter-bar" id="matches-filter"></div>
        <div id="matches-by-tournament">
          ${renderMatchesByTournament(recent, 'all')}
        </div>
      </section>
    </div>
  `;

  // Filter
  const filterBar = document.getElementById('matches-filter');
  filterBar.innerHTML = `
    <button class="filter-btn active" data-filter="all">Tất cả</button>
    ${tournaments.map(t => `<button class="filter-btn" data-filter="${t}">${t}</button>`).join('')}
  `;
  filterBar.querySelectorAll('.filter-btn').forEach(btn => {
    btn.addEventListener('click', () => {
      filterBar.querySelectorAll('.filter-btn').forEach(b => b.classList.remove('active'));
      btn.classList.add('active');
      const f = btn.dataset.filter;
      document.getElementById('matches-by-tournament').innerHTML =
        renderMatchesByTournament(recent, f);
      bindResultCards();
    });
  });

  bindResultCards();
}

function renderMatchesByTournament(items, filter) {
  const filtered = filter === 'all' ? items : items.filter(m => m.tournament === filter);
  if (!filtered.length) return `<div class="empty-state"><div class="empty-state-icon">⚽</div><div class="empty-state-text">Không có trận đấu</div></div>`;

  if (filter !== 'all') {
    return `<div class="matches-grid">${renderResultCards(filtered)}</div>`;
  }

  const tournaments = [...new Set(filtered.map(m => m.tournament).filter(Boolean))];
  return tournaments.map(t => {
    const tMatches = filtered.filter(m => m.tournament === t);
    return `
      <div class="tournament-section">
        <div class="tournament-header"><span>${t}</span></div>
        <div class="matches-grid">${renderResultCards(tMatches)}</div>
      </div>
    `;
  }).join('');
}

function bindResultCards() {
  document.querySelectorAll('.result-card').forEach(card => {
    card.addEventListener('click', () => {
      const id = card.dataset.matchId;
      const m = getRecent().find(x => x.id === id);
      if (m) openMatchModal(m);
    });
  });
}
