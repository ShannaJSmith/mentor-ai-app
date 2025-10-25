interface ChatMessageProps {
  sender: "user" | "ai";
  text: string;
}

export default function ChatMessage({ sender, text }: ChatMessageProps) {
  const isUser = sender === "user";

  return (
    <div className={`flex ${isUser ? "justify-end" : "justify-start"}`}>
      <div
        className={`px-4 py-2 rounded-2xl max-w-[80%] shadow-soft ${
          isUser
            ? "bg-primary text-surface rounded-br-none"
            : "bg-surface text-text border rounded-bl-none"
        }`}
      >
        {text}
      </div>
    </div>
  );
}
