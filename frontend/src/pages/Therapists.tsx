import { Component, createEffect, createResource, For, Show } from "solid-js";
import { useNavigate } from "@solidjs/router";
import { useAuth } from "../context/AuthContext";
import { therapistApi } from "../api/therapist";
import TherapistCard from "../components/TherapistCard";

const Therapists: Component = () => {
  const { user, isAuthenticated } = useAuth();
  const navigate = useNavigate();

  const [therapists] = createResource(
    isAuthenticated,
    async (authenticated) => {
      if (!authenticated) return [];
      return await therapistApi.getAllTherapists();
    },
  );

  createEffect(() => {
    if (!isAuthenticated()) {
      navigate("/login", { replace: true });
      return;
    }

    const currentUser = user();
    if (currentUser?.userType !== "PATIENT") {
      navigate("/", { replace: true });
    }
  });

  return (
    <div class="container mx-auto px-4 py-8">
      <div class="mb-8">
        <h1 class="text-3xl font-bold text-gray-900 mb-2">Find a Therapist</h1>
        <p class="text-gray-600">
          Browse our available therapists and their free consultation schedules
        </p>
      </div>

      <Show
        when={!therapists.loading}
        fallback={
          <div class="flex justify-center items-center py-12">
            <div class="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600" />
          </div>
        }
      >
        <Show
          when={therapists() && therapists()!.length > 0}
          fallback={
            <div class="text-center py-12">
              <p class="text-gray-500 text-lg">No therapists available</p>
            </div>
          }
        >
          <div class="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
            <For each={therapists()}>
              {(therapist) => <TherapistCard therapist={therapist} />}
            </For>
          </div>
        </Show>
      </Show>
    </div>
  );
};

export default Therapists;
