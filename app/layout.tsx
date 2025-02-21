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

const baseUrl = process.env.NEXT_PUBLIC_BASE_URL || "https://tomylovemiwa.com";

export const metadata: Metadata = {
  title: "To My Love Miwa",
  description: "Happy Valentines Day bb from Douglas",
  icons: {
    icon: "/favicon.ico",
    apple: "/tomylovemiwa-icon.png",
  },
  openGraph: {
    type: "website",
    title: "To My Love Miwa",
    description: "Happy Valentines Day bb from Douglas",
    images: [
      {
        url: `${baseUrl}/Miwa_collage.jpg`,
        width: 1200,
        height: 630,
        alt: "Douglas and Miwa's Valentine's Day",
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    title: "To My Love Miwa",
    description: "Happy Valentines Day bb from Douglas",
    images: [`${baseUrl}/Miwa_collage.jpg`],
    creator: "@seoking23",
  },
  other: {
    "x-image": [`${baseUrl}/Miwa_collage.jpg`],
    "x-title": "To My Love Miwa",
    "x-description": "Happy Valentines Day bb from Douglas",
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
        {children}
      </body>
    </html>
  );
}
