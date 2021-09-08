import * as apis from '../apis';
import { showError, showSuccess } from '../components/Common/showMessage/showMessage';

import { LOGIN, REGISTER } from '../constants/constantsType.js';


export const login = (formValues, history, path) => async (dispatch) => {
  try {
    const { data } = await apis.login(formValues);
    dispatch({ type: LOGIN, payload: data.userInfo });
    if (path) {
      history.push(path);
    } else {
      history.push('/');
    }
    showSuccess(`Welcome ${data?.userInfo?.name}`);
  } catch (error) {
    if (error.response) {
      showError(error.response.data.errorCode);
    } 
    console.error(`Login failed with error: ${error.message}`);
  }
};

export const register = (formValues, history) => async (dispatch) => {
  try {
    const { data } = await apis.register(formValues);
    dispatch({ type: REGISTER, payload: data.userInfo });
    history.push('/');
    showSuccess(`Welcome ${data?.userInfo?.name}`);
  } catch (error) {
    if (error.response) {
      showError(error.response.data.errorCode);
    } 
    console.error(`Register failed with error: ${error.message}`);
  }
};
