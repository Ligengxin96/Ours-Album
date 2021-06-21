import * as apis from '../apis';

export const getPosts = () => async (dispatch) => {
  try {
    const { data } = await apis.fetchPosts();
    dispatch({ type: 'FETCH_ALL', payload: data });
  } catch (error) {
    console.log('Error occurrence when FETCH_ALL posts with:', error.message);
  }
}

export const createPost = (createdPost) => async (dispatch) => {
  try {
    const { data } = await apis.createPost(createdPost);
    console.log('data', data);
    dispatch({ type: 'CREATE', payload: data });
  } catch (error) {
    console.log('Error occurrence when CREATE post with:', error.message);
  }
}