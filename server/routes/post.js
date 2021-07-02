import express from 'express';

import authorize from '../middleware/authorize.js';
import { getPosts, createPost, updatePost, likePost, deletePost } from '../controllers/post.js';

const router = express.Router();

router.get('/', getPosts);
router.post('/', authorize, createPost);
router.patch('/:id', authorize, updatePost);
router.patch('/likepost/:id', authorize, likePost);
router.delete('/:id', authorize, deletePost);

export default router;