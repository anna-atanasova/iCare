import { Component, Show, createSignal, createEffect } from "solid-js";
import { DiaryEntry } from "../api/diary";
import { formatDateWithLongWeekday } from "../utils";

interface DiaryModalProps {
  isOpen: boolean;
  onClose: () => void;
  entry?: DiaryEntry;
  date: Date;
  onSave: (rating: number, content: string) => Promise<void>;
  onDelete?: () => Promise<void>;
  isToday: boolean;
}

const DiaryModal: Component<DiaryModalProps> = (props) => {
  const [rating, setRating] = createSignal(props.entry?.dailyRating || 5);
  const [content, setContent] = createSignal(props.entry?.content || "");
  const [isSaving, setIsSaving] = createSignal(false);
  const [isDeleting, setIsDeleting] = createSignal(false);
  const [error, setError] = createSignal("");

  createEffect(() => {
    if (props.isOpen) {
      setRating(props.entry?.dailyRating || 5);
      setContent(props.entry?.content || "");
      setError("");
    }
  });

  const isEditMode = () => !!props.entry;

  const handleSave = async () => {
    if (!content().trim()) {
      setError("Please enter some content");
      return;
    }

    setIsSaving(true);
    setError("");

    try {
      await props.onSave(rating(), content());
      props.onClose();
    } catch (err: any) {
      setError(err.message || "Failed to save diary entry");
    } finally {
      setIsSaving(false);
    }
  };

  const handleDelete = async () => {
    if (!confirm("Are you sure you want to delete this diary entry?")) {
      return;
    }

    setIsDeleting(true);
    setError("");

    try {
      if (props.onDelete) {
        await props.onDelete();
        props.onClose();
      }
    } catch (err: any) {
      setError(err.message || "Failed to delete diary entry");
    } finally {
      setIsDeleting(false);
    }
  };

  return (
    <Show when={props.isOpen}>
      <div
        class="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4"
        onClick={props.onClose}
      >
        <div
          class="bg-white rounded-lg shadow-xl max-w-2xl w-full max-h-[90vh] overflow-y-auto"
          onClick={(e) => e.stopPropagation()}
        >
          <div class="p-6 border-b border-gray-200">
            <div class="flex justify-between items-start">
              <div>
                <h2 class="text-2xl font-bold text-gray-900">
                  {isEditMode() ? "Edit" : "Create"} Diary Entry
                </h2>
                <p class="text-sm text-gray-600 mt-1">
                  {formatDateWithLongWeekday(props.date)}
                </p>
              </div>
              <button
                onClick={props.onClose}
                class="text-gray-400 hover:text-gray-600 transition-colors"
              >
                <svg
                  class="w-6 h-6"
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
              </button>
            </div>
          </div>

          <div class="p-6 space-y-6">
            <div>
              <label class="block text-sm font-semibold text-gray-700 mb-2">
                How was your day? (1-10)
              </label>
              <Show
                when={!isEditMode() || props.isToday}
                fallback={
                  <div class="flex items-center gap-3">
                    <div class="text-4xl font-bold text-blue-600">
                      {rating()}
                    </div>
                    <span class="text-sm text-gray-500">
                      (Rating cannot be changed for past entries)
                    </span>
                  </div>
                }
              >
                <div class="space-y-2">
                  <input
                    type="range"
                    min="1"
                    max="10"
                    value={rating()}
                    onInput={(e) =>
                      setRating(Number.parseInt(e.currentTarget.value))
                    }
                    class="w-full h-2 bg-gray-200 rounded-lg appearance-none cursor-pointer"
                  />
                  <div class="flex justify-between text-xs text-gray-600">
                    <span>1 (Very Bad)</span>
                    <span class="text-xl font-bold text-blue-600">
                      {rating()}
                    </span>
                    <span>10 (Excellent)</span>
                  </div>
                </div>
              </Show>
            </div>

            <div>
              <label class="block text-sm font-semibold text-gray-700 mb-2">
                Your thoughts and feelings
              </label>
              <textarea
                value={content()}
                onInput={(e) => setContent(e.currentTarget.value)}
                rows={8}
                class="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent resize-none"
                placeholder="What happened today? How did it make you feel?"
              />
            </div>

            <Show when={error()}>
              <div class="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-lg">
                {error()}
              </div>
            </Show>
          </div>

          <div class="p-6 border-t border-gray-200 flex justify-between items-center">
            <Show when={isEditMode() && props.isToday && props.onDelete}>
              <button
                onClick={handleDelete}
                disabled={isSaving() || isDeleting()}
                class="px-4 py-2 text-red-700 bg-red-50 border border-red-200 rounded-lg hover:bg-red-100 transition-colors disabled:opacity-50 flex items-center gap-2 cursor-pointer"
              >
                <Show when={isDeleting()}>
                  <div class="animate-spin rounded-full h-4 w-4 border-b-2 border-red-700"></div>
                </Show>
                {isDeleting() ? "Deleting..." : "Delete Entry"}
              </button>
            </Show>
            <div class="flex gap-3 ml-auto">
              <button
                onClick={props.onClose}
                disabled={isSaving() || isDeleting()}
                class="px-4 py-2 text-gray-700 bg-gray-100 rounded-lg hover:bg-gray-200 transition-colors disabled:opacity-50 cursor-pointer"
              >
                Cancel
              </button>
              <button
                onClick={handleSave}
                disabled={isSaving() || isDeleting()}
                class="px-6 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors disabled:opacity-50 flex items-center gap-2 cursor-pointer"
              >
                <Show when={isSaving()}>
                  <div class="animate-spin rounded-full h-4 w-4 border-b-2 border-white"></div>
                </Show>
                {isSaving() ? "Saving..." : "Save Entry"}
              </button>
            </div>
          </div>
        </div>
      </div>
    </Show>
  );
};

export default DiaryModal;
