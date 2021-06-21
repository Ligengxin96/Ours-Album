import axios from 'axios';

const url = "http://localhost:5000/v1/post";

export const fetchPosts = () => axios.get(url);

export const createPost = (newPost) => axios.post(url, newPost);
