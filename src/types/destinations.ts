import { z } from "zod";

export interface ItineraryItem {
  id: string;
  name: string;
  description: string;
  emoji: string;
  price: number;
  duration?: string;
  country: string;
  place: string;
  bookingUrl?: string;
  tips?: string[];
}

export interface Destination {
  country: string;
  description: string;
  currency: string;
  language: string;
  generalTips: string[];
  places: {
    name: string;
    emoji: string;
    description: string;
    activities: ItineraryItem[];
    media: {
      type: "image" | "video";
      url: string;
      title: string;
      description?: string;
    }[];
  }[];
  coverImage: string;
}

// ... other types
