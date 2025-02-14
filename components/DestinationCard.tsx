import { memo, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Destination, Activity } from "@/data/destinations";
import DestinationDetails from "./DestinationDetails";

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
    onActivitySelect: (item: {
      name: string;
      emoji: string;
      price: number;
      country: string;
      place: string;
    }) => void;
    selectedActivities: Set<string>;
  }) => {
    const [selectedActivity, setSelectedActivity] = useState<Activity>();

    const handleActivitySelect = (activity: Activity) => {
      setSelectedActivity(activity);
      onActivitySelect({
        ...activity,
        country: destination.country,
        place: destination.places[0].name,
      });
    };

    return (
      <div
        className={`bg-white rounded-2xl shadow-xl overflow-hidden transform 
        transition-all duration-500 hover:scale-105 
        ${showContent ? "animate-fade-in-up" : "opacity-0"}`}
      >
        {/* ... keep existing header section ... */}

        <AnimatePresence>
          {isSelected && (
            <motion.div
              initial={{ opacity: 0, height: 0 }}
              animate={{ opacity: 1, height: "auto" }}
              exit={{ opacity: 0, height: 0 }}
            >
              <DestinationDetails
                destination={destination}
                selectedActivity={selectedActivity}
                onActivitySelect={handleActivitySelect}
              />
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    );
  }
);

DestinationCard.displayName = "DestinationCard";

export default DestinationCard;
