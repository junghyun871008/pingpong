"use client";

import { useEffect, useRef, useState } from "react";
import type { ChatMessage } from "@/types/chat";
import { freeTalkPrompts } from "@/data/freeTalkPrompts";
import { requestFreeTalk } from "@/services/ai";
import { getFallbackCorrection } from "@/lib/fallback";
import { startSpeechRecognition, stopSpeechRecognition } from "@/services/speech";
import { speakEnglish } from "@/services/tts";

type Props = { onExit: () => void };

function getRandomPrompt() {
  return freeTalkPrompts[Math.floor(Math.random() * freeTalkPrompts.length)];
}

export default function FreeTalkScreen({ onExit }: Props) {
  const [input, setInput] = useState("");
  const [firstPrompt] = useState(() => getRandomPrompt());
  const [messages, setMessages] = useState<ChatMessage[]>([]);
  const [loading, setLoading] = useState(false);
  const [listening, setListening] = useState(false);
  const bottomRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    setMessages([{ speaker: "AI", text: firstPrompt }]);
    speakEnglish(firstPrompt);
  }, [firstPrompt]);

  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: "smooth", block: "end" });
  }, [messages]);

  useEffect(() => () => stopSpeechRecognition(), []);

  const send = async () => {
    if (!input.trim() || loading) return;
    stopSpeechRecognition(setListening);
    const userInput = input.trim();
    setLoading(true);
    setInput("");
    setMessages((prev) => [...prev, { speaker: "You", text: userInput }]);
    try {
      const result = await requestFreeTalk(userInput, messages);
      const nextQuestion = result.nextQuestion || "How are you today?";
      const feedback =
        result.corrected !== userInput
          ? `✅ ${result.corrected}  ${result.note}`
          : `👍 ${result.note}`;
      setMessages((prev) => [
        ...prev,
        { speaker: "AI" as const, text: feedback },
        { speaker: "AI" as const, text: nextQuestion },
      ]);
      speakEnglish(nextQuestion);
    } catch {
      const fallback = getFallbackCorrection(userInput);
      const nextQuestion = fallback.nextQuestion || "How are you today?";
      setMessages((prev) => [
        ...prev,
        { speaker: "AI" as const, text: `👍 ${fallback.note}` },
        { speaker: "AI" as const, text: nextQuestion },
      ]);
      speakEnglish(nextQuestion);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="rounded-3xl bg-white p-5 shadow-md md:p-6">
      <div className="flex items-center justify-between">
        <h2 className="text-2xl font-black text-slate-950">자유 대화 💬</h2>
        <button onClick={onExit} className="rounded-full bg-slate-100 px-3 py-1 text-sm font-bold text-slate-600">나가기</button>
      </div>
      <p className="mt-2 text-base font-medium text-slate-700">한 문장씩 천천히 말해요. AI가 바로 피드백하고 이어서 질문해요.</p>
      <div className="mt-4 max-h-[55vh] space-y-3 overflow-y-auto rounded-3xl bg-slate-50 p-4">
        {messages.map((message, index) => (
          <div key={index} className={`flex ${message.speaker === "AI" ? "justify-start" : "justify-end"}`}>
            <div className={`max-w-[88%] rounded-2xl px-4 py-3 text-base font-semibold leading-7 shadow-sm ${message.speaker === "AI" ? "bg-white text-slate-950 ring-1 ring-slate-200" : "bg-green-500 text-white"}`}>
              <div className="mb-1 text-xs font-black uppercase opacity-60">{message.speaker === "AI" ? "AI" : "You"}</div>
              <div>{message.text}</div>
              {message.speaker === "AI" && (
                <button onClick={() => speakEnglish(message.text)} className="mt-2 rounded-full bg-slate-100 px-3 py-1 text-xs font-bold text-slate-700">🔊 다시 듣기</button>
              )}
            </div>
          </div>
        ))}
        {loading && (
          <div className="flex justify-start">
            <div className="rounded-2xl bg-white px-4 py-3 shadow-sm ring-1 ring-slate-200">
              <span className="text-sm font-bold text-slate-400">AI가 답변 중...</span>
            </div>
          </div>
        )}
        <div ref={bottomRef} />
      </div>
      <div className="mt-4 space-y-3">
        <input value={input} onChange={(e) => setInput(e.target.value)} placeholder="천천히 한 문장으로 말해보세요" className="h-14 w-full rounded-2xl border-2 border-slate-300 px-4 text-base font-medium text-slate-900 outline-none focus:border-green-500" onKeyDown={(e) => { if (e.key === "Enter") send(); }} />
        <div className="grid grid-cols-2 gap-3">
          {!listening ? (
            <button onClick={() => startSpeechRecognition(setInput, setListening)} className="h-14 rounded-2xl bg-green-500 text-base font-bold text-white active:scale-95">🎤 말하기 시작</button>
          ) : (
            <button onClick={() => stopSpeechRecognition(setListening)} className="h-14 rounded-2xl bg-red-500 text-base font-bold text-white active:scale-95">⏹ 말하기 종료</button>
          )}
          <button onClick={send} disabled={loading || !input.trim()} className="h-14 rounded-2xl bg-slate-900 text-base font-bold text-white disabled:opacity-50 active:scale-95">{loading ? "대화 중..." : "답하기"}</button>
        </div>
      </div>
    </div>
  );
}
