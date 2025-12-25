import { type Component, Show } from "solid-js";
import { formatDate } from "@/utils";
import { useAuth } from "@/context/AuthContext";
import type { BlogPost } from "@/api/blog";

interface BlogCardProps {
  blog: BlogPost;
  openBlog: (blog: BlogPost) => void;
  onLike: (blogId: number) => void;
  onEdit: (blog: BlogPost) => void;
  onDelete: (blogId: number) => void;
}

const BlogCard: Component<BlogCardProps> = (props) => {
  const { user } = useAuth();
  const isOwner = () => user()?.userId === props.blog.patientId;

  const handleDelete = () => {
    if (confirm("Are you sure you want to delete this blog post?")) {
      props.onDelete(props.blog.idBlog);
    }
  };

  return (
    <div class="bg-white p-6 rounded-lg shadow-md border border-gray-200 hover:shadow-lg transition-shadow">
      <div class="flex justify-between items-start">
        <div class="flex-1">
          <h2
            onClick={() => props.openBlog(props.blog)}
            class="text-2xl font-bold text-gray-900 mb-1 cursor-pointer hover:text-blue-600 transition-colors"
          >
            {props.blog.title}
          </h2>
          <div class="flex items-center gap-2 text-sm text-gray-600">
            <span class="font-medium">{props.blog.patientName}</span>
            <span>•</span>
            <span>{formatDate(props.blog.dateOfPost)}</span>
          </div>
        </div>
        <Show when={isOwner()}>
          <div class="flex items-center gap-2 ml-4">
            <button
              onClick={() => props.onEdit(props.blog)}
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
          </div>
        </Show>
      </div>

      <div class="flex items-center gap-4 mt-4 pt-4 border-t border-gray-200">
        <button
          onClick={() => props.onLike(props.blog.idBlog)}
          class={`flex items-center gap-2 px-3 py-1 rounded-md transition-colors cursor-pointer ${
            props.blog.likedByCurrentUser
              ? "bg-blue-100 text-blue-700"
              : "bg-gray-100 text-gray-700 hover:bg-gray-200"
          }`}
        >
          <svg
            class="w-5 h-5"
            fill={props.blog.likedByCurrentUser ? "currentColor" : "none"}
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
          <span class="font-medium">{props.blog.likesCount}</span>
        </button>

        <button
          onClick={() => props.openBlog(props.blog)}
          class="flex items-center gap-2 px-3 py-1 rounded-md bg-gray-100 text-gray-700 hover:bg-gray-200 transition-colors cursor-pointer"
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
              d="M7 8h10M7 12h4m1 8l-4-4H5a2 2 0 01-2-2V6a2 2 0 012-2h14a2 2 0 012 2v8a2 2 0 01-2 2h-3l-4 4z"
            />
          </svg>
          <span>{props.blog.commentsCount}</span>
        </button>
      </div>
    </div>
  );
};

export default BlogCard;
