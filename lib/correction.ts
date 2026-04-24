export type CorrectionResult = {
  corrected: string;
  note: string;
};

export function normalizeSentence(text: string) {
  return text
    .toLowerCase()
    .replace(/[.,!?]/g, "")
    .replace(/\s+/g, " ")
    .trim();
}

export function getCorrection(input: string): CorrectionResult | null {
  const raw = input.trim();
  if (!raw) return null;

  const lower = normalizeSentence(raw);

  if (lower === "i is tired") {
    return {
      corrected: "I am tired.",
      note: "회화에서는 이렇게 말하면 자연스러워요.",
    };
  }

  if (lower === "its a rainy today" || lower === "it's a rainy today") {
    return {
      corrected: "It's rainy today.",
      note: "날씨를 말할 때는 이렇게 짧게 말하면 좋아요.",
    };
  }

  if (lower === "i like a coffee") {
    return {
      corrected: "I like coffee.",
      note: "취향을 말할 때는 coffee라고 말하면 자연스러워요.",
    };
  }

  if (lower === "i am a coworker") {
    return {
      corrected: "I am an office worker.",
      note: "회사원은 office worker가 더 자연스러워요.",
    };
  }

  if (lower === "i live busan") {
    return {
      corrected: "I live in Busan.",
      note: "도시 앞에는 in을 넣으면 자연스러워요.",
    };
  }

  if (lower === "yes i do") {
    return {
      corrected: "Yes, I do.",
      note: "좋아요. 회화에서 아주 많이 쓰는 대답이에요.",
    };
  }

  if (lower === "yes i am") {
    return {
      corrected: "Yes, I am.",
      note: "좋아요. 짧고 자연스러운 대답이에요.",
    };
  }

  const cleaned = raw.replace(/\s+/g, " ");
  const normalized = cleaned.charAt(0).toUpperCase() + cleaned.slice(1);
  const finalText = /[.!?]$/.test(normalized) ? normalized : `${normalized}.`;

  return {
    corrected: finalText,
    note: "좋아요. 회화에서는 충분히 자연스럽게 들려요.",
  };
}