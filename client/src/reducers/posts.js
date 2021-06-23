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
    case "DELETE":
      const deletedPost = payload[0];
      return posts.filter((post) => post._id !== deletedPost._id);
    default:
      return posts;
  }
};

export default postsReducer;