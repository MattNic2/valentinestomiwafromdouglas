import { NextConfig } from "next";

const config: NextConfig = {
  reactStrictMode: true,
  images: {
    remotePatterns: [
      {
        protocol: "https",
        hostname: "fvipqaosxgefguxgblfc.supabase.co",
        port: "",
        pathname: "/storage/v1/object/public/**",
      },
      {
        protocol: "https",
        hostname: "maps.googleapis.com",
        port: "",
        pathname: "/**",
      },
      {
        protocol: "https",
        hostname: "images.unsplash.com",
        port: "",
        pathname: "/**",
      },
    ],
    domains: ["images.unsplash.com", "i.ytimg.com", "images.pexels.com"],
  },
  // Add this to help with build-time errors
  typescript: {
    ignoreBuildErrors: false,
  },
};

export default config;
