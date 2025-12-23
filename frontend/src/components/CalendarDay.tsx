import { Component, Show } from "solid-js";

interface CalendarDayProps {
  day: number | null;
  isCurrentMonth: boolean;
  hasEntry: boolean;
  entry?: {
    dailyRating: number;
    content: string;
  };
  onClick?: () => void;
}

const getRatingColor = (rating: number) => {
  if (rating <= 2) return "bg-red-100 border-red-300 text-red-800";
  if (rating <= 4) return "bg-orange-100 border-orange-300 text-orange-800";
  if (rating <= 6) return "bg-yellow-100 border-yellow-300 text-yellow-800";
  if (rating <= 8) return "bg-green-100 border-green-300 text-green-800";
  return "bg-blue-100 border-blue-300 text-blue-800";
};

const CalendarDay: Component<CalendarDayProps> = (props) => (
  <Show
    when={props.day !== null && props.isCurrentMonth}
    fallback={
      <div class="bg-gray-50 border border-gray-200 rounded-lg h-24 p-2" />
    }
  >
    <div
      class={`border-2 rounded-lg h-24 p-2 transition-all cursor-pointer ${
        props.hasEntry
          ? `${getRatingColor(props.entry!.dailyRating)} hover:shadow-md`
          : "bg-white border-gray-200 text-gray-300 hover:border-gray-300"
      }`}
      onClick={props.onClick}
    >
      <div class="flex justify-between items-start mb-1">
        <span
          class={`text-sm font-semibold ${
            props.hasEntry ? "" : "text-gray-400"
          }`}
        >
          {props.day}
        </span>
        <Show when={props.hasEntry}>
          <span class="text-xs font-bold">★ {props.entry!.dailyRating}/10</span>
        </Show>
      </div>
      <Show when={props.hasEntry}>
        <p class="text-xs line-clamp-2 overflow-hidden">
          {props.entry!.content}
        </p>
      </Show>
    </div>
  </Show>
);

export default CalendarDay;
