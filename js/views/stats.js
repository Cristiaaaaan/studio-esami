// views/stats.js — heatmap, accuratezza per argomento, totali

import { get, todayStr, streakInfo } from '../storage.js';
import { TOPICS, TOPIC_BY_ID, COURSES } from '../data/plan.js';
import { renderMath, icon, esc } from '../ui.js';

export function renderStats(root) {
  const s = get();
  const streak = streakInfo();
  const days = s.days;

  // heatmap: ultime 12 settimane (colonne = settimane, righe = lun-dom)
  const today = new Date(todayStr() + 'T12:00:00');
  const end = new Date(today);
  end.setDate(today.getDate() + (7 - ((today.getDay() + 6) % 7) - 1)); // domenica di questa settimana
  const cols = [];
  for (let w = 11; w >= 0; w--) {
    const col = [];
    for (let d = 0; d < 7; d++) {
      const dt = new Date(end);
      dt.setDate(end.getDate() - w * 7 - (6 - d));
      const ds = todayStr(dt);
      const dd = days[ds];
      const lvl = !dd || !dd.done ? 0 : dd.done >= 12 ? 3 : dd.done >= 7 ? 2 : 1;
      col.push(`<div class="cell l${lvl}" title="${ds}: ${dd ? dd.done : 0} esercizi"></div>`);
    }
    cols.push(`<div class="col">${col.join('')}</div>`);
  }

  const totals = s.history.reduce((acc, h) => {
    acc.n++; if (h.correct) acc.ok++;
    acc.sec += h.sec || 0;
    return acc;
  }, { n: 0, ok: 0, sec: 0 });

  const sims = s.simResults;
  const topicBars = TOPICS.map(t => {
    const st = s.topicStats[t.id];
    if (!st) return null;
    const acc = Math.round(100 * st.correct / st.seen);
    return `
      <div class="bar-row">
        <div class="bl">${esc(t.name)} <span class="dim mono" style="font-size:10px">${COURSES[t.course].short}</span></div>
        <div class="track"><div class="fill" style="width:${acc}%; background:${acc >= 70 ? 'var(--green)' : acc >= 40 ? 'var(--blue)' : 'var(--amber)'}"></div></div>
        <div class="bv">${acc}% · ${st.seen}</div>
      </div>`;
  }).filter(Boolean).join('');

  root.innerHTML = `
    <div class="pagehead">
      <h1>Statistiche</h1>
      <span class="sub">i tuoi progressi</span>
    </div>

    <div class="statstrip" style="margin-top:0">
      <div class="stat"><div class="v">${totals.n}</div><div class="l">esercizi totali</div></div>
      <div class="stat"><div class="v">${totals.n ? Math.round(100 * totals.ok / totals.n) : '—'}${totals.n ? '%' : ''}</div><div class="l">accuratezza</div></div>
      <div class="stat"><div class="v">${Math.floor(totals.sec / 3600)}h ${Math.floor((totals.sec % 3600) / 60)}m</div><div class="l">tempo studiato</div></div>
    </div>

    <h2 class="sect">Ultimi 3 mesi</h2>
    <div class="card" style="padding:14px">
      <div class="heatwrap"><div class="heatmap">${cols.join('')}</div></div>
      <div class="dim small" style="margin-top:8px">streak attuale: <b>${streak.current}</b> giorni · record: <b>${streak.best}</b></div>
    </div>

    <h2 class="sect">Accuratezza per argomento</h2>
    ${topicBars ? `<div class="card" style="padding:14px 18px">${topicBars}</div>` : '<p class="dim small" style="margin:4px 2px">Ancora nessun dato: fai la prima sessione.</p>'}

    ${sims.length ? `
    <h2 class="sect">Simulazioni</h2>
    <div class="stack">
      ${sims.slice(-6).reverse().map(r => `
        <div class="examrow">
          <div style="flex:1">
            <div class="ename">${esc(r.label || 'simulazione')} <span class="chip ${r.course}" style="margin-left:6px">${COURSES[r.course].short}</span></div>
            <div class="edate">${esc(r.d)} · ${Math.round(r.secs / 60)} min</div>
          </div>
          <div style="font-family:var(--font-display);font-weight:800;font-size:20px;${r.score >= r.max * 0.6 ? 'color:var(--green)' : 'color:var(--amber)'}">${r.score}<span class="dim" style="font-size:13px">/${r.max}</span></div>
        </div>`).join('')}
    </div>` : ''}
  `;
  renderMath(root);
}
