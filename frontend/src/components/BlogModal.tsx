import { Component } from "solid-js";
import { BlogPost } from "../api/blog";
import CommentSection from "./CommentSection";
import { formatDate } from "../utils";

interface BlogModalProps {
  blog: BlogPost;
  onClose: () => void;
  onLike: (blogId: number) => void;
  onAddComment: (content: string) => Promise<void>;
}

const BlogModal: Component<BlogModalProps> = (props) => (
  <div
    class="fixed inset-0 backdrop-blur-sm bg-gray-900/20 flex items-center justify-center p-4 z-50"
    onClick={props.onClose}
  >
    <div
      class="bg-white rounded-lg shadow-xl max-w-3xl w-full max-h-[90vh] overflow-y-auto"
      onClick={(e) => e.stopPropagation()}
    >
      <div class="sticky top-0 bg-white border-b border-gray-200 p-6 flex justify-between items-start">
        <div class="flex-1">
          <h2 class="text-3xl font-bold text-gray-900 mb-2">
            {props.blog?.title}
          </h2>
          <div class="flex items-center gap-2 text-sm text-gray-600">
            <span class="font-medium">{props.blog?.patientName}</span>
            <span>•</span>
            <span>{formatDate(props.blog?.dateOfPost || "")}</span>
          </div>
        </div>
        <button
          onClick={props.onClose}
          class="ml-4 text-gray-400 hover:text-gray-600 transition-colors"
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

      <div class="p-6">
        <p class="text-gray-700 text-lg mb-6 whitespace-pre-wrap">
          {props.blog?.content}
        </p>

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

          <div class="flex items-center gap-2 text-gray-600">
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
            <span>{props.blog?.commentsCount} Comments</span>
          </div>
        </div>

        <CommentSection
          comments={props.blog?.comments || []}
          commentsCount={props.blog?.commentsCount || 0}
          onAddComment={props.onAddComment}
        />
      </div>
    </div>
  </div>
);

export default BlogModal;
