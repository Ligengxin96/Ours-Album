 const postsReducer = (posts = [], action) => {
  const { payload } = action;
  switch (action.type) {
    case "FETCH_ALL":
      return payload;
    case "CREATE":
      return [...posts, ...payload];
    case "UPDATE":
      const updatedPost = payload[0];
      return posts.map((post) => post._id === updatedPost._id ? updatedPost : post);
    default:
      return posts;
  }
};

export default postsReducer;