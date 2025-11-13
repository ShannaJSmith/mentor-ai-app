import { NextResponse } from "next/server";
import { GoogleGenerativeAI } from "@google/generative-ai";

export async function POST(req: Request) {
  try {
    const { messages } = await req.json();

    if (!Array.isArray(messages)) {
      return NextResponse.json(
        { error: "Invalid messages format" },
        { status: 400 }
      );
    }

    // Prepare messages for Gemini API
    const contents = messages.map((msg: any) => ({
      role: msg.sender === "user" ? "user" : "model",
      parts: [{ text: String(msg.text) }],
    }));

    // Initialize Gemini client
    const genAI = new GoogleGenerativeAI(process.env.GOOGLE_API_KEY!);
    const model = genAI.getGenerativeModel({ model: "gemini-2.0-flash" });

    // Generate model response
    const result = await model.generateContent({ contents });

    // Extract reply text safely
    const reply =
      result.response?.text() ?? (result as any)?.text ?? "No response";

    return NextResponse.json({ reply });
  } catch (err) {
    console.error("Gemini API Error:", err);
    return NextResponse.json({ error: "Server error" }, { status: 500 });
  }
}
