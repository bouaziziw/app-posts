import React, { useState } from 'react';
import { useForm } from 'react-hook-form';
import { useCreatePostMutation } from '../hooks/usePostsQuery';
import { CreatePostPayload } from '../types/Post';

const CreatePost: React.FC = () => {
  const { register, handleSubmit, reset, formState: { errors } } = useForm<CreatePostPayload>();
  const [showForm, setShowForm] = useState(false);
  const createPostMutation = useCreatePostMutation();

  const onSubmit = async (data: CreatePostPayload) => {
    await createPostMutation.mutateAsync(data);
    reset();
    setShowForm(false);
  };

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
            <label className="block text-gray-700 font-semibold mb-2">Author</label>
            <input
              type="text"
              placeholder="Your name"
              {...register('author', { required: 'Author is required' })}
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
            {errors.author && (
              <span className="text-red-500 text-sm mt-1">{errors.author.message}</span>
            )}
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
            className="w-full bg-green-600 hover:bg-green-700 text-white font-bold py-2 px-4 rounded-lg transition duration-200 disabled:opacity-50"
          >
            {createPostMutation.isPending ? 'Creating...' : 'Create Post'}
          </button>
        </form>
      )}
    </div>
  );
};

export default CreatePost;
