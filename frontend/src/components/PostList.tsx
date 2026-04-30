import React, { useEffect } from 'react';
import PostCard from './PostCard';
import { usePostsQuery } from '../hooks/usePostsQuery';
import { useDispatch, useSelector } from 'react-redux';
import { RootState } from '../store';
import { clearMessages } from '../store/uiSlice';

const PostList: React.FC = () => {
  const { data: posts, isLoading, error } = usePostsQuery();
  const dispatch = useDispatch();
  const { successMessage, error: uiError } = useSelector((state: RootState) => state.ui);

  useEffect(() => {
    if (successMessage || uiError) {
      const timer = setTimeout(() => {
        dispatch(clearMessages());
      }, 3000);
      return () => clearTimeout(timer);
    }
  }, [successMessage, uiError, dispatch]);

  if (isLoading) {
    return (
      <div className="flex justify-center items-center h-64">
        <div className="text-xl text-gray-500">Loading posts...</div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded">
        Failed to load posts: {error instanceof Error ? error.message : 'Unknown error'}
      </div>
    );
  }

  return (
    <>
      {successMessage && (
        <div className="mb-4 bg-green-100 border border-green-400 text-green-700 px-4 py-3 rounded">
          {successMessage}
        </div>
      )}

      {uiError && (
        <div className="mb-4 bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded">
          {uiError}
        </div>
      )}

      {!posts || posts.length === 0 ? (
        <div className="text-center py-12">
          <p className="text-gray-500 text-lg">No posts yet. Create one to get started!</p>
        </div>
      ) : (
        <div className="grid gap-6 md:grid-cols-1 lg:grid-cols-2">
          {posts.map((post) => (
            <PostCard key={post._id} post={post} />
          ))}
        </div>
      )}
    </>
  );
};

export default PostList;
