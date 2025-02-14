import { useState, useCallback } from "react";
import { CalendarEvent } from "../types/calendar";

export function useCalendar() {
  const [events, setEvents] = useState<CalendarEvent[]>([]);
  const [currentDate, setCurrentDate] = useState(new Date());

  const addEvent = useCallback((event: CalendarEvent) => {
    setEvents((prev) => [...prev, event]);
  }, []);

  const removeEvent = useCallback((eventId: string) => {
    setEvents((prev) => prev.filter((e) => e.id !== eventId));
  }, []);

  // ... other calendar logic

  return {
    events,
    currentDate,
    addEvent,
    removeEvent,
    // ... other methods
  };
}
