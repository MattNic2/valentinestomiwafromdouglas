import type { Metadata as NextMetadata } from "next";

export interface TwitterImage {
  url: string;
  width: number;
  height: number;
  alt?: string;
}

export interface TwitterMetadata {
  cardType?: "summary" | "summary_large_image" | "app" | "player";
  site?: string;
  title?: string;
  description?: string;
  creator?: string;
  images?: TwitterImage | TwitterImage[];
  card?: "summary" | "summary_large_image" | "app" | "player";
}

export interface Metadata extends NextMetadata {
  twitter?: TwitterMetadata;
}
