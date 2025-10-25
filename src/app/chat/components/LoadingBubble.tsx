export default function LoadingBubble() {
  return (
    <div className="flex justify-start mb-3 p-4">
      <div className="px-4 py-3 rounded-2xl max-w-[80%] bg-surface border shadow-soft rounded-bl-none animate-pulse">
        <div className="h-3 w-24 bg-primary rounded mb-2"></div>
        <div className="h-3 w-16 bg-primary rounded"></div>
      </div>
    </div>
  );
}
