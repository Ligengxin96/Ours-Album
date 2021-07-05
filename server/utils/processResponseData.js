import { NONE } from '../config/errorCode.js';
import errorMessages from '../config/errorMessage.js';
import SUCCESS_HTTP_CODE from '../config/successHttpCode.js';

export const processResponseData = (httpCode, data = [], errorCode = NONE, additionalMessage = '', pagination) => {
  let message = errorMessages[httpCode] || '';
  if (SUCCESS_HTTP_CODE.includes(httpCode)) {
      message = additionalMessage ? `${message}. ${additionalMessage}` : message
  } else {
      message = additionalMessage ? `${message}. ${additionalMessage}` : message
  }

  if (Array.isArray(data)) {
    return {
      isSuccess: SUCCESS_HTTP_CODE.includes(httpCode),
      data,
      errorCode,
      message,
      pagination
    };
  }

  return {
    isSuccess: SUCCESS_HTTP_CODE.includes(httpCode),
    data: [data],
    errorCode,
    message,
    pagination
  };
}