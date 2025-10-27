import { Bot, User } from "lucide-react";

interface AvatarProps {
  sender: "user" | "assistant";
}

export default function Avatar({ sender }: AvatarProps) {
  const isUser = sender === "user";
  
  const Icon = isUser ? User : Bot;
  const bgColor = isUser ? "bg-primary" : "bg-accent";

  return (
    <div className={`w-9 h-9 rounded-full flex items-center justify-center text-white ${bgColor}`}>
      <Icon size={30} />
    </div>
  );
}
