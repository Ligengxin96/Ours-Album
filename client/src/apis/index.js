import axios from 'axios';
import dotenv from 'dotenv';

dotenv.config();

const url = process.env.ENV = 'dev' ? "http://localhost:5000/v1/post" : "http://ours-album-server.herokuapp.com/v1/post";

export const fetchPosts = () => axios.get(url);

export const createPost = (newPost) => axios.post(url, newPost);

export const updatePost = (id, newPost) => axios.patch(`${url}/${id}`, newPost);

export const likePost = (id) => axios.patch(`${url}/likepost/${id}`);

export const deletePost = (id) => axios.delete(`${url}/${id}`);
