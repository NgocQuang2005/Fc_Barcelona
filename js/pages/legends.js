/* ============================================================
   LEGENDS PAGE
   ============================================================ */

async function renderLegends() {
  const app = document.getElementById('app');
  const [legends, club] = await Promise.all([getLegends(), getClub()]);

  app.innerHTML = `
    <div class="page">
      <section class="page-header">
        <div class="page-header-content">
          <div class="page-header-icon">🏆</div>
          <div>
            <h1 class="page-header-title">Huyền Thoại ${club.clubName || 'CLB'}</h1>
            <p class="page-header-desc">Những người đã khắc tên mình vào lịch sử câu lạc bộ</p>
          </div>
        </div>
      </section>

      <section class="section">
        ${legends.length ? `
        <div class="legends-grid">
          ${legends.map(l => renderLegendCard(l)).join('')}
        </div>
        ` : `<div class="empty-state"><div class="empty-state-icon">🏆</div><div class="empty-state-text">Chưa có huyền thoại nào</div></div>`}
      </section>
    </div>
  `;

  bindLegendCards();
}

function renderLegendCard(legend) {
  return `
    <div class="legend-card" data-legend-id="${legend.id}">
      ${legend.image 
        ? `<img src="${legend.image}" class="legend-img" alt="${legend.name}" onerror="this.style.display='none';this.nextSibling.style.display='flex'">` 
        : ''}
      <div class="legend-img-ph" ${legend.image ? 'style="display:none"' : ''}>👤</div>
      <div class="legend-info">
        <div class="legend-name">${legend.name}</div>
        <div class="legend-period">⏱️ ${legend.period || '—'}</div>
        <div class="legend-achievements">
          <div class="legend-achievements-title">🏆 Thành Tích</div>
          <div class="legend-achievements-text">${legend.achievements || 'Chưa cập nhật'}</div>
        </div>
      </div>
    </div>
  `;
}

function bindLegendCards() {
  document.querySelectorAll('.legend-card').forEach(card => {
    card.addEventListener('click', async () => {
      const id = card.dataset.legendId;
      const legend = await getLegendById(id);
      if (legend) openLegendModal(legend);
    });
  });
}

function openLegendModal(legend) {
  openModal(`
    ${legend.image
      ? `<img src="${legend.image}" class="modal-player-img" alt="${legend.name}" onerror="this.src=''">`
      : `<div class="modal-player-img-ph">👤</div>`}
    <div class="modal-player-name">${legend.name}</div>
    <div class="modal-details">
      <div class="modal-detail-item full">
        <div class="modal-detail-label">Giai Đoạn Thi Đấu</div>
        <div class="modal-detail-value">⏱️ ${legend.period || '—'}</div>
      </div>
      <div class="modal-detail-item full">
        <div class="modal-detail-label">Thành Tích</div>
        <div class="modal-detail-value">${legend.achievements || '—'}</div>
      </div>
    </div>
  `);
}
