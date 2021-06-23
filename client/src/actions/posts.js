import * as apis from '../apis';

export const getPosts = () => async (dispatch) => {
  try {
    const { data } = await apis.fetchPosts();
    dispatch({ type: 'FETCH_ALL', payload: data.data });
  } catch (error) {
    console.log('Error occurrence when fetch all posts with error:', error.message);
  }
}

export const createPost = (newPost) => async (dispatch) => {
  try {
    const { data } = await apis.createPost(newPost);
    dispatch({ type: 'CREATE', payload: data.data });
  } catch (error) {
    console.log('Error occurrence when create post with error:', error.message);
  }
}

export const updatePost = (id, newPost) => async (dispatch) => {
  try {
    const { data } = await apis.updatePost(id, newPost);
    dispatch({ type: 'UPDATE', payload: data.data });
  } catch (error) {
    console.log('Error occurrence when update post with error:', error.message);
  }
}