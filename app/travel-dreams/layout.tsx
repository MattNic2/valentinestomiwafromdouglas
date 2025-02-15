export const metadata = {
  title: "Travel Dreams",
  description: "Plan your next adventure in Asia",
  metadataBase: new URL(
    process.env.NEXT_PUBLIC_BASE_URL || "http://localhost:3000"
  ),
};

export default function TravelDreamsLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return children;
}
