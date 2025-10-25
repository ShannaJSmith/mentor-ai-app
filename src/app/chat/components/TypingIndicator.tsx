export default function TypingIndicator() {
  return (
    <div className="flex items-center gap-2 text-muted text-sm px-4 py-2">
      <div className="flex gap-1">
        <span className="w-2 h-2 bg-primary rounded-full animate-typing-dot"></span>
        <span className="w-2 h-2 bg-primary rounded-full animate-typing-dot delay-200"></span>
        <span className="w-2 h-2 bg-primary rounded-full animate-typing-dot delay-400"></span>
      </div>
      <span>Mentor AI is typing...</span>
    </div>
  );
}
