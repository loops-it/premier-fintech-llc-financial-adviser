import { useRef, useState, useEffect, useMemo, useCallback } from 'react';
import Layout from '@/components/layout';
import styles from '@/styles/Home.module.css';
import { Message } from '@/types/chat';
import { fetchEventSource } from '@microsoft/fetch-event-source';
import Image from 'next/image';
import { BsFillMicMuteFill, BsFillMicFill } from 'react-icons/bs';
import { Document } from 'langchain/document';
import dynamic from 'next/dynamic';


const DynamicSpeechRecognition = dynamic(
  () => import('../components/SpeechRecog'),
  {
    ssr: false,
    loading: () => <p>Loading...</p>,
  }
);



const Videobot = () => {
  const [query, setQuery] = useState<string>('');
  const [loading, setLoading] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);
  const [avatarUrl, setAvatarURL] = useState("welcome.mp4");
  // https://d-id-talks-prod.s3.us-west-2.amazonaws.com/auth0%7C641197ecfcd3ea01aba7f63d/tlk_3umvFJ8aKFJqRCcx-0cq-/1682415501833.mp4?AWSAccessKeyId=AKIA5CUMPJBIK65W6FGA&Expires=1682501908&Signature=hLC1kESKPjCozrDKgPrQoz9bX1c%3D
  const [messageState, setMessageState] = useState<{
    messages: Message[];
    pending?: string;
    history: [string, string][];
    pendingSourceDocs?: Document[];
  }>({
    messages: [],
    history: [],
    pendingSourceDocs: [],
  });
  const { messages, pending, history, pendingSourceDocs } = messageState;
  const messageListRef = useRef<HTMLDivElement>(null);
  const textAreaRef = useRef<HTMLTextAreaElement>(null);
  const [apiMessageFinal, setApiMessageFinal] = useState('');
  const [msgUpdated, setMsgUpdated] = useState(false);








  useEffect(() => {
    textAreaRef.current?.focus();
  }, []);

  useEffect(() => {
  }, [apiMessageFinal, messages]);

  const [id, setId] = useState('');
  useEffect(() => {
    const now = Date.now();
    const newId = now.toString();
    setId("video"+newId);
  }, []);








  //handle form submission
  async function handleSubmit(transcriptMsg: string) {
    // e.preventDefault();

    setError(null);
    setLoading(true);
    
    const question = transcriptMsg;

       
    

    
      if (!question) {
        alert('Racording failed!');
        setLoading(false);
        return;
      }

      setMessageState((state) => ({
        ...state,
        messages: [
          ...state.messages,
          {
            type: 'userMessage',
            message: question,
          },
        ],
        pending: undefined,
      }));
  
      setQuery('');
      setMessageState((state) => ({ ...state, pending: '' }));
  
      const ctrl = new AbortController();
  
      try {
        const response = await fetch('https://solutions.it-marketing.website/translate-to-english-api', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          user_Message: question,
          language: "English",
          chatId: id,
        }),
      });
      const data = await response.json();
      if (response.status !== 200) {
        const error = await response.json();
        throw new Error(error.message);
      }
  
      console.log("GPTdata - ",data);
      setAvatarURL("data.avatarVideoURL")
  
      setMessageState((state) => ({
        history: [...state.history, [question, state.pending ?? '']],
        messages: [
          ...state.messages,
          {
            type: 'apiMessage',
            message: data.bot_reply,
            sourceDocs: state.pendingSourceDocs,
          },
        ],
        pending: undefined,
        pendingSourceDocs: undefined,
      }));
  
      // setMsgUpdated(false);
      setLoading(false);
      } catch (error) {
        setLoading(false);
        setError('An error occurred while fetching the data. Please try again.');
        console.log('error', error);
      }
    
  }













  useEffect(() => {
    console.log('avatar : ', avatarUrl)
    // document.getElementById("#videoplayer").autoplay = true;
  }, [avatarUrl])









  const chatMessages = useMemo(() => {
    return [
      ...messages,
      ...(pending
        ? [
          {
            type: 'apiMessage',
            message: pending,
            sourceDocs: pendingSourceDocs,
          },
        ]
        : []),
    ];
  }, [messages, pending, pendingSourceDocs]);









  //scroll to bottom of chat
  useEffect(() => {
    if (messageListRef.current) {
      messageListRef.current.scrollTop = messageListRef.current.scrollHeight;
    }
  }, [chatMessages]);









  return (
    <Layout>
      {/* chat top header */}
      <div className={`${styles.chatTopBar} d-flex flex-row`}>
        <div className="col-12 text-center d-flex flex-row justify-content-between px-2 ">
          <Image
            src="/logo.jpg"
            alt="AI"
            width={150}
            height={30}
          />
        </div>
      </div>
      {/* chat message area */}
      <div className={`${styles.messageWrapper}`} style={{ height: "74vh" }}>
        <div className="d-flex justify-content-center py-3">
          <video id='videoplayer' width="250" height="250" autoPlay style={{ borderRadius: '50%' }} >
            <source src={avatarUrl} type="video/mp4"></source>
            <source src="movie.ogg" type="video/ogg"></source>
          </video>
        </div>
        <div
          ref={messageListRef}
          className={`${styles.messageContentWrapper} d-flex flex-column`}
        >

          {chatMessages.map((message, index) => {

            if (message.type !== 'apiMessage' && message.type !== 'userMessage') {
              // skip rendering if the message type is not 'apiMessage' or 'userMessage'
              return null;
            }
            let icon;
            let className;
            let userHomeStyles;
            let wrapper = 'align-items-end justify-content-end';
            let userStyles = 'justify-content-end flex-row-reverse float-end';
            if (message.type === 'apiMessage') {
              icon = (
                <Image
                  src="/chat-header.jpg"
                  alt="AI"
                  width="40"
                  height="40"
                  className={styles.botImage}
                  priority
                />
              );
              className = styles.apimessage;
              userStyles = 'justify-content-start flex-row float-start';
              wrapper = 'align-items-start justify-content-start';
            } else {
              icon = (
                <Image
                  src="/user.png"
                  alt="Me"
                  width="40"
                  height="40"
                  className={styles.botImage}
                  priority
                />
              );
              userHomeStyles = styles.userApiStyles;
              // The latest message sent by the user will be animated while waiting for a response
              className =
                loading && index === chatMessages.length - 1
                  ? styles.usermessagewaiting
                  : styles.usermessage;
            }
            return (
              <>
                <div
                  key={`chatMessage-${index}`}
                  className={styles.botMessageContainerWrapper}
                >
                  <div
                    className={`${styles.botChatMsgContainer} ${userStyles} d-flex my-2`}
                  >
                    <div className="d-flex">{icon}</div>
                    <div className={`${wrapper} d-flex flex-column ms-2`}>
                      <div
                        className={`${styles.botMessageContainer} ${userHomeStyles} d-flex flex-column my-1`}
                      >
                        <p className="mb-0">{message.message}</p>
                      </div>
                      {/* <p className={`${styles.timeText} text-start  mt-2`}>{time}</p> */}
                    </div>
                  </div>
                </div>
              </>
            );
          })}
        </div>
      </div>

      {/* input fields =================*/}
      <div className={`${styles.inputContainer}`}>
        {/* <button
          type="button"
          onClick={handleSubmit}
          disabled={loading}
          className={`${styles.inputIconContainer2} `}
        >
          {loading ? (
            <div className={styles.loadingwheel}>
              <BsFillMicFill className="sendIcon" />
            </div>
          ) : (
            <BsFillMicMuteFill className="sendIcon" />
          )}
        </button> */}
        <DynamicSpeechRecognition onSubmit={handleSubmit} />
      </div>
      {error && (
        <div className="border border-red-400 rounded-md p-4">
          <p className="text-red-500">{error}</p>
        </div>
      )}
      {/* input fields ================= */}
    </Layout>
  );
}

export default Videobot