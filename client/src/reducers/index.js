import { combineReducers } from 'redux';

import postsReducer from './posts';
import authorizeReducer  from './authorize';

export const reducers = combineReducers({ 
  posts: postsReducer,
  authorize: authorizeReducer,
});
