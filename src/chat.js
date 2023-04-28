const { Configuration, OpenAIApi } = require("openai");
const env = require('../env.json');

const configuration = new Configuration({
  apiKey: env.OPENAI_API_KEY,
});


function chat(message) {
  const openai = new OpenAIApi(configuration);

  const completion = await openai.createChatCompletion({
    model: "gpt-4",
    messages: [{role: "user", content: "Hello world"}],
  });
  return completion.data.choices[0].message;
}
