// plan.js — argomenti dei due corsi e calendario di 12 settimane
// L = Logica e Reti Logiche (Pasquale), D = Matematica Discreta (Brenti)

export const COURSES = {
  logica:   { id: 'logica',   name: 'Logica e Reti Logiche', short: 'LOGICA',   examFmt: '5 esercizi × 6 pt · sufficienza 18' },
  discreta: { id: 'discreta', name: 'Matematica Discreta',   short: 'DISCRETA', examFmt: '8 problemi × 4 pt · parametro m' },
};

export const TOPICS = [
  // ---- LOGICA ----
  { id: 'L-induzione',   course: 'logica',   name: 'Induzione e successioni',      gen: 'L_induzione',   theory: ['L-ind'] },
  { id: 'L-prop',        course: 'logica',   name: 'Tautologie e connettivi',      gen: 'L_prop',        theory: ['L-prop'] },
  { id: 'L-fnf',         course: 'logica',   name: 'Forme normali (FNC/FND)',      gen: 'L_fnf',         theory: ['L-fnf'] },
  { id: 'L-karnaugh',    course: 'logica',   name: 'Mappe di Karnaugh',            gen: 'L_karnaugh',    theory: ['L-kar'] },
  { id: 'L-fo',          course: 'logica',   name: 'Primo ordine e tableaux',      gen: 'L_fo',          theory: ['L-fo'] },
  { id: 'L-assiomi',     course: 'logica',   name: 'Sistemi assiomatici (MP)',     gen: null,            theory: ['L-ass'] },
  { id: 'L-reti',        course: 'logica',   name: 'Reti combinatorie',            gen: 'L_reti',        theory: ['L-reti'] },
  { id: 'L-codifiche',   course: 'logica',   name: 'Codifiche e complemento a 2',  gen: 'L_codifiche',   theory: ['L-cod'] },
  { id: 'L-sequenziali', course: 'logica',   name: 'Reti sequenziali e FF',        gen: null,            theory: ['L-seq'] },
  // ---- DISCRETA ----
  { id: 'D-funzioni',    course: 'discreta', name: 'Funzioni e controimmagini',    gen: 'D_funzioni',    theory: ['D-fun'] },
  { id: 'D-relazioni',   course: 'discreta', name: 'Relazioni e ordini',           gen: 'D_relazioni',   theory: ['D-rel'] },
  { id: 'D-modulare',    course: 'discreta', name: 'Aritmetica modulare',          gen: 'D_modulare',    theory: ['D-mod'] },
  { id: 'D-rsa',         course: 'discreta', name: 'RSA',                          gen: 'D_rsa',         theory: ['D-rsa'] },
  { id: 'D-grafi',       course: 'discreta', name: 'Grafi e matching',             gen: 'D_grafi',       theory: ['D-gra'] },
  { id: 'D-ricorsioni',  course: 'discreta', name: 'Ricorsioni lineari',           gen: 'D_ricorsioni',  theory: ['D-ric'] },
];

export const TOPIC_BY_ID = Object.fromEntries(TOPICS.map(t => [t.id, t]));

// ---- calendario 12 settimane: [L-topic, D-topic] per settimana ----
const WEEKS = [
  { tema: 'Fondamenti',        l: 'L-induzione',   d: 'D-funzioni' },
  { tema: 'Fondamenti',        l: 'L-induzione',   d: 'D-relazioni' },
  { tema: 'Proposizionale',    l: 'L-prop',        d: 'D-modulare' },
  { tema: 'Proposizionale',    l: 'L-prop',        d: 'D-modulare' },
  { tema: 'Forme normali',     l: 'L-fnf',         d: 'D-rsa' },
  { tema: 'Forme normali',     l: 'L-karnaugh',    d: 'D-rsa' },
  { tema: 'Primo ordine',      l: 'L-fo',          d: 'D-grafi' },
  { tema: 'Primo ordine',      l: 'L-fo',          d: 'D-grafi' },
  { tema: 'Sistemi e reti',    l: 'L-assiomi',     d: 'D-ricorsioni' },
  { tema: 'Reti combinatorie', l: 'L-reti',        d: 'D-ricorsioni' },
  { tema: 'Codifiche',         l: 'L-codifiche',   d: 'D-funzioni' },
  { tema: 'Ripasso finale',    l: 'L-sequenziali', d: 'D-grafi' },
];

export const START_DATE = '2026-09-14'; // lunedì: inizio piano

// giorno del piano (0-based) -> argomenti di oggi
export function topicsForDay(dayIndex) {
  if (dayIndex < 0) return { week: WEEKS[0], review: false };
  const week = Math.floor(dayIndex / 7);
  const dow = dayIndex % 7;
  if (week >= WEEKS.length) {
    // oltre il piano: ripasso misto
    return { week: WEEKS[WEEKS.length - 1], review: true, mixed: true };
  }
  return { week: WEEKS[week], review: dow === 6 }; // domenica = ripasso
}

export function planLength() { return WEEKS.length * 7; }
