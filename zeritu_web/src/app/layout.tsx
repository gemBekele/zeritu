import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import localFont from "next/font/local";
import "./globals.css";
import { LayoutWrapper } from "@/components/layout-wrapper";
import { CartProvider } from "@/context/cart-context";
import { QueryProvider } from "@/providers/query-provider";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

const cronde = localFont({
  src: "../../assets/fonts/CRONDE.otf",
  variable: "--font-cronde",
});

export const metadata: Metadata = {
  title: "Zeritu Kebede - Official Website",
  description: "Official website of Zeritu Kebede. Music, Books, Events, and more.",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" className="scroll-smooth">
      <body
        className={`${geistSans.variable} ${geistMono.variable} ${cronde.variable} antialiased bg-background text-foreground`}
      >
        <QueryProvider>
          <CartProvider>
            <LayoutWrapper>{children}</LayoutWrapper>
          </CartProvider>
        </QueryProvider>
      </body>
    </html>
  );
}
