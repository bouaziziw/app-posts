import React, { useState } from 'react';
import { Post } from '../types/Post';
import { useDeletePostMutation, useLikePostMutation, useDislikePostMutation } from '../hooks/usePostsQuery';
import { useSelector } from 'react-redux';
import { RootState } from '../store';
import UpdatePost from './UpdatePost';
import Spinner from './Spinner';

interface PostCardProps {
  post: Post;
}

const PostCard: React.FC<PostCardProps> = ({ post }) => {
  const [showUpdateModal, setShowUpdateModal] = useState(false);
  const deletePostMutation = useDeletePostMutation();
  const likePostMutation = useLikePostMutation();
  const dislikePostMutation = useDislikePostMutation();
  const user = useSelector((state: RootState) => state.auth.user);

  // Safe check for liked status
  const isLiked = user && post.likers && Array.isArray(post.likers) 
    ? post.likers.some(liker => {
        if (typeof liker === 'string') return liker === user.id;
        return (liker as any)._id === user.id || (liker as any).id === user.id;
      })
    : false;

  // Safe check for edit permission
  const getAuthorId = () => {
    if (!post.author) return null;
    if (typeof post.author === 'string') return post.author;
    return (post.author as any)._id || (post.author as any).id;
  };

  const canEdit = user && getAuthorId() === user.id;

  const getAuthorName = () => {
    if (!post.author) return 'Unknown';
    if (typeof post.author === 'string') return post.author;
    return (post.author as any).username || 'Unknown';
  };

  const getLikersCount = () => {
    return Array.isArray(post.likers) ? post.likers.length : 0;
  };

  const handleDelete = () => {
    if (confirm('Are you sure you want to delete this post?')) {
      deletePostMutation.mutate(post._id);
    }
  };

  const handleLike = () => {
    if (isLiked) {
      dislikePostMutation.mutate(post._id);
    } else {
      likePostMutation.mutate(post._id);
    }
  };

  return (
    <>
      <div className="bg-white rounded-lg shadow-lg p-6 border border-gray-200 hover:shadow-xl transition duration-200">
        <div className="flex justify-between items-start mb-4">
          <div>
            <div className="flex items-center gap-3 mb-1">
              <h3 className="text-xl font-bold text-gray-800">{post.title || 'Untitled'}</h3>
              {post.category && (
                <span className="bg-blue-100 text-blue-800 text-xs font-semibold px-2.5 py-0.5 rounded">
                  {post.category}
                </span>
              )}
            </div>
            <p className="text-sm text-gray-500 mb-2">
              By {getAuthorName()} on {new Date(post.createdAt || '').toLocaleDateString()}
            </p>
          </div>
          {canEdit && (
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
                className="flex items-center gap-2 bg-red-500 hover:bg-red-600 text-white font-semibold py-1 px-3 rounded transition duration-200 disabled:opacity-50"
              >
                {deletePostMutation.isPending ? (
                  <>
                    <Spinner size="sm" />
                    <span>Deleting...</span>
                  </>
                ) : (
                  'Delete'
                )}
              </button>
            </div>
          )}
        </div>

        <p className="text-gray-700 mb-4 whitespace-pre-wrap">{post.message}</p>

        {post.tags && post.tags.length > 0 && (
          <div className="flex flex-wrap gap-2 mb-4">
            {post.tags.map((tag, index) => (
              <span key={index} className="bg-gray-100 text-gray-600 text-xs px-2 py-1 rounded-full border border-gray-200">
                #{tag}
              </span>
            ))}
          </div>
        )}

        <div className="flex items-center gap-4 pt-4 border-t border-gray-200">
          <button
            onClick={handleLike}
            disabled={!user || likePostMutation.isPending || dislikePostMutation.isPending}
            className={`flex items-center gap-2 font-semibold py-2 px-4 rounded transition duration-200 ${
              isLiked
                ? 'bg-red-500 hover:bg-red-600 text-white'
                : 'bg-gray-200 hover:bg-gray-300 text-gray-800'
            } disabled:opacity-50`}
          >
            {likePostMutation.isPending || dislikePostMutation.isPending ? (
              <Spinner size="sm" />
            ) : (
              <span>{isLiked ? '❤️' : '🤍'}</span>
            )}
            <span>{getLikersCount()} {getLikersCount() === 1 ? 'Like' : 'Likes'}</span>
          </button>
        </div>
      </div>

      {showUpdateModal && <UpdatePost post={post} onClose={() => setShowUpdateModal(false)} />}
    </>
  );
};

export default PostCard;
