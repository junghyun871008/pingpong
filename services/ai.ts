export type AiCorrectionResponse = {
  corrected: string;
  note: string;
  nextQuestion?: string;
};

export async function requestCorrection(input: string): Promise<AiCorrectionResponse> {
  const response = await fetch("/api/correct", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify({ input }),
  });

  if (!response.ok) {
    throw new Error("Failed to correct sentence");
  }

  return response.json();
}

export async function requestFreeTalk(
  input: string,
  history: { speaker: string; text: string }[]
): Promise<AiCorrectionResponse> {
  const response = await fetch("/api/freetalk", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify({ input, history }),
  });

  if (!response.ok) {
    throw new Error("Failed to continue free talk");
  }

  return response.json();
}