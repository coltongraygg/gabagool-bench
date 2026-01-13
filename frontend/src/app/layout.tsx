import type { Metadata } from "next";
import { Oswald, Crimson_Text, JetBrains_Mono } from "next/font/google";
import { Analytics } from "@vercel/analytics/next";
import "./globals.css";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";

const oswald = Oswald({
  variable: "--font-display",
  subsets: ["latin"],
  weight: ["400", "500", "600", "700"],
});

const crimson = Crimson_Text({
  variable: "--font-body",
  subsets: ["latin"],
  weight: ["400", "600"],
  style: ["normal", "italic"],
});

const jetbrains = JetBrains_Mono({
  variable: "--font-mono",
  subsets: ["latin"],
  weight: ["400", "500"],
});

export const metadata: Metadata = {
  title: "Gabagool Bench - AI Benchmarks, Sopranos Style",
  description: "What kind of boss is your LLM? 40+ models. 16 Sopranos scenarios. No weaseling out. Find out if your AI orders hits or calls sitdowns.",
  keywords: ["LLM", "benchmark", "AI", "Sopranos", "tool calling", "Claude", "GPT", "Gemini", "model comparison"],
  authors: [{ name: "coltongraygg", url: "https://graycoding.dev" }],
  creator: "coltongraygg",
  icons: {
    icon: "/favicon.svg",
  },
  openGraph: {
    title: "Gabagool Bench - AI Benchmarks, Sopranos Style",
    description: "What kind of boss is your LLM? 40+ models. 16 Sopranos scenarios. No weaseling out.",
    url: "https://gabagool-bench.vercel.app",
    siteName: "Gabagool Bench",
    locale: "en_US",
    type: "website",
    images: [
      {
        url: "https://gabagool-bench.vercel.app/og-image.jpg?v=2",
        width: 1200,
        height: 630,
        alt: "Gabagool Bench - AI Benchmarks, Sopranos Style",
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    title: "Gabagool Bench - AI Benchmarks, Sopranos Style",
    description: "What kind of boss is your LLM? 40+ models. 16 Sopranos scenarios. No weaseling out.",
    creator: "@coltongraygg",
    images: ["https://gabagool-bench.vercel.app/og-image.jpg?v=2"],
  },
  robots: {
    index: true,
    follow: true,
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" className="dark">
      <body
        className={`${oswald.variable} ${crimson.variable} ${jetbrains.variable} antialiased`}
      >
        <Navbar />
        {children}
        <Footer />
        <Analytics />
      </body>
    </html>
  );
}
