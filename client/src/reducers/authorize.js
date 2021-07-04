import { LOGIN, LOGOUT, REGISTER } from '../constants/constantsType.js';
 
const initState = { data: null };

const authorizeReducer = (state = initState, action) => {
 switch (action.type) {
   case LOGIN:
      localStorage.setItem('userInfo', JSON.stringify(action.payload));
      return { data: action.payload };
   case LOGOUT:
      localStorage.removeItem('userInfo');
      return { data: action.payload };
   case REGISTER:
      localStorage.setItem('userInfo', JSON.stringify(action.payload));
      return { data: action.payload };
   default:
      return state;
 }
};

export default authorizeReducer;