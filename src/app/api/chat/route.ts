import { NextResponse } from "next/server";
import { GoogleGenAI } from "@google/genai";

export async function POST(req: Request) {
  try {
    const { messages } = await req.json();

    if (!Array.isArray(messages)) {
      return NextResponse.json(
        { error: "Invalid messages format" },
        { status: 400 }
      );
    }

    const contents = messages.map((msg: any) => ({
      role: msg.sender === "user" ? "user" : "model",
      parts: [{ text: String(msg.text) }],
    }));

    // Initialize client (reads GEMINI_API_KEY from env.local automatically)
    const ai = new GoogleGenAI({});

    const response = await ai.models.generateContent({
      model: "gemini-2.5-pro",
      contents,
    });
    // The SDK exposes response text in either place depending on version
    const reply =
      (response as any)?.response?.text ??
      (response as any)?.text ??
      "No response";

    return NextResponse.json({ reply });
  } catch (err) {
    console.error("Gemini API Error:", err);
    return NextResponse.json({ error: "Server error" }, { status: 500 });
  }
}
