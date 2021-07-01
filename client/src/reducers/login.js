import { LOGIN, LOGOUT, REGISTER } from '../constants/constantsType.js';
 
const initState = { data: null };

const loginReducer = (state = initState, action) => {
 switch (action.type) {
   case LOGIN:
      localStorage.setItem('userInfo', JSON.stringify(action.payload));
      return { data: action.payload };
   case LOGOUT:
      localStorage.clear();
      return { data: action.payload };
   case REGISTER:
      return { data: action.payload };
   default:
      return state;
 }
};

export default loginReducer;