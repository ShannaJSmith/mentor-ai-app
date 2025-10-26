"use client";
import { useState, useEffect, useRef } from "react";
import ChatMessage from "./components/ChatMessage";
import TypingIndicator from "./components/TypingIndicator";
import LoadingBubble from "./components/LoadingBubble";

type Sender = "user" | "ai";

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
    sender: "ai",
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

    const handleSend = () => {
    if (!input.trim()) return;

    // Add user message
    const newMessage: Message = {
      id: getNextMessageId(),
      sender: "user",
      text: input.trim(),
      timestamp: Date.now(),
    };

    setMessages((prev) => [...prev, newMessage]);
    setInput("");

    // TEMP: simulate AI typing for UI testing
    setIsTyping(true);
    setTimeout(() => {
      setIsTyping(false);
    }, 2000);

    setIsLoadingAI(true);
    setTimeout(() => {
      setIsLoadingAI(false);
    }, 2000);
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
    <div className="flex flex-col min-h-screen bg-background">
      <div className="flex justify-center p-2">
        <button
          className="text-sm text-muted hover:text-primary underline"
          onClick={handleClearChat}
        >
          Clear Chat
        </button>
      </div>

      {/* Messages */}
      <div className="flex-1 overflow-y-auto p-4 space-y-4">
        {messages.map((msg) => (
          <ChatMessage key={msg.id} sender={msg.sender} text={msg.text} timestamp={msg.timestamp} />
        ))}
      <div ref={chatEndRef} />
      </div>
      {isLoadingAI && <LoadingBubble />}
      {isTyping && <TypingIndicator />}

      {/* Input Bar */}
      <div className="bg-surface p-3 border-t flex gap-2 items-center">
       <textarea
        className="flex-1 p-2 border rounded-xl focus:outline-none resize-none overflow-y-auto"
        style={{ maxHeight: "72px", lineHeight: "1.5rem" }} // for mobile UX
        value={input}
        onChange={(e) => {
          setInput(e.target.value);
          const target = e.target as HTMLTextAreaElement;
          target.style.height = "auto"; // Reset height
          target.style.height = `${Math.min(target.scrollHeight, 72)}px`; // Set to content height with max
        }}
        onKeyDown={(e) => {
          if (e.key === "Enter" && !e.shiftKey) {
            e.preventDefault();
            handleSend();
        }
      }}
        placeholder="Type your message..."
        rows={1}
      />
        <button
          className="bg-primary text-surface px-4 py-2 rounded-lg shadow-soft hover:opacity-90 transition"
          onClick={handleSend}
        >
          Send
        </button>
      </div>
    </div>
  );
}