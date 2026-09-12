// session.js — costruisce la sessione quotidiana (~30 min configurabili)
// Mix: 40% ripasso SRS + 40% nuovi esercizi del giorno + 20% teoria.

import { get, todayStr, daysBetween, setActiveSession } from './storage.js';
import { isDue } from './srs.js';
import { TOPIC_BY_ID, topicsForDay, START_DATE } from './data/plan.js';
import { FLASHCARDS_BY_TOPIC, FLASHCARDS } from './data/theory.js';
import { ALL_EXAMS } from './data/bank.js';
import { LESSONS, LESSON_ORDER } from './data/lessons.js';
import { LOGICA_GENS } from './generators/logica.js';
import { DISCRETA_GENS } from './generators/discreta.js';
import { shuffle } from './ui.js';

export const GENS = { ...LOGICA_GENS, ...DISCRETA_GENS };

let uidCounter = 0;
const uid = () => `it-${Date.now().toString(36)}-${uidCounter++}`;

function genItem(topicId) {
  const t = TOPIC_BY_ID[topicId];
  if (!t || !t.gen || !GENS[t.gen]) return null;
  try {
    const item = GENS[t.gen]();
    return { ...item, uid: uid(), srsId: 'topic:' + topicId };
  } catch (e) {
    console.warn('generatore fallito', topicId, e);
    return null;
  }
}

function flashItem(card) {
  return {
    uid: uid(), kind: 'flash', topicId: card.topic, course: card.course,
    prompt: card.front, solution: [card.back],
    source: 'flashcard · teoria', estSec: 35, srsId: 'flash:' + card.id,
  };
}

function bankItem(b) {
  return { ...b, uid: uid(), srsId: 'bank:' + b.id };
}

// coda di ripasso: flashcard, bank e domande quiz lezioni in scadenza
function reviewQueue() {
  const s = get();
  const due = [];
  for (const c of FLASHCARDS) {
    const id = 'flash:' + c.id;
    if (s.srs[id] && isDue(id)) due.push({ sort: s.srs[id].due, item: flashItem(c) });
  }
  for (const ex of ALL_EXAMS) for (const it of ex.items) {
    const id = 'bank:' + it.id;
    if (s.srs[id] && isDue(id)) due.push({ sort: s.srs[id].due, item: bankItem(it) });
  }
  for (const lid of LESSON_ORDER) {
    const L = LESSONS[lid];
    if (!L) continue;
    L.quiz.forEach((q, idx) => {
      const id = 'lessonq:' + lid + ':' + idx;
      if (s.srs[id] && isDue(id)) due.push({ sort: s.srs[id].due, item: {
        ...q, uid: uid(), srsId: id, course: L.course, topicId: lid,
        source: 'quiz · lezione', estSec: q.estSec || (q.kind === 'tf' ? 50 : q.kind === 'numeric' ? 100 : 90),
      } });
    });
  }
  due.sort((a, b) => a.sort.localeCompare(b.sort));
  return due.map(d => d.item);
}

// argomenti già "sbloccati" fino a oggi (per ripasso misto)
function topicsUpToToday() {
  const idx = Math.max(0, daysBetween(START_DATE, todayStr()));
  const week = Math.floor(idx / 7);
  const seen = new Set();
  const out = [];
  for (let w = 0; w <= Math.min(week, 11); w++) {
    for (const tid of [TOPICS_WEEKS_L[w], TOPICS_WEEKS_D[w]]) {
      if (!seen.has(tid)) { seen.add(tid); out.push(tid); }
    }
  }
  return out;
}
// (ricostruiti da plan per non esportare WEEKS)
const TOPICS_WEEKS_L = [], TOPICS_WEEKS_D = [];
for (let w = 0; w < 12; w++) {
  const { week } = topicsForDay(w * 7);
  TOPICS_WEEKS_L.push(week.l); TOPICS_WEEKS_D.push(week.d);
}

export function buildDailySession() {
  const s = get();
  const budget = s.settings.minutes * 60;
  const idx = daysBetween(START_DATE, todayStr());
  const { week, review } = topicsForDay(Math.max(0, idx));
  const todayTopics = review ? shuffle(topicsUpToToday()).slice(0, 3) : [week.l, week.d];

  const items = [];
  const add = (it) => { if (it) items.push(it); };

  // 1) ripasso in scadenza (max ~40% del tempo)
  const reviews = reviewQueue();
  let used = 0;
  for (const r of reviews) {
    if (used + r.estSec > budget * 0.45) break;
    add(r); used += r.estSec;
  }

  // 2) un esercizio da compito vero collegato al tema del giorno (se dovuto)
  const bankPool = ALL_EXAMS.flatMap(e => e.items).filter(b => todayTopics.includes(b.topicId));
  const b = bankPool.length ? bankPool[Math.floor(Math.random() * bankPool.length)] : null;
  if (b && isDue('bank:' + b.id)) add(bankItem(b));

  // 3) nuovi esercizi generati per gli argomenti del giorno
  const perTopic = review ? 2 : 3;
  for (const tid of todayTopics) {
    for (let i = 0; i < perTopic; i++) add(genItem(tid));
  }

  // 4) teoria: nuove card degli argomenti del giorno (max 3), poi a caso
  const srs = s.srs;
  let newCards = [];
  for (const tid of todayTopics) {
    newCards.push(...(FLASHCARDS_BY_TOPIC[tid] || []).filter(c => !srs['flash:' + c.id]));
  }
  newCards = shuffle(newCards).slice(0, 3);
  if (newCards.length < 2) {
    const others = FLASHCARDS.filter(c => !srs['flash:' + c.id] && !newCards.includes(c));
    newCards.push(...shuffle(others).slice(0, 2 - newCards.length));
  }
  for (const c of newCards) add(flashItem(c));

  // 5) taglio al budget (mantieni almeno 5 item)
  const minKeep = Math.min(5, items.length);
  let kept = [];
  let tot = 0;
  for (const it of items) {
    if (kept.length >= minKeep && tot + it.estSec > budget) continue;
    kept.push(it); tot += it.estSec;
    if (tot > budget * 1.15 && kept.length > minKeep) break;
  }

  const sess = {
    mode: 'daily', date: todayStr(), startedAt: Date.now(),
    topics: todayTopics, items: kept, idx: 0, results: [],
  };
  setActiveSession(sess);
  return sess;
}

// allenamento libero su un argomento: 5 item (generatori + teoria + banco)
export function buildTopicSession(topicId) {
  const t = TOPIC_BY_ID[topicId];
  if (!t) return null;
  const items = [];
  const nGen = t.gen ? 3 : 0;
  for (let i = 0; i < nGen; i++) items.push(genItem(topicId));
  const cards = shuffle(FLASHCARDS_BY_TOPIC[topicId] || []).slice(0, 2);
  for (const c of cards) items.push(flashItem(c));
  const banks = ALL_EXAMS.flatMap(e => e.items).filter(b => b.topicId === topicId);
  if (banks.length) items.push(bankItem(pick(banks)));
  if (!items.length) return null;
  const sess = { mode: 'topic', date: todayStr(), startedAt: Date.now(), topics: [topicId], items, idx: 0, results: [] };
  setActiveSession(sess);
  return sess;
}

// simulazione d'esame: tutti gli esercizi di un compito, cronometro, punteggi
export function buildExamSession(examId) {
  const ex = ALL_EXAMS.find(e => e.id === examId);
  if (!ex) return null;
  const items = ex.items.map(bankItem);
  const sess = {
    mode: 'exam', date: todayStr(), startedAt: Date.now(),
    examId, examLabel: ex.label, course: ex.course,
    items, idx: 0, results: [],
  };
  setActiveSession(sess);
  return sess;
}

function pick(arr) { return arr[Math.floor(Math.random() * arr.length)]; }

// voto in decimi di autostima -> grado SRS (0..2)
export function gradeFor(item, correct, points) {
  if (item.kind === 'open') return points === 0 ? 0 : points <= 3 ? 1 : 2;
  return correct ? 2 : 0;
}
