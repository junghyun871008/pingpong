let recognition: any = null;
let isListening = false;

export function startSpeechRecognition(
  onResult: (text: string) => void,
  onListeningChange?: (listening: boolean) => void
) {
  if (typeof window === "undefined") return;

  const SpeechRecognition =
    (window as any).webkitSpeechRecognition || (window as any).SpeechRecognition;

  if (!SpeechRecognition) {
    alert("이 브라우저는 음성 인식을 지원하지 않아요. 크롬에서 열어주세요.");
    return;
  }

  if (!recognition) {
    recognition = new SpeechRecognition();
    recognition.lang = "en-US";
    recognition.continuous = true;
    recognition.interimResults = true;

    recognition.onresult = (event: any) => {
      let text = "";

      for (let i = event.resultIndex; i < event.results.length; i++) {
        text += event.results[i][0].transcript;
      }

      if (text.trim()) onResult(text.trim());
    };

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
      if (isListening) {
        setTimeout(() => {
          try {
            recognition.start();
          } catch {}
        }, 500);
      }
    };
  }

  isListening = true;
  onListeningChange?.(true);

  try {
    recognition.start();
  } catch {}
}

export function stopSpeechRecognition(onListeningChange?: (listening: boolean) => void) {
  if (!recognition) return;

  isListening = false;
  onListeningChange?.(false);

  try {
    recognition.stop();
  } catch {}
}