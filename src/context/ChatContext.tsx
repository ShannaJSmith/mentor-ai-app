"use client";

import { GoogleGenAI } from "@google/genai";
import { createContext, useContext, useState, useEffect, ReactNode } from "react";

type Sender = "user" | "model";

interface Message {
  id: number;
  sender: Sender;
  text: string;
  timestamp: number;
}

interface Chat {
  id: number;
  title: string;
  messages: Message[];
  createdAt: number;
}

interface ChatContextValue {
  chats: Chat[];
  activeChatId: number | null;
  setActiveChatId: (id: number) => void;
  createNewChat: () => void;
  updateChatMessages: (chatId: number, messages: Message[]) => void;
  sendMessage: (text: string) => Promise<void>;
  isLoading: boolean;
}

const ChatContext = createContext<ChatContextValue | null>(null);

let messageCounter = 1;
const getNextMessageId = () => messageCounter++;

export function ChatProvider({ children }: { children: ReactNode }) {
  const [chats, setChats] = useState<Chat[]>([]);
  const [activeChatId, setActiveChatId] = useState<number | null>(null);
  const [isLoading, setIsLoading] = useState(false);



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
          id: getNextMessageId(),
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

    useEffect(() => {
    const savedChats = JSON.parse(localStorage.getItem("mentor_ai_chats") || "[]");
    const savedActive = Number(localStorage.getItem("mentor_ai_active_chat"));

    if (savedChats.length > 0) {
      setChats(savedChats);
      setActiveChatId(savedActive || savedChats[0].id);
      messageCounter = savedChats.flatMap(c => c.messages).length + 1;
    } else {
      createNewChat();
    }
  }, []);

  const updateChatMessages = (chatId: number, messages: Message[]) => {
    setChats((prev) =>
      prev.map((chat) => (chat.id === chatId ? { ...chat, messages } : chat))
    );
  };

  // ✅ AI SEND LOGIC MOVED HERE
  const sendMessage = async (text: string) => {
    if (!text.trim() || !activeChatId) return;

    const activeChat = chats.find((c) => c.id === activeChatId);
    if (!activeChat) return;

    const userMessage: Message = {
      id: getNextMessageId(),
      sender: "user",
      text,
      timestamp: Date.now(),
    };

    const newMessages = [...activeChat.messages, userMessage];
    updateChatMessages(activeChatId, newMessages);

    setIsLoading(true);

    const ai = new GoogleGenAI({});
    const response = await ai.models.generateContent({
      model: "gemini-2.5-pro",
      contents: newMessages.map((msg) => ({
        role: msg.sender === "user" ? "user" : "model",
        parts: [{ text: msg.text }],
      })),
    });

    const reply =
      (response as any)?.response?.text ??
      (response as any)?.text ??
      "No response";

    const aiMessage: Message = {
      id: getNextMessageId(),
      sender: "model",
      text: reply,
      timestamp: Date.now(),
    };

    updateChatMessages(activeChatId, [...newMessages, aiMessage]);
    setIsLoading(false);
  };

  return (
    <ChatContext.Provider
      value={{
        chats,
        activeChatId,
        setActiveChatId,
        createNewChat,
        updateChatMessages,
        sendMessage,
        isLoading,
      }}
    >
      {children}
    </ChatContext.Provider>
  );
}

export function useChat() {
  const context = useContext(ChatContext);
  if (!context) throw new Error("useChat must be used inside ChatProvider");
  return context;
}