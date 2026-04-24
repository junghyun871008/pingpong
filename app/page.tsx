"use client";

import { unlockAudio } from "@/services/audio";
import { useEffect, useState } from "react";
import HomeScreen from "@/components/home/HomeScreen";
import MissionScreen from "@/components/mission/MissionScreen";
import FreeTalkScreen from "@/components/freetalk/FreeTalkScreen";
import LevelUpModal from "@/components/ui/LevelUpModal";
import { pickRandomMission } from "@/lib/mission";
import { getInitialReview, getMergedReview } from "@/lib/review";
import { updateStreak, loadStreak } from "@/lib/streak";
import { addXP, getLevelFromXP, loadTotalXP } from "@/lib/xp";
import type { Mission } from "@/types/mission";

export default function Page() {
  const [screen, setScreen] = useState<"home" | "mission" | "complete" | "freetalk">("home");
  const [reviewItems, setReviewItems] = useState<string[]>([]);
  const [streak, setStreak] = useState<number>(0);
  const [mission, setMission] = useState<Mission | null>(null);
  const [totalXP, setTotalXP] = useState<number>(0);
  const [level, setLevel] = useState<number>(1);
  const [levelUpTarget, setLevelUpTarget] = useState<number | null>(null);

  useEffect(() => {
    setReviewItems(getInitialReview());
    setStreak(loadStreak());
    setMission(pickRandomMission());
    const xp = loadTotalXP();
    setTotalXP(xp);
    setLevel(getLevelFromXP(xp));
  }, []);

  const handleMissionFinish = (review: string[]) => {
    setReviewItems(getMergedReview(review));
    const newStreak = updateStreak();
    setStreak(newStreak);
    const result = addXP(20);
    setTotalXP(result.totalXP);
    setLevel(result.level);
    if (result.leveledUp) setLevelUpTarget(result.level);
    setScreen("complete");
  };

  const handleFreeTalkXP = () => {
    const result = addXP(10);
    setTotalXP(result.totalXP);
    setLevel(result.level);
    if (result.leveledUp) setLevelUpTarget(result.level);
  };

  if (!mission) {
    return (
      <div className="min-h-screen bg-slate-100 p-4 md:p-8">
        <div className="mx-auto max-w-4xl rounded-3xl bg-white p-6 shadow-xl">
          <h1 className="text-2xl font-bold">🏓 PingPong</h1>
          <p className="mt-2 text-slate-600">불러오는 중...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-slate-100 p-4 pb-safe md:p-8">
      <div className="mx-auto max-w-4xl">
        {screen === "home" && (
          <div className="animate-screenFadeIn"><HomeScreen
            title={mission.title}
            reviewItems={reviewItems}
            streak={streak}
            totalXP={totalXP}
            level={level}
            onReady={() => unlockAudio()}
            onStart={() => setScreen("mission")}
          /></div>
        )}
        {screen === "mission" && (
          <MissionScreen
            mission={mission}
            onFinish={handleMissionFinish}
            onExit={() => setScreen("home")}
          />
        )}
        {screen === "complete" && (
          <div className="rounded-3xl bg-white p-6 shadow-xl">
            <div className="text-center">
              <div className="text-5xl">🎉</div>
              <h2 className="mt-3 text-3xl font-black text-slate-950">잘했어요!</h2>
              <p className="mt-2 text-base font-bold text-slate-700">오늘 미션 완료! +20 XP 획득 🔥</p>
            </div>
            <div className="mt-5 flex flex-wrap gap-2">
              {mission.review.map((item) => (
                <span key={item} className="rounded-full bg-blue-50 px-3 py-1 text-sm font-bold text-blue-800 ring-1 ring-blue-100">{item}</span>
              ))}
            </div>
            <div className="mt-5 grid gap-3 md:grid-cols-2">
              <button onClick={() => { handleFreeTalkXP(); setScreen("freetalk"); }} className="h-14 rounded-2xl bg-slate-900 text-base font-black text-white shadow-md active:scale-95">
                💬 조금 더 대화할래요
              </button>
              <button onClick={() => setScreen("home")} className="h-14 rounded-2xl bg-slate-200 text-base font-black text-slate-900 active:scale-95">
                🏠 오늘은 여기까지
              </button>
            </div>
          </div>
        )}
        {screen === "freetalk" && <FreeTalkScreen onExit={() => setScreen("home")} />}
      </div>
      {levelUpTarget !== null && (
        <LevelUpModal level={levelUpTarget} onClose={() => setLevelUpTarget(null)} />
      )}
    </div>
  );
}
