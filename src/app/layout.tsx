import type { Metadata } from 'next';
import { Inter } from 'next/font/google';
import { Toaster } from 'react-hot-toast';
import { AuthProvider } from '@/context/AuthContext';
import './globals.css';
import Header from '@/components/Header';
import Sidebar from '@/components/Sidebar';

const inter = Inter({ subsets: ['latin'] });

export const metadata: Metadata = {
  title: 'Learned Spare',
  description: 'Online learning platform for developers',
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <body className={inter.className}>
        <AuthProvider>
          <div className="min-h-screen bg-gray-900">
            <Header />
            <div className="pt-16">
              <Sidebar />
              <div className="ml-64 p-4">
                {children}
              </div>
            </div>
          </div>
          <Toaster position="top-right" />
        </AuthProvider>
      </body>
    </html>
  );
}
