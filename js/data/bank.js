// bank.js — compiti d'esame veri, trascritti con soluzione guidata.
// kind: 'open' = esercizio stile esame con autovalutazione; 'mc'|'tf'|'numeric' = quiz ricavato dal compito.

const O = (id, exam, topicId, course, points, prompt, solution, source, kind = 'open') =>
  ({ id, exam, topicId, course, points, prompt, solution, source, kind, estSec: 300 });

/* ============================ LOGICA 2024-25 ============================ */

const L2425 = { id: 'L2425', course: 'logica', label: 'a.a. 2024-2025' };

export const EXAMS_LOGICA = [
  {
    id: 'L-test1a-2425', label: 'Primo Test Intermedio — Compito A', date: '2024-11-21', course: 'logica', group: '2024-2025',
    items: [
      O('L-t1a24-1', 'L-test1a-2425', 'L-induzione', 'logica', 6,
        `Sia \\( {a_n} \\) definita da \\( a_0 = 5 \\) e \\( a_n = (a_{n-1})^2 \\). Quale affermazione è corretta? Dimostrarla per induzione: 1. \\( a_n = 5(n+1)^2 \\) 2. \\( a_n = 5^{2n} \\) 3. \\( a_n = 5\\cdot 5^{2n} \\) 4. \\( a_n = 5^{n+1} \\) 5. \\( a_n = 5\\cdot(n+1)! \\)`,
        [
          `**Indovina e verifica.** \\( a_1 = 25 = 5^2 \\), \\( a_2 = 625 = 5^4 \\), \\( a_3 = 5^8 \\): il pattern è \\( a_n = 5^{2^n} \\)... attenzione alle opzioni: \\( 5^{2n} \\) (opzione 2) dà \\( 5^2, 5^4, 5^6 \\): combacia su \\( n=1,2 \\) ma \\( a_3 = 5^8 \\ne 5^6 \\). L'opzione corretta è quindi la **2? No**: nessuna delle prime combacia ovunque — l'esame vuole \\( 5^{2^n} \\), ricadente nell'opzione 6 "Nessuna delle precedenti".`,
          `**Dimostrazione (per l'opzione giusta \\( a_n = 5^{2^n} \\)).** Base: \\( a_0 = 5 = 5^{2^0} \\) ✓. Passo: \\( a_{n+1} = (a_n)^2 = (5^{2^n})^2 = 5^{2\\cdot 2^n} = 5^{2^{n+1}} \\) ✓.`,
          `**Morale.** Verifica sempre **tre** valori: i pattern \\( 5^{2n} \\) e \\( 5^{2^n} \\) coincidono per \\( n = 1, 2 \\) e si separano solo da \\( n = 3 \\).`,
        ], 'Test 1A 2024-25 · Es. 1'),
      O('L-t1a24-2', 'L-test1a-2425', 'L-prop', 'logica', 6,
        `Dire se \\( \\bigl[(p \\to (q \\land r)) \\lor (s \\to (q \\land r))\\bigr] \\to \\bigl[(p \\lor s) \\to (q \\land r)\\bigr] \\) è tautologia, contraddizione o contingenza.`,
        [
          `**Riscrittura.** Antecedente: \\( (\\lnot p \\lor qr) \\lor (\\lnot s \\lor qr) = \\lnot p \\lor \\lnot s \\lor qr = \\lnot(p \\land s) \\lor qr \\). Conseguente: \\( \\lnot(p \\lor s) \\lor qr = (\\lnot p \\land \\lnot s) \\lor qr \\).`,
          `**Controesempio.** Antecedente vero e conseguente falso: serve \\( qr = 0 \\), \\( p \\land s \\) non entrambi 1 (antecedente), ma \\( p \\lor s = 1 \\) e non entrambi 0 (conseguente falso richiede \\( \\lnot p \\land \\lnot s \\) falso). Prendi \\( p = 1, s = 0, q = r = 0 \\): antecedente \\( \\lnot p \\lor \\lnot s = 0 \\lor 1 = 1 \\); conseguente \\( (0 \\land 1) \\lor 0 = 0 \\).`,
          `**E c'è anche un modello vero** (tutto a 0 dell'antecedente): quindi né tautologia né contraddizione → **contingenza**.`,
        ], 'Test 1A 2024-25 · Es. 2'),
      O('L-t1a24-3', 'L-test1a-2425', 'L-prop', 'logica', 6,
        `Scrivere una formula equivalente a \\( (p \\land q) \\lor (\\lnot p \\land \\lnot q) \\) che usi soltanto \\( \\to \\) e \\( \\lnot \\).`,
        [
          `**Riconoscere.** \\( (p \\land q) \\lor (\\lnot p \\land \\lnot q) \\equiv p \\leftrightarrow q \\).`,
          `**Riscrivere.** \\( p \\leftrightarrow q \\equiv (p \\to q) \\land (q \\to p) \\), e \\( A \\land B \\equiv \\lnot(A \\to \\lnot B) \\). Quindi: \\[ \\lnot\\bigl((p \\to q) \\to \\lnot(q \\to p)\\bigr) \\] che usa solo \\( \\to, \\lnot \\).`,
          `**Verifica rapida.** Con \\( p=1, q=0 \\): \\( p \\to q = 0 \\), \\( (0) \\to \\ldots = 1 \\), negato = 0; l'originale vale 0 ✓.`,
        ], 'Test 1A 2024-25 · Es. 3'),
    ],
  },
  {
    id: 'L-test1b-2425', label: 'Primo Test Intermedio — Compito B', date: '2024-11-21', course: 'logica', group: '2024-2025',
    items: [
      O('L-t1b24-2', 'L-test1b-2425', 'L-prop', 'logica', 6,
        `Dire se \\( \\bigl[(p \\lor q) \\to (r \\land s)\\bigr] \\to \\bigl[(p \\to (r \\land s)) \\lor (q \\to (r \\land s))\\bigr] \\) è tautologia, contraddizione o contingenza.`,
        [
          `**Antecedente.** \\( \\lnot(p \\lor q) \\lor rs = (\\lnot p \\land \\lnot q) \\lor rs \\).`,
          `**Conseguente.** \\( (\\lnot p \\lor rs) \\lor (\\lnot q \\lor rs) = \\lnot p \\lor \\lnot q \\lor rs = \\lnot(p \\land q) \\lor rs \\).`,
          `**Implicazione?** Se l'antecedente è vero: o \\( rs = 1 \\) (allora anche il conseguente) oppure \\( \\lnot p \\land \\lnot q \\), che rende \\( \\lnot p \\lor \\lnot q \\) vero: il conseguente è comunque vero → **tautologia**.`,
        ], 'Test 1B 2024-25 · Es. 2'),
      O('L-t1b24-3', 'L-test1b-2425', 'L-prop', 'logica', 6,
        `Scrivere una formula equivalente a \\( (p \\lor q) \\land (\\lnot p \\lor \\lnot q) \\) con soli \\( \\to \\) e \\( \\lnot \\).`,
        [
          `**Riconoscere.** È lo xor: \\( p \\oplus q \\) (vero quando i valori differiscono).`,
          `**Passi.** \\( A \\lor B \\equiv \\lnot A \\to B \\); \\( A \\land B \\equiv \\lnot(A \\to \\lnot B) \\). Con \\( A = p \\), \\( B = q \\), \\( C = \\lnot p \\lor \\lnot q \\equiv p \\to \\lnot q \\): \\[ \\lnot\\bigl(p \\to \\lnot(q \\to \\lnot... )\\bigr) \\] più leggibile: \\[ \\lnot\\Bigl(\\lnot\\bigl(\\lnot p \\to q\\bigr) \\to \\lnot(\\lnot p \\to \\lnot q)\\Bigr) \\] usa solo \\( \\to, \\lnot \\).`,
          `**Verifica.** \\( p=q=1 \\): \\( \\lnot p \\to q = 1 \\), \\( \\lnot p \\to \\lnot q = 1 \\): interno \\( \\lnot 1 \\to \\lnot 1 = 1 \\), negato 0; originale: \\( 0 \\land 0 = 0 \\) ✓.`,
        ], 'Test 1B 2024-25 · Es. 3'),
    ],
  },
  {
    id: 'L-test2-2425', label: 'Secondo Test Intermedio', date: '2025-01-16', course: 'logica', group: '2024-2025',
    items: [
      O('L-t224-1', 'L-test2-2425', 'L-codifiche', 'logica', 6,
        `Scrivere il numero corrispondente alla sequenza esadecimale \\( \\mathtt{C1A0} \\) interpretata 1. in binario puro; 2. in complemento a due a 16 bit.`,
        [
          `**Binario puro.** \\( \\mathtt{C1A0}_{16} = 12\\cdot16^3 + 1\\cdot16^2 + 10\\cdot16 + 0 = 49152 + 256 + 160 = 49568 \\).`,
          `**Complemento a due.** La prima cifra \\( \\mathtt{C} \\ge 8 \\): bit più significativo 1 → numero negativo. Valore: \\( 49568 - 65536 = -15968 \\).`,
          `**Alternativa.** In binario: \\( 1100\\,0001\\,1010\\,0000 \\); si inverte tutto (\\( 0011\\,1110\\,0101\\,1111 = 16000? \\)...) e si aggiunge 1: \\( 0011\\,1110\\,0110\\,0000 = 15968 \\) → \\( -15968 \\) ✓.`,
        ], 'Test 2 2024-25 · Es. 1'),
      O('L-t224-2', 'L-test2-2425', 'L-karnaugh', 'logica', 6,
        `Scrivere la mappa di Karnaugh della tabella di verità (variabili \\( x_3 x_2 x_1 x_0 \\), righe da 0000 a 1111): \\( y = 0\\,0\\,0\\,0\\,1\\,1\\,0\\,1\\,0\\,0\\,1\\,0\\,0\\,1\\,1\\,1 \\) e disegnare il circuito minimo.`,
        [
          `**Mintermini.** Uni alle posizioni \\( m = 4, 5, 7, 10, 13, 14, 15 \\).`,
          `**Gruppi.** ① \\( \\{5,7,13,15\\} \\): quadrato centrale colonna 01-11? In Gray: righe 01 e 11, colonne 01 e 11 → costanti \\( x_2 = 1, x_0 = 1 \\) → termine \\( x_2 x_0 \\). ② \\( \\{10,11,14,15\\} \\): righe 11-10, colonne 11-10 → costanti \\( x_3 = 1, x_1 = 1 \\) → \\( x_3 x_1 \\). ③ \\( \\{4,5\\} \\): coppia → \\( \\bar{x}_3\\, x_2\\, \\bar{x}_1 \\).`,
          `**Formula minima.** \\( y = x_2 x_0 + x_3 x_1 + \\bar{x}_3\\, x_2\\, \\bar{x}_1 \\) (7 lettere totali).`,
          `**Circuiti.** 3 AND (uno a 2 ingressi, uno a 2, uno a 3), 1 NOT per \\( \\bar x_3 \\), 1 OR a 3 ingressi.`,
        ], 'Test 2 2024-25 · Es. 2'),
      O('L-t224-3', 'L-test2-2425', 'L-sequenziali', 'logica', 6,
        `Con tre Full-Adder e tre Flip-Flop progettare un circuito che conti alla rovescia modulo 8.`,
        [
          `**Idea.** Contare alla rovescia = sommare 7 modulo 8 (perché \\( -1 \\equiv 7 \\pmod 8 \\)): \\( y = (x + 111_2) \\bmod 8 \\), dove \\( x \\) è lo stato attuale e \\( y \\) il prossimo stato.`,
          `**Struttura.** I tre bit di stato \\( y_2 y_1 y_0 \\) sono gli output dei tre D-Flip-Flop; gli ingressi D dei FF ricevono le somme dei Full-Adder; gli \\( x_i \\) (output attuali dei FF) tornano agli input degli adder insieme alla costante \\( 111_2 \\); il riporto finale si scarta.`,
          `**Verifica.** \\( 000 + 111 = 111 \\) (da 0 si va a 7 ✓), \\( 111 + 111 = 1110 \\to 110 \\) scartando il riporto (da 7 a 6 ✓).`,
        ], 'Test 2 2024-25 · Es. 3'),
    ],
  },
  {
    id: 'L-ant1a-2425', label: 'Estiva Anticipata 1 Appello — A', date: '2025-01-28', course: 'logica', group: '2024-2025',
    items: [
      O('L-ant1a24-2', 'L-ant1a-2425', 'L-assiomi', 'logica', 6,
        `Sia \\( S \\) definito da A1: \\( X \\to (Y \\to X) \\), A2: \\( [X \\to (Y \\to Z)] \\to [(X \\to Y) \\to (X \\to Z)] \\) e Modus Ponens. Dimostrare \\( \\{p \\to q,\\; q \\to r\\} \\vdash p \\to r \\).`,
        [
          `**1.** \\( q \\to r \\) — ipotesi.`,
          `**2.** \\( (q \\to r) \\to (p \\to (q \\to r)) \\) — A1 con \\( X = q \\to r, Y = p \\).`,
          `**3.** \\( p \\to (q \\to r) \\) — MP 1,2.`,
          `**4.** \\( [p \\to (q \\to r)] \\to [(p \\to q) \\to (p \\to r)] \\) — A2 con \\( X=p, Y=q, Z=r \\).`,
          `**5.** \\( (p \\to q) \\to (p \\to r) \\) — MP 3,4. **6.** \\( p \\to q \\) — ipotesi. **7.** \\( p \\to r \\) — MP 5,6. ∎`,
        ], 'Anticipata 1A 2024-25 · Es. 2'),
      O('L-ant1a24-3', 'L-ant1a-2425', 'L-fo', 'logica', 6,
        `Una delle due formule è valida, l'altra no: (1) \\( [\\exists x \\forall y\\, P] \\land [\\exists x \\forall y\\, Q] \\to \\exists x \\forall y\\, [P \\land Q] \\); (2) \\( \\exists x \\forall y\\,[P \\land Q] \\to [\\exists x \\forall y\\, P] \\land [\\exists x \\forall y\\, Q] \\). Per la valida: tableaux; per l'altra: controesempio.`,
        [
          `**La (2) è valida.** Se \\( x_0 \\) verifica \\( \\forall y (P \\land Q)(x_0,y) \\), allora per ogni \\( y \\) valgono \\( P(x_0,y) \\) e \\( Q(x_0,y) \\): lo stesso \\( x_0 \\) testimonia entrambi i congiunti. Tableaux: parti da \\( \\top(2) \\)... nega la formula: ramo \\( \\bot \\exists x \\forall y[P \\land Q] \\) → testimone \\( a \\): \\( \\bot \\forall y [P(a,y) \\land Q(a,y)] \\) → nuovo \\( b \\): \\( \\bot P(a,b), \\bot Q(a,b) \\); ramo destro: \\( \\top \\exists x \\forall y P \\) → \\( c \\): \\( \\top \\forall y P(c,y) \\) → istanzia con \\( b \\): \\( \\top P(c,b) \\)... per chiudere serve istanziare anche \\( \\bot \\forall y \\) con i testimoni giusti: la chiusura segue istanziando \\( \\top \\forall y P \\) e \\( \\top \\forall y Q \\) con \\( b \\) e i testimoni di Skolem coerenti.`,
          `**La (1) NON è valida.** Controesempio: dominio \\( \\{1,2\\} \\), \\( P(x,y) \\equiv x = 1 \\), \\( Q(x,y) \\equiv x = 2 \\). Antecedente: \\( x=1 \\) rende \\( P \\) sempre vero; \\( x=2 \\) rende \\( Q \\) sempre vero → antecedente VERO. Conclusione: servirebbe un solo \\( x \\) con \\( P(x,y) \\land Q(x,y) \\) per ogni \\( y \\): impossibile (\\( x \\) non può essere 1 e 2).`,
          `**Morale.** Due testimoni diversi non si fondono in uno: \\( \\exists \\) distribuisce su \\( \\lor \\), non su \\( \\land \\).`,
        ], 'Anticipata 1A 2024-25 · Es. 3'),
    ],
  },
  {
    id: 'L-ant1b-2425', label: 'Estiva Anticipata 1 Appello — B', date: '2025-01-28', course: 'logica', group: '2024-2025',
    items: [
      O('L-ant1b24-2', 'L-ant1b-2425', 'L-assiomi', 'logica', 6,
        `Nel sistema \\( S \\) (A1, A2 come sopra, Modus Ponens) dimostrare \\( \\vdash p \\to p \\).`,
        [
          `**1.** \\( p \\to \\bigl((p \\to p) \\to p\\bigr) \\) — A1 con \\( X = p, Y = p \\to p \\).`,
          `**2.** \\( \\bigl[p \\to ((p \\to p) \\to p)\\bigr] \\to \\bigl[(p \\to (p \\to p)) \\to (p \\to p)\\bigr] \\) — A2 con \\( X=p, Y = p \\to p, Z = p \\).`,
          `**3.** \\( (p \\to (p \\to p)) \\to (p \\to p) \\) — MP 1,2.`,
          `**4.** \\( p \\to (p \\to p) \\) — A1 con \\( X = Y = p \\).`,
          `**5.** \\( p \\to p \\) — MP 3,4. ∎`,
        ], 'Anticipata 1B 2024-25 · Es. 2'),
      O('L-ant1b24-3', 'L-ant1b-2425', 'L-fo', 'logica', 6,
        `Dire quale è valida: (1) \\( [\\exists x \\forall y\\, P] \\land [\\exists y \\forall x\\, Q] \\to \\exists x \\exists y\\,[P(x,y) \\land Q(x,y)] \\); (2) \\( [\\forall x \\exists y\\, P] \\land [\\forall y \\exists x\\, Q] \\to \\exists x \\exists y [P(x,y) \\land Q(x,y)] \\).`,
        [
          `**La (1) è valida.** Siano \\( a \\) con \\( \\forall y P(a,y) \\) e \\( b \\) con \\( \\forall x Q(x,b) \\). Allora \\( P(a,b) \\) (da \\( a \\)) e \\( Q(a,b) \\) (da \\( b \\), con \\( x = a \\)): la coppia \\( (a,b) \\) soddisfa la conclusione.`,
          `**La (2) NON è valida.** Dominio \\( \\{1,2\\} \\): \\( P(x,y) \\equiv x = y \\); \\( Q(x,y) \\equiv x \\ne y \\). \\( \\forall x \\exists y\\, x=y \\) ✓; \\( \\forall y \\exists x\\, x \\ne y \\) ✓. Ma \\( P \\land Q \\) non è mai soddisfatta (non può essere \\( x=y \\) e \\( x \\ne y \\)).`,
        ], 'Anticipata 1B 2024-25 · Es. 3'),
    ],
  },
  {
    id: 'L-ant2a-2425', label: 'Estiva Anticipata 2 Appello — A', date: '2025-02-13', course: 'logica', group: '2024-2025',
    items: [
      O('L-ant2a24-1', 'L-ant2a-2425', 'L-induzione', 'logica', 6,
        `Dimostrare per induzione che \\( \\sum_{i=1}^{n} i^3 = \\dfrac{n^2(n+1)^2}{4} \\) per ogni \\( n \\ge 1 \\).`,
        [
          `**Base.** \\( n = 1 \\): \\( 1 = \\frac{1 \\cdot 4}{4} \\) ✓.`,
          `**Passo.** \\( \\sum_{i=1}^{n+1} i^3 = \\frac{n^2(n+1)^2}{4} + (n+1)^3 = \\frac{(n+1)^2\\,[\\,n^2 + 4(n+1)\\,]}{4} = \\frac{(n+1)^2(n+2)^2}{4} \\) perché \\( n^2 + 4n + 4 = (n+2)^2 \\). ✓`,
          `**Curiosità.** \\( \\sum i^3 = (\\sum i)^2 \\): la somma dei cubi è il quadrato del numero triangolare.`,
        ], 'Anticipata 2A 2024-25 · Es. 1'),
      O('L-ant2a24-3', 'L-ant2a-2425', 'L-fo', 'logica', 6,
        `Sia \\( F: \\forall x [P(x) \\lor Q(x)] \\to \\exists x [P(x) \\land Q(x)] \\). 1. Dare un'interpretazione in cui \\( F \\) è falsa. 2. Riscrivere \\( F \\) senza \\( \\to \\) e \\( \\forall \\). 3. Riscrivere \\( \\lnot F \\) senza \\( \\to \\) e \\( \\exists \\).`,
        [
          `**1. Controesempio.** Dominio \\( \\mathbb{N} \\) (o \\( \\{0,1\\} \\)): \\( P \\) = «essere pari», \\( Q \\) = «essere dispari». Antecedente vero (ogni numero è pari o dispari), conseguente falso (nessun numero è entrambi).`,
          `**2.** \\( F \\equiv \\lnot \\forall x[P \\lor Q] \\lor \\exists x [P \\land Q] \\equiv \\bigl(\\exists x [\\lnot P \\land \\lnot Q]\\bigr) \\lor \\exists x[P \\land Q] \\).`,
          `**3.** \\( \\lnot F \\equiv \\forall x[P \\lor Q] \\land \\forall x [\\lnot P \\lor \\lnot Q] \\) (negando: \\( \\lnot \\exists = \\forall \\lnot \\), De Morgan dentro).`,
        ], 'Anticipata 2A 2024-25 · Es. 3'),
    ],
  },
  {
    id: 'L-estiva1-2425', label: 'Sessione Estiva — 1° Appello', date: '2025-06-17', course: 'logica', group: '2024-2025',
    items: [
      O('L-est124-1', 'L-estiva1-2425', 'L-induzione', 'logica', 6,
        `Siano \\( F_1 = F_2 = 1 \\), \\( F_n = F_{n-1} + F_{n-2} \\). Dimostrare per induzione che \\( F_n = 1 + \\sum_{i=1}^{n-2} F_i \\) per ogni \\( n \\ge 3 \\).`,
        [
          `**Base.** \\( n = 3 \\): \\( F_3 = 2 \\) e \\( 1 + \\sum_{i=1}^{1} F_i = 1 + 1 = 2 \\) ✓.`,
          `**Passo.** \\( F_{n+1} = F_n + F_{n-1} \\overset{\\text{IH}}{=} \\Bigl(1 + \\sum_{i=1}^{n-2} F_i\\Bigr) + F_{n-1} = 1 + \\sum_{i=1}^{n-1} F_i \\) ✓.`,
          `**Nota.** Serve solo \\( P(n) \\) (induzione semplice), ma la definizione di \\( F \\) usa due termini: verificare anche \\( n = 4 \\) non costa nulla e rassicura.`,
        ], 'Estiva 1 2024-25 · Es. 1'),
      O('L-est124-2', 'L-estiva1-2425', 'L-prop', 'logica', 6,
        `Ricavare una formula equivalente a \\( \\lnot a \\lor b \\) che contenga soltanto il connettivo \\( \\downarrow \\) (nor).`,
        [
          `**Identità base.** \\( \\lnot x = x \\downarrow x \\); \\( x \\lor y = x \\downarrow y \\).`,
          `**Sostituzione.** \\( \\lnot a \\lor b \\) è un OR tra \\( \\lnot a \\) e \\( b \\): \\[ (a \\downarrow a) \\downarrow b \\]`,
          `**Verifica.** \\( a=1,b=0 \\): \\( (0) \\downarrow 0 = 1 \\)... attenzione: \\( a \\downarrow a = \\lnot a = 0 \\), poi \\( 0 \\downarrow 0 = 1 \\)? NOR(0,0) = 1 ✓ e \\( \\lnot a \\lor b = 0 \\lor 0 = 0 \\)?? Ricontrolla: \\( a=1 \\Rightarrow \\lnot a = 0 \\), \\( b = 0 \\): formula = 0. Ma \\( (a\\downarrow a) \\downarrow b = \\lnot(0 \\lor 0) = 1 \\). ERRORE: \\( x \\lor y \\ne x \\downarrow y \\)! NOR è il **negato** dell'OR: \\( x \\lor y = (x \\downarrow y) \\downarrow (x \\downarrow y) \\). Corretto: \\[ \\bigl((a \\downarrow a) \\downarrow b\\bigr) \\downarrow \\bigl((a \\downarrow a) \\downarrow b\\bigr) \\] verifica \\( a=1,b=0 \\): interno \\( 0 \\downarrow 0 = 1 \\), esterno \\( 1 \\downarrow 1 = 0 \\) ✓.`,
        ], 'Estiva 1 2024-25 · Es. 2'),
    ],
  },
  {
    id: 'L-estiva2-2425', label: 'Sessione Estiva — 2° Appello', date: '2025-07-21', course: 'logica', group: '2024-2025',
    items: [
      O('L-est224-1', 'L-estiva2-2425', 'L-induzione', 'logica', 6,
        `Dimostrare per induzione che per ogni \\( n \\ge 2 \\): \\( \\prod_{i=2}^{n} \\Bigl(1 - \\dfrac{1}{i}\\Bigr) = \\dfrac{1}{n} \\).`,
        [
          `**Base.** \\( n=2 \\): \\( 1 - \\frac12 = \\frac12 = \\frac 12 \\) ✓.`,
          `**Passo.** \\( \\prod_{i=2}^{n+1} (1 - \\tfrac1i) = \\frac{1}{n}\\Bigl(1 - \\frac{1}{n+1}\\Bigr) = \\frac{1}{n} \\cdot \\frac{n}{n+1} = \\frac{1}{n+1} \\) ✓.`,
          `**Intuizione.** \\( 1 - 1/i = (i-1)/i \\): il prodotto è a cascata, tutto si semplifica (telescopio).`,
        ], 'Estiva 2 2024-25 · Es. 1'),
      O('L-est224-3', 'L-estiva2-2425', 'L-fo', 'logica', 6,
        `Dire se è valida: \\( \\bigl[\\forall x \\exists y\\, P(x,y)\\bigr] \\land \\bigl[\\exists x \\forall y\\, Q(x,y)\\bigr] \\to \\exists x \\exists y\\,[P(x,y) \\land Q(x,y)] \\).`,
        [
          `**È VALIDA.** Sia \\( b \\) testimone di \\( \\exists x \\forall y Q \\): \\( Q(b, y) \\) per ogni \\( y \\). Da \\( \\forall x \\exists y P \\) con \\( x = b \\): esiste \\( y_0 \\) con \\( P(b, y_0) \\). Allora \\( P(b,y_0) \\land Q(b, y_0) \\) ✓.`,
          `**Tableaux.** Nega la formula: \\( \\top \\forall x \\exists y P \\), \\( \\top \\exists x \\forall y Q \\) (testimone \\( b \\)), \\( \\bot \\exists x \\exists y [P \\land Q] \\Rightarrow \\forall x \\forall y \\lnot(P \\land Q) \\). Da \\( \\top \\exists x \\forall y Q \\): \\( \\top \\forall y Q(b,y) \\); da \\( \\top \\forall x \\exists y P \\) con \\( x=b \\): nuovo testimone \\( c \\) con \\( P(b,c) \\); istanzia \\( \\top \\forall y Q(b, \\cdot) \\) con \\( c \\): \\( Q(b,c) \\); istanzia \\( \\forall x \\forall y \\lnot \\) con \\( (b,c) \\): \\( \\lnot(P(b,c) \\land Q(b,c)) \\) → con \\( P(b,c), Q(b,c) \\) il ramo chiude su entrambi i rami di De Morgan.`,
        ], 'Estiva 2 2024-25 · Es. 3'),
      O('L-est224-4', 'L-estiva2-2425', 'L-reti', 'logica', 6,
        `Con sole porte AND, OR, NOT progettare un circuito a 3 input \\( x_2 x_1 x_0 \\) e 3 output \\( y_2 y_1 y_0 \\) che calcoli il complemento a due del numero in input.`,
        [
          `**Regola.** Complemento a due = inverti tutti i bit + 1. La somma di 1 propaga i riporti da destra.`,
          `**Formule.** \\( y_0 = \\lnot x_0 \\); \\( y_1 = x_1 \\oplus x_0 \\); \\( y_2 = x_2 \\oplus (x_1 \\land x_0) \\) — il riporto entra in \\( y_i \\) solo se tutti i bit a destra erano 1.`,
          `**Con AND/OR/NOT.** \\( a \\oplus b = (\\lnot a \\land b) \\lor (a \\land \\lnot b) \\). Circuito: 3 NOT, 4 AND a 2 ingressi, 2 OR a 2 ingressi.`,
          `**Verifica.** \\( x = 010_2 = 2 \\): \\( y = 101 + 1 = 110 = -2 \\) in complemento a due ✓ (formula: \\( y_0 = 1, y_1 = 1 \\oplus 0 = 1, y_2 = 0 \\oplus 0 = 1 \\)).`,
        ], 'Estiva 2 2024-25 · Es. 4'),
    ],
  },
  {
    id: 'L-autunnale1-2425', label: 'Sessione Autunnale — 1° Appello', date: '2025-09-02', course: 'logica', group: '2024-2025',
    items: [
      O('L-aut124-1', 'L-autunnale1-2425', 'L-induzione', 'logica', 6,
        `Dimostrare per induzione che \\( 9^n + 3 \\) è divisibile per 4 per ogni \\( n \\ge 0 \\).`,
        [
          `**Base.** \\( n = 0 \\): \\( 1 + 3 = 4 \\) ✓.`,
          `**Passo.** \\( 9^{n+1} + 3 = 9(9^n + 3) - 27 + 3 = 9(9^n+3) - 24 \\). Per ipotesi \\( 4 \\mid 9^n + 3 \\) e \\( 4 \\mid 24 \\): somma di multipli di 4 ✓.`,
          `**Alternativa modulare.** \\( 9 \\equiv 1 \\pmod 4 \\Rightarrow 9^n \\equiv 1 \\Rightarrow 9^n + 3 \\equiv 4 \\equiv 0 \\).`,
        ], 'Autunnale 1 2024-25 · Es. 1'),
      O('L-aut124-2', 'L-autunnale1-2425', 'L-prop', 'logica', 6,
        `Riscrivere con il solo connettivo \\( \\mid \\) (nand): (1) \\( \\lnot p \\); (2) \\( p \\land q \\); (3) \\( p \\lor q \\).`,
        [
          `**(1)** \\( \\lnot p = p \\mid p \\).`,
          `**(2)** \\( p \\land q = (p \\mid q) \\mid (p \\mid q) \\) (doppia negazione dell'AND).`,
          `**(3)** \\( p \\lor q = (p \\mid p) \\mid (q \\mid q) \\) (De Morgan).`,
          `**Verifica (3).** \\( p=0,q=0 \\): \\( 1 \\mid 1 = 0 \\) ✓; \\( p=1,q=0 \\): \\( 0 \\mid 1 = 1 \\) ✓.`,
        ], 'Autunnale 1 2024-25 · Es. 2'),
      O('L-aut124-4', 'L-autunnale1-2425', 'L-reti', 'logica', 6,
        `Con un solo Decoder e una porta OR a più ingressi, circuito con input \\( x_0..x_3 \\) e output \\( y = f(x_3,x_2,x_1,x_0) \\) dove \\( y = x_2 \\oplus x_3 \\) se \\( x_1 = x_0 \\), altrimenti \\( y = x_2 \\land x_3 \\).`,
        [
          `**Decoder 4:16.** Le 16 uscite sono i mintermini \\( m_0 \\ldots m_{15} \\) (\\( m_k \\) attiva su \\( x_3x_2x_1x_0 = k \\)).`,
          `**Mintermini di \\( f \\).** Caso \\( x_1 = x_0 \\) (righe con \\( x_1x_0 \\in \\{00, 11\\} \\)) e \\( x_2 \\oplus x_3 = 1 \\): \\( m_4 (0100), m_8 (1000), m_7 (0111), m_{11} (1011) \\). Caso \\( x_1 \\ne x_0 \\) e \\( x_2 x_3 = 11 \\): \\( m_{13} (1101), m_{14} (1110) \\).`,
          `**Circuito.** \\( y = m_4 + m_7 + m_8 + m_{11} + m_{13} + m_{14} \\): un OR a 6 ingressi sulle uscite corrispondenti del decoder.`,
          `**Criterio.** Qualunque funzione in FND si realizza così: OR dei mintermini con \\( y = 1 \\).`,
        ], 'Autunnale 1 2024-25 · Es. 4'),
    ],
  },
  {
    id: 'L-autunnale2-2425', label: 'Sessione Autunnale — 2° Appello', date: '2025-09-22', course: 'logica', group: '2024-2025',
    items: [
      O('L-aut224-1', 'L-autunnale2-2425', 'L-induzione', 'logica', 6,
        `Dimostrare per induzione che \\( 6^n - 1 \\) è divisibile per 5 per ogni \\( n \\in \\mathbb{N} \\).`,
        [
          `**Base.** \\( n = 0 \\): \\( 0 \\) è divisibile per 5 (o parti da \\( n=1 \\): \\( 5 \\mid 5 \\)).`,
          `**Passo.** \\( 6^{n+1} - 1 = 6(6^n - 1) + 5 \\): primo addendo multiplo di 5 per ipotesi, secondo è 5 ✓.`,
          `**Alternativa.** \\( 6 \\equiv 1 \\pmod 5 \\).`,
        ], 'Autunnale 2 2024-25 · Es. 1'),
      O('L-aut224-2', 'L-autunnale2-2425', 'L-karnaugh', 'logica', 6,
        `Mappa di Karnaugh e circuito per la tavola (righe 0000→1111): \\( y = 1\\,0\\,1\\,0\\,1\\,1\\,0\\,0\\,1\\,0\\,1\\,1\\,1\\,1\\,0\\,1 \\).`,
        [
          `**Mintermini.** \\( \\{0, 2, 4, 5, 8, 10, 11, 12, 13, 15\\} \\).`,
          `**Gruppi.** ① i **quattro angoli** \\( \\{0,2,8,10\\} \\): costanti \\( x_2 = 0, x_1 = 0 \\) → \\( \\bar x_2\\, \\bar x_1 \\). ② \\( \\{4,5,12,13\\} \\): costanti \\( x_2 = 1, x_1 = 0 \\) → \\( x_2 \\bar x_1 \\). ③ \\( \\{11, 15\\} \\): coppia con \\( x_3 = 1, x_1 = 1, x_0 = 1 \\) → \\( x_3 x_1 x_0 \\).`,
          `**Formula minima.** \\( y = \\bar{x}_2 \\bar{x}_1 + x_2 \\bar{x}_1 + x_3 x_1 x_0 \\) — 3 termini, 7 lettere.`,
          `**Occhio.** Gli angoli della mappa sono adiacenti a coppie (la mappa è un toro): è il gruppo più facile da perdere.`,
        ], 'Autunnale 2 2024-25 · Es. 2'),
      O('L-aut224-3', 'L-autunnale2-2425', 'L-fo', 'logica', 6,
        `Siano \\( A: \\exists x P(x) \\land \\exists x Q(x) \\) e \\( B: \\exists x [P(x) \\land Q(x)] \\). Dire se: 1. \\( A \\models B \\); 2. \\( B \\models A \\); 3. \\( A \\equiv B \\); 4. \\( A \\to B \\) è soddisfacibile.`,
        [
          `**1. FALSO.** Controesempio: dominio \\( \\{1,2\\} \\), \\( P = \\{1\\} \\), \\( Q = \\{2\\} \\): \\( A \\) vera, \\( B \\) falsa (nessuno soddisfa entrambe).`,
          `**2. VERO.** Il testimone di \\( B \\) soddisfa sia \\( P \\) sia \\( Q \\), quindi testimonia entrambi i \\( \\exists \\) di \\( A \\).`,
          `**3. FALSO** (dal punto 1).`,
          `**4. VERO.** \\( A \\to B \\) è vera in ogni interpretazione con \\( A \\) falsa (es. \\( P = Q = \\varnothing \\)); è anche vera dove \\( B \\) vera: soddisfacibile ✓ (ma non valida).`,
        ], 'Autunnale 2 2024-25 · Es. 3'),
    ],
  },

  /* ============================ LOGICA 2025-26 ============================ */

  {
    id: 'L-test1a-2526', label: 'Primo Test Intermedio — Compito A', date: '2025-11-18', course: 'logica', group: '2025-2026',
    items: [
      O('L-t1a25-1', 'L-test1a-2526', 'L-induzione', 'logica', 6,
        `Sia \\( a_0 = 1 \\), \\( a_n = 2a_{n-1} + n - 1 \\). Dimostrare per induzione che \\( a_n = 2^{n+1} - (n+1) \\).`,
        [
          `**Base.** \\( n=0 \\): \\( 2 - 1 = 1 = a_0 \\) ✓.`,
          `**Passo.** \\( a_{n+1} = 2a_n + n = 2[2^{n+1} - (n+1)] + n = 2^{n+2} - 2n - 2 + n = 2^{n+2} - (n + 2) \\) ✓.`,
          `**Verifica numerica.** \\( a_1 = 2 \\) (= \\( 4-2 \\)), \\( a_2 = 5 \\) (= \\( 8-3 \\)) ✓.`,
        ], 'Test 1A 2025-26 · Es. 1'),
      O('L-t1a25-3', 'L-test1a-2526', 'L-assiomi', 'logica', 6,
        `Sia \\( S \\): A1: \\( X \\to (Y \\to X) \\); A2: \\( (X \\to Y) \\to [(X \\to \\lnot Y) \\to \\lnot X] \\); MP. Dimostrare \\( \\{p \\to q, \\lnot q\\} \\vdash \\lnot p \\).`,
        [
          `**1.** \\( (p \\to q) \\to [(p \\to \\lnot q) \\to \\lnot p] \\) — A2 con \\( X=p, Y=q \\).`,
          `**2.** \\( (p \\to \\lnot q) \\to \\lnot p \\) — MP 1 + ipotesi \\( p \\to q \\).`,
          `**3.** \\( \\lnot q \\to (p \\to \\lnot q) \\) — A1 con \\( X = \\lnot q, Y = p \\).`,
          `**4.** \\( p \\to \\lnot q \\) — MP 3 + ipotesi \\( \\lnot q \\).`,
          `**5.** \\( \\lnot p \\) — MP 2,4. ∎ (È il modus tollens: da \\( p \\to q \\) e \\( \\lnot q \\), \\( \\lnot p \\).)`,
        ], 'Test 1A 2025-26 · Es. 3'),
      O('L-t1a25-4', 'L-test1a-2526', 'L-fo', 'logica', 6,
        `Dire se \\( \\forall x \\exists y\\, \\lnot P(x,y) \\equiv \\lnot \\exists x \\forall y\\, P(x,y) \\) è valida; in caso tableaux, altrimenti controesempio.`,
        [
          `**È VALIDA** (legge di De Morgan per quantificatori). \\( \\lnot \\exists x \\forall y P \\equiv \\forall x \\lnot \\forall y P \\equiv \\forall x \\exists y \\lnot P \\).`,
          `**Tableaux.** Nega la formula (un \\( \\equiv \\) falso → due rami: V/F e F/V). Ramo V/F: \\( \\top \\forall x \\exists y \\lnot P \\), \\( \\bot \\lnot \\exists x \\forall y P \\Rightarrow \\top \\exists x \\forall y P \\) → testimone \\( a \\): \\( \\top \\forall y P(a, \\cdot) \\); da \\( \\top \\forall \\) sinistra con \\( x = a \\): \\( \\top \\exists y \\lnot P(a, \\cdot) \\) → testimone \\( b \\): \\( \\top \\lnot P(a,b) \\); istanzia \\( \\top \\forall y P(a,\\cdot) \\) con \\( b \\): \\( \\top P(a,b) \\) → chiuso. Ramo F/V simmetrico.`,
        ], 'Test 1A 2025-26 · Es. 4'),
    ],
  },
  {
    id: 'L-test1b-2526', label: 'Primo Test Intermedio — Compito B', date: '2025-11-18', course: 'logica', group: '2025-2026',
    items: [
      O('L-t1b25-1', 'L-test1b-2526', 'L-induzione', 'logica', 6,
        `Sia \\( a_0 = 1 \\), \\( a_n = 2a_{n-1} - n + 1 \\). Dimostrare che \\( a_n = n + 1 \\).`,
        [
          `**Base.** \\( a_0 = 1 = 0 + 1 \\) ✓.`,
          `**Passo.** \\( a_{n+1} = 2a_n - (n+1) + 1 = 2(n+1) - n = n + 2 \\) ✓.`,
          `**Verifica.** \\( a_1 = 2, a_2 = 3, a_3 = 4 \\) ✓.`,
        ], 'Test 1B 2025-26 · Es. 1'),
      O('L-t1b25-2', 'L-test1b-2526', 'L-prop', 'logica', 6,
        `Dire se sono tautologie: 1. \\( [p \\to (q \\lor r)] \\equiv (p \\to q) \\lor (p \\to r) \\); 2. \\( [(p \\lor q) \\to r] \\equiv (p \\to r) \\lor (q \\to r) \\).`,
        [
          `**1. TAUTOLOGIA.** Entrambi i lati: \\( \\lnot p \\lor q \\lor r \\) (a sinistra per distributiva di \\( \\lor \\) su \\( \\land \\); a destra: \\( (\\lnot p \\lor q) \\lor (\\lnot p \\lor r) \\)).`,
          `**2. CONTINGENZA.** Sinistra: \\( (\\lnot p \\land \\lnot q) \\lor r \\); destra: \\( \\lnot p \\lor \\lnot q \\lor r \\). Con \\( p=1, q=0, r=0 \\): sinistra \\( 0 \\lor 0 = 0 \\), destra \\( 0 \\lor 1 \\lor 0 = 1 \\): l'equivalenza è falsa → non tautologia (ma soddisfacibile).`,
          `**Morale.** \\( \\to \\) distribuisce su \\( \\lor \\) nel conseguente, non nell'antecedente (lì serve \\( \\land \\)).`,
        ], 'Test 1B 2025-26 · Es. 2'),
    ],
  },
  {
    id: 'L-test2-2526', label: 'Secondo Test Intermedio', date: '2026-01-15', course: 'logica', group: '2025-2026',
    items: [
      O('L-t225-1', 'L-test2-2526', 'L-karnaugh', 'logica', 6,
        `Mappa di Karnaugh di \\( F = (a + b + c)(a + \\bar b + \\bar c)(\\bar a + b + \\bar c) \\), poi forma minima SOP e circuito.`,
        [
          `**Prima: POS → tavola.** \\( F = 0 \\) dove un fattore si annulla: \\( (a+b+c)=0 \\) su 000; \\( (a+\\bar b+\\bar c) = 0 \\) su 011; \\( (\\bar a+b+\\bar c)=0 \\) su 101. Quindi \\( F = 0 \\) su \\( \\{0, 3, 5\\} \\) e \\( 1 \\) altrove: mintermini \\( \\{1,2,4,6,7\\} \\).`,
          `**Karnaugh 3 var** (righe \\( a \\), colonne \\( bc \\) in Gray 00-01-11-10): zeri in 000, 011, 101.`,
          `**Gruppi di 1.** \\( \\{2,6\\} \\) (colonna 10): \\( b \\bar c \\)... verifica: m2=010, m6=110: costanti \\( b=1, c=0 \\) → \\( b\\bar c \\). \\( \\{4,6\\} \\): m4=100, m6=110: \\( a \\bar c \\). \\( \\{1,5\\}\\)? m5=0 no. \\( \\{6,7\\} \\): m7=111, m6=110: \\( ab \\). Copertura: \\( \\{1\\} \\) resta: adiacenze di m1=001: m3=0, m5=0, m0=0 → mintermine isolato \\( \\bar a \\bar b c \\).`,
          `**Minimo.** \\( F = \\bar a \\bar b c + b \\bar c + a \\bar c \\)... controlla m4: coperto da \\( a\\bar c \\) ✓; m2 da \\( b\\bar c \\) ✓; m7: NON coperto! Serve \\( ab \\) o \\( \\{7, 6\\} \\): \\( F = \\bar a\\bar b c + b\\bar c + ab \\)? m4 coperto? \\( a\\bar c \\) tolto → m4 scoperto. Uso: \\( F = \\bar a \\bar b c + a \\bar c + b \\bar c + ab \\)? ridondante. Minimale: \\( F = \\bar a\\bar b c + a\\bar c + b\\bar c \\)? m7: \\( a=1,b=1 \\): \\( a\\bar c \\) richiede \\( c=0 \\); m7 ha c=1 → scoperto. Soluzione corretta: \\( F = \\bar a\\bar b c + ab + a\\bar c + b\\bar c \\) ha 4 termini; meglio \\( F = \\bar a\\bar b c + ab + (a \\oplus b)\\bar c \\)... in SOP pura minima: \\( \\bar a\\bar b c + \\bar a b \\bar c + a b + a \\bar b \\bar c \\)? Controlla: m2=010: \\( \\bar a b \\bar c \\) ✓; m1 ✓; m4=100: \\( a\\bar b\\bar c \\) ✓; m6=110: \\( ab \\) ✓; m7=111: \\( ab \\) ✓. 4 termini di 3 lettere = 12 lettere, contro l'altra a 4 termini (3+2+2+2=9): vince \\( \\bar a\\bar b c + ab + a\\bar c + b\\bar c \\). Circuito: NOT(\\( \\bar a, \\bar b, \\bar c \\)), 4 AND, 1 OR.`,
        ], 'Test 2 2025-26 · Es. 1'),
      O('L-t225-3', 'L-test2-2526', 'L-reti', 'logica', 6,
        `Circuito combinatorio: 4 bit \\( x_3..x_0 \\) (numero \\( n \\)) in input, 2 bit \\( y_1 y_0 \\) = resto di \\( n \\) diviso 3 in output.`,
        [
          `**Tavola.** \\( n \\bmod 3 \\) per \\( n = 0..15 \\): \\( 0,1,2,0,1,2,\\ldots \\) → \\( y_1 = 1 \\) su \\( n \\in \\{2,5,8,11,14\\} \\); \\( y_0 = 1 \\) su \\( n \\in \\{1,4,7,10,13\\} \\).`,
          `**Karnaugh: sorpresa.** I mintermi distano 3: nella mappa a 4 variabili **nessuna coppia è adiacente** (3 = 2+1: cambia sempre più di un bit). La SOP minima è la somma dei 5 mintermi: \\( y_1 = \\bar x_3 x_2 x_1 x_0 \\cdot\\!? \\)... esplicito: \\( y_1 = \\Sigma m(2,5,8,11,14) \\), \\( y_0 = \\Sigma m(1,4,7,10,13) \\) ciascun termine con le 4 lettere.`,
          `**Struttura più intelligente.** \\( 8 \\equiv 2, 4 \\equiv 1, 2 \\equiv 2, 1 \\equiv 1 \\pmod 3 \\): \\( n \\equiv 2x_3 + x_2 + 2x_1 + x_0 \\pmod 3 \\) — somma pesata piccola (max 7) e poi correggere mod 3.`,
          `**Realizzazione.** Due MUX 16:1 (o un decoder 4:16 + 2 OR a 5 ingressi) pilotati da \\( x_3..x_0 \\) con i valori della tavola sugli ingressi dati.`,
        ], 'Test 2 2025-26 · Es. 3'),
    ],
  },
  {
    id: 'L-ant1a-2526', label: 'Estiva Anticipata 1° App. — A', date: '2026-01-28', course: 'logica', group: '2025-2026',
    items: [
      O('L-ant1a25-2', 'L-ant1a-2526', 'L-fnf', 'logica', 6,
        `Scrivere una formula in FNC e una in FND con la tavola (variabili \\( a,b,c,d \\), righe 0000→1111): \\( y = 0\\,0\\,0\\,1\\,1\\,0\\,1\\,1\\,1\\,1\\,0\\,1\\,1\\,0\\,0\\,0 \\).`,
        [
          `**FND** (mintermini con \\( y=1 \\)): \\( m_3, m_4, m_6, m_7, m_8, m_9, m_{11}, m_{12} \\). \\( y = \\bar a\\bar b cd + \\bar a b \\bar c \\bar d + \\bar a b c \\bar d + \\bar a bcd + a\\bar b \\bar c \\bar d + a \\bar b \\bar c d + a \\bar b c d + ab \\bar c \\bar d \\).`,
          `**FNC** (maxtermini con \\( y=0 \\)): righe \\( 0,1,2,5,10,13,14,15 \\). Ogni fattore è la somma che si annulla su quella riga (variabile se 0, negata se 1): \\( y = (a+b+c+d)(a+b+c+\\bar d)(a+b+\\bar c+d)(a+\\bar b+c+\\bar d)(\\bar a+b+\\bar c+d)(\\bar a+\\bar b+c+d)(\\bar a+\\bar b+\\bar c+d)(\\bar a+\\bar b+\\bar c+\\bar d) \\).`,
          `**Consiglio d'esame.** Non minimizzare: il testo chiede solo le forme normali canoniche. Conta le righe: 8 uni e 8 zeri.`,
        ], 'Anticipata 1A 2025-26 · Es. 2'),
      O('L-ant1a25-3', 'L-ant1a-2526', 'L-fo', 'logica', 6,
        `Siano \\( A: \\forall x P(x) \\lor \\forall x Q(x) \\), \\( B: \\forall x [P(x) \\lor Q(x)] \\). 1. \\( A \\models B \\)? 2. \\( B \\models A \\)? 3. \\( A \\equiv B \\)? 4. \\( A \\) soddisfacibile?`,
        [
          `**1. VERO.** Se \\( P \\) vale ovunque, allora ovunque vale \\( P \\lor Q \\) (idem se \\( Q \\) vale ovunque).`,
          `**2. FALSO.** Dominio \\( \\{1,2\\} \\), \\( P = \\{1\\} \\), \\( Q = \\{2\\} \\): ogni elemento è in \\( P \\) o in \\( Q \\) (\\( B \\) vera) ma né \\( P \\) né \\( Q \\) valgono ovunque.`,
          `**3. FALSO** (per il punto 2).`,
          `**4. VERO.** Prendi \\( P = Q = \\) tutto il dominio: \\( A \\) vera.`,
        ], 'Anticipata 1A 2025-26 · Es. 3'),
    ],
  },
  {
    id: 'L-ant2a-2526', label: 'Estiva Anticipata 2° App. — A', date: '2026-02-18', course: 'logica', group: '2025-2026',
    items: [
      O('L-ant2a25-1', 'L-ant2a-2526', 'L-induzione', 'logica', 6,
        `Con \\( F_1 = F_2 = 1 \\), \\( F_n = F_{n-1} + F_{n-2} \\): dimostrare \\( \\sum_{i=1}^{n} F_{2i-1} = F_{2n} \\).`,
        [
          `**Base.** \\( n = 1 \\): \\( F_1 = 1 = F_2 \\) ✓.`,
          `**Passo.** \\( \\sum_{i=1}^{n+1} F_{2i-1} = F_{2n} + F_{2n+1} = F_{2n+2} \\) ✓ per la ricorrenza.`,
          `**Verifica.** \\( n=3 \\): \\( 1 + 2 + 5 = 8 = F_6 \\) ✓.`,
        ], 'Anticipata 2A 2025-26 · Es. 1'),
      O('L-ant2a25-2', 'L-ant2a-2526', 'L-prop', 'logica', 6,
        `Dire se \\( [(p \\to q) \\lor (r \\to s)] \\to [(p \\lor r) \\to (q \\lor s)] \\) è tautologia, contraddizione o contingenza.`,
        [
          `**Antecedente.** \\( (\\lnot p \\lor q) \\lor (\\lnot r \\lor s) \\).`,
          `**Conseguente.** \\( \\lnot(p \\lor r) \\lor q \\lor s = (\\lnot p \\land \\lnot r) \\lor (q \\lor s) \\).`,
          `**Controesempio.** \\( p=1, r=0, q=s=0 \\): antecedente \\( 0 \\lor 0 \\lor 1 \\lor 0 = 1 \\); conseguente \\( (0 \\land 1) \\lor 0 = 0 \\) → formula FALSA.`,
          `**Ma non è sempre falsa** (es. tutto 0): **contingenza**. Nota: il "fratello" con \\( \\land \\) al posto di \\( \\lor \\) negli antecedenti è invece tautologia.`,
        ], 'Anticipata 2A 2025-26 · Es. 2'),
    ],
  },
  {
    id: 'L-ant2b-2526', label: 'Estiva Anticipata 2° App. — B', date: '2026-02-18', course: 'logica', group: '2025-2026',
    items: [
      O('L-ant2b25-1', 'L-ant2b-2526', 'L-induzione', 'logica', 6,
        `Dimostrare per induzione: \\( \\sum_{i=1}^{2n} (-1)^i F_i = F_{2n-1} - 1 \\).`,
        [
          `**Base.** \\( n=1 \\): \\( -F_1 + F_2 = 0 = F_1 - 1 = 0 \\) ✓.`,
          `**Passo.** \\( \\sum_{i=1}^{2n+2} (-1)^i F_i = F_{2n-1} - 1 - F_{2n} + F_{2n+1} = F_{2n-1} - 1 + F_{2n-1} \\)... usando \\( F_{2n+1} - F_{2n} = F_{2n-1} \\): \\( = 2F_{2n-1} - 1 \\)... e \\( F_{2n+1} - 1 = F_{2n} + F_{2n-1} - 1 \\): riscrivo: \\( F_{2n-1} - 1 - F_{2n} + F_{2n+1} = F_{2n-1} - 1 + (F_{2n+1} - F_{2n}) = F_{2n-1} - 1 + F_{2n-1} = 2F_{2n-1} - 1 \\). Ora \\( F_{2(n+1)-1} - 1 = F_{2n+1} - 1 = F_{2n} + F_{2n-1} - 1 \\). Uguaglianza? \\( 2F_{2n-1} - 1 \\) vs \\( F_{2n} + F_{2n-1} - 1 \\): servono \\( F_{2n} = F_{2n-1} \\)?? FALSO in generale. **Attenzione**: il passo corretto è \\( -F_{2n+1} + F_{2n+2} = F_{2n+2} - F_{2n+1} = F_{2n} \\), quindi la somma diventa \\( (F_{2n-1} - 1) + F_{2n} = F_{2n+1} - 1 \\) ✓ (ricorrenza).`,
          `**Verifica.** \\( n=2 \\): \\( -1+1-2+3 = 1 = F_3 - 1 = 1 \\) ✓.`,
        ], 'Anticipata 2B 2025-26 · Es. 1'),
      O('L-ant2b25-2', 'L-ant2b-2526', 'L-prop', 'logica', 6,
        `Dire se \\( [(p \\to q) \\land (r \\to s)] \\to [(p \\land r) \\to (q \\land s)] \\) è tautologia, contraddizione o contingenza.`,
        [
          `**Antecedente.** \\( (\\lnot p \\lor q) \\land (\\lnot r \\lor s) \\).`,
          `**Conseguente.** \\( \\lnot(p \\land r) \\lor (q \\land s) \\).`,
          `**Dimostrazione.** Antecedente vero, conseguente falso richiede \\( p \\land r \\) vero (quindi \\( p = r = 1 \\)) e \\( q \\land s \\) falso. Con \\( p = 1 \\): \\( \\lnot p \\lor q \\) forza \\( q = 1 \\); con \\( r = 1 \\): forza \\( s = 1 \\). Allora \\( q \\land s \\) vero: contraddizione.`,
          `**Conclusione: TAUTOLOGIA** (è la proprietà di composizione dell'implicazione).`,
        ], 'Anticipata 2B 2025-26 · Es. 2'),
    ],
  },
];

/* ============================ DISCRETA ============================ */

export const EXAMS_DISCRETA = [
  {
    id: 'D-app1-0206', label: 'I Appello', date: '2026-02-05', course: 'discreta', group: 'a.a. 2025-2026 (8 problemi × 4 pt, parametro m)',
    items: [
      O('D-a1-1', 'D-app1-0206', 'D-funzioni', 'discreta', 4,
        `Sia \\( f: \\mathbb{N} \\to \\mathbb{Z} \\), \\( f(n) = n^2 \\) se \\( n \\) pari, \\( f(n) = \\sin(n\\pi/2) \\) se \\( n \\) dispari. Calcolare \\( f^{-1}(\\{1, m+4\\}) \\) (con \\( m \\) il tuo mese di nascita).`,
        [
          `**Ramo pari** (\\( n^2 \\)): valori \\( 0, 4, 16, 36, \\ldots \\) (quadrati pari... di n pari). \\( n^2 = 1 \\) non ha soluzioni pari; \\( n^2 = m+4 \\) solo se \\( m+4 \\) è un quadrato **pari**: per \\( m \\in [1,12] \\), \\( m + 4 \\in [5,16] \\): quadrato pari = 16 → \\( n = 4 \\) quando \\( m = 12 \\).`,
          `**Ramo dispari** (\\( \\sin(n\\pi/2) \\)): valori in \\( \\{-1, 0, 1\\} \\), con \\( \\sin(n\\pi/2) = 1 \\iff n \\equiv 1 \\pmod 4 \\) (n = 1, 5, 9, 13, …); \\( m + 4 \\ge 5 > 1 \\): mai dal ramo dispari.`,
          `**Risposta.** \\( f^{-1}(\\{1, m+4\\}) = \\{n \\in \\mathbb{N} : n \\equiv 1 \\pmod 4\\} \\) (insieme **infinito**!), più \\( \\{4\\} \\) nel caso \\( m = 12 \\).`,
          `**Occhio.** Le controimmagini possono essere infinite: non fermarti ai primi valori.`,
        ], 'Appello 5/2/2026 · Problema 1'),
      O('D-a1-2', 'D-app1-0206', 'D-modulare', 'discreta', 4,
        `Calcolare, se esiste, l'inversa moltiplicativa di \\( [4+m]_{127} \\) (m = mese di nascita). Esempio con \\( m = 9 \\): \\( [13]_{127} \\).`,
        [
          `**Esistenza.** 127 è primo: ogni classe non nulla è invertibile (\\( \\gcd = 1 \\) sempre, \\( m \\in [1,12] \\Rightarrow 4+m \\in [5,16] \\ne 0 \\)).`,
          `**Euclide esteso (m = 9, a = 13).** \\( 127 = 9\\cdot13 + 10 \\); \\( 13 = 1\\cdot10 + 3 \\); \\( 10 = 3\\cdot3 + 1 \\). Risalendo: \\( 1 = 10 - 3(13 - 10) = 4\\cdot10 - 3\\cdot13 = 4(127 - 9\\cdot13) - 3\\cdot13 = 4\\cdot127 - 39\\cdot13 \\).`,
          `**Inversa.** \\( -39 \\equiv 127 - 39 = 88 \\pmod{127} \\). Verifica: \\( 13 \\cdot 88 = 1144 = 9\\cdot127 + 1 \\) ✓.`,
        ], 'Appello 5/2/2026 · Problema 2'),
      O('D-a1-3', 'D-app1-0206', 'D-rsa', 'discreta', 4,
        `RSA: B pubblica \\( n_B = 1537, e_B = 31 \\). Codificare il messaggio \\( m + 40 \\) per B. (E in un altro quesito: decodificare \\( c = 38 \\) ricevuto da B che ha \\( n = 901, e = 37, d = 45 \\).)`,
        [
          `**Cifratura.** \\( c = [(m+40)^{31}]_{1537} \\) — forma simbolica richiesta: NON calcolare la potenza.`,
          `**Decodifica dell'altro quesito.** \\( M = [38^{45}]_{901} \\). Verifica della chiave: \\( 901 = 17 \\cdot 53 \\), \\( \\varphi = 800 \\), \\( \\lambda = \\mathrm{lcm}(16, 52) = 208 \\); \\( 37 \\cdot 45 = 1665 = 8\\cdot208 - 1 \\equiv 1 \\pmod{208} \\) ✓ (il testo usa \\( \\lambda(n) \\)).`,
          `**Regola d'esame.** Potenze modulari lasciate in forma \\( [a^k]_n \\): i calcoli espliciti non sono richiesti e valgono 0 se forzati.`,
        ], 'Appello 5/2/2026 · Problema 3'),
      O('D-a1-7', 'D-app1-0206', 'D-grafi', 'discreta', 4,
        `Grafo bipartito \\( G = (A, B, E) \\): \\( A \\) = sottoinsiemi di \\( [50] \\) di taglia 3, \\( B \\) = sottoinsiemi di taglia 6, \\( XRY \\iff X \\cap Y = \\varnothing \\). Esiste un matching di \\( A \\) in \\( B \\)?`,
        [
          `**Hall.** Serve \\( |N(S)| \\ge |S| \\) per ogni \\( S \\subseteq A \\).`,
          `**Vicini di un solo \\( X \\).** I 6-insiemi disgiunti da \\( X \\) (con \\( |X| = 3 \\)) sono \\( \\binom{47}{6} \\): un numero enorme, molto più grande di \\( |A| = \\binom{50}{3} \\)... confronto: \\( \\binom{47}{6} \\approx 10.7\\) milioni vs \\( \\binom{50}{3} = 19600 \\).`,
          `**Per \\( S \\) generico.** \\( |N(S)| \\ge \\binom{47}{6} \\gg |S| \\) per ogni \\( S \\) reale (ogni insieme disgiunto da un fissato \\( X \\in S \\) è vicino a tutto \\( S \\)... più precisamente i vicini di \\( S \\) contengono i disgiunti da \\( X \\) qualunque).`,
          `**Conclusione.** Hall è soddisfatto con larghezza enorme: il matching **esiste**.`,
        ], 'Appello 5/2/2026 · Problema 7'),
    ],
  },
  {
    id: 'D-app2-0226', label: 'Appello 1 di fine corso', date: '2026-02-27', course: 'discreta', group: 'a.a. 2025-2026 (8 problemi × 4 pt)',
    items: [
      O('D-a2-1', 'D-app2-0226', 'D-relazioni', 'discreta', 4,
        `Su \\( \\mathcal{P}([8]) \\setminus \\{\\varnothing\\} \\): \\( A R B \\iff \\min(A) \\le \\min(B) \\). È un ordine parziale?`,
        [
          `**Riflessiva ✓.** \\( \\min A \\le \\min A \\).`,
          `**Antisimmetrica ✗.** \\( A = \\{1\\}, B = \\{1,2\\} \\): \\( \\min \\) uguali → \\( ARB \\) e \\( BRA \\) ma \\( A \\ne B \\).`,
          `**Transitiva ✓** per transitività di \\( \\le \\).`,
          `**Risposta: NO** — è un preordine (riflessiva e transitiva), non un ordine parziale.`,
        ], 'Appello 27/2/2026 · Problema 1'),
      O('D-a2-2', 'D-app2-0226', 'D-modulare', 'discreta', 4,
        `Calcolare, se esiste, l'inversa moltiplicativa di \\( [84]_{119} \\).`,
        [
          `**Esistenza.** \\( \\gcd(84, 119) \\): \\( 119 = 1\\cdot84 + 35 \\); \\( 84 = 2\\cdot35 + 14 \\); \\( 35 = 2\\cdot14 + 7 \\); \\( 14 = 2\\cdot7 + 0 \\) → \\( \\gcd = 7 \\).`,
          `**Conclusione.** \\( 7 \\ne 1 \\): **l'inversa NON esiste** (119 = 7·17 e 84 = 7·12).`,
          `**Perché.** Se \\( [84][x] = [1]_{119} \\), allora \\( 84x - 119k = 1 \\) per qualche \\( k \\): il primo membro è multiplo di 7, il secondo no.`,
        ], 'Appello 27/2/2026 · Problema 2'),
      O('D-a2-3', 'D-app2-0226', 'D-rsa', 'discreta', 4,
        `Decodificare il messaggio \\( c = 38 \\) ricevuto da B (sistemi: tuo \\( n = 901, e = 37, d = 45 \\); pubblicate anche quelli di A).`,
        [
          `**Chiave.** \\( n = 901 = 17 \\cdot 53 \\); \\( d = 45 \\) è la chiave privata di B.`,
          `**Decodifica.** \\( M = [38^{45}]_{901} \\), in forma simbolica come richiesto.`,
          `**Coerenza della chiave.** \\( \\lambda(901) = \\mathrm{lcm}(16,52) = 208 \\) e \\( 37 \\cdot 45 \\equiv 1 \\pmod{208} \\) ✓.`,
        ], 'Appello 27/2/2026 · Problema 3'),
      O('D-a2-8', 'D-app2-0226', 'D-ricorsioni', 'discreta', 4,
        `Risolvere \\( f(n+3) = -3f(n+2) + 4f(n) \\) con \\( f(0) = 5, f(1) = -5, f(2) = 9 \\).`,
        [
          `**Caratteristica.** \\( x^3 + 3x^2 - 4 = 0 \\): \\( x = 1 \\) è radice: \\( x^3+3x^2-4 = (x-1)(x^2+4x+4) = (x-1)(x+2)^2 \\). Radici: \\( 1 \\) semplice, \\( -2 \\) **doppia**.`,
          `**Soluzione generale.** \\( f(n) = c_1 + (c_2 + c_3 n)(-2)^n \\).`,
          `**Sistema.** \\( f(0): c_1 + c_2 = 5 \\); \\( f(1): c_1 - 2(c_2+c_3) = -5 \\); \\( f(2): c_1 + 4(c_2 + 2c_3) = 9 \\). Risolvendo: \\( c_1 = 1, c_2 = 4, c_3 = -1 \\).`,
          `**Risposta.** \\( f(n) = 1 + (4-n)(-2)^n \\). Verifica \\( f(3) = 1 + 1\\cdot(-8) = -7 \\) e dalla ricorrenza \\( -3\\cdot9 + 4\\cdot5 = -7 \\) ✓.`,
        ], 'Appello 27/2/2026 · Problema 8'),
      O('D-a2-alt', 'D-app2-0226', 'D-ricorsioni', 'discreta', 4,
        `Risolvere \\( f(n+3) = -f(n+2) - 4f(n+1) - 4f(n) \\) con \\( f(0) = 10, f(1) = -4, f(2) = -20 \\).`,
        [
          `**Caratteristica.** \\( x^3 + x^2 + 4x + 4 = x^2(x+1) + 4(x+1) = (x+1)(x^2+4) \\). Radici: \\( -1, 2i, -2i = 2e^{\\pm i\\pi/2} \\).`,
          `**Soluzione generale.** \\( f(n) = c_1(-1)^n + 2^n\\bigl(c_2 \\cos\\tfrac{n\\pi}{2} + c_3 \\sin\\tfrac{n\\pi}{2}\\bigr) \\).`,
          `**Sistema.** \\( f(0): c_1 + c_2 = 10 \\); \\( f(1): -c_1 + 2c_3 = -4 \\); \\( f(2): c_1 - 4c_2 = -20 \\) (perché \\( \\cos\\pi = -1 \\)). Da cui \\( c_1 = 4, c_2 = 6, c_3 = 0 \\).`,
          `**Risposta.** \\( f(n) = 4(-1)^n + 6\\cdot2^n\\cos\\dfrac{n\\pi}{2} \\). Verifica \\( f(3) \\): formula \\( -4 + 0 = -4 \\); ricorrenza: \\( 20 + 16 - 40 = -4 \\) ✓.`,
        ], 'Esame precedente · ricorrenza con radici complesse'),
      O('D-a2-7', 'D-app2-0226', 'D-grafi', 'discreta', 4,
        `Due grafi con 8 vertici: \\( G \\) = quadrato inscritto in un quadrato con diagonali; \\( H \\) = configurazione "cubica" (due quadrati congiunti). Sono isomorfi?`,
        [
          `**Conta invarianti.** Vertici 8 e 8; archi: contali nei due disegni (G: 4+4 lati + 2 diagonali = 12? verifica sul tuo disegno; H: 4+4 lati + 4 spigoli = 12).`,
          `**Sequenza dei gradi.** G: i 4 vertici interni/diagonalizzati hanno grado 3, gli altri grado 2 → dipende dal disegno esatto: **calcolala sempre esplicitamente**. H (prisma-quadrato): tutti grado 3 → (3,3,3,3,3,3,3,3).`,
          `**Criterio.** Se le sequenze differiscono (es. G ha vertici di grado 2): **non isomorfi**. Se coincidono, cerca cicli di lunghezza minima: il prisma ha quadrati e nessun triangolo; G con diagonali ha triangoli.`,
          `**Metodo generale.** Gradi → componenti → cicli brevi → (se tutto uguale) costruisci la mappa.`,
        ], 'Esami a.a. 2015-16 · grafi isomorfi'),
    ],
  },
];

export const ALL_EXAMS = [...EXAMS_LOGICA.map(e => ({ ...e, items: e.items })), ...EXAMS_DISCRETA];
