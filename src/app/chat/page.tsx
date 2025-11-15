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

  useEffect(() => {
    // Do NOT save if in the middle of a clear
    if (isClearingRef.current) {
      isClearingRef.current = false;
      localStorage.setItem("mentor_ai_chat", JSON.stringify(messages));
      return;
    }

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

  const isClearingRef = useRef(false);

  // Clear chat function
  const handleClearChat = () => {
    isClearingRef.current = true;

    localStorage.removeItem("mentor_ai_chat");

    messageId = 1;
    const resetMessages = getInitialMessages();
    setMessages(resetMessages);
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
            key={msg.id}
            sender={msg.sender}
            text={msg.text}
            timestamp={msg.timestamp}
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
