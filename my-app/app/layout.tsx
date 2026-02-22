import type { Metadata } from "next";
import { Quicksand } from "next/font/google";
import Navigation from "./components/Navigation";
import ChatBotClient from "./components/ChatBotClient";
import "./globals.css";

const quicksand = Quicksand({
  subsets: ["latin"],
  weight: ["400", "500", "600", "700"],
  variable: "--font-quicksand",
});

export const metadata: Metadata = {
  title: "My Website",
  description: "A basic website layout with multiple pages",
};

export default function RootLayout({
  children,
}: Readonly<{ children: React.ReactNode }>) {
  return (
    <html lang="en">
      <body
        style={{ backgroundColor: "#F1F3E0" }}
        className={`${quicksand.className} ${quicksand.variable} antialiased`}
      >
        <Navigation />
        {children}
        <ChatBotClient />
      </body>
    </html>
  );
}
