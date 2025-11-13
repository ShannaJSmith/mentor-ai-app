import Avatar from "./Avatar";
import { useState } from "react";

interface ChatMessageProps {
  sender: "user" | "model";
  text: string;
  timestamp: number;
  onEdit?: (timestamp: number, newText: string) => void;
  onDelete?: (timestamp: number) => void;
}

export default function ChatMessage({
  sender,
  text,
  timestamp,
  onEdit,
  onDelete,
}: ChatMessageProps) {
  const isUser = sender === "user";
  const [isEditing, setIsEditing] = useState(false);
  const [draft, setDraft] = useState(text);

  const formatRelativeTime = (timestamp: number): string => {
    const diff = Date.now() - timestamp;
    const seconds = Math.floor(diff / 1000);
    const minutes = Math.floor(seconds / 60);
    const hours = Math.floor(minutes / 60);
    const days = Math.floor(hours / 24);

    if (seconds < 60) return "Just now";
    if (minutes < 60) return `${minutes} min ago`;
    if (hours < 24) return `${hours} hr ago`;
    return `${days} day${days > 1 ? "s" : ""} ago`;
  };

  const relativeTime = formatRelativeTime(timestamp);

  return (
    <div
      className={`group mb-4 flex items-end ${
        isUser ? "justify-end" : "justify-start"
      }`}
    >
      {!isUser && <Avatar sender="model" />}

      <div
        className={`mx-2 max-w-[80%] flex flex-col ${
          isUser ? "items-end" : "items-start"
        }`}
      >
        <div
          className={`relative px-4 py-2 rounded-2xl whitespace-pre-wrap shadow-soft ${
            isUser
              ? "bg-primary text-white rounded-br-none"
              : "bg-white text-text border rounded-bl-none"
          }`}
        >
          {/* Editable message area */}
          {isEditing ? (
            <textarea
              className="w-full bg-transparent border-none resize-none focus:outline-none"
              value={draft}
              onChange={(e) => setDraft(e.target.value)}
              onBlur={() => {
                setIsEditing(false);
                if (draft !== text && onEdit) onEdit(timestamp, draft);
              }}
              autoFocus
            />
          ) : (
            text
          )}

          {/* Hover buttons for user messages */}
          {isUser && (
            <div className="absolute mt-2 gap-3 opacity-0 transition-opacity group-hover:opacity-100">
              <button
                aria-label="Edit message"
                onClick={() => setIsEditing(true)}
                className="text-gray-400 hover:text-white"
              >
                ✏️
              </button>
              <button
                aria-label="Delete message"
                onClick={() => onDelete?.(timestamp)}
                className="text-gray-400 hover:text-red-400"
              >
                🗑️
              </button>
            </div>
          )}
        </div>

        <p className="text-[0.7rem] text-muted mt-1">{relativeTime}</p>
      </div>

      {isUser && <Avatar sender="user" />}
    </div>
  );
}
