import axios from 'axios';
import { Post, CreatePostPayload, UpdatePostPayload, LikePostPayload } from '../types/Post';

const API_BASE_URL = 'http://localhost:5000';

const axiosInstance = axios.create({
  baseURL: API_BASE_URL,
  headers: {
    'Content-Type': 'application/json',
  },
});

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
  likePost: async (id: string, payload: LikePostPayload): Promise<Post> => {
    const response = await axiosInstance.patch<Post>(`/post/like-post/${id}`, payload);
    return response.data;
  },

  // Dislike a post
  dislikePost: async (id: string, payload: LikePostPayload): Promise<Post> => {
    const response = await axiosInstance.patch<Post>(`/post/dislike-post/${id}`, payload);
    return response.data;
  },
};

export default axiosInstance;
