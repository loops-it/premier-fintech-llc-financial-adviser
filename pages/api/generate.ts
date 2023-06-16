import { Configuration, OpenAIApi } from "openai";

const configuration = new Configuration({
  apiKey: process.env.OPENAI_API_KEY,
});
const openai = new OpenAIApi(configuration);

export default async function (req: { body: { question: string; }; }, res: { status: (arg0: number) => { (): any; new(): any; json: { (arg0: { error?: { message: string; } | { message: string; } | { message: string; }; result?: string | undefined; }): void; new(): any; }; }; }) {
  if (!configuration.apiKey) {
    res.status(500).json({
      error: {
        message: "OpenAI API key not configured, please follow instructions in README.md",
      }
    });
    return;
  }

  const userQuestion = req.body.question || '';
  if (userQuestion.trim().length === 0) {
    res.status(400).json({
      error: {
        message: "Please enter a valid question",
      }
    });
    return;
  }

  try {
    const completion = await openai.createCompletion({
      model: "text-davinci-003",
      prompt: `Friendly reply to: ${userQuestion} and do Not ask any questions.`,
      temperature: 0.6,
    });
    res.status(200).json({ result: completion.data.choices[0].text });
  } catch(error) {
      res.status(500).json({
        error: {
          message: 'An error occurred during your request.',
        }
      });
  }
}
