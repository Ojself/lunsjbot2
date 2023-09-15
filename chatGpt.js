const { Configuration, OpenAIApi } = require("openai");

const askChatGpt = async (menu) => {
const configuration = new Configuration({
  apiKey: process.env.CHAT_GPT_API_KEY,
});
const openai = new OpenAIApi(configuration);
return await openai.createChatCompletion({
  model: "gpt-3.5-turbo",
  messages: [
    {
      "role": "system",
      "content": "You will be provided with unstructured data, and your task is to parse it into a nested list with dishes for each day from monday to friday. The list should be on this format: [[\"dish\", \"Vegetar: dish2\"], []]"
    },
    {
      "role": "user",
      "content": menu
    }
  ],
  temperature: 0,
  max_tokens: 256,
  top_p: 1,
  frequency_penalty: 0,
  presence_penalty: 0,
});
}

module.exports = { askChatGpt };