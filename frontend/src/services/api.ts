import axios from 'axios';
import { Post, CreatePostPayload, UpdatePostPayload, AuthResponse, LoginPayload, RegisterPayload } from '../types/Post';

const API_BASE_URL = 'http://localhost:5000';

const axiosInstance = axios.create({
  baseURL: API_BASE_URL,
  headers: {
    'Content-Type': 'application/json',
  },
});

// Add token to requests
axiosInstance.interceptors.request.use((config) => {
  const token = localStorage.getItem('token');
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

export const authAPI = {
  register: async (payload: RegisterPayload): Promise<AuthResponse> => {
    const response = await axiosInstance.post<AuthResponse>('/auth/register', payload);
    return response.data;
  },

  login: async (payload: LoginPayload): Promise<AuthResponse> => {
    const response = await axiosInstance.post<AuthResponse>('/auth/login', payload);
    return response.data;
  },

  forgotPassword: async (email: string): Promise<{ message: string }> => {
    const response = await axiosInstance.post<{ message: string }>('/auth/forgot-password', { email });
    return response.data;
  },

  resetPassword: async (token: string, newPassword: string): Promise<{ message: string }> => {
    const response = await axiosInstance.post<{ message: string }>('/auth/reset-password', { token, newPassword });
    return response.data;
  },
};

export const postAPI = {
  // Get all posts
  getPosts: async (): Promise<Post[]> => {
    const response = await axiosInstance.get<Post[]>('/post');
    return response.data;
  },

  // Create a new post
  createPost: async (payload: CreatePostPayload): Promise<Post> => {
    const response = await axiosInstance.post<Post>('/post', payload);
    return response.data;
  },

  // Update a post
  updatePost: async (id: string, payload: UpdatePostPayload): Promise<Post> => {
    const response = await axiosInstance.put<Post>(`/post/${id}`, payload);
    return response.data;
  },

  // Delete a post
  deletePost: async (id: string): Promise<{ message: string }> => {
    const response = await axiosInstance.delete<{ message: string }>(`/post/${id}`);
    return response.data;
  },

  // Like a post
  likePost: async (id: string): Promise<{ message: string; post: Post }> => {
    const response = await axiosInstance.patch<{ message: string; post: Post }>(`/post/like-post/${id}`);
    return response.data;
  },

  // Dislike a post
  dislikePost: async (id: string): Promise<{ message: string; post: Post }> => {
    const response = await axiosInstance.patch<{ message: string; post: Post }>(`/post/dislike-post/${id}`);
    return response.data;
  },
};

export default axiosInstance;
