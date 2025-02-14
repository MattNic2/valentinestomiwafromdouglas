import { memo } from "react";
import { Plane, Train, Bus, Ship, Minus, Plus } from "lucide-react";

interface TransportCost {
  name: string;
  price: number;
  icon?: React.ElementType;
  note?: string;
  url?: string;
  id: string;
  country: string;
}

interface CostBreakdown {
  category: string;
  items: TransportCost[];
}

const costData: CostBreakdown[] = [
  {
    category: "International Flights",
    items: [
      {
        id: "flight-lax-tokyo",
        country: "Japan",
        name: "LAX to Tokyo (Haneda)",
        price: 850,
        icon: Plane,
        note: "Average economy round-trip",
        url: "https://www.google.com/travel/flights",
      },
      {
        id: "flight-tokyo-seoul",
        country: "Korea",
        name: "Tokyo to Seoul",
        price: 250,
        icon: Plane,
        note: "One-way economy",
        url: "https://www.google.com/travel/flights",
      },
      {
        id: "flight-seoul-lax",
        country: "Korea",
        name: "Seoul to LAX",
        price: 900,
        icon: Plane,
        note: "One-way economy",
        url: "https://www.google.com/travel/flights",
      },
    ],
  },
  {
    category: "Japan Transportation",
    items: [
      {
        id: "7-day-jr-pass",
        country: "Japan",
        name: "7-Day JR Pass",
        price: 234,
        icon: Train,
        note: "Unlimited JR trains including shinkansen",
        url: "https://japanrailpass.net",
      },
      {
        id: "tokyo-metro-pass",
        country: "Japan",
        name: "Tokyo Metro Pass (7 days)",
        price: 22,
        icon: Train,
        note: "Unlimited subway rides in Tokyo",
      },
      {
        id: "airport-transfer-haneda",
        country: "Japan",
        name: "Airport Transfer (Haneda)",
        price: 13,
        icon: Train,
        note: "One-way to Tokyo Station",
      },
    ],
  },
  {
    category: "Korea Transportation",
    items: [
      {
        id: "korea-rail-pass",
        country: "Korea",
        name: "Korea Rail Pass (3 days)",
        price: 91,
        icon: Train,
        note: "Unlimited KTX and rail travel",
        url: "https://www.letskorail.com/ebizbf/EbizBfKrPassAbout.do",
      },
      {
        id: "t-money-card",
        country: "Korea",
        name: "T-money Card + Credit",
        price: 25,
        icon: Bus,
        note: "Transit card with initial balance",
      },
      {
        id: "airport-express-train",
        country: "Korea",
        name: "Airport Express Train",
        price: 8,
        icon: Train,
        note: "Incheon to Seoul Station",
      },
    ],
  },
];

const TravelCosts = memo(
  ({
    onSelectCost,
    selectedCosts,
  }: {
    onSelectCost: (cost: TransportCost) => void;
    selectedCosts: Set<string>;
  }) => {
    const totalCost = costData.reduce(
      (sum, category) =>
        sum + category.items.reduce((catSum, item) => catSum + item.price, 0),
      0
    );

    return (
      <div className="bg-white rounded-2xl shadow-xl p-6">
        <h2 className="text-2xl font-bold text-gray-800 mb-6">
          Travel Cost Breakdown
        </h2>

        <div className="space-y-8">
          {costData.map((category) => (
            <div key={category.category}>
              <h3 className="text-lg font-semibold text-gray-700 mb-3">
                {category.category}
              </h3>
              <div className="space-y-3">
                {category.items.map((item) => {
                  const isSelected = selectedCosts.has(item.id);
                  return (
                    <button
                      key={item.id}
                      onClick={() => onSelectCost(item)}
                      className={`w-full text-left flex items-center justify-between p-3 rounded-lg transition-colors
                    ${
                      isSelected
                        ? "bg-rose-50 hover:bg-rose-100"
                        : "bg-gray-50 hover:bg-rose-50"
                    }`}
                    >
                      <div className="flex items-center gap-3">
                        {item.icon && (
                          <item.icon className="w-5 h-5 text-rose-500" />
                        )}
                        <div>
                          <div className="font-medium text-gray-700">
                            {item.name}
                          </div>
                          {item.note && (
                            <div className="text-sm text-gray-500">
                              {item.note}
                            </div>
                          )}
                        </div>
                      </div>
                      <div className="flex items-center gap-3">
                        <span className="font-semibold text-rose-500">
                          ${item.price}
                        </span>
                        {isSelected ? (
                          <Minus className="w-4 h-4 text-rose-500" />
                        ) : (
                          <Plus className="w-4 h-4 text-rose-500" />
                        )}
                      </div>
                    </button>
                  );
                })}
              </div>
            </div>
          ))}
        </div>

        <div className="mt-8 pt-6 border-t border-gray-100">
          <div className="flex justify-between items-center">
            <span className="text-lg font-semibold text-gray-700">
              Estimated Total Transportation Cost
            </span>
            <span className="text-2xl font-bold text-rose-500">
              ${totalCost}
            </span>
          </div>
          <p className="mt-2 text-sm text-gray-500">
            * Prices are estimates based on average costs. Actual prices may
            vary based on season, availability, and booking time.
          </p>
        </div>
      </div>
    );
  }
);

TravelCosts.displayName = "TravelCosts";

export default TravelCosts;
