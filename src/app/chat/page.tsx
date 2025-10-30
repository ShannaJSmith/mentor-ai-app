"use client";
import { useState, useEffect, useRef } from "react";
import ChatMessage from "./components/ChatMessage";
import TypingIndicator from "./components/TypingIndicator";
import LoadingBubble from "./components/LoadingBubble";
import ChatInput from "./components/ChatInput";

type Sender = "user" | "model";

interface Message {
  id: number;
  sender: Sender;
  text: string;
  timestamp: number; // unix timestamp
}

interface Chat {
  id: number;
  title: string;
  messages: Message[];
  createdAt: number;
}

interface ChatPageProps {
  chats: Chat[];
  activeChatId: number | null;
  setChats: React.Dispatch<React.SetStateAction<Chat[]>>;
}

let messageId = 1;

const getNextMessageId = () => {
  return messageId++;
};

export default function ChatPage( { chats, activeChatId, setChats }: ChatPageProps) {
  const [input, setInput] = useState("");
  const [isTyping, setIsTyping] = useState(false);
  const [isLoadingAI, setIsLoadingAI] = useState(false);

  // // Helper to get the current active chat
  const activeChat = chats.find((chat) => chat.id === activeChatId);
  // Scroll to latest message
  const chatEndRef = useRef<HTMLDivElement | null>(null);
   useEffect(() => {
    chatEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [activeChat?.messages]);

  const handleSend = async () => {
    if (!input.trim() || !activeChat) return;

    // Add user message
    const userMessage: Message = {
      id: getNextMessageId(),
      sender: "user",
      text: input.trim(),
      timestamp: Date.now(),
    };

    // Update active chat's messages locally
    const updatedChats = chats.map((chat) =>
      chat.id === activeChat.id
        ? { ...chat, messages: [...chat.messages, userMessage] }
        : chat
    );

    setChats(updatedChats);
    setInput("");

    setIsTyping(true);
    setIsLoadingAI(true);

    // Call API with this chat's messages only
    const response = await fetch("/api/chat", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        messages: [...activeChat.messages, userMessage].map((msg) => ({
          role: msg.sender === "user" ? "user" : "model",
          content: msg.text,
        })),
      }),
    });

    const data = await response.json();

    const aiMessage: Message = {
      id: getNextMessageId(),
      sender: "model",
      text: data.reply,
      timestamp: Date.now(),
    };

    // Update with AI response
    setChats((prevChats) =>
      prevChats.map((chat) =>
        chat.id === activeChat.id
          ? { ...chat, messages: [...chat.messages, aiMessage] }
          : chat
      )
    );

    setIsTyping(false);
    setIsLoadingAI(false);
  };

  // Clear chat function
   const handleClearChat = () => {
    if (!activeChat) return;

    const resetMessage: Message = {
      id: getNextMessageId(),
      sender: "model",
      text: "Hello! I'm your Mentor AI. How can I help you today?",
      timestamp: Date.now(),
    };

    setChats((prevChats) =>
      prevChats.map((chat) =>
        chat.id === activeChat.id
          ? { ...chat, messages: [resetMessage] }
          : chat
      )
    );
  };

  return (
    <div className="flex h-screen">
      <div className="flex-1 flex flex-col min-h-screen bg-grey">
        <div className="flex justify-center p-2">
          <button
            className="text-sm text-muted hover:text-primary underline"
            onClick={handleClearChat}
          >
            Clear Chat
          </button>
        </div>

        <div className="flex-1 overflow-y-auto p-4 space-y-4">
          {activeChat?.messages.map((msg) => (
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

        <ChatInput 
          input={input} 
          setInput={setInput} 
          onSend={handleSend}
        />
      </div>
    </div>
  );
}
