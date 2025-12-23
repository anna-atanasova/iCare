import { Component, For } from "solid-js";
import CalendarDay from "./CalendarDay";
import { DiaryEntry } from "../api/diary";

interface CalendarGridProps {
  days: Array<{
    day: number | null;
    isCurrentMonth: boolean;
    date: Date | null;
  }>;
  getEntryForDate: (date: Date | null) => DiaryEntry | undefined;
  onDayClick: (date: Date | null) => void;
}

const CalendarGrid: Component<CalendarGridProps> = (props) => (
  <div class="grid grid-cols-7 gap-2">
    <For each={props.days}>
      {(dayInfo) => {
        const entry = props.getEntryForDate(dayInfo.date);
        return (
          <CalendarDay
            day={dayInfo.day}
            isCurrentMonth={dayInfo.isCurrentMonth}
            hasEntry={!!entry}
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
