const PostModel = require('../models/post.model');

// Controller function to create a new post
const createPost = async (req, res) => {
    try {
        const { message, author } = req.body;
        const newPost = new PostModel({ message, author });
        await newPost.save();
        res.status(201).json(newPost);
        console.log('Post created successfully:', newPost);
    } catch (error) {
        res.status(500).json({ error: 'Failed to create post' });
    }
};

// Controller function to get all posts
const getPosts = async (req, res) => {
    try {
        const posts = await PostModel.find();
        res.status(200).json(posts);
    } catch (error) {
        res.status(500).json({ error: 'Failed to fetch posts' });
    }
};

// Controller function to update a post
const updatePost = async (req, res) => {
    try {
        const { id } = req.params;
        const { message, author } = req.body;
        const updatedPost = await PostModel.findByIdAndUpdate(id, { message, author }, { returnDocument: 'after' });
        if (!updatedPost) {
            return res.status(404).json({ error: 'Post not found' });
        }
        res.status(200).json(updatedPost);
        console.log('Post updated successfully:', updatedPost);
    } catch (error) {
        res.status(500).json({ error: 'Failed to update post' });
    }
};

// Controller function to delete a post
const deletePost = async (req, res) => {
    try {
        const { id } = req.params;
        const deletedPost = await PostModel.findByIdAndDelete(id);
        if (!deletedPost) {
            return res.status(404).json({ error: 'Post not found' });
        }
        res.status(200).json({ message: 'Post deleted successfully' });
    } catch (error) {
        res.status(500).json({ error: 'Failed to delete post' });
    }
};

// Controller function to like a post
const likePost = async (req, res) => {
    try {
        const { id } = req.params;
        const { userId } = req.body; // Assuming the user ID is sent in the request body
        const post = await PostModel.findById(id);
        if (!post) {
            return res.status(404).json({ error: 'Post not found' });
        }
        if (!post.likers.includes(userId)) {
            const likedPost = await PostModel.findByIdAndUpdate(id, { $push: { likers: userId } }, { returnDocument: 'after' });
            res.status(200).json({ message: 'Post liked successfully', post: likedPost });
        } else {
            res.status(400).json({ error: 'User has already liked this post' });
        }
    } catch (error) {
        res.status(500).json({ error: 'Failed to like post' });
    }
};

const dislikePost = async (req, res) => {
    try {
        const { id } = req.params;
        const { userId } = req.body; // Assuming the user ID is sent in the request body
        const post = await PostModel.findById(id);
        if (!post) {
            return res.status(404).json({ error: 'Post not found' });
        }
        if (post.likers.includes(userId)) {
            const dislikedPost = await PostModel.findByIdAndUpdate(id, { $pull: { likers: userId } }, { returnDocument: 'after' });
            res.status(200).json({ message: 'Post disliked successfully', post: dislikedPost });
        } else {
            res.status(400).json({ error: 'User has not liked this post' });
        }
    } catch (error) {
        res.status(500).json({ error: 'Failed to dislike post' });
    }
};

module.exports = {
    createPost,
    getPosts,
    updatePost,
    deletePost,
    likePost,
    dislikePost
};      