import * as ERROR_CODE from './errorCode';

const errorMap = {
  [ERROR_CODE.SERVER_UNKNOWN_ERROR]: 'something went wrong, please try laster',
  [ERROR_CODE.UNAUTH]: 'user not auth, please login',
  [ERROR_CODE.USER_EXIST]: `user already exist`,
  [ERROR_CODE.USER_NOT_EXIST]: 'user not exist',
  [ERROR_CODE.INCORRECT_USERNAME_OR_PASSWORD]: 'username or password error',
  [ERROR_CODE.POST_EXIST]: 'post already exist',
  [ERROR_CODE.POST_NOT_EXIST]: 'post not exist',
}

export default errorMap;
