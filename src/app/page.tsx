export default function Home() {
  return (
    <div className="flex flex-col items-center justify-center min-h-screen p-6 text-center">
      <h2 className="text-3xl font-bold mb-4 text-primary">Welcome to Mentor AI</h2>
      <p className="text-muted mb-6">
        Your personal AI mentor for guidance, learning, and growth.
      </p>
      <a
        href="/chat"
        className="bg-accent text-surface px-6 py-3 rounded-xl shadow-soft hover:opacity-90 transition"
      >
        Start Chatting
      </a>
    </div>
  );
}
