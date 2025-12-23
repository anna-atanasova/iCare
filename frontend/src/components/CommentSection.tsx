import { Component, For, Show, createSignal } from "solid-js";
import { Comment } from "../api/blog";
import { formatDateTime } from "../utils";

interface CommentSectionProps {
  comments: Comment[];
  commentsCount: number;
  onAddComment: (content: string) => Promise<void>;
}

const CommentSection: Component<CommentSectionProps> = (props) => {
  const [newComment, setNewComment] = createSignal("");

  const handleSubmit = async (e: Event) => {
    e.preventDefault();
    if (!newComment().trim()) return;

    await props.onAddComment(newComment());
    setNewComment("");
  };

  return (
    <div class="space-y-4">
      <h3 class="text-xl font-semibold text-gray-900 mb-4">Comments</h3>

      <form onSubmit={handleSubmit} class="mb-6">
        <textarea
          rows={3}
          class="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 resize-none"
          placeholder="Write a comment..."
          value={newComment()}
          onInput={(e) => setNewComment(e.currentTarget.value)}
        />
        <button
          type="submit"
          disabled={!newComment().trim()}
          class="mt-2 px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 disabled:bg-gray-400 transition-colors cursor-pointer"
        >
          Post Comment
        </button>
      </form>

      <Show when={props.commentsCount === 0}>
        <p class="text-gray-500 text-center py-4">
          No comments yet. Be the first to comment!
        </p>
      </Show>

      <Show when={(props.comments?.length || 0) > 0}>
        <div class="space-y-4">
          <For each={props.comments}>
            {(comment) => (
              <div class="bg-gray-50 p-4 rounded-lg border border-gray-200">
                <div class="flex justify-between items-start mb-2">
                  <span class="font-semibold text-gray-900">
                    {comment.patientName}
                  </span>
                  <span class="text-xs text-gray-500">
                    {formatDateTime(comment.dateOfComment)}
                  </span>
                </div>
                <p class="text-gray-700 whitespace-pre-wrap">
                  {comment.content}
                </p>
              </div>
            )}
          </For>
        </div>
      </Show>
    </div>
  );
};

export default CommentSection;
