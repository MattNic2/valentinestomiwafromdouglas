import { memo } from "react";
import { Plane, Train, Bus, Ship, Minus, Plus, DollarSign } from "lucide-react";
import { ItineraryItem } from "../data/destinations";

interface TransportCost {
  id: string;
  type: "transport";
  from: string;
  to: string;
  country: string;
  name: string;
  description: string;
  price: number;
  duration: string;
  emoji: string;
  icon: React.ElementType;
  note?: string;
  url?: string;
}

interface CostBreakdown {
  category: string;
  items: TransportCost[];
}

interface TravelCostsProps {
  onSelectCost: (item: ItineraryItem) => void;
  selectedCosts: Set<string>;
}

const TravelCosts = memo(
  ({ onSelectCost, selectedCosts }: TravelCostsProps) => {
    const transportCosts: TransportCost[] = [
      {
        id: "tokyo-kyoto-train",
        type: "transport",
        from: "Tokyo",
        to: "Kyoto",
        country: "Japan",
        name: "Tokyo to Kyoto Train",
        description: "Shinkansen Bullet Train",
        price: 140,
        duration: "2h 15m",
        emoji: "🚅",
        icon: Train,
      },
      {
        id: "kyoto-osaka-train",
        type: "transport",
        from: "Kyoto",
        to: "Osaka",
        country: "Japan",
        name: "Kyoto to Osaka Train",
        description: "Local Express Train",
        price: 15,
        duration: "45m",
        emoji: "🚅",
        icon: Train,
      },
      {
        id: "osaka-tokyo-train",
        type: "transport",
        from: "Osaka",
        to: "Tokyo",
        country: "Japan",
        name: "Osaka to Tokyo Train",
        description: "Return Shinkansen",
        price: 140,
        duration: "2h 30m",
        emoji: "🚅",
        icon: Train,
      },
    ];

    const totalSelected = Array.from(selectedCosts).reduce((total, costId) => {
      const cost = transportCosts.find((c) => c.id === costId);
      return total + (cost?.price || 0);
    }, 0);

    return (
      <div className="bg-white rounded-2xl shadow-xl p-6">
        <div className="flex justify-between items-center mb-4">
          <h2 className="text-2xl font-bold text-gray-800">
            Transportation Costs
          </h2>
          {selectedCosts.size > 0 && (
            <span className="text-sm text-gray-500">
              {selectedCosts.size} selected
            </span>
          )}
        </div>

        <div className="space-y-3">
          {transportCosts.map((cost) => (
            <button
              key={cost.id}
              onClick={() =>
                onSelectCost({
                  name: `${cost.from} to ${cost.to}`,
                  description: cost.description,
                  emoji: cost.emoji,
                  price: cost.price,
                  duration: cost.duration,
                  country: cost.country,
                  place: cost.from,
                  type: "transport",
                  transportDetails: {
                    from: cost.from,
                    to: cost.to,
                    type: "train",
                  },
                  category: "Transportation",
                })
              }
              className={`w-full p-4 rounded-lg transition-all duration-200 flex items-center gap-4
              ${
                selectedCosts.has(cost.id)
                  ? "bg-rose-50 border-2 border-rose-500 shadow-sm"
                  : "bg-gray-50 border-2 border-transparent hover:border-rose-200"
              }`}
            >
              <cost.icon
                className={`w-6 h-6 ${
                  selectedCosts.has(cost.id) ? "text-rose-500" : "text-gray-500"
                }`}
              />
              <div className="flex-grow text-left">
                <div className="font-medium text-gray-800 flex items-center gap-2">
                  {cost.from} → {cost.to}
                  {selectedCosts.has(cost.id) && (
                    <span className="text-xs px-2 py-0.5 bg-rose-100 text-rose-600 rounded-full">
                      Selected
                    </span>
                  )}
                </div>
                <div className="text-sm text-gray-600">{cost.description}</div>
              </div>
              <div className="flex flex-col items-end">
                <div className="flex items-center gap-1 text-rose-500 font-medium">
                  <DollarSign className="w-4 h-4" />
                  {cost.price}
                </div>
                <span className="text-xs text-gray-500">{cost.duration}</span>
              </div>
            </button>
          ))}
        </div>

        {selectedCosts.size > 0 && (
          <div className="mt-6 pt-4 border-t border-gray-100">
            <div className="flex justify-between items-center">
              <div>
                <span className="text-gray-600">Total Selected:</span>
                <span className="text-sm text-gray-500 block mt-1">
                  {selectedCosts.size} transport route
                  {selectedCosts.size !== 1 ? "s" : ""}
                </span>
              </div>
              <div className="text-right">
                <span className="text-xl font-bold text-rose-500">
                  ${totalSelected}
                </span>
                <span className="text-sm text-gray-500 block mt-1">total</span>
              </div>
            </div>
          </div>
        )}
      </div>
    );
  }
);

TravelCosts.displayName = "TravelCosts";

export default TravelCosts;
