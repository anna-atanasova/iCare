import { getAuthHeader, getAuthHeaderJson } from "./auth";

const API_BASE_URL = "http://localhost:8080/api";

export interface Comment {
  idComment: number;
  content: string;
  dateOfComment: string;
  patientId: number;
  patientUsername: string;
  patientName: string;
}

export interface BlogPost {
  idBlog: number;
  title: string;
  content: string;
  dateOfPost: string;
  patientId: number;
  patientUsername: string;
  patientName: string;
  likesCount: number;
  commentsCount: number;
  likedByCurrentUser: boolean;
  comments: Comment[];
}

export interface CreateBlogRequest {
  title: string;
  content: string;
}

export interface UpdateBlogRequest {
  title: string;
  content: string;
}

export const blogApi = {
  getAllBlogs: async (): Promise<BlogPost[]> => {
    const response = await fetch(`${API_BASE_URL}/blogs`, {
      headers: getAuthHeader(),
    });

    if (!response.ok) {
      const error = await response.json();
      throw new Error(error.message || "Failed to fetch blogs");
    }

    return response.json();
  },

  getBlog: async (id: number): Promise<BlogPost> => {
    const response = await fetch(`${API_BASE_URL}/blogs/${id}`, {
      headers: getAuthHeader(),
    });

    if (!response.ok) {
      const error = await response.json();
      throw new Error(error.message || `Failed to fetch blog with id ${id}`);
    }

    return response.json();
  },

  createBlog: async (data: CreateBlogRequest): Promise<BlogPost> => {
    const response = await fetch(`${API_BASE_URL}/blogs`, {
      method: "POST",
      headers: getAuthHeaderJson(),
      body: JSON.stringify(data),
    });

    if (!response.ok) {
      const error = await response.json();
      throw new Error(error.message || "Failed to create blog");
    }

    return response.json();
  },

  updateBlog: async (
    id: number,
    data: UpdateBlogRequest,
  ): Promise<BlogPost> => {
    const response = await fetch(`${API_BASE_URL}/blogs/${id}`, {
      method: "PUT",
      headers: getAuthHeaderJson(),
      body: JSON.stringify(data),
    });

    if (!response.ok) {
      const error = await response.json();
      throw new Error(error.message || "Failed to update blog");
    }

    return response.json();
  },

  deleteBlog: async (id: number): Promise<void> => {
    const response = await fetch(`${API_BASE_URL}/blogs/${id}`, {
      method: "DELETE",
      headers: getAuthHeader(),
    });

    if (!response.ok) {
      const error = await response.json();
      throw new Error(error.message || "Failed to delete blog");
    }
  },

  toggleLike: async (id: number): Promise<void> => {
    const response = await fetch(`${API_BASE_URL}/blogs/${id}/like`, {
      method: "POST",
      headers: getAuthHeader(),
    });

    if (!response.ok) {
      const error = await response.json();
      throw new Error(error.message || "Failed to toggle like");
    }
  },

  addComment: async (blogId: number, content: string): Promise<Comment> => {
    const response = await fetch(`${API_BASE_URL}/blogs/${blogId}/comments`, {
      method: "POST",
      headers: getAuthHeaderJson(),
      body: JSON.stringify({ content }),
    });

    if (!response.ok) {
      const error = await response.json();
      throw new Error(error.message || "Failed to add comment");
    }

    return response.json();
  },

  updateComment: async (
    commentId: number,
    content: string,
  ): Promise<Comment> => {
    const response = await fetch(
      `${API_BASE_URL}/blogs/comments/${commentId}`,
      {
        method: "PUT",
        headers: getAuthHeaderJson(),
        body: JSON.stringify({ content }),
      },
    );

    if (!response.ok) {
      const error = await response.json();
      throw new Error(error.message || "Failed to update comment");
    }

    return response.json();
  },

  deleteComment: async (commentId: number): Promise<void> => {
    const response = await fetch(
      `${API_BASE_URL}/blogs/comments/${commentId}`,
      {
        method: "DELETE",
        headers: getAuthHeader(),
      },
    );

    if (!response.ok) {
      const error = await response.json();
      throw new Error(error.message || "Failed to delete comment");
    }
  },
};
