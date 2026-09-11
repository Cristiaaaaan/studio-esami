// views/settings.js — data esame, mese di nascita, ritmo, tema, reset

import { get, updateSettings, resetAll } from '../storage.js';
import { renderMath, icon, esc } from '../ui.js';

const MESI = ['gennaio', 'febbraio', 'marzo', 'aprile', 'maggio', 'giugno', 'luglio', 'agosto', 'settembre', 'ottobre', 'novembre', 'dicembre'];

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
      <div><b>Progressi locali.</b> I dati (streak, SRS, statistiche) vivono in questo browser: su telefono e PC restano indipendenti. Non c'è un server: è tutto nel quaderno.</div>
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
}

export function applyTheme() {
  const st = get().settings;
  const dark = st.theme === 'dark' || (st.theme === 'auto' && matchMedia('(prefers-color-scheme: dark)').matches);
  document.documentElement.dataset.theme = dark ? 'dark' : 'light';
  document.querySelector('meta[name=theme-color]').content = dark ? '#14171F' : '#F6F1E7';
}
