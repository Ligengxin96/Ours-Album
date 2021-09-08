import * as ERROR_CODE from './errorCode';

const errorMap = {
  [ERROR_CODE.SERVER_UNKNOWN_ERROR]: 'Something went wrong, please try laster',
  [ERROR_CODE.UNAUTH]: 'User not auth or auth expired, please login',
  [ERROR_CODE.USER_EXIST]: `User already exist`,
  [ERROR_CODE.USER_NOT_EXIST]: 'User not exist',
  [ERROR_CODE.INCORRECT_USERNAME_OR_PASSWORD]: 'Username or password error',
  [ERROR_CODE.POST_EXIST]: 'Post already exist',
  [ERROR_CODE.POST_NOT_EXIST]: 'Post not exist',
}

export default errorMap;
