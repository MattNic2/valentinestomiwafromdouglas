import { memo, useState, useEffect } from "react";
import {
  Plane,
  Train,
  Ship,
  Bus,
  ExternalLink,
  MapPin,
  Calendar,
} from "lucide-react";
import Image from "next/image";
import InteractiveMap from "./InteractiveMap";
import { motion, AnimatePresence } from "framer-motion";
import { ItineraryItem } from "../data/destinations";

interface RouteStop {
  city: string;
  country: string;
  coordinates: [number, number];
  transport: {
    type: "plane" | "train" | "ferry" | "bus";
    price: number;
    duration: string;
    operator: string;
    bookingUrl?: string;
    notes?: string[];
  };
}

interface FerryRoute {
  operator: string;
  route: string;
  duration: string;
  frequency: string;
  price: {
    economy: number;
    tourist: number;
    firstClass?: number;
  };
  website: string;
  schedule: string;
  notes: string[];
}

const ferryRoutes: FerryRoute[] = [
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
      "High-speed hydrofoil service",
      "Free WiFi onboard",
      "Duty-free shopping available",
      "Passport required at least 6 months valid",
    ],
  },
  {
    operator: "Panstar Cruise Ferry",
    route: "Osaka ⟷ Busan",
    duration: "18h",
    frequency: "2-3 times weekly",
    price: {
      economy: 120,
      tourist: 180,
      firstClass: 300,
    },
    website: "http://www.panstarcruise.com/en/",
    schedule: "http://www.panstarcruise.com/en/schedule/",
    notes: [
      "Overnight ferry with cabin accommodations",
      "Restaurant and entertainment facilities",
      "Larger luggage allowance than flights",
      "Seasonal routes available",
      "Advance booking recommended",
    ],
  },
  {
    operator: "DBS Cruise Ferry",
    route: "Shimonoseki ⟷ Busan",
    duration: "12h",
    frequency: "3-4 times weekly",
    price: {
      economy: 110,
      tourist: 160,
    },
    website: "https://www.dbsferry.com/en/",
    schedule: "https://www.dbsferry.com/en/schedule/",
    notes: [
      "Overnight service with various cabin types",
      "Korean and Japanese cuisine available",
      "Karaoke and entertainment facilities",
      "Duty-free shopping",
      "Weather-dependent schedule",
    ],
  },
];

const routeData: RouteStop[] = [
  {
    city: "Los Angeles",
    country: "USA",
    coordinates: [34.0522, -118.2437],
    transport: {
      type: "plane",
      price: 850,
      duration: "11h 30m",
      operator: "ANA/JAL",
      bookingUrl: "https://www.google.com/travel/flights",
      notes: [
        "Direct flights available",
        "Book 3-4 months in advance",
        "Best prices Sep-Nov",
      ],
    },
  },
  {
    city: "Tokyo",
    country: "Japan",
    coordinates: [35.6762, 139.6503],
    transport: {
      type: "train",
      price: 130,
      duration: "2h 30m",
      operator: "JR Shinkansen",
      bookingUrl: "https://japanrailpass.net",
      notes: ["Covered by JR Pass", "Trains every 30 minutes"],
    },
  },
  {
    city: "Osaka",
    country: "Japan",
    coordinates: [34.6937, 135.5023],
    transport: {
      type: "train",
      price: 90,
      duration: "1h 30m",
      operator: "JR Shinkansen",
      bookingUrl: "https://japanrailpass.net",
      notes: ["Covered by JR Pass", "Reserve seats in advance"],
    },
  },
  {
    city: "Hiroshima",
    country: "Japan",
    coordinates: [34.3853, 132.4553],
    transport: {
      type: "train",
      price: 65,
      duration: "1h 45m",
      operator: "JR Shinkansen",
      bookingUrl: "https://japanrailpass.net",
      notes: ["Covered by JR Pass", "Reserve seats in advance"],
    },
  },
  {
    city: "Fukuoka",
    country: "Japan",
    coordinates: [33.5902, 130.4017],
    transport: {
      type: "ferry",
      price: 90,
      duration: "3h 10m",
      operator: "JR Beetle Ferry",
      bookingUrl: "https://www.jrbeetle.co.jp/english/",
      notes: [
        "High-speed ferry service",
        "Multiple daily departures",
        "Check-in 1 hour before",
        "Passport required",
        "Weather-dependent schedule",
      ],
    },
  },
  {
    city: "Busan",
    country: "Korea",
    coordinates: [35.1796, 129.0756],
    transport: {
      type: "train",
      price: 55,
      duration: "2h 45m",
      operator: "KTX",
      bookingUrl: "https://www.letskorail.com/ebizbf/EbizBfKrPassAbout.do",
      notes: ["Covered by KR Pass", "Reserve seats"],
    },
  },
  {
    city: "Seoul",
    country: "Korea",
    coordinates: [37.5665, 126.978],
    transport: {
      type: "bus",
      price: 6,
      duration: "1h",
      operator: "ITX/Bus",
      bookingUrl: "https://www.visitkorea.or.kr",
      notes: ["Regular departures", "No booking needed"],
    },
  },
  {
    city: "Gapyeong",
    country: "Korea",
    coordinates: [37.8315, 127.5146],
    transport: {
      type: "bus",
      price: 12,
      duration: "1h 15m",
      operator: "Airport Limousine",
      bookingUrl: "https://www.airport.kr/ap/en/index.do",
      notes: ["Regular service to airport", "T-money card accepted"],
    },
  },
  {
    city: "Incheon",
    country: "Korea",
    coordinates: [37.4563, 126.7052],
    transport: {
      type: "plane",
      price: 900,
      duration: "10h 30m",
      operator: "Korean Air/Asiana",
      bookingUrl: "https://www.google.com/travel/flights",
      notes: [
        "Direct flights available",
        "Book 3-4 months ahead",
        "Evening departure recommended",
      ],
    },
  },
  {
    city: "Los Angeles",
    country: "USA",
    coordinates: [34.0522, -118.2437],
    transport: {
      type: "plane",
      price: 0,
      duration: "",
      operator: "",
    },
  },
];

const getTransportIcon = (type: RouteStop["transport"]["type"]) => {
  switch (type) {
    case "plane":
      return Plane;
    case "train":
      return Train;
    case "ferry":
      return Ship;
    case "bus":
      return Bus;
    default:
      return MapPin;
  }
};

// Add a mapping of cities to coordinates
const cityCoordinates: Record<string, [number, number]> = {
  Tokyo: [35.6762, 139.6503],
  Kyoto: [35.0116, 135.7681],
  Osaka: [34.6937, 135.5023],
  Seoul: [37.5665, 126.978],
  Busan: [35.1796, 129.0756],
  // Add other cities as needed
};

// Add style prop to interface
interface ItineraryMarkerProps {
  item: ItineraryItem;
  isHovered: boolean;
  onClick: () => void;
  onMouseEnter: () => void;
  onMouseLeave: () => void;
  style?: React.CSSProperties;
}

const ItineraryMarker = memo(
  ({
    item,
    isHovered,
    onClick,
    onMouseEnter,
    onMouseLeave,
    style,
  }: ItineraryMarkerProps) => {
    // Determine marker style based on item category
    const getMarkerStyle = () => {
      switch (item.category) {
        case "Accommodation":
          return "bg-blue-400 hover:bg-blue-500";
        case "Transportation":
          return "bg-green-400 hover:bg-green-500";
        default:
          return "bg-rose-400 hover:bg-rose-500";
      }
    };

    return (
      <div
        className={`absolute transform -translate-x-1/2 -translate-y-1/2 
        transition-all duration-300 z-20
        ${isHovered ? "scale-110" : "scale-100"}`}
        style={style}
      >
        <div
          className={`p-2 rounded-full cursor-pointer shadow-md
          ${
            isHovered
              ? getMarkerStyle().replace("400", "500")
              : getMarkerStyle()
          }`}
          onClick={onClick}
          onMouseEnter={onMouseEnter}
          onMouseLeave={onMouseLeave}
        >
          <span className="text-lg">{item.emoji}</span>
        </div>
        {isHovered && (
          <div className="absolute left-1/2 bottom-full mb-2 -translate-x-1/2 w-48">
            <div className="bg-white rounded-lg shadow-lg p-3 text-sm">
              <div className="font-medium text-gray-800">{item.name}</div>
              <div className="text-gray-600">{item.description}</div>
              {item.price && (
                <div className="text-rose-500 font-medium">${item.price}</div>
              )}
              {item.duration && (
                <div className="text-gray-500 text-xs">
                  Duration: {item.duration}
                </div>
              )}
              {item.category && (
                <div className="text-gray-500 text-xs mt-1">
                  {item.category}
                </div>
              )}
              {item.bookingUrl && (
                <a
                  href={item.bookingUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="mt-2 text-blue-500 hover:text-blue-600 inline-flex items-center gap-1"
                >
                  Book now
                  <ExternalLink className="w-3 h-3" />
                </a>
              )}
            </div>
          </div>
        )}
      </div>
    );
  }
);

ItineraryMarker.displayName = "ItineraryMarker";

const TravelRoute = memo(
  ({ itineraryItems }: { itineraryItems: ItineraryItem[] }) => {
    const [selectedStopIndex, setSelectedStopIndex] = useState<number>(-1);
    const [hoveredItemId, setHoveredItemId] = useState<string | null>(null);

    // Group itinerary items by location for better organization
    const itemsByLocation = itineraryItems.reduce((acc, item) => {
      const coords = cityCoordinates[item.place];
      if (coords) {
        if (!acc[item.place]) {
          acc[item.place] = [];
        }
        acc[item.place].push(item);
      }
      return acc;
    }, {} as Record<string, ItineraryItem[]>);

    // Calculate marker positions with offset to prevent overlap
    const getMarkerPosition = (place: string, index: number, total: number) => {
      const baseCoords = cityCoordinates[place];
      if (!baseCoords) return null;

      // If there's only one item, place it at the center
      if (total === 1) return baseCoords;

      // Calculate offset based on index and total items
      const radius = 0.5; // Adjust this value to change the spread
      const angle = (2 * Math.PI * index) / total;
      const offsetX = radius * Math.cos(angle);
      const offsetY = radius * Math.sin(angle);

      return [baseCoords[0] + offsetX, baseCoords[1] + offsetY];
    };

    const totalCost = routeData.reduce(
      (sum, stop) => sum + stop.transport.price,
      0
    );

    const renderFerryOptions = () => (
      <div className="mt-6 space-y-4">
        <h3 className="text-lg font-semibold text-gray-800">
          Japan-Korea Ferry Options
        </h3>
        <div className="grid gap-4">
          {ferryRoutes.map((ferry) => (
            <motion.div
              key={ferry.route}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              className="bg-gray-50 rounded-lg p-4"
            >
              <div className="flex justify-between items-start">
                <div>
                  <h4 className="font-medium text-gray-800">
                    {ferry.operator}
                  </h4>
                  <p className="text-sm text-gray-600">{ferry.route}</p>
                </div>
                <a
                  href={ferry.website}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-blue-500 hover:text-blue-600 text-sm flex items-center gap-1"
                >
                  Book now
                  <ExternalLink className="w-3 h-3" />
                </a>
              </div>
              <div className="mt-3 grid grid-cols-2 gap-4 text-sm">
                <div>
                  <span className="text-gray-500">Duration:</span>{" "}
                  <span className="text-gray-700">{ferry.duration}</span>
                </div>
                <div>
                  <span className="text-gray-500">Frequency:</span>{" "}
                  <span className="text-gray-700">{ferry.frequency}</span>
                </div>
              </div>
              <div className="mt-2">
                <span className="text-gray-500 text-sm">Prices from:</span>
                <div className="mt-1 grid grid-cols-3 gap-2">
                  {Object.entries(ferry.price).map(([type, price]) => (
                    <div
                      key={type}
                      className="bg-white rounded p-2 text-center text-sm"
                    >
                      <div className="text-gray-600 capitalize">{type}</div>
                      <div className="text-rose-500 font-semibold">
                        ${price}
                      </div>
                    </div>
                  ))}
                </div>
              </div>
              <ul className="mt-3 space-y-1">
                {ferry.notes.map((note, idx) => (
                  <li
                    key={idx}
                    className="text-sm text-gray-600 flex items-center gap-2"
                  >
                    <span className="w-1 h-1 rounded-full bg-rose-400" />
                    {note}
                  </li>
                ))}
              </ul>
              <a
                href={ferry.schedule}
                target="_blank"
                rel="noopener noreferrer"
                className="mt-3 text-sm text-gray-500 hover:text-gray-600 flex items-center gap-1"
              >
                <Calendar className="w-3 h-3" />
                View schedule
              </a>
            </motion.div>
          ))}
        </div>
      </div>
    );

    return (
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="bg-white rounded-2xl shadow-xl p-6"
      >
        <h2 className="text-2xl font-bold text-gray-800 mb-6">Travel Route</h2>

        <div className="mb-8 relative">
          <InteractiveMap
            locations={routeData}
            onLocationSelect={(location) => {
              const index = routeData.findIndex(
                (stop) => stop.city === location.city
              );
              setSelectedStopIndex(index);
            }}
            selectedIndex={selectedStopIndex}
          >
            {/* Render itinerary markers */}
            {Object.entries(itemsByLocation).map(([place, items]) =>
              items.map((item, idx) => {
                const coords = getMarkerPosition(place, idx, items.length);
                if (!coords) return null;

                const itemId = `${item.country}-${item.place}-${item.name}`;

                return (
                  <ItineraryMarker
                    key={itemId}
                    item={item}
                    isHovered={hoveredItemId === itemId}
                    onClick={() => {
                      if (item.bookingUrl) {
                        window.open(item.bookingUrl, "_blank");
                      }
                    }}
                    onMouseEnter={() => setHoveredItemId(itemId)}
                    onMouseLeave={() => setHoveredItemId(null)}
                    style={{
                      left: `${coords[1]}%`,
                      top: `${coords[0]}%`,
                    }}
                  />
                );
              })
            )}
          </InteractiveMap>
        </div>

        <div className="space-y-6">
          {routeData.slice(0, -1).map((stop, index) => {
            const nextStop = routeData[index + 1];
            const TransportIcon = getTransportIcon(stop.transport.type);
            const isSelected = selectedStopIndex === index;

            return (
              <motion.div
                key={`${stop.city}-${index}`}
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: index * 0.1 }}
                className={`border-l-2 pl-4 ml-2 transition-colors duration-300
                ${isSelected ? "border-rose-500" : "border-rose-100"}`}
                onClick={() => setSelectedStopIndex(index)}
              >
                <div className="flex items-start gap-4">
                  <motion.div
                    whileHover={{ scale: 1.1 }}
                    className={`w-8 h-8 rounded-full flex items-center justify-center -ml-6
                    ${isSelected ? "bg-rose-500" : "bg-rose-50"}`}
                  >
                    <MapPin
                      className={`w-4 h-4 ${
                        isSelected ? "text-white" : "text-rose-500"
                      }`}
                    />
                  </motion.div>
                  <div className="flex-1">
                    <h3 className="font-semibold text-gray-800">
                      {stop.city}, {stop.country}
                    </h3>

                    <div className="mt-3 bg-gray-50 rounded-lg p-3">
                      <div className="flex items-center gap-2 text-gray-600">
                        <TransportIcon className="w-4 h-4 text-rose-500" />
                        <span className="font-medium">To {nextStop.city}:</span>
                        <span className="text-rose-500 font-semibold">
                          ${stop.transport.price}
                        </span>
                      </div>
                      <div className="mt-1 text-sm text-gray-500">
                        {stop.transport.operator} • {stop.transport.duration}
                      </div>
                      {stop.transport.notes && (
                        <ul className="mt-2 space-y-1">
                          {stop.transport.notes.map((note, idx) => (
                            <li
                              key={idx}
                              className="text-sm text-gray-600 flex items-center gap-1"
                            >
                              <span className="w-1 h-1 rounded-full bg-rose-400" />
                              {note}
                            </li>
                          ))}
                        </ul>
                      )}
                      {stop.transport.bookingUrl && (
                        <a
                          href={stop.transport.bookingUrl}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="mt-2 text-sm text-blue-500 hover:text-blue-600 inline-flex items-center gap-1"
                        >
                          Check availability
                          <ExternalLink className="w-3 h-3" />
                        </a>
                      )}
                    </div>
                  </div>
                </div>
              </motion.div>
            );
          })}
        </div>

        {renderFerryOptions()}

        <div className="mt-8 pt-6 border-t border-gray-100">
          <div className="flex justify-between items-center">
            <span className="text-lg font-semibold text-gray-700">
              Total Transportation Cost
            </span>
            <span className="text-2xl font-bold text-rose-500">
              ${totalCost}
            </span>
          </div>
          <p className="mt-2 text-sm text-gray-500">
            * Prices are estimates based on average costs. Consider getting a JR
            Pass ($234/7 days) for Japan and a KR Pass ($91/3 days) for Korea to
            reduce costs.
          </p>
        </div>
      </motion.div>
    );
  }
);

TravelRoute.displayName = "TravelRoute";

export default TravelRoute;
