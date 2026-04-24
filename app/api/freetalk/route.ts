import { NextRequest, NextResponse } from "next/server";
import OpenAI from "openai";

const client = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY,
});

const SYSTEM_PROMPT = `You are a friendly English conversation partner for an absolute beginner.

Your job:
1. Help the user practice spoken English slowly.
2. Ignore capitalization and punctuation mistakes.
3. Correct only unnatural spoken expressions.
4. Give one short Korean comment.
5. Ask one easy follow-up question in English.

Rules:
- This is speaking practice, not writing practice.
- Be warm and simple.
- Keep the corrected sentence short.
- Keep the Korean comment under one sentence.
- Keep the next question very easy.
- No long responses.
- Output JSON only.

JSON format:
{
  "corrected": "...",
  "note": "...",
  "nextQuestion": "..."
}`;

function safeJsonParse(text: string) {
  try {
    return JSON.parse(text);
  } catch {
    return null;
  }
}

export async function POST(req: NextRequest) {
  try {
    const { input } = await req.json();

    if (!input || typeof input !== "string") {
      return NextResponse.json({ error: "Invalid input" }, { status: 400 });
    }

    const response = await client.responses.create({
      model: "gpt-5",
      input: [
        {
          role: "system",
          content: SYSTEM_PROMPT,
        },
        {
          role: "user",
          content: `User sentence: ${input}`,
        },
      ],
    });

    const text = response.output_text?.trim() || "";
    const parsed = safeJsonParse(text);

    if (!parsed?.corrected || !parsed?.note) {
      return NextResponse.json(
        {
          corrected: input,
          note: "좋아요.",
          nextQuestion: "How are you today?",
        },
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
      {
        corrected: "",
        note: "AI correction failed",
        nextQuestion: "How are you today?",
      },
      { status: 500 }
    );
  }
}