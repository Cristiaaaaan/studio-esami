// test/sync.test.mjs — sync via GitHub Gist con fetch mockata + logica di merge
import { mergeStates } from '../js/sync.js';

let fails = 0, count = 0;
const check = async (name, fn) => {
  count++;
  try { if (!(await fn())) { fails++; console.error('FAIL', name); } }
  catch (e) { fails++; console.error('ERR ', name, e.message); }
};

/* --- mergeStates --- */
await check('merge giorni: vince chi ha studiato di più', () => {
  const a = { days: { '2026-09-11': { done: 5, total: 6, correct: 4, sec: 900 } }, srs: {}, topicStats: {}, history: [], simResults: [] };
  const b = { days: { '2026-09-11': { done: 9, total: 10, correct: 6, sec: 1500 }, '2026-09-12': { done: 3, total: 3, correct: 3, sec: 500 } }, srs: {}, topicStats: {}, history: [], simResults: [] };
  const m = mergeStates(a, b);
  return m.days['2026-09-11'].done === 9 && m.days['2026-09-11'].correct === 6 && m.days['2026-09-12'].done === 3;
});

await check('merge srs: vince la scadenza più lontana', () => {
  const a = { days: {}, srs: { 'x': { due: '2026-09-20', ease: 2.5 }, 'y': { due: '2026-10-01' } }, topicStats: {}, history: [], simResults: [] };
  const b = { days: {}, srs: { 'x': { due: '2026-09-25', ease: 2.2 }, 'z': { due: '2026-09-15' } }, topicStats: {}, history: [], simResults: [] };
  const m = mergeStates(a, b);
  return m.srs.x.due === '2026-09-25' && m.srs.y.due === '2026-10-01' && m.srs.z.due === '2026-09-15';
});

await check('merge storia: dedup e ordinamento', () => {
  const h1 = { d: '2026-09-11', itemId: 'a', sec: 60, correct: true };
  const h2 = { d: '2026-09-10', itemId: 'b', sec: 30, correct: false };
  const a = { days: {}, srs: {}, topicStats: {}, history: [h1], simResults: [] };
  const b = { days: {}, srs: {}, topicStats: {}, history: [h1, h2], simResults: [] };
  const m = mergeStates(a, b);
  return m.history.length === 2 && m.history[0].d === '2026-09-10';
});

await check('merge topicStats: massimi', () => {
  const a = { days: {}, srs: {}, topicStats: { 'L-prop': { seen: 10, correct: 8 } }, history: [], simResults: [] };
  const b = { days: {}, srs: {}, topicStats: { 'L-prop': { seen: 7, correct: 7 }, 'D-rsa': { seen: 3, correct: 1 } }, history: [], simResults: [] };
  const m = mergeStates(a, b);
  return m.topicStats['L-prop'].seen === 10 && m.topicStats['L-prop'].correct === 8 && m.topicStats['D-rsa'].seen === 3;
});

/* --- API con fetch mockata --- */
globalThis.localStorage = { _s: {}, getItem(k) { return this._s[k] ?? null; }, setItem(k, v) { this._s[k] = String(v); }, removeItem(k) { delete this._s[k]; } };

const { syncNow, syncUp } = await import('../js/sync.js');
const { updateSettings, get, logAnswer } = await import('../js/storage.js');
updateSettings({ syncToken: 'ghp_test' });

const remoteState = {
  syncedAt: '2026-09-11T10:00:00Z',
  settings: {}, srs: { 'flash:th-ind-1': { ease: 2.5, interval: 3, reps: 2, lapses: 0, due: '2026-09-14' } },
  topicStats: { 'L-induzione': { seen: 4, correct: 3 } },
  days: { '2026-09-10': { done: 10, total: 10, correct: 9, sec: 1600 } },
  history: [{ d: '2026-09-10', itemId: 'flash:th-ind-1', topicId: 'L-induzione', course: 'logica', kind: 'flash', correct: true, sec: 30 }],
  simResults: [],
};

const calls = [];
globalThis.fetch = async (url, opts = {}) => {
  calls.push({ url, method: opts.method || 'GET', body: opts.body });
  const json = (obj, status = 200) => ({ ok: status < 300, status, json: async () => obj, text: async () => JSON.stringify(obj) });
  if (url.startsWith('https://api.github.com/gists?')) return json([{ id: 'gist123', description: 'Quaderno — progressi studio (non modificare)', files: { 'quaderno-progressi.json': {} } }]);
  if (url === 'https://api.github.com/gists/gist123' && (opts.method || 'GET') === 'GET') return json({ files: { 'quaderno-progressi.json': { content: JSON.stringify(remoteState) } } });
  if (url === 'https://api.github.com/gists/gist123' && opts.method === 'PATCH') return json({ id: 'gist123' });
  if (url === 'https://api.github.com/gists') return json({ id: 'gistNEW' });
  return json({}, 404);
};

logAnswer({ itemId: 'topic:L-prop', topicId: 'L-prop', course: 'logica', kind: 'mc', correct: true, sec: 90 });

await check('syncNow: discovery + download + upload', async () => {
  await syncNow();
  const urls = calls.map(c => c.method + ' ' + c.url);
  const disco = urls.includes('GET https://api.github.com/gists?per_page=100');
  const pull = urls.includes('GET https://api.github.com/gists/gist123');
  const push = urls.includes('PATCH https://api.github.com/gists/gist123');
  return disco && pull && push && get().settings.syncGistId === 'gist123';
});

await check('dopo il sync il remoto è fuso nel locale', async () => {
  const s = get();
  return !!s.srs['flash:th-ind-1'] && !!s.days['2026-09-10'] && !!s.topicStats['L-prop'] && s.settings.syncToken === 'ghp_test';
});

await check('il token non viaggia mai nel payload di upload', async () => {
  calls.length = 0;
  await syncUp();
  const bodies = calls.filter(c => c.body).map(c => c.body).join(' ');
  return bodies && !bodies.includes('ghp_test');
});

console.log(`\n${count} controlli, ${fails} fallimenti`);
process.exit(fails ? 1 : 0);
