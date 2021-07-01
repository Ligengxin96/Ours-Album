import axios from 'axios';

const postPrefix = '/v1/post';
const userPrefix = '/v1/user';

const host = process.env.NODE_ENV === 'development' ? "http://localhost:5000" : "http://ours-album-server.herokuapp.com";

export const fetchPosts = () => axios.get(`${host}${postPrefix}`);

export const createPost = (newPost) => axios.post(`${host}${postPrefix}`, newPost);

export const updatePost = (id, newPost) => axios.patch(`${host}${postPrefix}/${id}`, newPost);

export const likePost = (id) => axios.patch(`${host}${postPrefix}/likepost/${id}`);

export const deletePost = (id) => axios.delete(`${host}${postPrefix}/${id}`);

export const login = (formValues) => axios.post(`${host}${userPrefix}/login`, formValues);

export const register = (formValues) => axios.post(`${host}${userPrefix}/register`, formValues);