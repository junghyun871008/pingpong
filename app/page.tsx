"use client";

import { unlockAudio } from "@/services/audio";
import { useEffect, useState } from "react";
import HomeScreen from "@/components/home/HomeScreen";
import MissionScreen from "@/components/mission/MissionScreen";
import FreeTalkScreen from "@/components/freetalk/FreeTalkScreen";
import { pickRandomMission } from "@/lib/mission";
import { getInitialReview, getMergedReview } from "@/lib/review";
import { updateStreak, loadStreak } from "@/lib/streak";
import type { Mission } from "@/types/mission";

export default function Page() {
  const [screen, setScreen] = useState<"home" | "mission" | "complete" | "freetalk">("home");
  const [reviewItems, setReviewItems] = useState<string[]>([]);
  const [streak, setStreak] = useState<number>(0);
  const [mission, setMission] = useState<Mission | null>(null);

  useEffect(() => {
    setReviewItems(getInitialReview());
    setStreak(loadStreak());
    setMission(pickRandomMission());
  }, []);

  if (!mission) {
    return (
      <div className="min-h-screen bg-slate-100 p-4 md:p-8">
        <div className="mx-auto max-w-4xl rounded-3xl bg-white p-6 shadow-xl">
          <h1 className="text-2xl font-bold">PingPong</h1>
          <p className="mt-2 text-slate-600">불러오는 중...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-slate-100 p-4 md:p-8">
      <div className="mx-auto max-w-4xl">
        {screen === "home" && (
          <HomeScreen
            title={mission.title}
            reviewItems={reviewItems}
            streak={streak}
            onReady={() => {
               unlockAudio();
            }}
            onStart={() => setScreen("mission")}
          />
        )}

        {screen === "mission" && (
          <MissionScreen
            mission={mission}
            onFinish={(review) => {
              setReviewItems(getMergedReview(review));
              const newStreak = updateStreak();
              setStreak(newStreak);
              setScreen("complete");
            }}
            onExit={() => setScreen("home")}
          />
        )}

        {screen === "complete" && (
          <div className="rounded-3xl bg-white p-6 shadow-xl">
            <h2 className="text-2xl font-bold">잘했어요!</h2>
            <p className="mt-2 text-slate-600">오늘 표현을 저장했고, 더 대화하거나 끝낼 수 있어요.</p>

            <div className="mt-4 flex flex-wrap gap-2">
              {mission.review.map((item) => (
                <span key={item} className="rounded-full bg-slate-100 px-3 py-1 text-sm">
                  {item}
                </span>
              ))}
            </div>

            <div className="mt-4 grid gap-3 md:grid-cols-2">
              <button
                onClick={() => setScreen("freetalk")}
                className="h-12 rounded-2xl bg-slate-900 text-white"
              >
                조금 더 대화할래요
              </button>
              <button
                onClick={() => setScreen("home")}
                className="h-12 rounded-2xl bg-slate-200"
              >
                오늘은 여기까지
              </button>
            </div>
          </div>
        )}

        {screen === "freetalk" && <FreeTalkScreen onExit={() => setScreen("home")} />}
      </div>
    </div>
  );
}