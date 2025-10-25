import Avatar from "./Avatar";

export default function LoadingBubble() {
  return (
    <div className="flex items-end justify-start mb-4 p-4">
        <Avatar sender="ai" />
      <div className="mx-2 max-w-[80%] h-16 flex flex-col items-start">
        <div className="px-4 py-2 rounded-2xl bg-surface border shadow-soft rounded-bl-none animate-pulse">
          <div className="h-3 w-24 bg-accent rounded mb-2"></div>
          <div className="h-3 w-16 bg-accent rounded"></div>
        </div>
      </div>
    </div>
  );
}