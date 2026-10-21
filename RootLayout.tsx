import React from 'react';
import Header from '@/components/layout/Header';
import Footer from '@/components/layout/Footer';
import { getCurrentUser } from '@/lib/auth';

interface RootLayoutProps {
  children: React.ReactNode;
}

export default async function RootLayout({ children }: RootLayoutProps) {
  const user = await getCurrentUser();
  const isAuthenticated = !!user;
  const userEmail = user?.email;

  return (
    <div className="flex flex-col min-h-screen bg-white">
      <Header isAuthenticated={isAuthenticated} userEmail={userEmail} />
      <main className="flex-1">{children}</main>
      <Footer />
    </div>
  );
}
