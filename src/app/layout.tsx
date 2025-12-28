import type { Metadata } from 'next';
import { ThemeProvider } from '@/contexts/ThemeContext';
import { GameProvider } from '@/contexts/GameContext';
import './globals.css';

export const metadata: Metadata = {
  title: 'MindGames - Mental Math Training',
  description:
    'Practice mental math with customizable arithmetic chains. Improve your calculation speed and accuracy with interactive exercises.',
  keywords: [
    'math',
    'mental math',
    'arithmetic',
    'practice',
    'education',
    'learning',
    'calculator',
    'training',
  ],
  authors: [{ name: 'MindGames' }],
  openGraph: {
    title: 'MindGames - Mental Math Training',
    description:
      'Practice mental math with customizable arithmetic chains. Improve your calculation speed and accuracy.',
    type: 'website',
  },
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en" suppressHydrationWarning>
      <body className="min-h-screen">
        <ThemeProvider>
          <GameProvider>{children}</GameProvider>
        </ThemeProvider>
      </body>
    </html>
  );
}
