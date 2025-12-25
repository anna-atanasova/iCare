import { type Component, For } from "solid-js";
import CalendarDay from "@/components/CalendarDay";
import { isFutureDate, isTodayDate } from "@/utils";
import type { DiaryEntry } from "@/api/diary";

interface CalendarGridProps {
  days: Array<{
    day: number | null;
    isCurrentMonth: boolean;
    date: Date | null;
  }>;
  getEntryForDate: (date: Date | null) => DiaryEntry | undefined;
  onDayClick: (date: Date | null) => void;
  isTherapistView?: boolean;
}

const CalendarGrid: Component<CalendarGridProps> = (props) => (
  <div class="grid grid-cols-7 gap-2">
    <For each={props.days}>
      {(dayInfo) => {
        const entry = props.getEntryForDate(dayInfo.date);
        const isFuture = isFutureDate(dayInfo.date);
        const isToday = isTodayDate(dayInfo.date);

        return (
          <CalendarDay
            day={dayInfo.day}
            isCurrentMonth={dayInfo.isCurrentMonth}
            hasEntry={!!entry}
            isFuture={isFuture}
            isToday={isToday}
            isTherapistView={props.isTherapistView}
            entry={
              entry
                ? {
                    dailyRating: entry.dailyRating,
                    content: entry.content,
                  }
                : undefined
            }
            onClick={() => props.onDayClick(dayInfo.date)}
          />
        );
      }}
    </For>
  </div>
);

export default CalendarGrid;
