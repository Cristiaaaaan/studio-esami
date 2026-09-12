// lessons.js — indice delle lezioni (contenuti in lessons-logica.js / lessons-discreta.js)
// Ogni lezione: sezioni di lettura (~20 min) + quiz di comprensione (~10 min, 5 domande).

import { LESSONS_LOGICA } from './lessons-logica.js';
import { LESSONS_DISCRETA } from './lessons-discreta.js';

export const LESSONS = { ...LESSONS_LOGICA, ...LESSONS_DISCRETA };

// ordine di studio: segue il calendario (settimane 1-6)
export const LESSON_ORDER = [
  'L-induzione', 'D-funzioni', 'D-relazioni',
  'L-prop', 'D-modulare', 'D-rsa',
  'L-fnf', 'L-karnaugh',
];

// prossima lezione da fare (o null)
export function nextLesson(lessonsDone) {
  for (const id of LESSON_ORDER) {
    const st = lessonsDone[id];
    if (!st || !st.done) return { id, lesson: LESSONS[id], started: !!st };
  }
  return null;
}
