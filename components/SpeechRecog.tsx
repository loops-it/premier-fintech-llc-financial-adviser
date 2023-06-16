import React from 'react';
import SpeechRecognition, {
  useSpeechRecognition,
} from 'react-speech-recognition';
import styles from '@/styles/Home.module.css';
import { BsFillMicFill, BsFillMicMuteFill } from 'react-icons/bs';


type SpeechRecogProps = {
  onSubmit: (transcript: string) => void;
};

const SpeechRecog = ({ onSubmit }: SpeechRecogProps) => {
  const {
    transcript,
    listening,
    resetTranscript,
    browserSupportsSpeechRecognition,
  } = useSpeechRecognition();

  if (!browserSupportsSpeechRecognition) {
    return <span>Browser does not support speech recognition.</span>;
  }

  const handleButtonClick = () => {
    if (listening) {
      SpeechRecognition.stopListening();
      onSubmit(transcript); 
      console.log('transcript: ', transcript);
    } else {
      SpeechRecognition.startListening();
    }
    
  };

  return (
    <div>
      <button
        type="button"
        className={`${styles.inputIconContainer2} `}
        onClick={handleButtonClick}
      >
        {listening ? (
          <div className={styles.loadingwheel}>
            <BsFillMicFill className="sendIcon" />
          </div>
        ) : (
          <div className={styles.micMuteContainer}>
            <BsFillMicMuteFill className="sendIcon" />
          </div>
        )}
      </button>
    </div>
  );
};
export default SpeechRecog;
