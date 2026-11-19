import type { Metadata } from 'next';
import './globals.css';
import { Navbar } from '@/components/Navbar';
import { Footer } from '@/components/Footer';
import { AuthProvider } from '@/context/AuthContext';

export const metadata: Metadata = {
  title: 'Portal del Aspirante | MES - Educación Superior',
  description: 'Portal oficial de consulta y solicitud de carreras universitarias en Cuba',
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="es" className="h-full">
      <body className="flex min-h-full flex-col bg-[#f6f8fb] text-slate-800 antialiased">
        <AuthProvider>
          <Navbar />
          <main className="flex-1">{children}</main>
          <Footer />
        </AuthProvider>
      </body>
    </html>
  );
}