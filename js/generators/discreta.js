// generators/discreta.js — esercizi infiniti di Matematica Discreta
// Le soluzioni sono calcolate (Euclide, BFS, iterazione delle ricorrenze).

import { rint, pick, shuffle } from '../ui.js';
import { gcd, extGcd, modInverse, modPow, makeRecurrence } from './mathutil.js';

const T = (s) => `\\( ${s} \\)`;

/* ================================================================
   1. FUNZIONI — controimmagini di funzioni definite a tratti
   ================================================================ */

function genFunzioni() {
  const k = rint(-3, 3);          // ramo pari: f(n) = n/2 + k
  const t = pick([0, 1, 2]);      // ramo dispari: f(n) = 3n - t
  const f = (n) => (n % 2 === 0) ? (n / 2 + k) : (3 * n - t);

  // scegli un valore nell'immagine con 1 o 2 controimmagini (n <= 40)
  const map = new Map();
  for (let n = 0; n <= 40; n++) {
    const v = f(n);
    if (!map.has(v)) map.set(v, []);
    map.get(v).push(n);
  }
  const targets = [...map.entries()].filter(([v, ns]) => ns.length <= 2 && v >= -4 && v <= 25);
  if (!targets.length) return genFunzioni();
  const [v, ns] = pick(targets);

  const setTex = (arr) => `\\{${arr.join(',\\; ')}\\}`;
  const distrSets = new Set([ns.join(',')]);
  const pool = [
    ns.slice(0, -1),
    ns.slice(1),
    [...ns, ns[ns.length - 1] + 2],
    ns.map(x => x + 1),
    [ns[0] * 2],
  ];
  const opts = [];
  for (const p of shuffle(pool)) {
    const key = p.join(',');
    if (!distrSets.has(key) && p.length) { distrSets.add(key); opts.push(p); }
    if (opts.length === 3) break;
  }
  while (opts.length < 3) opts.push([ns[0] + 10 + opts.length]);
  const answer = rint(0, 3);
  const options = [...opts];
  options.splice(answer, 0, ns);

  const table = Array.from({ length: 10 }, (_, n) => `${n} \\mapsto ${f(n)}`).join(',\\; ');
  const evenSol = (v - k);
  const oddSol = (v + t);
  const evenN = (Number.isInteger(evenSol) && evenSol >= 0 && evenSol % 2 === 0) ? evenSol : null;
  const oddN = (Number.isInteger(oddSol) && oddSol >= 0 && oddSol % 2 === 1) ? oddSol : null;

  return {
    kind: 'mc', topicId: 'D-funzioni', course: 'discreta',
    prompt: `Sia \\( f: \\mathbb{N} \\to \\mathbb{Z} \\) definita da
      \\[ f(n) = \\begin{cases} \\dfrac{n}{2} ${k >= 0 ? '+' : '-'} ${Math.abs(k)} & \\text{se } n \\text{ pari} \\\\[4pt] 3n ${t >= 0 ? '-' : '+'} ${Math.abs(t)} & \\text{se } n \\text{ dispari} \\end{cases} \\]
      Determinare la controimmagine \\( f^{-1}(\\{${v}\\}) \\).`,
    choices: options.map(s => ({ tex: T(setTex(s)) })),
    answer,
    solution: [
      `**Primi valori.** \\( ${table},\\; \\ldots \\)`,
      `**Ramo pari.** Serve \\( \\frac{n}{2} ${k >= 0 ? '+' : '-'} ${Math.abs(k)} = ${v} \\), cioè \\( n = 2(${v} ${k >= 0 ? '-' : '+'} ${Math.abs(k)}) = ${evenSol} \\): ${evenN !== null ? `pari e non negativo, quindi \\( n = ${evenN} \\) va bene` : 'non è un naturale pari, quindi nessuna soluzione dal ramo pari'}.`,
      `**Ramo dispari.** Serve \\( 3n ${t >= 0 ? '-' : '+'} ${Math.abs(t)} = ${v} \\), cioè \\( n = \\frac{${v} ${t >= 0 ? '+' : '-'} ${t === 0 ? 0 : Math.abs(t)}}{3} = ${oddSol % 1 === 0 ? oddSol : oddSol.toFixed(2)} \\): ${oddN !== null ? `dispari e non negativo, quindi \\( n = ${oddN} \\) va bene` : 'non è un naturale dispari, quindi nessuna soluzione dal ramo dispari'}.`,
      `**Conclusione.** \\( f^{-1}(\\{${v}\\}) = ${setTex(ns)} \\)`,
    ],
    estSec: 130, source: 'generatore · funzioni',
  };
}

/* ================================================================
   2. RELAZIONI — proprietà su P([n])
   ================================================================ */

const REL_POOL = [
  {
    def: 'A \\,R\\, B \\iff \\min(A) \\le \\min(B)',
    correct: 1,
    analisi: [
      `**Riflessiva ✓** — \\( \\min(A) \\le \\min(A) \\) sempre.`,
      `**Antisimmetrica ✗** — Con \\( A = \\{1\\} \\) e \\( B = \\{1, 2\\} \\): \\( \\min A = \\min B = 1 \\), quindi \\( A R B \\) e \\( B R A \\) ma \\( A \\ne B \\).`,
      `**Transitiva ✓** — da \\( \\min A \\le \\min B \\) e \\( \\min B \\le \\min C \\) segue \\( \\min A \\le \\min C \\) per transitività di \\( \\le \\).`,
      `**Conclusione** — riflessiva e transitiva ma non antisimmetrica: è un **preordine**, non un ordine parziale.`,
    ],
  },
  {
    def: 'A \\,R\\, B \\iff A \\subseteq B',
    correct: 0,
    analisi: [
      `**Riflessiva ✓** — \\( A \\subseteq A \\).`,
      `**Antisimmetrica ✓** — se \\( A \\subseteq B \\) e \\( B \\subseteq A \\) allora \\( A = B \\).`,
      `**Transitiva ✓** — l'inclusione è transitiva.`,
      `**Totale? ✗** — \\( \\{1\\} \\) e \\( \\{2\\} \\) sono incomparabili: è un **ordine parziale** (non totale).`,
    ],
  },
  {
    def: 'A \\,R\\, B \\iff A \\cap B = \\varnothing',
    correct: 3,
    analisi: [
      `**Riflessiva ✗** — \\( A \\cap A = A \\ne \\varnothing \\) (gli insiemi del potenza sono non vuoti): \\( A \\not R A \\).`,
      `**Simmetrica ✓** — \\( A \\cap B = B \\cap A \\).`,
      `**Transitiva ✗** — esempio su \\( [8] \\): \\( A = \\{1\\} \\), \\( B = \\{2\\} \\), \\( C = \\{1, 3\\} \\): \\( A R B \\) e \\( B R C \\) ma \\( A \\cap C = \\{1\\} \\ne \\varnothing \\).`,
    ],
  },
  {
    def: 'A \\,R\\, B \\iff |A| = |B|',
    correct: 2,
    analisi: [
      `**Riflessiva ✓** — \\( |A| = |A| \\).`,
      `**Simmetrica ✓** e **transitiva ✓** — l'uguaglianza di cardinalità è una relazione di equivalenza.`,
      `**Antisimmetrica ✗** — \\( |\\{1\\}| = |\\{2\\}| \\) ma \\( \\{1\\} \\ne \\{2\\} \\).`,
      `**Conclusione** — è una **relazione di equivalenza** (classi = sottoinsiemi della stessa cardinalità).`,
    ],
  },
  {
    def: 'A \\,R\\, B \\iff \\max(A) \\le \\max(B)',
    correct: 1,
    analisi: [
      `**Riflessiva ✓** — \\( \\max A \\le \\max A \\).`,
      `**Antisimmetrica ✗** — \\( A = \\{1, 5\\} \\), \\( B = \\{5, 7\\} \\): entrambi i massimi valgono 5, quindi \\( A R B \\) e \\( B R A \\) con \\( A \\ne B \\).`,
      `**Transitiva ✓** — per transitività di \\( \\le \\) sui massimi.`,
      `**Conclusione** — preordine, non ordine parziale.`,
    ],
  },
  {
    def: 'A \\,R\\, B \\iff \\min(A) < \\min(B) \\;\\lor\\; A = B',
    correct: 0,
    analisi: [
      `**Riflessiva ✓** — per la clausola \\( A = A \\).`,
      `**Antisimmetrica ✓** — se \\( A R B \\) con \\( A \\ne B \\) allora \\( \\min A < \\min B \\), quindi non può valere anche \\( \\min B < \\min A \\).`,
      `**Transitiva ✓** — casi: se \\( A = B \\) o \\( B = C \\) banale; se \\( \\min A < \\min B < \\min C \\) allora \\( \\min A < \\min C \\).`,
      `**Conclusione** — **ordine parziale** (non totale: \\( \\{1\\} \\) e \\( \\{1,2\\} \\)? \\( \\min \\) uguali, \\( A \\ne B \\), nessuna delle due in relazione).`,
    ],
  },
];

function genRelazioni() {
  const rel = pick(REL_POOL);
  const n = pick([6, 8]);
  const stmts = [
    'è un ordine parziale, ma non un ordine totale',
    'è riflessiva e transitiva, ma non antisimmetrica',
    'è una relazione di equivalenza',
    'non è riflessiva',
  ];
  const answer = rint(0, 3);
  // opzioni: la corretta in posizione `answer`, le altre tre distinte
  const opts = [];
  const used = new Set([rel.correct]);
  for (let i = 0; i < 4; i++) {
    if (i === answer) opts.push(stmts[rel.correct]);
    else { let j = 0; while (used.has(j)) j++; used.add(j); opts.push(stmts[j]); }
  }
  return {
    kind: 'mc', topicId: 'D-relazioni', course: 'discreta',
    prompt: `Sull'insieme \\( \\mathcal{P}([${n}]) \\setminus \\{\\varnothing\\} \\) si considera la relazione \\[ ${rel.def} \\] Quale affermazione è corretta?`,
    choices: opts.map(s => ({ text: s[0].toUpperCase() + s.slice(1) })),
    answer,
    solution: rel.analisi,
    estSec: 140, source: 'generatore · relazioni',
  };
}

/* ================================================================
   3. ARITMETICA MODULARE — inversa moltiplicativa
   ================================================================ */

function genModulare() {
  const n = pick([77, 91, 100, 119, 143, 153, 187, 203, 221, 247, 85, 51, 57, 87, 145]);
  const exists = Math.random() < 0.75;
  let a;
  if (exists) {
    do { a = rint(3, n - 2); } while (gcd(a, n) !== 1);
  } else {
    // forza un divisore comune
    const p = smallestFactor(n);
    a = p * rint(1, Math.floor(n / p) - 1);
    if (a >= n || gcd(a, n) === 1) return genModulare();
  }
  const inv = modInverse(a, n);
  const { steps } = extGcd(a, n);

  const euclidTex = steps.map(s => `${s.a} = ${s.q} \\cdot ${s.b} + ${s.a % s.b}`).join(' \\\\ ');
  let sol;
  if (exists) {
    const { x } = extGcd(a, n);
    const xin = ((x % n) + n) % n;
    sol = [
      `**Esistenza.** L'inversa esiste se e solo se \\( \\gcd(${a}, ${n}) = 1 \\). Euclide: \\[ \\begin{array}{l} ${euclidTex} \\end{array} \\] quindi \\( \\gcd = 1 \\): l'inversa esiste.`,
      `**Euclide esteso.** Risalendo: \\( ${a} \\cdot (${x}) + ${n} \\cdot y = 1 \\), da cui \\( ${a} \\cdot (${x}) \\equiv 1 \\pmod{${n}} \\).`,
      `**Riduzione.** In \\( [0, ${n}) \\): \\( x = ${xin} \\).`,
      `**Verifica.** \\( ${a} \\cdot ${xin} = ${a * xin} = ${n} \\cdot ${Math.floor((a * xin) / n)} + ${(a * xin) % n} \\Rightarrow [${a} \\cdot ${xin}]_{${n}} = [1]_{${n}} \\) ✓`,
    ];
  } else {
    sol = [
      `**Esistenza.** Serve \\( \\gcd(${a}, ${n}) = 1 \\). Euclide: \\[ \\begin{array}{l} ${euclidTex} \\end{array} \\]`,
      `**Conclusione.** \\( \\gcd(${a}, ${n}) = ${gcd(a, n)} \\ne 1 \\): **l'inversa non esiste**. (Se \\( [a]_n \\cdot [x]_n = [1]_n \\), allora \\( \\gcd(a,n) \\mid 1 \\).)`,
      `**Osservazione.** \\( ${n} = ${factors(n)} \\) e \\( ${a} \\) è divisibile per \\( ${smallestFactor(n)} \\): le classi non coprime con \\( n \\) non sono invertibili.`,
    ];
  }

  if (exists) {
    return {
      kind: 'numeric', topicId: 'D-modulare', course: 'discreta',
      prompt: `Calcolare, se esiste, l'inversa moltiplicativa di \\( [${a}]_{${n}} \\) (rispondere con \\( x \\in [0, ${n}) \\), oppure -1 se non esiste).`,
      answer: String(inv),
      accept: [String(inv)],
      solution: sol,
      estSec: 150, source: 'generatore · modulare',
    };
  }
  const wrongs = new Set();
  while (wrongs.size < 3) { const w = rint(1, n - 1); if (w !== inv) wrongs.add(w); }
  const opts = [...wrongs].map(w => ({ tex: T(`[${w}]_{${n}}`) }));
  opts.push({ text: 'Non esiste' });
  const shuffledOpts = shuffle(opts.map((o, i) => ({ ...o, __i: i })));
  const finalAnswer = shuffledOpts.findIndex(o => o.__i === 3);
  return {
    kind: 'mc', topicId: 'D-modulare', course: 'discreta',
    prompt: `Calcolare, se esiste, l'inversa moltiplicativa di \\( [${a}]_{${n}} \\).`,
    choices: shuffledOpts.map(o => ({ tex: o.tex, text: o.text })),
    answer: finalAnswer,
    solution: sol,
    estSec: 150, source: 'generatore · modulare',
  };
}

function smallestFactor(n) { for (let i = 2; i * i <= n; i++) if (n % i === 0) return i; return n; }
function factors(n) {
  const out = []; let m = n;
  for (let p = 2; p * p <= m; p++) while (m % p === 0) { out.push(p); m /= p; }
  if (m > 1) out.push(m);
  return out.join(' \\cdot ');
}

/* ================================================================
   4. RSA
   ================================================================ */

function genRsa() {
  const PRIMES = [11, 13, 17, 19, 23, 29, 31, 37, 41, 43, 47, 53, 59, 61, 67, 71];
  let p = pick(PRIMES);
  let q = pick(PRIMES);
  while (q === p) q = pick(PRIMES);
  if (q < p) [p, q] = [q, p];
  const n = p * q;
  const phi = (p - 1) * (q - 1);
  let e = pick([7, 11, 13, 17, 19, 23, 29, 31, 37, 41, 43]);
  let guard = 0;
  while (gcd(e, phi) !== 1 && guard++ < 20) e = e + 2;
  if (gcd(e, phi) !== 1) return genRsa();
  const d = modInverse(e, phi);
  const M = rint(2, n - 2);

  const which = rint(0, 3);
  if (which === 0) {
    return {
      kind: 'numeric', topicId: 'D-rsa', course: 'discreta',
      prompt: `Nel sistema RSA un utente pubblica \\( n = ${n} \\), ottenuto come prodotto di due primi \\( p = ${p} \\) e \\( q = ${q} \\). Quanto vale \\( \\varphi(n) \\)?`,
      answer: String(phi),
      solution: [
        `**Formula.** \\( \\varphi(pq) = (p-1)(q-1) \\) per \\( p, q \\) primi distinti.`,
        `**Calcolo.** \\( \\varphi(${n}) = (${p}-1)(${q}-1) = ${p - 1} \\cdot ${q - 1} = ${phi} \\)`,
      ],
      estSec: 80, source: 'generatore · RSA',
    };
  }
  if (which === 1) {
    const { steps } = extGcd(e, phi);
    const euclidTex = steps.map(s => `${s.a} = ${s.q} \\cdot ${s.b} + ${s.a % s.b}`).join(' \\\\ ');
    return {
      kind: 'numeric', topicId: 'D-rsa', course: 'discreta',
      prompt: `RSA con \\( n = ${n} = ${p} \\cdot ${q} \\) ed esponente pubblico \\( e = ${e} \\). Calcolare la chiave privata \\( d \\) (in \\( [0, ${phi}) \\)).`,
      answer: String(d),
      solution: [
        `**Condizione.** \\( d \\) è tale che \\( e \\cdot d \\equiv 1 \\pmod{\\varphi(n)} \\) con \\( \\varphi(n) = ${phi} \\). Serve \\( \\gcd(${e}, ${phi}) = 1 \\) ✓`,
        `**Euclide esteso.** \\[ \\begin{array}{l} ${euclidTex} \\end{array} \\] Risalendo si trova \\( d = ${d} \\).`,
        `**Verifica.** \\( ${e} \\cdot ${d} = ${e * d} = ${phi} \\cdot ${Math.floor((e * d) / phi)} + ${(e * d) % phi} \\Rightarrow \\equiv ${(e * d) % phi} \\pmod{${phi}} \\) ✓`,
      ],
      estSec: 150, source: 'generatore · RSA',
    };
  }
  if (which === 2) {
    // cifratura simbolica, come vuole l'esame
    const correct = `[${M}^{${e}}]_{${n}}`;
    const options = [
      { tex: T(correct), ok: true },
      { tex: T(`[${M}^{${d}}]_{${n}}`), ok: false, why: `usa la chiave privata invece della pubblica` },
      { tex: T(`[${e}^{${M}}]_{${n}}`), ok: false, why: `scambia base ed esponente` },
      { tex: T(`[${M} \\cdot ${e}]_{${n}}`), ok: false, why: `moltiplica invece di elevare a potenza` },
    ];
    const shuffled = shuffle(options);
    return {
      kind: 'mc', topicId: 'D-rsa', course: 'discreta',
      prompt: `Vuoi cifrare il messaggio \\( M = ${M} \\) con la chiave pubblica \\( (n, e) = (${n}, ${e}) \\) del destinatario. Qual è la cifratura corretta? (lasciare la potenza in forma simbolica)`,
      choices: shuffled.map(o => ({ tex: o.tex })),
      answer: shuffled.findIndex(o => o.ok),
      solution: [
        `**Cifratura.** \\( c = [M^{e}]_n = [${M}^{${e}}]_{${n}} \\). Si usa solo la chiave **pubblica** del destinatario.`,
        `**Regola d'esame.** Le potenze modulari non si calcolano esplicitamente: si lasciano nella forma \\( [a^{k}]_{n} \\).`,
        `**Decifratura (per capire).** Il destinatario calcola \\( [c^{d}]_n = M \\) con la sua chiave privata \\( d \\), che esiste perché \\( \\gcd(e, \\varphi(n)) = 1 \\).`,
      ],
      estSec: 90, source: 'generatore · RSA',
    };
  }
  // which === 3: chiave pubblica/privata MC
  const keyOpts = shuffle([
    { tex: T(`\\text{pubblica } (${n}, ${e}) \\;\\; \\text{privata } (${n}, ${d})`), ok: true },
    { tex: T(`\\text{pubblica } (${n}, ${d}) \\;\\; \\text{privata } (${n}, ${e})`), ok: false },
    { tex: T(`\\text{pubblica } (${phi}, ${e}) \\;\\; \\text{privata } (${phi}, ${d})`), ok: false },
    { tex: T(`\\text{pubblica } (${n}, ${e}) \\;\\; \\text{privata } (${n}, ${phi})`), ok: false },
  ]);
  return {
    kind: 'mc', topicId: 'D-rsa', course: 'discreta',
    prompt: `Un utente RSA sceglie \\( p = ${p} \\), \\( q = ${q} \\), \\( e = ${e} \\). Qual è la sua coppia di chiavi?`,
    choices: keyOpts.map(o => ({ tex: o.tex })),
    answer: keyOpts.findIndex(o => o.ok),
    solution: [
      `**Chiave pubblica.** \\( (n, e) = (${n}, ${e}) \\): si può pubblicare perché da \\( n \\) non si risale a \\( \\varphi(n) \\) senza fattorizzare.`,
      `**Chiave privata.** \\( d = ${d} \\), l'inversa di \\( e \\) modulo \\( \\varphi(n) = ${phi} \\): \\( ${e} \\cdot ${d} \\equiv 1 \\pmod{${phi}} \\).`,
      `**Attenzione.** \\( \\varphi(n) \\) non è la chiave privata: è il segreto che permette di calcolarla.`,
    ],
    estSec: 100, source: 'generatore · RSA',
  };
}

/* ================================================================
   5. GRAFI — gradi, bipartiti, isomorfismo, Hall
   ================================================================ */

function genGraph(nV, nE) {
  const edges = [];
  const seen = new Set();
  while (edges.length < nE) {
    const u = rint(0, nV - 1), v = rint(0, nV - 1);
    if (u === v) continue;
    const key = Math.min(u, v) + '-' + Math.max(u, v);
    if (seen.has(key)) continue;
    seen.add(key); edges.push([u, v]);
  }
  return edges;
}

function degreeSeq(nV, edges) {
  const deg = Array(nV).fill(0);
  for (const [u, v] of edges) { deg[u]++; deg[v]++; }
  return deg.sort((a, b) => b - a);
}

function bipartiteInfo(nV, edges) {
  const adj = Array.from({ length: nV }, () => []);
  for (const [u, v] of edges) { adj[u].push(v); adj[v].push(u); }
  const color = Array(nV).fill(-1);
  for (let s = 0; s < nV; s++) {
    if (color[s] !== -1) continue;
    color[s] = 0;
    const queue = [s];
    while (queue.length) {
      const u = queue.shift();
      for (const v of adj[u]) {
        if (color[v] === -1) { color[v] = 1 - color[u]; queue.push(v); }
        else if (color[v] === color[u]) {
          // ciclo dispari: ricostruiamo con i padri BFS
          return { bip: false, color, cycle: findOddCycle(adj, s) };
        }
      }
    }
  }
  return { bip: true, color };
}

function findOddCycle(adj, s) {
  // BFS con padri dal nodo s; al primo conflitto risale entrambi i lati
  const parent = { [s]: null };
  const color = { [s]: 0 };
  const queue = [s];
  while (queue.length) {
    const u = queue.shift();
    for (const v of adj[u]) {
      if (!(v in parent)) { parent[v] = u; color[v] = 1 - color[u]; queue.push(v); }
      else if (color[v] === color[u]) {
        const pathU = [], pathV = [];
        let x = u, y = v;
        while (x !== null) { pathU.push(x); x = parent[x]; }
        while (y !== null) { pathV.push(y); y = parent[y]; }
        // primo antenato comune
        const setU = new Set(pathU);
        let w = y = v, common = null;
        for (const node of pathV) { if (setU.has(node)) { common = node; break; } }
        const cycle = [];
        for (let i = 0; i < pathU.length && pathU[i] !== common; i++) cycle.push(pathU[i]);
        cycle.push(common);
        for (let i = pathV.indexOf(common) - 1; i >= 0; i--) cycle.push(pathV[i]);
        cycle.push(cycle[0]);
        return cycle;
      }
    }
  }
  return null;
}

const names = 'ABCDEFGH';

function genGrafi() {
  const which = rint(0, 3);

  if (which === 0) {
    // sequenza dei gradi
    const nV = rint(5, 7), nE = rint(nV - 1, Math.min(10, nV * (nV - 1) / 2));
    const edges = genGraph(nV, nE);
    const seq = degreeSeq(nV, edges);
    const fmt = (s) => `(${s.join(',\\,')})`;
    const distr = new Set([seq.join(',')]);
    const pool = [
      [...seq.slice(1), seq[0]],
      seq.map(x => x + (Math.random() < 0.5 ? 1 : -1)),
      seq.slice().sort((a, b) => a - b),
    ];
    const opts = [];
    for (const p of shuffle(pool)) {
      const key = p.join(',');
      if (!distr.has(key) && p.every(x => x >= 0)) { distr.add(key); opts.push(p); }
      if (opts.length === 3) break;
    }
    while (opts.length < 3) { const p = seq.map(x => Math.max(0, x + rint(1, 2))); if (!distr.has(p.join(','))) { distr.add(p.join(',')); opts.push(p); } }
    const answer = rint(0, 3);
    const options = [...opts];
    options.splice(answer, 0, seq);
    const edgeTex = edges.map(([u, v]) => `${names[u]}${names[v]}`).join(',\\;');
    return {
      kind: 'mc', topicId: 'D-grafi', course: 'discreta',
      prompt: `Un grafo semplice ha vertici \\( ${names.slice(0, nV).split('').join(', ')} \\) e archi \\( ${edgeTex} \\). Qual è la sua sequenza dei gradi?`,
      choices: options.map(s => ({ tex: T(fmt(s)) })),
      answer,
      solution: [
        `**Grado.** Il grado di un vertice è il numero di archi incidenti.`,
        `**Calcolo.** \\( ${names.slice(0, nV).split('').map((v, i) => `\\deg(${v}) = ${edges.filter(([a, b]) => a === i || b === i).length}`).join(',\\; ')} \\)`,
        `**Sequenza.** Si ordinano in modo decrescente: \\( ${fmt(seq)} \\). Controllo: la somma dei gradi \\( = ${seq.reduce((a, b) => a + b, 0)} = 2 \\cdot ${nE} \\) (handshaking).`,
      ],
      estSec: 100, source: 'generatore · grafi',
    };
  }

  if (which === 1) {
    // bipartito?
    const makeBip = Math.random() < 0.5;
    const nV = 6;
    let edges;
    if (makeBip) {
      edges = [];
      for (let i = 0; i < 3; i++) for (let j = 3; j < 6; j++) if (Math.random() < 0.45) edges.push([i, j]);
      if (edges.length < 3) edges.push([0, 3], [1, 4]);
    } else {
      edges = genGraph(6, rint(6, 9));
    }
    const info = bipartiteInfo(nV, edges);
    if (info.bip !== makeBip) return genGrafi(); // il grafo casuale è bipartito per caso: rigenera
    const edgeTex = edges.map(([u, v]) => `${names[u]}${names[v]}`).join(',\\;');
    const A = names.slice(0, 3).split('').join(','), B = names.slice(3, 6).split('').join(',');
    return {
      kind: 'tf', topicId: 'D-grafi', course: 'discreta',
      prompt: `Il grafo con vertici \\( ${names.slice(0, nV).split('').join(', ')} \\) e archi \\( ${edgeTex} \\) è bipartito?`,
      choices: [{ text: 'Vero (è bipartito)' }, { text: 'Falso (non è bipartito)' }],
      answer: info.bip ? 0 : 1,
      solution: info.bip
        ? [
          `**Criterio.** Un grafo è bipartito se e solo se non ha cicli di lunghezza dispari; in pratica si tenta la 2-colorazione con una visita in ampiezza.`,
          `**Colorazione trovata.** \\( \\text{neri} = \\{${info.color.map((c, i) => c === 0 ? names[i] : '').filter(Boolean).join(',')}\\} \\), \\( \\text{bianchi} = \\{${info.color.map((c, i) => c === 1 ? names[i] : '').filter(Boolean).join(',')}\\} \\): ogni arco collega colori diversi. ✓`,
          `**Partizione.** Le due parti sono proprio \\( \\{${A}\\} \\) e \\( \\{${B}\\} \\) (a meno di rinominare).`,
        ]
        : [
          `**Criterio.** Un grafo è bipartito se e solo se è 2-colorabile, cioè non contiene cicli dispari.`,
          `**Ciclo disparo.** La visita in ampiezza trova un conflitto: esiste il ciclo \\( ${info.cycle ? info.cycle.map(i => names[i]).join(' - ') : '?'} \\) di lunghezza dispari.`,
          `**Conclusione.** Il grafo **non è bipartito**.`,
        ],
      estSec: 110, source: 'generatore · grafi',
    };
  }

  if (which === 2) {
    // isomorfismo: coppie curate
    const PAIRS = [
      {
        desc: `\\( G \\) è il ciclo di lunghezza 6 (\\( C_6 \\)); \\( H \\) è l'unione disgiunta di due triangoli (\\( C_3 \\cup C_3 \\))`,
        iso: false,
        why: `Entrambi sono 2-regolari con 6 vertici (stessa sequenza dei gradi!) ma \\( G \\) è connesso e \\( H \\) no: il numero di componenti connesse è un invariante.`,
      },
      {
        desc: `\\( G \\) è il ciclo di lunghezza 5 disegnato come pentagono; \\( H \\) è il ciclo di lunghezza 5 disegnato come stella a 5 punte`,
        iso: true,
        why: `Sono lo stesso grafo (\\( C_5 \\)) disegnato in modi diversi: l'isomorfismo è una rinomina dei vertici che preserva gli archi.`,
      },
      {
        desc: `\\( G \\) è \\( K_{3,3} \\) (grafo bipartito completo 3+3); \\( H \\) è il prisma triangolare`,
        iso: false,
        why: `Entrambi hanno 6 vertici, 9 archi e sequenza dei gradi (3,3,3,3,3,3). Ma il prisma triangolare contiene triangoli, mentre \\( K_{3,3} \\) è bipartito e non ha cicli dispari: il numero di triangoli è un invariante.`,
      },
      {
        desc: `\\( G \\) è \\( K_4 \\) (4 vertici, tutti e 6 gli archi possibili); \\( H \\) è un quadrato con le due diagonali`,
        iso: true,
        why: `Un quadrato con le diagonali ha esattamente tutti i possibili archi tra 4 vertici: è \\( K_4 \\). Stessa sequenza dei gradi (3,3,3,3).`,
      },
    ];
    const pair = pick(PAIRS);
    const answer = rint(0, 1);
    const opts = [{ text: 'Sì, isomorfi' }, { text: 'No, non isomorfi' }];
    return {
      kind: 'mc', topicId: 'D-grafi', course: 'discreta',
      prompt: `Sono isomorfi i due grafi seguenti? ${pair.desc}.`,
      choices: opts,
      answer: pair.iso ? 0 : 1,
      solution: [
        `**Invarianti utili.** Numero di vertici, archi, sequenza dei gradi, numero di componenti connesse, presenza di cicli (di data lunghezza), bipartizione. Se un invariante differisce: non isomorfi. Se tutto coincide, si cerca la rinomina esplicita.`,
        `**Analisi.** ${pair.why}`,
      ],
      estSec: 110, source: 'generatore · grafi',
    };
  }

  // which === 3: Hall
  const k = pick([2, 3]);
  return {
    kind: 'tf', topicId: 'D-grafi', course: 'discreta',
    prompt: `Sia \\( G = (A, B, E) \\) bipartito con \\( A \\) = sottoinsiemi di \\( [${k * 10}] \\) di cardinalità \\( ${k} \\) e \\( B \\) = sottoinsiemi di cardinalità \\( ${2 * k} \\), con \\( X R Y \\iff X \\cap Y = \\varnothing \\). È vero che esiste un matching di \\( A \\) in \\( B \\)?`,
    choices: [{ text: 'Vero (esiste)' }, { text: 'Falso (non esiste)' }],
    answer: 0,
    solution: [
      `**Hall.** Esiste un matching che copre \\( A \\) se e solo se per ogni \\( S \\subseteq A \\): \\( |N(S)| \\ge |S| \\).`,
      `**Stima di \\( |N(S)| \\).** Un insieme \\( Y \\in B \\) non è adiacente a \\( X \\in S \\) solo se \\( Y \\) incontra \\( X \\). Gli \\( Y \\) che intersecano un dato \\( X \\) (con \\( |X| = ${k} \\)) sono al più \\( \\sum_{i=1}^{${k}} \\binom{${k * 10}}{${2 * k}-i}\\binom{${k}}{i} \\ll |B| \\): la quasi totalità dei \\( B \\) è adiacente a ogni \\( X \\).`,
      `**Conclusione.** Per ogni \\( S \\) non vuoto, \\( |N(S)| \\ge |N(\\{X\\})| \\ge |S| \\) (ogni \\( X \\) ha migliaia di vicini, più degli elementi di \\( S \\)): Hall è soddisfatto, il matching **esiste**. La chiave è che "essere disgiunti" è una condizione facilissima da soddisfare quando l'universo è grande.`,
    ],
    estSec: 130, source: 'generatore · grafi · teorema di Hall',
  };
}

/* ================================================================
   6. RICORSIONI LINEARI
   ================================================================ */

function texClosed(csArr, rootsArr) {
  return csArr.map((c, i) => {
    const rt = rootsArr[i];
    const sign = i === 0 ? (c < 0 ? '-' : '') : (c < 0 ? '- ' : '+ ');
    const abs = Math.abs(c);
    const coeff = abs === 1 ? '' : `${abs}\\cdot `;
    return `${sign}${coeff}${rt}^{n}`;
  }).join(' ');
}

function genRicorsioni() {
  const r = makeRecurrence();
  const { roots, cs, rec, inits, k } = r;
  const f = (n) => roots.reduce((s, rt, i) => s + cs[i] * Math.pow(rt, n), 0);
  const fIter = (n) => {
    const a = [...inits];
    while (a.length <= n) a.push(rec.reduce((s, c, i) => s + c * a[a.length - 1 - i], 0));
    return a[n];
  };
  const closedTex = texClosed(cs, roots);

  const askNumeric = Math.random() < 0.4;
  if (askNumeric) {
    const nAsk = k === 2 ? rint(4, 6) : rint(4, 5);
    return {
      kind: 'numeric', topicId: 'D-ricorsioni', course: 'discreta',
      prompt: `Data la ricorrenza \\[ f(n+${k}) = ${rec.map((c, i) => `${c}\\,f(n+${k - 1 - i})`).join(' + ')} \\] con \\( ${inits.map((v, i) => `f(${i}) = ${v}`).join(',\\; ')} \\), calcolare \\( f(${nAsk}) \\) iterando.`,
      answer: String(fIter(nAsk)),
      solution: [
        `**Iterazione.** \\( ${Array.from({ length: nAsk + 1 }, (_, i) => `f(${i}) = ${fIter(i)}`).join(',\\; ')} \\)`,
        `**Controllo con la forma chiusa.** \\( f(${nAsk}) = ${closedTex.replace(/\^{n}/g, `^{${nAsk}}`)} \\big|_{n = ${nAsk}} = ${f(nAsk)} \\) ✓`,
      ],
      estSec: 110, source: 'generatore · ricorsioni',
    };
  }

  // MC sulla forma chiusa
  const correctTex = closedTex;
  const texOf = texClosed;
  const distr = [];
  const seen = new Set([correctTex.replace(/\s/g, '')]);
  const mk = (cs2, rs2) => ({ cs2, rs2 });
  const pool = [
    mk(cs.map((c, i) => i === 0 ? c + 1 : c), roots),
    mk(cs.map((c, i) => i === cs.length - 1 ? c - 1 : c), roots),
    mk([...cs.slice(1), cs[0]], roots),
    mk(cs, [...roots.slice(1), roots[0]]),
    mk(cs.map(c => -c), roots),
  ];
  for (const p of shuffle(pool)) {
    const t = texOf(p.cs2, p.rs2);
    const key = t.replace(/\s/g, '');
    if (seen.has(key)) continue;
    // deve differire numericamente dalla successione
    const g = (n) => p.cs2.reduce((s, c, i) => s + c * Math.pow(p.rs2[i], n), 0);
    if ([0, 1, 2, 3, 5].some(n => g(n) !== f(n))) { seen.add(key); distr.push(t); }
    if (distr.length === 3) break;
  }
  while (distr.length < 3) distr.push(texOf(cs.map((c, i) => (i === 0 ? c + distr.length + 2 : c)), roots));
  const answer = rint(0, 3);
  const options = [...distr];
  options.splice(answer, 0, correctTex);

  const charEq = `x^{${k}} = ${rec.map((c, i) => `${c}\\,x^{${k - 1 - i}}`).join(' + ')}`;
  const factored = roots.map(rt => `(x ${rt >= 0 ? '-' : '+'} ${Math.abs(rt)})`).join('');
  return {
    kind: 'mc', topicId: 'D-ricorsioni', course: 'discreta',
    prompt: `Risolvere la ricorrenza lineare a coefficienti costanti \\[ f(n+${k}) = ${rec.map((c, i) => `${c}\\,f(n+${k - 1 - i})`).join(' + ')} \\qquad ${inits.map((v, i) => `f(${i}) = ${v}`).join(',\\; ')} \\] Quale è la soluzione \\( f(n) \\)?`,
    choices: options.map(t => ({ tex: T(t) })),
    answer,
    solution: [
      `**Equazione caratteristica.** \\( ${charEq} \\), cioè \\( ${factored} = 0 \\), con radici **distinte** \\( ${roots.map(rt => `x = ${rt}`).join(',\\; ')} \\).`,
      `**Soluzione generale.** \\( f(n) = ${roots.map((rt, i) => `c_{${i + 1}} ${rt}^{n}`).join(' + ')} \\).`,
      `**Condizioni iniziali.** Il sistema \\( ${inits.map((v, i) => roots.map((rt, j) => `c_{${j + 1}} ${rt}^{${i}}`).join(' + ') + ` = ${v}`).join(',\\quad ')} \\) dà \\( ${cs.map((c, i) => `c_{${i + 1}} = ${c}`).join(',\\; ')} \\).`,
      `**Risposta.** \\( f(n) = ${correctTex} \\). Verifica: \\( ${[0, 1, k].map(n => `f(${n}) = ${fIter(n)}`).join(',\\; ')} \\) ✓`,
    ],
    estSec: 170, source: 'generatore · ricorsioni',
  };
}

/* ================================================================ */

export const DISCRETA_GENS = {
  D_funzioni: genFunzioni,
  D_relazioni: genRelazioni,
  D_modulare: genModulare,
  D_rsa: genRsa,
  D_grafi: genGrafi,
  D_ricorsioni: genRicorsioni,
};
