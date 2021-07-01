import { combineReducers } from 'redux';

import postsReducer from './posts';
import loginReducer  from './login';

export const reducers = combineReducers({ 
  posts: postsReducer,
  login: loginReducer,
});
