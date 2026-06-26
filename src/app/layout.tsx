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
  title: "GenLayer | Decentralized AI-Powered Intelligent Contracts",
  description: "Build the future with GenLayer. A complete decentralized application powered by AI-driven Intelligent Contracts, enabling autonomous, transparent, and trustless decision-making.",
  keywords: "GenLayer, Intelligent Contracts, Decentralized AI, Web3, Blockchain, AI Consensus, AI Oracle, Smart Contracts",
  authors: [{ name: "GenLayer Team" }],
  openGraph: {
    title: "GenLayer | Decentralized AI-Powered Intelligent Contracts",
    description: "Autonomous, transparent, and trustless decision-making powered by AI-driven Intelligent Contracts.",
    type: "website",
    locale: "en_US",
  },
  twitter: {
    card: "summary_large_image",
    title: "GenLayer | Decentralized AI-Powered Intelligent Contracts",
    description: "Autonomous, transparent, and trustless decision-making powered by AI-driven Intelligent Contracts.",
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
