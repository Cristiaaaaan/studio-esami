// lessons-discreta.js — contenuti delle lezioni di Matematica Discreta
// Stesso formato di lessons-logica.js (title, course, minutes, sections, quiz).

export const LESSONS_DISCRETA = {

  /* ================================================================
     FUNZIONI E CONTROIMMAGINI
     ================================================================ */
  'D-funzioni': {
    title: 'Funzioni e controimmagini',
    course: 'discreta',
    minutes: 20,
    sections: [
      {
        h: 'Dominio, codominio, immagine',
        body: `
<p>Una <strong>funzione</strong> \\( f : A \\to B \\) associa a <em>ogni</em> elemento di \\( A \\) (dominio) <em>esattamente uno</em> elemento di \\( B \\) (codominio). Non è solo «la legge»: è la terna legge + dominio + codominio — cambiar codominio cambia funzione.</p>
<ul>
  <li>l’<strong>immagine</strong> \\( f(S) = \\{ f(x) : x \\in S \\} \\) vive nel codominio ed è l’insieme dei valori <em>effettivamente assunti</em>;</li>
  <li>\\( f(A) \\) è l’immagine dell’intera funzione: sempre \\( \\subseteq B \\), uguale a \\( B \\) se e solo se \\( f \\) è suriettiva.</li>
</ul>
<div class="keybox"><span class="kt">Da ricordare</span>
Codominio = dove <em>potrebbero</em> finire i valori (è dichiarato); immagine = dove <em>finiscono davvero</em> (si calcola). Suriettiva ⟺ immagine = codominio.</div>`,
      },
      {
        h: 'Iniettiva, suriettiva, biettiva',
        body: `
<p>Le tre proprietà cardinali di \\( f : A \\to B \\):</p>
<ul>
  <li><strong>iniettiva</strong>: elementi distinti hanno immagini distinte, \\( x \\ne y \\Rightarrow f(x) \\ne f(y) \\) (equivalentemente: \\( f(x) = f(y) \\Rightarrow x = y \\));</li>
  <li><strong>suriettiva</strong>: ogni \\( b \\in B \\) è \\( f(x) \\) per almeno un \\( x \\);</li>
  <li><strong>biettiva</strong>: entrambe → esiste l’inversa \\( f^{-1} : B \\to A \\).</li>
</ul>
<p>Su insiemi <strong>finiti</strong> il principio dei piccioni vincola tutto:</p>
\\[ |A| > |B| \\Rightarrow \\text{non iniettiva}, \\qquad |A| < |B| \\Rightarrow \\text{non suriettiva}. \\]
<p>Quindi tra finiti della stessa cardinalità: iniettiva ⟺ suriettiva ⟺ biettiva.</p>
<div class="exambox"><span class="kt">All’esame</span>
Per dimostrare «non iniettiva» su insiemi infiniti non bastano i cardinali: servono due elementi espliciti con la stessa immagine. Per «iniettiva» si usa la definizione: da \\( f(x) = f(y) \\) si ricava \\( x = y \\).</div>`,
      },
      {
        h: 'Controimmagini',
        body: `
<p>La <strong>controimmagine</strong> di un sottoinsieme \\( S \\subseteq B \\) è l’insieme delle preimagini:</p>
\\[ f^{-1}(S) \\;=\\; \\{\\, x \\in A : f(x) \\in S \\,\\}. \\]
<p>Nonostante il simbolo, <strong>non serve che \\( f \\) sia biettiva</strong>: la controimmagine è sempre definita. Casi particolari utili:</p>
<ul>
  <li>\\( f^{-1}(B) = A \\) sempre; \\( f^{-1}(S) = \\varnothing \\) se \\( S \\) non incontra l’immagine di \\( f \\);</li>
  <li>se \\( f \\) è biettiva, \\( |f^{-1}(S)| = |S| \\);</li>
  <li>in generale \\( f^{-1}(\\{v\\}) \\) può avere 0, 1, 2, … infiniti elementi.</li>
</ul>`,
      },
      {
        h: 'Metodo per l’esame: funzioni a pezzi su N',
        body: `
<p>Il caso tipico dello scritto: \\( f : \\mathbb{N} \\to \\mathbb{Z} \\) definita a rami sulla parità, chiedere \\( f^{-1}(\\{v\\}) \\). Procedura meccanica:</p>
<ul>
  <li><strong>1.</strong> Per ogni ramo scrivi l’equazione «ramo = v» e risolvi in \\( n \\);</li>
  <li><strong>2.</strong> Per ogni soluzione controlla i <strong>vincoli di ammissibilità</strong>: \\( n \\in \\mathbb{N} \\) (niente negativi!) e la <strong>parità giusta per quel ramo</strong>;</li>
  <li><strong>3.</strong> L’unione delle soluzioni superstiti è \\( f^{-1}(\\{v\\}) \\).</li>
</ul>
<p><strong>Esempio</strong>: \\( f(n) = 2n+1 \\) (tutti i \\( n \\)); \\( f^{-1}(\\{15\\}) \\): \\( 2n+1 = 15 \\Rightarrow n = 7 \\in \\mathbb{N} \\) ✓ → \\( f^{-1}(\\{15\\}) = \\{7\\} \\).</p>
<div class="warnbox"><span class="kt">Errore tipico</span>
Dimenticare il controllo di parità quando il ramo vale «se \\( n \\) pari» o «se \\( n \\) dispari»: una soluzione \\( n = 6 \\) per il ramo dispari è da scartare, anche se l’equazione era giusta.</div>`,
      },
    ],
    quiz: [
      {
        kind: 'tf',
        prompt: 'Se \\( f : A \\to B \\) è iniettiva e \\( A, B \\) sono finiti, allora \\( |A| \\le |B| \\).',
        choices: [{ text: 'Vero' }, { text: 'Falso' }],
        answer: 0,
        solution: [
          '**Principio dei piccioni.** Iniettiva = «più piccioni che buchi è impossibile»: ogni \\( x \\) occupa un \\( f(x) \\) diverso in \\( B \\).',
          '**Duale.** Suriettiva con finiti ⇒ \\( |A| \\ge |B| \\).',
        ],
      },
      {
        kind: 'numeric',
        prompt: 'Sia \\( f : \\mathbb{N} \\to \\mathbb{N} \\), \\( f(n) = 2n + 1 \\). Determina l’unico elemento di \\( f^{-1}(\\{15\\}) \\).',
        answer: '7',
        solution: [
          '**Equazione.** \\( 2n + 1 = 15 \\Rightarrow n = 7 \\).',
          '**Ammissibilità.** \\( 7 \\in \\mathbb{N} \\) ✓ → \\( f^{-1}(\\{15\\}) = \\{7\\} \\).',
        ],
      },
      {
        kind: 'mc',
        prompt: 'Per una funzione qualsiasi \\( f : A \\to B \\) (non necessariamente biettiva) e \\( S \\subseteq B \\), quale affermazione è vera?',
        choices: [
          { text: '\\( f^{-1}(S) \\) è definita solo se \\( f \\) è biettiva' },
          { text: '\\( f^{-1}(S) \\) è sempre definita e può anche essere vuota' },
          { text: '\\( f^{-1}(S) \\) ha sempre la stessa cardinalità di \\( S \\)' },
          { text: '\\( f^{-1}(S) \\) è un sottoinsieme di \\( B \\)' },
        ],
        answer: 1,
        solution: [
          '**Definizione.** \\( f^{-1}(S) = \\{x \\in A : f(x) \\in S\\} \\): si legge attraverso \\( f \\), non serve invertirla.',
          '**Casi estremi.** Se \\( S \\cap f(A) = \\varnothing \\) allora \\( f^{-1}(S) = \\varnothing \\); la cardinalità di \\( S \\) è rispettata solo se \\( f \\) è biettiva.',
        ],
      },
      {
        kind: 'mc',
        prompt: 'Sia \\( f : \\mathbb{N} \\to \\mathbb{Z} \\) definita da \\( f(n) = n/2 \\) se \\( n \\) pari, \\( f(n) = n - 1 \\) se \\( n \\) dispari. Com’è \\( f^{-1}(\\{3\\}) \\)?',
        choices: [
          { tex: '\\{6\\}' },
          { tex: '\\{4\\}' },
          { tex: '\\{6, 4\\}' },
          { tex: '\\varnothing' },
        ],
        answer: 0,
        solution: [
          '**Ramo pari.** \\( n/2 = 3 \\Rightarrow n = 6 \\), che è pari: ammissibile, e infatti \\( f(6) = 3 \\). ✓',
          '**Ramo dispari.** \\( n - 1 = 3 \\Rightarrow n = 4 \\): ma 4 è pari, quindi appartiene all’altro ramo (e lì \\( f(4) = 2 \\ne 3 \\)): da scartare.',
          '**Conclusione.** \\( f^{-1}(\\{3\\}) = \\{6\\} \\). Il controllo di parità è il punto dell’esercizio.',
        ],
      },
      {
        kind: 'tf',
        prompt: 'Per ogni funzione \\( f : A \\to B \\) vale \\( f^{-1}(B) = A \\).',
        choices: [{ text: 'Vero' }, { text: 'Falso' }],
        answer: 0,
        solution: [
          '**Perché.** Ogni \\( x \\in A \\) ha \\( f(x) \\in B \\) per definizione di funzione.',
          '**Utile.** È il controllo di sanità quando manipoli controimmagini: \\( f^{-1}(\\varnothing) = \\varnothing \\) e \\( f^{-1}(B) = A \\).',
        ],
      },
    ],
  },

  /* ================================================================
     RELAZIONI E ORDINI
     ================================================================ */
  'D-relazioni': {
    title: 'Relazioni e ordini',
    course: 'discreta',
    minutes: 22,
    sections: [
      {
        h: 'Relazioni binarie',
        body: `
<p>Una <strong>relazione binaria</strong> su \\( A \\) è un sottoinsieme \\( R \\subseteq A \\times A \\); si scrive \\( a \\,R\\, b \\) per \\( (a,b) \\in R \\). Su un insieme finito con \\( |A| = n \\) ci sono \\( n^2 \\) coppie possibili e \\( 2^{n^2} \\) relazioni distinte.</p>
<p>Su \\( \\mathcal{P}([n]) \\) (le parti di \\( \\{1, \\dots, n\\} \\)) le relazioni tipiche dello scritto si definiscono tramite min/max/cardinalità, ad esempio</p>
\\[ A \\,R\\, B \\iff \\min(A) \\le \\min(B), \\qquad A \\,R\\, B \\iff |A| = |B|, \\qquad A \\,R\\, B \\iff A \\subseteq B. \\]
<p>Tre rappresentazioni equivalenti: insieme di coppie, <em>matrice booleana</em> \\( n \\times n \\), <em>grafo diretto</em> con archi \\( a \\to b \\).</p>`,
      },
      {
        h: 'Le quattro proprietà',
        body: `
<p>Le proprietà strutturali da saper verificare su qualunque relazione:</p>
<ul>
  <li><strong>riflessiva</strong>: \\( a \\,R\\, a \\) per ogni \\( a \\in A \\);</li>
  <li><strong>simmetrica</strong>: \\( a \\,R\\, b \\Rightarrow b \\,R\\, a \\);</li>
  <li><strong>antisimmetrica</strong>: \\( a \\,R\\, b \\) e \\( b \\,R\\, a \\Rightarrow a = b \\) (su insiemi di insiemi: \\( A = B \\));</li>
  <li><strong>transitiva</strong>: \\( a \\,R\\, b \\) e \\( b \\,R\\, c \\Rightarrow a \\,R\\, c \\).</li>
</ul>
<div class="warnbox"><span class="kt">Errore tipico</span>
«Antisimmetrica» NON è il contrario di «simmetrica»! La relazione identità (\\( a \\,R\\, b \\iff a = b \\)) è <strong>entrambe</strong>; su \\( \\{1,2\\} \\) la relazione \\( \\{(1,1),(1,2),(2,1)\\} \\) non è né simmetrica né antisimmetrica (manca \\( (2,2) \\)).</div>
<p>Tecnica di verifica: per le proprietà <em>valide</em> serve un argomento generale; per <em>confutarle</em> basta una <strong>coppia (o elemento) controesempio esplicito</strong> — con \\( A \\) piccolo, prova \\( \\varnothing \\), i singoletti e \\( [n] \\) intero.</p>`,
      },
      {
        h: 'Relazioni d’ordine',
        body: `
<p>Combinando le proprietà si ottengono le relazioni d’ordine:</p>
<ul>
  <li><strong>ordine parziale</strong> (POSET): riflessiva + antisimmetrica + transitiva — es. \\( (\\mathcal{P}([n]), \\subseteq) \\), «divide» su \\( \\mathbb{N}^+ \\);</li>
  <li><strong>ordine totale</strong> (lineare): ordine pariale + ogni coppia confrontabile (\\( a \\,R\\, b \\) o \\( b \\,R\\, a \\)) — es. \\( \\le \\) su \\( \\mathbb{N} \\);</li>
  <li>versione <strong>stretta</strong>: irreflessiva + transitiva (es. \\( < \\), \\( \\subset \\)) — non è riflessiva, quindi tecnicamente non è un ordine parziale «largo».</li>
</ul>
<p>\\( \\subseteq \\) su \\( \\mathcal{P}([n]) \\) con \\( n \\ge 2 \\) è parziale ma <strong>non totale</strong>: \\( \\{1\\} \\) e \\( \\{2\\} \\) non sono confrontabili.</p>
<div class="keybox"><span class="kt">Da ricordare</span>
In un POSET: <strong>massimale</strong> = nessun elemento strettamente sopra; <strong>massimo</strong> = sopra tutti. Il massimo è unico ed è massimale; i massimali possono essere molti (in \\( (\\mathcal{P}([n]), \\subseteq) \\) l’unico massimo è \\( [n] \\)).</div>`,
      },
      {
        h: 'Equivalenze e partizioni',
        body: `
<p>Una <strong>relazione di equivalenza</strong> è riflessiva + simmetrica + transitiva (\\( \\equiv \\)). L’esempio principe: la congruenza modulo \\( n \\),</p>
\\[ a \\equiv b \\pmod{n} \\iff n \\mid (a - b). \\]
<p>Ogni equivalenza <strong>partiziona</strong> \\( A \\) in <strong>classi di equivalenza</strong> \\( [a] = \\{ x : x \\,R\\, a \\} \\): classi non vuote, a due a due disgiunte, che coprono \\( A \\). E viceversa ogni partizione induce un’equivalenza («stare nella stessa cella»). La congruenza mod \\( n \\) su \\( \\mathbb{Z} \\) ha esattamente \\( n \\) classi: \\( [0], [1], \\dots, [n-1] \\) (il «resto»).</p>
<div class="exambox"><span class="kt">All’esame</span>
«È \\( R \\) un’equivalenza / un ordine?» — verifica le tre proprietà in ordine (riflessiva, simmetrica/antisimmetrica, transitiva), citando per ognuna o l’argomento generale o il controesempio esplicito. Le relazioni su \\( \\mathcal{P}([n]) \\) con min/max cadono spesso: controesempi piccoli con \\( \\varnothing \\).</div>`,
      },
    ],
    quiz: [
      {
        kind: 'numeric',
        prompt: 'Quante coppie ci sono in \\( A \\times A \\) se \\( |A| = 5 \\)?',
        answer: '25',
        solution: [
          '**Conteggio.** \\( |A \\times A| = |A| \\cdot |A| = 5^2 = 25 \\) — il numero massimo di coppie di una relazione su \\( A \\).',
        ],
      },
      {
        kind: 'mc',
        prompt: 'La relazione «divide» su \\( \\mathbb{N}^+ \\) (\\( a \\,R\\, b \\iff a \\) divide \\( b \\)) è…',
        choices: [
          { text: 'un ordine parziale, ma non totale' },
          { text: 'un ordine totale' },
          { text: 'una relazione di equivalenza' },
          { text: 'solo simmetrica e transitiva' },
        ],
        answer: 0,
        solution: [
          '**Proprietà.** Riflessiva (\\( a \\mid a \\)), antisimmetrica (\\( a \\mid b \\) e \\( b \\mid a \\Rightarrow a = b \\)), transitiva.',
          '**Non totale.** 2 non divide 3 e 3 non divide 2: coppia non confrontabile.',
        ],
      },
      {
        kind: 'tf',
        prompt: 'Esiste una relazione che sia sia simmetrica sia antisimmetrica.',
        choices: [{ text: 'Vero' }, { text: 'Falso' }],
        answer: 0,
        solution: [
          '**Esempio.** L’identità \\( a \\,R\\, b \\iff a = b \\): simmetrica ed antisimmetrica insieme (anche l’insieme vuoto di coppie lo è).',
          '**Morale.** Le due proprietà non sono una la negazione dell’altra.',
        ],
      },
      {
        kind: 'mc',
        prompt: 'Su \\( \\mathcal{P}(\\{1,2\\}) \\) sia \\( A \\,R\\, B \\iff A \\cap B \\ne \\varnothing \\). Quale proprietà <strong>non</strong> vale?',
        choices: [
          { text: 'simmetrica' },
          { text: 'riflessiva' },
          { text: 'transitiva' },
          { text: 'nessuna delle tre vale' },
        ],
        answer: 2,
        solution: [
          '**Simmetrica sì.** \\( A \\cap B = B \\cap A \\).',
          '**Riflessiva sì.** \\( A \\cap A = A \\ne \\varnothing \\) per ogni \\( A \\) tranne… \\( \\varnothing \\): attenzione, se l’insieme base include \\( \\varnothing \\) la riflessività salta; su \\( \\mathcal{P}(\\{1,2\\}) \\setminus \\{\\varnothing\\} \\) invece vale.',
          '**Transitiva no.** \\( \\{1\\} \\cap \\{1,2\\} \\ne \\varnothing \\) e \\( \\{1,2\\} \\cap \\{2\\} \\ne \\varnothing \\), ma \\( \\{1\\} \\cap \\{2\\} = \\varnothing \\).',
        ],
      },
      {
        kind: 'mc',
        prompt: 'La congruenza modulo 3 su \\( \\mathbb{Z} \\) è una relazione di equivalenza. Quante classi di equivalenza ha?',
        choices: [
          { text: '2' },
          { text: '3' },
          { text: '6' },
          { text: 'infinite' },
        ],
        answer: 1,
        solution: [
          '**Classi.** \\( [0], [1], [2] \\): ogni intero ha resto 0, 1 o 2 mod 3.',
          '**In generale.** La congruenza mod \\( n \\) ha esattamente \\( n \\) classi.',
        ],
      },
    ],
  },

  /* ================================================================
     ARITMETICA MODULARE
     ================================================================ */
  'D-modulare': {
    title: 'Aritmetica modulare',
    course: 'discreta',
    minutes: 22,
    sections: [
      {
        h: 'Congruenze: l’orologio',
        body: `
<p>Scrivere \\( a \\equiv b \\pmod{n} \\) significa che \\( n \\) divide \\( a - b \\), cioè che \\( a \\) e \\( b \\) lasciano lo <strong>stesso resto</strong> nella divisione per \\( n \\). È l’aritmetica dell’orologio: 15:00 e 3:00 differiscono di 12 ore, \\( 15 \\equiv 3 \\pmod{12} \\).</p>
<ul>
  <li>ogni intero è congruo, mod \\( n \\), a esattamente uno dei «rappresentanti» \\( 0, 1, \\dots, n-1 \\) (il resto);</li>
  <li>\\( a \\equiv b \\pmod{n} \\) è una <strong>relazione di equivalenza</strong> con \\( n \\) classi.</li>
</ul>
<div class="keybox"><span class="kt">Da ricordare</span>
\\( n \\mid (a - b) \\) è la definizione operativa: per verificare una congruenza non calcolare i resti enormi, guarda la <em>differenza</em>.</div>`,
      },
      {
        h: 'Calcolare modulo n',
        body: `
<p>Le congruenze si comportano bene rispetto a somma, prodotto e potenza: se \\( a \\equiv b \\) e \\( c \\equiv d \\pmod{n} \\), allora</p>
\\[ a + c \\equiv b + d, \\qquad a \\cdot c \\equiv b \\cdot d, \\qquad a^k \\equiv b^k \\pmod{n}. \\]
<p>Quindi nelle espressioni lunghe puoi <strong>ridurre presto e spesso</strong>: ogni fattore può essere sostituito dal suo resto. Attenzione: la divisione NON è lecita (\\( 6 \\equiv 0 \\pmod{3} \\) ma da \\( 6 \\cdot 2 \\equiv 6 \\cdot 5 \\pmod 3 \\)… il fattore 6 non si cancella in generale: serve l’inverso, vedi sotto).</p>
<div class="warnbox"><span class="kt">Errore tipico</span>
Semplificare \\( k a \\equiv k b \\pmod{n} \\) «dividendo per \\( k \\)». La regola corretta: si può dividere la congruenza e il modulo per \\( d = \\gcd(k, n) \\). Con \\( \\gcd(k,n) = 1 \\) allora \\( k \\) è invertibile e \\( a \\equiv b \\) resta.</div>`,
      },
      {
        h: 'Inverso modulo n ed Euclide',
        body: `
<p>L’<strong>inverso</strong> di \\( a \\) mod \\( n \\) è un \\( x \\) con \\( a x \\equiv 1 \\pmod{n} \\). Esiste se e solo se \\( \\gcd(a, n) = 1 \\) (\\( a \\) e \\( n \\) coprimi) ed è unico mod \\( n \\).</p>
<p>Per calcolarlo: <strong>Euclide esteso</strong> — trova \\( u, v \\) con \\( a u + n v = 1 \\); allora \\( a u \\equiv 1 \\pmod n \\), cioè l’inverso è \\( u \\bmod n \\). A mano, con \\( n \\) piccolo, va benissimo anche la ricerca diretta: prova \\( 2a, 3a, \\dots \\) finché il resto è 1.</p>
<p><strong>Piccolo teorema di Fermat</strong> (arma per le potenze): se \\( p \\) è primo e \\( p \\nmid a \\),</p>
\\[ a^{\\,p-1} \\equiv 1 \\pmod{p}. \\]
<p>Esempio: \\( 2^{10} \\bmod 7 \\): poiché \\( 2^6 \\equiv 1 \\) (Fermat con \\( p = 7 \\)), \\( 2^{10} = 2^{6} \\cdot 2^{4} \\equiv 1 \\cdot 16 \\equiv 2 \\pmod 7 \\).</p>`,
      },
      {
        h: 'Equazioni lineari ax ≡ b (mod n)',
        body: `
<p>Procedura completa per \\( a x \\equiv b \\pmod{n} \\):</p>
<ul>
  <li><strong>1.</strong> Sia \\( g = \\gcd(a, n) \\). L’equazione ha soluzioni <strong>se e solo se \\( g \\mid b \\)</strong>;</li>
  <li><strong>2.</strong> Dividi tutto per \\( g \\): \\( a' x \\equiv b' \\pmod{n'} \\) con \\( a' = a/g,\\; b' = b/g,\\; n' = n/g \\) e ora \\( \\gcd(a', n') = 1 \\);</li>
  <li><strong>3.</strong> Moltiplica per l’inverso di \\( a' \\) mod \\( n' \\): \\( x \\equiv (a')^{-1} b' \\pmod{n'} \\);</li>
  <li><strong>4.</strong> Mod \\( n \\) le soluzioni sono \\( g \\): \\( x_0, x_0 + n', x_0 + 2n', \\dots, x_0 + (g-1)n' \\).</li>
</ul>
<p><strong>Esempio</strong>: \\( 6x \\equiv 9 \\pmod{15} \\). \\( g = \\gcd(6,15) = 3 \\mid 9 \\) ✓ → \\( 2x \\equiv 3 \\pmod 5 \\) → inverso di 2 mod 5 è 3 → \\( x \\equiv 9 \\equiv 4 \\pmod 5 \\). Soluzioni mod 15: \\( x = 4, 9, 14 \\) (tre, come \\( g \\)).</p>
<div class="exambox"><span class="kt">All’esame</span>
Il parametro \\( m \\) del compito entra quasi sempre qui (equazioni con \\( m+\\dots \\) al posto di \\( n \\)): riporta i calcoli passo per passo e <strong>conta le soluzioni</strong> alla fine: devono essere esattamente \\( g \\).</div>`,
      },
    ],
    quiz: [
      {
        kind: 'numeric',
        prompt: 'Quanto vale \\( 47 \\bmod 12 \\)?',
        answer: '11',
        solution: [
          '**Divisione.** \\( 47 = 3 \\cdot 12 + 11 \\), resto 11.',
          '**Check.** \\( 47 \\equiv 11 \\pmod{12} \\) perché \\( 12 \\mid (47 - 11) = 36 \\). ✓',
        ],
      },
      {
        kind: 'numeric',
        prompt: 'Trova l’inverso di 5 modulo 17 (un numero \\( x \\) con \\( 5x \\equiv 1 \\pmod{17} \\)).',
        answer: '7',
        solution: [
          '**Ricerca/Esteso.** \\( 5 \\cdot 7 = 35 = 2 \\cdot 17 + 1 \\equiv 1 \\pmod{17} \\). ✓',
          '**Nota.** Esiste perché \\( \\gcd(5, 17) = 1 \\); è unico mod 17.',
        ],
      },
      {
        kind: 'mc',
        prompt: 'Quando esiste l’inverso di \\( a \\) modulo \\( n \\)?',
        choices: [
          { text: 'sempre, per ogni \\( a \\) e \\( n \\)' },
          { text: 'se e solo se \\( \\gcd(a, n) = 1 \\)' },
          { text: 'se e solo se \\( n \\) è primo' },
          { text: 'se e solo se \\( a < n \\)' },
        ],
        answer: 1,
        solution: [
          '**Criterio.** \\( a x \\equiv 1 \\pmod n \\) ha soluzione ⟺ \\( \\gcd(a,n) = 1 \\) (identità di Bézout: \\( ax + ny = 1 \\)).',
          '**Se \\( n \\) è primo** allora ogni \\( a \\not\\equiv 0 \\) è invertibile — ma la primalità di \\( n \\) non serve, basta la coprimalità.',
        ],
      },
      {
        kind: 'tf',
        prompt: 'Se \\( a \\equiv b \\pmod{n} \\) allora \\( a^2 \\equiv b^2 \\pmod{n} \\).',
        choices: [{ text: 'Vero' }, { text: 'Falso' }],
        answer: 0,
        solution: [
          '**Perché.** Le congruenze si comportano bene rispetto al prodotto: \\( a \\cdot a \\equiv b \\cdot b \\).',
          '**In generale.** Vale anche per ogni potenza \\( k \\) e per somme e prodotti misti.',
        ],
      },
      {
        kind: 'numeric',
        prompt: 'Quanto vale \\( 3^{100} \\bmod 5 \\)?',
        answer: '1',
        solution: [
          '**Fermat.** \\( p = 5 \\) primo, \\( 5 \\nmid 3 \\): \\( 3^{4} \\equiv 1 \\pmod 5 \\).',
          '**Esponente.** \\( 100 = 4 \\cdot 25 \\) → \\( 3^{100} = (3^4)^{25} \\equiv 1^{25} = 1 \\pmod 5 \\).',
        ],
      },
    ],
  },

  /* ================================================================
     RSA
     ================================================================ */
  'D-rsa': {
    title: 'RSA',
    course: 'discreta',
    minutes: 22,
    sections: [
      {
        h: 'Gli ingredienti',
        body: `
<p>RSA trasforma l’aritmetica modulare in un sistema a chiave pubblica. Il ricevente genera:</p>
<ul>
  <li>due primi distinti \\( p \\) e \\( q \\) (segreti) e \\( n = p q \\) (pubblico);</li>
  <li>\\( \\varphi(n) = (p-1)(q-1) \\) (segreto) — la funzione di Eulero: quanti interi in \\( 1, \\dots, n-1 \\) sono coprimi con \\( n \\);</li>
  <li>un esponente pubblico \\( e \\) con \\( \\gcd(e, \\varphi(n)) = 1 \\);</li>
  <li>l’esponente privato \\( d \\) = <strong>inverso di \\( e \\) modulo \\( \\varphi(n) \\)</strong>: \\( e d \\equiv 1 \\pmod{\\varphi(n)} \\).</li>
</ul>
<div class="warnbox"><span class="kt">Errore tipico</span>
Calcolare l’inverso di \\( e \\) modulo \\( n \\) invece che modulo \\( \\varphi(n) \\). \\( d \\) vive nel mondo di \\( \\varphi(n) = (p-1)(q-1) \\), non di \\( n \\).</div>`,
      },
      {
        h: 'Cifrare e decifrare',
        body: `
<p>Il messaggio è un numero \\( m \\) con \\( 0 \\le m < n \\) (testi lunghi → a blocchi). Operazioni:</p>
\\[ \\text{cifratura: } c = m^{e} \\bmod n, \\qquad \\text{decifratura: } m = c^{d} \\bmod n. \\]
<p><strong>Esempio tascabile</strong> (con numeri da esame): \\( p = 3, q = 11 \\) → \\( n = 33 \\), \\( \\varphi = 2 \\cdot 10 = 20 \\); scelgo \\( e = 7 \\) (coprimo con 20); \\( d = 3 \\) perché \\( 7 \\cdot 3 = 21 \\equiv 1 \\pmod{20} \\).</p>
<ul>
  <li>cifro \\( m = 2 \\): \\( c = 2^7 = 128 \\equiv 29 \\pmod{33} \\);</li>
  <li>decifro: \\( 29^3 = 24389 = 739 \\cdot 33 + 2 \\equiv 2 \\pmod{33} \\). ✓ torna \\( m \\).</li>
</ul>
<p>Per le potenze a mano usa la <strong>quadratura ripetuta</strong>: riduci mod \\( n \\) dopo ogni moltiplicazione (\\( 2^7 = 2 \\cdot 2^2 \\cdot 2^4 \\), con \\( 2^2 = 4 \\), \\( 2^4 = 16 \\), \\( 2 \\cdot 4 \\cdot 16 = 128 \\equiv 29 \\)).</p>`,
      },
      {
        h: 'Perché funziona: Eulero',
        body: `
<p>Il cuore è il teorema di Eulero: se \\( \\gcd(m, n) = 1 \\),</p>
\\[ m^{\\varphi(n)} \\equiv 1 \\pmod{n}. \\]
<p>Dato \\( e d \\equiv 1 \\pmod{\\varphi(n)} \\), scrivi \\( e d = 1 + k\\,\\varphi(n) \\). Allora</p>
\\[ c^{d} \\equiv (m^{e})^{d} = m^{\\,e d} = m^{\\,1 + k \\varphi(n)} = m \\cdot \\bigl(m^{\\varphi(n)}\\bigr)^{k} \\equiv m \\cdot 1^{k} \\equiv m \\pmod{n}. \\]
<p>(Il caso \\( \\gcd(m, n) \\ne 1 \\) si sistema con un argomento mod \\( p \\) e mod \\( q \\) separato — CRT — ma l’idea è questa.)</p>
<div class="keybox"><span class="kt">Da ricordare</span>
\\( d \\) è l’inverso di \\( e \\) mod \\( \\varphi(n) \\) proprio perché «alzare alla \\( d \\)» deve disfare «alzare alla \\( e \\)»: gli esponenti si compongono modulo \\( \\varphi(n) \\), non modulo \\( n \\).</div>`,
      },
      {
        h: 'Sicurezza e compiti',
        body: `
<p>Chi conosce solo la chiave pubblica \\( (n, e) \\) per decifrare dovrebbe ricavare \\( d \\), e per quello serve \\( \\varphi(n) \\) — che richiede di <strong>fattorizzare \\( n = pq \\)</strong>. Con \\( p, q \\) da centinaia di cifre questo è oggi computazionalmente irrealizzabile: la sicurezza di RSA è la difficoltà della fattorizzazione.</p>
<p>Nei compiti (con \\( m \\) = tuo mese): i passi richiesti sono quasi sempre</p>
<ul>
  <li>calcolare \\( n \\), \\( \\varphi(n) \\) e verificare che \\( \\gcd(e, \\varphi(n)) = 1 \\);</li>
  <li>trovare \\( d \\) con Euclide esteso (o per tentativi, se i numeri sono piccoli);</li>
  <li>cifrare/decifrare un messaggio con la quadratura ripetuta;</li>
  <li>a volte: «perché non usare \\( e = \\dots \\)?» → perché non coprimo con \\( \\varphi(n) \\).</li>
</ul>
<div class="exambox"><span class="kt">All’esame</span>
Conta dei passi: \\( \\varphi(n) = (p-1)(q-1) \\) → \\( \\gcd(e, \\varphi) = 1 \\) → \\( d \\) → verifica finale \\( e d \\equiv 1 \\pmod{\\varphi(n)} \\). Se la verifica finale non torna, il \\( d \\) è sbagliato: controllala sempre prima di procedere.</div>`,
      },
    ],
    quiz: [
      {
        kind: 'numeric',
        prompt: 'Quanto vale \\( \\varphi(35) \\) (funzione di Eulero, con \\( 35 = 5 \\cdot 7 \\))?',
        answer: '24',
        solution: [
          '**Formula per \\( n = pq \\).** \\( \\varphi(n) = (p-1)(q-1) = 4 \\cdot 6 = 24 \\).',
          '**Senza fattorizzare.** Conta dei numeri in \\( 1, \\dots, 34 \\) coprimi con 35 (non multipli di 5 né di 7): stesso risultato, 24.',
        ],
      },
      {
        kind: 'numeric',
        prompt: 'RSA con \\( p = 3 \\), \\( q = 11 \\), \\( e = 7 \\): quanto vale la chiave privata \\( d \\) (inverso di 7 mod 20)?',
        answer: '3',
        solution: [
          '**Modulo giusto.** \\( \\varphi(33) = 2 \\cdot 10 = 20 \\).',
          '**Inverso.** \\( 7 \\cdot 3 = 21 \\equiv 1 \\pmod{20} \\) → \\( d = 3 \\).',
        ],
      },
      {
        kind: 'mc',
        prompt: 'Perché in RSA si richiede \\( \\gcd(e, \\varphi(n)) = 1 \\)?',
        choices: [
          { text: 'Perché \\( e \\) deve essere primo' },
          { text: 'Per poter invertire \\( e \\) modulo \\( \\varphi(n) \\) e ottenere \\( d \\)' },
          { text: 'Per rendere \\( n \\) più difficile da fattorizzare' },
          { text: 'Per garantire che il messaggio \\( m \\) sia minore di \\( n \\)' },
        ],
        answer: 1,
        solution: [
          '**Invertibilità.** \\( d \\) esiste ⟺ \\( \\gcd(e, \\varphi(n)) = 1 \\) (aritmetica modulare).',
          '**Non serve primalità.** \\( e \\) può essere composto (es. \\( e = 9 \\)) purché coprimo con \\( \\varphi(n) \\).',
        ],
      },
      {
        kind: 'tf',
        prompt: 'La sicurezza di RSA si fonda sulla difficoltà computazionale di fattorizzare \\( n \\) in \\( p \\cdot q \\).',
        choices: [{ text: 'Vero' }, { text: 'Falso' }],
        answer: 0,
        solution: [
          '**Da \\( n \\) a \\( \\varphi(n) \\).** Fattorizzare \\( n \\) ⇔ calcolare \\( \\varphi(n) \\) ⇔ ricavare \\( d \\) dalla chiave pubblica.',
          '**Oggi.** Nessun algoritmo classico efficiente è noto per la fattorizzazione: è questa asimmetria di costo che regge il sistema.',
        ],
      },
      {
        kind: 'numeric',
        prompt: 'Con \\( n = 33 \\) e \\( e = 7 \\): cifra il messaggio \\( m = 2 \\). Quanto vale \\( c = 2^7 \\bmod 33 \\)?',
        answer: '29',
        solution: [
          '**Quadratura ripetuta.** \\( 2^2 = 4 \\), \\( 2^4 = 16 \\), \\( 2^7 = 2 \\cdot 2^2 \\cdot 2^4 = 2 \\cdot 4 \\cdot 16 = 128 \\).',
          '**Riduzione.** \\( 128 = 3 \\cdot 33 + 29 \\Rightarrow c = 29 \\). (Decifratura con \\( d = 3 \\): \\( 29^3 \\equiv 2 \\pmod{33} \\). ✓)',
        ],
      },
    ],
  },
};
