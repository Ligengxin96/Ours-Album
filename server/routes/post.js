import express from 'express';

import authorize from '../middleware/authorize.js';
import { getPosts, getPostById, createPost, updatePost, likePost, deletePost, commentPost } from '../controllers/post.js';

const router = express.Router();

router.get('/', getPosts);
router.get('/:id', getPostById);

router.post('/', authorize, createPost);
router.post('/comment', authorize, commentPost);

router.patch('/:id', authorize, updatePost);
router.patch('/likepost/:id', authorize, likePost);

router.delete('/:id', authorize, deletePost);

export default router;