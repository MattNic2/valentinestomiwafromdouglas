import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Our Travel Dreams | Adventures with My Love",
  description:
    "Exploring the world hand in hand, creating beautiful memories together. Join us on our romantic journey across continents. ✈️❤️",
  twitter: {
    card: "summary_large_image",
    title: "Our Travel Dreams Together | A Journey of Love",
    description:
      "Every destination is magical when I'm with you. Follow our romantic adventures and dream destinations. 🌏💑",
    creator: "@seoking23",
    images: [`${process.env.NEXT_PUBLIC_BASE_URL}/travel-image.jpg`],
  },
  openGraph: {
    title: "Our Travel Dreams | Adventures with My Love",
    description:
      "From sunset beaches to city lights, every journey is a love story when we're together. Explore our romantic travel adventures. ✨",
    images: [`${process.env.NEXT_PUBLIC_BASE_URL}/travel-image.jpg`],
  },
};

export default function TravelDreamsLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return children;
}
