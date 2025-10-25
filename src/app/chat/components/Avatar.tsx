interface AvatarProps {
  sender: "user" | "ai";
}

export default function Avatar({ sender }: AvatarProps) {
  const isUser = sender === "user";

  // Customize these as you like
  const avatarText = isUser ? "U" : "AI";
  const bgColor = isUser ? "bg-primary" : "bg-accent";

  return (
    <div className={`w-8 h-8 rounded-full flex items-center justify-center text-surface font-bold ${bgColor}`}>
      {avatarText}
    </div>
  );
}
