import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";
import Image from "next/image";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "Web3 Assets API | Tomo",
  description:
    "A minimal Web3 resource management API for static configurations of chains, wallets, and tokens, built with Next.js and ready for Cloudflare Workers.",
  applicationName: "Web3 Assets API",
  keywords: [
    "Web3",
    "blockchain",
    "chains",
    "wallets",
    "tokens",
    "CAIP-2",
    "Next.js",
    "Cloudflare Workers",
  ],
  authors: [{ name: "Tomo" }],
  icons: {
    icon: "/favicon.svg",
  },
  openGraph: {
    title: "Web3 Assets API",
    description:
      "Explore static configurations for chains, wallets, and tokens via simple JSON APIs.",
    url: "/",
    siteName: "Web3 Assets API",
    type: "website",
  },
  twitter: {
    card: "summary",
    title: "Web3 Assets API",
    description:
      "A minimal Web3 configuration API layer for chains, wallets, and tokens.",
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body className={`${geistSans.variable} ${geistMono.variable}`}>
        <div className="app-shell">
          <header className="app-header">
            <div className="app-header-inner">
              <div className="app-logo">
                <Image src="/favicon.svg" alt="Web3 Assets API" width={24} height={24} />
                <span className="app-logo-text">Web3 Assets API</span>
              </div>
              <span className="app-header-tagline">
                Static configs for chains, wallets, and tokens
              </span>
            </div>
          </header>
          <main className="app-main">{children}</main>
          <footer className="app-footer">
            <div className="app-footer-inner">
              <span className="app-footer-text">
                © {new Date().getFullYear()} Tomo. All rights reserved.
              </span>
              <span className="app-footer-secondary">
                Built with Next.js · Deployed on Cloudflare Workers
              </span>
            </div>
          </footer>
        </div>
      </body>
    </html>
  );
}
