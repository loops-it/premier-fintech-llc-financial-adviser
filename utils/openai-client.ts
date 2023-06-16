import { OpenAI } from 'langchain/llms';

if (!process.env.OPENAI_API_KEY) {
  throw new Error('Missing OpenAI Credentials');
}
// && process.env.BASE_URL
export const openai = new OpenAI({
  temperature: 0,
});
