'use strict';
const { Configuration, OpenAIApi } = require('openai');

const openAIConfig = new Configuration({
  apiKey: process.env.OPENAI_API_KEY,
});

if (!openAIConfig.apiKey) {
  throw new Error('OPENAI_API_KEY environment variable not set');
}

const openAI = new OpenAIApi(openAIConfig);

module.exports = { openAI };
