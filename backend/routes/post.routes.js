const express = require('express');
const { getPosts, createPost, updatePost, deletePost, likePost, dislikePost } = require('../controllers/post.controller ');
const router = express.Router();

// Sample route for posts
router.get('/', getPosts);

// Additional post-related routes can be added here
router.post('/', createPost);

router.put('/:id', updatePost);

router.delete('/:id', deletePost);

router.patch('/like-post/:id', likePost);

router.patch('/dislike-post/:id', dislikePost);

module.exports = router;