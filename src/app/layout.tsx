import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "Mentor AI App",
  description: "AI-powered mentorship platform",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body className="bg-gray-100 text-gray-900 min-h-screen">
        {children}
      </body>
    </html>
  );
}
