import { memo, useState } from "react";
import {
  Building2,
  Hotel,
  Home,
  Tent,
  DollarSign,
  ExternalLink,
  Star,
  Camera,
  X,
  ChevronLeft,
  ChevronRight,
} from "lucide-react";
import type { LucideIcon } from "lucide-react";
import Image from "next/image";
import { ItineraryItem } from "../data/destinations";
import { Dialog, Transition } from "@headlessui/react";
import { Fragment } from "react";

interface AccommodationType {
  id: string;
  city: string;
  country: string;
  name: string;
  type: "hotel" | "hostel" | "apartment" | "ryokan";
  pricePerNight: number;
  rating: number;
  amenities: string[];
  location: string;
  bookingUrl?: string;
  notes?: string[];
  icon: LucideIcon;
  images: {
    url: string;
    alt: string;
  }[];
  reviews: {
    author: string;
    rating: number;
    date: string;
    comment: string;
    language?: string;
  }[];
}

const validateImageUrl = (url: string): string => {
  try {
    new URL(url);
    // Add Unsplash parameters if missing
    if (url.includes("unsplash.com") && !url.includes("auto=format")) {
      const separator = url.includes("?") ? "&" : "?";
      return `${url}${separator}auto=format&q=80&w=1200`;
    }
    return url;
  } catch (e) {
    return "https://images.unsplash.com/photo-1581093458791-9f3c3900df4b?auto=format&q=80&w=1200";
  }
};

const accommodationData: Record<string, AccommodationType[]> = {
  Japan: [
    {
      id: "tokyo-hotel-mid",
      city: "Tokyo",
      country: "Japan",
      name: "Mid-Range Hotel in Shinjuku",
      type: "hotel",
      pricePerNight: 150,
      rating: 4,
      amenities: [
        "Free WiFi",
        "Air Conditioning",
        "Private Bath",
        "24h Front Desk",
      ],
      location: "5 min from Shinjuku Station",
      bookingUrl: "https://www.booking.com",
      notes: ["Great location for nightlife", "Airport shuttle available"],
      icon: Hotel,
      images: [
        {
          url: validateImageUrl(
            "https://images.unsplash.com/photo-1503899036084-c55cdd92da26"
          ),
          alt: "Shinjuku Hotel Room View",
        },
      ],
      reviews: [
        {
          author: "Sarah M.",
          rating: 4.5,
          date: "2024-02",
          comment:
            "Perfect location, amazing city views. Staff was very helpful with JR Pass activation.",
          language: "English",
        },
        {
          author: "田中さん",
          rating: 4,
          date: "2024-01",
          comment: "便利な立地で、部屋からの夜景が素晴らしかったです。",
          language: "Japanese",
        },
      ],
    },
    {
      id: "tokyo-hostel",
      city: "Tokyo",
      country: "Japan",
      name: "Capsule Hotel in Shibuya",
      type: "hostel",
      pricePerNight: 40,
      rating: 4.2,
      amenities: ["Free WiFi", "Shared Bath", "Locker", "Common Area"],
      location: "Near Shibuya Crossing",
      notes: ["Perfect for solo travelers", "Female-only floors available"],
      icon: Building2,
      images: [
        {
          url: validateImageUrl(
            "https://images.unsplash.com/photo-1590856029826-c7a73142bbf1"
          ),
          alt: "Capsule Hotel",
        },
      ],
      reviews: [],
    },
    {
      id: "kyoto-ryokan",
      city: "Kyoto",
      country: "Japan",
      name: "Traditional Ryokan",
      type: "ryokan",
      pricePerNight: 200,
      rating: 4.8,
      amenities: [
        "Breakfast Included",
        "Onsen",
        "Yukata Provided",
        "Garden View",
      ],
      location: "Gion District",
      bookingUrl: "https://www.japanican.com",
      notes: [
        "Authentic Japanese experience",
        "Traditional breakfast included",
      ],
      icon: Home,
      images: [
        {
          url: validateImageUrl(
            "https://images.unsplash.com/photo-1578469645742-46cae010e5d4"
          ),
          alt: "Traditional Ryokan Room",
        },
        {
          url: validateImageUrl(
            "https://images.unsplash.com/photo-1578469645642-a1dd11c29456"
          ),
          alt: "Ryokan Garden View",
        },
      ],
      reviews: [
        {
          author: "Emma L.",
          rating: 5,
          date: "2024-03",
          comment:
            "An incredible authentic experience. The onsen and traditional breakfast were highlights!",
          language: "English",
        },
      ],
    },
    {
      id: "osaka-apartment",
      city: "Osaka",
      country: "Japan",
      name: "Modern Apartment in Namba",
      type: "apartment",
      pricePerNight: 120,
      rating: 4.5,
      amenities: ["Kitchen", "Washing Machine", "Free WiFi", "Balcony"],
      location: "Heart of Dotonbori",
      notes: ["Great for longer stays", "Close to food district"],
      icon: Building2,
      images: [],
      reviews: [],
    },
  ],
  Korea: [
    {
      id: "seoul-hotel-mid",
      city: "Seoul",
      country: "Korea",
      name: "Boutique Hotel in Myeongdong",
      type: "hotel",
      pricePerNight: 130,
      rating: 4.3,
      amenities: ["Free WiFi", "Breakfast", "Airport Shuttle", "Gym"],
      location: "Myeongdong Shopping Area",
      bookingUrl: "https://www.booking.com",
      notes: ["Great for shopping", "Airport bus stop nearby"],
      icon: Hotel,
      images: [
        {
          url: validateImageUrl(
            "https://images.unsplash.com/photo-1617541086271-4d43983704bd"
          ),
          alt: "Seoul Hotel View",
        },
      ],
      reviews: [],
    },
    {
      id: "seoul-guesthouse",
      city: "Seoul",
      country: "Korea",
      name: "Traditional Hanok Guesthouse",
      type: "ryokan",
      pricePerNight: 80,
      rating: 4.6,
      amenities: [
        "Traditional Breakfast",
        "Garden",
        "Cultural Activities",
        "Hanbok Rental",
      ],
      location: "Bukchon Hanok Village",
      notes: ["Cultural experience", "Photo opportunities"],
      icon: Home,
      images: [],
      reviews: [],
    },
    {
      id: "busan-hotel",
      city: "Busan",
      country: "Korea",
      name: "Beachfront Hotel in Haeundae",
      type: "hotel",
      pricePerNight: 160,
      rating: 4.4,
      amenities: ["Ocean View", "Pool", "Restaurant", "Beach Access"],
      location: "Haeundae Beach",
      bookingUrl: "https://www.booking.com",
      notes: ["Beautiful ocean views", "Close to subway"],
      icon: Hotel,
      images: [],
      reviews: [],
    },
  ],
};

const ImageGallery = memo(
  ({ images }: { images: AccommodationType["images"] }) => {
    const [selectedImage, setSelectedImage] = useState(0);

    // If no images, don't render the gallery
    if (!images || images.length === 0) {
      return null;
    }

    // Ensure the image URL exists before rendering
    const currentImage = images[selectedImage];
    if (!currentImage?.url) {
      return null;
    }

    return (
      <div className="relative mt-4 rounded-lg overflow-hidden">
        <div className="aspect-video relative">
          <Image
            src={currentImage.url}
            alt={currentImage.alt || "Accommodation image"}
            fill
            className="object-cover"
            sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
            onError={(e) => {
              // Fallback for failed image loads
              (e.target as HTMLImageElement).src =
                "https://images.unsplash.com/photo-1581093458791-9f3c3900df4b?auto=format&q=80&w=1200";
            }}
          />
        </div>
        {images.length > 1 && (
          <div className="absolute bottom-2 right-2 flex gap-1">
            {images.map((_, idx) => (
              <button
                key={idx}
                onClick={() => setSelectedImage(idx)}
                className={`w-2 h-2 rounded-full transition-colors
                ${idx === selectedImage ? "bg-white" : "bg-white/50"}`}
              />
            ))}
          </div>
        )}
      </div>
    );
  }
);

ImageGallery.displayName = "ImageGallery";

const ReviewSection = memo(
  ({ reviews }: { reviews: AccommodationType["reviews"] }) => {
    const [showAll, setShowAll] = useState(false);
    const displayReviews = showAll ? reviews : reviews.slice(0, 2);

    return (
      <div className="mt-4">
        <h5 className="text-sm font-medium text-gray-700 mb-2">
          Guest Reviews
        </h5>
        <div className="space-y-3">
          {displayReviews.map((review, idx) => (
            <div key={idx} className="text-sm">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <span className="font-medium text-gray-700">
                    {review.author}
                  </span>
                  {review.language && (
                    <span className="text-xs text-gray-500">
                      ({review.language})
                    </span>
                  )}
                </div>
                <div className="flex items-center gap-1">
                  <Star className="w-4 h-4 fill-yellow-400 text-yellow-400" />
                  <span className="text-gray-600">{review.rating}</span>
                </div>
              </div>
              <p className="text-gray-600 mt-1">{review.comment}</p>
              <span className="text-gray-400 text-xs">{review.date}</span>
            </div>
          ))}
        </div>
        {reviews.length > 2 && (
          <button
            onClick={() => setShowAll(!showAll)}
            className="mt-2 text-rose-500 text-sm hover:text-rose-600"
          >
            {showAll ? "Show less" : `Show all ${reviews.length} reviews`}
          </button>
        )}
      </div>
    );
  }
);

ReviewSection.displayName = "ReviewSection";

interface AccommodationCardProps {
  accommodation: AccommodationType;
  isSelected: boolean;
  onSelect: () => void;
}

interface ImageGalleryModalProps {
  images: AccommodationType["images"];
  isOpen: boolean;
  onClose: () => void;
}

const ImageGalleryModal = memo(
  ({ images, isOpen, onClose }: ImageGalleryModalProps) => {
    const [currentIndex, setCurrentIndex] = useState(0);

    const handlePrevious = () => {
      setCurrentIndex((prev) => (prev === 0 ? images.length - 1 : prev - 1));
    };

    const handleNext = () => {
      setCurrentIndex((prev) => (prev === images.length - 1 ? 0 : prev + 1));
    };

    return (
      <Transition show={isOpen} as={Fragment}>
        <Dialog onClose={onClose} className="relative z-50">
          <Transition.Child
            as={Fragment}
            enter="ease-out duration-300"
            enterFrom="opacity-0"
            enterTo="opacity-100"
            leave="ease-in duration-200"
            leaveFrom="opacity-100"
            leaveTo="opacity-0"
          >
            <div className="fixed inset-0 bg-black/70" />
          </Transition.Child>

          <div className="fixed inset-0 overflow-y-auto">
            <div className="flex min-h-full items-center justify-center p-4">
              <Transition.Child
                as={Fragment}
                enter="ease-out duration-300"
                enterFrom="opacity-0 scale-95"
                enterTo="opacity-100 scale-100"
                leave="ease-in duration-200"
                leaveFrom="opacity-100 scale-100"
                leaveTo="opacity-0 scale-95"
              >
                <Dialog.Panel className="w-full max-w-4xl transform rounded-2xl bg-white p-6 shadow-xl transition-all">
                  <div className="relative aspect-video mb-4">
                    <Image
                      src={images[currentIndex].url}
                      alt={images[currentIndex].alt}
                      fill
                      className="object-cover rounded-lg"
                      sizes="(max-width: 768px) 100vw, (max-width: 1200px) 80vw, 60vw"
                    />
                    <button
                      onClick={onClose}
                      className="absolute top-4 right-4 p-2 rounded-full bg-black/50 text-white hover:bg-black/70 transition-colors"
                    >
                      <X className="w-4 h-4" />
                    </button>
                    {images.length > 1 && (
                      <>
                        <button
                          onClick={handlePrevious}
                          className="absolute left-4 top-1/2 -translate-y-1/2 p-2 rounded-full bg-black/50 text-white hover:bg-black/70 transition-colors"
                        >
                          <ChevronLeft className="w-4 h-4" />
                        </button>
                        <button
                          onClick={handleNext}
                          className="absolute right-4 top-1/2 -translate-y-1/2 p-2 rounded-full bg-black/50 text-white hover:bg-black/70 transition-colors"
                        >
                          <ChevronRight className="w-4 h-4" />
                        </button>
                      </>
                    )}
                  </div>
                  <p className="text-sm text-gray-600">
                    {images[currentIndex].alt}
                  </p>
                  {images.length > 1 && (
                    <div className="mt-4 flex gap-2 overflow-x-auto pb-2">
                      {images.map((image, idx) => (
                        <button
                          key={idx}
                          onClick={() => setCurrentIndex(idx)}
                          className={`relative w-20 aspect-video flex-shrink-0 rounded-lg overflow-hidden
                          ${
                            idx === currentIndex
                              ? "ring-2 ring-rose-500"
                              : "opacity-60"
                          }`}
                        >
                          <Image
                            src={image.url}
                            alt={image.alt}
                            fill
                            className="object-cover"
                            sizes="80px"
                          />
                        </button>
                      ))}
                    </div>
                  )}
                </Dialog.Panel>
              </Transition.Child>
            </div>
          </div>
        </Dialog>
      </Transition>
    );
  }
);

ImageGalleryModal.displayName = "ImageGalleryModal";

const AccommodationCard = memo(
  ({ accommodation, isSelected, onSelect }: AccommodationCardProps) => {
    const [isGalleryOpen, setIsGalleryOpen] = useState(false);
    const [showReviews, setShowReviews] = useState(false);
    const Icon = accommodation.icon;

    return (
      <>
        <button
          onClick={onSelect}
          className={`w-full text-left p-4 rounded-lg transition-all duration-200
          ${
            isSelected
              ? "bg-rose-50 border-2 border-rose-500 shadow-sm"
              : "bg-gray-50 border-2 border-transparent hover:border-rose-200"
          }`}
        >
          <div className="flex items-start gap-4">
            <div
              className={`p-2 rounded-lg ${
                isSelected ? "bg-rose-500" : "bg-gray-200"
              }`}
            >
              <Icon
                className={`w-6 h-6 ${
                  isSelected ? "text-white" : "text-gray-600"
                }`}
              />
            </div>

            <div className="flex-grow">
              <div className="flex justify-between items-start">
                <div>
                  <div className="flex items-center gap-2">
                    <h4 className="font-medium text-gray-800">
                      {accommodation.name}
                    </h4>
                    {isSelected && (
                      <span className="text-xs px-2 py-0.5 bg-rose-100 text-rose-600 rounded-full">
                        Selected
                      </span>
                    )}
                  </div>
                  <p className="text-sm text-gray-600">
                    {accommodation.location}
                  </p>
                </div>
                <div className="flex flex-col items-end">
                  <div className="flex items-center gap-1 text-rose-500 font-semibold">
                    <DollarSign className="w-4 h-4" />
                    {accommodation.pricePerNight}
                    <span className="text-sm text-gray-500 font-normal">
                      /night
                    </span>
                  </div>
                  <div className="flex items-center gap-1 mt-1">
                    <Star className="w-4 h-4 text-yellow-400 fill-yellow-400" />
                    <span className="text-sm text-gray-600">
                      {accommodation.rating}
                    </span>
                  </div>
                </div>
              </div>

              <div className="mt-2 flex flex-wrap gap-2">
                {accommodation.amenities.slice(0, 4).map((amenity, idx) => (
                  <span
                    key={idx}
                    className="text-xs px-2 py-1 bg-gray-100 text-gray-600 rounded-full"
                  >
                    {amenity}
                  </span>
                ))}
              </div>

              {accommodation.notes && (
                <ul className="mt-2 space-y-1">
                  {accommodation.notes.map((note, idx) => (
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

              <div className="mt-3 flex items-center justify-between">
                <div className="flex items-center gap-4">
                  {accommodation.bookingUrl && (
                    <a
                      href={accommodation.bookingUrl}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="text-sm text-blue-500 hover:text-blue-600 inline-flex items-center gap-1"
                      onClick={(e) => e.stopPropagation()}
                    >
                      Check availability
                      <ExternalLink className="w-3 h-3" />
                    </a>
                  )}
                  {accommodation.images.length > 0 && (
                    <button
                      className="text-sm text-gray-500 hover:text-gray-600 inline-flex items-center gap-1"
                      onClick={(e) => {
                        e.stopPropagation();
                        setIsGalleryOpen(true);
                      }}
                    >
                      <Camera className="w-4 h-4" />
                      View photos ({accommodation.images.length})
                    </button>
                  )}
                </div>
                {accommodation.reviews.length > 0 && (
                  <button
                    className="text-sm text-gray-500 hover:text-gray-600"
                    onClick={(e) => {
                      e.stopPropagation();
                      setShowReviews(!showReviews);
                    }}
                  >
                    {showReviews
                      ? "Hide reviews"
                      : `Show ${accommodation.reviews.length} reviews`}
                  </button>
                )}
              </div>
            </div>
          </div>

          {showReviews && accommodation.reviews.length > 0 && (
            <div className="mt-4 border-t border-gray-100 pt-4">
              <ReviewSection reviews={accommodation.reviews} />
            </div>
          )}
        </button>

        {accommodation.images.length > 0 && (
          <ImageGalleryModal
            images={accommodation.images}
            isOpen={isGalleryOpen}
            onClose={() => setIsGalleryOpen(false)}
          />
        )}
      </>
    );
  }
);

AccommodationCard.displayName = "AccommodationCard";

interface AccommodationCostsProps {
  onSelectAccommodation: (item: ItineraryItem) => void;
  selectedAccommodations: Set<string>;
}

const AccommodationCosts = memo(
  ({
    onSelectAccommodation,
    selectedAccommodations,
  }: AccommodationCostsProps) => {
    const totalSelected = Array.from(selectedAccommodations).reduce(
      (total, id) => {
        const accommodation = Object.values(accommodationData)
          .flat()
          .find((a) => a.id === id);
        return total + (accommodation?.pricePerNight || 0);
      },
      0
    );

    return (
      <div className="bg-white rounded-2xl shadow-xl p-6">
        <div className="flex justify-between items-center mb-6">
          <div>
            <h2 className="text-2xl font-bold text-gray-800">
              Accommodation Options
            </h2>
            <p className="text-sm text-gray-500 mt-1">
              Select accommodations for each destination
            </p>
          </div>
          {selectedAccommodations.size > 0 && (
            <span className="text-sm bg-rose-100 text-rose-600 px-3 py-1 rounded-full">
              {selectedAccommodations.size} selected
            </span>
          )}
        </div>

        <div className="space-y-8">
          {Object.entries(accommodationData).map(
            ([country, accommodations]) => (
              <div key={country} className="space-y-4">
                <div className="flex items-center justify-between">
                  <h3 className="text-xl font-semibold text-gray-700">
                    {country}
                  </h3>
                  <span className="text-sm text-gray-500">
                    {accommodations.length} options
                  </span>
                </div>
                <div className="grid gap-4">
                  {accommodations.map((accommodation) => (
                    <AccommodationCard
                      key={accommodation.id}
                      accommodation={accommodation}
                      isSelected={selectedAccommodations.has(accommodation.id)}
                      onSelect={() =>
                        onSelectAccommodation({
                          name: accommodation.name,
                          description: `${accommodation.type} in ${accommodation.location}`,
                          emoji:
                            accommodation.type === "hotel"
                              ? "🏨"
                              : accommodation.type === "hostel"
                              ? "🛏️"
                              : accommodation.type === "ryokan"
                              ? "🏯"
                              : "🏠",
                          price: accommodation.pricePerNight,
                          country: accommodation.country,
                          place: accommodation.city,
                          duration: "1 night",
                          category: "Accommodation",
                          bookingUrl: accommodation.bookingUrl,
                          tips: accommodation.notes,
                        })
                      }
                    />
                  ))}
                </div>
              </div>
            )
          )}
        </div>

        {selectedAccommodations.size > 0 && (
          <div className="mt-6 pt-4 border-t border-gray-100">
            <div className="flex justify-between items-center">
              <div>
                <span className="text-gray-600">Total Per Night:</span>
                <span className="text-sm text-gray-500 block mt-1">
                  {selectedAccommodations.size} accommodation
                  {selectedAccommodations.size !== 1 ? "s" : ""} selected
                </span>
              </div>
              <div className="text-right">
                <span className="text-xl font-bold text-rose-500">
                  ${totalSelected}
                </span>
                <span className="text-sm text-gray-500 block mt-1">
                  per night
                </span>
              </div>
            </div>
            <p className="mt-2 text-sm text-gray-500">
              * Prices are estimates and may vary based on season and
              availability. Consider booking in advance for better rates.
            </p>
          </div>
        )}
      </div>
    );
  }
);

AccommodationCosts.displayName = "AccommodationCosts";

export default AccommodationCosts;
