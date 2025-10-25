export default function TypingIndicator() {
  return (
    <div className="flex items-center gap-2 text-muted text-sm px-4 py-2">
      <div className="flex gap-1">
        <span className="w-2 h-2 bg-muted rounded-full animate-pulse"></span>
        <span className="w-2 h-2 bg-muted rounded-full animate-pulse delay-150"></span>
        <span className="w-2 h-2 bg-muted rounded-full animate-pulse delay-300"></span>
      </div>
      <span>Mentor AI is typing...</span>
    </div>
  );
}
