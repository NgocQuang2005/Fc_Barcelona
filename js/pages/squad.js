/* ============================================================
   SQUAD PAGE
   ============================================================ */

function renderSquad() {
  const app = document.getElementById('app');
  const players = getPlayers();
  const coaches = getCoaches();

  const groups = {
    gk:  { label: 'Thủ Môn',  emoji: '🥅', players: players.filter(p => posGroup(p.position) === 'gk') },
    def: { label: 'Hậu Vệ',   emoji: '🛡️', players: players.filter(p => posGroup(p.position) === 'def') },
    mid: { label: 'Tiền Vệ',  emoji: '⚙️', players: players.filter(p => posGroup(p.position) === 'mid') },
    att: { label: 'Tiền Đạo', emoji: '⚡', players: players.filter(p => posGroup(p.position) === 'att') },
  };

  app.innerHTML = `
    <div class="page">
      <section class="page-header">
        <div class="page-header-content">
          <div class="page-header-icon">👥</div>
          <div>
            <h1 class="page-header-title">Đội Hình</h1>
            <p class="page-header-desc">Danh sách cầu thủ và ban huấn luyện</p>
          </div>
        </div>
      </section>

      <section class="section">
        ${Object.entries(groups).map(([key, g]) => g.players.length ? `
          <div class="position-section">
            <div class="position-title"><span class="position-emoji">${g.emoji}</span> ${g.label}</div>
            <div class="squad-grid">${g.players.map(p => renderSquadCard(p)).join('')}</div>
          </div>
        ` : '').join('')}
        ${coaches.length ? `
          <div class="position-section">
            <div class="position-title"><span class="position-emoji">👔</span> Ban Huấn Luyện</div>
            <div style="display:flex;flex-wrap:wrap;gap:1rem">
              ${coaches.map(c => `
                <div class="coach-card" data-coach-id="${c.id}">
                  ${c.image
                    ? `<img src="${c.image}" class="coach-img" alt="${c.name}" onerror="this.style.display='none';this.nextSibling.style.display='flex'">`
                    : ''}
                  <div class="coach-img-ph" ${c.image ? 'style="display:none"' : ''}>👔</div>
                  <div>
                    <div class="coach-title">Huấn Luyện Viên</div>
                    <div class="coach-name">${c.name}</div>
                    <div class="coach-nat">${c.nationality || ''}</div>
                  </div>
                </div>
              `).join('')}
            </div>
          </div>
        ` : ''}
        ${!players.length && !coaches.length ? `<div class="empty-state"><div class="empty-state-icon">👥</div><div class="empty-state-text">Chưa có dữ liệu đội hình</div></div>` : ''}
      </section>
    </div>
  `;

  document.querySelectorAll('.squad-card').forEach(card => {
    card.addEventListener('click', () => {
      const id = card.dataset.playerId;
      const p = players.find(x => x.id === id);
      if (p) openPlayerModal(p);
    });
  });
}

function renderSquadCard(p) {
  return `
    <div class="squad-card" data-player-id="${p.id}">
      ${p.image
        ? `<img src="${p.image}" class="squad-img" alt="${p.name}" onerror="this.style.display='none';this.nextSibling.style.display='flex'">`
        : ''}
      <div class="squad-img-ph" ${p.image ? 'style="display:none"' : ''}>🧑</div>
      <div class="squad-info">
        <div class="squad-number">${p.number || '—'}</div>
        <div class="squad-name">${p.name}</div>
        <div class="squad-nat">${p.nationality || ''}</div>
      </div>
    </div>
  `;
}
