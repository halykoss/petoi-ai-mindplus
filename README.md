# Mind+ (modalità Python) — Estensione AI Vision (LLM)

Libreria utente per la **modalità Python** di Mind+. I blocchi generano codice Python che:
cattura un frame dalla **webcam del PC**, lo invia a un **LLM** (OpenRouter o endpoint
OpenAI-compatibile) con un **prompt di sistema personalizzato**, e invia l'azione scelta al
**Petoi (NyBoard)** via seriale. Include statistiche costo/token e stima impatto ambientale.

Tutto il lavoro è nella libreria `python/libraries/petoi_ai.py`; i blocchi chiamano il
singleton `ai`.

## Requisiti

- **Mind+ V1.7.1+** (le librerie utente in modalità Python esistono da questa versione).
- Modalità **Python** attiva in Mind+.
- **Webcam** + **API key** (es. OpenRouter: https://openrouter.ai/keys).
- Dipendenze pip (installate automaticamente da Mind+ via `config.json`): `requests`,
  `opencv-python`, `pyserial`.

## Installazione in Mind+

1. Comprimi la cartella `mindplus-llm-extension-python` in **.zip** (con `config.json` nella radice),
   oppure usa direttamente lo zip già pronto `mindplus-llm-extension-python.zip`.
2. Mind+ → modalità **Python** → **Estensioni**.
3. Scheda **Utente** → **Importa libreria utente da file** → seleziona lo zip
   (oppure incolla l'URL del repo GitHub se la pubblichi).
4. Comparirà la categoria **AI Vision (LLM)**. Mind+ installerà le dipendenze pip al primo uso.

## Blocchi

**Configurazione:** `imposta API key` · `imposta modello` · `imposta endpoint API` ·
`imposta prompt di sistema` (custom) · `reasoning [attivo/disattivo]` ·
`imposta dimensione max immagine`

**Camera:** `usa camera numero` · `avvia camera` · `ferma camera` ·
`acquisisci immagine dalla camera` · `invia immagine al massimo ogni [N] secondi` (frequenza) ·
`immagine acquisita?`

**AI:** `chiedi all'AI sull'immagine [testo]` (reporter — cattura un frame fresco e invia) ·
`chiedi all'AI (solo testo)` · `ultima risposta` · `storico output (ultimi [N])` ·
`ultimo reasoning` · `azione scelta (dal JSON)` · `dalla risposta, campo JSON [ ]`

**Petoi (seriale):** `collega Petoi alla porta [ ]` · `Petoi connesso?` ·
`esegui azione [menu]` · `invia comando OpenCat [ ]` · `metti il Petoi a riposo` ·
`scollega Petoi`

**Statistiche / impatto:** `costo ultima query` · `costo totale sessione` · `token ultima query` ·
`token totali` · `numero query` · `energia stimata (Wh)` · `CO2 stimata (g)` ·
`riepilogo statistiche` · `azzera statistiche` · `stima: [ ] Wh ogni 1000 token` ·
`stima: intensità rete [ ] g CO2 per kWh`

## Esempio (blocchi → codice Python)

```
imposta API key ["sk-or-..."]
imposta modello ["google/gemini-2.5-flash"]
imposta prompt di sistema ["Scegli un'azione tra walk_forward, greet, beep.
                            Rispondi SOLO JSON {\"action\":\"...\",\"reason\":\"...\"}"]
reasoning [disattivo]
collega Petoi alla porta ["/dev/cu.wchusbserial51850050421"]
invia immagine al massimo ogni [3] secondi

ripeti per sempre:
    imposta [risposta] = (chiedi all'AI sull'immagine ["Scegli un'azione"])
    esegui azione (azione scelta (dal JSON))
    stampa (riepilogo statistiche)
```

## Il "pannello" in modalità Python

In Python mode non c'è lo stage con i monitor. Per il pannello usa i reporter dentro un
`print(...)` o costruisci una piccola finestra con `tkinter`/OpenCV. Il blocco
`riepilogo statistiche` dà costo/token/energia/CO2 in una sola riga pronta da stampare.

## Note oneste

- **Costo reale**: la richiesta include `usage:{include:true}` → con OpenRouter arriva
  `usage.cost` (USD) + token, accumulati per la sessione. Con endpoint non-OpenRouter di solito
  arrivano solo i token (costo 0).
- **Impatto ambientale**: è una **stima grossolana** (token × fattori configurabili), non una
  misura. Formula: `energia(Wh) = token/1000 × Wh_per_1000token`; `CO2(g) = energia/1000 × g/kWh`.
- **Camera**: la webcam del PC via OpenCV (`usa camera numero` per scegliere l'indice).
- **Petoi**: la NyBoard tiene il suo firmware OpenCat; questa libreria gli invia solo i token
  seriali (115200 baud), non lo riprogramma.
- **Verificato qui**: sintassi/`py_compile` della libreria, logica di parsing/stat/azioni, JSON.
  Il **caricamento dentro Mind+** non è stato testato (Mind+ non è installato): se un blocco non
  compare o un import fallisce, segnalalo.
```
