// app.js — bootstrap, routing hash-based, navigazione

import { renderDashboard } from './views/dashboard.js';
import { renderTopics } from './views/topics.js';
import { renderExams } from './views/exams.js';
import { renderStats } from './views/stats.js';
import { renderSettings, applyTheme } from './views/settings.js';
import { renderSession } from './views/session.js';
import { renderLesson } from './views/lesson.js';
import { icon } from './ui.js';
import { get, todayStr } from './storage.js';

const ROUTES = [
  { hash: 'oggi', label: 'Oggi', ic: 'oggi', view: renderDashboard },
  { hash: 'argomenti', label: 'Argomenti', ic: 'argomenti', view: renderTopics },
  { hash: 'compiti', label: 'Compiti', ic: 'compiti', view: renderExams },
  { hash: 'statistiche', label: 'Statistiche', ic: 'stats', view: renderStats },
  { hash: 'impostazioni', label: 'Opzioni', ic: 'impostazioni', view: renderSettings },
];

function nav(active) {
  const links = ROUTES.map(r => `
    <a href="#/${r.hash}" class="navlink ${r.hash === active ? 'active' : ''}">${icon(r.ic)} ${r.label}</a>`).join('');
  const tabs = ROUTES.map(r => `
    <a href="#/${r.hash}" class="${r.hash === active ? 'active' : ''}">${icon(r.ic)}<span>${r.label}</span></a>`).join('');
  return `
    <nav class="sidenav">
      <div class="brand">Quaderno<em>60 giorni</em></div>
      <div class="tag">due esami · un quaderno</div>
      <div class="navlist">${links}</div>
    </nav>
    <nav class="bottomnav">${tabs}</nav>`;
}

function renderApp() {
  const app = document.getElementById('app');
  const raw = location.hash.replace(/^#\/?/, '') || 'oggi';
  const [route, param] = raw.split('/');

  // lezione: lettori a parte
  if (route === 'lezione') {
    app.innerHTML = nav('') + `<main class="main" id="viewroot"></main>`;
    renderLesson(document.getElementById('viewroot'), param);
    return;
  }

  // sessione: gestita a parte (piena schermo)
  if (route === 'sessione') {
    const active = get().activeSession;
    const stale = active && active.mode === 'daily' && active.date !== todayStr();
    if (param === 'nuova' || stale || !active) {
      import('./session.js').then(({ buildDailySession }) => {
        // costruisci solo se non c'è una sessione valida (di oggi o una simulazione in corso)
        const cur = get().activeSession;
        if (!cur || (cur.mode === 'daily' && cur.date !== todayStr())) buildDailySession();
        renderApp();
      });
      return;
    }
    app.innerHTML = nav('') + `<main class="main" id="viewroot"></main>`;
    const root = document.getElementById('viewroot');
    renderSession(root);
    return;
  }

  const r = ROUTES.find(x => x.hash === route) || ROUTES[0];
  document.title = `Quaderno — ${r.label}`;
  app.innerHTML = nav(r.hash) + `<main class="main" id="viewroot"></main>`;
  const root = document.getElementById('viewroot');
  r.view(root, param);
  window.scrollTo({ top: 0 });
}

applyTheme();
matchMedia('(prefers-color-scheme: dark)').addEventListener('change', applyTheme);
window.addEventListener('hashchange', renderApp);

// avvio: se la sincronizzazione è configurata, fonde il cloud prima di disegnare
let booted = false;
function boot() {
  if (booted) return;
  booted = true;
  const start = () => { renderApp(); };
  if (get().settings.syncToken) {
    const timeout = new Promise(res => setTimeout(res, 6000));
    import('./sync.js')
      .then(m => Promise.race([m.syncNow().catch(e => console.warn('sync fallita:', e.message)), timeout]))
      .then(start, start);
  } else start();
}
window.addEventListener('DOMContentLoaded', boot);
if (document.readyState !== 'loading') boot();
