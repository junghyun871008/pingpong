let audioUnlocked = false;

export function unlockAudio() {
  if (typeof window === "undefined") return false;

  window.speechSynthesis.cancel();

  const utterance = new SpeechSynthesisUtterance("PingPong is ready.");
  utterance.lang = "en-US";
  utterance.volume = 0.01;

  window.speechSynthesis.speak(utterance);
  audioUnlocked = true;

  return true;
}

export function isAudioUnlocked() {
  return audioUnlocked;
}