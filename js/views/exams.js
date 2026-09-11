// views/exams.js — archivio compiti veri + simulazione cronometrata

import { EXAMS_LOGICA, EXAMS_DISCRETA, ALL_EXAMS } from '../data/bank.js';
import { renderMath, icon, esc, fmtDateIt } from '../ui.js';
import { COURSES } from '../data/plan.js';

export function renderExams(root, param) {
  if (param) return renderExamDetail(root, param);

  const list = (exams, courseId) => `
    <h2 class="sect">${esc(COURSES[courseId].name)}</h2>
    <div class="stack">
      ${exams.map(e => `
        <div class="examrow">
          <div style="flex:1;min-width:0">
            <div class="ename">${esc(e.label)}</div>
            <div class="edate">${esc(fmtDateIt(e.date))} · ${e.items.length} esercizi trascritti</div>
          </div>
          <a class="go" href="#/compiti/${e.id}" title="Apri">${icon('right')}</a>
        </div>`).join('')}
    </div>`;

  root.innerHTML = `
    <div class="pagehead">
      <h1>Compiti</h1>
      <span class="sub">esami realmente assegnati</span>
    </div>
    <p class="dim small" style="margin:-8px 2px 4px">Apri un compito per studiare gli esercizi con la soluzione guidata, oppure avvia la <b>simulazione</b>: cronometro acceso, soluzione nascosta, autovalutazione in punti come all'esame.</p>
    ${list(EXAMS_LOGICA, 'logica')}
    ${list(EXAMS_DISCRETA, 'discreta')}
    <div class="notice">${icon('info')}
      <div>Logica: 5 esercizi × 6 punti, sufficienza a 18. Discreta: 8 problemi × 4 punti, senza orale — nelle simulazioni gli esercizi trascritti sono quelli rappresentativi.</div>
    </div>
  `;
  renderMath(root);
}

function renderExamDetail(root, examId) {
  const ex = ALL_EXAMS.find(e => e.id === examId);
  if (!ex) { location.hash = '#/compiti'; return; }

  root.innerHTML = `
    <div class="pagehead">
      <h1 style="font-size:24px">${esc(ex.label)}</h1>
      <span class="sub">${esc(COURSES[ex.course].short)}</span>
    </div>
    <p class="dim small" style="margin:-8px 2px 10px">${esc(fmtDateIt(ex.date))} · ${esc(ex.group || '')}</p>
    <div class="btnrow" style="margin-bottom:18px">
      <a class="btn" href="#/sessione" id="simbtn">${icon('clock')} Simula questo compito</a>
    </div>
    <div class="stack exview">
      ${ex.items.map(it => `
        <details class="ex sheet">
          <summary>
            <span class="chip ${it.course}">${it.points} pt</span>
            <span style="flex:1">${esc(it.source.replace(/ · E[s].*$/, ''))}</span>
            <span class="pts">vedi soluzione</span>
          </summary>
          <div class="exbody">
            <div class="prompt">${it.prompt}</div>
            <div class="solution" style="margin-top:12px">
              <div class="solhead">Soluzione</div>
              <ol class="steps">${it.solution.map((s, i) => `<li data-n="${i + 1}">${s}</li>`).join('')}</ol>
            </div>
          </div>
        </details>`).join('')}
    </div>
  `;
  renderMath(root);

  document.getElementById('simbtn').onclick = async (ev) => {
    ev.preventDefault();
    const { buildExamSession } = await import('../session.js');
    if (buildExamSession(examId)) location.hash = '#/sessione';
  };
}
