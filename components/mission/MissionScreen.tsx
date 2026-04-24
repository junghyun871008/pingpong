"use client";

import { useEffect, useMemo, useRef, useState } from "react";
import type { Turn, Mission } from "@/types/mission";
import MissionBubble from "@/components/mission/MissionBubble";
import { requestCorrection, requestFreeTalk } from "@/services/ai";
import { getFallbackCorrection } from "@/lib/fallback";
import { startSpeechRecognition, stopSpeechRecognition } from "@/services/speech";
import { speakEnglish } from "@/services/tts";

type CorrectionEntry = { corrected: string; note: string };

type Props = {
  mission: Mission;
  onFinish: (review: string[]) => void;
  onExit: () => void;
};

export default function MissionScreen({ mission, onFinish, onExit }: Props) {
  const [turns, setTurns] = useState<Turn[]>([...mission.turns]);
  const [currentTurn, setCurrentTurn] = useState(0);
  const [input, setInput] = useState("");
  const [answers, setAnswers] = useState<Record<number, string>>({});
  const [corrections, setCorrections] = useState<Record<number, CorrectionEntry>>({});
  const [loading, setLoading] = useState(false);
  const [listening, setListening] = useState(false);
  const [aiExtendCount, setAiExtendCount] = useState(0);
  const bottomRef = useRef<HTMLDivElement>(null);

  const userTurnIndexes = useMemo(
    () => turns.map((t, i) => (t.speaker === "USER" ? i : -1)).filter((v) => v !== -1),
    [turns]
  );

  const progress = Math.min(
    100,
    Math.round((Object.keys(answers).length / Math.max(userTurnIndexes.length, 1)) * 100)
  );

  const visibleTurns = turns.slice(0, currentTurn + 1);
  const missionDone = currentTurn >= turns.length - 1 && turns[currentTurn]?.speaker === "AI";

  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: "smooth", block: "end" });
  }, [visibleTurns.length, corrections]);

  useEffect(() => {
    const current = turns[currentTurn];
    const next = turns[currentTurn + 1];
    if (current?.speaker === "AI" && current.text) speakEnglish(current.text);
    if (current?.speaker === "AI" && next?.speaker === "USER") {
      const timer = setTimeout(() => setCurrentTurn((p) => p + 1), 900);
      return () => clearTimeout(timer);
    }
  }, [currentTurn, turns]);

  useEffect(() => () => stopSpeechRecognition(), []);

  const submit = async () => {
    if (!input.trim() || loading) return;
    stopSpeechRecognition(setListening);
    setLoading(true);
    const userInput = input.trim();
    const turnIndex = currentTurn;
    setAnswers((prev) => ({ ...prev, [turnIndex]: userInput }));
    setInput("");

    try {
      const result = await requestCorrection(userInput);
      setCorrections((prev) => ({ ...prev, [turnIndex]: { corrected: result.corrected, note: result.note } }));
    } catch {
      const fallback = getFallbackCorrection(userInput);
      setCorrections((prev) => ({ ...prev, [turnIndex]: { corrected: fallback.corrected, note: fallback.note } }));
    } finally {
      setLoading(false);
    }

    if (currentTurn < turns.length - 1) {
      setCurrentTurn((p) => p + 1);
      return;
    }
    if (aiExtendCount >= 2) return;

    let question = "What do you think?";
    try {
      const ext = await requestFreeTalk(userInput, []);
      question = ext.nextQuestion || question;
    } catch {}

    setTimeout(() => {
      setTurns((prev) => [
        ...prev,
        { speaker: "AI", text: question },
        { speaker: "USER", hint: "Answer in one short sentence." },
      ]);
      speakEnglish(question);
      setCurrentTurn((p) => p + 1);
      setAiExtendCount((p) => p + 1);
    }, 600);
  };

  const currentHint = turns[currentTurn]?.hint || "천천히 한 문장으로 말해보세요";

  return (
    <div className="animate-[fadeIn_0.25s_ease-out] rounded-3xl bg-white p-5 shadow-lg ring-1 ring-slate-200 md:p-6">
      <div className="flex items-start justify-between gap-3">
        <div>
          <h2 className="text-3xl font-black leading-tight text-slate-950">오늘의 미션 · {mission.title}</h2>
          <p className="mt-3 text-lg font-bold leading-8 text-slate-800">AI 문장을 듣고, 천천히 한 문장씩 말해요.</p>
        </div>
        <div className="rounded-full bg-blue-100 px-4 py-2 text-base font-black text-blue-800">{progress}%</div>
      </div>

      <div className="mt-5 h-4 overflow-hidden rounded-full bg-slate-200">
        <div className="h-full rounded-full bg-blue-700 transition-all duration-500" style={{ width: `${progress}%` }} />
      </div>

      <div className="mt-6 space-y-4 rounded-3xl bg-slate-100 p-4 ring-1 ring-slate-200">
        {visibleTurns.map((turn, index) => (
          <MissionBubble key={index} turn={turn} answer={answers[index]} correction={corrections[index]} index={index} />
        ))}
        {loading && (
          <div className="flex justify-start">
            <div className="rounded-2xl bg-white px-4 py-3 shadow-sm ring-1 ring-slate-200">
              <span className="text-sm font-bold text-slate-500">교정 중...</span>
            </div>
          </div>
        )}
        <div ref={bottomRef} />
      </div>

      {!missionDone && turns[currentTurn]?.speaker === "USER" && (
        <div className="mt-6 space-y-4">
          <input
            value={input}
            onChange={(e) => setInput(e.target.value)}
            placeholder={currentHint}
            className="h-16 w-full rounded-2xl border-2 border-slate-300 px-5 text-xl font-bold text-slate-950 outline-none transition focus:border-blue-700"
            onKeyDown={(e) => { if (e.key === "Enter") submit(); }}
          />
          <div className="grid grid-cols-2 gap-3">
            {!listening ? (
              <button className="h-16 rounded-2xl bg-blue-700 text-xl font-black text-white shadow-md active:scale-95"
                onClick={() => startSpeechRecognition(setInput, setListening)}>
                🎤 말하기 시작
              </button>
            ) : (
              <button className="h-16 rounded-2xl bg-red-600 text-xl font-black text-white shadow-md active:scale-95 animate-micPulse"
                onClick={() => stopSpeechRecognition(setListening)}>
                ⏹ 말하기 종료
              </button>
            )}
            <button className="h-16 rounded-2xl bg-slate-950 text-xl font-black text-white shadow-md active:scale-95 disabled:opacity-50"
              onClick={submit} disabled={loading || !input.trim()}>
              {loading ? "교정 중..." : "입력 완료"}
            </button>
          </div>
          <p className="text-base font-bold leading-7 text-slate-700">
            말이 느려도 괜찮아요. 끝까지 말한 뒤 &quot;말하기 종료&quot;를 누르세요.
          </p>
        </div>
      )}

      {missionDone && (
        <div className="mt-6 grid gap-3 md:grid-cols-2">
          <button onClick={() => onFinish(mission.review)}
            className="h-16 rounded-2xl bg-blue-700 text-xl font-black text-white shadow-md active:scale-95">
            미션 완료 🎉
          </button>
          <button onClick={onExit}
            className="h-16 rounded-2xl bg-slate-200 text-xl font-black text-slate-900 active:scale-95">
            홈으로
          </button>
        </div>
      )}
    </div>
  );
}
