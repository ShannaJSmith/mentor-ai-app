"use client";
import { useState } from "react";
import ChatMessage from "./components/ChatMessage";

type Sender = "user" | "ai";

interface Message {
  id: number;
  sender: Sender;
  text: string;
}

export default function ChatPage() {
  const [messages, setMessages] = useState<Message[]>([
    { id: 1, sender: "ai", text: "Hello! I'm your Mentor AI. How can I help you today?" },
    { id: 2, sender: "user", text: "I want to improve my writing skills." },
  ]);
  const [input, setInput] = useState("");

    const handleSend = () => {
    if (!input.trim()) return;

    // Add user message
    const newMessage: Message = {
      id: Date.now(),
      sender: "user",
      text: input.trim(),
    };

    setMessages((prev) => [...prev, newMessage]);
    setInput("");
  };

  return (
    <div className="flex flex-col min-h-screen bg-background">
      {/* Messages */}
      <div className="flex-1 overflow-y-auto p-4 space-y-4">
        {messages.map((msg) => (
          <ChatMessage key={msg.id} sender={msg.sender} text={msg.text} />
        ))}
      </div>

      {/* Input Bar */}
      <div className="bg-surface p-3 border-t flex gap-2 items-center">
        <input
          type="text"
          value={input}
          onChange={(e) => setInput(e.target.value)}
          onKeyDown={(e) => e.key === "Enter" && handleSend()}
          placeholder="Type your message..."
          className="flex-1 p-2 rounded-lg border focus:outline-none"
        />
        <button
          onClick={handleSend}
          className="bg-primary text-surface px-4 py-2 rounded-lg shadow-soft hover:opacity-90 transition"
        >
          Send
        </button>
      </div>
    </div>
  );
}