import { GoogleGenerativeAI } from "@google/generative-ai";
import { NextRequest, NextResponse } from "next/server";

const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY || "");
const MODEL_NAME = process.env.GEMINI_MODEL || "gemini-2.0-flash";

export async function POST(request: NextRequest) {
  try {
    const { messages } = await request.json();

    if (!process.env.GEMINI_API_KEY) {
      return NextResponse.json(
        { error: "GEMINI_API_KEY is not configured" },
        { status: 400 }
      );
    }

    // Create financial literacy system prompt
    const systemPrompt = `You are a friendly and helpful financial literacy teacher. Your role is to educate users about personal finance topics including:
- Budgeting and expense tracking
- Saving strategies and goal-setting
- Emergency funds
- Investing basics
- Credit and debt management
- Retirement planning
- Financial independence

Keep explanations clear and beginner-friendly. Use real-world examples. Be encouraging and supportive. If users have specific questions about their savings goals (which they may mention), provide relevant advice.

Always be accurate with financial information and encourage consulting with a financial advisor for personalized advice.`;

    if (!Array.isArray(messages) || messages.length === 0) {
      return NextResponse.json(
        { error: "Invalid request: messages must be a non-empty array" },
        { status: 400 }
      );
    }

    const model = genAI.getGenerativeModel({
      model: MODEL_NAME,
      systemInstruction: systemPrompt,
    });

    // Convert messages to Gemini format
    const history = messages
      .slice(0, -1)
      .filter((msg: any) => typeof msg?.content === "string")
      .map((msg: any) => ({
        role: msg.role === "user" ? "user" : "model",
        parts: [{ text: msg.content }],
      }));

    // Gemini history should start with a user turn.
    while (history.length > 0 && history[0].role !== "user") {
      history.shift();
    }

    const chat = model.startChat({
      history: history,
      generationConfig: {
        maxOutputTokens: 1024,
        temperature: 0.7,
      },
    });

    const userMessage = messages[messages.length - 1]?.content;
    if (typeof userMessage !== "string" || userMessage.trim().length === 0) {
      return NextResponse.json(
        { error: "Invalid request: latest message content is required" },
        { status: 400 }
      );
    }

    const result = await chat.sendMessage(userMessage);
    const responseText = result.response.text() || "I couldn't generate a response.";

    return NextResponse.json({ response: responseText });
  } catch (error) {
    console.error("Chat API error:", error);
    const message =
      error instanceof Error ? error.message : "Failed to process chat request";
    return NextResponse.json(
      { error: message },
      { status: 500 }
    );
  }
}
