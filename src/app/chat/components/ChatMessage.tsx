import Avatar from "./Avatar";

interface ChatMessageProps {
  sender: "user" | "assistant";
  text: string;
  timestamp: number;
}

export default function ChatMessage({ sender, text, timestamp }: ChatMessageProps) {
  const isUser = sender === "user";

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
  <div className={`mb-4 flex items-end ${isUser ? "justify-end" : "justify-start"}`}>
    {!isUser && <Avatar sender="assistant" />}

    <div className={`mx-2 max-w-[80%] flex flex-col ${isUser ? "items-end" : "items-start"}`}>
      <div
        className={`px-4 py-2 rounded-2xl whitespace-pre-wrap shadow-soft ${
          isUser
            ? "bg-primary text-white rounded-br-none"
            : "bg-white text-text border rounded-bl-none"
        }`}
      >
        {text}
      </div>
      <p className="text-[0.7rem] text-muted mt-1">{relativeTime}</p>
    </div>

    {isUser && <Avatar sender="user" />}
  </div>
);
}

