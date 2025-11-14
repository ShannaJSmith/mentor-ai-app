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
  const [showMobileMenu, setShowMobileMenu] = useState(false);

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

  let pressTimer: NodeJS.Timeout;

  const handleTouchStart = () => {
    pressTimer = setTimeout(() => setShowMobileMenu(true), 600); // long press
  };

  const handleTouchEnd = () => {
    clearTimeout(pressTimer);
  };

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
          onTouchStart={handleTouchStart}
          onTouchEnd={handleTouchEnd}
        >
          {/* Editable message area */}
          {isEditing ? (
            <div className="flex flex-col gap-2">
              <textarea
                className="w-full bg-transparent border-none resize-none focus:outline-none"
                value={draft}
                onChange={(e) => setDraft(e.target.value)}
                onKeyDown={(e) => {
                  if (e.key === "Escape") {
                    setDraft(text);
                    setIsEditing(false);
                  }
                }}
                autoFocus
              />

              <div className="flex gap-3 text-xs mt-1">
                <button
                  className="px-3 py-1 rounded bg-accent text-white hover:bg-primary/80"
                  aria-label="Save edited message"
                  onClick={() => {
                    setIsEditing(false);
                    if (draft !== text && onEdit) onEdit(timestamp, draft);
                  }}
                >
                  Send
                </button>

                <button
                  className="px-3 py-1 rounded bg-gray-200 text-gray-700 hover:bg-gray-300"
                  aria-label="Cancel editing"
                  onClick={() => {
                    setDraft(text); // revert
                    setIsEditing(false);
                  }}
                >
                  Cancel
                </button>
              </div>
            </div>
          ) : (
            text
          )}

          {/* DESKTOP HOVER BUTTONS */}
          {isUser && !showMobileMenu && (
            <div className="flex absolute mt-2 gap-3 opacity-0 transition-opacity group-hover:opacity-100">
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

          {/* MOBILE LONG PRESS MENU */}
          {showMobileMenu && isUser && (
            <>
              {/* Backdrop */}
              <div
                className="fixed inset-0 bg-black/30 z-40"
                onClick={() => setShowMobileMenu(false)}
              />

              {/* Dropdown menu */}
              <div className="absolute z-50 mt-2 p-2 rounded-lg bg-white shadow-lg text-sm text-black flex flex-col min-w-[140px]">
                <button
                  className="px-3 py-2 text-left hover:bg-gray-100"
                  onClick={() => {
                    setShowMobileMenu(false);
                    setIsEditing(true);
                  }}
                >
                  Edit
                </button>
                <div className="h-[1px] bg-gray-200 w-full" />
                <button
                  className="px-3 py-2 text-left hover:bg-gray-100"
                  onClick={() => {
                    setShowMobileMenu(false);
                    onDelete?.(timestamp);
                  }}
                >
                  Delete
                </button>
              </div>
            </>
          )}
        </div>

        <p className="text-[0.7rem] text-muted mt-1">{relativeTime}</p>
      </div>

      {isUser && <Avatar sender="user" />}
    </div>
  );
}
