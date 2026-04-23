import type { Mission } from "@/types/mission";

export const missions: Mission[] = [
  {
    id: 1,
    title: "아침 인사",
    turns: [
      { speaker: "AI", text: "Good morning." },
      { speaker: "USER", hint: "Good morning." },

      { speaker: "AI", text: "How are you today?" },
      { speaker: "USER", hint: "I'm good / I'm tired." },

      { speaker: "AI", text: "What do you want this morning?" },
      { speaker: "USER", hint: "I want coffee." },

      { speaker: "AI", text: "Sounds good." },
    ],
    review: [
      "Good morning.",
      "How are you today?",
      "I'm good.",
      "I want coffee.",
    ],
    level: "very_easy",
    tags: ["morning", "greeting"],
  },

  {
    id: 2,
    title: "커피",
    turns: [
      { speaker: "AI", text: "Do you like coffee?" },
      { speaker: "USER", hint: "Yes, I do." },

      { speaker: "AI", text: "What kind of coffee do you like?" },
      { speaker: "USER", hint: "I like americano." },

      { speaker: "AI", text: "When do you drink coffee?" },
      { speaker: "USER", hint: "I drink it in the morning." },

      { speaker: "AI", text: "Nice. Me too." },
    ],
    review: [
      "Do you like coffee?",
      "Yes, I do.",
      "I like americano.",
      "I drink it in the morning.",
    ],
    level: "very_easy",
    tags: ["coffee", "daily"],
  },

  {
    id: 3,
    title: "좋아하는 것",
    turns: [
      { speaker: "AI", text: "What do you like?" },
      { speaker: "USER", hint: "I like tomatoes." },

      { speaker: "AI", text: "Why do you like them?" },
      { speaker: "USER", hint: "Because they are good." },

      { speaker: "AI", text: "Do you eat them often?" },
      { speaker: "USER", hint: "Yes, I do." },

      { speaker: "AI", text: "That's nice." },
    ],
    review: [
      "What do you like?",
      "I like tomatoes.",
      "Because they are good.",
      "Yes, I do.",
    ],
    level: "very_easy",
    tags: ["preference", "food"],
  },

  {
    id: 4,
    title: "사는 곳",
    turns: [
      { speaker: "AI", text: "Where do you live?" },
      { speaker: "USER", hint: "I live in Busan." },

      { speaker: "AI", text: "Do you like Busan?" },
      { speaker: "USER", hint: "Yes, I do." },

      { speaker: "AI", text: "What do you like about it?" },
      { speaker: "USER", hint: "I like the beach." },

      { speaker: "AI", text: "That sounds great." },
    ],
    review: [
      "I live in Busan.",
      "Yes, I do.",
      "I like the beach.",
    ],
    level: "very_easy",
    tags: ["intro", "place"],
  },

  {
    id: 5,
    title: "점심",
    turns: [
      { speaker: "AI", text: "What do you want for lunch?" },
      { speaker: "USER", hint: "I want pasta." },

      { speaker: "AI", text: "Do you like pasta?" },
      { speaker: "USER", hint: "Yes, I do." },

      { speaker: "AI", text: "What do you drink with it?" },
      { speaker: "USER", hint: "I drink water." },

      { speaker: "AI", text: "Sounds good." },
    ],
    review: [
      "I want pasta.",
      "Yes, I do.",
      "I drink water.",
    ],
    level: "very_easy",
    tags: ["food", "lunch"],
  },
];