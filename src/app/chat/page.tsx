"use client";
import { useState, useEffect, useRef } from "react";
import ChatMessage from "./components/ChatMessage";
import TypingIndicator from "./components/TypingIndicator";
import LoadingBubble from "./components/LoadingBubble";
import ChatInput from "./components/ChatInput";
import { useChat } from "@/context/ChatContext";

export default function ChatPage() {

  const { chats, activeChatId, sendMessage, isLoading, updateChatMessages } = useChat();
  // Helper to get the current active chat
  const activeChat = chats.find((chat) => chat.id === activeChatId);

  const [input, setInput] = useState("");
  const [isTyping, setIsTyping] = useState(false);
  // const [isLoadingAI, setIsLoadingAI] = useState(false);

  // Scroll to latest message
  const chatEndRef = useRef<HTMLDivElement | null>(null);
   useEffect(() => {
    chatEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [activeChat?.messages]);

  const handleSend = async () => {
    if (!input.trim() || !activeChat) return;

    setIsTyping(true);
    await sendMessage(input.trim());
    setIsTyping(false);
    setInput("");
  };

  // Clear chat function
  const handleClearChat = () => {
    if (!activeChat) return;

    // reuse an existing message sender (correct Sender type) if available,
    // otherwise fall back to a safe any-cast for the default sender
    const modelSender = activeChat.messages?.[0]?.sender ?? ("model" as any);

    const resetMessages = [
      {
        id: Date.now(),
        sender: modelSender,
        text: "Hello! I'm your Mentor AI. How can I help you today?",
        timestamp: Date.now(),
      },
    ];

    updateChatMessages(activeChat.id, resetMessages);
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

        {isLoading && <LoadingBubble />}
        {isTyping && <TypingIndicator />}

        <ChatInput 
          input={input} 
          setInput={setInput} 
          onSend={handleSend}
          isLoading={isLoading} 
        />
      </div>
    </div>
  );
}
