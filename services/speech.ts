let recognition: any = null;
let isListening = false;
let micReady = false;

export async function prepareMic() {
  if (typeof window === "undefined") return false;

  try {
    const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
    stream.getTracks().forEach((track) => track.stop());
    micReady = true;
    return true;
  } catch {
    micReady = false;
    alert("마이크 권한을 허용해야 말하기 기능을 사용할 수 있어요.");
    return false;
  }
}

export async function startSpeechRecognition(
  onResult: (text: string) => void,
  onListeningChange?: (listening: boolean) => void
) {
  if (typeof window === "undefined") return;

  if (!micReady) {
    const ok = await prepareMic();
    if (!ok) return;
  }

  const SpeechRecognition =
    (window as any).webkitSpeechRecognition || (window as any).SpeechRecognition;

  if (!SpeechRecognition) {
    alert("이 브라우저는 음성 인식을 지원하지 않습니다. 크롬이나 삼성인터넷에서 열어주세요.");
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

    recognition.onend = () => {
      if (isListening) {
        setTimeout(() => {
          try {
            recognition.start();
          } catch {}
        }, 300);
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