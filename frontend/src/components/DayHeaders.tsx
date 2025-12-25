import type { Component } from "solid-js";

const days = ["Mon", "Tue", "Wed", "Thu", "Fri", "Sat", "Sun"];

const DayHeaders: Component = () => (
  <div class="grid grid-cols-7 gap-2 mb-2">
    {days.map((day) => (
      <div class="text-center font-semibold text-gray-600 text-sm">{day}</div>
    ))}
  </div>
);

export default DayHeaders;
