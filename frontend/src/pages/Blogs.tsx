import {
  Component,
  createEffect,
  createSignal,
  createResource,
  Show,
} from "solid-js";
import { useNavigate } from "@solidjs/router";
import { useAuth } from "../context/AuthContext";
import { blogApi, BlogPost } from "../api/blog";
import BlogList from "../components/BlogList";
import BlogModal from "../components/BlogModal";
import CreateBlogForm from "../components/CreateBlogForm";

const Blogs: Component = () => {
  const { user, isAuthenticated } = useAuth();
  const navigate = useNavigate();
  const [showCreateForm, setShowCreateForm] = createSignal(false);
  const [selectedBlogId, setSelectedBlogId] = createSignal<number | null>(null);
  const [editMode, setEditMode] = createSignal(false);

  const [blogs, { refetch: refetchBlogs }] = createResource(async () => {
    if (!isAuthenticated()) return [];
    return await blogApi.getAllBlogs();
  });

  const [selectedBlog, { refetch: refetchSelectedBlog }] = createResource(
    selectedBlogId,
    async (id) => {
      if (!id) return null;
      return await blogApi.getBlog(id);
    },
  );

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

  const handleCreateBlog = async (title: string, content: string) => {
    await blogApi.createBlog({ title, content });
    setShowCreateForm(false);
    refetchBlogs();
  };

  const handleLike = async (blogId: number) => {
    try {
      await blogApi.toggleLike(blogId);
    } finally {
      refetchBlogs();
      if (selectedBlogId() === blogId) {
        refetchSelectedBlog();
      }
    }
  };

  const handleAddComment = async (content: string) => {
    const blog = selectedBlog();
    if (!blog) return;

    await blogApi.addComment(blog.idBlog, content);
    refetchBlogs();
    refetchSelectedBlog();
  };

  const handleUpdateBlog = async (
    blogId: number,
    title: string,
    content: string,
  ) => {
    await blogApi.updateBlog(blogId, { title, content });
    refetchBlogs();
    if (selectedBlogId() === blogId) {
      refetchSelectedBlog();
    }
  };

  const handleDeleteBlog = async (blogId: number) => {
    await blogApi.deleteBlog(blogId);
    if (selectedBlogId() === blogId) {
      closeBlog();
    }
    refetchBlogs();
  };

  const handleUpdateComment = async (commentId: number, content: string) => {
    await blogApi.updateComment(commentId, content);
    refetchBlogs();
    refetchSelectedBlog();
  };

  const handleDeleteComment = async (commentId: number) => {
    await blogApi.deleteComment(commentId);
    refetchBlogs();
    refetchSelectedBlog();
  };

  const openBlog = (blog: BlogPost) => {
    setSelectedBlogId(blog.idBlog);
    setEditMode(false);
  };

  const openBlogInEditMode = (blog: BlogPost) => {
    setSelectedBlogId(blog.idBlog);
    setEditMode(true);
  };

  const handleQuickDelete = async (blogId: number) => {
    await blogApi.deleteBlog(blogId);
    refetchBlogs();
  };

  const closeBlog = () => {
    setSelectedBlogId(null);
    setEditMode(false);
  };

  return (
    <div class="max-w-4xl mx-auto px-4 py-8">
      <div class="flex justify-between items-center mb-8">
        <h1 class="text-3xl font-bold text-gray-900">Community Blogs</h1>
        <button
          onClick={() => setShowCreateForm(!showCreateForm())}
          class="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 transition-colors cursor-pointer"
        >
          {showCreateForm() ? "Cancel" : "Create Post"}
        </button>
      </div>

      <Show when={blogs.error}>
        <div class="mb-4 p-4 bg-red-50 border border-red-200 text-red-700 rounded-md">
          {blogs.error instanceof Error
            ? blogs.error.message
            : "Failed to load blogs"}
        </div>
      </Show>

      <Show when={showCreateForm()}>
        <CreateBlogForm
          onSubmit={handleCreateBlog}
          onCancel={() => setShowCreateForm(false)}
        />
      </Show>

      <BlogList
        blogs={blogs() || []}
        loading={blogs.loading}
        openBlog={openBlog}
        onLike={handleLike}
        onEdit={openBlogInEditMode}
        onDelete={handleQuickDelete}
      />

      <Show when={selectedBlogId() && selectedBlog()}>
        <BlogModal
          blog={selectedBlog()!}
          onClose={closeBlog}
          onLike={handleLike}
          onAddComment={handleAddComment}
          onUpdateBlog={handleUpdateBlog}
          onDeleteBlog={handleDeleteBlog}
          onUpdateComment={handleUpdateComment}
          onDeleteComment={handleDeleteComment}
          initialEditMode={editMode()}
        />
      </Show>
    </div>
  );
};

export default Blogs;
