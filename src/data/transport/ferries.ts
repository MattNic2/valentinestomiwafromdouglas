import type { FerryRoute } from "../../types/transport";

export const ferryRoutes: FerryRoute[] = [
  {
    operator: "JR Kyushu Beetle Ferry",
    route: "Fukuoka (Hakata) ⟷ Busan",
    duration: "3h 10m",
    frequency: "1-2 times daily",
    price: {
      economy: 90,
      tourist: 140,
      firstClass: 220,
    },
    website: "https://www.jrbeetle.co.jp/english/",
    schedule: "https://www.jrbeetle.co.jp/english/schedule/",
    notes: [
      "Most popular route between Japan and Korea",
      // ... other notes
    ],
  },
  // ... other ferry routes
];
