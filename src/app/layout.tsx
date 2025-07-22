// Next
import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import Script from "next/script";

// Styles
import "./globals.css";

// Contexts
import { ConfigProvider } from "@/contexts/ConfigContext";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

const GA_TRACKING_ID = process.env.NEXT_PUBLIC_GA_TRACKING_ID;

export const metadata: Metadata = {
  title:
    "Free Spin Wheel Generator - Random Name Picker & Decision Maker Tool 2025",
  description:
    "🎯 Best FREE spinning wheel generator online! Create custom spin wheels for names, prizes, decisions & giveaways. No signup required. Mobile-friendly random picker tool used by 100k+ users.",
  authors: [
    { name: "Hadi Haider", url: "https://linkedin.com/in/hadi-haider" },
  ],
  keywords: [
    "spin wheel generator",
    "random name picker",
    "spinning wheel online",
    "decision maker wheel",
    "free spin wheel",
    "name randomizer",
    "prize wheel generator",
    "giveaway wheel",
    "random picker tool",
    "wheel of names",
    "spinning wheel app",
    "contest wheel",
    "classroom spinner",
    "team picker wheel",
    "lucky wheel generator",
    "wheel spinner online",
    "random selector",
    "pick random name",
    "decision wheel",
    "fortune wheel",
    "raffle wheel",
    "lottery wheel",
    "name picker wheel",
    "spin the wheel game",
    "custom spin wheel",
    "random choice picker",
    "winner picker",
    "spinning wheel maker",
    "digital spinning wheel",
    "online wheel spinner",
    "web spin wheel",
    "html5 spin wheel",
  ],
  openGraph: {
    title:
      "Free Spin Wheel Generator - Random Name Picker & Decision Maker Tool 2025",
    description:
      "🎯 Create custom spinning wheels instantly! Perfect for giveaways, classroom activities, team selection & decisions. Mobile-friendly, no signup required.",
    url: "https://spin-wheel-of-names.netlify.app/",
    siteName: "Spin Wheel Generator",
    type: "website",
    locale: "en_US",
    images: [
      {
        url: "/og-image.png",
        width: 1200,
        height: 630,
        alt: "Free Spin Wheel Generator - Random Name Picker Tool",
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    site: "@your-twitter-handle",
    creator: "@hadi-haider",
    title:
      "Free Spin Wheel Generator - Random Name Picker & Decision Maker Tool 2025",
    description:
      "🎯 Create custom spinning wheels instantly! Perfect for giveaways, classroom activities & team selection.",
    images: ["/twitter-card.png"],
  },
  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
      "max-video-preview": -1,
      "max-image-preview": "large",
      "max-snippet": -1,
    },
  },
  alternates: {
    canonical: "https://spin-wheel-of-names.netlify.app/",
    languages: {
      "en-US": "/en-US",
      "es-ES": "/es-ES",
    },
  },
  category: "Productivity Tools",
  classification: "Free Online Tool",
  referrer: "origin-when-cross-origin",
  formatDetection: {
    email: false,
    address: false,
    telephone: false,
  },
  metadataBase: new URL("https://spin-wheel-of-names.netlify.app/"),
  icons: {
    icon: [
      { url: "/favicon-16x16.png", sizes: "16x16", type: "image/png" },
      { url: "/favicon-32x32.png", sizes: "32x32", type: "image/png" },
    ],
    apple: [
      { url: "/apple-touch-icon.png", sizes: "180x180", type: "image/png" },
    ],
    other: [
      {
        rel: "mask-icon",
        url: "/safari-pinned-tab.svg",
        color: "#6366f1",
      },
    ],
  },
  manifest: "/site.webmanifest",
  other: {
    "theme-color": "#6366f1",
    "color-scheme": "light dark",
    "mobile-web-app-capable": "yes",
    "apple-mobile-web-app-capable": "yes",
    "apple-mobile-web-app-status-bar-style": "default",
    "msapplication-TileColor": "#6366f1",
    "msapplication-config": "/browserconfig.xml",
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <head>
        {/* Google Analytics */}
        {GA_TRACKING_ID && (
          <>
            <Script
              src={`https://www.googletagmanager.com/gtag/js?id=${GA_TRACKING_ID}`}
              strategy="afterInteractive"
            />
            <Script id="google-analytics" strategy="afterInteractive">
              {`
                window.dataLayer = window.dataLayer || [];
                function gtag(){dataLayer.push(arguments);}
                gtag('js', new Date());
                gtag('config', '${GA_TRACKING_ID}');
              `}
            </Script>
          </>
        )}
      </head>
      <body
        className={`${geistSans.variable} ${geistMono.variable} antialiased`}
      >
        <ConfigProvider>{children}</ConfigProvider>
      </body>
    </html>
  );
}
