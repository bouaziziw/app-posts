import React from 'react';
import { useForm } from 'react-hook-form';
import { useUpdatePostMutation } from '../hooks/usePostsQuery';
import { Post, UpdatePostPayload } from '../types/Post';
import { useSelector } from 'react-redux';
import { RootState } from '../store';
import Spinner from './Spinner';

interface UpdatePostProps {
  post: Post;
  onClose: () => void;
}

interface UpdatePostForm {
  title: string;
  category: string;
  tags: string;
  message: string;
}

const UpdatePost: React.FC<UpdatePostProps> = ({ post, onClose }) => {
  const { register, handleSubmit, formState: { errors } } = useForm<UpdatePostForm>({
    defaultValues: {
      title: post.title || '',
      category: post.category || 'General',
      tags: post.tags ? post.tags.join(', ') : '',
      message: post.message,
    },
  });
  const updatePostMutation = useUpdatePostMutation();
  const user = useSelector((state: RootState) => state.auth.user);

  const onSubmit = async (data: UpdatePostForm) => {
    const payload: UpdatePostPayload = {
      title: data.title,
      category: data.category,
      tags: data.tags ? data.tags.split(',').map(t => t.trim()).filter(Boolean) : [],
      message: data.message
    };
    await updatePostMutation.mutateAsync({ id: post._id, payload });
    onClose();
  };

  const getAuthorId = () => {
    if (!post.author) return null;
    if (typeof post.author === 'string') return null; // Can't edit posts with string authors
    return post.author._id || post.author.id;
  };

  if (!user || !post.author || getAuthorId() !== user.id) {
    return null; // Should not render if not authorized
  }

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
      <div className="bg-white p-8 rounded-lg shadow-2xl max-w-md w-full mx-4">
        <h2 className="text-2xl font-bold mb-6">Update Post</h2>

        <form onSubmit={handleSubmit(onSubmit)}>
          <div className="mb-4">
            <label className="block text-gray-700 font-semibold mb-2">Title</label>
            <input
              type="text"
              {...register('title', { required: 'Title is required' })}
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
            {errors.title && (
              <span className="text-red-500 text-sm mt-1">{errors.title.message}</span>
            )}
          </div>

          <div className="mb-4 flex gap-4">
            <div className="w-1/2">
              <label className="block text-gray-700 font-semibold mb-2">Category</label>
              <select
                {...register('category', { required: 'Category is required' })}
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
              >
                <option value="General">General</option>
                <option value="Technology">Technology</option>
                <option value="Lifestyle">Lifestyle</option>
                <option value="News">News</option>
                <option value="Entertainment">Entertainment</option>
              </select>
            </div>
            <div className="w-1/2">
              <label className="block text-gray-700 font-semibold mb-2">Tags</label>
              <input
                type="text"
                {...register('tags')}
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
            </div>
          </div>

          <div className="mb-6">
            <label className="block text-gray-700 font-semibold mb-2">Message</label>
            <textarea
              rows={4}
              {...register('message', { required: 'Message is required' })}
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
              className="flex-1 flex items-center justify-center gap-2 bg-blue-600 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded-lg transition duration-200 disabled:opacity-50"
            >
              {updatePostMutation.isPending ? (
                <>
                  <Spinner size="sm" />
                  <span>Updating...</span>
                </>
              ) : (
                'Update'
              )}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default UpdatePost;
