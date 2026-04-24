"use client";

import { useEffect, useMemo, useState } from "react";
import type { Mission } from "@/types/mission";
import MissionBubble from "@/components/mission/MissionBubble";
import CorrectionCard from "@/components/mission/CorrectionCard";
import { requestCorrection, requestFreeTalk } from "@/services/ai";
import { getFallbackCorrection } from "@/lib/fallback";
import {
  startSpeechRecognition,
  stopSpeechRecognition,
} from "@/services/speech";
import { speakEnglish } from "@/services/tts";

type Props = {
  mission: Mission;
  onFinish: (review: string[]) => void;
  onExit: () => void;
};

export default function MissionScreen({ mission, onFinish, onExit }: Props) {
  const [currentTurn, setCurrentTurn] = useState(0);
  const [input, setInput] = useState("");
  const [answers, setAnswers] = useState<Record<number, string>>({});
  const [correction, setCorrection] = useState<{ corrected: string; note: string } | null>(null);
  const [loading, setLoading] = useState(false);
  const [listening, setListening] = useState(false);
  const [aiExtendCount, setAiExtendCount] = useState(0);

  const userTurnIndexes = useMemo(
    () =>
      mission.turns
        .map((turn, index) => (turn.speaker === "USER" ? index : -1))
        .filter((v) => v !== -1),
    [mission.turns]
  );

  const progress = Math.min(
    100,
    Math.round((Object.keys(answers).length / Math.max(userTurnIndexes.length, 1)) * 100)
  );

  const visibleTurns = mission.turns.slice(0, currentTurn + 1);

  const missionDone =
    currentTurn >= mission.turns.length - 1 &&
    mission.turns[currentTurn]?.speaker === "AI";

  useEffect(() => {
    const current = mission.turns[currentTurn];
    const next = mission.turns[currentTurn + 1];

    if (current?.speaker === "AI" && current.text) {
      speakEnglish(current.text);
    }

    if (current?.speaker === "AI" && next?.speaker === "USER") {
      const timer = setTimeout(() => {
        setCurrentTurn((prev) => prev + 1);
      }, 900);

      return () => clearTimeout(timer);
    }
  }, [currentTurn, mission.turns]);

  const submit = async () => {
    if (!input.trim() || loading) return;

    stopSpeechRecognition(setListening);

    setLoading(true);
    const userInput = input.trim();

    try {
      const result = await requestCorrection(userInput);
      setCorrection({ corrected: result.corrected, note: result.note });
    } catch {
      const fallback = getFallbackCorrection(userInput);
      setCorrection({ corrected: fallback.corrected, note: fallback.note });
    } finally {
      setLoading(false);
    }

    setAnswers((prev) => ({ ...prev, [currentTurn]: userInput }));
    setInput("");

    if (currentTurn < mission.turns.length - 1) {
      setCurrentTurn((prev) => prev + 1);
      return;
    }

    if (aiExtendCount >= 2) return;

    try {
      const result = await requestFreeTalk(userInput, []);

      setTimeout(() => {
        const question = result.nextQuestion || "What do you think?";

        mission.turns.push(
          { speaker: "AI", text: question },
          { speaker: "USER", hint: "Answer in one short sentence." }
        );

        speakEnglish(question);
        setCurrentTurn((prev) => prev + 1);
        setAiExtendCount((prev) => prev + 1);
      }, 600);
    } catch {
      setTimeout(() => {
        const question = "What do you think?";

        mission.turns.push(
          { speaker: "AI", text: question },
          { speaker: "USER", hint: "Answer in one short sentence." }
        );

        speakEnglish(question);
        setCurrentTurn((prev) => prev + 1);
        setAiExtendCount((prev) => prev + 1);
      }, 600);
    }
  };

  const currentHint = mission.turns[currentTurn]?.hint || "천천히 한 문장으로 말해보세요";

  return (
    <div className="rounded-3xl bg-white p-5 shadow-md md:p-6">
      <div className="flex items-center justify-between gap-3">
        <div>
          <h2 className="text-2xl font-bold text-slate-950">
            오늘의 미션 · {mission.title}
          </h2>
          <p className="mt-2 text-base font-medium text-slate-700">
            AI 문장을 듣고, 천천히 한 문장씩 말해요.
          </p>
        </div>

        <div className="rounded-full bg-slate-100 px-3 py-1 text-sm font-bold text-slate-800">
          {progress}%
        </div>
      </div>

      <div className="mt-4 h-3 overflow-hidden rounded-full bg-slate-200">
        <div className="h-full bg-green-500" style={{ width: `${progress}%` }} />
      </div>

      <div className="mt-6 space-y-3 rounded-3xl bg-slate-50 p-4">
        {visibleTurns.map((turn, index) => (
          <MissionBubble key={index} turn={turn} answer={answers[index]} />
        ))}
      </div>

      {!missionDone && mission.turns[currentTurn]?.speaker === "USER" && (
        <div className="mt-5 space-y-3">
          <input
            value={input}
            onChange={(e) => setInput(e.target.value)}
            placeholder={currentHint}
            className="h-14 w-full rounded-2xl border-2 border-slate-300 px-4 text-base font-medium text-slate-900 outline-none focus:border-green-500"
            onKeyDown={(e) => {
              if (e.key === "Enter") submit();
            }}
          />

          <div className="grid grid-cols-2 gap-3">
            {!listening ? (
              <button
                className="h-14 rounded-2xl bg-green-500 text-base font-bold text-white"
                onClick={() => startSpeechRecognition(setInput, setListening)}
              >
                🎤 말하기 시작
              </button>
            ) : (
              <button
                className="h-14 rounded-2xl bg-red-500 text-base font-bold text-white"
                onClick={() => stopSpeechRecognition(setListening)}
              >
                ⏹ 말하기 종료
              </button>
            )}

            <button
              className="h-14 rounded-2xl bg-slate-900 text-base font-bold text-white disabled:opacity-50"
              onClick={submit}
              disabled={loading}
            >
              {loading ? "교정 중..." : "입력 완료"}
            </button>
          </div>

          <p className="text-sm font-medium text-slate-600">
            말이 느려도 괜찮아요. 끝까지 말한 뒤 “말하기 종료”를 누르세요.
          </p>
        </div>
      )}

      {correction && (
        <div className="mt-5">
          <CorrectionCard correction={correction} />
        </div>
      )}

      {missionDone && (
        <div className="mt-5 grid gap-3 md:grid-cols-2">
          <button
            onClick={() => onFinish(mission.review)}
            className="h-14 rounded-2xl bg-green-500 text-base font-bold text-white"
          >
            미션 완료
          </button>

          <button
            onClick={onExit}
            className="h-14 rounded-2xl bg-slate-200 text-base font-bold text-slate-800"
          >
            홈으로
          </button>
        </div>
      )}
    </div>
  );
}