import { apiClient } from "@/api/client";

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
  getAllBlogs: async (): Promise<BlogPost[]> =>
    apiClient.get<BlogPost[]>("/blogs"),

  getBlog: async (id: number): Promise<BlogPost> =>
    apiClient.get<BlogPost>(`/blogs/${id}`),

  createBlog: async (data: CreateBlogRequest): Promise<BlogPost> =>
    apiClient.post<BlogPost>("/blogs", data),

  updateBlog: async (id: number, data: UpdateBlogRequest): Promise<BlogPost> =>
    apiClient.put<BlogPost>(`/blogs/${id}`, data),

  deleteBlog: async (id: number): Promise<void> =>
    apiClient.delete<void>(`/blogs/${id}`),

  toggleLike: async (id: number): Promise<void> =>
    apiClient.post<void>(`/blogs/${id}/like`),

  addComment: async (blogId: number, content: string): Promise<Comment> =>
    apiClient.post<Comment>(`/blogs/${blogId}/comments`, { content }),

  updateComment: async (commentId: number, content: string): Promise<Comment> =>
    apiClient.put<Comment>(`/blogs/comments/${commentId}`, { content }),

  deleteComment: async (commentId: number): Promise<void> =>
    apiClient.delete<void>(`/blogs/comments/${commentId}`),
};
