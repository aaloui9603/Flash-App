require('dotenv').config()
const express = require('express')
const cors    = require('cors')

const app = express()
app.use(cors())
app.use(express.json())

app.post('/api/chat', async (req, res) => {
  const { messages, system } = req.body

  try {
    const response = await fetch('https://api.anthropic.com/v1/messages', {
      method: 'POST',
      headers: {
        'Content-Type':      'application/json',
        'x-api-key':         process.env.ANTHROPIC_API_KEY,
        'anthropic-version': '2023-06-01'
      },
      body: JSON.stringify({
        model:      'claude-sonnet-4-6',
        max_tokens: 1024,
        temperature: 1,
        ...(system ? { system } : {}),
        messages
      })
    })

    if (!response.ok) {
      const fehlerText = await response.text()
      console.error('Anthropic Fehler:', fehlerText)
      return res.status(response.status).json({ error: fehlerText })
    }

    const data = await response.json()
    console.log('Anthropic Antwort:', JSON.stringify(data, null, 2))
    return res.status(200).json(data)

  } catch (err) {
    console.error('Server Fehler:', err)
    return res.status(500).json({ error: 'Interner Serverfehler' })
  }
})

app.listen(3001, () => {
  console.log('API-Server läuft auf http://localhost:3001')
})