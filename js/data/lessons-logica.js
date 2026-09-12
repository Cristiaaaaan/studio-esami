// lessons-logica.js — contenuti delle lezioni di Logica e Reti Logiche
// Formato: { title, course, minutes, sections: [{h, body}], quiz: [5 domande] }
// body = HTML + KaTeX con delimitatori \( ... \) e \[ ... \]
// quiz  = item tipo sessione (kind mc/tf/numeric, prompt, choices, answer, solution)

export const LESSONS_LOGICA = {

  /* ================================================================
     INDUZIONE E SUCCESSIONI
     ================================================================ */
  'L-induzione': {
    title: 'Induzione e successioni',
    course: 'logica',
    minutes: 22,
    sections: [
      {
        h: 'Il principio di induzione',
        body: `
<p>L’induzione è il metodo standard per dimostrare che una proprietà \\( P(n) \\) vale <strong>per ogni intero</strong> \\( n \\) da un certo punto in poi (di solito per ogni \\( n \\ge n_0 \\)). Funziona come una fila di tessere del domino:</p>
<ul>
  <li><strong>Base</strong>: verifichi che \\( P(n_0) \\) è vera (spingi la prima tessera);</li>
  <li><strong>Passo induttivo</strong>: assumi \\( P(n) \\) (<em>ipotesi induttiva</em>) e dimostri \\( P(n+1) \\) (una tessera caduta abbatta la successiva).</li>
</ul>
<p>Formalmente:</p>
\\[ \\bigl( P(n_0) \\;\\land\\; \\forall n \\ge n_0,\\; P(n) \\to P(n+1) \\bigr) \\;\\Longrightarrow\\; \\forall n \\ge n_0,\\; P(n). \\]
<div class="keybox"><span class="kt">Da ricordare</span>
L’ipotesi induttiva è \\( P(n) \\), <strong>non</strong> \\( P(n+1) \\): \\( P(n+1) \\) è la <em>tesi</em> del passo. Confonderle è l’errore più frequente negli esercizi scritti.</div>`,
      },
      {
        h: 'Una dimostrazione completa, passo per passo',
        body: `
<p><strong>Tesi</strong>: la somma dei primi \\( n \\) numeri dispari vale \\( n^2 \\), cioè \\( 1 + 3 + 5 + \\dots + (2n-1) = n^2 \\).</p>
<p><strong>Base</strong> (\\( n = 1 \\)): \\( 1 = 1^2 \\). ✓</p>
<p><strong>Passo</strong>: assumo \\( 1 + 3 + \\dots + (2n-1) = n^2 \\) e voglio provare \\( 1 + 3 + \\dots + (2n-1) + (2n+1) = (n+1)^2 \\). Parto dall’ipotesi e aggiungo \\( (2n+1) \\) ad ambo i membri:</p>
\\[ n^2 + (2n + 1) = (n+1)^2. \\]
<p>Il membro di destra è esattamente la tesi: il passo è dimostrato, quindi la formula vale per ogni \\( n \\ge 1 \\).</p>
<div class="exambox"><span class="kt">All’esame</span>
Scrivi sempre <em>esplicitamente</em> base, ipotesi induttiva e tesi del passo, e mostra dove usi l’ipotesi: è quello che il correttore cerca. La mossa tecnica tipica è «aggiungi il termine \\( (n+1) \\)-esimo ad ambo i membri dell’ipotesi».</div>`,
      },
      {
        h: 'Induzione forte e ricorrenze',
        body: `
<p>Nell’induzione <strong>forte</strong> il passo assume \\( P(k) \\) per <strong>tutti</strong> i \\( k \\le n \\) (non solo \\( P(n) \\)) e conclude \\( P(n+1) \\). Serve quando il termine successivo dipende da più termini precedenti, come nelle successioni definite per ricorrenza:</p>
\\[ F_0 = 0, \\quad F_1 = 1, \\quad F_{n+1} = F_n + F_{n-1} \\quad \\text{(Fibonacci)}. \\]
<p>Per dimostrare una formula chiusa per \\( F_n \\) (o per una ricorrenza qualunque \\( a_{n+1} = c_1 a_n + c_2 a_{n-1} \\)) serve l’induzione forte, perché \\( P(n+1) \\) usa sia \\( P(n) \\) sia \\( P(n-1) \\). Nota che in questi casi la base sono <strong>due</strong> verifiche: \\( P(0) \\) e \\( P(1) \\).</p>
<div class="warnbox"><span class="kt">Errore tipico</span>
Dichiarare l’induzione semplice ma usare \\( P(n-1) \\) nel passo senza dirlo. Se la ricorrenza guarda indietro di due passi: induzione forte e doppia base, sempre.</div>`,
      },
      {
        h: 'Perché funziona: il minimo intero',
        body: `
<p>L’induzione non è una magia: è equivalente al <strong>principio del minimo intero</strong> (ogni sottoinsieme non vuoto di \\( \\mathbb{N} \\) ha un minimo). Se \\( P \\) fallisse da qualche parte, l’insieme dei controesempi avrebbe un minimo \\( m \\). Ma \\( m > n_0 \\) (la base è verificata), quindi \\( P(m-1) \\) vale, e il passo induttivo darebbe \\( P(m) \\): contraddizione.</p>
<p>È lo stesso argomento usato in molti classici:</p>
<ul>
  <li>\\( \\sqrt{2} \\notin \\mathbb{Q} \\) (per assurdo, vedi sotto);</li>
  <li>esistono infiniti numeri primi: se \\( p_1, \\dots, p_k \\) fossero tutti, il numero \\( p_1 p_2 \\cdots p_k + 1 \\) non sarebbe divisibile per nessuno di essi.</li>
</ul>`,
      },
      {
        h: 'Dimostrazione per assurdo',
        body: `
<p>Schema: per provare \\( P \\), assumi \\( \\lnot P \\) e ricava una contraddizione (una formula della forma \\( q \\land \\lnot q \\)). Allora \\( P \\) deve essere vera.</p>
<p><strong>Esempio canonico</strong> (\\( \\sqrt{2} \\) irrazionale). Supponi \\( \\sqrt{2} = a/b \\) con \\( a, b \\) interi e la frazione ridotta ai minimi termini. Allora:</p>
\\[ a^2 = 2b^2 \\;\\Rightarrow\\; a^2 \\text{ pari} \\;\\Rightarrow\\; a \\text{ pari, quindi } a = 2k. \\]
<p>Sostituendo: \\( 4k^2 = 2b^2 \\), cioè \\( b^2 = 2k^2 \\), dunque anche \\( b \\) è pari. Ma \\( a \\) e \\( b \\) <strong>entrambi pari</strong> contraddice l’ipotesi che la frazione fosse ridotta ai minimi termini. ∎</p>
<div class="keybox"><span class="kt">Da ricordare</span>
La contraddizione finale è quasi sempre «l’ipotesi fatta all’inizio è violata» (qui: minimi termini). Cercala attivamente, non aspettarla per caso.</div>`,
      },
    ],
    quiz: [
      {
        kind: 'tf',
        prompt: 'Nell’induzione semplice, l’ipotesi induttiva del passo è \\( P(n+1) \\).',
        choices: [{ text: 'Vero' }, { text: 'Falso' }],
        answer: 1,
        solution: [
          '**No.** L’ipotesi induttiva è \\( P(n) \\): la assumi vera.',
          '\\( P(n+1) \\) è la **tesi** del passo: è quello che devi dimostrare usando \\( P(n) \\).',
        ],
      },
      {
        kind: 'numeric',
        prompt: 'Usa la formula di Gauss: quanto vale \\( 1 + 2 + 3 + \\dots + 100 \\)?',
        answer: '5050',
        solution: [
          '**Formula.** \\( 1 + 2 + \\dots + n = \\dfrac{n(n+1)}{2} \\), dimostrabile proprio per induzione.',
          '**Calcolo.** \\( \\dfrac{100 \\cdot 101}{2} = 50 \\cdot 101 = 5050 \\).',
        ],
      },
      {
        kind: 'mc',
        prompt: 'Quando è necessario usare l’induzione <strong>forte</strong>?',
        choices: [
          { text: 'Quando la tesi riguarda tutti gli interi, non solo i positivi' },
          { text: 'Quando il passo per P(n+1) richiede più ipotesi precedenti, non solo P(n)' },
          { text: 'Quando la base è falsa e va corretta' },
          { text: 'Quando si dimostra per assurdo invece che per induzione' },
        ],
        answer: 1,
        solution: [
          '**Induzione forte.** Si assume \\( P(k) \\) per ogni \\( k \\le n \\) e si conclude \\( P(n+1) \\).',
          '**Caso tipico.** Le ricorrenze con più termini precedenti, es. \\( F_{n+1} = F_n + F_{n-1} \\): servono sia \\( P(n) \\) sia \\( P(n-1) \\) (con doppia base).',
        ],
      },
      {
        kind: 'mc',
        prompt: 'Nella dimostrazione classica dell’irrazionalità di \\( \\sqrt{2} \\), quale contraddizione si ricava?',
        choices: [
          { text: 'Che \\( a^2 = b^2 \\), quindi \\( a = b \\)' },
          { text: 'Che \\( a \\) e \\( b \\) sono entrambi pari, contro l’ipotesi di minimi termini' },
          { text: 'Che \\( 2b^2 \\) è dispari' },
          { text: 'Che \\( \\sqrt{2} = 2/a \\), un circolo vizioso' },
        ],
        answer: 1,
        solution: [
          '**Catena.** \\( a^2 = 2b^2 \\Rightarrow a \\) pari, \\( a = 2k \\Rightarrow b^2 = 2k^2 \\Rightarrow b \\) pari.',
          '**Contraddizione.** Numeratore e denominatore entrambi pari violate la frazione ridotta ai minimi termini. ∎',
        ],
      },
      {
        kind: 'numeric',
        prompt: 'Successione definita da \\( a_0 = 2 \\), \\( a_1 = 3 \\) e \\( a_n = a_{n-1} + a_{n-2} \\). Quanto vale \\( a_4 \\)?',
        answer: '13',
        accept: ['13'],
        solution: [
          '**Termine a termine.** \\( a_2 = 3 + 2 = 5 \\), \\( a_3 = 5 + 3 = 8 \\), \\( a_4 = 8 + 5 = 13 \\).',
          '**Attenzione agli indici.** La definizione parte da \\( a_0 \\): \\( a_4 \\) è il quinto valore della successione.',
        ],
      },
    ],
  },

  /* ================================================================
     TAUTOLOGIE E CONNETTIVI
     ================================================================ */
  'L-prop': {
    title: 'Tautologie e connettivi',
    course: 'logica',
    minutes: 20,
    sections: [
      {
        h: 'Formule e connettivi',
        body: `
<p>La logica proposizionale costruisce formule a partire da <strong>variabili proposizionali</strong> (\\( p, q, r, \\dots \\), valgono 0 o 1) e dai connettivi:</p>
<table>
  <tr><th>Connettivo</th><th>Simbolo</th><th>Leggesi</th><th>Arietà</th></tr>
  <tr><td>negazione</td><td>\\( \\lnot p \\)</td><td>non p</td><td>1</td></tr>
  <tr><td>congiunzione</td><td>\\( p \\land q \\)</td><td>p e q</td><td>2</td></tr>
  <tr><td>disgiunzione</td><td>\\( p \\lor q \\)</td><td>p o q (inclusivo)</td><td>2</td></tr>
  <tr><td>implicazione</td><td>\\( p \\to q \\)</td><td>se p allora q</td><td>2</td></tr>
  <tr><td>doppia implicazione</td><td>\\( p \\leftrightarrow q \\)</td><td>p se e solo se q</td><td>2</td></tr>
</table>
<p>Le parentesi disambiguano; in loro assenza vale la <strong>priorità</strong> \\( \\lnot \\) ≻ \\( \\land \\) ≻ \\( \\lor \\) ≻ \\( \\to \\) ≻ \\( \\leftrightarrow \\). Una formula come \\( \\lnot p \\land q \\to r \\) si legge quindi \\( ((\\lnot p) \\land q) \\to r \\).</p>`,
      },
      {
        h: 'Tavole di verità: tautologie e contraddizioni',
        body: `
<p>Con \\( k \\) variabili la tavola di verità ha \\( 2^k \\) righe (una per ogni interpretazione). Tre casi possibili:</p>
<ul>
  <li><strong>Tautologia</strong> (formula valida): vera in <em>ogni</em> riga — es. \\( p \\lor \\lnot p \\);</li>
  <li><strong>Contraddizione</strong>: falsa in <em>ogni</em> riga — es. \\( p \\land \\lnot p \\);</li>
  <li><strong>Contingenza</strong>: vera in qualche riga e falsa in altre (soddisfacibile ma non valida).</li>
</ul>
<p>La tavola dell’implicazione è quella da sapere a memoria:</p>
<table>
  <tr><th>\\( p \\)</th><th>\\( q \\)</th><th>\\( p \\to q \\)</th></tr>
  <tr><td>0</td><td>0</td><td>1</td></tr>
  <tr><td>0</td><td>1</td><td>1</td></tr>
  <tr><td>1</td><td>0</td><td><strong>0</strong></td></tr>
  <tr><td>1</td><td>1</td><td>1</td></tr>
</table>
<div class="keybox"><span class="kt">Da ricordare</span>
\\( p \\to q \\) è falsa <strong>solo</strong> quando \\( p = 1 \\) e \\( q = 0 \\): «da premessa vera non si conclude falso». Con premessa falsa l’implicazione è (vacuamente) vera.</div>`,
      },
      {
        h: 'Equivalenze notevoli',
        body: `
<p>Due formule sono <strong>equivalenti</strong> (\\( A \\equiv B \\)) se hanno la stessa tavola di verità. Le equivalenze da sapere a memoria:</p>
<ul>
  <li><strong>De Morgan</strong>: \\( \\lnot(p \\land q) \\equiv \\lnot p \\lor \\lnot q \\) e \\( \\lnot(p \\lor q) \\equiv \\lnot p \\land \\lnot q \\);</li>
  <li><strong>Implicazione</strong>: \\( p \\to q \\equiv \\lnot p \\lor q \\equiv \\lnot q \\to \\lnot p \\) (contrapositiva);</li>
  <li><strong>Doppia implicazione</strong>: \\( p \\leftrightarrow q \\equiv (p \\to q) \\land (q \\to p) \\equiv (p \\land q) \\lor (\\lnot p \\land \\lnot q) \\);</li>
  <li><strong>Distributive</strong>: \\( p \\land (q \\lor r) \\equiv (p \\land q) \\lor (p \\land r) \\) e duale;</li>
  <li><strong>Doppia negazione</strong>: \\( \\lnot\\lnot p \\equiv p \\).</li>
</ul>
<p>I connettivi di <strong>Sheffer</strong> sono speciali: NAND (\\( p \\mid q \\equiv \\lnot(p \\land q) \\)) e NOR (\\( p \\downarrow q \\equiv \\lnot(p \\lor q) \\)) sono ciascuno <em>funzionalmente completo</em>: da soli esprimono tutti gli altri connettivi, perché</p>
\\[ \\lnot p \\equiv p \\mid p, \\qquad p \\land q \\equiv (p \\mid q) \\mid (p \\mid q), \\qquad p \\lor q \\equiv (p \\mid p) \\mid (q \\mid q). \\]
<div class="warnbox"><span class="kt">Errore tipico</span>
\\( \\lnot(p \\to q) \\not\\equiv \\lnot p \\to \\lnot q \\)! La negazione corretta è \\( p \\land \\lnot q \\) (l’unica riga che annulla l’implicazione).</div>`,
      },
      {
        h: 'Conseguenza logica: ⊨ contro →',
        body: `
<p>Attenzione a non confondere due cose simili ma diverse:</p>
<ul>
  <li>\\( A \\to B \\) è una <strong>formula</strong> (il connettivo implicazione);</li>
  <li>\\( A \\models B \\) è una <strong>relazione tra formule</strong>: in ogni interpretazione in cui \\( A \\) è vera, anche \\( B \\) è vera («\\( A \\) implica logicamente \\( B \\)»).</li>
</ul>
<p>Il ponte tra le due: \\( A \\models B \\;\\iff\\; A \\to B \\) è una tautologia. Analogamente \\( A \\equiv B \\) significa \\( A \\models B \\) e \\( B \\models A \\).</p>
<p>Per verificare \\( A \\models B \\) <em>senza</em> fare la tavola intera: cerca un’interpretazione con \\( A \\) vera e \\( B \\) falsa. Se esiste, è un controesempio e l’implicazione non vale; se non esiste, vale.</p>
<div class="exambox"><span class="kt">All’esame</span>
Domanda classica: «\\( A \\models B \\)?» — prova a costruire il controesempio (assegna 1 alle lettere di \\( A \\) e forza \\( B \\) a 0). Trovarlo è spesso più veloce della tavola completa.</div>`,
      },
    ],
    quiz: [
      {
        kind: 'numeric',
        prompt: 'Quante righe ha la tavola di verità di una formula con 4 variabili proposizionali?',
        answer: '16',
        solution: [
          '**Regola.** Con \\( k \\) variabili: \\( 2^k \\) righe (una per interpretazione).',
          '**Calcolo.** \\( 2^4 = 16 \\).',
        ],
      },
      {
        kind: 'mc',
        prompt: 'Quale delle seguenti è equivalente a \\( p \\to q \\)?',
        choices: [
          { tex: '\\lnot p \\land q' },
          { tex: '\\lnot p \\lor q' },
          { tex: 'p \\lor \\lnot q' },
          { tex: '\\lnot q \\land p' },
        ],
        answer: 1,
        solution: [
          '**Equivalenza chiave.** \\( p \\to q \\equiv \\lnot p \\lor q \\).',
          '**Contrapositiva.** Equivalente anche a \\( \\lnot q \\to \\lnot p \\); l’unica riga falsa resta \\( p=1, q=0 \\).',
        ],
      },
      {
        kind: 'tf',
        prompt: '\\( p \\to q \\) è falsa se e solo se \\( p \\) è vera e \\( q \\) è falsa.',
        choices: [{ text: 'Vero' }, { text: 'Falso' }],
        answer: 0,
        solution: [
          '**Tavola.** Nelle altre tre righe (00, 01, 11) l’implicazione vale 1.',
          '**Intuizione.** «Da premessa vera non si conclude falso»; con premessa falsa l’implicazione è vera.',
        ],
      },
      {
        kind: 'mc',
        prompt: 'Quale delle seguenti formule è una tautologia?',
        choices: [
          { tex: '(p \\land q) \\to p' },
          { tex: '(p \\lor q) \\to p' },
          { tex: 'p \\to (q \\land p)' },
          { tex: '(p \\to q) \\to (q \\to p)' },
        ],
        answer: 0,
        solution: [
          '**Verifica.** Se \\( p \\land q \\) è vera allora \\( p \\) è vera: non esiste riga con antecedente 1 e conseguente 0.',
          '**Le altre.** Cade ciascuna con \\( p=1, q=0 \\) (o simmetrico): sono contingenze.',
        ],
      },
      {
        kind: 'tf',
        prompt: '\\( A \\models B \\) se e solo se \\( A \\to B \\) è una tautologia.',
        choices: [{ text: 'Vero' }, { text: 'Falso' }],
        answer: 0,
        solution: [
          '**È il ponte** tra relazione di conseguenza e connettivo materiale.',
          '**Uso pratico.** Per confutare \\( A \\models B \\) basta un’interpretazione con \\( A \\) vera e \\( B \\) falsa: proprio la riga che falsifica \\( A \\to B \\).',
        ],
      },
    ],
  },

  /* ================================================================
     FORME NORMALI (FNC/FND)
     ================================================================ */
  'L-fnf': {
    title: 'Forme normali (FNC/FND)',
    course: 'logica',
    minutes: 20,
    sections: [
      {
        h: 'Lettere, letterali e perché le forme normali',
        body: `
<p>Una <strong>lettera</strong> è una variabile proposizionale; un <strong>letterale</strong> è una variabile o la sua negazione (\\( p \\), \\( \\lnot p \\)). Le due forme normali standard sono:</p>
<ul>
  <li><strong>FND</strong> (disgiuntiva): OR di AND di letterali — \\( \\bigvee_i \\bigwedge_j L_{ij} \\) — «somma di prodotti»;</li>
  <li><strong>FNC</strong> (congiuntiva): AND di OR di letterali — \\( \\bigwedge_i \\bigvee_j L_{ij} \\) — «prodotto di somme».</li>
</ul>
<p>Perché servono: hanno una struttura regolare che si <em>legge direttamente dalla tavola di verità</em> e sono il punto di partenza per costruire i circuiti (e le mappe di Karnaugh).</p>
<div class="keybox"><span class="kt">Da ricordare</span>
FND = guardi le righe con \\( y = 1 \\). FNC = guardi le righe con \\( y = 0 \\). Tutto il resto è dettaglio dei segni.</div>`,
      },
      {
        h: 'FND: OR dei mintermini (righe con y = 1)',
        body: `
<p>Per ogni riga della tavola in cui la funzione vale 1 costruisci un <strong>mintermine</strong>: prodotto che contiene <em>tutte</em> le variabili, ciascuna <strong>non negata se vale 1</strong> in quella riga, <strong>negata se vale 0</strong>. La FND è l’OR dei mintermini.</p>
<p><strong>Esempio</strong> — funzione a 2 variabili con \\( y = 1 \\) sulle righe 00 e 11:</p>
<table>
  <tr><th>\\( x \\)</th><th>\\( y \\)</th><th>\\( f \\)</th><th></th></tr>
  <tr><td>0</td><td>0</td><td>1</td><td>mintermine \\( \\lnot x \\land \\lnot y \\)</td></tr>
  <tr><td>0</td><td>1</td><td>0</td><td>—</td></tr>
  <tr><td>1</td><td>0</td><td>0</td><td>—</td></tr>
  <tr><td>1</td><td>1</td><td>1</td><td>mintermine \\( x \\land y \\)</td></tr>
</table>
\\[ f \\;\\equiv\\; (\\lnot x \\land \\lnot y) \\;\\lor\\; (x \\land y) \\qquad \\text{(coincidenza, XNOR).} \\]
<div class="exambox"><span class="kt">All’esame</span>
Conta i mintermini quante sono le righe a 1: se la tavola ha tre 1, la FND ha tre prodotti. Controllo rapido anti-distrazione.</div>`,
      },
      {
        h: 'FNC: AND dei maxtermini (righe con y = 0)',
        body: `
<p>Duale: per ogni riga con \\( y = 0 \\) costruisci un <strong>maxtermine</strong>: somma con <em>tutte</em> le variabili, ciascuna <strong>non negata se vale 0</strong>, <strong>negata se vale 1</strong>. La FNC è l’AND dei maxtermini. I segni sono <em>invertiti</em> rispetto ai mintermini — ed è giusto così, perché un maxtermine deve <strong>annullarsi esattamente sulla sua riga</strong> (e valere 1 sulle altre).</p>
<p>Per la stessa tavola di prima (zeri sulle righe 01 e 10):</p>
\\[ f \\;\\equiv\\; (\\lnot x \\lor y) \\;\\land\\; (x \\lor \\lnot y). \\]
<p>Verifica sulla riga 01 (\\( x=0, y=1 \\)): il primo fattore vale \\( 1 \\lor 1 = 1 \\), il secondo \\( 0 \\lor 0 = 0 \\) → prodotto 0. ✓</p>
<div class="warnbox"><span class="kt">Errore tipico</span>
Usare i segni dei mintermini anche per la FNC. Regola unica: <em>il termine deve valere 0 esattamente sulla riga cui è associato</em> (maxtermine) o 1 esattamente su quella (mintermine) — ricontrolla sempre con la riga.</div>`,
      },
      {
        h: 'Negare una formula: l’algoritmo',
        body: `
<p>Per scrivere \\( \\lnot F \\) in forma normale (senza \\( \\to \\), con negazioni solo sulle lettere):</p>
<ul>
  <li><strong>1.</strong> Elimina \\( \\to \\) e \\( \\leftrightarrow \\): \\( p \\to q \\rightsquigarrow \\lnot p \\lor q \\);</li>
  <li><strong>2.</strong> Porta \\( \\lnot \\) verso dentro con <strong>De Morgan</strong>, scambiando \\( \\land \\leftrightarrow \\lor \\);</li>
  <li><strong>3.</strong> Semplifica le doppie negazioni: \\( \\lnot\\lnot p \\rightsquigarrow p \\).</li>
</ul>
<p><strong>Esempio</strong>: negazione di \\( F = p \\land (q \\to r) \\):</p>
\\[ \\lnot F \\;\\equiv\\; \\lnot p \\;\\lor\\; \\lnot(q \\to r) \\;\\equiv\\; \\lnot p \\;\\lor\\; \\lnot(\\lnot q \\lor r) \\;\\equiv\\; \\lnot p \\;\\lor\\; (q \\land \\lnot r). \\]
<p>Con i quantificatori (primo ordine) la stessa idea: \\( \\lnot \\forall x\\, P \\equiv \\exists x\\, \\lnot P \\) e \\( \\lnot \\exists x\\, P \\equiv \\forall x\\, \\lnot P \\).</p>`,
      },
    ],
    quiz: [
      {
        kind: 'mc',
        prompt: 'La FND di una funzione booleana si costruisce come OR dei mintermini corrispondenti a…',
        choices: [
          { text: 'tutte le righe della tavola' },
          { text: 'le righe in cui la funzione vale 1' },
          { text: 'le righe in cui la funzione vale 0' },
          { text: 'le righe con un numero pari di uni' },
        ],
        answer: 1,
        solution: [
          '**FND.** Un mintermine per ogni riga con \\( y = 1 \\): la funzione è l’OR di tutti i casi in cui è vera.',
          '**Duale.** La FNC usa le righe con \\( y = 0 \\) (maxtermini).',
        ],
      },
      {
        kind: 'tf',
        prompt: 'Nella FNC, se sulla riga con \\( y = 0 \\) una variabile vale 0, essa compare nel maxtermine <strong>senza</strong> negazione.',
        choices: [{ text: 'Vero' }, { text: 'Falso' }],
        answer: 0,
        solution: [
          '**Regola dei segni (maxtermine).** Variabile a 0 → non negata; a 1 → negata. Così il maxtermine si annulla esattamente su quella riga.',
          '**Mnemonica.** Nei maxtermini i segni sono opposti a quelli letti nella riga; nei mintermini uguali.',
        ],
      },
      {
        kind: 'mc',
        prompt: 'Una funzione \\( f(x, y) \\) vale 1 sulle righe 00 e 11. Qual è la sua FND?',
        choices: [
          { tex: '(\\lnot x \\land \\lnot y) \\lor (x \\land y)' },
          { tex: '(\\lnot x \\lor y) \\land (x \\lor \\lnot y)' },
          { tex: '(\\lnot x \\land y) \\lor (x \\land \\lnot y)' },
          { tex: '(x \\lor y) \\land (\\lnot x \\lor \\lnot y)' },
        ],
        answer: 0,
        solution: [
          '**Mintermini.** Riga 00 → \\( \\lnot x \\land \\lnot y \\); riga 11 → \\( x \\land y \\); OR dei due.',
          '**Riconosci la funzione.** È la coincidenza (XNOR); la FND in posizione 1 è invece il suo duale (la FNC della stessa funzione).',
        ],
      },
      {
        kind: 'mc',
        prompt: 'Quale è la forma normale di \\( \\lnot\\bigl(p \\land (q \\to r)\\bigr) \\) con negazioni solo sulle lettere?',
        choices: [
          { tex: '\\lnot p \\lor (q \\land \\lnot r)' },
          { tex: '\\lnot p \\lor \\lnot q \\lor \\lnot r' },
          { tex: 'p \\land (\\lnot q \\lor r)' },
          { tex: '\\lnot p \\land (q \\lor \\lnot r)' },
        ],
        answer: 0,
        solution: [
          '**Passo 1.** \\( q \\to r \\equiv \\lnot q \\lor r \\), quindi \\( F = p \\land (\\lnot q \\lor r) \\).',
          '**Passo 2.** De Morgan: \\( \\lnot F \\equiv \\lnot p \\lor \\lnot(\\lnot q \\lor r) \\equiv \\lnot p \\lor (q \\land \\lnot r) \\).',
        ],
      },
      {
        kind: 'numeric',
        prompt: 'Una formula contiene 4 variabili. Quante variabili contiene ogni suo mintermine (completo)?',
        answer: '4',
        solution: [
          '**Definizione.** Mintermine e maxtermine completi contengono **tutte** le variabili della funzione, ciascuna una sola volta (negata o no).',
          '**Qui.** 4 variabili → ogni termine completo ne ha 4.',
        ],
      },
    ],
  },

  /* ================================================================
     MAPPE DI KARNAUGH
     ================================================================ */
  'L-karnaugh': {
    title: 'Mappe di Karnaugh',
    course: 'logica',
    minutes: 20,
    sections: [
      {
        h: 'Dalla tavola alla mappa: il codice di Gray',
        body: `
<p>La mappa di Karnaugh è la tavola di verità ridisegnata in modo che <strong>celle adiacenti differiscano per una sola variabile</strong>. Con 3 variabili: 2 righe (\\( x \\)) × 4 colonne (\\( y,z \\)); con 4 variabili: 4 × 4. Le etichette seguono il <strong>codice di Gray</strong>:</p>
\\[ 00 \\;\\; 01 \\;\\; 11 \\;\\; 10 \\]
<p>Nota che 11 torna «vicino» a 10 e — cosa che sorprende — la prima e l’ultima colonna (00 e 10) sono pure adiacenti: la mappa si chiude su sé stessa come un <strong>toro</strong>. Anche la riga 00 e la riga 10 sono adiacenti.</p>
<div class="keybox"><span class="kt">Da ricordare</span>
Due celle sono adiacenti ⟺ le loro combinazioni differiscono per <strong>esattamente un bit</strong>. Gli angoli opposti della mappa 4×4 sono un gruppo valido di 4.</div>`,
      },
      {
        h: 'Raggruppare gli 1',
        body: `
<p>Si scrive 1 nelle celle dove la funzione vale 1, poi si coprono tutti gli 1 con <strong>gruppi rettangolari</strong> rispettando tre regole:</p>
<ul>
  <li>i lati dei gruppi sono <strong>potenze di 2</strong>: 1, 2, 4, 8, 16 celle (mai 3, 6, 12…);</li>
  <li>i gruppi siano <strong>il più grande possibile</strong> (più grande il gruppo, più variabili sparisco);</li>
  <li><strong>ogni 1 deve essere coperto</strong> almeno una volta (le celle possono appartare a più gruppi).</li>
</ul>
<p>Un gruppo di \\( 2^k \\) celle elimina \\( k \\) variabili: nel gruppo sopravvivono solo le variabili che restano <strong>costanti</strong> (e il loro valore decide se la variabile compare negata o no).</p>
<p><strong>Esempio</strong> (2 variabili, 1 su 00, 01, 10): le celle 00-01 formano un gruppo dove \\( x = 0 \\) costante → termine \\( \\lnot x \\); le celle 00-10 hanno \\( y = 0 \\) costante → termine \\( \\lnot y \\). Risultato: \\( f = \\lnot x \\lor \\lnot y \\).</p>
<div class="warnbox"><span class="kt">Errore tipico</span>
Dimenticare le adiacenze «attorno al bordo» (00↔10): i gruppi che attraversano il bordo sono legali e spesso sono proprio quelli che minimizzano di più.</div>`,
      },
      {
        h: 'Implicant primi ed essenziali',
        body: `
<p>Vocabolario formale per scegliere la copertura <strong>minima</strong>:</p>
<ul>
  <li>un gruppo ammissibile è un <strong>implicant</strong> della funzione (il suo prodotto implica la funzione: dove il prodotto vale 1, la funzione vale 1);</li>
  <li>è <strong>implicant primo</strong> se non è contenuto in un gruppo più grande (non si può allargare);</li>
  <li>è <strong>essenziale</strong> se copre almeno un 1 che <em>nessun altro</em> implicant primo copre.</li>
</ul>
<p>Algoritmo: elenca gli implicant primi, prendi <strong>tutti gli essenziali</strong> (sono obbligatori), poi completa la copertura degli 1 rimasti scoperti con il minor numero di implicant primi. L’OR del risultato è la FND minimizzata.</p>`,
      },
      {
        h: 'Metodo d’esame',
        body: `
<p>Passi consigliati per «minimizzare con Karnaugh la funzione data dalla tavola»:</p>
<ul>
  <li><strong>1.</strong> Ridisegna la mappa con l’ordine di Gray <em>senza sbagliare le etichette</em>;</li>
  <li><strong>2.</strong> Cerca prima i gruppi grandi (8, poi 4, poi 2, poi 1 isolati);</li>
  <li><strong>3.</strong> Verifica che ogni 1 sia coperto e segna gli essenziali;</li>
  <li><strong>4.</strong> Scrivi un termine per gruppo (solo le variabili costanti) e fanne l’OR;</li>
  <li><strong>5.</strong> Controllo: assegna a una cella coperta i valori delle sue variabili e controlla che la formula dia 1.</li>
</ul>
<p>Se compaiono <strong>don’t care</strong> (X, valore indifferente), usali come jolly: valgono 1 se aiutano ad allargare un gruppo, 0 altrimenti — non vanno mai coperti per forza.</p>
<div class="exambox"><span class="kt">All’esame</span>
La FND minimizzata con Karnaugh deve comunque essere una FND valida della funzione: se hai dubbi su un gruppo, torna alla riga della tavola. Un gruppo illegale (3 celle!) costa l’intero esercizio.</div>`,
      },
    ],
    quiz: [
      {
        kind: 'tf',
        prompt: 'In una mappa di Karnaugh è ammesso un gruppo di 3 celle adiacenti a 1.',
        choices: [{ text: 'Vero' }, { text: 'Falso' }],
        answer: 1,
        solution: [
          '**No.** I gruppi hanno lati potenze di 2: 1, 2, 4, 8, 16 celle.',
          '**Perché.** Un gruppo di \\( 2^k \\) celle elimina esattamente \\( k \\) variabili; con 3 celle (\\( 2^{1{,}58} \\)) la semplificazione non avrebbe senso algebrico.',
        ],
      },
      {
        kind: 'mc',
        prompt: 'In una mappa a 4 colonne etichettate in codice di Gray, quali coppie di colonne sono <strong>adiacenti</strong>?',
        choices: [
          { text: 'Solo 00-01 e 01-11 e 11-10' },
          { text: '00-01, 01-11, 11-10 e anche 10-00 (la mappa si chiude)' },
          { text: 'Tutte le coppie di colonne' },
          { text: 'Nessuna: l’adiacenza riguarda solo le righe' },
        ],
        answer: 1,
        solution: [
          '**Gray.** Colonne vicine differiscono di un bit: 00→01→11→10.',
          '**Toro.** Anche 10 e 00 differiscono di un bit: la mappa si richiude, e lo stesso vale per le righe.',
        ],
      },
      {
        kind: 'numeric',
        prompt: 'In una mappa di Karnaugh a 4 variabili, quante variabili elimina un gruppo di 8 celle?',
        answer: '3',
        solution: [
          '**Regola.** Gruppo di \\( 2^k \\) celle → \\( k \\) variabili eliminate.',
          '**Qui.** \\( 8 = 2^3 \\) → sopravvive una sola variabile (quella costante sul gruppo).',
        ],
      },
      {
        kind: 'mc',
        prompt: 'Quando un implicant primo si dice <strong>essenziale</strong>?',
        choices: [
          { text: 'Quando è il più grande gruppo possibile nella mappa' },
          { text: 'Quando copre almeno un 1 che nessun altro implicant primo copre' },
          { text: 'Quando copre tutte le celle a 1 della mappa da solo' },
          { text: 'Quando contiene una cella a 0 al proprio interno' },
        ],
        answer: 1,
        solution: [
          '**Definizione.** Essenziale = insostituibile: c’è un 1 che solo lui copre tra gli implicant primi.',
          '**Conseguenza.** Gli essenziali entrano sempre nella copertura minima, a prescindere dalla scelta degli altri gruppi.',
        ],
      },
      {
        kind: 'mc',
        prompt: 'Funzione di 2 variabili con 1 nelle celle 00, 01 e 10 (0 solo in 11). Qual è la FND minimizzata?',
        choices: [
          { tex: '\\lnot x \\lor \\lnot y' },
          { tex: '\\lnot x \\land \\lnot y' },
          { tex: 'x \\lor y' },
          { tex: '\\lnot x \\land y' },
        ],
        answer: 0,
        solution: [
          '**Gruppi.** 00-01 → \\( x = 0 \\) costante → \\( \\lnot x \\); 00-10 → \\( y = 0 \\) costante → \\( \\lnot y \\).',
          '**Risultato.** \\( f = \\lnot x \\lor \\lnot y \\). Check sulla cella 11: \\( \\lnot 1 \\lor \\lnot 1 = 0 \\), e infatti lì la funzione vale 0. ✓',
        ],
      },
    ],
  },
};
