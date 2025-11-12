
import { Inter, Noto_Sans, IBM_Plex_Sans, IBM_Plex_Mono, Courier_Prime, Roboto_Mono } from 'next/font/google'
import localFont from 'next/font/local'


export const inter = Inter({
  subsets: ['latin'],
  variable: '--font-sans',
  display: 'swap',
})


export const notoSans = Noto_Sans({
  subsets: ['latin'],
  variable: '--font-sans-alt',
  display: 'swap',
})


export const plexSans = IBM_Plex_Sans({
  subsets: ['latin'],
  variable: '--font-sans-plex',
  display: 'swap',
})


export const plexMono = IBM_Plex_Mono({
  subsets: ['latin'],
  variable: '--font-mono-plex',
  weight: ['400', '500', '600', '700'],
  display: 'swap',
})


export const courierPrime = Courier_Prime({
  subsets: ['latin'],
  variable: '--font-doc', 
  weight: ['400', '700'],
  display: 'swap',
})


export const robotoMono = Roboto_Mono({
  subsets: ['latin'],
  variable: '--font-mono',
  weight: ['400', '500', '700'],
  display: 'swap',
})


