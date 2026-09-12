// views/lesson.js — lettore della lezione (pagine) + avvio quiz di comprensione

import { get, setActiveSession, saveNow } from '../storage.js';
import { LESSONS } from '../data/lessons.js';
import { renderMath, icon, esc } from '../ui.js';
import { COURSES, TOPIC_BY_ID } from '../data/plan.js';

export function renderLesson(root, topicId) {
  const L = LESSONS[topicId];
  if (!L) { location.hash = '#/oggi'; return; }
  const st = get().lessons[topicId] || { sec: 0 };
  const i = Math.min(st.sec || 0, L.sections.length - 1);
  const sec = L.sections[i];
  const isLast = i === L.sections.length - 1;

  root.innerHTML = `
    <div class="sessbar">
      <button class="back" id="backbtn">${icon('back')}</button>
      <div class="meta">
        <div class="t">${esc(L.title)}</div>
        <div class="dots">
          ${L.sections.map((_, j) => `<div class="dot ${j < i ? 'ok' : j === i ? 'now' : ''}"></div>`).join('')}
        </div>
      </div>
      <span class="chip" style="align-self:center">${i + 1}/${L.sections.length}</span>
    </div>

    <article class="card sheet lesson">
      <div class="qhead">
        <span class="chip ${L.course}">${COURSES[L.course].short}</span>
        <span class="chip">${esc(sec.h)}</span>
      </div>
      <div class="prose">${sec.body}</div>
    </article>

    <div class="btnrow" style="margin-top:16px">
      ${i > 0 ? `<button class="btn ghost" id="prevbtn">Indietro</button>` : ''}
      <button class="btn big" id="nextbtn">${isLast
        ? `${icon('check')} Ho capito — vai al quiz (10 min)`
        : `Continua ${icon('right')}`}</button>
    </div>
    <div class="srcline">lezione ${i + 1} di ${L.sections.length} · ~${Math.max(3, Math.round(L.minutes / L.sections.length))} min di lettura</div>
  `;
  renderMath(root);
  window.scrollTo({ top: 0 });

  document.getElementById('backbtn').onclick = () => { location.hash = '#/oggi'; };
  const prev = document.getElementById('prevbtn');
  if (prev) prev.onclick = () => savePos(topicId, i - 1);
  document.getElementById('nextbtn').onclick = () => {
    if (isLast) startQuiz(topicId);
    else savePos(topicId, i + 1);
  };
}

function savePos(topicId, sec) {
  const s = get();
  s.lessons[topicId] = { ...(s.lessons[topicId] || {}), sec };
  saveNow();
  renderLesson(document.getElementById('viewroot'), topicId);
}

function startQuiz(topicId) {
  const L = LESSONS[topicId];
  const items = L.quiz.map((q, idx) => ({
    ...q, uid: `qz-${Date.now().toString(36)}-${idx}`,
    srsId: 'lessonq:' + topicId + ':' + idx,
    course: L.course, topicId,
    source: 'quiz · lezione',
    estSec: q.estSec || (q.kind === 'tf' ? 50 : q.kind === 'numeric' ? 100 : 90),
  }));
  setActiveSession({
    mode: 'quiz', date: new Date().toISOString().slice(0, 10),
    startedAt: Date.now(), lessonId: topicId, lessonTitle: L.title,
    course: L.course, items, idx: 0, results: [],
  });
  location.hash = '#/sessione';
}
