import { Component, For } from "solid-js";
import { Consultation } from "../api/consultation";
import ConsultationRow from "./ConsultationRow";

interface ConsultationTableProps {
  consultations: Consultation[];
  onEdit: (consultation: Consultation) => void;
  onDelete: (id: number) => void;
  onTogglePayment: (consultation: Consultation) => void;
  readOnly?: boolean;
}

const ConsultationTable: Component<ConsultationTableProps> = (props) => (
  <div class="bg-white rounded-lg shadow overflow-hidden">
    <table class="min-w-full divide-y divide-gray-200">
      <thead class="bg-gray-50">
        <tr>
          <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
            Date
          </th>
          <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
            {props.readOnly ? "Therapist" : "Patient"}
          </th>
          <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
            Price
          </th>
          <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
            Payment Status
          </th>
          <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
            {props.readOnly ? "Details" : "Actions"}
          </th>
        </tr>
      </thead>
      <tbody class="bg-white divide-y divide-gray-200">
        <For each={props.consultations}>
          {(consultation) => (
            <ConsultationRow
              consultation={consultation}
              onEdit={props.onEdit}
              onDelete={props.onDelete}
              onTogglePayment={props.onTogglePayment}
              readOnly={props.readOnly}
            />
          )}
        </For>
      </tbody>
    </table>
  </div>
);

export default ConsultationTable;
