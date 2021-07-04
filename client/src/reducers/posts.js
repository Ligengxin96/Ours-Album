 import { START_LOADING, END_LOADING, FETCH_ALL, CREATE, UPDATE, DELETE } from '../constants/constantsType.js';
 
 const initState = { posts: [], pagination: { currentPage: 1 }, isLoading: false };
 
 const postsReducer = (state = initState, action) => {
  const { posts } = state;
  const { data, pagination } = action.payload || {};
  switch (action.type) {
    case START_LOADING:
      return { ...state, isLoading: true };
    case END_LOADING:
      return { ...state, isLoading: false };
    case FETCH_ALL:
      return { ...state, posts: data, pagination };
    case CREATE:
      return {...state, posts: posts.concat(data) };
    case UPDATE:
      const updatedPost = data[0];
      return { ...state, posts: posts.map((post) => post._id === updatedPost._id ? updatedPost : post) };
    case DELETE:
      const deletedPost = data[0];
      return { ...state, posts: posts.filter((post) => post._id !== deletedPost._id) };
    default:
      return state;
  }
};

export default postsReducer;