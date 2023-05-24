const express = require('express')
const { Configuration, OpenAIApi } = require('openai')

const env = require('../env.json')

const app = express()
app.use(express.json())

const configuration = new Configuration({
  apiKey: env.OPENAI_API_KEY
})

const openai = new OpenAIApi(configuration)

app.get('/status', async (req, res) => {
  res.json({ result: 'ok' })
})

app.post('/chat-completion', async (req, res) => {
  try {
    const completion = await openai.createChatCompletion(req.body)
    res.json(completion.data)
  } catch (error) {
    console.error(`Error occurred: ${error.message}`)
    res.status(500).json({
      message:
                'Internal server error occurred while processing your request.',
      error: error.message
    })
  }
})

const port = 3000
app.listen(port, () => {
  console.log(`Server is running on port ${port}`)
})
