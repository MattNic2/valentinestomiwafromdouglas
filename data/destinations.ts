import { z } from "zod";
import { MapPin, Globe, Calendar, LucideIcon } from "lucide-react";

// Validation Schemas
const mediaContentSchema = z.object({
  type: z.enum(["image", "video"]),
  url: z.string().url(),
  title: z.string().min(1),
  source: z.string().optional(),
  credit: z.string().optional(),
  thumbnail: z.string().url().optional(),
});

// Add category type
export type ActivityCategory =
  | "Food & Drink"
  | "Museums"
  | "Art & Design"
  | "Culture & History"
  | "Nature & Outdoors"
  | "Entertainment"
  | "Shopping"
  | "Wellness"
  | "Adventure"
  | "Nightlife"
  | "Accommodation"
  | "Transportation";

// Update activity schema to include category
const activitySchema = z.object({
  name: z.string().min(1),
  description: z.string().min(1),
  emoji: z.string().min(1),
  category: z.enum([
    "Food & Drink",
    "Museums",
    "Art & Design",
    "Culture & History",
    "Nature & Outdoors",
    "Entertainment",
    "Shopping",
    "Wellness",
    "Adventure",
    "Nightlife",
  ]),
  media: z.array(mediaContentSchema).optional(),
  tips: z.array(z.string()).optional(),
  bestTime: z.string().optional(),
  duration: z.string().optional(),
  cost: z.string().optional(),
  price: z.number(),
  bookingUrl: z.string().url().optional(),
});

const localPhraseSchema = z.object({
  local: z.string().min(1),
  pronunciation: z.string().min(1),
  meaning: z.string().min(1),
});

// Update the link schema to use string identifiers for icons
const linkSchema = z.object({
  label: z.string(),
  url: z.string().url(),
  iconName: z.enum(["globe", "map-pin", "calendar"]),
});

// Update the imagePathSchema to enforce URL parameters
const imagePathSchema = z.string().refine(
  (value) => {
    // Accept both URLs and local paths starting with "/"
    const isValidPath = value.startsWith("http") || value.startsWith("/");
    // If it's an Unsplash URL, ensure it has the required parameters
    const hasRequiredParams =
      !value.includes("unsplash.com") ||
      (value.includes("auto=format") && value.includes("w=1200"));
    return isValidPath && hasRequiredParams;
  },
  {
    message:
      "Image path must be either a URL with proper parameters or a local path starting with '/'",
  }
);

const placeSchema = z.object({
  name: z.string().min(1),
  description: z.string().min(1),
  activities: z.array(activitySchema),
  emoji: z.string().min(1),
  media: z.array(mediaContentSchema).optional(),
  bestTimeToVisit: z.string().optional(),
  mustKnow: z.array(z.string()).optional(),
  localPhrases: z.array(localPhraseSchema).optional(),
  image: imagePathSchema.optional(),
  links: z.array(linkSchema).optional(),
});

const destinationSchema = z.object({
  country: z.string().min(1),
  description: z.string().min(1),
  currency: z.string().min(1),
  language: z.string().min(1),
  places: z.array(placeSchema),
  generalTips: z.array(z.string()),
  media: z.array(mediaContentSchema),
  coverImage: imagePathSchema,
});

// Type exports from Zod schemas
export type MediaContent = z.infer<typeof mediaContentSchema>;
export type Activity = z.infer<typeof activitySchema>;
export type Place = z.infer<typeof placeSchema>;
export type Destination = z.infer<typeof destinationSchema>;
export type Link = z.infer<typeof linkSchema>;

// Icon mapping
const iconMap: Record<Link["iconName"], LucideIcon> = {
  globe: Globe,
  "map-pin": MapPin,
  calendar: Calendar,
};

// Helper function to get icon component
export const getIconComponent = (iconName: Link["iconName"]): LucideIcon => {
  return iconMap[iconName];
};

// Data validation and export
const rawDestinations = [
  {
    country: "Japan",
    description:
      "A perfect blend of tradition and modernity, where ancient temples meet cutting-edge technology.",
    currency: "Japanese Yen (¥)",
    language: "Japanese",
    generalTips: [
      "Get a JR Pass for inter-city travel",
      "Download offline maps and translation apps",
      "Try convenience store food - it's amazing!",
      "Get a Pasmo/Suica card for local transport",
      "Book popular restaurants in advance",
      "Many places are cash-only",
      "Download Google Translate with Japanese offline",
      "Consider pocket WiFi rental",
      "Book accommodations early during cherry blossom season",
    ],
    places: [
      {
        name: "Tokyo",
        description:
          "A vibrant metropolis where tradition seamlessly blends with futuristic innovation.",
        emoji: "🗼",
        activities: [
          {
            name: "Tsukiji Outer Market Tour",
            description: "Guided food tour of famous fish market",
            category: "Food & Drink",
            emoji: "🐟",
            price: 75,
            duration: "3 hours",
            bookingUrl:
              "https://www.govoyagin.com/activities/japan-tokyo-tsukiji-fish-market-tour/186",
            tips: ["Go early morning", "Come hungry", "Bring cash"],
          },
          {
            name: "Sushi Making Class",
            description: "Learn to make authentic sushi with master chef",
            category: "Food & Drink",
            emoji: "🍱",
            price: 80,
            duration: "2 hours",
            bookingUrl: "https://www.cookly.me/cooking-class/tokyo/",
          },
          {
            name: "Izakaya Food Tour",
            description:
              "Evening tour of traditional Japanese pubs in Shinjuku",
            category: "Food & Drink",
            emoji: "🍶",
            price: 90,
            duration: "3 hours",
            tips: ["Come hungry", "Wear comfortable shoes"],
          },
          {
            name: "Ramen Cooking Class",
            description: "Learn to make authentic Japanese ramen from scratch",
            category: "Food & Drink",
            emoji: "🍜",
            price: 65,
            duration: "3 hours",
          },
          {
            name: "Ghibli Museum",
            description: "Magical museum celebrating Studio Ghibli animations",
            category: "Museums",
            emoji: "🎬",
            price: 15,
            bookingUrl: "https://www.ghibli-museum.jp/en/",
            tips: ["Book months in advance", "No photos inside"],
          },
          {
            name: "Tokyo National Museum",
            description: "Japan's oldest and largest art museum",
            category: "Museums",
            emoji: "🏛️",
            price: 20,
            duration: "3 hours",
            bookingUrl: "https://www.tnm.jp",
          },
          {
            name: "Edo-Tokyo Museum",
            description: "Learn about Tokyo's history and culture",
            category: "Museums",
            emoji: "📜",
            price: 18,
            duration: "2-3 hours",
          },
          {
            name: "Samurai Museum",
            description: "Interactive museum about samurai history",
            category: "Museums",
            emoji: "⚔️",
            price: 25,
            duration: "1.5 hours",
          },
          {
            name: "TeamLab Planets",
            description: "Immersive digital art museum",
            category: "Art & Design",
            emoji: "🎨",
            price: 30,
            duration: "2-3 hours",
            bookingUrl: "https://planets.teamlab.art/tokyo/",
            tips: [
              "Book tickets in advance",
              "Wear shorts/skirts you can roll up",
            ],
          },
          {
            name: "Mori Art Museum",
            description: "Contemporary art with city views",
            category: "Art & Design",
            emoji: "🖼️",
            price: 25,
            duration: "2 hours",
          },
          {
            name: "Design Festa Gallery",
            description: "Alternative art space in Harajuku",
            category: "Art & Design",
            emoji: "🎭",
            price: 0,
            duration: "1 hour",
          },
          {
            name: "Sumo Practice Viewing",
            description: "Watch morning sumo training session",
            category: "Culture & History",
            emoji: "🤼",
            price: 95,
            duration: "2 hours",
            bookingUrl:
              "https://www.govoyagin.com/activities/japan-tokyo-watch-sumo-morning-practice/2623",
          },
          {
            name: "Tea Ceremony Experience",
            description: "Traditional tea ceremony in historic garden",
            category: "Culture & History",
            emoji: "🍵",
            price: 60,
            duration: "1.5 hours",
          },
          {
            name: "Sensoji Temple Tour",
            description: "Guided tour of Tokyo's oldest temple",
            category: "Culture & History",
            emoji: "⛩️",
            price: 40,
            duration: "2 hours",
          },
          {
            name: "Mount Fuji Day Trip",
            description: "Guided tour to Mount Fuji and surrounding areas",
            category: "Nature & Outdoors",
            emoji: "🗻",
            price: 130,
            duration: "Full day",
          },
          {
            name: "Shinjuku Gyoen Garden",
            description: "Peaceful garden in the heart of Tokyo",
            category: "Nature & Outdoors",
            emoji: "🌸",
            price: 5,
            duration: "2 hours",
          },
          {
            name: "Imperial Palace Gardens",
            description: "Historic gardens in central Tokyo",
            category: "Nature & Outdoors",
            emoji: "🏯",
            price: 0,
            duration: "2 hours",
          },
          {
            name: "Robot Restaurant Show",
            description: "Unique high-tech entertainment show",
            category: "Entertainment",
            emoji: "🤖",
            price: 80,
            duration: "90 minutes",
          },
          {
            name: "Karaoke in Shibuya",
            description: "Private karaoke room experience",
            category: "Entertainment",
            emoji: "🎤",
            price: 30,
            duration: "2 hours",
          },
          {
            name: "Mario Kart City Tour",
            description: "Drive through Tokyo dressed as game characters",
            category: "Entertainment",
            emoji: "🏎️",
            price: 85,
            duration: "3 hours",
          },
          {
            name: "Harajuku Shopping Tour",
            description: "Guided tour of trendy fashion district",
            category: "Shopping",
            emoji: "🛍️",
            price: 50,
            duration: "3 hours",
          },
          {
            name: "Akihabara Electronics Tour",
            description: "Explore Japan's electronics and anime mecca",
            category: "Shopping",
            emoji: "🎮",
            price: 45,
            duration: "3 hours",
          },
          {
            name: "Vintage Shopping in Shimokitazawa",
            description: "Explore Tokyo's hip vintage shopping district",
            category: "Shopping",
            emoji: "👕",
            price: 40,
            duration: "3 hours",
          },
        ],
        image:
          "https://images.unsplash.com/photo-1503899036084-c55cdd92da26?auto=format&q=80&w=1200",
        media: [
          {
            type: "image",
            url: "https://images.unsplash.com/photo-1503899036084-c55cdd92da26",
            title: "Tokyo Skyline",
          },
        ],
      },
      {
        name: "Kyoto",
        description:
          "The cultural heart of Japan with over a thousand years of history.",
        emoji: "⛩️",
        activities: [
          {
            name: "Tea Ceremony Experience",
            description: "Traditional tea ceremony in historic district",
            category: "Culture & History",
            emoji: "🍵",
            price: 60,
            duration: "45 minutes",
            bookingUrl:
              "https://www.govoyagin.com/activities/japan-kyoto-tea-ceremony/2238",
            tips: ["Remove shoes", "Wear socks", "Arrive 10 minutes early"],
          },
          {
            name: "Fushimi Inari Night Tour",
            description: "Evening guided tour of famous shrine",
            category: "Culture & History",
            emoji: "🏮",
            price: 45,
            duration: "2 hours",
            bookingUrl:
              "https://www.klook.com/activity/1548-fushimi-inari-shrine-tour-kyoto/",
            tips: ["Bring good walking shoes", "Bring a camera"],
          },
          {
            name: "Kinkaku-ji Temple Tour",
            description: "Visit the famous Golden Pavilion",
            category: "Culture & History",
            emoji: "🏯",
            price: 40,
            duration: "1.5 hours",
            tips: ["Go early to avoid crowds", "Best photos in morning light"],
          },
          {
            name: "Nishiki Market Food Tour",
            description: "Guided tour of Kyoto's kitchen",
            category: "Food & Drink",
            emoji: "🍱",
            price: 75,
            duration: "3 hours",
            tips: ["Come hungry", "Try the samples", "Bring cash"],
          },
          {
            name: "Kaiseki Dining Experience",
            description: "Traditional multi-course Japanese dinner",
            category: "Food & Drink",
            emoji: "🍶",
            price: 150,
            duration: "2.5 hours",
            bookingUrl: "https://www.kyoto-kaiseki.com",
            tips: ["Book in advance", "Dress smart casual"],
          },
          {
            name: "Sake Tasting Tour",
            description: "Visit traditional sake breweries",
            category: "Food & Drink",
            emoji: "🍶",
            price: 85,
            duration: "3 hours",
            tips: ["Skip breakfast", "Take notes on favorites"],
          },
          {
            name: "Arashiyama Bamboo Grove",
            description: "Early morning photo tour",
            category: "Nature & Outdoors",
            emoji: "🎋",
            price: 65,
            duration: "3 hours",
            bookingUrl:
              "https://www.klook.com/activity/1547-arashiyama-bamboo-grove-tour-kyoto/",
            tips: ["Go at sunrise", "Bring tripod for photos"],
          },
          {
            name: "Philosopher's Path Walk",
            description: "Scenic walk along historic canal",
            category: "Nature & Outdoors",
            emoji: "🌸",
            price: 0,
            duration: "2 hours",
            tips: [
              "Beautiful during cherry blossom season",
              "Visit temples along the way",
            ],
          },
          {
            name: "Kyoto National Museum",
            description: "Ancient Japanese art and artifacts",
            category: "Museums",
            emoji: "🏛️",
            price: 20,
            duration: "2-3 hours",
            bookingUrl: "https://www.kyohaku.go.jp/eng/",
          },
          {
            name: "Samurai & Ninja Museum",
            description: "Interactive martial arts history museum",
            category: "Museums",
            emoji: "⚔️",
            price: 25,
            duration: "1.5 hours",
            tips: ["Try on armor", "Watch demonstration"],
          },
          {
            name: "Gion District Night Tour",
            description: "Evening walk through geisha district",
            category: "Culture & History",
            emoji: "👘",
            price: 55,
            duration: "2 hours",
            tips: [
              "Be respectful of geisha",
              "No photos of geisha without permission",
            ],
          },
          {
            name: "Traditional Craft Workshop",
            description: "Learn Japanese paper making or weaving",
            category: "Art & Design",
            emoji: "🎨",
            price: 45,
            duration: "2 hours",
            tips: ["Book in advance", "All materials provided"],
          },
        ],
        image:
          "https://images.unsplash.com/photo-1493976040374-85c8e12f0c0e?auto=format&q=80&w=1200",
        media: [
          {
            type: "image",
            url: "https://images.unsplash.com/photo-1493976040374-85c8e12f0c0e",
            title: "Kyoto",
          },
        ],
      },
      {
        name: "Osaka",
        description: "Japan's kitchen and entertainment capital.",
        emoji: "🎪",
        activities: [
          {
            name: "Street Food Tour",
            description: "Guided tour of Dotonbori's best food spots",
            category: "Food & Drink",
            emoji: "🍜",
            price: 85,
            duration: "3 hours",
            bookingUrl:
              "https://www.osaka-info.jp/en/discover-osaka/food-and-drink/",
            tips: [
              "Try takoyaki",
              "Save room for okonomiyaki",
              "Evening tours best",
            ],
          },
          {
            name: "Cooking Class",
            description: "Learn to make Osaka specialties",
            category: "Food & Drink",
            emoji: "👨‍🍳",
            price: 70,
            duration: "3 hours",
            tips: ["Vegetarian options available", "Recipes provided"],
          },
          {
            name: "Kuromon Market Tour",
            description: "Explore the 'Osaka's Kitchen' market",
            category: "Food & Drink",
            emoji: "🏪",
            price: 45,
            duration: "2 hours",
            tips: ["Go hungry", "Try the fresh sushi", "Morning is best"],
          },
          {
            name: "Universal Studios Japan",
            description: "Popular theme park with unique attractions",
            category: "Entertainment",
            emoji: "🎢",
            price: 75,
            duration: "Full day",
            bookingUrl: "https://www.usj.co.jp/web/en/us",
            tips: [
              "Buy tickets in advance",
              "Get Express Pass for popular rides",
            ],
          },
          {
            name: "Osaka Aquarium",
            description: "One of Japan's largest aquariums",
            category: "Entertainment",
            emoji: "🐋",
            price: 30,
            duration: "3 hours",
            tips: ["Go early to avoid crowds", "Check feeding times"],
          },
          {
            name: "Osaka Castle Tour",
            description: "Guided tour of historic castle",
            category: "Culture & History",
            emoji: "🏯",
            price: 35,
            duration: "2 hours",
            bookingUrl: "https://www.osakacastle.net/english/",
            tips: ["Visit museum inside", "Great cherry blossom viewing"],
          },
          {
            name: "Sumiyoshi Taisha Shrine",
            description: "One of Japan's oldest Shinto shrines",
            category: "Culture & History",
            emoji: "⛩️",
            price: 0,
            duration: "1.5 hours",
            tips: ["Famous for New Year visits", "Beautiful architecture"],
          },
          {
            name: "Shinsekai District Tour",
            description: "Explore retro neighborhood and local life",
            category: "Culture & History",
            emoji: "🏮",
            price: 40,
            duration: "2 hours",
            tips: ["Try kushikatsu", "Visit Tsutenkaku Tower"],
          },
          {
            name: "Osaka Science Museum",
            description: "Interactive science exhibits",
            category: "Museums",
            emoji: "🔬",
            price: 20,
            duration: "2-3 hours",
            tips: ["Great for kids", "English explanations available"],
          },
          {
            name: "Cup Noodle Museum",
            description: "Make your own instant noodles",
            category: "Museums",
            emoji: "🍜",
            price: 15,
            duration: "2 hours",
            tips: ["Book workshop in advance", "Take home your creation"],
          },
          {
            name: "Shopping in Shinsaibashi",
            description: "Osaka's premier shopping district",
            category: "Shopping",
            emoji: "🛍️",
            price: 0,
            duration: "3 hours",
            tips: ["Mix of luxury and local brands", "Connected to Dotonbori"],
          },
          {
            name: "Spa World",
            description: "Huge hot spring theme park",
            category: "Wellness",
            emoji: "♨️",
            price: 28,
            duration: "4 hours",
            tips: [
              "Bring swimsuit for pools",
              "Check which floor is for your gender",
            ],
          },
        ],
        image:
          "https://images.unsplash.com/photo-1590559899731-a382839e5549?auto=format&q=80&w=1200",
        media: [
          {
            type: "image",
            url: "https://images.unsplash.com/photo-1590559899731-a382839e5549?auto=format&q=80&w=1200",
            title: "Osaka",
          },
        ],
      },
      {
        name: "Hiroshima",
        description: "A city of peace, resilience, and rich cultural heritage.",
        emoji: "☮️",
        activities: [
          {
            name: "Peace Memorial Museum",
            description:
              "Moving museum dedicated to peace and atomic bomb history",
            category: "Museums",
            emoji: "🕊️",
            price: 20,
            duration: "2-3 hours",
            bookingUrl: "https://hpmmuseum.jp/",
            tips: [
              "Allow time for reflection",
              "Audio guides available",
              "Some exhibits may be emotional",
            ],
          },
          {
            name: "Atomic Bomb Dome Tour",
            description: "Guided tour of the UNESCO World Heritage site",
            category: "Culture & History",
            emoji: "🏛️",
            price: 45,
            duration: "1.5 hours",
            tips: [
              "Best at sunset",
              "Join guided tour for historical context",
              "Visit Peace Park after",
            ],
          },
          {
            name: "Miyajima Island Day Trip",
            description:
              "Visit the famous floating torii gate and sacred island",
            category: "Culture & History",
            emoji: "⛩️",
            price: 65,
            duration: "Full day",
            bookingUrl: "https://www.miyajima.or.jp/",
            tips: [
              "Check tide times for floating torii",
              "Try local oysters",
              "Watch out for deer",
            ],
          },
          {
            name: "Okonomiyaki Cooking Class",
            description: "Learn to make Hiroshima's famous layered okonomiyaki",
            category: "Food & Drink",
            emoji: "🥘",
            price: 55,
            duration: "2 hours",
            tips: [
              "Vegetarian options available",
              "Take home recipe provided",
              "Great for lunch",
            ],
          },
          {
            name: "Hiroshima Food Tour",
            description:
              "Sample local specialties including oysters and okonomiyaki",
            category: "Food & Drink",
            emoji: "🦪",
            price: 85,
            duration: "3 hours",
            tips: [
              "Try Hiroshima-style okonomiyaki",
              "Fresh oysters in season",
              "Visit Okonomimura food village",
            ],
          },
          {
            name: "Shukkeien Garden",
            description: "Historic Japanese landscape garden",
            category: "Nature & Outdoors",
            emoji: "🍁",
            price: 15,
            duration: "1.5 hours",
            tips: [
              "Beautiful in autumn",
              "Tea ceremony available",
              "Early morning best for photos",
            ],
          },
          {
            name: "Hiroshima Castle",
            description: "Reconstructed samurai castle with museum",
            category: "Culture & History",
            emoji: "🏯",
            price: 25,
            duration: "2 hours",
            tips: [
              "Great city views from top",
              "Wear comfortable shoes",
              "Combined ticket with garden available",
            ],
          },
          {
            name: "Onomichi Temple Walk",
            description: "Scenic hillside walk connecting historic temples",
            category: "Culture & History",
            emoji: "🚶",
            price: 0,
            duration: "3 hours",
            tips: [
              "Start early morning",
              "Wear good walking shoes",
              "Get temple stamp book",
            ],
          },
        ],
        image:
          "https://images.unsplash.com/photo-1576675466969-38eeae4b41f6?auto=format&q=80&w=1200",
        media: [
          {
            type: "image",
            url: "https://images.unsplash.com/photo-1576675466969-38eeae4b41f6?auto=format&q=80&w=1200",
            title: "Hiroshima Peace Memorial",
          },
        ],
      },
    ],
    media: [
      {
        type: "video",
        url: "https://www.youtube.com/watch?v=jfKfPfyJRdk",
        title: "Japan Travel Guide",
        thumbnail: "https://i.ytimg.com/vi/jfKfPfyJRdk/maxresdefault.jpg",
      },
    ],
    coverImage:
      "https://images.unsplash.com/photo-1492571350019-22de08371fd3?auto=format&q=80&w=1200",
  },
  {
    country: "Korea",
    description:
      "A captivating blend of ancient traditions and modern pop culture.",
    currency: "Korean Won (₩)",
    language: "Korean",
    generalTips: [
      "Get a T-money card for public transport",
      "Download Naver Maps for navigation",
      "Try street food at local markets",
      "Book K-pop related activities early",
      "Consider a Korea Rail Pass for travel",
      "Most restaurants are card-friendly",
      "Download Papago for translations",
    ],
    places: [
      {
        name: "Seoul",
        description:
          "A dynamic metropolis where K-pop culture meets historic palaces.",
        emoji: "🇰🇷",
        activities: [
          {
            name: "Korean BBQ Food Tour",
            description: "Guided evening tour of best Korean BBQ restaurants",
            category: "Food & Drink",
            emoji: "🥩",
            price: 85,
            duration: "3 hours",
            bookingUrl: "https://www.klook.com/activity/korean-bbq-tour-seoul",
            tips: [
              "Come hungry",
              "Wear casual clothes",
              "Evening tours are best",
            ],
          },
          {
            name: "Street Food Adventure",
            description: "Explore Gwangjang Market's diverse food stalls",
            category: "Food & Drink",
            emoji: "🥘",
            price: 55,
            duration: "3 hours",
            tips: [
              "Try the bindaetteok",
              "Bring cash",
              "Go during lunch hours",
            ],
          },
          {
            name: "Kimchi Making Class",
            description: "Learn to make traditional Korean kimchi",
            category: "Food & Drink",
            emoji: "🥬",
            price: 45,
            duration: "2 hours",
            bookingUrl: "https://www.cookly.me/cooking-class/seoul/kimchi",
          },
          {
            name: "National Museum of Korea",
            description: "Korea's largest museum of art and history",
            category: "Museums",
            emoji: "🏛️",
            price: 0,
            duration: "3 hours",
            bookingUrl: "https://www.museum.go.kr/site/eng/home",
          },
          {
            name: "War Memorial of Korea",
            description: "Comprehensive museum about Korean military history",
            category: "Museums",
            emoji: "🪖",
            price: 0,
            duration: "2-3 hours",
          },
          {
            name: "National Folk Museum",
            description: "Traditional Korean culture and lifestyle exhibits",
            category: "Museums",
            emoji: "📜",
            price: 0,
            duration: "2 hours",
          },
          {
            name: "Leeum Samsung Museum of Art",
            description: "Modern and contemporary art collection",
            category: "Art & Design",
            emoji: "🎨",
            price: 15,
            duration: "2 hours",
          },
          {
            name: "Dongdaemun Design Plaza",
            description: "Futuristic architectural landmark and design hub",
            category: "Art & Design",
            emoji: "🏢",
            price: 0,
            duration: "2 hours",
          },
          {
            name: "Gyeongbokgung Palace Tour",
            description: "Guided tour of Korea's main royal palace",
            category: "Culture & History",
            emoji: "👑",
            price: 35,
            duration: "2 hours",
            tips: ["Go for changing of guards", "Wear hanbok for free entry"],
          },
          {
            name: "Bukchon Hanok Village",
            description: "Traditional Korean village experience",
            category: "Culture & History",
            emoji: "🏘️",
            price: 40,
            duration: "2 hours",
          },
          {
            name: "Namsan Seoul Tower",
            description: "Iconic tower with city views",
            category: "Entertainment",
            emoji: "🗼",
            price: 15,
            duration: "2 hours",
          },
          {
            name: "K-pop Recording Studio",
            description: "Record your own K-pop song",
            category: "Entertainment",
            emoji: "🎤",
            price: 55,
            duration: "2 hours",
          },
          {
            name: "Myeongdong Shopping Tour",
            description: "Guide to Seoul's premier shopping district",
            category: "Shopping",
            emoji: "🛍️",
            price: 40,
            duration: "3 hours",
          },
          {
            name: "Hongdae Shopping Tour",
            description: "Youth fashion and culture shopping area",
            category: "Shopping",
            emoji: "👕",
            price: 35,
            duration: "3 hours",
          },
          {
            name: "Korean Spa Experience",
            description: "Traditional Korean bathhouse visit",
            category: "Wellness",
            emoji: "♨️",
            price: 25,
            duration: "3 hours",
            tips: ["Bring toiletries", "Follow local etiquette"],
          },
        ],
        image:
          "https://images.unsplash.com/photo-1617541086271-4d43983704bd?auto=format&q=80&w=1200",
        media: [
          {
            type: "image",
            url: "https://images.unsplash.com/photo-1617541086271-4d43983704bd?auto=format&q=80&w=1200",
            title: "Seoul",
          },
        ],
      },
      {
        name: "Gapyeong",
        description:
          "Scenic countryside retreat famous for natural beauty and cultural attractions.",
        emoji: "🌿",
        activities: [
          {
            name: "Nami Island Visit",
            description: "Scenic island famous for K-drama locations",
            category: "Nature & Outdoors",
            emoji: "🌳",
            price: 40,
            duration: "4 hours",
            bookingUrl: "https://www.namisum.com/",
            tips: [
              "Take ferry or zip line entry",
              "Rent a bicycle",
              "Beautiful in all seasons",
            ],
          },
          {
            name: "The Garden of Morning Calm",
            description:
              "Korea's oldest private garden with seasonal illuminations",
            category: "Nature & Outdoors",
            emoji: "🌸",
            price: 35,
            duration: "2 hours",
            tips: [
              "Visit during light festival in winter",
              "Best in spring for flowers",
              "Good sunset photos",
            ],
          },
          {
            name: "Petite France",
            description:
              "French cultural village and Le Petit Prince theme park",
            category: "Entertainment",
            emoji: "🏰",
            price: 30,
            duration: "2 hours",
            tips: [
              "Watch cultural performances",
              "Visit early for photos",
              "Check show schedules",
            ],
          },
          {
            name: "Rail Bike Adventure",
            description:
              "Scenic railway bike ride along abandoned train tracks",
            category: "Adventure",
            emoji: "🚲",
            price: 45,
            duration: "1.5 hours",
            bookingUrl: "https://www.gprailpark.com/",
            tips: ["Book in advance", "Dress for weather", "Great for photos"],
          },
          {
            name: "Korean BBQ Experience",
            description: "Local countryside-style Korean barbecue",
            category: "Food & Drink",
            emoji: "🥩",
            price: 50,
            duration: "2 hours",
            tips: [
              "Try local mountain vegetables",
              "Fresh ingredients",
              "Popular with locals",
            ],
          },
          {
            name: "Strawberry Picking",
            description: "Visit local strawberry farms for picking",
            category: "Nature & Outdoors",
            emoji: "🍓",
            price: 25,
            duration: "1.5 hours",
            seasonal: "Winter-Spring",
            tips: [
              "Available December-May",
              "All you can eat option",
              "Great for families",
            ],
          },
          {
            name: "Gapyeong Makgeolli Tour",
            description: "Traditional Korean rice wine tasting",
            category: "Food & Drink",
            emoji: "🍶",
            price: 40,
            duration: "2 hours",
            tips: [
              "Try local makgeolli varieties",
              "Includes food pairing",
              "Learn brewing process",
            ],
          },
          {
            name: "Jarasum Island",
            description: "River island famous for jazz festival",
            category: "Entertainment",
            emoji: "🎷",
            price: 0,
            duration: "2 hours",
            tips: [
              "Visit during jazz festival in October",
              "Nice picnic spot",
              "Sunset views",
            ],
          },
        ],
        image:
          "https://images.unsplash.com/photo-1597218868981-1b68e15f0065?auto=format&q=80&w=1200",
        media: [
          {
            type: "image",
            url: "https://images.unsplash.com/photo-1597218868981-1b68e15f0065?auto=format&q=80&w=1200",
            title: "Nami Island",
          },
        ],
      },
      {
        name: "Busan",
        description: "Coastal city famous for beaches, temples, and seafood.",
        emoji: "🌊",
        activities: [
          {
            name: "Jagalchi Fish Market Tour",
            description: "Explore Korea's largest seafood market",
            category: "Food & Drink",
            emoji: "🐟",
            price: 65,
            duration: "3 hours",
            tips: ["Go early morning", "Try the live seafood"],
          },
          {
            name: "Street Food Night Tour",
            description: "Evening tour of BIFF Square food stalls",
            category: "Food & Drink",
            emoji: "🥘",
            price: 55,
            duration: "3 hours",
          },
          {
            name: "Busan Museum of Art",
            description: "Contemporary art with focus on local artists",
            category: "Museums",
            emoji: "🎨",
            price: 0,
            duration: "2 hours",
          },
          {
            name: "Haedong Yonggungsa Temple",
            description: "Stunning oceanside Buddhist temple",
            category: "Culture & History",
            emoji: "⛩️",
            price: 0,
            duration: "2 hours",
            tips: ["Go at sunrise", "Check tide times"],
          },
          {
            name: "Haeundae Beach Activities",
            description: "Beach sports and relaxation",
            category: "Nature & Outdoors",
            emoji: "🏖️",
            price: 20,
            duration: "4 hours",
          },
          {
            name: "Taejongdae Hiking",
            description: "Scenic coastal walking trails",
            category: "Nature & Outdoors",
            emoji: "🥾",
            price: 0,
            duration: "3 hours",
          },
          {
            name: "Spa Land Centum City",
            description: "Luxury Korean spa experience",
            category: "Wellness",
            emoji: "♨️",
            price: 45,
            duration: "4 hours",
          },
          {
            name: "Shinsegae Centum City",
            description: "World's largest department store",
            category: "Shopping",
            emoji: "🛍️",
            price: 0,
            duration: "3 hours",
          },
        ],
        image:
          "https://images.unsplash.com/photo-1578037571214-25e07ed4a487?auto=format&q=80&w=1200",
        media: [
          {
            type: "image",
            url: "https://images.unsplash.com/photo-1578037571214-25e07ed4a487?auto=format&q=80&w=1200",
            title: "Busan",
          },
        ],
      },
      {
        name: "Jeju Island",
        description:
          "Volcanic island known for natural wonders and unique culture.",
        emoji: "🌋",
        activities: [
          {
            name: "Hallasan Mountain Hike",
            description: "Hike Korea's highest mountain",
            category: "Nature & Outdoors",
            emoji: "⛰️",
            price: 0,
            duration: "8 hours",
            tips: ["Start early", "Check weather", "Bring supplies"],
          },
          {
            name: "Manjanggul Cave Tour",
            description: "Explore one of world's longest lava tubes",
            category: "Nature & Outdoors",
            emoji: "🕳️",
            price: 25,
            duration: "2 hours",
          },
          {
            name: "Haenyeo Experience",
            description: "Learn about traditional female divers",
            category: "Culture & History",
            emoji: "🤿",
            price: 70,
            duration: "3 hours",
          },
          {
            name: "Black Pork BBQ Dinner",
            description: "Famous Jeju black pig specialty",
            category: "Food & Drink",
            emoji: "🥓",
            price: 45,
            duration: "2 hours",
          },
          {
            name: "Tangerine Picking",
            description: "Pick fresh Jeju citrus fruits",
            category: "Nature & Outdoors",
            emoji: "🍊",
            price: 35,
            duration: "2 hours",
            seasonal: "Winter",
          },
          {
            name: "O'Sulloc Tea Museum",
            description: "Green tea plantation and museum",
            category: "Culture & History",
            emoji: "🍵",
            price: 0,
            duration: "2 hours",
          },
          {
            name: "Jeju Folk Village",
            description: "Traditional island life museum",
            category: "Museums",
            emoji: "🏘️",
            price: 15,
            duration: "3 hours",
          },
        ],
        image:
          "https://images.unsplash.com/photo-1604999333679-b86d54738315?auto=format&q=80&w=1200",
        media: [
          {
            type: "image",
            url: "https://images.unsplash.com/photo-1604999333679-b86d54738315?auto=format&q=80&w=1200",
            title: "Jeju Island",
          },
        ],
      },
    ],
    media: [
      {
        type: "video",
        url: "https://www.youtube.com/watch?v=3P1CnWI62Ik",
        title: "Korea Travel Guide",
        thumbnail: "https://i.ytimg.com/vi/3P1CnWI62Ik/maxresdefault.jpg",
      },
    ],
    coverImage:
      "https://images.unsplash.com/photo-1534274867514-d5b47ef89ed7?auto=format&q=80&w=1200",
  },
]; /* remove 'as const' */

// Simplify the media type assertions since they're already handled by the schema
const media = [
  {
    type: "image",
    url: "...",
    title: "...",
  },
];

// Add error handling for validateDestinations to prevent runtime errors
export function validateDestinations(data: unknown) {
  const schema = z.array(destinationSchema);
  try {
    return schema.parse(data);
  } catch (error) {
    console.error("Failed to validate destinations:", error);
    // Return minimal fallback destination
    return [
      {
        country: "Error Loading Destinations",
        description:
          "We're having trouble loading the destination data. Please try again later.",
        currency: "Unknown",
        language: "Unknown",
        places: [],
        generalTips: ["Please refresh the page to try again"],
        media: [],
        coverImage: validateMediaUrl(undefined),
      },
    ];
  }
}

// Add error handling for validateDestination
export function validateDestination(destination: unknown): Destination {
  try {
    const validated = destinationSchema.parse(destination);
    return {
      ...validated,
      coverImage: validateMediaUrl(validated.coverImage),
      places: validated.places.map((place) => ({
        ...place,
        image: validateMediaUrl(place.image),
        media:
          place.media?.map((m) => ({
            ...m,
            url: validateMediaUrl(m.url),
            thumbnail:
              m.type === "video"
                ? validateMediaUrl(m.thumbnail)
                : validateMediaUrl(m.url), // Use URL as thumbnail for images
          })) || [],
      })),
      media: validated.media.map((m) => ({
        ...m,
        url: validateMediaUrl(m.url),
        thumbnail:
          m.type === "video"
            ? validateMediaUrl(m.thumbnail)
            : validateMediaUrl(m.url),
      })),
    };
  } catch (error) {
    console.error("Failed to validate destination:", error);
    // Return a minimal valid destination as fallback
    return {
      country: "Error Loading Destination",
      description: "Unable to load destination data",
      currency: "Unknown",
      language: "Unknown",
      places: [],
      generalTips: [],
      media: [],
      coverImage: validateMediaUrl(undefined),
    };
  }
}

// Update validateMediaUrl to be more robust with fallbacks
function validateMediaUrl(url: string | undefined): string {
  const fallbackUrl = {
    image:
      "https://images.unsplash.com/photo-1581093458791-9f3c3900df4b?auto=format&q=80&w=1200",
    thumbnail:
      "https://images.unsplash.com/photo-1581093458791-9f3c3900df4b?auto=format&q=80&w=400",
    video: "https://www.youtube.com/watch?v=jfKfPfyJRdk",
  };

  if (!url) {
    return fallbackUrl.image;
  }

  try {
    // Validate URL format
    new URL(url);

    // If it's an Unsplash URL and missing parameters, add them
    if (url.includes("unsplash.com") && !url.includes("auto=format")) {
      const separator = url.includes("?") ? "&" : "?";
      return `${url}${separator}auto=format&q=80&w=1200`;
    }

    // If it's a YouTube URL, validate format
    if (url.includes("youtube.com") && !url.includes("watch?v=")) {
      return fallbackUrl.video;
    }

    return url;
  } catch (error) {
    console.error("Invalid URL:", url, error);
    return fallbackUrl.image;
  }
}

// Export a function to get destinations that can be used during pre-rendering
export async function getDestinations(): Promise<Destination[]> {
  try {
    return validateDestinations(rawDestinations);
  } catch (error) {
    console.error("Failed to get destinations:", error);
    return [];
  }
}

// Add back the missing type definitions and interfaces that are being imported
export type TransportationType = "flight" | "train" | "bus" | "ferry";

export interface TransportItem {
  type: TransportationType;
  from: string;
  to: string;
  date?: string;
  price: number;
  duration: string;
  company?: string;
  bookingUrl?: string;
  emoji: string;
}
export interface ItineraryItem {
  name: string;
  description: string;
  emoji: string;
  duration?: string;
  price?: number;
  address?: string;
  website?: string;
  bookingUrl?: string;
  country: string;
  place: string;
  type?: "activity" | "transport";
  transportDetails?: {
    from: string;
    to: string;
    type: TransportationType;
  };
  category: ActivityCategory;
  tips?: string[];
}

// Add back the validation helper functions
export function validatePlace(place: unknown): Place {
  return placeSchema.parse(place);
}

export function validateActivity(activity: unknown): Activity {
  return activitySchema.parse(activity);
}

// Keep only the direct validation version at the end of the file
export const destinations = validateDestinations(rawDestinations);
