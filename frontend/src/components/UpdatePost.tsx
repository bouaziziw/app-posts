import React, { useState } from 'react';
import { useForm } from 'react-hook-form';
import { useUpdatePostMutation } from '../hooks/usePostsQuery';
import { Post, UpdatePostPayload } from '../types/Post';

interface UpdatePostProps {
  post: Post;
  onClose: () => void;
}

const UpdatePost: React.FC<UpdatePostProps> = ({ post, onClose }) => {
  const { register, handleSubmit, formState: { errors } } = useForm<UpdatePostPayload>({
    defaultValues: {
      message: post.message,
      author: post.author,
    },
  });
  const updatePostMutation = useUpdatePostMutation();

  const onSubmit = async (data: UpdatePostPayload) => {
    await updatePostMutation.mutateAsync({ id: post._id, payload: data });
    onClose();
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
      <div className="bg-white p-8 rounded-lg shadow-2xl max-w-md w-full mx-4">
        <h2 className="text-2xl font-bold mb-6">Update Post</h2>

        <form onSubmit={handleSubmit(onSubmit)}>
          <div className="mb-4">
            <label className="block text-gray-700 font-semibold mb-2">Author</label>
            <input
              type="text"
              {...register('author')}
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
            {errors.author && (
              <span className="text-red-500 text-sm mt-1">{errors.author.message}</span>
            )}
          </div>

          <div className="mb-6">
            <label className="block text-gray-700 font-semibold mb-2">Message</label>
            <textarea
              rows={4}
              {...register('message')}
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
            {errors.message && (
              <span className="text-red-500 text-sm mt-1">{errors.message.message}</span>
            )}
          </div>

          <div className="flex gap-3">
            <button
              type="button"
              onClick={onClose}
              className="flex-1 bg-gray-300 hover:bg-gray-400 text-gray-800 font-bold py-2 px-4 rounded-lg transition duration-200"
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={updatePostMutation.isPending}
              className="flex-1 bg-blue-600 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded-lg transition duration-200 disabled:opacity-50"
            >
              {updatePostMutation.isPending ? 'Updating...' : 'Update'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default UpdatePost;
