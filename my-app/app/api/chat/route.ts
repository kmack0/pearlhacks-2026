import { GoogleGenerativeAI } from "@google/generative-ai";
import { NextRequest, NextResponse } from "next/server";

<<<<<<< HEAD
function looksIncompleteResponse(text: string): boolean {
  const trimmed = text.trim();
  if (!trimmed) return true;
  if (trimmed.length < 80) return false;
  return !/[.!?]"?$/.test(trimmed);
}

async function discoverAvailableGeminiModels(apiKey: string): Promise<string[]> {
  const response = await fetch(
    `https://generativelanguage.googleapis.com/v1beta/models?key=${apiKey}`
  );

  if (!response.ok) {
    return [];
  }

  const data = await response.json();
  const models = Array.isArray(data?.models) ? data.models : [];

  const modelNames = models
    .filter((model: any) => {
      const methods = Array.isArray(model?.supportedGenerationMethods)
        ? model.supportedGenerationMethods
        : [];
      return (
        typeof model?.name === "string" &&
        model.name.startsWith("models/gemini") &&
        methods.includes("generateContent")
      );
    })
    .map((model: any) => model.name.replace(/^models\//, ""));

  const preferredOrder = [
    "gemini-2.5-flash",
    "gemini-2.0-flash",
    "gemini-2.0-flash-001",
    "gemini-1.5-flash",
  ];

  const ordered = preferredOrder.filter((name) => modelNames.includes(name));
  const remaining = modelNames.filter((name: string) => !ordered.includes(name));
  return [...ordered, ...remaining];
}
=======
const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY || "");
const MODEL_NAME = process.env.GEMINI_MODEL || "gemini-2.0-flash";
>>>>>>> eef3581b8e95e94cdaeebdd6479a89bb8868a93f

export async function POST(request: NextRequest) {
  try {
    const apiKey = process.env.GEMINI_API_KEY;

    if (!apiKey) {
      return NextResponse.json(
        { error: "GEMINI_API_KEY is not configured" },
        { status: 500 }
      );
    }

    const body = await request.json();
    const { messages } = body;

    const genAI = new GoogleGenerativeAI(apiKey);

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

Always be accurate with financial information and encourage consulting with a financial advisor for personalized advice.

<<<<<<< HEAD
Format every response for readability:
- Start with a short heading using markdown style like "## Budget Basics"
- Use concise paragraphs (1-2 sentences each)
- Use bullet points for tips/checklists
- Use numbered steps when explaining a process
- End with one actionable next step the user can take today.

Length and pacing rules:
- Keep responses concise but complete: usually 140-260 words.
- Answer the user's full question in one response whenever possible.
- Do not split into "Part 1 / Part 2" unless the user explicitly asks for step-by-step lessons.
- End with one short check-in question, e.g., "Does that make sense?"

Style rules:
- Use emojis to organize sections and make responses more engaging (for example: 💰, 📌, ✅, 🚀).
- Use 3-6 emojis total per response, placed in headings or bullet starts.
- Keep emojis relevant and avoid overusing them so readability stays high.`;

    // Note: older models like gemini-pro do not support systemInstruction, but newer ones do.
    // We'll use the systemInstruction feature but keep the history format simple.
    let history = messages.slice(0, -1).map((msg: any) => ({
      role: msg.role === "user" ? "user" : "model",
      parts: [{ text: msg.content }],
    }));
=======
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
>>>>>>> eef3581b8e95e94cdaeebdd6479a89bb8868a93f

    // Ensure history starts with a user message (Gemini requirement)
    if (history.length > 0 && history[0].role === "model") {
      history = history.slice(1);
    }

    const lastMessage = messages[messages.length - 1];
    const userMessage = lastMessage.content;

    const configuredModel = process.env.GEMINI_MODEL;
    const modelCandidates = [
      configuredModel,
      "gemini-2.5-flash",
      "gemini-2.0-flash",
      "gemini-2.0-flash-001",
      "gemini-1.5-flash",
    ].filter((value, index, array): value is string => {
      return Boolean(value) && array.indexOf(value as string) === index;
    });

<<<<<<< HEAD
    let responseText: string | null = null;
    let lastModelError: any = null;

    for (const modelName of modelCandidates) {
      try {
        const model = genAI.getGenerativeModel({
          model: modelName,
          systemInstruction: systemPrompt,
        });

        const chat = model.startChat({
          history: history,
          generationConfig: {
            maxOutputTokens: 1200,
            temperature: 0.6,
          },
        });

        let result = await chat.sendMessage(userMessage);
        let combinedResponse = result.response.text();

        // If the model appears to cut off mid-thought, ask it to continue once.
        if (looksIncompleteResponse(combinedResponse)) {
          result = await chat.sendMessage(
            "Continue from exactly where you left off and finish the explanation in a complete way. Do not restart from the beginning."
          );
          combinedResponse = `${combinedResponse}\n\n${result.response.text()}`.trim();
        }

        responseText = combinedResponse;
        break;
      } catch (error: any) {
        lastModelError = error;
        const errorMessage = `${error?.message || ""}`.toLowerCase();
        const status = error?.response?.status;

        // If the model is unavailable (404), try the next candidate.
        if (
          status === 404 ||
          errorMessage.includes("not found") ||
          errorMessage.includes("not supported for generatecontent")
        ) {
          continue;
        }

        throw error;
      }
    }

    if (!responseText) {
      const discoveredModels = await discoverAvailableGeminiModels(apiKey);

      for (const modelName of discoveredModels) {
        if (modelCandidates.includes(modelName)) {
          continue;
        }
        try {
          const model = genAI.getGenerativeModel({
            model: modelName,
            systemInstruction: systemPrompt,
          });
          const chat = model.startChat({
            history: history,
            generationConfig: {
              maxOutputTokens: 1200,
              temperature: 0.6,
            },
          });

          let result = await chat.sendMessage(userMessage);
          let combinedResponse = result.response.text();

          if (looksIncompleteResponse(combinedResponse)) {
            result = await chat.sendMessage(
              "Continue from exactly where you left off and finish the explanation in a complete way. Do not restart from the beginning."
            );
            combinedResponse = `${combinedResponse}\n\n${result.response.text()}`.trim();
          }

          responseText = combinedResponse;
          break;
        } catch (error: any) {
          lastModelError = error;
        }
      }
    }

    if (!responseText) {
      throw new Error(
        `No compatible Gemini model is available. Tried: ${modelCandidates.join(
          ", "
        )}. Set GEMINI_MODEL to one listed by the Gemini ListModels API. Last error: ${
          lastModelError?.message || "unknown"
        }`
      );
    }
=======
    const userMessage = messages[messages.length - 1]?.content;
    if (typeof userMessage !== "string" || userMessage.trim().length === 0) {
      return NextResponse.json(
        { error: "Invalid request: latest message content is required" },
        { status: 400 }
      );
    }

    const result = await chat.sendMessage(userMessage);
    const responseText = result.response.text() || "I couldn't generate a response.";
>>>>>>> eef3581b8e95e94cdaeebdd6479a89bb8868a93f

    return NextResponse.json({ response: responseText });
  } catch (error: any) {
    console.error("Chat API error:", error);
<<<<<<< HEAD

    // Check for rate limit error
    if (error.response?.status === 429 || error.message?.includes("429")) {
      return NextResponse.json(
        {
          error:
            "I'm receiving too many requests right now. Please wait a moment and try again.",
        },
        { status: 429 }
      );
    }

    return NextResponse.json(
      {
        error:
          error?.message ||
          "Failed to process chat request. Verify your Gemini API key, model access, and quota.",
      },
=======
    const message =
      error instanceof Error ? error.message : "Failed to process chat request";
    return NextResponse.json(
      { error: message },
>>>>>>> eef3581b8e95e94cdaeebdd6479a89bb8868a93f
      { status: 500 }
    );
  }
}
