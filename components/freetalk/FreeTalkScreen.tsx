"use client";

import { useEffect, useState } from "react";
import type { ChatMessage } from "@/types/chat";
import { freeTalkPrompts } from "@/data/freeTalkPrompts";
import { requestFreeTalk } from "@/services/ai";
import { getFallbackCorrection } from "@/lib/fallback";
import {
  startSpeechRecognition,
  stopSpeechRecognition,
} from "@/services/speech";
import { speakEnglish } from "@/services/tts";

type Props = {
  onExit: () => void;
};

export default function FreeTalkScreen({ onExit }: Props) {
  const [input, setInput] = useState("");
  const [messages, setMessages] = useState<ChatMessage[]>([
    { speaker: "AI", text: freeTalkPrompts[0] },
  ]);
  const [loading, setLoading] = useState(false);
  const [listening, setListening] = useState(false);

  useEffect(() => {
    speakEnglish(freeTalkPrompts[0]);
  }, []);

  const send = async () => {
    if (!input.trim() || loading) return;

    stopSpeechRecognition(setListening);

    const userInput = input.trim();
    setLoading(true);

    try {
      const result = await requestFreeTalk(userInput, messages);
      const feedback = `${result.corrected} ${result.note}`.trim();
      const nextQuestion = result.nextQuestion || "How are you today?";

      setMessages((prev) => [
        ...prev,
        { speaker: "You", text: userInput },
        { speaker: "AI", text: feedback },
        { speaker: "AI", text: nextQuestion },
      ]);

      speakEnglish(nextQuestion);
    } catch {
      const fallback = getFallbackCorrection(userInput);
      const feedback = `${fallback.corrected} ${fallback.note}`.trim();
      const nextQuestion = fallback.nextQuestion || "How are you today?";

      setMessages((prev) => [
        ...prev,
        { speaker: "You", text: userInput },
        { speaker: "AI", text: feedback },
        { speaker: "AI", text: nextQuestion },
      ]);

      speakEnglish(nextQuestion);
    } finally {
      setLoading(false);
      setInput("");
    }
  };

  return (
    <div className="rounded-3xl bg-white p-5 shadow-md md:p-6">
      <h2 className="text-2xl font-bold text-slate-950">자유 대화</h2>

      <p className="mt-2 text-base font-medium text-slate-700">
        한 문장씩 천천히 말해요. AI가 영어로 들려주고 이어서 질문해요.
      </p>

      <div className="mt-6 space-y-3 rounded-3xl bg-slate-50 p-4">
        {messages.map((message, index) => (
          <div
            key={index}
            className={`flex ${message.speaker === "AI" ? "justify-start" : "justify-end"}`}
          >
            <div
              className={`max-w-[88%] rounded-2xl px-4 py-3 text-base font-semibold leading-7 shadow-sm ${
                message.speaker === "AI"
                  ? "bg-white text-slate-950"
                  : "bg-green-500 text-white"
              }`}
            >
              <div className="mb-1 text-xs font-bold uppercase opacity-80">
                {message.speaker}
              </div>

              <div>{message.text}</div>

              {message.speaker === "AI" && (
                <button
                  onClick={() => speakEnglish(message.text)}
                  className="mt-2 rounded-full bg-slate-100 px-3 py-1 text-xs font-bold text-slate-700"
                >
                  🔊 다시 듣기
                </button>
              )}
            </div>
          </div>
        ))}
      </div>

      <div className="mt-5 space-y-3">
        <input
          value={input}
          onChange={(e) => setInput(e.target.value)}
          placeholder="천천히 한 문장으로 말해보세요"
          className="h-14 w-full rounded-2xl border-2 border-slate-300 px-4 text-base font-medium text-slate-900 outline-none focus:border-green-500"
          onKeyDown={(e) => {
            if (e.key === "Enter") send();
          }}
        />

        <div className="grid grid-cols-2 gap-3">
          {!listening ? (
            <button
              onClick={() => startSpeechRecognition(setInput, setListening)}
              className="h-14 rounded-2xl bg-green-500 text-base font-bold text-white"
            >
              🎤 말하기 시작
            </button>
          ) : (
            <button
              onClick={() => stopSpeechRecognition(setListening)}
              className="h-14 rounded-2xl bg-red-500 text-base font-bold text-white"
            >
              ⏹ 말하기 종료
            </button>
          )}

          <button
            onClick={send}
            disabled={loading}
            className="h-14 rounded-2xl bg-slate-900 text-base font-bold text-white disabled:opacity-50"
          >
            {loading ? "대화 중..." : "답하기"}
          </button>
        </div>

        <button
          onClick={onExit}
          className="h-14 w-full rounded-2xl bg-slate-200 text-base font-bold text-slate-800"
        >
          그만하기
        </button>
      </div>
    </div>
  );
}