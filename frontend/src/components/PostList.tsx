import React, { useState, useMemo } from 'react';
import PostCard from './PostCard';
import { usePostsQuery } from '../hooks/usePostsQuery';
import Spinner from './Spinner';

const PostList: React.FC = () => {
  const { data: posts, isLoading, error } = usePostsQuery();

  const [searchTerm, setSearchTerm] = useState('');
  const [filterCategory, setFilterCategory] = useState('');
  const [filterTags, setFilterTags] = useState('');

  const filteredPosts = useMemo(() => {
    if (!posts) return [];
    return posts.filter(post => {
      const matchesSearch = 
        !searchTerm || 
        (post.title?.toLowerCase().includes(searchTerm.toLowerCase()) || 
         post.message?.toLowerCase().includes(searchTerm.toLowerCase()));
      
      const matchesCategory = 
        !filterCategory || post.category === filterCategory;

      const searchTags = filterTags.split(',').map(t => t.trim().toLowerCase()).filter(Boolean);
      const matchesTags = 
        searchTags.length === 0 || 
        searchTags.some(tag => post.tags?.map(t => t.toLowerCase()).includes(tag));

      return matchesSearch && matchesCategory && matchesTags;
    });
  }, [posts, searchTerm, filterCategory, filterTags]);

  if (isLoading) {
    return (
      <div className="flex flex-col justify-center items-center h-64 gap-4">
        <Spinner size="lg" color="#3B82F6" />
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
      <div className="mb-6 bg-white p-4 rounded-lg shadow border border-gray-200">
        <h3 className="text-lg font-bold mb-3">Filter Posts</h3>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Search</label>
            <input
              type="text"
              placeholder="Search in title or message..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full px-3 py-2 border border-gray-300 rounded focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Category</label>
            <select
              value={filterCategory}
              onChange={(e) => setFilterCategory(e.target.value)}
              className="w-full px-3 py-2 border border-gray-300 rounded focus:outline-none focus:ring-2 focus:ring-blue-500"
            >
              <option value="">All Categories</option>
              <option value="General">General</option>
              <option value="Technology">Technology</option>
              <option value="Lifestyle">Lifestyle</option>
              <option value="News">News</option>
              <option value="Entertainment">Entertainment</option>
            </select>
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Tags</label>
            <input
              type="text"
              placeholder="Filter by tags (comma separated)..."
              value={filterTags}
              onChange={(e) => setFilterTags(e.target.value)}
              className="w-full px-3 py-2 border border-gray-300 rounded focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
          </div>
        </div>
      </div>

      {!posts || posts.length === 0 ? (
        <div className="text-center py-12">
          <p className="text-gray-500 text-lg">No posts yet. Create one to get started!</p>
        </div>
      ) : filteredPosts.length === 0 ? (
        <div className="text-center py-12">
          <p className="text-gray-500 text-lg">No posts match your filters.</p>
        </div>
      ) : (
        <div className="grid gap-6 md:grid-cols-1 lg:grid-cols-2">
          {filteredPosts.map((post) => (
            <PostCard key={post._id} post={post} />
          ))}
        </div>
      )}
    </>
  );
};

export default PostList;
