const express = require('express');
const { getPosts, createPost, updatePost, deletePost, likePost, dislikePost } = require('../controllers/post.controller');
const auth = require('../middleware/auth');
const router = express.Router();

// Sample route for posts
router.get('/', getPosts);

// Additional post-related routes can be added here
router.post('/', auth, createPost);

router.put('/:id', auth, updatePost);

router.delete('/:id', auth, deletePost);

router.patch('/like-post/:id', auth, likePost);

router.patch('/dislike-post/:id', auth, dislikePost);

module.exports = router;