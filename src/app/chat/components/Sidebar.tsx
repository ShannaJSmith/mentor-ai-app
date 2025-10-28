"use client";

interface SidebarProps {
  isOpen: boolean;         // for mobile drawer
  isCollapsed: boolean;    // for desktop collapse
  onToggleCollapse: () => void;
}

export default function Sidebar({ isOpen, isCollapsed, onToggleCollapse }: SidebarProps) {
  return (
    <div className="relative">
      <div
        className={`
          fixed inset-y-0 left-0 z-50 lg:static
          ${isCollapsed ? "max-w-0" : "w-64"}
          h-screen flex flex-col overflow-hidden
          bg-grey/30 backdrop-blur-lg border-r border-black/20 shadow-lg
          transform transition-all duration-300
          ${isOpen ? "" : "-translate-x-full"}
          lg:translate-x-0
        `}
      >
        {!isCollapsed && (
          <div className="p-4 flex flex-col h-full">
            <div className="flex justify-between items-center mb-6">
              <h2 className="text-text font-semibold">Chats</h2>
              <button
                className="px-3 py-1 rounded-lg bg-primary text-white text-sm hover:opacity-90"
                type="button"
              >
                + New Chat
              </button>
            </div>

            <nav className="flex-1 overflow-y-auto space-y-2">
              <div className="p-3 bg-white/50 text-text rounded-xl cursor-pointer hover:bg-white/70 transition">
                Chat 1
              </div>
              <div className="p-3 bg-white/50 text-text rounded-xl cursor-pointer hover:bg-white/70 transition">
                Chat 2
              </div>
              <div className="p-3 bg-white/50 text-text rounded-xl cursor-pointer hover:bg-white/70 transition">
                Chat 3
              </div>
            </nav>
          </div>
        )}
      </div>

      <button
        onClick={onToggleCollapse}
        className="
          hidden lg:flex absolute top-1/2 left-full transform -translate-y-1/2
          w-6 h-12 bg-white shadow-md rounded-r-lg
          items-center justify-center cursor-pointer transition
        "
        aria-label="Toggle Sidebar"
      >
        {isCollapsed ? "›" : "‹"}
      </button>
    </div>
  );
}
