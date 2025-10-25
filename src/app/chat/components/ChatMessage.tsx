interface ChatMessageProps {
  sender: "user" | "ai";
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
    <div className={`mb-4 ${isUser ? "text-right" : "text-left"}`}>
      <div
        className={`px-4 py-2 rounded-2xl inline-block max-w-[80%] shadow-soft ${
          isUser
            ? "bg-primary text-surface rounded-br-none"
            : "bg-surface text-text border rounded-bl-none"
        }`}
      >
        {text}
      </div>
      <p className="text-[0.7rem] text-muted mt-1">
        {relativeTime}
      </p>
    </div>
  );
}
