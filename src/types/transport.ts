export interface FerryRoute {
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

export interface FlightRoute {
  operator: string;
  route: string;
  duration: string;
  frequency: string;
  price: {
    economy: number;
    business?: number;
    firstClass?: number;
  };
  website: string;
  notes?: string[];
}

export interface TransportCost {
  id: string;
  type: "ferry" | "flight" | "train" | "bus";
  route: string;
  price: number;
  operator: string;
  duration: string;
}
