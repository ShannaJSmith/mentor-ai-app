"use client";

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
}

const ChatContext = createContext<ChatContextValue | null>(null);

export function ChatProvider({ children }: { children: ReactNode }) {
  const [chats, setChats] = useState<Chat[]>([]);
  const [activeChatId, setActiveChatId] = useState<number | null>(null);

  useEffect(() => {
    const savedChats = JSON.parse(localStorage.getItem("mentor_ai_chats") || "[]");
    const savedActive = Number(localStorage.getItem("mentor_ai_active_chat"));

    if (savedChats.length > 0) {
      setChats(savedChats);
      setActiveChatId(savedActive || savedChats[0].id);
    } else {
      createNewChat();
    }
  }, []);

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

  const updateChatMessages = (chatId: number, messages: Message[]) => {
    setChats((prev) =>
      prev.map((chat) =>
        chat.id === chatId ? { ...chat, messages } : chat
      )
    );
  };

  return (
    <ChatContext.Provider
      value={{
        chats,
        activeChatId,
        setActiveChatId,
        createNewChat,
        updateChatMessages,
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
