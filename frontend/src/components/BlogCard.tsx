import { Component } from "solid-js";
import { BlogPost } from "../api/blog";
import { formatDate } from "../utils";

interface BlogCardProps {
  blog: BlogPost;
  openBlog: (blog: BlogPost) => void;
  onLike: (blogId: number) => void;
}

const BlogCard: Component<BlogCardProps> = (props) => (
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

export default BlogCard;
