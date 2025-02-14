import { useState, useCallback } from "react";
import type { ItineraryItem } from "../types/destinations";

export function useItinerary() {
  const [items, setItems] = useState<ItineraryItem[]>([]);
  const [selectedActivities, setSelectedActivities] = useState<Set<string>>(
    new Set()
  );

  const handleActivitySelect = useCallback((item: ItineraryItem) => {
    const itemId = `${item.country}-${item.place}-${item.name}`;

    setSelectedActivities((prev) => {
      const newSet = new Set(prev);
      if (newSet.has(itemId)) {
        newSet.delete(itemId);
        setItems((items) =>
          items.filter((i) => `${i.country}-${i.place}-${i.name}` !== itemId)
        );
      } else {
        newSet.add(itemId);
        setItems((items) => [...items, item]);
      }
      return newSet;
    });
  }, []);

  return {
    items,
    selectedActivities,
    handleActivitySelect,
  };
}
