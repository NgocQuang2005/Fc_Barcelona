/* ============================================================
   NEWS PAGE
   ============================================================ */

async function renderNews() {
  const app = document.getElementById('app');
  const [newsAll, club] = await Promise.all([getNews(), getClub()]);
  const news = newsAll.sort((a, b) => new Date(b.date) - new Date(a.date));

  app.innerHTML = `
    <div class="page">
      <section class="page-header">
        <div class="page-header-content">
          <div class="page-header-icon">📰</div>
          <div>
            <h1 class="page-header-title">Tin Tức ${club.clubName || 'CLB'}</h1>
            <p class="page-header-desc">Cập nhật tin tức mới nhất về câu lạc bộ</p>
          </div>
        </div>
      </section>

      <section class="section">
        ${news.length ? `
        <div class="news-grid">
          ${news.map(n => renderNewsCard(n)).join('')}
        </div>
        ` : `<div class="empty-state"><div class="empty-state-icon">📰</div><div class="empty-state-text">Chưa có tin tức</div></div>`}
      </section>
    </div>
  `;

  bindNewsCards();
}

function renderNewsCard(newsItem) {
  return `
    <article class="news-card" data-news-id="${newsItem.id}">
      ${newsItem.image 
        ? `<img src="${newsItem.image}" class="news-img" alt="${newsItem.title}" onerror="this.style.display='none';this.nextSibling.style.display='flex'">` 
        : ''}
      <div class="news-img-ph" ${newsItem.image ? 'style="display:none"' : ''}>📰</div>
      <div class="news-content">
        <div class="news-meta">
          <span class="news-date">📅 ${formatDate(newsItem.date)}</span>
          ${newsItem.author ? `<span class="news-author">✍️ ${newsItem.author}</span>` : ''}
        </div>
        <h3 class="news-title">${newsItem.title}</h3>
        <p class="news-excerpt">${(newsItem.content || '').substring(0, 150)}${newsItem.content && newsItem.content.length > 150 ? '...' : ''}</p>
        <button class="news-read-more">Đọc thêm →</button>
      </div>
    </article>
  `;
}

function bindNewsCards() {
  document.querySelectorAll('.news-card').forEach(card => {
    card.addEventListener('click', async () => {
      const id = card.dataset.newsId;
      const newsItem = await getNewsById(id);
      if (newsItem) openNewsModal(newsItem);
    });
  });
}

function openNewsModal(newsItem) {
  openModal(`
    ${newsItem.image
      ? `<img src="${newsItem.image}" class="modal-news-img" alt="${newsItem.title}" onerror="this.src=''">`
      : `<div class="modal-news-img-ph">📰</div>`}
    <div class="modal-news-meta">
      <span>📅 ${formatDate(newsItem.date)}</span>
      ${newsItem.author ? `<span>✍️ ${newsItem.author}</span>` : ''}
    </div>
    <h2 class="modal-news-title">${newsItem.title}</h2>
    <div class="modal-news-content">${(newsItem.content || '').replace(/\n/g, '<br>')}</div>
  `);
}
