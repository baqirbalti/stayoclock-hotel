import { ReactNode } from "react";
import { Navbar } from "./Navbar";
import { Footer } from "./Footer";
import { AiChatWidget } from "../chat/AiChatWidget";

interface AppLayoutProps {
  children: ReactNode;
}

export function AppLayout({ children }: AppLayoutProps) {
  return (
    <div className="min-h-screen flex flex-col relative">
      <div 
        className="fixed inset-0 z-[-1] opacity-[0.03] pointer-events-none" 
        style={{ backgroundImage: `url(${import.meta.env.BASE_URL}images/hero-pattern.png)`, backgroundSize: 'cover' }}
      />
      <Navbar />
      <main className="flex-1 flex flex-col">
        {children}
      </main>
      <Footer />
      <AiChatWidget />
    </div>
  );
}
