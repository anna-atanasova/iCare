import { Component, For, Show } from "solid-js";
import { Consultation } from "../api/consultation";
import { Patient } from "../api/patient";
import { Therapy } from "../api/therapy";
import TherapyList from "./TherapyList";
import ExistingTherapyList from "./ExistingTherapyList";

interface ConsultationFormData {
  patientId: number;
  date: string;
  price: number;
  advice: string;
  dateOfPayment: string | null;
}

interface ConsultationModalProps {
  editingConsultation: Consultation | null;
  formData: ConsultationFormData;
  patients: Patient[];
  newTherapies: Therapy[];
  existingTherapies: Therapy[];
  onClose: () => void;
  onSubmit: (e: Event) => void;
  onFormChange: (data: ConsultationFormData) => void;
  onNewTherapiesChange: (therapies: Therapy[]) => void;
  onExistingTherapiesChange: (therapies: Therapy[]) => void;
}

const ConsultationModal: Component<ConsultationModalProps> = (props) => (
  <div
    class="fixed inset-0 bg-black/50 flex items-center justify-center z-50"
    onClick={props.onClose}
  >
    <div
      class="bg-white rounded-lg p-6 w-full max-w-2xl max-h-[90vh] overflow-y-auto"
      onClick={(e) => e.stopPropagation()}
    >
      <h2 class="text-2xl font-bold mb-4">
        {props.editingConsultation
          ? "Edit Consultation"
          : "Log New Consultation"}
      </h2>

      <form onSubmit={props.onSubmit}>
        <div class="space-y-4">
          <Show when={!props.editingConsultation}>
            <div>
              <label class="block text-sm font-medium text-gray-700 mb-1">
                Patient
              </label>
              <select
                class="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                value={props.formData.patientId}
                onChange={(e) =>
                  props.onFormChange({
                    ...props.formData,
                    patientId: Number.parseInt(e.currentTarget.value),
                  })
                }
                required
              >
                <For each={props.patients}>
                  {(patient) => (
                    <option value={patient.userId}>
                      {patient.firstName} {patient.lastName}
                    </option>
                  )}
                </For>
              </select>
            </div>
          </Show>

          <div>
            <label class="block text-sm font-medium text-gray-700 mb-1">
              Consultation Date
            </label>
            <input
              type="date"
              class="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              value={props.formData.date}
              onChange={(e) =>
                props.onFormChange({
                  ...props.formData,
                  date: e.currentTarget.value,
                })
              }
              required
            />
          </div>

          <div>
            <label class="block text-sm font-medium text-gray-700 mb-1">
              Price
            </label>
            <input
              type="number"
              step="0.01"
              min="0"
              class="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              value={props.formData.price}
              onChange={(e) =>
                props.onFormChange({
                  ...props.formData,
                  price: Number.parseFloat(e.currentTarget.value),
                })
              }
              required
            />
          </div>

          <div>
            <label class="block text-sm font-medium text-gray-700 mb-1">
              Advice / Notes
            </label>
            <textarea
              class="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              rows="4"
              value={props.formData.advice}
              onChange={(e) =>
                props.onFormChange({
                  ...props.formData,
                  advice: e.currentTarget.value,
                })
              }
              placeholder="Enter any advice or notes from the consultation..."
            />
          </div>

          <div>
            <label class="flex items-center space-x-2 cursor-pointer">
              <input
                type="checkbox"
                class="w-4 h-4 text-blue-600 border-gray-300 rounded focus:ring-blue-500 cursor-pointer"
                checked={props.formData.dateOfPayment !== null}
                onChange={(e) => {
                  if (e.currentTarget.checked) {
                    props.onFormChange({
                      ...props.formData,
                      dateOfPayment: new Date().toISOString().split("T")[0],
                    });
                  } else {
                    props.onFormChange({
                      ...props.formData,
                      dateOfPayment: null,
                    });
                  }
                }}
              />
              <span class="text-sm font-medium text-gray-700">
                Mark as paid
              </span>
            </label>
          </div>

          <Show when={props.formData.dateOfPayment !== null}>
            <div>
              <label class="block text-sm font-medium text-gray-700 mb-1">
                Payment Date
              </label>
              <input
                type="date"
                class="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                value={props.formData.dateOfPayment || ""}
                onChange={(e) =>
                  props.onFormChange({
                    ...props.formData,
                    dateOfPayment: e.currentTarget.value,
                  })
                }
              />
            </div>
          </Show>
        </div>

        <Show when={props.editingConsultation}>
          <div class="mt-6">
            <h3 class="text-lg font-semibold text-gray-900 mb-3">
              Existing Therapies
            </h3>
            <ExistingTherapyList
              consultationId={props.editingConsultation!.idConsultation}
              therapies={props.existingTherapies}
              onTherapiesChange={props.onExistingTherapiesChange}
            />
          </div>
        </Show>

        <div class="mt-6">
          <h3 class="text-lg font-semibold text-gray-900 mb-3">
            <Show when={props.editingConsultation} fallback={<>Therapies</>}>
              New Therapies to Add
            </Show>
          </h3>
          <TherapyList
            therapies={props.newTherapies}
            onPendingTherapiesChange={props.onNewTherapiesChange}
          />
        </div>

        <div class="mt-6 flex justify-end space-x-3">
          <button
            type="button"
            onClick={props.onClose}
            class="px-4 py-2 border border-gray-300 rounded-lg text-gray-700 hover:bg-gray-50 transition cursor-pointer"
          >
            Cancel
          </button>
          <button
            type="submit"
            class="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition cursor-pointer"
          >
            {props.editingConsultation ? "Update" : "Create"}
          </button>
        </div>
      </form>
    </div>
  </div>
);

export default ConsultationModal;
