import { NextRequest, NextResponse } from "next/server";
import OpenAI from "openai";

const client = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY,
});

const SYSTEM_PROMPT = `You are an English speaking coach for absolute beginners.

Your job:
1. Correct the user's English sentence.
2. Give a very short explanation in Korean.
3. Give one very short next question in easy English.

Rules:
- Keep everything short.
- The corrected sentence must be natural and easy.
- The Korean explanation must be one short sentence.
- The next question must be beginner-friendly.
- Never give a long grammar lecture.
- Never return more than one corrected sentence.
- Assume the user is practicing one short sentence at a time.
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