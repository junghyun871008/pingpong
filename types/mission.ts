export type Turn = {
  speaker: "AI" | "USER";
  text?: string;
  textKo?: string;
  hint?: string;
  hintKo?: string;
};

export type Mission = {
  id: number;
  title: string;
  turns: Turn[];
  review: string[];
  level?: "very_easy" | "easy";
  tags?: string[];
};
