Tech stack for Sypherai-ai (SYPHER-AI)

Files reviewed: `package.json`, `electron.vite.config.ts`, `tsconfig.json`

Summary: Electron + React desktop app using Vite. TypeScript-powered, Tailwind for styling, bundled with electron-builder. The project uses many AI, automation, and utility libraries.

Languages & Runtimes
- TypeScript
- JavaScript (Node.js runtime via Electron)

Core Frameworks & Runtime
- Electron (desktop shell)
- Vite (dev server & build for renderer)
- electron-vite (integration)
- electron-builder (packaging)

UI & Frontend
- React, React DOM
- @vitejs/plugin-react
- Tailwind CSS (with `@tailwindcss/vite` plugin)
- Framer Motion
- React Router (react-router-dom)
- React Flow (flow/graph UI)
- React Three Fiber + @react-three/drei (3D)
- Three.js (3D engine)
- React Leaflet + Leaflet (maps)
- Recharts (charts)
- xterm + xterm-addon-fit (terminal emulation)
- Monaco Editor (@monaco-editor/react)
- PrismJS (syntax highlighting)
- React Markdown + remark-gfm
- React Icons, Lucide React
- qrcode.react

State management & utilities
- Zustand (state)
- Immer (immutable state helpers)
- Axios (HTTP)
- Clipboardy
- Glob, ignore
- Lodash not explicitly present

Automation & System Integration
- @nut-tree-fork/nut-js (UI automation)
- node-window-manager (window management)
- screenshot-desktop
- loudness (system volume)
- screenshot-desktop
- nut-js

Packaging & Persistence
- electron-store (local persistence)
- electron-updater (auto-updates)

AI / ML / NLP / Vector tools
- @google/genai (Google GenAI client)
- @huggingface/inference (Hugging Face Inference)
- @xenova/transformers
- @google-cloud/local-auth
- googleapis (Google APIs)
- groq-sdk (Sanity/GROQ)
- vectordb (vector DB client)
- face-api.js (face detection)
- tesseract.js (OCR)

Browser / Automation Testing Tools (present as dependencies)
- puppeteer, puppeteer-extra, puppeteer-extra-plugin-stealth
- (Playwright not present by default; can be added separately)

Document / PDF / File helpers
- pdf-parse
- mammoth (docx -> html)
- cheerio (HTML parsing)
- qrcode.react

Security & Auth
- bcryptjs
- @google-cloud/local-auth (Google auth helper)

Developer toolchain
- TypeScript, tsc
- Vite, electron-vite
- eslint + eslint plugins (react, react-hooks)
- Prettier
- @electron-toolkit ESLint & tsconfig helpers

Notion & 3rd-party services
- @notionhq/client

Other notable libs
- puppeteer (browser automation / scraping)
- prismjs
- vectordb (vector DB integration)

How to view exact versions
- See `package.json` in the repository root. I used that file to build this list.

Next steps I can take for you
- Add this file to the repo (I will do that now and push it).
- Or produce a shorter README section, or a `docs/` page with categories and usage notes.


