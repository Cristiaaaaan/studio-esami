// test/lessons.test.mjs — validazione struttura e contenuto delle lezioni
// eseguito con node: node test/lessons.test.mjs

import { LESSONS, LESSON_ORDER } from '../js/data/lessons.js';
import { TOPIC_BY_ID, COURSES } from '../js/data/plan.js';

let fails = 0, count = 0;

function check(name, fn) {
  count++;
  try {
    const ok = fn();
    if (!ok) { fails++; console.error('FAIL', name); }
  } catch (e) {
    fails++; console.error('FAIL', name, '—', e.message);
  }
}

// ---------- struttura ----------

check('ogni id in LESSON_ORDER esiste in LESSONS', () =>
  LESSON_ORDER.every(id => !!LESSONS[id]));

check('non ci sono lezioni fuori dal calendario', () =>
  Object.keys(LESSONS).every(id => LESSON_ORDER.includes(id)));

check('ogni id lezione è un argomento valido di plan.js', () =>
  Object.keys(LESSONS).every(id => !!TOPIC_BY_ID[id]));

check('5 domande per lezione', () =>
  Object.values(LESSONS).every(L => Array.isArray(L.quiz) && L.quiz.length === 5));

check('3-6 sezioni per lezione', () =>
  Object.values(LESSONS).every(L => Array.isArray(L.sections) && L.sections.length >= 3 && L.sections.length <= 6));

check('campi obbligatori (title, course, minutes, sections, quiz)', () =>
  Object.values(LESSONS).every(L =>
    typeof L.title === 'string' && L.title.length >= 2 &&
    COURSES[L.course] &&
    Number.isFinite(L.minutes) && L.minutes >= 15 && L.minutes <= 30));

check('course della lezione coincide con quello dell’argomento', () =>
  Object.entries(LESSONS).every(([id, L]) => TOPIC_BY_ID[id].course === L.course));

check('sezioni con titolo e corpo non vuoti', () =>
  Object.values(LESSONS).every(L => L.sections.every(s =>
    typeof s.h === 'string' && s.h.length > 2 &&
    typeof s.body === 'string' && s.body.length > 120)));

// ---------- stringhe: interpolazioni accidentali e delimitatori bilanciati ----------

const allStrings = (L) => [
  ...L.sections.map(s => s.h + '\n' + s.body),
  ...L.quiz.flatMap(q => [q.prompt || '', ...(q.choices || []).map(c => c.tex || c.text || ''), ...(q.solution || [])]),
];

check('nessuna interpolazione accidentale ${...} nei contenuti', () =>
  Object.values(LESSONS).every(L => !allStrings(L).some(t => String(t).includes('${'))));

const countSub = (s, sub) => String(s).split(sub).length - 1;

check('delimitatori KaTeX bilanciati \\( \\) e \\[ \\]', () =>
  Object.values(LESSONS).every(L => allStrings(L).every(t =>
    countSub(t, '\\(') === countSub(t, '\\)') &&
    countSub(t, '\\[') === countSub(t, '\\]'))));

check('nessun delimitatore $ ... $ (non supportato dal renderer)', () =>
  Object.values(LESSONS).every(L => !allStrings(L).some(t => /\$[^$]+\$/.test(String(t)))));

// ---------- quiz ----------

const KINDS = new Set(['mc', 'tf', 'numeric']);

check('item quiz ben formati (kind, prompt, solution)', () =>
  Object.values(LESSONS).every(L => L.quiz.every(q =>
    KINDS.has(q.kind) &&
    typeof q.prompt === 'string' && q.prompt.length > 10 &&
    Array.isArray(q.solution) && q.solution.length >= 1 &&
    q.solution.every(s => typeof s === 'string' && s.length > 0))));

check('mc/tf: 2-5 scelte con testo/tex e answer valido', () =>
  Object.values(LESSONS).every(L => L.quiz.filter(q => q.kind === 'mc' || q.kind === 'tf').every(q =>
    Array.isArray(q.choices) && q.choices.length >= 2 && q.choices.length <= 5 &&
    q.choices.every(c => (typeof c.tex === 'string') !== (typeof c.text === 'string')) &&
    Number.isInteger(q.answer) && q.answer >= 0 && q.answer < q.choices.length)));

check('tf: esattamente 2 scelte Vero/Falso', () =>
  Object.values(LESSONS).every(L => L.quiz.filter(q => q.kind === 'tf').every(q =>
    q.choices.length === 2)));

check('numeric: answer definito (stringa o numero)', () =>
  Object.values(LESSONS).every(L => L.quiz.filter(q => q.kind === 'numeric').every(q =>
    q.answer !== undefined && q.answer !== null && String(q.answer).length > 0)));

// ---------- integrazione con la sessione (stessa forma degli item dei generatori) ----------

// riproduce la mappa di startQuiz e verifica che ogni item sopravviva al paintItem
// (course/topicId/source/estSec presenti, prompt con math ben formato)
check('item come li costruisce startQuiz: course/topicId/estSec coerenti', () =>
  Object.entries(LESSONS).every(([id, L]) => {
    const items = L.quiz.map(q => ({
      ...q,
      course: L.course, topicId: id,
      estSec: q.estSec || (q.kind === 'tf' ? 50 : q.kind === 'numeric' ? 100 : 90),
    }));
    return items.every(it => COURSES[it.course] && TOPIC_BY_ID[it.topicId] && it.estSec > 0);
  }));

// ---------- contenuto: caselle didattiche e HTML ----------

check('HTML delle sezioni ben appaiato (<div>, <p>, <ul>, <li>, <table>, <tr>)', () =>
  Object.values(LESSONS).every(L => L.sections.every(s => ['div', 'p', 'ul', 'li', 'table', 'tr', 'th', 'td', 'span', 'strong', 'em']
    .every(tag => countSub(s.body, '<' + tag) === countSub(s.body, '</' + tag + '>')))));

console.log(`\n${count} controlli, ${fails} fallimenti`);
process.exit(fails ? 1 : 0);
