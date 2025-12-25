import { type Component, For, Show, createSignal } from "solid-js";
import type { TherapistInfo } from "@/api/therapist";
import { patientApi } from "@/api/patient";
import { formatDateWithWeekday } from "@/utils";

interface TherapistCardProps {
  therapist: TherapistInfo;
  isCurrentTherapist?: boolean;
  onTherapistChange?: () => void;
}

const TherapistCard: Component<TherapistCardProps> = (props) => {
  const [isLoading, setIsLoading] = createSignal(false);
  const [error, setError] = createSignal("");

  const handleSetTherapist = async () => {
    setIsLoading(true);
    setError("");

    try {
      if (props.isCurrentTherapist) {
        await patientApi.removeTherapist();
      } else {
        await patientApi.setTherapist(props.therapist.idUser);
      }
      props.onTherapistChange?.();
    } catch (err) {
      setError(
        err instanceof Error ? err.message : "Failed to update therapist",
      );
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div class="bg-white rounded-lg shadow-md overflow-hidden hover:shadow-lg transition-shadow relative flex flex-col h-full">
      <Show when={props.isCurrentTherapist}>
        <div class="absolute top-4 right-4 z-10">
          <div class="bg-green-500 text-white px-3 py-1 rounded-full text-xs font-semibold flex items-center gap-1 shadow-lg">
            <svg class="w-4 h-4" fill="currentColor" viewBox="0 0 20 20">
              <path
                fill-rule="evenodd"
                d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z"
                clip-rule="evenodd"
              />
            </svg>
            My Therapist
          </div>
        </div>
      </Show>

      <div class="bg-linear-to-r from-blue-500 to-blue-600 p-6 text-white">
        <h2 class="text-2xl font-bold mb-1">
          {props.therapist.name} {props.therapist.surname}
        </h2>
        <p class="text-blue-100 text-sm">{props.therapist.degree}</p>
      </div>

      <div class="p-6 flex flex-col grow">
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

        <div class="border-t py-4 grow">
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

        <div class="border-t pt-4 mt-auto">
          <Show when={error()}>
            <div class="mb-3 text-sm text-red-600 bg-red-50 p-2 rounded">
              {error()}
            </div>
          </Show>

          <Show
            when={!isLoading()}
            fallback={
              <div class="animate-spin rounded-full h-4 w-4 border-b-2 border-current" />
            }
          >
            <button
              onClick={handleSetTherapist}
              class={`w-full py-2 px-4 rounded-lg font-medium transition-colors flex items-center justify-center gap-2 cursor-pointer ${
                props.isCurrentTherapist
                  ? "bg-red-50 text-red-700 border border-red-200 hover:bg-red-100"
                  : "bg-blue-600 text-white hover:bg-blue-700"
              } disabled:opacity-50 disabled:cursor-not-allowed`}
            >
              <Show
                when={props.isCurrentTherapist}
                fallback={
                  <>
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
                        d="M12 4v16m8-8H4"
                      />
                    </svg>
                    Set as My Therapist
                  </>
                }
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
                    d="M6 18L18 6M6 6l12 12"
                  />
                </svg>
                Remove as My Therapist
              </Show>
            </button>
          </Show>
        </div>
      </div>
    </div>
  );
};

export default TherapistCard;
