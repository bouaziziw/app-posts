import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { postAPI } from '../services/api';
import { CreatePostPayload, UpdatePostPayload } from '../types/Post';
import toast from 'react-hot-toast';

export const usePostsQuery = () => {
  return useQuery({
    queryKey: ['posts'],
    queryFn: () => postAPI.getPosts(),
    staleTime: 5 * 60 * 1000, // 5 minutes
  });
};

export const useCreatePostMutation = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (payload: CreatePostPayload) => postAPI.createPost(payload),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['posts'] });
      toast.success('Post created successfully!');
    },
    onError: (error: any) => {
      toast.error(error?.response?.data?.error || 'Failed to create post');
    },
  });
};

export const useUpdatePostMutation = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({ id, payload }: { id: string; payload: UpdatePostPayload }) =>
      postAPI.updatePost(id, payload),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['posts'] });
      toast.success('Post updated successfully!');
    },
    onError: (error: any) => {
      toast.error(error?.response?.data?.error || 'Failed to update post');
    },
  });
};

export const useDeletePostMutation = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (id: string) => postAPI.deletePost(id),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['posts'] });
      toast.success('Post deleted successfully!');
    },
    onError: (error: any) => {
      toast.error(error?.response?.data?.error || 'Failed to delete post');
    },
  });
};

export const useLikePostMutation = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (id: string) => postAPI.likePost(id),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['posts'] });
      toast.success('Post liked!');
    },
    onError: (error: any) => {
      toast.error(error?.response?.data?.error || 'Failed to like post');
    },
  });
};

export const useDislikePostMutation = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (id: string) => postAPI.dislikePost(id),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['posts'] });
      toast.success('Post disliked!');
    },
    onError: (error: any) => {
      toast.error(error?.response?.data?.error || 'Failed to dislike post');
    },
  });
};
