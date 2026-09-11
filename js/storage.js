// storage.js — persistenza su localStorage (per dispositivo)
// Nota: senza backend i progressi non si sincronizzano tra PC e telefono.

const KEY = 'quaderno.v1';

const DEFAULTS = {
  settings: {
    examDate: '2026-11-11',   // data target esame
    birthMonth: 9,            // mese di nascita (parametro m degli esami di Discreta)
    minutes: 30,              // minuti di studio al giorno
    theme: 'auto',            // auto | light | dark
    name: '',                 // nome (opzionale, per il saluto)
    syncToken: '',            // token GitHub (scope gist) per la sincronizzazione
    syncGistId: '',           // id del gist dei progressi
    syncLast: '',             // ISO dell'ultima sincronizzazione
  },
  srs: {},          // itemId -> {ease, interval, reps, lapses, due}
  topicStats: {},   // topicId -> {seen, correct}
  days: {},         // 'YYYY-MM-DD' -> {done, total, correct, sec}
  history: [],      // [{d, itemId, topicId, course, kind, correct, sec}]
  activeSession: null,
  simResults: [],   // [{d, course, score, max, secs}]
};

let state = null;

function load() {
  if (state) return state;
  try {
    const raw = localStorage.getItem(KEY);
    state = raw ? JSON.parse(raw) : structuredClone(DEFAULTS);
  } catch {
    state = structuredClone(DEFAULTS);
  }
  // merge defaults per eventuali chiavi mancanti
  state.settings = { ...DEFAULTS.settings, ...state.settings };
  return state;
}

function save() {
  try { localStorage.setItem(KEY, JSON.stringify(state)); }
  catch (e) { console.warn('storage pieno?', e); }
}

export function get() { return load(); }

export function todayStr(d = new Date()) {
  const y = d.getFullYear(), m = String(d.getMonth() + 1).padStart(2, '0'), g = String(d.getDate()).padStart(2, '0');
  return `${y}-${m}-${g}`;
}

export function daysBetween(a, b) {
  // numero intero di giorni tra due date 'YYYY-MM-DD' (b - a)
  return Math.round((new Date(b) - new Date(a)) / 86400000);
}

export function updateSettings(patch) {
  Object.assign(load().settings, patch);
  save();
}

/* ---- sincronizzazione: esportazione/importazione dello stato ---- */

export function exportState() {
  const s = load();
  return {
    settings: { ...s.settings, syncToken: '' },  // mai esportare il token
    srs: { ...s.srs },
    topicStats: { ...s.topicStats },
    days: { ...s.days },
    history: s.history.map(h => ({ ...h })),
    simResults: s.simResults.map(r => ({ ...r })),
  };
}

export function importState(next) {
  const s = load();
  state = {
    ...next,
    settings: { ...s.settings, ...(next.settings || {}) }, // il token locale resta
    activeSession: s.activeSession, // la sessione in corso è del dispositivo
  };
  save();
}

/* ---- streak & registro giornaliero ---- */

export function streakInfo() {
  const s = load();
  const days = Object.keys(s.days).filter(d => s.days[d].done > 0).sort();
  if (!days.length) return { current: 0, best: 0, last: null };
  let best = 0, run = 0, prev = null;
  for (const d of days) {
    run = (prev && daysBetween(prev, d) === 1) ? run + 1 : 1;
    best = Math.max(best, run);
    prev = d;
  }
  // streak corrente: conta all'indietro da oggi (o ieri)
  const today = todayStr();
  let current = 0;
  let cursor = days.includes(today) ? today : null;
  if (!cursor) {
    const y = new Date(); y.setDate(y.getDate() - 1);
    const ystr = todayStr(y);
    if (days.includes(ystr)) cursor = ystr;
  }
  if (cursor) {
    const set = new Set(days);
    let c = new Date(cursor + 'T12:00:00');
    while (set.has(todayStr(c))) { current++; c.setDate(c.getDate() - 1); }
  }
  return { current, best: Math.max(best, current), last: days[days.length - 1] };
}

export function logAnswer({ itemId, topicId, course, kind, correct, sec }) {
  const s = load();
  const d = todayStr();
  const day = s.days[d] || (s.days[d] = { done: 0, total: 0, correct: 0, sec: 0 });
  day.done++; day.total++; day.sec += sec || 0;
  if (correct) day.correct++;
  if (topicId) {
    const t = s.topicStats[topicId] || (s.topicStats[topicId] = { seen: 0, correct: 0 });
    t.seen++; if (correct) t.correct++;
  }
  s.history.push({ d, itemId, topicId, course, kind, correct: !!correct, sec: sec || 0 });
  if (s.history.length > 4000) s.history = s.history.slice(-3000);
  save();
}

export function setActiveSession(sess) { load().activeSession = sess; save(); }
export function clearActiveSession() { load().activeSession = null; save(); }

export function addSimResult(r) { load().simResults.push(r); save(); }

export function resetAll() {
  state = structuredClone(DEFAULTS);
  save();
}
