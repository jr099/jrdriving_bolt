import type { Metadata } from 'next';
import { Navbar } from '../../components/navbar';
import { Footer } from '../../components/footer';
import { ChatBot } from '../../components/chat-bot';

export const metadata: Metadata = {
  title: 'jrdriving - Convoyage de véhicules',
};

export default function PublicLayout({ children }: { children: React.ReactNode }) {
  return (
    <div className="flex min-h-screen flex-col">
      <Navbar />
      <main className="flex-1">{children}</main>
      <Footer />
      <ChatBot />
    </div>
  );
}
