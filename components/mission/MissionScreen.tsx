"use client";

import { useEffect, useMemo, useState } from "react";
import type { Mission } from "@/types/mission";
import MissionBubble from "@/components/mission/MissionBubble";
import CorrectionCard from "@/components/mission/CorrectionCard";
import { requestCorrection, requestFreeTalk } from "@/services/ai";
import { getFallbackCorrection } from "@/lib/fallback";
import { startSpeechRecognition } from "@/services/speech";

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
  const [aiExtendCount, setAiExtendCount] = useState(0); // 🔥 AI 이어가기 제한

  const userTurnIndexes = useMemo(
    () =>
      mission.turns
        .map((turn, index) => (turn.speaker === "USER" ? index : -1))
        .filter((v) => v !== -1),
    [mission.turns]
  );

  const progress = Math.round(
    (Object.keys(answers).length / Math.max(userTurnIndexes.length, 1)) * 100
  );

  const visibleTurns = mission.turns.slice(0, currentTurn + 1);

  const missionDone =
    currentTurn >= mission.turns.length - 1 &&
    mission.turns[currentTurn]?.speaker === "AI";

  // 🔥 AI → USER 자동 넘김
  useEffect(() => {
    const current = mission.turns[currentTurn];
    const next = mission.turns[currentTurn + 1];

    if (current?.speaker === "AI" && next?.speaker === "USER") {
      const timer = setTimeout(() => {
        setCurrentTurn((prev) => prev + 1);
      }, 300);
      return () => clearTimeout(timer);
    }
  }, [currentTurn, mission.turns]);

  const submit = async () => {
    if (!input.trim() || loading) return;

    setLoading(true);
    const userInput = input.trim();

    // 🔥 교정
    try {
      const result = await requestCorrection(userInput);
      setCorrection({ corrected: result.corrected, note: result.note });
    } catch {
      const fallback = getFallbackCorrection(userInput);
      setCorrection({ corrected: fallback.corrected, note: fallback.note });
    } finally {
      setLoading(false);
    }

    // 🔥 사용자 입력 저장
    setAnswers((prev) => ({ ...prev, [currentTurn]: userInput }));
    setInput("");

    // 🔥 다음 턴 진행
    if (currentTurn < mission.turns.length - 1) {
      setCurrentTurn((prev) => prev + 1);
    } else {
      // 🔥 미션 끝 → AI 이어가기
      if (aiExtendCount >= 2) return; // 최대 2번만

      try {
        const result = await requestFreeTalk(userInput, []);

        setTimeout(() => {
          setAnswers((prev) => ({
            ...prev,
            [currentTurn + 1]: result.nextQuestion || "What do you think?",
          }));
          setCurrentTurn((prev) => prev + 1);
          setAiExtendCount((prev) => prev + 1);
        }, 500);
      } catch {
        setTimeout(() => {
          setAnswers((prev) => ({
            ...prev,
            [currentTurn + 1]: "What do you think?",
          }));
          setCurrentTurn((prev) => prev + 1);
          setAiExtendCount((prev) => prev + 1);
        }, 500);
      }
    }
  };

  return (
    <div className="rounded-3xl bg-white p-6 shadow-xl">
      <div className="flex items-center justify-between gap-3">
        <div>
          <h2 className="text-2xl font-bold">오늘의 미션 · {mission.title}</h2>
          <p className="mt-2 text-slate-600">짧게 말하고 이어서 대화해요.</p>
        </div>
        <div className="rounded-full bg-slate-100 px-3 py-1 text-sm">{progress}%</div>
      </div>

      <div className="mt-4 h-2 overflow-hidden rounded-full bg-slate-200">
        <div className="h-full bg-slate-900" style={{ width: `${progress}%` }} />
      </div>

      <div className="mt-6 space-y-3 rounded-3xl bg-slate-50 p-4">
        {visibleTurns.map((turn, index) => (
          <MissionBubble key={index} turn={turn} answer={answers[index]} />
        ))}
      </div>

      {/* 🔥 입력 영역 */}
      {!missionDone && mission.turns[currentTurn]?.speaker === "USER" && (
        <div className="mt-4 space-y-3">
          <input
            value={input}
            onChange={(e) => setInput(e.target.value)}
            placeholder={mission.turns[currentTurn]?.hint || "한 문장으로 말해보세요"}
            className="h-12 w-full rounded-2xl border border-slate-200 px-4"
            onKeyDown={(e) => {
              if (e.key === "Enter") submit();
            }}
          />

          <div className="grid grid-cols-2 gap-3">
            <button
              className="h-12 rounded-2xl bg-slate-200"
              onClick={() => startSpeechRecognition(setInput)}
            >
              말하기
            </button>

            <button
              className="h-12 rounded-2xl bg-slate-900 text-white disabled:opacity-50"
              onClick={submit}
              disabled={loading}
            >
              {loading ? "교정 중..." : "입력 완료"}
            </button>
          </div>
        </div>
      )}

      {/* 🔥 교정 카드 */}
      {correction && (
        <div className="mt-4">
          <CorrectionCard correction={correction} />
        </div>
      )}

      {/* 🔥 미션 완료 */}
      {missionDone && (
        <div className="mt-4 grid gap-3 md:grid-cols-2">
          <button
            onClick={() => onFinish(mission.review)}
            className="h-12 rounded-2xl bg-slate-900 text-white"
          >
            미션 완료
          </button>

          <button onClick={onExit} className="h-12 rounded-2xl bg-slate-200">
            홈으로
          </button>
        </div>
      )}
    </div>
  );
}