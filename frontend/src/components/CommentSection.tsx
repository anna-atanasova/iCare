import { type Component, createSignal, For, Show } from "solid-js";
import { formatDateTime } from "@/utils";
import { useAuth } from "@/context/AuthContext";
import type { Comment } from "@/api/blog";

interface CommentSectionProps {
  comments: Comment[];
  commentsCount: number;
  onAddComment: (content: string) => Promise<void>;
  onUpdateComment?: (commentId: number, content: string) => Promise<void>;
  onDeleteComment?: (commentId: number) => Promise<void>;
}

const CommentSection: Component<CommentSectionProps> = (props) => {
  const { user } = useAuth();
  const [newComment, setNewComment] = createSignal("");
  const [editingCommentId, setEditingCommentId] = createSignal<number | null>(
    null,
  );
  const [editContent, setEditContent] = createSignal("");

  const handleSubmit = async (e: Event) => {
    e.preventDefault();
    if (!newComment().trim()) return;

    await props.onAddComment(newComment());
    setNewComment("");
  };

  const startEdit = (comment: Comment) => {
    setEditingCommentId(comment.idComment);
    setEditContent(comment.content);
  };

  const cancelEdit = () => {
    setEditingCommentId(null);
    setEditContent("");
  };

  const saveEdit = async (commentId: number) => {
    if (props.onUpdateComment && editContent().trim()) {
      await props.onUpdateComment(commentId, editContent());
      setEditingCommentId(null);
      setEditContent("");
    }
  };

  const handleDelete = async (commentId: number) => {
    if (
      props.onDeleteComment &&
      confirm("Are you sure you want to delete this comment?")
    ) {
      await props.onDeleteComment(commentId);
    }
  };

  const isCommentOwner = (comment: Comment) =>
    user()?.userId === comment.patientId;

  const sortedComments = () => {
    if (!props.comments) return [];

    return [...props.comments].sort(
      (a, b) =>
        new Date(b.dateOfComment).getTime() -
        new Date(a.dateOfComment).getTime(),
    );
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
          <For each={sortedComments()}>
            {(comment) => (
              <div class="bg-gray-50 p-4 rounded-lg border border-gray-200">
                <div class="flex justify-between items-start mb-2">
                  <span class="font-semibold text-gray-900">
                    {comment.patientName}
                  </span>
                  <div class="flex items-center gap-2">
                    <span class="text-xs text-gray-500">
                      {formatDateTime(comment.dateOfComment)}
                    </span>
                    <Show
                      when={
                        isCommentOwner(comment) &&
                        editingCommentId() !== comment.idComment
                      }
                    >
                      <button
                        onClick={() => startEdit(comment)}
                        class="text-gray-400 hover:text-blue-600 transition-colors cursor-pointer"
                        title="Edit comment"
                      >
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
                            d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z"
                          />
                        </svg>
                      </button>
                      <button
                        onClick={() => handleDelete(comment.idComment)}
                        class="text-gray-400 hover:text-red-600 transition-colors cursor-pointer"
                        title="Delete comment"
                      >
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
                            d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16"
                          />
                        </svg>
                      </button>
                    </Show>
                  </div>
                </div>
                <Show
                  when={editingCommentId() !== comment.idComment}
                  fallback={
                    <div class="space-y-2">
                      <textarea
                        value={editContent()}
                        onInput={(e) => setEditContent(e.currentTarget.value)}
                        class="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 resize-none"
                        rows={3}
                      />
                      <div class="flex gap-2">
                        <button
                          onClick={() => saveEdit(comment.idComment)}
                          class="px-3 py-1 text-sm bg-blue-600 text-white rounded-md hover:bg-blue-700 transition-colors cursor-pointer"
                        >
                          Save
                        </button>
                        <button
                          onClick={cancelEdit}
                          class="px-3 py-1 text-sm bg-gray-200 text-gray-700 rounded-md hover:bg-gray-300 transition-colors cursor-pointer"
                        >
                          Cancel
                        </button>
                      </div>
                    </div>
                  }
                >
                  <p class="text-gray-700 whitespace-pre-wrap">
                    {comment.content}
                  </p>
                </Show>
              </div>
            )}
          </For>
        </div>
      </Show>
    </div>
  );
};

export default CommentSection;
