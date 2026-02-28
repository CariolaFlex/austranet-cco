import type { Metadata } from 'next';
import { Inter } from 'next/font/google';
import './globals.css';
import { AuthProvider } from '@/contexts/AuthContext';
import { ConfiguracionProvider } from '@/contexts/ConfiguracionContext';
import { ToastProvider } from '@/components/ui/toast';

const inter = Inter({ subsets: ['latin'], variable: '--font-inter' });

export const metadata: Metadata = {
  title: 'Austranet CCO - Gestión de Proyectos de Software',
  description: 'Sistema profesional de gestión de clientes, proveedores y proyectos de software',
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="es" suppressHydrationWarning>
      <body className={inter.className}>
        <AuthProvider>
          <ConfiguracionProvider>
            <ToastProvider>
              {children}
            </ToastProvider>
          </ConfiguracionProvider>
        </AuthProvider>
      </body>
    </html>
  );
}
