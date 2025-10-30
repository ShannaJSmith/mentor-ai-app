"use client";
import React from "react";
import "./globals.css";
import { useState, useEffect } from "react";
import Sidebar from "./chat/components/Sidebar";

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

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);
  const [isSidebarCollapsed, setIsSidebarCollapsed] = useState(false);

  const [chats, setChats] = useState<Chat[]>([]);
  const [activeChatId, setActiveChatId] = useState<number | null>(null);

  // Load chats on startup
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


  return (
    <html lang="en">
      <body className="bg-grey text-text min-h-screen flex flex-col">
        <header className="bg-primary text-white p-4 shadow-md">
          <nav className="flex items-center justify-between">
            <div className="flex items-center gap-4">
              {/* Mobile Sidebar Toggle Button */}
              <button
                className="lg:hidden p-2 rounded bg-white/20 hover:bg-white/30"
                onClick={() => setIsSidebarOpen(true)}
              >
                ☰
              </button>
              <h1 className="text-xl font-bold">Mentor AI</h1>
            </div>
            <button className="bg-accent text-white px-3 py-1 rounded-lg text-sm shadow-soft">
              Login
            </button>
          </nav>
        </header>
        <div className="flex flex-grow">
          {/* Mobile overlay */}
          {isSidebarOpen && (
            <div
              className="fixed inset-0 z-40 cursor-default lg:hidden"
              onClick={() => setIsSidebarOpen(false)}
              aria-label="Close sidebar"
            ></div>
          )}
          <Sidebar
            isOpen={isSidebarOpen}
            isCollapsed={isSidebarCollapsed}
            onToggleCollapse={() => setIsSidebarCollapsed(!isSidebarCollapsed)}
            chats={chats}
            activeChatId={activeChatId}
            onSelectChat={selectChat}
            onNewChat={createNewChat}
          />
          <main className="flex-grow">{children}</main>
        </div>
        <footer className="bg-white text-muted text-center py-4 text-sm border-t">
          © {new Date().getFullYear()} Mentor AI. All rights reserved.
        </footer>
      </body>
    </html>
  );
}
