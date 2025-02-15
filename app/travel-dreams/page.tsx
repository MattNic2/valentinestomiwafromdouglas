"use client";

import TravelDreams from "@/components/TravelDreams";
import { Suspense } from "react";

// Add a loading component
function LoadingFallback() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-pink-50 to-red-100 p-8 flex items-center justify-center">
      <div className="text-rose-500 text-xl">Loading your travel dreams...</div>
    </div>
  );
}

export default function TravelDreamsPage() {
  return (
    <Suspense fallback={<LoadingFallback />}>
      <TravelDreams />
    </Suspense>
  );
}
