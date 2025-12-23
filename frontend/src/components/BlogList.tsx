import { Component, For, Show } from "solid-js";
import { BlogPost } from "../api/blog";
import BlogCard from "./BlogCard";

interface BlogListProps {
  blogs: BlogPost[];
  loading: boolean;
  openBlog: (blog: BlogPost) => void;
  onLike: (blogId: number) => void;
}

const BlogList: Component<BlogListProps> = (props) => (
  <>
    <Show when={props.loading}>
      <div class="text-center py-12">
        <div class="inline-block animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
        <p class="mt-2 text-gray-600">Loading blogs...</p>
      </div>
    </Show>

    <Show when={!props.loading && props.blogs.length === 0}>
      <div class="text-center py-12 bg-white rounded-lg shadow-md">
        <p class="text-gray-600">No blogs yet. Be the first to post!</p>
      </div>
    </Show>

    <div class="space-y-4">
      <For each={props.blogs}>
        {(blog) => (
          <BlogCard
            blog={blog}
            openBlog={props.openBlog}
            onLike={props.onLike}
          />
        )}
      </For>
    </div>
  </>
);

export default BlogList;
