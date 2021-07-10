import axios from 'axios';
import { encodeBase64 } from '../utils/crypto';

const postPrefix = '/v1/post';
const userPrefix = '/v1/user';

const baseURL = 'https://ligengxin-server.top/Ours-Album';

const API = axios.create({ baseURL });


API.interceptors.request.use((req) => {
  const userInfo = JSON.parse(localStorage.getItem('userInfo'));
  if (userInfo?.token) {
    req.headers.Authorization = `Bearer ${userInfo.token}`;
  }
  return req;
});

API.interceptors.response.use((res) => {
    return res;
  },
  (error) => {
    const { response: { status} } = error;
    if (status === 403) {
      const info = encodeBase64(JSON.stringify({ error: 403 }));
      localStorage.removeItem('userInfo');
      window.location = `/login/${info}`;
    }
    return Promise.reject(error);
  }
);

export const fetchPosts = (title, tags, currentPage) => API.get(`${postPrefix}/?title=${title}&tags=${tags.join(',')}&currentPage=${currentPage}`);

export const fetchPostById = (id) => API.get(`${postPrefix}/${id}`);

export const createPost = (newPost) => API.post(`${postPrefix}`, newPost);

export const updatePost = (id, newPost) => API.patch(`${postPrefix}/${id}`, newPost);

export const likePost = (id) => API.patch(`${postPrefix}/likepost/${id}`);

export const deletePost = (id) => API.delete(`${postPrefix}/${id}`);

export const commentPost = (id, comment) => API.post(`${postPrefix}/comment`, { id, comment });

export const login = (formValues) => API.post(`${userPrefix}/login`, formValues);

export const register = (formValues) => API.post(`${userPrefix}/register`, formValues);