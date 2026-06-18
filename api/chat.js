// api/chat.js
// Vercel Serverless Function — proxied Anthropic API
// Der API-Key bleibt hier auf dem Server, niemals im Frontend.

export default async function handler(req, res) {
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method not allowed' })
  }

  const { messages, system } = req.body

  if (!messages || !Array.isArray(messages)) {
    return res.status(400).json({ error: 'messages fehlt oder ist kein Array' })
  }

  try {
    const response = await fetch('https://api.anthropic.com/v1/messages', {
      method: 'POST',
      headers: {
        'Content-Type':         'application/json',
        'x-api-key':            process.env.ANTHROPIC_API_KEY,
        'anthropic-version':    '2023-06-01'
      },
      body: JSON.stringify({
        model:      'claude-sonnet-4-6',
        max_tokens: 1024,
        ...(system ? { system } : {}),
        messages
      })
    })

    const data = await response.json()
    return res.status(200).json(data)

  } catch (err) {
    console.error('Anthropic API Fehler:', err)
    return res.status(500).json({ error: 'Interner Serverfehler' })
  }
}