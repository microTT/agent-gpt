const { Configuration, OpenAIApi } = require('openai')
const env = require('../env.json')

const configuration = new Configuration({
  apiKey: env.OPENAI_API_KEY
})

exports.send = async function send (input) {
  const message = input?.substring(2)?.trim()

  console.log(message)

  const openai = new OpenAIApi(configuration)

  const messages = [{ role: 'user', content: message }]

  const completion = await openai.createChatCompletion({
    // model: 'gpt-4',
    model: 'gpt-3.5-turbo',
    messages
  })

  console.log(JSON.stringify(completion.data.choices[0].message))

  return completion.data.choices[0].message.content
}
