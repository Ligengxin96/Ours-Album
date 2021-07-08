import * as apis from '../apis';
import { showError, showSuccess } from '../components/Common/showMessage/showMessage';

import { START_LOADING, END_LOADING, FETCH_ALL, FETCH_ONE, CREATE, UPDATE, DELETE } from '../constants/constantsType.js';

export const getPosts = (title, tags, currentPage) => async (dispatch) => {
  try {
    dispatch({ type: START_LOADING });
    const { data } = await apis.fetchPosts(title, tags, currentPage);
    dispatch({ type: FETCH_ALL, payload: data });
  } catch (error) { 
    if (error.response) {
      showError(error.response.data.errorCode);
    } 
    console.log('Error occurrence when fetch all posts with error:', error.message);
  } finally {
    dispatch({ type: END_LOADING });
  }
}

export const getPostById = (id) => async (dispatch) => {
  try {
    dispatch({ type: START_LOADING });
    const { data } = await apis.fetchPostById(id);
    dispatch({ type: FETCH_ONE, payload: data });
  } catch (error) {     
    if (error.response) {
      showError(error.response.data.errorCode);
    } 
    console.log('Error occurrence when fetch all posts with error:', error.message);
  } finally {
    dispatch({ type: END_LOADING });
  }
}

export const createPost = (newPost) => async (dispatch) => {
  try {
    const { data } = await apis.createPost(newPost);
    dispatch({ type: CREATE, payload: data });
    showSuccess('Create post success');
  } catch (error) {     
    if (error.response) {
      showError(error.response.data.errorCode);
    } 
    console.log('Error occurrence when create post with error:', error.message);
  }
}

export const updatePost = (id, newPost) => async (dispatch) => {
  try {
    const { data } = await apis.updatePost(id, newPost);
    dispatch({ type: UPDATE, payload: data });
    showSuccess('Update post success');
  } catch (error) {     
    if (error.response) {
      showError(error.response.data.errorCode);
    } 
    console.log('Error occurrence when update post with error:', error.message);
  }
}

export const likePost = (id) => async (dispatch) => {
  try {
    const { data } = await apis.likePost(id);
    dispatch({ type: UPDATE, payload: data });
  } catch (error) {     
    if (error.response) {
      showError(error.response.data.errorCode);
    } 
    console.log('Error occurrence when like post with error:', error.message);
  }
}

export const deletePost = (id) => async (dispatch) => {
  try {
    const { data } = await apis.deletePost(id);
    dispatch({ type: DELETE, payload: data });
    showSuccess('Delete post success');
  } catch (error) {     
    if (error.response) {
      showError(error.response.data.errorCode);
    } 
    console.log('Error occurrence when delete post with error:', error.message);
  }
}

export const commentPost = (id, comment) => async (dispatch) => { 
  try {
    const { data } = await apis.commentPost(id, comment);
    dispatch({ type: UPDATE, payload: data });
    return data.data[0].comments;
  } catch (error) {     
    if (error.response) {
      showError(error.response.data.errorCode);
    } 
    console.log('Error occurrence when Comment post with error:', error.message);
  }
}