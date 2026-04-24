"use client";

import { useEffect, useState } from "react";

export default function PWARegister() {
  const [installPrompt, setInstallPrompt] = useState<Event | null>(null);
  const [showBanner, setShowBanner] = useState(false);

  useEffect(() => {
    // Service Worker 등록
    if ("serviceWorker" in navigator) {
      navigator.serviceWorker.register("/sw.js").catch(() => {});
    }

    // 설치 프롬프트 이벤트 캡처
    const handler = (e: Event) => {
      e.preventDefault();
      setInstallPrompt(e);
      // 이미 설치된 경우 배너 숨김
      if (!window.matchMedia("(display-mode: standalone)").matches) {
        setShowBanner(true);
      }
    };

    window.addEventListener("beforeinstallprompt", handler);
    return () => window.removeEventListener("beforeinstallprompt", handler);
  }, []);

  const handleInstall = async () => {
    if (!installPrompt) return;
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    await (installPrompt as any).prompt();
    setShowBanner(false);
    setInstallPrompt(null);
  };

  if (!showBanner) return null;

  return (
    <div className="fixed bottom-4 left-4 right-4 z-40 mx-auto max-w-md rounded-2xl bg-slate-950 p-4 shadow-2xl">
      <div className="flex items-center justify-between gap-3">
        <div>
          <div className="text-sm font-black text-white">📱 홈 화면에 추가하기</div>
          <div className="text-xs font-medium text-slate-400">앱처럼 빠르게 실행해요</div>
        </div>
        <div className="flex gap-2">
          <button
            onClick={() => setShowBanner(false)}
            className="rounded-xl px-3 py-2 text-xs font-bold text-slate-400"
          >
            나중에
          </button>
          <button
            onClick={handleInstall}
            className="rounded-xl bg-blue-600 px-4 py-2 text-xs font-black text-white"
          >
            설치
          </button>
        </div>
      </div>
    </div>
  );
}
