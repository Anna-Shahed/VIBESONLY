import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "Vibes Only // Interactive Space",
  description: "What does the internet feel like to you?",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <body className="min-h-screen antialiased">
        {children}
      </body>
    </html>
  );
}
