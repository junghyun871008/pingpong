// eslint-disable-next-line @typescript-eslint/no-explicit-any
let recognition: any = null;
let isListening = false;

function destroyRecognition() {
  if (!recognition) return;
  try {
    recognition.onresult = null;
    recognition.onerror = null;
    recognition.onend = null;
    recognition.stop();
  } catch {}
  recognition = null;
  isListening = false;
}

export function startSpeechRecognition(
  onResult: (text: string) => void,
  onListeningChange?: (listening: boolean) => void
) {
  if (typeof window === "undefined") return;

  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const SpeechRecognition =
    (window as any).webkitSpeechRecognition || (window as any).SpeechRecognition;

  if (!SpeechRecognition) {
    alert("이 브라우저는 음성 인식을 지원하지 않아요. 크롬에서 열어주세요.");
    return;
  }

  destroyRecognition();

  recognition = new SpeechRecognition();
  recognition.lang = "en-US";
  recognition.continuous = true;
  recognition.interimResults = true;

  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  recognition.onresult = (event: any) => {
    let text = "";
    for (let i = event.resultIndex; i < event.results.length; i++) {
      text += event.results[i][0].transcript;
    }
    if (text.trim()) onResult(text.trim());
  };

  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  recognition.onerror = (event: any) => {
    console.log("Speech recognition error:", event.error);
    if (event.error === "not-allowed") {
      alert("마이크 권한이 차단되어 있어요. 크롬 주소창 자물쇠에서 마이크를 허용해주세요.");
    }
    if (event.error === "audio-capture") {
      alert("마이크를 찾을 수 없어요. 다른 앱이 마이크를 사용 중인지 확인해주세요.");
    }
    isListening = false;
    onListeningChange?.(false);
  };

  recognition.onend = () => {
    if (isListening && recognition) {
      setTimeout(() => {
        try {
          if (isListening && recognition) recognition.start();
        } catch {}
      }, 300);
    }
  };

  isListening = true;
  onListeningChange?.(true);

  try {
    recognition.start();
  } catch {}
}

export function stopSpeechRecognition(onListeningChange?: (listening: boolean) => void) {
  isListening = false;
  onListeningChange?.(false);
  destroyRecognition();
}
