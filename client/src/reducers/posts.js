 const initState = { posts: [], isLoading: false };
 
 const postsReducer = (state = initState, action) => {
  const { posts } = state;
  const { payload } = action;
  switch (action.type) {
    case 'START_LOADING':
      return { ...state, isLoading: true };
    case 'END_LOADING':
      return { ...state, isLoading: false };
    case "FETCH_ALL":
      return { ...state, posts: payload };
    case "CREATE":
      return {...state, posts: posts.concat(payload) };
    case "UPDATE":
      const updatedPost = payload[0];
      return { ...state, posts: posts.map((post) => post._id === updatedPost._id ? updatedPost : post) };
    case "DELETE":
      const deletedPost = payload[0];
      return { ...state, posts: posts.filter((post) => post._id !== deletedPost._id) };
    default:
      return state;
  }
};

export default postsReducer;