import React, { useState } from 'react';
import { useForm } from 'react-hook-form';
import { useCreatePostMutation } from '../hooks/usePostsQuery';
import { CreatePostPayload } from '../types/Post';
import { useSelector } from 'react-redux';
import { RootState } from '../store';
import Spinner from './Spinner';

interface CreatePostForm {
  title: string;
  category: string;
  tags: string;
  message: string;
}

const CreatePost: React.FC = () => {
  const { register, handleSubmit, reset, formState: { errors } } = useForm<CreatePostForm>({
    defaultValues: {
      category: 'General'
    }
  });
  const [showForm, setShowForm] = useState(false);
  const createPostMutation = useCreatePostMutation();
  const isAuthenticated = useSelector((state: RootState) => state.auth.isAuthenticated);

  const onSubmit = async (data: CreatePostForm) => {
    const payload: CreatePostPayload = {
      title: data.title,
      category: data.category,
      tags: data.tags ? data.tags.split(',').map(t => t.trim()).filter(Boolean) : [],
      message: data.message
    };
    await createPostMutation.mutateAsync(payload);
    reset();
    setShowForm(false);
  };

  if (!isAuthenticated) {
    return (
      <div className="mb-8 p-4 bg-yellow-100 border border-yellow-400 text-yellow-700 rounded">
        Please log in to create posts.
      </div>
    );
  }

  return (
    <div className="mb-8">
      <button
        onClick={() => setShowForm(!showForm)}
        className="bg-blue-600 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded-lg transition duration-200"
      >
        {showForm ? 'Cancel' : 'Create New Post'}
      </button>

      {showForm && (
        <form
          onSubmit={handleSubmit(onSubmit)}
          className="mt-6 bg-white p-6 rounded-lg shadow-lg border border-gray-200"
        >
          <div className="mb-4">
            <label className="block text-gray-700 font-semibold mb-2">Title</label>
            <input
              type="text"
              placeholder="Post title..."
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
              <label className="block text-gray-700 font-semibold mb-2">Tags (comma separated)</label>
              <input
                type="text"
                placeholder="react, tutorial, web..."
                {...register('tags')}
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
            </div>
          </div>

          <div className="mb-6">
            <label className="block text-gray-700 font-semibold mb-2">Message</label>
            <textarea
              placeholder="Write your post here..."
              rows={4}
              {...register('message', { required: 'Message is required' })}
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
            {errors.message && (
              <span className="text-red-500 text-sm mt-1">{errors.message.message}</span>
            )}
          </div>

          <button
            type="submit"
            disabled={createPostMutation.isPending}
            className="w-full flex items-center justify-center gap-2 bg-green-600 hover:bg-green-700 text-white font-bold py-2 px-4 rounded-lg transition duration-200 disabled:opacity-50"
          >
            {createPostMutation.isPending ? (
              <>
                <Spinner size="sm" />
                <span>Creating...</span>
              </>
            ) : (
              'Create Post'
            )}
          </button>
        </form>
      )}
    </div>
  );
};

export default CreatePost;
