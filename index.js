const express = require('express');
require("dotenv").config();
const path = require('path');
const cors = require("cors");
const app = express();
const port = 4545;
app.use(express.json());
app.use(cors());
const { Configuration, OpenAIApi } = require("openai");
app.use(express.static(path.join(__dirname, 'public')));
async function generateCompletion(input) {
  try {
    const prompt = input;
    const maxTokens = 500;
    const n = 1;
    const configuration = new Configuration({
      apiKey: process.env.OPENAI_API_KEY,
    });
    const openai = new OpenAIApi(configuration);
    const response = await openai.createCompletion({
      model: "text-davinci-003",
      prompt: prompt,
      max_tokens: maxTokens,
      n: n
    });
    const { choices } = response.data;
    if (choices && choices.length > 0) {
      const completion = choices[0].text.trim();
      return completion;
    } else {
      return false;
    }
  } catch (error) {
    console.error('Error:', error);
    throw error;
  }
}
app.post('/generate', async (req, res) => {
  try {
    const { content, language, input } = req.body;
    const response = await generateCompletion(`Give me a ${content} in ${language} of ${input}`);
    res.json({ response });
  } catch (error) {
    console.error('Error:', error);
    res.status(500).json({ error: 'An error occurred' });
  }
});
app.get('/', (req, res) => {
  res.sendFile(path.join(__dirname, 'public', 'index.html'));
});
app.listen(port, () => {
  console.log(`Server is listening on port ${port}`);
});