// views/settings.js — data esame, mese di nascita, ritmo, tema, sync, reset

import { get, updateSettings, resetAll } from '../storage.js';
import { renderMath, icon, esc } from '../ui.js';

const MESI = ['gennaio', 'febbraio', 'marzo', 'aprile', 'maggio', 'giugno', 'luglio', 'agosto', 'settembre', 'ottobre', 'novembre', 'dicembre'];

function syncStatusText(st) {
  if (!st.syncToken) return 'Non configurata: genera un token GitHub con solo lo scope “gist” e incollalo qui sotto.';
  const quando = st.syncLast ? new Date(st.syncLast).toLocaleString('it-IT') : 'mai';
  const gist = st.syncGistId ? `gist ${st.syncGistId.slice(0, 8)}…` : 'gist da creare al primo sync';
  return `Token collegato · ${gist} · ultima sincronizzazione: ${quando}. Sync automatico all'avvio e dopo ogni sessione.`;
}

export function renderSettings(root) {
  const s = get();
  const st = s.settings;

  root.innerHTML = `
    <div class="pagehead">
      <h1>Impostazioni</h1>
      <span class="sub">quaderno</span>
    </div>

    <div class="card">
      <div class="setrow">
        <div>
          <div class="sl">Data dell'esame</div>
          <div class="sd">Il countdown del dashboard punta qui</div>
        </div>
        <input type="date" id="examdate" value="${esc(st.examDate)}">
      </div>
      <div class="setrow">
        <div>
          <div class="sl">Mese di nascita (parametro m di Discreta)</div>
          <div class="sd">Molti problemi d'esame dipendono da m: impostalo una volta</div>
        </div>
        <select id="birthm">${MESI.map((m, i) => `<option value="${i + 1}" ${st.birthMonth === i + 1 ? 'selected' : ''}>${m[0].toUpperCase() + m.slice(1)} (${i + 1})</option>`).join('')}</select>
      </div>
      <div class="setrow">
        <div>
          <div class="sl">Minuti al giorno</div>
          <div class="sd">Durata della sessione quotidiana</div>
        </div>
        <input type="number" id="minutes" min="10" max="120" step="5" value="${st.minutes}" style="width:90px">
      </div>
      <div class="setrow">
        <div>
          <div class="sl">Nome (opzionale)</div>
          <div class="sd">Per il saluto sul dashboard</div>
        </div>
        <input type="text" id="uname" value="${esc(st.name)}" placeholder="il tuo nome" style="width:150px;padding:9px 12px;border-radius:10px;border:1.5px solid var(--rule);background:var(--paper);outline:none">
      </div>
      <div class="setrow">
        <div>
          <div class="sl">Tema</div>
          <div class="sd">Carta (chiaro) o studio notturno (scuro)</div>
        </div>
        <div class="seg" id="themeseg">
          <button data-t="auto" class="${st.theme === 'auto' ? 'on' : ''}">Auto</button>
          <button data-t="light" class="${st.theme === 'light' ? 'on' : ''}">Carta</button>
          <button data-t="dark" class="${st.theme === 'dark' ? 'on' : ''}">Notte</button>
        </div>
      </div>
    </div>

    <div class="notice">${icon('info')}
      <div><b>Sincronizzazione GitHub.</b> I progressi vengono salvati in un <b>gist segreto</b> del tuo account: stessa fluidità su telefono e PC. Il token resta solo in questo browser e puoi revocarlo quando vuoi su GitHub.</div>
    </div>

    <div class="card" style="margin-top:14px">
      <div class="setrow" style="flex-direction:column;align-items:stretch">
        <div>
          <div class="sl">Sincronizzazione</div>
          <div class="sd" id="syncstatus">${esc(syncStatusText(st))}</div>
        </div>
        ${st.syncToken ? `
        <div style="margin-top:12px">
          <div class="btnrow">
            <button class="btn big" id="syncbtn">${icon('calendar')} Sincronizza ora</button>
          </div>
          <div class="btnrow" style="margin-top:8px">
            <button class="btn ghost" id="pulldbtn">Solo scarica dal cloud</button>
            <button class="btn ghost" id="unmapbtn" style="color:var(--red)">Rimuovi token</button>
          </div>
        </div>` : `
        <div style="margin-top:12px">
          <p class="dim small" style="margin-bottom:10px">1. Apri
            <a href="https://github.com/settings/tokens/new?scopes=gist&description=Quaderno%20studio" target="_blank" rel="noopener" style="color:var(--blue)">github.com/settings/tokens</a>
            (scope <span class="mono">gist</span> già spuntato) e genera il token &nbsp;·&nbsp;
            2. Incollalo qui:</p>
          <div class="numinput">
            <input type="password" id="synctoken" placeholder="ghp_… o github_pat_…" autocomplete="off" style="font-size:14px">
            <button class="btn" id="tokbtn">Collega</button>
          </div>
        </div>`}
      </div>
    </div>

    <div class="card" style="margin-top:14px">
      <div class="setrow">
        <div>
          <div class="sl" style="color:var(--red)">Azzera tutto</div>
          <div class="sd">Cancella streak, progressi SRS e statistiche. Irreversibile.</div>
        </div>
        <button class="btn danger" id="resetbtn">Azzera</button>
      </div>
    </div>

    <div class="srcline">quaderno · sessioni quotidiane per Logica e Discreta</div>
  `;
  renderMath(root);

  const save = (patch) => { updateSettings(patch); if (patch.theme) applyTheme(); };
  document.getElementById('examdate').onchange = e => save({ examDate: e.target.value });
  document.getElementById('birthm').onchange = e => save({ birthMonth: Number(e.target.value) });
  document.getElementById('minutes').onchange = e => save({ minutes: Math.min(120, Math.max(10, Number(e.target.value) || 30)) });
  document.getElementById('uname').onchange = e => save({ name: e.target.value.trim() });
  document.querySelectorAll('#themeseg button').forEach(b => {
    b.onclick = () => { save({ theme: b.dataset.t }); document.querySelectorAll('#themeseg button').forEach(x => x.classList.toggle('on', x === b)); };
  });
  document.getElementById('resetbtn').onclick = () => {
    if (confirm('Azzerare tutti i progressi? Non si può tornare indietro.')) {
      resetAll(); applyTheme(); location.hash = '#/oggi';
      setTimeout(() => location.reload(), 0);
    }
  };

  // --- sincronizzazione ---
  const refresh = () => renderSettings(document.getElementById('viewroot') || document.querySelector('.main'));
  const importSync = () => import('../sync.js');
  const busy = (btn, on, label) => { btn.disabled = on; btn.innerHTML = on ? '<span class="pulsing">' + label + '…</span>' : label; };
  const report = (msg, ok) => {
    const el = document.getElementById('syncstatus');
    if (el) { el.textContent = msg; el.style.color = ok ? 'var(--green)' : 'var(--red)'; }
  };

  const tokbtn = document.getElementById('tokbtn');
  if (tokbtn) tokbtn.onclick = async () => {
    const t = document.getElementById('synctoken').value.trim();
    if (!t) return;
    updateSettings({ syncToken: t });
    try {
      busy(tokbtn, true, 'Collego');
      await (await importSync()).syncNow();
      report('Collegato e sincronizzato ✓', true);
      setTimeout(refresh, 700);
    } catch (e) {
      updateSettings({ syncToken: '' });
      report('Errore: ' + e.message, false);
      busy(tokbtn, false, 'Collega');
    }
  };

  const syncbtn = document.getElementById('syncbtn');
  if (syncbtn) syncbtn.onclick = async () => {
    try {
      busy(syncbtn, true, 'Sincronizzo');
      await (await importSync()).syncNow();
      report('Sincronizzato ✓', true);
      setTimeout(refresh, 700);
    } catch (e) { report('Errore: ' + e.message, false); busy(syncbtn, false, 'Sincronizza ora'); }
  };

  const pulldbtn = document.getElementById('pulldbtn');
  if (pulldbtn) pulldbtn.onclick = async () => {
    try {
      busy(pulldbtn, true, 'Scarico');
      await (await importSync()).syncDown();
      report('Scaricato dal cloud ✓', true);
      setTimeout(refresh, 700);
    } catch (e) { report('Errore: ' + e.message, false); busy(pulldbtn, false, 'Solo scarica dal cloud'); }
  };

  const unmapbtn = document.getElementById('unmapbtn');
  if (unmapbtn) unmapbtn.onclick = () => {
    updateSettings({ syncToken: '', syncGistId: '', syncLast: '' });
    refresh();
  };
}

export function applyTheme() {
  const st = get().settings;
  const dark = st.theme === 'dark' || (st.theme === 'auto' && matchMedia('(prefers-color-scheme: dark)').matches);
  document.documentElement.dataset.theme = dark ? 'dark' : 'light';
  document.querySelector('meta[name=theme-color]').content = dark ? '#14171F' : '#F6F1E7';
}
