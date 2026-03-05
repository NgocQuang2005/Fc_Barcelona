/* ============================================================
   STORAGE MODULE
   ============================================================ */

// Storage helpers
function saveToStorage(key, data) {
  try { localStorage.setItem(key, JSON.stringify(data)); } catch(e) { console.error(e); }
}

function getFromStorage(key) {
  try { const val = localStorage.getItem(key); return val ? JSON.parse(val) : null; } catch(e) { return null; }
}

// Default data
const DEFAULT_CLUB = {
  clubName: 'FC Barcelona',
  description: 'Més que un club – Câu lạc bộ bóng đá vĩ đại nhất thế giới, nơi những ngôi sao hội tụ và tạo nên những trang sử vàng.'
};

const DEFAULT_TEAMS = [
  { id: 't1', name: 'FC Barcelona', logo: 'https://upload.wikimedia.org/wikipedia/en/4/47/FC_Barcelona_%28crest%29.svg', country: 'Tây Ban Nha' },
  { id: 't2', name: 'Real Madrid', logo: 'https://upload.wikimedia.org/wikipedia/en/5/56/Real_Madrid_CF.svg', country: 'Tây Ban Nha' },
  { id: 't3', name: 'Atletico Madrid', logo: 'https://upload.wikimedia.org/wikipedia/en/f/f4/Atletico_Madrid_2017_logo.svg', country: 'Tây Ban Nha' },
  { id: 't4', name: 'Manchester City', logo: 'https://upload.wikimedia.org/wikipedia/en/e/eb/Manchester_City_FC_badge.svg', country: 'Anh' },
];

const DEFAULT_PLAYERS = [
  { id: 'p1', name: 'Marc-André ter Stegen', birthday: '1992-04-30', nationality: 'Đức', position: 'GK', number: '1', image: '', teamId: 't1' },
  { id: 'p2', name: 'Ronald Araújo', birthday: '1999-03-07', nationality: 'Uruguay', position: 'CB', number: '4', image: '', teamId: 't1' },
  { id: 'p3', name: 'Jules Koundé', birthday: '1998-11-12', nationality: 'Pháp', position: 'RB', number: '23', image: '', teamId: 't1' },
  { id: 'p4', name: 'Alejandro Balde', birthday: '2003-10-18', nationality: 'Tây Ban Nha', position: 'LB', number: '3', image: '', teamId: 't1' },
  { id: 'p5', name: 'Frenkie de Jong', birthday: '1997-05-12', nationality: 'Hà Lan', position: 'CM', number: '21', image: '', teamId: 't1' },
  { id: 'p6', name: 'Pedri González', birthday: '2002-11-25', nationality: 'Tây Ban Nha', position: 'CM', number: '8', image: '', teamId: 't1' },
  { id: 'p7', name: 'Gavi Páez', birthday: '2004-08-05', nationality: 'Tây Ban Nha', position: 'CM', number: '6', image: '', teamId: 't1' },
  { id: 'p8', name: 'Robert Lewandowski', birthday: '1988-08-21', nationality: 'Ba Lan', position: 'ST', number: '9', image: '', teamId: 't1' },
  { id: 'p9', name: 'Raphinha', birthday: '1996-12-14', nationality: 'Brazil', position: 'RW', number: '11', image: '', teamId: 't1' },
  { id: 'p10', name: 'Ferran Torres', birthday: '2000-02-29', nationality: 'Tây Ban Nha', position: 'LW', number: '7', image: '', teamId: 't1' },
  { id: 'p11', name: 'Andreas Christensen', birthday: '1996-04-10', nationality: 'Đan Mạch', position: 'CB', number: '15', image: '', teamId: 't1' },
];

const DEFAULT_COACHES = [
  { id: 'c1', name: 'Hansi Flick', birthday: '1965-02-24', nationality: 'Đức', image: '' },
];

const DEFAULT_UPCOMING = [
  { id: 'u1', time: '2025-04-15T21:00', stadium: 'Camp Nou', homeTeamId: 't1', awayTeamId: 't2', tournament: 'La Liga' },
  { id: 'u2', time: '2025-04-22T20:00', stadium: 'Spotify Camp Nou', homeTeamId: 't3', awayTeamId: 't1', tournament: 'Champions League' },
  { id: 'u3', time: '2025-04-28T22:00', stadium: 'Etihad Stadium', homeTeamId: 't4', awayTeamId: 't1', tournament: 'Friendly' },
  { id: 'u4', time: '2025-05-05T21:00', stadium: 'Camp Nou', homeTeamId: 't1', awayTeamId: 't3', tournament: 'La Liga' },
];

const DEFAULT_RECENT = [
  { id: 'r1', time: '2025-03-20T21:00', stadium: 'Camp Nou', homeTeamId: 't1', awayTeamId: 't2', score: '3 - 1', tournament: 'La Liga', image: '' },
  { id: 'r2', time: '2025-03-12T20:00', stadium: 'Metropolitano', homeTeamId: 't3', awayTeamId: 't1', score: '0 - 2', tournament: 'Champions League', image: '' },
  { id: 'r3', time: '2025-03-05T22:00', stadium: 'Camp Nou', homeTeamId: 't1', awayTeamId: 't4', score: '1 - 1', tournament: 'Champions League', image: '' },
  { id: 'r4', time: '2025-02-28T21:00', stadium: 'Camp Nou', homeTeamId: 't1', awayTeamId: 't3', score: '4 - 0', tournament: 'La Liga', image: '' },
  { id: 'r5', time: '2025-02-15T21:00', stadium: 'Bernabeu', homeTeamId: 't2', awayTeamId: 't1', score: '2 - 2', tournament: 'La Liga', image: '' },
  { id: 'r6', time: '2025-02-08T18:00', stadium: 'Camp Nou', homeTeamId: 't1', awayTeamId: 't2', score: '1 - 0', tournament: 'Friendly', image: '' },
];

const DEFAULT_STANDINGS = [
  { id: 's1', rank: 1, team: 'FC Barcelona', played: 28, won: 20, drawn: 5, lost: 3, gf: 68, ga: 28, pts: 65 },
  { id: 's2', rank: 2, team: 'Real Madrid', played: 28, won: 19, drawn: 4, lost: 5, gf: 65, ga: 35, pts: 61 },
  { id: 's3', rank: 3, team: 'Atletico Madrid', played: 28, won: 16, drawn: 7, lost: 5, gf: 52, ga: 30, pts: 55 },
  { id: 's4', rank: 4, team: 'Manchester City', played: 28, won: 15, drawn: 5, lost: 8, gf: 55, ga: 40, pts: 50 },
];

const DEFAULT_LEGENDS = [
  { id: 'l1', name: 'Lionel Messi', image: 'https://cdn.britannica.com/34/212134-050-A7289400/Lionel-Messi-2018.jpg', achievements: '6 Quả bóng vàng, 4 Champions League, 10 La Liga', period: '2004-2021' },
  { id: 'l2', name: 'Xavi Hernández', image: '', achievements: '4 Champions League, 8 La Liga, World Cup 2010', period: '1998-2015' },
  { id: 'l3', name: 'Andrés Iniesta', image: '', achievements: '4 Champions League, 9 La Liga, World Cup 2010', period: '2002-2018' },
  { id: 'l4', name: 'Carles Puyol', image: '', achievements: '3 Champions League, 6 La Liga, Euro 2008', period: '1999-2014' },
];

const DEFAULT_NEWS = [
  { id: 'n1', title: 'FC Barcelona giành chiến thắng 3-1 trước Real Madrid', image: '', content: 'Trong trận El Clásico hấp dẫn, Barca đã có chiến thắng thuyết phục với tỷ số 3-1 trên sân Camp Nou...', date: '2025-03-20', author: 'Admin' },
  { id: 'n2', title: 'Hansi Flick khen ngợi màn trình diễn của đội', image: '', content: 'HLV Hansi Flick tỏ ra hài lòng với màn trình diễn của các học trò trong trận đấu vừa qua...', date: '2025-03-19', author: 'Admin' },
];

// Init storage
function initStorage() {
  if (!getFromStorage('club')) saveToStorage('club', DEFAULT_CLUB);
  if (!getFromStorage('teams')) saveToStorage('teams', DEFAULT_TEAMS);
  if (!getFromStorage('players')) saveToStorage('players', DEFAULT_PLAYERS);
  if (!getFromStorage('coaches')) saveToStorage('coaches', DEFAULT_COACHES);
  if (!getFromStorage('upcoming')) saveToStorage('upcoming', DEFAULT_UPCOMING);
  if (!getFromStorage('recent')) saveToStorage('recent', DEFAULT_RECENT);
  if (!getFromStorage('standings')) saveToStorage('standings', DEFAULT_STANDINGS);
  if (!getFromStorage('legends')) saveToStorage('legends', DEFAULT_LEGENDS);
  if (!getFromStorage('news')) saveToStorage('news', DEFAULT_NEWS);
  if (!getFromStorage('theme')) saveToStorage('theme', 'dark');
}

// Getters
const getClub = () => getFromStorage('club') || DEFAULT_CLUB;
const getTeams = () => getFromStorage('teams') || [];
const getPlayers = () => getFromStorage('players') || [];
const getCoaches = () => getFromStorage('coaches') || [];
const getUpcoming = () => getFromStorage('upcoming') || [];
const getRecent = () => getFromStorage('recent') || [];
const getStandings = () => getFromStorage('standings') || [];
const getLegends = () => getFromStorage('legends') || [];
const getNews = () => getFromStorage('news') || [];

// ID Generator
function genId() { return '_' + Math.random().toString(36).substr(2,9); }

// CRUD Operations
function addTeam(data) { const arr = getTeams(); arr.push({...data, id: genId()}); saveToStorage('teams', arr); }
function updateTeam(id, data) { const arr = getTeams(); const idx = arr.findIndex(x => x.id === id); if (idx !== -1) { arr[idx] = {...arr[idx], ...data}; saveToStorage('teams', arr); } }
function deleteTeam(id) { saveToStorage('teams', getTeams().filter(x => x.id !== id)); }

function addPlayer(data) { const arr = getPlayers(); arr.push({...data, id: genId()}); saveToStorage('players', arr); }
function updatePlayer(id, data) { const arr = getPlayers(); const idx = arr.findIndex(x => x.id === id); if (idx !== -1) { arr[idx] = {...arr[idx], ...data}; saveToStorage('players', arr); } }
function deletePlayer(id) { saveToStorage('players', getPlayers().filter(x => x.id !== id)); }

function addCoach(data) { const arr = getCoaches(); arr.push({...data, id: genId()}); saveToStorage('coaches', arr); }
function updateCoach(id, data) { const arr = getCoaches(); const idx = arr.findIndex(x => x.id === id); if (idx !== -1) { arr[idx] = {...arr[idx], ...data}; saveToStorage('coaches', arr); } }
function deleteCoach(id) { saveToStorage('coaches', getCoaches().filter(x => x.id !== id)); }

function addUpcomingMatch(data) { const arr = getUpcoming(); arr.push({...data, id: genId()}); saveToStorage('upcoming', arr); }
function updateUpcoming(id, data) { const arr = getUpcoming(); const idx = arr.findIndex(x => x.id === id); if (idx !== -1) { arr[idx] = {...arr[idx], ...data}; saveToStorage('upcoming', arr); } }
function deleteUpcoming(id) { saveToStorage('upcoming', getUpcoming().filter(x => x.id !== id)); }

function addRecentMatch(data) { const arr = getRecent(); arr.push({...data, id: genId()}); saveToStorage('recent', arr); }
function updateRecent(id, data) { const arr = getRecent(); const idx = arr.findIndex(x => x.id === id); if (idx !== -1) { arr[idx] = {...arr[idx], ...data}; saveToStorage('recent', arr); } }
function deleteRecent(id) { saveToStorage('recent', getRecent().filter(x => x.id !== id)); }

function addStanding(data) { const arr = getStandings(); arr.push({...data, id: genId()}); saveToStorage('standings', arr); }
function updateStanding(id, data) { const arr = getStandings(); const idx = arr.findIndex(x => x.id === id); if (idx !== -1) { arr[idx] = {...arr[idx], ...data}; saveToStorage('standings', arr); } }
function deleteStanding(id) { saveToStorage('standings', getStandings().filter(x => x.id !== id)); }

function addLegend(data) { const arr = getLegends(); arr.push({...data, id: genId()}); saveToStorage('legends', arr); }
function updateLegend(id, data) { const arr = getLegends(); const idx = arr.findIndex(x => x.id === id); if (idx !== -1) { arr[idx] = {...arr[idx], ...data}; saveToStorage('legends', arr); } }
function deleteLegend(id) { saveToStorage('legends', getLegends().filter(x => x.id !== id)); }

function addNews(data) { const arr = getNews(); arr.push({...data, id: genId()}); saveToStorage('news', arr); }
function updateNews(id, data) { const arr = getNews(); const idx = arr.findIndex(x => x.id === id); if (idx !== -1) { arr[idx] = {...arr[idx], ...data}; saveToStorage('news', arr); } }
function deleteNews(id) { saveToStorage('news', getNews().filter(x => x.id !== id)); }

function saveClubInfo(data) { saveToStorage('club', data); }

// Finders
function getTeamById(id) { return getTeams().find(t => t.id === id) || null; }
function getPlayerById(id) { return getPlayers().find(p => p.id === id) || null; }
function getCoachById(id) { return getCoaches().find(c => c.id === id) || null; }
function getUpcomingById(id) { return getUpcoming().find(m => m.id === id) || null; }
function getRecentById(id) { return getRecent().find(m => m.id === id) || null; }
function getStandingById(id) { return getStandings().find(s => s.id === id) || null; }
function getLegendById(id) { return getLegends().find(l => l.id === id) || null; }
function getNewsById(id) { return getNews().find(n => n.id === id) || null; }
