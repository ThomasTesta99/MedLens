import type { Metadata } from "next";
import "./globals.css";
import { plexSans, plexMono } from "@/fonts";
import Providers from "@/components/Providers";

export const metadata: Metadata = {
  title: "Medlens",
  description: "A web application designed to simplify your medical documents.",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body className={`${plexSans.variable} ${plexMono.variable} font-sans antialiased min-h-dvh bg-fixed bg-gradient-to-br from-slate-950 via-slate-900 to-black text-white`}>
        <Providers />
        {children}
      </body>
    </html>
  );
}
