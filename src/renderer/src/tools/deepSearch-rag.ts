export const runDeepResearch = async (query: string): Promise<string> => {
  try {
    window.dispatchEvent(new CustomEvent('deep-research-start', { detail: { query } }))

    const tavilyKey = localStorage.getItem('sypher_tailvy_api_key') || ''
    const groqKey = localStorage.getItem('sypher_groq_api_key') || ''

    const result = await window.electron.ipcRenderer.invoke('execute-deep-research', {
      query,
      tavilyKey,
      groqKey
    })

    if (result.success) {
      window.dispatchEvent(
        new CustomEvent('deep-research-done', {
          detail: { success: true, summary: result.summary }
        })
      )
      return `âœ… Research complete. Here is a summary of the data so you can inform the user: ${result.summary}`
    }

    window.dispatchEvent(new CustomEvent('deep-research-done', { detail: { success: false } }))
    return `âŒ Research failed: ${result.error}`
  } catch (error) {
    alert(`System failure during deep research: ${String(error)}`)
    return `âŒ System failure: ${String(error)}`
  }
}


