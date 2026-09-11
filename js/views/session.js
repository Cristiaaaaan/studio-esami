// views/session.js — esecuzione della sessione (daily / topic / exam)

import { get, todayStr, logAnswer, clearActiveSession, setActiveSession, addSimResult } from '../storage.js';
import { grade } from '../srs.js';
import { gradeFor } from '../session.js';
import { renderMath, icon, penMark, esc } from '../ui.js';
import { COURSES, TOPIC_BY_ID } from '../data/plan.js';

const LETTERE = ['A', 'B', 'C', 'D', 'E'];

export function renderSession(root) {
  const sess = get().activeSession;
  if (!sess) { location.hash = '#/oggi'; return; }

  root.innerHTML = `
    <div class="sessbar">
      <button class="back" id="backbtn" title="Torna indietro">${icon('back')}</button>
      <div class="meta">
        <div class="t">${sess.mode === 'exam' ? `Simulazione · ${esc(sess.examLabel || '')}` : sess.mode === 'topic' ? 'Allenamento' : 'Sessione di oggi'}</div>
        <div class="dots" id="dots"></div>
      </div>
      ${sess.mode === 'exam' ? `<div class="timer" id="timer">0:00</div>` : ''}
    </div>
    <div id="qmount"></div>
  `;
  document.getElementById('backbtn').onclick = () => { location.hash = sess.mode === 'exam' ? '#/compiti' : '#/oggi'; };

  if (sess.mode === 'exam') {
    const t = document.getElementById('timer');
    const tick = () => {
      const s = Math.floor((Date.now() - sess.startedAt) / 1000);
      t.textContent = `${Math.floor(s / 60)}:${String(s % 60).padStart(2, '0')}`;
    };
    tick(); setInterval(tick, 1000);
  }

  paintDots();
  if (sess.idx >= sess.items.length) finishSession(root);
  else paintItem(root);
}

function paintDots() {
  const sess = get().activeSession;
  const d = document.getElementById('dots');
  d.innerHTML = sess.items.map((it, i) => {
    const r = sess.results[i];
    const cls = r ? (r.correct ? 'ok' : 'no') : (i === sess.idx ? 'now' : '');
    return `<div class="dot ${cls}"></div>`;
  }).join('');
}

function paintItem(root) {
  const sess = get().activeSession;
  const it = sess.items[sess.idx];
  const t0 = Date.now();
  const topic = TOPIC_BY_ID[it.topicId];
  const mount = document.getElementById('qmount');

  mount.innerHTML = `
    <div class="card sheet taped qcard">
      <div class="qhead">
        <span class="chip ${it.course}">${COURSES[it.course].short}</span>
        <span class="chip">${esc(topic ? topic.name : '')}</span>
        ${it.points ? `<span class="chip">${it.points} punti</span>` : ''}
        <span class="src">${esc(it.source || '')}</span>
      </div>
      <div class="prompt">${it.prompt}</div>
      <div id="ansarea"></div>
    </div>
    <div class="srcline">esercizio ${sess.idx + 1} di ${sess.items.length} · ~${Math.round(it.estSec / 60) || 1} min</div>
  `;
  renderMath(mount);

  const area = document.getElementById('ansarea');

  if (it.kind === 'flash') renderFlash(area, it, t0);
  else if (it.kind === 'mc' || it.kind === 'tf') renderChoices(area, it, t0);
  else if (it.kind === 'numeric') renderNumeric(area, it, t0);
  else renderOpen(area, it, t0);
}

/* ---------- flashcard ---------- */

function renderFlash(area, it, t0) {
  area.innerHTML = `
    <div class="flash" id="flashcard">
      <div class="fside" id="fside">Domanda</div>
      <div class="fterm">${it.prompt}</div>
      <div class="fhint">tocca la card per vedere la risposta</div>
    </div>
    <div id="selfarea"></div>
  `;
  renderMath(area);
  const card = document.getElementById('flashcard');
  card.onclick = () => {
    card.classList.add('flipped');
    document.getElementById('fside').textContent = 'Risposta';
    document.querySelector('#flashcard .fterm').innerHTML = it.solution[0];
    document.getElementById('selfarea').replaceChildren(
      selfButtons('La sapevo', 'Ripassala', (g) => {
        record(it, g === 2, null, (Date.now() - t0) / 1000, g);
      })
    );
    renderMath(card);
  };
}

/* ---------- scelta multipla / vero-falso ---------- */

function renderChoices(area, it, t0) {
  area.innerHTML = `<div class="choices" id="choices"></div><div id="after"></div>`;
  const box = document.getElementById('choices');
  box.innerHTML = it.choices.map((c, i) => `
    <button class="choice" data-i="${i}">
      <span class="letter">${LETTERE[i]}</span>
      <span class="ct">${c.tex || esc(c.text || '')}</span>
      ${penMark(i === it.answer)}
    </button>
  `).join('');
  renderMath(box);

  box.querySelectorAll('.choice').forEach(btn => {
    btn.onclick = () => {
      const i = Number(btn.dataset.i);
      const correct = i === it.answer;
      box.querySelectorAll('.choice').forEach(b => {
        b.disabled = true;
        const bi = Number(b.dataset.i);
        if (bi === it.answer) b.classList.add('correct');
        else if (bi === i) b.classList.add('wrong');
        else b.classList.add('dimmed');
      });
      showSolution(document.getElementById('after'), it);
      showVerdict(document.getElementById('after'), correct);
      record(it, correct, null, (Date.now() - t0) / 1000, correct ? 2 : 0);
    };
  });
}

/* ---------- input numerico ---------- */

function renderNumeric(area, it, t0) {
  area.innerHTML = `
    <div class="numinput">
      <input type="text" id="numin" inputmode="${String(it.answer).match(/^-?\d+$/) ? 'numeric' : 'text'}" placeholder="risposta…" autocomplete="off">
      <button class="btn" id="numok">Conferma</button>
    </div>
    <div id="after"></div>
  `;
  const inp = document.getElementById('numin');
  inp.focus();
  const check = () => {
    const norm = (x) => String(x).trim().toLowerCase().replace(',', '.').replace(/\s+/g, '');
    const given = norm(inp.value);
    if (!given) return;
    const ok = given === norm(it.answer) || (it.accept || []).some(a => given === norm(a));
    inp.disabled = true;
    document.getElementById('numok').disabled = true;
    inp.classList.add(ok ? 'ok' : 'no');
    const after = document.getElementById('after');
    showSolution(after, it);
    showVerdict(after, ok, `Risposta esatta: <b>${esc(it.answer)}</b>`);
    record(it, ok, null, (Date.now() - t0) / 1000, ok ? 2 : 0);
  };
  document.getElementById('numok').onclick = check;
  inp.onkeydown = (e) => { if (e.key === 'Enter') check(); };
}

/* ---------- esercizio aperto (stile esame) ---------- */

function renderOpen(area, it, t0) {
  area.innerHTML = `
    <div class="btnrow" style="margin-top:18px">
      <button class="btn ghost big" id="showsol">Mostra la soluzione ${icon('right')}</button>
    </div>
    <div id="after"></div>
  `;
  document.getElementById('showsol').onclick = () => {
    const after = document.getElementById('after');
    showSolution(after, it);
    after.insertAdjacentHTML('beforeend', `
      <div class="selfgrade">
        <div class="lab">Quanto ti sei meritato? (autovalutazione onesta)</div>
        <div class="opts">
          <button class="opt p0" data-p="0">0 — niente</button>
          <button class="opt p3" data-p="${Math.ceil((it.points || 6) / 2)}">≈ metà</button>
          <button class="opt p6" data-p="${it.points || 6}">Tutto — ${it.points || 6}/${it.points || 6}</button>
        </div>
      </div>
    `);
    document.getElementById('showsol').disabled = true;
    after.querySelectorAll('.opt').forEach(b => {
      b.onclick = () => {
        const p = Number(b.dataset.p);
        after.querySelectorAll('.opt').forEach(x => x.disabled = true);
        b.style.borderColor = 'var(--blue)';
        after.insertAdjacentHTML('beforeend', `<div class="verdict ${p > 0 ? 'ok' : 'no'}">${p >= (it.points || 6) ? icon('check') : icon('info')} <span>Registrato: ${p} / ${it.points || 6} punti</span></div>`);
        record(it, p >= (it.points || 6), p, (Date.now() - t0) / 1000, gradeFor(it, false, p));
      };
    });
  };
}

/* ---------- comuni ---------- */

function showSolution(container, it) {
  container.insertAdjacentHTML('beforeend', `
    <div class="solution">
      <div class="solhead">Soluzione</div>
      <ol class="steps">${it.solution.map((s, i) => `<li data-n="${i + 1}">${s}</li>`).join('')}</ol>
    </div>
  `);
  renderMath(container);
}

function showVerdict(container, ok, extra) {
  container.insertAdjacentHTML('beforeend', `
    <div class="verdict ${ok ? 'ok' : 'no'}">${ok ? icon('check') : icon('x')}
      <span>${ok ? 'Corretto!' : 'Sbagliato.'}${extra ? ' ' + extra : ''}</span></div>
    <div class="btnrow" style="margin-top:16px">
      <button class="btn big" id="nextbtn">${'Avanti'} ${icon('right')}</button>
    </div>
  `);
  document.getElementById('nextbtn').onclick = advance;
}

function selfButtons(yes, no, cb) {
  const wrap = document.createElement('div');
  wrap.className = 'selfgrade';
  wrap.innerHTML = `
    <div class="lab">Com'è andata?</div>
    <div class="opts">
      <button class="opt p6" data-g="2">${yes}</button>
      <button class="opt p0" data-g="0">${no}</button>
    </div>`;
  wrap.querySelectorAll('.opt').forEach(b => {
    b.onclick = () => {
      wrap.querySelectorAll('.opt').forEach(x => x.disabled = true);
      cb(Number(b.dataset.g));
      const nx = document.createElement('div');
      wrap.appendChild(nx);
      nextButton(nx);
    };
  });
  return wrap;
}

function nextButton(container) {
  container.insertAdjacentHTML('beforeend', `
    <div class="btnrow" style="margin-top:14px">
      <button class="btn big">${'Avanti'} ${icon('right')}</button>
    </div>`);
  container.querySelector('.btn').onclick = advance;
}

function record(it, correct, points, sec, g) {
  const sess = get().activeSession;
  sess.results[sess.idx] = { uid: it.uid, correct, points, sec };
  if (it.srsId) grade(it.srsId, g);
  logAnswer({ itemId: it.srsId || it.uid, topicId: it.topicId, course: it.course, kind: it.kind, correct, sec });
  setActiveSession(sess);
  // aggiorna barra
  paintDots();
  // aggiunge il pulsante Avanti se non ancora presente (mc/numeric lo hanno già)
  if (it.kind === 'mc' || it.kind === 'tf' || it.kind === 'numeric') return;
}

function advance() {
  const sess = get().activeSession;
  sess.idx++;
  setActiveSession(sess);
  if (sess.idx >= sess.items.length) finishSession(document.getElementById('app'));
  else paintItem(document.getElementById('app'));
  window.scrollTo({ top: 0 });
}

function finishSession(root) {
  const sess = get().activeSession;
  const total = sess.items.length;
  const answered = sess.results.filter(Boolean).length;
  const correct = sess.results.filter(r => r && r.correct).length;
  const secs = Math.round((Date.now() - sess.startedAt) / 1000);
  const acc = answered ? Math.round(100 * correct / answered) : 0;

  if (sess.mode === 'exam') {
    const pts = sess.results.reduce((s, r) => s + (r && r.points ? r.points : 0), 0);
    const max = sess.items.reduce((s, it) => s + (it.points || 6), 0);
    addSimResult({ d: todayStr(), course: sess.course, label: sess.examLabel, score: pts, max, secs });
    clearActiveSession();
    renderEnd(root, {
      title: pts >= max * 0.6 ? 'Buon compito!' : 'Compito registrato',
      mark: pts >= max * 0.6 ? 'ok' : 'mid',
      stats: [
        [`<b>${pts}</b>`, `su ${max} punti`],
        [`${acc}%`, 'risposte pienamente corrette'],
        [`${Math.floor(secs / 60)} min`, 'tempo impiegato'],
      ],
      note: pts >= max * 0.6 ? 'Sei sopra la sufficienza: continua così.' : 'Rivedi gli esercizi sbagliati nella sezione Argomenti.',
      back: '#/compiti', backLabel: 'Torna ai compiti',
    });
    return;
  }

  clearActiveSession();
  renderEnd(root, {
    title: acc >= 70 ? 'Ottima sessione!' : acc >= 40 ? 'Sessione completata' : 'Sessione completata',
    mark: acc >= 70 ? 'ok' : 'mid',
    stats: [
      [`${acc}%`, 'accuratezza'],
      [`${correct}<span class="dim">/${answered}</span>`, 'corrette'],
      [`${Math.floor(secs / 60)} min`, 'tempo'],
    ],
    note: acc >= 70 ? 'Il ritmo è quello giusto: a domani.' : 'Gli errori di oggi tornano tra pochi giorni nel ripasso.',
    back: '#/oggi', backLabel: 'Torna a Oggi',
  });
}

function renderEnd(root, { title, mark, stats, note, back, backLabel }) {
  root.innerHTML = `
    <div class="main">
      <div class="card endscreen">
        <div class="bigmark ${mark}">${mark === 'ok' ? icon('check') : icon('calendar')}</div>
        <h2>${title}</h2>
        <div class="endscore">${stats.map(([v, l]) => `<div class="s"><div class="sv">${v}</div><div class="sl">${l}</div></div>`).join('')}</div>
        <p class="dim">${note}</p>
        <div class="btnrow" style="margin-top:22px">
          <a class="btn big" href="${back}">${backLabel}</a>
        </div>
      </div>
    </div>`;
  renderMath(root);
}
