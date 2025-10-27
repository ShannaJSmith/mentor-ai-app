import { NextResponse } from "next/server";

export async function POST(req: Request) {
  try {
    const { messages } = await req.json();

    if (!messages || !Array.isArray(messages)) {
      return NextResponse.json({ error: "Invalid request format" }, { status: 400 });
    }

    const response = await fetch("https://api.groq.com/openai/v1/chat/completions", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${process.env.GROQ_API_KEY}`,
      },
      body: JSON.stringify({
        model: "mixtral-8x7b", // best opt for reasoning & mentoring. Change as needed.
        messages: messages,
        stream: false,
        temperature: 0.7,
      }),
    });

    const data = await response.json();

    if (data.error) {
      return NextResponse.json({ error: data.error.message }, { status: 500 });
    }

    return NextResponse.json({
      reply: data.choices?.[0]?.message?.content || "No response from model",
    });
  } catch (error) {
    console.error("Groq API Error:", error);
    return NextResponse.json({ error: "Server error" }, { status: 500 });
  }
}
