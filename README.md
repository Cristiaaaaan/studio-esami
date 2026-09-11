# Quaderno — 60 giorni, 2 esami

Sessioni quotidiane di esercizi per preparare **Matematica Discreta** (prof. Brenti) e **Logica e Reti Logiche** (prof. Pasquale) in 12 settimane.

## Cosa c'è dentro
- **Sessione quotidiana** (~30 min): ripasso SRS + esercizi nuovi del giorno + flashcard di teoria
- **Generatori infiniti**: induzione, tautologie, riscritture NAND/NOR, forme normali, Karnaugh, primo ordine, codifiche, controimmagini, relazioni, aritmetica modulare, RSA, grafi, ricorsioni — con soluzioni passo-passo **calcolate** al momento
- **Compiti veri** trascritti con soluzione guidata (17 compiti di Logica 2024-26 + appelli di Discreta)
- **Simulazioni d'esame** cronometrate con autovalutazione in punti
- **Statistiche**: streak, heatmap, accuratezza per argomento

## Come si usa
Apri il sito: la sessione del giorno è pronta con un tap. I progressi sono salvati nel browser (per dispositivo, senza server).

## Tecnica
SPA statica in vanilla JS (ES modules) + KaTeX via CDN. Nessun build step: quello che vedi è quello che gira su GitHub Pages.

```
index.html
css/style.css     design system (carta a quadretti, tema chiaro/scuro)
js/
  app.js          router hash-based
  storage.js      localStorage (streak, SRS, statistiche)
  srs.js          ripetizione dilazionata (SM-2 semplificato)
  session.js      costruttore sessioni
  data/           piano 12 settimane, flashcard, compiti veri
  generators/     esercizi parametrici + utility matematiche (QMC, Euclide esteso…)
  views/          dashboard, sessione, argomenti, compiti, statistiche, impostazioni
test/             stress test (node test/gen.test.mjs) + controverifica Python
```
