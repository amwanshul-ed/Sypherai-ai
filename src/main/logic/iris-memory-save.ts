import fs from 'fs'
import path from 'path'
import { IpcMain, App } from 'electron'

export default function registerIpcHandlers({ ipcMain, app }: { ipcMain: IpcMain; app: App }) {
  const CHAT_DIR = path.resolve(app.getPath('userData'), 'Chat')
  const FILE_PATH = path.join(CHAT_DIR, 'sypher_memory.json')
  const CORE_MEMORY_PATH = path.resolve(app.getPath('userData'), 'Memory', 'saved-user-memory.json')
  const SEMANTIC_DB_PATH = path.resolve(app.getPath('userData'), 'sypher_semantic_db')
  const ORACLE_STATE_PATH = path.resolve(app.getPath('userData'), 'sypher_scan_states')

  ipcMain.removeHandler('add-message')
  ipcMain.removeHandler('get-history')
  ipcMain.removeHandler('reset-local-memory')

  ipcMain.handle('add-message', async (_event, msg) => {
    try {
      if (!fs.existsSync(CHAT_DIR)) fs.mkdirSync(CHAT_DIR, { recursive: true })

      let history: { role: string; content: string; timestamp: string }[] = []
      if (fs.existsSync(FILE_PATH)) {
        const data = fs.readFileSync(FILE_PATH, 'utf-8')
        history = data ? JSON.parse(data) : []
      }

      const newEntry: { role: string; content: string; timestamp: string } = {
        role: msg.role,
        content: msg.parts[0].text,
        timestamp: new Date().toISOString()
      }
      history.push(newEntry)

      if (history.length > 20) history = history.slice(-20)

      fs.writeFileSync(FILE_PATH, JSON.stringify(history, null, 2))
      return true
    } catch (err) {
      return false
    }
  })

  ipcMain.handle('get-history', async () => {
    try {
      if (fs.existsSync(FILE_PATH)) {
        const data = fs.readFileSync(FILE_PATH, 'utf-8')
        const raw = JSON.parse(data)
        return raw.map((m: any) => ({
          role: m.role === 'sypher' ? 'model' : m.role,
          parts: [{ text: m.content }]
        }))
      }
    } catch (err) {}
    return []
  })

  ipcMain.handle('reset-local-memory', async (_event, options = {}) => {
    try {
      const resetOptions = {
        transcript: true,
        coreMemory: true,
        semanticDb: false,
        oracleState: false,
        ...options
      }

      if (resetOptions.transcript && fs.existsSync(FILE_PATH)) fs.unlinkSync(FILE_PATH)
      if (resetOptions.coreMemory && fs.existsSync(CORE_MEMORY_PATH))
        fs.unlinkSync(CORE_MEMORY_PATH)
      if (resetOptions.semanticDb && fs.existsSync(SEMANTIC_DB_PATH)) {
        fs.rmSync(SEMANTIC_DB_PATH, { recursive: true, force: true })
      }
      if (resetOptions.oracleState && fs.existsSync(ORACLE_STATE_PATH)) {
        fs.rmSync(ORACLE_STATE_PATH, { recursive: true, force: true })
      }

      return { success: true }
    } catch (error: any) {
      return { success: false, error: error.message }
    }
  })
}

