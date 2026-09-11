// views/topics.js — argomenti con anelli di progresso + allenamento libero

import { get } from '../storage.js';
import { TOPICS, COURSES } from '../data/plan.js';
import { topicMastery } from '../srs.js';
import { FLASHCARDS_BY_TOPIC } from '../data/theory.js';
import { ALL_EXAMS } from '../data/bank.js';
import { renderMath, icon, esc } from '../ui.js';

function ring(m) {
  const pct = m === null ? 0 : m;
  const C = 2 * Math.PI * 18;
  return `
    <div class="ring">
      <svg viewBox="0 0 44 44">
        <circle class="bg" cx="22" cy="22" r="18"/>
        <circle class="fg" cx="22" cy="22" r="18"
          stroke="${m === null ? 'transparent' : pct >= 70 ? 'var(--green)' : pct >= 40 ? 'var(--blue)' : 'var(--amber)'}"
          stroke-dasharray="${C}" stroke-dashoffset="${C * (1 - pct / 100)}"/>
      </svg>
      <div class="pct">${m === null ? '—' : pct}</div>
    </div>`;
}

export function renderTopics(root, param) {
  // link diretto dal dashboard: avvia subito l'allenamento su quell'argomento
  if (param) {
    import('../session.js').then(({ buildTopicSession }) => {
      if (buildTopicSession(param)) location.hash = '#/sessione';
      else location.hash = '#/argomenti';
    });
    return;
  }
  const s = get();

  const group = (courseId) => {
    const list = TOPICS.filter(t => t.course === courseId);
    return `
      <h2 class="sect">${esc(COURSES[courseId].name)} <span class="chip ${courseId}" style="margin-left:auto">${esc(COURSES[courseId].examFmt)}</span></h2>
      <div class="topicgrid">
        ${list.map(t => {
          const m = topicMastery(t.id);
          const st = s.topicStats[t.id];
          const nCards = (FLASHCARDS_BY_TOPIC[t.id] || []).length;
          const nBank = ALL_EXAMS.reduce((n, e) => n + e.items.filter(b => b.topicId === t.id).length, 0);
          return `
          <div class="topicrow" data-topic="${t.id}">
            ${ring(m)}
            <div class="tinfo">
              <div class="tname">${esc(t.name)}</div>
              <div class="tmeta">${st ? st.seen + ' svolti · ' + Math.round(100 * st.correct / st.seen) + '%' : 'mai affrontato'}${nCards ? ' · ' + nCards + ' card' : ''}${nBank ? ' · ' + nBank + ' da compito' : ''}</div>
            </div>
            <button class="goplay" data-play="${t.id}" title="Allenamento su ${esc(t.name)}">${icon('play')}</button>
          </div>`;
        }).join('')}
      </div>`;
  };

  root.innerHTML = `
    <div class="pagehead">
      <h1>Argomenti</h1>
      <span class="sub">mastery per argomento</span>
    </div>
    <p class="dim small" style="margin:-8px 2px 4px">L'anello cresce con accuratezza e ripasso distanziato. Il tasto ▶ genera un allenamento di 5-6 item sempre nuovi.</p>
    ${group('logica')}
    ${group('discreta')}
  `;
  renderMath(root);

  root.querySelectorAll('[data-play]').forEach(b => {
    b.onclick = async () => {
      const { buildTopicSession } = await import('../session.js');
      const ok = buildTopicSession(b.dataset.play);
      if (ok) location.hash = '#/sessione';
      else alert('Nessun esercizio disponibile per questo argomento.');
    };
  });
}
