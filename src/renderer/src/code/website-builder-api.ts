export const buildAnimatedWebsite = async (prompt: string) => {
  try {
    const geminiKey = localStorage.getItem('sypher_custom_api_key') || ''

    if (!geminiKey.trim()) {
      return `âŒ System Error: Missing Gemini API Key. Please update it in the Command Center Vault.`
    }

    const res = await window.electron.ipcRenderer.invoke('build-animated-website', {
      prompt,
      geminiKey
    })

    if (res.success) {
      return `âœ… Website generated successfully and saved to ${res.filePath}.`
    } else {
      return `âŒ System Error during synthesis: ${res.error}`
    }
  } catch (error) {
    return `System Error: Unable to establish connection to the Live Forge.`
  }
}

