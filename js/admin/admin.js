/* ============================================================
   ADMIN MAIN MODULE
   Includes: Overview, Club, Teams, Players, Coaches, Upcoming, Recent, Standings, Legends, News
   ============================================================ */

function renderAdmin() {
  const app = document.getElementById('app');

  const navItems = [
    { key:'overview', icon:'📊', label:'Tổng Quan' },
    { key:'club',     icon:'🏟️', label:'Thông Tin CLB' },
    { key:'teams',    icon:'🛡️', label:'Đội Bóng' },
    { key:'players',  icon:'👤', label:'Cầu Thủ' },
    { key:'coaches',  icon:'👔', label:'HLV' },
    { key:'legends',  icon:'🏆', label:'Huyền Thoại' },
    { key:'news',     icon:'📰', label:'Tin Tức' },
    { key:'upcoming', icon:'📅', label:'Lịch Thi Đấu' },
    { key:'recent',   icon:'⚽', label:'Kết Quả' },
    { key:'standings',icon:'📈', label:'BXH' },
  ];

  app.innerHTML = `
    <div class="page admin-wrap">
      <aside class="admin-sidebar">
        <div class="admin-sidebar-title">Quản Lý</div>
        ${navItems.map((n,i) => `
          <div class="admin-nav-item ${i===0?'active':''}" data-section="${n.key}">
            <span class="admin-icon">${n.icon}</span>${n.label}
          </div>
        `).join('')}
      </aside>
      <div class="admin-main">
        ${renderAdminOverview()}
        ${renderAdminClub()}
        ${renderAdminTeams()}
        ${renderAdminPlayers()}
        ${renderAdminCoaches()}
        ${renderAdminLegends()}
        ${renderAdminNews()}
        ${renderAdminUpcoming()}
        ${renderAdminRecent()}
        ${renderAdminStandings()}
      </div>
    </div>
  `;

  // Sidebar navigation
  document.querySelectorAll('.admin-nav-item').forEach(item => {
    item.addEventListener('click', () => {
      document.querySelectorAll('.admin-nav-item').forEach(i => i.classList.remove('active'));
      document.querySelectorAll('.admin-section').forEach(s => s.classList.remove('active'));
      item.classList.add('active');
      const sec = document.getElementById('admin-' + item.dataset.section);
      if (sec) sec.classList.add('active');
    });
  });

  bindAdminForms();
}

function renderAdminOverview() {
  const p = getPlayers().length, r = getRecent().length, u = getUpcoming().length, 
        t = getTeams().length, c = getCoaches().length, l = getLegends().length, n = getNews().length;
  return `
    <div class="admin-section active" id="admin-overview">
      <div class="admin-section-title">Tổng Quan</div>
      <div class="admin-section-desc">Thống kê nhanh toàn bộ dữ liệu CLB</div>
      <div class="admin-overview">
        <div class="overview-card"><div class="overview-num">${t}</div><div class="overview-label">Đội Bóng</div></div>
        <div class="overview-card"><div class="overview-num">${p}</div><div class="overview-label">Cầu Thủ</div></div>
        <div class="overview-card"><div class="overview-num">${c}</div><div class="overview-label">HLV</div></div>
        <div class="overview-card"><div class="overview-num">${l}</div><div class="overview-label">Huyền Thoại</div></div>
        <div class="overview-card"><div class="overview-num">${n}</div><div class="overview-label">Tin Tức</div></div>
        <div class="overview-card"><div class="overview-num">${u}</div><div class="overview-label">Lịch Sắp Tới</div></div>
        <div class="overview-card"><div class="overview-num">${r}</div><div class="overview-label">Kết Quả</div></div>
      </div>
    </div>
  `;
}

function renderAdminClub() {
  const club = getClub();
  return `
    <div class="admin-section" id="admin-club">
      <div class="admin-section-title">Thông Tin CLB</div>
      <div class="admin-section-desc">Cập nhật tên và mô tả câu lạc bộ</div>
      <div class="admin-form">
        <div class="form-grid">
          <div class="form-group full">
            <label class="form-label">Tên CLB</label>
            <input type="text" class="form-input" id="club-name" value="${club.clubName||''}" placeholder="Tên câu lạc bộ">
          </div>
          <div class="form-group full">
            <label class="form-label">Mô Tả</label>
            <textarea class="form-textarea" id="club-desc" placeholder="Mô tả câu lạc bộ...">${club.description||''}</textarea>
          </div>
        </div>
        <button class="btn btn-primary" id="btn-save-club">💾 Lưu Thông Tin</button>
      </div>
    </div>
  `;
}

function renderAdminTeams() {
  const teams = getTeams();
  return `
    <div class="admin-section" id="admin-teams">
      <div class="admin-section-title">Đội Bóng</div>
      <div class="admin-section-desc">Thêm và quản lý các đội bóng</div>
      <div class="admin-form">
        <div class="form-grid">
          <div class="form-group"><label class="form-label">Tên Đội</label><input type="text" class="form-input" id="team-name" placeholder="FC Barcelona"></div>
          <div class="form-group"><label class="form-label">Logo URL</label><input type="url" class="form-input" id="team-logo" placeholder="https://..."></div>
          <div class="form-group"><label class="form-label">Quốc Gia</label><input type="text" class="form-input" id="team-country" placeholder="Tây Ban Nha"></div>
        </div>
        <button class="btn btn-primary" id="btn-add-team">➕ Thêm Đội</button>
      </div>
      <div class="admin-list">
        <div class="admin-list-title">Danh sách đội bóng (${teams.length})</div>
        ${teams.map(t => `
          <div class="admin-item">
            ${t.logo ? `<img src="${t.logo}" class="admin-item-img" alt="${t.name}" onerror="this.style.display='none'">` : `<div class="admin-item-ph">🛡️</div>`}
            <div class="admin-item-info">
              <div class="admin-item-name">${t.name}</div>
              <div class="admin-item-sub">${t.country||''}</div>
            </div>
            <button class="admin-item-edit" data-edit-team="${t.id}">✏️</button>
            <button class="admin-item-del" data-del-team="${t.id}">🗑️</button>
          </div>
        `).join('')}
        ${!teams.length ? '<div style="color:var(--text-muted);font-size:0.85rem">Chưa có đội bóng nào</div>' : ''}
      </div>
    </div>
  `;
}

function renderAdminPlayers() {
  const players = getPlayers();
  const teams = getTeams();
  const positions = ['GK','CB','LB','RB','CM','DM','AM','LW','RW','ST','SS'];
  return `
    <div class="admin-section" id="admin-players">
      <div class="admin-section-title">Cầu Thủ</div>
      <div class="admin-section-desc">Thêm và quản lý cầu thủ</div>
      <div class="admin-form">
        <div class="form-grid">
          <div class="form-group"><label class="form-label">Tên Cầu Thủ</label><input type="text" class="form-input" id="pl-name" placeholder="Robert Lewandowski"></div>
          <div class="form-group"><label class="form-label">Số Áo</label><input type="number" class="form-input" id="pl-number" placeholder="9" min="1" max="99"></div>
          <div class="form-group"><label class="form-label">Ngày Sinh</label><input type="date" class="form-input" id="pl-birthday"></div>
          <div class="form-group"><label class="form-label">Quốc Tịch</label><input type="text" class="form-input" id="pl-nat" placeholder="Ba Lan"></div>
          <div class="form-group">
            <label class="form-label">Vị Trí</label>
            <select class="form-select" id="pl-pos">
              ${positions.map(p => `<option value="${p}">${positionLabel(p)} (${p})</option>`).join('')}
            </select>
          </div>
          <div class="form-group">
            <label class="form-label">Đội</label>
            <select class="form-select" id="pl-team">
              <option value="">-- Chọn đội --</option>
              ${teams.map(t => `<option value="${t.id}">${t.name}</option>`).join('')}
            </select>
          </div>
          <div class="form-group full"><label class="form-label">Ảnh URL</label><input type="url" class="form-input" id="pl-img" placeholder="https://..."></div>
        </div>
        <button class="btn btn-primary" id="btn-add-player">➕ Thêm Cầu Thủ</button>
      </div>
      <div class="admin-list">
        <div class="admin-list-title">Danh sách cầu thủ (${players.length})</div>
        ${players.map(p => `
          <div class="admin-item">
            ${p.image ? `<img src="${p.image}" class="admin-item-img" onerror="this.style.display='none'">` : `<div class="admin-item-ph">🧑</div>`}
            <div class="admin-item-info">
              <div class="admin-item-name">#${p.number||'—'} ${p.name}</div>
              <div class="admin-item-sub">${positionLabel(p.position)} · ${p.nationality||''}</div>
            </div>
            <button class="admin-item-edit" data-edit-player="${p.id}">✏️</button>
            <button class="admin-item-del" data-del-player="${p.id}">🗑️</button>
          </div>
        `).join('')}
        ${!players.length ? '<div style="color:var(--text-muted);font-size:0.85rem">Chưa có cầu thủ</div>' : ''}
      </div>
    </div>
  `;
}

function renderAdminCoaches() {
  const coaches = getCoaches();
  return `
    <div class="admin-section" id="admin-coaches">
      <div class="admin-section-title">Ban Huấn Luyện</div>
      <div class="admin-section-desc">Thêm và quản lý huấn luyện viên</div>
      <div class="admin-form">
        <div class="form-grid">
          <div class="form-group"><label class="form-label">Tên HLV</label><input type="text" class="form-input" id="co-name" placeholder="Hansi Flick"></div>
          <div class="form-group"><label class="form-label">Ngày Sinh</label><input type="date" class="form-input" id="co-birthday"></div>
          <div class="form-group"><label class="form-label">Quốc Tịch</label><input type="text" class="form-input" id="co-nat" placeholder="Đức"></div>
          <div class="form-group"><label class="form-label">Ảnh URL</label><input type="url" class="form-input" id="co-img" placeholder="https://..."></div>
        </div>
        <button class="btn btn-primary" id="btn-add-coach">➕ Thêm HLV</button>
      </div>
      <div class="admin-list">
        <div class="admin-list-title">Danh sách HLV (${coaches.length})</div>
        ${coaches.map(c => `
          <div class="admin-item">
            ${c.image ? `<img src="${c.image}" class="admin-item-img" onerror="this.style.display='none'">` : `<div class="admin-item-ph">👔</div>`}
            <div class="admin-item-info">
              <div class="admin-item-name">${c.name}</div>
              <div class="admin-item-sub">${c.nationality||''}</div>
            </div>
            <button class="admin-item-edit" data-edit-coach="${c.id}">✏️</button>
            <button class="admin-item-del" data-del-coach="${c.id}">🗑️</button>
          </div>
        `).join('')}
        ${!coaches.length ? '<div style="color:var(--text-muted);font-size:0.85rem">Chưa có HLV</div>' : ''}
      </div>
    </div>
  `;
}

function renderAdminLegends() {
  const legends = getLegends();
  return `
    <div class="admin-section" id="admin-legends">
      <div class="admin-section-title">Huyền Thoại CLB</div>
      <div class="admin-section-desc">Thêm và quản lý huyền thoại câu lạc bộ</div>
      <div class="admin-form">
        <div class="form-grid">
          <div class="form-group"><label class="form-label">Tên</label><input type="text" class="form-input" id="legend-name" placeholder="Lionel Messi"></div>
          <div class="form-group"><label class="form-label">Giai Đoạn</label><input type="text" class="form-input" id="legend-period" placeholder="2004-2021"></div>
          <div class="form-group full"><label class="form-label">Thành Tích</label><textarea class="form-textarea" id="legend-achievements" placeholder="6 Quả bóng vàng, 4 Champions League..."></textarea></div>
          <div class="form-group full"><label class="form-label">Ảnh URL</label><input type="url" class="form-input" id="legend-img" placeholder="https://..."></div>
        </div>
        <button class="btn btn-primary" id="btn-add-legend">➕ Thêm Huyền Thoại</button>
      </div>
      <div class="admin-list">
        <div class="admin-list-title">Danh sách huyền thoại (${legends.length})</div>
        ${legends.map(l => `
          <div class="admin-item">
            ${l.image ? `<img src="${l.image}" class="admin-item-img" onerror="this.style.display='none'">` : `<div class="admin-item-ph">👤</div>`}
            <div class="admin-item-info">
              <div class="admin-item-name">${l.name}</div>
              <div class="admin-item-sub">${l.period||''}</div>
            </div>
            <button class="admin-item-edit" data-edit-legend="${l.id}">✏️</button>
            <button class="admin-item-del" data-del-legend="${l.id}">🗑️</button>
          </div>
        `).join('')}
        ${!legends.length ? '<div style="color:var(--text-muted);font-size:0.85rem">Chưa có huyền thoại</div>' : ''}
      </div>
    </div>
  `;
}

function renderAdminNews() {
  const news = getNews().sort((a,b) => new Date(b.date) - new Date(a.date));
  return `
    <div class="admin-section" id="admin-news">
      <div class="admin-section-title">Tin Tức CLB</div>
      <div class="admin-section-desc">Thêm và quản lý tin tức câu lạc bộ</div>
      <div class="admin-form">
        <div class="form-grid">
          <div class="form-group full"><label class="form-label">Tiêu Đề</label><input type="text" class="form-input" id="news-title" placeholder="Tiêu đề bài viết..."></div>
          <div class="form-group"><label class="form-label">Ngày Đăng</label><input type="date" class="form-input" id="news-date"></div>
          <div class="form-group"><label class="form-label">Tác Giả</label><input type="text" class="form-input" id="news-author" placeholder="Admin"></div>
          <div class="form-group full"><label class="form-label">Ảnh URL</label><input type="url" class="form-input" id="news-img" placeholder="https://..."></div>
          <div class="form-group full"><label class="form-label">Nội Dung</label><textarea class="form-textarea" id="news-content" placeholder="Nội dung bài viết..." style="min-height:120px"></textarea></div>
        </div>
        <button class="btn btn-primary" id="btn-add-news">➕ Thêm Tin Tức</button>
      </div>
      <div class="admin-list">
        <div class="admin-list-title">Danh sách tin tức (${news.length})</div>
        ${news.map(n => `
          <div class="admin-item">
            ${n.image ? `<img src="${n.image}" class="admin-item-img" onerror="this.style.display='none'">` : `<div class="admin-item-ph">📰</div>`}
            <div class="admin-item-info">
              <div class="admin-item-name">${n.title}</div>
              <div class="admin-item-sub">${formatDate(n.date)} · ${n.author||'Admin'}</div>
            </div>
            <button class="admin-item-edit" data-edit-news="${n.id}">✏️</button>
            <button class="admin-item-del" data-del-news="${n.id}">🗑️</button>
          </div>
        `).join('')}
        ${!news.length ? '<div style="color:var(--text-muted);font-size:0.85rem">Chưa có tin tức</div>' : ''}
      </div>
    </div>
  `;
}

function renderAdminUpcoming() {
  const upcoming = getUpcoming();
  const teams = getTeams();
  const teamOpts = teams.map(t => `<option value="${t.id}">${t.name}</option>`).join('');
  return `
    <div class="admin-section" id="admin-upcoming">
      <div class="admin-section-title">Lịch Thi Đấu</div>
      <div class="admin-section-desc">Thêm lịch thi đấu sắp diễn ra</div>
      <div class="admin-form">
        <div class="form-grid">
          <div class="form-group"><label class="form-label">Thời Gian</label><input type="datetime-local" class="form-input" id="up-time"></div>
          <div class="form-group"><label class="form-label">Sân Vận Động</label><input type="text" class="form-input" id="up-stadium" placeholder="Camp Nou"></div>
          <div class="form-group">
            <label class="form-label">Đội Nhà</label>
            <select class="form-select" id="up-home"><option value="">-- Chọn --</option>${teamOpts}</select>
          </div>
          <div class="form-group">
            <label class="form-label">Đội Khách</label>
            <select class="form-select" id="up-away"><option value="">-- Chọn --</option>${teamOpts}</select>
          </div>
          <div class="form-group"><label class="form-label">Giải Đấu</label><input type="text" class="form-input" id="up-tour" placeholder="La Liga"></div>
        </div>
        <button class="btn btn-primary" id="btn-add-upcoming">➕ Thêm Lịch</button>
      </div>
      <div class="admin-list">
        <div class="admin-list-title">Lịch thi đấu (${upcoming.length})</div>
        ${upcoming.map(m => {
          const home = getTeamById(m.homeTeamId), away = getTeamById(m.awayTeamId);
          return `
            <div class="admin-item">
              <div class="admin-item-ph">📅</div>
              <div class="admin-item-info">
                <div class="admin-item-name">${home?home.name:'TBD'} vs ${away?away.name:'TBD'}</div>
                <div class="admin-item-sub">${m.tournament||''} · ${formatDateTime(m.time)}</div>
              </div>
              <button class="admin-item-edit" data-edit-upcoming="${m.id}">✏️</button>
              <button class="admin-item-del" data-del-upcoming="${m.id}">🗑️</button>
            </div>
          `;
        }).join('')}
        ${!upcoming.length ? '<div style="color:var(--text-muted);font-size:0.85rem">Chưa có lịch</div>' : ''}
      </div>
    </div>
  `;
}

function renderAdminRecent() {
  const recent = getRecent();
  const teams = getTeams();
  const teamOpts = teams.map(t => `<option value="${t.id}">${t.name}</option>`).join('');
  return `
    <div class="admin-section" id="admin-recent">
      <div class="admin-section-title">Kết Quả Trận Đấu</div>
      <div class="admin-section-desc">Thêm kết quả các trận đã diễn ra</div>
      <div class="admin-form">
        <div class="form-grid">
          <div class="form-group"><label class="form-label">Thời Gian</label><input type="datetime-local" class="form-input" id="re-time"></div>
          <div class="form-group"><label class="form-label">Sân Vận Động</label><input type="text" class="form-input" id="re-stadium" placeholder="Camp Nou"></div>
          <div class="form-group">
            <label class="form-label">Đội Nhà</label>
            <select class="form-select" id="re-home"><option value="">-- Chọn --</option>${teamOpts}</select>
          </div>
          <div class="form-group">
            <label class="form-label">Đội Khách</label>
            <select class="form-select" id="re-away"><option value="">-- Chọn --</option>${teamOpts}</select>
          </div>
          <div class="form-group"><label class="form-label">Tỷ Số</label><input type="text" class="form-input" id="re-score" placeholder="3 - 1"></div>
          <div class="form-group"><label class="form-label">Giải Đấu</label><input type="text" class="form-input" id="re-tour" placeholder="La Liga"></div>
          <div class="form-group full"><label class="form-label">Ảnh Trận Đấu URL</label><input type="url" class="form-input" id="re-img" placeholder="https://..."></div>
        </div>
        <button class="btn btn-primary" id="btn-add-recent">➕ Thêm Kết Quả</button>
      </div>
      <div class="admin-list">
        <div class="admin-list-title">Kết quả (${recent.length})</div>
        ${recent.map(m => {
          const home = getTeamById(m.homeTeamId), away = getTeamById(m.awayTeamId);
          return `
            <div class="admin-item">
              <div class="admin-item-ph">⚽</div>
              <div class="admin-item-info">
                <div class="admin-item-name">${home?home.name:'TBD'} ${m.score||'?'} ${away?away.name:'TBD'}</div>
                <div class="admin-item-sub">${m.tournament||''} · ${formatDateTime(m.time)}</div>
              </div>
              <button class="admin-item-edit" data-edit-recent="${m.id}">✏️</button>
              <button class="admin-item-del" data-del-recent="${m.id}">🗑️</button>
            </div>
          `;
        }).join('')}
        ${!recent.length ? '<div style="color:var(--text-muted);font-size:0.85rem">Chưa có kết quả</div>' : ''}
      </div>
    </div>
  `;
}

function renderAdminStandings() {
  const standings = getStandings();
  return `
    <div class="admin-section" id="admin-standings">
      <div class="admin-section-title">Bảng Xếp Hạng</div>
      <div class="admin-section-desc">Quản lý bảng xếp hạng giải đấu</div>
      <div class="admin-form">
        <div class="form-grid">
          <div class="form-group"><label class="form-label">Tên Đội</label><input type="text" class="form-input" id="st-team" placeholder="FC Barcelona"></div>
          <div class="form-group"><label class="form-label">Số Trận</label><input type="number" class="form-input" id="st-played" placeholder="28" min="0"></div>
          <div class="form-group"><label class="form-label">Thắng</label><input type="number" class="form-input" id="st-won" placeholder="20" min="0"></div>
          <div class="form-group"><label class="form-label">Hòa</label><input type="number" class="form-input" id="st-drawn" placeholder="5" min="0"></div>
          <div class="form-group"><label class="form-label">Thua</label><input type="number" class="form-input" id="st-lost" placeholder="3" min="0"></div>
          <div class="form-group"><label class="form-label">Bàn Thắng</label><input type="number" class="form-input" id="st-gf" placeholder="68" min="0"></div>
          <div class="form-group"><label class="form-label">Bàn Thua</label><input type="number" class="form-input" id="st-ga" placeholder="28" min="0"></div>
          <div class="form-group"><label class="form-label">Điểm</label><input type="number" class="form-input" id="st-pts" placeholder="65" min="0"></div>
        </div>
        <button class="btn btn-primary" id="btn-add-standing">➕ Thêm Vào BXH</button>
      </div>
      <div class="admin-list">
        <div class="admin-list-title">Bảng xếp hạng (${standings.length} đội)</div>
        ${standings.sort((a,b)=>b.pts-a.pts).map((s,i) => `
          <div class="admin-item">
            <div class="admin-item-ph" style="font-family:'Bebas Neue',sans-serif;font-size:1.2rem;color:var(--accent)">${i+1}</div>
            <div class="admin-item-info">
              <div class="admin-item-name">${s.team}</div>
              <div class="admin-item-sub">${s.played} trận · ${s.pts} điểm</div>
            </div>
            <button class="admin-item-edit" data-edit-standing="${s.id}">✏️</button>
            <button class="admin-item-del" data-del-standing="${s.id}">🗑️</button>
          </div>
        `).join('')}
        ${!standings.length ? '<div style="color:var(--text-muted);font-size:0.85rem">Chưa có dữ liệu</div>' : ''}
      </div>
    </div>
  `;
}

// Bind all admin form handlers
function bindAdminForms() {
  const $ = id => document.getElementById(id);
  const val = id => { const el = $(id); return el ? el.value.trim() : ''; };

  // Edit mode state
  let editMode = { team: null, player: null, coach: null, legend: null, news: null, upcoming: null, recent: null, standing: null };

  // Save club
  const saveClubBtn = $('btn-save-club');
  if (saveClubBtn) saveClubBtn.addEventListener('click', () => {
    saveClubInfo({ clubName: val('club-name'), description: val('club-desc') });
    updateNav(currentPage);
    updateFooter();
    showToast('Đã lưu thông tin CLB!');
  });

  // Team handlers
  const addTeamBtn = $('btn-add-team');
  if (addTeamBtn) addTeamBtn.addEventListener('click', () => {
    const name = val('team-name');
    if (!name) { showToast('Vui lòng nhập tên đội', 'error'); return; }
    const data = { name, logo: val('team-logo'), country: val('team-country') };
    if (editMode.team) {
      updateTeam(editMode.team, data);
      showToast('Đã cập nhật đội bóng');
      editMode.team = null;
      $('btn-add-team').innerHTML = '➕ Thêm Đội';
      $('btn-add-team').classList.remove('editing');
    } else {
      addTeam(data);
      showToast('Đã thêm đội bóng');
    }
    renderAdmin();
    document.querySelector('[data-section="teams"]').click();
  });

  // Player handlers
  const addPlayerBtn = $('btn-add-player');
  if (addPlayerBtn) addPlayerBtn.addEventListener('click', () => {
    const name = val('pl-name');
    if (!name) { showToast('Vui lòng nhập tên cầu thủ', 'error'); return; }
    const data = { name, number: val('pl-number'), birthday: val('pl-birthday'), nationality: val('pl-nat'), position: val('pl-pos'), teamId: val('pl-team'), image: val('pl-img') };
    if (editMode.player) {
      updatePlayer(editMode.player, data);
      showToast('Đã cập nhật cầu thủ');
      editMode.player = null;
      $('btn-add-player').innerHTML = '➕ Thêm Cầu Thủ';
      $('btn-add-player').classList.remove('editing');
    } else {
      addPlayer(data);
      showToast('Đã thêm cầu thủ');
    }
    renderAdmin();
    document.querySelector('[data-section="players"]').click();
  });

  // Coach handlers  
  const addCoachBtn = $('btn-add-coach');
  if (addCoachBtn) addCoachBtn.addEventListener('click', () => {
    const name= val('co-name');
    if (!name) { showToast('Vui lòng nhập tên HLV', 'error'); return; }
    const data = { name, birthday: val('co-birthday'), nationality: val('co-nat'), image: val('co-img') };
    if (editMode.coach) {
      updateCoach(editMode.coach, data);
      showToast('Đã cập nhật HLV');
      editMode.coach = null;
      $('btn-add-coach').innerHTML = '➕ Thêm HLV';
      $('btn-add-coach').classList.remove('editing');
    } else {
      addCoach(data);
      showToast('Đã thêm HLV');
    }
    renderAdmin();
    document.querySelector('[data-section="coaches"]').click();
  });

  // Legend handlers
  const addLegendBtn = $('btn-add-legend');
  if (addLegendBtn) addLegendBtn.addEventListener('click', () => {
    const name = val('legend-name');
    if (!name) { showToast('Vui lòng nhập tên huyền thoại', 'error'); return; }
    const data = { name, period: val('legend-period'), achievements: val('legend-achievements'), image: val('legend-img') };
    if (editMode.legend) {
      updateLegend(editMode.legend, data);
      showToast('Đã cập nhật huyền thoại');
      editMode.legend = null;
      $('btn-add-legend').innerHTML = '➕ Thêm Huyền Thoại';
      $('btn-add-legend').classList.remove('editing');
    } else {
      addLegend(data);
      showToast('Đã thêm huyền thoại');
    }
    renderAdmin();
    document.querySelector('[data-section="legends"]').click();
  });

  // News handlers
  const addNewsBtn = $('btn-add-news');
  if (addNewsBtn) addNewsBtn.addEventListener('click', () => {
    const title = val('news-title');
    if (!title) { showToast('Vui lòng nhập tiêu đề', 'error'); return; }
    const data = { title, date: val('news-date'), author: val('news-author'), content: val('news-content'), image: val('news-img') };
    if (editMode.news) {
      updateNews(editMode.news, data);
      showToast('Đã cập nhật tin tức');
      editMode.news = null;
      $('btn-add-news').innerHTML = '➕ Thêm Tin Tức';
      $('btn-add-news').classList.remove('editing');
    } else {
      addNews(data);
      showToast('Đã thêm tin tức');
    }
    renderAdmin();
    document.querySelector('[data-section="news"]').click();
  });

  // Upcoming handlers
  const addUpBtn = $('btn-add-upcoming');
  if (addUpBtn) addUpBtn.addEventListener('click', () => {
    const time = val('up-time'), home = val('up-home'), away = val('up-away');
    if (!time || !home || !away) { showToast('Vui lòng điền đầy đủ thông tin', 'error'); return; }
    const data = { time, stadium: val('up-stadium'), homeTeamId: home, awayTeamId: away, tournament: val('up-tour') };
    if (editMode.upcoming) {
      updateUpcoming(editMode.upcoming, data);
      showToast('Đã cập nhật lịch');
      editMode.upcoming = null;
      $('btn-add-upcoming').innerHTML = '➕ Thêm Lịch';
      $('btn-add-upcoming').classList.remove('editing');
    } else {
      addUpcomingMatch(data);
      showToast('Đã thêm lịch');
    }
    renderAdmin();
    document.querySelector('[data-section="upcoming"]').click();
  });

  // Recent handlers
  const addReBtn = $('btn-add-recent');
  if (addReBtn) addReBtn.addEventListener('click', () => {
    const time = val('re-time'), home = val('re-home'), away = val('re-away'), score = val('re-score');
    if (!time || !home || !away || !score) { showToast('Vui lòng điền đầy đủ thông tin', 'error'); return; }
    const data = { time, stadium: val('re-stadium'), homeTeamId: home, awayTeamId: away, score, tournament: val('re-tour'), image: val('re-img') };
    if (editMode.recent) {
      updateRecent(editMode.recent, data);
      showToast('Đã cập nhật kết quả');
      editMode.recent = null;
      $('btn-add-recent').innerHTML = '➕ Thêm Kết Quả';
      $('btn-add-recent').classList.remove('editing');
    } else {
      addRecentMatch(data);
      showToast('Đã thêm kết quả');
    }
    renderAdmin();
    document.querySelector('[data-section="recent"]').click();
  });

  // Standing handlers
  const addStBtn = $('btn-add-standing');
  if (addStBtn) addStBtn.addEventListener('click', () => {
    const team = val('st-team');
    if (!team) { showToast('Vui lòng nhập tên đội', 'error'); return; }
    const data = { team, played: +val('st-played')||0, won: +val('st-won')||0, drawn: +val('st-drawn')||0, lost: +val('st-lost')||0, gf: +val('st-gf')||0, ga: +val('st-ga')||0, pts: +val('st-pts')||0 };
    if (editMode.standing) {
      updateStanding(editMode.standing, data);
      showToast('Đã cập nhật BXH');
      editMode.standing = null;
      $('btn-add-standing').innerHTML = '➕ Thêm Vào BXH';
      $('btn-add-standing').classList.remove('editing');
    } else {
      addStanding(data);
      showToast('Đã thêm BXH');
    }
    renderAdmin();
    document.querySelector('[data-section="standings"]').click();
  });

  // Edit handlers
  document.addEventListener('click', function(e) {
    if (e.target.dataset.editTeam) {
      const item = getTeamById(e.target.dataset.editTeam);
      if (item) {
        editMode.team = item.id;
        $('team-name').value = item.name || '';
        $('team-logo').value = item.logo || '';
        $('team-country').value = item.country || '';
        $('btn-add-team').innerHTML = '💾 Cập Nhật';
        $('btn-add-team').classList.add('editing');
        document.getElementById('admin-teams').scrollIntoView({ behavior: 'smooth', block: 'start' });
      }
    }
    if (e.target.dataset.editPlayer) {
      const item = getPlayerById(e.target.dataset.editPlayer);
      if (item) {
        editMode.player = item.id;
        $('pl-name').value = item.name || '';
        $('pl-number').value = item.number || '';
        $('pl-birthday').value = item.birthday || '';
        $('pl-nat').value = item.nationality || '';
        $('pl-pos').value = item.position || 'ST';
        $('pl-team').value = item.teamId || '';
        $('pl-img').value = item.image || '';
        $('btn-add-player').innerHTML = '💾 Cập Nhật';
        $('btn-add-player').classList.add('editing');
        document.getElementById('admin-players').scrollIntoView({ behavior: 'smooth', block: 'start' });
      }
    }
    if (e.target.dataset.editCoach) {
      const item = getCoachById(e.target.dataset.editCoach);
      if (item) {
        editMode.coach = item.id;
        $('co-name').value = item.name || '';
        $('co-birthday').value = item.birthday || '';
        $('co-nat').value = item.nationality || '';
        $('co-img').value = item.image || '';
        $('btn-add-coach').innerHTML = '💾 Cập Nhật';
        $('btn-add-coach').classList.add('editing');
        document.getElementById('admin-coaches').scrollIntoView({ behavior: 'smooth', block: 'start' });
      }
    }
    if (e.target.dataset.editLegend) {
      const item = getLegendById(e.target.dataset.editLegend);
      if (item) {
        editMode.legend = item.id;
        $('legend-name').value = item.name || '';
        $('legend-period').value = item.period || '';
        $('legend-achievements').value = item.achievements || '';
        $('legend-img').value = item.image || '';
        $('btn-add-legend').innerHTML = '💾 Cập Nhật';
        $('btn-add-legend').classList.add('editing');
        document.getElementById('admin-legends').scrollIntoView({ behavior: 'smooth', block: 'start' });
      }
    }
    if (e.target.dataset.editNews) {
      const item = getNewsById(e.target.dataset.editNews);
      if (item) {
        editMode.news = item.id;
        $('news-title').value = item.title || '';
        $('news-date').value = item.date || '';
        $('news-author').value = item.author || '';
        $('news-content').value = item.content || '';
        $('news-img').value = item.image || '';
        $('btn-add-news').innerHTML = '💾 Cập Nhật';
        $('btn-add-news').classList.add('editing');
        document.getElementById('admin-news').scrollIntoView({ behavior: 'smooth', block: 'start' });
      }
    }
    if (e.target.dataset.editUpcoming) {
      const item = getUpcomingById(e.target.dataset.editUpcoming);
      if (item) {
        editMode.upcoming = item.id;
        $('up-time').value = item.time ? item.time.slice(0,16) : '';
        $('up-stadium').value = item.stadium || '';
        $('up-home').value = item.homeTeamId || '';
        $('up-away').value = item.awayTeamId || '';
        $('up-tour').value = item.tournament || '';
        $('btn-add-upcoming').innerHTML = '💾 Cập Nhật';
        $('btn-add-upcoming').classList.add('editing');
        document.getElementById('admin-upcoming').scrollIntoView({ behavior: 'smooth', block: 'start' });
      }
    }
    if (e.target.dataset.editRecent) {
      const item = getRecentById(e.target.dataset.editRecent);
      if (item) {
        editMode.recent = item.id;
        $('re-time').value = item.time ? item.time.slice(0,16) : '';
        $('re-stadium').value = item.stadium || '';
        $('re-home').value = item.homeTeamId || '';
        $('re-away').value = item.awayTeamId || '';
        $('re-score').value = item.score || '';
        $('re-tour').value = item.tournament || '';
        $('re-img').value = item.image || '';
        $('btn-add-recent').innerHTML = '💾 Cập Nhật';
        $('btn-add-recent').classList.add('editing');
        document.getElementById('admin-recent').scrollIntoView({ behavior: 'smooth', block: 'start' });
      }
    }
    if (e.target.dataset.editStanding) {
      const item = getStandingById(e.target.dataset.editStanding);
      if (item) {
        editMode.standing = item.id;
        $('st-team').value = item.team || '';
        $('st-played').value = item.played || 0;
        $('st-won').value = item.won || 0;
        $('st-drawn').value = item.drawn || 0;
        $('st-lost').value = item.lost || 0;
        $('st-gf').value = item.gf || 0;
        $('st-ga').value = item.ga || 0;
        $('st-pts').value = item.pts || 0;
        $('btn-add-standing').innerHTML = '💾 Cập Nhật';
        $('btn-add-standing').classList.add('editing');
        document.getElementById('admin-standings').scrollIntoView({ behavior: 'smooth', block: 'start' });
      }
    }

    // Delete handlers
    if (e.target.dataset.delTeam)     { if(confirm('Xóa đội này?')) { deleteTeam(e.target.dataset.delTeam); showToast('Đã xóa'); renderAdmin(); document.querySelector('[data-section="teams"]').click(); } }
    if (e.target.dataset.delPlayer)   { if(confirm('Xóa cầu thủ này?')) { deletePlayer(e.target.dataset.delPlayer); showToast('Đã xóa'); renderAdmin(); document.querySelector('[data-section="players"]').click(); } }
    if (e.target.dataset.delCoach)    { if(confirm('Xóa HLV này?')) { deleteCoach(e.target.dataset.delCoach); showToast('Đã xóa'); renderAdmin(); document.querySelector('[data-section="coaches"]').click(); } }
    if (e.target.dataset.delLegend)   { if(confirm('Xóa huyền thoại này?')) { deleteLegend(e.target.dataset.delLegend); showToast('Đã xóa'); renderAdmin(); document.querySelector('[data-section="legends"]').click(); } }
    if (e.target.dataset.delNews)     { if(confirm('Xóa tin tức này?')) { deleteNews(e.target.dataset.delNews); showToast('Đã xóa'); renderAdmin(); document.querySelector('[data-section="news"]').click(); } }
    if (e.target.dataset.delUpcoming) { if(confirm('Xóa lịch thi đấu này?')) { deleteUpcoming(e.target.dataset.delUpcoming); showToast('Đã xóa'); renderAdmin(); document.querySelector('[data-section="upcoming"]').click(); } }
    if (e.target.dataset.delRecent)   { if(confirm('Xóa kết quả này?')) { deleteRecent(e.target.dataset.delRecent); showToast('Đã xóa'); renderAdmin(); document.querySelector('[data-section="recent"]').click(); } }
    if (e.target.dataset.delStanding) { if(confirm('Xóa khỏi BXH?')) { deleteStanding(e.target.dataset.delStanding); showToast('Đã xóa'); renderAdmin(); document.querySelector('[data-section="standings"]').click(); } }
  });
}
