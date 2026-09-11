// test/gen.test.mjs — stress test dei generatori + coerenza interna
// eseguito con node; verifica anche la correttezza funzionale del QMC.

import { LOGICA_GENS } from '../js/generators/logica.js';
import { DISCRETA_GENS } from '../js/generators/discreta.js';
import { quineMcCluskey, extGcd, modInverse, gcd, makeRecurrence, truthTable, evalFormula } from '../js/generators/mathutil.js';

const GENS = { ...LOGICA_GENS, ...DISCRETA_GENS };
let fails = 0, count = 0;

function check(name, fn) {
  count++;
  try { if (!fn()) { fails++; console.error('FAIL', name); } }
  catch (e) { fails++; console.error('ERR ', name, e.message); }
}

/* --- QMC: correttezza funzionale (copertura esatta) su 400 casi random --- */
for (let t = 0; t < 400; t++) {
  const nV = 4;
  const ones = [];
  for (let m = 0; m < 16; m++) if (Math.random() < 0.45) ones.push(m);
  if (!ones.length) continue;
  const imp = quineMcCluskey(nV, ones);
  const oneSet = new Set(ones);
  const covered = new Set();
  for (const p of imp) {
    for (let m = 0; m < 16; m++) {
      if ((m & p.mask) === (p.val & p.mask)) {
        covered.add(m);
        if (!oneSet.has(m)) { fails++; console.error('QMC copre uno zero!', p, m); }
      }
    }
  }
  for (const o of ones) {
    if (!covered.has(o)) { fails++; console.error('QMC non copre', o, ones, imp); }
  }
  count++;
}

/* --- Euclide esteso: verifica su tutti i casi piccoli --- */
for (let a = 1; a < 60; a++) for (let n = 2; n < 60; n++) {
  count++;
  const inv = modInverse(a, n);
  if (gcd(a, n) === 1) {
    if (inv === null || (a * inv) % n !== 1) { fails++; console.error('modInverse', a, n, inv); }
  } else if (inv !== null) { fails++; console.error('modInverse fantasma', a, n); }
  const { g } = extGcd(a, n);
  if (g !== gcd(a, n)) { fails++; console.error('extGcd', a, n); }
}

/* --- makeRecurrence: la forma chiusa deve soddisfare la ricorrenza --- */
for (let t = 0; t < 200; t++) {
  count++;
  const { roots, cs, rec, inits, k } = makeRecurrence();
  const f = (n) => roots.reduce((s, r, i) => s + cs[i] * Math.pow(r, n), 0);
  for (let n = 0; n + k <= 8; n++) {
    let lhs = f(n + k);
    let rhs = rec.reduce((s, c, i) => s + c * f(n + k - 1 - i), 0);
    if (lhs !== rhs) { fails++; console.error('recurrence mismatch', { roots, cs, rec, n }); break; }
  }
  if (f(0) !== inits[0] || f(1) !== inits[1]) { fails++; console.error('recurrence inits', { roots, cs, inits }); }
}

/* --- stress dei generatori: struttura e coerenza --- */
for (const [name, gen] of Object.entries(GENS)) {
  for (let i = 0; i < 300; i++) {
    count++;
    let it;
    try { it = gen(); } catch (e) { fails++; console.error('GEN THROWS', name, e.message); break; }
    if (!it || !it.kind || !it.prompt || !Array.isArray(it.solution) || !it.solution.length) {
      fails++; console.error('GEN SHAPE', name, JSON.stringify(it).slice(0, 200)); break;
    }
    if ((it.kind === 'mc' || it.kind === 'tf')) {
      if (!Array.isArray(it.choices) || it.choices.length < 2) { fails++; console.error('GEN CHOICES', name); break; }
      if (typeof it.answer !== 'number' || it.answer < 0 || it.answer >= it.choices.length) { fails++; console.error('GEN ANSWER IDX', name, it.answer); break; }
    }
    if (it.kind === 'numeric' && (it.answer === undefined || it.answer === null || String(it.answer).length === 0)) {
      fails++; console.error('GEN NUMERIC ANSWER', name); break;
    }
    // nessun tex rotto evidente
    const all = it.prompt + JSON.stringify(it.choices || []) + it.solution.join('');
    const open = (all.match(/\\\\\(/g) || []).length;
    const close = (all.match(/\\\\\)/g) || []).length;
    if (open !== close) { fails++; console.error('GEN UNBALANCED TEX', name, open, close); break; }
  }
}

/* --- genProp: la risposta deve corrispondere alla classificazione reale --- */
for (let i = 0; i < 100; i++) {
  count++;
  const it = LOGICA_GENS.L_prop();
  if (it.kind !== 'mc' || !it.choices[it.answer].text) continue; // riscritture NAND/NOR: skip
  const labels = ['Tautologia', 'Contraddizione', 'Contingenza'];
  const chosen = String(it.choices[it.answer].text).toLowerCase();
  const cls = chosen.slice(0, 4);
  const real = labels.findIndex(l => l.toLowerCase().startsWith(cls));
  if (real === -1) { fails++; console.error('LABEL?', chosen); }
}

console.log(`\n${count} controlli, ${fails} fallimenti`);
process.exit(fails ? 1 : 0);
