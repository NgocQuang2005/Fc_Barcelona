/* ============================================================
   API CLIENT — thay thế storage.js
   Tất cả getters là async, dùng fetch() gọi đến REST API
   Dữ liệu trả về được chuyển về đúng format cũ (camelCase)
   ============================================================ */

const API_BASE = 'http://localhost:4000/api';

// ─── Core fetch helper ────────────────────────────────────────
async function apiFetch(path, options = {}) {
  const init = { method: options.method || 'GET', headers: { 'Content-Type': 'application/json' } };
  if (options.body !== undefined) init.body = JSON.stringify(options.body);
  const res = await fetch(API_BASE + path, init);
  if (res.status === 204) return null;
  const json = await res.json();
  if (!res.ok) throw new Error(json.error || `HTTP ${res.status}`);
  return json;
}

// ─── Teams cache (sync lookup sau khi load 1 lần) ─────────────
let _teamsCache = null;

async function getTeams() {
  _teamsCache = await apiFetch('/teams');
  return _teamsCache;
}

function getTeamById(id) {
  if (!_teamsCache) return null;
  return _teamsCache.find(t => t.id === id) || null;
}

// ─── Transform helpers ────────────────────────────────────────
function mapClub(c) {
  return { clubName: c.club_name, description: c.description };
}

function mapPlayer(p) {
  return { ...p, teamId: p.team_id };
}

function mapMatch(m) {
  const obj = {
    id:           m.id,
    time:         m.match_time,
    stadium:      m.stadium,
    homeTeamId:   m.home_team_id,
    awayTeamId:   m.away_team_id,
    tournament:   m.tournament,
    status:       m.status,
    image:        m.image || '',
    // embedded team info from JOIN
    homeTeamName: m.home_team_name,
    homeTeamLogo: m.home_team_logo,
    awayTeamName: m.away_team_name,
    awayTeamLogo: m.away_team_logo,
  };
  if (m.home_score !== null && m.home_score !== undefined) {
    obj.score = `${m.home_score} - ${m.away_score}`;
  }
  return obj;
}

function mapStanding(s, idx) {
  return {
    id:     s.id,
    rank:   idx + 1,
    team:   s.team_name,
    played: s.played,
    won:    s.won,
    drawn:  s.drawn,
    lost:   s.lost,
    gf:     s.goals_for,
    ga:     s.goals_against,
    pts:    s.points,
  };
}

function mapNews(n) {
  return { ...n, date: n.published_at };
}

// ─── Getters ──────────────────────────────────────────────────
async function getClub() {
  return mapClub(await apiFetch('/club'));
}

async function getPlayers() {
  return (await apiFetch('/players')).map(mapPlayer);
}

async function getPlayerById(id) {
  return mapPlayer(await apiFetch(`/players/${id}`));
}

async function getCoaches() {
  return apiFetch('/coaches');
}

async function getCoachById(id) {
  return apiFetch(`/coaches/${id}`);
}

async function getUpcoming() {
  return (await apiFetch('/matches?status=upcoming')).map(mapMatch);
}

async function getUpcomingById(id) {
  return mapMatch(await apiFetch(`/matches/${id}`));
}

async function getRecent() {
  return (await apiFetch('/matches?status=completed')).map(mapMatch);
}

async function getRecentById(id) {
  return mapMatch(await apiFetch(`/matches/${id}`));
}

async function getStandings() {
  return (await apiFetch('/standings')).map(mapStanding);
}

async function getStandingById(id) {
  const s = await apiFetch(`/standings/${id}`);
  return mapStanding(s, 0);
}

async function getLegends() {
  return apiFetch('/legends');
}

async function getLegendById(id) {
  return apiFetch(`/legends/${id}`);
}

async function getNews() {
  return (await apiFetch('/news')).map(mapNews);
}

async function getNewsById(id) {
  return mapNews(await apiFetch(`/news/${id}`));
}

// ─── Club CRUD ────────────────────────────────────────────────
async function saveClubInfo(data) {
  return apiFetch('/club', { method: 'PUT', body: { club_name: data.clubName, description: data.description } });
}

// ─── Teams CRUD ───────────────────────────────────────────────
async function addTeam(data) {
  _teamsCache = null;
  return apiFetch('/teams', { method: 'POST', body: data });
}
async function updateTeam(id, data) {
  _teamsCache = null;
  return apiFetch(`/teams/${id}`, { method: 'PUT', body: data });
}
async function deleteTeam(id) {
  _teamsCache = null;
  return apiFetch(`/teams/${id}`, { method: 'DELETE' });
}

// ─── Players CRUD ─────────────────────────────────────────────
async function addPlayer(data) {
  return apiFetch('/players', { method: 'POST', body: { ...data, team_id: data.teamId } });
}
async function updatePlayer(id, data) {
  return apiFetch(`/players/${id}`, { method: 'PUT', body: { ...data, team_id: data.teamId } });
}
async function deletePlayer(id) {
  return apiFetch(`/players/${id}`, { method: 'DELETE' });
}

// ─── Coaches CRUD ─────────────────────────────────────────────
async function addCoach(data) {
  return apiFetch('/coaches', { method: 'POST', body: data });
}
async function updateCoach(id, data) {
  return apiFetch(`/coaches/${id}`, { method: 'PUT', body: data });
}
async function deleteCoach(id) {
  return apiFetch(`/coaches/${id}`, { method: 'DELETE' });
}

// ─── Matches CRUD (upcoming) ──────────────────────────────────
async function addUpcomingMatch(data) {
  return apiFetch('/matches', {
    method: 'POST',
    body: { match_time: data.time, stadium: data.stadium, home_team_id: data.homeTeamId, away_team_id: data.awayTeamId, tournament: data.tournament, status: 'upcoming' },
  });
}
async function updateUpcoming(id, data) {
  return apiFetch(`/matches/${id}`, {
    method: 'PUT',
    body: { match_time: data.time, stadium: data.stadium, home_team_id: data.homeTeamId, away_team_id: data.awayTeamId, tournament: data.tournament, status: 'upcoming' },
  });
}
async function deleteUpcoming(id) {
  return apiFetch(`/matches/${id}`, { method: 'DELETE' });
}

// ─── Matches CRUD (completed) ─────────────────────────────────
function _scoreToInts(score) {
  const parts = (score || '0 - 0').split('-').map(s => parseInt(s.trim()) || 0);
  return { home_score: parts[0] ?? 0, away_score: parts[1] ?? 0 };
}
async function addRecentMatch(data) {
  const { home_score, away_score } = _scoreToInts(data.score);
  return apiFetch('/matches', {
    method: 'POST',
    body: { match_time: data.time, stadium: data.stadium, home_team_id: data.homeTeamId, away_team_id: data.awayTeamId, tournament: data.tournament, status: 'completed', home_score, away_score, image: data.image || '' },
  });
}
async function updateRecent(id, data) {
  const { home_score, away_score } = _scoreToInts(data.score);
  return apiFetch(`/matches/${id}`, {
    method: 'PUT',
    body: { match_time: data.time, stadium: data.stadium, home_team_id: data.homeTeamId, away_team_id: data.awayTeamId, tournament: data.tournament, status: 'completed', home_score, away_score, image: data.image || '' },
  });
}
async function deleteRecent(id) {
  return apiFetch(`/matches/${id}`, { method: 'DELETE' });
}

// ─── Standings CRUD ───────────────────────────────────────────
async function addStanding(data) {
  return apiFetch('/standings', {
    method: 'POST',
    body: { team_name: data.team, played: data.played, won: data.won, drawn: data.drawn, lost: data.lost, goals_for: data.gf, goals_against: data.ga, points: data.pts },
  });
}
async function updateStanding(id, data) {
  return apiFetch(`/standings/${id}`, {
    method: 'PUT',
    body: { team_name: data.team, played: data.played, won: data.won, drawn: data.drawn, lost: data.lost, goals_for: data.gf, goals_against: data.ga, points: data.pts },
  });
}
async function deleteStanding(id) {
  return apiFetch(`/standings/${id}`, { method: 'DELETE' });
}

// ─── Legends CRUD ─────────────────────────────────────────────
async function addLegend(data) {
  return apiFetch('/legends', { method: 'POST', body: data });
}
async function updateLegend(id, data) {
  return apiFetch(`/legends/${id}`, { method: 'PUT', body: data });
}
async function deleteLegend(id) {
  return apiFetch(`/legends/${id}`, { method: 'DELETE' });
}

// ─── News CRUD ────────────────────────────────────────────────
async function addNews(data) {
  return apiFetch('/news', {
    method: 'POST',
    body: { title: data.title, content: data.content, image: data.image || '', author: data.author || 'Admin', published_at: data.date },
  });
}
async function updateNews(id, data) {
  return apiFetch(`/news/${id}`, {
    method: 'PUT',
    body: { title: data.title, content: data.content, image: data.image || '', author: data.author || 'Admin', published_at: data.date },
  });
}
async function deleteNews(id) {
  return apiFetch(`/news/${id}`, { method: 'DELETE' });
}
