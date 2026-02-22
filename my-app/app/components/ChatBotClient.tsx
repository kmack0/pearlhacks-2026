"use client";

import React, { useState, useRef, useEffect } from "react";

interface Message {
  id: string;
  role: "user" | "assistant";
  content: string;
  timestamp: Date;
}

const suggestedQuestions = [
  "How do I create a budget?",
  "What's the best way to save money?",
  "How do I build an emergency fund?",
  "Can you explain investing basics?",
  "What's the 50/30/20 budgeting rule?",
  "How do I start investing with little money?",
];

const quickReplyChips = [
  "Can you simplify that?",
  "Give me a real-life example",
  "Can you turn this into a checklist?",
  "What's one action I should take today?",
];

function renderAssistantContent(content: string) {
  const lines = content.split("\n");
  const blocks: React.ReactNode[] = [];
  let i = 0;

  while (i < lines.length) {
    const rawLine = lines[i];
    const line = rawLine.trim();

    if (!line) {
      i += 1;
      continue;
    }

    const headingMatch = line.match(/^(#{1,3})\s+(.+)$/);
    if (headingMatch) {
      const level = headingMatch[1].length;
      const text = headingMatch[2];
      const headingClass =
        level === 1
          ? "text-base font-semibold mt-2 mb-1"
          : level === 2
          ? "text-sm font-semibold mt-2 mb-1"
          : "text-sm font-medium mt-2 mb-1";
      blocks.push(
        <p key={`h-${i}`} className={headingClass}>
          {text}
        </p>
      );
      i += 1;
      continue;
    }

    if (/^[-*]\s+/.test(line)) {
      const items: string[] = [];
      while (i < lines.length && /^[-*]\s+/.test(lines[i].trim())) {
        items.push(lines[i].trim().replace(/^[-*]\s+/, ""));
        i += 1;
      }
      blocks.push(
        <ul key={`ul-${i}`} className="list-disc pl-5 my-1 space-y-1 text-sm">
          {items.map((item, idx) => (
            <li key={idx}>{item}</li>
          ))}
        </ul>
      );
      continue;
    }

    if (/^\d+\.\s+/.test(line)) {
      const items: string[] = [];
      while (i < lines.length && /^\d+\.\s+/.test(lines[i].trim())) {
        items.push(lines[i].trim().replace(/^\d+\.\s+/, ""));
        i += 1;
      }
      blocks.push(
        <ol key={`ol-${i}`} className="list-decimal pl-5 my-1 space-y-1 text-sm">
          {items.map((item, idx) => (
            <li key={idx}>{item}</li>
          ))}
        </ol>
      );
      continue;
    }

    const paragraphLines: string[] = [];
    while (
      i < lines.length &&
      lines[i].trim() &&
      !/^(#{1,3})\s+/.test(lines[i].trim()) &&
      !/^[-*]\s+/.test(lines[i].trim()) &&
      !/^\d+\.\s+/.test(lines[i].trim())
    ) {
      paragraphLines.push(lines[i].trim());
      i += 1;
    }

    blocks.push(
      <p key={`p-${i}`} className="text-sm leading-relaxed my-1 whitespace-pre-wrap">
        {paragraphLines.join(" ")}
      </p>
    );
  }

  return <div className="space-y-1">{blocks}</div>;
}

function splitAssistantResponse(content: string): string[] {
  return content
    .split(/\n\s*---\s*\n/g)
    .map((chunk) => chunk.trim())
    .filter(Boolean);
}

export default function ChatBotClient() {
  const [messages, setMessages] = useState<Message[]>([
    {
      id: "1",
      role: "assistant",
      content:
        "Hi! 👋 I'm your financial literacy assistant. I'm here to help you learn about budgeting, saving, investing, and achieving your financial goals. What would you like to know?",
      timestamp: new Date(),
    },
  ]);
  const [input, setInput] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [isOpen, setIsOpen] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  const sendMessage = async (text: string) => {
    if (!text.trim()) return;

    // Add user message
    const userMessage: Message = {
      id: Date.now().toString(),
      role: "user",
      content: text,
      timestamp: new Date(),
    };

    setMessages((prev) => [...prev, userMessage]);
    setInput("");
    setIsLoading(true);

    try {
      const response = await fetch("/api/chat", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          messages: [
            ...messages,
            {
              role: "user",
              content: text,
            },
          ],
        }),
      });

      const data = await response.json();

      if (!response.ok || data.error) {
        throw new Error(data.error);
      }

      const chunks = splitAssistantResponse(data.response);
      const timestamp = new Date();
      const assistantMessages: Message[] =
        chunks.length > 0
          ? chunks.map((chunk, idx) => ({
              id: `${Date.now()}-${idx}`,
              role: "assistant" as const,
              content: chunk,
              timestamp,
            }))
          : [
              {
                id: (Date.now() + 1).toString(),
                role: "assistant" as const,
                content: data.response,
                timestamp,
              },
            ];

      setMessages((prev) => [...prev, ...assistantMessages]);
    } catch (error: any) {
      console.error("Error sending message:", error);
      const errorText =
        error instanceof Error && error.message
          ? error.message
          : "Unknown chat error";
const errorMessage: Message = {
  id: (Date.now() + 1).toString(),
  role: "assistant",
  content:
    "Sorry, I encountered an error. Please check that your GEMINI_API_KEY is configured and try again.",
  timestamp: new Date(),
};
      setMessages((prev) => [...prev, errorMessage]);
    } finally {
      setIsLoading(false);
    }
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    sendMessage(input);
  };

  const lastAssistantMessageId = [...messages]
    .reverse()
    .find((message) => message.role === "assistant")?.id;
  const hasUserMessage = messages.some((message) => message.role === "user");

  return (
    <>
      {/* Chat Button */}
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="fixed bottom-6 right-6 w-14 h-14 bg-[#004700] text-white rounded-full shadow-lg hover:bg-[#003500] transition-all flex items-center justify-center z-40"
        aria-label="Open chat"
      >
        <svg
          className="w-12 h-12"
          fill="none"
          stroke="currentColor"
          viewBox="0 0 24 24"
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth={2}
            d="M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z"
          />
        </svg>
      </button>

      {/* Chat Window */}
      {isOpen && (
        <div className="fixed bottom-24 right-6 w-96 h-[600px] bg-white rounded-lg shadow-xl flex flex-col z-50 border border-gray-200">
          {/* Header */}
          <div className="bg-[#004700] text-white p-4 rounded-t-lg flex justify-between items-center">
            <div>
              <h3 className="font-semibold text-lg">Financial Literacy Bot</h3>
              <p className="text-xs opacity-90">Learn about personal finance</p>
            </div>
            <button
              onClick={() => setIsOpen(false)}
              className="text-white hover:opacity-80"
            >
              ✕
            </button>
          </div>

          {/* Messages */}
          <div className="flex-1 overflow-y-auto p-4 space-y-4 bg-gray-50">
            {messages.map((message) => (
              <div
                key={message.id}
                className={`flex ${
                  message.role === "user" ? "justify-end" : "justify-start"
                }`}
              >
                <div
                  className={`max-w-xs px-4 py-2 rounded-lg ${
                    message.role === "user"
                      ? "bg-[#004700] text-white rounded-br-none"
                      : "bg-white text-gray-800 border border-gray-200 rounded-bl-none"
                  }`}
                >
                  {message.role === "assistant" ? (
                    renderAssistantContent(message.content)
                  ) : (
                    <p className="text-sm leading-relaxed whitespace-pre-wrap">
                      {message.content}
                    </p>
                  )}
                  <span className="text-xs mt-1 block opacity-70">
                    {message.timestamp.toLocaleTimeString([], {
                      hour: "2-digit",
                      minute: "2-digit",
                    })}
                  </span>
                  {message.role === "assistant" &&
                    message.id === lastAssistantMessageId &&
                    hasUserMessage &&
                    !isLoading && (
                      <div className="mt-2 flex flex-wrap gap-2">
                        {quickReplyChips.map((chip) => (
                          <button
                            key={chip}
                            onClick={() => sendMessage(chip)}
                            className="cursor-pointer text-xs px-2.5 py-1 rounded-full bg-[#e8f3e8] text-[#004700] hover:bg-[#d9ecd9] transition-colors"
                          >
                            {chip}
                          </button>
                        ))}
                      </div>
                    )}
                </div>
              </div>
            ))}
            {isLoading && (
              <div className="flex justify-start">
                <div className="bg-white text-gray-800 border border-gray-200 px-4 py-2 rounded-lg rounded-bl-none">
                  <div className="flex space-x-2">
                    <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce"></div>
                    <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce delay-100"></div>
                    <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce delay-200"></div>
                  </div>
                </div>
              </div>
            )}
            <div ref={messagesEndRef} />
          </div>

          {/* Suggested Questions */}
          {messages.length === 1 && !isLoading && (
            <div className="px-4 py-3 border-b border-gray-200 bg-white">
              <p className="text-xs font-semibold text-gray-600 mb-2">
                Try asking:
              </p>
              <div className="grid grid-cols-1 gap-2">
                {suggestedQuestions.slice(0, 3).map((q, idx) => (
                  <button
                    key={idx}
                    onClick={() => sendMessage(q)}
                    className="cursor-pointer text-left text-xs p-2 bg-gray-100 hover:bg-gray-200 rounded transition-colors text-gray-700 truncate"
                  >
                    {q}
                  </button>
                ))}
              </div>
            </div>
          )}

          {/* Input */}
          <form onSubmit={handleSubmit} className="p-4 border-t border-gray-200">
            <div className="flex gap-2">
              <input
                type="text"
                value={input}
                onChange={(e) => setInput(e.target.value)}
                placeholder="Ask about financial literacy..."
                className="flex-1 px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#004700] text-sm"
                disabled={isLoading}
              />
              <button
                type="submit"
                disabled={isLoading || !input.trim()}
                className="bg-[#004700] text-white px-4 py-2 rounded-lg hover:bg-[#003500] disabled:opacity-50 transition-all"
              >
                Send
              </button>
            </div>
          </form>
        </div>
      )}
    </>
  );
}
