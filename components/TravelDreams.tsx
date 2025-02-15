"use client";

import { useState, useEffect, useCallback, memo } from "react";
import {
  Plane,
  Heart,
  Star,
  Map,
  Coffee,
  Camera,
  Utensils,
  Moon,
  ChevronDown,
  Plus,
  Minus,
  DollarSign,
  ExternalLink,
  Calendar,
  Train,
  Bus,
  Ship,
} from "lucide-react";
import Image from "next/image";

// Update the import to include types
import {
  destinations,
  Destination,
  getIconComponent,
  Activity,
  Place,
  TransportationType,
  TransportItem,
  ActivityCategory,
  ItineraryItem,
} from "@/data/destinations";

// Add new helper component for collapsible category section
const CategorySection = memo(
  ({
    category,
    activities,
    destination,
    place,
    onActivitySelect,
    selectedActivities,
    isExpanded,
  }: {
    category: string;
    activities: Activity[];
    destination: Destination;
    place: string;
    onActivitySelect: (item: ItineraryItem) => void;
    selectedActivities: Set<string>;
    isExpanded: boolean;
  }) => {
    const [isOpen, setIsOpen] = useState(false);

    return (
      <div className="mb-4">
        <button
          onClick={() => setIsOpen(!isOpen)}
          className="w-full flex items-center justify-between p-2 hover:bg-rose-100 rounded-lg transition-colors"
        >
          <span className="font-medium text-gray-700">{category}</span>
          <ChevronDown
            className={`w-4 h-4 transition-transform duration-300 ${
              isOpen ? "rotate-180" : ""
            }`}
          />
        </button>
        <div
          className={`transition-all duration-300 overflow-hidden ${
            isOpen ? "max-h-[1000px]" : "max-h-0"
          }`}
        >
          <ul className="space-y-3 p-2">
            {activities.map((activity, idx) => {
              const itemId = `${destination.country}-${place}-${activity.name}`;
              const isSelected = selectedActivities.has(itemId);

              return (
                <li
                  key={idx}
                  className="flex items-center gap-3 text-gray-600 group hover:bg-rose-50 p-2 rounded-lg"
                >
                  <button
                    onClick={(e) => {
                      e.preventDefault();
                      onActivitySelect({
                        ...activity,
                        country: destination.country,
                        place: place,
                      });
                    }}
                    className="flex items-center gap-2 flex-1"
                  >
                    <div
                      className={`w-6 h-6 rounded-full flex items-center justify-center
                    ${
                      isSelected
                        ? "bg-rose-500 text-white"
                        : "bg-rose-100 text-rose-500"
                    }`}
                    >
                      {isSelected ? (
                        <Minus className="w-4 h-4" />
                      ) : (
                        <Plus className="w-4 h-4" />
                      )}
                    </div>
                    <span className="group-hover:text-rose-500 transition-colors flex-1">
                      {activity.name}
                    </span>
                    <span className="text-sm text-gray-500 flex items-center gap-1">
                      <DollarSign className="w-3 h-3" />
                      {activity.price}
                    </span>
                    {activity.bookingUrl && (
                      <a
                        href={activity.bookingUrl}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="text-blue-500 hover:text-blue-600"
                        onClick={(e) => e.stopPropagation()}
                      >
                        <ExternalLink className="w-4 h-4" />
                      </a>
                    )}
                  </button>
                </li>
              );
            })}
          </ul>
        </div>
      </div>
    );
  }
);

CategorySection.displayName = "CategorySection";

// Add new helper component for collapsible city section
const CitySection = memo(
  ({
    place,
    destination,
    onActivitySelect,
    selectedActivities,
    isSelected,
  }: {
    place: Place;
    destination: Destination;
    onActivitySelect: (item: ItineraryItem) => void;
    selectedActivities: Set<string>;
    isSelected: boolean;
  }) => {
    const [isOpen, setIsOpen] = useState(false);

    // Group activities by category
    const categorizedActivities = place.activities.reduce((acc, activity) => {
      if (!acc[activity.category]) {
        acc[activity.category] = [];
      }
      acc[activity.category].push(activity);
      return acc;
    }, {} as Record<string, Activity[]>);

    return (
      <div className="border-b border-gray-100 last:border-b-0">
        <button
          onClick={() => setIsOpen(!isOpen)}
          className="w-full p-6 flex items-center justify-between hover:bg-rose-50 transition-colors"
        >
          <div className="flex items-center gap-2">
            <span className="text-2xl">{place.emoji}</span>
            <h3 className="text-xl font-semibold text-gray-800">
              {place.name}
            </h3>
          </div>
          <ChevronDown
            className={`w-5 h-5 transition-transform duration-300 ${
              isOpen ? "rotate-180" : ""
            }`}
          />
        </button>

        <div
          className={`transition-all duration-500 overflow-hidden ${
            isOpen ? "max-h-[5000px]" : "max-h-0"
          }`}
        >
          <div className="px-6 pb-6">
            {place.image && (
              <div className="mb-4 rounded-lg overflow-hidden relative aspect-video">
                <Image
                  src={place.image}
                  alt={place.name}
                  fill
                  className="object-cover hover:scale-105 transition-transform"
                  onError={(e) => {
                    console.error(`Failed to load image for ${place.name}`);
                    // Optionally set a fallback image
                    (e.target as HTMLImageElement).src =
                      "https://images.unsplash.com/photo-1581093458791-9f3c3900df4b?auto=format&q=80&w=1200";
                  }}
                  sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
                />
              </div>
            )}

            {place.description && (
              <p className="text-gray-600 mb-4">{place.description}</p>
            )}

            {Object.entries(categorizedActivities).map(
              ([category, activities]) => (
                <CategorySection
                  key={category}
                  category={category}
                  activities={activities}
                  destination={destination}
                  place={place.name}
                  onActivitySelect={onActivitySelect}
                  selectedActivities={selectedActivities}
                  isExpanded={isSelected}
                />
              )
            )}

            {place.links && (
              <div className="mt-4 flex gap-3">
                {place.links.map((link, idx) => {
                  const IconComponent = getIconComponent(link.iconName);
                  return (
                    <a
                      key={idx}
                      href={link.url}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="inline-flex items-center gap-2 text-sm text-rose-500 hover:text-rose-600"
                    >
                      <IconComponent className="w-4 h-4" />
                      {link.label}
                    </a>
                  );
                })}
              </div>
            )}
          </div>
        </div>
      </div>
    );
  }
);

CitySection.displayName = "CitySection";

// Update the DestinationCard component to use the new CitySection
const DestinationCard = memo(
  ({
    destination,
    isSelected,
    onSelect,
    showContent,
    onActivitySelect,
    selectedActivities,
  }: {
    destination: Destination;
    isSelected: boolean;
    onSelect: () => void;
    showContent: boolean;
    onActivitySelect: (item: ItineraryItem) => void;
    selectedActivities: Set<string>;
  }) => {
    const isJapan = destination.country === "Japan";

    return (
      <div
        className={`bg-white rounded-2xl shadow-xl overflow-hidden transform 
        transition-all duration-500 hover:scale-105 
        ${showContent ? "animate-fade-in-up" : "opacity-0"}`}
      >
        <div
          className={`bg-gradient-to-r p-6 cursor-pointer group relative
          ${
            isJapan ? "from-rose-500 to-red-500" : "from-blue-500 to-indigo-500"
          }`}
          onClick={onSelect}
        >
          {destination.coverImage && (
            <div
              className="absolute inset-0 opacity-20 bg-cover bg-center"
              style={{
                backgroundImage: `url(${destination.coverImage})`,
              }}
            />
          )}

          <div className="relative z-10">
            <div className="flex justify-between items-center">
              <h2 className="text-3xl font-bold text-white mb-2 flex items-center gap-2">
                {destination.country}
                {isJapan ? "🗾" : "🇰🇷"}
              </h2>
              <ChevronDown
                className={`w-6 h-6 text-white transition-transform duration-300
                ${isSelected ? "rotate-180" : "rotate-0"}
                ${!isSelected && "group-hover:translate-y-1"}`}
              />
            </div>
            <p className="text-white/90">
              {isSelected
                ? "Click to collapse"
                : "Click to explore destinations"}
            </p>
          </div>
        </div>

        <div
          className={`transition-all duration-500 overflow-hidden
          ${isSelected ? "max-h-[5000px]" : "max-h-0"}`}
        >
          <div
            className={`transition-opacity duration-500
            ${isSelected ? "opacity-100" : "opacity-0"}`}
          >
            {destination.places.map((place) => (
              <CitySection
                key={place.name}
                place={place}
                destination={destination}
                onActivitySelect={onActivitySelect}
                selectedActivities={selectedActivities}
                isSelected={isSelected}
              />
            ))}
          </div>
        </div>
      </div>
    );
  }
);

DestinationCard.displayName = "DestinationCard";

// Update the FloatingIcon type
const FloatingIcon = memo(
  ({ Icon, delay }: { Icon: React.ElementType; delay: number }) => (
    <Icon
      className={`w-5 h-5 text-rose-400 animate-float-delay-${delay}`}
      style={{ animationDelay: `${delay * 0.75}s` }}
    />
  )
);

FloatingIcon.displayName = "FloatingIcon";

// Add new helper function at the top level
const getTransportIcon = (type: TransportationType) => {
  switch (type) {
    case "flight":
      return Plane;
    case "train":
      return Train;
    case "bus":
      return Bus;
    case "ferry":
      return Ship;
    default:
      return Plane;
  }
};

// Add Itinerary component
const Itinerary = memo(
  ({
    items,
    onRemoveItem,
  }: {
    items: ItineraryItem[];
    onRemoveItem: (item: ItineraryItem) => void;
  }) => {
    const totalCost = items.reduce((sum, item) => sum + (item.price || 0), 0);

    // Separate activities and transport items
    const activities = items.filter(
      (item) => !item.type || item.type === "activity"
    );
    const transportItems = items.filter((item) => item.type === "transport");

    return (
      <div className="bg-white rounded-2xl shadow-xl p-6">
        <h2 className="text-2xl font-bold text-gray-800 mb-4">
          Your Travel Itinerary
        </h2>
        {items.length === 0 ? (
          <p className="text-gray-500">
            Add activities and transportation to start building your itinerary!
          </p>
        ) : (
          <>
            {transportItems.length > 0 && (
              <div className="mb-6">
                <h3 className="font-semibold text-lg text-gray-700 mb-2">
                  Transportation
                </h3>
                <div className="space-y-2">
                  {transportItems.map((item, idx) => {
                    const TransportIcon = item.transportDetails
                      ? getTransportIcon(item.transportDetails.type)
                      : Plane;

                    return (
                      <div
                        key={idx}
                        className="flex items-center justify-between p-2 bg-gray-50 rounded-lg"
                      >
                        <div className="flex items-center gap-2">
                          <TransportIcon className="w-4 h-4 text-gray-600" />
                          <span className="text-gray-600">
                            {item.transportDetails?.from} →{" "}
                            {item.transportDetails?.to}
                          </span>
                        </div>
                        <div className="flex items-center gap-3">
                          <span className="text-sm">${item.price}</span>
                          <button
                            onClick={() => onRemoveItem(item)}
                            className="text-rose-400 hover:text-rose-500"
                          >
                            <Minus className="w-4 h-4" />
                          </button>
                        </div>
                      </div>
                    );
                  })}
                </div>
              </div>
            )}

            <div className="space-y-4 mb-6">
              {Object.entries(
                items.reduce((acc, item) => {
                  if (!acc[item.country]) {
                    acc[item.country] = {};
                  }
                  if (!acc[item.country][item.place]) {
                    acc[item.country][item.place] = [];
                  }
                  acc[item.country][item.place].push(item);
                  return acc;
                }, {} as Record<string, Record<string, ItineraryItem[]>>)
              ).map(([country, places]) => (
                <div key={country} className="border-b pb-4">
                  <h3 className="font-semibold text-lg text-gray-700 mb-2">
                    {country}
                  </h3>
                  {Object.entries(places).map(([place, activities]) => (
                    <div key={place} className="ml-4 mb-2">
                      <h4 className="font-medium text-gray-600 mb-1">
                        {place}
                      </h4>
                      <ul className="space-y-1">
                        {activities.map((activity, idx) => (
                          <li
                            key={idx}
                            className="flex items-center justify-between text-gray-500 ml-4"
                          >
                            <span className="flex items-center gap-2">
                              <span>{activity.emoji}</span>
                              {activity.name}
                            </span>
                            <div className="flex items-center gap-3">
                              <span className="text-sm">${activity.price}</span>
                              <button
                                onClick={() => onRemoveItem(activity)}
                                className="text-rose-400 hover:text-rose-500"
                              >
                                <Minus className="w-4 h-4" />
                              </button>
                            </div>
                          </li>
                        ))}
                      </ul>
                    </div>
                  ))}
                </div>
              ))}
            </div>

            <div className="flex justify-between items-center pt-4 border-t">
              <span className="font-semibold text-gray-700">Total Cost:</span>
              <span className="text-xl font-bold text-rose-500">
                ${totalCost}
              </span>
            </div>
          </>
        )}
      </div>
    );
  }
);

Itinerary.displayName = "Itinerary";

import TravelCosts from "./TravelCosts";
import TravelRoute from "./TravelRoute";
import TravelCalendar from "./TravelCalendar";
import AccommodationCosts from "./AccommodationCosts";
import React from "react";

// Add error boundary component
class ErrorBoundary extends React.Component<
  { children: React.ReactNode },
  { hasError: boolean }
> {
  constructor(props: { children: React.ReactNode }) {
    super(props);
    this.state = { hasError: false };
  }

  static getDerivedStateFromError() {
    return { hasError: true };
  }

  render() {
    if (this.state.hasError) {
      return (
        <div className="p-4 text-red-500">
          Something went wrong loading the travel content.
        </div>
      );
    }

    return this.props.children;
  }
}

const TravelDreams = () => {
  const [isExpanded, setIsExpanded] = useState(false);
  const [showContent, setShowContent] = useState(false);
  const [selectedActivities, setSelectedActivities] = useState<Set<string>>(
    new Set()
  );
  const [itineraryItems, setItineraryItems] = useState<ItineraryItem[]>([]);
  const [selectedTransportCosts, setSelectedTransportCosts] = useState<
    Set<string>
  >(new Set());
  const [calendarEvents, setCalendarEvents] = useState<
    Array<{
      name: string;
      date: string;
    }>
  >([]);
  const [transportItems, setTransportItems] = useState<TransportItem[]>([]);
  const [selectedAccommodations, setSelectedAccommodations] = useState<
    Set<string>
  >(new Set());

  const handleExpandToggle = useCallback(() => {
    setIsExpanded((prev) => !prev);
  }, []);

  const handleActivitySelect = useCallback((item: ItineraryItem) => {
    const itemId = `${item.country}-${item.place}-${item.name}`;

    setSelectedActivities((prev) => {
      const newSet = new Set(prev);
      if (newSet.has(itemId)) {
        newSet.delete(itemId);
        setItineraryItems((items) =>
          items.filter((i) => `${i.country}-${i.place}-${i.name}` !== itemId)
        );
      } else {
        newSet.add(itemId);
        setItineraryItems((items) => [...items, item]);
      }
      return newSet;
    });
  }, []);

  const handleTransportCostSelect = useCallback((item: ItineraryItem) => {
    const itemId = `${item.country}-${item.transportDetails?.from}-${item.transportDetails?.to}`;

    setSelectedTransportCosts((prev) => {
      const newSet = new Set(prev);
      if (newSet.has(itemId)) {
        newSet.delete(itemId);
        setItineraryItems((items) =>
          items.filter(
            (i) =>
              `${i.country}-${i.transportDetails?.from}-${i.transportDetails?.to}` !==
              itemId
          )
        );
      } else {
        newSet.add(itemId);
        setItineraryItems((items) => [...items, item]);
      }
      return newSet;
    });
  }, []);

  const handleAccommodationSelect = useCallback((item: ItineraryItem) => {
    const itemId = `${item.country}-${item.place}-${item.name}`;

    setSelectedAccommodations((prev) => {
      const newSet = new Set(prev);
      if (newSet.has(itemId)) {
        newSet.delete(itemId);
        setItineraryItems((items) =>
          items.filter((i) => `${i.country}-${i.place}-${i.name}` !== itemId)
        );
      } else {
        newSet.add(itemId);
        setItineraryItems((items) => [...items, item]);
      }
      return newSet;
    });
  }, []);

  const handleCalendarEventUpdate = useCallback(
    (event: { name: string; date: string }) => {
      setCalendarEvents((prev) => [...prev, event]);
    },
    []
  );

  const handleCalendarEventRemove = useCallback(
    (event: { name: string; date: string }) => {
      setCalendarEvents((prev) =>
        prev.filter((e) => e.name !== event.name || e.date !== event.date)
      );
    },
    []
  );

  useEffect(() => {
    setTimeout(() => setShowContent(true), 500);
  }, []);

  return (
    <ErrorBoundary>
      <div className="min-h-screen bg-gradient-to-br from-pink-50 to-red-100 p-8">
        <div className="max-w-6xl mx-auto space-y-12">
          <header
            className={`text-center mb-12 ${
              showContent ? "animate-fade-in-up" : "opacity-0"
            }`}
          >
            <h1 className="text-4xl md:text-5xl font-bold text-rose-600 mb-4 font-serif">
              Our Next Adventure Together 🌸
            </h1>
            <p className="text-lg text-rose-500">
              Let&apos;s make more beautiful memories in Asia
            </p>
            <div className="flex justify-center gap-2 mt-4">
              {[Plane, Heart, Star].map((Icon, i) => (
                <FloatingIcon key={i} Icon={Icon} delay={i + 1} />
              ))}
            </div>
          </header>

          <div className="grid lg:grid-cols-3 gap-8">
            <div className="lg:col-span-2">
              <div className="grid md:grid-cols-2 gap-8">
                {destinations.map((destination) => (
                  <DestinationCard
                    key={destination.country}
                    destination={destination}
                    isSelected={isExpanded}
                    onSelect={handleExpandToggle}
                    showContent={showContent}
                    onActivitySelect={handleActivitySelect}
                    selectedActivities={selectedActivities}
                  />
                ))}
              </div>

              <div className="mt-8">
                <TravelRoute itineraryItems={itineraryItems} />
              </div>

              <div className="mt-8">
                <TravelCosts
                  onSelectCost={handleTransportCostSelect}
                  selectedCosts={selectedTransportCosts}
                />
              </div>

              <div className="mt-8">
                <AccommodationCosts
                  onSelectAccommodation={handleAccommodationSelect}
                  selectedAccommodations={selectedAccommodations}
                />
              </div>
            </div>

            <div className="lg:col-span-1 space-y-8">
              <div className="lg:sticky lg:top-8">
                <Itinerary
                  items={itineraryItems}
                  onRemoveItem={(item) => handleActivitySelect(item)}
                />
              </div>

              <div className="mt-8">
                <TravelCalendar
                  items={itineraryItems}
                  onUpdateEvent={handleCalendarEventUpdate}
                  onRemoveEvent={handleCalendarEventRemove}
                />
              </div>
            </div>
          </div>

          <footer
            className={`text-center mt-12 ${
              showContent ? "animate-fade-in-up" : "opacity-0"
            }`}
          >
            <p className="text-rose-500 font-medium">
              Let&apos;s make these dreams come true together 💝
            </p>
            <div className="flex justify-center gap-4 mt-4">
              {[Map, Camera, Utensils, Coffee, Moon].map((Icon, i) => (
                <FloatingIcon key={i} Icon={Icon} delay={i + 1} />
              ))}
            </div>
          </footer>
        </div>
      </div>
    </ErrorBoundary>
  );
};

TravelDreams.displayName = "TravelDreams";

export default TravelDreams;
