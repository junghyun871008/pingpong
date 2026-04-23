"use client";

import { useState } from "react";
import type { ChatMessage } from "@/types/chat";
import { freeTalkPrompts } from "@/data/freeTalkPrompts";
import { requestFreeTalk } from "@/services/ai";
import { getFallbackCorrection } from "@/lib/fallback";
import { startSpeechRecognition } from "@/services/speech";

type Props = {
  onExit: () => void;
};

export default function FreeTalkScreen({ onExit }: Props) {
  const [input, setInput] = useState("");
  const [messages, setMessages] = useState<ChatMessage[]>([
    { speaker: "AI", text: freeTalkPrompts[0] },
  ]);
  const [loading, setLoading] = useState(false);

  const send = async () => {
    if (!input.trim() || loading) return;

    const userInput = input.trim();
    setLoading(true);

    try {
      const result = await requestFreeTalk(userInput, messages);
      setMessages((prev) => [
        ...prev,
        { speaker: "You", text: userInput },
        { speaker: "AI", text: `${result.corrected} ${result.note}`.trim() },
        { speaker: "AI", text: result.nextQuestion || "How are you today?" },
      ]);
    } catch {
      const fallback = getFallbackCorrection(userInput);
      setMessages((prev) => [
        ...prev,
        { speaker: "You", text: userInput },
        { speaker: "AI", text: `${fallback.corrected} ${fallback.note}`.trim() },
        { speaker: "AI", text: fallback.nextQuestion || "How are you today?" },
      ]);
    } finally {
      setLoading(false);
      setInput("");
    }
  };

  return (
    <div className="rounded-3xl bg-white p-6 shadow-xl">
      <h2 className="text-2xl font-bold">자유 대화</h2>
      <p className="mt-2 text-slate-600">한 문장으로 답하면 AI가 짧게 교정하고 이어서 질문해요.</p>

      <div className="mt-6 space-y-3 rounded-3xl bg-slate-50 p-4">
        {messages.map((message, index) => (
          <div key={index} className={`flex ${message.speaker === "AI" ? "justify-start" : "justify-end"}`}>
            <div
              className={`max-w-[85%] rounded-2xl px-4 py-3 text-sm shadow-sm ${
                message.speaker === "AI" ? "bg-white" : "bg-slate-900 text-white"
              }`}
            >
              <div className="mb-1 text-xs uppercase opacity-70">{message.speaker}</div>
              <div>{message.text}</div>
            </div>
          </div>
        ))}
      </div>

      <div className="mt-4 space-y-3">
        <input
          value={input}
          onChange={(e) => setInput(e.target.value)}
          placeholder="한 문장으로 답해보세요"
          className="h-12 w-full rounded-2xl border border-slate-200 px-4"
          onKeyDown={(e) => {
            if (e.key === "Enter") send();
          }}
        />
        <div className="grid gap-3 md:grid-cols-2">
          <button
            onClick={() => startSpeechRecognition(setInput)}
            className="h-12 rounded-2xl bg-slate-200"
          >
            말하기
          </button>
          <button
            onClick={send}
            disabled={loading}
            className="h-12 rounded-2xl bg-slate-900 text-white disabled:opacity-50"
          >
            {loading ? "대화 중..." : "답하기"}
          </button>
        </div>
        <button onClick={onExit} className="h-12 w-full rounded-2xl bg-slate-100">
          그만하기
        </button>
      </div>
    </div>
  );
}