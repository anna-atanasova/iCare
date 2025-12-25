import { type Component, createSignal, For, Show } from "solid-js";
import { formatDate } from "@/utils";
import {
  type Therapy,
  therapyApi,
  type UpdateTherapyRequest,
} from "@/api/therapy";

interface ExistingTherapyListProps {
  consultationId: number;
  therapies: Therapy[];
  onTherapiesChange: (therapies: Therapy[]) => void;
  readOnly?: boolean;
}

const ExistingTherapyList: Component<ExistingTherapyListProps> = (props) => {
  const [editingId, setEditingId] = createSignal<number | null>(null);
  const [formData, setFormData] = createSignal({
    name: "",
    dose: "",
    expDate: "",
  });

  const startEditing = (therapy: Therapy) => {
    setFormData({
      name: therapy.name,
      dose: therapy.dose,
      expDate: therapy.expDate,
    });
    setEditingId(therapy.idTherapy);
  };

  const cancelEdit = () => {
    setEditingId(null);
    setFormData({ name: "", dose: "", expDate: "" });
  };

  const handleUpdate = async () => {
    const data = formData();

    if (!data.name.trim() || !data.dose.trim() || !data.expDate) {
      alert("Please fill in all therapy fields");
      return;
    }

    try {
      const updateData: UpdateTherapyRequest = {
        name: data.name,
        dose: data.dose,
        expDate: data.expDate,
      };
      await therapyApi.updateTherapy(editingId()!, updateData);

      const updated = props.therapies.map((t) =>
        t.idTherapy === editingId()
          ? { ...t, name: data.name, dose: data.dose, expDate: data.expDate }
          : t,
      );
      props.onTherapiesChange(updated);
      cancelEdit();
    } catch (error: any) {
      alert(error.message || "Failed to update therapy");
    }
  };

  const handleDelete = async (therapyId: number) => {
    if (!confirm("Are you sure you want to delete this therapy?")) return;

    try {
      await therapyApi.deleteTherapy(therapyId);

      const filtered = props.therapies.filter((t) => t.idTherapy !== therapyId);
      props.onTherapiesChange(filtered);
    } catch (error: any) {
      alert(error.message || "Failed to delete therapy");
    }
  };

  return (
    <Show
      when={props.therapies.length > 0}
      fallback={
        <p class="text-sm text-gray-500 italic">No existing therapies.</p>
      }
    >
      <div class="space-y-2">
        <For each={props.therapies}>
          {(therapy) => (
            <Show
              when={editingId() === therapy.idTherapy}
              fallback={
                <div class="p-3 bg-blue-50 border border-blue-200 rounded-lg hover:shadow-sm transition">
                  <div class="flex justify-between items-start">
                    <div class="flex-1">
                      <h4 class="font-semibold text-gray-900">
                        {therapy.name}
                      </h4>
                      <div class="text-sm text-gray-600 mt-1">
                        <span class="font-medium">Dose:</span> {therapy.dose}
                      </div>
                      <div class="text-xs text-gray-500 mt-1">
                        <span class="font-medium">Expires:</span>{" "}
                        {formatDate(therapy.expDate)}
                      </div>
                    </div>
                    <Show when={!props.readOnly}>
                      <div class="flex space-x-2 ml-4">
                        <button
                          type="button"
                          onClick={() => startEditing(therapy)}
                          class="text-xs text-blue-600 hover:text-blue-800 cursor-pointer"
                        >
                          Edit
                        </button>
                        <button
                          type="button"
                          onClick={() => handleDelete(therapy.idTherapy)}
                          class="text-xs text-red-600 hover:text-red-800 cursor-pointer"
                        >
                          Delete
                        </button>
                      </div>
                    </Show>
                  </div>
                </div>
              }
            >
              <div class="p-4 bg-blue-50 border-2 border-blue-400 rounded-lg">
                <div class="grid grid-cols-2 gap-3 mb-3">
                  <div>
                    <label class="block text-xs font-medium text-gray-700 mb-1">
                      Name
                    </label>
                    <input
                      type="text"
                      class="w-full px-2 py-1 text-sm border border-gray-300 rounded focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                      value={formData().name}
                      onChange={(e) =>
                        setFormData({
                          ...formData(),
                          name: e.currentTarget.value,
                        })
                      }
                      required
                    />
                  </div>
                  <div>
                    <label class="block text-xs font-medium text-gray-700 mb-1">
                      Dose
                    </label>
                    <input
                      type="text"
                      class="w-full px-2 py-1 text-sm border border-gray-300 rounded focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                      value={formData().dose}
                      onChange={(e) =>
                        setFormData({
                          ...formData(),
                          dose: e.currentTarget.value,
                        })
                      }
                      required
                    />
                  </div>
                </div>
                <div class="mb-3">
                  <label class="block text-xs font-medium text-gray-700 mb-1">
                    Expiration Date
                  </label>
                  <input
                    type="date"
                    class="w-full px-2 py-1 text-sm border border-gray-300 rounded focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    value={formData().expDate}
                    onChange={(e) =>
                      setFormData({
                        ...formData(),
                        expDate: e.currentTarget.value,
                      })
                    }
                    required
                  />
                </div>
                <div class="flex justify-end space-x-2">
                  <button
                    type="button"
                    onClick={cancelEdit}
                    class="px-3 py-1 text-sm border border-gray-300 rounded text-gray-700 hover:bg-gray-50 transition cursor-pointer"
                  >
                    Cancel
                  </button>
                  <button
                    type="button"
                    onClick={handleUpdate}
                    class="px-3 py-1 text-sm bg-blue-600 text-white rounded hover:bg-blue-700 transition cursor-pointer"
                  >
                    Update
                  </button>
                </div>
              </div>
            </Show>
          )}
        </For>
      </div>
    </Show>
  );
};

export default ExistingTherapyList;
