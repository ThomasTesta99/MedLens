import { Inter, Public_Sans, Source_Serif_4, IBM_Plex_Sans, IBM_Plex_Mono } from 'next/font/google';

export const inter = Inter({ subsets: ['latin'], variable: '--font-sans', display: 'swap' });

export const publicSans = Public_Sans({ subsets: ['latin'], variable: '--font-sans', display: 'swap' });
export const sourceSerif = Source_Serif_4({ subsets: ['latin'], variable: '--font-serif', display: 'swap' });

export const plexSans = IBM_Plex_Sans({ subsets: ['latin'], variable: '--font-sans', display: 'swap' });
export const plexMono = IBM_Plex_Mono({
  subsets: ['latin'],
  weight: '400',
  variable: '--font-mono',
  display: 'swap',
});
