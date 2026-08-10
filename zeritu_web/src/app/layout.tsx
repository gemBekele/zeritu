import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import { Montserrat, Playfair_Display, Viaoda_Libre } from "next/font/google";
import localFont from "next/font/local";
import "./globals.css";
import { LayoutWrapper } from "@/components/layout-wrapper";
import { CartProvider } from "@/context/cart-context";
import { QueryProvider } from "@/providers/query-provider";
import { ErrorBoundary } from "@/components/error-boundary";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

const playfair = Playfair_Display({
  variable: "--font-playfair",
  subsets: ["latin"],
  weight: ["400", "500", "600", "700", "800", "900"],
  style: ["normal", "italic"],
});

const montserrat = Montserrat({
  variable: "--font-montserrat",
  subsets: ["latin"],
  weight: ["400", "500", "600", "700", "800", "900"],
});

const viaoda = Viaoda_Libre({
  variable: "--font-viaoda",
  weight: "400",
  subsets: ["latin"],
});

const cronde = localFont({
  src: "../../assets/fonts/CRONDE.otf",
  variable: "--font-cronde",
});

export const metadata: Metadata = {
  title: "Zeritu Kebede — Singer, Songwriter, Author",
  description: "Official website of Zeritu Kebede. Discover her music, books, upcoming events, and inspiring stories. Ethiopian gospel artist, songwriter, actress, and philanthropist.",
  keywords: ["Zeritu Kebede", "Ethiopian music", "gospel", "singer", "songwriter", "author", "Ethiopian artist"],
  openGraph: {
    title: "Zeritu Kebede — Official Website",
    description: "Discover music, books, events, and inspiring stories from Zeritu Kebede.",
    type: "website",
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" className="scroll-smooth">
      <body
        className={`${geistSans.variable} ${geistMono.variable} ${playfair.variable} ${montserrat.variable} ${viaoda.variable} ${cronde.variable} antialiased bg-background text-foreground`}
      >
        <ErrorBoundary>
          <QueryProvider>
            <CartProvider>
              <LayoutWrapper>{children}</LayoutWrapper>
            </CartProvider>
          </QueryProvider>
        </ErrorBoundary>
      </body>
    </html>
  );
}
