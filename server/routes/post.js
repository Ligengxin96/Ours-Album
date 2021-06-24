import express from 'express';

import { getPosts, createPost, updatePost, likePost, deletePost } from '../controllers/post.js';

const router = express.Router();

router.get('/', getPosts);
router.post('/', createPost);
router.patch('/:id', updatePost);
router.patch('/likepost/:id', likePost);
router.delete('/:id', deletePost);

export default router;