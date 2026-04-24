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
    alert("이 브라우저는 음성 인식을 지원하지 않습니다.");
    return;
  }

  if (!recognition) {
    recognition = new SpeechRecognition();
    recognition.lang = "en-US";
    recognition.continuous = true;
    recognition.interimResults = true;

    recognition.onresult = (event: any) => {
      let finalText = "";
      let interimText = "";

      for (let i = event.resultIndex; i < event.results.length; i++) {
        const transcript = event.results[i][0].transcript;

        if (event.results[i].isFinal) {
          finalText += transcript;
        } else {
          interimText += transcript;
        }
      }

      const text = (finalText || interimText).trim();
      if (text) onResult(text);
    };

    recognition.onend = () => {
      if (isListening) {
        try {
          recognition.start();
        } catch {
          // 이미 시작된 경우 무시
        }
      }
    };
  }

  isListening = true;
  onListeningChange?.(true);

  try {
    recognition.start();
  } catch {
    // 이미 실행 중이면 무시
  }
}

export function stopSpeechRecognition(onListeningChange?: (listening: boolean) => void) {
  if (!recognition) return;

  isListening = false;
  onListeningChange?.(false);

  try {
    recognition.stop();
  } catch {
    // 이미 멈춘 경우 무시
  }
}