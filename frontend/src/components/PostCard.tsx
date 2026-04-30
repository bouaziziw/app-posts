import React, { useState } from 'react';
import { Post } from '../types/Post';
import { useDeletePostMutation, useLikePostMutation, useDislikePostMutation } from '../hooks/usePostsQuery';
import { useSelector } from 'react-redux';
import { RootState } from '../store';
import UpdatePost from './UpdatePost';

interface PostCardProps {
  post: Post;
}

const PostCard: React.FC<PostCardProps> = ({ post }) => {
  const [showUpdateModal, setShowUpdateModal] = useState(false);
  const deletePostMutation = useDeletePostMutation();
  const likePostMutation = useLikePostMutation();
  const dislikePostMutation = useDislikePostMutation();
  const currentUserId = useSelector((state: RootState) => state.ui.currentUserId);
  const isLiked = post.likers.includes(currentUserId);

  const handleDelete = () => {
    if (confirm('Are you sure you want to delete this post?')) {
      deletePostMutation.mutate(post._id);
    }
  };

  const handleLike = () => {
    if (isLiked) {
      dislikePostMutation.mutate({ id: post._id, payload: { userId: currentUserId } });
    } else {
      likePostMutation.mutate({ id: post._id, payload: { userId: currentUserId } });
    }
  };

  return (
    <>
      <div className="bg-white rounded-lg shadow-lg p-6 border border-gray-200 hover:shadow-xl transition duration-200">
        <div className="flex justify-between items-start mb-4">
          <div>
            <h3 className="text-xl font-bold text-gray-800">{post.author}</h3>
            <p className="text-sm text-gray-500">
              {new Date(post.createdAt || '').toLocaleDateString()}
            </p>
          </div>
          <div className="flex gap-2">
            <button
              onClick={() => setShowUpdateModal(true)}
              className="bg-blue-500 hover:bg-blue-600 text-white font-semibold py-1 px-3 rounded transition duration-200"
            >
              Edit
            </button>
            <button
              onClick={handleDelete}
              disabled={deletePostMutation.isPending}
              className="bg-red-500 hover:bg-red-600 text-white font-semibold py-1 px-3 rounded transition duration-200 disabled:opacity-50"
            >
              {deletePostMutation.isPending ? 'Deleting...' : 'Delete'}
            </button>
          </div>
        </div>

        <p className="text-gray-700 mb-4">{post.message}</p>

        <div className="flex items-center gap-4 pt-4 border-t border-gray-200">
          <button
            onClick={handleLike}
            disabled={likePostMutation.isPending || dislikePostMutation.isPending}
            className={`flex items-center gap-2 font-semibold py-2 px-4 rounded transition duration-200 ${
              isLiked
                ? 'bg-red-500 hover:bg-red-600 text-white'
                : 'bg-gray-200 hover:bg-gray-300 text-gray-800'
            } disabled:opacity-50`}
          >
            <span>{isLiked ? '❤️' : '🤍'}</span>
            <span>{post.likers.length} {post.likers.length === 1 ? 'Like' : 'Likes'}</span>
          </button>
        </div>
      </div>

      {showUpdateModal && <UpdatePost post={post} onClose={() => setShowUpdateModal(false)} />}
    </>
  );
};

export default PostCard;
