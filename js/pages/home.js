/* ============================================================
   HOME PAGE
   ============================================================ */

async function renderHome() {
  const app = document.getElementById('app');
  await getTeams(); // populate cache for getTeamById()
  const [club, upcoming, players, recent, legendsAll, newsAll] = await Promise.all([
    getClub(), getUpcoming(), getPlayers(), getRecent(), getLegends(), getNews()
  ]);
  const legends = legendsAll.slice(0, 4);
  const news = newsAll.sort((a, b) => new Date(b.date) - new Date(a.date)).slice(0, 3);

  app.innerHTML = `
    <div class="page">
      <!-- HERO -->
      <section class="hero">
        <div class="hero-bg"></div>
        <div class="hero-logo-wrap">
          <img src="https://cdn-media.sforum.vn/storage/app/media/ctvseo_MH/H%C3%ACnh%20n%E1%BB%81n%20Barcelona/hinh-nen-barcelona-thumbnail.jpg"
               class="hero-logo" alt="Club Logo"
               onerror="this.src='data:image/svg+xml,<svg xmlns=%22http://www.w3.org/2000/svg%22 viewBox=%220 0 100 100%22><text y=%22.9em%22 font-size=%2280%22>⚽</text></svg>'">
          <div class="hero-logo-ring"></div>
        </div>
        <h1 class="hero-title">${club.clubName || 'FC CLUB'}</h1>
        <p class="hero-desc">${club.description || 'Câu lạc bộ bóng đá chuyên nghiệp'}</p>
        <div class="hero-badge">⚽ Mùa giải 2024/25</div>
      </section>

      <div class="section-divider"></div>

      <!-- UPCOMING SLIDER -->
      <section class="section">
        <div class="section-header">
          <h2 class="section-title">Lịch Thi Đấu</h2>
          <a href="matches.html" class="section-link">Xem tất cả →</a>
        </div>
        ${upcoming.length ? `
        <div class="slider-wrap">
          <button class="slider-nav prev" id="slider-prev">‹</button>
          <div class="slider-container">
            <div class="slider-track" id="slider-track">
              ${upcoming.map(m => renderUpcomingCard(m)).join('')}
            </div>
          </div>
          <button class="slider-nav next" id="slider-next">›</button>
        </div>
        ` : `<div class="empty-state"><div class="empty-state-icon">📅</div><div class="empty-state-text">Chưa có lịch thi đấu</div></div>`}
      </section>

      <div class="section-divider"></div>

      <!-- NEWS -->
      <section class="section">
        <div class="section-header">
          <h2 class="section-title">Tin Tức Mới Nhất</h2>
          <a href="news.html" class="section-link">Tất cả tin →</a>
        </div>
        ${news.length ? `
        <div class="news-grid-home">
          ${news.map(n => `
            <article class="news-card-home" data-news-id="${n.id}">
              ${n.image 
                ? `<img src="${n.image}" class="news-img-home" alt="${n.title}" onerror="this.style.display='none';this.nextSibling.style.display='flex'">` 
                : ''}
              <div class="news-img-ph-home" ${n.image ? 'style="display:none"' : ''}>📰</div>
              <div class="news-content-home">
                <div class="news-date-home">📅 ${formatDate(n.date)}</div>
                <h3 class="news-title-home">${n.title}</h3>
                <p class="news-excerpt-home">${(n.content || '').substring(0, 100)}...</p>
              </div>
            </article>
          `).join('')}
        </div>
        ` : `<div class="empty-state"><div class="empty-state-icon">📰</div><div class="empty-state-text">Chưa có tin tức</div></div>`}
      </section>

      <div class="section-divider"></div>

      <!-- LEGENDS -->
      <section class="section">
        <div class="section-header">
          <h2 class="section-title">Huyền Thoại CLB</h2>
          <a href="legends.html" class="section-link">Xem tất cả →</a>
        </div>
        ${legends.length ? `
        <div class="legends-grid-home">
          ${legends.map(l => `
            <div class="legend-card-home" data-legend-id="${l.id}">
              ${l.image 
                ? `<img src="${l.image}" class="legend-img-home" alt="${l.name}" onerror="this.style.display='none';this.nextSibling.style.display='flex'">` 
                : ''}
              <div class="legend-img-ph-home" ${l.image ? 'style="display:none"' : ''}>👤</div>
              <div class="legend-info-home">
                <div class="legend-name-home">${l.name}</div>
                <div class="legend-period-home">${l.period || '—'}</div>
              </div>
            </div>
          `).join('')}
        </div>
        ` : `<div class="empty-state"><div class="empty-state-icon">🏆</div><div class="empty-state-text">Chưa có huyền thoại</div></div>`}
      </section>

      <div class="section-divider"></div>

      <!-- PLAYERS -->
      <section class="section">
        <div class="section-header">
          <h2 class="section-title">Cầu Thủ</h2>
          <a href="squad.html" class="section-link">Đội hình →</a>
        </div>
        ${players.length ? `
        <div class="players-grid">
          ${players.slice(0,12).map(p => renderPlayerCard(p)).join('')}
        </div>
        ` : `<div class="empty-state"><div class="empty-state-icon">👥</div><div class="empty-state-text">Chưa có cầu thủ</div></div>`}
      </section>

      <div class="section-divider"></div>

      <!-- RECENT MATCHES -->
      <section class="section">
        <div class="section-header">
          <h2 class="section-title">Kết Quả Gần Đây</h2>
          <a href="#matches" class="section-link" onclick="navigate('matches');return false;">Tất cả trận →</a>
        </div>
        <div class="filter-bar" id="home-filter"></div>
        <div class="matches-grid" id="home-results">
          ${renderResultCards(recent)}
        </div>
      </section>
    </div>
  `;

  setTimeout(() => initSlider(), 50);
  initFilter('home-filter', 'home-results', recent, renderResultCards);
  bindPlayerCards(players);
  bindResultCards(recent);
  bindHomeNewsCards();
  bindHomeLegendCards();
}

function renderUpcomingCard(m) {
  const home = getTeamById(m.homeTeamId) || { name: m.homeTeamName, logo: m.homeTeamLogo };
  const away = getTeamById(m.awayTeamId) || { name: m.awayTeamName, logo: m.awayTeamLogo };
  return `
    <div class="match-slide">
      <div class="match-tournament">${m.tournament || 'Giao hữu'}</div>
      <div class="match-teams">
        <div class="match-team">
          ${teamLogoHtml(home, 'sm')}
          <div class="team-name-sm">${home ? home.name : 'TBD'}</div>
        </div>
        <div class="match-vs">VS</div>
        <div class="match-team">
          ${teamLogoHtml(away, 'sm')}
          <div class="team-name-sm">${away ? away.name : 'TBD'}</div>
        </div>
      </div>
      <div class="match-info">
        <div class="match-info-row">🕐 <span>${formatDateTime(m.time)}</span></div>
        <div class="match-info-row">🏟️ <span>${m.stadium || 'TBD'}</span></div>
      </div>
    </div>
  `;
}

function renderPlayerCard(p) {
  return `
    <div class="player-card" data-player-id="${p.id}">
      ${p.number ? `<div class="player-number-badge">${p.number}</div>` : ''}
      ${p.image
        ? `<img src="${p.image}" class="player-img" alt="${p.name}" onerror="this.style.display='none';this.nextSibling.style.display='flex'">`
        : ''}
      <div class="player-img-placeholder" ${p.image ? 'style="display:none"' : ''}>🧑</div>
      <div class="player-info-sm">
        <div class="player-name-sm">${p.name}</div>
        <div class="player-pos-badge">${positionLabel(p.position)}</div>
      </div>
    </div>
  `;
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

function bindPlayerCards(players) {
  document.querySelectorAll('.player-card').forEach(card => {
    card.addEventListener('click', () => {
      const id = card.dataset.playerId;
      const p = players.find(x => x.id === id);
      if (p) openPlayerModal(p);
    });
  });
}

function bindResultCards(recent) {
  document.querySelectorAll('.result-card').forEach(card => {
    card.addEventListener('click', () => {
      const id = card.dataset.matchId;
      const m = recent ? recent.find(x => x.id === id) : null;
      if (m) openMatchModal(m);
    });
  });
}

function bindHomeNewsCards() {
  document.querySelectorAll('.news-card-home').forEach(card => {
    card.addEventListener('click', async () => {
      const id = card.dataset.newsId;
      const newsItem = await getNewsById(id);
      if (newsItem) openNewsModal(newsItem);
    });
  });
}

function bindHomeLegendCards() {
  document.querySelectorAll('.legend-card-home').forEach(card => {
    card.addEventListener('click', async () => {
      const id = card.dataset.legendId;
      const legend = await getLegendById(id);
      if (legend) openLegendModal(legend);
    });
  });
}

function openPlayerModal(p) {
  const team = getTeamById(p.teamId) || { name: p.team_name || '—' };
  openModal(`
    ${p.image
      ? `<img src="${p.image}" class="modal-player-img" alt="${p.name}" onerror="this.src=''">`
      : `<div class="modal-player-img-ph">🧑</div>`}
    <div class="modal-player-number">${p.number || '—'}</div>
    <div class="modal-player-name">${p.name}</div>
    <div class="modal-details">
      <div class="modal-detail-item"><div class="modal-detail-label">Vị Trí</div><div class="modal-detail-value">${positionLabel(p.position)}</div></div>
      <div class="modal-detail-item"><div class="modal-detail-label">Quốc Tịch</div><div class="modal-detail-value">${p.nationality || '—'}</div></div>
      <div class="modal-detail-item"><div class="modal-detail-label">Ngày Sinh</div><div class="modal-detail-value">${formatDate(p.birthday)}</div></div>
      <div class="modal-detail-item"><div class="modal-detail-label">Đội</div><div class="modal-detail-value">${team ? team.name : '—'}</div></div>
    </div>
  `);
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
