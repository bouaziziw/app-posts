import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { postAPI } from '../services/api';
import { Post, CreatePostPayload, UpdatePostPayload, LikePostPayload } from '../types/Post';
import { useDispatch } from 'react-redux';
import { setError, setSuccessMessage } from '../store/uiSlice';

export const usePostsQuery = () => {
  return useQuery({
    queryKey: ['posts'],
    queryFn: () => postAPI.getPosts(),
    staleTime: 5 * 60 * 1000, // 5 minutes
  });
};

export const useCreatePostMutation = () => {
  const queryClient = useQueryClient();
  const dispatch = useDispatch();

  return useMutation({
    mutationFn: (payload: CreatePostPayload) => postAPI.createPost(payload),
    onSuccess: (data) => {
      queryClient.invalidateQueries({ queryKey: ['posts'] });
      dispatch(setSuccessMessage('Post created successfully!'));
    },
    onError: (error: any) => {
      dispatch(setError(error?.response?.data?.error || 'Failed to create post'));
    },
  });
};

export const useUpdatePostMutation = () => {
  const queryClient = useQueryClient();
  const dispatch = useDispatch();

  return useMutation({
    mutationFn: ({ id, payload }: { id: string; payload: UpdatePostPayload }) =>
      postAPI.updatePost(id, payload),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['posts'] });
      dispatch(setSuccessMessage('Post updated successfully!'));
    },
    onError: (error: any) => {
      dispatch(setError(error?.response?.data?.error || 'Failed to update post'));
    },
  });
};

export const useDeletePostMutation = () => {
  const queryClient = useQueryClient();
  const dispatch = useDispatch();

  return useMutation({
    mutationFn: (id: string) => postAPI.deletePost(id),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['posts'] });
      dispatch(setSuccessMessage('Post deleted successfully!'));
    },
    onError: (error: any) => {
      dispatch(setError(error?.response?.data?.error || 'Failed to delete post'));
    },
  });
};

export const useLikePostMutation = () => {
  const queryClient = useQueryClient();
  const dispatch = useDispatch();

  return useMutation({
    mutationFn: ({ id, payload }: { id: string; payload: LikePostPayload }) =>
      postAPI.likePost(id, payload),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['posts'] });
      dispatch(setSuccessMessage('Post liked!'));
    },
    onError: (error: any) => {
      dispatch(setError(error?.response?.data?.error || 'Failed to like post'));
    },
  });
};

export const useDislikePostMutation = () => {
  const queryClient = useQueryClient();
  const dispatch = useDispatch();

  return useMutation({
    mutationFn: ({ id, payload }: { id: string; payload: LikePostPayload }) =>
      postAPI.dislikePost(id, payload),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['posts'] });
      dispatch(setSuccessMessage('Post disliked!'));
    },
    onError: (error: any) => {
      dispatch(setError(error?.response?.data?.error || 'Failed to dislike post'));
    },
  });
};
