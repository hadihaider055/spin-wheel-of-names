import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";
import { ConfigProvider } from "@/contexts/ConfigContext";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "Spin Wheel of Names",
  description:
    "A customizable, open-source spin wheel application for giveaways, contests, and decision making. Built with Next.js and React.",
  authors: [{ name: "Hadi Haider", url: "https://linkedin.com/in/hadi-haider" }],
  keywords: ["spin wheel", "random picker", "giveaway", "contest", "decision maker", "names", "lottery"],
  openGraph: {
    title: "Spin Wheel of Names",
    description: "A customizable spin wheel for giveaways and contests",
    url: "https://github.com/hadihaider055/spin-wheel-of-names",
    siteName: "Spin Wheel of Names",
    type: "website",
  },
  twitter: {
    card: "summary_large_image",
    title: "Spin Wheel of Names",
    description: "A customizable spin wheel for giveaways and contests",
  },
  icons: {
    icon: "/favicon.ico",
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body
        className={`${geistSans.variable} ${geistMono.variable} antialiased`}
      >
        <ConfigProvider>
          {children}
        </ConfigProvider>
      </body>
    </html>
  );
}
