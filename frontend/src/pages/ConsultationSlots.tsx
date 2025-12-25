import {
  type Component,
  createEffect,
  createResource,
  createSignal,
  For,
  Show,
} from "solid-js";
import { useNavigate } from "@solidjs/router";
import { useAuth } from "@/context/AuthContext";
import { consultationSlotApi } from "@/api/consultationSlot";
import { formatDateWithWeekday, getTodayString } from "@/utils";
import { UserType } from "@/enums/UserType";

const ConsultationSlots: Component = () => {
  const { user, isAuthenticated } = useAuth();
  const navigate = useNavigate();
  const [selectedDate, setSelectedDate] = createSignal("");
  const [error, setError] = createSignal("");

  const [slots, { refetch }] = createResource(
    () => ({
      authenticated: isAuthenticated(),
      userId: user()?.userId,
    }),

    async (params) => {
      if (!params.authenticated || !params.userId) return null;
      return await consultationSlotApi.getSlots(params.userId);
    },
  );

  createEffect(() => {
    if (!isAuthenticated()) {
      navigate("/login", { replace: true });
      return;
    }

    const currentUser = user();
    if (currentUser?.userType !== UserType.THERAPIST) {
      navigate("/", { replace: true });
    }
  });

  const handleAddSlot = async (e: Event) => {
    e.preventDefault();
    const dateStr = selectedDate();

    if (!dateStr) {
      setError("Please select a date");
      return;
    }

    if (dateStr < getTodayString()) {
      setError("Cannot add slots for past dates");
      return;
    }

    const currentUser = user();
    if (!currentUser?.userId) return;

    try {
      await consultationSlotApi.addSlot(currentUser.userId, dateStr);
      setSelectedDate("");
      setError("");
      refetch();
    } catch (err: any) {
      setError(err.message || "Failed to add slot");
    }
  };

  const handleRemoveSlot = async (date: string) => {
    const currentUser = user();
    if (!currentUser?.userId) return;

    if (
      !confirm(`Remove consultation slot for ${formatDateWithWeekday(date)}?`)
    ) {
      return;
    }

    try {
      await consultationSlotApi.removeSlot(currentUser.userId, date);
      setError("");
      refetch();
    } catch (err: any) {
      setError(err.message || "Failed to remove slot");
    }
  };

  const sortedSlots = () => {
    const slotData = slots();
    if (!slotData?.consultationSlots) return [];
    return [...slotData.consultationSlots].sort();
  };

  const futureSlots = () => {
    const today = getTodayString();
    return sortedSlots().filter((slot) => slot >= today);
  };

  const pastSlots = () => {
    const today = getTodayString();
    return sortedSlots().filter((slot) => slot < today);
  };

  return (
    <div class="container mx-auto px-4 py-8">
      <div class="mb-8">
        <h1 class="text-3xl font-bold text-gray-900 mb-2">
          Manage Consultation Slots
        </h1>
        <p class="text-gray-600">
          Add or remove dates when you're available for patient consultations
        </p>
      </div>

      <Show
        when={!slots.loading}
        fallback={
          <div class="flex justify-center items-center py-12">
            <div class="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
          </div>
        }
      >
        <div class="grid gap-6 lg:grid-cols-2">
          <div class="bg-white rounded-lg shadow-md p-6">
            <h2 class="text-xl font-bold text-gray-900 mb-4">
              Add New Consultation Slot
            </h2>
            <form onSubmit={handleAddSlot} class="space-y-4">
              <div>
                <label class="block text-sm font-semibold text-gray-700 mb-2">
                  Select Date
                </label>
                <input
                  type="date"
                  value={selectedDate()}
                  onInput={(e) => setSelectedDate(e.currentTarget.value)}
                  min={getTodayString()}
                  class="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  required
                />
              </div>

              <Show when={error()}>
                <div class="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-lg text-sm">
                  {error()}
                </div>
              </Show>

              <button
                type="submit"
                class="w-full px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors font-semibold cursor-pointer"
              >
                Add Slot
              </button>
            </form>
          </div>

          <div class="bg-white rounded-lg shadow-md p-6">
            <h2 class="text-xl font-bold text-gray-900 mb-4">
              Upcoming Consultation Slots ({futureSlots().length})
            </h2>
            <Show
              when={futureSlots().length > 0}
              fallback={
                <p class="text-gray-500 text-sm italic">
                  No upcoming consultation slots scheduled
                </p>
              }
            >
              <div class="space-y-2 max-h-96 overflow-y-auto">
                <For each={futureSlots()}>
                  {(slot) => (
                    <div class="flex items-center justify-between p-3 bg-green-50 border border-green-200 rounded-lg">
                      <div class="flex items-center gap-3">
                        <svg
                          class="w-5 h-5 text-green-600"
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
                        <span class="text-sm font-medium text-gray-900">
                          {formatDateWithWeekday(slot)}
                        </span>
                      </div>
                      <button
                        onClick={() => handleRemoveSlot(slot)}
                        class="px-3 py-1 text-red-700 bg-red-50 border border-red-200 rounded hover:bg-red-100 transition-colors text-sm font-medium cursor-pointer"
                      >
                        Remove
                      </button>
                    </div>
                  )}
                </For>
              </div>
            </Show>
          </div>
        </div>

        <Show when={pastSlots().length > 0}>
          <div class="mt-6 bg-gray-50 rounded-lg shadow-md p-6">
            <h2 class="text-xl font-bold text-gray-700 mb-4">
              Past Consultation Slots ({pastSlots().length})
            </h2>
            <div class="grid gap-2 sm:grid-cols-2 lg:grid-cols-3">
              <For each={pastSlots()}>
                {(slot) => (
                  <div class="flex items-center gap-2 p-2 bg-gray-100 border border-gray-300 rounded text-gray-600">
                    <svg
                      class="w-4 h-4"
                      fill="none"
                      stroke="currentColor"
                      viewBox="0 0 24 24"
                    >
                      <path
                        stroke-linecap="round"
                        stroke-linejoin="round"
                        stroke-width="2"
                        d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z"
                      />
                    </svg>
                    <span class="text-xs">{formatDateWithWeekday(slot)}</span>
                  </div>
                )}
              </For>
            </div>
          </div>
        </Show>
      </Show>
    </div>
  );
};

export default ConsultationSlots;
