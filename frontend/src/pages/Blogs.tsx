import { Component, createEffect, createSignal, onMount, Show } from "solid-js";
import { useNavigate } from "@solidjs/router";
import { useAuth } from "../context/AuthContext";
import { blogApi, BlogPost } from "../api/blog";
import BlogList from "../components/BlogList";
import BlogModal from "../components/BlogModal";
import CreateBlogForm from "../components/CreateBlogForm";

const Blogs: Component = () => {
  const { user, isAuthenticated } = useAuth();
  const navigate = useNavigate();
  const [blogs, setBlogs] = createSignal<BlogPost[]>([]);
  const [loading, setLoading] = createSignal(true);
  const [error, setError] = createSignal("");
  const [showCreateForm, setShowCreateForm] = createSignal(false);
  const [selectedBlog, setSelectedBlog] = createSignal<BlogPost | null>(null);

  createEffect(() => {
    if (!isAuthenticated()) {
      navigate("/login", { replace: true });
      return;
    }

    const currentUser = user();
    if (currentUser?.userType !== "PATIENT") {
      navigate("/", { replace: true });
    }
  });

  onMount(() => {
    loadBlogs();
  });

  const loadBlogs = async () => {
    try {
      setLoading(true);
      setError("");
      const data = await blogApi.getAllBlogs();
      setBlogs(data);
    } catch (err) {
      setError(err instanceof Error ? err.message : "Failed to load blogs");
    } finally {
      setLoading(false);
    }
  };

  const handleCreateBlog = async (title: string, content: string) => {
    try {
      setError("");
      await blogApi.createBlog({ title, content });
      setShowCreateForm(false);
      await loadBlogs();
    } catch (err) {
      setError(err instanceof Error ? err.message : "Failed to create blog");
      throw err;
    }
  };

  const handleLike = async (blogId: number) => {
    try {
      const updateBlogLike = (blog: BlogPost) => {
        if (blog.idBlog === blogId) {
          return {
            ...blog,
            likedByCurrentUser: !blog.likedByCurrentUser,
            likesCount: blog.likedByCurrentUser
              ? blog.likesCount - 1
              : blog.likesCount + 1,
          };
        }
        return blog;
      };

      setBlogs(blogs().map(updateBlogLike));

      if (selectedBlog() && selectedBlog()?.idBlog === blogId) {
        setSelectedBlog(updateBlogLike(selectedBlog()!));
      }

      await blogApi.toggleLike(blogId);
    } catch (err) {
      setError(err instanceof Error ? err.message : "Failed to toggle like");
      await loadBlogs();

      if (selectedBlog()) {
        const updatedBlog = blogs().find((b) => b.idBlog === blogId);
        if (updatedBlog) {
          setSelectedBlog(updatedBlog);
        }
      }
    }
  };

  const handleAddComment = async (content: string) => {
    const blog = selectedBlog();
    if (!blog) return;

    try {
      const newCommentData = await blogApi.addComment(blog.idBlog, content);

      const updateBlogComments = (b: BlogPost) => {
        if (b.idBlog === blog.idBlog) {
          return {
            ...b,
            comments: [...b.comments, newCommentData],
            commentsCount: b.commentsCount + 1,
          };
        }
        return b;
      };

      setBlogs(blogs().map(updateBlogComments));
      setSelectedBlog(updateBlogComments(blog));
    } catch (err) {
      setError(err instanceof Error ? err.message : "Failed to add comment");
      throw err;
    }
  };

  const openBlog = async (blog: BlogPost) => {
    try {
      const fullBlog = await blogApi.getBlog(blog.idBlog);
      setSelectedBlog(fullBlog);
    } catch (err) {
      setError(
        err instanceof Error ? err.message : "Failed to load blog details",
      );

      setSelectedBlog(blog);
    }
  };

  const closeBlog = () => {
    setSelectedBlog(null);
  };

  return (
    <div class="max-w-4xl mx-auto px-4 py-8">
      <div class="flex justify-between items-center mb-8">
        <h1 class="text-3xl font-bold text-gray-900">Community Blogs</h1>
        <button
          onClick={() => setShowCreateForm(!showCreateForm())}
          class="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 transition-colors"
        >
          {showCreateForm() ? "Cancel" : "Create Post"}
        </button>
      </div>

      <Show
        when={!error()}
        fallback={
          <div class="mb-4 p-4 bg-red-50 border border-red-200 text-red-700 rounded-md">
            {error()}
          </div>
        }
      >
        <Show when={showCreateForm()}>
          <CreateBlogForm
            onSubmit={handleCreateBlog}
            onCancel={() => setShowCreateForm(false)}
          />
        </Show>

        <BlogList
          blogs={blogs()}
          loading={loading()}
          openBlog={openBlog}
          onLike={handleLike}
        />

        <Show when={selectedBlog()}>
          <BlogModal
            blog={selectedBlog()!}
            onClose={closeBlog}
            onLike={handleLike}
            onAddComment={handleAddComment}
          />
        </Show>
      </Show>
    </div>
  );
};

export default Blogs;
