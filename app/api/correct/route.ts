import { NextRequest, NextResponse } from "next/server";
import OpenAI from "openai";

const client = new OpenAI({ apiKey: process.env.OPENAI_API_KEY });

const SYSTEM_PROMPT = `You are an English speaking coach for absolute beginners.
Fix the user's spoken sentence naturally. Ignore punctuation/capitalization.
Give a short Korean explanation. Keep everything brief and friendly.
Output JSON only: {"corrected":"...","note":"...","nextQuestion":"..."}`;

function safeJsonParse(text: string) {
  try { return JSON.parse(text); } catch { return null; }
}

export async function POST(req: NextRequest) {
  try {
    const { input } = await req.json();
    if (!input || typeof input !== "string") {
      return NextResponse.json({ error: "Invalid input" }, { status: 400 });
    }

    const response = await client.responses.create({
      model: "gpt-4o-mini",
      input: [
        { role: "system", content: SYSTEM_PROMPT },
        { role: "user", content: "User sentence: " + input },
      ],
    });

    const text = response.output_text?.trim() || "";
    const parsed = safeJsonParse(text);

    if (!parsed?.corrected || !parsed?.note) {
      return NextResponse.json(
        { corrected: input, note: "좋아요!", nextQuestion: "How are you today?" },
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
