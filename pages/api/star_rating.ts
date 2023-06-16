/* eslint-disable import/no-anonymous-default-export */
// import axios from 'axios';
// import { NextApiRequest, NextApiResponse } from 'next';

// export default async function handler(
//   req: NextApiRequest,
//   res: NextApiResponse
// ) {
  export default async function (req: { body: {
    [x: string]: string; chatId: string; rating: string; inputValue: string; 
}; }, res: { status: (arg0: number) => { (): any; new(): any; json: { (arg0: { success?: any; error?: unknown; }): void; new(): any; }; }; }){
  //   if (req.method !== 'POST') {
  //     res.status(405).json({ message: 'Method Not Allowed' });
  //     return;
  //   }
  // https://chat-backend-self.vercel.app/home/recording-start
  // http://localhost:3001/home/recording-start

  const chatid = req.body.chatId || '';
  const rating = req.body.ratingValue || '';
  const inputValue = req.body.feedbackMessage || '';
  
  console.log( "get data : ",chatid)
  console.log( "get data : ",rating)
  console.log( "get data : ",inputValue)

  try {
    // res.status(200).json({ chatid: chatid, rating: rating, inputValue:inputValue   });
    console.log("data save rating: ", chatid, rating, inputValue)
    const response = await fetch('https://solutions.it-marketing.website/save-rating', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        chatId: chatid,
        ratingValue: rating,
        feedbackMessage: inputValue,
      }),
    });

    if (response.status !== 200) {
      const error = await response.json();
      throw new Error(error.message);
    }

    const data = await response.json();

    // const response = await axios.post('https://solutions.it-marketing.website/save-rating', {
    //   chatId: chatid,
    //   ratingValue: rating,
    //   feedbackMessage: inputValue,
    // }, {
    //   headers: {
    //     'Content-Type': 'application/json'
    //   }
    // });

    // if (response.status !== 200) {
    //   throw new Error(response.data.message);
    // }

    // const data = response.data;
    // console.log(data)
    res.status(200).json({ success: data });

  } catch (error) {
    res.status(500).json({ error });
  }

  // try {
  //   res.status(200).json({ transcript: "Welcome speech recognition"});
  // } catch (error) {
  //   res.status(500).json({ error });
  // }
}
