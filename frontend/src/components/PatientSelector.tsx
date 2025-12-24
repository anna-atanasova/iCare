import { Component, For, Show } from "solid-js";
import { Patient } from "../api/therapist";

interface PatientSelectorProps {
  patients: Patient[] | undefined;
  loading: boolean;
  selectedPatientId: number | null;
  onPatientChange: (patientId: number | null) => void;
}

const PatientSelector: Component<PatientSelectorProps> = (props) => (
  <div class="mb-6">
    <label
      for="patient-selector"
      class="block text-sm font-semibold text-gray-700 mb-2"
    >
      Select Patient
    </label>
    <Show
      when={!props.loading}
      fallback={
        <div class="flex items-center gap-2 text-gray-500">
          <div class="animate-spin rounded-full h-4 w-4 border-b-2 border-blue-600" />
          <span>Loading patients...</span>
        </div>
      }
    >
      <select
        id="patient-selector"
        value={props.selectedPatientId || ""}
        onChange={(e) => {
          const value = e.currentTarget.value;
          props.onPatientChange(value ? Number(value) : null);
        }}
        class="w-full md:w-96 px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
      >
        <Show when={!props.patients || props.patients.length === 0}>
          <option value="">No patients assigned</option>
        </Show>
        <For each={props.patients}>
          {(patient) => (
            <option value={patient.userId}>
              {patient.firstName} {patient.lastName} ({patient.email})
            </option>
          )}
        </For>
      </select>
    </Show>
  </div>
);

export default PatientSelector;
