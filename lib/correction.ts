export type CorrectionResult = {
  corrected: string;
  note: string;
};

export function getCorrection(input: string): CorrectionResult | null {
  const raw = input.trim();
  if (!raw) return null;

  const lower = raw.toLowerCase();

  if (lower === "i is tired") {
    return { corrected: "I am tired.", note: "I 다음에는 am을 써요." };
  }

  if (lower === "it's a rainy today" || lower === "its a rainy today") {
    return { corrected: "It's rainy today.", note: "rainy 앞에는 a를 쓰지 않아요." };
  }

  if (lower === "i like a coffee") {
    return { corrected: "I like coffee.", note: "취향을 말할 때는 coffee가 자연스러워요." };
  }

  if (lower === "i am a coworker") {
    return { corrected: "I am an office worker.", note: "coworker는 직장 동료에 가까워요." };
  }

  if (lower === "i live busan") {
    return { corrected: "I live in Busan.", note: "도시 앞에는 in을 써요." };
  }

  if (lower === "yes i do") {
    return { corrected: "Yes, I do.", note: "좋아요. 아주 자연스러운 대답이에요." };
  }

  if (lower === "yes i am") {
    return { corrected: "Yes, I am.", note: "좋아요. 짧고 자연스러워요." };
  }

  if (lower === "i feel tired") {
    return { corrected: "I feel tired.", note: "오늘 컨디션을 말할 때 잘 쓸 수 있어요." };
  }

  const cleaned = raw.replace(/\s+/g, " ");
  const normalized = cleaned.charAt(0).toUpperCase() + cleaned.slice(1);
  const finalText = /[.!?]$/.test(normalized) ? normalized : `${normalized}.`;

  return {
    corrected: finalText,
    note: "좋아요. 아주 짧고 자연스러운 문장이에요.",
  };
}