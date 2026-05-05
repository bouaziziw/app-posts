const mongoose = require('mongoose');
const PostModel = require('../models/post.model');
const User = require('../models/user.model');

// ─── Create Post ──────────────────────────────────────────────────────────────
const createPost = async (req, res) => {
  try {
    const { title, category, tags, message } = req.body;
    if (!title || !category || !message) {
      return res.status(400).json({ error: 'Title, category, and message are required' });
    }

    const post = await new PostModel({ 
      title, 
      category, 
      tags: tags || [], 
      message, 
      author: req.user._id 
    }).save();
    await post.populate('author', 'username');

    return res.status(201).json(post);
  } catch (error) {
    console.error('Error creating post:', error.message);
    return res.status(500).json({ error: 'Failed to create post' });
  }
};

// ─── Get All Posts ────────────────────────────────────────────────────────────
const getPosts = async (req, res) => {
  try {
    const posts = await PostModel.find().lean().exec();

    // Collect all unique user IDs referenced in posts
    const authorIds = posts
      .map((p) => p.author)
      .filter((id) => mongoose.isValidObjectId(id))
      .map(String);

    const likerIds = posts
      .flatMap((p) => (Array.isArray(p.likers) ? p.likers : []))
      .filter((id) => mongoose.isValidObjectId(id))
      .map(String);

    const uniqueIds = [...new Set([...authorIds, ...likerIds])];
    const users = await User.find({ _id: { $in: uniqueIds } }, 'username').lean();
    const userMap = Object.fromEntries(users.map((u) => [u._id.toString(), u]));

    const populatedPosts = posts.map((post) => {
      if (mongoose.isValidObjectId(post.author)) {
        post.author = userMap[String(post.author)] ?? post.author;
      }
      if (Array.isArray(post.likers)) {
        post.likers = post.likers.map((id) =>
          mongoose.isValidObjectId(id) ? (userMap[String(id)] ?? id) : id
        );
      }
      return post;
    });

    return res.status(200).json(populatedPosts);
  } catch (error) {
    console.error('Error fetching posts:', error.message);
    return res.status(500).json({ error: 'Failed to fetch posts' });
  }
};

// ─── Update Post ──────────────────────────────────────────────────────────────
const updatePost = async (req, res) => {
  try {
    const { id } = req.params;
    const { title, category, tags, message } = req.body;

    if (!title || !category || !message) {
      return res.status(400).json({ error: 'Title, category, and message are required' });
    }

    const post = await PostModel.findById(id);
    if (!post) {
      return res.status(404).json({ error: 'Post not found' });
    }
    if (post.author.toString() !== req.user._id.toString()) {
      return res.status(403).json({ error: 'Not authorized to update this post' });
    }

    const updated = await PostModel.findByIdAndUpdate(
      id,
      { title, category, tags: tags || [], message },
      { returnDocument: 'after' }
    )
      .populate('author', 'username')
      .populate('likers', 'username');

    return res.status(200).json(updated);
  } catch (error) {
    console.error('Error updating post:', error.message);
    return res.status(500).json({ error: 'Failed to update post' });
  }
};

// ─── Delete Post ──────────────────────────────────────────────────────────────
const deletePost = async (req, res) => {
  try {
    const { id } = req.params;

    const post = await PostModel.findById(id);
    if (!post) {
      return res.status(404).json({ error: 'Post not found' });
    }
    if (post.author.toString() !== req.user._id.toString()) {
      return res.status(403).json({ error: 'Not authorized to delete this post' });
    }

    await PostModel.findByIdAndDelete(id);
    return res.status(200).json({ message: 'Post deleted successfully' });
  } catch (error) {
    console.error('Error deleting post:', error.message);
    return res.status(500).json({ error: 'Failed to delete post' });
  }
};

// ─── Like Post ────────────────────────────────────────────────────────────────
const likePost = async (req, res) => {
  try {
    const { id } = req.params;
    const userId = req.user._id;

    const post = await PostModel.findById(id);
    if (!post) {
      return res.status(404).json({ error: 'Post not found' });
    }

    const alreadyLiked = (post.likers ?? []).some((liker) => liker.equals(userId));
    if (alreadyLiked) {
      return res.status(400).json({ error: 'You have already liked this post' });
    }

    const updated = await PostModel.findByIdAndUpdate(
      id,
      { $push: { likers: userId } },
      { returnDocument: 'after' }
    )
      .populate('author', 'username')
      .populate('likers', 'username');

    return res.status(200).json({ message: 'Post liked successfully', post: updated });
  } catch (error) {
    console.error('Error liking post:', error.message);
    return res.status(500).json({ error: 'Failed to like post' });
  }
};

// ─── Dislike Post ─────────────────────────────────────────────────────────────
const dislikePost = async (req, res) => {
  try {
    const { id } = req.params;
    const userId = req.user._id;

    const post = await PostModel.findById(id);
    if (!post) {
      return res.status(404).json({ error: 'Post not found' });
    }

    const hasLiked = (post.likers ?? []).some((liker) => liker.equals(userId));
    if (!hasLiked) {
      return res.status(400).json({ error: 'You have not liked this post' });
    }

    const updated = await PostModel.findByIdAndUpdate(
      id,
      { $pull: { likers: userId } },
      { returnDocument: 'after' }
    )
      .populate('author', 'username')
      .populate('likers', 'username');

    return res.status(200).json({ message: 'Post disliked successfully', post: updated });
  } catch (error) {
    console.error('Error disliking post:', error.message);
    return res.status(500).json({ error: 'Failed to dislike post' });
  }
};

module.exports = { createPost, getPosts, updatePost, deletePost, likePost, dislikePost };