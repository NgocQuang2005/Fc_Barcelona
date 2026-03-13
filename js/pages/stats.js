/* ============================================================
   STATS PAGE
   ============================================================ */

async function renderStats() {
  const app = document.getElementById('app');
  const [players, recent, coaches, teams, standings] = await Promise.all([
    getPlayers(), getRecent(), getCoaches(), getTeams(), getStandings()
  ]);

  const posCount = {};
  players.forEach(p => { const g = posGroup(p.position); posCount[g] = (posCount[g]||0)+1; });

  app.innerHTML = `
    <div class="page">
      <section class="page-header">
        <div class="page-header-content">
          <div class="page-header-icon">📊</div>
          <div>
            <h1 class="page-header-title">Thống Kê</h1>
            <p class="page-header-desc">Số liệu và phân tích về câu lạc bộ</p>
          </div>
        </div>
      </section>

      <section class="section">
        <!-- Stat cards -->
        <div class="stats-grid">
          <div class="stat-card"><div class="stat-number">${players.length}</div><div class="stat-label">Cầu Thủ</div></div>
          <div class="stat-card"><div class="stat-number">${recent.length}</div><div class="stat-label">Trận Đã Đá</div></div>
          <div class="stat-card"><div class="stat-number">${coaches.length}</div><div class="stat-label">Ban Huấn Luyện</div></div>
          <div class="stat-card"><div class="stat-number">${teams.length}</div><div class="stat-label">Đội Bóng</div></div>
        </div>

        <!-- Charts -->
        <div class="charts-wrap">
          <div class="chart-card">
            <div class="chart-title">Phân Bố Vị Trí Cầu Thủ</div>
            <canvas id="chart-positions" height="220"></canvas>
          </div>
          <div class="chart-card">
            <div class="chart-title">Kết Quả Trận Đấu Theo Giải</div>
            <canvas id="chart-tournaments" height="220"></canvas>
          </div>
        </div>

        <!-- Standings -->
        <div class="section-header" style="margin-top:2rem">
          <h2 class="section-title">Bảng Xếp Hạng</h2>
        </div>
        ${standings.length ? `
        <div style="overflow-x:auto">
          <table class="standings-table">
            <thead>
              <tr>
                <th>#</th><th>Đội</th><th>Trận</th><th>T</th><th>H</th><th>B</th><th>BT</th><th>BB</th><th>Điểm</th>
              </tr>
            </thead>
            <tbody>
              ${standings.sort((a,b)=>b.pts-a.pts).map((s,i) => `
                <tr class="rank-${i+1}">
                  <td>${i+1}</td>
                  <td><strong>${s.team}</strong></td>
                  <td>${s.played}</td>
                  <td>${s.won}</td>
                  <td>${s.drawn}</td>
                  <td>${s.lost}</td>
                  <td>${s.gf}</td>
                  <td>${s.ga}</td>
                  <td><strong>${s.pts}</strong></td>
                </tr>
              `).join('')}
            </tbody>
          </table>
        </div>
        ` : `<div class="empty-state"><div class="empty-state-icon">🏆</div><div class="empty-state-text">Chưa có bảng xếp hạng</div></div>`}
      </section>
    </div>
  `;

  // Draw charts
  drawPosChart(posCount);
  drawTournamentChart(recent);
}

function drawPosChart(posCount) {
  const canvas = document.getElementById('chart-positions');
  if (!canvas) return;
  const ctx = canvas.getContext('2d');
  const labels = { gk:'Thủ Môn', def:'Hậu Vệ', mid:'Tiền Vệ', att:'Tiền Đạo', other:'Khác' };
  const colors = ['#e8c84a','#ff4757','#2ed573','#1e90ff','#a29bfe'];
  const data = Object.entries(posCount);
  if (!data.length) { ctx.fillStyle = 'rgba(255,255,255,0.2)'; ctx.fillRect(0,0,canvas.width,canvas.height); return; }

  const total = data.reduce((s,[,v])=>s+v,0);
  const cx = canvas.width/2, cy = canvas.height/2;
  const r = Math.min(cx, cy) - 30;
  let start = -Math.PI/2;

  canvas.width = canvas.offsetWidth || 400;
  canvas.height = 220;

  data.forEach(([key, val], i) => {
    const angle = (val/total) * Math.PI * 2;
    ctx.beginPath();
    ctx.moveTo(cx, cy);
    ctx.arc(cx, cy, r, start, start + angle);
    ctx.closePath();
    ctx.fillStyle = colors[i % colors.length];
    ctx.fill();
    // label
    const midA = start + angle/2;
    const lx = cx + (r*0.65)*Math.cos(midA);
    const ly = cy + (r*0.65)*Math.sin(midA);
    ctx.fillStyle = '#000';
    ctx.font = 'bold 12px Barlow, sans-serif';
    ctx.textAlign = 'center';
    ctx.textBaseline = 'middle';
    ctx.fillText(val, lx, ly);
    start += angle;
  });

  // Legend
  let legendY = 16;
  data.forEach(([key, val], i) => {
    ctx.fillStyle = colors[i % colors.length];
    ctx.fillRect(canvas.width - 120, legendY, 12, 12);
    ctx.fillStyle = getComputedStyle(document.documentElement).getPropertyValue('--text') || '#fff';
    ctx.font = '11px Barlow, sans-serif';
    ctx.textAlign = 'left';
    ctx.fillText((labels[key]||key) + ' ('+val+')', canvas.width - 102, legendY + 9);
    legendY += 20;
  });
}

function drawTournamentChart(recent) {
  const canvas = document.getElementById('chart-tournaments');
  if (!canvas) return;
  const ctx = canvas.getContext('2d');
  const counts = {};
  recent.forEach(m => { counts[m.tournament] = (counts[m.tournament]||0)+1; });
  const data = Object.entries(counts);
  if (!data.length) return;

  canvas.width = canvas.offsetWidth || 400;
  canvas.height = 220;
  const isDark = document.documentElement.getAttribute('data-theme') !== 'light';
  const textColor = isDark ? 'rgba(255,255,255,0.6)' : 'rgba(0,0,0,0.5)';
  const colors = ['#e8c84a','#ff4757','#2ed573','#1e90ff','#a29bfe'];
  const maxVal = Math.max(...data.map(([,v])=>v));
  const barW = (canvas.width - 60) / data.length - 16;
  const chartH = canvas.height - 60;

  data.forEach(([label, val], i) => {
    const bh = (val/maxVal) * chartH;
    const bx = 30 + i*(barW+16);
    const by = chartH - bh + 10;
    ctx.fillStyle = colors[i % colors.length];
    const rad = 4;
    ctx.beginPath();
    ctx.moveTo(bx+rad, by); ctx.lineTo(bx+barW-rad, by);
    ctx.arcTo(bx+barW, by, bx+barW, by+rad, rad);
    ctx.lineTo(bx+barW, by+bh); ctx.lineTo(bx, by+bh);
    ctx.lineTo(bx, by+rad);
    ctx.arcTo(bx, by, bx+rad, by, rad);
    ctx.closePath();
    ctx.fill();
    // count
    ctx.fillStyle = colors[i%colors.length];
    ctx.font = 'bold 13px Bebas Neue, sans-serif';
    ctx.textAlign = 'center';
    ctx.fillText(val, bx+barW/2, by-6);
    // label
    ctx.fillStyle = textColor;
    ctx.font = '10px Barlow, sans-serif';
    ctx.textAlign = 'center';
    const words = label.split(' ');
    words.forEach((w, wi) => ctx.fillText(w, bx+barW/2, chartH+18+wi*12));
  });
}
