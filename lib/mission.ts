import { missions } from "@/data/missions";
import type { Mission } from "@/types/mission";

export function pickRandomMission(): Mission {
  return missions[Math.floor(Math.random() * missions.length)];
}