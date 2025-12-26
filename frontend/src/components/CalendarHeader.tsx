import type { Component } from "solid-js";

interface CalendarHeaderProps {
  monthName: string;
  onPreviousMonth: () => void;
  onNextMonth: () => void;
}

const CalendarHeader: Component<CalendarHeaderProps> = (props) => (
  <div class="flex justify-between items-center mb-6">
    <button
      onClick={props.onPreviousMonth}
      class="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors flex items-center gap-2 cursor-pointer"
    >
      <svg
        class="w-5 h-5"
        fill="none"
        stroke="currentColor"
        viewBox="0 0 24 24"
      >
        <path
          stroke-linecap="round"
          stroke-linejoin="round"
          stroke-width="2"
          d="M15 19l-7-7 7-7"
        />
      </svg>
      Previous
    </button>

    <h2 class="text-2xl font-bold text-gray-900">{props.monthName}</h2>

    <button
      onClick={props.onNextMonth}
      class="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors flex items-center gap-2 cursor-pointer"
    >
      Next
      <svg
        class="w-5 h-5"
        fill="none"
        stroke="currentColor"
        viewBox="0 0 24 24"
      >
        <path
          stroke-linecap="round"
          stroke-linejoin="round"
          stroke-width="2"
          d="M9 5l7 7-7 7"
        />
      </svg>
    </button>
  </div>
);

export default CalendarHeader;
