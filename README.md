Step 1. Clone Repo
git clone https://github.com/amwanshul-ed/Sypherai-ai.git
cd Sypherai-ai

Step 2. Environment Setup
cp .env.example .env
(Add your API keys to the file)

Step 3. Install Dependencies
npm install

Step 4. Run Dev Server
npm run dev
# OR use this command to view detailed error/build logs
npx electron-vite dev 2>&1

Step 5. Initialize Vault

Open app

Go to Command Center (Settings)

Add API keys securely

PROJECT STRUCTURE

sypher/
|-- build/                   # OS-specific build artifacts
|-- out/                     # Compiled output ready for packaging
|-- resources/               # Static assets (icons, trained data, etc.)
|-- src/                     # Core application source code
|   |-- main/                # Electron Main Process (Node.js & OS execution)
|   |-- preload/             # Context Isolation Scripts (IPC secure bridge)
|   |-- renderer/            # React Frontend (UI, widgets, animations)
|-- .env.example             # Template for API keys and env variables
|-- electron-builder.yml     # Configuration for packaging the .exe/.app
|-- electron.vite.config.ts  # Vite configuration for split architecture
|-- eng.traineddata          # Tesseract OCR language data file
|-- package.json             # Project dependencies and scripts

DEVELOPMENT PHILOSOPHY

Execution > Conversation

Local-first intelligence

Modular system design

Real-world usability

CONTRIBUTING

Sypher is built for the community. If you want to expand the neural forge,
submit a PR.

Quick Start:

Fork the repository.

Branch off main.

Match existing patterns (Tailwind for UI, strict IPC typing for backend).

Test thoroughly (ensure tools do not block the main Electron thread).

Submit a PR with a clear explanation and visual evidence if altering the UI.

Commit Rules:
Keep your commit messages clean, descriptive, and easy to understand. Clearly
state what the commit accomplishes and always include the relevant Issue ID.
Example: git commit -m "feat: integrated new desktop widget (#45)"

EXTENDING SYPHER

You can:

Add new IPC tools

Integrate APIs

Build automation modules

Extend UI widgets

ROADMAP

[ ] Voice-first system
[ ] Plugin marketplace
[ ] Memory graph
[ ] Multi-agent system
[ ] Desktop + Cloud hybrid

