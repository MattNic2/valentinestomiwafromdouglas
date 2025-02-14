import { useState, useCallback } from "react";
import type { TransportCost } from "../types/transport";

export function useTransportCosts() {
  const [selectedCosts, setSelectedCosts] = useState<Set<string>>(new Set());

  const handleCostSelect = useCallback((cost: TransportCost) => {
    setSelectedCosts((prev) => {
      const newSet = new Set(prev);
      if (newSet.has(cost.id)) {
        newSet.delete(cost.id);
      } else {
        newSet.add(cost.id);
      }
      return newSet;
    });
  }, []);

  return {
    selectedCosts,
    handleCostSelect,
  };
}
