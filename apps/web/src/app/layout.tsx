import type { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Portal del Aspirante - SIGIES',
  description: 'Portal de solicitud de carreras para la Educación Superior',
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="es">
      <body style={{ fontFamily: 'system-ui, sans-serif', margin: 0, padding: '2rem' }}>
        {children}
      </body>
    </html>
  );
}