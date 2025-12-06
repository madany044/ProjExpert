// Minimal OpenAI service wrapper. Replace with actual OpenAI client use and error handling.
const OpenAI = require('openai');

let client;

const init = () => {
  if (!process.env.OPENAI_API_KEY) {
    console.warn('OPENAI_API_KEY not set - AI features will be disabled');
    return null;
  }
  client = new OpenAI({ apiKey: process.env.OPENAI_API_KEY });
  return client;
};

const suggestScope = async (task) => {
  if (!client) init();
  if (!client) return { suggestion: 'AI integration not configured.' };
  const prompt = `You are a project scoping assistant. Given the task title and description, produce a short scoped plan, key steps, technologies, and estimated deliverables.\n\nTitle: ${task.title}\nDescription: ${task.description}\n`;
  const resp = await client.chat.completions.create({
    model: 'gpt-4o-mini',
    messages: [{ role: 'user', content: prompt }],
    max_tokens: 500
  });
  return { suggestion: resp.choices[0].message.content };
};

module.exports = { init, suggestScope };
