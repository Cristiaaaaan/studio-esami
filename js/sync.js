// sync.js — sincronizzazione dei progressi via GitHub Gist (segreto)
// Flusso: token (scope "gist") -> gist dedicato -> pull+merge+push.
// Nessun server: parla direttamente con api.github.com dal browser.

import { get, updateSettings, exportState, importState } from './storage.js';

const API = 'https://api.github.com';
const FILE = 'quaderno-progressi.json';
const DESC = 'Quaderno — progressi studio (non modificare)';

async function api(path, opts = {}) {
  const token = get().settings.syncToken;
  if (!token) throw new Error('nessun token configurato');
  const res = await fetch(API + path, {
    ...opts,
    headers: {
      Authorization: `Bearer ${token}`,
      Accept: 'application/vnd.github+json',
      'X-GitHub-Api-Version': '2022-11-28',
      ...(opts.body ? { 'Content-Type': 'application/json' } : {}),
    },
  });
  if (res.status === 401) throw new Error('token non valido o scaduto');
  if (res.status === 403) throw new Error('token senza permessi sui gist');
  if (!res.ok) throw new Error(`GitHub ${res.status}`);
  return res.json();
}

/* trova il gist dei progressi tra quelli dell'utente */
async function discoverGist() {
  const gists = await api('/gists?per_page=100');
  const found = gists.find(g => g.description === DESC && g.files && g.files[FILE]);
  return found ? found.id : null;
}

export async function syncUp() {
  const s = get();
  const payload = exportState();
  payload.syncedAt = new Date().toISOString();
  const content = JSON.stringify(payload);
  if (!s.settings.syncGistId) {
    const g = await api('/gists', {
      method: 'POST',
      body: JSON.stringify({ description: DESC, public: false, files: { [FILE]: { content } } }),
    });
    updateSettings({ syncGistId: g.id });
  } else {
    await api('/gists/' + s.settings.syncGistId, {
      method: 'PATCH',
      body: JSON.stringify({ files: { [FILE]: { content } } }),
    });
  }
  updateSettings({ syncLast: new Date().toISOString() });
}

export async function syncDown() {
  const s = get();
  if (!s.settings.syncGistId) throw new Error('gist non collegato');
  const g = await api('/gists/' + s.settings.syncGistId);
  const f = g.files && g.files[FILE];
  if (!f) throw new Error('file progressi mancante nel gist');
  const text = f.truncated ? await (await fetch(f.raw_url)).text() : f.content;
  const remote = JSON.parse(text);
  const merged = mergeStates(get(), remote);
  merged.syncedAt = remote.syncedAt || '';
  importState(merged);
  updateSettings({ syncLast: new Date().toISOString() });
}

/* pulsante unico: collega il gist (trovandolo o creandolo), fondi, carica */
export async function syncNow() {
  const s = get();
  if (!s.settings.syncGistId) {
    const id = await discoverGist();
    if (id) updateSettings({ syncGistId: id });
  }
  if (get().settings.syncGistId) {
    await syncDown();   // fondi il remoto
    await syncUp();     // pubblica il risultato
  } else {
    await syncUp();     // primo dispositivo: crea il gist
  }
  return true;
}

/* fusione conservativa: unione dei progressi, niente sovrascritture */
export function mergeStates(local, remote) {
  const out = structuredClone({ ...local });
  out.settings = { ...local.settings };          // le impostazioni restano del dispositivo

  // giorni: per data, i valori più alti (chi ha studiato di più su quel giorno)
  out.days = { ...local.days };
  for (const [d, v] of Object.entries(remote.days || {})) {
    const l = out.days[d];
    if (!l) out.days[d] = { ...v };
    else {
      const done = Math.max(l.done, v.done);
      out.days[d] = {
        done,
        total: Math.max(l.total, v.total),
        correct: Math.min(Math.max(l.correct, v.correct), done),
        sec: Math.max(l.sec || 0, v.sec || 0),
      };
    }
  }

  // SRS: per item vince lo stato con scadenza più lontana (ripassato più di recente)
  out.srs = { ...local.srs };
  for (const [id, v] of Object.entries(remote.srs || {})) {
    const l = out.srs[id];
    if (!l || String(v.due || '') > String(l.due || '')) out.srs[id] = v;
  }

  // statistiche per argomento: massimi
  out.topicStats = { ...local.topicStats };
  for (const [id, v] of Object.entries(remote.topicStats || {})) {
    const l = out.topicStats[id];
    if (!l) out.topicStats[id] = { ...v };
    else out.topicStats[id] = { seen: Math.max(l.seen, v.seen), correct: Math.max(l.correct, v.correct) };
  }

  // cronologia: concatena e deduplica
  const hk = (h) => h.d + '|' + h.itemId + '|' + h.sec + '|' + (h.correct ? 1 : 0);
  const seen = new Set((local.history || []).map(hk));
  out.history = [...(local.history || [])];
  for (const h of remote.history || []) if (!seen.has(hk(h))) { seen.add(hk(h)); out.history.push(h); }
  out.history.sort((a, b) => String(a.d).localeCompare(String(b.d)));

  // simulazioni: concatena e deduplica
  const sk = (r) => r.d + '|' + r.label + '|' + r.score + '|' + r.max;
  const skeys = new Set((local.simResults || []).map(sk));
  out.simResults = [...(local.simResults || [])];
  for (const r of remote.simResults || []) if (!skeys.has(sk(r))) { skeys.add(sk(r)); out.simResults.push(r); }

  return out;
}
