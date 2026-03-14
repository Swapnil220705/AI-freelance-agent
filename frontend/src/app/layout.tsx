import type { Metadata } from "next";
import { Navbar } from "@/components/Navbar";
import { Sidebar } from "@/components/Sidebar";
import { CustomCursor } from "@/components/CustomCursor";
import "./globals.css";

export const metadata: Metadata = {
  title: "OrbitFlow | System Terminal",
  description: "Advanced autonomous project management interface powered by AI agents.",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" className="dark">
      <body className="antialiased min-h-screen flex flex-col font-body bg-base text-foreground selection:bg-accent/30 overflow-x-hidden">
        <div className="noise-bg" />
        <CustomCursor />
        
        <Navbar />
        <div className="flex flex-1 overflow-hidden relative z-10">
          <Sidebar />
          <main className="flex-1 overflow-y-auto w-full relative">
            {children}
          </main>
        </div>
      </body>
    </html>
  );
}
