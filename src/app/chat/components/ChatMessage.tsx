import Avatar from "./Avatar";
import { useState } from "react";
import { Copy, Share2 } from "lucide-react";

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
  const [mobileMenuType, setMobileMenuType] = useState<"user" | "model" | null>(
    null
  );

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

  const handleTouchStart = (sender: "user" | "model") => {
    pressTimer = setTimeout(() => {
      setMobileMenuType(sender);
      setShowMobileMenu(true);
    }, 600);
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
          onTouchStart={() => handleTouchStart(sender)}
          onTouchEnd={handleTouchEnd}
        >
          {/* Editable message area */}
          {isEditing ? (
            <div className="flex flex-col gap-2">
              <p className="text-xs text-accent font-medium mb-1">Editing…</p>
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
                  className="px-3 py-1 rounded bg-accent text-white hover:bg-accent/80"
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

          {sender === "model" && !showMobileMenu && !isEditing && (
            <div className="mt-2 text-xs text-gray-400 opacity-0 group-hover:opacity-100 transition-opacity hidden md:flex gap-4">
              <button
                onClick={() => navigator.clipboard.writeText(text)}
                className="hover:text-primary flex items-center gap-1"
              >
                <Copy className="w-3 h-3" /> Copy
              </button>

              <button
                onClick={() => {
                  const shareData = { title: "Mentor AI Response", text };
                  if (navigator.share) {
                    navigator.share(shareData).catch(() => {});
                  } else {
                    navigator.clipboard.writeText(text);
                  }
                }}
                className="hover:text-primary flex items-center gap-1"
              >
                <Share2 className="w-3 h-3" /> Share
              </button>
            </div>
          )}

          {/* MOBILE LONG-PRESS MENU FOR MODEL MESSAGES */}
          {showMobileMenu && mobileMenuType === "model" && (
            <>
              {/* Backdrop */}
              <div
                className="fixed inset-0 bg-black/30 z-40"
                onClick={() => {
                  setShowMobileMenu(false);
                  setMobileMenuType(null);
                }}
              />

              {/* Dropdown */}
              <div className="absolute z-50 mt-4 p-0 rounded-lg bg-white shadow-lg text-sm text-black flex flex-col min-w-[150px] overflow-hidden">
                <button
                  className="px-4 py-3 hover:bg-gray-100 flex items-center justify-between"
                  onClick={() => {
                    navigator.clipboard.writeText(text).catch(() => {});
                    setShowMobileMenu(false);
                    setMobileMenuType(null);
                  }}
                >
                  <span>Copy</span>
                  <Copy className="w-4 h-4 text-gray-600" />
                </button>

                <div className="h-[1px] bg-gray-200 w-full" />

                <button
                  className="px-4 py-3 hover:bg-gray-100 flex items-center justify-between"
                  onClick={() => {
                    const shareData = { title: "Mentor AI Response", text };

                    if (navigator.share)
                      navigator.share(shareData).catch(() => {});
                    else navigator.clipboard.writeText(text);

                    setShowMobileMenu(false);
                    setMobileMenuType(null);
                  }}
                >
                  <span>Share</span>
                  <Share2 className="w-4 h-4 text-gray-600" />
                </button>
              </div>
            </>
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
                  className="px-3 py-2 text-left hover:bg-gray-100 flex items-center justify-between"
                  onClick={() => {
                    setShowMobileMenu(false);
                    setIsEditing(true);
                  }}
                >
                  Edit <div className="w-4 h-4 text-gray-600">✏️</div>
                </button>
                {/* Divider */}
                <div className="h-[1px] bg-gray-200 w-full" />
                <button
                  className="px-3 py-2 text-left hover:bg-gray-100 flex items-center justify-between"
                  onClick={() => {
                    navigator.clipboard.writeText(text).catch(() => {});
                    setShowMobileMenu(false);
                  }}
                >
                  Copy
                  <Copy className="w-4 h-4 text-gray-600" />
                </button>

                <div className="h-[1px] bg-gray-200 w-full" />

                <button
                  className="px-3 py-2 text-left hover:bg-gray-100 flex items-center justify-between"
                  onClick={() => {
                    setShowMobileMenu(false);
                    onDelete?.(timestamp);
                  }}
                >
                  Delete <div className="w-4 h-4 text-gray-600">🗑️</div>
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
