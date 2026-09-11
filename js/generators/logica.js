// generators/logica.js — esercizi infiniti di Logica e Reti Logiche
// Ogni generatore ritorna un item: {kind, topicId, course, prompt, choices, answer, solution, estSec}
// kind: 'mc' | 'numeric' | 'tf'

import { rint, pick, shuffle } from '../ui.js';
import {
  truthTable, classify, texFormula, randFormula, equiv, varsOf,
  quineMcCluskey, sopTex, popcount, toHex, toBin, twosComplement,
} from './mathutil.js';

const T = (s) => `\\( ${s} \\)`;

/* ================================================================
   1. INDUZIONE — successioni ricorrenti e Fibonacci
   ================================================================ */

function genInduzione() {
  const type = Math.random();

  // --- successione del tipo a(n) = c1*a(n-1) + c0 ---
  if (type < 0.45) {
    const c1 = pick([2, 3]);
    const c0 = pick([-2, 0, 2]); // coefficienti che danno forma chiusa a coefficienti interi
    const a0 = rint(1, 4);
    // forma chiusa: a_n = (a0 + c0/(c1-1)) * c1^n - c0/(c1-1)
    const k = c0 / (c1 - 1);
    const A = a0 + k;
    const seq = [a0];
    for (let n = 1; n <= 6; n++) seq.push(c1 * seq[n - 1] + c0);
    const evalClosed = (a, b, n) => a * Math.pow(c1, n) + b; // a*c1^n + b

    // corretta: A*c1^n - k ; distrattori: parametri perturbati
    const cand = [];
    const fmt = (a, b) => a === 1 ? `${c1}^{n} ${b >= 0 ? '+' : '-'} ${Math.abs(b)}` : `${a}\\cdot ${c1}^{n} ${b >= 0 ? '+' : '-'} ${Math.abs(b)}`;
    const okPair = [A, -k];
    const pool = [[A + 1, -k], [A, -k + 1], [A - 1, -k], [a0, -k], [A, k]];
    const chosen = [];
    for (const p of shuffle(pool)) {
      if (chosen.length >= 3) break;
      if (p[0] === okPair[0] && p[1] === okPair[1]) continue;
      // il distrattore deve differire dalla successione su qualche n<=6
      if (seq.some((v, n) => Math.round(evalClosed(p[0], p[1], n)) !== v)) chosen.push(p);
    }
    while (chosen.length < 3) { const p = [A + chosen.length + 2, -k + chosen.length + 1]; chosen.push(p); }

    const answer = rint(0, 3);
    const options = [...chosen];
    options.splice(answer, 0, okPair);
    return {
      kind: 'mc', topicId: 'L-induzione', course: 'logica',
      prompt: `Sia \\( {a_n}_{n \\ge 0} \\) la successione definita da
        \\[ a_0 = ${a0} \\qquad a_n = ${c1}\\,a_{n-1} ${c0 >= 0 ? '+' : '-'} ${Math.abs(c0)} \\quad \\text{per } n \\ge 1 \\]
        Quale delle seguenti è la forma chiusa di \\( a_n \\)?`,
      choices: options.map(p => ({ tex: T(p[0] === 1 ? fmt(1, p[1]) : `${fmt(p[0], p[1])}`) })),
      answer,
      solution: [
        `**Caso base.** Per \\( n = 0 \\): la formula corretta deve dare \\( ${seq[0]} \\). Con \\( n=0 \\): \\( ${fmtSafe(okPair[0], okPair[1], 0, c1)} = ${seq[0]} \\). ✓`,
        `**Induzione (idea).** Assumiamo \\( a_n = ${fmtK(okPair, c1)} \\). Allora \\( a_{n+1} = ${c1}\\,a_n ${c0 >= 0 ? '+' : '-'} ${Math.abs(c0)} = ${c1}\\bigl(${fmtK(okPair, c1)}\\bigr) ${c0 >= 0 ? '+' : '-'} ${Math.abs(c0)} = ${fmtK(okPair, c1)} \\) — la stessa forma con \\( n+1 \\).`,
        `**Verifica numerica.** \\( ${seq.map((v, n) => `a_{${n}} = ${v}`).join(',\\; ')} \\) e la formula chiusa coincide su tutti questi valori (basta verificarlo per costruzione: i distrattori falliscono già su \\( a_1 \\) o \\( a_2 \\)).`,
        `**Per ricavarla.** Si cerca la soluzione del tipo \\( a_n = A\\,${c1}^n + B \\): sostituendo nella ricorrenza \\( B = ${c1}B ${c0 >= 0 ? '+' : '-'} ${Math.abs(c0)} \\Rightarrow B = ${-k} \\), poi \\( A = a_0 - B = ${A} \\).`,
      ],
      estSec: 120, source: 'generatore · induzione',
    };
  }

  // --- identità di Fibonacci (vero/falso) ---
  const fib = [0, 1];
  for (let i = 2; i <= 24; i++) fib[i] = fib[i - 1] + fib[i - 2];
  const IDENTS = [
    { t: '\\sum_{i=1}^{n} F_{2i-1} = F_{2n}', true: true, why: `Somma dei Fibonacci di indice dispari: \\( 1+1+2+3+5+8 = F_{12}? \\) Verifichiamo: con \\( n = 3 \\), \\( F_1 + F_3 + F_5 = 1 + 2 + 5 = 8 = F_6 \\). ✓ L'induzione: \\( \\sum_{i=1}^{n+1} F_{2i-1} = F_{2n} + F_{2n+1} = F_{2n+2} \\).` },
    { t: '\\sum_{i=1}^{n} F_i = F_{n+2} - 1', true: true, why: `Con \\( n = 3 \\): \\( 1 + 1 + 2 = 4 = F_5 - 1 = 5 - 1 \\). ✓ Passo: \\( \\sum^{n+1} = F_{n+2} - 1 + F_{n+1} = F_{n+3} - 1 \\).` },
    { t: 'F_{n+1} F_{n-1} - F_n^2 = (-1)^n', true: true, why: `Identità di Cassini. Con \\( n = 3 \\): \\( F_4 F_2 - F_3^2 = 3 - 4 = -1 = (-1)^3 \\). ✓ L'induzione passa per \\( F_{n+2}F_n - F_{n+1}^2 = -(F_{n+1}F_{n-1} - F_n^2) \\).` },
    { t: '\\sum_{i=1}^{n} F_i = F_{n+1}', true: false, why: `Con \\( n = 2 \\): \\( F_1 + F_2 = 2 \\) ma \\( F_3 = 2 \\)... funziona? Con \\( n = 3 \\): \\( 1 + 1 + 2 = 4 \\neq F_4 = 3 \\). ✗ La formula giusta è \\( F_{n+2} - 1 \\).` },
    { t: 'F_n \\text{ divide } F_{2n}', true: true, why: `Con \\( n = 4 \\): \\( F_4 = 3 \\), \\( F_8 = 21 = 3 \\cdot 7 \\). ✓ Si dimostra che \\( F_{m+n} = F_m F_{n+1} + F_{m-1} F_n \\), da cui \\( F_{2n} = F_n(F_{n+1} + F_{n-1}) \\).` },
    { t: '2 F_n = F_{n+1} + F_{n-2}', true: false, why: `Con \\( n = 4 \\): \\( 2F_4 = 6 \\) ma \\( F_5 + F_2 = 5 + 1 = 6 \\)... con \\( n=5 \\): \\( 2F_5 = 10 \\), \\( F_6 + F_3 = 8 + 2 = 10 \\). Prova ancora: \\( n = 6 \\): \\( 2 \\cdot 8 = 16 \\), \\( 13 + 3 = 16 \\)! In realtà \\( F_{n+1} + F_{n-2} = F_n + F_{n-1} + F_{n-2} = F_n + F_n \\): è **vera**... attenzione agli schemi: la risposta giusta per questa voce è VERA, ma il trucco dell'esercizio è non fermarsi al primo check.` , trueFix: true },
  ];
  // normalizza: la voce con trueFix è vera
  const id = pick(IDENTS.filter(x => !x.trueFix));
  const stmt = T(id.t);
  return {
    kind: 'tf', topicId: 'L-induzione', course: 'logica',
    prompt: `Vero o falso? (con \\( F_1 = F_2 = 1 \\), \\( F_n = F_{n-1} + F_{n-2} \\)) \\[ ${id.t} \\]`,
    choices: [{ text: 'Vero' }, { text: 'Falso' }],
    answer: id.true ? 0 : 1,
    solution: [
      `**Strategia.** Si verifica sempre prima su valori piccoli (\\( n = 2, 3, 4 \\)): se trovi un controesempio l'identità è falsa; se regge, si prova per induzione.`,
      `**Analisi.** ${id.why}`,
    ],
    estSec: 100, source: 'generatore · Fibonacci',
  };
}

// helper per formattare A*c1^n + B
function fmtK([A, B], c1) { return `${A === 1 ? '' : A + '\\cdot '}${c1}^{n} ${B >= 0 ? '+' : '-'} ${Math.abs(B)}`; }
function fmtSafe(A, B, n, c1) { return `${A} \\cdot ${c1}^{${n}} ${B >= 0 ? '+' : '-'} ${Math.abs(B)}`; }

/* ================================================================
   2. PROPOSIZIONALE — tautologie + riscritture NAND/NOR
   ================================================================ */

function tautPool() {
  const v = (n) => ({ op: 'var', name: n });
  const NOT = (a) => ({ op: 'not', a });
  const AND = (a, b) => ({ op: 'and', a, b });
  const OR = (a, b) => ({ op: 'or', a, b });
  const IMP = (a, b) => ({ op: 'imp', a, b });
  const IFF = (a, b) => ({ op: 'iff', a, b });
  return [
    { f: IFF(IMP(v('p'), v('q')), OR(NOT(v('p')), v('q'))), hint: 'è la definizione di implicazione in forma disgiuntiva' },
    { f: OR(v('p'), NOT(v('p'))), hint: 'terzo escluso' },
    { f: NOT(AND(v('p'), NOT(v('p')))), hint: 'non contraddizione' },
    { f: IMP(IMP(v('p'), v('q')), IMP(NOT(v('q')), NOT(v('p')))), hint: 'contropositivo' },
    { f: AND(v('p'), NOT(v('p'))), hint: 'contraddizione' },
    { f: OR(AND(v('p'), v('q')), NOT(AND(v('p'), v('q')))), hint: 'istanza del terzo escluso' },
  ];
}

function genProp() {
  if (Math.random() < 0.42) return genConnettivi();
  const usePattern = Math.random() < 0.3;
  let f;
  if (usePattern) f = pick(tautPool()).f;
  else {
    do { f = randFormula(['p', 'q', 'r'], 2); } while (varsOf(f).length < 2);
  }
  const cls = classify(f);
  const labels = ['tautologia', 'contraddizione', 'contingenza'];
  const answer = labels.indexOf(cls);
  // piccola variante: chiedi la classificazione
  const tt = truthTable(f);
  const vs = varsOf(f).sort();
  const head = vs.join(' & ');
  // tabella in LaTeX
  const rows = tt.map(r => vs.map(v => r[v] ? '1' : '0').join(' & ') + ' & ' + (r.v ? '1' : '0')).join(' \\\\ ');
  return {
    kind: 'mc', topicId: 'L-prop', course: 'logica',
    prompt: `Dire se la formula seguente è una tautologia, una contraddizione o una contingenza, motivando. \\[ ${texFormula(f)} \\]`,
    choices: labels.map(l => ({ text: l[0].toUpperCase() + l.slice(1) })),
    answer,
    solution: [
      `**Metodo.** Si costruisce la tavola di verità e si osserva la colonna del risultato.`,
      `**Tavola.** \\[ \\begin{array}{${'c'.repeat(vs.length + 1)}} ${head} & \\varphi \\\\ ${rows} \\end{array} \\]`,
      cls === 'tautologia'
        ? `**Conclusione.** La colonna è tutta **1**: la formula è una **tautologia** (valida).`
        : cls === 'contraddizione'
          ? `**Conclusione.** La colonna è tutta **0**: la formula è una **contraddizione** (insoddisfacibile).`
          : `**Conclusione.** La colonna contiene sia 0 che 1: la formula è una **contingenza** (soddisfacibile ma non valida).`,
    ],
    estSec: 110, source: 'generatore · proposizionale',
  };
}

/* riscrittura con soli NAND o NOR */
function genConnettivi(attempt = 0) {
  const useNor = Math.random() < 0.5;
  const OP = useNor ? 'nor' : 'nand';
  const vs = ['a', 'b', 'c'].slice(0, rint(2, 3));
  let base;
  do {
    base = randFormula(vs, 2, Math.random, ['and', 'or', 'not']);
  } while (varsOf(base).length < 2);

  const conv = (f) => {
    const N = (x) => ({ op: OP, a: x, b: x });
    const C = f;
    switch (C.op) {
      case 'var': return C;
      case 'not': return N(conv(C.a));
      case 'and': return useNor ? N({ op: OP, a: N(conv(C.a)), b: N(conv(C.b)) }) : { op: OP, a: conv(C.a), b: conv(C.b) };
      case 'or': return useNor ? { op: OP, a: conv(C.a), b: conv(C.b) } : N({ op: OP, a: N(conv(C.a)), b: N(conv(C.b)) });
      case 'imp': return conv({ op: 'or', a: { op: 'not', a: C.a }, b: C.b });
      default: return conv({ op: 'or', a: { op: 'and', a: C.a, b: C.b }, b: { op: 'and', a: { op: 'not', a: C.a }, b: { op: 'not', a: C.b } } });
    }
  };
  const correct = conv(base);

  // distrattori: mutazioni della formula base, riconvertite nello stesso connettivo
  const mutate = (f) => {
    const clone = JSON.parse(JSON.stringify(f));
    const nodes = [];
    (function walk(x) { nodes.push(x); if (x.a) walk(x.a); if (x.b) walk(x.b); })(clone);
    const mutabili = nodes.filter(n => (n.op === 'var' && vs.length > 1) || n.op === 'and' || n.op === 'or');
    const n = mutabili.length ? pick(mutabili) : nodes[0];
    if (n.op === 'var') {
      const altri = vs.filter(v => v !== n.name);
      n.name = pick(altri.length ? altri : vs);
    } else {
      n.op = n.op === 'and' ? 'or' : 'and';
    }
    return clone;
  };
  const distr = [];
  const seenTex = new Set([texFormula(correct)]);
  let guard = 0;
  while (distr.length < 3 && guard++ < 80) {
    const g = conv(mutate(base));
    const t = texFormula(g);
    if (!seenTex.has(t) && !equiv(g, correct)) { seenTex.add(t); distr.push(g); }
  }
  // basi degeneri (assorbimento, idempotenza): poche mutazioni non equivalenti → rigenera
  if (distr.length < 3) {
    if (attempt < 30) return genConnettivi(attempt + 1);
    return genProp(); // fallback rarissimo: domanda di classificazione
  }
  const answer = rint(0, 3);
  const options = [...distr];
  options.splice(answer, 0, correct);

  const sym = useNor ? '\\downarrow' : '\\mid';
  const name = useNor ? 'NOR (joint denial)' : 'NAND (sheffer)';
  const idHint = useNor
    ? `\\( \\lnot x = x ${sym} x \\), \\( x \\lor y = x ${sym} y \\), \\( x \\land y = (x ${sym} x) ${sym} (y ${sym} y) \\)`
    : `\\( \\lnot x = x ${sym} x \\), \\( x \\land y = x ${sym} y \\), \\( x \\lor y = (x ${sym} x) ${sym} (y ${sym} y) \\)`;
  return {
    kind: 'mc', topicId: 'L-prop', course: 'logica',
    prompt: `Quale delle seguenti formule è equivalente a \\[ ${texFormula(base)} \\] e usa **soltanto** il connettivo ${sym} (${name})?`,
    choices: options.map(g => ({ tex: T(texFormula(g)) })),
    answer,
    solution: [
      `**Identità fondamentali.** ${idHint}`,
      `**Procedura.** Si riscrive la formula dall'interno verso l'esterno sostituendo ogni \\( \\lnot, \\land, \\lor \\) con le identità sopra.`,
      `**Verifica.** La formula corretta è \\[ ${texFormula(correct)} \\] Costruendo le due tavole di verità le colonne results coincidono su ogni interpretazione.`,
    ],
    estSec: 130, source: 'generatore · connettivi',
  };
}

/* ================================================================
   3. FORME NORMALI — FND/FNC da tavola di verità
   ================================================================ */

function mintermTex(m, names) {
  const n = names.length;
  const parts = [];
  for (let i = 0; i < n; i++) parts.push((m & (1 << (n - 1 - i))) ? names[i] : `\\bar{${names[i]}}`);
  return parts.join('');
}

function genFnf() {
  const names = ['a', 'b', 'c'];
  const ones = [];
  for (let m = 0; m < 8; m++) if (Math.random() < 0.4) ones.push(m);
  if (ones.length < 2 || ones.length > 6) return genFnf(); // ripeti: casi estremi poco istruttivi
  const zeros = [];
  for (let m = 0; m < 8; m++) if (!ones.includes(m)) zeros.push(m);
  const correctTex = ones.map(m => mintermTex(m, names)).join(' + ');

  // distrattori: set di mintermi perturbati
  const mkDist = () => {
    const s = new Set(ones);
    const add = zeros[rint(0, zeros.length - 1)];
    if (Math.random() < 0.5) { s.delete(pick(ones)); }
    s.add(add);
    if (s.size === 0) s.add(0);
    return [...s].sort((x, y) => x - y);
  };
  const seen = new Set([ones.join(',')]);
  const distr = [];
  let guard = 0;
  while (distr.length < 3 && guard++ < 50) {
    const d = mkDist();
    const key = d.join(',');
    if (!seen.has(key)) { seen.add(key); distr.push(d); }
  }
  const answer = rint(0, 3);
  const options = [...distr];
  options.splice(answer, 0, ones);
  const texOf = (set) => set.map(m => mintermTex(m, names)).join(' + ');

  // tabella di verità LaTeX
  const rows = [];
  for (let m = 0; m < 8; m++) {
    const bits = names.map((_, i) => (m & (1 << (2 - i))) ? '1' : '0');
    rows.push(bits.join(' & ') + ' & ' + (ones.includes(m) ? '1' : '0'));
  }
  return {
    kind: 'mc', topicId: 'L-fnf', course: 'logica',
    prompt: `Scrivere una formula in **forma normale disgiuntiva** (somma di prodotti) equivalente alla funzione rappresentata dalla tabella. \\[ \\begin{array}{cccc} a & b & c & y \\\\ ${rows.join(' \\\\ ')} \\end{array} \\]`,
    choices: options.map(s => ({ tex: T(texOf(s)) })),
    answer,
    solution: [
      `**Regola.** La FND è la somma dei **mintermini** corrispondenti alle righe con \\( y = 1 \\): per ogni riga si scrive il prodotto di lettere che la rende vera (variabile se vale 1, negata se vale 0).`,
      `**Righe con \\( y=1 \\).** \\( ${ones.map(m => { const bits = names.map((_, i) => (m & (1 << (2 - i))) ? '1' : '0'); return `${bits.join('')} \\;(${m})`; }).join(',\\; ')} \\).`,
      `**FND.** \\[ ${correctTex} \\]`,
      `**FNC (per controllo).** Prodotto dei maxtermini sulle righe con \\( y=0 \\): \\[ ${zeros.map(m => { const bits = names.map((_, i) => (m & (1 << (2 - i))) ? '1' : '0'); return `(${names.map((nm, i) => bits[i] === '0' ? nm : `\\bar{${nm}}`).join(' + ')})`; }).join('')} \\] Nota lo schema invertito: nella FNC ogni fattore è una somma che si annulla esattamente su una riga con \\( y = 0 \\).`,
    ],
    estSec: 130, source: 'generatore · forme normali',
  };
}

/* ================================================================
   4. KARNAUGH — minimizzazione SOP a 4 variabili
   ================================================================ */

function genKarnaugh() {
  const names = ['a', 'b', 'c', 'd'];
  const ones = [];
  for (let m = 0; m < 16; m++) if (Math.random() < 0.45) ones.push(m);
  if (ones.length < 3 || ones.length > 13) return genKarnaugh();
  const imp = quineMcCluskey(4, ones);
  const correctTex = sopTex(imp, 4, names);

  // distrattori
  // (a) aggiunge un implicante ridondante (copre 2 uni adiacenti già coperti)
  let redundant = null;
  outer: for (let i = 0; i < ones.length; i++) {
    for (let j = i + 1; j < ones.length; j++) {
      if (popcount(ones[i] ^ ones[j]) === 1) {
        const cand = { mask: ones[i] ^ ones[j], val: ones[i] & ones[j] };
        const key = cand.mask + ':' + cand.val;
        if (!imp.some(p => p.mask + ':' + p.val === key)) { redundant = cand; break outer; }
      }
    }
  }
  const zeroSet = [];
  for (let m = 0; m < 16; m++) if (!ones.includes(m)) zeroSet.push(m);
  // (b) toglie un implicante essenziale
  const dropped = imp.slice(0, Math.max(1, imp.length - 1));
  // (c) formula del complemento
  const compImp = quineMcCluskey(4, zeroSet);

  const optionsTex = [];
  const push = (tex, tag) => { if (tex && tex !== correctTex && !optionsTex.some(o => o.tex === tex)) optionsTex.push({ tex, tag }); };
  if (redundant) push(sopTex([...imp, redundant], 4, names), 'ridondante');
  if (dropped.length) push(sopTex(dropped, 4, names), 'incompleta');
  push(sopTex(compImp, 4, names), 'complemento');
  push(sopTex(imp.map(p => ({ mask: p.mask, val: ~p.val & p.mask })), 4, names), 'lettere invertite');
  while (optionsTex.length < 3) { optionsTex.push({ tex: correctTex + ' + \\bar{' + names[optionsTex.length] + '}', tag: 'ridondante' }); }

  const answer = rint(0, 3);
  const opts = optionsTex.slice(0, 3);
  opts.splice(answer, 0, { tex: correctTex, tag: 'corretta' });

  // mappa di Karnaugh in LaTeX: righe ab (Gray), colonne cd (Gray)
  const gray = [0, 1, 3, 2];
  const kmap = () => {
    let s = '\\begin{array}{c|cccc} & 00 & 01 & 11 & 10 \\\\ \\hline ';
    for (const r of gray) {
      const rb = r.toString(2).padStart(2, '0');
      s += rb + ' & ';
      s += gray.map(c => {
        // indice minterm: a b c d con a bit più significativo
        const m = (r << 2) | c;
        return ones.includes(m) ? '1' : '0';
      }).join(' & ');
      s += ' \\\\ ';
    }
    s += '\\end{array}';
    return s;
  };
  const groupsDesc = imp.map(p => {
    const fixed = [];
    for (let i = 3; i >= 0; i--) if (p.mask & (1 << i)) fixed.push(`${names[i]} = ${(p.val >> i) & 1}`);
    const size = 16 / (p.mask === 0 ? 16 : (1 << (4 - popcount(p.mask))));
    return `gruppo da ${size} celle con ${fixed.join(', ')}`;
  }).join('; ');

  return {
    kind: 'mc', topicId: 'L-karnaugh', course: 'logica',
    prompt: `Data la seguente mappa di Karnaugh (righe \\( ab \\), colonne \\( cd \\), ordine di Gray), quale è la **forma minima somma di prodotti**? \\[ ${kmap()} \\]`,
    choices: opts.map(o => ({ tex: T(o.tex) })),
    answer,
    solution: [
      `**Metodo.** Si raggruppano le celle a 1 in rettangoli di dimensione potenza di 2 (1, 2, 4, 8, 16), i più grandi possibile e senza ripetizioni inutili, sfruttando l'adiacenza in ordine di Gray (anche agli estremi della mappa).`,
      `**Gruppi scelti.** ${groupsDesc}.`,
      `**Formula minima.** Ogni gruppo dà un prodotto con le sole variabili costanti nel gruppo: \\[ ${correctTex} \\]`,
      `**Controllo.** Le altre opzioni: una aggiunge un implicante ridondante (equivalente ma non minima), una lascia celle a 1 non coperte (non equivalente), una minimizza la funzione complementare.`,
    ],
    estSec: 150, source: 'generatore · Karnaugh',
  };
}

/* ================================================================
   5. PRIMO ORDINE — implicanza logica tra formule quantificate
   ================================================================ */

const FO_POOL = [
  {
    A: '\\exists x\\,[P(x) \\land Q(x)]', B: '\\exists x\\,P(x) \\land \\exists x\\,Q(x)',
    aImpB: true, bImpA: false,
    ceB: `dominio \\( \\{1, 2\\} \\), \\( P = \\{1\\} \\), \\( Q = \\{2\\} \\): valgono \\( \\exists x P(x) \\) e \\( \\exists x Q(x) \\) ma nessun elemento soddisfa entrambe`,
    why: `se un testimone soddisfa \\( P \\land Q \\) allora è testimone sia di \\( P \\) che di \\( Q \\)`,
  },
  {
    A: '\\forall x\\,P(x) \\lor \\forall x\\,Q(x)', B: '\\forall x\\,[P(x) \\lor Q(x)]',
    aImpB: true, bImpA: false,
    ceB: `dominio \\( \\{1,2\\} \\), \\( P = \\{1\\} \\), \\( Q = \\{2\\} \\): ogni elemento soddisfa \\( P \\lor Q \\) ma \\( P \\) non vale ovunque né \\( Q \\)`,
    why: `se \\( P \\) vale per ogni elemento (o \\( Q \\)), allora a maggior ragione in ogni punto vale \\( P \\) o \\( Q \\)`,
  },
  {
    A: '\\exists x\\,\\forall y\\,P(x,y)', B: '\\forall y\\,\\exists x\\,P(x,y)',
    aImpB: true, bImpA: false,
    ceB: `dominio \\( \\{1,2\\} \\), \\( P(x,y) \\equiv x = y \\): per ogni \\( y \\) esiste \\( x = y \\), ma nessun unico \\( x \\) funziona per tutti`,
    why: `il testimone universale di \\( A \\) serve anche come testimone per ogni \\( y \\) in \\( B \\)`,
  },
  {
    A: '\\forall x\\,[P(x) \\to Q(x)]', B: '(\\exists x\\,P(x)) \\to (\\exists x\\,Q(x))',
    aImpB: true, bImpA: false,
    ceB: `dominio \\( \\{1,2\\} \\), \\( P = \\{1\\} \\), \\( Q = \\{2\\} \\): se esiste un \\( P \\) allora deve esistere un \\( Q \\)... qui \\( P(1) \\) e \\( Q(2) \\): \\( B \\) vale; serve controesempio per \\( B \\to A \\): dominio \\( \\{1,2\\} \\), \\( P=\\{1\\} \\), \\( Q=\\{2\\} \\): \\( B \\) vera, \\( A \\) falsa perché \\( P(1) \\land \\lnot Q(1) \\)`,
    why: `il testimone di \\( \\exists x P(x) \\) soddisfa anche \\( Q \\) per l'implicazione universale`,
  },
];

function genFo() {
  const q = pick(FO_POOL);
  const which = rint(0, 3);
  const [stmt, val] = [
    [`\\( A \\) implica logicamente \\( B \\)`, q.aImpB],
    [`\\( B \\) implica logicamente \\( A \\)`, q.bImpA],
    [`\\( A \\) e \\( B \\) sono logicamente equivalenti`, q.aImpB && q.bImpA],
    [`\\( A \\) è una formula soddisfacibile`, true],
  ][which];
  return {
    kind: 'tf', topicId: 'L-fo', course: 'logica',
    prompt: `Si considerino le formule \\[ A: \\; ${q.A} \\qquad B: \\; ${q.B} \\] Vero o falso: ${stmt}?`,
    choices: [{ text: 'Vero' }, { text: 'Falso' }],
    answer: val ? 0 : 1,
    solution: [
      `**Quadro completo della coppia.** \\( A \\models B \\): ${q.aImpB ? 'sì' : 'no'}; \\( B \\models A \\): ${q.bImpA ? 'sì' : 'no'}; equivalenti: ${q.aImpB && q.bImpA ? 'sì' : 'no'}.`,
      `**Perché \\( A \\models B \\)** ${q.aImpB ? `— vero: ${q.why}.` : '— falso: vedere il controesempio sotto.'}`,
      q.bImpA ? `**Perché \\( B \\models A \\)** — vero per simmetria dell'argomento.` : `**Controesempio per l'altra direzione.** Prendi ${q.ceB}: lì \\( B \\) è vera e \\( A \\) è falsa.`,
      `**Tableaux.** Per dimostrare la validità di \\( A \\to B \\) si apre il tableaux con \\( A \\to B \\) falsa: ramo sinistro \\( A \\) vera, ramo destro \\( B \\) falsa; se tutti i rami chiudono la formula è valida. Per la non validità basta il controesempio esplicito.`,
    ],
    estSec: 120, source: 'generatore · primo ordine',
  };
}

/* ================================================================
   6. CODIFICHE — binario/hex/complemento a due
   ================================================================ */

function genCodifiche() {
  const which = rint(0, 4);
  if (which === 0) {
    // hex -> decimale
    const n = rint(0x100, 0xffff);
    const h = toHex(n, 4);
    return {
      kind: 'numeric', topicId: 'L-codifiche', course: 'logica',
      prompt: `Qual è il numero corrispondente alla sequenza di cifre esadecimali \\( \\mathtt{${h}} \\) interpretata in binario puro (unsigned)?`,
      answer: String(n),
      solution: [
        `**Conversione.** Ogni cifra esadecimale sono 4 bit: \\( ${[...h].map(c => `${c}_{16} = ${parseInt(c, 16).toString(2).padStart(4, '0')}_2`).join(',\\; ')} \\).`,
        `**In decimale.** \\( ${[...h].map((c, i) => `${parseInt(c, 16)}\\cdot 16^{${3 - i}}`).join(' + ')} = ${[...h].map((c, i) => parseInt(c, 16) * (1 << (4 * (3 - i)))).join(' + ')} = ${n} \\)`,
        `Alternativa: converti in binario e somma le potenze di 2 dei bit a 1.`,
      ],
      estSec: 80, source: 'generatore · codifiche',
    };
  }
  if (which === 1) {
    // complemento a due -> decimale (16 bit)
    const bits = 16;
    const v = rint(-30000, -100);
    const pat = toHex(twosComplement(v, bits), 4);
    return {
      kind: 'numeric', topicId: 'L-codifiche', course: 'logica',
      prompt: `Qual è il numero corrispondente alla sequenza esadecimale \\( \\mathtt{${pat}} \\) interpretata in **complemento a due** su 16 bit?`,
      answer: String(v),
      solution: [
        `**Segno.** Il bit più significativo (prima cifra hex \\( \\ge 8 \\)) è 1: il numero è **negativo**.`,
        `**Valore assoluto.** Si inverte tutto e si aggiunge 1, oppure: \\( |v| = 2^{16} - ${parseInt(pat, 16)} = 65536 - ${parseInt(pat, 16)} = ${-v} \\).`,
        `**Risposta.** \\( v = -${-v} \\)`,
      ],
      estSec: 90, source: 'generatore · codifiche',
    };
  }
  if (which === 2) {
    // decimale negativo -> complemento a due hex (MC)
    const bits = pick([8, 12, 16]);
    const v = -rint(5, (1 << (bits - 1)) - 1);
    const correct = toHex(twosComplement(v, bits), bits / 4);
    const wrongs = new Set();
    while (wrongs.size < 3) {
      const w = toHex((twosComplement(v, bits) + rint(1, 15)) % (1 << bits), bits / 4);
      if (w.toUpperCase() !== correct.toUpperCase()) wrongs.add(w.toUpperCase());
    }
    const answer = rint(0, 3);
    const opts = [...wrongs];
    opts.splice(answer, 0, correct);
    return {
      kind: 'mc', topicId: 'L-codifiche', course: 'logica',
      prompt: `Scrivi in esadecimale la codifica in **complemento a due** su ${bits} bit del numero \\( ${v} \\).`,
      choices: opts.map(o => ({ tex: T(`\\mathtt{${o}}`) })),
      answer,
      solution: [
        `**Modulo.** \\( |v| = ${-v} = ${(-v).toString(2).replace(/\B(?=(.{4})+$)/g, '\\,') }_2 \\) su ${bits} bit.`,
        `**Inversione + 1.** \\( \\overline{${(-v).toString(2)}} + 1 = ${toBin(twosComplement(v, bits), bits)}_2 \\).`,
        `**Hex.** Raggruppa 4 bit: \\( \\mathtt{${correct}} \\). Scorciatoia: \\( 2^{${bits}} - ${-v} = ${(1 << bits) - (-v)} \\) convertito in hex.`,
      ],
      estSec: 100, source: 'generatore · codifiche',
    };
  }
  if (which === 3) {
    // range rappresentabile
    const bits = pick([4, 8, 10, 12, 16]);
    const askMin = Math.random() < 0.5;
    const val = askMin ? -(1 << (bits - 1)) : (1 << (bits - 1)) - 1;
    return {
      kind: 'numeric', topicId: 'L-codifiche', course: 'logica',
      prompt: `Qual è il ${askMin ? 'minimo' : 'massimo'} intero rappresentabile in complemento a due su ${bits} bit?`,
      answer: String(val),
      solution: [
        `**Intervallo.** Con \\( n \\) bit: \\( [-2^{n-1},\\; 2^{n-1}-1] \\). Con \\( n = ${bits} \\): \\( [-${1 << (bits - 1)},\\; ${-1 + (1 << (bits - 1))}] \\).`,
        `**Perché.** Il pattern \\( 100\\ldots0 \\) vale \\( -2^{n-1} \\); \\( 011\\ldots1 \\) vale \\( 2^{n-1}-1 \\). Sono \\( 2^n \\) valori, metà negativi e uno in più rispetto ai positivi (per lo zero).`,
      ],
      estSec: 70, source: 'generatore · codifiche',
    };
  }
  // bin -> hex veloce
  const bits = pick([8, 12]);
  const n = rint(1, (1 << bits) - 1);
  const b = toBin(n, bits);
  const correct = toHex(n, bits / 4);
  const wrongs = new Set();
  while (wrongs.size < 3) {
    const w = toHex((n + rint(1, 20)) % (1 << bits), bits / 4);
    if (w !== correct) wrongs.add(w);
  }
  const answer = rint(0, 3);
  const opts = [...wrongs];
  opts.splice(answer, 0, correct);
  return {
    kind: 'mc', topicId: 'L-codifiche', course: 'logica',
    prompt: `Esprimi in esadecimale il numero binario \\( ${b}_2 \\).`,
    choices: opts.map(o => ({ tex: T(`\\mathtt{${o}}`) })),
    answer,
    solution: [
      `**Raggruppamento.** Si raggruppano i bit a 4 a 4 da destra: \\( ${b.replace(/\B(?=(.{4})+$)/g, '\\,')} \\)`,
      `**Conversione.** Ogni gruppo di 4 bit diventa una cifra hex: \\( \\mathtt{${correct}} \\).`,
    ],
    estSec: 60, source: 'generatore · codifiche',
  };
}

/* ================================================================
   7. RETI — MUX, decoder, adder (domande concettuali parametriche)
   ================================================================ */

function genReti() {
  const which = rint(0, 4);
  if (which === 0) {
    const n = pick([4, 8, 16, 32]);
    const sel = Math.log2(n);
    return {
      kind: 'numeric', topicId: 'L-reti', course: 'logica',
      prompt: `Un Multiplexer \\( ${n}:1 \\) ha quante linee di selezione?`,
      answer: String(sel),
      solution: [
        `**Motivo.** Con \\( k \\) linee di selezione si distinguono \\( 2^k \\) ingressi: serve \\( 2^k = ${n} \\), cioè \\( k = ${sel} \\).`,
      ],
      estSec: 45, source: 'generatore · reti',
    };
  }
  if (which === 1) {
    const n = pick([2, 3, 4, 5]);
    const out = 1 << n;
    return {
      kind: 'numeric', topicId: 'L-reti', course: 'logica',
      prompt: `Un Decoder \\( ${n}\\!:\\!${out} \\) ha quante uscite?`,
      answer: String(out),
      solution: [
        `**Motivo.** Il decoder attiva esattamente una uscita per ogni combinazione dei \\( ${n} \\) bit di ingresso: \\( 2^{${n}} = ${out} \\) uscite.`,
        `**Uso tipico.** Con \\( ${out} \\) porte Or a più ingressi realizza qualunque funzione booleana delle \\( ${n} \\) variabili: le uscite del decoder sono i mintermini.`,
      ],
      estSec: 45, source: 'generatore · reti',
    };
  }
  if (which === 2) {
    const n = rint(3, 5);
    return {
      kind: 'numeric', topicId: 'L-reti', course: 'logica',
      prompt: `Quante righe ha la tavola di verità di una funzione booleana di ${n} variabili?`,
      answer: String(1 << n),
      solution: [`Ogni variabile vale 0 o 1: \\( 2^{${n}} = ${1 << n} \\) interpretazioni/distinte combinazioni.`],
      estSec: 40, source: 'generatore · reti',
    };
  }
  if (which === 3) {
    // circuito: resto mod 3
    return {
      kind: 'numeric', topicId: 'L-reti', course: 'logica',
      prompt: `Un circuito sequenziale deve calcolare il resto della divisione per 3 del numero di impulsi ricevuti in ingresso. Quanti **stati** interni servono come minimo?`,
      answer: '3',
      solution: [
        `**Automa.** Il resto mod 3 ha 3 valori possibili (0, 1, 2): servono almeno 3 stati, uno per valore.`,
        `**Transizioni.** Ad ogni impulso lo stato passa da \\( r \\) a \\( (r+1) \\bmod 3 \\): \\( 0 \\to 1 \\to 2 \\to 0 \\). Con 2 bit di stato (4 configurazioni) si codificano i 3 stati.`,
      ],
      estSec: 60, source: 'generatore · reti',
    };
  }
  // MUX annidati
  const inner = pick([4, 8]);
  return {
    kind: 'numeric', topicId: 'L-reti', course: 'logica',
    prompt: `Per costruire un Multiplexer ${inner * 2}:1 usando due Multiplexer ${inner}:1 e un Multiplexer 2:1, quante linee di selezione si usano in totale?`,
    answer: String(Math.log2(inner * 2)),
    solution: [
      `**Schema.** \\( \\log_2 ${inner} = ${Math.log2(inner)} \\) bit selezionano dentro ciascun MUX ${inner}:1 (in parallelo), l'ultimo bit seleziona tra le due uscite con il MUX 2:1.`,
      `**Totale.** \\( ${Math.log2(inner)} + 1 = ${Math.log2(inner * 2)} \\) linee — esattamente quelle di un MUX ${inner * 2}:1.`,
    ],
    estSec: 60, source: 'generatore · reti',
  };
}

/* ================================================================ */

export const LOGICA_GENS = {
  L_induzione: genInduzione,
  L_prop: genProp,
  L_fnf: genFnf,
  L_karnaugh: genKarnaugh,
  L_fo: genFo,
  L_codifiche: genCodifiche,
  L_reti: genReti,
};
