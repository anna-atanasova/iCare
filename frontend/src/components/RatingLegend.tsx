import { Component } from "solid-js";

const ratings = [
  { color: "red", range: "1-2", label: "Very Bad" },
  { color: "orange", range: "3-4", label: "Bad" },
  { color: "yellow", range: "5-6", label: "Okay" },
  { color: "green", range: "7-8", label: "Good" },
  { color: "blue", range: "9-10", label: "Excellent" },
];

const RatingLegend: Component = () => (
  <div class="mt-6 pt-6 border-t border-gray-200">
    <h3 class="text-sm font-semibold text-gray-700 mb-3">Rating Legend:</h3>
    <div class="flex flex-wrap gap-4">
      {ratings.map((rating) => (
        <div class="flex items-center gap-2">
          <div
            class={`w-4 h-4 bg-${rating.color}-200 border-2 border-${rating.color}-300 rounded`}
          />
          <span class="text-xs text-gray-600">
            {rating.range} ({rating.label})
          </span>
        </div>
      ))}
    </div>
  </div>
);

export default RatingLegend;
