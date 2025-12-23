import { Component, For, Show } from "solid-js";
import { TherapistInfo } from "../api/therapist";
import { formatDateWithWeekday } from "../utils";

interface TherapistCardProps {
  therapist: TherapistInfo;
}

const TherapistCard: Component<TherapistCardProps> = (props) => {
  return (
    <div class="bg-white rounded-lg shadow-md overflow-hidden hover:shadow-lg transition-shadow">
      <div class="bg-linear-to-r from-blue-500 to-blue-600 p-6 text-white">
        <h2 class="text-2xl font-bold mb-1">
          {props.therapist.name} {props.therapist.surname}
        </h2>
        <p class="text-blue-100 text-sm">{props.therapist.degree}</p>
      </div>

      <div class="p-6">
        <div class="space-y-3 mb-4">
          <div class="flex items-start">
            <svg
              class="w-5 h-5 text-gray-400 mt-0.5 mr-2 shrink-0"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                stroke-linecap="round"
                stroke-linejoin="round"
                stroke-width="2"
                d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z"
              />
              <path
                stroke-linecap="round"
                stroke-linejoin="round"
                stroke-width="2"
                d="M15 11a3 3 0 11-6 0 3 3 0 016 0z"
              />
            </svg>
            <span class="text-gray-700">{props.therapist.officeLocation}</span>
          </div>

          <div class="flex items-center">
            <svg
              class="w-5 h-5 text-gray-400 mr-2 shrink-0"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                stroke-linecap="round"
                stroke-linejoin="round"
                stroke-width="2"
                d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z"
              />
            </svg>
            <span class="text-gray-700 text-sm">{props.therapist.email}</span>
          </div>

          <div class="flex items-center">
            <svg
              class="w-5 h-5 text-gray-400 mr-2 shrink-0"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                stroke-linecap="round"
                stroke-linejoin="round"
                stroke-width="2"
                d="M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21l-2.257 1.13a11.042 11.042 0 005.516 5.516l1.13-2.257a1 1 0 011.21-.502l4.493 1.498a1 1 0 01.684.949V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z"
              />
            </svg>
            <span class="text-gray-700 text-sm">
              {props.therapist.phoneNumber}
            </span>
          </div>

          <div class="flex items-center">
            <svg
              class="w-5 h-5 text-gray-400 mr-2 shrink-0"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                stroke-linecap="round"
                stroke-linejoin="round"
                stroke-width="2"
                d="M9 12l2 2 4-4M7.835 4.697a3.42 3.42 0 001.946-.806 3.42 3.42 0 014.438 0 3.42 3.42 0 001.946.806 3.42 3.42 0 013.138 3.138 3.42 3.42 0 00.806 1.946 3.42 3.42 0 010 4.438 3.42 3.42 0 00-.806 1.946 3.42 3.42 0 01-3.138 3.138 3.42 3.42 0 00-1.946.806 3.42 3.42 0 01-4.438 0 3.42 3.42 0 00-1.946-.806 3.42 3.42 0 01-3.138-3.138 3.42 3.42 0 00-.806-1.946 3.42 3.42 0 010-4.438 3.42 3.42 0 00.806-1.946 3.42 3.42 0 013.138-3.138z"
              />
            </svg>
            <span class="text-gray-700">
              {props.therapist.yearsExp} years experience
            </span>
          </div>
        </div>

        <div class="border-t pt-4">
          <h3 class="font-semibold text-gray-900 mb-3 flex items-center">
            <svg
              class="w-5 h-5 text-green-500 mr-2"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                stroke-linecap="round"
                stroke-linejoin="round"
                stroke-width="2"
                d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z"
              />
            </svg>
            Available Consultations (
            {props.therapist.freeConsultationSlots.length || "None"})
          </h3>
          <Show
            when={
              props.therapist.freeConsultationSlots &&
              props.therapist.freeConsultationSlots.length > 0
            }
            fallback={
              <p class="text-gray-500 text-sm italic">
                No available slots at the moment
              </p>
            }
          >
            <div class="space-y-2 max-h-48 overflow-y-auto">
              <For each={props.therapist.freeConsultationSlots}>
                {(slot) => (
                  <div class="bg-green-50 border border-green-200 rounded px-3 py-2 text-sm text-green-800">
                    {formatDateWithWeekday(slot)}
                  </div>
                )}
              </For>
            </div>
          </Show>
        </div>
      </div>
    </div>
  );
};

export default TherapistCard;
