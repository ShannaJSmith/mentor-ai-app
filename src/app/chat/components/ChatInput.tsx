"use client";
import { useRef } from "react";

interface ChatInputProps {
  input: string;
  setInput: (value: string) => void;
  onSend: () => void;
}

export default function ChatInput({ input, setInput, onSend }: ChatInputProps) {
  const textareaRef = useRef<HTMLTextAreaElement | null>(null);

  const handleInputChange = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
    const target = e.target;
    setInput(target.value);
    target.style.height = "auto";
    target.style.height = `${target.scrollHeight}px`;
  };

  const handleKeyDown = (e: React.KeyboardEvent<HTMLTextAreaElement>) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      onSend();

      if (textareaRef.current) {
        textareaRef.current.style.height = "auto";
      }
    }
  };

  return (
    <div className="bg-surface p-3 border-t flex gap-2 items-end">
      <textarea
        ref={textareaRef}
        className="flex-1 p-2 border rounded-xl focus:outline-none resize-none overflow-y-auto max-h-20 leading-6"
        value={input}
        onChange={handleInputChange}
        onKeyDown={handleKeyDown}
        placeholder="Type your message..."
        rows={1}
      />
      <button
        className={`px-4 py-2 rounded-xl shadow-soft transition ${
          input.trim()
            ? "bg-primary text-surface hover:opacity-90"
            : "bg-primary text-surface opacity-50 cursor-not-allowed"
        }`}
        onClick={onSend}
        disabled={!input.trim()}
      >
        Send
      </button>
    </div>
  );
}
