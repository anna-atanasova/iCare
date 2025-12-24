import { Component } from "solid-js";
import { Consultation, isConsultationPaid } from "../api/consultation";
import { formatDate } from "../utils";

interface ConsultationRowProps {
  consultation: Consultation;
  onEdit: (consultation: Consultation) => void;
  onDelete: (id: number) => void;
  onTogglePayment: (consultation: Consultation) => void;
}

const formatCurrency = (amount: number) =>
  new Intl.NumberFormat("mk-MK", {
    style: "currency",
    currency: "EUR",
  }).format(amount);

const ConsultationRow: Component<ConsultationRowProps> = (props) => (
  <tr class="hover:bg-gray-50">
    <td class="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
      {formatDate(props.consultation.date)}
    </td>
    <td class="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
      {props.consultation.patientName}
    </td>
    <td class="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
      {formatCurrency(props.consultation.price)}
    </td>
    <td class="px-6 py-4 whitespace-nowrap">
      <button
        onClick={() => props.onTogglePayment(props.consultation)}
        class={`px-3 py-1 rounded-full text-xs font-semibold cursor-pointer ${
          isConsultationPaid(props.consultation)
            ? "bg-green-100 text-green-800 hover:bg-green-200"
            : "bg-red-100 text-red-800 hover:bg-red-200"
        }`}
      >
        {isConsultationPaid(props.consultation)
          ? `Paid (${formatDate(props.consultation.dateOfPayment!)})`
          : "Unpaid"}
      </button>
    </td>
    <td class="px-6 py-4 whitespace-nowrap text-sm font-medium">
      <button
        onClick={() => props.onEdit(props.consultation)}
        class="text-blue-600 hover:text-blue-900 mr-4 cursor-pointer"
      >
        Edit
      </button>
      <button
        onClick={() => props.onDelete(props.consultation.idConsultation)}
        class="text-red-600 hover:text-red-900 cursor-pointer"
      >
        Delete
      </button>
    </td>
  </tr>
);

export default ConsultationRow;
