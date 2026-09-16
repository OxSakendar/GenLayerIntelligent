import type { Metadata } from "next";
import { Inter, Plus_Jakarta_Sans } from "next/font/google";
import "./globals.css";

const inter = Inter({
  variable: "--font-inter",
  subsets: ["latin"],
  display: "swap",
});

const plusJakarta = Plus_Jakarta_Sans({
  variable: "--font-plus-jakarta",
  subsets: ["latin"],
  display: "swap",
});

export const metadata: Metadata = {
  metadataBase: new URL("https://genlayersmartescrow.vercel.app"),
  title: "SmartEscrow — AI-Powered Decentralized Escrow",
  description: "SmartEscrow is an AI-powered decentralized escrow system that uses GenLayer consensus to resolve buyer-seller disputes.",
  keywords: "SmartEscrow, GenLayer, Intelligent Contracts, Decentralized Escrow, AI Dispute Resolution, Web3, Blockchain, AI Consensus",
  authors: [{ name: "Sakendar — Developer / Builder" }],
  icons: {
    icon: [
      { url: "/favicon.png", type: "image/png" },
      { url: "/icon.png", type: "image/png" },
    ],
    shortcut: "/favicon.png",
    apple: "/icon.png",
  },
  openGraph: {
    title: "SmartEscrow — Decentralized AI Dispute Resolution",
    description: "SmartEscrow is an AI-powered decentralized escrow system that uses GenLayer consensus to resolve buyer-seller disputes.",
    url: "https://genlayersmartescrow.vercel.app/",
    siteName: "SmartEscrow",
    images: [
      {
        url: "/icon.png",
        width: 512,
        height: 512,
        alt: "SmartEscrow Icon",
      },
    ],
    type: "website",
    locale: "en_US",
  },
  twitter: {
    card: "summary_large_image",
    title: "SmartEscrow — Decentralized AI Dispute Resolution",
    description: "SmartEscrow is an AI-powered decentralized escrow system that uses GenLayer consensus to resolve buyer-seller disputes.",
    images: ["/icon.png"],
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html
      lang="en"
      className={`${inter.variable} ${plusJakarta.variable} h-full antialiased scroll-smooth`}
    >
      <body className="min-h-full flex flex-col font-sans bg-dark-bg text-gray-100 selection:bg-primary/30 selection:text-primary-foreground">
        {children}
      </body>
    </html>
  );
}
