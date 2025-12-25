import { type Component, createSignal, For, Show } from "solid-js";
import { formatDate } from "@/utils";
import type { Therapy } from "@/api/therapy";

interface TherapyListProps {
  therapies: Therapy[];
  onPendingTherapiesChange: (therapies: Therapy[]) => void;
  readOnly?: boolean;
}

const TherapyList: Component<TherapyListProps> = (props) => {
  const [isAdding, setIsAdding] = createSignal(false);
  const [editingId, setEditingId] = createSignal<number | null>(null);
  const [formData, setFormData] = createSignal({
    name: "",
    dose: "",
    expDate: "",
  });

  const startAdding = () => {
    setFormData({ name: "", dose: "", expDate: "" });
    setIsAdding(true);
  };

  const startEditing = (therapy: Therapy) => {
    setFormData({
      name: therapy.name,
      dose: therapy.dose,
      expDate: therapy.expDate,
    });
    setEditingId(therapy.idTherapy);
  };

  const cancelEdit = () => {
    setIsAdding(false);
    setEditingId(null);
    setFormData({ name: "", dose: "", expDate: "" });
  };

  const handleSave = () => {
    const data = formData();

    if (!data.name.trim() || !data.dose.trim() || !data.expDate) {
      alert("Please fill in all therapy fields");
      return;
    }

    const newTherapies = [...props.therapies];

    if (editingId()) {
      const index = newTherapies.findIndex((t) => {
        return t.idTherapy === editingId();
      });

      if (index !== -1) {
        newTherapies[index] = {
          ...newTherapies[index],
          name: data.name,
          dose: data.dose,
          expDate: data.expDate,
        };
        props.onPendingTherapiesChange(newTherapies);
      }
    } else {
      const newTherapy: Therapy = {
        idTherapy: Date.now(),
        name: data.name,
        dose: data.dose,
        expDate: data.expDate,
        consultationId: 0,
      };
      newTherapies.push(newTherapy);
      props.onPendingTherapiesChange(newTherapies);
    }

    cancelEdit();
  };

  const handleDelete = (therapyId: number) => {
    if (!confirm("Are you sure you want to delete this therapy?")) return;

    const newTherapies = props.therapies.filter(
      (t) => t.idTherapy !== therapyId,
    );
    props.onPendingTherapiesChange(newTherapies);
  };

  return (
    <div class="mt-6">
      <div class="flex justify-between items-center mb-3">
        <h3 class="text-lg font-semibold text-gray-900">Therapies</h3>
        <Show when={!isAdding() && !editingId()}>
          <button
            type="button"
            onClick={startAdding}
            class="px-3 py-1 text-sm bg-green-600 text-white rounded hover:bg-green-700 transition cursor-pointer"
          >
            + Add Therapy
          </button>
        </Show>
      </div>

      <Show when={isAdding() || editingId()}>
        <div class="mb-4 p-4 bg-gray-50 rounded-lg border border-gray-200">
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
                  setFormData({ ...formData(), name: e.currentTarget.value })
                }
                placeholder="e.g., Aspirin"
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
                  setFormData({ ...formData(), dose: e.currentTarget.value })
                }
                placeholder="e.g., 100mg"
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
                setFormData({ ...formData(), expDate: e.currentTarget.value })
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
              onClick={handleSave}
              class="px-3 py-1 text-sm bg-blue-600 text-white rounded hover:bg-blue-700 transition cursor-pointer"
            >
              {editingId() ? "Update" : "Add"}
            </button>
          </div>
        </div>
      </Show>

      <Show
        when={props.therapies.length > 0}
        fallback={
          <p class="text-sm text-gray-500 italic">No therapies assigned yet.</p>
        }
      >
        <div class="space-y-2">
          <For each={props.therapies}>
            {(therapy) => (
              <div class="p-3 bg-white border border-gray-200 rounded-lg hover:shadow-sm transition">
                <div class="flex justify-between items-start">
                  <div class="flex-1">
                    <h4 class="font-semibold text-gray-900">{therapy.name}</h4>
                    <div class="text-sm text-gray-600 mt-1">
                      <span class="font-medium">Dose:</span> {therapy.dose}
                    </div>
                    <div class="text-xs text-gray-500 mt-1">
                      <span class="font-medium">Expires:</span>{" "}
                      {formatDate(therapy.expDate)}
                    </div>
                  </div>
                  <Show when={!isAdding() && !editingId() && !props.readOnly}>
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
            )}
          </For>
        </div>
      </Show>
    </div>
  );
};

export default TherapyList;
