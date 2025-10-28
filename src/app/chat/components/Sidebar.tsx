"use client";

export default function Sidebar() {
  return (
    <div
      className="w-64 h-screen p-4 flex flex-col
                 bg-white/30 backdrop-blur-lg
                 border-r border-white/20 shadow-lg"
    >
      <div className="flex justify-between items-center mb-4">
        <h2 className="text-text font-semibold">Chats</h2>
        <button
          className="px-3 py-1 rounded-lg bg-primary text-white text-sm hover:opacity-90"
          type="button"
        >
          + New Chat
        </button>
      </div>

      <nav className="flex-1 overflow-y-auto space-y-2">
        <div className="p-3 rounded-xl bg-white/50 text-text">Chat 1</div>
        <div className="p-3 rounded-xl bg-white/50 text-text">Chat 2</div>
        <div className="p-3 rounded-xl bg-white/50 text-text">Chat 3</div>
      </nav>
    </div>
  );
}
