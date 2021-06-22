 const postsReducer = (posts = [], action) => {
  console.log('post reducer action.payload: ', action.payload);
  console.log('post reducer posts: ', posts);
  switch (action.type) {
    case "FETCH_ALL":
      return action.payload;
    case "CREATE":
      return [...posts, ...action.payload];
    default:
      return posts;
  }
};

export default postsReducer;