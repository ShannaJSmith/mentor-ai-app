"use client";
import { useState, useEffect, useRef } from "react";
import ChatMessage from "./components/ChatMessage";
import TypingIndicator from "./components/TypingIndicator";
import LoadingBubble from "./components/LoadingBubble";
import ChatInput from "./components/ChatInput";
import ScrollToTop from "./components/ScrollToTop";

type Sender = "user" | "model";

interface Message {
  id: number;
  sender: Sender;
  text: string;
  timestamp: number; // unix timestamp
}

let messageId = 1;

const getNextMessageId = () => {
  return messageId++;
};

const getInitialMessages = (): Message[] => [
  {
    id: getNextMessageId(),
    sender: "model",
    text: "Hello! I'm your Mentor AI. How can I help you today?",
    timestamp: Date.now(),
  },
];

export default function ChatPage() {
  const [messages, setMessages] = useState<Message[]>(getInitialMessages());
  const [input, setInput] = useState("");
  const [isTyping, setIsTyping] = useState(false);
  const [isLoadingAI, setIsLoadingAI] = useState(false);

  // Load messages from localStorage on mount
  useEffect(() => {
    const savedMessages = localStorage.getItem("mentor_ai_chat");
    if (savedMessages) {
      setMessages(JSON.parse(savedMessages));
    }
  }, []);

  // Save messages to localStorage whenever they change
  useEffect(() => {
    localStorage.setItem("mentor_ai_chat", JSON.stringify(messages));
  }, [messages]);

  const handleSend = async () => {
    if (!input.trim()) return;

    // Add user message
    const userMessage: Message = {
      id: getNextMessageId(),
      sender: "user",
      text: input.trim(),
      timestamp: Date.now(),
    };

    setMessages((prev) => [...prev, userMessage]);
    setInput("");

    setIsTyping(true);
    setIsLoadingAI(true);

    const response = await fetch("/api/chat", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ messages: [...messages, userMessage] }),
    });

    const data = await response.json();

    const aiMessage: Message = {
      id: getNextMessageId(),
      sender: "model",
      text: data.reply,
      timestamp: Date.now(),
    };

    setMessages((prev) => [...prev, aiMessage]);

    setIsTyping(false);
    setIsLoadingAI(false);
  };

  // Scroll to latest message
  const chatEndRef = useRef<HTMLDivElement | null>(null);

  useEffect(() => {
    chatEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages]);

  // Clear chat function
  const handleClearChat = () => {
    // Remove everythinf from localStorage
    localStorage.removeItem("mentor_ai_chat");

    messageId = 1; // reset message ID counter
    const resetMessages = getInitialMessages();
    setMessages(resetMessages);
    localStorage.setItem("mentor_ai_chat", JSON.stringify(resetMessages));
  };

  const handleEdit = async (timestamp: number, newText: string) => {
    let updatedHistory: Message[] = [];

    // Update messages state synchronously
    setMessages((prev) => {
      const updated = prev.map((msg) =>
        msg.timestamp === timestamp ? { ...msg, text: newText } : msg
      );

      // Remove the model reply immediately after the edited message
      const editedIndex = updated.findIndex((m) => m.timestamp === timestamp);

      if (updated[editedIndex + 1]?.sender === "model") {
        updated.splice(editedIndex + 1, 1);
      }

      updatedHistory = updated; // get the updated version

      return updated;
    });

    // Wait one microtask so `updatedHistory` is populated
    await Promise.resolve();

    // Send updated history to API
    const response = await fetch("/api/chat", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ messages: updatedHistory }),
    });

    const data = await response.json();

    // Append new model reply
    setMessages((prev) => [
      ...prev,
      {
        id: getNextMessageId(),
        sender: "model",
        text: data.reply,
        timestamp: Date.now(),
      },
    ]);
  };

  const handleDelete = (timestamp: number) => {
    setMessages((prev) => prev.filter((msg) => msg.timestamp !== timestamp));
  };

  return (
    <div className="flex flex-col min-h-screen bg-grey">
      <div className="flex justify-center p-2">
        <button
          className="text-sm text-muted hover:text-primary underline"
          onClick={handleClearChat}
        >
          Clear Chat
        </button>
      </div>

      <div className="flex-1 overflow-y-auto p-4 space-y-4">
        {messages.map((msg) => (
          <ChatMessage
            key={msg.id || msg.timestamp}
            {...msg}
            onEdit={handleEdit}
            onDelete={handleDelete}
          />
        ))}
        <div ref={chatEndRef} />
      </div>
      {isLoadingAI && <LoadingBubble />}
      {isTyping && <TypingIndicator />}
      <ScrollToTop />
      <ChatInput input={input} setInput={setInput} onSend={handleSend} />
    </div>
  );
}
