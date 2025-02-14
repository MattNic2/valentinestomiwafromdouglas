import { memo } from "react";
import { motion } from "framer-motion";
import { Clock, X } from "lucide-react";
import type { CalendarEvent as CalendarEventType } from "../../../types/calendar";

interface CalendarEventProps {
  event: CalendarEventType;
  onRemove: (event: CalendarEventType) => void;
}

export const CalendarEvent = memo(({ event, onRemove }: CalendarEventProps) => (
  <motion.div
    key={event.id}
    initial={{ opacity: 0, y: 10 }}
    animate={{ opacity: 1, y: 0 }}
    className="bg-rose-100 rounded px-2 py-1 text-xs group relative"
  >
    <button
      onClick={() => onRemove(event)}
      className="absolute -right-1 -top-1 hidden group-hover:flex bg-rose-500 text-white rounded-full p-0.5"
    >
      <X className="w-3 h-3" />
    </button>
    <div className="flex items-center gap-1">
      <span>{event.emoji}</span>
      <span className="font-medium truncate">{event.name}</span>
    </div>
    <div className="flex items-center gap-1 text-rose-600">
      <Clock className="w-3 h-3" />
      {event.startTime}
      {event.duration && ` • ${event.duration}`}
    </div>
  </motion.div>
));

CalendarEvent.displayName = "CalendarEvent";
