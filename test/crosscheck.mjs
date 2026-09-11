// test/crosscheck.mjs — esporta vettori di test per il controverifica Python
import { quineMcCluskey, modInverse, makeRecurrence } from '../js/generators/mathutil.js';
import { writeFileSync } from 'fs';

const out = { qmc: [], mod: [], rec: [] };

for (let t = 0; t < 300; t++) {
  const ones = [];
  for (let m = 0; m < 16; m++) if (Math.random() < 0.45) ones.push(m);
  if (3 <= ones.length && ones.length <= 13) {
    out.qmc.push({ ones, imp: quineMcCluskey(4, ones).map(p => [p.mask, p.val]) });
  }
}
for (let t = 0; t < 200; t++) {
  const n = 50 + Math.floor(Math.random() * 200);
  const a = 3 + Math.floor(Math.random() * (n - 3));
  out.mod.push([a, n, modInverse(a, n)]);
}
for (let t = 0; t < 100; t++) {
  const r = makeRecurrence();
  out.rec.push({ roots: r.roots, cs: r.cs, rec: r.rec, inits: r.inits, k: r.k });
}
writeFileSync('test/vectors.json', JSON.stringify(out));
console.log('vettori scritti: ', out.qmc.length, out.mod.length, out.rec.length);
