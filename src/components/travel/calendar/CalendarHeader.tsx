import { memo } from "react";
import { Calendar, ChevronLeft, ChevronRight } from "lucide-react";
import { MONTHS } from "../../../config/constants";

interface CalendarHeaderProps {
  currentDate: Date;
  onPrevMonth: () => void;
  onNextMonth: () => void;
}

export const CalendarHeader = memo(
  ({ currentDate, onPrevMonth, onNextMonth }: CalendarHeaderProps) => (
    <div className="flex items-center justify-between mb-6">
      <h2 className="text-2xl font-bold text-gray-800 flex items-center gap-2">
        <Calendar className="w-6 h-6 text-rose-500" />
        Travel Calendar
      </h2>
      <div className="flex items-center gap-4">
        <button
          onClick={onPrevMonth}
          className="p-2 hover:bg-gray-100 rounded-full"
        >
          <ChevronLeft className="w-5 h-5 text-gray-600" />
        </button>
        <span className="font-medium text-gray-700">
          {MONTHS[currentDate.getMonth()]} {currentDate.getFullYear()}
        </span>
        <button
          onClick={onNextMonth}
          className="p-2 hover:bg-gray-100 rounded-full"
        >
          <ChevronRight className="w-5 h-5 text-gray-600" />
        </button>
      </div>
    </div>
  )
);

CalendarHeader.displayName = "CalendarHeader";
