import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import "../globals.css";
import "../styles/resizable.css";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

const baseUrl = process.env.NEXT_PUBLIC_BASE_URL || "https://tomylovemiwa.com/";

export const metadata: Metadata = {
  title: "To My Love Miwa | A Valentine's Journey",
  description:
    "A digital love letter celebrating our beautiful journey together. Explore our memories, adventures, and the countless reasons why every day with you is magical. ❤️",
  icons: {
    icon: "/favicon.ico",
    apple: "/tomylovemiwa-icon.png",
  },
  openGraph: {
    title: "To My Love Miwa | Our Love Story",
    description:
      "Join us on a heartwarming journey through memories, laughter, and endless love. A Valentine's celebration of our special bond. 💝",
    images: [
      {
        url: `${baseUrl}/Miwa_collage.jpg`,
        width: 1200,
        height: 630,
        alt: "A beautiful collage of Douglas and Miwa's precious moments together, and some games of love",
      },
    ],
    type: "website",
    siteName: "To My Love Miwa",
  },
  twitter: {
    card: "summary_large_image",
    title: "To My Love Miwa | A Valentine's Celebration 💕",
    description: "Every moment with you is a treasure...",
    creator: "@seoking23",
    images: [
      {
        url: `${baseUrl}/Miwa_collage.jpg`,
        width: 1200,
        height: 630,
        alt: "A heartwarming collection of Douglas and Miwa's most precious moments, and some games of love",
      },
    ],
  },
  keywords: [
    "love story",
    "Valentine's Day",
    "romance",
    "couple",
    "memories",
    "digital love letter",
  ],
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
        {children}
      </body>
    </html>
  );
}
