import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";
import Navbar from "@/components/custom/Navbar";
import Footer from "@/components/custom/Footer";
import { Toaster } from "@/components/ui/sonner";
import jwt from "jsonwebtoken";
import { cookies } from "next/headers";
import { UserInfo } from "@/shared/interface";

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

const JWT_SECRET = process.env.JWT_SECRET || "";

export default async function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  const token = (await cookies()).get("token")?.value;
  let user: UserInfo | null = null;

  if (token) {
    try {
      const decoded = jwt.verify(token, JWT_SECRET);
      if (typeof decoded === "object" && decoded != null) {
        user = decoded as UserInfo;
      }
    } catch {
      user = null;
    }
  }
  return (
    <html lang="en" className="dark">
      <body
        className={`${geistSans.variable} ${geistMono.variable} antialiased flex flex-col min-h-screen gap-4`}
      >
        <header className="border-b sticky top-0 backdrop-blur-lg shadow-lg bg-background/50">
          <Navbar initialUser={user} />
        </header>
        <main className="flex-1 max-w-[1280px] md:mx-auto px-4">
          {children}
        </main>
        <Toaster richColors position="bottom-center" />
        <footer className="border-t px-4">
          <Footer />
        </footer>
      </body>
    </html>
  );
}
