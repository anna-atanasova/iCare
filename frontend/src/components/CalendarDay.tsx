import { Component, Show } from "solid-js";

interface CalendarDayProps {
  day: number | null;
  isCurrentMonth: boolean;
  hasEntry: boolean;
  isFuture?: boolean;
  isToday?: boolean;
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
      class={`rounded-lg h-24 p-2 transition-all ${
        props.isToday ? "border-4 border-blue-600 shadow-lg" : "border-2"
      } ${props.isFuture ? "" : "cursor-pointer"} ${
        props.hasEntry
          ? `${getRatingColor(props.entry!.dailyRating)} hover:shadow-md`
          : props.isFuture
            ? "bg-white border-gray-200 text-gray-400 relative overflow-hidden"
            : "bg-white border-gray-200 text-gray-300 hover:border-gray-300"
      }`}
      onClick={props.isFuture ? undefined : props.onClick}
      style={
        props.isFuture && !props.hasEntry
          ? {
              "background-image":
                "repeating-linear-gradient(45deg, transparent, transparent 10px, rgba(0,0,0,0.03) 10px, rgba(0,0,0,0.03) 20px)",
            }
          : {}
      }
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
