// eslint-disable-next-line import/no-anonymous-default-export
export default async function (req: { body: { chatId: string; apiType: string; }; }, res: { status: (arg0: number) => { (): any; new(): any; json: { (arg0: { transcript?: any; error?: unknown; }): void; new(): any; }; }; }) {
// https://chat-backend-self.vercel.app/home/recording-start
// http://localhost:3001/home/recording-start
const chatId = req.body.chatId || '';
const apiType = req.body.apiType || '';

console.log("chat id : ", chatId)
console.log("apiType : ", apiType)

  try {
    const response = await fetch('https://solutions.it-marketing.website/recording-start', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
        body: JSON.stringify({
        chatId: chatId,
        apiType: apiType,
      }),
    });

    if (response.status !== 200) {
      const error = await response.json();
      throw new Error(error.message);
    }

    const data = await response.json();

    console.log(data)
    res.status(200).json({ transcript: data });

  } catch (error) {
    res.status(500).json({ error });
  }

  // try {
  //   res.status(200).json({ transcript: "Welcome speech recognition"});
  // } catch (error) {
  //   res.status(500).json({ error });
  // }
}
