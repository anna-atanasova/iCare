import { Component, createSignal, Show } from "solid-js";
import { BlogPost } from "../api/blog";
import CommentSection from "./CommentSection";
import { formatDate } from "../utils";
import { useAuth } from "../context/AuthContext";

interface BlogModalProps {
  blog: BlogPost;
  onClose: () => void;
  onLike: (blogId: number) => void;
  onAddComment: (content: string) => Promise<void>;
  onUpdateBlog?: (
    blogId: number,
    title: string,
    content: string,
  ) => Promise<void>;
  onDeleteBlog?: (blogId: number) => Promise<void>;
  onUpdateComment?: (commentId: number, content: string) => Promise<void>;
  onDeleteComment?: (commentId: number) => Promise<void>;
}

const BlogModal: Component<BlogModalProps> = (props) => {
  const { user } = useAuth();
  const [isEditing, setIsEditing] = createSignal(false);
  const [editTitle, setEditTitle] = createSignal("");
  const [editContent, setEditContent] = createSignal("");

  const isOwner = () => user()?.userId === props.blog?.patientId;

  const startEdit = () => {
    setEditTitle(props.blog?.title || "");
    setEditContent(props.blog?.content || "");
    setIsEditing(true);
  };

  const cancelEdit = () => {
    setIsEditing(false);
  };

  const saveEdit = async () => {
    if (props.onUpdateBlog && props.blog) {
      await props.onUpdateBlog(props.blog.idBlog, editTitle(), editContent());
      setIsEditing(false);
    }
  };

  const handleDelete = async () => {
    if (
      props.onDeleteBlog &&
      props.blog &&
      confirm("Are you sure you want to delete this blog post?")
    ) {
      await props.onDeleteBlog(props.blog.idBlog);
    }
  };

  return (
    <div
      class="fixed inset-0 backdrop-blur-sm bg-gray-900/20 flex items-center justify-center p-4 z-50"
      onClick={props.onClose}
    >
      <div
        class="bg-white rounded-lg shadow-xl max-w-3xl w-full max-h-[90vh] overflow-y-auto"
        onClick={(e) => e.stopPropagation()}
      >
        <div class="sticky top-0 bg-white border-b border-gray-200 p-6">
          <div class="flex justify-between items-start">
            <div class="flex-1">
              <Show
                when={!isEditing()}
                fallback={
                  <div class="space-y-3">
                    <input
                      type="text"
                      value={editTitle()}
                      onInput={(e) => setEditTitle(e.currentTarget.value)}
                      class="w-full text-3xl font-bold text-gray-900 border-b-2 border-blue-500 focus:outline-none"
                      placeholder="Title"
                    />
                  </div>
                }
              >
                <h2 class="text-3xl font-bold text-gray-900 mb-2">
                  {props.blog?.title}
                </h2>
              </Show>
              <div class="flex items-center gap-2 text-sm text-gray-600 mt-2">
                <span class="font-medium">{props.blog?.patientName}</span>
                <span>•</span>
                <span>{formatDate(props.blog?.dateOfPost || "")}</span>
              </div>
            </div>
            <div class="flex items-center gap-2 ml-4">
              <Show when={isOwner() && !isEditing()}>
                <button
                  onClick={startEdit}
                  class="text-gray-400 hover:text-blue-600 transition-colors cursor-pointer"
                  title="Edit blog"
                >
                  <svg
                    class="w-5 h-5"
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
                  onClick={handleDelete}
                  class="text-gray-400 hover:text-red-600 transition-colors cursor-pointer"
                  title="Delete blog"
                >
                  <svg
                    class="w-5 h-5"
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
              <button
                onClick={props.onClose}
                class="text-gray-400 hover:text-gray-600 transition-colors cursor-pointer"
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
        </div>

        <div class="p-6">
          <Show
            when={!isEditing()}
            fallback={
              <div class="space-y-4 mb-6">
                <textarea
                  value={editContent()}
                  onInput={(e) => setEditContent(e.currentTarget.value)}
                  class="w-full min-h-50 p-3 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  placeholder="Write your blog content..."
                />
                <div class="flex gap-2">
                  <button
                    onClick={saveEdit}
                    class="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 transition-colors cursor-pointer"
                  >
                    Save Changes
                  </button>
                  <button
                    onClick={cancelEdit}
                    class="px-4 py-2 bg-gray-200 text-gray-700 rounded-md hover:bg-gray-300 transition-colors cursor-pointer"
                  >
                    Cancel
                  </button>
                </div>
              </div>
            }
          >
            <p class="text-gray-700 text-lg mb-6 whitespace-pre-wrap">
              {props.blog?.content}
            </p>
          </Show>

          <div class="flex items-center gap-4 pb-6 mb-6 border-b border-gray-200">
            <button
              onClick={() => {
                if (props.blog) {
                  props.onLike(props.blog.idBlog);
                }
              }}
              class={`flex items-center gap-2 px-3 py-1 rounded-md transition-colors cursor-pointer ${
                props.blog?.likedByCurrentUser
                  ? "bg-blue-100 text-blue-700"
                  : "bg-gray-100 text-gray-700 hover:bg-gray-200"
              }`}
            >
              <svg
                class="w-5 h-5"
                fill={props.blog?.likedByCurrentUser ? "currentColor" : "none"}
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  stroke-linecap="round"
                  stroke-linejoin="round"
                  stroke-width="2"
                  d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z"
                />
              </svg>
              <span class="font-medium">{props.blog?.likesCount}</span>
            </button>
          </div>

          <CommentSection
            comments={props.blog?.comments || []}
            commentsCount={props.blog?.commentsCount || 0}
            onAddComment={props.onAddComment}
            onUpdateComment={props.onUpdateComment}
            onDeleteComment={props.onDeleteComment}
          />
        </div>
      </div>
    </div>
  );
};

export default BlogModal;
