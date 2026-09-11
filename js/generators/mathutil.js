// mathutil.js — utility matematiche per i generatori
// Tutto calcolato qui: le soluzioni mostrate derivano da questi calcoli.

import { rint, pick } from '../ui.js';

/* ---------- aritmetica modulare ---------- */

export function gcd(a, b) { a = Math.abs(a); b = Math.abs(b); while (b) { [a, b] = [b, a % b]; } return a; }

// Euclide esteso: ritorna {g, x, y} con a*x + b*y = g
export function extGcd(a, b) {
  let old_r = a, r = b, old_s = 1, s = 0, old_t = 0, t = 1;
  const steps = [];
  while (r !== 0) {
    const q = Math.floor(old_r / r);
    steps.push({ q, a: old_r, b: r });
    [old_r, r] = [r, old_r - q * r];
    [old_s, s] = [s, old_s - q * s];
    [old_t, t] = [t, old_t - q * t];
  }
  return { g: old_r, x: old_s, y: old_t, steps };
}

// inverso di a mod n (null se non esiste)
export function modInverse(a, n) {
  a = ((a % n) + n) % n;
  const { g, x } = extGcd(a, n);
  if (g !== 1) return null;
  return ((x % n) + n) % n;
}

export function modPow(b, e, m) {
  let r = 1n; b = BigInt(b) % BigInt(m); e = BigInt(e);
  const M = BigInt(m);
  while (e > 0n) {
    if (e & 1n) r = (r * b) % M;
    b = (b * b) % M;
    e >>= 1n;
  }
  return Number(r);
}

/* ---------- logica proposizionale ---------- */

// formula: {op:'var', name} | {op:'and'|'or'|'not'|'imp'|'iff'|'nand'|'nor', a, b?}
export function evalFormula(f, env) {
  switch (f.op) {
    case 'var': return !!env[f.name];
    case 'not': return !evalFormula(f.a, env);
    case 'and': return evalFormula(f.a, env) && evalFormula(f.b, env);
    case 'or': return evalFormula(f.a, env) || evalFormula(f.b, env);
    case 'imp': return !evalFormula(f.a, env) || evalFormula(f.b, env);
    case 'iff': return evalFormula(f.a, env) === evalFormula(f.b, env);
    case 'nand': return !(evalFormula(f.a, env) && evalFormula(f.b, env));
    case 'nor': return !(evalFormula(f.a, env) || evalFormula(f.b, env));
  }
}

export function texFormula(f) {
  switch (f.op) {
    case 'var': return f.name;
    case 'not': return '\\lnot ' + texPar(f.a, f);
    case 'and': return texPar(f.a, f) + ' \\land ' + texPar(f.b, f);
    case 'or': return texPar(f.a, f) + ' \\lor ' + texPar(f.b, f);
    case 'imp': return texPar(f.a, f) + ' \\to ' + texPar(f.b, f);
    case 'iff': return texPar(f.a, f) + ' \\leftrightarrow ' + texPar(f.b, f);
    case 'nand': return texPar(f.a, f) + ' \\mid ' + texPar(f.b, f);
    case 'nor': return texPar(f.a, f) + ' \\downarrow ' + texPar(f.b, f);
  }
}
const PREC = { var: 9, not: 8, and: 5, or: 4, imp: 3, iff: 2, nand: 5, nor: 4 };
function texPar(sub, parent) {
  const s = texFormula(sub);
  if (PREC[sub.op] < PREC[parent.op]) return `( ${s} )`;
  return s;
}

export function varsOf(f, acc = new Set()) {
  if (f.op === 'var') acc.add(f.name);
  else { varsOf(f.a, acc); if (f.b) varsOf(f.b, acc); }
  return [...acc];
}

// tavola di verità: [{env..., v:bool}]
export function truthTable(f) {
  const vs = varsOf(f).sort();
  const rows = [];
  for (let mask = (1 << vs.length) - 1; mask >= 0; mask--) {
    const env = {};
    vs.forEach((v, i) => env[v] = !!((mask >> (vs.length - 1 - i)) & 1));
    rows.push({ ...env, v: evalFormula(f, env) });
  }
  return rows;
}

export function classify(f) {
  const tt = truthTable(f);
  if (tt.every(r => r.v)) return 'tautologia';
  if (tt.every(r => !r.v)) return 'contraddizione';
  return 'contingenza';
}

export function equiv(f, g) {
  const tt1 = truthTable(f), tt2 = truthTable(g);
  if (tt1.length !== tt2.length) {
    // confronto su unione delle variabili
    const vs = [...new Set([...varsOf(f), ...varsOf(g)])].sort();
    for (let mask = (1 << vs.length) - 1; mask >= 0; mask--) {
      const env = {};
      vs.forEach((v, i) => env[v] = !!((mask >> (vs.length - 1 - i)) & 1));
      if (evalFormula(f, env) !== evalFormula(g, env)) return false;
    }
    return true;
  }
  return tt1.every((r, i) => r.v === tt2[i].v);
}

// genera formula casuale su n variabili con profondità limitata
export function randFormula(vars, depth, rng = Math.random, ops = ['and', 'or', 'imp', 'iff']) {
  if (depth === 0 || rng() < 0.28) return { op: 'var', name: pick(vars, rng) };
  if (rng() < 0.2) return { op: 'not', a: randFormula(vars, depth - 1, rng, ops) };
  const op = pick(ops, rng);
  return { op, a: randFormula(vars, depth - 1, rng, ops), b: randFormula(vars, depth - 1, rng, ops) };
}

/* ---------- algebra booleana per Karnaugh / FND ---------- */

// minimizzazione SOP via Quine-McCluskey su n variabili
// minterms: indici dove y=1. Ritorna lista di implicanti {mask, val}:
// mask ha bit 1 dove la variabile è FISSATA, 0 dove è '-' (libera).
function covers0(m, mask, val) { return (m & mask) === (val & mask); }

export function quineMcCluskey(nVars, minterms) {
  const ALL = (1 << nVars) - 1;
  let current = minterms.map(m => ({ mask: ALL, val: m }));
  const primes = [];
  while (true) {
    const next = new Map(); // key -> {mask,val}
    const combined = new Set();
    for (let i = 0; i < current.length; i++) {
      for (let j = i + 1; j < current.length; j++) {
        const p = current[i], q = current[j];
        if (p.mask !== q.mask) continue;
        const diff = p.val ^ q.val;
        if (popcount(diff) === 1) {
          // combina: il bit che differisce viene liberato (azzerato in val, rimosso da mask)
          const np = { mask: p.mask & ~diff, val: p.val & ~diff };
          next.set(np.mask + ':' + np.val, np);
          combined.add(p.mask + ':' + p.val);
          combined.add(q.mask + ':' + q.val);
        }
      }
    }
    for (const p of current) if (!combined.has(p.mask + ':' + p.val)) primes.push(p);
    if (!next.size) break;
    current = [...next.values()];
  }

  // selezione: essenziali + greedy cover
  const uncovered = new Set(minterms);
  const chosen = [];
  // essenziali
  for (const m of minterms) {
    const covering = primes.filter(p => covers0(m, p.mask, p.val));
    if (covering.length === 1) {
      const p = covering[0];
      if (!chosen.includes(p)) { chosen.push(p); for (const c of uncovered) if (covers0(c, p.mask, p.val)) uncovered.delete(c); }
    }
  }
  // greedy sui restanti
  while (uncovered.size) {
    let best = null, bestN = -1;
    for (const p of primes) {
      if (chosen.includes(p)) continue;
      let n = 0; for (const m of uncovered) if (covers0(m, p.mask, p.val)) n++;
      if (n > bestN) { bestN = n; best = p; }
    }
    if (!best || bestN === 0) break;
    chosen.push(best);
    for (const m of [...uncovered]) if (covers0(m, best.mask, best.val)) uncovered.delete(m);
  }
  // potatura: una scelta greedy successiva può aver reso ridondante un implicante
  const fullCover = (list) => {
    const cov = new Set();
    for (const p of list) for (let m = 0; m < (1 << nVars); m++) if (covers0(m, p.mask, p.val)) cov.add(m);
    return minterms.every(m => cov.has(m));
  };
  for (let i = chosen.length - 1; i >= 0; i--) {
    if (fullCover(chosen.filter((_, j) => j !== i))) chosen.splice(i, 1);
  }
  return chosen;
}

export function popcount(x) { let c = 0; while (x) { x &= x - 1; c++; } return c; }

// implicant -> termine SOP in LaTeX su variabili x_{n-1}..x_0
export function sopTermTex(mask, val, nVars, names) {
  const parts = [];
  for (let i = nVars - 1; i >= 0; i--) {
    if (mask & (1 << i)) parts.push((val & (1 << i)) ? names[i] : '\\bar{' + names[i] + '}');
  }
  return parts.length ? parts.join('') : '1';
}

export function sopTex(implicants, nVars, names) {
  return implicants.map(p => sopTermTex(p.mask, p.val, nVars, names)).join(' + ');
}

/* ---------- ricorsioni lineari ---------- */

// genera ricorrenza con radici intere distinte e forma chiusa pulita
export function makeRecurrence(rng = Math.random) {
  const rootsPool = [2, 3, -2, -1, 1, 4, -3];
  const order = rint(2, 3, rng);
  const roots = [];
  while (roots.length < order) {
    const r = pick(rootsPool, rng);
    if (!roots.includes(r)) roots.push(r);
  }
  // polinomio caratteristico: prod (x - r_i) = x^k - c1 x^{k-1} - ...
  let coeffs = [1]; // poly in x, coefficienti da grado alto
  for (const r of roots) {
    // moltiplica per (x - r)
    const next = new Array(coeffs.length + 1).fill(0);
    for (let i = 0; i < coeffs.length; i++) {
      next[i] += coeffs[i];
      next[i + 1] -= r * coeffs[i];
    }
    coeffs = next;
  }
  // coeffs: [1, -s1, s2, ...] per ordine k
  const k = order;
  // ricorrenza: f(n+k) = a1 f(n+k-1) + ... + ak f(n) con ai = -coeffs[i]
  const rec = [];
  for (let i = 1; i <= k; i++) rec.push(-coeffs[i]);
  // forma chiusa con coefficienti piccoli
  const cs = roots.map(() => rint(1, 3, rng) * (rng() < 0.35 ? -1 : 1));
  const f0 = roots.reduce((s, r, i) => s + cs[i] * Math.pow(r, 0), 0);
  const f1 = roots.reduce((s, r, i) => s + cs[i] * Math.pow(r, 1), 0);
  const f2 = roots.length >= 2 ? roots.reduce((s, r, i) => s + cs[i] * Math.pow(r, 2), 0) : 0;
  return { roots, cs, rec, inits: [f0, f1, f2].slice(0, k), k };
}

/* ---------- codifiche ---------- */

export function toHex(n, digits = 4) { return n.toString(16).toUpperCase().padStart(digits, '0'); }
export function toBin(n, bits) { return (n >>> 0).toString(2).padStart(bits, '0'); }
export function twosComplement(v, bits) { return ((v % (1 << bits)) + (1 << bits)) % (1 << bits); }
