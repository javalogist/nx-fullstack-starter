import './global.css';
import { Inter, JetBrains_Mono } from 'next/font/google';
import React from 'react';
import { ThemeProvider, ThemeToggle } from '@nx-fullstack-starter/frontend/client';
import { Providers } from '@nx-fullstack-starter/frontend/client';

const inter = Inter({
  subsets: ['latin'],
  variable: '--font-inter',
});

const jetbrainsMono = JetBrains_Mono({
  subsets: ['latin'],
  variable: '--font-jetbrains-mono',
});

export default function RootLayout({
                                     children,
                                   }: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" suppressHydrationWarning={true}>
    <body
      className={`${inter.variable} ${jetbrainsMono.variable} min-h-screen flex flex-col`}
    >
    <ThemeProvider
      attribute="class"
      defaultTheme="system"
      enableSystem
      disableTransitionOnChange
    >
      <Providers>{children}</Providers>
    </ThemeProvider>
    </body>
    </html>
  );
}
