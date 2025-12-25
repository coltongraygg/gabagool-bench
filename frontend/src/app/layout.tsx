import type { Metadata } from "next";
import { Oswald, Crimson_Text, JetBrains_Mono } from "next/font/google";
import "./globals.css";

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
  title: "Gabagool Bench - LLM Mob Psychology",
  description: "What kind of boss is your LLM? 40+ models. 12 Sopranos scenarios. No weaseling out. Find out if your AI orders hits or calls sitdowns.",
  keywords: ["LLM", "benchmark", "AI", "Sopranos", "tool calling", "Claude", "GPT", "Gemini", "model comparison"],
  authors: [{ name: "coltongraygg", url: "https://graycoding.dev" }],
  creator: "coltongraygg",
  icons: {
    icon: "/favicon.ico",
  },
  openGraph: {
    title: "Gabagool Bench - LLM Mob Psychology",
    description: "What kind of boss is your LLM? 40+ models. 12 Sopranos scenarios. No weaseling out.",
    url: "https://gabagool.vercel.app",
    siteName: "Gabagool Bench",
    locale: "en_US",
    type: "website",
  },
  twitter: {
    card: "summary_large_image",
    title: "Gabagool Bench - LLM Mob Psychology",
    description: "What kind of boss is your LLM? 40+ models. 12 Sopranos scenarios. No weaseling out.",
    creator: "@coltongraygg",
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
        <div className="noise-overlay" />
        {children}
      </body>
    </html>
  );
}
