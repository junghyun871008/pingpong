export type Turn = {
  speaker: "AI" | "USER";
  text?: string;
  hint?: string;
};

export type Mission = {
  id: number;
  title: string;
  turns: Turn[];
  review: string[];
  level?: "very_easy" | "easy";
  tags?: string[];
};