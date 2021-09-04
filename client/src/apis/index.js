import axios from 'axios';
import { encodeBase64 } from '../utils/crypto';

const postPrefix = '/Ours-Album/v1/post';
const userPrefix = '/Ours-Album/v1/user';

const baseURL = process.env.NODE_ENV === 'development' ? 'http://localhost:5000' : 'https://ligengxin-server.top';

const API = axios.create({ baseURL });


API.interceptors.request.use((req) => {
  const userInfo = JSON.parse(localStorage.getItem('userInfo'));
  if (userInfo?.token) {
    req.headers.Authorization = `Bearer ${userInfo.token}`;
  }
  return req;
});

API.interceptors.response.use(
  (res) => res,
  (error) => {
    const { response: { status } } = error;
    if (status === 403) {
      const info = encodeBase64(JSON.stringify({ error: 403 }));
      localStorage.removeItem('userInfo');
      window.location = `/login/${info}`;
    }
    return Promise.reject(error);
  }
);

export const fetchPosts = (title, message, tags, currentPage) => API.get(`${postPrefix}/?title=${encodeURIComponent(title)}&message=${encodeURIComponent(message)}&tags=${encodeURIComponent(tags.join(','))}&currentPage=${currentPage}`);

export const fetchPostById = (id) => API.get(`${postPrefix}/${id}`);

export const createPost = (newPost) => API.post(`${postPrefix}`, newPost);

export const updatePost = (id, newPost, currentPage) => API.patch(`${postPrefix}/${id}`, { ...newPost, currentPage });

export const likePost = (id, currentPage) => API.patch(`${postPrefix}/likepost/${id}`, { currentPage });

export const deletePost = (id, currentPage) => API.delete(`${postPrefix}/deletePost/${currentPage}/${id}`);

export const commentPost = (id, comment) => API.post(`${postPrefix}/comment`, { id, comment });

export const login = (formValues) => API.post(`${userPrefix}/login`, formValues);

export const register = (formValues) => API.post(`${userPrefix}/register`, formValues);