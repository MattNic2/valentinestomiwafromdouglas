import { memo } from "react";
import { motion } from "framer-motion";
import { MapPin } from "lucide-react";
import type { ItineraryItem } from "../../../types/destinations";

interface UnscheduledActivitiesProps {
  items: ItineraryItem[];
  scheduledEvents: Set<string>;
  onDragStart: (item: ItineraryItem) => void;
  onDragEnd: () => void;
}

export const UnscheduledActivities = memo(
  ({
    items,
    scheduledEvents,
    onDragStart,
    onDragEnd,
  }: UnscheduledActivitiesProps) => (
    <div className="mt-6 border-t border-gray-100 pt-4">
      <h3 className="text-lg font-semibold text-gray-800 mb-3">
        Unscheduled Activities
      </h3>
      <div className="grid gap-2">
        {items
          .filter((item) => !scheduledEvents.has(item.id))
          .map((item) => (
            <motion.div
              key={item.id}
              draggable
              onDragStart={(e) => {
                (e as DragEvent).dataTransfer?.setData(
                  "application/json",
                  JSON.stringify(item)
                );
                onDragStart(item);
              }}
              onDragEnd={onDragEnd}
              className="bg-gray-50 rounded-lg p-2 cursor-move hover:bg-rose-50 transition-colors"
            >
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <span className="text-xl">{item.emoji}</span>
                  <div>
                    <div className="font-medium text-gray-800">{item.name}</div>
                    <div className="text-sm text-gray-500 flex items-center gap-1">
                      <MapPin className="w-3 h-3" />
                      {item.country}, {item.place}
                    </div>
                  </div>
                </div>
                <div className="text-rose-500 font-semibold">${item.price}</div>
              </div>
            </motion.div>
          ))}
      </div>
    </div>
  )
);

UnscheduledActivities.displayName = "UnscheduledActivities";
