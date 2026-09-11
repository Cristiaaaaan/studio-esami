# test/crosscheck.py — verifica INDIPENDENTE (Python) dei vettori prodotti dal JS
# 1. modInverse confrontato con pow(a, -1, n) nativo di Python
# 2. QMC: copertura esatta + primalità di ogni implicante + non ridondanza
# 3. ricorrenze: la forma chiusa rispetta ricorrenza e condizioni iniziali

import json, math, itertools, sys

V = json.load(open('test/vectors.json', encoding='utf-8'))
fails = 0

# --- 1. inversa modulare ---
for a, n, js_inv in V['mod']:
    g = math.gcd(a, n)
    if g == 1:
        py_inv = pow(a, -1, n)
        if js_inv is None or js_inv != py_inv:
            fails += 1
            print('MOD FAIL', a, n, js_inv, py_inv)
    else:
        if js_inv is not None:
            fails += 1
            print('MOD fantasma', a, n)

# --- 2. QMC ---
def covers(m, mask, val):
    return (m & mask) == (val & mask)

for case in V['qmc']:
    ones = set(case['ones'])
    imp = [tuple(x) for x in case['imp']]
    covered = set()
    for mask, val in imp:
        cells = {m for m in range(16) if covers(m, mask, val)}
        if cells - ones:
            fails += 1
            print('QMC copre zeri', case)
            break
        covered |= cells
    else:
        if covered != ones:
            fails += 1
            print('QMC copertura incompleta', sorted(ones), sorted(covered))
            continue
        # primalità: liberare un bit qualsiasi deve coprire uno zero
        for mask, val in imp:
            for b in range(4):
                if mask & (1 << b):
                    nm = mask & ~(1 << b)
                    if all(covers(m, nm, val) for m in range(16) if covers(m, mask, val)) and \
                       not any(covers(m, nm, val) for m in range(16) if m not in ones):
                        fails += 1
                        print('QMC non primo', mask, val, case['ones'])
        # non ridondanza: togliere un implicante scopre un uno
        for i, (mask, val) in enumerate(imp):
            rest = set()
            for j, (m2, v2) in enumerate(imp):
                if j != i:
                    rest |= {m for m in range(16) if covers(m, m2, v2)}
            if rest >= ones:
                fails += 1
                print('QMC implicante ridondante', mask, val, case['ones'])

# --- 3. ricorrenze ---
for r in V['rec']:
    f = lambda n: sum(c * base ** n for c, base in zip(r['cs'], r['roots']))
    k = r['k']
    for n in range(0, 9 - k):
        lhs = f(n + k)
        rhs = sum(c * f(n + k - 1 - i) for i, c in enumerate(r['rec']))
        if lhs != rhs:
            fails += 1
            print('REC mismatch', r)
            break
    if f(0) != r['inits'][0] or f(1) != r['inits'][1]:
        fails += 1
        print('REC inits', r)

print(f"controverifica Python: {len(V['mod'])} mod + {len(V['qmc'])} qmc + {len(V['rec'])} rec — {fails} fallimenti")
sys.exit(1 if fails else 0)
