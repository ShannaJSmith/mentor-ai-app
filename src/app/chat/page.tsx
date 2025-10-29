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

let messageId = 1;

const getNextMessageId = () => {
  return messageId++
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
  const [chats, setChats] = useState<Chat[]>([]);
  const [activeChatId, setActiveChatId] = useState<number | null>(null);

  // Helper to get the current active chat
  const activeChat = chats.find((chat) => chat.id === activeChatId);

  useEffect(() => {
  const savedChats = localStorage.getItem("mentor_ai_chats");
  const savedActive = localStorage.getItem("mentor_ai_active_chat");

  if (savedChats) {
    const parsedChats = JSON.parse(savedChats);
    setChats(parsedChats);
    setActiveChatId(Number(savedActive) || parsedChats[0]?.id);
  } else {
    const newChat: Chat = {
      id: Date.now(),
      title: "New Chat",
      messages: [
        {
          id: Date.now(),
          sender: "model",
          text: "Hello! I'm your Mentor AI. How can I help you today?",
          timestamp: Date.now(),
        },
      ],
      createdAt: Date.now(),
    };
    setChats([newChat]);
    setActiveChatId(newChat.id);
  }
}, []);

// Save chats and active chat to localStorage whenever they change
useEffect(() => {
  if (chats.length > 0) {
    localStorage.setItem("mentor_ai_chats", JSON.stringify(chats));
    localStorage.setItem("mentor_ai_active_chat", String(activeChatId));
  }
}, [chats, activeChatId]);

const createNewChat = () => {
  const newChat: Chat = {
    id: Date.now(),
    title: `Chat ${chats.length + 1}`,
    messages: [
      {
        id: Date.now(),
        sender: "model",
        text: "Hello! I'm your Mentor AI. How can I help you today?",
        timestamp: Date.now(),
      },
    ],
    createdAt: Date.now(),
  };

  setChats((prev) => [...prev, newChat]);
  setActiveChatId(newChat.id);
};

const selectChat = (chatId: number) => {
  setActiveChatId(chatId);
};

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
          {messages.map((msg) => (
            <ChatMessage key={msg.id} sender={msg.sender} text={msg.text} timestamp={msg.timestamp} />
          ))}
        <div ref={chatEndRef} />
        </div>
        {isLoadingAI && <LoadingBubble />}
        {isTyping && <TypingIndicator />}
      <ChatInput input={input} setInput={setInput} onSend={handleSend} />
      </div>
    </div>
  );
}