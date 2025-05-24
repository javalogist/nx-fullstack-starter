import { JetBrains_Mono, Work_Sans } from 'next/font/google';

// Load fonts with specific weights
export const jetbrainsMono = JetBrains_Mono({
  subsets: ['latin'],
  weight: ['400', '700'], // Only load needed weights
  variable: '--font-jetbrains-mono', // Define a CSS variable
  display: 'swap',
});

export const workSans = Work_Sans({
  subsets: ['latin'],
  weight: ['300', '400', '700'], // Adjust based on usage
  variable: '--font-work-sans',
  display: 'swap',
});
