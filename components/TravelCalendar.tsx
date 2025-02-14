import { memo, useState } from "react";
import { motion } from "framer-motion";
import {
  Calendar as CalendarIcon,
  ChevronLeft,
  ChevronRight,
  Clock,
  MapPin,
  Plus,
  X,
} from "lucide-react";
import { ItineraryItem } from "@/data/destinations";

interface CalendarEvent {
  id: string;
  name: string;
  emoji: string;
  date: Date;
  startTime: string;
  duration?: string;
  country: string;
  place: string;
  price: number;
}

const DAYS = ["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"];
const MONTHS = [
  "January",
  "February",
  "March",
  "April",
  "May",
  "June",
  "July",
  "August",
  "September",
  "October",
  "November",
  "December",
];

interface TravelCalendarProps {
  items: ItineraryItem[];
  onUpdateEvent: (event: { name: string; date: string }) => void;
  onRemoveEvent: (event: { name: string; date: string }) => void;
}

const TravelCalendar = memo(
  ({ items, onUpdateEvent, onRemoveEvent }: TravelCalendarProps) => {
    const [currentDate, setCurrentDate] = useState(new Date());
    const [selectedDate, setSelectedDate] = useState<Date | null>(null);
    const [events, setEvents] = useState<CalendarEvent[]>([]);
    const [draggedItem, setDraggedItem] = useState<ItineraryItem | null>(null);

    const getDaysInMonth = (date: Date) => {
      return new Date(date.getFullYear(), date.getMonth() + 1, 0).getDate();
    };

    const getFirstDayOfMonth = (date: Date) => {
      return new Date(date.getFullYear(), date.getMonth(), 1).getDay();
    };

    const generateCalendarDays = () => {
      const daysInMonth = getDaysInMonth(currentDate);
      const firstDay = getFirstDayOfMonth(currentDate);
      const days = [];

      // Add empty cells for days before the first day of the month
      for (let i = 0; i < firstDay; i++) {
        days.push(null);
      }

      // Add days of the month
      for (let i = 1; i <= daysInMonth; i++) {
        days.push(
          new Date(currentDate.getFullYear(), currentDate.getMonth(), i)
        );
      }

      return days;
    };

    const handleDrop = (date: Date, item: ItineraryItem) => {
      const newEvent: CalendarEvent = {
        id: `${item.name}-${date.toISOString()}`,
        name: item.name,
        emoji: item.emoji,
        date: date,
        startTime: "09:00",
        duration: item.duration,
        country: item.country,
        place: item.place,
        price: item.price,
      };

      setEvents((prev) => [...prev, newEvent]);
      onUpdateEvent({
        name: item.name,
        date: date.toISOString(),
      });
    };

    const handleRemoveEvent = (event: CalendarEvent) => {
      setEvents((prev) => prev.filter((e) => e.id !== event.id));
      onRemoveEvent({
        name: event.name,
        date: event.date.toISOString(),
      });
    };

    const getEventsForDate = (date: Date) => {
      return events.filter(
        (event) => event.date.toDateString() === date.toDateString()
      );
    };

    return (
      <div className="bg-white rounded-2xl shadow-xl p-6">
        <div className="flex items-center justify-between mb-6">
          <h2 className="text-2xl font-bold text-gray-800 flex items-center gap-2">
            <CalendarIcon className="w-6 h-6 text-rose-500" />
            Travel Calendar
          </h2>
          <div className="flex items-center gap-4">
            <button
              onClick={() =>
                setCurrentDate(
                  new Date(
                    currentDate.getFullYear(),
                    currentDate.getMonth() - 1
                  )
                )
              }
              className="p-2 hover:bg-gray-100 rounded-full"
            >
              <ChevronLeft className="w-5 h-5 text-gray-600" />
            </button>
            <span className="font-medium text-gray-700">
              {MONTHS[currentDate.getMonth()]} {currentDate.getFullYear()}
            </span>
            <button
              onClick={() =>
                setCurrentDate(
                  new Date(
                    currentDate.getFullYear(),
                    currentDate.getMonth() + 1
                  )
                )
              }
              className="p-2 hover:bg-gray-100 rounded-full"
            >
              <ChevronRight className="w-5 h-5 text-gray-600" />
            </button>
          </div>
        </div>

        {/* Calendar Grid */}
        <div className="grid grid-cols-7 gap-1">
          {DAYS.map((day) => (
            <div
              key={day}
              className="text-center text-sm font-medium text-gray-500 py-2"
            >
              {day}
            </div>
          ))}
          {generateCalendarDays().map((date, index) => (
            <div
              key={index}
              className={`min-h-[100px] border border-gray-100 rounded-lg p-1 ${
                date
                  ? "bg-white hover:bg-rose-50 transition-colors"
                  : "bg-gray-50"
              }`}
              onDragOver={(e) => {
                if (date) {
                  e.preventDefault();
                }
              }}
              onDrop={(e) => {
                if (date && draggedItem) {
                  e.preventDefault();
                  handleDrop(date, draggedItem);
                }
              }}
            >
              {date && (
                <>
                  <div className="text-right text-sm text-gray-500 mb-1">
                    {date.getDate()}
                  </div>
                  <div className="space-y-1">
                    {getEventsForDate(date).map((event) => (
                      <motion.div
                        key={event.id}
                        initial={{ opacity: 0, y: 10 }}
                        animate={{ opacity: 1, y: 0 }}
                        className="bg-rose-100 rounded px-2 py-1 text-xs group relative"
                      >
                        <button
                          onClick={() => handleRemoveEvent(event)}
                          className="absolute -right-1 -top-1 hidden group-hover:flex bg-rose-500 text-white rounded-full p-0.5"
                        >
                          <X className="w-3 h-3" />
                        </button>
                        <div className="flex items-center gap-1">
                          <span>{event.emoji}</span>
                          <span className="font-medium truncate">
                            {event.name}
                          </span>
                        </div>
                        <div className="flex items-center gap-1 text-rose-600">
                          <Clock className="w-3 h-3" />
                          {event.startTime}
                          {event.duration && ` • ${event.duration}`}
                        </div>
                      </motion.div>
                    ))}
                  </div>
                </>
              )}
            </div>
          ))}
        </div>

        {/* Unscheduled Activities */}
        <div className="mt-6 border-t border-gray-100 pt-4">
          <h3 className="text-lg font-semibold text-gray-800 mb-3">
            Unscheduled Activities
          </h3>
          <div className="grid gap-2">
            {items
              .filter(
                (item) => !events.some((event) => event.name === item.name)
              )
              .map((item) => (
                <motion.div
                  key={item.name}
                  draggable
                  onDragStart={() => setDraggedItem(item)}
                  onDragEnd={() => setDraggedItem(null)}
                  className="bg-gray-50 rounded-lg p-2 cursor-move hover:bg-rose-50 transition-colors"
                >
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-2">
                      <span className="text-xl">{item.emoji}</span>
                      <div>
                        <div className="font-medium text-gray-800">
                          {item.name}
                        </div>
                        <div className="text-sm text-gray-500 flex items-center gap-1">
                          <MapPin className="w-3 h-3" />
                          {item.country}, {item.place}
                        </div>
                      </div>
                    </div>
                    <div className="text-rose-500 font-semibold">
                      ${item.price}
                    </div>
                  </div>
                </motion.div>
              ))}
          </div>
        </div>
      </div>
    );
  }
);

TravelCalendar.displayName = "TravelCalendar";

export default TravelCalendar;
