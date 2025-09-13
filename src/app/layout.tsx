import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";
import Navbar from "@/components/custom/Navbar";
import Footer from "@/components/custom/Footer";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "Next Play",
  description: "Find your next favourite game...",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" className="dark">
      <body
        className={`${geistSans.variable} ${geistMono.variable} antialiased flex flex-col min-h-screen gap-4`}
      >
        <header className="border-b sticky top-0 backdrop-blur-lg shadow-lg">
          <Navbar />
        </header>
        <main className="flex-1 max-w-[1280px] mx-auto px-4">
          {children}
        </main>
        <footer className="border-t px-4">
          <Footer />
        </footer>
      </body>
    </html>
  );
}
