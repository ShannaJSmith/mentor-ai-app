"use client";

interface SidebarProps {
  isOpen: boolean;
  onClose: () => void;
}

export default function Sidebar({ isOpen, onClose }: SidebarProps) {
  return (
    <div
      className={`
        fixed inset-y-0 left-0 z-50 w-64 p-4 flex flex-col
        bg-grey/30 backdrop-blur-lg border-r border-black/20 shadow-lg
        transform transition-transform duration-300
        ${isOpen ? "translate-x-0" : "-translate-x-full"}
        lg:translate-x-0 lg:static lg:h-screen
      `}
    >
      {/* Close button on mobile */}
      <button
        className="lg:hidden mb-4 text-white p-1 self-end"
        onClick={onClose}
      >
        ✕
      </button>

      <div className="flex justify-between items-center mb-4">
        <h2 className="text-text font-semibold">Chats</h2>
        <button className="px-3 py-1 rounded-lg bg-primary text-white text-sm hover:opacity-90">
          + New Chat
        </button>
      </div>

      <nav className="flex-1 overflow-y-auto space-y-2">
        {/* Placeholder chats for now */}
        <div className="p-3 rounded-xl bg-white/50 text-text">Chat 1</div>
        <div className="p-3 rounded-xl bg-white/50 text-text">Chat 2</div>
        <div className="p-3 rounded-xl bg-white/50 text-text">Chat 3</div>
      </nav>
    </div>
  );
}