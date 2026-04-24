import { NextRequest, NextResponse } from "next/server";
import OpenAI from "openai";

const client = new OpenAI({ apiKey: process.env.OPENAI_API_KEY });

const SYSTEM_PROMPT = `You are a friendly English conversation partner for an absolute beginner.

Your job:
1. Help the user practice spoken English slowly.
2. Ignore capitalization and punctuation mistakes.
3. Correct only unnatural spoken expressions.
4. Give one short Korean comment.
5. Ask one easy follow-up question in English.

Rules:
- This is speaking practice, not writing practice.
- Be warm and simple. Keep sentences short.
- Output JSON only.

JSON format:
{
  "corrected": "...",
  "note": "...",
  "nextQuestion": "..."
}`;

function safeJsonParse(text: string) {
  try { return JSON.parse(text); } catch { return null; }
}

export async function POST(req: NextRequest) {
  try {
    const { input, history } = await req.json();
    if (!input || typeof input !== "string") {
      return NextResponse.json({ error: "Invalid input" }, { status: 400 });
    }

    const historyText = Array.isArray(history) && history.length > 0
      ? "\n\nPrevious conversation:\n" +
        history.slice(-6)
          .map((msg: { speaker: string; text: string }) =>
            msg.speaker === "You" ? "User: " + msg.text : "AI: " + msg.text
          )
          .join("\n")
      : "";

    const response = await client.responses.create({
      model: "gpt-4o-mini",
      input: [
        { role: "system", content: SYSTEM_PROMPT + historyText },
        { role: "user", content: "User sentence: " + input },
      ],
    });

    const text = response.output_text?.trim() || "";
    const parsed = safeJsonParse(text);

    if (!parsed?.corrected || !parsed?.note) {
      return NextResponse.json(
        { corrected: input, note: "좋아요.", nextQuestion: "How are you today?" },
        { status: 200 }
      );
    }

    return NextResponse.json({
      corrected: parsed.corrected,
      note: parsed.note,
      nextQuestion: parsed.nextQuestion || "How are you today?",
    });
  } catch {
    return NextResponse.json(
      { corrected: "", note: "AI correction failed", nextQuestion: "How are you today?" },
      { status: 500 }
    );
  }
}
