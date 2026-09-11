// srs.js — ripetizione dilazionata (SM-2 semplificato)
// Ogni item (flashcard, esercizio del banco, argomento-generatore)
// ha uno stato: {ease, interval, reps, lapses, due}
// Gradi: 0 = sbagliato/ripassa, 1 = difficile, 2 = bene, 3 = facile

import { get, todayStr } from './storage.js';

const DAY = 86400000;

export function getState(itemId) {
  return get().srs[itemId] || null;
}

export function isDue(itemId, date = new Date()) {
  const st = getState(itemId);
  if (!st) return true;
  return new Date(st.due + 'T00:00:00') <= date;
}

export function dueDate(itemId) {
  const st = getState(itemId);
  return st ? st.due : null;
}

// aggiorna lo stato e restituisce la nuova scadenza (giorni da oggi)
export function grade(itemId, g) {
  const s = get();
  const st = s.srs[itemId] || { ease: 2.5, interval: 0, reps: 0, lapses: 0, due: todayStr() };
  if (g === 0) {
    st.lapses++;
    st.interval = 1;
    st.ease = Math.max(1.3, st.ease - 0.2);
  } else {
    const mult = g === 1 ? 1.2 : (g === 2 ? st.ease : st.ease * 1.35);
    st.ease = Math.min(3.2, Math.max(1.3, st.ease + (g === 1 ? -0.12 : g === 2 ? 0.02 : 0.13)));
    if (st.interval === 0) st.interval = g === 1 ? 1 : 2;
    else if (st.interval === 1) st.interval = g === 1 ? 2 : 3;
    else st.interval = Math.min(90, Math.round(st.interval * mult));
  }
  st.reps++;
  st.due = todayStr(new Date(Date.now() + st.interval * DAY));
  s.srs[itemId] = st;
  return st.interval;
}

// "masterizzazione" di un argomento: accuratezza recente + stato SRS
export function topicMastery(topicId) {
  const s = get();
  const t = s.topicStats[topicId];
  if (!t || t.seen < 3) return null;
  const acc = t.correct / t.seen;
  const st = s.srs['topic:' + topicId];
  const spacing = st ? st.interval : 0;
  // mastery = accuratezza pesata con il ritmo di ripasso raggiunto
  const m = Math.round(100 * Math.min(1, acc * 0.7 + Math.min(spacing, 14) / 14 * 0.3));
  return m;
}
