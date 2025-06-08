import React from 'react';
import './globals.css';
import Footer from './components/Footer';

export const metadata = {
  title: 'Hermosa Water District',
  description: 'Hermosa Water District Website',
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <body>
        <main>{children}</main>
        <Footer />
      </body>
    </html>
  );
} 