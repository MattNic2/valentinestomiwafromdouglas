import { memo, useEffect, useRef, useState } from "react";
import { Loader } from "@googlemaps/js-api-loader";
import { MapPin, Cloud, Thermometer, Droplets, Wind } from "lucide-react";
import Image from "next/image";

interface Location {
  city: string;
  country: string;
  coordinates: [number, number];
}

interface InteractiveMapProps {
  locations: Location[];
  onLocationSelect?: (location: Location) => void;
  selectedIndex?: number;
}

const InteractiveMap = memo(
  ({ locations, onLocationSelect, selectedIndex }: InteractiveMapProps) => {
    const mapRef = useRef<HTMLDivElement>(null);
    const markersRef = useRef<google.maps.Marker[]>([]);
    const infoWindowsRef = useRef<google.maps.InfoWindow[]>([]);
    const [map, setMap] = useState<google.maps.Map | null>(null);
    const [markers, setMarkers] = useState<google.maps.Marker[]>([]);
    const [infoWindows, setInfoWindows] = useState<google.maps.InfoWindow[]>(
      []
    );
    const [isLoading, setIsLoading] = useState(true);

    useEffect(() => {
      const initializeMap = async () => {
        if (!mapRef.current || !locations.length) return;

        try {
          setIsLoading(true);

          const loader = new Loader({
            apiKey: process.env.NEXT_PUBLIC_GOOGLE_MAPS_API_KEY || "",
            version: "weekly",
            libraries: ["places"],
          });

          await loader.load();

          const bounds = new google.maps.LatLngBounds();
          locations.forEach(({ coordinates }) => {
            bounds.extend({ lat: coordinates[0], lng: coordinates[1] });
          });

          const mapInstance = new google.maps.Map(mapRef.current, {
            center: bounds.getCenter(),
            zoom: 4,
            styles: [
              {
                featureType: "water",
                elementType: "geometry",
                stylers: [{ color: "#e9e9e9" }, { lightness: 17 }],
              },
              {
                featureType: "landscape",
                elementType: "geometry",
                stylers: [{ color: "#f5f5f5" }, { lightness: 20 }],
              },
              {
                featureType: "poi",
                elementType: "geometry",
                stylers: [{ color: "#f5f5f5" }, { lightness: 21 }],
              },
            ],
          });

          mapInstance.fitBounds(bounds, 50);

          const path = new google.maps.Polyline({
            path: locations.map(({ coordinates }) => ({
              lat: coordinates[0],
              lng: coordinates[1],
            })),
            geodesic: true,
            strokeColor: "#FB7185",
            strokeOpacity: 1.0,
            strokeWeight: 3,
          });

          path.setMap(mapInstance);

          const newMarkers: google.maps.Marker[] = [];
          const newInfoWindows: google.maps.InfoWindow[] = [];

          locations.forEach((location) => {
            const marker = new google.maps.Marker({
              position: {
                lat: location.coordinates[0],
                lng: location.coordinates[1],
              },
              map: mapInstance,
              title: location.city,
              animation: google.maps.Animation.DROP,
              icon: {
                path: google.maps.SymbolPath.CIRCLE,
                scale: 8,
                fillColor: "#FB7185",
                fillOpacity: 1,
                strokeColor: "#ffffff",
                strokeWeight: 2,
              },
            });

            const infoWindow = new google.maps.InfoWindow({
              content: `
                <div class="p-2">
                  <h3 class="font-semibold">${location.city}, ${location.country}</h3>
                </div>
              `,
            });

            marker.addListener("click", () => {
              newInfoWindows.forEach((window) => window.close());
              infoWindow.open(mapInstance, marker);
              onLocationSelect?.(location);
            });

            newMarkers.push(marker);
            newInfoWindows.push(infoWindow);
          });

          setMap(mapInstance);
          setMarkers(newMarkers);
          setInfoWindows(newInfoWindows);
          markersRef.current = newMarkers;
          infoWindowsRef.current = newInfoWindows;
        } catch (error) {
          console.error("Error initializing map:", error);
        } finally {
          setIsLoading(false);
        }
      };

      initializeMap();

      return () => {
        markersRef.current.forEach((marker) => marker.setMap(null));
        infoWindowsRef.current.forEach((window) => window.close());
      };
    }, [locations, onLocationSelect]);

    useEffect(() => {
      if (
        !isLoading &&
        selectedIndex !== undefined &&
        selectedIndex >= 0 &&
        selectedIndex < markers.length &&
        markers[selectedIndex] &&
        locations[selectedIndex]
      ) {
        map?.panTo(markers[selectedIndex].getPosition()!);
        map?.setZoom(12);
        infoWindows.forEach((window) => window.close());
        infoWindows[selectedIndex]?.open(map, markers[selectedIndex]);
      }
    }, [selectedIndex, markers, infoWindows, map, isLoading, locations]);

    return (
      <div className="relative h-[400px] rounded-xl overflow-hidden">
        <div ref={mapRef} className="w-full h-full" />
        {!isLoading &&
          selectedIndex !== undefined &&
          locations[selectedIndex] && (
            <div className="absolute bottom-4 left-4 bg-white/90 backdrop-blur-sm p-4 rounded-lg shadow-lg">
              <div className="flex items-center gap-2">
                <div>
                  <h4 className="font-semibold">
                    {locations[selectedIndex].city}
                  </h4>
                  <p className="text-sm text-gray-600">
                    {locations[selectedIndex].country}
                  </p>
                </div>
              </div>
            </div>
          )}
      </div>
    );
  }
);

InteractiveMap.displayName = "InteractiveMap";

export default InteractiveMap;
