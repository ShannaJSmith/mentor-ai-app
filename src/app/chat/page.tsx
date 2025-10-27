"use client";
import { useState, useEffect, useRef } from "react";
import ChatMessage from "./components/ChatMessage";
import TypingIndicator from "./components/TypingIndicator";
import LoadingBubble from "./components/LoadingBubble";
import ChatInput from "./components/ChatInput";

type Sender = "user" | "assistant"; // Groq uses "assistant" instead of "ai" for AI messages

interface Message {
  id: number;
  sender: Sender;
  text: string;
  timestamp: number; // unix timestamp
}

let messageId = 0;

const getNextMessageId = () => {
  messageId += 1;
  return messageId;
};

const getInitialMessages = (): Message[] => [
  {
    id: getNextMessageId(),
    sender: "assistant",
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

    try {
      const apiMessages = [...messages, userMessage].map((msg) => ({
        role: msg.sender === "user" ? "user" : "assistant",
        content: msg.text,
      }));

      const response = await fetch("/api/chat", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ messages: apiMessages }),
      });

      const data = await response.json();

      const aiMessage: Message = {
        id: getNextMessageId(),
        sender: "assistant",
        text: data.reply,
        timestamp: Date.now(),
      };
      setMessages((prev) => [...prev, aiMessage]);
    } catch (error) {
      console.error("Error fetching AI response:", error);
    } finally {
      setIsTyping(false);
      setIsLoadingAI(false);
    }
  };

  // Scroll to latest message
  const chatEndRef = useRef<HTMLDivElement | null>(null);

  useEffect(() => {
    chatEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages]);

  // Clear chat function
  const handleClearChat = () => {
    messageId = 0; // reset message ID counter
    const resetMessages = getInitialMessages();
    setMessages(resetMessages);
    localStorage.setItem("mentor_ai_chat", JSON.stringify(resetMessages));
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
          <ChatMessage key={msg.id} sender={msg.sender} text={msg.text} timestamp={msg.timestamp} />
        ))}
      <div ref={chatEndRef} />
      </div>
      {isLoadingAI && <LoadingBubble />}
      {isTyping && <TypingIndicator />}
     <ChatInput input={input} setInput={setInput} onSend={handleSend} />
    </div>
  );
}