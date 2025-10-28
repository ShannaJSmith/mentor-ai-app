"use client";
import "./globals.css";
import { useState } from "react";
import Sidebar from "./chat/components/Sidebar";

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);
  return (
    <html lang="en">
      <body className="bg-grey text-text min-h-screen flex flex-col">
        <header className="bg-primary text-white p-4 shadow-md">
          <nav className="flex items-center justify-between">
             <div className="flex items-center gap-4">
              {/* Mobile Sidebar Toggle Button */}
              <button
                className="lg:hidden p-2 rounded bg-white/20 hover:bg-white/30"
                onClick={() => setIsSidebarOpen(true)}
              >
                ☰
              </button>
            <h1 className="text-xl font-bold">Mentor AI</h1>
            </div>
            <button className="bg-accent text-white px-3 py-1 rounded-lg text-sm shadow-soft">
              Login
            </button>
          </nav>
        </header>
        <div className="flex flex-grow">
        {/* Mobile overlay */}
        {isSidebarOpen && (
          <div
            className="fixed inset-0 z-40 lg:hidden"
            onClick={() => setIsSidebarOpen(false)}
            >
          </div>
        )}
          <Sidebar isOpen={isSidebarOpen} />
          <main className="flex-grow">{children}</main>
        </div>
        <footer className="bg-white text-muted text-center py-4 text-sm border-t">
          © {new Date().getFullYear()} Mentor AI. All rights reserved.
        </footer>
      </body>
    </html>
  );
}
