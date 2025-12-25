import { type Component, createSignal } from "solid-js";

interface CreateBlogFormProps {
  onSubmit: (title: string, content: string) => Promise<void>;
  onCancel: () => void;
}

const CreateBlogForm: Component<CreateBlogFormProps> = (props) => {
  const [title, setTitle] = createSignal("");
  const [content, setContent] = createSignal("");
  const [submitting, setSubmitting] = createSignal(false);

  const handleSubmit = async (e: Event) => {
    e.preventDefault();
    setSubmitting(true);
    try {
      await props.onSubmit(title(), content());
      setTitle("");
      setContent("");
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div class="mb-8 bg-white p-6 rounded-lg shadow-md border border-gray-200">
      <h2 class="text-xl font-semibold mb-4">Create New Post</h2>
      <form onSubmit={handleSubmit}>
        <div class="mb-4">
          <label
            for="title"
            class="block text-sm font-medium text-gray-700 mb-1"
          >
            Title
          </label>
          <input
            id="title"
            type="text"
            required
            class="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
            value={title()}
            onInput={(e) => setTitle(e.currentTarget.value)}
            placeholder="Enter blog title..."
          />
        </div>
        <div class="mb-4">
          <label
            for="content"
            class="block text-sm font-medium text-gray-700 mb-1"
          >
            Content
          </label>
          <textarea
            id="content"
            required
            rows={6}
            class="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 resize-none"
            value={content()}
            onInput={(e) => setContent(e.currentTarget.value)}
            placeholder="Share your thoughts..."
          />
        </div>
        <button
          type="submit"
          disabled={submitting()}
          class="w-full px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 disabled:bg-gray-400 transition-colors"
        >
          {submitting() ? "Posting..." : "Post"}
        </button>
      </form>
    </div>
  );
};

export default CreateBlogForm;
