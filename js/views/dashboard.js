// views/dashboard.js — "Oggi"

import { get, todayStr, daysBetween, streakInfo } from '../storage.js';
import { topicsForDay, START_DATE, TOPIC_BY_ID, COURSES } from '../data/plan.js';
import { renderMath, icon, esc, fmtDateIt } from '../ui.js';

export function renderDashboard(root) {
  const s = get();
  const today = todayStr();
  const day = s.days[today] || { done: 0, total: 0, correct: 0 };
  const streak = streakInfo();
  const daysLeft = Math.max(0, daysBetween(today, s.settings.examDate));
  const idx = Math.max(0, daysBetween(START_DATE, today));
  const { week, review } = topicsForDay(idx);
  const todayTopics = review ? [] : [week.l, week.d];

  const hour = new Date().getHours();
  const saluto = hour < 6 ? 'Notte fonda' : hour < 13 ? 'Buongiorno' : hour < 18 ? 'Buon pomeriggio' : 'Buonasera';
  const nome = s.settings.name ? `, ${esc(s.settings.name)}` : '';

  const done = day.done > 0;
  const active = s.activeSession && s.activeSession.date === today;

  // settimana corrente (7 giorni centrata su oggi)
  const weekStrip = [];
  const base = new Date(today + 'T12:00:00');
  for (let i = -((base.getDay() + 6) % 7); i < 7 - ((base.getDay() + 6) % 7); i++) {
    const d = new Date(base); d.setDate(base.getDate() + i);
    const ds = todayStr(d);
    const dd = s.days[ds];
    weekStrip.push(`
      <div class="weekdot ${ds === today ? 'today' : ''} ${dd && dd.done > 0 ? 'done' : ''}">
        <div class="d">${['L', 'M', 'M', 'G', 'V', 'S', 'D'][(d.getDay() + 6) % 7]}</div>
        <div class="n">${d.getDate()}</div>
      </div>`);
  }

  root.innerHTML = `
    <div class="pagehead">
      <h1>Oggi</h1>
      <span class="sub">${new Date().toLocaleDateString('it-IT', { weekday: 'long', day: 'numeric', month: 'long' })}</span>
    </div>

    <div class="hero">
      <div class="hello">
        <div class="when">${review ? 'giornata di ripasso' : 'settimana ' + (Math.floor(idx / 7) + 1) + ' · ' + esc(week.tema)}</div>
        <h1>${saluto}${nome}.<br><em>${done ? 'Complimenti, hai già studiato oggi.' : active ? 'La sessione ti aspetta.' : 'Si studia oggi?'}</em></h1>
      </div>
      <div class="countwrap">
        <svg class="sketch" viewBox="0 0 120 100" preserveAspectRatio="none">
          <ellipse cx="60" cy="50" rx="55" ry="45"/>
        </svg>
        <div class="num">${daysLeft}</div>
        <div class="lab">giorni<br>all'esame</div>
      </div>
    </div>

    <div class="statstrip">
      <div class="stat"><div class="v"><span class="flame">${icon('flame')}</span>${streak.current}</div><div class="l">streak</div></div>
      <div class="stat"><div class="v">${day.done}<span class="dim small">&nbsp;oggi</span></div><div class="l">esercizi</div></div>
      <div class="stat"><div class="v">${day.total ? Math.round(100 * day.correct / day.total) : '—'}${day.total ? '%' : ''}</div><div class="l">accuratezza</div></div>
    </div>

    ${todayTopics.length ? `
    <h2 class="sect">Argomenti di oggi</h2>
    <div class="topicgrid">
      ${todayTopics.map(tid => { const t = TOPIC_BY_ID[tid]; return `
        <div class="topicrow">
          <div class="tinfo">
            <div class="tname">${esc(t.name)}</div>
            <div class="tmeta">${COURSES[t.course].short}</div>
          </div>
          <a class="goplay" href="#/argomenti/${tid}" title="Allena questo argomento">${icon('play')}</a>
        </div>`; }).join('')}
    </div>` : `
    <h2 class="sect">Ripasso</h2>
    <p class="dim small" style="margin:0 2px 6px">Oggi niente argomenti nuovi: perfetto per recuperare il ripasso in scadenza e fare una simulazione.</p>`}

    <h2 class="sect">La tua sessione</h2>
    <div class="card" style="padding:16px">
      ${active ? `
        <div style="display:flex;align-items:center;gap:14px">
          <div style="flex:1">
            <div style="font-weight:700">Sessione in corso</div>
            <div class="dim small">${s.activeSession.idx + 1} / ${s.activeSession.items.length} · ${s.activeSession.mode === 'exam' ? 'simulazione' : s.activeSession.mode === 'topic' ? 'allenamento' : 'quotidiana'}</div>
          </div>
          <a class="btn" href="#/sessione">Riprendi ${icon('right')}</a>
        </div>` : done ? `
        <div style="display:flex;align-items:center;gap:12px">
          <div style="flex:1"><div style="font-weight:700">Fatto!</div><div class="dim small">Hai completato ${day.done} esercizi oggi. Qualcos'altro?</div></div>
          <a class="btn ghost" href="#/sessione/nuova">Ancora un po' ${icon('right')}</a>
        </div>` : `
        <a class="btn big" href="#/sessione/nuova">${icon('play')} Inizia la sessione · ~${s.settings.minutes} min</a>`}
    </div>

    ${review ? `
    <div class="notice">${icon('info')}
      <div><b>Giornata di ripasso.</b> Ottimo giorno per una <a href="#/compiti">simulazione completa</a> a cronometro.</div>
    </div>` : ''}

    <h2 class="sect">Settimana</h2>
    <div class="weekrow">${weekStrip.join('')}</div>

    <div class="srcline">esame: ${esc(fmtDateIt(s.settings.examDate))} · piano iniziato il ${esc(fmtDateIt(START_DATE))}</div>
  `;
  renderMath(root);
}
