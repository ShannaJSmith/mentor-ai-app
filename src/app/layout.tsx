import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "Mentor AI App",
  description: "AI-powered mentorship platform",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <body className="bg-background text-text min-h-screen flex flex-col">
        <header className="bg-primary text-surface p-4 shadow-md">
          <nav className="flex items-center justify-between">
            <h1 className="text-xl font-bold">Mentor AI</h1>
            <button className="bg-accent text-surface px-3 py-1 rounded-lg text-sm shadow-soft">
              Login
            </button>
          </nav>
        </header>
        <main className="flex-grow">{children}</main>
        <footer className="bg-surface text-muted text-center py-4 text-sm border-t">
          © {new Date().getFullYear()} Mentor AI. All rights reserved.
        </footer>
      </body>
    </html>
  );
}
