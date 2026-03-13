/* ============================================================
   MATCHES PAGE
   ============================================================ */

let _matchesRecent = [];

async function renderMatches() {
  const app = document.getElementById('app');
  await getTeams(); // populate cache for getTeamById()
  _matchesRecent = await getRecent();

  const tournaments = [...new Set(_matchesRecent.map(m => m.tournament).filter(Boolean))];

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
          ${renderMatchesByTournament(_matchesRecent, 'all')}
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
        renderMatchesByTournament(_matchesRecent, f);
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
      const m = _matchesRecent.find(x => x.id === id);
      if (m) openMatchModal(m);
    });
  });
}

function renderResultCards(items) {
  if (!items || !items.length) return '<div class="empty-state"><div class="empty-state-icon">⚽</div><div class="empty-state-text">Chưa có kết quả</div></div>';
  return items.map(m => {
    const home = getTeamById(m.homeTeamId) || { name: m.homeTeamName, logo: m.homeTeamLogo };
    const away = getTeamById(m.awayTeamId) || { name: m.awayTeamName, logo: m.awayTeamLogo };
    return `
      <div class="result-card" data-match-id="${m.id}">
        ${m.image
          ? `<img src="${m.image}" class="result-img" alt="match" onerror="this.style.display='none';this.nextSibling.style.display='flex'">`
          : ''}
        <div class="result-img-placeholder" ${m.image ? 'style="display:none"' : ''}>⚽</div>
        <div class="result-body">
          <div class="result-tournament">${m.tournament || 'Giao hữu'}</div>
          <div class="result-teams">
            <div class="result-team">
              ${teamLogoHtml(home, 'res')}
              <div class="result-team-name">${home ? home.name : 'TBD'}</div>
            </div>
            <div class="result-score">${m.score || '? - ?'}</div>
            <div class="result-team">
              ${teamLogoHtml(away, 'res')}
              <div class="result-team-name">${away ? away.name : 'TBD'}</div>
            </div>
          </div>
          <div class="result-date">📅 ${formatDateTime(m.time)} &nbsp;·&nbsp; 🏟️ ${m.stadium || ''}</div>
        </div>
      </div>
    `;
  }).join('');
}

function openMatchModal(m) {
  const home = getTeamById(m.homeTeamId) || { name: m.homeTeamName, logo: m.homeTeamLogo };
  const away = getTeamById(m.awayTeamId) || { name: m.awayTeamName, logo: m.awayTeamLogo };
  openModal(`
    <div style="text-align:center;margin-bottom:1.5rem">
      <div style="font-family:'Barlow Condensed',sans-serif;font-size:0.75rem;letter-spacing:2px;color:var(--accent);text-transform:uppercase;margin-bottom:0.5rem">${m.tournament}</div>
      <div style="font-size:0.85rem;color:var(--text-muted)">${formatDateTime(m.time)}</div>
    </div>
    <div style="display:flex;align-items:center;justify-content:space-between;gap:1rem;margin-bottom:1.5rem">
      <div style="text-align:center;flex:1">
        ${teamLogoHtml(home, 'sm')}
        <div style="margin-top:8px;font-family:'Barlow Condensed',sans-serif;font-weight:700;text-transform:uppercase;font-size:0.9rem">${home ? home.name : 'TBD'}</div>
      </div>
      <div style="font-family:'Bebas Neue',sans-serif;font-size:3rem;color:var(--accent);letter-spacing:4px">${m.score || '? - ?'}</div>
      <div style="text-align:center;flex:1">
        ${teamLogoHtml(away, 'sm')}
        <div style="margin-top:8px;font-family:'Barlow Condensed',sans-serif;font-weight:700;text-transform:uppercase;font-size:0.9rem">${away ? away.name : 'TBD'}</div>
      </div>
    </div>
    <div style="background:var(--bg-3);border-radius:10px;padding:1rem">
      <div style="font-size:0.8rem;color:var(--text-muted)">🏟️ ${m.stadium || '—'}</div>
    </div>
  `);
}
