# Print3D Manager

<p align="center">
  <img src="SMF-LOGO.png" alt="SimonMakerForge" width="100"/>
</p>

<p align="center">
  <strong>SimonMakerForge</strong> · by Simone Soldani
</p>

<p align="center">
  <strong>Gestisci la tua attività di stampa 3D in un unico posto.</strong><br/>
  <em>Manage your 3D printing workshop in one place.</em><br/>
  Materiali · Bobine · Stampanti · Preventivi · Ricevute · Analisi
</p>

<p align="center">
  <a href="https://buymeacoffee.com/simonmakerforge">
    <img src="https://img.shields.io/badge/Buy%20Me%20a%20Coffee-ffdd00?style=for-the-badge&logo=buy-me-a-coffee&logoColor=black" alt="Buy Me A Coffee"/>
  </a>
  &nbsp;
  <a href="https://paypal.me/SimoneSoldani?locale.x=it_IT&country.x=IT">
    <img src="https://img.shields.io/badge/PayPal-003087?style=for-the-badge&logo=paypal&logoColor=white" alt="PayPal"/>
  </a>
</p>

---

## ✨ Funzionalità principali

- **Inventario materiali** — stock dinamico, bobine aperte/chiuse, soglie critiche, riordino
- **Preventivi multi-modello** — calcolo automatico costi, markup, IVA, ritenuta, PDF
- **Ricevute** — generazione e archiviazione ricevute da preventivi completati
- **Stampe 3D** — tracciamento lavori, fallimenti, consumo filamento
- **Dashboard analytics** — fatturato, profitto, trend 12 mesi, distribuzione materiali
- **Rubrica clienti** — contatti collegati a preventivi e ricevute
- **Temi** — 6 palette predefinite (3 scure + 3 chiare) + personalizzazione colori
- **Bilingue** — Italiano / English
- **Session file** — salvataggio su file locale via File System Access API (nessun server)

## 📖 Documentazione
- [Guida utente — Italiano](https://raw.githubusercontent.com/SimonMakerForge/print3d-manager/main/docs/Print3D_Manager_Guida_V236_IT.pdf)
- [User guide — English](https://raw.githubusercontent.com/SimonMakerForge/print3d-manager/main/docs/Print3D_Manager_Quick_Guide_V236_EN.pdf)

## 🚀 Come iniziare

### ⬇️ Download eseguibile (Windows)
Vai nella sezione [Releases](https://github.com/SimonMakerForge/print3d-manager/releases) e scarica il file `.exe` — nessuna installazione richiesta, avvia direttamente.

> ⚠️ **Avviso SmartScreen (Windows)**
> L'eseguibile non è firmato digitalmente, quindi Windows potrebbe mostrare un avviso alla prima apertura.
> Per procedere: clicca **"Ulteriori informazioni"** → **"Esegui comunque"**.
> Il software è sicuro — il codice sorgente è completamente pubblico e verificabile su questo repository.

### 🛠️ Compilare dal sorgente

**Requisiti:**
- [Node.js](https://nodejs.org/) ≥ 18
- [Electron](https://www.electronjs.org/) (incluso nelle dipendenze)

**Installazione:**

```bash
git clone https://github.com/SimonMakerForge/print3d-manager.git
cd print3d-manager
npm install
npm run dev        # avvia in modalità sviluppo
npm run build      # build Electron per la distribuzione
```

## 📁 Struttura del progetto

```
print3d-manager/
├── main.cjs          # Electron main process
├── src/
│   ├── App.jsx       # Applicazione React (file principale)
│   ├── main.jsx      # Entry point React
│   └── index.css     # Stili base
├── LICENSE
└── README.md
```

## 🎨 Stack tecnologico

- **React 18** + Vite
- **Electron** (desktop app)
- **lucide-react** (icone)
- **File System Access API** (sessioni locali, nessun database)

## 💝 Supporta il progetto

Print3D Manager è completamente gratuito, senza pubblicità e senza raccolta dati.  
Se lo trovi utile, considera una piccola donazione — aiuta a mantenere il progetto attivo!

- ☕ [Buy Me a Coffee](https://buymeacoffee.com/simonmakerforge)
- 💙 [PayPal](https://paypal.me/SimoneSoldani?locale.x=it_IT&country.x=IT)

## 👤 Autore

**Simone Soldani** · SimonMakerForge

- 📧 [ss.soldani@gmail.com](mailto:ss.soldani@gmail.com)
- 🌐 [MakerWorld](https://makerworld.com/@SimonMakerForge)
- 📺 [YouTube](https://www.youtube.com/@smf19739)
- 📘 [Facebook](https://www.facebook.com/share/16yKQw3T54/)
- 📸 [Instagram](https://www.instagram.com/simonmakerforge)
- 📌 [Pinterest](https://it.pinterest.com/simonmakerforge/)

## 📜 Licenza

Uso personale libero · Redistribuzione e uso commerciale vietati senza autorizzazione.  
Attribuzione obbligatoria. Vedere [LICENSE](LICENSE) per i dettagli.

© 2025-2026 Simone Soldani (SimonMakerForge)
