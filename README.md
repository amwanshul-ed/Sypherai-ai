<div align="center">

![Sypher AI Neural OS Documentation Banner](./assets/banner.jpeg)

# 👁️ SYPHER AI

## The Autonomous Neural OS Agent

<div style="display: flex; justify-center; gap: 10px; margin-bottom: 20px;">
  <a href="https://github.com/201Harsh/IRIS-AI/stargazers">
    <img src="https://img.shields.io/github/stars/201Harsh/IRIS-AI?style=for-the-badge&color=10b981&logo=github&logoColor=white" alt="GitHub stars">
  </a>
  <a href="https://github.com/201Harsh/IRIS-AI/network/members">
    <img src="https://img.shields.io/github/forks/201Harsh/IRIS-AI?style=for-the-badge&color=10b981&logo=git&logoColor=white" alt="GitHub forks">
  </a>
  <a href="https://github.com/201Harsh/IRIS-AI/graphs/contributors">
    <img src="https://img.shields.io/github/contributors/201Harsh/IRIS-AI?style=for-the-badge&color=10b981&logo=users&logoColor=white" alt="Contributors">
  </a>
  <a href="https://github.com/201Harsh/IRIS-AI/releases">
    <img src="https://img.shields.io/github/downloads/201Harsh/IRIS-AI/total?style=for-the-badge&color=10b981&logo=download&logoColor=white" alt="Downloads">
  </a>
</div>

**A local-first neural execution system that turns intent into real OS actions.**

> Voice. Text. Vision. Drag-and-drop image context. One Sphere. Zero friction.

---

</div>

# 📑 Table of Contents

- [⚡ Overview](#-overview)
- [✨ Core Features](#-core-features)
- [🏗️ Architecture](#️-architecture)
- [💻 Tech Stack](#-tech-stack)
- [🔐 Security](#-security)
- [🚀 Installation & Setup](#-installation--setup)
- [📁 Project Structure](#-project-structure)
- [🧠 Development Philosophy](#-development-philosophy)
- [🤝 Contributing](#-contributing)
- [🧩 Extending Sypher AI](#-extending-sypher-ai)
- [🧠 Roadmap](#-roadmap)
- [⚠️ Disclaimer](#️-disclaimer)
- [👨‍💻 Architect](#-architect)
- [📜 License](#-license)

---

# ⚡ Overview

Sypher AI is not a chatbot.

It is a **local-first Agentic Operating System layer** that executes real-world actions across your system, applications, and devices — driven by a real-time WebRTC voice pipeline, multimodal vision, and a deeply integrated tool runtime.

You speak. You type. You drop an image. Sypher understands intent, picks the right native feature (Notes, Gallery, Macros, Apps, Phone…) and **executes**.

> Speak. Type. Drop. Sypher executes.

**Default language: English.** Sypher always replies in English unless you explicitly ask it to switch (e.g. "Sypher, switch to Hindi").

---

# ✨ Core Features & System Capabilities

### 💬 Dashboard Multi-Modal Chat

- 🎙️ **Voice-First Pipeline:** Real-time, low-latency Gemini Live WebRTC audio streaming with VAD-aware barge-in.
- ⌨️ **Text Input:** Type a command directly into the dashboard transcript and hit Enter — same brain as voice.
- 🖼️ **Drag-and-Drop Image Context:** Drop any image onto the dashboard and Sypher ingests it as live multimodal context.
- 📎 **Attach Button:** One-click image picker for context injection from anywhere on disk.
- 🌐 **English-First Transcription:** Speech and audio output are forced to English by default; switching languages is an explicit verbal override.

### 🧰 Sypher Native Views (Auto-Routed by the Agent)

The top bar exposes seven first-class views — Sypher itself routes user requests to the right one:

- 🟩 **DASHBOARD:** The Sphere, voice/text/image input, system telemetry, transcript.
- ⚙️ **MACROS:** Visual workflow editor for chained automations. Sypher can both **execute** and **author** macros via natural language.
- 📦 **APPS:** Installed apps overview — "open / close \<app\>" routes here.
- 📝 **NOTES:** Markdown notebook. "Take notes" / "jot this down" routes here.
- 🖼️ **GALLERY:** AI-generated image vault. "Generate an image" lands here.
- 📱 **PHONE:** Connected Android telekinesis (notifications, hardware toggles, app control).
- 🔧 **SETTINGS:** Encrypted vault for API keys, voice profile, personality matrix and biometrics.

### 📂 System & File Management

- 🖥️ **Open App:** Native application lifecycle control.
- 🛑 **Close App:** Instant process termination commands.
- 🗂️ **Read Directory:** Local folder scanning & indexing.
- 📁 **Create Folder:** Instant directory structure generation.
- 📄 **Read File:** Deep text & code extraction.
- 📝 **Write File:** Autonomous disk write access.
- 🔄 **Manage File:** Copy, move, and delete control.
- 🚀 **Open File:** Native OS application launcher.
- 🗃️ **Smart Drop Zones:** Viral, autonomous folder sorting.

### 🧠 Vector Search & Local Knowledge

- 🔍 **Index Folder:** Semantic LanceDB directory ingestion.
- 🔎 **Smart File Search:** Vector-based local file retrieval.
- 🖼️ **Read Gallery:** Local image cache scanning.
- 👁️ **Analyze Photo:** Direct multimodal vision processing.

### 💻 Developer & Terminal Tools

- ⌨️ **Run Terminal:** Native shell & CLI execution.
- 🛠️ **Open Project:** Instant IDE workspace loading.
- ⚙️ **Activate Protocol:** Context-aware coding mode switch.
- 🏗️ **Build File:** Writing code directly to disk.
- 🤖 **Execute Sequence:** JSON-based macro automation runs.
- ▶️ **Execute Macro:** Named workflow sequence triggering.
- 🪄 **Forge Macro (Generate Macro):** Sypher converts a natural-language description into a saved, runnable macro graph in the MACROS tab.
- 🕳️ **Deploy Wormhole:** Expose localhost to public internet.
- 🛑 **Close Wormhole:** Terminate public localhost tunnels.

### 🎯 Desktop UI, Vision & Automation

- 🪟 **Teleport Windows:** Dynamic desktop window management.
- 🧩 **Create Widget:** Spawn live floating desktop components.
- ❌ **Close Widgets:** Clear active floating overlays.
- 🖱️ **Click on Screen:** AI-driven exact coordinate targeting.
- 📜 **Scroll Screen:** Autonomous up/down page navigation.
- ⚡ **Press Shortcut:** Global keyboard hotkey injection.
- 👻 **Phantom Typer:** Global inline clipboard injection.
- ✂️ **Screen Peeler (OCR):** Instant UI-to-code visual extraction.
- ⌨️ **Ghost Coder:** Inline IDE generation (`Ctrl+Alt+Space`).
- 🔊 **Set Volume:** Master audio level control.
- 📸 **Take Screenshot:** Instant visual context capture.

### 💾 Memory & Information

- 🧠 **Save Core Memory:** Deep persistent identity tracking.
- 📥 **Retrieve Memory:** Instant past context recall.
- 📝 **Save Note:** Local markdown note generation.
- 📖 **Read Notes:** Instant saved plan retrieval.
- 📧 **Read Emails:** Gmail inbox scraping & summarization.

### 🌐 Web, Media & Financials

- 🔍 **Google Search:** Live internet data retrieval.
- 🌤️ **Get Weather:** Real-time atmospheric condition checks.
- 🗺️ **Open Map:** Interactive dark-mode map loading.
- 🚗 **Get Navigation:** Real-time routing and directions.
- 🎵 **Play Spotify:** Instant music & playlist execution.
- 📈 **Stock Price:** Real-time financial ticker tracking.
- 📊 **Compare Stocks:** Dual-ticker fundamental market analysis.
- 🕷️ **Hack Live Website:** Viral visual DOM manipulation.
- 🎨 **Build Animated Web:** Agentic Tailwind & GSAP generation.
- 🖼️ **Generate Image:** High-fidelity multimodal media generation.

### 💬 Communications

- 📲 **Send WhatsApp:** Instant automated message dispatch.
- 🕒 **Schedule WhatsApp:** Cron-based delayed message automation.
- 📧 **Draft Email:** Autonomous message composition.
- 🚀 **Send Email:** Action-oriented direct dispatch.

### 📱 Mobile Telekinesis (Deep Android Link)

- 🔔 **Mobile Notifications:** Read texts from connected phone.
- 🔋 **Mobile Info:** Battery & hardware telemetry tracking.
- 📤 **Push File to Mobile:** Seamless PC-to-phone transfers.
- 📥 **Pull File from Mobile:** Instant phone-to-PC fetching.
- 📱 **Open Mobile App:** Remote Android application launching.
- 🛑 **Close Mobile App:** Remote Android process killing.
- 👆 **Tap Mobile Screen:** Remote coordinate touch execution.
- 📜 **Swipe Mobile Screen:** Remote directional scrolling control.
- ⚙️ **Toggle Hardware:** Remote Wi-Fi/Bluetooth/Flashlight switching.

### 🕵️ Autonomous Research & Deep RAG

- 🕸️ **Deep Research:** Autonomous Llama 3 web crawling.
- 📓 **Read Notion Reports:** Deep sync with Notion databases.
- 📚 **Ingest Codebase:** Deep local project Vector embedding.
- 🔮 **Consult Oracle:** Deep local codebase RAG queries.

### 🔐 Security & OS Vault

- 🔒 **Lock System Vault:** Standard PIN OS lockdown protocol.
- 🛡️ **Biometric Encryption:** Multi-face recognition OS lockdown.

---

# 🏗️ Architecture

### Frontend (Renderer)

- React 19 + Tailwind v4 + Framer Motion + GSAP
- 3D Sphere via Three.js / React Three Fiber
- Handles UI, transcripts, voice, text input, drag-drop image ingest

### Backend (Main)

- Electron + Node.js
- Full system access: files, native automation (Nut.js), windows, ADB, Puppeteer-stealth web crawl
- Vector storage via LanceDB; biometric vault via face-api.js

### Real-Time Brain

- Google Gemini Live (`BidiGenerateContent`) over WebSocket for voice + vision
- Audio worklet streams 16 kHz PCM in ~250 ms buffers
- `clientContent` channel used for typed text and dropped images (multimodal turns)

### IPC Bridge

```js
window.electron.ipcRenderer.invoke('tool-name', payload)
```

---

# 💻 Tech Stack

Sypher AI is forged using a high-performance stack combining web technologies with deep native OS access and state-of-the-art AI models.

### 🖥️ Core Desktop & UI Framework

- **Electron & Vite:** High-performance desktop compilation and split-process architecture.
- **React 19:** Component-based, responsive frontend.
- **Tailwind CSS v4:** Utility-first styling engine for the Neon Emerald aesthetic.
- **Framer Motion & GSAP:** Cinematic, hardware-accelerated UI animations.
- **Three.js & React Three Fiber:** 3D rendering for complex neural visualizations.
- **Zustand:** Fast, scalable global state management.

### 🧠 AI, RAG & Machine Learning

- **Google Gemini AI:** Core reasoning and generative engine (`@google/genai`).
- **Groq SDK:** Ultra-fast, low-latency inference routing.
- **Hugging Face & Xenova:** Local model inference and transformers (`@huggingface/inference`, `@xenova/transformers`).
- **LanceDB (VectorDB):** Embedded local vector database for deep codebase RAG and memory storage.
- **Face-api.js:** Local biometric facial recognition for the System Vault.

### ⚙️ OS Control & Automation Engine

- **Nut.js:** Deep native desktop automation (mouse, keyboard, exact coordinate targeting).
- **Puppeteer (with Stealth):** Headless browser automation, DOM hacking, and invisible web crawling.
- **Node Window Manager:** Native OS window lifecycle and spatial placement control.
- **Tesseract.js:** Optical Character Recognition (OCR) for the 'Screen Peeler' visual extraction.
- **Native Utilities:** `loudness` (master audio), `clipboardy` (phantom typing), `screenshot-desktop` (visual context).

### 🔗 Integrations & Parsing

- **Google APIs & Auth:** Secure local auth, Gmail scraping, and Google Cloud services.
- **Notion Client:** Direct read/write mapping to Notion databases.
- **Tavily Core:** Agentic, deep-web search routing.
- **Data Parsers:** `pdf-parse`, `mammoth` (docx), `cheerio` (HTML DOM).

---

# 🔐 Security

- 100% BYOK (Bring Your Own Key)
- Local encryption (OS keychain)
- Zero-trust architecture
- No external key storage

---

# 💻 System Requirements

- **OS:** Windows 10 / 11 (Native execution).
- **Memory:** Minimum 4GB RAM (8GB recommended for heavy RAG indexing).
- **Storage:** ~5.2 GB for the application, plus extra space for local LanceDB vector storage.

---

# 🚀 Installation & Setup

### 1. Clone Repo

```bash
git clone https://github.com/201Harsh/IRIS-AI.git
cd IRIS-AI
```

### 2. Install Dependencies

```bash
npm install
```

---

### 3. Run Dev Server

```bash
npm run dev
```

---

### 4. Initialize Vault

- Open Sypher AI
- Go to Command Center (Settings)
- Add API keys securely
- Optional: register your face for biometric unlock

---

## 🔑 System Keys & Configuration

Sypher AI operates locally, but requires specific API keys to bridge the gap to large language models and search engines. **Your keys are encrypted and stored locally on your machine. They are never sent to our servers.**

### How to Configure

- **Desktop App Users:** Open Sypher AI, navigate to the **Settings Tab (Command Center) > API Keys**, and paste your keys directly into the vault.
- **Developers (Running from source):** Rename `.env.example` to `.env` in the root directory and place your keys there for local testing.

### 🔴 Required Keys

The Neural OS requires these core engines to process logic and execute actions.

- **[Google Gemini API](https://aistudio.google.com/app/apikey)** (`GEMINI_API_KEY`)
  - **Role:** The primary reasoning and generative engine for Sypher AI.
  - **Setup:** Sign in to Google AI Studio > Click 'Get API Key' > Create a key.

- **[Groq API](https://console.groq.com/keys)** (`GROQ_API_KEY`)
  - **Role:** Used for ultra-fast, low-latency agent routing and rapid decision-making.
  - **Setup:** Log in to Groq Cloud Console > Navigate to 'API Keys' > Create & copy your key.

### 🟡 Optional Keys

These keys unlock advanced, autonomous subsystems.

- **[Tavily Search API](https://app.tavily.com/home)** (`TAVILY_API_KEY`)
  - **Role:** Powers the Deep Research agent for real-time web crawling and synthesis.
  - **Setup:** Sign up at the Tavily Portal > Go to Dashboard > Generate a free-tier key.

- **[Hugging Face Token](https://huggingface.co/settings/tokens)** (`HUGGINGFACE_API_KEY`)
  - **Role:** Required only if you are downloading and running local open-source inference models.
  - **Setup:** Create a Hugging Face account > Settings > Access Tokens > Create token with 'Read' permissions.

> 💡 **Having trouble finding your keys?** Visit our official [Key Forging Guide](https://irisaiw.vercel.app/guide) for step-by-step instructions.


# 📁 Project Structure

```text
sypher-ai/
├── build/                   # OS-specific build artifacts
├── out/                     # Compiled output ready for packaging
├── resources/               # Static assets (icons, trained data, etc.)
├── src/                     # Core application source code
│   ├── main/                # Electron Main Process (Node.js backend & OS execution)
│   │   ├── auto/            # Auto-update + lifecycle
│   │   ├── handlers/        # IPC handlers (screen peeler, lock system, etc.)
│   │   ├── logic/           # Core OS logic (file ops, ADB, ghost control, memory…)
│   │   ├── security/        # Vault, biometrics, encrypted personality store
│   │   ├── services/        # RAG Oracle, Deep Research, Wormhole, Coder
│   │   └── workflow/        # Macro persistence (load/save/delete workflows)
│   ├── preload/             # Context Isolation Scripts (The IPC secure bridge)
│   └── renderer/            # React Frontend
│       └── src/
│           ├── views/       # DASHBOARD, MACROS, APPS, NOTES, GALLERY, PHONE, SETTINGS
│           ├── components/  # Sphere, Titlebar, MiniOverlay, ToolNode…
│           ├── Widgets/     # Floating context widgets (maps, stocks, oracle…)
│           ├── services/    # Iris-voice-ai (Gemini Live brain), system-info
│           ├── tools/       # Renderer-side tool adapters
│           ├── functions/   # Higher-level feature APIs
│           └── code/        # Macro executor + animated website builder
├── .env.example             # Template for API keys and environment variables
├── electron-builder.yml     # Configuration for packaging the .exe / .app / .AppImage
├── electron.vite.config.ts  # Vite configuration for the split architecture
├── eng.traineddata          # Tesseract OCR language data file
└── package.json             # Project dependencies and scripts
```

---

# 🧠 Development Philosophy

- Execution > Conversation
- Local-first intelligence
- Modular system design
- Real-world usability

---

## 🤝 Contributing

Sypher AI is built for the community. If you want to expand the neural forge, submit a PR.

### Quick Start

1. **Fork** the repository.
2. **Branch** off `main`.
3. **Match** existing patterns (Tailwind for UI, strict IPC typing for the backend).
4. **Test** thoroughly (ensure tools do not block the main Electron thread).
5. **Submit** a PR with a clear explanation and visual evidence if altering the UI.

🚨 **Read the full [Contribution Guide](CONTRIBUTING.md) before submitting.**

---

### Commit Rules

Keep your commit messages clean, descriptive, and easy to understand. Clearly state what the commit accomplishes and always include the relevant Issue ID so we can track the changes.

```bash
✅ git commit -m "feat: integrated new desktop widget (#45)"
✅ git commit -m "fix: resolved IPC memory leak in Oracle module (#12)"
```

---

# 🧩 Extending Sypher AI

You can:

- Add new IPC tools (register handler in `src/main`, expose typing in `src/preload`)
- Add a new agent tool (declare it in `src/renderer/src/services/Iris-voice-ai.ts` and dispatch it in the tool-call switch)
- Integrate APIs
- Build automation modules
- Extend UI widgets in `src/renderer/src/Widgets`

---

## 🧠 Roadmap

- [ ] Voice-first system
- [ ] Plugin marketplace
- [ ] Memory graph
- [ ] Multi-agent system
- [ ] Desktop + Cloud hybrid

---

# ⚠️ Disclaimer

Sypher AI has deep system-level execution capabilities.  
Use responsibly. The maintainers are not liable for misuse.

---


# 👨‍💻 Architect

**Harsh Pandey**  
AI Systems Engineer and Project Leader

Instagram: [@201Harshs](https://www.instagram.com/201harshs/)
GitHub: [@201Harsh](https://github.com/201Harsh)

---

# 📜 License

MIT License — see LICENSE file.
[![License: MIT](https://img.shields.io/badge/License-MIT-yellow.svg)](LICENSE)

---

# 🟥 Final Note

**Sypher AI is not a chatbot.** It is a **neural extension of your operating system**.

> _System Online._

# Made with ❤️ by [Harsh Pandey](https://instagram.com/201Harshs)


---
