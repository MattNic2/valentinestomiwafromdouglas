export interface CalendarEvent {
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

export interface CalendarDay {
  date: Date | null;
  events: CalendarEvent[];
  isCurrentMonth: boolean;
}
