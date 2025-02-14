import { memo } from "react";
import { CalendarEvent } from "./CalendarEvent";
import type { CalendarEvent as CalendarEventType } from "../../../types/calendar";
import { getDaysInMonth, getFirstDayOfMonth } from "../../../lib/utils/date";

const DAYS = ["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"];

interface CalendarGridProps {
  currentDate: Date;
  events: CalendarEventType[];
  onDrop: (date: Date, item: any) => void;
  onRemoveEvent: (event: CalendarEventType) => void;
}

export const CalendarGrid = memo(
  ({ currentDate, events, onDrop, onRemoveEvent }: CalendarGridProps) => {
    const generateCalendarDays = () => {
      const daysInMonth = getDaysInMonth(currentDate);
      const firstDay = getFirstDayOfMonth(currentDate);
      const days = [];

      for (let i = 0; i < firstDay; i++) {
        days.push(null);
      }

      for (let i = 1; i <= daysInMonth; i++) {
        days.push(
          new Date(currentDate.getFullYear(), currentDate.getMonth(), i)
        );
      }

      return days;
    };

    const getEventsForDate = (date: Date) => {
      return events.filter(
        (event) => event.date.toDateString() === date.toDateString()
      );
    };

    return (
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
              if (date) {
                e.preventDefault();
                const data = e.dataTransfer.getData("application/json");
                if (data) {
                  onDrop(date, JSON.parse(data));
                }
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
                    <CalendarEvent
                      key={event.id}
                      event={event}
                      onRemove={onRemoveEvent}
                    />
                  ))}
                </div>
              </>
            )}
          </div>
        ))}
      </div>
    );
  }
);

CalendarGrid.displayName = "CalendarGrid";
